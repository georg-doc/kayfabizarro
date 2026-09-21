// ============================================================================
// boden-lesung.js — v9 · EIN Eigentümer für „wie hoch ist der gezeichnete Boden"
// ----------------------------------------------------------------------------
// **Warum diese Datei existiert:** dieselbe Frage wurde heute an drei Stellen verschieden
// beantwortet, und zweimal falsch.
//   1 `mech-station` las erst `surfaceAltitudeAt` (Höhenfunktion) → der Mech watete bzw. schwebte,
//     Abweichung bis 17,5 % der Figurhöhe (Messung 1).
//   2 dann bilinear über vier Zellecken → systematisch ZU HOCH (+0,0003…+0,0053 u, immer positiv),
//     weil die gezeichnete Fläche zwei DREIECKE sind und ein bilineares Feld darüber wölbt.
//   3 `natur-marken` platzierte Türme und Bodenschein wieder aus der Höhenfunktion → der
//     Bodenschein lag bei zwei von drei Leuchttürmen **unter** dem Gelände (−8,19 mm / −1,13 mm /
//     +0,46 mm gemessen), weil ein Versatz von 1,4 mm eine Abweichung von ±8 mm nicht überlebt.
//
// *Eine Frage mit drei Antworten hat keinen Eigentümer.* Ab hier gibt es einen:
//
//   `radiusAt(up)` — Radius der GEBACKENEN Fläche unter `up`, O(1), ohne Suche.
//     `SphereGeometry` ist ein regelmäßiges (W+1)×(H+1)-Gitter und schreibt je Zelle die Dreiecke
//     (a, b, d) und (b, c, d) mit a = (iy, ix+1) · b = (iy, ix) · c = (iy+1, ix) · d = (iy+1, ix+1).
//     Also: Zelle aus den Kugelwinkeln rechnen, mit `fy ≤ fx` das richtige Dreieck wählen und den
//     Strahl aus dem Mittelpunkt gegen dessen EBENE schneiden — dieselbe Rechnung wie ein Raycast,
//     nur ohne die 130 560 Dreiecke zu durchsuchen (gemessen: 8–21 ms je Strahl gegen < 0,1 ms).
//
//   `strahlAt(up)` — der teure Kontrollstrahl. NICHT im Bildtakt: nur, wenn ein Tor fragt.
//   `tor(up)` — stellt beide plus die Höhenfunktion nebeneinander. Ein Instrument, das seine
//     eigene Behauptung prüft.
// ============================================================================

export function createBodenLesung({ THREE, mesh, radius, surfaceAltitudeAt = null,
                                   seed = 0, terrainType = 'default' }) {
  const strahl = new THREE.Raycaster();
  const _l = new THREE.Vector3(), _b = new THREE.Vector3();
  const _c0 = new THREE.Vector3(), _c1 = new THREE.Vector3(), _c2 = new THREE.Vector3();
  const _e1 = new THREE.Vector3(), _e2 = new THREE.Vector3(), _nrm = new THREE.Vector3();
  let gitterMs = 0, strahlMs = 0, dreieck = false, treffer = 0, fehl = 0;
  const par = () => (mesh && mesh.geometry && mesh.geometry.parameters) || null;

  function radiusAt(up) {
    const p = par();
    if (!p || p.widthSegments == null) return null;
    const t0 = performance.now();
    const pos = mesh.geometry.attributes.position;
    const W = p.widthSegments, H = p.heightSegments;
    _l.copy(up).multiplyScalar(radius);
    mesh.worldToLocal(_l);
    _l.normalize();
    const theta = Math.acos(Math.max(-1, Math.min(1, _l.y)));
    let phi = Math.atan2(_l.z, -_l.x);
    if (phi < 0) phi += Math.PI * 2;
    const fyAll = (theta / Math.PI) * H, fxAll = (phi / (Math.PI * 2)) * W;
    const y0 = Math.max(0, Math.min(H - 1, Math.floor(fyAll)));
    const x0 = Math.max(0, Math.min(W - 1, Math.floor(fxAll)));
    const fy = Math.max(0, Math.min(1, fyAll - y0)), fx = Math.max(0, Math.min(1, fxAll - x0));
    const P3 = (r, c, out) => {
      const i = r * (W + 1) + c;
      return out.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    };
    if (fy <= fx) { P3(y0, x0, _c0); P3(y0, x0 + 1, _c1); P3(y0 + 1, x0 + 1, _c2); }
    else          { P3(y0, x0, _c0); P3(y0 + 1, x0, _c1); P3(y0 + 1, x0 + 1, _c2); }
    _e1.subVectors(_c1, _c0); _e2.subVectors(_c2, _c0);
    _nrm.crossVectors(_e1, _e2);
    const nd = _nrm.dot(_l);
    let out;
    if (Math.abs(nd) > 1e-9) { out = _nrm.dot(_c0) / nd; dreieck = true; }
    else {
      const rad = (r, c) => { const i = r * (W + 1) + c;
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        return Math.sqrt(x * x + y * y + z * z); };
      const r00 = rad(y0, x0), r01 = rad(y0, x0 + 1), r10 = rad(y0 + 1, x0), r11 = rad(y0 + 1, x0 + 1);
      out = (r00 * (1 - fx) + r01 * fx) * (1 - fy) + (r10 * (1 - fx) + r11 * fx) * fy;
      dreieck = false;
    }
    gitterMs = performance.now() - t0;
    return out;
  }

  function strahlAt(up) {
    if (!mesh) return null;
    const t0 = performance.now();
    strahl.set(_b.copy(up).multiplyScalar(radius * 1.35), _l.copy(up).multiplyScalar(-1));
    strahl.far = radius * 0.7;
    const tr = strahl.intersectObject(mesh, false);
    strahlMs = performance.now() - t0;
    if (!tr.length) { fehl++; return null; }
    treffer++;
    return tr[0].point.length();
  }

  return {
    name: 'boden-lesung', radiusAt, strahlAt,
    get letzteMs() { return gitterMs; },
    get dreieckLesung() { return dreieck; },
    /** Beide Leser plus die Höhenfunktion, an EINER Stelle, für ein Tor. */
    vergleich(up) {
      const g = radiusAt(up);
      const s = strahlAt(up);
      const f = surfaceAltitudeAt
        ? radius + Math.max(0, surfaceAltitudeAt(seed, terrainType, up.x, up.y, up.z)) : null;
      return { gitter: g, strahl: s, funktion: f,
               dGitterStrahl: (g != null && s != null) ? g - s : null,
               dFunktionMesh: (f != null && g != null) ? f - g : null,
               gitterMs, strahlMs, dreieck, treffer, fehl };
    },
  };
}
