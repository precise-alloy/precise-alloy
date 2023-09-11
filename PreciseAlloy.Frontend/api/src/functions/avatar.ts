import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { AvatarModel } from '../../../src/_types/organisms';

export const avatars: AvatarModel[] = [
  {
    name: 'Peg Legge',
    image: {
      src: '/samples/peg-legge.svg',
      width: '175',
      height: '175',
      alt: 'people 1',
    },
    jobTitle: 'CEO',
  },
  {
    name: 'Richard Guerra',
    image: {
      src: '/samples/richard-guerra.svg',
      width: '175',
      height: '175',
      alt: 'people 2',
    },
    jobTitle: 'CEO',
  },
  {
    name: 'Alexandra Stolz',
    image: {
      src: '/samples/alexandra-stolz.svg',
      width: '175',
      height: '175',
      alt: 'people 3',
    },
    jobTitle: 'CEO',
  },
  {
    name: 'Janet Bray',
    image: {
      src: '/samples/janet-bray.svg',
      width: '175',
      height: '175',
      alt: 'people 4',
    },
    jobTitle: 'CEO',
  },
];

export async function getAvatars(_request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
  return {
    jsonBody: avatars,
  };
}

app.http('avatar', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: getAvatars,
});
