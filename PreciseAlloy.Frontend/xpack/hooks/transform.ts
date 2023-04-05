import { PluginOption } from 'vite';
import { xpackEnv } from '../paths';

const transfrom = (): PluginOption => {
  // console.log('[INIT] transform');

  return {
    name: 'xpack-transform',
    enforce: 'post',

    transform(code, _id, _options?) {
      // console.log('transform');

      const newCode = code.replaceAll('VITE_EXTENSION_UNIQUE_ID', xpackEnv.VITE_EXTENSION_UNIQUE_ID);
      return newCode;
    },
  };
};

export default transfrom;
