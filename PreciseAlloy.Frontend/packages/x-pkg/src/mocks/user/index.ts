import { people } from '@data/people';
import { handlers } from '@mocks/handlers';
import { HttpResponse, http } from 'msw';

handlers.push(
  http.get('/api/user', async () => {
    return HttpResponse.json(people);
  })
);
