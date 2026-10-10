import { createContext, useContext } from 'react'
import type { Content, Lang } from '../content/types'

export interface LangContextValue {
  lang: Lang
  t: Content
  toggle: () => void
}

export const LangContext = createContext<LangContextValue | null>(null)

export function useLang(): LangContextValue {
  const value = useContext(LangContext)
  if (!value) throw new Error('useLang must be used inside <LangProvider>')
  return value
}
