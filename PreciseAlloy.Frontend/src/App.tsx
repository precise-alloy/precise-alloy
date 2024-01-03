import { Route, Routes } from 'react-router-dom';
import _ from 'lodash';
import { viteAbsoluteUrl } from '@helpers/functions';
import RootTemplate from '@xpack/root/Template';

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.tsx', { eager: true });

const routes = Object.keys(pages).map((path) => {
  const match = path.match(/\.\/pages\/(.*)\.\w+$/);
  const name = match ? match[1] : '';
  const normalizedName = name.replaceAll(/^(\w+)/gi, (_p0, p1: string) => _.lowerCase(p1).replaceAll(' ', '-'));

  return {
    name: _.startCase(_.lowerCase(name)),
    path: name === 'Root' ? '/' : `/pages/${normalizedName}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: (pages[path] as any).default,
  };
});

routes.push({
  name: 'Root',
  path: '/',
  component: RootTemplate,
});

const App = () => {
  return (
    <Routes>
      {routes.map(({ path, component: RouteComp }) => {
        return <Route key={path} path={viteAbsoluteUrl(path, true)} element={<RouteComp routes={routes} />}></Route>;
      })}
    </Routes>
  );
};

export { App };
