import { chromium } from 'playwright'
const OUT = process.argv[2]
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 480, height: 300 } })
const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 200)))
await page.goto('http://localhost:8765/')
await page.waitForFunction(() => window.__kfbDebug && window.__kfb, null, { timeout: 60000 })
await page.waitForTimeout(800)
for (const k of ['1', '1', '1', '1', '1']) { await page.keyboard.press(k); await page.waitForTimeout(200) }
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUT}/40_hex_start.png` })
const T = await page.evaluate(() => window.__kfbDebug.targets())
console.log('targets', T.length, T.filter((t) => t.kind === 'card').map((t) => t.name).slice(0, 4))
const st = () => page.evaluate(() => ({ ...window.__kfb, coll: window.__kfbStore.getState().collection.length }))
// an den Turmfuß (Winkel 0)
const base = T[0].pos
await page.evaluate(([x, y, z]) => window.__kfbDebug.teleport(x - 3, 4.5, z - 3, false), base)
await page.waitForTimeout(2000)
const fps = await page.evaluate(() => new Promise((r) => { let n = 0; const s = performance.now(); const f = () => { n++; if (performance.now() - s < 2000) requestAnimationFrame(f); else r(n / 2) }; requestAnimationFrame(f) })); console.log('fps', fps)
console.log('at base', JSON.stringify(await st()))
let cur = -1
for (let i = 0; i < 16; i++) {
  const s0 = await st()
  // aktuelle Plattform = nächstes Ziel unter den Füßen
  let best = -1, bd = 1e9
  T.forEach((t, j) => { const d = Math.hypot(t.pos[0] - s0.pos[0], t.pos[2] - s0.pos[2]) + Math.abs(t.pos[1] - (s0.pos[1] - 1)) * 2; if (d < bd) { bd = d; best = j } })
  cur = bd < 3.5 ? best : -1
  const next = T[cur + 1]; if (!next) break
  await page.evaluate(([x, , z]) => window.__kfbDebug.faceToward(x, z), next.pos)
  await page.waitForTimeout(300)
  await page.keyboard.down('Space'); await page.waitForTimeout(120); await page.keyboard.up('Space')
  await page.waitForTimeout(1700)
  const s = await st()
  console.log('jump', i, 'from', cur, '->', cur + 1, next.kind, 'pos', s.pos.map((v) => v.toFixed(1)).join(','), 'last', s.lastPlat, 'coll', s.coll)
  if (i === 7) await page.screenshot({ path: `${OUT}/41_tower_mid.png` })
}
await page.screenshot({ path: `${OUT}/42_tower_high.png` })
console.log('errors', errs.slice(0, 5)); await browser.close()
