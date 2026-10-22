// C3b (V-434/V-437/V-450) · Fundsachen sichtbar: alle mit **gleichem Bodenabstand 0,15 m** (Unterkante über dem Gelände, Georg 18.10.), längliche Stücke und
// Werkzeuge mit Griff 35° gekippt (floatTilt aus der Beute-Tabelle), drehen sich langsam (≈ 1 Umdrehung / 3 s) mit ±5 % Wippen, Phase je Stück zufällig;
// weicher Kontaktfleck am Boden (contactBlob, kein Glanz, keine Kontur, ein Licht-Rig). Die Kippung sitzt innen, die Drehung um die Senkrechte außen –
// so bleibt die Höhe der Unterkante beim Drehen gleich.
// Aufheben (pick) und Wegwerfen (drop: Stück schwebt wieder vor dem Spieler) ruft der Wirt (Taste I / R5f „Interagieren“, Rucksack). Platzierung: world/loot.
// Modelle: WSB B28 r2 (Ursprung = bbox-Mitte, Maße in Rig-Einheiten, × unit = 0,616 m), je Modell einmal geladen und geklont. Knete über claySSOT (midground).
// Modul nach Host-Vertrag R1.2. options: { items (placeLoot), terrainH(x, z), clearance = 0,15 m, unit = 0,616381042, url(it) }
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { LOOT, lootUrl } from '../world/loot.js'
import { contactBlob } from './contactBlob'

export const FLOAT = Object.freeze({ turnS: 3, bob: 0.05, bobHz: 0.55, pickR: 1.7, clearance: 0.15, tiltDeg: 35 })
// V-654 C6 (MVP-Kritiker R1 K4, löst V-450 ab): Fundsachen LIEGEN – Unterkante 1,2 cm im Gelände, flach an der Bodenneigung, längliche Stücke umgelegt,
// keine Drehung, kein Wippen, kein Kontaktfleck (V-587). Erdkeil + Kontakt-Steinchen baut world/grounding (Quelle items()). Hash found=float = alte Schwebe-Fassung.
export const REST = Object.freeze({ sink: 0.012 })
const FLOATING = typeof location !== 'undefined' && /(^|[#,])found=float(,|$)/.test(location.hash)

export function createFoundItems3d({ items = [], terrainH, clearance = FLOAT.clearance, unit = 0.616381042, url = lootUrl } = {}) {
  if (!terrainH) throw new Error('FOUND_NO_TERRAIN')
  const root = new THREE.Group(); root.name = 'found-items'
  const byId = Object.fromEntries(LOOT.map((t) => [t.id, t])), loader = new GLTFLoader(), cache = new Map(), state = { status: 'LOADING', error: null, picked: 0, dropped: 0 }
  const live = items.map((it) => ({ ...it, obj: null, blob: null, here: true, t: it.phase || 0 }))
  const norm = (src, tilt) => { const o = src.clone(true), inner = new THREE.Group(), g = new THREE.Group(); o.scale.setScalar(unit); inner.add(o)
    if (FLOATING) { if (tilt) inner.rotation.x = (FLOAT.tiltDeg * Math.PI) / 180 }
    else { o.updateMatrixWorld(true); const b0 = new THREE.Box3().setFromObject(o), sz = b0.getSize(new THREE.Vector3()); if (sz.y > 1.3 * Math.max(sz.x, sz.z)) inner.rotation.x = Math.PI / 2 }   // hohe/längliche Stücke liegen
    g.add(inner); g.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true } }); g.updateMatrixWorld(true)
    const b = new THREE.Box3().setFromObject(inner), half = (b.max.y - b.min.y) / 2, foot = Math.max(b.max.x - b.min.x, b.max.z - b.min.z); g.userData.half = half; g.userData.foot = foot; g.userData.box = b.clone(); return g }
  const show = (L) => {
    if (!L.obj) { L.obj = norm(cache.get(L.id), L.tilt); L.obj.name = 'item:' + L.key; root.add(L.obj); if (FLOATING) { const f = L.obj.userData.foot * 1.1; L.blob = contactBlob(f, f, 0.42); root.add(L.blob) } }
    L.obj.visible = L.here; if (L.blob) L.blob.visible = L.here
    if (!FLOATING && L.here) rest(L)
  }
  const ready = Promise.all([...new Set(live.map((L) => L.id))].map((id) => loader.loadAsync(url(byId[id])).then((g) => cache.set(id, g.scene))))
    .then(() => { live.forEach(show); state.status = 'OK' }).catch((e) => { state.status = 'ERROR'; state.error = String(e?.message || e) })
  // Liegen: Unterkante REST.sink im Gelände, an die Bodenneigung gekippt (Normale aus dem Gelände), Drehung um die Senkrechte je Stück fest
  const up = new THREE.Vector3(0, 1, 0), nrm = new THREE.Vector3(), qy = new THREE.Quaternion(), qn = new THREE.Quaternion()
  const rest = (L) => { const e = 0.25, h = terrainH, x = L.x, z = L.z
    nrm.set(h(x - e, z) - h(x + e, z), 2 * e, h(x, z - e) - h(x, z + e)).normalize(); qn.setFromUnitVectors(up, nrm); qy.setFromAxisAngle(up, L.phase || 0)
    L.obj.quaternion.copy(qn).multiply(qy); L.obj.position.set(x, h(x, z) + L.obj.userData.half - REST.sink, z)
    // am Hang: die vier unteren Ecken der Hülle je auf ihr eigenes Gelände beziehen – die höchste liegt REST.sink im Boden, keine taucht tiefer als nötig
    const b = L.obj.userData.box, c = new THREE.Vector3(); let worst = -Infinity; L.obj.updateMatrix()
    for (const [cx, cz] of [[b.min.x, b.min.z], [b.max.x, b.min.z], [b.min.x, b.max.z], [b.max.x, b.max.z]]) { c.set(cx, b.min.y, cz).applyMatrix4(L.obj.matrix); worst = Math.max(worst, c.y - h(c.x, c.z)) }
    L.obj.position.y -= worst + REST.sink }
  const nearest = (p, r = FLOAT.pickR) => { let best = null, bd = r; for (const L of live) { if (!L.here) continue; const d = Math.hypot(L.x - p[0], L.z - p[2]); if (d < bd) { bd = d; best = L } } return best }
  return {
    object3d: root,
    ready,
    status: () => ({ status: state.status, shown: state.status === 'OK', error: state.error }),
    near: (p) => { const L = nearest(p); return L ? { key: L.key, id: L.id, n: L.n } : null }, // für „i“ mit Ziel (R5f setTarget)
    pick(p) { const L = nearest(p); if (!L) return null; L.here = false; show(L); state.picked++; return { key: L.key, id: L.id, n: L.n, icon: L.icon, type: L.type } },
    drop(item, p, dir) { // Wegwerfen: Stück schwebt 1,2 m vor dem Spieler wieder
      let L = live.find((x) => x.key === item.key); if (!L) { L = { ...item, here: true, t: 0, obj: null, blob: null }; live.push(L) }
      L.x = p[0] + dir[0] * 1.2; L.z = p[2] + dir[2] * 1.2; L.here = true; if (cache.has(L.id)) show(L); state.dropped++; return { key: L.key, x: L.x, z: L.z } },
    // Prüfhilfe (V-654): Abstand der vier unteren Hüllen-Ecken zum Gelände unter der jeweiligen Ecke (m): max ≤ 0 = nirgends schwebend, min = tiefstes Einsinken
    contact: () => live.filter((L) => L.obj && L.here).map((L) => { const b = L.obj.userData.box, c = new THREE.Vector3(), d = []; L.obj.updateMatrix()
      for (const [cx, cz] of [[b.min.x, b.min.z], [b.max.x, b.min.z], [b.min.x, b.max.z], [b.max.x, b.max.z]]) { c.set(cx, b.min.y, cz).applyMatrix4(L.obj.matrix); d.push(c.y - terrainH(c.x, c.z)) }
      return { key: L.key, max: Math.max(...d), min: Math.min(...d) } }),
    anchors: () => live.filter((L) => L.obj).map((L) => ({ id: 'item:' + L.key, kind: 'item', x: L.x, z: L.z, r: L.obj.userData.foot * 0.5, visible: L.here })),   // V-654: Fußpunkte für world/grounding
    items: () => live.map((L) => ({ key: L.key, id: L.id, type: L.type, tilt: !!L.tilt, x: L.x, z: L.z, here: L.here, y: L.obj?.position.y ?? null, half: L.obj?.userData.half ?? null, ground: terrainH(L.x, L.z) })),
    update(dt) {
      dt = Math.min(dt || 0, 0.1)
      for (const L of live) {
        if (!L.obj || !L.here || !FLOATING) continue
        L.t += dt; const g = terrainH(L.x, L.z), c = clearance + L.obj.userData.half, y = g + c * (1 + FLOAT.bob * Math.sin(L.t * Math.PI * 2 * FLOAT.bobHz + (L.phase || 0)))
        L.obj.position.set(L.x, y, L.z); L.obj.rotation.y = (L.t / FLOAT.turnS) * Math.PI * 2 + (L.phase || 0)
        L.blob.position.set(L.x, g + 0.01, L.z); const k = 1 - 0.25 * (y - g - c) / Math.max(0.01, c * FLOAT.bob * 2); L.blob.material.opacity = L.blob.userData.op0 * Math.max(0.6, Math.min(1, k))
      }
    },
    stats: () => ({ ...state, items: live.length, here: live.filter((L) => L.here).length, clearance: FLOATING ? clearance : -REST.sink, mode: FLOATING ? 'float' : 'rest' }),
    dispose() { root.traverse((m) => { if (m.isMesh && m.name !== 'contact-blob') m.geometry?.dispose?.() }); for (const L of live) L.blob?.material.dispose(); root.clear() },
  }
}
