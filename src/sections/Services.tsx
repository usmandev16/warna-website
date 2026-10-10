import { AnimatePresence, m, useMotionValue, useSpring } from 'motion/react'
import { useId, useRef, useState, type PointerEvent } from 'react'
import { Arrow } from '../components/Marks'
import { Picture } from '../components/Picture'
import { Reveal } from '../components/Reveal'
import { RunningHeader } from '../components/RunningHeader'
import { serviceImages } from '../content/site'
import type { ServiceCopy, ServiceId } from '../content/types'
import { useLang } from '../hooks/useLang'
import { useFinePointer, useMediaQuery, useReducedMotion } from '../hooks/useMediaQuery'

const EASE = [0.22, 1, 0.36, 1] as const
const pad = (n: number) => String(n).padStart(2, '0')

interface ServicesProps {
  /** Pre-selects the service in the contact form and scrolls there. */
  onStart: (service: ServiceId) => void
}

/**
 * An editorial index rather than a card grid. On desktop a cropped image
 * follows the cursor over the hovered row; on smaller screens each row
 * opens as an accordion.
 */
export function Services({ onStart }: ServicesProps) {
  const { t } = useLang()
  const desktop = useMediaQuery('(min-width: 64rem)')

  return (
    <section id="services" aria-labelledby="services-title" className="defer-render relative pt-24 pb-32 md:pt-36 md:pb-44">
      <div className="page">
        <RunningHeader index="02" label={t.services.label} />
        <Reveal>
          <h2 id="services-title" className="t-h1 mt-14 max-w-[12ch] md:mt-20 lg:ms-[calc(100%/12*1)]">
            {t.services.title}
          </h2>
        </Reveal>
        {desktop ? (
          <DesktopList items={t.services.items} onStart={onStart} />
        ) : (
          <MobileList items={t.services.items} onStart={onStart} />
        )}
      </div>
    </section>
  )
}

interface ListProps {
  items: ServiceCopy[]
  onStart: (service: ServiceId) => void
}

function DesktopList({ items, onStart }: ListProps) {
  const { t } = useLang()
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const listRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState<ServiceId | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 160, damping: 26 })
  const springY = useSpring(y, { stiffness: 160, damping: 26 })
  const follow = fine && !reduced

  const onMove = (event: PointerEvent<HTMLUListElement>) => {
    const rect = listRef.current?.getBoundingClientRect()
    if (!rect) return
    x.set(event.clientX - rect.left)
    y.set(event.clientY - rect.top)
  }

  /** Without a following cursor (keyboard, reduced motion) anchor the image to the row's end. */
  const placeAtRow = (row: HTMLElement) => {
    const list = listRef.current?.getBoundingClientRect()
    if (!list) return
    const box = row.getBoundingClientRect()
    const end = document.documentElement.dir === 'rtl' ? 0.14 : 0.86
    x.jump(box.left - list.left + box.width * end)
    y.jump(box.top - list.top + box.height / 2)
  }

  return (
    <ul
      ref={listRef}
      className="relative mt-16 border-b border-sand/15"
      onPointerMove={follow ? onMove : undefined}
      onPointerLeave={() => setActive(null)}
    >
      {items.map((item, i) => (
        <li key={item.id} className="border-t border-sand/15">
          <button
            type="button"
            onPointerEnter={(event) => {
              setActive(item.id)
              if (!follow) placeAtRow(event.currentTarget)
            }}
            onFocus={(event) => {
              setActive(item.id)
              placeAtRow(event.currentTarget)
            }}
            onBlur={() => setActive(null)}
            onClick={() => onStart(item.id)}
            className="group grid-12 relative w-full items-baseline py-9 text-start transition-colors duration-300 xl:py-11"
          >
            <span className="t-index col-span-1 text-sand/60 transition-colors duration-300 group-hover:text-ember group-focus-visible:text-ember">
              [ {pad(i + 1)} ]
            </span>
            <span className="t-h2 col-span-6 text-sand transition-transform duration-500 ease-[var(--ease-cine)] rtl:group-hover:-translate-x-3 ltr:group-hover:translate-x-3">
              {item.title}
            </span>
            <span className="t-body col-span-4 text-sand/70">{item.description}</span>
            <span className="sr-only">{t.ui.cta}</span>
            <span className="col-span-1 justify-self-end text-sand/50 transition-colors duration-300 group-hover:text-ember">
              <Arrow className="size-6" />
            </span>
          </button>
        </li>
      ))}

      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-10"
        style={{ x: springX, y: springY }}
      >
        <AnimatePresence>
          {active && (
            <m.div
              key={active}
              className="absolute h-[200px] w-[300px] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-charcoal xl:h-[240px] xl:w-[360px]"
              initial={{ clipPath: 'inset(50% 0 50% 0)', opacity: 0 }}
              animate={{ clipPath: 'inset(0% 0 0% 0)', opacity: 1 }}
              exit={{ clipPath: 'inset(50% 0 50% 0)', opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Picture
                image={serviceImages[active]}
                alt=""
                sizes="360px"
                className="block size-full"
                imgClassName="size-full scale-110 object-cover"
              />
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </ul>
  )
}

function MobileList({ items, onStart }: ListProps) {
  const { t } = useLang()
  const [open, setOpen] = useState<ServiceId | null>(null)
  const baseId = useId()

  return (
    <ul className="mt-12 border-b border-sand/15">
      {items.map((item, i) => {
        const expanded = open === item.id
        const panelId = `${baseId}-${item.id}`
        return (
          <li key={item.id} className="border-t border-sand/15">
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : item.id)}
                className="flex w-full items-baseline gap-4 py-6 text-start"
              >
                <span className={`t-index ${expanded ? 'text-ember' : 'text-sand/60'}`}>[ {pad(i + 1)} ]</span>
                <span className="t-h3 flex-1 font-black text-sand">{item.title}</span>
                <span aria-hidden="true" className="relative size-4 shrink-0 self-center">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                  <span
                    className={`absolute inset-y-0 left-1/2 w-px bg-current transition-opacity duration-300 ${expanded ? 'opacity-0' : ''}`}
                  />
                </span>
              </button>
            </h3>
            <div id={panelId} hidden={!expanded}>
              {expanded && (
                <m.div
                  initial={{ opacity: 0, transform: 'translateY(12px)' }}
                  animate={{ opacity: 1, transform: 'translateY(0px)' }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <div className="pb-8">
                    <p className="t-body text-sand/75">{item.description}</p>
                    <Picture
                      image={serviceImages[item.id]}
                      alt=""
                      sizes="100vw"
                      className="mt-5 block aspect-[16/10] overflow-hidden bg-charcoal"
                      imgClassName="size-full object-cover"
                    />
                    <button type="button" className="btn btn--ghost mt-5" onClick={() => onStart(item.id)}>
                      {t.ui.cta}
                      <Arrow className="size-4" />
                    </button>
                  </div>
                </m.div>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
