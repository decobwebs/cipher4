<script setup lang="ts">
/** Index of the Phase 2b road experiments. Internal only. */
definePageMeta({ layout: 'c4' })
useHead({ title: 'Road experiments', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

// Kept by the owner for Phase 3: 1, 3, 4, 5, 6. Dropped: 2 (Day to night).
// New for review: 7 and 8.
const demos = [
  { to: '/_roads/arrival', title: '1. Arrival · kept', line: 'On the first visit, the hero road starts fast with a stretched view and settles over 1.2 seconds.' },
  { to: '/_roads/sectors', title: '3. Sector road · kept', line: 'Four buttons morph the road to each sector’s shape over 800 ms, with no jump.' },
  { to: '/_roads/steering', title: '4. Steering · kept', line: 'On desktop, the camera leans a few degrees towards the mouse.' },
  { to: '/_roads/message-sent', title: '5. Message sent · kept', line: 'One bright amber car races into the distance, with the 400 ms burst.' },
  { to: '/_roads/not-found', title: '6. 404 road · kept', line: 'The road fades out into empty space ahead.' },
  { to: '/_roads/spine', title: '7. Spine · new', line: 'Seen from above: a narrow band down How we deliver, its trails moving with the scroll in both directions.' },
  { to: '/_roads/launch', title: '8. Launch · new', line: 'Seen from behind, pointing up the screen: trails rise and build up speed as the Youth header comes into view.' },
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
