/* eslint-disable no-console */

import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import '../src/assets/scripts/main/functions';
import '../src/assets/scripts/main/api';
import { routesToPrerender } from '../src/routes';

import { App } from './app';

interface RenderOutput {
  html: string;
  styles: string;
}

export function render(url: string): RenderOutput {
  const renderOutput: RenderOutput = {
    html: '',
    styles: '',
  };

  try {
    const html = ReactDOMServer.renderToString(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    );

    renderOutput.html = html;
  } catch (error) {
    console.log(error);
  }

  return renderOutput;
}

export { routesToPrerender };
