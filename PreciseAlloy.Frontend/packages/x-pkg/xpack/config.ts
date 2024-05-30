import { defineConfig, normalizePath } from 'vite';
import alias from './alias';
import react from '@vitejs/plugin-react';
import { getAssetFileName, getChunkFileName, getEntryFileName } from './filename';
import { getManualChunk } from './manual-chunk';
import { outDir, srcRoot, xpackEnv } from './paths';
import buildStart from './hooks/build-start';
import writeBundle from './hooks/write-bundle';
import closeBundle from './hooks/close-bundle';
import resolveDynamicImport from './hooks/resolve-dynamic-import';
import handleHotUpdate from './hooks/handle-hot-update';
import transformIndexHtml from './hooks/transform-index-html';
import options from './hooks/options';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const additionalScssData = `
@import "${srcRoot}/assets/styles/additional-data";
`;

const config = defineConfig({
  base: xpackEnv.VITE_BASE_URL,
  plugins: [
    react(),
    options(),
    buildStart(),
    // transfrom(),
    transformIndexHtml(xpackEnv.VITE_BASE_URL),
    resolveDynamicImport(),
    handleHotUpdate(),
    writeBundle(),
    closeBundle(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(outDir, '..', 'public', '*')),
          dest: normalizePath(outDir),
        },
      ]
    })
  ],
  assetsInclude: ['**/*.svg', '**/*.htm', '**/*.cshtml'],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: getEntryFileName,
        chunkFileNames: getChunkFileName,
        assetFileNames: getAssetFileName,
        manualChunks: getManualChunk,
      },
    },
    minify: 'esbuild',
    sourcemap: true,
    outDir,
    emptyOutDir: true,
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: additionalScssData,
      },
    },
  },

  resolve: {
    alias: alias,
  },
});

export default config;
