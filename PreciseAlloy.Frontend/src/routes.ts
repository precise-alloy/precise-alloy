import _ from 'lodash';
import RootTemplate from '@xpack/root/Template';
import { MultiplePageNode, RootItemModel, SinglePageNode } from '@_types/_root';

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.tsx', { eager: true });

const nodes: RootItemModel[] = [];
const routesToPrerender: { route: string; name: string }[] = [];

Object.keys(pages).forEach((path) => {
  const match = path.match(/\.\/pages\/(.*)\.\w+$/);
  const name = match ? match[1] : '';
  const normalizedName = name.replaceAll(/^(\w+)/gi, (_p0, p1: string) => _.lowerCase(p1).replaceAll(' ', '-'));
  const module = pages[path] as { [key: string]: any };

  if (!module.default.$$name) {
    const node = {
      type: 'single',
      name: _.startCase(_.lowerCase(name)),
      path: name === 'Root' ? '/' : `/pages/${normalizedName}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component: module.default,
    } as SinglePageNode;

    nodes.push(node);
    routesToPrerender.push({ route: node.path, name: normalizedName });
    return;
  }

  const node: MultiplePageNode = {
    type: 'collection',
    name: module.default.$$name,
    items: [],
    path: undefined,
  };

  Object.keys(module).forEach((key) => {
    if (key === 'default') return;
    const item: SinglePageNode = {
      type: 'single',
      path: `/pages/${module.default.$$path}${module[key].path ? `/${module[key].path}` : ''}`,
      name: module[key].name,
      component: module[key].render,
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
