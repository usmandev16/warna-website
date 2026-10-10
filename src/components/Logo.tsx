import { LOGO_PATHS, LOGO_VIEWBOX } from '../assets/brand/logo-paths'

interface LogoProps {
  className?: string
  /** Accessible name. Omit when the logo is decorative or already labelled. */
  label?: string
}

/**
 * The Mudawwana wordmark. Takes `currentColor`; use only the approved
 * pairings: ink on sand, sand on ember, ember on ink, sand on charcoal,
 * ember on sand, ink on ember. Keep it at least 96px wide on screen.
 */
export function Logo({ className, label }: LogoProps) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={className}
      fill="currentColor"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {LOGO_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

/** The guide's giant hairline wordmark, for decorative layers only. */
export function Watermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={`watermark ${className ?? ''}`}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      {LOGO_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
