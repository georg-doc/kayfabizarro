/* KFB · RESIDENT-DISCO-01 · Ensemble-Laufzeit (Kandidat)
   Sieben echte Quellfiguren, drei Rig-Klassen, EINE Uhr. Kein eigener Mixer-Besitzer, keine
   eigene Musiklogik, kein eigener Resident-Speicher: das Modul bekommt pro Bild den Uhrenstand
   vom Host (`update(clock, mode)`) und stellt jede Figur danach.

   · Rig_Medium / Rig_Large: Clips aus der KFB Motion Library (gepinnt), je Figur ein Mixer,
     Zeit wird GESETZT (action.time), nie vom Mixer fortgeschrieben — so gehorcht jede Figur
     der Songuhr, auch beim Scrubben.
   · Rig_Legacy (Skeleton Minion): zusammengesetzt über legacyAssemble(); Bewegung nach dem
     Orc-Band-Prinzip (Hüpfen, Stauchen, Neigen auf dem geteilten Takt), prozedural auf den vier
     Legacy-Bones. Die Legacy-Clips des Rigs sind zusätzlich vorsprechbar.
   · Choreografie: Cue-Liste je Figur auf Taktgrenzen, Überblendung in Schlägen, geteilte Hits.
   · Wurzelbewegung wird NIE still genullt. Reise-Clips laufen im Vorsprechen mit ihrer Reise
     und sind im Ensemble nicht eingesetzt. */
import * as THREE from 'three';
import { PropertyBinding } from 'three';
import { loadAsset, instance, legacyAssemble, findBone } from './atlas.js';
import { lowestPosedY } from './rigwork.js';
import { mountDiscoBall } from './disco-ball-core.js';
import { makeCrowd } from './resident-collide.js';

export const SCHEMA = 'kfb.resident-disco-module/1';
const REPO = 'georg-doc/kayfabizarro';
const raw = (c, p) => `https://raw.githubusercontent.com/${REPO}/${c}/${p.split('/').map(encodeURIComponent).join('/')}`;
const D2R = Math.PI / 180;
const mod = (a, n) => ((a % n) + n) % n;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const LANE_W = { Rig_Legacy: 1.9, Rig_Medium: 2.5, Rig_Large: 4.4, prop: 1.9, ball: 2.2 };

function catalogIndex(doc) {
  const list = Array.isArray(doc) ? doc : doc.clips || doc.entries || doc.animations || doc.items || Object.values(doc).find(Array.isArray) || [];
  const out = {};
  for (const e of list) {
    if (!e || !e.id) continue;
    const rm = e.rootMotion || e.root || (e.rootTravel && e.rootTravel.mode) || null;
    out[e.id] = { loop: e.loop !== false, rootMotion: typeof rm === 'string' ? rm : (rm && rm.mode) || null, durationSec: e.durationSec ?? e.duration ?? null, bestVariant: !!e.bestVariant, source: e.sourceFbx || e.source || e.fbx || null };
  }
  return out;
}

export async function mountDiscoEnsemble(def, { parent, renderer, ballDef, onProgress } = {}) {
  if (!def || def.schema !== SCHEMA) throw new Error('disco module schema mismatch: ' + (def && def.schema));
  const ML = def.motionLibrary;
  const steps = Object.keys(ML.rigs).length + def.cast.length + def.props.length + 2;
  let done = 0;
  const tick = (x) => onProgress && onProgress(++done, steps, x);

  const root = new THREE.Group();
  root.name = 'resident-module:' + def.id;
  const content = new THREE.Group();
  content.name = 'module-content';
  root.add(content);

  /* ---- Motion Library: nur Clips ---- */
  const lib = {};
  for (const [rig, file] of Object.entries(ML.rigs)) {
    const g = await loadAsset(ML.root + file, ML.commit);
    lib[rig] = new Map(g.animations.map((c) => [c.name, c]));
    tick(rig);
  }
  let catalog = {}, catalogNote = 'nicht geladen';
  try {
    const r = await fetch(raw(ML.commit, ML.root + ML.catalog));
    if (!r.ok) throw new Error('HTTP ' + r.status);
    catalog = catalogIndex(await r.json());
    catalogNote = Object.keys(catalog).length + ' Einträge @ ' + ML.commit.slice(0, 8);
  } catch (e) { catalogNote = 'Katalog fehlt · ' + e.message + ' — Schleife/Reise aus dem Clip gelesen'; }
  tick('catalog');

  /* ---- Figuren aus ihren eigenen Quelldateien ---- */
  const perf = {};
  const nodes = new Map();
  for (const c of def.cast) {
    const group = new THREE.Group();
    group.name = 'anchor.' + c.id;
    group.userData.entry = { id: 'anchor.' + c.id, scope: 'requisite', kind: 'performer', performer: c.id, role: `${c.slot} · ${c.label} · ${c.lane}`, a: c.asset.path };
    let actor, clips, legacyInfo = null, graft = null;
    if (c.graft) {
      /* Graft-Zweibeiner über den EINEN Leser (EMBED_KFB_RIGS_v3 §0): KayKit-Driver + FrizzleBob-Kopf +
         Gesicht aus dem Studio. animation:'host' — der Mixer gehört diesem Modul, die Motion Library
         treibt das Skelett; der Leser rechnet danach nur das Gesicht auf die fertige Pose. */
      const G = c.graft;
      const [{ mountGraft }, { GLTFLoader }] = await Promise.all([import(G.module), import('three/addons/loaders/GLTFLoader.js')]);
      const contract = await (await fetch(raw(G.contractCommit, G.contract))).json();
      const pet = (contract.pets || []).find((x) => x.id === G.pet) || (contract.pets || [])[0];
      actor = new THREE.Group();
      graft = await mountGraft({ THREE, loader: new GLTFLoader(), parent: actor, pet, lib: contract, animation: 'host', log: () => {} });
      clips = lib[c.lane];
      if (!clips) throw new Error(`${c.id}: keine Motion-Library für ${c.lane}`);
    } else if (c.lane === 'Rig_Legacy') {
      actor = await legacyAssemble(c.asset.path, c.legacy.rig, c.asset.commit, c.legacy.rigCommit);
      legacyInfo = actor.userData.legacy;
      const rg = await loadAsset(c.legacy.rig, c.legacy.rigCommit);
      clips = new Map(rg.animations.map((x) => ['legacy:' + x.name, x]));
    } else {
      actor = await instance(c.asset.path, c.asset.commit);
      clips = lib[c.lane];
      if (!clips) throw new Error(`${c.id}: keine Motion-Library für ${c.lane}`);
    }
    actor.name = 'actor.' + c.id;
    /* Zwischengruppe für Kollisionsversatz + Neigung — Platzierung (group) und Pose (actor) bleiben unberührt */
    const push = new THREE.Group();
    push.name = 'push.' + c.id;
    push.add(actor);
    group.add(push);
    content.add(group);
    const bones = new Map();
    actor.traverse((o) => { if (o.isBone) bones.set(o.name, o); });
    const rest = new Map([...bones.values()].map((b) => [b, { q: b.quaternion.clone(), p: b.position.clone(), s: b.scale.clone() }]));
    const hip = [...bones.values()].find((b) => /^(hips|pelvis|body)$/i.test(b.name)) || null;
    /* Größe an einer schon geladenen Figur messen statt raten (Graft-Figuren bringen ihr eigenes Maß mit) */
    let heightNote = null;
    if (c.matchHeight && perf[c.matchHeight.of]) {
      const hRef = new THREE.Box3().setFromObject(perf[c.matchHeight.of].actor).getSize(new THREE.Vector3()).y;
      const hOwn = new THREE.Box3().setFromObject(actor).getSize(new THREE.Vector3()).y;
      if (hOwn > 1e-3) { const k = (hRef * (c.matchHeight.k ?? 1)) / hOwn; actor.scale.setScalar(k); heightNote = { ref: c.matchHeight.of, hRef: +hRef.toFixed(3), hOwn: +hOwn.toFixed(3), k: +k.toFixed(3) }; }
    }
    /* Handrequisiten: an den Handslot-Bone gehängt, erben die Pose. Slot-Achsen (S31): X außen, Y vorn, Z oben. */
    const held = [];
    for (const h of c.hold || []) {
      const f = findBone(actor, h.bone);
      if (!f) { held.push({ id: h.id, ok: false, why: 'Bone ' + h.bone + ' fehlt' }); continue; }
      const obj = await instance(h.asset.path, h.asset.commit);
      const hg = new THREE.Group(); hg.name = 'hold.' + c.id + '.' + h.id;
      hg.add(obj);
      if (h.p) hg.position.fromArray(h.p);
      if (h.r) hg.rotation.set(...h.r.map((x) => x * D2R));
      if (h.s) hg.scale.setScalar(h.s);
      f.bone.add(hg);
      hg.userData.entry = { id: hg.name, scope: 'requisite', kind: 'prop', role: `Handrequisite · ${h.label} · ${f.matched}`, a: h.asset.path };
      nodes.set(hg.name, hg);
      held.push({ id: h.id, ok: true, bone: f.matched, label: h.label });
    }
    const P = { id: c.id, def: c, lane: c.lane, group, push, hip, actor, clips, bones, rest, legacyInfo,
      mixer: new THREE.AnimationMixer(actor), actions: new Map(), bind: new Map(), audition: null, kind: null, cues: null, now: null, graft, held, heightNote, graftReport: graft ? graft.report : null };
    P.audition = c.lane === 'Rig_Legacy' ? 'bounce' : c.pairing[0];
    perf[c.id] = P;
    nodes.set(group.userData.entry.id, group);
    tick(c.id);
  }

  /* ---- Requisiten · Maßstab auf Zielhöhe, Unterkante auf y 0 ---- */
  const props = {};
  for (const p of def.props) {
    const g = new THREE.Group();
    g.name = p.id;
    const obj = await instance(p.asset.path, p.asset.commit);
    const b = new THREE.Box3().setFromObject(obj), sz = b.getSize(new THREE.Vector3());
    const s = p.targetWidth && Math.max(sz.x, sz.z) > 1e-6 ? p.targetWidth / Math.max(sz.x, sz.z) : p.targetHeight && sz.y > 1e-6 ? p.targetHeight / sz.y : 1;
    obj.scale.setScalar(s);
    obj.position.set(-(b.min.x + b.max.x) / 2 * (p.center ? s : 0), -b.min.y * s, -(b.min.z + b.max.z) / 2 * (p.center ? s : 0));
    g.add(obj);
    /* Beat-Deformer (Lautsprecher): Front wölbt sich im Takt aus — Vertex-Verschiebung entlang der
       Normalen, gewichtet mit der Frontzugewandtheit. Material je Instanz geklont, damit zwei
       Boxen und die Quelldatei unabhängig bleiben. */
    const pump = { value: 0 };
    if (p.pulse) obj.traverse((o) => {
      if (!o.isMesh || !p.pulse.bulge) return;
      o.material = [].concat(o.material).map((m) => { const c = m.clone(); c.onBeforeCompile = (sh) => { sh.uniforms.uPump = pump; sh.vertexShader = 'uniform float uPump;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n transformed += objectNormal * uPump * smoothstep(0.25, 0.95, objectNormal.z);'); }; c.customProgramCacheKey = () => 'kfb-pump'; return c; });
      if (o.material.length === 1) o.material = o.material[0];
    });
    g.userData.entry = { id: p.id, scope: 'requisite', kind: 'prop', role: `Requisite · ${p.label}`, a: p.asset.path, scaleNote: p.scaleNote, s: +s.toFixed(4) };
    content.add(g);
    props[p.id] = { def: p, obj: g, inner: obj, pump, baseY: obj.position.y, baseS: s, scale: +s.toFixed(4), size: sz.toArray().map((x) => +(x * s).toFixed(3)), sourceSize: sz.toArray().map((x) => +x.toFixed(3)) };
    nodes.set(p.id, g);
    tick(p.id);
  }

  /* ---- Discokugel · eingehängt, nicht besessen ---- */
  const ball = mountDiscoBall(ballDef || {}, { parent: content, renderer, anchor: {} });
  ball.setMode(def.discoBall.mode || 'DISCO');
  nodes.set('discoball', ball.root);
  tick('discoball');

  /* ---------- RESIDENT-COLLIDE-01 · Körper weichen einander aus ---------- */
  const CO = def.collision || {};
  const crowd = makeCrowd(CO.tuning || {});
  const _w = new THREE.Vector3(), _wq = new THREE.Quaternion(), _up = new THREE.Vector3(0, 1, 0), _lx = new THREE.Vector3();
  const rings = new THREE.Group(); rings.name = 'collide-rings'; rings.visible = false; root.add(rings);
  const ringOf = (r, color) => { const pts = []; for (let i = 0; i <= 48; i++) { const a = (i / 48) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, 0.03, Math.sin(a) * r)); } const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85, depthTest: false })); l.renderOrder = 999; rings.add(l); return l; };
  for (const P of Object.values(perf)) {
    const r = (CO.radius && CO.radius[P.lane]) ?? 0.5;
    P.ring = ringOf(r, 0x6fd1ff);
    crowd.add(P.id, { r, m: (CO.mass && CO.mass[P.lane]) ?? 1, center: () => { if (!P.group.visible) return [1e6 + P.ring.id * 50, 1e6]; (P.hip || P.actor).getWorldPosition(_w); return [_w.x, _w.z]; } });
  }
  for (const [id, p] of Object.entries(props)) {
    const r = (CO.propRadius ?? 0.45) * Math.max(p.size[0], p.size[2]);
    p.ring = ringOf(r, 0xf0b37e);
    crowd.obstacle(id, { r, center: () => { if (!p.obj.visible) return [1e6, 1e6]; p.obj.getWorldPosition(_w); return [_w.x, _w.z]; } });
  }
  const collide = { on: CO.default !== false, rings: false };
  function applyCrowd(active) {
    if (!active) crowd.reset();
    for (const P of Object.values(perf)) {
      const b = crowd.get(P.id);
      P.group.getWorldQuaternion(_wq).invert();
      const s = P.group.getWorldScale(_w).x || 1;
      _w.set(b.off[0], 0, b.off[1]).applyQuaternion(_wq).divideScalar(s);
      P.push.position.set(_w.x, 0, _w.z);
      const T = Math.hypot(b.lean[0], b.lean[1]);
      if (T > 1e-3) { _lx.set(b.lean[1], 0, -b.lean[0]).normalize().applyQuaternion(_wq); P.push.quaternion.setFromAxisAngle(_lx, T * D2R); }
      else P.push.quaternion.identity();
    }
  }
  function syncRings() {
    const show = collide.rings && M.mode === 'ensemble';
    rings.visible = show;
    if (!show) return;
    root.updateMatrixWorld(true);
    for (const P of Object.values(perf)) { const c = crowd.get(P.id).center(); P.ring.position.copy(root.worldToLocal(_w.set(c[0], 0, c[1]))); P.ring.visible = P.group.visible; P.ring.material.color.setHex(crowd.get(P.id).kick > 0.05 ? 0xff5c7a : 0x6fd1ff); }
    for (const p of Object.values(props)) { p.ring.visible = p.obj.visible; if (p.obj.visible) { p.obj.getWorldPosition(_w); p.ring.position.copy(root.worldToLocal(_w)); } }
  }

  /* ---------- Tempo ---------- */
  const tempo = { policy: def.tempo.default || 'native', max: def.tempo.maxRateDelta ?? 0.06 };
  function rateOf(P, motion, spb) {
    const clip = P.clips.get(motion);
    if (!clip || tempo.policy !== 'barlock' || !isLoop(motion)) return { r: 1, bars: +(clip ? clip.duration / (4 * spb) : 0).toFixed(2), locked: false };
    const exact = clip.duration / (4 * spb);
    const bars = Math.max(1, Math.round(exact));
    const r = clip.duration / (bars * 4 * spb);
    return Math.abs(r - 1) <= tempo.max ? { r, bars, locked: true, exact: +exact.toFixed(2) } : { r: 1, bars: +exact.toFixed(2), locked: false, exact: +exact.toFixed(2) };
  }
  const isLoop = (motion) => (catalog[motion] ? catalog[motion].loop : !/thriller|climb_to_top/.test(motion));
  const travelOf = (motion) => (catalog[motion] && catalog[motion].rootMotion) || null;

  /* ---------- Auswerten ---------- */
  function bindOf(P, motion) {
    if (P.bind.has(motion)) return P.bind.get(motion);
    const clip = P.clips.get(motion);
    let bound = 0;
    if (clip) for (const t of clip.tracks) if (PropertyBinding.findNode(P.actor, PropertyBinding.parseTrackName(t.name).nodeName)) bound++;
    const r = { bound, of: clip ? clip.tracks.length : 0 };
    P.bind.set(motion, r);
    return r;
  }
  function action(P, motion) {
    if (P.actions.has(motion)) return P.actions.get(motion);
    const clip = P.clips.get(motion);
    if (!clip) return null;
    const a = P.mixer.clipAction(clip);
    a.play(); a.timeScale = 0; a.setEffectiveWeight(0);
    P.actions.set(motion, a);
    return a;
  }
  function freshMixer(P) {
    P.mixer.stopAllAction(); P.mixer.uncacheRoot(P.actor);
    P.mixer = new THREE.AnimationMixer(P.actor); P.actions.clear();
  }
  function restPose(P) {
    if (P.corr) P.corr.clear();
    for (const [b, r] of P.rest) { b.quaternion.copy(r.q); b.position.copy(r.p); b.scale.copy(r.s); }
    P.actor.position.set(0, 0, 0); P.actor.rotation.set(0, 0, 0); P.actor.scale.set(1, 1, 1);
  }
  /* ---------- Wanderung (S40e, Georg: „am Ende vieler Clips werden die Figuren ohne passende Bewegung
     auf ihre Plätze zurückgeschoben“) ----------
     Viele Mixamo-Tänze wandern mit der Hüfte langsam weg. Beim Schleifenende oder Cue-Wechsel
     springt/gleitet die Figur dann zurück. Im Ensemble wird deshalb das gleitende Mittel der
     Hüft-Horizontalen (Fenster def.wander.windowSec) herausgerechnet: Schritte und Schwung
     bleiben, die langsame Reise nicht. Offen deklariert (def.wander, Panel), nicht still genullt;
     im Vorsprechen laufen die Clips unverändert. */
  const WD = def.wander || { mode: 'ensemble', windowSec: 2 };
  const wanderCache = new Map();
  const _m3 = new THREE.Matrix3(), _m3i = new THREE.Matrix3(), _cv = new THREE.Vector3();
  /* Wurzelknoten je Clip suchen statt `hips` anzunehmen (Verifier-Befund S40f): in der KFB Motion
     Library steht die Reise auf `root.position` (235 Keys), `hips.position` hat 2 konstante Keys.
     Von der Hüfte aufwärts: der erste Knoten, dessen Positionsspur sich bewegt. */
  function wanderOf(clip, P) {
    const key = clip.uuid + '|' + P.id;
    if (wanderCache.has(key)) return wanderCache.get(key);
    let W = null;
    for (let n = P.hip; n && n !== P.group; n = n.parent) {
      const tr = clip.tracks.find((t) => t.name === n.name + '.position');
      if (!tr || tr.times.length <= 2) continue;
      let moves = false; for (let i = 3; i < tr.values.length && !moves; i++) if (Math.abs(tr.values[i] - tr.values[i % 3]) > 1e-4) moves = true;
      if (!moves) continue;
      const N = Math.max(2, Math.ceil(clip.duration * 30)), dt = clip.duration / N, ip = tr.createInterpolant();
      const P0 = []; for (let i = 0; i <= N; i++) P0.push(Array.from(ip.evaluate(i * dt)).slice(0, 3));
      const half = Math.max(1, Math.round((WD.windowSec || 2) / 2 / dt)), avg = [];
      for (let i = 0; i <= N; i++) { const s = [0, 0, 0]; let c = 0; for (let j = Math.max(0, i - half); j <= Math.min(N, i + half); j++) { s[0] += P0[j][0]; s[1] += P0[j][1]; s[2] += P0[j][2]; c++; } avg.push(s.map((v) => v / c)); }
      W = { dt, N, avg, node: n, nodeName: n.name };
      break;
    }
    wanderCache.set(key, W);
    return W;
  }
  const sampleW = (W, t) => { const x = clamp(t / W.dt, 0, W.N), i = Math.min(W.N - 1, Math.floor(x)), f = x - i, a = W.avg[i], b = W.avg[i + 1], z = W.avg[0]; return [a[0] + (b[0] - a[0]) * f - z[0], a[1] + (b[1] - a[1]) * f - z[1], a[2] + (b[2] - a[2]) * f - z[2]]; };
  /* größte horizontale Wanderung eines Clips in Metern (Weltmaß der Figur) — fürs Panel */
  function wanderMeters(P, motion) {
    const clip = P.clips.get(motion);
    if (!clip || !P.hip) return null;
    const W = wanderOf(clip, P);
    if (!W) return 0;
    W.node.parent.updateMatrixWorld(true); _m3.setFromMatrix4(W.node.parent.matrixWorld);
    const gs = P.group.getWorldScale(_w).x || 1;
    let mx = 0;
    for (let i = 0; i <= W.N; i += 3) { const c = sampleW(W, i * W.dt); _cv.set(c[0], c[1], c[2]).applyMatrix3(_m3); mx = Math.max(mx, Math.hypot(_cv.x, _cv.z) / gs); }
    return +mx.toFixed(2);
  }
  const wanderNode = (P, motion) => { const c = P.clips.get(motion); const W = c && P.hip ? wanderOf(c, P) : null; return W ? W.nodeName : null; };
  /* layers: [{ motion, beats, w }] — beats = Schläge seit Beginn DIESES Einsatzes (inkl. Versatz) */
  function evalClips(P, layers, spb, inPlace = false) {
    /* Legacy: Ruhelage NUR beim Wechsel der Art. Jedes Bild zurückgesetzt, würde der Mixer
       unveränderte Werte nicht neu schreiben (PropertyMixer.apply, S39-Befund) — die Figur
       stünde dann im Clip still in der Ruhelage. */
    const kind = layers.length ? 'clip' : 'rest';
    if (P.lane === 'Rig_Legacy' && P.kind !== kind) { freshMixer(P); restPose(P); }
    P.kind = kind;
    for (const a of P.actions.values()) a.setEffectiveWeight(0);
    const tot = layers.reduce((s, l) => s + l.w, 0) || 1;
    const out = [];
    for (const l of layers) {
      const a = action(P, l.motion);
      if (!a) continue;
      const clip = a.getClip(), R = rateOf(P, l.motion, spb);
      const t = l.beats * spb * R.r;
      a.time = isLoop(l.motion) ? mod(t, clip.duration) : clamp(t, 0, clip.duration - 1e-4);
      a.setEffectiveWeight(l.w / tot);
      out.push({ motion: l.motion, t: +a.time.toFixed(3), w: +(l.w / tot).toFixed(2), rate: +R.r.toFixed(3), locked: R.locked });
    }
    /* Korrektur des letzten Bildes zurückgeben, BEVOR der Mixer schreibt: PropertyMixer schreibt
       unveränderte Werte nicht neu (S39-Befund) — sonst summiert sich die Korrektur im Stillstand. */
    if (P.corr) { for (const [n, v] of P.corr) n.position.add(v); P.corr.clear(); }
    P.mixer.update(0);
    if (inPlace && P.hip && P.lane !== 'Rig_Legacy' && WD.mode !== 'off') {
      const acc = new Map();
      for (const l of layers) {
        const a = P.actions.get(l.motion); if (!a) continue;
        const W = wanderOf(a.getClip(), P); if (!W) continue;
        const c = sampleW(W, a.time), w = l.w / tot;
        const v = acc.get(W.node) || [0, 0, 0];
        v[0] += c[0] * w; v[1] += c[1] * w; v[2] += c[2] * w;
        acc.set(W.node, v);
      }
      P.corr = P.corr || new Map();
      for (const [n, v] of acc) {
        /* nur die Horizontale (Welt-y bleibt): in Weltrichtung drehen, y streichen, zurück */
        n.parent.updateMatrixWorld(true);
        _m3.setFromMatrix4(n.parent.matrixWorld); _m3i.copy(_m3).invert();
        _cv.set(v[0], v[1], v[2]).applyMatrix3(_m3); _cv.y = 0; _cv.applyMatrix3(_m3i);
        n.position.sub(_cv);
        P.corr.set(n, _cv.clone());
        n.updateMatrixWorld(true);
      }
    }
    return out;
  }

  /* legacy-bounce-v1 · Orc-Band-Prinzip auf den vier Legacy-Bones */
  const G = def.grooves['legacy-bounce-v1'];
  const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _ax = new THREE.Vector3(), _bx = new THREE.Box3(), _c = new THREE.Vector3();
  function rotWorld(bone, axisW, ang) {
    bone.parent.getWorldQuaternion(_q).invert();
    _ax.copy(axisW).applyQuaternion(_q).normalize();
    bone.quaternion.premultiply(_q2.setFromAxisAngle(_ax, ang));
  }
  function armSign(P, bone, axisW) {
    const meshes = []; bone.traverse((o) => { if (o.isMesh) meshes.push(o); });
    const y = (sg) => { const q0 = bone.quaternion.clone(); rotWorld(bone, axisW, sg * 25 * D2R); bone.updateMatrixWorld(true); _bx.makeEmpty(); for (const m of meshes) _bx.expandByObject(m); const v = _bx.getCenter(_c).y; bone.quaternion.copy(q0); bone.updateMatrixWorld(true); return v; };
    return y(1) > y(-1) ? 1 : -1;
  }
  function bounce(P, beats, hit, roamOn = false) {
    if (P.kind !== 'bounce') freshMixer(P);
    P.kind = 'bounce';
    restPose(P);
    const f = mod(beats, 1), beat = Math.floor(mod(beats, 4));
    const land = Math.exp(-f * 9);
    const hop = (G.hop + G.hitHop * hit) * Math.sin(Math.PI * f);
    const sq = G.squash * land - 0.5 * G.squash * Math.sin(Math.PI * f);
    P.actor.position.y = hop;
    /* S40e · Umherspringen (Georg: „wie der Legacy-Orc der Band“): alle 4 Schläge ein Sprung zu einem
       neuen Punkt in der Zone neben der Figur, landet auf der Eins. Deterministisch aus dem Schlag —
       Scrubben zeigt dieselbe Stelle. Zone in lokalen Koordinaten der Platzierung (+x = links der Figur). */
    const R = roamOn && P.def.roam;
    if (R) {
      const cyc = R.everyBeats || 4, k = Math.floor(beats / cyc), ph = mod(beats, cyc);
      const pt = (n) => { const h = (x) => { const s = Math.sin(x * 12.9898 + n * 78.233) * 43758.5453; return s - Math.floor(s); }; return [R.min[0] + (R.max[0] - R.min[0]) * h(1), R.min[1] + (R.max[1] - R.min[1]) * h(2)]; };
      const a = pt(k), b = pt(k + 1), tr = smooth((ph - (cyc - 1)) / 1);
      const jump = ph >= cyc - 1 ? Math.sin(Math.PI * (ph - (cyc - 1))) * (R.jump || 0.4) : 0;
      P.actor.position.x = a[0] + (b[0] - a[0]) * tr;
      P.actor.position.z = a[1] + (b[1] - a[1]) * tr;
      P.actor.position.y += jump;
      const dir = Math.atan2(b[0] - a[0], b[1] - a[1]), turn = ph >= cyc - 1 ? Math.sin(Math.PI * (ph - (cyc - 1))) : 0;
      P.actor.rotation.y = dir * turn * (R.turn ?? 0.6);
      P.roamAt = [+P.actor.position.x.toFixed(2), +P.actor.position.z.toFixed(2)];
    } else { P.actor.position.x = 0; P.actor.position.z = 0; P.actor.rotation.y = 0; }
    P.actor.scale.set(1 + sq * 0.5, 1 - sq, 1 + sq * 0.5);
    P.actor.rotation.z = G.lean * D2R * Math.sin(Math.PI * beats / 2);
    P.actor.rotation.x = -3 * D2R * land;
    P.actor.updateMatrixWorld(true);
    const fw = new THREE.Vector3(0, 0, 1).applyQuaternion(P.actor.getWorldQuaternion(new THREE.Quaternion()));
    const rt = new THREE.Vector3(1, 0, 0).applyQuaternion(P.actor.getWorldQuaternion(new THREE.Quaternion()));
    const head = P.bones.get('Head'), aL = P.bones.get('armLeft'), aR = P.bones.get('armRight');
    if (head) rotWorld(head, rt, G.nod * D2R * Math.sin(2 * Math.PI * f));
    if (!P.signs && aL && aR) P.signs = { l: armSign(P, aL, fw), r: armSign(P, aR, fw) };
    const pumpL = beat % 2 === 0 ? Math.exp(-f * 3.5) : 0, pumpR = beat % 2 === 1 ? Math.exp(-f * 3.5) : 0;
    if (aL) rotWorld(aL, fw, P.signs.l * D2R * (G.pump * pumpL + G.hitArms * hit));
    if (aR) rotWorld(aR, fw, P.signs.r * D2R * (G.pump * pumpR + G.hitArms * hit));
    return [{ motion: 'bounce', beat: +mod(beats, 8).toFixed(2), hit: +hit.toFixed(2) }];
  }

  /* ---------- Choreografie ---------- */
  const PH = def.phrase, phraseBeats = PH.bars * 4;
  function resolveCues(pid) {
    const list = (def.cues[pid] || []).map((c) => {
      const h = c.hit != null ? PH.hits[c.hit] : null;
      return { bar: c.bar, start: (c.bar - 1) * 4, motion: h ? h.motion : c.motion, offset: c.offset || 0, xf: h ? PH.hitCrossfadeBeats : PH.crossfadeBeats, hit: c.hit ?? null };
    }).sort((a, b) => a.start - b.start);
    return list;
  }
  for (const pid of Object.keys(perf)) perf[pid].cues = resolveCues(pid);
  function hitStrength(pb) {
    let h = 0;
    for (const x of PH.hits) {
      const s = (x.bar - 1) * 4, e = s + x.bars * 4;
      if (pb >= s - 0.5 && pb < e) h = Math.max(h, smooth((pb - s + 0.5) / 0.5) * (1 - smooth((pb - (e - 1)) / 1)));
    }
    return h;
  }
  function hitAt(pb) { for (let i = 0; i < PH.hits.length; i++) { const x = PH.hits[i], s = (x.bar - 1) * 4; if (pb >= s && pb < s + x.bars * 4) return i; } return null; }
  function cueLayers(P, pb) {
    const L = P.cues;
    if (!L.length) return [];
    let i = 0;
    for (let k = 0; k < L.length; k++) if (L[k].start <= pb) i = k;
    if (L[0].start > pb) i = L.length - 1;
    const cur = L[i];
    const e = mod(pb - cur.start, phraseBeats);
    const layers = [{ motion: cur.motion, beats: e + cur.offset, w: 1, cue: cur }];
    if (L.length > 1 && e < cur.xf) {
      const prev = L[(i - 1 + L.length) % L.length];
      const ep = mod(pb - prev.start, phraseBeats);
      const w = smooth(e / cur.xf);
      if (prev.motion !== cur.motion || prev.offset !== cur.offset) { layers[0].w = w; layers.unshift({ motion: prev.motion, beats: ep + prev.offset, w: 1 - w, cue: prev }); }
    }
    return layers;
  }

  /* ---------- Layout ---------- */
  const base = new Map();
  function layout(kind) {
    M.layoutKind = kind;
    if (kind === 'ensemble') {
      for (const P of Object.values(perf)) setT(P.group, P.def.ensemble);
      for (const [id, p] of Object.entries(props)) { setT(p.obj, p.def.ensemble); p.obj.visible = M.layers.prop; }
      const b = def.discoBall.ensemble;
      ball.place({ position: b.p, rotationYDeg: b.ry || 0, scale: b.s || 1 });
    } else {
      const order = [...Object.values(perf).map((P) => ({ o: P.group, w: LANE_W[P.lane] })), ...Object.entries(props).filter(([, p]) => !p.def.rowHidden).map(([, p]) => ({ o: p.obj, w: Math.max(LANE_W.prop, (p.size[0] || 0) + 0.4) }))];
      const total = order.reduce((s, x) => s + x.w, 0) + LANE_W.ball;
      let x = -total / 2;
      for (const it of order) { it.o.position.set(x + it.w / 2, 0, 0); it.o.rotation.set(0, 0, 0); x += it.w; }
      for (const p of Object.values(props)) p.obj.visible = !p.def.rowHidden && M.layers.prop;
      ball.place({ position: [x + LANE_W.ball / 2, 2.5, 0], rotationYDeg: 0, scale: 0.9 });
    }
    root.updateMatrixWorld(true);
  }
  function setT(o, t) { o.position.fromArray(t.p); o.rotation.set((t.rx || 0) * D2R, (t.ry || 0) * D2R, 0); if (t.s) o.scale.setScalar(t.s); }

  const M = {
    def, root, content, perf, props, ball, nodes, lib, catalog, catalogNote, tempo, base, crowd, collide,
    setCollide(on) { collide.on = !!on; if (!on) applyCrowd(false); },
    setRings(on) { collide.rings = !!on; syncRings(); },
    collideState() { return { on: collide.on, rings: collide.rings, active: collide.on && M.mode === 'ensemble', contacts: crowd.stat.contacts, hits: crowd.stat.hits, maxPen: +crowd.stat.maxPen.toFixed(3), radius: CO.radius || {}, bodies: Object.fromEntries([...crowd.bodies.values()].map((b) => [b.id, { off: +Math.hypot(...b.off).toFixed(3), lean: +Math.hypot(...b.lean).toFixed(1) }])) }; },
    layoutKind: null, mode: 'source', layers: { actor: true, prop: true, hab: true },
    phraseBeats, isLoop, travelOf, bindOf, rateOf, wanderMeters, wanderNode, wander: WD,
    layout,
    setAudition(pid, motion) { const P = perf[pid]; if (P && (motion === 'bounce' || P.clips.has(motion))) P.audition = motion; },
    motionsFor(pid) {
      const P = perf[pid];
      const list = P.lane === 'Rig_Legacy' ? ['bounce', ...P.clips.keys()] : [...P.clips.keys()].filter((n) => /^kfb_(dance|idle)/.test(n));
      return list;
    },
    /* clock: { time, beatPos, spb, level, camera } */
    update(clock, mode = M.mode) {
      M.mode = mode;
      const spb = clock.spb, bp = clock.beatPos;
      const pb = mod(bp, phraseBeats);
      const hit = mode === 'ensemble' ? hitStrength(pb) : 0;
      for (const P of Object.values(perf)) {
        let now;
        if (mode === 'source') {
          if (P.lane === 'Rig_Legacy') { if (P.kind !== 'rest') freshMixer(P); P.kind = 'rest'; restPose(P); now = []; }
          else now = evalClips(P, [], spb);
        } else if (mode === 'audition') {
          const m = P.audition, b = bp + (P.def.beatOffset || 0);
          now = m === 'bounce' ? bounce(P, b, 0) : evalClips(P, [{ motion: m, beats: b, w: 1 }], spb);
        } else {
          const L = cueLayers(P, pb);
          now = L.length && L[L.length - 1].motion === 'bounce' ? bounce(P, bp, hit, true) : evalClips(P, L.map((l) => ({ motion: l.motion, beats: l.beats, w: l.w })), spb, true);
          P.cue = L.length ? L[L.length - 1].cue : null;
        }
        P.now = now;
        if (P.graft) {
          try { P.graft.update(clock.dt || 0, clock.camera || undefined); } catch (e) { P.graftErr = e.message; }
          /* MC-Stimme: Visem-Shuffle (kein Lip-Sync) in den Rede-Takten der Phrase, stumm ohne Play */
          const tb = (P.def.mc && P.def.mc.talkBars) || [];
          const bar = Math.floor(pb / 4) + 1;
          const talk = !!clock.playing && mode !== 'source' && (mode === 'audition' || tb.some(([a, b]) => bar >= a && bar <= b));
          if (P.graft.mouth && P.talking !== talk) { try { P.graft.mouth.talk(talk); } catch {} P.talking = talk; }
        }
      }
      const active = collide.on && mode === 'ensemble';
      if (active && clock.dt > 0) { root.updateMatrixWorld(true); crowd.step(clock.dt); }
      applyCrowd(active);
      syncRings();
      const hi = mode === 'ensemble' ? hitAt(pb) : null;
      if (hi != null && M.lastHit !== hi && clock.playing) ball.impulse(1);
      M.lastHit = hi;
      M.phrase = { bar: Math.floor(pb / 4) + 1, beat: Math.floor(mod(pb, 4)) + 1, hit: hi != null ? PH.hits[hi].label : null, hitStrength: +hit.toFixed(2) };
      /* Boxen: kleiner Hüpfer + Stauchen auf dem Schlag + Front-Pump, vom Bass getragen */
      for (const p of Object.values(props)) {
        const q = p.def.pulse;
        if (!q) continue;
        const on = mode === 'source' ? 0 : 1;
        const f = mod(bp + (q.offset || 0), 1), env = Math.exp(-f * 7);
        const bass = clock.bass != null ? clock.bass : 0.5;
        const drive = on * (0.45 + 0.9 * bass) * (Math.floor(mod(bp, 4)) === 0 ? 1.25 : 1);
        const sq = q.squash * env * drive;
        p.inner.position.y = p.baseY * (1 - sq) + q.hop * drive * Math.max(0, Math.sin(Math.PI * Math.min(1, f * 2.2)));
        p.inner.scale.set(p.baseS * (1 + sq * 0.55), p.baseS * (1 - sq), p.baseS * (1 + sq * 0.55));
        p.pump.value = q.bulge * env * drive / p.baseS;
      }
      ball.update({ time: clock.time, beatPos: bp, level: clock.level, camera: clock.camera });
    },
    groundReport(clock, samples = 12) {
      const out = {};
      for (const P of Object.values(perf)) out[P.id] = { min: Infinity, max: -Infinity };
      const beats = M.mode === 'ensemble' ? phraseBeats : 16;
      for (let i = 0; i < samples; i++) {
        M.update({ ...clock, beatPos: (i / samples) * beats, camera: null, playing: false });
        root.updateMatrixWorld(true);
        for (const P of Object.values(perf)) {
          const y = lowestPosedY(P.actor, 4) - P.group.getWorldPosition(new THREE.Vector3()).y;
          out[P.id].min = Math.min(out[P.id].min, y); out[P.id].max = Math.max(out[P.id].max, y);
        }
      }
      for (const k of Object.keys(out)) out[k] = { min: +out[k].min.toFixed(3), max: +out[k].max.toFixed(3) };
      M.update(clock);
      return out;
    },
    performerOf(obj) {
      let p = obj;
      while (p) { for (const P of Object.values(perf)) if (p === P.actor || p === P.group) return P.id; p = p.parent; }
      return null;
    },
    dispose() {
      for (const P of Object.values(perf)) P.mixer.uncacheRoot(P.actor);
      ball.dispose();
      if (root.parent) root.parent.remove(root);
    }
  };
  layout('row');
  for (const [id, n] of nodes) base.set(id, { p: n.position.toArray(), r: n.rotation.toArray().slice(0, 3), s: n.scale.x });
  if (parent) parent.add(root);
  return M;
}
