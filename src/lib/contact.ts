import type { FormCopy } from '../content/types'

export const FIELDS = ['name', 'mobile', 'email', 'position', 'company', 'projectType', 'message'] as const
export type Field = (typeof FIELDS)[number]
export type FormValues = Record<Field, string>
export type ErrorCode = 'required' | 'email' | 'mobile'
export type FormErrors = Partial<Record<Field, ErrorCode>>

export const REQUIRED: readonly Field[] = ['name', 'mobile', 'email', 'company']

export const emptyForm: FormValues = {
  name: '',
  mobile: '',
  email: '',
  position: '',
  company: '',
  projectType: '',
  message: '',
}

/** Convert Arabic-Indic and Persian digits to Western so either keyboard works. */
export function toWesternDigits(value: string): string {
  return value.replace(/[٠-٩۰-۹]/g, (d) => String((d.charCodeAt(0) & 0xf) % 10))
}

/** Saudi mobile numbers: 05XXXXXXXX, 5XXXXXXXX, +9665XXXXXXXX or 009665XXXXXXXX. */
export function isSaudiMobile(value: string): boolean {
  const digits = toWesternDigits(value).replace(/[\s\-()]/g, '')
  return /^(?:\+966|00966|966|0)?5\d{8}$/.test(digits)
}

export function validateField(field: Field, value: string): ErrorCode | undefined {
  const trimmed = value.trim()
  if (REQUIRED.includes(field) && !trimmed) return 'required'
  if (field === 'email' && trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return 'email'
  if (field === 'mobile' && trimmed && !isSaudiMobile(trimmed)) return 'mobile'
  return undefined
}

export function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  for (const field of FIELDS) {
    const error = validateField(field, values[field])
    if (error) errors[field] = error
  }
  return errors
}

function summary(values: FormValues, copy: FormCopy, projectLabel: string): string {
  const rows: [string, string][] = [
    [copy.name, values.name],
    [copy.mobile, toWesternDigits(values.mobile)],
    [copy.email, values.email],
    [copy.position, values.position],
    [copy.company, values.company],
    [copy.projectType, projectLabel],
  ]
  const lines = rows.filter(([, value]) => value.trim()).map(([label, value]) => `${label}: ${value.trim()}`)
  if (values.message.trim()) lines.push('', values.message.trim())
  return lines.join('\n')
}

export function buildMailto(to: string, values: FormValues, copy: FormCopy, projectLabel: string): string {
  const subject = `${copy.mailSubject} — ${values.company.trim() || values.name.trim()}`
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary(values, copy, projectLabel))}`
}

export function buildWhatsApp(number: string, values: FormValues, copy: FormCopy, projectLabel: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(summary(values, copy, projectLabel))}`
}
