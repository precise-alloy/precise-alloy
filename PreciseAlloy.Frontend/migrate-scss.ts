import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import slash from 'slash';
import { execSync } from 'child_process';

const automaticMigration = async () => {
  const baseFiles = [
    './src/assets/styles/style-base.scss',
    './src/assets/styles/style.all.scss',
    './src/assets/styles/_additional-data.scss',
    './xpack/styles/root.scss',
  ];


  const forwardableFiles = [
    './src/assets/styles/00-abstracts/_abstracts.scss',
    './src/assets/styles/01-mixins/_mixins.scss',
    './src/assets/styles/02-base/_base.scss',
  ];


  for (const file of forwardableFiles) {
    try {
      console.log(`Migrating ${file}`);
      execSync(`bunx sass-migrator --migrate-deps module --forward=all ${file}`, { stdio: 'inherit' });
    } catch (err) {
      console.error((err as Error).message);
    }
  }

  const componentFiles = await glob(['./src/atoms/**/*.scss', './src/molecules/**/*.scss', './src/organisms/**/*.scss'], { nodir: true });

  const allFiles = [...baseFiles, ...componentFiles];

  for (const file of allFiles) {
    try {
      console.log(`Migrating ${file}`);
      execSync(`bunx sass-migrator module --migrate-deps ${file}`, { stdio: 'inherit' });
    } catch (err) {
      console.error((err as Error).message);
    }
  }
}

const manualMigration = async () => {
  const abstractsPath = 'src/assets/styles/00-abstracts/abstracts';
  const mixinsPath = 'src/assets/styles/01-mixins/mixins';

  const manualSassMigrationFiles = await glob(
    [
      'src/atoms/**/*.scss',
      'src/molecules/**/*.scss',
      'src/organisms/**/*.scss',
      'src/assets/styles/01-mixins/**/*.scss',
      'xpack/styles/**/*.scss',
      'src/assets/styles/02-base/**/*.scss',
    ],
    {
      nodir: true,
    }
  );

  for (const file of manualSassMigrationFiles) {
    const content = await fs.readFile(file, 'utf-8');

    if (file.includes('00-abstracts') || content.includes('00-abstracts/abstracts')) {
      continue;
    }

    const usesVars = /\$[a-zA-Z0-9_-]+\b/.test(content);
    const usesMixins = /@include\s+[a-zA-Z0-9_-]+\b/.test(content);
    const usesFunctions = /[a-zA-Z0-9_-]+\s*\([^)]*\)/.test(content);

    if (usesVars || usesMixins || usesFunctions) {
      const useLines = [];
      if (file.includes('01-mixins') || content.includes('01-mixins/mixins')) {
        const relToAbstracts = slash(path.relative(path.dirname(file), abstractsPath));
        useLines.push(`@use '${relToAbstracts}' as *;`);
      } else {
        if (usesVars) {
          const relToAbstracts = slash(path.relative(path.dirname(file), abstractsPath));
          useLines.push(`@use '${relToAbstracts}' as *;`);
        }

        if (usesMixins || usesFunctions) {
          const relToMixins = slash(path.relative(path.dirname(file), mixinsPath));
          useLines.push(`@use '${relToMixins}' as *;`);
        }
      }

      const updated = useLines.join('\n') + '\n\n' + content;
      await fs.writeFile(file, updated, 'utf-8');
    }
  }
}

const run = async () => {
 await automaticMigration();
 await manualMigration();
};

run();
