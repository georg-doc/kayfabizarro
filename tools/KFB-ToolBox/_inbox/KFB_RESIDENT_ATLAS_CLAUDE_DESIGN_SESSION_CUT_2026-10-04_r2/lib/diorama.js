/* KFB · Clay-Diorama (S12, CD-RES-01)
   Zweite Darstellung DERSELBEN Szene. Umschalten Studio ↔ Diorama ändert Material, Boden, Himmel und
   Licht — nicht Auswahl, Clip, Timeline oder Editorzustand. Kein zweiter Runtime-Owner: die Szene
   gehört weiter dem Atlas, das Diorama legt nur eine Schicht darum und nimmt sie wieder ab.

   Donoren, nichts neu erfunden:
   · Material K2: clay-material.v10 + clay-relief.v2/v4 + clay-toolmix.v1 + clay-profiles.v2
     (tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28 @ main).
     Globale Werte wie K2/T3 (uClayHand 0,5·k, Kachel 1,6·k, Abdruck 4,5·k), k aus der Figurenhöhe.
   · Größenklassen H0: Gelände und große Architektur grob, Häuser/Wege/Requisiten mittel, Figuren fein.
   · Himmel: travel/travel-v16/terrain-v16/skydome-shader.js (createSkydome · setVariant · setPalette ·
     follow). off = flache Horizontfarbe · basic = statische Kenney-Kuppel · full = prozedural (S / space).
   · Partikel: T4 clay-vfx.v1 + clay-particle-profiles.v1 (InstancedMesh, gepoolt, schattenlos).
   Grounding-Vertrag: das Relief wirkt nur auf die Normale (normal_fragment_maps), nie auf die Höhe.
   Die logische Kontaktfläche ist die sichtbare Geländegeometrie selbst. */
import * as THREE from 'three';
import { makeClayRelief } from './clay/clay-relief.v2.js';
import { makeToolReliefs } from './clay/clay-relief.v4.js';
import * as C from './clay/clay-material.v10.js';
import { TOOLMIX } from './clay/clay-toolmix.v1.js';
import { createSkydome } from './sky/skydome-shader.js';
import { makeClayVFX } from './clay/clay-vfx.v1.js';

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const hash = (x, z) => { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); };
function vnoise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  const a = hash(xi, zi), b = hash(xi + 1, zi), c = hash(xi, zi + 1), d = hash(xi + 1, zi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const fbm = (x, z) => vnoise(x, z) * 0.55 + vnoise(x * 2.1 + 7, z * 2.1 + 3) * 0.3 + vnoise(x * 4.3 + 1, z * 4.3 + 9) * 0.15;

export const BIOMES = {
  /* S12 · Quaternius-Außenposten: Lila-Knete, Türkishügel, Korallenerde — weird, aber warm */
  alien: { label: 'Alienwelt', ground: '#9a7cc0', dirt: '#d08f72', contact: '#5e4a7a', hill: '#4fae9c', far: '#3d7a8c', skyTint: [0.66, 0.44, 0.80], vfx: 'meadow' },
  friedhof: { label: 'Friedhof', ground: '#7d8458', dirt: '#8a7458', contact: '#5d5a44', hill: '#667a4c', far: '#56694f', skyTint: [0.42, 0.40, 0.55], vfx: 'meadow' },
  wiese: { label: 'Wiese', ground: '#93ad5e', dirt: '#9c8660', contact: '#6d7446', hill: '#719950', far: '#5f8a58', skyTint: [0.55, 0.72, 0.9], vfx: 'meadow' }
};
export const TIMES = {
  tag: { label: 'Tag', sun: '#fff1dc', si: 2.7, el: 50, az: -0.75, hs: '#eef3f6', hg: '#9a8a78', hi: 1.15, pal: [[0.34, 0.55, 0.84], [0.60, 0.76, 0.93], [0.97, 0.95, 0.90]], basic: 'day', hor: '#bcd3e4', exp: 0.95 },
  abend: { label: 'Abend', sun: '#ffc48a', si: 2.3, el: 16, az: -1.25, hs: '#f1d2c0', hg: '#6d5a57', hi: 0.9, pal: [[0.24, 0.16, 0.38], [0.88, 0.47, 0.30], [1.0, 0.83, 0.56]], basic: 'morning', hor: '#e0a78a', exp: 0.9 },
  nacht: { label: 'Nacht', sun: '#a8b8ff', si: 0.95, el: 40, az: 0.65, hs: '#4a5680', hg: '#1f1e2a', hi: 0.6, pal: null, basic: 'night', hor: '#161b2f', exp: 0.8 }
};

export function makeDiorama(V, { contract, getRoot, figureH = 2.3, onNote = () => {}, terrainV = 1 } = {}) {
  const S = { p0: 0, quality: 'mittel', view: 'studio', sky: 'basic', time: 'tag', biome: 'wiese', clay: true, studioClay: true, vfx: true, ready: false, busy: null, k: figureH / 1.2, gate: false };
  const group = new THREE.Group(); group.name = 'diorama-layer';
  let U = null, terrain = null, fixtures = null, dome = null, vfx = null, PP = null, skirt = null;
  const swapped = new Map();   // mesh -> original material
  const cache = new Map();     // original.uuid|cls|scale -> clay material
  let hemi = null, fill = null;
  V.scene.traverse((o) => { if (o.isHemisphereLight && !hemi) hemi = o; else if (o.isDirectionalLight && !o.castShadow && !fill) fill = o; });

  async function prepare() {
    if (S.ready) return;
    if (S.busy) return S.busy;
    S.busy = (async () => {
      onNote('Knete wird angerührt …');
      const t0 = performance.now();
      const tex = (d) => { const t = new THREE.DataTexture(d, 1024, 1024, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = V.renderer.capabilities.getMaxAnisotropy(); t.needsUpdate = true; return t; };
      const rel = makeClayRelief({ size: 1024, seed: 31 }); const relT = tex(rel.data);
      /* Die Donor-Funktion gibt zwischen den Werkzeugen mit setTimeout(0) ab. In einem verdeckten Fenster
         wird setTimeout gedrosselt (bis 1/min) und die Knete wäre minutenlang „in Arbeit". Für die Dauer
         des Aufrufs läuft setTimeout(0) über einen MessageChannel — der Donor bleibt unverändert. */
      const st = window.setTimeout, ch = new MessageChannel(), q = [];
      ch.port1.onmessage = () => { const f = q.shift(); if (f) f(); };
      window.setTimeout = (f, d, ...a) => (d ? st(f, d, ...a) : (q.push(() => f(...a)), ch.port2.postMessage(0), 0));
      let tools;
      try { tools = await makeToolReliefs({ size: 1024, seed: 41, onStep: (t) => onNote('Knet-Werkzeug · ' + t + ' …') }); }
      finally { window.setTimeout = st; }
      U = C.makeClayUniforms(THREE, relT);
      [U.uClayToolA.value, U.uClayToolB.value, U.uClayToolC.value] = tools.maps.map(tex);
      const K = S.k;
      U.uClayToolOn.value = 1; U.uClayLegacyStroke.value = 0; U.uClayMottle.value = 0.04; U.uClayPrintOn.value = 0; U.uClayPrint.value = relT;
      U.uClayHand.value = 0.5 * K; U.uClayTile.value = 1.6 * K; U.uClayPrintTile.value = 4.5 * K; U.uClayMacro.value = 0.5; U.uClayLodK.value = 0.6; U.uClayStroke.value = 0.7;
      try { PP = await (await fetch(new URL('../data/clay-particle-profiles.v1.json', import.meta.url))).json(); vfx = makeClayVFX(group, PP, { camera: V.camera }); } catch (e) { console.warn('VFX', e); }
      S.reliefMs = Math.round(performance.now() - t0);
      S.ready = true; S.busy = null;
      onNote('Knete bereit · ' + S.reliefMs + ' ms');
    })();
    return S.busy;
  }

  /* ---------- Größenklassen (H0) ---------- */
  const prof = (key, scale, over = {}) => { const k = S.k, p = { ...C.PROFILES[key], ...over }; p.scale = (scale ?? p.scale) * k; p.gougeSize *= k; p.crackSize *= k; p.dentSize *= k; p.legacy = 0; return p; };
  const CLS = {
    coarse: () => prof('house', 1.6, { tools: TOOLMIX.terrain, print: 0.3, gouge: 0.2, crack: 0.1 }),
    mid: () => prof('prop', 0.8, { tools: TOOLMIX.prop }),
    floor: () => prof('house', 1.6, { tools: TOOLMIX.floor, print: 0.3, gouge: 0.2, crack: 0.1 }),
    stone: () => prof('prop', 0.7, { tools: TOOLMIX.rock }),
    fine: () => prof('figure', 0.45, { tools: TOOLMIX.vehicle, print: 0.8 })
  };
  function classOf(mesh, entryRoot) {
    if (mesh.isSkinnedMesh) return 'fine';
    if (!entryRoot?.userData.entry && /boden|floor/i.test(mesh.name || '')) return 'floor';
    const n = (entryRoot?.userData.entry?.id || entryRoot?.name || mesh.name || '').toLowerCase();
    if (/grave|stone|rock|tomb|skull|bone/.test(n)) return 'stone';
    const b = new THREE.Box3().setFromObject(entryRoot || mesh), sz = b.getSize(new THREE.Vector3());
    return Math.max(sz.x, sz.y, sz.z) > figureH * 1.6 || /crypt|arch|fence|tree|wall|gate/.test(n) ? 'coarse' : 'mid';
  }
  const skip = (m) => !m || m.isShaderMaterial || m.isMeshBasicMaterial || m.isSpriteMaterial || m.isLineBasicMaterial || m.isPointsMaterial || m.isShadowMaterial || (m.transparent && (m.opacity ?? 1) < 0.98);
  function clayOf(orig, cls, s) {
    const key = orig.uuid + '|' + cls + '|' + s.toFixed(2);
    if (cache.has(key)) return cache.get(key);
    const p = CLS[cls](); p.scale /= s; p.gougeSize /= s; p.crackSize /= s; p.dentSize /= s;
    const m = C.makeClayMaterial(THREE, U, { src: orig, profile: p });
    m.userData.clayClass = cls; m.userData.tools0 = p.tools; m.userData.sheen0 = m.sheen;
    tuneMat(m);
    cache.set(key, m);
    return m;
  }
  /* ---------- Qualitätsstufen (S12b) ----------
     Budget: 50 fps bei 1280×720, Diorama, Himmel Basic, MacBook Pro M1 Max (Georg 29.09.).
     Dieselbe Tabelle soll später die Fahrt tragen, daher an EINER Stelle:
       hoch    Pixeldichte ≤ 2 · Glanz (sheen) · Werkzeuge überall · Schatten 4096 · VFX high
       mittel  Pixeldichte ≤ 1,25 · kein Glanz · Werkzeuge nur Figuren/Requisiten, Gelände Grundrelief · Schatten 2048 · VFX medium
       niedrig Pixeldichte 1 · kein Glanz · keine Werkzeuge · Schatten 1024 · VFX low
     Der Look (Farbe, Grundrelief, Facetten) bleibt in allen Stufen. Nur die teuren Schichten fallen weg. */
  const Q = {
    hoch: { dpr: 2, sheen: true, tools: 'all', shadow: 4096, vfx: 'high' },
    mittel: { dpr: 1.25, sheen: false, tools: 'objects', shadow: 2048, vfx: 'medium' },
    niedrig: { dpr: 1, sheen: false, tools: 'none', shadow: 1024, vfx: 'low' }
  };
  const dpr0 = Math.min(2, window.devicePixelRatio || 1);
  function tuneMat(m) {
    const q = Q[S.quality], isTerrain = m.userData.clayClass === 'terrain';
    m.sheen = q.sheen ? (m.userData.sheen0 ?? 0.18) : 0;
    const want = q.tools === 'all' || (q.tools === 'objects' && !isTerrain) ? m.userData.tools0 : {};
    if (m.userData.clay && m.userData.clay.setTools) m.userData.clay.setTools(want || {});
  }
  function applyQuality() {
    const q = Q[S.quality];
    if (S.view === 'diorama') V.renderer.setPixelRatio(Math.min(dpr0, q.dpr)); else V.renderer.setPixelRatio(dpr0);
    V.resize && V.resize();
    if (U) U.uClayToolOn.value = q.tools === 'none' ? 0 : 1;
    for (const m of cache.values()) tuneMat(m);
    if (terrain && terrain.material.userData.clay) tuneMat(terrain.material);
    if (fixtures) fixtures.traverse((o) => { if (o.material && o.material.userData.clay) tuneMat(o.material); });
    if (S.view === 'diorama') contract.setMapSize(q.shadow); else contract.setMapSize(4096);
    if (vfx) vfx.setQuality(S.vfx ? q.vfx : 'off');
  }
  function applyClay(root) {
    if (!U || !root) return 0;
    let n = 0, seed = 1;
    root.updateMatrixWorld(true);
    const walk = (o, entryRoot) => {
      if (o.userData && o.userData.entry) entryRoot = o;
      if ((o.isMesh || o.isSkinnedMesh) && !o.isInstancedMesh && !swapped.has(o) && !o.userData.noClay) {
        const orig = o.material, arr = Array.isArray(orig) ? orig : [orig];
        if (!arr.some(skip)) {
          const cls = classOf(o, entryRoot), s = Math.max(1e-3, o.matrixWorld.getMaxScaleOnAxis());
          if (!o.geometry.attributes.claySeed) C.seedGeometry(THREE, o.geometry, seed++ * 17);
          const next = arr.map((m) => clayOf(m, cls, s));
          swapped.set(o, orig); o.material = Array.isArray(orig) ? next : next[0]; n++;
        }
      }
      for (const c of o.children) walk(c, entryRoot);
    };
    walk(root, null);
    return n;
  }
  async function studioClayOn(root) {
    if (!S.studioClay || !S.clay || S.view !== 'studio') return 0;
    await prepare();
    if (S.view !== 'studio' || !S.studioClay) return 0;
    const n = applyClay(root); applyClay(contract.floor);
    return n;
  }
  function removeClay() { for (const [o, m] of swapped) o.material = m; swapped.clear(); }

  /* ---------- Gelände: sichtbar = Kontakt = Empfänger ---------- */
  function buildTerrain(root) {
    if (terrain) { group.remove(terrain); terrain.geometry.dispose(); }
    if (fixtures) { group.remove(fixtures); }
    const box = new THREE.Box3();
    if (root) box.setFromObject(root);
    if (box.isEmpty()) box.set(new THREE.Vector3(-2, 0, -2), new THREE.Vector3(2, 2, 2));
    const Hs = figureH / 2.3, cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2;
    const pad = Math.max(1.6, 0.7 * figureH);
    const hx = (box.max.x - box.min.x) / 2 + pad, hz = (box.max.z - box.min.z) / 2 + pad;
    const V2 = terrainV >= 2;
    /* S14 · terrainV 2 (nur S14): Georg 30.09. „BG zu grob, Horizont in der Mulde nicht sichtbar“, Geländerand
       sichtbar. Randhügel skalieren mit der Szene, Fernhügel flacher, feinere Knet-Spur, Fernring bis zum Horizont. */
    const span = Math.max(hx, hz);
    const R = V2 ? span * 3 + 40 * Hs : span * 2.4 + 16 * Hs, rise = V2 ? Math.min(5, 1.5 + span * 0.4) * Hs : 5 * Hs;
    const nearA = V2 ? Math.min(1, 0.25 + span / 10) : 1;
    const seg = V2 ? 180 : 140, g = new THREE.PlaneGeometry(2 * R, 2 * R, seg, seg);
    g.rotateX(-Math.PI / 2); g.translate(cx, 0, cz);
    const pos = g.attributes.position, col = new Float32Array(pos.count * 3);
    const B = BIOMES[S.biome], cG = new THREE.Color(B.ground), cD = new THREE.Color(B.dirt), cH = new THREE.Color(B.hill), cF = new THREE.Color(B.far), cK = new THREE.Color(B.contact), c = new THREE.Color();
    const sd = (x, z) => { const qx = Math.abs(x - cx) - hx, qz = Math.abs(z - cz) - hz; return Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0); };
    /* S12c · Kacheln sind Fläche, nicht Deko: unter jeder Bodenkachel sinkt das Gelände ab (eine
       Rasterweite Abstand zur Kante), damit Mulden in der Kachel — das offene Grab — sichtbar bleiben
       statt vom Plateau gefüllt zu werden. */
    const carve = [];
    if (root) root.traverse((o) => { if (o.userData && o.userData.entry && /floor/i.test(o.userData.entry.id || o.name) && o.visible) { const b = new THREE.Box3().setFromObject(o); if (!b.isEmpty()) carve.push(b); } });
    const foot = [];
    if (root) for (const ch of root.children) { if (!ch.visible) continue; const b = new THREE.Box3().setFromObject(ch); if (!b.isEmpty() && b.min.y < 0.2) foot.push(b); }
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i), d = sd(x, z);
      let y = S.p0;
      if (d > 0) {
        const n1 = fbm(x * 0.07 / Hs, z * 0.07 / Hs), n2 = fbm(x * 0.025 / Hs + 5, z * 0.025 / Hs + 2);
        y = V2
          ? S.p0 + smooth(0, rise, d) * (0.5 + 1.0 * n1) * nearA * Hs + smooth(rise, R * 0.85, d) * (0.6 + 2.0 * n2) * Hs
          : S.p0 + smooth(0, rise, d) * (0.9 + 1.6 * n1) * Hs + smooth(rise, R * 0.85, d) * (2.5 + 6 * n2) * Hs;
      }
      if (carve.length) { const m = (2 * R) / seg; for (const b of carve) if (x > b.min.x + m && x < b.max.x - m && z > b.min.z + m && z < b.max.z - m) { y = S.p0 - 0.8; break; } }
      pos.setY(i, y);
      const nb = fbm(x * 0.35, z * 0.35);
      if (d <= 0) c.copy(cG).lerp(cD, smooth(0.55, 0.8, fbm(x * 0.12 + 3, z * 0.12 + 1)) * 0.7);
      else c.copy(cG).lerp(cH, smooth(0, rise, d)).lerp(cF, smooth(rise, R * 0.8, d));
      c.multiplyScalar(0.9 + 0.2 * nb);
      /* Kontaktzonen: gedrückte, dunklere Knete am Plateaurand und unter jedem Fuß (H0) */
      let k = d > -0.6 && d < 0.8 ? 0.45 * (1 - Math.abs(d - 0.1) / 0.7) : 0;
      for (const b of foot) { const qx = Math.max(b.min.x - x, 0, x - b.max.x), qz = Math.max(b.min.z - z, 0, z - b.max.z), e = Math.hypot(qx, qz); if (e < 0.45) k = Math.max(k, 0.55 * (1 - e / 0.45)); }
      if (k > 0) c.lerp(cK, Math.min(0.6, k));
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.computeVertexNormals();
    C.seedGeometry(THREE, g, 77);
    const src = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 });
    const tprof = V2 ? prof('terrainFg', 0.55, { tools: TOOLMIX.terrain, print: 0, gouge: 0, crack: 0, dent: 0.12, stroke: 0.45, grain: 0.8, facet: 0.5, crease: 0.5 }) : prof('terrainFg', 1.1, { tools: TOOLMIX.terrain, print: 0, gouge: 0.1, crack: 0 });
    const mat = U ? C.makeClayMaterial(THREE, U, { src, profile: tprof }) : src;
    mat.polygonOffset = true; mat.polygonOffsetFactor = 1; mat.polygonOffsetUnits = 4;
    if (U) { mat.userData.clayClass = 'terrain'; mat.userData.tools0 = TOOLMIX.terrain; mat.userData.sheen0 = mat.sheen; tuneMat(mat); }
    terrain = new THREE.Mesh(g, mat);
    terrain.name = 'Diorama · Knetgelände'; terrain.receiveShadow = true; terrain.castShadow = false; terrain.userData.surface = 'terrain'; terrain.userData.noClay = true;
    terrain.userData.plateau = { cx, cz, hx, hz, rise, R };
    /* S14b · Kosten: grounding.js wirft je Figur und Bild drei senkrechte Strahlen auf das Gelände. Der Standard-
       Raycast prüfte jedes Mal alle 40–65k Dreiecke (Friedhof: 32 ms CPU je Bild, Georg M1: 10 fps). Das Gelände
       ist ein Raster: senkrechte Strahlen testen nur die zwei Dreiecke der Zelle. Gleiche Treffer, andere Strahlen wie bisher. */
    {
      const gx = seg + 1, cell = (2 * R) / seg, x0 = cx - R, z0 = cz - R, P = g.attributes.position;
      const A = new THREE.Vector3(), Bv = new THREE.Vector3(), Cv = new THREE.Vector3(), Dv = new THREE.Vector3(), hit = new THREE.Vector3(), inv = new THREE.Matrix4(), lr = new THREE.Ray();
      const base = THREE.Mesh.prototype.raycast;
      terrain.raycast = function (rc, out) {
        inv.copy(this.matrixWorld).invert(); lr.copy(rc.ray).applyMatrix4(inv);
        if (lr.direction.y > -0.999) return base.call(this, rc, out);
        const ix = Math.floor((lr.origin.x - x0) / cell), iz = Math.floor((lr.origin.z - z0) / cell);
        if (ix < 0 || iz < 0 || ix >= seg || iz >= seg) return;
        const a = ix + gx * iz, b = ix + gx * (iz + 1), c2 = ix + 1 + gx * (iz + 1), d = ix + 1 + gx * iz;
        A.fromBufferAttribute(P, a); Bv.fromBufferAttribute(P, b); Cv.fromBufferAttribute(P, c2); Dv.fromBufferAttribute(P, d);
        for (const [p, q, r, f] of [[A, Bv, Dv, [a, b, d]], [Bv, Cv, Dv, [b, c2, d]]]) {
          if (!lr.intersectTriangle(p, q, r, false, hit)) continue;
          const w = hit.clone().applyMatrix4(this.matrixWorld), dist = rc.ray.origin.distanceTo(w);
          if (dist < rc.near || dist > rc.far) return;
          const n = new THREE.Vector3().subVectors(r, q).cross(new THREE.Vector3().subVectors(p, q)).normalize();
          if (n.y < 0) n.negate();
          out.push({ distance: dist, point: w, object: this, face: { a: f[0], b: f[1], c: f[2], normal: n, materialIndex: 0 }, faceIndex: -1 });
          return;
        }
      };
    }
    group.add(terrain);
    if (skirt) { group.remove(skirt); skirt.geometry.dispose(); skirt = null; }
    if (V2) {
      /* Fernring: schließt an den Geländerand an (gemessene Randhöhe je Richtung) und läuft flach bis 1200 aus */
      const n = 128, ringG = new THREE.RingGeometry(R * 0.97, 1200, n, 3, 0, Math.PI * 2);
      ringG.rotateX(-Math.PI / 2); ringG.translate(cx, 0, cz);
      const rp = ringG.attributes.position, rc = new Float32Array(rp.count * 3), hor = new THREE.Color(TIMES[S.time].hor), rim = [], ray = new THREE.Raycaster();
      for (let i = 0; i < rp.count; i++) {
        const x = rp.getX(i) - cx, z = rp.getZ(i) - cz, r = Math.hypot(x, z), t = smooth(R, 1200, r);
        const ex = cx + (x / r) * R * 0.96, ez = cz + (z / r) * R * 0.96;
        ray.set(new THREE.Vector3(ex, 500, ez), new THREE.Vector3(0, -1, 0));
        const h = ray.intersectObject(terrain, false)[0], ey = h ? h.point.y : S.p0;
        rp.setY(i, ey * (1 - t) + (S.p0 + 0.5 * Hs) * t - 0.02);
        c.copy(cF).lerp(hor, 0.55 * t); rc[i * 3] = c.r; rc[i * 3 + 1] = c.g; rc[i * 3 + 2] = c.b;
      }
      ringG.setAttribute('color', new THREE.BufferAttribute(rc, 3)); ringG.computeVertexNormals();
      skirt = new THREE.Mesh(ringG, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
      skirt.name = 'Diorama · Fernring'; skirt.receiveShadow = false; skirt.castShadow = false; skirt.userData.noClay = true;
      group.add(skirt);
    }
    buildFixtures();
    return terrain;
  }
  /* Prüf-Aufbauten für den Grounding-Gate: ein Hang-Stein und eine Knet-Trackkante. Gehören dem Host. */
  function buildFixtures() {
    fixtures = new THREE.Group(); fixtures.name = 'Diorama · Prüfaufbauten'; fixtures.visible = S.gate;
    const P = terrain.userData.plateau, Hs = figureH / 2.3;
    const mk = (geo, color, cls, name) => { C.seedGeometry(THREE, geo, name.length * 7); const src = new THREE.MeshStandardMaterial({ color, roughness: 0.9 }); const pf = CLS[cls](), mm = U ? C.makeClayMaterial(THREE, U, { src, profile: pf }) : src; if (U) { mm.userData.clayClass = cls; mm.userData.tools0 = pf.tools; mm.userData.sheen0 = mm.sheen; tuneMat(mm); } const m = new THREE.Mesh(geo, mm); m.castShadow = m.receiveShadow = true; m.name = name; m.userData.noClay = true; return m; };
    const stone = mk(new THREE.DodecahedronGeometry(0.34 * Hs, 1), '#8f8a80', 'stone', 'Prüfung · Stein am Hang');
    stone.scale.set(1.3, 0.8, 1);
    stone.position.set(P.cx + P.hx + P.rise * 0.45, 0, P.cz + P.hz * 0.2);
    stone.userData.fixture = 'slope';
    const track = new THREE.Group(); track.name = 'Prüfung · Trackkante'; track.userData.fixture = 'track';
    const deck = mk(new THREE.BoxGeometry(5 * Hs, 0.14 * Hs, 1.8 * Hs), '#6c6674', 'mid', 'Track · Fahrbahn'); deck.position.y = 0.07 * Hs; deck.userData.surface = 'track';
    const kerb = mk(new THREE.CapsuleGeometry(0.11 * Hs, 5 * Hs - 0.22 * Hs, 4, 10), '#e0463a', 'mid', 'Track · Wulst'); kerb.rotation.z = Math.PI / 2; kerb.position.set(0, 0.14 * Hs + 0.11 * Hs, 0.9 * Hs - 0.11 * Hs);
    track.add(deck, kerb);
    track.position.set(P.cx - P.hx + 3 * Hs, 0, P.cz + P.hz - 1.2 * Hs);
    const cone = mk(new THREE.ConeGeometry(0.16 * Hs, 0.42 * Hs, 14), '#f2b632', 'mid', 'Prüfung · Pylone an der Kante');
    cone.position.set(track.position.x + 1.4 * Hs, 0, track.position.z + 0.62 * Hs); cone.userData.fixture = 'trackProp';
    fixtures.add(stone, track, cone);
    group.add(fixtures);
  }

  /* ---------- Himmel ---------- */
  function ensureDome() {
    if (dome) return dome;
    dome = createSkydome({ radius: 1400, variant: 'S', mode: 0, exposure: 0.9, worldMix: 0.15, autoWaver: false });
    dome.setAutoWaver(false); dome.setMode(0);
    dome.group.name = 'Diorama · Himmelskuppel';
    dome.group.traverse((o) => { o.castShadow = false; o.receiveShadow = false; o.userData.noClay = true; });
    return dome;
  }
  function applySky() {
    const T = TIMES[S.time], B = BIOMES[S.biome];
    const inDio = S.view === 'diorama';
    if (!inDio) { if (dome && dome.group.parent) dome.group.parent.remove(dome.group); return; }
    if (S.sky === 'off') { if (dome && dome.group.parent) dome.group.parent.remove(dome.group); V.scene.background = new THREE.Color(T.hor); return; }
    ensureDome();
    if (!dome.group.parent) V.scene.add(dome.group);
    if (S.sky === 'basic') dome.setVariant(T.basic);
    else if (S.time === 'nacht') dome.setVariant('space');
    else {
      dome.setVariant('S');
      dome.setPalette(T.pal.map((p, i) => p.map((v, j) => v * 0.78 + B.skyTint[j] * 0.22 * (i === 2 ? 0.6 : 1))));
      dome.setExposure(T.exp);
    }
    V.scene.background = new THREE.Color(T.hor);
  }
  function applyLight() {
    const T = TIMES[S.time];
    if (S.view !== 'diorama') return;
    const el = (S.gate ? 14 : T.el) * Math.PI / 180, az = S.gate ? -1.57 : T.az;
    const dir = new THREE.Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
    contract.key.color.set(T.sun); contract.key.intensity = T.si;
    contract.setLightDir(dir);
    if (hemi) { hemi.color.set(T.hs); hemi.groundColor.set(T.hg); hemi.intensity = T.hi; }
    if (fill) fill.intensity = 0.2 * T.si;
  }
  V.post.add((dt) => {
    if (S.view !== 'diorama') return;
    if (dome && dome.group.parent) {
      dome.follow(V.camera);
      dome.group.scale.setScalar((V.camera.far * 0.8) / 1400);
      dome.update(dt || 0.016, { energy: 0.12, beat: 0 });
    }
    if (vfx && S.vfx) vfx.update(Math.min(0.05, dt || 0.016));
  });

  const saved = { bg: null };
  const D = {
    group, get terrain() { return terrain; }, get fixtures() { return fixtures; }, get vfx() { return vfx; },
    get state() { return { quality: S.quality, dpr: V.renderer.getPixelRatio(), view: S.view, studioClay: S.studioClay, sky: S.sky, time: S.time, biome: S.biome, clay: S.clay, vfx: S.vfx, ready: S.ready, k: +S.k.toFixed(3), swapped: swapped.size, materials: cache.size, reliefMs: S.reliefMs || 0 }; },
    surfaces() {
      const out = [];
      if (S.view === 'diorama' && terrain) { out.push(terrain); if (fixtures && fixtures.visible) fixtures.traverse((o) => { if (o.userData.surface) out.push(o); }); }
      else if (contract.floor.visible) out.push(contract.floor);
      return out;
    },
    async setView(v, root) {
      if (v === S.view && v !== 'diorama') return;
      if (v === 'diorama') {
        await prepare();
        if (!group.parent) V.scene.add(group);
        buildTerrain(root);
        contract.setStudioFloor(false);
        S.view = 'diorama';
        if (S.clay) applyClay(root);
        applySky(); applyLight(); applyQuality();
      } else {
        S.view = 'studio';
        removeClay();
        if (group.parent) V.scene.remove(group);
        applySky(); applyQuality();
        contract.setStudioFloor(true);
        await studioClayOn(root);
      }
    },
    /* S16 · Knete im Studio (Georg 01.10.: „Claymation-Look ohne Diorama als Default"). Gleiches K2-Material,
       gleicher Swap-Speicher — nur ohne Gelände, Himmel und Diorama-Licht. Der Studio-Boden bekommt die Knete mit,
       sonst steht eine Knetfigur auf Plastik. */
    async setStudioClay(on, root) { S.studioClay = !!on; if (S.view !== 'studio') return; removeClay(); await studioClayOn(root); },
    /* nach einem Szenenwechsel: Gelände neu um den Inhalt, Material auf die neuen Knoten */
    refresh(root) { if (S.view !== 'diorama') { if (S.studioClay && S.clay) { removeClay(); studioClayOn(root); } return; } removeClay(); buildTerrain(root); if (S.clay) applyClay(root); applySky(); applyLight(); },
    reclay(root) { if (S.clay && (S.view === 'diorama' || S.studioClay)) { const n = applyClay(root); if (S.view !== 'diorama') applyClay(contract.floor); return n; } return 0; },
    /* Plateauhöhe = Kontaktfläche der Szene (Friedhof: 6 mm unter der Kachelfläche, damit die Kacheln sichtbar bleiben) */
    setPlateauY(y) { S.p0 = +y || 0; },
    get plateauY() { return S.p0; },
    setSky(m) { S.sky = m; applySky(); },
    setQuality(q) { if (!Q[q]) return; S.quality = q; applyQuality(); },
    get qualities() { return Q; },
    setTime(t) { S.time = t; applySky(); applyLight(); },
    setBiome(b, root) { if (!BIOMES[b] || b === S.biome) return; S.biome = b; if (S.view === 'diorama') { buildTerrain(root); applySky(); } },
    setClay(on, root) { S.clay = !!on; if (S.view !== 'diorama') { removeClay(); if (on) studioClayOn(root); return; } if (on) applyClay(root); else removeClay(); },
    setVFX(on) { S.vfx = !!on; if (vfx) vfx.setQuality(on ? Q[S.quality].vfx : 'off'); },
    setGate(on) { S.gate = !!on; if (fixtures) fixtures.visible = S.gate; applyLight(); },
    emit(event, pos, groundY) { if (!vfx || !S.vfx || S.view !== 'diorama') return 0; return vfx.emit(event, BIOMES[S.biome].vfx, { pos, dir: new THREE.Vector3(0, 1, 0), groundY, energy: 0.7 }); },
    setDebug(v) { if (U) U.uClayDebug.value = v; },
    /* Kosten je Schicht: dieselbe Kamera, 12 Bilder, gl.finish — Unterschied gegen „aus" */
    bench() {
      const gl = V.renderer.getContext();
      const t = () => { V.renderer.render(V.scene, V.camera); gl.finish(); const a = performance.now(); for (let i = 0; i < 12; i++) V.renderer.render(V.scene, V.camera); gl.finish(); return (performance.now() - a) / 12; };
      const rows = {}, keep = { sky: S.sky, clay: S.clay, vfx: S.vfx, sh: contract.key.castShadow };
      const root = getRoot && getRoot();
      rows.alles = t();
      D.setSky('off'); rows.himmelAus = t();
      D.setSky('basic'); rows.himmelBasic = t();
      D.setSky('full'); rows.himmelFull = t();
      D.setSky(keep.sky);
      contract.setOn(false); rows.schattenAus = t(); contract.setOn(keep.sh);
      if (S.view === 'diorama') { D.setClay(false, root); rows.knetAus = t(); D.setClay(keep.clay, root); }
      const tri = V.renderer.info.render.triangles, calls = V.renderer.info.render.calls;
      const f = (x) => +x.toFixed(2);
      return { ms: Object.fromEntries(Object.entries(rows).map(([k, v]) => [k, f(v)])), kosten: { himmelFull: f(rows.himmelFull - rows.himmelAus), himmelBasic: f(rows.himmelBasic - rows.himmelAus), schatten: f(rows.alles - rows.schattenAus), knete: rows.knetAus != null ? f(rows.alles - rows.knetAus) : null }, calls, tri, vfx: vfx ? { ...vfx.stats } : null, note: 'CPU+GPU-Zeit je Bild in dieser Vorschau, 12 Bilder, gl.finish. Vergleichswert, kein Race-Budget.' };
    }
  };
  return D;
}
