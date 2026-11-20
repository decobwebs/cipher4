/**
 * The J2 field messages for a form's native checks: "Please fill in this
 * field." and "Please enter a valid email address." They replace the
 * browser's own wording (which varies by browser and language), and clear
 * as soon as the field is corrected. Used by every form on the site.
 */
import type { Ref } from 'vue'
import { messages } from '~/data/contact'

type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

function message(el: Field): string {
  const v = el.validity
  if (v.valueMissing) return messages.missing
  if (v.typeMismatch && el.type === 'email') return messages.invalidEmail
  return ''
}

export function useFieldMessages(form: Ref<HTMLFormElement | null>) {
  const onInvalid = (e: Event) => {
    const el = e.target as Field
    el.setCustomValidity('')
    const m = message(el)
    if (m) el.setCustomValidity(m)
    el.setAttribute('aria-invalid', 'true')
  }
  const onInput = (e: Event) => {
    const el = e.target as Field
    el.setCustomValidity('')
    if (el.checkValidity()) el.removeAttribute('aria-invalid')
  }
  onMounted(() => {
    form.value?.addEventListener('invalid', onInvalid, true)
    form.value?.addEventListener('input', onInput, true)
    form.value?.addEventListener('change', onInput, true)
  })
  onBeforeUnmount(() => {
    form.value?.removeEventListener('invalid', onInvalid, true)
    form.value?.removeEventListener('input', onInput, true)
    form.value?.removeEventListener('change', onInput, true)
  })
}
