<script setup lang="ts">
/**
 * Scholarships: register interest (content I3 status block). Email and
 * area of interest. Same Web3Forms wiring and honeypot as the other forms.
 */
import { scholarshipsPage, youthMessages as msg } from '~/data/youth'

const s = scholarshipsPage.status
const form = reactive({ email: '', area: '', botcheck: '' })

const { state, submit } = useContactForm('Scholarships')
const formEl = ref<HTMLFormElement | null>(null)
const doneEl = ref<HTMLElement | null>(null)
const errorEl = ref<HTMLElement | null>(null)

async function onSubmit() {
  if (!formEl.value?.reportValidity()) return
  const ok = await submit({
    form_type: 'Scholarship interest',
    subject: 'Scholarship interest',
    email: form.email,
    area: form.area,
    botcheck: form.botcheck,
  })
  await nextTick()
  ;(ok ? doneEl : errorEl).value?.focus()
}
</script>

<template>
  <div>
    <p v-if="state === 'success'" ref="doneEl" class="c4f-done" role="status" tabindex="-1">
      <C4Icon name="sent" :size="40" />{{ msg.successTitle }}
    </p>

    <form v-else ref="formEl" class="c4f" novalidate @submit.prevent="onSubmit">
      <div v-if="state === 'error'" ref="errorEl" class="c4f-error" role="alert" tabindex="-1">
        <p class="c4f-error__title">{{ msg.errorTitle }}</p>
        <p>{{ msg.errorText }}</p>
      </div>

      <div class="c4f-honey" aria-hidden="true">
        <label for="si-botcheck">Leave this empty</label>
        <input id="si-botcheck" v-model="form.botcheck" type="text" name="botcheck" tabindex="-1" autocomplete="off">
      </div>

      <div class="c4f-grid">
        <div class="c4f-field">
          <label for="si-email">{{ s.fields.email }} <span class="c4f-req" aria-hidden="true">*</span></label>
          <input id="si-email" v-model="form.email" type="email" name="email" autocomplete="email" required>
        </div>
        <div class="c4f-field">
          <label for="si-area">{{ s.fields.area }}</label>
          <div class="c4f-select">
            <select id="si-area" v-model="form.area" name="area">
              <option value="">Choose one</option>
              <option v-for="o in s.areaOptions" :key="o" :value="o">{{ o }}</option>
            </select>
            <C4Glyph name="chevron" :size="14" />
          </div>
        </div>
      </div>

      <div>
        <C4Button type="submit" arrow>{{ state === 'submitting' ? msg.sending : s.submit }}</C4Button>
      </div>
    </form>
  </div>
</template>
