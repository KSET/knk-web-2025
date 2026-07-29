<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()

useSeoMeta({
  title: () =>
    props.error?.statusCode === 404
      ? `404 - ${t('notFound.title')}`
      : t('error.title'),
  robots: 'noindex, follow',
})
</script>

<template>
  <NotFoundContent v-if="error?.statusCode === 404" />
  <NotFoundContent v-else generic :status-code="error?.statusCode || 500" />
</template>
