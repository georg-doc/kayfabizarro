/**
 * lab-v8/flight-frame.v1.js · S1 · Der gemessene Flugrahmen.
 *
 * WARUM DIESE DATEI UEBERHAUPT EXISTIERT. Die vier Bodenfamilien haengen ausnahmslos an
 * Radgroessen: Aufstandspunkt, Spur, Radstand, Radbreite. Ein Flugkoerper hat davon nichts, was
 * ihn traegt — und die drei Doppeldecker, die seit der Achsenregel zwei Raeder MELDEN, haben ein
 * Fahrwerk, keinen Fluganker. Rollen, Nicken und Gieren drehen um Fluegelebene und
 * Huellenschwerpunkt, nicht um eine Aufstandslinie.
 *
 * Darum misst der Flug-Tab fuenf eigene Groessen und NICHT die Rad-Paar-Regel:
 *
 *   Spannweite        Huellbox x        Rollrate, Flaechenlast, Wankradius
 *   Rumpflaenge       Huellbox z        Nickrate, Kameraabstand
 *   Fluegelebene      y der breitesten x-Schicht    Drehpunkt der Rollbewegung
 *   Huellenmitte      Volumenmittel der Teilnetze   Drehpunkt in Nicken und Gieren
 *   Schubachse        Blickrichtungsschalter        Vorzeichen von Beschleunigung
 *
 * Vier davon sind GEMESSEN. Die fuenfte ist ein Schalter mit Gedaechtnis, und sie steht hier als
 * Schalter drin, weil keine Huellbox sagen kann, wo vorn ist (dieselbe Lage wie am Boden).
 *
 * Eingang ist das Ergebnis von `lab-v7/carrig.v3.js`: Nullpunkt in x/z auf der Modellmitte, y auf
 * dem gemessenen Aufstandspunkt, alle Teilnetze in EINEN Raum gebacken. Die Messung liest die
 * gebackene Geometrie, nicht die Quelldatei — was der Orient- und der Gier-Schalter gedreht
 * haben, ist damit schon drin.
 */
export const SCHEMA = 'kfb.flight-frame/1';

export const FRAME_RULE = [
  'Spannweite und Rumpflaenge NACH Orient und Gier aus der Huellbox (x bzw. z)',
  'Fluegelebene: 64 y-Schichten ueber die Karosserie, je Schicht die groesste |x|-Reichweite;'
    + ' gewichtetes Mittel der Schichten ab 92 % der Spitzenreichweite',
  'Huellenmitte: Boxvolumen je Teilnetz als Gewicht (Plan: Volumenmittel der Teilnetze)',
  'Schubachse: Schalter mit Gedaechtnis (+z / -z), nicht gemessen — keine Huellbox sagt, wo vorn ist',
  'Fluegelteile: Teilnetze mit x-Reichweite ueber 18 % der Spannweite und Mitte in der Fluegelebene',
];

const SLICES = 64;

/**
 * @param {object} o
 * @param {object} o.THREE
 * @param {object} o.rig      Ergebnis von carrig.v3 `analyse()`
 * @param {number} o.forward  +1 oder -1 — der Blickrichtungsschalter, NICHT gemessen
 */
export function measureFlightFrame({ THREE, rig, forward = 1 }) {
  const box = new THREE.Box3().setFromObject(rig.group);
  const size = box.getSize(new THREE.Vector3());
  const span = +size.x.toFixed(5);
  const fuselage = +size.z.toFixed(5);
  const height = +size.y.toFixed(5);

  /* ── Fluegelebene ─────────────────────────────────────────────────────────────────────────
     64 Schichten in y, je Schicht die groesste Querreichweite. Das Maximum ist die Hoehe, in der
     das Modell am breitesten ist — bei einem Flugzeug die Fluegelwurzel, bei einem Papierflieger
     die Knickkante, bei einem Raumschiff die Rumpfmitte. Gemittelt wird ueber alle Schichten ab
     92 % der Spitze, sonst waehlt eine einzelne Zackenreihe die Ebene aus. */
  const yMin = box.min.y, yMax = box.max.y, h = Math.max(1e-6, yMax - yMin);
  const reach = new Float64Array(SLICES);
  let verts = 0;
  const v = new THREE.Vector3();
  rig.body.traverse((n) => {
    if (!n.isMesh || !n.geometry || !n.geometry.attributes.position) return;
    n.updateMatrixWorld(true);
    const p = n.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(n.matrixWorld);
      const s = Math.min(SLICES - 1, Math.max(0, Math.floor(((v.y - yMin) / h) * SLICES)));
      const a = Math.abs(v.x);
      if (a > reach[s]) reach[s] = a;
      verts++;
    }
  });
  let peak = 0;
  for (let i = 0; i < SLICES; i++) if (reach[i] > peak) peak = reach[i];
  let wsum = 0, wy = 0, wingSlices = 0;
  for (let i = 0; i < SLICES; i++) {
    if (peak <= 0 || reach[i] < peak * 0.92) continue;
    const y = yMin + ((i + 0.5) / SLICES) * h;
    wsum += reach[i]; wy += reach[i] * y; wingSlices++;
  }
  const wingY = wsum > 0 ? +(wy / wsum).toFixed(5) : +((yMin + yMax) / 2).toFixed(5);

  /* ── Huellenmitte ────────────────────────────────────────────────────────────────────────
     Volumenmittel der Teilnetze. Ein Flugzeug ist nicht symmetrisch in z (Rumpf vorn dicker,
     Leitwerk hinten duenn), und genau dieser Versatz ist der Unterschied zwischen einem Nicken um
     die Mitte und einem Nicken um den Schwerpunkt. Ein Papierflieger hat Teilnetze mit Volumen
     nahe null — dafuer steht der Rueckfall auf das Scheitelmittel daneben, und der Bericht sagt,
     welcher Weg gegriffen hat. */
  let vol = 0; const cv = new THREE.Vector3();
  const bb = new THREE.Box3(), bs = new THREE.Vector3(), bc = new THREE.Vector3();
  const parts = [];
  rig.body.children.forEach((n) => {
    if (!n.isMesh) return;
    bb.setFromObject(n); bb.getSize(bs); bb.getCenter(bc);
    const w = Math.max(0, bs.x * bs.y * bs.z);
    parts.push({ name: n.name, w, cx: bc.x, cy: bc.y, cz: bc.z, sx: bs.x, sy: bs.y, sz: bs.z });
    if (w > 0) { vol += w; cv.addScaledVector(bc, w); }
  });
  let hullSource = 'boxvolumen';
  if (vol > 1e-12) cv.multiplyScalar(1 / vol);
  else { hullSource = 'scheitelmittel'; box.getCenter(cv); }

  /* ── Fluegelteile ────────────────────────────────────────────────────────────────────────
     Nur wenn das Modell die Fluegel als EIGENE Netze fuehrt, kann etwas an ihnen nachlaufen. Die
     Poly-Flugzeuge sind nach MATERIAL getrennt (Object003_1 … _6) und liefern darum keine — das
     ist eine Eigenschaft der Quelle, kein Messfehler, und der Bericht sagt es so. */
  const halfSpan = span / 2;
  const wingBand = Math.max(h * 0.12, span * 0.06);
  const wings = { left: null, right: null, plate: null, note: '' };
  parts.forEach((p) => {
    const inPlane = Math.abs(p.cy - wingY) <= wingBand;
    if (!inPlane) return;
    if (p.sx > span * 0.55) { if (!wings.plate || p.sx > wings.plate.sx) wings.plate = p; return; }
    if (p.sx < span * 0.18) return;
    if (p.cx < -halfSpan * 0.15) { if (!wings.right || p.sx > wings.right.sx) wings.right = p; }
    if (p.cx > halfSpan * 0.15) { if (!wings.left || p.sx > wings.left.sx) wings.left = p; }
  });
  if (wings.left && wings.right) wings.note = 'zwei getrennte Fluegelnetze — Differenztwist moeglich';
  else if (wings.plate) wings.note = 'EIN Fluegelblatt ueber beide Seiten — nur gemeinsames Biegen, kein Differenztwist';
  else wings.note = 'kein Fluegelnetz in der Fluegelebene — Twist UNAVAILABLE, die Quelle trennt nicht nach Bauteil';

  /* Ein Hinweis, keine Korrektur: ist der Koerper laenger als breit, steht der Gier-Schalter
     moeglicherweise falsch. Entschieden wird das am Bild, nicht hier (PLAN, 19.09.). */
  const aspect = fuselage > 1e-9 ? +(span / fuselage).toFixed(3) : null;

  return {
    schema: SCHEMA,
    span, fuselage, height, aspect,
    wingY, wingSlices, wingReachPeak: +peak.toFixed(5),
    hull: { x: +cv.x.toFixed(5), y: +cv.y.toFixed(5), z: +cv.z.toFixed(5) },
    hullSource,
    forward, forwardSource: 'schalter-mit-gedaechtnis',
    wings,
    parts,
    verts,
    /* Ableitungen, die der Deformer braucht — HIER berechnet, damit es EINE Stelle bleibt. */
    rollRadius: +(span / 2).toFixed(5),
    pitchArm: +(fuselage / 2).toFixed(5),
    slenderness: aspect,
    hint: aspect != null && aspect < 0.8
      ? 'Spannweite kleiner als Rumpflaenge — bei einem Flaechenflugzeug ein Verdacht auf falschen Gier-Schalter'
      : null,
    rule: FRAME_RULE,
  };
}
