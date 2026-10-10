import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Arrow } from '../components/Marks'
import { Picture } from '../components/Picture'
import { MaskLines, Reveal } from '../components/Reveal'
import { RunningHeader } from '../components/RunningHeader'
import { SocialLinks } from '../components/SocialLinks'
import { site, socialHandle } from '../content/site'
import type { ServiceId } from '../content/types'
import { useLang } from '../hooks/useLang'
import {
  buildMailto,
  buildWhatsApp,
  emptyForm,
  FIELDS,
  REQUIRED,
  validate,
  validateField,
  type Field,
  type FormErrors,
  type FormValues,
} from '../lib/contact'

export interface ProjectPreset {
  service: ServiceId
  /** Timestamp, so choosing the same service again still applies. */
  at: number
}

interface ContactProps {
  /** Service chosen elsewhere on the page (e.g. from the services list). */
  preset: ProjectPreset | null
}

export function Contact({ preset }: ContactProps) {
  const { t } = useLang()
  const copy = t.contact.form
  const formId = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<FormValues>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showSummary, setShowSummary] = useState(false)
  const [sent, setSent] = useState(false)

  const [appliedPreset, setAppliedPreset] = useState<ProjectPreset | null>(null)
  if (preset && preset !== appliedPreset) {
    setAppliedPreset(preset)
    setValues((current) => ({ ...current, projectType: preset.service }))
  }

  const projectLabel = t.services.items.find((s) => s.id === values.projectType)?.title ?? ''

  const update = (field: Field, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setSent(false)
    if (errors[field]) setErrors((current) => ({ ...current, [field]: validateField(field, value) }))
  }

  const blur = (field: Field) => {
    const error = validateField(field, values[field])
    setErrors((current) => ({ ...current, [field]: error }))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = validate(values)
    setErrors(next)
    const firstInvalid = FIELDS.find((field) => next[field])
    if (firstInvalid) {
      setShowSummary(true)
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    setShowSummary(false)
    window.location.assign(buildMailto(site.email, values, copy, projectLabel))
    setSent(true)
  }

  const fieldProps = (field: Field) => {
    const error = errors[field]
    const describedBy = [error ? `${formId}-${field}-error` : '', field === 'mobile' ? `${formId}-mobile-hint` : '']
      .filter(Boolean)
      .join(' ')
    return {
      id: `${formId}-${field}`,
      name: field,
      value: values[field],
      required: REQUIRED.includes(field),
      'aria-invalid': error ? true : undefined,
      'aria-describedby': describedBy || undefined,
      onBlur: () => blur(field),
    }
  }

  const label = (field: Field, text: string) => (
    <label htmlFor={`${formId}-${field}`} className="t-small mb-2 flex items-baseline gap-2 text-sand/80">
      {text}
      {!REQUIRED.includes(field) && <span className="text-sand/50">({copy.optional})</span>}
    </label>
  )

  const errorText = (field: Field) => {
    const code = errors[field]
    if (!code) return null
    return (
      <p id={`${formId}-${field}-error`} className="t-small mt-2 text-ember-80">
        {copy.errors[code]}
      </p>
    )
  }

  const hasErrors = FIELDS.some((field) => errors[field])

  return (
    <section id="contact" aria-labelledby="contact-title" className="defer-render relative isolate overflow-hidden pt-24 pb-28 md:pt-36 md:pb-40">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Picture
          image="photoCrewNight"
          alt=""
          sizes="100vw"
          className="block size-full"
          imgClassName="size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-linear-to-b from-ink via-ink/50 to-ink" />
      </div>
      <div className="grain" aria-hidden="true" />

      <div className="page relative">
        <RunningHeader index="05" label={t.contact.label} />
        <h2 id="contact-title" className="t-display mt-14 md:mt-20">
          <MaskLines text={t.contact.title} key={t.lang} />
        </h2>
        <Reveal>
          <p className="t-lead mt-6 max-w-[40ch] text-sand/85">{t.contact.intro}</p>
        </Reveal>

        <div className="grid-12 mt-14 gap-y-12 md:mt-20">
          <Reveal className="col-span-12 lg:col-span-8">
            <form ref={formRef} noValidate onSubmit={submit} className="glass p-6 md:p-10">
              <div aria-live="assertive" className={showSummary && hasErrors ? 'mb-6' : ''}>
                {showSummary && hasErrors && (
                  <p role="alert" className="t-small rounded-[12px] bg-ember/15 px-4 py-3 text-sand">
                    {copy.errors.summary}
                  </p>
                )}
              </div>

              <div className="grid gap-x-6 gap-y-7 md:grid-cols-2">
                <Row>
                  {label('name', copy.name)}
                  <input {...fieldProps('name')} type="text" autoComplete="name" className="field" onChange={(e) => update('name', e.target.value)} />
                  {errorText('name')}
                </Row>
                <Row>
                  {label('mobile', copy.mobile)}
                  <input
                    {...fieldProps('mobile')}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    className="field text-start rtl:text-right"
                    onChange={(e) => update('mobile', e.target.value)}
                  />
                  <p id={`${formId}-mobile-hint`} className="t-small mt-2 text-sand/55">
                    {copy.mobileHint}
                  </p>
                  {errorText('mobile')}
                </Row>
                <Row>
                  {label('email', copy.email)}
                  <input
                    {...fieldProps('email')}
                    type="email"
                    autoComplete="email"
                    dir="ltr"
                    className="field rtl:text-right"
                    onChange={(e) => update('email', e.target.value)}
                  />
                  {errorText('email')}
                </Row>
                <Row>
                  {label('position', copy.position)}
                  <input {...fieldProps('position')} type="text" autoComplete="organization-title" className="field" onChange={(e) => update('position', e.target.value)} />
                </Row>
                <Row>
                  {label('company', copy.company)}
                  <input {...fieldProps('company')} type="text" autoComplete="organization" className="field" onChange={(e) => update('company', e.target.value)} />
                  {errorText('company')}
                </Row>
                <Row>
                  {label('projectType', copy.projectType)}
                  <div className="relative">
                    <select {...fieldProps('projectType')} className="field appearance-none pe-10" onChange={(e) => update('projectType', e.target.value)}>
                      <option value="">{copy.projectTypePlaceholder}</option>
                      {t.services.items.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.title}
                        </option>
                      ))}
                    </select>
                    <svg
                      viewBox="0 0 12 8"
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 end-4 w-3 -translate-y-1/2 text-sand/60"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M1 1.5 6 6.5l5-5" />
                    </svg>
                  </div>
                </Row>
                <Row wide>
                  {label('message', copy.message)}
                  <textarea {...fieldProps('message')} rows={5} className="field resize-y" onChange={(e) => update('message', e.target.value)} />
                </Row>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <button type="submit" className="btn btn--ember">
                  {copy.submit}
                  <Arrow className="size-4" />
                </button>
                {site.whatsapp && (
                  <a
                    href={buildWhatsApp(site.whatsapp, values, copy, projectLabel)}
                    target="_blank"
                    rel="noreferrer"
                    className="t-small link-underline text-sand/85"
                  >
                    {copy.whatsapp}
                  </a>
                )}
              </div>
              <div aria-live="polite">
                {sent && (
                  <p className="t-small mt-6 text-sand/80">
                    {copy.sent}{' '}
                    <a href={`mailto:${site.email}`} className="link-underline text-sand" dir="ltr">
                      {site.email}
                    </a>
                  </p>
                )}
              </div>
            </form>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-3 lg:col-start-10 lg:pt-4" delay={0.1}>
            <aside className="flex flex-col gap-8">
              <div>
                <p className="t-index text-sand/55">{t.contact.direct}</p>
                <a href={`mailto:${site.email}`} className="link-underline mt-3 inline-block text-[length:var(--text-lead)] font-medium lg:text-[length:var(--text-body)] text-sand [overflow-wrap:anywhere]" dir="ltr">
                  {site.email}
                </a>
                {site.phone && (
                  <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="mt-2 block text-[length:var(--text-lead)] font-medium lg:text-[length:var(--text-body)] text-sand" dir="ltr">
                    {site.phone}
                  </a>
                )}
              </div>
              <div>
                <p className="t-index text-sand/55">{t.contact.socials}</p>
                <p className="mt-3 text-[length:var(--text-lead)] font-medium lg:text-[length:var(--text-body)] text-sand">
                  <bdi dir="ltr">{socialHandle}</bdi>
                </p>
                <SocialLinks className="mt-3" />
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Row({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return <div className={wide ? 'md:col-span-2' : undefined}>{children}</div>
}
