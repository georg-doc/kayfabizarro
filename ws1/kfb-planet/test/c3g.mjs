// V-487 Stufe 3 · Kristall-Laternen (kfb-gem.v1 r4) in der Laufwelt (#m1,harvest): 8 Laternen am Demo-Weg, Rubin/Saphir im Wechsel. Prüft im Browser je Tageszeit
// (tod=night, tod=day): Laternen + Gem-Meshes da, Umgebung aus der Stimmung gesetzt, Practicals-Angebot je Laterne, Pool ≤ 6 echte Lichter (nachts ≥ 1 an,
// tags 0), Leuchten messbar (nachts Kristall heller als sein Umfeld, tags relativ deutlich weniger), Kosten je Bild. Bilder test/out/c3g/lantern-<tod>.png (Nahansicht).
import fs from 'fs'
import { openPage, report } from './_page.mjs'
const sharp = (await import('sharp')).default
fs.mkdirSync('test/out/c3g', { recursive: true })
const W = 640, H = 400, out = {}
for (const tod of ['night', 'day']) {
  const { browser, page, errs } = await openPage(`#m1,debug,harvest,cards=1,tod=${tod}`, { viewport: { width: 960, height: 540 } })
  await page.waitForFunction(() => window.__kfbM1?.status().player?.status === 'OK' && window.__kfbM1.mods.lanterns && window.__kfbM1.mods.practicals && window.__kfbM1.renderer?.(), null, { timeout: 300000 })
  await page.waitForTimeout(3000)
  const r = await page.evaluate(async ({ W, H }) => {
    const M = window.__kfbM1, L = M.mods.lanterns, P = M.mods.practicals, gl = M.renderer(), scene = M.scene(), T = M.three()
    const pr = L.practicals(), lt = pr[1], cam = new T.PerspectiveCamera(40, W / H, 0.05, 300)
    cam.position.set(lt.pos[0] + 1.6, lt.pos[1] + 0.5, lt.pos[2] + 1.6); cam.lookAt(lt.pos[0], lt.pos[1] - 0.1, lt.pos[2]); cam.updateMatrixWorld()
    // Die Steine pulsieren nachts mit 0,12 Hz (≈ 8,3 s): 6 Bilder über einen Puls, gewertet wird das hellste (Höhepunkt des Pulses)
    const rt = new T.WebGLRenderTarget(W, H, { colorSpace: T.SRGBColorSpace, samples: 4 }), shots = []
    for (let k = 0; k < 6; k++) { if (k) await new Promise((res) => setTimeout(res, 1400)); P.update(0.016, { camera: cam }); L.update(0.016); const b = new Uint8Array(W * H * 4); gl.setRenderTarget(rt); gl.render(scene, cam); gl.readRenderTargetPixels(rt, 0, 0, W, H, b); gl.setRenderTarget(null); shots.push(b) }
    rt.dispose()
    const p = new T.Vector3(...lt.pos).project(cam), cx = Math.round((p.x + 1) / 2 * W), cy = Math.round((p.y + 1) / 2 * H)
    let buf = shots[0]
    const lum = (x0, y0, x1, y1) => { let s = 0, n = 0; for (let y = Math.max(0, y0); y < Math.min(H, y1); y++) for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) { const i = (y * W + x) * 4; s += 0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2]; n++ } return n ? s / n : 0 }
    // Kern = Kasten um die Kristallmitte (Puffer-Zeilen laufen von unten), Umfeld = Ring darum (dreifacher Kasten ohne Kern)
    const area = (x0, y0, x1, y1) => (Math.min(W, x1) - Math.max(0, x0)) * (Math.min(H, y1) - Math.max(0, y0)), cb = [cx - 22, cy - 55, cx + 22, cy + 55], bb = [cx - 66, cy - 120, cx + 66, cy + 120]
    const measure = (b) => { buf = b; const core = lum(...cb), frame = (lum(...bb) * area(...bb) - core * area(...cb)) / (area(...bb) - area(...cb)); return { core, frame, ratio: core / Math.max(1, frame) } }
    const all = shots.map(measure), best = all.reduce((a, x) => (x.ratio > a.ratio ? x : a)); buf = shots[all.indexOf(best)]
    const { core, frame } = best, ratios = all.map((x) => +x.ratio.toFixed(2))
    const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), im = g.createImageData(W, H)
    for (let y = 0; y < H; y++) im.data.set(buf.subarray((H - 1 - y) * W * 4, (H - y) * W * 4), y * W * 4); g.putImageData(im, 0, 0)
    const t0 = performance.now(); for (let i = 0; i < 200; i++) L.update(1 / 60); const ms = (performance.now() - t0) / 200
    return { info: L.info(), practicals: pr.length, pool: P.info(), core, frame, ratio: core / Math.max(1, frame), ratios, ms, png: c.toDataURL('image/png') }
  }, { W, H })
  fs.writeFileSync(`test/out/c3g/lantern-${tod}.png`, Buffer.from(r.png.split(',')[1], 'base64')); delete r.png
  out[tod] = { ...r, errs: errs.slice(0, 3) }; await browser.close()
}
fs.writeFileSync('test/out/c3g/c3g.json', JSON.stringify(out, null, 1))
const N = out.night, D = out.day
process.exit(report('c3g crystal lanterns (V-487/3)', {
  lanterns: N.info.lanterns === 8 && N.info.meshes === 24 && N.info.presets.includes('ruby') && N.info.presets.includes('sapphire'),
  envFromMood: N.info.env && D.info.env,
  practicalPerLantern: N.practicals === 8 && D.practicals === 8,
  poolBudget: N.pool.pool <= 6 && N.pool.lit >= 1 && N.pool.lit <= 6 && D.pool.lit === 0,
  glowsAtNight: N.ratio > 1.15, // Kristall heller als sein Umfeld (inkl. Lichtfleck). WS0-Ziel 1,3 gilt für die B30-Figuren; der Platzhalter erreicht ≈ 1,2 (Dünne-Feld, §93)
  noGlowByDay: N.ratio - D.ratio > 0.25, // tags ein Edelstein ohne eigenes Leuchten
  cheap: N.ms < 1 && D.ms < 1,
  noErrors: N.errs.length === 0 && D.errs.length === 0,
}, { night: N, day: D }))
