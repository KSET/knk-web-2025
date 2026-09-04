<script setup lang="ts">
// Ticketing is closed for now, so this route redirects home. Caddy 302s it
// server-side; this covers dev, where Caddy isn't in play. Delete these three
// lines to bring the page back — everything below still works.
const localePath = useLocalePath()
await navigateTo(localePath('/'), { redirectCode: 302 })

const { t } = useI18n()
useSeoMeta({
  title: () => t('meta.pages.tickets.title'),
  description: () => t('meta.pages.tickets.description'),
  ogTitle: () => `${t('meta.pages.tickets.title')} | KSET na Krku`,
  ogDescription: () => t('meta.pages.tickets.description'),
})

import { ref } from 'vue'
import Footer from '~/components/Footer.vue'

const visibleRight = ref(false)
const toggleVisibleRight = (): void => {
  visibleRight.value = !visibleRight.value
}

import { onMounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://karte.kset.org/widget/v1.en.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
})
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee backgroundColor="var(--knk-blue)" />

  <div class="page-header">
    <p class="page-title">{{ $t('nav.tickets') }}</p>
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
      <client-only>
        <div
          class="pretix-widget-compat"
          event="https://karte.kset.org/kset/knk-26/"
          single-item-select="button"
        ></div>
      </client-only>
      <noscript>
        <div class="pretix-widget">
          <div class="pretix-widget-info-message">
            JavaScript is disabled in your browser. To access our ticket shop
            without JavaScript, please
            <a
              target="_blank"
              rel="noopener"
              href="https://karte.kset.org/kset/knk-26/"
              >click here</a
            >.
          </div>
        </div>
      </noscript>
    </div>
  </div>

  <Footer backgroundColor="var(--knk-orange)" />
  <Marquee backgroundColor="var(--knk-blue)" />
  <NavDrawer v-model="visibleRight" />
</template>

<style>
.pretix-widget {
  background-color: white !important;
}

.pretix-widget-category-description p,
.pretix-widget-item-description p {
  color: gray !important;
}
</style>

<style scoped>
.page-header {
  --page-title-shadow: var(--knk-blue);
  background-color: var(--knk-orange);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
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

.page-container {
  max-width: 50rem;
  width: 90%;
  margin: 0 auto;
  padding: 1rem 0;
}

.page-wrapper {
  min-height: 70vh;
  position: relative;
  background-color: var(--knk-orange);
  height: fit-content;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  padding-top: 2rem;
  overflow: hidden;
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
</style>
