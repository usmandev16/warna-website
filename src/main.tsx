import '@fontsource/poppins/latin-200.css'
import '@fontsource/poppins/latin-300.css'
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/poppins/latin-800.css'
import './styles/index.css'

import { LazyMotion } from 'motion/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { markPrerendered } from './lib/prerender'
import { LangProvider } from './providers/LangProvider'
import { ScrollProvider } from './providers/ScrollProvider'

const loadMotionFeatures = () => import('./lib/motionFeatures').then((module) => module.default)

const container = document.getElementById('root') as HTMLElement
markPrerendered(container.querySelector('[data-prerender]') !== null)

createRoot(container).render(
  <StrictMode>
    <LangProvider>
      <ScrollProvider>
        <LazyMotion features={loadMotionFeatures} strict>
          <App />
        </LazyMotion>
      </ScrollProvider>
    </LangProvider>
  </StrictMode>,
)
