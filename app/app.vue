<script setup lang="ts">
import { company } from '~/data/company'

const config = useRuntimeConfig()
const route = useRoute()
const siteUrl = String(config.public.siteUrl || '').replace(/\/$/, '')

// Site-wide defaults. Individual pages override title and description via
// their own useSeoMeta call; everything below applies unless they do.
useSeoMeta({
  titleTemplate: (title) =>
    title?.includes('Cipher4') ? title : `${title} — Cipher4 AI & Robotics`,
  ogSiteName: company.legalName,
  ogLocale: 'en_NG',
  ogImage: `${siteUrl}/images/og-default.jpg`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Cipher4 AI & Robotics — intelligence for critical operations',
  twitterCard: 'summary_large_image',
  twitterImage: `${siteUrl}/images/og-default.jpg`,
})

// Canonical URL per route. Without this, a site reachable on more than one
// host splits its own ranking between them.
useHead({
  link: [
    {
      rel: 'canonical',
      href: () => `${siteUrl}${route.path === '/' ? '/' : route.path.replace(/\/$/, '')}`,
    },
  ],
})

useSiteSchema()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
