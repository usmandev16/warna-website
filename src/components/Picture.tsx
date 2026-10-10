import { images, type ImageName } from '../assets/img/images.gen'
import type { ImageSource } from '../assets/img/types'

interface PictureProps {
  image: ImageName
  alt: string
  /** The `sizes` attribute: how wide the image renders at each breakpoint. */
  sizes: string
  className?: string
  imgClassName?: string
  /** Above-the-fold imagery: eager, high fetch priority. */
  priority?: boolean
  /** Blurred placeholder behind the image; off for transparent cut-outs. */
  placeholder?: boolean
}

const srcSet = (sources: ImageSource[]) => sources.map((s) => `${s.src} ${s.width}w`).join(', ')

export function Picture({
  image,
  alt,
  sizes,
  className,
  imgClassName,
  priority = false,
  placeholder = true,
}: PictureProps) {
  const data = images[image]
  const fallback = data.webp[Math.min(1, data.webp.length - 1)]
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(data.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(data.webp)} sizes={sizes} />
      <img
        src={fallback.src}
        alt={alt}
        width={data.width}
        height={data.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        className={imgClassName}
        style={
          placeholder
            ? { backgroundImage: `url(${data.placeholder})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
      />
    </picture>
  )
}
