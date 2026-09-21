/* pet-nose.v2.js — Pet Studio v12-S7 (10.09.2026). FORK von `pet-nose.v1.js`; v1 bleibt daneben und ist
   der Rückweg. EINE Änderung, von Georg bestellt (10.09.): »die nase sollte noch mehr richtung runder
   knollen-form verformt werden.«

   v1 war die Extrusion eines abgerundeten Rechtecks mit Fase — die Kopfform zitiert, aber im Profil ein
   Brett. v2 baut denselben Körper als SUPERELLIPSOID: ein Regler, ein Formkontinuum, keine zwei
   Geometriewege. Die Einheitskugel wird radial auf |x|ⁿ + |y|ⁿ + |z|ⁿ = 1 abgebildet:
       `bulb` 1 → n = 2  → runde Knolle (Georgs Ziel)
       `bulb` 0 → n = 8  → abgerundeter Quader, also fast die Silhouette von v1
   Dazu `droop` — die Knolle ist unten schwerer und zieht nach vorn (Kartoffel statt Kugel): die untere
   Hälfte wird um bis zu 30 % geweitet, die Spitze bis 12 % vorgezogen, die Mitte 6 % gesenkt.
   Proportionen ebenfalls runder: v1 war 1,6 × 1,0 × 0,9 R (breit und flach), v2 ist 1,35 × 1,15 × 1,30 R
   — sie steht damit weiter aus dem Gesicht heraus als sie breit ist.

   Unverändert übernommen: Anker `rig.eyeFrame()` (left/right/radius/parent/gen), `sync()` mit gen-Zähler,
   Tiefe per Strahl auf die Kopffläche (Referenz statt Schätzung), Glanzregler auf Rauheit + Clearcoat,
   `petOverlay` + `noMeasure` am Netz, Fehlervertrag (fehlender Anker = Zustand, kein Absturz).
   `radius` (v1: Eckenrundung) wird noch ANGENOMMEN, damit gespeicherte Pets nicht abgewiesen werden,
   aber nicht mehr gelesen — die Rundung ist jetzt `bulb`. */

export const DEFAULTS = Object.freeze({ enabled: true, size: 0.9, height: 0.55, depth: 0.10, x: 0, bulb: 0.85, droop: 0.45, gloss: 0.55, color: '#e96049' });
/* height 0,55 R (nicht 0,75): gemessen am Hasen liegt der Mund bei dy −0,60 — bei 0,75 saß die Nase AUF dem Mund. */

const LEGACY = ['radius'];   // v1-Feld, angenommen und übergangen

export function validate(patch) {
  const limits = { size: [0.2, 2.5], height: [-1, 3], depth: [-1, 1], x: [-1, 1], bulb: [0, 1], droop: [0, 1], gloss: [0, 1], radius: [0, 0.5] };
  for (const [k, v] of Object.entries(patch)) {
    if (!(k in DEFAULTS) && !LEGACY.includes(k)) return { status: 'UNSUPPORTED', field: k, reason: 'Unknown nose field' };
    if (limits[k] && (!Number.isFinite(v) || v < limits[k][0] || v > limits[k][1])) return { status: 'UNSUPPORTED', field: k, reason: 'Out of range' };
    if (k === 'enabled' && typeof v !== 'boolean') return { status: 'UNSUPPORTED', field: k, reason: 'Expected boolean' };
    if (k === 'color' && !/^#[0-9a-f]{6}$/i.test(v)) return { status: 'UNSUPPORTED', field: k, reason: 'Expected #RRGGBB' };
  }
  return { status: 'OK' };
}

/* Knolle: Superellipsoid der Ausmaße w × h × d, radial aus einer Einheitskugel gebildet (kein Naht-Sonderfall),
   danach die Kartoffel-Verformung `droop`. Mitte auf 0,0,0 — die Lage setzt das Rig. */
function knollen(T, w, h, d, bulb, droop) {
  const g = new T.SphereGeometry(0.5, 48, 32);
  const n = 2 + (1 - Math.max(0, Math.min(1, bulb))) * 6;
  const pos = g.attributes.position, v = new T.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).multiplyScalar(2);            // Einheitsrichtung (Länge 1)
    const q = Math.pow(Math.pow(Math.abs(v.x), n) + Math.pow(Math.abs(v.y), n) + Math.pow(Math.abs(v.z), n), 1 / n);
    v.multiplyScalar(0.5 / Math.max(1e-6, q));                  // Halbausmaß 0,5 je Achse
    const low = Math.max(0, Math.min(1, -v.y * 2));             // 0 oben … 1 unten
    const s = 1 + droop * 0.30 * low * low;
    v.x *= s; v.z *= s * (1 + droop * 0.12 * low);
    v.y -= droop * 0.06 * low;
    pos.setXYZ(i, v.x * w, v.y * h, v.z * d);
  }
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return g;
}

export class NoseRig {
  constructor({ THREE, getEyeFrame, params = null }) {
    this.T = THREE; this.getEyeFrame = getEyeFrame;
    this.params = { ...DEFAULTS };
    if (params) for (const k of Object.keys(DEFAULTS)) if (params[k] !== undefined) this.params[k] = params[k];
    this.material = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(this.params.color), roughness: 0.5, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.2 });
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), this.material);
    this.mesh.name = 'KFB cartoon nose';
    this.mesh.userData.petOverlay = true; this.mesh.userData.noMeasure = true;
    this.mesh.castShadow = false; this.mesh.frustumCulled = false; this.mesh.raycast = () => {};
    this.gen = -1; this.last = { status: 'OK' };
    this.rebuild();
  }
  set(patch) {
    const check = validate(patch); if (check.status !== 'OK') return check;
    for (const [k, v] of Object.entries(patch)) if (k in DEFAULTS) this.params[k] = v;
    this.rebuild(); return check;
  }
  sync() {
    const f = this.getEyeFrame();
    if (!f) { if (this.mesh.visible) { this.mesh.visible = false; this.last = { status: 'UNSUPPORTED', field: 'anchor', reason: 'eye-frame anchor missing' }; } return this.last; }
    if (f.gen !== this.gen || f.parent !== this.mesh.parent) this.rebuild();
    return this.last;
  }
  rebuild() {
    const T = this.T, p = this.params, f = this.getEyeFrame();
    if (!f || !f.left || !f.right || !(f.radius > 0) || !f.parent) { this.mesh.visible = false; this.last = { status: 'UNSUPPORTED', field: 'anchor', reason: 'eye-frame anchor missing' }; return this.last; }
    if (f.parent !== this.mesh.parent) { this.mesh.removeFromParent(); f.parent.add(this.mesh); }
    this.gen = f.gen;
    const R = f.radius, host = f.parent;
    const cx = (f.left.x + f.right.x) / 2 + p.x * R, cy = (f.left.y + f.right.y) / 2 - p.height * R;
    /* Tiefe von der KOPFFLÄCHE, nicht geraten: Strahl von weit vorn (lokal +z) auf den Elternknoten;
       Rückweg = Augen-z, wenn nichts getroffen wird. */
    let z = (f.left.z + f.right.z) / 2;
    const ray = new T.Raycaster(); ray.layers.enableAll();
    const oW = host.localToWorld(new T.Vector3(cx, cy, R * 12));
    const dW = new T.Vector3(0, 0, -1).transformDirection(host.matrixWorld).normalize();
    ray.set(oW, dW);
    const hit = ray.intersectObject(host, false)[0];
    if (hit) z = host.worldToLocal(hit.point.clone()).z;
    const w = p.size * 1.35 * R, h = p.size * 1.15 * R, d = p.size * 1.30 * R;
    this.mesh.geometry.dispose();
    this.mesh.geometry = knollen(T, w, h, d, p.bulb, p.droop);
    this.mesh.position.set(cx, cy, z + d / 2 - p.depth * R);
    this.material.color.set(p.color);
    this.material.roughness = 0.75 - 0.6 * p.gloss;
    this.material.clearcoat = 0.15 + 0.85 * p.gloss;
    this.material.clearcoatRoughness = 0.5 - 0.45 * p.gloss;
    this.material.needsUpdate = true;
    this.mesh.visible = p.enabled;
    this.frame = { center: [cx, cy, this.mesh.position.z], size: [w, h, d], exponent: 2 + (1 - p.bulb) * 6, skinZ: z, hit: !!hit, gen: f.gen };
    this.last = { status: 'OK' };
    return this.last;
  }
  export() { return { schema: 'kfb.nose/0.2', ...this.params }; }
  dispose() { this.mesh.removeFromParent(); this.mesh.geometry.dispose(); this.material.dispose(); }
}
