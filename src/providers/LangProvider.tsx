import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ar } from '../content/ar'
import { en } from '../content/en'
import type { Content, Lang } from '../content/types'
import { LangContext } from '../hooks/useLang'

const STORAGE_KEY = 'mudawwana:lang'
const dictionaries: Record<Lang, Content> = { ar, en }

function readStoredLang(): Lang {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'ar'
  } catch {
    return 'ar'
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readStoredLang)
  const t = dictionaries[lang]

  useEffect(() => {
    const root = document.documentElement
    root.lang = t.lang
    root.dir = t.dir
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Storage unavailable (e.g. private mode): the choice just isn't remembered.
    }
  }, [lang, t])

  const toggle = useCallback(() => setLang((current) => (current === 'ar' ? 'en' : 'ar')), [])
  const value = useMemo(() => ({ lang, t, toggle }), [lang, t, toggle])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
