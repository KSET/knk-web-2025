<script setup lang="ts">
const visible = defineModel<boolean>({ required: true })

const close = () => {
  visible.value = false
}
</script>

<template>
  <Drawer v-model:visible="visible" header=" " position="right">
    <template #header>
      <div class="drawer-header">
        <button class="drawer-close-btn" @click="close" aria-label="Close navigation">
          ✕
        </button>
      </div>
    </template>
    <div class="drawer-wrapper">
      <img src="/assets/icons/sunceko.svg" alt="sunceko" class="drawer-sunceko" />
      <div class="drawer-container" @click="close">
        <div>
          <NuxtLink to="/" class="hover:underline drawer-text" :style="{ color: $route.path === '/' ? 'var(--knk-orange)' : 'white' }">Naslovnica</NuxtLink>
        </div>
        <div>
          <NuxtLink to="/tickets" class="hover:underline drawer-text" :style="{ color: $route.path === '/tickets' ? 'var(--knk-orange)' : 'white' }">Ulaznice</NuxtLink>
        </div>
        <div>
          <NuxtLink to="/festival" class="hover:underline drawer-text" :style="{ color: $route.path === '/festival' ? 'var(--knk-orange)' : 'white' }">Festival</NuxtLink>
        </div>
        <div>
          <NuxtLink to="/kampiranje" class="hover:underline drawer-text" :style="{ color: $route.path === '/kampiranje' ? 'var(--knk-orange)' : 'white' }">Kampiranje</NuxtLink>
        </div>
        <div>
          <NuxtLink to="/gallery" class="hover:underline drawer-text" :style="{ color: $route.path === '/gallery' ? 'var(--knk-orange)' : 'white' }">Galerija</NuxtLink>
        </div>
      </div>

      <div class="drawer-footer">
        <img src="/assets/icons/KRK.svg" alt="KRK" class="stolica-icon" />
      </div>
    </div>
  </Drawer>
</template>

<style>
.p-drawer {
  background-color: var(--knk-lightblue) !important;
}

.p-drawer-content {
  padding: 0 !important;
  overflow: visible !important;
}

.p-drawer-header {
  background-color: var(--knk-lightblue) !important;
  padding: 1rem !important;
}
</style>

<style scoped>
.drawer-header {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.drawer-close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  line-height: 1;
}

.drawer-wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 60% 40%;
  position: relative;
}

.drawer-sunceko {
  position: absolute;
  top: -5rem;
  right: -1.5rem;
  width: 6rem;
  height: auto;
  z-index: 10;
  border-radius: 0;
}

.drawer-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 100%;
}

.drawer-text {
  font-family: 'Rockwell', serif;
  font-size: 1.5rem;
  text-align: center;
  margin: 0;
  padding: 0;
  text-decoration: none;
  font-weight: bold;
  text-transform: lowercase;
}

.drawer-footer {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  overflow: hidden;
}

.stolica-icon {
  max-height: 80%;
  max-width: 100%;
  object-fit: contain;
  z-index: 10;
}
</style>
