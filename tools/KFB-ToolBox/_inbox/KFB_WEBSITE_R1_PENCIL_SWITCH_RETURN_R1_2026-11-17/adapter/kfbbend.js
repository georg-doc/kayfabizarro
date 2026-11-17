// KFB bend: trees, bushes and rocks of an instanced prop field bend away from the car and spring back, with the game's own rubber module.
// Springs, table and shader step are the game's (src/world/kfbFold.js, gummiTabelle.r1.json, V-1229), used unchanged. This file only makes
// them fit instanced meshes: the game bends batched meshes behind its wind step, here the same step is hung into a plain material.
import * as THREE from 'three'
import { foldMaterial, createGummi, stammRadius, gummiArt } from './game/src/world/kfbFold.js'

const HEAD = '#ifdef USE_INSTANCING\n#define batchingMatrix instanceMatrix\n#else\n#define batchingMatrix mat4(1.0)\n#endif\n'
const BODY = 'vec4 kfbWp = vec4(transformed, 1.0);\n#ifdef USE_INSTANCING\n  kfbWp = instanceMatrix * kfbWp;\n#endif\n  kfbWp = modelMatrix * kfbWp;\n  vec4 mvPosition = viewMatrix * kfbWp;\n  gl_Position = projectionMatrix * mvPosition;'
const hang = (mat, key) => { const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => { prev?.call(mat, sh, r); sh.vertexShader = HEAD + sh.vertexShader.replace('#include <project_vertex>', BODY) }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|' + key; foldMaterial(mat); return mat }

export const bendable = (mat) => (mat.userData.kfbBend ? mat : (mat.userData.kfbBend = true, hang(mat, 'kfbBend')))
export const bendDepth = () => hang(new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking }), 'kfbBendDepth')

// field: a kfbfield. kinds: { name: 'baum' | 'busch' | 'stein' | ... } (classes of the game's table). Every part of those kinds gets the bend step.
export function createBend({ field, kinds, reach = 9 } = {}) {
  const dims = {}, depth = bendDepth()
  for (const [name, art] of Object.entries(kinds)) { const list = field.meshes[name]; if (!list) continue; const g = list[0].geometry; g.computeBoundingBox(); const b = g.boundingBox
    dims[name] = { art, h: b.max.y - b.min.y, trunk: stammRadius(g), wide: Math.max(b.max.x - b.min.x, b.max.z - b.min.z) / 2 }
    for (const im of list) { im.material = bendable(im.material.userData.kfbBend ? im.material : im.material.clone()); im.customDepthMaterial = depth } }
  const near = (x, z, r = reach) => field.near(x, z, r, (s) => dims[s.kind]).map((s) => s.bend || (s.bend = (() => { const d = dims[s.kind], sc = s.scale ?? 1, r0 = d.art === 'busch' ? d.wide * sc * 0.8 : Math.max(0.15, d.trunk * sc); return { x: s.x, z: s.z, y: s.y, h: d.h * sc, r: r0, art: gummiArt(d.art, r0) } })()))
  const gummi = createGummi(near)
  // car(d, dt, box): d = { x, y, z, yaw, speed, latV, events }, box = { c: [x, y, z], h: [halfWidth, halfHeight, halfLength] } as in the game (k2t). It slows d a little on contact.
  return { car: gummi.car, fig: gummi.fig, wave: gummi.welle, tick: gummi.tick, info: gummi.info, near }
}
