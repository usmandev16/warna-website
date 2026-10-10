import { m } from 'motion/react'
import { useEffect, useState } from 'react'
import { SWOOSH } from '../assets/brand/marks'
import { Logo } from '../components/Logo'
import { rememberIntro } from '../lib/intro'
import { prerenderElapsed } from '../lib/prerender'

const HOLD_MS = 950

interface LoaderProps {
  /** The curtain starts to lift: time to start the hero's entrance. */
  onLift: () => void
  /** The curtain is gone. */
  onDone: () => void
}

/**
 * ≤1.6s intro, once per session: the wordmark wipes in, the ember swoosh
 * draws beneath it, and the curtain lifts. Any click or key skips it.
 *
 * The wipe and the swoosh are CSS animations so they run from the
 * prerendered HTML before any JavaScript; when React takes over they
 * continue from the elapsed time rather than restarting.
 */
export function Loader({ onLift, onDone }: LoaderProps) {
  const [elapsed] = useState(prerenderElapsed)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (leaving) onLift()
  }, [leaving, onLift])

  useEffect(() => {
    rememberIntro()
    const timer = window.setTimeout(() => setLeaving(true), Math.max(0, HOLD_MS - elapsed))
    const skip = () => setLeaving(true)
    window.addEventListener('pointerdown', skip)
    window.addEventListener('keydown', skip)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
    }
  }, [elapsed])

  return (
    <m.div
      aria-hidden="true"
      data-intro
      className="fixed inset-0 z-[90] grid place-items-center bg-ink"
      initial={false}
      animate={{ transform: leaving ? 'translateY(-100%)' : 'translateY(0%)' }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => leaving && onDone()}
    >
      <div className="grain" />
      <div className="relative flex w-[min(56vw,320px)] flex-col items-center gap-3">
        <div className="intro-wipe w-full text-ember" style={{ animationDelay: `${-elapsed}ms` }}>
          <Logo className="w-full" />
        </div>
        <svg
          viewBox={SWOOSH.viewBox}
          className="intro-draw h-3 w-4/5 text-ember"
          style={{ animationDelay: `${350 - elapsed}ms` }}
          fill="currentColor"
          preserveAspectRatio="none"
          focusable="false"
        >
          <path d={SWOOSH.d} />
        </svg>
      </div>
    </m.div>
  )
}
