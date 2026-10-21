// Dioramen-Plan Schritt 6 · Nachweisbilder O-Town (Disco + Ork-Band) in Georgs Einstellungen
// Kameras nach CRITIC_3D_R1: 1 Übersicht 35°, 2 Augenhöhe vom Eingang, 3 Fuß der Band-Gruppe, 4 Seite, 6 Spielkamera
// Pässe je Bild: Graustufen (L* CIELAB, 3 Wertgruppen, Regel R1: eine Gruppe > 50 %, Zentren ≥ 10 auseinander, stärkster Kontrast in der Fokus-Box),
// Thumbnail (1/8 Breite, leicht unscharf) und Kontaktbogen; fps aus der Spielkamera. Ausgabe: tests/out/dio/*.png + report.json
// Aufruf: node tests/dio-painpoint.mjs
import { chromium } from '/Users/georgvonwestphalen/kfb-ws1/kfb-planet-t439/node_modules/playwright/index.mjs'
import { mkdirSync, writeFileSync } from 'node:fs'
const OUT = '/Users/georgvonwestphalen/kfb-ws1/probe/tests/out/dio'; mkdirSync(OUT, { recursive: true })
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const p = await b.newPage({ viewport: { width: 1100, height: 700 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (/program not valid|shader|ERROR:/i.test(m.text())) errs.push(m.text().slice(0, 200)) })
await p.goto('http://localhost:8751/')
await p.waitForFunction(() => { if (!window.__probeDrive) return false; let c = false; __probeDrive().carRoot.traverse((o) => { if (o.isMesh) c = true }); return c && document.getElementById('hudMode').textContent !== 'Racer lädt …' }, null, { timeout: 90000 })
const set = (id, v) => p.evaluate(({ id, v }) => { const el = document.getElementById(id); if (el.type === 'checkbox') { if (el.checked !== v) el.click(); return } el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }, { id, v })
await set('sunel', '12'); await set('water', '0.06'); await set('fluid', '3'); await set('ground', true); await set('otown', true); await p.waitForTimeout(7000)
const CLIP = { x: 16, y: 106, width: 724, height: 450 }
const shots = []
async function shot(name) { await p.addStyleTag({ content: '.hud,.camseg,#hint{visibility:hidden!important}' }); await p.waitForTimeout(150); const buf = await p.screenshot({ clip: CLIP }); writeFileSync(`${OUT}/${name}.png`, buf); shots.push({ name, data: 'data:image/png;base64,' + buf.toString('base64') }); await p.addStyleTag({ content: '.hud,.camseg,#hint{visibility:visible!important}' }) }

// Kameras 1–4: Übersichts-Orbit um einen Zielpunkt (Wagen dort abgestellt und ausgeblendet)
const A = await p.evaluate(() => { const { DISCO_A: D, BAND_A: B } = __OT; return { D: { x: D.x, z: D.z, open: D.open }, B: { x: B.x, z: B.z, open: B.open } } })
await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.waitForTimeout(500)
const yawOf = (open) => Math.atan2(Math.cos(open), Math.sin(open))
const orbit = async (name, t, yaw, pitch, dist) => { await p.evaluate(({ t, yaw, pitch, dist }) => { const d = __probeDrive(); d.placeCar(t.x, t.z, 0); d.carRoot.visible = false; __probeCam(yaw, pitch, dist) }, { t, yaw, pitch, dist }); await p.waitForTimeout(2200); await shot(name) }
await orbit('k1-uebersicht35', A.D, yawOf(A.D.open), 35 * Math.PI / 180, 46)
await orbit('k2-augenhoehe-eingang', A.D, yawOf(A.D.open), 0.07, 24)
await orbit('k3-fuss-band', A.B, yawOf(A.B.open), 0.22, 7)
await orbit('k4-seite-rand', A.D, yawOf(A.D.open) + Math.PI / 2, 0.12, 32)
await p.evaluate(() => { __probeDrive().carRoot.visible = true })

// Kamera 6: Spielkamera, Wagen 26 m vor dem Platz, Blick zur Mitte; fps im Stand
await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(500)
const camSpot = await p.evaluate((D) => { const wl = __S.water * __S.amp + 0.6, h0 = __hgt(D.x, D.z); let best = null
  for (const da of [0, 0.35, -0.35, 0.7, -0.7, 1.05, -1.05]) for (let d = 12; d <= 40; d += 2) { const a = D.open + da, F = [Math.cos(a), Math.sin(a)], x = D.x + F[0] * d, z = D.z + F[1] * d, h = __hgt(x, z); if (h < wl) continue
    let block = 0; for (let t = 0.15; t < 0.95; t += 0.1) { const xx = D.x + F[0] * d * t, zz = D.z + F[1] * d * t, line = h0 + (h + 2.5 - h0) * (1 - t) * 0 + (h0 + (h + 2.5 - h0) * (1 - t)) * 0; block = Math.max(block, __hgt(xx, zz) - (h0 + (h + 2.0 - h0) * (1 - t) + 0.5)) }
    const score = Math.abs(d - 26) * 0.2 + Math.abs(da) * 3 + Math.max(0, block) * 4 + Math.max(0, Math.abs(h - h0) - 2) * 3;   /* Spielkamera auf Platzhöhe, nicht am Hang darunter */ if (!best || score < best.score) best = { x, z, F, d, da, score, block } }
  if (best) __probeDrive().placeCar(best.x, best.z, Math.atan2(-best.F[0], -best.F[1])); return best }, A.D); await p.waitForTimeout(1500)
await p.getByRole('button', { name: 'Übersicht', exact: true }).click(); await p.waitForTimeout(300); await p.getByRole('button', { name: 'Fahren', exact: true }).click(); await p.waitForTimeout(3000)   /* Folgekamera hinter den Wagen setzen (im Stand richtet sie sich nicht neu aus) */
await shot('k6-spielkamera')
const fps = await p.evaluate(async () => { const a = []; let t0 = performance.now(); for (let i = 0; i < 150; i++) { await new Promise((r) => requestAnimationFrame(r)); const t = performance.now(); a.push(t - t0); t0 = t } a.sort((x, y) => x - y); return { medMs: +a[75].toFixed(1), fps: +(1000 / a[75]).toFixed(1) } })

// Pässe im Browser-Canvas: L* je Pixel, 1D-k-means k = 3, Kontrast je Zelle (3×3), Fokus-Box = mittlere Zelle; Thumbnail 1/8 mit Unschärfe
const passes = await p.evaluate(async (shots) => {
  const load = (src) => new Promise((r) => { const im = new Image(); im.onload = () => r(im); im.src = src })
  const lstar = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }; const Y = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); return Y > 0.008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y }
  const res = [], thumbs = []
  for (const s of shots) { const im = await load(s.data), W = im.width, H = im.height, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const cx = cv.getContext('2d'); cx.drawImage(im, 0, 0)
    const px = cx.getImageData(0, 0, W, H), L = new Float32Array(W * H); for (let i = 0; i < W * H; i++) L[i] = lstar(px.data[i * 4], px.data[i * 4 + 1], px.data[i * 4 + 2])
    let c = [25, 50, 75]; for (let it = 0; it < 20; it++) { const s0 = [0, 0, 0], n0 = [0, 0, 0]; for (let i = 0; i < L.length; i += 3) { const v = L[i], k = Math.abs(v - c[0]) < Math.abs(v - c[1]) ? (Math.abs(v - c[0]) < Math.abs(v - c[2]) ? 0 : 2) : (Math.abs(v - c[1]) < Math.abs(v - c[2]) ? 1 : 2); s0[k] += v; n0[k]++ } c = c.map((x, k) => n0[k] ? s0[k] / n0[k] : x).sort((a, b) => a - b) }
    const n = [0, 0, 0]; for (let i = 0; i < L.length; i += 3) { const v = L[i]; let k = 0, d = 1e9; for (let j = 0; j < 3; j++) { const dd = Math.abs(v - c[j]); if (dd < d) { d = dd; k = j } } n[k]++ } const tot = n[0] + n[1] + n[2], frac = n.map((x) => +(x / tot).toFixed(3))
    const cell = []; for (let gy = 0; gy < 3; gy++) for (let gx = 0; gx < 3; gx++) { let s1 = 0, s2 = 0, m = 0; for (let y = Math.floor(gy * H / 3); y < Math.floor((gy + 1) * H / 3); y += 2) for (let x = Math.floor(gx * W / 3); x < Math.floor((gx + 1) * W / 3); x += 2) { const v = L[y * W + x]; s1 += v; s2 += v * v; m++ } cell.push(+Math.sqrt(Math.max(0, s2 / m - (s1 / m) ** 2)).toFixed(1)) }
    const rank = [...cell].sort((a, b) => b - a).indexOf(cell[4]) + 1
    const gap = Math.min(c[1] - c[0], c[2] - c[1]), r1 = Math.max(...frac) > 0.5 && gap >= 10
    for (let i = 0; i < W * H; i++) { const g = Math.round(c[[0, 1, 2].reduce((a, j) => Math.abs(L[i] - c[j]) < Math.abs(L[i] - c[a]) ? j : a, 0)] * 2.55); px.data[i * 4] = px.data[i * 4 + 1] = px.data[i * 4 + 2] = g } cx.putImageData(px, 0, 0); const gray = cv.toDataURL('image/png')
    const tw = Math.round(W / 8), th = Math.round(H / 8), tc = document.createElement('canvas'); tc.width = tw; tc.height = th; const tx = tc.getContext('2d'); tx.filter = 'blur(0.6px)'; tx.drawImage(im, 0, 0, tw, th); thumbs.push(tc)
    res.push({ name: s.name, centers: c.map((x) => +x.toFixed(1)), frac, gap: +gap.toFixed(1), R1: r1, cellContrast: cell, focusRank: rank, focusWins: rank <= 2, gray, thumb: tc.toDataURL('image/png') }) }
  const sheet = document.createElement('canvas'), tw = thumbs[0].width, th = thumbs[0].height; sheet.width = (tw * 4 + 10) * 1; sheet.height = th * 4 + 40; const sx = sheet.getContext('2d'); sx.fillStyle = '#ddd'; sx.fillRect(0, 0, sheet.width, sheet.height)
  thumbs.forEach((t, i) => sx.drawImage(t, 0, 0, t.width, t.height, (i % 2) * (tw * 2 + 6) + 2, Math.floor(i / 2) * (th * 2 + 6) + 2, tw * 2, th * 2))   /* Thumbnail auf doppelte Größe ohne Glättung = so klein, wie es im Kontaktbogen wirkt */
  return { res, sheet: sheet.toDataURL('image/png') } }, shots)
const dec = (u) => Buffer.from(u.split(',')[1], 'base64')
for (const r of passes.res) { writeFileSync(`${OUT}/${r.name}-grau.png`, dec(r.gray)); writeFileSync(`${OUT}/${r.name}-thumb.png`, dec(r.thumb)); delete r.gray; delete r.thumb }
writeFileSync(`${OUT}/kontaktbogen.png`, dec(passes.sheet))
const report = { camSpot,  when: new Date().toISOString(), settings: 'Georg (sunel 12, water 0.06, fluid 3, ground an, otown an)', fps, passes: passes.res, errs: errs.slice(0, 4), notRun: ['Silhouetten-Pass', 'K5 Gesicht (keine Figuren)', 'Pass bei bewegter Spielkamera'] }
writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1)); console.log(JSON.stringify({ fps, passes: passes.res.map((r) => ({ n: r.name, R1: r.R1, frac: r.frac, gap: r.gap, focusRank: r.focusRank })), errs: report.errs }))
await b.close()
