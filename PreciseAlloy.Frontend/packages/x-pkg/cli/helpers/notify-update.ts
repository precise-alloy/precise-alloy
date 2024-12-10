import chalk from "chalk";

export interface PackageJsonModel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const { yellow, bold, cyan } = chalk;

const update = async (name: string) => {
  return fetch(`https://registry.npmjs.org/${name}/latest`)
    .then((res) => res.json())
    .catch(() => null)
};

const parseVersion = (version: string): number => {
  return parseInt(version.replaceAll('.', ''));
};

const notifyUpdate = async (packageJson: PackageJsonModel) => {
  try {
    const data = (await update(packageJson.name)) as { version: string };

    if (data.version && parseVersion(data.version) !== parseVersion(packageJson.version)) {
      const updateMessage = `npm update ${packageJson.name}`;

      console.log(
        yellow(bold(`A new version of '${packageJson.name}' is available!`)) + '\n' + 'You can update by running: ' + cyan(updateMessage) + '\n'
      );
    }

    process.exit();
  } catch {
    // ignore error
  }
}

export { notifyUpdate }
