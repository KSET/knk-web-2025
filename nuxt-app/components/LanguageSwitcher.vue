<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <div class="lang-switcher">
    <NuxtLink
      v-for="loc in locales"
      :key="loc.code"
      :to="switchLocalePath(loc.code)"
      class="lang-link"
      :class="{ active: locale === loc.code }"
    >
      {{ loc.code === 'en' ? 'ENG' : loc.code.toUpperCase() }}
    </NuxtLink>
  </div>
</template>

<style scoped>
.lang-switcher {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.lang-link {
  font-family: 'Rockwell', serif;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--knk-orange);
  text-decoration: none;
  padding: 0.2rem 0.5rem;
  border: 2.5px solid white;
  border-radius: 4px;
  line-height: 1.3;
  background-color: white;
  transition: background-color 0.15s ease, color 0.15s ease;
}

@media (max-width: 480px) {
  .lang-link {
    font-size: 0.65rem;
    padding: 0.15rem 0.35rem;
    border-width: 2px;
  }
}

.lang-link.active {
  background-color: var(--knk-orange);
  border-color: white;
  color: white;
}

.lang-link:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
