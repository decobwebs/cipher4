<script setup lang="ts">
/**
 * ContactForm (plan, section 5; content J2; Page-Contact board and
 * Phone-Screens 07 and 08).
 *
 * Two tabs, General enquiry and Request a quote, with the fields J2 lists.
 * On phones the form is two short steps, with the button pinned to the
 * bottom of the screen. Posts through the existing Web3Forms wiring
 * (useContactForm), with its honeypot. Emits `sent` on success, so the page
 * can play the Message sent road effect.
 *
 * Phase 7 adds the J2 field messages, ?type= and ?sector= prefill, and the
 * test with the owner's key. Until a key is set, sending shows the J2 error.
 */
import {
  forms, fieldLabels, sectorOptions, serviceOptions, timelineOptions, tenderOptions,
  privacyLine, messages, type FormType,
} from '~/data/contact'

const emit = defineEmits<{ sent: [] }>()

const type = ref<FormType>('general')
const types: FormType[] = ['general', 'quote']
const tabRefs = ref<HTMLButtonElement[]>([])
const f = computed(() => forms[type.value])

const form = reactive({
  name: '', email: '', organisation: '', phone: '', sector: '', service: '',
  timeline: '', tender: '', message: '', botcheck: '',
})

const { state, submit } = useContactForm('Cipher4 website')
const formEl = ref<HTMLFormElement | null>(null)
const doneEl = ref<HTMLElement | null>(null)
const errorEl = ref<HTMLElement | null>(null)

// --- Tabs (arrow keys move between them) ------------------------------------
function onTabKey(e: KeyboardEvent, i: number) {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
  e.preventDefault()
  const n = e.key === 'ArrowRight' ? (i + 1) % types.length : (i - 1 + types.length) % types.length
  type.value = types[n]!
  tabRefs.value[n]?.focus()
}

// --- Phones: two steps --------------------------------------------------------
const step = ref<1 | 2>(1)
const STEP_ONE = ['cf-name', 'cf-email', 'cf-org', 'cf-sector']

function next() {
  // Check only the first step's fields before moving on.
  for (const id of STEP_ONE) {
    const el = document.getElementById(id) as HTMLInputElement | null
    if (el && !el.checkValidity()) { el.reportValidity(); return }
  }
  step.value = 2
  nextTick(() => (document.getElementById('cf-phone') as HTMLElement | null)?.focus())
}

// --- Send -------------------------------------------------------------------
async function onSubmit() {
  const fields: Record<string, string> = {
    form_type: f.value.tab,
    subject: `${f.value.tab}${form.organisation ? ` from ${form.organisation}` : ''}`,
    name: form.name,
    email: form.email,
    organisation: form.organisation,
    phone: form.phone,
    sector: form.sector,
    service: form.service,
    message: form.message,
    botcheck: form.botcheck,
  }
  if (type.value === 'quote') {
    fields.timeline = form.timeline
    fields.tender = form.tender
  }
  const ok = await submit(fields)
  await nextTick()
  if (ok) {
    emit('sent')
    doneEl.value?.focus()
  } else {
    errorEl.value?.focus()
  }
}
</script>

<template>
  <div class="cf">
    <!-- Sent (Phone-Screens 08: the thank-you comes first) -->
    <div v-if="state === 'success'" ref="doneEl" class="cf-done" role="status" tabindex="-1">
      <C4Icon name="sent" :size="40" />
      <div>
        <p class="cf-done__title">{{ messages.successTitle }}</p>
        <p class="cf-done__text">{{ messages.successText }}</p>
      </div>
    </div>

    <template v-else>
      <div class="cf-tabs" role="tablist" aria-label="Type of message">
        <button
          v-for="(t, i) in types"
          :id="`cf-tab-${t}`"
          :key="t"
          :ref="(el) => { if (el) tabRefs[i] = el as HTMLButtonElement }"
          type="button"
          role="tab"
          class="cf-tab"
          :aria-selected="type === t"
          :tabindex="type === t ? 0 : -1"
          aria-controls="cf-panel"
          @click="type = t"
          @keydown="onTabKey($event, i)"
        >{{ forms[t].tab }}</button>
      </div>

      <form
        id="cf-panel"
        ref="formEl"
        class="cf-form"
        :class="`cf-form--step${step}`"
        role="tabpanel"
        :aria-labelledby="`cf-tab-${type}`"
        novalidate
        @submit.prevent="formEl?.reportValidity() && onSubmit()"
      >
        <p class="cf-intro">{{ f.intro }}</p>

        <div v-if="state === 'error'" ref="errorEl" class="cf-error" role="alert" tabindex="-1">
          <p class="cf-error__title">{{ messages.errorTitle }}</p>
          <p>{{ messages.errorText }}</p>
        </div>

        <!-- Honeypot: hidden from people; only bots fill it in. -->
        <div class="cf-honey" aria-hidden="true">
          <label for="cf-botcheck">Leave this empty</label>
          <input id="cf-botcheck" v-model="form.botcheck" type="text" name="botcheck" tabindex="-1" autocomplete="off">
        </div>

        <div class="cf-grid">
          <div class="cf-field" data-step="1">
            <label for="cf-name">{{ fieldLabels.name }} <span class="cf-req" aria-hidden="true">*</span></label>
            <input id="cf-name" v-model="form.name" type="text" name="name" autocomplete="name" required>
          </div>
          <div class="cf-field" data-step="1">
            <label for="cf-email">{{ fieldLabels.email }} <span class="cf-req" aria-hidden="true">*</span></label>
            <input id="cf-email" v-model="form.email" type="email" name="email" autocomplete="email" required>
          </div>
          <div class="cf-field" data-step="1">
            <label for="cf-org">{{ fieldLabels.organisation }} <span class="cf-req" aria-hidden="true">*</span></label>
            <input id="cf-org" v-model="form.organisation" type="text" name="organisation" autocomplete="organization" required>
          </div>
          <div class="cf-field" data-step="2">
            <label for="cf-phone">{{ fieldLabels.phone }}</label>
            <input id="cf-phone" v-model="form.phone" type="tel" name="phone" autocomplete="tel">
          </div>
          <div class="cf-field" data-step="1">
            <label for="cf-sector">{{ fieldLabels.sector }}</label>
            <div class="cf-select">
              <select id="cf-sector" v-model="form.sector" name="sector">
                <option value="">Choose a sector</option>
                <option v-for="o in sectorOptions" :key="o" :value="o">{{ o }}</option>
              </select>
              <C4Glyph name="chevron" :size="14" class="cf-select__chev" />
            </div>
          </div>
          <div class="cf-field" data-step="2">
            <label for="cf-service">{{ type === 'quote' ? fieldLabels.serviceQuote : fieldLabels.service }}</label>
            <div class="cf-select">
              <select id="cf-service" v-model="form.service" name="service">
                <option value="">Choose a service</option>
                <option v-for="o in serviceOptions" :key="o" :value="o">{{ o }}</option>
              </select>
              <C4Glyph name="chevron" :size="14" class="cf-select__chev" />
            </div>
          </div>
          <template v-if="type === 'quote'">
            <div class="cf-field" data-step="2">
              <label for="cf-timeline">{{ fieldLabels.timeline }}</label>
              <div class="cf-select">
                <select id="cf-timeline" v-model="form.timeline" name="timeline">
                  <option value="">Choose a timeline</option>
                  <option v-for="o in timelineOptions" :key="o" :value="o">{{ o }}</option>
                </select>
                <C4Glyph name="chevron" :size="14" class="cf-select__chev" />
              </div>
            </div>
            <div class="cf-field" data-step="2">
              <label for="cf-tender">{{ fieldLabels.tender }}</label>
              <div class="cf-select">
                <select id="cf-tender" v-model="form.tender" name="tender">
                  <option value="">Choose one</option>
                  <option v-for="o in tenderOptions" :key="o" :value="o">{{ o }}</option>
                </select>
                <C4Glyph name="chevron" :size="14" class="cf-select__chev" />
              </div>
            </div>
          </template>
          <div class="cf-field cf-field--wide" data-step="2">
            <label for="cf-message">{{ f.message.label }} <span class="cf-req" aria-hidden="true">*</span></label>
            <textarea id="cf-message" v-model="form.message" name="message" rows="6" :placeholder="f.message.placeholder" required />
          </div>
        </div>

        <!-- Pinned to the bottom of the screen on phones (Phone-Screens 07). -->
        <div class="cf-bar">
          <button type="button" class="cf-next" @click="next">
            Continue<C4Glyph name="arrow" />
          </button>
          <C4Button type="submit" arrow class="cf-send">
            {{ state === 'submitting' ? messages.sending : f.submit }}
          </C4Button>
          <p class="cf-steps" aria-live="polite">
            Step {{ step }} of 2
            <button v-if="step === 2" type="button" class="cf-back" @click="step = 1">Back</button>
          </p>
        </div>

        <p class="cf-privacy">
          {{ privacyLine.before }}<NuxtLink :to="privacyLine.to">{{ privacyLine.link }}</NuxtLink>{{ privacyLine.after }}
        </p>
      </form>
    </template>
  </div>
</template>

<style scoped>
.cf {
  display: flex;
  flex-direction: column;
  gap: var(--s-24);
}

/* Tabs: a pill switch (board). */
.cf-tabs {
  display: inline-flex;
  align-self: flex-start;
  gap: var(--s-4);
  padding: var(--s-4);
  border-radius: var(--radius-pill);
  background: var(--mist);
}

.cf-tab {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 var(--s-24);
  border-radius: var(--radius-pill);
  font-size: 15px;
  color: var(--slate);
  transition: background-color var(--dur-ui) var(--ease-out), color var(--dur-ui) var(--ease-out);
}

.cf-tab[aria-selected='true'] {
  background: var(--white);
  box-shadow: 0 2px 8px rgba(16, 32, 104, 0.1);
  font-weight: 600;
  color: var(--ink);
}

.cf-form {
  display: flex;
  flex-direction: column;
  gap: var(--s-32);
}

.cf-intro {
  font-size: 16px;
  line-height: 1.6;
  color: var(--slate);
}

.cf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-24);
}

.cf-field {
  display: flex;
  flex-direction: column;
  gap: var(--s-8);
}

.cf-field--wide {
  grid-column: 1 / -1;
}

.cf-field label {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-2);
}

.cf-req {
  color: var(--amber-deep);
}

.cf-field input,
.cf-field select,
.cf-field textarea {
  width: 100%;
  min-height: 54px;
  padding: 0 var(--s-16);
  border-radius: var(--radius-field);
  border: 1px solid var(--line-2);
  background: var(--white);
  font: inherit;
  font-size: 16px;
  color: var(--ink);
  transition: border-color var(--dur-ui) var(--ease-out), box-shadow var(--dur-ui) var(--ease-out);
}

.cf-field textarea {
  min-height: 168px;
  padding: var(--s-16);
  line-height: 1.55;
  resize: vertical;
}

.cf-field ::placeholder {
  color: var(--grey);
}

.cf-field input:focus,
.cf-field select:focus,
.cf-field textarea:focus {
  outline: none;
  border-color: var(--indigo);
  box-shadow: 0 0 0 4px rgba(26, 58, 181, 0.16);
}

.cf-select {
  position: relative;
}

.cf-select select {
  appearance: none;
  padding-right: var(--s-48);
  cursor: pointer;
}

.cf-select__chev {
  position: absolute;
  right: var(--s-16);
  top: 50%;
  transform: translateY(-50%);
  color: var(--slate);
  pointer-events: none;
}

.cf-honey {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.cf-bar {
  display: flex;
  align-items: center;
  gap: var(--s-24);
}

.cf-next,
.cf-steps {
  display: none;
}

.cf-privacy {
  font-size: 14px;
  line-height: 1.6;
  color: var(--slate);
}

.cf-privacy a {
  /* A link inside a sentence: the padding gives it a 44 px tap area
     without moving the line. */
  display: inline-block;
  padding-block: 13px;
  margin-block: -13px;
  color: var(--indigo);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.cf-error {
  padding: var(--s-16) var(--s-24);
  border-radius: var(--radius-field);
  border: 1px solid var(--danger-line);
  background: var(--danger-bg);
  font-size: 15px;
  line-height: 1.55;
  color: var(--ink-2);
}

.cf-error__title {
  font-weight: 600;
  color: var(--danger);
}

.cf-done {
  display: flex;
  align-items: flex-start;
  gap: var(--s-16);
  padding: var(--s-24);
  border-radius: var(--radius-card);
  background: var(--paper);
  border: 1px solid var(--line);
}

.cf-done:focus {
  outline: none;
}

.cf-done__title {
  font-size: 19px;
  font-weight: 600;
  line-height: 1.35;
}

.cf-done__text {
  margin-top: var(--s-4);
  font-size: 16px;
  color: var(--slate);
}

/* --- Phones: two steps, the button pinned to the bottom ------------------- */
@media (max-width: 767px) {
  .cf-tabs {
    display: flex;
    align-self: stretch;
  }

  .cf-tab {
    flex: 1;
    justify-content: center;
    padding: 0 var(--s-12);
  }

  .cf-grid {
    grid-template-columns: 1fr;
    gap: var(--s-16);
  }

  .cf-bar {
    position: sticky;
    bottom: 0;
    z-index: 2;
    flex-direction: column;
    gap: var(--s-8);
    margin: 0 calc(-1 * var(--s-24));
    padding: var(--s-16) var(--s-24) calc(var(--s-16) + env(safe-area-inset-bottom));
    background: linear-gradient(180deg, rgba(255, 255, 255, 0), var(--white) 30%);
  }

  .cf-bar :deep(.c4-btn),
  .cf-next {
    width: 100%;
  }

  .cf-next {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-12);
    height: 54px;
    border-radius: var(--radius-pill);
    background: var(--amber-grad);
    box-shadow: var(--shadow-amber);
    font-size: 17px;
    font-weight: 600;
    color: var(--on-amber);
  }

  .cf-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-16);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--slate);
  }

  .cf-back {
    min-height: 44px;
    padding: 0 var(--s-8);
    font: inherit;
    color: var(--indigo);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>

<style>
/* Phones: one step at a time, only when JavaScript can move between them.
   Without JavaScript every field shows and the send button works. */
@media (max-width: 767px) {
  .c4-js .cf-form--step1 [data-step='2'],
  .c4-js .cf-form--step2 [data-step='1'],
  .c4-js .cf-form--step1 .cf-send {
    display: none;
  }

  .c4-js .cf-form--step2 .cf-next {
    display: none;
  }
}

@media (max-width: 767px) {
  html:not(.c4-js) .cf-next,
  html:not(.c4-js) .cf-steps {
    display: none;
  }
}
</style>
