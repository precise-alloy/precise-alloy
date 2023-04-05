import { Route, Routes } from 'react-router-dom';
import _ from 'lodash';

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.tsx', { eager: true });

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\.\w+$/)![1];
  const normalizedName = name.replaceAll(/^(\w+)/gi, (_p0, p1: string) =>
    _.lowerCase(
      p1.replaceAll(/(b2c|eshop)/gi, (_m0, m1: string) => {
        return m1.toLowerCase();
      })
    )
      .replaceAll(' ', '-')
      .replaceAll('b-2-c', 'b2c')
  );

  return {
    name: _.startCase(_.lowerCase(name)),
    path: name === 'Root' ? '/' : `/pages/${normalizedName}`,
    component: (pages[path] as any).default,
  };
});

const App = () => {
  return (
    <Routes>
      {routes.map(({ path, component: RouteComp }) => {
        return <Route key={path} path={path} element={<RouteComp routes={routes} />}></Route>;
      })}
    </Routes>
  );
};

export { App };
