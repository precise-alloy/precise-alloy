import { NormalizedInputOptions } from 'rollup';
import { PluginOption } from 'vite';

const buildStart = (): PluginOption => {
  // console.log('[INIT] buildStart');

  return {
    name: 'xpack-build-start',
    enforce: 'pre',

    buildStart(_options: NormalizedInputOptions) {
      // console.log('buildStart');
    },
  };
};

export default buildStart;
