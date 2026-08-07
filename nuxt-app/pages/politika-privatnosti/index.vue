<script setup lang="ts">
import { ref } from 'vue'
import Footer from '~/components/Footer.vue'

const visibleRight = ref(false)
const toggleVisibleRight = (): void => {
  visibleRight.value = !visibleRight.value
}

import type { Translation } from '~/types/Translation'

const query2 = groq`*[ _type == "translation"]`
const { data: translationsRaw } = await useSanityQuery<Translation[]>(query2)

const { locale, t } = useI18n()

useSeoMeta({
  title: () => t('meta.pages.privacy.title'),
  description: () => t('meta.pages.privacy.description'),
  ogTitle: () => `${t('meta.pages.privacy.title')} | KSET na Krku`,
  ogDescription: () => t('meta.pages.privacy.description'),
})

const translations = Object.fromEntries(
  translationsRaw.value?.map((entry) => [
    entry.key,
    { hr: entry.text, en: entry.textEn },
  ]) || [],
)

const privacyBlocks = computed(() => {
  const t = translations?.politikaPrivatnostiText
  return locale.value === 'en' && t?.en ? t.en : t?.hr
})

useHead({
  bodyAttrs: {
    style: 'background-color: var(--knk-yellow);',
  },
})
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee backgroundColor="var(--knk-blue)" />

  <div class="page-header">
    <p class="page-title">{{ $t('footer.privacyPolicy') }}</p>
    <div class="header-right">
      <LanguageSwitcher />
      <img
        src="/assets/icons/burger.svg?v=2"
        alt="burger"
        @click="toggleVisibleRight"
        class="burger-icon"
      />
    </div>
  </div>

  <div class="page-wrapper">
    <img src="/assets/icons/oblak-1.svg" alt="oblak" class="oblak oblak-1" />
    <img src="/assets/icons/oblak-2.svg" alt="oblak" class="oblak oblak-2" />
    <img src="/assets/icons/oblak-3.svg" alt="oblak" class="oblak oblak-3" />
    <img src="/assets/icons/oblak-4.svg" alt="oblak" class="oblak oblak-4" />
    <img src="/assets/icons/oblak-1.svg" alt="oblak" class="oblak oblak-5" />
    <img src="/assets/icons/oblak-3.svg" alt="oblak" class="oblak oblak-6" />
    <img src="/assets/icons/oblak-2.svg" alt="oblak" class="oblak oblak-7" />
    <img src="/assets/icons/oblak-4.svg" alt="oblak" class="oblak oblak-8" />

    <div class="page-container">
      <BlockContent :blocks="privacyBlocks" class="info-text" />
    </div>
  </div>

  <Footer backgroundColor="var(--knk-yellow)" />
  <Marquee backgroundColor="var(--knk-blue)" />
  <NavDrawer v-model="visibleRight" />
</template>

<style scoped>
.page-header {
  background-color: var(--knk-yellow);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  position: relative;
  padding: 1.5rem 1rem;
}

.header-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.burger-icon {
  cursor: pointer;
  width: 2.5rem;
  border-radius: 0;
}

@media (max-width: 480px) {
  .burger-icon {
    width: 1.8rem;
  }

  .page-header {
    padding: 1rem;
  }

  .page-container {
    width: calc(100% - 2rem);
  }
}

.page-container {
  max-width: 50rem;
  width: 90%;
  margin: 0 auto;
  padding: 1rem 0;

  position: relative;
  z-index: 1;
  color: black;
}

.page-container :deep(p),
.page-container :deep(a),
.page-container :deep(span),
.page-container :deep(li) {
  color: black;
}

.page-wrapper {
  min-height: 70vh;
  position: relative;

  background-color: var(--knk-yellow);
  height: fit-content;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  padding-top: 2rem;
  overflow: hidden;
  color: black;
}

.oblak {
  position: absolute;
  pointer-events: none;
  opacity: 0.8;
  z-index: 0;
}

.oblak-1 {
  top: 1rem;
  left: -2rem;
  width: 12rem;
}

.oblak-2 {
  top: 6rem;
  right: -1rem;
  width: 10rem;
}

.oblak-3 {
  top: 18rem;
  left: 1rem;
  width: 9rem;
}

.oblak-4 {
  top: 28rem;
  right: 0;
  width: 11rem;
}

.oblak-5 {
  top: 38rem;
  right: 3rem;
  width: 8rem;
}

.oblak-6 {
  top: 48rem;
  left: -1rem;
  width: 10rem;
}

.oblak-7 {
  bottom: 10rem;
  left: 4rem;
  width: 11rem;
}

.oblak-8 {
  bottom: 2rem;
  right: -2rem;
  width: 9rem;
}
</style>
