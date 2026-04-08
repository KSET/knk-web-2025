<script setup lang="ts">
import { ref } from 'vue'
import ArtistCard from '~/components/ArtistCard.vue'
import Footer from '~/components/Footer.vue'

import { useArtistsStore } from '../../stores/artists'

const artistsStore = useArtistsStore()

const visibleRight = ref(false)
const toggleVisibleRight = (): void => {
  visibleRight.value = !visibleRight.value
}

onMounted(async () => {
  await artistsStore.fetchArtists()
})
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee backgroundColor="var(--knk-orange)" textShadowColor="var(--knk-lightblue)" />

  <div class="page-header">
    <p class="page-title">izvođači</p>
    <img
      src="/assets/icons/burger.svg"
      alt="burger"
      @click="toggleVisibleRight"
      class="burger-icon"
    />
  </div>

  <div class="artists-wrapper">
    <!-- <Tabs value="0">
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
        <TabPanel value="0"> -->
          <div class="artists-container">
            <ArtistCard
              v-for="(artist, index) in artistsStore.all"
              :key="artist._id"
              :artist="artist"
              :reverse="index % 2 !== 0"
              :index="index"
            />
          </div>

          <p class="coming-soon-text">+ još uskoro...</p>

          <div class="ticket-buy-container">
            <NuxtLink to="/tickets" style="text-decoration: none">
              <button class="ticket-buy-button">
                kupi ulaznice
              </button>
            </NuxtLink>
          </div>
        <!-- </TabPanel>

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
    </Tabs> -->
  </div>

  <Footer decor-image="/assets/icons/knjiga.svg" />
  <Marquee backgroundColor="var(--knk-orange)" textShadowColor="var(--knk-lightblue)" />

  <NavDrawer v-model="visibleRight" />
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
  width: 100%;
}

.artists-wrapper {
  background-color: var(--knk-blue);
  height: fit-content;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 1rem;

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

.ticket-buy-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 2rem 1rem;
}

.ticket-buy-button {
  background-color: white;
  color: var(--knk-orange);
  padding: 12px 40px;
  border: none;
  border-radius: 12px;
  font-family: 'Rokkitt', serif;
  font-weight: bold;
  font-size: 4rem;
  cursor: pointer;
  text-transform: uppercase;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.soon-text {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-top: 2rem;
}

.coming-soon-text {
  font-family: 'Rockwell', serif;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-align: center;
  width: 100%;
  padding: 2rem 0;
  margin: 0;
}

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

@media (max-width: 900px) {
  .page-title {
    font-size: 3.5rem;
  }

  .ticket-buy-button {
    font-size: 2.5rem;
    padding: 10px 28px;
  }

  .coming-soon-text {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2.5rem;
    text-shadow: 2px 3px 0 var(--knk-orange);
  }

  .ticket-buy-button {
    font-size: 1.8rem;
    padding: 8px 20px;
  }

  .coming-soon-text {
    font-size: 1.2rem;
  }

  .burger-icon {
    width: 1.8rem;
  }

  .page-header {
    padding: 1rem 0.75rem;
  }
}
</style>
