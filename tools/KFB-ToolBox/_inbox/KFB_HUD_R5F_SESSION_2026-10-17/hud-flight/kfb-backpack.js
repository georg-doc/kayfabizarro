/* KFB Rucksack R1 · HUD-Miniatur, 20-Fächer-Overlay, Kassettendeck
 *
 *   const lib  = createPropLibrary({ THREE });                     // lädt KayKit/Tiny-Treats-glTF, Knet-Look
 *   const view = createPropRenderer({ THREE });                    // EIN WebGL-Kontext für Miniatur, Fächer, Vorschau
 *   const mini = mountBackpackMini({ hud, lib, view });            // 3D-Rucksack in hud.backpack.host, wippt leicht
 *   const bag  = createBagOverlay({ host, palette: hud.palette, lib, view, items: DEFAULT_BAG });
 *   bag.on('open'|'close'|'select'|'insertTape'|'eject'|'ownSong'|'use', fn) · bag.open() · bag.close() · bag.toggle()
 *   bag.add(id) · bag.remove(id) · bag.count · bag.setInserted(tapeId)
 *
 * Kein Audio: 'insertTape' / 'ownSong' gehen an den Audio-Owner, der das HUD-Radio füttert.
 * Knet-Look ist eine Annäherung (Clay-SSOT KFB_CLAYMATION_STYLE_SSOT.md nicht gelesen): Original-Atlas bleibt, matt, Knetbeulen in der Normalen.
 */
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HudParts, mixHex } from './kfb-hud.js';
import { ITEMS, TAPES, PACK_MODEL, BAG_SLOTS } from './kfb-jukebox-data.js';

const F_DISP = "'Bangers','Nunito Sans',system-ui,sans-serif";
const F_MONO = "'JetBrains Mono',ui-monospace,monospace";
const F_TEXT = "'Nunito Sans',system-ui,sans-serif";
const F_PIX = HudParts.F_PIX;
const TAPE_BY_ID = Object.fromEntries(TAPES.map((t) => [t.id, t]));

function h(tag, css, kids) { const e = document.createElement(tag); if (css) e.style.cssText = css; if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach((k) => k != null && e.append(k)); return e; }

/* ---------- Knet-Material ---------- */
const NOISE = `
float kfbH(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719)))*43758.5453); }
float kfbN(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(kfbH(i),kfbH(i+vec3(1,0,0)),f.x),mix(kfbH(i+vec3(0,1,0)),kfbH(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(kfbH(i+vec3(0,0,1)),kfbH(i+vec3(1,0,1)),f.x),mix(kfbH(i+vec3(0,1,1)),kfbH(i+vec3(1,1,1)),f.x),f.y),f.z); }`;
function clayify(THREE, src, scale) {
  const m = new THREE.MeshStandardMaterial({ map: src.map || null, color: src.color ? src.color.clone() : 0xffffff, roughness: 0.86, metalness: 0, side: THREE.FrontSide });
  if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uK = { value: 6.5 / Math.max(0.05, scale) };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vOp;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvOp = position;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vOp;\nuniform float uK;' + NOISE)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        { vec3 q = vOp * uK; float e = 0.35; float n0 = kfbN(q);
          vec3 g = vec3(kfbN(q + vec3(e,0,0)) - n0, kfbN(q + vec3(0,e,0)) - n0, kfbN(q + vec3(0,0,e)) - n0);
          normal = normalize(normal + (mat3(viewMatrix) * g) * 0.55); }`)
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= 0.94 + 0.08 * kfbN(vOp * uK * 0.6);');
  };
  m.customProgramCacheKey = () => 'kfbClayProp';
  return m;
}

/* ---------- Bibliothek: lädt, normiert auf Einheitsgröße, cached ---------- */
export function createPropLibrary({ THREE }) {
  const loader = new GLTFLoader(); loader.setCrossOrigin('anonymous');
  const cache = new Map();
  function load(item) {
    if (!item || !item.url) return Promise.reject(new Error('kein Modell'));
    if (!cache.has(item.url)) cache.set(item.url, new Promise((res, rej) => loader.load(item.url, (g) => {
      const root = g.scene; const box = new THREE.Box3().setFromObject(root), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
      const k = 1 / Math.max(size.x, size.y, size.z, 1e-3);
      root.position.sub(c); const wrap = new THREE.Group(); wrap.add(root); wrap.scale.setScalar(k);
      root.traverse((o) => { if (o.isMesh) { const ms = Array.isArray(o.material) ? o.material : [o.material]; const nm = ms.map((mm) => clayify(THREE, mm, k)); o.material = Array.isArray(o.material) ? nm : nm[0]; } });
      wrap.userData.item = item; res(wrap);
    }, undefined, (e) => rej(e))));
    return cache.get(item.url);
  }
  return { load, get size() { return cache.size; } };
}

/* ---------- EIN Renderer für alle kleinen Ansichten; Ergebnis wird in 2D-Canvas kopiert ---------- */
export function createPropRenderer({ THREE }) {
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  r.outputColorSpace = THREE.SRGBColorSpace; r.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight('#F4F0FF', '#6B5A88', 1.5));
  const key = new THREE.DirectionalLight('#FFF1DE', 2.2); key.position.set(-2, 3, 3); scene.add(key);
  const rim = new THREE.DirectionalLight('#C6B8E4', 1.1); rim.position.set(2.5, 1.5, -2); scene.add(rim);
  const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 20);
  const holder = new THREE.Group(); scene.add(holder);
  function render(obj, target, { rotY = 0, tilt = 0.18, bob = 0, roll = 0, zoom = 1, spin = null } = {}) {
    const ctx = target.getContext('2d'), w = target.width, hh = target.height;
    if (!obj) { ctx.clearRect(0, 0, w, hh); return; }
    holder.clear(); holder.add(obj);
    obj.rotation.set(spin ? spin[0] : 0, spin ? spin[1] : 0, spin ? spin[2] : 0);
    holder.rotation.set(tilt, rotY, roll); holder.position.y = bob;
    cam.aspect = w / hh; cam.updateProjectionMatrix();
    const d = 2.35 / zoom * Math.max(1, 1 / cam.aspect); cam.position.set(0, 0.25 * d, d); cam.lookAt(0, 0, 0);
    if (r.domElement.width !== w || r.domElement.height !== hh) r.setSize(w, hh, false);
    r.render(scene, cam);
    ctx.clearRect(0, 0, w, hh); ctx.drawImage(r.domElement, 0, 0);
    holder.remove(obj);
  }
  return { render, renderer: r, dispose() { r.dispose(); } };
}

/* ---------- HUD-Miniatur ---------- */
export function mountBackpackMini({ hud, lib, view, model = PACK_MODEL, still = false }) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const cv = document.createElement('canvas'); cv.width = cv.height = Math.round(52 * dpr); cv.style.cssText = 'width:52px;height:52px;display:block';
  hud.backpack.host.append(cv);
  let obj = null, t = 0, hop = 0, alive = true;
  const api = {
    canvas: cv,
    hop() { hop = 1; },
    tick(dt) {
      if (!alive) return; t += dt; hop = Math.max(0, hop - dt * 2.2);
      const b = Math.sin(t * 2.1) * 0.035 + Math.sin(t * 15) * 0.05 * hop;
      view.render(obj, cv, { rotY: 0.55 + Math.sin(t * 0.7) * 0.18, tilt: 0.12, bob: b, roll: Math.sin(t * 1.3) * 0.04 + Math.sin(t * 19) * 0.06 * hop, zoom: 1.15 });
    },
    dispose() { alive = false; cv.remove(); }
  };
  lib.load(model).then((o) => { obj = o; if (still && alive) view.render(obj, cv, { rotY: 0.55, tilt: 0.12, zoom: 1.15 }); }).catch((e) => console.warn('Rucksack-Modell', e));
  return api;
}

/* ---------- Kassette (Knet-Platzhalter, DOM) ----------
 * Kompaktkassette 100 × 64: Gehäuse, Etikett mit Seite A und Schriftzeile, zwei Spulenlöcher weit außen (Mitten bei 30 % / 70 %),
 * dazwischen das Bandfenster, unten der Trapez-Steg mit zwei Löchern. Schrift sitzt links auf der Etikett-Linie. */
function cassette(P, tape, w = 44) {
  const H = Math.round(w * 0.64), u = w / 100;
  const shell = tape.color, dark = mixHex(shell, '#1a1226', 0.5), lo = mixHex(shell, '#000', 0.2), paper = '#FFF6E6';
  const ink = mixHex(shell, '#1a1226', 0.62), well = mixHex(P.wellBot, '#000', 0.25);
  const reelD = 15 * u;
  const hole = (x) => h('div', `position:absolute;left:${(x - 7.5) * u}px;top:${35 * u - reelD / 2}px;width:${reelD}px;height:${reelD}px;border-radius:50%;background:${well};box-shadow:inset 0 1px 2px rgba(0,0,0,.6)`, [
    h('div', `position:absolute;inset:${reelD * 0.2}px;border-radius:50%;background:${paper};box-shadow:0 0 0 ${Math.max(1, 1.2 * u)}px ${mixHex(paper, '#000', 0.25)}`, [
      h('div', `position:absolute;inset:${reelD * 0.18}px;border-radius:50%;background:${well}`)])]);
  const win = h('div', `position:absolute;left:${40 * u}px;top:${29 * u}px;width:${20 * u}px;height:${12 * u}px;border-radius:${2.5 * u}px;background:linear-gradient(180deg,${well},${mixHex('#6B4A3A', '#000', 0.2)});box-shadow:inset 0 1px 2px rgba(0,0,0,.55)`);
  const showText = w >= 38, text = tape.blank ? '' : tape.label.toUpperCase(), fs = Math.max(7, 10.5 * u);
  const label = h('div', `position:absolute;left:${10 * u}px;right:${10 * u}px;top:${7 * u}px;height:${44 * u}px;border-radius:${4 * u}px ${4 * u}px ${3 * u}px ${3 * u}px;background:${HudParts.GRAIN},${paper};background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;box-shadow:inset 0 -1px 0 rgba(60,40,80,.15)`, [
    h('div', `position:absolute;left:0;right:0;top:0;height:${5 * u}px;border-radius:${4 * u}px ${4 * u}px 0 0;background:${tape.blank ? mixHex(paper, '#000', 0.12) : mixHex(shell, '#ffffff', 0.15)}`),
    showText ? h('div', `position:absolute;left:${4 * u}px;top:${7 * u}px;width:${8 * u}px;height:${8 * u}px;border-radius:${2 * u}px;background:${ink};color:${paper};font:400 ${fs * 0.85}px/${8 * u}px ${F_PIX};text-align:center`, 'A') : null,
    showText ? h('div', `position:absolute;left:${15 * u}px;right:${4 * u}px;top:${7.4 * u}px;font:400 ${fs}px/1 ${F_PIX};letter-spacing:.03em;color:${ink};white-space:nowrap;overflow:hidden`, text) : null,
    h('div', `position:absolute;left:${15 * u}px;right:${4 * u}px;top:${17 * u}px;height:${Math.max(1, 0.9 * u)}px;background:${mixHex(ink, paper, 0.55)}`)
  ]);
  const foot = h('div', `position:absolute;left:${22 * u}px;right:${22 * u}px;bottom:0;height:${12 * u}px;clip-path:polygon(9% 0,91% 0,100% 100%,0 100%);background:${lo};display:flex;justify-content:space-between;align-items:center;padding:0 ${12 * u}px`, [
    h('div', `width:${3.6 * u}px;height:${3.6 * u}px;border-radius:50%;background:${dark}`), h('div', `width:${3.6 * u}px;height:${3.6 * u}px;border-radius:50%;background:${dark}`)]);
  const screws = [[4, 4], [96, 4], [4, 60], [96, 60]].map(([x, y]) => h('div', `position:absolute;left:${(x - 1.6) * u}px;top:${(y - 1.6) * u}px;width:${3.2 * u}px;height:${3.2 * u}px;border-radius:50%;background:${lo}`));
  return h('div', `position:relative;width:${w}px;height:${H}px;flex:none;border-radius:${6 * u}px ${5.5 * u}px ${6.5 * u}px ${6 * u}px;background:${HudParts.GRAIN},linear-gradient(180deg,${mixHex(shell, '#ffffff', 0.18)},${shell} 60%,${lo});background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;box-shadow:inset 0 ${1.5 * u}px 1px rgba(255,255,255,.4),inset 0 -${1.5 * u}px ${2 * u}px rgba(40,20,60,.25),0 ${Math.max(1.5, 2 * u)}px 0 ${dark};overflow:hidden;transform:rotate(-2deg)`,
    [label, ...screws, foot, hole(30), hole(70), win]);
}

/* ---------- Overlay · Rucksack klappt auf, 5 × 4 Knet-Mulden ---------- */
export function createBagOverlay({ host, palette: P, lib, view, items = [], slots = BAG_SLOTS, anchor = null }) {
  const L = {}; const emit = (ev, d) => (L[ev] || []).forEach((fn) => { try { fn(d); } catch (e) { console.error(e); } });
  const bag = Array.from({ length: slots }, (_, i) => items[i] || null);
  let sel = bag.findIndex((x) => x && ITEMS[x] && ITEMS[x].deck); if (sel < 0) sel = 0;
  let isOpen = false, inserted = null, t = 0;
  const models = {}; const shots = {};
  const dpr = Math.min(2, window.devicePixelRatio || 1);

  const root = h('div', `position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 55%,rgba(20,14,32,.18),rgba(20,14,32,.55));pointer-events:auto;z-index:8;font-family:${F_TEXT};-webkit-font-smoothing:antialiased;user-select:none`);
  root.setAttribute('data-kfb-bag', 'r1');
  const scaler = h('div', 'position:relative;transform-origin:50% 50%');
  root.append(scaler);
  const flapTitle = h('div', `font:400 30px/1 ${F_DISP};letter-spacing:.04em;color:${P.ink};text-shadow:0 2px 0 rgba(10,6,20,.35)`, 'RUCKSACK');
  const flapCount = h('div', `font:400 20px/1 ${F_PIX};color:${P.cream}`, '0 / 20');
  const knobX = h('button', `width:30px;height:30px;border:0;border-radius:50% 47% 52% 49% / 49% 52% 48% 51%;background:${HudParts.GRAIN},linear-gradient(180deg,${P.accentHi},${P.accent} 60%,${P.accentLo});background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;box-shadow:inset 0 2px 2px rgba(255,255,255,.45),0 2px 0 ${P.accentSocket};color:${P.accentInk};font:800 16px/30px ${F_TEXT};cursor:pointer;padding:0`, '✕');
  knobX.type = 'button'; knobX.title = 'Schließen (B / Esc)';
  const flap = h('div', HudParts.plaqueCss({ ...P, plaqueHi: P.plaque, plaque: P.plaqueLo, plaqueLo: mixHex(P.plaqueLo, '#000', 0.15) }, '34px 38px 14px 16px / 30px 34px 12px 14px', 'position:absolute;left:30px;right:30px;top:-44px;height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 14px 10px 20px;transform-origin:50% 100%;z-index:2'), [h('div', 'display:flex;align-items:baseline;gap:12px', [flapTitle, flapCount]), knobX]);
  const grid = h('div', 'display:grid;grid-template-columns:repeat(5,64px);grid-auto-rows:64px;gap:8px');
  const cells = bag.map((_, i) => {
    const c = h('button', HudParts.wellCss(P, `${14 + (i * 7) % 5}px ${16 - (i * 3) % 5}px ${15 + (i * 5) % 4}px ${13 + (i * 11) % 5}px`, 'position:relative;border:0;padding:0;cursor:pointer;display:grid;place-items:center;transition:transform .12s'));
    c.type = 'button'; c.addEventListener('click', () => select(i));
    return c;
  });
  cells.forEach((c) => grid.append(c));
  const pv = document.createElement('canvas'); pv.width = Math.round(236 * dpr); pv.height = Math.round(150 * dpr); pv.style.cssText = 'width:236px;height:150px;display:block';
  const pvTape = h('div', 'position:absolute;inset:0;display:none;place-items:center');
  const pvWell = h('div', HudParts.wellCss(P, '18px 22px 16px 20px / 20px 16px 22px 18px', 'position:relative;width:236px;height:150px;overflow:hidden'), [pv, pvTape]);
  const dName = h('div', `font:400 26px/1 ${F_DISP};letter-spacing:.03em;color:${P.ink};text-shadow:0 2px 0 rgba(10,6,20,.3)`);
  const dNote = h('div', `font:600 13px/1.4 ${F_TEXT};color:${P.wellTop};text-wrap:pretty`);
  const dSrc = h('div', `font:500 9.5px/1.4 ${F_MONO};letter-spacing:.06em;color:${P.socket}`);
  const dAct = h('div', 'display:flex;flex-direction:column;gap:8px');
  const detail = h('div', 'display:flex;flex-direction:column;gap:9px;width:236px', [pvWell, dName, dNote, dSrc, dAct]);
  const body = h('div', HudParts.plaqueCss(P, '30px 34px 40px 36px / 26px 30px 44px 40px', 'position:relative;display:flex;gap:18px;padding:30px 20px 20px;z-index:1'), [grid, detail]);
  const pack = h('div', 'position:relative;perspective:900px', [body, flap]);
  scaler.append(pack);
  host.append(root);
  const file = document.createElement('input'); file.type = 'file'; file.accept = 'audio/*'; file.style.display = 'none'; root.append(file);

  const btnCss = (primary) => primary
    ? `border:0;border-radius:12px 14px 11px 13px / 13px 11px 14px 12px;padding:9px 12px;font:800 13px/1 ${F_TEXT};cursor:pointer;color:${P.accentInk};background:${HudParts.GRAIN},linear-gradient(180deg,${P.accentHi},${P.accent} 60%,${P.accentLo});background-size:140px 140px,100% 100%;background-blend-mode:soft-light,normal;box-shadow:inset 0 2px 2px rgba(255,255,255,.45),0 3px 0 ${P.accentSocket}`
    : `border:0;border-radius:12px 14px 11px 13px / 13px 11px 14px 12px;padding:9px 12px;font:800 13px/1 ${F_TEXT};cursor:pointer;color:${P.ink};background:${P.socket};box-shadow:inset 0 2px 3px rgba(10,6,20,.5)`;
  const btn = (label, primary, fn) => { const b = h('button', btnCss(primary), label); b.type = 'button'; b.addEventListener('click', fn); b.addEventListener('pointerdown', () => (b.style.transform = 'translateY(2px)')); ['pointerup', 'pointerleave'].forEach((e) => b.addEventListener(e, () => (b.style.transform = ''))); return b; };

  function count() { return bag.filter(Boolean).length; }
  function drawCell(i) {
    const c = cells[i], id = bag[i]; c.innerHTML = '';
    c.style.boxShadow = i === sel ? `inset 0 3px 7px rgba(10,6,20,.78),0 0 0 2.5px ${P.accent}` : '';
    c.style.transform = i === sel ? 'translateY(-2px)' : '';
    c.title = id ? (ITEMS[id] ? ITEMS[id].name : TAPE_BY_ID[id] ? 'Kassette · ' + TAPE_BY_ID[id].label : id) : 'leer';
    if (!id) return;
    if (TAPE_BY_ID[id]) { c.append(cassette(P, TAPE_BY_ID[id], 46)); if (inserted === id) c.append(h('div', `position:absolute;right:4px;top:4px;width:8px;height:8px;border-radius:50%;background:${P.accent};box-shadow:0 0 6px ${P.accent}`)); return; }
    if (shots[id]) { const im = new Image(); im.src = shots[id]; im.style.cssText = 'width:58px;height:58px;pointer-events:none'; c.append(im); }
    else c.append(h('div', `width:22px;height:22px;border-radius:50% 47% 52% 49% / 49% 52% 48% 51%;background:${P.socket};opacity:.7`));
  }
  function drawAll() { cells.forEach((_, i) => drawCell(i)); flapCount.textContent = `${count()} / ${slots}`; drawDetail(); }

  function drawDetail() {
    const id = bag[sel]; dAct.innerHTML = '';
    const it = id && ITEMS[id], tp = id && TAPE_BY_ID[id];
    pv.style.display = tp ? 'none' : 'block'; pvTape.style.display = tp ? 'grid' : 'none'; pvTape.innerHTML = '';
    if (!id) { dName.textContent = 'Leeres Fach'; dNote.textContent = 'Hier passt noch etwas rein.'; dSrc.textContent = ''; return; }
    if (tp) {
      pvTape.append(cassette(P, tp, 150));
      dName.textContent = tp.blank ? 'Leerkassette' : 'Kassette · ' + tp.label;
      dNote.textContent = tp.blank ? 'Eigenen Song aufnehmen, dann einlegen.' : `${tp.tracks.length} Titel. Im Kassettenradio abspielen.`;
      dSrc.textContent = 'KNET-PLATZHALTER · KEIN TAPE-MODELL IN KAYKIT / TINY TREATS GEFUNDEN';
      const deckIdx = bag.findIndex((x) => x && ITEMS[x] && ITEMS[x].deck);
      if (tp.blank) dAct.append(btn('Song aufnehmen …', true, () => file.click()));
      else if (deckIdx >= 0) dAct.append(btn(inserted === id ? 'Läuft im Radio' : 'Ins Kassettenradio legen', inserted !== id, () => insert(id)));
      return;
    }
    dName.textContent = it.name; dNote.textContent = it.note; dSrc.textContent = it.pack.toUpperCase();
    if (it.deck) dAct.append(deck());
    if (id === 'item.donut.01') dAct.append(btn('Essen', true, () => { emit('use', { id }); remove(id); }));
  }

  /* Kassettendeck im Kassettenradio: Schacht + Kassetten aus dem Rucksack */
  function deck() {
    const tapes = bag.filter((x) => x && TAPE_BY_ID[x]);
    const cur = inserted && TAPE_BY_ID[inserted];
    const slot = h('div', HudParts.wellCss(P, '10px 12px 9px 11px', 'display:flex;align-items:center;gap:10px;padding:7px 10px;min-height:44px'),
      cur ? [cassette(P, cur, 42), h('div', `font:400 15px/1.1 ${F_PIX};color:${P.cream};flex:1`, cur.label.toUpperCase()), btn('Auswerfen', false, () => eject())]
        : [h('div', `font:400 15px/1 ${F_PIX};color:${P.dim}`, 'SCHACHT LEER')]);
    const list = h('div', 'display:flex;flex-wrap:wrap;gap:6px', tapes.filter((x) => x !== inserted).map((x) => {
      const tp = TAPE_BY_ID[x]; const b = h('button', `border:0;background:none;padding:2px;cursor:pointer;border-radius:8px`, [cassette(P, tp, 40)]);
      b.type = 'button'; b.title = tp.blank ? 'Leerkassette: erst aufnehmen' : 'Einlegen: ' + tp.label;
      b.addEventListener('click', () => (tp.blank && !tp.own ? file.click() : insert(x))); return b;
    }));
    return h('div', 'display:flex;flex-direction:column;gap:7px', [h('div', `font:700 9px/1 ${F_MONO};letter-spacing:.14em;color:${P.socket}`, 'KASSETTENDECK'), slot, list]);
  }

  function insert(id) { inserted = id; emit('insertTape', { tape: TAPE_BY_ID[id] }); drawAll(); }
  function eject() { const was = inserted; inserted = null; emit('eject', { tape: was && TAPE_BY_ID[was] }); drawAll(); }
  file.addEventListener('change', () => {
    const f = file.files && file.files[0]; if (!f) return; file.value = '';
    const own = { id: 'tape.own.' + Date.now(), label: f.name.replace(/\.[^.]+$/, '').slice(0, 24), color: '#FFC3A2', tracks: [], own: true, file: f };
    TAPE_BY_ID[own.id] = own;
    const bi = bag.indexOf('tape.blank'); if (bi >= 0) bag[bi] = own.id; else { const e = bag.indexOf(null); if (e >= 0) bag[e] = own.id; }
    emit('ownSong', { file: f, name: f.name, tape: own }); insert(own.id);
  });

  function select(i) { sel = i; drawAll(); emit('select', { index: i, id: bag[i] }); const id = bag[i]; if (id && ITEMS[id]) ensureModel(id); }
  function ensureModel(id) {
    if (models[id] || !ITEMS[id]) return;
    models[id] = 'loading';
    lib.load(ITEMS[id]).then((o) => {
      models[id] = o;
      const c = document.createElement('canvas'); c.width = c.height = Math.round(58 * dpr);
      const v = ITEMS[id].view || {}; view.render(o, c, { rotY: v.rotY ?? 0.5, tilt: v.tilt ?? 0.3, spin: ITEMS[id].spin, zoom: v.zoom ?? 1.05 }); shots[id] = c.toDataURL();
      const i = bag.indexOf(id); if (i >= 0) drawCell(i);
    }).catch((e) => { models[id] = null; console.warn('Item-Modell', id, e); });
  }
  function add(id) { const e = bag.indexOf(null); if (e < 0) return false; bag[e] = id; if (ITEMS[id]) ensureModel(id); drawAll(); emit('change', { count: count() }); return true; }
  function remove(id) { const i = bag.indexOf(id); if (i < 0) return; bag[i] = null; if (inserted === id) eject(); drawAll(); emit('change', { count: count() }); }

  function fit() {
    const w = host.clientWidth || 1280, hh = host.clientHeight || 720;
    const k = Math.min(1, (w - 24) / 640, (hh - 30) / 440); scaler.style.transform = `scale(${Math.max(0.3, k).toFixed(3)})`;
  }
  function open() {
    if (isOpen) return; isOpen = true; root.style.display = 'flex'; fit(); drawAll();
    Object.keys(ITEMS).forEach((id) => bag.includes(id) && ensureModel(id));
    const a = anchor ? anchor() : null;
    const from = a ? `translate(${a.x}px,${a.y}px) scale(.12)` : 'translateY(30px) scale(.6)';
    pack.animate([{ transform: from, opacity: 0.2 }, { transform: 'translate(0,0) scale(1.04,.96)', opacity: 1, offset: 0.62 }, { transform: 'scale(.98,1.02)', offset: 0.82 }, { transform: 'none' }], { duration: 460, easing: 'cubic-bezier(.3,.9,.4,1)' });
    flap.animate([{ transform: 'translateY(46px) rotateX(-8deg) scaleY(.6)' }, { transform: 'translateY(46px) rotateX(-8deg) scaleY(.6)', offset: 0.45 }, { transform: 'translateY(-6px) rotateX(18deg)', offset: 0.78 }, { transform: 'none' }], { duration: 640, easing: 'cubic-bezier(.3,1.3,.5,1)' });
    root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220 });
    emit('open', {});
  }
  function close() {
    if (!isOpen) return; isOpen = false;
    const a = anchor ? anchor() : null;
    const to = a ? `translate(${a.x}px,${a.y}px) scale(.12)` : 'translateY(30px) scale(.6)';
    const an = pack.animate([{ transform: 'none' }, { transform: 'scale(1.03,.97)', offset: 0.25 }, { transform: to, opacity: 0.1 }], { duration: 300, easing: 'cubic-bezier(.6,0,.8,.5)' });
    root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 });
    an.onfinish = () => { if (!isOpen) root.style.display = 'none'; };
    emit('close', {});
  }
  knobX.addEventListener('click', close);
  root.addEventListener('pointerdown', (e) => { if (e.target === root) close(); });
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null; ro && ro.observe(host);
  drawAll();

  return {
    el: root,
    on(ev, fn) { (L[ev] = L[ev] || []).push(fn); },
    open, close, toggle() { isOpen ? close() : open(); }, get isOpen() { return isOpen; },
    add, remove, select, get count() { return count(); }, get slots() { return slots; }, get items() { return bag.slice(); },
    setInserted(id) { inserted = id; drawAll(); }, get inserted() { return inserted && TAPE_BY_ID[inserted]; },
    tapeById: (id) => TAPE_BY_ID[id],
    preload() { Object.keys(ITEMS).forEach((id) => bag.includes(id) && ensureModel(id)); },
    tick(dt) {
      if (!isOpen) return; t += dt;
      const id = bag[sel]; const o = id && models[id];
      const v = (ITEMS[id] && ITEMS[id].view) || {};
      if (o && o !== 'loading') view.render(o, pv, { rotY: (v.rotY ?? 0.5) + Math.sin(t * 0.9) * 0.55, tilt: v.tilt ?? 0.3, bob: Math.sin(t * 2) * 0.03, spin: ITEMS[id].spin, zoom: (v.zoom ?? 1.05) * 1.05 });
    },
    dispose() { ro && ro.disconnect(); root.remove(); }
  };
}
