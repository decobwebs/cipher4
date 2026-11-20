<script setup lang="ts">
/**
 * Home page (content Part C; Home-Desktop and Home-Mobile boards).
 * Sections in board order. Copy lives in app/data/home.ts.
 */
import { homeSeo } from '~/data/home'

definePageMeta({ layout: 'c4' })

useSeoMeta({
  title: homeSeo.title,
  description: homeSeo.description,
  ogTitle: homeSeo.socialTitle,
  ogDescription: homeSeo.socialDescription,
  ogType: 'website',
})

// Hydrate a little before a section reaches the screen.
const near = { rootMargin: '300px 0px' }
</script>

<template>
  <div>
    <HomeHero />
    <HomeClients />
    <!-- Phase 8 (speed): the sections below the first screen come to life
         (hydrate) as they come near; their HTML is there from the start.
         How we deliver hydrates at once: it sets up its desktop pin. -->
    <LazyHomeMission :hydrate-on-visible="near" />
    <LazyHomeServices :hydrate-on-visible="near" />
    <LazyHomeSectors :hydrate-on-visible="near" />
    <LazyHomeWork :hydrate-on-visible="near" />
    <LazyHomeWhy :hydrate-on-visible="near" />
    <HomeDeliver />
    <LazyHomeTechnologies :hydrate-on-visible="near" />
    <LazyHomeInsights :hydrate-on-visible="near" />
    <LazyHomeYouth :hydrate-on-visible="near" />
    <LazyClosingBand :hydrate-on-visible="near" />
  </div>
</template>
