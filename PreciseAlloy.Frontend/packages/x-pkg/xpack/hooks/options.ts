import path from 'path';
import { glob } from 'glob';
import { PluginOption } from 'vite';
import { root, mode } from '../paths';
const scriptOnly = process.env.scriptOnly;

const options = (): PluginOption => {
  // console.log('[INIT] options');

  const getSiteInputs = () => {
    const inputs: { [name: string]: string } = {};
    if (!scriptOnly) {
      inputs['index'] = `${root}/index.html`;
    }

    const filePaths = glob.sync(['../../src/assets/**/*.entry.ts', '/xpack/scripts/**/*.entry.ts'], { root: root });

    [].forEach.call(filePaths, (filePath: string) => {
      const fileName = path.basename(filePath).toLowerCase();
      const entryName = fileName.replace(/\.entry\.ts$/gi, '');

      if (entryName === 'mock-api' && mode === 'production') {
        return;
      }

      if (entryName != fileName) {
        inputs[entryName] = filePath;
        return;
      }
    });

    return inputs;
  };

  return {
    name: 'xpack-options',
    enforce: 'pre',

    options(options) {
      // console.log('options');

      if (typeof options.input === 'string' && options.input.includes('entry-server')) {
        return options;
      }

      options.input = getSiteInputs();
    },
  };
};

export default options;
