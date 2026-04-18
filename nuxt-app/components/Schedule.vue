<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref, watch, onMounted } from 'vue'
import { useScheduleStore } from '~/stores/schedule'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const { t } = useI18n()
const localePath = useLocalePath()
const scheduleStore = useScheduleStore()
const dates = ['2025-08-14', '2025-08-15', '2025-08-16']

const getTodayString = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

const getInitialTab = () => {
  const today = getTodayString()
  const index = dates.indexOf(today)
  return index >= 0 ? index.toString() : '0'
}

const vrataEvents = dates.map((d) => ({
  title: t('schedule.gates'),
  start: `${d}T20:00:00`,
  end: `${d}T21:00:00`,
  backgroundColor: '#D46558',
  borderColor: '#D46558',
  textColor: '#fff',
  classNames: ['event-vrata'],
}))

const selectedTab = ref(getInitialTab())
const calendarRef = ref(null)
const artistSelectedTab = ref(getInitialTab())
const artistCalendarRef = ref(null)

const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

const dayHeaderContent = (arg) => {
  const d = arg.date
  const dayLabel = t(`days.${dayKeys[d.getDay()]}`)
  return `${dayLabel} ${d.getDate()}.${d.getMonth() + 1}.`
}

const goWorkshops = (info) => {
  info.jsEvent.preventDefault()
  const path = localePath('/workshops')
  if (info.jsEvent.metaKey || info.jsEvent.ctrlKey) window.open(path, '_blank')
  else router.push(path)
}

const goLineup = (info) => {
  info.jsEvent.preventDefault()
  const path = localePath('/lineup')
  if (info.jsEvent.metaKey || info.jsEvent.ctrlKey) window.open(path, '_blank')
  else router.push(path)
}

const workshopCalendarOptions = ref({
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridDay',
  initialDate: dates[parseInt(getInitialTab())],
  height: '100%',
  contentHeight: 'auto',
  headerToolbar: false,
  allDaySlot: false,
  slotMinTime: '09:00:00',
  slotMaxTime: '26:00:00',
  eventClick: goWorkshops,
  slotLabelFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  eventTextColor: '#000',
  eventDidMount: (info) => {
    const title = info.event.title?.toLowerCase?.() ?? ''
    if (title.includes('(vanjska)')) info.el.style.width = '50%'
  },
  dayHeaderContent,
  events: [],
})

const artistCalendarOptions = ref({
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridDay',
  initialDate: dates[parseInt(getInitialTab())],
  height: 500,
  expandRows: true,
  headerToolbar: false,
  allDaySlot: false,
  slotMinTime: '20:00:00',
  slotMaxTime: '23:40:00',
  eventClick: goLineup,
  displayEventEnd: false,
  slotLabelFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  eventTextColor: '#000',
  dayHeaderContent,
  events: [],
})

onMounted(async () => {
  await scheduleStore.fetchAll()
  workshopCalendarOptions.value.events = scheduleStore.eventsWorkshops
  artistCalendarOptions.value.events = [
    ...scheduleStore.eventsArtists,
    ...vrataEvents,
  ]
})

watch(selectedTab, (val) => {
  const idx = Number(val)
  const api = calendarRef.value?.getApi?.()
  if (api && dates[idx]) api.gotoDate(dates[idx])
})

watch(artistSelectedTab, (val) => {
  const idx = Number(val)
  const api = artistCalendarRef.value?.getApi?.()
  if (api && dates[idx]) api.gotoDate(dates[idx])
})

const formatShowDate = (iso) =>
  new Date(iso).toLocaleDateString('hr-HR', {
    day: '2-digit',
    month: '2-digit',
  })
</script>

<template>
  <div class="schedule-container">
    <h1 style="color: white">{{ $t('schedule.title') }}</h1>
    <Tabs v-model:value="selectedTab">
      <TabList style="flex-wrap: wrap">
        <Tab value="0" class="artist-tab"
          >{{ $t('schedule.day') }} 1 – {{ formatShowDate(dates[0]) }}</Tab
        >
        <Tab value="1" class="artist-tab"
          >{{ $t('schedule.day') }} 2 – {{ formatShowDate(dates[1]) }}</Tab
        >
        <Tab value="2" class="artist-tab"
          >{{ $t('schedule.day') }} 3 – {{ formatShowDate(dates[2]) }}</Tab
        >
      </TabList>
    </Tabs>
  </div>

  <div class="schedule-container" v-if="scheduleStore.eventsWorkshops.length">
    <div class="legend">
      <p style="margin: 0">{{ $t('schedule.legend') }}</p>
      <p class="legend-item" style="background-color: #f3bb64">{{ $t('schedule.school') }}</p>
      <p class="legend-item" style="background-color: #a565bd">{{ $t('schedule.outdoor') }}</p>
      <p class="legend-item" style="background-color: #76c6d2">{{ $t('schedule.camp') }}</p>
    </div>
    <ClientOnly>
      <FullCalendar ref="calendarRef" :options="workshopCalendarOptions" />
    </ClientOnly>
    <p style="margin: 0.5rem 1rem">
      {{ $t('schedule.campNote') }}
    </p>
  </div>

  <div class="schedule-container" style="margin-top: 3rem">
    <h1 style="color: white">{{ $t('schedule.program') }}</h1>
    <Tabs v-model:value="artistSelectedTab">
      <TabList style="flex-wrap: wrap">
        <Tab value="0" class="artist-tab"
          >{{ $t('schedule.day') }} 1 – {{ formatShowDate(dates[0]) }}</Tab
        >
        <Tab value="1" class="artist-tab"
          >{{ $t('schedule.day') }} 2 – {{ formatShowDate(dates[1]) }}</Tab
        >
        <Tab value="2" class="artist-tab"
          >{{ $t('schedule.day') }} 3 – {{ formatShowDate(dates[2]) }}</Tab
        >
      </TabList>
    </Tabs>
  </div>

  <div
    class="schedule-container artists-calendar"
    v-if="scheduleStore.eventsArtists.length"
  >
    <ClientOnly>
      <FullCalendar ref="artistCalendarRef" :options="artistCalendarOptions" />
    </ClientOnly>
  </div>
</template>

<style scoped>
.artists-calendar :deep(.fc) {
  font-size: 18px;
  --fc-small-font-size: 1rem;
}

.legend {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.legend-item {
  padding: 0.25rem 1rem;
  border-radius: 4px;
  margin: 0;
  color: black;
}

:deep(.fc) {
  color: #fff !important;
  opacity: 1 !important;
}

:deep(.fc .fc-timegrid-slot-label) {
  padding-left: 0 !important;
  padding-right: 0 !important;
  text-align: right;
  width: 4.5em !important;
  font-variant-numeric: tabular-nums;
}

:deep(.fc-event-title),
:deep(.fc-col-header-cell-cushion),
:deep(.fc-timegrid-slot-label),
:deep(.fc-timegrid-event) {
  opacity: 1 !important;
  color: #fff !important;
}

.artist-tab {
  border-radius: 12px;
  padding: 0.25rem 1rem;
  height: fit-content;
  margin: 0.25rem;
}

.schedule-container {
  max-width: 50rem;
  width: 100%;
  padding: 0 1rem;
}

.event-vanjska {
  width: 50% !important;
}
</style>
