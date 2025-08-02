<script setup lang="ts">
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import type { Translation } from '~/types/Translation'
import { display } from '@primeuix/themes/aura/inplace'

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

      <div style="display: flex">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d365.7898541572364!2d14.5753015!3d45.0281636!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476373bfab3c4067%3A0xa899598a56cfc788!2sFran%20Krsto%20Frankopan%20Elementary%20School!5e1!3m2!1sen!2shr!4v1754159994657!5m2!1sen!2shr"
          width="900  "
          height="450"
          style="border: 0; flex: 1"
          allowfullscreen="true"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <h1 style="color: white">Informacije o kampu</h1>
      <div class="info-text">
        <BlockContent :blocks="translations?.infoKampText" class="info-text" />
      </div>

      <div style="display: flex">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d3230.7207613447326!2d14.557621187211181!3d45.026320259352104!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDXCsDAxJzMzLjQiTiAxNMKwMzMnMTguMyJF!5e1!3m2!1sen!2shr!4v1754159904806!5m2!1sen!2shr"
          width="900  "
          height="450"
          style="border: 0; flex: 1"
          allowfullscreen="true"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
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
