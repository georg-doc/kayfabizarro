/* KFB WB-DESIGN-PARALLEL-01 · Landmarks (external placement nach LANDMARK_OVERRIDES.md)
   Donors, IMPORTED_AND_CALLED:
   · Dom  lab-v9/cologne-world.v1.js      buildDom(THREE)
   · Hbf  lab-v9/cologne-landmarks.v1.js  buildGeniusLoci(THREE, anchors, null) → 'genius-loci:hauptbahnhof'
          (route=null → kein Freistell-Versatz; die übrigen vier Genius Loci werden verworfen)
   Grammatik, IMPORTED_AND_CALLED:
   · Türme  cartoon-city.js deformPoint (× grotesque-Preset kfb-city-v0)
   · Körper elastic-grotesque-clay.mjs deformElasticXZ/deformElasticY — DIESELBE Formel wie die Stadt,
            damit Landmarke und Nachbarn eine Sprache sprechen (pro Höhenschicht affin → keine Fugen)
   DELTA dieses Jobs (benannt, reversibel, nur auf der KFB-Instanz; der Isolations-Donor bleibt roh):
   1 Bodenplatten weg: Dom 'foundation', Hbf 'plinth' (Halle um die Plinthenhöhe abgesenkt).
   2 Farbe: Donor-Grau → KFB_WONKY_90S_CLAY_V1 (viewer.mjs @0c59e92d) über colorSlot(id, rolle), dann
     leicht hervorgehoben (OKLab-Chroma ×1,12, Helligkeit +0,03). Rollen: stone · second · upper · accent · glass.
   3 Tessellierung in y (Maße gleich), damit die Elastik biegen kann. */
import * as THREE from 'three';

export const PALETTE = {
  id: 'KFB_WONKY_90S_CLAY_V1',
  walls: ['#f1c85b', '#e77d62', '#82b9a2', '#79a8c7', '#cf92b6', '#b8c85c', '#ef9e58', '#a993c9'],
  roofs: ['#d55e4b', '#4e7e79', '#695f86', '#c77a4b', '#78604d', '#58728d'],
  windows: ['#315d66', '#394c6d', '#336c70'],
  doors: ['#a94f46', '#5a6f84', '#c06a3c', '#6d527a', '#477b69']
};

/* ---------- Farbe ---------- */
function lift(hex, dC = 1.12, dL = 0.03) {
  const c = new THREE.Color(hex), hsl = {}; c.getHSL(hsl);
  c.setHSL(hsl.h, Math.min(1, hsl.s * dC), Math.min(0.92, hsl.l + dL));
  return c;
}
function roleColors(CC, id) {
  const slot = (arr, salt) => arr[CC.stableHash(PALETTE.id + ':' + salt + ':' + id) % arr.length];
  const stone = slot(PALETTE.walls, 'wall');
  let second = slot(PALETTE.walls, 'wall2'); if (second === stone) second = PALETTE.walls[(PALETTE.walls.indexOf(stone) + 3) % PALETTE.walls.length];
  return { stone: lift(stone), second: lift(second, 1.05, 0.06), upper: lift(slot(PALETTE.roofs, 'roof')), accent: lift('#f1c85b', 1.2, 0.02), glass: new THREE.Color(slot(PALETTE.windows, 'window')) };
}
/* Donor-Hex → Rolle. Unbekannte Farben bleiben (und werden gemeldet). */
const DOM_ROLES = { 0x7c7770: 'stone', 0x9b958b: 'second', 0x57534e: 'upper', 0xd0aa56: 'accent', 0x3f6275: 'glass' };
function recolor(root, roles, map, report) {
  const done = new Map();
  root.traverse((o) => {
    if (!o.isMesh) return;
    const m = o.material; if (!m || !m.color) return;
    if (!done.has(m)) {
      const role = roles(m);
      const n = m.clone();
      if (role && map[role]) { n.color.copy(map[role]); if (role === 'glass' && n.emissive) n.emissive.copy(map.glass).multiplyScalar(0.35); }
      else report.unmapped.add('#' + m.color.getHexString());
      if (role) report.roles[role] = (report.roles[role] || 0) + 1;
      done.set(m, n);
    }
    o.material = done.get(m);
  });
}

/* ---------- Geometrie ---------- */
function tessellateY(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    const g = o.geometry, p = g.parameters || {};
    const seg = (h) => Math.max(2, Math.ceil(h / 1.5));
    let n = null;
    if (g.type === 'BoxGeometry' && p.height > 3) n = new THREE.BoxGeometry(p.width, p.height, p.depth, 1, seg(p.height), 1);
    else if (g.type === 'ConeGeometry' && p.height > 3) n = new THREE.ConeGeometry(p.radius, p.height, p.radialSegments, seg(p.height), p.openEnded);
    else if (g.type === 'CylinderGeometry' && p.height > 3) n = new THREE.CylinderGeometry(p.radiusTop, p.radiusBottom, p.height, p.radialSegments, seg(p.height), p.openEnded, p.thetaStart, p.thetaLength);
    if (n) { g.dispose(); o.geometry = n; }
    o.geometry.userData.base = o.geometry.attributes.position.array.slice();
  });
}
/* deform(v in root-lokal) → v' ; Meshes irgendwo unter root */
function deformUnder(root, fn) {
  root.updateMatrixWorld(true);
  const inv = root.matrixWorld.clone().invert(), v = new THREE.Vector3();
  root.traverse((m) => {
    if (!m.isMesh || !m.geometry.userData.base) return;
    const M = inv.clone().multiply(m.matrixWorld), Mi = M.clone().invert(), base = m.geometry.userData.base, pos = m.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) { v.fromArray(base, i * 3).applyMatrix4(M); const q = fn(v); v.set(q.x, q.y, q.z).applyMatrix4(Mi); pos.setXYZ(i, v.x, v.y, v.z); }
    pos.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingBox(); m.geometry.computeBoundingSphere();
  });
}
function topOf(root) { root.updateMatrixWorld(true); const inv = root.matrixWorld.clone().invert(), b = new THREE.Box3(); root.traverse((m) => { if (m.isMesh && m.visible) { m.geometry.computeBoundingBox(); b.union(m.geometry.boundingBox.clone().applyMatrix4(inv.clone().multiply(m.matrixWorld))); } }); return b; }
/* Elastic-Clay-Körper: P wie elasticParams(), aber mit gesetzten (nicht gewürfelten) Stärken */
function clayBody(EG, H, k) {
  const P = { c: { x: 0, z: 0 }, h: H, belly: k.belly, taper: k.taper, twist: k.twistDeg * Math.PI / 180, leanX: k.leanX || 0, leanZ: k.leanZ || 0, bendX: k.bendX || 0, bendZ: k.bendZ || 0, blockX: 0, blockZ: 0, slopeX: 0, slopeZ: 0 };
  return (v) => { const t = Math.max(0, Math.min(1, v.y / H)); const q = EG.deformElasticXZ({ x: v.x, z: v.z }, t, P); return { x: q.x, y: v.y, z: q.z }; };
}

export function overrideEntry(zone, which) {
  if (which === 'hbf') {
    const H = zone.hbf;
    return {
      id: 'cologne-hbf-v0', cityOrCorridorId: zone.id, osm: { type: 'node', id: Number(H.id.split('/')[1]) },
      asset: { repo: 'georg-doc/kayfabizarro', path: 'tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-landmarks.v1.js#buildGeniusLoci→hauptbahnhof', sourceCommit: 'c049cae386e1', kind: 'authored low-poly module (no GLB)' },
      placement: { originPolicy: 'osm-node-anchor', yawDeg: H.axisDeg, yawSource: H.axisSource, scale: 1, yOffsetM: 0, dxM: 0, dzM: 0 },
      style: { palette: PALETTE.id, clay: 'belly 0.025 · taper 0.02 · twist 0.5° (long body: small factors, large absolute bulge)' },
      baseBuilding: { policy: 'hide-only-after-asset-loaded-and-validated', rule: 'OSM parts (train_station/roof/transportation) with ≥ 30 % of their AREA under the hall rectangle (2 m sampling)', state: 'shown' }
    };
  }
  const L = zone.landmark;
  return {
    id: 'cologne-cathedral-v0', cityOrCorridorId: zone.id, osm: { type: 'way', id: Number(L.id.split('/')[1]) },
    asset: { repo: 'georg-doc/kayfabizarro', path: 'tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-world.v1.js#buildDom', sourceCommit: 'c049cae386e1', kind: 'authored low-poly module (no GLB)' },
    placement: { originPolicy: 'osm-footprint-centroid', yawDeg: L.axisDeg, scale: 1, yOffsetM: 0, dxM: 0, dzM: 0 },
    style: { palette: PALETTE.id, clay: 'body belly 0.035 · twist 1.5°' },
    elastic: { family: 'LandmarkElastic', bendXGrotesque: 1, torsionXGrotesque: 1.2 },
    baseBuilding: { policy: 'hide-only-after-asset-loaded-and-validated', state: 'shown' }
  };
}

function towerParams(side, bend, torsion, G) {
  return { bendX: side * G.bend * 0.55 * bend, bendZ: G.bend * 0.45 * bend, leanX: side * G.lean * 0.25 * bend, leanZ: 0, taper: 0.08, twist: side * G.twistDeg * torsion * Math.PI / 180, stackOffsets: [{ x: 0, z: 0 }] };
}

/* ---------- Dom ---------- */
export function makeLandmark({ WORLD, CC, EG, style, elastic = true, kfb = true, bend = 1, torsion = 1.2, id = 'cologne-cathedral-v0' }) {
  const built = WORLD.buildDom(THREE, { x: 0, z: 0 });
  const donorRoot = built.group;
  const holder = new THREE.Group(); holder.name = 'landmark:' + id; holder.add(donorRoot);
  donorRoot.position.set(0, 0, 0);
  donorRoot.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const report = { roles: {}, unmapped: new Set(), removed: [] };
  const G = style.cartoonMassing.presets.grotesque;
  const inner = built.body.parent;                       // Gruppe mit Faktor 1,873 (Donor-Einheiten)
  let H = 0, bodyH = 0;
  if (kfb) {
    /* Fundament weg UND alles um seine Höhe (1 u) absenken — sonst schwebten Schiff, Strebepfeiler und
       Türme 1,87 m über dem Boden (Georg 24.09. „ground level für alles“) */
    const f = built.body.getObjectByName('foundation'); if (f) { f.visible = false; inner.position.y -= 1 * built.measured.scale; report.removed.push('foundation 44 × 1 × 64 u (landmark lowered ' + built.measured.scale.toFixed(2) + ' m)'); }
    recolor(inner, (m) => DOM_ROLES[m.color.getHex()], roleColors(CC, id), report);
    tessellateY(built.body);
    bodyH = topOf(built.body).max.y;                     // in Donor-Einheiten (inner-lokal)
    deformUnder(built.body, (() => { const f2 = clayBody(EG, bodyH, { belly: 0.035, taper: 0.02, twistDeg: 1.5 }); const inv = inner.matrixWorld.clone().invert(); return f2; })());
  }
  if (elastic) {
    built.towers.forEach(tessellateY);
    const t0 = built.towers[0]; t0.updateMatrix();
    for (const m of t0.children) if (m.isMesh) { m.updateMatrix(); const a = m.geometry.userData.base, v = new THREE.Vector3(); for (let i = 0; i < a.length; i += 3) { v.fromArray(a, i).applyMatrix4(m.matrix); H = Math.max(H, v.y); } }
  }
  const deformTower = (tw, p) => {
    const bounds = { minY: 0, h: H, cx: 0, cz: 0 }, v = new THREE.Vector3();
    for (const m of tw.children) {
      if (!m.isMesh) continue; m.updateMatrix();
      const inv = m.matrix.clone().invert(), base = m.geometry.userData.base, pos = m.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) { v.fromArray(base, i * 3).applyMatrix4(m.matrix); const q = CC.deformPoint({ x: v.x, y: v.y, z: v.z }, bounds, p); v.set(q.x, q.y, q.z).applyMatrix4(inv); pos.setXYZ(i, v.x, v.y, v.z); }
      pos.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingBox(); m.geometry.computeBoundingSphere();
    }
  };
  const L = {
    kind: 'dom', holder, built, towers: built.towers, towerTopU: H, measured: built.measured, bend, torsion, style: report,
    setElastic(b, t) { if (!elastic) return; L.bend = b; L.torsion = t; built.towers.forEach((tw, i) => deformTower(tw, towerParams(i === 0 ? -1 : 1, b, t, G))); },
    update(t, wind) { if (wind) built.update(t, wind); else built.towers.forEach((tw) => tw.rotation.set(0, 0, 0)); },
    tipOffsetM() { const p = towerParams(1, L.bend, L.torsion, G); return +(Math.hypot((p.bendX + p.leanX) * H, (p.bendZ + p.leanZ) * H) * built.measured.scale).toFixed(1); },
    bodyBoxW() { return new THREE.Box3().setFromObject(built.body); }
  };
  if (elastic) L.setElastic(bend, torsion);
  return L;
}

/* ---------- Hauptbahnhof ---------- */
export function makeHbf({ LM, CC, EG, zone, kfb = true, id = 'cologne-hbf-v0' }) {
  const hs = zone.heroes, a = (k) => ({ x: hs[k].x, z: hs[k].z, osm: hs[k].id, name: hs[k].name });
  const GL = LM.buildGeniusLoci(THREE, { hohenzollern: a('hohenzollernBridge'), deutzer: a('deutzerBridge'), hbf: a('hbf'), museumLudwig: a('museumLudwig'), philharmonie: a('philharmonie') }, null);
  const src = GL.group.children.find((g) => g.name === 'genius-loci:hauptbahnhof');
  if (!src) throw new Error('buildGeniusLoci returned no hauptbahnhof');
  const hall = src.children[0];                          // der Donor-Modul-Group (Holder dreht nur)
  src.remove(hall); GL.group.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); } });
  const holder = new THREE.Group(); holder.name = 'landmark:' + id; holder.add(hall);
  hall.position.set(0, 0, 0); hall.rotation.set(0, 0, 0);
  hall.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const report = { roles: {}, unmapped: new Set(), removed: [] };
  if (kfb) {
    const plinth = hall.getObjectByName('plinth');
    if (plinth) { plinth.visible = false; report.removed.push('plinth 255 × 5 × 64 m (hall lowered 5 m)'); for (const c of hall.children) if (c !== plinth) c.position.y -= 5; }
    /* Stirnwände weg (Georg 24.09.): der Donor setzt zwei massive 2 × 19 × 58-m-Kästen an die Hallenenden —
       nach der x/z-Anpassung an die OSM-Dächer standen sie als orange Scheiben vor und hinter der Halle. */
    let gables = 0; for (const o of hall.children) if (o.name === 'gable') { o.visible = false; gables++; }
    /* untere Hälfte der Glas-Tonne liegt komplett unter Terrain (Donor: Mitte auf Plinthenhöhe) — weg */
    for (const o of hall.children) if (o.isMesh && o.material && o.material.transparent) { o.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(o); if (bb.max.y <= 0.5) { o.visible = false; report.removed.push('glass lower half (below ground)'); } }
    if (gables) report.removed.push(gables + ' × gable (end walls)');
    const C = roleColors(CC, id);
    recolor(hall, (m) => (m.transparent ? 'glass' : m.color.getHex() === 0x6e5a52 ? 'upper' : 'stone'), C, report);
    for (const o of hall.children) if (o.isMesh && o.material.transparent) { o.material.opacity = 0.8; o.material.depthWrite = false; o.renderOrder = 3; }
    tessellateY(hall);
    const H = topOf(hall).max.y;
    deformUnder(hall, clayBody(EG, H, { belly: 0.025, taper: 0.02, twistDeg: 0.5 }));
  }
  const L = { kind: 'hbf', holder, hall, style: report, update() {}, bodyBoxW: () => new THREE.Box3().setFromObject(hall), sizeU: new THREE.Box3().setFromObject(hall).getSize(new THREE.Vector3()) };
  return L;
}

/* ---------- Validierung (vor dem Ausblenden der OSM-Basis) ---------- */
export function validatePlacement(L, zone, entry) {
  const bb = L.bodyBoxW(), c = bb.getCenter(new THREE.Vector3());
  const ref = L.kind === 'hbf' ? (L.fitCenter || { x: zone.hbf.anchor.x, z: -zone.hbf.anchor.z }) : zone.landmark.centroid;
  const axis = L.kind === 'hbf' ? zone.hbf.axisDeg : zone.landmark.axisDeg;
  const d = Math.hypot(c.x - ref.x, c.z - ref.z);
  const yawDeg = THREE.MathUtils.radToDeg(L.holder.rotation.y);
  const axisErr = Math.abs(((yawDeg - axis) % 180 + 270) % 180 - 90);
  const ok = d <= 12 && axisErr <= 5;
  const out = { ok, centroidOffsetM: +d.toFixed(1), axisErrDeg: +axisErr.toFixed(2) };
  if (L.kind === 'dom') {
    const s = L.measured.scale * L.holder.scale.x, donorLong = 64 * s, donorWide = 44 * s, [osmLong, osmWide] = zone.landmark.extentM;
    out.extent = { donorLongM: +donorLong.toFixed(1), osmLongM: osmLong, longRatio: +(donorLong / osmLong).toFixed(2), donorWideM: +donorWide.toFixed(1), osmWideM: osmWide };
    out.note = 'Long axis ' + Math.round((1 - donorLong / osmLong) * 100) + ' % short — donor-owned open item.';
  } else out.note = 'fitted to the OSM hall roofs (x/z scale, 24 m barrel kept) · axis = railway PCA (CLAUDE_CONTEXT.hbfRailways)';
  return out;
}

/* OSM-Teile unter der Hbf-Halle: FLÄCHEN-Überdeckung statt Eckenzählung (Verifier: die echten
   Bahnsteigdächer ragen weit über das Donor-Rechteck hinaus, Eckenanteil max. 0,20). Jede
   train_station/roof/transportation-Fläche wird im 2-m-Raster abgetastet; ≥ 30 % ihrer Fläche unter der
   Halle → Basis (wird nach Validierung ausgeblendet). Was außerhalb bleibt, ist echte OSM-Geometrie. */
export function hbfBaseIds(zone, L, minFrac = 0.3) {
  const h = L.holder; h.updateMatrixWorld(true);
  const inv = h.matrixWorld.clone().invert(), s = L.sizeU, v = new THREE.Vector3(), out = [];
  const KIND = new Set(['train_station', 'roof', 'transportation']);
  const inPoly = (x, z, r) => { let ins = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const xi = r[i].x, zi = r[i].z, xj = r[j].x, zj = r[j].z; if (((zi > z) !== (zj > z)) && (x < (xj - xi) * (z - zi) / (zj - zi) + xi)) ins = !ins; } return ins; };
  for (const b of zone.buildings) {
    if (!KIND.has(b.kind)) continue;
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity; for (const p of b.fp) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); z0 = Math.min(z0, p.z); z1 = Math.max(z1, p.z); }
    const st = Math.max(1, Math.min(2, (x1 - x0) / 6, (z1 - z0) / 6));
    let n = 0, k = 0;
    for (let x = x0 + st / 2; x < x1; x += st) for (let z = z0 + st / 2; z < z1; z += st) {
      if (!inPoly(x, z, b.fp)) continue; n++;
      v.set(x, 0, z).applyMatrix4(inv); if (Math.abs(v.x) <= s.x / 2 && Math.abs(v.z) <= s.z / 2) k++;
    }
    const frac = n ? k / n : 0;
    if (frac > 0) out.push({ id: b.id, kind: b.kind, frac: +frac.toFixed(2), hidden: frac >= minFrac });
  }
  out.sort((p, q) => q.frac - p.frac);
  const ids = out.filter((p) => p.hidden).map((p) => p.id);
  ids.detail = out;
  return ids;
}

/* Hbf an die OSM-Hallendächer anpassen (OSM besitzt WO): Pass 1 findet die Dächer, die die Donor-Halle
   überdeckt; deren Hüllrechteck im Hallen-Achsrahmen setzt Mitte und Länge/Breite. Die Halle wird in
   x/z auf diese Hülle skaliert (Höhe bleibt 24 m Tonnendach laut Donor), Pass 2 bestimmt die Basis neu. */
export function fitHbfToEnvelope(zone, L) {
  const ids0 = hbfBaseIds(zone, L);
  if (!ids0.length) return null;
  const h = L.holder; h.updateMatrixWorld(true);
  const inv = h.matrixWorld.clone().invert(), v = new THREE.Vector3();
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (const b of zone.buildings) if (ids0.includes(b.id)) for (const p of b.fp) { v.set(p.x, 0, p.z).applyMatrix4(inv); x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); z0 = Math.min(z0, v.z); z1 = Math.max(z1, v.z); }
  const s0 = L.sizeU.clone(), sx = (x1 - x0) / s0.x, sz = (z1 - z0) / s0.z;
  L.hall.scale.set(sx, 1, sz);
  L.sizeU = new THREE.Vector3(x1 - x0, s0.y, z1 - z0);
  const c = new THREE.Vector3((x0 + x1) / 2, 0, (z0 + z1) / 2).applyMatrix4(h.matrixWorld);
  return { center: { x: c.x, z: c.z }, sx: +sx.toFixed(3), sz: +sz.toFixed(3), lengthM: +(x1 - x0).toFixed(1), widthM: +(z1 - z0).toFixed(1), parts: ids0 };
}
