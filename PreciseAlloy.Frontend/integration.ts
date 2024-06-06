import fs from 'fs';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import slash from 'slash';
import _ from 'lodash';
import { glob } from 'glob';
import crypto from 'node:crypto';
import { loadEnv } from 'vite';

interface CopyItem {
  from: string;
  to?: string;
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

const hashes: { [path: string]: string } = {};
const staticBasePath = toAbsolute('dist/static');
const srcBasePath = toAbsolute('dist/static/assets');
const destBasePath = toAbsolute(xpackEnv.VITE_INTE_ASSET_DIR);
const patternPath = xpackEnv.VITE_INTE_PATTERN_DIR ? toAbsolute(xpackEnv.VITE_INTE_PATTERN_DIR) : undefined;

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

    if (!/\.0x[a-z0-9]{8}\.\w+$/gi.test(file)) {
      const content = fs.readFileSync(file);
      const sha1Hash = crypto.createHash('sha1');
      sha1Hash.update(content);
      const hash = sha1Hash.digest('base64url').substring(0, 10);
      hashes[relativePath] = hash;
    } else {
      hashes[relativePath] = '';
    }
  });
});

fs.writeFileSync(path.join(destBasePath, 'hashes.json'), JSON.stringify(hashes, null, '  '));

if (patternPath) {
  fs.mkdirSync(patternPath, { recursive: true });
  glob.sync('./dist/static/{atoms,molecules,organisms,templates,pages}/**/*.*').forEach((p) => {
    const basename = path.basename(slash(p).replaceAll(/(atoms|molecules|organisms|templates|pages)\/([\w._-]+)$/gi, '$1-$2'));
    fs.copyFileSync(p, resolve(patternPath, basename));
  });

  glob.sync(slash(path.resolve(patternPath + '/**/*.{htm,html}'))).forEach((p) => {
    const text = fs.readFileSync(p, 'utf-8');
    const newText = text.replaceAll(/react-loader\.\w+\.js/gi, 'react-loader.0x00000000.js').replaceAll(/\.svg\?v=[a-z0-9_-]+/gi, '.svg');
    if (text !== newText) {
      fs.writeFileSync(p, newText);
    }
  });
}
