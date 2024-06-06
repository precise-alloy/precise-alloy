import path from 'path';
import fs from 'fs';
import crypto from 'node:crypto';
import MagicString, { SourceMapOptions } from 'magic-string';
import { PluginOption } from 'vite';
import { root, xpackEnv } from '../paths';

const transfrom = (): PluginOption => {
  // console.log('[INIT] transform');
  const hashes: { [key: string]: string } = {};

  const getHash = (content: Buffer | string) => {
    const sha1Hash = crypto.createHash('sha1');
    sha1Hash.update(content);
    return sha1Hash.digest('base64url').substring(0, 10);
  };

  return {
    name: 'xpack-transform',
    enforce: 'post',

    transform(code, id, _options?) {
      // console.log('transform');

      const magicString = new MagicString(code);
      magicString.replaceAll('VITE_EXTENSION_UNIQUE_ID', xpackEnv.VITE_EXTENSION_UNIQUE_ID).replaceAll(/\/assets\/[a-z0-9./_-]+\.svg/gi, (s) => {
        if (hashes[s]) {
          // If the hash is already calculated, return the hash
          return s + '?v=' + hashes[s];
        }

        const svgPath = path.resolve(root, 'public' + s);
        if (fs.existsSync(svgPath)) {
          // If the file exists, calculate the hash and return the hash
          const content = fs.readFileSync(svgPath);
          const hash = getHash(content);
          hashes[s] = hash;
          return s + '?v=' + hash;
        }

        // If the file does not exist, return the original path
        return s;
      });

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
