/* KFB Proof Stage v1.2 · kfb.proof-stage/1 · the ONE acceptance stage (Abnahme-Bühne) for every workstation (WS0 PROOF_STAGE_R1, 18.10.2026)
 *
 * v1.2 = v1.1 + rig scale reference for --type stage and prop (Georg 18.10.: "a Medium-rig figure should plausibly walk through doors and
 *   entrances; a Large-rig figure would have to bend slightly"): 'scale_ref' shows two real figures in clay instead of the flat FrizzleBob
 *   silhouette: Medium = FrizzleBob (Rig_Medium), Large = a KayKit Rig_Large character (sources.json scale_ref), both at their bind-pose
 *   height x 0.616 m/u, posed with their rig's own idle clip (the bind pose is a T-pose), clay profile 'character', same light rig, eyes off.
 *   With root extras kfb.entrances[] (en[0], proof:false included; that flag only concerns detail_low) they stand side by side in front of the
 *   entrance (Medium left, Large right), facing out, the entrance turned to the camera; without an entrance they stand left of the object.
 *   They never count towards bounds or gates (userData.noMeasure). Character proofs keep the v1.1 silhouette.
 * v1.2 also: light vendor/kfb-stage-light.v1.1.js (shadow seam fix: front faces cast, shadow box fitted tightly to the object and its cast
 *   shadow instead of the cove, mapSize 4096, normalBias 1.5 texels as in v1); contact AO per item (lineups) instead of one
 *   box for the whole footprint; gate G6 'Schattensaum' (measured on the front/threeq/side/back renders against a no-bias reference, 0 px);
 *   float pose (V-437): found items (KFB_Pickup node / extras.kfb.kind 'pickup', or opts.pose 'float') float with their centre at the Medium
 *   rig's hip height (hips bone of the scale figure, bind pose), G3 then checks that height instead of floor contact.
 *
 * v1.1 = v1 + a dedicated layout for --type stage and prop (WS0/Georg 18.10.: no empty grey cells, uniform presentation):
 *   new views 'top' (from above, 85°, footprint fills 80 %) and 'detail_low' (lower third, 60 % of the frame height, centred on the
 *   entrance from root extras kfb.entrances[0] and turned so the entrance faces the camera; without entrances: framed on what stands in
 *   the lower third, e.g. legs, stairs, plinth).
 *   'near_face' on props/stages = detail of the upper third (as in v1). Contact sheet for stage/prop: 3 x 3, no empty cells
 *   (PROP_SLOTS). Character views, gates, light, clay, eyes and the character sheet are unchanged from v1 (kfb-proof-stage.v1.js stays).
 *
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
import { createStageLight, createContactAO, applyTone, MOODS_MESA, SCHEMA as LIGHT_SCHEMA, VERSION as LIGHT_VERSION, castFrontFaces, fitAround, measureShadowSeam, sunDirection } from './vendor/kfb-stage-light.v1.1.js';
import { applyClay, resolveProfile, SKIP_DEFAULT, VERSION as CLAY_VERSION } from './vendor/kfb-clay.v1.1.js';
import { mountEyes, findEyeSeat, LID_STATES, EYES_VERSION } from './kfb-proof-eyes.v1.js';

export const SCHEMA = 'kfb.proof-stage/1';
export const VERSION = 'kfb-proof-stage.v1.2';
export const W = 1600, H = 1200, FOV = 30;
export const U2M = 0.616;                     // m per KayKit unit (V-345)
export const FB_HEIGHT = 1.81;                // m, FrizzleBob (figure card, V-345)
export const COVE = '#f2e8d8', BG = '#f3ece0', SILHOUETTE = '#6f655b';
export const VIEWS = Object.freeze(['front', 'threeq', 'side', 'back', 'near_face', 'far', 'scale_ref', 'top', 'detail_low']);
export const DEFAULT_VIEWS = Object.freeze({ character: ['front', 'threeq', 'side', 'back', 'near_face', 'far', 'scale_ref'], prop: ['front', 'threeq', 'side', 'back', 'top', 'near_face', 'detail_low', 'far', 'scale_ref'], stage: ['front', 'threeq', 'side', 'back', 'top', 'near_face', 'detail_low', 'far', 'scale_ref'] });
export const EYE_STATES = Object.freeze(Object.keys(LID_STATES));
const AZ = { front: 0, threeq: 35, side: 90, back: 180, near_face: 0, far: 20, scale_ref: 0, top: 0, detail_low: 0 };
const EL = { front: 5, threeq: 6, side: 5, back: 5, near_face: 3, far: 8, scale_ref: 4, top: 85, detail_low: 6 };
const FILL = { full: 0.8, face: 0.6, far: 0.4, scale: 0.7 };
export const MODULES = ({ stage: VERSION, clay: CLAY_VERSION, light: LIGHT_SCHEMA + ' (' + LIGHT_VERSION + ')', eyes: EYES_VERSION, eyeRig: 'pet-eye-rig.v6', lid: 'clay-skin-attach.v1 + clay-eyelid.v3 (E2)', three: null });  // three is filled in by createProofStage

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
  // G3 floor contact (v1.2 float pose: hover height instead, V-437)
  const minY = S.bounds.min.y;
  if (S.float?.on) {
    const F = S.float, bad = F.items.filter((it) => Math.abs(it.centre_m - it.target_m) > 0.01 || it.minY_m <= 0.005), cl = F.items.filter((it) => it.clamped);
    G.G3 = { name: 'Schwebehöhe Fundstück (V-437) ±1 cm', result: bad.length || !F.items.length ? 'FAIL' : 'PASS', minY_m: +minY.toFixed(4),
      detail: `Mitte auf Hüfthöhe Medium-Rig ${F.hip_m.toFixed(3).replace('.', ',')} m · ${F.items.length} Teil(e)${cl.length ? ` · ${cl.length} höher, damit sie den Boden nicht berühren (halbe Höhe + 2 cm): ${cl.map((it) => it.name.replace(/^KFB_Loot_/, '')).join(', ')}` : ''} · tiefster Punkt y = ${(minY * 100).toFixed(1)} cm${bad.length ? ' · ABWEICHUNG: ' + bad.map((it) => it.name).join(', ') : ''}` };
  } else
  G.G3 = { name: 'Bodenkontakt ±1 cm', result: Math.abs(minY) <= 0.01 ? 'PASS' : 'FAIL', detail: `tiefster Punkt y = ${(minY * 100).toFixed(2)} cm (${minY > 0.01 ? 'schwebt' : minY < -0.01 ? 'versinkt' : 'steht'})`, minY_m: +minY.toFixed(4) };
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
    try { const g = await loader.loadAsync(url); return { scene: g.scene, animations: g.animations || [], errors }; } finally { console.error = ce; }
  }

  /* v1.2: one scale figure. Height = bind-pose bounding box (skin applied) x U2M, the same factor as every KFB asset (FB 2.94 u = 1.81 m).
     The KayKit bind pose is a T-pose, so the figure is shown in its own rig's idle clip (spec.anim + spec.clip, time spec.time) and only the
     height is taken from the bind pose. Clay 'character' (scaleRef 'object'), eyes off (FB_Eye_L/R hidden as in the v1.1 silhouette). */
  async function loadFigure(spec, rig, warnings) {
    const { scene: fig } = await loadGLB(spec.glbUrl);
    fig.name = 'proof_scale_' + rig;
    fig.traverse((o) => { if (/^FB_Eye_[LR]$/.test(o.name)) o.visible = false; });
    fig.scale.setScalar(U2M); fig.updateMatrixWorld(true);
    const bind = new THREE.Box3().setFromObject(fig, true), V = new THREE.Vector3();
    let hips = null; fig.traverse((o) => { if (!hips && o.isBone && /^hips$/i.test(o.name)) hips = o; });
    const hipBind = hips ? hips.getWorldPosition(V).y - bind.min.y : null;
    let pose = 'bind (T-Pose)';
    if (spec.animUrl) {
      try {
        const { animations } = await loadGLB(spec.animUrl), clip = THREE.AnimationClip.findByName(animations, spec.clip || 'Idle_A');
        if (clip) { const mixer = new THREE.AnimationMixer(fig); mixer.clipAction(clip).play(); mixer.setTime(spec.time || 0); fig.updateMatrixWorld(true); pose = `${clip.name} t=${spec.time || 0}`; }
        else warnings.push(`${rig}: Clip ${spec.clip} fehlt in ${spec.animUrl}`);
      } catch (e) { warnings.push(`${rig}: Pose-Clip nicht geladen (${e.message})`); }
    }
    const posed = new THREE.Box3().setFromObject(fig, true), pc = posed.getCenter(new THREE.Vector3()), size = posed.getSize(new THREE.Vector3());
    /* feet footprint: vertices in the lowest 4 cm (for the ground check under the feet; the full box is the collision proxy) */
    const feet = new THREE.Box3(), band = posed.min.y + 0.04;
    fig.traverse((m) => { if (!m.isMesh || !visibleChain(m)) return; const P = m.geometry.attributes.position; for (let i = 0; i < P.count; i++) { m.getVertexPosition(i, V); m.localToWorld(V); if (V.y <= band) feet.expandByPoint(V); } });
    const holder = new THREE.Group(); holder.name = 'proof_scale_' + rig + '_holder'; holder.add(fig);
    fig.position.set(-pc.x, -posed.min.y, -pc.z);                                           // holder origin = box centre on the floor, feet at y 0
    fig.traverse((o) => { o.userData.noMeasure = true; if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } });
    const clay = applyClay(fig, THREE, { profile: 'character', seed: 'proof_scale_' + rig, scaleRef: 'object' }); castFrontFaces(fig);
    const fb = feet.isEmpty() ? null : { minX: feet.min.x - pc.x, maxX: feet.max.x - pc.x, minZ: feet.min.z - pc.z, maxZ: feet.max.z - pc.z };
    return { rig, holder, fig, label: spec.label || rig, glb: spec.glbName || spec.glbUrl, pose, size, feet: fb, clay: clay.info(),
      height_m: bind.max.y - bind.min.y, height_u: (bind.max.y - bind.min.y) / U2M, hip_m: hipBind, posedHeight_m: size.y };
  }

  async function load({ glbUrl, card = null, type = 'character', id = null, seed = null, units = 'kaykit', fbUrl = null, exportOriginal = null, scaleFigures = null, pose = 'auto' } = {}) {
    if (S) dispose();
    id = id || card?.id || (String(glbUrl).split('/').pop() || 'asset').replace(/\.glb.*$/i, '');
    /* v1.2: scale figures for stage/prop are loaded first; the seeded random starts afterwards, so everything after it matches v1.1 */
    const figWarn = [], figs = [];
    if (type !== 'character' && scaleFigures) for (const rig of ['medium', 'large']) {
      if (!scaleFigures[rig]?.glbUrl) { figWarn.push(rig + ': keine GLB in sources.json scale_ref'); continue; }
      try { figs.push(await loadFigure(scaleFigures[rig], rig, figWarn)); } catch (e) { figWarn.push(`${rig}: ${e.message}`); }
    }
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
    castFrontFaces(root);                                                 // v1.2 / light v1.1: front faces cast (no lit seam at the contact line)
    /* v1.2 float (V-437): found items float with their centre at the Medium rig's hip height (derived from the scale figure's hips bone) */
    const pickupItems = [];
    root.traverse((o) => { if (/^KFB_Pickup/.test(o.name) || o.userData?.kfb?.kind === 'pickup') { const it = o.parent || o; if (!pickupItems.includes(it)) pickupItems.push(it); } });
    const floatOn = pose === 'float' || (pose === 'auto' && type !== 'character' && pickupItems.length > 0);
    const flt = { on: floatOn, mode: floatOn ? 'float' : 'ground', requested: pose, pickups: pickupItems.length, hip_m: null, hipSource: null, items: [] };
    if (floatOn) {
      const Mf = figs.find((f) => f.rig === 'medium');
      flt.hip_m = Mf?.hip_m ?? 0.25; flt.hipSource = Mf?.hip_m != null ? `${Mf.label}: Knochen hips, Bindepose, × ${U2M} m/u` : 'Ersatzwert 0,25 m (Medium-Figur nicht geladen)';
      const items = pickupItems.length ? pickupItems : [root];
      for (const it of items) {
        root.updateMatrixWorld(true); const bb = bodyBounds(THREE, root, (m) => isUnder(m, it)); if (bb.isEmpty()) continue;
        const cy = (bb.min.y + bb.max.y) / 2, hh = (bb.max.y - bb.min.y) / 2, target = Math.max(flt.hip_m, hh + 0.02), sy = (it.parent || it).getWorldScale(new THREE.Vector3()).y || 1;
        it.position.y += (target - cy) / (it === root ? 1 : sy); it.updateMatrixWorld(true);
        flt.items.push({ name: it.name || '?', target_m: +target.toFixed(4), clamped: target > flt.hip_m + 1e-6, half_m: +hh.toFixed(3) });
      }
      root.updateMatrixWorld(true);
      for (const r of flt.items) { const it = items.find((x) => (x.name || '?') === r.name); const bb = bodyBounds(THREE, root, (m) => isUnder(m, it)); r.centre_m = +((bb.min.y + bb.max.y) / 2).toFixed(4); r.minY_m = +bb.min.y.toFixed(4); }
    }
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
    /* v1.2: shadow box fitted tightly around the subject (rotation-invariant cylinder around the turntable axis) and its cast shadow, not the cove */
    const sunDir = sunDirection(MOODS_MESA.day.elev, MOODS_MESA.day.az), tp = turntable.position;
    const cyl = new THREE.Box3(new THREE.Vector3(tp.x - rxz, B.min.y, tp.z - rxz), new THREE.Vector3(tp.x + rxz, B.max.y, tp.z + rxz));
    const fit = fitAround([cyl], sunDir);
    /* items = top-level children with meshes (one for a building or figure, one per item in a lineup): per-item contact AO, smallest caster */
    const items = root.children.filter((ch) => { let has = false; ch.traverse((m) => { if (m.isMesh && visibleChain(m) && !m.userData.eyeRig) has = true; }); return has; });
    const itemBoxes = (items.length ? items : [root]).map((it) => ({ it, b: bodyBounds(THREE, root, (m) => isUnder(m, it)) })).filter((x) => !x.b.isEmpty());
    const minCaster = Math.max(0.02, Math.min(...itemBoxes.map((x) => x.b.max.y - x.b.min.y), Hs));
    const rig = createStageLight({ moods: MOODS_MESA, tod: () => 1, groundColor: () => COVE, fit: () => (S && S.fitNow) || fit, figures: () => mods, figureLight: { distance: 3.4 * fs, up: 2.2 * fs }, mapSize: 4096, minCaster: () => minCaster });
    scene.add(rig.object3d);
    /* contact AO on the real floor footprint (vertices in the lowest band), not the whole box (T-pose arms, lamp arms); v1.2: one per item
       that touches the floor (lineups get one per item, floating items none) */
    const aoProxies = [];
    for (const { it, b } of itemBoxes) {
      if (b.min.y > 0.02) continue;                                       // floating: no contact AO
      const ih = b.max.y - b.min.y, band = b.min.y + Math.max(0.03, 0.04 * ih), fp = bodyBounds(THREE, root, (m) => isUnder(m, it), (v) => v.y <= band);
      const fpS = fp.isEmpty() ? new THREE.Vector3(0.3, 0.01, 0.3) : fp.getSize(new THREE.Vector3()), fpC = fp.isEmpty() ? b.getCenter(new THREE.Vector3()) : fp.getCenter(new THREE.Vector3());
      const aoProxy = new THREE.Group(); aoProxy.name = 'proof_ao_footprint';
      const aoBox = new THREE.Mesh(new THREE.BoxGeometry(Math.max(Math.min(0.12, ih), fpS.x * 1.25), 0.01, Math.max(Math.min(0.12, ih), fpS.z * 1.35)), new THREE.MeshBasicMaterial({ visible: false }));
      aoBox.userData.noMeasure = true; aoBox.castShadow = aoBox.receiveShadow = false; aoProxy.add(aoBox);
      aoProxy.position.set(fpC.x - turntable.position.x, 0, fpC.z - turntable.position.z); turntable.add(aoProxy); aoProxies.push(aoProxy);   // local to the turntable
    }
    turntable.updateMatrixWorld(true);
    const aoMods = aoProxies.map((p) => ({ object3d: p, status: () => ({ status: 'OK', shown: true }) }));
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
    /* v1.1: entrance for 'detail_low' (WSB root extras kfb.entrances[]: pos_u in the root node's frame, forward_xz) */
    let entrance = null, scaleEntrance = null;
    root.traverse((o) => { const en = o.userData?.kfb?.entrances; if (!entrance && Array.isArray(en) && en.length && Array.isArray(en[0].pos_u) && en[0].proof !== false) entrance = { node: o, id: en[0].id || 'main', pos: new THREE.Vector3(...en[0].pos_u), fwd: en[0].forward_xz || [0, 1], width_m: en[0].width_m ?? null }; });
    /* v1.2: the scale figures use en[0] even with proof:false (that opt-out only concerns detail_low) */
    root.traverse((o) => { const en = o.userData?.kfb?.entrances; if (!scaleEntrance && Array.isArray(en) && en.length && Array.isArray(en[0].pos_u)) scaleEntrance = { node: o, id: en[0].id || 'main', pos: new THREE.Vector3(...en[0].pos_u), fwd: en[0].forward_xz || [0, 1], width_m: en[0].width_m ?? null, door: en[0].door || null, proof: en[0].proof !== false }; });
    let scaleFig = null;
    if (figs.length) {
      const g = new THREE.Group(); g.name = 'proof_scale_figures'; g.visible = false; g.userData.noMeasure = true;
      for (const f of figs) g.add(f.holder);
      scene.add(g);
      const figAoProxies = figs.map((f) => { const p = new THREE.Group(); p.name = 'proof_ao_' + f.rig; const fp = f.feet || { minX: -0.2, maxX: 0.2, minZ: -0.2, maxZ: 0.2 };
        const bx = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.12, (fp.maxX - fp.minX) * 1.25), 0.01, Math.max(0.12, (fp.maxZ - fp.minZ) * 1.35)), new THREE.MeshBasicMaterial({ visible: false }));
        bx.userData.noMeasure = true; p.add(bx); p.userData.noMeasure = true; p.userData.feetC = new THREE.Vector3((fp.minX + fp.maxX) / 2, 0, (fp.minZ + fp.maxZ) / 2); p.userData.rig = f.rig; scene.add(p); return { object3d: p, status: () => ({ status: 'OK', shown: !!S && S.view === 'scale_ref' }) }; });
      const figAo = createContactAO({ targets: () => figAoProxies, strength: 0.42 }); scene.add(figAo.object3d);
      scaleFig = { group: g, figs, ao: figAo, aoMods: figAoProxies, warnings: figWarn, placement: null };
    }
    S = { root, turntable, aoProxies, scene, float: flt, minCaster, cyl, sunDir, rig, ao, cove, coveClay, sil: type === 'character' || !figs.length ? sil : null, silRoot: sil, eyes, clay, type, id, card, bounds: B, Hs, rxz, s, loadErrors, skipClay, hidden, faceParts, units, k, eyePixels: null, entrance, scaleEntrance, scaleFig, figWarn, view: null, fitBase: fit, fitNow: fit };
    S.head = type === 'character' ? headBounds(THREE, root, eyes) : null;
    if (eyes?.status === 'OK') S.eyePixels = measureEyePixels();
    const gates = runGates(THREE, S);
    /* v1.2 G6 Schattensaum: measured on the four turntable views against a no-bias reference (measureShadowSeam, light v1.1) */
    S.seam = ['front', 'threeq', 'side', 'back'].map((v) => ({ view: v, ...measureShadowSeam({ gl: renderer, scene: S.scene, camera: frame(v, 'rest'), sun: S.rig.lights.sun, isFloor: (o) => o.name === 'proof_cove' }) }));
    const seamTot = S.seam.reduce((a, r) => a + r.seamPx, 0), sh = S.rig.info().shadow;
    gates.gates.G6 = { name: 'Schattensaum (kein heller Saum zwischen Teil und Schatten)', result: seamTot === 0 ? 'PASS' : 'FAIL',
      detail: `Saum ${S.seam.map((r) => `${r.view} ${r.seamPx} px`).join(' · ')}${S.seam.some((r) => r.isolatedPx) ? ` (Einzelpixel unter ${S.seam[0].minCluster} px: ${S.seam.map((r) => r.isolatedPx).join('/')})` : ''} · Schwelle ${S.seam[0].thresh} Luma, Umriss-Toleranz ${S.seam[0].erode} px · Texel ${(sh.texel * 1000).toFixed(2)} mm · normalBias ${(sh.normalBias * 1000).toFixed(2)} mm (1,5 Texel) · ${sh.mapSize}² · Vorderseiten werfen`, seamPx: seamTot, perView: S.seam };
    gates.status = Object.values(gates.gates).some((g) => g.result === 'FAIL') ? 'FAIL' : 'PASS';
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
    } else if (view === 'top') {
      const bs = B.getSize(new THREE.Vector3());
      d = Math.max(bs.z / FILL.full, bs.x / (FILL.full * asp)) / (2 * t) + bs.y / 2;
    } else if (view === 'detail_low') {
      const h3 = S.Hs / 3, wb = new THREE.Box3();                        // lower third of the (turned) bbox
      S.root.updateMatrixWorld(true); wb.copy(bodyBounds(THREE, S.root));
      const lowB = bodyBounds(THREE, S.root, () => true, (v) => v.y <= wb.min.y + h3);   // what actually stands in the lower third
      const lb = lowB.isEmpty() ? wb : lowB, ls = lb.getSize(new THREE.Vector3());
      tgt = new THREE.Vector3((lb.min.x + lb.max.x) / 2, wb.min.y + h3 / 2, (lb.min.z + lb.max.z) / 2);
      d = Math.max(h3 / FILL.face, ls.x / (FILL.full * asp)) / (2 * t) + ls.z / 2;
      if (S.entrance) {                                                    // pos_u is in the frame of the node's parent (KFB u), not under the node's own scale
        const p = (S.entrance.node.parent || S.entrance.node).localToWorld(S.entrance.pos.clone()), big = wb.clone().expandByScalar(0.2 * S.Hs);
        if (big.containsPoint(new THREE.Vector3(p.x, wb.min.y, p.z))) { tgt.x = p.x; tgt.z = p.z; d = (h3 / FILL.face) / (2 * t); } else S.entranceOutside = true;
      }
    } else if (view === 'far') d = (S.Hs / FILL.far) / (2 * t);
    else if (view === 'scale_ref' && S.sil) {
      const u = B.clone().union(S.sil.box), us = u.getSize(new THREE.Vector3()); tgt = u.getCenter(new THREE.Vector3());
      d = Math.max(us.y / FILL.scale, us.x / (FILL.scale * asp)) / (2 * t) + us.z / 2;
    } else if (view === 'scale_ref' && S.scaleFig?.placement) {
      const P = S.scaleFig.placement, fb = P.figBox;
      if (!P.atEntrance) {                                                 // as the v1.1 silhouette: object + figures, 70 %
        const u = S.bounds.clone().union(fb), us = u.getSize(new THREE.Vector3()); tgt = u.getCenter(new THREE.Vector3());
        d = Math.max(us.y / FILL.scale, us.x / (FILL.scale * asp)) / (2 * t) + us.z / 2;
      } else {                                                             // door + figures: Large figure fills 45–55 % of the frame height, whole door in frame
        const u = fb.clone().union(P.doorBox); tgt = u.getCenter(new THREE.Vector3());
        const el = (EL[view] * Math.PI) / 180, L = P.largeBox, q = new THREE.Vector3(), cornersOf = (b) => { const a = []; for (let i = 0; i < 8; i++) a.push(new THREE.Vector3(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z)); return a; };
        const figC = cornersOf(fb), doorC = cornersOf(P.doorBox), inF = (v) => { q.copy(v).project(cam); return Math.abs(q.x) <= 0.94 && Math.abs(q.y) <= 0.94 && q.z < 1; };
        const lTop = new THREE.Vector3((L.min.x + L.max.x) / 2, L.max.y, L.max.z), lBot = new THREE.Vector3((L.min.x + L.max.x) / 2, L.min.y, L.max.z);
        const test = (dd, ty) => { cam.position.set(tgt.x, ty + dd * Math.sin(el), tgt.z + dd * Math.cos(el)); cam.lookAt(tgt.x, ty, tgt.z); cam.updateMatrixWorld(true);
          const fill = (q.copy(lTop).project(cam).y - q.copy(lBot).project(cam).y) / 2;
          return { dd, ty, fill, figs: figC.every(inF), door: doorC.every(inF) }; };
        let dd = (L.max.y - L.min.y) / (0.6 * 2 * t), best = null, last45 = null;
        for (let i = 0; i < 400; i++, dd *= 1.01) { const r = test(dd, tgt.y); if (r.fill >= 0.45) last45 = r; if (r.fill <= 0.55 && r.figs && r.door) { best = r; break; } if (r.fill < 0.45) break; }
        let pick = best;
        if (!pick) {                                                       // door too tall for 45 %: keep the figures whole at 45 % and show as much door as fits above them
          const d45 = (last45 || test(dd, tgt.y)).dd, fcY = (fb.min.y + fb.max.y) / 2;
          for (let ty = tgt.y; ty >= fcY - 1e-6; ty -= 0.02 * (fb.max.y - fb.min.y)) { const r = test(d45, ty); if (r.figs) { pick = r; break; } }
          pick = pick || test(d45, fcY);
        }
        d = pick.dd; tgt.y = pick.ty;
        P.camera = { fill: +pick.fill.toFixed(3), doorFullyVisible: !!best, figuresFullyVisible: !!pick.figs, distance_m: +d.toFixed(2) };
      }
    } else d = Math.max(S.Hs / FILL.full, (2 * S.rxz) / (FILL.full * asp)) / (2 * t) + 0.3 * S.rxz;
    const el = (EL[view] * Math.PI) / 180;
    cam.position.set(tgt.x, tgt.y + d * Math.sin(el), tgt.z + d * Math.cos(el)); cam.lookAt(tgt); cam.updateMatrixWorld(true);
    return cam;
  }
  function frame(view, eyesState) {
    const entYaw = view === 'detail_low' && S.entrance ? Math.atan2(S.entrance.fwd[0], S.entrance.fwd[1])
      : view === 'scale_ref' && S.scaleFig && S.scaleEntrance ? Math.atan2(S.scaleEntrance.fwd[0], S.scaleEntrance.fwd[1]) : 0;   // entrance faces the camera
    S.turntable.rotation.y = (-AZ[view] * Math.PI) / 180 - entYaw; for (const p of S.aoProxies) p.rotation.y = S.turntable.rotation.y; S.turntable.updateMatrixWorld(true);   // AO reads object3d.rotation.y
    if (S.sil) S.sil.root.visible = view === 'scale_ref';
    S.view = view; S.fitNow = S.fitBase;
    if (S.scaleFig) { S.scaleFig.group.visible = view === 'scale_ref'; if (view === 'scale_ref') placeFigures(); }
    if (S.eyes?.status === 'OK') S.eyes.setState(eyesState || 'rest');
    const cam = camFor(view);
    S.rig.update(0, { camera: cam }); S.ao.update(0, { camera: cam }); if (S.scaleFig) S.scaleFig.ao.update(0, { camera: cam });
    return cam;
  }
  /* v1.2: scale figures at the entrance (en[0]) or beside the object. Ground and collision come from the object's own triangles: the figures
     stand on the highest surface under their feet (never higher than the entrance foot + 0.5 m), only where that surface is flat (spread
     <= 2 cm), and their posed bounding boxes must not touch the object; otherwise they move further out along the entrance direction. */
  function placeFigures() {
    const F = S.scaleFig, figs = F.figs, V = new THREE.Vector3(), out = { atEntrance: false, entranceId: null, notes: [], figures: [] };
    const M = figs.find((f) => f.rig === 'medium'), Lg = figs.find((f) => f.rig === 'large'), order = [M, Lg].filter(Boolean), GAP = 0.2, FRONT = 0.25;
    S.root.updateMatrixWorld(true);
    const E = S.scaleEntrance; let p = null, fw = null;
    if (E) {
      const host = E.node.parent || E.node; p = host.localToWorld(E.pos.clone()); fw = new THREE.Vector3(E.fwd[0], 0, E.fwd[1]).transformDirection(host.matrixWorld).setY(0).normalize();
      const big = S.bounds.clone().expandByScalar(0.2 * S.Hs); if (!big.containsPoint(new THREE.Vector3(p.x, S.bounds.min.y, p.z))) { out.notes.push('Eingang außerhalb der Hülle, Figuren daneben'); p = null; }
    }
    if (p) {
      out.atEntrance = true; out.entranceId = E.id;
      const rt = new THREE.Vector3(fw.z, 0, -fw.x), yaw = Math.atan2(fw.x, fw.z);
      /* object triangles near the entrance corridor (world space, turned) */
      const cor = new THREE.Box3(); for (const a of [-12, 9]) for (const b of [-4, 4]) cor.expandByPoint(p.clone().addScaledVector(fw, a).addScaledVector(rt, b));
      cor.min.y = p.y - 1; cor.max.y = p.y + 12;
      const tris = [], A = new THREE.Vector3(), Bv = new THREE.Vector3(), C = new THREE.Vector3(), tb = new THREE.Box3();
      S.root.traverse((m) => {
        if (!m.isMesh || m.userData.eyeRig || m.userData.noMeasure || !visibleChain(m) || !m.geometry?.attributes?.position) return;
        const P = m.geometry.attributes.position, I = m.geometry.index ? m.geometry.index.array : null, n = I ? I.length / 3 : P.count / 3;
        const wp = new Float32Array(P.count * 3); for (let i = 0; i < P.count; i++) { m.getVertexPosition(i, V); m.localToWorld(V); wp[3 * i] = V.x; wp[3 * i + 1] = V.y; wp[3 * i + 2] = V.z; }
        for (let t = 0; t < n; t++) { const ia = I ? I[3 * t] : 3 * t, ib = I ? I[3 * t + 1] : 3 * t + 1, ic = I ? I[3 * t + 2] : 3 * t + 2;
          A.fromArray(wp, 3 * ia); Bv.fromArray(wp, 3 * ib); C.fromArray(wp, 3 * ic); tb.makeEmpty().expandByPoint(A).expandByPoint(Bv).expandByPoint(C);
          if (tb.intersectsBox(cor)) tris.push(A.x, A.y, A.z, Bv.x, Bv.y, Bv.z, C.x, C.y, C.z); }
      });
      const T = new Float32Array(tris), nT = T.length / 9, maxGround = p.y + 0.5;
      const groundAt = (x, z) => { let best = 0; for (let t = 0; t < nT; t++) { const o = 9 * t, x0 = T[o], z0 = T[o + 2], x1 = T[o + 3], z1 = T[o + 5], x2 = T[o + 6], z2 = T[o + 8];
        const den = (z1 - z2) * (x0 - x2) + (x2 - x1) * (z0 - z2); if (Math.abs(den) < 1e-12) continue;
        const a = ((z1 - z2) * (x - x2) + (x2 - x1) * (z - z2)) / den, b = ((z2 - z0) * (x - x2) + (x0 - x2) * (z - z2)) / den, c = 1 - a - b; if (a < 0 || b < 0 || c < 0) continue;
        const y = a * T[o + 1] + b * T[o + 4] + c * T[o + 7]; if (y <= maxGround && y > best) best = y; } return best; };
      const tri = new THREE.Triangle(), lb = new THREE.Box3();
      const hits = (f, c, gy) => { const w = f.size.x, dz = f.size.z, h = f.size.y, mg = 0.02; lb.min.set(-w / 2 + mg, 0.03, -dz / 2 + mg); lb.max.set(w / 2 - mg, h, dz / 2 - mg);
        const loc = (k, out3) => { const dx = T[k] - c.x, dzz = T[k + 2] - c.z; return out3.set(dx * rt.x + dzz * rt.z, T[k + 1] - gy, dx * fw.x + dzz * fw.z); };
        const rr = Math.hypot(w, dz) / 2 + 0.05;
        for (let t = 0; t < nT; t++) { const o = 9 * t; let near = false; for (let j = 0; j < 3; j++) if (Math.hypot(T[o + 3 * j] - c.x, T[o + 3 * j + 2] - c.z) < rr + 3) { near = true; break; } if (!near) continue;
          loc(o, tri.a); loc(o + 3, tri.b); loc(o + 6, tri.c); if (lb.intersectsTriangle(tri)) return true; } return false; };
      const centreOf = (f, side, sOff, lat = 0) => p.clone().addScaledVector(fw, sOff + f.size.z / 2).addScaledVector(rt, lat + side * (GAP / 2 + f.size.x / 2));
      const footGround = (f, c) => { const fp = f.feet || { minX: -0.15, maxX: 0.15, minZ: -0.15, maxZ: 0.15 }, hs = [];
        for (const u of [0.1, 0.5, 0.9]) for (const v of [0.1, 0.5, 0.9]) { const lx = fp.minX + u * (fp.maxX - fp.minX), lz = fp.minZ + v * (fp.maxZ - fp.minZ); hs.push(groundAt(c.x + rt.x * lx + fw.x * lz, c.z + rt.z * lx + fw.z * lz)); }
        return { y: Math.max(...hs), spread: Math.max(...hs) - Math.min(...hs) }; };
      let chosen = null, why = [], trace = []; out.trace = trace;
      const LATS = [0];                                                    // a sideways search (up to ±1,5 m) was tried on the Aiko bento: no free spot, 15× slower; on axis only
      for (let sOff = FRONT; sOff <= 9 && !chosen; sOff += 0.05) for (const lat of LATS) {
        if (chosen) break;
        const cand = []; let ok = true;
        for (const f of order) { const side = f.rig === 'medium' ? -1 : 1, c = centreOf(f, side, sOff, lat), g = footGround(f, c);
          if (g.spread > 0.02) { ok = false; why.push('uneben'); if (trace.length < 60 && lat === 0) trace.push(`${sOff.toFixed(2)} ${f.rig} uneben ${g.spread.toFixed(3)} y${g.y.toFixed(3)}`); break; }
          if (hits(f, c, g.y)) { ok = false; why.push('Kollision'); if (trace.length < 60 && lat === 0) trace.push(`${sOff.toFixed(2)} ${f.rig} Kollision y${g.y.toFixed(3)}`); break; } cand.push({ f, c, g }); }
        if (ok) chosen = { sOff, lat, cand };
      }
      if (!chosen) { out.notes.push('kein freier, ebener Platz bis 9 m vor dem Eingang: Figuren am Eingang auf y 0 (ungeprüft)'); chosen = { sOff: FRONT, cand: order.map((f) => ({ f, c: centreOf(f, f.rig === 'medium' ? -1 : 1, FRONT), g: { y: 0, spread: 0 } })) }; }
      for (const { f, c, g } of chosen.cand) { f.holder.position.set(c.x, g.y, c.z); f.holder.rotation.set(0, yaw, 0); }
      out.front_m = +chosen.sOff.toFixed(2); out.movedForward_m = +(chosen.sOff - FRONT).toFixed(2); out.lateral_m = +(chosen.lat || 0).toFixed(2);
      if (out.lateral_m) out.notes.push(`Paar ${Math.abs(out.lateral_m).toFixed(2).replace('.', ',')} m seitlich (${out.lateral_m < 0 ? 'links' : 'rechts'}) verschoben, um frei und eben zu stehen`);
      if (out.movedForward_m > 0) out.notes.push(`Figuren ${out.movedForward_m.toFixed(2).replace('.', ',')} m weiter vorn als 0,25 m (${[...new Set(why)].join('/')} näher am Eingang)`);
      const gys = chosen.cand.map((x) => x.g.y);
      if (Math.abs(p.y) > 0.02 || gys.some((y) => Math.abs(y - p.y) > 0.03)) out.notes.push(`Eingangsfuß y ${p.y.toFixed(2)} m, Figuren stehen auf y ${gys.map((y) => y.toFixed(2)).join(' / ')} m`);
      /* door box for framing: door anchor (en[0].door) or the entrance foot; clear height probed upward 0.3 m inside the anchor */
      const dn = E.door ? S.root.getObjectByName(E.door) : null, da = dn ? dn.getWorldPosition(new THREE.Vector3()) : p.clone();
      const probe = da.clone().addScaledVector(fw, -0.3); let ceil = null;
      for (let t = 0; t < nT; t++) { const o = 9 * t, x0 = T[o], z0 = T[o + 2], x1 = T[o + 3], z1 = T[o + 5], x2 = T[o + 6], z2 = T[o + 8];
        const den = (z1 - z2) * (x0 - x2) + (x2 - x1) * (z0 - z2); if (Math.abs(den) < 1e-12) continue;
        const a = ((z1 - z2) * (probe.x - x2) + (x2 - x1) * (probe.z - z2)) / den, b = ((z2 - z0) * (probe.x - x2) + (x0 - x2) * (probe.z - z2)) / den, c = 1 - a - b; if (a < 0 || b < 0 || c < 0) continue;
        const y = a * T[o + 1] + b * T[o + 4] + c * T[o + 7]; if (y > da.y + 0.3 && (ceil === null || y < ceil)) ceil = y; }
      const LH = (Lg || M).size.y, clear = ceil === null ? null : ceil - da.y, top = da.y + Math.min(clear ?? 1.3 * LH, 1.6 * LH), wd = (E.width_m || 1.2) / 2;
      out.doorBox = new THREE.Box3().setFromPoints([da.clone().addScaledVector(rt, -wd).setY(da.y), da.clone().addScaledVector(rt, wd).setY(top)]).expandByVector(new THREE.Vector3(0.05, 0, 0.05));
      out.door = { node: dn ? dn.name : null, threshold_m: +da.y.toFixed(3), probeClear_m: clear === null ? null : +clear.toFixed(2), framedTop_m: +top.toFixed(2) };
    } else {
      /* beside the object, left, feet on the floor (as the v1.1 silhouette); Large next to the object, Medium further out */
      let x = -(S.rxz + 0.35);
      for (const f of [Lg, M].filter(Boolean)) { f.holder.position.set(x - f.size.x / 2, 0, 0); f.holder.rotation.set(0, 0, 0); x -= f.size.x + GAP; }
    }
    F.group.updateMatrixWorld(true);
    const fb = new THREE.Box3(); for (const f of order) fb.union(new THREE.Box3().setFromObject(f.holder, true));
    out.figBox = fb; out.largeBox = new THREE.Box3().setFromObject((Lg || M).holder, true);
    for (const f of order) { const b = new THREE.Box3().setFromObject(f.holder, true); out.figures.push({ rig: f.rig, label: f.label, height_m: +f.height_m.toFixed(3), height_u: +f.height_u.toFixed(3), pose: f.pose, pos_m: f.holder.position.toArray().map((v) => +v.toFixed(3)), yaw_deg: +(f.holder.rotation.y * 180 / Math.PI).toFixed(1), feetMinY_m: +b.min.y.toFixed(4) }); }
    /* contact AO under the feet; the tight shadow box also covers the figures and their shadows */
    for (const m of F.aoMods) { const f = figs.find((x) => x.rig === m.object3d.userData.rig); m.object3d.position.copy(f.holder.localToWorld(m.object3d.userData.feetC.clone())); m.object3d.rotation.y = f.holder.rotation.y; }
    S.fitNow = fitAround([S.cyl, ...order.map((f) => new THREE.Box3().setFromObject(f.holder, true))], S.sunDir);
    F.placement = out; return out;
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
      hiddenOriginals: S.hidden, cardFaceParts: S.faceParts, entrance: S.entrance ? { id: S.entrance.id, outsideBounds: !!S.entranceOutside, node: S.entrance.node.name, pos_u: S.entrance.pos.toArray(), forward_xz: S.entrance.fwd, width_m: S.entrance.width_m } : null, clay: { version: CLAY_VERSION, profile: S.clay.profile, seed: S.clay.seedLabel, scaleRef: S.clay.scaleRef, meshes: S.clay.meshes, cove: 'background, relief off (neutral)' },
      light: { module: LIGHT_VERSION, moods: 'MOODS_MESA', tod: 1, tone: 'ACES Filmic', exposure: 1, shadow: 'PCFSoft, fitAround (subject + cast shadow), front faces cast, mapSize 4096', shadowNow: S.rig.info().shadow, minCaster_m: +S.minCaster.toFixed(3), figureLight: true, rim: false, mood: S.rig.info().mood },
      pose: S.float, shadowSeam: S.seam || null, contactAO: { items: S.aoProxies.length },
      eyes: r || { status: S.eyes?.status || 'none', reason: S.eyes?.reason || null }, eyePixels: S.eyePixels,
      head_m: S.head ? S.head.getSize(new THREE.Vector3()).toArray().map((v) => +v.toFixed(3)) : null,
      scaleRef: scaleRefInfo(),
      frame: { w: W, h: H, fov: FOV, pixelRatio: 1, fill: FILL, az: AZ, el: EL }, loadErrors: S.loadErrors,
      gpu: (() => { const gl = renderer.getContext(), d = gl.getExtension('WEBGL_debug_renderer_info'); return d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); })(),
    };
  }
  /* v1.2 manifest block: scaleRef { medium_m, large_m, atEntrance, entranceId, figures, ... } and the caption for the scale cell */
  function scaleRefInfo() {
    if (!S.scaleFig) return S.type === 'character' ? null : { mode: 'silhouette (Figuren nicht geladen)', warnings: S.figWarn };
    if (!S.scaleFig.placement) frame('scale_ref', 'rest');                    // placement depends on the turntable angle of the scale view
    const F = S.scaleFig, P = F.placement, by = (r) => F.figs.find((f) => f.rig === r), M = by('medium'), L = by('large');
    const dm = (v) => v.toFixed(2).replace('.', ',');
    const label = `Größe: ${M ? 'Medium-Rig ' + dm(M.height_m) + ' m' : ''}${M && L ? ' · ' : ''}${L ? 'Large-Rig ' + dm(L.height_m) + ' m' : ''} ${P.atEntrance ? 'an der Tür' : 'daneben'}`;
    return { medium_m: M ? +M.height_m.toFixed(3) : null, large_m: L ? +L.height_m.toFixed(3) : null, medium_u: M ? +M.height_u.toFixed(3) : null, large_u: L ? +L.height_u.toFixed(3) : null,
      mediumHip_m: M?.hip_m != null ? +M.hip_m.toFixed(3) : null, atEntrance: P.atEntrance, entranceId: P.entranceId, entranceProofFlag: S.scaleEntrance ? S.scaleEntrance.proof : null,
      front_m: P.front_m ?? null, movedForward_m: P.movedForward_m ?? null, lateral_m: P.lateral_m ?? null, door: P.door || null, camera: P.camera || null, figures: P.figures,
      sources: F.figs.map((f) => ({ rig: f.rig, label: f.label, glb: f.glb, pose: f.pose, posedHeight_m: +f.posedHeight_m.toFixed(3), clay: `${f.clay.version}/${f.clay.profile}` })),
      notes: P.notes, trace: P.trace ? P.trace.slice(0, 30) : undefined, warnings: F.warnings, label };
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
/* v1.1: stage/prop layout, 3 x 3, every cell filled */
export const PROP_SLOTS = Object.freeze([
  ['front', 'rest'], ['threeq', 'rest'], ['side', 'rest'],
  ['back', 'rest'], ['top', 'rest'], ['near_face', 'rest'],
  ['detail_low', 'rest'], ['far', 'rest'], ['scale_ref', 'rest'],
]);
export const slotsFor = (type) => (type === 'character' ? SHEET_SLOTS : PROP_SLOTS);
const VIEW_LABEL = { front: 'vorn 0°', threeq: '¾ 35°', side: 'Seite 90°', back: 'hinten 180°', near_face: 'Gesicht nah', far: 'Totale', scale_ref: 'Größe vs. FrizzleBob 1,81 m', top: 'von oben', detail_low: 'Detail unten (unteres Drittel)' };
const EYE_LABEL = { rest: 'Augen Ruhe', half: 'Augen halb', closed: 'Augen zu' };
/**
 * contactSheet({ images: { 'view|eyes': HTMLImageElement|Canvas }, head: { title, sub, gates, foot }, hasEyes }) -> canvas (2000 x 1370)
 */
export function contactSheet({ images, head, hasEyes = true, type = 'character', entrance = false, scaleLabel = null }) {
  const isChar = type === 'character', SLOTS = slotsFor(type);
  const cols = isChar ? 4 : 3, tw = isChar ? 464 : 624, th = isChar ? 348 : 468, gap = 16, cap = 30, top = 104, foot = 46, Wd = cols * tw + (cols + 1) * gap, rows = 3;
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
  SLOTS.forEach(([view, eyes], i) => {
    const cx = gap + (i % cols) * (tw + gap), cy = top + Math.floor(i / cols) * (th + cap + gap);
    const key = hasEyes ? view + '|' + eyes : view + '|-', img = isChar ? images[key] : (images[view + '|-'] || images[view + '|rest']);
    const show = !isChar || hasEyes || eyes === 'rest';
    g.fillStyle = '#ddd6ca'; g.fillRect(cx, cy, tw, th);
    if (img && show) g.drawImage(img, cx, cy, tw, th);
    else { g.fillStyle = '#9a9288'; g.font = '15px system-ui, -apple-system, Helvetica, Arial, sans-serif'; g.fillText(show ? 'nicht angefordert' : '–', cx + tw / 2 - 50, cy + th / 2); }
    g.fillStyle = '#2a2622'; g.fillRect(cx, cy + th, tw, cap);
    g.fillStyle = '#fff'; g.font = '15px system-ui, -apple-system, Helvetica, Arial, sans-serif';
    const vl = !isChar && view === 'near_face' ? 'Detail oben (oberes Drittel)' : !isChar && view === 'detail_low' && entrance ? 'Detail unten · Eingang (unteres Drittel)' : !isChar && view === 'scale_ref' && scaleLabel ? scaleLabel : VIEW_LABEL[view];
    g.fillText(show ? `${vl}${isChar && hasEyes ? ' · ' + EYE_LABEL[eyes] : ''}` : '', cx + 10, cy + th + 20);
  });
  g.fillStyle = '#6d665d'; g.font = '13px ui-monospace, Menlo, monospace'; g.fillText(head.foot || '', gap, Hd - 18);
  return c;
}
