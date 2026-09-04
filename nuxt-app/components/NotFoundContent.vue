<script setup lang="ts">
import { ref } from 'vue'
import Footer from '~/components/Footer.vue'

const props = withDefaults(
  defineProps<{ generic?: boolean; statusCode?: number }>(),
  { generic: false, statusCode: 500 },
)

const localePath = useLocalePath()
const visibleRight = ref(false)

const code = computed(() => (props.generic ? props.statusCode : 404))
const titleKey = computed(() =>
  props.generic ? 'error.title' : 'notFound.title',
)
const textKey = computed(() => (props.generic ? 'error.text' : 'notFound.text'))

const links = [
  { to: '/', key: 'home', primary: true },
  // { to: '/tickets', key: 'tickets', primary: false },
  { to: '/lineup', key: 'lineup', primary: false },
  { to: '/festival', key: 'festival', primary: false },
]
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee />

  <div class="notfound-wrapper">
    <div class="notfound-content">
      <p class="notfound-code">{{ code }}</p>
      <h1 class="notfound-title">{{ $t(titleKey) }}</h1>
      <p class="notfound-text">{{ $t(textKey) }}</p>

      <div class="notfound-links">
        <NuxtLink
          v-for="link in links"
          :key="link.key"
          :to="localePath(link.to)"
          :class="['notfound-link', link.primary ? 'primary' : 'secondary']"
        >
          {{ $t(`notFound.${link.key}`) }}
          <img
            v-if="link.primary"
            src="/assets/icons/arrow-right-blue.svg"
            alt=""
            class="link-arrow"
          />
        </NuxtLink>
      </div>
    </div>
  </div>

  <Footer />

  <Marquee />

  <NavDrawer v-model="visibleRight" />
</template>

<style scoped>
.notfound-wrapper {
  position: relative;
  background-color: var(--knk-blue);
  width: 100%;
  min-height: calc(100vh - 13rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: var(--space-7) 1rem var(--space-6);
}

.notfound-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: var(--max-width-1);
}

.notfound-code {
  font-family: 'Rokkitt', serif;
  font-size: clamp(6rem, 22vw, 14rem);
  font-weight: 900;
  line-height: 0.85;
  color: white;
  text-shadow: 4px 6px 0 var(--knk-orange);
  margin: 0;
}

.notfound-title {
  font-family: 'Rokkitt', serif;
  font-size: var(--text-subheading);
  font-weight: bold;
  color: var(--knk-yellow);
  text-transform: lowercase;
  margin: var(--space-4) 0 0;
}

.notfound-text {
  font-size: var(--text-title);
  color: #efe5dd;
  line-height: var(--line-height-2);
  text-wrap: balance;
  margin: var(--space-3) 0 0;
}

.notfound-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

.notfound-link {
  font-family: 'Rokkitt', serif;
  font-weight: 700;
  font-size: var(--text-body);
  text-transform: lowercase;
  text-decoration: none;
  border-radius: 8px;
  padding: 0.5rem 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 2.5px solid white;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    transform 0.15s ease;
}

.notfound-link.primary {
  background-color: white;
  color: var(--knk-blue);
}

.notfound-link.secondary {
  background-color: transparent;
  color: white;
}

.notfound-link:hover {
  transform: translateY(-2px);
}

.notfound-link.secondary:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.link-arrow {
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 0;
}

@media (prefers-reduced-motion: reduce) {
  .notfound-link:hover {
    transform: none;
  }
}


@media (max-width: 900px) {
  .notfound-wrapper {
    min-height: calc(100vh - 9rem);
    padding: var(--space-6) 1rem var(--space-5);
  }

  .notfound-code {
    text-shadow: 4px 5px 0 var(--knk-orange);
  }
}

@media (max-width: 480px) {
  .notfound-wrapper {
    min-height: calc(100vh - 6rem);
  }

  .notfound-code {
    text-shadow: 3px 4px 0 var(--knk-orange);
  }
}
</style>
