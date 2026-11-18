<script setup lang="ts">
/** Featured work (content C6): the work carousel on the mist ground. */
import { work } from '~/data/home'
</script>

<template>
  <section class="hw c4-section c4-section--mist" aria-labelledby="hw-title">
    <div class="c4-wrap">
      <SectionHeader title-id="hw-title" :eyebrow="work.eyebrow" :title="work.title">
        <template #action>
          <C4Button :to="work.all.to" variant="text">{{ work.all.label }}</C4Button>
        </template>
      </SectionHeader>
      <WorkCarousel :items="work.items" :label="work.title" />
    </div>
  </section>
</template>
