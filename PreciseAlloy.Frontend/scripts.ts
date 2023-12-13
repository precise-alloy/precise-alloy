import chokidar from 'chokidar';
import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import slash from 'slash';
import { transformWithEsbuild } from 'vite';

const log = console.log.bind(console);

const scriptCompile = async (inputPath: string) => {
  console.log('compile:', slash(inputPath));

  const code = fs.readFileSync(inputPath, 'utf8');
  return transformWithEsbuild(code, inputPath, { minify: true, format: 'esm', sourcemap: path.basename(inputPath).includes('critical') ? false : 'external' })
    .then((result) => {
      const savePath = path.resolve('public/assets/js/' + path.parse(inputPath).name + '.js');
      const saveDir = path.dirname(savePath);
      if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir);
      }

      fs.writeFileSync(savePath, result.code);
    })
    .catch((error) => {
      log(error);
    });
};

const run = async () => {
  if (process.argv.includes('--watch')) {
    const watcher = chokidar.watch('src/assets/scripts/**/*.{js,jsx,ts,tsx}');

    watcher
      .on('add', scriptCompile)
      .on('change', scriptCompile)
      .on('unlink', (path) => log(`File ${path} has been removed`));
  } else {
    const pool: Promise<any>[] = [];

    glob
      .sync('src/assets/scripts/**/*.{js,jsx,ts,tsx}')
      .forEach((p) => pool.push(scriptCompile(p)));

    await Promise.all(pool);
  }
};

await run();

export { };
