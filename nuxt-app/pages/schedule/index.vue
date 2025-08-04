<script setup>
import { ref } from 'vue'
import Header from '~/components/Header.vue'
import ArtistCard from '~/components/ArtistCard.vue'
import Footer from '~/components/Footer.vue'

// Update the path below if your store is located elsewhere
import { useScheduleStore } from '~/stores/schedule'

import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const scheduleStore = useScheduleStore()

const calendarOptions = ref({
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridThreeDay',
  initialDate: '2025-08-14',
  views: {
    timeGridThreeDay: {
      type: 'timeGrid',
      duration: { days: 3 },
      buttonText: '3 Day',
    },
  },
  color: 'white',
  height: '100%',
  contentHeight: 'auto',
  headerToolbar: false,
  allDaySlot: false,

  slotMinTime: '09:00:00',
  slotMaxTime: '24:00:00',

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

  eventDidMount: (info) => {
    const title = info.event.title.toLowerCase()

    if (title.includes('(vanjska)')) {
      info.el.style.width = '50%'
    }
  },

  dayHeaderContent: (arg) => {
    const dayMap = ['NED', 'PON', 'UTO', 'SRI', 'ČET', 'PET', 'SUB']
    const date = arg.date
    const dayName = dayMap[date.getDay()]
    return `${dayName} ${date.getDate()}.${date.getMonth() + 1}.`
  },

  headerToolbar: { left: '', center: '', right: '' },
  events: scheduleStore.events,
})

onMounted(async () => {
  await scheduleStore.fetchSchedule()
  calendarOptions.value.events = scheduleStore.events
})

const dates = ['2025-08-14', '2025-08-15', '2025-08-16']

console.log('Schedule events:', scheduleStore.events)
</script>

<template>
  <Header />

  <div class="schedule-wrapper">
    <div class="schedule-container" v-if="scheduleStore.events.length">
      <ClientOnly>
        <FullCalendar :options="calendarOptions" />
      </ClientOnly>
    </div>
  </div>

  <div class="prijelaz-container">
    <img src="/assets/prijelazi/prijelaz-more-dm.svg" alt="prijelaz-zid-plaza" style="background-color: #844d99" />
  </div>

  <Footer />
</template>

<style scoped>
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

.schedule-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.schedule-container {
  max-width: 50rem;
  width: 100%;
}

.schedule-wrapper {
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

.event-vanjska {
  width: 50% !important;
}
</style>
