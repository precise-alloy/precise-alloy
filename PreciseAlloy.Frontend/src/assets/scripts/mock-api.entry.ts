import mockFetch from "@mock/core/fetch";

const originFetch = window.fetch;

window.fetch = (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
  let url = input;

  if (typeof input === 'string') {
    url = new URL(input);
  }

  if (url instanceof URL && url.origin === window.location.origin && url.pathname.startsWith('/api')) {
    console.log(`You're using mock fetch`);

    return mockFetch(url, init);
  } else {
    console.log(`You're using origin fetch. If you want to use MockFetch please make sure input start with '/api' `);

    return originFetch(input, init);
  }
};