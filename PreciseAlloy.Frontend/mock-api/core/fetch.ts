import center from "./event";

export default function mockFetch(input: URL | RequestInfo, req?: RequestInit): Promise<Response> {
  if (typeof input === 'string') {
    input = new URL(input, window.location.origin);
  }

  if (input instanceof Request) {
    console.log(`${input.url}: you're using origin fetch`);

    return window.originFetch(input, req);
  }

  const response = center.dispatch({ url: input, req });

  if (response.status && response.status === 404) {
    console.log(`${input.href}: The api is not exists in mock, fallback to origin fetch`);

    return window.originFetch(input, req);
  }

  console.log(`${input.href}: you're using mock fetch`);

  return new Promise(resolve => {
    resolve(
      new Response(
        JSON.stringify(response.body),
        {
          status: response.status
        }
      )
    )
  })
}
