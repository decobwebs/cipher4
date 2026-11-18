<script setup lang="ts">
/** Case studies: /work/reliant-anchor, /work/harbours360 (content F2, F3). */
import { caseBySlug } from '~/data/work'

definePageMeta({ layout: 'c4' })

const route = useRoute()
const item = caseBySlug(String(route.params.slug))
if (!item || item.kind !== 'case') throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
</script>

<template>
  <CaseTemplate :item="item!" />
</template>
