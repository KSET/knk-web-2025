<script setup lang="ts">
import Header from '~/components/Header.vue'
import WorkshopCard from '~/components/WorkshopCard.vue'
import Footer from '~/components/Footer.vue'

import type { Workshop } from '~/types/Workshop'
import type { Translation } from '~/types/Translation'

const query = groq`*[_type == "workshop"] | order(location asc, orderRank asc)`
const { data: workshops } = await useSanityQuery<Workshop[]>(query)

const uniqueLocations = computed(() => [
  ...new Set((workshops.value ?? []).map((w) => w.location)),
])

const groupedByLocation = (location: string) =>
  (workshops.value ?? []).filter((w) => w.location === location)

const query2 = groq`*[ _type == "translation"]`
const { data: translationsRaw } = await useSanityQuery<Translation[]>(query2)

const translations = Object.fromEntries(
  translationsRaw.value?.map((entry) => [entry.key, entry.text]) || [],
)

const workshopsFormLink = translations['workshopsFormLink']
const getPlainTextLink = (blocks: any[]): string | undefined => {
  if (!Array.isArray(blocks)) return undefined

  const firstBlock = blocks[0]
  const firstSpan = firstBlock?.children?.[0]

  const text = firstSpan?.text || ''
  const isLink = text.startsWith('http://') || text.startsWith('https://')

  return isLink ? text : undefined
}

const formLink = computed(() => getPlainTextLink(workshopsFormLink))
</script>

<template>
  <Header />

  <div class="workshops-wrapper">
    <div v-for="location in uniqueLocations" :key="location">
      <div class="title-container">
        <h3 style="color: white; text-transform: capitalize">{{ location }}</h3>
        <a
          v-if="workshopsFormLink"
          :href="formLink"
          target="_blank"
          rel="noopener noreferrer"
          class="title-button"
        >
          Prijavi se
          <img
            src="/assets/icons/arrow-right.svg"
            alt="arrow-right"
            class="arrow-icon"
          />
        </a>
      </div>

      <div class="workshops-container">
        <WorkshopCard
          v-for="(workshop, index) in groupedByLocation(location)"
          :key="workshop._id"
          :workshop="workshop"
          :reverse="index % 2 !== 0"
        />
      </div>
    </div>

    <!-- <p class="soon-text">+ još uskoro...</p> -->
  </div>

  <div class="prijelaz-container">
    <img
      src="/assets/prijelazi/prijelaz-more-dm.svg"
      alt="prijelaz-zid-plaza"
      style="background-color: #d46558"
    />
  </div>

  <Footer />
</template>

<style scoped>
.workshops-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.workshops-container {
  max-width: 50rem;
  width: 100%;

  display: grid;
  grid-template-columns: 50% 50%;
  row-gap: 1rem;
}

.workshops-wrapper {
  background-color: #d46558;
  height: fit-content;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  background-image: url('/assets/zid-teksture/zid-tekstura-orange.svg');
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

.title-button {
  font-family: 'Montserrat';
  /* background-color: #dd7d91; */
  color: #fff;
  padding: 0 0 0.2rem 0;
  border-radius: 0;
  text-align: center;
  cursor: pointer;
  width: fit-content;

  display: flex;
  align-items: center;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease;
  text-decoration: none;
}

.title-button:hover {
  border-bottom: 1px solid white;
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 0.5rem;
}

@media (max-width: 900px) {
  .workshops-container {
    display: flex;
    flex-direction: column;
  }
}
</style>
