// Umriss nur außen für Figuren (Georg 23.10., Probe hinter outline=1): Stencil-Hülle. Die Figur schreibt Stencil 1, eine um eine feste Pixelbreite
// nach außen geschobene Hülle zeichnet nur dort, wo kein Figurpixel liegt (NotEqual 1) – keine Linien innen, und was vor der Figur steht, verdeckt den
// Umriss über den normalen Tiefentest. Nur Spieler + die 5 nächsten Figuren (Zeichenaufrufe je Teil). Farbe dunkler warmer Ton, keine schwarze Tusche
// (Kanon Gebiet 4 / HUD-Kontur V-673). Hüllen-Normalen geglättet (gegen Risse an harten Kanten); Haut-Animation über dasselbe Skelett.
// Befund 23.10.: BackSide setzt FLIP_SIDED, transformedNormal zeigte bei Haut-Teilen nach innen (Hülle lag in der Figur) – im Shader zurückgedreht.
import * as THREE from 'three'

export const OUTLINE_ON = typeof location !== 'undefined' && /(^|[#,])outline=1(,|$)/.test(location.hash)
export const OUTLINE = Object.freeze({ px: 2.5, color: '#2a1810', maxFigures: 6, radiusM: 30, scanS: 0.5 })
export const OUTLINE_TEST = { off: false } // Prüfhilfe: A/B im selben Moment (Hüllen ausgeblendet)

const NPC = /^npc:/, FACE = /eye|brow|mouth|nose|pupil|lid|moustache|tooth|teeth|tongue|smile|face|iris|lash/i // Gesichtsteile: keine Hülle (liegen im Umriss, scheinen sonst von hinten durch)
const WRAP = /^(eyeActor|faceActor|faceHost|pose|npc):.*$/ // Hüllknoten der Figuren („eyeActor:skeleton-…“) sind keine Gesichtsteile
const U = { uOutlinePx: { value: OUTLINE.px }, uOutlineRes: { value: new THREE.Vector2(1, 1) } }
const shown = (o) => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true }

// Normalen je Position mitteln (harte Kanten zusammenführen), damit die Hülle geschlossen bleibt
function smoothGeo(src) {
  const g = src.clone(), pos = g.attributes.position, n = new Float32Array(pos.count * 3), key = (i) => `${pos.getX(i).toFixed(4)},${pos.getY(i).toFixed(4)},${pos.getZ(i).toFixed(4)}`
  if (!g.attributes.normal) g.computeVertexNormals()
  const nn = g.attributes.normal, acc = new Map()
  for (let i = 0; i < pos.count; i++) { const k = key(i), a = acc.get(k) || [0, 0, 0]; a[0] += nn.getX(i); a[1] += nn.getY(i); a[2] += nn.getZ(i); acc.set(k, a) }
  for (let i = 0; i < pos.count; i++) { const a = acc.get(key(i)), l = Math.hypot(a[0], a[1], a[2]) || 1; n[i * 3] = a[0] / l; n[i * 3 + 1] = a[1] / l; n[i * 3 + 2] = a[2] / l }
  g.setAttribute('normal', new THREE.BufferAttribute(n, 3)); return g
}

function hullMaterial(skinned) {
  const m = new THREE.MeshBasicMaterial({ color: OUTLINE.color, side: THREE.BackSide, depthWrite: false })
  m.stencilWrite = true; m.stencilRef = 1; m.stencilFunc = THREE.NotEqualStencilFunc; m.stencilWriteMask = 0x00
  m.stencilFail = m.stencilZFail = m.stencilZPass = THREE.KeepStencilOp
  m.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U)
    sh.vertexShader = 'uniform float uOutlinePx; uniform vec2 uOutlineRes;\n' + sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
  { ${skinned ? 'vec3 oN = transformedNormal;\n    #ifdef FLIP_SIDED\n    oN = -oN; // BackSide dreht transformedNormal um – zurück nach außen\n    #endif' : 'vec3 oN = normalMatrix * normal;'}
    vec2 sN = (projectionMatrix * vec4(oN, 0.0)).xy; float l = length(sN);
    if (l > 1e-5) gl_Position.xy += (sN / l) * (uOutlinePx * 2.0 / uOutlineRes) * gl_Position.w; }`) }
  m.customProgramCacheKey = () => 'kfbOutline' + (skinned ? 'S' : 'M')
  return m
}
const MAT = { S: null, M: null }
const hullMat = (skinned) => (MAT[skinned ? 'S' : 'M'] ||= hullMaterial(skinned))

function markStencil(m) { if (!m || m.userData?.outlineStencil) return; m.userData.outlineStencil = true
  m.stencilWrite = true; m.stencilRef = 1; m.stencilFunc = THREE.AlwaysStencilFunc; m.stencilZPass = THREE.ReplaceStencilOp; m.stencilFail = m.stencilZFail = THREE.KeepStencilOp; m.needsUpdate = true }

export function createFigureOutline({ scene, player }) {
  const built = new WeakMap(), live = new Set(), stats = { figures: [], hulls: 0 }
  const geoCache = new WeakMap()
  let npcs = [], scanT = 0
  // je Figur: Hüllen für alle Teile, die noch keine haben (Figuren laden nach – nie ein leeres Ergebnis festhalten)
  function buildFor(root) {
    const hulls = built.get(root) || []
    root.traverse((o) => { if (!o.isMesh || o.userData?.outlineHull || o.userData?.outlineHas || !o.geometry?.attributes?.position) return
      for (let q = o; q && q !== root; q = q.parent) if (FACE.test((q.name || '').replace(WRAP, ''))) return
      const mats = [].concat(o.material); if (mats.some((m) => m.transparent && m.opacity < 0.99)) return
      mats.forEach(markStencil)
      let g = geoCache.get(o.geometry); if (!g) { g = smoothGeo(o.geometry); geoCache.set(o.geometry, g) }
      let h
      if (o.isSkinnedMesh) { h = new THREE.SkinnedMesh(g, hullMat(true)); h.bind(o.skeleton, o.bindMatrix); h.bindMode = o.bindMode }
      else h = new THREE.Mesh(g, hullMat(false))
      h.name = 'outline-hull'; h.userData.outlineHull = true; h.renderOrder = 10; h.frustumCulled = o.frustumCulled; h.castShadow = h.receiveShadow = false
      h.matrixAutoUpdate = false; o.add(h); h.visible = false; o.userData.outlineHas = true; hulls.push({ h, src: o }) })
    built.set(root, hulls); return hulls
  }
  return {
    update(dt, renderer) {
      if (renderer) { renderer.getDrawingBufferSize(U.uOutlineRes.value); U.uOutlinePx.value = (OUTLINE_TEST.px ?? OUTLINE.px) * renderer.getPixelRatio() }
      if ((scanT -= dt) <= 0) { scanT = OUTLINE.scanS; npcs = []; scene.traverse((o) => { if (NPC.test(o.name || '')) npcs.push(o) }) }
      const pl = player(); if (!pl) return
      const pp = pl.getWorldPosition(new THREE.Vector3()), cand = npcs.filter(shown).map((o) => ({ o, d: o.getWorldPosition(new THREE.Vector3()).distanceTo(pp) })).filter((x) => x.d <= OUTLINE.radiusM)
      cand.sort((a, b) => a.d - b.d)
      const want = new Set([pl, ...cand.slice(0, OUTLINE.maxFigures - 1).map((x) => x.o)])
      for (const r of live) if (!want.has(r)) { for (const { h } of built.get(r) || []) h.visible = false; live.delete(r) }
      let n = 0; stats.figures = []
      // Materialien können nachträglich getauscht werden (Knet-Look, Kit-Knete): Stencil-Markierung auf den aktuellen Materialien nachziehen
      if (scanT === OUTLINE.scanS) for (const r of want) r.traverse((o) => { if (o.isMesh && o.userData?.outlineHas) [].concat(o.material).forEach(markStencil) })
      for (const r of want) { const hs = buildFor(r); for (const { h, src } of hs) { h.visible = !OUTLINE_TEST.off && src.visible; n += h.visible ? 1 : 0 } live.add(r); stats.figures.push(r.name || 'player') }
      stats.hulls = n
    },
    status: () => ({ ...stats, px: OUTLINE.px }),
  }
}
