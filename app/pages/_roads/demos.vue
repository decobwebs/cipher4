<script setup lang="ts">
/** Index of the Phase 2b road experiments. Internal only. */
definePageMeta({ layout: 'c4' })
useHead({ title: 'Road experiments', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const demos = [
  { to: '/_roads/arrival', title: '1. Arrival', line: 'On the first visit, the hero road starts fast with a stretched view and settles over 1.2 seconds.' },
  { to: '/_roads/day-to-night', title: '2. Day to night', line: 'As the page scrolls, the road blends from the light theme to the night theme, ending at the closing band.' },
  { to: '/_roads/sectors', title: '3. Sector road', line: 'Four buttons morph the road to each sector’s shape over 800 ms, with no jump.' },
  { to: '/_roads/steering', title: '4. Steering', line: 'On desktop, the camera leans a few degrees towards the mouse.' },
  { to: '/_roads/message-sent', title: '5. Message sent', line: 'One bright amber car races into the distance, with the 400 ms burst.' },
  { to: '/_roads/not-found', title: '6. 404 road', line: 'The road fades out into empty space ahead.' },
]
</script>

<template>
  <div class="c4-wrap list">
    <Eyebrow>Phase 2b · internal</Eyebrow>
    <h1 class="c4-h1">Road experiments</h1>
    <p class="c4-lead">Each idea on its own page, with a replay button. None of them is on a real page yet.</p>
    <ul class="list__items">
      <li v-for="d in demos" :key="d.to">
        <NuxtLink :to="d.to" class="c4-card list__card">
          <span class="c4-h3">{{ d.title }}</span>
          <span class="list__line">{{ d.line }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: var(--s-16);
  padding-top: calc(68px + var(--s-16) + var(--s-64));
  padding-bottom: var(--s-96);
}

.list__items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(360px, 100%), 1fr));
  gap: var(--s-24);
  margin-top: var(--s-32);
  list-style: none;
}

.list__card {
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
  height: 100%;
  padding: var(--s-32);
  transition: border-color var(--dur-ui) var(--ease-out);
}

.list__card:hover {
  border-color: var(--indigo);
}

.list__line {
  font-size: 15px;
  line-height: 1.55;
  color: var(--slate);
}
</style>
