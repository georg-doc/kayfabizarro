/* KFB Proof Stage v1 · kfb.proof-stage/1 · the ONE acceptance stage (Abnahme-Bühne) for every workstation (WS0 PROOF_STAGE_R1, 17.10.2026)
 *
 * Georg 17.10.: "Ich will eine einheitliche und repräsentative Darstellung aller Abnahmen!" · "Wieso haben die Modelle keine Augen?"
 * Every approval image (WSB, WSA, WS1, WS0) comes out of this file, the same way:
 *   light   vendor/kfb-stage-light.v1.js (WS1, LIGHT_MODEL_R2): one rig, MOODS_MESA day (tod 1), sun = only shadow caster (PCF soft,
 *           fitShadow), hemisphere ground = cove colour, one warm figure light from the camera side, contact AO. All objects cast and
 *           receive shadows (eye meshes do not cast, as in EyeRig v6).
 *   tone    ACES Filmic, exposure 1 (applyTone(renderer, 'aces', 1)) = the WS1 game path (clayLook/stage-light default, RETURN CLAY_SSOT_R1 §2).
 *   clay    vendor/kfb-clay.v1.1.js: character -> card material.clayProfile (aliases), prop/stage -> midground with scaleRef = FrizzleBob
 *           height; seed = card material.claySeed, else card id, else file name. The cove gets 'background' with relief off (neutral).
 *   set     soft hollow-curve studio cove (floor + quarter-round + wall), light warm clay colour, no sky picture, no Meshy stage.
 *   camera  fixed presets: front 0°, threeq 35°, side 90°, back 180° (figure fills 80 % of the frame), near_face (head 60 % of the frame
 *           height), far (figure 40 %), scale_ref (next to a FrizzleBob silhouette of 1.81 m). 1600 x 1200, pixel ratio 1.
 *   eyes    kfb-proof-eyes.v1.js: EyeRig v6 + E2 lid skin on every figure with eye anchors; states rest | half | closed.
 *   units   KayKit units x 0.616 m (V-345: FB 2.94 u = 1.81 m); opts.units = 'm' for files already in metres.
 * Gates (FAIL -> no export): G1 eyes present (figures) · G2 no missing textures/default materials/NaN normals · G3 lowest point on the
 * floor within ±1 cm · G4 (warning) bounding-box outliers, loose islands < 0.5 % of the volume, open boundaries · G5 clay module active.
 * Deterministic: Math.random is replaced by a seeded generator while the stage loads and renders (EyeRig v6 draws timers from it).
 */
import { createStageLight, createContactAO, applyTone, MOODS_MESA, SCHEMA as LIGHT_SCHEMA } from './vendor/kfb-stage-light.v1.js';
import { applyClay, resolveProfile, SKIP_DEFAULT, VERSION as CLAY_VERSION } from './vendor/kfb-clay.v1.1.js';
import { mountEyes, findEyeSeat, LID_STATES, EYES_VERSION } from './kfb-proof-eyes.v1.js';

export const SCHEMA = 'kfb.proof-stage/1';
export const VERSION = 'kfb-proof-stage.v1';
export const W = 1600, H = 1200, FOV = 30;
export const U2M = 0.616;                     // m per KayKit unit (V-345)
export const FB_HEIGHT = 1.81;                // m, FrizzleBob (figure card, V-345)
export const COVE = '#f2e8d8', BG = '#f3ece0', SILHOUETTE = '#6f655b';
export const VIEWS = Object.freeze(['front', 'threeq', 'side', 'back', 'near_face', 'far', 'scale_ref']);
export const EYE_STATES = Object.freeze(Object.keys(LID_STATES));
const AZ = { front: 0, threeq: 35, side: 90, back: 180, near_face: 0, far: 20, scale_ref: 0 };
const EL = { front: 5, threeq: 6, side: 5, back: 5, near_face: 3, far: 8, scale_ref: 4 };
const FILL = { full: 0.8, face: 0.6, far: 0.4, scale: 0.7 };
export const MODULES = ({ stage: VERSION, clay: CLAY_VERSION, light: LIGHT_SCHEMA + ' (kfb-stage-light.v1)', eyes: EYES_VERSION, eyeRig: 'pet-eye-rig.v6', lid: 'clay-skin-attach.v1 + clay-eyelid.v3 (E2)', three: null });  // three is filled in by createProofStage

/* ---------- deterministic random (EyeRig v6 uses Math.random for timers) ---------- */
const fnv = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; };
function seedRandom(seed) { let a = fnv(String(seed)) || 1; Math.random = () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const isUnder = (o, r) => { for (let n = o; n; n = n.parent) if (n === r) return true; return false; };
const visibleChain = (o) => { for (let n = o; n; n = n.parent) if (!n.visible) return false; return true; };
const pathOf = (o, root) => { const a = []; for (let n = o; n && n !== root.parent; n = n.parent) a.push(n.name || ''); return a.reverse().join('/'); };

/* precise world bounds of the subject's own meshes (skin applied; eye rig, hidden and helper meshes excluded) */
function bodyBounds(THREE, root, filter = () => true, vfilter = null) {
  const b = new THREE.Box3(), v = new THREE.Vector3(); root.updateMatrixWorld(true);
  root.traverse((m) => {
    if (!m.isMesh || !m.geometry?.attributes?.position || m.userData.eyeRig || m.userData.noMeasure || m.userData.petOverlay || !visibleChain(m) || !filter(m)) return;
    const P = m.geometry.attributes.position;
    for (let i = 0; i < P.count; i++) { m.getVertexPosition(i, v); m.localToWorld(v); if (Number.isFinite(v.x + v.y + v.z) && (!vfilter || vfilter(v))) b.expandByPoint(v); }
  });
  return b;
}
function eyeBounds(THREE, eyes) {
  const b = new THREE.Box3(); if (!eyes || eyes.status !== "OK") return b;
  for (const e of eyes.eyes()) e.traverse((m) => { if (m.isMesh && visibleChain(m)) b.expandByObject(m); });
  return b;
}
/* head region: vertices whose strongest bone is the head bone or a descendant (ear chains excluded) and that sit above the head bone
   (the neck pivot), plus rigid meshes under it and the eyes */
function headBounds(THREE, root, eyes) {
  let head = null; root.traverse((o) => { if (!head && o.isBone && /^head$/i.test(o.name)) head = o; });
  if (!head) return null;
  const ok = new Set(); head.traverse((b) => { if (b.isBone && !/(^|[._])ear/i.test(b.name)) ok.add(b); });
  const box = new THREE.Box3(), v = new THREE.Vector3(); root.updateMatrixWorld(true);
  const yNeck = head.getWorldPosition(new THREE.Vector3()).y;                     // hair hanging below the neck is not the head
  root.traverse((m) => {
    if (!m.isMesh || m.userData.eyeRig || m.userData.noMeasure || m.userData.petOverlay || !visibleChain(m)) return;
    const P = m.geometry.attributes.position;
    if (m.isSkinnedMesh && m.skeleton && m.geometry.attributes.skinIndex) {
      const si = m.geometry.attributes.skinIndex, sw = m.geometry.attributes.skinWeight, bones = m.skeleton.bones;
      for (let i = 0; i < P.count; i++) { let best = 0, bw = -1; for (let j = 0; j < 4; j++) { const w = sw.getComponent(i, j); if (w > bw) { bw = w; best = si.getComponent(i, j); } } if (!ok.has(bones[best])) continue; m.getVertexPosition(i, v); m.localToWorld(v); if (v.y >= yNeck) box.expandByPoint(v); }
    } else if (isUnder(m, head)) box.expandByObject(m, true);
  });
  box.union(eyeBounds(THREE, eyes));
  return box.isEmpty() ? null : box;
}

/* soft hollow-curve cove: floor (front) -> quarter round -> wall, extruded along x. s = size factor. */
function makeCove(THREE, s, zWall) {
  const Rc = 1.6 * s, Hw = 6 * s, Wd = 16 * s, zFront = 9 * s, prof = [];
  prof.push([0, zFront]); for (let i = 0; i <= 24; i++) { const t = (i / 24) * Math.PI / 2; prof.push([Rc - Rc * Math.cos(t), zWall + Rc - Rc * Math.sin(t)]); } prof.push([Hw, zWall]);
  const nx = 48, pos = [], idx = [];
  for (let j = 0; j < prof.length; j++) for (let i = 0; i <= nx; i++) pos.push(-Wd / 2 + (Wd * i) / nx, prof[j][0], prof[j][1]);
  for (let j = 0; j < prof.length - 1; j++) for (let i = 0; i < nx; i++) { const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1; idx.push(a, b, c, b, d, c); }   // CCW seen from the subject side (normals up / toward +z)
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: COVE, roughness: 1, metalness: 0, name: 'proof-cove' }));
  m.name = 'proof_cove'; m.receiveShadow = true; m.castShadow = false;
  const root = new THREE.Group(); root.name = 'proof_cove'; root.add(m); return root;
}

/* card face parts on original meshes (card.brows / card.nose with owner 'original-mesh' + transform, card.mouth conform): ToolBox maths
   (partrig.v1 apply + face-mount.v1 bake/pitch/yaw/sx): bake the node transform into the geometry, pivot at the part's centre,
   scale (scale·sx/sy/sz), offset (spread·side, lift, depth), tilt·side about z, pitch about x, yaw·side about y. Rigid meshes only. */
export function applyCardFaceParts(THREE, root, card, exportOriginal = null) {
  const done = [];
  for (const k of ['brows', 'nose', 'mouth']) {
    const part = card && card[k]; if (!part || part.owner !== 'original-mesh') continue;
    const q = part.transform || (exportOriginal && exportOriginal[k]) || null; if (!q) continue;
    const names = [].concat(part.nodes || part.node || []), D = Math.PI / 180, meshes = [];
    root.traverse((o) => { if (names.includes(o.name)) o.traverse((m) => { if (m.isMesh && !m.isSkinnedMesh) meshes.push(m); }); });
    const one = meshes.length === 1;
    for (const m of meshes) {
      if (!m.userData._kfbBaked) { m.updateMatrix(); const g = m.geometry.clone(); g.applyMatrix4(m.matrix); m.geometry = g; m.position.set(0, 0, 0); m.quaternion.identity(); m.scale.set(1, 1, 1); m.userData._kfbBaked = true; }
      m.geometry.computeBoundingBox(); const c = m.geometry.boundingBox.getCenter(new THREE.Vector3()), sign = c.x < 0 ? -1 : 1;
      const host = new THREE.Group(); host.name = 'pivot:' + m.name; m.parent.add(host); host.position.copy(c); host.add(m); m.position.sub(c);
      const sc = q.scale ?? 1;
      host.scale.set(sc * (q.sx ?? 1), sc * (q.sy ?? 1), sc * (q.sz ?? 1));
      host.position.set(c.x + (q.spread || 0) * sign, c.y + (q.lift || 0), c.z + (q.depth || 0));
      host.rotation.set((q.pitch || 0) * D, (q.yaw || 0) * D * (one ? 1 : sign), (q.tilt || 0) * D * sign);
      done.push(`${m.name} (${k}, transform from ${part.transform ? 'card' : 'card source export'})`);
    }
  }
  /* card.mouth owner 'original-mesh': conform the painted mouth card onto the real skin (face-mount.v1 conformOriginalMouth: every vertex
     is projected along the mouth's own -Z onto the skin, + a small offset), so it does not stand off the face in ¾ and side views. */
  const mo = card && card.mouth;
  if (mo && mo.owner === 'original-mesh' && mo.node) {
    root.updateMatrixWorld(true);
    const fh = new THREE.Box3().setFromObject(root, true), Hh = Math.max(1e-3, fh.max.y - fh.min.y), L = 0.2 * Hh, EPS = 0.0014 * Hh;
    const face = /^(FB_Eye_[LR]|Carl_Brow_[LR]|Carl_Nose|FB_Mouth.*|pivot:.*|faceHost|KFB_EyeHost)$/;
    const isFace = (o) => { for (let n = o; n && n !== root; n = n.parent) if (face.test(n.name || '') || n.name === mo.node) return true; return false; };
    const skin = []; root.traverse((o) => { if (o.isMesh && visibleChain(o) && !isFace(o)) skin.push(o); });
    const mouths = []; root.traverse((o) => { if (o.name === mo.node) o.traverse((m) => { if (m.isMesh && !m.isSkinnedMesh) mouths.push(m); }); });
    const ray = new THREE.Raycaster(), q = new THREE.Quaternion(), v = new THREE.Vector3(), w = new THREE.Vector3(), inv = new THREE.Matrix4();
    for (const m of mouths) {
      const P = m.geometry.attributes.position, n0 = new THREE.Vector3(0, 0, 1).applyQuaternion(m.getWorldQuaternion(q)).normalize();
      const wc = new THREE.Vector3(); for (let i = 0; i < P.count; i++) wc.add(v.fromBufferAttribute(P, i).applyMatrix4(m.matrixWorld)); wc.multiplyScalar(1 / P.count);
      ray.set(wc.clone().addScaledVector(n0, L), n0.clone().negate()); ray.far = 2 * L;
      const first = ray.intersectObjects(skin, false)[0]; if (!first) continue;
      let rW = 0; for (let i = 0; i < P.count; i++) rW = Math.max(rW, v.fromBufferAttribute(P, i).applyMatrix4(m.matrixWorld).distanceTo(wc));
      /* bake the hit skin mesh (skin applied) into a static world-space patch around the mouth */
      const sm = first.object, G = sm.geometry, SP = G.attributes.position, I = G.index ? G.index.array : null, nT = I ? I.length / 3 : SP.count / 3, R2 = (rW * 1.6 + 0.1 * Hh) ** 2, out = [];
      const wp = new Float32Array(SP.count * 3); for (let i = 0; i < SP.count; i++) { sm.getVertexPosition(i, w); w.applyMatrix4(sm.matrixWorld); wp[i * 3] = w.x; wp[i * 3 + 1] = w.y; wp[i * 3 + 2] = w.z; }
      const near = (k) => (wp[k * 3] - wc.x) ** 2 + (wp[k * 3 + 1] - wc.y) ** 2 + (wp[k * 3 + 2] - wc.z) ** 2 < R2;
      for (let t = 0; t < nT; t++) { const a = I ? I[3 * t] : 3 * t, b = I ? I[3 * t + 1] : 3 * t + 1, c = I ? I[3 * t + 2] : 3 * t + 2; if (near(a) || near(b) || near(c)) for (const k of [a, b, c]) out.push(wp[k * 3], wp[k * 3 + 1], wp[k * 3 + 2]); }
      const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
      const patch = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })); patch.updateMatrixWorld(true);
      inv.copy(m.matrixWorld).invert(); let hit = 0;
      for (let i = 0; i < P.count; i++) {
        v.fromBufferAttribute(P, i).applyMatrix4(m.matrixWorld); ray.set(v.clone().addScaledVector(n0, L), n0.clone().negate());
        const h = ray.intersectObject(patch, false)[0]; if (h) { v.copy(h.point).addScaledVector(n0, EPS).applyMatrix4(inv); P.setXYZ(i, v.x, v.y, v.z); hit++; }
      }
      P.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingBox(); m.geometry.computeBoundingSphere(); pg.dispose(); patch.material.dispose();
      for (const mt of [].concat(m.material)) if (mt) { mt.polygonOffset = true; mt.polygonOffsetFactor = -1; mt.polygonOffsetUnits = -1; }
      done.push(`${m.name} (mouth conformed ${hit}/${P.count})`);
    }
  }
  root.updateMatrixWorld(true);
  return done;
}

/* ---------- gates ---------- */
function weldKey(P, i, q) { return Math.round(P.getX(i) / q) + ',' + Math.round(P.getY(i) / q) + ',' + Math.round(P.getZ(i) / q); }
function meshTopology(m, q) {
  const g = m.geometry, P = g.attributes.position, n = P.count, id = new Int32Array(n), map = new Map();
  for (let i = 0; i < n; i++) { const k = weldKey(P, i, q); let v = map.get(k); if (v === undefined) { v = map.size; map.set(k, v); } id[i] = v; }
  const N = map.size, par = new Int32Array(N); for (let i = 0; i < N; i++) par[i] = i;
  const find = (x) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
  const I = g.index ? g.index.array : null, T = I ? I.length / 3 : n / 3, edges = new Map();
  for (let t = 0; t < T; t++) {
    const a = id[I ? I[3 * t] : 3 * t], b = id[I ? I[3 * t + 1] : 3 * t + 1], c = id[I ? I[3 * t + 2] : 3 * t + 2];
    par[find(a)] = find(b); par[find(b)] = find(c);
    for (const [u, v] of [[a, b], [b, c], [c, a]]) { if (u === v) continue; const k = u < v ? u * N + v : v * N + u; edges.set(k, (edges.get(k) || 0) + 1); }
  }
  let open = 0; for (const c of edges.values()) if (c === 1) open++;
  const comp = new Map(); for (let i = 0; i < n; i++) { const r = find(id[i]); let c = comp.get(r); if (!c) { c = []; comp.set(r, c); } c.push(i); }
  return { islands: [...comp.values()], openEdges: open, tris: T };
}
export function runGates(THREE, S) {
  const { root, type, eyes, clay, loadErrors } = S, G = {};
  // G1 eyes
  if (type === 'character') {
    const r = eyes?.status === 'OK' ? eyes.report() : null;
    const px = S.eyePixels || { total: 0, perEye: [] };
    const minPx = 0.0012 * W * H;
    const ok = !!r && r.eyes >= 1 && r.lidSkins === r.eyes && r.v6ShellsVisible === 0 && px.perEye.length === r.eyes && px.perEye.every((p) => p >= minPx / Math.max(1, r.eyes));
    G.G1 = { name: 'Augen vorhanden (EyeRig v6 + E2)', result: ok ? 'PASS' : 'FAIL',
      detail: eyes?.status !== 'OK' ? (eyes?.status === 'NO_ANCHORS' ? 'KEINE AUGEN-ANKER · ' : eyes?.status + ' · ') + (eyes?.reason || '') : `seat ${r.seat} · ${r.eyes} Auge(n) · ${r.lidSkins} E2-Lidhaut · v6-Schalen sichtbar ${r.v6ShellsVisible} · Augenpixel near_face ${px.perEye.join(' / ')} (min ${Math.round(minPx / Math.max(1, r.eyes))})` };
  } else {
    const r = eyes?.status === 'OK' ? eyes.report() : null;
    G.G1 = { name: 'Augen (nur Figuren)', result: 'N/A', detail: r ? `Prop mit Augen-Ankern: ${r.eyes} Auge(n) montiert` : 'Prop/Bühne ohne Augen-Anker' };
  }
  // G2 materials / textures / normals
  const bad = [];
  root.traverse((m) => {
    if (!m.isMesh || m.userData.eyeRig || m.userData.noMeasure || !visibleChain(m)) return;
    const mats = [].concat(m.material);
    for (const mt of mats) {
      if (!mt) { bad.push(`${m.name}: kein Material`); continue; }
      const src = mt.userData?.kfbClay?.src || mt;
      if (!src.name && src.isMeshStandardMaterial && src.metalness === 1 && src.roughness === 1 && !src.map && src.color?.getHex() === 0xffffff) bad.push(`${m.name}: glTF-Standardmaterial (Material fehlt in der Datei)`);
      if (src.color && src.color.r > 0.95 && src.color.g < 0.05 && src.color.b > 0.95) bad.push(`${m.name}: Magenta-Material`);
      for (const k of ['map', 'normalMap', 'roughnessMap', 'aoMap', 'emissiveMap']) { const t = src[k]; if (t && (!t.image || !(t.image.width > 0 || t.image.videoWidth > 0 || t.image.data))) bad.push(`${m.name}: Textur ${k} ohne Bild`); }
    }
    const N = m.geometry.attributes.normal;
    if (!N) { bad.push(`${m.name}: keine Normalen`); return; }
    let nan = 0, zero = 0; for (let i = 0; i < N.count; i++) { const x = N.getX(i), y = N.getY(i), z = N.getZ(i); if (!Number.isFinite(x + y + z)) nan++; else if (x * x + y * y + z * z < 0.25) zero++; }
    if (nan) bad.push(`${m.name}: ${nan} NaN-Normalen`); if (zero > N.count * 0.001) bad.push(`${m.name}: ${zero} Null-Normalen`);
  });
  for (const e of loadErrors) bad.push('Ladefehler: ' + e);
  G.G2 = { name: 'Texturen, Materialien, Normalen', result: bad.length ? 'FAIL' : 'PASS', detail: bad.length ? bad.slice(0, 8).join(' · ') + (bad.length > 8 ? ` · … (${bad.length})` : '') : 'keine fehlenden Texturen, kein Standard-/Magenta-Material, keine NaN-Normalen' };
  // G3 floor contact
  const minY = S.bounds.min.y;
  G.G3 = { name: 'Bodenkontakt ±1 cm', result: Math.abs(minY) <= 0.01 ? 'PASS' : 'FAIL', detail: `tiefster Punkt y = ${(minY * 100).toFixed(2)} cm (${minY > 0 ? 'schwebt' : minY < -0.01 ? 'versinkt' : 'steht'})`, minY_m: +minY.toFixed(4) };
  // G4 outliers, islands, holes (warnings)
  const B = S.bounds, size = B.getSize(new THREE.Vector3()), vol = Math.max(1e-9, size.x * size.y * size.z), q = Math.max(size.x, size.y, size.z) * 1e-5;
  const small = [], outl = [], openM = []; let islandsTotal = 0;
  const core = B.clone().expandByVector(size.clone().multiplyScalar(0.25)), v = new THREE.Vector3();
  root.traverse((m) => {
    if (!m.isMesh || m.userData.eyeRig || m.userData.noMeasure || !visibleChain(m) || !m.geometry.attributes.position) return;
    const t = meshTopology(m, q / Math.max(1e-9, m.matrixWorld.getMaxScaleOnAxis()));
    islandsTotal += t.islands.length; if (t.openEdges) openM.push(`${m.name || '?'} (${t.openEdges} offene Kanten)`);
    for (const isl of t.islands) {
      const bb = new THREE.Box3(); for (const i of isl) { m.getVertexPosition(i, v); m.localToWorld(v); bb.expandByPoint(v); }
      const s = bb.getSize(new THREE.Vector3()), iv = Math.max(s.x, 1e-4 * size.x) * Math.max(s.y, 1e-4 * size.y) * Math.max(s.z, 1e-4 * size.z);
      if (t.islands.length > 1 && iv / vol < 0.005) small.push(m.name || '?');
      if (!core.containsBox(bb)) outl.push(m.name || '?');
    }
  });
  const count = (a) => Object.entries(a.reduce((o, k) => ((o[k] = (o[k] || 0) + 1), o), {})).map(([k, n]) => `${k} ×${n}`);
  const warn = small.length || outl.length || openM.length;
  G.G4 = { name: 'Fremdteile, lose Inseln, Löcher (Warnung)', result: warn ? 'WARN' : 'PASS',
    detail: `${islandsTotal} Inseln · lose < 0,5 % Volumen: ${small.length ? count(small).slice(0, 6).join(', ') : 'keine'} · Ausreißer: ${outl.length ? count(outl).join(', ') : 'keine'} · offene Ränder: ${openM.length ? openM.slice(0, 4).join(', ') + (openM.length > 4 ? ' …' : '') : 'keine'}`,
    smallIslands: small.length, outliers: outl.length, openMeshes: openM.length };
  // G5 clay active
  let eligible = 0, clayed = 0; const missing = [];
  root.traverse((m) => {
    if (!m.isMesh || m.userData.eyeRig || m.userData.noMeasure || !visibleChain(m) || S.skipClay(m)) return;
    for (const mt of [].concat(m.material)) {
      const src = mt?.userData?.kfbClay?.src || mt; if (!src || src.isShaderMaterial || src.isMeshBasicMaterial || (src.transparent && src.opacity < 0.98)) continue;
      eligible++; if (mt.userData?.kfbClay?.version === CLAY_VERSION) clayed++; else missing.push(m.name);
    }
  });
  G.G5 = { name: 'Clay-Modul aktiv', result: clay && clayed > 0 && clayed === eligible ? 'PASS' : 'FAIL', detail: `${CLAY_VERSION} · Profil ${clay?.profile} · Seed ${clay?.seedLabel} · ${clayed}/${eligible} Materialien` + (missing.length ? ' · ohne Clay: ' + missing.slice(0, 5).join(', ') : '') };
  const fail = Object.values(G).some((g) => g.result === 'FAIL');
  return { status: fail ? 'FAIL' : 'PASS', gates: G };
}

/**
 * createProofStage({ THREE, GLTFLoader, canvas? }) -> stage
 *   await stage.load({ glbUrl, card, type, id, seed, units, fbUrl }) -> { status, gates, info }
 *   stage.render(view, eyes) -> { canvas, view, eyes }   (the renderer canvas holds the 1600 x 1200 frame)
 *   stage.dataURL() · stage.info()
 */
export function createProofStage({ THREE, GLTFLoader, canvas = null }) {
  MODULES.three = 'r' + THREE.REVISION;
  const renderer = new THREE.WebGLRenderer({ canvas: canvas || undefined, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1); renderer.setSize(W, H, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  applyTone(renderer, 'aces', 1);
  const loader = new GLTFLoader();
  let S = null;

  async function loadGLB(url) {
    const errors = []; const ce = console.error;
    console.error = (...a) => { errors.push(a.map(String).join(' ').slice(0, 200)); ce.apply(console, a); };
    try { const g = await loader.loadAsync(url); return { scene: g.scene, errors }; } finally { console.error = ce; }
  }

  async function load({ glbUrl, card = null, type = 'character', id = null, seed = null, units = 'kaykit', fbUrl = null, exportOriginal = null } = {}) {
    if (S) dispose();
    id = id || card?.id || (String(glbUrl).split('/').pop() || 'asset').replace(/\.glb.*$/i, '');
    seedRandom('kfb-proof|' + id);
    const { scene: root, errors: loadErrors } = await loadGLB(glbUrl);
    root.name = root.name || id;
    const k = units === 'm' ? 1 : U2M; root.scale.setScalar(k);
    /* card: hide only what the card lists as removed node names (default: original eyes only) */
    const hidden = [];
    for (const n of card?.originals?.remove || []) root.traverse((o) => { if (o.name === n) { o.visible = false; hidden.push(n); } });
    const faceParts = applyCardFaceParts(THREE, root, card, exportOriginal);
    root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } });
    root.updateMatrixWorld(true);
    /* clay */
    const profile = type === 'character' ? resolveProfile(card?.material?.clayProfile || 'character').id : 'midground';
    const seedVal = seed ?? card?.material?.claySeed ?? card?.id ?? id;
    const skipClay = (m) => SKIP_DEFAULT.test(pathOf(m, root)) || !!m.userData.noClay || !visibleChain(m);
    const clayH = applyClay(root, THREE, { profile, seed: seedVal, scaleRef: type === 'character' ? 'object' : FB_HEIGHT, skip: skipClay });
    const clay = { ...clayH.info(), seedLabel: String(seedVal), handle: clayH };
    /* eyes: every figure, always; props only if the file has anchors */
    let eyes = null;
    const seatProbe = findEyeSeat(root, card);
    if (type === 'character' || seatProbe.seat) eyes = mountEyes(THREE, root, { card, applyClay, clayRef: clayH.scaleRef, seed: String(seedVal) });
    if (eyes?.status === 'OK') eyes.setState('rest');
    /* turntable around the subject's footprint centre (the floor contact stays as authored) */
    const bounds = bodyBounds(THREE, root);
    const c = bounds.getCenter(new THREE.Vector3()), size = bounds.getSize(new THREE.Vector3());
    const turntable = new THREE.Group(); turntable.name = 'proof_turntable'; turntable.position.set(c.x, 0, c.z);
    root.position.x -= c.x; root.position.z -= c.z; turntable.add(root); turntable.updateMatrixWorld(true);
    const B = bodyBounds(THREE, root);                                    // same box, now centred on the turntable axis
    const rxz = 0.5 * Math.hypot(size.x, size.z), Hs = Math.max(size.y, 0.05);
    /* scene: cove, light, contact AO */
    const scene = new THREE.Scene(); scene.background = new THREE.Color(BG);
    const s = Math.max(1, Math.max(Hs, rxz * 1.2) / 1.9), zWall = -Math.max(2.3 * s, rxz + 1.2 * s);
    const cove = makeCove(THREE, s, zWall);
    const coveClay = applyClay(cove, THREE, { profile: 'background', seed: 'proof_cove', scaleRef: FB_HEIGHT, relief: false });   // neutral: clay colour/matte/mottle, no dents
    scene.add(cove, turntable);
    const mods = [{ object3d: turntable, status: () => ({ status: 'OK', shown: true }) }];
    const fs = Math.max(0.6, Hs / 1.8);
    const fit = { center: { x: 0, y: Hs * 0.45, z: -0.35 * s }, radius: Math.max(Hs * 1.7, rxz * 2.2, 2.2) };
    const rig = createStageLight({ moods: MOODS_MESA, tod: () => 1, groundColor: () => COVE, fit: () => fit, figures: () => mods, figureLight: { distance: 3.4 * fs, up: 2.2 * fs } });
    scene.add(rig.object3d);
    /* contact AO on the real floor footprint (vertices in the lowest band), not the whole box (T-pose arms, lamp arms) */
    const band = B.min.y + Math.max(0.03, 0.04 * Hs), fp = bodyBounds(THREE, root, () => true, (v) => v.y <= band);
    const fpS = fp.isEmpty() ? new THREE.Vector3(0.3, 0.01, 0.3) : fp.getSize(new THREE.Vector3()), fpC = fp.isEmpty() ? new THREE.Vector3() : fp.getCenter(new THREE.Vector3());
    const aoProxy = new THREE.Group(); aoProxy.name = 'proof_ao_footprint';
    const aoBox = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.12, fpS.x * 1.25), 0.01, Math.max(0.12, fpS.z * 1.35)), new THREE.MeshBasicMaterial({ visible: false }));
    aoBox.userData.noMeasure = true; aoBox.castShadow = aoBox.receiveShadow = false; aoProxy.add(aoBox);
    aoProxy.position.set(fpC.x - turntable.position.x, 0, fpC.z - turntable.position.z); turntable.add(aoProxy); turntable.updateMatrixWorld(true);   // local to the turntable
    const aoMods = [{ object3d: aoProxy, status: () => ({ status: 'OK', shown: true }) }];
    const ao = createContactAO({ targets: () => aoMods, strength: 0.42 }); scene.add(ao.object3d); ao.update(0, {});   // measured once, unrotated
    /* FrizzleBob silhouette (scale_ref): the FB body, flat, 1.81 m */
    let sil = null;
    if (fbUrl) {
      try {
        const { scene: fb } = await loadGLB(fbUrl);
        fb.traverse((o) => { if (/^FB_Eye_[LR]$/.test(o.name)) o.visible = false; });
        fb.updateMatrixWorld(true); const fbB = new THREE.Box3().setFromObject(fb, true); fb.scale.setScalar(FB_HEIGHT / (fbB.max.y - fbB.min.y)); fb.updateMatrixWorld(true);
        const fb2 = new THREE.Box3().setFromObject(fb, true), mat = new THREE.MeshBasicMaterial({ color: SILHOUETTE, name: 'fb-silhouette' });
        fb.traverse((o) => { if (o.isMesh) { o.material = mat; o.castShadow = false; o.receiveShadow = false; o.frustumCulled = false; o.userData.noMeasure = true; } });
        fb.position.set(-(rxz + 0.35 + (fb2.max.x - fb2.min.x) / 2) - (fb2.min.x + fb2.max.x) / 2, -fb2.min.y, -(fb2.min.z + fb2.max.z) / 2);
        fb.name = 'fb_silhouette'; fb.visible = false; scene.add(fb); fb.updateMatrixWorld(true);
        sil = { root: fb, box: new THREE.Box3().setFromObject(fb, true) };
      } catch (e) { loadErrors.push('FB-Silhouette: ' + e.message); }
    }
    S = { root, turntable, aoProxy, scene, rig, ao, cove, coveClay, sil, eyes, clay, type, id, card, bounds: B, Hs, rxz, s, loadErrors, skipClay, hidden, faceParts, units, k, eyePixels: null };
    S.head = type === 'character' ? headBounds(THREE, root, eyes) : null;
    if (eyes?.status === 'OK') S.eyePixels = measureEyePixels();
    const gates = runGates(THREE, S);
    S.gates = gates;
    return { status: gates.status, gates: gates.gates, info: info() };
  }

  function camFor(view) {
    const cam = new THREE.PerspectiveCamera(FOV, W / H, 0.02, 400), t = Math.tan((FOV * Math.PI) / 360), asp = W / H;
    const B = S.bounds, c = B.getCenter(new THREE.Vector3()); let tgt = c.clone(), d;
    if (view === 'near_face') {
      const hb = S.head || new THREE.Box3(new THREE.Vector3(B.min.x, B.max.y - (B.max.y - B.min.y) * 0.35, B.min.z), B.max.clone());
      const hs = hb.getSize(new THREE.Vector3()); tgt = hb.getCenter(new THREE.Vector3());
      d = Math.max(hs.y / FILL.face, hs.x / (FILL.face * asp) * 0.75) / (2 * t) + hs.z * 0.25;
    } else if (view === 'far') d = (S.Hs / FILL.far) / (2 * t);
    else if (view === 'scale_ref' && S.sil) {
      const u = B.clone().union(S.sil.box), us = u.getSize(new THREE.Vector3()); tgt = u.getCenter(new THREE.Vector3());
      d = Math.max(us.y / FILL.scale, us.x / (FILL.scale * asp)) / (2 * t) + us.z / 2;
    } else d = Math.max(S.Hs / FILL.full, (2 * S.rxz) / (FILL.full * asp)) / (2 * t) + 0.3 * S.rxz;
    const el = (EL[view] * Math.PI) / 180;
    cam.position.set(tgt.x, tgt.y + d * Math.sin(el), tgt.z + d * Math.cos(el)); cam.lookAt(tgt); cam.updateMatrixWorld(true);
    return cam;
  }
  function frame(view, eyesState) {
    S.turntable.rotation.y = (-AZ[view] * Math.PI) / 180; S.aoProxy.rotation.y = S.turntable.rotation.y; S.turntable.updateMatrixWorld(true);   // AO reads object3d.rotation.y
    if (S.sil) S.sil.root.visible = view === 'scale_ref';
    if (S.eyes?.status === 'OK') S.eyes.setState(eyesState || 'rest');
    const cam = camFor(view);
    S.rig.update(0, { camera: cam }); S.ao.update(0, { camera: cam });
    return cam;
  }
  function render(view = 'front', eyesState = 'rest') {
    if (!S) throw new Error('proof stage: nothing loaded');
    if (!VIEWS.includes(view)) throw new Error('unknown view ' + view);
    const cam = frame(view, eyesState); renderer.render(S.scene, cam);
    return { canvas: renderer.domElement, view, eyes: S.eyes?.status === 'OK' ? eyesState : null };
  }
  /* eye pixels at near_face (rest): eye meshes coloured per eye, everything else black, with depth (occlusion counts) */
  function measureEyePixels() {
    const cam = frame('near_face', 'rest'), keep = new Map(), black = new THREE.MeshBasicMaterial({ color: 0x000000 }), cols = [0xff0000, 0x00ff00, 0x0000ff];
    const eyeMats = S.eyes.eyes().map((_, i) => new THREE.MeshBasicMaterial({ color: cols[i % 3] }));
    const hiddenMat = new THREE.MeshBasicMaterial({ visible: false });
    S.scene.traverse((o) => { if (o.isMesh || o.isSprite) { const m0 = [].concat(o.material)[0]; keep.set(o, o.material); o.material = (o.userData.noMeasure || m0?.visible === false || (m0?.transparent && m0.opacity < 0.02)) ? hiddenMat : black; } });   // helper boxes stay invisible
    S.eyes.eyes().forEach((e, i) => e.traverse((m) => { if (m.isMesh) m.material = eyeMats[i]; }));
    const bg = S.scene.background, tm = renderer.toneMapping; S.scene.background = new THREE.Color(0); renderer.toneMapping = THREE.NoToneMapping;
    renderer.render(S.scene, cam);
    const gl = renderer.getContext(), px = new Uint8Array(W * H * 4); gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, px);
    renderer.toneMapping = tm; S.scene.background = bg; keep.forEach((m, o) => { o.material = m; }); black.dispose(); hiddenMat.dispose(); eyeMats.forEach((m) => m.dispose());
    const per = S.eyes.eyes().map(() => 0);
    for (let i = 0; i < px.length; i += 4) { const r = px[i], g = px[i + 1], b = px[i + 2]; if (r > 200 && g < 50 && b < 50) per[0]++; else if (g > 200 && r < 50 && b < 50 && per.length > 1) per[1]++; else if (b > 200 && r < 50 && g < 50 && per.length > 2) per[2]++; }
    return { total: per.reduce((a, b) => a + b, 0), perEye: per };
  }
  function info() {
    if (!S) return null;
    const r = S.eyes?.status === 'OK' ? S.eyes.report() : null;
    return {
      schema: SCHEMA, version: VERSION, modules: { ...MODULES }, id: S.id, type: S.type, units: S.units, unitScale: S.k,
      size_m: S.bounds.getSize(new THREE.Vector3()).toArray().map((v) => +v.toFixed(3)), height_m: +S.Hs.toFixed(3),
      hiddenOriginals: S.hidden, cardFaceParts: S.faceParts, clay: { version: CLAY_VERSION, profile: S.clay.profile, seed: S.clay.seedLabel, scaleRef: S.clay.scaleRef, meshes: S.clay.meshes, cove: 'background, relief off (neutral)' },
      light: { module: 'kfb-stage-light.v1', moods: 'MOODS_MESA', tod: 1, tone: 'ACES Filmic', exposure: 1, shadow: 'PCFSoft, fitShadow', figureLight: true, rim: false, mood: S.rig.info().mood },
      eyes: r || { status: S.eyes?.status || 'none', reason: S.eyes?.reason || null }, eyePixels: S.eyePixels,
      head_m: S.head ? S.head.getSize(new THREE.Vector3()).toArray().map((v) => +v.toFixed(3)) : null,
      frame: { w: W, h: H, fov: FOV, pixelRatio: 1, fill: FILL, az: AZ, el: EL }, loadErrors: S.loadErrors,
      gpu: (() => { const gl = renderer.getContext(), d = gl.getExtension('WEBGL_debug_renderer_info'); return d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); })(),
    };
  }
  function dispose() {
    if (!S) return;
    S.scene.traverse((o) => { if (o.isMesh) { o.geometry?.dispose?.(); [].concat(o.material).forEach((m) => m?.dispose?.()); } });
    S.rig.dispose(); S.ao.dispose(); S = null;
  }
  return { renderer, load, render, info, dispose, debug: () => S, gates: () => S?.gates || null, get loaded() { return !!S; }, dataURL: () => renderer.domElement.toDataURL('image/png') };
}

/* ---------- contact sheet: fixed layout, captions outside the image area ---------- */
export const SHEET_SLOTS = Object.freeze([
  ['front', 'rest'], ['threeq', 'rest'], ['side', 'rest'], ['back', 'rest'],
  ['near_face', 'rest'], ['near_face', 'half'], ['near_face', 'closed'], ['far', 'rest'],
  ['scale_ref', 'rest'], ['front', 'closed'], ['threeq', 'closed'], ['side', 'closed'],
]);
const VIEW_LABEL = { front: 'vorn 0°', threeq: '¾ 35°', side: 'Seite 90°', back: 'hinten 180°', near_face: 'Gesicht nah', far: 'Totale', scale_ref: 'Größe vs. FrizzleBob 1,81 m' };
const EYE_LABEL = { rest: 'Augen Ruhe', half: 'Augen halb', closed: 'Augen zu' };
/**
 * contactSheet({ images: { 'view|eyes': HTMLImageElement|Canvas }, head: { title, sub, gates, foot }, hasEyes }) -> canvas (2000 x 1370)
 */
export function contactSheet({ images, head, hasEyes = true, type = 'character' }) {
  const cols = 4, tw = 464, th = 348, gap = 16, cap = 30, top = 104, foot = 46, Wd = cols * tw + (cols + 1) * gap, rows = 3;
  const Hd = top + rows * (th + cap + gap) + foot;
  const c = document.createElement('canvas'); c.width = Wd; c.height = Hd; const g = c.getContext('2d');
  g.fillStyle = '#f4efe6'; g.fillRect(0, 0, Wd, Hd);
  g.fillStyle = '#2a2622'; g.font = '600 30px system-ui, -apple-system, Helvetica, Arial, sans-serif'; g.fillText(head.title, gap, 40);
  g.font = '17px system-ui, -apple-system, Helvetica, Arial, sans-serif'; g.fillStyle = '#5d564d'; g.fillText(head.sub, gap, 66);
  let x = gap; g.font = '600 15px system-ui, -apple-system, Helvetica, Arial, sans-serif';
  for (const [k, v] of Object.entries(head.gates || {})) {
    const col = v.result === 'PASS' ? '#2f7d4a' : v.result === 'FAIL' ? '#b0182f' : v.result === 'WARN' ? '#b7791f' : '#7a746b', txt = `${k} ${v.result}`;
    const w = g.measureText(txt).width + 18; g.fillStyle = col; g.fillRect(x, 78, w, 22); g.fillStyle = '#fff'; g.fillText(txt, x + 9, 94); x += w + 8;
  }
  if (head.status) { const txt = head.status === 'PASS' ? 'ABNAHMEFÄHIG' : 'NICHT ABNAHMEFÄHIG'; g.font = '700 17px system-ui, -apple-system, Helvetica, Arial, sans-serif'; const w = g.measureText(txt).width + 22; g.fillStyle = head.status === 'PASS' ? '#2f7d4a' : '#b0182f'; g.fillRect(Wd - gap - w, 74, w, 28); g.fillStyle = '#fff'; g.fillText(txt, Wd - gap - w + 11, 94); }
  SHEET_SLOTS.forEach(([view, eyes], i) => {
    const cx = gap + (i % cols) * (tw + gap), cy = top + Math.floor(i / cols) * (th + cap + gap);
    const key = hasEyes ? view + '|' + eyes : view + '|-', img = images[key] || (!hasEyes && eyes !== 'rest' ? null : null);
    const show = hasEyes || eyes === 'rest';
    g.fillStyle = '#ddd6ca'; g.fillRect(cx, cy, tw, th);
    if (img && show) g.drawImage(img, cx, cy, tw, th);
    else { g.fillStyle = '#9a9288'; g.font = '15px system-ui, -apple-system, Helvetica, Arial, sans-serif'; g.fillText(show ? 'nicht angefordert' : '–', cx + tw / 2 - 50, cy + th / 2); }
    g.fillStyle = '#2a2622'; g.fillRect(cx, cy + th, tw, cap);
    g.fillStyle = '#fff'; g.font = '15px system-ui, -apple-system, Helvetica, Arial, sans-serif';
    const vl = view === 'near_face' && type !== 'character' ? 'Detail nah (oberes Drittel)' : VIEW_LABEL[view];
    g.fillText(show ? `${vl}${hasEyes ? ' · ' + EYE_LABEL[eyes] : ''}` : '', cx + 10, cy + th + 20);
  });
  g.fillStyle = '#6d665d'; g.font = '13px ui-monospace, Menlo, monospace'; g.fillText(head.foot || '', gap, Hd - 18);
  return c;
}
