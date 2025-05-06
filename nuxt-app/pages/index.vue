<script setup lang="ts">
import { Button } from 'primevue'
import { type Artist } from '~/types/Artist'
import { type GallerySection } from '~/types/GallerySection'
import { ref } from 'vue'

import Footer from '~/components/Footer.vue'
import type { Translation } from '~/types/Translation'

const query = groq`*[ _type == "artist"] | order(_createdAt desc)`
const { data: artists } = await useSanityQuery<Artist[]>(query)

const query2 = groq`*[ _type == "translation"]`
const { data: translationsRaw } = await useSanityQuery<Translation[]>(query2)

const translations = Object.fromEntries(
  translationsRaw.value?.map((entry) => [entry.key, entry.text]) || [],
)

const visibleRight = ref(false)

const toggleVisibleRight = (): void => {
  visibleRight.value = !visibleRight.value
}

const queryGallerySections = groq`*[_type == "gallerySection"] | order(_createdAt desc)`
const { data: gallerySections } =
  await useSanityQuery<GallerySection[]>(queryGallerySections)

const galleryImages =
  gallerySections.value?.flatMap((section) =>
    (section.images ?? []).slice(0, 4).map((img, index) => ({
      image: urlFor(img).width(600).url(),
      alt: `Image ${index + 1}`,
    })),
  ) || []

const responsiveOptionsGalleryCarousel = [
  {
    breakpoint: '650px',
    numVisible: 1,
    numScroll: 1,
  },
]
</script>

<template>
  <div class="header-wrapper">
    <div class="header-container">
      <img
        src="/assets/icons/burger.svg"
        alt="burger"
        @click="toggleVisibleRight"
        class="burger-icon"
      />
      <div class="header-text-container">
        <p class="header-text">kset</p>
        <p class="header-text" style="text-align: center">na krku</p>
        <!-- <p class="header-text" style="text-align: end">2025</p> -->
        <img
          src="/assets/icons/2025.svg"
          alt="2025"
          class="2025-icon"
          style="align-self: flex-end"
        />
      </div>

      <img src="/assets/icons/sunce.svg" alt="Sunce" class="sunce-icon" />
      <img src="/assets/icons/oblaci.svg" alt="oblaci" class="oblaci-icon" />
    </div>
    <p class="header-date">14.-16.8.2025.</p>
  </div>

  <div class="wall-divider" />
  <div class="wall-wrapper">
    <div class="wall-container">
      <div class="wall-text-container">
        <p class="title-text">O KNK-u</p>
        <p class="wall-text">
          <BlockContent
            :blocks="translations?.landingPageText"
            class="wall-text"
          />
        </p>
      </div>

      <div class="title-text-container">
        <p class="title-text">Izvođači</p>

        <NuxtLink to="/gallery" style="text-decoration: none">
          <div class="title-button" style="background-color: #5c9c9c">
            Pogledaj više
            <img
              src="/assets/icons/arrow-right.svg"
              alt="arrow-right"
              class="arrow-icon"
            />
          </div>
        </NuxtLink>
      </div>
      <div class="artist-container">
        <div v-for="artist in artists">
          <img
            v-if="artist.image"
            :src="$urlFor(artist.image).url()"
            alt="artist image"
            class="artist-image"
          />
          <p>{{ artist.name }}</p>
        </div>
      </div>

      <Carousel
        :value="artists"
        :numVisible="2"
        :numScroll="1"
        :responsiveOptions="responsiveOptionsGalleryCarousel"
        :circular="true"
        :autoplayInterval="10000"
        :autoplay="true"
        class="artist-carousel"
      >
        <template #item="slotProps">
          <div class="artist-carousel-container">
            <img
              v-if="slotProps.data.image"
              :src="$urlFor(slotProps.data.image).url()"
              alt="artist image"
              class="gallery-image"
            />
            <p>{{ slotProps.data.name }}</p>
          </div>
        </template>
      </Carousel>
    </div>

    <div class="prijelaz-container">
      <img
        src="/assets/prijelazi/prijelaz-zid-plaza.svg"
        alt="prijelaz-zid-plaza"
        class="prijelaz-zid-plaza"
      />
    </div>
  </div>

  <div class="beach-wrapper">
    <!-- <div class="beach-container">
      <p class="title-text">Raspored</p>

      <div class="artist-container">
        <div v-for="artist in artists">
          <img v-if="artist.image" :src="$urlFor(artist.image).url()" alt="artist image" class="artist-image" />
        </div>
      </div>
    </div> -->

    <div class="prijelaz-container">
      <img
        src="/assets/prijelazi/prijelaz-plaza-more.svg"
        alt="prijelaz-zid-plaza"
      />
    </div>
  </div>

  <div class="sea-wrapper">
    <div class="sea-container">
      <div class="title-text-container">
        <p class="title-text">Galerija</p>

        <NuxtLink to="/lineup" style="text-decoration: none">
          <div class="title-button">
            Pogledaj više
            <img
              src="/assets/icons/arrow-right.svg"
              alt="arrow-right"
              class="arrow-icon"
            />
          </div>
        </NuxtLink>
      </div>

      <Carousel
        :value="galleryImages"
        :numVisible="2"
        :numScroll="1"
        :responsiveOptions="responsiveOptionsGalleryCarousel"
        :circular="true"
        :autoplayInterval="10000"
        :autoplay="true"
      >
        <template #item="slotProps">
          <div class="gallery-container">
            <img
              v-if="slotProps.data.image"
              :src="slotProps.data.image"
              alt="artist image"
              class="gallery-image"
            />
          </div>
        </template>
      </Carousel>
    </div>
  </div>

  <div class="prijelaz-container">
    <img
      src="/assets/prijelazi/prijelaz-more-dm.svg"
      alt="prijelaz-zid-plaza"
      style="background-color: #5c9c9c"
    />
  </div>

  <Footer />

  <Drawer v-model:visible="visibleRight" hedaer=" " position="right">
    <div class="drawer-wrapper">
      <div class="drawer-container" @click="toggleVisibleRight">
        <div>
          <NuxtLink
            to="/"
            class="hover:underline drawer-text"
            style="color: #844d99"
            >Naslovnica</NuxtLink
          >
        </div>
        <div>
          <NuxtLink
            to="/lineup"
            class="hover:underline drawer-text"
            style="color: #dd7d91"
            >Izvođači</NuxtLink
          >
        </div>
        <div>
          <NuxtLink
            to="/gallery"
            class="hover:underline drawer-text"
            style="color: #e55a8e"
            >Galerija</NuxtLink
          >
        </div>
        <div>
          <NuxtLink
            to="/info"
            class="hover:underline drawer-text"
            style="color: #5c9c9c"
            >Info</NuxtLink
          >
        </div>
        <div>
          <NuxtLink
            to="/tickets"
            class="hover:underline drawer-text"
            style="color: #264f6c"
            >Karte</NuxtLink
          >
        </div>
      </div>

      <div class="drawer-footer">
        <img
          src="/assets/icons/stolica.svg"
          alt="stolica"
          class="stolica-icon"
        />
        <div class="zuta-podloga"></div>
      </div>
    </div>
  </Drawer>
</template>

<style>
:root {
  --p-carousel-indicator-active-background: #e55a8e !important;
}

.p-carousel-indicator-active .p-carousel-indicator-button {
  background-color: #e55a8e !important;
}

.p-drawer {
  background-color: #f7dec0 !important;
}

.p-drawer-content {
  padding: 0 !important;
}

.p-carousel-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

img {
  border-radius: 8px;
}
</style>

<style scoped>
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

.title-button {
  font-family: 'Montserrat';
  background-color: #dd7d91;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  width: fit-content;

  display: flex;
  align-items: center;
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
}

/*  --------------- HEADER --------------- */

.header-wrapper {
  background-color: #76c6d2;
  width: 100%;
  height: 15rem;
}

.header-container {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
}

.header-text-container {
  width: 65%;
  display: flex;
  flex-direction: column;
}

.header-text {
  position: relative;
  text-shadow: 3px 4px 0 #e4c9b3;

  font-size: 6rem;
  margin: 0;
  padding: 0;
  font-family: 'Bright';
  color: #efe5dd;
  z-index: 10;
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
  font-family: 'Bright';
  color: #efe5dd;
  font-size: 1rem;
  text-align: center;
  margin: 0;
  padding: 0;
}

.burger-icon {
  position: absolute;
  right: 0%;
  top: 15%;
  cursor: pointer;

  border-radius: 0px;
}

/*  --------------- WALL --------------- */

.wall-divider {
  background-color: #e55a8e;
  width: 100%;
  height: 1rem;
}

.wall-wrapper {
  background-color: #dd7d91;
  height: fit-content;
  width: 100%;

  display: flex;
  justify-content: center;
  flex-direction: column;

  background-image: url('/assets/zid-teksture/zid-tekstura-landing.svg');
  background-repeat: repeat;
  background-size: contain;

  margin-bottom: -1px;
}

.prijelaz-zid-plaza {
}

.wall-container {
  width: 100%;
  padding-left: 1rem;
}

.wall-text {
  width: 100%;
  padding-right: 1rem;
}

.title-text {
  font-size: 1.5rem;
  font-weight: bold;
}

.artist-container {
  display: none;
  flex-direction: row;
  gap: 1rem;
  overflow: auto;
  padding-right: 1rem;
  margin-bottom: 2rem;
}

.artist-image {
  width: auto;
  height: auto;
  max-height: 10rem;
  object-fit: contain;
}

.artist-carousel-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.artist-carousel {
  display: flex;
}

/*  --------------- BEACH --------------- */

.beach-wrapper {
  background-color: #f3d864;
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

/*  --------------- SEA --------------- */

.sea-wrapper {
  background-color: #5c9c9c;
  height: fit-content;
  width: 100%;

  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-bottom: 2rem;
}

.sea-container {
  width: 100%;
  padding-left: 1rem;
}

.gallery-container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  overflow: auto;
  padding-right: 1rem;
  justify-content: center;
}

.gallery-image {
  max-width: 100%;
  height: auto;
  max-height: 15rem;
  border-radius: 8px;
}

/*  --------------- DRAWER --------------- */

.drawer-wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 60% 40%;
}

.drawer-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 100%;
}

.drawer-text {
  font-family: 'Montserrat';
  font-size: 1.5rem;
  text-align: center;
  margin: 0;
  padding: 0;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: bold;
}

.drawer-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.stolica-icon {
  height: 80%;
  z-index: 10;
}

.zuta-podloga {
  background: #f3bb64;
  position: absolute;
  top: 70%;
  bottom: 0;
  left: 0;
  right: 0;
}

/*  --------------- RESPONNZIVNOST --------------- */

.wall-wrapper,
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
  max-width: 50rem;
  width: 100%;
}

@media (max-width: 900px) {
  .artist-carousel {
    display: none;
  }

  .artist-container {
    display: flex;
  }

  .burger-icon {
    right: 7%;
  }

  .header-text {
    font-size: 4rem;
  }
}
</style>
