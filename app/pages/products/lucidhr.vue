<script setup lang="ts">
/** LucidHR (content F4): the case study template with the "Product" label. */
import { caseBySlug } from '~/data/work'

definePageMeta({ layout: 'c4' })
const item = caseBySlug('lucidhr')!
</script>

<template>
  <CaseTemplate :item="item" />
</template>
