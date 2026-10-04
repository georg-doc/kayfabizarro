/* KFB contact-ao.v1 · baked contact occlusion for actors (30.09.)
 * The bright seam at head/neck (FB graft head over the collar), ear roots, nose base and hair tufts is NOT a shadow-bias
 * problem: the shadow map cannot darken a part that sits inside another part. Source of the rule: Joyride 29.09.
 * FIXES_OFFEN F2 + aoNote (»fehlende Kontaktverdeckung, kein Schatten-Bias«) and LESSONS_SHADOWS (main, PR #290).
 * Fix: per receiver vertex, distance d to the nearest surface of an allowed occluder part, AO = 1 − k·(1 − smoothstep(0, R, d))^1.5,
 * multiplied into the vertex colour. Zero runtime cost. Baked in the current pose (call bake() again after body/neck changes).
 * Pair rule (no arm/leg stripes when limbs move): head-group parts (head, ears, hair, nose, moustache, hat) occlude every other
 * part; torso parts occlude only head-group parts (head underside). Eyes, lids, brows, mouth never occlude and never receive.
 * Safety: every receiver gets a colour attribute (1 = untouched) BEFORE any material family is applied, and its material gets
 * vertexColors — so clones made later (body-surface) inherit it. Materials shared with non-receivers are cloned first.
 * Turning AO off writes 1 everywhere; only dispose() removes the attribute. */
export const SCHEMA = 'kfb.contact-ao/0.1';
export const DEFAULTS = Object.freeze({ on: true, strength: 0.8, radius: 2, face: 0.15, faceReach: 0.3 });   // set on FB Ear Rig v5, side view head/neck (30.09.)
/* Face parts (nose, moustache) are their own class since 30.09. (Georg: »die Nase wirft einen sehr großen Schatten aufs Gesicht …
   tendenziell weglassen oder unten normaler, leichter«, and the mouth went dark while talking). Their occlusion has its own strength
   (face, default light) and reach (faceReach × R, default a thin contact band under the nose) — it never reaches the mouth. */
const FACE = /nose|moust|beard|(^|[^a-z])bart/i;
const SKIP = /eye|pupil|iris|(^|[^a-z])lid|mouth|teeth|tongue|lash|brow|skin-proxy|pose-jig|kfb-lid|clay-lid|eyerig|faceHost/i;
const HEAD = /head|skull|(^|[^a-z])ears?([^a-z]|$)|ear_|hair|tuft|nose|moust|hat|helmet|cap([^a-z]|$)|graft/i;
const TORSO = /body|torso|chest|neck|collar|shirt|jacket|spine|coat/i;

export function makeContactAO(THREE, root, opt = {}) {
  const extraOcc = typeof opt.occluders === 'function' ? opt.occluders : () => [];
  let height = opt.height || 0;
  let params = { ...DEFAULTS };
  const path = (o) => { const a = []; for (let n = o; n && n !== root; n = n.parent) a.push(n.name || ''); return a.join('/'); };
  const matOk = (m) => m && m.color && !m.isShaderMaterial && !m.isMeshBasicMaterial && !m.isPointsMaterial && !m.isLineBasicMaterial && !(m.transparent && (m.opacity == null || m.opacity < 0.98));
  /* class from the mesh's own name; unnamed/neutral parts inherit from the nearest BONE above them (nose → head bone).
     Group/wrapper names (»FrizzleBob Ear Rig v5«) never decide. 1 = head group · 2 = torso · 0 = limb/other */
  const clsName = (n) => FACE.test(n) ? 3 : HEAD.test(n) ? 1 : TORSO.test(n) ? 2 : 0;
  const cls = (o) => { const own = clsName(o.name || ''); if (own) return own; for (let n = o.parent; n && n !== root; n = n.parent) if (n.isBone) return clsName(n.name || ''); return 0; };
  const recv = [], all = [];
  root.traverse((o) => { if (o.isMesh && o.geometry && o.geometry.attributes.position) all.push(o); });
  for (const o of all) {
    const p = path(o), mats = [].concat(o.material);
    if (o.userData.petOverlay || o.userData.noMeasure || SKIP.test(p) || !mats.every(matOk)) continue;
    const c = cls(o);
    recv.push({ o, p, head: c === 1 || c === 3, face: c === 3, torso: c === 2, d: null, df: null, base: null, had: null, geomOrig: null, matOrig: null });
  }
  /* materials shared with a non-receiver → clone for the receivers */
  const recvSet = new Set(recv.map((r) => r.o)), matUsers = new Map();
  for (const o of all) for (const m of [].concat(o.material)) { if (!m) continue; if (!matUsers.has(m)) matUsers.set(m, []); matUsers.get(m).push(o); }
  const cloned = new Map(), vcOrig = new Map();
  for (const r of recv) {
    const mats = [].concat(r.o.material); let swap = false;
    const next = mats.map((m) => { if (matUsers.get(m).some((u) => !recvSet.has(u))) { swap = true; if (!cloned.has(m)) cloned.set(m, m.clone()); return cloned.get(m); } return m; });
    if (swap) { r.matOrig = r.o.material; r.o.material = Array.isArray(r.o.material) ? next : next[0]; }
  }
  /* shared geometry across receivers → clone; colour attribute prepared (1 = untouched) */
  const geomSeen = new Set();
  for (const r of recv) {
    if (geomSeen.has(r.o.geometry)) { r.geomOrig = r.o.geometry; r.o.geometry = r.o.geometry.clone(); }
    geomSeen.add(r.o.geometry);
    const g = r.o.geometry, n = g.attributes.position.count, C = g.attributes.color, mats = [].concat(r.o.material);
    const usesVC = mats.some((m) => m.vertexColors);
    if (C && usesVC) { r.base = new Float32Array(n * 3); for (let i = 0; i < n; i++) { r.base[i * 3] = C.getX(i); r.base[i * 3 + 1] = C.getY(i); r.base[i * 3 + 2] = C.getZ(i); } r.had = C; }
    else { r.had = C || null; }
    const a = new Float32Array(n * 3); if (r.base) a.set(r.base); else a.fill(1);
    g.setAttribute('color', new THREE.BufferAttribute(a, 3));
    for (const m of mats) { if (!vcOrig.has(m)) vcOrig.set(m, m.vertexColors); if (!m.vertexColors) { m.vertexColors = true; m.needsUpdate = true; } }
  }
  if (!height) { const b = new THREE.Box3(); for (const r of recv) b.expandByObject(r.o); height = b.isEmpty() ? 1.2 : Math.max(0.2, Math.min(20, b.max.y - b.min.y)); }
  const info = { receivers: recv.length, head: recv.filter((r) => r.head).map((r) => r.o.name || '?'), torso: recv.filter((r) => r.torso).map((r) => r.o.name || '?'), samples: 0, darkened: 0, ms: 0, baked: false };

  const v = new THREE.Vector3(), nrm = new THREE.Vector3(), nm = new THREE.Matrix3();
  const worldPos = (o, out) => { const P = o.geometry.attributes.position, n = P.count; out = out || new Float32Array(n * 3); for (let i = 0; i < n; i++) { o.getVertexPosition(i, v); v.applyMatrix4(o.matrixWorld); out[i * 3] = v.x; out[i * 3 + 1] = v.y; out[i * 3 + 2] = v.z; } return out; };
  let token = 0;
  const yieldNow = () => new Promise((r) => setTimeout(r, 0));
  async function bake() {
    const my = ++token; info.baked = false;
    const t0 = performance.now(); root.updateMatrixWorld(true);
    const R = height * 0.035 * Math.max(0.2, +params.radius || 1), cell = R, sp = R / 2.2;
    /* occluder samples on triangle surfaces: [x,y,z, meshId, cls] cls 1 = head group, 2 = torso */
    const occ = [];
    const faceOcc = (extraOcc() || []).filter((o) => o && o.isMesh && o.geometry && o.geometry.attributes.position && o.visible);
    const occMeshes = recv.filter((r) => r.head || r.torso).map((r) => ({ o: r.o, cls: r.face ? 3 : r.head ? 1 : 2 })).concat(faceOcc.filter((o) => !recv.some((r) => r.o === o)).map((o) => ({ o, cls: 3 })));
    const ids = new Map(); occMeshes.forEach((m, i) => ids.set(m.o, i));
    let rnd = 12345; const rand = () => { rnd = (rnd * 16807) % 2147483647; return rnd / 2147483647; };
    for (const { o, cls } of occMeshes) {
      const W = worldPos(o), I = o.geometry.index, nt = I ? I.count / 3 : W.length / 9, id = ids.get(o);
      for (let t = 0; t < nt; t++) {
        const a = I ? I.getX(t * 3) : t * 3, b = I ? I.getX(t * 3 + 1) : t * 3 + 1, c = I ? I.getX(t * 3 + 2) : t * 3 + 2;
        const ax = W[a * 3], ay = W[a * 3 + 1], az = W[a * 3 + 2], ux = W[b * 3] - ax, uy = W[b * 3 + 1] - ay, uz = W[b * 3 + 2] - az, wx = W[c * 3] - ax, wy = W[c * 3 + 1] - ay, wz = W[c * 3 + 2] - az;
        const cx = uy * wz - uz * wy, cy = uz * wx - ux * wz, cz = ux * wy - uy * wx, area = 0.5 * Math.hypot(cx, cy, cz);
        const k = Math.min(40, 1 + Math.floor(area / (sp * sp)));
        for (let s = 0; s < k; s++) { let r1 = s === 0 ? 1 / 3 : rand(), r2 = s === 0 ? 1 / 3 : rand(); if (r1 + r2 > 1) { r1 = 1 - r1; r2 = 1 - r2; } occ.push(ax + ux * r1 + wx * r2, ay + uy * r1 + wy * r2, az + uz * r1 + wz * r2, id, cls); }
        if (occ.length > 5 * 240000) break;
      }
    }
    const NS = occ.length / 5; info.samples = NS;
    const grid = new Map(), key = (x, y, z) => ((x + 1024) * 2048 + (y + 1024)) * 2048 + (z + 1024);
    for (let i = 0; i < NS; i++) { const k = key(Math.floor(occ[i * 5] / cell), Math.floor(occ[i * 5 + 1] / cell), Math.floor(occ[i * 5 + 2] / cell)); let L = grid.get(k); if (!L) grid.set(k, L = []); L.push(i); }
    let dark = 0, tSl = performance.now();
    for (const r of recv) {
      const o = r.o, P = o.geometry.attributes.position, N = o.geometry.attributes.normal, n = P.count, W = worldPos(o), self = ids.has(o) ? ids.get(o) : -1;
      nm.getNormalMatrix(o.matrixWorld); const d = r.d = new Float32Array(n).fill(1e9), df = r.df = new Float32Array(n).fill(1e9);
      for (let i = 0; i < n; i++) {
        if ((i & 255) === 0 && performance.now() - tSl > 12) { await yieldNow(); if (my !== token) return info; tSl = performance.now(); }
        const px = W[i * 3], py = W[i * 3 + 1], pz = W[i * 3 + 2];
        if (N) nrm.fromBufferAttribute(N, i).applyMatrix3(nm).normalize(); else nrm.set(0, 0, 0);
        const gx = Math.floor(px / cell), gy = Math.floor(py / cell), gz = Math.floor(pz / cell); let best = 1e9, bestF = 1e9;
        for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
          const L = grid.get(key(gx + x, gy + y, gz + z)); if (!L) continue;
          for (const j of L) {
            const id = occ[j * 5 + 3], cls = occ[j * 5 + 4]; if (id === self) continue;
            if (cls === 2 && !r.head) continue;
            const dx = occ[j * 5] - px, dy = occ[j * 5 + 1] - py, dz = occ[j * 5 + 2] - pz, dd = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (cls === 3 ? dd >= bestF : dd >= best) continue;
            if (dx * nrm.x + dy * nrm.y + dz * nrm.z < -0.3 * dd) continue;   // behind the receiver surface
            if (cls === 3) bestF = dd; else best = dd;
          }
        }
        d[i] = best / R; df[i] = bestF / R;
      }
    }
    if (my !== token) return info;
    info.ms = Math.round(performance.now() - t0); info.baked = true; info.R = +R.toFixed(4);
    dark = write(); info.darkened = dark; if (opt.onBaked) try { opt.onBaked(info); } catch (e) {} return info;
  }
  const ss = (x) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };
  function write() {
    let dark = 0; const k = params.on ? Math.max(0, Math.min(1, +params.strength)) : 0, kf = params.on ? Math.max(0, Math.min(1, +params.face || 0)) : 0, rf = Math.max(0.05, +params.faceReach || 0.3);
    for (const r of recv) {
      const C = r.o.geometry.attributes.color, a = C.array, n = C.count;
      for (let i = 0; i < n; i++) {
        const f = (r.d && k > 0 ? 1 - k * Math.pow(1 - ss(r.d[i]), 1.5) : 1) * (r.df && kf > 0 ? 1 - kf * Math.pow(1 - ss(r.df[i] / rf), 1.5) : 1); if (f < 0.97) dark++;
        const b0 = r.base ? r.base[i * 3] : 1, b1 = r.base ? r.base[i * 3 + 1] : 1, b2 = r.base ? r.base[i * 3 + 2] : 1;
        a[i * 3] = b0 * f; a[i * 3 + 1] = b1 * f; a[i * 3 + 2] = b2 * f;
      }
      C.needsUpdate = true;
    }
    return dark;
  }
  const api = {
    schema: SCHEMA, get params() { return { ...params }; }, info,
    status: recv.length ? 'OK' : 'NO_RECEIVERS',
    set(p) { const old = params; params = { ...params, ...(p || {}) }; params.on = params.on !== false; params.strength = Math.max(0, Math.min(1, +params.strength)); params.radius = Math.max(0.2, Math.min(4, +params.radius || 1)); params.face = Math.max(0, Math.min(1, +params.face || 0)); params.faceReach = Math.max(0.05, Math.min(1, +params.faceReach || 0.3));
      if (!info.baked || params.radius !== old.radius) bake(); else info.darkened = write(); return api.params; },
    bake,
    report() { return { schema: SCHEMA, params: api.params, ...info }; },
    dispose() {
      token++;
      for (const r of recv) { const g = r.o.geometry; if (r.had) g.setAttribute('color', r.had); else g.deleteAttribute('color'); if (r.geomOrig) { g.dispose(); r.o.geometry = r.geomOrig; } if (r.matOrig) r.o.material = r.matOrig; }
      for (const [m, vc] of vcOrig) if (m.vertexColors !== vc) { m.vertexColors = vc; m.needsUpdate = true; }
      for (const m of cloned.values()) m.dispose();
    },
  };
  return api;
}
