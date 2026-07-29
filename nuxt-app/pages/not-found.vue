<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => `404 - ${t('notFound.title')}`,
  robots: 'noindex, follow',
})
</script>

<template>
  <NotFoundContent />
</template>
