/* KFB · grounding.v1 — ToolBox port of Resident Atlas S15 lib/grounding.js (hard grounding gate, 29.09).
   Contact is MEASURED: lowest point of the POSED skin per foot (plus whole body), props by their real
   underside, against the first VISIBLE surface below. Correction happens at most once, never via bias.
   ToolBox changes (P07): `skinnedWorld` inlined (no atlas.js dependency), ids via `recordOf`,
   surface names also match stage/plane/support/ground. Tolerance 0.012 (≈ 0.5 % figure height). */
import * as THREE from 'three';

const _v = new THREE.Vector3(), _b = new THREE.Box3(), _skA = new THREE.Vector3(), _skV = new THREE.Vector3(), _skM = new THREE.Matrix4();
export const TOL = 0.012;

export function skinnedWorld(mesh, i, out) {
  const g = mesh.geometry, sk = mesh.skeleton, si = g.attributes.skinIndex, sw = g.attributes.skinWeight;
  out.fromBufferAttribute(g.attributes.position, i);
  if (!si || !sw || !sk) return out.applyMatrix4(mesh.matrixWorld);
  out.applyMatrix4(mesh.bindMatrix);
  _skA.set(0, 0, 0);
  const w = [sw.getX(i), sw.getY(i), sw.getZ(i), sw.getW(i)], b = [si.getX(i), si.getY(i), si.getZ(i), si.getW(i)];
  for (let k = 0; k < 4; k++) {
    if (!w[k]) continue;
    const bone = sk.bones[b[k]]; if (!bone) continue;
    _skM.multiplyMatrices(bone.matrixWorld, sk.boneInverses[b[k]]);
    _skA.add(_skV.copy(out).applyMatrix4(_skM).multiplyScalar(w[k]));
  }
  return out.copy(_skA);
}

export function makeGrounding(V, { surfaces, getRoot, recordOf = (n) => n.userData.entry }) {
  const ray = new THREE.Raycaster();
  const within = (o, n) => { for (let p = o; p; p = p.parent) if (p === n) return true; return false; };
  const visible = (o) => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };
  const idOf = (n) => { const r = recordOf(n); return r ? r.id : n.name; };
  const nameChain = (o) => { let s = ''; for (let p = o; p && s.length < 120; p = p.parent) s += (p.name || '') + '/'; return s; };

  let cache = null;
  function surfList() {
    const root = getRoot && getRoot(), base = surfaces();
    if (cache && cache.root === root && cache.base.length === base.length && cache.base.every((m, i) => m === base[i])) return cache.list;
    const list = base.slice();
    if (root) root.traverse((o) => { if (o.isMesh && !o.isSkinnedMesh && /floor|path|tile|track|stage|plane|support|ground/i.test(nameChain(o)) && !/debris|inv\.|ik|handle/i.test(nameChain(o)) && !list.includes(o)) list.push(o); });
    cache = { root, base, list };
    return list;
  }
  const _o = new THREE.Vector3(), _d = new THREE.Vector3(0, -1, 0);
  function surfaceUnder(x, y, z, node) {
    ray.set(_o.set(x, y + 0.6, z), _d); ray.far = 60;
    const hits = ray.intersectObjects(surfList(), false).filter((h) => visible(h.object) && !within(h.object, node));
    return hits[0] ? { y: hits[0].point.y, on: hits[0].object.userData.surface || hits[0].object.name || nameChain(hits[0].object) } : null;
  }
  function footSets(sk) {
    if (sk.userData.footSets) return sk.userData.footSets;
    const bones = sk.skeleton.bones, si = sk.geometry.attributes.skinIndex, sw = sk.geometry.attributes.skinWeight, n = sk.geometry.attributes.position.count;
    const feet = new Map();
    bones.forEach((b, i) => { const m = /(foot|toe)[._]?([lr])?/i.exec(b.name); if (m) feet.set(i, (m[2] || (/left|_l|\.l|l$/i.test(b.name) ? 'l' : 'r')).toLowerCase()); });
    const sets = { l: [], r: [], body: [] }, step = Math.max(1, Math.floor(n / 120));
    for (let i = 0; i < n; i++) {
      let bi = -1, bw = 0;
      if (si && sw) for (let k = 0; k < 4; k++) { const w = [sw.getX(i), sw.getY(i), sw.getZ(i), sw.getW(i)][k]; if (w > bw) { bw = w; bi = [si.getX(i), si.getY(i), si.getZ(i), si.getW(i)][k]; } }
      const side = feet.get(bi);
      if (side) sets[side].push(i); else if (i % step === 0) sets.body.push(i);
    }
    for (const k of ['l', 'r']) if (sets[k].length > 40) { const s = Math.ceil(sets[k].length / 40); sets[k] = sets[k].filter((_, j) => j % s === 0); }
    sk.userData.footSets = sets;
    return sets;
  }
  function contactOf(node) {
    const sks = []; node.traverse((o) => { if (o.isSkinnedMesh && visible(o)) sks.push(o); });
    if (!sks.length) return null;
    node.updateMatrixWorld(true);
    const cand = [];
    for (const k of ['l', 'r', 'body']) {
      let low = null;
      for (const sk of sks) { const sets = footSets(sk); for (const i of sets[k]) { skinnedWorld(sk, i, _v); if (!low || _v.y < low.y) low = _v.clone(); } }
      if (!low) continue;
      const s = surfaceUnder(low.x, low.y, low.z, node);
      if (s) cand.push({ k, p: low, s, gap: low.y - s.y });
    }
    if (!cand.length) return null;
    cand.sort((a, b) => a.gap - b.gap);
    return { ...cand[0], all: cand };
  }
  function propContact(node) {
    node.updateMatrixWorld(true);
    _b.makeEmpty();
    node.traverse((o) => { if (o.isMesh && visible(o) && !o.isSkinnedMesh && !o.material?.isMeshBasicMaterial) _b.expandByObject(o, true); });
    if (_b.isEmpty()) return null;
    const c = _b.getCenter(new THREE.Vector3()), hx = (_b.max.x - _b.min.x) / 4, hz = (_b.max.z - _b.min.z) / 4;
    let best = null;
    for (const [dx, dz] of [[0, 0], [hx, 0], [-hx, 0], [0, hz], [0, -hz]]) { const s = surfaceUnder(c.x + dx, _b.min.y, c.z + dz, node); if (s && (!best || s.y > best.y)) best = s; }
    return best ? { p: new THREE.Vector3(c.x, _b.min.y, c.z), s: best, gap: _b.min.y - best.y, k: 'underside' } : null;
  }
  function measure(node) {
    const c = contactOf(node) || propContact(node);
    if (!c) return { id: idOf(node), error: 'no surface below' };
    const gap = c.gap, s = c.s;
    return { id: idOf(node), how: c.k === 'underside' ? 'underside' : 'foot contact ' + c.k, bottom: +c.p.y.toFixed(4), surface: +s.y.toFixed(4), on: String(s.on).split('/')[0] || s.on, gap: +gap.toFixed(4), at: c.p.toArray().map((x) => +x.toFixed(3)), state: Math.abs(gap) <= TOL ? 'PASS' : gap > 0 ? 'floats' : 'sunk', pass: Math.abs(gap) <= TOL };
  }
  function ground(node) {
    const r = measure(node);
    if (r.error || r.pass) return { ...r, moved: 0 };
    /* the node may sit under a scaled/rotated parent: move in WORLD y, then convert */
    const wp = node.getWorldPosition(new THREE.Vector3()); wp.y -= r.gap;
    if (node.parent) node.parent.worldToLocal(wp);
    node.position.copy(wp);
    node.updateMatrixWorld(true);
    const after = measure(node);
    return { ...after, moved: +(-r.gap).toFixed(4), before: r.gap };
  }
  return { invalidate() { cache = null; }, measure, ground, surfaceUnder, contactOf, propContact, TOL };
}
