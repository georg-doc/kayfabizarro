/* gutter.v5.js — KFB BOXEL BLITZ v2 · FORK VON `boxelball-v1/gutter.v4.js` (V2-S1).

   EINE Änderung, benannt: DIE FLÄCHE BEKOMMT IHRE GRÖSSE VOM FUSSABDRUCK DES BILDES AUF IHR,
   nicht aus einem festen Faktor auf die Bildgröße in der Tiefe der KARTE.

   Georgs Befund (05.09.): »Gutter-Shader bündig bei Kippung«. Gemessen bei 817×625, an den
   projizierten Ecken der Fläche: bei 25° fehlten oben **4** Bildpunkte, bei 30° **29**, bei 40°
   **82**, bei 52° **148**. Unten, links und rechts null — es ist genau die Kante, die beim
   Zurücklehnen wegrückt. Und die Lücke ist SCHWARZ: in diesem Kanal wird der Aquarell-Quad nicht
   einmal gebaut (`build()` läuft nur bei `channel === 'shader'`), es gibt also nichts dahinter.

   URSACHE: die alte Regel las `pxPerUnit` — das Bild, gemessen auf einer Ebene SENKRECHT zum
   Blick, in der Tiefe der KARTENMITTE — und multiplizierte 1,45 darauf. Diese Fläche liegt aber
   1,2 Einheiten hinter dem Blatt UND ist mitgekippt: ihre obere Kante rückt weg, und was weiter
   weg ist, deckt weniger Bildpunkte. Der Faktor 1,45 ist eine Konstante, der Bedarf wächst mit
   der Kippung (gemessen 9,8 Einheiten Höhe bei 3°, 20,8 bei 52°) — eine Konstante kann das nicht
   einholen.

   VORBILD (Schritt 0, gefunden vor dem Bauen): `podcast-v2/flipper.v2.js` `frameAt(z)` löst
   dieselbe Aufgabe für die Pets und benennt denselben Fehler wörtlich — »v1 rechnete
   tan(fov/2)·d, was nur bei waagerechtem Blick durch die Mitte stimmt«. Vier Strahlen durch die
   NDC-Ecken, Schnitt mit der gesuchten Ebene. Dieses Modul tut es mit der Ebene der Fläche.

   ZWEITE HÄLFTE DERSELBEN ÄNDERUNG: weil das Rechteck jetzt VERSETZT liegt (bei 30° 1,7
   Einheiten über der Karte, weil oben mehr Bedarf ist als unten), ist »Koordinate der Karte«
   nicht mehr »Koordinate der Fläche«. Der Shader vergleicht `uRip.xy` mit `position.xy` der
   Fläche, also rechnet `ripple()` die Verschiebung heraus — an EINER Stelle. Ohne das schlüge
   jede Welle um genau diesen Betrag daneben auf.

   ABNAHMEZAHL: `stats().deckung` / `api.deckung()` — die vier Lücken in Bildpunkten, gelesen an
   den PROJIZIERTEN Ecken. Sie kann durchfallen: vor der Änderung stand dort bei 30° `oben 29`.
   Dazu `stats().neubauten`: wie oft die Geometrie neu gebaut wurde (eine Größe, die jedes Bild
   um einen Bruchteil zappelt, wäre eine Kostenfalle; darum ist der Bedarf auf 0,1 gerastert).

   RÜCKWEG: eine Zeile im DC zurück auf `boxelball-v1/gutter.v4.js`. Ohne vier Eckentreffer fällt
   dieses Modul selbst auf die alte Regel zurück.
   Alles andere ist unverändert — Kopf und Begründungen der v4 stehen darunter.
   ------------------------------------------------------------------------------------------

   gutter.v4.js — KFB Pet Podcast v4 · EIN EIGENTÜMER DES HINTERGRUNDS.

   Der Raum um die Karte ist im Comic der GUTTER — der Zwischenraum zwischen den Panels. Bis v3 war
   er ein Foto: ein Aquarell-Skydome aus dem Repo. Das hat drei Nachteile, alle messbar:
     · es lädt (eine Datei über den Spiegel, im Boot-Budget),
     · es ist nicht steuerbar (kein Bezug zur Palette der Karte, kein Zustand),
     · es ist EIN Bild — jede Sendung sieht gleich aus.

   Ab v4 gehört der Gutter diesem Modul, mit drei Kanälen:

     shader      Default. Aquarell, prozedural: Papierton, drei weiche Farbwaschungen mit
                 PIGMENTKANTE, Papierfaser, leichte Randabdunklung. Lädt nichts.
     watercolor  das bisherige Foto (Skydome) — Rückweg, unverändert.
     media       ein übergebenes Bild/Video als Hintergrund (Slice später; die Naht steht).

   WARUM EIN VOLLBILD-QUAD UND KEIN `scene.background`
   `scene.background` nimmt nur Texturen, keinen Shader. Der Quad hängt als Kind der KAMERA (er
   füllt damit immer das Bild, unabhängig von Seitenverhältnis und Bildwinkel), schreibt keine Tiefe
   und rendert zuerst. Er ist kein Objekt in der Szene: er fängt kein Licht, wirft nichts, misst
   nicht mit.

   PRIME DIRECTIVE: der Gutter BEWEGT SICH NICHT. Kein Zeit-Uniform, keine driftenden Washes. Ein
   Aquarell ist gemalt, nicht animiert; eine Bewegung ohne Anlass wäre genau das Idle-Fidget, das die
   Marke verbietet. Der Seed ändert sich nur, wenn die Sendung ihn ändert (z. B. neue Karte).

   MESSEN: `stats().drawMs` ist die Zeichenzeit des Quads, gemessen mit `gl.finish()` — ohne das
   misst man nur, wie schnell der Treiber Befehle ANNIMMT, nicht wie lange er rechnet. */

const PALETTES = {
  /* Aus dem KFB-Kit. Jede Palette: Papierton + drei Waschungen. Die Reihenfolge ist die
     Malreihenfolge — hell nach dunkel, wie beim echten Aquarell. */
  kfb:   { paper: '#f3ead3', a: '#e9c14a', b: '#7fb0b8', c: '#d98f6a', ink: '#b8361f' },
  cool:  { paper: '#eef0ea', a: '#8fa3ad', b: '#b9c6bd', c: '#c2ad79', ink: '#1f1a14' },
  warm:  { paper: '#f7f0dd', a: '#d3a244', b: '#c98b6b', c: '#a8b6a0', ink: '#8a6a16' },
  med:   { paper: '#f2f4f1', a: '#7fb0b8', b: '#cfd8d2', c: '#e0b7a0', ink: '#2f7a72' },
};

const MAXRIP = 8;
/* Die Kartenbreite des Originals (sbp-v3.js Z. 38: `const W = 17.4`). Alle Wellenkonstanten sind
   darauf geeicht — siehe `uScale` im Vertex-Shader. */
const ORIG_CARD_W = 17.4;

/* ---- KANAL `fluid` — portiert aus SpinBallPop v3 (`spinballpop/sbp-v3.js`, Z. 855 ff.) ---------

   WARUM DIESER UND NICHT MEIN AQUARELL-QUAD: das sind zwei GATTUNGEN. Mein Quad ist eine Leinwand —
   flach, und die Farbe jedes Bildpunkts wird gerechnet. Er kann etwas ZEIGEN, aber nichts SEIN.
   Das hier ist eine Fläche: ein Gitter, dessen Punkte sich heben und senken. Die Farbe entsteht aus
   der HÖHE, und ein Ereignis kann eine Welle hineinwerfen, die ausläuft. Das ist der Unterschied
   zwischen „sieht aus wie Wasser" und „ist eine Oberfläche, die antwortet".

   PERFORMANCE, gegen die Intuition: eine Grafikkarte hat zwei Kostenstellen. Punkte bewegen ist
   billig, Bildpunkte einfärben ist teuer. Mein Aquarell macht das Teure (drei Rausch-Felder je
   Bildpunkt, gemessen 0,315 ms), das hier macht das Billige (rund 10.000 Gitterpunkte) und pro
   Bildpunkt fast nichts. Die Fläche ist also eher SCHNELLER.

   DAS MENTALE MODELL (Georg, 04:00) — und der Grund für die Aufhängung:
   In BEIDEN Ansichten sind die Nachbarkarten mit ihren Tuschekanten Nachbarn, getrennt durch einen
   gemeinsamen, überspringbaren GUTTER — den wabernden Raum, in dem beim Leser die Bedeutung
   entsteht (closure). Der Gutter ist also kein Hintergrund, sondern der Zwischenraum des Rasters.
   Deshalb hängt diese Fläche als Kind der KARTENGRUPPE: aufrecht ist sie der Zwischenraum hinter
   und neben den Blättern, gekippt ist sie das Spielfeld. EINE Fläche, zwei Ansichten — dieselbe
   Regel wie bei Kamera und Sitzen, und kein zweites Ding, das man synchron halten muss.

   Übernommen 1:1: Grundschwell (drei Sinus, 0,10 / 0,085 / 0,06), Ripple-Kern
   (sin(9d − age·7) · exp(−1,1d − 1,4·age), Lebensdauer 3,2 s, acht Plätze im Ringpuffer),
   Höhen-Farbrampe und die Höhenlinien.
   Geändert, und zwar benannt: die Farben kommen aus der PALETTE statt fest aus Blau (Georgs
   „farbig codiert"), und die Duo-Tone-Punkte liegen als eigene Schicht darauf — sie reiten auf der
   Welle (`vH` verzieht das Raster), was die Verformung sichtbar macht. */
const FLUID_VERT = `
uniform float uTime; uniform float uCalm; uniform float uScale; uniform float uSpeed;
uniform vec4 uRip[${MAXRIP}];
varying float vH; varying vec2 vP;
void main() {
  vec3 p = position;
  /* DAS FELD RECHNET IM WELTMASS DES ORIGINALS, nicht in meinem.
     Alle Konstanten unten (0,65 / 0,85 / 0,42 / 9d / 1,1d / 1,4age) sind auf SpinBalls Spielfeld
     geeicht: dort ist die Karte "W = 17.4" Einheiten breit. Meine Karte ist 5,7 — Faktor 3,04.
     Rechnet man die Sinus direkt auf meine Koordinaten, ist die Wellenlaenge 9,7 Einheiten und die
     ganze Flaeche zeigt knapp EINE Periode: die riesigen weichen Baender aus Georgs Bild.
     "uScale" bringt die Koordinaten ins Originalmass — damit sehen die Wellen IM VERHAELTNIS ZUR
     KARTE genauso aus wie im Original, bei jeder Kartengroesse und jedem Fenster.
     Der Hoehenausschlag geht denselben Weg zurueck ("/ uScale"), sonst waere die Welle dreimal so
     hoch wie im Original. */
  vec2 q = p.xy * uScale; vP = q;
  /* uSpeed wirkt NUR auf die Grundschwelle. Die Ripple-Alterung unten laeuft in echter Zeit —
     ein Aufprall soll nicht in Zeitlupe abklingen, nur weil das Wasser ruhiger atmet.
     Das Original hat 1,0 (Spielfeld-Tempo); 0,32 ist das Sendungs-Tempo: eine Grundperiode dauert
     damit rund 16 s statt 5. */
  float ts = uTime * uSpeed;
  float h = (sin(q.x * 0.65 + ts * 1.25) * 0.10
           + sin(q.y * 0.85 - ts * 1.60) * 0.085
           + sin((q.x + q.y) * 0.42 + ts * 0.80) * 0.06) * uCalm;
  for (int i = 0; i < ${MAXRIP}; i++) {
    float age = uTime - uRip[i].z;
    if (age > 0.0 && age < 3.2) {
      float d = distance(q, uRip[i].xy * uScale);
      h += uRip[i].w * 0.24 * sin(9.0 * d - age * 7.0) * exp(-1.1 * d - 1.4 * age);
    }
  }
  vH = h; p.z += h / uScale;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const FLUID_FRAG = `
precision highp float;
uniform float uDark; uniform float uDuo; uniform float uDot; uniform vec3 uInk;
uniform vec3 uDeep; uniform vec3 uLight; uniform vec3 uLine;
varying float vH; varying vec2 vP;
void main() {
  /* ORIGINAL, unveraendert (sbp-v3.js Z. 865-871). Die Farben kommen als Uniform, damit die Palette
     sie faerben KANN — die Defaults sind die Originalwerte, also ist "nichts einstellen" = Original. */
  float k = clamp(vH * 3.2 + 0.5, 0.0, 1.0);
  vec3 col = mix(uDeep, uLight, k);
  float line = smoothstep(0.66, 0.72, sin(vP.x * 1.1 + vP.y * 1.7 + vH * 22.0) * 0.5 + 0.5);
  col = mix(col, uLine, line * 0.16);

  /* DUO-TONE-RASTER — die einzige Zutat, die im Original nicht vorkommt (Georgs Wunsch). Sie steht
     ganz am Ende: uDuo 0 = exakt das Original.

     ECHTER HALBTON, nicht sin*sin. Die erste Fassung war "0.5 + 0.5 * sin(x) * sin(y)" mit hartem
     Schnitt — daraus werden Punkte, die ueberall GLEICH GROSS sind, und das liest als Tapete
     (Georgs Befund 05:08 "zu repetitiv / gleichfoermig"). Eine Druckerei macht es andersherum:
     das Raster ist starr, die PUNKTGROESSE traegt den Tonwert. Dunkel = dicker Punkt.
       cell   Koordinate in Rasterzellen (Periode 2pi/uDot)
       d      Abstand vom Zellenmittelpunkt
       r      Radius aus dem Tonwert. Wurzel, weil die FLAECHE proportional zum Tonwert sein soll
              (Flaeche ~ r^2) — sonst saufen die Mitteltoene ab.
     Dazu zwei Unregelmaessigkeiten, beide aus dem Druck begruendet und beide billig:
       Registerfehler  die Platte sitzt nie exakt; eine langsame Welle verzieht das Raster.
       Wellenritt      vH verschiebt es zusaetzlich — die Punkte reiten auf der Oberflaeche. */
  float ca = cos(0.262), sa = sin(0.262);
  vec2 hp = vec2(vP.x * ca - vP.y * sa, vP.x * sa + vP.y * ca);
  hp += vec2(sin(hp.y * 0.31 + 1.7), sin(hp.x * 0.27)) * 0.5 + vH * 1.1;
  vec2 cell = fract(hp * uDot * 0.15915494) - 0.5;   // 1/(2pi)
  float tone = smoothstep(0.88, 0.12, k);
  float r = sqrt(tone) * 0.66;
  float dots = smoothstep(r, r - 0.11, length(cell));
  col = mix(col, uInk, dots * uDuo);

  col = mix(col, vec3(0.07, 0.08, 0.10), uDark * 0.72);
  gl_FragColor = vec4(col, 1.0);
}`;

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  /* Der Quad hängt an der Kamera und soll IMMER das Bild füllen: Position direkt im
     Clip-Raum setzen, nicht durch die Projektion schicken. z = 1 ist die hinterste Ebene. */
  gl_Position = vec4(position.xy * 2.0, 1.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2  uAspect;      // Bildseitenverhältnis, damit die Waschungen nicht verzerren
uniform vec3  uPaper;
uniform vec3  uA;
uniform vec3  uB;
uniform vec3  uC;
uniform float uSeed;
uniform float uWash;        // Deckkraft der Waschungen
uniform float uGrain;       // Papierfaser
uniform float uVignette;
uniform float uTime;        // Sekunden. NUR fuer den Fluss — sonst ist dieser Shader zeitlos.
uniform float uFlow;        // 0 = eingefroren (Rueckweg), 1 = feuchtes Papier
uniform vec3  uInk;         // die zweite Farbe der Duo-Tone-Ebene
uniform float uDuo;         // 0 = nur Aquarell, 1 = Comic-Flaechen voll drauf
uniform float uCut;         // Schwelle des harten Schnitts
uniform float uBleed;       // Breite des Auslaufs an der Schnittkante
uniform float uRag;         // wie fransig die Pigmentkante ist
uniform float uDot;         // Rasterweite der Halbton-Punkte

/* 3D-RAUSCHEN, ZEIT ALS DRITTE ACHSE — der eigentliche Eingriff.
   Vorher: 2D-Rauschen, das VERSCHOBEN wurde. Eine verschobene Form wandert durchs Bild und bleibt
   dabei sich selbst — das liest als Tapete, die vorbeizieht, und genau daran faellt der Betrug auf
   (Georg: "die Formen verlaufen und morphen halt nicht plausibel").
   Wasser tut etwas anderes: eine Pfuetze wandert nicht, sie WAECHST, verbindet sich mit der
   Nachbarpfuetze und reisst woanders ab. Das ist eine Schnittebene durch ein 3D-Feld, die
   langsam wandert. Kostet doppelt so viele Stuetzstellen je Oktave (8 statt 4) — bei 0,2 ms von
   16,7 ms Budget ist das bezahlbar. */
float hash3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7)) + uSeed) * 43758.5453); }

float noise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash3(i),                    hash3(i + vec3(1.0, 0.0, 0.0)), u.x),
                 mix(hash3(i + vec3(0.0, 1.0, 0.0)), hash3(i + vec3(1.0, 1.0, 0.0)), u.x), u.y),
             mix(mix(hash3(i + vec3(0.0, 0.0, 1.0)), hash3(i + vec3(1.0, 0.0, 1.0)), u.x),
                 mix(hash3(i + vec3(0.0, 1.0, 1.0)), hash3(i + vec3(1.0, 1.0, 1.0)), u.x), u.y), u.z);
}

/* Drei Oktaven. Mehr kostet Zeit und sieht bei einer WASCHUNG nicht anders aus — die Form macht
   die Schwelle, nicht die Feinheit. */
float fbm3(vec3 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * noise3(p); p *= 2.03; a *= 0.5; }
  return v;
}

/* EINE WASCHUNG. Kennzeichen von Aquarell ist nicht der weiche Verlauf, sondern die PIGMENTKANTE:
   wo die Feuchtigkeit stehen blieb, sitzt ein dunklerer Rand — und der ist FRANSIG, nie glatt.
   Deshalb wird die Schwelle selbst mit einem feineren Feld verrauscht (uRag): eine glatte Schwelle
   auf glattem Rauschen ergibt Lavalampe, keine Wasserfarbe.
   ACHTUNG: in diesem String KEINE Backticks. Sie beenden das Template-Literal, JS parst dann den
   Shader als Code, und das ganze Modul-Skript laedt lautlos nicht (zweimal passiert). */
vec4 wash(vec2 p, float scale, float thresh, float soft, float tz) {
  vec3 q = vec3(p * scale, tz);
  float n = fbm3(q);
  float th = thresh + (noise3(q * 3.7 + 11.0) - 0.5) * uRag;
  float body = smoothstep(th - soft, th + soft, n);
  float edge = smoothstep(th - soft * 0.35, th, n) * (1.0 - smoothstep(th, th + soft * 0.35, n));
  /* .x traegt den ROHWERT. Damit schneidet die Duo-Tone-Ebene denselben Verlauf hart, ohne ein
     zweites Rauschen: EINE Form, zwei Lesarten — weiche Waschung und harte Flaeche morphen
     dadurch zwangslaeufig synchron, und es kostet null. */
  return vec4(n, 0.0, 0.0, body + edge * 0.55);
}

void main() {
  vec2 p = (vUv - 0.5) * uAspect + 0.5;
  vec3 col = uPaper;

  /* DER FLUSS. Die Schnittebene durch das 3D-Feld wandert — dadurch WACHSEN und verschmelzen die
     Formen, statt vorbeizuziehen. Dazu ein Domain-Warp, ebenfalls zeitabhaengig: er verzieht den
     Raum, in dem gesucht wird, und nimmt der Bewegung die erkennbare Periode.
     Drei Waschungen, drei Zeitgeschwindigkeiten (0,035 / 0,028 / 0,022) — eine Form braucht damit
     rund 30 s, um sich sichtbar umzubauen. Kein Wandern mehr: der Versatz ist raus. */
  float t = uTime * uFlow;
  vec2 warp = vec2(fbm3(vec3(p * 1.7, t * 0.045)),
                   fbm3(vec3(p * 1.7 + 5.2, t * 0.037))) - 0.5;
  p += warp * 0.24 * uFlow;

  vec4 w1 = wash(p, 2.6, 0.52, 0.16,         t * 0.035);
  vec4 w2 = wash(p, 3.9, 0.55, 0.13, 11.3 +  t * 0.028);
  vec4 w3 = wash(p, 5.7, 0.58, 0.11, 23.7 +  t * 0.022);

  col = mix(col, uA, w1.a * uWash);
  col = mix(col, uB, w2.a * uWash * 0.85);
  col = mix(col, uC, w3.a * uWash * 0.62);

  /* ---- DUO-TONE-EBENE (Comic) ------------------------------------------------------------
     Die Aquarell-Ebene kann alles ausser einer KANTE. Comic ist das Gegenteil: Flaechen mit hartem
     Schnitt. Beides zusammen ist die KFB-Sprache — nasses Papier UND Druckplatte.
     Vier Bestandteile, alle aus den schon gerechneten Feldern (also ohne zusaetzliches Rauschen):
       cutA   die Hauptflaeche, 'step' = razor edge, bewusst ohne Weichzeichnung
       cutB   eine zweite, engere Flaeche als SCHATTEN — im Comic ist der eine eigene Platte
       dots   HALBTON-RASTER: der Schatten wird nicht flach gedruckt, sondern gerastert. Das Raster
              steht um 15 Grad gedreht (so macht es die Druckerei, damit es nicht mit dem
              Papierraster interferiert), und die PUNKTGROESSE folgt dem Feld — dunklere Stellen
              bekommen dickere Punkte. Genau das hat gefehlt (Georg: 'duo tone dots sehe ich nicht').
       bleed  der Auslauf auf der hellen Seite der Kante: der Versatz einer schlecht registrierten
              Druckplatte. Der macht es handgemacht statt vektorsauber. */
  float cutA  = step(uCut, w1.x);
  float cutB  = step(uCut + 0.085, w2.x);
  float bleed = smoothstep(uCut - uBleed, uCut, w1.x) * (1.0 - cutA);

  float ca = cos(0.262), sa = sin(0.262);
  vec2  hp = vec2(p.x * ca - p.y * sa, p.x * sa + p.y * ca);
  float grid = 0.5 + 0.5 * sin(hp.x * uDot) * sin(hp.y * uDot);
  float tone = smoothstep(uCut - 0.14, uCut + 0.06, w2.x);   // wie dunkel soll hier gerastert werden
  float dots = step(1.0 - tone, grid) * tone;

  float duo = clamp(cutA * 0.52 + cutB * 0.16 + dots * 0.46 + bleed * 0.30, 0.0, 1.0) * uDuo;
  col = mix(col, uInk, duo);

  /* Papierfaser bleibt ORTSFEST — sie gehoert dem Papier, nicht der Farbe. Liesse man sie
     mitwandern, sieht man sofort, dass die Textur rutscht (der klassische Fehler). Sie HELLT auf,
     statt zu verschmutzen: Papier scheint durch, es liegt nicht darueber. */
  float g = noise3(vec3(vUv * 420.0, 0.0));
  col += (g - 0.5) * uGrain;

  /* Randabdunklung, sehr schwach: sie schiebt den Blick zur Karte, ohne als Vignette zu lesen. */
  float r = length((vUv - 0.5) * vec2(1.1, 1.0));
  col *= 1.0 - smoothstep(0.42, 0.95, r) * uVignette;

  gl_FragColor = vec4(col, 1.0);
}`;

export function createGutter({ THREE, stage, params = {} }) {
  const P = Object.assign({
    /* DEFAULT ist die Fluid-Flaeche (Georgs Entscheidung 04:00): sie ist eine OBERFLAECHE, keine
       Leinwand — sie kann auf Ereignisse antworten. 'shader' (Aquarell-Quad) bleibt als ruhiger
       Rueckweg fuer reine Praesentationen, 'watercolor' ist das alte Skydome-Foto. */
    channel: 'fluid',        // 'fluid' | 'shader' | 'watercolor' | 'media'
    palette: 'kfb',
    wash: 0.55,
    grain: 0.045,
    vignette: 0.14,
    /* 0 = eingefroren. Der Rueckweg zaehlt: waehrend der Flipper-Action soll der Hintergrund
       Rechenzeit UND Aufmerksamkeit abgeben koennen (`gutter.on('action', {value:0.25})`). */
    flow: 1.0,
    /* Die Duo-Tone-Ebene. `duo` 0 = reines Aquarell (Rückweg), 1 = Comic-Flächen voll drauf.
       0,30 als Default: die Fläche soll den Vordergrund tragen, nicht mit ihm konkurrieren —
       Ereignisse dürfen sie hochziehen (`gutter.on('impact')`). */
    duo: 0.30, cut: 0.56, bleed: 0.055,
    rag: 0.16,           // wie fransig die Pigmentkante ist (0 = Lavalampe)
    dot: 210.0,          // Rasterweite der Halbton-Punkte
    /* uCalm IST die Wellenhoehe — das Original hat kein zweites Amplituden-Uniform. Dort steht
       `uCalm = 0.28 + 0.72 * grav`: bei ruhender Schwerkraft also 0,28, NICHT 1,0. Meine 1,0 war
       der Grund fuer "zu schnell / zu gross" — ich habe den Ruhewert des Originals uebersprungen.
       ABER 0,28 ist der Wert bei RUHENDER Schwerkraft, und Georgs Referenzbild zeigt das SPIEL
       (grav ~ 1 → uCalm ~ 1,0). Genau daran haengt der Look, und zwar an zwei Stellen zugleich:
         Farbe    k = vH · 3,2 + 0,5. Bei 0,28 schwankt k nur um ±0,22 um die Mitte — eine milde
                  Schattierung, im Bild bleiben nur die Konturstreifen sichtbar. Bei 1,0 sind es
                  ±0,78, also der VOLLE Bereich mit Saettigung an beiden Enden: die morphenden Lappen.
         Kontur   die Linie traegt vH · 22. Bei 0,28 sind das ±1,5 Radiant und die Linien bleiben
                  fast gerade; bei 1,0 sind es ±5,4 und sie folgen der Welle.
       Georgs Befund „nur Wellenlinien, keine morphenden Formen" war genau das. Darum ist 1,0 der
       Default (= das Original im Spiel); `setCalm` senkt ihn, wenn es ruhig werden soll. */
    calm: 1.0,
    speed: 0.32,         // Tempo der Grundschwelle; 1,0 = Spielfeld-Tempo des Originals
    dotPx: 9,            // Abstand der Halbton-Punkte IM BILD, in Pixeln
    seed: 3.7,
  }, params);

  let quad = null, mat = null, skyWas = null, drawMs = 0;
  let fluid = null, fmat = null, ripIdx = 0, builds = 0;
  /* ZULETZT GEWUENSCHTE FLUID-FARBEN. Sie muessen ueberdauern, weil der Wunsch VOR der Flaeche
     kommen kann: `storymode` faerbt schon im Konstruktor, aber `fmat` entsteht erst, wenn die Karte
     gemessen ist (`writeFluid` steigt ohne `card` aus). Ohne diesen Merker war `setFluidColors`
     beim Boot ein stiller Fehlschlag — die Bedienstelle zeigte "Absurd", das Bild blieb blau, und
     weil der Uebergang danach auf k=1 steht, kam nie ein zweiter Versuch.
     Der Merker gehoert HIERHER, nicht zum Anrufer: wer die Uniforms besitzt, besitzt auch die
     Frage "was gilt, wenn es sie noch nicht gibt". */
  let wantColors = null;
  /* Der Zustand des Moduls. WIEDER EINGEFUEGT: die Zeile ist bei einem frueheren Umbau verloren
     gegangen, und weil `card` nur INNERHALB von Funktionen vorkommt, hat das kein Ladefehler
     gemeldet — die Buehne blieb beim Boot stehen mit "card is not defined". */
  let t = 0, W = 2, H = 2, pxPerUnit = 100, card = null;

  const hex = (h) => new THREE.Color(h);

  function build() {
    if (quad) return quad;
    const pal = PALETTES[P.palette] || PALETTES.kfb;
    mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      depthWrite: false, depthTest: false, toneMapped: false,
      uniforms: {
        uAspect: { value: new THREE.Vector2(1, 1) },
        uPaper: { value: hex(pal.paper) }, uA: { value: hex(pal.a) },
        uB: { value: hex(pal.b) }, uC: { value: hex(pal.c) },
        uSeed: { value: P.seed }, uWash: { value: P.wash },
        uGrain: { value: P.grain }, uVignette: { value: P.vignette },
        uTime: { value: 0 }, uFlow: { value: P.flow },
        uInk: { value: hex(pal.ink || '#b8361f') },
        uDuo: { value: P.duo }, uCut: { value: P.cut }, uBleed: { value: P.bleed },
        uRag: { value: P.rag }, uDot: { value: P.dot },
      },
    });
    quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    quad.frustumCulled = false;         // der Quad sitzt im Clip-Raum, eine Bbox sagt nichts
    quad.renderOrder = -1000;           // zuerst, damit alles andere darauf liegt
    quad.userData.noMeasure = true;
    stage.camera.add(quad);
    /* Die Kamera ist normalerweise KEIN Kind der Szene — dann werden ihre Kinder nicht gerendert.
       Ein Aufruf, sonst bleibt das Bild leer und man sucht im Shader. */
    if (!stage.camera.parent) stage.scene.add(stage.camera);
    return quad;
  }

  function apply() {
    writeFluid();
    const on = P.channel === 'shader';
    if (on) build();
    if (quad) quad.visible = on;
    /* Der Skydome ist der Rückweg. Beim Umschalten wird er gemerkt, nicht weggeworfen. */
    if (on || P.channel === 'fluid') {
      if (skyWas === null) skyWas = stage.scene.background || false;
      stage.scene.background = null;
    } else if (P.channel === 'watercolor' && skyWas !== null && skyWas !== false) {
      stage.scene.background = skyWas;
    }
  }

  /* ---- Kanal `fluid`: die Oberflaeche ------------------------------------------------------
     DIE GEOMETRIE WIRD IN ECHTER GROESSE GEBAUT, NICHT SKALIERT. Das Original macht das so
     (`PlaneGeometry(W + 9, H + 8, 90, 110)`, keine scale), und daran haengt alles: `position` ist
     dann bereits in Welteinheiten, also gelten die Konstanten des Originals (0,65 / 0,85 / 0,42 /
     9d / 1,1d) unveraendert. Meine erste Fassung nahm `PlaneGeometry(1,1)` und skalierte — dadurch
     lief `position` nur von −0,5 bis +0,5, ich musste mit `uSize` nachmultiplizieren, und jede
     Zahl des Originals bedeutete etwas anderes. Genau das war "zu gross, zu schnell, andere
     Timings". Eine skalierte Flaeche ist NICHT dieselbe Flaeche. */
  function buildFluid(w, h) {
    const segX = 90, segY = 110;   // Original
    if (fluid && Math.abs(fluid.userData.w - w) < 0.01 && Math.abs(fluid.userData.h - h) < 0.01) return fluid;
    builds++;
    if (fluid) { fluid.geometry.dispose(); fluid.geometry = new THREE.PlaneGeometry(w, h, segX, segY); }
    else {
      fmat = new THREE.ShaderMaterial({
        vertexShader: FLUID_VERT, fragmentShader: FLUID_FRAG,
        uniforms: {
          uTime: { value: 0 }, uCalm: { value: P.calm }, uDark: { value: 0 },
          uScale: { value: 3.0 }, uSpeed: { value: P.speed },
          uRip: { value: Array.from({ length: MAXRIP }, () => new THREE.Vector4(0, 0, -99, 0)) },
          /* DEFAULTS = DIE ORIGINALWERTE, wortwoertlich aus sbp-v3.js Z. 866/869. Die Palette darf
             sie faerben, aber wer nichts einstellt, bekommt das Original. */
          uDeep: { value: new THREE.Color(0.29, 0.51, 0.58) },
          uLight: { value: new THREE.Color(0.62, 0.80, 0.84) },
          uLine: { value: new THREE.Color(0.10, 0.16, 0.18) },
          /* KEIN Marken-Rot hier. Das Raster ist eine Druckplatte, kein Akzent — es nimmt den
             Konturton des Originals (0.10|0.16|0.18). Rot neben der Karte macht einen zweiten
             Blickfang, und die Karte soll allein sprechen (Georg 05:05). "setFluidColors" kann
             es faerben, wenn eine Zone das mal braucht. */
          uInk: { value: new THREE.Color(0.10, 0.16, 0.18) },
          uDuo: { value: P.duo }, uDot: { value: 25.0 },
        },
      });
      fluid = new THREE.Mesh(new THREE.PlaneGeometry(w, h, segX, segY), fmat);
      fluid.userData.noMeasure = true;
      fluid.renderOrder = -900;
      /* KIND DER KARTENGRUPPE — siehe Modulkopf: aufrecht ist die Flaeche der Gutter zwischen den
         Blaettern, gekippt ist sie das Spielfeld. Eine Flaeche, zwei Ansichten. */
      stage.panelGroup.add(fluid);
      /* Nachziehen, was vor dem Bau gewuenscht wurde — der Startpfad haengt genau hier. */
      applyColors();
    }
    fluid.userData.w = w; fluid.userData.h = h;
    return fluid;
  }

  /** Die gemerkten Farben auf die Uniforms schreiben — EIN Ort, von `setFluidColors` und von
      `buildFluid` gerufen. Ohne `fmat` tut es nichts und verliert nichts. */
  function applyColors() {
    if (!fmat || !wantColors) return;
    if (wantColors.deep) fmat.uniforms.uDeep.value.copy(hex(wantColors.deep));
    if (wantColors.light) fmat.uniforms.uLight.value.copy(hex(wantColors.light));
    if (wantColors.line) fmat.uniforms.uLine.value.copy(hex(wantColors.line));
  }

  /* DIE TIEFE DER FLÄCHE HINTER DEM BLATT — EINE Zahl, gelesen von der Lage UND vom Fußabdruck.
     Die Begründung der 1,2 steht unten bei `position`. */
  const GZ = -1.2;

  /* ---- DER FUSSABDRUCK DES BILDES AUF DIESER FLÄCHE (v5) -----------------------------------
     Vier Strahlen durch die Ecken des Bildes, Schnitt mit der EBENE der Fläche, Ergebnis in den
     Koordinaten der Kartenebene. Verfahren aus `flipper.v2.js` `frameAt(z)` — siehe Modulkopf. */
  const _fq = new THREE.Quaternion(), _fn = new THREE.Vector3(), _fco = new THREE.Vector3();
  const _fpl = new THREE.Plane(), _fray = new THREE.Ray(), _fhit = new THREE.Vector3();
  function footprint() {
    const cam = stage.camera;
    if (!cam) return null;
    stage.panelGroup.updateMatrixWorld(true);
    cam.updateMatrixWorld(true);
    _fn.set(0, 0, 1).applyQuaternion(stage.panelGroup.getWorldQuaternion(_fq)).normalize();
    _fpl.setFromNormalAndCoplanarPoint(_fn, stage.panelGroup.localToWorld(new THREE.Vector3(0, 0, GZ)));
    cam.getWorldPosition(_fco);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, ok = 0;
    for (let i = 0; i < 4; i++) {
      const nx = (i & 1) ? 1 : -1, ny = (i & 2) ? 1 : -1;
      const dir = new THREE.Vector3(nx, ny, 0.5).unproject(cam).sub(_fco).normalize();
      _fray.set(_fco, dir);
      if (!_fray.intersectPlane(_fpl, _fhit)) continue;
      const l = stage.panelGroup.worldToLocal(_fhit.clone());
      x0 = Math.min(x0, l.x); x1 = Math.max(x1, l.x);
      y0 = Math.min(y0, l.y); y1 = Math.max(y1, l.y);
      ok++;
    }
    /* ALLE VIER oder keine. Drei Treffer wären ein halber Fußabdruck — und der schriebe sich als
       kleinere Fläche gut, also als LÜCKE, die die Abnahme nicht mehr sehen kann. */
    return ok === 4 ? { x0, x1, y0, y1 } : null;
  }

  function writeFluid() {
    if (P.channel !== 'fluid') { if (fluid) fluid.visible = false; return; }
    if (!card) { if (fluid) fluid.visible = false; return; }
    const scl = stage.panelGroup.scale.x || 1;
    const fp = footprint();
    let w, h, cx = card.cx, cy = card.cy;
    if (fp) {
      /* LUFT AM RAND, gerechnet: der Wellenberg hebt die Randpunkte um bis zu 0,45 Einheiten aus
         der Ebene (Grundschwell 0,245 + ein Ripple 0,24·1,6, siehe unten bei `position`), und bei
         gekippter Ebene wandert die Silhouette dadurch um 0,45·sin(Kippung) ≈ 0,35 nach innen.
         8 % der Kartenbreite liegen sicher darüber. */
      const luft = card.w * 0.08;
      /* AUF 0,1 GERASTERT: `writeFluid` läuft in jedem Bild, und eine Größe, die um Bruchteile
         zappelt, baute jedes Bild eine neue Geometrie. `stats().neubauten` macht das sichtbar. */
      const rast = (v) => Math.ceil(v / 0.1) * 0.1;
      w = rast((fp.x1 - fp.x0) + 2 * luft);
      h = rast((fp.y1 - fp.y0) + 2 * luft);
      /* Die Mitte des Rechtecks ist die Mitte des Fußabdrucks, nicht die der Karte: beim
         zurückgelehnten Feld ist der Bedarf oben größer als unten (gemessen 7,9 gegen 4,6 bei
         30°). Ein mittiges Rechteck müsste doppelt so hoch sein — und ein zu großes Rechteck
         kostet Auflösung der Welle, weil die Punktzahl (90 × 110) fest ist. */
      cx = (fp.x0 + fp.x1) / 2;
      cy = (fp.y0 + fp.y1) / 2;
      /* Untergrenze, damit ein entarteter Fußabdruck die Fläche nie unter das Blatt schrumpft.
         Sie ist NICHT die bindende Größe: gemessen ist der Fußabdruck schon bei 3° (14,6 breit)
         größer als diese Schranke (11,0) — eine bindende Untergrenze würde den Fehler still
         wiederherstellen. */
      w = Math.max(w, card.w * 1.1); h = Math.max(h, card.h * 1.1);
    } else {
      /* RÜCKWEG = die Regel der v4, wörtlich: gross genug, dass sie in der Sendung das Bild fuellt
         und im Feld ueber die Karte hinauslaeuft. */
      w = Math.max(card.w * 1.6, (W / Math.max(1e-3, pxPerUnit)) * 1.45 / scl);
      h = Math.max(card.h * 1.6, (H / Math.max(1e-3, pxPerUnit)) * 1.45 / scl);
    }
    buildFluid(w, h);
    /* Die Umrechnung ins Originalmass: wie oft passt meine Karte in SpinBalls Karte (W = 17,4).
       Damit ist die Wellenlaenge IM VERHAELTNIS ZUR KARTE dieselbe — unabhaengig von Fenster und
       Zoom, weil beide Groessen mitskalieren. */
    const uScale = ORIG_CARD_W / Math.max(0.1, card.w);
    fmat.uniforms.uScale.value = uScale;
    /* Rasterweite aus einem PIXELABSTAND: das Raster soll im Bild immer gleich fein sein.
       Periode in Originaleinheiten = (dotPx / pxPerUnit) × uScale → uDot = 2π / Periode. */
    const perUnit = Math.max(1e-3, pxPerUnit * (stage.panelGroup.scale.x || 1));
    fmat.uniforms.uDot.value = (2 * Math.PI) / Math.max(1e-3, (P.dotPx / perUnit) * uScale);
    /* ABSTAND ZUM BLATT: im Original liegt die Flaeche FLACH, `p.z += h` hebt also nach oben und
       kann nichts durchstossen. Meine steht SENKRECHT (sie ist der Gutter hinter den Karten) — dort
       schiebt dasselbe `h` zur KAMERA. Rechnung: Grundschwell 0,245 × uCalm plus ein Ripple bis
       0,24 × 1,6 = zusammen bis 0,45 Einheiten. Bei −0,06 stiess der Wellenberg vor das Blatt —
       im Bild eine hellblaue Blase mitten auf der Karte (Georg 04:49).
       1,2 liegt sicher dahinter und ist immer noch weit vor den Nachbarkarten. */
    fluid.position.set(cx, cy, GZ);
    fluid.visible = true;
  }

  /** Eine Welle in den Gutter werfen. Koordinaten im LOKALEN System der Karte — dieselbe Sprache,
      in der auch die Sitze und die Ausgänge rechnen. */
  function ripple(x, y, strength) {
    if (!fmat) return null;
    const s = Math.min(Math.abs(strength == null ? 1 : strength), 1.6);
    /* ⚠ v5: KARTENKOORDINATE → FLÄCHENKOORDINATE, an genau dieser einen Stelle. Der Shader
       vergleicht `uRip.xy` mit `position.xy` der Fläche; seit das Rechteck seinem Fußabdruck
       folgt, liegt seine Mitte nicht mehr im Kartenmittelpunkt (bei 30° 1,7 Einheiten darüber).
       Ohne diesen Abzug schlüge jede Welle um genau diesen Betrag daneben auf. */
    const ox = (fluid ? fluid.position.x : 0) - (card ? card.cx : 0);
    const oy = (fluid ? fluid.position.y : 0) - (card ? card.cy : 0);
    fmat.uniforms.uRip.value[ripIdx].set((x || 0) - ox, (y || 0) - oy, fmat.uniforms.uTime.value, s);
    ripIdx = (ripIdx + 1) % MAXRIP;
    return { slot: ripIdx, s };
  }

  /** Weltpunkt → Welle. Damit kann ein Aufprall einfach seinen Ort melden. */
  function rippleAt(world, strength) {
    if (!fluid || !world) return null;
    const l = stage.panelGroup.worldToLocal(new THREE.Vector3(world[0], world[1], world[2]));
    return ripple(l.x - (card ? card.cx : 0), l.y - (card ? card.cy : 0), strength);
  }

  /** DIE ABNAHMEZAHL DIESER SCHEIBE (V2-S1). Sie liest am BILD, nicht an der Absicht: die vier
      Ecken der Fläche werden PROJIZIERT, und die Lücke ist der Abstand der Kante zum Bildrand in
      Bildpunkten. Ein Kriterium, das den Defekt sehen kann — vor der Änderung stand hier bei 30°
      `oben 29`, bei 52° `oben 148`. */
  function deckung() {
    if (!fluid || !fluid.visible) return { flaeche: false, deckt: false };
    stage.panelGroup.updateMatrixWorld(true);
    const w = fluid.userData.w, h = fluid.userData.h;
    const pr = (x, y) => {
      const v = fluid.localToWorld(new THREE.Vector3(x, y, 0)).project(stage.camera);
      return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
    };
    const tl = pr(-w / 2, h / 2), tr = pr(w / 2, h / 2);
    const bl = pr(-w / 2, -h / 2), br = pr(w / 2, -h / 2);
    const g = {
      flaeche: true, bild: W + 'x' + H,
      oben: Math.round(Math.max(0, Math.max(tl.y, tr.y))),
      unten: Math.round(Math.max(0, H - Math.min(bl.y, br.y))),
      links: Math.round(Math.max(0, Math.max(tl.x, bl.x))),
      rechts: Math.round(Math.max(0, W - Math.min(tr.x, br.x))),
    };
    g.deckt = !g.oben && !g.unten && !g.links && !g.rechts;
    return g;
  }

  const api = {
    deckung,
    setSize(w, h) {
      W = Math.max(2, w); H = Math.max(2, h);
      if (mat) {
        /* Die Waschungen sollen bei jedem Fenster gleich GROSS sein, nicht gleich viele. Ohne diese
           Korrektur zieht ein breites Fenster die Flecken zu Baendern. */
        const a = Math.max(1e-3, W / Math.max(1, H));
        mat.uniforms.uAspect.value.set(a > 1 ? a : 1, a > 1 ? 1 : 1 / a);
      }
      writeFluid();
      return api;
    },
    /** Die MESSUNG des Layouts uebernehmen (Karte, Pixelrate, Uhr). Der Gutter misst nicht selbst
        nach: eine zweite Messung derselben Flaeche waere eine zweite Wahrheit. */
    setContext(m) {
      if (!m) return api;
      if (m.cardLocal) card = m.cardLocal;
      if (m.pxPerUnit) pxPerUnit = m.pxPerUnit;
      if (m.t != null) t = m.t;
      if (m.W) W = m.W;
      if (m.H) H = m.H;
      writeFluid();
      return api;
    },
    /** EIN Aufruf pro Frame aus der Bühnen-Schleife. Der Gutter hält KEINE eigene Uhr — er bekommt
        die der Bühne, sonst laufen zwei Zeiten auseinander (die Lehre aus `arrival.js`). */
    tick(dt) {
      const d = dt || 0.016;
      if (mat && P.flow > 0) mat.uniforms.uTime.value += d;
      if (fmat) fmat.uniforms.uTime.value += d;   // die Fluid-Uhr laeuft immer: Wellen brauchen sie
      return api;
    },
    ripple, rippleAt,
    /** Die zwei Grundtoene der Flaeche setzen. Ohne Aufruf gilt das Original (0.29|0.51|0.58 nach
        0.62|0.80|0.84). Wichtig: ZWEI BENACHBARTE TOENE — derselbe Ton, nur heller. Eine grosse
        Spanne (Farbe nach Papier) macht die Welle matschig, weil die Hoehe dann die FARBE aendert
        statt die Helligkeit. */
    setFluidColors(deep, light, line) {
      /* ERST MERKEN, DANN SCHREIBEN — in dieser Reihenfolge, damit ein Aufruf vor dem Bau der
         Flaeche nicht verloren geht (siehe `wantColors`). */
      wantColors = Object.assign({}, wantColors, deep ? { deep } : null,
                                 light ? { light } : null, line ? { line } : null);
      applyColors();
      return api;
    },
    /** Wie bewegt die Flaeche ist. Im Original `0.28 + 0.72 * grav`. */
    setCalm(v) { P.calm = Math.max(0, Math.min(1.6, v)); if (fmat) fmat.uniforms.uCalm.value = P.calm; return api; },
    setChannel(c) { P.channel = c; apply(); return c; },
    setPalette(name) {
      P.palette = PALETTES[name] ? name : 'kfb';
      if (mat) {
        const pal = PALETTES[P.palette];
        mat.uniforms.uPaper.value.copy(hex(pal.paper));
        mat.uniforms.uA.value.copy(hex(pal.a));
        mat.uniforms.uB.value.copy(hex(pal.b));
        mat.uniforms.uC.value.copy(hex(pal.c));
        mat.uniforms.uInk.value.copy(hex(pal.ink || '#b8361f'));
      }
      if (fmat) {
        /* NUR die Rasterfarbe folgt der Palette. Grundfarben, Hell und Konturlinie bleiben die
           Originalwerte — wer sie faerben will, ruft `setFluidColors`. Eine automatische
           Umfaerbung war der Fehler: aus zwei benachbarten Blautoenen wurde Teal-nach-Creme. */
        /* Die Palette faerbt die Flaeche NICHT automatisch um — siehe setFluidColors. */
      }
      return P.palette;
    },
    /** Neu mischen — nur auf ANLASS (neue Karte, neue Sendung), nie von selbst. */
    reseed(v) { P.seed = v != null ? v : (Math.random() * 100); if (mat) mat.uniforms.uSeed.value = P.seed; return P.seed; },
    setParams(p) {
      Object.assign(P, p || {});
      if (mat) {
        mat.uniforms.uWash.value = P.wash;
        mat.uniforms.uGrain.value = P.grain;
        mat.uniforms.uVignette.value = P.vignette;
        mat.uniforms.uFlow.value = P.flow;
        mat.uniforms.uDuo.value = P.duo;
        mat.uniforms.uCut.value = P.cut;
        mat.uniforms.uBleed.value = P.bleed;
        mat.uniforms.uRag.value = P.rag;
        mat.uniforms.uDot.value = P.dot;
      }
      if (fmat) {
        fmat.uniforms.uDuo.value = P.duo;
        writeFluid();
        fmat.uniforms.uCalm.value = P.calm;
        fmat.uniforms.uSpeed.value = P.speed;
      }
      if (p && p.palette) api.setPalette(p.palette);
      if (p && p.channel) apply();
      return api;
    },
    /** Zeichenzeit EHRLICH messen: ohne `gl.finish()` misst man nur, wie schnell der Treiber die
        Befehle annimmt. Zwei Läufe, weil der erste den Shader kompiliert. */
    measure(n) {
      const gl = stage.renderer.getContext();
      const runs = n || 30;
      const once = () => {
        const t0 = performance.now();
        for (let i = 0; i < runs; i++) stage.renderer.render(stage.scene, stage.camera);
        gl.finish();
        return (performance.now() - t0) / runs;
      };
      once();
      drawMs = +once().toFixed(3);
      return drawMs;
    },
    stats() {
      return { channel: P.channel, palette: P.palette, wash: P.wash, grain: P.grain,
               vignette: P.vignette, flow: P.flow, duo: P.duo, cut: P.cut, bleed: P.bleed,
               rag: P.rag, dot: P.dot, calm: P.calm, speed: P.speed, dotPx: P.dotPx,
               fluid: fluid ? { visible: fluid.visible, w: +fluid.userData.w.toFixed(2),
                                h: +fluid.userData.h.toFixed(2), calm: +fmat.uniforms.uCalm.value.toFixed(2),
                                scale: +fmat.uniforms.uScale.value.toFixed(2), uDot: +fmat.uniforms.uDot.value.toFixed(1),
                                colors: wantColors || 'default (SpinBall)',
                                time: +fmat.uniforms.uTime.value.toFixed(1) } : null,
               deckung: deckung(), neubauten: builds,
               seed: +P.seed.toFixed(2),
               time: mat ? +mat.uniforms.uTime.value.toFixed(1) : 0,
               mounted: !!quad, visible: !!(quad && quad.visible),
               cameraInScene: !!(stage.camera.parent), drawMs };
    },
    /** Die Namen, unter denen ein Trigger eine Palette wählen kann. */
    get palettes() { return Object.keys(PALETTES); },
    /** DIE NAHT FÜR EREIGNISSE (Georg 02:54: „später in den Settings anpassen — oder per Events /
        Trigger / Dice Rolls"). Ein Aufrufer sagt, WAS passiert ist; dieses Modul entscheidet, wie
        der Gutter darauf aussieht. Kein Ereignis kennt ein Uniform.
        Absichtlich sprungfrei gehalten: die Werte werden gesetzt, nicht gefahren — eine Animation
        hätte eine zweite Uhr, und die gehört der Bühne. */
    on(event, ctx) {
      const c = ctx || {};
      if (event === 'card') return api.reseed();                       // neues Blatt, neues Papier
      if (event === 'deck') return api.setPalette(c.palette || 'kfb'); // Deck bringt seinen Ton mit
      if (event === 'heat') {                                          // Temperatur der Debatte
        const h = Math.max(0, Math.min(1, c.value != null ? c.value : 0.5));
        return api.setParams({ wash: 0.42 + h * 0.35, vignette: 0.10 + h * 0.16 });
      }
      if (event === 'roll') return api.reseed(((c.value || 1) * 17.3) % 100);  // Würfel = Seed
      /* Der Vordergrund hat Vorrang: während der Flipper-Action gibt der Hintergrund Bewegung ab.
         Nicht abschalten — abdrehen. Ein stehender Hintergrund fällt auf, ein ruhigerer nicht. */
      if (event === 'action') return api.setParams({ flow: c.value != null ? c.value : 0.25 });
      if (event === 'calm') return api.setParams({ flow: 1 });
      /* Ein harter Treffer schiebt die Comic-Platte nach vorn — die Welt antwortet in ihrer
         eigenen Sprache, nicht mit einem Effekt-Overlay. */
      if (event === 'impact') {
        /* Der Aufprall MELDET seinen Ort, er rechnet keine Welle. Ohne Ort trifft es die Mitte. */
        if (c.pos) return rippleAt(c.pos, c.value != null ? c.value : 1.0);
        return ripple(c.x || 0, c.y || 0, c.value != null ? c.value : 1.0);
      }
      return null;
    },
    dispose() {
      if (quad) { stage.camera.remove(quad); quad.geometry.dispose(); mat.dispose(); quad = null; mat = null; }
      if (fluid) { stage.panelGroup.remove(fluid); fluid.geometry.dispose(); fmat.dispose(); fluid = null; fmat = null; }
      if (skyWas !== null && skyWas !== false) stage.scene.background = skyWas;
    },
  };
  apply();
  return api;
}
