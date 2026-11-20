<script setup lang="ts">
/** Featured work (content C6): the work carousel on the mist ground. */
import { work } from '~/data/home'
</script>

<template>
  <!-- Grid draw-in: the grid paper draws down from the top edge first. -->
  <section class="hw c4-section c4-section--mist bp-host" aria-labelledby="hw-title">
    <BlueprintGround kind="grid" draw="top" />
    <div class="c4-wrap">
      <SectionHeader title-id="hw-title" :eyebrow="work.eyebrow" :title="work.title">
        <template #action>
          <C4Button :to="work.all.to" variant="text">{{ work.all.label }}</C4Button>
        </template>
      </SectionHeader>
      <!-- Choreography 06: zoom-through from depth. -->
      <WorkCarousel v-m="'zoom'" :items="work.items" label="Projects" />
    </div>
  </section>
</template>
