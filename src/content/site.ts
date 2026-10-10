import type { ImageName } from '../assets/img/images.gen'
import type { ServiceId, WorkId } from './types'

/*
 * Facts that are not language-specific. Anything marked TODO(client) was not
 * in the client PDFs and must be confirmed before launch. `null` hides the
 * item from the page instead of showing a placeholder.
 */

export const site = {
  // TODO(client): confirm domain. Taken from the brand guide stationery mockups (p.22–23).
  url: 'https://www.mudawwanah.sa',
  // TODO(client): confirm address. Taken from the brand guide stationery mockups (p.22–23).
  email: 'info@mudawwanah.sa',
  // TODO(client): phone in international format, e.g. '+966 5X XXX XXXX'.
  phone: null as string | null,
  // TODO(client): WhatsApp number, digits only, e.g. '9665XXXXXXXX'.
  whatsapp: null as string | null,
  // TODO(client): commercial registration number and address, if they should appear.
  commercialRegistration: null as string | null,
  address: null as string | null,
  copyrightYear: 2026,
}

export interface Social {
  id: string
  label: string
  // TODO(client): profile URLs. The handle @Mudawwanah appears in the brand guide (p.34).
  url: string | null
}

export const socials: Social[] = [
  { id: 'x', label: 'X', url: null },
  { id: 'instagram', label: 'Instagram', url: null },
  { id: 'linkedin', label: 'LinkedIn', url: null },
  { id: 'youtube', label: 'YouTube', url: null },
]

export const socialHandle = '@Mudawwanah'

export interface WorkMedia {
  id: WorkId
  image: ImageName
  /** Google Drive share link, as given in the company profile. */
  drive: string
  /** Local file in /public/media; the viewer falls back to Drive if it's missing. */
  mp4?: string
  // TODO(client): year of each film.
  year: number | null
}

export const works: WorkMedia[] = [
  {
    id: 'ramadan',
    image: 'workRamadan',
    drive: 'https://drive.google.com/file/d/1p2FIr5xle0IjqYJ8z2Q8DL15gVSBJzv_/view',
    mp4: '/media/ramadan.mp4',
    year: null,
  },
  {
    id: 'education',
    image: 'workEducation',
    drive: 'https://drive.google.com/file/d/1lU2wCh8l-cLFheLf5vcj__Vl4NsMUlIE/view',
    mp4: '/media/education.mp4',
    year: null,
  },
  {
    id: 'cricket',
    image: 'workCricket',
    drive: 'https://drive.google.com/file/d/1X0L0B9vc1cq0yLO3mmDNbFTi_AAJLKrZ/view',
    mp4: '/media/cricket.mp4',
    year: null,
  },
]

/** Silent background loop for the hero: cinema lens focus pull (Mixkit, free licence). */
export const heroVideo = {
  poster: '/media/hero-loop-poster.jpg',
  small: '/media/hero-loop-720.mp4',
  large: '/media/hero-loop.mp4',
}

/** Photography revealed when a service row is hovered or opened (Unsplash; credits in README). */
export const serviceImages: Record<ServiceId, ImageName> = {
  documentary: 'photoNeomRocks',
  commercial: 'photoSoundstage',
  photography: 'photoPlantNight',
  post: 'photoEditorDark',
  identity: 'photoRiyadhNight',
}
