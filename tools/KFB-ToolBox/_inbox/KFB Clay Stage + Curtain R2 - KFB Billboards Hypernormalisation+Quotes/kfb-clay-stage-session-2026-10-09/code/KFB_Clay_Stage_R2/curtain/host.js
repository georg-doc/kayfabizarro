// KFB Clay Stage R2 · Demo-HOST für Bühne + Vorhang (09.10.2026) · Kopie von R1/curtain/host.js
// R2: hardware 'none' (Stange/Ringe/Haken verdeckt bzw. entfallen), Ansichten auf das Portal gerahmt, Messwerte aus dem Look im Snapshot.
// Host-seitig wie kfb-curtain-host-demo.js: Renderer, Kamera, Licht, Hintergrund-Stand-in, Takt, Eingabe.
// Der Vorhang wird NUR über seinen Vertrag benutzt (createTheatreCurtain · warmup · update · requestReveal · cover · impact ·
// setFootlights · snap · onState). Der Kern wird unverändert über jsDelivr importiert; der Look kommt aus ./clay-look.js.
import * as THREE from 'three/webgpu';
import { uv, mix, smoothstep, uniform } from 'three/tsl';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { dressClay } from './clay-look.js';

const CORE_PATH = 'tools/KFB-ToolBox/_inbox/KFB Theatre Curtain Recovery Board/KFB_THEATRE_CURTAIN_RECOVERY_SESSION_2026-10-07/tools/KFB-ToolBox/_inbox/KFB_THEATRE_CURTAIN_RECOVERY_CLAUDE_DESIGN_2026-10-07/candidate/kfb-curtain-core.js';
export const SRC = { core: 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/' + CORE_PATH.split('/').map(encodeURIComponent).join('/'), corePin: 'main (ungepinnt, OPEN)' };

// Ansichten: Ziel + Ausschnitt (w × h in m), Abstand wird aus dem Seitenverhältnis gerechnet
const VIEWS = {
  front: { dir: [0, 0.05, -1], at: [0, 0.5, -0.5], w: 5.4, h: 4.0 },
  frame: { dir: [0.34, 0.16, -1], at: [0, 0.45, -0.4], w: 6.6, h: 4.8 },
  stage: { pos: [1.25, -0.45, -2.85], at: [0.2, -1.0, -0.6] },
  side: { pos: [-5.2, 0.6, -2.4], at: [0, 0.2, -0.3] },
  cloth: { pos: [0.55, 0.15, -2.3], at: [0.3, 0.05, 0] }
};

export async function mountStage(el, { pal, onChange = () => {} } = {}) {
  const S = { supported: false, state: '–', open: 0, frozen: false, fps: null, err: null, look: null, view: 'front', shot: 'closed', decals: true, sign: true, age: 1 };
  const push = () => onChange({ ...S });
  const dead = { failed: true, setPalette() {}, shot() {}, view() {}, act() {}, set() {}, pause() {}, evidence() {}, dispose() {} };
  let core; try { core = await import(/* @vite-ignore */ SRC.core); } catch (e) { S.err = 'Vorhang-Kern nicht ladbar: ' + String(e.message || e).slice(0, 160); push(); return dead; }
  S.supported = core.isSupported(); if (!S.supported) { S.state = 'fallback_reveal'; S.err = 'Kein WebGPU in diesem Browser: der Kern meldet fallback_reveal und zeichnet nichts (Vertrag).'; push(); return dead; }

  let renderer;
  try { renderer = new THREE.WebGPURenderer({ antialias: true, requiredLimits: { maxStorageBuffersInVertexStage: 1 } }); await renderer.init(); }
  catch (e) { S.err = 'WebGPU-Renderer nicht startbar: ' + String(e.message || e).slice(0, 160); push(); return dead; }
  renderer.setPixelRatio(Math.min(2, devicePixelRatio)); renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  const cv = renderer.domElement; Object.assign(cv.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' }); el.appendChild(cv);
  const mirror = document.createElement('canvas'); Object.assign(mirror.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'none', pointerEvents: 'none' }); el.appendChild(mirror);

  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(36, 1, 0.05, 60);
  const controls = new OrbitControls(camera, cv); controls.enableDamping = true; controls.minDistance = 0.8; controls.maxDistance = 16;

  const curtain = core.createTheatreCurtain({ material: 'P', hardware: 'none', proscenium: false, floor: false, footlights: true });
  scene.add(curtain.group);
  S.state = curtain.state; curtain.onState(s => { S.state = s; push(); });
  const look = dressClay(curtain, pal); S.look = look.stats; S.measure = look.measure;

  // Host-Licht (Empfehlung, der Kern braucht es nicht): warmes Führungslicht, kühle Kante, Himmel/Tisch-Fülle, Innenlicht hinter dem Vorhang
  const hemi = new THREE.HemisphereLight('#fff3e2', pal.table, 0.75); scene.add(hemi);
  const key = new THREE.SpotLight('#ffe6c8', 60, 16, 0.5, 0.6, 1.5); key.position.set(1.2, 3.6, -4.6); key.target.position.set(0, -0.3, -0.2); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; scene.add(key, key.target);
  const rim = new THREE.SpotLight('#cfe0ff', 12, 10, 0.6, 0.8, 1.5); rim.position.set(-2.8, 2.6, -2.0); rim.target.position.set(0, 0, 0); scene.add(rim, rim.target);
  // Host-Welt hinter dem Vorhang (Stand-in): gemalter Prospekt in der Palette
  const skyTop = uniform(new THREE.Color(pal.skyTop)), skyBot = uniform(new THREE.Color(pal.skyBottom)), skyM = new THREE.MeshBasicNodeMaterial(); skyM.colorNode = mix(skyBot, skyTop, smoothstep(0.05, 0.95, uv().y));
  const back = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.7), skyM); back.position.set(0, 0.2, 1.95); back.rotation.y = Math.PI; scene.add(back);
  const inner = new THREE.SpotLight('#fff1dc', 30, 8, 0.55, 0.7, 1.6); inner.position.set(0, 2.4, 0.3); inner.target.position.set(0, curtain.DIM.floorY, 0.8); inner.castShadow = true; scene.add(inner, inner.target);
  const table = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: pal.table, roughness: 0.95 })); table.rotation.x = -Math.PI / 2; table.position.y = curtain.DIM.floorY - 0.09 - 0.3; table.receiveShadow = true; scene.add(table);
  let P = pal;
  function setPalette(p) { P = p; look.setPalette(p); skyTop.value.set(p.skyTop); skyBot.value.set(p.skyBottom); scene.background = new THREE.Color(p.studio); table.material.color.set(p.table); hemi.groundColor.set(p.table); }
  setPalette(pal);
  look.setFootlights(1);

  // Kamera
  let tween = null;
  const fit = v => { const V = VIEWS[v]; if (V.pos) return { pos: new THREE.Vector3(...V.pos), at: new THREE.Vector3(...V.at) }; const f = camera.fov * Math.PI / 180, d = Math.max(V.h, V.w / camera.aspect) / (2 * Math.tan(f / 2)), dir = new THREE.Vector3(...V.dir).normalize(), at = new THREE.Vector3(...V.at); return { pos: at.clone().addScaledVector(dir, d), at }; };
  function view(v, instant) { S.view = v; const T = fit(v); if (instant) { camera.position.copy(T.pos); controls.target.copy(T.at); tween = null; } else tween = { t0: performance.now(), p0: camera.position.clone(), q0: controls.target.clone(), ...T }; push(); }
  const resize = () => { const w = el.clientWidth || 2, h = el.clientHeight || 2; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); if (!tween && VIEWS[S.view] && !VIEWS[S.view].pos) view(S.view, true); };
  const ro = new ResizeObserver(resize); ro.observe(el); resize();

  // Look-Tafeln: geschlossen · halb offen (Host hält den Takt bei 50 % an) · offen
  let half = false;
  function shot(k) {
    S.shot = k; S.frozen = false; half = false;
    if (k === 'closed') { curtain.snap(false); curtain.warmup(renderer, 700); }
    else if (k === 'open') { curtain.snap(true); curtain.warmup(renderer, 900); }
    else if (k === 'half') { curtain.snap(false); curtain.warmup(renderer, 500); half = true; curtain.requestReveal(); }
    push();
  }
  curtain.warmup(renderer, 900); view('front', true);

  let last = performance.now(), fpsN = 0, fpsT = last, lastPush = 0, ev = false;
  let frameErr = 0;
  function frame() { try { frameBody(); } catch (e) { if (frameErr++ < 3) console.error('[stage frame]', e); S.err = 'Frame-Fehler: ' + String(e.message || e).slice(0, 160); } }
  function frameBody() {
    const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!S.frozen) curtain.update(renderer, dt);
    S.open = curtain.openness; if (half && S.open >= 0.5) { half = false; S.frozen = true; }
    if (tween) { const k = Math.min(1, (now - tween.t0) / 800), e = k * k * (3 - 2 * k); camera.position.lerpVectors(tween.p0, tween.pos, e); controls.target.lerpVectors(tween.q0, tween.at, e); if (k >= 1) tween = null; }
    controls.update(); renderer.render(scene, camera);
    if (ev) { if (mirror.width !== cv.width || mirror.height !== cv.height) { mirror.width = cv.width; mirror.height = cv.height; } mirror.getContext('2d').drawImage(cv, 0, 0); }
    fpsN++; if (now - fpsT >= 1000) { S.fps = Math.round(fpsN * 1000 / (now - fpsT)); fpsN = 0; fpsT = now; }
    if (now - lastPush > 300) { lastPush = now; push(); }
  }
  let running = false;
  const pause = b => { if (b && running) { renderer.setAnimationLoop(null); running = false; } else if (!b && !running) { last = performance.now(); resize(); renderer.setAnimationLoop(frame); running = true; } };
  const onKey = e => { if (!running) return; if (e.key === 'Enter') { S.frozen = false; curtain.requestReveal(); } };
  addEventListener('keydown', onKey);
  pause(false); push();

  window.__kfbStage = { curtain, look, scene, camera, renderer, S };
  return {
    setPalette, shot, view, pause,
    act(a) { S.frozen = false; half = false; if (a === 'reveal') curtain.requestReveal(); if (a === 'cover') curtain.cover(); if (a === 'impact') curtain.impact(1); push(); },
    set(o) { if ('decals' in o) { S.decals = o.decals; look.setDecals(o.decals); } if ('sign' in o) { S.sign = o.sign; look.setSign(o.sign); } if ('age' in o) { S.age = o.age; look.setAge(o.age); } push(); },
    evidence(b) { ev = !!b; mirror.style.display = ev ? 'block' : 'none'; },
    dispose() { pause(true); removeEventListener('keydown', onKey); ro.disconnect(); controls.dispose(); look.dispose(); renderer.dispose(); cv.remove(); mirror.remove(); }
  };
}
