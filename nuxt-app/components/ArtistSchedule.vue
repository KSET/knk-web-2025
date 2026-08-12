<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useArtistsStore } from '~/stores/artists'
import type { Artist } from '~/types/Artist'

const { formatDayLabel } = useDayLabel()

const artistsStore = useArtistsStore()
await artistsStore.fetchArtists()

const DOOR_TIMES = ['20:45', '21:00', '21:00']

const startTime = (a: Artist) => {
  const t = a.timeline?.start ? new Date(a.timeline.start).getTime() : NaN
  return isNaN(t) ? Infinity : t
}

const days = computed(() =>
  [artistsStore.day1, artistsStore.day2, artistsStore.day3]
    .map((d, i) => ({ ...d, doorTime: DOOR_TIMES[i] ?? '' }))
    .filter((d) => d.date && d.artists.length)
    .map((d) => ({
      date: d.date,
      label: formatDayLabel(d.date),
      doorTime: d.doorTime,
      artists: [...d.artists].sort((a, b) => startTime(a) - startTime(b)),
    })),
)

const selectedDayIndex = ref(0)

const activeDayIndex = computed(() =>
  Math.min(selectedDayIndex.value, Math.max(days.value.length - 1, 0)),
)

onMounted(() => {
  const todayKey = festivalDateKey(new Date())
  const i = days.value.findIndex(
    (d) => festivalDateKey(new Date(d.date)) === todayKey,
  )
  if (i >= 0) selectedDayIndex.value = i
})

const formatTime = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('hr-HR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: FESTIVAL_TIME_ZONE,
  })
}

const selectedArtist = ref<Artist | null>(null)
const showDialog = ref(false)

const openArtist = (a: Artist) => {
  selectedArtist.value = a
  showDialog.value = true
}
</script>

<template>
  <div class="artist-schedule">
    <div v-if="days.length > 1" class="filter-pills">
      <button
        v-for="(day, index) in days"
        :key="day.date"
        type="button"
        :class="['filter-pill', activeDayIndex === index ? 'active' : '']"
        @click="selectedDayIndex = index"
      >
        {{ day.label }}
      </button>
    </div>

    <div class="panel">
      <span class="panel-decor panel-decor-tl" aria-hidden="true">
        <img src="/assets/icons/smokva.svg" alt="" />
      </span>
      <span class="panel-decor panel-decor-br" aria-hidden="true">
        <img src="/assets/icons/smokva.svg" alt="" />
      </span>

      <div v-if="days.length" class="day-columns">
        <section
          v-for="(day, index) in days"
          :key="day.date"
          :class="['day-column', activeDayIndex === index ? '' : 'hide-mobile']"
        >
          <h3 class="day-heading">{{ day.label }}</h3>

          <div v-if="day.doorTime" class="event-card doors-card">
            <span class="card-time">
              <span>{{ day.doorTime }}</span>
            </span>
            <span class="card-divider" aria-hidden="true" />
            <span class="card-name">{{ $t('schedule.gates') }}</span>
          </div>

          <button
            v-for="artist in day.artists"
            :key="artist._id"
            type="button"
            class="event-card"
            @click="openArtist(artist)"
          >
            <span class="card-time">
              <span>{{ formatTime(artist.timeline?.start) }}</span>
              <template v-if="formatTime(artist.timeline?.end)">
                <span class="card-time-dash">-</span>
                <span>{{ formatTime(artist.timeline?.end) }}</span>
              </template>
            </span>
            <span class="card-divider" aria-hidden="true" />
            <span class="card-name">{{ artist.name }}</span>
          </button>
        </section>
      </div>

      <p v-else class="panel-empty">{{ $t('schedule.noArtists') }}</p>
    </div>

    <ArtistDialog v-model:visible="showDialog" :artist="selectedArtist" />
  </div>
</template>

<style scoped>
.artist-schedule {
  --decor-size: clamp(5rem, 14vw, 9rem);
  --decor-hang: min(2rem, calc(var(--decor-size) * 0.22));
  --decor-gutter: calc(var(--decor-hang) + var(--decor-size) * 0.2);

  width: 100%;
  max-width: 75rem;
  margin: 0 auto;
  padding: 0 calc(1rem + var(--decor-gutter)) 3rem;
}

.filter-pills {
  display: none;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 0 1.5rem;
}

.filter-pill {
  font-family: 'Rokkitt', serif;
  font-weight: 700;
  font-size: var(--text-body);

  color: var(--knk-orange);
  background-color: white;
  border: 2.5px solid white;
  border-radius: 8px;
  padding: 0.2rem 0.75rem;

  cursor: pointer;
  text-transform: lowercase;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.filter-pill.active {
  background-color: var(--knk-orange);
  border-color: white;
  color: white;
}

.filter-pill:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.8);
}

.panel {
  position: relative;
  border: 5px solid white;
  border-radius: 3rem;
  padding: 2rem;
}

.panel-decor {
  position: absolute;
  width: var(--decor-size);
  aspect-ratio: 298 / 353;
  pointer-events: none;
  z-index: 0;
}

.panel-decor img {
  display: block;
  width: 100%;
  height: 100%;
}

.panel-decor-tl {
  top: calc(var(--decor-hang) * -1);
  left: calc(var(--decor-hang) * -1);
  transform: scaleX(-1) rotate(-40deg);
}

.panel-decor-br {
  bottom: calc(var(--decor-hang) * -1);
  right: calc(var(--decor-hang) * -1);
  transform: scaleX(-1);
}

.day-columns {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 1.25rem;
  align-items: start;
}

.day-column {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.25rem;
  min-width: 0;
}

.day-heading {
  margin: 0;
  font-family: 'Rokkitt', serif;
  font-weight: 700;
  font-size: var(--text-title);
  text-transform: lowercase;
  color: #fff;
  text-align: center;
}

.event-card {
  display: grid;
  grid-template-columns: auto 3px 1fr;
  align-items: stretch;
  gap: 0;
  width: 100%;

  border: 4px solid #fff;
  border-radius: 1.75rem;
  padding: 0;
  overflow: hidden;

  background: var(--knk-orange);
  color: #fff;

  cursor: pointer;
  font: inherit;
  text-align: left;
  transition: transform 0.15s ease;
}

.event-card:hover,
.event-card:focus-visible {
  transform: translateY(-2px);
}

.doors-card {
  cursor: default;
}

.doors-card:hover {
  transform: none;
}

.card-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;

  padding: 0.85rem 0.9rem;
  background: rgba(0, 0, 0, 0.12);

  font-family: 'Rokkitt', serif;
  font-weight: 700;
  font-size: var(--text-body);
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
}

.card-time-dash {
  line-height: 0.8;
}

.card-divider {
  background: #fff;
}

.card-name {
  display: flex;
  align-items: center;
  padding: 0.85rem 1.1rem;

  font-family: 'Rokkitt', serif;
  font-weight: 700;
  font-size: var(--text-title);
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.panel-empty {
  position: relative;
  z-index: 1;
  margin: 0;
  text-align: center;
  font-family: 'Rokkitt', serif;
  font-size: var(--text-title);
  color: var(--knk-blue);
}

@media (max-width: 900px) {
  .filter-pills {
    display: flex;
  }

  .panel {
    padding: 1.25rem;
    border-radius: 2rem;
  }

  .panel-decor {
    width: 5rem;
  }

  .day-columns {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .day-column.hide-mobile {
    display: none;
  }

  .day-heading {
    display: none;
  }
}
</style>
