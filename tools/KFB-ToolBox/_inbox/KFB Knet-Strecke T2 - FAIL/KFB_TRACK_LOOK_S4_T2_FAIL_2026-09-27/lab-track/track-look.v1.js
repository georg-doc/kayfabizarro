/* KFB Knet-Strecke T1 · track-look v1 (27.09.) — S4 v2 Phase A, erster Schritt.
 * Liest den Track-Core-Stream (kfb.track-core.stream/0.3, core v0.8.1) und baut daraus die Knet-Strecke.
 * Nichts wird neu gelöst: Lage, Rahmen (T, U, R), Slots, Skin, Markierungen kommen aus dem Stream.
 * Neu gegenüber stream-to-three.mjs (Referenz, unverändert daneben):
 *   · Querschnitt je Fläche unterteilt: Kappe als Wulst, Kerb-Streifen (neue Rolle `kerb`) auf der Schulter, außerhalb road_L..road_R
 *   · Farbe je Rolle aus track-skins.v0.1.json statt Stream-`paint`, Fugen gestaffelt wie der Core (Kappe zuerst, Fahrbahn zuletzt)
 *   · Knet-Geometrie in Stream-Koordinaten (s, Querschnittspunkt, Seed): Beulen, Daumendellen, Absacken; Fahrbahn bleibt exakt
 *   · clay-material v8 je Rolle, Relief-Maßstab in Metern × Diorama-Faktor k
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { makeClayRelief } from '../lab-clay/clay-relief.v2.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry, makePrintTexture, PROFILES } from '../lab-clay/clay-material.v8.js';

const here = f => new URL(f, import.meta.url).href;
const ROLES = ['road', 'shoulder', 'kerb', 'barrier_side', 'barrier_cap', 'underside', 'marks'];
const ROLE_PROFILE = { road: 'road', shoulder: 'prop', kerb: 'prop', barrier_side: 'house', barrier_cap: 'prop', underside: 'terrainFg', marks: 'water' };
const ROLE_LABEL = { road: 'Fahrbahn', shoulder: 'Schulter', kerb: 'Kerb', barrier_side: 'Wand', barrier_cap: 'Kappe', underside: 'Unterseite', marks: 'Markierung' };

const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const vnoise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i) * (1 - u) + hash(i + 1) * u; };
const lump = (s, key) => 0.65 * vnoise(s / 14 + key * 17.31) + 0.35 * vnoise(s / 5.5 + key * 5.13) - 0.5;
const hex = h => new THREE.Color(h);
const lumL = c => { const lin = v => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); const k = hex(c); // sRGB-Hex → L*
  const Y = 0.2126 * lin(k.r) + 0.7152 * lin(k.g) + 0.0722 * lin(k.b); return Y > 0.008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y; };

export async function boot(canvas, onNote = () => {}) {
  const info = { fps: 0, tris: 0, errors: [], samples: 0, option: 'A', centreErr: 0, lum: {}, minBarrierT: 0 };
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#96bede');
  const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.3, 4000);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.maxDistance = 1400; controls.minDistance = 2;

  onNote('Strecke wird geladen …');
  const [stream, SK] = await Promise.all([
    fetch(here('data/td03.stream.json')).then(r => r.json()),
    fetch(here('track-skins.v0.1.json')).then(r => r.json())
  ]);
  const S = stream.samples; info.samples = S.length;
  info.minBarrierT = Math.min(...S.map(q => q.prm.barrierT));

  onNote('Knete wird angerührt …');
  await new Promise(r => setTimeout(r, 30));
  const rel = makeClayRelief({ size: 1024, seed: 31 });
  const tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true; tex.anisotropy = renderer.capabilities.getMaxAnisotropy(); tex.needsUpdate = true;
  const U = makeClayUniforms(THREE, tex);
  U.uClayMottle.value = 0.04;
  try { U.uClayPrint.value = await makePrintTexture(THREE, here('../ref/clay-joebinns/Fingerprints01_3K.png'), 2048); U.uClayPrintOn.value = 1; }
  catch (e) { info.errors.push('Fingerabdrücke: ' + e.message); U.uClayPrint.value = tex; }

  // Licht wie H0: warmweiße Sonne, neutraler Himmel, Gegenlicht für Unterseiten
  const box = new THREE.Box3(); S.forEach(q => box.expandByPoint(new THREE.Vector3(...q.p)));
  const ctr = box.getCenter(new THREE.Vector3()), ext = box.getSize(new THREE.Vector3());
  const sun = new THREE.DirectionalLight('#fff4e6', 2.8); sun.castShadow = true;
  sun.position.copy(ctr).add(new THREE.Vector3(-160, 320, 190)); sun.target.position.copy(ctr);
  sun.shadow.mapSize.set(4096, 4096);
  const half = Math.max(ext.x, ext.z) * 0.62;
  Object.assign(sun.shadow.camera, { left: -half, right: half, top: half, bottom: -half, near: 20, far: 900 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.25;
  scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight('#eef4fa', '#9a8a78', 1.0));
  const fill = new THREE.DirectionalLight('#ffe6d6', 0.55); fill.position.copy(ctr).add(new THREE.Vector3(180, 60, -200)); scene.add(fill);

  // ---------- Zustand ----------
  const st = { option: 'A', strength: null, k: 3, joints: false, table: true, cam: 'totale', run: true, speed: 25, rideS: 560, shot: null, ao: true };
  const mats = {};
  const profileFor = (role, skinRole, k) => {
    const p = { ...PROFILES[ROLE_PROFILE[role]] };
    p.scale = (skinRole?.scale ?? p.scale) * k; p.gougeSize *= k; p.crackSize *= k; p.dentSize *= k;
    return p;
  };
  const trackGroup = new THREE.Group(); scene.add(trackGroup);
  const jointGroup = new THREE.Group(); jointGroup.visible = false; scene.add(jointGroup);

  // ---------- Farbe je Rolle, gestaffelt über die Skin-Fugen ----------
  const changes = []; for (let i = 1; i < S.length; i++) if (S[i].skin !== S[i - 1].skin) changes.push({ s: S[i].s, from: S[i - 1].skin, to: S[i].skin });
  const skin0 = S[0].skin;
  const colOf = (O, skin, role, s) => {
    const r = O.skins[skin]?.[role] ?? O.skins.track[role];
    let c = r.c;
    if (Array.isArray(c)) { const L = role === 'barrier_side' ? (O.blocks?.len ?? 4) : (O.stripeLen || 3); c = c[Math.floor(s / L) % 2]; }
    return c;
  };
  const tmpA = new THREE.Color(), tmpB = new THREE.Color();
  const colourAt = (O, role, s, out) => {
    const z = SK.stagger[role] ?? SK.stagger.road;
    out.set(colOf(O, skin0, role, s));
    for (const ch of changes) { const t = sstep(ch.s + z[0], ch.s + z[1], s); if (t > 0) { tmpB.set(colOf(O, ch.to, role, s)); out.lerp(tmpB, t); } }
    return out;
  };
  const weightAt = (O, s, f) => { // Skin-Gewicht für Geometrie (Kerbhöhe), gestaffelt wie `kerb`
    const z = SK.stagger.kerb; let w = f(skin0);
    for (const ch of changes) { const t = sstep(ch.s + z[0], ch.s + z[1], s); w += (f(ch.to) - w) * t; }
    return w;
  };

  // ---------- Querschnitt ----------
  // Ringfolge wie der Core: under_L → Wand außen L → Kappe L → Wand innen L → Fuge L → Schulter L → Fahrbahn → … → under_R → Unterseite
  const lerp2 = (A, B, t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
  const section = (q, O, G, idx) => {
    const sl = q.slots, s = q.s, cy = -q.prm.deckDepth / 2;
    const nrm = (A, B) => { let n = [-(B[1] - A[1]), B[0] - A[0]]; const l = Math.hypot(n[0], n[1]) || 1; n = [n[0] / l, n[1] / l];
      const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; if (n[0] * m[0] + n[1] * (m[1] - cy) < 0) n = [-n[0], -n[1]]; return n; };
    const strips = [];
    const push = (role, pts, key) => strips.push({ role, pts, key });
    // Wandfläche mit Beulen (Amplitude amp × Stärke), Enden fest
    const wall = (role, chain, n, amp, key) => {
      const pts = [];
      for (let c = 0; c < chain.length - 1; c++) {
        const A = sl[chain[c]], B = sl[chain[c + 1]], N = nrm(A, B);
        for (let j = 0; j <= n; j++) {
          if (c > 0 && j === 0) continue;
          const t = j / n, P = lerp2(A, B, t);
          const g = chain.length === 2 ? Math.sin(Math.PI * t) : (c === 0 ? Math.sin(Math.PI * t * 0.5) : Math.cos(Math.PI * t * 0.5));
          let d = amp * G * lump(s, key + c * 3.7 + t * 1.3) * (0.35 + 0.65 * g);
          if (O.blocks && O.blocks.skins.includes(q.skin) && role === 'barrier_side') { const u = (s % O.blocks.len) / O.blocks.len; d -= O.blocks.groove * (1 - sstep(0, 0.04, Math.min(u, 1 - u))); }
          pts.push([P[0] + N[0] * d, P[1] + N[1] * d]);
        }
      }
      push(role, pts, key);
    };
    // Kappe als Wulst zwischen out_top und in_top (oder umgekehrt)
    const cap = (a, b, key) => {
      const A = sl[a], B = sl[b], N = nrm(A, B), W = Math.hypot(B[0] - A[0], B[1] - A[1]);
      const cell = Math.floor(s / 7), dc = hash(cell * 3.1 + key) > 0.5 ? cell * 7 + hash(cell * 7.7 + key) * 7 : -1e9;
      const dent = 0.08 * G * Math.exp(-((s - dc) ** 2) / 0.25 ** 2 / 4);
      const h = Math.min(0.3, 0.3 * W) * O.capRound * (1 - 0.35 * G * (0.5 + lump(s, key + 9)));
      const pts = []; const n = 8;
      for (let j = 0; j <= n; j++) { const t = j / n, P = lerp2(A, B, t), e = Math.pow(Math.sin(Math.PI * t), 0.6), bump = h * e - dent * Math.sin(Math.PI * t);
        pts.push([P[0] + N[0] * bump, P[1] + N[1] * bump]); }
      push('barrier_cap', pts, key);
    };
    // Schulter mit Kerb: `edge` = road-Slot, `foot` = Schulter-Slot
    const kerbW = O.kerb.w, kerbH = O.kerb.h * weightAt(O, s, sk => O.kerb.on[sk] ?? 0);
    const shoulder = (foot, edge, leftSide) => {
      const F = sl[foot], E = sl[edge], L = Math.hypot(E[0] - F[0], E[1] - F[1]), kw = Math.min(kerbW, 0.8 * L), tk = 1 - kw / L;
      const N = nrm(F, E), K = lerp2(F, E, tk);
      const prof = u => O.kerb.shape === 'flat' ? sstep(0, 0.18, u) * sstep(1, 0.82, u) : O.kerb.shape === 'sausage' ? Math.sqrt(Math.max(0, Math.sin(Math.PI * u))) : Math.pow(Math.sin(Math.PI * u), 0.8);
      const kp = []; const n = 7;
      for (let j = 0; j <= n; j++) { const u = j / n, P = lerp2(K, E, u), hh = kerbH * prof(u); kp.push([P[0] + N[0] * hh, P[1] + N[1] * hh]); }
      if (leftSide) { push('shoulder', [F, K], 20); push('kerb', kp, 21); }
      else { kp.reverse(); push('kerb', kp, 22); push('shoulder', [K, F], 23); }
    };
    wall('barrier_side', [0, 1, 2], 3, 0.35, 1);
    cap(2, 3, 2);
    wall('barrier_side', [3, 4], 2, 0.12, 3);
    push('shoulder', [sl[4], sl[5]], 4);
    shoulder(5, 6, true);
    push('road', [sl[6], sl[7]], 6);
    shoulder(8, 7, false);
    push('shoulder', [sl[8], sl[9]], 8);
    wall('barrier_side', [9, 10], 2, 0.12, 9);
    cap(10, 11, 10);
    wall('barrier_side', [11, 12, 13], 3, 0.35, 11);
    { const A = sl[13], B = sl[0], N = nrm(A, B), pts = []; const n = 6;
      for (let j = 0; j <= n; j++) { const t = j / n, P = lerp2(A, B, t), d = 0.3 * G * lump(s, 13 + t * 2.1) * Math.sin(Math.PI * t); pts.push([P[0] + N[0] * d, P[1] + N[1] * d]); }
      push('underside', pts, 13); }
    return strips;
  };

  const drawn = a => !(S[a].prm.surface < 0.5 || S[a + 1].prm.surface < 0.5 || S[a + 1].brk);
  const W3 = (q, l, h) => [q.p[0] + q.R[0] * l + q.U[0] * h, q.p[1] + q.R[1] * l + q.U[1] * h, q.p[2] + q.R[2] * l + q.U[2] * h];

  const build = () => {
    const t0 = performance.now();
    const O = SK.options[st.option], G = st.strength ?? O.geo;
    trackGroup.children.forEach(m => m.geometry.dispose()); trackGroup.clear();
    const acc = Object.fromEntries(ROLES.map(r => [r, { pos: [], col: [], idx: [] }]));
    const seg = S.map((_, a) => a < S.length - 1 && drawn(a));
    const need = S.map((_, k) => seg[k] || (k > 0 && seg[k - 1]));
    const secs = S.map((q, k) => need[k] ? section(q, O, G, k) : null);
    const nStrips = secs.find(Boolean).length;
    const c = new THREE.Color();
    for (let j = 0; j < nStrips; j++) {
      const base = new Int32Array(S.length).fill(-1);
      for (let k = 0; k < S.length; k++) {
        if (!need[k]) continue;
        const q = S[k], sp = secs[k][j], A = acc[sp.role];
        base[k] = A.pos.length / 3;
        colourAt(O, sp.role, q.s, c);
        for (const [l, h] of sp.pts) { A.pos.push(...W3(q, l, h)); A.col.push(c.r, c.g, c.b); }
      }
      for (let k = 0; k < S.length - 1; k++) {
        if (!seg[k]) continue;
        const A = acc[secs[k][j].role], a = base[k], b = base[k + 1], n = secs[k][j].pts.length;
        for (let i = 0; i < n - 1; i++) A.idx.push(a + i, a + i + 1, b + i + 1, a + i, b + i + 1, b + i);
      }
    }
    // Stirnflächen an offenen Enden (Lippe, Landung, Start, Ziel)
    for (let k = 0; k < S.length; k++) {
      if (!need[k] || (seg[k] && k > 0 && seg[k - 1])) continue;
      const q = S[k], ring = secs[k].flatMap(sp => sp.pts), A = acc.underside, b = A.pos.length / 3;
      colourAt(O, 'underside', q.s, c);
      const m = ring.reduce((a, p) => [a[0] + p[0] / ring.length, a[1] + p[1] / ring.length], [0, 0]);
      A.pos.push(...W3(q, m[0], m[1])); A.col.push(c.r, c.g, c.b);
      for (const [l, h] of ring) { A.pos.push(...W3(q, l, h)); A.col.push(c.r, c.g, c.b); }
      for (let i = 1; i < ring.length; i++) A.idx.push(b, b + i, b + i + 1);
    }
    // Markierungen: flache Knetwülste 2 cm über der Fahrbahn
    { const A = acc.marks, sArr = S.map(q => q.s);
      const lo = x => { let a = 0, b = sArr.length; while (a < b) { const m = (a + b) >> 1; if (sArr[m] < x) a = m + 1; else b = m; } return a; };
      for (const bd of stream.markings) {
        const ids = []; for (let i = Math.max(0, lo(bd.s0) - 1); i < S.length && S[i].s <= bd.s1 + 1e-6; i++) if (S[i].s >= bd.s0 - 1e-6 && S[i].prm.surface >= 0.5) ids.push(i);
        if (ids.length < 2) continue;
        const mc = (O.marks[bd.style] ?? O.marks.TRACK)[bd.at] ?? '#ffffff';
        const b0 = A.pos.length / 3;
        for (const i of ids) {
          const q = S[i], halfW = q.prm.width / 2, lat = bd.at === 'edges' ? q.prm.offset + bd.side * (halfW - bd.inset) : q.prm.offset;
          const w = bd.at === 'bars' ? q.prm.width * bd.span : bd.w;
          c.set(mc);
          for (const [d, h] of [[-w / 2, 0.02], [0, 0.02 + Math.min(0.03, w * 0.12)], [w / 2, 0.02]]) { A.pos.push(...W3(q, lat + d, h)); A.col.push(c.r, c.g, c.b); }
        }
        for (let k = 0; k < ids.length - 1; k++) { if (ids[k + 1] !== ids[k] + 1) continue; const a = b0 + 3 * k, b = a + 3;
          for (let i = 0; i < 2; i++) A.idx.push(a + i, a + i + 1, b + i + 1, a + i, b + i + 1, b + i); }
      }
    }
    let tris = 0;
    for (const r of ROLES) {
      const A = acc[r]; if (!A.idx.length) continue;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(A.pos, 3));
      g.setAttribute('color', new THREE.Float32BufferAttribute(A.col, 3));   // THREE.Color hält linear → passt zu Vertexfarben
      g.setIndex(A.idx); g.computeVertexNormals(); seedGeometry(THREE, g, ROLES.indexOf(r) + 1);
      const skinRole = O.skins.track[r];
      const clayRole = r === 'marks' ? (st.option === 'C' ? 'knetbar' : 'world') : (skinRole?.clay ?? 'world');
      const key = r + clayRole;
      if (!mats[key]) mats[key] = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ vertexColors: true, side: r === 'underside' ? THREE.DoubleSide : THREE.FrontSide }), role: clayRole, profile: profileFor(r, skinRole, st.k) });
      else mats[key].userData.clay.setProfile(profileFor(r, skinRole, st.k));
      const m = new THREE.Mesh(g, mats[key]); m.castShadow = r !== 'marks'; m.receiveShadow = true; m.name = r; trackGroup.add(m);
      tris += A.idx.length / 3;
    }
    info.tris = tris + 4000; info.option = st.option; info.buildMs = Math.round(performance.now() - t0);
    // Mittellinie gegen p: Fahrbahnmitte aus den gebauten Punkten
    let e = 0; for (let k = 0; k < S.length; k += 25) if (secs[k]) { const r = secs[k].find(sp => sp.role === 'road').pts, m = W3(S[k], (r[0][0] + r[1][0]) / 2, (r[0][1] + r[1][1]) / 2), q = S[k];
      const off = q.prm.offset; const d = Math.hypot(m[0] - (q.p[0] + q.R[0] * off), m[1] - (q.p[1] + q.R[1] * off), m[2] - (q.p[2] + q.R[2] * off)); e = Math.max(e, d); }
    info.centreErr = e;
    // Grauwert je Rolle (L*) für Straße, Bahn, Magnet
    info.lum = {}; for (const sk of ['street', 'track', 'mag']) { const R = O.skins[sk], f = x => lumL(Array.isArray(x.c) ? x.c[0] : x.c), g2 = x => Array.isArray(x.c) ? lumL(x.c[1]) : null;
      info.lum[sk] = { road: f(R.road), shoulder: f(R.shoulder), kerb: f(R.kerb), kerb2: g2(R.kerb), side: f(R.barrier_side), cap: f(R.barrier_cap), mark: lumL((O.marks[sk.toUpperCase()] ?? {}).bars ?? (O.marks[sk.toUpperCase()] ?? {}).edges ?? '#ffffff') }; }
    groundMat && groundMat.color.set(O.ground);
  };

  // ---------- Knet-Tisch ----------
  let groundMat = null;
  { const w = ext.x + 260, d = ext.z + 260, r = 60, sh = new THREE.Shape();
    sh.moveTo(-w / 2 + r, -d / 2); sh.lineTo(w / 2 - r, -d / 2); sh.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r); sh.lineTo(w / 2, d / 2 - r);
    sh.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2); sh.lineTo(-w / 2 + r, d / 2); sh.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r); sh.lineTo(-w / 2, -d / 2 + r); sh.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 6, bevelEnabled: true, bevelThickness: 3, bevelSize: 5, bevelSegments: 5, curveSegments: 24 });
    g.rotateX(-Math.PI / 2); g.translate(ctr.x, -0.6 - 9, ctr.z); seedGeometry(THREE, g, 77);
    const p = { ...PROFILES.terrainBg }; p.scale *= 3; p.dentSize *= 3; p.gougeSize *= 3;
    groundMat = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#a7b48c' }), role: 'world', profile: p });
    const table = new THREE.Mesh(g, groundMat); table.receiveShadow = true; table.name = 'tisch'; scene.add(table);
    st.tableMesh = table; }

  // ---------- Fugen (Beweis-Ansicht): Querschnitt aus den 14 Slots an jeder Stück-Fuge ----------
  for (const J of stream.joints) {
    const q = S[Math.min(J.index, S.length - 1)], pts = q.slots.map(([l, h]) => new THREE.Vector3(...W3(q, l, h)));
    const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: '#ff2d55', depthTest: false }));
    line.renderOrder = 10; jointGroup.add(line);
    const ax = new THREE.ArrowHelper(new THREE.Vector3(...q.T), new THREE.Vector3(...q.p).addScaledVector(new THREE.Vector3(...q.U), 0.1), 6, 0xff2d55, 1.6, 1);
    ax.line.material.depthTest = false; ax.cone.material.depthTest = false; ax.renderOrder = 10; jointGroup.add(ax);
  }

  // ---------- Kameras und Bilder aus der Shotliste ----------
  const V = a => new THREE.Vector3(...a);
  const sampleAt = s => { const x = Math.max(0, Math.min(S.length - 1.001, s / stream.ds)), i = Math.floor(x), f = x - i, a = S[i], b = S[i + 1];
    const l = (u, v) => V(u).lerp(V(v), f); return { p: l(a.p, b.p), T: l(a.T, b.T).normalize(), U: l(a.U, b.U).normalize(), R: l(a.R, b.R).normalize(), q: a }; };
  const avgP = (i0, i1) => { const v = new THREE.Vector3(); for (let i = i0; i <= i1; i++) v.add(V(S[i].p)); return v.multiplyScalar(1 / (i1 - i0 + 1)); };
  const jointIdx = name => stream.joints.find(j => j.piece === name)?.index ?? 0;
  const iLoop0 = jointIdx('roof_loop'), iLoop1 = jointIdx('loop_out'), loopC = avgP(iLoop0, iLoop1);
  const iRing0 = jointIdx('drift_ring'), iRing1 = jointIdx('to_orange'), ringC = avgP(iRing0, iRing1);
  const iHp0 = jointIdx('plaza_hairpin'), iHp1 = jointIdx('east_run'), hpC = avgP(iHp0, iHp1);
  const iKick = jointIdx('kicker'), iAir = jointIdx('air'), iLand = jointIdx('landing');
  const orbit = (pos, tgt) => ({ kind: 'orbit', pos, tgt });
  const at = (i, lat, lift, back) => { const q = S[i]; return V(q.p).addScaledVector(V(q.R), lat).addScaledVector(V(q.U), lift).addScaledVector(V(q.T), -back); };
  const SHOTS = {
    totale: orbit(new THREE.Vector3(-150, 260, -420), new THREE.Vector3(110, 0, -20)),
    nah: orbit(at(1300, 4.6, 1.5, 7), at(1300, 9.6, 0.8, -12)),                            // b12: Wand, Kappe, Schulter in Fahrerhöhe
    b02: orbit(at(1211, -22, 16, 40), at(1211, 0, 0, -12)),                                 // Fuge Straße → Bahn
    b03: { kind: 'ride', s: 944 },                                                            // Magnet-Einlauf, Pfeilspitzen
    b04: orbit(loopC.clone().addScaledVector(V(S[iLoop0].R), 70).add(new THREE.Vector3(0, 6, 0)), loopC),
    b05: { kind: 'ride', s: 968 },
    b06: orbit(ringC.clone().add(new THREE.Vector3(-40, 70, -60)), ringC),
    b09: orbit(avgP(iKick, iLand).addScaledVector(V(S[iAir].R), 55).add(new THREE.Vector3(0, 10, 0)), avgP(iKick, iLand)),
    b10: orbit(hpC.clone().add(new THREE.Vector3(30, 38, 30)), hpC)
  };
  info.shots = Object.keys(SHOTS);
  const applyShot = name => {
    const sh = SHOTS[name]; if (!sh) return; st.shot = name;
    if (sh.kind === 'ride') { st.cam = 'fahrt'; st.rideS = sh.s; st.run = false; controls.enabled = false; camera.fov = 66; }
    else { st.cam = name === 'totale' ? 'totale' : 'nah'; controls.enabled = true; camera.fov = 40; camera.up.set(0, 1, 0); camera.position.copy(sh.pos); controls.target.copy(sh.tgt); controls.update(); }
    camera.updateProjectionMatrix();
  };
  const ride = s => {
    const a = sampleAt(s), b = sampleAt(s + 24);
    camera.position.copy(a.p).addScaledVector(a.U, 1.35);
    camera.up.copy(a.U); camera.lookAt(b.p.clone().addScaledVector(b.U, 1.0));
  };

  // ---------- Nachbearbeitung ----------
  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  let aoPass = null;
  try {
    const { GTAOPass } = await import('three/addons/postprocessing/GTAOPass.js');
    aoPass = new GTAOPass(scene, camera, 2, 2);
    aoPass.updateGtaoMaterial({ radius: 1.6, distanceExponent: 1.4, thickness: 2.0, scale: 1.0, samples: 16 });
    aoPass.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
    aoPass.blendIntensity = 0.8; composer.addPass(aoPass);
  } catch (e) { info.errors.push('AO: ' + e.message); }
  composer.addPass(new OutputPass());
  const resize = () => { const w = canvas.clientWidth || 800, h = canvas.clientHeight || 450; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  const setK = k => { st.k = k; U.uClayHand.value = 0.5 * k; U.uClayTile.value = 1.6 * k; U.uClayPrintTile.value = 4.5 * k; U.uClayFacetSize.value = 0.65 * k;
    const O = SK.options[st.option]; for (const [key, m] of Object.entries(mats)) { const r = ROLES.find(x => key.startsWith(x)); m.userData.clay.setProfile(profileFor(r, O.skins.track[r], k)); } };
  onNote('Strecke wird geknetet …');
  setK(3); build(); applyShot('totale');

  let raf = 0, last = performance.now(), frames = 0, fpsT = last;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (st.cam === 'fahrt') { if (st.run) { st.rideS += st.speed * dt; const L = S[S.length - 1].s - 30; if (st.rideS > L) st.rideS = 0; } ride(st.rideS); }
    else controls.update();
    composer.render();
    frames++; if (now - fpsT > 1000) { info.fps = Math.round(frames * 1000 / (now - fpsT)); frames = 0; fpsT = now; }
    info.rideS = st.rideS;
  };
  loop();

  return {
    info, SHOTS: Object.keys(SHOTS), OPTIONS: SK.options, ROLE_LABEL, skins: SK,
    shot: applyShot,
    set(k, v) {
      if (k === 'option') { st.option = v; st.strength = null; build(); }
      else if (k === 'strength') { st.strength = v; build(); }
      else if (k === 'k') setK(v);
      else if (k === 'cam') { if (v === 'fahrt') { st.cam = 'fahrt'; st.run = true; controls.enabled = false; camera.fov = 66; camera.updateProjectionMatrix(); } else applyShot(v); }
      else if (k === 'run') st.run = v;
      else if (k === 'speed') st.speed = v;
      else if (k === 'rideS') { st.rideS = v; if (st.cam !== 'fahrt') this.set('cam', 'fahrt'); st.run = false; }
      else if (k === 'joints') jointGroup.visible = v;
      else if (k === 'table') st.tableMesh.visible = v;
      else if (k === 'grey') canvas.style.filter = v ? 'grayscale(1)' : '';
      else if (k === 'ao') { if (aoPass) aoPass.enabled = v; }
      else if (k === 'stroke') U.uClayStroke.value = v;
      else if (k === 'print') U.uClayPrintK.value = v;
      else if (k === 'relief') U.uClayOn.value = v ? 1 : 0;
    },
    strengthOf: () => st.strength ?? SK.options[st.option].geo,
    length: S[S.length - 1].s,
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); }
  };
}
