import { PluginOption } from 'vite';

const writeBundle = (): PluginOption => {
  // console.log('[INIT] writeBundle');

  return {
    name: 'xpack-write-bundle',
    enforce: 'post',

    writeBundle(/* options: NormalizedOutputOptions, bundle: OutputBundle */) {
      // console.log('writeBundle');
    },
  };
};

export default writeBundle;
