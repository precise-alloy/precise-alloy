import { exec } from "node:child_process";
import chalk from 'chalk';

const { red } = chalk;

const install = async () => {
  return new Promise((resolve, reject) => {
    exec('npm install', (error, stdout) => {
      if(error) {
        reject(error);

        console.log(`${red(error)}`);

        return;
      }

      console.log(stdout);

      resolve(stdout);
    });
  });
};

export { install };