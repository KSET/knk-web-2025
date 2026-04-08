<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const drawerVisible = defineModel<boolean>('drawerVisible', { required: true })

const checkScroll = () => {
  const hero = document.querySelector('.header-wrapper')
  if (!hero) {
    const halfHero = (window.innerHeight - 104) / 2
    visible.value = window.scrollY >= halfHero
    return
  }
  const heroBottom = hero.getBoundingClientRect().bottom
  visible.value = heroBottom <= 0
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll, { passive: true })
  checkScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
  <Transition name="sticky-slide">
    <div v-show="visible" class="sticky-header">
      <NuxtLink to="/tickets" class="sticky-btn">
        Kupi ulaznice
        <img src="/assets/icons/arrow-right-orange.svg" alt="" class="sticky-btn-arrow" />
      </NuxtLink>

      <div class="sticky-center">
        <NuxtLink to="/" class="sticky-title">knk</NuxtLink>
        <span class="sticky-dates">14. 8. - 16. 8.</span>
      </div>

      <img
        src="/assets/icons/burger.svg"
        alt="menu"
        class="sticky-burger"
        @click="drawerVisible = !drawerVisible"
      />
    </div>
  </Transition>
</template>

<style scoped>
.sticky-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: var(--knk-blue);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.sticky-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  color: var(--knk-orange);
  font-family: 'Rokkitt', serif;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  white-space: nowrap;
  line-height: 1.2;
}

.sticky-btn-arrow {
  width: 1rem;
  height: 1rem;
  border-radius: 0;
}

.sticky-center {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 0.6rem;
  line-height: 1;
}

.sticky-title {
  font-family: 'Rockwell', serif;
  font-weight: bold;
  font-size: 4.5rem;
  color: #efe5dd;
  text-shadow: 2px 3px 0 var(--knk-orange);
  text-decoration: none;
}

.sticky-dates {
  font-family: 'Rockwell', serif;
  font-size: 1.2rem;
  font-weight: bold;
  color: #efe5dd;
}

.sticky-burger {
  width: 2.2rem;
  height: auto;
  cursor: pointer;
  border-radius: 0;
}

/* Slide transition */
.sticky-slide-enter-active,
.sticky-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.sticky-slide-enter-from,
.sticky-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

@media (max-width: 900px) {
  .sticky-header {
    padding: 0.6rem 1rem;
  }

  .sticky-btn {
    font-size: 1rem;
    padding: 0.4rem 0.9rem;
  }

  .sticky-title {
    font-size: 3.5rem;
  }

  .sticky-dates {
    font-size: 0.9rem;
  }

  .sticky-burger {
    width: 1.8rem;
  }
}

@media (max-width: 480px) {
  .sticky-header {
    padding: 0.4rem 0.6rem;
  }

  .sticky-btn {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
    gap: 0.3rem;
    border-radius: 6px;
  }

  .sticky-btn-arrow {
    width: 0.75rem;
    height: 0.75rem;
  }

  .sticky-title {
    font-size: 2.2rem;
  }

  .sticky-dates {
    font-size: 0.7rem;
  }

  .sticky-center {
    gap: 0.3rem;
  }

  .sticky-burger {
    width: 1.4rem;
  }
}
</style>
