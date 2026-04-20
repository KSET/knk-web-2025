<script setup lang="ts">
import { type Artist } from '~/types/Artist'

const okvirs = ['/assets/icons/okvir-1.svg', '/assets/icons/okvir-2.svg', '/assets/icons/okvir-3.svg']

defineProps<{
  artists: Artist[]
}>()

const { locale } = useI18n()

const selectedArtist = ref<Artist | null>(null)
const showDialog = ref(false)

function openArtist(artist: Artist) {
  selectedArtist.value = artist
  showDialog.value = true
}

const description = computed(() =>
  selectedArtist.value
    ? (locale.value === 'en' && selectedArtist.value.descriptionEn
        ? selectedArtist.value.descriptionEn
        : selectedArtist.value.description)
    : undefined
)

const bio = computed(() =>
  selectedArtist.value
    ? (locale.value === 'en' && selectedArtist.value.bioEn
        ? selectedArtist.value.bioEn
        : selectedArtist.value.bio)
    : undefined
)
</script>

<template>
  <div class="artist-container">
    <div v-for="(artist, index) in artists" :key="artist._id" class="artist-item" @click="openArtist(artist)">
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
    </div>
  </div>

  <Dialog
    v-if="selectedArtist"
    v-model:visible="showDialog"
    modal
    :header="selectedArtist.name"
    class="artist-dialog"
    style="max-width: 30rem"
  >
    <template #default>
      <div class="artist-dialog-image-wrapper">
        <img
          v-if="selectedArtist.image"
          :src="$urlFor(selectedArtist.image).url()"
          alt="artist image"
          class="artist-dialog-image"
        />
        <img :src="okvirs[artists.indexOf(selectedArtist) % 3]" alt="" class="okvir-overlay dialog-okvir" />
      </div>
      <p v-if="bio">{{ bio }}</p>
      <p v-else>Nema dodatnih informacija.</p>
    </template>
  </Dialog>
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
  font-family: 'Rockwell', serif;
}

.artist-dialog {
  width: 95%;
  max-width: 30rem;
  height: fit-content;
  margin: auto;

  display: flex;
  flex-direction: column;
  gap: 0rem;

  background-color: var(--knk-orange);
  border-radius: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>

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

.artist-dialog-image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 15rem;
}

.artist-dialog-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.dialog-okvir {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  border-radius: 0;
}
</style>
