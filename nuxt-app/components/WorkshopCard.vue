<script setup lang="ts">
import { type Workshop } from '~/types/Workshop'

const props = defineProps<{
  workshop: Workshop
  index?: number
  formLink?: string
  priority?: boolean
}>()

import { ref } from 'vue'

const { locale } = useI18n()

const okvirDefault = '/assets/workshops/okvir.svg'
const okvir = computed(() => props.workshop.okvirUrl ?? okvirDefault)

const popupColor = computed(() => props.workshop.popupColor ?? 'var(--knk-orange)')

const showDialog = ref(false)

const toggleShowDialog = (): void => {
  showDialog.value = !showDialog.value
}

const name = computed(() =>
  locale.value === 'en' && props.workshop.nameEn ? props.workshop.nameEn : props.workshop.name,
)

const { $urlFor } = useNuxtApp()

const cardWidths = [300, 450, 600, 900]

const cardSrc = computed(() =>
  $urlFor(props.workshop.imageSmall).width(600).quality(75).auto('format').url(),
)

const cardSrcset = computed(() =>
  cardWidths
    .map(
      (w) =>
        `${$urlFor(props.workshop.imageSmall).width(w).quality(75).auto('format').url()} ${w}w`,
    )
    .join(', '),
)

const description = computed(() => {
  const w = props.workshop
  const en = [w.descriptionLongEn, w.descriptionShortEn]
  const hr = [w.descriptionLong, w.descriptionShort]
  const preferred = locale.value === 'en' ? [...en, ...hr] : [...hr, ...en]
  return preferred.find((d) => d && d.trim())
})

function formatFullTimeline(start?: string | Date, end?: string | Date) {
  if (!start) return '-'

  const startDate = new Date(start)
  const endDate = end ? new Date(end) : null

  const rawDate = startDate.toLocaleDateString('hr-HR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const cleanDate = rawDate.replace(/\s/g, '')

  const startTime =
    startDate.toLocaleTimeString('hr-HR', {
      hour: '2-digit',
      minute: '2-digit',
    }) + 'h'

  const endTime = endDate
    ? endDate.toLocaleTimeString('hr-HR', {
        hour: '2-digit',
        minute: '2-digit',
      }) + 'h'
    : '?'

  return `${cleanDate} ${startTime} - ${endTime}`
}
</script>

<template>
  <div class="workshop-card" @click="toggleShowDialog">
    <div class="workshop-image-wrap">
      <img
        v-if="workshop.imageSmall"
        :src="cardSrc"
        :srcset="cardSrcset"
        sizes="(max-width: 570px) 100vw, (max-width: 1000px) 45vw, (max-width: 1400px) 30vw, 23vw"
        :alt="name"
        class="workshop-image"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        decoding="async"
      />
    </div>
    <img
      :src="okvir"
      alt=""
      aria-hidden="true"
      class="okvir-frame"
      decoding="async"
    />

    <p class="workshop-name">{{ name }}</p>

    <div class="workshop-action">
      {{ $t('common.learnMore') }}
      <img
        src="/assets/icons/arrow-right.svg"
        alt="arrow-right"
        class="arrow-icon"
      />
    </div>
  </div>

  <Dialog
    v-model:visible="showDialog"
    modal
    :header="name"
    class="workshop-dialog"
    :style="{ maxWidth: '30rem', backgroundColor: popupColor }"
  >
    <template #default>
      <div class="workshop-dialog-image-wrapper">
        <img
          v-if="workshop.imageLarge"
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
      <p v-if="workshop.timeline?.start" style="opacity: 0.7">
        Datum i vrijeme:
        {{ formatFullTimeline(workshop.timeline.start, workshop.timeline.end) }}
      </p>

      <p
        v-if="workshop.location"
        style="opacity: 0.7; text-transform: capitalize"
      >
        Lokacija: {{ workshop.location }}
      </p>

      <p v-if="description">{{ description }}</p>
      <p v-else>Nema dodatnih informacija.</p>
    </template>
    <template #footer>
      <a
        v-if="props.formLink"
        :href="props.formLink"
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
  font-family: 'Rockwell', serif;
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

.workshop-card {
  position: relative;
  width: 100%;
  aspect-ratio: 484.1 / 690.96;
  cursor: pointer;
  overflow: hidden;
  border-radius: 11.5% / 8.1%;
}

.workshop-image-wrap {
  position: absolute;
  inset: 0;
  padding-block: 14%;
}

.workshop-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.okvir-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
}

.workshop-name {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 17%;
  padding: 0 1.1rem;

  display: flex;
  align-items: center;

  font-family: 'Rockwell', serif;
  font-size: var(--text-title);
  font-weight: bold;
  color: #efe5dd;
  margin: 0;
  line-height: 1.05;
  text-align: left;
}

.workshop-action {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 17%;
  padding: 0 1.1rem;

  font-family: 'Rockwell', serif;
  font-weight: bold;
  font-size: var(--text-body);
  color: #efe5dd;
  text-align: left;

  display: flex;
  align-items: center;
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
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

</style>
