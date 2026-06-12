<script setup lang="ts">
import { ref } from 'vue'
import WorkshopCard from '~/components/WorkshopCard.vue'
import Footer from '~/components/Footer.vue'
import type { Workshop } from '~/types/Workshop'
import type { Translation } from '~/types/Translation'

const visibleRight = ref(false)
const toggleVisibleRight = (): void => {
  visibleRight.value = !visibleRight.value
}

const query = groq`*[
  _type == "workshop" && (!defined(location) || lower(location) != "kamp")] | order(orderRank asc)`
const { data: workshops } = await useSanityQuery<Workshop[]>(query)

const uniqueLocations = computed(() => [
  ...new Set((workshops.value ?? []).map((w) => w.location)),
])

const { locale, t } = useI18n()

// Localized label for a location filter pill.
const locationLabel = (location: string) => {
  if (location === 'škola') return t('workshops.school')
  if (location === 'vanjska') return t('workshops.outdoor')
  return location
}

const selectedFilter = ref<string>('sve')

const filteredWorkshops = computed(() => {
  const all = workshops.value ?? []
  if (selectedFilter.value === 'sve') return all
  return all.filter((w) => w.location === selectedFilter.value)
})

const query2 = groq`*[ _type == "translation"]`
const { data: translationsRaw } = await useSanityQuery<Translation[]>(query2)

const translations = Object.fromEntries(
  translationsRaw.value?.map((entry) => [entry.key, { hr: entry.text, en: entry.textEn }]) || [],
)

const workshopsFormLink = translations['workshopsFormLink']?.hr

const workshopsHeaderBlocks = computed(() => {
  const tr = translations?.workshopsHeaderText
  return (locale.value === 'en' && tr?.en) ? tr.en : tr?.hr
})
const getPlainTextLink = (blocks: any[]): string | undefined => {
  if (!Array.isArray(blocks)) return undefined

  const firstBlock = blocks[0]
  const firstSpan = firstBlock?.children?.[0]

  const text = firstSpan?.text || ''
  const isLink = text.startsWith('http://') || text.startsWith('https://')

  return isLink ? text : undefined
}

const formLink = computed(() => getPlainTextLink(workshopsFormLink))

// loading pretix script (commented out — keep for future use)
// import { onMounted } from 'vue'
//
// onMounted(() => {
//   const script = document.createElement('script')
//   script.src = 'https://karte.kset.org/widget/v1.en.js'
//   script.async = true
//   script.crossOrigin = 'anonymous'
//   document.head.appendChild(script)
// })
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee backgroundColor="var(--knk-blue)" textColor="white" textShadowColor="var(--knk-orange)" />

  <div class="workshops-bg">
  <img src="/assets/workshops/plukruyi-vertical.svg" alt="" class="edge-decor edge-decor-left e1" aria-hidden="true" />
  <img src="/assets/workshops/plukruyi-vertical.svg" alt="" class="edge-decor edge-decor-left e2" aria-hidden="true" />
  <img src="/assets/workshops/plukruyi-vertical.svg" alt="" class="edge-decor edge-decor-right e3" aria-hidden="true" />
  <img src="/assets/workshops/plukruyi-vertical.svg" alt="" class="edge-decor edge-decor-right e4" aria-hidden="true" />
  <div class="page-header">
    <p class="page-title">{{ $t('workshops.title') }}</p>
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

  <div class="workshops-wrapper">
    <div class="page-container">
      <BlockContent
        :blocks="workshopsHeaderBlocks"
        class="wall-text"
      />

      <!-- Pretix ticket widget — commented out, keep for future use
      <div
        class="pretix-widget-compat"
        event="https://karte.kset.org/kset/kset-na-krku-radionice/"
        single-item-select="button"
      ></div>
      <noscript>
        <div class="pretix-widget">
          <div class="pretix-widget-info-message">
            JavaScript is disabled in your browser. To access our ticket shop
            without JavaScript, please
            <a
              target="_blank"
              rel="noopener"
              href="https://karte.kset.org/kset/kset-na-krku-radionice/"
              >click here</a
            >.
          </div>
        </div>
      </noscript>
      -->
    </div>

    <div class="filter-row">
      <div class="filter-pills">
        <button
          type="button"
          :class="['filter-pill', selectedFilter === 'sve' ? 'active' : '']"
          @click="selectedFilter = 'sve'"
        >
          {{ $t('workshops.all') }}
        </button>
        <button
          v-for="location in uniqueLocations"
          :key="location"
          type="button"
          :class="['filter-pill', selectedFilter === location ? 'active' : '']"
          @click="selectedFilter = location"
        >
          {{ locationLabel(location) }}
        </button>
      </div>

      <a
        v-if="workshopsFormLink"
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

    <div class="workshops-container">
      <WorkshopCard
        v-for="(workshop, index) in filteredWorkshops"
        :key="workshop._id"
        :workshop="workshop"
        :index="index"
      />
    </div>
  </div>
  </div>

  <Footer
    backgroundColor="var(--knk-yellow)"
    decorImage="/assets/workshops/lik.svg"
    decorSide="left"
    decorRow="/assets/workshops/kruzi.svg"
  />
  <Marquee backgroundColor="var(--knk-blue)" textColor="white" textShadowColor="var(--knk-orange)" />
  <NavDrawer v-model="visibleRight" />
</template>

<!-- Pretix widget styles — commented out, keep for future use
<style>
.pretix-widget {
  background-color: white !important;
}

.pretix-widget-category-description p,
.pretix-widget-item-description p {
  color: gray !important;
}
</style>
-->

<style scoped>
.workshops-bg {
  position: relative;
  background-color: var(--knk-yellow);
  overflow: hidden;
}

.workshops-bg::before {
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

/* plukruyi wave ornament running vertically down both page edges.
   The svg is a horizontal strip of waves, so we lay it out as a wide
   horizontal strip (its natural orientation, repeated a few times) and
   rotate the whole strip 90deg so it runs top-to-bottom along the edge. */
/* plukruyi wave ornament: two full svg copies at each edge, rotated 180deg,
   placed at irregular vertical offsets for an organic, scattered feel */
.edge-decor {
  position: absolute;
  width: 4rem;
  height: auto;
  transform: rotate(180deg);
  pointer-events: none;
  z-index: 0;
}

.edge-decor-right {
  right: 0;
}

.edge-decor-left {
  left: 0;
}

.edge-decor.e1 {
  top: 10rem;
}
.edge-decor.e2 {
  bottom: 6rem;
}
.edge-decor.e3 {
  top: 16rem;
}
.edge-decor.e4 {
  bottom: 14rem;
}

.page-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 1.5rem 1rem;
}

.page-title {
  font-family: 'Rokkitt', serif;
  font-size: 5rem;
  font-weight: 500;
  color: #efe5dd;
  text-shadow: 3px 4px 0 var(--knk-orange);
  margin: 0;
  position: relative;
  z-index: 2;
}

.header-right {
  position: absolute;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
}

.burger-icon {
  cursor: pointer;
  width: 2.5rem;
  border-radius: 0;
}

.workshops-wrapper {
  position: relative;
  z-index: 1;
  height: fit-content;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  min-height: 60rem;

  padding-top: 2rem;
}

.page-container {
  max-width: 50rem;
  width: 100%;
  padding: 1rem;
}

.filter-row {
  width: 100%;
  padding: 0 2rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-pill {
  font-family: 'Rockwell', serif;
  font-weight: 700;
  font-size: 0.95rem;

  color: var(--knk-orange);
  background-color: white;
  border: 2.5px solid white;
  border-radius: 8px;
  padding: 0.2rem 0.75rem;

  cursor: pointer;
  text-transform: lowercase;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.filter-pill.active {
  background-color: var(--knk-orange);
  border-color: white;
  color: white;
}

.filter-pill:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.8);
}

.workshops-container {
  width: 100%;
  padding: 0 2rem;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;
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

@media (max-width: 900px) {
  .page-title {
    font-size: 3.5rem;
  }

  .workshops-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2.5rem;
    text-shadow: 2px 3px 0 var(--knk-orange);
  }

  .burger-icon {
    width: 1.8rem;
  }

  .page-header {
    padding: 1rem 0.75rem;
  }

  .workshops-container {
    grid-template-columns: 1fr;
  }
}
</style>
