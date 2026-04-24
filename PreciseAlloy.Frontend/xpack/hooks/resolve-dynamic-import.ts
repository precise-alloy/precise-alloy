import type { PluginOption } from 'vite';

const resolveDynamicImport = (): PluginOption => {
  // console.log('[INIT] resolveDynamicImport');

  return {
    name: 'xpack-transform',
    enforce: 'post',

    resolveDynamicImport(_specifier, _importer) {
      // console.log('resolveDynamicImport');
      // console.log(_specifier, _importer);
    },
  };
};

export default resolveDynamicImport;
