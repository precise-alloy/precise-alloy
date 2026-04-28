import { PluginOption } from 'vite';

const buildStart = (): PluginOption => {
  // console.log('[INIT] buildStart');

  return {
    name: 'xpack-build-start',
    enforce: 'pre',

    buildStart(_options: unknown) {
      // console.log('buildStart');
    },
  };
};

export default buildStart;
