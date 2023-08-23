import path from 'path';
import glob from 'glob';
import { PluginOption } from 'vite';
import { srcRoot, root } from '../paths';
const scriptOnly = process.env.scriptOnly;

const options = (): PluginOption => {
  // console.log('[INIT] options');

  const getSiteInputs = (input: { [name: string]: string }) => {
    if (!scriptOnly) {
      input['index'] = `${root}/index.html`;
    }

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

      if (typeof options.input === 'string' && options.input.includes('entry-server')) {
        return options;
      }

      const input: { [name: string]: string } = {};

      getSiteInputs(input);

      options.input = input;
    },
  };
};

export default options;
