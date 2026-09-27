/* KFB Knet-Strecke T2 · track-look v2 (27.09.) — Produktionsrichtung AB (Hirnwelt-Material + Race-Semantik).
 * Szenen: TD03 (Übergänge Straße↔Renn, Renn↔Kies/Sand, Straße↔Kicker), TN02 (Gotthard-Portal, echte Röhre aus dem Stream),
 * Kanten-Atlas (Profil aus prm, Zustände als Vorschlag) mit Knetstärke-Vergleich. Bausteine: track-kit.v2.js. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { makeClayRelief } from '../lab-clay/clay-relief.v2.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry, makePrintTexture, PROFILES } from '../lab-clay/clay-material.v8.js';
import { sstep, W3, profileSlots, makePatchMaterial, makeStates, kerbSpec, buildRoute, accToGeom, flatState, profileFor, ROLES, buildMountainTunnel, raceZones } from './track-kit.v2.js?r=20';

const here = f => new URL(f, import.meta.url).href;
const V = a => new THREE.Vector3(...a);

export async function boot(canvas, onNote = () => {}) {
  const info = { fps: 0, tris: 0, errors: [], scene: 'td03', buildMs: 0, env: null, slotErr: null, events: 0, kickerCap: null, centreErr: 0 };
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#96bede');
  const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.3, 4000);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.maxDistance = 1600; controls.minDistance = 1.5;

  onNote('Strecken werden geladen …');
  const v = '?r=21';
  const [td03, SK] = await Promise.all([fetch(here('data/td03.stream.json')).then(r => r.json()), fetch(here('track-skins.v0.1.json' + v)).then(r => r.json())]);

  onNote('Knete wird angerührt …');
  await new Promise(r => setTimeout(r, 30));
  const rel = makeClayRelief({ size: 1024, seed: 31 });
  const tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true; tex.needsUpdate = true;
  const U = makeClayUniforms(THREE, tex); U.uClayMottle.value = 0.04;
  try { U.uClayPrint.value = await makePrintTexture(THREE, here('../ref/clay-joebinns/Fingerprints01_3K.png'), 2048); U.uClayPrintOn.value = 1; }
  catch (e) { info.errors.push('Fingerabdrücke: ' + e.message); U.uClayPrint.value = tex; }
  const PU = { uPatchDebug: { value: 0 }, uPatchRim: { value: SK.patch.rim } };

  const sun = new THREE.DirectionalLight('#fff4e6', 2.8); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.25; scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight('#eef4fa', '#9a8a78', 1.0));
  const fill = new THREE.DirectionalLight('#ffe6d6', 0.55); scene.add(fill);

  const st = { scene: 'td03', option: SK.production, strength: null, k: 3, cam: 'uebersicht', run: true, speed: 25, rideS: 560, seam: false };
  const mats = {};
  const matFor = (role, clayRole, scale, side) => {
    const key = role + ':' + clayRole + ':' + (side || '');
    if (!mats[key]) mats[key] = makePatchMaterial(THREE, U, PU, { role: clayRole, profile: profileFor(role, scale, st.k, SK.clayDetail), cell: SK.patch.cell[role] ?? 1, side });
    mats[key].userData.kfb = { role, scale }; return mats[key];
  };
  const O = () => SK.options[st.option];
  const G = () => st.strength ?? O().geo;

  const addAcc = (group, acc, stats) => {
    for (const r of ROLES) { const A = acc[r]; if (!A || !A.idx.length) continue;
      const sr = O().skins.track[r], clay = r === 'marks' ? 'world' : (sr?.clay ?? 'world');
      const m = new THREE.Mesh(accToGeom(THREE, A, ROLES.indexOf(r) + 1), matFor(r, clay, sr?.scale, r === 'underside' ? THREE.DoubleSide : null));
      m.castShadow = r !== 'marks'; m.receiveShadow = true; m.name = r; group.add(m); stats.tris += A.idx.length / 3; }
  };
  const table = (ctr, ext, color) => {
    const w = ext.x + 260, d = ext.z + 260, r = 60, sh = new THREE.Shape();
    sh.moveTo(-w / 2 + r, -d / 2); sh.lineTo(w / 2 - r, -d / 2); sh.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r); sh.lineTo(w / 2, d / 2 - r);
    sh.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2); sh.lineTo(-w / 2 + r, d / 2); sh.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r); sh.lineTo(-w / 2, -d / 2 + r); sh.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 6, bevelEnabled: true, bevelThickness: 3, bevelSize: 5, bevelSegments: 5, curveSegments: 24 });
    g.rotateX(-Math.PI / 2); g.translate(ctr.x, -0.6 - 9, ctr.z); seedGeometry(THREE, g, 77);
    const p = { ...PROFILES.terrainBg, ...(SK.clayDetail?.table || {}) }; p.scale *= 3; p.gougeSize *= 3;
    const m = new THREE.Mesh(g, makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color }), role: 'world', profile: p })); m.receiveShadow = true; return m;
  };
  const jointsOf = route => { const g = new THREE.Group(), S = route.samples;
    for (const J of route.joints || []) { const q = S[Math.min(J.index, S.length - 1)], pts = q.slots.map(([l, h]) => V(W3(q, l, h)));
      const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: '#ff2d55', depthTest: false })); line.renderOrder = 10; g.add(line);
      const ax = new THREE.ArrowHelper(V(q.T), V(q.p).addScaledVector(V(q.U), 0.1), 6, 0xff2d55, 1.6, 1); ax.line.material.depthTest = false; ax.cone.material.depthTest = false; ax.renderOrder = 10; g.add(ax); }
    g.visible = st.seam; return g; };

  // Kameras je Route
  const cams = route => {
    const S = route.samples, ds = route.ds;
    const at = s => { const x = Math.max(0, Math.min(S.length - 1.001, s / ds)), i = Math.floor(x), f = x - i, a = S[i], b = S[i + 1];
      const l = (u, w) => V(u).lerp(V(w), f); return { p: l(a.p, b.p), T: l(a.T, b.T).normalize(), U: l(a.U, b.U).normalize(), R: l(a.R, b.R).normalize() }; };
    const chase = s => { const a = at(s - 12), b = at(s + 12); return { kind: 'orbit', pos: a.p.clone().addScaledVector(a.U, 3.4).addScaledVector(a.R, -1.5), tgt: b.p.clone().addScaledVector(b.U, 0.6) }; };
    const top = s => { const a = at(s); return { kind: 'orbit', pos: a.p.clone().addScaledVector(a.U, 36).addScaledVector(a.T, -0.5), tgt: a.p.clone(), up: a.T.clone() }; };
    const near = (s, lat, lift, back, lat2, lift2, fwd) => { const a = at(s - back), b = at(s + fwd); return { kind: 'orbit', pos: a.p.clone().addScaledVector(a.R, lat).addScaledVector(a.U, lift), tgt: b.p.clone().addScaledVector(b.R, lat2).addScaledVector(b.U, lift2) }; };
    return { at, chase, top, near };
  };

  // ---------- Szene TD03 ----------
  const scenes = {};
  const buildTD03 = () => {
    const S = td03.samples, t0 = performance.now(), grp = new THREE.Group(), stats = { tris: 0 };
    const jIdx = n => td03.joints.find(j => j.piece === n)?.index ?? 0;
    const turnSide = (i0, i1) => { let d = 0; for (let i = i0; i < i1 - 10; i += 5) { const a = S[i], b = S[i + 10]; d += (b.T[0] - a.T[0]) * a.R[0] + (b.T[1] - a.T[1]) * a.R[1] + (b.T[2] - a.T[2]) * a.R[2]; } return d < 0 ? 'L' : 'R'; };
    const hp0 = jIdx('plaza_hairpin'), hp1 = jIdx('east_run'), dr0 = jIdx('drift_ring'), dr1 = jIdx('to_orange');
    const inner = turnSide(hp0, hp1), outer = turnSide(dr0, dr1) === 'L' ? 'R' : 'L';
    const zones = [{ s0: S[hp0].s + 6, s1: S[hp1].s - 6, side: inner, surface: 'gravel', label: 'Kiesbett Kehre innen' },
                   { s0: S[dr0].s + 30, s1: S[dr1].s - 30, side: outer, surface: 'sand', label: 'Sandbett Driftring außen' }];
    const rz = raceZones(td03, O()); info.raceZones = { kerb: rz.filter(z => z.kind === 'kerb').length, hazard: rz.filter(z => z.kind === 'hazard').length };
    const kerbZ = rz.filter(z => z.kind === 'kerb'), hazZ = rz.filter(z => z.kind === 'hazard');
    const allZones = [...zones, ...kerbZ];
    const states = makeStates(THREE, td03, O(), SK, allZones);
    const acc = buildRoute(THREE, td03, O(), { G: G(), states, kerb: kerbSpec(O()) });
    chevrons(acc, td03, hazZ);
    addAcc(grp, acc, stats);
    { const pm = pillars(td03); if (pm) { grp.add(pm); stats.tris += pm.geometry.index.count / 3; info.pillars = pm.userData.n; } }
    const box = new THREE.Box3(); S.forEach(q => box.expandByPoint(V(q.p)));
    const ctr = box.getCenter(new THREE.Vector3()), ext = box.getSize(new THREE.Vector3());
    grp.add(table(ctr, ext, O().ground));
    for (const m of scatter(td03, ctr, ext, 7)) { grp.add(m); stats.tris += m.geometry.attributes.position.count / 3; }
    const joints = jointsOf(td03); grp.add(joints);
    const c = cams(td03), seamS = S[jIdx('atrium_up')].s, kick = S[jIdx('kicker')].s, air = S[jIdx('air')].s;
    let kc = Infinity; for (let i = jIdx('kicker'); i < jIdx('landing') + 60 && i < S.length; i++) kc = Math.min(kc, Math.abs(S[i].slots[3][0] - S[i].slots[2][0]));
    info.kickerCap = kc; info.events = states.events.length; info.hpShoulder = Math.abs(S[hp0 + 40].slots[5][0] - S[hp0 + 40].slots[6][0]); info.hpSide = S[hp0 + 40].prm.sideL;
    const loopC = new THREE.Vector3(); const iL0 = jIdx('roof_loop'), iL1 = jIdx('loop_out'); for (let i = iL0; i <= iL1; i++) loopC.add(V(S[i].p)); loopC.multiplyScalar(1 / (iL1 - iL0 + 1));
    const shots = {
      uebersicht: { kind: 'orbit', pos: new THREE.Vector3(-150, 260, -420), tgt: new THREE.Vector3(110, 0, -20) },
      nah: c.near(650, 4.6, 1.5, 7, 9.6, 0.8, 12),
      x1a: c.chase(seamS - 26), x1b: c.chase(seamS), x1c: c.chase(seamS + 26), x1t: c.top(seamS),
      x2a: c.chase(zones[0].s0 - 14), x2b: c.chase(zones[0].s0 + 2), x2c: c.chase(zones[0].s0 + 22), x2t: c.top(zones[0].s0 + 4),
      x3a: c.chase(kick - 16), x3b: c.chase(air - 4), x3c: { kind: 'orbit', pos: c.at(air + 10).p.clone().addScaledVector(c.at(air).R, 40).add(new THREE.Vector3(0, 8, 0)), tgt: c.at(air + 10).p }, x3t: c.near(air - 1, -6, 2.6, 12, -7, 0.8, 0),
      loop: { kind: 'orbit', pos: loopC.clone().addScaledVector(V(S[iL0].R), 70).add(new THREE.Vector3(0, 6, 0)), tgt: loopC },
      kappe: c.near(air - 2, 11, 3.5, -8, 7.2, 1.0, 0)
    };
    info.buildMs = Math.round(performance.now() - t0);
    return { group: grp, joints, shots, route: td03, ride: [0, S[S.length - 1].s - 30], rideStart: seamS - 40, ctr, ext, tris: stats.tris, zones };
  };

  // ---------- Szene TN02 (Gotthard) ----------
  let tn02 = null;
  const buildTN02 = async () => {
    if (!tn02) { onNote('TN02 wird entpackt …'); const r = await fetch(here('data/tn02.graph.stream.json.gz'));
      tn02 = await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).json(); }
    const M = tn02.routes.M, S = M.samples, t0 = performance.now(), grp = new THREE.Group(), stats = { tris: 0 };
    const seg = M.tunnels.find(t => t.host === 'mountain'), iEnd = Math.min(S.length - 1, 900);
    const rzM = raceZones(M, O()), states = makeStates(THREE, M, O(), SK, rzM.filter(z => z.kind === 'kerb'));
    const accM = buildRoute(THREE, M, O(), { G: G(), states, kerb: kerbSpec(O()), i0: 0, i1: iEnd }); chevrons(accM, M, rzM.filter(z => z.kind === 'hazard' && z.s0 < S[iEnd].s)); addAcc(grp, accM, stats);
    const T = SK.tunnels.mountain, tun = buildMountainTunnel(THREE, M, seg, T, { G: G(), iEnd });
    const parts = [['inner', tun.inner, 'world', 0.6, THREE.DoubleSide], ['lights', tun.lights, 'knetbar', 0.4, THREE.DoubleSide], ['collar', tun.collar, 'world', 0.5, THREE.DoubleSide], ['rock', tun.rock, 'world', 1.2, THREE.DoubleSide]];
    for (const [n, A, clay, sc, side] of parts) { if (!A.idx.length) continue;
      const m = new THREE.Mesh(accToGeom(THREE, A, 90 + parts.findIndex(p => p[0] === n)), matFor(n === 'rock' ? 'rock' : n === 'collar' ? 'barrier_cap' : 'tube_inner', clay, sc, side));
      if (n === 'lights') { const lm = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: T.lights }), role: 'knetbar', profile: profileFor('barrier_cap', 0.4, st.k, SK.clayDetail), side: THREE.DoubleSide }); lm.emissive = new THREE.Color(T.lights); lm.emissiveIntensity = 1.1; m.material = lm; }
      m.castShadow = n !== 'lights'; m.receiveShadow = true; m.name = 'tube_' + n; grp.add(m); stats.tris += A.idx.length / 3; }
    info.env = tun.env;
    const box = new THREE.Box3(); for (let i = 0; i <= iEnd; i++) box.expandByPoint(V(S[i].p)); box.expandByScalar(60);
    const ctr = box.getCenter(new THREE.Vector3()), ext = box.getSize(new THREE.Vector3());
    grp.add(table(ctr, ext, O().ground));
    for (const m of scatter(M, ctr, ext, 11, [0, iEnd])) { grp.add(m); stats.tris += m.geometry.attributes.position.count / 3; }
    const joints = jointsOf({ ...M, joints: M.joints.filter(j => j.index <= iEnd) }); grp.add(joints);
    const c = cams(M), sP = S[seg.i0].s, hero = M.joints.find(j => j.piece === 'g_hero');
    const front = c.at(sP - 60);
    const shots = {
      uebersicht: { kind: 'orbit', pos: front.p.clone().addScaledVector(front.R, -70).add(new THREE.Vector3(0, 55, 0)), tgt: c.at(sP + 20).p.clone().add(new THREE.Vector3(0, 8, 0)) },
      nah: c.near(sP - 10, -9, 1.6, 8, 0, 4, 6),
      x4a: c.chase(sP - 40), x4b: c.chase(sP - 10), x4c: c.chase(sP + 30), x4t: c.near(sP, -18, 14, 30, 0, 5, 0),
      r02: { kind: 'ride', s: (hero ? S[hero.index].s : 390) - 10 },
      kragen: c.near(sP, 4, 5, 18, -8, 6, 0)
    };
    info.buildMs = Math.round(performance.now() - t0);
    return { group: grp, joints, shots, route: M, ride: [0, S[iEnd].s - 30], rideStart: 20, ctr, ext, tris: stats.tris };
  };

  // ---------- Szene Kanten-Atlas ----------
  const labelsEl = document.createElement('div'); Object.assign(labelsEl.style, { position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: 2 });
  canvas.parentElement.appendChild(labelsEl);
  const buildAtlas = () => {
    const t0 = performance.now(), grp = new THREE.Group(), stats = { tris: 0 }, base = td03.samples[1300];
    // Core-Formel gegen den Stream prüfen
    let err = 0, errVis = 0, nVis = 0; const ck = td03.samples.filter((q, i) => i % 25 === 0 && q.prm.surface >= 0.5);
    for (const q of ck) { const pr = profileSlots(q.prm); let e = 0; pr.forEach((p, k) => { e = Math.max(e, Math.hypot(p[0] - q.slots[k][0], p[1] - q.slots[k][1])); });
      if ((q.prm.barrierVisL ?? 1) < 1 || (q.prm.barrierVisR ?? 1) < 1) { errVis = Math.max(errVis, e); nVis++; } else err = Math.max(err, e); }
    info.slotErr = err; info.slotErrVis = errVis; info.slotN = ck.length; info.slotNVis = nVis;
    const rows = [
      { n: 1, label: 'Straße · bündig, nur Randlinie', skin: 'street', over: { kerb: { w: 1, h: 0, shape: 'flat' } } },
      { n: 2, label: 'Straße · Wulst-Kerb (H0)', skin: 'street', over: { kerb: { w: 1, h: 0.16, shape: 'bulge' } } },
      { n: 3, label: 'Straße · Bordstein + Gehweg', skin: 'street', over: { kerb: { w: 1.98, h: 0.18, shape: 'step' } }, surface: 'sidewalk', kerbSurface: true },
      { n: 4, label: 'Renn · Kerb flach rot/weiß (Kurve innen)', skin: 'track', over: { kerb: { w: 1.2, h: 0.08, shape: 'flat' } }, stripes: true },
      { n: 5, label: 'Renn · Wurst-Kerb (Schikane)', skin: 'track', over: { kerb: { w: 0.7, h: 0.24, shape: 'sausage' } }, stripes: true },
      { n: 6, label: 'Renn · Richtungstafeln (enge Kurve außen)', skin: 'track', over: {}, hazard: true },
      { n: 7, label: 'Leitplanke · Vorschlag barrierH 0,40', skin: 'street', prm: { barrierH: 0.4, barrierOuterTop: 0.35, barrierT: 0.5 }, props: 'guardrail' },
      { n: 8, label: 'Fangzaun außen, neigt nach außen', skin: 'track', props: 'fence' },
      { n: 9, label: 'Gras-Auslauf · Vorschlag Seite 1,0 + shoulderW 6,0', skin: 'track', prm: { shoulderW: 6.0, sideL: 1, sideR: 1 }, surface: 'grass' },
      { n: 10, label: 'Kiesbett · Vorschlag Seite 1,0 + shoulderW 6,0', skin: 'track', prm: { shoulderW: 6.0, sideL: 1, sideR: 1 }, surface: 'gravel', stripes: true },
      { n: 11, label: 'Sandbett · Vorschlag Seite 1,0 + shoulderW 6,0', skin: 'track', prm: { shoulderW: 6.0, sideL: 1, sideR: 1 }, surface: 'sand' },
      { n: 12, label: 'Graben + Erdwall · Vorschlag Seite 1,0 + shoulderW 4,0', skin: 'street', prm: { shoulderW: 4.0, sideL: 1, sideR: 1 }, over: { ditch: 0.6, capH: 0.7 }, surface: 'grass', berm: true },
      { n: 13, label: 'Brüstung schlank · barrierT 0,45', skin: 'street', prm: { barrierT: 0.45, barrierH: 1.1, barrierOuterTop: 1.1 } },
      { n: 14, label: 'Tunnel-Servicestreifen 0,30 m', skin: 'street', over: { kerb: { w: 1.2, h: 0.3, shape: 'ledge' } }, tunnelEdge: true },
      { n: 15, label: 'Ein Guss · Knetstärke 0,15', skin: 'track', G: 0.15, mould: true },
      { n: 16, label: 'Ein Guss · Knetstärke 0,5', skin: 'track', G: 0.5, mould: true },
      { n: 17, label: 'Ein Guss · Knetstärke 1,0', skin: 'track', G: 1.0, mould: true },
      { n: 18, label: 'Übergang Renn → Kies → Renn · Vorschlag Seite 1,0 + shoulderW 6,0', skin: 'track', prm: { shoulderW: 6.0, sideL: 1, sideR: 1 }, len: 64, zone: { s0: 22, s1: 42, side: 'both', surface: 'gravel' } }
    ];
    const cols = 6, dz = 34, dx = 36, len = 18, anchors = [], xShots = {};
    rows.forEach((row, n) => {
      const L = row.len || len;
      const cx = Math.floor(n / cols) * dx, cz = (n % cols) * dz, prm = { ...base.prm, width: 14.4, ...(row.prm || {}) }, slots = profileSlots(prm);
      const samples = []; for (let k = 0; k <= L / 0.5; k++) samples.push({ s: k * 0.5, p: [cx + k * 0.5, 0, cz], T: [1, 0, 0], U: [0, 1, 0], R: [0, 0, 1], prm, slots, skin: row.skin, tags: [] });
      const style = row.skin === 'street' ? 'STREET' : 'TRACK';
      const markings = [-1, 1].map(sd => ({ style, at: 'edges', side: sd, inset: 0.25, w: 0.24, s0: 0, s1: L }));
      if (row.skin === 'street') for (let s = 0; s < L; s += 6) markings.push({ style, at: 'centre', side: 0, inset: 0, w: 0.24, s0: s, s1: s + 3 });
      const route = { samples, ds: 0.5, markings, joints: [] };
      const Oo = row.tunnelEdge ? { ...O(), skins: { ...O().skins, street: { ...O().skins.street, kerb: { c: O().tunnelEdge.kerb } } } } : O();
      let Ox = Oo;
      if (row.berm) Ox = { ...Oo, skins: { ...Oo.skins, street: { ...Oo.skins.street, barrier_cap: SK.surfaces.earth, barrier_side: SK.surfaces.earth } } };
      if (row.kerbSurface) Ox = { ...Ox, skins: { ...Ox.skins, street: { ...Ox.skins.street, kerb: SK.surfaces.sidewalk } } };
      const RC = O().race, all = { s0: -1e6, s1: 1e6, side: 'both' };
      const zones = [...(row.zone ? [row.zone] : row.surface ? [{ ...all, surface: row.surface }] : []),
        ...(row.stripes && RC ? [{ ...all, role: 'kerb', def: { c: RC.kerbStripes }, L: O().stripeLen || 3, key: 'ks' }] : []),
      ];
      const states = makeStates(THREE, route, Ox, SK, zones);
      const acc = buildRoute(THREE, route, Ox, { G: row.G ?? G(), states, kerb: kerbSpec(Ox), over: () => row.mould ? {} : { classic: true, ...(row.over || {}) }, edges: !row.mould });
      if (row.props) props(acc, route, row.props);
      if (row.hazard) chevrons(acc, route, [{ s0: 0, s1: L, side: 'both' }]);
      addAcc(grp, acc, stats);
      anchors.push({ p: new THREE.Vector3(cx + Math.min(L, 18) / 2, 5.5, cz), text: row.n + ' · ' + row.label });
      if (row.zone) { const c = cams(route), z = row.zone; Object.assign(xShots, { x2a: c.chase(z.s0 - 10), x2b: c.chase(z.s0 + 3), x2c: c.chase(z.s0 + 16), x2t: c.top(z.s0 + 4) }); }
    });
    const ctr = new THREE.Vector3(dx, 0, dz * 2.5), ext = new THREE.Vector3(dx * 3, 10, dz * 6);
    grp.add(table(ctr, ext.clone().multiplyScalar(0.4), O().ground));
    labelsEl.innerHTML = '';
    const labels = anchors.map(a => { const d = document.createElement('div'); d.textContent = a.text;
      Object.assign(d.style, { position: 'absolute', transform: 'translate(-50%,-100%)', background: '#fff', border: '1px solid #dfe3e8', borderRadius: '8px', padding: '3px 7px', font: '700 11px/1.2 Inter,ui-sans-serif,system-ui,sans-serif', color: '#17191d', whiteSpace: 'nowrap', boxShadow: '0 6px 16px rgba(19,25,35,.08)' });
      labelsEl.appendChild(d); return { el: d, p: a.p }; });
    const shots = {
      uebersicht: { kind: 'orbit', pos: new THREE.Vector3(-70, 95, dz * 2.5), tgt: new THREE.Vector3(dx, 0, dz * 2.5) },
      nah: { kind: 'orbit', pos: new THREE.Vector3(-8, 3.2, 5 * dz + 11), tgt: new THREE.Vector3(9, 0.8, 5 * dz + 6) },
      ...xShots
    };
    rows.forEach((row, n) => { const cx = Math.floor(n / cols) * dx, cz = (n % cols) * dz; shots['a' + row.n] = { kind: 'orbit', pos: new THREE.Vector3(cx + 3, 3.6, cz + 16), tgt: new THREE.Vector3(cx + 11, 0.4, cz + 3) }; });
    info.buildMs = Math.round(performance.now() - t0);
    return { group: grp, joints: new THREE.Group(), shots, route: null, ctr, ext, tris: stats.tris, labels, rows };
  };
  // Leitplanke und Fangzaun als Stützen/Bänder auf Ankern (Vorschlag: Core gibt Anker je Seite aus)
  function props(acc, route, kind) {
    const S = route.samples, q0 = S[0], A = acc.barrier_side;
    const box = (q, l, h, sl, sh, len, st) => { const b = A.pos.length / 3; const c = [];
      for (const dz of [0, len]) for (const [dl, dh] of [[-sl, 0], [sl, 0], [sl, sh], [-sl, sh]]) { const qq = { ...q, p: W3(q, 0, 0).map((v, i) => v + q.T[i] * dz) }; c.push(W3(qq, l + dl, h + dh)); }
      c.forEach(P => pushVraw(A, P, st, q.s));
      const f = [[0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0]];
      for (const [a, b2, c2, d] of f) A.idx.push(b + a, b + b2, b + c2, b + a, b + c2, b + d); };
    const band = (latFn, h0, h1, st) => { const b = A.pos.length / 3;
      S.forEach(q => { const l = latFn(q); for (const [dl, h] of [[0, h0], [0, h1], [0.08, h1], [0.08, h0]]) pushVraw(A, W3(q, l + dl, h), st, q.s); });
      for (let k = 0; k < S.length - 1; k++) { const a = b + 4 * k, c = a + 4; for (let i = 0; i < 4; i++) { const i1 = (i + 1) % 4; A.idx.push(a + i, a + i1, c + i1, a + i, c + i1, c + i); } } };
    for (const sg of [-1, 1]) {
      if (kind === 'guardrail') {
        const st = flatState(THREE, '#9aa3ad'), sp = flatState(THREE, '#7d858f'), lat = sg * (Math.abs(q0.slots[3][0]) - 0.1);
        for (let s = 1; s < 18; s += 2) box(S[Math.round(s / 0.5)], lat, 0.35, 0.08, 0.75, 0.16, sp);
        band(() => lat + (sg > 0 ? 0 : -0.08), 0.62, 0.98, st);
      } else if (kind === 'fence') {
        const st = flatState(THREE, '#8d948c'), sp = flatState(THREE, '#6f7a70'), lat = sg * (Math.abs(q0.slots[2][0]) + 0.35);
        for (let s = 1.5; s < 18; s += 3) { const q = S[Math.round(s / 0.5)]; for (let h = 1.2; h < 4.6; h += 0.85) box(q, lat + sg * (h - 1.2) * 0.14, h, 0.07, 0.86, 0.14, sp); }
        for (let h = 1.7; h <= 4.5; h += 0.55) band(() => lat + sg * (h - 1.2) * 0.14, h, h + 0.05, st);
      }
    }
  }
  // Richtungstafeln: roter Knet-Schild auf der Wand, Pfeil zeigt in Fahrtrichtung (+T); nur außen in engen Kurven
  function chevrons(acc, route, zones) {
    const C = O().race?.chevron; if (!C || !zones.length) return;
    const S = route.samples, A = acc.barrier_side, sb = flatState(THREE, C.board), sa = flatState(THREE, C.arrow);
    const P = (q, t, lat, h) => W3(q, lat, h).map((v, i) => v + q.T[i] * t);
    const box = (q, lat, dl, pts, st) => { const b = A.pos.length / 3;              // pts: 4 Ecken (t, h) in der Tafelebene, dl: Dicke zur Fahrbahn
      for (const d of [0, dl]) for (const [t, h] of pts) pushVraw(A, P(q, t, lat + d, h), st, q.s);
      for (const [a, b2, c, e] of [[0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0]]) A.idx.push(b + a, b + b2, b + c, b + a, b + c, b + e); };
    for (const z of zones) for (let s = z.s0 + C.every / 2; s < z.s1; s += C.every) {
      const q = S[Math.max(0, Math.min(S.length - 1, Math.round(s / route.ds)))]; if (q.prm.surface < 0.5) continue;
      for (const side of z.side === 'both' ? ['L', 'R'] : [z.side]) {
        const sg = side === 'L' ? -1 : 1, top = q.slots[sg < 0 ? 3 : 10], lat = top[0] + sg * 0.1, dl = -sg * 0.16, h0 = Math.max(q.slots[sg < 0 ? 2 : 11][1], top[1]) + 0.05, w = C.w / 2, hh = C.h;
        box(q, lat, dl, [[-w, h0], [w, h0], [w, h0 + hh], [-w, h0 + hh]], sb);
        const la = lat + dl, da = -sg * 0.05, th = 0.13, hm = h0 + hh / 2;
        for (const [t0, h1, t1, h2] of [[-0.3, hm + 0.3, 0.25, hm], [0.25, hm, -0.3, hm - 0.3]]) {
          const tx = t1 - t0, ty = h2 - h1, l = Math.hypot(tx, ty), nx = -ty / l * th / 2, ny = tx / l * th / 2;
          box(q, la, da, [[t0 - nx, h1 - ny], [t1 - nx, h2 - ny], [t1 + nx, h2 + ny], [t0 + nx, h1 + ny]], sa);
        }
      }
    }
  }
  // Stützen im Cartoon-Look: ein dicker Knetpfeiler je 16 m unter hochliegender Fahrbahn, breiter Fuß, schlanke Taille, Kragen unter dem Deck.
  // Nicht im Parkhaus (Helix steht im Gebäude), nicht im Looping, nicht in der Luft.
  function pillars(route) {
    const S = route.samples, GROUND = -0.6, pos = [], idx = [], cols = [], seeds = [];
    let lastS = -1e9, n = 0;
    for (let i = 0; i < S.length; i += 2) {
      const q = S[i], t = q.tags || [];
      if (q.prm.surface < 0.5 || t.includes('SPIRAL') || t.includes('parkdeck') || t.includes('LOOP') || t.includes('KICKER') || t.includes('AIR') || t.includes('LANDING') || q.U[1] < 0.85 || q.s - lastS < 16) continue;
      const u = W3(q, q.prm.offset || 0, q.slots[0][1]), H = u[1] - GROUND; if (H < 2.5) continue;
      lastS = q.s; n++;
      const sc = 0.92 + 0.16 * ((Math.sin(q.s * 12.9898) * 43758.5453) % 1 + 1) % 1;
      const R = 1.05 * sc * Math.min(1.3, 0.75 + q.prm.width / 40);
      const prof = [[0, 0], [1.55 * R, 0], [1.7 * R, 0.22], [1.45 * R, 0.6], [1.0 * R, 1.1], [0.9 * R, H * 0.5], [1.0 * R, H - 1.1], [1.45 * R, H - 0.5], [1.65 * R, H - 0.15], [1.5 * R, H - 0.12], [0, H - 0.12]];
      const lg = new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), 18).toNonIndexed();
      const tilt = ((Math.sin(q.s * 78.233) * 12345.678) % 1) * 0.03;
      lg.rotateZ(tilt); lg.rotateY(q.s); lg.translate(u[0], GROUND, u[2]);
      const b = pos.length / 3, p = lg.attributes.position.array; for (let j = 0; j < p.length; j++) pos.push(p[j]);
      for (let j = 0; j < p.length / 3; j++) { idx.push(b + j); seeds.push(q.s); }
      lg.dispose();
    }
    if (!n) return null;
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
    const st = flatState(THREE, O().skins.track.barrier_side.c), m = pos.length / 3;
    const fill = (v, k) => new THREE.Float32BufferAttribute(new Float32Array(m * k).map((_, j) => v[j % k]), k);
    g.setAttribute('aA', fill([st.A.a.r, st.A.a.g, st.A.a.b], 3)); g.setAttribute('aA2', fill([st.A.a.r, st.A.a.g, st.A.a.b], 3));
    g.setAttribute('aB', fill([st.A.a.r, st.A.a.g, st.A.a.b], 3)); g.setAttribute('aB2', fill([st.A.a.r, st.A.a.g, st.A.a.b], 3));
    g.setAttribute('aS', new THREE.Float32BufferAttribute(seeds.flatMap(s => [s, 0, 0, 0]), 4)); g.setAttribute('aM', fill([1, 0, 1, 0], 4));
    g.computeVertexNormals(); seedGeometry(THREE, g, 55);
    const mesh = new THREE.Mesh(g, matFor('barrier_side', 'world', 0.6)); mesh.castShadow = true; mesh.receiveShadow = true; mesh.name = 'stuetzen'; mesh.userData.n = n;
    return mesh;
  }
  function scatter(route, ctr, ext, seed, range = null) {
    const C = SK.scatter; if (!C) return [];
    const S = route.samples, GROUND = -0.6, cell = 8, near = new Set(), rnd = n => { const v = Math.sin((n + seed * 101) * 12.9898) * 43758.5453; return v - Math.floor(v); };
    const r0 = range ? range[0] : 0, r1 = range ? range[1] : S.length - 1;
    for (let i = r0; i <= r1; i += 3) { const p = S[i].p, R = Math.ceil(C.clearance / cell); for (let dx = -R; dx <= R; dx++) for (let dz = -R; dz <= R; dz++) near.add((Math.floor(p[0] / cell) + dx) + ',' + (Math.floor(p[2] / cell) + dz)); }
    const free = (x, z) => !near.has(Math.floor(x / cell) + ',' + Math.floor(z / cell));
    const soft = { pos: [], col: [] }, hard = { pos: [], col: [] }, cloud = { pos: [], col: [] };
    const put = (acc, geo, col, x, y, z, sx, sy, sz, ry = 0) => { const g = geo.clone(); g.scale(sx, sy, sz); g.rotateY(ry); g.translate(x, y, z); const nn = g.toNonIndexed(), p = nn.attributes.position.array, c = new THREE.Color(col);
      for (let j = 0; j < p.length; j++) acc.pos.push(p[j]); for (let j = 0; j < p.length / 3; j++) acc.col.push(c.r, c.g, c.b); g.dispose(); nn.dispose(); };
    const ball = new THREE.IcosahedronGeometry(1, 2), trunk = new THREE.CylinderGeometry(0.45, 0.7, 1, 10), rock = new THREE.IcosahedronGeometry(1, 1);
    const tree = (x, z, n) => { const h = 3 + rnd(n) * 2.5; put(soft, trunk, C.trunk, x, GROUND + h / 2, z, 1, h, 1);
      for (let b = 0; b < 4; b++) { const r = 2.2 + rnd(n + b * 3.1) * 1.8, a2 = b * 2.1 + rnd(n) * 6, o = b ? 1.8 : 0; put(soft, ball, C.leaf[(n + b) % 3 === 2 && b ? 2 : Math.floor(rnd(n + b) * 2)], x + Math.cos(a2) * o, GROUND + h + r * 0.7 + (b ? 0 : 1.2), z + Math.sin(a2) * o, r, r * 0.85, r); } };
    const bush = (x, z, n) => { for (let b = 0; b < 3; b++) { const r = 1.1 + rnd(n + b) * 0.9, a2 = b * 2.3 + n; put(soft, ball, C.leaf[b === 2 ? 2 : 1], x + Math.cos(a2) * 1.1, GROUND + r * 0.6, z + Math.sin(a2) * 1.1, r, r * 0.75, r); } };
    const stone = (x, z, n) => { const s = 1.4 + rnd(n) * 1.8; put(hard, rock, C.rock[n % 2], x, GROUND + s * 0.45, z, s * 1.3, s * 0.9, s, rnd(n + 5) * 6); };
    let placed = 0;
    for (let n = 0; n < C.clusters * 4 && placed < C.clusters; n++) {
      const x = ctr.x + (rnd(n * 3.7) - 0.5) * (ext.x + 200), z = ctr.z + (rnd(n * 5.3 + 1) - 0.5) * (ext.z + 200);
      if (!free(x, z)) continue; placed++;
      tree(x, z, n); const a2 = rnd(n + 9) * 6.28;
      for (const [d, f] of [[5.5, bush], [7, bush], [6.5, stone]]) { const xx = x + Math.cos(a2 + d) * d, zz = z + Math.sin(a2 + d) * d; if (free(xx, zz)) f(xx, zz, n + d); }
    }
    for (let c = 0; c < 9; c++) { const x = ctr.x + (rnd(c * 7.1 + 50) - 0.5) * (ext.x + 300), z = ctr.z + (rnd(c * 3.3 + 70) - 0.5) * (ext.z + 300), y = 80 + rnd(c + 90) * 40;
      for (let b = 0; b < 5; b++) { const r = 7 + rnd(c * 9 + b) * 5; put(cloud, ball, C.cloud, x + (b - 2) * r * 0.9, y + (b % 2) * 3, z + rnd(b + c) * 6, r, r * 0.8, r * 0.85); } }
    const mk = (acc, role, profile, shadow) => { if (!acc.pos.length) return null; const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(acc.pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(acc.col, 3)); g.computeVertexNormals(); seedGeometry(THREE, g, 33);
      const p = { ...PROFILES[profile] }; p.scale *= 2; const m = new THREE.Mesh(g, makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ vertexColors: true }), role, profile: p })); m.castShadow = shadow; m.receiveShadow = true; m.name = 'streuung_' + profile; return m; };
    return [mk(soft, 'soft', 'nature', true), mk(hard, 'world', 'terrainFg', true), mk(cloud, 'soft', 'cloud', false)].filter(Boolean);
  }
  function pushVraw(A, P, stt, s) { A.pos.push(...P); A.A.push(stt.A.a.r, stt.A.a.g, stt.A.a.b); A.A2.push(stt.A.a2.r, stt.A.a2.g, stt.A.a2.b); A.B.push(stt.B.a.r, stt.B.a.g, stt.B.a.b); A.B2.push(stt.B.a2.r, stt.B.a2.g, stt.B.a2.b); A.S.push(s, 0, 0, 0); A.M.push(1, 0, 1, 0); }

  // ---------- Szenenwechsel, Kamera ----------
  let cur = null;
  const fitSun = sc => { const half = Math.max(sc.ext.x, sc.ext.z) * 0.62 + 20; sun.position.copy(sc.ctr).add(new THREE.Vector3(-160, 320, 190)); sun.target.position.copy(sc.ctr);
    Object.assign(sun.shadow.camera, { left: -half, right: half, top: half, bottom: -half, near: 20, far: 1000 }); sun.shadow.camera.updateProjectionMatrix(); fill.position.copy(sc.ctr).add(new THREE.Vector3(180, 60, -200)); };
  const show = async name => {
    onNote('Szene wird gebaut …');
    if (cur) { scene.remove(cur.group); cur.group.traverse(o => o.geometry && o.geometry.dispose()); }
    labelsEl.innerHTML = '';
    cur = name === 'tn02' ? await buildTN02() : name === 'atlas' ? buildAtlas() : buildTD03();
    st.scene = name; info.scene = name; info.tris = cur.tris;
    { let n = 0, c = 0; const ev = new Set(); cur.joints.traverse(o => ev.add(o));   // Fugen-Pfeile sind Beweis-Hilfen, keine Strecke
      cur.group.traverse(o => { if (o.isMesh && !ev.has(o)) { n++; if (o.material.userData && o.material.userData.clay) c++; } }); info.clay = c + '/' + n; } scene.add(cur.group); fitSun(cur);
    if (cur.rideStart != null && (st.rideS < cur.ride[0] || st.rideS > cur.ride[1] || st.sceneRide !== name)) { st.rideS = cur.rideStart; st.sceneRide = name; }
    applyShot(st.cam === 'fahrt' && cur.route ? 'fahrt' : 'uebersicht');
  };
  const rebuild = async () => { const cam = { pos: camera.position.clone(), tgt: controls.target.clone(), up: camera.up.clone(), mode: st.cam };
    await show(st.scene); if (cam.mode !== 'fahrt') { st.cam = cam.mode; camera.position.copy(cam.pos); controls.target.copy(cam.tgt); camera.up.copy(cam.up); controls.enabled = true; controls.update(); } };
  const applyShot = name => {
    if (name === 'fahrt') { if (!cur.route) return; st.cam = 'fahrt'; st.run = true; controls.enabled = false; camera.fov = 66; camera.updateProjectionMatrix(); return; }
    const sh = cur.shots[name]; if (!sh) return;
    if (sh.kind === 'ride') { st.cam = 'fahrt'; st.rideS = sh.s; st.run = false; controls.enabled = false; camera.fov = 66; }
    else { st.cam = name; controls.enabled = true; camera.fov = 40; camera.up.copy(sh.up || new THREE.Vector3(0, 1, 0)); camera.position.copy(sh.pos); controls.target.copy(sh.tgt); controls.update(); }
    camera.updateProjectionMatrix();
  };
  const ride = s => { const c = cams(cur.route), a = c.at(s), b = c.at(s + 24); camera.position.copy(a.p).addScaledVector(a.U, 1.35); camera.up.copy(a.U); camera.lookAt(b.p.clone().addScaledVector(b.U, 1.0)); };

  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  let aoPass = null;
  try { const { GTAOPass } = await import('three/addons/postprocessing/GTAOPass.js'); aoPass = new GTAOPass(scene, camera, 2, 2);
    aoPass.updateGtaoMaterial({ radius: 1.6, distanceExponent: 1.4, thickness: 2.0, scale: 1.0, samples: 16 }); aoPass.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
    aoPass.blendIntensity = 0.8; composer.addPass(aoPass); } catch (e) { info.errors.push('AO: ' + e.message); }
  composer.addPass(new OutputPass());
  const resize = () => { const w = canvas.clientWidth || 800, h = canvas.clientHeight || 450; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
  const setK = k => { st.k = k; U.uClayHand.value = 0.5 * k; U.uClayTile.value = 1.6 * k; U.uClayPrintTile.value = 4.5 * k; U.uClayMacro.value = 0.5;   // Fahrbahn-Relief wie 27.09. 21:30 (Georg: das einzig Gute), nicht ändern U.uClayFacetSize.value = 0.65 * k;
    for (const m of Object.values(mats)) { const d = m.userData.kfb; if (d) m.userData.clay.setProfile(profileFor(d.role, d.scale, k, SK.clayDetail)); } };
  setK(3); U.uClayLodK.value = 0.6; U.uClayStroke.value = 0.7;
  await show('td03');

  let raf = 0, last = performance.now(), frames = 0, fpsT = last; const pv = new THREE.Vector3();
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (st.cam === 'fahrt' && cur.route) { if (st.run) { st.rideS += st.speed * dt; if (st.rideS > cur.ride[1]) st.rideS = cur.ride[0]; } ride(st.rideS); } else controls.update();
    composer.render();
    if (cur.labels) { const w = canvas.clientWidth, h = canvas.clientHeight; for (const L of cur.labels) { pv.copy(L.p).project(camera); const vis = pv.z < 1 && Math.abs(pv.x) < 1.1 && Math.abs(pv.y) < 1.1 && L.p.distanceTo(camera.position) < 75;
      L.el.style.display = vis ? 'block' : 'none'; if (vis) { L.el.style.left = ((pv.x + 1) / 2 * w) + 'px'; L.el.style.top = ((1 - pv.y) / 2 * h) + 'px'; } } }
    frames++; if (now - fpsT > 1000) { info.fps = Math.round(frames * 1000 / (now - fpsT)); frames = 0; fpsT = now; }
    info.rideS = st.rideS; info.cam = st.cam;
  };
  loop();

  return {
    info, skins: SK, OPTIONS: SK.options, shots: () => Object.keys(cur.shots), rowsOf: () => cur.rows || [],
    shot: n => applyShot(n),
    async set(k, val) {
      if (k === 'scene') await show(val);
      else if (k === 'option') { st.option = val; st.strength = null; await rebuild(); }
      else if (k === 'strength') { st.strength = val; await rebuild(); }
      else if (k === 'k') setK(val);
      else if (k === 'cam') applyShot(val);
      else if (k === 'run') st.run = val;
      else if (k === 'speed') st.speed = val;
      else if (k === 'rideS') { st.rideS = val; if (st.cam !== 'fahrt') applyShot('fahrt'); st.run = false; }
      else if (k === 'seam') { st.seam = val; PU.uPatchDebug.value = val ? 1 : 0; cur.joints.visible = val; }
      else if (k === 'grey') canvas.style.filter = val ? 'grayscale(1)' : '';
      else if (k === 'ao') { if (aoPass) aoPass.enabled = val; }
    },
    strengthOf: () => st.strength ?? SK.options[st.option].geo,
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); labelsEl.remove(); renderer.dispose(); }
  };
}
