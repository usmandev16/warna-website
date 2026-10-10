import { Sparkle } from './Marks'

interface RunningHeaderProps {
  index: string
  label: string
  className?: string
  /** Text colour role: sand on dark surfaces, ink on ember. */
  tone?: 'sand' | 'ink'
}

/**
 * The profile's editorial page header, reinterpreted per section:
 * index label, ✦ marker and section name, running out to a hairline.
 */
export function RunningHeader({ index, label, className, tone = 'sand' }: RunningHeaderProps) {
  const color = tone === 'ink' ? 'text-ink' : 'text-sand'
  const marker = tone === 'ink' ? 'text-ink' : 'text-ember'
  return (
    <div className={`flex items-center gap-4 ${color} ${className ?? ''}`}>
      <span className="t-index opacity-70">[ {index} ]</span>
      <Sparkle className={`size-3 shrink-0 ${marker}`} />
      <span className="t-label">{label}</span>
      <span className="hairline flex-1" aria-hidden="true" />
    </div>
  )
}
