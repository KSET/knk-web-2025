<template>
  <PreviewToggle v-if="visualEditingEnabled" />

  <NuxtPage />
</template>

<script setup lang="ts">
const visualEditingEnabled = Boolean(
  useRuntimeConfig().public.sanity?.visualEditing,
)
const { t } = useI18n()
const head = useLocaleHead({ seo: true })

const siteUrl = useSiteConfig().url

useHead({
  htmlAttrs: computed(() => ({
    ...head.value.htmlAttrs,
    lang: head.value.htmlAttrs?.lang || 'hr',
  })),
  link: computed(() => head.value.link ?? []),
  meta: computed(() => head.value.meta ?? []),
  titleTemplate: (title) =>
    !title
      ? 'KSET na Krku'
      : title.includes('KSET na Krku')
        ? title
        : `${title} | KSET na Krku`,
})

useSeoMeta({
  title: 'KSET na Krku',
  description: () => t('meta.description'),
  ogSiteName: 'KSET na Krku',
  ogType: 'website',
  ogTitle: 'KSET na Krku',
  ogDescription: () => t('meta.description'),
  ogImage: `${siteUrl}/assets/icons/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/png',
  ogImageAlt: 'KSET na Krku, 14. - 16. 8. 2026., grad Krk',
  twitterCard: 'summary_large_image',
  twitterImage: `${siteUrl}/assets/icons/og-image.png`,
  twitterImageAlt: 'KSET na Krku, 14. - 16. 8. 2026., grad Krk',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            name: 'KSET na Krku',
            alternateName: 'KNK',
            url: `${siteUrl}/`,
            inLanguage: 'hr',
            publisher: { '@id': `${siteUrl}/#organization` },
          },
          {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'KSET na Krku',
            url: siteUrl,
            logo: `${siteUrl}/assets/icons/kset-logo.svg`,
            sameAs: [
              'https://www.instagram.com/ksetnakrku/',
              'https://www.kset.org/',
            ],
          },
        ],
      }),
    },
  ],
})
</script>

<style>
:root {
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 20px;
  --space-5: 32px;
  --space-6: 52px;
  --space-7: 84px;
  --space-8: 136px;
  --space-9: 220px;

  --text-body: 1rem;
  --text-title: 1.5rem;
  --text-subheading: 2.5rem;
  --text-heading: 3.5rem;
  --text-display: 5rem;

  --line-height-0: 1.2;
  --line-height-1: 1.3;
  --line-height-2: 1.5;

  --white: #fff;
  --black: #101112;
  --gray-200: #ced2d9;
  --gray-600: #6e7683;
  --blue-600: #1e61cd;
  --magenta-100: #f9d7eb;
  --knk-blue: #3a4384;
  --knk-lightblue: #76b3d0;
  --knk-orange: #ff6c1f;
  --knk-yellow: #ebab32;

  --max-width-0: 320px;
  --max-width-1: 768px;
}

html,
body {
  background-color: var(--knk-lightblue);
  font-family: Montserrat, sans-serif;
  text-size-adjust: 100%;
  margin: 0;
}

body {
  font-family: Montserrat;
}

p {
  color: white;
}

.page-title {
  font-family: 'Rokkitt', serif;
  font-size: var(--text-display);
  font-weight: 900;
  color: #efe5dd;
  text-shadow: 3px 4px 0 var(--page-title-shadow, var(--knk-orange));
  margin: 0;
  flex: 1;
  min-width: 0;
  text-align: center;
  overflow-wrap: anywhere;
}

@media (max-width: 480px) {
  .page-title {
    text-shadow: 2px 3px 0 var(--page-title-shadow, var(--knk-orange));
    text-align: left;
  }
}

@media (max-width: 900px) {
  :root {
    --text-title: 1.25rem;
    --text-subheading: 1.8rem;
    --text-heading: 2.5rem;
    --text-display: 3.5rem;
  }
}

@media (max-width: 480px) {
  :root {
    --text-body: 0.9rem;
    --text-title: 1.1rem;
    --text-subheading: 1.5rem;
    --text-heading: 2rem;
    --text-display: 2.75rem;
  }
}

@media (min-width: 2000px) {
  html {
    font-size: 125%;
  }
}
</style>
