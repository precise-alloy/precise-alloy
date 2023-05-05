import { Route, Routes } from 'react-router-dom';
import _ from 'lodash';
import { viteAbsoluteUrl } from '@helpers/functions';

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.tsx', { eager: true });
let rootComponent: any;

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\.\w+$/)![1];
  const normalizedName = name.replaceAll(/^(\w+)/gi, (_p0, p1: string) => _.lowerCase(p1).replaceAll(' ', '-'));

  if (name === 'Root') {
    rootComponent = (pages[path] as any).default;
  }

  return {
    name: _.startCase(_.lowerCase(name)),
    path: name === 'Root' ? '/' : `/pages/${normalizedName}`,
    component: (pages[path] as any).default,
  };
});

routes.push({
  name: 'Root',
  path: '/index',
  component: rootComponent,
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
