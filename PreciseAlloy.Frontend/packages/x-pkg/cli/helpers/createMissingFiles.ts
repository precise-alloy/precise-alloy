import fs from 'fs/promises';
import path from 'path';

const missingFolders = [
  path.join('public'),
  path.join('src', 'assets', 'scripts'),
  path.join('src', 'atoms'),
  path.join('src', 'molecules'),
];

const missingFiles = [
  path.join('src', '_types', 'atoms.d.ts'),
  path.join('src', '_types', 'molecules.d.d.ts'),
  path.join('src', '_types', 'templates.d.d.ts'),
  path.join('src', '_types', 'atoms.d.ts'),
];

// demo.ts
const dataFile = path.join('src', '_data', 'demo.ts');
const demoData = `import { DemoModel } from "@_types/types";

const demo: DemoModel = {
  title: "Demo Title"
};

export { demo }`;

// helpers
const functionFile = path.join('src', '_helpers', 'functions.ts');
const functionData = `export * from '@tuyen-at-work/x-pkg/src/_helpers/functions';`;

// types
const typedFiles = [
  path.join('src', '_types', '_general.d.ts'),
  path.join('src', '_types', 'organisms.d.ts'),
  path.join('src', '_types', 'types.d.ts'),
];
const typedData = [
  'export { BasedAtomicModel } from "@tuyen-at-work/x-pkg/src/_types";',
  `import { BasedAtomicModel } from '@tuyen-at-work/x-pkg/src/_types';

export interface DemoModel extends BasedAtomicModel {
  title?: string;
}`,
  `export * from './_general';
export * from './_root';
export * from './_sso';
export * from './atoms';
export * from './molecules';
export * from './organisms';
export * from './templates';`
];

// organisms
const organismFiles = [
  path.join('src', 'organisms', 'Demo.tsx'),
];
const organismData = [
  `import { DemoModel } from '@_types/organisms';
import { getModifiers } from '@helpers/functions';

const Demo = (model: DemoModel) => {
  const { title } = model;
  const styleModifiers = getModifiers(model, 'zzz-o-demo');

  return (
    <div className={styleModifiers}>
      <h2>{title}</h2>
    </div>
  );
};

export default Demo;`
];

// pages
const pageFiles = [
  path.join('src', 'pages', 'Home.tsx')
];
const pageData = [
  `import { demo } from '@data/demo';
import Template from '@templates/home/Home';

const About = () => {
  return <Template demo={demo} />;
};

export default About;`
];

// templates
const templateFiles = [
  path.join('src', 'templates', 'home', 'Home.tsx')
];
const templateData = [
  `import { DemoModel } from '@_types/types';
import Demo from '@organisms/Demo';

interface Props {
  demo?: DemoModel;
}

const Home = (model: Props) => {
  const { demo } = model;

  return (
    <>
      <h2>Header</h2>

      <main>{demo && <Demo {...demo} />}</main>

      <h2>Footer</h2>
    </>
  );
};

export default Home;`
];

const createMissingFiles = async () => {
  for (const folder of missingFolders) {
    await fs.mkdir(folder, { recursive: true });
  }

  for (const file of missingFiles) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, '');
  }

  // process demo.ts
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, demoData);

  // functions.ts
  await fs.mkdir(path.dirname(functionFile), { recursive: true });
  await fs.writeFile(functionFile, functionData);

  // typed
  for (let i = 0; i < typedFiles.length; i++) {
    await fs.mkdir(path.dirname(typedFiles[i]), { recursive: true });
    await fs.writeFile(typedFiles[i], typedData[i]);
  }

  // organisms
  for (let i = 0; i < organismFiles.length; i++) {
    await fs.mkdir(path.dirname(organismFiles[i]), { recursive: true });
    await fs.writeFile(organismFiles[i], organismData[i]);
  }

  // pages
  for (let i = 0; i < pageFiles.length; i++) {
    await fs.mkdir(path.dirname(pageFiles[i]), { recursive: true });
    await fs.writeFile(pageFiles[i], pageData[i]);
  }

  // templates
  for (let i = 0; i < templateFiles.length; i++) {
    await fs.mkdir(path.dirname(templateFiles[i]), { recursive: true });
    await fs.writeFile(templateFiles[i], templateData[i]);
  }
};

export { createMissingFiles }