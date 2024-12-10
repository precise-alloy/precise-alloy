import { Base, BaseConfigModel } from "./init";
import chalk from 'chalk';
import { executeCommand } from "./helpers/install";

const { red, green } = chalk;

class Start extends Base {
  constructor(config: BaseConfigModel) {
    super(config)
  }

  async run() {
    console.log(green('\nstart FE Framework...'));

    const commands = [
      {
        command: 'npm',
        args: [
          'explore',
          '@tuyen-at-work/x-pkg',
          '--',
          'npm',
          'start'
        ]
      }
    ];

    try {
      for (const command of commands) {
        await executeCommand(command.command, command.args);
      }
    } catch (error) {
      console.log(red(error));
    }
  }
}

export default Start;