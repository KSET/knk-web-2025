<script setup lang="ts">
const route = useRoute()
const { enabled, inFrame } = useSanityVisualEditingState()
</script>

<template>
  <a
    v-if="enabled && !inFrame"
    :href="`/preview/disable?redirect=${route.fullPath}`"
    class="preview-toggle"
  >
    <span>Preview Enabled</span>
    <span>Disable Preview</span>
  </a>
</template>
