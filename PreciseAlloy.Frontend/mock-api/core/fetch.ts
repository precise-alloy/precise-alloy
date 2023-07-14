import center from "./event";

export default function mockFetch(url: string, req?: RequestInit): Promise<Response> {
  const response = center.dispatch({ url, req });

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
