import { m, useScroll, useTransform } from 'motion/react'
import { useRef, useState, type ReactNode } from 'react'
import { PlayMark, Swoosh } from '../components/Marks'
import { HeroVideo } from '../components/HeroVideo'
import { useLang } from '../hooks/useLang'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { prerenderElapsed } from '../lib/prerender'

const EASE = [0.22, 1, 0.36, 1] as const

interface HeroLineProps {
  ready: boolean
  reduced: boolean
  delay?: number
  className?: string
  children: ReactNode
}

/**
 * One line of the tagline behind a mask. While the intro covers the page the
 * text is painted in place (so it counts for first paint); once the curtain
 * starts to lift, it remounts and rises out of its mask.
 */
function HeroLine({ ready, reduced, delay = 0, className, children }: HeroLineProps) {
  return (
    <span className={`line-mask ${className ?? ''}`}>
      <m.span
        key={ready ? 'reveal' : 'static'}
        className="block"
        initial={ready && !reduced ? { transform: 'translateY(105%)' } : false}
        animate={{ transform: 'translateY(0%)' }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </m.span>
    </span>
  )
}

interface HeroProps {
  /** False while the intro covers the page; entrance motion starts when it lifts. */
  ready: boolean
  onShowreel: () => void
}

export function Hero({ ready, onShowreel }: HeroProps) {
  const { t } = useLang()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const [elapsed] = useState(prerenderElapsed)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-12%'])

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative isolate h-svh min-h-[640px] overflow-hidden">
      <m.div className="absolute inset-0 -z-10" style={{ y: imageY }}>
        {/* CSS so the slow settle starts from the prerendered HTML, resumed by elapsed time. */}
        <div className="hero-settle size-full" style={{ animationDelay: `${-elapsed}ms` }}>
          <HeroVideo className="size-full object-cover" />
        </div>
      </m.div>

      {/* Darken toward the text: base of the frame and the reading-start side. */}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/55 to-transparent" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 from-ink/60 via-transparent to-transparent rtl:bg-linear-to-l ltr:bg-linear-to-r"
        aria-hidden="true"
      />
      <div className="grain" aria-hidden="true" />

      <m.div style={{ y: contentY }} className="page relative flex h-full flex-col justify-end pt-28 pb-6 md:pb-8">
        <h1 id="hero-title" className="t-display max-w-[14ch] text-sand ltr:max-w-[18ch]">
          <HeroLine ready={ready} reduced={reduced} className="font-light">
            {t.hero.lead}
          </HeroLine>{' '}
          <HeroLine ready={ready} reduced={reduced} delay={0.12}>
            {t.hero.line} <span className="text-ember">{t.hero.accent}</span>
          </HeroLine>
        </h1>
        {ready && <Swoosh className="mt-2 h-[clamp(14px,2vw,26px)] w-[min(78%,720px)] text-ember" delay={0.7} />}

        <m.div
          className="glass mt-10 grid items-center gap-4 px-5 py-4 md:mt-14 md:grid-cols-[1fr_auto_auto] md:gap-8 md:px-7"
          initial={{ opacity: 0, transform: `translateY(${reduced ? 0 : 20}px)` }}
          animate={ready ? { opacity: 1, transform: 'translateY(0px)' } : undefined}
          transition={{ duration: 1, delay: 0.9, ease: EASE }}
        >
          <p className="t-small max-w-[52ch] text-sand/85">{t.hero.positioning}</p>
          <button
            type="button"
            onClick={onShowreel}
            className="group inline-flex items-center gap-3 justify-self-start rounded-full pe-4 text-sand"
          >
            <PlayMark className="size-12 transition-transform duration-300 ease-[var(--ease-cine)] group-hover:scale-110" />
            <span className="t-label">{t.ui.playShowreel}</span>
          </button>
          <a href="#about" className="hidden items-center gap-3 text-sand/70 md:inline-flex">
            <span className="t-small">{t.ui.scroll}</span>
            <span className="relative h-10 w-px overflow-hidden bg-sand/20" aria-hidden="true">
              <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-ember" />
            </span>
          </a>
        </m.div>
      </m.div>
    </section>
  )
}
