// ============================================================================
// spherical-math.js — Bewegung auf der Kugel, 1:1 aus tinyskies
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, client/src/game/SphericalMath.ts (gelesen 27.8.2026).
//
// **Das ist der Kern des Modells, und es ist erstaunlich wenig Code.** Die Position ist ein
// QUATERNION, keine Koordinate: `qPosition` dreht die Referenz-Aufwärtsachse (0,1,0) auf die
// Oberflächennormale. Fliegen heißt dann nicht „x und z addieren", sondern die Position um eine
// Achse drehen, die senkrecht auf Blickrichtung und Normale steht — ein Großkreisbogen.
//
// Was daran alle Probleme der Höhenfeld-Fassung erledigt:
//   · Es gibt keinen Rand. Kein Streaming, keine Kacheln, keine LOD-Ringe, keine Nähte.
//   · Es gibt keine Sonderfälle an Polen oder Datumsgrenze — ein Quaternion hat keine Naht.
//   · „Oben" ist immer definiert: die Normale. Bank, Pitch und Kamera hängen daran.
//
// Übertragen aus TypeScript nach JS, Zeile für Zeile. THREE wird injiziert, damit dieses Modul
// keinen zweiten three-Import in die Seite bringt.
// ============================================================================

let T = null;
export function initSphericalMath(THREE) { T = THREE; }

const REF_UP = () => new T.Vector3(0, 1, 0);

/** Park–Miller LCG — deterministischer Strom aus einem Integer-Seed. */
export function seededRandom(seed) {
  let s = seed >>> 0;
  if (s === 0) s = 1;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

/** Bildet die lokale +Y-Achse auf die Oberflächennormale ab. */
export function quaternionFromSurfaceNormal(nx, ny, nz) {
  const n = new T.Vector3(nx, ny, nz).normalize();
  return new T.Quaternion().setFromUnitVectors(REF_UP(), n);
}

export function randomSpawnQuaternionAndHeading(seed) {
  const rnd = seededRandom(seed + 1337);
  const theta = rnd() * Math.PI * 2;
  const phi = Math.acos(2 * rnd() - 1);
  const nx = Math.sin(phi) * Math.cos(theta);
  const ny = Math.sin(phi) * Math.sin(theta);
  const nz = Math.cos(phi);
  return { qPosition: quaternionFromSurfaceNormal(nx, ny, nz), heading: rnd() * Math.PI * 2 };
}

/** up = radial, north = Tangente zum Referenzpol, east = up × north. */
export function tangentFrame(qPosition) {
  const up = REF_UP().applyQuaternion(qPosition).normalize();
  const north = new T.Vector3(0, 0, -1).applyQuaternion(qPosition).normalize();
  const east = new T.Vector3().crossVectors(up, north).normalize();
  north.crossVectors(east, up).normalize();   // gegen Drift re-orthogonalisieren
  return { up, north, east };
}

/** Großkreisbogen: `heading` in Radiant (0 = Nord), `arcAngle` = Strecke / Kugelradius. */
export function moveOnSphere(qPosition, heading, arcAngle) {
  if (Math.abs(arcAngle) < 1e-10) return qPosition.clone();
  const frame = tangentFrame(qPosition);
  const dir = new T.Vector3()
    .addScaledVector(frame.north, Math.cos(heading))
    .addScaledVector(frame.east, Math.sin(heading))
    .normalize();
  const axis = new T.Vector3().crossVectors(dir, frame.up).normalize();
  const q = new T.Quaternion().setFromAxisAngle(axis, -arcAngle);
  return qPosition.clone().premultiply(q);
}

export function cartesianFromSpherical(qPosition, altitude, globeRadius) {
  return REF_UP().multiplyScalar(globeRadius + altitude).applyQuaternion(qPosition);
}

/** Weltstrahl aus der Nase — dieselbe Formel wie die Trefferprüfung im Original. */
export function rayFromState(qPosition, heading, pitch, altitude, globeRadius) {
  const origin = cartesianFromSpherical(qPosition, altitude, globeRadius);
  const frame = tangentFrame(qPosition);
  const forward = new T.Vector3()
    .addScaledVector(frame.north, Math.cos(heading))
    .addScaledVector(frame.east, Math.sin(heading))
    .normalize();
  const right = new T.Vector3().crossVectors(forward, frame.up).normalize();
  const pitchQ = new T.Quaternion().setFromAxisAngle(right, -pitch);
  const direction = forward.clone().applyQuaternion(pitchQ).normalize();
  return { origin, direction };
}

/** Volle 4×4-Weltmatrix: Position auf der Kugel plus Lage (heading, pitch, bank). */
export function buildPlaneMatrix(qPosition, heading, pitch, bankAngle, altitude, globeRadius) {
  const frame = tangentFrame(qPosition);
  const forward = new T.Vector3()
    .addScaledVector(frame.north, Math.cos(heading))
    .addScaledVector(frame.east, Math.sin(heading))
    .normalize();
  const right = new T.Vector3().crossVectors(forward, frame.up).normalize();
  const pitchQ = new T.Quaternion().setFromAxisAngle(right, -pitch);
  const pitchedForward = forward.clone().applyQuaternion(pitchQ).normalize();
  const pitchedUp = frame.up.clone().applyQuaternion(pitchQ).normalize();
  const bankQ = new T.Quaternion().setFromAxisAngle(pitchedForward, bankAngle);
  const bankedRight = right.clone().applyQuaternion(bankQ).normalize();
  const bankedUp = pitchedUp.clone().applyQuaternion(bankQ).normalize();
  const pos = cartesianFromSpherical(qPosition, altitude, globeRadius);
  const m = new T.Matrix4();
  m.makeBasis(bankedRight, bankedUp, pitchedForward.negate());
  m.setPosition(pos);
  return m;
}

export function lerpAngle(a, b, t) {
  // ⚠ Zwei `while` mit konstanter Schrittweite: bei einem endlichen `diff` terminieren sie, bei
  // **±Infinity nie** (Infinity − 2π ist Infinity). Ein einziger Infinity-Wert im Kurs — aus einer
  // Division durch null, einem NaN-Vergleich, einem entgleisten Servo — friert damit den Tab ein,
  // ohne eine Zeile Fehler. Dieselbe Klasse wie die Endlosschleife in `speed-lines.js`, gefunden
  // in derselben Abnahme (29.8.). `atan2` ist der schnittfeste Weg zum selben Ergebnis und
  // liefert für nicht-endliche Eingaben NaN statt einer Ewigkeit.
  if (!Number.isFinite(a) || !Number.isFinite(b)) return Number.isFinite(a) ? a : 0;
  const diff = Math.atan2(Math.sin(b - a), Math.cos(b - a));
  return a + diff * t;
}
