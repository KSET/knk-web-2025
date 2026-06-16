<script setup lang="ts">
import { ref } from 'vue'
import ArtistCard from '~/components/ArtistCard.vue'
import Footer from '~/components/Footer.vue'

import { useArtistsStore } from '../../stores/artists'

const localePath = useLocalePath()
const artistsStore = useArtistsStore()
const { formatDayLabel } = useDayLabel()

const visibleRight = ref(false)
const toggleVisibleRight = (): void => {
  visibleRight.value = !visibleRight.value
}

onMounted(async () => {
  await artistsStore.fetchArtists()
})

const selectedDay = ref('all')

// Day filter pills: an "all" pill plus one per non-empty day group.
const dayPills = computed(() => {
  const pills = [{ key: 'all', label: '' as string }]
  ;[artistsStore.day1, artistsStore.day2, artistsStore.day3].forEach(
    (day, i) => {
      if (day.artists.length) {
        pills.push({ key: `day${i + 1}`, label: formatDayLabel(day.date, i + 1) })
      }
    },
  )
  return pills
})

const visibleArtists = computed(() => {
  if (selectedDay.value === 'day1') return artistsStore.day1.artists
  if (selectedDay.value === 'day2') return artistsStore.day2.artists
  if (selectedDay.value === 'day3') return artistsStore.day3.artists
  return artistsStore.all
})
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee backgroundColor="var(--knk-orange)" textShadowColor="var(--knk-lightblue)" />

  <div class="page-header">
    <p class="page-title">{{ $t('nav.lineup') }}</p>
    <div class="header-right">
      <LanguageSwitcher />
      <img
        src="/assets/icons/burger.svg?v=2"
        alt="burger"
        @click="toggleVisibleRight"
        class="burger-icon"
      />
    </div>
  </div>

  <div class="artists-wrapper">
    <div v-if="dayPills.length > 1" class="filter-pills">
      <button
        v-for="pill in dayPills"
        :key="pill.key"
        type="button"
        :class="['filter-pill', selectedDay === pill.key ? 'active' : '']"
        @click="selectedDay = pill.key"
      >
        {{ pill.key === 'all' ? $t('lineup.all') : pill.label }}
      </button>
    </div>

    <div class="artists-container">
      <ArtistCard
        v-for="(artist, index) in visibleArtists"
        :key="`${selectedDay}-${artist._id}`"
        :artist="artist"
        :reverse="index % 2 !== 0"
        :index="index"
      />
    </div>

    <div class="ticket-buy-container">
      <NuxtLink :to="localePath('/tickets')" style="text-decoration: none">
        <button class="ticket-buy-button">
          {{ $t('common.buyTickets') }}
        </button>
      </NuxtLink>
    </div>
  </div>

  <Footer decor-image="/assets/icons/knjiga.svg" />
  <Marquee backgroundColor="var(--knk-orange)" textShadowColor="var(--knk-lightblue)" />

  <NavDrawer v-model="visibleRight" />
</template>

<style scoped>
.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 90%;
  margin: 0 auto 0.5rem;
}

@media (max-width: 650px) {
  .filter-pills {
    width: calc(100% - 2rem);
  }
}

.filter-pill {
  font-family: 'Rockwell', serif;
  font-weight: 700;
  font-size: 0.95rem;

  color: var(--knk-blue);
  background-color: white;
  border: 2.5px solid white;
  border-radius: 8px;
  padding: 0.2rem 0.75rem;

  cursor: pointer;
  text-transform: lowercase;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.filter-pill.active {
  background-color: var(--knk-blue);
  border-color: white;
  color: white;
}

.filter-pill:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.8);
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
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
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
  flex: 1;
  min-width: 0;
  text-align: center;
  overflow-wrap: anywhere;
}

.header-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.burger-icon {
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
    padding: 1rem;
  }

  .page-title {
    text-align: left;
  }
}
</style>
