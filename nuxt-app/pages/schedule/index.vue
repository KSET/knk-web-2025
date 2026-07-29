<script setup>
import { ref } from 'vue'
import Footer from '~/components/Footer.vue'
import Schedule from '~/components/Schedule.vue'

const visibleRight = ref(false)
</script>

<template>
  <StickyHeader v-model:drawer-visible="visibleRight" />
  <Marquee />

  <div class="schedule-wrapper">
    <Schedule />
  </div>

  <Footer />
  <Marquee />
  <NavDrawer v-model="visibleRight" />
</template>

<style scoped>
.schedule-wrapper {
  align-items: center;
  background-color: #dd7d91;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-image: url('/assets/zid-teksture/zid-tekstura-landing.svg');
  background-repeat: repeat;
  background-size: contain;
  min-height: 60rem;
  padding-top: 2rem;
}
</style>
