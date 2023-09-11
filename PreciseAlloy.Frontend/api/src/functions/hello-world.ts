import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

export async function helloWorld(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const name = request.query.get('name') || (await request.text()) || 'world';

  return {
    jsonBody: {
      greeting: 'Hello',
      name,
    },
  };
}

app.http('hello-world', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: helloWorld,
});
