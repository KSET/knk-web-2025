<script setup lang="ts">
import { type Artist } from '~/types/Artist'
import { type GallerySection } from '~/types/GallerySection'
import { type Ticket } from '~/types/Ticket'
import { ref } from 'vue'
import { useArtistsStore } from '../stores/artists'

import Footer from '~/components/Footer.vue'
import type { Translation } from '~/types/Translation'
import type { Workshop } from '~/types/Workshop'

import Schedule from '~/components/Schedule.vue'

const artistsStore = useArtistsStore()

onMounted(async () => {
  await artistsStore.fetchArtists()
})

const query2 = groq`*[ _type == "translation"]`
const { data: translationsRaw } = await useSanityQuery<Translation[]>(query2)

const query4 = groq`*[
  _type == "workshop" && (!defined(location) || lower(location) != "kamp")] | order(location asc, orderRank asc)`
const { data: workshops } = await useSanityQuery<Workshop[]>(query4)

const translations = Object.fromEntries(
  translationsRaw.value?.map((entry) => [entry.key, entry.text]) || [],
)

const query3 = groq`*[ _type == "ticket"] | order(_createdAt desc)`
const { data: tickets } = await useSanityQuery<Ticket[]>(query3)

const visibleRight = ref(false)

const toggleVisibleRight = (): void => {
  visibleRight.value = !visibleRight.value
}

function formatShowDate(date: string | Date): string {
  const d = new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${day}.${month}.`
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
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee />

  <div class="header-wrapper">
    <div class="header-top-row">
      <span class="header-date-text">14. 8.- 16. 8.</span>
      <img src="/assets/icons/burger.svg" alt="burger" @click="toggleVisibleRight" class="burger-icon-top" />
    </div>
    <div class="header-container">
      <img src="/assets/icons/knk-i-tete.svg" alt="knk i tete" class="hero-image" />
    </div>
  </div>

  <div class="izvodjaci-wrapper">
    <div class="wall-container">
      <div class="title-text-container">
        <p class="title-text">izvođači</p>

        <NuxtLink to="/lineup" style="text-decoration: none">
          <span class="title-button">
            pogledaj više
            <img
              src="/assets/icons/arrow-right.svg"
              alt="arrow-right"
              class="arrow-icon"
            />
          </span>
        </NuxtLink>
      </div>

      <HomeArtistsContainer :artists="artistsStore.all" />

      <p class="coming-soon-text">+ još uskoro...</p>

      <!-- <Tabs value="0">
        <TabList style="flex-wrap: wrap">
          <Tab value="0" class="artist-tab">Svi</Tab>
          <Tab value="1" class="artist-tab">Dan 1 - {{ formatShowDate(artistsStore.day1.date) }}</Tab>
          <Tab value="2" class="artist-tab">Dan 2 - {{ formatShowDate(artistsStore.day2.date) }}</Tab>
          <Tab value="3" class="artist-tab">Dan 3 - {{ formatShowDate(artistsStore.day3.date) }}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel value="0">
            <HomeArtistsContainer :artists="artistsStore.all" />
          </TabPanel>
          <TabPanel value="1">
            <HomeArtistsContainer :artists="artistsStore.day1.artists" />
          </TabPanel>
          <TabPanel value="2">
            <HomeArtistsContainer :artists="artistsStore.day2.artists" />
          </TabPanel>
          <TabPanel value="3">
            <HomeArtistsContainer :artists="artistsStore.day3.artists" />
          </TabPanel>
        </TabPanels>
      </Tabs> -->
    </div>

  </div>

  <div class="prijelaz-hero">
    <img src="/assets/prijelazi/ulaynice-gore.svg" alt="prijelaz-ulaznice" />
  </div>

  <div class="ulaznice-wrapper">
    <div class="wall-container">
      <div class="title-text-container">
        <p class="title-text">ulaznice</p>

        <NuxtLink to="/tickets" style="text-decoration: none">
          <div class="title-button">
            kupi ulaznice
            <img
              src="/assets/icons/arrow-right.svg"
              alt="arrow-right"
              class="arrow-icon"
            />
          </div>
        </NuxtLink>
      </div>

      <div class="tickets-container">
        <div
          v-for="(ticket, index) in tickets"
          :key="ticket._id"
          class="ticket-card"
          :style="{ backgroundColor: ticket.backgroundColor }"
        >
          <img
            :src="index % 2 === 0 ? '/assets/icons/blob-1.svg' : '/assets/icons/blob-2.svg'"
            alt=""
            class="ticket-blob"
          />
          <div class="ticket-content">
            <div class="ticket-name" :style="{ color: ticket.backgroundColor }">{{ ticket.name }}</div>
            <div class="ticket-price" :style="{ color: ticket.backgroundColor }">{{ ticket.price }}€</div>
          </div>
        </div>
      </div>

      <div class="ticket-buy-container">
        <NuxtLink to="/tickets" style="text-decoration: none">
          <button class="ticket-buy-button">
            kupi ulaznice
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
        <p class="title-text">kampiranje</p>
      </div>

      <div class="kamp-image-wrapper">
        <img src="/assets/icons/krug-zuti.svg" alt="krug zuti" class="krug-zuti" />
        <img src="/assets/icons/krug-narancasti.svg" alt="krug narancasti" class="krug-narancasti" />
        <img src="/assets/icons/kamp.jpeg" alt="kamp" class="kamp-image" />
      </div>

      <div class="kamp-buy-container">
        <NuxtLink to="/kampiranje" style="text-decoration: none">
          <button class="kamp-buy-button">
            saznaj više
          </button>
        </NuxtLink>
      </div>

      <div class="title-text-container">
        <!-- <p class="title-text" style="color: #264f6c">Radionice</p>

        <NuxtLink to="/workshops" style="text-decoration: none">
          <span class="title-button-blue" style="color: #264f6c">
            Pogledaj više
            <img
              src="/assets/icons/arrow-right-blue.svg"
              alt="arrow-right-blue"
              class="arrow-icon"
              style="color: #264f6c"
            />
          </span>
        </NuxtLink> -->
      </div>

      <!-- <div class="artist-container">
        <div v-for="workshop in workshops">
          <NuxtLink to="/workshops" style="text-decoration: none">
            <img
              v-if="workshop.imageSmall"
              :src="$urlFor(workshop.imageSmall).url()"
              alt="artist image"
              class="artist-image"
            />
            <p style="color: #264f6c">{{ workshop.name }}</p>
          </NuxtLink>
        </div>
      </div> -->

      <!-- <Carousel
        :value="workshops"
        :numVisible="2"
        :numScroll="1"
        :responsiveOptions="responsiveOptionsGalleryCarousel"
        :circular="true"
        :autoplayInterval="10000"
        :autoplay="true"
        class="workshops-carousel"
      >
        <template #item="slotProps">
          <div class="artist-carousel-container">
            <NuxtLink to="/workshops" style="text-decoration: none">
              <img
                v-if="slotProps.data.imageSmall"
                :src="$urlFor(slotProps.data.imageSmall).url()"
                alt="artist image"
                class="gallery-image"
              />
              <p style="color: #264f6c">{{ slotProps.data.name }}</p>
            </NuxtLink>
          </div>
        </template>
</Carousel> -->
    </div>

    <!-- <p class="soon-text">+ još uskoro...</p> -->

  </div>

  <div class="prijelaz-hero">
    <img src="/assets/prijelazi/prijelaz-plaza-more.svg" alt="prijelaz-plaza-more" />
  </div>

  <div class="sea-wrapper">
    <div class="gallery-marquee-wrapper">
      <div class="gallery-marquee-track gallery-marquee-left">
        <img v-for="(img, i) in [...galleryRow1, ...galleryRow1]" :key="'r1-' + i" :src="img.image" :alt="img.alt" class="gallery-marquee-image" />
      </div>
    </div>
    <div class="gallery-marquee-wrapper">
      <div class="gallery-marquee-track gallery-marquee-right">
        <img v-for="(img, i) in [...galleryRow2, ...galleryRow2]" :key="'r2-' + i" :src="img.image" :alt="img.alt" class="gallery-marquee-image" />
      </div>
    </div>
  </div>

  <div class="prijelaz-hero">
    <img src="/assets/prijelazi/prvi-dole.svg" alt="prijelaz-galerija" />
  </div>

  <Footer />

  <Marquee />

  <NavDrawer v-model="visibleRight" />
</template>

<style>
* {
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
  color: #264f6c !important;
}

.workshops-carousel .p-carousel-indicator-active .p-carousel-indicator-button {
  background-color: #264f6c !important;
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
  border-bottom: 1px solid #264f6c;
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

  font-size: 6rem;
  margin: 0;
  padding: 0;
  font-family: 'Bright';
  color: #efe5dd;
  z-index: 10;
  line-height: 3.5rem;
}

.year-text {
  font-family: 'LondrinaSolid';
  font-size: 3.5rem;
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
  font-size: 2rem;
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
  font-size: 4rem;
  font-weight: bold;
  color: #efe5dd;
  text-align: center;
}

.burger-icon-top {
  position: absolute;
  right: 1.5rem;
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

.prijelaz-zid-plaza {}

.soon-text {
  color: #264f6c;
  font-size: 1.5rem;
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
  font-size: 1.25rem;
  padding: 1.25rem;
  margin-right: 1rem;
  backdrop-filter: blur(6px);
}

.wall-text :deep(p) {
  color: inherit;
}

.title-text {
  font-family: 'Rokkitt', serif;
  font-size: 5rem;
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


.artist-tab {
  border-radius: 12px;
  padding: 0.25rem 1rem;
  height: fit-content;
  margin: 0.25rem;
}

.artist-carousel-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.workshops-carousel,
.artist-carousel {
  display: flex;
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
}

.ticket-name {
  font-weight: 900;
  font-size: 1.8rem;
  margin-bottom: 0.25rem;
  min-height: 4.4rem;
  display: flex;
  align-items: flex-start;
  text-align: center;
}

.ticket-price {
  font-size: 3rem;
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
  font-size: 4rem;
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
  font-size: 4rem;
  cursor: pointer;
  text-transform: uppercase;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/*  --------------- SEA --------------- */

.sea-wrapper {
  background-color: var(--knk-orange);
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
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-align: center;
  width: 100%;
  padding: 2rem 0;
  margin: 0;
}

@media (max-width: 900px) {

  .workshops-carousel,
  .artist-carousel {
    display: none;
  }

  .burger-icon-top {
    right: 1rem;
  }

  .header-text {
    font-size: 4rem;
  }

  .year-text {
    font-size: 2.5rem;
  }
}
</style>
