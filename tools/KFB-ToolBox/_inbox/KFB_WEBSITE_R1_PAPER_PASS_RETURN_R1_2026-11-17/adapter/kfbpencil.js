// KFB pencil look: a switch that draws prepared props in coloured pencil and gives the approved look back unchanged.
// The pencil itself is Patch's "Coloured pencil" by blendi, used unchanged (vendor/patch-coloured-pencil/src/pencil.js, code MIT, art CC0,
// source head 0400f90d, blob 8bea1ef8). This file is only the adapter: it decides which meshes may be switched, keeps both materials,
// lets the host hang its own vertex steps (bend, wind) into the pencil material, and fits the stroke spacing to the picture height.
// It is not a screen filter. A mesh needs two things from the prop step: a `hatch` attribute (prepare) and vertex colours.
import { BufferAttribute } from 'three'
import { createPencil, field, fieldBy, hue } from './vendor/patch-coloured-pencil/src/pencil.js'

// In the shared prop step, once per geometry, in the piece's own rest coordinates. hatch: nothing (the slant of a right hand),
// two direction triples [a, b], or fn(x, y, z, i) → [h1, h2] for strokes that follow a form. colour: only used when the piece has no vertex colours yet.
export function prepare(geo, { hatch = null, colour = null, climb = 0.35 } = {}) {
  if (!geo.attributes.normal) geo.computeVertexNormals()
  if (typeof hatch === 'function') fieldBy(geo, hatch); else if (!geo.attributes.hatch || hatch) field(geo, ...(hatch || []))
  if (!geo.attributes.color && colour) hue(geo, colour)
  if (climb != null && !geo.attributes.root) { const n = geo.attributes.position.count, r = new Float32Array(n * 4); for (let i = 0; i < n; i++) r[i * 4 + 3] = climb; geo.setAttribute('root', new BufferAttribute(r, 4)) }   // for the watercolour look (kfbwash.js): the piece's foot is its own origin, colour climbs it at `climb` seconds per metre
  return geo
}

// The switch itself, shared by the pencil and the watercolour look. make(original) → the look's material for one original material.
export function lookSwitch(THREE, { make, compose = null, needs = ['hatch', 'color'], label = 'look' }) {
  const items = [], made = new Map(), skipped = []; let on = false
  const why = (o) => { const g = o.geometry, m = Array.isArray(o.material) ? o.material[0] : o.material
    if (o.isSkinnedMesh) return 'skinned mesh: not verified with this look'
    if (o.userData.kfbKeepLook) return 'marked to keep its look'
    for (const a of needs) if (!g?.attributes?.[a]) return a === 'color' ? 'no vertex colours: a textured piece would lose its picture' : 'no ' + a + ' attribute: run prepare() in the prop step'
    if (m?.map) return 'textured material: would lose its picture'
    return null }
  const lookFor = (o) => { const orig = o.material; let p = made.get(orig); if (p) return p
    p = make(orig); p.toneMapped = false; p.name = label + ':' + (orig.name || o.name || '')   // the look writes what is left of the paper's white; the game's film curve would grey that white
    if (compose) p = compose(p, o, orig) || p; made.set(orig, p); return p }
  // root: any Object3D. Every mesh below it that may be switched is registered; the others are listed with the reason.
  function add(root, { filter = null } = {}) { let n = 0; root.traverse((o) => { if (!(o.isMesh || o.isInstancedMesh) || items.some((it) => it.o === o) || (filter && !filter(o))) return; const r = why(o); if (r) { skipped.push({ name: o.name || o.type, reason: r }); return }
      const it = { o, original: o.material, look: lookFor(o) }; items.push(it); if (on) o.material = it.look; n++ }); return n }
  function set(v) { on = !!v; for (const it of items) { if (on) { if (it.o.material !== it.look) it.original = it.o.material; it.o.material = it.look } else if (it.o.material === it.look) it.o.material = it.original } return on }   // switching on takes whatever the mesh wears at that moment and gives exactly that back; one look at a time is the host's rule
  const release = () => { for (const it of items) if (it.o.material === it.look) it.o.material = it.original; on = false }
  const dispose = () => { release(); for (const p of made.values()) p.dispose(); made.clear(); items.length = 0 }
  return { add, set, release, toggle: () => set(!on), dispose, get on() { return on }, report: () => ({ on, switched: items.length, materials: made.size, skipped: skipped.length, skippedWhy: [...new Set(skipped.map((k) => k.reason))] }) }
}

export function createPencilLook(THREE, { renderer, pixels = 5, compose = null } = {}) {
  const pencil = createPencil(), size = new THREE.Vector2()
  const fit = () => { pencil.px.value = pixels * renderer.getDrawingBufferSize(size).y / 1080; return pencil.px.value }   // the source's rule; call it from the host's own resize, there is no listener here
  fit(); const sw = lookSwitch(THREE, { make: (orig) => pencil.make({ side: orig.side ?? THREE.FrontSide }), compose, label: 'pencil' })
  return { pencil, add: sw.add, set: sw.set, toggle: sw.toggle, fit, dispose: sw.dispose, get on() { return sw.on }, report: () => ({ ...sw.report(), px: +pencil.px.value.toFixed(3) }) }
}
