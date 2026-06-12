<script setup lang="ts">
import { type Workshop } from '~/types/Workshop'

const props = defineProps<{
  workshop: Workshop
  index?: number
}>()

import { ref } from 'vue'
import type { Translation } from '~/types/Translation'

const { locale } = useI18n()

// Top and bottom scallop strips cycle independently by card index (1..4).
const okvirTops = [
  '/assets/workshops/okvir-top1.svg',
  '/assets/workshops/okvir-top2.svg',
  '/assets/workshops/okvir-top3.svg',
  '/assets/workshops/okvir-top4.svg',
]
const okvirBottoms = [
  '/assets/workshops/okvir-bottom1.svg',
  '/assets/workshops/okvir-bottom2.svg',
  '/assets/workshops/okvir-bottom3.svg',
  '/assets/workshops/okvir-bottom4.svg',
]
const okvirTop = computed(() => okvirTops[(props.index ?? 0) % okvirTops.length])
const okvirBottom = computed(() => okvirBottoms[(props.index ?? 0) % okvirBottoms.length])

const showDialog = ref(false)

const toggleShowDialog = (): void => {
  showDialog.value = !showDialog.value
}

const name = computed(() =>
  locale.value === 'en' && props.workshop.nameEn ? props.workshop.nameEn : props.workshop.name,
)

// The grid card no longer shows a description, so the modal shows whichever
// description is populated. Prefer the current locale (long, then short),
// then fall back to the other locale so something always shows if it exists.
const description = computed(() => {
  const w = props.workshop
  const en = [w.descriptionLongEn, w.descriptionShortEn]
  const hr = [w.descriptionLong, w.descriptionShort]
  const preferred = locale.value === 'en' ? [...en, ...hr] : [...hr, ...en]
  return preferred.find((d) => d && d.trim())
})

const query2 = groq`*[ _type == "translation"]`
const { data: translationsRaw } = await useSanityQuery<Translation[]>(query2)

const translations = Object.fromEntries(
  translationsRaw.value?.map((entry) => [entry.key, entry.text]) || [],
)

const workshopsFormLink = translations['workshopsFormLink']
const getPlainTextLink = (blocks: any[]): string | undefined => {
  if (!Array.isArray(blocks)) return undefined

  const firstBlock = blocks[0]
  const firstSpan = firstBlock?.children?.[0]

  const text = firstSpan?.text || ''
  const isLink = text.startsWith('http://') || text.startsWith('https://')

  return isLink ? text : undefined
}

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

const formLink = computed(() => getPlainTextLink(workshopsFormLink))
</script>

<template>
  <div class="workshop-card" @click="toggleShowDialog">
    <img
      v-if="workshop.imageSmall"
      :src="$urlFor(workshop.imageSmall).width(800).url()"
      alt="workshop image"
      class="workshop-image"
    />
    <img :src="okvirTop" alt="" class="okvir-strip okvir-strip-top" />
    <img :src="okvirBottom" alt="" class="okvir-strip okvir-strip-bottom" />

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
    style="max-width: 30rem"
  >
    <template #default>
      <div class="workshop-dialog-image-wrapper">
        <img
          v-if="workshop.imageLarge"
          :src="
            $urlFor(workshop.imageLarge)
              .width(1200)
              .quality(100)
              .auto('format')
              .url()
          "
          alt="workshop image"
          class="workshop-dialog-image"
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
        v-if="workshopsFormLink"
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

<style>
.p-dialog-close-button,
.p-dialog {
  color: white !important;
}

.p-dialog-close-button:not(:disabled):hover {
  color: black !important;
}

.workshop-dialog .p-dialog-header {
  /* clears the absolutely-positioned image wrapper below (keep in sync with
     .workshop-dialog-image-wrapper height) */
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

  background-color: var(--knk-orange);
  border-radius: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* align the dialog body paragraphs with the page typography
   (page body font is Montserrat, paragraph color #efe5dd) */
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
  /* match okvir.svg native ratio (484.1 / 690.96) so the scalloped
     frame edges line up with the image edges */
  aspect-ratio: 484.1 / 690.96;
  cursor: pointer;
  overflow: hidden;
  /* The strip SVGs round corners with a 51.4px arc over a 484.1-wide viewBox
     = 10.62% of width (≈ 7.44% of height given the fixed aspect-ratio). Clip
     the card a hair tighter than the strip so the square image can never peek
     out past the strip's rounded corner. */
  border-radius: 11.5% / 8.1%;
}

.workshop-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* top/bottom scallop strips overlay the image at its top and bottom edges,
   rendered at their natural width:height ratio (no stretch) */
.okvir-strip {
  position: absolute;
  left: 0;
  width: 100%;
  height: auto;
  pointer-events: none;
}

.okvir-strip-top {
  top: 0;
}

.okvir-strip-bottom {
  bottom: 0;
}

/* title sits over the okvir's top orange band — center it in the band's
   solid flat region (≈ top 17% of the frame, before the wave dips) */
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
  font-size: 1.6rem;
  font-weight: bold;
  color: #efe5dd;
  margin: 0;
  line-height: 1.05;
  text-align: left;
}

/* action sits over the okvir's bottom orange band — center it in the band's
   solid flat region (≈ bottom 17% of the frame, below the wave) */
.workshop-action {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 17%;
  padding: 0 1.1rem;

  font-family: 'Rockwell', serif;
  font-weight: bold;
  font-size: 1.4rem;
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
  /* keep the dialog header's padding-top in sync with this height */
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

@media (max-width: 900px) {
  .workshop-name {
    font-size: 1.2rem;
  }

  .workshop-action {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .workshop-name {
    font-size: 1.1rem;
  }
}
</style>
