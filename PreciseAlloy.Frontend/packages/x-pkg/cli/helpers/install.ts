import { spawn } from "child_process";
import chalk from 'chalk';

const { red, green } = chalk;

const commands = [
  { command: 'npm', args: ['i', 'react', 'react-dom', 'react-router-dom'] },
  {
    command: `npm`,
    args: [
      'i',
      '--save-dev',
      '@types/react-dom',
      '@types/react',
      '@types/react-router-dom',
      '@tuyen-at-work/x-pkg'
    ]
  },
  {
    command: 'npm',
    args: [
      'link',
      '@tuyen-at-work/x-pkg'
    ]
  }
];

const executeCommand = async (cmd: string, args: string[]) => {
  return new Promise<void>((resolve, reject) => {
    const spawnedProcess = spawn(cmd, args, { stdio: 'inherit' });

    spawnedProcess.on('error', (error) => {
      reject(error);
    });

    spawnedProcess.on('close', () => {
      resolve();
    });
  });
};

const install = async () => {
  try {
    for (const command of commands) {
      await executeCommand(command.command, command.args);
    }

    console.log(green('\nInstall successfully.'));
  } catch (error) {
    console.log(red(error));
  }
};

export { install };