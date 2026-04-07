<script setup lang="ts">
import { type Artist } from '~/types/Artist'

const okvirs = ['/assets/icons/okvir-1.svg', '/assets/icons/okvir-2.svg', '/assets/icons/okvir-3.svg']

defineProps<{
  artists: Artist[]
}>()
</script>

<template>
  <div class="artist-container">
    <div v-for="(artist, index) in artists" :key="artist._id" class="artist-item">
      <NuxtLink to="/lineup" style="text-decoration: none">
        <div class="artist-image-wrapper">
          <img
            v-if="artist.image"
            :src="$urlFor(artist.image).url()"
            alt="artist image"
            class="artist-image"
            draggable="false"
          />
          <img :src="okvirs[index % 3]" alt="" class="okvir-overlay" draggable="false" />
        </div>
        <p class="artist-name">{{ artist.name }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.artist-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding-right: 1rem;
  margin-bottom: 2rem;
  margin-top: 1rem;
}

.artist-item {
  min-width: 0;
}

@media (max-width: 768px) {
  .artist-container {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .artist-container::-webkit-scrollbar {
    display: none;
  }

  .artist-item {
    flex-shrink: 0;
  }
}

.artist-image-wrapper {
  position: relative;
  height: auto;
}

@media (min-width: 769px) {
  .artist-image-wrapper {
    height: clamp(12rem, 20vw, 18rem);
  }
}

.artist-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (max-width: 768px) {
  .artist-image {
    max-height: 20rem;
    width: auto;
  }
}

.okvir-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  border-radius: 0;
}

.artist-name {
  font-family: 'Rockwell', serif;
  font-size: 1.5em;
  text-align: center;
  margin-top: 0.25rem;
}
</style>
