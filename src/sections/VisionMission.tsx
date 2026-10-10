import { m, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Sparkle } from '../components/Marks'
import { Picture } from '../components/Picture'
import { Reveal } from '../components/Reveal'
import type { TitledText } from '../content/types'
import { useLang } from '../hooks/useLang'
import { useReducedMotion } from '../hooks/useMediaQuery'

/** Two glass panels floating over a full-bleed Saudi desert at golden hour. */
export function VisionMission() {
  const { t } = useLang()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-8%', '8%'])

  return (
    <section
      ref={ref}
      aria-label={t.vision.label}
      className="defer-render relative isolate overflow-hidden py-32 md:py-48"
    >
      <m.div style={{ y: imageY }} className="absolute -inset-y-[10%] inset-x-0 -z-10" aria-hidden="true">
        <Picture
          image="photoHisma"
          alt=""
          sizes="100vw"
          className="block size-full"
          imgClassName="size-full object-cover object-[50%_60%]"
        />
      </m.div>
      {/* Fade into the ink sections above and below; darken behind the panels. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-ink via-ink/30 to-ink" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/25" />
      <div className="grain grain--soft" aria-hidden="true" />

      <div className="page relative z-10">
        <div className="grid-12 gap-y-6">
          <Panel
            item={t.vision.vision}
            className="col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-1"
          />
          <Panel
            item={t.vision.mission}
            delay={0.12}
            className="col-span-12 md:col-span-6 md:mt-40 lg:col-span-5 lg:col-start-7 lg:mt-56"
          />
        </div>
      </div>

    </section>
  )
}

function Panel({ item, className, delay = 0 }: { item: TitledText; className?: string; delay?: number }) {
  return (
    <Reveal className={className} delay={delay}>
      <article className="glass bg-ink/55 p-7 md:p-10">
        <h3 className="flex items-center gap-3 text-ember">
          <Sparkle className="size-5 shrink-0" />
          <span className="t-h2">{item.title}</span>
        </h3>
        <p className="t-lead mt-5 text-sand/90">{item.body}</p>
      </article>
    </Reveal>
  )
}
