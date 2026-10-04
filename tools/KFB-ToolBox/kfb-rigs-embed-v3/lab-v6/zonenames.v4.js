/**
 * zonenames.v1 · Nachprüfbare Namen für die Inseln einer statischen Figur.
 *
 * Warum: 21 Zeilen »zone 7« sind eine Liste, kein Werkzeug.
 *
 * Was hier ausdrücklich NICHT passiert: Anatomie raten. Die erste Fassung tat das (`arrow`, `plate`,
 * `eye piece`) und lieferte für 11 von 21 Inseln den nackten Rückfall `part L 3` — und für Carls
 * Pupillen den Namen `tooth`. Ein Name, der falsch sein kann, ohne dass man es sieht, ist schlimmer
 * als eine Nummer.
 *
 * Deshalb heißt eine Insel jetzt nach **Form** und **gemessenem Ort auf der Kapsel**:
 *
 *     block · lower front L        plate · top side L        spike · lower back, outboard
 *
 * Beides ist aus `size` und `centre` ableitbar, also von jedem am Tooltip nachrechenbar. Es gibt
 * keinen Rückfall-Namen: jede Insel hat eine Form und einen Ort.
 *
 * Zwei Ausnahmen tragen echte Namen, weil sie GEMESSEN sind und nicht geraten:
 *   `tooth`  — liegt in der vermessenen Mundmulde, waagerecht UND senkrecht.
 *   `pupil`  — liegt am abgelesenen Augenanker (dx/dy), nicht im Mund. Ohne diese Trennung wandern
 *              Carls eigene Pupilleninseln unter »tooth«, weil die Ausblende-Kiste gepolstert ist.
 *
 * Seitenbezeichnung: die Figur schaut nach +z, oben ist +y. Rechte Körperseite ist −x, linke +x.
 * »L«/»R« sind aus SICHT DER FIGUR, nicht des Zuschauers — die Umkehrung ist der häufigste stille
 * Fehler bei Seitennamen.
 *
 * Wirt-Vertrag: three kommt herein, nichts wird geladen, nichts verändert.
 *   nameIslands({ THREE, parts, capsule, inCavity, mouth, eyeAnchor, brows, nose })
 */
export const SCHEMA = 'kfb.zonenames/1';

export function nameIslands({ THREE, parts, capsule, inCavity = [], mouth = null, eyeAnchor = null, brows = [], nose = null }) {
  const r = (capsule && capsule.r) || 0.5;
  const cc = (capsule && capsule.capCentres) || [0.5, 1.5];
  const yBot = cc[0], yTop = cc[1], yMid = (yBot + yTop) / 2;
  const U = (yTop - yBot) / 2 + r;
  const cav = new Set(inCavity);
  const size = new THREE.Vector3(), mid = new THREE.Vector3();
  const out = [], tally = {};

  parts.forEach((p, i) => {
    p.mesh.geometry.computeBoundingBox();
    const bb = p.mesh.geometry.boundingBox;
    bb.getSize(size); bb.getCenter(mid);
    const d = [size.x, size.y, size.z].sort((a, b) => a - b);   // aufsteigend: dünn → lang
    const radial = Math.hypot(mid.x, mid.z);
    let label = null, rule = '';

    if (i === 0) {
      label = 'capsule (body)';
      rule = 'island #1 — the hull every face part hangs on';
    } else if (brows.indexOf(i) >= 0) {
      /* Echte Namen, weil sie aus derselben Messung kommen, mit der `partrig` diese Inseln riggt:
         vorn am Kopf, über der Augenlinie, beidseitig, breiter als hoch. */
      label = 'Brow';
      rule = 'front of the head, above the eye line, mirrored pair, wider than tall — the island the block brow rigs';
    } else if (nose != null && i === nose) {
      label = 'Nose';
      rule = 'on the centre axis and protruding past the measured hull, at face height — the island the original nose rigs';
    } else if (mouth && cav.has(i)
        && Math.abs(mid.x) <= mouth.halfWidth && Math.abs(mid.y - mouth.y) <= mouth.halfHeight) {
      label = 'tooth';
      rule = 'inside the measured mouth recess (|x| ' + Math.abs(mid.x).toFixed(3) + ' ≤ ' + mouth.halfWidth.toFixed(3)
        + ', |y−' + mouth.y.toFixed(3) + '| ' + Math.abs(mid.y - mouth.y).toFixed(3) + ' ≤ ' + mouth.halfHeight.toFixed(3) + ')';
    } else if (eyeAnchor
        && Math.abs(Math.abs(mid.x) - eyeAnchor.dx) < 0.06 && Math.abs(mid.y - eyeAnchor.y) < 0.09 && mid.z > r * 0.5) {
      label = 'pupil';
      rule = 'sits on the read-off eye anchor (dx ' + eyeAnchor.dx.toFixed(3) + ', y ' + eyeAnchor.y.toFixed(3) + '), not in the mouth';
    } else {
      /* Form — drei Klassen, beide Schwellen an den gemessenen Maßen abgelesen. `block` ist der
         Sammelbegriff für »keine dominante Achse«, nicht für »würfelig«: er fängt auch 2,6:1 noch
         ein, und die Regel muss dann auch 2,6:1 sagen und nicht »roughly equal«. */
      let shape, why;
      if (d[0] < 0.12 && d[2] > d[0] * 2.5) { shape = 'plate'; why = 'thin (' + d[0].toFixed(3) + ' u) and ' + (d[2] / d[0]).toFixed(1) + '× as broad'; }
      else if (d[2] > d[1] * 2.5) { shape = 'spike'; why = 'long: ' + (d[2] / d[1]).toFixed(1) + '× its own girth'; }
      else { shape = 'block'; why = 'no dominant axis (longest ' + (d[2] / d[0]).toFixed(1) + '× shortest, ' + (d[2] / d[1]).toFixed(1) + '× middle)'; }

      /* Ort — senkrechtes Band und Richtung, beides aus `centre`. */
      const band = mid.y > yTop ? 'top' : mid.y > yMid ? 'upper' : mid.y > yBot ? 'lower' : 'bottom';
      const face = mid.z > r * 0.3 ? 'front' : mid.z < -r * 0.3 ? 'back' : 'side';
      const side = mid.x < -0.08 ? ' R' : mid.x > 0.08 ? ' L' : '';
      const out0 = radial > r * 1.05 ? ', outboard' : '';
      label = shape + ' · ' + band + ' ' + face + side + out0;
      rule = why + '; centre y ' + mid.y.toFixed(3) + ' → ' + band + ', z ' + mid.z.toFixed(3) + ' → ' + face
        + (out0 ? '; radial ' + radial.toFixed(3) + ' > hull r ' + r.toFixed(3) : '');
    }

    if (label === 'tooth' || label === 'pupil' || label === 'Brow') label += mid.x < -0.02 ? ' R' : mid.x > 0.02 ? ' L' : '';
    tally[label] = (tally[label] || 0) + 1;
    out.push({ label, rule, size: [+size.x.toFixed(3), +size.y.toFixed(3), +size.z.toFixed(3)], centre: [+mid.x.toFixed(3), +mid.y.toFixed(3), +mid.z.toFixed(3)] });
  });

  /* Gleiche Namen werden durchnummeriert, sonst zeigt die Liste dreimal »block · lower front L«. */
  const seen = {};
  out.forEach((o) => { if (tally[o.label] > 1) { seen[o.label] = (seen[o.label] || 0) + 1; o.label += ' ' + seen[o.label]; } });
  void U;
  return out;
}
