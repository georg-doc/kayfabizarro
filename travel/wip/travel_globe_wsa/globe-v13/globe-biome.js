// ============================================================================
// globe-biome.js — S3c · Biom-Domänen: GEMISCHT, nicht geschaltet
// ----------------------------------------------------------------------------
// Befund aus dem Living-Dokument (§6b D): der Seed zieht heute EINEN `terrainType` für die
// GANZE Kugel — deshalb ist die Welt monoton. Und der Trick für Abwechslung liegt schon im
// portierten Code: `simplex-noise.js` baut sein **Ozean-Rückgrat aus Großkreis-Achsen je Seed**
// (`backboneAxesForSeed`). Dasselbe Verfahren, eine Oktave tiefer, ergibt Domänen.
//
// **Die Bauform hier: Anker-Richtungen + sphärischer Softmax.** Vier Ankerrichtungen je Seed,
// Gewicht_i = exp(k · dot(p, anker_i)), normiert. Das ist stetig, summiert auf 1, kostet vier
// Skalarprodukte und vier Exponentialfunktionen je Probe — und `k` ist genau EIN Regler für die
// Übergangsbreite. Keine zweite Rauschfunktion, kein zweites Weltmodell.
//
// ⚠ **Was hier NICHT gemischt wird, und warum: die Schwelle (`threshold`).**
// `terrainIsLand(type, value)`, `terrainElevationFromValue` und `terrainWaterDepthFromValue`
// bekommen KEINE Position — sie lesen die Schwelle global aus dem Preset. Eine ortsabhängige
// Schwelle hieße: drei Signaturen im 1:1-Port ändern und jeden Leser (Mesh, Physik, Zonen,
// Props, Schatten, Karten) mitziehen. Genau so entstehen zwei Höhenwahrheiten (Fehlerklasse 1).
// Deshalb bleibt die Land/Wasser-Grenze GLOBAL, und das Biom mischt nur, was die FORM macht:
// Maßstab, Persistenz, Lakunarität, Rückgrat-Band, Relief und Rauheit.
// Sichtbar ist das trotzdem: sanfte Ebene neben zerklüftetem Grat neben zersplitterter Küste.
//
// ⚠ Zweite bewusste Grenze: die Oktavenzahl bleibt bei 4 (der höchste Wert der vier Presets).
// Eine gebrochene Oktavenzahl gibt es nicht; bei `pangaea`/`waterworld` (3) kommt damit eine
// vierte Oktave mit Amplitude persistence³ ≈ 0,16 dazu. Gemessen unauffällig, aber notiert.
//
// Leser: `simplex-noise.js` über den Feld-Haken (den setzt DIESES Modul, damit der Port nichts
// importieren muss), `terrain-surface.js` für Relief/Rauheit, `globe.js` für die Farbtönung.
// EIN Eigentümer der Gewichte: `biomeWeightsAt`.
// ============================================================================

import { setBiomeFieldHook, getTerrainParams } from './simplex-noise.js';

// ── S9d · Die Biom-Grundtöne im kalibrierten Band (siehe globe.js LAND_HEX und §6j) ──────────
// Alte Werte: plateau 0xc9b071 (L 0,69) · spires 0x9fa2b8 (0,64) · shatter 0x7fae95 (0,64) ·
// flatwater 0xd9cfa8 (0,81). Alle VIER lagen HELLER als die Landbänder, die sie tönen sollten —
// eine Tönung, die aufhellt, ist keine Tönung, sondern eine Aufhellung. Jetzt 0,30…0,36, also
// mitten im Band. Hue und Sättigung bitgenau unverändert (H 43→42, 233→233, 148→148, 48→47).
// Der Luminanzerhalt beim Mischen (globe.js) bleibt trotzdem drin: er ist die Sicherung, nicht die
// Lösung — und mit passenden Tönen muss er jetzt fast nichts mehr korrigieren.
/** Vier Biome. `col` ist die Landtönung als HEX (nie als Float-Tripel — Fehlerklasse aus
 *  Runde 6: `new THREE.Color(hex)` rechnet sRGB→linear, ein Tripel nicht).
 *  `relief` skaliert MOUNTAIN_HEIGHT, `rough` den Zackenaufschlag auf den Gipfeln. */
export const BIOMES = [
  { id: 'plateau',   name: 'Plateau',   col: 0x695628, scale: 1.10, pers: 0.50, lac: 2.00, bbW: 0.11, bbS: 0.22, relief: 0.70, rough: 0.50 },
  { id: 'spires',    name: 'Spires',    col: 0x484b62, scale: 1.85, pers: 0.56, lac: 2.20, bbW: 0.12, bbS: 0.24, relief: 1.45, rough: 1.65 },
  { id: 'shatter',   name: 'Shatter',   col: 0x375746, scale: 3.10, pers: 0.45, lac: 2.25, bbW: 0.09, bbS: 0.15, relief: 0.85, rough: 1.10 },
  { id: 'flatwater', name: 'Flatwater', col: 0x695c2e, scale: 2.35, pers: 0.40, lac: 2.00, bbW: 0.08, bbS: 0.10, relief: 0.45, rough: 0.40 },
];

const S = {
  on: false,
  seed: 0,
  strength: 1,     // 0 = quellentreu (ein Typ für die ganze Kugel)
  sharp: 4.5,      // Übergangsbreite: groß = harte Domänengrenzen
  anchors: [],
  baseType: 'default',
};

function seededRandom(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0x100000000; };
}
function randomUnit(rand) {
  const z = rand() * 2 - 1, theta = rand() * Math.PI * 2;
  const r = Math.sqrt(Math.max(0, 1 - z * z));
  return { x: Math.cos(theta) * r, y: z, z: Math.sin(theta) * r };
}

/** Anker mit erzwungenem Abstand. Ohne die Ablehnung fallen zwei Domänen gelegentlich
 *  zusammen — dann hat die Welt drei Biome und eines fehlt, seedabhängig. Das ist genau die
 *  Falle aus S3h: ein einzelner Seed ist kein Beweis. */
function anchorsForSeed(seed) {
  const rand = seededRandom((seed ^ 0x5bf03635) >>> 0);
  const out = [];
  for (let i = 0; i < BIOMES.length; i++) {
    let best = null, bestSep = -2;
    for (let t = 0; t < 24; t++) {
      const c = randomUnit(rand);
      let worst = 1;
      for (const a of out) {
        const d = Math.abs(c.x * a.x + c.y * a.y + c.z * a.z);
        if (1 - d < 1 - worst) worst = d;
      }
      const sep = 1 - worst;
      if (sep > bestSep) { bestSep = sep; best = c; }
      if (out.length === 0 || worst < 0.55) { best = c; break; }
    }
    out.push(best);
  }
  return out;
}

const W = [0, 0, 0, 0];

/** Gewichte über die vier Biome an einer Richtung. Gibt das interne Feld zurück (kein `new`
 *  je Probe — bei 260 000 Aufrufen je Ladevorgang ist Allokation der Posten, nicht die Mathematik).
 *  Wer die Werte behalten will, kopiert sie. */
export function biomeWeightsAt(nx, ny, nz) {
  if (!S.on || S.strength <= 0) { W[0] = 1; W[1] = W[2] = W[3] = 0; return W; }
  let sum = 0, mx = -1e9;
  for (let i = 0; i < 4; i++) {
    const a = S.anchors[i];
    const d = (nx * a.x + ny * a.y + nz * a.z) * S.sharp;
    W[i] = d;
    if (d > mx) mx = d;
  }
  for (let i = 0; i < 4; i++) { W[i] = Math.exp(W[i] - mx); sum += W[i]; }
  const inv = 1 / (sum || 1);
  // `strength` blendet gegen die Gleichverteilung, NICHT gegen ein Biom: bei 0 sind alle vier
  // gleich gewichtet, und die gemischten Parameter sind der Mittelwert — eine Welt ohne Domänen.
  const flat = 0.25 * (1 - S.strength);
  for (let i = 0; i < 4; i++) W[i] = W[i] * inv * S.strength + flat;
  return W;
}

/** Dominantes Biom — für Prop-Vorlieben (S3e) und die Anzeige. */
export function biomeAt(nx, ny, nz) {
  const w = biomeWeightsAt(nx, ny, nz);
  let top = 0;
  for (let i = 1; i < 4; i++) if (w[i] > w[top]) top = i;
  return { top, id: BIOMES[top].id, name: BIOMES[top].name, weight: w[top], w: [w[0], w[1], w[2], w[3]] };
}

/** Relief und Rauheit — gelesen von `terrain-surface.landDisplacement`. Zwei Zahlen, ein Aufruf,
 *  damit die Auslenkung nicht zweimal dieselben Gewichte rechnet. */
const RR = { relief: 1, rough: 1 };
export function biomeReliefAt(nx, ny, nz) {
  if (!S.on) { RR.relief = 1; RR.rough = 1; return RR; }
  const w = biomeWeightsAt(nx, ny, nz);
  let re = 0, ro = 0;
  for (let i = 0; i < 4; i++) { re += w[i] * BIOMES[i].relief; ro += w[i] * BIOMES[i].rough; }
  RR.relief = re; RR.rough = ro;
  return RR;
}

/* ══ Der Feld-Haken ═══════════════════════════════════════════════════════════
   Wird von `sampleTerrainFieldValue` je Probe gerufen. Rückgabe hat die Form eines Presets;
   **`threshold` und `octaves` werden vom Basispreset übernommen** (siehe Kopfnotiz).
   EIN wiederverwendetes Objekt, kein `new` je Probe.                                        */
/* Slice D · v5 · Die Mischparameter der Biom-Domänen.
 *
 * Dieses Modul HATTE schon einen Zugang (`setBiome` · `biomeParams`), aber nur für vier Werte:
 * `on`, `seed`, `strength`, `sharp`. Die sieben Zahlen, die die Domänen-Mischung tatsächlich
 * formen, lagen in `MIX` — einem wiederverwendeten Objekt ohne Eingang. Und `ankerZahl` (4) sowie
 * `domaenen` (4) waren gar keine Zahlen, sondern in Schleifengrenzen eingebacken.
 *
 * ⚠ `MIX` wird JE PROBE wiederverwendet (kein `new` bei 260 000 Aufrufen je Ladevorgang) — das
 * bleibt so. `BIOM_QUELLE` ist die eingefrorene Vorlage, `MIX` das Arbeitsobjekt. Zwei Rollen,
 * ein Zahlensatz.                                                                              */
/** ⚠⚠ **Der wichtigste Befund von Slice D, und er ist ein Befund über MICH.**
 *
 *  Ich habe für die sieben Werte in `MIX` denselben Apparat gebaut wie für die anderen sieben
 *  Module — `quelle`, `abweichungen()`, `zeile()` — und das Prüfergebnis hat mich **drei Mal**
 *  korrigiert, jedes Mal genauer:
 *
 *   1. `7 off default: scale 1.5→2.186…` → ich hatte die falsche REFERENZ gewählt (die Literale,
 *      nicht das Preset).
 *   2. `6 changed since load`, gleiche Zahlen → ich hatte den falschen ZEITPUNKT gewählt: die
 *      Basis lag vor der ersten Probe. *Eine Basislinie ist keine Zahl, sondern ein Zeitpunkt.*
 *   3. `5 off source: scale 2.4094→2.4092, lacunarity 2.0101→2.0099` → und **hier** wird es
 *      eindeutig: solche Abweichungen sind kein Eingriff und kein Preset. `MIX` wird **je Probe
 *      neu beschrieben** — es ist ein Kratzpuffer, damit bei 260 000 Aufrufen je Ladevorgang kein
 *      `new` anfällt (das steht seit v3 im Kommentar darüber, ich habe es gelesen und trotzdem
 *      einen Regler daran gebaut).
 *
 *  **Für einen Kratzpuffer gibt es keine Basislinie, weil es keinen Zustand gibt.** Der Apparat
 *  war nicht falsch eingestellt, er war am falschen Gegenstand. Also fliegt er hier raus — samt
 *  `setBiomeMix`, denn ein Eingang, dessen Wert die nächste Probe überschreibt, ist keine
 *  Schnittstelle, sondern ein Versprechen, das der nächste Frame bricht.
 *
 *  *Was bleibt: die vier Werte, die WIRKLICH Parameter sind — und die haben eine Basislinie,
 *  weil der Runner sie genau einmal setzt.*
 */
export const BIOM_PARAMS = Object.freeze(['on', 'strength', 'sharp', 'seed']);
/** Die nach dem Aufbau festgehaltene Referenz der ECHTEN Parameter. `null` = noch nicht da. */
let BASIS = null;

/** Der Kratzpuffer des Mischers. **Startwerte, keine Parameter:** ´threshold´ und ´octaves´ kommen
 *  vom Basispreset, die übrigen werden je Probe aus den Domänen-Gewichten neu gerechnet. EIN
 *  wiederverwendetes Objekt, kein ´new´ je Probe — bei 260 000 Aufrufen je Ladevorgang ist
 *  Allokation der Posten, nicht die Mathematik. */
const MIX = { scale: 1.5, octaves: 4, lacunarity: 2.05, persistence: 0.48, threshold: 0,
              oceanBackboneWidth: 0.1, oceanBackboneStrength: 0.22 };

/** ⚠ **DAS ist der Schreiber von `MIX` — und er belegt den Befund oben Zeile für Zeile:** je
 *  Probe werden Skala, Persistenz, Lakunarität und die beiden Backbone-Werte aus den
 *  Domänen-Gewichten neu gemischt und in DIESES Objekt geschrieben. `threshold` und `octaves`
 *  bleiben beim Basispreset (sonst wüssten `terrainIsLand` & Co. nicht mehr, was Land ist).
 *  Der Haken hängt in `sampleTerrainFieldValue` — EINE Stelle für Mesh, Flugphysik, Zonen,
 *  Props, Schatten und Karten.
 *
 *  ⚠ **Und diese Funktion hat mich beim Aufräumen fast das Modul gekostet:** ich habe den Block
 *  zwischen `MIX` und `setBiome` ersetzt und `fieldHook` dabei mitgeschnitten. Der Fehler war
 *  `fieldHook is not defined` — die Welt startete nicht, und die Konsole meldete
 *  `[globe] start failed {}`, also einen leeren Gegenstand ohne Botschaft. **Ein Ausschnitt nach
 *  ZEILENBEREICH statt nach Bedeutung nimmt mit, was zufällig dazwischen liegt.** Genau deshalb
 *  steht dieser Kommentar hier und nicht in einem Chatverlauf.                                */
function fieldHook(base, nx, ny, nz) {
  const w = biomeWeightsAt(nx, ny, nz);
  let sc = 0, pe = 0, la = 0, bw = 0, bs = 0;
  for (let i = 0; i < 4; i++) {
    const b = BIOMES[i], k = w[i];
    sc += k * b.scale; pe += k * b.pers; la += k * b.lac; bw += k * b.bbW; bs += k * b.bbS;
  }
  // Der gewürfelte Welt-Typ bleibt der GRUNDTON: sein Maßstab wird eingemischt, nicht ersetzt.
  // Sonst spielt der Seed keine Rolle mehr und alle Welten sehen gleich aus.
  MIX.scale = sc * 0.72 + base.scale * 0.28;
  MIX.persistence = pe * 0.72 + base.persistence * 0.28;
  MIX.lacunarity = la;
  MIX.oceanBackboneWidth = bw;
  MIX.oceanBackboneStrength = bs;
  MIX.octaves = 4;
  MIX.threshold = base.threshold;   // ⚠ global — siehe Kopfnotiz
  return MIX;
}


/** Nach dem Aufbau EINMAL rufen: hält die vier echten Parameter fest. */
export function biomeBasisSetzen() {
  BASIS = { on: S.on, strength: S.strength, sharp: S.sharp, seed: S.seed };
  return Object.assign({}, BASIS);
}
/** Was der Mischer bei der LETZTEN Probe gerechnet hat. Eine Beobachtung, keine Einstellung —
 *  der Name sagt es, damit niemand denselben Weg zweimal geht. */
export function biomeLetzteProbe() {
  return { scale: +MIX.scale.toFixed(4), octaves: MIX.octaves,
           lacunarity: +MIX.lacunarity.toFixed(4), persistence: +MIX.persistence.toFixed(4),
           threshold: +MIX.threshold.toFixed(4),
           hinweis: 'per-sample scratch values, not settings' };
}
export function biomeAbweichungen() {
  if (!BASIS) return [];
  const a = [];
  for (const k of BIOM_PARAMS) if (S[k] !== BASIS[k]) a.push(k + ' ' + BASIS[k] + '→' + S[k]);
  return a;
}
export function biomeZeile() {
  const a = biomeAbweichungen();
  return BIOM_PARAMS.length + ' params · '
    + (!BASIS ? 'baseline not captured yet'
       : a.length ? '⚠ ' + a.length + ' changed since load: ' + a.join(', ')
                  : 'unchanged since load')
    + ' · ' + (S.on ? BIOMES.length + ' domains, strength ' + S.strength.toFixed(2)
                    + ' · sharp ' + S.sharp.toFixed(2) : 'OFF (one terrain type for the whole globe)')
    + ' · mix is a per-sample scratch buffer, deliberately not a parameter';
}

export function setBiome(opt) {
  const o = opt || {};
  if (o.seed != null) { S.seed = o.seed | 0; S.anchors = anchorsForSeed(S.seed); }
  if (o.baseType) S.baseType = o.baseType;
  if (o.strength != null) S.strength = Math.max(0, Math.min(1, o.strength));
  if (o.sharp != null) S.sharp = Math.max(0.5, o.sharp);
  if (o.on != null) S.on = !!o.on;
  if (!S.anchors.length) S.anchors = anchorsForSeed(S.seed);
  setBiomeFieldHook(S.on && S.strength > 0 ? fieldHook : null);
  return biomeParams();
}
export function biomeParams() {
  return { on: S.on, seed: S.seed, strength: S.strength, sharp: S.sharp };
}

/** **Die Abnahmezahl, die das Dokument verlangt:** „wie oft wechselt das Biom auf 60 s
 *  Reiseflug?" Ohne diese Zahl ist „abwechslungsreich" Geschmack. Gemessen wird auf einem
 *  Großkreis mit Reisetempo — Winkelgeschwindigkeit = Tempo / Radius. */
export function biomeReport(o) {
  const p = o || {};
  const radius = p.radius != null ? p.radius : 5;
  const speed = p.speed != null ? p.speed : 0.28;
  const seconds = p.seconds != null ? p.seconds : 60;
  const bahnen = p.bahnen != null ? p.bahnen : 8;
  const arc = (speed / radius) * seconds;      // Bogen in rad
  const steps = 240;
  const rand = seededRandom(((S.seed ^ 0x1d2c6f) >>> 0) || 7);
  let sum = 0, seen = new Set();
  for (let b = 0; b < bahnen; b++) {
    const a = randomUnit(rand);
    let h = randomUnit(rand);
    const dp = a.x * h.x + a.y * h.y + a.z * h.z;
    h = { x: h.x - a.x * dp, y: h.y - a.y * dp, z: h.z - a.z * dp };
    const L = Math.hypot(h.x, h.y, h.z) || 1;
    h = { x: h.x / L, y: h.y / L, z: h.z / L };
    let last = -1, wechsel = 0;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * arc, c = Math.cos(t), s = Math.sin(t);
      const bi = biomeAt(a.x * c + h.x * s, a.y * c + h.y * s, a.z * c + h.z * s);
      seen.add(bi.id);
      if (last >= 0 && bi.top !== last) wechsel++;
      last = bi.top;
    }
    sum += wechsel;
  }
  return {
    an: S.on, stärke: +S.strength.toFixed(2), schärfe: +S.sharp.toFixed(2),
    bogen: +arc.toFixed(2),
    wechselJe60s: +(sum / bahnen).toFixed(2),
    biomeAufDerKugel: seen.size,
    basis: S.baseType, schwelle: getTerrainParams(S.baseType).threshold,
  };
}
