#!/usr/bin/env node

import { Command } from 'commander';
import packageJson from '../package.json';
import chalk from 'chalk';
import Start from './start';
import { Init } from './init';

const packageName = 'x-pkg';
const program = new Command();
const { green } = chalk;
let projectPath: string = '';

program
  .command('init')
  .argument('[project-directory]', 'project directory')
  .description('Create a FE framework')
  .usage(`${green('[project-directory]')} [options]`)
  .action((name) => {
    projectPath = name || '';

    const runer = new Init({
      projectPath,
      packageJson
    });

    runer.init();
  })
  .allowUnknownOption()

program
  .command('start')
  .description('start FE framework')
  .action(() => {
    const runer = new Start({
      projectPath,
      packageJson
    });

    runer.init();
  })
  .allowUnknownOption()

program.parse(process.argv);

export { packageName };
