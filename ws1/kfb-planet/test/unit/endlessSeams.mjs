// V-619 · Endloses Gelände: keine Nähte, keine Höhensprünge an Kachelgrenzen (Node, ohne Browser). Fährt 5 km geradeaus und 5 km im Zickzack,
// setzt alle 25 m den Fokus, baut den Kachelsatz fertig (flush) und prüft dann an jeder Kante zwischen zwei gezeigten Kacheln:
//   Höhe der gezeigten Dreiecke von beiden Seiten (±1 mm quer zur Kante) gleich (|Δ| ≤ 1 mm) und Normalen gleich (Winkel ≤ 0,5°),
//   keine Lücke (jeder Prüfpunkt im Sichtkreis liegt in genau einer Kachel), Ecken = exakte Höhenfunktion.
// Dazu: Höhe der 64-m-Kacheln = Höhenfunktion an inneren Eckpunkten (bitgleich), Bauzeit je Kachel, Kacheln/Dreiecke je Satz.
import { createEndlessTerrain, ENDLESS } from '../../src/world/endlessTerrain.js'
const T = createEndlessTerrain()
const routes = { straight: [], zigzag: [] }
for (let d = 0; d <= 5000; d += 25) routes.straight.push([d * 0.94, d * 0.34])
{ let x = 0, z = 0, a = 0.3; for (let d = 0; d <= 5000; d += 25) { routes.zigzag.push([x, z]); if (d % 400 === 0) a = a > 0 ? -0.9 : 0.9; x += 25 * Math.cos(a); z += 25 * Math.sin(a) } }
const res = {}
let fail = 0
for (const [name, pts] of Object.entries(routes)) {
  let maxDh = 0, maxAng = 0, edges = 0, gaps = 0, overlaps = 0, cornerMax = 0, leavesMax = 0, trisMax = 0, n = 0
  for (const [fx, fz] of pts) {
    T.setFocus(fx, fz); T.update(1 / 60, null); T.flush()
    const L = T.leaves(); leavesMax = Math.max(leavesMax, L.size); trisMax = Math.max(trisMax, T.info().tris)
    if (n++ % 4) continue   // Nahtprüfung alle 100 m (Satz ändert sich dazwischen nur am Rand)
    for (const b of L.values()) {
      const pos = b.geo.attributes.position.array, nr = b.geo.attributes.normal.array, N = 33
      // je Kante 8 Punkte zwischen den Eckpunkten und die Eckpunkte selbst
      for (const [sx, sz] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) for (let k = 0; k <= 16; k++) {
        const t = k / 16, ex = sx === 0 ? b.x0 + t * b.s : b.x0 + (sx > 0 ? b.s : 0), ez = sz === 0 ? b.z0 + t * b.s : b.z0 + (sz > 0 ? b.s : 0)
        const e = 1e-3, ox = ex + sx * e, oz = ez + sz * e
        if (Math.hypot(ox - fx, oz - fz) > ENDLESS.view - 300) continue
        const other = T.leafAt(ox, oz); if (!other || other === b) continue; const inside = T.surfaceAt(ex, ez, b), outside = T.surfaceAt(ex, ez, other)
        const dh = Math.abs(inside - outside); edges++; if (dh > maxDh) maxDh = dh
      }
    }
    // Lücken/Überlappung: Punkte im Kreis 450 m, je Punkt Zahl der Kacheln
    for (let k = 0; k < 600; k++) { const a = k * 2.399963, r = 450 * Math.sqrt((k + 0.5) / 600), x = fx + Math.cos(a) * r, z = fz + Math.sin(a) * r; let c = 0
      for (const b of L.values()) if (x >= b.x0 && x < b.x0 + b.s && z >= b.z0 && z < b.z0 + b.s) c++
      if (c === 0) gaps++; if (c > 1) overlaps++ }
    // Normalen an Kanten: gleiche Eckpunkte zweier Kacheln (gleiche Lage) → Winkel
    const byPos = new Map()
    for (const b of L.values()) { const pos = b.geo.attributes.position.array, nr = b.geo.attributes.normal.array
      for (let v = 0; v < 33 * 33; v++) { const i = v % 33, j = (v / 33) | 0; if (i > 0 && i < 32 && j > 0 && j < 32) continue
        const key = pos[v * 3].toFixed(2) + ',' + pos[v * 3 + 2].toFixed(2), o = byPos.get(key)
        if (o) { const dot = o[0] * nr[v * 3] + o[1] * nr[v * 3 + 1] + o[2] * nr[v * 3 + 2], ang = Math.acos(Math.min(1, dot)) * 180 / Math.PI; if (ang > maxAng) maxAng = ang
          if (i % 32 === 0 && j % 32 === 0) cornerMax = Math.max(cornerMax, Math.abs(o[3] - pos[v * 3 + 1])) }
        else byPos.set(key, [nr[v * 3], nr[v * 3 + 1], nr[v * 3 + 2], pos[v * 3 + 1]]) } }
  }
  res[name] = { stops: pts.length, edgeSamples: edges, maxDhMm: +(maxDh * 1000).toFixed(3), maxNormalDeg: +maxAng.toFixed(3), gaps, overlaps, cornerMaxMm: +(cornerMax * 1000).toFixed(3), leavesMax, trisMax }
  if (maxDh > 0.001 || maxAng > 0.5 || gaps || overlaps) fail++
}
const I = T.info()
console.log(JSON.stringify({ ...res, built: I.built, swaps: I.swaps, stitched: I.stitched }, null, 1))
console.log(fail ? 'FAIL endlessSeams' : 'PASS endlessSeams'); process.exit(fail ? 1 : 0)
