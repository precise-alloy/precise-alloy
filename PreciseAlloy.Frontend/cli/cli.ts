#!/usr/bin/env node

import { Command } from 'commander';
import packageJson from '../package.json';
import chalk from 'chalk';
import fetch from 'node-fetch';
import prompts from 'prompts';
import path from 'path';
import { createApp } from './create-app.js';
import { validateNpmName } from './helpers/validate-pkg.js';

let projectPath = '';
const program = new Command();
const { green, yellow, bold, cyan, red } = chalk;
const packageName = 'x-pkg';

const onPromptState = (state: { value?: string; aborted?: boolean }) => {
  if (state?.aborted) {
    // If we don't re-enable the terminal cursor before exiting
    // the program, the cursor will remain hidden
    process.stdout.write('\x1B[?25h');
    process.stdout.write('\n');
    process.exit(1);
  }
};

program
  .name(packageName)
  .description('Create a FE framework')
  .version(packageJson.version)
  .argument('[project-directory]', 'the project name', '')
  .usage(`${green('[project-directory]')} [options]`)
  .action((name) => {
    projectPath = name;
  })
  .allowUnknownOption()
  .parse(process.argv);

const parseVersion = (version: string): number => {
  return parseInt(version.replaceAll('.', ''));
};

const update = fetch(`https://registry.npmjs.org/${packageJson.name}/latest`)
  .then((res) => res.json())
  .catch(() => null);

async function notifyUpdate(): Promise<void> {
  try {
    const data = (await update) as { version: string };

    if (data.version && parseVersion(data.version) !== parseVersion(packageJson.version)) {
      const updateMessage = `npm update ${packageName}`;

      console.log(
        yellow(bold(`A new version of '${packageName}' is available!`)) + '\n' + 'You can update by running: ' + cyan(updateMessage) + '\n'
      );
    }

    process.exit();
  } catch {
    // ignore error
  }
}

const run = async () => {
  const validation = validateNpmName(path.basename(path.resolve(projectPath)));

  if (!validation.valid) {
    const res = await prompts({
      onState: onPromptState,
      type: 'text',
      name: 'path',
      message: 'What is your project named?',
      initial: 'my-app',
      validate: (name) => {
        const validation = validateNpmName(path.basename(path.resolve(name)));

        if (validation.valid) {
          return true;
        }

        return `Invalid project name ${validation?.problems?.[0] ? validation?.problems?.[0] : ''}`;
      },
    });

    if (typeof res.path === 'string') {
      projectPath = res.path.trim();
    }
  }

  if (!projectPath) {
    console.log(
      '\nPlease specify the project directory:\n' +
      `  ${cyan(program.name())} ${green('<project-directory>')}\n` +
      'For example:\n' +
      `  ${cyan(program.name())} ${green('my-app')}\n\n` +
      `Run ${cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
  }

  const resolvedProjectPath = path.resolve(projectPath);

  await createApp({
    appPath: resolvedProjectPath,
  });
};

run()
  .then(async () => {
    await notifyUpdate();
  })
  .catch(async (error) => {
    console.log(red(error));

    await notifyUpdate();

    process.exit(1);
  });

export { packageName };
