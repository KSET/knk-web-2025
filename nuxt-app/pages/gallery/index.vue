<script setup lang="ts">
import { ref } from 'vue'

const visibleRight = ref(false)
import Footer from '~/components/Footer.vue'
import { type GallerySection } from '~/types/GallerySection'

const query = groq`*[_type == "gallerySection"] | order(_createdAt desc)`
const { data: gallerySections } = await useSanityQuery<GallerySection[]>(query)

type GalleryInstance = {
  id: string
  year: number
  type: string
  images: {
    itemImageSrc: string
    thumbnailImageSrc: string
    author: string
    alt: string
  }[]
  activeIndex: Ref<number>
  displayCustom: Ref<boolean>
}

const galleries: GalleryInstance[] = []

gallerySections.value?.forEach((section) => {
  const images = (section.images ?? []).map((img, index) => ({
    itemImageSrc: urlFor(img).width(1200).url(),
    thumbnailImageSrc: urlFor(img).width(1200).url(),
    author: img.author ?? '',
    alt: img.author || `Image ${index + 1}`,
  }))

  galleries.push({
    id: section._id,
    year: Number(section.year),
    type: section.type,
    images,
    activeIndex: ref(0),
    displayCustom: ref(false),
  })
})

const availableYears = computed(() =>
  [...new Set(galleries.map((g) => g.year))].sort((a, b) => b - a),
)

const selectedYear = ref(availableYears.value[0] ?? new Date().getFullYear())

const typeOrder: Record<string, number> = { Koncerti: 0, Radionice: 1, Kamp: 2 }
galleries.sort((a, b) => (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99))

const filteredGalleries = computed(() =>
  galleries.filter((g) => g.year === selectedYear.value),
)

const { t } = useI18n()

useSeoMeta({
  title: () => t('meta.pages.gallery.title'),
  description: () => t('meta.pages.gallery.description'),
  ogTitle: () => `${t('meta.pages.gallery.title')} | KSET na Krku`,
  ogDescription: () => t('meta.pages.gallery.description'),
})
const galleryTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    Koncerti: t('gallery.concerts'),
    Radionice: t('gallery.workshops'),
    Kamp: t('gallery.camp'),
  }
  return map[type] || type
}
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee
    backgroundColor="var(--knk-orange)"
    textShadowColor="var(--knk-blue)"
  />

  <div class="page-header">
    <p class="page-title">{{ $t('gallery.title') }}</p>
    <div class="header-right">
      <LanguageSwitcher />
      <img
        src="/assets/icons/burger.svg?v=2"
        alt="burger"
        @click="visibleRight = !visibleRight"
        class="burger-icon"
      />
    </div>
  </div>

  <div class="gallery-wrapper">
    <div class="year-picker">
      <button
        v-for="year in availableYears"
        :key="year"
        class="year-button"
        :class="{ active: selectedYear === year }"
        @click="selectedYear = year"
      >
        {{ year }}
      </button>
    </div>

    <div class="gallery-container">
      <div
        v-for="group in filteredGalleries"
        :key="group.id"
        class="gallery-section"
      >
        <h3 class="gallery-title">{{ galleryTypeLabel(group.type) }}</h3>

        <Galleria
          v-model:activeIndex="group.activeIndex.value"
          v-model:visible="group.displayCustom.value"
          :value="group.images"
          containerStyle="max-width: 850px"
          :circular="true"
          :fullScreen="true"
          :showItemNavigators="true"
          :showThumbnails="false"
        >
          <template #item="slotProps">
            <div class="image-wrapper">
              <figure class="image-figure">
                <img
                  :src="slotProps.item.itemImageSrc"
                  :alt="slotProps.item.alt"
                  class="galleria-image"
                />
                <figcaption
                  v-if="slotProps.item.author"
                  class="galleria-caption"
                >
                  {{ slotProps.item.author }} //
                  {{ $t('gallery.photoSection') }}
                </figcaption>
              </figure>
            </div>
          </template>
          <template #thumbnail="slotProps">
            <img
              :src="slotProps.item.thumbnailImageSrc"
              :alt="slotProps.item.alt"
              style="display: block"
            />
          </template>
        </Galleria>

        <div class="gallery-thumbnails">
          <div
            v-for="(img, index) in group.images"
            :key="index"
            class="thumbnail"
            :class="{ active: group.activeIndex.value === index }"
            @click="
              () => {
                group.activeIndex.value = index
                group.displayCustom.value = true
              }
            "
          >
            <img :src="img.thumbnailImageSrc" :alt="img.alt" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer backgroundColor="var(--knk-lightblue)" />
  <Marquee
    backgroundColor="var(--knk-orange)"
    textShadowColor="var(--knk-blue)"
  />
  <NavDrawer v-model="visibleRight" />
</template>

<style>
.p-galleria {
  border: none !important;
}
.image-wrapper {
  width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
}

.image-figure {
  margin: 0;
  min-height: 0;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: fit-content;
}

.galleria-caption {
  flex-shrink: 0;
  margin-top: 0.5rem;
  text-align: right;
  font-family: 'Rokkitt', serif;
  font-size: var(--text-body);
  color: #efe5dd;
}

.galleria-image {
  max-width: 100%;
  max-height: calc(90vh - 2rem);
  min-height: 0;
  width: auto;
  height: auto;
  border-radius: 8px;
}
</style>

<style scoped>
.gallery-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.gallery-container {
  width: 90%;
  margin: 0 auto;
  padding: 1rem 0;
}

.gallery-wrapper {
  background-color: var(--knk-lightblue);
  height: fit-content;
  width: 100%;

  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;

  padding-top: 2rem;
}

.year-picker {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0 1rem;
}

.year-button {
  font-family: 'Rokkitt', serif;
  font-size: var(--text-title);
  font-weight: 700;
  padding: 0.5rem 1.75rem;
  border: 3px solid #efe5dd;
  border-radius: 10px;
  background: transparent;
  color: #efe5dd;
  cursor: pointer;
  transition: all 0.2s ease;
}

.year-button.active {
  background-color: var(--knk-orange);
  border-color: #efe5dd;
  color: #efe5dd;
}

.gallery-title {
  font-family: 'Rokkitt', serif;
  font-size: var(--text-subheading);
  font-weight: 600;
  color: #efe5dd;
  text-shadow: 2px 3px 0 var(--knk-orange);
  margin: 1rem 0;
}

.gallery-thumbnails {
  column-count: 2;
  column-gap: 16px;
}

@media (min-width: 1600px) {
  .gallery-thumbnails {
    column-count: 3;
  }
}

.thumbnail {
  break-inside: avoid;
  margin-bottom: 16px;
}

.thumbnail img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}

.page-header {
  background-color: var(--knk-lightblue);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  position: relative;
  padding: 1.5rem 1rem;
  margin: 0;
}

.page-title {
  font-family: 'Rokkitt', serif;
  font-size: var(--text-display);
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

@media (max-width: 480px) {
  .gallery-thumbnails {
    column-count: 1;
  }

  .page-title {
    text-shadow: 2px 3px 0 var(--knk-orange);
    text-align: left;
  }

  .year-button {
    padding: 0.4rem 1.2rem;
  }

  .burger-icon {
    width: 1.8rem;
  }

  .page-header {
    padding: 1rem;
  }

  .gallery-container {
    width: calc(100% - 2rem);
  }
}
</style>
