/* KFB Leicht-Pass L2 (29.09. spät) · L1 + Schatten nach Kanon tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md (PR #290): Radius je Kameraabstand, near/far eng,
 * normalBias 1,2 × Texel (Welt-Maßstab) · faceNormals = FACE_NORMALS-Regel (Wandnormalen nicht mit Dach/Kappe mitteln).
 * KFB Leicht-Pass L1 (29.09.) · macht eine fertige T4-Welt fahrbar, ohne Form oder Look zu ändern.
 * Befund J02: 7,6 Mio. Dreiecke je Bild bei 241 Draw Calls. Ursache: die T4-Massen sind weltweit gemergt
 * (strang 325k, stuetzen 281k, bordstein 204k, gehweg 200k, Laub 380k …). Eine Masse über die ganze Welt
 * wird nie weggeschnitten, weder von der Kamera noch vom Schatten; GTAO rendert die Szene ein weiteres Mal.
 *   1 · chunkify: große Massen nach Raster teilen (Dreieck nach Schwerpunkt), damit Frustum-Culling greift
 *   2 · Schatten nach LESSONS_SHADOWS (KFB ToolBox Production-03, 26.09.): Frustum auf den Darsteller,
 *       Mitte aufs Texelraster eingerastet, Bias an die Texelgröße gekoppelt, dünn/transparent wirft nicht
 *   3 · GTAO aus, Pixelverhältnis 1, Knet-Detail blendet früher aus (uClayLodK), Sheen aus
 * Rückgängig: nichts davon ändert Rezept oder Geometrieform. */
import * as THREE from 'three';

export function chunkify(root, { cell = 140, minTris = 30000 } = {}) {
  const I = new THREE.Matrix4(), out = { split: 0, chunks: 0, before: 0 }, todo = [];
  root.updateMatrixWorld(true);
  root.traverse(o => { if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || !o.visible) return; const g = o.geometry; if (!g?.attributes?.position) return;
    const n = (g.index ? g.index.count : g.attributes.position.count) / 3; if (n < minTris || !o.matrixWorld.equals(I)) return; todo.push(o); });
  for (const o of todo) {
    const g = o.geometry, pos = g.attributes.position, idx = g.index ? g.index.array : null, nT = (idx ? idx.length : pos.count) / 3;
    const groups = g.groups.length ? g.groups : [{ start: 0, count: nT * 3, materialIndex: 0 }], mats = Array.isArray(o.material) ? o.material : [o.material];
    const buckets = new Map();
    for (const gr of groups) for (let t = gr.start / 3; t < (gr.start + gr.count) / 3; t++) {
      const a = idx ? idx[t * 3] : t * 3, b = idx ? idx[t * 3 + 1] : t * 3 + 1, c = idx ? idx[t * 3 + 2] : t * 3 + 2;
      const cx = (pos.getX(a) + pos.getX(b) + pos.getX(c)) / 3, cz = (pos.getZ(a) + pos.getZ(b) + pos.getZ(c)) / 3;
      const key = Math.floor(cx / cell) + ',' + Math.floor(cz / cell) + ',' + (gr.materialIndex || 0);
      let B = buckets.get(key); if (!B) buckets.set(key, B = { mi: gr.materialIndex || 0, v: [] }); B.v.push(a, b, c); }
    if (buckets.size < 2) continue;
    const names = Object.keys(g.attributes), parent = o.parent;
    for (const B of buckets.values()) { const remap = new Map(), list = [], ni = new Uint32Array(B.v.length);
      for (let k = 0; k < B.v.length; k++) { let m = remap.get(B.v[k]); if (m === undefined) { m = list.length; remap.set(B.v[k], m); list.push(B.v[k]); } ni[k] = m; }
      const ng = new THREE.BufferGeometry();
      for (const nm of names) { const A = g.attributes[nm], s = A.itemSize, src = A.array, dst = new src.constructor(list.length * s);
        for (let k = 0; k < list.length; k++) for (let j = 0; j < s; j++) dst[k * s + j] = src[list[k] * s + j]; ng.setAttribute(nm, new THREE.BufferAttribute(dst, s, A.normalized)); }
      ng.setIndex(new THREE.BufferAttribute(ni, 1)); ng.computeBoundingSphere(); ng.computeBoundingBox();
      const m = new THREE.Mesh(ng, mats[B.mi] || mats[0]); m.name = o.name; m.castShadow = o.castShadow; m.receiveShadow = o.receiveShadow; m.renderOrder = o.renderOrder; m.userData = { ...o.userData, chunkOf: o.name };
      parent.add(m); out.chunks++; }
    out.before += nT; parent.remove(o); g.dispose(); out.split++; }
  return out;
}

/* LESSONS_SHADOWS-Rezept für einen Darsteller in einer großen Welt */
export function makeFitShadow(renderer, sun, { r = 60, size = 2048, back = 160 } = {}) {
  const smax = Math.min(size, renderer.capabilities.maxTextureSize);
  if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
  sun.shadow.mapSize.set(smax, smax);
  const L = sun.position.clone().sub(sun.target.position).normalize(), right = new THREE.Vector3().crossVectors(L, new THREE.Vector3(0, 1, 0)).normalize(), up = new THREE.Vector3().crossVectors(right, L).normalize();
  const cam = sun.shadow.camera, texel = 2 * r / smax, c = new THREE.Vector3();
  Object.assign(cam, { left: -r, right: r, top: r, bottom: -r, near: 0.1, far: 2 * r + back * 2 }); cam.updateProjectionMatrix();
  sun.shadow.bias = -0.00015; sun.shadow.normalBias = texel * 1.5;
  return p => { const a = Math.round(p.dot(right) / texel) * texel, b = Math.round(p.dot(up) / texel) * texel, d = p.dot(L);
    c.copy(right).multiplyScalar(a).addScaledVector(up, b).addScaledVector(L, d);
    sun.target.position.copy(c); sun.position.copy(c).addScaledVector(L, r + back); sun.target.updateMatrixWorld(); };
}

export function thinNoCast(scene) { let n = 0; scene.traverse(o => { if (!o.isMesh) return; const ms = Array.isArray(o.material) ? o.material : [o.material];
  if (ms.some(m => m.isShaderMaterial || m.isPointsMaterial || (m.transparent && m.opacity < 0.98))) { if (o.castShadow) n++; o.castShadow = false; } }); return n; }

export function clayLite(scene, U, { lodK = 1.8 } = {}) { let n = 0; if (U?.uClayLodK) U.uClayLodK.value = lodK;
  scene.traverse(o => { if (!o.isMesh) return; (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (m.isMeshPhysicalMaterial && m.sheen > 0) { m.sheen = 0; m.needsUpdate = true; n++; } }); }); return n; }

/* Kanon-Schatten, Welt-Maßstab: fit(center, r) · r in 8-m-Stufen, Mitte aufs Texelraster, normalBias 1,2 × Texel, bias klein */
export function makeShadowFollow(renderer, sun, { size = 2048, back = 80, nbK = 1.2, bias = -0.00005 } = {}) {
  const smax = Math.min(size, renderer.capabilities.maxTextureSize);
  if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
  sun.shadow.mapSize.set(smax, smax); sun.shadow.bias = bias;
  const L = sun.position.clone().sub(sun.target.position).normalize(), right = new THREE.Vector3().crossVectors(L, new THREE.Vector3(0, 1, 0)).normalize(), up = new THREE.Vector3().crossVectors(right, L).normalize();
  const cam = sun.shadow.camera, c = new THREE.Vector3(); let rNow = 0, texel = 1;
  const st = { r: 0, texel: 0 };
  const fit = (p, r) => { r = Math.max(24, Math.ceil(r / 8) * 8);
    if (r !== rNow) { rNow = r; texel = 2 * r / smax; Object.assign(cam, { left: -r, right: r, top: r, bottom: -r, near: 1, far: 2 * r + back }); cam.updateProjectionMatrix(); sun.shadow.normalBias = texel * nbK; st.r = r; st.texel = +texel.toFixed(4); }
    const a = Math.round(p.dot(right) / texel) * texel, b = Math.round(p.dot(up) / texel) * texel, d = p.dot(L);
    c.copy(right).multiplyScalar(a).addScaledVector(up, b).addScaledVector(L, d);
    sun.target.position.copy(c); sun.position.copy(c).addScaledVector(L, r + back * 0.5); sun.target.updateMatrixWorld(); };
  fit.state = st; return fit;
}

/* FACE_NORMALS (World Integration r2): je Ecke nur Nachbarflächen mitteln, deren Normale innerhalb 'deg' liegt. */
export function faceNormals(geom, deg = 42) {
  const g = geom.index ? geom.toNonIndexed() : geom, p = g.attributes.position, n = p.count / 3, fn = new Float32Array(n * 3), cos = Math.cos(deg * Math.PI / 180);
  let q = 1e3; { g.computeBoundingBox(); const s = g.boundingBox.getSize(new THREE.Vector3()).length(); q = 2e4 / Math.max(1, s); }
  const key = i => Math.round(p.getX(i) * q) + ',' + Math.round(p.getY(i) * q) + ',' + Math.round(p.getZ(i) * q), map = new Map();
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (let t = 0; t < n; t++) { a.fromBufferAttribute(p, t * 3); b.fromBufferAttribute(p, t * 3 + 1).sub(a); c.fromBufferAttribute(p, t * 3 + 2).sub(a); b.cross(c); const l = b.length(); if (l > 0) b.divideScalar(l); fn[t * 3] = b.x; fn[t * 3 + 1] = b.y; fn[t * 3 + 2] = b.z;
    for (let k = 0; k < 3; k++) { const K = key(t * 3 + k); let L = map.get(K); if (!L) map.set(K, L = []); L.push(t); } }
  const out = new Float32Array(p.count * 3);
  for (let v = 0; v < p.count; v++) { const t = (v / 3) | 0, L = map.get(key(v)); let x = 0, y = 0, z = 0;
    for (const u of L) { const d = fn[u * 3] * fn[t * 3] + fn[u * 3 + 1] * fn[t * 3 + 1] + fn[u * 3 + 2] * fn[t * 3 + 2]; if (d >= cos) { x += fn[u * 3]; y += fn[u * 3 + 1]; z += fn[u * 3 + 2]; } }
    const l = Math.hypot(x, y, z) || 1; out[v * 3] = x / l; out[v * 3 + 1] = y / l; out[v * 3 + 2] = z / l; }
  g.setAttribute('normal', new THREE.BufferAttribute(out, 3)); return g;
}

/* Knetgummi-Bande: die Bandenmasse federt am Treffpunkt (Vertex-Einschub vor dem Knet-Shader, Form bleibt) */
export function makeWobble() { const U = { uWobP: { value: new THREE.Vector3(0, -9999, 0) }, uWobT0: { value: -99 }, uWobA: { value: 0 }, uWobTime: { value: 0 } };
  const code = 'float wobT = uWobTime - uWobT0; float wobD = distance(position, uWobP); transformed += normal * (uWobA * exp(-wobT * 4.2) * sin(wobT * 24.0) * (1.0 - smoothstep(1.5, 11.0, wobD)) * step(0.0, wobT));';
  const patch = m => { if (!m || m.userData.wob) return; m.userData.wob = true; const ob = m.onBeforeCompile, ck = m.customProgramCacheKey;
    m.onBeforeCompile = (sh, r) => { ob && ob.call(m, sh, r); Object.assign(sh.uniforms, U); sh.vertexShader = 'uniform vec3 uWobP;\nuniform float uWobT0, uWobA, uWobTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n' + code); };
    m.customProgramCacheKey = () => (ck ? ck.call(m) : '') + '-wob1'; m.needsUpdate = true; };
  return { U, patch, hit(p, a, t) { U.uWobP.value.copy(p); U.uWobA.value = a; U.uWobT0.value = t; }, tick(t) { U.uWobTime.value = t; } }; }
