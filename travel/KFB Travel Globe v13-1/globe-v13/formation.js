// ============================================================================
// formation.js — v11 · Die Rule of Three als EINE Funktion für alle Reiter
// ----------------------------------------------------------------------------
// Anlass: `komposition.js` (Felsen, v10) trug die Triaden-Geometrie und ihr Tor in sich. v11
// bringt einen zweiten Reiter mit Dreiergruppen (`flora.js`: Bäume, Büsche, Gras, Stümpfe, Pilze,
// Blumen). Zwei Kopien derselben Regel wären die Fehlerklasse „zwei Wahrheiten" — die erste
// Abweichung (ein Winkel hier 25°, dort 30°) fiele niemandem auf, bis eine Gruppe in der Linie
// steht. Also steht die Regel HIER, einmal, und beide Reiter rufen sie.
//
// Zahlen unverändert aus komposition.js (Abnahme 2.9., dritte Runde):
//   · Mittel: Abstand (rG + rM) · 0,85 — „leicht ineinander geschoben"
//   · Klein:  Abstand (rG + rK) · 1,7, Scheitel zum Mittleren 70–110°; Rückfall 1,3× (0,76·1,7)
//   · kleinster Innenwinkel ≥ MIN_WINKEL (25°) — dieselbe Funktion im Prädikat UND im Tor
//   · Detail: Abstand rG · (1 + Exp(λ = 1,2)), gedeckelt bei rG · 3
// Nachrücken statt Verwerfen: 8 Winkel · 4 Unterwinkel · 2 Abstandsstufen.
// ============================================================================

export const MIN_WINKEL = 25;

/** Tangentialrahmen an `n` — dieselbe Konstruktion wie in komposition.js. */
export function rahmen(THREE, n, t1, t2) {
  const h = Math.abs(n.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  t1.crossVectors(h, n).normalize(); t2.crossVectors(n, t1).normalize();
}

/** Punkt auf der Kugel: von `n` um `bogen` Radiant in Richtung Winkel `a` im Rahmen. */
export function versetzt(THREE, n, a, bogen, out) {
  const t1 = new THREE.Vector3(), t2 = new THREE.Vector3();
  rahmen(THREE, n, t1, t2);
  return out.copy(n).addScaledVector(t1, Math.cos(a) * Math.tan(bogen))
                    .addScaledVector(t2, Math.sin(a) * Math.tan(bogen)).normalize();
}

/** Kleinster Innenwinkel des Dreiecks (Grad), im Tangentialraum genähert. */
export function kleinsterWinkel(THREE, a, b, c) {
  const ab = new THREE.Vector3().copy(b).sub(a), ac = new THREE.Vector3().copy(c).sub(a),
        bc = new THREE.Vector3().copy(c).sub(b);
  const w1 = ab.angleTo(ac), w2 = ab.negate().angleTo(bc), w3 = Math.PI - w1 - w2;
  return Math.min(w1, w2, w3) * 180 / Math.PI;
}

/**
 * Sucht Mittel- und Klein-Platz um den Fokus `n`. Radien in Weltmaß, `R` Kugelradius.
 * @returns { pM, pK, winkel } oder null (dann hat der Standort keinen Raum — zählt der Rufer)
 */
export function triadeSuchen({ THREE, n, rG, rM, rK, R, gueltig, rnd, minWinkel = MIN_WINKEL }) {
  const dM = (rG + rM) * 0.85, dK = (rG + rK) * 1.7;
  let aM = rnd() * Math.PI * 2;
  for (let stufe = 0; stufe < 2; stufe++) {
    const dKs = dK * (stufe ? 0.76 : 1);
    for (let v = 0; v < 8; v++, aM += Math.PI * 0.75) {
      const qM = versetzt(THREE, n, aM, dM / R, new THREE.Vector3());
      if (!gueltig(qM)) continue;
      for (let w = 0; w < 4; w++) {
        const aK = aM + (70 + rnd() * 40) * Math.PI / 180 * (w % 2 ? -1 : 1);
        const qK = versetzt(THREE, n, aK, dKs / R, new THREE.Vector3());
        if (!gueltig(qK)) continue;
        const wk = kleinsterWinkel(THREE, n, qM, qK);
        if (wk >= minWinkel) return { pM: qM, pK: qK, winkel: wk, abstandsStufe: stufe };
      }
    }
  }
  return null;
}

/** Detail-Plätze im exponentiellen Abfall um den Fokus (λ = 1,2, Deckel 3·rG). */
export function detailPlaetze({ THREE, n, rG, R, anzahl, gueltig, rnd, lambda = 1.2, deckel = 3 }) {
  const out = [];
  for (let i = 0; i < anzahl; i++) {
    const abst = rG * Math.min(deckel, 1 + (-Math.log(1 - rnd()) / lambda));
    const p = versetzt(THREE, n, rnd() * Math.PI * 2, abst / R, new THREE.Vector3());
    if (gueltig(p)) out.push(p);
  }
  return out;
}

/**
 * Ein BÜSCHEL: k Stücke eng um `n` (Gras, Blumen, Pilzfamilie). Kein Dreieck, sondern ein
 * Haufen mit Mindestabstand — der Abstand ist ein Bruchteil der Grundfläche, damit die Stücke
 * sich berühren, aber nicht ineinander stehen. Deterministisch über `rnd`.
 */
export function bueschel({ THREE, n, r, R, anzahl, gueltig, rnd, dichte = 0.9 }) {
  const out = [n.clone()];
  for (let i = 1; i < anzahl; i++) {
    let ok = null;
    for (let v = 0; v < 6 && !ok; v++) {
      const abst = r * dichte * (1 + rnd() * (0.6 + 0.4 * i));
      const p = versetzt(THREE, n, rnd() * Math.PI * 2, abst / R, new THREE.Vector3());
      if (!gueltig(p)) continue;
      let nah = false;
      for (const q of out) if (q.angleTo(p) * R < r * dichte * 0.8) { nah = true; break; }
      if (!nah) ok = p;
    }
    if (ok) out.push(ok);
  }
  return out;
}
