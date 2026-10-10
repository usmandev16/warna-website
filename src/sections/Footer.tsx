import type { MouseEvent } from 'react'
import { Logo, Watermark } from '../components/Logo'
import { Arrow } from '../components/Marks'
import { SocialLinks } from '../components/SocialLinks'
import { site, socialHandle } from '../content/site'
import type { SectionId } from '../content/types'
import { useLang } from '../hooks/useLang'
import { useScroll } from '../hooks/useScroll'

const pad = (n: number) => String(n).padStart(2, '0')

export function Footer() {
  const { t } = useLang()
  const { scrollTo } = useScroll()

  const go = (target: SectionId | 'top') => (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    scrollTo(target === 'top' ? 0 : `#${target}`)
  }

  return (
    <footer className="defer-render relative isolate overflow-hidden bg-ink pt-24 md:pt-32">
      <div className="grain grain--soft" aria-hidden="true" />
      <div className="page relative">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 md:col-span-5">
            {/* Ember on ink: an approved pairing from the brand guide. */}
            <Logo className="w-[min(70vw,300px)] text-ember" label="مدونة" />
            <p className="t-small mt-8 max-w-[32ch] text-sand/70">{t.footer.tagline}</p>
          </div>

          <nav aria-label={t.ui.nav} className="col-span-6 md:col-span-3 md:col-start-7">
            <ul className="flex flex-col gap-3">
              {t.nav.map((item, i) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={go(item.id)} className="group inline-flex items-baseline gap-3 text-sand/85 hover:text-sand">
                    <span className="t-index text-ember/80">[{pad(i + 1)}]</span>
                    <span className="t-label link-underline">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-12 sm:col-span-6 md:col-span-3 md:col-start-10">
            <a href={`mailto:${site.email}`} className="t-small link-underline text-sand/85 [overflow-wrap:anywhere]" dir="ltr">
              {site.email}
            </a>
            <p className="t-small mt-3 text-sand/60">
              <bdi dir="ltr">{socialHandle}</bdi>
            </p>
            <SocialLinks className="mt-3" />
          </div>
        </div>

        <div className="hairline mt-20" aria-hidden="true" />
        <div className="flex flex-wrap items-center justify-between gap-4 py-6">
          <p className="t-small text-sand/60">
            © <span className="t-index text-[length:inherit]">{site.copyrightYear}</span> {t.footer.rights}
          </p>
          <a href="#top" onClick={go('top')} className="btn btn--ghost">
            {t.ui.backToTop}
            <Arrow className="size-4 rotate-90 ltr:-rotate-90" />
          </a>
        </div>
      </div>

      {/* The enormous cropped wordmark, as on the guide's section dividers. */}
      <div className="relative -mt-4 h-[22vw] overflow-hidden" aria-hidden="true">
        <Watermark className="-start-[4vw] -top-[13vw] w-[108vw] text-sand/[0.09]" />
      </div>
    </footer>
  )
}
