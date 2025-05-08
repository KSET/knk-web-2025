<script setup lang="ts">
import { ref } from 'vue'
import Header from '~/components/Header.vue'
import ArtistCard from '~/components/ArtistCard.vue'
import Footer from '~/components/Footer.vue'

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
      <p class="soon-text">+ još uskoro...</p>
    </div>
  </div>

  <div class="prijelaz-container">
    <img
      src="/assets/prijelazi/prijelaz-more-dm.svg"
      alt="prijelaz-zid-plaza"
      style="background-color: #844d99"
    />
  </div>

  <Footer />
</template>

<style scoped>
.artists-wrapper {
  display: flex;
  flex-direction: column;
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
  flex-direction: column;
  gap: 1rem;

  background-image: url('/assets/zid-teksture/zid-tekstura-lineup.svg');
  background-repeat: repeat;
  background-size: contain;

  min-height: 60rem;


  padding-top: 2rem;
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

.soon-text {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-top: 2rem;
}
</style>
