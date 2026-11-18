<script setup lang="ts">
/** Why Cipher4 (content C7): heading on the left, four promises on the right. */
import { why } from '~/data/home'
</script>

<template>
  <section class="hy c4-section" aria-labelledby="hy-title">
    <div class="c4-wrap hy__grid">
      <div class="hy__head">
        <Eyebrow>{{ why.eyebrow }}</Eyebrow>
        <h2 id="hy-title" class="c4-h2 hy__title">{{ why.title }}</h2>
      </div>
      <ul class="hy__list">
        <li v-for="(w, i) in why.items" :key="w.title" class="hy__item">
          <C4Icon :name="w.icon" :size="44" :delay="i * 0.3" />
          <div class="hy__text">
            <h3 class="hy__name">{{ w.title }}</h3>
            <p class="hy__body">{{ w.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.hy {
  background: var(--white);
}

.hy__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(420px, 100%), 1fr));
  gap: var(--s-64);
}

.hy__head {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
}

.hy__title {
  max-width: 480px;
}

.hy__list {
  list-style: none;
}

.hy__item {
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: var(--s-24);
  padding: var(--s-32) 0;
  border-top: 1px solid var(--line);
}

.hy__item:last-child {
  border-bottom: 1px solid var(--line);
}

.hy__text {
  display: flex;
  flex-direction: column;
  gap: var(--s-12);
}

.hy__name {
  font-size: 23px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.hy__body {
  max-width: 520px;
  font-size: 17px;
  line-height: 1.6;
  color: var(--slate);
}

@media (max-width: 767px) {
  .hy__grid {
    gap: var(--s-32);
  }

  .hy__item {
    grid-template-columns: 44px 1fr;
    gap: var(--s-16);
    padding: var(--s-24) 0;
  }

  .hy__name {
    font-size: 19px;
  }

  .hy__body {
    font-size: 15px;
  }
}
</style>
