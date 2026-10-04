/* KFB WB-DESIGN-PARALLEL-01 · Cologne World Visual / Authoring Shell · Host
   Drei Ansichten, eine Szene:
     01 FIXTURE   die eingefrorene echte Köln-Fixture allein, Quellansicht (keine KFB-Gestaltung)
     02 LANDMARK  der Dom-Donor allein: wie geliefert ⇄ mit Turm-Biegung/Torsion
     03 SHELL     beides integriert in die WB-W0-Region + Editor + Track-Socket
   Kein OSM-Abruf, kein zweiter Runtime, kein Schema: Zone kommt über wd1-seam.js. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { crossSection, routeFromRacer, buildTerrain, rectZone } from './w0-region.js';
import { createInk } from './w0-ink.js';
import { loadZone, SEAM } from './wd1-seam.js';
import { buildCityLayer, layersFrom, FACADE_RULE } from './wd1-city.js';
import { makeLandmark, makeHbf, hbfBaseIds, fitHbfToEnvelope, overrideEntry, validatePlacement } from './wd1-landmark.js';
import { makeWater, PRESETS as WATER_PRESETS } from './wd1-water.js';
import { buildStreetNames } from './wd1-names.js';

const PIN = 'c049cae386e1', PIN_EDIT = '8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e';
const K = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@' + PIN + '/';
const OPT = K + 'tools/KFB-ToolBox/_inbox/KFB%20Cologne%20Race%20Option%20C-2/lab-v9/';
const URL = {
  world: OPT + 'cologne-world.v1.js', style: OPT + 'option-c-style.v1.js', route: OPT + 'cologne-route.v1.js',
  cartoon: K + 'tools/osm-city-lab/src/style/cartoon-city.js', cityStyle: K + 'tools/osm-city-lab/styles/kfb-city-v0.json',
  sky: K + 'travel/wip/travel_globe_wsa/globe-v13/sky-presets.js',
  edit: 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@' + PIN_EDIT + '/tools/KFB-ToolBox/lib/edit-layer.js',
  elastic: 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@0c59e92d9d8688f5a88cd309ae8891dcd174c2fc/tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs',
  fluid: K + 'tools/KFB-ToolBox/_inbox/KFB%20StoryMap%20v1/kfb-fluid-v2/card-zone-v2-fluid-source.js',
  landmarks: OPT + 'cologne-landmarks.v1.js'
};
/* Zonen (S1.1 WB-D2): EINE Seam, je Zone eine eingefrorene Fixture. Auswahl = Host-Setzung `wd1.zone`
   (localStorage, in-app Chip, Seite lädt neu). Live-Wechsel ohne Reload ist S1.2. */
const ZONES = {
  'cologne-dom': { url: './fixtures/cologne-dom-crop-v0.json', label: 'Köln Dom/Hbf', full: true },
  huerth: { url: './fixtures/huerth-crop-v0.json', label: 'Hürth', full: false },
  alstaedten: { url: './fixtures/huerth-alstaedten-v0.json', label: 'Hürth-Alstädten', full: false }
};
const ZONE_ID = (() => { try { const z = localStorage.getItem('wd1.zone'); return ZONES[z] ? z : 'cologne-dom'; } catch { return 'cologne-dom'; } })();
function pickZone(z) { if (z === ZONE_ID) return; try { localStorage.setItem('wd1.zone', z); } catch {} location.reload(); }
/* Fassadenregel (Host-Setzung `wd1.facade`): 'rule-v1' = FACADE_RULE global · 'owner' = protectedDetails() wörtlich, zum Vergleich */
const FACADE = (() => { try { return localStorage.getItem('wd1.facade') === 'owner' ? 'owner' : 'rule-v1'; } catch { return 'rule-v1'; } })();
function pickFacade(f) { if (f === FACADE) return; try { localStorage.setItem('wd1.facade', f); } catch {} location.reload(); }
const FONT = "'JetBrains Mono',ui-monospace,monospace";
const INK = '#e7dfd0', GOLD = '#ffd9a0', OKC = '#a8d59a', BAD = '#ff9a86', DIM = 'rgba(231,223,208,.62)', LINE = 'rgba(231,223,208,.16)', BG = 'rgba(23,21,29,.86)';
const mk = (t, css, txt) => { const e = document.createElement(t); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; };
const r1 = (v) => Math.round(v * 10) / 10;

/* Zweistufiger Modul-Lader (WorldDesign-Befund: einzelne jsDelivr-Module scheitern bei import()) */
async function imp(url) {
  try { return await import(url); } catch (e1) {
    try { return await import(url + (url.includes('?') ? '&' : '?') + 'r=1'); } catch (e2) {
      const txt = await (await fetch(url)).text(), base = url.slice(0, url.lastIndexOf('/') + 1);
      const src = txt.replace(/(from\s+|import\s*\()(['"])(\.\.?\/[^'"]+)\2/g, (m, a, q, p) => a + q + new window.URL(p, base).href + q);
      return import(window.URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
    }
  }
}

/* ---------- Props (DC-Tweaks) ---------- */
const P = Object.assign({ view: 'SHELL', bend: 1, torsion: 1.2, chrome: 'QUIET', ghosts: false, names: 'signs' }, window.__wd1Props || {});
const NAME_MODES = [['off', 'off'], ['road', 'on road'], ['signs', 'signs'], ['both', 'both']];

/* ---------- Gerüst ---------- */
const canvas = mk('canvas', 'position:fixed;inset:0;width:100%;height:100%;display:block;touch-action:none;outline:none;background:#05070f');
canvas.tabIndex = 0;
const bar = mk('div', 'position:fixed;left:10px;top:10px;right:10px;display:flex;gap:10px;align-items:flex-start;justify-content:space-between;pointer-events:none;font:400 10px/1.3 ' + FONT + ';z-index:6');
const barL = mk('div', 'display:flex;flex-wrap:wrap;gap:8px;align-items:center;min-width:0;pointer-events:none');
const barR = mk('div', 'display:flex;gap:0;flex:none;pointer-events:none');
bar.append(barL, barR);
/* Socket-Beschriftung als kleines Bildschirm-Tag (feste Pixelgröße) statt 3D-Sprite, das nah vor der Kamera riesig wurde */
const socketTag = mk('div', 'position:fixed;z-index:4;pointer-events:none;transform:translate(-50%,-100%);padding:3px 6px;background:#1b1a22;border:1px solid #6b5a36;color:' + '#ffd9a0' + ';font:600 9.5px/1.2 ' + FONT + ';letter-spacing:.06em;white-space:nowrap', 'TRACK SOCKET · empty · module by reference');
socketTag.hidden = true;
const drawer = mk('div', 'position:fixed;right:10px;top:52px;bottom:44px;width:320px;overflow:auto;box-sizing:border-box;padding:10px;background:' + BG + ';color:' + INK + ';font:400 10.5px/1.45 ' + FONT + ';border:1px solid ' + LINE + ';z-index:5;display:flex;flex-direction:column;gap:8px');
const status = mk('div', 'position:fixed;left:10px;bottom:10px;max-width:calc(100% - 20px);background:' + BG + ';border:1px solid ' + LINE + ';padding:5px 8px;color:' + INK + ';font:400 10.5px/1.4 ' + FONT + ';z-index:6;pointer-events:none');
const objmenu = mk('div', 'position:fixed;z-index:10;display:flex;gap:3px;padding:3px;background:#14130fee;border:1px solid #4a4433;transform:translate(-50%,0)');
objmenu.hidden = true;
for (const [m, t, tip] of [['translate', '✥', 'Move (G)'], ['rotate', '⟳', 'Rotate (R)'], ['scale', '⤢', 'Scale gizmo (S)'], ['scale-down', '−', 'Smaller ×0.8'], ['scale-up', '+', 'Larger ×1.25'], ['floor', '⬓', 'Drop onto the ground (F)'], ['close', '✕', 'Deselect (Esc)']]) {
  const b = mk('button', 'width:26px;height:26px;padding:0;font:12px/1 ' + FONT + ';cursor:pointer;background:#2a261d;color:' + INK + ';border:1px solid #554d3d', t);
  b.dataset.m = m; b.title = tip; objmenu.appendChild(b);
}
document.body.append(canvas, bar, drawer, status, objmenu, socketTag);
const LOG = [];
let sayT = 0;
const say = (t, k) => { status.textContent = t; status.style.color = k === 'bad' ? BAD : k === 'ok' ? OKC : INK; status.hidden = false; clearTimeout(sayT); if (k !== 'bad') sayT = setTimeout(() => { status.hidden = true; }, 5000); };
const log = (t, bad) => { LOG.push((bad ? '✗ ' : '✓ ') + t); console.info('[wd1]', t); say(t, bad ? 'bad' : ''); paintSoon(); };

/* ---------- Renderer ---------- */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, logarithmicDepthBuffer: false });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 1.5, 30000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = 0.08; controls.maxPolarAngle = Math.PI * 0.495; controls.screenSpacePanning = false;
let ink = null;
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); if (ink) ink.setSize(w, h); layoutUI(); }
addEventListener('resize', resize);

/* ---------- Zustand ---------- */
const S = { ready: false, names: P.names, view: P.view, drawer: P.chrome === 'FULL', ink: false, wind: false, ghosts: P.ghosts === true, tw: null, bend: +P.bend, torsion: +P.torsion };
const G = {};           // Gruppen je Ansicht
const M = {};           // Module
const X = { zone: null, route: null, xs: null, terrain: null, city: null, fixture: null, lm: null, iso: null, entry: null, valid: null, socket: null };
let EDIT = null;

/* ---------- Kameras ---------- */
const CAMS = {
  REGION: { p: [-600, 290, 320], t: [-250, 0, 0] },
  LANDMARK: { p: [-500, 105, 250], t: [-320, 62, 60] },
  STREET: { p: [-400, 7, -58], t: [-250, 22, -20] },
  TOP: { p: [-220, 980, 1], t: [-220, 0, 0] },
  FIXTURE: { p: [-220, 760, 430], t: [-220, 0, 0] },
  ISO: { p: [2600, 120, 420], t: [2600, 72, 0] }
};
function camTo(name, dur = 1.3) { const c = CAMS[name]; S.tw = { p0: camera.position.clone(), t0: controls.target.clone(), p1: new THREE.Vector3(...c.p), t1: new THREE.Vector3(...c.t), t: 0, dur }; S.cam = name; paintSoon(); }

/* ---------- Aufbau ---------- */
async function boot() {
  resize();
  say('loading donors …');
  const [WORLD, OC, R, CC, SKY, EL, EG, FL, LM, cityStyle] = await Promise.all([imp(URL.world), imp(URL.style), imp(URL.route), imp(URL.cartoon), imp(URL.sky), imp(URL.edit), imp(URL.elastic), imp(URL.fluid), imp(URL.landmarks), fetch(URL.cityStyle).then((r) => r.json())]);
  Object.assign(M, { WORLD, OC, R, CC, SKY, EL, EG, FL, LM, cityStyle });
  log('donors · cologne-world/option-c-style/cologne-route @' + PIN + ' · cartoon-city + kfb-city-v0 @' + PIN + ' · Elastic Grotesque Clay V2 @0c59e92d · card-zone-v2 fluid source @' + PIN + ' · edit-layer @' + PIN_EDIT.slice(0, 8));

  /* Himmel + Licht: TinySkies DAY, derselbe Weg wie WB-W0 */
  const day = SKY.getSkyPreset('day');
  scene.background = SKY.paintRadialSky(THREE, day, 512);
  scene.fog = new THREE.Fog(day.fogColor, 1600, 14000);
  const rig = SKY.buildLightRig(THREE, scene, day);
  X.lights = []; scene.traverse((o) => { if (o.isLight) X.lights.push([o, o.intensity]); });
  setLight(LIGHT_K);
  X.sun = rig.sun; rig.sun.castShadow = true; rig.sun.shadow.mapSize.set(4096, 4096);
  /* Schattenbox folgt dem Blickpunkt (shadowFollow): normalBias 0,9 m + bias −0,0005 auf 2200 m Tiefe hoben den
     Schatten ~1,5 m vom Hausfuß ab (helles Band). Jetzt ~0,1 m, Box 90–560 m je nach Abstand. */
  rig.sun.shadow.bias = -0.00003;
  scene.add(rig.sun.target);
  log('TinySkies sky-presets.js · DAY · buildLightRig · paintRadialSky');

  /* Zone über die Seam */
  const zone = X.zone = await loadZone({ kind: 'frozen-fixture', url: ZONES[ZONE_ID].url });
  log('zone · ' + zone.id + ' · ' + zone.counts.buildings + ' buildings · ' + zone.counts.roadParts + ' road parts · ' + zone.counts.water + ' water · ' + (zone.provenance.osmBaseTimestamp ? 'OSM ' + zone.provenance.osmBaseTimestamp : 'retrieved ' + zone.provenance.retrievedAt));
  { const rw = zone.rectW, cx = (rw.minX + rw.maxX) / 2, cz = (rw.minZ + rw.maxZ) / 2; CAMS.FIXTURE = { p: [cx, 760, cz + 430], t: [cx, 0, cz] }; }
  if (!ZONES[ZONE_ID].full) {
    /* Zone ohne Region/Landmarke/Socket (Hürth bis S1.3/S1.4): 01 FIXTURE + 03 SHELL mit derselben Stadt-Darstellung
       wie Köln (Elastic Grotesque Clay V2, KFB_WONKY_90S_CLAY_V1, Bodenkarte, Fassadenregel) auf einer ebenen Bodenfläche. */
    S.lite = true;
    const rw = zone.rectW, cx = (rw.minX + rw.maxX) / 2, cz = (rw.minZ + rw.maxZ) / 2;
    const far = new THREE.Mesh(new THREE.CircleGeometry(16000, 64).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x86a85a, roughness: 1 }));
    far.position.set(cx, -0.6, cz); far.receiveShadow = true; far.name = 'far-ground'; scene.add(far); X.far = far;
    G.terrain = far;
    X.city = buildCityLayer(zone, { mode: 'elastic', style: cityStyle, CC, EG, FL, ghosts: false, renderer, facade: FACADE });
    G.city = X.city.group; scene.add(G.city);
    await addNames(cityStyle);
    const cs = X.city.stats, fa = cs.facade;
    log('city · Elastic Grotesque Clay V2 ' + cs.buildings + '/' + zone.counts.buildings + (cs.failed ? ' · ' + cs.failed + ' failed' : '') + ' · flat-roof routed ' + cs.flatRoofRouted + ' · ' + fa.rule + ': ' + fa.windows + ' windows · ' + fa.doors + ' doors · ' + fa.garageDoors + ' garage doors · ' + fa.partyEdges + '/' + fa.edges + ' party-wall edges skipped · ' + fa.bare + ' buildings bare · ground map ' + cs.groundTexture, cs.buildings !== zone.counts.buildings);
    /* Kameras relativ zur Zone; STREET auf der längsten Stotzheimer-Straße-Mittellinie (Pilot-Label), sonst längste benannte Fahrstraße */
    CAMS.REGION = { p: [cx - 380, 290, cz + 320], t: [cx - 30, 0, cz] };
    CAMS.TOP = { p: [cx, 980, cz + 1], t: [cx, 0, cz] };
    const lenOf = (r) => { let s = 0; for (let i = 1; i < r.line.length; i++) s += Math.hypot(r.line[i].x - r.line[i - 1].x, r.line[i].z - r.line[i - 1].z); return s; };
    const named = zone.roads.filter((r) => r.drive && r.name && r.tunnel !== 'yes' && r.line.length > 1).sort((a, b) => lenOf(b) - lenOf(a));
    const sr = named.find((r) => /Stotzheimer/.test(r.name)) || named[0];
    if (sr) {
      const L = sr.line, m = L[Math.floor((L.length - 1) / 2)], nx = L[Math.min(L.length - 1, Math.floor((L.length - 1) / 2) + 1)];
      const dx = nx.x - m.x, dz = nx.z - m.z, l = Math.hypot(dx, dz) || 1;
      CAMS.STREET = { p: [m.x - dx / l * 25, 4.5, m.z - dz / l * 25], t: [m.x + dx / l * 40, 5, m.z + dz / l * 40] };
      X.streetCam = sr.name + ' · ' + sr.id;
    }
    if (X.names && X.names.home) {
      /* HOME: vom nächsten Punkt der eigenen Straße schräg auf die Hausnummer */
      const c = X.names.home.centroid, st = zone.home.address.replace(/\s+\d+\w*$/, '');
      let best = null;
      for (const r of zone.roads.filter((q) => q.name === st)) for (let i = 1; i < r.line.length; i++) {
        const A = r.line[i - 1], B = r.line[i], dx = B.x - A.x, dz = B.z - A.z, l2 = dx * dx + dz * dz || 1, t = Math.max(0, Math.min(1, ((c.x - A.x) * dx + (c.z - A.z) * dz) / l2));
        const p = { x: A.x + dx * t, z: A.z + dz * t, dx, dz }, d = Math.hypot(p.x - c.x, p.z - c.z); if (!best || d < best.d) best = { ...p, d };
      }
      if (best) {
        const ox = best.x - c.x, oz = best.z - c.z, ol = Math.hypot(ox, oz) || 1, tl = Math.hypot(best.dx, best.dz) || 1;
        /* Kamera über der Fahrbahnmitte (nicht jenseits davon — dort stehen die Häuser gegenüber), 30 m die Straße entlang */
        CAMS.HOME = { p: [best.x - best.dx / tl * 30, 22, best.z - best.dz / tl * 30], t: [c.x, 3, c.z] };
        S.cam = 'HOME';
      }
    }
    S.ready = true;
    setView(P.view === 'FIXTURE' ? 'FIXTURE' : 'SHELL', true); paint();
    say('ready · ' + zone.id + ' · 03 SHELL same presentation as Cologne · 02 LANDMARK follows with S1.4', 'ok');
    return;
  }
  const Ly = layersFrom(cityStyle);

  /* WB-W0 Region: Route → Querschnitt → Gelände um Stadtplatte + Route */
  X.xs = crossSection(R.TRACK_WIDTH);
  X.route = routeFromRacer(R);
  const rw = zone.rectW, cx = (rw.minX + rw.maxX) / 2, cz = (rw.minZ + rw.maxZ) / 2;
  const cityPad = Object.assign(rectZone('city-plate', new THREE.Vector3(cx, 0, cz), 0, (rw.maxX - rw.minX) / 2 + 8, (rw.maxZ - rw.minZ) / 2 + 8, 0, 'city'), { y: 0, blend: 70 });
  G.terrain = new THREE.Group(); G.terrain.name = 'region';
  X.terrain = buildTerrain({ route: X.route, xs: X.xs, pads: [cityPad], center: new THREE.Vector3(cx, 0, cz), half: 640, step: 5, erosionTalusDeg: 25, edgeColor: new THREE.Color(0x86a85a), log: (t) => log(t) });
  G.terrain.add(X.terrain.mesh);
  scene.add(G.terrain);
  const far = new THREE.Mesh(new THREE.CircleGeometry(16000, 64).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x86a85a, roughness: 1 }));
  far.position.set(cx, -0.6, cz); far.receiveShadow = true; far.name = 'far-ground'; scene.add(far); X.far = far;

  /* Landmarken zuerst platzieren — die Hbf-Halle bestimmt, welche OSM-Teile ihre Basis sind */
  X.dom = { entry: overrideEntry(zone, 'dom'), lm: makeLandmark({ WORLD, CC, EG, style: cityStyle, elastic: true, kfb: true, bend: S.bend, torsion: S.torsion }), ref: () => zone.landmark.centroid, axis: zone.landmark.axisDeg };
  X.hbf = { entry: overrideEntry(zone, 'hbf'), lm: makeHbf({ LM, CC, EG, zone }), ref: () => ({ x: zone.hbf.anchor.x, z: -zone.hbf.anchor.z }), axis: zone.hbf.axisDeg };
  X.LMS = [X.dom, X.hbf];
  for (const r of X.LMS) { r.lm.holder.userData.sceneObjectId = r.entry.id; applyPlacement(r); }
  const fit = fitHbfToEnvelope(zone, X.hbf.lm);
  if (fit) {
    const a0 = X.hbf.ref(); X.hbf.fitCenter = fit.center; X.hbf.lm.fitCenter = fit.center; X.hbf.ref = () => X.hbf.fitCenter;
    Object.assign(X.hbf.entry.placement, { originPolicy: 'osm-hall-roof-envelope (fit)', fit: { ...fit, anchorOffsetM: +Math.hypot(fit.center.x - a0.x, fit.center.z - a0.z).toFixed(1), node: X.hbf.entry.osm } });
    applyPlacement(X.hbf);
    log('hbf fit · OSM hall roofs ' + fit.parts.join(', ') + ' → ' + fit.lengthM + ' × ' + fit.widthM + ' m (donor ×' + fit.sx + ' / ×' + fit.sz + ', height kept) · centre ' + X.hbf.entry.placement.fit.anchorOffsetM + ' m from the station node');
  } else log('hbf fit · no OSM hall roof under the donor — kept at the station node', true);
  const hbfIds = hbfBaseIds(zone, X.hbf.lm);
  /* Stadt (KFB-Darstellung) */
  X.city = buildCityLayer(zone, { mode: 'elastic', style: cityStyle, CC, EG, FL, ghosts: S.ghosts, renderer, extraBase: new Set(hbfIds), facade: FACADE });
  G.city = X.city.group; scene.add(G.city);
  await addNames(cityStyle);
  { const fa = X.city.stats.facade; log('facade · ' + fa.rule + ': ' + fa.windows + ' windows · ' + fa.doors + ' doors · ' + fa.garageDoors + ' garage doors · ' + fa.partyEdges + '/' + fa.edges + ' party-wall edges skipped · ' + fa.streetDoors + ' doors on the street-facing edge · ' + fa.bare + ' buildings bare · ' + fa.capped + ' capped'); }
  log('city · Elastic Grotesque Clay V2 ' + X.city.stats.buildings + ' · protectedDetails ' + X.city.stats.details + ' · ground map ' + X.city.stats.groundTexture + ' · roads ' + JSON.stringify(X.city.stats.roadsByTier) + ' · main rails ' + X.city.stats.railParts + ' · tunnels hidden ' + X.city.stats.tunnelsSkipped + ' · socket ghosts ' + X.city.stats.ghosts);
  X.water = makeWater({ FL, WORLD, waters: X.city.waters, log });
  log('water · ' + X.city.waters.length + ' bodies · Rhine flow (PCA of OSM polygon) ' + JSON.stringify(X.city.stats.rhineFlow) + ' · presets river/still from app settings');

  /* Landmarken (externe Platzierung nach LANDMARK_OVERRIDES.md) */
  X.dom.base = X.city.base; X.hbf.base = X.city.base2; X.hbf.entry.baseBuilding.ids = hbfIds; X.hbf.entry.baseBuilding.overlap = hbfIds.detail;
  G.edit = new THREE.Group(); G.edit.name = 'edit-root'; for (const r of X.LMS) G.edit.add(r.lm.holder); scene.add(G.edit);
  for (const r of X.LMS) {
    readPlacement(r);
    log('landmark · ' + r.entry.id + ' → ' + r.entry.osm.type + '/' + r.entry.osm.id + ' · Δ ' + r.valid.centroidOffsetM + ' m · axis Δ ' + r.valid.axisErrDeg + '° · base ' + r.entry.baseBuilding.state + ' · colour roles ' + JSON.stringify(r.lm.style.roles) + (r.lm.style.unmapped.size ? ' · unmapped ' + [...r.lm.style.unmapped].join(',') : '') + ' · removed ' + (r.lm.style.removed.join(', ') || '—'), !r.valid.ok);
  }

  /* Track-Socket */
  buildSocket(Ly);
  log('track socket · ' + X.socket.rec.id + ' · ' + r1(X.route.length) + ' m · ±' + r1(X.xs.exclusionHalf) + ' m · moduleRef null · ' + zone.conflicts.size + ' OSM buildings inside (ghosted, deferred)');

  /* Isolation 02: Donor wie geliefert ⇄ mit Delta */
  buildIso();

  /* Tusche (WB-W0-Owner), nur Objekte */
  ink = createInk({ renderer, scene, camera });
  ink.setParams({ thin: 1.0, thick: 2.2, wobble: 0, gap: 0, grain: 0, fadeNear: 260, fadeFar: 1500, strength: 0.85 });
  resize();

  /* Editor: der geteilte edit-layer, EIN Picker, EIN Anfasser */
  const recordOf = (n) => { const id = n && n.userData && n.userData.sceneObjectId; const r = id && X.LMS.find((q) => q.entry.id === id); return r ? r.entry : null; };
  EDIT = EL.makeEditLayer({ camera, scene, controls }, canvas, {
    getRoot: () => G.edit, recordOf, menu: objmenu, gridStep: 0.5, angleStep: 1, scaleFactor: 1.25, minScale: 0.3, maxScale: 3,
    onPick: () => paintSoon(),
    onChange: () => { readPlacement(cur()); paintSoon(); },
    onMenu: (a) => { if (a === 'floor') drop(); }
  });
  EDIT.gizmo.setSize(0.75);
  EDIT.gizmo.setSpace('world');
  EDIT.gizmo.showX = true;
  setExcluded();
  S.ready = true;
  setView(S.view, true);
  paint();
  say('ready · 03 SHELL · Dom selected (Move) · drag the gizmo, ⬓ drops, 01/02 show the sources in isolation', 'ok');
}

/* ---------- Straßennamen (road / signs) + Homebase ---------- */
async function addNames(cityStyle) {
  const zone = X.zone, homeStreet = zone.home ? zone.home.address.replace(/\s+\d+\w*$/, '') : null;
  try {
    X.names = await buildStreetNames(zone, { y: layersFrom(cityStyle).plate, homeStreet });
    G.names = new THREE.Group(); G.names.name = 'names'; G.names.add(X.names.ground, X.names.signs); if (X.names.home) G.names.add(X.names.home.group);
    scene.add(G.names); setNames(S.names);
    const ns = X.names.stats;
    log('street names · ' + ns.names + ' named streets · ' + ns.roadLabels + ' road labels · ' + ns.signs + ' signs at ' + ns.intersections + ' intersections' + (X.names.home ? ' · homebase ' + zone.home.address + ' (' + zone.home.id + ')' : ''));
  } catch (e) { console.error(e); log('street names failed · ' + e.message, true); }
}
function setNames(m) {
  S.names = NAME_MODES.some(([k]) => k === m) ? m : 'signs';
  if (X.names) { X.names.ground.visible = S.names === 'road' || S.names === 'both'; X.names.signs.visible = S.names === 'signs' || S.names === 'both'; }
  paintSoon();
}
/* Schattenbox: Kantenlänge folgt dem Kameraabstand, Mitte rastet in ganzen Texeln ein (kein Kantenflimmern) */
const SUN_D = 1600, SH = { half: 0 };
function shadowFollow(focus) {
  const sh = X.sun.shadow, cam = sh.camera, d = camera.position.distanceTo(controls.target);
  const half = Math.max(90, Math.min(560, Math.round(d * 2.2 / 10) * 10)), texel = 2 * half / sh.mapSize.x;
  if (half !== SH.half) {
    SH.half = half;
    Object.assign(cam, { left: -half, right: half, top: half, bottom: -half, near: SUN_D - Math.max(half * 1.2, 380), far: SUN_D + half * 1.2 + 80 });
    cam.updateProjectionMatrix(); sh.normalBias = texel * 1.2;
  }
  const e1 = new THREE.Vector3(0, 1, 0).cross(sd).normalize(), e2 = sd.clone().cross(e1).normalize();
  const a = Math.round(focus.dot(e1) / texel) * texel, b = Math.round(focus.dot(e2) / texel) * texel;
  const f = e1.multiplyScalar(a).addScaledVector(e2, b).addScaledVector(sd, focus.dot(sd));
  X.sun.target.position.copy(f); X.sun.position.copy(f).addScaledVector(sd, SUN_D); X.sun.target.updateMatrixWorld();
}

/* ---------- Platzierung ↔ Eintrag ---------- */
const cur = () => (X.LMS && X.LMS.find((r) => EDIT && EDIT.selection[0] === r.lm.holder)) || X.dom;
function applyPlacement(r) {
  const c = r.ref(), p = r.entry.placement, h = r.lm.holder;
  h.position.set(c.x + p.dxM, p.yOffsetM, c.z - p.dzM);
  h.rotation.set(0, THREE.MathUtils.degToRad(p.yawDeg), 0);
  h.scale.setScalar(p.scale);
  h.updateMatrixWorld(true);
}
function readPlacement(r) {
  const c = r.ref(), p = r.entry.placement, h = r.lm.holder;
  p.dxM = r1(h.position.x - c.x); p.dzM = r1(-(h.position.z - c.z)); p.yOffsetM = r1(h.position.y);
  p.yawDeg = +THREE.MathUtils.radToDeg(h.rotation.y).toFixed(2);
  p.scale = +h.scale.x.toFixed(3);
  r.valid = validatePlacement(r.lm, X.zone, r.entry);
  if (r.base) { const hide = r.valid.ok; r.base.visible = !hide; r.entry.baseBuilding.state = hide ? 'hidden (validated)' : 'shown (placement outside tolerance)'; }
}
function drop() {
  const A = cur(), h = A.lm.holder, y = X.terrain.H(h.position.x, h.position.z) + layersFrom(M.cityStyle).plate;
  const moved = y - h.position.y; h.position.y = y; h.updateMatrixWorld(true); readPlacement(A); EDIT.follow();
  say('drop · ' + (moved >= 0 ? '+' : '') + r1(moved) + ' m → city plate y ' + y.toFixed(2) + ' (fixture has no elevation; W0 terrain owns H)', 'ok'); paintSoon();
}

/* ---------- Track-Socket: leerer Platz, auf den ein gebackenes Track-Modul per Referenz fällt ---------- */
function buildSocket(Ly) {
  const { OC } = M, C = OC.C, rt = X.route, xs = X.xs, y = Ly.plate + 0.3;
  const g = new THREE.Group(); g.name = 'track-socket';
  const band = (u0, u1, yy, mat, name, s0 = 0, s1 = rt.length) => {
    const pos = [], idx = [], uv = [], n = Math.max(1, Math.ceil((s1 - s0) / 2));
    for (let i = 0; i <= n; i++) { const ss = s0 + (s1 - s0) * i / n, q = rt.sampleAt(ss); const a = q.p.clone().addScaledVector(q.n, u0), b = q.p.clone().addScaledVector(q.n, u1); pos.push(a.x, yy, a.z, b.x, yy, b.z); uv.push(u0 / 3, ss / 3, u1 / 3, ss / 3); if (i) { const k = (i - 1) * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); } }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const nrm = new Float32Array(pos.length); for (let i = 1; i < nrm.length; i += 3) nrm[i] = 1; geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx);
    const m = new THREE.Mesh(geo, mat); m.name = name; m.receiveShadow = true; g.add(m); return m;
  };
  const E = xs.exclusionHalf, Hs = xs.surfaceWidth / 2;
  /* Leerer Platz, eindeutig: diagonale Schraffur auf dem Boden (halbtransparent), goldene Grenze,
     Pins an den Enden — keine Fahrbahnfarbe, keine Mittelstriche (die gehören dem späteren Modul) */
  const hc = document.createElement('canvas'); hc.width = hc.height = 64; const hx = hc.getContext('2d');
  hx.strokeStyle = '#' + new THREE.Color(C.lineGold).getHexString(); hx.lineWidth = 9; hx.lineCap = 'square';
  for (const o of [-64, 0, 64]) { hx.beginPath(); hx.moveTo(o, 64); hx.lineTo(o + 64, 0); hx.stroke(); }
  const hatch = new THREE.CanvasTexture(hc); hatch.wrapS = hatch.wrapT = THREE.RepeatWrapping; hatch.colorSpace = THREE.SRGBColorSpace; hatch.anisotropy = 8;
  const plate = band(-E, E, y, new THREE.MeshBasicMaterial({ map: hatch, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -12 }), 'socket-hatch');
  plate.renderOrder = 4;
  const edgeMat = new THREE.MeshStandardMaterial({ color: C.lineGold, roughness: 0.7, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -7, polygonOffsetUnits: -14 });
  const lines = [band(E - 1.2, E, y + 0.02, edgeMat, 'socket-edge-L'), band(-E, -E + 1.2, y + 0.02, edgeMat, 'socket-edge-R')];
  const pinMat = new THREE.MeshStandardMaterial({ color: C.lineGold, roughness: 0.6, flatShading: true });
  for (const s of [0, rt.length]) {
    const q = rt.sampleAt(s);
    for (const u of [-E, E]) { const p = q.p.clone().addScaledVector(q.n, u); const pin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5, 0.8), pinMat); pin.position.set(p.x, y + 2.5, p.z); pin.castShadow = true; pin.name = 'socket-pin'; g.add(pin); }
    const a = q.p.clone().addScaledVector(q.n, -E).setY(y + 0.1), b = q.p.clone().addScaledVector(q.n, E).setY(y + 0.1);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.14, 2 * E), pinMat); bar.position.copy(a.clone().add(b).multiplyScalar(0.5)); bar.rotation.y = Math.atan2(q.n.x, q.n.z); bar.name = 'socket-end'; g.add(bar);
  }
  X.socketTagAt = rt.sampleAt(rt.length).p.clone().setY(y + 6);
  scene.add(g); G.socket = g;
  const start = rt.sampleAt(0);
  X.socket = {
    group: g, flat: [plate, ...lines],
    rec: {
      id: 'socket:cologne-dom-loop:cp0-cp2', note: 'presentation seam only · not a Track schema',
      routeRef: 'lab-v9/cologne-route.v1.js CONTROL_POINTS[0..2] @' + PIN + ' (' + rt.source.split(' · ')[1] + ')',
      frame: { originSrc: { x: r1(start.p.x), z: r1(-start.p.z) }, headingDeg: r1(THREE.MathUtils.radToDeg(Math.atan2(start.t.x, -start.t.z))), lengthM: r1(rt.length), surfaceWidthM: xs.surfaceWidth, halfWidthM: r1(E) },
      moduleRef: null, conflicts: [...X.zone.conflicts]
    }
  };
}

/* Host-Setzung: das TinySkies-Rig ist für den Globus kalibriert; auf einer hellen Stadtplatte (Albedo
   ≈ 0,5) brannte es die Lokalfarben aus. Ein gemeinsamer Faktor auf alle Rig-Lichter, Verhältnisse
   bleiben die des Owners. */
const LIGHT_K = 0.6;
function setLight(k) { S.lightK = k; for (const [l, i0] of X.lights) l.intensity = i0 * k; }
function label(text, a = 0.9) {
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 128;
  const c = cv.getContext('2d'); c.fillStyle = 'rgba(20,19,15,' + a * 0.82 + ')'; c.fillRect(0, 0, 1024, 128);
  c.strokeStyle = 'rgba(255,217,160,.6)'; c.lineWidth = 3; c.strokeRect(2, 2, 1020, 124);
  let fs = 44; c.font = '600 ' + fs + 'px JetBrains Mono, ui-monospace, monospace';
  while (fs > 18 && c.measureText(text).width > 1024 - 64) { fs -= 2; c.font = '600 ' + fs + 'px JetBrains Mono, ui-monospace, monospace'; }
  c.fillStyle = '#ffd9a0'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 512, 66);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true })); s.renderOrder = 20; return s;
}

function buildIso() {
  const { WORLD, CC, cityStyle } = M;
  const g = new THREE.Group(); g.name = 'iso:landmark'; g.position.set(2600, 0, 0);
  const { EG } = M;
  const donor = makeLandmark({ WORLD, CC, EG, style: cityStyle, elastic: false, kfb: false });
  const el = makeLandmark({ WORLD, CC, EG, style: cityStyle, elastic: true, kfb: true, bend: S.bend, torsion: S.torsion });
  donor.holder.position.set(-95, 0, 0); el.holder.position.set(95, 0, 0);
  donor.holder.rotation.y = el.holder.rotation.y = Math.PI / 3;   // Westfassade dreiviertel zur Kamera: die Spreizung liegt quer zum Blick
  const l1 = label('DONOR · buildDom() as delivered'), l2 = label('+ KFB palette · clay · tower bend');
  l1.position.set(-95, 190, 0); l2.position.set(95, 190, 0); l1.scale.set(120, 15, 1); l2.scale.set(120, 15, 1);
  g.add(donor.holder, el.holder, l1, l2);
  scene.add(g); G.iso = g; X.iso = { donor, el };
}

function setExcluded() {
  if (!ink) return;
  ink.setExcluded([X.terrain.mesh, X.far, ...X.city.flatParts, ...(X.fixture ? X.fixture.flatParts : []), ...X.socket.flat, X.iso.pad, EDIT && EDIT.helper].filter(Boolean));
}

/* ---------- Ansichten ---------- */
function setView(v, instant) {
  if (S.lite && v === 'LANDMARK') v = 'SHELL';
  S.view = v;
  if (v === 'FIXTURE' && !X.fixture) {
    X.fixture = buildCityLayer(X.zone, { mode: 'clean', style: M.cityStyle, CC: M.CC, ghosts: false, renderer });
    G.fixture = X.fixture.group; scene.add(G.fixture); setExcluded();
    const fs = X.fixture.stats, drawn = fs.buildings + fs.base;
    log('01 fixture · ' + X.zone.id + ' · clean extrusion (no massing) · ' + drawn + '/' + X.zone.counts.buildings + ' OSM footprints drawn' + (fs.failed ? ' · ' + fs.failed + ' failed' : '') + ' · ' + fs.roadParts + '/' + X.zone.counts.roadParts + ' road parts in the ground map (' + fs.tunnelsSkipped + ' tunnel/below-grade skipped)' + (X.zone.landmark ? ' · landmark footprint outlined red' : ' · no landmark in this zone yet'), drawn !== X.zone.counts.buildings);
  }
  const on = { FIXTURE: ['fixture'], LANDMARK: ['iso'], SHELL: ['terrain', 'city', 'edit', 'socket', 'names'] }[v];
  for (const k of ['terrain', 'city', 'edit', 'socket', 'iso', 'fixture', 'names']) if (G[k]) G[k].visible = on.includes(k);
  if (EDIT) {
    EDIT.setOn(v === 'SHELL');
    if (v === 'SHELL' && !EDIT.selection.length) { EDIT.select(X.dom.lm.holder); EDIT.setMode('translate'); }
  }
  camTo(v === 'FIXTURE' ? 'FIXTURE' : v === 'LANDMARK' ? 'ISO' : (S.cam && !['FIXTURE', 'ISO'].includes(S.cam) ? S.cam : 'REGION'), instant ? 0.01 : 1.3);
  paintSoon();
}
function setElastic(b, t) {
  S.bend = b; S.torsion = t;
  X.dom.lm.setElastic(b, t); X.iso.el.setElastic(b, t);
  X.dom.entry.elastic.bendXGrotesque = b; X.dom.entry.elastic.torsionXGrotesque = t;
  EDIT && EDIT.follow(); paintSoon();
}
function setGhosts(v) { S.ghosts = v; if (X.city.ghost) X.city.ghost.visible = v; paintSoon(); }

/* ---------- Bedienleiste (kompakt) + Schublade (Details) ---------- */
function chip(parent, label, on, fn, title) {
  const b = mk('button', 'pointer-events:auto;font:' + (on ? 600 : 400) + ' 10px ' + FONT + ';padding:5px 8px;margin-left:-1px;cursor:pointer;background:' + (on ? '#4a3d24' : '#1b1a22') + ';border:1px solid ' + (on ? GOLD : '#3a3744') + ';color:' + (on ? GOLD : INK) + ';white-space:nowrap;position:relative;z-index:' + (on ? 1 : 0), label);
  b.onclick = fn; if (title) b.title = title; parent.appendChild(b); return b;
}
function group(parent) { const g = mk('div', 'display:flex;gap:0;pointer-events:none'); parent.appendChild(g); return g; }
function sec(title) { const w = mk('div', 'border:1px solid ' + LINE + ';padding:7px 8px;display:flex;flex-direction:column;gap:5px'); w.appendChild(mk('div', 'font:600 9px/1.3 ' + FONT + ';letter-spacing:.14em;color:' + GOLD + ';text-transform:uppercase', title)); drawer.appendChild(w); return w; }
function slider(parent, lbl, v, lo, hi, step, fn) {
  const row = mk('label', 'display:grid;grid-template-columns:78px 1fr 36px;gap:6px;align-items:center');
  const inp = mk('input', 'width:100%;accent-color:' + GOLD); Object.assign(inp, { type: 'range', min: lo, max: hi, step, value: v });
  const out = mk('span', 'color:' + GOLD + ';text-align:right', (+v).toFixed(2));
  inp.oninput = () => { out.textContent = (+inp.value).toFixed(2); fn(+inp.value); };
  row.append(mk('span', 'color:' + DIM, lbl), inp, out); parent.appendChild(row); return inp;
}
function layoutUI() {
  drawer.style.display = S.drawer ? 'flex' : 'none';
  const top = Math.round(bar.getBoundingClientRect().bottom + 8);
  if (innerWidth < 760) Object.assign(drawer.style, { left: '10px', width: 'auto', top: Math.max(top, innerHeight * 0.42) + 'px' }); else Object.assign(drawer.style, { left: 'auto', width: '320px', top: top + 'px' });
}
let painting = false;
function paintSoon() { if (painting) return; painting = true; requestAnimationFrame(() => { painting = false; paint(); }); }
function paint() {
  barL.textContent = ''; barR.textContent = '';
  const title = mk('div', 'pointer-events:none;padding:5px 8px;background:#1b1a22;border:1px solid #3a3744;color:' + GOLD + ';font-weight:600;letter-spacing:.08em;white-space:nowrap', 'KFB · COLOGNE SHELL');
  barL.appendChild(title);
  let g = group(barL);
  for (const [z, zz] of Object.entries(ZONES)) chip(g, zz.label, z === ZONE_ID, () => pickZone(z), 'Zone · ' + zz.url + (z === ZONE_ID ? '' : ' · reloads (live switch = S1.2)'));
  g = group(barL);
  for (const [v, l] of [['FIXTURE', '01 FIXTURE'], ['LANDMARK', '02 LANDMARK'], ['SHELL', '03 SHELL']]) {
    const b = chip(g, l, S.view === v, () => setView(v));
    if (S.lite && v === 'LANDMARK') { b.disabled = true; b.style.opacity = '.45'; b.style.cursor = 'default'; b.title = 'no landmark in this zone yet (S1.4)'; }
  }
  if (S.view === 'SHELL') {
    g = group(barL);
    for (const c of S.lite ? ['REGION', 'STREET', 'TOP', ...(CAMS.HOME ? ['HOME'] : [])] : ['REGION', 'LANDMARK', 'STREET', 'TOP']) chip(g, c.toLowerCase(), S.cam === c, () => camTo(c), c === 'STREET' && X.streetCam ? X.streetCam : undefined);
  }
  if (S.view === 'SHELL' && !S.lite) {
    g = group(barL);
    const sel = EDIT && EDIT.selection.length > 0, mode = EDIT ? EDIT.mode : '';
    chip(g, 'select', sel, () => { sel ? EDIT.clear() : EDIT.select(X.dom.lm.holder); paintSoon(); }, 'Select the landmark (click it)');
    chip(g, 'move', sel && mode === 'translate', () => { if (!sel) EDIT.select(X.dom.lm.holder); EDIT.setMode('translate'); paintSoon(); }, 'G');
    chip(g, 'rotate', sel && mode === 'rotate', () => { if (!sel) EDIT.select(X.dom.lm.holder); EDIT.setMode('rotate'); paintSoon(); }, 'R');
    chip(g, 'scale', sel && mode === 'scale', () => { if (!sel) EDIT.select(X.dom.lm.holder); EDIT.setMode('scale'); paintSoon(); }, 'S');
    chip(g, 'drop', false, () => { if (!EDIT.selection.length) EDIT.select(X.dom.lm.holder); drop(); }, 'F · onto the ground');
  }
  g = barR;
  chip(g, S.drawer ? 'details ✕' : 'details ≡', S.drawer, () => { S.drawer = !S.drawer; paint(); });
  layoutUI();

  if (!S.drawer) return;
  const keep = drawer.scrollTop; drawer.textContent = '';
  drawer.appendChild(mk('div', 'display:flex;flex-direction:column;gap:2px', null)).append(mk('div', 'font:600 11px/1.3 ' + FONT + ';color:' + GOLD + ';letter-spacing:.08em', 'WB-DESIGN-PARALLEL-01'), mk('div', 'color:' + DIM, 'visual / authoring shell candidate · frozen real fixture · no compiler'));
  if (!S.ready) { drawer.appendChild(mk('div', 'color:' + DIM, 'building …')); }
  if (S.ready) {
    let b = sec('Presentation seam');
    b.appendChild(mk('div', '', 'zone · ' + X.zone.id + ' · FROZEN FIXTURE'));
    b.appendChild(mk('div', 'color:' + DIM, X.zone.counts.buildings + ' buildings · ' + X.zone.counts.roadParts + ' road parts · ' + X.zone.counts.landuse + ' landuse · ' + X.zone.counts.water + ' water · crop ' + (X.zone.crop.maxX - X.zone.crop.minX) + ' × ' + (X.zone.crop.maxZ - X.zone.crop.minZ) + ' m'));
    b.appendChild(mk('div', 'color:' + BAD, 'WORLD-ZONE-BAKE-01 · not delivered · swap = loadZone({kind:"world-zone-bake"})'));
    b.appendChild(mk('div', 'color:' + DIM, SEAM.version));
    if (X.names) {
      b = sec('Street names');
      const nr = group(b); nr.style.pointerEvents = 'auto';
      for (const [k, l] of NAME_MODES) chip(nr, l, S.names === k, () => setNames(k));
      const ns = X.names.stats;
      b.appendChild(mk('div', 'color:' + DIM, ns.names + ' named streets · ' + ns.roadLabels + ' road labels (every ≥110 m on a straight segment) · ' + ns.signs + ' floating signs at ' + ns.intersections + ' intersections · signs face the camera, grow to ~150 m, fade out 230–320 m'));
      if (X.names.home) b.appendChild(mk('div', 'color:' + GOLD, 'homebase · ' + X.zone.home.address + ' · ' + X.zone.home.id + ' · gold ring + sign · street labelled gold'));
    }
    if (X.city) {
      const fa = X.city.stats.facade;
      b = sec('Facade · windows & doors (global rule)');
      const fr = group(b); fr.style.pointerEvents = 'auto';
      chip(fr, 'rule v1', FACADE === 'rule-v1', () => pickFacade('rule-v1'), 'kfb-facade-rule-v1 · reloads');
      chip(fr, 'owner protectedDetails', FACADE === 'owner', () => pickFacade('owner'), 'Elastic V2 owner as delivered · reloads');
      b.appendChild(mk('div', '', fa.windows + ' windows · ' + fa.doors + ' doors · ' + fa.garageDoors + ' garage doors · ' + X.city.stats.buildings + ' buildings'));
      b.appendChild(mk('div', 'color:' + (fa.bare ? BAD : OKC), fa.bare + ' buildings without any detail' + (FACADE === 'rule-v1' ? ' · ' + fa.partyEdges + '/' + fa.edges + ' party-wall edges skipped · ' + fa.streetDoors + ' doors face an OSM road/path · ' + fa.fallback + ' fallback doors (clamped) · ' + fa.capped + ' capped at ' + FACADE_RULE.cap : '')));
      if (FACADE === 'rule-v1') b.appendChild(mk('div', 'color:' + DIM + ';word-break:break-word', 'floor ' + FACADE_RULE.floorH + ' m · spacing ' + FACADE_RULE.spacing.join('–') + ' m per building · row shift ±' + FACADE_RULE.rowShift + ' · skip ' + FACADE_RULE.skip + ' · shapes rect/arch/trap-up/trap-down (per building, 18 % outliers) · extra door every ' + FACADE_RULE.extraDoorEvery + ' m on the street edge · garages: one wide door'));
    }
    if (S.lite) {
      const fs = X.fixture ? X.fixture.stats : null, c = X.zone.counts, pv = X.zone.provenance, sc = X.zone.sourceCounts || {};
      b = sec('Fixture · measured');
      for (const [k, src, fx, drawn] of [['buildings', sc.buildings, c.buildings, fs && fs.buildings + fs.base], ['road parts', sc.roads, c.roadParts, fs && fs.roadParts], ['landuse', sc.landuse, c.landuse, null], ['water lines', sc.waterLines, c.waterLines, null]])
        b.appendChild(mk('div', 'color:' + (drawn != null && drawn !== fx && k === 'buildings' ? BAD : INK), k + ' · source ' + (src ?? '—') + ' → fixture ' + fx + (drawn != null ? ' → drawn ' + drawn : '')));
      if (fs) b.appendChild(mk('div', 'color:' + DIM, 'failed extrusions ' + (fs.failed || 0) + ' · tunnel/below-grade road parts skipped ' + fs.tunnelsSkipped + ' · ground map ' + fs.groundTexture));
      b.appendChild(mk('div', 'color:' + DIM, 'frame origin ' + X.zone.frame.originWgs84.slice(0, 2).join(' / ') + ' · own local ENU (not the Dom frame)'));
      b.appendChild(mk('div', 'color:' + DIM + ';word-break:break-word', (pv.normalizedSha256 ? 'normalized.json sha256 ' + pv.normalizedSha256 + ' · ' : '') + 'raw ' + pv.rawSha256.slice(0, 16) + '… · ' + (pv.osmBaseTimestamp ? 'OSM ' + pv.osmBaseTimestamp : 'retrieved ' + pv.retrievedAt)));
      if (pv.geocode) b.appendChild(mk('div', 'color:' + DIM + ';word-break:break-word', pv.geocode));
      if (X.zone.absent) { b = sec('Not in the source (named, not faked)'); for (const [k, v] of Object.entries(X.zone.absent)) b.appendChild(mk('div', 'color:' + DIM + ';word-break:break-word', k + ' · ' + v)); }
      b = sec('Sources');
      for (const l of ['fixture · ' + (pv.normalized ? pv.normalized + ' @' + pv.commit + ' → fixtures/' + X.zone.id + '.json (no new OSM)' : pv.request + ' → ' + pv.raw + ' → fixtures/' + X.zone.id + '.json · ' + pv.normalizer), 'presenter · wd1-city.js buildCityLayer · 01 clean · 03 Elastic Grotesque Clay V2 @0c59e92d + KFB_WONKY_90S_CLAY_V1 + FACADE_RULE (identical to Cologne)', 'sky · travel/wip/travel_globe_wsa/globe-v13/sky-presets.js @' + PIN]) b.appendChild(mk('div', 'color:' + DIM + ';word-break:break-word', l));
      b.appendChild(mk('div', 'color:' + DIM, '© OpenStreetMap contributors · ODbL 1.0'));
    }
  }
  if (S.ready && !S.lite) {
    let b = sec('Water · settings');
    b.appendChild(mk('div', 'color:' + (/ FEHLEN|—/.test(X.water.textures) ? BAD : OKC), 'wasser-texturen · ' + X.water.textures));
    const pres = X.water.present();
    for (const [cls, lbl] of [['river', 'River · Rhein'], ['still', 'Still · basins / lakes'], ['sea', 'Sea']]) {
      const st = X.water.settings[cls];
      const box = mk('div', 'display:flex;flex-direction:column;gap:4px;padding:5px 0 3px;border-top:1px solid ' + LINE);
      box.appendChild(mk('div', 'color:' + INK + ';font-weight:600', lbl + (pres[cls] ? '' : ' · not in this crop (slot kept)')));
      const pr = group(box); pr.style.pointerEvents = 'auto'; pr.style.flexWrap = 'wrap';
      for (const [id, l] of WATER_PRESETS) { if (id === 'oc-rhine' && cls !== 'river') continue; chip(pr, l, st.preset === id, () => { X.water.set(cls, { preset: id }); paint(); }); }
      const fr = mk('label', 'display:grid;grid-template-columns:78px 1fr;gap:6px;align-items:center');
      const sel = mk('select', 'pointer-events:auto;font:400 10px ' + FONT + ';background:#1b1a22;color:' + INK + ';border:1px solid #3a3744;padding:3px');
      for (const [k, v] of Object.entries(M.FL.CARD_ZONE_V2_FLUIDS)) { const o = mk('option', '', v.label); o.value = k; if (k === st.fluid) o.selected = true; sel.appendChild(o); }
      sel.disabled = st.preset === 'oc-rhine'; sel.onchange = () => X.water.set(cls, { fluid: sel.value });
      fr.append(mk('span', 'color:' + DIM, 'fluid'), sel); box.appendChild(fr);
      if (st.preset === 'cz2-scaled') {
        slider(box, 'scale', st.scale, 0.03, 1, 0.01, (v) => X.water.set(cls, { scale: v }));
        slider(box, 'flow', st.flow, 0, 3, 0.05, (v) => X.water.set(cls, { flow: v }));
      }
      if (st.preset !== 'oc-rhine') { const tr = group(box); tr.style.pointerEvents = 'auto'; chip(tr, st.textures ? 'textures on' : 'textures off', st.textures, () => { X.water.set(cls, { textures: !st.textures }); paint(); }); }
      b.appendChild(box);
    }
    b.appendChild(mk('div', 'color:' + DIM, 'CZ2 fragment verbatim (blob 43eea82f) · scaled = vertex delta vW.xz×scale, aFlow×flow · source = Lab exactly · OC = lab-v9 buildRhine · foam stays off (source) · saved in this browser'));
    const rr = group(b); rr.style.pointerEvents = 'auto';
    chip(rr, 'reset water', false, () => { X.water.reset(); paint(); });
    b = sec('LandmarkElastic · towers');
    slider(b, 'bend', S.bend, 0, 2, 0.05, (v) => setElastic(v, S.torsion));
    slider(b, 'torsion', S.torsion, 0, 2, 0.05, (v) => setElastic(S.bend, v));
    b.appendChild(mk('div', 'color:' + DIM, '× grotesque preset (kfb-city-v0: bend 0,105 · twist 11°) · tip offset ' + X.dom.lm.tipOffsetM() + ' m on ' + X.dom.lm.measured.osmHeightM + ' m · body: clay belly 0,035 · twist 1,5°'));
    const tr = group(b); tr.style.pointerEvents = 'auto';
    chip(tr, S.wind ? 'wind on' : 'wind off', S.wind, () => { S.wind = !S.wind; paint(); }, 'Donor update(): tower sway');
    const A = cur();
    b = sec('Landmark override · ' + A.entry.id);
    const lr = group(b); lr.style.pointerEvents = 'auto';
    for (const r of X.LMS) chip(lr, r === X.dom ? 'Dom' : 'Hbf', r === A && EDIT.selection.length > 0, () => { EDIT.select(r.lm.holder); EDIT.setMode(EDIT.mode || 'translate'); paint(); });
    const v = A.valid;
    b.appendChild(mk('div', 'color:' + (v.ok ? OKC : BAD), (v.ok ? 'VALID' : 'OUT OF TOLERANCE') + ' · anchor Δ ' + v.centroidOffsetM + ' m · axis Δ ' + v.axisErrDeg + '° · base ' + A.entry.baseBuilding.state + (A.entry.baseBuilding.ids ? ' (' + A.entry.baseBuilding.ids.length + ' OSM parts)' : '')));
    if (v.extent) b.appendChild(mk('div', 'color:' + DIM, 'long axis donor ' + v.extent.donorLongM + ' m vs OSM ' + v.extent.osmLongM + ' m (' + v.extent.longRatio + ') · named, donor-owned'));
    else b.appendChild(mk('div', 'color:' + DIM, v.note));
    b.appendChild(mk('div', 'color:' + DIM, 'KFB style · ' + A.entry.style.palette + ' · ' + A.entry.style.clay + ' · removed ' + (A.lm.style.removed.join(', ') || '—')));
    b.appendChild(mk('pre', 'margin:0;white-space:pre-wrap;word-break:break-word;color:' + INK + ';font:400 9.5px/1.4 ' + FONT, JSON.stringify({ osm: A.entry.osm, placement: A.entry.placement }, null, 1)));
    const ar = group(b); ar.style.pointerEvents = 'auto';
    chip(ar, 'reset placement', false, () => { Object.assign(A.entry.placement, { yawDeg: A.axis, scale: 1, yOffsetM: 0, dxM: 0, dzM: 0 }); applyPlacement(A); readPlacement(A); EDIT.follow(); paint(); });
    chip(ar, 'copy entry', false, async () => { try { await navigator.clipboard.writeText(JSON.stringify(A.entry, null, 2)); say('override entry copied', 'ok'); } catch { say('clipboard blocked · window.__wd1.report()'); } });
    b = sec('Track module socket');
    const s = X.socket.rec;
    b.appendChild(mk('div', '', s.id + ' · moduleRef ' + s.moduleRef));
    b.appendChild(mk('div', 'color:' + DIM, s.routeRef + ' · ' + s.frame.lengthM + ' m · track ' + s.frame.surfaceWidthM + ' m · socket ±' + s.frame.halfWidthM + ' m'));
    b.appendChild(mk('div', 'color:' + BAD, s.conflicts.length + ' OSM buildings inside the socket (Hbf Empfangshalle, station roofs, Deichmannhaus …) · ghosted, resolution belongs to WORLD-ZONE-BAKE-01'));
    const sr = group(b); sr.style.pointerEvents = 'auto';
    chip(sr, S.ghosts ? 'ghosts on' : 'ghosts off', S.ghosts, () => setGhosts(!S.ghosts));
    chip(sr, S.ink ? 'ink on' : 'ink off', S.ink, () => { S.ink = !S.ink; paint(); });
    b = sec('Sources');
    for (const l of [
      'fixture · tools/osm-city-lab/data/dom-zentrum-v0/{normalized,CLAUDE_CONTEXT}.json @2ff8b350 → fixtures/cologne-dom-crop-v0.json (crop, no new OSM)',
      'region · WB-W0 w0-region.js (route, crossSection, buildTerrain) · w0-ink.js',
      'landmark · lab-v9/cologne-world.v1.js buildDom · buildRhine @' + PIN,
      'buildings · experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs @0c59e92d (shell · roof · protectedDetails)',
      'palette · KFB_WONKY_90S_CLAY_V1 (viewer.mjs @0c59e92d) · socket/landmark: option-c-style C',
      'water · KFB StoryMap v1/kfb-fluid-v2/card-zone-v2-fluid-source.js @' + PIN + ' + media/3D_Assets/KFB/{waterdudv,water}.jpg · wd1-water.js presets',
      'editor · tools/KFB-ToolBox/lib/edit-layer.js @' + PIN_EDIT.slice(0, 8),
      'sky · travel/wip/travel_globe_wsa/globe-v13/sky-presets.js @' + PIN
    ]) b.appendChild(mk('div', 'color:' + DIM + ';word-break:break-word', l));
    b.appendChild(mk('div', 'color:' + DIM, '© OpenStreetMap contributors · ODbL 1.0'));
  }
  const lb = sec('Load log');
  for (const l of LOG) lb.appendChild(mk('div', 'color:' + (l.startsWith('✗') ? BAD : DIM) + ';word-break:break-word', l));
  drawer.scrollTop = keep;
}

/* ---------- Tastatur ---------- */
addEventListener('keydown', (e) => {
  if (!EDIT || S.view !== 'SHELL' || /INPUT|TEXTAREA/.test(document.activeElement?.tagName || '')) return;
  const k = e.key.toLowerCase();
  if (k === 'g') { if (!EDIT.selection.length) EDIT.select(X.dom.lm.holder); EDIT.setMode('translate'); }
  else if (k === 'r') { if (!EDIT.selection.length) EDIT.select(X.dom.lm.holder); EDIT.setMode('rotate'); }
  else if (k === 's') { if (!EDIT.selection.length) EDIT.select(X.dom.lm.holder); EDIT.setMode('scale'); }
  else if (k === 'f') { if (!EDIT.selection.length) EDIT.select(X.dom.lm.holder); drop(); }
  else if (k === 'escape') EDIT.clear();
  else return;
  paintSoon();
});
addEventListener('wd1-props', (e) => {
  const p = e.detail || {}; if (!S.ready) { Object.assign(P, p); return; }
  if (p.view && p.view !== S.view) setView(p.view);
  if ((p.bend != null && +p.bend !== S.bend) || (p.torsion != null && +p.torsion !== S.torsion)) setElastic(+(p.bend ?? S.bend), +(p.torsion ?? S.torsion));
  if (p.ghosts != null && p.ghosts !== S.ghosts) setGhosts(!!p.ghosts);
  if (p.chrome) { S.drawer = p.chrome === 'FULL'; layoutUI(); paint(); }
  if (p.names && p.names !== S.names) setNames(p.names);
});

/* ---------- Takt ---------- */
let last = performance.now(), lastFrame = 0; const t0 = performance.now();
const sd = new THREE.Vector3(-1.6, 1.1, 0.9).normalize();
function frame() {
  const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; lastFrame = now;
  if (S.tw) { S.tw.t += dt; const k = Math.min(1, S.tw.t / S.tw.dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; camera.position.lerpVectors(S.tw.p0, S.tw.p1, e); controls.target.lerpVectors(S.tw.t0, S.tw.t1, e); if (k >= 1) S.tw = null; }
  controls.update();
  const t = (now - t0) / 1000;
  if (S.ready) {
    if (!S.lite) { X.water.update(t); X.dom.lm.update(t, S.wind ? 1 : 0); X.iso.el.update(t, S.wind ? 1 : 0); X.iso.donor.update(t, S.wind ? 1 : 0); }
    const focus = S.view === 'LANDMARK' ? G.iso.position : new THREE.Vector3((X.zone.rectW.minX + X.zone.rectW.maxX) / 2, 0, (X.zone.rectW.minZ + X.zone.rectW.maxZ) / 2);
    shadowFollow(S.view === 'LANDMARK' ? focus : controls.target);
    if (X.names) X.names.update(camera);
    if (EDIT) { EDIT.follow(); if (!objmenu.hidden) { const lim = bar.getBoundingClientRect().bottom + 6; if (parseFloat(objmenu.style.top) < lim) objmenu.style.top = lim + 'px'; } }
    { /* Socket-Tag: nur in SHELL, nur vor der Kamera, nur im Bild und nicht unter der Leiste */
      const v = X.socketTagAt && S.view === 'SHELL' ? X.socketTagAt.clone().project(camera) : null;
      const px = v ? (v.x * 0.5 + 0.5) * innerWidth : 0, py = v ? (-v.y * 0.5 + 0.5) * innerHeight : 0;
      const dr = S.drawer ? drawer.getBoundingClientRect() : null;
      const ok = v && v.z < 1 && v.z > -1 && px > 60 && px < innerWidth - 60 && py > bar.getBoundingClientRect().bottom + 24 && py < innerHeight - 40 && camera.position.distanceTo(X.socketTagAt) > 25 && !(dr && px > dr.left - 120 && py > dr.top && py < dr.bottom + 20);
      socketTag.hidden = !ok; if (ok) { const hw = (socketTag.offsetWidth || 280) / 2; socketTag.style.left = Math.max(hw + 8, Math.min(innerWidth - hw - 8, px)) + 'px'; socketTag.style.top = py + 'px'; }
    }
  }
  if (S.ready && S.ink && ink && S.view !== 'FIXTURE') ink.render(t); else renderer.render(scene, camera);
}
function loop() { frame(); requestAnimationFrame(loop); }
setInterval(() => { if (performance.now() - lastFrame > 250) frame(); }, 100);
camera.position.set(...CAMS.REGION.p); controls.target.set(...CAMS.REGION.t);
requestAnimationFrame(loop);
paint();
boot().catch((e) => { console.error(e); log('BOOT FAILED · ' + e.message, true); });
window.__wd1 = { THREE,
  X, S, G, scene, camera, renderer, setView, camTo, setElastic, setLight, draw: (n = 1) => { for (let i = 0; i < n; i++) frame(); }, get EDIT() { return EDIT; },
  report: () => ({ schema: 'kfb.wb-design-parallel-01.report/0', date: new Date().toISOString(), seam: SEAM.version, zone: X.zone && { id: X.zone.id, counts: X.zone.counts, provenance: X.zone.provenance }, city: X.city && X.city.stats, landmarks: X.LMS && X.LMS.map((r) => ({ entry: r.entry, validation: r.valid, style: { roles: r.lm.style.roles, removed: r.lm.style.removed } })), socket: X.socket && X.socket.rec, tipOffsetM: X.dom && X.dom.lm.tipOffsetM(), log: LOG })
};
