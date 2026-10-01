/* KFB J17 · travel-core.j17.js · wörtlich j14 + ein Einhängepunkt: host.hop. Will die Seat-Schicht den Wechsel (Cabrio + FB), trägt der Schnitt hop = true
 * und cutStep gibt Zeit und Ende an host.hop.step ab (Hop über die Seitenwand, VEHICLE_SEAT_CONTRACT). Zustände, Gates, Tasten, Kamera-Übergabe bleiben hier. */
/* KFB J14 · travel-core.j14.js · Zustandsmaschine Reisemodi (Walk / Auto / Flug = Jump-Kandidat). DESIGN PROOF · CANDIDATE.
 * Besitzt NUR: Zustände, Gates, Tastendeutung (Schema wsa6 = Standard: Leertaste < 0,5 m/s Aus-/Einsteigen, ≥ 0,5 m/s Hüpfen/Springen · Schema georgI = I-Taste, Rückfall), Rollenwahl, Schnitt-Choreografie
 * (Sprung aufs Dach / Ausspucken, PROCEDURAL), Kamera-Übergabe-Zustand, Messung (Fußkontakt/Rutschen) und Spuren.
 * Besitzt NICHT: Auto-Bewegung (kfb-drive.k2b/k2 · stepDriver), Ground-Position (walk-controller.js, einziger Schreiber),
 * Strecke/Fläche (Track Core Stream), Clips (KayKit 1.1 Rig_Medium/Rig_Large über locomotion-profiles.v1 / anim-map.v1), Rendering.
 * Reine Logik mit injiziertem THREE: läuft im Browser (J14) und headless (Probe) mit denselben Dateien. */
export const SCHEMA = 'kfb.j14.travel-trace/0.2';
export const T_CAM = 0.7, T_TAKEOFF = 0.25, T_LANDING = 0.45, V_EXIT = 0.5, R_ENTER = 3.5, R_ZIP = 25;
/* Schnitt-Choreografie (Sekunden). Einsteigen: Ausholen → Bogen aufs Dach → im Dach versinken (Puff, Auto federt) → „plumpst“ in den Sitz (zweiter Federer).
   Aussteigen: Auto staucht → spuckt aus dem Dach (Puff, Auto streckt) → Bogen neben die Tür → Landung mit Nachfedern. */
export const CUT = { enter: { wind: 0.16, sink: 0.12, plop: 0.26, apex: 1.25 }, exit: { press: 0.16, fly: 0.62, land: 0.34, apex: 1.5 } };
export const SPRINT_CAND = { clip: 'Running_B', rate: 1.3, status: 'UNPROVEN · Kandidat', why: 'WSA #5: Running_B × 1,3 nur zeigen und messen' };
const ROLE_OF = { idle: 'idle', walk: 'walk', run: 'run', sprint: 'sprint', backward: 'backward', strafeL: 'strafe.left', strafeR: 'strafe.right' };
const med = a => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const r3 = v => (v == null || !isFinite(v)) ? v : Math.round(v * 1000) / 1000;
const sst = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const elastic = x => x >= 1 ? 1 : 1 - Math.cos(x * Math.PI * 2.6) * Math.exp(-x * 5.5);   // Überschwinger für Pop/Landung

export const SCHEMES = { wsa6: 'Leertaste tempo-sicher (WSA #6, Standard)', georgI: 'I-Taste + Leertaste = Sprung (Georg 30.09., Rückfall)' };
export function createTravelCore({ THREE, td, W, ground, boxes = [], turnarounds = [], walker, actor = null, profiles = null, animMap = null, host = {}, scheme = 'wsa6' }) {
  let P = profiles?.profiles || {}, M = animMap?.states || {}, TRN = profiles?.transitions || {};
  const role = r => { if (r === 'sprint') { const b = P.sprint; if (!b || !b.clip) return null;
      if (b.clip === SPRINT_CAND.clip) return { clip: SPRINT_CAND.clip, rate: SPRINT_CAND.rate, world: +(b.measured.stanceSpeed * SPRINT_CAND.rate).toFixed(3), prof: b, cand: true };
      return { clip: b.clip, rate: b.playbackRate, world: b.worldSpeed, prof: b, cand: true, routed: true }; }   // Rig ohne Running_B: Router-Ausgabe (Tempo-Variante)
    const p = P[r]; return p && p.clip ? { clip: p.clip, rate: p.playbackRate, world: p.worldSpeed, prof: p } : null; };
  const S = { mode: 'AUTO', st: 'AUTO.SEATED', t: 0, stT: 0, gait: null, clip: null, rate: 1, cam: 'chase', camK: 1, space: 'Hüpfen', act: 'Aussteigen', actOk: false,
    reject: null, cut: null, pose: null, park: null, wende: null, lastJump: 0, jumpEdge: false, iEdge: false, iPend: false, probe: null, ctrl: false, unmapped: null, scheme: SCHEMES[scheme] ? scheme : 'wsa6', spaceOk: true, spaceLow: false };
  const ev = [], trace = [], slip = {}, contacts = { l: { on: false, n: 0 }, r: { on: false, n: 0 } };
  let tr = 0, carRef = null;
  const push = (type, o = {}) => ev.push({ t: r3(S.t), type, mode: S.mode, st: S.st, ...o });
  const go = (st, why = '') => { if (st === S.st) return; push('state', { from: S.st, to: st, why }); S.st = st; S.stT = 0; S.mode = st.startsWith('WALK') || st === 'CAM.TO_WALK' ? 'WALK' : 'AUTO'; };
  const rejectAt = (text, where) => { S.reject = { text, t: S.t, where }; push('reject', { text, where }); };

  /* ---------- Clips (ein Mixer, Rollen aus dem Profil-Router) ---------- */
  let acts = {}, cur = null;
  const act = name => { if (!actor || !actor.clips.has(name)) return null; return acts[name] || (acts[name] = actor.mixer.clipAction(actor.clips.get(name))); };
  const play = (r, { once = false, fade = 0.2, sync = false } = {}) => {
    const R = role(r) || (r === 'drive' && M.DriveIdle?.clip ? { clip: M.DriveIdle.clip, rate: 1 } : null); S.gait = r; if (!R || !R.clip) { S.clip = null; return; }
    const a = act(R.clip); if (!a) { S.clip = R.clip; S.rate = R.rate; return; }
    if (cur === a && a.timeScale === R.rate && !once) return;
    const ph = sync && cur ? (cur.time / cur.getClip().duration) : 0;
    a.reset(); a.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, Infinity); a.clampWhenFinished = once; a.timeScale = R.rate; a.enabled = true; a.setEffectiveWeight(1);
    if (sync) a.time = ph * a.getClip().duration; a.play(); if (cur && cur !== a) cur.crossFadeTo(a, fade, false); cur = a;
    push('clip', { role: r, clip: R.clip, rate: R.rate, candidate: !!R.cand }); S.clip = R.clip; S.rate = R.rate; };
  const fadeOf = (a, b) => (TRN[a + '→' + b] || TRN['any→' + b] || {}).fade ?? 0.2, syncOf = (a, b) => !!(TRN[a + '→' + b] || {}).syncPhase;
  const setActor = (a, prof, map) => { if (actor) actor.mixer.stopAllAction(); actor = a; P = prof?.profiles || {}; M = map?.states || {}; TRN = prof?.transitions || {}; acts = {}; cur = null; S.gait = null;
    push('actor', { id: a?.id, rig: a?.rig, unmapped: prof?.unmapped || [] }); if (S.mode === 'WALK') play('idle', { fade: 0 }); else play('drive', { fade: 0 }); };

  /* ---------- Fußkontakt + Rutschen (am echten Rig, Weltmeter) ---------- */
  const fp = { l: new THREE.Vector3(), r: new THREE.Vector3() }, fq = { l: new THREE.Vector3(), r: new THREE.Vector3() }, loc = new THREE.Vector3(), side = new THREE.Vector3();
  const measureFeet = dt => { if (!actor || !cur || dt <= 0) return null; const R = role(S.gait), c = R?.prof?.measured?.contacts; if (!c) return null;
    actor.root.updateMatrixWorld(true); side.set(Math.cos(walker.state.heading), 0, -Math.sin(walker.state.heading));
    const out = {}, key = (actor.id ? actor.id + ':' : '') + S.gait + (R.cand ? '*' : '');
    for (const s of ['l', 'r']) { const f = actor.feet[s]; f.getWorldPosition(fq[s]); loc.copy(fq[s]); actor.root.worldToLocal(loc);
      const C = c['foot.' + s], thr = C.minY + Math.max(0.012, C.lift * 0.18), on = loc.y <= thr + 0.004;
      const B = slip[key] || (slip[key] = { v: [], lat: [], plant: 0, world: [] });
      if (on && contacts[s].on) { const dx = fq[s].x - fp[s].x, dz = fq[s].z - fp[s].z, v = Math.hypot(dx, dz) / dt, lat = (dx * side.x + dz * side.z) / dt; B.v.push(v); B.lat.push(lat); B.world.push(walker.state.speed); out[s] = v; }
      if (on && !contacts[s].on) { contacts[s].n++; B.plant++; }
      contacts[s].on = on; fp[s].copy(fq[s]); }
    return out; };

  /* ---------- Gates + Schnitt ---------- */
  const carSpeed = d => Math.abs(d.fly ? Math.hypot(d.fly.V[0], d.fly.V[1], d.fly.V[2]) : d.speed);
  const roofOf = Pz => { const h = (host.carH?.() || 1.6) + 0.05; return [Pz.P[0] + Pz.U[0] * h, Pz.P[1] + Pz.U[1] * h, Pz.P[2] + Pz.U[2] * h]; };
  const exitSpot = (d, Pz) => { const hw = (host.halfW?.() || 1.08) + 0.85;
    for (const sd of [1, -1]) { const x = Pz.P[0] + Pz.X[0] * hw * sd, z = Pz.P[2] + Pz.X[2] * hw * sd, g = ground.info(x, z, d.s); if (g.ok) return { x, z, y: g.y, s: g.s, id: g.id, side: sd > 0 ? 'links' : 'rechts' }; }
    const g = ground.info(Pz.P[0], Pz.P[2], d.s); return { fail: g.ok ? 'Tür blockiert' : ('kein Boden · ' + (g.why || '?')) }; };
  const exitGate = (d, Pz) => { const v = carSpeed(d); if (v >= V_EXIT) return 'Erst anhalten · ' + v.toFixed(1) + ' m/s'; if (d.fly || !d.onGround) return 'In der Luft'; const sp = exitSpot(d, Pz); return sp.fail ? 'Hier kein Aussteigen · ' + sp.fail : null; };
  const tryExit = (d, Pz, via) => { const why = exitGate(d, Pz); if (why) return rejectAt(why, 'car');
    const sp = exitSpot(d, Pz), hd = Math.atan2(Pz.F[0], Pz.F[2]) + (sp.side === 'links' ? 0.9 : -0.9); walker.reset(sp.x, sp.z, sp.y, hd); ground.st.s = sp.s; ground.st.y = sp.y;
    S.cut = { hop: !!host.hop?.wants?.(), kind: 'exit', t: 0, from: roofOf(Pz), to: [sp.x, sp.y, sp.z], yaw: hd, ev: {} }; S.gait = null; if (cur) { cur.fadeOut(0.05); cur = null; }
    push('exit', { via, v: r3(carSpeed(d)), spot: sp.id, side: sp.side, s: r3(d.s) }); host.squash?.(1.1); go('CUT.EXIT', via); };
  const doorDist = Pz => { if (!Pz) return 1e9; const p = walker.state.position; return Math.hypot(p.x - Pz.P[0], p.z - Pz.P[2]); };
  const tryEnter = (Pz, via) => { const d = doorDist(Pz), lim = via === 'key' ? R_ENTER : R_ZIP;
    if (!walker.state.onGround) return rejectAt('Erst landen', 'actor');
    if (d > lim) return rejectAt('Auto ' + d.toFixed(0) + ' m entfernt', 'actor');
    const p = walker.state.position, fly = 0.46 + Math.min(0.5, d * 0.02);
    S.cut = { hop: !!host.hop?.wants?.(), kind: 'enter', t: 0, from: [p.x, p.y, p.z], to: roofOf(Pz), yaw: Math.atan2(Pz.P[0] - p.x, Pz.P[2] - p.z), fly, ev: {} };
    play('jump.start', { once: true, fade: 0.08 }); push('enter', { via, dist: r3(d), zip: d > R_ENTER, fly: r3(fly) }); go('CUT.ENTER', via); };
  const arc = (a, b, k, apex) => { const H = apex + Math.abs(b[1] - a[1]) * 0.5; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + 4 * k * (1 - k) * H, a[2] + (b[2] - a[2]) * k]; };   // Scheitel = höherer Punkt + apex
  const once = (c, k) => { if (c.ev[k]) return false; c.ev[k] = true; return true; };
  const cutStep = (dt, Pz) => { const c = S.cut; if (c.hop) return host.hop.step(c, dt, Pz, S); c.t += dt; const t = c.t;
    if (c.kind === 'enter') { const E = CUT.enter, t1 = E.wind, t2 = t1 + c.fly, t3 = t2 + E.sink, t4 = t3 + E.plop; c.to = roofOf(Pz);
      if (t < t1) { const k = t / t1; S.pose = { p: c.from, s: [1 + 0.14 * k, 1 - 0.24 * k, 1 + 0.14 * k], yaw: c.yaw, vis: true }; }
      else if (t < t2) { const k = (t - t1) / c.fly, st = 1 + 0.22 * Math.sin(k * Math.PI); if (once(c, 'air')) { play('jump.air', { fade: 0.08 }); push('cut', { phase: 'hop', to: 'Dach' }); }
        S.pose = { p: arc(c.from, c.to, sst(k * 0.92 + 0.04), E.apex), s: [1 / Math.sqrt(st), st, 1 / Math.sqrt(st)], yaw: c.yaw, vis: true }; }
      else if (t < t3) { const k = (t - t2) / E.sink; if (once(c, 'sink')) { host.puff?.(c.to, 5, 0.34); host.squash?.(0.85); push('cut', { phase: 'sink', where: 'Dach', puff: 5 }); }
        S.pose = { p: [c.to[0], c.to[1] - 0.9 * k, c.to[2]], s: [1 + 0.3 * k, Math.max(0.001, 1 - k), 1 + 0.3 * k], yaw: c.yaw, vis: k < 0.98 }; }
      else { S.pose = { p: c.to, s: [0.001, 0.001, 0.001], yaw: c.yaw, vis: false }; if (t >= t3 + E.plop * 0.55 && once(c, 'plop')) { host.squash?.(0.55); host.puff?.(c.to, 2, 0.2); push('cut', { phase: 'plop', where: 'Sitz (unsichtbar)' }); } }
      return t >= t4; }
    const E = CUT.exit, t1 = E.press, t2 = t1 + E.fly, t3 = t2 + E.land;
    if (t < t1) S.pose = { p: c.from, s: [0.001, 0.001, 0.001], yaw: c.yaw, vis: false };
    else if (t < t2) { const k = (t - t1) / E.fly; if (once(c, 'spit')) { host.squash?.(-1.0); host.puff?.(c.from, 4, 0.3); play('jump.air', { fade: 0 }); push('cut', { phase: 'spit', from: 'Dach', puff: 4 }); }
      const pop = elastic(Math.min(1, k / 0.28)), st = 1 + 0.18 * Math.sin(k * Math.PI);
      S.pose = { p: arc(c.from, c.to, sst(k), E.apex), s: [pop / Math.sqrt(st), pop * st, pop / Math.sqrt(st)], yaw: c.yaw + (1 - sst(k)) * Math.PI * 2, vis: true }; }
    else { const k = (t - t2) / E.land; if (once(c, 'land')) { play('jump.land', { once: true, fade: 0.04 }); host.puff?.(c.to, 3, 0.26); push('land', { who: 'actor', from: 'Ausspucken', surf: ground.info(c.to[0], c.to[2]).id }); }
      const b = 1 - (1 - elastic(k)) * 0.34; S.pose = { p: c.to, s: [2 - b * 0.9 - 0.1 * (1 - k), b, 2 - b * 0.9 - 0.1 * (1 - k)].map(v => Math.max(0.2, v)), yaw: c.yaw, vis: true }; }
    return t >= t3; };

  /* ---------- Auto-Eingang: Auto fährt nur im Auto-Modus. Leertaste = Hüpfen (immer), I = Ein-/Aussteigen ---------- */
  const Z = { gas: 0, brake: 0, left: 0, right: 0, driftL: 0, driftR: 0, boost: 0, jump: 0 };
  let lastK = { ...Z };
  const carInput = (K, d) => { const Kp = S.probe?.car ? { ...Z, ...S.probe.car } : K; lastK = Kp; carRef = d;
    if (!S.st.startsWith('AUTO')) return { ...Z, brake: d.speed > 0.05 ? 1 : 0 };   // geparkt: nur Bremse, kein Schreiben in den Fahrzustand
    S.spaceLow = carSpeed(d) < V_EXIT && d.onGround && !d.fly;   // Entscheid fällt VOR dem Schritt, derselbe Wert gilt in update → nie Hüpfen + Aussteigen im selben Frame
    if (S.scheme === 'wsa6' && S.spaceLow) return { ...Kp, jump: 0 };   // unter 0,5 m/s gehört die Leertaste dem Aussteigen, nicht der Fahrphysik
    return Kp; };
  const interact = () => { S.iPend = true; };

  /* ---------- Takt ---------- */
  const update = (dt, d, Pz) => { S.t += dt; S.stT += dt; carRef = d; if (S.probe) probeStep(dt, d, Pz);
    const K = S.probe?.keys ? { ...Z, ...S.probe.keys } : lastK, jumpDown = !!K.jump, edge = jumpDown && !S.jumpEdge; S.jumpEdge = jumpDown;
    const iEdge = S.iPend; S.iPend = false;
    const ctrl = S.probe?.keys ? !!S.probe.keys.ctrl : S.ctrl; const v = carSpeed(d);
    for (const e of d.events || []) { if (e.type === 'takeoff' && S.mode === 'AUTO') { push('takeoff', { s: r3(e.s), v: r3(e.v) }); go('AUTO.TAKEOFF', 'Stream-Luftstück'); S.cam = 'fly'; push('cam', { to: 'fly-chase', why: 'j09 Flugkamera' }); }
      if (e.type === 'land' && S.mode === 'AUTO' && S.st.startsWith('AUTO')) { push('land', { s: r3(e.s), energy: r3(e.energy) }); go('AUTO.LANDING', 'Landung auf Fahrfläche'); S.cam = 'chase'; push('cam', { to: 'chase', why: 'Landung' }); }
      if (e.type === 'rescue') push('rescue', { s: r3(e.s) }); }
    switch (S.st) {
      case 'AUTO.SEATED': case 'AUTO.PARKED': {
        const parked = v < V_EXIT && d.onGround && !d.fly; if (parked && S.st === 'AUTO.SEATED' && S.stT > 0.15) go('AUTO.PARKED', 'v < 0,5 m/s'); if (!parked && S.st === 'AUTO.PARKED') go('AUTO.SEATED', 'fährt');
        if (parked) { const b = boxes.find(b => inBoxXZ(b, Pz.P[0], Pz.P[2])); const key = b ? b.n : null; if (key !== S.park) { S.park = key; if (b) push('park', { box: 'P' + b.n, pad: b.pad, s: r3(d.s), lat: r3(d.lat), guided: true }); } } else S.park = null;
        { const w = turnarounds.find(w => d.s >= w.s0 && d.s <= w.s1), k = w ? w.id : null; if (k !== S.wende) { push('wende', { pad: k || S.wende, phase: k ? 'ein' : 'aus', s: r3(d.s), v: r3(v), guided: true }); S.wende = k; } }
        const low = S.spaceLow, why = low ? exitGate(d, Pz) : 'Erst anhalten';
        if (S.scheme === 'wsa6') { S.act = null; S.actOk = false; S.space = low ? 'Aussteigen' : 'Hüpfen'; S.spaceOk = low ? !why : true;
          if (edge) { push('space', { action: low ? 'exit' : 'jump', v: r3(v), threshold: V_EXIT, mode: 'AUTO', ok: low ? !why : true }); if (low) tryExit(d, Pz, 'space'); } }
        else { if (edge) push('space', { action: 'jump', v: r3(v), mode: 'AUTO' }); S.act = 'Aussteigen'; S.actOk = !why; S.space = 'Hüpfen'; S.spaceOk = true; if (iEdge) tryExit(d, Pz, 'key'); }
        if (S.st.startsWith('AUTO') && d.fly) go('AUTO.TAKEOFF', 'fly'); break; }
      case 'AUTO.TAKEOFF': S.actOk = false; if (S.stT > T_TAKEOFF) go(d.fly ? 'AUTO.AIRBORNE' : 'AUTO.SEATED', 'Absprung'); if (iEdge) rejectAt('In der Luft', 'car'); break;
      case 'AUTO.AIRBORNE': S.actOk = false; if (!d.fly) go('AUTO.LANDING', 'Boden'); if (iEdge) rejectAt('In der Luft', 'car'); break;
      case 'AUTO.LANDING': S.actOk = false; if (S.stT > T_LANDING) go('AUTO.SEATED', 'Landung fertig'); break;
      case 'CUT.EXIT': S.actOk = false; if (cutStep(dt, Pz)) { S.cut = null; S.pose = null; S.cam = 'handoff'; S.camK = 0; push('cam', { to: 'walk', why: 'Übergabe Auto → Fuß', dur: T_CAM }); go('CAM.TO_WALK', 'gelandet'); play('idle', { fade: 0.15 }); } break;
      case 'CAM.TO_WALK': S.camK = Math.min(1, S.stT / T_CAM); walkStep(dt, K, ctrl, edge, iEdge, Pz); if (S.stT >= T_CAM) { S.cam = 'walk'; go('WALK.GROUND', 'Kamera übergeben'); } break;
      case 'WALK.GROUND': case 'WALK.JUMP': walkStep(dt, K, ctrl, edge, iEdge, Pz); break;
      case 'CUT.ENTER': S.actOk = false; if (cutStep(dt, Pz)) { S.cut = null; S.pose = null; S.cam = 'handoff'; S.camK = 0; push('cam', { to: 'chase', why: 'Übergabe Fuß → Auto', dur: T_CAM }); go('CAM.TO_AUTO', 'geplumpst'); play('drive', { fade: 0.1 }); } break;
      case 'CAM.TO_AUTO': S.camK = Math.min(1, S.stT / T_CAM); if (S.stT >= T_CAM) { S.cam = 'chase'; host.syncChase?.(); go('AUTO.SEATED', 'Kamera übergeben'); } break;
    }
    if (actor) { if (S.pose && S.cut) { actor.root.position.set(S.pose.p[0], S.pose.p[1], S.pose.p[2]); actor.root.rotation.set(0, S.pose.yaw, 0); } actor.mixer.update(dt); }
    const sl = S.mode === 'WALK' && !S.cut ? measureFeet(dt) : null;
    tr += dt; if (tr >= 0.1) { tr = 0; const g = S.mode === 'WALK' ? ground.info(walker.state.position.x, walker.state.position.z) : null;
      trace.push({ t: r3(S.t), mode: S.mode, st: S.st, actor: actor?.id || null, gait: S.mode === 'WALK' ? S.gait : null, clip: S.clip, rate: r3(S.rate),
        v: r3(S.mode === 'WALK' ? walker.state.speed : v), car: { s: r3(d.s), v: r3(v), fly: !!d.fly, lat: r3(d.lat), squash: r3(d.squash) },
        walker: S.mode === 'WALK' ? { x: r3(walker.state.position.x), y: r3(walker.state.position.y), z: r3(walker.state.position.z), onGround: walker.state.onGround, blocked: walker.state.blocked } : null,
        cut: S.cut ? { kind: S.cut.kind, t: r3(S.cut.t), y: r3(S.pose?.p[1]), sy: r3(S.pose?.s[1]), vis: !!S.pose?.vis } : null,
        surf: g ? g.id : null, walkable: g ? g.ok : null, contact: S.mode === 'WALK' ? { l: contacts.l.on, r: contacts.r.on } : null, slip: sl ? { l: r3(sl.l), r: r3(sl.r) } : null,
        keyI: S.actOk ? S.act : null, space: S.space, spaceOk: S.spaceOk, scheme: S.scheme, cam: S.cam, probe: S.probe?.id || null }); }
  };
  function inBoxXZ(b, x, z) { const Pp = b.corners; let c = false; for (let i = 0, j = Pp.length - 1; i < Pp.length; j = i++) { const [xi, , zi] = Pp[i], [xj, , zj] = Pp[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; }

  function walkStep(dt, K, ctrl, edge, iEdge, Pz) {
    const w = walker; let iy = (K.gas ? 1 : 0) - (K.brake ? 1 : 0), ix = (K.driftR ? 1 : 0) - (K.driftL ? 1 : 0); const turn = (K.left ? 1 : 0) - (K.right ? 1 : 0);
    const near = doorDist(Pz) <= R_ENTER, still = w.state.onGround && Math.abs(w.state.speed || 0) < V_EXIT && S.st === 'WALK.GROUND', six = S.scheme === 'wsa6';
    if (six) { S.act = null; S.actOk = false;   // Umkehrung von WSA #6: stehend (< 0,5 m/s) und ≤ 3,5 m an der Tür = Einsteigen, sonst Springen
      if (edge && still && near) { push('space', { action: 'enter', v: r3(w.state.speed), threshold: V_EXIT, dist: r3(doorDist(Pz)) }); S.space = 'Einsteigen'; tryEnter(Pz, 'space'); return; } }
    else { S.act = 'Einsteigen'; S.actOk = near && w.state.onGround;
      if (iEdge) { if (near) { tryEnter(Pz, 'key'); return; } rejectAt('Auto ' + doorDist(Pz).toFixed(0) + ' m entfernt', 'actor'); } }
    if (edge && w.state.onGround) { w.jump(); S.lastJump = S.t; push('jump', { s: r3(ground.st.s), surf: ground.info(w.state.position.x, w.state.position.z).id, clip: role('jump.start')?.clip || 'UNMAPPED' }); }
    let g = 'idle'; if (iy > 0) g = K.boost ? 'sprint' : ctrl ? 'walk' : 'run'; else if (iy < 0) g = 'backward'; else if (ix > 0) g = 'strafeR'; else if (ix < 0) g = 'strafeL';
    let R = role(ROLE_OF[g]);
    if (!R && g !== 'idle') { if (S.unmapped !== g) { S.unmapped = g; rejectAt((g === 'backward' ? 'Rückwärts' : 'Seitlich') + ' fehlt im ' + (actor?.rig || 'Rig') + '-Set', 'actor'); } iy = g === 'backward' ? 0 : iy; ix = /strafe/.test(g) ? 0 : ix; g = 'idle'; R = role('idle'); } else if (R) S.unmapped = null;
    if (R && R.world > 0) w.setParams({ speed: R.world, sprintMul: 1 });
    w.setInput(ix, iy); w.update(dt, { turn, sprint: false }, ground.heightAt);
    const p = w.state.position; ground.follow(p.x, p.z, p.y);
    if (actor) { actor.root.position.copy(p); actor.root.rotation.set(0, w.state.heading, 0); }
    S.airT = w.state.onGround ? 0 : (S.airT || 0) + dt;   // Bordsteinkante (−0,28 m) ist kein Sprung: erst nach 0,18 s ohne Boden
    const air = (S.t - S.lastJump < 0.12) || S.airT > 0.18 || (S.st === 'WALK.JUMP' && !w.state.onGround);
    if (air) { if (S.st !== 'WALK.JUMP') { go('WALK.JUMP', 'Absprung'); play('jump.start', { once: true, fade: fadeOf('any', 'jump.start') }); S.jt = 0; }
      S.jt += dt; if (S.gait === 'jump.start' && S.jt > (P['jump.start']?.duration || 0.6) * 0.8) play('jump.air', { fade: 0.1 }); }
    else if (S.st === 'WALK.JUMP') { if (S.gait !== 'jump.land') { play('jump.land', { once: true, fade: 0.05 }); push('land', { who: 'actor', surf: ground.info(p.x, p.z).id, impact: r3(w.state.impact) }); S.lt = 0; }
      S.lt += dt; if (S.lt > (P['jump.land']?.duration || 0.66) * 0.7 || (g !== 'idle' && S.lt > 0.25)) { go('WALK.GROUND', 'Landung fertig'); play(ROLE_OF[g], { fade: 0.15 }); } }
    else { const r = ROLE_OF[g]; if (S.gait !== r) play(r, { fade: fadeOf(S.gait, r), sync: syncOf(S.gait, r) }); }
    S.space = six && still && near ? 'Einsteigen' : 'Springen'; S.spaceOk = true; }

  /* ---------- Proben (20 s, geskriptete Tasten; Auto wird über den Host platziert) ---------- */
  const PROBES = {
    A: { label: 'Walk → Auto → Walk · sichere Leertaste', dur: 20, setup: () => host.placeCar?.(2440, 9, -3.6), script: [   // tap 'act' = Leertaste (wsa6) bzw. I (georgI)
      [0, { stop: 1 }], [1.6, { tap: 'act', car: {} }], [2.8, { keys: { gas: 1 } }], [5.5, { keys: { gas: 1, left: 1 } }], [6.6, { keys: { gas: 1 } }],
      [8.6, { keys: {} }], [9.0, { ui: 'AUTO' }], [10.8, { car: { gas: 1 } }], [11.4, { tap: 'act', car: { gas: 1 } }], [11.7, { tap: 'space', car: { gas: 1 } }], [11.9, { ui: 'WALK' }], [12.0, { car: {} }], [12.2, { stop: 1 }],
      [13.8, { tap: 'act', car: {} }], [15.2, { keys: {} }], [15.4, { keys: { gas: 1 } }], [17.0, { keys: { brake: 1 } }], [18.4, { keys: {} }]] },
    B: { label: 'Walk → Jump → Land · Sprint-Messung', dur: 20, setup: () => host.placeCar?.(2436, 0, 3.6), script: [
      [0, { ensure: 'WALK' }], [1.4, { keys: { gas: 1 } }], [2.6, { tap: 'space', keys: { gas: 1 } }], [4.2, { keys: { gas: 1, boost: 1 } }], [8.0, { tap: 'space', keys: { gas: 1, boost: 1 } }],
      [11.0, { keys: {} }], [11.6, { keys: { brake: 1 } }], [13.4, { keys: { driftR: 1 } }], [15.2, { keys: { gas: 1, ctrl: 1 } }], [18.6, { keys: {} }], [19.2, { tap: 'space', keys: {} }]] },
    C: { label: 'Auto-Sprung · Parkbox · Wendestelle', dur: 20, setup: () => host.placeCar?.(1395, 30, 0), script: [
      [0, { car: { gas: 1 } }], [4.2, { place: [2446, 8, 0], car: {} }], [4.3, { guide: { lat: -3.6, sStop: 2464.5 } }], [10.2, { tap: 'act', car: {} }], [11.6, { keys: {} }], [12.3, { tap: 'act', keys: {} }],
      [14.2, { place: [1098, 13, 0], car: { gas: 1 } }], [15.8, { car: {} }], [19.8, { car: {} }]] } };
  function probeStep(dt, d, Pz) { const pr = S.probe; pr.t += dt;
    while (pr.i < pr.script.length && pr.script[pr.i][0] <= pr.t) { const a = pr.script[pr.i++][1];
      if (a.place) { host.placeCar?.(...a.place); push('probe', { place: a.place }); }
      if (a.car) { pr.car = { ...a.car }; pr.guide = null; pr.stop = false; } if (a.keys) pr.keys = { ...a.keys }; if (a.stop) { pr.stop = true; pr.guide = null; }
      if (a.guide) pr.guide = a.guide; if (a.ui) request(a.ui, 'probe'); if (a.ensure === 'WALK' && S.mode === 'AUTO') { if (carSpeed(d) < V_EXIT) tryExit(d, Pz, 'probe'); }
      const tap = a.tap === 'act' ? (S.scheme === 'wsa6' ? 'space' : 'i') : a.tap;
      if (tap === 'i') interact();
      if (tap === 'space') { if (pr.keys) pr.keys.jump = 1; if (pr.car) pr.car.jump = 1; pr.tapT = 0.08; } }
    if (pr.tapT != null) { pr.tapT -= dt; if (pr.tapT <= 0) { if (pr.keys) pr.keys.jump = 0; if (pr.car) pr.car.jump = 0; pr.tapT = null; } }
    if (pr.stop && S.mode === 'AUTO') pr.car = { ...Z, brake: d.speed > 0.5 ? 1 : 0, gas: d.speed < -0.5 ? 1 : 0, jump: pr.car?.jump || 0 };   // bang-bang in das 0,5-Fenster (bei 20 fps überschießt Bremsen sonst in den Rückwärtsgang)
    if (pr.guide && S.mode === 'AUTO') { const G = pr.guide, e = G.lat - d.lat, rest = G.sStop - d.s;   // geführt: Spur halten + vor der Box bremsen
      const stopD = d.speed * d.speed / (2 * 28) + 0.3; pr.car = { left: e < -0.25 ? 1 : 0, right: e > 0.25 ? 1 : 0, gas: rest > stopD + 2 && d.speed < 6 ? 1 : 0, brake: rest < stopD && d.speed > 0.05 ? 1 : 0 }; }
    if (pr.t >= pr.dur) { push('probe', { end: pr.id }); S.probe = null; } }
  const runProbe = id => { const p = PROBES[id]; if (!p) return; p.setup?.(); S.probe = { id, t: 0, i: 0, script: p.script, dur: p.dur, keys: {}, car: {} }; push('probe', { start: id, label: p.label, actor: actor?.id, scheme: S.scheme }); };

  const request = (m, via = 'ui') => { const d = carRef, Pz = host.carPose?.();
    if (m === 'WALK' && S.mode === 'AUTO' && (S.st === 'AUTO.SEATED' || S.st === 'AUTO.PARKED')) tryExit(d, Pz, via);
    else if (m === 'AUTO' && (S.st === 'WALK.GROUND')) tryEnter(Pz, via);
    else if (m === 'FLIGHT') rejectAt('Steigen/Sinken fehlt · nur Sprung über Luftstücke', S.mode === 'WALK' ? 'actor' : 'car'); };

  const slipStats = () => Object.fromEntries(Object.entries(slip).map(([k, s]) => { const v = med(s.v), lat = s.lat.length ? s.lat.reduce((a, b) => a + b, 0) / s.lat.length : null, wv = med(s.world);
    return [k, { stanceFrames: s.v.length, plants: s.plant, slipMedian_ms: r3(v), slipLatMean_ms: r3(lat), worldSpeedMedian_ms: r3(wv), slipRatio: wv ? r3(v / wv) : null }]; }));
  const dump = (meta = {}) => ({ schema: SCHEMA, status: 'DESIGN PROOF · CANDIDATE', keys: S.scheme === 'wsa6' ? { scheme: 'wsa6', space: 'Auto: < 0,5 m/s Aussteigen · ≥ 0,5 m/s Hüpfen · Fuß: stehend ≤ 3,5 m an der Tür Einsteigen · sonst Springen', threshold_ms: V_EXIT, interact: null } : { scheme: 'georgI', interact: 'I', jump: 'Space' }, cut: CUT, ...meta, sprint: SPRINT_CAND, events: ev.slice(), trace: trace.slice(), slip: slipStats(), contacts: { l: contacts.l.n, r: contacts.r.n } });
  const clear = () => { ev.length = 0; trace.length = 0; for (const k in slip) delete slip[k]; contacts.l.n = contacts.r.n = 0; };
  return { S, carInput, update, request, interact, setActor, runProbe, PROBES, dump, clear, slipStats, role, setCtrl: v => { S.ctrl = !!v; }, setScheme: v => { S.scheme = SCHEMES[v] ? v : 'wsa6'; push('scheme', { scheme: S.scheme }); }, get actor() { return actor; }, get events() { return ev; }, get trace() { return trace; } };
}
