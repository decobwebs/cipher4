<script setup lang="ts">
import { company } from '~/data/site'
import { ogImageFor } from '~/data/og'

const config = useRuntimeConfig()
const route = useRoute()
const siteUrl = String(config.public.siteUrl || '').replace(/\/$/, '')
const pageUrl = computed(() => `${siteUrl}${route.path === '/' ? '/' : route.path.replace(/\/$/, '')}`)
const og = computed(() => ogImageFor(route.path))

// Site-wide defaults. Every page sets its own title and description (from
// the content file) with useSeoMeta; its share text follows them (J6).
// The share image is chosen by the page's address (data/og.ts).
useSeoMeta({
  titleTemplate: (title) => (title?.includes('Cipher4') ? title : `${title} | Cipher4 AI & Robotics`),
  ogSiteName: company.legalName,
  ogLocale: 'en_NG',
  ogType: 'website',
  ogUrl: () => pageUrl.value,
  ogImage: () => `${siteUrl}${og.value.src}`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: () => og.value.alt,
  twitterCard: 'summary_large_image',
  twitterImage: () => `${siteUrl}${og.value.src}`,
  twitterImageAlt: () => og.value.alt,
})

// Canonical address per page. Without this, a site reachable on more than
// one host splits its own ranking between them.
useHead({
  link: [{ rel: 'canonical', href: () => pageUrl.value }],
})

useSiteSchema()

// Analytics: none for now (owner, 20 Nov 2026). This is the one place a
// cookie-free tool would be added; the privacy policy already covers one.
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
