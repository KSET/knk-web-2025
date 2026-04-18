<script setup lang="ts">
import { ref } from 'vue'
import Footer from '~/components/Footer.vue'

const visibleRight = ref(false)

import type { Translation } from '~/types/Translation'

const query2 = groq`*[ _type == "translation"]`
const { data: translationsRaw } = await useSanityQuery<Translation[]>(query2)

const { locale } = useI18n()

const translations = Object.fromEntries(
  translationsRaw.value?.map((entry) => [entry.key, { hr: entry.text, en: entry.textEn }]) || [],
)

const pravilaBlocks = computed(() => {
  const t = translations?.opcaPravilaText
  return (locale.value === 'en' && t?.en) ? t.en : t?.hr
})

useHead({
  bodyAttrs: {
    style: 'background-color: var(--knk-blue);',
  },
})
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee backgroundColor="var(--knk-blue)" />

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
      <BlockContent :blocks="pravilaBlocks" class="info-text" />
    </div>
  </div>

  <Footer />
  <Marquee backgroundColor="var(--knk-blue)" />
  <NavDrawer v-model="visibleRight" />
</template>

<style scoped>
.page-container {
  max-width: 50rem;
  width: 100%;
  padding: 1rem;

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

  background-color: #f5c518;
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
