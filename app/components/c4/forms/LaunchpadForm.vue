<script setup lang="ts">
/**
 * Launchpad: "Submit your idea" (content I2). The fields, in the content
 * file's order. The parent or guardian checkbox appears, and is required,
 * only when "Under 18" is chosen (I2 note: keep both protections).
 *
 * Sends through the same Web3Forms wiring as the contact form, with its
 * honeypot. Until the key is set (Phase 7), sending shows the error.
 */
import { messages } from '~/data/contact'
import { launchpadPage, youthMessages as msg } from '~/data/youth'

const f = launchpadPage.form
const L = f.fields

const form = reactive({
  name: '', email: '', phone: '', age: '', location: '', problem: '', idea: '',
  users: '', progress: '', own: false, guardian: false, botcheck: '',
})
const under18 = computed(() => form.age === f.under18)

const { state, isConfigured, submit } = useContactForm('Launchpad')
const formEl = ref<HTMLFormElement | null>(null)
const doneEl = ref<HTMLElement | null>(null)
const errorEl = ref<HTMLElement | null>(null)
const setupEl = ref<HTMLElement | null>(null)
useFieldMessages(formEl)

async function onSubmit() {
  if (!formEl.value?.reportValidity()) return
  const ok = await submit({
    form_type: 'Launchpad',
    subject: `Launchpad idea from ${form.name}`,
    name: form.name,
    email: form.email,
    phone: form.phone,
    age_range: form.age,
    location: form.location,
    problem: form.problem,
    idea: form.idea,
    users: form.users,
    progress: form.progress,
    own_idea: form.own ? 'Yes' : 'No',
    guardian_agreed: under18.value ? (form.guardian ? 'Yes' : 'No') : 'Not needed',
    botcheck: form.botcheck,
  })
  await nextTick()
  ;(ok ? doneEl : state.value === 'setup' ? setupEl : errorEl).value?.focus()
}
</script>

<template>
  <div>
    <p v-if="state === 'success'" ref="doneEl" class="c4f-done" role="status" tabindex="-1">
      <C4Icon name="sent" :size="40" />{{ msg.successTitle }}
    </p>

    <form v-else ref="formEl" class="c4f" novalidate @submit.prevent="onSubmit">
      <!-- No Web3Forms key in this build: say so, with the email route. -->
      <div v-if="!isConfigured" ref="setupEl" class="c4f-error c4f-setup" role="status" tabindex="-1">
        <p class="c4f-setup__title">{{ messages.setupTitle }}</p>
        <p>{{ messages.setupText }} <a :href="`mailto:${messages.setupEmail}`">{{ messages.setupEmail }}</a>.</p>
      </div>

      <div v-if="state === 'error'" ref="errorEl" class="c4f-error" role="alert" tabindex="-1">
        <p class="c4f-error__title">{{ msg.errorTitle }}</p>
        <p>{{ msg.errorText }}</p>
      </div>

      <div class="c4f-honey" aria-hidden="true">
        <label for="lp-botcheck">Leave this empty</label>
        <input id="lp-botcheck" v-model="form.botcheck" type="text" name="botcheck" tabindex="-1" autocomplete="off">
      </div>

      <div class="c4f-grid">
        <div class="c4f-field">
          <label for="lp-name">{{ L.name }} <span class="c4f-req" aria-hidden="true">*</span></label>
          <input id="lp-name" v-model="form.name" type="text" name="name" autocomplete="name" required>
        </div>
        <div class="c4f-field">
          <label for="lp-email">{{ L.email }} <span class="c4f-req" aria-hidden="true">*</span></label>
          <input id="lp-email" v-model="form.email" type="email" name="email" autocomplete="email" required>
        </div>
        <div class="c4f-field">
          <label for="lp-phone">{{ L.phone }}</label>
          <input id="lp-phone" v-model="form.phone" type="tel" name="phone" autocomplete="tel">
        </div>
        <div class="c4f-field">
          <label for="lp-age">{{ L.age }} <span class="c4f-req" aria-hidden="true">*</span></label>
          <div class="c4f-select">
            <select id="lp-age" v-model="form.age" name="age_range" required>
              <option value="" disabled>Choose one</option>
              <option v-for="o in f.ageOptions" :key="o" :value="o">{{ o }}</option>
            </select>
            <C4Glyph name="chevron" :size="14" />
          </div>
        </div>
        <div class="c4f-field c4f-field--wide">
          <label for="lp-location">{{ L.location }} <span class="c4f-req" aria-hidden="true">*</span></label>
          <input id="lp-location" v-model="form.location" type="text" name="location" autocomplete="address-level2" required>
        </div>
        <div class="c4f-field c4f-field--wide">
          <label for="lp-problem">{{ L.problem }} <span class="c4f-req" aria-hidden="true">*</span></label>
          <textarea id="lp-problem" v-model="form.problem" name="problem" rows="4" required />
        </div>
        <div class="c4f-field c4f-field--wide">
          <label for="lp-idea">{{ L.idea }} <span class="c4f-req" aria-hidden="true">*</span></label>
          <textarea id="lp-idea" v-model="form.idea" name="idea" rows="5" required />
        </div>
        <div class="c4f-field c4f-field--wide">
          <label for="lp-users">{{ L.users }} <span class="c4f-req" aria-hidden="true">*</span></label>
          <textarea id="lp-users" v-model="form.users" name="users" rows="3" required />
        </div>
        <div class="c4f-field c4f-field--wide">
          <label for="lp-progress">{{ L.progress }} <span class="c4f-hint">({{ f.progressHint }})</span></label>
          <textarea id="lp-progress" v-model="form.progress" name="progress" rows="3" />
        </div>
      </div>

      <div>
        <label class="c4f-check">
          <input v-model="form.own" type="checkbox" name="own_idea" required>
          <span>{{ L.own }} <span class="c4f-req" aria-hidden="true">*</span></span>
        </label>
        <label v-if="under18" class="c4f-check">
          <input v-model="form.guardian" type="checkbox" name="guardian_agreed" required>
          <span>{{ L.guardian }} <span class="c4f-req" aria-hidden="true">*</span></span>
        </label>
      </div>

      <div>
        <C4Button type="submit" arrow>{{ state === 'submitting' ? msg.sending : f.submit }}</C4Button>
      </div>

      <p class="c4f-small">
        <em>{{ f.smallPrint.text }}<NuxtLink :to="f.smallPrint.privacy.to">{{ f.smallPrint.privacy.label }}</NuxtLink>{{ f.smallPrint.and }}<NuxtLink :to="f.smallPrint.terms.to">{{ f.smallPrint.terms.label }}</NuxtLink>{{ f.smallPrint.end }}</em>
      </p>
    </form>
  </div>
</template>
