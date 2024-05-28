import { PluginOption, defineConfig } from "vite";
import fs from "fs";
import { cwd } from "process";
import path from "path";

const entryFileNames = () => {
  return '[name].js';
};

const closeBundle = (): PluginOption => {
  // console.log('[INIT] closeBundle');

  return {
    name: 'xpack-close-bundle',
    enforce: 'post',

    closeBundle() {
      const cliPath = path.join(cwd(), 'bin', 'cli.js')
      fs.chmodSync(cliPath, 0o755);
      console.log('Set permisson for cli file');
    },
  };
};

// const bannerFileNames = () => {
//   return '#!/usr/bin/env node';
// }

export default defineConfig({
  base: '/',
  publicDir: false,
  plugins: [closeBundle()],
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
        // banner: bannerFileNames
      }
    }
  },
});
