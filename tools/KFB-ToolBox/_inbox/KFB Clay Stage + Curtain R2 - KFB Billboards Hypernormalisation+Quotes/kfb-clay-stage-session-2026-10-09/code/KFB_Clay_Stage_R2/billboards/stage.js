// KFB Clay Stage R2 · Billboard-Prüfbühne (Kopie von R1/billboards/stage.js, inhaltlich unverändert; lädt den R2-Kit)
// --- R1-Kopf ---
// KFB Clay Stage R1 · Billboard-Prüfbühne v2 (09.10.2026) · Kopie von KFB_Billboard_Family_v1/stage.js (04.10.2026), v1 bleibt unverändert.
// v2: Rollen aus ../palette-roles.js (derselbe Besitzer wie Vorhang/Bühne) · Birnen an/aus und Leuchtkugeln aus der Palette,
// keine schwarzen Aus-Birnen mehr · Fassung je Birne · pause() für den Bühnen-Bildschirm · palette() für den Vorhang · 07 Title Belt.
// --- v1-Kopf ---
// KFB Billboard Family v1 · Prüfbühne (04.10.2026)
// EIN Frame-Owner (dieses rAF) ruft CLAY-01 BillboardScheduler.tick() auf; der Scheduler entscheidet, wann eine Tafel malt.
// WIEDERVERWENDET (importiert, unverändert): CLAY-01 billboard-clay.js (makeClayFamily, Billboard, BillboardScheduler,
// faceGeometry, loadContent) · world-context.js + world-palettes.js @5b523eb (dieselben Module wie H13 palSource) ·
// h14-hypernorm.js (H14-Frames) · H13 selbst im eigenen Rahmen (Leinwand 1024×512 wird gelesen, H13 bleibt unverändert).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { FAMILIES, M, Body, recolor, FACE, rngOf, slab } from './kit.js';
import * as SQ from '../../KFB_Billboard_Family_v1/sequence.js';
import { loadH14Set } from '../../billboard-dummy-v1/h14-hypernorm.js';
import { roles } from '../palette-roles.js';

export const SRC = {
  clay01: 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/_inbox/KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/briefd/billboard-clay.js',
  clay01Spec: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/tools/KFB-ToolBox/_inbox/KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/billboard.embed-spec.v1.json',
  wc: 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@5b523eb85aaf19bdb54707ee016b08003337f974/travel/KFB%20Travel%20Combat%20v25/terrain-v25/',
  font: 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/fonts/helvetiker_bold.typeface.json'
};
// Aus H13 übernommen (dort als „Vorschlag, nicht Kanon" markiert): Biom → benannte Palette, Kartendimension → Story-Modus
const BIOME_PAL = { scorched: 'ember', luminous: 'grape_soda', tidal: 'seafoam', meadow: 'mint_pop', fractured: 'cubescape', plateau: 'sunset_arcade' };
const DIM_MODE = { melancholy: 'tragic', humor: 'comic', chaos: 'absurd', power: 'heroic', wonder: 'mystical', threat: 'forbidden', lore: 'mystical', name: 'heroic' };
export const BIOMES = Object.keys(BIOME_PAL);

const hex = c => '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v * 255))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString();
const lumH = h => { const c = new THREE.Color(h); return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b; };
const BON = new THREE.Color('#ffcf7a'), BOFF = new THREE.Color('#e8dcc2'), GLOW = new THREE.Color('#ffdc9a'); let BOFFK = 0.9;

class Bulbs {
  constructor(pts, r, mode, rng, collarMat) {
    this.n = pts.length; this.mode = mode; this.base = pts.map(() => 0.82 + rng() * 0.3);
    this.mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }), this.n); this.mesh.name = 'bulbs';
    const cg = new THREE.TorusGeometry(r * 1.18, r * 0.36, 6, 14); this.collar = new THREE.InstancedMesh(cg, collarMat, this.n); this.collar.name = 'bulb-collars'; this.collar.castShadow = true;
    const m = new THREE.Matrix4(); pts.forEach((p, i) => { m.makeTranslation(p[0], p[1], p[2]); this.mesh.setMatrixAt(i, m); this.mesh.setColorAt(i, BON); m.makeTranslation(p[0], p[1], p[2] - r * 0.42); this.collar.setMatrixAt(i, m); });
    this.mesh.add(this.collar);
  }
  set(step, motion, gain) {
    const c = new THREE.Color();
    for (let i = 0; i < this.n; i++) {
      let on = true; if (motion) on = this.mode === 'dir' ? ((i - step) % 5 + 5) % 5 < 3 : (i + step) % 3 !== 0;
      c.copy(on ? BON : BOFF).multiplyScalar(on ? this.base[i] * gain : BOFFK); this.mesh.setColorAt(i, c);
    }
    this.mesh.instanceColor.needsUpdate = true;
  }
}

export async function boot(canvas, onSnap = () => {}) {
  const t0 = performance.now(), status = {};
  const tryLoad = async (k, f) => { try { const v = await f(); status[k] = { ok: true }; return v; } catch (e) { status[k] = { ok: false, err: String(e && e.message || e).slice(0, 160) }; return null; } };
  const [CL, WC, WP, P0, H14, font, spec0] = await Promise.all([
    tryLoad('clay01', () => import(/* @vite-ignore */ SRC.clay01)),
    tryLoad('worldContext', () => import(/* @vite-ignore */ SRC.wc + 'world-context.js')),
    tryLoad('worldPalettes', () => import(/* @vite-ignore */ SRC.wc + 'world-palettes.js')),
    tryLoad('quotePool', () => SQ.loadPools()),
    tryLoad('h14', () => loadH14Set()),
    tryLoad('font', () => new FontLoader().loadAsync(SRC.font)),
    tryLoad('clay01Spec', async () => { const r = await fetch(SRC.clay01Spec); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
  ]);
  await Promise.race([Promise.all(['italic 500 40px "Bodoni Moda"', '900 40px "Big Shoulders Display"', '700 40px "Archivo"', '600 20px "IBM Plex Mono"'].map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 4000))]);
  if (!CL) throw new Error('CLAY-01 nicht ladbar: ' + status.clay01.err);
  if (!WC) throw new Error('world-context.js nicht ladbar: ' + status.worldContext.err);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.info.autoReset = false;
  const aniso = renderer.capabilities.getMaxAnisotropy();
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(38, 1, 0.3, 900);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.maxPolarAngle = 1.53; controls.minDistance = 4; controls.maxDistance = 320;

  const U = { uClayNear: { value: 26 }, uClayFar: { value: 70 }, uClayScale: { value: 2.6 }, uClayAmt: { value: 0.4 } };   // Familie B aus billboard-stage.js
  const fam = CL.makeClayFamily('BBF', U);
  const bodyMat = fam.std('#ffffff', 0.88, { vertexColors: true });
  const blinkMat = fam.std('#ffffff', 0.8, { emissive: new THREE.Color('#ffc21f'), emissiveIntensity: 1.6 });
  const collarMat = fam.std('#e8dcc2', 0.85);
  const groundMat = fam.std('#bdb5a6', 0.95), roadMat = fam.std('#8b8780', 0.92), dashMat = fam.std('#e3bd48', 0.9);

  // Umgebung: Studio (neutral) und Nacht, eine Szene
  const ground = new THREE.Mesh(new THREE.CircleGeometry(420, 96), groundMat); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const road = new THREE.Group(); { const r = new THREE.Mesh(new THREE.BoxGeometry(900, 0.08, 7.4), roadMat); r.position.set(0, 0.04, 17); r.receiveShadow = true; road.add(r); for (let x = -440; x <= 440; x += 6) { const d = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.03, 0.22), dashMat); d.position.set(x, 0.1, 17); road.add(d); } } scene.add(road);
  const sky = new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color('#060d22') }, mid: { value: new THREE.Color('#122645') }, hor: { value: new THREE.Color('#2a4643') } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top,mid,hor; varying vec3 vP; void main(){ float h=vP.y; vec3 c=mix(hor,mid,smoothstep(-0.02,0.2,h)); c=mix(c,top,smoothstep(0.2,0.75,h)); gl_FragColor=vec4(c,1.0); }' }));
  const stars = (() => { const n = 900, p = new Float32Array(n * 3); const r = rngOf('stars'); for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, e = 0.1 + Math.pow(r(), 0.7) * 1.35; p.set([Math.cos(a) * Math.cos(e) * 560, Math.sin(e) * 560, Math.sin(a) * Math.cos(e) * 560], i * 3); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xdfe7ff, size: 1.6, sizeAttenuation: false, fog: false })); })();
  scene.add(sky, stars);
  const hemi = new THREE.HemisphereLight('#fff6ea', '#8a8070', 1.4), key = new THREE.DirectionalLight('#fff1dc', 2.6);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.04; scene.add(hemi, key, key.target);

  // ── Familien bauen ───────────────────────────────────────────────────────────────────────
  const fams = [];
  for (const recipe of FAMILIES) {
    const rng = rngOf(recipe.name), F = recipe(rng, font), root = new THREE.Group(); root.name = 'bb-' + F.id;
    const tvI = M.tv(F.B, ...F.tv); M.brace(F.B, [F.tv[0], F.tv[1], -0.75], [F.tv[0], F.tv[1], F.tv[2] - 0.45], 0.12);
    const meshes = [], body = F.B.build(bodyMat); root.add(body); meshes.push(body);
    const subs = {};
    for (const s of F.S) { const o = new THREE.Group(); o.position.set(...s.pivot); const m = s.B.build(bodyMat, s.pivot); if (m) { o.add(m); meshes.push(m); } root.add(o); subs[s.name] = { o, s, x: 0, v: 0 }; }
    const at = (p, subName) => { const sb = subName && subs[subName]; return sb ? [p[0] - sb.s.pivot[0], p[1] - sb.s.pivot[1], p[2] - sb.s.pivot[2]] : p; };
    const parentOf = subName => (subName && subs[subName]) ? subs[subName].o : root;
    // Bildfläche: Geometrie und Material wie CLAY-01 (faceGeometry 12×6, MeshBasicMaterial, toneMapped=false)
    const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = aniso;
    const faceMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }), face = new THREE.Mesh(CL.faceGeometry(FACE.W, FACE.H), faceMat); face.name = 'face';
    face.position.set(...at([F.face.cx, F.face.cy, 0.035], F.face.sub)); parentOf(F.face.sub).add(face);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(tvI.screenW, tvI.screenW / 2), faceMat); scr.position.set(...tvI.screen); root.add(scr);
    // Druckknopf (eigene Mesh: Raycast-Ziel, drückt sich ein)
    const btnB = new Body(rng); btnB.add(new THREE.CylinderGeometry(0.34, 0.38, 0.3, 20, 2), 'accent', tvI.button, [Math.PI / 2, 0, 0], [1, 1, 1], 0.015);
    const btnO = new THREE.Group(); btnO.position.set(...tvI.button); const btn = btnB.build(bodyMat, tvI.button); btn.name = 'tv-button'; btnO.add(btn); root.add(btnO); meshes.push(btn);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.05, 8, 32), new THREE.MeshBasicMaterial({ color: GLOW.clone() })); ring.position.set(tvI.button[0], tvI.button[1], tvI.button[2] - 0.02); root.add(ring);
    const bulbs = F.bulbs.map(b => { const B = new Bulbs(b.pts.map(p => at(p, b.sub)), b.r, b.mode, rng, collarMat); parentOf(b.sub).add(B.mesh); return B; });
    const glows = F.glows.map(g => { const m = new THREE.Mesh(new THREE.SphereGeometry(g.r, 16, 10), new THREE.MeshBasicMaterial({ color: GLOW.clone() })); m.position.set(...at(g.p, g.sub)); parentOf(g.sub).add(m); return { m, g, k: 0.85 + rng() * 0.3 }; });
    let blink = null; if (F.blink) { const g = slab(F.blink.shape, F.blink.depth, F.blink.bevel, F.blink.front, 4); const m = new THREE.Mesh(g, blinkMat); m.castShadow = true; const sp = subs[F.blink.sub]; if (sp) m.position.set(-sp.s.pivot[0], -sp.s.pivot[1], -sp.s.pivot[2]); parentOf(F.blink.sub).add(m); blink = m; }
    const lamp = new THREE.PointLight('#ffc77a', 160, 0, 2); lamp.position.set(F.face.cx, F.face.cy + 4.5, 8); root.add(lamp);
    root.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(root);
    const tris = meshes.reduce((a, m) => a + m.geometry.attributes.position.count / 3, 0);
    const rec = { F, root, subs, face, faceMat, cv, ctx: cv.getContext('2d'), tex, btn, btnO, ring, bulbs, glows, blink, lamp, meshes, bounds: { x0: bb.min.x, x1: bb.max.x, y1: bb.max.y }, tris: Math.round(tris), bulbN: bulbs.reduce((a, b) => a + b.n, 0), press: -1e9, wobble: -1e9 };
    rec.bb = { spec: { maxVisibleDistance: 260, lod: { near: { maxDist: 50, hz: 12 }, mid: { maxDist: 110, hz: 4 }, far: { maxDist: 260, hz: 0 } }, updatePolicy: { maxNearActive: 4 }, contentMode: 'sequence' }, group: root, center: new THREE.Vector3(), radius: 9, next: 0, lod: 'hidden', paint: now => paintFamily(rec, now) };
    scene.add(root); fams.push(rec);
  }
  // Spender CLAY-01, unverändert: eigener Körper, eigene Palette, eigener Inhalt (kaleido-cuts über gebackenen Bildern)
  let donor = null, donorPool = null;
  if (spec0) {
    const dSpec = { ...spec0, islandAnchor: { mode: 'xz', x: 0, z: 0, yawDeg: 0, groundSnap: { mode: 'flat' }, y: 0 } };
    donorPool = await tryLoad('clay01Content', () => CL.loadContent(dSpec.contentAsset));
    const holder = new THREE.Group(); scene.add(holder);
    donor = new CL.Billboard(dSpec, { parent: holder, island: { H: () => 0 }, pool: donorPool || { imgs: [], skipped: [] }, bodyMat, aniso }); donor.holder = holder; holder.visible = false;
  }
  const sched = new CL.BillboardScheduler();

  // ── Zustand ─────────────────────────────────────────────────────────────────────────────
  const S = { layout: 'single', family: 'crown', source: 'mapped', packId: P0 ? P0.mappedDecks[0].packId : null, quoteId: '', cardSeed: 'kfb-1', biomeId: 'AUTO', biomeSeed: 'b-1', palSource: 'CARDS', h13Mode: 'live', phasePin: '', view: 'isolation', light: 'studio', motion: true, readAlong: true, pdOnly: true, playing: true, cycle: 0 };
  let P = P0, cards = [], card = null, cardHow = '', sel = null, seq = null, ctxInfo = null, pal = null, facePal = null, master = 0, last = performance.now(), lastSnap = 0, fps = null, fpsN = 0, fpsT = performance.now();
  let h13Frame = null, h13Live = false, h13Probe = 0, mirror = null, h13Note = 'Rahmen nicht verbunden', fs = null, fsNext = 0, lastPhase = '', tween = null, drive = null, onTV = null;

  function computeContext() {
    const deck = P && P.decks.get(S.packId), vec = card ? WC.cardSemanticVector(card, deck && deck.role) : WC.emptyVector();
    const topDim = Object.keys(vec).sort((a, b) => vec[b] - vec[a])[0], storyMode = DIM_MODE[topDim] || 'heroic';
    const wc = WC.makeWorldContext({ cardTriplet: { current: card || undefined }, storyMode, seeds: ['kfb-billboard', S.biomeSeed] });
    const biome = S.biomeId === 'AUTO' ? wc.biome : S.biomeId;
    let stops, note;
    if (S.palSource === 'CARDS') { stops = WC.paletteFromVector(vec, WC.hashStr(card ? card.cardName : S.packId)); note = 'CARDS ← ' + (card ? card.cardName : '–'); }
    else if (S.palSource === 'BIOME') { const p = WP && WP.NAMED_PALETTES.find(x => x.id === BIOME_PAL[biome]); stops = p ? p.stops : wc.palette; note = 'BIOME ' + biome + ' → ' + (p ? p.id : 'story'); }
    else { stops = wc.palette; note = 'WORLD CONTEXT · Story ' + wc.storyModeName; }
    const [d, m, g] = stops.map(hex);
    pal = roles([d, m, g], wc.accent, S.light === 'night');
    facePal = { dark: mix(d, '#120e0a', 0.35), mid: m, glow: pal.accent, cream: '#f3ead3' };
    ctxInfo = { biome, biomeAuto: wc.biome, storyMode: wc.storyModeName, topDim, note, stops: [d, m, g], wcAccent: wc.accent, vector: vec };
    for (const f of fams) { for (const m2 of f.meshes) recolor(m2, pal); }
    BON.set(pal.bulbOn); BOFF.set(pal.bulbOff); BOFFK = pal.bulbOffK; GLOW.set(pal.glow); collarMat.color.set(pal.trim);
    blinkMat.color.set(pal.bulbOn); blinkMat.emissive.set(pal.bulbOn);
    if (h13Frame && h13Frame.contentWindow) try { h13Frame.contentWindow.__kfbPalSource = S.palSource === 'WORLD' ? 'STORY' : S.palSource; } catch (e) {}
  }
  async function loadCards() {
    cards = []; const deck = P && P.decks.get(S.packId);
    if (deck) { const c = await tryLoad('deckCards', () => SQ.loadDeckCards(deck)); cards = c || []; }
  }
  function reselect(keepTime) {
    if (!P) { sel = null; seq = null; return; }
    sel = SQ.selectQuote(P, { source: S.source, packId: S.packId, cardSeed: S.cardSeed, biomeId: S.biomeId, biomeSeed: S.biomeSeed, cycle: S.cycle, quoteId: S.quoteId, pdOnly: S.pdOnly }, WC);
    const cc = SQ.contextCard(S.source === 'mapped' ? sel.quote : null, S.packId, cards, S.cardSeed, WC); card = cc.card; cardHow = cc.how;
    computeContext();
    if (!sel.quote) { seq = null; return; }
    if (!keepTime || !seq || seq.quote.id !== sel.quote.id) seq = { quote: sel.quote, tl: SQ.timeline(sel.quote), t0: master };
    if (sched.list) sched.prime(performance.now());
  }

  // ── Inhalt malen (Provider) ─────────────────────────────────────────────────────────────
  const seqT = () => !seq ? 0 : S.phasePin ? SQ.pinTime(seq.tl, S.phasePin) : master - seq.t0;
  function h13Canvas() { try { return h13Frame && h13Frame.contentDocument && h13Frame.contentDocument.querySelector('canvas[width="1024"][height="512"]'); } catch (e) { return null; } }
  const probeCv = document.createElement('canvas'); probeCv.width = 32; probeCv.height = 16; const probeCtx = probeCv.getContext('2d', { willReadFrequently: true });
  function probeH13(now) { if (h13Live || now < h13Probe) return; h13Probe = now + 1000; const c = h13Canvas(); if (!c) return; probeCtx.drawImage(c, 0, 0, 32, 16); const d = probeCtx.getImageData(0, 0, 32, 16).data; let lit = 0; for (const [x, y] of [[1, 1], [30, 1], [1, 14], [30, 14], [16, 2], [16, 13]]) { const i = (y * 32 + x) * 4; if (d[i] + d[i + 1] + d[i + 2] > 24) lit++; } if (lit >= 3) h13Live = true; }
  function baseSource() {
    if (S.h13Mode === 'live') { const c = h13Canvas(); if (c && h13Live) { h13Note = 'H13 live · Leinwand 1024×512 aus dem H13-Rahmen'; return c; } if (h13Frame) h13Note = c ? 'H13 lädt sein Archiv (LOADING ARCHIVE) · bis dahin H14-Frames' : 'H13-Rahmen lädt · bis dahin H14-Frames'; }
    const it = H14 && H14.items; if (it && it.length && seq) { const a = seq ? SQ.at(seq.tl, seqT()) : { t0: 0 }; const i = (S.cycle * 3 + seq.tl.seg.indexOf(seq.tl.seg.find(s => s.t0 === a.t0))) % it.length; if (S.h13Mode !== 'live') h13Note = 'H14-Frame ' + it[Math.abs(i)].index + ' (aus H13 gebacken)'; return it[Math.abs(i)].img; }
    return null;
  }
  function stState(lod) {
    const deck = P && P.decks.get(S.packId);
    const ctxLine = S.source === 'reserve' ? 'RESEARCH RESERVE · UNMAPPED · ' + (seq ? seq.quote.id : '') : (deck ? deck.title : S.packId) + (card ? ' · #' + card.cardNumber + ' ' + card.cardName : '');
    return { quote: seq && seq.quote, tl: seq && seq.tl, t: seqT(), lod, base: baseSource(), pal: facePal, ctxLine, readAlong: S.readAlong, unavailable: !P ? 'SOURCE UNAVAILABLE · Quote-Pool: ' + (status.quotePool && status.quotePool.err) : 'Kein Zitat für diese Auswahl' };
  }
  function paintFamily(rec, now) { SQ.paintSequence(rec.ctx, 1024, 512, stState(rec.bb.lod === 'mid' ? 'mid' : 'near')); rec.tex.needsUpdate = true; }

  // ── Layout und Ansichten ────────────────────────────────────────────────────────────────
  const famRec = id => fams.find(f => f.F.id === id) || fams[0];
  function applyLayout() {
    for (const f of fams) f.root.visible = false; if (donor) donor.holder.visible = false;
    if (S.layout === 'donor' && donor) { donor.holder.visible = true; sched.list = [donor]; }
    else if (S.layout === 'lineup') {
      let x = 0; const gap = 5, xs = fams.map(f => { const w = f.bounds.x1 - f.bounds.x0, px = x - f.bounds.x0; x += w + gap; return px; }), mid = (x - gap) / 2;
      fams.forEach((f, i) => { f.root.position.set(xs[i] - mid, 0, 0); f.root.visible = true; });
      sched.list = fams.map(f => f.bb);
    } else { const f = famRec(S.family); f.root.position.set(0, 0, 0); f.root.visible = true; sched.list = [f.bb]; }
    for (const f of fams) { f.root.updateMatrixWorld(true); f.face.getWorldPosition(f.bb.center); }
    sched.prime(performance.now());
    const ext = S.layout === 'lineup' ? 130 : 34; Object.assign(key.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 1, far: 260 }); key.shadow.camera.updateProjectionMatrix();
    key.position.set(-30, 60, 50); key.target.position.set(0, 6, 0);
  }
  function applyLight() {
    const night = S.light === 'night';
    sky.visible = stars.visible = night; scene.background = night ? null : new THREE.Color('#d6d1c6');
    hemi.color.set(night ? '#30457a' : '#fff6ea'); hemi.groundColor.set(night ? '#120c08' : '#8a8070'); hemi.intensity = night ? 0.7 : 1.4;
    key.color.set(night ? '#a9bbff' : '#fff1dc'); key.intensity = night ? 0.7 : 2.6;
    groundMat.color.set(night ? '#25211d' : '#bdb5a6'); roadMat.color.set(night ? '#2f2e33' : '#8b8780');
    for (const f of fams) f.lamp.visible = night;
    bloom.enabled = night;
    if (pal) computeContext();
  }
  const viewTarget = () => {
    if (S.layout === 'donor' && donor) return { cx: 0, cy: 6.6, h: 14, w: 15, fy: CL.LAYOUT.gb + 3 };
    const f = famRec(S.family), x0 = f.bounds.x0 + f.root.position.x, x1 = f.bounds.x1 + f.root.position.x;
    return { cx: (x0 + x1) / 2, cy: f.bounds.y1 / 2, h: f.bounds.y1, w: x1 - x0, fx: f.F.face.cx + f.root.position.x, fy: f.F.face.cy };
  };
  function setView(v) {
    S.view = v; drive = null;
    if (v === 'isolation') S.light = 'studio'; if (v === 'night') S.light = 'night'; applyLight();
    if (v === 'lineup') { if (S.layout !== 'lineup') { S.layout = 'lineup'; applyLayout(); } }
    else if (S.layout === 'lineup') { S.layout = 'single'; applyLayout(); }
    const T = viewTarget(), fov = camera.fov * Math.PI / 180, d = Math.max(T.h * 1.18, T.w * 1.12 / camera.aspect) / (2 * Math.tan(fov / 2));
    const fx = T.fx ?? T.cx, fy = T.fy ?? T.cy; let pos, tgt;
    if (v === 'lineup') { let a = 1e9, b = -1e9; for (const f of fams) { a = Math.min(a, f.bounds.x0 + f.root.position.x); b = Math.max(b, f.bounds.x1 + f.root.position.x); } const W = b - a, dd = Math.max(26 * 1.15, W * 1.06 / camera.aspect) / (2 * Math.tan(fov / 2)); pos = [0, 7, dd]; tgt = [0, 9, 0]; }
    else if (v === 'close') { pos = [fx, fy, 6.4 / (2 * Math.tan(fov / 2)) * Math.max(1, 2.15 / camera.aspect)]; tgt = [fx, fy, 0]; }
    else if (v === 'hero' || v === 'night') { pos = [T.cx + T.w * 0.55, T.h * 0.4, d * 1.08]; tgt = [T.cx, T.cy, 0]; }
    else if (v === 'back') { pos = [T.cx - T.w * 0.6, T.h * 0.42, -d * 1.02]; tgt = [T.cx, T.cy, 0]; }
    else if (v === 'side') { pos = [T.cx + d * 0.95, T.h * 0.45, 2]; tgt = [T.cx, T.cy, 0]; }
    else if (v === 'road') { drive = { t0: performance.now(), dur: 11000, fx, fy }; return; }
    else { pos = [T.cx, T.cy, d]; tgt = [T.cx, T.cy, 0]; }
    tween = { t0: performance.now(), p0: camera.position.clone(), q0: controls.target.clone(), pos: new THREE.Vector3(...pos), tgt: new THREE.Vector3(...tgt) };
  }

  // ── Bloom, Größe ────────────────────────────────────────────────────────────────────────
  const rt = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, samples: 4 }), composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera)); const bloom = new UnrealBloomPass(new THREE.Vector2(2, 2), 0.5, 0.35, 0.93); composer.addPass(bloom); composer.addPass(new OutputPass());
  const resize = () => { const r = canvas.parentElement.getBoundingClientRect(), w = Math.max(2, r.width | 0), h = Math.max(2, r.height | 0); renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); if (booted && !drive) setView(S.view); };
  let booted = false;
  const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement); resize();

  // ── Klick auf den Clay-Knopf ────────────────────────────────────────────────────────────
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
  const hitBtn = e => { const r = canvas.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(fams.filter(f => f.root.visible).map(f => f.btn), false)[0]; return h ? fams.find(f => f.btn === h.object) : null; };
  const onDown = e => { down = [e.clientX, e.clientY]; }, onUp = e => { if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return; const f = hitBtn(e); if (f) { const now = performance.now(); f.press = now; f.wobble = now; onTV && onTV(f.F.id); } };
  const onMove = e => { canvas.style.cursor = hitBtn(e) ? 'pointer' : ''; };
  canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointermove', onMove);

  // ── Der eine Frame-Owner ────────────────────────────────────────────────────────────────
  let raf = 0, step = 0, nStep = 0, nBlink = 0, blinkOn = true, paused = false;
  const sn = (x, k) => Math.sin(x * k);
  const loop = now => {
    if (paused) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.1, (now - last) / 1000); last = now; if (S.playing) master += dt * 1000;
    if (seq && !S.phasePin && master - seq.t0 >= seq.tl.total) { S.cycle++; if (!S.quoteId) reselect(false); else seq.t0 = master; }
    const ph = seq ? SQ.at(seq.tl, seqT()).phase : '';
    if (ph !== lastPhase) { lastPhase = ph; const hd = fams[2].subs.head; if (hd) hd.v += 0.05; }
    if (S.motion && now >= nStep) { step++; nStep = now + 125; U.uClayScale.value = 2.6 * (1 + (Math.random() - 0.5) * 0.04); }
    if (S.motion && now >= nBlink) { blinkOn = !blinkOn; nBlink = now + (blinkOn ? 640 : 360); }
    const gain = S.light === 'night' ? 3.2 : 1.35;
    for (const f of fams) {
      if (!f.root.visible) continue;
      for (const b of f.bulbs) b.set(step, S.motion, gain);
      for (const g of f.glows) { const fl = S.motion ? 0.92 + 0.08 * Math.sin(now * 0.013 + g.k * 40) : 1; g.m.material.color.copy(GLOW).multiplyScalar(gain * g.k * fl); if (g.g.rider) { const a = S.motion ? now * 0.00032 : 0.6, r = g.g.rider, v = new THREE.Vector3(Math.cos(a) * r.R, Math.sin(a) * r.R * r.sy, 0).applyEuler(new THREE.Euler(...r.rot)); g.m.position.copy(v); } }
      if (f.blink) blinkMat.emissiveIntensity = (S.motion && !blinkOn) ? 0.05 : (S.light === 'night' ? 2.2 : 0.9);
      f.ring.material.color.copy(GLOW).multiplyScalar(gain * (0.75 + 0.25 * Math.sin(now * 0.004)));
      for (const k in f.subs) {
        const s = f.subs[k], o = s.o, A = S.motion ? 1 : 0;
        if (s.s.anim === 'breathe') o.scale.setScalar(1 + A * 0.015 * sn(now, 0.0016));
        else if (s.s.anim === 'nod') o.rotation.z = A * (s.s.amp ?? 0.02) * sn(now, 0.0011);
        else if (s.s.anim === 'swing') o.rotation.z = A * 0.035 * sn(now, 0.0012);
        else if (s.s.anim === 'spin') o.rotation.y = A * now * 0.0006;
        else if (s.s.anim === 'pulse') o.scale.setScalar(1 + A * 0.05 * Math.pow(Math.max(0, Math.sin(now * 0.0028 + (s.s.phase || 0))), 4));
        else if (s.s.anim === 'settle') { s.v += (-7 * s.x - 2.2 * s.v) * dt; s.x += s.v * dt; o.rotation.z = A * s.x; }
      }
      const pt = (now - f.press) / 260; f.btnO.position.z = (f.F.tv[2] + 0.53) - (pt >= 0 && pt < 1 ? 0.1 * Math.sin(pt * Math.PI) : 0);
      const wt = now - f.wobble; f.root.rotation.z = wt < 2200 ? 0.008 * Math.exp(-wt / 600) * Math.sin(wt * 0.018) : 0;
    }
    if (drive) { const k = Math.min(1, (now - drive.t0) / drive.dur), e = 1 - Math.pow(1 - k, 2.2), x = -170 + (drive.fx - 34 + 170) * e; camera.position.set(x, 1.5, 17.6); const ahead = new THREE.Vector3(x + 60, 1.5, 17.6), sg = new THREE.Vector3(drive.fx, drive.fy, 0); controls.target.copy(ahead.lerp(sg, 0.35 + 0.5 * e)); }
    if (tween) { const k = Math.min(1, (now - tween.t0) / 800), e = k * k * (3 - 2 * k); camera.position.lerpVectors(tween.p0, tween.pos, e); controls.target.lerpVectors(tween.q0, tween.tgt, e); if (k >= 1) tween = null; }
    controls.update(); renderer.info.reset();
    probeH13(now); sched.tick(now, camera);
    if (mirror) { const c = h13Canvas(), x = mirror.getContext('2d'); if (c) x.drawImage(c, 0, 0, mirror.width, mirror.height); else { x.fillStyle = '#121110'; x.fillRect(0, 0, mirror.width, mirror.height); } }
    if (fs && now >= fsNext) { fsNext = now + 1000 / 12; SQ.paintSequence(fs.ctx, fs.cv.width, fs.cv.height, stState('near')); }
    composer.render();
    fpsN++; if (now - fpsT >= 1000) { fps = Math.round(fpsN * 1000 / (now - fpsT)); fpsN = 0; fpsT = now; }
    if (now - lastSnap > 250) { lastSnap = now; snap(); }
  };

  function snap() {
    const q = seq && seq.quote, a = seq ? SQ.at(seq.tl, seqT()) : null, i = renderer.info.render, deck = P && P.decks.get(S.packId);
    const list = sel ? sel.list : [];
    onSnap({
      S: { ...S }, status: { ...status }, fps, calls: i.calls, tris: i.triangles, bootMs: Math.round(performance.now() - t0), h13Note, h13Live,
      pool: P ? { mapped: P.mapped.length, reserve: P.reserve.length, registry: P.registryCount, pin: SQ.POOL_PIN } : null,
      decks: P ? P.mappedDecks.map(d => ({ id: d.packId, title: d.title })) : [],
      quotes: list.map(x => ({ id: x.id, label: x.author + ' — ' + x.text.slice(0, 46) + (x.text.length > 46 ? '…' : ''), rights: x.rights && x.rights.status })),
      quote: q ? { id: q.id, text: q.text, author: q.author, work: q.work, rights: q.rights && q.rights.status, verification: q.provenance && q.provenance.verificationStatus, question: q.frizzleQuestion, brainFood: (q.brainFood || [])[0] || null, status: q.status, mapping: q.mappingStatus || 'MAPPED', deckReason: (q.deckRefs || []).find(d => d.packId === S.packId)?.reason || null } : null,
      phase: a ? a.phase : null, phaseK: a ? a.k : 0, t: seqT(), total: seq ? seq.tl.total : 0, seed: sel && sel.seed, pinned: sel && sel.pinned,
      deck: deck ? { id: deck.packId, title: deck.title, role: deck.role } : null, card: card ? { n: card.cardNumber, name: card.cardName, how: cardHow } : null, cardsN: cards.length,
      ctx: ctxInfo, pal, fams: fams.map(f => ({ id: f.F.id, n: f.F.n, label: f.F.label, why: f.F.why, tris: f.tris, bulbs: f.bulbN, lod: f.bb.lod, lettersOk: f.F.needsFont ? !!f.F.lettersOk : null })),
      faceCheck: (() => { const f = famRec(S.family); f.face.geometry.computeBoundingBox(); const b = f.face.geometry.boundingBox; return { w: +(b.max.x - b.min.x).toFixed(3), h: +(b.max.y - b.min.y).toFixed(3), mat: f.faceMat.type, toneMapped: f.faceMat.toneMapped, canvas: [f.cv.width, f.cv.height] }; })(),
      donor: donor ? { ok: true, pool: donorPool ? donorPool.imgs.map(x => x.path) : [], skipped: donorPool ? donorPool.skipped : [] } : { ok: false },
      fs: !!fs
    });
  }

  window.__bbfDbg = { camera, controls, fams, viewTarget: () => viewTarget(), S };
  await loadCards(); reselect(false); applyLayout(); applyLight(); setView('isolation'); booted = true; raf = requestAnimationFrame(loop);
  const api = {
    async set(o) {
      const prev = { ...S }; Object.assign(S, o);
      if ('packId' in o && o.packId !== prev.packId) { S.quoteId = ''; S.cycle = 0; await loadCards(); }
      if (['source', 'packId', 'quoteId', 'cardSeed', 'biomeId', 'biomeSeed', 'pdOnly'].some(k => k in o && o[k] !== prev[k])) reselect(false);
      else if ('palSource' in o || 'light' in o) computeContext();
      if ('light' in o) applyLight();
      if ('family' in o || 'layout' in o) { applyLayout(); if (!('view' in o)) setView(S.view); }
      if ('view' in o) setView(o.view);
      snap();
    },
    next() { S.cycle++; S.quoteId = ''; reselect(false); snap(); },
    restart() { if (seq) seq.t0 = master; snap(); },
    setH13Frame(el) { h13Frame = el; computeContext(); },
    setMirror(cv) { mirror = cv; },
    setFullscreen(cv) { fs = cv ? { cv, ctx: cv.getContext('2d') } : null; fsNext = 0; snap(); },
    onTV(fn) { onTV = fn; },
    press(id) { const f = famRec(id); const now = performance.now(); f.press = now; f.wobble = now; onTV && onTV(f.F.id); },
    brainFood() { return seq && (seq.quote.brainFood || [])[0]; },
    palette() { return { pal, ctx: ctxInfo }; },
    pause(b) { if (b === paused) return; paused = !!b; cancelAnimationFrame(raf); if (!paused) { last = performance.now(); resize(); raf = requestAnimationFrame(loop); } },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); renderer.dispose(); canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointermove', onMove); }
  };
  return api;
}
