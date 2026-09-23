/**
 * inkform.v2 · Schlauch entlang einer Kurve — mit GEDECKELTEN Enden, die eine Form sind.
 *
 * Ablöser von `inkform.v1` (bleibt daneben, ist der Rückweg). Drei Änderungen, alle an Georgs
 * Befund vom 15.09.: »mono-brow-maske mit schnittkanten der tube«.
 *
 * 1 · FACETTEN. v1 legte `RAD = 6` fest — sechs Flächen, und an jeder Schnittkante sieht man sie
 *     als Kerbe. Jetzt ist `rad` ein Argument (Vorgabe 12). Doppelt so viele Dreiecke an einem
 *     Körper, der ohnehin nur ein paar hundert hat.
 * 2 · DECKEL SIND KEINE SPITZEN. v1 zog den Ring auf SEINEN MITTELPUNKT zusammen — ein Kegel, in
 *     der Silhouette eine Spitze. Hier gibt es zwei Enden-Arten:
 *       · `disc` — flacher Deckel in der Ringebene. Das ist ein SCHNITT, und an der Maske ist
 *         genau das richtig: eine Braue, die abgeschnitten ist, hat eine Kante, keine Spitze.
 *       · `dome` — Halbkuppel nach außen, Radius = Ringradius, in `domeRings` Ringen mit
 *         KREISPROFIL (cos/sin), also tangentenstetig an den Schlauch. Das ist das runde Ende
 *         eines Balkens.
 * 3 · KEINE LÄNGENABHÄNGIGE VERJÜNGUNG mehr nötig. Weil das Ende eine Kuppel ist, muß `cap` nicht
 *     mehr über eine Zahl von Abtastungen verjüngen (v1/v2 des Brauen-Rigs taten das, und die
 *     Länge dieser Verjüngung hing an der Abtastzahl, nicht an der Welt — darum war »Balken« nie
 *     ein Balken). `cap` steuert jetzt nur noch, wie hoch die Kuppel ist: 0 = flacher Schnitt,
 *     1 = ganze Halbkugel.
 *
 * `at(i)` liefert { x, y, z, tx, ty, half } — Lage, Tangente in der Bildebene, halbe Dicke.
 * Die Kuppel wächst entlang ±(tx, ty, 0): die Tiefenneigung der Kurve ist klein gegen den Radius,
 * und eine Kuppel, die in z mitkippt, wäre eine Schätzung mehr, keine bessere Form.
 */
export const SCHEMA = 'kfb.inkform/2';
export const RAD = 12;

/** Läufe der Kurve außerhalb des Maskenbands. Identisch zu v1 — dieselbe Rechnung wie der Shader. */
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
 * Schlauch mit Deckeln.
 * `ends(runIndex, end, runCount)` → 'dome' | 'disc'; `end` 0 = Anfang, 1 = Ende des Laufs.
 * Vorgabe: die AUSSENENDEN der Braue wölben, die Enden AN DER MASKE schneiden.
 */
export function solidForm({ N, at, mask = 0, round = 1, rad = RAD, cap = 1, domeRings = 3, tLen = null, ends = null }) {
  const positions = [], uv = [], indices = [];
  const runs = runsFor(N, mask);
  const tOf = (i) => (tLen ? tLen(i) : (N > 1 ? i / (N - 1) : 0));
  const endKind = ends || ((run, end, count) => (count > 1 && ((run === 0 && end === 1) || (run === count - 1 && end === 0)) ? 'disc' : 'dome'));
  const ring = (s, r, t, push) => {
    for (let k = 0; k < rad; k++) {
      const a = k / rad * Math.PI * 2, cs = Math.cos(a), sn = Math.sin(a);
      push(s.x - s.ty * r * cs, s.y + s.tx * r * cs, s.z + r * sn * round, t, k / rad);
    }
  };
  const push = (x, y, z, t, w) => { positions.push(x, y, z); uv.push(t, w); };

  runs.forEach((run, ri) => {
    const first = positions.length / 3;
    run.forEach((i) => { const s = at(i); ring(s, Math.max(0.0015, s.half), tOf(i), push); });
    const rings = run.length;
    for (let j = 0; j < rings - 1; j++) {
      const a = first + j * rad, b = first + (j + 1) * rad;
      for (let k = 0; k < rad; k++) { const n = (k + 1) % rad; indices.push(a + k, b + k, a + n, a + n, b + k, b + n); }
    }
    /* Die beiden Enden. `dir` ist die Richtung NACH AUSSEN (Anfang: gegen die Tangente).
       Die Wicklung dreht mit `dir`, sonst zeigt ein Deckel nach innen. */
    [0, rings - 1].forEach((j, end) => {
      const i = run[j], s = at(i), t = tOf(i), r = Math.max(0.0015, s.half);
      const dir = end === 0 ? -1 : 1;
      const kind = endKind(ri, end, runs.length);
      const h = kind === 'dome' ? Math.max(0, Math.min(1, cap)) * r : 0;
      let prev = first + j * rad;
      if (h > 0) {
        for (let q = 1; q <= domeRings; q++) {
          const a = q / (domeRings + 1) * Math.PI / 2;
          const rr = r * Math.cos(a), off = h * Math.sin(a);
          const start = positions.length / 3;
          ring({ x: s.x + s.tx * off * dir, y: s.y + s.ty * off * dir, z: s.z, tx: s.tx, ty: s.ty }, rr, t, push);
          for (let k = 0; k < rad; k++) {
            const n = (k + 1) % rad;
            if (dir > 0) indices.push(prev + k, start + k, prev + n, prev + n, start + k, start + n);
            else indices.push(prev + n, start + k, prev + k, start + n, start + k, prev + n);
          }
          prev = start;
        }
      }
      const c = positions.length / 3;
      push(s.x + s.tx * h * dir, s.y + s.ty * h * dir, s.z, t, 0.5);
      for (let k = 0; k < rad; k++) {
        const n = (k + 1) % rad;
        if (dir > 0) indices.push(c, prev + k, prev + n);
        else indices.push(c, prev + n, prev + k);
      }
    });
  });
  return { positions, uv, indices, runs: runs.length, rad };
}

/** Flaches Bändchen — unverändert der alte Weg. */
export function ribbonForm({ N, at, tLen = null }) {
  const positions = [], uv = [], indices = [];
  for (let i = 0; i < N; i++) {
    const s = at(i), t = tLen ? tLen(i) : (N > 1 ? i / (N - 1) : 0);
    for (const sg of [-1, 1]) { positions.push(s.x - s.ty * s.half * sg, s.y + s.tx * s.half * sg, s.z); uv.push(t, sg * 0.5 + 0.5); }
    if (i < N - 1) { const a = i * 2; indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  return { positions, uv, indices, runs: 1, rad: 2 };
}
