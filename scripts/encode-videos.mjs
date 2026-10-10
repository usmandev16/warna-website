// Encodes the site's video for the web. Outputs go to public/media/.
//
//   npm run videos              hero loop only (a free Mixkit clip)
//   npm run videos -- --films   also download the client films from Drive and encode them
//
//   hero-loop.mp4        silent 1080p background loop (~2 MB)
//   hero-loop-720.mp4    lighter loop for small screens (~1 MB)
//   hero-loop-poster.jpg first frame, shown before playback / for reduced motion
//   <id>.mp4             a client film, 1080p30 H.264 + AAC, for the work viewer
//
// Film sources (HEVC .MOV, too heavy and not playable everywhere) are cached
// in .cache/video-src/.

import { execFileSync } from 'node:child_process'
import { createWriteStream, existsSync, mkdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, '.cache', 'video-src')
const outDir = path.join(root, 'public', 'media')

/** Drive file ids, matching the share links in src/content/site.ts. */
const FILMS = {
  ramadan: '1p2FIr5xle0IjqYJ8z2Q8DL15gVSBJzv_',
  education: '1lU2wCh8l-cLFheLf5vcj__Vl4NsMUlIE',
  cricket: '1X0L0B9vc1cq0yLO3mmDNbFTi_AAJLKrZ',
}

/** The hero loop: cinema lens focus pull, Mixkit #2378 (Mixkit free licence, no attribution required). */
const HERO = {
  url: 'https://assets.mixkit.co/videos/2378/2378-1080.mp4',
  file: path.join(root, '.cache', 'stock-video', 'lens-2378.mp4'),
}
const withFilms = process.argv.includes('--films')

async function fetchTo(url, file) {
  const response = await fetch(url)
  if (!response.ok || !response.body) throw new Error(`Download failed: ${url} (${response.status})`)
  await pipeline(Readable.fromWeb(response.body), createWriteStream(file))
}

async function download(id, driveId) {
  const file = path.join(srcDir, `${id}.mov`)
  const url = `https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=t`
  const head = await fetch(url, { method: 'HEAD' })
  const expected = Number(head.headers.get('content-length'))
  if (existsSync(file) && statSync(file).size === expected) return file
  console.log(`Downloading ${id} (${(expected / 1e6).toFixed(0)} MB)…`)
  await fetchTo(url, file)
  return file
}

/** Skip outputs that are newer than their source. */
const upToDate = (input, output) => existsSync(output) && statSync(output).mtimeMs > statSync(input).mtimeMs

function encode(args, label) {
  console.log(`Encoding ${label}…`)
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })
}

const film = (input, output) =>
  upToDate(input, output) ||
  encode(
    [
      '-i', input,
      '-vf', 'scale=-2:1080:flags=lanczos,fps=30',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-maxrate', '6M', '-bufsize', '12M',
      '-pix_fmt', 'yuv420p', '-profile:v', 'high',
      '-c:a', 'aac', '-b:a', '128k', '-ac', '2',
      '-movflags', '+faststart',
      output,
    ],
    path.basename(output),
  )

// Slightly muted and darkened so the footage sits inside the ink/ember palette.
const GRADE = 'eq=saturation=0.85:brightness=-0.02'

const loop = (input, output, height, crf) =>
  upToDate(input, output) ||
  encode(
    [
      '-i', input,
      '-vf', `scale=-2:${height}:flags=lanczos,${GRADE}`,
      '-c:v', 'libx264', '-preset', 'veryslow', '-tune', 'film', '-crf', String(crf),
      '-pix_fmt', 'yuv420p', '-profile:v', 'high',
      '-an', '-movflags', '+faststart',
      output,
    ],
    path.basename(output),
  )

mkdirSync(path.dirname(HERO.file), { recursive: true })
mkdirSync(outDir, { recursive: true })

if (!existsSync(HERO.file)) {
  console.log('Downloading hero clip…')
  await fetchTo(HERO.url, HERO.file)
}
loop(HERO.file, path.join(outDir, 'hero-loop.mp4'), 1080, 30)
loop(HERO.file, path.join(outDir, 'hero-loop-720.mp4'), 720, 31)
encode(
  ['-i', HERO.file, '-frames:v', '1', '-vf', `scale=-2:1080,${GRADE}`, '-q:v', '7', path.join(outDir, 'hero-loop-poster.jpg')],
  'hero-loop-poster.jpg',
)
const outputs = ['hero-loop.mp4', 'hero-loop-720.mp4', 'hero-loop-poster.jpg']

if (withFilms) {
  mkdirSync(srcDir, { recursive: true })
  for (const [id, driveId] of Object.entries(FILMS)) {
    film(await download(id, driveId), path.join(outDir, `${id}.mp4`))
    outputs.push(`${id}.mp4`)
  }
}

for (const name of outputs) {
  console.log(`  ${name.padEnd(22)} ${(statSync(path.join(outDir, name)).size / 1e6).toFixed(2)} MB`)
}
