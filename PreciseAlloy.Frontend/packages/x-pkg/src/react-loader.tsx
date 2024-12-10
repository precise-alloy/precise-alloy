import { lazy } from 'react';
import ReactDOM from 'react-dom/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blocks: { [name: string]: any } = {
  root: lazy(() => import('../xpack/root/Root')),
  people: lazy(() => import('./organisms/people/People')),
  header: lazy(() => import('./organisms/header/Header')),
};

const loadComponent = (scriptSection: HTMLScriptElement) => {
  const blockType = scriptSection.getAttribute('data-rct');
  const data = scriptSection.textContent ? scriptSection.textContent : '{}';

  if (!blockType || !data) {
    return;
  }

  const Component = blocks[blockType];
  if (Component) {
    scriptSection.textContent = null;
    const section = document.createElement(scriptSection.getAttribute('data-tag') ?? 'section');
    section.className = scriptSection.getAttribute('data-class') ?? '';
    scriptSection.replaceWith(section);

    const props = JSON.parse(data);
    ReactDOM.createRoot(section).render(<Component {...props} />);
  } else {
    return <></>;
  }
};

const loadComponents = () => {
  // rct stands for 'react component type'
  const scriptSections = document.querySelectorAll('script[data-rct]');

  [].forEach.call(scriptSections, loadComponent);
};

loadComponents();
window.addEventListener('load', () => loadComponents());
