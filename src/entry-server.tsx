import { domAnimation, LazyMotion } from 'motion/react'
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { LangProvider } from './providers/LangProvider'
import { ScrollProvider } from './providers/ScrollProvider'

/**
 * Build-time render of the first screen (intro curtain, header, hero) into
 * index.html, so it paints before any JavaScript runs. See scripts/prerender.mjs.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <LangProvider>
        <ScrollProvider>
          <LazyMotion features={domAnimation} strict>
            <App />
          </LazyMotion>
        </ScrollProvider>
      </LangProvider>
    </StrictMode>,
  )
}
