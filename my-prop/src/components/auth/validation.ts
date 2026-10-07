const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateEmail(value: string): string | undefined {
  const email = value.trim()
  if (!email) return "Email is required."
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address."
  return undefined
}

export function validatePassword(
  value: string,
  minLength?: number
): string | undefined {
  if (!value) return "Password is required."
  if (minLength && value.length < minLength) {
    return `Password must be at least ${minLength} characters.`
  }
  return undefined
}

export function validateRequired(
  value: string,
  label: string
): string | undefined {
  return value.trim() ? undefined : `${label} is required.`
}

/** Moves focus to the first invalid control once React has re-rendered. */
export function focusFirstInvalid(form: HTMLFormElement) {
  requestAnimationFrame(() => {
    form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  })
}

export function hasErrors(errors: Record<string, string | undefined>) {
  return Object.values(errors).some(Boolean)
}
