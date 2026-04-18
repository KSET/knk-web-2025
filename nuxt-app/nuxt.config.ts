// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          type: 'text/css',
          href: 'https://karte.kset.org/kset/kset-na-krku/widget/v1.css',
          crossorigin: '',
        },
      ],
      script: [
        {
          src: 'https://karte.kset.org/widget/v1.en.js',
          async: true,
          crossorigin: '',
        },
      ],
    },
  },
  css: ['@/assets/fonts/fonts.css'],
  vite: {
    plugins: [tsconfigPaths()],
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'pretix-widget',
        },
      },
    },
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/sanity',
    '@primevue/nuxt-module',
    '@nuxtjs/i18n',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Montserrat: [500, 700],
          'IBM Plex Mono': [500, 700],
          Inter: [500, 700, 800],
          'PT Serif': [400, 700],
          Rokkitt: [700, 800, 900],
          download: true,
          inject: true,
        },
      },
    ],
  ],

  i18n: {
    locales: [
      { code: 'hr', file: 'hr.json', name: 'Hrvatski' },
      { code: 'en', file: 'en.json', name: 'English' },
    ],
    defaultLocale: 'hr',
    strategy: 'prefix_except_default',
    langDir: 'locales/',
    detectBrowserLanguage: false,
    pages: {
      'kampiranje/index': {
        en: '/camping',
        hr: '/kampiranje',
      },
      'pravila/index': {
        en: '/rules',
        hr: '/pravila',
      },
      'politika-privatnosti/index': {
        en: '/privacy-policy',
        hr: '/politika-privatnosti',
      },
    },
  },

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    },
  },

  sanity: {
    projectId: process.env.NUXT_SANITY_PROJECT_ID,
    dataset: process.env.NUXT_SANITY_DATASET,
    useCdn: true, // `false` if you want to ensure fresh data
    apiVersion: process.env.NUXT_SANITY_API_VERSION || '2024-03-15',
    visualEditing: {
      studioUrl: process.env.NUXT_SANITY_STUDIO_URL || 'http://localhost:3333',
      token: process.env.NUXT_SANITY_API_READ_TOKEN,
      stega: true,
    },
  },

  postcss: {
    plugins: {
      autoprefixer: {},
      'postcss-nested': {},
    },
  },

  compatibilityDate: '2024-12-17',

  ssr: false,
  nitro: {
    preset: 'static',
    prerender: {
      routes: [
        '/en',
        '/en/tickets',
        '/en/festival',
        '/en/lineup',
        '/en/camping',
        '/en/gallery',
        '/en/rules',
        '/en/privacy-policy',
      ],
    },
  },
})
