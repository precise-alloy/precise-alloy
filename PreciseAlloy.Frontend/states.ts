import fs from 'fs';
import chokidar from 'chokidar';
import debounce from 'debounce';
import glob from 'glob';
import _ from 'lodash';

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
  let isReady = false;

  watcher
    .on('ready', () => {
      log('SCSS ready!');
      isReady = true;
    })
    .on('add', (path) => setStates(path))
    .on('change', (path) => setStates(path))
    .on('unlink', (path) => removeStates(path));
} else {
  glob.sync('src/**/*.states.json').forEach((path) => setStates(path));
}

export {};
