<script setup lang="ts">
import { type Workshop } from '~/types/Workshop'

const props = defineProps<{
  workshop: Workshop
  reverse?: boolean
}>()

import { ref } from 'vue'
import type { Translation } from '~/types/Translation'

const showDialog = ref(false)

const toggleShowDialog = (): void => {
  showDialog.value = !showDialog.value
}

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

const formLink = computed(() => getPlainTextLink(workshopsFormLink))
</script>

<template>
  <div :class="['workshop-card', reverse ? 'reverse' : '']">
    <img
      v-if="workshop.imageSmall"
      :src="$urlFor(workshop.imageSmall).width(1200).url()"
      alt="workshop image"
      class="workshop-image desktop"
      @click="toggleShowDialog"
    />
    <img
      v-if="workshop.imageLarge"
      :src="$urlFor(workshop.imageLarge).width(1200).url()"
      alt="workshop image"
      class="workshop-image mobile"
      @click="toggleShowDialog"
    />
    <div :class="['workshop-info', !reverse ? 'reverse' : '']">
      <p class="workshop-name">{{ workshop.name }}</p>
      <p class="workshop-description">{{ workshop.descriptionShort }}</p>

      <div class="workshop-button" @click="toggleShowDialog">
        Saznaj više
        <img
          src="/assets/icons/arrow-right.svg"
          alt="arrow-right"
          class="arrow-icon"
        />
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="showDialog"
    modal
    :header="workshop.name"
    class="workshop-dialog"
    style="max-width: 30rem"
  >
    <template #default>
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
      <p v-if="workshop.datetime" style="opacity: 0.7">
        Datum i vrijeme: {{ formatDate(workshop.datetime?.toString()) }}
      </p>
      <p
        v-if="workshop.location"
        style="opacity: 0.7; text-transform: capitalize"
      >
        Lokacija: {{ workshop.location }}
      </p>

      <p v-if="workshop.descriptionLong">{{ workshop.descriptionLong }}</p>
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
        Prijavi se
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
  padding-top: 12rem;
  padding-bottom: 0rem;
}

.workshop-dialog {
  width: 95%;
  max-width: 30rem;
  height: fit-content;
  margin: auto;

  display: flex;
  flex-direction: column;
  gap: 0rem;

  background-color: rgba(212, 101, 88, 0.7);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
}
</style>

<style scoped>
a {
  text-decoration: none;
  background-color: transparent;
}

.desktop {
  display: block;
}

.mobile {
  display: none;
}

.workshop-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 95%;
  height: 100%;
  margin: 1rem auto;

  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
}

.workshop-card.reverse {
  flex-direction: column-reverse;
}

.workshop-image {
  object-fit: cover;
  border-radius: 12px;
  max-width: 100%;
}

.workshop-info {
  padding: 2% 3%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-content: stretch;
  align-items: flex-start;

  gap: 0.5rem;
  height: 100%;
  width: 100%;
}

.workshop-info.reverse {
  text-align: right;
  align-items: flex-end;
}

.workshop-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.workshop-description {
  font-size: 1rem;
  color: lightgray;
  margin: 0;
}

.workshop-button {
  font-family: 'Montserrat';
  background-color: #f5c26b;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  width: fit-content;

  display: flex;
  align-items: center;
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
}

.workshop-dialog-image {
  max-height: 12rem;
  width: 100%;
  object-fit: cover;
  max-width: 100%;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  border-radius: 12px;
}

.title-button {
  font-family: 'Montserrat';
  /* background-color: #dd7d91; */
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
  .desktop {
    display: none;
  }

  .mobile {
    display: block;
  }

  .workshop-card,
  .workshop-card.reverse {
    display: flex;
    flex-direction: column;
    height: 20rem;
    height: fit-content;
  }

  .workshop-image {
    width: 100%;
    object-fit: cover;
    max-width: 100%;
  }

  .workshop-info.reverse,
  .workshop-info {
    text-align: left;
    align-items: flex-start;

    height: fit-content;
    padding: 2% 2%;
  }

  .workshop-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
  }

  .workshop-description {
    font-size: 0.8rem;
  }

  .workshop-button {
    font-size: 0.8rem;

    padding: 0.5rem 1rem;
    border-radius: 8px;

    align-self: end;
  }
}
</style>
