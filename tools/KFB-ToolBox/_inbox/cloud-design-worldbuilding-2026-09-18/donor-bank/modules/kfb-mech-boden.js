// ============================================================================
// kfb-mech-boden.js — v8-Vorbereitung · Die Bodenlesung für Läufer
// ----------------------------------------------------------------------------
// DER BEFUND (walk-messung.js, MESSUNG 1): `surfaceAltitudeAt` weicht bis zu 17,5 %
// der Figurhöhe vom echten Mesh ab, und das Vorzeichen ist überwiegend „Funktion über
// Mesh" — die Füße SINKEN ein. Bei Flughöhe 0,03 u fällt das nicht auf. Bei Fußkontakt
// ist es der Unterschied zwischen Stehen und Waten. Der Wirt schreibt deshalb für Läufer
// „Raycast oder baryzentrische Lesung PFLICHT".
//
// ── WARUM HIER KEIN RAYCAST STEHT ───────────────────────────────────────────────
// Der Fehler liegt NICHT in der Funktion. Er liegt darin, sie am falschen Ort
// auszuwerten. Das Mesh ist `SphereGeometry(5, 256, 256)` mit `flatShading`: zwischen
// den Gitterpunkten ist es EBEN. `surfaceAltitudeAt(p)` liest das glatte Feld AN p —
// das Mesh dagegen liegt auf der Ebene durch die drei Gitterpunkte des Dreiecks, in
// dem p liegt.
//
// Also liest man das Feld an genau DIESEN drei Gitterpunkten und schneidet den Strahl
// vom Kugelmittelpunkt durch p mit deren Ebene. Das Ergebnis ist nicht „nah am Mesh",
// es IST das Mesh — bis auf Gleitkommarauschen. Kosten: drei Funktionsaufrufe und ein
// Kreuzprodukt. Kein `Raycaster`, keine 131 072 Dreiecke, kein BVH, nichts, was man je
// Bild nicht machen dürfte.
//
// `bodenMessung` schießt 48 Strahlen und braucht dafür Hunderte Millisekunden. Diese
// Lesung kostet pro Abfrage ~1 µs und ist exakt. Der Raycast bleibt trotzdem im Haus —
// aber als KONTROLLPROBE (`bodenTor`), nicht als Laufzeitweg. Ein Prüfwerkzeug ohne
// Kontrollprobe ist eine Meinung (PM-41).
//
// ── STATUS SEIT 1.9. ABENDS: DER WIRT HAT DEN LESER ─────────────────────────────
// v9 hat die Gitterlesung selbst gebaut, unabhängig und mit demselben Ergebnis
// (Δ 0,00001 u gegen den Kontrollstrahl; Raycast dort mit 8–21 ms je Strahl gemessen).
// Damit ist `makeBodenLeser` NICHT mehr der Laufzeitweg, sondern eine
// Vergleichsimplementierung — der Wirt behält den EINEN Leser für „wie hoch".
//
// Was aus dieser Datei bleibt und übernommen wird: `bodenTor()`. Es ist die Abnahme,
// nicht der Rechner. Zwei Leser für dieselbe Frage wären genau die Doppelung, die
// dieses Projekt an anderer Stelle als Schuld führt.
//
// `makeBodenLeser` bleibt trotzdem stehen, aus einem Grund: das Tor braucht eine
// zweite, unabhängig geschriebene Lesung, um die erste zu prüfen. Ein Tor, das den
// Prüfling selbst benutzt, prüft nichts. Wer das Tor laufen lässt, reicht deshalb den
// WIRTS-Leser als `leser` herein und bekommt beide gegen den Raycast gestellt.
//
// ── DIE EINE VORAUSSETZUNG ──────────────────────────────────────────────────────
// Diese Datei kennt die Vertex-Formel von `THREE.SphereGeometry` auswendig. Ändert
// jemand Geometrie, Segmentzahl oder `phiStart`, stimmt die Lesung nicht mehr — und
// `bodenTor` sagt es sofort. Deshalb ist das Tor Pflicht beim Einbau, nicht Kür.
// (Stand 1.9.: Globus unverändert — Radius 5, 256 Segmente.)
// ============================================================================

export const ROLLE = {
  leser: 'Vergleichsimplementierung — der Wirt (v9) besitzt den Laufzeit-Leser',
  tor: 'bodenTor() ist die Abnahme und wird übernommen',
  regel: 'ein Leser für „wie hoch", nie zwei'
};

export const version = 'mb-v1';

/* Die Vertex-Formel aus three.js `SphereGeometry` (r160), unverändert übernommen:
     theta = v · π          v = iy / heightSegments
     phi   = u · 2π         u = ix / widthSegments
     x = -R·cos(phi)·sin(theta) · y = R·cos(theta) · z = R·sin(phi)·sin(theta)
   Der Vorzeichenwechsel bei x ist KEIN Tippfehler — er steht so in der Quelle, und wer
   ihn beim Rückrechnen vergisst, liest das Gelände spiegelverkehrt. */
function gitterRichtung(ix, iy, wSeg, hSeg, out) {
  const theta = (iy / hSeg) * Math.PI;
  const phi = (ix / wSeg) * Math.PI * 2;
  const st = Math.sin(theta);
  out[0] = -Math.cos(phi) * st;
  out[1] = Math.cos(theta);
  out[2] = Math.sin(phi) * st;
  return out;
}

/**
 * Baut den Leser. Der Wirt reicht seine eigene Höhenfunktion herein — dieses Modul
 * importiert `terrain-surface.js` bewusst NICHT, damit es keine zweite Meinung über
 * das Gelände geben kann.
 *
 * @param o.alt          (seed, type, nx, ny, nz) → Displacement. Also `surfaceAltitudeAt`.
 * @param o.seed         derselbe Seed, mit dem das Mesh gebacken wurde
 * @param o.terrainType  dito
 * @param o.radius       Basisradius (5)
 * @param o.segments     Segmentzahl (256) — width UND height, wie `createGlobe` sie setzt
 */
export function makeBodenLeser(o) {
  const alt = o.alt;
  const seed = o.seed, type = o.terrainType;
  const R = o.radius != null ? o.radius : 5;
  const W = o.segments != null ? o.segments : 256;
  const H = o.segments != null ? o.segments : 256;
  if (typeof alt !== 'function') throw new Error('[mech-boden] alt() fehlt — ohne die Höhenfunktion des Wirts gibt es keine Lesung');

  // Ein-Facetten-Cache: ein Läufer bleibt viele Bilder lang in derselben Zelle.
  let cIx = -1, cIy = -1, cTri = -1;
  const P = [new Float64Array(3), new Float64Array(3), new Float64Array(3)];
  const N = new Float64Array(3);
  const d0 = new Float64Array(3);
  let treffer = 0, verfehlt = 0;

  const eckPunkt = (ix, iy, out) => {
    gitterRichtung(ix, iy, W, H, d0);
    const disp = alt(seed, type, d0[0], d0[1], d0[2]);
    const r = R + disp;
    out[0] = d0[0] * r; out[1] = d0[1] * r; out[2] = d0[2] * r;
    return out;
  };

  const bakeFacette = (ix, iy, tri) => {
    /* three.js legt je Zelle: a = (iy, ix+1) · b = (iy, ix) · c = (iy+1, ix) · d = (iy+1, ix+1)
       und schiebt (a,b,d) sowie (b,c,d) in den Index. Die Diagonale läuft also b→d.
       tri 0 = (b,c,d)  (der Teil mit fy ≥ fx) · tri 1 = (a,b,d)  (fx > fy). */
    if (tri === 0) { eckPunkt(ix, iy, P[0]); eckPunkt(ix, iy + 1, P[1]); eckPunkt(ix + 1, iy + 1, P[2]); }
    else { eckPunkt(ix + 1, iy, P[0]); eckPunkt(ix, iy, P[1]); eckPunkt(ix + 1, iy + 1, P[2]); }
    const ax = P[1][0] - P[0][0], ay = P[1][1] - P[0][1], az = P[1][2] - P[0][2];
    const bx = P[2][0] - P[0][0], by = P[2][1] - P[0][1], bz = P[2][2] - P[0][2];
    N[0] = ay * bz - az * by; N[1] = az * bx - ax * bz; N[2] = ax * by - ay * bx;
    cIx = ix; cIy = iy; cTri = tri;
  };

  /**
   * DIE LESUNG. `nx,ny,nz` ist eine Richtung vom Kugelmittelpunkt (muss nicht normiert sein).
   * Zurück kommt, was ein Fuß dort tatsächlich vorfindet:
   *   hoehe   Abstand vom Mittelpunkt bis zur Mesh-Oberfläche (also R + Displacement der FACETTE)
   *   disp    dasselbe minus R — direkt vergleichbar mit `surfaceAltitudeAt`
   *   nx/ny/nz  Facettennormale, nach außen orientiert (für Neigung und Ausrichtung)
   *   neigung Winkel zwischen Normale und Radialrichtung in rad — die Steigung unter dem Fuß
   */
  function lies(nx, ny, nz) {
    let L = Math.hypot(nx, ny, nz) || 1;
    const dx = nx / L, dy = ny / L, dz = nz / L;
    const theta = Math.acos(Math.max(-1, Math.min(1, dy)));
    let phi = Math.atan2(dz, -dx);
    if (phi < 0) phi += Math.PI * 2;
    const u = (phi / (Math.PI * 2)) * W;
    const v = (theta / Math.PI) * H;
    let ix = Math.floor(u), iy = Math.floor(v);
    if (ix >= W) ix = W - 1; if (ix < 0) ix = 0;
    if (iy >= H) iy = H - 1; if (iy < 0) iy = 0;
    const fx = u - ix, fy = v - iy;
    /* Polkappen: bei iy = 0 fehlt das Dreieck (a,b,d), bei iy = H−1 fehlt (b,c,d) —
       three.js lässt sie weg, weil dort zwei Ecken zusammenfallen. Wer das ignoriert,
       liest am Pol eine Ebene, die es im Mesh nicht gibt. */
    let tri = fy >= fx ? 0 : 1;
    if (iy === 0) tri = 0;
    else if (iy === H - 1) tri = 1;

    if (ix !== cIx || iy !== cIy || tri !== cTri) { bakeFacette(ix, iy, tri); verfehlt++; } else treffer++;

    const nd = N[0] * dx + N[1] * dy + N[2] * dz;
    if (Math.abs(nd) < 1e-12) {
      // Blickrichtung streift die Facette — kann bei entarteten Poldreiecken passieren.
      const disp = alt(seed, type, dx, dy, dz);
      return { hoehe: R + disp, disp, nx: dx, ny: dy, nz: dz, neigung: 0, entartet: true };
    }
    const np = N[0] * P[0][0] + N[1] * P[0][1] + N[2] * P[0][2];
    const t = np / nd;
    let ln = Math.hypot(N[0], N[1], N[2]) || 1;
    let s = nd < 0 ? -1 : 1;                       // Normale nach außen drehen
    const ox = (N[0] / ln) * s, oy = (N[1] / ln) * s, oz = (N[2] / ln) * s;
    const cos = Math.max(-1, Math.min(1, ox * dx + oy * dy + oz * dz));
    return { hoehe: t, disp: t - R, nx: ox, ny: oy, nz: oz, neigung: Math.acos(cos), entartet: false };
  }

  /** Bequemlichkeit für den Frame-Loop: Vector3 rein, Vector3-taugliche Zahlen raus. */
  function liesVec(v) { return lies(v.x, v.y, v.z); }

  /** Facettenkante am gelesenen Ort — der Maßstab, in dem „eben" hier überhaupt bedeutet. */
  function facettenKante(nyLat) {
    const st = Math.sqrt(Math.max(0, 1 - nyLat * nyLat));
    return (2 * Math.PI * R * st) / W;
  }

  function statistik() { return { cacheTreffer: treffer, cacheVerfehlt: verfehlt, quote: treffer / Math.max(1, treffer + verfehlt) }; }

  return { lies, liesVec, facettenKante, statistik, radius: R, segments: W, version };
}

// ============================================================================
// DIE KONTROLLPROBE
// ----------------------------------------------------------------------------
// Der Raycast ist teuer und deshalb kein Laufzeitweg — aber er ist die Wahrheit, gegen
// die diese Lesung sich beweisen muss. Das Tor schießt dieselben Strahlen wie
// `walk-messung.bodenMessung`, stellt aber DREI Zahlen nebeneinander statt zwei:
// Funktion, Lesung, Mesh. Erst damit sieht man, dass die Lesung nicht bloß „auch anders"
// ist, sondern genau richtig.
// ============================================================================

export function bodenTor(o) {
  const THREE = o.THREE, mesh = o.mesh, leser = o.leser;
  const R = o.radius != null ? o.radius : 5;
  const figur = o.figur != null ? o.figur : 0.15;
  const N = o.punkte != null ? o.punkte : 48;
  const alt = o.alt;
  if (!THREE || !mesh || !leser) return { ok: false, text: '– kein Mesh oder kein Leser (Tor nicht gelaufen)', zeilen: [] };

  let s = (o.stichprobenSeed != null ? o.stichprobenSeed : 4242) | 0;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };

  const ray = new THREE.Raycaster(); ray.far = R * 2.5;
  const up = new THREE.Vector3(), ab = new THREE.Vector3();
  mesh.updateWorldMatrix(true, false);

  let maxLes = 0, maxFun = 0, sumLes = 0, sumFun = 0, n = 0;
  const t0 = (performance && performance.now) ? performance.now() : 0;
  for (let i = 0; i < N; i++) {
    const z = rnd() * 2 - 1, phi = rnd() * Math.PI * 2, st = Math.sqrt(1 - z * z);
    up.set(st * Math.cos(phi), z, st * Math.sin(phi));
    ab.copy(up).negate();
    ray.set(up.clone().multiplyScalar(R + 1.2), ab);
    const hits = ray.intersectObject(mesh, false);
    if (!hits.length) continue;
    n++;
    const mMesh = hits[0].point.length() - R;
    const mLes = leser.lies(up.x, up.y, up.z).disp;
    const dLes = Math.abs(mLes - mMesh);
    sumLes += dLes; if (dLes > maxLes) maxLes = dLes;
    if (typeof alt === 'function') {
      const dFun = Math.abs(alt(o.seed, o.terrainType, up.x, up.y, up.z) - mMesh);
      sumFun += dFun; if (dFun > maxFun) maxFun = dFun;
    }
  }
  const ms = ((performance && performance.now) ? performance.now() : 0) - t0;
  const pc = (x) => (x / figur * 100);
  // Toleranz: eine Facettenkante ist am Äquator 0,1227 u. Alles unter 1e-4 u ist
  // Gleitkommarauschen, nicht Geometrie.
  const ok = n > 0 && maxLes <= 1e-4;

  const zeilen = [
    'Lesung vs Mesh:   max ' + maxLes.toExponential(2) + ' u  (' + pc(maxLes).toFixed(4) + ' % der Figur)  ·  Mittel ' + (n ? sumLes / n : 0).toExponential(2),
    'Funktion vs Mesh: max ' + maxFun.toFixed(4) + ' u  (' + pc(maxFun).toFixed(1) + ' % der Figur)  ·  Mittel ' + (n ? sumFun / n : 0).toFixed(4),
    'Verbesserung: Faktor ' + (maxLes > 0 ? (maxFun / maxLes).toFixed(0) : '∞'),
    'Stichprobe ' + n + '/' + N + ' Treffer  ·  ' + ms.toFixed(0) + ' ms (Raycast, NUR Kontrollprobe)',
    'Cache: ' + JSON.stringify(leser.statistik())
  ];
  return {
    ok, maxLesung: maxLes, maxFunktion: maxFun, gezaehlt: n, zeilen,
    text: (ok ? '✓ ' : '✗ ') + 'facet read is exact (' + maxLes.toExponential(1) + ' u) where the function is off by '
          + maxFun.toFixed(4) + ' u = ' + pc(maxFun).toFixed(1) + ' % of figure height'
  };
}

/* Für den Handover in einer Zeile zitierbar. */
export const SINK_BEFUND = {
  quelle: 'walk-messung.js MESSUNG 1 (v7)',
  fehler: 'bis 17,5 % der Figurhöhe, Vorzeichen überwiegend „Funktion über Mesh" → Füße sinken ein',
  ursache: 'flatShading: das Mesh ist zwischen den Gitterpunkten EBEN, die Funktion ist stetig',
  loesung: 'dasselbe Feld an den drei Gitterpunkten der Facette lesen und den Radialstrahl mit deren Ebene schneiden',
  kosten: '3 Funktionsaufrufe + 1 Kreuzprodukt je Abfrage, Facetten-Cache greift über viele Bilder',
  nichtLoesung: 'Raycast je Bild — 131 072 Dreiecke, Hunderte ms bei 48 Strahlen'
};
