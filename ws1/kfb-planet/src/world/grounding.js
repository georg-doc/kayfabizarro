// V-654 C6 · Erdung in der Laufwelt (MVP-Kritiker R1 K4 = 3; Georg 22.10. Punkt 1 „Bäume und Steine sitzen ohne Übergang auf dem Boden“).
// Kanon: SPEC_PLACEMENT_GRAMMAR_R2 + CANON_3D_R1 Gebiet 2/4/15: keine Platten, nichts Schwebendes, Sockel sinken ein und das Gelände steigt an (Schürze,
// Erdkeil), Einsinken je Objektart, Kontakt-Geometrie bricht jede Fuge (V-565), Gruppen ungerade 1 : 0,62 : 0,38, Lücken ≥ 30 % des Randes.
// Modul nach Host-Vertrag R1.2: create(options) -> { object3d, update, dispose }. Es baut um jede Quelle (Kristall-Laterne, Baum, Fundsache, Amphitheater)
//   • einen Erdkeil: Ring-Netz im ECHTEN Geländematerial (gleiche Fließfarben, gleiches Licht), das vom Objekt aus ansteigt und unter dem Gelände
//     ausläuft – das Gelände steigt an, kein eigener Boden, keine Kante;
//   • Kontakt-Steinchen: kleine Knet-Brocken in ungeraden Gruppen am Fuß, eingesunken (35–60 % je Größe), Ton = dunkler Bodenton der Palette
//     (contactDepthTint, V-570: 8–12 L* unter dem Boden, nie schwarz). Ein Draw Call für alle Steinchen.
// options: { terrain: () => Gelände-Modul (height, surfaceAt, object3d), palette: { sand, low, mid, high, cliff }, sources: () => [{ id, kind, x, z, r?, radii? }] }
import * as THREE from 'three'

export const GROUND_KINDS = Object.freeze({
  // rIn = Fuß-Radius (× r der Quelle), w = Breite des Erdkeils (m), h = Anstieg am Fuß (m), groups = Kontakt-Gruppen, size = Ankerstein (m), sink = Einsinken (Anteil der Steinhöhe)
  crystal: { rIn: 1.0, w: 0.55, h: 0.12, groups: [1, 3], size: [0.09, 0.14], sink: [0.45, 0.6] },
  tree: { rIn: 1.0, w: 0.95, h: 0.16, groups: [1, 3], size: [0.11, 0.18], sink: [0.4, 0.55] },
  item: { rIn: 0.55, w: 0.28, h: 0.035, groups: [0, 1], size: [0.035, 0.055], sink: [0.35, 0.5] },
  amph: { rIn: 1.0, w: 3.2, h: 0.32, groups: null, size: [0.25, 0.55], sink: [0.45, 0.6] },
})
const fract = (v) => v - Math.floor(v)
const hash = (a, b) => fract(Math.sin(a * 127.1 + b * 311.7) * 43758.5453)
const sstep = (t) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t) }
const strSeed = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0 } return (h % 100003) / 100003 * 97 }
// glatter Ring-Rausch-Wert für den welligen Außenrand (nie ein Kreis)
const ringNoise = (a, s) => 0.5 + 0.3 * Math.sin(a * 3 + s * 7.1) + 0.2 * Math.sin(a * 7 + s * 3.3 + 1.7)

// V-570 „nie Schwarz“: Kronen-Unterseiten u. Ä. bekommen einen dunklen Kontaktton statt Schwarz – Untergrenze der beleuchteten Farbe = k × Grundfarbe
// (Materialantwort wie der Palettenschatten V-564, kein Licht). Hängt sich einmal je Material an (verkettet onBeforeCompile).
export function neverBlack(mat, k = 0.3) {
  if (!mat || mat.userData?.neverBlack || mat.isShaderMaterial) return false; mat.userData.neverBlack = true
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey
  mat.onBeforeCompile = (sh, r) => { prev?.call(mat, sh, r); sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `outgoingLight = max(outgoingLight, diffuseColor.rgb * ${k.toFixed(3)});\n#include <opaque_fragment>`) }
  mat.customProgramCacheKey = () => (prevKey ? prevKey.call(mat) : '') + '|neverBlack'; mat.needsUpdate = true; return true
}
export const groundLog = { create: 0, update: 0, dispose: 0, builds: 0 }

export function createGroundContact({ terrain, palette = {}, sources = () => [], neverBlackRoots = () => [] } = {}) {
  groundLog.create++
  const root = new THREE.Group(); root.name = 'ground-contact'
  const T = () => terrain?.(), surf = (x, z) => { const t = T(); return t?.surfaceAt ? t.surfaceAt(x, z) : t?.height ? t.height(x, z) : 0 }
  const terrainMat = () => { let m = null; T()?.object3d?.traverse((o) => { if (!m && o.isMesh && /terrain/.test(o.name)) m = o.material }); return m }
  // Kontakt-Steinchen: ein InstancedMesh (verbeulte Knet-Brocken), Ton je Instanz
  const pebGeo = (() => { const g = new THREE.IcosahedronGeometry(1, 1), p = g.attributes.position, v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = 0.82 + 0.3 * hash(Math.round(v.x * 10), Math.round(v.y * 10 + v.z * 7)); v.multiplyScalar(n); v.y *= 0.72; p.setXYZ(i, v.x, v.y, v.z) }
    g.computeVertexNormals(); return g })()
  const pebMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.95, metalness: 0 })
  const MAXP = 1200, peb = new THREE.InstancedMesh(pebGeo, pebMat, MAXP); peb.name = 'contact-pebbles'; peb.castShadow = true; peb.receiveShadow = true; peb.count = 0; peb.frustumCulled = false; root.add(peb)
  const tone = (role, dl) => { const c = new THREE.Color(palette[role] || '#8a7a68'); const hsl = {}; c.getHSL(hsl); return c.setHSL(hsl.h, hsl.s * 0.85, Math.max(0.08, hsl.l + dl)) }
  const TONES = [tone('cliff', -0.04), tone('high', -0.06), tone('mid', -0.1), tone('sand', -0.18)]   // contactDepthTint: dunkler Bodenton, nie schwarz
  const skirts = new Map(), built = new Map()   // id → Mesh, id → Signatur
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(), p3 = new THREE.Vector3()

  // Erdkeil: Polar-Netz, innen (t < 0) flach auf Fußhöhe unter dem Objekt, außen weich ins Gelände und knapp darunter (kein gleichliegendes Flackern)
  function skirtGeo(S, K) {
    const seed = strSeed(S.id), NA = S.kind === 'amph' ? 128 : 28, NR = 7, rr = (a) => (S.radii ? S.radii(a) : S.r) * K.rIn, pos = [], idx = []
    const gaps = S.gaps || []
    const inGap = (a) => gaps.some(([a0, a1]) => { const d = ((a - a0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI); return d < ((a1 - a0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) })
    for (let i = 0; i <= NA; i++) { const a = (i / NA) * Math.PI * 2, gapK = inGap(a) ? 0 : 1, w = K.w * (0.7 + 0.6 * ringNoise(a, seed)), r0 = rr(a)
      for (let j = 0; j < NR; j++) { const t = j / (NR - 1), r = r0 * (0.55 + 0.45 * Math.min(1, t * 4)) + t * w, x = S.x + Math.cos(a) * r, z = S.z + Math.sin(a) * r   // Radius steigt streng (keine Falten)
        const prof = Math.pow(1 - sstep(t), 1.3), y = surf(x, z) + K.h * gapK * prof * (0.85 + 0.3 * ringNoise(a * 2, seed + 3)) - (j === NR - 1 ? 0.04 : 0)
        pos.push(x, y, z) } }
    for (let i = 0; i < NA; i++) for (let j = 0; j < NR - 1; j++) { const a = i * NR + j, b = (i + 1) * NR + j; idx.push(a, a + 1, b, b, a + 1, b + 1) }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals()
    // Normalen wie das Gelände, nur leicht zum Anstieg geneigt (sonst liest der Keil als eigenes Objekt mit eigenem Licht)
    const nr = g.attributes.normal, e = 0.3, n = new THREE.Vector3(), up = new THREE.Vector3()
    for (let k = 0; k < nr.count; k++) { const x = pos[k * 3], z = pos[k * 3 + 2]; up.set(surf(x - e, z) - surf(x + e, z), 2 * e, surf(x, z - e) - surf(x, z + e)).normalize(); n.fromBufferAttribute(nr, k); if (n.y < 0) n.negate(); n.lerp(up, 0.6).normalize(); nr.setXYZ(k, n.x, n.y, n.z) }
    return g
  }
  // Kontakt-Gruppen am Fuß: ungerade (1 oder 3), Anker 1 : 0,62 : 0,38, Stützen überlappen den Anker, Winkel mit ≥ 30 % freiem Rand
  function pebblesFor(S, K, out) {
    const seed = strSeed(S.id), R = (k) => hash(seed + k * 1.37, k * 0.71 + seed)
    const place = (a, r, s, k) => { const x = S.x + Math.cos(a) * r, z = S.z + Math.sin(a) * r, sink = K.sink[0] + (K.sink[1] - K.sink[0]) * R(k + 40) * (s / K.size[1])
      out.push({ x, y: surf(x, z) - s * 0.72 * (sink * 2 - 1), z, s, rot: R(k + 50) * 6.28, tone: TONES[Math.floor(R(k + 60) * TONES.length) % TONES.length] }) }
    if (S.kind === 'amph') {   // Bänder nach SPEC_PLACEMENT_GRAMMAR_R2 §Bühnenfuß (Startwerte): Band 0 −0,1–0,7 m 2,0 Gruppen/10 m, Band 1 0,9–3 m 0,9, Band 2 3–6 m 0,3
      const per = S.radii ? Array.from({ length: 64 }, (_, i) => S.radii((i / 64) * 2 * Math.PI)).reduce((s, v) => s + v, 0) / 64 * 2 * Math.PI : 2 * Math.PI * S.r
      let k = 0; for (const [b0, b1, dens, scale] of [[-0.1, 0.7, 2.0, 1], [0.9, 3, 0.9, 0.62], [3, 6, 0.3, 0.38]]) { const n = Math.round(per / 10 * dens)
        for (let g = 0; g < n; g++) { const a = (g + 0.15 + 0.7 * R(k++)) / n * Math.PI * 2; if (R(k++) < 0.3) continue   // ≥ 30 % Lücke
          if ((S.gaps || []).some(([a0, a1]) => a > a0 && a < a1)) continue
          const r = (S.radii ? S.radii(a) : S.r) + b0 + (b1 - b0) * R(k++), s = (K.size[0] + (K.size[1] - K.size[0]) * R(k++)) * scale
          place(a, r, s, k++); if (R(k++) < 0.6) { place(a + s * 1.1 / r, r + s * 0.5, s * 0.62, k++); place(a - s * 0.9 / r, r + s * 0.2, s * 0.38, k++) } } }
      return }
    const G = R(1) < 0.5 ? K.groups[0] : K.groups[1]; let used = []
    for (let g = 0; g < G; g++) { let a = R(g * 3 + 2) * Math.PI * 2; for (let t = 0; t < 6 && used.some((u) => Math.abs(Math.atan2(Math.sin(a - u), Math.cos(a - u))) < 1.0); t++) a += 1.3; used.push(a)
      const s = K.size[0] + (K.size[1] - K.size[0]) * R(g + 7), r = S.r * K.rIn + s * 0.35
      place(a, r, s, g * 10); if (g === 0) { place(a + 0.45, r + s * 0.55, s * 0.62, g * 10 + 1); place(a - 0.38, r + s * 0.3, s * 0.38, g * 10 + 2) } }
  }

  let t = 0, lastSig = '', nbCount = 0
  function rebuild() {
    groundLog.builds++
    const mat = terrainMat(); if (!mat) return
    const list = sources().filter(Boolean), seen = new Set(), pebs = []
    for (const S of list) { const K = GROUND_KINDS[S.kind]; if (!K) continue; seen.add(S.id)
      const sig = [S.x.toFixed(2), S.z.toFixed(2), (S.r || 0).toFixed(2), S.visible !== false].join('|')
      if (S.visible === false) { const m = skirts.get(S.id); if (m) m.visible = false } else {
        if (built.get(S.id) !== sig) { const old = skirts.get(S.id); if (old) { root.remove(old); old.geometry.dispose() }
          const m = new THREE.Mesh(skirtGeo(S, K), mat); m.name = 'ground-skirt:' + S.id; m.receiveShadow = true; m.renderOrder = -0.5; root.add(m); skirts.set(S.id, m); built.set(S.id, sig) }
        skirts.get(S.id).visible = true; pebblesFor(S, K, pebs) } }
    for (const [id, m] of skirts) if (!seen.has(id)) { root.remove(m); m.geometry.dispose(); skirts.delete(id); built.delete(id) }
    peb.count = Math.min(MAXP, pebs.length)
    for (let i = 0; i < peb.count; i++) { const P = pebs[i]; m4.compose(p3.set(P.x, P.y, P.z), q.setFromEuler(e.set(0, P.rot, 0)), sc.set(P.s, P.s, P.s)); peb.setMatrixAt(i, m4); peb.setColorAt(i, P.tone) }
    peb.instanceMatrix.needsUpdate = true; if (peb.instanceColor) peb.instanceColor.needsUpdate = true
  }
  return {
    object3d: root,
    info: () => ({ skirts: skirts.size, pebbles: peb.count, neverBlack: nbCount, builds: groundLog.builds, kinds: [...new Set(sources().filter(Boolean).map((s) => s.kind))] }),
    // Prüfhilfe: Erdkeil-Höhe über dem Gelände und Steinchen je Quelle
    probe: (id) => { const m = skirts.get(id); if (!m) return null; const p = m.geometry.attributes.position; let maxRise = 0; for (let i = 0; i < p.count; i++) maxRise = Math.max(maxRise, p.getY(i) - surf(p.getX(i), p.getZ(i))); return { maxRise: +maxRise.toFixed(3), verts: p.count } },
    update(dt = 0) { groundLog.update++; t += dt; if (t < 0.5 && lastSig) return; t = 0
      for (const r of neverBlackRoots() || []) r?.traverse?.((o) => { if (o.isMesh) for (const m of [].concat(o.material)) if (neverBlack(m)) nbCount++ })
      const list = sources().filter(Boolean), sig = list.map((S) => S.id + ':' + S.x.toFixed(2) + ',' + S.z.toFixed(2) + ',' + (S.visible !== false)).join(';') + '|' + !!terrainMat()
      if (sig !== lastSig) { lastSig = sig; rebuild() } },
    dispose() { groundLog.dispose++; for (const m of skirts.values()) m.geometry.dispose(); pebGeo.dispose(); pebMat.dispose(); peb.dispose(); root.clear() },
  }
}
