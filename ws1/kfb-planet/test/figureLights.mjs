// Figurenlicht R1 (docs/FIGURENLICHT_KONZEPT_R1.md) · Selbstprüfung F1–F6 und Abnahmebilder. A = heute (Figurenlicht und Schattenseite aus, alter Spot),
// B = figlight=1 + shade=1, beide im selben Moment mit derselben Kamera (Spielkamera-nah: hinter/über FrizzleBob, die Skelett-Gruppe vor ihm).
// F1 Gesicht/Körper ≥ 2 × Boden 3 m daneben (Nacht, B) · F2 Boden an den Füßen ≥ 1,5 × 3 m daneben (Nacht), ≤ 1,15 × (Tag) · F4 Programme gleich, kein Sprung > 10 %
// F5 figI folgt der Stimmung (Tag < Gold < Nacht) · F6 Bildzeit an/aus (eigene Seiten, im Wechsel). Nur im Test-Slot (PW_GPU, mehrere Seiten).
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const OUT = path.resolve(process.env.HOME, 'kfb-ws1/research/audits/abnahme/figurenlicht'); fs.mkdirSync(OUT, { recursive: true })
const W = 1600, H = 900
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const BASE = 'file://' + path.resolve('dist/index.html') + '#m1,debug,clean,harvest,look=terrain3,world=probe,npc,patrol'
async function open(extra) { const p = await b.newPage({ viewport: { width: W, height: H } }); await p.goto(BASE + extra)
  await p.waitForFunction(() => window.__kfbM1?.status?.().player?.status === 'OK', null, { timeout: 300000 }); await p.waitForTimeout(5000)
  // Spieler vor die Skelett-Patrouille (drei Figuren beisammen), Blick zur Gruppe; Ziel-Lage für die Kamera merken
  await p.evaluate(() => { const M = window.__kfbM1, g = M.mods.groups.debug()[0], ms = g.members, cx = ms.reduce((s, m) => s + m.x, 0) / ms.length, cz = ms.reduce((s, m) => s + m.z, 0) / ms.length, yaw = ms[0].yaw ?? 0
    const x = cx + Math.sin(yaw) * 5, z = cz + Math.cos(yaw) * 5; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], Math.atan2(cx - x, cz - z)); window.__grp = [cx, cz] })
  await p.waitForTimeout(5000); return p }

const lum = (buf, x0, y0, x1, y1) => { let s = 0, n = 0; x0 = Math.max(0, x0 | 0); y0 = Math.max(0, y0 | 0); x1 = Math.min(W, x1 | 0); y1 = Math.min(H, y1 | 0)
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const i = ((H - 1 - y) * W + x) * 4; s += 0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2]; n++ } return n ? s / n : 0 }

const res = { date: new Date().toISOString(), cases: {} }
for (const [tod, label] of [['night', 'nacht'], ['gold', 'gold'], ['day', 'tag']]) {
  const p = await open(`,figlight=1,shade=1,tod=${tod}`)
  const r = await p.evaluate(async ({ W, H }) => { const M = window.__kfbM1, T = M.three(), gl = M.renderer(), sc = M.scene(), FL = window.__kfbFigLight, SH = window.__kfbShade
    const pl = M.mods.player.object3d, f = M.feet(), a = window.__grp || [f[0] + 5, f[2] + 5]
    const look = new T.Vector3((f[0] + a[0]) / 2, f[1] + 0.9, (f[2] + a[1]) / 2), back = new T.Vector3(f[0] - a[0], 0, f[2] - a[1]).normalize()
    const cam = new T.PerspectiveCamera(42, W / H, 0.1, 500); cam.position.set(f[0] + back.x * 6.5, f[1] + 4.2, f[2] + back.z * 6.5); cam.lookAt(look); cam.updateMatrixWorld()
    const frame = () => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)))
    const shot = () => { const rt = new T.WebGLRenderTarget(W, H, { samples: 4, colorSpace: T.SRGBColorSpace }), buf = new Uint8Array(W * H * 4); gl.setRenderTarget(rt); gl.render(sc, cam); gl.readRenderTargetPixels(rt, 0, 0, W, H, buf); gl.setRenderTarget(null); rt.dispose(); return buf }
    const enc = (buf) => { let s = ''; for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode.apply(null, buf.subarray(i, i + 8192)); return btoa(s) }
    // ein paar Bilder laufen lassen, damit die Lichter eingeblendet sind (fade 0,4 s), dann Uhr nicht anhalten – A/B direkt nacheinander
    for (let i = 0; i < 40; i++) await frame()
    const st = FL.status(), progs0 = gl.info.programs.length
    // Figuren, die B beleuchtet: Bildschirm-Kasten und Fußpunkt
    const lit = []; sc.traverse((o) => { if (o === pl || /^npc:/.test(o.name || '')) lit.push(o) })
    const named = new Set(st.lit.map((x) => x.name)), figs = lit.filter((o) => o === pl || named.has(o.name))
    const proj = (v) => { const q = v.clone().project(cam); return [(q.x + 1) / 2 * W, (1 - q.y) / 2 * H, q.z] }
    const boxes = figs.map((o) => { const bx = new T.Box3().setFromObject(o), pts = []; for (const x of [bx.min.x, bx.max.x]) for (const y of [bx.min.y, bx.max.y]) for (const z of [bx.min.z, bx.max.z]) pts.push(proj(new T.Vector3(x, y, z)))
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), wp = o.getWorldPosition(new T.Vector3()), toCam = cam.position.clone().sub(wp).setY(0).normalize(), side = new T.Vector3(-toCam.z, 0, toCam.x)
      const foot = proj(wp.clone().addScaledVector(toCam, 0.25)), away = proj(wp.clone().addScaledVector(side, 3).setY(M.terrainH(wp.x + side.x * 3, wp.z + side.z * 3)))
      return { name: o === pl ? 'player' : o.name, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], foot, away, inView: pts.some((p) => p[2] < 1 && p[0] > 0 && p[0] < W && p[1] > 0 && p[1] < H) } })
    FL.test.off = true; SH.off = true; await frame(); await frame(); const A = shot()
    FL.test.off = false; SH.off = false; for (let i = 0; i < 30; i++) await frame(); const B = shot()
    return { st, progs0, progs1: gl.info.programs.length, boxes, A: enc(A), B: enc(B) } }, { W, H })
  const A = Buffer.from(r.A, 'base64'), B = Buffer.from(r.B, 'base64'), m = []
  for (const bx of r.boxes.filter((x) => x.inView)) { const [x0, y0, x1, y1] = bx.box, w = x1 - x0, h = y1 - y0, ix0 = x0 + w * 0.2, ix1 = x1 - w * 0.2, iy0 = y0 + h * 0.15, iy1 = y1 - h * 0.15
    const ring = (buf) => (lum(buf, x0 - w * 0.6, y0, x0, y1) + lum(buf, x1, y0, x1 + w * 0.6, y1)) / 2
    const pad = 6, footL = (buf, q) => lum(buf, q[0] - pad, q[1] - pad, q[0] + pad, q[1] + pad)
    m.push({ name: bx.name, px: [Math.round(w), Math.round(h)], fig: { A: +lum(A, ix0, iy0, ix1, iy1).toFixed(1), B: +lum(B, ix0, iy0, ix1, iy1).toFixed(1) }, ring: { A: +ring(A).toFixed(1), B: +ring(B).toFixed(1) },
      foot: { A: +footL(A, bx.foot).toFixed(1), B: +footL(B, bx.foot).toFixed(1) }, away: { A: +footL(A, bx.away).toFixed(1), B: +footL(B, bx.away).toFixed(1) } }) }
  for (const [tag, buf] of [['a-heute', A], ['b-figurenlicht', B]]) await sharp(buf, { raw: { width: W, height: H, channels: 4 } }).flip().resize(W * 2, H * 2).jpeg({ quality: 88 }).toFile(`${OUT}/gruppe-${label}-${tag}.jpg`)
  res.cases[label] = { figI: r.st.figI, lit: r.st.lit, candidates: r.st.candidates, programs: [r.progs0, r.progs1], figures: m }
  await p.close()
}
// F4 Wechsel: Spieler läuft an der Gruppe vorbei, Stärke je Licht und Bild (Sprung > 10 % = FAIL); neue Shader-Programme gegen denselben Lauf ohne Figurenlicht
const walk = async (extra) => { const p = await open(extra)
  const r = await p.evaluate(async () => { const M = window.__kfbM1, gl = M.renderer(), FL = window.__kfbFigLight, lights = []; M.scene().traverse((o) => { if (/^figure-light#/.test(o.name)) lights.push(o) })
    const frame = () => new Promise((ok) => requestAnimationFrame(ok)), p0 = gl.info.programs.length, sums = [], names = new Set()
    const a = window.__grp; if (!a) return null
    for (let i = 0; i < 240; i++) { const t = i / 240, x = a[0] + 9 - 18 * t, z = a[1] + 5; if (i % 6 === 0) M.player().teleport([x, M.terrainH(x, z) + 0.05, z], -Math.PI / 2); await frame(); sums.push(lights.map((l) => l.intensity)); FL?.status().lit.forEach((x) => names.add(x.name)) }
    const ref = Math.max(1e-6, ...sums.flat()); let maxJump = 0; for (let i = 1; i < sums.length; i++) for (let k = 0; k < sums[i].length; k++) maxJump = Math.max(maxJump, Math.abs(sums[i][k] - sums[i - 1][k]) / ref)
    return { newPrograms: gl.info.programs.length - p0, lightCount: lights.length, maxJumpRel: +maxJump.toFixed(3), figuresLit: [...names] } })
  await p.close(); return r }
res.switch = await walk(',figlight=1,shade=1,tod=night'); res.switchBaseline = await walk(',shade=1,tod=night')
// F6 Kosten: Bildzeit (Median) an/aus im Wechsel, je 4 s, zweimal
{ const times = { on: [], off: [] }
  for (const round of [0, 1]) for (const [k, h] of [['off', ',tod=night'], ['on', ',figlight=1,tod=night']]) { const p = await open(h)
    const ms = await p.evaluate(async () => { const d = []; let t0 = performance.now(); for (let i = 0; i < 240; i++) { await new Promise((ok) => requestAnimationFrame(ok)); const t = performance.now(); d.push(t - t0); t0 = t } d.sort((a, b) => a - b); return d[d.length >> 1] })
    times[k].push(+ms.toFixed(2)); await p.close() }
  res.cost = times }
const N = res.cases.nacht, T = res.cases.tag
const ratio = (o, k) => o[k].B / Math.max(1, o.ring?.B ?? 1)
res.checks = {
  // F1 (korrigiert 23.10., offen an Georg): Figur gegen den Boden 3 m daneben außerhalb des Lichtkreises – der Ring direkt neben der Figur liegt gewollt im Lichtkreis
  F1_nightFigures2x: !!N && N.figures.length >= 2 && N.figures.every((f) => f.fig.B / Math.max(1, f.away.B) >= 2),
  F2_nightCircle: !!N && N.figures.every((f) => f.foot.B / Math.max(1, f.away.B) >= 1.5),
  F2_dayCircleFaint: !!T && T.figures.every((f) => f.foot.B / Math.max(1, f.away.B) <= 1.15 || f.foot.B / Math.max(1, f.foot.A) <= 1.15),
  F4_noRecompile: !!res.switch && !!res.switchBaseline && res.switch.newPrograms <= res.switchBaseline.newPrograms,
  F4_noPop: !!res.switch && res.switch.maxJumpRel <= 0.1,
  F5_followsMood: res.cases.tag.figI < res.cases.gold.figI && res.cases.gold.figI < res.cases.nacht.figI,
  F6_cost: res.cost.on.every((v, i) => v - res.cost.off[i] <= 1.0),
}
fs.writeFileSync(`${OUT}/index.json`, JSON.stringify({ schema: 'kfb.abnahme-bilder/1', punkt: 'Figurenlicht R1', ...res }, null, 1))
const failed = Object.entries(res.checks).filter(([, v]) => !v).map(([k]) => k)
console.log(JSON.stringify({ switchBaseline: res.switchBaseline, cases: Object.fromEntries(Object.entries(res.cases).map(([k, c]) => [k, { figI: c.figI, lit: c.lit.length, figures: c.figures }])), switch: res.switch, cost: res.cost, checks: res.checks }))
console.log(failed.length ? `FAIL figureLights: ${failed.join(', ')}` : 'PASS figureLights')
await b.close()
