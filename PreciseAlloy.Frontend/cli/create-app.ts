import path from "path";
import { isWriteable } from "./helpers/is-writeable.js";
import { makeDir } from "./helpers/make-dir.js";
import { isFolderEmpty } from "./helpers/is-folder-empty.js";
import chalk from 'chalk'
import { tryGitInit } from "./helpers/git.js";
import { installTemplate } from "./install-template.js";

interface Props {
  appPath: string;
}

const { green } = chalk;

const createApp = async (model: Props) => {
  const { appPath } = model;
  const root = path.resolve(appPath);

  if (!(await isWriteable(path.dirname(root)))) {
    console.error(
      'The application path is not writable, please check folder permissions and try again.'
    );

    console.error(
      'It is likely you do not have write permissions for this folder.'
    );
    
    process.exit(1);
  }

  const appName = path.basename(root);

  await makeDir(root);

  if (!isFolderEmpty(root)) {
    console.log(`\nThe directory ${green(appName)} contains files that could conflict or not empty`);
    console.log('\nEither try using a new directory name, or remove these files.');

    process.exit(1);
  }

  console.log(`\nCreating a new app in ${green(root)}.`);

  process.chdir(root);

  await installTemplate({
    appName,
    root,
  })

  if (tryGitInit(root)) {
    console.log('\nInitialized a git repository.')
  }

  console.log(`\n${green('Success!')} Created ${appName} at ${appPath}`)
};

export { createApp };