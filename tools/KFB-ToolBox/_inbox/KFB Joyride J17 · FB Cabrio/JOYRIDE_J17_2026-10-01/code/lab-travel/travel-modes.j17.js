/* KFB J17 · travel-modes.j17.js · wörtlich j14 + FrizzleBob v5b als Standardfigur (Maßstab A, Ohren + Gesicht aus den gepinnten ToolBox-Ownern)
 * + Seat-Schicht cabrio-seat.j17 (Cabrio: FB sichtbar am Steuer, Hop statt Schnitt; andere Autos behalten den J14-Schnitt) über host.hop und api.setTravel({ late }). */
/* KFB J14 · travel-modes.j14.js · Browser-Schicht über joyride-drive.j09 (Einhängepunkte) + travel-core.j14 (Zustände).
 * Lädt ActionFigure + KayKit 1.1 Rig_Medium (gepinnt), misst das Profil am Rig (locomotion-profiles.v1), löst anim-map.v1 auf,
 * zeichnet Parkboxen/Wendestelle aus den Core-Pads, führt Fuß-Kamera + Kamera-Übergabe, Schnitt-Squash und Ablehnungs-Anker.
 * Schreibt keine Auto-Bewegung (k2b/k2) und keine Ground-Position (walk-controller.js). DESIGN PROOF · CANDIDATE. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as LP from './pinned/locomotion-profiles.v1.js';
import * as AM from './pinned/anim-map.v1.js';
import { createWalkController } from './pinned/walk-controller.js';
import * as WK from './walkability.j14.js?r=2';
import * as TC from './travel-core.j17.js?r=1';
import { loadRig, buildProfiles, WALK_PARAMS, ACTORS } from './headless-probe.j17.js?r=1';
import * as CS from './cabrio-seat.j17.js?r=7';

export const SOURCES = {
  walk: 'lab-travel/pinned/walk-controller.js · kayfabizarro@main travel/KFB Travel Combat v25/terrain-v25/walk-controller.js · Blob b49dbb8dde4f · Schnappschuss 2026-09-30T02:35Z',
  profiles: 'lab-travel/pinned/locomotion-profiles.v1.js · Blob 3db9fbd482e6 · PR #294 chatgpt-web/kfb-ground-locomotion-profile-consumer-01-2026-09-29',
  animMap: 'lab-travel/pinned/anim-map.v1.js · Blob 7120f80e25e8 · gleicher Branch',
  clips: 'KayKit Character Animations 1.1 · Rig_Medium General/MovementBasic/MovementAdvanced/Simulation @b97b5ac5',
  seat: 'lab-travel/cabrio-seat.j17.js · VEHICLE_SEAT_CONTRACT v0.1 (FB-CAR-01, georg-doc-patch-3 @93abbf22) · Cabrio KFB_CVP1_cabrio.glb r2 @93abbf22 · Fahrclip kfb_interaction_driving_a (ML v6 KFB_Motion_interaction_i06.glb @93abbf22)',
  face: 'lab-travel/pinned/face-mount.v1.js + clay-lids.v1.js (ToolBox Production-06 r2 @main) · Gesichts-Owner kfb-rigs-embed-v3 @8922d4b1 (wie ToolBox)',
  ears: 'lab-travel/pinned/ear-dangle.v1.js + ear-base.v1.js (ToolBox Production-06 r2 @main) · fb-default.ear-rig.json @19088b14 · Preset B · Floppy',
  actor: 'FrizzleBob v5b · FB_TEMPLATE_LOOK_v5b.glb @93abbf22 (Rig_Medium + Ohren, Maßstab A 0,616381042 m/Einheit) · KayKit Mystery S6 @43d39ef9 · ActionFigure.glb (Rig_Medium, 1,85 m) · BlackKnight.glb (Rig_Large, 2,08 m, gleicher Maßstabsfaktor)'
};

export async function mountTravel(api, onNote = () => {}, opts = {}) {
  const { T } = api, scene = T.scene, camera = api.camera, td = T.td;
  onNote('Reisemodi: Begehbarkeit wird abgeleitet …');
  const W = WK.deriveWalkability(td), ground = WK.makeGround(td, W), boxes = WK.parkBoxes(td), J = td._joints || td.joints;
  const wj = J.findIndex(j => j.piece === 'plaza_hairpin'), turnarounds = wj >= 0 ? [{ id: 'wende_j14', s0: J[wj].s, s1: J[wj + 1].s }] : [];
  onNote('Reisemodi: ActionFigure + KayKit-Clips …');
  const RIGS = {}, getRig = async id => { if (RIGS[id]) return RIGS[id]; const r = await loadRig(THREE, GLTFLoader, undefined, id); r.fig.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } });
    r.profiles = buildProfiles(THREE, LP, r); r.animMap = AM.mapJSON(r.rig, AM.resolve(r.inv), {}); r.root.visible = false;
    if (id === 'frizzlebob') { onNote('FrizzleBob: Ohren + Gesicht (ToolBox-Owner) …'); try { await CS.dressFB(r); } catch (e) { r.dress = { errors: ['dressFB: ' + e.message] }; console.error(e); } }
    return (RIGS[id] = r); };
  let rig = await getRig(ACTORS[opts.actor] ? opts.actor : 'frizzlebob'); let profiles = rig.profiles, animMap = rig.animMap; scene.add(rig.root);
  const carBox = new THREE.Box3().setFromObject(api.carG), carH = +(carBox.max.y - carBox.min.y).toFixed(3);
  const walker = createWalkController({ THREE, params: { ...WALK_PARAMS } }); walker.setCamDist(6.5);
  let Pz = null;
  const host = { halfW: () => api.halfW, carH: () => carH, puff: (p, n, sz) => { for (let i = 0; i < n; i++) puff(new THREE.Vector3(p[0] + (Math.random() - 0.5) * 1.2, p[1] + Math.random() * 0.3, p[2] + (Math.random() - 0.5) * 1.2), sz); } , placeCar: (s, v, lat) => api.placeCar(s, v, lat), carPose: () => Pz, squash: k => { api.drv.squashV += k; }, syncChase: () => api.syncChase() };
  const actorOf = r => ({ id: r.id, rig: r.rig, root: r.root, mixer: r.mixer, clips: r.clipMap, feet: r.feet });
  const core = TC.createTravelCore({ THREE, td, W, ground, boxes, turnarounds, walker, actor: actorOf(rig), profiles, animMap, host, scheme: opts.scheme || 'wsa6' });
  const seat = await CS.mountSeat({ api, core, walker, ground, camera, getRig: () => rig, onNote }); host.hop = seat.hop;

  /* Core-Pads sichtbar: Parkboxen (Creme), Pad-Umriss (Fahrschul-Grün), Wendestelle (Blau), Schilder als Sprites */
  const padG = new THREE.Group(); padG.name = 'j14-pads'; scene.add(padG);
  const strip = (a, b, w, col, y = 0.05) => { const dx = b[0] - a[0], dz = b[2] - a[2], L = Math.hypot(dx, dz), g = new THREE.BoxGeometry(w, 0.04, L), m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: col, roughness: 0.85 }));
    m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + y, (a[2] + b[2]) / 2); m.rotation.y = Math.atan2(dx, dz); m.receiveShadow = true; padG.add(m); };
  const sprite = (text, pos, col = '#FBF3E4', bg = 'rgba(33,25,51,.86)') => { const c = document.createElement('canvas'); c.width = 512; c.height = 128; const x = c.getContext('2d');
    x.fillStyle = bg; x.beginPath(); x.roundRect(6, 10, 500, 108, 40); x.fill(); x.fillStyle = col; x.font = '64px Bangers, "Irish Grover", sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 256, 68);
    const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, depthTest: true })); s.scale.set(8, 2, 1); s.position.set(pos[0], pos[1], pos[2]); padG.add(s); return s; };
  for (const p of td.pads || []) { const col = p.kind === 'turnaround' ? '#58A6FF' : '#3CC39B', O = p.outline;
    for (let i = 0; i < O.length; i += 2) strip(O[i], O[(i + 1) % O.length], 0.22, col, 0.035);
    p.stations.forEach(st => { if (st.type === 'parking_box') { const C = st.corners; for (let i = 0; i < 4; i++) strip(C[i], C[(i + 1) % 4], 0.18, '#FBF3E4'); }
      if (st.type === 'brake_line') strip(st.from, st.to, 0.5, '#FFA97A');
      if (st.type === 'sign' && st.at) sprite(st.text, [st.at[0], st.at[1] + 7, st.at[2]], p.kind === 'turnaround' ? '#B9DCFF' : '#C9F2E4').scale.set(6, 1.5, 1); }); }
  boxes.forEach(b => { const c = b.corners.reduce((a, q) => [a[0] + q[0] / 4, a[1] + q[1] / 4, a[2] + q[2] / 4], [0, 0, 0]); sprite('P' + b.n, [c[0], c[1] + 2.2, c[2]], '#3A2416', 'rgba(251,243,228,.92)').scale.set(3, 0.75, 1); });

  /* Schnitt, Squash, Puff */
  const v3 = new THREE.Vector3(), puff = (pos, sz = 0.3) => { try { const mix = T.AT.vfxBiome(api.drv.s), bio = mix.w > 0.5 ? mix.b : mix.a; T.VFX.emit('landing', bio, { pos, dir: new THREE.Vector3(0, 1, 0), groundY: pos.y - 0.2, energy: 0.45, sizeK: sz, count: 1 }); } catch (e) { } };
  const visuals = () => { const S = core.S, R = rig.root;
    if (seat.owns()) { R.visible = true; R.scale.set(1, 1, 1); return; }   // J17: FB im Cabrio bleibt sichtbar (Seat-Schicht setzt ihn)
    if (S.cut && S.pose) { R.visible = S.pose.vis; R.scale.set(S.pose.s[0], S.pose.s[1], S.pose.s[2]); }
    else if (S.mode === 'WALK') { R.visible = true; R.scale.set(1, 1, 1); }
    else R.visible = false; };

  /* Kamera: zu Fuß = walk-controller-Orbitzustand; Übergabe = eigener Zustand (CAM.TO_WALK / CAM.TO_AUTO, 0,7 s) */
  const camFrom = { pos: new THREE.Vector3(), tgt: new THREE.Vector3(), set: false }, look = new THREE.Vector3(), want = new THREE.Vector3(), wantT = new THREE.Vector3(), camCur = new THREE.Vector3(), tgtCur = new THREE.Vector3();
  const walkPose = () => { const s = walker.state, c = s.cam, p = s.position, a = s.heading + Math.PI + c.yawOff, d = Math.max(2.5, c.dist);
    wantT.set(p.x, p.y + 1.35, p.z); want.set(p.x + Math.sin(a) * Math.cos(c.pitch) * d, p.y + 1.35 + Math.sin(c.pitch) * d, p.z + Math.cos(a) * Math.cos(c.pitch) * d);
    const gy = ground.info(want.x, want.z); if (gy.ok && want.y < gy.y + 0.6) want.y = gy.y + 0.6; };
  const chasePose = () => { const P = Pz; if (!P) return; want.set(P.P[0] - P.F[0] * 9, P.P[1] + 3.5, P.P[2] - P.F[2] * 9); wantT.set(P.P[0] + P.F[0] * 11, P.P[1] + 1.2, P.P[2] + P.F[2] * 11); };
  const sst = x => x * x * (3 - 2 * x);
  let camWas = '';
  const camStep = dt => { const S = core.S, st = S.st;
    const mine = st === 'CAM.TO_WALK' || st.startsWith('WALK') || st === 'CUT.ENTER' || st === 'CAM.TO_AUTO';
    if (!mine) { camWas = ''; camFrom.set = false; return false; }
    if (camWas !== st && (st === 'CAM.TO_WALK' || st === 'CAM.TO_AUTO')) { camFrom.pos.copy(camera.position); camera.getWorldDirection(look); camFrom.tgt.copy(camera.position).addScaledVector(look, 10); camFrom.set = true; }
    camWas = st;
    if (st === 'CAM.TO_AUTO') chasePose(); else if (st === 'CUT.ENTER' && S.cut?.hop) { walkPose(); const w0 = want.clone(); chasePose(); want.lerpVectors(w0, want, sst(Math.min(1, S.cut.t / 2.4)) * 0.6); const hwp = seat.hipsWorld(); if (hwp) wantT.copy(hwp).y += 0.4; }
    else if (st === 'CUT.ENTER' && S.pose) { const c = S.cut, p = S.pose.p, prog = Math.min(1, c.t / (0.16 + c.fly + 0.12));   // Schnitt-Kamera: folgt dem Sprung aufs Dach, schwenkt Richtung Verfolger
      walkPose(); const w0 = want.clone(); chasePose(); want.lerpVectors(w0, want, sst(prog) * 0.6); wantT.set(p[0], p[1] + 0.9, p[2]); }
    else walkPose();
    if (st === 'CAM.TO_WALK' || st === 'CAM.TO_AUTO') { const k = sst(S.camK); camCur.lerpVectors(camFrom.pos, want, k); tgtCur.lerpVectors(camFrom.tgt, wantT, k); }
    else { camCur.lerp(want, 1 - Math.exp(-dt * 8)); tgtCur.lerp(wantT, 1 - Math.exp(-dt * 12)); }
    camera.up.set(0, 1, 0); camera.position.copy(camCur); camera.lookAt(tgtCur);
    const fov = 52; if (Math.abs(camera.fov - fov) > 0.05) { camera.fov += (fov - camera.fov) * Math.min(1, dt * 4); camera.updateProjectionMatrix(); }
    return true; };

  const onK = e => { if (e.code === 'ControlLeft' || e.code === 'ControlRight') core.setCtrl(e.type === 'keydown');
    if (e.code === 'KeyI' && core.S.scheme === 'georgI' && e.type === 'keydown' && !e.repeat) { const ae = document.activeElement; if (ae && /^(INPUT|TEXTAREA)$/.test(ae.tagName) && ae.type === 'text') return; core.interact(); } };   // I = Ein-/Aussteigen (Leertaste bleibt Springen)
  window.addEventListener('keydown', onK); window.addEventListener('keyup', onK); window.addEventListener('blur', () => core.setCtrl(false));
  api.setTravel({ input: (K, drv) => core.carInput(K, drv), post: (dt, t, drv, P) => { Pz = P; core.update(dt, drv, P); visuals(); }, late: (dt, t, drv, P) => seat.update(dt, drv, P), camera: camStep,
    walking: () => core.S.mode === 'WALK', orbit: (dx, dy) => walker.orbit(dx, dy), zoom: z => walker.zoom(z * 0.8), recenter: () => { walker.state.cam.yawOff = 0; },
    focus: () => core.S.mode === 'WALK' ? rig.root.position : null, blockReset: () => core.S.mode !== 'AUTO' || !core.S.st.startsWith('AUTO') });

  const setCharacter = async id => { if (!ACTORS[id] || id === rig.id) return rig.id; onNote('Figur lädt …'); const r = await getRig(id), vis = rig.root.visible;
    r.root.position.copy(rig.root.position); r.root.rotation.copy(rig.root.rotation); scene.remove(rig.root); scene.add(r.root); r.root.visible = vis; rig = r; profiles = r.profiles; animMap = r.animMap;
    core.setActor(actorOf(r), r.profiles, r.animMap); out.rig = r; out.profiles = r.profiles; out.animMap = r.animMap; return id; };
  const project = where => { const p = where === 'actor' && rig.root.visible ? rig.root.position : api.carG.position; v3.set(p.x, p.y + (where === 'actor' ? 2.3 : 2.4), p.z).project(camera);
    const c = T.renderer.domElement.getBoundingClientRect(); return { x: (v3.x * 0.5 + 0.5) * c.width, y: (-v3.y * 0.5 + 0.5) * c.height, vis: v3.z < 1 }; };
  const dump = () => core.dump({ probeHost: 'browser', driver: api.driveId, stream: td.id, fingerprint: td.fingerprint, sources: SOURCES, actor: rig.id, rigCompat: rig.compat, carH,
    walkability: { status: W.status, tally: W.tally, walkableShare: W.walkableShare, pieces: W.pieces }, seat: seat.metrics() });
  const out = { seat, core, W, rig, profiles, animMap, walker, ground, project, dump, SOURCES, ACTORS, carH, setCharacter, request: m => core.request(m), setScheme: v => core.setScheme(v), interact: () => core.interact(), runProbe: id => core.runProbe(id) };
  return out;
}
