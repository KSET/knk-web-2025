<script setup lang="ts">
import { ref } from 'vue'
import Footer from '~/components/Footer.vue'

const visibleRight = ref(false)
const toggleVisibleRight = (): void => {
  visibleRight.value = !visibleRight.value
}

// loading pretix script
import { onMounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://karte.kset.org/widget/v1.en.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
})
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee backgroundColor="var(--knk-blue)" />

  <div class="page-header">
    <p class="page-title">ulaznice</p>
    <img
      src="/assets/icons/burger.svg?v=2"
      alt="burger"
      @click="toggleVisibleRight"
      class="burger-icon"
    />
  </div>

  <div class="page-wrapper">
    <img src="/assets/icons/oblak-1.svg" alt="oblak" class="oblak oblak-1" />
    <img src="/assets/icons/oblak-2.svg" alt="oblak" class="oblak oblak-2" />
    <img src="/assets/icons/oblak-3.svg" alt="oblak" class="oblak oblak-3" />
    <img src="/assets/icons/oblak-4.svg" alt="oblak" class="oblak oblak-4" />
    <img src="/assets/icons/oblak-1.svg" alt="oblak" class="oblak oblak-5" />
    <img src="/assets/icons/oblak-3.svg" alt="oblak" class="oblak oblak-6" />
    <img src="/assets/icons/oblak-2.svg" alt="oblak" class="oblak oblak-7" />
    <img src="/assets/icons/oblak-4.svg" alt="oblak" class="oblak oblak-8" />

    <div class="page-container">
      <client-only>
        <div
          class="pretix-widget-compat"
          event="https://karte.kset.org/kset/kset-na-krku/"
          single-item-select="button"
        ></div>
      </client-only>
      <noscript>
        <div class="pretix-widget">
          <div class="pretix-widget-info-message">
            JavaScript is disabled in your browser. To access our ticket shop
            without JavaScript, please
            <a
              target="_blank"
              rel="noopener"
              href="https://karte.kset.org/kset/kset-na-krku/"
              >click here</a
            >.
          </div>
        </div>
      </noscript>
    </div>
  </div>

  <Footer />
  <Marquee backgroundColor="var(--knk-blue)" />
  <NavDrawer v-model="visibleRight" />
</template>

<style>
.pretix-widget {
  background-color: white !important;
}

.pretix-widget-item-description p {
  color: gray !important;
}
</style>

<style scoped>
.page-header {
  background-color: var(--knk-orange);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 1.5rem 1rem;
}

.page-title {
  font-family: 'Rokkitt', serif;
  font-size: 5rem;
  font-weight: 500;
  color: #efe5dd;
  text-shadow: 3px 4px 0 var(--knk-blue);
  margin: 0;
}

.burger-icon {
  position: absolute;
  right: 1.5rem;
  cursor: pointer;
  width: 2.5rem;
  border-radius: 0;
}

.page-container {
  max-width: 50rem;
  width: 100%;
  padding: 1rem;
}

.page-wrapper {
  min-height: 70vh;
  position: relative;
  background-color: var(--knk-orange);
  height: fit-content;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  padding-top: 2rem;
  overflow: hidden;
}

.oblak {
  position: absolute;
  pointer-events: none;
  opacity: 0.8;
}

.oblak-1 {
  top: 1rem;
  left: -2rem;
  width: 12rem;
}

.oblak-2 {
  top: 6rem;
  right: -1rem;
  width: 10rem;
}

.oblak-3 {
  top: 18rem;
  left: 1rem;
  width: 9rem;
}

.oblak-4 {
  top: 28rem;
  right: 0;
  width: 11rem;
}

.oblak-5 {
  top: 38rem;
  right: 3rem;
  width: 8rem;
}

.oblak-6 {
  top: 48rem;
  left: -1rem;
  width: 10rem;
}

.oblak-7 {
  bottom: 10rem;
  left: 4rem;
  width: 11rem;
}

.oblak-8 {
  bottom: 2rem;
  right: -2rem;
  width: 9rem;
}

@media (max-width: 900px) {
  .page-title {
    font-size: 3.5rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2.5rem;
    text-shadow: 2px 3px 0 var(--knk-blue);
  }

  .burger-icon {
    width: 1.8rem;
  }

  .page-header {
    padding: 1rem 0.75rem;
  }
}
</style>
