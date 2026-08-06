<script setup lang="ts">
import { computed } from 'vue'
import { type Workshop } from '~/types/Workshop'

const props = defineProps<{
  workshop: Workshop | null
  formLink?: string
}>()

const visible = defineModel<boolean>('visible', { required: true })

const { locale, t } = useI18n()
const { locationLabel } = useLocationLabel()
const { formatDayLabel } = useDayLabel()
const { $urlFor } = useNuxtApp()

const name = computed(() =>
  props.workshop
    ? locale.value === 'en' && props.workshop.nameEn
      ? props.workshop.nameEn
      : props.workshop.name
    : '',
)

const popupColor = computed(
  () => props.workshop?.popupColor ?? 'var(--knk-orange)',
)

const description = computed(() => {
  const w = props.workshop
  if (!w) return undefined
  const en = [w.descriptionLongEn, w.descriptionShortEn]
  const hr = [w.descriptionLong, w.descriptionShort]
  const preferred = locale.value === 'en' ? [...en, ...hr] : [...hr, ...en]
  return preferred.find((d) => d && d.trim())
})

// Pinned to festival time so the dialog agrees with the card that opened it,
// and so the prerendered text survives hydration outside the build zone.
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('hr-HR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: FESTIVAL_TIME_ZONE,
  })

// e.g. "PET 14.8. · 11:00 - 13:00"
const dayAndTime = computed(() => {
  const tl = props.workshop?.timeline
  if (!tl?.start) return ''

  const day = formatDayLabel(tl.start)
  const date = new Date(tl.start).toLocaleDateString('hr-HR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: FESTIVAL_TIME_ZONE,
  })
  const time = tl.end
    ? `${formatTime(tl.start)} - ${formatTime(tl.end)}`
    : formatTime(tl.start)

  return `${day} ${date.replace(/\s/g, '')} · ${time}`
})
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="name"
    class="workshop-dialog"
    :style="{ maxWidth: '30rem', backgroundColor: popupColor }"
  >
    <template #default>
      <div class="workshop-dialog-image-wrapper">
        <img
          v-if="workshop?.imageLarge"
          :src="
            $urlFor(workshop.imageLarge)
              .width(960)
              .quality(80)
              .auto('format')
              .url()
          "
          :alt="name"
          class="workshop-dialog-image"
          loading="lazy"
          decoding="async"
        />
      </div>

      <p v-if="dayAndTime" style="opacity: 0.7">
        {{ $t('schedule.dateAndTime') }}: {{ dayAndTime }}
      </p>

      <p v-if="workshop?.location" style="opacity: 0.7">
        {{ $t('schedule.location') }}: {{ locationLabel(workshop.location) }}
      </p>

      <p v-if="description">{{ description }}</p>
      <p v-else>{{ $t('schedule.noInfo') }}</p>
    </template>

    <template #footer>
      <a
        v-if="formLink"
        :href="formLink"
        target="_blank"
        rel="noopener noreferrer"
        class="title-button"
      >
        {{ $t('common.signUp') }}
        <img
          src="/assets/icons/arrow-right.svg"
          alt="arrow-right"
          class="arrow-icon"
        />
      </a>
    </template>
  </Dialog>
</template>

<!-- PrimeVue internals can only be reached from an unscoped block. -->
<style>
.p-dialog-close-button,
.p-dialog {
  color: white !important;
}

.p-dialog-close-button:not(:disabled):hover {
  color: black !important;
}

.workshop-dialog .p-dialog-header {
  padding-top: 16rem;
  padding-bottom: 0rem;
  font-family: 'Rokkitt', serif;
}

.workshop-dialog {
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

.workshop-dialog .p-dialog-content {
  font-family: 'Montserrat';
  color: #efe5dd;
}

.workshop-dialog .p-dialog-content p {
  color: #efe5dd;
}
</style>

<style scoped>
a {
  text-decoration: none;
  background-color: transparent;
}

.workshop-dialog-image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 15rem;
}

.workshop-dialog-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.title-button {
  font-family: 'Montserrat';
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
}

.title-button:hover {
  border-bottom: 1px solid white;
}

.arrow-icon {
  height: 1rem;
  margin-left: 0.5rem;
}
</style>
