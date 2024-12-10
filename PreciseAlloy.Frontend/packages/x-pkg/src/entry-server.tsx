import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { App } from './App';
import { routesToPrerender } from './routes';

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
