// C3 (V-368/V-371/V-423, Langlauf R2 Stufe 3) · Fluff-Ernte sichtbar: KayKit-Bäume (Forest Nature Pack, CC0) in Zonen, Fluff nach Grammatik R2 aus den
// WSB-B2-Ankern (world/grammar.fruitFromAnchors), Trefferregel + Gelände-Windfall + Aufsammeln aus world/harvest.createOrchard. Hier nur Darstellung
// und Treffer-Ziele: ein InstancedMesh für alle Kügelchen (ein Draw Call), Bäume wackeln beim Treffer, Platzhalter-Wirkungen (Faust-Puff, Projektil,
// Explosions-Ball) aus Knet-Kugeln. Kein HUD (V-423: echte Ernte-Oberfläche erst mit Georgs HUD-ZIP); Zähler liefert counts() an den Wirt.
// Maß: KayKit-Einheit = M_PER_RIG (Rig_Medium-Figur 2,2 Einheiten ≈ GothGirl 1,36 m), Bäume damit 2–6,5 m.
// Modul nach Host-Vertrag R1.2. options: { zones: [{ zone, main, center: [x, z], seed, models?, n? }], terrainH(x, z), anchors (kfb.tree-fluff-anchors.v1),
// state (createHarvestState), unit (m je KayKit-Einheit), collector: () => fluff.collect-Sammler | null, onCollect? }
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FLUFF, rngOf } from '../world/fluff.js'
import { fruitFromAnchors, assignLeads } from '../world/grammar.js'
import { createOrchard } from '../world/harvest.js'

// KayKit Forest Nature Pack 1.0 FREE auf main (Commit-Pin: letzter Stand von forest_texture.png; ältere Pins liefern die Textur nicht → weiße Bäume), glTF + .bin + Textur im selben Ordner
export const FOREST_PIN = '54b9bb669fda8a5bc3d76a0743884473d04c1f50'
const FOREST = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${FOREST_PIN}/media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/`
export const CANOPY = ['Tree_1_A_Color1', 'Tree_1_B_Color1', 'Tree_2_B_Color1', 'Tree_2_C_Color1', 'Tree_3_A_Color1', 'Tree_3_B_Color1', 'Tree_3_C_Color1', 'Tree_4_A_Color1', 'Tree_4_B_Color1']
export const ORCHARD = Object.freeze({ trees: 5, spacing: [5.5, 8.5], reach: 1.9, shotRange: 26, blastRange: 22, wiggle: 0.5 })

export function createOrchard3d({ zones = [], terrainH, anchors, state, unit = 0.616381042, collector = null, onCollect = null, url = FOREST } = {}) {
  if (!terrainH || !anchors) throw new Error('ORCHARD_NO_TERRAIN_OR_ANCHORS')
  const root = new THREE.Group(); root.name = 'orchard'
  const eps = 0.15, normalAt = (x, z) => { const nx = terrainH(x - eps, z) - terrainH(x + eps, z), nz = terrainH(x, z - eps) - terrainH(x, z + eps), l = Math.hypot(nx, 2 * eps, nz); return [nx / l, (2 * eps) / l, nz / l] }
  const terrain = { heightAt: terrainH, normalAt }
  // Baumstellen je Zone: Anker-Baum in der Mitte, Rest auf einem lockeren Ring (Abstände variieren ≥ 30 %, ungerade Zahl), Drehung zufällig, deterministisch
  const trees = [], orchards = []
  for (const Z of zones) {
    const rng = rngOf('orchard', Z.zone, Z.seed ?? 0), n = Z.n ?? ORCHARD.trees, ids = Array.from({ length: n }, (_, i) => 't' + i)
    const leads = assignLeads(ids.map((id) => Z.zone + ':' + id), { main: Z.main, seed: Z.seed ?? 0, zone: Z.zone })
    const ts = ids.map((id, i) => {
      const a = (i / Math.max(1, n - 1)) * Math.PI * 2 + rng() * 0.9, r = i === 0 ? 0 : ORCHARD.spacing[0] + rng() * (ORCHARD.spacing[1] - ORCHARD.spacing[0])
      const x = Z.center[0] + Math.cos(a) * r, z = Z.center[1] + Math.sin(a) * r, y = terrainH(x, z) - 0.06, rotY = rng() * Math.PI * 2
      const model = (Z.models || CANOPY)[Math.floor(rng() * (Z.models || CANOPY).length)]
      const fruit = fruitFromAnchors(anchors, model, (Z.seed ?? 0) * 31 + i, { id, zone: Z.zone, main: Z.main, lead: leads[Z.zone + ':' + id], place: { pos: [x, y, z], rotY, scale: unit }, terrain })
      const t = { zone: Z.zone, id, model, pos: [x, y, z], rotY, balls: fruit.balls, meta: fruit.meta, obj: null, wig: 0 }
      trees.push(t); return t
    })
    orchards.push(createOrchard({ zone: Z.zone, seed: Z.seed ?? 0, trees: ts.map((t) => ({ id: t.id, balls: t.balls })), terrain, state }))
  }
  // Kügelchen: ein InstancedMesh (Einheitskugel, Radius je Instanz), Farbe = Sorte/Ton (V-292), matt; Knet folgt mit kfb-clay.v1 (V-429)
  const balls = orchards.flatMap((o) => o.balls), geo = new THREE.IcosahedronGeometry(1, 2), mat = new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0 })
  const mesh = new THREE.InstancedMesh(geo, mat, Math.max(1, balls.length)); mesh.name = 'orchard-fluff'; mesh.castShadow = mesh.receiveShadow = true; mesh.frustumCulled = false
  const col = new THREE.Color(), m4 = new THREE.Matrix4(), zero = new THREE.Matrix4().makeScale(0, 0, 0), q = new THREE.Quaternion(), s3 = new THREE.Vector3(), p3 = new THREE.Vector3()
  balls.forEach((b, i) => mesh.setColorAt(i, col.set(b.color || FLUFF[b.kind].color)))
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  root.add(mesh)
  // Bäume laden (je Modell einmal, geklont), Schatten werfen und empfangen (V-429 ein Rig)
  const loader = new GLTFLoader(), cache = new Map(), state0 = { status: 'LOADING', error: null, loaded: 0 }
  const ready = Promise.all([...new Set(trees.map((t) => t.model))].map((m) => loader.loadAsync(url + m + '.gltf').then((g) => cache.set(m, g.scene))))
    .then(() => { for (const t of trees) { const o = cache.get(t.model).clone(true); o.name = 'tree:' + t.zone + ':' + t.id; o.position.fromArray(t.pos); o.rotation.y = t.rotY; o.scale.setScalar(unit)
      o.traverse((m) => { if (m.isMesh) { m.castShadow = m.receiveShadow = true } }); t.obj = o; root.add(o); state0.loaded++ } state0.status = 'OK' })
    .catch((e) => { state0.status = 'ERROR'; state0.error = String(e?.message || e) })
  // Platzhalter-Wirkungen: Faust-Puff (kurz wachsende Kugel), Projektil (fliegt zum Baum, trifft bei Ankunft), Explosions-Ball (wächst und verblasst)
  const fx = [], fxGeo = new THREE.IcosahedronGeometry(1, 1)
  const puff = (p, color, r0, r1, dur) => { const m = new THREE.Mesh(fxGeo, new THREE.MeshStandardMaterial({ color, roughness: 1, transparent: true, opacity: 0.9 })); m.position.fromArray(p); m.scale.setScalar(r0); root.add(m); fx.push({ m, r0, r1, t: 0, dur }) }
  const flights = []
  const treeOf = (zone, id) => trees.find((t) => t.zone === zone && t.id === id)
  const orchardOf = (zone) => orchards.find((o) => o.zone === zone)
  const hitTree = (t, weapon) => { const keys = orchardOf(t.zone).hit(t.id, weapon); t.wig = weapon === 'explosion' ? 1.4 : 1; return keys }
  const crown = (t) => { const h = t.balls.filter((b) => b.state === 'hanging'); if (!h.length) return [t.pos[0], t.pos[1] + 2.5, t.pos[2]]; const c = [0, 0, 0]; for (const b of h) for (let k = 0; k < 3; k++) c[k] += b.anchor[k] / h.length; return c } // Mitte der hängenden Kügelchen
  function nearestTree(p, maxD, dir = null, cosMin = -2) {
    let best = null, bd = maxD
    for (const t of trees) { if (orchardOf(t.zone).harvest.get(t.id).empty()) continue
      const dx = t.pos[0] - p[0], dz = t.pos[2] - p[2], d = Math.hypot(dx, dz); if (d > bd) continue
      if (dir && d > 0.01 && (dx * dir[0] + dz * dir[2]) / d < cosMin) continue
      best = t; bd = d }
    return best
  }
  const info = { hits: [], shots: 0, blasts: 0 }
  return {
    object3d: root,
    ready,
    trees: () => trees.map((t) => ({ zone: t.zone, id: t.id, model: t.model, pos: t.pos.slice(), left: orchardOf(t.zone).harvest.get(t.id).left(), hits: orchardOf(t.zone).harvest.get(t.id).hits, L: orchardOf(t.zone).harvest.get(t.id).L })),
    // Faust (Platzhalter Schlagring): nächster Baum in Reichweite vor dem Spieler
    punch(p, dir) { const t = nearestTree(p, ORCHARD.reach + 0.6, dir, 0.2); if (!t) return null; const keys = hitTree(t, 'punch'); puff([p[0] + dir[0] * 0.7, p[1] + 1.1, p[2] + dir[2] * 0.7], '#f4e2c8', 0.08, 0.35, 0.22); info.hits.push({ zone: t.zone, id: t.id, w: 'punch' }); return { tree: t.id, zone: t.zone, keys } },
    // Schuss: einfaches Projektil vom Spieler zum nächsten Baum im Blickkegel, Treffer bei Ankunft
    shoot(p, dir) { const t = nearestTree(p, ORCHARD.shotRange, dir, 0.75); if (!t) return null; const [cx, cy, cz] = crown(t)
      const m = new THREE.Mesh(fxGeo, new THREE.MeshStandardMaterial({ color: '#ffd46b', roughness: 1, emissive: '#ff9a2e', emissiveIntensity: 0.6 })); m.scale.setScalar(0.12); m.position.set(p[0], p[1] + 1.2, p[2]); root.add(m)
      flights.push({ m, t, to: new THREE.Vector3(cx, cy, cz), v: 34 }); info.shots++; return { tree: t.id, zone: t.zone } },
    // Explosion (Sekundärtreffer): Ball am nächsten Baum, leert ihn auf einmal (gestaffelt zusammengedrückt)
    blast(p, dir) { const t = nearestTree(p, ORCHARD.blastRange, dir, 0.5); if (!t) return null; const keys = hitTree(t, 'explosion'); const [cx, cy, cz] = crown(t); puff([cx, cy, cz], '#ff8a3d', 0.3, 3.2, 0.5); info.blasts++; info.hits.push({ zone: t.zone, id: t.id, w: 'explosion' }); return { tree: t.id, zone: t.zone, keys } },
    collectAt(p, mode = 'walk') { let got = []; for (const o of orchards) got = got.concat(o.collect({ pos: p, mode }).keys); if (got.length) onCollect?.(got, state.counts()); return got }, // Prüfungen und Wirt
    // V-487 Stufe 2 · Saugen (kfb-fluff-suck): nächste Kügelchen im Kegel vor dem Sauger (hängend → Ursprung Baum, liegend/fallend → Boden); take nimmt
    // eines aus dem Garten (unsichtbar, solange es fliegt; zählt noch nicht), deliver zählt es beim Einsaugen wie ein Aufsammeln (Ernte-Stand, onCollect)
    suckable(p, dir, range = 6, cosMin = 0.5, n = 6) { const out = []
      for (const b of balls) { if (b.state !== 'hanging' && b.state !== 'falling' && b.state !== 'resting') continue
        const q = b.state === 'hanging' ? b.anchor : b.body.p, dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2], d = Math.hypot(dx, dy, dz); if (d > range) continue
        const dh = Math.hypot(dx, dz); if (dh > 0.3 && (dx * dir[0] + dz * dir[2]) / dh < cosMin) continue
        out.push({ key: b.key, d }) }
      return out.sort((a, b) => a.d - b.d).slice(0, n).map((e) => e.key) },
    take(key) { const b = balls.find((x) => x.key === key); if (!b || (b.state !== 'hanging' && b.state !== 'falling' && b.state !== 'resting')) return null
      const origin = b.state === 'hanging' ? 'tree' : 'ground', pos = (b.state === 'hanging' ? b.anchor : b.body.p).slice(); b.state = 'sucked'
      return { key, kind: b.kind, pos, r: b.r || 0.12, color: b.color || FLUFF[b.kind].color, origin } },
    deliver(key) { const b = balls.find((x) => x.key === key); if (!b || b.state !== 'sucked') return false; b.state = 'collected'; state.mark(key, b.kind); onCollect?.([key], state.counts()); return true },
    hitTree(zone, id, weapon) { const t = treeOf(zone, id); return t ? hitTree(t, weapon) : null }, // Prüfungen
    update(dt) {
      dt = Math.min(dt || 0, 0.1)
      for (const o of orchards) o.advance(dt)
      const c = collector?.(); if (c) { let got = []; for (const o of orchards) got = got.concat(o.collect(c).keys); if (got.length) onCollect?.(got, state.counts()) }
      balls.forEach((b, i) => {
        if (b.state === 'collected' || b.state === 'sucked') { mesh.setMatrixAt(i, zero); return }
        const p = b.state === 'hanging' ? b.anchor : b.body.p, r = b.r || 0.12
        mesh.setMatrixAt(i, m4.compose(p3.fromArray(p), q, s3.setScalar(r)))
      })
      mesh.instanceMatrix.needsUpdate = true
      for (const t of trees) if (t.obj) { if (t.wig > 0) { t.wig = Math.max(0, t.wig - dt / ORCHARD.wiggle); const w = Math.sin(t.wig * 38) * 0.06 * t.wig; t.obj.rotation.z = w; t.obj.rotation.x = w * 0.6 } else { t.obj.rotation.z = t.obj.rotation.x = 0 } }
      for (let i = flights.length - 1; i >= 0; i--) { const f = flights[i], d = f.to.clone().sub(f.m.position), l = d.length(), s = f.v * dt
        if (l <= s) { hitTree(f.t, 'shot'); info.hits.push({ zone: f.t.zone, id: f.t.id, w: 'shot' }); puff(f.to.toArray(), '#ffe2a0', 0.15, 0.9, 0.25); root.remove(f.m); f.m.material.dispose(); flights.splice(i, 1) } else f.m.position.addScaledVector(d, s / l) }
      for (let i = fx.length - 1; i >= 0; i--) { const e = fx[i]; e.t += dt; const u = Math.min(1, e.t / e.dur); e.m.scale.setScalar(e.r0 + (e.r1 - e.r0) * u); e.m.material.opacity = 0.9 * (1 - u); if (u >= 1) { root.remove(e.m); e.m.material.dispose(); fx.splice(i, 1) } }
    },
    counts: () => state.counts(),
    status: () => ({ status: state0.status, shown: state0.status === 'OK' }), // für das Knet-Modul (wartet auf geladene Bäume)
    balls: () => balls.map((b) => ({ key: b.key, zone: b.key.split(':')[0], kind: b.kind, state: b.state, p: (b.state === 'hanging' ? b.anchor : b.body?.p || b.anchor).slice(), r: b.r })),
    stats: () => ({ status: state0.status, error: state0.error, trees: trees.length, loaded: state0.loaded, balls: balls.length, zones: orchards.map((o) => ({ zone: o.zone, ...o.stats() })), shots: info.shots, blasts: info.blasts, hits: info.hits.length }),
    dispose() { geo.dispose(); mat.dispose(); fxGeo.dispose(); for (const e of fx) e.m.material.dispose(); for (const f of flights) f.m.material.dispose()
      root.traverse((m) => { if (m.isMesh && m !== mesh) { m.geometry?.dispose?.() } }); root.clear() },
  }
}
