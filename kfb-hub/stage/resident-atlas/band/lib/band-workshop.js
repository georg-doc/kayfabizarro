/* KFB Resident Atlas S8 · Band-Werkstatt
   Das Band-Modul (lib/band-module.js) als Resident im Atlas: dieselbe Editor-Schicht, dasselbe
   Studio, dieselbe Puppe und dasselbe IK wie jeder andere Resident. Diese Datei hält nur das,
   was es beim Einzel-Resident nicht gibt:
   · die Musik als einzige Uhr (Song → beatPos → jede Figur),
   · Host-Flächen, die NICHT zum Modul gehören, und das Absetzen des Modul-Roots darauf,
   · Referenzposen je Figur UND Bild: `band-01.<figur>.<aktion>@f<bild>`. Eine Handpose gilt dem
     Bild, an dem sie gesetzt wurde,
   · daraus je Figur ein KONSTANTER Patch (Δ auf den Clip) und die Prüfung über die ganze
     Schleife: Resident-Patch behalten oder POSE-TO-BLENDER-01 mit der Differenz je Bild.
   Kein automatischer Arm-zur-Trommel-Löser. */
import * as THREE from 'three';
import { loadBandModuleDef, mountBandModule, drumContact, scanDrummer, groundReport, measureFootprint, stickHead } from './band-module.js';

const KEY = { host: 'kfb.band-module-01.host.v1', acc: 'kfb.band-module-01.accepted.v2', clock: 'kfb.band-module-01.clock.v1', scen: 'kfb.band-module-01.scenery.v1' };
const D2R = Math.PI / 180, R2D = 180 / Math.PI, FPB = 24;
const r4 = (x) => +x.toFixed(4), r2 = (x) => +x.toFixed(2);
const mod = (a, n) => ((a % n) + n) % n;
const load = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const rawUrl = (c, p) => `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${c}/${p.split('/').map(encodeURIComponent).join('/')}`;

export async function createBandWorkshop({ V, ST, defUrl = './data/resident-band-module-01.json', onProgress = () => {} }) {
  const world = new THREE.Group();
  world.name = 'band-world';
  const hostG = new THREE.Group();
  hostG.name = 'host-surfaces';
  world.add(hostG);
  const mat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.92, metalness: 0 });
  const box = (w, h, d, c, name, y) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c));
    m.position.y = y; m.name = name; m.receiveShadow = true; m.castShadow = true; hostG.add(m); return m;
  };
  const floor = box(80, 0.2, 80, 0x2e281d, 'Host · Boden y 0', -0.1);
  floor.castShadow = false;
  const podest = box(11.5, 0.6, 10, 0x6b5033, 'Host · Podest 0,60', 0.3);
  const theke = box(12, 1.05, 3.2, 0x4d3a27, 'Host · Theke 1,05 (schmal)', 0.525);
  const HOSTS = { boden: { label: 'Boden', meshes: [floor] }, podest: { label: 'Podest 0,60', meshes: [floor, podest] }, theke: { label: 'Theke 1,05', meshes: [floor, theke] } };
  const placed = load(KEY.host) || {};
  let host = placed.host || 'boden';
  const showHost = () => { for (const m of [podest, theke]) m.visible = HOSTS[host].meshes.includes(m); };
  showHost();

  const def = await loadBandModuleDef(defUrl);
  const M = await mountBandModule(def, { parent: world, anchor: { position: placed.p || [0, 0, 0], rotationYDeg: placed.ry || 0 }, onProgress });
  const accepted = load(KEY.acc) || {};
  const scen = load(KEY.scen) || {};
  for (const [id, t] of Object.entries(scen)) { const p = M.props.get(id); if (p) { p.obj.position.fromArray(t.p); p.obj.rotation.set(...t.r.map((x) => x * D2R)); } }

  /* ---------- Uhr = Song ---------- */
  const song = def.song;
  const clock = Object.assign({ bpm: song.bpm, phase: song.phaseOffset }, load(KEY.clock) || {});
  const audio = new Audio();
  audio.preload = 'auto';
  let audioState = 'lädt', blobHash = null, blobOk = null, playing = false, freeT = 0;
  (async () => {
    try {
      const r = await fetch(rawUrl(song.commit, song.repoPath));
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const buf = new Uint8Array(await r.arrayBuffer());
      const head = new TextEncoder().encode(`blob ${buf.length}\0`);
      const all = new Uint8Array(head.length + buf.length); all.set(head); all.set(buf, head.length);
      blobHash = [...new Uint8Array(await crypto.subtle.digest('SHA-1', all))].map((x) => x.toString(16).padStart(2, '0')).join('');
      blobOk = blobHash === song.gitBlob;
      audio.src = URL.createObjectURL(new Blob([buf], { type: 'audio/mpeg' }));
      audioState = 'bereit';
    } catch (e) { audioState = 'fehlt · ' + (e.message || e); }
    B.emit();
  })();
  audio.addEventListener('ended', () => { playing = false; B.emit(); });
  /* Lautstärke für die Grooves: RMS über einen Analyser am Song, geglättet. Der AudioContext
     entsteht erst beim ersten Play (Browser verlangen eine Nutzergeste). */
  let actx = null, anl = null, abuf = null, level = 0.6;
  function ensureAnalyser() {
    if (actx || audioState !== 'bereit') return;
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      const src = actx.createMediaElementSource(audio);
      anl = actx.createAnalyser(); anl.fftSize = 1024; abuf = new Float32Array(anl.fftSize);
      src.connect(anl); anl.connect(actx.destination);
    } catch (e) { actx = null; }
  }
  function readLevel() {
    if (!anl || !playing) return level;
    anl.getFloatTimeDomainData(abuf);
    let s = 0; for (let i = 0; i < abuf.length; i++) s += abuf[i] * abuf[i];
    const rms = Math.sqrt(s / abuf.length), v = Math.min(1, rms / 0.25);
    level += (v - level) * (v > level ? 0.35 : 0.08);
    return level;
  }
  const songTime = () => (audioState === 'bereit' ? audio.currentTime : freeT);
  const beatPos = () => (songTime() - clock.phase) * clock.bpm / 60;
  const setSongTime = (t) => { if (audioState === 'bereit') audio.currentTime = Math.max(0, t); else freeT = Math.max(0, t); };

  /* ---------- Bilder & Referenzposen ---------- */
  const frameOf = (pid) => { const P = M.perf[pid]; return Math.round(P.t / M.actions[P.actionId].secPerBeat * FPB) % (M.actions[P.actionId].def.beats * FPB); };
  const bucketId = (pid, f = frameOf(pid), act = M.perf[pid].actionId) => `band-01.${pid}.${act}@f${f}`;
  const bucketsOf = (pid, act = M.perf[pid].actionId) => ST.ids().filter((id) => id.startsWith(`band-01.${pid}.${act}@f`) && ST.count(id) > 0);
  const hasEdits = (p) => p && (Object.keys(p.bones || {}).length + Object.keys(p.props || {}).length) > 0;

  function derive(pid) {
    const P = M.perf[pid], act = P.actionId, A = M.actions[act];
    const out = { schema: 'kfb.resident-pose-patch/1', module: def.id, performer: pid, action: act, bones: {}, props: {}, refs: {}, conflicts: [] };
    for (const id of bucketsOf(pid, act)) {
      const f = +id.split('@f')[1];
      const e = ST.of(id);
      out.refs['f' + f] = { frame: f, bones: Object.keys(e.bones || {}).length, props: Object.keys(e.nodes || {}).length, studioId: id };
      M.pose(pid, (f / FPB) * A.secPerBeat, null);
      for (const [name, deg] of Object.entries(e.bones || {})) {
        const b = P.bones.get(name);
        if (!b) continue;
        const abs = new THREE.Quaternion().setFromEuler(new THREE.Euler(deg[0] * D2R, deg[1] * D2R, deg[2] * D2R));
        const dq = b.quaternion.clone().invert().multiply(abs);
        const eu = new THREE.Euler().setFromQuaternion(dq);
        const rec = { dq: dq.toArray().map((x) => +x.toFixed(6)), ref: 'f' + f, deg: [eu.x, eu.y, eu.z].map((x) => r2(x * R2D)), angle: r2(2 * Math.acos(Math.min(1, Math.abs(dq.w))) * R2D) };
        const prev = out.bones[name];
        if (prev) {
          const diff = new THREE.Quaternion().fromArray(prev.dq).angleTo(dq) * R2D;
          if (diff > 2) out.conflicts.push({ kind: 'bone', id: name, diffDeg: r2(diff), byRef: { [prev.ref]: prev.deg, ['f' + f]: rec.deg } });
        } else out.bones[name] = rec;
      }
      for (const [nid, t] of Object.entries(e.nodes || {})) {
        const prev = out.props[nid];
        if (prev) {
          const dp = Math.hypot(...prev.p.map((v, i) => v - t.p[i]));
          const dr = Math.max(...prev.r.map((v, i) => Math.abs(v - t.r[i])));
          if (dp > 0.005 || dr > 1) out.conflicts.push({ kind: 'prop', id: nid, dp: r4(dp), drDeg: r2(dr) });
        } else out.props[nid] = { p: t.p, r: t.r, s: t.s, ref: 'f' + f };
      }
    }
    M.update(M.beatPos);
    return out;
  }
  const W = { patchOn: true, derived: {}, source: {}, scan: null, verdict: null, active: 'drummer', ground: null };
  const acceptedFor = (pid) => { const a = accepted[pid]; return a && a.action === M.perf[pid].actionId ? a : null; };
  function rederive() {
    for (const pid of Object.keys(M.perf)) {
      const d = derive(pid);
      W.derived[pid] = d;
      const live = hasEdits(d) ? d : acceptedFor(pid);
      W.source[pid] = hasEdits(d) ? 'Referenzposen (live)' : acceptedFor(pid) ? 'übernommen' : 'kein Patch';
      M.patches[pid] = W.patchOn ? live : null;
    }
    /* derive() stellt Figuren auf Referenzbilder — danach das aktuelle Bild wiederherstellen,
       sonst zeigt dieses Frame den reinen Clip statt der gerade gezogenen Pose. */
    if (!playing && typeof B !== 'undefined') B.post(0);
  }

  /* ---------- Prüfung über die Schleife ---------- */
  function check() {
    rederive();
    if (!W.scan) W.scan = scanDrummer(M, null);
    const tol = def.contact.tolerance, pen = def.contact.penetration;
    const patch = M.patches.drummer;
    const Bs = scanDrummer(M, null), Ps = scanDrummer(M, patch);
    const strikes = {};
    for (const side of ['R', 'L']) {
      const s = W.scan.strike[side];
      if (!s) { strikes[side] = { ok: false, why: 'kein Bild mit Kopf über dem Fell' }; continue; }
      const row = Ps.rows[s.f][side.toLowerCase()];
      strikes[side] = { f: s.f, before: s.gap, gap: row.gap, r: row.r, ok: row.gap != null && Math.abs(row.gap) <= tol, need: row.gap != null ? r4(-row.gap) : null };
    }
    const ranges = [];
    for (const side of ['R', 'L']) {
      let cur = null;
      for (const r of Ps.rows) {
        const g = r[side.toLowerCase()];
        const bad = g.gap != null && g.gap < -pen;
        if (bad && cur && r.f === cur.to + 1) { cur.to = r.f; if (g.gap < cur.deepest) { cur.deepest = g.gap; cur.at = r.f; } }
        else if (bad) { cur = { side, from: r.f, to: r.f, deepest: g.gap, at: r.f }; ranges.push(cur); }
        else cur = null;
      }
    }
    const conflicts = Object.values(W.derived).flatMap((d) => d.conflicts.map((c) => ({ ...c, performer: d.performer })));
    const keep = strikes.R.ok && strikes.L.ok && !ranges.length && !conflicts.length;
    const reasons = [];
    for (const side of ['R', 'L']) if (!strikes[side].ok) reasons.push(`${side}-Schlag Bild ${strikes[side].f}: ${strikes[side].gap} (±${tol})`);
    for (const g of ranges) reasons.push(`${g.side} im Fell Bild ${g.from}–${g.to}, tiefste ${g.deepest} bei ${g.at}`);
    for (const c of conflicts) reasons.push(`${c.performer} · ${c.id}: Δ zwischen Referenzbildern ${c.diffDeg ?? c.dp}${c.diffDeg != null ? '°' : ''} verschieden`);
    W.verdict = {
      at: new Date().toISOString(), action: M.perf.drummer.actionId, keep, strikes, ranges, conflicts, reasons,
      patched: Object.fromEntries(Object.entries(M.patches).map(([k, p]) => [k, p ? Object.keys(p.bones || {}).length + Object.keys(p.props || {}).length : 0])),
      flag: keep ? null : {
        gate: 'POSE-TO-BLENDER-01', action: M.perf.drummer.actionId, actionSrc: def.actions[M.perf.drummer.actionId].src, fps: 24, framesPerBeat: FPB, tolerance: tol,
        note: 'Eine konstante Korrektur hält nicht über die Schleife. perFrame: Schlägelkopf über dem Fell je Bild ohne (base) und mit Patch (gap), d = Verschiebung durch den Patch. Ziel: an den Schlagbildern gap ≈ 0, sonst nie < −penetration. Kein Löser gestartet.',
        perFrame: Ps.rows.map((r, i) => {
          const b = Bs.rows[i], d = (x, y) => (x != null && y != null ? r4(x - y) : null);
          const role = r.f === (W.scan.strike.R || {}).f ? 'strike R' : r.f === (W.scan.strike.L || {}).f ? 'strike L' : '';
          return { f: r.f, role, baseL: b.l.gap, gapL: r.l.gap, dL: d(r.l.gap, b.l.gap), baseR: b.r.gap, gapR: r.r.gap, dR: d(r.r.gap, b.r.gap) };
        }),
        strikes, penetration: ranges, boneConflicts: conflicts, patch: W.derived.drummer
      }
    };
    B.emit();
    return W.verdict;
  }
  function accept() {
    if (!W.verdict || !W.verdict.keep) return false;
    for (const [pid, p] of Object.entries(M.patches)) {
      if (!hasEdits(p)) continue;
      accepted[pid] = { ...JSON.parse(JSON.stringify(p)), acceptedAt: new Date().toISOString() };
      for (const id of bucketsOf(pid)) ST.setCheck(id, 'RESIDENT-BAND-MODULE-01 · als Resident-Patch übernommen');
    }
    save(KEY.acc, accepted);
    rederive(); B.emit();
    return true;
  }

  /* ---------- Modul-Root auf Host-Fläche ---------- */
  M.fp = measureFootprint(M);
  const _ray = new THREE.Raycaster();
  let support = null;
  function savePlacement() { save(KEY.host, { host, p: M.root.position.toArray().map(r4), ry: r2(M.root.rotation.y * R2D) }); }
  function dropOnHost() {
    world.updateMatrixWorld(true);
    const fp = M.fp.rootFrame, ins = 0.15;
    const pts = [[0, 0, 'Stützpunkt'], [fp.min[0] + ins, fp.min[1] + ins, 'Ecke −x−z'], [fp.max[0] - ins, fp.min[1] + ins, 'Ecke +x−z'],
                 [fp.max[0] - ins, fp.max[1] - ins, 'Ecke +x+z'], [fp.min[0] + ins, fp.max[1] - ins, 'Ecke −x+z']];
    const targets = HOSTS[host].meshes.filter((m) => m.visible);
    const hits = pts.map(([x, z, label]) => {
      const w = new THREE.Vector3(x, 0, z).applyEuler(new THREE.Euler(0, M.root.rotation.y, 0)).multiplyScalar(M.root.scale.x).add(M.root.position);
      _ray.set(new THREE.Vector3(w.x, 60, w.z), new THREE.Vector3(0, -1, 0));
      const h = _ray.intersectObjects(targets, false)[0];
      return { label, y: h ? r4(h.point.y) : null, on: h ? h.object.name : null };
    });
    const y = hits[0].y ?? 0;
    M.root.position.y = y;
    M.root.updateMatrixWorld(true);
    const carried = hits.slice(1).filter((h) => h.y != null && Math.abs(h.y - y) <= 0.05).length;
    support = { host, on: hits[0].on || 'nichts — y 0', y, carried, of: 4, corners: hits.slice(1) };
    savePlacement(); B.emit();
    return support;
  }

  const listeners = new Set();
  const B = {
    def, M, world, W, HOSTS, clock,
    emit() { listeners.forEach((f) => f()); },
    onChange(f) { listeners.add(f); },
    get playing() { return playing; },
    get host() { return host; },
    get support() { return support; },
    performers: () => Object.keys(M.perf),
    frameOf, bucketId,
    /* IK-Effektor Schlägelkopf für die Trommler-Arme */
    effectorsFor(pid) {
      if (pid !== 'drummer' || !M.drum) return {};
      return { 'arm.r': (o) => stickHead(M, 'r', o), 'arm.l': (o) => stickHead(M, 'l', o) };
    },
    jointNames(pid) { return M.perf[pid] ? M.perf[pid].joints : new Set(); },
    performerOf(obj) {
      let p = obj;
      while (p) { for (const [pid, P] of Object.entries(M.perf)) if (p === P.actor) return pid; p = p.parent; }
      return null;
    },
    /* Transport */
    play() { M.holds = {}; playing = true; ensureAnalyser(); if (actx && actx.state === 'suspended') actx.resume(); if (audioState === 'bereit') audio.play().catch(() => { playing = false; B.emit(); }); B.emit(); },
    pause() { playing = false; audio.pause(); M.beatPos = beatPos(); B.emit(); },
    toggle() { playing ? B.pause() : B.play(); },
    restart() { M.holds = {}; setSongTime(clock.phase); B.emit(); },
    seekFrac(k) { M.holds = {}; setSongTime(k * (audio.duration || 120)); B.emit(); },
    nudge(key, d) {
      if (key === 'phase') clock.phase = +(clock.phase + d).toFixed(3);
      if (key === 'reset') { clock.bpm = song.bpm; clock.phase = song.phaseOffset; }
      save(KEY.clock, clock); B.emit();
    },
    /* Trommler an einem gemessenen Schlagbild anhalten */
    holdStrike(side) {
      B.pause();
      if (!W.scan) W.scan = scanDrummer(M, null);
      const s = W.scan.strike[side];
      if (!s) return null;
      M.holds.drummer = s.t;
      W.active = 'drummer';
      B.post(0); // Bild sofort stellen: der nächste Griff schreibt in die Referenz DIESES Bildes
      B.emit();
      return s;
    },
    releaseHold() { M.holds = {}; B.post(0); B.emit(); },
    holdAt(pid, frame) { B.pause(); const P = M.perf[pid]; M.holds[pid] = (frame / FPB) * M.actions[P.actionId].secPerBeat; W.active = pid; B.post(0); B.emit(); },
    setDrumAction(id) {
      M.holds = {};
      M.setAction('drummer', id);
      W.scan = scanDrummer(M, null); W.verdict = null;
      rederive(); W.ground = groundReport(M); B.emit();
    },
    setAction(pid, id) {
      if (pid === 'drummer') return B.setDrumAction(id);
      M.holds = {}; M.setAction(pid, id); W.verdict = null; rederive(); W.ground = groundReport(M); B.emit();
    },
    setFitMode(pid, mode) { const P = M.perf[pid]; if (P && P.fit && 'mode' in P.fit) { P.fit.mode = mode; B.post(0); B.emit(); } },
    setMember(pid, on) { const P = M.perf[pid]; if (P) { P.group.visible = on; B.emit(); } },
    setPatchOn(on) { W.patchOn = on; rederive(); B.emit(); },
    setActive(pid) { if (M.perf[pid]) { W.active = pid; B.emit(); } },
    clearBucket(id) { ST.clear(id); W.verdict = null; rederive(); B.emit(); },
    dropAccepted(pid) { delete accepted[pid]; save(KEY.acc, accepted); rederive(); B.emit(); },
    check, accept, rederive, dropOnHost,
    setHost(h) { if (!HOSTS[h]) return; host = h; showHost(); dropOnHost(); },
    resetRoot() { M.root.position.set(0, 0, 0); M.root.rotation.set(0, 0, 0); dropOnHost(); },
    /* Studio: ein Griff an einer Figur schreibt in die Referenz DIESES Bildes */
    recordBone(pid, bone) { if (!M.perf[pid]) return; B.pause(); ST.residentId = bucketId(pid); W.active = pid; ST.recordBone(bone.name, bone); },
    recordNode(obj) {
      const e = obj.userData.entry;
      if (!e) return;
      if (e.id === 'module-root') { savePlacement(); B.emit(); return; }
      if (e.kind === 'scenery') { scen[e.id] = { p: obj.position.toArray().map(r4), r: obj.rotation.toArray().slice(0, 3).map((x) => r2(x * R2D)) }; save(KEY.scen, scen); return; }
      const pid = e.performer || (e.id.startsWith('actor.') ? e.id.slice(6) : null);
      if (!pid) return;
      B.pause(); ST.residentId = bucketId(pid); W.active = pid; ST.recordNode(e.id, obj);
    },
    setLayers({ actor = true, prop = true, hab = true }) {
      for (const P of Object.values(M.perf)) P.actor.visible = actor;
      for (const [id, p] of M.props) if (!id.startsWith('anchor.') && !id.startsWith('actor.')) p.obj.visible = id === 'banner' ? hab : prop;
    },
    view(name) {
      const ry = M.root.rotation.y;
      const rot = (d) => new THREE.Vector3(...d).applyEuler(new THREE.Euler(0, ry, 0)).toArray();
      if (name === 'front') V.frame(M.content, rot([0, 0.24, 1]), 1.2);
      else if (name === 'top') V.frame(M.content, rot([0, 1, 0.02]), 1.12);
      else if (name === 'drum') V.frame(M.perf.drummer.group, rot([-0.85, 0.78, 0.4]), 0.86);
      else V.frame(M.content, rot([0.75, 0.42, 1]), 1.16);
    },
    /* jedes Bild: Figuren stellen, pausiert zusätzlich die Referenzpose des aktuellen Bildes */
    post(dt) {
      if (playing && audioState !== 'bereit') freeT += dt;
      M.level = readLevel();
      M.update(playing ? beatPos() : (Object.keys(M.holds).length ? M.beatPos : beatPos()));
      if (!playing) {
        const keep = ST.residentId;
        for (const [pid, P] of Object.entries(M.perf)) {
          const id = bucketId(pid);
          if (ST.count(id)) { ST.residentId = id; ST.post(() => P.actor); }
        }
        ST.residentId = bucketId(W.active) || keep;
      }
    },
    detach() { B.pause(); if (world.parent) world.parent.remove(world); },
    attach() { V.scene.add(world); },
    live() { return { l: drumContact(M, 'l'), r: drumContact(M, 'r') }; },
    clockNow() { const bp = playing ? beatPos() : M.beatPos; return { time: songTime(), dur: audio.duration || 0, playing, bar: Math.floor(bp / 4) + 1, beat: Math.floor(mod(bp, 4)) + 1 }; },
    moduleDoc() {
      const d = JSON.parse(JSON.stringify(def));
      d.anchors.footprint = { ...d.anchors.footprint, measured: M.fp.moduleFrame, measuredHeight: M.fp.height };
      d.posePatches = Object.fromEntries(Object.keys(M.perf).map((pid) => [pid, accepted[pid] || null]));
      d.hostExample = { note: 'Beispiel des Review-Hosts, gehört NICHT zum Modul', host, anchor: { position: M.root.position.toArray().map(r4), rotationYDeg: r2(M.root.rotation.y * R2D) }, support };
      return d;
    },
    patchDoc() {
      return {
        kind: 'kfb.resident-band-module.pose-patch/1', exportedAt: new Date().toISOString(), module: def.id,
        song: { id: song.id, bpm: clock.bpm, phase: clock.phase }, strikeFrames: W.scan ? W.scan.strike : null,
        derived: W.derived, accepted, verdict: W.verdict,
        studio: (() => { const ids = Object.keys(M.perf).flatMap((pid) => bucketsOf(pid)); return ST.bundle(ids.length ? ids : ['__keine__'], { module: def.id }); })()
      };
    },
    snapshot() {
      const bp = playing ? beatPos() : M.beatPos;
      return {
        song: { state: audioState, blobOk, blobHash, time: songTime(), dur: audio.duration || 0, playing, bpm: clock.bpm, phase: clock.phase,
                bar: Math.floor(bp / 4) + 1, beat: Math.floor(mod(bp, 4)) + 1, beatPos: bp, measuredBpm: song.bpm, measuredPhase: song.phaseOffset },
        perf: Object.values(M.perf).map((P) => ({ id: P.id, label: P.def.label, rig: P.def.rig, action: P.actionId, status: M.actions[P.actionId].def.status,
          bound: `${P.bind.bound}/${P.bind.of}`, src: P.def.asset.path.split('/').pop(), commit: P.def.asset.commit.slice(0, 8), frame: frameOf(P.id),
          ground: W.ground && W.ground[P.id], buckets: bucketsOf(P.id).map((id) => ({ id, frame: +id.split('@f')[1], n: ST.count(id), checked: !!ST.check(id) })),
          patch: W.derived[P.id] ? { bones: Object.keys(W.derived[P.id].bones).length, props: Object.keys(W.derived[P.id].props).length, conflicts: W.derived[P.id].conflicts.length } : null,
          source: W.source[P.id], accepted: accepted[P.id] ? accepted[P.id].acceptedAt : null,
          actions: Object.keys(def.actions).filter((k) => def.actions[k].performer === P.id), visible: P.group.visible,
          optional: !!P.def.optional, member: P.def.member || 'core',
          fit: P.fit ? (P.fit.res ? { kind: 'guitar', res: P.fit.res } : { kind: 'trumpet', reach: P.fit.reach, need: P.fit.need, gap: P.fit.gap, len: P.fit.len, mode: P.fit.mode, groove: P.grooveState || null, pawToTrumpet: P.fit.pawToTrumpet, mouthGapPaw: P.fit.mouthToMouthpiecePaw }) : null })),
        active: W.active, host, support, fp: M.fp, strike: W.scan && W.scan.strike, holds: { ...M.holds }, live: B.live(),
        drumAction: M.perf.drummer.actionId, drumActions: Object.keys(def.actions).filter((k) => def.actions[k].performer === 'drummer'),
        patchOn: W.patchOn, verdict: W.verdict, findings: def.findings || []
      };
    }
  };

  W.scan = scanDrummer(M, null);
  rederive();
  W.ground = groundReport(M);
  B.attach();
  dropOnHost();
  return B;
}
