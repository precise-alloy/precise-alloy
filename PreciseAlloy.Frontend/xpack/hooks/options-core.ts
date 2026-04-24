import path from 'path';

export interface GetSiteInputsParams {
  root: string;
  mode: string;
  scriptOnly: string | undefined;
  globSync: (patterns: string[], options?: { root?: string }) => string[];
}

export const getSiteInputs = ({ root, mode, scriptOnly, globSync }: GetSiteInputsParams): Record<string, string> => {
  const inputs: Record<string, string> = {};

  if (!scriptOnly) {
    inputs['index'] = `${root}/index.html`;
  }

  const filePaths = globSync(['/src/assets/**/*.entry.ts', '/xpack/scripts/**/*.entry.ts'], { root });

  [].forEach.call(filePaths, (filePath: string) => {
    const fileName = path.basename(filePath).toLowerCase();
    const entryName = fileName.replace(/\.entry\.ts$/gi, '');

    if (entryName === 'mock-api' && mode === 'production') {
      return;
    }

    if (entryName != fileName) {
      inputs[entryName] = filePath;

      return;
    }
  });

  return inputs;
};
