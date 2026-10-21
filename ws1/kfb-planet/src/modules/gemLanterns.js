// V-487 Stufe 3 (V-471/V-476) · Kristall-Laternen: kfb-gem.v1 r4 (WS0 GEM_R1, MIT, vendor byte-gleich) als Laternen in der Laufwelt. Nachts leuchten die Steine
// von innen (lantern + halo + pool: additiver Lichtfleck am Boden für alle), echte Lichter nur über den Practicals-Pool des Licht-Moduls (≤ 6, nächste zur
// Kamera, V-357). Platzhalter-Kristall (schlanke Sechskant-Spitze + zwei Nebenkristalle auf einem Knet-Stein), bis die Figuren aus B30 (Satz M, privat) kommen – dann
// tauscht nur build(). Tag: Edelstein ohne Leuchten (Stimmung glow 0). Begleiter-Logik (Kleiner Prinz) später, hier nur Darstellung.
// Modul nach Host-Vertrag R1.2. options: { items: [{ pos: [x,y,z], preset: 'ruby'|'sapphire', scale?, yaw? }], renderer: () => WebGLRenderer, mood: () => Stimmung
//   (kfb-stage-light moodAt), ground? }  → practicals() im Format von createPracticals, info()
import * as THREE from 'three'
import { createGem, setGemEnvironment, VERSION as GEM_VERSION } from '../vendor/gem/kfb-gem.v1.js'

// Profil (r, y) in m: schlanke Sechskant-Spitze; rows = Unterteilung je Kante (kfb-gem misst die Dünne je Eckpunkt: grobe Netze glühen nachts kaum, V-487 c3g)
export const LANTERN = Object.freeze({ height: 1.0, profile: [[0, 0], [0.09, 0], [0.13, 0.1], [0.12, 0.6], [0.07, 0.84], [0, 1.0]], sides: 6, rows: 6, side: [{ s: 0.62, tilt: 0.45, at: [0.11, 0.04, 0.03], yaw: 0 }, { s: 0.45, tilt: 0.6, at: [-0.08, 0.03, 0.07], yaw: 2.4 }], stone: '#7d6f62', veinGlow: { ruby: 3.2, sapphire: 2.6 } }) // Platzhalter heller (WS0 18.10.): veinGlow über den Schach-Presets; darüber werden die Adern weiß, ohne dass der Körper heller wird (Kern ≈ 1,2 × Umfeld; der glühende Kern kommt mit den B30-Figuren, Dünne-Feld). Zustand active getestet: hellt Kern und Lichtfleck gleich auf, Verhältnis sinkt → nicht genutzt
const dense = (pts, n) => pts.slice(1).flatMap((b, i) => { const a = pts[i]; return Array.from({ length: n }, (_, k) => [a[0] + (b[0] - a[0]) * (k / n), a[1] + (b[1] - a[1]) * (k / n)]) }).concat([pts[pts.length - 1]])

// Laternen entlang eines Wegs (kfb.path wie path3d: pts [[x, z]...], halfW): gleichmäßig über die Länge, abwechselnd links/rechts, Rubin/Saphir im Wechsel
const distToPath = (seg, x, z) => Math.min(...seg.map(({ a, b }) => { const dx = b[0] - a[0], dz = b[1] - a[1], u = Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz || 1))); return Math.hypot(x - a[0] - u * dx, z - a[1] - u * dz) }))
export function lanternsAlongPath(path, { n = 8, offset = 0.9, terrainH = () => 0, seed = 1 } = {}) {
  const P = path.pts, seg = P.slice(1).map((b, i) => { const a = P[i]; return { a, b, L: Math.hypot(b[0] - a[0], b[1] - a[1]) } }), total = seg.reduce((s, x) => s + x.L, 0), out = []
  for (let k = 0; k < n; k++) { let d = (k + 0.5) / n * total, i = 0; while (i < seg.length - 1 && d > seg[i].L) { d -= seg[i].L; i++ }
    const { a, b, L } = seg[i], u = Math.min(1, d / L), tx = (b[0] - a[0]) / L, tz = (b[1] - a[1]) / L, w = path.halfW + offset
    const at = (side) => [a[0] + (b[0] - a[0]) * u - tz * w * side, a[1] + (b[1] - a[1]) * u + tx * w * side]
    let side = k % 2 ? 1 : -1, [x, z] = at(side)
    if (distToPath(seg, x, z) < path.halfW + offset * 0.6) { side = -side; [x, z] = at(side) } // Innenseite eines Knicks: zu nah am Nachbarstück → Außenseite
    out.push({ pos: [x, terrainH(x, z), z], preset: k % 2 ? 'sapphire' : 'ruby', scale: 0.9 + 0.25 * (((k * 7 + seed * 3) % 5) / 4), yaw: k * 1.3 }) }
  return out
}

export function createGemLanterns({ items = [], renderer = null, mood = null, ground = '#9a8a78' } = {}) {
  const root = new THREE.Group(); root.name = 'gem-lanterns'
  const crystalGeo = new THREE.LatheGeometry(dense(LANTERN.profile, LANTERN.rows).map(([r, y]) => new THREE.Vector2(r, y)), LANTERN.sides)
  const stoneGeo = new THREE.DodecahedronGeometry(1, 0), stoneMat = new THREE.MeshStandardMaterial({ color: LANTERN.stone, roughness: 0.95, flatShading: true })
  const gems = [], lanterns = []
  for (const [i, it] of items.entries()) {
    const g = new THREE.Group(); g.name = 'lantern:' + i; g.position.fromArray(it.pos); g.rotation.y = it.yaw || 0; g.scale.setScalar(it.scale || 1)
    const stone = new THREE.Mesh(stoneGeo, stoneMat); stone.name = 'lantern-stone'; stone.scale.set(0.24, 0.1, 0.24); stone.position.y = 0.02; stone.castShadow = stone.receiveShadow = true; g.add(stone)
    const cr = new THREE.Group(); cr.name = 'lantern-crystal'; g.add(cr)
    const main = new THREE.Mesh(crystalGeo, stoneMat); main.name = 'crystal-main'; main.position.y = 0.06; main.castShadow = true; cr.add(main)
    for (const [j, S] of LANTERN.side.entries()) { const holder = new THREE.Group(); holder.rotation.y = S.yaw; cr.add(holder); const side = new THREE.Mesh(crystalGeo, stoneMat); side.name = 'crystal-side' + j; side.scale.setScalar(S.s); side.position.fromArray(S.at); side.rotation.z = -S.tilt; side.castShadow = true; holder.add(side) }
    const gem = createGem({ THREE, preset: it.preset || 'ruby', seed: i + 1, lantern: true, halo: true, pool: false,   /* V-572: Pfütze nicht mehr als flache Scheibe – M1World projiziert sie mit kfb-light-pool.v1 auf Boden und Steine */ veinGlow: LANTERN.veinGlow[it.preset || 'ruby'] }); gem.apply(cr)
    root.add(g); gems.push(gem); lanterns.push({ g, gem, preset: it.preset || 'ruby' })
  }
  let envKey = null, t = 0
  const syncEnv = () => { const R = renderer?.(), M = mood?.(); if (!R || !M) return; const k = JSON.stringify([M.sun, M.sunI, M.hemiSky, M.hemiI, M.glow]); if (k === envKey) return; envKey = k; setGemEnvironment({ THREE, renderer: R, mood: M, ground }) }
  return {
    object3d: root,
    update(dt) { dt = Math.min(dt || 0, 0.1); t += dt; syncEnv(); for (const g of gems) g.update(dt) },
    // Practicals-Angebot: je Laterne ein Kristall-Licht (Hauptkristall; Nebenkristalle leuchten mit, ohne eigenes Licht), Stärke = Stimmung × Puls (aus kfb-gem); der Pool wählt die ≤ 6 nächsten
    practicals: () => gems.map((g) => g.getPracticalLight()).filter(Boolean),
    info: () => ({ gem: GEM_VERSION, lanterns: lanterns.length, meshes: gems.reduce((s, g) => s + g.info().meshes, 0), env: !!envKey, t: +t.toFixed(2), presets: lanterns.map((l) => l.preset), states: [...new Set(gems.map((g) => g.state))] }),
    dispose() { for (const g of gems) g.dispose(); crystalGeo.dispose(); stoneGeo.dispose(); stoneMat.dispose(); root.clear() },
  }
}
