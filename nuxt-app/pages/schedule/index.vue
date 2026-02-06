<script setup>
navigateTo('/', { redirectCode: 301 })

import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import Schedule from '~/components/Schedule.vue'
</script>

<template>
  <Header />

  <div class="schedule-wrapper">
    <Schedule />
  </div>

  <div class="prijelaz-container">
    <img
      src="/assets/prijelazi/prijelaz-more-dm.svg"
      alt="prijelaz-zid-plaza"
      style="background-color: #dd7d91"
    />
  </div>

  <Footer />
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

.prijelaz-container {
  height: 4.5rem;
  width: 100%;
}
.prijelaz-container img {
  object-fit: fill;
  width: 100%;
  height: 4.5rem;
  border-radius: 0;
}
</style>
