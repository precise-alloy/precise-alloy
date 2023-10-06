import { people } from '@data/people';
import { handlers } from '@mocks/handlers';
import { rest } from 'msw';

handlers.push(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(people));
  })
);
