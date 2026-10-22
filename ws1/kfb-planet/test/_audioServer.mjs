// WS-Audio R1 · lokaler Vite-Server (mit /@kfb-audio/) und headless Chromium für Ton-Prüfungen. Nie sichtbar (Georg: keine Fenster).
import { chromium } from 'playwright'
import { spawn } from 'child_process'
import net from 'net'
import fs from 'fs'
const CHROMIUM = process.env.PW_CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined)
const freePort = () => new Promise((res) => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)) }) })
export async function startServer({ port } = {}) {
  port = port || (await freePort())
  const proc = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(port), '--strictPort', '--host', '127.0.0.1'], { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, BROWSER: 'none' } })
  let out = ''; proc.stdout.on('data', (d) => { out += d }); proc.stderr.on('data', (d) => { out += d })
  const t0 = Date.now(); while (!/Local:|ready in/i.test(out)) { if (Date.now() - t0 > 60000) throw new Error('vite startet nicht: ' + out.slice(-500)); if (proc.exitCode !== null) throw new Error('vite beendet: ' + out.slice(-500)); await new Promise((r) => setTimeout(r, 200)) }
  return { url: `http://127.0.0.1:${port}/`, log: () => out, stop: () => { try { proc.kill('SIGTERM') } catch {} } }
}
export async function openAudioPage(base, hash, { viewport = { width: 1280, height: 720 }, log = false } = {}) {
  const args = ['--autoplay-policy=no-user-gesture-required', '--mute-audio']
  const browser = process.env.PW_GPU ? await chromium.launch({ channel: 'chromium', args: [...args, '--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] }) : await chromium.launch({ executablePath: CHROMIUM, args: [...args, '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] })
  const page = await browser.newPage({ viewport })
  const errs = []; page.on('pageerror', (e) => errs.push(e.message))
  if (log) page.on('console', (m) => { const t = m.text(); if (!/WebGL|GPU stall|GroupMarker|deprecated/i.test(t)) console.log('[console]', m.type(), t.slice(0, 300)) })
  await page.goto(base + hash)
  return { browser, page, errs }
}
