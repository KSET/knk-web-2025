<script setup lang="ts">
import { ref } from 'vue'
import Footer from '~/components/Footer.vue'
import Schedule from '~/components/Schedule.vue'

const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.pages.schedule.title'),
  description: () => t('meta.pages.schedule.description'),
  ogTitle: () => `${t('meta.pages.schedule.title')} | KSET na Krku`,
  ogDescription: () => t('meta.pages.schedule.description'),
})

const visibleRight = ref(false)
const toggleVisibleRight = (): void => {
  visibleRight.value = !visibleRight.value
}
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee
    backgroundColor="var(--knk-blue)"
    textColor="white"
    textShadowColor="var(--knk-orange)"
  />

  <div class="schedule-bg">
    <div class="page-header">
      <p class="page-title">{{ $t('schedule.title') }}</p>
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

    <div class="schedule-wrapper">
      <Schedule />
    </div>
  </div>

  <Footer
    backgroundColor="var(--knk-yellow)"
    decorImage="/assets/workshops/lik.svg"
    decorSide="left"
    decorRow="/assets/workshops/kruzi.svg"
  />
  <Marquee
    backgroundColor="var(--knk-yellow)"
    textColor="white"
    textShadowColor="var(--knk-orange)"
  />

  <NavDrawer v-model="visibleRight" />
</template>

<style scoped>
/* Same background treatment as the workshops page. */
.schedule-bg {
  position: relative;
  background-color: var(--knk-yellow);
  overflow: hidden;
}

.schedule-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 2500.82 / 915.09;
  background-image: url('/assets/workshops/sunc.svg');
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center top;
  pointer-events: none;
  z-index: 0;
}

.schedule-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-height: 40rem;
  padding-top: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 2;
  padding: 1.5rem 1rem;
}

.page-title {
  font-family: 'Rokkitt', serif;
  font-size: var(--text-display);
  font-weight: 900;
  color: #efe5dd;
  text-shadow: 3px 4px 0 var(--knk-orange);
  margin: 0;
  flex: 1;
  min-width: 0;
  text-align: center;
  overflow-wrap: anywhere;
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
  .page-title {
    text-shadow: 2px 3px 0 var(--knk-orange);
    text-align: left;
  }

  .burger-icon {
    width: 1.8rem;
  }

  .page-header {
    padding: 1rem;
  }
}
</style>
