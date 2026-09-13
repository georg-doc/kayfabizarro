// ============================================================================
// ts-flora.js — v12 · Vegetation NACH TS-ART: gebaut statt geladen
// ----------------------------------------------------------------------------
// **Der Befund aus v11, gemessen an der Welt und am Vorbild (Georg, 2.9. abends):** die KayKit-
// und Kenney-Stücke sehen wie Fremdkörper aus, und die Rule of Three war unter dem Rauschen nicht
// mehr zu sehen. Der Grund liegt nicht in der Streuung — die stimmt (Familien-Abstand-Tor) — und
// auch nicht im Maßstab (Kit-Faktor, Familienboden). Er liegt **eine Ebene tiefer, im Material**:
//
//   Vorbild (tinyskies)                   |  v11 (KayKit/Kenney GLB)
//   ------------------------------------- | --------------------------------------------
//   Geometrie prozedural, wenige Facetten |  fertig modelliert, kontextlos
//   AO in die VERTEXFARBE gebacken        |  keine AO — Fläche liegt platt auf dem Boden
//   Fresnel-Saum (RimLight.ts)            |  Lambert ohne Saum
//   Wind je Höhe im Vertex-Shader         |  starr
//   Dichtefeld steuert die Platzierung    |  gleichmäßige Streuung über alles Land
//
// Vier von fünf Zeilen sind **keine Modell-Eigenschaft, sondern eine Bau-Eigenschaft**. Ein
// gekauftes GLB kann sie nicht mitbringen — es weiß nichts von unserer Sonne, unserem Saum und
// unserem Wind. Deshalb wird die Vegetation ab v12 gebaut, nicht geladen.
//
// **Was dieses Modul tut:**
//   1. Baut je Art 3–4 Varianten aus Primitiven (Kegel, Zylinder, Ikosaeder), verschmilzt sie zu
//      EINER Geometrie je Variante und fährt sie als InstancedMesh — 1 Draw-Call je Variante.
//   2. Backt **AO in die Vertexfarbe**: unten dunkel, oben hell, Kroneninneres dunkler als der
//      Rand. Das ist der Unterschied zwischen „steht auf dem Boden" und „liegt auf dem Boden".
//   3. Setzt den **Fresnel-Saum** (rim-light.js, dieselbe Datei wie der Teppich) auf jedes
//      Material — kein zweiter Draw-Call, dieselbe Randfarbe wie der Rest der Welt.
//   4. Bewegt die Stücke im **Vertex-Shader nach Höhe** (`aHeight`), Phase je Exemplar aus der
//      Instanzmatrix. Ein Baum wiegt sich in der Krone, nicht im Stamm; Gras wiegt sich ganz.
//   5. Platziert auf der **gleichmäßigen** Streuungsschicht (`streuen()`, Fibonacci + Nachrücken)
//      und entscheidet die ART und die BÜSCHELGRÖSSE aus GELÄNDEGRÜNDEN — Höhenband, Steilheit,
//      Biomgewicht. Siehe die Warnung unten: das ist die zweite Fassung.
//
// ⚠ **Die erste Fassung hatte hier ein eigenes Simplex-„Dichtefeld", und Georg hat es sofort
// gesehen: „die blob-artige Verteilung ist unser altes Asset-Verteilungs-Problem".** Er hat
// recht, und die Antwort steht schon in unserer eigenen Datei `verteilung.js` (v9): ein
// tieffrequentes Rauschen als An/Aus-Maske erzeugt genau die runden **Ballungen und
// Leerflächen**, gegen die die Streuungsschicht überhaupt gebaut wurde. Ich habe die Pathologie
// wieder eingebaut, die wir zwei Versionen vorher ausgebaut hatten — nur diesmal mit Absicht,
// was es schlimmer macht, nicht besser.
//
// **Und wie macht es das Vorbild?** Nicht mit einem Dichtefeld. Nach unserem eigenen Quellbericht
// (verteilung.js, Kopf) verteilt tinyskies auf einem **Fibonacci-Gitter mit Jitter** — von sich
// aus gleichmäßig — und hat daneben **ausdrückliche Cluster-Props** (Kokosgruppen 4–9,
// Felsgruppen 3–5), die eng stehen SOLLEN. Die Ungleichmäßigkeit ist dort also lokal und
// gewollt, nicht global und gewürfelt. Ein Wald entsteht nicht aus einer Rauschblase, sondern
// daraus, dass Bäume dort stehen, wo Bäume stehen können.
//
// Deshalb jetzt: **Orte gleichmäßig, Vorliebe aus dem Gelände.** Die Grenze eines Waldes ist
// dann eine Baumgrenze, eine Hangkante oder ein Biomrand — die folgen dem Terrain und sind
// deshalb gefranst statt rund. Und wo die Vorliebe schwach ist, steht ein EINZELNER Baum statt
// keiner: der einsame Baum am Grat ist das, was eine Landschaft lesbar macht.
//
// **Was dieses Modul NICHT tut:** Modelle laden (dafür bleibt flora.js), eigene Zufallsorte
// würfeln (`streuen()`), den Boden rechnen (`bodenRadius`), eine zweite Randfarbe führen
// (`initRimLight`), eine eigene Uhr mitbringen (`update(dt)` aus dem Frame-Loop — PM-50).
//
// **Und was mit den Kits passiert:** sie bleiben, aber als KOMBI-Module an wenigen Orten
// (Stumpf + Pilze, Fels + Bäume + Kiesel) — nicht mehr einzeln über die ganze Kugel gestreut.
// Das ist der Teil, den ein Kit gut kann: ein Blickfang mit Geschichte. Die Fläche baut v12.
// ============================================================================
import { streuen } from './verteilung.js';
import { isLand } from './globe-field.js';
import { BAUM_WELT } from './kit-massstab.js';
import { surfaceAltitudeAt } from './terrain-surface.js';
import { bueschel } from './formation.js';
import { biomeWeightsAt, BIOMES } from './globe-biome.js';
import { initRimLight, addRimLight } from './rim-light.js';

function seededRandom(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

// ── Die Palette. Zwei Grüns je Art, damit ein Wald nicht EINE Farbe ist ────────────────
// Werte gegen die Bodenfarben der Welt gewählt (globe.js, Biome) — die Vegetation muss auf dem
// Gras stehen, nicht davor. Herbst ist selten und Absicht: ein Farbtupfer je ~12 Laubbäumen.
const FARBE = {
  stamm:    [0x5a4632, 0x4a392a, 0x6b5340],
  nadel:    [0x38623a, 0x2c5232, 0x436e3c],
  laub:     [0x4e7a35, 0x44702f, 0x5a8a3c],
  herbst:   [0xb5793a, 0xc98c3c],
  busch:    [0x466f34, 0x52803b],
  gras:     [0x74963f, 0x82a24a, 0x668a38],
  bluete:   [0xd95a5a, 0xe0c04a, 0xc07ad0, 0xe8e2d2],
};

/** AO in die Vertexfarbe backen — die eine Zeile, die den Unterschied macht.
 *  `unten`/`oben` sind Multiplikatoren auf die Grundfarbe, `radial` hellt zum Rand hin auf
 *  (Kroneninneres bleibt dunkel). Höhe wird gegen die GESAMTHÖHE des Stücks normiert, nicht
 *  gegen die des Teils — sonst wäre jeder Stamm für sich genommen oben hell und die Naht sichtbar. */
function faerben(THREE, g, hexes, rnd, { H, unten = 0.42, oben = 1.0, radial = 0, rMax = 1, jitter = 0.05 }) {
  const c = new THREE.Color(hexes[Math.floor(rnd() * hexes.length)]);
  const pos = g.attributes.position, n = pos.count;
  const col = new Float32Array(n * 3), hgt = new Float32Array(n);
  const tmp = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const t = Math.max(0, Math.min(1, y / Math.max(1e-6, H)));
    let ao = unten + (oben - unten) * (t * t * (3 - 2 * t));
    if (radial) {
      const r = Math.sqrt(x * x + z * z) / Math.max(1e-6, rMax);
      ao *= 1 - radial * (1 - Math.min(1, r));
    }
    ao *= 1 + (rnd() - 0.5) * jitter;
    tmp.copy(c).multiplyScalar(ao);
    col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
    hgt[i] = t;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aHeight', new THREE.BufferAttribute(hgt, 1));
  return g;
}

function auf(THREE, g, y, dx = 0, dz = 0) { g.translate(dx, y, dz); return g; }
function roh(THREE, g) { g.deleteAttribute('uv'); return g.index ? g.toNonIndexed() : g; }

/** Ein Ikosaeder mit verzogenen Ecken — die Laubkugel, die nie eine Kugel ist. */
function blob(THREE, r, rnd, squash = 0.85, wobble = 0.22) {
  const g = new THREE.IcosahedronGeometry(r, 0);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const f = 1 + (rnd() - 0.5) * wobble;
    p.setXYZ(i, p.getX(i) * f, p.getY(i) * f * squash, p.getZ(i) * f);
  }
  g.computeVertexNormals();
  return g;
}

// ── Die Arten. Jede gibt {teile:[{g,hexes,opt}], H} zurück; verschmolzen wird zentral ───────
const ARTEN = {
  nadel(THREE, rnd, H) {
    const rStamm = H * 0.035, hStamm = H * 0.30;
    const teile = [{ g: roh(THREE, auf(THREE, new THREE.CylinderGeometry(rStamm * 0.75, rStamm, hStamm, 5), hStamm / 2)),
                     hexes: FARBE.stamm, opt: { unten: 0.35, oben: 0.7 } }];
    const stufen = 3 + Math.floor(rnd() * 2);
    let y = H * 0.22, rr = H * 0.30, hh = H * 0.34;
    for (let i = 0; i < stufen; i++) {
      teile.push({ g: roh(THREE, auf(THREE, new THREE.ConeGeometry(rr, hh, 6 + (i % 2), 1), y + hh / 2)),
                   hexes: FARBE.nadel, opt: { radial: 0.30, rMax: rr } });
      y += hh * 0.52; rr *= 0.70; hh *= 0.82;
    }
    return { teile, H };
  },
  laub(THREE, rnd, H) {
    const rStamm = H * 0.045, hStamm = H * 0.45;
    const teile = [{ g: roh(THREE, auf(THREE, new THREE.CylinderGeometry(rStamm * 0.7, rStamm * 1.25, hStamm, 5), hStamm / 2)),
                     hexes: FARBE.stamm, opt: { unten: 0.32, oben: 0.72 } }];
    const laub = rnd() < 0.08 ? FARBE.herbst : FARBE.laub;
    const n = 2 + Math.floor(rnd() * 2);
    for (let i = 0; i < n; i++) {
      const r = H * (0.30 - i * 0.055) * (0.85 + rnd() * 0.3);
      const y = H * (0.58 + i * 0.16), dx = (rnd() - 0.5) * H * 0.14, dz = (rnd() - 0.5) * H * 0.14;
      teile.push({ g: roh(THREE, auf(THREE, blob(THREE, r, rnd), y, dx, dz)),
                   hexes: laub, opt: { radial: 0.34, rMax: r } });
    }
    return { teile, H };
  },
  busch(THREE, rnd, H) {
    const teile = [], n = 2 + Math.floor(rnd() * 2);
    for (let i = 0; i < n; i++) {
      const r = H * (0.55 - i * 0.10) * (0.8 + rnd() * 0.4);
      teile.push({ g: roh(THREE, auf(THREE, blob(THREE, r, rnd, 0.72, 0.3), H * (0.42 + i * 0.22),
                                     (rnd() - 0.5) * H * 0.5, (rnd() - 0.5) * H * 0.5)),
                   hexes: FARBE.busch, opt: { unten: 0.38, radial: 0.28, rMax: r } });
    }
    return { teile, H };
  },
  gras(THREE, rnd, H) {
    // Halme sind dreiseitige Spitzen mit Neigung — bei 6 Halmen 36 Dreiecke, und aus der Luft
    // liest das als Büschel. Ein echtes Blatt-Quad bräuchte Alpha-Test und damit einen zweiten
    // Sortierdurchgang; das ist der Preis nicht wert.
    const teile = [], n = 5 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) {
      const h = H * (0.6 + rnd() * 0.55), r = H * 0.075;
      const g = new THREE.CylinderGeometry(0, r, h, 3);
      g.rotateZ((rnd() - 0.5) * 0.7); g.rotateX((rnd() - 0.5) * 0.7);
      teile.push({ g: roh(THREE, auf(THREE, g, h * 0.45, (rnd() - 0.5) * H * 0.7, (rnd() - 0.5) * H * 0.7)),
                   hexes: FARBE.gras, opt: { unten: 0.35, oben: 1.12, jitter: 0.14 } });
    }
    return { teile, H };
  },
  blume(THREE, rnd, H) {
    const teile = [], n = 3 + Math.floor(rnd() * 3);
    const ton = [FARBE.bluete[Math.floor(rnd() * FARBE.bluete.length)]];
    for (let i = 0; i < n; i++) {
      const h = H * (0.65 + rnd() * 0.4), dx = (rnd() - 0.5) * H * 0.8, dz = (rnd() - 0.5) * H * 0.8;
      teile.push({ g: roh(THREE, auf(THREE, new THREE.CylinderGeometry(H * 0.02, H * 0.028, h, 3), h / 2, dx, dz)),
                   hexes: FARBE.gras, opt: { unten: 0.4, oben: 0.95 } });
      teile.push({ g: roh(THREE, auf(THREE, blob(THREE, H * 0.11, rnd, 0.55, 0.15), h, dx, dz)),
                   hexes: ton, opt: { unten: 0.85, oben: 1.15, jitter: 0.08 } });
    }
    return { teile, H };
  },
};

export function createTsFlora({ THREE, radius, seed, terrainType, bodenRadius, salt = 4711,
                                params = {}, frei = null }) {
  const P = Object.assign({
    on: true,
    // Standorte je Art. Ein Standort ist ein BÜSCHEL, keine Einzelpflanze — wie viele Stücke
    // daraus werden, entscheidet die Vorliebe des Geländes (`vorliebe`), nicht ein Rauschfeld.
    anzahl: { nadel: 750, laub: 650, busch: 650, gras: 1000, blume: 340 },
    // Höchstzahl je Ort. Die WIRKLICHE Zahl steigt mit der Vorliebe (unten) — am Rand eines
    // Höhenbands steht ein einzelner Baum, in seiner Mitte eine Gruppe. Kein Ort ist leer.
    // Im Kern eines Höhenbands soll ein HAIN stehen, kein einzelner Baum — sonst ist die Welt
    // gleichmäßig bestreut statt bewachsen, und das ist nur der andere Fehler derselben Achse.
    proOrt: { nadel: 12, laub: 10, busch: 6, gras: 6, blume: 6 },
    vorliebeKurve: 1.25,        // <1 füllt die Ränder, >2 macht nur noch Kerne
    enge:   { nadel: 1.25, laub: 1.35, busch: 1.4, gras: 1.5, blume: 1.6 },   // Büschelradius × Grundradius
    hoehe:  { nadel: 1.15, laub: 0.95, busch: 0.34, gras: 0.30, blume: 0.26 },  // × BAUM_WELT
    varianten: { nadel: 4, laub: 4, busch: 3, gras: 3, blume: 3 },
    mindestVorliebe: 0.16,      // darunter wächst die Art hier nicht — die Grenze folgt dem Gelände
    steilMax: { nadel: 1.0, laub: 0.85, busch: 1.1, gras: 0.7, blume: 0.55 },
    sink: 0.06,                 // Anteil der Stückhöhe, um den es im Boden steckt
    // ⚠ **Wind, zweite Fassung.** Georg: „alle Bäume wehen im Wind wie Strohhalme". Gemessen ist
    // das kein Geschmack, sondern ein Einheitenfehler: `windAmp` war ABSOLUT (0,055 Weltmaß) und
    // ein Baum ist 0,067 hoch — die Krone wanderte um 80 % der Baumhöhe. Jetzt ist die Amplitude
    // ein ANTEIL DER STÜCKHÖHE, und ein Baum bewegt sich wie ein Baum: 1,5 % der Höhe, langsam.
    // Dazu der Exponent: bei `pow(h, 1.7)` bewegte sich der STAMM auf halber Höhe noch um 30 %
    // der Kronen-Auslenkung. Ein Stamm biegt sich nicht. Exponent 3 lässt die unteren zwei Drittel
    // praktisch stehen; Gras dagegen wiegt sich ganz (1,4) und schneller — kleine Dinge sind leicht.
    wind: 1.0,                  // Regler; 0 friert die Vegetation ein (für Screenshot-Beweise)
    windAmp:  { nadel: 0.014, laub: 0.020, busch: 0.022, gras: 0.11, blume: 0.10 },   // × Stückhöhe
    windExp:  { nadel: 3.0, laub: 2.6, busch: 2.2, gras: 1.4, blume: 1.6 },
    windFreq: { nadel: 0.5, laub: 0.55, busch: 0.7, gras: 1.7, blume: 1.5 },
    buendel: 24,                // Raumkacheln für das Aussortieren (siehe `bauen`)
    // Sichtweite: über dieser Höhe über Grund ist eine Pflanze kleiner als ein Bildpunkt, und
    // aus dem Orbit ist die ganze Schicht ein Grauschleier. Beides wird ABGESCHALTET statt
    // gezeichnet — das ist der Unterschied zwischen „der Renderer verwirft" und „wir fragen erst
    // gar nicht". 408 Skalarprodukte je Bild kosten nichts; 1,1 Mio. Dreiecke kosten alles.
    kappeHoehe: 1.30,           // ab dieser Kameradistanz (× Radius) ist die Schicht ganz aus
    sichtZuschlag: 0.50,        // Bogen über dem Horizont, in dem Kacheln noch gezeichnet werden
    rim: 0.55,
  }, params);

  const group = new THREE.Group(); group.name = 'ts-flora'; group.visible = !!P.on;
  const R = radius;
  const rnd = seededRandom((seed | 0) + salt);
  initRimLight(THREE);

  const uTime = { value: 0 }, uWind = { value: P.wind };
  const windUniformen = new Map();   // Art → { uAmp, uExp, uFreq, H } — je Material, geteiltes Programm
  const protokoll = { arten: {}, stuecke: 0, drawCalls: 0, dreiecke: 0, orte: 0, einzeln: 0, kacheln: 0 };
  const kachelNetze = new Map();   // Kachel-Index → Netze (für die Sichtweite)
  let sichtbar = 0, ausAlles = false;
  const orteListe = [];

  // ── Wo wächst was, und warum. Höhenband × Biomgewicht, beides GELÄNDE — keine Rauschmaske.
  // `band` ist die volle Spanne (außerhalb: gar nicht), `kern` die Spanne mit voller Vorliebe;
  // dazwischen fällt es weich ab. Die Biomzahlen sind Vorlieben, keine Schalter: eine Art
  // verschwindet an einem Biomrand nicht, sie wird seltener und steht dann einzeln.
  const VORLIEBE = {
    nadel: { band: [0.04, 0.62], kern: [0.16, 0.44], biom: { plateau: 0.85, spires: 1.0,  shatter: 0.9, flatwater: 0.3 } },
    laub:  { band: [0.00, 0.34], kern: [0.02, 0.20], biom: { plateau: 1.0,  spires: 0.25, shatter: 0.7, flatwater: 0.95 } },
    busch: { band: [0.00, 0.66], kern: [0.02, 0.46], biom: { plateau: 1.0,  spires: 0.75, shatter: 1.0, flatwater: 0.9 } },
    gras:  { band: [0.00, 0.50], kern: [0.00, 0.34], biom: { plateau: 1.0,  spires: 0.45, shatter: 0.85, flatwater: 1.0 } },
    blume: { band: [0.00, 0.28], kern: [0.00, 0.16], biom: { plateau: 0.9,  spires: 0.2,  shatter: 0.55, flatwater: 1.0 } },
  };
  const glatt = (t) => t * t * (3 - 2 * t);
  /** 0…1. EINE Funktion, drei Leser (Prädikat, Büschelgröße, Tor) — sonst hat die Baumgrenze
   *  im Bild eine andere Lage als im Bericht. */
  function vorliebe(art, n) {
    const V = VORLIEBE[art], h = hoeheAn(n);
    if (h < V.band[0] || h > V.band[1]) return 0;
    let f = 1;
    if (h < V.kern[0]) f = glatt((h - V.band[0]) / Math.max(1e-4, V.kern[0] - V.band[0]));
    else if (h > V.kern[1]) f = glatt(1 - (h - V.kern[1]) / Math.max(1e-4, V.band[1] - V.kern[1]));
    const w = biomeWeightsAt(n.x, n.y, n.z);
    let b = 0;
    for (let i = 0; i < 4; i++) b += w[i] * (V.biom[BIOMES[i].id] != null ? V.biom[BIOMES[i].id] : 0.6);
    return Math.max(0, Math.min(1, f * b));
  }

  const _q = new THREE.Vector3(), _Y = new THREE.Vector3(0, 1, 0);
  const _qq = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
  function versetztKlein(n, a, bogen, out) {
    const h = Math.abs(n.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const t1 = new THREE.Vector3().crossVectors(h, n).normalize(), t2 = new THREE.Vector3().crossVectors(n, t1).normalize();
    return out.copy(n).addScaledVector(t1, Math.cos(a) * Math.tan(bogen)).addScaledVector(t2, Math.sin(a) * Math.tan(bogen)).normalize();
  }
  // Vier Abtastungen statt sechs: bei 3 000 Standorten × Überzeichnung ist das der teuerste
  // Posten der Bauzeit, und der Unterschied zwischen 4 und 6 Richtungen war in keinem Bild zu sehen.
  function steil(n, weite) {
    if (!bodenRadius) return 0;
    const mitte = bodenRadius(n); let max = 0;
    for (let i = 0; i < 4; i++) {
      const r = bodenRadius(versetztKlein(n, (i / 4) * Math.PI * 2, weite / R, _q));
      if (r != null && mitte != null) max = Math.max(max, Math.abs(r - mitte));
    }
    return max / weite;
  }
  const land = (n) => isLand(seed, terrainType, n.x, n.y, n.z);
  const hoeheAn = (n) => surfaceAltitudeAt(seed, terrainType, n.x, n.y, n.z);
  const FREI_R = { nadel: 0.045, laub: 0.045, busch: 0.022, gras: 0.010, blume: 0.010 };
  const baumig = (a) => a === 'nadel' || a === 'laub';

  function praedikat(art) {
    const sm = P.steilMax[art];
    const fr = frei ? (n) => frei(n, FREI_R[art]) : () => true;
    return (n) => land(n) && vorliebe(art, n) >= P.mindestVorliebe && steil(n, 0.05) < sm && fr(n);
  }

  /** Ein Material je Variante — Phong wie die ganze Welt (to-phong.js), Saum wie der Teppich
   *  (rim-light.js), Wind als zweiter Patch auf demselben Shader. Kein zusätzlicher Draw-Call. */
  const matCache = new Map();
  function material(art, H) {
    if (matCache.has(art)) return matCache.get(art);
    const mat = new THREE.MeshPhongMaterial({ vertexColors: true, flatShading: true,
      shininess: 8, specular: new THREE.Color(0x111111), side: THREE.DoubleSide });
    const rimHook = (addRimLight(mat, null, P.rim, 3.0), mat.onBeforeCompile);
    // ⚠ **Die Windzahlen stehen als UNIFORM im Shader, nicht als Zahl IM Shader-Text — und das ist
    // kein Stil, sondern eine Reparatur.** Erste Fassung buk `amp`/`ex`/`fq` je Art als
    // Zeichenkette in `onBeforeCompile` ein. **three.js schlüsselt seinen Programm-Cache aber nach
    // den PARAMETERN eines Materials, nicht nach dem Text, den der Haken erzeugt** — und unsere
    // fünf Phong-Materialien sind parametergleich (`phong,highp,srgb,false,,false,false,false`).
    // Also wurde EIN Programm gebaut, aus dem Haken der zuerst lief (Nadel), und Laub, Busch, Gras
    // und Blume liefen mit den Konstanten der Nadelbäume: Gras bewegte sich mit `pow(h,3.0)×0,00094`
    // statt `pow(h,1.4)×0,11·H` — es stand praktisch still, während der Kommentar daneben erklärte,
    // warum es sich ganz wiegen soll. **Fünfzehn Zahlen, die nichts taten, mit einer Begründung, die
    // stimmte.** Ein Wert, der als Text in einen Shader gebacken wird, gehört in den Cache-Schlüssel
    // — oder er gehört nicht in den Text. Uniformen sind PRO MATERIAL, auch bei geteiltem Programm;
    // damit bleibt es bei einem Programm für alle fünf, und die Zahlen leben.
    const uAmp = { value: (P.windAmp[art] != null ? P.windAmp[art] : 0.02) * H };
    const uExp = { value: P.windExp[art] != null ? P.windExp[art] : 2.5 };
    const uFreq = { value: P.windFreq[art] != null ? P.windFreq[art] : 0.6 };
    windUniformen.set(art, { uAmp, uExp, uFreq, H });
    mat.onBeforeCompile = (shader) => {
      rimHook(shader);
      shader.uniforms.uTime = uTime;
      shader.uniforms.uWind = uWind;
      shader.uniforms.uAmp = uAmp;
      shader.uniforms.uExp = uExp;
      shader.uniforms.uFreq = uFreq;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>',
          '#include <common>\nuniform float uTime;\nuniform float uWind;\nuniform float uAmp;'
          + '\nuniform float uExp;\nuniform float uFreq;\nattribute float aHeight;')
        // Der Wind wirkt VOR der Instanzmatrix, also im Objektraum — und dort ist +X/+Z tangential
        // zur Kugel, weil jede Instanz mit Y = Flächennormale gesetzt wird (`setze`). Damit
        // funktioniert derselbe Patch am Nordpol wie am Äquator, ohne eine Windrichtung je Ort.
        .replace('#include <begin_vertex>', `#include <begin_vertex>
        #ifdef USE_INSTANCING
          float phase = dot(instanceMatrix[3].xyz, vec3(41.3, 27.9, 63.7));
        #else
          float phase = 0.0;
        #endif
        float bend = pow(aHeight, uExp) * uAmp * uWind;
        float w = uTime * uFreq;
        transformed.x += (sin(w * 1.6 + phase) * 0.65 + sin(w * 2.9 + phase * 1.7) * 0.35) * bend;
        transformed.z += cos(w * 1.27 + phase * 0.8) * bend * 0.55;`);
    };
    matCache.set(art, mat);
    return mat;
  }

  /** Raumkacheln fürs Aussortieren. EIN InstancedMesh über die ganze Kugel kann der Renderer nie
   *  verwerfen — seine Hülle ist die Kugel, und die ist immer im Bild. Damit lagen jedes Bild
   *  1,36 Mio. Dreiecke an, auch die auf der Rückseite des Planeten; DAS war Georgs Ruckeln.
   *  Kacheln (Fibonacci-Zentren, nächster Nachbar) machen aus einem unverwerfbaren Netz viele
   *  kleine mit ehrlicher Hülle — der Renderer wirft die Rückseite dann selbst weg. */
  const kachelZentren = (() => {
    const out = [], k = Math.max(1, P.buendel | 0), ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < k; i++) {
      const y = 1 - (i / Math.max(1, k - 1)) * 2, r = Math.sqrt(Math.max(0, 1 - y * y)), a = ga * i;
      out.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    return out;
  })();
  function kachelVon(p) {
    let best = 0, bd = -2;
    for (let i = 0; i < kachelZentren.length; i++) {
      const d = kachelZentren[i].dot(p);
      if (d > bd) { bd = d; best = i; }
    }
    return best;
  }

  function setze(liste, m, n, art) {
    const rB = bodenRadius ? bodenRadius(n) : R;
    if (rB == null) return false;
    _qq.setFromUnitVectors(_Y, n);
    _q2.setFromAxisAngle(n, rnd() * Math.PI * 2);
    _qq.premultiply(_q2);
    const sk = 0.82 + rnd() * 0.38;
    _p.copy(n).multiplyScalar(rB - m.H * sk * P.sink);
    _s.setScalar(sk);
    liste.push({ M: new THREE.Matrix4().compose(_p, _qq, _s), k: kachelVon(n) });
    protokoll.stuecke++;
    orteListe.push({ familie: art, n: n.clone(), r: m.rGrund * sk });
    return true;
  }

  async function bauen() {
    const { mergeGeometries } = await import('three/addons/utils/BufferGeometryUtils.js');
    for (const art of Object.keys(ARTEN)) {
      const H = P.hoehe[art] * BAUM_WELT;
      const varianten = [];
      for (let v = 0; v < P.varianten[art]; v++) {
        const vr = seededRandom((seed | 0) + salt + art.length * 977 + v * 131);
        const { teile } = ARTEN[art](THREE, vr, H);
        const gs = teile.map((t) => faerben(THREE, t.g, t.hexes, vr, Object.assign({ H }, t.opt)));
        const g = mergeGeometries(gs, false);
        for (const x of gs) x.dispose();
        g.computeBoundingSphere();
        const bb = new THREE.Box3().setFromBufferAttribute(g.attributes.position);
        varianten.push({ g, H, rGrund: Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z) * 0.5,
                         mats: [], tri: g.attributes.position.count / 3 });
      }
      const anz = P.anzahl[art] || 0;
      const pr = praedikat(art);
      const orte = anz ? streuen({ THREE, count: anz, seed, salt: salt + art.length * 313, gueltig: pr, minSep: null }) : [];
      protokoll.orte += orte.length;
      const maxJe = P.proOrt[art], s0 = protokoll.stuecke;
      const frA = frei ? (n) => frei(n, FREI_R[art]) : () => true;
      const nah = (n) => land(n) && frA(n);
      let einzeln = 0;
      for (const n of orte) {
        // **Die Büschelgröße ist die einzige Stelle, an der Ungleichmäßigkeit entsteht — und sie
        // hat einen Grund im GELÄNDE, keinen im Rauschen.** Im Kern eines Höhenbands eine Gruppe,
        // an seinem Rand ein einzelner Baum. Genau so hält es die Quelle: gleichmäßige Sitze plus
        // ausdrückliche Cluster (Kokos 4–9, Fels 3–5) — nicht eine globale Dichteblase.
        const v01 = vorliebe(art, n);
        const k = Math.max(1, Math.round(1 + (maxJe - 1) * Math.pow(v01, P.vorliebeKurve) * (0.45 + rnd() * 1.0)));
        if (k === 1) einzeln++;
        const v0 = varianten[Math.floor(rnd() * varianten.length)];
        const platz = k > 1
          ? bueschel({ THREE, n, r: v0.rGrund * (P.enge[art] || 1.5), R, anzahl: k, gueltig: nah, rnd })
          : [n];
        for (const p of platz) {
          const v = varianten[Math.floor(rnd() * varianten.length)];
          setze(v.mats, v, p, art);
        }
      }
      protokoll.einzeln += einzeln;
      protokoll.arten[art] = { orte: orte.length, gesucht: anz, stuecke: protokoll.stuecke - s0,
                              einzeln, varianten: varianten.length, H: +H.toFixed(4) };
      // EIN Netz je Variante UND Raumkachel — sonst kann der Renderer nichts verwerfen (s. o.).
      for (const v of varianten) {
        if (!v.mats.length) { v.g.dispose(); continue; }
        const nachKachel = new Map();
        for (const e of v.mats) {
          if (!nachKachel.has(e.k)) nachKachel.set(e.k, []);
          nachKachel.get(e.k).push(e.M);
        }
        for (const [k, Ms] of nachKachel) {
          const inst = new THREE.InstancedMesh(v.g, material(art, v.H), Ms.length);
          for (let i = 0; i < Ms.length; i++) inst.setMatrixAt(i, Ms[i]);
          inst.instanceMatrix.needsUpdate = true;
          inst.name = 'ts-' + art + '-' + k;
          // Ehrliche Hülle statt `frustumCulled = false`: three rechnet sie aus den Instanzen.
          inst.computeBoundingSphere();
          inst.frustumCulled = true;
          // **Kein Schattenwurf.** Der zweite Durchgang kostete dieselben 1,36 Mio. Dreiecke noch
          // einmal, und bei 6 cm hohen Stücken auf facettiertem Boden war im Bild kein Schatten
          // zu finden, den man vermisst hätte. Die Landmarken werfen weiter.
          inst.castShadow = false; inst.receiveShadow = false;
          group.add(inst);
          if (!kachelNetze.has(k)) kachelNetze.set(k, []);
          kachelNetze.get(k).push(inst);
          protokoll.drawCalls++; protokoll.kacheln++; protokoll.dreiecke += v.tri * Ms.length;
        }
      }
    }
    // Wie viel Land trägt überhaupt Bäume? Stichprobe über die VORLIEBE — dieselbe Funktion, die
    // auch platziert, damit der Bericht keine andere Baumgrenze kennt als das Bild.
    let probe = 0, leer = 0;
    const v = new THREE.Vector3();
    for (let i = 0; i < 600; i++) {
      const y = 1 - (i / 599) * 2, r = Math.sqrt(Math.max(0, 1 - y * y)), a = i * Math.PI * (3 - Math.sqrt(5));
      v.set(Math.cos(a) * r, y, Math.sin(a) * r);
      if (!land(v)) continue;
      probe++;
      if (vorliebe('nadel', v) < P.mindestVorliebe && vorliebe('laub', v) < P.mindestVorliebe) leer++;
    }
    protokoll.baumlos = probe ? Math.round((leer / probe) * 100) : 0;
    stand = 'gebaut';
  }

  let stand = 'baut …';
  bauen().catch((e) => { stand = 'Fehler: ' + (e && e.message || e); console.warn('[ts-flora]', e); });

  return {
    name: 'ts-flora', group, params: P,
    get enabled() { return P.on; },
    setEnabled(on) { P.on = !!on; group.visible = !!on; },
    get status() { return stand; },
    get wind() { return P.wind; },
    setWind(w) { P.wind = Math.max(0, Math.min(3, +w || 0)); uWind.value = P.wind; },
    /** Was im Shader WIRKLICH steht, je Art — abgelesen, nicht aus der Parametertabelle zitiert.
     *  Genau diese Unterscheidung hat die Abnahme gefunden: die Tabelle stimmte, der Shader nicht. */
    windZeile() {
      const t = [];
      for (const [art, u] of windUniformen) {
        t.push(art + ' amp ' + (u.uAmp.value / Math.max(1e-6, u.H) * 100).toFixed(1) + '% of ' + u.H.toFixed(3)
               + ' · exp ' + u.uExp.value.toFixed(1) + ' · ' + u.uFreq.value.toFixed(2) + ' Hz');
      }
      return t.join('  ·  ');
    },
    /** EINE Uhr aus dem Frame-Loop — keine eigene (PM-50: eine zweite Uhr ist im verdeckten
     *  Tab eine andere Uhr, und dann misst der Prüfstand die Pause statt das Bild).
     *  Und die Sichtweite: welche Raumkacheln überhaupt angemeldet werden. */
    update(dt, camera) {
      if (!P.on) return;
      uTime.value += dt;
      if (!camera || !kachelNetze.size) return;
      const d = camera.position.length();
      const aus = d > R * P.kappeHoehe;
      if (aus !== ausAlles) {
        ausAlles = aus;
        if (aus) { for (const netze of kachelNetze.values()) for (const m of netze) m.visible = false; sichtbar = 0; }
      }
      if (aus) return;
      // Horizontwinkel der Kamerahöhe plus der halbe Kacheldurchmesser: eine Kachel, deren MITTE
      // hinter dem Horizont liegt, kann mit ihrem Rand noch im Bild stehen.
      _q.copy(camera.position).normalize();
      const grenze = Math.cos(Math.min(Math.PI, Math.acos(Math.max(-1, Math.min(1, R / Math.max(R, d))))
                                       + P.sichtZuschlag));
      sichtbar = 0;
      for (const [k, netze] of kachelNetze) {
        const an = kachelZentren[k].dot(_q) >= grenze;
        if (an) sichtbar += netze.length;
        for (const m of netze) m.visible = an;
      }
    },
    get sichtbareNetze() { return ausAlles ? 0 : sichtbar; },
    orte() { return orteListe; },
    tor() {
      if (stand !== 'gebaut') return { ok: false, text: '— ' + stand };
      const p = protokoll;
      const teile = Object.entries(p.arten).map(([a, x]) =>
        a + ' ' + x.stuecke + ' pieces / ' + x.orte + ' sites' + (x.orte < x.gesucht * 0.9 ? ' ⚠' : ''));
      const duenn = Object.values(p.arten).filter((x) => x.orte < x.gesucht * 0.9).length;
      const ok = p.stuecke > 0 && duenn === 0;
      return { ok, ...p,
        text: (ok ? '✓' : '⚠') + ' ts-flora: ' + p.stuecke + ' pieces · ' + p.drawCalls + ' draw calls · '
          + (p.dreiecke / 1000).toFixed(0) + 'k triangles · ' + teile.join(' · ')
          + ' in ' + p.kacheln + ' spatial tiles, ' + (ausAlles ? 'all off (camera in orbit)' : sichtbar + ' submitted from here')
          + ' — one globe-wide mesh can never be culled, and above ' + P.kappeHoehe.toFixed(2) + '× radius a plant is smaller than a pixel'
          + ' · built, not loaded: procedural geometry, AO baked into vertex colour, shared rim light, '
          + 'wind as a FRACTION of piece height, per species as UNIFORMS (baked literals were silently shared: '
          + 'three keys the program cache on material parameters, not on onBeforeCompile output) × '
          + uWind.value.toFixed(2) + ', no shadow pass'
          + ' · placement: EVEN scatter, cluster size from terrain preference (height band × biome), '
          + p.einzeln + ' of ' + p.orte + ' sites hold a single piece · ' + p.baumlos + '% of the land lies outside the tree band'
          + (duenn ? ' · ⚠ ' + duenn + ' species short of their site target (predicate too tight)' : '') };
    },
  };
}
