/* body-shape.v1.js · thicker/thinner and taller/shorter within what the skeleton allows (KFB ToolBox, 26.09.2026).
 * Georg 26.09.: »den körper dicker/dünner machen … im rahmen dessen, was die animationen & anatomie zulassen« · »das gleiche mit
 * sinnvollen/funktionalen limits für die höhe (wenn das alles mit den bones passt)«.
 * GIRTH: bind-space vertex edit. Each vertex is decomposed per influencing bone into axial position along that bone's segment
 *   (bone head → first child head) + radial offset; the radial part is scaled by the region factor (torso · arms · legs) and
 *   blended by skin weight. Weights and bones stay as they are, so every clip bends the body exactly as before. Head, neck,
 *   hands, feet, toes, ears and anything below `head` keep factor 1: the face rig, hair and ears are not touched.
 * LENGTH: legs and torso. Chain bones get longer rest offsets (child.position × f of its parent segment), vertices on those
 *   segments are stretched axially to match, and boneInverses get the translation delta (analytic, no calculateInverses on a
 *   posed skeleton). Clips that key positions are handled after mixer.update(): a fresh clip value is scaled by the same f,
 *   a value we wrote ourselves is left alone (same »written« pattern as ear-dangle.v1). Hips height follows the leg factor,
 *   so the feet stay on the ground.
 * LIMITS (functional): girth torso 0.7…1.5 · arms/legs 0.7…1.4 · leg length 0.8…1.3 · torso length 0.85…1.25. Beyond this
 *   the KayKit joint radii start to show (elbow/knee pinching, clavicle gaps). Rigs without these bones report UNSUPPORTED. */
export const SCHEMA = 'kfb.body-shape/0.1';
export const DEFAULTS = Object.freeze({ girth: 1, arms: 1, legs: 1, legLen: 1, torsoLen: 1 });
export const META = [
  ['girth', 'Torso girth · belly + chest', 0.7, 1.5, 0.01], ['arms', 'Arm girth', 0.7, 1.4, 0.01], ['legs', 'Leg girth', 0.7, 1.4, 0.01],
  ['legLen', 'Leg length', 0.8, 1.3, 0.01], ['torsoLen', 'Torso length', 0.85, 1.25, 0.01],
];
const nm = (b) => String(b.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const CLASS = [
  [/^(hips|pelvis|root)$/, 'torso', 'torso'], [/^(spine|spine\d|abdomen|chest|upperchest|torso)$/, 'torso', 'torso'],
  [/^(upperarm|lowerarm|forearm|arm)(l|r|left|right)?$/, 'arms', null], [/^(shoulder|clavicle)(l|r|left|right)?$/, 'arms', null],
  [/^(upperleg|lowerleg|thigh|shin|calf|leg)(l|r|left|right)?$/, 'legs', 'legs'],
];
function classify(b) { const n = nm(b); for (const [re, girth, len] of CLASS) if (re.test(n)) return { girth, len }; return null; }

export function makeBodyShape(THREE, figure, { log = () => {} } = {}) {
  const meshes = []; figure.traverse((o) => { if (o.isSkinnedMesh && o.skeleton) meshes.push(o); });
  if (!meshes.length) return { status: 'UNSUPPORTED', reason: 'no skinned mesh' };
  const bones = new Set(); meshes.forEach((m) => m.skeleton.bones.forEach((b) => bones.add(b)));
  let head = null; for (const b of bones) if (/^head$/.test(nm(b))) { head = b; break; }
  const under = (b, anc) => { for (let a = b; a; a = a.parent) if (a === anc) return true; return false; };
  const info = new Map(); let nTorso = 0, nLimb = 0;
  for (const b of bones) { if (head && under(b, head)) continue; const c = classify(b); if (c) { info.set(b, c); if (c.girth === 'torso') nTorso++; else nLimb++; } }
  if (!nTorso || !nLimb) return { status: 'UNSUPPORTED', reason: 'no KayKit-style torso/limb bones' };
  const hips = [...bones].find((b) => /^(hips|pelvis)$/.test(nm(b))) || null;
  /* bind-space bone frames from the first skeleton that has the bone */
  const bindW = new Map();
  for (const m of meshes) m.skeleton.bones.forEach((b, i) => { if (!bindW.has(b)) bindW.set(b, new THREE.Matrix4().copy(m.skeleton.boneInverses[i]).invert()); });
  const headPos = (b) => new THREE.Vector3().setFromMatrixPosition(bindW.get(b));
  const firstChild = (b) => { let best = null, d = 0; for (const c of b.children) if (c.isBone && bindW.has(c)) { const dd = headPos(c).distanceTo(headPos(b)); if (!best || (info.has(c) && !info.has(best)) || dd > d) { best = c; d = dd; } } return best; };
  const seg = new Map();
  for (const b of bindW.keys()) { const c = firstChild(b), a = headPos(b); let e = c ? headPos(c) : null; if (!e || e.distanceTo(a) < 1e-5) { const dir = new THREE.Vector3(0, 1, 0).transformDirection(bindW.get(b)); e = a.clone().addScaledVector(dir, 0.05); } seg.set(b, { a, e, child: c }); }
  const orig = meshes.map((m) => ({ m, pos: Float32Array.from(m.geometry.attributes.position.array), inv: m.skeleton.boneInverses.map((x) => x.clone()) }));
  const rest = new Map(); for (const b of bones) rest.set(b, b.position.clone());
  const P = { ...DEFAULTS }, written = new Map();
  const lenF = (b) => { const c = info.get(b); return c && c.len === 'legs' ? P.legLen : c && c.len === 'torso' ? P.torsoLen : 1; };
  const girF = (b) => { const c = info.get(b); if (!c) return 1; return c.girth === 'torso' ? P.girth : c.girth === 'arms' ? P.arms : P.legs; };
  function apply() {
    /* new bind-space bone heads: propagate lengthened parent segments down each chain */
    const newA = new Map();
    const walk = (b, delta) => { newA.set(b, seg.get(b).a.clone().add(delta)); const s = seg.get(b), f = lenF(b);
      for (const c of b.children) if (c.isBone && seg.has(c)) { const off = headPos(c).sub(s.a); walk(c, delta.clone().add(off.multiplyScalar(f - 1))); } };
    for (const b of bindW.keys()) { const p = b.parent; if (!p || !p.isBone || !bindW.has(p)) walk(b, new THREE.Vector3()); }
    /* rest offsets on the live bones */
    for (const b of bones) { const p = b.parent, f = p && p.isBone ? lenF(p) : 1; const v = rest.get(b).clone().multiplyScalar(f); b.position.copy(v); written.set(b, v.clone()); }
    if (hips) { const v = rest.get(hips).clone(); v.y *= P.legLen; hips.position.copy(v); written.set(hips, v.clone()); }
    const vb = new THREE.Vector3(), out = new THREE.Vector3(), ax = new THREE.Vector3(), pr = new THREE.Vector3(), rad = new THREE.Vector3(), tmp = new THREE.Vector3();
    for (const o of orig) {
      const m = o.m, g = m.geometry, pa = g.attributes.position, SI = g.attributes.skinIndex, SW = g.attributes.skinWeight, sk = m.skeleton, bm = m.bindMatrix, bmi = m.bindMatrixInverse;
      for (let v = 0; v < pa.count; v++) {
        vb.set(o.pos[v * 3], o.pos[v * 3 + 1], o.pos[v * 3 + 2]).applyMatrix4(bm); out.set(0, 0, 0); let wsum = 0;
        for (let k = 0; k < 4; k++) {
          const w = SW.getComponent(v, k); if (!(w > 0)) continue; const b = sk.bones[SI.getComponent(v, k)], s = b && seg.get(b); if (!s) { out.addScaledVector(vb, w); wsum += w; continue; }
          ax.subVectors(s.e, s.a); const L2 = Math.max(1e-10, ax.lengthSq()), t = tmp.subVectors(vb, s.a).dot(ax) / L2;
          pr.copy(s.a).addScaledVector(ax, t); rad.subVectors(vb, pr);
          const a2 = newA.get(b) || s.a, f = lenF(b), gf = girF(b);
          out.addScaledVector(tmp.copy(a2).addScaledVector(ax, t * f).addScaledVector(rad, gf), w); wsum += w;
        }
        if (wsum > 0) out.divideScalar(wsum); else out.copy(vb);
        out.applyMatrix4(bmi); pa.setXYZ(v, out.x, out.y, out.z);
      }
      pa.needsUpdate = true; g.computeBoundingSphere(); g.computeBoundingBox();
      sk.bones.forEach((b, i) => { const s = seg.get(b), a2 = newA.get(b); if (!s || !a2) return; const d = a2.clone().sub(s.a); sk.boneInverses[i].copy(o.inv[i]).multiply(new THREE.Matrix4().makeTranslation(-d.x, -d.y, -d.z)); });
    }
  }
  const api = { schema: SCHEMA, status: 'OK', params: P, report: { meshes: meshes.length, bones: bones.size, torso: nTorso, limbs: nLimb, hips: hips ? hips.name : null, head: head ? head.name : null } };
  api.set = (patch) => { let ch = false; for (const [k, , mn, mx] of META) if (patch && patch[k] != null && isFinite(+patch[k])) { const v = Math.min(mx, Math.max(mn, +patch[k])); if (v !== P[k]) { P[k] = v; ch = true; } } if (ch) apply(); return { status: 'OK' }; };
  /** after mixer.update(): scale fresh clip positions, keep our own */
  api.update = () => {
    if (P.legLen === 1 && P.torsoLen === 1) return;
    for (const b of bones) { const p = b.parent, f = b === hips ? null : (p && p.isBone ? lenF(p) : 1), wv = written.get(b); if (!wv) continue;
      if (b.position.equals(wv)) continue;
      if (b === hips) b.position.y *= P.legLen; else if (f !== 1) b.position.multiplyScalar(f); else continue;
      written.set(b, b.position.clone()); }
  };
  api.dispose = () => { for (const o of orig) { o.m.geometry.attributes.position.array.set(o.pos); o.m.geometry.attributes.position.needsUpdate = true; o.inv.forEach((x, i) => o.m.skeleton.boneInverses[i].copy(x)); } for (const [b, v] of rest) b.position.copy(v); };
  return api;
}
