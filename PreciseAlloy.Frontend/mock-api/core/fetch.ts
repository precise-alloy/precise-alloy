import center from "./event";
import _ from 'lodash';

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

  // Simulate network latency, delay the response between 200 and 2000 miliseconds
  const ms = _.random(200, 2000, true);
  const latency = new Promise(r => setTimeout(r, ms));

  return latency.then(() => new Response(
    JSON.stringify(response.body),
    {
      status: response.status
    }
  ));
}
