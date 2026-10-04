// ============================================================================
// walk-messung.js — v7 · Die ZWEI Messungen VOR dem Walk-Slice (LIVING §05v)
// ----------------------------------------------------------------------------
// E-43 ist entschieden (Walk = Skin am unsichtbaren Fahrzeug). Zwei Messungen gehören
// laut §05v ausdrücklich VOR den Bau, nicht in ihn — und beide sind hier Instrumente,
// keine Behauptungen:
//
//   1 **Bodenhöhe aus dem MESH statt aus der Funktion.** `surfaceAltitudeAt` ist stetig,
//     das Mesh ist zwischen den Vertices FLACH (`flatShading`, und die Facetten SIND der
//     Look). Bei Flughöhe 0,03 fällt die Differenz nicht auf; bei Fußkontakt ist sie der
//     Unterschied zwischen „stehen" und „im Boden waten". Diese Messung schießt Strahlen
//     auf das echte Mesh und stellt die Zahlen nebeneinander.
//
//   2 **Der Maßstab.** Horizont √(2·r·h) und Umrundungszeit sind zwei Formeln, keine
//     Meinung. Das Instrument rechnet sie und rechnet die DREI Hebel zurück (größerer
//     Radius · kleinere Figur · engere Kamera), damit die Entscheidung Zahlen hat.
//
// **Warum als eigene Datei und nicht im Runner:** ein Messgerät, das im Frame-Loop wohnt,
// wird irgendwann zum Feature. Diese Datei rendert nichts, ändert nichts und läuft nur,
// wenn jemand den Knopf drückt. `bodenMessung` schießt 48 Strahlen auf 131 072 Dreiecke —
// das ist Hunderte Millisekunden und darf niemals je Bild passieren.
//
// PM-50: **jede Messung protokolliert ihre Umgebung mit.** Beide Berichte tragen deshalb
// `hidden` und die Stichprobengröße im Text.
// ============================================================================

import { surfaceAltitudeAt } from './terrain-surface.js';

/** Deterministische Stichprobe — eine Messung, die sich nicht wiederholen lässt, ist eine
 *  Anekdote. Gleicher Seed ⇒ gleiche Punkte ⇒ vergleichbare Läufe über Sitzungen hinweg. */
function lcg(seed) {
  let s = (seed | 0) || 12345;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
}

/**
 * MESSUNG 1 · Funktion gegen Mesh.
 *
 * @param o.THREE       three-Namensraum (der Runner besitzt ihn)
 * @param o.mesh        das Kugel-Mesh (`globe.mesh`) — nicht die Gruppe
 * @param o.seed        derselbe Seed, mit dem das Mesh gebacken wurde
 * @param o.terrainType dito
 * @param o.radius      Basisradius (5)
 * @param o.segmente    Segmentzahl (256) — nur für die Facettenkante
 * @param o.figur       Figurhöhe in u (0,15) — der Bezug, in dem die Abweichung WEHTUT
 * @param o.punkte      Stichprobe (Standard 48)
 */
export function bodenMessung(o = {}) {
  const THREE = o.THREE, mesh = o.mesh;
  const R = o.radius != null ? o.radius : 5;
  const segmente = o.segmente != null ? o.segmente : 256;
  const figur = o.figur != null ? o.figur : 0.15;
  const N = o.punkte != null ? o.punkte : 48;
  if (!THREE || !mesh) return { ok: false, text: '– no mesh (measurement not run)', zeilen: [] };

  const t0 = (performance && performance.now) ? performance.now() : 0;
  const rnd = lcg(o.stichprobenSeed != null ? o.stichprobenSeed : 4242);
  const ray = new THREE.Raycaster();
  ray.far = R * 2.5;
  const up = new THREE.Vector3(), ab = new THREE.Vector3();
  mesh.updateWorldMatrix(true, false);

  let maxAbw = 0, summe = 0, gezaehlt = 0, treffer = 0, schlimmster = null;
  let funcUeber = 0, meshUeber = 0;

  for (let i = 0; i < N; i++) {
    // Gleichverteilt auf der Kugel (z-Trick), nicht in Kugelkoordinaten gewürfelt —
    // letzteres häuft Punkte an den Polen und misst dort dreimal.
    const z = rnd() * 2 - 1, phi = rnd() * Math.PI * 2, s = Math.sqrt(1 - z * z);
    up.set(s * Math.cos(phi), z, s * Math.sin(phi));
    ab.copy(up).negate();
    ray.set(up.clone().multiplyScalar(R + 1.2), ab);
    const hits = ray.intersectObject(mesh, false);
    if (!hits.length) continue;
    treffer++;
    const meshDisp = hits[0].point.length() - R;
    const funcDisp = surfaceAltitudeAt(o.seed, o.terrainType, up.x, up.y, up.z);
    const d = funcDisp - meshDisp;
    if (d > 0) funcUeber++; else if (d < 0) meshUeber++;
    const a = Math.abs(d);
    summe += a; gezaehlt++;
    if (a > maxAbw) { maxAbw = a; schlimmster = { d, funcDisp, meshDisp }; }
  }

  const kante = (2 * Math.PI * R) / segmente;          // Facettenkante am Äquator
  const mittel = gezaehlt ? summe / gezaehlt : 0;
  const dauer = ((performance && performance.now) ? performance.now() : 0) - t0;
  const proz = (x) => (x / figur * 100);

  const zeilen = [
    'facet edge (equator): ' + kante.toFixed(4) + ' u  ·  figure ' + figur.toFixed(3)
      + ' u  →  one facet is ' + (kante / figur).toFixed(2) + '× the figure',
    'max |function − mesh|: ' + maxAbw.toFixed(4) + ' u  =  ' + proz(maxAbw).toFixed(1) + ' % of figure height',
    'mean |function − mesh|: ' + mittel.toFixed(4) + ' u  =  ' + proz(mittel).toFixed(1) + ' %',
    'sign: function above mesh ' + funcUeber + '× (feet sink), mesh above function '
      + meshUeber + '× (feet float)',
    'samples ' + gezaehlt + '/' + N + ' hit  ·  ' + dauer.toFixed(0) + ' ms  ·  hidden: '
      + (typeof document !== 'undefined' ? String(document.hidden) : 'n/a'),
  ];

  // **Das Urteil, und es ist ein Urteil über den WALK, nicht über das Terrain.**
  // Bei Flughöhe 0,03 ist alles unter ~30 % der Flughöhe unsichtbar. Bei Fußkontakt ist
  // der Bezug die Figur: mehr als 5 % ihrer Höhe sieht man als Waten oder Schweben.
  const urteilOk = proz(maxAbw) <= 5;
  return {
    ok: urteilOk, maxAbw, mittel, kante, figur, gezaehlt, dauer, schlimmster, zeilen,
    text: (urteilOk ? '✓ ' : '✗ ') + 'max ' + maxAbw.toFixed(4) + ' u ('
          + proz(maxAbw).toFixed(1) + ' % of figure) over ' + gezaehlt + ' rays'
          + (urteilOk ? '' : '  ·  a walker needs a raycast or barycentric read, not surfaceAltitudeAt'),
  };
}

/**
 * MESSUNG 2 · Der Maßstab. Rechnet nur — keine Szene, kein Strahl.
 *
 * Zwei Formeln:
 *   Horizont   d = √(2·r·h)      (Kugelhorizont bei Augenhöhe h)
 *   Umrundung  T = 2πr / v
 *
 * Und dann die drei Hebel als ZAHL, nicht als Vorschlag: welcher Radius, welche Figurhöhe,
 * welches Tempo würde das Ziel erreichen.
 */
export function massstabMessung(o = {}) {
  const R = o.radius != null ? o.radius : 5;
  const figur = o.figur != null ? o.figur : 0.15;
  const auge = o.auge != null ? o.auge : figur * 0.8;
  // Gehtempo aus dem KÖRPERMASS, nicht geraten: ein Mensch (1,7 m) geht 1,4 m/s
  // = 0,82 Körperhöhen/s. Dieselbe Verhältniszahl auf unsere Figur.
  const geh = o.geh != null ? o.geh : figur * 0.82;
  const reise = o.reise != null ? o.reise : 0.28;   // Reisetempo der Physik
  const spitze = o.spitze != null ? o.spitze : 0.78; // maxSpeed
  const zielHorizont = o.zielHorizont != null ? o.zielHorizont : 4.0;   // u — „Landschaft" statt „Kuppe"
  const zielUmrundung = o.zielUmrundung != null ? o.zielUmrundung : 900; // s — 15 min zu Fuß

  const horizont = Math.sqrt(2 * R * auge);
  const umfang = 2 * Math.PI * R;
  const tFuss = umfang / geh, tReise = umfang / reise, tSpitze = umfang / spitze;

  // Hebel 1 · größerer Radius (eigene Welt): beide Ziele zugleich.
  const rFuerHorizont = (zielHorizont * zielHorizont) / (2 * auge);
  const rFuerZeit = (geh * zielUmrundung) / (2 * Math.PI);
  // Hebel 2 · Figurgröße bei r = 5. ⚠ **Die zwei Ziele ziehen GEGENEINANDER, und das war in
  // §05v nicht gesehen:** eine kleinere Figur geht langsamer (Tempo hängt am Körpermaß), die
  // Umrundung wird also länger — aber ihre Augenhöhe sinkt, der Horizont rückt NÄHER. Die
  // Zahl unten ist deshalb keine Empfehlung, sondern der Beweis, dass dieser Hebel den
  // Horizont nicht kaufen kann: er zeigt nach OBEN (größere Figur), und zwar absurd weit.
  const augeFuerHorizont = (zielHorizont * zielHorizont) / (2 * R);
  const figurFuerHorizont = augeFuerHorizont / 0.8;
  // Hebel 3 · engere Kamera: kein Maßstab, sondern ein Ausschnitt. Sie kauft die
  // gefühlte Größe, ohne die Uhr zu ändern — deshalb steht hier ein Verhältnis,
  // keine Sekundenzahl.
  const kameraFaktor = horizont / zielHorizont;
  // **Kontrollprobe gegen die eigene Akte (PM-41).** §05v behauptet „Weltumrundung zu Fuß
  // ~105 s, also genauso schnell wie fliegend". 105 s auf 31,42 u sind 0,30 u/s — bei einer
  // 0,15 u hohen Figur sind das ZWEI Körperhöhen je Sekunde, also Sprint, nicht Gang. Das
  // Instrument rechnet den Wert nach und nennt die Annahme, die drinsteckt.
  const tempoFuer105 = umfang / 105;
  const hoehenProSek = tempoFuer105 / figur;

  const min = (s) => (s / 60).toFixed(1) + ' min';
  const zeilen = [
    'horizon at eye height ' + auge.toFixed(3) + ' u: ' + horizont.toFixed(2)
      + ' u  (target ' + zielHorizont.toFixed(1) + ' u → ' + (horizont / zielHorizont).toFixed(2) + '× short)',
    'circumference ' + umfang.toFixed(1) + ' u  ·  on foot at ' + geh.toFixed(3) + ' u/s: '
      + tFuss.toFixed(0) + ' s (' + min(tFuss) + ')',
    'flying: cruise ' + reise.toFixed(2) + ' u/s → ' + tReise.toFixed(0) + ' s  ·  top '
      + spitze.toFixed(2) + ' u/s → ' + tSpitze.toFixed(0) + ' s  →  walking is '
      + (tFuss / tReise).toFixed(1) + '× the cruise lap',
    'lever 1 · bigger world: r = ' + rFuerHorizont.toFixed(1) + ' u for a ' + zielHorizont.toFixed(1)
      + ' u horizon  ·  r = ' + rFuerZeit.toFixed(1) + ' u for a ' + min(zielUmrundung) + ' lap on foot',
    'lever 2 · figure size at r = ' + R + ': the two goals pull APART — a smaller figure walks '
      + 'slower (longer lap) but sees LESS far. A ' + zielHorizont.toFixed(1) + ' u horizon would need '
      + figurFuerHorizont.toFixed(2) + ' u of height (' + (figurFuerHorizont / figur).toFixed(0)
      + '× today, taller than the mountains) — this lever cannot buy the horizon',
    'lever 3 · tighter camera: the view is ' + kameraFaktor.toFixed(2)
      + '× the target horizon — an aperture, not a scale; the lap time does not move',
    'check on §05v („~105 s on foot, as fast as flying“): 105 s needs '
      + tempoFuer105.toFixed(2) + ' u/s = ' + hoehenProSek.toFixed(1)
      + ' figure heights per second — that is a sprint, not a walk. At a human ratio (0.82 h/s) the lap is '
      + tFuss.toFixed(0) + ' s = ' + (tFuss / tReise).toFixed(1) + '× the cruise lap',
  ];

  return {
    horizont, umfang, tFuss, tReise, tSpitze, geh, auge, figur,
    rFuerHorizont, rFuerZeit, figurFuerHorizont, kameraFaktor, tempoFuer105, hoehenProSek, zeilen,
    // KEIN ✓/✗: das ist eine Entscheidung, kein Tor. Ein Instrument, das eine Designfrage
    // als „durchgefallen" ausgibt, entscheidet sie heimlich — und diese gehört Georg (§5.7).
    text: 'horizon ' + horizont.toFixed(2) + ' u  ·  lap on foot ' + tFuss.toFixed(0)
          + ' s vs cruise ' + tReise.toFixed(0) + ' s  ·  decision open (LIVING §05v, Onboarding §5.7)',
  };
}
