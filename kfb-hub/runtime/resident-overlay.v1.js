// KFB Hub · Resident Overlay v1.1 (Design-Kandidat)
// v1.1: oberste Ebene (z-index max, eigene Stacking-Isolation), großzügige Bühne gegen Randabschnitt,
//       nur die Figurfläche fängt Klicks, echter three.js-Schlagschatten (ShadowMaterial) statt Kreis.
// Ein KFB-Actor schwebt als eigene Ebene über dem Hub. Klick = zufälliger Clip, Ziehen = verschieben.
// Actor-Rezepte und Asset-Pins 1:1 aus kfb-hub/stage/toolbox/kaykit-motion-lab-v1/lab.mjs (cloudflare-live, PIN unten).
// Kein eigener Actor-/Animations-Owner: FrizzleBob läuft über mountGraft(animation:'host'), die anderen direkt als KayKit-GLB.
const PIN = 'bdaea0648f27c0f16e0a737bfba237eb54dd4cbb';
const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + PIN + '/';
const CDN = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@' + PIN + '/';
const THREE_URL = 'https://esm.sh/three@0.160.0';
const GLTF_URL = 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
const enc = p => p.split('/').map(encodeURIComponent).join('/');
const raw = p => RAW + enc(p);

const LIBS = {
  medium: ['media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_General.glb',
           'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb'],
  large:  ['media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Large/Rig_Large_General.glb',
           'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Large/Rig_Large_MovementBasic.glb']
};
export const ACTORS = [
  { id: 'frizzlebob', label: 'FrizzleBob · Driver Graft', family: 'medium', adapter: 'graft' },
  { id: 'gothgirl', label: 'GothGirl', family: 'medium', adapter: 'direct', model: 'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb' },
  { id: 'blackknight', label: 'Black Knight', family: 'large', adapter: 'direct', model: 'media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/characters/BlackKnight.glb' }
];
export const SOURCE = { pin: PIN, donor: 'kfb-hub/stage/toolbox/kaykit-motion-lab-v1/lab.mjs@cloudflare-live' };

const POS_KEY = 'kfb.hub.resident.pos.v1';
const NOT_ON_CLICK = /t-?pose|walking|running|idle|jump_loop|jump_idle|_pose$|jump_start|jump_land/i;
let T = null, Loader = null;
const libCache = {};
let graftMod = null, graftContract = null;

async function ensureLibs() {
  if (!T) { T = await import(THREE_URL); Loader = (await import(GLTF_URL)).GLTFLoader; }
}
async function library(loader, family) {
  if (!libCache[family]) libCache[family] = Promise.all(LIBS[family].map(p => loader.loadAsync(raw(p)))).then(gs => {
    const m = new Map(); gs.forEach(g => (g.animations || []).forEach(c => { if (!m.has(c.name)) m.set(c.name, c); })); return m;
  });
  return libCache[family];
}
function names(root) { const s = new Set(); root.traverse(n => { if (n.name) s.add(n.name); }); return s; }
function cleanClip(THREE, root, clip) {
  const ns = names(root), tracks = [];
  for (const t of clip.tracks || []) {
    let p = null; try { p = THREE.PropertyBinding.parseTrackName(t.name); } catch (e) {}
    if (!p || !p.nodeName || !ns.has(p.nodeName)) continue;
    if (p.propertyName === 'position' && /^(root|hips)$/i.test(p.nodeName)) continue;
    tracks.push(t.clone());
  }
  return new THREE.AnimationClip(clip.name, clip.duration, tracks, clip.blendMode);
}

export async function mountResidentOverlay({ actorId = 'frizzlebob', onState = () => {} } = {}) {
  await ensureLibs();
  const THREE = T;
  // Großzügige Bühne um die Figur: Sprünge, Würfe und Death-Clips bleiben im Bild statt am Canvasrand abgeschnitten.
  const W = 400, H = 480, HIT_W = 150, HIT_H = 230;
  let pos = null; try { pos = JSON.parse(localStorage.getItem(POS_KEY) || 'null'); } catch (e) {}
  const box = document.createElement('div');
  box.setAttribute('aria-label', 'Resident-Overlay · Klick spielt einen zufälligen Clip, Ziehen verschiebt');
  box.title = 'Klick: zufälliger Clip · Ziehen: verschieben';
  Object.assign(box.style, { position: 'fixed', width: W + 'px', height: H + 'px', zIndex: 2147483000, pointerEvents: 'none', userSelect: 'none', isolation: 'isolate' });
  const hit = document.createElement('div');
  hit.title = box.title;
  Object.assign(hit.style, { position: 'absolute', left: ((W - HIT_W) / 2) + 'px', top: (H * 0.62 - HIT_H) + 'px', width: HIT_W + 'px', height: HIT_H + 'px', pointerEvents: 'auto', touchAction: 'none', cursor: 'grab', zIndex: 1 });
  const place = (x, y) => {
    const mx = (W - HIT_W) / 2, my = H * 0.62 - HIT_H;
    const nx = Math.max(-mx, Math.min(innerWidth - W + mx, x)), ny = Math.max(-my, Math.min(innerHeight - H * 0.66, y));
    box.style.left = nx + 'px'; box.style.top = ny + 'px'; return { x: nx, y: ny };
  };
  pos = place(pos ? pos.x : innerWidth - W + 40, pos ? pos.y : innerHeight - H * 0.7);
  document.body.appendChild(box);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  box.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.pointerEvents = 'none';
  box.appendChild(hit);

  const scene = new THREE.Scene();
  // Licht: steil von oben-vorne-links → echter Schlagschatten fällt kurz nach hinten-rechts auf die unsichtbare Bodenebene.
  scene.add(new THREE.HemisphereLight(0xfff6e8, 0x6a5d4c, 1.55));
  const sun = new THREE.DirectionalLight(0xffefd4, 2.1);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02; sun.shadow.radius = 4;
  scene.add(sun); scene.add(sun.target);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShadowMaterial({ color: 0x2a2118, opacity: 0.22 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const camera = new THREE.PerspectiveCamera(28, W / H, 0.01, 100);
  const loader = new Loader();

  let holder = null, figure = null, mixer = null, extra = null, disposeActor = null, clips = {}, pool = [], idle = null, cur = null, last = null, token = 0, alive = true;
  const emit = s => { try { onState(s); } catch (e) {} };

  function clear() {
    try { mixer && mixer.stopAllAction(); } catch (e) {}
    try { disposeActor && disposeActor(); } catch (e) {}
    if (holder) scene.remove(holder);
    holder = figure = mixer = extra = disposeActor = idle = cur = null; clips = {}; pool = [];
  }
  function fit() {
    holder.updateMatrixWorld(true);
    const b = new THREE.Box3().setFromObject(holder);
    if (Number.isFinite(b.min.y)) holder.position.y -= b.min.y;
    holder.updateMatrixWorld(true);
    const bb = new THREE.Box3().setFromObject(holder), size = bb.getSize(new THREE.Vector3()), c = bb.getCenter(new THREE.Vector3());
    const h = Math.max(size.y, 0.5);
    // Figur füllt ~45 % der Bühnenhöhe; Füße bei ~62 % von oben, darüber Luft für Sprünge.
    const halfV = h * 1.1, dist = halfV / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const lookY = bb.min.y + h * 0.26;
    camera.position.set(c.x + dist * 0.28, lookY + h * 0.35, c.z + dist);
    camera.lookAt(c.x, lookY, c.z);
    ground.position.set(c.x, bb.min.y + 0.001, c.z);
    ground.scale.setScalar(h * 6);
    sun.position.set(c.x - h * 1.1, bb.min.y + h * 4.2, c.z + h * 2.2);
    sun.target.position.set(c.x, bb.min.y, c.z);
    const sc = sun.shadow.camera, e = h * 1.6;
    sc.left = -e; sc.right = e; sc.top = e; sc.bottom = -e; sc.near = 0.1; sc.far = h * 12; sc.updateProjectionMatrix();
  }
  function loopIdle(fade) {
    if (!idle) return;
    const a = mixer.clipAction(idle, figure); a.reset(); a.setLoop(THREE.LoopRepeat, Infinity); a.enabled = true; a.setEffectiveWeight(1);
    if (cur && cur !== a && fade) { a.play(); cur.crossFadeTo(a, fade, false); } else a.play();
    cur = a;
  }
  function play(name) {
    const c = clips[name]; if (!c || !mixer) return null;
    const a = mixer.clipAction(c, figure); a.reset(); a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; a.enabled = true; a.setEffectiveWeight(1); a.play();
    if (cur && cur !== a) cur.crossFadeTo(a, 0.18, false);
    cur = a; last = name; emit({ phase: 'ready', actor: actorId, clip: name, clips: pool.length });
    return name;
  }
  function random() {
    if (!pool.length) return null;
    let n = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1) while (n === last) n = pool[Math.floor(Math.random() * pool.length)];
    return play(n);
  }

  async function setActor(id) {
    const cfg = ACTORS.find(a => a.id === id) || ACTORS[0];
    actorId = cfg.id; const my = ++token; clear();
    emit({ phase: 'loading', actor: cfg.id });
    try {
      const lib = await library(loader, cfg.family);
      if (my !== token) return;
      holder = new THREE.Group(); scene.add(holder);
      if (cfg.adapter === 'graft') {
        if (!graftMod) graftMod = await import(CDN + 'tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js');
        if (!graftContract) graftContract = await fetch(CDN + 'tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json').then(r => { if (!r.ok) throw Error('graft contract ' + r.status); return r.json(); });
        const pet = graftMod.pickGraftPet(graftContract, 'graft-driver');
        const g = await graftMod.mountGraft({ THREE, loader, parent: holder, pet, lib: graftContract, camera, animation: 'host', poseOverClip: false, override: { graft: { weapon: { on: false } }, pose: { on: false } }, log: () => {} });
        if (my !== token) { try { g.dispose(); } catch (e) {} return; }
        figure = g.figure; extra = dt => g.update(dt, camera); disposeActor = () => g.dispose();
      } else {
        const gl = await loader.loadAsync(raw(cfg.model));
        if (my !== token) return;
        figure = gl.scene; holder.add(figure);
      }
      holder.traverse(n => { if (n.isMesh || n.isSkinnedMesh) { n.castShadow = true; n.receiveShadow = false; } });
      mixer = new THREE.AnimationMixer(figure);
      mixer.addEventListener('finished', e => { if (e.action === cur) loopIdle(0.25); });
      const ns = names(figure);
      for (const [n, c] of lib) {
        if ((c.tracks || []).some(t => { try { const p = THREE.PropertyBinding.parseTrackName(t.name); return p.nodeName && ns.has(p.nodeName); } catch (e) { return false; } }))
          clips[n] = cleanClip(THREE, figure, c);
      }
      idle = clips.Idle_A || clips.Idle_B || null;
      pool = Object.keys(clips).filter(n => !NOT_ON_CLICK.test(n));
      fit(); loopIdle(0);
      emit({ phase: 'ready', actor: cfg.id, clip: idle ? idle.name : null, clips: pool.length });
    } catch (e) {
      if (my !== token) return;
      emit({ phase: 'error', actor: cfg.id, error: String((e && e.message) || e) });
    }
  }

  let down = null;
  hit.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, ox: pos.x, oy: pos.y, moved: false }; hit.setPointerCapture(e.pointerId); hit.style.cursor = 'grabbing'; });
  hit.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (!down.moved && Math.hypot(dx, dy) > 5) down.moved = true;
    if (down.moved) pos = place(down.ox + dx, down.oy + dy);
  });
  hit.addEventListener('pointerup', () => {
    if (!down) return; hit.style.cursor = 'grab';
    if (down.moved) { try { localStorage.setItem(POS_KEY, JSON.stringify(pos)); } catch (e) {} } else random();
    down = null;
  });
  const onResize = () => { pos = place(pos.x, pos.y); };
  addEventListener('resize', onResize);

  const clock = new THREE.Clock(); let raf = 0;
  const tick = () => {
    if (!alive) return; raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, clock.getDelta());
    if (document.hidden) return;
    try { mixer && mixer.update(dt); extra && extra(dt); } catch (e) {}
    renderer.render(scene, camera);
  };
  tick();
  await setActor(actorId);
  window.__KFB_HUB_RESIDENT__ = { get actor() { return actorId; }, get clip() { return last; }, get clips() { return pool.slice(); }, get ready() { return !!mixer; }, random, play, source: SOURCE };

  return {
    setActor, play, random,
    get clipNames() { return pool.slice(); },
    dispose() { alive = false; delete window.__KFB_HUB_RESIDENT__; cancelAnimationFrame(raf); token++; clear(); removeEventListener('resize', onResize); try { renderer.dispose(); } catch (e) {} box.remove(); }
  };
}
