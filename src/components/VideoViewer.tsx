import { m } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { images } from '../assets/img/images.gen'
import { works, type WorkMedia } from '../content/site'
import type { WorkId } from '../content/types'
import { useLang } from '../hooks/useLang'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { useScroll } from '../hooks/useScroll'
import { Arrow } from './Marks'
import { Picture } from './Picture'

interface VideoViewerProps {
  workId: WorkId | null
  onClose: () => void
}

const drivePreview = (url: string) => url.replace(/\/view(\?.*)?$/, '/preview')

/**
 * Full-screen work viewer on a native <dialog>: the browser handles focus
 * trapping, Esc, and making the page behind it inert. The iframe only
 * mounts while the viewer is open.
 */
export function VideoViewer({ workId, onClose }: VideoViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { t } = useLang()
  const { setLocked } = useScroll()
  const reduced = useReducedMotion()
  const media = works.find((w) => w.id === workId)
  const copy = t.work.items.find((w) => w.id === workId)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (media && !dialog.open) {
      dialog.showModal()
      setLocked(true)
    } else if (!media && dialog.open) {
      dialog.close()
    }
  }, [media, setLocked])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleClose = () => {
      setLocked(false)
      onClose()
    }
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose, setLocked])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="viewer-title"
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto bg-ink p-0 text-sand backdrop:bg-ink/80"
    >
      {media && copy && (
        <m.div
          key={media.id}
          className="relative flex min-h-dvh flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <Picture
              image={media.image}
              alt=""
              sizes="50vw"
              className="absolute inset-0"
              imgClassName="size-full scale-125 object-cover opacity-45 blur-3xl"
            />
            <div className="absolute inset-0 bg-linear-to-b from-ink/60 via-ink/30 to-ink/70" />
          </div>
          <div className="grain grain--soft" aria-hidden="true" />
          <div className="page relative flex flex-1 flex-col gap-6 py-5 md:gap-8 md:py-8">
            <div className="flex items-center justify-between gap-4">
              <p className="t-index text-sand/70">{copy.category}</p>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => dialogRef.current?.close()}
                autoFocus
              >
                {t.ui.close}
                <span aria-hidden="true" className="t-index">
                  Esc
                </span>
              </button>
            </div>

            <div className="relative mx-auto my-auto w-full max-w-[min(100%,calc((100dvh-15rem)*16/9))]">
              <Player media={media} title={copy.title} />
            </div>

            <div className="glass grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center md:gap-8 md:px-7 md:py-5">
              <div>
                <h2 id="viewer-title" className="t-h3 text-sand">
                  {copy.title}
                </h2>
                <p className="t-small text-sand/75">{copy.description}</p>
              </div>
              <a
                href={media.drive}
                target="_blank"
                rel="noreferrer"
                className="t-small link-underline inline-flex items-center gap-2 justify-self-start text-sand"
              >
                {t.ui.openInDrive}
                <Arrow className="size-4" />
              </a>
            </div>
          </div>
        </m.div>
      )}
    </dialog>
  )
}

function Player({ media, title }: { media: WorkMedia; title: string }) {
  // A local file that fails to load (e.g. not added yet) falls back to Drive.
  const [failed, setFailed] = useState(false)
  if (media.mp4 && !failed) {
    return (
      <video
        className="aspect-video w-full bg-ink"
        src={media.mp4}
        controls
        autoPlay
        playsInline
        preload="auto"
        poster={images[media.image].webp[1]?.src}
        aria-label={title}
        onError={() => setFailed(true)}
      />
    )
  }
  return (
    <iframe
      src={drivePreview(media.drive)}
      title={title}
      className="aspect-video w-full border-0 bg-charcoal"
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  )
}
