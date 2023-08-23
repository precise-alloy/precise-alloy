import glob from 'glob';
import { PluginOption } from 'vite';
import { srcRoot, root } from '../paths';
import path from 'path';
import slash from 'slash';

const mock = (): PluginOption => {
  return {
    name: 'mock-js',
    enforce: 'pre',
    transform: function (code: string, id: string) {
      if (!id.includes('mock-api.entry.ts')) {
        return {
          code,
          map: this.getCombinedSourcemap(),
        };
      }

      const mockPath = slash(path.resolve(`${root}/mock-api`));
      const files: string[] = glob.sync(`${mockPath}/request/**/index.ts`);

      for (const file of files) {
        const filePath = slash(path.resolve(file));
        code = `import "${filePath.replace(`${mockPath}`, '@mock')}";` + code;
      }

      return {
        code,
        map: this.getCombinedSourcemap(),
      };
    },
  };
};

export default mock;
