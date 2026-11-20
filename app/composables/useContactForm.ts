/**
 * Form submission, for the contact, Launchpad and Scholarships forms
 * (plan, Phase 7). Posts to Web3Forms with the key from the environment:
 * NUXT_PUBLIC_WEB3FORMS_KEY, set by the owner (in .env locally, in Vercel
 * for the live site). Never written in the code.
 *
 *   idle         ready
 *   setup        no key in this build: nothing is sent, and the form shows
 *                "Setup needed" with the email address instead
 *   submitting   sending
 *   success      sent (also what a bot filling the honeypot is told)
 *   error        the send failed: the J2 error message
 */

export type FormState = 'idle' | 'setup' | 'submitting' | 'success' | 'error'

export function useContactForm(subjectPrefix: string) {
  const config = useRuntimeConfig()
  const state = ref<FormState>('idle')

  const accessKey = computed(() => String(config.public.web3formsKey || '').trim())
  const isConfigured = computed(() => accessKey.value.length > 0 && accessKey.value !== 'your-access-key-here')

  async function submit(fields: Record<string, string>) {
    // Honeypot: a person never fills the hidden field. A bot is told it
    // worked, and nothing is sent.
    if (fields.botcheck) {
      state.value = 'success'
      return true
    }
    if (!isConfigured.value) {
      state.value = 'setup'
      return false
    }

    state.value = 'submitting'
    try {
      const { botcheck: _unused, subject, ...rest } = fields
      const response = await $fetch<{ success: boolean }>('https://api.web3forms.com/submit', {
        method: 'POST',
        body: {
          access_key: accessKey.value,
          subject: `${subjectPrefix}: ${subject || 'New enquiry'}`,
          from_name: 'Cipher4 website',
          // Web3Forms' own spam check reads this field.
          botcheck: false,
          ...rest,
        },
      })
      state.value = response.success ? 'success' : 'error'
      return response.success
    }
    catch {
      state.value = 'error'
      return false
    }
  }

  function reset() {
    state.value = isConfigured.value ? 'idle' : 'setup'
  }

  return { state, isConfigured, submit, reset }
}
