<script setup lang="ts">
import { type Sponsor } from '~/types/Sponsor'

const props = withDefaults(defineProps<{
  decorImage?: string
}>(), {
  decorImage: '/assets/icons/teta.svg'
})

const localePath = useLocalePath()

const query = groq`*[_type == "sponsor"] | order(barIndex asc, orderRank asc)`
const { data: sponsors } = await useSanityQuery<Sponsor[]>(query)

const groupedByBarIndex = computed(() => {
  const map = new Map<number, Sponsor[]>()
  for (const sponsor of sponsors.value || []) {
    const key = sponsor.barIndex ?? 0
    if (!map.has(key)) map.set(key, [])
    map.get(key)?.push(sponsor)
  }

  return Array.from(map.entries()).sort(([a], [b]) => a - b)
})
</script>

<template>
  <div class="footer-wrapper">
    <div class="footer-container">
      <div
        v-for="[barIndex, group] in groupedByBarIndex"
        :key="barIndex"
        class="sponsors-container"
      >
        <div v-for="sponsor in group" :key="sponsor._id" class="sponsor-item">
          <a
            v-if="sponsor.link"
            :href="sponsor.link.toString()"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              v-if="sponsor.image"
              :src="$urlFor(sponsor.image).url()"
              :alt="sponsor.name"
            />
          </a>
          <img
            v-else-if="sponsor.image"
            :src="$urlFor(sponsor.image).url()"
            :alt="sponsor.name"
          />
        </div>
      </div>
    </div>

    <p>{{ $t('footer.allRightsReserved') }}</p>
    <div class="footer-links">
      <div>
        <a
          href="https://fb.me/e/8hdGf5HBk"
          target="_blank"
          rel="noopener noreferrer"
          ><img
            src="/assets/icons/facebook.png"
            alt="logo"
            class="logo"
            style="height: 1.5rem"
        /></a>
      </div>
      <div>
        <a
          href="https://www.instagram.com/ksetnakrku/"
          target="_blank"
          rel="noopener noreferrer"
          ><img
            src="/assets/icons/instagram.png"
            alt="logo"
            class="logo"
            style="height: 1.5rem"
        /></a>
      </div>
      <div>
        <a href="mailto:press@kset.org">press@kset.org</a>
      </div>
      <div>
        <a href="mailto:info@kset.org">info@kset.org</a>
      </div>
    </div>

    <div class="footer-links">
      <NuxtLink :to="localePath('/pravila')" class="" style="color: white">{{ $t('footer.rules') }}</NuxtLink>
      <NuxtLink :to="localePath('/politika-privatnosti')" class="" style="color: white"
        >{{ $t('footer.privacyPolicy') }}</NuxtLink
      >
    </div>

    <img
      :src="props.decorImage"
      alt="footer-decor"
      class="footer-teta"
    />
  </div>
</template>

<style scoped>
.footer-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  background-color: var(--knk-blue);
  padding-top: 2rem;
}

.footer-container {
  max-width: 50rem;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
  color: white;
}

.logo {
  border-radius: 0px;
  height: 3rem;
}

.logos {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.footer-links {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  gap: 1rem;

  color: white;
}

.footer-links a {
  color: white;
}

.title-text {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.sponsors-container {
  display: flex;
  row-gap: 1rem;
  column-gap: 3rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1rem;
}

.sponsor-item {
  height: 6rem;
  width: 6rem;
}

.sponsor-item img {
  height: 100%;
  width: 100%;
  max-width: 100%;
  max-height: 100%;

  object-fit: contain;
}

.footer-teta {
  position: absolute;
  bottom: -6%;
  right: -8%;
  height: 100%;
  pointer-events: none;
  opacity: 0.8;
  z-index: 0;
}

.footer-wrapper > *:not(.footer-teta) {
  position: relative;
  z-index: 1;
}

@media (max-width: 900px) {
  .sponsors-container {
    gap: 1rem;
  }

  .logos {
    gap: 1rem;
  }
}
</style>
