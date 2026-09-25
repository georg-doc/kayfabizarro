/* KFB WorldBuilder · WORLD-INTEGRATION-01 · player actor presentation · r2 (continuation 2026-09-25)
   Actor: FrizzleBob graft (KayKit Rig_Medium host body + FrizzleBob head) through the owning reader
   `frizzlegraft-v1/graft-mount.v1.js` with animation:'host' — this module binds the clips, the graft
   owns head, face, eyes, mouth. No second eye/face owner, no second outline renderer.

   r2 · LOCOMOTION CONSUMER, NOT A SECOND ANIMATION LAB
   Canonical base vocabulary = KayKit Character Animations 1.1 Rig_Medium (Georg / brief 25.09.). The World
   consumes semantic states; filenames only appear as the SOURCE of a state. Inventory read from the three
   pack GLBs @aa16a777 (all clip names, 2026-09-25):
     General          Idle_A Idle_B (+ Death/Hit/Interact/PickUp/Spawn/Throw/Use_Item — not locomotion)
     MovementBasic    Walking_A/B/C · Running_A/B · Jump_Start · Jump_Idle · Jump_Land · Jump_Full_Short/Long
     MovementAdvanced Walking_Backwards · Running_Strafe_Left/Right · Crouching · Sneaking · Crawling ·
                      Dodge_* · Running_HoldingBow/Rifle
   NOT in the source: a sprint clip, a fast-walk clip, a walking strafe, a fast backward clip, a crouch idle.
   Those tiers are PLAYBACK VARIANTS of a source clip and carry `variant: true` + the rate — never a fake clip.
   Speed truth: every cyclic clip is MEASURED on this actor at this scale — planted-foot sweep (foot velocity
   while in ground contact, root motion removed). World speed = measured clip speed × playback rate.
   Movement owns position; the clip follows. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const TOOLBOX_PROFILE_PIN = '5dcf34bcdf9d87445e927c98f60d41adae72f00e';
const TOOLBOX_PROFILE_URL = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/5dcf34bcdf9d87445e927c98f60d41adae72f00e/tools/KFB-ToolBox/stage-first/profiles/locomotion/kfb-locomotion-profiles.Rig_Medium.frizzlebob-earrig-v5.consumer.json';
const TOOLBOX_PROFILE = await fetch(TOOLBOX_PROFILE_URL, { cache:'no-store' }).then((r) => { if (!r.ok) throw new Error('ToolBox locomotion profile HTTP ' + r.status); return r.json(); });
if (TOOLBOX_PROFILE.schema !== 'kfb.locomotion-profile-set/0.1#consumer') throw new Error('ToolBox locomotion profile schema mismatch: ' + TOOLBOX_PROFILE.schema);

const RIGS_HOSTS = ['https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@053bc922bfb7f3ee22195e22c35a62eb9aada4eb/tools/KFB-ToolBox/kfb-rigs-embed-v3/', 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@a46dbdff1503/tools/KFB-ToolBox/kfb-rigs-embed-v3/'];
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
const RAW = (p, c) => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + c + '/' + enc(p);
const KAYKIT = { commit: TOOLBOX_PROFILE.source.commit, dir: TOOLBOX_PROFILE.source.path };
const KFB_LIB = { commit: '053bc922bfb7f3ee22195e22c35a62eb9aada4eb', path: 'media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library_Rig_Medium.glb' };
const FALLBACK = { path: 'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb', commit: '053bc922bfb7f3ee22195e22c35a62eb9aada4eb', label: 'GothGirl (graft unavailable)' };
export const TARGET_HEIGHT = 1.85;   // m · door 2.35–2.90 m · floor 3.0 m (wd1-city FACADE_RULE)
export const PROFILE_ID = 'kfb.locomotion-profile-set/0.1#world-consumer';
const MB = 'MovementBasic', MA = 'MovementAdvanced', GE = 'General';

/* Canonical role/clip truth comes from the tested ToolBox r2 consumer contract.
   World re-measures the selected clips on its own actor/scale; it does not redefine semantic clip truth. */
const CYCLIC_ROLES = new Set(['walk','run','sprint','backward','strafe.left','strafe.right','crouch','sneak','crawl']);
const BASE_ROLES = ['idle','walk','run','sprint','backward','strafe.left','strafe.right','jump.start','jump.air','jump.land','crouch','sneak','crawl'];
const PACK_ORDER = ['General','MovementBasic','MovementAdvanced'];
const CANON = Object.fromEntries(BASE_ROLES.map((role) => {
  const p = TOOLBOX_PROFILE.roles[role];
  if (!p || !p.clip) throw new Error('ToolBox locomotion role missing: ' + role);
  return [role, { src: PACK_ORDER.map((pack) => [pack, p.clip]), loop: p.loop !== false, cyc: CYCLIC_ROLES.has(role), profile:p }];
}));
/* Only consumer-control tiers remain local. */
export const VARIANTS = {
  'walk.fast': { of:'walk', rate:+(TOOLBOX_PROFILE.roles['walk.fast']?.rate || 1.3), note:'ToolBox profile playback-rate variant of walk' },
  'backward.fast': { of:'backward', rate:1.45, note:'World consumer tuning · no shared backward.fast role yet' },
  'strafe.walk': { of:'strafe', rate:0.72, note:'World consumer tuning · no shared walking-strafe role yet' }
};
export const STATES = Object.keys(CANON);
export const SETS = {
  kaykit: {},
  'kaykit-b': { idle: [['General','Idle_B']], walk: [['MovementBasic','Walking_B']], run: [['MovementBasic','Running_B']] },
  'kaykit-c': { walk: [['MovementBasic','Walking_C']] },
  kfb: { idle: [['kfb','kfb_idle_breathing_a']], run: [['kfb','kfb_locomotion_run_forward_a']], backward: [['kfb','kfb_locomotion_walk_backward_a']] }
};
export const SET_LABEL = { kaykit:'ToolBox KayKit canonical profile @' + TOOLBOX_PROFILE_PIN.slice(0,8), 'kaykit-b':'KayKit alt B', 'kaykit-c':'KayKit alt C', kfb:'KFB Motion Library alt set + ToolBox canon fallback' };
export const DEFAULT_SET = 'kaykit';
const LEGACY_SET = { 'kaykit-a':'kaykit' };
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
/* Binding rule = KFB Animation Lab v4 (player.js retarget + ground.js fitHips), read not re-invented:
   rotations everywhere, translations only on root/hips/pelvis, scale never. ONE hips factor per rig from Idle. */
const POSOK = /^(root|hips|pelvis|armature)$/i;
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

/* Contact facts of an in-place cycle: each foot's ground-contact frames (lowest 3 cm), the planted-foot
   sweep (body travel needed for the planted foot to stay put) as a VECTOR in holder space (+z forward),
   left-foot touchdown phase (for phase-synced crossfades) and a double-support hold frame. */
function measureStance(holder, figure, clip) {
  const fl = boneOf(figure, /^foot[._]?l$/i) || boneOf(figure, /foot.*l|l.*foot/i), fr = boneOf(figure, /^foot[._]?r$/i) || boneOf(figure, /foot.*r|r.*foot/i);
  const feet = [fl, fr].filter(Boolean), hips = boneOf(figure, /^hips$/i);
  if (!feet.length || !hips) return null;
  const mixer = new THREE.AnimationMixer(figure), a = mixer.clipAction(clip); a.play();
  const N = Math.max(40, Math.round(clip.duration * 90)), T = clip.duration, S = feet.map(() => []), v = new THREE.Vector3();
  const inv = new THREE.Matrix4();
  let hipY = 0;
  for (let i = 0; i <= N; i++) {
    mixer.setTime(T * i / N); holder.updateMatrixWorld(true); inv.copy(holder.matrixWorld).invert();
    feet.forEach((f, k) => { f.getWorldPosition(v).applyMatrix4(inv); S[k].push([v.x, v.y, v.z]); });
    hipY += hips.getWorldPosition(v).applyMatrix4(inv).y / (N + 1);
  }
  a.stop(); mixer.uncacheRoot(figure);
  const dt = T / N; let sx = 0, sz = 0, cnt = 0, contact = 0, total = 0; const mins = [];
  for (const s of S) {
    const minY = Math.min(...s.map((p) => p[1])), thr = minY + 0.03; mins.push(minY);
    for (let i = 0; i < s.length - 1; i++) {
      total++;
      if (s[i][1] > thr || s[i + 1][1] > thr) continue;
      contact++; cnt++;
      sx -= (s[i + 1][0] - s[i][0]) / dt; sz -= (s[i + 1][2] - s[i][2]) / dt;   // body travel = −(planted foot velocity)
    }
  }
  const mx = cnt ? sx / cnt : 0, mz = cnt ? sz / cnt : 0, speed = Math.hypot(mx, mz);
  /* residual skate intrinsic to the SOURCE clip: per contact span, the planted foot's drift after the body
     travels at the measured speed. A clip with sliding feet in its own authoring cannot be fixed by speed. */
  let resD = 0, resT = 0;
  for (const s of S) {
    const minY = Math.min(...s.map((p) => p[1])), thr = minY + 0.03; let i0 = -1;
    for (let i = 0; i <= s.length; i++) {
      const inC = i < s.length && s[i][1] <= thr;
      if (inC && i0 < 0) i0 = i;
      if (!inC && i0 >= 0) { const i1 = i - 1, T1 = (i1 - i0) * dt; if (T1 > 0.08) { resD += Math.hypot(s[i1][0] - s[i0][0] + mx * T1, s[i1][2] - s[i0][2] + mz * T1); resT += T1; } i0 = -1; }
    }
  }
  /* left-foot touchdown = first contact frame after a swing */
  let l0 = 0; { const s = S[0], thr = mins[0] + 0.03; for (let i = 1; i < s.length; i++) if (s[i][1] <= thr && s[i - 1][1] > thr) { l0 = i / N; break; } }
  /* hold frame for a paused posture: both feet lowest */
  let hold = 0, best = Infinity; for (let i = 0; i <= N; i++) { let q = 0; S.forEach((s, k) => { q += s[i][1] - mins[k]; }); if (q < best) { best = q; hold = i / N; } }
  return { speed: r3(speed), dirDeg: r3(Math.atan2(mx, mz) * 180 / Math.PI), dir: [r3(speed ? mx / speed : 0), r3(speed ? mz / speed : 1)], contactShare: r3(contact / Math.max(1, total)), hipY: r3(hipY), cycle: r3(T), strideM: r3(speed * T), residualSkateMs: r3(resT ? resD / resT : 0), leftTouchdown: r3(l0), holdPhase: r3(hold), inPlace: speed < 0.12 };
}

export async function makeActor({ scene, camera, log = () => {} }) {
  const loader = new GLTFLoader();
  const holder = new THREE.Group(); holder.name = 'player'; scene.add(holder);
  const R = { actor: null, height: null, graft: null, face: null, clips: {}, measured: {}, gaps: [], sources: {}, inventory: {} };
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

  const [kfb, gen, mov, adv] = await Promise.all([loadAnims(loader, RAW(KFB_LIB.path, KFB_LIB.commit)), loadAnims(loader, RAW(KAYKIT.dir + 'Rig_Medium_General.glb', KAYKIT.commit)), loadAnims(loader, RAW(KAYKIT.dir + 'Rig_Medium_MovementBasic.glb', KAYKIT.commit)), loadAnims(loader, RAW(KAYKIT.dir + 'Rig_Medium_MovementAdvanced.glb', KAYKIT.commit))]);
  const packs = { kfb, General: gen, MovementBasic: mov, MovementAdvanced: adv };
  for (const [p, l] of Object.entries(packs)) R.inventory[p] = l ? l.map((c) => c.name) : null;
  Object.assign(R.sources, { toolboxProfile: TOOLBOX_PROFILE_URL, kaykit: 'KayKit_Character_Animations_1.1 Rig_Medium @' + KAYKIT.commit.slice(0, 12), kfb: kfb ? KFB_LIB.path + ' @' + KFB_LIB.commit : 'n/a' });
  const mixer = new THREE.AnimationMixer(figure);
  let actions = {}, clips = {}, setName = null;

  function bindSet(name) {
    name = LEGACY_SET[name] || name;
    const over = SETS[name] || SETS[DEFAULT_SET];
    mixer.stopAllAction(); for (const c of Object.values(clips)) mixer.uncacheClip(c);
    actions = {}; clips = {}; R.clips = {}; R.measured = {}; R.gaps = []; setName = SETS[name] ? name : DEFAULT_SET;
    let rigFactor = null;
    for (const st of STATES) {
      const def = CANON[st], plan = over[st] || def.src;
      let hit = null;
      for (const [pack, want] of plan) {
        const list = packs[pack]; if (!list) continue;
        const c = list.find((x) => x.name === want);
        if (c) { hit = { pack: pack === 'kfb' ? 'KFB Motion Library' : 'KayKit 1.1 ' + pack, clip: c }; break; }
      }
      if (!hit && over[st]) for (const [pack, want] of def.src) { const c = (packs[pack] || []).find((x) => x.name === want); if (c) { hit = { pack: 'KayKit 1.1 ' + pack, clip: c }; R.gaps.push(st + ' → canon ' + want + ' (alt set clip missing)'); break; } }
      if (!hit) { R.gaps.push(st + ' · no source clip'); continue; }
      const rt = retarget(hit.clip, figure, rigFactor);
      if (st === 'idle') rigFactor = rt.hipsFactor;
      let clip = rt.clip, travelRig = 0;
      if (def.cyc) { const sr = stripRootMotion(clip); clip = sr.clip; travelRig = sr.travelRig; }
      clips[st] = clip;
      const a = actions[st] = mixer.clipAction(clip);
      if (!def.loop) { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; }
      R.clips[st] = { source: hit.pack, name: hit.clip.name, dur: r3(clip.duration), bound: rt.matched + '/' + rt.total, hipsFactor: rt.hipsFactor, rootTravelRig: r3(travelRig), loop: def.loop ? 'repeat' : 'once' };
    }
    for (const st of STATES) if (CANON[st].cyc && clips[st]) {
      const m = measureStance(holder, figure, clips[st]);
      if (m) R.measured[st] = { ...m, method: 'planted-foot sweep ÷ contact time (holder space, +z forward)' };
    }
    R.motionSet = setName; cur = null; curState = null;
    play('idle', 1, 0);
    log('motion set · ' + SET_LABEL[setName] + ' · ' + STATES.map((q) => q + ' ' + (R.clips[q] ? R.clips[q].name : '—')).join(' · '));
    log('planted-foot sweep · ' + Object.entries(R.measured).map(([q, m]) => q + ' ' + m.speed + ' m/s @' + m.dirDeg + '°' + (m.inPlace ? ' in-place' : '')).join(' · '));
  }

  /* one crossfade at a time, weights sum to 1. Cyclic → cyclic transitions are PHASE-SYNCED on the
     left-foot touchdown, so the new clip picks up the stride where the old one was (no foot pop). */
  let cur = null, curState = null;
  const phaseOf = (st, a) => { const m = R.measured[st]; return ((a.time / a.getClip().duration) - (m ? m.leftTouchdown : 0) + 1) % 1; };
  function play(st, ts = 1, fade = 0.16, restart = false, opts = {}) {
    const a = actions[st] || (st === 'jump.air' ? actions['jump.start'] : null) || actions.idle; if (!a) return;
    if (a !== cur || restart) {
      if (a === cur) { a.reset(); a.setEffectiveTimeScale(ts); a.setEffectiveWeight(1); a.play(); curState = st; return; }      const prevState = curState, prev = cur;
      for (const x of Object.values(actions)) if (x !== a && x !== cur) x.stop();
      a.reset(); a.enabled = true; a.setEffectiveTimeScale(ts);
      if (opts.hold != null) a.time = opts.hold * a.getClip().duration;
      else if (prev && CANON[st] && CANON[st].cyc && CANON[prevState] && CANON[prevState].cyc && R.measured[st]) {
        const ph = phaseOf(prevState, prev); a.time = (((ph + R.measured[st].leftTouchdown) % 1) * a.getClip().duration);
      }
      a.play();
      if (prev && fade > 0) a.crossFadeFrom(prev, fade, false); else { if (prev) prev.stop(); a.setEffectiveWeight(1); }
      cur = a;
    } else { if (opts.hold != null) a.time = opts.hold * a.getClip().duration; a.setEffectiveTimeScale(ts); }
    curState = st;
  }
  bindSet((window.__wb2dProps || {}).motionSet || DEFAULT_SET);
  log('actor · ' + R.actor + ' · ' + TARGET_HEIGHT + ' m (rig ' + R.height.rawRig + ' × ' + R.height.scale + ')');

  return {
    holder, body, figure, graft, mixer, report: R,
    get actions() { return actions; }, get clips() { return clips; }, get motionSet() { return setName; },
    setMotionSet(name) { name = LEGACY_SET[name] || name; if (name !== setName) bindSet(name); },
    get state() { return curState; },
    measured(st) { return R.measured[st] || null; },
    native(st) { return R.measured[st] ? R.measured[st].speed : null; },
    play,
    update(dt) {
      mixer.update(dt);
      if (graft) { try { graft.update(dt, camera); } catch (e) { /* face rig is optional */ } }
    }
  };
}
