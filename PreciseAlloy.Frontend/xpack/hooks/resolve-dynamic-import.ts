import { AcornNode } from 'rollup';
import { PluginOption } from 'vite';

const resolveDynamicImport = (): PluginOption => {
  // console.log('[INIT] resolveDynamicImport');

  return {
    name: 'xpack-transform',
    enforce: 'post',

    resolveDynamicImport(_specifier: string | AcornNode, _importer: string) {
      // console.log('resolveDynamicImport');
      // console.log(_specifier, _importer);
    },
  };
};

export default resolveDynamicImport;
