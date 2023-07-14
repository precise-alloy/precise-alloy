import mockFetch from "@mock/core/fetch";

const originFetch = window.fetch;

window.fetch = (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {
  if (typeof input !== 'string' || !input.startsWith('/api')) {
    console.log(`You're using origin fetch. If you want to use MockFetch please make sure input is string and start with '/api' `);

    return originFetch(input, init);
  }

  console.log(`You're using mock fetch`);

  return mockFetch(input, init);
};