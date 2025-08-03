<script setup lang="ts">
import { ref } from 'vue'
import Header from '~/components/Header.vue'
import ArtistCard from '~/components/ArtistCard.vue'
import Footer from '~/components/Footer.vue'

import { useArtistsStore } from '../../stores/artists'

const artistsStore = useArtistsStore()

onMounted(async () => {
  await artistsStore.fetchArtists()
})

function formatShowDate(date: string | Date): string {
  const d = new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${day}.${month}.`
}
</script>

<template>
  <Header />

  <div class="artists-wrapper">
    <Tabs value="0">
      <TabList style="flex-wrap: wrap; margin: auto 1rem">
        <Tab value="0" class="artist-tab">Svi</Tab>
        <Tab value="1" class="artist-tab"
          >Dan 1 – {{ formatShowDate(artistsStore.day1.date) }}</Tab
        >
        <Tab value="2" class="artist-tab"
          >Dan 2 – {{ formatShowDate(artistsStore.day2.date) }}</Tab
        >
        <Tab value="3" class="artist-tab"
          >Dan 3 – {{ formatShowDate(artistsStore.day3.date) }}</Tab
        >
      </TabList>

      <TabPanels>
        <TabPanel value="0">
          <div class="artists-container">
            <ArtistCard
              v-for="(artist, index) in artistsStore.all"
              :key="artist._id"
              :artist="artist"
              :reverse="index % 2 !== 0"
            />
          </div>
        </TabPanel>

        <TabPanel value="1">
          <div class="artists-container">
            <ArtistCard
              v-for="(artist, index) in artistsStore.day1.artists"
              :key="artist._id"
              :artist="artist"
              :reverse="index % 2 !== 0"
            />
          </div>
        </TabPanel>

        <TabPanel value="2">
          <div class="artists-container">
            <ArtistCard
              v-for="(artist, index) in artistsStore.day2.artists"
              :key="artist._id"
              :artist="artist"
              :reverse="index % 2 !== 0"
            />
          </div>
        </TabPanel>

        <TabPanel value="3">
          <div class="artists-container">
            <ArtistCard
              v-for="(artist, index) in artistsStore.day3.artists"
              :key="artist._id"
              :artist="artist"
              :reverse="index % 2 !== 0"
            />
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
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
.artist-tab {
  border-radius: 12px;
  padding: 0.25rem 1rem;
  height: fit-content;
  margin: 0.25rem;
}

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
