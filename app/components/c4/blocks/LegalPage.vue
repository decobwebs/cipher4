<script setup lang="ts">
/**
 * Privacy policy and terms of use (content J3, J4). A reading page: a white
 * header with no road, a list of section links on the left (desktop), and
 * the text at a comfortable line length. In a list item, *text*: is the
 * italic lead-in from the content file.
 */
import { LAST_UPDATED_LABEL, type LegalPage } from '~/data/legal'

const props = defineProps<{ page: LegalPage }>()

const id = (t: string) => `lg-${t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`

/** Splits "*Lead:* rest" into its italic lead-in and the rest. */
function lead(item: string) {
  const m = /^\*([^*]+)\*\s*(.*)$/.exec(item)
  return m ? { em: m[1]!, rest: ` ${m[2]}` } : { em: '', rest: item }
}

const crumbs = computed(() => [{ label: 'Home', to: '/' }, { label: props.page.title }])
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :title="page.title" :min-height="0" :text-width="880">
      <template v-if="page.lastUpdated" #meta>
        <p class="lg-date">{{ LAST_UPDATED_LABEL }} {{ page.lastUpdated }}</p>
      </template>
    </PageHero>

    <section class="c4-section lg-body" aria-label="Policy text">
      <div class="c4-wrap lg-layout">
        <nav class="lg-toc" aria-label="On this page">
          <ul>
            <li v-for="s in page.sections" :key="s.title">
              <a :href="`#${id(s.title)}`">{{ s.title }}</a>
            </li>
          </ul>
        </nav>
        <div class="c4p-prose">
          <template v-for="s in page.sections" :key="s.title">
            <h2 :id="id(s.title)">{{ s.title }}</h2>
            <template v-for="(b, i) in s.blocks" :key="i">
              <p v-if="b.kind === 'p'">{{ b.text }}</p>
              <ul v-else>
                <li v-for="item in b.items" :key="item">
                  <em v-if="lead(item).em">{{ lead(item).em }}</em>{{ lead(item).rest }}
                </li>
              </ul>
            </template>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lg-date {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slate);
}

.lg-body {
  padding-top: var(--s-64);
  border-top: 1px solid var(--line);
}

.lg-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: var(--s-96);
  align-items: start;
}

.lg-toc {
  position: sticky;
  top: 120px;
}

.lg-toc ul {
  display: flex;
  flex-direction: column;
  list-style: none;
  border-left: 1px solid var(--line);
}

.lg-toc a {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 var(--s-16);
  font-size: 15px;
  color: var(--slate);
  transition: color var(--dur-ui) var(--ease-out);
}

.lg-toc a:hover {
  color: var(--indigo);
}

.lg-body .c4p-prose > h2:first-child {
  margin-top: 0;
}

.lg-body .c4p-prose h2 {
  scroll-margin-top: 120px;
  font-size: 24px;
}

.lg-body em {
  font-style: italic;
  color: var(--ink);
}

@media (max-width: 1100px) {
  .lg-layout {
    grid-template-columns: 1fr;
  }

  .lg-toc {
    display: none;
  }
}
</style>
