<script setup lang="ts">
import Footer from '~/components/Footer.vue'
import type { Translation } from '~/types/Translation'
import { ref } from 'vue'

const query2 = groq`*[ _type == "translation"]`
const { data: translationsRaw } = await useSanityQuery<Translation[]>(query2)

const translations = Object.fromEntries(
  translationsRaw.value?.map((entry) => [entry.key, entry.text]) || [],
)

const visibleRight = ref(false)
const toggleVisibleRight = (): void => {
  visibleRight.value = !visibleRight.value
}
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee backgroundColor="var(--knk-orange)" textShadowColor="var(--knk-lightblue)" />

  <div class="page-header">
    <p class="page-title">festival</p>
    <img
      src="/assets/icons/burger.svg"
      alt="burger"
      @click="toggleVisibleRight"
      class="burger-icon"
    />
  </div>

  <div class="page-wrapper">
    <div class="kamp-image-wrapper">
      <img src="/assets/icons/krug-zuti.svg" alt="krug zuti" class="krug-zuti" />
      <img src="/assets/icons/krug-narancasti.svg" alt="krug narancasti" class="krug-narancasti" />
      <img src="/assets/icons/festival.jpg" alt="festival" class="kamp-image" />
    </div>

    <div class="info-section">
      <img src="/assets/icons/sunce.svg" alt="" class="sunce-bg" />
      <div class="info-content">
        <h1 class="info-title">info</h1>
        <div class="info-text">
          <BlockContent
            :blocks="translations?.infoFestivalText"
            class="info-text"
          />
        </div>
      </div>
    </div>

    <div style="display: flex; width: 100%; padding: 0 1rem;">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d365.7898541572364!2d14.5753015!3d45.0281636!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476373bfab3c4067%3A0xa899598a56cfc788!2sFran%20Krsto%20Frankopan%20Elementary%20School!5e1!3m2!1sen!2shr!4v1754159994657!5m2!1sen!2shr"
        width="900"
        height="450"
        style="border: 0; flex: 1"
        allowfullscreen="true"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>

  </div>

  <Footer />
  <Marquee />

  <NavDrawer v-model="visibleRight" />
</template>

<style scoped>
.page-header {
  background-color: var(--knk-blue);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 1.5rem 1rem;
}

.page-title {
  font-family: 'Rokkitt', serif;
  font-size: 5rem;
  font-weight: 500;
  color: #efe5dd;
  text-shadow: 3px 4px 0 var(--knk-orange);
  margin: 0;
}

.burger-icon {
  position: absolute;
  right: 1.5rem;
  cursor: pointer;
  width: 2.5rem;
  border-radius: 0;
}

.info-section {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem 1rem;
  margin-top: -6rem;
  overflow: visible;
}

.sunce-bg {
  position: absolute;
  height: 100%;
  width: auto;
  aspect-ratio: 1;
  border-radius: 0;
  z-index: 0;
}

.info-content {
  position: relative;
  z-index: 1;
  max-width: 28rem;
  text-align: center;
  padding: 3rem 2rem;
}

.info-title {
  font-family: 'Rockwell', serif;
  font-size: 3rem;
  font-weight: 900;
  color: white;
  text-shadow: 3px 4px 0 var(--knk-orange);
  margin: 0 0 1rem 0;
  border: 3px solid white;
  display: inline-block;
  padding: 0.25rem 1.5rem;
}

.page-wrapper {
  min-height: 70vh;
  background-color: var(--knk-blue);
  height: fit-content;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  padding-top: 2rem;
}

.kamp-image-wrapper {
  position: relative;
  width: 100%;
  padding: 0 1rem;
  margin-bottom: 2rem;
  z-index: 2;
}

.kamp-image {
  width: 80%;
  height: auto;
  border-radius: 0;
  display: block;
  margin: 0 auto;
}

.krug-zuti {
  position: absolute;
  top: 5%;
  left: 0;
  width: 25%;
  height: auto;
  aspect-ratio: 1;
  z-index: 10;
  border-radius: 0;
}

.krug-narancasti {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 25%;
  height: auto;
  aspect-ratio: 1;
  z-index: 10;
  border-radius: 0;
}

.info-text {
  color: white;
  font-size: 1.5rem;
  line-height: 1.6;
}
</style>
