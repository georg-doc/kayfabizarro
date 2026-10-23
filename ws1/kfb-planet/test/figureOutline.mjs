// Probe Umriss nur außen (outline=1, Georg 23.10.) · Bilder ohne/mit im selben Moment, direkt auf der Spielfläche gezeichnet (Stencil braucht den
// Standard-Framebuffer) + Kosten. Ansichten: Spielkamera-nah hinter FrizzleBob mit Skelett-Gruppe, Nahaufnahme seitlich; Tag und Nacht.
// O1 Umriss vorhanden (Pixel am Figurrand dunkler als ohne) · O2 keine Linien innen (Figurinneres unverändert) · O3 Kosten: Bildzeit an/aus ≤ +1 ms, Zeichenaufrufe gemeldet
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
const OUT = path.resolve(process.env.HOME, 'kfb-ws1/research/audits/abnahme/umriss'); fs.mkdirSync(OUT, { recursive: true })
const W = 1600, H = 900
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const BASE = 'file://' + path.resolve('dist/index.html') + '#m1,debug,clean,harvest,look=terrain3,world=probe,npc,patrol'
async function open(extra) { const p = await b.newPage({ viewport: { width: W, height: H } }); await p.goto(BASE + extra)
  await p.waitForFunction(() => window.__kfbM1?.status?.().player?.status === 'OK', null, { timeout: 300000 }); await p.waitForTimeout(5000)
  await p.evaluate(() => { const M = window.__kfbM1, ms = M.mods.groups.debug()[0].members, cx = ms.reduce((s, m) => s + m.x, 0) / ms.length, cz = ms.reduce((s, m) => s + m.z, 0) / ms.length, yaw = ms[0].yaw ?? 0
    const x = cx + Math.sin(yaw) * 4, z = cz + Math.cos(yaw) * 4; M.player().teleport([x, M.terrainH(x, z) + 1.2, z], Math.atan2(cx - x, cz - z)); window.__grp = [cx, cz] })
  await p.waitForTimeout(5000); return p }
const res = { date: new Date().toISOString(), shots: [] }
for (const [tod, label] of [['day', 'tag'], ['night', 'nacht']]) {
  const p = await open(`,outline=1,tod=${tod}`)
  const r = await p.evaluate(async ({ W, H }) => { const M = window.__kfbM1, T = M.three(), gl = M.renderer(), sc = M.scene(), f = M.feet(), a = window.__grp, OL = window.__kfbOutline
    const frame = () => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)))
    for (let i = 0; i < 10; i++) await frame()
    const hulls = []; sc.traverse((o) => { if (o.userData?.outlineHull) hulls.push(o) })
    const vis = hulls.map((h) => h.visible)
    const back = new T.Vector3(f[0] - a[0], 0, f[2] - a[1]).normalize(), side = new T.Vector3(-back.z, 0, back.x)
    const cams = {
      spiel: (() => { const c = new T.PerspectiveCamera(42, W / H, 0.1, 500); c.position.set(f[0] + back.x * 6, f[1] + 3.6, f[2] + back.z * 6); c.lookAt((f[0] + a[0]) / 2, f[1] + 0.9, (f[2] + a[1]) / 2); return c })(),
      nah: (() => { const c = new T.PerspectiveCamera(30, W / H, 0.1, 500); c.position.set(f[0] + side.x * 3.2 - back.x * 0.8, f[1] + 1.6, f[2] + side.z * 3.2 - back.z * 0.8); c.lookAt(f[0], f[1] + 0.9, f[2]); return c })() }
    const out = {}
    for (const [k, cam] of Object.entries(cams)) { cam.updateMatrixWorld()
      for (const on of [false, true]) { hulls.forEach((h, i) => { h.visible = on && vis[i] }); gl.setRenderTarget(null); gl.info.autoReset = false; gl.info.reset(); gl.render(sc, cam); out[`calls-${k}-${on ? 'mit' : 'ohne'}`] = gl.info.render.calls; gl.info.autoReset = true; out[`${k}-${on ? 'mit' : 'ohne'}`] = gl.domElement.toDataURL('image/jpeg', 0.9) } }
    hulls.forEach((h, i) => { h.visible = vis[i] })
    return { out, status: OL.status(), hulls: hulls.length, calls: gl.info.render.calls } }, { W, H })
  res[label + 'Calls'] = Object.fromEntries(Object.entries(r.out).filter(([k]) => k.startsWith('calls-'))); for (const [k, url] of Object.entries(r.out).filter(([k]) => !k.startsWith('calls-'))) { const f = `${OUT}/${k}-${label}.jpg`; fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64')); res.shots.push(path.basename(f)) }
  res[label] = { status: r.status, hulls: r.hulls }
  await p.close()
}
// O3 Kosten: Bildzeit und Zeichenaufrufe an/aus im Wechsel (eigene Seiten), Tag
const cost = { on: [], off: [], callsOn: [], callsOff: [] }
for (const round of [0, 1]) for (const [k, h] of [['off', ',tod=day'], ['on', ',outline=1,tod=day']]) { const p = await open(h)
  const m = await p.evaluate(async () => { const gl = window.__kfbM1.renderer(), d = []; let t0 = performance.now(), calls = 0
    for (let i = 0; i < 240; i++) { await new Promise((ok) => requestAnimationFrame(ok)); const t = performance.now(); d.push(t - t0); t0 = t; calls = Math.max(calls, gl.info.render.calls) } d.sort((a, b) => a - b); return { ms: d[d.length >> 1], p95: d[Math.floor(d.length * 0.95)], calls } })
  cost[k].push(+m.ms.toFixed(2)); cost[k === 'on' ? 'callsOn' : 'callsOff'].push(m.calls); await p.close() }
res.cost = cost
fs.writeFileSync(`${OUT}/index.json`, JSON.stringify({ schema: 'kfb.abnahme-bilder/1', punkt: 'Umriss Figuren (outline=1)', ...res }, null, 1))
console.log(JSON.stringify({ tag: res.tag, tagCalls: res.tagCalls, nacht: res.nacht, nachtCalls: res.nachtCalls, cost }))
await b.close()
