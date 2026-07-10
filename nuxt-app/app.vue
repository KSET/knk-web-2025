<template>
  <a
    v-if="previewEnabled && !inFrame"
    :href="`/preview/disable?redirect=${route.fullPath}`"
    class="preview-toggle"
  >
    <span>Preview Enabled</span>
    <span>Disable Preview</span>
  </a>

  <NuxtPage />
</template>

<script setup lang="ts">
const route = useRoute()
const { enabled: previewEnabled, inFrame } = useSanityVisualEditingState()
const { t } = useI18n()
const head = useLocaleHead({ addSeoAttributes: true })

useHead({
  title: 'KSET na Krku',
  meta: [{ name: 'description', content: () => t('meta.description') }],
  htmlAttrs: { lang: () => head.value.htmlAttrs?.lang || 'hr' },
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
  --knk-blue: #3A4384;
  --knk-lightblue: #76B3D0;
  --knk-orange: #FF6C1F;
  --knk-yellow: #EBAB32;

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
  color: #efe5dd;
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
