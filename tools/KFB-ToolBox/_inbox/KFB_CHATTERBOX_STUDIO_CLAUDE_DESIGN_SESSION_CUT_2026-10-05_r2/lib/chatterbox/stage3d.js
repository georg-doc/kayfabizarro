/* KFB ChatterBox Studio · 3D-Bühne (stage3d v0.2, 2026-10-05)
   PRESENTATION ONLY. Echte Resident-GLBs aus dem Repo (gepinnt wie lib/atlas.js), geteilte KayKit-Rig_Medium-Clips.
   Liefert pro Bild die projizierten Kopfanker (Pixel im Host) an den Aufrufer; Blasen/Wörter bleiben DOM-Overlay
   (Muster aus PetStudio bubble.v1.js: Anker = projizierter Kopf, Blase = DOM) → Blasen folgen jeder Kameralage.
   v0.2: freie Orbit-Kamera (Zoom zum Cursor) · KFB-Schattenvertrag (kfb-shadow.js, Akne-Fix) · ein Idle für alle (Idle_A)
   · Goth Girl · optionale Signatur-Props je Cast-Eintrag · Kopf-Blick additiv nach dem Mixer · Card als 3D-Objekt. */
import * as THREE from 'https://esm.sh/three@0.184.0';
import { GLTFLoader } from 'https://esm.sh/three@0.184.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://esm.sh/three@0.184.0/examples/jsm/controls/OrbitControls.js';
import { clone as skinClone } from 'https://esm.sh/three@0.184.0/examples/jsm/utils/SkeletonUtils.js';
import { makeKfbShadow } from './kfb-shadow.js';

const REPO = 'georg-doc/kayfabizarro';
const PIN = { assets: '891eadf01e218f5fc21387e64cea1fec8332c5b6', anims: 'aa16a777a970f23d3f11fb3c23dc40718b04fa88' };
const raw = (c, p) => `https://raw.githubusercontent.com/${REPO}/${c}/${p.split('/').map(encodeURIComponent).join('/')}`;
const P = 'media/3D_Assets/KayKit_Mystery_Series6/';
const CL = P + '11 - May 2024 - Clown/', WI = P + '5 - November 2024 - Witch/', GG = P + 'GothGirl/';
const ANIM = 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_';
/* Gleiche Pfade wie data/cast.js (Resident Atlas). Ein Idle für alle (Georg 05.10.: Clown lief auf Idle_B, Caveman auf Melee-Idle).
   props: nur geladen, wenn der Cast-Eintrag props:true trägt. Lagen p = [x, z] lokal, r = Grad, aus data/cast.js. */
const IDLE = /^Idle_A$/;
export const RESIDENTS = {
  host:     { a: CL + 'characters/Clown.glb', talk: /^Interact$/, props: [{ id: 'hammer', a: CL + 'assets/gltf/clown_hammer.gltf', bone: /^handslot\.?r$/i }] },
  witch:    { a: WI + 'characters/Witch.glb', talk: /^Interact$/, props: [
    { id: 'basket', a: WI + 'assets/gltf/Basket_Mushrooms.gltf', p: [0.72, 0.45], r: -16 }, { id: 'cauldron', a: WI + 'assets/gltf/Cauldron.gltf', p: [-0.8, 0.3], r: 24 }] },
  gothgirl: { a: GG + 'characters/GothGirl.glb', talk: /^Interact$/, props: [
    { id: 'micstand', a: GG + 'assets/gltf/GothGirl_MicStand.gltf', p: [0.8, 0.12], r: -28 }, { id: 'speaker', a: GG + 'assets/gltf/GothGirl_Speaker.gltf', p: [-0.85, -0.05], r: 14 }] },
  caveman:  { a: P + '8 - February 2025 - Caveman/characters/Caveman.glb', talk: /^Interact$/ },
  bear:     { a: P + '5 - November 2023 - Animatronic/characters/gltf/Animatronic_Normal.glb', talk: /^Interact$/ }
};
const loader = new GLTFLoader(), cache = new Map();
const load = (p, c) => { const k = c + p; if (!cache.has(k)) cache.set(k, loader.loadAsync(raw(c, p))); return cache.get(k); };
let clipsP = null;
const clips = () => clipsP || (clipsP = Promise.all(['General', 'CombatMelee'].map((s) => load(ANIM + s + '.glb', PIN.anims).then((g) => g.animations).catch(() => [])))
  .then((a) => a.flat()));

function wrapText(g, text, maxW) { const ws = String(text).split(/\s+/), out = []; let l = '';
  for (const w of ws) { const t = l ? l + ' ' + w : w; if (g.measureText(t).width > maxW && l) { out.push(l); l = w; } else l = t; } if (l) out.push(l); return out; }
/* Card-Vorderseite aus Deck-JSON (power, lore, artworkPrompt). kfb-viewer.js ist nicht verdrahtet (Deck-PDF nicht im Repo) → Artwork-Feld = Platzhalter. */
async function drawCard(card) {
  try { await Promise.all(['64px "Irish Grover"', '700 34px "Shantell Sans"', '26px "Shantell Sans"', '24px "IBM Plex Mono"'].map((f) => document.fonts.load(f))); } catch (e) {}
  const W = 800, H = 1120, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
  g.fillStyle = '#f3e7cc'; g.fillRect(0, 0, W, H); g.strokeStyle = '#2b2620'; g.lineWidth = 4; g.beginPath(); g.roundRect(26, 26, W - 52, H - 52, 26); g.stroke();
  g.textBaseline = 'top'; g.fillStyle = '#6a5d4a'; g.font = '24px "IBM Plex Mono"'; g.fillText((card.deck + ' · #' + card.n).toUpperCase(), 62, 62);
  g.fillStyle = '#1f1a14'; g.font = '64px "Irish Grover"'; let y = 104; wrapText(g, card.name, W - 124).forEach((l) => { g.fillText(l, 62, y); y += 70; });
  const ay = y + 14, ah = 400; g.save(); g.beginPath(); g.rect(62, ay, W - 124, ah); g.clip(); g.fillStyle = '#e6d6b2'; g.fillRect(62, ay, W - 124, ah);
  g.strokeStyle = 'rgba(120,96,60,.18)'; g.lineWidth = 10; for (let x = -ah; x < W; x += 28) { g.beginPath(); g.moveTo(x, ay + ah); g.lineTo(x + ah, ay); g.stroke(); } g.restore();
  g.fillStyle = '#7a6a52'; g.font = '22px "IBM Plex Mono"'; let yy = ay + 24; ['artwork · kfb-viewer', ...wrapText(g, card.art, W - 172)].forEach((l) => { g.fillText(l, 86, yy); yy += 32; });
  y = ay + ah + 30; g.fillStyle = '#1f1a14'; g.font = '700 34px "Shantell Sans"'; wrapText(g, card.power, W - 124).forEach((l) => { g.fillText(l, 62, y); y += 44; });
  y += 12; g.fillStyle = '#4e4436'; g.font = '26px "Shantell Sans"'; wrapText(g, card.lore, W - 124).forEach((l) => { g.fillText(l, 62, y); y += 35; });
  g.fillStyle = '#8a7a62'; g.font = '22px "IBM Plex Mono"'; g.fillText('KAYFABIZARRO', 62, H - 84); return cv;
}

export async function createStage3D(host, opts = {}) {
  const onAnchors = opts.onAnchors || (() => {}), onStatus = opts.onStatus || (() => {});
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;cursor:grab';
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f1d3a2'); scene.fog = new THREE.Fog('#f1d3a2', 16, 40);
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 120);
  scene.add(new THREE.HemisphereLight('#fff3df', '#b98f5e', 1.15));
  const sun = new THREE.DirectionalLight('#fff1d8', 2.1);           // Licht oben links (globale Regel)
  sun.position.set(-6, 9, 7); scene.add(sun); scene.add(sun.target);
  const roots = [], shadow = makeKfbShadow(THREE, sun, () => roots, { renderer });
  const clay = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.95, metalness: 0 });
  const ground = new THREE.Mesh(new THREE.CircleGeometry(40, 96), clay('#d7ba8c')); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; ground.name = 'Boden y 0'; scene.add(ground);
  [[-9, -12, 6, '#a9b47c'], [2, -15, 8, '#94a56b'], [11, -11, 5.5, '#b5ba86']].forEach(([x, z, r, c]) => {
    const h = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 24), clay(c)); h.scale.y = 0.42; h.position.set(x, -0.4, z); scene.add(h); });

  /* Orbit: frei drehen, Zoom zum Cursor, schieben. Erst nach Nutzereingriff hält die Kamera ihre Lage; „Kamera zurück" fährt zur Bühnen-Kadrierung. */
  const controls = new OrbitControls(cam, renderer.domElement);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.09, zoomToCursor: true, screenSpacePanning: true, minDistance: 1.4, maxDistance: 18, maxPolarAngle: 1.5, rotateSpeed: 0.7, zoomSpeed: 0.9 });
  let userCam = false, camTween = null;
  controls.addEventListener('start', () => { userCam = true; camTween = null; renderer.domElement.style.cursor = 'grabbing'; });
  controls.addEventListener('end', () => { renderer.domElement.style.cursor = 'grab'; });
  renderer.domElement.addEventListener('wheel', () => { userCam = true; camTween = null; }, { passive: true });

  /* Card (optional) */
  const card = new THREE.Group(); card.name = 'Card'; card.visible = false; scene.add(card);
  const CH = 1.6, CW = CH * 800 / 1120;
  const front = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.82 }));
  const back = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.82 }));
  back.rotation.y = Math.PI; front.position.z = 0.004; back.position.z = -0.004; card.add(front, back);
  new THREE.TextureLoader().load('assets/chatterbox/kfb-card-backside.png', (t) => { t.colorSpace = THREE.SRGBColorSpace; back.material.map = t; back.material.needsUpdate = true; });
  async function setCard(c) { if (!c) { card.visible = false; layout(); return; }
    const cv = await drawCard(c), t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    if (front.material.map) front.material.map.dispose(); front.material.map = t; front.material.needsUpdate = true; card.visible = true; layout(); }

  const actors = new Map(); let cast = [], W = 1, H = 1, disposed = false, hmax = 2.4;
  const v = new THREE.Vector3();

  async function makeActor(who, withProps) {
    const R = RESIDENTS[who]; if (!R) return null;
    const g = await load(R.a, PIN.assets), root = skinClone(g.scene);
    let head = null; root.traverse((o) => { if (!head && o.isBone && /^head$/i.test(o.name)) head = o; });
    const grp = new THREE.Group(), squash = new THREE.Group(); grp.name = who; squash.add(root); grp.add(squash); grp.visible = false; scene.add(grp);
    const box = new THREE.Box3().setFromObject(root), h = box.max.y - box.min.y;
    root.position.y -= box.min.y;
    root.updateMatrixWorld(true);
    const hp = head ? head.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3(0, h * 0.8, 0);
    const a = { who, grp, squash, root, head, h, topOff: Math.max(0.1, h - hp.y), headR: Math.max(0.25, (h - hp.y) * 0.95), mixer: new THREE.AnimationMixer(root), fx: null, nod: null, gaze: null, gz: { yaw: 0, pitch: 0 }, act: {} };
    const all = await clips();
    const pick = (re) => all.find((c) => re.test(c.name));
    const idle = pick(IDLE);
    if (idle) { a.act.idle = a.mixer.clipAction(idle); a.act.idle.play(); a.act.idle.time = Math.random() * idle.duration; }
    const talk = pick(R.talk); if (talk) { a.act.talk = a.mixer.clipAction(talk); a.act.talk.setLoop(THREE.LoopOnce); a.act.talk.clampWhenFinished = false; }
    const hit = pick(/^Hit_A$/); if (hit) { a.act.hit = a.mixer.clipAction(hit); a.act.hit.setLoop(THREE.LoopOnce); }
    a.mixer.addEventListener('finished', (e) => { if (e.action !== a.act.idle && a.act.idle) { e.action.fadeOut(0.25); a.act.idle.reset().fadeIn(0.25).play(); } });
    if (withProps) await Promise.all((R.props || []).map(async (pr) => { try {
      const pg = await load(pr.a, PIN.assets), o = pg.scene.clone(true); o.name = who + '.' + pr.id;
      if (pr.bone) { let b = null; root.traverse((x) => { if (!b && pr.bone.test(x.name)) b = x; }); if (b) b.add(o); }
      else { o.position.set(pr.p[0], 0, pr.p[1]); o.rotation.y = (pr.r || 0) * Math.PI / 180; grp.add(o); }
    } catch (e) { /* Prop fehlt → Bühne läuft ohne */ } }));
    shadow.castRule(grp);
    return a;
  }
  /* Mit Card (Triplet-Bühne): Figuren 36 % der Höhe, Boden bei 72 % von oben → oben Platz für Blasen, unten für die Zurufe. */
  function frameCam() { const aspect = W / H, fov = cam.fov * Math.PI / 180;
    if (card.visible) { const visH = hmax / 0.36, dist = visH / 2 / Math.tan(fov / 2), ty = 0.22 * visH;
      return { pos: new THREE.Vector3(0, ty + 0.35, dist), tgt: new THREE.Vector3(0, ty, 0), worldW: visH * aspect }; }
    const visH = hmax / 0.48, dist = visH / 2 / Math.tan(fov / 2);
    return { pos: new THREE.Vector3(0, hmax * 0.66, dist), tgt: new THREE.Vector3(0, hmax * 0.52, 0), worldW: visH * aspect }; }
  function layout() {
    cam.aspect = W / H; cam.updateProjectionMatrix();
    const F = frameCam(); if (!userCam && !camTween) { cam.position.copy(F.pos); controls.target.copy(F.tgt); controls.update(); }
    const worldW = card.visible ? Math.min(F.worldW, 7) : F.worldW;
    cast.forEach((c) => { const a = actors.get(c.who); if (!a || a.pending) return; a.grp.position.set((c.x - 0.5) * worldW * 0.96, 0, card.visible ? 0.25 : 0); a.grp.rotation.y = (0.5 - c.x) * (card.visible ? 0.8 : 0.55); a.grp.visible = true; });
    actors.forEach((a, k) => { if (!cast.some((c) => c.who === k) && a.grp) a.grp.visible = false; });
    card.position.set(0, hmax * 0.6, -0.95);
    roots.length = 0; if (card.visible) roots.push(card); cast.forEach((c) => { const a = actors.get(c.who); if (a && a.grp) roots.push(a.grp); }); shadow.fit();
  }
  let queue = Promise.resolve();
  function setCast(list) { queue = queue.then(() => setCastNow(list)); return queue; }
  async function setCastNow(list) {
    cast = list.slice(); onStatus('lädt Residents …');
    await Promise.all(cast.map(async (c) => {
      const key = c.who, have = actors.get(key);
      if (have && (have.pending || !c.props || have.props)) return;
      if (have && have.grp) { scene.remove(have.grp); actors.delete(key); }
      actors.set(key, { pending: true });
      try { const a = await makeActor(key, !!c.props); if (a) { a.props = !!c.props; actors.set(key, a); } else actors.delete(key); }
      catch (e) { actors.delete(key); onStatus('Fehler: ' + key + ' · ' + e.message); }
    }));
    hmax = Math.max(2, ...[...actors.values()].filter((a) => a.h).map((a) => a.h));
    layout(); renderer.render(scene, cam); onStatus('bereit');
  }
  function resize() { const r = host.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height); renderer.setSize(W, H, false); layout(); }
  const ro = new ResizeObserver(resize); ro.observe(host); resize();

  const T0 = performance.now(); let tPrev = T0;
  const clockNow = () => (performance.now() - T0) / 1000; let last = '', lastT = 0, lastCam = '', emitted = {};
  const q1 = new THREE.Quaternion(), q2 = new THREE.Quaternion(), qy = new THREE.Quaternion(), qp = new THREE.Quaternion(), AY = new THREE.Vector3(0, 1, 0), AR = new THREE.Vector3(), tp = new THREE.Vector3(), hp0 = new THREE.Vector3(), saved = [];
  function project(p) { v.copy(p).project(cam); return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H, z: v.z }; }
  function headPos(a, out) { return a.head ? a.head.getWorldPosition(out) : out.copy(a.grp.position).setY(a.h * 0.8); }
  function targetPos(gz, out) { if (gz === 'camera') return out.copy(cam.position); if (gz === 'card') return card.getWorldPosition(out);
    const b = actors.get(gz); return b && b.root ? headPos(b, out) : null; }
  /* Blick + Sprech-Nicken: additiv auf den Kopf-Bone NACH dem Mixer, nach dem Rendern zurückgesetzt (keine Akkumulation). */
  function aim(a, dt, t) {
    if (!a.head || (!a.gaze && !a.nod && Math.abs(a.gz.yaw) + Math.abs(a.gz.pitch) < 1e-3)) return;
    a.root.updateMatrixWorld(true); headPos(a, hp0); const ry = a.grp.rotation.y; let yaw = 0, pitch = 0;
    if (a.gaze && targetPos(a.gaze, tp)) { const dx = tp.x - hp0.x, dy = tp.y - hp0.y, dz = tp.z - hp0.z;
      yaw = Math.atan2(dx, dz) - ry; yaw = Math.max(-0.95, Math.min(0.95, Math.atan2(Math.sin(yaw), Math.cos(yaw))));
      pitch = Math.max(-0.32, Math.min(0.32, Math.atan2(-dy, Math.hypot(dx, dz)))); }
    const k = 1 - Math.exp(-dt * 6); a.gz.yaw += (yaw - a.gz.yaw) * k; a.gz.pitch += (pitch - a.gz.pitch) * k;
    let nod = 0; if (a.nod) { const u = (t - a.nod.t0) / a.nod.dur; if (u >= 1) a.nod = null; else nod = 0.06 * Math.sin((t - a.nod.t0) * Math.PI * 4.8) * Math.sin(Math.PI * Math.min(1, u * 1.4)); }
    saved.push([a.head, a.head.quaternion.clone()]);
    a.head.getWorldQuaternion(q1); a.head.parent.getWorldQuaternion(q2);
    qy.setFromAxisAngle(AY, a.gz.yaw * 0.85); const ang = ry + a.gz.yaw * 0.85; AR.set(Math.cos(ang), 0, -Math.sin(ang)); qp.setFromAxisAngle(AR, a.gz.pitch * 0.85 + nod);
    q1.premultiply(qy).premultiply(qp); a.head.quaternion.copy(q2.invert().multiply(q1)); }
  function frame() {
    if (disposed) return; requestAnimationFrame(frame);
    const nowMs = performance.now(), dt = Math.min(0.05, (nowMs - tPrev) / 1000), t = clockNow(); tPrev = nowMs;
    if (camTween) { const u = Math.min(1, (nowMs - camTween.t0) / 650), e = u * u * (3 - 2 * u);
      cam.position.lerpVectors(camTween.p0, camTween.p1, e); controls.target.lerpVectors(camTween.g0, camTween.g1, e); if (u >= 1) camTween = null; }
    controls.update();
    if (card.visible) { card.position.y = hmax * 0.6 + Math.sin(t * 0.8) * 0.025; card.rotation.y = Math.sin(t * 0.45) * 0.05; }
    actors.forEach((a) => {
      if (!a.mixer) return; a.mixer.update(dt);
      if (a.fx) { const k = (t - a.fx.t0) / a.fx.dur; if (k >= 1) { a.squash.scale.set(1, 1, 1); a.squash.position.x = 0; a.fx = null; }
        else { const e = Math.sin(k * Math.PI);
          if (a.fx.kind === 'squash') a.squash.scale.set(1 + 0.05 * e, 1 - 0.06 * e, 1 + 0.05 * e);
          else { a.squash.position.x = 0.22 * e; a.squash.scale.set(1 + .04 * e, 1 - .05 * e, 1); } } }
    });
    actors.forEach((a) => { if (a.mixer && a.grp.visible) aim(a, dt, t); });
    shadow.tick(); renderer.render(scene, cam);
    for (const [b, q] of saved) b.quaternion.copy(q); saved.length = 0;
    if (t - lastT > 0.033) { lastT = t; const out = {}, right = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion);
      cast.forEach((c) => { const a = actors.get(c.who); if (!a || !a.root) return;
        headPos(a, hp0); const top = project(hp0.clone().setY(hp0.y + a.topOff)), ctr = project(hp0), edge = project(hp0.clone().addScaledVector(right, a.headR));
        const r = Math.hypot(edge.x - ctr.x, edge.y - ctr.y), vis = top.z > -1 && top.z < 1 && top.x > -40 && top.x < W + 40 && top.y > -60 && top.y < H + 40;
        out[c.who] = { hx: top.x, hy: top.y, vis, face: { x: ctr.x - r, y: ctr.y - r * 0.9, w: 2 * r, h: 1.8 * r } }; });
      // Readability: idle sway / nods must not drag bubbles. Camera moves pass straight through;
      // otherwise an anchor only updates past a 14 px dead-band (or on visibility change).
      const camKey = cam.matrixWorld.elements.map((v) => v.toFixed(3)).join(',') + '|' + W + 'x' + H, camMoved = camKey !== lastCam; lastCam = camKey;
      const held = {};
      Object.entries(out).forEach(([k, o]) => { const p = emitted[k];
        held[k] = !camMoved && p && p.vis === o.vis && Math.hypot(o.hx - p.hx, o.hy - p.hy) < 14 ? p : o; });
      const key = Object.entries(held).map(([k, o]) => k + Math.round(o.hx) + ',' + Math.round(o.hy) + (o.vis ? '' : 'x')).join('|');
      if (key !== last) { last = key; emitted = held; onAnchors(held); } }
  }
  frame();
  return {
    setCast, setCard, resize,
    talk(who, ms) { const a = actors.get(who); if (!a || !a.act) return; a.fx = { kind: 'squash', t0: clockNow(), dur: 0.3 };
      if (ms) a.nod = { t0: clockNow(), dur: ms / 1000 };
      else if (a.act.talk && a.act.idle) { a.act.idle.fadeOut(0.2); a.act.talk.reset().fadeIn(0.2).play(); } },
    recoil(who) { const a = actors.get(who); if (!a || !a.act) return; a.fx = { kind: 'recoil', t0: clockNow(), dur: 0.34 };
      if (a.act.hit && a.act.idle) { a.act.idle.fadeOut(0.1); a.act.hit.reset().fadeIn(0.1).play(); } },
    setGaze(who, target) { const a = actors.get(who); if (a && a.root) a.gaze = target || null; },
    resetCamera() { const F = frameCam(); userCam = false; camTween = { t0: performance.now(), p0: cam.position.clone(), p1: F.pos, g0: controls.target.clone(), g1: F.tgt }; },
    audit() { return Object.assign({ shadow: shadow.state }, shadow.audit(scene)); },
    dispose() { disposed = true; ro.disconnect(); controls.dispose(); renderer.dispose(); renderer.domElement.remove(); }
  };
}
