import fs from 'fs';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import slash from 'slash';
import _ from 'lodash';
import glob from 'glob';
import crypto from 'node:crypto';
import { loadEnv } from 'vite';
import { root } from 'xpack/paths';

interface CopyItem {
  from: string;
  to?: string;
}

const xpackEnv = loadEnv('production', root) as ImportMetaEnv;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p: string) => slash(path.resolve(__dirname, p));
const log = console.log.bind(console);

const hashes: { [path: string]: string } = {};
const staticBasePath = toAbsolute('dist/static');
const srcBasePath = toAbsolute('dist/static/assets');
const destBasePath = toAbsolute(xpackEnv.VITE_INTE_ASSET_DIR);
const patternPath = toAbsolute(xpackEnv.VITE_INTE_PATTERN_DIR);

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
    const relativePath = file.substring(staticBasePath.length);

    if (!/\.0x[a-z0-9]{8}\.\w+$/gi.test(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      const sha1Hash = crypto.createHash('sha1');
      sha1Hash.update(content);
      const hash = sha1Hash.digest('hex').substring(0, 8);
      hashes[relativePath] = hash;
    } else {
      hashes[relativePath] = '';
    }
  });
});

fs.writeFileSync(path.join(destBasePath, 'hashes.json'), JSON.stringify(hashes, null, '  '));

glob.sync('./dist/static/{atoms,molecules,organisms,templates,pages}/**/*.*').forEach((p) => {
  const basename = path.basename(slash(p).replaceAll(/(atoms|molecules|organisms|templates|pages)\/([\w._-]+)$/gi, '$1-$2'));
  fs.copyFileSync(p, resolve(patternPath, basename));
});

glob.sync(slash(xpackEnv.VITE_INTE_PATTERN_DIR + '/**/*.{htm,html}')).forEach((p) => {
  const text = fs.readFileSync(p, 'utf-8');
  const newText = text.replaceAll(/react-loader\.\w+\.js/gi, 'react-loader.0x00000000.js');
  if (text !== newText) {
    fs.writeFileSync(p, newText);
  }
});
