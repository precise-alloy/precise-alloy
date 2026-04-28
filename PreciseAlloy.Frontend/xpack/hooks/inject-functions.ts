import MagicString, { SourceMapOptions } from 'magic-string';
import { PluginOption } from 'vite';

import { FUNCTIONS_PLACEHOLDER, FUNCTIONS_SOURCE_PATH, containsFunctionsPlaceholder, loadFunctionsSource } from './inject-functions-core';

const injectFunctions = (): PluginOption => {
  return {
    name: 'xpack-inject-functions',
    enforce: 'pre',

    transform(code, id) {
      if (id === FUNCTIONS_SOURCE_PATH || !containsFunctionsPlaceholder(code)) {
        return undefined;
      }

      this.addWatchFile(FUNCTIONS_SOURCE_PATH);

      const replacement = loadFunctionsSource();
      const magicString = new MagicString(code);

      magicString.replaceAll(FUNCTIONS_PLACEHOLDER, replacement);

      const sourcemapOptions: SourceMapOptions = {
        source: id,
        file: id + '.map',
        includeContent: false,
        hires: true,
      };

      return {
        code: magicString.toString(),
        map: magicString.generateMap(sourcemapOptions),
      };
    },
  };
};

export default injectFunctions;
