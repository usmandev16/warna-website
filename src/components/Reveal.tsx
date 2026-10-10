import { m, useInView } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useReducedMotion } from '../hooks/useMediaQuery'

const EASE = [0.22, 1, 0.36, 1] as const
const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  /** Vertical travel in px. */
  y?: number
  as?: 'div' | 'li' | 'p' | 'span'
}

/** Fades and lifts content in once, the first time it enters the viewport. */
export function Reveal({ children, className, delay = 0, y = 28, as = 'div' }: RevealProps) {
  const reduced = useReducedMotion()
  const Tag = m[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, transform: `translateY(${reduced ? 0 : y}px)` }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={VIEWPORT}
      transition={{ duration: reduced ? 0.4 : 1, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

/**
 * Line breaks depend on the web font, so wait until the element's own face
 * is loaded. `document.fonts.status` is not enough: faces load lazily on
 * first use, so a weight may not even have started downloading yet.
 */
function useFontReady(ref: RefObject<HTMLElement | null>, text: string): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    let active = true
    const style = getComputedStyle(node)
    const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    const done = () => active && setReady(true)
    document.fonts.load(font, text).then(done, done)
    return () => {
      active = false
    }
  }, [ref, text])
  return ready
}

interface MaskLinesProps {
  text: string
  className?: string
  /** Seconds between lines. */
  stagger?: number
  /** Animate on mount rather than on scroll into view. */
  immediate?: boolean
  delay?: number
  /** A word or phrase to set in ember wherever it falls. */
  accent?: string
}

function withAccent(line: string, accent?: string): ReactNode {
  if (!accent || !line.includes(accent)) return line
  const [before, ...rest] = line.split(accent)
  return (
    <>
      {before}
      <span className="text-ember">{accent}</span>
      {rest.join(accent)}
    </>
  )
}

/**
 * Splits text into its rendered lines and reveals each from behind a mask.
 * Lines are measured after layout, so Arabic shaping and wrapping stay
 * native. If the width changes later, it falls back to plain flowing text
 * rather than re-splitting (and re-animating) lines. Give it a `key` that
 * changes with the text (e.g. the language) so it re-measures from scratch.
 */
export function MaskLines({
  text,
  className,
  stagger = 0.09,
  immediate = false,
  delay = 0,
  accent,
}: MaskLinesProps) {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLSpanElement>(null)
  const [lines, setLines] = useState<string[] | null>(null)
  const [plain, setPlain] = useState(false)
  const fontsReady = useFontReady(rootRef, text)
  // Observe the container: the line spans themselves start clipped by their
  // masks, so they would never register as visible.
  const inView = useInView(rootRef, VIEWPORT)
  // Measuring forces layout, so only do it once the text is about to be seen.
  const near = useInView(rootRef, { once: true, margin: '50% 0px 50% 0px' })
  const play = immediate || inView
  const words = text.split(/\s+/)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !fontsReady || !(near || immediate) || lines !== null || plain) return
    const grouped: string[][] = []
    let lastTop = Number.NEGATIVE_INFINITY
    root.querySelectorAll<HTMLSpanElement>('[data-word]').forEach((span) => {
      if (span.offsetTop - lastTop > 2) grouped.push([])
      grouped[grouped.length - 1].push(span.textContent?.trim() ?? '')
      lastTop = span.offsetTop
    })
    setLines(grouped.map((group) => group.join(' ')))
  }, [lines, plain, fontsReady, near, immediate])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    let width = root.clientWidth
    const observer = new ResizeObserver(() => {
      if (Math.abs(root.clientWidth - width) < 1) return
      width = root.clientWidth
      setPlain(true)
    })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  if (reduced) {
    return (
      <Reveal as="span" className={`block ${className ?? ''}`} y={0}>
        {withAccent(text, accent)}
      </Reveal>
    )
  }

  return (
    <span ref={rootRef} className={`relative block ${className ?? ''}`}>
      {plain ? (
        withAccent(text, accent)
      ) : lines === null ? (
        <span className="block opacity-0" aria-hidden="true">
          {words.map((word, i) => (
            <span key={i} data-word>
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
      ) : (
        <>
          <span className="sr-only">{text}</span>
          <span aria-hidden="true" className="block">
            {lines.map((line, i) => (
              <span key={`${i}-${line}`} className="line-mask">
                <m.span
                  className="block"
                  initial={{ transform: 'translateY(105%)' }}
                  animate={play ? { transform: 'translateY(0%)' } : undefined}
                  transition={{ duration: 1.1, delay: delay + i * stagger, ease: EASE }}
                >
                  {withAccent(line, accent)}
                </m.span>
              </span>
            ))}
          </span>
        </>
      )}
    </span>
  )
}
