<script setup lang="ts">
import { computed } from 'vue'
import { type Artist } from '~/types/Artist'

const okvirs = [
  '/assets/icons/okvir-1.svg',
  '/assets/icons/okvir-2.svg',
  '/assets/icons/okvir-3.svg',
]

const props = defineProps<{
  artist: Artist | null
  index?: number
}>()

const visible = defineModel<boolean>('visible', { required: true })

const { locale } = useI18n()
const { formatDayLabel } = useDayLabel()
const { $urlFor } = useNuxtApp()

const bio = computed(() => {
  const a = props.artist
  if (!a) return undefined
  const en = [a.bioEn, a.descriptionEn]
  const hr = [a.bio, a.description]
  const preferred = locale.value === 'en' ? [...en, ...hr] : [...hr, ...en]
  return preferred.find((d) => d && d.trim())
})

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('hr-HR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: FESTIVAL_TIME_ZONE,
  })

const dayAndTime = computed(() => {
  const t = props.artist?.timeline
  if (!t?.start) return ''

  const time = t.end
    ? `${formatTime(t.start)} - ${formatTime(t.end)}`
    : formatTime(t.start)

  return `${formatDayLabel(t.start)} · ${time}`
})
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="artist?.name"
    class="artist-dialog-schedule"
    :style="{ maxWidth: '30rem', backgroundColor: 'var(--knk-orange)' }"
  >
    <template #default>
      <div class="artist-dialog-image-wrapper">
        <img
          v-if="artist?.image"
          :src="$urlFor(artist.image).width(960).quality(80).auto('format').url()"
          :alt="artist.name"
          class="artist-dialog-image"
          loading="lazy"
          decoding="async"
        />
        <img
          v-if="index !== undefined"
          :src="okvirs[index % 3]"
          alt=""
          aria-hidden="true"
          class="dialog-okvir"
        />
      </div>

      <p v-if="dayAndTime" class="artist-dialog-datetime">
        {{ $t('schedule.dateAndTime') }}: {{ dayAndTime }}
      </p>

      <p v-if="bio">{{ bio }}</p>
      <p v-else>{{ $t('schedule.noInfo') }}</p>
    </template>
  </Dialog>
</template>

<style>
.artist-dialog-schedule .p-dialog-header {
  padding-top: 16rem;
  padding-bottom: 0rem;
  font-family: 'Rokkitt', serif;
}

.artist-dialog-schedule {
  position: relative;
  overflow: hidden;

  width: 95%;
  max-width: 30rem;
  height: fit-content;
  margin: auto;

  display: flex;
  flex-direction: column;
  gap: 0rem;

  border-radius: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.artist-dialog-schedule .p-dialog-content {
  font-family: 'Montserrat';
  color: #efe5dd;
}

.artist-dialog-schedule .p-dialog-content p {
  color: #efe5dd;
}

.artist-dialog-schedule .p-dialog-content p.artist-dialog-datetime {
  color: #fff;
}
</style>

<style scoped>
.artist-dialog-image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 15rem;
}

.artist-dialog-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.dialog-okvir {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  border-radius: 0;
}
</style>
