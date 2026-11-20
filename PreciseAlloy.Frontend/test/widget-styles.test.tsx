import { getAllAvatars } from '@_api/avatar';
import { avatars } from '@data/avatars';
import { people } from '@data/people';
import Header from '@organisms/header';
import People from '@organisms/people';
import TemplateHeader from '@templates/header';
import Home from '@templates/home';
import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@_api/avatar', () => ({ getAllAvatars: vi.fn() }));

describe('widget resource ownership', () => {
  it('declares child styles in the initial page only when the People block is present', () => {
    const withPeople = renderToStaticMarkup(<Home people={people} />);
    const withoutPeople = renderToStaticMarkup(<Home />);

    for (const style of ['b-people', 'b-avatar']) {
      expect(withPeople.split(`href="/assets/css/${style}.css"`)).toHaveLength(2);
      expect(withoutPeople).not.toContain(`/assets/css/${style}.css`);
    }
  });

  it('mounts avatars after the API responds without adding stylesheet links', async () => {
    vi.mocked(getAllAvatars).mockResolvedValueOnce(avatars);
    render(<People {...people} />);
    expect(await screen.findByText(avatars[0]!.name!)).toBeInTheDocument();
    expect(document.querySelector('link[rel="stylesheet"]')).toBeNull();
  });

  it('keeps Header resources in the page template, not the client widget', () => {
    const template = renderToStaticMarkup(<TemplateHeader />);

    expect(template).toContain('href="/assets/css/b-header.css"');
    expect(template).toContain('src="/assets/js/header.js"');
    render(<Header />);
    expect(document.querySelector('link[rel="stylesheet"], script[src]')).toBeNull();
  });
});
