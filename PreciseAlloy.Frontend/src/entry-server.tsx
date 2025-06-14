import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { routesToPrerender } from './routes';
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
