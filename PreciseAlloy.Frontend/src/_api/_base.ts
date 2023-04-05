interface RequestParams {
  [name: string]: string | boolean | undefined;
}

enum Method {
  GET = 'GET',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const getApiUrl = (remain: string, params?: RequestParams) => {
  const baseApiUrl = import.meta.env.VITE_APP_API_URL ?? window.location.origin;
  const url = new URL(remain, baseApiUrl);
  if (params) {
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) {
        url.searchParams.append(key, typeof params[key] === 'boolean' ? (params[key] as boolean).toString() : (params[key] as string));
      }
    });
  }

  return url;
};

const sendAsync = async (remain: string, method: Method, params?: RequestParams, body?: any, skipResponseBody?: boolean) => {
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
};

export const getAsync = async (remain: string, params?: RequestParams) => {
  return sendAsync(remain, Method.GET, params);
};

export const postAsync = async (remain: string, params?: RequestParams, body?: any, skipResponseBody?: boolean) => {
  return sendAsync(remain, Method.POST, params, body, skipResponseBody);
};

export const putAsync = async (remain: string, params?: RequestParams, body?: any, skipResponseBody?: boolean) => {
  return sendAsync(remain, Method.PUT, params, body, skipResponseBody);
};

export const patchAsync = async (remain: string, params?: RequestParams, body?: any, skipResponseBody?: boolean) => {
  return sendAsync(remain, Method.PATCH, params, body, skipResponseBody);
};

export const deleteAsync = async (remain: string, params?: RequestParams, body?: any, skipResponseBody?: boolean) => {
  return sendAsync(remain, Method.DELETE, params, body, skipResponseBody);
};
