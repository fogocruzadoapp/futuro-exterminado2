import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';

const base = process.env.NUXT_APP_BASE_URL || '/';

export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ['~/assets/css/fonts.css', '~/assets/css/global.css'],
  modules: ['nuxt-svgo', '@nuxtjs/google-fonts'],

  svgo: {
    autoImportPath: './assets/icons',
    svgoConfig: {
      plugins: [
        {
          name: 'removeAttrs',
          params: {
            attrs: '(fill|stroke)',
            preserveCurrentColor: true,
          },
        },
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    baseURL: base,
    head: {
      title: 'Futuro Exterminado | Fogo Cruzado',
      meta: [
        { name: 'description', content: 'Descrição do projeto.' },
        { property: 'og:image', content: '/assets/images/share-img.png' },
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }],
    },
  },

  plugins: ['~/plugins/splide.js'],

  nitro: {
    compatibilityDate: '2025-06-27',
    devProxy: {},
    prerender: {
      routes: [
        base,
        `${base}404.html`, 
      ],
      failOnError: true,
    },
  },

  runtimeConfig: {
    FC_EMAIL: process.env.FC_EMAIL,
    FC_PASSWORD: process.env.FC_PASSWORD,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    FROM_EMAIL: process.env.FROM_EMAIL,
    FROM_NAME: process.env.FROM_NAME,
    TO_EMAIL: process.env.TO_EMAIL,
    public: {
      MAPBOX_ACCESS_TOKEN: process.env.NUXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZm9nb2NydXphZG8iLCJhIjoiY2xlbmNicXE1MDN3bDN5bWg3MHVkOHdlZCJ9.KLnBRniUM1mXT6boddOXRw',
    },
  },
});
