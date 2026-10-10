// Injects the server-rendered first screen into dist/index.html.
// Run after `vite build` and `vite build --ssr src/entry-server.tsx --outDir .ssr`.
// The client still mounts with createRoot, which replaces this markup.

import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ssrDir = path.join(root, '.ssr')
const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

const file = path.join(root, 'dist', 'index.html')
const html = readFileSync(file, 'utf8')
const markup = render()
if (!html.includes('<div id="root"></div>')) throw new Error('Root container not found in dist/index.html')
writeFileSync(file, html.replace('<div id="root"></div>', `<div id="root"><div data-prerender style="display:contents">${markup}</div></div>`))
rmSync(ssrDir, { recursive: true, force: true })
console.log(`Prerendered first screen (${(markup.length / 1024).toFixed(1)} KB of HTML)`)
