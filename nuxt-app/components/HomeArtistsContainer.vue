<script setup lang="ts">
import { type Artist } from '~/types/Artist'

const okvirs = ['/assets/icons/okvir-1.svg', '/assets/icons/okvir-2.svg', '/assets/icons/okvir-3.svg']

defineProps<{
  artists: Artist[]
}>()

const selectedArtist = ref<Artist | null>(null)
const selectedIndex = ref(0)
const showDialog = ref(false)

function openArtist(artist: Artist, index: number) {
  selectedArtist.value = artist
  selectedIndex.value = index
  showDialog.value = true
}
</script>

<template>
  <div class="artist-container">
    <div v-for="(artist, index) in artists" :key="artist._id" class="artist-item" @click="openArtist(artist, index)">
      <div class="artist-image-wrapper">
        <img
          v-if="artist.image"
          :src="$urlFor(artist.image).width(800).auto('format').url()"
          alt="artist image"
          class="artist-image"
          loading="eager"
          draggable="false"
        />
        <img :src="okvirs[index % 3]" alt="" class="okvir-overlay" draggable="false" />
      </div>
      <p class="artist-name">{{ artist.name }}</p>
    </div>
  </div>

  <ArtistDialog
    v-model:visible="showDialog"
    :artist="selectedArtist"
    :index="selectedIndex"
  />
</template>

<style>
.p-dialog-close-button,
.p-dialog {
  color: white !important;
}

.p-dialog-close-button:not(:disabled):hover {
  color: black !important;
}

.p-dialog-header {
  padding-top: 16rem;
  padding-bottom: 0rem;
  font-family: 'Rokkitt', serif;
}
</style>

<style scoped>
.artist-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  margin-top: 1rem;
}

.artist-item {
  min-width: 0;
  cursor: pointer;
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
    margin-left: -1rem;
    margin-right: -1rem;
    padding-left: 1rem;
    padding-right: 1rem;
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
    aspect-ratio: 16 / 9;
    height: auto;
  }
}

@media (max-width: 768px) {
  .artist-image-wrapper {
    width: 80vw;
    max-width: 26rem;
    aspect-ratio: 16 / 9;
    height: auto;
  }
}

.artist-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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
  font-family: 'Rokkitt', serif;
  font-size: var(--text-title);
  text-align: center;
  margin-top: 0.25rem;
}

</style>
