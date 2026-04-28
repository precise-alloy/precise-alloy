import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import alias from './alias';
import { getAssetFileName, getChunkFileName, getEntryFileName } from './filename';
import { getManualChunk } from './manual-chunk';
import { outDir, xpackEnv } from './paths';
import buildStart from './hooks/build-start';
import writeBundle from './hooks/write-bundle';
import closeBundle from './hooks/close-bundle';
import resolveDynamicImport from './hooks/resolve-dynamic-import';
import handleHotUpdate from './hooks/handle-hot-update';
import transformIndexHtml from './hooks/transform-index-html';
import options from './hooks/options';
import transfrom from './hooks/transform';
import injectFunctions from './hooks/inject-functions';

// console.log('config');

const config = defineConfig({
  base: xpackEnv.VITE_BASE_URL,
  plugins: [
    react(),
    options(),
    buildStart(),
    injectFunctions(),
    transfrom(),
    transformIndexHtml(xpackEnv.VITE_BASE_URL),
    resolveDynamicImport(),
    handleHotUpdate(),
    writeBundle(),
    closeBundle(),
  ],
  assetsInclude: ['**/*.svg', '**/*.htm', '**/*.cshtml'],
  build: {
    rolldownOptions: {
      output: {
        entryFileNames: getEntryFileName,
        chunkFileNames: getChunkFileName,
        assetFileNames: getAssetFileName,
        manualChunks: getManualChunk,
      },
    },
    minify: 'oxc',
    sourcemap: true,
    outDir,
    emptyOutDir: true,
  },

  css: {
    preprocessorOptions: {
      scss: {},
    },
  },

  resolve: {
    alias: alias,
  },
});

export default config;
