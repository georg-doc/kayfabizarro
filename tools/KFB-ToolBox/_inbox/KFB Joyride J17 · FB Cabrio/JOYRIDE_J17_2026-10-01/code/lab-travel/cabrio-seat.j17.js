/* KFB J17 · cabrio-seat.j17.js · Vehicle-Seat-Schicht für FB-CABRIO-JOYRIDE-01 (Blender-Referenz FB-CAR-01 · VEHICLE_SEAT_CONTRACT v0.1 · POSES.json-Rezepte).
 * Besitzt NUR: Cabrio-Vorbereitung (Dach offen Frame 52, Seitenfenster unten, Innenspiegel hoch), FB im Sitz (Sitzsockel, Fahrclip kfb_interaction_driving_a,
 * 2-Knochen-Arm-IK auf die 10-/2-Uhr-Griffe am Kranz), Lenkrad (× 8, max 120°), Lean / Bounce / Body Roll, Hop rein/raus (Zeitplan + Bahn wie hop.py),
 * Ohrenwind-Eingang (wind = sceneWind − Figurgeschwindigkeit), Messung für die Abnahme.
 * Besitzt NICHT: Auto-Bewegung (kfb-drive.k2b), Zustände/Gates (travel-core.j17), Ground (walk-controller.js), Kamera (joyride-drive.j10),
 * Gesicht (face-mount.v1 + clay-lids.v1 + ToolBox-Gesichtsmodule @8922d4b1 = ToolBox-Owner), Ohrenphysik (ear-dangle.v1 + ear-base.v1 = ToolBox-Owner).
 * Maßstab A (WSA 30.09. verbindlich): 1 Rig-Einheit = 0,616381042 m · Cabrio × 1,8 in Rig-Einheiten → 1 Cabrio-Einheit = 1,10949 m. Nie vehicles.len. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as ED from './pinned/ear-dangle.v1.js';
import * as EB from './pinned/ear-base.v1.js';
import * as FM from './pinned/face-mount.v1.js';
import * as CL from './pinned/clay-lids.v1.js';

export const SCALE_A = 0.616381042, CAR_K = 1.8, CAR_M = CAR_K * SCALE_A;
export const PIN_B = '93abbf22d14335e517cac75cc79bf2022af45ee3', PIN_TB = '8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e', PIN_EAR = '19088b142c6a7e7626f27fba8e80caf6ab2437c1';
const CDN = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@', enc = p => p.split('/').map(encodeURIComponent).join('/'), jsd = (p, c) => CDN + c + '/' + enc(p);
export const SRC = {
  cabrio: jsd('media/3D_Assets/Vehicles/KFB_CVP1/KFB_CVP1_cabrio.glb', PIN_B),
  drive: jsd('media/3D_Assets/Animations/KFB_Motion_Library/libs/Rig_Medium/KFB_Motion_interaction_i06.glb', PIN_B),
  earRig: jsd('tools/KFB-ToolBox/ear-rig/rigs/fb-default.ear-rig.json', PIN_EAR),
  contract: new URL('./fb-car-01/VEHICLE_SEAT_CONTRACT.json', import.meta.url).href };
const EMB = 'tools/KFB-ToolBox/kfb-rigs-embed-v3/';
/* dieselben Gesichts-Owner und derselbe Pin wie ToolBox Production-06 r2 (SRC.eyeRig / SRC.mouth / FACE_MODS) */
const FACE_MODS = [['Rig', 'petstudio-v9/studio-v12/pet-eye-rig.v6.js'], ['Mouth', 'petstudio-v9/studio-v3/pet-mouth.v1.js'], ['FaceHost', 'frizzlegraft-v1/facehost.v1.js'], ['Brow', 'petstudio-v9/studio-v12/brow-rig.v2.js'],
  ['Nose', 'petstudio-v9/studio-v12/pet-nose.v2.js'], ['Moust', 'petstudio-v9/studio-v12/pet-moustache.v1.js'], ['Oval', 'frizzlegraft-v1/eyeoval.v1.js'], ['Head', 'frizzlegraft-v1/headzones.v1.js'], ['PartRig', 'lab-v6/partrig.v1.js']];
/* FB-EARS-FLOPPY-01 Preset »B · Floppy« (ToolBox EAR_COMMON + EAR_PRESETS.floppy, wörtlich) */
const EAR_COMMON = { sagFrom: 25, sagShare: [0.65, 0.25, 0.10], maxFwd: [72, 30, 25], maxBack: [40, 25, 25], maxRoll: [30, 15, 10] };
export const EAR_FLOPPY = { ...EAR_COMMON, dangle: 1.4, damp: 1.1, gravity: 0.4, inertia: 1.2, spin: 1.0, bob: 5, wind: 1.5 };
/* Gesicht wie in ToolBox Production-06 r2 nach FB-EYES-LIDS-02: Rig-Augen (EyeRig v6, Sockel surface, Oval aus MEASURE.json) + Ton-Lider (hinge, round), Rig-Brauen, Rig-Mund; Nase bleibt die gemalte. */
export const FACE_ENTRY = { color: '#f2c93c', parts: { eyes: 'rig', brows: 'rig', nose: 'original', mouth: 'rig' }, eye: { oval: { w: 1.06, h: 1.04, d: 0.98, tilt: -25 } } };
/* J17-Ergänzung zum Seat Contract (Georg/WSA 30.09. »Hochsetzen«): Innenspiegel in Cabrio-Einheiten, Blender-Achsen (x rechts, y vorn, z hoch). */
export const MIRROR_J17 = { node: 'MirrorInterior', offsetNative: [0, 0.14, 0.04], why: 'Georg/WSA 30.09. Hochsetzen: 4 cm hoch + 14 cm vor (Cabrio-Einheiten), bleibt am Scheibenrahmen; vorher Ohrspitzen im Spiegel (20 Kanten) und Spiegel vor dem Gesicht in der Face-Kamera' };
export const CAB_NODES = { windows: ['Window2', 'Window'], steer: 'SteeringWheel', rim: 'Torus', seat: 'SeatL' };

const D2R = Math.PI / 180, V3 = () => new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);
/* Radstand Cabrio: WheelFL z −0,876 ↔ WheelRL z 0,516 (Cabrio-Einheiten) · Bounce: Feder k 60 / c 7 laut Vertrag; Eingang × 0,25 und ± 3 cm, sonst drückt die Rennstrecke (Landungen) die Unterschenkel 8 cm in die Sitzkante (J17-Messung) */
const WHEELBASE_M = 1.392 * CAR_M, BOUNCE = { gain: 0.25, max: 0.03 };
const ss = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x), clamp = (x, a, b) => Math.max(a, Math.min(b, x)), r3 = v => Math.round(v * 1000) / 1000;
export const b2g = a => new THREE.Vector3(a[0], a[2], -a[1]);   // Blender-Cabrio-Raum (z hoch, +y vorn) → GLB-Raum (y hoch, −z vorn)

/* ---------- Fahrzeug-Eintrag für joyride-drive.j10 (extraVehicles) ---------- */
export function cabrioVehicle(contract) {
  const roof = contract?.vehicle?.roof || { animation: 'C4D Animation Take', openFrame: 52 };
  return { id: 'cabrio', label: 'Cabrio · KFB CVP1 r2', file: 'KFB_CVP1_cabrio.glb @' + PIN_B.slice(0, 7), url: SRC.cabrio, scale: CAR_M, rotY: Math.PI, keepMat: /glass/i, notWheel: /steer/i,
    prep(model, g) {
      const info = { roof: null, hidden: [], mirror: null };
      const clip = g.animations.find(a => a.name === roof.animation) || g.animations[0];
      if (clip) { const mx = new THREE.AnimationMixer(model), a = mx.clipAction(clip); a.play(); const fps = 104 / clip.duration; mx.setTime(roof.openFrame / fps); a.paused = true; info.roof = { clip: clip.name, frame: roof.openFrame, t: r3(roof.openFrame / fps), fps: r3(fps) }; model.userData.roofMixer = mx; }
      for (const n of CAB_NODES.windows) { const o = model.getObjectByName(n); if (o) { o.visible = false; info.hidden.push(n); } }
      const mi = model.getObjectByName(MIRROR_J17.node);
      if (mi) { model.updateMatrixWorld(true); const lp = model.worldToLocal(mi.getWorldPosition(V3())), to = lp.clone().add(b2g(MIRROR_J17.offsetNative)); mi.position.copy(mi.parent.worldToLocal(model.localToWorld(to.clone())));
        info.mirror = { from: lp.toArray().map(r3), to: to.toArray().map(r3), offsetNative: MIRROR_J17.offsetNative }; }
      model.userData.cabPrep = info; } };
}

/* ---------- FB anziehen: Ohrenbasis + Ohrketten + Gesicht, ToolBox-Reihenfolge (ear-base → rigEars → mountFace) ---------- */
function applyEarCfg(ears, e) { const D = ED.DANGLE_DEFAULTS, g = (x, def) => (e[x] != null ? +e[x] : def), d = g('dangle', 1), k = g('stiff', 1) / Math.max(0.05, d * d), dm = g('damp', 1), L = g('limit', 1);
  for (const ch of [ears.L, ears.R]) {   // Abbildung wie ToolBox _applyEars (dangle = Meister-Schlaffheit)
    ch.setParams({ stiffness: D.stiffness.map(x => x * k), damping: D.damping.map(x => x * dm * Math.sqrt(k)), maxDeg: D.maxDeg.map(x => x * L), elastic: g('elastic', D.elastic), inertia: D.inertia * g('inertia', 1), spin: D.spin * g('spin', 1),
      wind: D.wind * g('wind', 1), flutter: D.flutter * g('wind', 1), gravity: g('gravity', 0), sagFrom: g('sagFrom', 0), sagShare: e.sagShare || null, bob: g('bob', 0), bobHz: g('bobHz', 0.6),
      maxFwd: e.maxFwd ? e.maxFwd.map(x => x * L) : null, maxBack: e.maxBack ? e.maxBack.map(x => x * L) : null, maxRoll: e.maxRoll ? e.maxRoll.map(x => x * L) : null });
    ch.setPose({ droop: g('droop', 0), fold: g('fold', 0), foldAt: g('foldAt', 0.55), curl: g('curl', 0) }); } }
const closedNeutral = f => { const m = f.mouth; if (!m || !m.p || !m.p.visemeMap || m.p.visemeMap.closed !== 'm' || !m.has || !m.has('neutral')) return; try { f.set('mouth.visemeMap', { ...m.p.visemeMap, closed: 'neutral' }); } catch (e) {} try { m.setVisemeMap({ closed: 'neutral' }); } catch (e) {} };
export async function dressFB(r) {
  const fig = r.fig, k = fig.scale.x, rep = { errors: [], earBase: [], face: null, faceLog: [] }; fig.scale.setScalar(1); fig.updateMatrixWorld(true);   // wie ToolBox: Figur 1:1, Maßstab erst danach
  let earRig = null; try { earRig = await (await fetch(SRC.earRig)).json(); } catch (e) { rep.errors.push('ear-rig json: ' + e.message); }
  const firsts = []; fig.traverse(o => { if (o.isBone && /^ear[._]?([lr])[._]?1$/i.test(o.name)) firsts.push(o); });
  for (const b of firsts) { try { const x = EB.insertChainBase(THREE, fig, b, b.name.replace(/1$/, 'base')); rep.earBase.push(x.report || x.status); } catch (e) { rep.errors.push('ear-base: ' + e.message); } }
  const ears = ED.rigEars(fig, earRig); applyEarCfg(ears, { ...EAR_FLOPPY, elastic: earRig?.ears?.L?.elastic ?? 0.6 });
  const M = {}; await Promise.all(FACE_MODS.map(async ([id, f]) => { try { M[id] = await import(jsd(EMB + f, PIN_TB)); } catch (e) { rep.errors.push('face owner ' + id + ': ' + e.message); } }));
  let face = null; try { face = FM.mountFace({ THREE, M, figure: fig, entry: JSON.parse(JSON.stringify(FACE_ENTRY)), log: x => rep.faceLog.push(String(x)) }); if (face.status !== 'OK') { rep.errors.push('face: ' + face.reason); face = null; } else { closedNeutral(face); rep.face = face.report; } }
  catch (e) { rep.errors.push('face: ' + e.message); face = null; }
  fig.scale.setScalar(k); fig.updateMatrixWorld(true);
  fig.traverse(o => { if (o.isMesh) o.frustumCulled = false; });
  r.ears = ears; r.face = face; r.clay = new CL.ClayLids(THREE); r.dress = rep; r.earRig = earRig;
  return rep;
}
/* Ein Bild Gesicht wie ToolBox rt.update: _applyLids (ohne gespeichertes Lid-Profil = nichts) → face.update → _postRig0 (sd 0) → clay.sync(Vorgaben: hinge) */
function faceTick(r, dt, cam) { const f = r.face; if (!f) return; try { f.update(dt, cam); const R = f.rig;
    if (R && R.eyes && R.emote) { const E = R.emote, pk = (v, i) => (Array.isArray(v) ? (v[i] != null ? v[i] : (v[0] || 0)) : (v || 0)); R.eyes.forEach((e, i) => { if (e && e._lids) e._lids.rotation.z = -(e._sx || 1) * pk(E.slant, i) * 0.85; }); }
    if (R && r.clay) r.clay.sync(R, null); } catch (e) { if (!r._faceErr) { r._faceErr = e.message; console.warn('[j17 face]', e); } } }

/* ---------- Seat-Schicht ---------- */
export async function mountSeat({ api, core, walker, ground, camera, getRig, onNote = () => {} }) {
  onNote('Cabrio: Seat Contract + Fahrclip …');
  const C = await (await fetch(SRC.contract)).json();
  const dg = await new GLTFLoader().loadAsync(SRC.drive), driveClip = dg.animations.find(a => a.name === 'kfb_interaction_driving_a');
  if (!driveClip) throw new Error('kfb_interaction_driving_a fehlt in ' + SRC.drive);
  const trackBones = [...new Set(driveClip.tracks.map(t => t.name.split('.')[0]))];
  const H = C.hop, F = H.marks, fr = a => (a[1] - a[0] + 1) / H.fps;
  const T_IN = { stand: fr(F.standIn), crouch: fr(F.crouchIn), hop: fr(F.hopIn), land: fr(F.landIn) }, T_OUT = { dip: fr(F.dipOut), hop: fr(F.hopOut), land: fr(F.landOut), stand: fr(F.standOut) };
  const HD = C.driverSeat.hipsSocket, PEAK = H.peakHipsZRig / CAR_K, OUTX = H.standOutsideX, CROUCH_DROP = 0.14 / CAR_K, DIP = 0.07 / CAR_K, CTRL = 0.15 / CAR_K;
  const M = { hipsErr: 0, hipsDev: 0, grip: { l: 0, r: 0 }, gripN: 0, seatedT: 0, steerLog: [], ear: { n: 0, L: [], R: [], v: [] }, hopChecks: [], lapChecks: [], windMax: 0, bounce: { min: 0, max: 0 }, lean: { min: 0, max: 0 }, wheelDeg: { min: 0, max: 0 }, events: [] };
  const K = { p: null, v: V3(), a: V3(), lean: 0, bx: 0, bv: 0, roll: 0, hp: null, hv: V3(), t: 0, logT: 0 };
  let lastState = '', active = false;

  /* Figur-Daten je Rig (Posen-Schnappschüsse am echten FB) */
  const figData = r => { if (r._seat) return r._seat; const fig = r.fig, by = {}; fig.traverse(o => { if (o.isBone) by[o.name] = o; });
    const bones = trackBones.map(n => by[n]).filter(Boolean);
    const snap = (clip, t) => { const mx = new THREE.AnimationMixer(fig), a = mx.clipAction(clip); a.play(); mx.setTime(t); const out = new Map(); for (const b of bones) out.set(b.name, { q: b.quaternion.clone(), p: b.position.clone() }); a.stop(); mx.uncacheRoot(fig); return out; };
    const idle = r.clipMap.get('Idle_A') || r.clipMap.get(r.profiles?.profiles?.idle?.clip) || [...r.clipMap.values()][0];
    const STAND = snap(idle, 0), SEAT = snap(driveClip, 0), CROUCH = blend(STAND, SEAT, 0.45);
    writePose(by, STAND); const R0 = r.root, pq = R0.quaternion.clone(), pp = R0.position.clone(); R0.quaternion.identity(); R0.position.set(0, 0, 0); R0.updateMatrixWorld(true);
    const hy = by.hips.getWorldPosition(V3()).y, toe = Math.min(by.toesl.getWorldPosition(V3()).y, by.toesr.getWorldPosition(V3()).y); R0.quaternion.copy(pq); R0.position.copy(pp); R0.updateMatrixWorld(true);
    const seatMix = new THREE.AnimationMixer(fig), seatAct = seatMix.clipAction(driveClip); seatAct.setLoop(THREE.LoopRepeat, Infinity);
    const regionOf = {}; const bodyMeshes = []; fig.traverse(o => { if (o.isSkinnedMesh && /^CharacterTemplate_|^FB_Ear_/.test(o.name)) bodyMeshes.push(o); });
    return (r._seat = { by, bones, STAND, SEAT, CROUCH, dropM: hy - toe, seatMix, seatAct, idle: idle?.name, bodyMeshes, regionOf }); };
  const blend = (A, B, t) => { const o = new Map(); for (const [n, a] of A) { const b = B.get(n) || a; o.set(n, { q: a.q.clone().slerp(b.q, t), p: a.p.clone().lerp(b.p, t) }); } return o; };
  const writePose = (by, P) => { for (const [n, v] of P) { const b = by[n]; if (!b) continue; b.quaternion.copy(v.q); if (n === 'hips') b.position.copy(v.p); } };
  const livePose = fd => { const o = new Map(); for (const b of fd.bones) o.set(b.name, { q: b.quaternion.clone(), p: b.position.clone() }); return o; };

  /* Cabrio-Referenzen (einmal je geladenem Cabrio) */
  const cabRefs = () => { const c = api.car; if (!c || c.id !== 'cabrio' || !c.model) return null; if (c._seatRefs) return c._seatRefs;
    const model = c.model, sw = model.getObjectByName(CAB_NODES.steer), rim = model.getObjectByName(CAB_NODES.rim); model.updateMatrixWorld(true);
    const W = C.steeringWheel, cen = b2g(W.centre), n = b2g(W.axis).normalize(), upB = new THREE.Vector3(...W.up), nB = new THREE.Vector3(...W.axis), sideB = nB.clone().cross(upB).normalize();
    if (sideB.x < 0) sideB.negate(); const up = b2g(upB.toArray()).normalize(), side = b2g(sideB.toArray()).normalize();
    const gripM = s => { const a = (s === 'l' ? -60 : 60) * D2R; return cen.clone().addScaledVector(up, W.radius * Math.cos(a)).addScaledVector(side, W.radius * Math.sin(a)).addScaledVector(n, C.hands.gripInsetAlongAxis); };
    const poleM = s => gripM(s).add(b2g([(s === 'l' ? -1 : 1) * 0.6 / CAR_K, -0.5 / CAR_K, -0.4 / CAR_K]));
    const R = { model, sw, rim, cen, n, W, sw0q: sw ? sw.quaternion.clone() : null, sw0p: sw ? sw.position.clone() : null, gripL: {}, pole: { l: poleM('l'), r: poleM('r') }, socket: b2g(HD), yaw0: model.quaternion.clone(), check: {} };
    if (sw) { const pw = sw.parent.getWorldQuaternion(new THREE.Quaternion()), mw = model.getWorldQuaternion(new THREE.Quaternion()), rel = mw.clone().invert().multiply(pw);
      R.axisP = n.clone().applyQuaternion(rel.clone().invert()).normalize(); R.cenP = sw.parent.worldToLocal(model.localToWorld(cen.clone())); }
    for (const s of ['l', 'r']) R.gripL[s] = (rim || sw || model).worldToLocal(model.localToWorld(gripM(s)));
    if (rim) { const bb = new THREE.Box3().setFromObject(rim), cw = bb.getCenter(V3()); R.check.rimCentreModel = model.worldToLocal(cw).toArray().map(r3); R.check.contractCentreModel = cen.toArray().map(r3); R.check.rimVsContract_native = r3(model.worldToLocal(bb.getCenter(V3())).distanceTo(cen)); }
    const bbC = new THREE.Box3().setFromObject(model), inv = model.matrixWorld.clone().invert(); bbC.applyMatrix4(inv); R.check.groundModelY = r3(bbC.min.y); R.check.contractGroundZ = C.vehicle.groundZ; R.check.lengthM = r3((bbC.max.z - bbC.min.z) * CAR_M);
    R.parts = {}; for (const nm of ['CarMesh', 'Dash', 'DoorL', 'DoorR', 'WIndowFront2', 'SeatL', 'Interior', 'Torus', 'SteeringWheel2', 'MirrorInterior', 'InstrCLuster']) { const o = model.getObjectByName(nm); if (o && o.isMesh) R.parts[nm] = o; }
    R.prep = model.userData.cabPrep || null;
    return (c._seatRefs = R); };

  /* Wurzel so setzen, dass die Hüfte am Ziel sitzt (objmat in hop.py) */
  const qM = new THREE.Quaternion(), qY = new THREE.Quaternion(), hw = V3(), tg = V3();
  const placeRoot = (r, R, fd, hipsModel, yawDeg, up = 0) => { const Rt = r.root; R.model.getWorldQuaternion(qM); qY.setFromAxisAngle(Y, yawDeg * D2R); Rt.quaternion.copy(qM).multiply(qY); Rt.position.set(0, 0, 0); Rt.updateMatrixWorld(true);
    fd.by.hips.getWorldPosition(hw); tg.copy(hipsModel); R.model.localToWorld(tg); if (up) tg.addScaledVector(Y.clone().applyQuaternion(qM), up); Rt.position.copy(tg).sub(hw); Rt.updateMatrixWorld(true); return tg.clone(); };
  const rotW = (b, axis, ang) => { if (!b || !ang) return; const pq = b.parent.getWorldQuaternion(new THREE.Quaternion()), wq = pq.clone().multiply(b.quaternion); wq.premultiply(new THREE.Quaternion().setFromAxisAngle(axis, ang)); b.quaternion.copy(pq.invert().multiply(wq)); };
  const fromTo = (b, from, to) => { const pq = b.parent.getWorldQuaternion(new THREE.Quaternion()), wq = pq.clone().multiply(b.quaternion); wq.premultiply(new THREE.Quaternion().setFromUnitVectors(from.clone().normalize(), to.clone().normalize())); b.quaternion.copy(pq.invert().multiply(wq)); b.updateMatrixWorld(true); };
  /* Beine (J17): der Fahrclip knickt die Knie 90°, FBs kurze Unterschenkel stecken dann in der Sitzkante. Knie strecken + Oberschenkel leicht heben (Kind im Auto, Beine hängen nach vorn, Blender-Befund: Pedale unerreichbar). */
  const LEG = { knee: 0.9, thigh: 0.12 };
  const legFix = (R, fd, w = 1) => { const Fw = V3().set(0, 0, -1).transformDirection(R.model.matrixWorld); for (const s of ['l', 'r']) { const ul = fd.by['upperleg' + s], ll = fd.by['lowerleg' + s], ft = fd.by['foot' + s]; if (!ul || !ll || !ft) continue;
      const H0 = ul.getWorldPosition(V3()), K0 = ll.getWorldPosition(V3()), d1 = K0.clone().sub(H0); fromTo(ul, d1, d1.clone().normalize().lerp(Fw, LEG.thigh * w));
      const K1 = ll.getWorldPosition(V3()), d2 = ft.getWorldPosition(V3()).sub(K1), hang = Fw.clone().multiplyScalar(0.55).add(V3().set(0, -0.85, 0).transformDirection(R.model.matrixWorld)).normalize(); fromTo(ll, d2, d2.clone().normalize().lerp(hang, LEG.knee * w)); } };
  const gripW = (R, s) => (R.rim || R.sw || R.model).localToWorld(R.gripL[s].clone());
  /* Reichweiten-Lehne (J17): der Fahrclip auf FB lässt die Schultern 5–7 cm weiter hinten als in Blender (Arm 0,50 Rig); fehlt Reichweite, kippen spine + chest
     um die Querachse nach vorn (höchstens 0,30 rad), bis beide Griffe mit 1,5 % Rest erreichbar sind. Danach die Arm-IK wie im Vertrag. */
  const reachLean = (r, R, fd, w = 1) => { const by = fd.by; if (!fd.armLen) fd.armLen = { l: by.upperarml.getWorldPosition(V3()).distanceTo(by.lowerarml.getWorldPosition(V3())) + by.lowerarml.getWorldPosition(V3()).distanceTo(by.wristl.getWorldPosition(V3())), r: by.upperarmr.getWorldPosition(V3()).distanceTo(by.lowerarmr.getWorldPosition(V3())) + by.lowerarmr.getWorldPosition(V3()).distanceTo(by.wristr.getWorldPosition(V3())) };
    const q = R.model.getWorldQuaternion(new THREE.Quaternion()), Lw = V3().set(1, 0, 0).applyQuaternion(q).negate(); let tot = 0;   // Modell ist um π gedreht: Modell −x = Auto links
    for (let it = 0; it < 5 && tot < 0.3; it++) { let need = 0; for (const s of ['l', 'r']) need = Math.max(need, by['upperarm' + s].getWorldPosition(V3()).distanceTo(gripW(R, s)) - fd.armLen[s] * 0.985); if (need <= 0.001) break;
      const lever = Math.max(0.1, by.spine.getWorldPosition(V3()).distanceTo(by.upperarml.getWorldPosition(V3()))), d = Math.min(0.3 - tot, (need / lever) * w * 1.1); rotW(by.spine, Lw, d * 0.5); rotW(by.chest, Lw, d * 0.5); r.root.updateMatrixWorld(true); tot += d; }
    M.reach = Math.max(M.reach || 0, tot); return tot; };
  const ik = (r, R, fd, w) => { const out = {}; for (const s of ['l', 'r']) { const ua = fd.by['upperarm' + s], la = fd.by['lowerarm' + s], wr = fd.by['wrist' + s]; if (!ua || !la || !wr) continue;
      const T = gripW(R, s); if (w > 0) { const q0u = ua.quaternion.clone(), q0l = la.quaternion.clone(), A = ua.getWorldPosition(V3()), B = la.getWorldPosition(V3()), Cw = wr.getWorldPosition(V3());
        const a = B.distanceTo(A), b = Cw.distanceTo(B), dv = T.clone().sub(A), d = clamp(dv.length(), 1e-4, (a + b) * 0.9999), dir = dv.normalize();
        const P = R.model.localToWorld(R.pole[s].clone()).sub(A), perp = P.addScaledVector(dir, -P.dot(dir)); if (perp.lengthSq() < 1e-10) perp.set(0, -1, 0); perp.normalize();
        const ca = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1), E = A.clone().addScaledVector(dir, ca * a).addScaledVector(perp, Math.sqrt(1 - ca * ca) * a);
        fromTo(ua, B.clone().sub(A), E.clone().sub(A)); const B2 = la.getWorldPosition(V3()), C2 = wr.getWorldPosition(V3()); fromTo(la, C2.sub(B2), T.clone().sub(B2));
        if (w < 1) { ua.quaternion.copy(q0u.slerp(ua.quaternion.clone(), w)); la.quaternion.copy(q0l.slerp(la.quaternion.clone(), w)); ua.updateMatrixWorld(true); } }
      out[s] = wr.getWorldPosition(V3()).distanceTo(T) / SCALE_A;
      /* Hand legt sich auf den Kranz (Richtung Lenkradmitte in der Radebene) statt nach vorn ins Armaturenbrett zu zeigen */
      const hd = fd.by['hand' + s], hs = fd.by['handslot' + s]; if (w > 0 && hd && hs) { const cw = R.model.localToWorld(R.cen.clone()), nW = R.n.clone().transformDirection(R.model.matrixWorld), inw = cw.sub(T); inw.addScaledVector(nW, -inw.dot(nW) - 0.2 * inw.length()); const W0 = wr.getWorldPosition(V3()), dirH = hs.getWorldPosition(V3()).sub(W0);
        const q0w = wr.quaternion.clone(); fromTo(wr, dirH, dirH.clone().normalize().lerp(inw.normalize(), 0.85)); if (w < 1) { wr.quaternion.copy(q0w.slerp(wr.quaternion.clone(), w)); wr.updateMatrixWorld(true); } } }
    return out; };

  /* Hop-Zeitplan: Werte in Cabrio-Einheiten (Blender-Achsen), Rezepte aus POSES.json / hop.py */
  const bez = (P0, P1, P2, t) => { const q = 1 - t; return [0, 1, 2].map(i => q * q * P0[i] + 2 * q * t * P1[i] + t * t * P2[i]); };
  const standZ = fd => C.vehicle.groundZ + fd.dropM / CAR_M + 0.03 / CAR_K;
  const hopAt = (h, fd, t) => { const SZ = h.standZ, SP = [OUTX, HD[1], SZ];
    if (h.kind === 'enter') { let u = t;
      if (u < h.A) { const k = ss(u / h.A); return { A: fd.STAND, B: fd.STAND, bt: 0, hips: b2g(SP).lerp(h.startM, 1 - k), hipsIsModel: true, yaw: h.yaw0 + (90 - h.yaw0) * k, ik: 0, ph: 'approach' }; } u -= h.A;
      if (u < T_IN.stand) return { A: fd.STAND, B: fd.STAND, bt: 0, hipsB: SP, yaw: 90, ik: 0, ph: 'standIn' }; u -= T_IN.stand;
      if (u < T_IN.crouch) { const k = ss(u / T_IN.crouch); return { A: fd.STAND, B: fd.CROUCH, bt: k, hipsB: [OUTX, HD[1], SZ - CROUCH_DROP * k], yaw: 90, ik: 0, ph: 'crouchIn' }; } u -= T_IN.crouch;
      if (u < T_IN.hop) { const k = u / T_IN.hop, P0 = [OUTX, HD[1], SZ - CROUCH_DROP], P2 = HD, P1 = [(P0[0] + P2[0]) / 2 - CTRL, HD[1], PEAK * 2 - (P0[2] + P2[2]) / 2];
        return { A: fd.CROUCH, B: fd.SEAT, bt: ss(Math.min(1, k * 2.5)), hipsB: bez(P0, P1, P2, k), yaw: 90 + 90 * ss(k), ik: 0, ph: 'hopIn' }; } u -= T_IN.hop;
      const k = Math.min(1, u / T_IN.land); return { A: fd.SEAT, B: fd.SEAT, bt: 0, hipsB: [HD[0], HD[1], HD[2] - DIP * Math.sin(Math.PI * k)], yaw: 180, ik: ss(k), ph: 'landIn' }; }
    let u = t;
    if (u < T_OUT.dip) { const k = ss(u / T_OUT.dip); return { A: h.live, B: h.live, bt: 0, hipsB: [HD[0], HD[1], HD[2] - DIP * k], yaw: 180, ik: 1 - k, ph: 'dipOut' }; } u -= T_OUT.dip;
    if (u < T_OUT.hop) { const k = u / T_OUT.hop, P0 = [HD[0], HD[1], HD[2] - DIP], P2 = [OUTX, HD[1], SZ - CROUCH_DROP], P1 = [(P0[0] + P2[0]) / 2 - CTRL, HD[1], PEAK * 2 - (P0[2] + P2[2]) / 2];
      return { A: h.live, B: fd.CROUCH, bt: ss(Math.max(0, (k - 0.5) * 2)), hipsB: bez(P0, P1, P2, k), yaw: 180 + 90 * ss(k), ik: 0, ph: 'hopOut' }; } u -= T_OUT.hop;
    if (u < T_OUT.land) { const k = ss(u / T_OUT.land); return { A: fd.CROUCH, B: fd.STAND, bt: k, hipsB: [OUTX, HD[1], SZ - CROUCH_DROP * (1 - k)], yaw: 270, ik: 0, ph: 'landOut' }; }
    return { A: fd.STAND, B: fd.STAND, bt: 0, hipsB: SP, yaw: 270, ik: 0, ph: 'standOut' }; };
  const hop = {
    wants: () => { const r = getRig(); return r.id === 'frizzlebob' && !!cabRefs(); },
    step(c, dt, Pz, S) { S.pose = null; const r = getRig(), R = cabRefs(), fd = figData(r); c.t += dt;
      if (!c.h) { const h = c.h = { kind: c.kind, standZ: standZ(fd), t0: S.t, frames: 0, checked: new Set() };
        if (c.kind === 'enter') { const hp = fd.by.hips.getWorldPosition(V3()); h.startM = R.model.worldToLocal(hp.clone()); const f = V3().set(0, 0, 1).applyQuaternion(r.root.quaternion).applyQuaternion(R.model.getWorldQuaternion(new THREE.Quaternion()).invert());
          h.yaw0 = Math.atan2(f.x, f.z) / D2R; while (h.yaw0 - 90 > 180) h.yaw0 -= 360; while (h.yaw0 - 90 < -180) h.yaw0 += 360;
          const dm = h.startM.distanceTo(b2g([OUTX, HD[1], h.standZ])) * CAR_M; h.A = dm < 0.25 ? 0 : Math.min(1.4, dm / 3.5); h.T = h.A + T_IN.stand + T_IN.crouch + T_IN.hop + T_IN.land; }
        else { h.live = livePose(fd); h.T = T_OUT.dip + T_OUT.hop + T_OUT.land + T_OUT.stand; fd.seatAct.stop(); }
        M.events.push({ t: r3(S.t), hop: c.kind, dur: r3(h.T), approach: r3(h.A || 0) }); }
      if (c.t >= c.h.T && c.kind === 'exit') { const L = R.model.localToWorld(b2g([OUTX, HD[1], C.vehicle.groundZ])), g = ground.info(L.x, L.z), f = V3().set(0, 0, 1).applyQuaternion(qM.copy(R.model.getWorldQuaternion(qM)).multiply(qY.setFromAxisAngle(Y, 270 * D2R)));
        if (g.ok) { walker.reset(L.x, L.z, g.y, Math.atan2(f.x, f.z)); ground.st.s = g.s; ground.st.y = g.y; } M.events.push({ t: r3(S.t), hopDone: 'exit', ground: g.ok ? g.id : 'kein Boden → Core-Punkt' }); }
      return c.t >= c.h.T; } };

  /* Kollision: Kanten des FB-Körpers gegen Autodreiecke (Möller–Trumbore auf Segmenten) */
  const vv = V3(), e1 = V3(), e2 = V3(), pv = V3(), tv = V3(), qv = V3();
  const segTri = (o, d, a, b, c) => { e1.subVectors(b, a); e2.subVectors(c, a); pv.crossVectors(d, e2); const det = e1.dot(pv); if (Math.abs(det) < 1e-12) return false; const inv = 1 / det; tv.subVectors(o, a); const u = tv.dot(pv) * inv; if (u < 0 || u > 1) return false;
    qv.crossVectors(tv, e1); const v = d.dot(qv) * inv; if (v < 0 || u + v > 1) return false; const t = e2.dot(qv) * inv; return t >= 0 && t <= 1; };
  const regionName = b => /wrist|hand/.test(b) ? 'hand' : /hips|upperleg/.test(b) ? 'butt' : /ear/.test(b) ? 'ear' : /lowerleg|foot|toes/.test(b) ? 'leg' : /arm/.test(b) ? 'arm' : 'body';
  const collide = (r, R, fd, parts) => { const edges = []; const bb = new THREE.Box3();
    for (const m of fd.bodyMeshes) { const g = m.geometry, idx = g.index, n = idx ? idx.count / 3 : g.attributes.position.count / 3, step = Math.max(1, Math.floor(n / 1400)), SI = g.attributes.skinIndex, SW = g.attributes.skinWeight, cache = new Map();
      const P = i => { let p = cache.get(i); if (!p) { p = m.getVertexPosition(i, V3()).applyMatrix4(m.matrixWorld); cache.set(i, p); bb.expandByPoint(p); } return p; };
      const reg = i => { let bi = 0, bw = -1; for (let k = 0; k < 4; k++) { const w = SW.getComponent(i, k); if (w > bw) { bw = w; bi = SI.getComponent(i, k); } } const bn = m.skeleton.bones[bi]; return regionName(bn ? bn.name : ''); };
      for (let t = 0; t < n; t += step) { const ia = idx ? idx.getX(t * 3) : t * 3, ib = idx ? idx.getX(t * 3 + 1) : t * 3 + 1, ic = idx ? idx.getX(t * 3 + 2) : t * 3 + 2; const rg = reg(ia);
        edges.push([P(ia), P(ib), rg], [P(ib), P(ic), rg], [P(ic), P(ia), rg]); } }
    bb.expandByScalar(0.02); const hits = {};
    for (const [nm, mesh] of Object.entries(R.parts)) { if (parts && !parts.includes(nm)) continue; if (!mesh.visible) continue; const g = mesh.geometry, pos = g.attributes.position, idx = g.index, n = idx ? idx.count / 3 : pos.count / 3, tris = [];
      for (let t = 0; t < n; t++) { const ia = idx ? idx.getX(t * 3) : t * 3, ib = idx ? idx.getX(t * 3 + 1) : t * 3 + 1, ic = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
        const a = V3().fromBufferAttribute(pos, ia).applyMatrix4(mesh.matrixWorld), b = V3().fromBufferAttribute(pos, ib).applyMatrix4(mesh.matrixWorld), c = V3().fromBufferAttribute(pos, ic).applyMatrix4(mesh.matrixWorld);
        if (bb.containsPoint(a) || bb.containsPoint(b) || bb.containsPoint(c)) tris.push([a, b, c]); }
      if (!tris.length) continue; const d = V3();
      for (const [p, q, rg] of edges) { d.subVectors(q, p); for (const [a, b, c] of tris) if (segTri(p, d, a, b, c)) { const k = nm + ':' + rg; hits[k] = (hits[k] || 0) + 1; break; } } }
    return { edges: edges.length, hits }; };
  const ALLOWED = { 'Torus:hand': 1, 'SteeringWheel2:hand': 1, 'SeatL:butt': 1 };
  const judge = h => Object.entries(h).filter(([k]) => !ALLOWED[k]).reduce((a, [, v]) => a + v, 0);

  /* ---------- Takt (nach Auto-Transform, joyride-drive.j10 late) ---------- */
  const update = (dt, drv) => { if (!(dt > 0)) return; const r = getRig(), fb = r.id === 'frizzlebob', R = cabRefs(); active = fb && !!R; K.t += dt;
    const fd = fb ? figData(r) : null, S = core.S;
    if (R) { /* Kinematik aus dem Autoknoten (Weltmeter) */
      const P = api.carG.position; if (!K.p) K.p = P.clone(); const v = P.clone().sub(K.p).divideScalar(dt); K.p.copy(P);
      if (v.length() > 90) { K.v.copy(v); K.a.set(0, 0, 0); } else { const a = v.clone().sub(K.v).divideScalar(dt); K.v.lerp(v, 0.35); K.a.lerp(a, 0.2); }
      const q = api.carG.quaternion, Fw = V3().set(0, 0, 1).applyQuaternion(q), Uw = V3().set(0, 1, 0).applyQuaternion(q), Rw = Fw.clone().cross(Uw);
      const aR = K.a.dot(Rw), aU = K.a.dot(Uw) + 9.81 * (Uw.y - 1);
      K.lean += (clamp(-0.02 * aR, -0.35, 0.35) - K.lean) * Math.min(1, dt * 10);
      K.bv += (-60 * K.bx - 7 * K.bv - BOUNCE.gain * aU) * dt; K.bx = clamp(K.bx + K.bv * dt, -BOUNCE.max, BOUNCE.max);
      const roll = clamp(-0.012 * aR, -0.06, 0.06); K.roll += (roll - K.roll) * Math.min(1, dt * 8);
      R.model.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), K.roll).multiply(R.yaw0);
      /* Lenkwinkel: k2b-Lenkung (Tasten A/D); fährt die Spurhilfe allein (steerAngle 0), kinematisch aus der Gierrate δ = atan(Radstand · ω / v) */
      const hd = Math.atan2(Fw.x, Fw.z); let om = 0; if (K.hd != null) { let dh = hd - K.hd; if (dh > Math.PI) dh -= 2 * Math.PI; if (dh < -Math.PI) dh += 2 * Math.PI; om = dh / dt; } K.hd = hd; K.om = (K.om || 0) + (om - (K.om || 0)) * Math.min(1, dt * 6);
      const sp = Math.max(1, v.length()), stK = Math.abs(drv.steerAngle || 0) > 1e-3 ? drv.steerAngle : (drv.fly ? 0 : Math.atan(WHEELBASE_M * K.om / sp)); K.steerSrc = Math.abs(drv.steerAngle || 0) > 1e-3 ? 'k2b' : 'yaw';
      const wheel = clamp(-stK * C.steeringWheel.ratio, -C.steeringWheel.maxDeg * D2R, C.steeringWheel.maxDeg * D2R);
      if (R.sw && R.axisP) { const qa = new THREE.Quaternion().setFromAxisAngle(R.axisP, wheel); R.sw.quaternion.copy(qa).multiply(R.sw0q); R.sw.position.copy(R.cenP).add(R.sw0p.clone().sub(R.cenP).applyQuaternion(qa)); }
      R.model.updateMatrixWorld(true); K.wheel = wheel; K.fw = Fw; K.speed = v.length();
      M.wheelDeg.min = Math.min(M.wheelDeg.min, wheel / D2R); M.wheelDeg.max = Math.max(M.wheelDeg.max, wheel / D2R); M.lean.min = Math.min(M.lean.min, K.lean); M.lean.max = Math.max(M.lean.max, K.lean);
      if (K.t - K.logT > 0.25) { K.logT = K.t; M.steerLog.push([r3(K.t), r3(drv.steerAngle || 0), r3(wheel / D2R), r3(K.speed * 3.6), K.steerSrc]); if (M.steerLog.length > 2400) M.steerLog.shift(); } }
    let st = 'off';
    if (active) {
      if (S.cut && S.cut.hop && S.cut.h) { const h = S.cut.h, p = hopAt(h, fd, S.cut.t); st = 'hop.' + p.ph; writePose(fd.by, p.bt ? blend(p.A, p.B, p.bt) : p.A);
        placeRoot(r, R, fd, p.hipsIsModel ? p.hips : b2g(p.hipsB), p.yaw); { const lw = /landIn|dipOut/.test(p.ph) ? 1 : p.ph === 'hopIn' ? p.bt : p.ph === 'hopOut' ? 1 - p.bt : 0; if (lw > 0) legFix(R, fd, lw); } if (p.ik > 0) { reachLean(r, R, fd, p.ik); ik(r, R, fd, p.ik); }
        const f = Math.floor(S.cut.t * H.fps); if (f % 2 === 0 && !h.checked.has(f) && /hop|land|dip/.test(p.ph)) { h.checked.add(f); r.root.updateMatrixWorld(true); const c = collide(r, R, fd, ['CarMesh', 'DoorL', 'DoorR', 'SeatL', 'WIndowFront2', 'Dash', 'Interior']);
          M.hopChecks.push({ kind: h.kind, f, ph: p.ph, hits: c.hits, bad: /hop/.test(p.ph) ? Object.entries(c.hits).filter(([k]) => /^(CarMesh|DoorL|DoorR|SeatL|WIndowFront2):/.test(k)).reduce((a, [, v]) => a + v, 0) : judge(c.hits) }); if (M.hopChecks.length > 400) M.hopChecks.shift(); } }
      else if (S.mode === 'AUTO' && !S.cut) { st = 'seated'; if (!fd.seatAct.isRunning()) { fd.seatAct.reset().play(); } fd.seatMix.update(dt);
        const tgt = placeRoot(r, R, fd, R.socket, 180, K.bx); const Fw = K.fw;
        rotW(fd.by.spine, Fw, 0.5 * K.lean); rotW(fd.by.chest, Fw, 0.5 * K.lean); rotW(fd.by.head, Fw, -0.3 * K.lean); r.root.updateMatrixWorld(true);
        legFix(R, fd, 1); reachLean(r, R, fd, 1); const g = ik(r, R, fd, 1); M.seatedT += dt; M.gripN++; M.grip.l = Math.max(M.grip.l, g.l || 0); M.grip.r = Math.max(M.grip.r, g.r || 0);
        const hp = fd.by.hips.getWorldPosition(V3()), sock = R.model.localToWorld(R.socket.clone()); M.hipsErr = Math.max(M.hipsErr, hp.distanceTo(tgt) / SCALE_A); M.hipsDev = Math.max(M.hipsDev, hp.distanceTo(sock) / SCALE_A);
        M.bounce.min = Math.min(M.bounce.min, K.bx); M.bounce.max = Math.max(M.bounce.max, K.bx); }
      else fd.seatAct.stop(); }
    else if (fd) fd.seatAct.stop();
    if (st !== lastState) { M.events.push({ t: r3(K.t), seat: st }); if (M.events.length > 300) M.events.shift(); lastState = st; }
    /* Ohren + Gesicht (jede FB-Szene, auch zu Fuß) */
    if (fb) { r.root.updateMatrixWorld(true); const hp = fd.by.hips.getWorldPosition(V3()); if (!K.hp) K.hp = hp.clone(); const hv = hp.clone().sub(K.hp).divideScalar(dt); K.hp.copy(hp); if (hv.length() < 90) K.hv.lerp(hv, 0.2);
      const wind = K.hv.clone().negate(); M.windMax = Math.max(M.windMax, wind.length());
      if (r.ears) { r.ears.update(dt, { wind }); const kmh = K.hv.length() * 3.6; if (kmh > 20 && kmh < 30 && st === 'seated') { const tip = ch => -ch.state.reduce((a, s) => a + s.x, 0) / D2R; M.ear.n++; M.ear.L.push(tip(r.ears.L)); M.ear.R.push(tip(r.ears.R)); M.ear.v.push(kmh); if (M.ear.L.length > 3000) { M.ear.L.shift(); M.ear.R.shift(); M.ear.v.shift(); } } }
      faceTick(r, dt, camera); }
    K.state = st; };

  const stat = a => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y); return { n: a.length, mean: r3(a.reduce((x, y) => x + y, 0) / a.length), min: r3(s[0]), max: r3(s[s.length - 1]), p10: r3(s[Math.floor(s.length * 0.1)]), p90: r3(s[Math.floor(s.length * 0.9)]) }; };
  const metrics = () => { const R = cabRefs(), r = getRig();
    return { schema: 'kfb.j17.cabrio-seat/0.1', state: K.state, active, scale: { SCALE_A, CAR_K, carM: r3(CAR_M) }, check: R ? R.check : null, prep: R ? R.prep : null, mirror: MIRROR_J17,
      seated_s: r3(M.seatedT), hipsPlacementErr_rig: r3(M.hipsErr), hipsDevIncludingBounce_rig: r3(M.hipsDev), bounce_m: { min: r3(M.bounce.min), max: r3(M.bounce.max) },
      wristToGripMax_rig: { l: r3(M.grip.l), r: r3(M.grip.r) }, gripFrames: M.gripN, reachLeanMax_rad: r3(M.reach || 0), wheelDeg: { min: r3(M.wheelDeg.min), max: r3(M.wheelDeg.max) }, lean_rad: { min: r3(M.lean.min), max: r3(M.lean.max) },
      earTipBack_deg_20to30kmh: { L: stat(M.ear.L), R: stat(M.ear.R), kmh: stat(M.ear.v) }, windMax_ms: r3(M.windMax),
      hopChecks: M.hopChecks.slice(-200), lapChecks: M.lapChecks, steerLogTail: M.steerLog.slice(-40), steerLogN: M.steerLog.length, events: M.events.slice(-60),
      dress: r.dress ? { errors: r.dress.errors, earBase: r.dress.earBase, face: r.dress.face, faceErr: r._faceErr || null } : null, idleClip: r._seat?.idle || null, standHipsZ: r._seat ? { measured: r3(standZ(r._seat)), contract: H.standHipsZ } : null }; };
  const lapCheck = label => { const r = getRig(), R = cabRefs(); if (!active || !R) return null; const fd = figData(r); r.root.updateMatrixWorld(true); const c = collide(r, R, fd, null), row = { label, t: r3(K.t), s: Math.round(api.drv.s), hits: c.hits, bad: judge(c.hits), edges: c.edges }; M.lapChecks.push(row); return row; };
  const hipsWorld = () => { const r = getRig(); return r._seat ? r._seat.by.hips.getWorldPosition(V3()) : null; };
  const reset = () => { Object.assign(M, { hipsErr: 0, hipsDev: 0, grip: { l: 0, r: 0 }, gripN: 0, seatedT: 0, steerLog: [], ear: { n: 0, L: [], R: [], v: [] }, hopChecks: [], lapChecks: [], windMax: 0, bounce: { min: 0, max: 0 }, lean: { min: 0, max: 0 }, wheelDeg: { min: 0, max: 0 }, events: [] }); };
  return { hop, update, metrics, lapCheck, hipsWorld, reset, owns: () => active, contract: C, driveClip: driveClip.name, SRC };
}
