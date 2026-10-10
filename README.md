# مُدوّنة — Mudawwana website

The launch site for Mudawwana, a Saudi cinematic production house. Arabic-first (RTL) with an English version, built as a static site: Vite + React + TypeScript, Tailwind CSS v4, `motion` and `lenis`. No backend, no CMS. All copy lives in typed files under `src/content/`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, build, prerender the first screen into dist/
npm run preview    # serve dist/ locally
npm run lint       # oxlint
```

Deploy the `dist/` folder to any static host.

## What's where

```
_source/                  client PDFs + logo (inputs for the asset script; not shipped)
public/fonts/thmanyah/    Thmanyah Serif Text (Light, Regular, Medium, Black)
public/media/             optional local video files (see "Videos")
scripts/
  extract-assets.mjs      PDF → optimised AVIF/WebP, grain, favicons, OG image
  extract_images.py       PDF extraction step (PyMuPDF), called by the script above
  prerender.mjs           writes the server-rendered first screen into dist/index.html
src/
  content/                ar.ts, en.ts (all copy), site.ts (contact details, films)
  sections/               one component per page section
  components/             Logo, Picture, Reveal, VideoViewer, Cursor, marks…
  styles/                 tokens.css (brand), base.css, typography.css, components.css
  assets/img/             generated images + images.gen.ts (do not edit by hand)
```

## Editing content

- **Copy:** `src/content/ar.ts` and `src/content/en.ts`. Both follow the same `Content` type, so TypeScript flags any missing translation.
- **Contact details, social links, film data:** `src/content/site.ts`. Fields set to `null` are hidden on the page, so nothing renders as a placeholder.

## Videos

The films are self-hosted from `public/media/`. They were downloaded from the client's Google Drive links (in the company profile) and re-encoded, because the originals are 1080p60 HEVC `.MOV` files. They're far too heavy, and Chrome can't reliably play HEVC.

```bash
npm run videos             # hero loop
npm run videos -- --films  # also download the client films from Drive and encode them
```

| File | Use |
|---|---|
| `<id>.mp4` | the film in the work viewer: 1080p30 H.264 + AAC, fast-start |
| `hero-loop.mp4` / `hero-loop-720.mp4` | silent hero loop from a free Mixkit clip: about 2 MB / 0.9 MB, slightly muted in colour |
| `hero-loop-poster.jpg` | first frame, shown before playback and for reduced-motion visitors |

To change the hero clip, edit `HERO` at the top of `scripts/encode-videos.mjs`. If a film's MP4 is missing from `public/media/`, the viewer automatically plays it from Google Drive instead. `ramadan.mp4` isn't there yet, so for now it plays from Drive.

## Fonts

Thmanyah Serif Text is loaded from `public/fonts/thmanyah/`. The family is free for commercial use under Thmanyah's license (`font/…/LICENSE.pdf`), which allows web embedding but not redistributing the files for download. English uses Poppins (self-hosted via `@fontsource/poppins`).

## Images and footage

Photography and the hero clip are free stock, licensed for commercial use with no attribution required. Credits are kept here anyway:

| Where | Photo | Photographer / source |
|---|---|---|
| Vision & Mission background | Hisma desert at golden hour | NEOM — [Unsplash](https://unsplash.com/photos/Iy59i0M7oP4) |
| Ambition & Vision 2030 | Kingdom Centre, Riyadh, at dusk | Ibrahim Abdullah — [Unsplash](https://unsplash.com/photos/_UxsPARhtOg) |
| About | Cinema camera on a rock | Jakob Owens — [Unsplash](https://unsplash.com/photos/NLYW63t_bV4) |
| Contact background | Film crew lighting a night set | Huong Do — [Unsplash](https://unsplash.com/photos/LP24lfRFKis) |
| Services: documentary | Sandstone and dunes | NEOM — [Unsplash](https://unsplash.com/photos/THlO6Mkf5uI) |
| Services: commercial | Film crew on a soundstage | Brands&People — [Unsplash](https://unsplash.com/photos/br2HgQuvq6I) |
| Services: corporate & industrial | Industrial plant at night | American Public Power Association — [Unsplash](https://unsplash.com/photos/bv2pvCGMtzg) |
| Services: post-production | Editor in a dark suite | Mark Cruz — [Unsplash](https://unsplash.com/photos/VW2oU66mwbc) |
| Services: visual identity | Riyadh at night | سيف الظاهر — [Unsplash](https://unsplash.com/photos/vAkHAP27QMk) |
| Hero background video | Cinema lens focus pull | [Mixkit #2378](https://mixkit.co/free-stock-video/lens-focus-of-a-dslr-camera-2378/) |
| Work tiles | The client's own films | Company profile |

The originals live in `_source/stock/`. To swap a photo, change its Unsplash id in `STOCK` at the top of `scripts/extract-assets.mjs`, delete the old file from `_source/stock/`, and run:

```bash
npm run assets   # downloads missing photos, writes AVIF/WebP + images.gen.ts
```

The film thumbnails still come from the company profile PDF (`pip install pymupdf numpy scipy pillow` the first time).

## Open items for the client

Content that was **not** in the PDFs, or needs confirming:

| Item | Where | Status |
|---|---|---|
| Email, domain | `site.ts` | Using `info@mudawwanah.sa` / `www.mudawwanah.sa` from the brand-guide stationery mockups — confirm |
| Phone, WhatsApp number | `site.ts` | Missing — WhatsApp button appears once set |
| Social profile URLs | `site.ts` | Missing — the handle `@Mudawwanah` (brand guide p.34) is shown; links appear once set |
| CR number, address | `site.ts` | Missing (hidden) |
| Film titles | `ar.ts` / `en.ts` | Working titles from the thumbnails and Drive file names — confirm |
| Film categories, descriptions, years | `ar.ts` / `en.ts`, `site.ts` | Draft; years missing (hidden) |
| Service descriptions | `ar.ts` / `en.ts` | Draft one-liners — titles are from the brief |
| Hero positioning line | `ar.ts` / `en.ts` | Draft, built from the vision statement |

Everything else (tagline, about, vision, mission, goals, ambition) is verbatim from the company profile.

## Brand decisions worth knowing

- **Colours:** only the five brand colours plus tints. Ember on sand fails contrast (2.6:1), so small ember text on sand uses the darker `ember-deep` tint. Text on ember is always ink.
- **Logo pairings** follow the guide (p.1–2, p.17), which also shows ink-on-ember. The footer uses the ember logo on ink (an approved pairing) rather than sand on ink, which isn't in the guide.
- **Watermark** is the hairline outline of the wordmark, as on the guide's section dividers. The logo itself is always filled.
- **Tints** follow the guide's 80 / 50 / 30 % steps.

## Language and SEO

The site is a single URL with an in-page language toggle, saved in `localStorage`. Because Arabic and English share one URL, there are no `hreflang` alternates. If separate URLs are needed later (e.g. `/en/`), add `<link rel="alternate" hreflang="ar">` / `hreflang="en"` pairs plus `x-default`. `og:image` and `canonical` point at `https://www.mudawwanah.sa/`, so update them in `index.html` if the domain changes.

## Performance notes

- The first screen (intro curtain, header, hero) is prerendered into `dist/index.html` at build time, so it paints before JavaScript runs. React then replaces it. The intro's wipe and swoosh are CSS animations that resume from the elapsed time, so there's no restart or flicker. Returning visitors and English readers have the static screen hidden before first paint, via an inline script in `index.html`.
- Everything below the hero is a separate chunk, mounted one section at a time in idle time, and uses `content-visibility: auto`.
- Animation is transform and opacity only. `prefers-reduced-motion` turns off the intro, parallax and scroll-linked motion.
