// V-782 · kfb-place im Spiel (Schalter veg=core): ersetzt die Rasterstreuung von endlessVeg durch das Rezept des Kern-Moduls (Regeln V-749 ff.,
// Löser CANON_3D/lib/kfb-place-core.v1.mjs, gleiche Daten wie der Blender-Adapter). Gleiche Schnittstelle wie createEndlessVeg (Host-Vertrag R1.2 §2).
// Je 64-m-Zelle: Höhenraster vom Gelände (zeitgeteilt) → Worker rechnet das Rezept → Instanzen in BatchedMesh je Materialgruppe.
// Kit-Teile unverändert (V-574): KayKit Forest (gleicher Pin wie orchard3d) und Steinkit v4; Knete über kfb-clay v1.1 (V-429); Kontaktstücke aus dem
// Steinkit wie im Blender-Adapter (deterministisch je Instanz, Größe aus dem Radius des Lösers); Fluff als Knet-Kugeln je Nest (Größen 1 : 0,62 : 0,38).
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { BIOMES, NB } from './biomeField.js'
import { BIOME_PALETTES, PAL_STATE } from '../look/biomeTerrain.js'
import { sway } from './kfbWind.js'
import { M_PER_RIG } from '../worldScale.js'
import { TERRAIN } from '../modules/m1-terrain.js'
import { applyClay } from '../vendor/clay/kfb-clay.v1.1.js'
import CFG from '../vendor/place/kfb_place.r1.slim.json'
import STEIN_URL from '../assets/place/kfb_stone_kit.v4.glb?url'
import { KEEPOUT, inKeepout } from './keepout.js'   // Freiflächen (Karten-Relief)
import FOREST_URL from '../assets/place/kaykit_forest_kfb.glb?url'   // V-788: alle genutzten KayKit-Forest-Kacheln in einer Datei (scripts/place/pack-kaykit-forest.mjs)

const CELL = 64, STEP = 2, NG = CELL / STEP + 1
const TILES = new Map(CFG.tiles.map((t) => [t.id, t]))
const SMALLS = CFG.tiles.filter((t) => t.kind === 'stone_S')
const FLUFF = { heroic: '#d97c3a', forbidden: '#a64670', mystical: '#6b4e7d', absurd: '#e9c14a' }   // satte Story-Mode-Töne (V-292, V-305, V-770)
// Materialgruppen: Kit, Schattenwurf, Knet-Profil, Bezugsgröße (lokale Kit-Einheiten), Wind
const GROUPS = {
  kk: { cast: true, ref: 5, k: 0.006, cap: 14000 },   // Waldmassen (V-797) brauchen mehr als Mikro-Gruppen          // KayKit Bäume, Büsche, Felsen
  grass: { cast: false, ref: 0.6, k: 0.16, cap: 9000 },    // KayKit Gras-Büschel (V-769)
  stone: { cast: true, ref: 1, k: 0, cap: 12000 },         // Steinkit v4 (Steine, Kiesel, Kontaktstücke)
}
const groupOf = (t) => (t.kit === 'Steinkit v4' ? 'stone' : t.kind === 'grass' ? 'grass' : 'kk')
// Farbplatten wie im MVP-Bewuchs (endlessVeg, Georg: Props in den Cartoon-Biom-Platten): die Kit-Textur liefert nur Hell/Dunkel, der Farbton kommt aus der Palette
function plateTint(mat, twoTone = false) {
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => { prev?.call(mat, sh, r); sh.uniforms.uKfbTwoTone = { value: twoTone ? 1 : 0 }; sh.fragmentShader = 'uniform float uKfbTwoTone;\n' + sh.fragmentShader
    // Platte vor dem Knet-Block berechnen und danach wieder setzen: der Knet-Pull (kfbPull) zöge die Rollenfarbe sonst zurück auf seine Grüntöne
    sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>', `vec3 kfbPlateC = diffuseColor.rgb;
#if defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
  { vec3 tx = diffuseColor.rgb; float lumT = dot(tx, vec3(0.2126, 0.7152, 0.0722));
    // Kit-Atlas: Laub grünlich, Stamm/Holz bräunlich → Krone nimmt die Instanzfarbe, Stamm die J17-Regel (Laub − 105°, dunkler), zwei Farben je Baum
    float woody = smoothstep(0.0, 0.08, tx.r - tx.g);
    vec3 c = vColor.rgb; vec4 k4 = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0); vec4 pp = mix(vec4(c.bg, k4.wz), vec4(c.gb, k4.xy), step(c.b, c.g)); vec4 q = mix(vec4(pp.xyw, c.r), vec4(c.r, pp.yzx), step(pp.x, c.r));
    float d = q.x - min(q.w, q.y); vec3 hsv = vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 1e-10)), d / (q.x + 1e-10), q.x); hsv.x = fract(hsv.x - 105.0 / 360.0); hsv.z *= 0.62;
    vec3 bark = hsv.z * mix(vec3(1.0), clamp(abs(mod(hsv.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0), hsv.y);
    kfbPlateC = mix(c, bark, woody * uKfbTwoTone) * mix(0.55, 1.15, smoothstep(0.02, 0.3, lumT)); }
#endif
diffuseColor.rgb = kfbPlateC;`).replace('diffuseColor.rgb = kfbPull( diffuseColor.rgb );', 'diffuseColor.rgb = kfbPull( diffuseColor.rgb ); diffuseColor.rgb = kfbPlateC;') }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|plateTint' + (twoTone ? '2' : ''); mat.needsUpdate = true
}
export const MASS = typeof location !== 'undefined' && /(^|[#,])veg=mass(,|$)/.test(location.hash)
export const CARTOON = typeof location !== 'undefined' && /(^|[#,])veg=cartoon(,|$)/.test(location.hash)   // V-799 Stilbild 2 (Modell R3)   // V-797 Stilbild: Zonen + Massen (Georg q213)
export const placeLog = { create: 0, cells: 0, instances: 0, fails: 0, lastError: null, maxMs: 0, workerMs: 0 }

export function createPlaceVeg(options = {}) {
  placeLog.create++
  const T = options.terrain, H = (x, z) => T.height(x, z), BUDGET = options.budgetMs ?? 1.5, SEED = options.seed || 'kfb-endless-r1'
  const root = new THREE.Group(); root.name = 'place-veg'
  const geos = new Map(), batches = {}; let ready = false, alive = true
  // Laden: alle KayKit-Kacheln einzeln, Steinkit als eine Datei mit Knoten
  const loader = new GLTFLoader(), kayTiles = CFG.tiles.filter((t) => t.kit === 'KayKit Forest'); let pending = 2
  const take = (id, mesh, grp) => { mesh.updateMatrixWorld(true); const g0 = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld), g = new THREE.BufferGeometry()
    for (const a of ['position', 'normal', 'uv', 'color']) if (g0.attributes[a]) g.setAttribute(a, g0.attributes[a])
    g.setIndex(g0.index ? g0.index : [...Array(g0.attributes.position.count).keys()]); geos.set(id, { grp, geo: g, mat: mesh.material }) }
  const done = () => { if (--pending === 0 && alive) build() }
  loader.load(FOREST_URL, (g) => { g.scene.updateMatrixWorld(true); const byName = new Map()
    for (const n of g.scene.children) { let m = n.isMesh ? n : null; if (!m) n.traverse((o) => { if (o.isMesh && !m) m = o }); if (m) byName.set(n.name, m) }
    for (const t of kayTiles) { const m = byName.get(t.path.split('/').pop().replace(/\.gltf$/, '')); if (m) take(t.id, m, groupOf(t)); else placeLog.lastError = 'kaykit fehlt: ' + t.path }
    done() }, undefined, (e) => { placeLog.lastError = 'kaykit: ' + (e?.message || e); done() })
  loader.load(STEIN_URL, (g) => { g.scene.updateMatrixWorld(true); const byName = new Map(); g.scene.traverse((o) => { if (o.isMesh) byName.set(o.name, o); else if (o.children?.[0]?.isMesh) byName.set(o.name, o.children[0]) })
    for (const t of CFG.tiles) if (t.kit === 'Steinkit v4') { const m = byName.get(t.path.split('#')[1]); if (m && !geos.has('n:' + t.path)) take('n:' + t.path, m, 'stone') }
    done() }, undefined, done)
  const geoKey = (t) => (t.kit === 'Steinkit v4' ? 'n:' + t.path : t.id)
  function build() {
    for (const [name, G] of Object.entries(GROUPS)) { const list = [...geos].filter(([, v]) => v.grp === name); if (!list.length) continue
      let nv = 0, ni = 0; for (const [, v] of list) { nv += v.geo.attributes.position.count; ni += v.geo.index.count }
      // Vertex-Farben (Steinkit COLOR_0) nur, wenn alle Teile sie haben; sonst weg, sonst liest das Material Schwarz (Critic R1: schwarze Steine)
      const vc = name === 'stone' && list.every(([, v]) => v.geo.attributes.color); if (!vc) for (const [, v] of list) v.geo.deleteAttribute('color')
      // KayKit/Gras: weißes Vertex-Farb-Attribut, damit USE_COLOR auch im Fragment-Shader steht (die Batch-Instanzfarbe läuft in three r186 nur über vColor)
      if (!vc) for (const [, v] of list) v.geo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(v.geo.attributes.position.count * 3).fill(1), 3))   // KayKit färbt über die Atlas-Textur, nur Steinkit über COLOR_0
      // Material von einer Kachel mit Textur: die Ladereihenfolge ist zufällig, eine Kachel ohne map als erste machte die ganze Gruppe weiß
      const mat = (list.find(([, v]) => v.mat.map) || list[0])[1].mat.clone(); mat.vertexColors = true
      const mesh = new THREE.BatchedMesh(G.cap, nv, ni, mat); mesh.name = 'place:' + name; mesh.castShadow = G.cast; mesh.receiveShadow = true; mesh.frustumCulled = false; mesh.perObjectFrustumCulled = true; mesh.sortObjects = false
      const ids = new Map(); for (const [k, v] of list) ids.set(k, mesh.addGeometry(v.geo))
      try { applyClay(mesh, THREE, { profile: 'midground', seed: 'place:' + name, scaleRef: G.ref }) } catch (e) { placeLog.lastError = 'clay: ' + e.message }
      if (G.k) sway(mesh.material, { k: G.k })
      if (name !== 'stone') plateTint(mesh.material, name === 'kk')   // KayKit zweifarbig (Krone/Stamm), Gras einfarbig; Steinkit über COLOR_0 + Ton
      root.add(mesh); batches[name] = { mesh, ids } }
    const sg = new THREE.IcosahedronGeometry(1, 3), sm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75 })
    const fm = new THREE.InstancedMesh(sg, sm, 6000); fm.name = 'place:fluff'; fm.count = 0; fm.castShadow = true; fm.receiveShadow = true; fm.frustumCulled = false
    try { applyClay(fm, THREE, { profile: 'midground', seed: 'place:fluff', scaleRef: 2 }) } catch { }
    sway(fm.material, { k: 0.01 }); root.add(fm); batches.fluff = { mesh: fm, free: [], top: 0 }
    ready = true
  }
  // Farben: Biom-Palette am Zellmittelpunkt (Kit-Textur bleibt, nur ein leichter Ton; Laub natürlich, V-305)
  const white = new THREE.Color(1, 1, 1), tmp = new THREE.Color(), w6 = new Float32Array(NB), MOSS = new THREE.Color('#7f9a4a'), GRASS = new THREE.Color('#9cc35a'), STONE = new THREE.Color('#d8d2c4')
  const biomeAt = (x, z) => { T.field.weights(x, z, w6); let bi = 0; for (let k = 1; k < NB; k++) if (w6[k] > w6[bi]) bi = k; return bi }
  const tintFor = (grp, kind, bi, step, vr) => { const P = BIOME_PALETTES[bi]
    if (kind === 'contact') return tmp.copy(MOSS).lerp(new THREE.Color(P.low), 0.25)   // Moos mit Biom-Anteil, nicht der dunkle Boden-Grundton
    if (grp === 'stone') return P.stone ? tmp.set(P.stone) : tmp.copy(STONE).lerp(new THREE.Color(P.sand), 0.35)   // Insel-Rolle stone (V-800), sonst heller Knet-Stein
    if (grp === 'grass') return tmp.set(P.grass || P.low).multiplyScalar(0.92 + 0.06 * (step ?? 1))   // Rolle grass bzw. Platte low, drei flache Stufen
    const v = vr ?? 0.5   // Varianz je Instanz (R8: jede Rolle darf eine andere Farbe derselben Palette nehmen)
    if (kind === 'tree') return tmp.set(v < 0.18 && P.bloom ? P.bloom : v < 0.45 && P.leafAlt ? P.leafAlt : (P.leaf || P.low))   // J17: Laub, dunkleres Laub, Blüten-Krone
    return tmp.set(v < 0.5 && P.bloom ? P.bloom : (P.grass || P.mid)) }   // Busch: Blüte oder helles Laub (J17-Busch)
  // Zellen
  const worker = new Worker(new URL('./placeWorker.js', import.meta.url), { type: 'module' }); let wid = 0; const waiting = new Map()
  worker.onmessage = (e) => { const job = waiting.get(e.data.id); waiting.delete(e.data.id); if (!job) return
    if (!e.data.ok) { placeLog.fails++; placeLog.lastError = e.data.error; job.cell.items = []; return }
    placeLog.workerMs = Math.max(placeLog.workerMs, performance.now() - job.t0); job.cell.items = KEEPOUT.length ? e.data.instances.filter((it) => !inKeepout(it.p[0], it.p[2])) : e.data.instances; job.cell.report = e.data.report; placeLog.cells++; showQ.add(job.cell) }
  const cells = new Map(), queue = [], showQ = new Set(), pendingShow = []; let heightJob = null, showJob = null, focus = { x: 0, z: 0 }, tick = 0
  const R0 = TERRAIN.blendR + 6
  function* heights(cell) { const g = new Float32Array(NG * NG), x0 = cell.ci * CELL, z0 = cell.cj * CELL
    for (let j = 0; j < NG; j++) { for (let i = 0; i < NG; i++) g[j * NG + i] = H(x0 + i * STEP, z0 + j * STEP); yield }
    return g }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e3 = new THREE.Euler(), sc = new THREE.Vector3(), p3 = new THREE.Vector3()
  function* showGen(cell) {   // zeitgeteilt: je Scheibe ein paar Dutzend Instanzen (sonst Spitzen > 200 ms beim Einblenden)
    const bi = biomeAt((cell.ci + 0.5) * CELL, (cell.cj + 0.5) * CELL), shown = []; let kc = 0, k = 0
    cell.shown = shown; cell.biome = bi
    for (const it of cell.items) { if (++k % 40 === 0) yield
      const [x, y0, z] = it.p; if (Math.hypot(x, z) < R0) continue
      if (it.k === 'fluff') { addFluff(it, shown); continue }
      if (it.k === 'find') continue
      let t = TILES.get(it.t); if (it.k === 'contact' && SMALLS.length) t = SMALLS[(cell.ci * 7 + cell.cj * 13 + kc++) % SMALLS.length]
      if (!t) continue
      const grp = groupOf(t), B = batches[grp], gid = B?.ids.get(geoKey(t)); if (gid === undefined) continue
      const base = t.scale_m ? (t.scale_m[0] + t.scale_m[1]) / 2 : t.import_scale || M_PER_RIG
      let s = it.s * base; if (it.k === 'contact' && it.cr && t.hull_r_m) s = base * it.cr / t.hull_r_m
      const hgt = t.h_m * (s / base), rr = (t.hull_r_m || 0.2) * (s / base) * 0.7
      const yMin = Math.min(H(x, z), H(x + rr, z), H(x - rr, z), H(x, z + rr), H(x, z - rr))   // am Hang auf die tiefste Fußstelle, nie schwebend
      const y = yMin - it.sk * hgt
      let id; try { id = B.mesh.addInstance(gid) } catch { break }
      m4.compose(p3.set(x, y, z), q.setFromEuler(e3.set(it.rx, it.ry, it.rz, 'XYZ')), sc.set(s, s, s)); B.mesh.setMatrixAt(id, m4); B.mesh.setColorAt(id, tintFor(grp, it.k, bi, it.ts, (Math.abs(Math.sin(x * 12.9898 + z * 78.233)) * 43758.5453) % 1)); if (!B.colorInit) { B.colorInit = true; B.mesh.material.needsUpdate = true }   // Farbtextur entsteht erst beim ersten setColorAt: Programm neu bauen, sonst fehlt USE_BATCHING_COLOR
      shown.push([grp, id]); placeLog.instances++ }
  }
  function show(cell) {   // Stufe wechselt → sofort ausblenden; Einblenden über showJob in work()
    if (!ready || !cell.items) return
    if (cell.level !== 0) { if (showJob?.c === cell) showJob = null; hide(cell); return }
    if (!cell.shown && !(showJob?.c === cell)) pendingShow.push(cell)
  }
  function addFluff(it, shown) {   // Nest = 1 große, 3 mittlere, Rest kleine Kugeln (rules.nest), eine Farbe je Nest; Fallobst = eine Kugel
    const F = batches.fluff, col = new THREE.Color(FLUFF[it.fm] || FLUFF.heroic); if (it.ac !== 'focus') { const hsl = {}; col.getHSL(hsl); col.setHSL(hsl.h, hsl.s * (CFG.fluff?.echo_dim?.chroma ?? 0.55), Math.min(1, hsl.l + (CFG.fluff?.echo_dim?.L ?? 0.06))) }   // V-794: nur das Fokus-Nest in vollem Ton
    const n = it.r === 'fallobst' ? 1 : Math.max(5, it.b || 5), r0 = it.r === 'fallobst' ? 0.14 : Math.min(it.r === 'fluff_hero' ? 0.24 : 0.18, Math.max(0.05, 0.22 * (it.cc || 0.8))) * (it.ac !== 'focus' && it.r !== 'fallobst' ? (CFG.fluff?.echo_dim?.size ?? 1) : 1)   // Kugeln im Maß des Trägers (V-784), Echo kleiner (V-795)
    for (let k = 0; k < n; k++) { const r = r0 * (k === 0 ? 1 : k < 4 ? 0.62 : 0.38), a = k * 2.39996, d = k === 0 ? 0 : (r0 + r) * 0.78, id = F.free.length ? F.free.pop() : F.top++; if (id >= 6000) break
      m4.compose(p3.set(it.p[0] + Math.cos(a) * d, it.p[1] + (it.r === 'fallobst' ? r * 0.7 : (k === 0 ? 0 : -0.25 * r)), it.p[2] + Math.sin(a) * d), q.identity(), sc.set(r, r, r)); F.mesh.setMatrixAt(id, m4); F.mesh.setColorAt(id, col)
      shown.push(['fluff', id]) }
    F.mesh.count = Math.max(F.mesh.count, F.top); F.mesh.instanceMatrix.needsUpdate = true; if (F.mesh.instanceColor) F.mesh.instanceColor.needsUpdate = true }
  function hide(cell) { if (!cell.shown) return
    for (const [grp, id] of cell.shown) { if (grp === 'fluff') { const F = batches.fluff; m4.makeScale(0, 0, 0); F.mesh.setMatrixAt(id, m4); F.free.push(id); F.mesh.instanceMatrix.needsUpdate = true } else batches[grp].mesh.deleteInstance(id); placeLog.instances-- }
    cell.shown = null }
  const off = T.onSwap((shownTiles) => {   // nur auf feinen Kacheln (64 m) zeigen: Stufe 0; weiter draußen aus (Silhouetten macht später die Ferne)
    const lv = new Map()
    for (const b of shownTiles.values()) { if (b.L > 0) continue; const n = b.s / CELL; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) lv.set((b.i * n + i) + ':' + (b.j * n + j), 0) }
    for (const [k, c] of cells) if (!lv.has(k) && c.level !== -1) { c.level = -1; showQ.add(c) }
    for (const k of lv.keys()) { let c = cells.get(k)
      if (!c) { const [ci, cj] = k.split(':').map(Number); c = { ci, cj, items: null, level: 0, shown: null }; cells.set(k, c); queue.push(c) }
      else if (c.level !== 0) { c.level = 0; showQ.add(c) } }
  })
  function work() {
    const t0 = performance.now(); if (!ready) return
    if (++tick % 4 === 0) for (const c of showQ) { if (performance.now() - t0 > BUDGET) break; showQ.delete(c); show(c); if (c.level === -1 && !c.shown) cells.delete(c.ci + ':' + c.cj) }
    while (performance.now() - t0 < BUDGET) {   // Einblenden zuerst (nächste Zelle zuerst), dann Höhenraster
      if (!showJob && pendingShow.length) { pendingShow.sort((a, b) => Math.hypot((a.ci + 0.5) * CELL - focus.x, (a.cj + 0.5) * CELL - focus.z) - Math.hypot((b.ci + 0.5) * CELL - focus.x, (b.cj + 0.5) * CELL - focus.z)); const c = pendingShow.shift(); if (c.level === 0 && c.items && !c.shown) showJob = { c, it: showGen(c) } }
      if (showJob) { if (showJob.it.next().done) showJob = null; continue }
      if (!heightJob) { queue.sort((a, b) => Math.hypot((a.ci + 0.5) * CELL - focus.x, (a.cj + 0.5) * CELL - focus.z) - Math.hypot((b.ci + 0.5) * CELL - focus.x, (b.cj + 0.5) * CELL - focus.z))
        const c = queue.shift(); if (!c) break; if (c.items || c.level !== 0) continue; heightJob = { c, it: heights(c) } }
      const r = heightJob.it.next()
      if (r.done) { const c = heightJob.c, id = ++wid; heightJob = null; waiting.set(id, { cell: c, t0: performance.now() })
        worker.postMessage({ id, x0: c.ci * CELL, z0: c.cj * CELL, size: CELL, step: STEP, n: NG, grid: r.value, seed: SEED, biome: 'moos', mode: CARTOON ? 'cartoon' : MASS ? 'mass' : 'place' }, [r.value.buffer]) }
    }
    placeLog.maxMs = Math.max(placeLog.maxMs, performance.now() - t0)
  }
  const onPal = () => { for (const c of cells.values()) if (c.shown) { hide(c); showQ.add(c) } }; PAL_STATE.listeners.add(onPal)
  return {
    object3d: root,
    setFocus(x, z) { focus.x = x; focus.z = z },
    info: () => ({ mode: 'veg=core', ready, models: geos.size, cells: cells.size, queued: queue.length, waiting: waiting.size, instances: placeLog.instances, fails: placeLog.fails, lastError: placeLog.lastError, maxMs: +placeLog.maxMs.toFixed(2), workerMs: +placeLog.workerMs.toFixed(1) }),
    instancesNear: (x, z, r) => { const out = []; for (const c of cells.values()) if (c.items && c.shown) for (const it of c.items) if (Math.hypot(it.p[0] - x, it.p[2] - z) < r) out.push({ name: it.t, cat: it.k, x: it.p[0], y: it.p[1], z: it.p[2] }); return out },
    reports: () => [...cells.values()].filter((c) => c.report).map((c) => ({ cell: c.ci + ':' + c.cj, ...c.report })),
    resetStats() { placeLog.maxMs = 0; placeLog.workerMs = 0 },
    debug: () => ({ biomes: BIOMES.length, groups: Object.fromEntries(Object.entries(batches).map(([k, B]) => [k, B.mesh.isBatchedMesh ? B.mesh._instanceInfo.filter((i) => i.active).length : B.top])) }),
    update() { work() },
    dispose() { alive = false; off(); worker.terminate(); PAL_STATE.listeners.delete(onPal); for (const B of Object.values(batches)) { B.mesh.dispose?.(); B.mesh.material.dispose() } for (const g of geos.values()) g.geo.dispose(); root.clear() },
  }
}
