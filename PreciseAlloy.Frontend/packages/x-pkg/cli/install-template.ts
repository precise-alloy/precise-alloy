import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { copy } from './helpers/copy.js';
import os from 'os';
import chalk from 'chalk';
import { install } from './helpers/install.js';

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

interface Props {
  appName: string;
  root: string;
}

const { cyan, green } = chalk;

const installTemplate = async (model: Props) => {
  const { appName, root } = model;
  console.log('\nInitializing project');
  const copySource = ['**/*', '**/*/'];

  await copy(copySource, root, {
    cwd: path.join(dirname, '..', 'template'),
  });

  console.log(`${green('Update package.json')}`);

  const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8')) || {};

  packageJson.name = appName;
  packageJson.description = '';
  packageJson.version = '0.1.0';
  packageJson.scripts = {
    "start": "x-pkg start",
    "build": "x-pkg build",
    "inte": "x-pkg inte"
  };

  delete packageJson.bin;

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
