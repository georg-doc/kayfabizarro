// ============================================================================
// globe.js — Die Kugel als EIN Mesh
// ----------------------------------------------------------------------------
// Nach dem Vorbild von tinyskies `Globe.createSurface()`: eine `SphereGeometry` mit hoher
// Segmentzahl, jeder Vertex radial um `surfaceDisplacementFromValue` ausgelenkt, Farbe als
// Vertex-Attribut. Kein Streaming, kein LOD, keine Ringe.
//
// **Die Zahl, die den Unterschied macht:** 256 Segmente ergeben ~131 000 Vertices und werden
// EINMAL beim Laden gerechnet (das Original nennt „~260k displacement calls per load"). Danach
// steht die Welt. Ein Höhenfeld-Clipmap rechnet stattdessen jeden Frame — und genau dort saßen
// alle Nähte, LOD-Ringe und Wabern der Vornacht.
//
// Farbe: KFB-Palette statt der tinyskies-Biome. Die Stufen sind Höhenbänder, weil eine Kugel ihre
// Farbe aus der Höhe bekommt (Küste, Ebene, Fels, Firn) — dieselbe Logik wie im Planet-Shader,
// nur einmal je Vertex statt je Pixel.
// ============================================================================

import { sampleTerrainValue, terrainIsLand, terrainElevationFromValue } from './simplex-noise.js';
import { surfaceDisplacementFromValue, noiseForSeed, MOUNTAIN_HEIGHT } from './terrain-surface.js';
import { initRimLight } from './rim-light.js';   // addRimLight nicht mehr: der Patch bringt seinen eigenen Rim mit
import { BIOMES, biomeWeightsAt } from './globe-biome.js';   // v3 · S3c · Landtönung je Domäne

/** Atmosphären-Shader 1:1 aus `Globe.ts` Zeile 52–73 — jetzt einschließlich Zeile 69, die ich beim
 *  ersten Mal rekonstruiert hatte (`smoothstep(0.0, 0.35, rim)`); richtig ist
 *  `smoothstep(0.05, 0.5, rim)`.
 *
 *  ⚠ **Und hier die unangenehme Wahrheit, gemessen statt behauptet.** Ich hatte diese Hülle als
 *  „sichtbarsten Einzelposten der Politur" gegen den Polygon-Look verkauft. Der Verifier hat
 *  nachgerechnet: von 486 214 rasterisierten Pixeln liegt `rim > 1.0` auf 486 088 — der
 *  Gesamtbeitrag zum Bild ist **7 von 272 680 361**. Der Grund ist Geometrie, kein Programmfehler:
 *  die Kamera sitzt 0,03 Einheiten über der Oberfläche, also TIEF INNERHALB einer Hülle mit
 *  Radius 1,55·R. Von innen hat eine Kugelschale keinen Rand, an dem ein Fresnel-Saum entstehen
 *  könnte: die Normale zeigt überall vom Betrachter weg, `dot` wird negativ, `outer` null.
 *
 *  Das ist **quellentreu und trotzdem im Flug unsichtbar**. Die Hülle gehört zu den
 *  herausgezoomten Ansichten des Vorbilds (Planet von außen), nicht zur Verfolgerkamera. Sie
 *  bleibt drin, weil sie 1:1 ist und bei einer Außenansicht sofort trägt — aber meine Behauptung
 *  war falsch: **was im Tiefflug Tiefe gibt, sind Nebel, Himmelsverlauf und Sternenfeld**, alle
 *  drei jetzt aus dem Preset. Kein Ersatz-Shader dazuerfunden; das wäre wieder Eigenbau. */
const ATMOSPHERE_VERTEX = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ATMOSPHERE_FRAGMENT = `
uniform vec3 glowColor;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vec3 viewDir = normalize(-vPosition);
  float rim = 1.0 - dot(vNormal, viewDir);
  float inner = smoothstep(0.05, 0.5, rim);
  float outer = 1.0 - smoothstep(0.7, 1.0, rim);
  float intensity = inner * outer * pow(rim, 1.8) * 0.22;
  gl_FragColor = vec4(glowColor * intensity, intensity);
}
`;

/** Wolken 1:1 aus `Globe.ts` Zeile 81–83 und 5174–5293. */
const CLOUD_COUNT = 30;
const CLOUD_ALTITUDE = 1.0;
const CLOUD_DRIFT_SPEED = 0.03;

const CLOUD_VERTEX = `
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vLocal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mv.xyz;
  vLocal = position;
  gl_Position = projectionMatrix * mv;
}
`;

const CLOUD_FRAGMENT = `
uniform vec3 cloudColor;
uniform float opacity;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vLocal;
void main() {
  vec3 viewDir = normalize(-vViewPosition);
  float rim = abs(dot(vNormal, viewDir));
  // Der Boden der Puffs wird ausgeblendet — so entsteht die flache Wolkenbasis eines Cumulus
  // statt einer Ansammlung von Kugeln (Quelle: Zeile 5204–5206).
  float upFactor = smoothstep(-0.8, 0.2, vLocal.y);
  float soft = rim * rim * (0.3 + 0.7 * upFactor);
  gl_FragColor = vec4(cloudColor * soft, opacity * soft);
}
`;
/** Oberflächen-Patch 1:1 aus `Globe.ts` Zeile 519–624.
 *
 *  ⚠ **Das war die eigentliche Lücke, und sie ist groß.** Ich hatte ein nacktes
 *  `MeshPhongMaterial({ vertexColors, flatShading })` genommen — Material und Flags stimmen
 *  (Zeile 519 `vertexColors: true`, 520 `shininess: 8`, 521 `flatShading: true`), aber die Quelle
 *  patcht dieses Material per `onBeforeCompile` mit vier Dingen, die ich alle nicht hatte:
 *
 *    1. **Scrollende Küsten-Kontourlinien** (Zeile 579–592) — sechs Bänder über die Wassertiefe,
 *       mit Rauschversatz, laufend in `oceanTime`.
 *    2. **Schaum aus sieben Sinuswellen** (596–606) — hochfrequent, stärker im Flachen.
 *    3. **Glitzern aus fünf Wellen plus Maske** (608–619).
 *    4. **Rim** (621–624), dieselbe Formel wie `RimLight.ts`.
 *
 *  Genau dieses hochfrequente Detail bricht die flachen Facetten. Ohne es ist eine
 *  flachschattierte Kugel exakt das, was Georg dreimal gemeldet hat: ein Polygonklumpen. Die
 *  Facetten waren nie das Problem — die fehlende Textur darauf war es.
 *
 *  Rekonstruiert sind nur vier Klammer- und Kommentarzeilen, die in der Codesuche nicht sichtbar
 *  waren (580, 594, 607, 615–618); jede Formelzeile steht wörtlich so in der Quelle. */
/** Die Konstanten der Quelle an EINEM Ort, mit Fundstelle — damit `quellenProbe()` etwas hat,
 *  woran sie prüfen kann, und niemand sie einzeln „nachjustiert". */
const QUELLE = {
  datei: 'tinyskies@2659a5cc987d client/src/game/Globe.ts · createSurface',
  rimIntensity: 0.8,      // `const rimIntensity = 0.8;`
  rimPower: 8.5,          // `const rimPower = 8.5;`
  shininess: 8,           // `new MeshPhongMaterial({ vertexColors: true, shininess: 8, flatShading: true })`
  atmoScale: 0.22,        // ATMOSPHERE_FRAGMENT: `pow(rim, 1.8) * 0.22`
  sparkleThreshHigh: 0.97,
  patchScale: 4, patchThreshold: 0.2, patchMix: 0.6,
};
const SURFACE_VERTEX_DECL = `
varying vec3 vWorldPos;
varying float vOceanDepth;
varying float vLand;
attribute float oceanDepth;
attribute float landFlag;`;

const SURFACE_VERTEX_BODY = `
  vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
  vOceanDepth = oceanDepth;
  vLand = landFlag;`;

const SURFACE_FRAGMENT_DECL = `
uniform float oceanTime;
uniform vec3 rimColor;
uniform float rimIntensity;
uniform float rimPower;
uniform vec3 foamColor;
uniform float sparkleGain;
uniform float glanzGain;
varying vec3 vWorldPos;
varying float vOceanDepth;
varying float vLand;`;

/** ⚠ **WÖRTLICHE KOPIE aus `Globe.ts · createSurface` (Tree 2659a5cc987d, gelesen 30.8.).**
 *  Die vorige Fassung behauptete im Kommentar, jede Formelzeile stehe so in der Quelle. Das war
 *  falsch, an vier Stellen — und die vierte war der Grund für Georgs „immer noch grau-blau
 *  verwaschen" über zwei Runden hinweg:
 *
 *   1. **Das Außentor.** Die Quelle prüft die FARBE (`vColor.b > vColor.r + vColor.g * 0.5`) und
 *      benutzt `vOceanDepth` nur INNEN für die Kontourlinien. Wir hatten beides zu einem Block
 *      verschmolzen — also bekam tiefes Wasser (`depth == 1.0`) weder Schaum noch Glitzern.
 *      ⚠ **NACHTRAG 30.8., und ab hier weichen wir BEWUSST ab (§05q, gemeldet statt geschlichtet):**
 *      Das Außentor ist jetzt `vOceanDepth > 0.0`, die Kontour-Bedingung innen nur noch
 *      `vOceanDepth < 1.0` — also die Struktur der Quelle, aber mit dem DATEN-Tor statt dem
 *      Farb-Tor. Grund: Georg, 30.8. am Bild — *„da ist teilweise wasser & wellen auf
 *      bergen/hügeln…?"* Mit Weltstimmungen (Slice H) dreht sich der Farbton des LANDES, und
 *      `frost` legt es auf 196° — blaugrün. Damit besteht Land die Farbprüfung
 *      `b > r + g*0.5`, und der komplette Wasser-Zweig (Schaum, Kontourlinien, Glitzern) läuft
 *      über Hügel und Berge.
 *      **Die Quelle hat diesen Fehler nicht, weil sie keine Stimmungen hat** — ihr Land ist immer
 *      grün. Ihre Heuristik ist also nicht falsch, sie ist nur nicht mehr gültig, sobald wir das
 *      Land umfärben. Und dieses Projekt hat die Falle schon einmal benannt, in `light-budget`:
 *      *„Eine Farbheuristik wäre der nächste Fehler derselben Art: das Biom `spires` ist selbst
 *      blaustichig und würde als Wasser gezählt."* Genau das, nur diesmal im Shader.
 *      *Wer raten muss, hat den falschen Ort gefragt* — und die Wassertiefe liegt als Attribut
 *      bereit: 0 auf Land, ≥ 0,001 auf Wasser, geschrieben vom Bäcker, der es sowieso entscheidet.
 *   2. **`gl_FragColor.rgb += vec3(0.04, 0.06, 0.10);`** — ihre erste Zeile im Wasser, bei uns
 *      nicht vorhanden.
 *   3. **Das Glitzern war nachgerechnet.** Sie: `sp1*sp2*sp3*sp4 + sp2*sp3*sp5*0.5`, Maske über
 *      `smoothstep(0.15, 0.5, …)`, Schwelle `0.97`. Wir: ein einziges Fünferprodukt,
 *      `max(0.0, mask)`, Schwelle `1.0`. Dieselben Sinusse, anderes Verfahren.
 *   4. **Der Rim.** Nicht in diesem Block, aber im selben Atemzug: `rimPower` stand auf **2,5**
 *      statt **8,5**, `rimIntensity` auf 0,6 statt 0,8. `pow(0.5, 2.5) = 0.177` gegen
 *      `pow(0.5, 8.5) = 0.0028` — Faktor 63, addiert auf jedes Pixel, in warmweiß. Ein Fresnel
 *      mit Exponent 2,5 ist kein Saum an der Kante, sondern ein Schleier über der ganzen Kugel.
 *      *Das Verwaschene war nie eine Farbe. Es war ein Exponent.*
 *
 *  **Regel 2 aus `use-what-works`: ein nachgerechnetes Verfahren ist ein NEUES Verfahren, auch
 *  mit denselben Formeln darin.** Und Regel 6: weil `createSurface` stumm ist, gibt
 *  `quellenProbe()` diese vier Zahlen aus und meldet ✗ bei Abweichung — ein Kommentar, der
 *  „wörtlich" behauptet, ist genau das, was hier zweimal versagt hat. */
const SURFACE_FRAGMENT_BODY = `
if (vLand < 0.5) {
  // ⚠ **Georg, 1.9.: „einige Polygone der Küste scheinen auf das Terrain über die Wasserfläche
  // gesetzt zu werden."** GEZÄHLT statt gedeutet: von 130 560 Dreiecken der Oberfläche haben
  // **12 190 gemischte Ecken** — **9,34 %** der ganzen Kugel liegt im Küstenband und trägt Land- UND
  // Wasser-Vertices in EINEM Dreieck.
  // \`vLand\` ist ein interpoliertes Attribut (0 oder 1 an den Ecken). Ein BINÄRES Tor darauf zieht
  // seine Kante **quer durch das Dreieck**, bei baryzentrisch 0,5 — und diese Kante liegt mitten
  // auf der Landrampe, also über der Wasserfläche. Alles, was der Wasserzweig malt (Blaustich,
  // offener Schaum, Glitzern), lief dort mit **voller Stärke** bis zur Mittellinie und hörte dann
  // schlagartig auf. Das ist Georgs Bild, und es ist keine Seltenheit, sondern jede zehnte Fläche.
  // **Ein binäres Tor auf einer interpolierten Größe setzt eine harte Kante an eine Stelle, an der
  // in den Daten keine ist.** Das Tor bleibt (es ist der billige Ausstieg), aber die FARBE bekommt
  // ein Gewicht, das genau am Tor null wird — also kein Sprung und kein Wasser auf Land:
  float wW = smoothstep(0.5, 0.0, vLand);
  gl_FragColor.rgb += vec3(0.04, 0.06, 0.10) * wW;

  vec3 wp = vWorldPos;

  // Coastline contour foam (using distance to land via vOceanDepth)
  // ⚠ \`> 0.0\` WIEDERHERGESTELLT. Die Quelle hat \`vOceanDepth > 0.0 && vOceanDepth < 1.0\`; beim
  // Umbau des Außentors auf das Land-Bit habe ich die untere Grenze mitgenommen, weil sie im alten
  // Außentor schon steckte. Folge: an der Küstenkante, wo \`vOceanDepth\` gegen 0 interpoliert,
  // liefen die Kontourlinien weiter — mit \`depthFade = 1\`, also bei voller Helligkeit, genau auf
  // der Silhouette. Das ist der helle Saum, den Georg im Vergleich mit dem Original gemeldet hat.
  // *Wer ein Tor verschiebt, muss prüfen, welche Bedingungen darin mitgereist sind.*
  if (vOceanDepth > 0.0 && vOceanDepth < 1.0) {
    float noiseOffset = sin(wp.x * 12.0 + wp.z * 8.0 + oceanTime) * 0.03;
    float contour = fract((vOceanDepth + noiseOffset) * 6.0 - oceanTime * 0.8);
    float line = smoothstep(0.7, 0.9, contour) * (1.0 - smoothstep(0.9, 1.0, contour));
    float depthFade = 1.0 - smoothstep(0.05, 0.35, vOceanDepth);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, foamColor, line * depthFade * 0.9);
  }

  // Existing open ocean foam
  float w1 = sin(wp.x * 43.0 + wp.y * 27.0 + wp.z * 11.0 + oceanTime * 3.6) * 0.5 + 0.5;
  float w2 = sin(wp.y * 37.0 + wp.z * 53.0 + wp.x * 7.0 - oceanTime * 2.7) * 0.5 + 0.5;
  float w3 = sin(wp.z * 31.0 + wp.x * 19.0 + wp.y * 47.0 + oceanTime * 2.1) * 0.5 + 0.5;
  float w4 = sin(wp.x * 17.0 + wp.z * 29.0 - wp.y * 13.0 + oceanTime * 1.5) * 0.5 + 0.5;
  float w5 = sin(wp.y * 11.0 + wp.x * 59.0 + wp.z * 23.0 - oceanTime * 1.2) * 0.5 + 0.5;
  float w6 = sin(wp.z * 41.0 - wp.y * 7.0 + wp.x * 33.0 + oceanTime * 1.8) * 0.5 + 0.5;
  float w7 = sin(wp.x * 67.0 - wp.z * 43.0 + wp.y * 3.0 - oceanTime * 0.9) * 0.5 + 0.5;
  float foam = w1 * w2 * w4 * w6 + w3 * w5 * w7 * 0.3;
  foam = 1.0 - smoothstep(0.002, 0.015, foam);
  // ⚠ **Georg, 1.9.: „wasser-shader & küstenlinien sind immer noch anders & gröber als im
  // Original."** Gemessen statt gedeutet: dieser Wert war bei uns IMMER 0.
  // Die Quelle liest die ROTMENGE der Wasserfarbe (smoothstep 0.1 … 0.22 auf vColor.r), und ihre
  // Farben liegen als sRGB-ZAHLEN im Vertexpuffer (0x2a8ca0 → r 0,165 · 0x1560a0 → r 0,082).
  // Wir backen dieselben Farben durch new THREE.Color(), also LINEAR (r 0,023 / 0,007) — beide
  // Werte liegen UNTER der unteren Schwelle 0,10, shallowness klemmt auf 0. Folge, und das ist
  // genau Georgs Bild: offener Schaum mit mix(0.05, 1.0, 0.0) = **5 % statt 57 %** Verstärkung,
  // Glitzerschwelle 0,70 statt 0,48 und Glitzerhelligkeit 0,6 statt 0,87. Übrig blieben ein paar
  // große Flecken und der starke Küstensaum — grob, weil die FEINE Hälfte des Vorbilds fehlte.
  // *Eine Schwelle in sRGB-Zahlen, angewendet auf einen linearen Puffer, ist kein Vergleich,
  // sondern ein Zufall.* (Dritter Fall derselben Klasse in dieser Datei: nicht die Farbe fragen,
  // wenn die Daten dieselbe Frage beantworten — §05q Außentor, §05o Umfärben, jetzt der Glanz.)
  // Nachgerechnet mit der Kurve der QUELLE, nur über die Tiefe statt über die Farbe:
  //   r(d) = 0,1647 − 0,0823·d  ·  u = (r − 0,1)/0,12 = 0,539 − 0,686·d  ·  dann deren Glättung.
  // Ergebnis 0,56 am Ufer, 0 ab Tiefe 0,79 — farbraum- UND stimmungsunabhängig: eine
  // Weltstimmung darf Wasser umfärben, ohne heimlich den Schaum abzuschalten.
  float sU = clamp(0.539 - 0.686 * vOceanDepth, 0.0, 1.0);
  float shallowness = clamp(sU * sU * (3.0 - 2.0 * sU) * glanzGain, 0.0, 1.0);
  gl_FragColor.rgb += foamColor * foam * mix(0.05, 1.0, shallowness) * wW;

  float sp1 = sin(wp.x * 40.0 + wp.y * 23.0 + wp.z * 9.0 + oceanTime * 3.5);
  float sp2 = sin(wp.y * 35.0 + wp.z * 29.0 + wp.x * 13.0 - oceanTime * 2.8);
  float sp3 = sin(wp.z * 27.0 + wp.x * 37.0 - wp.y * 17.0 + oceanTime * 4.1);
  float sp4 = sin(wp.x * 71.0 - wp.z * 47.0 + wp.y * 5.0 + oceanTime * 1.9);
  float sp5 = sin(wp.y * 59.0 + wp.x * 11.0 - wp.z * 31.0 - oceanTime * 2.3);
  float sparkleMask = sin(wp.x * 3.1 + wp.z * 4.7 + oceanTime * 0.25) * sin(wp.y * 5.3 - wp.x * 2.9 - oceanTime * 0.18);
  sparkleMask *= sin(wp.z * 2.3 + wp.y * 3.9 + oceanTime * 0.35);
  sparkleMask = smoothstep(0.15, 0.5, sparkleMask);
  float sparkle = sp1 * sp2 * sp3 * sp4 + sp2 * sp3 * sp5 * 0.5;
  float sparkleThresh = mix(0.7, 0.3, shallowness);
  sparkle = smoothstep(sparkleThresh, 0.97, sparkle) * sparkleMask;
  gl_FragColor.rgb += vec3(1.0, 1.0, 1.0) * sparkle * mix(0.6, 1.0, shallowness) * sparkleGain * wW;
  // ⚠ Die Küsten-Kontour oben bekommt \`wW\` ABSICHTLICH NICHT. Sie ist der einzige Term, der an
  // die GRENZE gehört und nicht an die Fläche — ihr \`depthFade\` ist am Ufer maximal, genau dort,
  // wo \`wW\` gegen null geht. Beide zu multiplizieren hätte den Saum gerade da gelöscht, wo er der
  // Sinn der Sache ist. *Ein Gewicht gehört an die Terme, deren Ort es korrigiert.*
}
vec3 rimViewDir = normalize(vViewPosition);
vec3 rimNormal = normalize(normal);
float rimFresnel = 1.0 - abs(dot(rimViewDir, rimNormal));
vec3 rim = rimColor * rimIntensity * pow(rimFresnel, rimPower);
gl_FragColor.rgb += rim;`

/** KFB-Farbwelt für das Land — als HEX, nicht als Float-Tripel.
 *  ⚠ **Das war die Ursache des ausgebrannten Weiß** (Georg, 27.8., 04:07). Three rechnet seit r152 im
 *  linearen Arbeitsraum; ein Hex-Wert wird von `new THREE.Color(hex)` automatisch von sRGB nach
 *  linear konvertiert, ein handgeschriebenes Float-Tripel NICHT. Meine 0.847/0.788/0.612 landeten
 *  also unkonvertiert im Puffer und kamen um rund ein Drittel zu hell heraus — zusammen mit den
 *  sieben Lichtern des DAY-Presets (Summe der Intensitäten ≈ 15) brannte das Land auf Weiß aus.
 *  Die Quelle fährt aus demselben Grund KEIN Tonemapping (`new WebGLRenderer({ antialias: true })`,
 *  Game.ts Zeile 1138) — sie braucht keins, weil ihre Farben im richtigen Raum liegen. */
// ── S9d · Die Palette im kalibrierten Band ────────────────────────────────────────────────────
// Der Quellenbericht (§6j) hat gerechnet, was hier vorher stand: der Lichtaufbau von tinyskies
// (sun 5,0 + hemi 1,75 + amb 1,25, geteilt durch π für Lambert) ist für Albedo um **0,30**
// kalibriert. Die alten Werte lagen bei 0,38…0,92 — eine sonnenzugewandte Sandfläche kam damit auf
// **2,0** und Firn auf **2,4**, und der Renderer hat kein Tone Mapping (bewusst, wie die Quelle).
// Deshalb war der Boden das hellste Element im Bild; in `refs/tinyskies-02.png` ist das Terrain
// durchweg DUNKLER als der Himmel. Das ist die Signatur, die wir wollen.
//
// ⚠ **Geändert wurde ausschließlich die HELLIGKEIT.** Hue und Sättigung sind bitgenau die alten
// (nachgerechnet: H 45→45, 99→99, 39→38, 30→34, 52→52 · S ±0,01) — der Kanon sagt WELCHE Farbe,
// die Helligkeit ist Technik. Die Bänder bleiben gestaffelt, damit die Höhe lesbar bleibt.
// ⚠ **Firn ist der eine Fall, in dem Sättigungserhalt FALSCH ist** — und das ist mir beim ersten
// Rechnen passiert: Hue 52 und Sättigung 0,31 auf L 0,58 gezogen ergibt **Olivgold**, keinen Schnee.
// Der Grund ist dieselbe Farbenlehre wie bei den Würfeln, nur in der anderen Richtung: ein
// Near-White bezieht seine WEISSHEIT aus NIEDRIGER Sättigung bei hoher Helligkeit. Nimmt man die
// Helligkeit weg und lässt die Sättigung stehen, bleibt der Buntton übrig, der vorher unsichtbar
// war. Also gibt Firn Sättigung ab (0,31 → 0,07) und behält seinen Hue: gedämpfter Schnee ist
// grau-warm, nicht oliv.
// Er bleibt das hellste Band (sonst ist es kein Schnee) und klippt nur noch auf der direkt
// besonnten Gipfelfläche statt flächig — genau das tut Schnee in der Sonne. Die Abnahme misst
// deshalb den MEDIAN, nicht das Maximum.
// Alte Werte, falls der Rückweg gebraucht wird:
//   strand 0xd8c99c · ebene 0x6f8f5e · hang 0x85765a · fels 0x66605a · firn 0xeeecdf
// ⚠ **RÜCKBAU 30.8. — und hier ist die Abzweigung, nach der Georg gefragt hat.**
// Diese fünf Zahlen waren gegen das LUMINANZBAND `BAND_LIN = [0.04, 0.33]` kalibriert (Ziel
// „Albedo um 0,30", siehe Kommentar oben). Am 29.8. wurde dieses Band **widerlegt** — Georgs
// Screenshots zeigten tinyskies' Gras über der Bandobergrenze, ohne zu überstrahlen — und durch
// `SAT_KEEP` (Sättigungserhalt) ersetzt. **Das Instrument wurde ersetzt, die Werte nicht.**
// Die Palette blieb auf einem Niveau stehen, das eine Regel forderte, die es nicht mehr gibt.
// Gemessen am Vorbild (tinyskies `Globe.ts` createSurface, gelesen 30.8. am Tree 2659a5cc987d):
//   Gras   0x3a7d2a…0x5a9f4a → L(lin) 0,156…0,275
//   Berg   0xc4b07a          → 0,438
//   Schnee 0xe8e8e0          → 0,802
//   Ozean  0x2a8ca0/0x1560a0 → 0,218 / 0,111
// Unsere Ebene lag bei **0,077** — Faktor 2,8 unter dem Vorbild. Bei so dunkler Albedo kommt die
// sichtbare Farbe aus den LICHTERN statt aus dem Material, und acht Lichter mit blauem Füller
// ergeben genau den Befund: „grau-bläulich verwaschen". Und alles, was auf dem Boden STEHT
// (Props 0,225 · Würfel-Creme 0,811) stand plötzlich 3- bis 10-fach über seinem eigenen Grund —
// daher „Bäume zu hell" und „Würfel falsch beleuchtet". **Drei Beschwerden, ein Zahlenfehler.**
//
// Der Rückbau ist EIN Faktor (2,79 = 0,215/0,077), auf alle fünf Bänder gleich. Hue und
// Sättigung sind unangetastet (H ±1°, S ±0,01) — der Kanon sagt WELCHE Farbe, das Band sagte
// wie hell, und das Band ist weg. Die Bandstruktur (Strand hell → Fels dunkel → Firn Gipfel)
// bleibt exakt erhalten: dies ist eine Rücknahme, keine Neugestaltung.
// Firn ist ausgenommen und auf 0,70 gesetzt (tinyskies 0,802 mit Rand) — es ist das einzige Band,
// das auf der besonnten Fläche klippen DARF, und es hat seine Sättigung schon 27.8. abgegeben.
const LAND_HEX = {
  strand: 0xb89e4c,   // L(lin) 0.352  (war 0x72612d · 0.121)
  ebene: 0x698959,    // L(lin) 0.216  (war 0x405336 · 0.077) — tinyskies-Gras 0.215
  hang: 0x837459,     // L(lin) 0.180  (war 0x4f4636 · 0.063)
  fels: 0x6b665f,     // L(lin) 0.135  (war 0x403d39 · 0.048)
  firn: 0xdadad5,     // L(lin) 0.699  (war 0x9b9a8d · 0.321) — Schnee, Sonderfall
};

function mix(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function smoothstep(min, max, x) {
  if (x <= min) return 0;
  if (x >= max) return 1;
  const t = (x - min) / (max - min);
  return t * t * (3 - 2 * t);
}

export function createGlobe(o) {
  const THREE = o.THREE;
  initRimLight(THREE);
  const radius = o.radius != null ? o.radius : 5;
  const segments = o.segments != null ? o.segments : 256;
  const seed = o.seed, terrainType = o.terrainType || 'default';
  // Die Farben kommen jetzt aus dem Tageszeit-Preset (`sky-presets.js`), nicht mehr aus einer
  // eigenen Tabelle — so wie in `Game.ts` Zeile 1203 f., wo der Globus sie vom Preset bekommt.
  const atmosphereGlow = o.atmosphereGlow != null ? o.atmosphereGlow : 0xeeddbb;
  const rimColor = o.rimColor != null ? o.rimColor : 0xffeebb;
  const cloudOpacity = o.cloudOpacity != null ? o.cloudOpacity : 0.2;

  // Alle Farben durch `THREE.Color` — damit macht three die sRGB-nach-linear-Umrechnung, statt sie
  // uns zu überlassen. Einmal je Welt, nicht je Vertex.
  const toLin = (hex) => { const c = new THREE.Color(hex); return [c.r, c.g, c.b]; };
  const KFB_COLORS = {
    strand: toLin(LAND_HEX.strand), ebene: toLin(LAND_HEX.ebene), hang: toLin(LAND_HEX.hang),
    fels: toLin(LAND_HEX.fels), firn: toLin(LAND_HEX.firn),
  };
  // ── Die Terrain-Palette der Quelle, wörtlich aus `Globe.ts · createSurface` ────────────────
  // Vier Grüntöne für die Tieflagen, drei warme Flecktöne darüber, ein helles Bergbraun, Schnee.
  // Keine Umrechnung, keine Anpassung: `new THREE.Color(hex)` macht daraus dieselben Linearwerte,
  // die die Quelle in ihren Puffer schreibt (dort `new Color(0x…).r/g/b`).
  // ── Der dritte Weg: IHRE Regeln, UNSERE Farbtöne ─────────────────────────────────────────────
  // Georg, 30.8.: „mach den dritten Weg" — und dahinter die Vorgabe, die ab jetzt für alles gilt:
  // **„TS ist führend für uns, weil es gut ist und funktioniert. Im Zweifel stirbt ein Feature und
  // wir denken uns etwas passendes aus."**
  //
  // Zwei Runden lang habe ich die Frage falsch gestellt: unsere Farben ODER ihre. Das Aussehen der
  // Quelle steckt aber nicht in den Farbwerten, sondern in DREI REGELN — und die sind übernehmbar,
  // ohne die KFB-Farbwelt zu verlieren:
  //   1. **Kräftig, nicht blass.** Ihre Ebene hat Sättigung 0,39; unsere hatte 0,21. Halbe
  //      Sättigung IST das Grau, und Aufhellen macht es schlimmer, nicht besser.
  //   2. **Ein Fleckenmuster** über den Tieflagen (drei warme Töne, rauschgesteuert, bis 60 %) —
  //      Unruhe statt Mittelwert. Das ersetzt unsere gleichmäßige Biom-Übertönung.
  //   3. **Nach oben HELLER.** Gras → helles Bergbraun → Schnee. Unsere alte Reihe wurde
  //      mittendrin dunkler (Fels), und ein Berg, der dunkler ist als seine Ebene, liest als
  //      Schmutz, nicht als Höhe.
  //
  // Umgesetzt als Rechnung, nicht als Geschmack: **Sättigung und Helligkeit kommen unverändert aus
  // der Quelle, nur der FARBTON ist KFB** (die Hues aus `LAND_HEX` oben — ebene, strand, hang,
  // firn). Damit gilt Regel 1 der Quelle per Konstruktion, und die Abweichung ist auf EINE Größe
  // begrenzt und benennbar. `palettenProbe()` weiter unten weist sie aus: Farbton = unsere
  // Entscheidung, Sättigung und Helligkeit = Quelle, Δ ≤ 0,01. **Eine Abweichung, die ein
  // Instrument ausspricht, ist eine Entscheidung; eine, die es nicht ausspricht, ist ein Fehler.**
  const TS_QUELLE = {                 // die Werte der Quelle, als Bezugspunkt für die Probe
    land: [0x3a7d2a, 0x4a8f3f, 0x5a9f4a, 0x5e9a48],
    warm: [0x8a9a30, 0xa89530, 0xb08828],
    mountain: 0xc4b07a, snow: 0xe8e8e0,
  };
  const TS_HEX = {                    // dieselbe S und L, KFB-Farbton
    // land[0] 0x3a7d2a → 0x477d2a  · H 108°→99° (KFB ebene)
    // land[1] 0x4a8f3f → 0x5b8f3f  · H 112°→99° (KFB ebene)
    // land[2] 0x5a9f4a → 0x679f4a  · H 109°→100° (KFB ebene)
    // land[3] 0x5e9a48 → 0x649a48  · H 104°→100° (KFB ebene)
    land: [0x477d2a, 0x5b8f3f, 0x679f4a, 0x649a48],
    // warm[0] 0x8a9a30 → 0x9a9230  · H 69°→55° (KFB firn)
    // warm[1] 0xa89530 → 0xa88a30  · H 51°→45° (KFB strand)
    // warm[2] 0xb08828 → 0xb07f28  · H 42°→38° (KFB hang)
    warm: [0x9a9230, 0xa88a30, 0xb07f28],
    mountain: 0xc4b27a,   // 0xc4b07a · KFB strand-Hue
    snow: 0xe8e7e0,       // 0xe8e8e0 · KFB firn-Hue · bleibt das hellste Band
  };
  // ── Die Zonen kommen zurück — aber als FLECKENFARBE, nicht als Übertönung ────────────────────
  // Georg, 30.8.: „ja, lass uns das versuchen." Die alte Biom-Tönung mischte einen Grundton über
  // die GANZE Landmasse — ein Mittelwert, der die Sättigung der Quelle wieder wegnahm (deshalb
  // stand sie auf 0). Die Quelle hat für dieselbe Aufgabe ein besseres Werkzeug: das
  // **Fleckenmuster**. Es liegt nur auf den Tieflagen, ist rauschgesteuert und lässt zwischen den
  // Flecken die Grundfarbe stehen — Unruhe statt Weichzeichner.
  // Also erbt jede Zone ihre EIGENE Dreiergruppe von Fleckenfarben. Der Mechanismus bleibt
  // vollständig der der Quelle (Rauschen `seed+555`, Skala 4, Schwelle 0,2, Beimischung bis 0,6);
  // was sich je Gegend ändert, ist ausschließlich der **Farbton** — Sättigung und Helligkeit sind
  // in allen zwölf Werten die der Quelle, auf drei Stellen genau. Damit gilt Regel 1 („kräftig,
  // nicht blass") in jeder Zone, und die Gegend ist wieder ablesbar, ohne dass etwas verblasst.
  //
  // ⚠ **Volle Zonen-Farbtöne, kein halber Weg.** `spires` ist blau (233°) und springt damit 125°
  // vom Grün weg — das ist laut. Ein Regler, der „ein bisschen Zone" mischt, wäre genau die stille
  // Mitte aus §05q: eine RGB-Blende zwischen zwei weit entfernten Farbtönen läuft durch GRAU, also
  // hätte ein Mittelwert exakt den Fehler wieder eingebaut, den wir heute dreimal bezahlt haben.
  // Deshalb: der volle Ton, und wenn er im Bild zu laut ist, wird die ZONENFARBE geändert, nicht
  // die Beimischung verdünnt.
  //   plateau    H  42°  0x9a7b30 0xa88530 0xb08828   (Zonenfarbe 0x695628)
  //   spires     H 233°  0x303c9a 0x303ea8 0x2838b0   (Zonenfarbe 0x484b62)
  //   shatter    H 148°  0x309a62 0x30a868 0x28b068   (Zonenfarbe 0x375746)
  //   flatwater  H  47°  0x9a8330 0xa88e30 0xb09228   (Zonenfarbe 0x695c2e)
  const BIOM_WARM_HEX = [
    [0x9a7b30, 0xa88530, 0xb08828],   // plateau
    [0x303c9a, 0x303ea8, 0x2838b0],   // spires
    [0x309a62, 0x30a868, 0x28b068],   // shatter
    [0x9a8330, 0xa88e30, 0xb09228],   // flatwater
  ];
  const BIOM_WARM = BIOM_WARM_HEX.map((d) => d.map(toLin));
  const TS = {
    land: TS_HEX.land.map(toLin), warm: TS_HEX.warm.map(toLin),
    mountain: toLin(TS_HEX.mountain), snow: toLin(TS_HEX.snow),
  };
  const patchNoise = noiseForSeed(seed + 555);
  const oceanShallow = toLin(o.oceanShallow != null ? o.oceanShallow : 0x2a8ca0);
  // v3 · S3c · Biom-Tönung: EINE Mischung über die vier Domänenfarben, aufgetragen NACH den
  // Höhenbändern. Reihenfolge ist Absicht — die Bänder (Strand/Ebene/Hang/Fels/Firn) sind die
  // Lesbarkeit der Höhe, das Biom ist nur der Grundton. Umgekehrt fräse das Biom die Höhe weg.
  // 0 = quellentreu (kein Rückweg-Verlust, Regel „kein Gimmick ohne Rückweg").
  // ⚠ Standard war 0,34 — jetzt **0**, quellentreu. Begründung im Landzweig unten: zwei Systeme
  // für denselben Grundton, und das der Quelle (warme Flecken) ist das bessere. Der Regler bleibt
  // vollständig erhalten, damit Slice H ihn drehen kann.
  const biomeTint = o.biomeTint != null ? o.biomeTint : 0;
  const BIOME_LIN = BIOMES.map((b) => toLin(b.col));
  const oceanDeep = toLin(o.oceanDeep != null ? o.oceanDeep : 0x1560a0);
  // (kein `foam` als Linear-Tripel mehr: der Schaum lebt im Shader, siehe unten im Wasser-Zweig)

  const geo = new THREE.SphereGeometry(radius, segments, segments);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  // Wassertiefe je Vertex — der Oberflächen-Patch liest sie als Attribut `oceanDepth` und macht
  // daraus Küstenlinien, Schaum und Glitzern. Auf Land ist sie 0.
  const oceanDepths = new Float32Array(pos.count);
  // ── S9f · Die Landmaske ─────────────────────────────────────────────────────────────────────
  // `light-budget` maß bis zum 29.8. die Albedo des GANZEN Netzes und verglich sie mit einem Band,
  // das nur für LAND gilt. Ergebnis: die Anzeige meldete `face load 1.487 ⚠ CLIPS`, während das
  // Dokument `0,31 ✓` behauptete — Instrument und Bericht widersprachen sich über dieselbe Größe.
  // Und der Wert schwankte um Faktor 5 mit dem Seed, je nachdem wieviel helles Flachwasser die
  // Stichprobe traf. **Ein Maß, das sich mit dem Seed fünffach ändert, ist keine Grenze.**
  //
  // Eine Farbheuristik („blaustichig = Wasser") wäre der nächste Fehler derselben Art: das
  // Biom `spires` ist selbst blaustichig (linear r 0,067 g 0,075 b 0,132) und würde als Wasser
  // gezählt. Wer raten muss, hat den falschen Ort gefragt.
  // **Hier ist der richtige Ort:** der Bäcker entscheidet Land oder Wasser sowieso, für jeden
  // Vertex, mit `terrainIsLand`. Er schreibt die Antwort mit — ein Bit je Vertex, 66 049 Byte,
  // und danach muss niemand mehr raten.
  const landMask = new Uint8Array(pos.count);
  // ⚠ **Die Schneemaske — und sie ist eine SCHWELLE, keine Farbheuristik.**
  // Die Abnahme `SAT_KEEP` hat nach dem Palettenwechsel rot gemeldet, und zwar zu Recht: das
  // Band Berg→Schnee der Quelle (`mountainColor 0xc4b07a` → `snowColor 0xe8e8e0`) läuft
  // zwangsläufig durch „hell und wenig gesättigt" — genau das, was `SAT_KEEP` verbietet.
  // `globe.js` hat den Fall schon 27.8. benannt: *„Firn ist der eine Fall, in dem
  // Sättigungserhalt FALSCH ist … ein Near-White bezieht seine WEISSHEIT aus NIEDRIGER Sättigung
  // bei hoher Helligkeit."* In der Quelle klippt besonnter Schnee ebenfalls (L 0,802).
  // Also wird die Ausnahme **benannt und begrenzt**, statt die Grenze zu senken oder die Palette
  // zu verbiegen: dieselbe Höhenschwelle, die die Quelle für dieses Band benutzt (`e > 0.7`).
  // Nach Farbe zu maskieren wäre der Fehler, den `light-budget` selbst ausschreibt („eine
  // Farbheuristik wäre der nächste Fehler derselben Art") — Schnee ist hier weiß, Flachwasser
  // auch, und der Berg wäre gleich mitbefreit.
  const snowMask = new Uint8Array(pos.count);
  // ⚠ **Ein eigenes Land-Bit als Attribut, und der Grund ist Interpolation.**
  // Georg, 30.8., am Bild: *„das scheint immer noch zu hoch zu sitzen mit den polygonen…?"* — der
  // Wasser-Zweig lief weiter über Küstenhügel, obwohl das Tor schon auf `vOceanDepth > 0.0` stand.
  // Ursache: ein Varying wird über das DREIECK interpoliert. Land trägt `oceanDepth = 0`,
  // Flachwasser `max(0.001, depth)` — **die beiden liegen numerisch fast aufeinander.** Jedes
  // Dreieck mit einem Wasser- und zwei Landecken hat damit über fast seiner ganzen Fläche einen
  // Wert > 0, und der Shader hält sie für Wasser. Eine höhere Schwelle wäre keine Lösung: dann
  // fiele das echte Flachwasser mit heraus, das genau dort auch bei 0,001 liegt.
  // *Ein Tor, dessen zwei Antworten 0 und 0,001 heißen, ist kein Tor, sondern eine Rundung.*
  // Also ein Wert, der den vollen Bereich hat: 1 auf Land, 0 auf Wasser. Bei 0,5 schneidet die
  // Interpolation dann exakt in der geometrischen Mitte des Küstendreiecks — statt über seine
  // ganze Fläche zu bluten. Bei Kameradistanz 0,52 über einer Kugel mit Radius 5 ist ein einzelnes
  // Dreieck bildschirmfüllend; genau deshalb war der Fehler so groß zu sehen.
  const landFlags = new Float32Array(pos.count);
  const rugged = noiseForSeed(seed + 9001);
  // ⚠ **Zwei Zahlen je Vertex, damit eine Stimmung UMFÄRBEN kann statt die Welt neu zu bauen.**
  // Dieselbe Lehre wie beim Ozean (§05o): die Quelle hält die Wassertiefe je Vertex vor, um beim
  // Zeitwechsel umzufärben, ohne das Rauschen neu zu würfeln. Für das Land braucht es genau zwei
  // Größen — die Höhe (welches Band) und den Fleckenwert (wie viel warmer Ton). Beide sind das
  // Ergebnis von Rauschen; sie neu zu würfeln wäre nicht nur teuer, es wäre auch nicht garantiert
  // dasselbe Ergebnis. **Ein Wert, der aus Rauschen kommt, wird gespeichert, nicht wiederholt.**
  const elevs = new Float32Array(pos.count);
  const patchVals = new Float32Array(pos.count);

  /** Farbton setzen, Sättigung und Helligkeit behalten — das einzige, was eine Stimmung darf.
   *  Gerechnet in sRGB-HSL, weil die Palettenwerte dort entschieden wurden; `toLin` macht danach
   *  wieder Linearwerte für den Puffer. */
  const _c = new THREE.Color(), _hsl = {};
  function tonDrehen(hex, gradOderNull) {
    if (gradOderNull == null) return hex;
    _c.set(hex).getHSL(_hsl, THREE.SRGBColorSpace);
    _c.setHSL(((gradOderNull % 360) + 360) % 360 / 360, _hsl.s, _hsl.l, THREE.SRGBColorSpace);
    return _c.getHex(THREE.SRGBColorSpace);
  }

  /** ⚠ **EINE Funktion für die Landfarbe, zwei Aufrufer.** Der Bäcker und `setStimmung()` müssen
   *  bitgleich dasselbe rechnen — sonst sieht die Welt nach einer Stimmungsumschaltung anders aus
   *  als nach einem Neuladen, und niemand findet den Unterschied, weil beide „richtig" aussehen.
   *  Das ist die Zwei-Eigentümer-Klasse, diesmal vorab vermieden statt hinterher bezahlt.
   *  `PAL` trägt die aktuellen Farbwerte (Stimmung schon eingerechnet), `e` die Höhe und
   *  `patch` den gespeicherten Fleckenwert. */
  function landFarbe(PAL, e, patch, nx, ny, nz) {
    let c;
    if (e > 0.7) {
      c = mix(PAL.mountain, PAL.snow, Math.min(1, (e - 0.7) / 0.3));
    } else if (e > 0.4) {
      c = mix(PAL.land[3], PAL.mountain, (e - 0.4) / 0.3);
    } else {
      const t = Math.min(1, e * 2.5);
      const idx = Math.floor(t * (PAL.land.length - 2));
      const frac = t * (PAL.land.length - 2) - idx;
      c = mix(PAL.land[idx], PAL.land[Math.min(idx + 1, PAL.land.length - 2)], frac);
      if (patch > 0.2) {
        const pt = Math.min(1, (patch - 0.2) * 2.5);
        const wz = biomeWeightsAt(nx, ny, nz);
        const drei = [];
        for (let k = 0; k < 3; k++) {
          let r = 0, gg = 0, bb = 0;
          for (let b = 0; b < PAL.zonen.length; b++) {
            const q = PAL.zonen[b][k];
            r += wz[b] * q[0]; gg += wz[b] * q[1]; bb += wz[b] * q[2];
          }
          drei.push([r, gg, bb]);
        }
        const pIdx = Math.floor(pt * (drei.length - 1));
        const pFrac = pt * (drei.length - 1) - pIdx;
        const warm = mix(drei[pIdx], drei[Math.min(pIdx + 1, drei.length - 1)], pFrac);
        c = mix(c, warm, pt * 0.6);
      }
    }
    return c;
  }

  /** Die Palette in Linearwerten, aus Hexwerten plus optionalen Stimmungs-Farbtönen gebaut. */
  function paletteBauen(st) {
    const t = (hex, grad) => toLin(tonDrehen(hex, grad));
    return {
      land: TS_HEX.land.map((h) => t(h, st ? st.land : null)),
      mountain: t(TS_HEX.mountain, st ? st.berg : null),
      snow: t(TS_HEX.snow, st ? st.schnee : null),
      zonen: BIOM_WARM_HEX.map((d, b) => d.map((h) => t(h, st && st.zonen ? st.zonen[b] : null))),
    };
  }
  let PAL_JETZT = paletteBauen(null);
  let stimmungJetzt = null;

  let peak = -1e9, land = 0;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    const nx = x / len, ny = y / len, nz = z / len;
    const value = sampleTerrainValue(seed, terrainType, nx, ny, nz);
    const disp = surfaceDisplacementFromValue(seed, terrainType, nx, ny, nz, value, rugged);
    const r = radius + disp;
    pos.setXYZ(i, nx * r, ny * r, nz * r);

    let c;
    if (terrainIsLand(terrainType, value)) {
      land++;
      landMask[i] = 1;
      landFlags[i] = 1;
      const e = terrainElevationFromValue(terrainType, value);
      // ── 1:1 aus `Globe.ts · createSurface` (Tree 2659a5cc987d, gelesen 30.8.) ────────────────
      // ⚠ **Georg, 30.8.: „ich will den tinyskies look zurück, 1:1! warum geht das nicht?!"**
      // Antwort, und sie ist unangenehm: weil ich nie ihre Palette genommen habe, sondern nur
      // ihre ZAHLEN ÜBER ihre Palette. Der Rückbau eine Stunde vorher hat die Helligkeit
      // angeglichen und dabei ausdrücklich „Hue und Sättigung unangetastet" als Tugend notiert —
      // genau das war der Fehler. Gegenübergestellt:
      //   ihre Ebene `0x4a8f3f` → Sättigung 0,39, Hue 107° (Grün)
      //   unsere Ebene `0x698959` → Sättigung 0,21, Hue 100° (Grau-Grün)
      // **Halbe Sättigung IST das Grau.** Man kann eine gesättigte Welt nicht durch Anheben der
      // Helligkeit erreichen; Helligkeit ohne Sättigung ist genau die Definition von verwaschen.
      //
      // Und es fehlten drei STRUKTUREN, nicht nur Farbwerte:
      //  1. **Warme Flecken.** Die Quelle legt über die Tieflagen ein rauschgesteuertes Patchwork
      //     aus Gelbgrün/Gold/Orangebraun, bis zu 60 % beigemischt. Das ist die Unruhe, die ihr
      //     Land lebendig macht. Wir hatten stattdessen unsere Biom-Tönung — gleichmäßig,
      //     luminanzgepinnt, und damit ein Weichzeichner statt eines Musters.
      //  2. **Die Höhe wird HELLER, nicht dunkler.** Ihre Reihe: Gras → helles Sandbraun
      //     (`0xc4b07a`, L 0,438) → Schnee (0,802). Unsere ging Sand → Grün → Braun → **Grau**
      //     → Weiß, also mittendrin nach unten. Ein Berg, der dunkler wird als seine Ebene, liest
      //     als Schmutz, nicht als Höhe.
      //  3. **Die Bandgrenzen sind harte Schwellen** (0,4 / 0,7), keine `smoothstep`-Rampen. Das
      //     ist bei Flat-Shading Absicht: die Facette bekommt eine Kante, und die Kante ist die
      //     Lesbarkeit. Unsere weichen Rampen haben die Bänder ineinandergezogen — vier Töne, die
      //     sich gegenseitig entsättigen, sind am Ende ein Ton.
      //
      // Was das KOSTET, offen gesagt: die KFB-Landpalette (Strand/Ebene/Hang/Fels/Firn) ist damit
      // für das Terrain aufgegeben. Sie war unsere Zeile, nicht die der Quelle. Der Rückweg steht
      // vollständig als `LAND_HEX` weiter oben in dieser Datei — wer sie zurückholen will, muss
      // dann aber die Sättigung mitentscheiden, sonst kommt das Grau mit.
      if (e > 0.7) snowMask[i] = 1;
      elevs[i] = e;
      patchVals[i] = patchNoise(nx * 4, ny * 4, nz * 4);
      c = landFarbe(PAL_JETZT, e, patchVals[i], nx, ny, nz);
      if (disp > peak) peak = disp;
      oceanDepths[i] = 0;
    } else {
      // Tiefenverlauf plus Schaumsaum. Der Schaum ist die Zeile, die aus einer blauen Kugel eine
      // Küstenlinie macht — ohne ihn stoßen Land und Wasser hart aneinander und alles wirkt wie
      // ein Polygonklumpen.
      // ⚠ Aus der ENDGÜLTIGEN Verschiebung, nicht aus einer, die nicht mehr negativ sein kann.
      // Vorher klemmte dieser Wert auf 0,001, sobald `disp` positiv war — die Tiefe meldete dann
      // „flachstmögliches Wasser" für einen Vertex, der 0,12 ÜBER der Kugel saß. *Ein Messwert,
      // der bei falscher Eingabe seinen günstigsten Wert annimmt, verdeckt den Fehler doppelt.*
      const depth = Math.min(1, Math.max(0, -disp * 100));
      oceanDepths[i] = Math.max(0.001, depth);
      c = mix(oceanShallow, oceanDeep, depth);
      // ⚠ **Hier stand `c = mix(c, foam, … * 0.55)` — Schaum in die VERTEXFARBE gebacken.**
      // Die Quelle tut das nicht: `Globe.ts` schreibt `color = oceanShallow.lerp(oceanDeep, depth)`
      // und nichts weiter; der Schaum entsteht ausschließlich im Shader (Kontourlinien +
      // offener Schaum + Glitzern). Wir hatten ihn an BEIDEN Stellen — 55 % Beinahe-Weiß
      // (`0xb3ffff` = linear 0,43/1,0/1,0) im Puffer, und der Shader legte oben nochmal welchen
      // drauf. Sichtbar war das der **weiße Saum um jede Küste** (Georg, 30.8.: „da ist immer noch
      // etwas kaputt … sieht in tinyskies deutlich anders und besser aus"), messbar als
      // Wasser-Albedo max **0,584** gegen tinyskies' 0,218, mit `load 1.487` — es klippte.
      // Zwei Nebenschäden, die mit demselben Strich weggehen:
      //   · Der Shader liest `shallowness = smoothstep(0.1, 0.22, vColor.r)` — mit eingebackenem
      //     Schaum war `vColor.r` künstlich hoch, also hielt der Shader tiefes Wasser für flaches.
      //   · Das Ozean-Tor `vColor.b > vColor.r + vColor.g * 0.5` bestand nur noch knapp
      //     (1,0 gegen 0,93) — ein Tor, das an einer Zusatzfarbe hängt, ist kein Tor.
      // *Ein Effekt, der an zwei Stellen aufgetragen wird, ist nicht doppelt so schön, sondern
      // an einer der beiden Stellen falsch — und die Zahl sagt, an welcher.*
    }
    colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2];
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  // S9f · Die Maske reist MIT den Farben: wer die Farben liest, kann fragen, welche Land sind.
  geo.userData.kfbLandMask = landMask;
  // Die Schneemaske reist mit den Farben, aus demselben Grund wie die Landmaske: wer die Farben
  // liest, kann fragen, welche Proben unter die benannte Ausnahme fallen — statt zu raten.
  geo.userData.kfbSnowMask = snowMask;
  geo.setAttribute('oceanDepth', new THREE.BufferAttribute(oceanDepths, 1));
  geo.setAttribute('landFlag', new THREE.BufferAttribute(landFlags, 1));
  geo.computeVertexNormals();

  // `flatShading` ist Absicht und stammt aus der Quelle (Globe.ts Zeile 428 ff.): 256 Segmente auf
  // Radius 5, Vertexfarben, facettiert. **Die Facetten SIND der Look** — nachgeprueft am 27.8.,
  // Konstruktor-Signatur `radius = 5 … segments = 256`. Was den Unterschied macht, ist nicht mehr
  // Geometrie, sondern die Politur darum: Ozeantiefe, Schaum, Atmosphaerensaum.
  const oceanTime = { value: 0 };
  const mat = new THREE.MeshPhongMaterial({ vertexColors: true, shininess: 8, flatShading: true });
  const rimColorValue = new THREE.Color(rimColor);
  const foamColorValue = new THREE.Color(o.oceanFoam != null ? o.oceanFoam : 0xb3ffff);
  const sparkleGainU = { value: o.sparkleGain != null ? o.sparkleGain : 1 };
  // v9 · Regler auf der WIEDERHERGESTELLTEN Größe. 1 = die Kurve der Quelle, nicht mehr und
  // nicht weniger; höher heißt „mehr Flachwasser-Struktur, weiter hinaus".
  const glanzGainU = { value: o.glanzGain != null ? o.glanzGain : 1 };
  mat.onBeforeCompile = (shader) => {
    // Der Shader wird festgehalten, damit die Abnahme das ECHTE Uniform lesen kann und nicht
    // unsere Notiz darüber. Ein Prüfstand, der die eigene Buchhaltung befragt, prüft nichts.
    mat.userData.shader = shader;
    shader.uniforms.oceanTime = oceanTime;
    shader.uniforms.rimColor = { value: rimColorValue };
    shader.uniforms.rimIntensity = { value: QUELLE.rimIntensity };
    shader.uniforms.rimPower = { value: QUELLE.rimPower };
    shader.uniforms.foamColor = { value: foamColorValue };
    // ⚠ **Ein Faktor, keine zweite Formel.** Georg, 30.8.: „das flackern jetzt große weiße Kreise
    // auf dem wasser — sollen das partikel sein?" Nein: es ist das Glitzern der Quelle, und es ist
    // NEU seit der Kopie — meine vorige (nachgerechnete) Fassung bildete ein Fünferprodukt und
    // löste dadurch fast nie aus. Die Quelle bildet `sp1*sp2*sp3*sp4 + sp2*sp3*sp5*0.5` und
    // multipliziert mit einer NIEDERFREQUENTEN Maske — also glitzernde FLECKEN, keine Punkte.
    // Bei Kameradistanz 0,52 auf einer Kugel mit Radius 5 laufen die Trägerfrequenzen (40/35/27/71
    // auf die Weltkoordinate) unter die Pixelbreite: das ergibt Moiré, und Moiré wandert mit der
    // Kamera — daher das Flackern. Das ist eine Abtastfrage, keine Farbfrage.
    // Der Regler steht auf 1 (quellentreu) und ändert die Formel nicht. Er ist da, damit die Frage
    // „ist es das?" mit einem Klick beantwortet wird statt mit einer Vermutung von mir.
    shader.uniforms.sparkleGain = sparkleGainU;
    shader.uniforms.glanzGain = glanzGainU;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>' + SURFACE_VERTEX_DECL)
      .replace('#include <begin_vertex>', '#include <begin_vertex>' + SURFACE_VERTEX_BODY);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>' + SURFACE_FRAGMENT_DECL)
      .replace('#include <dithering_fragment>', SURFACE_FRAGMENT_BODY + '\n#include <dithering_fragment>');
  };
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'globe';

  // ⚠ **Keine Extra-Wasserkugel.** Ich hatte eine glatte Kugel bei radius + 0,004 eingezogen —
  // die gibt es in der Quelle NICHT. Der Ozean ist Teil der verschobenen Oberfläche (negative
  // Auslenkung) und bekommt sein Leben aus dem Shader-Patch oben. Meine Kugel lag genau davor und
  // hat Schaum, Küstenlinien und Glitzern abgedeckt: eine glatte, riesige Fläche — der halbe
  // „Polygonklumpen"-Eindruck. Ersatzlos raus.

  // ⚠ **Atmosphäre 1:1: `radius * 1.55`, 48 Segmente, `BackSide`** (Globe.ts Zeile 5296–5311).
  // Mein erster Versuch hatte 1,055 — ein hauchdünner Saum direkt auf der Oberfläche. Die Quelle
  // baut eine mehr als anderthalbmal so große Hülle: dadurch liegt Luft VOR und HINTER dem
  // Planeten, die Silhouette bekommt Tiefe, und die Facetten lesen sich als Gelände statt als
  // Polygonkante. Das ist der sichtbarste Einzelposten der ganzen Politur.
  const atmoGeo = new THREE.SphereGeometry(radius * 1.55, 48, 48);
  const atmosphereGlowUniform = { value: new THREE.Color(atmosphereGlow) };
  const atmoMat = new THREE.ShaderMaterial({
    vertexShader: ATMOSPHERE_VERTEX,
    fragmentShader: ATMOSPHERE_FRAGMENT,
    uniforms: { glowColor: atmosphereGlowUniform },
    side: THREE.BackSide, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const atmo = new THREE.Mesh(atmoGeo, atmoMat);
  atmo.name = 'globe-atmosphere';

  // ── Wolken: 30 Cumulus-Gruppen auf einem driftenden Ring ─────────────────
  const cloudOpacityUniform = { value: cloudOpacity };
  const cloudMat = new THREE.ShaderMaterial({
    vertexShader: CLOUD_VERTEX, fragmentShader: CLOUD_FRAGMENT,
    uniforms: { cloudColor: { value: new THREE.Color(0xffe8cc) }, opacity: cloudOpacityUniform },
    // ⚠ **FrontSide, nicht DoubleSide.** Mit DoubleSide und `depthWrite: false` wird von jedem Puff
    // Vorder- UND Rückseite gezeichnet; die Rückseiten scheinen durch und zeichnen die Silhouette
    // jeder einzelnen Kugel nach — das waren Georgs „Wolken-Skelette" (27.8., 04:07).
    // ⚠ **v3c · ADDITIVE, nicht Normal — und das war der ganze Grund für die „grauen Wolken".**
    // Georg, 29.8.: „die grauen Wolken stören noch → bitte exakt von tinyskies übernehmen (Blend
    // Mode, Color-Logik etc)". Nachgelesen in `Globe.ts` 5213–5214: `depthWrite: false` UND
    // **`blending: AdditiveBlending`**. Ich hatte NormalBlending gewählt (ohne es zu prüfen), und
    // damit kann eine Wolke DUNKLER werden als der Himmel dahinter — genau der Schmutz-Eindruck.
    // Additiv kann sie nur aufhellen. Dazu die exakte Schattierung aus 5203–5209:
    // `rim*rim*(0.3 + 0.7*upFactor)` mit `upFactor = smoothstep(-0.8, 0.2, y)` — meine Fassung
    // hatte `mix(0.35, 1.0, rim)` und `smoothstep(-0.9, 0.1, y)`, also Eigenbau an zwei Stellen.
    // Kein `side` in der Quelle, also FrontSide (das bleibt: DoubleSide waren die Skelette).
    transparent: true, depthWrite: false, side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
  });
  const cloudRing = new THREE.Group();
  cloudRing.name = 'globe-clouds';
  const cloudDriftAxis = new THREE.Vector3(0.2, 1, 0.1).normalize();
  {
    let cs = (seed ^ 0x5f3a) >>> 0;
    const rand = () => { cs = (Math.imul(cs, 1664525) + 1013904223) >>> 0; return cs / 0x100000000; };
    const cloudAlt = radius + CLOUD_ALTITUDE;
    const cloudSizes = [
      { weight: 0.5, puffs: [3, 4], scale: 0.14 },
      { weight: 0.35, puffs: [5, 6], scale: 0.2 },
      { weight: 0.15, puffs: [7, 9], scale: 0.28 },
    ];
    // ⚠ **16×12 Segmente je Puff, wie in der Quelle (Globe.ts Zeile 5217).** Ich hatte 7×5 gewählt —
    // eine Sparsamkeit, die man sofort sieht: bei sieben Meridianen ist eine Kugel ein Kristall, und
    // dreissig übereinanderliegende Kristalle sind ein Skelett. Die Kosten sind gering, weil alle
    // Puffs DIESELBE Geometrie teilen.
    const puffGeo = new THREE.SphereGeometry(1, 16, 12);
    for (let i = 0; i < CLOUD_COUNT; i++) {
      const cloud = new THREE.Group();
      const roll = rand();
      let acc = 0, sizeType = cloudSizes[0];
      for (const c of cloudSizes) { acc += c.weight; if (roll <= acc) { sizeType = c; break; } }
      const puffCount = sizeType.puffs[0]
        + Math.floor(rand() * (sizeType.puffs[1] - sizeType.puffs[0] + 1));
      for (let p = 0; p < puffCount; p++) {
        const puff = new THREE.Mesh(puffGeo, cloudMat);
        const r = sizeType.scale * (0.55 + rand() * 0.6);
        puff.scale.set(r * (1.1 + rand() * 0.5), r * 0.72, r * (1.1 + rand() * 0.5));
        puff.position.set((rand() - 0.5) * sizeType.scale * 2.6, 0,
                         (rand() - 0.5) * sizeType.scale * 1.7);
        // Böden ausrichten: flachere Cumulus-Basis (Kommentar der Quelle, Zeile 5262).
        puff.position.y = r * 0.72 - sizeType.scale * 0.5;
        cloud.add(puff);
      }
      const theta = Math.acos(2 * rand() - 1), phi = rand() * Math.PI * 2;
      const n = new THREE.Vector3(Math.sin(theta) * Math.cos(phi), Math.cos(theta),
                                 Math.sin(theta) * Math.sin(phi));
      const altVariation = cloudAlt + (rand() - 0.5) * 0.3;
      cloud.position.copy(n).multiplyScalar(altVariation);
      cloud.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
      cloud.rotateY(rand() * Math.PI * 2);
      cloudRing.add(cloud);
    }
  }

  const group = new THREE.Group();
  group.name = 'globe-group';
  // EIN Schreiber auf das Glut-Uniform: Grundfarbe (Preset/Tag-Nacht) × Blende (Kameradistanz).
  const glowBase = new THREE.Color(atmosphereGlow);
  let atmoFade = 1;
  const atmoWrite = () => { atmosphereGlowUniform.value.copy(glowBase).multiplyScalar(atmoFade); };
  atmoWrite();

  // ⚠ **Der Ozean hat EINEN Schreiber, und die Stimmung ist ein MODIFIKATOR — kein zweiter.**
  // Erste Fassung von Slice H rief `setOceanColors()` direkt aus der Stimmung. Der Tag/Nacht-Zyklus
  // ruft dieselbe Funktion aus seiner Schleife, mit den ungedrehten Preset-Werten — und gewinnt
  // nach EINEM Tick. Gemessen von der Abnahme: Stimmung frost anlegen → `#2a94a0`, ein
  // `zyklus.update(0.2)` später → `#2a8ca0`, der reine Preset-Wert. Der Zustand log: `stimmung`
  // meldete weiter `frost`, das Wasser war verdant. Bei laufender Uhr war die Wasserfarbe der
  // Stimmung **nie sichtbar**.
  // Und der Kommentar direkt über dem Aufruf sagte, warum man das nicht tut. *Eine Regel im
  // Kommentar zu haben und zwei Zeilen später zu brechen, ist schlechter als sie nicht zu kennen —
  // sie beruhigt beim Lesen.*
  // Also: der Zyklus bleibt der einzige Aufrufer. `ozeanEingang` hält, was er letztes gesagt hat;
  // `wasserTon` ist der Farbton der Stimmung; die Drehung passiert INNEN, an einem Ort. Eine
  // Stimmungsumschaltung malt mit dem gespeicherten Eingang neu — sie braucht den Zyklus nicht.
  let wasserTon = null;
  let ozeanEingang = [o.oceanShallow != null ? o.oceanShallow : 0x2a8ca0,
                      o.oceanDeep != null ? o.oceanDeep : 0x1560a0,
                      o.oceanFoam != null ? o.oceanFoam : 0xb3ffff];
  let ozeanStand = ozeanEingang.slice();
  /** Der EINE Ort, an dem Wasserfarben in den Puffer gehen. Eingang: `ozeanEingang` (vom Zyklus),
   *  Modifikator: `wasserTon` (von der Stimmung). Beides zusammen ergibt `ozeanStand`. */
  function ozeanMalen() {
    const soll = [tonDrehen(ozeanEingang[0], wasserTon),
                  tonDrehen(ozeanEingang[1], wasserTon),
                  ozeanEingang[2]];
    const s = toLin(soll[0]), d = toLin(soll[1]);
    const attr = geo.attributes.color, dep = geo.attributes.oceanDepth;
    for (let i = 0; i < attr.count; i++) {
      if (landMask[i]) continue;
      const c = mix(s, d, dep.getX(i));
      attr.setXYZ(i, c[0], c[1], c[2]);
    }
    attr.needsUpdate = true;
    // Das Schaum-Uniform gehört zu denselben Farben — es zu vergessen war der dunkelblaue
    // Zickzack an der Küste (§05o-Nachtrag). Eine Farbe, zwei Verbraucher, ein Ort.
    foamColorValue.set(soll[2]);
    ozeanStand = soll;
  }

  group.add(mesh); group.add(cloudRing); group.add(atmo);

  return {
    name: 'globe', group, mesh, atmosphere: atmo, clouds: cloudRing,
    radius, segments, seed, terrainType,
    /** Wolkenring driftet um eine feste Achse — `Globe.update` in der Quelle. */
    update(dt) {
      cloudRing.rotateOnAxis(cloudDriftAxis, CLOUD_DRIFT_SPEED * dt);
      oceanTime.value += dt;   // treibt Kontourlinien, Schaum und Glitzern
    },
    /** ⚠ **Der Ozean war EINMAL gefärbt, und das ist die zweite Abzweigung.**
     *  Alle drei Presets tragen `oceanShallow/oceanDeep/oceanFoam` — DAY 0x2a8ca0/0x1560a0
     *  (zeichengleich mit tinyskies), NIGHT 0x081838/0x040c20 (fast schwarz). Gelesen wurden sie
     *  genau einmal: beim Bau der Welt, aus dem Preset der STARTZEIT. Eine Welt, die nachts
     *  startet, behielt den Nacht-Ozean den ganzen Tag — gemessen: Wasser-Albedo **0,005**, das
     *  ist Faktor 22 unter tinyskies' 0,111. Ein schwarzer Ozean unter Tageslicht ist der halbe
     *  „grau-bläulich"-Befund, und der Tag/Nacht-Zyklus hat die drei Schlüssel nie angefasst:
     *  sie standen nicht in seiner `COL`-Liste.
     *  **Die Quelle macht es anders, und sie sagt auch warum** (`Globe.ts`, Feldkommentar):
     *  `vertexOceanDepth` — *„Per vertex: ocean mix 0–1, or -1 for land (for day/night ocean
     *  recolor without re-sampling noise)"*. Genau dafür liegt die Tiefe auch bei uns als Attribut
     *  vor. Sie wird jetzt benutzt: Umfärben ohne Rauschen neu zu würfeln, nur Wasser-Vertices.
     *  Kosten: ein Durchlauf über die Wasser-Vertices, aufgerufen nur wenn sich die Farbe
     *  MESSBAR bewegt hat (Schwelle im Zyklus) — nicht je Bild. */
    setOceanColors(shallow, deep, foamHex) {
      ozeanEingang = [shallow, deep, foamHex];
      ozeanMalen();
    },
    /** Der Farbton, den die STIMMUNG dem Wasser gibt — `null` heißt „wie das Preset".
     *  Sie schreibt damit nicht selbst; sie sagt nur, wie der eine Schreiber zu drehen hat.
     *  Die Gischt ist ausgenommen: Licht auf Wasser, kein Material (Georg, 30.8.). */
    setWasserTon(grad) { wasserTon = grad == null ? null : grad; ozeanMalen(); },
    get wasserTon() { return wasserTon; },
    /** Was gemalt sein MUSS: Preset-Eingang plus Stimmungsdrehung. Die Abnahme vergleicht gegen
     *  diesen Wert, nicht gegen das rohe Preset — sonst prüft sie bei aktiver Stimmung nichts.
     *  ⚠ Genau das war der Fall: `Ocean follows preset` meldete ✓ mit UND ohne Stimmung und war in
     *  beide Richtungen blind. Eine Abnahme muss den Soll-Wert kennen, nicht einen Nachbarwert. */
    ozeanSoll() {
      return [tonDrehen(ozeanEingang[0], wasserTon),
              tonDrehen(ozeanEingang[1], wasserTon),
              ozeanEingang[2]];
    },
    /** Womit das Wasser zuletzt gefärbt wurde — die Zahl, die auffliegen lässt, wenn der Zyklus
     *  den Ozean wieder vergisst. Ohne sie wäre „folgt dem Preset" eine Behauptung. */
    get ozeanStand() { return ozeanStand; },
    /** ⚠ **Regel 6 aus `use-what-works`: eine Kopie ist bewiesen, wenn die Ausgabe der Quelle
     *  wieder erscheint.** `createSurface` loggt nichts — also gibt diese Probe ihre Zahlen aus
     *  und vergleicht sie mit dem, was im Shader WIRKLICH steht (nicht mit unserer Notiz darüber).
     *  Zwei Runden lang stand über dem Fragment-Block der Satz „jede Formelzeile steht wörtlich so
     *  in der Quelle", und er war an vier Stellen falsch. Ein Kommentar kann lügen, ein Uniform
     *  nicht. */
    /** ⚠ **Die deklarierte Abweichung.** Georgs Vorgabe vom 30.8.: die Quelle ist führend, und wenn
     *  unsere Arbeit mit ihr kollidiert, will er eine WARNUNG sehen — nicht eine stille Anpassung.
     *  Das geht nur mit einem Instrument: diese Probe vergleicht jede der neun Landfarben mit ihrem
     *  Original und sagt, WAS abweicht. Erlaubt ist genau der Farbton (unsere Entscheidung);
     *  Sättigung und Helligkeit müssen die der Quelle bleiben, sonst kommt das Grau zurück. */
    palettenProbe() {
      const hsl = (hex) => { const c = new THREE.Color(hex), o = {}; c.getHSL(o); return o; };
      const paare = [];
      TS_HEX.land.forEach((k, i) => paare.push(['land[' + i + ']', TS_QUELLE.land[i], k]));
      TS_HEX.warm.forEach((k, i) => paare.push(['warm[' + i + ']', TS_QUELLE.warm[i], k]));
      // Die zwölf Zonen-Fleckenfarben gehören in denselben Wächter: sie dürfen im Farbton
      // abweichen (das ist der Zweck), aber nicht in Sättigung und Helligkeit — sonst kommt das
      // Grau über den Umweg der Zonen zurück, und niemand würde es an der Zone suchen.
      BIOM_WARM_HEX.forEach((d, b) => d.forEach((k, i) =>
        paare.push(['biome[' + b + '].warm[' + i + ']', TS_QUELLE.warm[i], k])));
      paare.push(['mountain', TS_QUELLE.mountain, TS_HEX.mountain]);
      paare.push(['snow', TS_QUELLE.snow, TS_HEX.snow]);
      let maxDS = 0, maxDL = 0, maxDH = 0, schlimmste = null;
      for (const [n, q, k] of paare) {
        const a = hsl(q), b = hsl(k);
        const dS = Math.abs(a.s - b.s), dL = Math.abs(a.l - b.l);
        let dH = Math.abs(a.h - b.h); if (dH > 0.5) dH = 1 - dH;
        if (dS > maxDS || dL > maxDL) schlimmste = n;
        maxDS = Math.max(maxDS, dS); maxDL = Math.max(maxDL, dL); maxDH = Math.max(maxDH, dH);
      }
      const ok = maxDS <= 0.01 && maxDL <= 0.01;
      return { slots: paare.length, ok,
        hueGrad: +(maxDH * 360).toFixed(1), dS: +maxDS.toFixed(3), dL: +maxDL.toFixed(3),
        schlimmste: ok ? null : schlimmste };
    },
    /** ⚠ **Die Abnahme für das Wasser-Tor.** Zwei Zahlen, beide durchfallbar:
     *  1. Die Invariante, auf der das neue Tor beruht: JEDER Land-Vertex muss `oceanDepth == 0`
     *     tragen, jeder Wasser-Vertex `> 0`. Bricht die, malt der Shader Wasser auf Land oder
     *     umgekehrt — und zwar still.
     *  2. Wie viele Land-Vertices die alte FARBHEURISTIK der Quelle bestehen würden. Das ist die
     *     Zahl, die die Abweichung begründet: bei `verdant` ist sie 0, bei `frost` nicht. Sie
     *     steht hier, damit „wir weichen ab" eine Messung ist und keine Behauptung. */
    wasserTorProbe() {
      const attr = geo.attributes.color, dep = geo.attributes.oceanDepth;
      const flag = geo.attributes.landFlag;
      let bruch = 0, landTrifftFarbtor = 0, landZahl = 0, flagBruch = 0;
      // Die dritte durchfallbare Zahl: Wasser DARF NICHT über der Kugeloberfläche liegen. Das ist
      // die Invariante, die `zoneBlend` gebrochen hat — und sie war nirgends geprüft, weil niemand
      // auf die Idee kam, dass eine Planierung das Meer anhebt.
      const px = geo.attributes.position;
      let hochWasser = 0, hoechstesWasser = 0;
      for (let i = 0; i < attr.count; i++) {
        const t = dep.getX(i), istLand = !!landMask[i];
        // Das Bit, auf dem das Tor jetzt beruht, muss mit der Maske übereinstimmen — sonst malt
        // der Shader Wasser auf Land, und zwar still.
        if ((flag.getX(i) > 0.5) !== istLand) flagBruch++;
        if (!istLand) {
          const h = Math.sqrt(px.getX(i) ** 2 + px.getY(i) ** 2 + px.getZ(i) ** 2) - radius;
          if (h > 0) { hochWasser++; if (h > hoechstesWasser) hoechstesWasser = h; }
        }
        if (istLand) {
          landZahl++;
          if (t !== 0) bruch++;
          if (attr.getZ(i) > attr.getX(i) + attr.getY(i) * 0.5) landTrifftFarbtor++;
        } else if (!(t > 0)) bruch++;
      }
      return { invarianteOk: bruch === 0 && flagBruch === 0 && hochWasser === 0,
               bruch, flagBruch, hochWasser, hoechstesWasser: +hoechstesWasser.toFixed(4),
               landTrifftFarbtor,
               anteil: landZahl ? +(landTrifftFarbtor / landZahl * 100).toFixed(1) : 0 };
    },
    /** ⚠ **Die Zahl zu Georgs Küstenbefund (1.9.), gezählt statt gedeutet.** Sie sagt, wie groß das
     *  Küstenband überhaupt ist — also wie viel Fläche ein binäres Tor auf `vLand` betrifft. Und sie
     *  liest im Shaderquelltext nach, dass die drei Flächen-Terme das Gewicht `wW` tragen und die
     *  Küsten-Kontour es NICHT trägt: eine Behauptung im Kommentar ist genau das, was hier schon
     *  zweimal versagt hat (§05q, `quellenProbe`). */
    kuestenTor() {
      const idx = geo.index ? geo.index.array : null;
      const flag = geo.attributes.landFlag;
      const n = idx ? idx.length / 3 : flag.count / 3;
      let gemischt = 0, nurLand = 0, nurWasser = 0;
      for (let t = 0; t < n; t++) {
        const a = idx ? idx[t * 3] : t * 3, b = idx ? idx[t * 3 + 1] : t * 3 + 1,
              c = idx ? idx[t * 3 + 2] : t * 3 + 2;
        const s = (flag.getX(a) > 0.5 ? 1 : 0) + (flag.getX(b) > 0.5 ? 1 : 0) + (flag.getX(c) > 0.5 ? 1 : 0);
        if (s === 3) nurLand++; else if (s === 0) nurWasser++; else gemischt++;
      }
      const f = SURFACE_FRAGMENT_BODY;
      const hatGewicht = f.includes('float wW = smoothstep(0.5, 0.0, vLand);');
      const lift = f.includes('vec3(0.04, 0.06, 0.10) * wW');
      const schaum = f.includes('mix(0.05, 1.0, shallowness) * wW');
      const glitzer = f.includes('sparkleGain * wW');
      // Die Kontour darf das Gewicht NICHT tragen — sie gehört an die Grenze, nicht an die Fläche.
      const kontourFrei = f.includes('mix(gl_FragColor.rgb, foamColor, line * depthFade * 0.9)');
      const ok = hatGewicht && lift && schaum && glitzer && kontourFrei;
      return {
        idle: false, ok, dreiecke: n, gemischt, nurLand, nurWasser,
        anteilProzent: +(gemischt / n * 100).toFixed(2),
        gewichtet: { lift, schaum, glitzer }, kontourFrei,
        text: (ok ? '✓' : '✗') + ' coastal band ' + gemischt + ' of ' + n + ' triangles ('
          + (gemischt / n * 100).toFixed(2) + ' % of the globe) carry land AND water corners'
          + ' · water paint weighted to zero at the gate: '
          + (lift ? 'lift ✓' : 'lift ✗') + ' ' + (schaum ? 'foam ✓' : 'foam ✗') + ' '
          + (glitzer ? 'sparkle ✓' : 'sparkle ✗')
          + ' · shore contour deliberately unweighted ' + (kontourFrei ? '✓' : '✗')
          + (ok ? '' : ' — ⚠ a binary gate on an interpolated flag cuts THROUGH the triangle'),
      };
    },
    /** ⚠ **Georgs Wasserbefund (1.9.) als ZAHL.** Drei Werte in einer Zeile: was die Kurve jetzt
     *  liefert, was die Farbheuristik der Quelle in UNSEREM linearen Puffer geliefert hätte (0),
     *  und was daraus für Schaum und Glitzern folgte. Gelesen wird der Shaderquelltext, nicht
     *  mein Kommentar darüber. */
    glanzTor() {
      const glatt = (t) => { const u = Math.min(1, Math.max(0, t)); return u * u * (3 - 2 * u); };
      const kurve = (d) => Math.min(1, glatt(0.539 - 0.686 * d) * glanzGainU.value);
      const farbe = (r) => glatt((r - 0.1) / 0.12);
      const f = SURFACE_FRAGMENT_BODY;
      const ausDaten = f.includes('float sU = clamp(0.539 - 0.686 * vOceanDepth');
      const keineFarbe = !f.includes('smoothstep(0.1, 0.22, vColor.r)');
      // ⚠ Gelesen wird der AKTUELLE Stand des Puffers (`ozeanStand`, vom Tageszeit-Zyklus
      // geschrieben), nicht der Eingangswert beim Bau — sonst prüft das Tor eine Welt von gestern.
      const rFlach = new THREE.Color(ozeanStand[0]).r, rTief = new THREE.Color(ozeanStand[1]).r;
      const ufer = kurve(0), mittel = kurve(0.3), altUfer = farbe(rFlach);
      const ok = ausDaten && keineFarbe && ufer > 0.3;
      return { ok, ufer: +ufer.toFixed(3), mittel: +mittel.toFixed(3), altUfer: +altUfer.toFixed(3),
        rFlachLinear: +rFlach.toFixed(4), rTiefLinear: +rTief.toFixed(4),
        text: (ok ? '✓' : '✗') + ' shallowness from DEPTH: ' + ufer.toFixed(2) + ' at the shore, '
          + mittel.toFixed(2) + ' at depth 0.3, 0 beyond 0.79 (gain ' + glanzGainU.value.toFixed(2) + ')'
          + ' · the source’s colour heuristic would give ' + altUfer.toFixed(2)
          + ' here — our buffer is LINEAR (r ' + rFlach.toFixed(3) + ' shallow / '
          + rTief.toFixed(3) + ' deep, both under its 0.10 threshold), so open foam ran at '
          + '5 % gain and the sparkle threshold at 0.70: Georg’s „coarser than the original“'
          + (ausDaten ? '' : ' — ⚠ shader still reads the colour') };
    },
    quellenProbe() {
      const u = mat.userData.shader && mat.userData.shader.uniforms;
      const f = SURFACE_FRAGMENT_BODY;
      const pruef = [
        ['rimIntensity', u ? u.rimIntensity.value : null, QUELLE.rimIntensity],
        ['rimPower', u ? u.rimPower.value : null, QUELLE.rimPower],
        ['shininess', mat.shininess, QUELLE.shininess],
        // Die drei Zeilen, die in unserer Fassung gefehlt hatten oder nachgerechnet waren —
        // geprüft am Quelltext des Shaders, nicht an einer Behauptung.
        ['water base lift', f.includes('vec3(0.04, 0.06, 0.10)') ? 1 : 0, 1],
        // ⚠ Erwartung UMGESTELLT, weil die Abweichung gewollt ist: das Außentor ist jetzt das
        // Daten-Tor (`vOceanDepth > 0.0`), nicht die Farbheuristik der Quelle. Eine Abnahme, die
        // eine bewusste Abweichung als Fehler meldet, erzieht dazu, sie zu überlesen — und eine,
        // die sie gar nicht erwähnt, versteckt sie. Deshalb steht sie hier als eigene Zeile,
        // mit dem Grund im Namen.
        // ⚠ **Der NAME war falsch, während die Prüfung stimmte** — und das ist die gefährlichere
        // Hälfte. Hier stand „water gate = depth", nachdem das Tor längst auf dem Land-Bit lief:
        // mein globales Ersetzen von `if (vOceanDepth > 0.0) {` traf auch DIESEN Prüfstring, und
        // die spätere Umbenennung fand ihr Muster deshalb nicht mehr — literales Ersetzen ohne
        // Treffer meldet nichts (dieselbe stille Klasse wie beim `mischGrad`-Arrow, §05u).
        // Ergebnis: ein Instrument, das seinen eigenen Gegenstand falsch benennt. Wer danach
        // `vOceanDepth > 0.0` im Shader sucht, findet es nicht — und dieses Projekt hat als Regel,
        // dass Instrumente nicht lügen.
        ['water gate = land bit (ours, not source colour heuristic)',
          f.includes('if (vLand < 0.5) {') && !f.includes('vColor.b > vColor.r') ? 1 : 0, 1],
        ['sparkle 2nd term', f.includes('sp2 * sp3 * sp5 * 0.5') ? 1 : 0, 1],
        ['sparkle mask step', f.includes('smoothstep(0.15, 0.5, sparkleMask)') ? 1 : 0, 1],
        ['sparkle thresh .97', f.includes('sparkleThresh, 0.97') ? 1 : 0, 1],
      ];
      const zeilen = pruef.map(([n, ist, soll]) =>
        (ist === soll ? '✓ ' : '✗ ') + n + ' ' + ist + (ist === soll ? '' : ' ≠ ' + soll));
      const fehler = pruef.filter(([, ist, soll]) => ist !== soll).length;
      return { quelle: QUELLE.datei, fehler, zeilen };
    },
    setAtmosphereGlow(color) { glowBase.set(color); atmoWrite(); },
    /**
     * Blende der Atmosphäre nach KAMERADISTANZ. Gemessen 29.8.: die Hülle hat Radius 1,55·R
     * (= 7,75), die Startansicht beginnt bei 2,75·R (= 13,75) — von dort additiv gemalt ist sie
     * keine Silhouette, sondern eine flächige Wäsche über dem ganzen Bild. Von INNEN ist sie
     * quellentreu und im Tiefflug ohnehin unsichtbar; also fährt sie beim Eintauchen weich auf.
     * Ein Schalter wäre ein Knall an der Grenze, deshalb ein Band von 1,50 bis 1,62·R.
     */
    setAtmosphereByCamera(camLen) {
      const a = radius * 1.50, b = radius * 1.62;
      const t = camLen <= a ? 1 : camLen >= b ? 0 : 1 - (camLen - a) / (b - a);
      const k = t * t * (3 - 2 * t);
      if (Math.abs(k - atmoFade) < 0.002) return atmoFade;
      atmoFade = k;
      atmo.visible = k > 0.004;
      atmoWrite();
      return k;
    },
    get atmosphereFade() { return atmoFade; },
    setCloudOpacity(v) { cloudOpacityUniform.value = v; },
    /** Die Zonen-Fleckenfarben und ihre Farbtöne — damit die Panel-Zeile ihre Zahlen von DORT holt,
     *  wo die Werte liegen, und nicht von einer Variable, die zufällig im Runner herumsteht.
     *  ⚠ Meine erste Fassung dieser Zeile fragte `biom` im Runner ab und warf
     *  `biom is not defined` — eine Anzeige, die eine Ausnahme in ihr eigenes Textfeld schreibt.
     *  Aufgefallen ist es beim LESEN DER ZEILE im laufenden Bild, nicht beim Schreiben: dieselbe
     *  Lehre wie beim Schatten (§05s), am selben Tag zum zweiten Mal. */
    /** ── Slice H · Eine Stimmung anlegen ──────────────────────────────────────────────────────
     *  Umfärben, nicht neu bauen: Höhe und Fleckenwert liegen je Vertex gespeichert (siehe oben),
     *  also ist das ein Durchlauf über die Landvertices mit derselben Funktion, die der Bäcker
     *  benutzt. Wasser und Gischt bleiben unberührt — die haben ihren eigenen Eigentümer
     *  (`setOceanColors`, getrieben vom Tag/Nacht-Zyklus), und zwei Schreiber auf einer
     *  Eigenschaft ist die Klasse, die dieses Projekt am häufigsten bezahlt hat. */
    setStimmung(st) {
      stimmungJetzt = st || null;
      PAL_JETZT = paletteBauen(stimmungJetzt);
      const attr = geo.attributes.color;
      const x = geo.attributes.position;
      for (let i = 0; i < attr.count; i++) {
        if (!landMask[i]) continue;
        const px = x.getX(i), py = x.getY(i), pz = x.getZ(i);
        const len = Math.sqrt(px * px + py * py + pz * pz) || 1;
        const c = landFarbe(PAL_JETZT, elevs[i], patchVals[i], px / len, py / len, pz / len);
        attr.setXYZ(i, c[0], c[1], c[2]);
      }
      attr.needsUpdate = true;
    },
    get stimmung() { return stimmungJetzt ? stimmungJetzt.id : null; },
    /** Der Farbton, den eine Stimmung dem Wasser gibt — der Zyklus mischt ihn in seine
     *  Ozeanfarben ein, damit Tageszeit UND Stimmung beide gelten. Gischt ist ausgenommen. */
    tonDrehen,
    /** Die Landsättigung als MEDIAN über die Landvertices, ohne Schnee.
     *  Das ist die Zahl, an der das Tor von Slice H hängt: eine Stimmung darf den Farbton drehen,
     *  aber nicht die Sättigung verlieren. Schnee ist ausgenommen, weil er per Konstruktion
     *  entsättigt ist (§05o-Nachtrag) und den Median sonst nach unten zieht. */
    landSaettigung() {
      const attr = geo.attributes.color, w = [];
      const c = new THREE.Color(), o = {};
      for (let i = 0; i < attr.count; i += 7) {
        if (!landMask[i] || snowMask[i]) continue;
        c.setRGB(attr.getX(i), attr.getY(i), attr.getZ(i));
        c.getHSL(o, THREE.SRGBColorSpace);
        w.push(o.s);
      }
      if (!w.length) return null;
      w.sort((a, b) => a - b);
      return +w[w.length >> 1].toFixed(3);
    },
    get zonenFarben() {
      return { zonen: BIOM_WARM_HEX.length,
               hues: BIOM_WARM_HEX.map((d) => {
                 const c = new THREE.Color(d[0]), o = {}; c.getHSL(o);
                 return Math.round(o.h * 360);
               }) };
    },
    get sparkleGain() { return sparkleGainU.value; },
    setSparkleGain(v) { sparkleGainU.value = v; },
    get glanzGain() { return glanzGainU.value; },
    setGlanzGain(v) { glanzGainU.value = Math.max(0, Math.min(2, v)); },
    dispose() {
      geo.dispose(); mat.dispose();
      atmoGeo.dispose(); atmoMat.dispose(); cloudMat.dispose();
      cloudRing.traverse((c) => { if (c.geometry) c.geometry.dispose(); });
    },
    report() {
      return { typ: terrainType, seed, radius, segmente: segments,
               vertices: pos.count, landAnteil: +(land / pos.count).toFixed(2),
               hoechsterGipfel: +peak.toFixed(3), bergHoehe: MOUNTAIN_HEIGHT,
               wolken: CLOUD_COUNT, atmoRadius: +(radius * 1.55).toFixed(2) };
    },
  };
}
