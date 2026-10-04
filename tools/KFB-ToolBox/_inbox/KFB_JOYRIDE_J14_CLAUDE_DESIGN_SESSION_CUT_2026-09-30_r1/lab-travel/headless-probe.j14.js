/* KFB J14 · headless-probe.j14.js · dieselben Dateien wie die Spielseite, ohne Grafik (für run_script/Node-artige Sandbox).
 * Lädt ActionFigure + KayKit 1.1 Rig_Medium, baut das Profil über locomotion-profiles.v1 am echten Rig, löst anim-map.v1 auf,
 * fährt k2b auf dem J14-Stream und lässt die Travel-Core-Proben laufen. Gibt JSON zurück; schreibt nichts. */
export const PIN = { fig: '43d39ef99a9e33c5ca2f6d490c4a94e35f77aa28', clips: 'b97b5ac55df2724fae623992433685583eece51e' };
/* Figuren: gleiche 23 Knochennamen; Rig nach Ruhelage (Hüfte 0,406 = Medium, 1,041 = Large). Medium: Faktor aus der ActionFigure-Referenz (1,85 m).
   Large ist nativ 4,69 m hoch (2 × Medium) — mit demselben Faktor 3,74 m, zu groß fürs Auto. Design-Wahl J14: Black Knight auf 2,30 m (fitH). */
export const ACTORS = {
  actionfigure: { label: 'ActionFigure', rig: 'Rig_Medium', path: 'media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb' },
  blackknight: { label: 'Black Knight', rig: 'Rig_Large', fitH: 2.3, path: 'media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/characters/BlackKnight.glb' } };
export const FIG_PATH = ACTORS.actionfigure.path, REF_NATIVE_H = 2.3223;
export const clipBase = rig => 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/' + rig + '/' + rig + '_';
export const CLIP_BASE = clipBase('Rig_Medium');
export const SETS = ['General', 'MovementBasic', 'MovementAdvanced', 'Simulation'];
export const WALK_PARAMS = { stepMax: 0.45, autoJumpMax: 0.6, hopClear: 0.35, radius: 0.35, gravity: 19, probeMax: 1.5, probeStep: 0.2, bounceMin: 99 };
export const FIG_H = 1.85;

export async function loadRig(THREE, GLTFLoader, cdn = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@', actorId = 'actionfigure') {
  const AC = ACTORS[actorId] || ACTORS.actionfigure;
  const L = new GLTFLoader(), parse = buf => new Promise((res, rej) => L.parse(buf, '', res, rej)), get = u => fetch(u).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + u); return r.arrayBuffer(); });
  const g = await parse(await get(cdn + PIN.fig + '/' + encodeURI(AC.path))), fig = g.scene;
  const clips = [], inv = [];
  for (const s of SETS) { const a = await parse(await get(cdn + PIN.clips + '/' + clipBase(AC.rig) + s + '.glb')); inv.push({ set: s, clips: a.animations.map(c => ({ name: c.name, duration: +c.duration.toFixed(4) })) }); a.animations.forEach(c => clips.push({ name: c.name, pack: s, clip: c })); }
  const root = new THREE.Group(); root.name = 'j14-actor'; root.add(fig); fig.updateMatrixWorld(true);
  const bb = new THREE.Box3().setFromObject(fig), k = AC.fitH ? AC.fitH / (bb.max.y - bb.min.y) : FIG_H / REF_NATIVE_H; fig.scale.setScalar(k); fig.position.y = -bb.min.y * k; root.updateMatrixWorld(true);
  const bone = n => { let b = null; fig.traverse(o => { if (o.isBone && o.name === n) b = o; }); return b; };
  const figBones = []; fig.traverse(o => { if (o.isBone) figBones.push(o.name); });
  const trackBones = new Set(); clips.forEach(c => c.clip.tracks.forEach(t => trackBones.add(t.name.split('.')[0])));
  const compat = { actor: AC.label, rig: AC.rig, heightM: +((bb.max.y - bb.min.y) * k).toFixed(3), actorBones: figBones.length, clipTrackBones: trackBones.size, missingInActor: [...trackBones].filter(b => !figBones.includes(b)), extraInActor: figBones.filter(b => !trackBones.has(b)), bones: figBones,
    nativeHeight: +(bb.max.y - bb.min.y).toFixed(4), scale: +k.toFixed(5), targetHeight: FIG_H, verdict: null };
  compat.verdict = compat.missingInActor.length ? 'INCOMPATIBLE' : 'COMPATIBLE · alle Clip-Spuren treffen einen Knochen der ActionFigure (Namen nach three.js-Bereinigung)';
  const mixer = new THREE.AnimationMixer(fig);
  return { id: actorId, label: AC.label, rig: AC.rig, root, fig, mixer, clips, inv, k, compat, feet: { l: bone('footl'), r: bone('footr') }, hips: bone('hips'), clipMap: new Map(clips.map(c => [c.name, c.clip])) };
}

export function buildProfiles(THREE, LP, rig) {
  const set = LP.buildProfileSet(THREE, { clips: rig.clips.filter(c => c.pack !== 'Simulation'), rigFamily: rig.rig || 'Rig_Medium', actor: (rig.label || 'ActionFigure') + ' @' + PIN.fig.slice(0, 8), actorScale: rig.k,
    measure: clip => LP.measureClip(THREE, { mixer: rig.mixer, clip, space: rig.root, feet: rig.feet, hips: rig.hips, fwd: new THREE.Vector3(0, 0, 1), side: new THREE.Vector3(1, 0, 0) }) });
  rig.mixer.stopAllAction(); return set;
}

export async function runProbes(THREE, mods, td, rig, ids = ['A', 'B', 'C'], opts = {}) {
  const { K2, WK, TC, WC, LP, AM } = mods, profiles = opts.profiles || buildProfiles(THREE, LP, rig), animMap = AM.mapJSON(rig.rig || 'Rig_Medium', AM.resolve(rig.inv), {});
  const W = WK.deriveWalkability(td), boxes = WK.parkBoxes(td), J = td._joints || td.joints;
  const wj = J.findIndex(j => j.piece === 'plaza_hairpin'), turnarounds = wj >= 0 ? [{ id: 'wende_j14', s0: J[wj].s, s1: J[wj + 1].s }] : [];
  const FR = K2.makeFrame(td.samples, td.ds, !!td.closed), out = {}, dt = 1 / 60;
  for (const id of ids) {
    const drv = K2.createDriver(60), ground = WK.makeGround(td, W), walker = WC.createWalkController({ THREE, params: { ...WALK_PARAMS } });
    let Pz = null; const host = { halfW: () => opts.halfW || 0.95, carH: () => opts.carH || 1.69, puff: () => {}, placeCar: (s, v = 0, lat = 0) => { Object.assign(drv, K2.createDriver(s)); drv.speed = v; drv.lat = lat; }, carPose: () => Pz, squash: () => {}, syncChase: () => {} };
    rig.mixer.stopAllAction();
    const core = TC.createTravelCore({ THREE, td, W, ground, boxes, turnarounds, walker, actor: { root: rig.root, mixer: rig.mixer, clips: rig.clipMap, feet: rig.feet }, profiles, animMap, host });
    const K = { gas: 0, brake: 0, left: 0, right: 0, driftL: 0, driftR: 0, boost: 0, jump: 0 };
    Pz = K2.pose(drv, FR.at(drv.s)); core.runProbe(id);
    for (let t = 0; t < core.PROBES[id].dur + 0.2; t += dt) { const Kin = core.carInput(K, drv), q = K2.stepDriver(drv, FR, Kin, dt, { assist: opts.assist ?? 0.8, halfWidth: opts.halfW || 0.95 }); Pz = K2.pose(drv, q); core.update(dt, drv, Pz); }
    out[id] = core.dump({ probe: id, label: core.PROBES[id].label, dt, driver: opts.driver || 'k2b', stream: td.id, fingerprint: td.fingerprint });
  }
  return { profiles, animMap, W, out };
}
