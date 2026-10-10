import Lenis from 'lenis'
import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useFinePointer, useReducedMotion } from '../hooks/useMediaQuery'
import { ScrollContext } from '../hooks/useScroll'

/**
 * Lenis smooth scrolling for mouse users only. Touch devices and
 * reduced-motion users keep native scrolling.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reduced || !fine) return
    const instance = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 })
    let frame = requestAnimationFrame(function loop(time) {
      instance.raf(time)
      frame = requestAnimationFrame(loop)
    })
    lenisRef.current = instance
    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      lenisRef.current = null
    }
  }, [reduced, fine])

  const scrollTo = useCallback(
    (target: string | number) => {
      const lenis = lenisRef.current
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) })
        return
      }
      const top =
        typeof target === 'number'
          ? target
          : (document.querySelector<HTMLElement>(target)?.getBoundingClientRect().top ?? 0) + window.scrollY
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
    },
    [reduced],
  )

  const setLocked = useCallback(
    (locked: boolean) => {
      if (locked) lenisRef.current?.stop()
      else lenisRef.current?.start()
      document.documentElement.style.overflow = locked ? 'hidden' : ''
    },
    [],
  )

  const value = useMemo(() => ({ scrollTo, setLocked }), [scrollTo, setLocked])
  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
}
