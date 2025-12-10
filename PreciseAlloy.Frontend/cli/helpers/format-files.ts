import path from 'path';
import os from 'os';
import fs from 'fs/promises';

const formatFiles = async (root: string) => {
  let filePath, data;

  // mock handler file
  filePath = path.join(root, 'src/mocks/handlers.ts');
  data = "import { handlers } from './consts';\n\nexport { handlers };";

  await fs.writeFile(filePath, data + os.EOL);

  // example mock file
  filePath = path.join(root, 'src/mocks/example/index.ts');
  data = `
    import { handlers } from '@mocks/handlers';
    import { rest } from 'msw';

    handlers.push(
      rest.get('/api/example', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({test: 'test'}));
      })
    );
  `;

  await fs.writeFile(filePath, data + os.EOL);

  // react loader
  filePath = path.join(root, 'src/react-loader.tsx');
  data = await fs.readFile(filePath, 'utf8');
  data = data.replace(
    /const blocks((?!};).)*};/s,
    "const blocks: { [name: string]: any } = {\n\troot: lazy(() => import('./organisms/root/Root')),\n};"
  );

  await fs.writeFile(filePath, data);

  // src/_types/atoms.d.ts
  filePath = path.join(root, 'src/_types/atoms.d.ts');

  await fs.writeFile(
    filePath,
    `
      import { BasedAtomicModel } from "./_general";
    `
  );

  // src/_types/molecules.d.d.ts
  filePath = path.join(root, 'src/_types/molecules.d.ts');

  await fs.writeFile(
    filePath,
    `
      import { BasedAtomicModel } from "./_general";
    `
  );

  // src/_types/organisms.d.ts
  filePath = path.join(root, 'src/_types/organisms.d.ts');

  await fs.writeFile(
    filePath,
    `
      import { BasedAtomicModel } from "./_general";

      interface FooterModel extends BasedAtomicModel {}

      interface HeaderModel extends BasedAtomicModel {}
    `
  );

  // pages/Home.tsx
  filePath = path.join(root, 'src/pages/Home.tsx');

  await fs.writeFile(
    filePath,
    `
      import Template from '@templates/home/Home';

      const Home = () => {
        return <Template footer={footer} header={header} />;
      };

      export default Home;
    `
  );

  // templates/home/Home.tsx
  filePath = path.join(root, 'src/templates/home/Home.tsx');

  await fs.writeFile(
    filePath,
    `
      import { FooterModel, HeaderModel } from '@_types/organisms';
      import Footer from '@organisms/footer/Footer';
      import Header from '@organisms/header/Header';

      interface Props {
        header?: HeaderModel;
        footer?: FooterModel;
      }

      const Home = (model: Props) => {
        const { header, footer } = model;

        return (
          <>
            {header && <Header {...header} />}

            <main>
              // write components here
            </main>

            <Footer {...footer} />
          </>
        );
      };

      export default Home;
    `
  );

  // src/organisms/header/Header.tsx
  filePath = path.join(root, 'src/organisms/header/Header.tsx');

  await fs.writeFile(
    filePath,
    `
      import { getModifiers } from '@helpers/functions';
      import RequireCss from '@helpers/RequireCss';
      import { HeaderModel } from '@_types/organisms';

      const Header = (model: HeaderModel) => {
        const modifiers = getModifiers(model, 'zzz-o-header');

        return (
          <header className={modifiers}>
            <h2>Header</h2>
            <RequireCss path="b-header" />
          </header>
        );
      };

      export default Header;
    `
  );

  // src/organisms/header/Header.scss
  filePath = path.join(root, 'src/organisms/header/Header.scss');

  await fs.writeFile(filePath, '');

  // src/organisms/footer/Footer.tsx
  filePath = path.join(root, 'src/organisms/footer/Footer.tsx');

  await fs.writeFile(
    filePath,
    `
      import { getModifiers } from '@helpers/functions';
      import RequireCss from '@helpers/RequireCss';
      import { FooterModel } from '@_types/organisms';

      const Footer = (model: FooterModel) => {
        const modifiers = getModifiers(model, 'zzz-o-footer');

        return (
          <footer className={modifiers}>
            <h2>Footer</h2>
            <RequireCss path="b-footer" />
          </footer>
        );
      };

      export default Footer;
    `
  );

  // src/organisms/footer/Footer.scss
  filePath = path.join(root, 'src/organisms/footer/Footer.scss');

  await fs.writeFile(filePath, '');

  return ['xxx'];
};

// formatFiles('E:\\projects\\test-x-pkg');

export { formatFiles };
