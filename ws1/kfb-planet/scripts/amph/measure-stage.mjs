// Bühnenfläche im Amphitheater messen (Modell-Einheiten): Mitte, Oberfläche, Rand in vier Richtungen, Unterseite.
// Oberfläche = obere Höhenstufe im Kern (das Profil hat zwei Stufen: Oberfläche und die geschlossene Bodenplatte darunter).
// Aufruf: node scripts/amph/measure-stage.mjs <glb>
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(process.argv[2])
const prim = doc.getRoot().listMeshes()[0].listPrimitives()[0], P = prim.getAttribute('POSITION').getArray(), I = prim.getIndices().getArray()
let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]
for (let i = 0; i < P.length; i += 3) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], P[i + k]); mx[k] = Math.max(mx[k], P[i + k]) }
// Höhe von oben (senkrechter Strahl gegen die Dreiecke): höchste Fläche unter y_max
const topAt = (x, z, below = 1e9) => { let best = -1e9; for (let t = 0; t < I.length; t += 3) { const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3
  const d = (P[b + 2] - P[c + 2]) * (P[a] - P[c]) + (P[c] - P[b]) * (P[a + 2] - P[c + 2]); if (Math.abs(d) < 1e-14) continue
  const l1 = ((P[b + 2] - P[c + 2]) * (x - P[c]) + (P[c] - P[b]) * (z - P[c + 2])) / d, l2 = ((P[c + 2] - P[a + 2]) * (x - P[c]) + (P[a] - P[c]) * (z - P[c + 2])) / d, l3 = 1 - l1 - l2
  if (l1 < 0 || l2 < 0 || l3 < 0) continue; const y = l1 * P[a + 1] + l2 * P[b + 1] + l3 * P[c + 1]; if (y > best && y < below) best = y } return best }
const cx = -0.0008, cz = 0.1113 // Mitte der Bühnenfläche (Kern mit kleinster Höhenstreuung, frühere Messung)
const y0 = topAt(cx, cz, 0)
const edge = (dx, dz) => { for (let r = 0.2; r < 0.7; r += 0.0025) { const y = topAt(cx + dx * r, cz + dz * r, 0.3); if (y > y0 + 0.004) return +r.toFixed(4) } return null }
const out = { box: { min: mn.map((v) => +v.toFixed(4)), max: mx.map((v) => +v.toFixed(4)) }, center: [cx, cz], floorTop: +y0.toFixed(4),
  edge: { back: edge(0, -1), front: edge(0, 1), left: edge(-1, 0), right: edge(1, 0) }, underside: +mn[1].toFixed(4) }
console.log(JSON.stringify(out))
