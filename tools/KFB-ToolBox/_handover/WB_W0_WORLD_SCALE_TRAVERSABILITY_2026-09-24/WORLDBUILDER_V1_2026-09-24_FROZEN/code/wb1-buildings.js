/* KFB WorldBuilder v1 · Gebäude auf dem Planeten (Inhalt auf dem Boden, nie der Boden)
   Ansichten, alle vier umschaltbar, keine fällt weg:
     ELASTIC  (Vorgabe) · elastic-grotesque-clay.mjs @0c59e92d (V2-Geometrie: buildElasticShell ·
              buildElasticRoof · protectedDetails), Farben aus cologne-palette.v1.js @b7f28824
              (makePalette · harmonisch, Seed) — NUR der Palettenteil des gescheiterten R2-Tunes.
     CLEAN    · Quell-Grundriss + Quellhöhe (viewer.mjs cleanGeometry, V2)
     CARTOON  · cartoon-city.js applyCartoonMassing(presets.cartoon)
     GROTESQUE· cartoon-city.js applyCartoonMassing(presets.grotesque) + windowCodesForBuilding
   Daten: echter OSM-Ausschnitt Hürth (data/huerth-v0/normalized.json @0c59e92d), die 22
   Fixture-IDs des V2-Viewers; auf dem Planeten stehen die 9 dem Blockmittel nächsten.
   Offen und NICHT angefasst (Georg 24.09.): Dächer als Deckel, Bordstein-Keile, Schattenbänder.
   Strassen werden in v1 nicht auf die Kugel gelegt (Band-Geometrie ist eben, Nahtfehler offen). */

import * as THREE from 'three';

export const PIN_V2 = '0c59e92d9d8688f5a88cd309ae8891dcd174c2fc';
export const PIN_PAL = 'b7f28824299b15e5d8a61c4bd9d847cfbe8f18ea';
const GH = (c) => 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@' + c + '/tools/osm-city-lab/';
export const URLS = {
  elastic: GH(PIN_V2) + 'experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs',
  cartoon: GH(PIN_V2) + 'src/style/cartoon-city.js',
  materials: GH(PIN_V2) + 'src/style/kfb-city-materials.js',
  city: GH(PIN_V2) + 'data/huerth-v0/normalized.json',
  style: GH(PIN_V2) + 'styles/kfb-city-v0.json',
  palette: GH(PIN_PAL) + 'experiments/elastic-grotesque-clay-huerth01/vendor/racer-cologne/cologne-palette.v1.js'
};
const RAW = (c, p) => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + c + '/tools/osm-city-lab/' + p;
const FIXTURE_IDS = ['way/371401492', 'way/371401494', 'way/371401485', 'way/371401566', 'way/371401483', 'way/371401495', 'way/371401482', 'way/371401475', 'way/371401481', 'way/371401529', 'way/371401497', 'way/371401491', 'way/371401471', 'way/371401493', 'way/371401480', 'way/371401490', 'way/371401488', 'way/371401477', 'way/371401469', 'way/371401496', 'way/371401465', 'way/371401499'];
/* V2-Palette wörtlich aus viewer.mjs @0c59e92d (Fenster/Türen bleiben daraus) */
const ELASTIC_PALETTE = {
  id: 'KFB_WONKY_90S_CLAY_V1',
  walls: ['#f1c85b', '#e77d62', '#82b9a2', '#79a8c7', '#cf92b6', '#b8c85c', '#ef9e58', '#a993c9'],
  roofs: ['#d55e4b', '#4e7e79', '#695f86', '#c77a4b', '#78604d', '#58728d'],
  windows: ['#315d66', '#394c6d', '#336c70'],
  doors: ['#a94f46', '#5a6f84', '#c06a3c', '#6d527a', '#477b69']
};
export const VIEWS = [['ELASTIC GROTESQUE CLAY', 'elastic'], ['CLEAN', 'clean'], ['CARTOON', 'cartoon'], ['GROTESQUE', 'grotesque']];
export const SCALE = 1;   // echte Meter — derselbe Massstab wie Figur, Objekte und Gelände
const COUNT = 9;

async function json(url, fallback) {
  try { const r = await fetch(url); if (!r.ok) throw new Error(r.status); return await r.json(); }
  catch (e) { const r = await fetch(fallback); if (!r.ok) throw new Error('HTTP ' + r.status + ' · ' + fallback); return r.json(); }
}

export async function loadBuildings(log = () => {}) {
  const [EG, CC, MAT, PAL] = await Promise.all([import(URLS.elastic), import(URLS.cartoon), import(URLS.materials), import(URLS.palette)]);
  log('Elastic Grotesque Clay V2 @' + PIN_V2.slice(0, 8) + ' loaded (buildElasticShell · buildElasticRoof · protectedDetails)');
  log('cartoon-city.js @' + PIN_V2.slice(0, 8) + ' loaded (applyCartoonMassing · windowCodesForBuilding)');
  log('cologne-palette.v1.js @' + PIN_PAL.slice(0, 8) + ' loaded (makePalette · palette part only)');
  const [city, style] = await Promise.all([
    json(URLS.city, RAW(PIN_V2, 'data/huerth-v0/normalized.json')),
    json(URLS.style, RAW(PIN_V2, 'styles/kfb-city-v0.json'))
  ]);
  const byId = new Map(city.features.buildings.map((b) => [b.id, b]));
  const fixture = FIXTURE_IDS.map((id) => byId.get(id)).filter(Boolean);
  const centers = fixture.map((b) => EG.centroid(b.footprint));
  const anchor = centers.reduce((a, c) => ({ x: a.x + c.x / centers.length, z: a.z + c.z / centers.length }), { x: 0, z: 0 });
  const chosen = fixture.map((b, i) => ({ b, c: centers[i], d: Math.hypot(centers[i].x - anchor.x, centers[i].z - anchor.z) }))
    .sort((a, b) => a.d - b.d).slice(0, COUNT);
  log('Hürth huerth-v0 · ' + fixture.length + '/22 fixture buildings found · ' + chosen.length + ' placed on the planet');
  return { EG, CC, MAT, PAL, style, chosen, anchor, fixtureCount: fixture.length };
}

const mat = (color, rough = 0.9, flat = false) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, flatShading: flat, side: THREE.DoubleSide });
function shape(poly) { const s = new THREE.Shape(); poly.forEach((p, i) => (i ? s.lineTo(p.x, -p.z) : s.moveTo(p.x, -p.z))); return s; }
function cleanGeometry(b, steps = 1) {
  const g = new THREE.ExtrudeGeometry(shape(b.footprint), { depth: b.heightM, bevelEnabled: false, steps });
  g.rotateX(-Math.PI / 2); g.computeVertexNormals(); return g;
}

/* Eine Ansicht bauen: Gruppen in METERN (Quellkoordinaten), je Gebäude eine Gruppe. */
export function buildView(L, mode, paletteSeed) {
  const { EG, CC, MAT, PAL, style, chosen, anchor } = L;
  const palette = MAT.materialPalette(style);
  const colorSlot = (arr, id, salt) => arr[CC.stableHash(ELASTIC_PALETTE.id + ':' + salt + ':' + id) % arr.length];
  const harm = paletteSeed ? PAL.makePalette(paletteSeed) : null;
  const walls = harm ? harm.buildings : ELASTIC_PALETTE.walls;
  const roofs = harm ? harm.roofs : ELASTIC_PALETTE.roofs;
  const out = [];
  for (const { b, c } of chosen) {
    const g = new THREE.Group();
    g.userData.sourceId = b.id;
    let geom, deformation = null;
    if (mode === 'clean') geom = cleanGeometry(b, 1);
    else if (mode === 'cartoon' || mode === 'grotesque') {
      const pre = style.cartoonMassing.presets[mode];
      geom = cleanGeometry(b, Math.max(2, pre.verticalSteps || 2));
      deformation = CC.applyCartoonMassing(geom, b.id, pre, style.seed || 'kfb-city');
    } else {
      const shell = EG.buildElasticShell(b, anchor);
      geom = shell.geometry;
      const roof = new THREE.Mesh(EG.buildElasticRoof(b, shell), mat(colorSlot(roofs, b.id, 'roof'), 0.98));
      roof.castShadow = roof.receiveShadow = true;
      g.add(roof);
      const box = new THREE.BoxGeometry(1, 1, 1);
      const wm = mat(colorSlot(ELASTIC_PALETTE.windows, b.id, 'window'), 0.86), dm = mat(colorSlot(ELASTIC_PALETTE.doors, b.id, 'door'), 0.96);
      for (const d of EG.protectedDetails(b, shell)) {
        const m = new THREE.Mesh(box, d.kind === 'window' ? wm : dm);
        m.position.set(d.x, d.y, d.z); m.rotation.y = d.yaw; m.scale.set(d.w, d.h, d.d);
        m.castShadow = true; g.add(m);
      }
    }
    const color = mode === 'elastic' ? colorSlot(walls, b.id, 'wall') : MAT.pickStable(palette[b.materialClass] || palette.residential || Object.values(palette)[0], b.id);
    const body = new THREE.Mesh(geom, mat(color, mode === 'elastic' ? 0.975 : 0.9, mode !== 'elastic'));
    body.castShadow = body.receiveShadow = true;
    g.add(body);
    if (mode === 'grotesque') {
      const cfg = { ...style.cartoonMassing.windows, materialCount: palette.window.length };
      const box = new THREE.BoxGeometry(1, 1, 1);
      for (const w of CC.windowCodesForBuilding(b, deformation, cfg, style.seed || 'kfb-city')) {
        const m = new THREE.Mesh(box, mat(palette.window[w.materialIndex % palette.window.length], 0.64));
        m.position.set(w.x, w.y, w.z); m.rotation.y = w.yaw; m.scale.set(w.width, w.height, w.depth); g.add(m);
      }
    }
    out.push({ b, c, group: g });
  }
  return { items: out, palette: harm ? { kind: 'cologne-harmonic', seed: harm.seed, scheme: harm.scheme } : { kind: ELASTIC_PALETTE.id } };
}

/* Auf die Kugel: Blockmittel → villageDir, jedes Gebäude im Tangentialrahmen an seinem Ort,
   Sockel auf die niedrigste Geländehöhe unter dem Grundriss (bergseitig steckt es im Hang). */
export function frameAt(d) {
  const up = d.clone().normalize();
  const ref = Math.abs(up.y) < 0.95 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const e = new THREE.Vector3().crossVectors(ref, up).normalize();
  const nth = new THREE.Vector3().crossVectors(up, e).normalize();
  return { up, e, n: nth };
}
export function placeOnPlanet(root, view, L, planet, villageDir) {
  root.clear();
  const F = frameAt(villageDir);
  const q = new THREE.Quaternion(), m4 = new THREE.Matrix4(), v = new THREE.Vector3();
  for (const it of view.items) {
    const u = (it.c.x - L.anchor.x) * SCALE, w = (it.c.z - L.anchor.z) * SCALE;
    const dir = villageDir.clone().normalize().multiplyScalar(planet.R).addScaledVector(F.e, u).addScaledVector(F.n, -w).normalize();
    const G = frameAt(dir);
    /* Rahmen: lokal x → Ost, y → oben, z → −Nord (rechtshändig), wie beim Dorfmittel */
    m4.makeBasis(G.e, G.up, G.n.clone().negate());
    q.setFromRotationMatrix(m4);
    let hmin = Infinity;
    for (const p of it.b.footprint) {
      v.copy(G.up).multiplyScalar(planet.R).addScaledVector(G.e, (p.x - it.c.x) * SCALE).addScaledVector(G.n, -(p.z - it.c.z) * SCALE);
      hmin = Math.min(hmin, planet.heightAt(v));
    }
    const outer = new THREE.Group();
    outer.name = 'building:' + it.b.id;
    outer.position.copy(G.up).multiplyScalar(planet.R + hmin - 0.15);
    outer.quaternion.copy(q);
    const inner = it.group;
    inner.scale.setScalar(SCALE);
    inner.position.set(-it.c.x * SCALE, 0, -it.c.z * SCALE);
    outer.add(inner);
    root.add(outer);
  }
}
