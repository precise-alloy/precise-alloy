import { afterEach, describe, expect, it, vi } from 'vitest';

const importContactFormApi = async () => {
  vi.resetModules();
  vi.stubEnv('VITE_APP_API_CONTACT_FORM_URL', '/api/contact-form');

  return import('./contact-form');
};

describe('src/_api/contact-form.ts', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('delegates contact form submissions to window.appApi.postAsync using the configured url and body', async () => {
    const postAsync = vi.fn().mockResolvedValue({ success: true });

    window.appApi = {
      getAsync: vi.fn(),
      postAsync,
      putAsync: vi.fn(),
      patchAsync: vi.fn(),
      deleteAsync: vi.fn(),
    };

    const { submitContactForm } = await importContactFormApi();
    const body = {
      name: 'Alice',
      email: 'alice@example.com',
      message: 'Hello',
    };

    await submitContactForm(body);

    expect(postAsync).toHaveBeenCalledWith('/api/contact-form', undefined, body);
  });
});
