import path from 'path';
import glob from 'glob';
import { PluginOption } from 'vite';
import { srcRoot } from '../paths';

const options = (): PluginOption => {
  // console.log('[INIT] options');

  const getSiteInputs = (input: { [name: string]: string }) => {
    const filePaths = glob.sync('/**/*.entry.ts', { root: srcRoot });

    [].forEach.call(filePaths, (filePath: string) => {
      const fileName = path.basename(filePath).toLowerCase();
      const entryName = fileName.replace(/\.entry\.ts$/gi, '');

      if (entryName != fileName) {
        input[entryName] = filePath;
        return;
      }
    });
  };

  return {
    name: 'xpack-options',
    enforce: 'pre',

    options(options) {
      // console.log('options');

      const input: { [name: string]: string } = {};

      getSiteInputs(input);

      options.input = input;
    },
  };
};

export default options;
