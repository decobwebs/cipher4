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
</script>

<template>
  <div>
    <HomeHero />
    <HomeClients />
    <HomeMission />
    <HomeServices />
    <!-- Motion board 03: a calm road joins one chapter to the next. -->
    <RoadStrip />
    <HomeSectors />
    <HomeWork />
    <HomeWhy />
    <HomeDeliver />
    <HomeTechnologies />
    <RoadStrip />
    <HomeInsights />
    <HomeYouth />
    <ClosingBand />
  </div>
</template>
