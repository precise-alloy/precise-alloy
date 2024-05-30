import { PluginOption } from 'vite';

const closeBundle = (): PluginOption => {
  // console.log('[INIT] closeBundle');

  return {
    name: 'xpack-close-bundle',
    enforce: 'post',

    closeBundle() {
      // console.log('closeBundle');
    },
  };
};

export default closeBundle;
