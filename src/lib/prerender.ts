let prerendered = false

/** Called once in main.tsx, before React replaces the build-time markup. */
export function markPrerendered(value: boolean) {
  prerendered = value
}

/**
 * Milliseconds the static first screen has already been on display. The
 * intro's CSS animations resume from here instead of restarting when React
 * takes over the prerendered markup.
 */
export function prerenderElapsed(): number {
  return prerendered && typeof performance !== 'undefined' ? performance.now() : 0
}
