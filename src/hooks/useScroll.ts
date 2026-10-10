import { createContext, useContext } from 'react'

export interface ScrollContextValue {
  scrollTo: (target: string | number) => void
  /** Pause page scrolling while an overlay (menu, viewer) is open. */
  setLocked: (locked: boolean) => void
}

export const ScrollContext = createContext<ScrollContextValue | null>(null)

export function useScroll(): ScrollContextValue {
  const value = useContext(ScrollContext)
  if (!value) throw new Error('useScroll must be used inside <ScrollProvider>')
  return value
}
