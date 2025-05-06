<script setup lang="ts">
import { ref } from 'vue'
import Header from '~/components/Header.vue'
import ArtistCard from '~/components/ArtistCard.vue'
import Footer from '~/components/Footer.vue'
import { type GallerySection } from '~/types/GallerySection'

const query = groq`*[_type == "gallerySection"] | order(_createdAt desc)`
const { data: gallerySections } = await useSanityQuery<GallerySection[]>(query)

console.log(gallerySections)

type GalleryInstance = {
  id: string
  year: number
  type: string
  images: {
    itemImageSrc: string
    thumbnailImageSrc: string
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
    alt: `Image ${index + 1}`,
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
</script>

<template>
  <Header />
  <div class="gallery-wrapper">
    <div class="gallery-container">
      <div
        v-for="year in [...new Set(galleries.map((g) => g.year))]"
        :key="year"
      >
        <h2 style="color: white">{{ year }}</h2>

        <div
          v-for="group in galleries.filter((g) => g.year === year)"
          :key="group.id"
          class="gallery-section"
        >
          <h3 style="color: white">{{ group.type }}</h3>

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
                <img
                  :src="slotProps.item.itemImageSrc"
                  :alt="slotProps.item.alt"
                  class="galleria-image"
                />
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
  </div>

  <div class="prijelaz-container">
    <img
      src="/assets/prijelazi/prijelaz-more-dm.svg"
      alt="prijelaz-zid-plaza"
      style="background-color: #5c9c9c"
    />
  </div>

  <Footer />
</template>

<style>
.p-galleria {
  border: none !important;
}
.image-wrapper {
  width: 90vw;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
}

.galleria-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
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
  max-width: 50rem;
  width: 100%;

  padding: 1rem;
}

.gallery-wrapper {
  background-color: #5c9c9c;
  height: fit-content;
  width: 100%;

  display: flex;
  justify-content: center;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  background-image: url('/assets/zid-teksture/zid-tekstura-gallery.svg');
  background-repeat: repeat;
  background-size: contain;

  padding-top: 2rem;
}

.gallery-thumbnails {
  column-count: 3;
  column-gap: 16px;
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

@media (max-width: 650px) {
  .gallery-thumbnails {
    column-count: 2;
  }
}
</style>
