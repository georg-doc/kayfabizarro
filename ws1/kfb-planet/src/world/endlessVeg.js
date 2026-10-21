// V-619 · Bewuchs der endlosen Fahrt je Biom (kfb-biome-drive.r1.json): Bäume, Büsche, Steine, Gras aus dem KayKit Forest Nature Pack (CC0, schon im
// Spiel über orchard3d, gleicher Pin). Modul nach Host-Vertrag R1.2 §2.
// Lagen weltfest je 64-m-Zelle aus einem gewürfelten Raster (gleiche Lage, egal welche Kachel gerade gezeigt wird: kein Springen beim Detailwechsel).
// Biom je Stelle nach den Gewichten des Biom-Felds gewürfelt; der Bewuchs der Minderheit dünnt über das Übergangsband aus (Sprenkel-Modul
// vegetation.density, V-403). Sichtbar: auf feinen Kacheln (64 m) alles, auf 128-m-Kacheln Bäume und Steine, weiter draußen nichts.
// Zeichnen: je Gruppe (Bäume, Büsche, Steine, Gras) EIN BatchedMesh (alle Modelle, eine Textur, Auslese je Teil auch für den Schatten), Instanz-Farbe =
// leichter Paletten-Ton des Bioms; alles wiegt im geteilten Wind (kfbWind.sway). Lagen werden zeitgeteilt berechnet (budgetMs je Bild).
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FOREST_PIN } from '../modules/orchard3d.js'
import { BIOMES, BIOME_CFG, NB } from './biomeField.js'
import { BIOME_PALETTES, PAL_STATE } from '../look/biomeTerrain.js'
import { vegetation } from '../vendor/speckle/kfb-speckle-transition.v1.js'
import { sway } from './kfbWind.js'
import { M_PER_RIG } from '../worldScale.js'
import { TERRAIN } from '../modules/m1-terrain.js'

const FOREST = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${FOREST_PIN}/media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/`
export const CATS = ['trees', 'bushes', 'rocks', 'grass']
const FAR_CATS = new Set(['trees'])                      // auf 128-m-Kacheln nur Bäume (Silhouette), Steine/Büsche/Gras nur nah
const SCALE = { trees: [0.85, 1.3], bushes: [0.8, 1.25], rocks: [0.7, 1.6], grass: [0.8, 1.3] }
const SWAY = { trees: 0.0045, bushes: 0.03, rocks: 0, grass: 0.16 }
const TINT = { trees: ['low', 1], bushes: ['mid', 1], rocks: ['sand', 0.85], grass: ['low', 1] }   // Bewuchs nimmt die Biom-Platten an (Kit-Grün allein las sich in jedem Biom gleich)
const CAP = { trees: 3000, bushes: 1500, rocks: 3000, grass: 3500 }   // gemessen ≤ 1,4k je Gruppe; kleinere Matrix-Texturen = kürzere Uploads
const fract = (v) => v - Math.floor(v)
const hh = (i, j, s) => fract(Math.sin(i * 127.1 + j * 311.7 + s * 17.31) * 43758.5453)
const CELL = 64

// Farbplatten am Bewuchs: Die Kit-Textur gibt nur noch Hell/Dunkel (Stamm dunkler, Laub heller), der Farbton kommt aus der Biom-Palette (Instanz-Farbe)
function plateTint(mat) {
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => { prev?.call(mat, sh, r)
    sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>', `#if defined( USE_COLOR_ALPHA ) || defined( USE_COLOR )
  { float lumT = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722)); diffuseColor.rgb = vColor.rgb * mix(0.5, 1.2, smoothstep(0.02, 0.3, lumT)); }
#endif`) }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|plateTint'; mat.needsUpdate = true
}
export const vegLog = { create: 0, update: 0, dispose: 0, loaded: 0, failed: 0, instances: 0, placed: 0, maxMs: 0 }

// options: { terrain (endlessTerrain-Modul), grid_m = 6, grassGrid_m = 3.2, budgetMs = 1.5 }
export function createEndlessVeg(options = {}) {
  vegLog.create++
  const T = options.terrain, field = T.field, H = (x, z) => T.height(x, z)
  const G = options.grid_m ?? 6, GG = options.grassGrid_m ?? 3.2, BUDGET = options.budgetMs ?? 1.5
  const root = new THREE.Group(); root.name = 'endless-veg'
  const want = new Map(); for (const b of BIOMES) for (const c of CATS) for (const n of BIOME_CFG.biomes[b].veg[c] || []) want.set(n, c)
  const geos = new Map()                                   // Name → { cat, geo }
  const batches = {}                                       // Gruppe → { mesh, ids: Map(Name → geometryId) }
  const loader = new GLTFLoader(); let alive = true, pendingLoads = want.size
  for (const [n, cat] of want) loader.load(FOREST + n + '.gltf', (g) => { if (!alive) return
    let src = null; g.scene.updateMatrixWorld(true); g.scene.traverse((o) => { if (o.isMesh && !src) src = o })
    if (src) { const geo0 = src.geometry.clone().applyMatrix4(src.matrixWorld), geo = new THREE.BufferGeometry()
      for (const a of ['position', 'normal', 'uv']) if (geo0.attributes[a]) geo.setAttribute(a, geo0.attributes[a])
      geo.setIndex(geo0.index ? geo0.index : [...Array(geo0.attributes.position.count).keys()]); geos.set(n, { cat, geo, mat: src.material }); vegLog.loaded++ } else vegLog.failed++
    if (--pendingLoads === 0) buildBatches()
  }, undefined, () => { vegLog.failed++; if (--pendingLoads === 0) buildBatches() })
  function buildBatches() {
    if (!alive) return
    for (const cat of CATS) { const list = [...geos].filter(([, v]) => v.cat === cat); if (!list.length) continue
      let nv = 0, ni = 0; for (const [, v] of list) { nv += v.geo.attributes.position.count; ni += v.geo.index.count }
      const mat = list[0][1].mat.clone(); if (SWAY[cat]) sway(mat, { k: SWAY[cat] }); plateTint(mat)
      const mesh = new THREE.BatchedMesh(CAP[cat], nv, ni, mat); mesh.name = 'veg:' + cat; mesh.castShadow = cat === 'trees' || cat === 'rocks'; mesh.receiveShadow = true; mesh.perObjectFrustumCulled = !!options.cull; mesh.sortObjects = false; mesh.frustumCulled = false   // Hüllkugel des Bündels wäre nach dem ersten Bild veraltet (Teile wandern mit dem Wagen)
      const ids = new Map(); for (const [n, v] of list) ids.set(n, mesh.addGeometry(v.geo))
      root.add(mesh); batches[cat] = { mesh, ids } }
    ready = true
  }
  let ready = false

  // Lagen je 64-m-Zelle (alle Gruppen), zeitgeteilt
  const w6 = new Float32Array(NB), R0 = TERRAIN.blendR + 6
  function* placeCell(ci, cj) {
    const out = [], x0 = ci * CELL, z0 = cj * CELL
    for (const [step, grass, salt] of [[G, false, 0.37], [GG, true, 2.11]]) {
      const i0 = Math.ceil(x0 / step), i1 = Math.floor((x0 + CELL - 1e-6) / step), j0 = Math.ceil(z0 / step), j1 = Math.floor((z0 + CELL - 1e-6) / step)
      for (let j = j0; j <= j1; j++) { for (let i = i0; i <= i1; i++) {
        const x = (i + 0.15 + 0.7 * hh(i, j, salt)) * step, z = (j + 0.15 + 0.7 * hh(i, j, salt + 1.7)) * step
        if (Math.hypot(x, z) < R0) continue
        field.weights(x, z, w6)
        let r = hh(i, j, salt + 3.1), bi = 0; for (let k = 0; k < NB; k++) { bi = k; if (r < w6[k]) break; r -= w6[k] }
        const V = BIOME_CFG.biomes[BIOMES[bi]].veg, dens = V.density * vegetation.density(1 - w6[bi])
        if (grass) { if (!V.grass?.length || hh(i, j, salt + 5.3) > dens * V.mix[3] * 2.4) continue }
        else if (hh(i, j, salt + 5.3) > dens * (G / V.spacing_m) ** 2) continue
        let cat = 'grass'
        if (!grass) { const t = hh(i, j, salt + 7.7) * (V.mix[0] + V.mix[1] + V.mix[2]); cat = t < V.mix[0] ? 'trees' : t < V.mix[0] + V.mix[1] ? 'bushes' : 'rocks' }
        const list = V[cat]; if (!list?.length) continue
        const y = H(x, z), ex = 0.8, sl = Math.hypot(H(x + ex, z) - H(x - ex, z), H(x, z + ex) - H(x, z - ex)) / (2 * ex)
        if ((cat === 'trees' && sl > 0.6) || sl > 0.9) continue
        const name = list[Math.floor(hh(i, j, salt + 9.9) * list.length) % list.length], [s0, s1] = SCALE[cat], s = M_PER_RIG * (s0 + (s1 - s0) * hh(i, j, salt + 11.1))
        out.push({ name, cat, x, y: y - (cat === 'rocks' ? 0.25 * s : 0.08), z, rot: hh(i, j, salt + 13.3) * Math.PI * 2, s, bi })
      } yield }
    }
    return out
  }
  const cells = new Map()            // key → { ci, cj, items | null, level (0 alles, 1 fern, -1 aus), shown: Map(cat → [ids]) }
  const itemCache = new Map()        // key → items (Lagen bleiben, wenn eine Zelle aus dem Bild fällt und wiederkommt; höchstens 900 Zellen)
  const queue = [], showQ = new Set(); let job = null
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(), p3 = new THREE.Vector3(), white = new THREE.Color(1, 1, 1)
  const TINTS = BIOME_PALETTES.map(() => Object.fromEntries(CATS.map((c) => [c, new THREE.Color()])))
  const retintAll = () => { BIOME_PALETTES.forEach((P, b) => { for (const c of CATS) TINTS[b][c].copy(white).lerp(new THREE.Color(P[TINT[c][0]]), TINT[c][1]) })
    for (const cell of cells.values()) for (const [cat, ids] of cell.shown) { const B = batches[cat]; let k = 0; for (const it of cell.items) if (it.cat === cat && B.ids.has(it.name)) { if (k < ids.length) B.mesh.setColorAt(ids[k++], TINTS[it.bi][cat]) } } }
  const onPal = () => retintAll(); PAL_STATE.listeners.add(onPal); retintAll()
  function show(cell) {
    const lvl = cell.level, items = cell.items; if (!items || !ready) return
    for (const cat of CATS) { const B = batches[cat]; if (!B) continue
      const on = lvl === 0 || (lvl === 1 && FAR_CATS.has(cat)), cur = cell.shown.get(cat)
      if (on && !cur) { const ids = []
        for (const it of items) { if (it.cat !== cat) continue; const g = B.ids.get(it.name); if (g === undefined) continue
          let id; try { id = B.mesh.addInstance(g) } catch { break }
          m4.compose(p3.set(it.x, it.y, it.z), q.setFromEuler(e.set(0, it.rot, 0)), sc.set(it.s, it.s, it.s)); B.mesh.setMatrixAt(id, m4); B.mesh.setColorAt(id, TINTS[it.bi][cat]); ids.push(id); vegLog.instances++ }
        cell.shown.set(cat, ids) }
      else if (!on && cur) { for (const id of cur) { B.mesh.deleteInstance(id); vegLog.instances-- } cell.shown.delete(cat) } }
  }
  // Zell-Stufen aus dem Kachelsatz: Zelle in einer 64-m-Kachel → 0, in einer 128-m-Kachel → 1, sonst aus
  const off = T.onSwap((shown) => {
    const lv = new Map()
    for (const b of shown.values()) { if (b.L > 1) continue; const n = b.s / CELL; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) lv.set((b.i * n + i) + ':' + (b.j * n + j), b.L) }
    for (const [k, c] of cells) if (!lv.has(k) && c.level !== -1) { c.level = -1; showQ.add(c) }
    for (const [k, L] of lv) { let c = cells.get(k)
      if (!c) { const [ci, cj] = k.split(':').map(Number); c = { ci, cj, items: itemCache.get(k) || null, level: L, shown: new Map() }; cells.set(k, c); if (c.items) showQ.add(c); else queue.push(c) }
      else if (c.level !== L) { c.level = L; showQ.add(c) } }
  })
  let focus = { x: 0, z: 0 }, tick = 0
  function work() {
    const t0 = performance.now()
    if (!ready) return
    // Sichtbarkeit zuerst, gebündelt nur jedes 6. Bild (jede Änderung lädt die Matrix-Textur des Bündels neu hoch), dann neue Lagen
    if (++tick % 6 === 0) for (const c of showQ) { if (performance.now() - t0 > BUDGET) break; showQ.delete(c); show(c); const k = c.ci + ':' + c.cj; if (c.level === -1 && !c.shown.size && cells.get(k) === c) cells.delete(k) }   // nur dieses Zell-Objekt (eine neu angelegte Zelle gleicher Lage bleibt)
    while (performance.now() - t0 < BUDGET) {
      if (!job) { queue.sort((a, b) => Math.hypot((a.ci + 0.5) * CELL - focus.x, (a.cj + 0.5) * CELL - focus.z) - Math.hypot((b.ci + 0.5) * CELL - focus.x, (b.cj + 0.5) * CELL - focus.z))
        const c = queue.shift(); if (!c) break; if (!cells.has(c.ci + ':' + c.cj) || c.items) continue; job = { c, it: placeCell(c.ci, c.cj) } }
      const r = job.it.next(); if (r.done) { const k = job.c.ci + ':' + job.c.cj; job.c.items = r.value; itemCache.set(k, r.value); const live = cells.get(k); if (live && live !== job.c && !live.items) { live.items = r.value; showQ.add(live) } if (itemCache.size > 900) itemCache.delete(itemCache.keys().next().value); vegLog.placed++; showQ.add(job.c); job = null }
    }
    vegLog.maxMs = Math.max(vegLog.maxMs, performance.now() - t0)
  }
  return {
    object3d: root,
    setFocus(x, z) { focus.x = x; focus.z = z },
    info: () => ({ models: geos.size, wanted: want.size, failed: vegLog.failed, ready, instances: Object.values(batches).reduce((s, B) => s + B.mesh._instanceInfo.filter((i) => i.active).length, 0), cells: cells.size, queued: queue.length, showQ: showQ.size, placed: vegLog.placed, maxMs: +vegLog.maxMs.toFixed(2) }),
    instancesNear: (x, z, r) => { const out = []; for (const c of cells.values()) if (c.items && c.level >= 0) for (const it of c.items) if ((c.level === 0 || FAR_CATS.has(it.cat)) && Math.hypot(it.x - x, it.z - z) < r) out.push(it); return out },
    resetStats() { vegLog.maxMs = 0 },
    debug: () => { let shown = 0, lv = { '-1': 0, 0: 0, 1: 0 }; for (const c of cells.values()) { lv[c.level]++; for (const ids of c.shown.values()) shown += ids.length }
      const active = Object.fromEntries(Object.entries(batches).map(([k, B]) => [k, B.mesh._instanceInfo.filter((i) => i.active).length])); return { shown, active, lv, showQ: showQ.size, queue: queue.length } },
    update() { vegLog.update++; work() },
    dispose() { vegLog.dispose++; alive = false; off(); PAL_STATE.listeners.delete(onPal); for (const B of Object.values(batches)) { B.mesh.dispose(); B.mesh.material.dispose() } for (const g of geos.values()) g.geo.dispose(); root.clear() },
  }
}
