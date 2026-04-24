import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const importApiModule = async (env: Record<string, string> = {}) => {
  vi.resetModules();
  vi.unstubAllEnvs();
  Object.defineProperty(window, 'appApi', {
    configurable: true,
    writable: true,
    value: undefined,
  });

  Object.entries(env).forEach(([key, value]) => {
    vi.stubEnv(key, value);
  });

  await import('./api');
};

describe('src/assets/scripts/main/api.ts', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('builds request URLs from the configured API base and serializes params', async () => {
    const response = { ok: true };
    const json = vi.fn().mockResolvedValue(response);
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ json } as unknown as Response);

    await importApiModule({ VITE_APP_API_URL: 'https://api.example.test/base/' });

    await expect(window.appApi.getAsync('users', { search: 'alice', active: true, skip: undefined })).resolves.toEqual(response);

    expect(fetchSpy).toHaveBeenCalledWith('https://api.example.test/base/users?search=alice&active=true', {
      method: 'GET',
    });
  });

  it('falls back to the current location origin when no API base is configured', async () => {
    const json = vi.fn().mockResolvedValue({ status: 'ok' });
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ json } as unknown as Response);

    await importApiModule();

    await window.appApi.getAsync('/health');

    expect(fetchSpy).toHaveBeenCalledWith(`${window.location.origin}/health`, {
      method: 'GET',
    });
  });

  it('sends JSON bodies for POST requests and returns parsed JSON by default', async () => {
    const response = { success: true };
    const json = vi.fn().mockResolvedValue(response);
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ json } as unknown as Response);

    await importApiModule({ VITE_APP_API_URL: 'https://api.example.test/' });

    await expect(window.appApi.postAsync('contact', undefined, { name: 'Alice' })).resolves.toEqual(response);

    expect(fetchSpy).toHaveBeenCalledWith('https://api.example.test/contact', {
      method: 'POST',
      body: JSON.stringify({ name: 'Alice' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('returns the raw fetch response when skipResponseBody is true', async () => {
    const rawResponse = { status: 204 } as Response;

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(rawResponse);

    await importApiModule({ VITE_APP_API_URL: 'https://api.example.test/' });

    await expect(window.appApi.postAsync('contact', undefined, { name: 'Alice' }, true)).resolves.toBe(rawResponse);
  });

  it('exposes the remaining HTTP verbs with the expected methods', async () => {
    const json = vi.fn().mockResolvedValue({ ok: true });
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ json } as unknown as Response);

    await importApiModule({ VITE_APP_API_URL: 'https://api.example.test/' });

    await window.appApi.putAsync('items/1', undefined, { name: 'A' });
    await window.appApi.patchAsync('items/1', undefined, { name: 'B' });
    await window.appApi.deleteAsync('items/1');

    expect(fetchSpy).toHaveBeenNthCalledWith(1, 'https://api.example.test/items/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'A' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(fetchSpy).toHaveBeenNthCalledWith(2, 'https://api.example.test/items/1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'B' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(fetchSpy).toHaveBeenNthCalledWith(3, 'https://api.example.test/items/1', {
      method: 'DELETE',
    });
  });

  it('wraps URL construction errors in the documented error shape', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ json: vi.fn() } as unknown as Response);

    await importApiModule({ VITE_APP_API_URL: '::invalid-url::' });

    await expect(window.appApi.getAsync('users')).rejects.toMatchObject({
      error: expect.any(Error),
    });
  });
});
