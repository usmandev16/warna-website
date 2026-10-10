import { lazy, startTransition, Suspense, useCallback, useEffect, useState } from 'react'
import { Cursor } from './components/Cursor'
import { works } from './content/site'
import type { ServiceId, WorkId } from './content/types'
import { useReducedMotion } from './hooks/useMediaQuery'
import { useScroll } from './hooks/useScroll'
import { shouldPlayIntro } from './lib/intro'
import { prerenderElapsed } from './lib/prerender'
import type { ProjectPreset } from './sections/Contact'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Loader } from './sections/Loader'

const BelowFold = lazy(() => import('./sections/BelowFold'))
const Footer = lazy(() => import('./sections/Footer').then((module) => ({ default: module.Footer })))
const VideoViewer = lazy(() =>
  import('./components/VideoViewer').then((module) => ({ default: module.VideoViewer })),
)

const WORK_HASH = /^#work\/([\w-]+)$/

function workFromHash(): WorkId | null {
  if (typeof window === 'undefined') return null
  const match = window.location.hash.match(WORK_HASH)
  return works.find((w) => w.id === match?.[1])?.id ?? null
}

export default function App() {
  const reduced = useReducedMotion()
  const { scrollTo } = useScroll()
  // Skip the intro if the static curtain has already cleared itself (slow devices).
  const [intro, setIntro] = useState(() => shouldPlayIntro(reduced) && prerenderElapsed() < 2400)
  const [heroReady, setHeroReady] = useState(!intro)
  const startHero = useCallback(() => setHeroReady(true), [])
  const [openWork, setOpenWork] = useState<WorkId | null>(workFromHash)
  const [preset, setPreset] = useState<ProjectPreset | null>(null)
  const [rest, setRest] = useState(false)

  // Render everything below the hero after first paint, as an interruptible
  // transition so it doesn't block the main thread.
  useEffect(() => {
    const frame = requestAnimationFrame(() => startTransition(() => setRest(true)))
    return () => cancelAnimationFrame(frame)
  }, [])

  // Keep the viewer in sync with the URL (#work/<id>), including Back/Forward.
  useEffect(() => {
    const sync = () => setOpenWork(workFromHash())
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  const open = useCallback((id: WorkId) => {
    window.history.pushState(null, '', `#work/${id}`)
    setOpenWork(id)
  }, [])

  const close = useCallback(() => {
    if (WORK_HASH.test(window.location.hash)) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    setOpenWork(null)
  }, [])

  const startProject = useCallback(
    (service: ServiceId) => {
      setPreset({ service, at: Date.now() })
      scrollTo('#contact')
    },
    [scrollTo],
  )

  return (
    <>
      {intro && <Loader onLift={startHero} onDone={() => setIntro(false)} />}
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero ready={heroReady} onShowreel={() => open(works[0].id)} />
        {rest && (
          <Suspense fallback={null}>
            <BelowFold preset={preset} onStart={startProject} onOpen={open} />
          </Suspense>
        )}
      </main>
      {rest && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
      {(rest || openWork) && (
        <Suspense fallback={null}>
          <VideoViewer workId={openWork} onClose={close} />
        </Suspense>
      )}
      <Cursor />
    </>
  )
}
