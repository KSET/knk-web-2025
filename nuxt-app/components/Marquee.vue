<script setup lang="ts">
interface Props {
  backgroundColor?: string
  textShadowColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: 'var(--knk-lightblue)',
  textShadowColor: 'var(--knk-orange)',
})
</script>

<template>
  <NuxtLink to="/" class="marquee-wrapper" :style="{ backgroundColor: props.backgroundColor }">
    <div class="marquee-track">
      <span
        class="marquee-text"
        v-for="i in 20"
        :key="i"
        :style="{ textShadow: '3px 4px 0 ' + props.textShadowColor }"
      >knk&nbsp;</span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.marquee-wrapper {
  width: 100%;
  height: 6.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  text-decoration: none;
  cursor: pointer;
  line-height: 0;
}

.marquee-track {
  display: flex;
  white-space: nowrap;
  animation: marquee-scroll 30s linear infinite;
}

.marquee-text {
  font-family: 'Rockwell', serif;
  font-weight: bold;
  font-size: 6.5rem;
  line-height: 1;
  color: #efe5dd;
  padding: 0 1rem;
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
