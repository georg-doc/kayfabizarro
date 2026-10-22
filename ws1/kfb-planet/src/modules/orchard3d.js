// C3 (V-368/V-371/V-423, Langlauf R2 Stufe 3) · Fluff-Ernte sichtbar: KayKit-Bäume (Forest Nature Pack, CC0) in Zonen, Fluff nach Grammatik R2 aus den
// WSB-B2-Ankern (world/grammar.fruitFromAnchors), Trefferregel + Gelände-Windfall + Aufsammeln aus world/harvest.createOrchard. Hier nur Darstellung
// und Treffer-Ziele: ein InstancedMesh für alle Kügelchen (ein Draw Call), Bäume wackeln beim Treffer, Platzhalter-Wirkungen (Faust-Puff, Projektil,
// Explosions-Ball) aus Knet-Kugeln. Kein HUD (V-423: echte Ernte-Oberfläche erst mit Georgs HUD-ZIP); Zähler liefert counts() an den Wirt.
// Maß: KayKit-Einheit = M_PER_RIG (Rig_Medium-Figur 2,2 Einheiten ≈ GothGirl 1,36 m), Bäume damit 2–6,5 m.
// Modul nach Host-Vertrag R1.2. options: { zones: [{ zone, main, center: [x, z], seed, models?, n? }], terrainH(x, z), anchors (kfb.tree-fluff-anchors.v1),
// state (createHarvestState), unit (m je KayKit-Einheit), collector: () => fluff.collect-Sammler | null, onCollect? }
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FLUFF, rngOf, releaseAt } from '../world/fluff.js'
import { fruitFromAnchors, assignLeads } from '../world/grammar.js'
import { createOrchard } from '../world/harvest.js'

// KayKit Forest Nature Pack 1.0 FREE auf main (Commit-Pin: letzter Stand von forest_texture.png; ältere Pins liefern die Textur nicht → weiße Bäume), glTF + .bin + Textur im selben Ordner
export const FOREST_PIN = '54b9bb669fda8a5bc3d76a0743884473d04c1f50'
const FOREST = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${FOREST_PIN}/media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/`
export const CANOPY = ['Tree_1_A_Color1', 'Tree_1_B_Color1', 'Tree_2_B_Color1', 'Tree_2_C_Color1', 'Tree_3_A_Color1', 'Tree_3_B_Color1', 'Tree_3_C_Color1', 'Tree_4_A_Color1', 'Tree_4_B_Color1']
export const ORCHARD = Object.freeze({ trees: 5, spacing: [5.5, 8.5], reach: 1.9, shotRange: 26, blastRange: 22, wiggle: 0.5, priorityBehind: 1.5 }) // priorityBehind: Georg 21.10. (a)
// WS-NPC Phase C (V-583 Dark Fluffer, Lead-OK 21.10. b): ein Baum wird „tainted“ – nur Darstellung + Weltzustand, keine 7. Sorte. Die Kügelchen
// werden dunkel (Instanzfarbe Richtung Tinte #1f1a14), fallen über den vorhandenen Treffer-Weg, bleiben liegen und sinken nach sinkAfter s in sinkDur s ein
// (Zustand 'sunk', unsichtbar); tainted ist weder aufsammelbar noch ansaugbar. Flüchtig (kein Spielstand, V-585).
// WS-NPC Phase C (Lead-OK c): Platz für freigegebenen Fluff (burst), Zone 'burst' entsteht erst beim ersten burst (sonst alles wie bisher)
export const BURST = Object.freeze({ cap: 24, zone: 'burst' })
export const TAINT = Object.freeze({ ink: '#1f1a14', mix: 0.82, sinkAfter: 2.5, sinkDur: 1.6 })

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
  const mesh = new THREE.InstancedMesh(geo, mat, Math.max(1, balls.length) + BURST.cap); mesh.count = Math.max(1, balls.length); mesh.name = 'orchard-fluff'; mesh.castShadow = mesh.receiveShadow = true; mesh.frustumCulled = false
  const col = new THREE.Color(), m4 = new THREE.Matrix4(), zero = new THREE.Matrix4().makeScale(0, 0, 0), q = new THREE.Quaternion(), s3 = new THREE.Vector3(), p3 = new THREE.Vector3()
  const ink = new THREE.Color(TAINT.ink)
  const recolor = () => { balls.forEach((b, i) => { col.set(b.color || FLUFF[b.kind].color); if (b.tainted) col.lerp(ink, TAINT.mix); mesh.setColorAt(i, col) }); if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true }
  recolor()
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
  const info = { hits: [], shots: 0, blasts: 0, targetHits: [] }
  const targets = new Map()
  function nearestTarget(p, maxD, dir, cosMin) { let best = null
    for (const it of targets.values()) { const q = it.pos(); if (!q) continue; const dx = q[0] - p[0], dz = q[2] - p[2], d = Math.hypot(dx, dz); if (d > maxD) continue
      if (dir && d > 0.01 && (dx * dir[0] + dz * dir[2]) / d < cosMin) continue; if (!best || d < best.d) best = { it, d } }
    return best }
  // Zielwahl des Schusses (WS-NPC Phase C, Lead-OK d): näheres Ziel gewinnt; Georg 21.10. (a): ein Ziel mit Vorrang (z. B. feindlicher Dark Fluffer am Stamm)
  // nimmt der Schuss auch bis priorityBehind m hinter dem Baum. Kampf R1: dieselbe Regel für shoot und aimTarget (eine Stelle)
  function pick(p, dir, range, cosMin) { const t = nearestTree(p, range, dir, cosMin), g = nearestTarget(p, range, dir, cosMin)
    const td = t ? Math.hypot(t.pos[0] - p[0], t.pos[2] - p[2]) : Infinity
    return { t, g, toTarget: !!g && (g.d < td || (!!g.it.priority?.() && g.d <= td + ORCHARD.priorityBehind)) } }
  // Kampf R1 (K10-Geschoss fliegt gerade aus der Mündung): Abstand Strecke a→b zu einer senkrechten Strecke (x, y0…y1, z), Ergebnis Anteil u auf a→b
  const _sq = new THREE.Vector3(), _sr = new THREE.Vector3()
  const segToPole = (a, b, x, y0, y1, z) => { // nächste Punkte zweier Strecken (Ericson 5.1.9), ohne Allokation
    const d1x = b[0] - a[0], d1y = b[1] - a[1], d1z = b[2] - a[2], d2y = y1 - y0, rx = a[0] - x, ry = a[1] - y0, rz = a[2] - z
    const A = d1x * d1x + d1y * d1y + d1z * d1z, E = d2y * d2y, F = d2y * ry, c = d1x * rx + d1y * ry + d1z * rz, bb = d1y * d2y, den = A * E - bb * bb
    let s = den > 1e-12 ? THREE.MathUtils.clamp((bb * F - c * E) / den, 0, 1) : 0, t = E > 1e-12 ? (bb * s + F) / E : 0
    if (t < 0) { t = 0; s = A > 1e-12 ? THREE.MathUtils.clamp(-c / A, 0, 1) : 0 } else if (t > 1) { t = 1; s = A > 1e-12 ? THREE.MathUtils.clamp((bb - c) / A, 0, 1) : 0 }
    _sq.set(a[0] + d1x * s, a[1] + d1y * s, a[2] + d1z * s); _sr.set(x, y0 + d2y * t, z); return { u: s, d: _sq.distanceTo(_sr) } }
  const TREE_HIT = { trunkR: 0.45, crownR: 1.6 } // Kampf R1: Baum als Stamm (senkrechte Kapsel bis zur Krone) + Krone (Kugel um die Mitte der hängenden Kügelchen), in m
  return {
    object3d: root,
    ready,
    trees: () => trees.map((t) => ({ zone: t.zone, id: t.id, model: t.model, pos: t.pos.slice(), left: orchardOf(t.zone).harvest.get(t.id).left(), hits: orchardOf(t.zone).harvest.get(t.id).hits, L: orchardOf(t.zone).harvest.get(t.id).L })),
    // Faust (Platzhalter Schlagring): nächster Baum in Reichweite vor dem Spieler
    punch(p, dir) { const t = nearestTree(p, ORCHARD.reach + 0.6, dir, 0.2); if (!t) return null; const keys = hitTree(t, 'punch'); puff([p[0] + dir[0] * 0.7, p[1] + 1.1, p[2] + dir[2] * 0.7], '#f4e2c8', 0.08, 0.35, 0.22); info.hits.push({ zone: t.zone, id: t.id, w: 'punch' }); return { tree: t.id, zone: t.zone, keys } },
    // Schuss: einfaches Projektil vom Spieler zum nächsten Baum im Blickkegel, Treffer bei Ankunft
    shoot(p, dir) { const { t, g, toTarget } = pick(p, dir, ORCHARD.shotRange, 0.75)
      if (!t && !g) return null
      const m = new THREE.Mesh(fxGeo, new THREE.MeshStandardMaterial({ color: '#ffd46b', roughness: 1, emissive: '#ff9a2e', emissiveIntensity: 0.6 })); m.scale.setScalar(0.12); m.position.set(p[0], p[1] + 1.2, p[2]); root.add(m)
      if (toTarget) { flights.push({ m, g: g.it, v: 34 }); info.shots++; return { target: g.it.id } }
      const [cx, cy, cz] = crown(t)
      flights.push({ m, t, to: new THREE.Vector3(cx, cy, cz), v: 34 }); info.shots++; return { tree: t.id, zone: t.zone } },
    // WS-NPC Phase C (Lead-OK 21.10. d): Ziele für den Schuss (z. B. Dark Fluffer zum Heilen). { id, pos: () => [x, y, z] (Mitte), r, onHit(id), priority?() }.
    // priority() true (Georg 21.10. (a)): Vorrang vor einem höchstens ORCHARD.priorityBehind m näheren Baum im Kegel
    // Kein Schaden, kein Kampfsystem: das Projektil folgt der Mitte und meldet beim Auftreffen onHit; Rückgabe = Abmeldung
    addTarget(it) { if (!it || it.id == null || !(it.r > 0) || typeof it.pos !== 'function') throw new Error('ORCHARD_TARGET_INVALID'); targets.set(it.id, it); return () => targets.delete(it.id) },
    // Kampf R1 (K10-Waffen, kein zweites Zielsystem): Zielwahl wie shoot (Kegel, Vorrang), nur ohne Projektil – der Wirt dreht damit die Figur (Controller
    // besitzt die Blickrichtung), das K10-Geschoss fliegt dann gerade aus der Mündung. Rückgabe { kind: 'target', id, pos, d } | { kind: 'tree', zone, id, pos, d } | null
    aimTarget(p, dir, range = ORCHARD.shotRange, cosMin = 0.75) { const { t, g, toTarget } = pick(p, dir, range, cosMin)
      if (toTarget) { const q = g.it.pos(); if (q) return { kind: 'target', id: g.it.id, pos: q.slice(), d: g.d } }
      return t ? { kind: 'tree', zone: t.zone, id: t.id, pos: crown(t), d: Math.hypot(t.pos[0] - p[0], t.pos[2] - p[2]) } : null },
    // Kampf R1: erster Treffer der Strecke a→b (Geschoss-Radius rad) an einem Ziel (senkrechte Kapsel um pos(), Radius r; pos() null = nicht treffbar) oder
    // einem Baum (Stamm bis zur Krone + Krone). Rückgabe { kind: 'target', id, u, at } | { kind: 'tree', zone, id, u, at } | null (u = Anteil auf a→b)
    sweep(a, b, rad = 0) { let best = null; const L = Math.hypot(b[0] - a[0], b[2] - a[2]), mx = (a[0] + b[0]) / 2, mz = (a[2] + b[2]) / 2
      for (const it of targets.values()) { const q = it.pos(); if (!q) continue; const r = segToPole(a, b, q[0], q[1] - it.r, q[1] + it.r, q[2])
        if (r.d <= it.r + rad && (!best || r.u < best.u)) best = { kind: 'target', id: it.id, u: r.u, at: _sq.toArray() } }
      for (const t of trees) { if (Math.hypot(t.pos[0] - mx, t.pos[2] - mz) > L / 2 + TREE_HIT.crownR + 4) continue
        const c = crown(t), st = segToPole(a, b, t.pos[0], t.pos[1], c[1], t.pos[2])
        if (st.d <= TREE_HIT.trunkR + rad && (!best || st.u < best.u)) best = { kind: 'tree', zone: t.zone, id: t.id, u: st.u, at: _sq.toArray() }
        const cr = segToPole(a, b, c[0], c[1], c[1], c[2])
        if (cr.d <= TREE_HIT.crownR + rad && (!best || cr.u < best.u)) best = { kind: 'tree', zone: t.zone, id: t.id, u: cr.u, at: _sq.toArray() } }
      return best },
    // Kampf R1: Auftreffen des K10-Geschosses melden – am Ziel über dessen onHit (wie das Projektil von shoot), am Baum wie ein Schuss (hitTree 'shot')
    hitTarget(id) { const it = targets.get(id); if (!it) return false; info.targetHits.push(id); it.onHit?.(id); return true },
    shotTree(zone, id) { const t = treeOf(zone, id); if (!t) return null; const keys = hitTree(t, 'shot'); info.hits.push({ zone, id, w: 'shot' }); return keys },
    // Explosion (Sekundärtreffer): Ball am nächsten Baum, leert ihn auf einmal (gestaffelt zusammengedrückt)
    blast(p, dir) { const t = nearestTree(p, ORCHARD.blastRange, dir, 0.5); if (!t) return null; const keys = hitTree(t, 'explosion'); const [cx, cy, cz] = crown(t); puff([cx, cy, cz], '#ff8a3d', 0.3, 3.2, 0.5); info.blasts++; info.hits.push({ zone: t.zone, id: t.id, w: 'explosion' }); return { tree: t.id, zone: t.zone, keys } },
    collectAt(p, mode = 'walk') { let got = []; for (const o of orchards) got = got.concat(o.collect({ pos: p, mode }).keys); if (got.length) onCollect?.(got, state.counts()); return got }, // Prüfungen und Wirt
    // V-487 Stufe 2 · Saugen (kfb-fluff-suck): nächste Kügelchen im Kegel vor dem Sauger (hängend → Ursprung Baum, liegend/fallend → Boden); take nimmt
    // eines aus dem Garten (unsichtbar, solange es fliegt; zählt noch nicht), deliver zählt es beim Einsaugen wie ein Aufsammeln (Ernte-Stand, onCollect)
    suckable(p, dir, range = 6, cosMin = 0.5, n = 6) { const out = []
      for (const b of balls) { if (b.tainted || (b.state !== 'hanging' && b.state !== 'falling' && b.state !== 'resting')) continue
        const q = b.state === 'hanging' ? b.anchor : b.body.p, dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2], d = Math.hypot(dx, dy, dz); if (d > range) continue
        const dh = Math.hypot(dx, dz); if (dh > 0.3 && (dx * dir[0] + dz * dir[2]) / dh < cosMin) continue
        out.push({ key: b.key, d }) }
      return out.sort((a, b) => a.d - b.d).slice(0, n).map((e) => e.key) },
    take(key) { const b = balls.find((x) => x.key === key); if (!b || b.tainted || (b.state !== 'hanging' && b.state !== 'falling' && b.state !== 'resting')) return null
      const origin = b.state === 'hanging' ? 'tree' : 'ground', pos = (b.state === 'hanging' ? b.anchor : b.body.p).slice(); b.state = 'sucked'
      return { key, kind: b.kind, pos, r: b.r || 0.12, color: b.color || FLUFF[b.kind].color, origin } },
    deliver(key) { const b = balls.find((x) => x.key === key); if (!b || b.state !== 'sucked') return false; b.state = 'collected'; state.mark(key, b.kind); onCollect?.([key], state.counts()); return true },
    hitTree(zone, id, weapon) { const t = treeOf(zone, id); return t ? hitTree(t, weapon) : null }, // Prüfungen
    // WS-NPC Phase C: Baum tainted an/aus. an: hängende Kügelchen werden dunkel (Abwurf ruft der Wirt über hitTree); aus: hängende bekommen ihre Farbe
    // zurück, liegende tainted sinken weiter ein (endlich, kein Zurückholen). Rückgabe: betroffene Schlüssel
    taint(zone, id, on = true) { const t = treeOf(zone, id); if (!t) return null; const keys = []
      t.balls.forEach((b) => { if (on ? (b.state === 'hanging' && !b.tainted) : (b.tainted && b.state === 'hanging')) { b.tainted = !!on; b.sinkT = null; keys.push(b.key) } })
      t.tainted = !!on; recolor(); return keys },
    tainted: () => balls.filter((b) => b.tainted).map((b) => ({ key: b.key, state: b.state, sink: b.sinkT ?? null })),
    // WS-NPC Phase C (Lead-OK c): n bunte Kügelchen an pos freigeben (fluff.releaseAt), danach Physik/Aufsammeln/Ernte-Stand wie Baum-Fluff.
    // tag macht die Schlüssel eindeutig (z. B. 'heal:<fluffer>:<Tag>'); gleicher tag zweimal = keine neuen Kügelchen (endlich, kein Farmen)
    burst(pos, n, seed = 0, tag = 'burst') { let o = orchardOf(BURST.zone); if (!o) { o = createOrchard({ zone: BURST.zone, seed: 0, trees: [], terrain, state }); orchards.push(o) }
      const free = Math.max(0, mesh.instanceMatrix.count - balls.length), list = releaseAt(pos, Math.min(n, free), seed, { tag }).filter((b) => !balls.some((x) => x.key === b.key)); if (!list.length) return []
      o.addFalling(list); balls.push(...list); mesh.count = balls.length; recolor(); return list.map((b) => b.key) },
    update(dt) {
      dt = Math.min(dt || 0, 0.1)
      for (const o of orchards) o.advance(dt)
      const c = collector?.(); if (c) { let got = []; for (const o of orchards) got = got.concat(o.collect(c).keys); if (got.length) onCollect?.(got, state.counts()) }
      balls.forEach((b, i) => {
        if (b.state === 'collected' || b.state === 'sucked' || b.state === 'sunk') { mesh.setMatrixAt(i, zero); return }
        const p = b.state === 'hanging' ? b.anchor : b.body.p, r = b.r || 0.12
        if (b.tainted && b.state === 'resting') { b.sinkT = (b.sinkT ?? 0) + dt; const u = Math.min(1, Math.max(0, (b.sinkT - TAINT.sinkAfter) / TAINT.sinkDur)) // einsinken nach der Ruhezeit
          if (u >= 1) { b.state = 'sunk'; mesh.setMatrixAt(i, zero); return }
          mesh.setMatrixAt(i, m4.compose(p3.set(p[0], p[1] - r * 2 * u, p[2]), q, s3.setScalar(r * (1 - 0.35 * u)))); return }
        mesh.setMatrixAt(i, m4.compose(p3.fromArray(p), q, s3.setScalar(r)))
      })
      mesh.instanceMatrix.needsUpdate = true
      for (const t of trees) if (t.obj) { if (t.wig > 0) { t.wig = Math.max(0, t.wig - dt / ORCHARD.wiggle); const w = Math.sin(t.wig * 38) * 0.06 * t.wig; t.obj.rotation.z = w; t.obj.rotation.x = w * 0.6 } else { t.obj.rotation.z = t.obj.rotation.x = 0 } }
      for (let i = flights.length - 1; i >= 0; i--) { const f = flights[i]
        if (f.g) { const q = targets.has(f.g.id) ? f.g.pos() : null; if (!q) { root.remove(f.m); f.m.material.dispose(); flights.splice(i, 1); continue }
          const d = new THREE.Vector3(q[0], q[1], q[2]).sub(f.m.position), l = d.length(), s = f.v * dt
          if (l <= s + f.g.r) { info.targetHits.push(f.g.id); puff(f.m.position.toArray(), '#ffe2a0', 0.15, 0.9, 0.25); root.remove(f.m); f.m.material.dispose(); flights.splice(i, 1); f.g.onHit?.(f.g.id) } else f.m.position.addScaledVector(d, s / l)
          continue }
        const d = f.to.clone().sub(f.m.position), l = d.length(), s = f.v * dt
        if (l <= s) { hitTree(f.t, 'shot'); info.hits.push({ zone: f.t.zone, id: f.t.id, w: 'shot' }); puff(f.to.toArray(), '#ffe2a0', 0.15, 0.9, 0.25); root.remove(f.m); f.m.material.dispose(); flights.splice(i, 1) } else f.m.position.addScaledVector(d, s / l) }
      for (let i = fx.length - 1; i >= 0; i--) { const e = fx[i]; e.t += dt; const u = Math.min(1, e.t / e.dur); e.m.scale.setScalar(e.r0 + (e.r1 - e.r0) * u); e.m.material.opacity = 0.9 * (1 - u); if (u >= 1) { root.remove(e.m); e.m.material.dispose(); fx.splice(i, 1) } }
    },
    counts: () => state.counts(),
    status: () => ({ status: state0.status, shown: state0.status === 'OK' }), // für das Knet-Modul (wartet auf geladene Bäume)
    balls: () => balls.map((b) => ({ key: b.key, zone: b.key.split(':')[0], kind: b.kind, state: b.state, p: (b.state === 'hanging' ? b.anchor : b.body?.p || b.anchor).slice(), r: b.r })),
    stats: () => ({ status: state0.status, error: state0.error, trees: trees.length, loaded: state0.loaded, balls: balls.length, zones: orchards.map((o) => ({ zone: o.zone, ...o.stats() })), shots: info.shots, blasts: info.blasts, hits: info.hits.length, targetHits: info.targetHits.length }),
    dispose() { geo.dispose(); mat.dispose(); fxGeo.dispose(); for (const e of fx) e.m.material.dispose(); for (const f of flights) f.m.material.dispose()
      root.traverse((m) => { if (m.isMesh && m !== mesh) { m.geometry?.dispose?.() } }); root.clear() },
  }
}
