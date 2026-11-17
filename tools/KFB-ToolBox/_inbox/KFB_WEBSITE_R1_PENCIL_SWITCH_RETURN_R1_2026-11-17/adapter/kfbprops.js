// KFB props for the patchworld: existing models baked to one geometry each, shown in one of three looks, and laid out as instances.
// Looks: 'original' (the model's own colours, hard surface), 'palette' (colours drawn to the biome's ramp), 'cloth' (felt in the palette's colours,
// weave in world units; with seams: stitches and a darker line along hard edges and colour borders). Cloth and weave are Patch's code (MIT).
import * as THREE from 'three'
import { prepare } from './kfbpencil.js'
import { clothUV } from './patchq/sew.js'
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js'
import { hexToOklch, oklchToHex, maxChroma, dHue } from './game/src/vendor/palette/kfb-cartoon-palette.js'   // the game's own colour model (WS0, V-293)
const pix = new Map()
function sampler(tex) { if (!tex?.image) return null; if (pix.has(tex)) return pix.get(tex); const im = tex.image, c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data
  const f = (u, v) => { const px = Math.min(c.width - 1, Math.max(0, Math.floor((u - Math.floor(u)) * c.width))), py = Math.min(c.height - 1, Math.max(0, Math.floor((v - Math.floor(v)) * c.height))), i = (px + py * c.width) * 4; return new THREE.Color().setRGB(d[i] / 255, d[i + 1] / 255, d[i + 2] / 255, THREE.SRGBColorSpace) }; pix.set(tex, f); return f }
/** One non-indexed geometry (position, normal, color) for a whole model: `height` metres tall, standing on y = 0, centred in x and z. */
export function bake(root, { height = 1, rx = 0, round = 0, hatch = null } = {}) { return prepare(bakeRaw(root, { height, rx, round }), { hatch }) }   // every baked prop carries the two stroke fields of the pencil look (kfbpencil.js), laid in its rest pose; hatch: [a, b] or fn(x, y, z, i) for strokes that follow a form
function bakeRaw(root, { height = 1, rx = 0, round = 0 } = {}) {   // round: edges softer than this many degrees are shaded as one curved surface (the toy look); 0 leaves every face flat
  root.rotation.x = rx; root.updateMatrixWorld(true); const pos = [], col = []
  root.traverse((o) => { if (!o.isMesh) return; let g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld); if (g.index) g = g.toNonIndexed(); const p = g.attributes.position, uv = g.attributes.uv, m = Array.isArray(o.material) ? o.material[0] : o.material, smp = sampler(m.map), base = m.color ?? new THREE.Color(1, 1, 1)
    for (let t = 0; t < p.count / 3; t++) { const c = new THREE.Color(0, 0, 0); for (let k = 0; k < 3; k++) { const i = t * 3 + k, s = smp && uv ? smp(uv.getX(i), uv.getY(i)) : new THREE.Color(1, 1, 1); c.r += s.r / 3; c.g += s.g / 3; c.b += s.b / 3; pos.push(p.getX(i), p.getY(i), p.getZ(i)) } c.multiply(base); for (let k = 0; k < 3; k++) col.push(c.r, c.g, c.b) } })
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeBoundingBox(); const b = g.boundingBox, k = height / (b.max.y - b.min.y)
  g.translate(-(b.max.x + b.min.x) / 2, -b.min.y, -(b.max.z + b.min.z) / 2); g.scale(k, k, k); g.computeVertexNormals(); if (!round) return g; const r = toCreasedNormals(g, round * Math.PI / 180); r.computeBoundingBox(); return r
}
/** The biome's colours as a ramp from dark to light. */
export function rampOf(hexes) { const cs = hexes.map((h) => new THREE.Color(h)), lum = (c) => 0.299 * c.r + 0.587 * c.g + 0.114 * c.b; cs.sort((a, b) => lum(a) - lum(b)); return (l) => { const t = Math.min(0.999, Math.max(0, l)) * (cs.length - 1), i = Math.floor(t); return cs[i].clone().lerp(cs[i + 1], t - i) } }
/** A copy of the geometry with its colours drawn to the ramp; greys stay grey. `keep`: how much of the own colour stays. */
export function toPalette(geo, ramp, { keep = 0.25, spread = 1 } = {}) { const g = geo.clone(), c = g.attributes.color, col = new THREE.Color(); for (let i = 0; i < c.count; i++) { col.fromBufferAttribute(c, i); const mx = Math.max(col.r, col.g, col.b), mn = Math.min(col.r, col.g, col.b), l = 0.299 * col.r + 0.587 * col.g + 0.114 * col.b; if (mx - mn > 0.06) col.lerp(ramp(0.15 + l * 1.15 * spread), 1 - keep); c.setXYZ(i, col.r, col.g, col.b) } return g }
/** Colours drawn to the biome's own roles (leaf, leafAlt, bloom, bark, stone, accent, landmark, earth), keeping each face's lightness. kind: 'tree' | 'building' */
export function toRoles(geo, roles, kind = 'tree') { const R = Object.fromEntries(Object.entries(roles).map(([k, v]) => [k, new THREE.Color(v)])), g = geo.clone(), c = g.attributes.color, col = new THREE.Color(), hsl = {}, out = new THREE.Color()
  for (let i = 0; i < c.count; i++) { col.fromBufferAttribute(c, i); col.getHSL(hsl); const h = hsl.h * 360, l = hsl.l, shade = 0.62 + 0.85 * l; let role
    if (kind === 'tree') role = hsl.s < 0.12 ? R.stone : h > 60 && h < 190 ? (l > 0.42 ? R.bloom : l > 0.27 ? R.leaf : R.leafAlt) : R.bark
    else role = hsl.s < 0.14 ? R.stone : h < 50 || h > 320 ? R.accent : h < 190 ? R.leaf : h < 280 ? R.landmark : R.earth
    out.copy(role).multiplyScalar(kind === 'tree' ? 0.78 + 0.6 * l : shade); c.setXYZ(i, Math.min(1, out.r), Math.min(1, out.g), Math.min(1, out.b)) } return g }
/** One grade for everything, after the game's colour model: lightness on its ladder (nothing dark, nothing white), chroma under the tier's lid,
 *  hues drawn part of the way to the biome's nearest role hue, greys given a breath of the ground's hue, and the foot of each thing a little darker.
 *  tier: 'pop' (game pieces, C <= 0.195) | 'field' (trees, buildings, C <= 0.14) | 'calm' (C <= 0.09) */
export function toGrade(geo, roles, { tier = 'field', pull = 0.35, foot = 0.2, L = [0.4, 0.86] } = {}) {
  const CAP = { pop: 0.195, field: 0.14, calm: 0.09 }[tier], hues = Object.values(roles).map((h) => hexToOklch(h)).filter((c) => c.C > 0.04).map((c) => c.h), groundH = hexToOklch(roles.earth ?? Object.values(roles)[0]).h
  const g = geo.clone(), c = g.attributes.color, p = g.attributes.position, memo = new Map(), col = new THREE.Color(); g.computeBoundingBox(); const y0 = g.boundingBox.min.y, yh = Math.max(1e-6, g.boundingBox.max.y - y0)
  for (let i = 0; i < c.count; i++) { col.fromBufferAttribute(c, i); const hex = '#' + col.getHexString(); let o = memo.get(hex)
    if (!o) { const k = hexToOklch(hex); let h = k.h, C = k.C; const l = L[0] + (L[1] - L[0]) * Math.pow(Math.min(1, Math.max(0, k.L)), 0.85)
      if (C < 0.03) { h = groundH; C = 0.022 } else { let best = 0, bd = 999; for (const rh of hues) { const d = dHue(rh, h); if (Math.abs(d) < bd) { bd = Math.abs(d); best = d } } if (bd < 70) h += best * pull; C = Math.min(C, CAP, maxChroma(l, (h + 360) % 360) * 0.9) }
      o = new THREE.Color(oklchToHex(l, C, (h + 360) % 360)); memo.set(hex, o) }
    const f = 1 - foot * Math.pow(1 - (p.getY(i) - y0) / yh, 2.2); c.setXYZ(i, o.r * f, o.g * f, o.b * f) }
  return g }
/** Cloth: weave in world units; with `seams`, a darker line and a row of stitches (three-sided threads, 6 triangles each) along hard edges and colour borders. */
export function toCloth(geo, { seams = true, crease = 50, every = 0.09, long = 0.055, radius = 0.011, thread = '#efe6d2' } = {}) {
  const g = geo.clone(), p = g.attributes.position, c = g.attributes.color, tris = p.count / 3, tp = [], tc = [], tcol = new THREE.Color(thread); let stitches = 0
  if (seams) { const key = (i) => `${Math.round(p.getX(i) * 300)},${Math.round(p.getY(i) * 300)},${Math.round(p.getZ(i) * 300)}`, E = new Map(), a = new THREE.Vector3(), b = new THREE.Vector3(), d = new THREE.Vector3(), n = new THREE.Vector3(), s = new THREE.Vector3(), fn = [], cosC = Math.cos(crease * Math.PI / 180), fc = (t, k) => c.getX(t * 3) * (k === 0) + c.getY(t * 3) * (k === 1) + c.getZ(t * 3) * (k === 2)
    for (let t = 0; t < tris; t++) { a.fromBufferAttribute(p, t * 3); b.fromBufferAttribute(p, t * 3 + 1); d.fromBufferAttribute(p, t * 3 + 2); fn.push(new THREE.Vector3().subVectors(b, a).cross(n.subVectors(d, a)).normalize()); for (let k = 0; k < 3; k++) { const i = t * 3 + k, j = t * 3 + (k + 1) % 3, ki = key(i), kj = key(j), e = ki < kj ? ki + '|' + kj : kj + '|' + ki; (E.get(e) ?? E.set(e, []).get(e)).push([t, i, j]) } }
    for (const list of E.values()) { if (list.length !== 2) continue; const [[t0, i, j], [t1]] = list, turn = fn[t0].dot(fn[t1]) < cosC, hue = Math.abs(fc(t0, 0) - fc(t1, 0)) + Math.abs(fc(t0, 1) - fc(t1, 1)) + Math.abs(fc(t0, 2) - fc(t1, 2)) > 0.12; if (!turn && !hue) continue
      a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, j); const len = a.distanceTo(b); if (len < every * 0.8) continue; n.copy(fn[t0]).add(fn[t1]).normalize(); d.subVectors(b, a).normalize(); s.crossVectors(d, n).normalize(); const m = Math.max(1, Math.floor(len / every))
      for (let q = 0; q < m; q++) { const mid = a.clone().addScaledVector(d, (q + 0.5) * (len / m)).addScaledVector(n, 0.004 + radius), P = [0, 1, 2].map((w) => { const an = w * 2.094; return [n.clone().multiplyScalar(Math.cos(an) * radius).addScaledVector(s, Math.sin(an) * radius)] })
        for (let w = 0; w < 3; w++) { const o0 = P[w][0], o1 = P[(w + 1) % 3][0], A = mid.clone().addScaledVector(d, -long / 2), B = mid.clone().addScaledVector(d, long / 2), v = [A.clone().add(o0), B.clone().add(o0), B.clone().add(o1), A.clone().add(o0), B.clone().add(o1), A.clone().add(o1)]; for (const x of v) { tp.push(x.x, x.y, x.z); tc.push(tcol.r, tcol.g, tcol.b) } } stitches++ }
      for (const [, vi, vj] of list) for (const v of [vi, vj]) c.setXYZ(v, c.getX(v) * 0.74, c.getY(v) * 0.74, c.getZ(v) * 0.74) } }
  clothUV(g); let threads = null; if (tp.length) { threads = new THREE.BufferGeometry(); threads.setAttribute('position', new THREE.Float32BufferAttribute(tp, 3)); threads.setAttribute('color', new THREE.Float32BufferAttribute(tc, 3)); threads.computeVertexNormals() }
  return { cloth: g, threads, stitches }
}
/** Instances of one geometry. spots: [{ x, y, z, yaw = 0, scale = 1, tilt = 0 (round the local x axis), roll = 0 }] */
export function lay(geo, material, spots, { shadow = true } = {}) { const mesh = new THREE.InstancedMesh(geo, material, spots.length), M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(); spots.forEach((s, i) => { e.set(s.tilt ?? 0, s.yaw ?? 0, s.roll ?? 0, 'YXZ'); q.setFromEuler(e); const k = s.scale ?? 1; mesh.setMatrixAt(i, M.compose(new THREE.Vector3(s.x, s.y, s.z), q, new THREE.Vector3(k, k, k))) }); mesh.castShadow = shadow; mesh.receiveShadow = true; mesh.frustumCulled = false; return mesh }
export const HARD = () => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.42, metalness: 0 })
export const MATT = () => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0 })
