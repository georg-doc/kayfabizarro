/* KFB WorldBuilder · WORLD-INTEGRATION-01 · player actor presentation
   Actor: FrizzleBob graft (KayKit Rig_Medium host body + FrizzleBob head) through the owning reader
   `frizzlegraft-v1/graft-mount.v1.js` with animation:'host' — this module owns the clips, the graft
   owns head, face, eyes, mouth. No second eye/face owner is added here.
   Clips: the existing KFB Motion Library (media/3D_Assets/Animations/KFB_Motion_Library, Rig_Medium)
   first; where it has no clip for a semantic state (forward walk, jump), the existing KayKit
   Character Animations 1.1 Rig_Medium packs. No new clips.
   Speed truth: every locomotion clip is MEASURED on this actor at this scale — planted-foot speed
   (foot velocity while in ground contact) after root motion is removed. The walker gets those
   numbers as its speeds; playback rate = measured movement speed ÷ clip speed. Movement owns
   position, the clip follows. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* Module host for the graft graph (~20 modules). jsDelivr @main and @a46dbdff1503 both drop single
   modules as dynamic imports in this host (graft-biped.v1.js, pet-mouth.v1.js · measured 2026-09-25);
   raw.githack serves the same repo files with a JS MIME type and loaded the full graph. Fallback kept. */
const RIGS_HOSTS = ['https://raw.githack.com/georg-doc/kayfabizarro/main/tools/KFB-ToolBox/kfb-rigs-embed-v3/', 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@a46dbdff1503/tools/KFB-ToolBox/kfb-rigs-embed-v3/'];
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
const RAW = (p, c) => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + c + '/' + enc(p);
const KAYKIT = { commit: 'aa16a777a970f23d3f11fb3c23dc40718b04fa88', dir: 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/' };
const KFB_LIB = { commit: 'main', path: 'media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library_Rig_Medium.glb', catalog: 'media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json' };
const FALLBACK = { path: 'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb', commit: 'main', label: 'GothGirl (graft unavailable)' };
export const TARGET_HEIGHT = 1.85;   // m · door 2.35–2.90 m · floor 3.0 m (wd1-city FACADE_RULE)
export const STATES = ['Idle', 'Walk', 'Run', 'WalkBack', 'RunBack', 'JumpStart', 'JumpAir', 'JumpLand'];
const MB = 'MovementBasic', MA = 'MovementAdvanced', GE = 'General';
const JUMP = { JumpStart: [[MB, /^Jump_Start$/]], JumpAir: [[MB, /^Jump_Idle$/]], JumpLand: [[MB, /^Jump_Land$/]] };
/* Motion sets: all existing clips, no new ones. KayKit sets are authored for these chibi Rig_Medium bodies;
   the KFB Motion Library (Mixamo, checked on Orc Raider/Brute) has no forward walk and no jump. */
export const SETS = {
  'kaykit-a': { Idle: [[GE, /^Idle_A$/]], Walk: [[MB, /^Walking_A$/]], Run: [[MB, /^Running_A$/]], WalkBack: [[MA, /^Walking_Backwards$/]], ...JUMP },
  'kaykit-b': { Idle: [[GE, /^Idle_B$/]], Walk: [[MB, /^Walking_B$/]], Run: [[MB, /^Running_B$/]], WalkBack: [[MA, /^Walking_Backwards$/]], ...JUMP },
  'kaykit-c': { Idle: [[GE, /^Idle_A$/]], Walk: [[MB, /^Walking_C$/]], Run: [[MB, /^Running_A$/]], WalkBack: [[MA, /^Walking_Backwards$/]], ...JUMP },
  kfb: { Idle: [['kfb', 'kfb_idle_breathing_a']], Walk: [[MB, /^Walking_A$/]], Run: [['kfb', 'kfb_locomotion_run_forward_a']], WalkBack: [['kfb', 'kfb_locomotion_walk_backward_a']], RunBack: [['kfb', 'kfb_locomotion_run_backward_a']], ...JUMP }
};
export const SET_LABEL = { 'kaykit-a': 'KayKit A (Idle_A · Walking_A · Running_A)', 'kaykit-b': 'KayKit B (Idle_B · Walking_B · Running_B)', 'kaykit-c': 'KayKit C (Idle_A · Walking_C · Running_A)', kfb: 'KFB Motion Library (+ KayKit walk/jump)' };
export const DEFAULT_SET = 'kaykit-a';
const LOCO = ['Walk', 'Run', 'WalkBack', 'RunBack'];
const r3 = (v) => +(+v).toFixed(3);

async function loadAnims(loader, url) { try { return (await loader.loadAsync(url)).animations || []; } catch (e) { console.warn('[wi1-actor] clips', url, e); return null; } }

/* Root motion off: the linear x/z drift of root/hips over the clip is the travel. Removing it keeps
   the bob and sway, and returns what was removed (rig units) as a cross-check. */
function stripRootMotion(clip) {
  const c = clip.clone(); let travel = 0;
  for (const t of c.tracks) {
    if (!/(^|[.\/])(root|hips)\.position$/i.test(t.name)) continue;
    const v = t.values, n = t.times.length; if (n < 2) continue;
    const T = t.times[n - 1] - t.times[0] || 1, dx = v[(n - 1) * 3] - v[0], dz = v[(n - 1) * 3 + 2] - v[2];
    travel += Math.hypot(dx, dz);
    for (let i = 0; i < n; i++) { const k = (t.times[i] - t.times[0]) / T; v[i * 3] -= dx * k; v[i * 3 + 2] -= dz * k; }
  }
  return { clip: c, travelRig: travel };
}
/* Binding rule = KFB Animation Lab v4 (player.js retarget + ground.js fitHips), not re-invented:
   rotations everywhere, translations only on root/hips/pelvis, scale never — a Rig_Medium clip's
   per-bone positions carry the SOURCE rig's bone lengths and bend the graft host's arms (measured: all
   23 position + 23 scale tracks were bound before). The hips track is refit to the host's bind height. */
const POSOK = /^(root|hips|pelvis|armature)$/i;
/* ONE hips factor per rig, measured on the standing Idle — per-clip factors (Lab fitHips) rescale crouched
   or tucked clips (Jump_Land ×1.195, Jump_Idle ×0.856, measured) and bend the jump. */
function retarget(clip, figure, fixed = null) {
  const names = new Set(); let hips = null;
  figure.traverse((o) => { if (o.name) names.add(o.name); if (!hips && o.isBone && /^(hips|pelvis)$/i.test(o.name)) hips = o; });
  const keep = [];
  for (const tr of clip.tracks) {
    const dot = tr.name.lastIndexOf('.'), node = tr.name.slice(0, dot), prop = tr.name.slice(dot + 1);
    if (!names.has(node) || prop === 'scale') continue;
    if (prop === 'position' && !POSOK.test(node)) continue;
    keep.push(tr.clone());
  }
  let factor = 1;
  const hip = keep.filter((tr) => /(^|[.\/])(hips|pelvis)\.position$/i.test(tr.name));
  if (fixed != null) { factor = fixed; if (Math.abs(factor - 1) > 1e-6) for (const tr of hip) for (let i = 0; i < tr.values.length; i++) tr.values[i] *= factor; }
  else if (hips && hips.position.y && hip.length) {
    let sum = 0, n = 0; for (const tr of hip) for (let i = 1; i < tr.values.length; i += 3) { sum += tr.values[i]; n++; }
    const clipY = n ? sum / n : 0, f = clipY ? hips.position.y / clipY : 1;
    if (Math.abs(f - 1) > 0.08) { factor = f; for (const tr of hip) for (let i = 0; i < tr.values.length; i++) tr.values[i] *= f; }
  }
  return { clip: new THREE.AnimationClip(clip.name, clip.duration, keep), matched: keep.length, total: clip.tracks.length, hipsFactor: +factor.toFixed(3) };
}
function boneOf(figure, re) { let b = null; figure.traverse((o) => { if (!b && o.isBone && re.test(o.name)) b = o; }); return b; }

/* Planted-foot speed: sample the in-place clip, find each foot's ground-contact frames (lowest 6 %
   of hip height), measure the foot's horizontal speed while planted. That is the speed at which the
   body must travel for the planted foot to stay still on the ground. */
function measureStance(holder, figure, clip) {
  const feet = [boneOf(figure, /^foot[._]?l$/i) || boneOf(figure, /foot.*l|l.*foot/i), boneOf(figure, /^foot[._]?r$/i) || boneOf(figure, /foot.*r|r.*foot/i)].filter(Boolean);
  const hips = boneOf(figure, /^hips$/i);
  if (!feet.length || !hips) return null;
  const mixer = new THREE.AnimationMixer(figure), a = mixer.clipAction(clip); a.play();
  const N = Math.max(30, Math.round(clip.duration * 90)), T = clip.duration, S = feet.map(() => []), v = new THREE.Vector3();
  let hipY = 0;
  for (let i = 0; i <= N; i++) {
    mixer.setTime(T * i / N); holder.updateMatrixWorld(true);
    feet.forEach((f, k) => { f.getWorldPosition(v); S[k].push([v.x, v.y, v.z]); });
    hipY += hips.getWorldPosition(v).y / (N + 1);
  }
  a.stop(); mixer.uncacheRoot(figure);
  const speeds = [], dt = T / N; let contact = 0, total = 0;
  for (const s of S) {
    const minY = Math.min(...s.map((p) => p[1])), thr = minY + 0.03;   // same 3 cm contact band as the live slip probe
    for (let i = 0; i < s.length - 1; i++) {
      total++;
      if (s[i][1] > thr || s[i + 1][1] > thr) continue;
      contact++;
      speeds.push(-(s[i + 1][2] - s[i][2]) / dt);   // forward (+z) component: a planted foot moves backward under the body
    }
  }
  speeds.sort((x, y) => x - y);
  /* stride speed = forward distance the planted foot sweeps ÷ contact time. KayKit Walking_A sweeps the
     ankle unevenly (≈0 early stance, fast at heel-off, measured); matching the SWEPT DISTANCE means no
     net drift per step — the thing the eye reads as skating. The median is kept as a second number. */
  const mean = speeds.length ? Math.abs(speeds.reduce((a, b) => a + b, 0) / speeds.length) : 0;
  const med = speeds.length ? Math.abs(speeds[Math.floor(speeds.length / 2)]) : 0;
  return { speed: r3(mean), medianSpeed: r3(med), contactShare: r3(contact / Math.max(1, total)), hipY: r3(hipY), cycle: r3(T) };
}

export async function makeActor({ scene, camera, log = () => {} }) {
  const loader = new GLTFLoader();
  const holder = new THREE.Group(); holder.name = 'player'; scene.add(holder);
  const R = { actor: null, height: null, graft: null, face: null, clips: {}, measured: {}, gaps: [], sources: {} };
  let graft = null, figure = null;
  try {
    let GM = null, RIGS = null, lastErr = null;
    for (const h of RIGS_HOSTS) { try { GM = await import(h + 'frizzlegraft-v1/graft-mount.v1.js'); await GM.faceMods(); RIGS = h; break; } catch (e) { lastErr = e; GM = null; } }
    if (!GM) throw lastErr || new Error('graft reader not loadable');
    const { mountGraft, pickGraftPet } = GM;
    R.sources.graft = RIGS;
    const contract = await (await fetch(RIGS + 'contracts/kfb-pet-graft-driver.v4.json')).json();
    const pet = pickGraftPet(contract);
    graft = await mountGraft({ THREE, loader, parent: holder, pet, lib: contract, camera, animation: 'host', poseOverClip: false, log: () => {} });
    figure = graft.figure;
    if (graft.weapon && graft.weapon.holder) graft.weapon.holder.visible = false;
    R.actor = 'FrizzleBob graft · ' + (pet && pet.id) + ' · host ' + (graft.biped && graft.biped.variant);
    const hg = graft.report && graft.report.graft;
    R.graft = hg ? { hiddenHostHeadTris: hg.hiddenTris, hiddenExtras: hg.hiddenExtras, headScale: hg.scale, facing: hg.facing } : null;
    R.face = { eyeRig: graft.rig ? 1 : 0, mouth: graft.mouth ? 1 : 0, brow: graft.report.brow, nose: graft.report.nose, donorEyesStripped: !!graft.donorEyes };
  } catch (e) {
    log('graft failed · ' + e.message + ' · fallback ' + FALLBACK.label);
    const g = await loader.loadAsync(RAW(FALLBACK.path, FALLBACK.commit));
    figure = g.scene; holder.add(figure); R.actor = FALLBACK.label;
  }
  /* fit: holder-local bbox of the drawn body (graft-owned head/face boxes carry noMeasure) */
  holder.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(holder.matrixWorld).invert(), tmp = new THREE.Matrix4(), box = new THREE.Box3();
  figure.traverse((n) => {
    if (!n.isMesh || !n.geometry || n.userData.noMeasure) return;
    n.castShadow = true; n.receiveShadow = false; n.frustumCulled = false;
    if (!n.geometry.boundingBox) n.geometry.computeBoundingBox();
    box.union(n.geometry.boundingBox.clone().applyMatrix4(tmp.multiplyMatrices(inv, n.matrixWorld)));
  });
  const raw = box.getSize(new THREE.Vector3()).y || 1, k = TARGET_HEIGHT / raw;
  const body = new THREE.Group(); body.name = 'player-body';
  while (holder.children.length) body.add(holder.children[0]);
  body.scale.setScalar(k); body.position.y = -box.min.y * k; holder.add(body);
  holder.updateMatrixWorld(true);
  const full = new THREE.Box3().setFromObject(body, false);
  R.height = { rawRig: r3(raw), scale: r3(k), bodyM: TARGET_HEIGHT, withEarsM: r3(full.max.y - full.min.y), doorRatio: r3(2.6 / TARGET_HEIGHT), floorRatio: r3(3.0 / TARGET_HEIGHT) };

  /* clips · switchable motion sets (Georg 25.09.: KFB-Library run reads hunched on the big graft head) */
  const [kfb, gen, mov, adv] = await Promise.all([loadAnims(loader, RAW(KFB_LIB.path, KFB_LIB.commit)), loadAnims(loader, RAW(KAYKIT.dir + 'Rig_Medium_General.glb', KAYKIT.commit)), loadAnims(loader, RAW(KAYKIT.dir + 'Rig_Medium_MovementBasic.glb', KAYKIT.commit)), loadAnims(loader, RAW(KAYKIT.dir + 'Rig_Medium_MovementAdvanced.glb', KAYKIT.commit))]);
  const packs = { kfb, General: gen, MovementBasic: mov, MovementAdvanced: adv };
  Object.assign(R.sources, { kfb: kfb ? KFB_LIB.path + ' @' + KFB_LIB.commit + ' · ' + kfb.length + ' clips' : 'KFB Motion Library GLB not loadable', General: gen ? gen.length + ' clips' : 'n/a', MovementBasic: mov ? mov.length + ' clips' : 'n/a', MovementAdvanced: adv ? adv.length + ' clips' : 'n/a', kaykitCommit: KAYKIT.commit.slice(0, 12) });
  const mixer = new THREE.AnimationMixer(figure);
  let actions = {}, clips = {}, setName = null;
  const headBone = boneOf(figure, /^head$/i), chestBone = boneOf(figure, /^chest$/i) || boneOf(figure, /spine/i);
  /* head pitch against the chest while the clip plays — the number behind "looks sad" */
  function headPitch(clip) {
    if (!headBone) return null;
    const m2 = new THREE.AnimationMixer(figure), a2 = m2.clipAction(clip); a2.play();
    const f = new THREE.Vector3(), q = new THREE.Quaternion(); let sum = 0, n = 0;
    for (let i = 0; i < 24; i++) { m2.setTime(clip.duration * i / 24); holder.updateMatrixWorld(true); headBone.getWorldQuaternion(q); f.set(0, 0, 1).applyQuaternion(q); sum += Math.asin(THREE.MathUtils.clamp(f.y, -1, 1)); n++; }
    a2.stop(); m2.uncacheRoot(figure);
    return r3(-sum / n * 180 / Math.PI);   // + = looking down
  }
  function bindSet(name) {
    const plan = SETS[name] || SETS[DEFAULT_SET];
    mixer.stopAllAction(); for (const c of Object.values(clips)) mixer.uncacheClip(c);
    actions = {}; clips = {}; R.clips = {}; R.measured = {}; R.gaps = []; setName = SETS[name] ? name : DEFAULT_SET;
    let rigFactor = null;
    const order = ['Idle', ...STATES.filter((q) => q !== 'Idle')];
    for (const st of order) {
      let hit = null;
      for (const [pack, want] of plan[st] || []) {
        const list = packs[pack]; if (!list) continue;
        const c = typeof want === 'string' ? list.find((x) => x.name === want) : list.find((x) => want.test(x.name));
        if (c) { hit = { pack: pack === 'kfb' ? 'KFB Motion Library' : 'KayKit ' + pack, clip: c }; break; }
      }
      if (!hit) { R.gaps.push(st + ' · no clip'); continue; }
      const rt = retarget(hit.clip, figure, rigFactor);
      if (st === 'Idle') rigFactor = rt.hipsFactor;
      let clip = rt.clip, travelRig = 0;
      if (LOCO.includes(st)) { const sr = stripRootMotion(clip); clip = sr.clip; travelRig = sr.travelRig; }
      clips[st] = clip;
      actions[st] = mixer.clipAction(clip);
      if (/^Jump(Start|Land)$/.test(st)) { actions[st].setLoop(THREE.LoopOnce, 1); actions[st].clampWhenFinished = true; }
      R.clips[st] = { source: hit.pack, name: hit.clip.name, dur: r3(clip.duration), bound: rt.matched + '/' + rt.total, hipsFactor: rt.hipsFactor, rootTravelRig: r3(travelRig), headPitchDeg: headPitch(clip) };
    }
    if (setName === 'kfb') for (const st of ['Walk', 'JumpStart', 'JumpAir', 'JumpLand']) if (R.clips[st] && !R.clips[st].source.startsWith('KFB')) R.gaps.push(st + ' → ' + R.clips[st].source + ' (not in the KFB Motion Library)');
    for (const st of LOCO) if (clips[st]) {
      const m = measureStance(holder, figure, clips[st]);
      if (m) {
        const rootTravelM = r3(R.clips[st].rootTravelRig * k / Math.max(1e-6, clips[st].duration));
        /* speed = planted-foot sweep for every clip. Mixamo root travel of the KFB clips is a cross-check only:
           scaled to the library's hip height 0.406, it overshoots this host's feet (run 1.66 vs 1.04 m/s). */
        R.measured[st] = { ...m, rootTravelM, method: 'planted-foot sweep ÷ contact time' };
      }
    }
    if (!actions.RunBack && actions.WalkBack) { actions.RunBack = actions.WalkBack; clips.RunBack = clips.WalkBack; R.measured.RunBack = R.measured.WalkBack; R.clips.RunBack = R.clips.WalkBack; R.gaps.push('RunBack → WalkBack clip'); }
    R.motionSet = setName; cur = null; curState = null;
    play('Idle', 1, 0);
    log('motion set · ' + SET_LABEL[setName] + ' · ' + STATES.map((q) => q + ' ' + (R.clips[q] ? R.clips[q].name : '—')).join(' · '));
    log('planted-foot speed · ' + Object.entries(R.measured).map(([q, m]) => q + ' ' + m.speed + ' m/s').join(' · ') + ' · head pitch run ' + (R.clips.Run && R.clips.Run.headPitchDeg) + '°');
  }

  /* one crossfade at a time, weights always sum to 1 (a chain of overlapping fades can leak bind pose) */
  let cur = null, curState = null;
  function play(st, ts = 1, fade = 0.16, restart = false) {
    const a = actions[st] || (st === 'JumpAir' ? actions.JumpStart : null) || actions.Idle; if (!a) return;
    if (a !== cur || restart) {
      if (a === cur) { a.reset(); a.setEffectiveTimeScale(ts); a.setEffectiveWeight(1); a.play(); curState = st; return; }
      for (const x of Object.values(actions)) if (x !== a && x !== cur) { x.stop(); }
      a.reset(); a.enabled = true; a.setEffectiveTimeScale(ts); a.play();
      if (cur && fade > 0) a.crossFadeFrom(cur, fade, false); else { if (cur) cur.stop(); a.setEffectiveWeight(1); }
      cur = a;
    } else a.setEffectiveTimeScale(ts);
    curState = st;
  }
  bindSet((window.__wb2dProps || {}).motionSet || DEFAULT_SET);
  log('actor · ' + R.actor + ' · ' + TARGET_HEIGHT + ' m (rig ' + R.height.rawRig + ' × ' + R.height.scale + ')');

  return {
    holder, body, figure, graft, mixer, report: R,
    get actions() { return actions; }, get clips() { return clips; }, get motionSet() { return setName; },
    setMotionSet(name) { if (name !== setName) bindSet(name); },
    get state() { return curState; },
    native(st) { return R.measured[st] ? R.measured[st].speed : null; },
    play,
    update(dt) {
      mixer.update(dt);
      if (graft) { try { graft.update(dt, camera); } catch (e) { /* face rig is optional */ } }
    }
  };
}
