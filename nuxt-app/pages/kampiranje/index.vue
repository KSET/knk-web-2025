<script setup lang="ts">
import Footer from '~/components/Footer.vue'
import WorkshopCard from '~/components/WorkshopCard.vue'
import type { Translation } from '~/types/Translation'
import type { Workshop } from '~/types/Workshop'
import { ref } from 'vue'

const query2 = groq`*[ _type == "translation"]`
const { data: translationsRaw } = await useSanityQuery<Translation[]>(query2)

const campQuery = groq`*[
  _type == "workshop" && lower(location) == "kamp"] | order(orderRank asc){
    ...,
    "okvirUrl": okvir.asset->url
  }`
const { data: campWorkshops } = await useSanityQuery<Workshop[]>(campQuery)

const formLink = await useWorkshopFormLink()

const { locale, t } = useI18n()

useSeoMeta({
  title: () => t('meta.pages.camping.title'),
  description: () => t('meta.pages.camping.description'),
  ogTitle: () => `${t('meta.pages.camping.title')} | KSET na Krku`,
  ogDescription: () => t('meta.pages.camping.description'),
})

const translations = computed(() =>
  Object.fromEntries(
    translationsRaw.value?.map((entry) => [
      entry.key,
      { hr: entry.text, en: entry.textEn },
    ]) || [],
  ),
)

const infoKampBlocks = computed(() => {
  const t = translations.value?.infoKampText
  return locale.value === 'en' && t?.en ? t.en : t?.hr
})

const campNoteBlocks = computed(() => {
  const t = translations.value?.campNote
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
    <p class="page-title">{{ $t('camping.title') }}</p>
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
      <img src="/assets/icons/kamp.jpg" alt="kamp" class="kamp-image" />
    </div>

    <div class="info-section">
      <div class="info-content">
        <h1 class="info-title">{{ $t('camping.info') }}</h1>
        <div class="info-text">
          <BlockContent :blocks="infoKampBlocks" class="info-text" />
        </div>
      </div>
    </div>

    <div class="reception-hours">
      <h2 class="reception-title">{{ $t('camping.receptionHours') }}</h2>
      <ul class="reception-list">
        <li>
          <span>13. 8.</span><span>-</span>
          <span>11:00 {{ $t('camping.receptionTo') }} 21:00</span>
        </li>
        <li>
          <span>14., 15., 16. 8.</span><span>-</span>
          <span>10:00 {{ $t('camping.receptionTo') }} 18:00</span>
        </li>
        <li>
          <span>17. 8.</span><span>-</span>
          <span>{{ $t('camping.checkout') }} {{ $t('camping.receptionTo') }} 11:00</span>
        </li>
      </ul>
    </div>

    <div v-if="campWorkshops?.length" class="camp-workshops-section">
      <div class="camp-workshops-header">
        <h2 class="camp-workshops-title">{{ $t('camping.activities') }}</h2>
        <a
          v-if="formLink"
          :href="formLink"
          target="_blank"
          rel="noopener noreferrer"
          class="title-button"
        >
          {{ $t('workshops.moreInfo') }}
          <img
            src="/assets/icons/arrow-right.svg"
            alt="arrow-right"
            class="arrow-icon"
          />
        </a>
      </div>

      <div v-if="campNoteBlocks" class="camp-note">
        <BlockContent :blocks="campNoteBlocks" />
      </div>

      <div class="workshops-container">
        <WorkshopCard
          v-for="(workshop, index) in campWorkshops"
          :key="workshop._id"
          :workshop="workshop"
          :index="index"
          :form-link="formLink"
        />
      </div>
    </div>

    <div class="map-section">
      <ClientOnly>
        <LocationMap
          :markers="[
            { label: $t('camping.title'), lat: 45.0354848, lng: 14.576015 },
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
.info-content,
.reception-hours,
.camp-workshops-header,
.camp-note,
.workshops-container,
.map-section {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.page-header {
  background-color: var(--knk-blue);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  position: relative;
  padding: 1.5rem 5%;
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
  margin-top: -2rem;
  overflow: visible;
}

.info-content {
  position: relative;
  z-index: 1;
  text-align: left;
  padding: 3rem 0;
}

.info-title {
  font-family: 'Rokkitt', serif;
  font-size: var(--text-heading);
  font-weight: 900;
  color: white;
  text-shadow: 3px 4px 0 var(--knk-orange);
  margin: 0 0 1rem 0;
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

.reception-hours {
  position: relative;
  z-index: 3;
  text-align: left;
}

.reception-title {
  font-family: 'Rokkitt', serif;
  font-size: var(--text-heading);
  font-weight: 900;
  color: white;
  text-shadow: 3px 4px 0 var(--knk-orange);
  margin: 0 0 1rem 0;
  overflow-wrap: anywhere;
}

.reception-list {
  list-style: none;
  margin: 0;
  padding: 0;
  color: white;
  font-size: var(--text-title);
  line-height: 1.6;

  display: grid;
  grid-template-columns: auto auto auto;
  justify-content: start;
  column-gap: 0.5rem;
  text-align: left;
}

.reception-list li {
  display: contents;
}

.camp-workshops-section {
  position: relative;
  z-index: 3;
  width: 100%;
  padding: 2rem 0;
  text-align: left;
}

.camp-workshops-header {
  margin-bottom: 1rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.camp-workshops-title {
  font-family: 'Rokkitt', serif;
  font-size: var(--text-heading);
  font-weight: 900;
  color: white;
  text-shadow: 3px 4px 0 var(--knk-orange);
  margin: 0;
  overflow-wrap: anywhere;
}

.camp-note {
  margin-bottom: 1.5rem;
  color: white;
  font-family: 'Montserrat';
  font-size: var(--text-body);
  text-align: left;
  opacity: 0.85;
}

.camp-note :deep(p) {
  margin: 0;
}

.workshops-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;
}

.map-section {
  display: flex;
  position: relative;
  z-index: 3;
}

.title-button {
  font-family: 'Montserrat';
  color: #fff;
  padding: 0 0 0.2rem 0;
  border-radius: 0;
  text-align: center;
  cursor: pointer;
  width: fit-content;

  display: flex;
  align-items: center;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease;
  text-decoration: none;
}

.title-button:hover {
  border-bottom: 1px solid white;
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
}

@media (max-width: 1400px) {
  .workshops-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1000px) {
  .workshops-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 570px) {
  .workshops-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .info-content {
    padding: 2rem 0 0 0;
  }

  .burger-icon {
    width: 1.8rem;
  }

  .page-header {
    padding: 1rem 5%;
  }
}
</style>
