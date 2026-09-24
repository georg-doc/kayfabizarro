/* KFB WorldBuilder v1 · Figur (GothGirl · Rig_Medium) + EyeRig v6 + Gehen auf der Kugel
   · Laden/Klonen: atlas.js loadAsset/instance (Resident Atlas), Texturreparatur kit-lab.js.
   · Clips: atlas.js loadClips('Rig_Medium', ['General','MovementBasic']) — die vorhandenen
     KayKit-Clips; Mixamo-Bibliothek wird später per Clip-ID getauscht (CLIP_IDS).
   · Augen: der Weg des Eye-Rig-Batch-Tools, wörtlich in derselben Reihenfolge:
     prepareMediumActorCleanup → cleanup.apply(true) → mountKayKitEyes(profile = genehmigter
     Rig_Medium-Default rig-medium-default.v0.json) → sampleActorFaceColor → setBaseColor.
     Ausdrucksvertrag: kfb-pet-graft-driver.v4.json (dieselbe Datei, die das Tool lädt).
   · Gehen: Richtung auf der Kugel + Blickrichtung als Tangente; W/S bewegen entlang des
     Grosskreises, A/D drehen um die Normale. Höhe = planet.surface() (eine Höhenwahrheit). */

import * as THREE from 'three';
import { loadAsset, instance, loadClips } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/resident_atlas_s6/lib/atlas.js';
import { repairTextures } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/world_atlas/source/lib/kit-lab.js';
import { frameAt } from './wb1-buildings.js';

export const ACTOR = {
  id: 'gothgirl', label: 'GothGirl', rigFamily: 'Rig_Medium',
  path: 'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb', commit: 'main'
};
export const HEIGHT = null;   // nativ (Meter) — kein Einpassen, ein Massstab für alles
export const CLIP_IDS = { idle: [/^Idle_A$/i, /^Idle/i, /idle/i], walk: [/^Walking_A$/i, /^Walking/i, /walk/i], run: [/^Running_A$/i, /^Running/i, /run/i] };
const EYE = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@cloudflare-live/kfb-hub/stage/toolbox/eye-rig-batch/';
export const EYE_URLS = {
  adapter: EYE + 'lib/kaykit-eye-adapter.v1.js',
  cleanup: EYE + 'lib/medium-source-eye-cleanup.v1.js',
  sampler: EYE + 'lib/face-color-sampler.v1.js',
  profile: EYE + 'data/rig-medium-default.v0.json',
  contract: 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json'
};

export async function makeActor({ scene, planet, camera, log = () => {} }) {
  const holder = new THREE.Group();
  holder.name = 'actor:' + ACTOR.id;
  scene.add(holder);
  await loadAsset(ACTOR.path, ACTOR.commit);
  const figure = await instance(ACTOR.path, ACTOR.commit);
  repairTextures(figure);
  holder.add(figure);
  holder.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(figure);
  const srcH = box.max.y - box.min.y;
  figure.position.y -= box.min.y;
  figure.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });
  log('actor · ' + ACTOR.path.split('/').pop() + ' @' + ACTOR.commit + ' · native height ' + srcH.toFixed(2) + ' m (not rescaled)');

  /* Clips */
  const mixer = new THREE.AnimationMixer(figure);
  const actions = {};
  try {
    const set = await loadClips('Rig_Medium', ['General', 'MovementBasic']);
    for (const [k, pats] of Object.entries(CLIP_IDS)) {
      let hit = null;
      for (const re of pats) { hit = set.find((c) => re.test(c.name)); if (hit) break; }
      if (hit) actions[k] = mixer.clipAction(hit.clip);
    }
    log('clips · Rig_Medium General+MovementBasic · ' + set.length + ' clips · idle ' + (actions.idle ? actions.idle.getClip().name : '—') + ' · walk ' + (actions.walk ? actions.walk.getClip().name : '—') + ' · run ' + (actions.run ? actions.run.getClip().name : '—'));
  } catch (e) { log('clips · FAILED · ' + e.message); }
  let current = null;
  function play(k) {
    const a = actions[k] || actions.idle;
    if (!a || a === current) return;
    a.reset().setEffectiveWeight(1).fadeIn(0.18).play();
    if (current) current.fadeOut(0.18);
    current = a;
  }
  play('idle');
  mixer.update(0);

  /* Augen — EyeRig v6 über den Adapter des Batch-Tools (Rig-Einheit: Quellmassstab) */
  let eyes = null, eyeState = 'not mounted';
  try {
    const [AD, CL, SA, profile, contract] = await Promise.all([
      import(EYE_URLS.adapter), import(EYE_URLS.cleanup), import(EYE_URLS.sampler),
      fetch(EYE_URLS.profile).then((r) => { if (!r.ok) throw new Error('profile ' + r.status); return r.json(); }),
      fetch(EYE_URLS.contract).then((r) => { if (!r.ok) throw new Error('contract ' + r.status); return r.json(); })
    ]);
    const cleanup = CL.prepareMediumActorCleanup({ THREE, figure, actor: { id: ACTOR.id, label: ACTOR.label }, log: (m) => log('eyes · ' + m) });
    const cleaned = cleanup.status !== 'HUMAN_REQUIRED' ? cleanup.apply(true) : false;
    const prof = { eye: JSON.parse(JSON.stringify(profile.authoringDefault.eye)), status: profile.status };
    eyes = await AD.mountKayKitEyes({ THREE, figure, sourceRef: { path: ACTOR.path, commit: ACTOR.commit }, profile: prof, expressionContract: contract, camera, log: (m) => log('eyes · ' + m) });
    try {
      const fc = SA.sampleActorFaceColor({ THREE, figure, faceHost: eyes.faceHost, anchor: prof.eye.anchor, preferredHeadMesh: 'GothGirl_Head' });
      if (fc.status === 'OK') eyes.setBaseColor(fc.color);
    } catch (e) { /* Lidfarbe bleibt Profilvorgabe */ }
    eyeState = 'EyeRig v6 · profile ' + profile.rigClass + ' ' + profile.status + ' · source eyes ' + (cleaned ? 'removed (verified 2+3)' : 'kept');
    log('eyes · ' + eyeState);
  } catch (e) { eyeState = 'FAILED · ' + e.message; log('eyes · ' + eyeState); }

  const st = {
    dir: new THREE.Vector3(0, 1, 0),
    fwd: new THREE.Vector3(1, 0, 0),
    speed: 0, walk: false
  };
  const tang = () => { st.fwd.addScaledVector(st.dir, -st.fwd.dot(st.dir)); if (st.fwd.lengthSq() < 1e-8) st.fwd.copy(frameAt(st.dir).n); st.fwd.normalize(); };
  tang();
  const m4 = new THREE.Matrix4(), axis = new THREE.Vector3(), X = new THREE.Vector3();
  function place() {
    planet.surface(st.dir, holder.position);
    X.crossVectors(st.dir, st.fwd).normalize();
    m4.makeBasis(X, st.dir, st.fwd);
    holder.quaternion.setFromRotationMatrix(m4);
  }
  place();

  return {
    holder, figure, st, height: srcH, get eyes() { return eyes; }, get eyeState() { return eyeState; }, actions,
    setEyesVisible(on) { if (eyes) eyes.setVisible(on); },
    setPose(dir, fwd) { st.dir.fromArray(dir).normalize(); if (fwd) st.fwd.fromArray(fwd); tang(); place(); },
    place,
    /* keys: {f,b,l,r,run} · Geschwindigkeit in Welteinheiten/s */
    update(dt, keys) {
      const mv = (keys.f ? 1 : 0) - (keys.b ? 1 : 0), turn = (keys.l ? 1 : 0) - (keys.r ? 1 : 0);
      if (turn) { st.fwd.applyAxisAngle(st.dir, turn * 2.4 * dt); tang(); }
      const v = mv * (keys.run ? 3.6 : 1.4);
      if (v) {
        axis.crossVectors(st.dir, st.fwd).normalize();
        const ang = v * dt / planet.R;
        st.dir.applyAxisAngle(axis, ang).normalize();
        st.fwd.applyAxisAngle(axis, ang);
        tang();
      }
      play(!mv ? 'idle' : keys.run ? 'run' : 'walk');
      if (current) current.timeScale = mv < 0 ? -1 : 1;
      mixer.update(dt);
      place();
      if (eyes) eyes.update(dt, camera);
    },
    doc() { return { id: ACTOR.id, source: { path: ACTOR.path, commit: ACTOR.commit }, dir: st.dir.toArray().map((n) => +n.toFixed(5)), forward: st.fwd.toArray().map((n) => +n.toFixed(5)), eyes: !!(eyes && eyes.visible) }; }
  };
}
