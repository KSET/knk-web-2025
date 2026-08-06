<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWorkshopsStore } from '~/stores/workshops'
import { WORKSHOP_LOCATIONS } from '~/composables/useLocationLabel'
import type { Workshop } from '~/types/Workshop'

const { locale } = useI18n()
const { formatDayLabel } = useDayLabel()
const { locationLabel } = useLocationLabel()

const workshopsStore = useWorkshopsStore()
await workshopsStore.fetchWorkshops()

// Column order is fixed by the design, not by what the CMS happens to return.
const LOCATIONS = WORKSHOP_LOCATIONS

// Compared in festival time so "today" means the day on site, not the day in
// whichever zone the visitor happens to be browsing from.
const isSameDay = (a: Date, b: Date) =>
  festivalDateKey(a) === festivalDateKey(b)

// Prerender has no meaningful "today", and baking the build date into the HTML
// would make crawlers and first paint disagree with the client. Day 1 renders
// statically; the real day is picked after mount.
const selectedDayIndex = ref(0)

onMounted(() => {
  const today = new Date()
  const i = workshopsStore.days.findIndex((d) =>
    isSameDay(new Date(d.date), today),
  )
  if (i >= 0) selectedDayIndex.value = i
})

const activeDay = computed(() => workshopsStore.days[selectedDayIndex.value])

const legend = computed(() =>
  LOCATIONS.map((location) => ({ location, label: locationLabel(location) })),
)

const workshopName = (w: Workshop) =>
  locale.value === 'en' && w.nameEn ? w.nameEn : w.name

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

// An unrecognised CMS location gets its own trailing column rather than being
// folded into škola, where it would sit under the wrong heading with no colour.
const columnFor = (location: string) => {
  const i = LOCATIONS.indexOf(location as (typeof LOCATIONS)[number])
  return i >= 0 ? i + 1 : LOCATIONS.length + 1
}

const knownLocation = (location: string) =>
  LOCATIONS.includes(location as (typeof LOCATIONS)[number])

// Cards align horizontally by start time, so every distinct start in the day
// becomes one grid row and a location with nothing at that time leaves a gap.
const placedCards = computed(() => {
  // The store drops untimed workshops, but this guard keeps a blank start from
  // becoming a row key that sorts ahead of every real time.
  const items = (activeDay.value?.workshops ?? []).filter((w) =>
    formatTime(w.timeline?.start),
  )

  const rowKeys = [
    ...new Set(items.map((w) => formatTime(w.timeline?.start))),
  ].sort()

  const hasUnknown = items.some((w) => !knownLocation(w.location))
  const columnCount = LOCATIONS.length + (hasUnknown ? 1 : 0)

  const taken = new Set<string>()
  let extraRows = 0

  const cards = items.map((w) => {
    const start = formatTime(w.timeline?.start)
    const column = columnFor(w.location)
    let row = rowKeys.indexOf(start) + 1

    if (taken.has(`${row}:${column}`)) {
      row = rowKeys.length + 1
      while (taken.has(`${row}:${column}`)) row++
      extraRows = Math.max(extraRows, row - rowKeys.length)
    }
    taken.add(`${row}:${column}`)

    return {
      workshop: w,
      row,
      column,
      start,
      end: formatTime(w.timeline?.end),
    }
  })

  return { rowCount: rowKeys.length + extraRows, columnCount, cards }
})

const selectedWorkshop = ref<Workshop | null>(null)
const showDialog = ref(false)

const openWorkshop = (w: Workshop) => {
  selectedWorkshop.value = w
  showDialog.value = true
}

// Same sign-up link the workshops page shows in its popup.
const formLink = await useWorkshopFormLink()
</script>

<template>
  <div class="schedule">
    <div v-if="workshopsStore.days.length" class="filter-pills">
      <button
        v-for="(day, index) in workshopsStore.days"
        :key="day.date"
        type="button"
        :class="['filter-pill', selectedDayIndex === index ? 'active' : '']"
        @click="selectedDayIndex = index"
      >
        {{ formatDayLabel(day.date) }}
      </button>
    </div>

    <div class="panel">
      <ul class="legend">
        <li v-for="entry in legend" :key="entry.location" class="legend-item">
          <span :class="['legend-swatch', `loc-${entry.location}`]" />
          <span :class="['legend-label', `loc-${entry.location}`]">{{
            entry.label
          }}</span>
        </li>
      </ul>

      <div
        v-if="placedCards.cards.length"
        class="time-grid"
        :style="{
          '--rows': placedCards.rowCount,
          '--cols': placedCards.columnCount,
        }"
      >
        <button
          v-for="card in placedCards.cards"
          :key="card.workshop._id"
          type="button"
          :class="[
            'event-card',
            knownLocation(card.workshop.location)
              ? `loc-${card.workshop.location}`
              : 'loc-unknown',
          ]"
          :style="{ gridRow: card.row, gridColumn: card.column }"
          @click="openWorkshop(card.workshop)"
        >
          <span class="card-time">
            <span>{{ card.start }}</span>
            <span v-if="card.end" class="card-time-dash">-</span>
            <span v-if="card.end">{{ card.end }}</span>
          </span>
          <span class="card-divider" aria-hidden="true" />
          <span class="card-name">{{ workshopName(card.workshop) }}</span>
        </button>
      </div>

      <p v-else class="panel-empty">{{ $t('schedule.noWorkshops') }}</p>
    </div>

    <WorkshopDialog
      v-model:visible="showDialog"
      :workshop="selectedWorkshop"
      :form-link="formLink"
    />
  </div>
</template>

<style scoped>
.schedule {
  width: 100%;
  max-width: 75rem;
  margin: 0 auto;
  padding: 0 1rem 3rem;
}

/* Day picker, matching the pill filter used on /lineup and /workshops. */
.filter-pills {
  display: flex;
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
  border: 5px solid white;
  border-radius: 3rem;
  padding: 2rem;
}

.legend {
  list-style: none;
  margin: 0 0 2rem;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-swatch {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 5px;
  border: 2px solid #fff;
  flex-shrink: 0;
}

.legend-label {
  font-family: 'Rokkitt', serif;
  font-weight: 700;
  font-size: var(--text-body);
  text-transform: lowercase;
}

/* Rows are start times, columns are locations, so an empty slot stays empty. */
.time-grid {
  display: grid;
  grid-template-columns: repeat(var(--cols, 3), 1fr);
  grid-template-rows: repeat(var(--rows, 1), auto);
  gap: 1.25rem;
  align-items: start;
}

.event-card {
  display: grid;
  grid-template-columns: auto 3px 1fr;
  align-items: stretch;
  gap: 0;

  border: 4px solid #fff;
  border-radius: 1.75rem;
  padding: 0;
  overflow: hidden;

  cursor: pointer;
  font: inherit;
  text-align: left;
  transition: transform 0.15s ease;
}

.event-card:hover,
.event-card:focus-visible {
  transform: translateY(-2px);
}

.card-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;

  padding: 0.85rem 0.9rem;
  /* Slightly darker than the name half, as in the design. */
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

/*
 * Same location -> colour mapping the CMS uses for each workshop's popupColor,
 * so a card matches the popup it opens. Ink is picked per fill for legibility.
 */
.loc-škola {
  --card-bg: var(--knk-blue);
  --card-ink: #f9f9f9;
}

.loc-vanjska {
  --card-bg: var(--knk-orange);
  --card-ink: #fff;
}

.loc-kamp {
  --card-bg: var(--knk-lightblue);
  --card-ink: var(--black);
}

/* Fallback for a location the CMS added but the design has no colour for. */
.loc-unknown {
  --card-bg: var(--knk-blue);
  --card-ink: #f9f9f9;
}

.event-card.loc-škola,
.event-card.loc-kamp,
.event-card.loc-vanjska,
.event-card.loc-unknown {
  background: var(--card-bg);
  color: var(--card-ink);
}

.legend-swatch.loc-škola,
.legend-swatch.loc-kamp,
.legend-swatch.loc-vanjska {
  background: var(--card-bg);
}

.legend-label {
  color: #fff;
}

.panel-empty {
  margin: 0;
  text-align: center;
  font-family: 'Rokkitt', serif;
  font-size: var(--text-title);
  color: var(--knk-blue);
}

@media (max-width: 900px) {
  .panel {
    padding: 1.25rem;
    border-radius: 2rem;
  }

  /*
   * The time axis cannot survive three columns on a phone, so cards fall back
   * to a single full-width chronological stack.
   */
  .time-grid {
    display: flex;
    flex-direction: column;
  }

  .event-card {
    grid-column: auto !important;
    grid-row: auto !important;
    width: 100%;
  }
}
</style>
