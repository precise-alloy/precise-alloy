/* eslint-disable no-console */
import fs from 'fs';

import chokidar from 'chokidar';
import debounce from 'debounce';
import { glob } from 'glob';

const isWatch = process.argv.includes('--watch');
const log = console.log.bind(console);

const states: { [path: string]: string } = {};

const buildStates = debounce(() => {
  const output: any[] = [];

  const keys = Object.keys(states);

  [].forEach.call(keys, (key) => {
    const state = states[key];

    if (!state) {
      return;
    }

    try {
      output.push(JSON.parse(state));
    } catch (error: any) {
      console.log(error);
    }
  });

  const json = JSON.stringify(output, null, '  ');

  fs.writeFileSync('public/pl-states.json', json);
}, 500);

const setStates = (statePath: string) => {
  const state = fs.readFileSync(statePath, 'utf-8');

  states[statePath] = state;
  buildStates();
};

const removeStates = (statePath: string) => {
  delete states[statePath];
  buildStates();
};

if (isWatch) {
  const watcher = chokidar.watch('src/**/*.states.json');

  watcher
    .on('ready', () => {
      log('States are ready!');
    })
    .on('add', (path) => setStates(path))
    .on('change', (path) => setStates(path))
    .on('unlink', (path) => removeStates(path));
} else {
  glob.sync('src/**/*.states.json').forEach((path) => setStates(path));
}

export {};
