import { RootModel } from '@_types/_root';
import { lazy } from 'react';
import ReactDOM from 'react-dom/client';

interface BlockInterface {
  [name: string]: React.LazyExoticComponent<({ routes }: RootModel) => JSX.Element>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const blocks: BlockInterface = {
  root: lazy(() => import('../xpack/root/Root')),
};

export const loadComponent = (blocks: BlockInterface, scriptSection: HTMLScriptElement) => {
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

export const loadComponents = (blocks: BlockInterface) => {
  // rct stands for 'react component type'
  const scriptSections = document.querySelectorAll('script[data-rct]');

  [].forEach.call(scriptSections, loadComponent.bind(null, blocks));
};

loadComponents(blocks);
window.addEventListener('load', () => loadComponents(blocks));
