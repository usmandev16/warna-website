// Extracts imagery from the client PDFs and writes optimised, responsive
// outputs to src/assets/img plus brand icons to public/.
//
//   npm run assets          (re-uses .cache/raw if already extracted)
//   npm run assets -- --fresh
//
// Requires Python 3 with PyMuPDF (`pip install pymupdf`) for the PDF step.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

sharp.cache(false)
sharp.concurrency(2)

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const rawDir = path.join(root, '.cache', 'raw')
const imgDir = path.join(root, 'src', 'assets', 'img')
const brandDir = path.join(root, 'src', 'assets', 'brand')
const publicDir = path.join(root, 'public')
const fresh = process.argv.includes('--fresh')

const INK = { r: 0x19, g: 0x19, b: 0x1a }
const EMBER = '#F16B41'
const SAND = '#F1ECE3'

/**
 * Photography from Unsplash (free for commercial use under the Unsplash
 * License; credits in README). Downloaded once into _source/stock/.
 */
const STOCK = {
  hisma: 'photo-1682687218608-5e2522b04673',
  'crew-night': 'photo-1681137063068-081072cf04b4',
  'plant-night': 'photo-1509390288171-ce2088f7d08e',
  'editor-dark': 'photo-1490810194309-344b3661ba39',
  'kingdom-centre': 'photo-1694018359679-49465b4c0d61',
  'camera-rock': 'photo-1553166272-e69910ab5ae1',
  'neom-rocks': 'photo-1682687220499-d9c06b872eee',
  'riyadh-night': 'photo-1663900108404-a05e8bf82cda',
  'tripod-sunset': 'photo-1506434304575-afbb92660c28',
  'goal-craft': 'photo-1576280314591-b115fb8f4f79',
  'goal-partnership': 'photo-1632187981988-40f3cbaeef5e',
  'goal-talent': 'photo-1742333420195-84c5f5655b2b',
  'goal-region': 'photo-1762369879547-bc7699c41e1a',
  soundstage: 'photo-1612544409025-e1f6a56c1152',
}
const stockDir = path.join(root, '_source', 'stock')
const stock = (name) => path.join(stockDir, `${name}.jpg`)

/** Every image the site uses. `source` is a file in .cache/raw; `file` an absolute path. */
const IMAGES = [
  { name: 'work-ramadan', source: 'profile-p07-x30.png', widths: [640, 1280, 1836] },
  { name: 'work-education', source: 'profile-p08-x32.png', widths: [640, 1280, 1820] },
  { name: 'work-cricket', source: 'profile-p09-x36.png', widths: [640, 1280, 1824] },
  { name: 'photo-hisma', file: stock('hisma'), widths: [640, 1280, 1920, 2560] },
  { name: 'photo-neom-rocks', file: stock('neom-rocks'), widths: [640, 1280] },
  { name: 'photo-riyadh-night', file: stock('riyadh-night'), widths: [640, 1280] },
  { name: 'photo-crew-night', file: stock('crew-night'), widths: [640, 1280, 1920, 2560] },
  { name: 'photo-plant-night', file: stock('plant-night'), widths: [640, 1280] },
  { name: 'photo-editor-dark', file: stock('editor-dark'), widths: [640, 1280] },
  { name: 'photo-kingdom-centre', file: stock('kingdom-centre'), widths: [640, 1280, 1920, 2560] },
  { name: 'photo-camera-rock', file: stock('camera-rock'), widths: [640, 1280, 1920] },
  { name: 'photo-soundstage', file: stock('soundstage'), widths: [640, 1280, 1920, 2560] },
  { name: 'photo-tripod-sunset', file: stock('tripod-sunset'), widths: [640, 1280, 1920, 2560] },
  { name: 'photo-goal-craft', file: stock('goal-craft'), widths: [640, 1280, 1920, 2560] },
  { name: 'photo-goal-partnership', file: stock('goal-partnership'), widths: [640, 1280, 1920, 2560] },
  { name: 'photo-goal-talent', file: stock('goal-talent'), widths: [640, 1280, 1920, 2560] },
  { name: 'photo-goal-region', file: stock('goal-region'), widths: [640, 1280, 1920, 2560] },
]

function extractRaw() {
  if (!fresh && existsSync(path.join(rawDir, 'manifest.json'))) return
  rmSync(rawDir, { recursive: true, force: true })
  console.log('Extracting images from PDFs (≈30s)…')
  execFileSync('python', ['-I', path.join(root, 'scripts', 'extract_images.py'), rawDir], {
    stdio: ['ignore', 'ignore', 'inherit'],
  })
}

/** Decoded, prepared base image: trimmed (alpha) or flattened (opaque). */
async function prepare(spec) {
  const input = sharp(spec.file ?? path.join(rawDir, spec.source), { limitInputPixels: false })
  if (spec.alpha) {
    return input.trim({ threshold: 1 }).png().toBuffer()
  }
  if (spec.liftToInk) {
    // Lift the artwork's near-black shadows to brand ink (no pure #000).
    const { width, height } = await input.metadata()
    return sharp({ create: { width, height, channels: 3, background: INK } })
      .composite([{ input: await input.removeAlpha().toBuffer(), blend: 'lighten' }])
      .png()
      .toBuffer()
  }
  return input.flatten({ background: INK }).png().toBuffer()
}

async function writeVariants(spec) {
  const base = await prepare(spec)
  const meta = await sharp(base).metadata()
  const widths = [...new Set(spec.widths.map((w) => Math.min(w, meta.width)))]
  const files = []
  for (const width of widths) {
    const resized = sharp(base).resize({ width, withoutEnlargement: true })
    const stem = `${spec.name}-${width}`
    await resized.clone().avif({ quality: spec.alpha ? 55 : 48, effort: 5 }).toFile(path.join(imgDir, `${stem}.avif`))
    await resized.clone().webp({ quality: spec.alpha ? 78 : 72, effort: 5 }).toFile(path.join(imgDir, `${stem}.webp`))
    files.push({ width, stem })
  }
  const placeholder = await sharp(base).resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer()
  return {
    name: spec.name,
    width: meta.width,
    height: meta.height,
    files,
    placeholder: `data:image/webp;base64,${placeholder.toString('base64')}`,
  }
}

function camel(name) {
  return name.replace(/-(\w)/g, (_, c) => c.toUpperCase())
}

function writeModule(results) {
  const imports = []
  const entries = []
  for (const r of results) {
    const id = camel(r.name)
    const avif = []
    const webp = []
    for (const f of r.files) {
      const v = `${id}${f.width}`
      imports.push(`import ${v}Avif from './${f.stem}.avif'`, `import ${v}Webp from './${f.stem}.webp'`)
      avif.push(`{ src: ${v}Avif, width: ${f.width} }`)
      webp.push(`{ src: ${v}Webp, width: ${f.width} }`)
    }
    entries.push(
      `  ${id}: {\n    width: ${r.width},\n    height: ${r.height},\n    avif: [${avif.join(', ')}],\n    webp: [${webp.join(', ')}],\n    placeholder: '${r.placeholder}',\n  },`,
    )
  }
  const body = [
    '// Generated by scripts/extract-assets.mjs. Do not edit by hand.',
    "import type { ResponsiveImage } from './types'",
    '',
    ...imports,
    '',
    'export const images = {',
    ...entries,
    '} satisfies Record<string, ResponsiveImage>',
    '',
    'export type ImageName = keyof typeof images',
    '',
  ].join('\n')
  writeFileSync(path.join(imgDir, 'images.gen.ts'), body)
}

async function writeGrain() {
  // A flat, evenly lit crop of the profile's own grain texture, re-centred on
  // mid-grey so it can be tiled with an overlay blend without shifting tone.
  const crop = await sharp(path.join(rawDir, 'profile-p01-x140.png'))
    .extract({ left: 1400, top: 700, width: 256, height: 256 })
    .greyscale()
    .toBuffer()
  const [{ mean, stdev }] = (await sharp(crop).stats()).channels
  const gain = 34 / stdev
  const tile = await sharp(crop)
    .linear(gain, 128 - gain * mean)
    .webp({ quality: 62 })
    .toBuffer()
  writeFileSync(path.join(brandDir, 'grain.webp'), tile)
}

function logoSvg(color) {
  const svg = readFileSync(path.join(root, '_source', 'mudawwana-logo.svg'), 'utf8')
  const inner = svg.slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>'))
  return inner.replaceAll('currentColor', color)
}

/** Logo centred on an ink square: favicon set. */
function iconSvg(size) {
  const pad = 0.14
  const w = size * (1 - pad * 2)
  const h = (w * 156) / 400
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#19191A"/>
<svg x="${size * pad}" y="${(size - h) / 2}" width="${w}" height="${h}" viewBox="760 462 400 156">${logoSvg(EMBER)}</svg>
</svg>`
}

async function writeIcons(heroBase) {
  writeFileSync(path.join(publicDir, 'favicon.svg'), iconSvg(64))
  await sharp(Buffer.from(iconSvg(180))).png().toFile(path.join(publicDir, 'apple-touch-icon.png'))
  await sharp(Buffer.from(iconSvg(32))).png().toFile(path.join(publicDir, 'favicon-32.png'))
  await sharp(Buffer.from(iconSvg(512))).png().toFile(path.join(publicDir, 'icon-512.png'))

  const logoW = 420
  const logoH = Math.round((logoW * 156) / 400)
  const logo = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${logoW}" height="${logoH}" viewBox="760 462 400 156">${logoSvg(SAND)}</svg>`,
  )
  const shade = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#19191A" stop-opacity=".8"/><stop offset=".55" stop-color="#19191A" stop-opacity="0"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`,
  )
  await sharp(heroBase)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .composite([
      { input: shade },
      { input: logo, left: 1200 - logoW - 80, top: 630 - logoH - 90 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(publicDir, 'og.jpg'))
}

async function downloadStock() {
  mkdirSync(stockDir, { recursive: true })
  for (const [name, id] of Object.entries(STOCK)) {
    if (existsSync(stock(name))) continue
    const response = await fetch(`https://images.unsplash.com/${id}?w=2560&q=85&fm=jpg`)
    if (!response.ok) throw new Error(`Unsplash download failed for ${name}: ${response.status}`)
    writeFileSync(stock(name), Buffer.from(await response.arrayBuffer()))
    console.log(`↓ ${name}`)
  }
}

async function main() {
  extractRaw()
  await downloadStock()
  mkdirSync(imgDir, { recursive: true })
  mkdirSync(brandDir, { recursive: true })
  mkdirSync(publicDir, { recursive: true })
  const results = []
  for (const spec of IMAGES) {
    results.push(await writeVariants(spec))
    console.log(`✓ ${spec.name}`)
  }
  writeModule(results)
  await writeGrain()
  await writeIcons(await prepare(IMAGES.find((spec) => spec.name === 'photo-camera-rock')))
  console.log('✓ grain, icons, og image')
}

await main()
