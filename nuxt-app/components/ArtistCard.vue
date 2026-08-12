<script setup lang="ts">
import { type Artist } from '~/types/Artist'

const okvirs = ['/assets/icons/okvir-1.svg', '/assets/icons/okvir-2.svg', '/assets/icons/okvir-3.svg']

const props = defineProps<{
  artist: Artist
  reverse?: boolean
  index?: number
}>()

import { ref } from 'vue'
const { locale } = useI18n()

const showDialog = ref(false)

const description = computed(() =>
  locale.value === 'en' && props.artist.descriptionEn ? props.artist.descriptionEn : props.artist.description
)

const toggleShowDialog = (): void => {
  showDialog.value = !showDialog.value
}
</script>

<template>
  <div :class="['artist-card', reverse ? 'reverse' : '']">
    <div class="artist-image-wrapper" @click="toggleShowDialog">
      <img
        v-if="artist.image"
        :src="$urlFor(artist.image).url()"
        alt="artist image"
        class="artist-image"
      />
      <img :src="okvirs[(index ?? 0) % 3]" alt="" class="okvir-overlay" />
    </div>
    <div :class="['artist-info', !reverse ? 'reverse' : '']">
      <div class="artist-name-group">
        <p class="artist-name">{{ artist.name }}</p>
        <hr class="artist-divider" />
      </div>
      <p class="artist-description">{{ description }}</p>

      <div class="artist-button" @click="toggleShowDialog">
        {{ $t('common.learnMore') }}
        <img
          src="/assets/icons/arrow-right-orange.svg"
          alt="arrow-right"
          class="arrow-icon"
        />
      </div>
    </div>
  </div>

  <ArtistDialog
    v-model:visible="showDialog"
    :artist="artist"
    :index="index ?? 0"
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
.artist-card {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 90%;
  height: 24rem;
  margin: 1rem auto;

  background-color: var(--knk-orange);
  border-radius: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
}

.artist-card.reverse {
  flex-direction: row-reverse;
}

.artist-image-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  cursor: pointer;
}

.artist-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 12px;
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

.artist-info {
  padding: 2% 3%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-content: stretch;
  align-items: flex-start;

  gap: 0.5rem;
  height: 100%;
  width: 100%;
}

.artist-info.reverse {
  text-align: right;
  align-items: flex-end;
}

.artist-name {
  font-family: 'Rokkitt', serif;
  font-size: var(--text-subheading);
  font-weight: bold;
  margin: 0;
  text-align: center;
  width: 100%;
  color: white;
}

.artist-name-group {
  width: 100%;
}

.artist-divider {
  width: 100%;
  border: none;
  border-top: 2px solid white;
  margin: 0.25rem 0 0 0;
}

.artist-description {
  font-size: var(--text-body);
  color: white;
  margin: 0;
}

.artist-button {
  font-family: 'Montserrat';
  background-color: white;
  color: var(--knk-orange);
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

@media (max-width: 900px) {
  .artist-card,
  .artist-card.reverse {
    display: flex;
    flex-direction: column;
    height: 20rem;
    height: fit-content;
    width: calc(100% - 2rem);
    margin: 1rem auto;
  }

  .artist-image-wrapper {
    width: 100%;
    max-width: 100%;
    height: 12rem;
  }

  .artist-image {
    height: 12rem;
    width: 100%;
    object-fit: cover;
    max-width: 100%;
  }

  .artist-info.reverse,
  .artist-info {
    text-align: left;
    align-items: flex-start;

    height: fit-content;
    padding: 2% 2%;
  }

  .artist-name {
    font-weight: bold;
    margin: 0;
  }

  .artist-button {

    padding: 0.5rem 1rem;
    border-radius: 8px;

    align-self: end;
  }
}
</style>
