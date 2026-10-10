import { startTransition, useEffect, useState, type ReactNode } from 'react'
import type { ServiceId, WorkId } from '../content/types'
import { About } from './About'
import { Ambition } from './Ambition'
import { Contact, type ProjectPreset } from './Contact'
import { Goals } from './Goals'
import { Services } from './Services'
import { VisionMission } from './VisionMission'
import { Work } from './Work'

/** Runs `callback` when the main thread is idle; returns a cancel function. */
function whenIdle(callback: () => void): () => void {
  if ('requestIdleCallback' in window) {
    const handle = window.requestIdleCallback(callback, { timeout: 400 })
    return () => window.cancelIdleCallback(handle)
  }
  const handle = setTimeout(callback, 32)
  return () => clearTimeout(handle)
}

interface BelowFoldProps {
  preset: ProjectPreset | null
  onStart: (service: ServiceId) => void
  onOpen: (id: WorkId) => void
}

/**
 * The main content after the hero, loaded as its own chunk so the first paint
 * only waits for the header and hero.
 */
export default function BelowFold({ preset, onStart, onOpen }: BelowFoldProps) {
  const sections: ReactNode[] = [
    <About key="about" />,
    <VisionMission key="vision-mission" />,
    <Services key="services" onStart={onStart} />,
    <Work key="work" onOpen={onOpen} />,
    <div key="vision" id="vision">
      <Goals />
      <Ambition />
    </div>,
    <Contact key="contact" preset={preset} />,
  ]
  const [count, setCount] = useState(1)
  const complete = count >= sections.length

  // Mount one section per idle slot, so no single commit blocks the main thread.
  useEffect(() => {
    if (complete) return
    return whenIdle(() => startTransition(() => setCount((n) => n + 1)))
  }, [count, complete])

  // The page arrived with a section anchor (e.g. /#contact): jump once it exists.
  useEffect(() => {
    if (!complete) return
    const id = window.location.hash.slice(1)
    if (id && !id.includes('/')) document.getElementById(id)?.scrollIntoView()
  }, [complete])

  return <>{sections.slice(0, count)}</>
}
