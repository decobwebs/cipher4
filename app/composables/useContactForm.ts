/**
 * Contact form submission.
 *
 * The old site used a mailto: link, which opens the visitor's mail client and
 * loses most enquiries — people who are browsing on a phone, on a shared
 * machine, or in webmail simply abandon at that point. This posts directly to
 * Web3Forms and reports real success and failure states.
 *
 * Setup: put your access key in .env as NUXT_PUBLIC_WEB3FORMS_KEY.
 * Free key, no account needed: https://web3forms.com
 */

export type FormState = 'idle' | 'submitting' | 'success' | 'error'

export function useContactForm(subjectPrefix: string) {
  const config = useRuntimeConfig()
  const state = ref<FormState>('idle')
  const errorMessage = ref('')

  const accessKey = computed(() => config.public.web3formsKey as string)
  const isConfigured = computed(
    () => Boolean(accessKey.value) && accessKey.value !== 'your-access-key-here',
  )

  async function submit(fields: Record<string, string>) {
    // Honeypot: a real person never fills a hidden field.
    if (fields.botcheck) {
      state.value = 'success'
      return true
    }

    if (!isConfigured.value) {
      state.value = 'error'
      errorMessage.value =
        'This form is not connected yet. Please email us directly and we will pick it up straight away.'
      return false
    }

    state.value = 'submitting'
    errorMessage.value = ''

    try {
      const response = await $fetch<{ success: boolean; message?: string }>(
        'https://api.web3forms.com/submit',
        {
          method: 'POST',
          body: {
            access_key: accessKey.value,
            subject: `${subjectPrefix}: ${fields.subject || fields.company || 'New enquiry'}`,
            from_name: 'Cipher4 website',
            ...fields,
          },
        },
      )

      if (response.success) {
        state.value = 'success'
        return true
      }

      throw new Error(response.message || 'Submission was rejected')
    }
    catch (error) {
      state.value = 'error'
      errorMessage.value =
        error instanceof Error && error.message
          ? `We could not send that: ${error.message}. Please email us directly.`
          : 'We could not send that. Please check your connection, or email us directly.'
      return false
    }
  }

  function reset() {
    state.value = 'idle'
    errorMessage.value = ''
  }

  return { state, errorMessage, isConfigured, submit, reset }
}
