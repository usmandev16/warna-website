import { m, useScroll, useTransform } from 'motion/react'
import { useRef, type MouseEvent } from 'react'
import { Arrow, Sparkle } from '../components/Marks'
import { Picture } from '../components/Picture'
import { MaskLines, Reveal } from '../components/Reveal'
import { RunningHeader } from '../components/RunningHeader'
import { useLang } from '../hooks/useLang'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { useScroll as useSmoothScroll } from '../hooks/useScroll'

/**
 * An editorial spread: the manifesto beside a framed portrait photograph,
 * with an offset ember hairline behind it and a glass caption over it.
 */
export function About() {
  const { t, lang } = useLang()
  const reduced = useReducedMotion()
  const { scrollTo } = useSmoothScroll()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-7%', '7%'])
  const frameY = useTransform(scrollYProgress, [0, 1], reduced ? ['0px', '0px'] : ['24px', '-24px'])

  const toServices = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scrollTo('#services')
  }

  return (
    <section
      ref={ref}
      id="about"
      aria-labelledby="about-title"
      className="defer-render relative overflow-hidden pt-24 pb-32 md:pt-40 md:pb-48"
    >
      <div className="page">
        <RunningHeader index="01" label={t.about.label} />

        <div className="grid-12 mt-14 items-center gap-y-16 md:mt-20">
          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <h2 id="about-title" className="t-h1 text-sand">
                {t.about.title}
              </h2>
            </Reveal>
            <p className="mt-8 text-[clamp(1.35rem,1rem+1.2vw,2.15rem)] leading-[1.75] font-light text-sand/90 md:mt-10">
              <MaskLines
                text={t.about.body}
                accent={lang === 'ar' ? 'مدونة' : 'Mudawwana'}
                key={t.lang}
                stagger={0.06}
              />
            </p>

            <Reveal delay={0.1}>
              <ul className="mt-10 flex flex-wrap gap-2.5 md:mt-14" aria-label={t.services.label}>
                {t.services.items.map((service) => (
                  <li key={service.id}>
                    <a
                      href="#services"
                      onClick={toServices}
                      className="t-small inline-flex items-center gap-2 rounded-full border border-sand/15 px-4 py-2 text-sand/80 transition-colors duration-300 hover:border-ember/60 hover:text-sand"
                    >
                      <Sparkle className="size-2 text-ember" />
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-4 lg:col-start-9" y={48}>
            <figure className="relative mx-auto max-w-[460px]">
              {/* Offset ember hairline frame, drifting slightly against the photo. */}
              <m.span
                aria-hidden="true"
                style={{ y: frameY }}
                className="absolute inset-0 translate-x-4 translate-y-4 border border-ember/50 rtl:-translate-x-4"
              />
              <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
                <m.div className="absolute -inset-y-[9%] inset-x-0" style={{ y: imageY }}>
                  <Picture
                    image="photoCameraRock"
                    alt=""
                    sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 66vw, 92vw"
                    className="block size-full"
                    imgClassName="size-full object-cover object-[38%_55%]"
                  />
                </m.div>
                <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/10 to-transparent" aria-hidden="true" />
                <div className="grain grain--soft" aria-hidden="true" />

                <figcaption className="glass glass--pill absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 px-5 py-3 md:inset-x-5 md:bottom-5">
                  <span className="t-small flex items-center gap-2 text-sand">
                    <Sparkle className="size-3 text-ember" />
                    {t.hero.lead}
                  </span>
                  <Arrow className="size-4 text-sand/70" />
                </figcaption>
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
