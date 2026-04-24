import { afterEach, describe, expect, it, vi } from 'vitest';

const importAvatarApi = async () => {
  vi.resetModules();
  vi.stubEnv('VITE_APP_API_AVATAR_URL', '/api/avatar');

  return import('./avatar');
};

describe('src/_api/avatar.ts', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('delegates avatar requests to window.appApi.getAsync using the configured url', async () => {
    const getAsync = vi.fn().mockResolvedValue([]);

    window.appApi = {
      getAsync,
      postAsync: vi.fn(),
      putAsync: vi.fn(),
      patchAsync: vi.fn(),
      deleteAsync: vi.fn(),
    };

    const { getAllAvatars } = await importAvatarApi();

    await getAllAvatars();

    expect(getAsync).toHaveBeenCalledWith('/api/avatar');
  });
});
