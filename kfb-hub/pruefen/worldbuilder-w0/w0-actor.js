/* KFB WB-W0 · Figur: GothGirl (KayKit Rig_Medium) — laden, VERMESSEN, Augen, Clips
   Masse werden an der Ruhepose gemessen, BEVOR ein Clip läuft (keine Animationsextreme, keine
   bewegte AABB, keine Waffe — GothGirl trägt keine). Methode je Wert steht im Bericht.
   Laden: atlas.js loadAsset/instance · Textur: kit-lab.js repairTextures · Clips: atlas.js loadClips
   Augen: Eye-Rig-Batch-Folge (cleanup → mountKayKitEyes → sampleActorFaceColor → setBaseColor)
   mit dem genehmigten Rig_Medium-Default. Bewegung besitzt NICHT diese Datei, sondern der
   unveränderte walk-controller.js (Host). */

import * as THREE from 'three';
import { loadAsset, instance, loadClips } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/resident_atlas_s6/lib/atlas.js';
import { repairTextures } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/world_atlas/source/lib/kit-lab.js';

export const ACTOR = { id: 'gothgirl', label: 'GothGirl', rig: 'Rig_Medium', path: 'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb', commit: 'main' };
const EYE = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@cloudflare-live/kfb-hub/stage/toolbox/eye-rig-batch/';
const CONTRACT = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json';
const r3 = (v) => +v.toFixed(3);

export async function makeActor({ scene, camera, log = () => {} }) {
  const holder = new THREE.Group(); holder.name = 'actor:' + ACTOR.id;
  scene.add(holder);
  await loadAsset(ACTOR.path, ACTOR.commit);
  const figure = await instance(ACTOR.path, ACTOR.commit);
  repairTextures(figure);
  holder.add(figure);
  holder.updateMatrixWorld(true);

  /* ---- Vermessung an der Ruhepose ---- */
  const all = new THREE.Box3().setFromObject(figure, true);
  figure.position.y -= all.min.y;
  holder.updateMatrixWorld(true);
  const meshes = [];
  figure.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true; o.receiveShadow = false;
    const b = new THREE.Box3().setFromObject(o, true);
    meshes.push({ name: o.name, top: r3(b.max.y), bottom: r3(b.min.y), w: r3(b.max.x - b.min.x), d: r3(b.max.z - b.min.z) });
  });
  const feet = [];
  figure.traverse((o) => { if (o.isBone && /foot|toe/i.test(o.name)) { const p = o.getWorldPosition(new THREE.Vector3()); feet.push({ bone: o.name, y: r3(p.y) }); } });
  const top = (re) => { const l = meshes.filter((m) => re.test(m.name)); return l.length ? Math.max(...l.map((m) => m.top)) : null; };
  const bodyTop = Math.max(...meshes.filter((m) => !/hair|hat|acc/i.test(m.name)).map((m) => m.top));
  const box = new THREE.Box3().setFromObject(figure, true), sz = box.getSize(new THREE.Vector3());
  const M = {
    visualMeshHeight: r3(sz.y),
    method: 'Box3.setFromObject(figure, precise=true) · skinned vertices at rest pose · before any clip · feet grounded to y=0',
    footPoint: r3(box.min.y), footBones: feet,
    headTop: top(/head/i), hairTop: top(/hair/i), bodyTopExHair: r3(bodyTop),
    width: r3(sz.x), depth: r3(sz.z), meshes
  };
  log('actor · ' + ACTOR.label + ' visualMeshHeight ' + M.visualMeshHeight + ' m · head ' + M.headTop + ' · hair ' + M.hairTop + ' · body w/o hair ' + M.bodyTopExHair + ' · width ' + M.width + ' · foot ' + M.footPoint);

  /* ---- Augen ---- */
  let eyes = null, eyeState = 'not mounted';
  try {
    const [AD, CL, SA, profile, contract] = await Promise.all([
      import(EYE + 'lib/kaykit-eye-adapter.v1.js'), import(EYE + 'lib/medium-source-eye-cleanup.v1.js'), import(EYE + 'lib/face-color-sampler.v1.js'),
      fetch(EYE + 'data/rig-medium-default.v0.json').then((r) => r.json()), fetch(CONTRACT).then((r) => r.json())
    ]);
    const cleanup = CL.prepareMediumActorCleanup({ THREE, figure, actor: { id: ACTOR.id, label: ACTOR.label }, log: () => {} });
    const cleaned = cleanup.status !== 'HUMAN_REQUIRED' ? cleanup.apply(true) : false;
    const prof = { eye: JSON.parse(JSON.stringify(profile.authoringDefault.eye)) };
    eyes = await AD.mountKayKitEyes({ THREE, figure, sourceRef: { path: ACTOR.path, commit: ACTOR.commit }, profile: prof, expressionContract: contract, camera, log: () => {} });
    try { const fc = SA.sampleActorFaceColor({ THREE, figure, faceHost: eyes.faceHost, anchor: prof.eye.anchor, preferredHeadMesh: 'GothGirl_Head' }); if (fc.status === 'OK') eyes.setBaseColor(fc.color); } catch { /* Profilfarbe bleibt */ }
    holder.updateMatrixWorld(true);
    const eb = eyes.rig && eyes.rig.rig ? new THREE.Box3().setFromObject(eyes.rig.rig) : null;
    M.eyeRigTop = eb && isFinite(eb.max.y) ? r3(eb.max.y) : null;
    M.eyeRigFront = eb && isFinite(eb.max.z) ? r3(eb.max.z) : null;
    eyeState = 'EyeRig v6 · Rig_Medium authoring default · source eyes ' + (cleaned ? 'removed (verified 2+3)' : 'kept');
  } catch (e) { eyeState = 'FAILED · ' + e.message; }
  log('eyes · ' + eyeState + (M.eyeRigTop != null ? ' · eye rig top ' + M.eyeRigTop + ' m' : ''));

  /* ---- Clips (vorhandene KayKit-Clips; Mixamo später per ID) ---- */
  const mixer = new THREE.AnimationMixer(figure), actions = {};
  try {
    const set = await loadClips('Rig_Medium', ['General', 'MovementBasic']);
    const find = (...res) => { for (const re of res) { const c = set.find((x) => re.test(x.name)); if (c) return c; } return null; };
    for (const [k, res] of Object.entries({ idle: [/^Idle_A$/i, /^Idle/i], walk: [/^Walking_A$/i, /^Walking/i], run: [/^Running_A$/i, /^Running/i] })) { const c = find(...res); if (c) actions[k] = mixer.clipAction(c.clip); }
    log('clips · ' + Object.entries(actions).map(([k, a]) => k + ' ' + a.getClip().name).join(' · '));
  } catch (e) { log('clips · FAILED · ' + e.message); }
  let cur = null;
  const play = (k) => { const a = actions[k] || actions.idle; if (!a || a === cur) return; a.reset().fadeIn(0.15).play(); if (cur) cur.fadeOut(0.15); cur = a; };
  play('idle');

  return {
    holder, figure, M, get eyes() { return eyes; }, eyeState,
    setVisibleEyes(on) { if (eyes) eyes.setVisible(on); },
    /* Darstellung folgt dem Controller-Zustand; Tempo bestimmt den Clip */
    sync(state, dt) {
      holder.position.copy(state.position);
      holder.rotation.set(0, state.facing, 0);
      play(!state.moving ? 'idle' : state.sprinting ? 'run' : 'walk');
      mixer.update(dt);
      if (eyes) eyes.update(dt, camera);
    }
  };
}
