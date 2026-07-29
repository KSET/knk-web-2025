<script setup lang="ts">
// Catch-all so vue-router matches unknown paths; without it the router never
// 404s and error.vue is unreachable.
const { t } = useI18n()

useSeoMeta({
  title: () => `404 - ${t('notFound.title')}`,
  robots: 'noindex, follow',
})

// Real 404 for SSR/prerender; the static host still sets the header itself.
const event = useRequestEvent()
if (event) setResponseStatus(event, 404)
</script>

<template>
  <NotFoundContent />
</template>
