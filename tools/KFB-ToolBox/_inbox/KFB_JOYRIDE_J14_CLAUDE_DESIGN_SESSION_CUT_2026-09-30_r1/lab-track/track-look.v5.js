/* KFB track-look v5 (28.09.) — T4 · Übergangsatlas + Clay-VFX auf T3 v2 / K2. Additiv zu v4 (v4 bleibt unverändert und importierbar).
 *   Neu: lab-track/transition-atlas.v1.js (Zonen ZC/ZB/ZN/ZA aus transition-profiles.v1.json, Layer gestaffelt in u),
 *        lab-vfx/clay-vfx.v1.js (instanzierte Knet-Partikel, Profile clay-particle-profiles.v1.json).
 *   Eingriffe in die v4-Bühne: Strang-Querschnitt liest barrierT (Stadt: niedriger + nach innen, nur am Boden · Natur: breiter + niedriger),
 *   Strang-Farbe über Knetflecken zur Bord-/Wiesenfarbe, Fahrbahn-Skinfeld aus dem Übergangsvertrag (Straße · Bahn · Naturweg),
 *   Welt-Platzierung meidet Stadt, Böschung und Probenbrett. Geometrie der Fahrfläche, Route, Kameras aus v4 unverändert.
 * KFB track-look v4 (28.09.) — T3 auf Material K2: clay-material.v10 + Werkzeugkarten clay-relief.v4 + Mischungen clay-toolmix.v1.
 *   Fahrbahn behält das Straßenprofil von T2 21:30 (legacy 1, keine Werkzeuge). Alle anderen Massen: Werkzeuge in Zonen,
 *   Facetten laufen aus, Kachelzellen folgen einem Richtungsfeld, keine v2-Querriefen und keine Macro-Maserung mehr.
 *   Geometrie, Welten, Kameras unverändert wie v3.
 * KFB track-look v3 (27.09.) — T3 · Knetstrang. Eigene Bühne nach lab-track/KONZEPT_S4_KNETSTRANG.md.
 * Richtung Georg 27.09.: bunt, lebendig, harmonisch-schräg; Rocko × SpongeBob × Wallace & Gromit × Mario Kart, Maßstab Claybound.
 * Prinzip: die Strecke ist EIN Strang aus Knete (Hohlkehle + Randwulst + Bauch, eine Farbe), darauf die Fahrbahn exakt aus dem Stream.
 *   · Fahrbahn road_L..road_R unverformt, Straßenprofil wie T2 21:30 (k = 3, »das einzig Gute«).
 *   · Bedeutung durch Form: Querrippen in der Hohlkehle innen in Kurven, Prallwulst außen in engen Kurven, Boost-Pfeile als Knetplatten.
 *   · Stützen: Elefantenfuß, Taille, Bauch, Kapitell-Kissen; hohe Stützen gestapelt und doppelt mit Brücke.
 *   · Welt: Knettisch, Hügel, schiefe Türme, Bäume mit krummem Stamm (Kugel-in-Kugel), Büsche, Fels, Wolken, Karts.
 * Nichts aus track-kit.v2 (Slots-je-Farbe) wird benutzt. Material clay-material.v8 unverändert. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { makeClayRelief } from '../lab-clay/clay-relief.v2.js';
import { makeClayUniforms, makeClayMaterial, seedGeometry, makePrintTexture, PROFILES } from '../lab-clay/clay-material.v10.js?r=2';
import { makeToolReliefs } from '../lab-clay/clay-relief.v4.js';
import { TOOLMIX } from '../lab-clay/clay-toolmix.v1.js?r=2';
import { makeAtlas, patchify } from './transition-atlas.v1.js?r=28';
import { sphereAO, ensureColor } from './crown-ao.v1.js?r=1';
import { KFB_BLEND_GLSL } from './road-markings.m1.js?r=4';
import { makeClayVFX, makeKartDriver, makeBoardDriver } from '../lab-vfx/clay-vfx.v1.js?r=3';

const here = f => new URL(f, import.meta.url).href;
// J04 (29.09., additiv): Dichte-Schalter für Fahr-Konsumenten. Ohne window.__KFB_T4_LEAN baut T4 exakt wie bisher.
let LEAN = null;   // wird beim Aufruf von boot() gelesen, nicht beim Laden des Moduls
const V = a => new THREE.Vector3(a[0], a[1], a[2]);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const hash = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const vnoise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i) * (1 - u) + hash(i + 1) * u; };
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

export const WORLDS = {
  canyon: {
    name: 'A · Claybound-Canyon', short: 'Claybound pur: oranger Strang auf violettem Tisch, schieferblaue Fahrbahn, orange Tafeltürme, grüne Kugelbäume, gelbe Boost-Pfeile.',
    sky: '#96bede', roadStreet: '#566680', roadTrack: '#3d4a60', strang: '#ef5a22', table: '#8b68c7', hill: ['#a582d9', '#7b5bb8'],
    tower: ['#ef5a22', '#e8743a'], leaf: ['#1f7a3e', '#2f8a45', '#cdc666'], trunk: '#8a5a3a', rock: '#e2d0bc', cloud: '#e2d0bc', pad: '#f2b632',
    kart: ['#f2b632', '#5983ac', '#e2d0bc']
  },
  bucht: {
    name: 'B · Bikini-Bucht', short: 'Unterwasser-Strand: korallenroter Strang auf Sand, Aqua-Dünen, violette Korallentürme, Tangbäume mit rosa Blüten, zitronengelbe Pfeile.',
    sky: '#8fd6ec', roadStreet: '#5f7f9a', roadTrack: '#3e5d7c', strang: '#f2708a', table: '#f0cf7e', hill: ['#5cc3bf', '#46adb2'],
    tower: ['#9a6fd0', '#b08ae0'], leaf: ['#8fcf45', '#5fb84a', '#f7a1c4'], trunk: '#c9895a', rock: '#9a6fd0', cloud: '#fff4e2', pad: '#f7d23c',
    kart: ['#f7d23c', '#9a6fd0', '#fff4e2']
  },
  otown: {
    name: 'C · O-Town', short: 'Schräge Vorstadt: senfgelber Strang auf Petrol, magentafarbene Wackeltürme, orange Baumkronen auf lila Stämmen, Mintgrün als Himmel.',
    sky: '#a8d8b9', roadStreet: '#6a6e8f', roadTrack: '#4a4d6e', strang: '#e9b53b', table: '#3aa596', hill: ['#2f8f83', '#4cb5a5'],
    tower: ['#c9508f', '#e0679f'], leaf: ['#f08a2c', '#f5b041', '#c9508f'], trunk: '#6b4a8a', rock: '#e0679f', cloud: '#f3ead8', pad: '#fff06a',
    kart: ['#fff06a', '#6b4a8a', '#f08a2c']
  }
};

// Profil nach Handmaß: Maßstab und Spurgrößen × k, Überschreibungen wie T2 clayDetail (keine Krater, keine Risse auf Massen)
const QUIET = { print: 0.3, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 0.9, crease: 0.5 };
const prof = (key, scale, k, over = {}) => { const p = { ...PROFILES[key], ...over }; p.scale = (scale ?? p.scale) * k; p.gougeSize *= k; p.crackSize *= k; p.dentSize *= k; return p; };

// ---------- Fahrbahn: Knetflecken zwischen Straße (0) und Bahn (1) über eine stetige Größe ----------
const ROAD_V = `attribute float aW; attribute float aBio; attribute vec2 aSU; varying float vW; varying float vBio; varying vec2 vSU;\n`;
const ROAD_F = 'uniform vec3 uRoadA, uRoadB, uRoadC; varying float vW; varying float vBio; varying vec2 vSU;\n' + KFB_BLEND_GLSL;
// M1 Knetfleck-Regel: symmetrisch, kleine runde Tropfen in beide Richtungen, Deckung = w
const ROAD_APPLY = /* glsl */`
{ vec3 cO = vBio > 0.5 ? uRoadC : uRoadA; float rim; float sel = kfbBlend(vSU, 1.7, vW, rim); diffuseColor.rgb = mix(cO, uRoadB, sel) * (1.0 - 0.12 * rim); }
`;
// M1.1 Überdeckung: Platzsand weht über Asphalt + Linien; verworfen, wo kein Sand liegt
const DRIFT_V = `attribute float aW; attribute vec2 aSU; varying float vW; varying vec2 vSU;\n`;
const DRIFT_F = 'varying float vW; varying vec2 vSU;\n' + KFB_BLEND_GLSL;
const DRIFT_APPLY = /* glsl */`
{ float rim; if (kfbBlend(vSU, 1.1, vW, rim) < 0.5) discard; diffuseColor.rgb *= 1.0 - 0.10 * rim; }
`;

export async function boot(canvas, onNote = () => {}) {
  LEAN = (typeof window !== 'undefined' && window.__KFB_T4_LEAN) || null;
  const PG = (typeof window !== 'undefined' && window.__KFB_T4_PROPS) || null;   // P1 (29.09., additiv): Prop-Wache, ohne Schalter unverändert
  const FIX = (PG && typeof window !== 'undefined' && window.__KFB_T4_FIX) || {};   // J13 (30.09., additiv): strangCap · crownAO, ohne Schalter unverändert
  const tBoot = performance.now();
  const info = { calls: 0, frameTris: 0, loadMs: 0, fps: 0, tris: 0, errors: [], buildMs: 0, pillars: 0, pads: 0, clusters: 0, world: 'canyon', cam: 'uebersicht', centreErr: 0 };
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.info.autoReset = false; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.3, 5000);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.dampingFactor = 0.08;

  onNote('Strecke wird geladen …');
  const td = await fetch(here((typeof window !== 'undefined' && window.__KFB_T4_STREAM) || 'data/td03.stream.json')).then(r => r.json());   // P1 (29.09., additiv): anderer Core-Stream per Schalter, ohne Schalter = TD03
  if (PG && PG.init) PG.init(td);
  const TP = await fetch(here('transition-profiles.v1.json?r=1')).then(r => r.json());
  const PP = await fetch(here('../lab-vfx/clay-particle-profiles.v1.json?r=2')).then(r => r.json());
  const MR = await fetch(here('road-markings.m1.json?r=3')).then(r => r.json());
  const M2 = await fetch(here('road-markings.m2.json?r=4')).then(r => r.json()).catch(e => { info.errors.push('M2: ' + e.message); return null; });
  onNote('Knete wird angerührt …');
  await new Promise(r => setTimeout(r, 0));   // v5: 0 statt 30 ms (verdeckte Tabs richten > 0 ms auf 1 min aus)
  const rel = makeClayRelief({ size: LEAN?.relief || 1024, seed: 31 });
  const tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true; tex.needsUpdate = true;
  const U = makeClayUniforms(THREE, tex); U.uClayMottle.value = 0.04;
  // v5: makeToolReliefs gibt je Werkzeug mit setTimeout(0) ab; ab Verschachtelung 5 richten verdeckte Tabs das auf 1 min aus.
  //     Nur für diesen Aufruf laufen 0-ms-Abgaben über einen MessageChannel (Modul clay-relief.v4 bleibt unverändert).
  const _st = window.setTimeout, mc = new MessageChannel(), mq = []; mc.port1.onmessage = () => { const f = mq.shift(); f && f(); };
  window.setTimeout = (f, d, ...a) => (d ? _st(f, d, ...a) : (mq.push(() => f(...a)), mc.port2.postMessage(0), 0));
  let tr; try { tr = await makeToolReliefs({ size: LEAN?.relief || 1024, seed: 41, onStep: t => onNote('Werkzeug ' + t + ' …') }); } finally { window.setTimeout = _st; mc.port1.close(); }
  {
    const mk = d => { const t = new THREE.DataTexture(d, tr.size, tr.size, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); t.needsUpdate = true; return t; };
    [U.uClayToolA.value, U.uClayToolB.value, U.uClayToolC.value] = tr.maps.map(mk); U.uClayToolOn.value = 1; U.uClayLegacyStroke.value = 0; info.toolMs = tr.ms; }
  try { U.uClayPrint.value = await makePrintTexture(THREE, here('../ref/clay-joebinns/Fingerprints01_3K.png'), 2048); U.uClayPrintOn.value = 1; }
  catch (e) { info.errors.push('Fingerabdrücke: ' + e.message); U.uClayPrint.value = tex; }
  const K = 3;   // Handmaß wie T2 21:30: Hand 1,5 m, Kachel 4,8 m, Abdruck 13,5 m
  U.uClayHand.value = 0.5 * K; U.uClayTile.value = 1.6 * K; U.uClayPrintTile.value = 4.5 * K; U.uClayMacro.value = 0.5; U.uClayLodK.value = 0.6; U.uClayStroke.value = 0.7;

  // ---------- Licht (warmweiß, How-to §3) ----------
  const sun = new THREE.DirectionalLight('#fff4e6', 2.9); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.3; scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#eef4fa', '#9a8a78', 1.05); scene.add(hemi);
  const back = new THREE.DirectionalLight('#ffe6d6', 0.6); scene.add(back);

  // ---------- Materialien je Masse ----------
  const M = {};
  const MIXKEY = { drift: 'terrain', strangT: 'strang', curb: 'rock', walk: 'rock', plate: 'terrain', dam: 'terrain', vfxGround_city: 'terrain', vfxGround_meadow: 'terrain', vfxGround_canyon: 'terrain', vfxGround_coast: 'terrain', strang: 'strang', table: 'terrain', hill0: 'terrain', hill1: 'terrain', tower0: 'house', tower1: 'house', leaf0: 'nature', leaf1: 'nature', leaf2: 'nature', trunk: 'trunk', rock: 'rock', cloud: 'cloud' };
  const clay = (key, color, profile, extra = {}) => { const mk = MIXKEY[key], p = { ...profile, tools: mk ? TOOLMIX[mk] : null, legacy: mk ? 0 : 1 };
    return (M[key] = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color, side: extra.side ?? THREE.FrontSide }), profile: p, role: extra.role })); };
  const W0 = WORLDS.canyon;
  const RU = { uRoadA: { value: new THREE.Color(W0.roadStreet) }, uRoadB: { value: new THREE.Color(W0.roadTrack) }, uRoadC: { value: new THREE.Color(TP.worldPresets.canyon.nature.path) } };
  {
    const m = makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: '#ffffff' }), profile: { ...prof('road', 0.5, K), legacy: 1 } });
    const prev = m.onBeforeCompile;
    m.onBeforeCompile = (sh, r) => { prev(sh, r); Object.assign(sh.uniforms, RU);
      sh.vertexShader = ROAD_V + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vW = aW; vBio = aBio; vSU = aSU;');
      sh.fragmentShader = ROAD_F + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + ROAD_APPLY); };
    m.customProgramCacheKey = () => 'kfb-clay-v10-road7'; M.road = m;
  }
  clay('strang', W0.strang, prof('house', 0.6, K, QUIET));
  // T4: Strang-Ring mit Knetflecken zur Bord-/Wiesenfarbe, Übergangsmassen je Klasse (Bordstein/Gehweg = Fels, Sockel/Böschung = Gelände)
  const T4C = TP.worldPresets.canyon, GROUND = { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 1, crease: 0.6 };
  clay('strangT', W0.strang, prof('house', 0.6, K, QUIET)); patchify(M.strangT, 'strang', 1.7);
  clay('markH', MR.colors.worlds.canyon.hell, prof('water', 0.9, K, { print: 0.2, dent: 0 }), { role: 'knetbar' });   // M1 Rolle hell
  clay('markS', MR.colors.worlds.canyon.signal, prof('water', 0.9, K, { print: 0.2, dent: 0 }), { role: 'knetbar' });   // M1 Rolle signal
  clay('curb', T4C.city.curb, prof('prop', 0.5, K, QUIET));
  clay('walk', T4C.city.walk, prof('prop', 0.5, K, QUIET));
  { clay('drift', T4C.city.plate, prof('terrainFg', 1.1, K, { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 1, crease: 0.6 })); const md = M.drift, pv = md.onBeforeCompile;
    md.onBeforeCompile = (sh, rr) => { pv(sh, rr); sh.vertexShader = DRIFT_V + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vW = aW; vSU = aSU;');
      sh.fragmentShader = DRIFT_F + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + DRIFT_APPLY); };
    md.customProgramCacheKey = () => 'kfb-clay-v10-drift1'; }
  clay('plate', T4C.city.plate, prof('terrainFg', 1.1, K, GROUND));
  clay('dam', T4C.nature.grass, prof('terrainFg', 1.1, K, GROUND)); patchify(M.dam, 'dam', 2.4);
  for (const [b, c] of Object.entries({ city: '#5d6070', meadow: '#6aae4c', canyon: '#e0913e', coast: '#c9a36f' })) clay('vfxGround_' + b, c, prof('terrainFg', 1.1, K, GROUND));
  clay('pad', W0.pad, prof('water', 0.9, K, { print: 0.2, dent: 0 }), { role: 'knetbar' });
  clay('table', W0.table, prof('terrainBg', 3.2, K, { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 0.9, facet: 0.8, crease: 0.4 }));
  W0.hill.forEach((c, i) => clay('hill' + i, c, prof('terrainFg', 1.1, K, { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 1, crease: 0.6 })));
  W0.tower.forEach((c, i) => clay('tower' + i, c, prof('house', 0.6, K, QUIET)));
  W0.leaf.forEach((c, i) => clay('leaf' + i, c, prof('nature', 0.6, K, { print: 0.4, dent: 0 })));
  clay('trunk', W0.trunk, prof('nature', 0.6, K, { print: 0.4, dent: 0 }));
  clay('rock', W0.rock, prof('prop', 0.5, K, QUIET));
  clay('cloud', W0.cloud, prof('cloud', 0.75, K, { dent: 0 }));
  W0.kart.forEach((c, i) => clay('kart' + i, c, prof('vehicle', 0.5, 1, { dent: 0 })));
  clay('tyre', '#2e2c3a', prof('vehicle', 0.5, 1, { dent: 0 }));
  clay('eye', '#fbf6ec', prof('figure', 0.5, 1, { dent: 0 }), { role: 'knetbar' });
  clay('pupil', '#17151d', prof('figure', 0.5, 1, { dent: 0 }), { role: 'knetbar' });
  clay('skin', '#f2b48c', prof('figure', 0.5, 1, { dent: 0 }));

  const root = new THREE.Group(); scene.add(root);
  const addMesh = (g, mat, { cast = true, recv = true, name = '' } = {}) => { const o = new THREE.Mesh(g, mat); o.castShadow = cast; o.receiveShadow = recv; o.name = name; root.add(o); info.tris += (g.index ? g.index.count : g.attributes.position.count) / 3; return o; };
  const bake = parts => { // parts: [geom] → eine Geometrie (nicht indiziert, ohne uv)
    const gs = parts.map(g => { const n = g.index ? g.toNonIndexed() : g; n.deleteAttribute('uv'); return n; });
    return mergeGeometries(gs, false);
  };

  const t0 = performance.now();
  const S = td.samples, N = S.length, ds = td.ds;
  const AT = makeAtlas({ S, N, ds, TP, GY: -0.6, MR, M2 });
  const at = s => { const x = clamp(s / ds, 0, N - 1.001), i = Math.floor(x), f = x - i, a = S[i], b = S[i + 1];
    const l = (u, w) => V(u).lerp(V(w), f); return { p: l(a.p, b.p), T: l(a.T, b.T).normalize(), U: l(a.U, b.U).normalize(), R: l(a.R, b.R).normalize(), i }; };
  const W3 = (q, l, h) => [q.p[0] + q.R[0] * l + q.U[0] * h, q.p[1] + q.R[1] * l + q.U[1] * h, q.p[2] + q.R[2] * l + q.U[2] * h];
  const jIdx = n => td.joints.find(j => j.piece === n)?.index ?? 0;

  // Krümmung (vorzeichenbehaftet: > 0 = Rechtskurve, innen = rechts), geglättet über ±8 m
  const kr = new Float32Array(N), ks = new Float32Array(N);
  for (let i = 0; i < N; i++) { const a = S[Math.max(0, i - 4)], b = S[Math.min(N - 1, i + 4)], q = S[i];
    const d = (b.T[0] - a.T[0]) * q.R[0] + (b.T[1] - a.T[1]) * q.R[1] + (b.T[2] - a.T[2]) * q.R[2]; kr[i] = d / Math.max(0.5, b.s - a.s); }
  for (let i = 0; i < N; i++) { let v = 0, n = 0; for (let j = Math.max(0, i - 16); j <= Math.min(N - 1, i + 16); j++) { v += kr[j]; n++; } ks[i] = v / n; }

  // ---------- Querschnitt des Strangs je Seite (seitenlokal: x nach außen, y hoch) ----------
  const SIDE = { 1: { road: 7, sh: 8, ib: 9, it: 10, ot: 11, un: 13 }, [-1]: { road: 6, sh: 5, ib: 4, it: 3, ot: 2, un: 0 } };
  const RIB = 3.5;   // Rippenabstand (m), eine Rippe = zwei Handbreiten
  const sideProfile = (q, i, sd) => {
    const I = SIDE[sd], sl = q.slots, o = q.prm.offset || 0;
    const e = sd * (sl[I.road][0] - o), ib = sd * (sl[I.ib][0] - o), H = sl[I.it][1], drop = Math.max(0, -sl[I.sh][1]), D = sl[I.un][1];
    // T4: bt 0 = Strang (T3) … 1 = Bordsteinlippe (Stadt, am Boden, rückt an die Fahrbahnkante) bzw. breite flache Wiesenlippe (Natur)
    const bt = AT.barrierT(q.s, sd, i), bn = AT.bio(q.s) === 1, Hx = lerp(H, bn ? 0.5 : 0.32, bt), rxK = bn ? 1 + 0.9 * bt : 1, ibx = bn ? ib : lerp(ib, e + 0.35, bt);
    const inner = sstep(0.008, 0.022, ks[i] * sd) * (1 - bt), outer = sstep(0.014, 0.04, -ks[i] * sd) * (1 - bt);
    const wave = 0.06 * (vnoise(q.s / 9 + (sd > 0 ? 3.1 : 7.7)) - 0.5) * 2;
    const r = clamp(0.55 * (Hx + drop), 0.14, 1.25) * (1 + wave) * (1 + 0.32 * outer), rX = r * rxK;
    const cx = Math.max(ibx, e + 0.4) + 0.85 * rX + 0.12 * outer, top = Hx + 0.3 * outer, cy = top - r;
    const pts = [[e - 0.14, -0.03]];
    const xa = cx - 0.94 * rX, ya = cy - 0.34 * r, rib = 0.5 + 0.5 * Math.cos(2 * Math.PI * q.s / RIB);
    for (let n = 1; n <= 6; n++) { const t = n / 7; let y = lerp(0, ya, t * t) - drop * Math.sin(Math.PI * t);
      y += inner * 0.26 * rib * Math.sin(Math.PI * Math.min(1, t * 1.3)); pts.push([e + t * (xa - e), y]); }
    for (let n = 0; n <= 14; n++) { const th = (200 - n * (240 / 14)) * Math.PI / 180, rr = r * (1 + inner * 0.12 * rib * Math.max(0, 1 - n / 3)); pts.push([cx + rr * rxK * Math.cos(th), cy + rr * Math.sin(th)]); }
    const y0 = cy - 0.64 * r, b = 0.14 * r, Dm = Math.min(D, y0 - 0.1, -0.7);
    pts.push([cx + 0.95 * rX + b, lerp(y0, Dm, 0.4)], [cx + 0.86 * rX + b, lerp(y0, Dm, 0.78)], [cx + 0.5 * rX, Dm + 0.06], [cx * 0.55, Dm - 0.02], [0, Dm - 0.04]);
    return pts;
  };
  const ringOf = (q, i) => { const L = sideProfile(q, i, -1), R = sideProfile(q, i, 1);
    const pts = L.map(([x, y]) => W3(q, (q.prm.offset || 0) - x, y)); for (let n = R.length - 1; n >= 0; n--) pts.push(W3(q, (q.prm.offset || 0) + R[n][0], R[n][1])); return pts; };

  // Läufe mit Fahrfläche (surface 1); Luft bleibt frei
  const runs = []; { let a = -1; for (let i = 0; i <= N; i++) { const on = i < N && (S[i].prm.surface ?? 1) > 0; if (on && a < 0) a = i; if (!on && a >= 0) { if (i - a > 2) runs.push([a, i - 1]); a = -1; } } }

  // Skin-Feld der Fahrbahn: 0 Straße, 1 Bahn (mag fährt auf Bahn); Fugen als Flecken über 24 m
  const skinW = S.map(q => q.skin === 'street' ? 0 : 1), wS = new Float32Array(N);
  { const ev = []; for (let i = 1; i < N; i++) if (skinW[i] !== skinW[i - 1]) ev.push({ s: S[i].s, a: skinW[i - 1], b: skinW[i] });
    for (let i = 0; i < N; i++) { const s = S[i].s; let w = skinW[i];
      for (const e of ev) if (Math.abs(s - e.s) < 14) w = lerp(e.a, e.b, sstep(e.s - 10, e.s + 14, s));
      wS[i] = w; } }
  for (let i = 0; i < N; i++) wS[i] = AT.roadTrack(S[i].s, S[i].skin);   // T4: Fahrbahnmasse aus dem Übergangsvertrag (ersetzt die 24-m-Fuge)
  const bS = S.map(q => (AT.bio(q.s) === 1 ? 1 : 0));

  onNote('Strang wird gerollt …');
  const lips = [];
  { const sp = [], si = [], rp = [], rw = [], rsu = [], ri = [], spw = [], spb = [], sps = [], rbio = []; let sBase = 0, rBase = 0;
    /* J13 strangCap: geschlossener Stream → Anfang und Ende sind EINE Naht (Ringe verbinden, keine Kappen/Lippen). Kappen sonst als
       echte Profilfläche (Ohrenschnitt im R/U-Schnitt) statt Fächer vom Schwerpunkt: der Fächer spannte 8-m-Speichen über die Fahrbahn. */
    const joinSeam = !!(FIX.strangCap && td.closed && runs.length && runs[0][0] === 0 && runs[runs.length - 1][1] === N - 1);
    let seamFirst = -1, seamLast = -1, seamNr = -1;
    for (const [ri0, [a, b]] of runs.entries()) {
      let nr = 0;
      const STR = LEAN?.strangStride || 1, ids = []; for (let i = a; i < b; i += STR) ids.push(i); ids.push(b);
      for (let j = 0; j < ids.length; j++) { const i = ids[j], q = S[i], ring = ringOf(q, i); nr = ring.length; let arc = 0;   // M1: Fleckenkoordinate = Bogenlänge ums Profil (runde Flecken statt gestreckter)
        ring.forEach((p, k) => { if (k) arc += Math.hypot(p[0] - ring[k - 1][0], p[1] - ring[k - 1][1], p[2] - ring[k - 1][2]); sp.push(...p); const sd = k < nr / 2 ? -1 : 1; spw.push(AT.barrierT(q.s, sd, i)); spb.push(bS[i]); sps.push(q.s, arc); });
        const L = q.slots[6], Rr = q.slots[7];
        for (let n = 0; n <= 6; n++) { const lat = lerp(L[0], Rr[0], n / 6), h = lerp(L[1], Rr[1], n / 6); rp.push(...W3(q, lat, h)); rw.push(wS[i]); rbio.push(bS[i]); rsu.push(q.s, lat); }
        if (j > 0) { const A = sBase + (j - 1) * nr, B = sBase + j * nr; for (let k = 0; k < nr - 1; k++) si.push(A + k, B + k, A + k + 1, A + k + 1, B + k, B + k + 1);
          const C = rBase + (j - 1) * 7, E = rBase + j * 7; for (let k = 0; k < 6; k++) ri.push(C + k, C + k + 1, E + k, C + k + 1, E + k + 1, E + k); } }
      // Kappen an den Laufenden (flach, der Stream verjüngt dort ohnehin)
      if (joinSeam && ri0 === 0) { seamFirst = sBase; seamNr = nr; }
      if (joinSeam && ri0 === runs.length - 1) seamLast = sBase + (ids.length - 1) * nr;
      for (const [i, dir, jj] of [[a, -1, 0], [b, 1, ids.length - 1]]) { const base = sBase + jj * nr, c = [0, 0, 0];
        if (joinSeam && ((ri0 === 0 && dir < 0) || (ri0 === runs.length - 1 && dir > 0))) continue;
        if (FIX.strangCap) { const q = S[i], R3 = V(q.R), U3 = V(q.U), T3 = V(q.T), c2 = [], P0 = V(sp.slice(base * 3, base * 3 + 3));
          for (let k = 0; k < nr; k++) { const pk = V(sp.slice((base + k) * 3, (base + k) * 3 + 3)).sub(P0); c2.push(new THREE.Vector2(pk.dot(R3), pk.dot(U3))); }
          const tris = THREE.ShapeUtils.triangulateShape(c2, []);
          if (tris.length >= nr - 3) { for (const [x0, x1, x2] of tris) { const p0 = V(sp.slice((base + x0) * 3, (base + x0) * 3 + 3)), p1 = V(sp.slice((base + x1) * 3, (base + x1) * 3 + 3)), p2 = V(sp.slice((base + x2) * 3, (base + x2) * 3 + 3));
              const nrm = p1.clone().sub(p0).cross(p2.clone().sub(p0)); if (nrm.dot(T3) * dir > 0) si.push(base + x0, base + x1, base + x2); else si.push(base + x0, base + x2, base + x1); }
            continue; } }
        for (let k = 0; k < nr; k++) for (let j = 0; j < 3; j++) c[j] += sp[(base + k) * 3 + j] / nr;
        const ci = sp.length / 3; sp.push(...c); spw.push(0); spb.push(0); sps.push(S[i].s, 0); const T = S[i].T;
        for (let k = 0; k < nr - 1; k++) { const p0 = V(sp.slice((base + k) * 3, (base + k) * 3 + 3)), p1 = V(sp.slice((base + k + 1) * 3, (base + k + 1) * 3 + 3));
          const nrm = p0.clone().sub(V(c)).cross(p1.clone().sub(V(c))); if (nrm.dot(V(T)) * dir > 0) si.push(ci, base + k, base + k + 1); else si.push(ci, base + k + 1, base + k); } }
      sBase = sp.length / 3; rBase = rp.length / 3;
      for (const i of [a, b]) { if (joinSeam && ((ri0 === 0 && i === a) || (ri0 === runs.length - 1 && i === b))) continue; const q = S[i], w = q.slots[13][0] - q.slots[0][0], g = new THREE.CapsuleGeometry(0.48, Math.max(0.5, w - 0.96), 8, 18);
        g.rotateZ(Math.PI / 2); g.applyMatrix4(new THREE.Matrix4().makeBasis(V(q.R), V(q.U), V(q.T).negate()));
        const c = W3(q, (q.slots[0][0] + q.slots[13][0]) / 2, -0.5); g.translate(c[0], c[1], c[2]); seedGeometry(THREE, g, 700 + i); lips.push(g); }
    }
    if (joinSeam && seamFirst >= 0 && seamLast >= 0) { const A = seamLast, B = seamFirst; for (let k = 0; k < seamNr - 1; k++) si.push(A + k, B + k, A + k + 1, A + k + 1, B + k, B + k + 1); info.strangSeam = 'joined'; }
    const gs = new THREE.BufferGeometry(); gs.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    gs.setAttribute('aPW', new THREE.Float32BufferAttribute(spw, 1)); gs.setAttribute('aPBio', new THREE.Float32BufferAttribute(spb, 1)); gs.setAttribute('aPS', new THREE.Float32BufferAttribute(sps, 2)); gs.setIndex(si); gs.computeVertexNormals(); seedGeometry(THREE, gs, 11);
    addMesh(gs, M.strangT, { name: 'strang' }); addMesh(bake(lips), M.strang, { name: 'lippen' });
    const gr = new THREE.BufferGeometry(); gr.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3)); gr.setAttribute('aW', new THREE.Float32BufferAttribute(rw, 1)); gr.setAttribute('aBio', new THREE.Float32BufferAttribute(rbio, 1));
    gr.setAttribute('aSU', new THREE.Float32BufferAttribute(rsu, 2)); gr.setIndex(ri); gr.computeVertexNormals(); seedGeometry(THREE, gr, 5);
    addMesh(gr, M.road, { name: 'fahrbahn' });
    // Mittellinie gegen p (Prüfung Bedingung 1): Mitte der Fahrbahnreihe = p + R·offset
    let err = 0; for (let i = 0; i < N; i += 25) { const q = S[i], m = W3(q, (q.slots[6][0] + q.slots[7][0]) / 2, 0), c = W3(q, q.prm.offset || 0, 0); err = Math.max(err, Math.hypot(m[0] - c[0], m[1] - c[1], m[2] - c[2])); }
    info.centreErr = err;
  }

  // ---------- Boost-Pfeile (Magnet-Balken als Knetplatten, Spitze in Fahrtrichtung) ----------
  { const parts = [];
    for (const mk of td.markings.filter(m => m.at === 'bars')) {
      const sm = (mk.s0 + mk.s1) / 2, i = Math.round(sm / ds), q = S[clamp(i, 0, N - 1)], rw = q.slots[7][0] - q.slots[6][0];
      const w = mk.span * rw, th = 0.95, tip = Math.min(2.0, w * 0.22);
      const sh = new THREE.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(0, tip); sh.lineTo(w / 2, 0); sh.lineTo(w / 2, -th); sh.lineTo(0, tip - th); sh.lineTo(-w / 2, -th); sh.closePath();
      const g = new THREE.ExtrudeGeometry(sh, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.16, bevelSegments: 3, curveSegments: 4 });
      const a = at(sm), m = new THREE.Matrix4().makeBasis(a.R, a.T, a.U); m.setPosition(a.p.clone().addScaledVector(a.U, 0.02).addScaledVector(a.R, q.prm.offset || 0));
      g.applyMatrix4(m); seedGeometry(THREE, g, 300 + parts.length); parts.push(g);
    }
    info.pads = parts.length; if (parts.length) addMesh(bake(parts), M.pad, { name: 'boost' });
  }

  // ---------- Tisch, Abstandsfeld ----------
  const box = new THREE.Box3(); S.forEach(q => box.expandByPoint(V(q.p)));
  const ctr = box.getCenter(new THREE.Vector3()), ext = box.getSize(new THREE.Vector3());
  const GY = -0.6;
  { const w = ext.x + 420, d = ext.z + 420, r = 90, sh = new THREE.Shape();
    sh.moveTo(-w / 2 + r, -d / 2); sh.lineTo(w / 2 - r, -d / 2); sh.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r); sh.lineTo(w / 2, d / 2 - r);
    sh.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2); sh.lineTo(-w / 2 + r, d / 2); sh.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r); sh.lineTo(-w / 2, -d / 2 + r); sh.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
    const g = new THREE.ExtrudeGeometry(sh, { depth: 6, bevelEnabled: true, bevelThickness: 4, bevelSize: 8, bevelSegments: 6, curveSegments: 28 });
    g.rotateX(-Math.PI / 2); g.translate(ctr.x, GY - 10, ctr.z); seedGeometry(THREE, g, 77); addMesh(g, M.table, { cast: false, name: 'tisch' }); }
  const CELL = 8, grid = new Map();
  for (let i = 0; i < N; i += 4) { const q = S[i], k = Math.floor(q.p[0] / CELL) + ',' + Math.floor(q.p[2] / CELL); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(q.p); }
  const distXZ = (x, z, maxR = 80) => { const cx = Math.floor(x / CELL), cz = Math.floor(z / CELL), n = Math.ceil(maxR / CELL); let best = maxR;
    for (let a = -n; a <= n; a++) for (let b = -n; b <= n; b++) { const L = grid.get((cx + a) + ',' + (cz + b)); if (!L) continue; for (const p of L) { const d = Math.hypot(p[0] - x, p[2] - z); if (d < best) best = d; } }
    return best; };
  const R = rng(20260927);
  const pick = arr => arr[Math.floor(R() * arr.length)];
  const TW = ext.x + 380, TD = ext.z + 380;
  const place = (minD, maxD, tries = 60) => { for (let n = 0; n < tries; n++) { const x = ctr.x + (R() - 0.5) * TW, z = ctr.z + (R() - 0.5) * TD, d = distXZ(x, z, maxD + 2); if (d >= minD && d <= maxD && !AT.blocked(x, z, minD)) return [x, z]; } return null; };
  AT.plan({ ctr, ext, distXZ });

  // ---------- Stützen mit Cartoon-Anatomie ----------
  onNote('Stützen werden geknetet …');
  const pillarCands = [];
  { const parts = [];
    const lathe = (h, Rr, segs) => { // Elefantenfuß · je Glied Taille und Bauch · Kissen an den Fugen · Kapitell
      const P = [[0.001, 0], [1.62 * Rr, 0], [1.66 * Rr, 0.18 * Rr], [1.45 * Rr, 0.6 * Rr], [1.08 * Rr, 1.1 * Rr]];
      const y0 = 1.1 * Rr, y1 = h - 1.0 * Rr, L = (y1 - y0) / segs;
      for (let k = 0; k < segs; k++) { const a = y0 + k * L; P.push([0.86 * Rr, a + 0.28 * L], [1.06 * Rr, a + 0.7 * L]);
        if (k < segs - 1) P.push([0.98 * Rr, a + 0.92 * L], [1.26 * Rr, a + L], [0.98 * Rr, a + L + 0.08 * L]); }
      P.push([0.98 * Rr, y1], [1.42 * Rr, h - 0.45 * Rr], [1.36 * Rr, h - 0.08 * Rr], [0.001, h]);
      const cv = new THREE.CatmullRomCurve3(P.map(([r, y]) => new THREE.Vector3(r, y, 0)), false, 'centripetal');
      const pts = cv.getPoints(LEAN ? Math.max(20, segs * 10) : Math.max(40, segs * 22)).map(v => new THREE.Vector2(Math.max(0.001, v.x), v.y));
      return new THREE.LatheGeometry(pts, LEAN ? 14 : 30);
    };
    let s = 8; const Lend = S[N - 1].s;
    while (s < Lend - 4) {
      const i = Math.round(s / ds), q = S[i]; const step = Math.abs(ks[i]) > 0.02 ? 11 : 16; s += step;
      if ((q.prm.surface ?? 1) < 1 || q.U[1] < 0.93 || q.tags.includes('LOOP')) continue;
      const bot = W3(q, q.prm.offset || 0, q.slots[0][1] - 0.02), top = bot[1] + 0.3, h = top - GY;
      if (h < 3) continue;
      let below = false; for (let j = 0; j < N; j += 2) { const p = S[j].p; if (Math.abs(S[j].s - q.s) > 25 && p[1] < bot[1] - 1 && Math.hypot(p[0] - bot[0], p[2] - bot[2]) < 12) { below = true; break; } }
      if (below) continue;
      const rw = q.slots[7][0] - q.slots[6][0], dbl = h > 14;
      const d = clamp(h / 3, 2.4, dbl ? 4.2 : 4.6), Rr = d / 2, segs = Math.max(1, Math.round(h / (3.6 * d)));
      const legs = dbl ? [-Math.min(rw * 0.28, 4.6), Math.min(rw * 0.28, 4.6)] : [0];
      const tilt = (R() - 0.5) * 2 * 0.05, yaw = R() * Math.PI;
      for (const lat of legs) { const g = lathe(h, Rr, segs); g.rotateY(yaw); g.rotateZ(tilt * (lat >= 0 ? 1 : -1));
        const p = W3(q, (q.prm.offset || 0) + lat, 0); g.translate(p[0], GY - 0.15, p[2]); seedGeometry(THREE, g, 500 + parts.length); parts.push(g); }
      if (dbl) { const L = 1.1 * Rr, span = legs[1] - legs[0], hs = [];
        for (let k = 1; k < segs; k++) hs.push(GY + 1.1 * Rr + k * (h - 2.1 * Rr) / segs); if (!hs.length) hs.push(GY + h * 0.55);
        for (const y of hs) { const g = new THREE.CapsuleGeometry(0.5 * L, span, 8, 18); g.rotateZ(Math.PI / 2);
          const R3 = V(q.R), c = W3(q, q.prm.offset || 0, 0); g.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.atan2(-R3.z, R3.x))); g.translate(c[0], y, c[2]);
          seedGeometry(THREE, g, 900 + parts.length); parts.push(g); } }
      info.pillars++;
      if (!info.pillarShot && h > 8 && h < 20) { const p = V(W3(q, 0, 0)), Rv = V(q.R); pillarCands.push({ p, R: Rv, h }); }
    }
    if (parts.length) addMesh(bake(parts), M.strang, { name: 'stuetzen' });
  }

  // ---------- Welt ----------
  onNote('Welt wird aufgestellt …');
  const bins = {}; const put = (key, g, seed) => { seedGeometry(THREE, g, seed); (bins[key] = bins[key] || []).push(g); };
  const blob = (r, detail = 3, lumpK = 0.12, seed = 1) => { let g = new THREE.IcosahedronGeometry(r, detail + (LEAN?.blobDetail ?? 2)); g.deleteAttribute('normal'); g.deleteAttribute('uv'); g = mergeVertices(g); const p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = v.clone().normalize(); const f = 1 + lumpK * (Math.sin(n.x * 3.1 + seed) * Math.sin(n.y * 2.7 + seed * 1.7) * Math.sin(n.z * 3.3 + seed * 0.3)); v.copy(n.multiplyScalar(r * f)); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals(); return g; };
  // Hügel: gedrückte, schief geschobene Knetbuckel am Rand
  for (let n = 0; n < 22; n++) { const rx = 22 + R() * 34, ry = 9 + R() * 20, rz = rx * (0.6 + R() * 0.5), at2 = place(rx * 1.05 + 16, 400); if (!at2) continue;
    const g = LEAN ? new THREE.SphereGeometry(1, 30, 18) : new THREE.SphereGeometry(1, 56, 36), p = g.attributes.position, lean = (R() - 0.5) * 0.6;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); p.setXYZ(i, x * rx + lean * rx * y * y, y * ry, z * rz); }
    g.computeVertexNormals(); g.rotateY(R() * Math.PI); g.translate(at2[0], GY - ry * 0.32, at2[1]); put('hill' + (n % 2), g, 40 + n); }
  // Schiefe Türme (Claybound-Tafelberg × O-Town): gestapelte Kissenblöcke, jeder verdreht und versetzt
  for (let n = 0; n < 12; n++) { const base = 13 + R() * 14, at2 = place(base * 1.1 + 22, 330); if (!at2) continue; let y = GY - 1, w = base, dx = 0, dz = 0; const lv = 3 + Math.floor(R() * 3), key = 'tower' + (n % 2);
    for (let k = 0; k < lv; k++) { const hgt = w * (0.7 + R() * 0.5), g = new RoundedBoxGeometry(w, hgt, w * (0.8 + R() * 0.3), 5, Math.min(w, hgt) * 0.22);
      g.rotateY(R() * Math.PI); g.rotateZ((R() - 0.5) * 0.18); g.rotateX((R() - 0.5) * 0.14); g.translate(at2[0] + dx, y + hgt / 2, at2[1] + dz); put(k % 2 ? 'tower' + ((n + 1) % 2) : key, g, 60 + n * 5 + k);
      y += hgt * 0.94; dx += (R() - 0.5) * w * 0.3; dz += (R() - 0.5) * w * 0.3; w *= 0.62 + R() * 0.18; }
    if (R() < 0.6) { const g = blob(w * 0.55, 3, 0.1, n); g.scale(1, 0.8, 1); g.translate(at2[0] + dx, y + w * 0.3, at2[1] + dz); put(pick(['leaf0', 'leaf1', 'leaf2']), g, 90 + n); } }
  // Rule of Three: Baum (Anker) · zwei Büsche (Stütze) · Fels (Akzent). Stamm krumm, Krone Kugel-in-Kugel.
  const tree = (x, z, sc, seed, y0 = GY) => { if (PG && !PG.ok('tree', x, y0, z, 1.1 * sc, 6.5 * sc, 21 * sc)) return; const h = (11 + R() * 9) * sc, bend = (R() - 0.5) * 0.5 * h, bend2 = (R() - 0.5) * 0.35 * h, ang = R() * Math.PI * 2, c = Math.cos(ang), s = Math.sin(ang);
    const pts = [[0, 0], [bend * 0.15, h * 0.3], [bend, h * 0.62], [bend + bend2, h]].map(([u, y]) => new THREE.Vector3(x + u * c, y0 - 0.3 + y, z + u * s));
    const cv = new THREE.CatmullRomCurve3(pts), rT = (0.75 + R() * 0.4) * sc;
    const g = new THREE.TubeGeometry(cv, 24, rT, 12, false); put('trunk', g, seed);
    const foot = blob(rT * 1.9, 2, 0.08, seed); foot.scale(1, 0.45, 1); foot.translate(x, y0 - 0.1, z); put('trunk', foot, seed + 1);
    const tp = pts[3], cr = (4.2 + R() * 2.6) * sc, key = pick(['leaf0', 'leaf0', 'leaf1', 'leaf2']);
    const main = blob(cr, 3, 0.1, seed); main.scale(1, 0.9, 1); main.translate(tp.x, tp.y + cr * 0.55, tp.z); put(key, main, seed + 2);
    const SPH = [{ c: new THREE.Vector3(tp.x, tp.y + cr * 0.55, tp.z), r: cr * 0.95 }], parts = [[main, 0]];
    const nb = 2 + Math.floor(R() * 3); for (let k = 0; k < nb; k++) { const a = R() * Math.PI * 2, rr = cr * (0.45 + R() * 0.25), g2 = blob(rr, 3, 0.1, seed + k);
      const cx = tp.x + Math.cos(a) * cr * 0.75, cy = tp.y + cr * (0.3 + R() * 0.7), cz = tp.z + Math.sin(a) * cr * 0.75; g2.translate(cx, cy, cz); put(R() < 0.25 ? pick(['leaf0', 'leaf1', 'leaf2']) : key, g2, seed + 3 + k);
      SPH.push({ c: new THREE.Vector3(cx, cy, cz), r: rr }); parts.push([g2, SPH.length - 1]); }
    if (FIX.crownAO) { parts.forEach(([gg, si]) => sphereAO(THREE, gg, SPH, si)); sphereAO(THREE, g, SPH, -1); sphereAO(THREE, foot, SPH, -1); } };
  const bush = (x, z, sc, seed, y0 = GY) => { if (PG && !PG.ok('bush', x, y0, z, 2.6 * sc, 3.4 * sc, 4 * sc)) return; const key = pick(['leaf0', 'leaf1', 'leaf2']), n = 2 + Math.floor(R() * 2);
    for (let k = 0; k < n; k++) { const r = (2.0 + R() * 1.4) * sc, g = blob(r, 3, 0.12, seed + k); g.scale(1, 0.78, 1); g.translate(x + (R() - 0.5) * r * 1.6, y0 + r * 0.35, z + (R() - 0.5) * r * 1.6); put(key, g, seed + k); } };
  const rock = (x, z, sc, seed, y0 = GY) => { if (PG && !PG.ok('rock', x, y0, z, 3.6 * sc, 4 * sc, 3 * sc)) return; const r = (2.2 + R() * 2.0) * sc, g = blob(r, 3, 0.25, seed); g.scale(1, 0.62, 1.1); g.rotateY(R() * 3); g.translate(x, y0 + r * 0.2, z); put('rock', g, seed); };
  for (let n = 0; n < 52; n++) { const a = place(20, 95); if (!a) continue; const sc = 0.85 + R() * 0.5, ang = R() * Math.PI * 2;
    tree(a[0], a[1], sc, 1000 + n * 20);
    for (let k = 0; k < 2; k++) { const bx = a[0] + Math.cos(ang + k * 1.4) * (6 + R() * 3), bz = a[1] + Math.sin(ang + k * 1.4) * (6 + R() * 3); if (distXZ(bx, bz, 18) >= 15 && !AT.blocked(bx, bz)) bush(bx, bz, sc, 1000 + n * 20 + 8 + k * 3); }
    const rx = a[0] + Math.cos(ang - 1.6) * (8 + R() * 3), rz = a[1] + Math.sin(ang - 1.6) * (8 + R() * 3); if (distXZ(rx, rz, 18) >= 15 && !AT.blocked(rx, rz)) rock(rx, rz, sc, 1000 + n * 20 + 16);
    info.clusters++; }
  // Wolken: Kugel-in-Kugel, flache Unterseite
  for (let n = 0; n < 14; n++) { const x = ctr.x + (R() - 0.5) * TW * 1.1, z = ctr.z + (R() - 0.5) * TD * 1.1, y = 85 + R() * 60, sc = 7 + R() * 7, k = 4 + Math.floor(R() * 3);
    for (let j = 0; j < k; j++) { const r = sc * (0.6 + R() * 0.55) * (j === 0 ? 1.3 : 1), g = blob(r, 3, 0.07, n * 10 + j); g.scale(1, 0.82, 1); g.translate(x + (j - k / 2) * sc * 0.95, y + (R() - 0.2) * sc * 0.4, z + (R() - 0.5) * sc * 0.8); put('cloud', g, 3000 + n * 10 + j); } }
  AT.buildNature({ addMesh, M, tree, bush, rock, seedGeometry });
  for (const [key, list] of Object.entries(bins)) { if (FIX.crownAO) { ensureColor(THREE, list); if (list.some(g => g.attributes.color)) { M[key].vertexColors = true; M[key].needsUpdate = true; } }
    addMesh(bake(list), M[key], { name: key, cast: key !== 'cloud', recv: key !== 'cloud' }); }
  await AT.build({ root, addMesh, M, seedGeometry, onNote, makeClayMaterial, U, prof, K, QUIET, TOOLMIX });
  info.t4 = AT.info;

  // ---------- Karts ----------
  const karts = [];
  const mkKart = (ci) => { const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
    const add = (geo, mat, x, y, z, par = body) => { seedGeometry(THREE, geo, 4000 + ci * 30 + par.children.length); const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; par.add(m); return m; };
    add(new RoundedBoxGeometry(2.3, 0.75, 3.7, 4, 0.34), M['kart' + ci], 0, 0.78, 0);
    add(new RoundedBoxGeometry(1.7, 0.5, 1.3, 4, 0.24), M['kart' + ci], 0, 1.05, 1.55);
    add(new RoundedBoxGeometry(1.4, 1.0, 0.4, 4, 0.18), M['kart' + ci], 0, 1.55, -1.05);
    const head = add(new THREE.SphereGeometry(0.72, 28, 20), M.skin, 0, 2.2, -0.35);
    for (const sx of [-0.27, 0.27]) { add(new THREE.SphereGeometry(0.26, 18, 14), M.eye, sx, 2.38, 0.22); add(new THREE.SphereGeometry(0.12, 12, 10), M.pupil, sx * 1.05, 2.4, 0.46); }
    add(new THREE.SphereGeometry(0.2, 14, 10), M.skin, 0, 2.12, 0.38);
    const wheels = [];
    for (const [x, z] of [[-1.25, 1.25], [1.25, 1.25], [-1.25, -1.2], [1.25, -1.2]]) { const w = add(new THREE.CylinderGeometry(0.62, 0.62, 0.62, 22).rotateZ(Math.PI / 2), M.tyre, x, 0.62, z, g); wheels.push(w); }
    return { g, body, wheels, head };
  };
  const KV = [{ lat: -3.0, v: 24, s: 0 }, { lat: 2.6, v: 22.5, s: 0 }, { lat: 0, v: 21, s: 0 }];
  const Lroute = S[N - 1].s;
  const startS = S[jIdx('atrium_up')].s - 50;
  KV.forEach((k, n) => { const kt = mkKart(n); k.s = startS + 14 * (2 - n); k.obj = kt; root.add(kt.g); karts.push(k); });
  const placeKart = (k, t) => { const a = at(k.s), m = new THREE.Matrix4().makeBasis(a.R.clone().negate(), a.U, a.T);
    const p = a.p.clone().addScaledVector(a.R, k.lat); m.setPosition(p); k.obj.g.matrixAutoUpdate = false; k.obj.g.matrix.copy(m); k.obj.g.matrixWorldNeedsUpdate = true;
    k.obj.body.scale.set(1 - 0.03 * Math.sin(t * 9 + k.lat), 1 + 0.05 * Math.sin(t * 9 + k.lat), 1); k.obj.head.position.y = 2.2 + 0.08 * Math.sin(t * 7 + k.lat * 2);
    k.obj.wheels.forEach(w => { w.rotation.x = k.s / 0.62; }); };

  // ---------- Kameras ----------
  const view = (s, lat, lift, back, lat2, lift2, fwd) => { const a = at(s - back), b = at(s + fwd); return { pos: a.p.clone().addScaledVector(a.R, lat).addScaledVector(a.U, lift), tgt: b.p.clone().addScaledVector(b.R, lat2).addScaledVector(b.U, lift2) }; };
  const hp = Math.round((jIdx('plaza_hairpin') + jIdx('east_run')) / 2), hpSide = Math.sign(ks[hp]) || 1, hpS = S[hp].s, hpE = S[hp].slots[7][0];
  const dr = Math.round(jIdx('drift_ring') + (jIdx('to_orange') - jIdx('drift_ring')) * 0.45), drS = S[dr].s, drOut = -(Math.sign(ks[dr]) || 1);
  const airS = S[jIdx('air')].s, magS = S[jIdx('mag_in')].s;
  const loopC = new THREE.Vector3(); { const a = jIdx('roof_loop'), b = jIdx('loop_out'); for (let i = a; i <= b; i++) loopC.add(V(S[i].p)); loopC.multiplyScalar(1 / (b - a + 1)); }
  const loopR = V(S[jIdx('roof_loop')].R);
  let PS = null; for (const c of pillarCands) { for (const sg of [1, -1]) { const pos = c.p.clone().addScaledVector(c.R, sg * 58); if (distXZ(pos.x, pos.z, 30) >= 28) { PS = { ...c, pos }; break; } } if (PS) break; }
  const shots = {
    uebersicht: { pos: new THREE.Vector3(ctr.x - 250, 250, ctr.z - 400), tgt: new THREE.Vector3(ctr.x + 10, 0, ctr.z + 10) },
    nah: view(hpS, hpSide * (hpE - 4), 7.5, 9, hpSide * (hpE + 1.4), 0, 7),
    prall: view(drS, -drOut * 2, 3.2, 18, drOut * 10.5, 0.8, 4),
    stuetzen: PS ? { pos: new THREE.Vector3(PS.pos.x, GY + PS.h * 0.45, PS.pos.z), tgt: new THREE.Vector3(PS.p.x, GY + PS.h * 0.45, PS.p.z) } : null,
    boost: view(magS + 6, -1.2, 3.6, 12, 0, 0.4, 14),
    kicker: { pos: at(airS - 10).p.clone().addScaledVector(at(airS).R, 34).add(new THREE.Vector3(0, 5, 0)), tgt: at(airS + 4).p.clone().add(new THREE.Vector3(0, -1, 0)) },
    loop: { pos: loopC.clone().addScaledVector(loopR, 78).add(new THREE.Vector3(0, 4, 0)), tgt: loopC }
  };
  if (!shots.stuetzen) shots.stuetzen = shots.uebersicht;

  // Sonne und Schattenkasten über den ganzen Tisch
  sun.position.set(ctr.x - 160, 260, ctr.z + 120); sun.target.position.copy(ctr);
  Object.assign(sun.shadow.camera, { left: -330, right: 330, top: 330, bottom: -330, near: 20, far: 800 }); sun.shadow.camera.updateProjectionMatrix();
  back.position.set(ctr.x + 200, 120, ctr.z - 160);
  info.buildMs = Math.round(performance.now() - t0);

  // ---------- T4: Clay-VFX ----------
  const pads = td.markings.filter(m => m.at === 'bars').map(m => ({ s0: m.s0, s1: m.s1 }));
  const VFX = makeClayVFX(root, PP, { camera, accent: () => '#' + M.pad.color.getHexString() });
  const KD = makeKartDriver({ VFX, AT, at, ks, S, ds, pads, landS: S[jIdx('landing')].s + 2 });
  const BD = makeBoardDriver({ VFX, cells: AT.cells || [], root, color: WORLDS.canyon.kart[0] });
  Object.assign(shots, AT.shots(at));
  { const qE = S[N - 1], tE = V(qE.T), rE = V(qE.R), pE = V(qE.p), up = new THREE.Vector3(0, 1, 0);   // M1-Prüfkameras
    shots.auslauf = { pos: pE.clone().addScaledVector(tE, -30).addScaledVector(rE, -20).addScaledVector(up, 34), tgt: pE.clone().addScaledVector(tE, 8), s: qE.s };
    shots.zebra = { pos: pE.clone().addScaledVector(tE, -44).addScaledVector(rE, 5).addScaledVector(up, 9), tgt: pE.clone().addScaledVector(tE, -14), s: qE.s - 18 };   // M2: Zebra 12–18 m vor dem Ende
    shots.markStrang = { ...view(770, -12, 7.5, 20, 2, 0, 16), s: 770 };
    shots.markMag = { ...view(magS + 24, -9, 6, 16, 1, 0, 14), s: magS + 24 }; }
  const shotS = Object.fromEntries(Object.entries(shots).map(([k, v]) => [k, v && v.s != null ? v.s : null]));
  info.vfx = VFX.stats; info.kartEvents = KD.events; const FT = [];

  // ---------- Nachbearbeitung ----------
  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  let aoPass = null;
  try { const { GTAOPass } = await import('three/addons/postprocessing/GTAOPass.js'); aoPass = new GTAOPass(scene, camera, 2, 2);
    aoPass.updateGtaoMaterial({ radius: 1.6, distanceExponent: 1.4, thickness: 2.0, scale: 1.0, samples: 16 }); aoPass.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
    aoPass.blendIntensity = 0.8; composer.addPass(aoPass); } catch (e) { info.errors.push('AO: ' + e.message); }
  composer.addPass(new OutputPass());
  const resize = () => { const w = canvas.clientWidth || 800, h = canvas.clientHeight || 450; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  const st = { world: 'canyon', cam: 'uebersicht', run: true, grey: false };
  const setWorld = key => { const Wd = WORLDS[key] || W0; st.world = info.world = key;
    scene.background = new THREE.Color(Wd.sky); scene.fog = new THREE.Fog(Wd.sky, 700, 1900);
    RU.uRoadA.value.set(Wd.roadStreet); RU.uRoadB.value.set(Wd.roadTrack);
    M.strang.color.set(Wd.strang); M.strangT.color.set(Wd.strang); AT.setWorld(key, M, RU); if (BD.puck) BD.puck.material.color.set(Wd.kart[0]); M.pad.color.set(Wd.pad); M.table.color.set(Wd.table); M.trunk.color.set(Wd.trunk); M.rock.color.set(Wd.rock); M.cloud.color.set(Wd.cloud);
    Wd.hill.forEach((c, i) => M['hill' + i].color.set(c)); Wd.tower.forEach((c, i) => M['tower' + i].color.set(c)); Wd.leaf.forEach((c, i) => M['leaf' + i].color.set(c)); Wd.kart.forEach((c, i) => M['kart' + i].color.set(c)); };
  setWorld('canyon');
  const resetKarts = s0 => karts.forEach((k, n) => { k.s = s0 + 14 * (2 - n); });
  const shot = id => { info.cam = id; if (id === 'fahrtNatur') resetKarts(AT.Z.ZB.s0 - 45); if (id === 'fahrtStadt') resetKarts(AT.Z.ZN.s1 - 30);
    if (id.startsWith('fahrt')) { st.cam = 'fahrt'; controls.enabled = false; return; }
    st.cam = id; controls.enabled = true; const v = shots[id] || shots.uebersicht; camera.position.copy(v.pos); controls.target.copy(v.tgt); controls.update(); AT.mood(shotS[id] ?? null, hemi, sun, true); };
  shot('uebersicht');

  let raf = 0, last = performance.now(), frames = 0, fpsT = last, tAll = 0; const hooks = [];
  const camPos = new THREE.Vector3(), camTgt = new THREE.Vector3(); let camInit = false;
  const step = fixed => { const now = performance.now(), dt = fixed ?? Math.min(0.05, (now - last) / 1000); if (fixed == null) { FT.push(now - last); if (FT.length > 240) FT.shift(); } last = now; tAll += dt;
    for (const k of karts) { if (st.run) { k.s += k.v * dt; if (k.s > Lroute - 2) k.s = 2; } placeKart(k, tAll); }
    if (st.cam === 'fahrt') { const k = karts[0], a = at(k.s - 11), b = at(k.s + 12);
      const p = a.p.clone().addScaledVector(a.U, 4.4).addScaledVector(a.R, k.lat * 0.6), t = b.p.clone().addScaledVector(b.U, 1.0).addScaledVector(b.R, k.lat * 0.4);
      if (!camInit) { camPos.copy(p); camTgt.copy(t); camInit = true; } camPos.lerp(p, 0.2); camTgt.lerp(t, 0.2); camera.up.lerp(a.U, 0.15).normalize(); camera.position.copy(camPos); camera.lookAt(camTgt); }
    else if (st.cam !== 'extern') { camInit = false; camera.up.set(0, 1, 0); controls.update(); }
    for (const h of hooks) h(dt, tAll);   // J02 (29.09., additiv): Fremd-Takt vor dem Bild, z. B. Fahrphysik; T4 selbst nutzt es nicht
    KD.tick(karts, dt, st.run); BD.tick(dt, tAll); VFX.update(dt); AT.mood(st.cam === 'fahrt' ? karts[0].s : (st.cam === 'extern' ? st.moodS ?? null : (shotS[st.cam] ?? null)), hemi, sun);
    renderer.info.reset(); if (st.fast) renderer.render(scene, camera); else composer.render(); info.calls = renderer.info.render.calls; info.frameTris = renderer.info.render.triangles; frames++; if (now - fpsT > 1000) { info.fps = Math.round(frames * 1000 / (now - fpsT)); frames = 0; fpsT = now; } };
  // v5: Last-Wächter. Ein schweres Bild je Task, danach Pausen; bei hoher Last stufenweise sparsamer (nur Kosten, keine Formänderung).
  const G = { level: 0, avg: 16, skip: 0, n: 0 }; info.guard = G;
  const guard = ms => { G.avg = G.avg * 0.85 + ms * 0.15; G.n++;
    if (G.n > 12 && G.avg > 70 && G.level < 3) { G.level++; G.n = 0;
      if (G.level === 1) renderer.setPixelRatio(1);
      if (G.level === 2 && aoPass) aoPass.enabled = false;
      if (G.level === 3) { sun.shadow.map?.dispose(); sun.shadow.map = null; sun.shadow.mapSize.set(2048, 2048); }
      resize(); } };
  const loop = () => { raf = requestAnimationFrame(loop); if (G.skip > 0) { G.skip--; return; }
    const t0 = performance.now(); step(); const c = performance.now() - t0; guard(c); if (c > 100) G.skip = Math.min(10, Math.floor(c / 50)); };
  info.loadMs = Math.round(performance.now() - tBoot);
  raf = requestAnimationFrame(loop);   // v5: kein synchrones erstes Bild am Ende des Aufbaus

  return {
    info, WORLDS, shot,
    // J02 (29.09., additiv): Innenleben lesbar für Konsumenten, die auf T4 aufbauen (Fahrphysik, Gelände, Tafeln). T4 selbst unverändert.
    camera, controls, st, karts, hooks, td, S, N, ds, at, M, U, root, GY, ctr, ext, sun, hemi, KD, ks,
    AT, VFX, TP, PP, shots, scene, renderer,
    meshReport() { const R = []; scene.traverse(o => { if (!o.isMesh) return; const g = o.geometry, n = (g.index ? g.index.count : g.attributes.position.count) / 3; R.push({ name: o.name || '(ohne Name)', tris: Math.round(n * (o.isInstancedMesh ? Math.max(1, o.count) : 1)), instanced: !!o.isInstancedMesh, cast: o.castShadow }); }); return R.sort((a, b) => b.tris - a.tris); },
    measureSync(n = 30, warm = 30) { const gl = renderer.getContext(), out = [], prevQ = VFX.quality;   // verdeckter Tab: ohne vsync, gl.finish je Messblock
      for (const q of ['off', 'low', 'high']) { VFX.setQuality(q); for (let k = 0; k < warm; k++) step(1 / 60); gl.finish(); let calls = 0, tris = 0, peak = 0; const t1 = performance.now();
        for (let k = 0; k < n; k++) { step(1 / 60); calls += info.calls; tris += info.frameTris; peak = Math.max(peak, VFX.stats.alive); } gl.finish(); const ms = (performance.now() - t1) / n;
        out.push({ state: q, frames: n, msMean: +ms.toFixed(2), fps: +(1000 / ms).toFixed(1), calls: Math.round(calls / n), tris: Math.round(tris / n), particlesPeak: peak }); }
      VFX.setQuality(prevQ); info.measure = { mode: 'sync · gl.finish · ohne vsync', cam: info.cam, world: st.world, at: new Date().toISOString(), px: [renderer.domElement.width, renderer.domElement.height], rows: out }; return info.measure; },
    frame(n = 1, dt = 1 / 60) { for (let k = 0; k < n; k++) step(dt); },   // Einzelbilder ohne requestAnimationFrame (Prüfung, Aufnahmen)
    async measure() { const out = [], prevQ = VFX.quality, wait = ms => new Promise(r => setTimeout(r, ms)), raf = () => new Promise(r => requestAnimationFrame(r));
      for (const q of ['off', 'low', 'high']) { VFX.setQuality(q); await wait(1500); FT.length = 0; let calls = 0, tris = 0, peak = 0, n = 0; const t1 = performance.now();
        while (performance.now() - t1 < 3000) { await raf(); calls += info.calls; tris += info.frameTris; peak = Math.max(peak, VFX.stats.alive); n++; }
        const ft = FT.slice().sort((a, b) => a - b), mean = ft.reduce((a, b) => a + b, 0) / Math.max(1, ft.length);
        out.push({ state: q, frames: ft.length, msMean: +mean.toFixed(2), msMedian: +(ft[Math.floor(ft.length / 2)] || 0).toFixed(2), ms95: +(ft[Math.floor(ft.length * 0.95)] || 0).toFixed(2), fps: +(1000 / mean).toFixed(1), calls: Math.round(calls / n), tris: Math.round(tris / n), particlesPeak: peak }); }
      VFX.setQuality(prevQ); info.measure = { cam: info.cam, world: st.world, at: new Date().toISOString(), px: [renderer.domElement.width, renderer.domElement.height], rows: out }; return info.measure; },
    set(k, v) { if (k === 'vfx') { VFX.setQuality(v); return; } if (k === 'world') setWorld(v); else if (k === 'run') st.run = !!v; else if (k === 'ao' && aoPass) aoPass.enabled = !!v; else if (k === 'grey') { st.grey = !!v; canvas.style.filter = v ? 'grayscale(1)' : ''; } },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); renderer.dispose(); }
  };
}
