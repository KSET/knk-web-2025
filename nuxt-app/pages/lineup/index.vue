<script setup lang="ts">
import { ref } from 'vue'
import Header from '~/components/Header.vue'
import ArtistCard from '~/components/ArtistCard.vue'

import { type Artist } from '~/types/Artist'
import { Button } from 'primevue'

const query = groq`*[ _type == "artist"] | order(_createdAt desc)`
const { data: artists } = await useSanityQuery<Artist[]>(query)

console.log(artists)
</script>

<template>
  <Header />

  <div class="artists-wrapper">
    <div class="artists-container">
      <ArtistCard
        v-for="(artist, index) in artists"
        :key="artist._id"
        :artist="artist"
        :reverse="index % 2 !== 0"
      />
    </div>
  </div>
</template>

<style scoped>
.artists-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.artists-container {
  max-width: 50rem;
  width: 100%;
}

.artists-wrapper {
  background-color: #844d99;
  height: fit-content;
  width: 100%;

  display: flex;
  justify-content: center;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  background-image: url('/assets/icons/zid-tekstura-lineup.svg');
  background-repeat: repeat;
  background-size: contain;

  padding-top: 2rem;
}
</style>
