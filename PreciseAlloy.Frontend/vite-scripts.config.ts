import { defineConfig, loadEnv, PluginOption } from 'vite';
import { PreRenderedChunk } from 'rollup';
import react from '@vitejs/plugin-react';
import glob from 'glob';
import path from 'path';
import fs from 'fs';
import slash from 'slash';
import { root } from './xpack/paths';
import { fileURLToPath } from 'url';
import transformIndexHtml from './xpack/hooks/transform-index-html';

const argvModeIndex = process.argv.indexOf('--mode');
const mode = argvModeIndex >= 0 && argvModeIndex < process.argv.length - 1 && !process.argv[argvModeIndex + 1].startsWith('-') ? process.argv[argvModeIndex + 1] : 'production';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const xpackEnv = loadEnv(mode, __dirname);

const options = (): PluginOption => {
  return {
    name: 'options',
    enforce: 'pre',

    options(options) {
      const input: { [name: string]: string } = {};

      const filePaths = glob
        .sync('src/assets/scripts/**/*.entry.{js,jsx,ts,tsx}', { root: root })
        .map((f) => slash(f))
        .filter((f) => !f.endsWith('d.ts'));

      [].forEach.call(filePaths, (filePath: string) => {
        const baseName = path.basename(filePath).replaceAll(/\.entry\.[a-z0-9.@_-]+$/gi, '');

        if (baseName) {
          input[baseName] = filePath;
          return;
        }
      });

      options.input = input;
    },
  };
};

const closeBundle = (): PluginOption => {
  return {
    name: 'close-bundle',
    enforce: 'post',

    closeBundle() {
      const srcAssetsPath = path.resolve(__dirname, 'dist/assets/js');
      const dstAssetsPaths: string[] = [
        // path.resolve(__dirname, '../b2c/public/assets/js'),
        // path.resolve(__dirname, '../eshop/public/assets/js'),
      ];
      if (!fs.existsSync(srcAssetsPath)) {
        return;
      }
      [].forEach.call(dstAssetsPaths, (dstAssetsPath: string) => {
        if (fs.existsSync(dstAssetsPath)) {
          fs.rmSync(dstAssetsPath, { recursive: true, force: true });
        }
        fs.mkdirSync(dstAssetsPath, { recursive: true });
        fs.cpSync(srcAssetsPath, dstAssetsPath, { force: true, recursive: true });
      });
    },
  };
};

const entryFileNames = (chunkInfo: PreRenderedChunk) => {
  return 'assets/js/' + chunkInfo.name + '.js';
};

const entries: { [name: string]: string } = {};

const paths = glob.sync(slash(path.resolve(__dirname, 'src/assets/scripts/**/*.{js,jsx,ts,tsx}')));
paths.forEach((p) => {
  const name = path.parse(p).name;
  entries[name] = p;
});

const mock = (): PluginOption => {
  return {
    name: 'mock-js',
    enforce: 'pre',
    transform: function (code: string, id: string) {
      if (!id.includes('mock-api.entry.ts')) {
        return {
          code,
          map: this.getCombinedSourcemap()
        };
      }

      const files: string[] = glob.sync(slash(path.resolve(__dirname, "mock-api/request/**/index.ts")));
      const additionWatchFiles: string[] = glob.sync(slash(path.resolve(__dirname, "mock-api/**/*.ts")));

      for (const additionFile of additionWatchFiles) {
        this.addWatchFile(additionFile);
      }

      for (const file of files) {
        const data = fs.readFileSync(file);

        code += data;
      }

      return {
        code,
        map: this.getCombinedSourcemap()
      };
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: xpackEnv.VITE_BASE_URL,
  plugins: [react(), mock(), options(), closeBundle(), transformIndexHtml(xpackEnv.VITE_BASE_URL)],
  assetsInclude: ['**/*.svg', '**/*.htm', '**/*.cshtml'],
  build: {
    rollupOptions: {
      output: {
        entryFileNames,
      },
    },
    minify: 'esbuild',
    sourcemap: true,
    outDir: path.resolve('dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: [
      { find: '@atoms', replacement: path.resolve(__dirname, 'src/atoms') },
      { find: '@molecules', replacement: path.resolve(__dirname, 'src/molecules') },
      { find: '@organisms', replacement: path.resolve(__dirname, 'src/organisms') },
      { find: '@templates', replacement: path.resolve(__dirname, 'src/templates') },
      { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: '@assets', replacement: path.resolve(__dirname, 'src/assets') },
      { find: '@helpers', replacement: path.resolve(__dirname, 'src/_helpers') },
      { find: '@data', replacement: path.resolve(__dirname, 'src/_data') },
      { find: '@_types', replacement: path.resolve(__dirname, 'src/_types') },
      { find: '@_api', replacement: path.resolve(__dirname, 'src/_api') },
      { find: '@mock', replacement: path.resolve(__dirname, 'mock-api') },
    ],
  },
});
