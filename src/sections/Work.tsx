import { PlayMark } from '../components/Marks'
import { Picture } from '../components/Picture'
import { Reveal } from '../components/Reveal'
import { RunningHeader } from '../components/RunningHeader'
import { works, type WorkMedia } from '../content/site'
import type { WorkCopy, WorkId } from '../content/types'
import { useLang } from '../hooks/useLang'

interface WorkProps {
  onOpen: (id: WorkId) => void
}

/** Three films as staggered cinematic tiles: one wide lead, two offset 16:9. */
export function Work({ onOpen }: WorkProps) {
  const { t } = useLang()
  const [lead, ...rest] = works

  return (
    <section id="work" aria-labelledby="work-title" className="defer-render relative pt-24 pb-32 md:pt-36 md:pb-48">
      <div className="page">
        <RunningHeader index="03" label={t.work.label} />
        <div className="mt-14 flex items-end justify-between gap-6 md:mt-20">
          <Reveal>
            <h2 id="work-title" className="t-h1">
              {t.work.title}
            </h2>
          </Reveal>
          <p className="t-index pb-3 text-sand/60">
            {String(works.length).padStart(2, '0')}
          </p>
        </div>

        <div className="mt-12 md:mt-20">
          <Tile media={lead} onOpen={onOpen} ratio="aspect-[4/3] sm:aspect-video lg:aspect-[21/9]" sizes="(min-width: 90rem) 1440px, 100vw" />
        </div>

        <div className="grid-12 mt-16 gap-y-16 md:mt-24">
          {rest.map((media, i) => (
            <div
              key={media.id}
              className={
                i === 0
                  ? 'col-span-12 md:col-span-7'
                  : 'col-span-12 md:col-span-6 md:col-start-7 md:mt-48'
              }
            >
              <Tile media={media} onOpen={onOpen} ratio="aspect-video" sizes="(min-width: 48rem) 58vw, 100vw" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface TileProps {
  media: WorkMedia
  onOpen: (id: WorkId) => void
  ratio: string
  sizes: string
}

function Tile({ media, onOpen, ratio, sizes }: TileProps) {
  const { t } = useLang()
  const copy = t.work.items.find((item) => item.id === media.id) as WorkCopy
  return (
    <Reveal y={48}>
      <article>
        <button
          type="button"
          onClick={() => onOpen(media.id)}
          data-cursor={t.ui.watch}
          aria-label={`${t.ui.watch}: ${copy.title}`}
          className={`group relative block w-full overflow-hidden bg-charcoal ${ratio}`}
        >
          <Picture
            image={media.image}
            alt={copy.alt}
            sizes={sizes}
            className="absolute inset-0 block"
            imgClassName="size-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-cine)] group-hover:scale-[1.04]"
          />
          <span className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" aria-hidden="true" />
          <span className="glass glass--pill t-small absolute top-4 start-4 px-4 py-2 text-sand md:top-6 md:start-6">
            {copy.category}
          </span>
          <PlayMark className="absolute bottom-4 end-4 size-14 transition-transform duration-300 group-hover:scale-110 md:bottom-6 md:end-6 md:size-16 hide-with-cursor" />
        </button>
        <div className="mt-5 flex items-baseline justify-between gap-6">
          <h3 className="t-h3 text-sand">{copy.title}</h3>
          {media.year && <p className="t-index shrink-0 text-sand/60">{media.year}</p>}
        </div>
      </article>
    </Reveal>
  )
}
