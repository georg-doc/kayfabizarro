// Slice 1 · Fluff-Kügelchen einer Zone als Modul nach Host-Vertrag R1.2: create(options) -> { object3d, update(dt, ctx), dispose() }.
// Logik (Verteilung, Windfall, Aufsammeln) liegt rein in src/world/fluff.js; hier nur die Darstellung: EIN InstancedMesh für alle Kügelchen
// (ein Draw Call, V-370-Budget), Farbe je Instanz = Sorte (V-292), Knet-Material austauschbar (options.material, z. B. aus clayLook).
// Gesammelte Kügelchen werden auf Größe 0 gesetzt (kein Hinzufügen/Entfernen pro Bild). Zähler nur als Debug-Info (§44.3: kein finales HUD).
// Aufsammeln: Position kommt aus ctx.player (Vector3 oder [x, y, z]); Fahrzeug, Driften und Vorbild-Position liefert der Aufrufer über collector().
// options: { field (createFluffField-Ergebnis), radius = FALL.radius, collector?: () => ({ pos, prev?, mode, vel?, drifting? }) | null,
//            onCollect?: (keys, counts) => void, material? }
import * as THREE from 'three'
import { FLUFF, FALL } from '../world/fluff.js'

export function createFluffField3d({ field, radius = FALL.radius, collector = null, onCollect = null, material = null } = {}) {
  if (!field) throw new Error('FLUFF_NO_FIELD')
  const n = field.balls.length, root = new THREE.Group(); root.name = 'fluff-field'
  const geo = new THREE.IcosahedronGeometry(radius, 2), mat = material || new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0 })
  const mesh = new THREE.InstancedMesh(geo, mat, Math.max(1, n)); mesh.name = 'fluff-balls'; mesh.castShadow = true; mesh.receiveShadow = false; mesh.count = n
  mesh.frustumCulled = false // Instanzen verteilt über die Zone; die Kugel der Grundgeometrie wäre falsch
  const c = new THREE.Color(), m4 = new THREE.Matrix4(), zero = new THREE.Matrix4().makeScale(0, 0, 0), prev = new THREE.Vector3(), cur = new THREE.Vector3()
  field.balls.forEach((b, i) => mesh.setColorAt(i, c.set(FLUFF[b.kind].color)))
  let hasPrev = false, collectedTotal = 0
  const place = () => {
    field.balls.forEach((b, i) => {
      if (b.state === 'collected') { mesh.setMatrixAt(i, zero); return }
      const p = b.state === 'hanging' ? b.anchor : b.body.p
      mesh.setMatrixAt(i, m4.makeTranslation(p[0], p[1], p[2]))
    })
    mesh.instanceMatrix.needsUpdate = true
  }
  place(); if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  root.add(mesh)
  return {
    object3d: root,
    field,
    update(dt, ctx) {
      field.advance(dt || 0)
      const col = collector ? collector() : null, pl = ctx?.player
      if (col || pl) {
        if (pl) cur.set(pl.x ?? pl[0], pl.y ?? pl[1], pl.z ?? pl[2])
        const r = field.collect(col || { pos: [cur.x, cur.y, cur.z], prev: hasPrev ? [prev.x, prev.y, prev.z] : undefined, mode: 'walk' })
        prev.copy(cur); hasPrev = !!pl
        if (r.keys.length) { collectedTotal += r.keys.length; onCollect?.(r.keys, field.counts()) }
      }
      place()
    },
    info: () => ({ balls: n, drawCalls: 1, collected: collectedTotal, ...field.stats(), counts: field.counts() }),
    dispose() { geo.dispose(); if (!material) mat.dispose(); mesh.dispose(); root.clear() },
  }
}
