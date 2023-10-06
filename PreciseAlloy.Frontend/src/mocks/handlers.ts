import { avatars } from '@data/avatars';
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/avatar', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(avatars));
  }),
];
