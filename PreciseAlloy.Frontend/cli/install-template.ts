import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { copy } from './helpers/copy.js';
import os from 'os';
import chalk from 'chalk';
import { install } from './helpers/install.js';
import { formatFiles } from './helpers/format-files.js';

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

interface Props {
  appName: string;
  root: string;
}

const { cyan } = chalk;

const installTemplate = async (model: Props) => {
  const { appName, root } = model;
  console.log('\nInitializing project');
  const copySource = ['**'];

  await copy(copySource, root, {
    cwd: path.join(dirname, '..'),
  });

  await formatFiles(root);

  const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));

  packageJson.name = appName;
  packageJson.description = '';
  packageJson.version = '0.1.0';

  delete packageJson.bin;
  packageJson.scripts &&
    Object.keys(packageJson.scripts).map((scriptName: string) => {
      if (scriptName.startsWith('cli')) {
        delete packageJson.scripts[scriptName];
      }
    });

  packageJson.dependencies && Object.keys(packageJson.dependencies).map(dependency => {
    if (!dependency.startsWith('react')) {
      delete packageJson.dependencies[dependency];
    }
  });

  const devDeps = Object.keys(packageJson.devDependencies).length;

  if (!devDeps) delete packageJson.devDependencies;

  await fs.writeFile(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2) + os.EOL);

  console.log('\nInstalling dependencies:');

  for (const dependency in packageJson.dependencies) {
    console.log(`- ${cyan(dependency)}`);
  }

  if (devDeps) {
    console.log('\nInstalling devDependencies:');

    for (const dependency in packageJson.devDependencies) console.log(`- ${cyan(dependency)}`);
  }

  await install();
};

export { installTemplate };
