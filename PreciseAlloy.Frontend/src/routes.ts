import _ from 'lodash';
import RootTemplate from '@xpack/root/template';

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.tsx', { eager: true });

const nodes: RootItemModel[] = [];
const routesToPrerender: { route: string; name: string }[] = [];

Object.keys(pages).forEach((path) => {
  const match = path.match(/\.\/pages\/(.*)\.\w+$/);
  const name = match ? match[1] : '';
  const normalizedName = name.replaceAll(/^(\w+)/gi, (_p0, p1: string) => _.lowerCase(p1).replaceAll(' ', '-'));

  const page = pages[path] as { [key: string]: any };

  if (!page.default.$$name) {
    const node = {
      type: 'single',
      name: _.startCase(_.lowerCase(name)),
      path: name === 'Root' ? '/' : `/pages/${normalizedName}`,
      component: page.default,
    } as SinglePageNode;

    nodes.push(node);
    routesToPrerender.push({ route: node.path, name: normalizedName });

    return;
  }

  const node: MultiplePageNode = {
    type: 'collection',
    name: page.default.$$name,
    items: [],
    path: undefined,
  };

  Object.keys(page).forEach((key) => {
    if (key === 'default') return;
    const item: SinglePageNode = {
      type: 'single',
      path: `/pages/${page.default.$$path}${page[key].path ? `/${page[key].path}` : ''}`,
      name: page[key].name,
      component: page[key].render,
    };

    node.items.push(item);
    routesToPrerender.push({ route: item.path, name: item.name });
  });

  nodes.push(node);
});

const rootItem: SinglePageNode = {
  type: 'single',
  name: 'Root',
  path: '/',
  component: RootTemplate,
};

nodes.push(rootItem);
routesToPrerender.push({ route: rootItem.path, name: rootItem.name });

export { nodes, routesToPrerender };
