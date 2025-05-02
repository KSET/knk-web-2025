// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  css: ['@/assets/fonts/fonts.css'],
  vite: {
    plugins: [tsconfigPaths()],
  },
  modules: [
    '@nuxtjs/sanity',
    '@primevue/nuxt-module',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Montserrat: [500, 700],
          'IBM Plex Mono': [500, 700],
          Inter: [500, 700, 800],
          'PT Serif': [400, 700],
          download: true,
          inject: true,
        },
      },
    ],
  ],

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
})
