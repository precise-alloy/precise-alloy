import { glob } from 'glob';
import { PluginOption } from 'vite';

import { root, mode } from '../paths';

import { getSiteInputs } from './options-core';

const scriptOnly = process.env.scriptOnly;

const options = (): PluginOption => {
  // console.log('[INIT] options');

  return {
    name: 'xpack-options',
    enforce: 'pre',

    options(options) {
      // console.log('options');

      if (typeof options.input === 'string' && options.input.includes('entry-server')) {
        return options;
      }

      options.input = getSiteInputs({ root, mode, scriptOnly, globSync: glob.sync.bind(glob) });
    },
  };
};

export default options;
