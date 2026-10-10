import { m } from 'motion/react'
import { useId } from 'react'
import { SPARKLE, SWOOSH } from '../assets/brand/marks'
import { useReducedMotion } from '../hooks/useMediaQuery'

/** The four-pointed ✦ used as the section-title marker in the profile. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox={SPARKLE.viewBox} className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d={SPARKLE.d} />
    </svg>
  )
}

interface SwooshProps {
  className?: string
  /** Seconds before the stroke starts drawing. */
  delay?: number
}

/** The hand-drawn ember underline from the profile cover, drawn on with a wipe. */
export function Swoosh({ className, delay = 0 }: SwooshProps) {
  const id = useId()
  const reduced = useReducedMotion()
  const [, , width, height] = SWOOSH.viewBox.split(' ').map(Number)
  return (
    <svg
      viewBox={SWOOSH.viewBox}
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <defs>
        <clipPath id={id}>
          <m.rect
            x="0"
            y="0"
            height={height}
            initial={{ width: reduced ? width : 0 }}
            animate={{ width }}
            transition={{ duration: 1.1, delay, ease: [0.65, 0, 0.35, 1] }}
          />
        </clipPath>
      </defs>
      <path d={SWOOSH.d} clipPath={`url(#${id})`} />
    </svg>
  )
}

/** Solid ember disc with an ink triangle, as on the profile's work pages. */
export function PlayMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="32" fill="var(--color-ember)" />
      <path d="M26 21.5v21a1.5 1.5 0 0 0 2.3 1.27l16.8-10.5a1.5 1.5 0 0 0 0-2.54L28.3 20.23A1.5 1.5 0 0 0 26 21.5Z" fill="var(--color-ink)" />
    </svg>
  )
}

/** Small directional arrow. Points toward reading-end; mirrored in LTR via .flip-ltr. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`flip-ltr ${className ?? ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 12H4M10 6l-6 6 6 6" />
    </svg>
  )
}
