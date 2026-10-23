// Figuren lesbar mit bestehendem Licht (figamb=1, Georg 23.10., FIGUREN_LESBARKEIT_R2) · Selbstprüfung und Abnahmebilder.
// A = heute, B = figamb=1, im selben Moment (Spieluhr angehalten) mit derselben Kamera (FrizzleBob vor der Skelett-Gruppe, Kamera seitlich).
// FL-1 Struktur auf der Figur ≥ heute (Nachbarpixel-Differenz, Licht- und Schattenhälfte getrennt) · FL-2 Bodenschatten unverändert (Boden-Pixel B = A)
// FL-3 Figur gegen Boden daneben ≥ 1,5 : 1 nachts und heller als heute · FL-4 ≤ 5 % der Figurpixel abgesoffen (Helligkeit < 10/255)
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const OUT = path.resolve(process.env.HOME, 'kfb-ws1/research/audits/abnahme/figuren-lesbar'); fs.mkdirSync(OUT, { recursive: true })
const W = 1600, H = 900
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const BASE = 'file://' + path.resolve('dist/index.html') + '#m1,debug,clean,harvest,look=terrain3,world=probe,npc,patrol,figamb=1'
const lumAt = (buf, x, y) => { const i = ((H - 1 - y) * W + x) * 4; return 0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2] }
const region = (buf, [x0, y0, x1, y1]) => { const L = []; for (let y = Math.max(0, y0 | 0); y < Math.min(H, y1); y++) { const row = []; for (let x = Math.max(0, x0 | 0); x < Math.min(W, x1); x++) row.push(lumAt(buf, x, y)); L.push(row) } return L }
const stats = (R) => { let s = 0, n = 0, g = 0, gn = 0, dark = 0; for (const row of R) for (let i = 0; i < row.length; i++) { s += row[i]; n++; if (row[i] < 10) dark++; if (i) { g += Math.abs(row[i] - row[i - 1]); gn++ } } return { mean: n ? s / n : 0, struct: gn ? g / gn : 0, dark: n ? dark / n : 0 } }

const res = { date: new Date().toISOString(), cases: {} }
for (const [tod, label] of [['night', 'nacht'], ['gold', 'gold'], ['day', 'tag']]) {
  const p = await b.newPage({ viewport: { width: W, height: H } }); await p.goto(BASE + `,tod=${tod}`)
  await p.waitForFunction(() => window.__kfbM1?.status?.().player?.status === 'OK', null, { timeout: 300000 }); await p.waitForTimeout(5000)
  await p.evaluate(() => { const M = window.__kfbM1, ms = M.mods.groups.debug()[0].members, cx = ms.reduce((s, m) => s + m.x, 0) / ms.length, cz = ms.reduce((s, m) => s + m.z, 0) / ms.length, yaw = ms[0].yaw ?? 0
    const x = cx + Math.sin(yaw) * 4, z = cz + Math.cos(yaw) * 4; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], Math.atan2(cx - x, cz - z)); window.__grp = [cx, cz] })
  await p.waitForTimeout(5000)
  const r = await p.evaluate(async ({ W, H }) => { const M = window.__kfbM1, T = M.three(), gl = M.renderer(), sc = M.scene(), FA = window.__kfbFigAmb, f = M.feet(), a = window.__grp
    // Kamera schräg von vorn auf die Gruppe (Gesichter sichtbar), FrizzleBob seitlich im Bild
    const dir = new T.Vector3(f[0] - a[0], 0, f[2] - a[1]).normalize(), side = new T.Vector3(-dir.z, 0, dir.x), mid = new T.Vector3((f[0] + a[0]) / 2, f[1], (f[2] + a[1]) / 2)
    const cam = new T.PerspectiveCamera(36, W / H, 0.1, 500); cam.position.copy(mid).addScaledVector(side, 6.5).addScaledVector(dir, 1.0); cam.position.y += 2.4; cam.lookAt(mid.x, mid.y + 0.8, mid.z); cam.updateMatrixWorld()
    const frame = () => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)))
    const shot = () => { const rt = new T.WebGLRenderTarget(W, H, { samples: 4, colorSpace: T.SRGBColorSpace }), buf = new Uint8Array(W * H * 4); gl.setRenderTarget(rt); gl.render(sc, cam); gl.readRenderTargetPixels(rt, 0, 0, W, H, buf); gl.setRenderTarget(null); rt.dispose(); return buf }
    const enc = (buf) => { let s = ''; for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode.apply(null, buf.subarray(i, i + 8192)); return btoa(s) }
    for (let i = 0; i < 20; i++) await frame()
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); for (let i = 0; i < 4; i++) await frame() // Spieluhr anhalten: A und B zeigen dieselbe Lage
    const figs = []; sc.traverse((o) => { if (/^npc:/.test(o.name || '')) figs.push(o) }); figs.push(M.mods.player.object3d)
    const proj = (v) => { const q = v.clone().project(cam); return [(q.x + 1) / 2 * W, (1 - q.y) / 2 * H, q.z] }
    const boxes = figs.map((o) => { const bx = new T.Box3().setFromObject(o); if (bx.isEmpty()) return null; const pts = []; for (const x of [bx.min.x, bx.max.x]) for (const y of [bx.min.y, bx.max.y]) for (const z of [bx.min.z, bx.max.z]) pts.push(proj(new T.Vector3(x, y, z)))
      const wp = o.getWorldPosition(new T.Vector3()), toCam = cam.position.clone().sub(wp).setY(0).normalize(), sd = new T.Vector3(-toCam.z, 0, toCam.x), aw = wp.clone().addScaledVector(sd, 2.5); aw.y = M.terrainH(aw.x, aw.z)
      return { name: o.name || 'player', box: [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))], away: proj(aw), z: Math.max(...pts.map((p) => p[2])) } }).filter((x) => x && x.z < 1 && x.box[0] > 0 && x.box[2] < W && x.box[1] > 0 && x.box[3] < H)
    FA.off = true; const vA = FA.refresh(); const A = shot()
    FA.off = false; const vB = FA.refresh(); const B = shot()
    return { boxes, factor: [vA, vB], A: enc(A), B: enc(B) } }, { W, H })
  const A = Buffer.from(r.A, 'base64'), B = Buffer.from(r.B, 'base64'), figs = []
  for (const bx of r.boxes) { const [x0, y0, x1, y1] = bx.box, w = x1 - x0, h = y1 - y0, inner = [x0 + w * 0.25, y0 + h * 0.12, x1 - w * 0.25, y1 - h * 0.12]
    const left = [inner[0], inner[1], (inner[0] + inner[2]) / 2, inner[3]], right = [(inner[0] + inner[2]) / 2, inner[1], inner[2], inner[3]]
    const sA = stats(region(A, inner)), sB = stats(region(B, inner)), lA = [stats(region(A, left)), stats(region(A, right))], lB = [stats(region(B, left)), stats(region(B, right))]
    const aw = [bx.away[0] - 8, bx.away[1] - 8, bx.away[0] + 8, bx.away[1] + 8], gA = stats(region(A, aw)), gB = stats(region(B, aw))
    figs.push({ name: bx.name, px: [Math.round(w), Math.round(h)], mean: [+sA.mean.toFixed(1), +sB.mean.toFixed(1)], struct: [+sA.struct.toFixed(2), +sB.struct.toFixed(2)], halves: lA.map((x, i) => [+x.struct.toFixed(2), +lB[i].struct.toFixed(2)]),
      dark: [+sA.dark.toFixed(3), +sB.dark.toFixed(3)], ground: [+gA.mean.toFixed(1), +gB.mean.toFixed(1)], contrast: [+(sA.mean / Math.max(1, gA.mean)).toFixed(2), +(sB.mean / Math.max(1, gB.mean)).toFixed(2)] }) }
  // FL-2: Bodenpixel außerhalb aller Figurkästen gleich (Boden unberührt)
  let diff = 0, n = 0; for (let y = 0; y < H; y += 7) for (let x = 0; x < W; x += 7) { if (r.boxes.some((bx) => x > bx.box[0] - 10 && x < bx.box[2] + 10 && y > bx.box[1] - 10 && y < bx.box[3] + 10)) continue; diff += Math.abs(lumAt(A, x, y) - lumAt(B, x, y)); n++ }
  for (const [tag, buf] of [['a-heute', A], ['b-neu', B]]) await sharp(buf, { raw: { width: W, height: H, channels: 4 } }).flip().resize(W * 2, H * 2).jpeg({ quality: 88 }).toFile(`${OUT}/gruppe-${label}-${tag}.jpg`)
  res.cases[label] = { factor: r.factor, figures: figs, groundDiffMean: +(diff / Math.max(1, n)).toFixed(3) }
  await p.close()
}
const N = res.cases.nacht
res.checks = {
  FL1_structure: Object.values(res.cases).every((c) => c.figures.every((f) => f.struct[1] >= f.struct[0] - 0.05 && f.halves.every(([a, bb]) => bb >= a - 0.05))),
  FL2_groundUnchanged: Object.values(res.cases).every((c) => c.groundDiffMean <= 0.5),
  FL3_nightContrast: !!N && N.figures.length >= 2 && N.figures.every((f) => f.contrast[1] >= 1.5 && f.contrast[1] > f.contrast[0]),
  FL4_notCrushed: !!N && N.figures.every((f) => f.dark[1] <= 0.05),
}
fs.writeFileSync(`${OUT}/index.json`, JSON.stringify({ schema: 'kfb.abnahme-bilder/1', punkt: 'Figuren lesbar (figamb)', ...res }, null, 1))
const failed = Object.entries(res.checks).filter(([, v]) => !v).map(([k]) => k)
console.log(JSON.stringify({ cases: res.cases, checks: res.checks }))
console.log(failed.length ? `FAIL figureAmbient: ${failed.join(', ')}` : 'PASS figureAmbient')
await b.close()
