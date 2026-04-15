type RuntimeGlobal = typeof globalThis & { window?: Window & typeof globalThis };

const runtimeGlobal = globalThis as RuntimeGlobal;
const runtimeWindow = (typeof window !== 'undefined' ? window : runtimeGlobal) as Window & typeof globalThis;

if (typeof window === 'undefined') {
  runtimeGlobal.window = runtimeWindow;
}

runtimeWindow.appApi =
  runtimeWindow.appApi ||
  (() => {
    const METHODS = {
      GET: 'GET',
      PATCH: 'PATCH',
      POST: 'POST',
      PUT: 'PUT',
      DELETE: 'DELETE',
    } as const;

    type Method = (typeof METHODS)[keyof typeof METHODS];

    const getApiUrl = (remain: string, params?: RequestParams) => {
      const fallbackOrigin = typeof location !== 'undefined' ? location.origin : 'http://localhost';
      const baseApiUrl = import.meta.env.VITE_APP_API_URL ?? fallbackOrigin;
      const url = new URL(remain, baseApiUrl);

      if (params) {
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined) {
            url.searchParams.append(key, typeof params[key] === 'boolean' ? (params[key] as boolean).toString() : (params[key] as string));
          }
        });
      }

      return url.toString();
    };

    const sendAsync = async (remain: string, method: Method, params?: RequestParams, body?: unknown, skipResponseBody?: boolean) => {
      try {
        const url = getApiUrl(remain, params);

        const requestInit: RequestInit = {
          method: method,
        };

        if (body) {
          requestInit.body = JSON.stringify(body);
          requestInit.headers = {
            'Content-Type': 'application/json',
          };
        }

        return skipResponseBody ? fetch(url, requestInit) : fetch(url, requestInit).then((res) => res.json());
      } catch (error) {
        return Promise.reject({
          error: error,
        });
      }
    };

    const getAsync = async (remain: string, params?: RequestParams) => {
      return sendAsync(remain, METHODS.GET, params);
    };

    const postAsync = async (remain: string, params?: RequestParams, body?: unknown, skipResponseBody?: boolean) => {
      return sendAsync(remain, METHODS.POST, params, body, skipResponseBody);
    };

    const putAsync = async (remain: string, params?: RequestParams, body?: unknown, skipResponseBody?: boolean) => {
      return sendAsync(remain, METHODS.PUT, params, body, skipResponseBody);
    };

    const patchAsync = async (remain: string, params?: RequestParams, body?: unknown, skipResponseBody?: boolean) => {
      return sendAsync(remain, METHODS.PATCH, params, body, skipResponseBody);
    };

    const deleteAsync = async (remain: string, params?: RequestParams, body?: unknown, skipResponseBody?: boolean) => {
      return sendAsync(remain, METHODS.DELETE, params, body, skipResponseBody);
    };

    return {
      getAsync,
      postAsync,
      putAsync,
      patchAsync,
      deleteAsync,
    };
  })();
