/* KFB Resident Atlas S9 · Disco-Werkstatt (Host-Seite)
   Das Disco-Ensemble (lib/disco-ensemble.js) als Resident im Atlas — gleiche Editor-Schicht,
   gleiches Studio, gleiche Puppe, gleiches IK. Diese Datei hält nur, was der Host besitzt:
   · den Song-Transport (eine Uhr, lib/song-transport.js),
   · die drei Prüfmodi Source Cast → Motion Audition → Ensemble,
   · die Außenfläche (gehört NICHT zum Modul) und das Host-Licht (Tag / Abend),
   · Platzierungskorrekturen im Ensemble (Studio-Sammelstelle `disco-01`),
   · Etiketten für Quelle/Revision/Rig im Source Cast. */
import * as THREE from 'three';
import { mountDiscoEnsemble } from './disco-ensemble.js';
import { createSongTransport, loadSongDef, loadPlaylist } from './song-transport.js';

const KEY = { place: 'kfb.disco-01.placement.v1', clock: 'kfb.disco-01.clock.v1', ui: 'kfb.disco-01.ui.v1' };
const D2R = Math.PI / 180, R2D = 180 / Math.PI;
const r4 = (x) => +x.toFixed(4), r2 = (x) => +x.toFixed(2);
const load = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export async function createDiscoWorkshop({ V, ST, env = null, defUrl = './data/resident-disco-01.json', onProgress = () => {} }) {
  const def = await (await fetch(defUrl, { cache: 'no-store' })).json();
  const ballDef = await (await fetch(def.discoBall.def, { cache: 'no-store' })).json();
  /* S40e · Rotation: acht gemessene Titel, EINE Uhr. Ohne Playlist bleibt es beim Song der Band-Datei. */
  const PL = def.clock.playlist ? await loadPlaylist(def.clock.playlist).catch(() => null) : null;
  const uiEarly = load(KEY.ui) || {};
  let trackIx = PL ? Math.max(0, PL.list.findIndex((t) => t.id === uiEarly.track)) : 0;
  const song = PL ? PL.list[trackIx] : await loadSongDef(def.clock.songFrom, def.clock.key);
  const T = createSongTransport(song, { storeKey: KEY.clock, onEnded: () => { if (PL && ui.rotate !== false) B.nextTrack(true); else if (ui.rotate === false && ui.loopOne) { T.restart(); T.play(); } } });

  const world = new THREE.Group();
  world.name = 'disco-world';
  /* ---- Host-Fläche: Außenplatz. Gehört nicht zum Modul, das Modul hat keine Grundplatte ---- */
  const hostG = new THREE.Group(); hostG.name = 'host-surfaces'; world.add(hostG);
  const grass = new THREE.Mesh(new THREE.CircleGeometry(40, 48), new THREE.MeshStandardMaterial({ color: 0x3d4a31, roughness: 1 }));
  grass.rotation.x = -Math.PI / 2; grass.position.y = -0.012; grass.receiveShadow = true; grass.name = 'Host · Wiese';
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(9.5, 48), new THREE.MeshStandardMaterial({ color: 0x77706a, roughness: 0.95 }));
  plaza.rotation.x = -Math.PI / 2; plaza.position.set(0, -0.007, 0.2); plaza.receiveShadow = true; plaza.name = 'Host · Platz';
  hostG.add(grass, plaza);
  /* Georg 2026-09-25: Residents und Events werden OHNE Grundplatte gezeigt — der Platz ist nur
     noch ein Schalter. Aus = die Kugel legt ihre Lichtflecken selbst auf Bodenhöhe. */

  const M = await mountDiscoEnsemble(def, { parent: world, renderer: V.renderer, ballDef, onProgress });
  const placed = load(KEY.place) || {};
  const ui = Object.assign({ mode: 'source', ballMode: def.discoBall.mode || 'DISCO', evening: null, hidden: [], tempo: def.tempo.default, audition: {}, float: true }, load(KEY.ui) || {});
  /* S40c: die Fläche ist die Atlas-Umgebung (lib/host-env.js), nicht mehr diese Werkstatt. Die
     eigenen Platz-/Wiesenflächen bleiben nur als Rückfall ohne Umgebung sichtbar. */
  const syncSurface = () => { const envOn = !!(env && env.on); hostG.visible = !envOn && !!ui.surface; M.ball.setFloorCatch(!envOn && !ui.surface); };
  syncSurface();
  M.ball.setFloat(ui.float);
  if (ui.collide != null) M.setCollide(ui.collide);
  M.setRings(!!ui.rings);
  M.tempo.policy = ui.tempo;
  for (const [pid, m] of Object.entries(ui.audition || {})) M.setAudition(pid, m);
  const saveUI = () => save(KEY.ui, ui);

  /* ---- Host-Licht: Tag / Abend. Mit Atlas-Umgebung stellt es deren Tageszeit (21:30 / 14:00);
     ohne Umgebung dimmt der Host SEIN Licht. Die Kugel färbt in keinem Fall etwas um. ---- */
  const lights = [];
  V.scene.traverse((o) => { if (o.isLight && !world.getObjectById(o.id)) lights.push(o); });
  let evening = false, bgKeep = null, envTimeKeep = null;
  function setEvening(on) {
    if (on === evening) return;
    evening = on;
    if (env && env.on) { env.setTime(on ? 21.5 : 14); B.emit(); return; }
    for (const L of lights) { if (L.userData.dayI == null) L.userData.dayI = L.intensity; L.intensity = L.userData.dayI * (on ? 0.32 : 1); }
    if (on) { bgKeep = V.scene.background; V.scene.background = new THREE.Color(0x141726); }
    else if (bgKeep) V.scene.background = bgKeep;
    B.emit();
  }

  function applyPlacement() {
    for (const [id, t] of Object.entries(placed)) {
      const n = M.nodes.get(id);
      if (!n) continue;
      n.position.fromArray(t.p); n.rotation.set(...t.r.map((x) => x * D2R)); n.scale.setScalar(t.s);
    }
  }
  /* Alternativen (Knight ↔ Monstrosity): im Ensemble steht genau eine Figur je Gruppe auf dem Platz */
  const ALT = def.alternates || {};
  const altChoice = (base) => (ui.alts && ui.alts[base]) || (ALT.default && ALT.default[base]) || base;
  const altHidden = (P) => { const base = P.def.altOf || (ALT[P.id] ? P.id : null); return !!base && ui.mode === 'ensemble' && altChoice(base) !== P.id; };
  function syncVis() { for (const P of Object.values(M.perf)) P.group.visible = M.layers.actor && !ui.hidden.includes(P.id) && !altHidden(P); }
  function setMode(m) {
    ui.mode = m; saveUI();
    M.layout(m === 'ensemble' ? 'ensemble' : 'row');
    if (m === 'ensemble') applyPlacement();
    M.ball.setMode(m === 'source' ? 'OFF' : ui.ballMode);
    setEvening(ui.evening != null && m === 'ensemble' ? ui.evening : m === 'ensemble');
    syncVis();
    M.ground = null;
    M.crowd.reset();
    B.post(0);
    B.emit();
  }

  const listeners = new Set();
  const B = {
    def, M, T, world, ballDef,
    emit() { listeners.forEach((f) => f()); },
    onChange(f) { listeners.add(f); },
    get mode() { return ui.mode; },
    get playing() { return T.playing; },
    get evening() { return evening; },
    setMode,
    get tracks() { return PL ? PL.list : [song]; },
    get trackIx() { return trackIx; },
    get track() { return T.song; },
    get rotate() { return ui.rotate !== false; },
    setRotate(on) { ui.rotate = !!on; saveUI(); B.emit(); },
    setTrack(i, play = T.playing) {
      if (!PL) return;
      trackIx = ((i % PL.list.length) + PL.list.length) % PL.list.length;
      ui.track = PL.list[trackIx].id; saveUI();
      T.load(PL.list[trackIx], play);
      M.crowd.reset(); M.lastHit = null;
      B.post(0); B.emit();
    },
    nextTrack(play = T.playing) { B.setTrack(trackIx + 1, play); },
    prevTrack(play = T.playing) { B.setTrack(trackIx - 1, play); },    setEvening(on) { ui.evening = on; saveUI(); setEvening(on); },
    get surface() { return !!ui.surface; },
    setSurface(on) { ui.surface = !!on; saveUI(); syncSurface(); B.emit(); },
    syncEnv() { syncSurface(); B.emit(); },
    get float() { return !!ui.float; },
    setFloat(on) { ui.float = !!on; saveUI(); M.ball.setFloat(on); B.emit(); },
    play() { T.play(); }, pause() { T.pause(); }, toggle() { T.toggle(); },
    restart() { T.restart(); }, seekFrac(k) { T.seekFrac(k); },
    seekBar(bar) { const pb = M.phraseBeats, now = T.beatPos(); const cycle = Math.floor(Math.max(0, now) / pb); T.seekBeat(cycle * pb + (bar - 1) * 4); },
    setAudition(pid, m) { M.setAudition(pid, m); ui.audition[pid] = m; saveUI(); B.post(0); B.emit(); },
    setTempo(p) { M.tempo.policy = p; ui.tempo = p; saveUI(); B.post(0); B.emit(); },
    setVisible(pid, on) { const P = M.perf[pid]; if (!P) return; ui.hidden = ui.hidden.filter((x) => x !== pid).concat(on ? [] : [pid]); saveUI(); syncVis(); B.emit(); },
    alternates: ALT,
    altChoice,
    setAlt(base, pid) { ui.alts = Object.assign({}, ui.alts, { [base]: pid }); saveUI(); syncVis(); M.crowd.reset(); B.post(0); B.emit(); },
    ball: {
      setMode(m) { ui.ballMode = m; saveUI(); if (ui.mode !== 'source') M.ball.setMode(m); B.emit(); },
      setSpin(v) { M.ball.setSpin(v); B.emit(); },
      setIntensity(v) { M.ball.setIntensity(v); B.emit(); },
      impulse() { M.ball.impulse(1); },
      reset() { M.ball.reset(); ui.ballMode = M.ball.state().mode; saveUI(); if (ui.mode === 'source') M.ball.setMode('OFF'); B.emit(); }
    },
    performerOf: (o) => M.performerOf(o),
    measureGround() { M.ground = M.groundReport(B.clockState()); B.emit(); return M.ground; },
    clockState() { return { time: T.songTime(), beatPos: T.beatPos(), spb: T.secPerBeat(), level: T.level(), bass: T.bass(), camera: V.camera, playing: T.playing }; },
    post(dt) { T.tick(dt); syncSurface(); M.update({ ...B.clockState(), dt }, ui.mode); },
    get collide() { return M.collideState(); },
    setCollide(on) { ui.collide = !!on; saveUI(); M.setCollide(on); B.emit(); },
    setRings(on) { ui.rings = !!on; saveUI(); M.setRings(on); B.emit(); },
    /* Studio: Platzierung im Ensemble zählt, in der Reihe (Source/Audition) nicht */
    recordNode(obj) {
      const e = obj.userData.entry;
      if (!e) return false;
      if (M.layoutKind !== 'ensemble') return false;
      placed[e.id] = { p: obj.position.toArray().map(r4), r: obj.rotation.toArray().slice(0, 3).map((x) => r2(x * R2D)), s: r4(obj.scale.x) };
      save(KEY.place, placed);
      ST.residentId = 'disco-01';
      ST.recordNode(e.id, obj);
      B.emit();
      return true;
    },
    resetPlacement(id) { if (id) delete placed[id]; else for (const k of Object.keys(placed)) delete placed[k]; save(KEY.place, placed); if (ui.mode === 'ensemble') setMode('ensemble'); },
    setLayers({ actor = true, prop = true }) {
      M.layers.actor = actor; M.layers.prop = prop;
      syncVis();
      for (const [id, p] of Object.entries(M.props)) p.obj.visible = prop && !(ui.mode !== 'ensemble' && id === 'speaker.b');
    },
    /* Gerahmt wird auf Figuren + Requisiten + Kugelkörper, nicht auf M.content: die Strahlkegel
       der Kugel sind 7,5 lang und würden jede Box3 aufblähen. */
    view(name, pid) {
      if (name === 'focus' && pid && M.perf[pid]) { V.frame(M.perf[pid].group, [0.35, 0.3, 1], 1.35); return; }
      const b = new THREE.Box3();
      for (const P of Object.values(M.perf)) if (P.group.visible) b.expandByObject(P.group);
      for (const p of Object.values(M.props)) if (p.obj.visible) b.expandByObject(p.obj);
      const br = M.ball.root; br.updateMatrixWorld(true);
      b.expandByPoint(br.localToWorld(new THREE.Vector3(0, -M.ball.params.radius, 0)));
      b.expandByPoint(br.localToWorld(new THREE.Vector3(0, M.ball.params.radius + 0.4, 0)));
      const sz = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
      const proxy = new THREE.Mesh(new THREE.BoxGeometry(Math.max(sz.x, 0.1), Math.max(sz.y, 0.1), Math.max(sz.z, 0.1)));
      proxy.position.copy(c); proxy.updateMatrixWorld(true);
      if (name === 'top') V.frame(proxy, [0, 1, 0.02], 1.05);
      else if (ui.mode === 'ensemble') V.frame(proxy, name === 'front' ? [0, 0.22, 1] : [0.42, 0.3, 1], 1.0);
      else V.frame(proxy, [0.03, 0.12, 1], 1.1);
      proxy.geometry.dispose();
    },
    tags() {
      if (ui.mode === 'ensemble') return [];
      const out = [];
      const b = new THREE.Box3(), top = new THREE.Vector3();
      for (const P of Object.values(M.perf)) {
        if (!P.group.visible) continue;
        b.setFromObject(P.group); b.getCenter(top); top.y = b.max.y + 0.15;
        const d = P.def;
        out.push({ id: P.id, at: top.clone(), l1: `${d.slot} · ${d.label}`, l2: `${P.lane.replace('Rig_', '')} · @${d.asset.commit.slice(0, 8)}`, l3: ui.mode === 'audition' ? (P.audition || '').replace(/^kfb_/, '') : '' });
      }
      for (const id of ['radio', 'speaker.a', 'drum']) {
        const p = M.props[id]; if (!p || !p.obj.visible) continue;
        b.setFromObject(p.obj); b.getCenter(top); top.y = b.max.y + 0.15;
        out.push({ id, at: top.clone(), l1: p.def.label, l2: `@${p.def.asset.commit.slice(0, 8)} · s ${p.scale}`, l3: '' });
      }
      const br = M.ball.root; br.updateMatrixWorld(true);
      out.push({ id: 'ball', at: br.localToWorld(new THREE.Vector3(0, M.ball.params.radius + M.ball.params.hang + 0.2, 0)), l1: 'DISCO-BALL-CORE-01', l2: 'generiert · ' + M.ball.state().mode, l3: '' });
      return out;
    },
    snapshot() {
      const now = T.now();
      const spb = T.secPerBeat();
      return {
        mode: ui.mode, evening, env: env ? env.state() : null, surface: !!ui.surface, float: !!ui.float, tempo: M.tempo.policy, phrase: M.phrase, collide: M.collideState(),
        song: { state: T.state, blobOk: T.blobOk, playing: T.playing, bpm: now.bpm, phase: now.phase, shift: now.shift, mapped: now.mapped, bar: now.bar, beat: now.beat, time: now.time, dur: now.dur, from: T.song.from, id: T.song.id, title: T.song.title || 'Rubbish Groove', status: T.song.status || null, measuredBpm: T.song.bpm, promptBpm: T.song.promptBpm ?? null, gitBlob: T.song.gitBlob, ix: trackIx, of: PL ? PL.list.length : 1, rotate: ui.rotate !== false },
        catalog: M.catalogNote,
        perf: Object.values(M.perf).map((P) => {
          const d = P.def;
          const pairs = (P.lane === 'Rig_Legacy' ? ['bounce'] : d.pairing).map((m) => {
            if (m === 'bounce') return { motion: m, bind: 'prozedural · 4 Legacy-Bones', dur: '8 Schläge', loop: true, root: 'in-place (Hüpfen)', rate: '—' };
            const clip = P.clips.get(m), R = M.rateOf(P, m, spb), bd = M.bindOf(P, m), wm = M.wanderMeters(P, m);
            return { motion: m, bind: `${bd.bound}/${bd.of}`, dur: clip ? +clip.duration.toFixed(2) : null, loop: M.isLoop(m), root: M.travelOf(m) || '—', wander: wm, rate: (R.locked ? `×${R.r.toFixed(3)} → ${R.bars} Takte` : `nativ (${R.exact ?? R.bars} Takte)`) + (wm ? ` · Wanderung ${wm} m raus` : '') };
          });
          const ab = P.audition === 'bounce' ? null : M.bindOf(P, P.audition);
          return { id: P.id, slot: d.slot, label: d.label, role: d.role, lane: P.lane, path: d.asset.path, commit: d.asset.commit, source: d.asset.source, altOf: d.altOf || (ALT[P.id] ? P.id : null), altActive: !altHidden(P) || ui.mode !== 'ensemble', roam: P.roamAt || null,
            legacy: P.legacyInfo ? { placed: P.legacyInfo.placed.length, missing: P.legacyInfo.missing, extras: P.legacyInfo.extraPlaced, open: P.legacyInfo.extraOffen } : null,
            graft: P.graft ? { notes: (P.graftReport && P.graftReport.notes) || [], nose: P.def.graft && 'carl-original', held: P.held, height: P.heightNote, err: P.graftErr || null, talking: !!P.talking } : null,
            visible: P.group.visible, audition: P.audition, auditionBind: ab ? `${ab.bound}/${ab.of}` : 'prozedural', auditionTravel: P.audition && P.audition !== 'bounce' ? M.travelOf(P.audition) : null,
            pairs, now: P.now, cue: P.cue ? { bar: P.cue.bar, motion: P.cue.motion, hit: P.cue.hit } : null, ground: M.ground && M.ground[P.id] };
        }),
        props: Object.entries(M.props).map(([id, p]) => ({ id, label: p.def.label, path: p.def.asset.path, commit: p.def.asset.commit, scale: p.scale, size: p.size, sourceSize: p.sourceSize, note: p.def.scaleNote })),
        ball: M.ball.state(),
        placed: Object.keys(placed)
      };
    },
    moduleDoc() {
      const d = JSON.parse(JSON.stringify(def));
      const s = B.snapshot();
      d.measured = { exportedAt: new Date().toISOString(), catalog: s.catalog, pairings: Object.fromEntries(s.perf.map((p) => [p.id, p.pairs])), ground: M.ground || 'nicht gemessen — „Boden messen" im Panel', props: s.props, ball: s.ball,
        legacy: Object.fromEntries(s.perf.filter((p) => p.legacy).map((p) => [p.id, p.legacy])) };
      d.placementPatch = { note: 'Studio-Korrekturen aus dem Ensemble, NICHT in die Rezeptfelder eingepflegt', nodes: JSON.parse(JSON.stringify(placed)) };
      d.auditionChoices = JSON.parse(JSON.stringify(ui.audition || {}));
      d.tempo.active = M.tempo.policy;
      return d;
    },
    detach() { T.pause(); setEvening(false); if (env && envTimeKeep != null) env.setTime(envTimeKeep); if (world.parent) world.parent.remove(world); },
    attach() { V.scene.add(world); envTimeKeep = env ? env.state().time : null; evening = false; setMode(ui.mode); }
  };
  T.onChange(() => B.emit());
  return B;
}
