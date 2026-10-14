/**
 * facegraft.v1 · Carls Nase UND Braue auf einem fremden Kopf. Ablöser von `lab-v6/browgraft.v1.js`
 * (R10: eine neue Fassung heißt neu, damit kein Zwischenspeicher an der alten hängen bleibt).
 *
 * ⚠ WAS HIER NICHT PASSIERT, und warum: `PartRig`/`findFaceParts` (lab-v6/partrig.v1.js) findet
 * Carls Brauen/Nase über ihre LAGE IM NETZ — eine Eigenschaft von CARLS Mesh. Auf einem fremden Kopf
 * (FrizzleBob, ein Cube-Pet, der KayKit-Driver) liefert dieselbe Suche `null`. Beide Teile kommen
 * darum als SPENDER-Geometrie herüber, herausgeschnitten aus `player.gltf` und auf den Zielkopf
 * gesetzt — derselbe Gedanke wie `headgraft.v1.js` mit FrizzleBobs Kopf, dieselbe Lehre wie R18:
 * eine gemessene Form wird gegraftet, nicht angenähert.
 *
 * Der Anker ist in beiden Fällen `EyeRig.eyeFrame()`; die Nase übernimmt zusätzlich die
 * Tiefen-Abtastung (Strahl auf die Kopfoberfläche) aus `pet-nose.v2.js`, die Braue die
 * Stellformel aus `brow-rig.v2.js` — dieselben Anker wie die gezeichneten Geschwister, damit beide
 * Wege dieselbe Stelle meinen.
 *
 * EIN Drehpunkt je Teil, auf der eigenen Mitte des Teils (nicht auf dem Wirt-Ursprung) — das ist
 * dieselbe Umhängung, die `partrig.v1.js` für die Original-Insel macht, hier für die gegraftete
 * Kopie. Der Drehpunkt ist auch der Ort für `actor-wobble.v1`: »jedes Rig ist ein Schauspieler«
 * (Georg, 13.09. spät) — eine Nase, die dem Kopf mit Verzögerung folgt, statt starr zu sitzen.
 * Default AN für die Nase (das Beispiel war ausdrücklich »wippende Capsule-Carl-Nase«), AUS für
 * die Braue (eine Braue, die am Kopf klebt, wackelt normalerweise nicht mit).
 */
import { splitIslands } from '../lab-v4/carlrig.js';
import { findFaceParts } from './partrig.v1.js';
import { probeSkin } from '../petstudio-v9/studio-v12/brow-rig.v2.js';
import { auditModel } from '../lab-v2/audit.js';
import { Wobble } from '../frizzlegraft-v1/actor-wobble.v1.js';

export const SCHEMA_BROW = 'kfb.browgraft/1';
export const SCHEMA_NOSE = 'kfb.nosegraft/1';

/* Gemessen, aus `LIVING_RIGGING.md` (»Zahlen, die gelten« + R16/R18/R21). Diese drei Werte sind
   Messungen dieser Linie, keine Schätzungen — und sie gelten nur für DIESEN Spender. */
export const DONOR_CARL = Object.freeze({
  path: 'KayKit_Mystery_Series6/CapsuleCarl/gltf/player.gltf',
  eyeAnchor: { y: 1.317, ring: 0.13 },
  hullR: 0.5,
  expectBrow: { islands: [7, 8], size: [0.3, 0.166, 0.235], pairWidth: 0.744 },
  expectNose: { island: 6, size: [0.131, 0.151, 0.334], centre: [0, 1.3, 0.622] },
});

/* Farbe aus der Bildtafel GELESEN, über die DREIECKSMITTEN (nicht die Eckpunkte — die liegen auf
   UV-Nähten und treffen im Atlas die Nachbarzelle). Nur der Startwert der Farbwahl: gerendert wird
   die Original-Bildtafel des Spenders, siehe `browgraft.v1`s Notiz zum Widerspruch mit R16. */
function sampleIslandColour(geo, map) {
  const img = map && (map.image || null);
  if (!img || !img.width) return null;
  const uv = geo.getAttribute('uv'), idx = geo.index && geo.index.array;
  if (!uv || !idx) return null;
  const cv = document.createElement('canvas');
  cv.width = img.width; cv.height = img.height;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  try { cx.drawImage(img, 0, 0); } catch (e) { return null; }
  const R = [], G = [], B = [];
  for (let t = 0; t < idx.length; t += 3) {
    let u = 0, v = 0;
    for (let k = 0; k < 3; k++) { u += uv.getX(idx[t + k]); v += uv.getY(idx[t + k]); }
    u /= 3; v /= 3;
    const px = Math.min(img.width - 1, Math.max(0, Math.round(u * img.width)));
    const py = Math.min(img.height - 1, Math.max(0, Math.round((1 - v) * img.height)));
    let d; try { d = cx.getImageData(px, py, 1, 1).data; } catch (e) { return null; }
    if (d[3] < 8) continue;
    R.push(d[0]); G.push(d[1]); B.push(d[2]);
  }
  if (!R.length) return null;
  const med = (a) => { a.sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };
  const hex = (n) => n.toString(16).padStart(2, '0');
  return '#' + hex(med(R)) + hex(med(G)) + hex(med(B));
}

function cutIsland(THREE, mesh, islandIdx) {
  const geo = mesh.geometry.clone();
  geo.computeBoundingBox();
  const centre = geo.boundingBox.getCenter(new THREE.Vector3());
  const size = geo.boundingBox.getSize(new THREE.Vector3());
  geo.translate(-centre.x, -centre.y, -centre.z);
  geo.computeVertexNormals();
  return { island: islandIdx, geo, centre, size, sign: centre.x < 0 ? -1 : 1 };
}

/**
 * Spender EINMAL laden, Braue UND Nase in einem Zug herausschneiden (ein Fetch, zwei Teile —
 * vorher zwei getrennte Ladewege in Browgraft/Nosegraft hätten den Spender zweimal geholt).
 * Gibt `{ ok, brow, nose, report }` zurück; `brow`/`nose` sind `null`, wenn der Spender die Insel
 * nicht hat (kein erfundener Ersatz, wie in `LIVING_RIGGING.md` unter »Offen« verlangt).
 */
export async function loadDonorFace({ THREE, loader, url, donor = DONOR_CARL }) {
  const res = await auditModel({ THREE, loader, url, label: 'CapsuleCarl (donor)', path: donor.path, log: () => {} });
  if (res.status === 'LOAD_FAILED') return { ok: false, report: { status: 'LOAD_FAILED', error: res.error, url } };
  const src = (res.meshes || [])[0];
  if (!src) return { ok: false, report: { status: 'NO_MESH', url } };
  const parts = splitIslands({ THREE, mesh: src });
  if (!parts) return { ok: false, report: { status: 'NO_ISLANDS', url } };
  const found = findFaceParts({ THREE, parts, eyeAnchor: donor.eyeAnchor, hullR: donor.hullR });
  const map = (src.material && src.material.map) || null;
  const material = src.material || null;

  let brow = null;
  if (found.brows.length) {
    const items = found.brows.map((i) => cutIsland(THREE, parts[i].mesh, i));
    let minX = Infinity, maxX = -Infinity;
    items.forEach((it) => { minX = Math.min(minX, it.centre.x - it.size.x / 2); maxX = Math.max(maxX, it.centre.x + it.size.x / 2); });
    const pairWidth = maxX - minX;
    const colour = sampleIslandColour(items[0].geo, map);
    const sz = items[0].size.toArray().map((v) => +v.toFixed(3));
    const exp = donor.expectBrow;
    const matches = exp ? sz.every((v, k) => Math.abs(v - exp.size[k]) < 0.02) : null;
    brow = { items, pairWidth, colour, map, material,
      report: { status: 'OK', url, islands: items.map((i) => i.island + 1), size: sz,
        pairWidth: +pairWidth.toFixed(3), colour, expected: exp || null, matchesExpected: matches,
        note: matches === false ? 'measured size differs from the pinned measurement — check the source revision' : '' } };
  }

  let nose = null;
  if (found.nose != null) {
    const it = cutIsland(THREE, parts[found.nose].mesh, found.nose);
    const colour = sampleIslandColour(it.geo, map);
    const sz = it.size.toArray().map((v) => +v.toFixed(3));
    const exp = donor.expectNose;
    const matches = exp ? sz.every((v, k) => Math.abs(v - exp.size[k]) < 0.02) : null;
    nose = { item: it, colour, map, material,
      report: { status: 'OK', url, island: it.island + 1, size: sz, colour, expected: exp || null,
        matchesExpected: matches,
        note: matches === false ? 'measured size differs from the pinned measurement — check the source revision' : '' } };
  }

  return { ok: !!(brow || nose), brow, nose,
    report: { status: (brow || nose) ? 'OK' : 'NO_PARTS', brow: brow && brow.report, nose: nose && nose.report } };
}

/* Ein Drehpunkt je Netz-Kopie, gemeinsam für Braue (Paar) und Nase (einzeln): eigene Material-
   Kopie (Original im Zwischenspeicher bleibt unberührt), petOverlay für `probeSkin`, Kind eines
   Pivots auf der eigenen Mitte des Teils — dasselbe Vorgehen wie `partrig.v1.js`. */
function makePivotMesh(THREE, donorItem, material) {
  const mat = material ? material.clone() : new THREE.MeshStandardMaterial({ color: 0x8c4c39, roughness: 0.9 });
  const mesh = new THREE.Mesh(donorItem.geo, mat);
  mesh.userData.petOverlay = true; mesh.raycast = () => {}; mesh.frustumCulled = false;
  mesh.renderOrder = 4;
  const pivot = new THREE.Group();
  pivot.add(mesh);
  return { pivot, mesh, donor: donorItem };
}

function paintMesh(THREE, mesh, donorColour, donorMap, overrideColor) {
  if (overrideColor) { mesh.material.map = null; mesh.material.color.set(overrideColor); }
  else if (donorMap) { mesh.material.map = donorMap; mesh.material.color.set(0xffffff); }
  else if (donorColour) { mesh.material.map = null; mesh.material.color.set(donorColour); }
  mesh.material.needsUpdate = true;
}

export const BROW_DEFAULTS = Object.freeze({ enabled: false, length: 0.6, height: 0.3, x: 0, y: 0,
  scale: 1, spread: 0, depth: 0, tilt: 0, follow: 0.8, wobble: 0, color: null });
export const BROW_META = [
  ['length', 'Width', 0, 1, 0.01], ['height', 'Height', 0, 1, 0.01], ['scale', 'Size', 0.4, 2.2, 0.01],
  ['spread', 'Spacing', -0.5, 0.5, 0.01], ['y', 'Lift', -1, 1, 0.01], ['depth', 'Depth', -0.12, 0.2, 0.004],
  ['tilt', 'Tilt', -25, 25, 1], ['wobble', 'Wobble', 0, 1, 0.05],
];

export class BrowGraft {
  constructor({ THREE, donor, getEyeFrame, parent = null, params = null }) {
    this.T = THREE; this.donor = donor; this.getEyeFrame = getEyeFrame;
    this.params = { ...BROW_DEFAULTS, ...(params || {}) };
    this.group = new THREE.Group(); this.group.name = 'browgraft'; this.group.userData.petOverlay = true;
    this.parts = (donor && donor.items ? donor.items : []).map((it) => {
      const pm = makePivotMesh(THREE, it, donor.material);
      this.group.add(pm.pivot);
      pm.wobble = new Wobble({ THREE, gainX: 0.16, gainZ: 0.16 });
      return pm;
    });
    this.gen = -1; this.last = { status: 'OK' };
    if (parent) parent.add(this.group);
    this.rebuild();
  }
  get found() { return this.parts.length; }
  measured() { return this.donor && this.donor.report ? this.donor.report : null; }
  set(patch) {
    for (const [k, v] of Object.entries(patch || {})) {
      if (!(k in BROW_DEFAULTS)) return { status: 'UNSUPPORTED', field: k, reason: 'unknown' };
      if (k !== 'enabled' && k !== 'color' && !Number.isFinite(v)) return { status: 'UNSUPPORTED', field: k, reason: 'not a number' };
    }
    Object.assign(this.params, patch);
    if ('color' in (patch || {})) this._paint();
    this.rebuild();
    return { status: 'OK' };
  }
  reset() { this.params = { ...BROW_DEFAULTS, enabled: this.params.enabled }; this._paint(); this.rebuild(); return { status: 'OK' }; }
  _paint() { this.parts.forEach((pm) => paintMesh(this.T, pm.mesh, this.donor.colour, this.donor.map, this.params.color)); }
  /* `sync` läuft JEDES Bild (nicht nur bei Anker-Neubau): der Wobble braucht einen stetigen `dt`. */
  sync(dt) {
    const f = this.getEyeFrame && this.getEyeFrame();
    if (!f) { if (this.group.visible) { this.group.visible = false; this.last = { status: 'UNSUPPORTED', field: 'anchor', reason: 'eye-frame anchor missing' }; } return this.last; }
    if (f.gen !== this.gen || f.parent !== this.group.parent) this.rebuild();
    if (this.params.wobble > 0) this._tickWobble(dt);
    return this.last;
  }
  _tickWobble(dt) {
    const g = this.params.wobble;
    this.parts.forEach((pm) => {
      const q = pm.wobble.tick(dt, pm.pivot);
      pm.pivot.quaternion.copy(pm._restQ).slerp(pm.pivot.quaternion.copy(pm._restQ).multiply(q), g);
    });
  }
  rebuild() {
    const T = this.T, p = this.params, f = this.getEyeFrame && this.getEyeFrame();
    if (!f || !f.left || !f.right || !(f.radius > 0)) {
      this.group.visible = false;
      this.last = { status: 'UNSUPPORTED', field: 'anchor', reason: 'eye-frame anchor missing' };
      return this.last;
    }
    if (f.parent && f.parent !== this.group.parent) { this.group.removeFromParent(); f.parent.add(this.group); }
    this.gen = f.gen;
    this.group.visible = !!p.enabled;
    if (!p.enabled || !this.parts.length) { this.last = { status: 'OK', enabled: !!p.enabled }; return this.last; }
    this._paint();

    const cx = (f.left.x + f.right.x) / 2, cy = (f.left.y + f.right.y) / 2;
    const span = Math.abs(f.right.x - f.left.x) + f.radius * 2;
    const width = span * (0.55 + 0.75 * p.length);
    const y = cy + f.radius * (1.16 + p.height * 0.85 + p.y);
    const s = (width / Math.max(1e-6, this.donor.pairWidth)) * p.scale;

    let zL = f.left.z, zR = f.right.z;
    if (p.follow > 0) {
      const probes = [new T.Vector3(-1, 0, 0), new T.Vector3(1, 0, 0)];
      const skin = probeSkin(T, f, probes, (q) => [cx + p.x * f.radius + q.x * width / 2, y], 2);
      if (skin && skin.n >= 2) { zL = skin[0]; zR = skin[1]; }
    }

    this.parts.forEach((pm) => {
      const it = pm.donor, sx = it.sign;
      const x = cx + p.x * f.radius + s * it.centre.x + p.spread * f.radius * sx;
      const z = (sx < 0 ? zL : zR) + p.depth;
      pm.pivot.position.set(x, y, z);
      pm.pivot.scale.setScalar(s);
      pm.pivot.rotation.set(0, 0, (p.tilt * Math.PI / 180) * sx);
      pm._restQ = pm.pivot.quaternion.clone();
    });
    this.last = { status: 'OK', scale: +s.toFixed(4), width: +width.toFixed(4), y: +y.toFixed(4),
      z: [+zL.toFixed(4), +zR.toFixed(4)], donorPairWidth: +this.donor.pairWidth.toFixed(4) };
    return this.last;
  }
  export() { return { schema: SCHEMA_BROW, donor: { path: DONOR_CARL.path, ...(this.donor.report || {}) }, ...this.params }; }
  dispose() { this.group.removeFromParent(); this.parts.forEach((pm) => { pm.mesh.geometry.dispose(); pm.mesh.material.dispose(); }); }
}

/* Nase: EIN Teil, kein Spiegelpaar. Anker und Tiefen-Abtastung wörtlich aus `pet-nose.v2.js`
   übernommen (cx/cy relativ zur Augenmitte, z per Strahl auf die Kopfoberfläche) — dieselbe Stelle,
   die der GEZEICHNETE NoseRig auch träfe. Wobble AN als Vorgabe (Georgs Beispiel: »wippende
   Capsule-Carl-Nase«), mit eigenem Drehpunkt auf der Nasenmitte. */
export const NOSE_DEFAULTS = Object.freeze({ enabled: false, scale: 1, x: 0, height: 0.55, depth: 0,
  tilt: 0, wobble: 0.5, color: null });
export const NOSE_META = [
  ['scale', 'Size', 0.4, 2.2, 0.01], ['x', 'Spacing', -0.5, 0.5, 0.01], ['height', 'Height', 0, 1.2, 0.01],
  ['depth', 'Depth', -0.12, 0.3, 0.004], ['tilt', 'Tilt', -25, 25, 1], ['wobble', 'Wobble', 0, 1, 0.05],
];

export class NoseGraft {
  constructor({ THREE, donor, getEyeFrame, parent = null, params = null }) {
    this.T = THREE; this.donor = donor; this.getEyeFrame = getEyeFrame;
    this.params = { ...NOSE_DEFAULTS, ...(params || {}) };
    const pm = this.part = donor && donor.item ? makePivotMesh(THREE, donor.item, donor.material) : null;
    this.group = pm ? pm.pivot : new THREE.Group();
    this.group.name = 'nosegraft'; this.group.userData.petOverlay = true;
    if (pm) pm.wobble = new Wobble({ THREE, gainX: 0.20, gainZ: 0.14, limit: 0.35 });
    this.gen = -1; this.last = { status: 'OK' };
    if (parent && this.group.parent !== parent) parent.add(this.group);
    this.rebuild();
  }
  get found() { return this.part ? 1 : 0; }
  measured() { return this.donor && this.donor.report ? this.donor.report : null; }
  set(patch) {
    for (const [k, v] of Object.entries(patch || {})) {
      if (!(k in NOSE_DEFAULTS)) return { status: 'UNSUPPORTED', field: k, reason: 'unknown' };
      if (k !== 'enabled' && k !== 'color' && !Number.isFinite(v)) return { status: 'UNSUPPORTED', field: k, reason: 'not a number' };
    }
    Object.assign(this.params, patch);
    if ('color' in (patch || {})) this._paint();
    this.rebuild();
    return { status: 'OK' };
  }
  reset() { this.params = { ...NOSE_DEFAULTS, enabled: this.params.enabled }; this._paint(); this.rebuild(); return { status: 'OK' }; }
  _paint() { if (this.part) paintMesh(this.T, this.part.mesh, this.donor.colour, this.donor.map, this.params.color); }
  sync(dt) {
    const f = this.getEyeFrame && this.getEyeFrame();
    if (!f) { if (this.group.visible) { this.group.visible = false; this.last = { status: 'UNSUPPORTED', field: 'anchor', reason: 'eye-frame anchor missing' }; } return this.last; }
    if (f.gen !== this.gen || f.parent !== this.group.parent) this.rebuild();
    if (this.part && this.params.wobble > 0) this._tickWobble(dt);
    return this.last;
  }
  _tickWobble(dt) {
    const pm = this.part, q = pm.wobble.tick(dt, pm.pivot);
    pm.pivot.quaternion.copy(pm._restQ).slerp(pm.pivot.quaternion.copy(pm._restQ).multiply(q), this.params.wobble);
  }
  rebuild() {
    const T = this.T, p = this.params, f = this.getEyeFrame && this.getEyeFrame();
    if (!f || !f.left || !f.right || !(f.radius > 0) || !f.parent) {
      this.group.visible = false;
      this.last = { status: 'UNSUPPORTED', field: 'anchor', reason: 'eye-frame anchor missing' };
      return this.last;
    }
    if (this.group.parent !== f.parent) { this.group.removeFromParent(); f.parent.add(this.group); }
    this.gen = f.gen;
    this.group.visible = !!p.enabled;
    if (!p.enabled || !this.part) { this.last = { status: 'OK', enabled: !!p.enabled }; return this.last; }
    this._paint();

    const R = f.radius, host = f.parent;
    const cx = (f.left.x + f.right.x) / 2 + p.x * R, cy = (f.left.y + f.right.y) / 2 - p.height * R;
    let z = (f.left.z + f.right.z) / 2;
    const ray = new T.Raycaster(); ray.layers.enableAll();
    const oW = host.localToWorld(new T.Vector3(cx, cy, R * 12));
    const dW = new T.Vector3(0, 0, -1).transformDirection(host.matrixWorld).normalize();
    ray.set(oW, dW);
    const hit = ray.intersectObject(host, false).filter((o) => !(o.object.userData && o.object.userData.petOverlay))[0];
    if (hit) z = host.worldToLocal(hit.point.clone()).z;

    const donorH = this.donor.item.size.y || 1;
    const s = (R / donorH) * 0.85 * p.scale;
    const pm = this.part, half = this.donor.item.size.z * s / 2;
    pm.pivot.position.set(cx, cy, z + half - p.depth * R);
    pm.mesh.scale.setScalar(s);
    pm.pivot.rotation.set(0, 0, (p.tilt * Math.PI / 180));
    pm._restQ = pm.pivot.quaternion.clone();

    this.last = { status: 'OK', scale: +s.toFixed(4), centre: [+cx.toFixed(4), +cy.toFixed(4), +pm.pivot.position.z.toFixed(4)], hit: !!hit };
    return this.last;
  }
  export() { return { schema: SCHEMA_NOSE, donor: { path: DONOR_CARL.path, ...(this.donor.report || {}) }, ...this.params }; }
  dispose() { if (this.part) { this.group.removeFromParent(); this.part.mesh.geometry.dispose(); this.part.mesh.material.dispose(); } }
}
