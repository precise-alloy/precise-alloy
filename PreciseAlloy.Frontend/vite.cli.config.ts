import { defineConfig } from "vite";

const entryFileNames = () => {
  return '[name].js';
};

const bannerFileNames = () => {
  return '#!/usr/bin/env node';
}

export default defineConfig({
  base: '/',
  publicDir: false,
  build: {
    emptyOutDir: true,
    outDir: 'bin',
    sourcemap: false,
    ssr: true,
    rollupOptions: {
      input: [
        'cli/cli.ts',
      ],
      output: {
        entryFileNames,
        banner: bannerFileNames
      }
    }
  },
});
