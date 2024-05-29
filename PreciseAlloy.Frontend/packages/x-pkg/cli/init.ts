import chalk from "chalk";
import { PackageJsonModel, notifyUpdate } from "./helpers/notify-update";
import { validateNpmName } from "./helpers/validate-pkg";
import path from 'path';
import prompts from 'prompts';
import { onPromptState } from "./helpers/on-prompt-state";
import { createApp } from "./create-app";

const { red } = chalk;

export interface BaseConfigModel {
  projectPath: string;
  packageJson: PackageJsonModel;
}

export abstract class Base {
  packageJson: PackageJsonModel;
  projectPath: string;

  constructor({
    projectPath,
    packageJson
  }: BaseConfigModel) {
    this.packageJson = packageJson;
    this.projectPath = projectPath;
  }

  async init() {
    try {
      await this.run();

      await notifyUpdate(this.packageJson);
    } catch (error) {
      console.log(red(error));

      await notifyUpdate(this.packageJson);

      process.exit(1);
    }
  }

  async run() {
    throw new Error("Method not implemented.");
  }
}

export class Init extends Base {
  async run() {
    const validation = validateNpmName(path.basename(path.resolve(this.projectPath)));

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
        this.projectPath = res.path.trim();
      }
    }

    if (!this.projectPath) {
      console.log('\nPlease specify the project directory');
      process.exit(1);
    }

    const resolvedProjectPath = path.resolve(this.projectPath);

    await createApp({
      appPath: resolvedProjectPath,
    });
  }
}
