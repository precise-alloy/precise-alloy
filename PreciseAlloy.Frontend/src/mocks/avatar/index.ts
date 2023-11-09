import { avatars } from '@data/avatars';
import { handlers } from '@mocks/handlers';
import { HttpResponse, http } from 'msw';

handlers.push(
  http.get('/api/avatar', () => {
    return HttpResponse.json(avatars);
  })
);
