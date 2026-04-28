import MagicString, { SourceMapOptions } from 'magic-string';
import { PluginOption } from 'vite';

import { xpackEnv } from '../paths';
import { ASSET_HASH_REGEX, appendAssetHash } from '../asset-hash';

const argvModeIndex = process.argv.indexOf('--mode');
const mode =
  argvModeIndex >= 0 && argvModeIndex < process.argv.length - 1 && !process.argv[argvModeIndex + 1].startsWith('-')
    ? process.argv[argvModeIndex + 1]
    : 'production';

const transfrom = (): PluginOption => {
  // console.log('[INIT] transform');

  return {
    name: 'xpack-transform',
    enforce: 'post',

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(code, id, options?) {
      // console.log('transform');

      const magicString = new MagicString(code);

      if (mode === 'production' && code.includes('/* XPACK_BEGIN_DEVELOPMENT_ONLY */')) {
        magicString.replaceAll(/\/\* XPACK_BEGIN_DEVELOPMENT_ONLY \*\/[\s\S]*?\/\* XPACK_END_DEVELOPMENT_ONLY \*\//g, '');
      }

      // Asset cache-busting and `VITE_EXTENSION_UNIQUE_ID` substitution share
      // the same shape across CSS and JS/TS pipelines; the actual hashing is
      // factored out into `xpack/asset-hash.ts` so both stay in sync (regex,
      // hash cache, missing-file behavior). MagicString's `replaceAll` accepts
      // a function replacer, so we can pass `appendAssetHash` directly.
      magicString.replaceAll('VITE_EXTENSION_UNIQUE_ID', xpackEnv.VITE_EXTENSION_UNIQUE_ID).replaceAll(ASSET_HASH_REGEX, appendAssetHash);

      const sourcemapOptions: SourceMapOptions = { source: id, file: id + '.map', includeContent: false, hires: true };
      const newCode = magicString.toString();
      const map = magicString.generateMap(sourcemapOptions);

      return newCode !== code
        ? {
            code: newCode,
            map,
          }
        : undefined;
    },
  };
};

export default transfrom;
