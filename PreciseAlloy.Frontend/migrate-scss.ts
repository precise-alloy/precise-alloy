import { glob } from 'glob';
import { execSync } from 'child_process';

const migration = async () => {
  const usableFiles = [
    './xpack/styles/root.scss',
  ];

  const forwardableFiles = [
    './src/assets/styles/style-base.scss',
    './src/assets/styles/style.all.scss',
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

  const allFiles = [...usableFiles, ...componentFiles];

  for (const file of allFiles) {
    try {
      console.log(`Migrating ${file}`);
      execSync(`bunx sass-migrator module --migrate-deps ${file}`, { stdio: 'inherit' });
    } catch (err) {
      console.error((err as Error).message);
    }
  }

}

migration().catch((err) => {
  console.error('An error occurred during migration:', (err as Error).message);
});
