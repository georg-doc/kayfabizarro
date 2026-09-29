/* KFB clay-vfx v1 (T4, 28.09.) — Knet-Partikel nach VFX_CLAY_PARTICLE_GRAMMAR_V1: Kügelchen, gestauchte Tropfen, kurze Späne.
 * Instanziert (ein InstancedMesh je Grundform), gepoolt (keine Objektanlage pro Frame), schattenlos, deterministisch über Seed.
 * Material: reduzierter Clay-Shader (MeshStandard + ein Dellen-Rauschterm), NICHT der K2-Werkzeugpfad.
 * Liest lab-vfx/clay-particle-profiles.v1.json. Gameplay liefert Ereignis, Kontaktpunkt, Normale, Energie, Biom; das Modul schreibt keine Physik. */
import * as THREE from 'three';

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const mulberry = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

export function makeClayVFX(root, PP, { camera, accent = () => '#f2b632' } = {}) {
  const CAP = PP.quality.high.maxAlive, R = mulberry(PP.seed || 1);
  const geos = { ball: new THREE.IcosahedronGeometry(1, 1), drop: (() => { const g = new THREE.SphereGeometry(1, 10, 7); g.scale(1, 0.62, 1.25); return g; })(), span: new THREE.CapsuleGeometry(0.42, 1.6, 3, 7) };
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.82, metalness: 0 });
  mat.onBeforeCompile = sh => {
    sh.vertexShader = 'varying vec3 vLocT4;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vLocT4 = position;');
    sh.fragmentShader = 'varying vec3 vLocT4;\n' + sh.fragmentShader.replace('#include <normal_fragment_begin>', `#include <normal_fragment_begin>
      { vec3 p = vLocT4 * 2.6; float n1 = sin(p.x * 2.3 + p.y * 1.7) * sin(p.y * 2.9 + p.z * 1.3) * sin(p.z * 2.1 + p.x * 1.1);
        normal = normalize(normal + vec3(dFdx(n1), dFdy(n1), 0.0) * 2.2); }`);
  };
  mat.customProgramCacheKey = () => 'kfb-clay-vfx-v1';
  const KEYS = ['ball', 'drop', 'span'], meshes = {};
  for (const k of KEYS) { const m = new THREE.InstancedMesh(geos[k], mat, CAP); m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.setColorAt(0, new THREE.Color()); m.count = 0;
    m.frustumCulled = false; m.castShadow = false; m.receiveShadow = false; m.name = 'vfx-' + k; root.add(m); meshes[k] = m; }
  const F = n => new Float32Array(CAP), I = () => new Int8Array(CAP);
  const P = { x: F(), y: F(), z: F(), vx: F(), vy: F(), vz: F(), age: F(), life: F(), size: F(), gy: F(), bnc: F(), stk: F(), g: F(), cr: F(), cg: F(), cb: F(),
    ax: F(), ay: F(), az: F(), spin: F(), rot: F(), sq: F(), mesh: I(), state: I(), bl: I(), roll: I(), qx: F(), qy: F(), qz: F(), qw: F() };
  const free = []; for (let i = CAP - 1; i >= 0; i--) free.push(i);
  const live = new Set();
  const byKey = new Map(PP.profiles.map(p => [p.biome + ':' + p.event, p]));
  let Q = 'high', QO = PP.quality.high;
  const stats = { alive: 0, peak: 0, emitted: 0, calls: 0, quality: Q, culled: 0 };
  const col = new THREE.Color(), tmpC = new THREE.Color();
  const resolve = c => c === '$accent' ? accent() : c === '$accentLight' ? tmpC.set(accent()).offsetHSL(0, 0, 0.18).getHexString().replace(/^/, '#') : c;
  const pickMesh = (pf) => { const ms = pf.meshSet, allowed = (QO.meshes || KEYS).filter(k => ms[k]); let tot = 0; for (const k of allowed) tot += ms[k]; let r = R() * tot;
    for (const k of allowed) { r -= ms[k]; if (r <= 0) return KEYS.indexOf(k); } return 0; };
  const up = new THREE.Vector3(0, 1, 0), vA = new THREE.Vector3(), vB = new THREE.Vector3(), qt = new THREE.Quaternion();

  function spawn(pf, o, big) {
    if (!free.length || live.size >= QO.maxAlive) return false;
    const i = free.pop(); live.add(i);
    const sp = lerp(pf.speedRange[0], pf.speedRange[1], R()) * (o.speedK ?? 1), spr = pf.spread;
    let dx = o.dir.x, dy = o.dir.y, dz = o.dir.z;
    if (pf.ring) { const a = R() * Math.PI * 2; dx = Math.cos(a); dz = Math.sin(a); dy = 0.35 + 0.3 * R(); }
    dx += (R() - 0.5) * 2 * spr; dy += (R() - 0.3) * spr; dz += (R() - 0.5) * 2 * spr;
    const l = Math.hypot(dx, dy, dz) || 1;
    P.x[i] = o.pos.x + (R() - 0.5) * (o.jitter ?? 0.3); P.y[i] = o.pos.y; P.z[i] = o.pos.z + (R() - 0.5) * (o.jitter ?? 0.3);
    P.vx[i] = dx / l * sp; P.vy[i] = dy / l * sp; P.vz[i] = dz / l * sp;
    if (o.carry) { P.vx[i] += o.carry.x; P.vy[i] += o.carry.y; P.vz[i] += o.carry.z; }
    P.age[i] = 0; P.life[i] = lerp(pf.lifetimeRange[0], pf.lifetimeRange[1], R()) * (QO.lifeK ?? 1) * ((pf.qualityOverrides?.[Q]?.lifeK) ? 1 : 1);
    P.size[i] = lerp(pf.sizeRange[0], pf.sizeRange[1], R()) * (big ? 2.2 : 1) * (o.sizeK ?? 1);
    P.gy[i] = o.groundY ?? o.pos.y - 0.2; P.bnc[i] = Q === 'low' ? Math.min(0.3, pf.bounce) : pf.bounce; P.stk[i] = pf.stickChance; P.g[i] = 9.8 * pf.gravityScale;
    P.mesh[i] = pickMesh(pf); P.state[i] = 1; P.bl[i] = QO.maxBounces; P.roll[i] = QO.rolling ? 1 : 0; P.sq[i] = 1;
    const pal = pf.palette, c = resolve(pal[Math.floor(R() * pal.length)]); col.set(c).offsetHSL(0, 0, (R() - 0.5) * 0.08);
    P.cr[i] = col.r; P.cg[i] = col.g; P.cb[i] = col.b;
    vA.set(R() - 0.5, R() - 0.5, R() - 0.5).normalize(); P.ax[i] = vA.x; P.ay[i] = vA.y; P.az[i] = vA.z; P.spin[i] = (R() - 0.5) * 12; P.rot[i] = R() * 6.28;
    if (P.mesh[i] === 2) { vB.set(P.vx[i], P.vy[i], P.vz[i]).normalize(); qt.setFromUnitVectors(up, vB); } else qt.identity();
    P.qx[i] = qt.x; P.qy[i] = qt.y; P.qz[i] = qt.z; P.qw[i] = qt.w;
    stats.emitted++; return true;
  }

  // emit(event, biome, o) · o: { pos, dir, groundY, energy 0..1, count?, mix: { biome, w }, carry }
  function emit(event, biome, o) {
    if (Q === 'off') return 0;
    if (camera && camera.position.distanceTo(o.pos) > QO.cullDist) { stats.culled++; return 0; }
    const pf = byKey.get(biome + ':' + event); if (!pf) return 0;
    const pfB = o.mix && o.mix.w > 0.001 ? byKey.get(o.mix.biome + ':' + event) : null;
    let n = o.count ?? Math.round(lerp(pf.spawnMin, pf.spawnMax, clamp(o.energy ?? 0.5, 0, 1)) * (QO.spawnK ?? 1));
    let made = 0;
    for (let k = 0; k < n; k++) { const use = pfB && R() < o.mix.w ? pfB : pf; if (spawn(use, o, false)) made++; }
    if (pf.bigLumps && o.count === undefined) { const nb = Math.round(lerp(pf.bigLumps[0], pf.bigLumps[1], R()) * (Q === 'low' ? 0.5 : 1)); for (let k = 0; k < nb; k++) spawn(pf, { ...o, speedK: 0.5 }, true); }
    return made;
  }

  const m4 = new THREE.Matrix4(), qq = new THREE.Quaternion(), qs = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3(), ax = new THREE.Vector3();
  function update(dt) {
    const cnt = [0, 0, 0];
    for (const i of live) {
      P.age[i] += dt; const life = P.life[i];
      if (P.age[i] >= life) { live.delete(i); free.push(i); P.state[i] = 0; continue; }
      const st = P.state[i];
      if (st === 1) { P.vy[i] -= P.g[i] * dt; P.x[i] += P.vx[i] * dt; P.y[i] += P.vy[i] * dt; P.z[i] += P.vz[i] * dt; P.rot[i] += P.spin[i] * dt;
        const r = P.size[i] * 0.5;
        if (P.y[i] - r < P.gy[i] && P.vy[i] < 0) { P.y[i] = P.gy[i] + r;
          if (R() < P.stk[i]) { P.state[i] = 3; P.sq[i] = 0.5; }
          else if (P.bl[i] > 0 && P.bnc[i] > 0 && Math.abs(P.vy[i]) > 0.8) { P.vy[i] = -P.vy[i] * P.bnc[i]; P.vx[i] *= 0.62; P.vz[i] *= 0.62; P.bl[i]--; P.sq[i] = 0.7; }
          else if (P.roll[i]) { P.state[i] = 2; P.vy[i] = 0; } else { P.state[i] = 3; P.sq[i] = 0.62; } } }
      else if (st === 2) { const f = Math.max(0, 1 - 2.6 * dt); P.vx[i] *= f; P.vz[i] *= f; P.x[i] += P.vx[i] * dt; P.z[i] += P.vz[i] * dt; P.rot[i] += Math.hypot(P.vx[i], P.vz[i]) / Math.max(0.05, P.size[i]) * dt; }
      P.sq[i] = lerp(P.sq[i], st === 3 ? 0.5 : 1, 1 - Math.exp(-8 * dt));
      const tl = P.age[i] / life, shrink = tl > 0.7 ? 1 - (tl - 0.7) / 0.3 : Math.min(1, P.age[i] * 14), s = P.size[i] * Math.max(0.001, shrink), mk = P.mesh[i], mesh = meshes[KEYS[mk]], n = cnt[mk]++;
      qs.set(P.qx[i], P.qy[i], P.qz[i], P.qw[i]); ax.set(P.ax[i], P.ay[i], P.az[i]); qq.setFromAxisAngle(ax, P.rot[i]);
      if (mk === 2) qq.copy(qs).multiply(new THREE.Quaternion().setFromAxisAngle(up, P.rot[i] * 0.3));
      sc.set(s * (st === 3 ? 1.25 : 1), s * P.sq[i], s * (st === 3 ? 1.25 : 1)); ps.set(P.x[i], P.y[i] - (st === 3 ? s * 0.25 : 0), P.z[i]);
      m4.compose(ps, qq, sc); mesh.setMatrixAt(n, m4); col.setRGB(P.cr[i], P.cg[i], P.cb[i]); mesh.setColorAt(n, col);
    }
    let calls = 0; KEYS.forEach((k, j) => { const m = meshes[k]; m.count = cnt[j]; m.visible = cnt[j] > 0; if (cnt[j]) { calls++; m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; } });
    stats.alive = live.size; stats.peak = Math.max(stats.peak, live.size); stats.calls = calls;
  }
  function setQuality(q) { Q = q; stats.quality = q; if (q === 'off') { for (const i of live) { free.push(i); P.state[i] = 0; } live.clear(); KEYS.forEach(k => { meshes[k].count = 0; meshes[k].visible = false; }); return; }
    QO = PP.quality[q] || PP.quality.high; stats.peak = 0; }
  const dispose = () => { KEYS.forEach(k => { meshes[k].dispose(); geos[k].dispose(); root.remove(meshes[k]); }); mat.dispose(); };
  return { emit, update, setQuality, stats, get quality() { return Q; }, profiles: byKey, dispose, tris: KEYS.reduce((a, k) => a + (geos[k].index ? geos[k].index.count : geos[k].attributes.position.count) / 3, 0) };
}

// ---------- Ereignisse aus der Fahrt (Stellvertreter für den späteren Racer-Loop) ----------
export function makeKartDriver({ VFX, AT, at, ks, S, ds, pads, landS }) {
  const st = new Map(), mids = AT.vfxMids(), T = new THREE.Vector3(), Rv = new THREE.Vector3(), Uv = new THREE.Vector3(), pos = new THREE.Vector3(), dir = new THREE.Vector3(), carry = new THREE.Vector3();
  const idx = s => clamp(Math.round(s / ds), 0, S.length - 1);
  const rateOf = (pf, e) => lerp(pf.spawnMin, pf.spawnMax, e);
  return { events: { roll: 0, drift: 0, scrape: 0, landing: 0, boost: 0, biome: 0 },
    tick(karts, dt, running) { if (!running || VFX.quality === 'off') return;
      for (const k of karts) { let S0 = st.get(k); if (!S0) { S0 = { acc: 0, accD: 0, accB: 0, scr: 0, boost: 0, prev: k.s }; st.set(k, S0); }
        const s = k.s, a = at(s), i = idx(s), q = S[i]; if (s < S0.prev - 5) S0.prev = s;
        T.copy(a.T); Rv.copy(a.R); Uv.copy(a.U); const surf = (q.prm.surface ?? 1) > 0, e = clamp(k.v / 30, 0, 1), mix = AT.vfxBiome(s), bio = mix.w > 0.5 ? mix.b : mix.a, other = mix.w > 0.5 ? { biome: mix.a, w: 1 - mix.w } : { biome: mix.b, w: mix.w };
        carry.copy(T).multiplyScalar(k.v * 0.35);
        const gy = a.p.y, rear = sd => pos.copy(a.p).addScaledVector(Rv, k.lat + sd * 1.25).addScaledVector(T, -1.3).addScaledVector(Uv, 0.2);
        if (surf) {
          const pf = VFX.profiles.get(bio + ':roll'); S0.acc += (pf ? rateOf(pf, e) : 8) * dt * 0.7 * (k === karts[0] ? 1 : 0.5);   // wenige Krümel: 0,7 × Profilrate über beide Hinterräder
          while (S0.acc >= 1) { S0.acc -= 1; rear(S0.acc > 0.5 ? 1 : -1); dir.copy(T).multiplyScalar(-1).addScaledVector(Uv, 0.6); VFX.emit('roll', bio, { pos, dir, groundY: gy, count: 1, mix: other, carry, jitter: 0.4 }); this.events.roll++; }
          const kk = ks[i];
          if (Math.abs(kk) > 0.022) { const out = -Math.sign(kk), pd = VFX.profiles.get(bio + ':drift'); S0.accD += (pd ? rateOf(pd, e) : 20) * dt * (k === karts[0] ? 1 : 0.5);
            while (S0.accD >= 1) { S0.accD -= 1; rear(out); dir.copy(Rv).multiplyScalar(out).addScaledVector(T, -0.5).addScaledVector(Uv, 0.35); VFX.emit('drift', bio, { pos, dir, groundY: gy, count: 1, mix: other, carry, jitter: 0.5 }); this.events.drift++; }
            S0.scr -= dt; if (Math.abs(kk) > 0.03 && k.lat * out > 0 && S0.scr <= 0) { S0.scr = 0.5; const edge = out > 0 ? q.slots[7][0] : q.slots[6][0];
              pos.copy(a.p).addScaledVector(Rv, edge * 0.97).addScaledVector(Uv, 0.8); dir.copy(T).multiplyScalar(0.7).addScaledVector(Uv, 0.5).addScaledVector(Rv, -out * 0.25);
              VFX.emit('scrape', AT.barrierBiome(s, out), { pos, dir, groundY: gy, energy: e, carry }); this.events.scrape++; } }
        }
        for (const pd of pads) if (s >= pd.s0 - 1 && s <= pd.s1 + 1) S0.boost = 0.9;
        if (S0.boost > 0) { S0.boost -= dt; S0.accB += 34 * dt;
          while (S0.accB >= 1) { S0.accB -= 1; pos.copy(a.p).addScaledVector(Rv, k.lat).addScaledVector(T, -2.0).addScaledVector(Uv, 0.55); dir.copy(T).multiplyScalar(-1).addScaledVector(Uv, 0.08);
            VFX.emit('boost', bio, { pos, dir, groundY: gy, count: 1, carry: carry.clone().multiplyScalar(1.6), jitter: 0.08 }); this.events.boost++; } }
        if (S0.prev < landS && s >= landS) { pos.copy(a.p).addScaledVector(Rv, k.lat).addScaledVector(Uv, 0.2); dir.set(0, 1, 0);
          VFX.emit('landing', bio, { pos, dir, groundY: gy, energy: clamp(k.v / 26, 0.4, 1), mix: other }); this.events.landing++; }
        for (const m of mids) if (S0.prev < m && s >= m && surf) { const mm = AT.vfxBiome(m); pos.copy(a.p).addScaledVector(Rv, k.lat).addScaledVector(T, -1).addScaledVector(Uv, 0.3); dir.copy(T).multiplyScalar(-0.6).addScaledVector(Uv, 0.8);
          VFX.emit('biome', mm.a, { pos, dir, groundY: gy, energy: e, mix: { biome: mm.b, w: 0.5 }, carry }); this.events.biome++; }
        S0.prev = s; } } };
}

// ---------- Probenbrett: je Zelle ein Knet-Puck als Emitter-Stellvertreter ----------
export function makeBoardDriver({ VFX, cells, root, color = '#f2b632' }) {
  if (!cells.length) return { tick() {} };
  const g = new THREE.SphereGeometry(0.9, 18, 12); g.scale(1.3, 0.62, 1.7);
  const puck = new THREE.InstancedMesh(g, new THREE.MeshStandardMaterial({ color, roughness: 0.7 }), cells.length); puck.castShadow = true; puck.name = 'vfx-brett-pucks'; root.add(puck);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(1, 1, 1), p = new THREE.Vector3(), d = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), dir = new THREE.Vector3(), carry = new THREE.Vector3();
  const acc = cells.map(() => ({ a: 0, t: 0, prevY: 0, air: false }));
  return { puck, tick(dt, t) {
    cells.forEach((c, n) => { const A = acc[n], ph = t + n * 0.37; let yaw = 0, y = c.c.y + 0.55, speed = 10;
      if (c.event === 'drift') { const a = ph * 1.6; p.set(c.c.x + Math.cos(a) * 4.2, y, c.c.z + Math.sin(a) * 4.2); d.set(-Math.sin(a), 0, Math.cos(a)); speed = 6.7; }
      else if (c.event === 'landing') { const k = (ph % 2.2) / 2.2, hgt = Math.max(0, Math.sin(k * Math.PI)) * 5.5; p.set(c.c.x - 5 + k * 10, y + hgt, c.c.z); d.set(1, 0, 0); A.land = A.pk !== undefined && k < A.pk; A.pk = k; speed = 4.5; }
      else if (c.event === 'scrape') { const k = Math.sin(ph * 0.9); p.set(c.c.x - 3.8, y, c.c.z + k * 5.2); d.set(0, 0, Math.sign(Math.cos(ph * 0.9)) || 1); speed = 4.7; }
      else { const k = Math.sin(ph * 0.8); p.set(c.c.x, y, c.c.z + k * 5.8); d.set(0, 0, Math.sign(Math.cos(ph * 0.8)) || 1); speed = 4.6 * Math.abs(Math.cos(ph * 0.8)) + 1.5; }
      yaw = Math.atan2(d.x, d.z); q.setFromAxisAngle(up, yaw); m4.compose(p, q, sc); puck.setMatrixAt(n, m4);
      carry.copy(d).multiplyScalar(speed * 0.3); const gy = c.c.y;
      const rearP = () => p.clone().addScaledVector(d, -1.4).setY(gy + 0.2);
      A.a += dt; A.t -= dt;
      if (c.event === 'roll' && A.a > 0.06) { A.a = 0; dir.copy(d).multiplyScalar(-1).addScaledVector(up, 0.6); VFX.emit('roll', c.biome, { pos: rearP(), dir, groundY: gy, count: 1, carry }); }
      if (c.event === 'drift' && A.a > 0.03) { A.a = 0; const out = new THREE.Vector3(Math.cos(ph * 1.6), 0, Math.sin(ph * 1.6)); dir.copy(out).addScaledVector(d, -0.5).addScaledVector(up, 0.35); VFX.emit('drift', c.biome, { pos: rearP(), dir, groundY: gy, count: 1, carry }); }
      if (c.event === 'scrape' && A.t <= 0) { A.t = 0.55; dir.copy(d).multiplyScalar(0.7).addScaledVector(up, 0.5).add(new THREE.Vector3(0.25, 0, 0)); VFX.emit('scrape', c.biome, { pos: p.clone().setX(c.c.x - 4.6).setY(gy + 0.9), dir, groundY: gy, energy: 0.7, carry }); }
      if (c.event === 'landing' && A.land) VFX.emit('landing', c.biome, { pos: p.clone().setY(gy + 0.2), dir: up, groundY: gy, energy: 0.8 });
      if (c.event === 'boost' && A.a > 0.03 && Math.abs(p.z - c.c.z) < 4.5) { A.a = 0; dir.copy(d).multiplyScalar(-1).addScaledVector(up, 0.08); VFX.emit('boost', c.biome, { pos: p.clone().addScaledVector(d, -1.9).setY(gy + 0.6), dir, groundY: gy, count: 1, carry: carry.clone().multiplyScalar(1.6), jitter: 0.08 }); }
      if (c.event === 'biome' && A.a > 0.05) { A.a = 0; const wB = clamp((p.x - c.c.x + 1.5) / 3 + 0.5, 0, 1); dir.copy(d).multiplyScalar(-1).addScaledVector(up, 0.7);
        const k2 = Math.sin(ph * 0.8); p.set(c.c.x + k2 * 5.5, y, c.c.z); const w2 = clamp((p.x - c.c.x) / 3 + 0.5, 0, 1); VFX.emit('roll', c.biome, { pos: p.clone().setY(gy + 0.2), dir, groundY: gy, count: 1, mix: { biome: c.biomeB, w: w2 }, carry });
        if (Math.abs(p.x - c.c.x) < 0.25 && A.t <= 0) { A.t = 1.2; VFX.emit('biome', c.biome, { pos: p.clone().setY(gy + 0.3), dir: up, groundY: gy, energy: 0.6, mix: { biome: c.biomeB, w: 0.5 } }); }
        m4.compose(p, q.setFromAxisAngle(up, Math.PI / 2 * Math.sign(Math.cos(ph * 0.8))), sc); puck.setMatrixAt(n, m4); }
    });
    puck.instanceMatrix.needsUpdate = true; } };
}
