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
        <p class="header-text year-text" style="text-align: end">2026.</p>
      </div>

      <img src="/assets/icons/sunce.svg" alt="Sunce" class="sunce-icon" />
      <img src="/assets/icons/oblak-1.svg" alt="oblak" class="oblaci-icon oblak-1" />
      <img src="/assets/icons/oblak-2.svg" alt="oblak" class="oblaci-icon oblak-2" />
      <img src="/assets/icons/oblak-3.svg" alt="oblak" class="oblaci-icon oblak-3" />
      <img src="/assets/icons/oblak-4.svg" alt="oblak" class="oblaci-icon oblak-4" />
    </div>
  </div>

  <NavDrawer v-model="visibleRight" />
</template>

<style scoped>
.header-wrapper {
  background-color: #76c6d2;
  width: 100%;
  height: 6rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
  max-width: 50rem;
  width: 100%;
}

.header-text-container {
  width: 65%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.header-text {
  position: relative;
  text-shadow: 3px 4px 0 #d46558;
  font-size: 4rem;
  margin: 0;
  padding: 0;
  font-family: 'Bright';
  color: #efe5dd;
  z-index: 10;
  font-weight: 500;
  line-height: 3.5rem;
}

.year-text {
  font-family: 'LondrinaSolid';
  font-size: 3rem;
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

.burger-icon {
  position: absolute;
  right: 0%;
  top: 15%;
  cursor: pointer;
  z-index: 20;
  width: 2.5rem;
  border-radius: 0;
}

.year-icon {
  height: 2.5rem;
}

@media (max-width: 900px) {
  .header-text {
    font-size: 3rem;
  }

  .year-text {
    font-size: 2.5rem;
  }

  .sunce-icon {
    top: -86%;
    width: 10rem;
    left: 5%;
  }

  .burger-icon {
    right: 5%;
  }

  .year-icon {
    height: 2rem;
  }
}
</style>
