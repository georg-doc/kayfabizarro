// #439 world=probe · Geländeform der Gelände-Probe als zweite Welt im Spiel (dist, Hash #m1,debug,harvest,look=terrain3,world=probe; Muster m1-ground).
//   terrain  : Modul meldet world=probe, Netz ≤ 400k Dreiecke, Zelle ≤ halbes Probe-Gitter (600/256 m ÷ 2), Höhe im Spiel = createProbeWorld in Node (60 Punkte)
//   plaza    : Platz bis flatR exakt auf GROUND_Y (Funktion und Netz), Physik-Strahl auf dem Platzring ebenso (±1 cm, Float32-Kollider)
//   player   : Figur nach dem Laden, nach dem Startrennen (schlafend eingefroren) und an drei Hangstellen der Probe (≤ 10°) auf dem Boden (Toleranzen wie m1-ground);
//              Steigungsreihe 6–22° nur berichtet (Sohlenabstand des Controllers am Hang, offener Punkt)
//   props    : Bäume/Laternen schweben nicht, Fundsachen sinken nicht ein (stehen auf dem Probe-Gelände)
//   car      : Auto (#…,car) auf dem Platz in Ruhe, an einer Hangstelle auf dem Boden (Bodenabstand wie auf dem Platz ±0,25 m; Rollen bergab erlaubt wie m2-settle)
//   Kosten   : Höhen- und Modulzeit (Seite), Kollider-Bau Rapier und Dreiecke in Node (Standard, Probe seg 180, Probe seg auto) → Bericht
// Bilder: test/out/probe-world/ (Spielkamera an Start und Hängen, Auto, eine hohe Übersicht)
import fs from 'fs'
import { openPage, report } from './_page.mjs'
import { createProbeWorld, createTerrain, TERRAIN, GROUND_Y, PROBE_NE } from '../src/modules/m1-terrain.js'

const OUT = 'test/out/probe-world'; fs.mkdirSync(OUT, { recursive: true })
const HASH = '#m1,debug,harvest,look=terrain3,world=probe'
const PWN = createProbeWorld(TERRAIN), K = TERRAIN.flatR / 46
// Hangstellen: Probe-Gelände zwischen blendR und 0,8 hillR mit Steigung ≤ 10°, auf drei Richtungen verteilt; Steigungsreihe 6–22° (nur Bericht)
const slopeAt = (x, z, e = 0.5) => Math.atan(Math.hypot((PWN.height(x + e, z) - PWN.height(x - e, z)) / (2 * e), (PWN.height(x, z + e) - PWN.height(x, z - e)) / (2 * e))) * 180 / Math.PI
const SPOTS = []; for (const a0 of [0.6, 2.7, 4.6]) { for (let k = 0; k < 400; k++) { const a = a0 + (k % 20) * 0.03, r = TERRAIN.blendR + 8 * K + Math.floor(k / 20) * 3 * K, x = Math.cos(a) * r, z = Math.sin(a) * r
  if (r < TERRAIN.hillR * 0.8 && slopeAt(x, z) <= 10 && slopeAt(x + 1, z) <= 10 && slopeAt(x, z + 1) <= 10) { SPOTS.push([+x.toFixed(3), +z.toFixed(3), +slopeAt(x, z).toFixed(1)]); break } } }
const SWEEP = []; for (const want of [6, 10, 14, 18, 22]) for (let k = 0; k < 6000; k++) { const a = k * 2.399963, r = TERRAIN.blendR + 6 * K + (k % 41) * 2 * K, x = Math.cos(a) * r, z = Math.sin(a) * r
  if (r < TERRAIN.hillR * 0.8 && Math.abs(slopeAt(x, z) - want) < 0.5 && Math.abs(slopeAt(x + 1, z) - want) < 2 && Math.abs(slopeAt(x, z + 1) - want) < 2) { SWEEP.push([+x.toFixed(3), +z.toFixed(3), +slopeAt(x, z).toFixed(1)]); break } }
const CROSS = Array.from({ length: 60 }, (_, i) => { const a = i * 2.399963, r = TERRAIN.R * 0.98 * Math.sqrt((i + 0.5) / 60); return [Math.cos(a) * r, Math.sin(a) * r] })
const shot = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` })

// ---------- Seite 1: Figur, Platz, Requisiten, Bilder ----------
const { browser, page, errs } = await openPage(HASH, { viewport: { width: 1280, height: 800 } })
const t0 = Date.now()
await page.waitForFunction(() => window.__kfbM1 && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.status().partner === 'OK' && window.__kfbM1.status().amphTris > 0 && window.__kfbM1.state.phase === 'free', null, { timeout: 240000 })
const readyS = (Date.now() - t0) / 1000
const r = await page.evaluate(async ({ SPOTS, CROSS, GY }) => {
  const M = window.__kfbM1, T = M.three(), mods = M.mods, P = M.player(), K = M.k, info = M.status().terrain
  const wait = (ms) => new Promise((res) => setTimeout(res, ms)), cm = (v) => +(v / K * 100).toFixed(1)
  const box = new T.Box3(), tmp = new T.Box3(), skip = /shadow|contact|blob|glow|beam|pool|ao$/i
  const bottomOf = (root, near) => { box.makeEmpty(); root.updateWorldMatrix(true, true)
    root.traverse((o) => { if ((o.isMesh || o.isSkinnedMesh) && o.visible && !skip.test(o.name)) { tmp.setFromObject(o, true); if (!near) { box.union(tmp); return } const c = tmp.getCenter(new T.Vector3()); if (Math.hypot(c.x - near[0], c.z - near[2]) < 2 * K) box.union(tmp) } })
    return box.isEmpty() ? null : box.clone() }
  const playerGap = () => { const f = M.feet(), b = bottomOf(mods.player.object3d, f), g = P.castDown(f[0], f[2]); return { mesh: b && g != null ? cm(b.min.y - g) : null, root: g != null ? cm(f[1] - g) : null } }
  const out = { info, cross: CROSS.map(([x, z]) => mods.terrain.height(x, z)) }
  // Platz: Funktion und Netz bis flatR, Physik auf dem Ring 0,8–0,97 flatR (außerhalb der Ränge)
  let fH = 0, fS = 0; for (let k = 0; k < 400; k++) { const a = k * 2.399963, q = Math.sqrt((k + 0.5) / 400), rr = info.flatR * q, x = Math.cos(a) * rr, z = Math.sin(a) * rr
    fH = Math.max(fH, Math.abs(mods.terrain.height(x, z) - GY)); const rm = (info.flatR - 1.5 * info.cell) * q; fS = Math.max(fS, Math.abs(mods.terrain.surfaceAt(Math.cos(a) * rm, Math.sin(a) * rm) - GY)) }   // Netz: Zellen ganz im Platz
  const ring = []; for (let k = 0; k < 48; k++) { const a = (k / 48) * Math.PI * 2, rr = info.flatR * (0.8 + 0.17 * ((k * 7) % 10) / 10), g = P.castDown(Math.cos(a) * rr, Math.sin(a) * rr); if (g != null) ring.push(g - GY) }
  out.plaza = { fnMax: fH, meshMax: fS, rayN: ring.length, rayMaxCm: +(Math.max(...ring.map(Math.abs)) * 100).toFixed(2) }
  await wait(2000); out.spawn = playerGap()
  const S0 = M.start, footH = S0[1] - P.castDown(S0[0], S0[2]) - 0.3 * K
  P.freeze(true); P.teleport([S0[0], S0[1], S0[2] - 2 * K]); await wait(1500)
  P.handle()?.body?.sleep?.(); const slept = P.handle()?.body?.isSleeping?.() ?? null
  P.freeze(false); await wait(2500); out.release = { ...playerGap(), slept }
  const propGaps = (key) => { const a = []; for (const c of mods[key].object3d.children) { const b = bottomOf(c); if (!b) continue; const g = P.castDown((b.min.x + b.max.x) / 2, (b.min.z + b.max.z) / 2); if (g != null) a.push(cm(b.min.y - g)) } a.sort((p, q) => p - q); return { n: a.length, min: a[0], max: a.at(-1) } }
  out.props = { orchard: propGaps('orchard'), lanterns: propGaps('lanterns'), found: propGaps('found'), foundContact: (() => { const c = mods.found?.contact?.() || []; return { n: c.length, max: c.length ? Math.max(...c.map((x) => x.max)) : null, min: c.length ? Math.min(...c.map((x) => x.min)) : null } })() }
  out.footH = footH
  return out
}, { SPOTS, CROSS, GY: GROUND_Y })
await shot(page, 'game-start')
// Hangstellen: Figur hinstellen, Spielkamera folgt; Bild je Stelle
const standAt = (x, z) => page.evaluate(async ({ x, z, footH }) => { const M = window.__kfbM1, P = M.player(), K = M.k, cm = (v) => +(v / K * 100).toFixed(1), wait = (ms) => new Promise((res) => setTimeout(res, ms))
    const g = P.castDown(x, z); P.teleport([x, g + footH + 0.3 * K, z]); await wait(2500)
    const f = M.feet(), e = 0.3 * K, sx = (P.castDown(f[0] + e, f[2]) - P.castDown(f[0] - e, f[2])) / (2 * e), sz = (P.castDown(f[0], f[2] + e) - P.castDown(f[0], f[2] - e)) / (2 * e)
    const T = M.three(), box = new T.Box3(), tmp = new T.Box3(); M.mods.player.object3d.updateWorldMatrix(true, true)
    M.mods.player.object3d.traverse((o) => { if ((o.isMesh || o.isSkinnedMesh) && o.visible && !/shadow|contact|blob|glow|beam|pool|ao$/i.test(o.name)) { tmp.setFromObject(o, true); const c = tmp.getCenter(new T.Vector3()); if (Math.hypot(c.x - f[0], c.z - f[2]) < 2 * K) box.union(tmp) } })
    const gd = P.castDown(f[0], f[2]); return { mesh: cm(box.min.y - gd), root: cm(f[1] - gd), slopeDeg: +(Math.atan(Math.hypot(sx, sz)) * 180 / Math.PI).toFixed(1), at: [+f[0].toFixed(1), +f[2].toFixed(1)] } }, { x, z, footH: r.footH })
r.slopes = []; for (let i = 0; i < SPOTS.length; i++) { r.slopes.push({ ...(await standAt(SPOTS[i][0], SPOTS[i][1])), spotDeg: SPOTS[i][2] }); await shot(page, `game-slope${i + 1}`) }
r.sweep = []; for (const [x, z, deg] of SWEEP) { const g = await standAt(x, z); r.sweep.push({ spotDeg: deg, slopeDeg: g.slopeDeg, root: g.root, mesh: g.mesh }) }
await shot(page, 'game-steep')
// hohe Übersicht: eigene Kamera über dem Platz, Blick schräg über die ganze Welt
const over = await page.evaluate(() => { const M = window.__kfbM1, T = M.three(), gl = M.renderer(), scene = M.scene(), W = 1280, H = 800
  const cam = new T.PerspectiveCamera(50, W / H, 1, 3000); cam.position.set(110, 150, 230); cam.lookAt(0, -15, -20); cam.updateMatrixWorld()
  const rt = new T.WebGLRenderTarget(W, H, { colorSpace: T.SRGBColorSpace }), buf = new Uint8Array(W * H * 4), f = scene.fog, f0 = f && { near: f.near, far: f.far, density: f.density }
  if (f?.isFog) { f.near = 1e4; f.far = 2e4 } else if (f?.isFogExp2) f.density = 0   // Übersicht ohne Dunst (Nebel ist auf die Spielkamera abgestimmt), danach zurück
  gl.setRenderTarget(rt); gl.render(scene, cam); gl.readRenderTargetPixels(rt, 0, 0, W, H, buf); gl.setRenderTarget(null); rt.dispose(); if (f0) Object.assign(f, f0)
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d'), im = g.createImageData(W, H)
  for (let y = 0; y < H; y++) im.data.set(buf.subarray((H - 1 - y) * W * 4, (H - y) * W * 4), y * W * 4)
  g.putImageData(im, 0, 0); return cv.toDataURL('image/png') })
fs.writeFileSync(`${OUT}/overview.png`, Buffer.from(over.split(',')[1], 'base64'))
await browser.close()

// ---------- Seite 2: Auto auf dem Probe-Gelände ----------
const C = await openPage(HASH.replace('harvest', 'car'), { viewport: { width: 960, height: 600 } })
await C.page.waitForFunction(() => window.__kfbM1?.status().amphTris > 0 && window.__kfbM2?.car?.(), null, { timeout: 240000 })
const car = await C.page.evaluate(async ({ spot }) => {
  const M = window.__kfbM1, M2 = window.__kfbM2, K = M.k, wait = (ms) => new Promise((res) => setTimeout(res, ms)), kind = M2.kind()
  const rest = async (x, z, yaw) => { M.input(null); M2.setKind(kind, { p: [x, M.mods.terrain.surfaceAt(x, z) + 1 * K, z], yaw }); await wait(300); while (!M2.car()) await wait(50); await wait(3000)
    const c = M2.car(), p = c.pos(), p0 = [p.x, p.y, p.z]; await wait(500); const q = c.pos()
    return { clear: +(q.y - M.mods.terrain.surfaceAt(q.x, q.z)).toFixed(3), drift: +Math.hypot(q.x - p0[0], q.y - p0[1], q.z - p0[2]).toFixed(3), at: [+q.x.toFixed(1), +q.z.toFixed(1)] } }
  const flat = await rest(12 * K, 30 * K, Math.PI / 2), hill = await rest(spot[0], spot[1], 0)
  return { kind, flat, hill }
}, { spot: SPOTS[0] })
await C.page.screenshot({ path: `${OUT}/game-car.png` })
await C.browser.close()

// ---------- Kosten in Node: Höhen + Modul, Rapier-Trimesh, Dreiecke ----------
const RAPIER = (await import('@dimforge/rapier3d-compat')).default; await RAPIER.init({})
const cost = {}; createTerrain({ world: 'probe' }).dispose()   // Aufwärmen (JIT), dann je Fall das Minimum aus 5 Läufen (geteilte Maschine, laute Zeiten)
for (const [name, o] of [['standard', {}], ['probe@180', { look: 'terrain3', world: 'probe', terrain: { seg: 180 } }], ['probe', { look: 'terrain3', world: 'probe' }]]) {
  const best = { create: Infinity, collider: Infinity }; let tris = 0
  for (let k = 0; k < 5; k++) { const a = performance.now(), T = createTerrain(o), b = performance.now(), d = T.colliderData(), w = new RAPIER.World({ x: 0, y: -9.81, z: 0 })
    const c0 = performance.now(); w.createCollider(RAPIER.ColliderDesc.trimesh(d.vertices, d.indices), w.createRigidBody(RAPIER.RigidBodyDesc.fixed())); const c1 = performance.now()
    best.create = Math.min(best.create, b - a); best.collider = Math.min(best.collider, c1 - c0); tris = d.indices.length / 3; T.dispose(); w.free() }
  cost[name] = { tris, createMs: +best.create.toFixed(1), colliderMs: +best.collider.toFixed(1) }
}

const info = r.info, TOL = 1.5, FOOT_HALF = 12
const ok = (g) => { if (!g || g.mesh == null) return false; const t = TOL + (g.slopeDeg ? FOOT_HALF * Math.tan(g.slopeDeg * Math.PI / 180) : 0); return Math.abs(g.mesh) <= t && Math.abs(g.root) <= t }
const crossMax = CROSS.reduce((m, [x, z], i) => Math.max(m, Math.abs(PWN.height(x, z) - r.cross[i])), 0)
process.exit(report('probeWorld', {
  noPageErrors: errs.length === 0 && C.errs.length === 0,
  terrainIsProbe: info?.world === 'probe' && info.source && Array.isArray(info.hRange) && info.hRange[1] - info.hRange[0] > 10,
  trisBudget: info.tris <= 400000 && info.tris === info.seg * info.seg * 2,
  cellHalfProbeGrid: info.cell <= PROBE_NE / 2 + 1e-9,
  heightMatchesNode: crossMax <= 1e-9,
  plazaFlatFn: r.plaza.fnMax <= 1e-9,
  plazaFlatMesh: r.plaza.meshMax <= 1e-9,
  plazaFlatPhysics: r.plaza.rayN >= 40 && r.plaza.rayMaxCm <= 1,
  spawnGrounded: ok(r.spawn),
  releaseGrounded: r.release?.slept === true && ok(r.release),
  slopesGrounded: SPOTS.length === 3 && r.slopes.length === 3 && r.slopes.every(ok),
  treesNotFloating: r.props.orchard.n > 0 && r.props.orchard.max <= 2,
  lanternsNotFloating: r.props.lanterns.n > 0 && r.props.lanterns.max <= 2,
  foundHovers: r.props.found.n > 0 && r.props.found.min >= 6 && r.props.found.max <= 42, // Georg 22.10.: Fundsachen schweben ≈ 0,15 m (alte WS1-cm = cm ÷ 0,65: 4–27 cm; Unterkante über dem Gelände; Kippung/Hang eingerechnet), nie eingesunken
  carRestsFlat: car.flat.clear > 0 && car.flat.clear < 1.5 * K && car.flat.drift < 0.05,
  carRestsOnHill: car.hill.clear > 0 && Math.abs(car.hill.clear - car.flat.clear) <= 0.25,
}, { readyS, info, plaza: r.plaza, spawn: r.spawn, release: r.release, slopes: r.slopes, spots: SPOTS, sweep: r.sweep, props: r.props, car, crossMax, cost, errs: [...errs, ...C.errs].slice(0, 3) }))
