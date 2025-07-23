import { Route, Routes } from 'react-router-dom';
import { viteAbsoluteUrl } from '@helpers/functions';
import { createElement, ReactElement } from 'react';
import { MultiplePageNode, SinglePageNode } from '@_types/_root';

import { nodes } from './routes';

const App = () => {
  const renderRoutes = () => {
    const result: ReactElement[] = [];

    nodes.forEach((node) => {
      if (node.type === 'single' && node.component) {
        result.push(<Route key={node.path} element={createElement(node.component, { routes: nodes })} path={viteAbsoluteUrl(node.path, true)} />);

        return;
      }
      const multiplePageNode = node as MultiplePageNode;

      multiplePageNode.items.forEach((item: SinglePageNode) => {
        if (item.component)
          result.push(<Route key={item.path} element={createElement(item.component, { routes: nodes })} path={viteAbsoluteUrl(item.path, true)} />);
      });
    });

    return result;
  };

  return <Routes>{renderRoutes()}</Routes>;
};

export { App };
