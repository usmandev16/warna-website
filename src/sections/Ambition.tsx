import { m, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Watermark } from '../components/Logo'
import { Sparkle } from '../components/Marks'
import { Picture } from '../components/Picture'
import { MaskLines, Reveal } from '../components/Reveal'
import { useLang } from '../hooks/useLang'
import { useReducedMotion } from '../hooks/useMediaQuery'

/**
 * The signature spread: a solid ember field, with Riyadh's skyline at dusk
 * rising out of its bottom edge — its orange sky melts into the ember.
 */
export function Ambition() {
  const { t } = useLang()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const skylineY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['10%', '0%'])
  const markY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-6%', '6%'])

  return (
    <section
      ref={ref}
      aria-labelledby="ambition-title"
      className="on-ember defer-render relative isolate overflow-hidden bg-ember text-ink"
    >
      <m.div style={{ y: markY }} className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <Watermark className="-top-[8%] -start-[20%] w-[130%] text-ink/[0.08]" />
      </m.div>
      <div className="grain grain--soft" aria-hidden="true" />

      <div className="page relative z-10 pt-24 md:pt-36">
        <div className="grid-12 gap-y-10">
          <Reveal className="col-span-12 lg:col-span-5">
            <h2 id="ambition-title" className="t-h1 flex flex-wrap items-center gap-x-4 text-ink">
              <Sparkle className="size-[0.45em] shrink-0" />
              {t.ambition.title}
            </h2>
          </Reveal>
          <p className="t-lead col-span-12 text-ink lg:col-span-7 lg:mt-3">
            <MaskLines text={t.ambition.body} key={t.lang} stagger={0.05} />
          </p>
        </div>
      </div>

      <div className="relative -mt-4 aspect-[4/5] overflow-hidden sm:aspect-[3/2] md:-mt-10 lg:-mt-24" aria-hidden="true">
        <m.div style={{ y: skylineY }} className="absolute inset-0">
          <Picture
            image="photoKingdomCentre"
            alt=""
            sizes="100vw"
            className="block size-full"
            imgClassName="size-full object-cover object-bottom"
          />
        </m.div>
        <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-ember via-ember/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-ink to-transparent" />
      </div>
    </section>
  )
}
