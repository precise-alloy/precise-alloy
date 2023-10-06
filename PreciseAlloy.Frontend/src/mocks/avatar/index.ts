import { avatars } from '@data/avatars';
import { handlers } from '@mocks/handlers';
import { rest } from 'msw';

handlers.push(
  rest.get('/api/avatar', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(avatars));
  })
);
