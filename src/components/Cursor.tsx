import { AnimatePresence, m, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useFinePointer, useReducedMotion } from '../hooks/useMediaQuery'

/**
 * A cursor label for elements marked `data-cursor="…"` (e.g. "شاهد" over
 * work tiles). Mouse users only; purely decorative, the element itself
 * stays the accessible control.
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const springX = useSpring(x, { stiffness: 380, damping: 36, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 380, damping: 36, mass: 0.6 })
  const [label, setLabel] = useState<string | null>(null)
  const enabled = fine && !reduced

  useEffect(() => {
    if (!enabled) return
    document.documentElement.dataset.cursorActive = ''
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      const target = (event.target as Element | null)?.closest<HTMLElement>('[data-cursor]')
      setLabel(target?.dataset.cursor ?? null)
    }
    const onLeave = () => setLabel(null)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      delete document.documentElement.dataset.cursorActive
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60]"
      style={{ x: springX, y: springY }}
    >
      <AnimatePresence>
        {label && (
          <m.span
            key="label"
            className="absolute grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ember text-ink t-label"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {label}
          </m.span>
        )}
      </AnimatePresence>
    </m.div>
  )
}
