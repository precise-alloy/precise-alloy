import fs from 'fs';

import MagicString, { SourceMapOptions } from 'magic-string';
import { PluginOption } from 'vite';

import { root, xpackEnv } from '../paths';
import { versionSvgPaths } from './transform-core';

const transfrom = (): PluginOption => {
  // console.log('[INIT] transform');
  const hashes: { [key: string]: string } = {};

  return {
    name: 'xpack-transform',
    enforce: 'post',

    transform(code, id, _options?) {
      // console.log('transform');

      const magicString = new MagicString(code);
      const deps = { existsSync: fs.existsSync, readFileSync: fs.readFileSync, rootDir: root };

      magicString.replaceAll('VITE_EXTENSION_UNIQUE_ID', xpackEnv.VITE_EXTENSION_UNIQUE_ID);

      const intermediate = magicString.toString();
      const versioned = versionSvgPaths(intermediate, hashes, deps);

      if (versioned !== intermediate) {
        magicString.overwrite(0, intermediate.length, versioned);
      }

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
