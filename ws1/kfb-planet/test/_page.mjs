// Gemeinsamer Start für Browser-Tests (Muster test/host.mjs): Playwrights Chromium, Seitenfehler sammeln.
import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'
const CHROMIUM = process.env.PW_CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined)
export async function openPage(hash = '', { log = false } = {}) {
  const browser = await chromium.launch({ executablePath: CHROMIUM, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] })
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const errs = [], warns = []
  page.on('pageerror', (e) => errs.push(e.message))
  // Warnungen der Kartenkette zählen als Befund (Wachhund, pdf.js nicht erreichbar, Registry)
  page.on('console', (m) => { if (m.type() === 'warning' && /\[card-?art\]|\[cardImage\]/i.test(m.text())) warns.push(m.text()) })
  if (log) page.on('console', (m) => { const t = m.text(); if (!/WebGL|GPU stall|GroupMarker|deprecated/i.test(t)) console.log('[console]', m.type(), t.slice(0, 300)) })
  await page.goto('file://' + path.resolve('dist/index.html') + hash)
  return { browser, page, errs, warns }
}
export function report(name, checks, extra = {}) {
  const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k)
  console.log(JSON.stringify({ ...extra, checks }))
  console.log(failed.length ? `FAIL ${name}: ${failed.join(', ')}` : `PASS ${name}`)
  return failed.length ? 1 : 0
}
