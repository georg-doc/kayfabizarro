// WS-NPC · S3 Szenen-Wirt hinter #scenes (Lead 25.10.): Raster (austauschbar, heute Platzhalter sceneGrid) + Regie R0 (sceneDirector) + Modul-Fabriken je Typ.
// Setzt die von der Regie gewählte Szene als Modul an ihren Anker, lässt sie leben und baut sie ab, wenn sie hinter dem Spieler außer Bild und weiter als
// despawnR entfernt ist (Konzept §5.1: Erscheinen und Verschwinden nur außerhalb des Bildes). Beim Abbau schreibt die Szene ein Protokoll für das Gedächtnis
// (je characterId, offen für locusId/vehicleId nach V-714; Spielstand /2 ist Sache des Leads – hier nur im Speicher).
// Host-Vertrag R1.2: create(options) → { object3d, update(dt, hctx), dispose }; dazu scenes(), log(), sources() (für die Wechselrede), director, grid.
import * as THREE from 'three'

// options: { grid, director, factories: { typ: (scene) → Modul }, player() → { x, y, z } | null, heading?() → rad (sonst aus der Bewegung), clock() → s, despawnR, tickS?, maxActive? }
export function createSceneHost(options) {
  const { grid, director, factories = {}, despawnR = 300, tickS = 0.5, maxActive = 4 } = options
  const root = new THREE.Group(); root.name = 'scenes'
  const S = { live: new Map(), log: [], last: null, acc: 0, t: 0, errors: [] }
  const frustum = new THREE.Frustum(), _pv = new THREE.Matrix4(), _sph = new THREE.Sphere(new THREE.Vector3(), 1)
  const seen = (sc, cam, y) => { if (!cam) return true; cam.updateMatrixWorld(); _pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); frustum.setFromProjectionMatrix(_pv); _sph.center.set(sc.anker.x, y + 2, sc.anker.z); _sph.radius = sc.anker.R + 2; return frustum.intersectsSphere(_sph) }
  function spawn(sc) {
    const f = factories[sc.typ]
    if (!f) { S.errors.push({ id: sc.id, error: 'keine Fabrik für ' + sc.typ }); return }
    let m; try { m = f(sc) } catch (e) { S.errors.push({ id: sc.id, error: String(e?.message || e) }); return }
    root.add(m.object3d); S.live.set(sc.id, { sc, m, t0: S.t, seenAt: null })
  }
  function despawn(id, why) {
    const L = S.live.get(id); if (!L) return
    root.remove(L.m.object3d); try { L.m.dispose?.() } catch (e) { /* weiter */ }
    S.live.delete(id); director.release?.(L.sc.zelle)
    // Gedächtnis-Protokoll: wer war da, wie lange, ob der Spieler die Szene gesehen hat (Belege für /2, V-714)
    S.log.push({ scene: id, typ: L.sc.typ, ausloeser: L.sc.ausloeser, characterIds: L.sc.besetzung.map((b) => b.characterId), locusId: L.sc.locusId, t0: +L.t0.toFixed(1), t1: +S.t.toFixed(1), gesehen: L.seenAt != null, grund: why })
    if (S.log.length > 64) S.log.shift()
  }
  return {
    object3d: root,
    update(dt, hctx) {
      S.t = options.clock ? options.clock() : S.t + dt
      const p = options.player?.() || null, cam = hctx?.camera || null
      for (const L of S.live.values()) { L.m.update?.(dt, hctx); if (L.seenAt == null && p && Math.hypot(p.x - L.sc.anker.x, p.z - L.sc.anker.z) < 40 && seen(L.sc, cam, p.y)) L.seenAt = S.t }
      if ((S.acc += dt) < tickS || !p) return
      S.acc = 0
      const moved = S.last ? Math.hypot(p.x - S.last.x, p.z - S.last.z) : 0
      if (moved > 0.3) S.heading = Math.atan2(p.x - S.last.x, p.z - S.last.z)   // Laufrichtung aus der Bewegung (ohne heading()-Option)
      S.last = { x: p.x, z: p.z }
      // Abbau: hinter dem Spieler (außer Bild) und weiter als despawnR
      // nur hinter dem Spieler (Winkel zur Laufrichtung > 90°): voraus gesetzte Szenen bleiben stehen, bis man an ihnen vorbei ist (Konzept §5.1)
      const h = options.heading?.() ?? S.heading
      const behind = (sc) => h == null || Math.cos(Math.atan2(sc.anker.x - p.x, sc.anker.z - p.z) - h) < 0
      for (const [id, L] of S.live) { const d = Math.hypot(p.x - L.sc.anker.x, p.z - L.sc.anker.z); if (d > despawnR && behind(L.sc) && !seen(L.sc, cam, p.y)) despawn(id, 'hinter dem Spieler') }
      if (S.live.size >= maxActive) return
      const occupied = new Set([...S.live.values()].map((L) => L.sc.zelle.join(',')))
      const sc = director.step({ t: S.t, movedM: moved, pos: p, heading: options.heading?.() ?? S.heading ?? 0, occupied })
      if (sc) spawn(sc)
    },
    state: () => ({ live: S.live.size, heading: S.heading ?? null, director: director.state(), errors: S.errors.length }),
    scenes: () => [...S.live.values()].map((L) => ({ ...L.sc, status: L.m.status?.() ?? null, gesehen: L.seenAt != null })),
    log: () => S.log.slice(),
    errors: () => S.errors.slice(),
    // Karte der Szene, in der eine Figur steht ('deck:num'), für die Wechselrede (talkDirector cardHint)
    cardOf: (characterId) => { for (const L of S.live.values()) if (L.sc.karte && L.sc.besetzung.some((b) => b.characterId === characterId)) return L.sc.karte; return null },
    // Module mit Ereignissen bzw. Ankern für die Wechselrede (talkDirector.sources)
    sources: () => Object.fromEntries([...S.live.values()].map((L) => ['scene:' + L.sc.id, L.m])),
    director, grid,
    dispose() { for (const id of [...S.live.keys()]) despawn(id, 'Ende'); root.clear() },
  }
}
