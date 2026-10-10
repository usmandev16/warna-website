import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Sparkle } from '../components/Marks'
import { Reveal } from '../components/Reveal'
import { RunningHeader } from '../components/RunningHeader'
import { useLang } from '../hooks/useLang'
import { useMediaQuery, useReducedMotion } from '../hooks/useMediaQuery'

const EASE = [0.22, 1, 0.36, 1] as const
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Desktop: a sticky numeral on one side while the four goals scroll past
 * on the other. Mobile: a plain vertical list.
 */
export function Goals() {
  const { t } = useLang()
  const desktop = useMediaQuery('(min-width: 64rem)')
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const itemRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (!desktop) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index))
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    itemRefs.current.forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [desktop])

  return (
    <section aria-labelledby="goals-title" className="defer-render relative pt-24 pb-24 md:pt-36 md:pb-32">
      <div className="page">
        <RunningHeader index="04" label={t.goals.label} />
        <h2 id="goals-title" className="sr-only">
          {t.goals.title}
        </h2>

        {desktop ? (
          <div className="grid-12 mt-10">
            <div className="col-span-5">
              <div className="sticky top-0 flex h-svh flex-col justify-center">
                <div className="t-numeral relative h-[1.05em] overflow-clip leading-none" aria-hidden="true">
                  <AnimatePresence initial={false} mode="popLayout">
                    <m.span
                      key={active}
                      className="absolute inset-x-0 top-0 block leading-none text-ember"
                      initial={{ transform: `translateY(${reduced ? '0%' : '100%'})`, opacity: reduced ? 0 : 1 }}
                      animate={{ transform: 'translateY(0%)', opacity: 1 }}
                      exit={{ transform: `translateY(${reduced ? '0%' : '-100%'})`, opacity: reduced ? 0 : 1 }}
                      transition={{ duration: reduced ? 0.2 : 0.9, ease: EASE }}
                    >
                      {pad(active + 1)}
                    </m.span>
                  </AnimatePresence>
                </div>
                <div className="mt-8 flex items-center gap-3" aria-hidden="true">
                  {t.goals.items.map((_, i) => (
                    <span
                      key={i}
                      className={`h-px w-14 ltr:origin-left rtl:origin-right transition-[scale,background-color] duration-500 ${i === active ? 'bg-ember' : 'scale-x-[0.4] bg-sand/25'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <ol className="col-span-6 col-start-7">
              {t.goals.items.map((goal, i) => (
                <li
                  key={goal.title}
                  ref={(node) => {
                    itemRefs.current[i] = node
                  }}
                  data-index={i}
                  className="flex min-h-[78svh] flex-col justify-center"
                >
                  {/* Inactive goals dim by colour, never below AA contrast. */}
                  <div
                    className={`transition-colors duration-700 ${i === active ? 'text-sand' : 'text-sand/60'}`}
                  >
                    <p className="t-index text-sand/60">[ {pad(i + 1)} ]</p>
                    <h3 className="t-h2 mt-5 flex items-center gap-4">
                      <Sparkle className="size-5 shrink-0 text-ember" />
                      {goal.title}
                    </h3>
                    <p className="t-lead mt-6">{goal.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <ol className="mt-12">
            {t.goals.items.map((goal, i) => (
              <Reveal as="li" key={goal.title} className="border-t border-sand/15 py-10">
                <p className="t-numeral text-[clamp(5rem,30vw,9rem)] text-ember" aria-hidden="true">
                  {pad(i + 1)}
                </p>
                <h3 className="t-h2 mt-4 text-sand">{goal.title}</h3>
                <p className="t-body mt-4 text-sand/80">{goal.body}</p>
              </Reveal>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
