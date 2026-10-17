// M3 · Stunt-Testfeld für die Fahrhilfe (BRIEF_WS1_DRIVING_ASSIST_M3_R1, V-379) – Platzhalter, bis Slice 1 Rampen und Wände im Kollisions-Deskriptor
// liefert (Hang ≠ Wand). Liegt im Fahrmodus (#m1,car) auf dem flachen Platz um das Theater, in J17-Metern (× K/WORLD_K für wscale=legacy):
// Rampen rechts (+X) nebeneinander, Anlauf von vorn (+Z) Richtung −Z, Absprung bei z ≈ 4–5; Gebäude links (−X).
//   Rampen (Keile, Boden für K2B: Normale nach oben)  flach 12° · steil 22° · Kicker 32° · Tafel (Auffahrt 18°, oben flach, hinten Kante 0,7 m)
//   Gebäude (Quader, Wände für K2B)                   zwei Blöcke, eine Ecke (L aus zwei Blöcken), eine Gasse (zwei Blöcke, 3,2 m Abstand)
// userData.stunt = { kind: 'ramp' | 'wall', id, ride? } – Stufe F markiert Wandflächen über ride (nur dort Wandfahrt, V-379 Entscheid 1).
import * as THREE from 'three'
import { useMemo } from 'react'
import { RigidBody, ConvexHullCollider, CuboidCollider } from '@react-three/rapier'
import { makeClayFamily } from '../vendor/billboard/billboard-clay.js'
import { K } from '../m1/m1Scale.js'
import { STUNT, J, rampVerts, wallBox } from './stuntData.js'

// Netz des Keils = seine konvexe Hülle (Brute Force, ≤ 12 Punkte: alle Dreiecke, deren Ebene alle Punkte auf einer Seite hat)
function hullGeo(pts) {
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(hullTris(pts.map((p) => new THREE.Vector3(...p))), 3)); g.computeVertexNormals(); return g
}
function hullTris(v) {
  const out = [], n = v.length, e = 1e-6 * J
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
    const nrm = new THREE.Vector3().subVectors(v[j], v[i]).cross(new THREE.Vector3().subVectors(v[k], v[i])); if (nrm.lengthSq() < 1e-10) continue
    let pos = 0, neg = 0; for (let m = 0; m < n; m++) { const d = nrm.dot(new THREE.Vector3().subVectors(v[m], v[i])); if (d > e) pos++; else if (d < -e) neg++ }
    if (pos && neg) continue
    const [a, b, c] = neg ? [v[i], v[j], v[k]] : [v[i], v[k], v[j]]; out.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z)
  }
  return out
}

export default function StuntField() {
  const mats = useMemo(() => { const fam = makeClayFamily('G', { uClayNear: { value: 30 * K }, uClayFar: { value: 90 * K }, uClayScale: { value: 1.4 * K }, uClayAmt: { value: 0.45 } }, { oct: 2, near: true, stick: false })
    return { ramp: fam.std('#d9a35f', 0.9), wall: fam.std('#b98a73', 0.92) } }, [])
  const ramps = useMemo(() => STUNT.ramps.map((r) => { const pts = rampVerts(r); return { r, pts: new Float32Array(pts.flat()), geo: hullGeo(pts) } }), [])
  return (
    <group name="m3-stunt-field">
      {ramps.map(({ r, pts, geo }) => (
        <RigidBody key={r.id} type="fixed" colliders={false} name={'m3-ramp-' + r.id} userData={{ stunt: { kind: 'ramp', id: r.id } }}>
          <ConvexHullCollider args={[pts]} />
          <mesh geometry={geo} material={mats.ramp} castShadow receiveShadow />
        </RigidBody>
      ))}
      {STUNT.walls.map((b) => { const q = wallBox(b); return (
        <RigidBody key={b.id} type="fixed" colliders={false} name={'m3-wall-' + b.id} position={q.c} userData={{ stunt: { kind: 'wall', id: b.id, ride: !!b.ride } }}>
          <CuboidCollider args={q.h} />
          <mesh material={mats.wall} castShadow receiveShadow><boxGeometry args={q.h.map((x) => x * 2)} /></mesh>
        </RigidBody>
      ) })}
    </group>
  )
}
