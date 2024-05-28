import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { copy } from './helpers/copy.js';
import os from 'os';
import chalk from 'chalk';
import { install } from './helpers/install.js';
import { createMissingFiles } from './helpers/createMissingFiles.js';

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

interface Props {
  appName: string;
  root: string;
}

const { green } = chalk;

const installTemplate = async (model: Props) => {
  const { appName, root } = model;
  console.log('\nInitializing project');
  const copySource = ['**/*', '**/*/'];

  await copy(copySource, root, {
    cwd: path.join(dirname, '..', 'template'),
  });
  console.log(`${green('\nCopy file successfully')}`);

  await createMissingFiles();
  console.log(`${green('\nUpdated missing Files')}`);

  const packageJson: { [key: string]: unknown } = {};

  packageJson.name = appName;
  packageJson.description = '';
  packageJson.version = '0.1.0';
  packageJson.scripts = {
    "start": "x-pkg start",
    "build": "x-pkg build",
    "inte": "x-pkg inte"
  };

  await fs.writeFile(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2) + os.EOL);
  console.log(`${green('\nUpdated package.json')}`);

  console.log('\nInstalling dependencies:');

  await install();
};

export { installTemplate };
