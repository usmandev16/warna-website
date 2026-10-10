const SESSION_KEY = 'mudawwana:intro-seen'

/** The intro plays once per browser session, never under reduced motion. */
export function shouldPlayIntro(reduced: boolean): boolean {
  if (reduced) return false
  try {
    return window.sessionStorage.getItem(SESSION_KEY) !== '1'
  } catch {
    return true
  }
}

export function rememberIntro() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    // Storage unavailable: the intro may simply replay next visit.
  }
}
