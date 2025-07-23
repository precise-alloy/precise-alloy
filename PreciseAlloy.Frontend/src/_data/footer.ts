import { FooterModel } from '@_types/types';

const footer: FooterModel = {
  globalModifier: ['section-margin-top-xl'],
  linkList: {
    items: [
      {
        icon: {
          styleModifier: ['md'],
          iconPath: '#zzz-facebook',
          viewBoxWidth: 10,
          viewBoxHeight: 19,
        },
        url: 'https://www.facebook.com/',
        ariaLabel: 'click to facebook',
      },
      {
        icon: {
          styleModifier: ['md'],
          iconPath: '#zzz-instagram',
          viewBoxWidth: 19,
          viewBoxHeight: 19,
        },
        url: 'https://www.instagram.com/',
        ariaLabel: 'click to instagram',
      },
      {
        icon: {
          styleModifier: ['md'],
          iconPath: '#zzz-twitter',
          viewBoxWidth: 19,
          viewBoxHeight: 19,
        },
        url: 'https://www.twitter.com/',
        ariaLabel: 'click to twitter',
      },
      {
        icon: {
          styleModifier: ['md'],
          iconPath: '#zzz-pinterest',
          viewBoxWidth: 19,
          viewBoxHeight: 19,
        },
        url: 'https://www.pinterest.com/',
        ariaLabel: 'click to pinterest',
      },
      {
        icon: {
          styleModifier: ['md'],
          iconPath: '#zzz-tiktok',
          viewBoxWidth: 19,
          viewBoxHeight: 19,
        },
        url: 'https://www.tiktok.com/',
        ariaLabel: 'click to tiktok',
      },
      {
        icon: {
          styleModifier: ['md'],
          iconPath: '#zzz-whatsapp',
          viewBoxWidth: 19,
          viewBoxHeight: 19,
        },
        url: 'https://www.whatsapp.com/',
        ariaLabel: 'click to whatsapp',
      },
      {
        icon: {
          styleModifier: ['md'],
          iconPath: '#zzz-youtube',
          viewBoxWidth: 19,
          viewBoxHeight: 19,
        },
        url: 'https://www.youtube.com/',
        ariaLabel: 'click to youtube',
      },
    ],
  },
  copyright: '<p>© Start, 2022. All rights reserved.</p>',
};

export { footer };
