import { PluginOption } from 'vite';

import { deployInte } from '../deploy/deploy-inte';

const closeBundle = (): PluginOption => {
  // console.log('[INIT] closeBundle');

  return {
    name: 'xpack-close-bundle',
    enforce: 'post',

    closeBundle() {
      // console.log('closeBundle');
      deployInte();
    },
  };
};

export default closeBundle;
