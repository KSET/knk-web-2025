<script setup lang="ts">
import Footer from '~/components/Footer.vue'
import type { Translation } from '~/types/Translation'
import { ref } from 'vue'

const query2 = groq`*[ _type == "translation"]`
const { data: translationsRaw } = await useSanityQuery<Translation[]>(query2)

const { locale, t } = useI18n()

useSeoMeta({
  title: () => t('meta.pages.festival.title'),
  description: () => t('meta.pages.festival.description'),
  ogTitle: () => `${t('meta.pages.festival.title')} | KSET na Krku`,
  ogDescription: () => t('meta.pages.festival.description'),
})

const translations = Object.fromEntries(
  translationsRaw.value?.map((entry) => [
    entry.key,
    { hr: entry.text, en: entry.textEn },
  ]) || [],
)

const infoFestivalBlocks = computed(() => {
  const t = translations?.infoFestivalText
  return locale.value === 'en' && t?.en ? t.en : t?.hr
})

const visibleRight = ref(false)
const toggleVisibleRight = (): void => {
  visibleRight.value = !visibleRight.value
}
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee
    backgroundColor="var(--knk-orange)"
    textShadowColor="var(--knk-lightblue)"
  />

  <div class="page-header">
    <p class="page-title">{{ $t('festival.title') }}</p>
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
    <div class="kamp-image-wrapper">
      <img
        src="/assets/icons/krug-zuti.svg"
        alt="krug zuti"
        class="krug-zuti"
      />
      <img
        src="/assets/icons/krug-narancasti.svg"
        alt="krug narancasti"
        class="krug-narancasti"
      />
      <img src="/assets/icons/festival.jpg" alt="festival" class="kamp-image" />
    </div>

    <div class="info-section">
      <div class="info-content">
        <h1 class="info-title">{{ $t('festival.info') }}</h1>
        <div class="info-text">
          <BlockContent :blocks="infoFestivalBlocks" class="info-text" />
        </div>
      </div>
    </div>

    <div
      style="
        display: flex;
        width: 100%;
        padding: 0 1rem;
        position: relative;
        z-index: 3;
      "
    >
      <ClientOnly>
        <LocationMap
          :markers="[
            {
              label: $t('camping.title'),
              lat: 45.0346413,
              lng: 14.5756002,
              url: 'https://www.google.com/maps?q=45.0346413,14.5756002&entry=gps&shh=CAE&lucs=,94297699,94231188,94280568,47071704,94218641,94282134,100813464,94286869,100820247,100822499&g_ep=CAISEjI2LjMyLjUuOTU4MDQ3MzAzMBgAINeCAypdLDk0Mjk3Njk5LDk0MjMxMTg4LDk0MjgwNTY4LDQ3MDcxNzA0LDk0MjE4NjQxLDk0MjgyMTM0LDEwMDgxMzQ2NCw5NDI4Njg2OSwxMDA4MjAyNDcsMTAwODIyNDk5QgJIUg%3D%3D&skid=17a4d375-6317-4fb4-bfa6-82e1b9078e19&g_st=ic',
            },
            {
              label: `${$t('festival.title')} - OŠ Fran Krsto Frankopan`,
              lat: 45.0281636,
              lng: 14.5753015,
              url: 'https://www.google.com/maps/place/Fran+Krsto+Frankopan+Elementary+School/@45.0281763,14.5754214,125m/data=!3m1!1e3!4m12!1m5!3m4!2zNDXCsDAxJzQxLjQiTiAxNMKwMzQnMzEuMSJF!8m2!3d45.0281636!4d14.5753015!3m5!1s0x476373bfab3c4067:0xa899598a56cfc788!8m2!3d45.0281819!4d14.5754043!16s%2Fg%2F1q69w5y62',
            },
          ]"
          style="flex: 1"
        />
      </ClientOnly>
    </div>
  </div>

  <Footer />
  <Marquee />

  <NavDrawer v-model="visibleRight" />
</template>

<style scoped>
.page-header {
  background-color: var(--knk-blue);
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

.info-section {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem 1rem;
  margin-top: -6rem;
  overflow: visible;
}

.info-content {
  position: relative;
  z-index: 1;
  width: 60%;
  text-align: center;
  padding: 3rem 2rem;
}

.info-title {
  font-family: 'Rokkitt', serif;
  font-size: var(--text-heading);
  font-weight: 900;
  color: white;
  text-shadow: 3px 4px 0 var(--knk-orange);
  margin: 0 0 1rem 0;
  border: 3px solid white;
  display: inline-block;
  padding: 0.25rem 1.5rem;
}

.page-wrapper {
  min-height: 70vh;
  background-color: var(--knk-blue);
  height: fit-content;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  padding-top: 2rem;
}

.kamp-image-wrapper {
  position: relative;
  width: 100%;
  padding: 0 1rem;
  margin-bottom: 2rem;
  z-index: 2;
}

.kamp-image {
  width: 80%;
  height: auto;
  border-radius: 0;
  display: block;
  margin: 0 auto;
}

.krug-zuti {
  position: absolute;
  top: 5%;
  left: 0;
  width: 25%;
  height: auto;
  aspect-ratio: 1;
  z-index: 10;
  border-radius: 0;
}

.krug-narancasti {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 25%;
  height: auto;
  aspect-ratio: 1;
  z-index: 10;
  border-radius: 0;
}

.info-text {
  color: white;
  font-size: var(--text-title);
  line-height: 1.6;
}

@media (max-width: 480px) {
  .info-title {
    padding: 0.2rem 1rem;
  }

  .info-content {
    width: 80%;
    padding: 2rem 0 0 0;
  }

  .burger-icon {
    width: 1.8rem;
  }

  .page-header {
    padding: 1rem;
  }

}
</style>
