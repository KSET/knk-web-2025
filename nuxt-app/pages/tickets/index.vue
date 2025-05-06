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

// loading pretix script
import { onMounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://karte.kset.org/widget/v1.en.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
})
</script>

<template>
  <Header />

  <div class="page-wrapper">
    <div class="page-container">
      <h1 style="color: white">Karte</h1>
      <client-only>
        <div
          class="pretix-widget-compat"
          event="https://karte.kset.org/kset/kset-na-krku/"
          single-item-select="button"
        ></div>
      </client-only>
      <noscript>
        <div class="pretix-widget">
          <div class="pretix-widget-info-message">
            JavaScript is disabled in your browser. To access our ticket shop
            without JavaScript, please
            <a
              target="_blank"
              rel="noopener"
              href="https://karte.kset.org/kset/kset-na-krku/"
              >click here</a
            >.
          </div>
        </div>
      </noscript>
    </div>
  </div>

  <div class="prijelaz-container">
    <img
      src="/assets/prijelazi/prijelaz-more-dm.svg"
      alt="prijelaz-zid-plaza"
      style="background-color: #dd7d91"
    />
  </div>

  <Footer />
</template>

<style>
.pretix-widget {
  background-color: white !important;
}

.pretix-widget-item-description p {
  color: gray !important;
}
</style>

<style scoped>
.page-container {
  max-width: 50rem;
  width: 100%;
  padding: 1rem;
}

.page-wrapper {
  min-height: 70vh;
  background-color: #dd7d91;
  height: fit-content;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  background-image: url('/assets/zid-teksture/zid-tekstura-landing.svg');
  background-repeat: repeat;
  background-size: contain;

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
</style>
