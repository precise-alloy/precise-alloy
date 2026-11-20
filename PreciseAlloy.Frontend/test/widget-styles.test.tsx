import { getAllAvatars } from '@_api/avatar';
import { avatars } from '@data/avatars';
import { people } from '@data/people';
import Avatar from '@organisms/avatar';
import Header from '@organisms/header';
import People from '@organisms/people';
import Home from '@templates/home';
import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@_api/avatar', () => ({ getAllAvatars: vi.fn() }));

describe('widget resource ownership', () => {
  it('keeps the existing People stylesheet as the only requirement next to the widget payload', () => {
    const withPeople = renderToStaticMarkup(<Home people={people} />);
    const withoutPeople = renderToStaticMarkup(<Home />);

    const main = new DOMParser().parseFromString(withPeople, 'text/html').querySelector('main')!;
    const requirement = main.querySelector('script[data-rct="people"]')?.previousElementSibling;

    expect(requirement?.matches('link[data-pl-require][href="/assets/css/b-people.css"]')).toBe(true);
    expect(withPeople).not.toContain('b-avatar.css');
    expect(withoutPeople).not.toContain('b-people.css');
  });

  it('mounts avatars after the API responds without adding stylesheet links', async () => {
    vi.mocked(getAllAvatars).mockResolvedValueOnce(avatars);
    render(<People {...people} />);
    expect(await screen.findByText(avatars[0]!.name!)).toBeInTheDocument();
    expect(document.querySelector('link[rel="stylesheet"]')).toBeNull();
  });

  it('keeps resource markers inside standalone organisms for backend integration', () => {
    const fragment = new DOMParser().parseFromString(
      renderToStaticMarkup(
        <>
          <Header />
          <Avatar {...avatars[0]!} />
        </>
      ),
      'text/html'
    );

    expect(fragment.querySelector('header > link[data-pl-require][href="/assets/css/b-header.css"]')).not.toBeNull();
    expect(fragment.querySelector('header > script[data-pl-require][src="/assets/js/header.js"]')).not.toBeNull();
    expect(fragment.querySelector('.zzz-o-avatar > link[data-pl-require][href="/assets/css/b-avatar.css"]')).not.toBeNull();
  });
});
