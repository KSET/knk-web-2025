<script setup lang="ts">
import { type Artist } from '~/types/Artist'
import { type GallerySection } from '~/types/GallerySection'
import { type Ticket } from '~/types/Ticket'
import { ref } from 'vue'
import { useArtistsStore } from '../stores/artists'

import Footer from '~/components/Footer.vue'
import WorkshopCard from '~/components/WorkshopCard.vue'
import type { Workshop } from '~/types/Workshop'

import Schedule from '~/components/Schedule.vue'

const localePath = useLocalePath()
const { locale } = useI18n()
const artistsStore = useArtistsStore()
const { formatDayLabel } = useDayLabel()

onMounted(async () => {
  await artistsStore.fetchArtists()
})

const selectedDay = ref('all')

const dayPills = computed(() => {
  const pills = [{ key: 'all', label: '' as string }]
  ;[artistsStore.day1, artistsStore.day2, artistsStore.day3].forEach(
    (day, i) => {
      if (day.artists.length) {
        pills.push({ key: `day${i + 1}`, label: formatDayLabel(day.date) })
      }
    },
  )
  return pills
})

const visibleArtists = computed(() => {
  if (selectedDay.value === 'all') return artistsStore.all
  if (selectedDay.value === 'day1') return artistsStore.day1.artists
  if (selectedDay.value === 'day2') return artistsStore.day2.artists
  if (selectedDay.value === 'day3') return artistsStore.day3.artists
  return artistsStore.all
})

const query4 = groq`*[
  _type == "workshop" && (!defined(location) || lower(location) != "kamp")] | order(orderRank asc){
    ...,
    "okvirUrl": okvir.asset->url
  }`
const { data: workshops } = await useSanityQuery<Workshop[]>(query4)

const workshopFormLink = await useWorkshopFormLink()

const responsiveOptionsGalleryCarousel = [
  {
    breakpoint: '1200px',
    numVisible: 3,
    numScroll: 1,
  },
]

const query3 = groq`*[ _type == "ticket"] | order(orderRank)`
const { data: tickets } = await useSanityQuery<Ticket[]>(query3)

const visibleRight = ref(false)

const toggleVisibleRight = (): void => {
  visibleRight.value = !visibleRight.value
}

const queryGallerySections = groq`*[_type == "gallerySection" && year == 2025] | order(_createdAt desc)`
const { data: gallerySections } =
  await useSanityQuery<GallerySection[]>(queryGallerySections)

const galleryImages =
  gallerySections.value?.flatMap((section) =>
    (section.images ?? []).slice(0, 4).map((img, index) => ({
      image: urlFor(img).width(600).url(),
      alt: `Image ${index + 1}`,
    })),
  ) || []

const galleryRow1 = galleryImages.filter((_, i) => i % 2 === 0)
const galleryRow2 = galleryImages.filter((_, i) => i % 2 === 1)

const workshopsMediaQuery = '(max-width: 900px)'
const isMobileWorkshops = ref(
  import.meta.client ? window.matchMedia(workshopsMediaQuery).matches : false,
)
let workshopsMql: MediaQueryList | null = null
const syncWorkshopsLayout = () => {
  isMobileWorkshops.value = workshopsMql?.matches ?? false
}

onMounted(() => {
  workshopsMql = window.matchMedia(workshopsMediaQuery)
  syncWorkshopsLayout()
  workshopsMql.addEventListener('change', syncWorkshopsLayout)
})

onBeforeUnmount(() => {
  workshopsMql?.removeEventListener('change', syncWorkshopsLayout)
})
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee />

  <div class="header-wrapper">
    <div class="header-top-row">
      <span class="header-date-text">{{ $t('home.dates') }}</span>
      <div class="header-right-top">
        <LanguageSwitcher />
        <img src="/assets/icons/burger.svg?v=2" alt="burger" @click="toggleVisibleRight" class="burger-icon-top" />
      </div>
    </div>
    <div class="header-container">
      <img src="/assets/icons/knk-i-tete.svg" alt="knk i tete" class="hero-image" />
    </div>
  </div>

  <div class="izvodjaci-wrapper">
    <div class="wall-container">
      <div class="title-text-container">
        <p class="title-text">{{ $t('home.artists') }}</p>

        <NuxtLink :to="localePath('/lineup')" style="text-decoration: none">
          <span class="title-button">
            {{ $t('common.seeMore') }}
            <img
              src="/assets/icons/arrow-right.svg"
              alt="arrow-right"
              class="arrow-icon"
            />
          </span>
        </NuxtLink>
      </div>

      <div v-if="dayPills.length > 1" class="filter-pills">
        <button
          v-for="pill in dayPills"
          :key="pill.key"
          type="button"
          :class="['filter-pill', selectedDay === pill.key ? 'active' : '']"
          @click="selectedDay = pill.key"
        >
          {{ pill.key === 'all' ? $t('lineup.all') : pill.label }}
        </button>
      </div>

      <HomeArtistsContainer :artists="visibleArtists" />
    </div>

  </div>

  <div class="prijelaz-hero">
    <img src="/assets/prijelazi/ulaynice-gore.svg" alt="prijelaz-ulaznice" />
  </div>

  <div class="ulaznice-wrapper">
    <div class="wall-container">
      <div class="title-text-container">
        <p class="title-text">{{ $t('home.tickets') }}</p>

        <NuxtLink :to="localePath('/tickets')" style="text-decoration: none">
          <div class="title-button">
            {{ $t('common.buyTickets') }}
            <img
              src="/assets/icons/arrow-right.svg"
              alt="arrow-right"
              class="arrow-icon"
            />
          </div>
        </NuxtLink>
      </div>

      <div class="tickets-container">
        <NuxtLink
          v-for="(ticket, index) in tickets"
          :key="ticket._id"
          :to="localePath('/tickets')"
          class="ticket-card"
          :style="{ backgroundColor: ticket.backgroundColor }"
        >
          <img
            :src="index % 2 === 0 ? '/assets/icons/blob-1.svg' : '/assets/icons/blob-2.svg'"
            alt=""
            class="ticket-blob"
          />
          <div class="ticket-content">
            <div class="ticket-name" :style="{ color: ticket.backgroundColor }">{{ (locale === 'en' && ticket.nameEn) ? ticket.nameEn : ticket.name }}</div>
            <div class="ticket-price" :style="{ color: ticket.backgroundColor }">{{ ticket.price }}</div>
          </div>
        </NuxtLink>
      </div>

      <div class="ticket-buy-container">
        <NuxtLink :to="localePath('/tickets')" style="text-decoration: none">
          <button class="ticket-buy-button">
            {{ $t('common.buyTickets') }}
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>

  <div class="prijelaz-hero">
    <img src="/assets/prijelazi/ulaynice-dole.svg" alt="prijelaz-ulaznice-dole" />
  </div>

  <div class="beach-wrapper">
    <div class="wall-container">
      <div class="title-text-container">
        <p class="title-text">{{ $t('home.camping') }}</p>
      </div>

      <div class="kamp-image-wrapper">
        <img src="/assets/icons/krug-zuti.svg" alt="krug zuti" class="krug-zuti" />
        <img src="/assets/icons/krug-narancasti.svg" alt="krug narancasti" class="krug-narancasti" />
        <img src="/assets/icons/kamp.jpg" alt="kamp" class="kamp-image" />
      </div>

      <div class="kamp-buy-container">
        <NuxtLink :to="localePath('/kampiranje')" style="text-decoration: none">
          <button class="kamp-buy-button">
            {{ $t('common.learnMore') }}
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>

  <div class="prijelaz-hero">
    <img src="/assets/prijelazi/prijelaz-plaza-more.svg?v=3" alt="prijelaz-plaza-more" />
  </div>

  <div class="sea-wrapper">
    <div class="wall-container">
      <div class="title-text-container">
        <p class="title-text" style="color: white">{{ $t('home.workshops') }}</p>

        <NuxtLink :to="localePath('/workshops')" style="text-decoration: none">
          <span class="title-button-blue" style="color: white">
            {{ $t('common.seeMore') }}
            <img
              src="/assets/icons/arrow-right.svg"
              alt="arrow-right"
              class="arrow-icon"
            />
          </span>
        </NuxtLink>
      </div>

      <Carousel
        v-if="!isMobileWorkshops"
        :value="workshops"
        :numVisible="4"
        :numScroll="1"
        :responsiveOptions="responsiveOptionsGalleryCarousel"
        :circular="true"
        :autoplayInterval="10000"
        :autoplay="true"
        class="workshops-carousel"
      >
        <template #item="slotProps">
          <div class="artist-carousel-container">
            <WorkshopCard :workshop="slotProps.data" :index="slotProps.index" :form-link="workshopFormLink" />
          </div>
        </template>
      </Carousel>

      <div v-else class="workshops-scroll">
        <div
          v-for="(workshop, index) in workshops"
          :key="workshop._id"
          class="workshops-scroll-item"
        >
          <WorkshopCard :workshop="workshop" :index="index" :form-link="workshopFormLink" />
        </div>
      </div>
    </div>
  </div>

  <div class="prijelaz-hero">
    <img src="/assets/prijelazi/prvi-dole.svg?v=2" alt="prijelaz-galerija" />
  </div>

  <div class="gallery-section gallery-section-seam">
    <div class="gallery-marquee-wrapper">
      <div class="gallery-marquee-track gallery-marquee-left">
        <NuxtLink v-for="(img, i) in [...galleryRow1, ...galleryRow1]" :key="'r1-' + i" :to="localePath('/gallery')" class="gallery-marquee-link">
          <img :src="img.image" :alt="img.alt" class="gallery-marquee-image" />
        </NuxtLink>
      </div>
    </div>
    <div class="gallery-marquee-wrapper">
      <div class="gallery-marquee-track gallery-marquee-right">
        <NuxtLink v-for="(img, i) in [...galleryRow2, ...galleryRow2]" :key="'r2-' + i" :to="localePath('/gallery')" class="gallery-marquee-link">
          <img :src="img.image" :alt="img.alt" class="gallery-marquee-image" />
        </NuxtLink>
      </div>
    </div>
  </div>

  <Footer />

  <Marquee />

  <NavDrawer v-model="visibleRight" />
</template>

<style>
.wall-text, .wall-text p {
  white-space: pre-line;
}

.p-tablist-tab-list {
  flex-wrap: wrap !important;
  border: none !important;
}

.p-tab {
  border: 0;
  border: 3px solid transparent;
  background-color: #5c9c9c;
}

.p-tablist-active-bar {
  display: none !important;
}

.p-tab-active {
  border: 3px solid white;
  background-color: #76c6d2;
}

.artist-carousel .p-carousel-indicator-active .p-carousel-indicator-button {
  background-color: #5c9c9c !important;
}

.workshops-carousel .p-button-icon,
.workshops-carousel .p-icon {
  color: white !important;
}

.workshops-carousel button:hover .p-button-icon,
.workshops-carousel button:hover .p-icon {
  color: var(--knk-blue) !important;
}

.workshops-carousel .p-carousel-indicator-active .p-carousel-indicator-button {
  background-color: var(--knk-blue) !important;
}

.gallery-carousel .p-carousel-indicator-active .p-carousel-indicator-button {
  background-color: #e55a8e !important;
}

.p-carousel-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

img {
  border-radius: 8px;
}

.p-carousel-next-button,
.p-carousel-prev-button {
  color: white !important;
}

.p-carousel-next-button:not(:disabled):hover,
.p-carousel-prev-button:not(:disabled):hover {
  color: black !important;
}

</style>

<style scoped>
.prijelaz-hero {
  height: 200px;
  width: 100%;
}

.prijelaz-hero img {
  object-fit: fill;
  width: 100%;
  height: 200px;
  border-radius: 0px;
}

.prijelaz-flipped img {
  transform: scaleY(-1);
}

.prijelaz-container {
  height: 4.5rem;
  width: 100%;
}

.prijelaz-container img {
  object-fit: fill;
  width: 100%;
  height: 4.5rem;

  border-radius: 0px;
}

.title-text-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 1rem;
}

.title-button-blue,
.title-button {
  font-family: 'Montserrat';
  /* background-color: #dd7d91; */
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
}

.title-button:hover {
  border-bottom: 1px solid white;
}

.title-button-blue:hover {
  border-bottom: 1px solid white;
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
}

/*  --------------- HEADER --------------- */

.header-wrapper {
  background-color: var(--knk-blue);
  width: 100%;
  height: calc(100vh - 6.5rem);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.header-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.hero-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 0;
}

.header-text-container {
  width: 65%;
  display: flex;
  flex-direction: column;
}

.header-text {
  position: relative;
  text-shadow: 0.5px 4px 0 #dd7d91;

  font-size: var(--text-display);
  margin: 0;
  padding: 0;
  font-family: 'Bright';
  color: #efe5dd;
  z-index: 10;
  line-height: 3.5rem;
}

.year-text {
  font-family: 'LondrinaSolid';
  font-size: var(--text-heading);
}

.year-icon {
  height: 3rem;
}

.sunce-icon {
  position: absolute;
  top: 10%;
  left: 10%;
}

.oblaci-icon {
  position: absolute;
  top: 50%;
  width: 100%;
}

.header-date {
  font-family: 'Montserrat';
  color: #efe5dd;
  font-size: var(--text-subheading);
  text-align: center;
  margin: 0;
  padding: 0 0 0.5rem 0;

  text-shadow: 0.5px 4px 0 #dd7d91;
}

.header-top-row {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  padding: 1rem 1.5rem;
}

.header-date-text {
  font-family: 'Rockwell', serif;
  font-size: var(--text-heading);
  font-weight: bold;
  color: #efe5dd;
  text-align: center;
}

.header-right-top {
  position: absolute;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.burger-icon-top {
  cursor: pointer;
  border-radius: 0px;
  height: 2rem;
  width: auto;
}

/*  --------------- WALL --------------- */

.wall-divider {
  background-color: #e55a8e;
  width: 100%;
  height: 1rem;
}

.wall-wrapper {
  background-color: var(--knk-orange);
  height: fit-content;
  width: 100%;

  display: flex;
  justify-content: center;
  flex-direction: column;

  margin-bottom: -1px;
}

.izvodjaci-wrapper {
  background-color: var(--knk-blue);
  height: fit-content;
  width: 100%;

  display: flex;
  justify-content: center;
  flex-direction: column;

  margin-bottom: -1px;
}

.ulaznice-wrapper {
  background-color: var(--knk-orange);
  height: fit-content;
  width: 100%;

  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-bottom: 2rem;
}

.soon-text {
  color: #264f6c;
  font-size: var(--text-title);
  font-weight: 600;
  text-align: center;
  margin-top: 1rem;
}

.wall-container {
  width: 100%;
  padding-left: 1rem;
}

.wall-text {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  font-size: var(--text-title);
  padding: 1.25rem;
  margin-right: 1rem;
  backdrop-filter: blur(6px);
}

.wall-text :deep(p) {
  color: inherit;
}

.title-text {
  font-family: 'Rokkitt', serif;
  font-size: var(--text-display);
  font-weight: 900;
  color: white;
  text-shadow: 3px 4px 0 var(--knk-orange);
  margin: 0;
  padding: 0 0 0.5rem 0;
}

.ulaznice-wrapper .title-text,
.wall-wrapper .title-text,
.sea-wrapper .title-text {
  text-shadow: 3px 4px 0 var(--knk-blue);
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-right: 1rem;
  margin-bottom: 0.5rem;
}

.filter-pill {
  font-family: 'Rockwell', serif;
  font-weight: 700;
  font-size: var(--text-body);

  color: white;
  background-color: transparent;
  border: 2.5px solid white;
  border-radius: 8px;
  padding: 0.2rem 0.75rem;

  cursor: pointer;
  text-transform: lowercase;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.filter-pill.active {
  background-color: white;
  border-color: white;
  color: var(--knk-blue);
}

.filter-pill:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.2);
}

.artist-carousel-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0 0.5rem;
}

.workshops-scroll {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  gap: 1rem;
  margin-left: -1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

.workshops-scroll::-webkit-scrollbar {
  display: none;
}

.workshops-scroll-item {
  flex-shrink: 0;
  width: 60vw;
  max-width: 18rem;
}

.workshops-carousel :deep(.arrow-icon),
.workshops-scroll :deep(.arrow-icon) {
  width: 0.85rem;
  height: 0.85rem;
}

.workshops-carousel,
.artist-carousel {
  display: flex;
}

.workshops-carousel {
  padding-right: 1rem;
}

.tickets-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 40px 1rem;
}

.ticket-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 22rem;
  height: 24rem;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  overflow: hidden;

  cursor: pointer;
  text-decoration: none;
  transition: transform 0.15s ease;
}

.ticket-card:hover {
  transform: scale(1.03);
}

.ticket-blob {
  position: absolute;
  top: 5%;
  left: 5%;
  width: 90%;
  height: 90%;
  object-fit: fill;
  border-radius: 0;
  pointer-events: none;
}

.ticket-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  max-width: 80%;
  padding: 1rem;
  text-wrap: balance;
}

.ticket-name {
  font-weight: 900;
  font-size: var(--text-title);
  margin-bottom: 0.25rem;
  min-height: 4.4rem;
  display: flex;
  align-items: flex-start;
  text-align: center;
}

.ticket-price {
  font-size: var(--text-heading);
  font-weight: 900;
  margin-bottom: 0.5rem;
}

.ticket-buy-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 1rem 1rem 1rem;
}

.ticket-buy-button {
  background-color: white;
  color: var(--knk-orange);
  padding: 12px 40px;
  border: none;
  border-radius: 12px;
  font-family: 'Rokkitt', serif;
  font-weight: bold;
  font-size: var(--text-heading);
  cursor: pointer;
  text-transform: uppercase;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/*  --------------- BEACH --------------- */

.beach-wrapper {
  background-color: var(--knk-blue);
  height: fit-content;
  width: 100%;

  display: flex;
  justify-content: center;
  flex-direction: column;
}

.beach-container {
  width: 100%;
  padding-left: 1rem;
}

.kamp-image-wrapper {
  position: relative;
  margin-right: 1rem;
  margin-top: 1rem;
  margin-bottom: 4rem;
}

.kamp-image {
  width: 80%;
  height: auto;
  border-radius: 0;
  display: block;
  margin: 0 auto;
  padding-bottom: 2rem;
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

.kamp-buy-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 1rem 2rem 1rem;
}

.kamp-buy-button {
  background-color: white;
  color: var(--knk-blue);
  padding: 12px 40px;
  border: none;
  border-radius: 12px;
  font-family: 'Rokkitt', serif;
  font-weight: bold;
  font-size: var(--text-heading);
  cursor: pointer;
  text-transform: uppercase;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/*  --------------- SEA --------------- */

.sea-wrapper {
  background-color: var(--knk-yellow);
  height: fit-content;
  width: 100%;

  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.sea-container {
  width: 100%;
  padding-left: 1rem;
}

.gallery-section-seam {
  margin-top: -2px;
}

.gallery-section {
  background-color: var(--knk-blue);
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.gallery-marquee-wrapper {
  width: 100%;
  overflow: hidden;
  margin-bottom: 1rem;
}

.gallery-marquee-track {
  display: flex;
  gap: 1rem;
  white-space: nowrap;
  width: max-content;
}

.gallery-marquee-left {
  animation: gallery-scroll-left 40s linear infinite;
}

.gallery-marquee-right {
  animation: gallery-scroll-right 40s linear infinite;
}

.gallery-marquee-link {
  display: contents;
}

.gallery-marquee-image {
  height: 50vh;
  width: auto;
  object-fit: cover;
  border-radius: 0;
  flex-shrink: 0;
}

@keyframes gallery-scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes gallery-scroll-right {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}

.cta-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0 2rem 0;
  width: 100%;
}

/*  --------------- RESPONNZIVNOST --------------- */

.wall-wrapper,
.izvodjaci-wrapper,
.ulaznice-wrapper,
.beach-wrapper,
.sea-wrapper,
.header-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.wall-container,
.beach-container,
.sea-container,
.header-container {
  width: 100%;
}

.coming-soon-text {
  font-family: 'Rockwell', serif;
  font-size: var(--text-subheading);
  font-weight: bold;
  color: white;
  text-align: center;
  width: 100%;
  padding: 2rem 0;
  margin: 0;
}

@media (max-width: 900px) {

  .artist-carousel {
    display: none;
  }

  .ticket-buy-button {
    padding: 10px 28px;
  }

  .kamp-buy-button {
    padding: 10px 28px;
  }

  .ticket-name {
    min-height: 3.5rem;
  }

  .ticket-card {
    width: 18rem;
    height: 20rem;
    padding: 1.5rem;
  }

  .header-wrapper {
    height: calc(100vh - 4.5rem);
  }

  .gallery-marquee-image {
    height: 35vh;
  }

  .prijelaz-hero {
    height: 120px;
  }

  .prijelaz-hero img {
    height: 120px;
  }
}

@media (max-width: 480px) {
  .title-text {
    text-shadow: 2px 3px 0 var(--knk-orange);
  }

  .header-top-row {
    justify-content: space-between;
    position: static;
  }

  .header-right-top {
    position: static;
    flex-shrink: 0;
  }

  .header-text {
    line-height: 2.5rem;
  }

  .ticket-buy-button {
    padding: 8px 20px;
  }

  .kamp-buy-button {
    padding: 8px 20px;
  }

  .ticket-name {
    min-height: 3rem;
  }

  .ticket-card {
    width: 85vw;
    max-width: 22rem;
    aspect-ratio: 11 / 12;
    padding: 1.2rem;
  }

  .gallery-marquee-image {
    height: 25vh;
  }

  .prijelaz-hero {
    height: 80px;
  }

  .prijelaz-hero img {
    height: 80px;
  }

  .header-wrapper {
    height: calc(100vh - 3rem);
  }

  .burger-icon-top {
    height: 1.5rem;
  }

}
</style>
