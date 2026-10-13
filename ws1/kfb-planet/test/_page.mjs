// Gemeinsamer Start für Browser-Tests (Muster test/host.mjs): Playwrights Chromium, Seitenfehler sammeln.
import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'
const CHROMIUM = process.env.PW_CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined)
export async function openPage(hash = '') {
  const browser = await chromium.launch({ executablePath: CHROMIUM, args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] })
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + hash)
  return { browser, page, errs }
}
export function report(name, checks, extra = {}) {
  const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k)
  console.log(JSON.stringify({ ...extra, checks }))
  console.log(failed.length ? `FAIL ${name}: ${failed.join(', ')}` : `PASS ${name}`)
  return failed.length ? 1 : 0
}
