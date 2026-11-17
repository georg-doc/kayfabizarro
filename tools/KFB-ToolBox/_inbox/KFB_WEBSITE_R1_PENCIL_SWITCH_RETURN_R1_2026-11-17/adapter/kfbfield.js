// KFB prop field: props that travel with the focus, like the quilt tiles. One instanced mesh per kind and part, refilled when the set of tiles
// round the focus changes. Where things stand depends only on the tile (or on the station along the road), never on when it is asked.
import * as THREE from 'three'
export function createField({ kinds, tileSize = 26, radius = 150, perTile = null, stationLength = 220, stations = null, capacity = 600 } = {}) {
  // kinds: { name: [[geometry, material], ...] }; perTile(ci, cj, rand, add); stations(n, add) for station n (n = 0, 1, 2 ... along the road)
  // a spot: { x, y, z, yaw, tilt, roll, scale } and, optionally, group: pieces with the same group name react together (a house of cards, a domino run, a stack)
  const object3d = new THREE.Group(), meshes = {}, M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), P = new THREE.Vector3(), Sc = new THREE.Vector3(), cache = new Map(), stats = { refills: 0, ms: 0 }, taken = new Set(); let key = '', shown = [], dirty = false
  for (const [name, parts] of Object.entries(kinds)) meshes[name] = parts.map(([g, m]) => { const im = new THREE.InstancedMesh(g, m, capacity); im.name = name; im.count = 0; im.castShadow = im.receiveShadow = true; im.frustumCulled = false; object3d.add(im); return im })
  const rng = (seed) => { let s = seed >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296) }
  const spotsOf = (k, make) => { let v = cache.get(k); if (!v) { v = []; make((kind, spot) => { spot.id = k + '#' + v.length; spot.kind = kind; v.push([kind, spot]) }); cache.set(k, v); if (cache.size > 900) cache.delete(cache.keys().next().value) } return v }
  function update({ x, z }) {
    const c0 = Math.floor((x - radius) / tileSize), c1 = Math.floor((x + radius) / tileSize), d0 = Math.floor((z - radius) / tileSize), d1 = Math.floor((z + radius) / tileSize), n0 = Math.floor((-z - radius) / stationLength), n1 = Math.floor((-z + radius) / stationLength), k = [c0, c1, d0, d1, n0, n1].join(',')
    if (k === key && !dirty) return false; key = k; dirty = false; const t0 = performance.now(), fill = Object.fromEntries(Object.keys(kinds).map((n) => [n, 0]))
    shown = []; const place = (pair) => { const [kind, s] = pair, list = meshes[kind]; if (!list) return; shown.push(s); if (taken.has(s.id)) return; const i = fill[kind]; if (i >= capacity) return; e.set(s.tilt ?? 0, s.yaw ?? 0, s.roll ?? 0, 'YXZ'); q.setFromEuler(e); const sc = s.scale ?? 1; M.compose(P.set(s.x, s.y, s.z), q, Sc.set(sc, sc, sc)); for (const im of list) im.setMatrixAt(i, M); fill[kind] = i + 1 }
    if (perTile) for (let cj = d0; cj <= d1; cj++) for (let ci = c0; ci <= c1; ci++) spotsOf('t' + ci + ',' + cj, (add) => perTile(ci, cj, rng(Math.imul(ci + 5000, 73856093) ^ Math.imul(cj + 5000, 19349663)), add)).forEach(place)
    if (stations) for (let n = Math.max(0, n0); n <= n1; n++) spotsOf('s' + n, (add) => stations(n, add)).forEach(place)
    for (const [name, list] of Object.entries(meshes)) for (const im of list) { im.count = fill[name]; im.instanceMatrix.needsUpdate = true }
    stats.refills++; stats.ms += performance.now() - t0; stats.last = fill; return true
  }
  const report = () => { let instances = 0, triangles = 0, calls = 0; for (const list of Object.values(meshes)) for (const im of list) { if (!im.count) continue; calls++; instances += im.count; triangles += Math.round(im.count * (im.geometry.index ? im.geometry.index.count : im.geometry.attributes.position.count) / 3) } return { kinds: Object.keys(kinds).length, drawCalls: calls, instances, triangles, refills: stats.refills, msPerRefill: +(stats.ms / Math.max(1, stats.refills)).toFixed(2) } }
  // For things that react: every spot carries a stable id and its kind. near() lists the spots standing round a point (taken ones included when asked),
  // take(id) removes one from the field so that someone else can draw and move it, give(id) puts it back where it stood. Both show at the next update.
  const near = (x, z, r, test = null, out = []) => { for (const s of shown) { const dx = s.x - x, dz = s.z - z; if (dx * dx + dz * dz < r * r && (!test || test(s))) out.push(s) } return out }
  const take = (id) => { if (!taken.has(id)) { taken.add(id); dirty = true } }, give = (id) => { if (taken.delete(id)) dirty = true }
  return { object3d, update, report, near, take, give, meshes, taken }
}
