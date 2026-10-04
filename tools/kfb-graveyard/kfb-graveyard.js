// ============================================================================
// kfb-graveyard.js — Camp-Hub Graveyard als einbettbares Modul (v1.0.0)
// ----------------------------------------------------------------------------
// Eine begehbare Zone: Nacht-Friedhof, Kenney-GLB-Gräber aus Daten, Ink-Blasen,
// FrizzleBob als Guide, Grablicht-States. Klassisches WebGL (three 0.160).
//
//   import { createGraveyard } from './kfb-graveyard.js';
//   const gy = await createGraveyard({ mount: el, graves });
//
// Alles rendert in `mount` (kein Fullscreen-Zwang), alle ids sind mit `kfbgy-`
// namespaced, alle Listener werden in dispose() abgeräumt, kein window-Müll
// außer optional opts.debugGlobal.
//
// Assets: ausschließlich per kfb-assets.js → RAW-URL. Keine relativen Asset-Pfade.
// ============================================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { glb, CODE, DATA } from './kfb-assets.js';

export const VERSION = '1.0.0';

const WHO_COLOR = { process: '#a78bfa', coworker: '#fbbf24', design: '#22d3ee' };
const WHO_LIGHT = { process: '#c9cfe0', coworker: '#ffb267', design: '#8ecbff' };
const WHO_LABEL = { process: 'Prozess', coworker: 'Coworker', design: 'Design' };
const SIZE_DIM = { monument: [2.3, 3.4], large: [1.7, 2.5], medium: [1.35, 1.9], small: [1.1, 1.4] };
const SIZE_MODELS = {
  monument: ['pillar-obelisk'],
  large:    ['gravestone-cross-large', 'gravestone-decorative', 'gravestone-roof'],
  medium:   ['gravestone-bevel', 'gravestone-round', 'gravestone-wide'],
  small:    ['cross-wood', 'gravestone-broken', 'gravestone-debris'],
};
const SIZE_H    = { monument: 3.2, large: 2.4, medium: 1.85, small: 1.35 };
const SIZE_MAXW = { monument: 2.4, large: 1.8, medium: 1.4, small: 1.1 };
const SCENERY   = [['pine', 3.6], ['pine-crooked', 3.4], ['pine-fall', 3.3], ['rocks', 0.7], ['rocks-tall', 1.4], ['trunk', 1.6]];

const DEFAULTS = {
  graves: null, gravesUrl: null,
  hud: true, veil: true, bubbles: true, guide: true, fence: true, scenery: true, bloom: true,
  title: 'Camp-Hub · Graveyard', subtitle: 'Zone 1 — begehbares Projekt-Tagebuch',
  veilTitle: 'Der Friedhof der begrabenen Ideen', veilHint: 'Klick / Tap zum Betreten',
  lightMode: 'candle', layout: { cols: 3, gapX: 6.2, gapZ: 6.4, z0: -6 },
  spawn: { x: 0, z: 20, yaw: 0 }, eyeHeight: 1.7, walkSpeed: 4.2, sprint: 2.2,
  pointerLock: true, keyboardWhenHovered: true, petArchetype: 'bunny', debugGlobal: false,
  onReady: null, onHover: null, onSelect: null, onVisit: null, onTick: null, onError: null,
};

const CSS = `
.kfbgy-root{position:absolute;inset:0;overflow:hidden;background:#05070b;
  font-family:"Georgia","Times New Roman",serif;color:#d9d6cc;--kfbgy-ink:#d9d6cc;}
.kfbgy-root canvas{display:block;cursor:grab;}
.kfbgy-root canvas:active{cursor:grabbing;}
.kfbgy-hud{position:absolute;inset:0;pointer-events:none;}
.kfbgy-title{position:absolute;left:22px;top:18px;font-size:15px;letter-spacing:.06em;opacity:.72;}
.kfbgy-title b{display:block;font-size:20px;letter-spacing:.02em;opacity:.95;}
.kfbgy-counter{position:absolute;right:22px;top:18px;font-size:13px;opacity:.5;
  font-family:"SF Mono",ui-monospace,Menlo,Consolas,monospace;}
.kfbgy-help{position:absolute;left:22px;bottom:18px;font-size:13px;line-height:1.55;opacity:.6;
  font-family:"SF Mono",ui-monospace,Menlo,Consolas,monospace;letter-spacing:.01em;}
.kfbgy-help kbd{display:inline-block;min-width:16px;text-align:center;padding:1px 5px;margin:0 1px;
  border:1px solid rgba(217,214,204,.35);border-radius:4px;font:inherit;font-size:11px;}
.kfbgy-veil{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;
  background:radial-gradient(120% 120% at 50% 40%,rgba(10,14,22,.55),rgba(3,5,9,.92));cursor:pointer;
  z-index:10;transition:opacity .5s;padding:24px;text-align:center;}
.kfbgy-veil h1{font-size:34px;font-weight:400;letter-spacing:.04em;margin:0 0 10px;}
.kfbgy-veil p{margin:0;font-size:15px;opacity:.7;font-family:"SF Mono",ui-monospace,monospace;letter-spacing:.02em;}
.kfbgy-veil .kfbgy-go{margin-top:26px;font-size:13px;opacity:.55;font-family:"SF Mono",ui-monospace,monospace;
  border:1px solid rgba(217,214,204,.3);padding:9px 20px;border-radius:30px;}
.kfbgy-veil.kfbgy-hidden{opacity:0;pointer-events:none;}
.kfbgy-stick{position:absolute;display:none;width:120px;height:120px;border-radius:50%;
  border:1px solid rgba(217,214,204,.22);background:rgba(217,214,204,.05);z-index:8;pointer-events:none;}
.kfbgy-stick .kfbgy-nub{position:absolute;left:50%;top:50%;width:52px;height:52px;margin:-26px 0 0 -26px;
  border-radius:50%;background:rgba(217,214,204,.28);}
.kfbgy-err{position:absolute;inset:0;display:none;align-items:center;justify-content:center;padding:32px;
  background:#05070b;color:#e8a0a0;font-family:ui-monospace,monospace;font-size:14px;text-align:center;
  line-height:1.6;z-index:20;}
.kfbgy-bubble{position:absolute;display:none;width:300px;transform:translate(-50%,-100%);
  filter:drop-shadow(3px 4px 0 rgba(0,0,0,.45));will-change:left,top;}
.kfbgy-fb{width:330px;filter:drop-shadow(3px 4px 0 rgba(0,0,0,.5));z-index:2;}
.kfbgy-bubble .kfbgy-ink{position:absolute;inset:0;width:100%;height:100%;overflow:visible;z-index:0;pointer-events:none;}
.kfbgy-bubble .kfbgy-body{position:relative;z-index:1;padding:15px 18px 20px;}
.kfbgy-bubble .kfbgy-tag{font-family:"SF Mono",ui-monospace,Menlo,monospace;font-size:10.5px;letter-spacing:.09em;
  text-transform:uppercase;opacity:.95;}
.kfbgy-bubble .kfbgy-accent{height:2px;width:38px;margin:7px 0 9px;border-radius:2px;}
.kfbgy-bubble .kfbgy-text{font-family:"Georgia","Times New Roman",serif;font-size:15px;line-height:1.5;
  color:#26201a;text-wrap:pretty;}
.kfbgy-bubble .kfbgy-lesson{font-family:"Georgia","Times New Roman",serif;font-size:16px;line-height:1.5;
  color:#26201a;text-wrap:pretty;}
.kfbgy-bubble .kfbgy-trigger{margin-top:10px;padding-top:9px;border-top:1px dashed rgba(38,32,26,.35);
  font-family:"SF Mono",ui-monospace,Menlo,monospace;font-size:11.5px;letter-spacing:.02em;}
`;

function injectCss() {
  if (document.getElementById('kfbgy-css')) return;
  const s = document.createElement('style');
  s.id = 'kfbgy-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}

function mulberry32(a) {
  return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

/** Wonky Tusche-Outline (Kanon aus nie-synapse / kfb-table, 1:1). */
function inkPathD(w, h, seed, tailX) {
  const rnd = mulberry32(seed);
  const j = () => (rnd() - 0.5) * 2.4;
  const inset = 2, pts = [];
  const seg = (x0, y0, x1, y1, straight) => {
    const len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(len / 46));
    for (let i = 0; i < n; i++) {
      const t = i / n, jx = (i && !straight) ? j() : 0, jy = (i && !straight) ? j() : 0;
      pts.push([x0 + (x1 - x0) * t + jx, y0 + (y1 - y0) * t + jy]);
    }
  };
  seg(inset, inset, w - inset, inset);
  seg(w - inset, inset, w - inset, h - inset);
  if (tailX !== undefined) {
    const tx = Math.max(inset + 16, Math.min(w - inset - 16, tailX));
    seg(w - inset, h - inset, tx + 10, h - inset, true);
    pts.push([tx + 10, h - inset]); pts.push([tx + 1, h - inset + 14]); pts.push([tx - 8, h - inset]);
    seg(tx - 8, h - inset, inset, h - inset, true);
  } else { seg(w - inset, h - inset, inset, h - inset); }
  seg(inset, h - inset, inset, inset);
  let d = 'M' + pts[0][0].toFixed(1) + ',' + pts[0][1].toFixed(1);
  for (let i = 1; i < pts.length; i++) d += ' L' + pts[i][0].toFixed(1) + ',' + pts[i][1].toFixed(1);
  return d + ' Z';
}

// Pet-Stack: erst neben dem Modul (Consumer-Kopie), sonst kanonisch per RAW.
// Fehlt beides, läuft die Zone mit Platzhalter-Guide weiter — Boot bleibt heil.
async function loadPetStack(opts) {
  const tryImport = async (urls) => {
    for (const u of urls) { if (!u) continue; try { return await import(/* @vite-ignore */ u); } catch (e) { /* nächster */ } }
    return null;
  };
  const here = (f) => { try { return new URL(f, import.meta.url).href; } catch (e) { return null; } };
  const lib = await tryImport([opts.petLibraryUrl, here('./pet-library.v6.js'), CODE.petLibrary]);
  const rig = await tryImport([opts.eyeRigUrl, here('./pet-eye-rig.v4.js'), CODE.eyeRig]);
  return { Character: lib && (lib.Character || lib.CubePet), EyeRig: rig && rig.EyeRig };
}

async function resolveGraves(o) {
  const ok = (j) => j && Array.isArray(j.graves) && j.graves.length ? j.graves : (Array.isArray(j) && j.length ? j : null);
  const fromUrl = async (url) => {
    if (!url) return null;
    try { const r = await fetch(url, { cache: 'no-store' }); if (r.ok) return ok(await r.json()); } catch (e) { /* nächster */ }
    return null;
  };
  // Reihenfolge: expliziter gravesUrl → inline übergebene Gräber → Repo-Kanon.
  // (Inline vor RAW, sonst wartet der Boot auf einen Fetch, der nur Fallback ist.)
  let g = await fromUrl(o.gravesUrl);
  if (g) return g;
  g = ok(o.graves);
  if (g) return g;
  g = await fromUrl(DATA.postmortems);
  if (g) return g;
  throw new Error('kfb-graveyard: keine Gräber — graves:[…] oder gravesUrl angeben (Schema kfb-postmortem-graveyard/v1)');
}

/**
 * createGraveyard(opts) → Promise<GraveyardInstance>
 * Pflicht: mount (Element) + graves oder gravesUrl.
 */
export async function createGraveyard(userOpts = {}) {
  const o = { ...DEFAULTS, ...userOpts, layout: { ...DEFAULTS.layout, ...(userOpts.layout || {}) }, spawn: { ...DEFAULTS.spawn, ...(userOpts.spawn || {}) } };
  const mount = typeof o.mount === 'string' ? document.querySelector(o.mount) : o.mount;
  if (!mount) throw new Error('kfb-graveyard: mount fehlt');
  injectCss();
  if (getComputedStyle(mount).position === 'static') mount.style.position = 'relative';

  // ---------------------------------------------------------------- DOM
  const root = document.createElement('div');
  root.className = 'kfbgy-root';
  root.innerHTML = `
    <div class="kfbgy-hud">
      ${o.hud ? `<div class="kfbgy-title"><b></b><span></span></div><div class="kfbgy-counter">— / —</div>` : ''}
      <div class="kfbgy-bubble kfbgy-hover"><svg class="kfbgy-ink" xmlns="http://www.w3.org/2000/svg"></svg>
        <div class="kfbgy-body"><div class="kfbgy-tag"></div><div class="kfbgy-accent"></div><div class="kfbgy-text"></div></div></div>
      <div class="kfbgy-bubble kfbgy-fb"><svg class="kfbgy-ink" xmlns="http://www.w3.org/2000/svg"></svg>
        <div class="kfbgy-body"><div class="kfbgy-tag"></div><div class="kfbgy-accent"></div>
          <div class="kfbgy-lesson"></div><div class="kfbgy-trigger"></div></div></div>
      ${o.hud ? `<div class="kfbgy-help">
        <kbd>W</kbd><kbd>S</kbd> vor/zurück &nbsp;·&nbsp; <kbd>A</kbd><kbd>D</kbd> seitlich &nbsp;·&nbsp;
        <kbd>Q</kbd><kbd>E</kbd> drehen &nbsp;·&nbsp; ziehen / Finger — schauen &nbsp;·&nbsp; Rad — näher / weiter<br>
        <kbd>Shift</kbd>+Rad schieben &nbsp;·&nbsp; <kbd>Space</kbd> springen &nbsp;·&nbsp;
        <kbd>Shift</kbd> schneller &nbsp;·&nbsp; <kbd>L</kbd> Licht &nbsp;·&nbsp; Gamepad — Sticks / A springt</div>` : ''}
    </div>
    <div class="kfbgy-stick"><div class="kfbgy-nub"></div></div>
    <div class="kfbgy-err"></div>
    ${o.veil ? `<div class="kfbgy-veil"><h1></h1><p class="kfbgy-veilsub"></p><div class="kfbgy-go"></div></div>` : ''}`;
  mount.appendChild(root);
  const q = (sel) => root.querySelector(sel);
  const hoverBubble = q('.kfbgy-hover'), fbBubble = q('.kfbgy-fb'), stickEl = q('.kfbgy-stick');
  const errEl = q('.kfbgy-err'), veil = q('.kfbgy-veil'), counterEl = q('.kfbgy-counter');
  if (o.hud) { q('.kfbgy-title b').textContent = o.title; q('.kfbgy-title span').textContent = o.subtitle; }
  if (veil) { q('.kfbgy-veil h1').textContent = o.veilTitle; q('.kfbgy-go').textContent = o.veilHint; }

  const W = () => Math.max(1, root.clientWidth), H = () => Math.max(1, root.clientHeight);
  const fail = (e) => {
    errEl.style.display = 'flex';
    errEl.textContent = 'Boot-Fehler: ' + (e && e.message ? e.message : e);
    console.error('[kfb-graveyard]', e);
    if (o.onError) o.onError(e);
  };

  // ---------------------------------------------------------------- Daten
  let GRAVES;
  try { GRAVES = await resolveGraves(o); } catch (e) { fail(e); throw e; }
  if (veil) q('.kfbgy-veilsub').textContent = GRAVES.length + ' Post-Mortems · ' + GRAVES.length + ' Gräber';

  // ---------------------------------------------------------------- Szene
  const STONES = [];        // {x,z,r} Kollision
  const RAYCAST = [];       // Stein-Meshes für Hover/Pick
  const ANCHORS = [];       // Anker je Grab (Kappen-Oberkante) für Blasen
  const GRAVE_LIGHTS = [];
  const visited = new Set();
  const listeners = [];
  const disposables = [];
  const gltfLoader = new GLTFLoader();
  const glbCache = new Map();
  let lightMode = o.lightMode, running = false, started = false, destroyed = false;

  const on = (target, type, fn, opt) => { target.addEventListener(type, fn, opt); listeners.push([target, type, fn, opt]); };

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;   // sonst brennt die Dreck-Colormap aus
  renderer.toneMappingExposure = 1.0;
  root.insertBefore(renderer.domElement, root.firstChild);
  const canvas = renderer.domElement;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070a10);
  scene.fog = new THREE.FogExp2(0x070a10, 0.026);

  const camera = new THREE.PerspectiveCamera(70, W() / H(), 0.1, 400);
  camera.position.set(o.spawn.x, o.eyeHeight, o.spawn.z);

  scene.add(new THREE.HemisphereLight(0x2a3550, 0x05070b, 0.55));
  const moon = new THREE.DirectionalLight(0x9fb4d8, 0.85);
  moon.position.set(-18, 26, 12);
  moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048);
  moon.shadow.camera.near = 1; moon.shadow.camera.far = 90;
  moon.shadow.camera.left = -30; moon.shadow.camera.right = 30;
  moon.shadow.camera.top = 30; moon.shadow.camera.bottom = -30;
  moon.shadow.bias = -0.0004;
  scene.add(moon);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120),
    new THREE.MeshStandardMaterial({ color: 0x0c1119, roughness: 1, metalness: 0, envMapIntensity: 0.15 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const grid = new THREE.GridHelper(120, 60, 0x1c2740, 0x121a2b);
  grid.position.y = 0.01;
  grid.material.transparent = true; grid.material.opacity = 0.5;
  scene.add(grid);

  // ---------------------------------------------------------------- GLB-Helfer
  function loadGlb(name) {
    const url = glb('graveyard', name);
    if (!glbCache.has(url)) glbCache.set(url, gltfLoader.loadAsync(url));
    return glbCache.get(url);
  }
  // In eine Zielbox einpassen (Höhe UND Grundfläche — Höhen-Fit allein bläht breite Modelle auf)
  async function placeModel(name, targetH, maxFoot) {
    const gltf = await loadGlb(name);
    const obj = gltf.scene.clone(true);
    let box = new THREE.Box3().setFromObject(obj);
    const sz = box.getSize(new THREE.Vector3());
    let s = targetH / Math.max(sz.y, 0.001);
    if (maxFoot) s = Math.min(s, maxFoot / Math.max(sz.x, sz.z, 0.001));
    obj.scale.setScalar(s);
    obj.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(obj);
    const c = box.getCenter(new THREE.Vector3());
    obj.position.x -= c.x; obj.position.z -= c.z; obj.position.y -= box.min.y;
    return { obj, box, s, cx: c.x, cz: c.z, minY: box.min.y };
  }
  const litProp = (obj) => obj.traverse(n => { if (n.isMesh) { n.castShadow = true; if (n.material) n.material.envMapIntensity = 0.25; } });

  function headstoneGeometry(w, h, d) {
    const r = w * 0.5, straight = Math.max(0.05, h - r), s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(-w / 2, straight);
    s.absarc(0, straight, r, Math.PI, 0, true);
    s.lineTo(w / 2, 0); s.lineTo(-w / 2, 0);
    const geo = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 20 });
    geo.translate(0, 0, -d / 2);
    geo.computeVertexNormals();
    return geo;
  }

  async function buildGraves() {
    const { cols, gapX, gapZ, z0 } = o.layout;
    const rnd = (n) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };
    for (let i = 0; i < GRAVES.length; i++) {
      const g = GRAVES[i];
      const col = i % cols, row = Math.floor(i / cols);
      const x = (col - (cols - 1) / 2) * gapX + (rnd(i + 1) - 0.5) * 1.1;
      const z = z0 + row * gapZ + (rnd(i + 7) - 0.5) * 1.0;
      const size = SIZE_DIM[g.size] ? g.size : 'medium';
      const targetH = SIZE_H[size];
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = (rnd(i + 3) - 0.5) * 0.28;

      let radius = 0.9, topY = targetH + 0.5;
      try {
        const mound = await placeModel('grave', 0.35, 1.9);
        mound.obj.traverse(n => { if (n.isMesh && n.material) { n.material.envMapIntensity = 0.25; n.receiveShadow = true; } });
        group.add(mound.obj);
        const pool = SIZE_MODELS[size];
        const name = pool[Math.floor(rnd(i + 5) * pool.length) % pool.length];
        const st = await placeModel(name, targetH, SIZE_MAXW[size]);
        st.obj.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; n.userData.gi = i; if (n.material) n.material.envMapIntensity = 0.25; RAYCAST.push(n); } });
        group.add(st.obj);
        const wsz = st.box.getSize(new THREE.Vector3());
        radius = Math.max(wsz.x, wsz.z) * 0.5 + 0.35;
        topY = st.box.max.y + 0.5;
      } catch (err) {
        console.warn('[kfb-graveyard] GLB fehlgeschlagen, Platzhalter-Stein:', err);
        const [w, h] = SIZE_DIM[size], d = Math.max(0.28, w * 0.22);
        const stone = new THREE.Mesh(headstoneGeometry(w, h, d), new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL(0.62, 0.04, 0.18), roughness: 0.95, metalness: 0.02, envMapIntensity: 0.2 }));
        stone.castShadow = true; stone.receiveShadow = true; stone.userData.gi = i;
        group.add(stone); RAYCAST.push(stone);
        radius = w * 0.55 + 0.35; topY = h + 0.55;
      }

      // Grablicht: sichtbare Lampe + heiße Flamme (bloomt) + Punktlicht (leuchtet den Stein an)
      const lx = radius * 0.5, lz = radius * 0.95;
      try { const lamp = await placeModel('lantern-candle', 0.95); lamp.obj.position.x += lx; lamp.obj.position.z += lz; litProp(lamp.obj); group.add(lamp.obj); } catch (e) { /* nur Licht */ }
      const flameCol = new THREE.Color(WHO_LIGHT[g.who] || '#c9cfe0').multiplyScalar(2.4);
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), new THREE.MeshBasicMaterial({ color: flameCol, toneMapped: false }));
      flame.position.set(lx, 0.62, lz);
      group.add(flame);
      const pl = new THREE.PointLight(new THREE.Color(WHO_LIGHT[g.who] || '#c9cfe0'), 4.5, radius * 3.2 + 2.5, 2);
      pl.position.set(lx, 0.7, lz);
      group.add(pl);
      GRAVE_LIGHTS.push({ light: pl, flame, base: 4.5, flameBase: flameCol.clone(),
        phase: rnd(i + 13) * 6.28, freq: 3.2 + rnd(i + 17) * 4.8, freq2: 8 + rnd(i + 23) * 9,
        baseColor: new THREE.Color(WHO_LIGHT[g.who] || '#c9cfe0') });

      scene.add(group);
      STONES.push({ x, z, r: radius });
      ANCHORS[i] = new THREE.Vector3(x, topY, z);
    }
    if (counterEl) counterEl.textContent = GRAVES.length + ' Gräber';
  }

  async function buildFence() {
    const minX = -13, maxX = 13, minZ = -13, maxZ = 17, HH = 1.3, gateHalf = 2.2;
    const probe = await placeModel('iron-fence', HH);
    const segW = Math.max(probe.box.getSize(new THREE.Vector3()).x, 0.6);
    const seg = async (x, z, rotY) => {
      const s = await placeModel('iron-fence', HH);
      s.obj.position.set(x, 0, z); s.obj.rotation.y = rotY;
      litProp(s.obj); scene.add(s.obj);
    };
    for (let x = minX; x <= maxX; x += segW) { if (Math.abs(x) > gateHalf) await seg(x, maxZ, 0); await seg(x, minZ, 0); }
    for (let z = minZ; z <= maxZ; z += segW) { await seg(minX, z, Math.PI / 2); await seg(maxX, z, Math.PI / 2); }
    try { const gate = await placeModel('fence-gate', HH * 1.15); gate.obj.position.set(0, 0, maxZ); litProp(gate.obj); scene.add(gate.obj); } catch (e) { /* nur Lücke */ }
  }

  async function scatterScenery() {
    const rnd = (n) => { const s = Math.sin(n * 78.233) * 43758.5453; return s - Math.floor(s); };
    let placed = 0;
    for (let k = 0; k < 48 && placed < 16; k++) {
      const x = (rnd(k + 1) * 2 - 1) * 12, z = -12 + rnd(k + 7) * 27;
      let clear = true;
      for (const s of STONES) if (Math.hypot(x - s.x, z - s.z) < 2.6) { clear = false; break; }
      if (Math.hypot(x, z - 14) < 2.6) clear = false;        // Guide-Home frei
      if (Math.abs(x) < 1.2 && z > 8) clear = false;         // Eingangs-Gasse frei
      if (!clear) continue;
      const [name, HH] = SCENERY[Math.floor(rnd(k + 13) * SCENERY.length) % SCENERY.length];
      try {
        const m = await placeModel(name, HH * (0.85 + rnd(k + 3) * 0.4));
        m.obj.position.x += x; m.obj.position.z += z; m.obj.rotation.y = rnd(k + 5) * 6.28;
        litProp(m.obj); scene.add(m.obj);
        STONES.push({ x, z, r: name.startsWith('pine') ? 0.7 : 0.6 });
        placed++;
      } catch (e) { /* Prop fehlt: überspringen */ }
    }
  }

  // ---------------------------------------------------------------- Guide (FrizzleBob)
  let fb = null, fbRig = null;
  const FB_HOME = new THREE.Vector3(0, 0, 14);

  function petMat(p) {
    return new THREE.MeshStandardMaterial({ color: p.color != null ? p.color : 0xffffff, map: p.map || null,
      metalness: 0, roughness: p.roughness != null ? p.roughness : 0.85, envMapIntensity: 0.9 });
  }
  function guidePlaceholder() {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xd3a244, roughness: 0.7 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), mat);
    body.position.y = 0.55; body.castShadow = true; g.add(body);
    const ear = new THREE.BoxGeometry(0.14, 0.4, 0.1);
    const e1 = new THREE.Mesh(ear, mat); e1.position.set(-0.16, 1.05, 0); g.add(e1);
    const e2 = new THREE.Mesh(ear, mat); e2.position.set(0.16, 1.05, 0); g.add(e2);
    g.position.copy(FB_HOME); g.rotation.y = Math.PI;
    return { group: g, loaded: true, update() {}, play() {}, speak() {}, _placeholder: true };
  }

  async function spawnGuide() {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    disposables.push(pmrem);
    const petLight = new THREE.PointLight(0xffe6a8, 0.8, 8, 2);
    petLight.position.set(FB_HOME.x, 2.2, FB_HOME.z + 0.5);
    scene.add(petLight);

    let lib = null;
    for (const url of [o.petContractUrl, DATA.petContract]) {
      if (!url) continue;
      try { const r = await fetch(url, { cache: 'no-store' }); if (r.ok) { lib = await r.json(); break; } } catch (e) { /* weiter */ }
    }
    lib = lib || { pets: [{ id: o.petArchetype, color: '#d3a244', eye: {} }], face: { stripEyes: true }, eyeRig: {} };
    const pet = (lib.pets || []).find(p => p.id === o.petArchetype) || { id: o.petArchetype, color: '#d3a244', eye: {} };
    const baseHex = parseInt((pet.color || '#d3a244').replace('#', ''), 16);

    const { Character, EyeRig } = await loadPetStack(o);
    if (!Character) { fb = guidePlaceholder(); scene.add(fb.group); return; }
    try {
      const ch = new Character({
        THREE,
        loadGltf: (url) => new Promise((res, rej) => gltfLoader.load(url, res, undefined, rej)),
        makeMat: (p) => petMat(p),
        receiveShadow: false,
      });
      await ch.load('animals', o.petArchetype, { mods: ['emotes'], face: lib.face });   // 'googly' NIE — echtes EyeRig
      ch.inner.traverse(n => { if (n.isMesh && !n.userData.petOverlay) { n.castShadow = true; n.frustumCulled = false; } });
      if (EyeRig) {
        const er = lib.eyeRig || {}, eye = pet.eye || {}, ps = eye.pupilStyle || 'matte-cute';
        const rig = new EyeRig(ch, {
          baseColor: baseHex, pupilStyle: ps, anchor: eye.anchor, blink: er.blink,
          pupilSize: eye.pupilSize != null ? eye.pupilSize : (er.pupilSize != null ? er.pupilSize : 0.4),
          inset: eye.inset != null ? eye.inset : (er.inset != null ? er.inset : 0),
          lidFit: eye.lidFit != null ? eye.lidFit : (er.lidFit != null ? er.lidFit : 0.9),
          gloss: (er.gloss && er.gloss[ps] != null) ? er.gloss[ps] : 0.85,
          converge: eye.converge != null ? eye.converge : (er.converge != null ? er.converge : 0),
        });
        rig.build();
        rig.setGazeFollow(false);
        fbRig = rig;
      }
      ch.group.position.copy(FB_HOME);
      ch.group.rotation.y = Math.PI;
      ch.setHome();
      ch.play('idle');
      scene.add(ch.group);
      fb = ch;
    } catch (err) {
      console.warn('[kfb-graveyard] Guide-GLB/Rig fehlgeschlagen, Platzhalter aktiv:', err);
      fb = guidePlaceholder();
      scene.add(fb.group);
    }
  }

  // ---------------------------------------------------------------- Blasen
  function paintInk(el, seed) {
    requestAnimationFrame(() => {
      if (destroyed) return;
      const w = el.offsetWidth, h = el.offsetHeight, svg = el.querySelector('svg.kfbgy-ink');
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      svg.innerHTML = '<path d="' + inkPathD(w, h, seed, w / 2) + '" fill="#efe6ce" stroke="#26201a" stroke-width="2.4" stroke-linejoin="round"></path>';
    });
  }
  function renderHoverBubble(g, seed) {
    const accent = WHO_COLOR[g.who] || '#1f1a14';
    hoverBubble.querySelector('.kfbgy-tag').textContent = (WHO_LABEL[g.who] || g.who || '') + (g.date ? ' · ' + g.date : '');
    hoverBubble.querySelector('.kfbgy-tag').style.color = accent;
    hoverBubble.querySelector('.kfbgy-accent').style.background = accent;
    hoverBubble.querySelector('.kfbgy-text').textContent = g.hover || g.stone || '';
    hoverBubble.style.display = 'block';
    paintInk(hoverBubble, seed);
  }
  let fbBubbleVisible = false;
  function renderFbBubble(g) {
    const accent = WHO_COLOR[g.who] || '#26201a';
    fbBubble.querySelector('.kfbgy-tag').textContent = 'FrizzleBob liest · ' + (WHO_LABEL[g.who] || g.who || '');
    fbBubble.querySelector('.kfbgy-tag').style.color = accent;
    fbBubble.querySelector('.kfbgy-accent').style.background = accent;
    fbBubble.querySelector('.kfbgy-lesson').textContent = g.lesson || g.hover || '';
    const tr = fbBubble.querySelector('.kfbgy-trigger');
    if (g.trigger) { tr.style.display = 'block'; tr.textContent = 'Reißleine: „' + g.trigger + '“'; tr.style.color = accent; }
    else tr.style.display = 'none';
    fbBubble.style.display = 'block';
    fbBubbleVisible = true;
    paintInk(fbBubble, 900);
  }

  // ---------------------------------------------------------------- Auswahl + Guide-Lauf
  let selectedIdx = -1;
  async function fbWalkTo(pos, faceTarget) {
    if (!fb || fb._placeholder) return;
    const g = fb.group, from = g.position.clone();
    const dir = pos.clone().sub(from); dir.y = 0;
    const dist = dir.length();
    fb.busy = true;
    if (dist > 0.12) {
      fb._face(dir.clone().normalize());
      fb.play('enter');
      await fb._tw(Math.min(2.4, 0.4 + dist * 0.2), (t) => {
        const k = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        g.position.lerpVectors(from, pos, k);
        g.position.y = Math.abs(Math.sin(t * Math.PI * 3)) * 0.05;
      });
      g.position.y = 0;
    }
    if (faceTarget) { const fd = faceTarget.clone().sub(g.position); fd.y = 0; if (fd.length() > 0.01) fb._face(fd.normalize()); }
    fb.busy = false;
    fb.play('idle');
    fb.speak();
  }
  function selectGrave(i) {
    if (i < 0 || i >= GRAVES.length) return;
    if (o.onSelect) o.onSelect(i, GRAVES[i]);
    if (!fb || fb._placeholder || fb.busy) return;
    selectedIdx = i;
    fbBubbleVisible = false;
    fbBubble.style.display = 'none';
    const s = STONES[i], stonePos = new THREE.Vector3(s.x, 0, s.z);
    const toPlayer = new THREE.Vector3(camera.position.x - s.x, 0, camera.position.z - s.z);
    if (toPlayer.length() < 0.01) toPlayer.set(0, 0, 1);
    toPlayer.normalize();
    const stand = stonePos.clone().addScaledVector(toPlayer, Math.max(1.4, s.r + 0.9));
    fbWalkTo(stand, stonePos).then(() => {
      if (selectedIdx !== i || destroyed) return;
      if (o.bubbles) renderFbBubble(GRAVES[i]);
      const id = GRAVES[i].id || String(i);
      if (!visited.has(id)) { visited.add(id); if (o.onVisit) o.onVisit(i, GRAVES[i], api.progress()); }
    });
  }

  // ---------------------------------------------------------------- Input
  const keys = {};
  let yaw = o.spawn.yaw || 0, pitch = 0, locked = false, hovering = false;
  let dragging = false, dragX = 0, dragY = 0;
  const touchMove = { x: 0, y: 0 };
  let vy = 0, onGround = true, dolly = 0, panR = 0, panF = 0;
  const ptr = { x: 0, y: 0, active: false };
  const clock = new THREE.Clock();
  const GAME_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'ShiftLeft', 'ShiftRight', 'Space', 'KeyQ', 'KeyE', 'KeyL']);
  const isTouch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
  const clampPitch = () => { const m = Math.PI / 2 - 0.05; pitch = Math.max(-m, Math.min(m, pitch)); };
  const ndcAt = (cx, cy) => { const r = canvas.getBoundingClientRect(); return new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1); };

  function enter() {
    started = true; hovering = true;
    if (veil) veil.classList.add('kfbgy-hidden');
    if (o.pointerLock && !isTouch && canvas.requestPointerLock) { const p = canvas.requestPointerLock(); if (p && p.catch) p.catch(() => {}); }
    if (isTouch) stickEl.style.display = 'block';
  }

  function initInput() {
    if (veil) on(veil, 'click', enter);
    on(canvas, 'mouseenter', () => { hovering = true; });
    on(canvas, 'mouseleave', () => { if (!dragging) hovering = false; });
    const engaged = () => started && (!o.keyboardWhenHovered || hovering || locked || dragging);

    const onKey = (down) => (e) => {
      if (!GAME_KEYS.has(e.code)) return;
      if (!engaged()) { if (!down) keys[e.code] = false; return; }
      if (down && e.code === 'KeyL' && !e.repeat) lightMode = lightMode === 'candle' ? 'disco' : 'candle';
      keys[e.code] = down;
      e.preventDefault(); e.stopImmediatePropagation();
    };
    on(window, 'keydown', onKey(true), true);
    on(window, 'keyup', onKey(false), true);
    on(window, 'blur', () => { for (const k in keys) keys[k] = false; });

    on(canvas, 'wheel', (e) => {
      if (!started) return;
      if (e.shiftKey) {
        panR = Math.max(-6, Math.min(6, panR + e.deltaX * 0.01));
        panF = Math.max(-6, Math.min(6, panF - e.deltaY * 0.01));
      } else if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        yaw -= e.deltaX * 0.0016;
      } else {
        dolly = Math.max(-6, Math.min(6, dolly - e.deltaY * 0.012));
      }
      e.preventDefault();
    }, { passive: false });

    on(document, 'pointerlockchange', () => { locked = document.pointerLockElement === canvas; });
    let downX = 0, downY = 0, downT = 0;
    on(canvas, 'mousedown', (e) => {
      if (e.button !== 0 || !started) return;
      if (o.pointerLock && !isTouch && !locked && canvas.requestPointerLock) { const p = canvas.requestPointerLock(); if (p && p.catch) p.catch(() => {}); }
      dragging = true; hovering = true; dragX = e.clientX; dragY = e.clientY;
      downX = e.clientX; downY = e.clientY; downT = performance.now();
    });
    on(window, 'mouseup', (e) => {
      const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (dragging && performance.now() - downT < 400 && moved < 6) {
        const i = locked ? hoveredIdx : pickGrave(e.clientX, e.clientY);
        if (i >= 0) selectGrave(i);
      }
      dragging = false;
    });
    on(window, 'mousemove', (e) => {
      if (locked) { yaw -= e.movementX * 0.0022; pitch -= e.movementY * 0.0022; clampPitch(); }
      else if (dragging) { yaw -= (e.clientX - dragX) * 0.004; pitch -= (e.clientY - dragY) * 0.004; clampPitch(); dragX = e.clientX; dragY = e.clientY; }
      else { const n = ndcAt(e.clientX, e.clientY); ptr.x = n.x; ptr.y = n.y; ptr.active = true; }
    });

    // Touch: linke Hälfte Joystick (gehen), rechte schauen
    const active = {};
    on(canvas, 'pointerdown', (e) => {
      if (!started || e.pointerType === 'mouse') return;
      const r = canvas.getBoundingClientRect(), left = (e.clientX - r.left) < r.width * 0.5;
      active[e.pointerId] = { mode: left ? 'move' : 'look', sx: e.clientX, sy: e.clientY, ox: e.clientX, oy: e.clientY };
      if (left) { stickEl.style.left = (e.clientX - r.left - 60) + 'px'; stickEl.style.top = (e.clientY - r.top - 60) + 'px'; stickEl.style.display = 'block'; }
    });
    on(window, 'pointermove', (e) => {
      const a = active[e.pointerId]; if (!a) return;
      if (a.mode === 'look') { yaw -= (e.clientX - a.sx) * 0.005; pitch -= (e.clientY - a.sy) * 0.005; clampPitch(); a.sx = e.clientX; a.sy = e.clientY; }
      else {
        let dx = e.clientX - a.sx, dy = e.clientY - a.sy;
        const R = 55, len = Math.hypot(dx, dy);
        if (len > R) { dx *= R / len; dy *= R / len; }
        touchMove.x = dx / R; touchMove.y = dy / R;
        stickEl.querySelector('.kfbgy-nub').style.transform = `translate(${dx}px,${dy}px)`;
      }
    });
    const endTouch = (e) => {
      const a = active[e.pointerId]; if (!a) return;
      if (a.mode === 'look' && Math.hypot(e.clientX - a.ox, e.clientY - a.oy) < 10) {
        const i = pickGrave(e.clientX, e.clientY);
        if (i >= 0) selectGrave(i);
      }
      if (a.mode === 'move') { touchMove.x = 0; touchMove.y = 0; stickEl.querySelector('.kfbgy-nub').style.transform = 'translate(0,0)'; }
      delete active[e.pointerId];
    };
    on(window, 'pointerup', endTouch);
    on(window, 'pointercancel', endTouch);
  }

  function readGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) {
      if (!p) continue;
      const dz = (v) => Math.abs(v) < 0.15 ? 0 : v;
      const lx = dz(p.axes[0] || 0), ly = dz(p.axes[1] || 0);
      yaw -= dz(p.axes[2] || 0) * 0.045;
      pitch -= dz(p.axes[3] || 0) * 0.045; clampPitch();
      const a = p.buttons[0] && p.buttons[0].pressed;
      if (a && !readGamepad._a && onGround) { vy = 4.6; onGround = false; }
      readGamepad._a = a;
      return { x: lx, y: ly };
    }
    return null;
  }

  // ---------------------------------------------------------------- Hover
  const raycaster = new THREE.Raycaster();
  const CENTER = new THREE.Vector2(0, 0);
  let hoveredIdx = -1;
  const _v = new THREE.Vector3();

  function pickGrave(cx, cy) {
    raycaster.setFromCamera(ndcAt(cx, cy), camera);
    const hits = raycaster.intersectObjects(RAYCAST, false);
    return (hits.length && hits[0].distance < 45) ? hits[0].object.userData.gi : -1;
  }
  function updateHover() {
    if (!o.bubbles) return;
    if (!started) { hoverBubble.style.display = 'none'; hoveredIdx = -1; return; }
    const ndc = locked ? CENTER : (ptr.active ? ptr : null);
    if (!ndc) {
      if (hoveredIdx !== -1) { hoveredIdx = -1; hoverBubble.style.display = 'none'; if (counterEl) counterEl.textContent = GRAVES.length + ' Gräber'; }
      return;
    }
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(RAYCAST, false);
    let idx = -1;
    if (hits.length && hits[0].distance < 26) idx = hits[0].object.userData.gi;
    if (idx !== hoveredIdx) {
      hoveredIdx = idx;
      if (idx < 0) { hoverBubble.style.display = 'none'; if (counterEl) counterEl.textContent = GRAVES.length + ' Gräber'; }
      else { renderHoverBubble(GRAVES[idx], 100 + idx * 37); if (counterEl) counterEl.textContent = (idx + 1) + ' / ' + GRAVES.length; }
      if (o.onHover) o.onHover(idx, idx < 0 ? null : GRAVES[idx]);
    }
    if (idx < 0) return;
    _v.copy(ANCHORS[idx]).project(camera);
    if (_v.z > 1) { hoverBubble.style.display = 'none'; return; }
    hoverBubble.style.display = 'block';
    hoverBubble.style.left = Math.round((_v.x * 0.5 + 0.5) * W()) + 'px';
    hoverBubble.style.top = Math.round((-_v.y * 0.5 + 0.5) * H() - 14) + 'px';
  }
  function updateFbBubble() {
    if (!fbBubbleVisible || !fb || fb._placeholder) return;
    _v.copy(fb.group.position); _v.y += 1.5; _v.project(camera);
    if (_v.z > 1) { fbBubble.style.display = 'none'; return; }
    fbBubble.style.display = 'block';
    fbBubble.style.left = Math.round((_v.x * 0.5 + 0.5) * W()) + 'px';
    fbBubble.style.top = Math.round((-_v.y * 0.5 + 0.5) * H() - 14) + 'px';
  }

  // ---------------------------------------------------------------- Loop
  let composer = null;
  function tick() {
    if (destroyed) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!running) { render(); return; }

    if (keys.KeyQ) yaw += 1.7 * dt;
    if (keys.KeyE) yaw -= 1.7 * dt;

    let mx = 0, mz = 0;
    if (keys.KeyW || keys.ArrowUp) mz += 1;
    if (keys.KeyS || keys.ArrowDown) mz -= 1;
    if (keys.KeyD || keys.ArrowRight) mx += 1;
    if (keys.KeyA || keys.ArrowLeft) mx -= 1;
    mx += touchMove.x; mz -= touchMove.y;
    const gp = readGamepad();
    if (gp) { mx += gp.x; mz -= gp.y; }
    const len = Math.hypot(mx, mz);
    if (len > 1) { mx /= len; mz /= len; }

    const speed = o.walkSpeed * ((keys.ShiftLeft || keys.ShiftRight) ? o.sprint : 1) * dt;
    const fwd = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    const next = camera.position.clone().addScaledVector(fwd, mz * speed).addScaledVector(right, mx * speed);

    if (Math.abs(dolly) > 0.001) {
      next.addScaledVector(fwd, dolly * dt * 6);
      dolly *= Math.pow(0.03, dt);
      if (Math.abs(dolly) < 0.02) dolly = 0;
    }
    if (Math.abs(panR) > 0.001 || Math.abs(panF) > 0.001) {
      next.addScaledVector(right, panR * dt * 6).addScaledVector(fwd, panF * dt * 6);
      panR *= Math.pow(0.03, dt); panF *= Math.pow(0.03, dt);
      if (Math.abs(panR) < 0.02) panR = 0;
      if (Math.abs(panF) < 0.02) panF = 0;
    }
    for (const s of STONES) {
      const dx = next.x - s.x, dz = next.z - s.z, d = Math.hypot(dx, dz);
      if (d < s.r) { const push = (s.r - d) / (d || 1); next.x += dx * push; next.z += dz * push; }
    }
    next.x = Math.max(-55, Math.min(55, next.x));
    next.z = Math.max(-55, Math.min(55, next.z));
    if (keys.Space && onGround) { vy = 4.6; onGround = false; }
    vy -= 13 * dt;
    let y = camera.position.y + vy * dt;
    if (y <= o.eyeHeight) { y = o.eyeHeight; vy = 0; onGround = true; }
    next.y = y;
    camera.position.copy(next);
    camera.rotation.set(pitch, yaw, 0, 'YXZ');

    if (fb) { fb.update(dt); if (fbRig) fbRig.update(dt); }
    updateLights();
    updateHover();
    updateFbBubble();
    if (o.onTick) o.onTick(dt, api);
    render();
  }
  function render() { if (composer) composer.render(); else renderer.render(scene, camera); }

  function updateLights() {
    if (!GRAVE_LIGHTS.length) return;
    const tt = performance.now() * 0.001;
    if (lightMode === 'disco') {
      for (let k = 0; k < GRAVE_LIGHTS.length; k++) {
        const L = GRAVE_LIGHTS[k];
        const beat = Math.pow(0.5 + 0.5 * Math.sin(tt * 3.1 - k * 0.55), 6);
        L.light.intensity = L.base * (0.25 + 1.7 * beat);
        const hue = (tt * 0.12 + k * 0.09) % 1;
        L.light.color.setHSL(hue, 0.75, 0.6);
        if (L.flame) L.flame.material.color.setHSL(hue, 0.9, 0.6).multiplyScalar(1.8 + 1.4 * beat);
      }
    } else {
      for (const L of GRAVE_LIGHTS) {
        const f = 0.82 + 0.18 * Math.sin(tt * L.freq + L.phase) + 0.06 * Math.sin(tt * L.freq2 + L.phase * 1.7);
        L.light.intensity = L.base * f;
        L.light.color.copy(L.baseColor);
        if (L.flame) L.flame.material.color.copy(L.flameBase).multiplyScalar(0.8 + 0.3 * f);
      }
    }
  }

  function resize() {
    const w = W(), h = H();
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (composer) composer.setSize(w, h);
  }

  // ---------------------------------------------------------------- Boot
  try {
    await buildGraves();
    if (o.fence) await buildFence();
    if (o.scenery) await scatterScenery();
    if (o.guide) await spawnGuide();
    if (o.bloom) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(new THREE.Vector2(W(), H()), 0.85, 0.5, 0.9));
      composer.addPass(new OutputPass());
    }
    initInput();
    const ro = new ResizeObserver(resize);
    ro.observe(root);
    disposables.push({ dispose: () => ro.disconnect() });
    running = true;
    renderer.setAnimationLoop(tick);
  } catch (e) { fail(e); throw e; }

  // ---------------------------------------------------------------- API
  const api = {
    version: VERSION, THREE, scene, camera, renderer, root, graves: GRAVES,
    /** Veil überspringen / Zone betreten (Minigame-Start). */
    enter,
    pause() { running = false; },
    resume() { clock.getDelta(); running = true; },
    isRunning() { return running; },
    setLightMode(m) { lightMode = m === 'disco' ? 'disco' : 'candle'; return lightMode; },
    toggleLight() { return api.setLightMode(lightMode === 'candle' ? 'disco' : 'candle'); },
    lightMode() { return lightMode; },
    /** Guide zu Grab i schicken + Lehre zeigen (wie ein Klick). */
    guideTo(i) { selectGrave(i); },
    /** Kamera vor Grab i setzen (Minigame-Kamerafahrt/Respawn). */
    focusGrave(i, dist = 4) {
      const s = STONES[i]; if (!s) return;
      camera.position.set(s.x, o.eyeHeight, s.z + dist);
      yaw = 0; pitch = -0.08;
    },
    teleport(x, z, y) { camera.position.set(x, y != null ? y : o.eyeHeight, z); },
    graveAt(i) { return GRAVES[i] || null; },
    indexOf(id) { return GRAVES.findIndex(g => (g.id || '') === id); },
    /** Minigame-Score: besuchte Gräber (Guide hat die Lehre gelesen). */
    visited() { return [...visited]; },
    progress() { return { visited: visited.size, total: GRAVES.length, ratio: GRAVES.length ? visited.size / GRAVES.length : 0, done: visited.size >= GRAVES.length }; },
    resetProgress() { visited.clear(); },
    hideBubbles() { hoverBubble.style.display = 'none'; fbBubble.style.display = 'none'; fbBubbleVisible = false; },
    resize,
    dispose() {
      destroyed = true; running = false;
      renderer.setAnimationLoop(null);
      for (const [t, ty, fn, opt] of listeners) t.removeEventListener(ty, fn, opt);
      listeners.length = 0;
      for (const d of disposables) { try { d.dispose(); } catch (e) { /* egal */ } }
      scene.traverse(n => {
        if (n.isMesh) {
          n.geometry && n.geometry.dispose();
          const m = n.material;
          if (Array.isArray(m)) m.forEach(x => x && x.dispose());
          else if (m) m.dispose();
        }
      });
      if (scene.environment) scene.environment.dispose();
      renderer.dispose();
      root.remove();
      glbCache.clear();
    },
  };
  if (o.debugGlobal) window.__kfbGraveyard = api;
  if (o.onReady) o.onReady(api);
  return api;
}

export default createGraveyard;
