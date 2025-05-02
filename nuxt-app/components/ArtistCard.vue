<script setup lang="ts">
import { type Artist } from '~/types/Artist'

const props = defineProps<{
  artist: Artist
  reverse?: boolean
}>()
</script>

<template>
  <div :class="['artist-card', reverse ? 'reverse' : '']">
    <img
      v-if="artist.image"
      :src="$urlFor(artist.image).url()"
      alt="artist image"
      class="artist-image"
    />
    <div :class="['artist-info', !reverse ? 'reverse' : '']">
      <p class="artist-name">{{ artist.name }}</p>
      <p class="artist-description">{{ artist.description }}</p>

      <div class="artist-button">
        Saznaj više
        <img
          src="/assets/icons/arrow-right.svg"
          alt="arrow-right"
          class="arrow-icon"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.artist-card {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 90%;
  height: 15rem;
  margin: 1rem auto;

  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
}

.artist-card.reverse {
  flex-direction: row-reverse;
}

.artist-image {
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  max-width: 50%;

  object-fit: contain;
}

.artist-info {
  padding: 2% 5%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-content: stretch;
  align-items: flex-start;
  height: 100%;
  width: 100%;
}

.artist-info.reverse {
  text-align: right;
  align-items: flex-end;
}

.artist-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.artist-description {
  font-size: 1rem;
  color: #444;
  margin: 0;
}

.artist-button {
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

@media (max-width: 650px) {
  .artist-card,
  .artist-card.reverse {
    display: flex;
    flex-direction: column;
    height: 20rem;
    height: fit-content;

  }

  .artist-image,
  .artist-image {
    max-height: 12rem;
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
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
  }

  .artist-description {
    font-size: 0.8rem;
    color: #444;
  }

  .artist-button {
    font-size: 0.8rem;

    padding: 0.5rem 1rem;
    border-radius: 8px;

    align-self: end;
  }
}
</style>
