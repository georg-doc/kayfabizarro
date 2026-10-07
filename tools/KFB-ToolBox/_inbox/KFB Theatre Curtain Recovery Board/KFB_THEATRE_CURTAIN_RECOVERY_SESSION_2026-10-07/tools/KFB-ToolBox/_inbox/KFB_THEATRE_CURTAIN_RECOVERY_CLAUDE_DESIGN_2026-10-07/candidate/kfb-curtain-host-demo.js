/* KFB Theatre Curtain · demo HOST (stand-in for the later runtime owner) · 2026-10-07 · Issue #372
   Everything here is host-side: renderer, camera, lights, environment, actors, world stand-in, loading facts, input.
   Curtain Core (kfb-curtain-core.js) is only consumed through its contract. */
import * as THREE from 'three/webgpu';
import { uv, mix, color, smoothstep, float } from 'three/tsl';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
import { createTheatreCurtain, createFallbackCurtain, isSupported, DIM } from './kfb-curtain-core.js';

const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
const gh = (commit, path) => 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@' + commit + '/' + enc(path);
const raw = (commit, path) => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + commit + '/' + enc(path);
const ATLAS_PIN = '2c92dd13cbc379ad3a6028144b8976bb3d6a840d', LOCO_PIN = 'b97b5ac55df2724fae623992433685583eece51e';
const ANIM = 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/';
export const ROSTER = [
  { id: 'player.frizzlebob-v5b', name: 'FrizzleBob', rig: 'Rig_Medium', commit: '93abbf22d14335e517cac75cc79bf2022af45ee3', path: 'tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5b.glb', height: 1.02, idle: [LOCO_PIN, ANIM + 'Rig_Medium/Rig_Medium_General.glb'], note: '@93abbf22 (J17 pin) · SOURCE_PIN_RECONCILE still open' },
  { id: 'player.black-knight', name: 'Black Knight', rig: 'Rig_Large', commit: ATLAS_PIN, path: 'media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/characters/BlackKnight.glb', height: 1.28, idle: [LOCO_PIN, ANIM + 'Rig_Large/Rig_Large_General.glb'], note: 'Rig_Large · idle only' },
];
const FALLBACK = { id: 'qa.combat-mech', name: 'Combat Mech', rig: 'Rig_Medium', commit: ATLAS_PIN, path: 'media/3D_Assets/KayKit_Mystery_Series6/1 - July 2024 - Combat Mech/characters/CombatMech.glb', height: 1.15, idle: [LOCO_PIN, ANIM + 'Rig_Medium/Rig_Medium_General.glb'], note: 'source-proven fallback (Resident Atlas)' };

const CAMS = {
  loading: { pos: [0, 0.18, -5.4], at: [0, 0.12, 0], fov: 38 },
  select: { pos: [0, -0.12, -4.5], at: [0, -0.3, -0.5], fov: 38 },
  reveal: { pos: [0, 0.18, -5.4], at: [0, 0.12, 0], fov: 38 },
  detail: { pos: [0.55, 0.35, -2.1], at: [0.25, 0.25, 0], fov: 36 },
};

export async function mount(el, opts = {}) {
  const emit = opts.onChange || (() => {});
  const S = { mode: opts.mode || 'loading', actorIdx: 0, actor: null, actorReady: false, actorLoading: false, progress: 0, items: 0, done: 0, curtainState: 'closed_rest', err: null, supported: isSupported() };
  const push = () => emit({ ...S, actorName: S.actor ? S.actor.def.name : (ROSTER[S.actorIdx] || {}).name, actorRig: S.actor ? S.actor.def.rig : (ROSTER[S.actorIdx] || {}).rig, actorNote: S.actor ? S.actor.def.note : '', openness: curtain && curtain.openness, material: curtain && curtain.material });
  if (!S.supported) { S.curtainState = 'fallback_reveal'; push(); return { fallback: true, dispose() {} }; }

  const renderer = new THREE.WebGPURenderer({ antialias: true, requiredLimits: { maxStorageBuffersInVertexStage: 1 } });
  await renderer.init();
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  el.appendChild(renderer.domElement);
  Object.assign(renderer.domElement.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });

  const scene = new THREE.Scene(); scene.background = new THREE.Color('#060404');
  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 40);
  const setCam = (m) => { const c = CAMS[m]; camera.position.set(...c.pos); camera.fov = c.fov; camera.lookAt(new THREE.Vector3(...c.at)); camera.updateProjectionMatrix(); };

  const curtain = createTheatreCurtain({ material: opts.material || 'P', hardware: opts.hardware || 'pelmet', tieback: !!opts.tieback });
  scene.add(curtain.group);
  curtain.onState((s) => { S.curtainState = s; push(); });

  // host lights (recommended stage rig; the core does not require them)
  const key = new THREE.SpotLight('#ffe0c2', 55, 14, 0.42, 0.65, 1.6);
  key.position.set(0.7, 3.4, -4.4); key.target.position.set(0, -0.1, 0); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.0004;
  scene.add(key, key.target);
  const rim = new THREE.SpotLight('#9fb3ff', 14, 10, 0.6, 0.8, 1.5); rim.position.set(-2.6, 2.6, -2.2); rim.target.position.set(0, 0, 0); scene.add(rim, rim.target);
  // world stand-in behind the curtain (host content, not part of the module)
  const world = new THREE.Group(); world.name = 'host-world-standin'; scene.add(world);
  const sky = new THREE.MeshBasicNodeMaterial(); sky.colorNode = mix(color('#e59a5c'), color('#2b3a66'), smoothstep(0.05, 0.9, uv().y));
  const back = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 3.6), sky); back.position.set(0, DIM.floorY + 1.7, 1.9); back.rotation.y = Math.PI; world.add(back);
  const inner = new THREE.SpotLight('#fff1dc', 40, 8, 0.5, 0.7, 1.6); inner.position.set(0, 2.4, 0.2); inner.target.position.set(0, DIM.floorY, 0.75); inner.castShadow = true; world.add(inner, inner.target);

  const loader = new GLTFLoader();
  const track = (pr) => { S.items++; push(); return pr.then((r) => { S.done++; S.progress = S.done / S.items; curtain.setFootlights(0.18 + 0.82 * S.progress); push(); return r; }); };
  curtain.setFootlights(0.18);

  // critical bundle: environment + default actor (real loads, real progress)
  curtain.setHostFacts({ loadingReady: false, selectedActorReady: false, revealAllowed: false });
  const hdrP = track(new UltraHDRLoader().setPath('https://threejs.org/examples/textures/equirectangular/').loadAsync('royal_esplanade_2k.hdr.jpg').then((t) => {
    t.mapping = THREE.EquirectangularReflectionMapping; scene.environment = t; scene.environmentIntensity = 0.42; scene.environmentRotation.set(0, 1.9, 0);
  }).catch(() => {}));

  const cache = new Map();
  async function loadActor(def) {
    if (cache.has(def.id)) return cache.get(def.id);
    const pr = (async () => {
      let g; try { g = await loader.loadAsync(gh(def.commit, def.path)); def.via = 'jsdelivr'; } catch (e) { g = await loader.loadAsync(raw(def.commit, def.path)); def.via = 'raw'; }
      const root = g.scene; root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      const box = new THREE.Box3().setFromObject(root), size = box.getSize(new THREE.Vector3()), s = def.height / size.y;
      const holder = new THREE.Group(); holder.name = 'actor:' + def.id; root.scale.setScalar(s); root.position.y = -box.min.y * s; holder.add(root);
      const mixer = new THREE.AnimationMixer(root);
      try { const a = await loader.loadAsync(gh(def.idle[0], def.idle[1])); const clip = a.animations.find((c) => /^Idle/i.test(c.name)) || a.animations[0]; if (clip) mixer.clipAction(clip).play(); } catch (e) { /* idle optional */ }
      return { def, holder, mixer };
    })();
    cache.set(def.id, pr); return pr;
  }
  async function selectActor(i) {
    S.actorIdx = (i + ROSTER.length) % ROSTER.length; S.actorReady = false; S.actorLoading = true; push();
    curtain.setHostFacts({ selectedActorReady: false, revealAllowed: false });
    let a; try { a = await loadActor(ROSTER[S.actorIdx]); } catch (e) { try { a = await loadActor(FALLBACK); } catch (e2) { S.err = 'actor load failed'; } }
    if (S.actor) world.remove(S.actor.holder), scene.remove(S.actor.holder);
    S.actor = a || null; S.actorLoading = false; S.actorReady = !!a;
    placeActor();
    curtain.setHostFacts({ selectedActorReady: S.actorReady, revealAllowed: S.actorReady && S.loadingReady });
    push();
  }
  function placeActor() {
    if (!S.actor) return; const h = S.actor.holder;
    if (S.mode === 'select') { scene.add(h); h.position.set(0, DIM.floorY, -0.85); }
    else { world.add(h); h.position.set(0, DIM.floorY, 0.75); }
    h.rotation.y = Math.PI;
  }

  curtain.warmup(renderer, 900);
  setCam(S.mode);
  const resize = () => { const w = el.clientWidth || 1, h = el.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(el); resize();

  let mirror = null, last = performance.now();
  function frame(dt) {
    curtain.update(renderer, dt);
    if (S.actor) S.actor.mixer.update(dt);
    renderer.render(scene, camera);
    if (mirror) { const c = renderer.domElement; if (mirror.width !== c.width) { mirror.width = c.width; mirror.height = c.height; } mirror.getContext('2d').drawImage(c, 0, 0); }
  }
  renderer.setAnimationLoop(() => { const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; frame(dt); });

  const actorP = track(selectActor(0));
  Promise.all([hdrP, actorP]).then(() => { S.loadingReady = true; curtain.setHostFacts({ loadingReady: true, revealAllowed: S.actorReady }); push(); });

  const api = {
    curtain, scene, camera, renderer, S,
    setMode(m) { S.mode = m; setCam(m); placeActor(); if (m === 'reveal') { curtain.snap(true); } else { curtain.snap(false); } push(); },
    enter() { if (S.mode !== 'reveal') curtain.requestReveal(); },
    cover() { curtain.cover(); }, reveal() { curtain.requestReveal(); }, impact() { curtain.impact(1); },
    next() { if (S.mode === 'select') selectActor(S.actorIdx + 1); }, prev() { if (S.mode === 'select') selectActor(S.actorIdx - 1); },
    setCamera(m) { setCam(m); },
    setMaterial(k) { curtain.setMaterial(k); push(); }, setHardware(k) { curtain.setHardware(k); push(); }, setTieback(b) { curtain.setTieback(b); },
    /* evidence: deterministic frame stepping at 1/60 s + 2D mirror so DOM screenshots can read the WebGPU canvas */
    advance(n, mirrorCanvas) { if (mirrorCanvas) mirror = mirrorCanvas; for (let i = 0; i < n; i++) frame(1 / 60); last = performance.now(); },
    /* evidence only: freeze the loading composition at a given real-progress fraction (covered_wait) */
    holdLoading(frac) { S.loadingReady = false; S.done = Math.round(frac * S.items); curtain.setFootlights(0.18 + 0.82 * frac); curtain.setHostFacts({ loadingReady: false, revealAllowed: false }); push(); },
    releaseLoading() { S.loadingReady = true; S.done = S.items; curtain.setFootlights(1); curtain.setHostFacts({ loadingReady: true, revealAllowed: S.actorReady }); push(); },
    dispose() { renderer.setAnimationLoop(null); ro.disconnect(); renderer.dispose(); renderer.domElement.remove(); },
  };
  push();
  return api;
}
