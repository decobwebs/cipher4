<script setup lang="ts">
/**
 * Technologies (content C9). Desktop: a grid of names in hairline cells
 * (Home-Desktop). Phones: tags (Home-Mobile). The official logos replace
 * the names when they are supplied (content F5 note).
 */
import { technologies } from '~/data/home'
</script>

<template>
  <section class="ht c4-section" aria-labelledby="ht-title">
    <div class="c4-wrap">
      <SectionHeader title-id="ht-title" :eyebrow="technologies.eyebrow" :title="technologies.title">
        <template #action>
          <C4Button :to="technologies.link.to" variant="text">{{ technologies.link.label }}</C4Button>
        </template>
      </SectionHeader>
      <!-- Choreography 09: a scattered stack snaps together. -->
      <ul v-m="'snap'" class="ht__list">
        <li v-for="(t, i) in technologies.names" :key="t" class="ht__item m-chip" :style="scatter(i)">
          <span class="ht__dot" :class="i % 2 ? 'ht__dot--indigo' : ''" aria-hidden="true" />{{ t }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.ht {
  background: var(--white);
}

.ht__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
  list-style: none;
}

.ht__item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  padding: 0 var(--s-16);
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  font-size: 19px;
  font-weight: 500;
  color: var(--slate);
  text-align: center;
}

.ht__dot {
  display: none;
}

/* Phones: tags. */
@media (max-width: 767px) {
  .ht__list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-8);
    border: 0;
  }

  .ht__item {
    gap: var(--s-8);
    height: 44px;
    padding: 0 var(--s-16);
    border: 1px solid var(--line-2);
    border-radius: var(--radius-pill);
    background: var(--white);
    font-size: 15px;
    font-weight: 400;
    color: var(--ink-2);
  }

  .ht__dot {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--amber);
  }

  .ht__dot--indigo {
    background: var(--indigo);
  }
}
</style>
