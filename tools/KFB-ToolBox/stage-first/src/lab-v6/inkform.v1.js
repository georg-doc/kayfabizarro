/**
 * inkform.v1 · Einen Schlauch entlang einer Kurve bauen, der an der Maske GESCHLOSSEN ist.
 *
 * Georg, 13.09., am Bild: »auch die tube augenbrauen haben das problem, dass der maskierte teil zu
 * artefakten führt → bitte form nach slider-maske schließen«.
 *
 * Der Befund, gemessen am Shader: die Maske (`mask` / uniform `gap`) ist ein FRAGMENT-Verwurf. Sie
 * schneidet ein Band in der Mitte der Kurve weg, nachdem die Geometrie gebaut ist. Auf einem flachen
 * Bändchen fällt das nicht auf — es hat keine Innenseite. Ein Schlauch hat eine: man sieht an der
 * Schnittkante in das hohle Rohr, und weil `RAD` 6 ist, sieht man sechs Facetten und eine Kerbe.
 *
 * Ein Verwurf kann eine Form nicht schließen — er kann nur Pixel wegnehmen. Also wird die Form
 * geschlossen, wo sie entsteht: die Kurve wird in LÄUFE geteilt (links und rechts der Maske), jeder
 * Lauf bekommt Ringe, und an beiden Enden jedes Laufs wird der Ring auf seinen Mittelpunkt
 * zusammengezogen — ein Fächer, also ein Deckel. Der Verwurf wird danach auf 0 gestellt, sonst
 * schneidet er in die geschlossene Form.
 *
 * Nebenwirkung, die ein Gewinn ist: aus einer Braue werden zwei Körper. Das ist ohnehin, was eine
 * Braue ist.
 *
 * Maskenband: die UV-Länge ist t = i/(N−1), der Shader verwirft |2t−1| < gap. Dieselbe Rechnung hier,
 * damit Geometrie und Regler dasselbe bedeuten.
 */
export const SCHEMA = 'kfb.inkform/1';
export const RAD = 6;

/** Läufe der Kurve außerhalb des Maskenbands. Ohne Maske ein Lauf über alles. */
export function runsFor(N, mask) {
  const keep = [];
  for (let i = 0; i < N; i++) {
    const t = N > 1 ? i / (N - 1) : 0;
    if (!(mask > 0) || Math.abs(2 * t - 1) >= mask) keep.push(i);
  }
  const runs = [];
  let cur = null;
  keep.forEach((i) => {
    if (cur && i === cur[cur.length - 1] + 1) cur.push(i);
    else { cur = [i]; runs.push(cur); }
  });
  return runs.filter((r) => r.length >= 2);
}

/**
 * Schlauch mit Deckeln. `at(i)` liefert {x, y, z, tx, ty, half} — Lage, Tangente in der Bildebene
 * und halbe Dicke an dieser Abtastung. `round` staucht den Querschnitt in der Tiefe.
 */
export function solidForm({ N, at, mask = 0, round = 1, tLen = null }) {
  const positions = [], uv = [], indices = [];
  const runs = runsFor(N, mask);
  runs.forEach((run) => {
    const ringStart = positions.length / 3;
    run.forEach((i) => {
      const s = at(i), t = tLen ? tLen(i) : (N > 1 ? i / (N - 1) : 0);
      const r = Math.max(0.0015, s.half);
      for (let k = 0; k < RAD; k++) {
        const a = k / RAD * Math.PI * 2, cs = Math.cos(a), sn = Math.sin(a);
        positions.push(s.x - s.ty * r * cs, s.y + s.tx * r * cs, s.z + r * sn * round);
        uv.push(t, k / RAD);
      }
    });
    const rings = run.length;
    for (let j = 0; j < rings - 1; j++) {
      const a = ringStart + j * RAD, b = ringStart + (j + 1) * RAD;
      for (let k = 0; k < RAD; k++) { const n = (k + 1) % RAD; indices.push(a + k, b + k, a + n, a + n, b + k, b + n); }
    }
    /* Deckel: Mittelpunkt des ersten und des letzten Rings, dann ein Fächer auf den Ring.
       Die Wicklung ist an den beiden Enden gegenläufig, sonst zeigt ein Deckel nach innen. */
    [0, rings - 1].forEach((j, end) => {
      const s = at(run[j]), t = tLen ? tLen(run[j]) : (N > 1 ? run[j] / (N - 1) : 0);
      const c = positions.length / 3;
      positions.push(s.x, s.y, s.z); uv.push(t, 0.5);
      const ring = ringStart + j * RAD;
      for (let k = 0; k < RAD; k++) {
        const n = (k + 1) % RAD;
        if (end === 0) indices.push(c, ring + n, ring + k);
        else indices.push(c, ring + k, ring + n);
      }
    });
  });
  return { positions, uv, indices, runs: runs.length };
}

/** Flaches Bändchen — unverändert der alte Weg, hier nur der Vollständigkeit wegen. */
export function ribbonForm({ N, at, tLen = null }) {
  const positions = [], uv = [], indices = [];
  for (let i = 0; i < N; i++) {
    const s = at(i), t = tLen ? tLen(i) : (N > 1 ? i / (N - 1) : 0);
    for (const sg of [-1, 1]) { positions.push(s.x - s.ty * s.half * sg, s.y + s.tx * s.half * sg, s.z); uv.push(t, sg * 0.5 + 0.5); }
    if (i < N - 1) { const a = i * 2; indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  return { positions, uv, indices, runs: 1 };
}
