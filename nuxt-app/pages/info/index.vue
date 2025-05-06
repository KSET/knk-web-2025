<script setup lang="ts">
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import type { Translation } from '~/types/Translation'

const query2 = groq`*[ _type == "translation"]`
const { data: translationsRaw } = await useSanityQuery<Translation[]>(query2)

const translations = Object.fromEntries(
  translationsRaw.value?.map((entry) => [entry.key, entry.text]) || [],
)
</script>

<template>
  <Header />

  <div class="page-wrapper">
    <div class="page-container">
      <h1 style="color: white">Informacije o festivalu</h1>
      <div class="info-text">
        <BlockContent
          :blocks="translations?.infoFestivalText"
          class="info-text"
        />
      </div>
      <h1 style="color: white">Informacije o Kampu</h1>
      <div class="info-text">
        <BlockContent :blocks="translations?.infoKampText" class="info-text" />
      </div>
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
.page-container {
  max-width: 50rem;
  width: 100%;
  padding: 1rem;
}

.page-wrapper {
  min-height: 70vh;
  background-color: #844d99;
  height: fit-content;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  background-image: url('/assets/zid-teksture/zid-tekstura-lineup.svg');
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

.info-text {
  color: white;
}
</style>
