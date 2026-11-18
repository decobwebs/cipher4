<script setup lang="ts">
/**
 * Experiment: Launch, shown as the Youth and skills page header (content
 * I1). The road is seen from behind, pointing straight up the screen. As
 * the header comes into view the trails rise and build up speed, then
 * settle to a gentle climb. The road has its own column, so the words are
 * never over it; on phones it sits in a band under the words.
 */
definePageMeta({ layout: 'c4' })
useHead({ title: 'Road experiment: launch' })

const road = ref<{ replaySurge: () => void } | null>(null)
const header = ref<HTMLElement | null>(null)

// Replay: scroll the header out of view, then bring it back in.
function replay() {
  const el = header.value
  if (!el) return
  const into = el.offsetTop - 120
  window.scrollTo({ top: Math.max(0, into - window.innerHeight), behavior: 'instant' as ScrollBehavior })
  setTimeout(() => {
    window.scrollTo({ top: into, behavior: 'smooth' })
    setTimeout(() => road.value?.replaySurge(), 450)
  }, 300)
}
</script>

<template>
  <DevRoadDemo
    :n="8"
    title="Launch"
    idea="The road seen from behind, pointing straight up the screen, as a page header for Youth and skills. As the header scrolls into view the trails rise and build up speed, then settle to a gentle climb. The words have their own column and are never over the road."
    :notes="['Scroll down to the header below, or press replay.', 'Reduced motion and slow devices see the still image.']"
  >
    <template #controls>
      <C4Button variant="primary" size="sm" @click="replay">Replay: bring the header into view</C4Button>
    </template>

    <div class="before">
      <p class="c4-label">Scroll down: the header is below</p>
    </div>

    <section ref="header" class="youth">
      <div class="c4-wrap youth__grid">
        <div class="youth__copy">
          <Breadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'Youth and skills' }]" />
          <Eyebrow>Community</Eyebrow>
          <p class="c4-h1">Opening technology to the next generation</p>
          <p class="c4-lead">Technology will shape the next generation of work. We believe young people should be building it, not only using it. Through mentoring, practical skills sessions and support for promising ideas, we help young people gain the skills and confidence to take part.</p>
        </div>
        <div class="youth__road">
          <HyperspeedRoad ref="road" preset="demo-rise" surge />
        </div>
      </div>
    </section>
    <div class="after" />
  </DevRoadDemo>
</template>

<style scoped>
.before {
  display: flex;
  align-items: flex-end;
  height: 70vh;
  padding: 0 var(--gutter) var(--s-48);
  border-top: 1px solid var(--line);
}

.youth {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.youth__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--s-48);
  align-items: center;
  min-height: 640px;
}

.youth__copy {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
  padding-block: var(--s-96);
  max-width: 600px;
}

.youth__road {
  height: 640px;
}

.after {
  height: 70vh;
}

@media (max-width: 900px) {
  .youth__grid {
    grid-template-columns: 1fr;
    gap: 0;
    min-height: 0;
  }

  .youth__copy {
    padding-block: var(--s-64) var(--s-24);
  }

  .youth__road {
    height: 360px;
  }
}
</style>
