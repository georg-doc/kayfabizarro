/**
 * partrig.v1 · Eine ORIGINAL-Insel des Modells riggen, statt sie nachzubauen.
 *
 * Georg, 13.09.: »du hast die block augenbrauen aus tubes gebaut, statt die original-augenbrauen zu
 * verwenden.« Richtig, und der Fehler war grundsätzlich: `browblock.v1` hat die gemessene Braue in
 * Regler zurückgerechnet und daraus einen SCHLAUCH gebaut — 774 Eckpunkte Annäherung an eine Form,
 * die im Netz schon liegt. Facettiert, mit offener Kante an der Maske. Die Messung war richtig, die
 * Schlussfolgerung falsch.
 *
 * Hier wird die Insel selbst zum Rig: sichtbar schalten, um ihre EIGENE Mitte skalieren, verschieben,
 * kippen. Keine Annäherung, kein Materialwechsel, und die Quelldatei bleibt unberührt.
 *
 * Der Dreh, auf den es ankommt: eine Insel steht in Körperkoordinaten, ihr Drehpunkt ist der
 * Ursprung des Körpers. Skalieren würde sie also vom Bauchnabel wegziehen. Darum wird sie EINMAL in
 * eine Gruppe gehängt, die auf ihrer gemessenen Mitte sitzt, und ihr eigener Versatz ausgeglichen —
 * danach skaliert und dreht sie um sich selbst. Die Geometrie wird dabei NICHT angefasst.
 *
 * Paare werden gespiegelt bedient: `spread` und `tilt` tragen je Seite das Vorzeichen von x.
 * Das ist der Grund, warum Brauen, Nase und später der Kugel-Faust-Griff dasselbe Modul benutzen
 * können — es weiß nichts über Anatomie, nur über Inseln und Spiegelung.
 *
 *   const rig = new PartRig({ THREE, parts, islands: [6, 7], label: 'brow' });
 *   rig.set({ enabled: true, scale: 1.1, lift: 0.02, spread: 0.01, tilt: 6 });
 *   rig.reset();          // zurück auf den gemessenen Originalzustand
 */
export const SCHEMA = 'kfb.partrig/1';

export const DEFAULTS = Object.freeze({ enabled: false, scale: 1, spread: 0, lift: 0, depth: 0, tilt: 0 });
export const META = [
  ['scale', 'Size', 0.4, 2.2, 0.01],
  ['spread', 'Spacing', -0.15, 0.15, 0.002],
  ['lift', 'Height', -0.2, 0.2, 0.002],
  ['depth', 'Depth', -0.1, 0.12, 0.002],
  ['tilt', 'Tilt', -25, 25, 1],
];

export class PartRig {
  constructor({ THREE, parts, islands, label = 'part' }) {
    this.T = THREE; this.label = label;
    this.params = { ...DEFAULTS };
    this.items = [];
    (islands || []).forEach((i) => {
      const p = parts[i]; if (!p) return;
      const mesh = p.mesh;
      mesh.geometry.computeBoundingBox();
      const centre = mesh.geometry.boundingBox.getCenter(new THREE.Vector3());
      const size = mesh.geometry.boundingBox.getSize(new THREE.Vector3());
      /* Einmalige Umhängung. `_pivotHost` merkt sich, dass es schon passiert ist — ein zweiter
         Aufruf würde die Gruppe verschachteln und den Versatz doppelt rechnen. */
      let host = mesh.userData._pivotHost;
      if (!host) {
        host = new THREE.Group();
        host.name = 'pivot#' + i;
        const parent = mesh.parent;
        host.position.copy(centre);
        if (parent) parent.add(host);
        host.add(mesh);
        mesh.position.sub(centre);
        mesh.userData._pivotHost = host;
        mesh.userData._pivotCentre = centre.clone();
      }
      this.items.push({ island: i, mesh, host, centre: centre.clone(), size: size.clone(),
        base: { pos: host.position.clone(), rot: host.rotation.clone(), scale: host.scale.clone() },
        sign: centre.x < 0 ? -1 : 1 });
    });
    this.apply();
  }

  get found() { return this.items.length; }
  measured() {
    return this.items.map((it) => ({ island: it.island + 1,
      size: it.size.toArray().map((v) => +v.toFixed(3)),
      centre: it.centre.toArray().map((v) => +v.toFixed(3)) }));
  }

  set(patch) {
    for (const [k, v] of Object.entries(patch || {})) {
      if (!(k in DEFAULTS)) return { status: 'UNSUPPORTED', field: k, reason: 'unknown' };
      if (k !== 'enabled' && !Number.isFinite(v)) return { status: 'UNSUPPORTED', field: k, reason: 'not a number' };
    }
    Object.assign(this.params, patch);
    this.apply();
    return { status: 'OK' };
  }
  reset() { this.params = { ...DEFAULTS, enabled: this.params.enabled }; this.apply(); return { status: 'OK' }; }

  apply() {
    const p = this.params;
    this.items.forEach((it) => {
      it.mesh.visible = !!p.enabled;
      it.host.scale.setScalar(p.scale);
      it.host.position.set(
        it.base.pos.x + p.spread * it.sign,
        it.base.pos.y + p.lift,
        it.base.pos.z + p.depth,
      );
      it.host.rotation.set(it.base.rot.x, it.base.rot.y, it.base.rot.z + (p.tilt * Math.PI / 180) * it.sign);
    });
    return { status: 'OK' };
  }
  export() { return { schema: SCHEMA, label: this.label, islands: this.items.map((i) => i.island), ...this.params }; }
}

/**
 * Inseln nach LAGE finden, nicht nach Namen — dieselbe Regel wie bei den Zonennamen.
 * Gibt { brows:[i,i], nose:i|null } zurück, beides 0-basiert, oder leere Werte.
 */
export function findFaceParts({ THREE, parts, eyeAnchor, hullR }) {
  const size = new THREE.Vector3(), mid = new THREE.Vector3();
  const cy = eyeAnchor.y, r = eyeAnchor.ring;
  const brows = [], noses = [];
  parts.forEach((p, i) => {
    if (i === 0) return;
    p.mesh.geometry.computeBoundingBox();
    const bb = p.mesh.geometry.boundingBox;
    bb.getSize(size); bb.getCenter(mid);
    if (mid.z <= r * 1.2) return;                       // muss vorn am Gesicht liegen
    if (mid.y > cy + r * 0.6 && Math.abs(mid.x) > r * 0.8 && size.x > size.y) {
      brows.push({ i, y: mid.y, x: mid.x });            // über der Augenlinie, beidseitig, breit
    } else if (Math.abs(mid.x) < 0.08 && Math.hypot(mid.x, mid.z) > hullR * 1.05
        && mid.y > cy - r * 2 && mid.y < cy + r * 1.5) {
      noses.push({ i, out: Math.hypot(mid.x, mid.z) }); // auf der Achse, über die Hülle hinaus
    }
  });
  const L = brows.filter((b) => b.x > 0).sort((a, b) => b.y - a.y)[0];
  const R = brows.filter((b) => b.x < 0).sort((a, b) => b.y - a.y)[0];
  noses.sort((a, b) => b.out - a.out);
  return { brows: (L && R) ? [L.i, R.i] : [], nose: noses.length ? noses[0].i : null };
}
