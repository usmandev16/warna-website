import { m, useMotionValueEvent, useScroll as useScrollProgress } from 'motion/react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Logo, Watermark } from '../components/Logo'
import type { SectionId } from '../content/types'
import { useLang } from '../hooks/useLang'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { useScroll } from '../hooks/useScroll'

const EASE = [0.22, 1, 0.36, 1] as const
const pad = (n: number) => String(n).padStart(2, '0')

export function Header() {
  const { t, toggle } = useLang()
  const { scrollTo, setLocked } = useScroll()
  const reduced = useReducedMotion()
  const { scrollY } = useScrollProgress()
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDialogElement>(null)

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0
    setHidden(current > 160 && current > previous + 2)
    if (current < previous - 2) setHidden(false)
  })

  useEffect(() => {
    const dialog = menuRef.current
    if (!dialog) return
    if (menuOpen && !dialog.open) {
      dialog.showModal()
      setLocked(true)
    }
    if (!menuOpen && dialog.open) dialog.close()
  }, [menuOpen, setLocked])

  const go = (id: SectionId | 'top') => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (menuRef.current?.open) {
      menuRef.current.close()
      setLocked(false)
    }
    scrollTo(id === 'top' ? 0 : `#${id}`)
  }

  return (
    <>
      <a href="#main" className="skip-link btn btn--ember">
        {t.ui.skip}
      </a>

      <m.header
        className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-4"
        animate={{ transform: hidden && !menuOpen ? 'translateY(-120%)' : 'translateY(0%)' }}
        transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
      >
        <div className="page">
          <div className="glass glass--pill flex h-16 bg-ink/60 items-center justify-between gap-4 ps-6 pe-2 md:ps-7">
            <a href="#top" onClick={go('top')} aria-label={t.ui.home} className="shrink-0 py-3 text-ember">
              <Logo className="w-[104px]" />
            </a>

            <nav aria-label={t.ui.nav} className="hidden lg:block">
              <ul className="flex items-center gap-1 xl:gap-2">
                {t.nav.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={go(item.id)}
                      className="group flex items-baseline gap-2 rounded-full px-3 py-2 text-sand/80 transition-colors duration-200 hover:text-sand xl:px-4"
                    >
                      <span className="t-index text-ember/90">[{pad(i + 1)}]</span>
                      <span className="t-label link-underline">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-1.5 md:gap-2">
              <LangToggle onClick={toggle} />
              <a href="#contact" onClick={go('contact')} className="btn btn--ember hidden sm:inline-flex">
                {t.ui.cta}
              </a>
              <button
                type="button"
                className="btn btn--ghost aspect-square px-0 lg:hidden"
                aria-label={t.ui.menuOpen}
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                onClick={() => setMenuOpen(true)}
              >
                <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
                  <span className="h-px w-full bg-current" />
                  <span className="h-px w-3/5 bg-current" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </m.header>

      <dialog
        id="site-menu"
        ref={menuRef}
        aria-label={t.ui.menuOpen}
        onClose={() => {
          setMenuOpen(false)
          setLocked(false)
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-ink p-0 text-sand"
      >
        {menuOpen && (
          <div className="relative flex h-full flex-col">
            <div className="grain" aria-hidden="true" />
            <Watermark className="-bottom-[6vh] -end-[30vw] w-[140vw] text-sand/[0.07]" />
            <div className="page flex h-16 items-center justify-between pt-3 md:pt-4">
              <span className="text-ember">
                <Logo className="w-[104px]" />
              </span>
              <div className="flex items-center gap-2">
                <LangToggle onClick={toggle} />
                <button type="button" className="btn btn--ghost" onClick={() => setMenuOpen(false)} autoFocus>
                  {t.ui.menuClose}
                </button>
              </div>
            </div>
            <nav aria-label={t.ui.nav} className="page relative mt-auto mb-10">
              <ul className="flex flex-col">
                {t.nav.map((item, i) => (
                  <m.li
                    key={item.id}
                    initial={{ opacity: 0, transform: `translateY(${reduced ? 0 : 24}px)` }}
                    animate={{ opacity: 1, transform: 'translateY(0px)' }}
                    transition={{ duration: 0.7, delay: 0.06 * i, ease: EASE }}
                    className="border-t border-sand/15 last:border-b"
                  >
                    <a href={`#${item.id}`} onClick={go(item.id)} className="flex items-baseline gap-4 py-4">
                      <span className="t-index text-ember">[{pad(i + 1)}]</span>
                      <span className="t-h1">{item.label}</span>
                    </a>
                  </m.li>
                ))}
              </ul>
              <a href="#contact" onClick={go('contact')} className="btn btn--ember mt-8 w-full sm:hidden">
                {t.ui.cta}
              </a>
            </nav>
          </div>
        )}
      </dialog>
    </>
  )
}

function LangToggle({ onClick }: { onClick: () => void }) {
  const { t, lang } = useLang()
  const target = lang === 'ar' ? 'en' : 'ar'
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn--ghost px-4"
      lang={target}
    >
      <span className={target === 'en' ? 't-index' : 't-label'}>{t.ui.switchLang}</span>
      <span className="sr-only">{t.ui.switchLangLabel}</span>
    </button>
  )
}
