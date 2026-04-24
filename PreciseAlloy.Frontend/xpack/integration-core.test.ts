// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';

import {
  collectAssetHashes,
  copyConfiguredItems,
  getPatternCopyTarget,
  normalizePatternHtml,
  parseIntegrationArgs,
  runIntegrationBuild,
  sortHashes,
  validateExpectedFiles,
} from './integration-core';

const createDependencies = () => ({
  existsSync: vi.fn().mockReturnValue(true),
  statSync: vi.fn().mockReturnValue({ isDirectory: () => true }),
  rmSync: vi.fn(),
  mkdirSync: vi.fn(),
  cpSync: vi.fn(),
  copyFileSync: vi.fn(),
  readFileSync: vi.fn((path: string, encoding?: BufferEncoding) => {
    if (encoding === 'utf-8') {
      return '<script src="react-loader.0xAbcdEF12.js"></script><img src="/icon.svg?v=abc123">';
    }

    return Buffer.from(`content:${path}`);
  }),
  writeFileSync: vi.fn(),
  readdirSync: vi.fn().mockReturnValue(['react-loader.0xAbcdEF12.js', 'main.js']),
  globSync: vi.fn((pattern: string) => {
    if (pattern.includes('**/*.{css,js,svg}')) {
      return ['D:/repo/dist/static/assets/js/main.js', 'D:/repo/dist/static/assets/js/react-loader.0xAbcdEF12.js'];
    }

    if (pattern === './dist/static/{atoms,molecules,organisms,templates,pages}/**/*.*') {
      return ['dist/static/pages/home.html', 'dist/static/pages/home/card/index.html'];
    }

    return ['D:/patterns/pages-home.html'];
  }),
  nodeFsCpSync: vi.fn(),
  log: vi.fn(),
  warn: vi.fn((value: string) => value),
});

describe('xpack/integration-core.ts', () => {
  it('parses integration mode from argv', () => {
    expect(parseIntegrationArgs(['node', 'xpack/integration.ts'])).toEqual({ mode: 'production' });
    expect(parseIntegrationArgs(['node', 'xpack/integration.ts', '--mode', 'eshn'])).toEqual({ mode: 'eshn' });
  });

  it('copies directories by replacing stale destinations and copies files into their parent directories', () => {
    const dependencies = createDependencies();

    dependencies.statSync.mockReturnValueOnce({ isDirectory: () => true }).mockReturnValueOnce({ isDirectory: () => false });
    dependencies.existsSync.mockImplementation((value: string) => {
      return !value.endsWith('dest/hashes.json');
    });

    copyConfiguredItems(
      [{ from: 'js' }, { from: 'hashes.json' }],
      {
        srcBasePath: 'D:/repo/dist/static/assets',
        destBasePath: 'D:/dest',
      },
      dependencies
    );

    expect(dependencies.rmSync).toHaveBeenCalledWith('D:/dest/js', { recursive: true, force: true });
    expect(dependencies.cpSync).toHaveBeenCalledWith('D:/repo/dist/static/assets/js', 'D:/dest/js', { recursive: true, force: true });
    expect(dependencies.copyFileSync).toHaveBeenCalledWith('D:/repo/dist/static/assets/hashes.json', 'D:/dest/hashes.json');
  });

  it('collects hashes for unhashed assets and stores empty values for already-hashed files', () => {
    const dependencies = createDependencies();

    const hashes = collectAssetHashes(
      ['js'],
      {
        staticBasePath: 'D:/repo/dist/static',
        srcBasePath: 'D:/repo/dist/static/assets',
      },
      dependencies
    );

    expect(hashes.get('/assets/js/main.js')).toHaveLength(10);
    expect(hashes.get('/assets/js/react-loader.0xAbcdEF12.js')).toBe('');
  });

  it('sorts hash output by key', () => {
    expect(
      sortHashes(
        new Map([
          ['/b.js', '2'],
          ['/a.js', '1'],
        ])
      )
    ).toEqual({
      '/a.js': '1',
      '/b.js': '2',
    });
  });

  it('maps pattern output names for shallow and nested static files', () => {
    expect(getPatternCopyTarget('D:/patterns', 'dist/static/pages/home.html')).toEqual({
      sourcePath: 'dist/static/pages/home.html',
      targetPath: 'D:\\patterns\\pages-home.html',
      recursive: false,
    });

    expect(getPatternCopyTarget('D:/patterns', 'dist/static/pages/home/card/index.html')).toEqual({
      sourcePath: 'dist/static/pages/home/card/index.html',
      targetPath: 'D:\\patterns\\pages-home-card-index.html',
      recursive: true,
    });
  });

  it('normalizes hashed loader names and strips svg query strings in pattern html', () => {
    expect(normalizePatternHtml('<script src="react-loader.0xAbcdEF12.js"></script><img src="icon.svg?v=abc123">')).toBe(
      '<script src="react-loader.0x00000000.js"></script><img src="icon.svg">'
    );
  });

  it('validates required files for exact names and regex patterns', () => {
    const dependencies = createDependencies();

    expect(
      validateExpectedFiles(
        [{ fileName: 'hashes.json' }, { fileName: /react-loader\.0x[a-z0-9_-]{8,12}\.js/gi, folder: 'js' }],
        'D:/dest',
        dependencies
      )
    ).toEqual({
      isValid: true,
      missing: [],
    });

    dependencies.existsSync.mockReturnValue(false);
    dependencies.readdirSync.mockReturnValue([]);

    const result = validateExpectedFiles(
      [{ fileName: 'hashes.json' }, { fileName: /react-loader\.0x[a-z0-9_-]{8,12}\.js/gi, folder: 'js' }],
      'D:/dest',
      dependencies
    );

    expect(result.isValid).toBe(false);
    expect(result.missing).toEqual(['D:/dest/hashes.json', expect.stringContaining('D:/dest/js/react-loader')]);
  });

  it('runs the full integration build and returns validation status without exiting the process', () => {
    const dependencies = createDependencies();

    const result = runIntegrationBuild(
      {
        argv: ['node', 'xpack/integration.ts'],
        staticBasePath: 'D:/repo/dist/static',
        srcBasePath: 'D:/repo/dist/static/assets',
        destBasePath: 'D:/dest',
        patternPath: 'D:/patterns',
        copyItems: [{ from: 'js' }, { from: 'pages', to: 'D:/patterns' }],
        hashItems: ['js'],
        checkExistFileList: [{ fileName: 'hashes.json' }, { fileName: 'main.js', folder: 'js' }],
      },
      dependencies
    );

    expect(result).toEqual({ isValid: true, missing: [] });
    expect(dependencies.writeFileSync).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/[\\/]dest[\\/]hashes\.json$/),
      expect.stringContaining('/assets/js/main.js')
    );
    expect(dependencies.copyFileSync).toHaveBeenCalledWith('dist/static/pages/home.html', 'D:\\patterns\\pages-home.html');
    expect(dependencies.nodeFsCpSync).toHaveBeenCalledWith('dist/static/pages/home/card/index.html', 'D:\\patterns\\pages-home-card-index.html', {
      recursive: true,
    });
  });
});
