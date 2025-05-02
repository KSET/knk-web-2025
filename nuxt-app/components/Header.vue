<script setup lang="ts">
import { ref } from 'vue'

const visibleRight = ref(false)

const toggleVisibleRight = (): void => {
  visibleRight.value = !visibleRight.value
}
</script>

<template>
  <div class="header-wrapper">
    <div class="header-container">
      <img
        src="/assets/icons/burger.svg"
        alt="burger"
        @click="toggleVisibleRight"
        class="burger-icon"
      />
      <div class="header-text-container">
        <NuxtLink
          to="/"
          class="hover:underline drawer-text"
          style="color: #844d99"
        >
          <p class="header-text">kset na krku</p></NuxtLink
        >
        <p class="header-text" style="text-align: center"></p>
        <!-- <p class="header-text" style="text-align: end">2025</p> -->
        <img
          src="/assets/icons/2025.svg"
          alt="2025"
          class="2025-icon"
          style="align-self: flex-end"
        />
      </div>

      <img src="/assets/icons/sunce.svg" alt="Sunce" class="sunce-icon" />
      <img src="/assets/icons/oblaci.svg" alt="oblaci" class="oblaci-icon" />
    </div>
  </div>

  <Drawer v-model:visible="visibleRight" hedaer=" " position="right">
    <div class="drawer-wrapper">
      <div class="drawer-container">
        <div>
          <NuxtLink
            to="/"
            class="hover:underline drawer-text"
            style="color: #844d99"
            >NASLOVNICA</NuxtLink
          >
        </div>
        <div>
          <NuxtLink
            to="/lineup"
            class="hover:underline drawer-text"
            style="color: #dd7d91"
            >IZVOĐAČI</NuxtLink
          >
        </div>
        <div>
          <NuxtLink
            to="/gallery"
            class="hover:underline drawer-text"
            style="color: #e55a8e"
            >GALERIJA</NuxtLink
          >
        </div>
      </div>

      <div class="drawer-footer">
        <img
          src="/assets/icons/stolica.svg"
          alt="stolica"
          class="stolica-icon"
        />
        <div class="zuta-podloga"></div>
      </div>
    </div>
  </Drawer>
</template>

<style>
.p-drawer {
  background-color: #f7dec0 !important;
}

.p-drawer-content {
  padding: 0 !important;
}
</style>

<style scoped>
.header-wrapper {
  background-color: #76c6d2;
  width: 100%;
  height: 6rem;
}

.header-container {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
}

.header-text-container {
  width: 65%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.header-text {
  position: relative;
  text-shadow: 3px 4px 0 #e4c9b3;

  font-size: 4rem;
  margin: 0;
  padding: 0;
  font-family: 'Bright';
  color: #efe5dd;
  z-index: 10;
}

.sunce-icon {
  position: absolute;
  top: -100%;
  width: 20%;
  left: 10%;
}

.oblaci-icon {
  position: absolute;
  top: 15%;
  width: 100%;
}

.header-date {
  font-family: 'Bright';
  color: #efe5dd;
  font-size: 1rem;
  text-align: center;
  margin: 0;
  padding: 0;
}

.burger-icon {
  position: absolute;
  right: 0%;
  top: 15%;
  cursor: pointer;
  z-index: 20;
  height: 60%;
}

.header-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header-container {
  max-width: 50rem;
  width: 100%;
}
.drawer-wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 60% 40%;
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
  font-family: 'Montserrat';
  font-size: 1.5rem;
  text-align: center;
  margin: 0;
  padding: 0;
  text-decoration: none;
  font-weight: bold;
}

.drawer-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.stolica-icon {
  height: 80%;
  z-index: 10;
}

.zuta-podloga {
  background: #f3bb64;
  position: absolute;
  top: 70%;
  bottom: 0;
  left: 0;
  right: 0;
}

@media (max-width: 900px) {
  .header-text {
    font-size: 3rem;
  }

  .sunce-icon {
    top: -86%;
    width: 10rem;
    left: 5%;
  }
}
</style>
