<script setup lang="ts">
import { type Sponsor } from '~/types/Sponsor'

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

    <p>Sva prava pridržana © 2026</p>
    <p>Savez studenata FER-a</p>
    <div class="footer-links">
      <div>
        <a
          href="https://web.facebook.com/events/1161949535664367"
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
          href="https://www.instagram.com/klubkset"
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
      <NuxtLink to="/pravila" class="" style="color: white">Pravila</NuxtLink>
      <NuxtLink to="/politika-privatnosti" class="" style="color: white"
        >Politika Privatnosti</NuxtLink
      >
    </div>
  </div>
</template>

<style scoped>
.footer-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: #264f6c;
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

@media (max-width: 900px) {
  .sponsors-container {
    gap: 1rem;
  }

  .logos {
    gap: 1rem;
  }
}
</style>
