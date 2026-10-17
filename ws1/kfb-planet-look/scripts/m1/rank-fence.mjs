// M1 · Zaun um die Ränge (V-283) gegen die Höhenkarte des Theaters, ohne Browser. Modell wie modules/amphitheater laden und setzen (SHA-256 gegen
// den Pin AMPH_SHA256), Dreiecke in ein 0,1-m-Raster legen (höchster Punkt je Zelle = erster Treffer von oben).
//   node scripts/m1/rank-fence.mjs --emit   Innen- und Außenprofil neu messen (Außen: je 2,5° von −155° bis +155° die äußerste Theatergeometrie
//                                           über dem Gelände, Maximum über ±2,5°, plus 0,05 m → RANK_PROFILE_OUT). Innen: je 2,5° (−150…+150°, 0° = −Z) der Radius der ersten Stufe (≥ 0,2 m über dem
//                                           Bühnenboden), Minimum über ±2,5°, minus 0,05 m → RANK_PROFILE in src/m1/m1Host.js
//   node scripts/m1/rank-fence.mjs          prüfen (Prüfer M1-4, Befunde 1/2/11):
//     a) keine Rang-Zelle (≥ 0,5 m) außerhalb des Zauns – ausgenommen der vordere Ring vor der Bühne (|Winkel| > 150°, r < 12; Frage an WS0)
//     b) kaum Bühnenboden im Zaun: ebene Zellen (|y| < 0,05 m) im Zaun, die mehr als 0,3 m vor der ersten Stufe liegen, ≤ 0,5 m²
//     c) Abstand Zaun → erste Stufe ≤ 0,3 m je Winkel
//     e) kein freies Gelände tief im Zaun (Prüfer M1-5, Befund N4): von außen erreichbare Zellen ohne Theatergeometrie über dem Gelände (Flutfüllung;
//        Nischen innerhalb der Mauern zählen nicht), die mehr als 0,3 m hinter der Zaunfläche liegen. Ein Grundriss aus Radialprofilen kann keine Löcher
//        mitten in den Rängen auslassen: übrig sind eine Nische zwischen vorderem Ring und rechtem Flügel (≈ 143°, r ≈ 12, bis 2,5 m tief) und Taschen
//        zwischen den Strebepfeilern hinter der Rückwand – zusammen 13,2 m² (Stand 15.10.; vorher 184 m² mit dem Bogen r 19). Grenze 15 m², berichtet;
//        das Kollisionsnetz von WS0 (V-283) löst das sauber.
//     d) Kollider dicht und ohne Überstand (Prüfer M1-4, Befunde 1/5): Rapier nimmt je Prisma die konvexe Hülle der Ecken. Punkte 2 cm innerhalb jeder
//        Kante liegen in einer Hülle; Punkte 0,3 m innerhalb ebenso (Mindestdicke); außerhalb des Grundrisses höchstens 2 Rasterpunkte (5 cm) in einer Hülle
import fs from 'fs'
import crypto from 'crypto'
const T = new URL('../../node_modules/three/', import.meta.url).href
const THREE = await import(T + 'build/three.module.js')
const { GLTFLoader } = await import(T + 'examples/jsm/loaders/GLTFLoader.js')
const H1 = await import(new URL('../../src/m1/m1Host.js', import.meta.url).href)
// V-345: m1Host hält den Zaun in J17-Metern (× K); dieses Skript misst und prüft weiter in alten WS1-Bühnenmetern (Modell ohne worldK, alle
// Grenzwerte unten) – der Zaun wird dafür hier durch K geteilt. --emit gibt die Profile in alten Metern aus (m1Host rechnet sie × K).
const { K } = await import(new URL('../../src/m1/m1Scale.js', import.meta.url).href)
const RANK_FENCE = { ...H1.RANK_FENCE, top: H1.RANK_FENCE.top / K, bottom: H1.RANK_FENCE.bottom / K }, RANK_PROFILE = H1.RANK_PROFILE.map((r) => r / K)
const inRankFence = (x, z) => H1.inRankFence(x * K, z * K), rankInnerR = (a) => H1.rankInnerR(a) / K, rankFenceClear = (x, z) => H1.rankFenceClear(x * K, z * K) / K
const rankFenceOutline = () => { const o = H1.rankFenceOutline(); return { ...o, pts: o.pts.map(([x, z]) => [x / K, z / K]) } }
const rankFence = () => H1.rankFence().map((f) => ({ ...f, tri: f.tri.map(([x, z]) => [x / K, z / K]), quad: f.quad.map(([x, z]) => [x / K, z / K]), verts: f.verts.map((v) => v / K) }))
globalThis.self = globalThis
// Maße und Pin wie modules/amphitheater (dort nicht importierbar: der Shader-Spender braucht den Browser), hier gespiegelt und am Quelltext geprüft
const src = fs.readFileSync(new URL('../../src/modules/amphitheater.js', import.meta.url), 'utf8')
const STAGE = { center: [-0.0008, 0.1113], floorY: -0.2342, floorR: 0.37, diameterM: 14 }, AMPH_SCALE = STAGE.diameterM / 2 / STAGE.floorR
const PIN = /AMPH_SHA256 = '([0-9a-f]{64})'/.exec(src)?.[1], AMPH_PATH = /AMPH_PATH = '([^']+)'/.exec(src)?.[1]
if (!src.includes(`center: [${STAGE.center.join(', ')}], floorY: ${STAGE.floorY}, floorR: ${STAGE.floorR}`)) { console.log('FAIL m1-rank-fence (STAGE-Maße weichen von amphitheater.js ab)'); process.exit(1) }
const cand = [process.env.AMPH_GLB, `${process.env.HOME}/kfb-ws1/assets/meshy-browser/kfb-stage-amphitheater-meshy.browser.v1.glb`, `${process.env.HOME}/kfb-ws1/kayfabizarro/${AMPH_PATH}`].filter(Boolean)
const file = cand.find((f) => fs.existsSync(f)); if (!file) { console.log('FAIL m1-rank-fence (Theater-GLB nicht gefunden)'); process.exit(2) }
const b = fs.readFileSync(file), sha = crypto.createHash('sha256').update(b).digest('hex')
if (sha !== PIN) { console.log(`FAIL m1-rank-fence (GLB-Hash ${sha.slice(0, 8)} ≠ Pin ${PIN?.slice(0, 8)})`); process.exit(1) }
const warn = console.warn; console.warn = () => {}
const g = await new Promise((res, rej) => new GLTFLoader().parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.length), '', res, rej)); console.warn = warn
const s = AMPH_SCALE, m = g.scene; m.scale.setScalar(s); m.position.set(-STAGE.center[0] * s, -STAGE.floorY * s, -STAGE.center[1] * s); m.updateMatrixWorld(true)
const meshes = []; m.traverse((o) => { if (o.isMesh) meshes.push(o) })
const G = 0.1, X0 = -21, Z0 = -21, NX = 421, NZ = 381, top = new Float32Array(NX * NZ).fill(-Infinity)
const a = new THREE.Vector3(), b2 = new THREE.Vector3(), c = new THREE.Vector3()
for (const me of meshes) {
  const pos = me.geometry.attributes.position, ix = me.geometry.index, n = ix ? ix.count : pos.count, vi = (k) => (ix ? ix.getX(k) : k)
  for (let t = 0; t < n; t += 3) {
    a.fromBufferAttribute(pos, vi(t)).applyMatrix4(me.matrixWorld); b2.fromBufferAttribute(pos, vi(t + 1)).applyMatrix4(me.matrixWorld); c.fromBufferAttribute(pos, vi(t + 2)).applyMatrix4(me.matrixWorld)
    const det = (b2.z - c.z) * (a.x - c.x) + (c.x - b2.x) * (a.z - c.z); if (Math.abs(det) < 1e-12) continue
    const i0 = Math.max(0, Math.ceil((Math.min(a.x, b2.x, c.x) - X0) / G)), i1 = Math.min(NX - 1, Math.floor((Math.max(a.x, b2.x, c.x) - X0) / G))
    const j0 = Math.max(0, Math.ceil((Math.min(a.z, b2.z, c.z) - Z0) / G)), j1 = Math.min(NZ - 1, Math.floor((Math.max(a.z, b2.z, c.z) - Z0) / G))
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const x = X0 + i * G, z = Z0 + j * G, l1 = ((b2.z - c.z) * (x - c.x) + (c.x - b2.x) * (z - c.z)) / det, l2 = ((c.z - a.z) * (x - c.x) + (a.x - c.x) * (z - c.z)) / det, l3 = 1 - l1 - l2
      if (l1 < -1e-9 || l2 < -1e-9 || l3 < -1e-9) continue
      const y = l1 * a.y + l2 * b2.y + l3 * c.y, k = j * NX + i; if (y > top[k]) top[k] = y
    }
  }
}
const H = (x, z) => { const i = Math.round((x - X0) / G), j = Math.round((z - Z0) / G); if (i < 0 || j < 0 || i >= NX || j >= NZ) return null; const v = top[j * NX + i]; return v === -Infinity ? null : v }
const RAD = Math.PI / 180, at = (deg, r) => [Math.sin(deg * RAD) * r, -Math.cos(deg * RAD) * r]
// Radius der ersten Stufe (≥ 0,2 m) längs eines Strahls ab r = 5 m
const firstStep = (deg) => { for (let r = 5; r <= 20; r += 0.02) { const y = H(...at(deg, r)); if (y != null && y >= 0.2) return r } return null }
// äußerste Theatergeometrie (über dem Gelände, y > −0,1: nicht die Bodenplatte) längs eines Strahls, von außen nach innen gesucht
const lastGeom = (deg) => { for (let r = 22; r >= 5; r -= 0.02) { const y = H(...at(deg, r)); if (y != null && y > -0.1) return r } return null }
if (process.argv.includes('--emit')) {
  const step = RANK_FENCE.profileStep, win = (lo, hi, f, agg) => { const raw = new Map(); for (let d = lo - step; d <= hi + step + 1e-9; d += 0.25) raw.set(+d.toFixed(2), f(d)); const out = []
    for (let d = lo; d <= hi + 1e-9; d += step) { let r = agg === 'min' ? Infinity : -Infinity; for (const [k, v] of raw) if (Math.abs(k - d) <= step + 1e-9 && v != null) r = agg === 'min' ? Math.min(r, v) : Math.max(r, v); out.push(r) } return out }
  const inner = win(-RANK_FENCE.a0Deg, RANK_FENCE.a0Deg, firstStep, 'min').map((r) => +(r - 0.05).toFixed(2))
  const outer = win(-RANK_FENCE.capDeg, RANK_FENCE.capDeg, lastGeom, 'max').map((r) => +(r + 0.05).toFixed(2))
  console.log(JSON.stringify({ inner, outer })); process.exit(0)
}
// von außen erreichbares freies Gelände (Flutfüllung über Zellen ohne Theater über dem Gelände, vom Rand des Rasters aus): nur das zählt als „Gras“
const freeCell = (k) => !(top[k] > -0.1), reach = new Uint8Array(NX * NZ), queue = []
for (let i = 0; i < NX; i++) for (const j of [0, NZ - 1]) { const k = j * NX + i; if (freeCell(k) && !reach[k]) { reach[k] = 1; queue.push(k) } }
for (let j = 0; j < NZ; j++) for (const i of [0, NX - 1]) { const k = j * NX + i; if (freeCell(k) && !reach[k]) { reach[k] = 1; queue.push(k) } }
while (queue.length) { const k = queue.pop(), i = k % NX, j = (k - i) / NX; for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= NX || b >= NZ) continue; const q = b * NX + a; if (!reach[q] && freeCell(q)) { reach[q] = 1; queue.push(q) } } }
const outside = [], floorIn = [], freeIn = []; let ranks = 0, worstGap = { deg: null, gap: 0 }
for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
  const x = X0 + i * G, z = Z0 + j * G, y = top[j * NX + i], inF = inRankFence(x, z)
  if (y === -Infinity) { if (inF && reach[j * NX + i] && rankFenceClear(x, z) < -0.3) freeIn.push([+x.toFixed(1), +z.toFixed(1), -rankFenceClear(x, z)]); continue }
  const r = Math.hypot(x, z), deg = Math.atan2(x, -z) / RAD
  if (inF && !(y > -0.1) && reach[j * NX + i] && rankFenceClear(x, z) < -0.3) freeIn.push([+x.toFixed(1), +z.toFixed(1), -rankFenceClear(x, z)]) // Gelände bzw. Bodenplatte ohne Theater darüber, tief im Zaun
  if (y >= 0.5 && r > 6) { ranks++; if (!inF) outside.push([+x.toFixed(1), +z.toFixed(1), +y.toFixed(2), +deg.toFixed(1), +r.toFixed(2)]) }
  // ebener Bühnenboden im Zaun: nur vor der ersten Stufe (dahinter liegen Gänge und Torbögen der Ränge – die sind Kulisse)
  if (y < 0.05 && y > -0.05 && inF && Math.abs(deg) <= RANK_FENCE.a0Deg) { const fs1 = firstStep(deg); if (fs1 != null && r < fs1 - 0.3) floorIn.push([+x.toFixed(1), +z.toFixed(1)]) }
}
for (let d = -RANK_FENCE.a0Deg; d <= RANK_FENCE.a0Deg; d += 0.5) { const f = firstStep(d); if (f == null) continue; const gap = f - rankInnerR(d * RAD); if (gap > worstGap.gap) worstGap = { deg: d, gap: +gap.toFixed(2) } }
// d) Dichte der Kollider (2D-Grundriss, Hüllen wie Rapier)
const hull = (pts) => { const p = [...pts].sort((u, v) => u[0] - v[0] || u[1] - v[1]), cr = (o, u, v) => (u[0] - o[0]) * (v[1] - o[1]) - (u[1] - o[1]) * (v[0] - o[0]), lo = [], up = []
  for (const q of p) { while (lo.length >= 2 && cr(lo.at(-2), lo.at(-1), q) <= 0) lo.pop(); lo.push(q) } for (const q of p.reverse()) { while (up.length >= 2 && cr(up.at(-2), up.at(-1), q) <= 0) up.pop(); up.push(q) } return lo.slice(0, -1).concat(up.slice(0, -1)) }
const inC = (h, x, z) => { for (let k = 0; k < h.length; k++) { const [x0, z0] = h[k], [x1, z1] = h[(k + 1) % h.length]; if ((x1 - x0) * (z - z0) - (z1 - z0) * (x - x0) < -1e-9) return false } return true }
const HULLS = rankFence().map((f) => hull(f.quad)), inAny = (x, z) => HULLS.some((h) => inC(h, x, z)), OP = rankFenceOutline().pts
let edgeMiss = 0, thinMiss = 0, protrude = 0
for (let i = 0; i < OP.length; i++) { const [x0, z0] = OP[i], [x1, z1] = OP[(i + 1) % OP.length], L = Math.hypot(x1 - x0, z1 - z0)
  for (let t = 0; t <= 1; t += 0.02) { const x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t
    for (const sg of [1, -1]) { const nx = (-(z1 - z0) / L) * sg, nz = ((x1 - x0) / L) * sg
      if (inRankFence(x + nx * 0.02, z + nz * 0.02) && !inAny(x + nx * 0.02, z + nz * 0.02)) edgeMiss++
      if (t > 0.05 && t < 0.95 && inRankFence(x + nx * 0.3, z + nz * 0.3) && !inAny(x + nx * 0.3, z + nz * 0.3)) thinMiss++ } } }
for (let x = -22; x <= 22; x += 0.05) for (let z = -22; z <= 22; z += 0.05) if (!inRankFence(x, z) && inAny(x, z)) protrude++
const tight = { colliders: HULLS.length, edgeMiss, thinMiss, protrudeCells: protrude }
const ring = outside.filter(([, , , deg, r]) => Math.abs(deg) > RANK_FENCE.a0Deg && r < 12)
const bad = outside.filter((o) => !ring.includes(o))
const floorM2 = +(floorIn.length * G * G).toFixed(2), freeM2 = +(freeIn.length * G * G).toFixed(2)
const ok = bad.length === 0 && floorM2 <= 0.5 && worstGap.gap <= 0.3 && edgeMiss === 0 && thinMiss === 0 && protrude <= 2 && freeM2 <= 15
console.log(JSON.stringify({ file, sha: sha.slice(0, 8), profilePoints: RANK_PROFILE.length, rankCells: ranks, outsideNotRing: bad.length, worst: bad.sort((p, q) => q[2] - p[2]).slice(0, 8), frontRingCells: ring.length, stageFloorInsideM2: floorM2, floorSample: floorIn.slice(0, 6), worstGap, tight, freeTerrainInsideM2: freeM2, freeMaxDepthM: +Math.max(0, ...freeIn.map((f) => f[2])).toFixed(2), freeDeepest: freeIn.sort((a, b) => b[2] - a[2]).slice(0, 6).map((f) => [f[0], f[1], +f[2].toFixed(2), +(Math.atan2(f[0], -f[1]) * 180 / Math.PI).toFixed(1)]) }))
console.log((ok ? 'PASS' : 'FAIL') + ` m1-rank-fence (Rang-Zellen ≥ 0,5 m außerhalb, ohne vorderen Ring: ${bad.length} · Bühnenboden im Zaun ${floorM2} m² · größter Abstand Zaun→Stufe ${worstGap.gap} m bei ${worstGap.deg}° · Kollider: Lücken ${edgeMiss}, zu dünn ${thinMiss}, Überstand ${protrude} · freies Gelände im Zaun ${freeM2} m²)`)
process.exit(ok ? 0 : 1)
