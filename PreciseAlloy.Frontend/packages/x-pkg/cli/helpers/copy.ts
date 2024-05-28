import { globby } from 'globby';
import path from 'path';
import fs from 'fs/promises';

interface CopyOption {
  cwd: string;
}

const excludeFiles = [
  '.git',
  'bin',
  '.vscode',
  '.build',
  'public/samples',
  'public/assets/vendors',
  'src/_api/!(_base.ts)',
  'src/_data',
  'src/assets/scripts/!(color-mode|main|mock-api|pl-states|root|theme-critical).entry.ts',
  'src/atoms',
  'src/mocks/avatar',
  'src/mocks/user',
  'src/molecules',
  'src/organisms/!(root|header|footer)/*',
  'src/pages/!(Root|Home).tsx',
  'src/templates/!(root|home)/*',
  '!cli',
  '!vite.cli.config.ts'
];

const copy = async (src: string | string[], dest: string, { cwd }: CopyOption) => {
  const sourceFiles = await globby(src, {
    cwd,
    dot: true,
    absolute: false,
    gitignore: true,
    ignore: excludeFiles,
  });

  sourceFiles.push(path.join(cwd, '..', 'package.json'))

  const destRelativeToCwd = path.resolve(dest);

  return Promise.all(
    sourceFiles.map(async (p) => {
      const dirname = path.dirname(p);
      const basename = path.basename(p);

      const from = path.resolve(cwd, p);
      const filePath = path.join(destRelativeToCwd, dirname, basename);

      // Ensure the destination directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      console.log(`Copy ${from} to ${filePath}`);

      return fs.copyFile(from, filePath);
    })
  );
};

export { copy };
