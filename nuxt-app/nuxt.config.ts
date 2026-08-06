// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura'
import tsconfigPaths from 'vite-tsconfig-paths'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://knk.kset.org'
const visualEditingEnabled = process.env.NUXT_SANITY_VISUAL_EDITING === 'true'

const localizedPages: [string, string][] = [
  ['/', '/en'],
  ['/tickets', '/en/tickets'],
  ['/festival', '/en/festival'],
  ['/lineup', '/en/lineup'],
  ['/workshops', '/en/workshops'],
  ['/schedule', '/en/schedule'],
  ['/kampiranje', '/en/camping'],
  ['/gallery', '/en/gallery'],
  ['/pravila', '/en/rules'],
  ['/politika-privatnosti', '/en/privacy-policy'],
]

const sitemapUrls = localizedPages.flatMap(([hr, en]) => {
  const alternatives = [
    { hreflang: 'hr', href: hr },
    { hreflang: 'en', href: en },
    { hreflang: 'x-default', href: hr },
  ]
  return [
    { loc: hr, alternatives },
    { loc: en, alternatives },
  ]
})

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
        {
          rel: 'stylesheet',
          type: 'text/css',
          href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
          integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
          crossorigin: '',
        },
      ],
      script: [
        {
          src: 'https://karte.kset.org/widget/v1.en.js',
          async: true,
          crossorigin: '',
        },
        {
          src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
          integrity: 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=',
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
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Montserrat: [500, 700],
          Rokkitt: [500, 600, 700, 900],
        },
        download: true,
        inject: true,
      },
    ],
  ],

  site: {
    url: siteUrl,
    name: 'KSET na Krku',
  },

  i18n: {
    baseUrl: siteUrl,
    locales: [
      { code: 'hr', language: 'hr', file: 'hr.json', name: 'Hrvatski' },
      { code: 'en', language: 'en', file: 'en.json', name: 'English' },
    ],
    defaultLocale: 'hr',
    strategy: 'prefix_except_default',
    langDir: 'locales/',
    detectBrowserLanguage: false,
    customRoutes: 'config',
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
    useCdn: true,
    apiVersion: process.env.NUXT_SANITY_API_VERSION || '2024-03-15',
    ...(visualEditingEnabled
      ? {
          visualEditing: {
            studioUrl:
              process.env.NUXT_SANITY_STUDIO_URL || 'http://localhost:3333',
            token: process.env.NUXT_SANITY_API_READ_TOKEN,
            stega: true,
          },
        }
      : {}),
  },

  postcss: {
    plugins: {
      autoprefixer: {},
      'postcss-nested': {},
    },
  },

  sitemap: {
    exclude: ['/not-found', '/en/not-found'],
    sitemaps: false,
    excludeAppSources: true,
    urls: sitemapUrls,
  },

  robots: {
    sitemap: `${siteUrl}/sitemap.xml`,
  },


  compatibilityDate: '2024-12-17',

  ssr: true,
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: [
        '/',
        // Only linked from the nav drawer, which PrimeVue's Portal skips during
        // SSR, so crawlLinks never reaches it.
        '/schedule',
        '/not-found',
        '/en/not-found',
        '/en',
        '/en/tickets',
        '/en/festival',
        '/en/lineup',
        '/en/workshops',
        '/en/schedule',
        '/en/camping',
        '/en/gallery',
        '/en/rules',
        '/en/privacy-policy',
      ],
    },
  },
})
