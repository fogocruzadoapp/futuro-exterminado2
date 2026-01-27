import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';

const base = process.env.NUXT_APP_BASE_URL || '/';

export default defineNuxtConfig({
  devtools: { enabled: true },

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
      htmlAttrs: {
        lang: 'pt-BR',
      },
      title: 'Futuro Exterminado | Fogo Cruzado',
      meta: [
        {
          name: 'description',
          content:
            'Uma plataforma que mapeia dados e preserva histórias que não podem ser esquecidas.',
        },

        { property: 'og:title', content: 'Futuro Exterminado | Fogo Cruzado' },
        {
          property: 'og:description',
          content:
            'Uma plataforma que mapeia dados e preserva histórias que não podem ser esquecidas.',
        },
        {
          property: 'og:image',
          content: 'https://futuroexterminado.com.br/share-img.png',
        },
        { property: 'og:url', content: 'https://futuroexterminado.com.br/' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Fogo Cruzado' },
        { property: 'og:locale', content: 'pt_BR' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Futuro Exterminado | Fogo Cruzado' },
        {
          name: 'twitter:description',
          content:
            'Uma plataforma que mapeia dados e preserva histórias que não podem ser esquecidas.',
        },
        {
          name: 'twitter:image',
          content: 'https://futuroexterminado.com.br/share-img.png',
        },
        { name: 'twitter:site', content: '@fogocruzado' },

        { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://futuroexterminado.com.br/' },
      ],
    },
  },

  plugins: ['~/plugins/splide.js'],

  nitro: {
    compatibilityDate: '2025-06-27',
    devProxy: {},
    output: {
      publicDir: 'build',
    },
    prerender: {
      routes: [base, `${base}404.html`],
      failOnError: true,
    },
  },

  runtimeConfig: {
    public: {
      MAPBOX_ACCESS_TOKEN: process.env.NUXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    },
  },
});
