// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';

import {
  collectAssetHashes,
  copyConfiguredItems,
  copyPatternArtifacts,
  getPatternCopyTarget,
  normalizeGeneratedTextFiles,
  normalizePatternHtml,
  parseIntegrationArgs,
  runIntegrationBuild,
  sortHashes,
  validateExpectedFiles,
} from './integration-core';
import { hashFileContent } from './prerender-core';

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

  it('skips copy items whose source path does not exist', () => {
    const dependencies = createDependencies();

    dependencies.existsSync.mockReturnValue(false);

    copyConfiguredItems(
      [{ from: 'js' }],
      {
        srcBasePath: 'D:/repo/dist/static/assets',
        destBasePath: 'D:/dest',
      },
      dependencies
    );

    expect(dependencies.log).not.toHaveBeenCalled();
    expect(dependencies.cpSync).not.toHaveBeenCalled();
    expect(dependencies.copyFileSync).not.toHaveBeenCalled();
    expect(dependencies.mkdirSync).not.toHaveBeenCalled();
  });

  it('creates the destination directory before copying a file when it does not exist', () => {
    const dependencies = createDependencies();

    dependencies.statSync.mockReturnValue({ isDirectory: () => false });
    dependencies.existsSync.mockImplementation((value: string) => {
      // Source exists, but the destination's parent directory does not.
      return !value.endsWith('D:/dest/nested');
    });

    copyConfiguredItems(
      [{ from: 'nested/hashes.json' }],
      {
        srcBasePath: 'D:/repo/dist/static/assets',
        destBasePath: 'D:/dest',
      },
      dependencies
    );

    expect(dependencies.mkdirSync).toHaveBeenCalledWith('D:/dest/nested');
    expect(dependencies.copyFileSync).toHaveBeenCalledWith('D:/repo/dist/static/assets/nested/hashes.json', 'D:/dest/nested/hashes.json');
  });

  it('creates the destination directory before copying a directory when it does not exist', () => {
    const dependencies = createDependencies();

    dependencies.statSync.mockReturnValue({ isDirectory: () => true });
    dependencies.existsSync.mockImplementation((value: string) => {
      // Source exists, but destination directory does not yet.
      return !value.endsWith('D:/dest/js');
    });

    copyConfiguredItems(
      [{ from: 'js' }],
      {
        srcBasePath: 'D:/repo/dist/static/assets',
        destBasePath: 'D:/dest',
      },
      dependencies
    );

    // rmSync only runs when the destination already exists; this branch must skip it.
    expect(dependencies.rmSync).not.toHaveBeenCalled();
    expect(dependencies.mkdirSync).toHaveBeenCalledWith('D:/dest/js', { recursive: true });
    expect(dependencies.cpSync).toHaveBeenCalledWith('D:/repo/dist/static/assets/js', 'D:/dest/js', { recursive: true, force: true });
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

  it('collects text asset hashes from LF-normalized bytes', () => {
    const dependencies = createDependencies();

    dependencies.globSync.mockReturnValue(['D:/repo/dist/static/assets/images/icon.svg']);
    dependencies.readFileSync.mockReturnValue(Buffer.from('<svg>\r\n</svg>\r\n'));

    const hashes = collectAssetHashes(
      ['images'],
      {
        staticBasePath: 'D:/repo/dist/static',
        srcBasePath: 'D:/repo/dist/static/assets',
      },
      dependencies
    );

    expect(hashes.get('/assets/images/icon.svg')).toBe(hashFileContent('<svg>\n</svg>\n'));
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
      targetPath: 'D:/patterns/pages-home.html',
      recursive: false,
    });

    expect(getPatternCopyTarget('D:/patterns', 'dist/static/pages/home/card/index.html')).toEqual({
      sourcePath: 'dist/static/pages/home/card/index.html',
      targetPath: 'D:/patterns/pages-home-card-index.html',
      recursive: true,
    });

    // Paths with fewer than four segments are not categorised as patterns and
    // are skipped to avoid producing an ambiguous output name.
    expect(getPatternCopyTarget('D:/patterns', 'dist/static/readme.txt')).toBeUndefined();
  });

  it('normalizes hashed loader names and strips svg query strings in pattern html', () => {
    expect(normalizePatternHtml('<script src="react-loader.0xAbcdEF12.js"></script><img src="icon.svg?v=abc123">')).toBe(
      '<script src="react-loader.0x00000000.js"></script><img src="icon.svg">'
    );
  });

  it('normalizes pattern HTML line endings to LF', () => {
    expect(normalizePatternHtml('<footer></footer>\r\n<script src="/assets/js/pl-states.js"></script>\r\n')).toBe(
      '<footer></footer>\n<script src="/assets/js/pl-states.js"></script>\n'
    );
  });

  it('collapses the platform-specific blank line before the pl-states script in pattern HTML', () => {
    expect(normalizePatternHtml('</footer>\r\n\r\n  <script type="module"\r\n    defer=""\r\n    src="/assets/js/pl-states.js"></script>')).toBe(
      '</footer>\n  <script type="module"\n    defer=""\n    src="/assets/js/pl-states.js"></script>'
    );
  });

  it('rewrites copied generated text files with LF line endings', () => {
    const dependencies = createDependencies();
    const binary = Buffer.from([0, 1, 2, 3]);

    dependencies.globSync.mockReturnValue(['D:/dest/assets/images/icon.svg', 'D:/dest/assets/custom/template', 'D:/dest/assets/images/photo.bin']);
    dependencies.readFileSync.mockImplementation(((file: string) => {
      if (file.endsWith('.svg')) {
        return Buffer.from('<svg>\r\n</svg>\r\n');
      }

      if (file.endsWith('template')) {
        return Buffer.from('custom\r\n');
      }

      return binary;
    }) as never);

    normalizeGeneratedTextFiles('D:/dest', dependencies);

    expect(dependencies.globSync).toHaveBeenCalledWith('D:/dest/**/*', { nodir: true });
    expect(dependencies.writeFileSync).toHaveBeenCalledWith('D:/dest/assets/images/icon.svg', '<svg>\n</svg>\n');
    expect(dependencies.writeFileSync).toHaveBeenCalledWith('D:/dest/assets/custom/template', 'custom\n');
    expect(dependencies.writeFileSync).toHaveBeenCalledTimes(2);
  });

  it('rewrites copied source maps whose sourcesContent contains CRLF escapes', () => {
    const dependencies = createDependencies();

    dependencies.globSync.mockReturnValue(['D:/dest/assets/js/main.js.map']);
    dependencies.readFileSync.mockReturnValue(Buffer.from('{"version":3,"sourcesContent":["a\\r\\nb"],"mappings":""}\r\n'));

    normalizeGeneratedTextFiles('D:/dest', dependencies);

    expect(dependencies.writeFileSync).toHaveBeenCalledWith(
      'D:/dest/assets/js/main.js.map',
      '{"version":3,"sourcesContent":["a\\nb"],"mappings":""}'
    );
  });

  it('skips writing pattern files whose normalized HTML is identical to the source', async () => {
    const { normalizePatternFiles } = await import('./integration-core');
    const dependencies = createDependencies();

    dependencies.globSync.mockReturnValue(['D:/patterns/page.html']);
    dependencies.readFileSync.mockReturnValue('<p>nothing to normalize</p>' as never);

    normalizePatternFiles('D:/patterns', dependencies);

    expect(dependencies.writeFileSync).not.toHaveBeenCalled();
  });

  it('writes normalized pattern HTML when the loader hash or svg query needs rewriting', async () => {
    const { normalizePatternFiles } = await import('./integration-core');
    const dependencies = createDependencies();

    dependencies.globSync.mockReturnValue(['D:/patterns/page.html']);
    // readFileSync from createDependencies returns content with both hashed loader and ?v= query when encoding is 'utf-8'.

    normalizePatternFiles('D:/patterns', dependencies);

    expect(dependencies.writeFileSync).toHaveBeenCalledWith(
      'D:/patterns/page.html',
      '<script src="react-loader.0x00000000.js"></script><img src="/icon.svg">'
    );
  });

  it('reads pattern HTML provided as a Buffer and normalizes it before writing', async () => {
    const { normalizePatternFiles } = await import('./integration-core');
    const dependencies = createDependencies();

    dependencies.globSync.mockReturnValue(['D:/patterns/page.html']);
    dependencies.readFileSync.mockReturnValue(Buffer.from('<script src="react-loader.0xAbcdEF12.js"></script>'));

    normalizePatternFiles('D:/patterns', dependencies);

    expect(dependencies.writeFileSync).toHaveBeenCalledWith('D:/patterns/page.html', '<script src="react-loader.0x00000000.js"></script>');
  });

  it('skips pattern sources whose path cannot be mapped to a target name', () => {
    // copyPatternArtifacts must defensively skip entries that getPatternCopyTarget
    // rejects (e.g. files with fewer than four path segments) instead of crashing.
    const dependencies = createDependencies();

    dependencies.globSync.mockReturnValue(['dist/static/readme.txt']);

    copyPatternArtifacts('D:/patterns', dependencies);

    expect(dependencies.copyFileSync).not.toHaveBeenCalled();
    expect(dependencies.nodeFsCpSync).not.toHaveBeenCalled();
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

  it('validates regex patterns at the destination root when no folder is provided', () => {
    const dependencies = createDependencies();

    // Regex pattern with no folder must look in the destBasePath itself,
    // exercising the `file.folder ?? ''` fallback for the regex branch.
    expect(validateExpectedFiles([{ fileName: /react-loader\.0x[a-z0-9_-]{8,12}\.js/gi }], 'D:/dest', dependencies)).toEqual({
      isValid: true,
      missing: [],
    });
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
    expect(dependencies.copyFileSync).toHaveBeenCalledWith('dist/static/pages/home.html', 'D:/patterns/pages-home.html');
    expect(dependencies.nodeFsCpSync).toHaveBeenCalledWith('dist/static/pages/home/card/index.html', 'D:/patterns/pages-home-card-index.html', {
      recursive: true,
    });
  });

  it('runs integration build without pattern handling when no patternPath is configured', () => {
    const dependencies = createDependencies();

    const result = runIntegrationBuild(
      {
        argv: ['node', 'xpack/integration.ts'],
        staticBasePath: 'D:/repo/dist/static',
        srcBasePath: 'D:/repo/dist/static/assets',
        destBasePath: 'D:/dest',
        copyItems: [],
        hashItems: [],
        checkExistFileList: [],
      },
      dependencies
    );

    expect(result).toEqual({ isValid: true, missing: [] });
    // No patternPath means no pattern artifact copy or normalization runs.
    expect(dependencies.nodeFsCpSync).not.toHaveBeenCalled();
    expect(dependencies.rmSync).not.toHaveBeenCalled();
  });

  it('runs integration build skipping pattern cleanup when the configured patternPath does not exist', () => {
    const dependencies = createDependencies();

    dependencies.existsSync.mockImplementation((value: string) => {
      // patternPath itself does not yet exist, so the cleanup branch is skipped.
      return value !== 'D:/patterns';
    });

    const result = runIntegrationBuild(
      {
        argv: ['node', 'xpack/integration.ts'],
        staticBasePath: 'D:/repo/dist/static',
        srcBasePath: 'D:/repo/dist/static/assets',
        destBasePath: 'D:/dest',
        patternPath: 'D:/patterns',
        copyItems: [],
        hashItems: [],
        checkExistFileList: [],
      },
      dependencies
    );

    expect(result.isValid).toBe(true);
    // Cleanup rmSync should not run because the pattern path was missing.
    expect(dependencies.rmSync).not.toHaveBeenCalled();
    // But the pattern artifact mkdir/copy still proceeds since patternPath is set.
    expect(dependencies.mkdirSync).toHaveBeenCalledWith('D:/patterns', { recursive: true });
  });
});
