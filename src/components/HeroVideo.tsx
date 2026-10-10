import { useEffect, useRef } from 'react'
import { heroVideo } from '../content/site'
import { useReducedMotion } from '../hooks/useMediaQuery'

/**
 * Silent background loop for the hero. The first frame is the poster, so a
 * slow connection, a refused autoplay or reduced motion all show the still.
 * Small screens get the 720p file; playback pauses while off screen.
 */
export function HeroVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (reduced) return
    // React sets `muted` as a property only; set it before playing so autoplay is allowed.
    video.muted = true
    const play = () => video.play().catch(() => {
      // Autoplay refused (e.g. data saver): the poster stays.
    })
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : video.pause()))
    observer.observe(video)
    return () => observer.disconnect()
  }, [reduced])

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      poster={heroVideo.poster}
      autoPlay={!reduced}
      preload={reduced ? 'none' : 'auto'}
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={heroVideo.small} type="video/mp4" media="(max-width: 47.99rem)" />
      <source src={heroVideo.large} type="video/mp4" />
    </video>
  )
}
