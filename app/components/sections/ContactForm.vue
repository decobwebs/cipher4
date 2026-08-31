<script setup lang="ts">
import { industries } from '~/data/industries'
import { company } from '~/data/company'

const props = withDefaults(
  defineProps<{
    /** 'enquiry' is a general conversation; 'quote' is a procurement request. */
    variant?: 'enquiry' | 'quote'
  }>(),
  { variant: 'enquiry' },
)

const isQuote = computed(() => props.variant === 'quote')

const { state, errorMessage, isConfigured, submit, reset } = useContactForm(
  isQuote.value ? 'Quote request' : 'Website enquiry',
)

const form = reactive({
  name: '',
  email: '',
  company: '',
  phone: '',
  sector: '',
  subject: '',
  timeline: '',
  isTender: '',
  message: '',
  botcheck: '',
})

const formEl = ref<HTMLFormElement | null>(null)
const statusEl = ref<HTMLElement | null>(null)

async function onSubmit() {
  // Let the browser do the constraint validation first.
  if (!formEl.value?.reportValidity()) return

  const ok = await submit({ ...form, form_type: props.variant })

  if (ok) {
    Object.keys(form).forEach((k) => {
      form[k as keyof typeof form] = ''
    })
  }

  // Move focus to the status message so screen reader users hear the result.
  await nextTick()
  statusEl.value?.focus()
}
</script>

<template>
  <div class="form-wrap">
    <!-- Success replaces the form entirely: a cleared form with a toast above
         it reads as "did that work?" -->
    <div
      v-if="state === 'success'"
      ref="statusEl"
      class="success"
      tabindex="-1"
      role="status"
    >
      <div class="icon-plate icon-plate--lg success__icon">
        <Icon name="lucide:check" size="28" />
      </div>
      <h3 class="success__title">That's with us</h3>
      <p class="success__body">
        {{ company.responseTime }} If it is urgent, call
        {{ company.offices[0]?.phone }} and ask for the technical team.
      </p>
      <button type="button" class="btn btn--secondary mt-6" @click="reset()">
        Send another message
      </button>
    </div>

    <form
      v-else
      ref="formEl"
      class="form"
      novalidate
      @submit.prevent="onSubmit"
    >
      <!-- Honeypot -->
      <div class="field--honeypot" aria-hidden="true">
        <label>
          Do not fill this in
          <input v-model="form.botcheck" type="text" tabindex="-1" autocomplete="off">
        </label>
      </div>

      <div class="form__row">
        <div class="field">
          <label class="field__label" for="cf-name">
            Full name <span class="field__required" aria-hidden="true">*</span>
          </label>
          <input
            id="cf-name"
            v-model="form.name"
            class="field__control"
            type="text"
            name="name"
            autocomplete="name"
            required
          >
        </div>

        <div class="field">
          <label class="field__label" for="cf-email">
            Work email <span class="field__required" aria-hidden="true">*</span>
          </label>
          <input
            id="cf-email"
            v-model="form.email"
            class="field__control"
            type="email"
            name="email"
            autocomplete="email"
            required
          >
        </div>
      </div>

      <div class="form__row">
        <div class="field">
          <label class="field__label" for="cf-company">
            Company <span class="field__required" aria-hidden="true">*</span>
          </label>
          <input
            id="cf-company"
            v-model="form.company"
            class="field__control"
            type="text"
            name="company"
            autocomplete="organization"
            required
          >
        </div>

        <div class="field">
          <label class="field__label" for="cf-phone">Phone</label>
          <input
            id="cf-phone"
            v-model="form.phone"
            class="field__control"
            type="tel"
            name="phone"
            autocomplete="tel"
            inputmode="tel"
          >
        </div>
      </div>

      <div class="form__row">
        <div class="field">
          <label class="field__label" for="cf-sector">Sector</label>
          <select
            id="cf-sector"
            v-model="form.sector"
            class="field__control"
            name="sector"
          >
            <option value="">Select a sector</option>
            <option v-for="i in industries" :key="i.slug" :value="i.name">
              {{ i.name }}
            </option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div v-if="isQuote" class="field">
          <label class="field__label" for="cf-timeline">Timeline</label>
          <select
            id="cf-timeline"
            v-model="form.timeline"
            class="field__control"
            name="timeline"
          >
            <option value="">Select a timeline</option>
            <option value="Immediate">Immediate</option>
            <option value="Within 3 months">Within 3 months</option>
            <option value="3–6 months">3–6 months</option>
            <option value="Planning / budgeting">Planning or budgeting</option>
          </select>
        </div>

        <div v-else class="field">
          <label class="field__label" for="cf-subject">Subject</label>
          <input
            id="cf-subject"
            v-model="form.subject"
            class="field__control"
            type="text"
            name="subject"
          >
        </div>
      </div>

      <div v-if="isQuote" class="field">
        <label class="field__label" for="cf-tender">
          Is this part of a formal tender?
        </label>
        <select
          id="cf-tender"
          v-model="form.isTender"
          class="field__control"
          name="isTender"
        >
          <option value="">Select</option>
          <option value="Yes, formal tender">Yes, formal tender</option>
          <option value="Yes, RFQ or RFP">Yes, RFQ or RFP</option>
          <option value="No, direct engagement">No, direct engagement</option>
          <option value="Not yet decided">Not yet decided</option>
        </select>
        <p class="field__hint">
          Tells us whether to respond in your submission format and to your
          deadline.
        </p>
      </div>

      <div class="field">
        <label class="field__label" for="cf-message">
          {{ isQuote ? 'Scope of work' : 'What are you trying to fix?' }}
          <span class="field__required" aria-hidden="true">*</span>
        </label>
        <textarea
          id="cf-message"
          v-model="form.message"
          class="field__control"
          name="message"
          required
          :placeholder="
            isQuote
              ? 'What needs to be supplied, built or deployed, where, and by when.'
              : 'Describe the operational problem rather than the technology you think you need. It usually gets to a better answer faster.'
          "
        />
      </div>

      <div
        v-if="state === 'error'"
        ref="statusEl"
        class="notice notice--danger"
        tabindex="-1"
        role="alert"
      >
        <Icon name="lucide:alert-triangle" size="20" />
        <p>{{ errorMessage }}</p>
      </div>

      <div
        v-else-if="!isConfigured"
        class="notice"
        role="note"
      >
        <Icon name="lucide:info" size="20" />
        <p>
          <strong>Setup needed:</strong> add your Web3Forms access key to
          <code>.env</code> before launch, or this form cannot deliver.
        </p>
      </div>

      <div class="form__actions">
        <button
          type="submit"
          class="btn btn--accent btn--lg"
          :disabled="state === 'submitting'"
        >
          <Icon
            v-if="state === 'submitting'"
            name="lucide:loader-circle"
            size="18"
            class="spin"
          />
          {{
            state === 'submitting'
              ? 'Sending…'
              : isQuote
                ? 'Request a quote'
                : 'Send enquiry'
          }}
        </button>

        <p class="form__privacy">
          We use what you send here to reply to you, nothing else. See our
          <NuxtLink to="/privacy">privacy policy</NuxtLink>.
        </p>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form {
  display: grid;
  gap: var(--space-5);
}

.form__row {
  display: grid;
  gap: var(--space-5);
}

@media (min-width: 36rem) {
  .form__row {
    grid-template-columns: 1fr 1fr;
  }
}

.form__actions {
  display: grid;
  gap: var(--space-3);
  margin-block-start: var(--space-2);
}

.form__privacy {
  font-size: var(--fs-xs);
  color: var(--text-secondary);
}

.form__privacy a {
  color: var(--text-accent);
  text-decoration: underline;
}

.spin {
  animation: spin 900ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* --- Success ------------------------------------------------------------- */

.success {
  display: grid;
  justify-items: start;
  gap: var(--space-3);
  padding: var(--space-8);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background-color: var(--bg-raised);
}

.success:focus {
  outline: none;
}

.success__icon {
  background-color: var(--c4-success-bg);
  color: var(--c4-success);
}

.success__title {
  font-size: var(--fs-h3);
}

.success__body {
  color: var(--text-secondary);
  max-width: var(--measure);
}
</style>
