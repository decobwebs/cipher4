<script setup lang="ts">
/** Privacy policy (content J3). */
import { privacyPage as page } from '~/data/legal'

definePageMeta({ layout: 'c4' })
useSeoMeta({ title: page.seo.title, description: page.seo.description, ogTitle: page.seo.title, ogDescription: page.seo.description })
</script>

<template>
  <LegalPage :page="page" />
</template>
