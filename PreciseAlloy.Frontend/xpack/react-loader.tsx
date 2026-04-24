import { lazy } from 'react';
import ReactDOM from 'react-dom/client';

import { clientComponents } from '../src/client-components';

const blocks: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  root: lazy(() => import('./root')),
  ...clientComponents,
};

const SAFE_CONTAINER_TAGS = new Set([
  'section',
  'div',
  'article',
  'main',
  'aside',
  'header',
  'footer',
  'nav',
  'span',
]);

const getSafeTagName = (tagName: string | null): string => {
  const normalizedTag = (tagName ?? '').trim().toLowerCase();
  return SAFE_CONTAINER_TAGS.has(normalizedTag) ? normalizedTag : 'section';
};

const renderComponent = (scriptSection: HTMLScriptElement) => {
  const blockType = scriptSection.getAttribute('data-rct');
  const data = scriptSection.textContent ? scriptSection.textContent : '{}';

  if (!blockType || !data) {
    return;
  }

  const Component = blocks[blockType];

  if (Component) {
    scriptSection.textContent = null;
    const tagName = getSafeTagName(scriptSection.getAttribute('data-tag'));
    const section = document.createElement(tagName);

    section.className = scriptSection.getAttribute('data-class') ?? '';
    scriptSection.replaceWith(section);

    const props = JSON.parse(data);

    ReactDOM.createRoot(section).render(<Component {...props} />);
  } else {
    return <></>;
  }
};

const renderComponents = () => {
  // rct stands for 'react component type'
  const scriptSections = document.querySelectorAll('script[data-rct]');

  [].forEach.call(scriptSections, renderComponent);
};

window.renderComponents = renderComponents;
renderComponents();
window.addEventListener('load', () => renderComponents());

// Post a custom event to notify that the renderComponents function is ready to be used
// Usage:
// if (window.renderComponents) {
//   window.renderComponents();
// } else {
//   window.addEventListener('react-loaded', () => {
//     window.renderComponents();
//   });
// }
const event = new CustomEvent('react-loaded');

window.dispatchEvent(event);
