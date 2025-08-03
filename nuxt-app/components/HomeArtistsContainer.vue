<script setup lang="ts">
import { type Artist } from '~/types/Artist'

defineProps<{
  artists: Artist[]
}>()

const responsiveOptionsGalleryCarousel = [
  {
    breakpoint: '650px',
    numVisible: 1,
    numScroll: 1,
  },
]
</script>

<template>
  <div class="artist-container">
    <div v-for="artist in artists">
      <NuxtLink to="/lineup" style="text-decoration: none">
        <img
          v-if="artist.image"
          :src="$urlFor(artist.image).url()"
          alt="artist image"
          class="artist-image"
        />
        <p>{{ artist.name }}</p>
      </NuxtLink>
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
        <NuxtLink to="/lineup" style="text-decoration: none">
          <img
            v-if="slotProps.data.image"
            :src="$urlFor(slotProps.data.image).url()"
            alt="artist image"
            class="gallery-image"
          />
          <p>{{ slotProps.data.name }}</p>
        </NuxtLink>
      </div>
    </template>
  </Carousel>
</template>

<style>
:root {
  --p-tabs-tablist-background: transparent;
  --p-tabs-tabpanel-background: transparent;
  --p-tabs-tabpanel-padding: 0;
  --p-tabs-tab-active-color: #264f6c;
  --p-tabs-tab-active-border-color: #264f6c;
  --p-tabs-active-bar-background: #264f6c;
  --p-tabs-tab-hover-color: #264f6c;
  --p-tabs-tab-color: white;
  --p-tabs-tab-hover-background: #5c9c9c;
}

.artist-carousel .p-carousel-indicator-active .p-carousel-indicator-button {
  background-color: #5c9c9c !important;
}
</style>
<style scoped>
.artist-container {
  display: none;
  flex-direction: row;
  gap: 1rem;
  overflow: auto;
  padding-right: 1rem;
  margin-bottom: 2rem;
  margin-top: 1rem;
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

.workshops-carousel,
.artist-carousel {
  display: flex;
  padding-top: 1rem;
}

.gallery-image {
  max-width: 100%;
  height: auto;
  max-height: 15rem;
  border-radius: 8px;

  padding: 0 0.5rem;
}

@media (max-width: 900px) {
  .workshops-carousel,
  .artist-carousel {
    display: none;
  }

  .artist-container {
    display: flex;
  }
}
</style>
