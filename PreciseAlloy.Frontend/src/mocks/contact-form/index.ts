import { contactFormFailed, contactFormSuccess } from '@data/contact';
import { people } from '@data/people';
import { handlers } from '@mocks/handlers';
import { ContactFormBodyRequestModel } from '@organisms/contact/contact-form';
import { HttpResponse, http } from 'msw';

handlers.push(
  http.post('/api/contact-form', async ({ request }) => {
    const { email } = (await request.json()) as ContactFormBodyRequestModel;

    HttpResponse.json(people);

    return email && email.includes('failed') ? HttpResponse.json(contactFormFailed) : HttpResponse.json(contactFormSuccess);
  })
);
