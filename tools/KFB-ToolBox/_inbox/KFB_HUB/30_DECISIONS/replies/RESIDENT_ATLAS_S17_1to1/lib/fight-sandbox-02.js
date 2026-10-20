/* KFB · RESIDENT-FIGHT-SANDBOX-02 · Cartoon-Kontakt. Niemand berührt sich.
   Köpfe und Körper bleiben getrennt. Den Treffer verkaufen Hit-Stop, Squash, Knet-Puff und
   Rückstoß vom Angreifer weg. EINZIGE Kampfdatenquelle: fight/KFB_Fight_Cartoon_Contact.json (0.2).
   Aus dem Katalog kommen nur Clip → GLB und, nur für die Staubwolke, die Blickrichtung der Loop-Clips.
   · Zeit wird gesetzt, nie fortgeschrieben. Einziger Zustand ist der Trennungs-Schub: Er wird ab
     t = 0 in 1/30-s-Schritten simuliert. Springt man zurück, wird neu simuliert. Damit sind Scrub,
     Zeitlupe und Messung deterministisch.
   · Blender (x, y, z) Z oben → three (x, z, −y). Blender-Gierwinkel θ → rotation.y = θ.
   · FRAME0 = 0 wie in S13 gemessen: Bild n liegt bei Zeit n / 30. */
import * as THREE from 'three';
import { loadAsset, instance, applySkin, bindReport, findBone } from './atlas.js';

export const SCHEMA = 'kfb.resident-fight-sandbox/2';
export const PAIRINGS = [['Rig_Medium', 'Rig_Medium'], ['Rig_Medium', 'Rig_Large'], ['Rig_Large', 'Rig_Medium'], ['Rig_Large', 'Rig_Large']];
export const FRAME0 = 0;
export const FX_DEFAULTS = { hit: 4, sqW: 1.1, sqH: 0.9, sqFrames: 6, puff: 0.25, nudge: false, debug: false, lock: true, sep: true };
export const LOCK_FRAMES = 15;
export const STRIKE_IDS = ['headbutt', 'kick_knockdown', 'flying_kick', 'prop_hit'];
const FPS = 30, DT = 1 / FPS, D2R = Math.PI / 180, IDLE = 'kfb_action_boxing_a';
const RUN = 'kfb_locomotion_run_a', FIST = 'kfb_action_fist_fight_a_a', TAKE = 'kfb_reaction_taking_punch_a';
const FALL = 'kfb_reaction_fall_flat_a', GETUP = 'kfb_reaction_getting_up_a', DIZZY = 'kfb_reaction_dizzy_idle_a';
const RIGNODE = /^Rig_(Medium|Large)$/;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const backOut = (x) => { const c = 1.9; x = clamp(x, 0, 1) - 1; return 1 + (c + 1) * x * x * x + c * x * x; };
const short = (id) => id.replace(/^kfb_(action|reaction|gesture|throw|locomotion)_/, '').replace(/_a$/, '');
const b2t = (a) => new THREE.Vector3(a[0], a[2], -a[1]);
const dirOf = (deg) => new THREE.Vector3(Math.cos(deg * D2R), 0, -Math.sin(deg * D2R));
const yawOf = (v) => Math.atan2(-v.z, v.x) / D2R;
const UP = new THREE.Vector3(0, 1, 0);
const r3 = (x) => +(+x).toFixed(3);
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* ---- Abstände: Kugel/Kapsel ---- */
const _d1 = new THREE.Vector3(), _d2 = new THREE.Vector3(), _r = new THREE.Vector3(), _c1 = new THREE.Vector3(), _c2 = new THREE.Vector3();
function segSeg(p1, q1, p2, q2) {
  const d1 = _d1.subVectors(q1, p1), d2 = _d2.subVectors(q2, p2), r = _r.subVectors(p1, p2);
  const a = d1.dot(d1), e = d2.dot(d2), f = d2.dot(r);
  let s, t;
  if (a <= 1e-9 && e <= 1e-9) return p1.distanceTo(p2);
  if (a <= 1e-9) { s = 0; t = clamp(f / e, 0, 1); }
  else {
    const c = d1.dot(r);
    if (e <= 1e-9) { t = 0; s = clamp(-c / a, 0, 1); }
    else {
      const b = d1.dot(d2), den = a * e - b * b;
      s = den > 1e-12 ? clamp((b * f - c * e) / den, 0, 1) : 0;
      t = (b * s + f) / e;
      if (t < 0) { t = 0; s = clamp(-c / a, 0, 1); } else if (t > 1) { t = 1; s = clamp((b - c) / a, 0, 1); }
    }
  }
  _c1.copy(p1).addScaledVector(d1, s); _c2.copy(p2).addScaledVector(d2, t);
  return _c1.distanceTo(_c2);
}
function ptSeg(p, a, b) {
  const ab = _d1.subVectors(b, a), t = clamp(_r.subVectors(p, a).dot(ab) / Math.max(1e-9, ab.dot(ab)), 0, 1);
  return _c1.copy(a).addScaledVector(ab, t).distanceTo(p);
}

export async function createFightSandbox({ V, def, onProgress = () => {}, inset = () => 0 }) {
  if (!def || def.schema !== SCHEMA) throw new Error('fight sandbox schema mismatch');
  const F = await (await fetch('./' + def.fightData.path)).json();
  if (F.schema !== def.fightData.schema) throw new Error('Kampfdaten ' + F.schema + ' ≠ ' + def.fightData.schema);
  const ML = def.motionLibrary;
  const loadCheck = { attacks: Object.keys(F.attacks).length, reactions: Object.keys(F.reactions).length, table: Object.keys(F.table).length, proofSet: F.proofSet.length };
  loadCheck.ok = Object.entries(def.expected).every(([k, v]) => loadCheck[k] === v);
  const sOf = (rig) => F.rigs[rig].scaleToMedium;

  const world = new THREE.Group(); world.name = 'fight-world';
  const pair = new THREE.Group(); pair.name = 'fight-pair'; world.add(pair);
  const nodes = new Map();

  /* ---- Ring · Platzhalter (wie Sandbox 01) ---- */
  const ring = new THREE.Group(); ring.name = 'fight-ring';
  ring.userData.entry = { id: 'fight-ring', scope: 'scenery', kind: 'prop', role: 'Ring · Platzhalter ' + def.ring.acrossM + ' m', a: 'primitive' };
  {
    const R = def.ring, h = R.acrossM / 2;
    const postM = new THREE.MeshStandardMaterial({ color: 0x8a7a66, roughness: 0.9 });
    const ropeM = new THREE.MeshStandardMaterial({ color: 0xc9b89a, roughness: 0.85 });
    const corners = [[-h, -h], [h, -h], [h, h], [-h, h]];
    for (const [x, z] of corners) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, R.postH, 10), postM); p.position.set(x, R.postH / 2, z); p.castShadow = true; ring.add(p); }
    for (let i = 0; i < 4; i++) {
      const [x0, z0] = corners[i], [x1, z1] = corners[(i + 1) % 4], len = Math.hypot(x1 - x0, z1 - z0);
      for (const y of R.ropes) { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, len, 6), ropeM); r.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); r.rotation.z = Math.PI / 2; r.rotation.y = -Math.atan2(z1 - z0, x1 - x0); r.castShadow = true; ring.add(r); }
    }
  }
  world.add(ring); nodes.set('fight-ring', ring);

  /* ---- Knet-Puff und Staubwolke: gleiche Knet-Klumpen, ein Material ---- */
  /* Heller als der Ringboden (0xc9b89a), sonst verschwindet der Puff vor ihm. */
  const clayM = new THREE.MeshStandardMaterial({ color: 0xf0e6d2, roughness: 0.95, metalness: 0, emissive: 0x2a2218 });
  const blobG = (() => {
    const g = new THREE.SphereGeometry(1, 18, 12), p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); v.multiplyScalar(1 + 0.10 * Math.sin(v.x * 5.3 + 1.7) * Math.sin(v.y * 4.1 + 0.4) + 0.06 * Math.sin(v.z * 7.9 + v.x * 3.1)); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals(); return g;
  })();
  function blobs(n, seed, name, fib) {
    const g = new THREE.Group(); g.name = name; g.visible = false; const r = rng(seed), list = [];
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(blobG, clayM); m.rotation.set(r() * 6, r() * 6, r() * 6); m.castShadow = false;
      let dir;
      if (fib) { const y = 1 - 2 * (i + 0.5) / n, rr = Math.sqrt(1 - y * y), th = i * 2.39996; dir = new THREE.Vector3(Math.cos(th) * rr, y, Math.sin(th) * rr); }
      else dir = new THREE.Vector3(r() * 2 - 1, r() * 1.4 - 0.4, r() * 2 - 1).normalize();
      list.push({ m, dir, k: 0.6 + 0.4 * r(), ph: r() * 6.28 }); g.add(m);
    }
    world.add(g); return { g, list };
  }
  const puff = blobs(9, 7, 'fx.clay-puff', false), cloud = blobs(22, 11, 'fx.dust-cloud', true);
  const PUFF_LIFE = 0.6;
  /* size = Radius der Puff-Wolke. Zwischen zwei 1-m-Raider-Köpfen mit 5 cm Luft verschwand eine
     Wolke mit 0,25 m Durchmesser ganz in den Köpfen. */
  function drivePuff(age, at, size) {
    if (age == null || age < 0 || age > PUFF_LIFE) { puff.g.visible = false; return; }
    puff.g.visible = true; puff.g.position.copy(at);
    const grow = 0.35 + 0.65 * backOut(age / 0.06), fade = age < 0.18 ? 1 : Math.pow(1 - (age - 0.18) / (PUFF_LIFE - 0.18), 1.4);
    for (const b of puff.list) {
      b.m.scale.setScalar(Math.max(1e-4, size * 0.55 * b.k * grow * fade));
      b.m.position.copy(b.dir).multiplyScalar(size * (0.45 + 0.6 * age / PUFF_LIFE) * b.k);
      b.m.position.y += size * 0.5 * age / PUFF_LIFE;
    }
    puff.size = size;
  }
  function driveCloud(t, C, Rc, Hh, amt, rise) {
    if (!(amt > 0)) { cloud.g.visible = false; return; }
    cloud.g.visible = true; cloud.g.position.copy(C); cloud.g.position.y += rise || 0;
    for (const b of cloud.list) {
      const w = 1 + 0.14 * Math.sin(t * 7 + b.ph);
      b.m.scale.setScalar(Math.max(1e-4, Math.min(Rc, Hh) * 0.66 * b.k * w * amt));
      b.m.position.set(b.dir.x * Rc * 0.72, Hh + b.dir.y * Hh * 0.72, b.dir.z * Rc * 0.62);
    }
  }

  /* ---- Debug-Formen ---- */
  const dbg = new THREE.Group(); dbg.name = 'fight.debug-shapes'; dbg.visible = false; world.add(dbg);
  /* Linien statt Drahtgitter: Vier überlagerte Drahtkugeln deckten den Puff im Hit-Stop fast ganz zu. */
  const ringSphereG = (() => { const p = [], n = 48; for (let a = 0; a < 3; a++) for (let i = 0; i < n; i++) { const t0 = i / n * Math.PI * 2, t1 = (i + 1) / n * Math.PI * 2; const c = (t) => a === 0 ? [Math.cos(t), Math.sin(t), 0] : a === 1 ? [Math.cos(t), 0, Math.sin(t)] : [0, Math.cos(t), Math.sin(t)]; p.push(...c(t0), ...c(t1)); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); return g; })();
  const ringCylG = (() => { const p = [], n = 48; for (const y of [-0.5, 0.5]) for (let i = 0; i < n; i++) { const t0 = i / n * Math.PI * 2, t1 = (i + 1) / n * Math.PI * 2; p.push(Math.cos(t0), y, Math.sin(t0), Math.cos(t1), y, Math.sin(t1)); } for (let i = 0; i < 4; i++) { const t = i * Math.PI / 2; p.push(Math.cos(t), -0.5, Math.sin(t), Math.cos(t), 0.5, Math.sin(t)); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); return g; })();
  function dbgSet(color) {
    const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9, depthTest: false, depthWrite: false });
    const head = new THREE.LineSegments(ringSphereG, m), cyl = new THREE.LineSegments(ringCylG, m);
    const e0 = new THREE.LineSegments(ringSphereG, m), e1 = new THREE.LineSegments(ringSphereG, m);
    for (const x of [head, cyl, e0, e1]) { x.renderOrder = 5; x.frustumCulled = false; dbg.add(x); }
    return { head, cyl, e0, e1 };
  }
  const dbgA = dbgSet(0x2f8fbf), dbgB = dbgSet(0xd0603a);
  const puffMark = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), new THREE.MeshBasicMaterial({ color: 0xe08a1e, depthTest: false }));
  puffMark.renderOrder = 6; puffMark.visible = false; dbg.add(puffMark);
  const _t = new THREE.Vector3();
  function dbgUpdate(D, sh) {
    D.head.position.copy(sh.hc); D.head.scale.setScalar(sh.hr);
    const len = Math.max(1e-3, sh.c0.distanceTo(sh.c1));
    D.cyl.position.addVectors(sh.c0, sh.c1).multiplyScalar(0.5); D.cyl.scale.set(sh.cr, len, sh.cr);
    D.cyl.quaternion.setFromUnitVectors(UP, _t.subVectors(sh.c1, sh.c0).normalize());
    D.e0.position.copy(sh.c0); D.e1.position.copy(sh.c1); D.e0.scale.setScalar(sh.cr); D.e1.scale.setScalar(sh.cr);
  }

  /* ---- Motion Library je Rig ---- */
  const libs = {}, stripped = {};
  async function libFor(rig) {
    if (libs[rig]) return libs[rig];
    libs[rig] = (async () => {
      const files = [...new Set(Object.values(def.clips).map((c) => c.library && c.library[rig]).filter(Boolean))];
      let n = 0;
      const gs = await Promise.all(files.map((f) => loadAsset(ML.root + f, ML.ref).then((g) => { onProgress(++n, files.length, rig + ' · ' + f.split('/').pop()); return g; })));
      const m = new Map(); stripped[rig] = 0;
      for (const g of gs) for (const c of g.animations) {
        if (!def.clips[c.name]) continue;
        const keep = c.tracks.filter((t) => !RIGNODE.test(t.name.split('.')[0]));
        stripped[rig] += c.tracks.length - keep.length;
        m.set(c.name, new THREE.AnimationClip(c.name, c.duration, keep));
      }
      return m;
    })();
    return libs[rig];
  }

  /* ---- Aktoren ---- */
  const inst = {};
  async function actorFor(slot, rig) {
    const k = slot + '|' + rig;
    if (inst[k]) return inst[k];
    inst[k] = (async () => {
      const A = def.actors[rig];
      const actor = await instance(A.asset.path, A.asset.commit);
      let skin = null;
      if (A.repair && A.repair.texture) {
        skin = await applySkin(actor, A.repair.texture.path, A.repair.texture.commit);
        actor.traverse((o) => { for (const m of [].concat(o.material || [])) if (m.map) { m.map.flipY = false; m.map.colorSpace = THREE.SRGBColorSpace; m.map.needsUpdate = true; m.needsUpdate = true; } });
      }
      let rigNode = null, rigNodeWas = null;
      actor.traverse((o) => { if (!rigNode && RIGNODE.test(o.name) && !o.isBone) rigNode = o; });
      if (rigNode) { rigNodeWas = rigNode.position.toArray().map(r3); rigNode.position.set(0, 0, 0); }
      actor.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } });
      const bone = (n) => { const f = findBone(actor, n); return f && f.bone; };
      const clips = await libFor(rig);
      const idle = clips.get(IDLE);
      return { rig, s: sOf(rig), label: A.label, actor, hips: bone('hips'), head: bone('head'), bone, limbs: {}, clips, mixer: new THREE.AnimationMixer(actor), actions: new Map(), cur: null, rigNode: rigNode && rigNode.name, rigNodeWas, skin, bind: idle ? bindReport(actor, idle) : null, h0: new Map(), headOff: null, headOffFacts: null };
    })();
    return inst[k];
  }
  const slots = {};
  for (const k of ['A', 'B']) {
    const anchor = new THREE.Group(), squash = new THREE.Group();
    anchor.name = 'fighter.' + k; squash.name = 'fighter.' + k + '.squash'; anchor.add(squash);
    anchor.userData.entry = { id: 'fighter.' + k, scope: 'requisite', kind: 'performer', role: k === 'A' ? 'Fighter A · Angreifer' : 'Fighter B · Verteidiger' };
    pair.add(anchor); nodes.set(anchor.userData.entry.id, anchor);
    slots[k] = { anchor, squash, a: null, base: new THREE.Vector3(), push: 0 };
  }
  const missing = new Set();
  function pose(a, name, frame) {
    const clip = a.clips.get(name);
    if (!clip) { missing.add(a.rig + ':' + name); return null; }
    let act = a.actions.get(name);
    if (!act) { act = a.mixer.clipAction(clip); act.setLoop(THREE.LoopOnce, 1); act.clampWhenFinished = true; a.actions.set(name, act); }
    if (a.cur !== act) { if (a.cur) a.cur.stop(); act.reset(); act.play(); act.paused = true; a.cur = act; a.curName = name; }
    act.time = clamp((frame - FRAME0) / FPS, 0, clip.duration);
    a.mixer.update(0);
    a.frame = FRAME0 + act.time * FPS;
    return act;
  }
  const framesOf = (a, name) => { const c = a.clips.get(name); return c ? Math.round(c.duration * FPS) + FRAME0 : (def.clips[name] && def.clips[name].frames) || 1; };
  const wrapF = (a, name, f) => { const n = Math.max(1, framesOf(a, name)); return ((f % n) + n) % n; };
  const slotOf = (a) => (slots.A.a === a ? slots.A : slots.B);
  /* Hüfte im Elternraum der Figur, bei neutraler Squash-Skala. Damit dreht und staucht der
     Verteidiger um seine Hüfte statt um den Clip-Ursprung. Gecacht je Clip und Bild. */
  function hipsLocal(a, name, frame) {
    const k = name + '@' + frame; if (a.h0.has(k)) return a.h0.get(k);
    const sl = slotOf(a), keep = sl.squash.scale.clone(); sl.squash.scale.set(1, 1, 1);
    pose(a, name, frame); a.actor.updateWorldMatrix(true, true);
    const w = a.hips.getWorldPosition(new THREE.Vector3());
    const h = sl.squash.worldToLocal(w).sub(a.actor.position);
    sl.squash.scale.copy(keep); a.h0.set(k, h); return h;
  }
  /* Kopfkugel: Offset im Kopf-Bone-Raum. Zwei Lesarten (Blender-Bone-Achsen direkt oder
     glTF-umgedreht) werden gegen centerHeightInStanceM geprüft, die passende gilt. */
  function resolveHead(a) {
    if (a.headOff) return;
    const sl = slotOf(a); sl.anchor.position.set(0, 0, 0); sl.anchor.rotation.set(0, 0, 0); sl.squash.scale.set(1, 1, 1); a.actor.position.set(0, 0, 0);
    pose(a, IDLE, 1); a.actor.updateWorldMatrix(true, true);
    const R = F.rigs[a.rig].headSphere, o = R.offsetInBoneSpace;
    const c = { 'Bone-Achsen direkt': new THREE.Vector3(o[0], o[1], o[2]), 'glTF-umgedreht (x, z, −y)': new THREE.Vector3(o[0], o[2], -o[1]) };
    let best = null;
    for (const [mode, v] of Object.entries(c)) { const y = a.head.localToWorld(v.clone()).y, err = Math.abs(y - R.centerHeightInStanceM); if (!best || err < best.err) best = { mode, v, y, err }; }
    a.headOff = best.v; a.headOffFacts = { mode: best.mode, heightM: r3(best.y), wantM: R.centerHeightInStanceM, errM: r3(best.err) };
  }
  function shapes(a) {
    const R = F.rigs[a.rig];
    return { hc: a.head.localToWorld(a.headOff.clone()), hr: R.headSphere.radiusM, c0: a.hips.getWorldPosition(new THREE.Vector3()), c1: a.head.getWorldPosition(new THREE.Vector3()), cr: R.bodyCapsule.radiusM };
  }
  function gapNow() {
    const a = shapes(slots.A.a), b = shapes(slots.B.a);
    const g = [
      ['Kopf–Kopf', a.hc.distanceTo(b.hc) - a.hr - b.hr],
      ['Kopf A–Körper B', ptSeg(a.hc, b.c0, b.c1) - a.hr - b.cr],
      ['Körper A–Kopf B', ptSeg(b.hc, a.c0, a.c1) - b.hr - a.cr],
      ['Körper–Körper', segSeg(a.c0, a.c1, b.c0, b.c1) - a.cr - b.cr]
    ];
    let m = g[0]; for (const x of g) if (x[1] < m[1]) m = x;
    return { min: m[1], which: m[0], a, b };
  }

  /* ---- Hand-Requisite für den Prop-Treffer ---- */
  let propProto = null;
  async function propFor(a) {
    if (a.prop) return a.prop;
    if (!propProto) propProto = await instance(def.prop.asset.path, def.prop.asset.commit);
    const p = propProto.clone(true); p.name = 'prop.' + def.prop.id;
    const f = findBone(a.actor, def.prop.slot);
    if (!f) { missing.add(a.rig + ':' + def.prop.slot); return null; }
    f.bone.add(p); a.actor.updateWorldMatrix(true, true);
    const ws = f.bone.getWorldScale(new THREE.Vector3()).x || 1;
    p.scale.setScalar(a.s / ws); p.visible = false;
    p.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    a.prop = p; a.propFacts = { slot: f.matched, boneWorldScale: r3(ws), propScale: r3(a.s / ws) };
    return p;
  }

  /* ---- Zustand ---- */
  const S = { rigA: 'Rig_Medium', rigB: 'Rig_Medium', mode: 'proof', proof: 'headbutt', atk: 'kfb_action_headbutt_a', rea: 'kfb_reaction_taking_punch_a', t: 0, playing: false, speed: 1, loop: true, ready: false, busy: null };
  const fx = Object.assign({}, FX_DEFAULTS);
  let sel = null, plan = null, total = 0;
  const sim = { t: -1, last: null };
  const listeners = new Set(); const changed = () => { for (const f of listeners) f(); };

  function selection() {
    const key = S.rigA + '|' + S.rigB;
    if (S.mode === 'free') return { kind: 'strike', id: short(S.atk) + '→' + short(S.rea), atk: S.atk, rea: S.rea, then: {}, prop: S.atk === 'kfb_action_sword_and_shield_attack_a' };
    const P = F.proofSet.find((x) => x.id === S.proof) || F.proofSet[0];
    if (P.id === 'dust_cloud_brawl') return { kind: 'brawl', id: P.id, proof: P };
    if (P.id === 'shoulder_throw') return { kind: P.pairings.includes(key) ? 'throw' : 'blocked', id: P.id, proof: P, atk: P.attacker, rea: P.defender };
    return { kind: 'strike', id: P.id, proof: P, atk: P.attacker, rea: P.defender, then: P.then || {}, prop: !!P.prop };
  }

  function buildPlan() {
    const A = slots.A.a, B = slots.B.a, sA = A.s, sB = B.s, sMin = Math.min(sA, sB);
    const base = { kind: sel.kind, sA, sB, sMin, clr: 0.05 * sMin, chain: {}, ej: null };
    if (sel.kind === 'strike') {
      const key = sel.atk + '|' + S.rigA + '|' + S.rigB, T = F.table[key], AT = F.attacks[sel.atk][S.rigA], R = F.reactions[sel.rea], RB = R.byRig[S.rigB];
      if (!T || !AT || !RB) return Object.assign(base, { kind: 'error', why: 'kein Tabelleneintrag ' + key });
      const cF = AT.contactFrame, iF = R.impactFrame, tc = (cF - FRAME0) / FPS, th = tc + fx.hit / FPS;
      const ax = dirOf(T.attackAxisYawDeg), hA = b2t(AT.hipsAtContact);
      const ground = new THREE.Vector3(hA.x, 0, hA.z).addScaledVector(ax, T.hipsDistanceM);
      const nA = framesOf(A, sel.atk), nB = framesOf(B, sel.rea);
      const tail = Math.max(nA - cF, nB - iF) / FPS + ((sel.then.attacker || sel.then.defender) ? 2.2 : 0.4);
      return Object.assign(base, { key, T, AT, R, RB, cF, iF, tc, th, axis: T.attackAxisYawDeg, ax, ground, yawS: T.defenderStanceYawDeg, yawK: T.attackAxisYawDeg - RB.knockbackYawInClipDeg, nA, nB, puffAt: b2t(T.impactPuffAt), total: th + tail + 0.6, readable: T.visualGapM <= 0.15 * sB });
    }
    if (sel.kind === 'brawl') {
      const RA = F.rigs[S.rigA], RB = F.rigs[S.rigB];
      const D = Math.max(RA.headSphere.radiusM + RB.headSphere.radiusM, RA.bodyCapsule.radiusM + RB.bodyCapsule.radiusM) + base.clr + 0.12 * sMin;
      const run = 1.2 * Math.max(sA, sB) + 0.6, tr = 0.9, te = tr + 2.6;
      const top = Math.max(RA.headSphere.centerHeightInStanceM + RA.headSphere.radiusM, RB.headSphere.centerHeightInStanceM + RB.headSphere.radiusM);
      const Rc = D / 2 + Math.max(RA.bodyCapsule.radiusM, RB.bodyCapsule.radiusM) * 1.05, Hh = top * 0.52;
      const fc = (n) => (def.clips[n] && def.clips[n].facingYawDeg) || 0;
      const RF = F.reactions[FALL], nFF = framesOf(B, FALL), nGU = framesOf(B, GETUP);
      return Object.assign(base, { D, run, tr, te, Rc, Hh, drift: 2.0, fRun: fc(RUN), fFist: fc(FIST), fTake: fc(TAKE), fDizzy: fc(DIZZY), RF, iFF: RF.impactFrame, nFF, nGU, axis: 0, ax: dirOf(0), total: te + (nFF - RF.impactFrame + nGU) / FPS + 1.0 });
    }
    if (sel.kind === 'throw') {
      const n = Math.max(framesOf(A, sel.atk), framesOf(B, sel.rea));
      const fAgg = (def.clips[sel.atk] && def.clips[sel.atk].facingYawDeg) || 0;
      return Object.assign(base, { n, fAgg, axis: fAgg, ax: dirOf(fAgg), total: n / FPS + 1.2 });
    }
    return Object.assign(base, { kind: sel.kind, axis: 0, ax: dirOf(0), total: 2 });
  }

  function placeSlot(sl, ground, yawDeg, h0) {
    sl.base.copy(ground); sl.yaw = yawDeg;
    sl.anchor.position.copy(ground); sl.anchor.rotation.set(0, yawDeg * D2R, 0);
    if (h0) sl.a.actor.position.set(-h0.x, 0, -h0.z); else sl.a.actor.position.set(0, 0, 0);
  }
  /* Übergang auf den Folge-Clip ohne Sprung zurück: Hüfte am Ende des ersten Clips wird zum
     Drehpunkt des zweiten. */
  function chainAt(a, from, fromH0, fromEnd, next, nextF, yaw, ground, key) {
    if (plan.chain[key]) return plan.chain[key];
    const he = hipsLocal(a, from, fromEnd).clone().sub(fromH0); he.y = 0; he.applyAxisAngle(UP, yaw * D2R);
    const c = { ground: ground.clone().add(he), h0: hipsLocal(a, next, nextF) };
    plan.chain[key] = c; return c;
  }
  const squashEnv = (age) => { const Q = fx.sqFrames / FPS; if (age < 0 || age >= Q) return 0; const k = age / Q; return k < 0.15 ? k / 0.15 : Math.pow(1 - (k - 0.15) / 0.85, 2); };

  function stepAt(t) {
    const A = slots.A.a, B = slots.B.a, P = plan, SA = slots.A, SB = slots.B;
    let axV = P.ax, puffAge = null, sq = 0, phase = '';
    SB.squash.scale.set(1, 1, 1);
    if (P.kind === 'strike') {
      placeSlot(SA, new THREE.Vector3(), 0, null);
      if (t < P.tc) { pose(A, sel.atk, FRAME0 + t * FPS); phase = 'Anlauf'; }
      else if (t < P.th) { pose(A, sel.atk, P.cF); phase = 'Hit-Stop'; }
      else { const f = P.cF + (t - P.th) * FPS; if (f <= P.nA) pose(A, sel.atk, f); else pose(A, sel.then.attacker || IDLE, wrapF(A, sel.then.attacker || IDLE, f - P.nA)); phase = 'Reaktion'; }
      let ground = P.ground, yaw, h0, clip, f;
      if (t < P.th) { h0 = hipsLocal(B, IDLE, 1); yaw = P.yawS; clip = IDLE; f = t < P.tc ? wrapF(B, IDLE, 1 + (t - P.tc) * FPS) : 1; }
      else {
        const fr = P.iF + (t - P.th) * FPS; yaw = P.yawK;
        const hR = hipsLocal(B, sel.rea, P.iF);
        if (fr <= P.nB || (P.R.endsLying && !sel.then.defender)) { h0 = hR; clip = sel.rea; f = Math.min(fr, P.nB); }
        else { const nx = sel.then.defender || IDLE, ch = chainAt(B, sel.rea, hR, P.nB, nx, 0, yaw, P.ground, 'then'); ground = ch.ground; h0 = ch.h0; clip = nx; f = wrapF(B, nx, fr - P.nB); }
      }
      placeSlot(SB, ground, yaw, h0); pose(B, clip, f);
      sq = squashEnv(t - P.tc);
      if (sq > 0) SB.squash.scale.set(1 + (fx.sqW - 1) * sq, 1 + (fx.sqH - 1) * sq, 1 + (fx.sqW - 1) * sq);
      /* Reparatur (Abnahme 3): Rückstoß-Sperre. In den ersten 15 Bildern nach dem Hit-Stop darf die
         Hüfte nicht auf den Angreifer zu. Jeder Schritt zurück wird als Versatz der Verankerung
         aufgefangen (Ratsche entlang der Angriffsachse). Danach bleibt der Versatz stehen, kein Sprung.
         Der Clip bleibt unverändert, kein Retiming. Aus = Rohdaten. */
      if (fx.lock && t >= P.th - 1e-6) {
        if (!P.lock) P.lock = { max: -Infinity, off: 0 };
        SB.anchor.position.copy(SB.base); SB.anchor.updateMatrixWorld(true);
        const al = B.hips.getWorldPosition(new THREE.Vector3()).sub(SB.base).dot(P.ax);
        if ((t - P.th) * FPS <= LOCK_FRAMES + 1e-6) { if (al + P.lock.off < P.lock.max) P.lock.off = P.lock.max - al; P.lock.max = Math.max(P.lock.max, al + P.lock.off); }
        SB.base.addScaledVector(P.ax, P.lock.off);
      }
      puffAge = t >= P.tc ? t - P.tc : null;
      drivePuff(puffAge, P.puffAt, fx.puff * P.sB);
      driveCloud(t, null, 0, 0, 0);
      if (A.prop) A.prop.visible = !!sel.prop;
    } else if (P.kind === 'brawl') {
      if (A.prop) A.prop.visible = false;
      drivePuff(null);
      let phi = 0, amt = 0, rise = 0;
      const C = new THREE.Vector3();
      if (t < P.tr) {
        const k = t / P.tr, off = P.D / 2 + P.run * (1 - k);
        placeSlot(SA, new THREE.Vector3(-off, 0, 0), 0 - P.fRun, null); placeSlot(SB, new THREE.Vector3(off, 0, 0), 180 - P.fRun, null);
        pose(A, RUN, wrapF(A, RUN, t * FPS)); pose(B, RUN, wrapF(B, RUN, t * FPS + 9)); phase = 'Anlauf';
      } else if (t < P.te) {
        const u = t - P.tr; C.copy(dirOf(0)).multiplyScalar(P.drift * smooth(u / (P.te - P.tr)));
        phi = 35 * Math.sin(u * 2.2); const d = dirOf(phi);
        placeSlot(SA, C.clone().addScaledVector(d, -P.D / 2), phi - P.fFist, null); placeSlot(SB, C.clone().addScaledVector(d, P.D / 2), phi + 180 - P.fTake, null);
        pose(A, FIST, wrapF(A, FIST, u * FPS)); pose(B, TAKE, wrapF(B, TAKE, u * FPS)); axV = d;
        amt = smooth(u / 0.25); phase = 'Wolke';
        P.lastPhi = phi;
      } else {
        if (!P.ej) {
          /* Auswurf: B fliegt aus der Wolke weg vom Gegner. Drehpunkt = B-Hüfte im letzten Wolkenbild. */
          const hb = B.hips.getWorldPosition(new THREE.Vector3()), ha = A.hips.getWorldPosition(new THREE.Vector3());
          const dv = hb.clone().sub(ha); dv.y = 0;
          P.ej = { hips: new THREE.Vector3(hb.x, 0, hb.z), dir: yawOf(dv), aPos: SA.base.clone(), aYaw: SA.yaw, C: dirOf(0).multiplyScalar(P.drift) };
          SB.push = 0;
        }
        const u = t - P.te, fr = P.iFF + u * FPS, yaw = P.ej.dir - P.RF.byRig[S.rigB].knockbackYawInClipDeg;
        placeSlot(SA, P.ej.aPos, P.ej.aYaw + P.fFist - P.fDizzy, null); pose(A, DIZZY, wrapF(A, DIZZY, u * FPS));
        const hF = hipsLocal(B, FALL, P.iFF);
        if (fr <= P.nFF) { placeSlot(SB, P.ej.hips, yaw, hF); pose(B, FALL, fr); phase = 'Auswurf'; }
        else { const ch = chainAt(B, FALL, hF, P.nFF, GETUP, 0, yaw, P.ej.hips, 'getup'); placeSlot(SB, ch.ground, yaw, ch.h0); pose(B, GETUP, Math.min(fr - P.nFF, P.nGU)); phase = 'Aufstehen'; }
        axV = dirOf(P.ej.dir); C.copy(P.ej.C);
        amt = 1 - smooth(u / 0.7); rise = u * 0.6 * P.sMin;
      }
      driveCloud(t, C, P.Rc, P.Hh, amt, rise);
    } else if (P.kind === 'throw') {
      if (A.prop) A.prop.visible = false;
      drivePuff(null); driveCloud(t, null, 0, 0, 0);
      placeSlot(SA, new THREE.Vector3(), 0, null); placeSlot(SB, new THREE.Vector3(), 0, null);
      pose(A, sel.atk, Math.min(t * FPS, framesOf(A, sel.atk))); pose(B, sel.rea, Math.min(t * FPS, framesOf(B, sel.rea)));
      phase = t * FPS < P.n ? 'Wurf' : 'Ende';
      A.actor.updateWorldMatrix(true, true); B.actor.updateWorldMatrix(true, true);
      const dv = B.hips.getWorldPosition(new THREE.Vector3()).sub(A.hips.getWorldPosition(new THREE.Vector3())); dv.y = 0;
      if (dv.length() > 0.01) axV = dv.normalize();
    } else {
      if (A.prop) A.prop.visible = false;
      drivePuff(null); driveCloud(t, null, 0, 0, 0);
      const d = 2.2 * Math.max(P.sA, P.sB), fb = (def.clips[IDLE] && def.clips[IDLE].facingYawDeg) || 0;
      placeSlot(SA, new THREE.Vector3(-d / 2, 0, 0), -fb, null); placeSlot(SB, new THREE.Vector3(d / 2, 0, 0), 180 - fb, null);
      pose(A, IDLE, wrapF(A, IDLE, t * FPS)); pose(B, IDLE, wrapF(B, IDLE, t * FPS + 11)); phase = 'nicht für diese Paarung';
    }
    /* Trennung, jedes Bild: einzige Kollisionsprüfung. Schub des Verteidigers entlang der Angriffsachse. */
    SB.axis = axV;
    SB.anchor.position.copy(SB.base).addScaledVector(axV, SB.push);
    world.updateMatrixWorld(true);
    let g = gapNow(); const raw = g.min;
    for (let i = 0; i < 12 && fx.sep && g.min < P.clr; i++) {
      SB.push += (P.clr - g.min) + 0.002 * P.sMin;
      SB.anchor.position.copy(SB.base).addScaledVector(axV, SB.push); SB.anchor.updateMatrixWorld(true);
      g = gapNow();
    }
    const hb = B.hips.getWorldPosition(new THREE.Vector3()), ha = A.hips.getWorldPosition(new THREE.Vector3());
    sim.last = { t, phase, gap: g.min, which: g.which, raw, push: SB.push, lock: P.lock ? P.lock.off : 0, sq, puffAge, hipsA: ha, hipsB: hb, axV: axV.clone(), shapesA: g.a, shapesB: g.b };
    return sim.last;
  }

  function resetSim() { SBpush0(); if (plan) { plan.chain = {}; plan.ej = null; plan.lock = null; } sim.t = -1; }
  function SBpush0() { slots.B.push = 0; }
  let nudge = new THREE.Vector3();
  function evaluate() {
    const A = slots.A.a, B = slots.B.a; if (!A || !B || !plan || plan.kind === 'error') return;
    const t = S.loop && total > 0 ? S.t % total : Math.min(S.t, total);
    if (t < sim.t - 1e-6) resetSim();
    if (sim.t < 0) { stepAt(0); sim.t = 0; }
    while (sim.t + DT < t - 1e-6) { sim.t += DT; stepAt(sim.t); }
    if (t !== sim.t || !sim.last || sim.last.t !== t) { stepAt(t); sim.t = t; }
    const L = sim.last;
    dbg.visible = !!fx.debug;
    if (fx.debug) { dbgUpdate(dbgA, L.shapesA); dbgUpdate(dbgB, L.shapesB); puffMark.visible = plan.kind === 'strike'; if (plan.kind === 'strike') { puffMark.position.copy(plan.puffAt); puffMark.scale.setScalar(0.03 * plan.sB); } }
    world.updateMatrixWorld(true);
  }
  function applyNudge() {
    const cam = V.camera; cam.position.sub(nudge); nudge.set(0, 0, 0);
    if (!fx.nudge || !plan || plan.kind !== 'strike' || !S.playing) return;
    const t = S.loop && total > 0 ? S.t % total : S.t, age = t - plan.tc, len = fx.hit / FPS + 0.12;
    if (age < 0 || age > len) return;
    const k = age / len, amp = 0.035 * plan.sB * (1 - k);
    nudge.copy(plan.ax).multiplyScalar(amp * Math.sin(k * Math.PI * 5)); nudge.y = amp * 0.6 * Math.cos(k * Math.PI * 4);
    cam.position.add(nudge);
  }

  function stage() {
    if (!slots.A.a || !slots.B.a) return;
    sel = selection(); plan = buildPlan(); total = plan.total || 2;
    resetSim(); evaluate();
    const p = plan.kind === 'strike' ? plan.ground.clone().multiplyScalar(0.5) : plan.kind === 'brawl' ? new THREE.Vector3(plan.drift / 2, 0, 0) : new THREE.Vector3();
    ring.position.set(p.x, 0, p.z); ring.rotation.y = (plan.axis || 0) * D2R;
    changed();
  }

  async function setRigs(rigA, rigB) {
    S.busy = 'lade ' + def.actors[rigA].label + ' / ' + def.actors[rigB].label; changed();
    const [a, b] = await Promise.all([actorFor('A', rigA), actorFor('B', rigB)]);
    for (const [k, x] of [['A', a], ['B', b]]) {
      const s = slots[k];
      if (s.a && s.a !== x) s.squash.remove(s.a.actor);
      s.a = x; s.squash.add(x.actor);
      s.anchor.userData.entry.a = def.actors[x.rig].asset.path;
      s.anchor.userData.entry.role = (k === 'A' ? 'Fighter A · Angreifer · ' : 'Fighter B · Verteidiger · ') + x.label;
      resolveHead(x);
    }
    await propFor(a);
    S.rigA = rigA; S.rigB = rigB; S.busy = null; S.ready = true;
    stage();
  }

  /* ---- Messung: Abnahme 2–5 ---- */
  function runItem() {
    const P = plan, rows = [], keepLoop = S.loop; S.loop = false;
    for (let t = 0; t <= total + 1e-6; t += DT) { S.t = t; evaluate(); rows.push(Object.assign({}, sim.last, { hipsA: sim.last.hipsA.clone(), hipsB: sim.last.hipsB.clone() })); }
    S.loop = keepLoop;
    const out = { item: sel.id, kind: P.kind, pairing: S.rigA + '|' + S.rigB, frames: rows.length, clrM: r3(P.clr), tolM: r3(0.01 * P.sMin) };
    let mg = Infinity, mr = Infinity, which = '', at = 0;
    for (const r of rows) { if (r.gap < mg) { mg = r.gap; which = r.which; at = r.t; } mr = Math.min(mr, r.raw); }
    out.sep = { minGapM: r3(mg), which, atFrame: Math.round(at * FPS), minRawGapM: r3(mr), pushM: r3(slots.B.push), pass: mg >= -0.01 * P.sMin };
    if (P.kind === 'strike') {
      const i0 = Math.round(P.th * FPS), ax = P.ax, h0 = rows[i0].hipsB;
      const along = [], dist = [];
      for (let k = 0; k <= 15 && i0 + k < rows.length; k++) { const r = rows[i0 + k]; along.push(r.hipsB.clone().sub(h0).dot(ax)); dist.push(Math.hypot(r.hipsB.x - r.hipsA.x, r.hipsB.z - r.hipsA.z)); }
      let back = 0; for (let k = 1; k < along.length; k++) back = Math.max(back, along[k - 1] - along[k]);
      const tol = 0.005 * P.sB;
      let dBack = 0; for (let k = 1; k < dist.length; k++) dBack = Math.max(dBack, dist[k - 1] - dist[k]);
      out.knock = { lock: !!fx.lock, lockM: r3(P.lock ? P.lock.off : 0), alongM: along.map(r3), d0: r3(along[0]), d15: r3(along[along.length - 1]), maxBackStepM: r3(back), tolM: r3(tol), distToAttackerM: [r3(dist[0]), r3(dist[dist.length - 1])], distMaxBackStepM: r3(dBack), pass: back <= tol && along[along.length - 1] >= along[0] - tol };
      /* Puff am Kontaktbild + Kontrollen: Angreiferhüfte gegen hipsAtContact, Glied gegen limbAtContact, Hüftabstand gegen die Tabelle */
      S.t = P.tc; evaluate();
      const pw = puff.g.getWorldPosition(new THREE.Vector3()), want = P.puffAt;
      const limbName = P.AT.limb, limb = slots.A.a.limbs[limbName] || (slots.A.a.limbs[limbName] = slots.A.a.bone(limbName));
      const lw = limb ? limb.getWorldPosition(new THREE.Vector3()) : null;
      const ha = slots.A.a.hips.getWorldPosition(new THREE.Vector3()), hb = slots.B.a.hips.getWorldPosition(new THREE.Vector3());
      const hWant = b2t(P.AT.hipsAtContact);
      const alongHips = new THREE.Vector3(hb.x - hWant.x, 0, hb.z - hWant.z).dot(ax);
      out.puff = { visible: puff.g.visible, errM: r3(pw.distanceTo(want)), tolM: r3(0.02 * P.sB), pass: puff.g.visible && pw.distanceTo(want) <= 0.02 * P.sB };
      out.check = { hipsAErrM: r3(ha.distanceTo(hWant)), limb: limbName, limbErrM: lw ? r3(lw.distanceTo(b2t(P.AT.limbAtContact))) : null, hipsAlongM: r3(alongHips), hipsDistanceM: P.T.hipsDistanceM, pushAtContactM: r3(slots.B.push), visualGapM: P.T.visualGapM, readable: P.readable };
    }
    return out;
  }
  async function measureAll(onRow = () => {}, fxPatch = null) {
    const fxKeep = Object.assign({}, fx); if (fxPatch) Object.assign(fx, fxPatch);
    const rows = [], keep = { rigA: S.rigA, rigB: S.rigB, mode: S.mode, proof: S.proof, t: S.t };
    S.playing = false;
    for (const [ra, rb] of PAIRINGS) {
      await setRigs(ra, rb);
      for (const P of F.proofSet) {
        if (P.id === 'shoulder_throw' && !P.pairings.includes(ra + '|' + rb)) { rows.push({ item: P.id, kind: 'blocked', pairing: ra + '|' + rb, skipped: 'nur ' + P.pairings.join(', ') }); continue; }
        S.mode = 'proof'; S.proof = P.id; stage();
        const miss0 = missing.size, r = runItem(); r.plays = missing.size === miss0;
        rows.push(r); onRow(r);
        await new Promise((res) => setTimeout(res, 0));
      }
    }
    Object.assign(fx, fxKeep);
    Object.assign(S, keep); await setRigs(keep.rigA, keep.rigB); S.t = keep.t; evaluate();
    return rows;
  }
  /* Abnahme 5: Regler wirken, Debug zeigt Formen */
  function testFx() {
    const keep = Object.assign({}, fx), keepS = { mode: S.mode, proof: S.proof, t: S.t, loop: S.loop };
    S.mode = 'proof'; S.proof = 'headbutt'; S.loop = false; stage();
    const at = (t) => { S.t = t; evaluate(); return sim.last; };
    const res = {};
    fx.hit = 4; stage(); at(plan.tc + 6 / FPS); const fA4 = slots.A.a.frame;
    fx.hit = 8; stage(); at(plan.tc + 6 / FPS); const fA8 = slots.A.a.frame;
    res.hit = { fA_hit4: r3(fA4), fA_hit8: r3(fA8), cF: plan.cF, pass: Math.abs(fA8 - plan.cF) < 0.01 && fA4 > plan.cF + 1 };
    fx.hit = 4; fx.sqW = 1.3; fx.sqH = 0.75; fx.sqFrames = 6; stage(); at(plan.tc + 1 / FPS);
    const sx = slots.B.squash.scale.x, sy = slots.B.squash.scale.y, e = squashEnv(1 / FPS);
    res.squash = { scaleX: r3(sx), scaleY: r3(sy), wantX: r3(1 + 0.3 * e), wantY: r3(1 - 0.25 * e), pass: Math.abs(sx - (1 + 0.3 * e)) < 1e-3 && Math.abs(sy - (1 - 0.25 * e)) < 1e-3 && sx > 1.05 };
    fx.puff = 0.2; stage(); at(plan.tc + 2 / FPS); const b1 = puff.list[0].m.scale.x;
    fx.puff = 0.4; stage(); at(plan.tc + 2 / FPS); const b2 = puff.list[0].m.scale.x;
    res.puff = { blob_0_2: r3(b1), blob_0_4: r3(b2), ratio: r3(b2 / b1), pass: Math.abs(b2 / b1 - 2) < 0.01 };
    fx.debug = true; evaluate();
    const shown = dbg.children.filter((c) => c.visible).length;
    res.debug = { visible: dbg.visible, shapes: shown, pass: dbg.visible && shown >= 9 };
    Object.assign(fx, keep); Object.assign(S, keepS); stage();
    res.pass = res.hit.pass && res.squash.pass && res.puff.pass && res.debug.pass;
    return res;
  }

  /* ---- Urteile ---- */
  const VKEY = 'kfb.fight-sandbox.verdicts.v2';
  let verdicts = {}; try { verdicts = JSON.parse(localStorage.getItem(VKEY) || '{}'); } catch {}
  const vkey = () => sel ? (S.mode === 'free' ? 'free:' : 'proof:') + sel.id + '|' + S.rigA + '|' + S.rigB : null;
  function setVerdict(v, note) {
    const k = vkey(); if (!k) return;
    const cur = verdicts[k] || {};
    verdicts[k] = { mode: S.mode, id: sel.id, kind: sel.kind, attacker: sel.atk || null, defender: sel.rea || null, attackerRig: S.rigA, defenderRig: S.rigB, visualGapM: plan && plan.T ? plan.T.visualGapM : null, fx: Object.assign({}, fx), verdict: v ?? cur.verdict ?? null, note: note ?? cur.note ?? '', at: new Date().toISOString() };
    try { localStorage.setItem(VKEY, JSON.stringify(verdicts)); } catch {}
    changed();
  }
  function verdictDoc() {
    return {
      schema: def.verdictSchema, date: new Date().toISOString().slice(0, 10),
      source: { repo: def.source.repo, branch: def.source.branch, fightData: def.fightData.path, fightSchema: F.schema, fightVersion: F.version, catalogVersion: F.catalogVersion },
      fxDefaults: FX_DEFAULTS, verdicts: Object.values(verdicts)
    };
  }

  const M = {
    def, F, world, nodes, slots, loadCheck, stripped, missing, S, fx, short,
    get sel() { return sel; }, get plan() { return plan; }, get total() { return total; }, get last() { return sim.last; },
    verdicts: () => verdicts, vkey,
    onChange(f) { listeners.add(f); },
    attach() { V.scene.add(world); evaluate(); },
    detach() { V.scene.remove(world); S.playing = false; V.camera.position.sub(nudge); nudge.set(0, 0, 0); },
    post(dt) {
      if (!S.ready || !S.playing) { applyNudge(); return; }
      S.t += Math.min(dt || 0, 0.1) * S.speed;
      if (!S.loop && S.t > total) S.t = total;
      evaluate(); applyNudge();
    },
    async init() { await setRigs(S.rigA, S.rigB); },
    setRigs, stage, measureAll, testFx, setVerdict, verdictDoc,
    set(patch) { Object.assign(S, patch); stage(); },
    setFx(patch, restage) { Object.assign(fx, patch); if (restage) { const t = S.t; stage(); S.t = t; } sim.last = null; evaluate(); },
    play() { S.playing = true; changed(); }, pause() { S.playing = false; changed(); },
    toggle() { S.playing = !S.playing; changed(); },
    replay() { S.t = 0; S.playing = true; evaluate(); changed(); },
    step(n) { S.playing = false; S.t = Math.max(0, S.t + n / FPS); evaluate(); changed(); },
    seek(t) { S.playing = false; S.t = Math.max(0, t); evaluate(); changed(); },
    atContact() { if (plan && plan.kind === 'strike') M.seek(plan.tc); },
    inHitStop() { if (plan && plan.kind === 'strike') M.seek(plan.tc + Math.min(2, fx.hit - 1) / FPS); },
    view(kind) {
      const a = (plan ? plan.axis || 0 : 0) * D2R;
      const ax = new THREE.Vector3(Math.cos(a), 0, -Math.sin(a)), perp = new THREE.Vector3(Math.sin(a), 0, Math.cos(a));
      if (kind === 'top') V.frame(ring, [0, 1, 0.02], 1.0);
      else V.frame(pair, perp.clone().add(new THREE.Vector3(0, 0.3, 0)).add(ax.multiplyScalar(0.001)).toArray(), plan && plan.kind === 'brawl' ? 2.2 : 1.7);
      const px = inset(), W = V.renderer.domElement.clientWidth || 1;
      if (px > 0) {
        const cam = V.camera, tgt = V.controls.target, dist = cam.position.distanceTo(tgt);
        const hfov = 2 * Math.atan(Math.tan(cam.fov * D2R / 2) * cam.aspect);
        const shift = 2 * dist * Math.tan(hfov / 2) * (px / 2) / W;
        const right = new THREE.Vector3().subVectors(tgt, cam.position).cross(cam.up).normalize().multiplyScalar(shift);
        cam.position.add(right); tgt.add(right); V.controls.update();
      }
    },
    snapshot() {
      const A = slots.A.a, B = slots.B.a, L = sim.last;
      return {
        frame0: FRAME0, ready: S.ready, busy: S.busy, rigA: S.rigA, rigB: S.rigB, mode: S.mode, proof: S.proof, t: S.t, total, playing: S.playing, speed: S.speed, loop: S.loop, fx: Object.assign({}, fx),
        frameA: A && A.frame, clipA: A && A.curName, frameB: B && B.frame, clipB: B && B.curName, sel, plan,
        live: L && { phase: L.phase, gapM: r3(L.gap), which: L.which, rawGapM: r3(L.raw), pushM: r3(L.push), lockM: r3(L.lock || 0), squash: r3(L.sq) },
        actors: [A, B].filter(Boolean).map((x) => ({ rig: x.rig, label: x.label, s: x.s, rigNode: x.rigNode, rigNodeWas: x.rigNodeWas, bind: x.bind, skin: x.skin && x.skin.swapped, head: x.headOffFacts, prop: x.propFacts || null })),
        stripped, missing: [...missing], loadCheck
      };
    }
  };
  return M;
}
