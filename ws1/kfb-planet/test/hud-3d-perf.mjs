// HUD 3D R1 · Messung nach EINBAU_WS1 §2 (Pflicht): Bildzeit p50/p95, Draw Calls je Bild, WebGL-Kontexte, Texturen + HUD-Render-Ziel-Speicher, Long Tasks,
// HUD-eigene Zeit (Overlay-Pass und Update) – je hud=wood (0 Props), hud=clay (Knet-HUD R1) und hud=3d (Spike), im Wechsel, Desktop 1600×900 @2 und
// Telefon quer 844×390 @3 (nur Emulator, kein echtes Gerät). Schwere GPU-Arbeit: nur im Test-Slot. Ausgabe: test/out/hud-3d/perf.json
import { chromium } from 'playwright'
import { SITE_HASH } from '../src/siteHash.js' // Live-Stand wie die Site (world=probe), nur Prüf-Schalter dazu
import fs from 'fs'; import path from 'path'
const OUT = 'test/out/hud-3d'; fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const FORMS = { desk: { viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 }, phoneL: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, hasTouch: true } }
const MEAS_MS = +(process.env.MS || 8000), REPS = +(process.env.REPS || 2)
const res = [] // Achtung: Messwerte m.hud nicht über den Schalter-Namen legen (Fehler im ersten Lauf 24.10., Zusammenfassung nachgerechnet)
for (const form of Object.keys(FORMS)) for (let r = 0; r < REPS; r++) for (const hud of ['wood', 'clay', '3d']) {
  const ctx = await browser.newContext(FORMS[form]); const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + SITE_HASH + `,debug,clean,hud=${hud}`)
  await page.waitForFunction(() => window.__kfbM1?.harvest?.()?.hud && window.__kfbM1.renderer?.(), null, { timeout: 120000 }); await page.waitForTimeout(7000)
  const m = await page.evaluate(async (MS) => {
    const gl = window.__kfbM1.renderer(), H = window.__kfbClayHud; H?.resetStats?.()
    const long = []; const po = new PerformanceObserver((l) => { for (const e of l.getEntries()) long.push(e.duration) }); try { po.observe({ type: 'longtask', buffered: false }) } catch {}
    gl.info.autoReset = false; gl.info.reset()
    const d = [], calls = [], tris = []; let last = performance.now(); const t0 = last
    await new Promise((ok) => { const f = (t) => { d.push(t - last); last = t; calls.push(gl.info.render.calls); tris.push(gl.info.render.triangles); gl.info.reset(); if (t - t0 < MS) requestAnimationFrame(f); else ok() }; requestAnimationFrame(f) })
    gl.info.autoReset = true; po.disconnect()
    const q = (a, k) => { const s = a.slice(1).sort((x, y) => x - y); return +s[Math.floor(s.length * k)].toFixed(2) }, avg = (a) => +(a.slice(1).reduce((x, y) => x + y, 0) / (a.length - 1)).toFixed(1)
    let ctxs = 0; for (const c of document.querySelectorAll('canvas')) { try { if (c.getContext('webgl2') === null && c.getContext('webgl') === null) {} } catch {} } // nur Zählung unten
    const webgl = [...document.querySelectorAll('canvas')].filter((c) => c.width > 32 && c.height > 32 && c.__r3f !== false).length
    const hs = H?.status?.()
    return { fps: +(1000 * (d.length - 1) / (last - t0)).toFixed(1), p50: q(d, 0.5), p95: q(d, 0.95), calls: avg(calls), callsP95: q(calls, 0.95), tris: avg(tris),
      textures: gl.info.memory.textures, geometries: gl.info.memory.geometries, programs: gl.info.programs?.length ?? null, canvases: document.querySelectorAll('canvas').length,
      longTasks: long.length, longMs: +long.reduce((a, b) => a + b, 0).toFixed(0),
      hud: hs ? { kit: H.kit, drawAvg: hs.drawMsAvg, drawP95: hs.drawMsP95, upd: hs.updMsAvg, rtRenders: hs.rtRenders, quads: hs.quads, rtMB: +(hs.rtBytes / 1048576).toFixed(2) } : null }
  }, MEAS_MS)
  res.push({ ...m, hudStats: m.hud, form, hud, rep: r, errs: errs.length }) /* hud = Schalter (m.hud sind die HUD-Messwerte) */; console.log(JSON.stringify(res[res.length - 1])); await ctx.close()
}
await browser.close()
// Zusammenfassung je Form × HUD: Mittel der Wiederholungen
const sum = {}
for (const r of res) { const k = r.form + '/' + r.hud; (sum[k] ||= []).push(r) }
const S = Object.fromEntries(Object.entries(sum).map(([k, a]) => [k, { fps: +(a.reduce((s, x) => s + x.fps, 0) / a.length).toFixed(1), p95: Math.max(...a.map((x) => x.p95)), calls: +(a.reduce((s, x) => s + x.calls, 0) / a.length).toFixed(1), textures: a[0].textures, canvases: a[0].canvases, longTasks: a.reduce((s, x) => s + x.longTasks, 0), hudDrawAvg: a[0].hudStats ? +(a.reduce((s, x) => s + x.hudStats.drawAvg, 0) / a.length).toFixed(3) : 0, hudDrawP95: a[0].hudStats ? Math.max(...a.map((x) => x.hudStats.drawP95)) : 0, hudUpd: a[0].hudStats ? a[0].hudStats.upd : 0, rtMB: a[0].hudStats?.rtMB ?? 0, quads: a[0].hudStats?.quads ?? 0 }]))
fs.writeFileSync(`${OUT}/perf.json`, JSON.stringify({ date: new Date().toISOString(), note: 'Telefon = Emulator (844×390 @3, Mac-GPU), kein echtes Gerät', runs: res, summary: S }, null, 1))
console.log(JSON.stringify(S))
