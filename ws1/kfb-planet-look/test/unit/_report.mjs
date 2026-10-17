// Slice 1 · Node-Einheitstests ohne Browser: gleiche Ausgabe wie report() in test/_page.mjs, aber ohne Playwright-Import
// (test/_page.mjs lädt Chromium schon beim Import). Aufruf je Datei: node test/unit/<datei>.mjs
import fs from 'fs'
import path from 'path'
export function report(name, checks, extra = {}) {
  const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k)
  console.log(JSON.stringify({ ...extra, checks }))
  console.log(failed.length ? `FAIL ${name}: ${failed.join(', ')}` : `PASS ${name}`)
  return failed.length ? 1 : 0
}
export const readJson = (p) => JSON.parse(fs.readFileSync(path.resolve(p), 'utf8'))
export const near = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps
