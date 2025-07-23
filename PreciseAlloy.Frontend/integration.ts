/* eslint-disable no-console */
import fs from 'fs';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'node:crypto';
import nodeFs from 'node:fs';

import slash from 'slash';
import { glob } from 'glob';
import { loadEnv } from 'vite';
import chalk from 'chalk';

interface CopyItem {
  from: string;
  to?: string;
}

interface FileExistCheck {
  folder?: string;
  fileName: string | RegExp;
}

const argvModeIndex = process.argv.indexOf('--mode');
const mode =
  argvModeIndex >= 0 && argvModeIndex < process.argv.length - 1 && !process.argv[argvModeIndex + 1].startsWith('-')
    ? process.argv[argvModeIndex + 1]
    : 'production';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const xpackEnv = loadEnv(mode, __dirname);
const toAbsolute = (p: string) => slash(path.resolve(__dirname, p));
const log = console.log.bind(console);

const hashes: Map<string, string> = new Map();
const staticBasePath = toAbsolute('dist/static');
const srcBasePath = toAbsolute('dist/static/assets');
const destBasePath = toAbsolute(xpackEnv.VITE_INTE_ASSET_DIR);
const patternPath = xpackEnv.VITE_INTE_PATTERN_DIR ? toAbsolute(xpackEnv.VITE_INTE_PATTERN_DIR) : undefined;

if (patternPath && fs.existsSync(patternPath)) {
  fs.rmSync(patternPath, { recursive: true, force: true });

  fs.mkdirSync(patternPath, { recursive: true });
}

const copyItems: CopyItem[] = [
  { from: 'css' },
  { from: 'fonts' },
  { from: 'images' },
  { from: 'js' },
  { from: 'vendors' },
  { from: 'hashes.json' },
  { from: 'pages', to: patternPath },
];
const hashItems: string[] = ['css', 'images', 'js'];

copyItems.forEach((item) => {
  const srcPath = slash(path.join(srcBasePath, item.from));
  const destPath = slash(item.to ?? path.join(destBasePath, item.from));

  if (!fs.existsSync(srcPath)) {
    return;
  }

  log(`Copy file ${srcPath} to ${destPath}`);

  if (fs.statSync(srcPath).isDirectory()) {
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true });
    }

    fs.mkdirSync(destPath, { recursive: true });

    fs.cpSync(srcPath, destPath, { recursive: true, force: true });
  } else {
    const destDirPath = path.dirname(destPath);

    if (!fs.existsSync(destDirPath)) {
      fs.mkdirSync(destDirPath);
    }

    fs.copyFileSync(srcPath, destPath);
  }
});

hashItems.forEach((item) => {
  const srcPath = slash(path.join(srcBasePath, item));
  const files = glob.sync(srcPath + '/**/*.{css,js,svg}');

  files.forEach((file) => {
    const relativePath = slash(file.substring(staticBasePath.length));

    if (!/\.0x[a-z0-9_-]{8,12}\.\w+$/gi.test(file)) {
      const content = fs.readFileSync(file);
      const sha1Hash = crypto.createHash('sha1');

      sha1Hash.update(content);
      const hash = sha1Hash.digest('base64url').substring(0, 10);

      hashes.set(relativePath, hash);
    } else {
      hashes.set(relativePath, '');
    }
  });
});

const sortedHashes = Array.from(hashes)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .reduce(
    (obj, [key, value]) => {
      obj[key] = value;

      return obj;
    },
    {} as { [key: string]: string }
  );

fs.writeFileSync(path.join(destBasePath, 'hashes.json'), JSON.stringify(sortedHashes, null, '  '));

if (patternPath) {
  fs.mkdirSync(patternPath, { recursive: true });
  glob.sync('./dist/static/{atoms,molecules,organisms,templates,pages}/**/*.*').forEach((p) => {
    let basename = '';
    const segments = slash(p).split('/');

    if (segments.length < 4) return;
    switch (segments.length) {
      case 4:
        basename = path.basename(slash(p).replaceAll(/(atoms|molecules|organisms|templates|pages)\/([\w._-]+)$/gi, '$1-$2'));
        fs.copyFileSync(p, resolve(patternPath, basename));
        break;
      default:
        segments.splice(0, 2);
        nodeFs.cpSync(p, resolve(patternPath, segments.join('-')), { recursive: true });
        break;
    }
  });

  glob.sync(slash(path.resolve(patternPath + '/**/*.{htm,html}'))).forEach((p) => {
    const text = fs.readFileSync(p, 'utf-8');
    const newText = text
      .replaceAll(/react-loader\.0x[a-z0-9_-]{8,12}\.js/gi, 'react-loader.0x00000000.js')
      .replaceAll(/\.svg\?v=[a-z0-9_-]+/gi, '.svg');

    if (text !== newText) {
      fs.writeFileSync(p, newText);
    }
  });
}

const checkExistFileList: FileExistCheck[] = [
  { fileName: 'hashes.json' },
  { fileName: /react-loader\.0x[a-z0-9_-]{8,12}\.js/gi, folder: 'js' },
  { fileName: 'main.js', folder: 'js' },
];
let isAllExist = true;

checkExistFileList.forEach((file) => {
  if (typeof file.fileName === 'string') {
    const destPath = slash(path.join(destBasePath, file.folder ?? '', file.fileName.toString()));

    if (!fs.existsSync(destPath)) {
      log(chalk.yellow(`Cannot find: ${destPath}`));
      isAllExist = false;
    }
  } else {
    const fileName = file.fileName;
    const folderFiles = slash(path.join(destBasePath, file.folder ?? ''));
    const files = fs.readdirSync(folderFiles);
    const found = files.find((f) => fileName.test(f));

    if (!found) {
      log(chalk.yellow(`Cannot find: ${slash(path.join(folderFiles, fileName.toString()))}`));
      isAllExist = false;
    }
  }
});

if (!isAllExist) {
  process.exit(1);
}
