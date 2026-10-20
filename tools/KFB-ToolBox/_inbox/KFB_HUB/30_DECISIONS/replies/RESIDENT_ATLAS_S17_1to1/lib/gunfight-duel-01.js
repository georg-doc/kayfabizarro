/* KFB · RESIDENT-GUNFIGHT-DUEL-01 · Fernkampf-Duell zweier KayKit-Figuren auf einem Testgelände.
   Abgespielte Choreografie: Skript aus Beats (wer schießt, was passiert). Steuerung ist ein Folgeschritt.
   · Waffen-Zahlen aus dem Arena-Kanon (kfb-combat-def.js), nur der Maßstab wird umgerechnet (Figurhöhe / 2,6 u).
   · Mündungsfeuer + Geschoss aus der Arena-Schusskette (gunfight.v2.js): Ausholen → Mündung → Geschoss im SELBEN Bild.
   · Treffer als Knet-Puff aus Fight Sandbox 02, Squash, Hit-Stop, Rückstoß in Schussrichtung.
   · Zeit wird gesetzt, nie fortgeschrieben: Plan in Clip-Zeit, Hit-Stops als Zeitverzerrung. Scrubben ist deterministisch.
   · GEMESSEN statt getippt: Schussbilder im Clip (Ruck der Hand), Achsen-Zuordnung der Waffe je Haltung,
     Mündung an der Laufspitze (Vertex-Scheibe am langen Ende), Zielkorrektur aus der Laufrichtung, Ausweichweg aus der Hüfte. */
import * as THREE from 'three';
import { loadAsset, instance, applySkin, bindReport, findBone, loadClips, subtreeNames, boneRig } from './atlas.js';

export const SCHEMA = 'kfb.resident-gunfight-duel/1';
export const FX_DEFAULTS = { dist: 3.6, projSpeed: 0.35, ammoSize: 0.5, hitStop: 2, squash: 1, knock: 1, puff: 0.22, recoil: 1, blend: 0.12, debug: false };
const FPS = 30, DT = 1 / FPS, D2R = Math.PI / 180;
const UP = new THREE.Vector3(0, 1, 0);
const RIGNODE = /^Rig_(Medium|Large)$/;
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const backOut = (x) => { const c = 1.9; x = clamp(x, 0, 1) - 1; return 1 + (c + 1) * x * x * x + c * x * x; };
const r3 = (x) => +(+x).toFixed(3);
const r1 = (x) => +(+x).toFixed(1);
const lerpAng = (a, b, k) => { let d = ((b - a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; return a + d * k; };
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const SLOT_AXES = [[0, 1, 0], [0, 0, 1], [1, 0, 0], [0, -1, 0], [0, 0, -1], [-1, 0, 0]];
const OUT_DE = { miss: 'Fehlschuss', dodge: 'Ausweichen', hit: 'Treffer', kill: 'K.o.' };

export async function createGunDuel({ V, def, onProgress = () => {}, inset = () => 0 }) {
  if (!def || def.schema !== SCHEMA) throw new Error('gunfight duel schema mismatch');
  const ML = def.motionLibrary, CAN = def.canon;
  const world = new THREE.Group(); world.name = 'duel-world';
  const pair = new THREE.Group(); pair.name = 'duel-pair'; world.add(pair);
  const fxRoot = new THREE.Group(); fxRoot.name = 'duel-fx'; world.add(fxRoot);
  const dbg = new THREE.Group(); dbg.name = 'duel.debug'; dbg.visible = false; world.add(dbg);
  const nodes = new Map(), missing = new Set();

  /* ---- Testgelände · Platzhalter ---- */
  const ground = new THREE.Group(); ground.name = 'duel-ground';
  ground.userData.entry = { id: 'duel-ground', scope: 'scenery', kind: 'prop', role: 'Testgelände · Platzhalter', a: 'primitive' };
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.04, 64), new THREE.MeshStandardMaterial({ color: 0xd6ccb8, roughness: 0.95 }));
  pad.position.y = -0.016; pad.receiveShadow = true; ground.add(pad);
  const lane = new THREE.Mesh(new THREE.BoxGeometry(1, 0.004, 1), new THREE.MeshStandardMaterial({ color: 0xbfb193, roughness: 0.95 }));
  lane.position.y = 0.007; lane.receiveShadow = true; ground.add(lane);
  const marks = [0xb8361f, 0x3f6f9c].map((c) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.01, 40), new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 })); m.position.y = 0.009; m.receiveShadow = true; ground.add(m); return m; });
  world.add(ground); nodes.set('duel-ground', ground);

  /* ---- Knet-Puff wie Fight Sandbox 02 (ein Klumpen-Satz je Treffer) ---- */
  const blobG = (() => {
    const g = new THREE.SphereGeometry(1, 18, 12), p = g.attributes.position, v = V3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); v.multiplyScalar(1 + 0.10 * Math.sin(v.x * 5.3 + 1.7) * Math.sin(v.y * 4.1 + 0.4) + 0.06 * Math.sin(v.z * 7.9 + v.x * 3.1)); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals(); return g;
  })();
  const clayMats = new Map();
  const clayFor = (tint) => { if (!clayMats.has(tint)) { const c = new THREE.Color(0xf0e6d2).lerp(new THREE.Color(tint), 0.35); clayMats.set(tint, new THREE.MeshStandardMaterial({ color: c, roughness: 0.95, metalness: 0, emissive: 0x2a2218 })); } return clayMats.get(tint); };
  function makePuff(seed, tint) {
    const g = new THREE.Group(); g.name = 'fx.clay-puff'; g.visible = false; const r = rng(seed), list = [];
    for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(blobG, clayFor(tint)); m.rotation.set(r() * 6, r() * 6, r() * 6); const dir = V3(r() * 2 - 1, r() * 1.4 - 0.4, r() * 2 - 1).normalize(); list.push({ m, dir, k: 0.6 + 0.4 * r() }); g.add(m); }
    return { g, list };
  }
  const PUFF_LIFE = 0.6;
  function drivePuff(P, age, size) {
    if (age == null || age < 0 || age > PUFF_LIFE) { P.g.visible = false; return; }
    P.g.visible = true;
    const grow = 0.35 + 0.65 * backOut(age / 0.06), fade = age < 0.18 ? 1 : Math.pow(1 - (age - 0.18) / (PUFF_LIFE - 0.18), 1.4);
    for (const b of P.list) {
      b.m.scale.setScalar(Math.max(1e-4, size * 0.55 * b.k * grow * fade));
      b.m.position.copy(b.dir).multiplyScalar(size * (0.45 + 0.6 * age / PUFF_LIFE) * b.k);
      b.m.position.y += size * 0.5 * age / PUFF_LIFE;
    }
  }

  /* ---- Geschoss- und Mündungs-Formen (Arena AMMO-Silhouetten) ---- */
  const basic = new Map();
  const matB = (c) => { if (!basic.has(c)) basic.set(c, new THREE.MeshBasicMaterial({ color: c, toneMapped: false })); return basic.get(c); };
  const G = { sph: new THREE.SphereGeometry(1, 14, 10), cone: new THREE.ConeGeometry(1, 1, 12), cyl: new THREE.CylinderGeometry(1, 1, 1, 10) };
  let pipTex = null;
  function dieTexture() {
    if (pipTex) return pipTex;
    const cv = document.createElement('canvas'); cv.width = cv.height = 128; const c = cv.getContext('2d');
    c.fillStyle = '#f3ead3'; c.fillRect(0, 0, 128, 128); c.fillStyle = '#1f1a14';
    for (const [x, y] of [[34, 34], [94, 94], [64, 64], [94, 34], [34, 94]]) { c.beginPath(); c.arc(x, y, 11, 0, Math.PI * 2); c.fill(); }
    pipTex = new THREE.CanvasTexture(cv); pipTex.colorSpace = THREE.SRGBColorSpace; return pipTex;
  }
  function dieMesh(edge) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(edge, edge, edge), new THREE.MeshStandardMaterial({ map: dieTexture(), roughness: 0.6 }));
    m.castShadow = true; m.name = 'die'; return m;
  }
  function ammoMesh(C, len, wid, edge) {
    const g = new THREE.Group();
    if (C.ammo === 'dice') { g.add(dieMesh(edge)); return g; }
    if (C.ammo === 'slug') {
      const body = new THREE.Mesh(G.cyl, matB(C.color)); body.scale.set(wid * 0.5, len * 0.78, wid * 0.5); body.rotation.x = Math.PI / 2;
      const tip = new THREE.Mesh(G.cone, matB(C.flash)); tip.scale.set(wid * 0.52, len * 0.32, wid * 0.52); tip.rotation.x = Math.PI / 2; tip.position.z = len * 0.52;
      g.add(body, tip); return g;
    }
    /* bolt / streak: Komet — satte Kuppe vorn, Schweif auf null, weißer Funke hinten */
    const head = new THREE.Mesh(G.sph, matB(C.color)); head.scale.setScalar(wid * 0.5); head.position.z = len / 2 - wid / 2;
    const tl = len - wid / 2, tail = new THREE.Mesh(G.cone, matB(C.color)); tail.scale.set(wid * 0.48, tl, wid * 0.48); tail.rotation.x = -Math.PI / 2; tail.position.z = head.position.z - tl / 2;
    const spark = new THREE.Mesh(G.sph, matB(0xffffff)); spark.scale.setScalar(wid * 0.16); spark.position.z = -len / 2;
    g.add(head, tail, spark); return g;
  }
  function flashMesh(C, size) {
    const g = new THREE.Group(); g.name = 'fx.muzzle';
    const core = new THREE.Mesh(G.sph, matB(0xffffff)); core.scale.setScalar(size * 0.35); g.add(core);
    const tongue = new THREE.Mesh(G.cone, matB(C.flash)); tongue.scale.set(size * 0.32, size * 1.3, size * 0.32); tongue.rotation.x = Math.PI / 2; tongue.position.z = size * 0.7; g.add(tongue);
    for (let i = 0; i < 4; i++) { const s = new THREE.Mesh(G.cone, matB(C.color)); s.scale.set(size * 0.1, size * 0.6, size * 0.1); const a = i * Math.PI / 2 + Math.PI / 4; s.position.set(Math.cos(a) * size * 0.35, Math.sin(a) * size * 0.35, size * 0.15); s.rotation.set(0, 0, a - Math.PI / 2); g.add(s); }
    return g;
  }

  /* ---- Clips: KayKit-Bibliothek zuerst (natives Rig), Motion Library als Quelle für den Schuss und als Rückfall ---- */
  const kk = {}, libFiles = {}, roleCache = {};
  const kayKit = (rig) => kk[rig] || (kk[rig] = loadClips(rig).then((list) => { const m = new Map(); for (const c of list) if (!m.has(c.name)) m.set(c.name, c.clip); return m; }));
  const libFile = (f) => libFiles[f] || (libFiles[f] = loadAsset(ML.root + f, ML.ref).then((g) => { onProgress('Motion Library · ' + f.split('/').pop()); return g; }));
  async function libClip(name, rig) {
    const c = def.clips[name]; if (!c || !c.library || !c.library[rig]) return null;
    const g = await libFile(c.library[rig]); const src = g.animations.find((a) => a.name === name); if (!src) return null;
    return new THREE.AnimationClip(name, src.duration, src.tracks.filter((t) => !RIGNODE.test(t.name.split('.')[0])));
  }
  function rolesFor(rig) {
    if (roleCache[rig]) return roleCache[rig];
    roleCache[rig] = (async () => {
      onProgress('KayKit-Clips ' + rig);
      const K = await kayKit(rig), clips = {}, report = {};
      for (const [role, R] of Object.entries(def.roles)) {
        let clip = null, src = null;
        for (const o of (R.prefer === 'lib' ? ['lib', 'kaykit'] : ['kaykit', 'lib'])) {
          if (clip) break;
          if (o === 'kaykit' && R.kaykit) { const re = new RegExp(R.kaykit); for (const [n, c] of K) if (re.test(n)) { clip = c; src = 'KayKit · ' + n; break; } }
          if (o === 'lib' && R.lib) { clip = await libClip(R.lib, rig); if (clip) src = 'Motion Library · ' + R.lib; }
        }
        clips[role] = clip; report[role] = src || 'fehlt';
        if (!clip) missing.add(rig + ':' + role);
      }
      return { clips, report };
    })();
    return roleCache[rig];
  }

  /* ---- Posen: bis zu zwei Schichten (aktueller + vorheriger Abschnitt) mit eigenen Actions je Schicht ---- */
  function poseLayers(a, layers) {
    const used = new Set();
    layers.forEach(([role, time, w], idx) => {
      const base = a.clips[role]; if (!base || w <= 0) return;
      const key = role + '|' + idx; used.add(key);
      let act = a.actions.get(key);
      if (!act) {
        const clip = idx === 0 ? base : base.clone();
        act = a.mixer.clipAction(clip); act.setLoop(THREE.LoopRepeat, Infinity); act.play(); act.paused = true; a.actions.set(key, act);
      }
      act.enabled = true; act.setEffectiveWeight(w); act.time = clamp(time, 0, base.duration - 1e-4);
    });
    for (const [k, act] of a.actions) if (!used.has(k)) act.enabled = false;
    a.mixer.update(0);
    a.layers = layers.map((l) => [l[0], r3(l[1] * FPS), r3(l[2])]);
  }
  const actorQ = (a) => a.actor.getWorldQuaternion(new THREE.Quaternion());
  const toActorP = (a, p) => a.actor.worldToLocal(p.clone());
  const toActorD = (a, d) => d.clone().applyQuaternion(actorQ(a).invert());
  function poseRaw(a, layers) {
    const sl = slots[a.slot]; sl.anchor.position.set(0, 0, 0); sl.anchor.rotation.set(0, 0, 0); sl.squash.scale.set(1, 1, 1); sl.kick.position.set(0, 0, 0); sl.kick.rotation.set(0, 0, 0);
    poseLayers(a, layers); world.updateMatrixWorld(true);
  }
  function torsoFwd(a) {
    const l = toActorP(a, a.shL.getWorldPosition(V3())), r = toActorP(a, a.shR.getWorldPosition(V3()));
    const f = V3().crossVectors(UP, r.sub(l)); f.y = 0; return f.normalize().multiplyScalar(a.fwdSign || 1);
  }

  /* ---- Waffe: Mündung am langen Ende messen, Achse je Haltung messen ---- */
  function muzzleOf(node) {
    node.updateWorldMatrix(true, true);
    const inv = node.matrixWorld.clone().invert(), pts = [], v = V3();
    node.traverse((o) => {
      if (!o.isMesh) return; const p = o.geometry.attributes.position, M = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld), step = Math.max(1, Math.floor(p.count / 4000));
      for (let i = 0; i < p.count; i += step) pts.push(v.fromBufferAttribute(p, i).applyMatrix4(M).clone());
    });
    let zmin = Infinity, zmax = -Infinity; for (const q of pts) { zmin = Math.min(zmin, q.z); zmax = Math.max(zmax, q.z); }
    const end = Math.abs(zmax) >= Math.abs(zmin) ? zmax : zmin, len = zmax - zmin;
    const sl = pts.filter((q) => Math.abs(q.z - end) <= 0.06 * len);
    const c = sl.reduce((s, q) => s.add(q), V3()).multiplyScalar(1 / Math.max(1, sl.length)); c.z = end;
    return { local: c, dir: V3(0, 0, Math.sign(end) || 1), len: r3(len), zmin: r3(zmin), zmax: r3(zmax), slice: sl.length, verts: pts.length };
  }
  function makeSpin(node, S) {
    const barrel = node.getObjectByName(S.node); if (!barrel || !barrel.parent) return null;
    node.updateWorldMatrix(true, true);
    const invB = barrel.matrixWorld.clone().invert();
    let gb = null; barrel.traverse((o) => { if (o.isMesh && !gb) { o.geometry.computeBoundingBox(); gb = o.geometry.boundingBox.getCenter(V3()).applyMatrix4(new THREE.Matrix4().multiplyMatrices(invB, o.matrixWorld)); } });
    const cP = (gb || V3()).clone().applyMatrix4(barrel.matrix);
    const piv = new THREE.Group(); piv.name = 'spin.' + S.node; piv.position.copy(cP); barrel.parent.add(piv); piv.add(barrel); barrel.position.sub(cP);
    return { piv, axis: V3(0, 0, 1).applyQuaternion(barrel.quaternion).normalize(), rps: S.rps, centerShift: r3(cP.length()) };
  }
  const muzzleWorld = (a) => a.weapon.node.localToWorld(a.weapon.geo.local.clone());
  const barrelWorld = (a) => a.weapon.geo.dir.clone().transformDirection(a.weapon.node.matrixWorld);
  /* Welche Slot-Achse trägt den Lauf in DIESER Haltung? Sechs Kandidaten, gewertet nach waagerechtem Anteil in
     Torso-Blickrichtung. Danach der Rollwinkel, der die Waffen-Oberseite (+Y) am weitesten nach oben stellt. */
  function chooseAxis(a, layers) {
    const W = a.weapon; poseRaw(a, layers);
    const fwd = torsoFwd(a), from = W.geo.dir.clone(), rows = [];
    for (const to of SLOT_AXES) {
      W.holder.quaternion.setFromUnitVectors(from, V3(...to)); world.updateMatrixWorld(true);
      const d = toActorD(a, barrelWorld(a)), h = V3(d.x, 0, d.z), hl = h.length();
      rows.push({ to, score: (hl > 1e-6 ? h.multiplyScalar(1 / hl).dot(fwd) * hl : -1) - 0.5 * Math.abs(d.y) });
    }
    rows.sort((x, y) => y.score - x.score);
    const best = rows[0], toV = V3(...best.to), q0 = new THREE.Quaternion().setFromUnitVectors(from, toV);
    let roll = 0, upBest = -Infinity;
    for (let deg = 0; deg < 360; deg += 15) {
      W.holder.quaternion.copy(q0).premultiply(new THREE.Quaternion().setFromAxisAngle(toV, deg * D2R)); world.updateMatrixWorld(true);
      const up = toActorD(a, V3(0, 1, 0).transformDirection(W.node.matrixWorld)).y;
      if (up > upBest + 1e-4) { upBest = up; roll = deg; }
    }
    const q = q0.clone().premultiply(new THREE.Quaternion().setFromAxisAngle(toV, roll * D2R));
    /* GRIFFKORREKTUR: die Achsen-Zuordnung rastet auf 90°-Schritte. Was danach noch fehlt, ist der Unterschied zwischen
       dem Griff, für den der Clip authored ist, und dem Griff der Waffe. Ziel: Pistole entlang der Linie Schulter → Hand
       (dorthin zielt der Arm), Gewehr in Torso-Blickrichtung. Kleinste Drehung, in Grad gemeldet. */
    W.holder.quaternion.copy(q); world.updateMatrixWorld(true);
    const cur = barrelWorld(a).normalize();
    let want;
    if (W.W.handling === 'pistol') { want = a.handR.getWorldPosition(V3()).sub(a.shR.getWorldPosition(V3())); want.y = 0; want.normalize(); }
    else want = fwd.clone().applyQuaternion(actorQ(a)).normalize();
    const qr = new THREE.Quaternion().setFromUnitVectors(cur, want);
    const pq = W.holder.parent.getWorldQuaternion(new THREE.Quaternion());
    const qLocal = pq.clone().invert().multiply(qr).multiply(pq).multiply(q);
    const grip = r1(2 * Math.acos(clamp(Math.abs(qr.w), -1, 1)) / D2R);
    return { q: qLocal, to: best.to, score: r3(best.score), second: rows[1] ? { to: rows[1].to, score: r3(rows[1].score) } : null, roll, upY: r3(upBest), gripDeg: grip, gripTo: W.W.handling === 'pistol' ? 'Schulter → Hand' : 'Torso vorn' };
  }
  function aimAt(a, layers) {
    poseRaw(a, layers);
    const d = toActorD(a, barrelWorld(a)), phi = Math.atan2(d.x, d.z);
    return { corr: -phi, yawDeg: r1(phi / D2R), pitchDeg: r1(Math.asin(clamp(d.y, -1, 1)) / D2R) };
  }

  /* ---- Messungen am Clip ---- */
  function armDir(a, f) { poseRaw(a, [['gun', f / FPS, 1]]); return toActorD(a, a.handR.getWorldPosition(V3()).sub(a.shR.getWorldPosition(V3())).normalize()); }
  function torsoFwdAt(a, f) { poseRaw(a, [['gun', f / FPS, 1]]); return torsoFwd(a); }
  function armLine(a, f) {
    poseRaw(a, [['gun', f / FPS, 1]]);
    const d = toActorD(a, a.handR.getWorldPosition(V3()).sub(a.shR.getWorldPosition(V3())).normalize());
    return { f, yawDeg: r1(Math.atan2(d.x, d.z) / D2R), pitchDeg: r1(Math.asin(clamp(d.y, -1, 1)) / D2R) };
  }
  function detectFire(a) {
    const c = a.clips.gun; if (!c) return { frames: [], method: 'kein Clip' };
    const n = Math.round(c.duration * FPS), P = [], Q = [], Y = [];
    for (let f = 0; f <= n; f++) { poseRaw(a, [['gun', f / FPS, 1]]); P.push(toActorP(a, a.handR.getWorldPosition(V3()))); Q.push(a.handR.getWorldQuaternion(new THREE.Quaternion())); Y.push(toActorP(a, a.shR.getWorldPosition(V3())).y); }
    const s = [0]; for (let f = 1; f <= n; f++) s.push(P[f].distanceTo(P[f - 1]) / a.H + Q[f].angleTo(Q[f - 1]) * 0.25);
    /* Ruck statt Tempo: Heben und Senken des Arms ist schnell, aber glatt. Der Rückstoß ist eine SPITZE gegen seine Nachbarschaft. */
    const pk = s.map((v, i) => v - ((s[i - 3] ?? v) + (s[i + 3] ?? v)) / 2);
    const vals = pk.slice(3, -3), mean = vals.reduce((x, y) => x + y, 0) / vals.length, sd = Math.sqrt(vals.reduce((x, y) => x + (y - mean) ** 2, 0) / vals.length);
    const thr = mean + 1.8 * sd, peaks = [];
    for (let i = 3; i < n - 3; i++) {
      if (!(pk[i] > thr && pk[i] >= pk[i - 1] && pk[i] >= pk[i + 1])) continue;
      if (P[i].y < Y[i] - 0.18 * a.H) continue;      // nur mit erhobenem Arm
      if (peaks.length && i - peaks[peaks.length - 1] < 12) { if (pk[i] > pk[peaks[peaks.length - 1]]) peaks[peaks.length - 1] = i; continue; }
      peaks.push(i);
    }
    const fwd0 = torsoFwdAt(a, 0);
    const okArm = (f) => { const L = armLine(a, f); const h = V3(Math.sin(L.yawDeg * D2R), 0, Math.cos(L.yawDeg * D2R)); return Math.abs(L.pitchDeg) <= 30 && h.dot(fwd0) >= Math.cos(55 * D2R); };
    const rejected = [];
    const frames = peaks.map((i) => Math.max(3, i - 1)).filter((f) => okArm(f) || (rejected.push(f), false));
    /* Haltepose: das früheste Bild vor dem Schuss, in dem der Arm schon auf derselben Linie liegt (≤ 8°) */
    const holds = frames.map((f) => { const L0 = armDir(a, f); let h = f; for (let g = f - 1; g >= Math.max(0, f - 24); g--) { if (armDir(a, g).angleTo(L0) <= 8 * D2R) h = g; else break; } return Math.min(h, f - 3); });
    if (frames.length) return { frames, holds, rejected, method: 'Ruck der Hand (Spitze > Mittel + 1,8 σ), Arm erhoben und nach vorn (±30° Neigung, ≤55° seitlich)', thr: r3(thr), peaks, arm: frames.map((f) => armLine(a, f)) };
    let best = 0, bx = -Infinity; for (let f = 0; f <= n; f++) { const z = P[f].z; if (z > bx && P[f].y >= Y[f] - 0.18 * a.H) { bx = z; best = f; } }
    const fb = clamp(best + 4, def.timing.pistolLead, n - 2);
    return { frames: [fb], holds: [fb - def.timing.pistolLead], rejected, method: 'GESCHÄTZT: kein Ruck mit zielendem Arm, Hand am weitesten vorn + 4 Bilder', thr: r3(thr), peaks: [] };
  }
  function detectRelease(a) {
    const c = a.clips.throw; if (!c) return null;
    const n = Math.round(c.duration * FPS); let prev = null, best = 0, bv = -1;
    for (let f = 0; f <= n; f++) { poseRaw(a, [['throw', f / FPS, 1]]); const p = toActorP(a, a.handR.getWorldPosition(V3())); if (prev) { const v = p.distanceTo(prev); if (v > bv && p.y > a.H * 0.45) { bv = v; best = f; } } prev = p; }
    return { frame: best, speedHperF: r3(bv / a.H), method: 'schnellstes Bild der Wurfhand über Hüfthöhe' };
  }
  function measureDodge(a, role) {
    const c = a.clips[role]; if (!c) return null;
    const n = Math.round(c.duration * FPS); let p0 = null, best = null, end = null;
    for (let f = 0; f <= n; f++) {
      poseRaw(a, [[role, f / FPS, 1]]); const h = toActorP(a, a.hips.getWorldPosition(V3()));
      if (!p0) p0 = h.clone(); const d = h.clone().sub(p0); d.y = 0;
      if (!best || Math.abs(d.x) > Math.abs(best.d.x)) best = { f, d: d.clone() };
      end = d.clone();
    }
    return { role, src: a.roles.report[role], peakF: best.f, peakT: best.f / FPS, peakLocal: best.d, endLocal: end, dur: c.duration, latM: r3(Math.abs(best.d.x)) };
  }
  function rifleStance(a) {
    const idle = a.clips.idle, up = a.clips.rifle; if (!idle || !up) return null;
    const rig = boneRig(a.actor); if (!rig.torso) return null;
    const names = subtreeNames(rig.torso), at = Math.min(def.roles.rifle.at ?? 0.3, up.duration);
    const lower = idle.tracks.filter((t) => !names.has(t.name.split('.')[0]));
    const upper = up.tracks.filter((t) => names.has(t.name.split('.')[0])).map((t) => new t.constructor(t.name, [0], Array.from(t.createInterpolant().evaluate(at))));
    a.facts.rifle = { torso: rig.torso.name, lower: lower.length, upper: upper.length, at };
    return new THREE.AnimationClip('stance_rifle', idle.duration, [...lower, ...upper]);
  }

  /* ---- Kämpfer ---- */
  const inst = {};
  function fighterFor(slot, fid) {
    const k = slot + '|' + fid; if (inst[k]) return inst[k];
    inst[k] = (async () => {
      const F = def.fighters[fid]; onProgress(F.label);
      const actor = await instance(F.asset.path, F.asset.commit || undefined);
      let skin = null; if (F.skin) skin = await applySkin(actor, F.skin.path, F.skin.commit || undefined);
      let rigNode = null; actor.traverse((o) => { if (!rigNode && RIGNODE.test(o.name) && !o.isBone) rigNode = o; });
      const rigNodeWas = rigNode ? rigNode.position.toArray().map(r3) : null; if (rigNode) rigNode.position.set(0, 0, 0);
      actor.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } });
      actor.updateWorldMatrix(true, true);
      const bb = new THREE.Box3().setFromObject(actor), H = bb.max.y - bb.min.y;   // Bind-Pose: hier lügt Box3 nicht
      const bone = (n) => { const f = findBone(actor, n); return f && f.bone; };
      const R = await rolesFor(F.rig || 'Rig_Medium');
      const a = { slot, fid, F, rig: F.rig || 'Rig_Medium', actor, H, bone, hips: bone('hips'), chest: bone('chest') || bone('spine'), head: bone('head'), handR: bone('handslot.r'), shL: bone('upperarm.l'), shR: bone('upperarm.r'), roles: R, clips: Object.assign({}, R.clips), mixer: new THREE.AnimationMixer(actor), actions: new Map(), skin, rigNode: rigNode && rigNode.name, rigNodeWas, facts: {}, aimCache: new Map() };
      for (const [n, b] of Object.entries({ hips: a.hips, head: a.head, 'handslot.r': a.handR, 'upperarm.l': a.shL, 'upperarm.r': a.shR })) if (!b) missing.add(fid + ':Bone ' + n);
      a.bind = a.clips.gun ? bindReport(actor, a.clips.gun) : null;
      /* Blickrichtung aus den Schultern, in der Bind-Pose gegen +Z geeicht */
      if (a.shL && a.shR) { a.fwdSign = 1; const l = a.shL.getWorldPosition(V3()), r = a.shR.getWorldPosition(V3()); const f = V3().crossVectors(UP, r.sub(l)); a.fwdSign = f.z >= 0 ? 1 : -1; }
      a.clips.stance_rifle = rifleStance(a);
      return a;
    })();
    return inst[k];
  }
  async function weaponFor(a, wid) {
    if (a.weapon && a.weapon.id === wid) return a.weapon;
    if (a.weapon) a.weapon.holder.parent && a.weapon.holder.parent.remove(a.weapon.holder);
    a.weapons = a.weapons || {};
    if (!a.weapons[wid]) {
      const W = def.weapons[wid];
      let node;
      if (W.asset) { node = await instance(W.asset.path, W.asset.commit || undefined); const sk = W.skinBy && W.skinBy[a.fid]; if (sk) await applySkin(node, sk.path, sk.commit || undefined); }
      else node = dieMesh(a.H * W.dieH);
      node.name = 'weapon.' + wid;
      node.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } });
      const holder = new THREE.Group(); holder.name = 'weapon-holder.' + a.slot + '.' + wid; holder.add(node);
      a.weapons[wid] = { id: wid, W, node, holder, geo: null, spin: W.spin ? makeSpin(node, W.spin) : null, axis: null };
    }
    const w = a.weapons[wid];
    a.handR.add(w.holder); a.actor.updateWorldMatrix(true, true);
    w.ws = a.handR.getWorldScale(V3()).x || 1; w.holder.scale.setScalar(1 / w.ws);
    if (!w.geo) w.geo = w.W.asset ? muzzleOf(w.node) : { local: V3(), dir: V3(0, 0, 1), len: r3(a.H * w.W.dieH), slice: 0, verts: 0 };
    a.weapon = w;
    return w;
  }
  /* Haltung je Waffe: Schussbilder, Achse, Zielkorrektur — einmal gemessen, dann gecacht */
  function prepare(a) {
    const w = a.weapon, h = w.W.handling;
    if (h === 'pistol') {
      if (!a.facts.fire) a.facts.fire = detectFire(a);
      const aimF = a.facts.fire.holds[0];
      if (!w.axisFor || w.axisFor !== 'pistol') { w.axis = chooseAxis(a, [['gun', a.facts.fire.frames[0] / FPS, 1]]); w.axisFor = 'pistol'; }
      w.holder.quaternion.copy(w.axis.q);
      a.aimCache.clear();
      a.stance = { role: 'gun', from: aimF / FPS, rate: 0, loop: false, kind: 'Anschlag' };
      a.corrAt = (f) => { if (!a.aimCache.has(f)) a.aimCache.set(f, aimAt(a, [['gun', f / FPS, 1]])); return a.aimCache.get(f); };
      a.stanceAim = a.corrAt(a.facts.fire.frames[0]);
    } else if (h === 'rifle') {
      const role = a.clips.stance_rifle ? 'stance_rifle' : 'idle';
      if (!w.axisFor || w.axisFor !== 'rifle') { w.axis = chooseAxis(a, [[role, 0, 1]]); w.axisFor = 'rifle'; }
      w.holder.quaternion.copy(w.axis.q);
      a.stance = { role, from: 0, rate: 1, loop: true, kind: 'Anschlag' };
      a.stanceAim = aimAt(a, [[role, 0, 1]]); a.corrAt = () => a.stanceAim;
    } else {
      w.holder.quaternion.identity(); w.axis = { to: [0, 0, 1], score: null, roll: 0 };
      if (!a.facts.release) a.facts.release = detectRelease(a);
      a.stance = { role: 'idle', from: 0, rate: 1, loop: true, kind: 'Stand' };
      a.stanceAim = { corr: 0, yawDeg: 0, pitchDeg: 0 }; a.corrAt = () => a.stanceAim;
    }
    if (!a.facts.dodge) a.facts.dodge = { L: measureDodge(a, 'dodgeL'), R: measureDodge(a, 'dodgeR') };
  }

  /* ---- Slots ---- */
  const slots = {};
  for (const k of ['A', 'B']) {
    const anchor = new THREE.Group(), squash = new THREE.Group(), kick = new THREE.Group();
    anchor.name = 'duelist.' + k; squash.name = 'duelist.' + k + '.squash'; kick.name = 'duelist.' + k + '.kick';
    anchor.add(squash); squash.add(kick);
    anchor.userData.entry = { id: 'duelist.' + k, scope: 'requisite', kind: 'performer', role: 'Duellant ' + k };
    pair.add(anchor); nodes.set(anchor.userData.entry.id, anchor);
    slots[k] = { k, anchor, squash, kick, a: null };
  }

  /* ---- Zustand ---- */
  const S = Object.assign({ t: 0, playing: false, speed: 1, loop: true, ready: false, busy: null, custom: [] }, { A: Object.assign({}, def.defaults.A), B: Object.assign({}, def.defaults.B), script: def.defaults.script });
  const fx = Object.assign({}, FX_DEFAULTS);
  let plan = null;
  const listeners = new Set(); const changed = () => { for (const f of listeners) f(); };
  const canonOf = (W) => CAN.weapons[W.canon];
  const scriptBeats = () => S.script === 'custom' ? S.custom : (def.scripts[S.script] || def.scripts[def.defaults.script]).beats;

  /* ---- Plan ---- */
  const segTime = (a, s, tc) => {
    const c = a.clips[s.role]; if (!c) return 0; const dur = c.duration;
    let x = s.from + (tc - s.t0) * (s.rate ?? 1);
    return s.loop ? ((x % dur) + dur) % dur : clamp(x, 0, dur - 1e-4);
  };
  function trackState(a, tr, tc) {
    let i = -1; for (let k = 0; k < tr.length; k++) { if (tr[k].t0 <= tc + 1e-9) i = k; else break; }
    if (i < 0) i = 0;
    const s = tr[i], k = i > 0 ? smooth((tc - s.t0) / Math.max(1e-6, s.blend ?? fx.blend)) : 1;
    const layers = [[s.role, segTime(a, s, tc), k]]; let yaw = s.yaw, off = s.off.clone();
    if (k < 1) { const p = tr[i - 1]; layers.push([p.role, segTime(a, p, tc), 1 - k]); yaw = lerpAng(p.yaw, s.yaw, k); off = p.off.clone().lerp(s.off, k); }
    return { layers, yaw, off, seg: s };
  }
  function pushAt(P, k, tc) {
    const v = V3(); for (const p of P.pushes) if (p.k === k && tc > p.t) v.addScaledVector(p.dir, p.dist * smooth((tc - p.t) / 0.12)); return v;
  }
  function poseAll(P, tc, tReal, full) {
    for (const k of ['A', 'B']) {
      const sl = slots[k], a = sl.a, st = trackState(a, P.tracks[k], tc);
      sl.anchor.position.copy(P.base[k]).add(st.off).add(pushAt(P, k, tc)); sl.anchor.rotation.set(0, st.yaw, 0);
      sl.squash.scale.set(1, 1, 1); sl.kick.position.set(0, 0, 0); sl.kick.rotation.set(0, 0, 0);
      if (full) {
        let e = 0; for (const h of P.hits) if (h.tg === k) e = Math.max(e, squashEnv(tReal - h.tReal));
        if (e > 0) sl.squash.scale.set(1 + 0.1 * fx.squash * e, 1 - 0.1 * fx.squash * e, 1 + 0.1 * fx.squash * e);
        let r = 0, kick = 0; for (const q of P.recoils) if (q.k === k) { const x = kickEnv(tc - q.t); if (x > r) { r = x; kick = q.kick; } }
        if (r > 0) { sl.kick.position.z = -kick * P.u * 1.6 * fx.recoil * r; sl.kick.rotation.x = -0.05 * fx.recoil * r; }
      }
      poseLayers(a, st.layers); sl.seg = st.seg;
    }
    world.updateMatrixWorld(true);
  }
  const squashEnv = (age) => { const Q = 6 / FPS; if (age < 0 || age >= Q) return 0; const k = age / Q; return k < 0.15 ? k / 0.15 : Math.pow(1 - (k - 0.15) / 0.85, 2); };
  const kickEnv = (age) => { if (age < 0 || age > 0.28) return 0; return age < 2 / FPS ? age / (2 / FPS) : Math.pow(1 - (age - 2 / FPS) / (0.28 - 2 / FPS), 2); };
  const yawTo = (P, k) => { const o = k === 'A' ? 'B' : 'A', d = P.base[o].clone().add(P.off[o]).sub(P.base[k]).sub(P.off[k]); return Math.atan2(d.x, d.z); };
  const stanceSeg = (P, k, t0) => { const a = slots[k].a, s = a.stance; return { role: s.role, t0, from: s.from, rate: s.rate, loop: s.loop, yaw: yawTo(P, k) + a.stanceAim.corr, off: P.off[k].clone(), kind: s.kind }; };
  function pushSeg(P, k, seg) { const tr = P.tracks[k]; const last = tr[tr.length - 1]; if (last && seg.t0 < last.t0 + 0.02) seg.t0 = last.t0 + 0.02; tr.push(seg); return seg; }

  function buildPlan() {
    const A = slots.A.a, B = slots.B.a, H = Math.max(A.H, B.H), D = fx.dist * H, u = H / CAN.unitFigureU;
    const P = { H, D, u, base: { A: V3(-D / 2, 0, 0), B: V3(D / 2, 0, 0) }, yaw0: { A: Math.PI / 2, B: -Math.PI / 2 }, tracks: { A: [], B: [] }, off: { A: V3(), B: V3() }, shots: [], hits: [], stops: [], pushes: [], recoils: [], spins: [], dieHide: [], beats: [], dead: {}, n: { A: 0, B: 0 }, miss: 0, dodgeSide: { A: 0, B: 0 }, faceShift: 0, faceMin: Infinity };
    for (const k of ['A', 'B']) P.tracks[k].push(stanceSeg(P, k, 0));
    let T = def.timing.standoff;
    scriptBeats().forEach((b, bi) => {
      const sh = b.s, tg = sh === 'A' ? 'B' : 'A';
      if (P.dead[sh] || P.dead[tg]) { P.beats.push({ i: bi, b, skipped: 'tot' }); return; }
      T = planShot(P, sh, tg, b, T, bi) + (b.gap ?? def.timing.gap);
    });
    P.total = T + 1.2;
    P.stops.sort((x, y) => x.t - y.t);
    let acc = 0; for (const s of P.stops) { s.tReal = s.t + acc; acc += s.d; }
    P.stopSum = acc; P.totalReal = P.total + acc;
    for (const h of P.hits) h.tReal = unwarp(P, h.t);
    return P;
  }
  function warp(P, tReal) { let acc = 0; for (const s of P.stops) { const sr = s.t + acc; if (tReal < sr) break; if (tReal < sr + s.d) return s.t; acc += s.d; } return tReal - acc; }
  function unwarp(P, tc) { let acc = 0; for (const s of P.stops) { if (s.t < tc - 1e-9) acc += s.d; else break; } return tc + acc; }

  function planShot(P, sh, tg, b, T, bi) {
    const a = slots[sh].a, t = slots[tg].a, W = a.weapon.W, C = canonOf(W), E = CAN.energy[C.energy] || CAN.energy.kinetic;
    const fires = []; let segEnd = T;
    if (W.handling === 'pistol') {
      const FF = a.facts.fire.frames, idx = P.n[sh] % FF.length, ff = FF[idx], from = Math.min(a.facts.fire.holds[idx], ff - 3);
      const aim = a.corrAt(ff);
      const missYaw = b.o === 'miss' ? Math.atan2(((P.miss % 2) ? -1 : 1) * 0.32 * t.H, P.D) : 0;
      pushSeg(P, sh, { role: 'gun', t0: T, from: from / FPS, rate: 1, loop: false, yaw: yawTo(P, sh) + aim.corr - missYaw, off: P.off[sh].clone(), kind: 'Schuss', fireF: ff });
      fires.push(T + (ff - from) / FPS); segEnd = T + (ff - from + def.timing.pistolFollow) / FPS;
      pushSeg(P, sh, stanceSeg(P, sh, segEnd));
    } else if (W.handling === 'rifle') {
      const n = W.burst || 1;
      for (let i = 0; i < n; i++) fires.push(T + (C.ant || 0) + i * (n > 1 ? C.rate : 0));
      segEnd = fires[fires.length - 1] + 0.3;
      for (const f of fires) P.recoils.push({ k: sh, t: f, kick: C.kick });
      if (a.weapon.spin) P.spins.push({ k: sh, t0: T, t1: segEnd + 0.5 });
    } else {
      const rel = a.facts.release ? a.facts.release.frame : 20;
      pushSeg(P, sh, { role: 'throw', t0: T, from: 0, rate: 1, loop: false, yaw: yawTo(P, sh), off: P.off[sh].clone(), kind: 'Wurf' });
      fires.push(T + rel / FPS); segEnd = T + (a.clips.throw ? a.clips.throw.duration : 1.2);
      P.dieHide.push({ k: sh, t0: fires[0], t1: segEnd - 0.2 });
      pushSeg(P, sh, stanceSeg(P, sh, segEnd));
    }
    P.n[sh]++;
    const beat = { i: bi, b, sh, tg, t0: T, shots: [] }; P.beats.push(beat);
    let next = segEnd;
    const bodyR = 0.2 * t.H, clr = 0.12 * t.H;
    fires.forEach((f, i) => {
      const o = i === fires.length - 1 ? b.o : 'miss';
      poseAll(P, f, f, false);
      const mz = muzzleWorld(a), bd = barrelWorld(a), hand = a.handR.getWorldPosition(V3());
      const chest = t.chest.getWorldPosition(V3()), head = t.head.getWorldPosition(V3());
      const flat = chest.clone().sub(mz); flat.y = 0; flat.normalize(); const side = V3(-flat.z, 0, flat.x);
      const dice = C.ammo === 'dice';
      const v = C.speed * P.u * (dice ? 1 : fx.projSpeed);
      let aim = chest.clone(), dodge = null;
      if (o === 'dodge') {
        const sideKey = (P.dodgeSide[tg]++ % 2) ? 'R' : 'L', dc = t.facts.dodge[sideKey] || t.facts.dodge.L || t.facts.dodge.R;
        if (dc) {
          const tf0 = mz.distanceTo(chest) / v, start = f + tf0 - dc.peakT;
          const ty = yawTo(P, tg);
          pushSeg(P, tg, { role: dc.role, t0: start, from: 0, rate: 1, loop: false, yaw: ty, off: P.off[tg].clone(), kind: 'Ausweichen' });
          const disp = dc.peakLocal.clone().applyAxisAngle(UP, ty), lat = disp.dot(side);
          P.off[tg] = P.off[tg].clone().add(dc.endLocal.clone().applyAxisAngle(UP, ty));
          const end = start + dc.dur; pushSeg(P, tg, stanceSeg(P, tg, end));
          const help = Math.max(0, bodyR + clr - Math.abs(lat));
          aim.addScaledVector(side, -(Math.sign(lat) || 1) * help);
          dodge = { role: dc.role, src: dc.src, latM: r3(Math.abs(lat)), helpM: r3(help) };
          next = Math.max(next, end);
        } else aim.addScaledVector(side, bodyR + clr);
      } else if (o === 'miss') {
        aim.addScaledVector(side, ((P.miss++ % 2) ? -1 : 1) * (bodyR + clr));
      }
      const dist = mz.distanceTo(aim);
      let tf, vel, vy0 = 0, g = 0;
      if (dice) { const hd = Math.hypot(aim.x - mz.x, aim.z - mz.z); tf = hd / v; g = C.gravity * P.u; vy0 = (aim.y - mz.y + 0.5 * g * tf * tf) / tf * (C.arc ?? 1); vel = V3(aim.x - mz.x, 0, aim.z - mz.z).normalize().multiplyScalar(v); }
      else { tf = dist / v; vel = aim.clone().sub(mz).normalize().multiplyScalar(v); }
      const shot = { k: sh, tg, beat: bi, i, burstN: fires.length, f, from: mz, to: aim, vel, vy0, g, tf, hitT: f + tf, outcome: o, C, dice, dodge,
        barrelErrDeg: r1(Math.acos(clamp(bd.clone().normalize().dot(vel.clone().normalize()), -1, 1)) / D2R),
        handToMuzzleH: r3(hand.distanceTo(mz) / a.H), fireF: W.handling === 'pistol' ? P.tracks[sh].filter((s) => s.kind === 'Schuss').slice(-1)[0].fireF : null };
      shot.tEnd = (o === 'hit' || o === 'kill') ? shot.hitT : f + (dice ? 2.2 : tf * 2.2);
      P.shots.push(shot); beat.shots.push(P.shots.length - 1);
      if (o === 'hit' || o === 'kill') {
        /* Schutzzone (Arena C9): kein Puff im Gesicht — verschieben, nicht weglassen */
        const zone = CAN.faceZoneH * t.H; let at = aim.clone(); const dh = at.distanceTo(head);
        P.faceMin = Math.min(P.faceMin, dh - zone);
        if (dh < zone) { at = head.clone().add(at.clone().sub(head).multiplyScalar(zone / Math.max(1e-3, dh))); P.faceShift++; }
        const dir = vel.clone(); dir.y = 0; dir.normalize();
        const surf = CAN.surfaces[t.F.surface] || CAN.surfaces.flesh;
        P.hits.push({ t: shot.hitT, tg, sh, at, dir, tint: surf.tint, heavy: o === 'kill', shot: P.shots.length - 1 });
        P.stops.push({ t: shot.hitT, d: E.stop * fx.hitStop * (o === 'kill' ? 1.5 : 1) });
        P.pushes.push({ k: tg, t: shot.hitT, dir, dist: E.knock * P.u * fx.knock * (o === 'kill' ? 1.3 : 1) });
        if (o === 'kill') { pushSeg(P, tg, { role: 'death', t0: shot.hitT, from: 0, rate: 1, loop: false, yaw: yawTo(P, tg), off: P.off[tg].clone(), kind: 'K.o.' }); P.dead[tg] = true; next = Math.max(next, shot.hitT + 1.4); }
        else { const hd = t.clips.hit ? t.clips.hit.duration : 0.6; pushSeg(P, tg, { role: 'hit', t0: shot.hitT, from: 0, rate: 1, loop: false, yaw: yawTo(P, tg), off: P.off[tg].clone(), kind: 'Treffer' }); pushSeg(P, tg, stanceSeg(P, tg, shot.hitT + hd)); next = Math.max(next, shot.hitT + hd * 0.7); }
      } else next = Math.max(next, Math.min(shot.tEnd, shot.hitT + 0.4));
    });
    return next;
  }

  /* ---- Effekte je Plan bauen ---- */
  let built = [];
  function buildFx() {
    for (const o of built) fxRoot.remove(o); built = [];
    while (dbg.children.length) dbg.remove(dbg.children[0]);
    const P = plan;
    P.shots.forEach((s, i) => {
      const A = CAN.ammo[s.C.ammo] || { len: 0.5, wid: 0.3 };
      s.mesh = ammoMesh(s.C, A.len * P.u * fx.ammoSize, A.wid * P.u * fx.ammoSize, slots[s.k].a.H * (def.weapons[slots[s.k].a.weapon.id].dieH || 0.14));
      s.mesh.name = 'fx.shot.' + s.k + '.' + i; s.mesh.visible = false;
      s.flash = flashMesh(s.C, 0.09 * P.H * s.C.muzSize); s.flash.position.copy(s.from); s.flash.lookAt(s.from.clone().add(s.vel)); s.flash.visible = false;
      fxRoot.add(s.mesh, s.flash); built.push(s.mesh, s.flash);
      const lg = new THREE.BufferGeometry().setFromPoints([s.from, s.to]);
      const ln = new THREE.Line(lg, new THREE.LineBasicMaterial({ color: s.outcome === 'hit' || s.outcome === 'kill' ? 0xb8361f : 0x3f6f9c, depthTest: false, transparent: true, opacity: 0.8 }));
      ln.renderOrder = 5; dbg.add(ln);
    });
    P.hits.forEach((h, i) => { h.puff = makePuff(17 + i * 7, h.tint); h.puff.g.position.copy(h.at); fxRoot.add(h.puff.g); built.push(h.puff.g); });
  }
  function shotPos(s, dt) {
    if (!s.dice) return s.from.clone().addScaledVector(s.vel, dt);
    const floor = 0.06 * slots[s.k].a.H;
    let p = s.from.clone().addScaledVector(s.vel, dt); p.y = s.from.y + s.vy0 * dt - 0.5 * s.g * dt * dt;
    if (p.y >= floor || s.outcome === 'hit' || s.outcome === 'kill') return p;
    /* Aufprallen statt Verschwinden (Arena 06.09.): ein Sprung mit Restitution 0,42, dann liegen */
    const a = -0.5 * s.g, bq = s.vy0, c = s.from.y - floor, tg = (-bq - Math.sqrt(Math.max(0, bq * bq - 4 * a * c))) / (2 * a);
    const vyg = s.vy0 - s.g * tg, vy1 = -vyg * 0.42, d2 = dt - tg, t2 = Math.max(0, 2 * vy1 / s.g);
    const base = s.from.clone().addScaledVector(s.vel, tg); base.y = floor;
    if (d2 <= t2) { base.addScaledVector(s.vel, 0.72 * d2); base.y = floor + vy1 * d2 - 0.5 * s.g * d2 * d2; return base; }
    base.addScaledVector(s.vel, 0.72 * t2 + 0.2 * Math.min(0.4, d2 - t2)); base.y = floor; return base;
  }
  function driveFx(P, tc, tReal) {
    for (const s of P.shots) {
      const dt = tc - s.f, on = dt >= 0 && tc <= s.tEnd;
      s.mesh.visible = on;
      if (on) {
        const p = shotPos(s, dt); s.mesh.position.copy(p);
        if (s.dice) { s.mesh.rotation.set(dt * 7.1, dt * 5.3, dt * 3.7); }
        else s.mesh.lookAt(p.clone().add(s.vel));
      }
      s.flash.visible = dt >= 0 && dt <= s.C.muzMs / 1000;
    }
    for (const h of P.hits) drivePuff(h.puff, tReal - h.tReal, fx.puff * slots[h.tg].a.H * (h.heavy ? 1.4 : 1));
    for (const k of ['A', 'B']) {
      const a = slots[k].a, w = a.weapon; if (!w) continue;
      if (w.spin) { let ang = 0; for (const e of P.spins) if (e.k === k && tc > e.t0) { const up = Math.min(tc, e.t1) - e.t0; ang += up * w.spin.rps * 2 * Math.PI; } w.spin.piv.quaternion.setFromAxisAngle(w.spin.axis, ang); }
      if (w.W.handling === 'throw') w.node.visible = !P.dieHide.some((d) => d.k === k && tc >= d.t0 && tc < d.t1);
    }
  }
  function phaseAt(P, tc) {
    let b = null; for (const x of P.beats) if (!x.skipped && x.t0 <= tc) b = x;
    const segs = ['A', 'B'].map((k) => (slots[k].seg ? slots[k].seg.kind : '–'));
    return (b ? 'Beat ' + (b.i + 1) + ' · ' + b.sh + ' → ' + OUT_DE[b.b.o] : 'Standoff') + ' · A ' + segs[0] + ' · B ' + segs[1];
  }

  let last = null;
  function evaluate() {
    if (!plan) return;
    const P = plan, tReal = S.loop && P.totalReal > 0 ? S.t % P.totalReal : Math.min(S.t, P.totalReal), tc = warp(P, tReal);
    poseAll(P, tc, tReal, true); driveFx(P, tc, tReal);
    dbg.visible = !!fx.debug;
    last = { tReal, tc, phase: phaseAt(P, tc), stopped: Math.abs(tReal - unwarp(P, tc)) > 1e-6 };
    world.updateMatrixWorld(true);
  }

  function stage(quiet) {
    if (!slots.A.a || !slots.B.a) return;
    for (const k of ['A', 'B']) prepare(slots[k].a);
    plan = buildPlan(); buildFx();
    const R = plan.D / 2 + plan.H * 1.1;
    pad.scale.set(R, 1, R * 0.62); lane.scale.set(plan.D, 1, 0.05 * plan.H);
    marks.forEach((m, i) => { m.scale.set(0.28 * plan.H, 1, 0.28 * plan.H); m.position.x = (i ? 1 : -1) * plan.D / 2; });
    S.t = Math.min(S.t, plan.totalReal); evaluate(); if (!quiet) changed();
  }
  async function setLoadout(patch = {}) {
    if (patch.A) Object.assign(S.A, patch.A); if (patch.B) Object.assign(S.B, patch.B);
    S.busy = 'lade ' + def.fighters[S.A.fighter].label + ' / ' + def.fighters[S.B.fighter].label; changed();
    const [a, b] = await Promise.all([fighterFor('A', S.A.fighter), fighterFor('B', S.B.fighter)]);
    for (const [k, x] of [['A', a], ['B', b]]) {
      const sl = slots[k];
      if (sl.a && sl.a !== x) sl.kick.remove(sl.a.actor);
      sl.a = x; sl.kick.add(x.actor);
      await weaponFor(x, S[k].weapon);
      sl.anchor.userData.entry.a = x.F.asset.path;
      sl.anchor.userData.entry.role = 'Duellant ' + k + ' · ' + x.F.label + ' · ' + def.weapons[S[k].weapon].label;
    }
    S.busy = null; S.ready = true; S.t = 0;
    stage();
  }

  /* ---- Abnahme: was dieser Lauf beweisen muss, als Zahlen ---- */
  function measure() {
    const P = plan; if (!P) return null;
    const hits = P.hits.length, kills = P.hits.filter((h) => h.heavy).length;
    const by = (o) => P.shots.filter((s) => s.outcome === o).length;
    const reacts = ['A', 'B'].reduce((n, k) => n + P.tracks[k].filter((s) => s.kind === 'Treffer' || s.kind === 'K.o.').length, 0);
    const guns = P.shots.filter((s) => !s.dice && !(s.i < s.burstN - 1));
    const errs = guns.map((s) => s.barrelErrDeg), worst = Math.max(0, ...errs);
    const hm = guns.length ? guns.map((s) => s.handToMuzzleH) : [1];
    return {
      shots: P.shots.length, hits: hits - kills, kills, miss: by('miss'), dodged: by('dodge'), puffs: P.hits.length, reactions: reacts,
      chain: { pass: P.hits.length === reacts && P.shots.length === by('miss') + by('dodge') + hits, text: P.shots.length + ' Schüsse = ' + by('miss') + ' Fehl + ' + by('dodge') + ' ausgewichen + ' + hits + ' Treffer · ' + P.hits.length + ' Puffs = ' + reacts + ' Reaktionen' },
      barrel: { worstDeg: r1(worst), pass: worst <= 12, perShot: errs },
      muzzle: { minHandH: r3(Math.min(...hm)), pass: Math.min(...hm) >= 0.04 },
      face: { minM: P.faceMin === Infinity ? null : r3(P.faceMin), shifted: P.faceShift, zoneM: r3(CAN.faceZoneH * P.H) },
      dodges: P.shots.filter((s) => s.dodge).map((s) => s.dodge),
      timing: { totalS: r3(P.totalReal), stopsS: r3(P.stopSum) }
    };
  }

  /* ---- Urteile ---- */
  const VKEY = 'kfb.gunfight-duel.verdicts.v1';
  let verdicts = {}; try { verdicts = JSON.parse(localStorage.getItem(VKEY) || '{}'); } catch {}
  const vkey = () => S.script + '|' + S.A.fighter + ':' + S.A.weapon + '|' + S.B.fighter + ':' + S.B.weapon;
  function setVerdict(v, note) {
    const k = vkey(), cur = verdicts[k] || {};
    verdicts[k] = { script: S.script, beats: scriptBeats().map((b) => b.s + ':' + b.o), A: Object.assign({}, S.A), B: Object.assign({}, S.B), fx: Object.assign({}, fx), measure: measure(), verdict: v ?? cur.verdict ?? null, note: note ?? cur.note ?? '', at: new Date().toISOString() };
    try { localStorage.setItem(VKEY, JSON.stringify(verdicts)); } catch {}
    changed();
  }
  const verdictDoc = () => ({ schema: def.verdictSchema, date: new Date().toISOString().slice(0, 10), source: def.source, fxDefaults: FX_DEFAULTS, verdicts: Object.values(verdicts) });

  function facts() {
    return ['A', 'B'].map((k) => {
      const a = slots[k].a; if (!a) return null; const w = a.weapon;
      return { k, label: a.F.label, H: r3(a.H), rig: a.rig, rigNode: a.rigNode, rigNodeWas: a.rigNodeWas, skin: a.skin ? a.skin.swapped : 0, bind: a.bind, roles: a.roles.report,
        weapon: w && { id: w.id, label: w.W.label, handling: w.W.handling, canon: canonOf(w.W).name, axisTo: w.axis && w.axis.to, axisScore: w.axis && w.axis.score, second: w.axis && w.axis.second, roll: w.axis && w.axis.roll, upY: w.axis && w.axis.upY, gripDeg: w.axis && w.axis.gripDeg, gripTo: w.axis && w.axis.gripTo, muzzle: w.geo && { len: w.geo.len, slice: w.geo.slice, verts: w.geo.verts }, spin: w.spin && { rps: w.spin.rps, centerShift: w.spin.centerShift }, note: w.W.note },
        aim: a.stanceAim, fire: a.facts.fire || null, release: a.facts.release || null, rifle: a.facts.rifle || null,
        dodge: a.facts.dodge && { L: a.facts.dodge.L && { src: a.facts.dodge.L.src, latM: a.facts.dodge.L.latM, peakF: a.facts.dodge.L.peakF }, R: a.facts.dodge.R && { src: a.facts.dodge.R.src, latM: a.facts.dodge.R.latM, peakF: a.facts.dodge.R.peakF } } };
    }).filter(Boolean);
  }

  const M = {
    def, world, nodes, slots, S, fx, missing, OUT_DE,
    get plan() { return plan; }, get last() { return last; },
    onChange(f) { listeners.add(f); },
    attach() { V.scene.add(world); evaluate(); },
    detach() { V.scene.remove(world); S.playing = false; },
    post(dt) { if (!S.ready || !S.playing || !plan) return; S.t += Math.min(dt || 0, 0.1) * S.speed; if (!S.loop && S.t > plan.totalReal) { S.t = plan.totalReal; S.playing = false; changed(); } evaluate(); },
    async init() { await setLoadout(); },
    setLoadout, stage, measure, facts, setVerdict, verdictDoc, verdicts: () => verdicts, vkey, scriptBeats,
    set(patch) { Object.assign(S, patch); S.t = 0; stage(); },
    setFx(patch, restage = true) { Object.assign(fx, patch); if (restage) { const t = S.t; stage(true); S.t = Math.min(t, plan.totalReal); } evaluate(); },
    addBeat(s, o) { if (S.script !== 'custom') { S.custom = scriptBeats().map((b) => Object.assign({}, b)); S.script = 'custom'; } S.custom.push({ s, o }); S.t = 0; stage(); },
    popBeat() { if (S.script !== 'custom') return; S.custom.pop(); S.t = 0; stage(); },
    clearBeats() { S.custom = []; S.script = 'custom'; S.t = 0; stage(); },
    play() { S.playing = true; changed(); }, pause() { S.playing = false; changed(); },
    toggle() { S.playing = !S.playing; changed(); },
    replay() { S.t = 0; S.playing = true; evaluate(); changed(); },
    step(n) { S.playing = false; S.t = Math.max(0, S.t + n / FPS); evaluate(); changed(); },
    seek(t) { S.playing = false; S.t = clamp(t, 0, plan ? plan.totalReal : t); evaluate(); changed(); },
    seekShot(i) { const s = plan && plan.shots[i]; if (s) M.seek(unwarp(plan, s.f) - 0.02); },
    seekHit(i) { const h = plan && plan.hits[i]; if (h) M.seek(h.tReal + 0.03); },
    view(kind) {
      const px = inset(), Wd = V.renderer.domElement.clientWidth || 1;
      const padK = px > 0 && Wd > px ? Wd / (Wd - px) : 1;
      if (kind === 'top') V.frame(ground, [0, 1, 0.02], 1.0 * padK);
      else V.frame(ground, [0.001, 0.36, 1], 0.92 * padK);
      if (px > 0) {
        const cam = V.camera, tgt = V.controls.target, dist = cam.position.distanceTo(tgt);
        const hfov = 2 * Math.atan(Math.tan(cam.fov * D2R / 2) * cam.aspect), shift = 2 * dist * Math.tan(hfov / 2) * (px / 2) / Wd;
        const right = V3().subVectors(tgt, cam.position).cross(cam.up).normalize().multiplyScalar(shift);
        cam.position.add(right); tgt.add(right); V.controls.update();
      }
    },
    snapshot() {
      return { ready: S.ready, busy: S.busy, A: S.A, B: S.B, script: S.script, beats: scriptBeats(), t: S.t, total: plan ? plan.totalReal : 0, playing: S.playing, speed: S.speed, loop: S.loop, fx: Object.assign({}, fx),
        live: last && { phase: last.phase, tc: r3(last.tc), stopped: last.stopped, A: slots.A.a && slots.A.a.layers, B: slots.B.a && slots.B.a.layers },
        shots: plan ? plan.shots.map((s) => ({ k: s.k, outcome: s.outcome, f: r3(s.f), hitT: r3(s.hitT), barrelErrDeg: s.barrelErrDeg, fireF: s.fireF, dodge: s.dodge })) : [],
        missing: [...missing] };
    }
  };
  return M;
}
