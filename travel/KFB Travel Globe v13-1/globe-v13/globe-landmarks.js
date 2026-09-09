// ============================================================================
// globe-landmarks.js — KFB Travel Globe v3 · Kenney-Props als Landmarken
// ----------------------------------------------------------------------------
// Befund 3 im Living-Dokument. **Kein Port:** `terrain-v17/prop-scatter.js` rechnet in Chunks
// einer EBENE, importiert `voxel-terrain.js` (Palette und Motion-GLSL) und bekommt seine
// Standorte vom Voxel-Terrain. Nichts davon existiert hier. Übernommen ist die LEHRE dieser
// Datei, wörtlich ihre vier Entscheidungen:
//   (1) EIN InstancedMesh je Modellteil, global — nicht je Kachel.
//   (2) Die Standorte gehören dem Gelände, nicht dem Streuer: Höhe kommt aus
//       `surfaceAltitudeAt`, Land/Wasser aus `isLand` — dieselbe Funktion, die die Flugphysik
//       liest. Wer den Boden zweimal rechnet, hat zwei Höhen.
//   (3) Modellnamen kommen aus `asset-repo.json` (986 Assets mit `ghUrl`), NICHT aus selbst
//       zusammengesetzten Pfaden. Die Kenney-Ordner heißen `Models/GLTF format/` bzw.
//       `Models/GLB format/` — wer das rät, baut den Fehler vom 23.7. nach.
//   (4) Nichts wird ins Projekt kopiert: RAW-URL zur Laufzeit, und wenn das Netz nichts liefert,
//       bleibt die Welt leer statt kaputt.
//
// **Korrektur zum Living-Dokument (29.8.):** dort stehen als Kits „city, castle, holiday, market,
// arcade, prototype". Im Index liegen tatsächlich `kenney_nature-kit` (329),
// `kenney_fantasy-town-kit_2.0` (167, MODULE — Dächer, Wände, keine ganzen Häuser),
// `kenney_survival-kit` (80) und `GLB_hexagon_kit` (72, GANZE Gebäude: Burg, Turm, Mühle).
// Landmarken kommen deshalb aus dem Hexagon-Kit, Streuung aus dem Nature-Kit.
//
// **Verteilung: Fibonacci-Gitter, kein Zufall.** Zufällige Punkte auf einer Kugel klumpen
// (Poisson), und Klumpen sehen wie ein Fehler aus. Das goldene Winkelgitter verteilt gleichmäßig
// und ist mit einem Seed reproduzierbar — dieselbe Welt liefert dieselben Landmarken.
// ============================================================================

import { initRimLight, addRimLight } from './rim-light.js';
import { surfaceAltitudeAt } from './terrain-surface.js';
import { planSites } from './globe-zones.js';
// v3 · S3b · Der Verbieger ist ab hier ein GETEILTES Modul (Projektwurzel), kein Anbau:
// dieselbe Mathematik wie `kfb-cartoon-deform.js`, nur auf Instanz-Attributen statt Uniforms.
import { attachInstancedDeform, LIMITS, ringsAlongY } from '../kfb-deform-instanced.js';

/** Ringe zählen, ohne den Bau zu riskieren — eine Geometrie ohne `position` gibt 0. */
function ringsAlongYSafe(g) {
  try { return ringsAlongY(g); } catch (e) { return 0; }
}

// Streuung: verschiedene SILHOUETTEN, nicht verschiedene Bäume (Lehre aus prop-scatter §PROP_SET).
// **Exportiert seit 2.9.**, weil das Asset-Audit die zugewiesenen Welthöhen LESEN soll, statt sie
// abzuschreiben — eine kopierte Tabelle wäre eine zweite Wahrheit, die beim ersten Ändern kippt.
import { weltHoehe, tor as kitTor } from './kit-massstab.js';   // v10 · EIN Maßstab pro Kit

// ⚠ **`h:` steht seit 2.9. nur noch bei AUSNAHMEN — mit `grund:`.** Alles andere bekommt seine
// Welthöhe aus dem Kit-Faktor × Rohmaß (kit-massstab.js). Die alten Handwerte stehen als
// `vorher:` daneben, damit das Tor sagen kann, was sich bewegt hat. Wer hier ein `h:` ohne
// `grund:` einträgt, baut den Fehler vom 29.8. („Fässer zu groß") und 2.9. („Felsen zu klein") nach.
export const STREU = [
  { name: 'tree_default',       kind: 'tree',  vorher: 0.075, w: 20 },   // Eichpunkt von METER
  { name: 'tree_pineTallA',     kind: 'tree',  vorher: 0.085, w: 16 },
  { name: 'tree_thin',          kind: 'tree',  vorher: 0.070, w: 10 },
  { name: 'rock_tallA',         kind: 'rock',  vorher: 0.048, w: 9 },
  { name: 'plant_bushDetailed', kind: 'bush',  vorher: 0.026, w: 12 },
  { name: 'mushroom_redGroup',  kind: 'small', vorher: 0.020, w: 5 },
];
// Landmarken: wenige, groß, aus dem Hexagon-Kit — sie sollen ORIENTIERUNG geben, nicht Dichte.
// **Exportiert**, weil die Zonenplanung (`globe-zones.js`) die Modellhöhe BRAUCHT, bevor der
// Globus gebacken ist — und die Höhe steht hier.
// ⚠ **Farbe je Modell ist keine Laune, sondern die Folge einer Messung** (29.8.): die
// Hexagon-Kit-GLBs tragen nur `position` und `normal` — **kein `uv`**. Ohne UVs kann kein Atlas
// sie färben (mein erster Versuch tastete bei (0,0) ab, also in der schwarzen Ecke: „die Gebäude
// sind jetzt schwarz"). Jedes Modell hat genau EIN Material namens `colormap` in Weiß.
//
// Die Antwort kommt aus tinyskies selbst: **dort gibt es überhaupt keine Asset-Farben.** Jede
// Landmarke (Dorf, Leuchtturm, Mühle, Sternwarte, Steinkreis, Schrein, Pyramide, Statue) ist in
// `Globe.ts` aus Primitiven gebaut und trägt eine HEX-Farbe je Material, geeicht auf das
// Sieben-Lichter-Preset ohne Tonemapping. Also genauso hier: eine Farbe je Modell aus der
// KFB-Palette — die Farb-Logik der Quelle, angewandt auf fremde Silhouetten.
export const MARKEN = [
  // ⚠ **building-castle ist RAUS (Georg, 3.9.: „unsere braun-grauen assets wie castle … würde ich
  // rausnehmen").** Nicht wegen des Modells — wegen der FARBE im neuen Zusammenhang: #9c9384 ist
  // ein Grau mit Braunstich, und seit v12 steht daneben eine gebaute Vegetation mit gesetzten,
  // gesättigten Grüns. Was vorher „steinern" las, liest jetzt „unbemalt". Turm, Zauberturm und
  // Mühle bleiben: sie tragen eine ENTSCHIEDENE Farbe aus der Palette, die Burg trug die
  // Abwesenheit einer.
  // ⚠ **Nachtrag (Georg, 3.9.): „und auch die anderen grau-braunen buildings (mühle etc) würde
  // ich rauslassen, die wirken wie Fremdkörper."** Damit fällt auch mein Satz von oben — ich
  // hatte behauptet, Turm, Mühle und Markt trügen „eine ENTSCHIEDENE Farbe". Am Bild gemessen
  // tun sie das nicht: #a8a091 ist Grau mit Braunstich, #b08a5e und #b5764f sind ungesättigte
  // Erdtöne. Das WAREN Palettenfarben — für eine bräunere Welt. Seit v12 steht daneben gebaute
  // Vegetation mit gesetzten Grüns, und dagegen lesen sie als unbemalt.
  // **Eine Palettenfarbe ist keine Eigenschaft des Objekts, sondern seiner Nachbarschaft.**
  { name: 'building-tower',        kind: 'build', h: 0.20, w: 4, col: 0xa8a091, dom: 2, graubraun: true },
  { name: 'building-wizard-tower', kind: 'build', h: 0.21, w: 3, col: 0x7c6f96, dom: 2 },
  { name: 'building-mill',         kind: 'build', h: 0.17, w: 4, col: 0xb08a5e, dom: 1, graubraun: true },
  { name: 'building-market',       kind: 'build', h: 0.15, w: 4, col: 0xb5764f, dom: 0, graubraun: true },
];

/** ── Fake-AO und Objekt-Rim · 1:1 aus `Globe.ts` (Tree 2659a5cc987d, gelesen 30.8.) ──────────
 *  Zwei Zeilen Aufwand, die in den tinyskies-Bildern die halbe Plastizität machen — und beide
 *  hatten wir nicht. Die Quelle wendet sie auf JEDES prozedural gebaute Objekt an:
 *
 *    Baum   `ao = lerp(0.1,  1.0, min(1, t * 2.0))`   t = y / Höhe   → volle Helligkeit ab 50 %
 *    Fels   `ao = lerp(0.15, 1.0, min(1, py / (sy * 0.7)))`          → volle Helligkeit ab 70 %
 *    Haus   `ao = lerp(0.15, 1.0, min(1, y / 0.5))`                  → volle Helligkeit ab 50 %
 *    Rim    `addRimLight(treeMat, 0xffeeaa, 0.7, 3.0)` · Fels/Bau `0xffeebb, 0.5, 3.0`
 *
 *  ⚠ **Warum das mehr ist als ein Effekt:** unsere Props stehen ohne Schatten (der Kartenschatten
 *  ist aus, die Quelle hat im Flug auch keinen sichtbaren — §05q). Ein Objekt ohne Schatten und
 *  ohne dunklen Fuß **klebt nicht am Boden, es liegt darauf.** Das AO ersetzt den Schatten nicht,
 *  es macht ihn entbehrlich: die Verdunkelung sitzt am Objekt, nicht auf dem Untergrund, und kann
 *  deshalb keine Polygonkanten erzeugen (genau der Defekt, den unser gemalter Fleck hatte).
 *  Und der Rim gibt die Gegenrichtung: eine helle Kante gegen den Himmel, die eine Silhouette
 *  lesbar macht, ohne die Fläche aufzuhellen.
 *  *Plastizität ist ein Verhältnis von Fuß zu Kante, nicht eine Menge Licht.*
 *
 *  Naht: die Quelle baut ihre Props selbst und kennt `sy` (Bauhöhe) direkt. Unsere sind GLB-Modelle
 *  — die Höhe kommt aus `propBox`, der gemeinsamen Box ALLER Teile eines Props. Das ist wichtig:
 *  je Teil gerechnet würde der Kronenboden eines Baums so dunkel wie der Stammfuß. */
const AO = {
  tree:  { boden: 0.10, vollBei: 0.50, rim: 0.7 },
  rock:  { boden: 0.15, vollBei: 0.70, rim: 0.5 },
  build: { boden: 0.15, vollBei: 0.50, rim: 0.5 },
};
function aoFuer(kind) { return AO[kind] || AO.build; }

/** Schreibt das Fake-AO als Vertexfarbe in `g` — multiplikativ, falls schon eine da ist. */
function aoBacken(THREE, g, box, kind) {
  const pos = g.getAttribute('position');
  if (!pos) return false;
  const r = aoFuer(kind);
  const y0 = box.min.y, h = Math.max(1e-6, box.max.y - box.min.y);
  const alt = g.getAttribute('color');
  const c = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) - y0) / h;
    const k = Math.max(0, Math.min(1, t / r.vollBei));
    const ao = r.boden + (1 - r.boden) * k;
    if (alt) {
      c[i * 3] = alt.getX(i) * ao; c[i * 3 + 1] = alt.getY(i) * ao; c[i * 3 + 2] = alt.getZ(i) * ao;
    } else { c[i * 3] = ao; c[i * 3 + 1] = ao; c[i * 3 + 2] = ao; }
  }
  g.setAttribute('color', new THREE.BufferAttribute(c, 3));
  return true;
}

/** Gewichtete Auswahl — dieselbe Mechanik wie `PROP_SET.w` in `prop-scatter.js`. */
export function waehlen(set, u) {
  let sum = 0;
  for (const s of set) sum += s.w;
  let x = u * sum;
  for (const s of set) { x -= s.w; if (x <= 0) return s; }
  return set[set.length - 1];
}

/** Jedem Standort SEIN Modell zuweisen — vor der Zonenplanung, weil die Zonengröße an der
 *  Modellhöhe hängt. Danach ist `site.def` die Wahrheit, auch für den Loader.
 *
 *  ⚠ **Nicht zweimal dasselbe dominante Gebäude in Nachbarschaft** (Georg, 29.8., präzisiert:
 *  „also nicht zweimal das castle"). Der Grund ist nicht Geschmack, sondern die Aufgabe:
 *  Landmarken sollen ORIENTIERUNG geben — und zwei gleiche Schlösser nebeneinander löschen genau
 *  die Information, die eine Landmarke ist. Wo bin ich? An einem Schloss. An welchem?
 *  Deshalb ZWEI Sperren, mit unterschiedlicher Weite:
 *   · **dasselbe Modell** — weit gesperrt. Das ist Georgs Regel.
 *   · **ein anderes dominantes Modell** — enger gesperrt. Schloss neben Zauberturm ist ein
 *     lesbarer Ort; nur direkt aneinander gerückt wird es ein Klumpen.
 *  Umgesetzt als Ablehnung, nicht als neue Verteilung: die gewichtete Auswahl (`waehlen`, die
 *  Mechanik der Quelle) bleibt der Eigentümer der Wahl. Wer abgelehnt wird, probiert erst ein
 *  ANDERES dominantes Modell (Vielfalt vor Verzicht), dann die leisen. Findet sich nichts, gewinnt
 *  der leiseste Kandidat — eine Zuweisung fällt nie aus (ein Standort ohne `def` wäre ein stiller
 *  Lücken-Prop).
 *  Gemessen wird als WINKEL zwischen den Standortnormalen, nicht in Weltmaß: auf einer Kugel ist
 *  der Bogen die einzige ehrliche Entfernung.
 */
export function assignMarken(sites, set, opt) {
  const S = set || MARKEN;
  const o = opt || {};
  // Sperrbögen als Vielfache des Bogens, der zwei Nachbarn im Gitter trennt. Ohne Bezug auf die
  // Anzahl wäre die Regel auf einer dicht besetzten Welt zu streng und auf einer leeren wirkungslos.
  //
  // ⚠ **Erste Fassung war Übererfüllung, gemessen und verworfen.** Mit 2,6 / 1,3 Nachbarbögen
  // (= 104° / 52°) blieben auf sechs geprüften Welten nur 3–4 dominante Bauten übrig, 11–15 von
  // 26 Standorten wurden verdrängt, und die Verteilung kippte auf 10–14 Mühlen plus 8–12 Märkte:
  // eine Welt ohne Wahrzeichen. Bei 26 Punkten ist der Nachbarbogen rund 40° — ein Sperrbogen von
  // 104° ist keine „Nachbarschaft", das ist ein Kontinent.
  // Georg hat „nicht zweimal das Castle DIREKT IN NACHBARSCHAFT" gesagt, nicht „höchstens ein
  // Castle pro Welt". Also: gleiches Modell = ein Ring Abstand, anderes Dominantes = nicht direkt
  // aneinander. Das ist die Regel, und nicht mehr.
  const nachbarBogen = Math.sqrt(4 * Math.PI / Math.max(4, sites.length));
  const sperreGleich = Math.cos(nachbarBogen * (o.sameSpacing != null ? o.sameSpacing : 1.35));
  const sperreDom    = Math.cos(nachbarBogen * (o.domSpacing  != null ? o.domSpacing  : 0.75));
  const domSchwelle = o.domLevel != null ? o.domLevel : 2;
  const gesetzt = [];   // schon platzierte dominante Standorte, mit Modellnamen
  let verdraengt = 0;

  /** Verboten, wenn ein GLEICHES Modell im weiten Bogen oder ein anderes Dominantes im engen liegt. */
  const verboten = (s, def) => {
    for (const g of gesetzt) {
      const d = s.n.x * g.x + s.n.y * g.y + s.n.z * g.z;
      if (g.name === def.name ? d > sperreGleich : d > sperreDom) return true;
    }
    return false;
  };

  for (const s of sites) {
    let pick = waehlen(S, s.pick);
    if ((pick.dom || 0) >= domSchwelle && verboten(s, pick)) {
      // Abgeleiteter Wurf, damit dieselbe Welt dasselbe Ergebnis liefert (kein `Math.random` in
      // der Weltgenerierung, Regel aus S3a).
      const u = (s.pick * 7.13 + 0.37) % 1;
      const andereDom = S.filter((d) => (d.dom || 0) >= domSchwelle && !verboten(s, d));
      const leise = S.filter((d) => (d.dom || 0) < domSchwelle);
      if (andereDom.length) pick = waehlen(andereDom, u);
      else if (leise.length) pick = waehlen(leise, u);
      verdraengt++;
    }
    s.def = pick;
    if ((pick.dom || 0) >= domSchwelle) gesetzt.push({ x: s.n.x, y: s.n.y, z: s.n.z, name: pick.name });
  }
  const grad = (c) => +(Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI).toFixed(1);
  sites.domReport = { dominante: gesetzt.length, verdraengt,
                      sperreGleich: grad(sperreGleich), sperreDom: grad(sperreDom) };
  return sites;
}

const RAW3D = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/';
// ⚠ **Kenney-Kits tragen ihre Farbe in einem ATLAS, nicht im Material** (Georg, 29.8.: „die
// Gebäude sind hellgraue raw models ohne Farbe/Textur…?" — richtig, und der Grund ist eine
// gebrochene Referenz). Gemessen am geladenen GLB: das Material des Schlosses heißt `colormap`,
// Farbe #ffffff, **map: null**. Die GLB-Dateien des Hexagon-Kits liegen im Repo FLACH in
// `GLB_hexagon_kit/`, ihre Texturreferenz zeigt aber auf `Textures/colormap.png` relativ zum
// Modell — dort ist nichts. Der Atlas des Kits liegt beim Import eine Ebene höher gelandet:
// `GLB format/Textures/colormap.png`. Die UVs im Modell sind korrekt, es fehlte nur das Bild.
//
// Das Nature-Kit braucht nichts davon: seine Modelle tragen pro Teil ein eigenes Farbmaterial
// (`woodBark`, `leafsGreen`) — deshalb waren die Bäume von Anfang an bunt und die Gebäude nicht.
const PACK_ATLAS = {
  GLB_hexagon_kit: RAW3D + 'GLB format/Textures/colormap.png',
  GLB_graveyard: RAW3D + 'GLB_graveyard/Textures/colormap.png',
  GLB_pirate: RAW3D + 'GLB_pirate/Textures/colormap.png',
  'GLB_cube-pets': RAW3D + 'GLB_cube-pets/Textures/colormap.png',
};

// **Surreale Umgebungs-Props** (Georg, 29.8.: „KFB ist absurd und surreal — aber mit Logik unter
// der Haube"). Die Auswahl ist GEMESSEN, nicht gesammelt: jedes Modell wurde geladen und auf drei
// Dinge geprüft — Farbe je Materialteil (die tinyskies-Logik), Dreieckszahl, Höhe.
//
// Aufgenommen (Messwerte vom 29.8.):
//   `jerryblessed-book-4923`      10 Teile, 9 farbig, **120 Dreiecke** — ein Buch, spottbillig
//   `OpenBook_FrizzleBobFractalAlmanac_01`  2 Teile farbig, 464 — KFB-Kanon, der Almanach selbst
//   `KFB_Crown_01`                2 farbig, 840
//   `KFB_Coin_01`                 1 farbig, 396 — als STEHENDE Münze ein Wahrzeichen
//   `quaternius_cc0-table-1411`   2 farbig, 1500
//   `palm-detailed-straight`      1 Teil, 482 (GLB_pirate, Kit-Farbe)
//   `barrel` / `cross-wood`       148 / 126 (Pirate / Graveyard)
//   `arunangshubanerjee-dice-4550` weiß, 2300 — aufgenommen mit Palettenfarbe, weil Würfel Kanon sind
//
// Verworfen, mit Grund: `pixellabs-dead-tree` **49.950 Dreiecke**, `pixellabs-knife` 50.000,
// `pixellabs-stairs` 50.000 (je 30–400× zu teuer für ein Streu-Prop), `plaggy_cc0-scissors`
// (weiß UND 1264 Dreiecke — die Schere kommt wieder, wenn sie eine Farbe hat),
// `signpost` (weiß, braucht den Survival-Atlas, den das Repo nicht hat).
//
// Maßstab ist Absicht: ein Buch von 0,13 Weltmaß ist neben einem 0,075 breiten Pet ein GEBÄUDE.
// Genau das ist der Witz — die Welt ist eine Schreibtischplatte, über die man fliegt.
// ⚠ **`fit` ist der Grund, warum hier riesige dunkle Platten herumlagen** (Georg, 29.8.).
// Gemessen: Buch 0,16×0,03×0,23 (Breite/Höhe **6,6**), Almanach 6,9, Tisch 3,4. Auf die HöHE
// normiert wird ein Buch von 0,13 Höhe damit **0,69×0,99 groß** — eine Platte, kein Requisit.
// `prop-scatter.js` macht es richtig und heißt die Regel `TARGET_FP`: flache Dinge werden auf
// ihre GRUNDFLÄCHE normiert, hohe auf ihre Höhe. `fit: 'fp'` wählt das aus, `h` ist dann das
// Zielmaß der Grundfläche.
//
// Verworfen (fail fast): `quaternius_cc0-table-1411` — beide Materialien liegen bei Helligkeit
// 0,09/0,11, also **100 % dunkel**; mit unserer Albedo-Dämpfung wird daraus ein schwarzer Klotz.
// Ein Modell, das nur durch Aufhellen funktioniert, ist kein Fund, sondern Arbeit.
export const SURREAL = [
  // ⚠ **Beide Bücher sind hier ENTFERNT** (Georg, 1.9.: „dann würde ich beide Bücher rausnehmen").
  // Sie standen mit Gewicht **14** (`jerryblessed-book-4923`) und **8**
  // (`OpenBook_FrizzleBobFractalAlmanac_01`) im Satz, zusammen 22 von 59 — **37 % aller surrealen
  // Props waren Bücher.** Das erklärt den Eindruck ohne jede Messung am Modell: nicht ein Buch hat
  // gestört, sondern seine Häufigkeit.
  // Georgs Ansage zum Ersatz: „Gewicht auf Pflanzen umlegen". Umgesetzt als Zahl, nicht als
  // Gefühl: **die Summe bleibt 59.** Die 22 freien Punkte plus 4, die von
  // `palm-detailed-straight` abgegeben werden (12 → 8, sonst wäre jedes dritte Prop eine Palme),
  // gehen an neun Pflanzen. Damit ändert sich der Anteil von Münze, Fass und Kreuz **nicht** —
  // ein Satz, dessen Gesamtgewicht man beim Tauschen anfasst, verschiebt heimlich alles andere
  // mit (Lehre BUG-05).
  //
  // ⚠ **Diese neun sind NICHT am Modell gemessen** — anders als die Auswahl vom 29.8. Sie stehen
  // im `asset-repo.json` mit `ghUrl`, ihr Pack trägt Materialfarben (Nature-Kit) bzw. einen Atlas
  // (GLB_pirate), und das ist alles, was geprüft ist. Dreieckszahl, Hüllmaß und Farbe je Teil sind
  // **ungeprüft** (E-30). Die Torzeile `Plant set (Georg 1.9.)` liest sie nach dem Laden aus der
  // Szene aus, statt sie hier zu behaupten.
  // ⚠ **Die stehende Riesenmünze ist hier RAUS — und woanders WIEDER DA** (Georg, 3.9.).
  // Sie stand seit 29.8. mit Gewicht 7 als Wahrzeichen: „der Witz ist die Größe". Der Witz hat
  // funktioniert, solange sie allein stand; als grau-brauner Klotz neben gebauter Vegetation liest
  // sie nicht mehr als Gag, sondern als Rest. **Ein Asset, das seine Rolle verloren hat, wird
  // nicht kleiner gemacht — es bekommt eine andere:** klein, golden, drehend, im Flug einsammelbar
  // (muenzen.js, +1 Pop). Das ist keine Streichung, sondern ein Rollenwechsel, und deshalb steht
  // er hier und nicht in einem Changelog.
  // Georg, 29.8.: „die krone sollte aus" — raus statt umgefärbt. Ein Modell, dessen Material
  // nicht trägt, wird nicht nachlackiert, es wird abgewählt (die 840 Dreiecke waren dafür auch
  // der teuerste Posten der Gruppe). Das Zitat bleibt im Katalog oben stehen, damit klar ist,
  // dass es das Asset gibt und wir es kennen.
  { name: 'palm-detailed-straight', kind: 'tree', vorher: 0.17, w: 8 },
  // ── Palmen (Georg hat sie ausdrücklich genannt) · GLB_pirate, Kit-Atlas ──────────────
  { name: 'palm-bend', kind: 'tree', vorher: 0.16, w: 3 },
  { name: 'palm-straight', kind: 'tree', vorher: 0.15, w: 3 },
  { name: 'palm-detailed-bend', kind: 'tree', vorher: 0.17, w: 2 },
  // ── Reale Pflanzen · kenney_nature-kit, Materialfarben je Teil ────────────────────────
  // Kaktus, Blumen: kit-treu. Die Blumen (0,24 m) landen unter dem Sichtbarkeitsboden und werden
  // von IHM angehoben — nicht mehr von drei einzeln geratenen Zahlen.
  { name: 'cactus_tall', kind: 'tree', vorher: 0.10, w: 3 },
  { name: 'flower_redC', kind: 'small', vorher: 0.030, w: 3 },
  { name: 'flower_yellowB', kind: 'small', vorher: 0.028, w: 3 },
  { name: 'flower_purpleA', kind: 'small', vorher: 0.032, w: 3 },
  // ── Surreal, und der Grund ist der MASSSTAB, nicht das Modell ─────────────────────────
  // Ein Pilz, der so hoch wird wie eine Palme, und Bambus als Einzelhalm neben einer stehenden
  // Münze: die Modelle sind gewöhnlich, die Größenverhältnisse nicht. Das ist billiger und
  // verlässlicher als ein surreales Asset zu suchen — und es ist genau der Witz der Welt
  // („eine Schreibtischplatte, über die man fliegt").
  // ⚠ **Hier stand `mushroom_redTall`, und das Tor hat es rausgeworfen — gemessen, nicht geahnt:**
  // 48 Dreiecke, 2 Teile, **0 von 2 farbig auf allen drei Wegen** (keine `map`, keine Vertexfarben,
  // Material über 0xf0f0f0). In der Welt wäre das ein weißer Klumpen. Nach der Regel vom 29.8.
  // („ein Modell, das nur durch Aufhellen funktioniert, ist kein Fund, sondern Arbeit") wird es
  // abgewählt, nicht mit `col:` übermalt.
  // Der Witz war ohnehin die GRÖSSE, nicht das Modell: also dasselbe Vorhaben mit dem Pilz, der
  // seit dem 29.8. in der Streuung farbig steht — nur bei 0,095 statt 0,020 Weltmaß, also so hoch
  // wie eine Palme. **Ein bewährtes Modell in unerwarteter Größe ist billiger als ein neues Modell
  // in erwarteter.**
  { name: 'mushroom_redGroup', kind: 'tree', h: 0.095, w: 4,
    grund: 'Pilz in Palmenhöhe — surreal per Maßstab, siehe oben' },
  { name: 'crops_bambooStageB', kind: 'tree', h: 0.13, w: 2,
    grund: 'Bambus als Einzelhalm in Baumhöhe — surreal per Maßstab' },
  // Georg, 29.8.: „die Fässer sind viel zu groß". Damals von Hand auf 0,028 gesetzt — das war
  // −44 % gegen die Kit-Proportion (Fass 29 % der Palme beim Designer, 16 % bei uns). Jetzt
  // kit-treu: 1,23 m → 0,054 u. **Wenn das wieder zu groß wirkt, wird es eine Ausnahme mit Grund**
  // — aber erst nach dem Sehen, nicht vorher aus Erinnerung. Das Tor meldet die Bewegung.
  { name: 'barrel', kind: 'rock', h: 0.028, w: 10,
    grund: 'Georg, 29.8.: „die Fässer sind viel zu groß" — sein Auge schlägt die Kit-Proportion' },
  { name: 'cross-wood', kind: 'rock', vorher: 0.07, w: 8 },   // Graveyard-Kit, eigener Faktor, Eichpunkt
  // ⚠ **`arunangshubanerjee-dice-4550` ist hier ENTFERNT** (Georg, 29.8.: „der große rote Würfel
  // (IM TERRAIN noch) muss dann auch wie die anderen 3 Würfel wie der GELBE eingebaut und verteilt
  // werden").
  // Gemessen: er stand als Landmarke in `globe-landmarks` mit Hüllmaß **8,425** und steckte im
  // Gelände, während die drei echten Würfel korrekt 0,131–0,191 über Grund schweben.
  //
  // Zwei Gründe, ihn nicht zu reparieren, sondern hier zu streichen:
  //  1. **Ein Würfel ist ein PICKUP, kein Bühnenbild.** Georgs eigene Kollisionsregel sagt
  //     „Würfel und Karten sind Kollisions- und Pickup-Ziele". Ein unbeweglicher Würfel im Boden
  //     lehrt den Spieler das Gegenteil — und das ist schlimmer als ein fehlendes Prop.
  //  2. Georgs Prop-Liste hat ihn selbst markiert: „Grundfläche 0,0 — ein Modell ohne Maße,
  //     überspringen". Ich habe das gelesen, notiert und trotzdem im Satz gelassen.
  //
  // Würfel gehören zu `sky-dice.js`: dort sind Weltverankerung, Höhenband über Grund, Schweben,
  // Trefferfenster und Wurf-Reaktion bereits gebaut. Und mit den RPG-Würfeln (reine Geometrie,
  // Form = Typ) wird dieses GLB ohnehin überflüssig.
];

// ⚠ **v12 · Die zweite Pflanzenschicht, gefunden bei der Abnahme und nicht beim Schreiben.**
// Als die Vegetation nach TS-Art gebaut war, habe ich `flora.js` heruntergedreht und im Panel
// notiert, die Kits stünden ab jetzt nur noch als Kombi-Module. **Das war falsch, und das Bild hat
// es sofort widerlegt:** DIESE Datei streut seit v3 unabhängig davon 1 197 Kit-Pflanzen über die
// Kugel — `tree_default` 206, `tree_pineTallA` 163, `tree_thin` 97, `plant_bushDetailed` 129, dazu
// Palmen, Blumen, Kaktus. Alle MeshLambert, ohne AO, ohne Saum, ohne Wind, Laubton #499c91 (teal)
// gegen die neuen #38623a. Neben einem prozeduralen Baum sieht das SCHLECHTER aus als in v11 —
// weil jetzt eine richtige Referenz danebensteht.
// **Die Lehre ist nicht „eine Datei übersehen", sondern: wer eine Klasse ablöst, muss nach allen
// ihren Quellen suchen, nicht nach der, die er gerade in der Hand hat.** Eine Zusage im Panel, die
// nur für eine von zwei Schichten gilt, ist keine halbe Zusage — sie ist eine falsche.
//
// Gefiltert wird nach NAMEN, nicht nach `kind`: `kind:'tree'` tragen auch Bambus und Riesenpilz,
// und die sind Blickfang per Maßstab, nicht Bewuchs. Felsen, Fässer, Münzen, Kreuze, Gebäude,
// Tische bleiben unberührt — sie waren nie das Problem.
export const KIT_PFLANZEN = ['tree_default', 'tree_pineTallA', 'tree_thin', 'plant_bushDetailed',
                             'mushroom_redGroup', 'cactus_tall',
                             'flower_redC', 'flower_yellowB', 'flower_purpleA'];
// Ausdrücklich NICHT gefiltert, und jedes mit Grund:
//   palm-* …………………… Küsten-Blickfang mit eigener Silhouette, 40 surreale Plätze weltweit
//   mushroom_redGroup (SURREAL, h 0,095) … Pilz in Palmenhöhe — der Witz ist der Maßstab
//   crops_bambooStageB ………… Einzelhalm in Baumhöhe — derselbe Witz
// Der Riesenpilz steht deshalb im Filter (STREU, 0,020 u = Bewuchs) UND daneben im surrealen Satz
// (0,095 u = Blickfang). Dasselbe Modell, zwei Rollen — getrennt über die HÖHE, nicht den Namen:
// gefiltert wird nur der Satz, in dem es Bodendeckung ist.
const OHNE_PFLANZEN = (satz, ausser) => satz.filter((d) => !KIT_PFLANZEN.includes(d.name)
                                                        || (ausser || []).includes(d.name));
const gewicht = (satz) => satz.reduce((a, d) => a + d.w, 0);

// ⚠ **Und der zweite Teil derselben Lehre, wieder bei der Abnahme gefunden:** einen Eintrag aus
// einem GEWICHTETEN Satz zu nehmen entfernt seine Plätze nicht — es verteilt sie um. Nach dem
// Pflanzenfilter blieb in STREU genau EIN Eintrag übrig (`rock_tallA`, vorher 9 von 72 Gewicht =
// 12,5 % ≈ 90 Stück), und `waehlen()` gab ihm alle 720 Plätze: **720 identische Felsen, achtmal
// so viele wie vorher, eine einzige Silhouette.** Genau wovor Zeile 41 dieser Datei warnt.
// Die Zielzahl muss dem SATZ folgen, sonst ist sie eine Zahl über einen Satz, den es nicht mehr
// gibt. Satz und Zielzahl werden deshalb an EINER Stelle entschieden (gleich unter `P`), nicht
// die eine im Bauf und die andere im Abschluss — sonst tritt der Nächste in dieselbe Falle.

export function createGlobeLandmarks(opts = {}) {
  const THREE = opts.THREE;
  const R = opts.radius, seed = opts.seed, terrainType = opts.terrainType;
  const P = Object.assign({
    // v12 · `false` nimmt die KIT-PFLANZEN aus beiden Sätzen (die Fläche baut ts-flora.js).
    // `?kits=1` stellt sie wieder her — das ist der Vergleich nebeneinander, nicht ein Rest.
    pflanzen: false,
    // v12 · Die grau-braunen Bauten. `false` lässt ihre STANDORTE LEER, statt die übrigen Modelle
    // nachrücken zu lassen — die Lehre aus dem Felsen-Fehler von heute Nachmittag: einen Eintrag
    // aus einem gewichteten Satz zu nehmen entfernt seine Plätze nicht, es verteilt sie um. 26
    // identische Zaubertürme wären schlimmer als vier Erdtöne. Ein leerer Bauplatz ist eine
    // Lichtung; ein Wahrzeichen-Satz aus EINER Silhouette ist keine Orientierung mehr.
    graubraun: false,
    streu: 720,        // ZIEL-Zahl gesetzter Streu-Props (nicht Kandidaten)
    surreal: 40,       // Ziel-Zahl surrealer Umgebungs-Props — sparsam, sie sollen auffallen
    marken: 26,        // Ziel-Zahl Landmarken
    ueberzeichnung: 14, // so viele Kandidaten je Ziel-Prop — auf einer Ozeanwelt sind 90 % der
                        // Gitterpunkte Wasser. Die Schleife bricht ab, sobald das Ziel steht,
                        // also kostet die Reserve nur dort, wo sie gebraucht wird.
    jitter: 0.55,      // wie stark die Punkte aus dem Gitter wandern (0 = starres Gitter)
    // v16/L3d-Lehre übernommen: die Streuung ist eine ZAHL je Exemplar, nicht ein Zufall je Bild.
    scaleVar: 0.28,    // Größenstreuung je Exemplar
    // **Fuß in den Boden setzen** (aus `prop-scatter.js`, dort `sink: 0.05`). Die Kenney-Modelle
    // haben flache Sockel, unser Boden ist facettiert: ein Sockel auf einer Kante steht frei
    // heraus. Ein Anteil der Höhe unter die Oberfläche ist die billige Hälfte der Lösung; die
    // andere sind echte Zonen (siehe Living-Dokument, Sprint S3a).
    sink: 0.14,
    // **Steile Stellen werden verworfen.** Gemessen wird die Neigung aus VIER Nachbarproben
    // derselben Funktion, die die Flugphysik liest — keine zweite Höhenquelle.
    maxSlope: 0.45,    // ≈ 24°
    // **Albedo-Dämpfung.** Die Kenney-GLBs bringen `MeshStandardMaterial` mit hellen Grundfarben;
    // die Szene fährt SIEBEN Lichter mit Intensitätssumme ≈ 13 und **kein Tonemapping** (so steht
    // es in der Quelle). Physikalisch korrekt gerechnet ergibt das Weiß — genau Georgs Befund vom
    // 29.8. Der Boden entgeht dem nur, weil seine Vertex-Farben für dieses Licht gerät sind.
    // Also wird die Grundfarbe gedämpft (und das Material auf Lambert gestellt: kein Glanzlicht,
    // das zusätzlich aufreisst). Regelbar im Panel.
    albedo: 0.42,
    // v3/S3b · Verbiegung: 0 = Originalform, 1 = die Grenzwerte der Modellart (LIMITS).
    deformMix: 1,
    on: true,
  }, opts.params || {});

  // v12 · EIN Ort für „welcher Satz" UND „wie viele Plätze" — siehe die Warnung oben.
  const STREU_AKT = P.pflanzen ? STREU : OHNE_PFLANZEN(STREU);
  // Im surrealen Satz bleiben Riesenpilz und Bambus: dort sind sie Blickfang per Maßstab.
  const SURREAL_AKT = P.pflanzen ? SURREAL : OHNE_PFLANZEN(SURREAL, ['mushroom_redGroup']);
  const anteil = (akt, voll) => gewicht(akt) / Math.max(1, gewicht(voll));
  const streuZiel = Math.round(P.streu * anteil(STREU_AKT, STREU));
  const surrealZiel = Math.round(P.surreal * anteil(SURREAL_AKT, SURREAL));

  const group = new THREE.Group();
  group.name = 'globe-landmarks';
  let stand = 'lädt …', gesetzt = 0, verworfen = 0, modelle = 0, zuSteil = 0, zonen = 0, markenLeer = 0;
  /** name → { stand, exemplare, dreiecke, teile, farbig, hoehe, breite } · gefüllt beim Laden. */
  const protokoll = new Map();
  const mats = [];   // für den Albedo-Regler
  const verbieger = [];   // ein Handle je Teil — für Mix, Atem und die Uhr

  const _Y = new THREE.Vector3(0, 1, 0);
  const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion();
  const _p = new THREE.Vector3(), _s = new THREE.Vector3(), _M = new THREE.Matrix4();

  /** Streu-Standorte: dieselbe Planung wie die Landmarken, nur mit der ZONIERTEN Höhe — ein
   *  Baum am Rand eines Bauplatzes soll auf dem Bauplatz stehen, nicht im Rauschen darunter. */
  function streuOrte() {
    const s = planSites({
      THREE, radius: R, seed, terrainType, count: streuZiel, salt: 4711,
      maxSlope: P.maxSlope, jitter: P.jitter, overdraw: P.ueberzeichnung, scaleVar: P.scaleVar,
      altFn: (x, y, z) => surfaceAltitudeAt(seed, terrainType, x, y, z),
    });
    verworfen += s.stats.imWasser; zuSteil += s.stats.zuSteil;
    return s;
  }

  /** Weltmatrix eines Standorts: lokale +Y auf die Flächennormale, dann Kurs um die Normale. */
  function siteMatrix(site, skala, senkung, out) {
    _q.setFromUnitVectors(_Y, site.n);
    _q2.setFromAxisAngle(site.n, site.yaw);
    _q.premultiply(_q2);
    _p.copy(site.n).multiplyScalar(R + site.alt - senkung);
    _s.setScalar(skala);
    return out.compose(_p, _q, _s);
  }

  /** Kenney-Material → Lambert mit gedämpfter Grundfarbe. Textur und Vertex-Farben bleiben.
   *  ⚠ **Der Atlas darf nur auf Netze mit UVs.** Gemessen 29.8.: die Hexagon-Kit-GLBs tragen NUR
   *  `position` und `normal` — kein `uv`. Ein Material mit `map` tastet dann bei (0,0) ab, und
   *  dort ist die Ecke des Atlas schwarz: genau Georgs „die Gebäude sind jetzt schwarz". Ohne UVs
   *  gibt es also KEINE Textur, sondern die Materialfarbe — und das ist ehrlicher als Schwarz. */
  function zaehmen(m, atlas, hatUV, ersatzFarbe, kind, hatAO) {
    const basis = m.color ? m.color.clone() : new THREE.Color(0xffffff);
    // Ein weißes Material OHNE UVs kann nichts tragen — dann gilt die Modellfarbe aus der Tabelle.
    if (!hatUV && ersatzFarbe != null && basis.getHex() > 0xf0f0f0) basis.setHex(ersatzFarbe);
    // Und fast-schwarze Materialien werden gehoben: mit Albedo 0,42 wären sie im Bild ein Loch.
    // Die Grenze 0,18 ist gemessen (Tisch 0,09/0,11 = verworfen, Buchrücken 0,09 = gehoben).
    { const hsl = {}; basis.getHSL(hsl);
      if (hsl.l < 0.18) basis.setHSL(hsl.h, Math.min(0.5, hsl.s + 0.05), 0.28); }
    const map = m.map || (hatUV ? atlas : null) || null;
    const lam = new THREE.MeshLambertMaterial({
      // `hatAO` schaltet die Vertexfarben ein — ohne das wäre das gebackene AO im Puffer und
      // unsichtbar, also der teuerste Kommentar des Projekts.
      map, color: basis.clone(), vertexColors: !!m.vertexColors || !!hatAO,
      transparent: !!m.transparent, opacity: m.opacity != null ? m.opacity : 1,
      side: m.side, fog: true, flatShading: false,
    });
    lam.userData.basisFarbe = basis;
    lam.color.copy(basis).multiplyScalar(P.albedo);
    // Der Rim, mit der Stärke der Quelle je Objektklasse. Die FARBE kommt aus `globalRimColor` —
    // das ist der geteilte Fresnel-Ton, den der Tag/Nacht-Zyklus führt (`RimLight.ts`: „Shared
    // Fresnel tint for all addRimLight meshes"). Ein Objekt-Rim, der seine eigene Farbe mitbringt,
    // wäre ein zweiter Schreiber für die Tageszeit.
    addRimLight(lam, null, aoFuer(kind).rim, 3.0);
    mats.push(lam);
    return lam;
  }

  /** Atlas eines Packs — einmal geladen, von allen Modellen des Packs geteilt. */
  const atlasCache = new Map();
  function atlasVon(pack) {
    const url = PACK_ATLAS[pack];
    if (!url) return null;
    if (atlasCache.has(pack)) return atlasCache.get(pack);
    const t = new THREE.TextureLoader().load(url);
    // glTF-UVs haben ihren Ursprung oben links — deshalb `flipY = false`, genau wie GLTFLoader
    // es für eingebettete Texturen tut. NEAREST, weil der Atlas aus FLACHEN Farbfeldern besteht:
    // gefiltert würden benachbarte Felder ineinanderlaufen und einem Turm ein falsches Dach geben.
    t.flipY = false;
    t.colorSpace = THREE.SRGBColorSpace;
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    atlasCache.set(pack, t);
    return t;
  }

  async function bauen() {
    let index = null;
    for (const url of ['./asset-repo.json', '../asset-repo.json']) {
      // ⚠ Kein `new URL(..., import.meta.url)` — genau diese Zeile ist in `travel-audio.js`
      // beim Bündeln synchron geworfen (blob:-Basis, 28.8.). Relative Adressen und try, sonst
      // nichts.
      try {
        const r = await fetch(url);
        if (r.ok) { index = await r.json(); break; }
      } catch (e) {}
    }
    if (!index || !index.assets) { stand = 'asset-repo.json nicht lesbar — keine Props'; return; }

    const byName = new Map();
    for (const a of index.assets) if (!byName.has(a.name)) byName.set(a.name, a);

    const loaderMod = await import('three/addons/loaders/GLTFLoader.js');
    const loader = new loaderMod.GLTFLoader();

    async function gruppe(set, sites, salt) {
      // Standorte auf Modelle verteilen, DANN je Modell einmal laden. Hat ein Standort schon sein
      // Modell (Landmarken: die Zonenplanung brauchte die Höhe vorher), bleibt es dabei.
      const nach = new Map();
      for (const s of sites) {
        const pick = s.def || waehlen(set, s.pick);
        s.def = pick;
        if (!nach.has(pick.name)) nach.set(pick.name, { def: pick, list: [] });
        nach.get(pick.name).list.push(s);
      }
      for (const [name, eintrag] of nach) {
        const asset = byName.get(name);
        if (!asset) { console.warn('[landmarks] nicht im Index:', name);
                      protokoll.set(name, { stand: 'nicht im Index', exemplare: eintrag.list.length }); continue; }
        let gltf;
        try {
          gltf = await new Promise((res, rej) => loader.load(asset.ghUrl, res, undefined, rej));
        } catch (e) { console.warn('[landmarks] nicht ladbar:', name, e && e.message);
                      protokoll.set(name, { stand: 'nicht ladbar', exemplare: eintrag.list.length }); continue; }
        const root = gltf.scene;
        root.updateWorldMatrix(true, true);
        // Auf Zielhöhe normieren und am FUSS verankern: die Kenney-Modelle stehen auf y = 0,
        // aber nicht alle — Box3 sagt es, statt es anzunehmen.
        const bb = new THREE.Box3().setFromObject(root);
        const size = bb.getSize(new THREE.Vector3());
        const flach = Math.max(size.x, size.z) / Math.max(1e-4, size.y);
        // Auf die Grundfläche normieren, wenn die Tabelle es sagt ODER das Modell flacher als
        // 1,8:1 ist — sonst wird jedes liegende Ding zur Platte (Befund 29.8.).
        const nachFP = eintrag.def.fit === 'fp' || flach > 1.8;
        const bezug = nachFP ? Math.max(size.x, size.z) : size.y;
        // v10 · Die Welthöhe kommt aus dem Kit-Maßstab, nicht aus einer Handzahl je Modell.
        // `hWelt` wird am Eintrag abgelegt — die Senkung unten und das Protokoll lesen sie von dort.
        const wh = weltHoehe(eintrag.def, asset.pack, bezug);
        eintrag.def.hWelt = wh.h; eintrag.def.hWeg = wh.weg;
        if (wh.weg === 'ohne-kit') console.warn('[landmarks] Pack ohne Kit-Faktor:', asset.pack, '→', name);
        const norm = wh.h / Math.max(1e-4, bezug);
        const normM = new THREE.Matrix4()
          .makeTranslation(0, -bb.min.y * norm, 0)
          .multiply(new THREE.Matrix4().makeScale(norm, norm, norm));

        const teile = [];
        root.traverse((n) => { if (n.isMesh) teile.push(n); });

        // ⚠ **Die Teil-Transformation wird in die GEOMETRIE gebacken** (Lehre aus dem Verbieger
        // und aus `prop-scatter.js`): erst dann liegen alle Vertices eines Props in EINEM Raum,
        // und erst dann kann eine gemeinsame Box das `t` der Verbiegung definieren. Vorher
        // steckte die Teil-Matrix in der Instanzmatrix — bequem, aber der Verbieger hätte je Teil
        // eine eigene Mitte und Höhe gerechnet, und das Prop wäre auseinandergefallen.
        const gebacken = [];
        const propBox = new THREE.Box3();
        const atlas = atlasVon(asset.pack);
        let ringeProp = 0;
        for (const teil of teile) {
          const basis = new THREE.Matrix4().copy(normM).multiply(teil.matrixWorld);
          const g = teil.geometry.clone();
          g.applyMatrix4(basis);
          g.computeBoundingBox();
          propBox.union(g.boundingBox);
          gebacken.push({ teil, g });
        }
        for (const e of gebacken) ringeProp = Math.max(ringeProp, ringsAlongYSafe(e.g));

        let geteilt = null;
        for (const { teil, g } of gebacken) {
          const hatUV = !!g.getAttribute('uv');
          // AO ZUERST — es schreibt die Vertexfarben, und das Material muss wissen, ob es sie
          // lesen soll. Umgekehrte Reihenfolge wäre ein Puffer ohne Leser.
          const kind = eintrag.def.kind || 'build';
          const hatAO = aoBacken(THREE, g, propBox, kind);
          const mat = Array.isArray(teil.material)
            ? teil.material.map((m) => zaehmen(m, atlas, hatUV, eintrag.def.col, kind, hatAO))
            : zaehmen(teil.material, atlas, hatUV, eintrag.def.col, kind, hatAO);
          const inst = new THREE.InstancedMesh(g, mat, eintrag.list.length);
          inst.name = 'prop-' + name + '-' + teil.name;
          inst.castShadow = false; inst.receiveShadow = false;
          for (let i = 0; i < eintrag.list.length; i++) {
            const s = eintrag.list[i];
            siteMatrix(s, s.sc, eintrag.def.hWelt * s.sc * P.sink, _M);
            inst.setMatrixAt(i, _M);
          }
          inst.instanceMatrix.needsUpdate = true;
          inst.computeBoundingSphere();
          group.add(inst);
          // Ein Prop, EINE Form: alle Teile teilen Attribute und die Biegbarkeits-Entscheidung.
          try {
            const h = attachInstancedDeform(THREE, inst, {
              bounds: propBox, count: eintrag.list.length,
              seed: (seed | 0) + salt + name.length * 7,
              limits: LIMITS[eintrag.def.kind] || LIMITS.tree,
              ringsProp: ringeProp, shared: geteilt,
              mix: P.deformMix,
            });
            if (!geteilt) geteilt = h.attrs;
            verbieger.push(h);
          } catch (e2) { console.warn('[landmarks] Verbieger nicht angehängt:', name, e2 && e2.message); }
        }
        modelle++;
        gesetzt += eintrag.list.length;
        // ⚠ **Was GELADEN ist, wird abgelesen — nicht was ausgewählt wurde.** Die neun Pflanzen vom
        // 1.9. sind aus dem Index übernommen, ohne dass ein Modell dabei geöffnet wurde (E-30:
        // „ungeprüft" ist ein zulässiges Urteil). Hier steht die Messung, die das auflöst: Dreiecke,
        // Hüllmaß, Anteil farbiger Teile — je Modell, aus der fertig gebauten Szene.
        { let tri = 0, teileZahl = 0, farbig = 0;
          for (const t of teile) {
            teileZahl++;
            const g = t.geometry;
            if (g) tri += (g.index ? g.index.count : (g.attributes.position ? g.attributes.position.count : 0)) / 3;
            // ⚠ **Erste Fassung fragte `material.color` — und das ist bei uns nie die Farbe.**
            // Sie meldete für drei Palmen „0/1 farbig", während `palm-detailed-straight` aus
            // DEMSELBEN Pack seit dem 29.8. bunt in der Welt steht. Ein Tor, das ein laufendes
            // Asset für kaputt erklärt, hat sich selbst widerlegt — und die Ursache waren zwei
            // Wege, auf denen Farbe hier ankommt, und `material.color` ist keiner davon:
            //   · **Atlas** (GLB_pirate, Hexagon-Kit): Farbe steckt in der `map`, `color` ist weiß.
            //   · **Fake-AO-Bake** (§05w): dieses Modul schreibt die Farbe in VERTEXFARBEN und lässt
            //     `material.color` weiß stehen — sonst multiplizierte es zweimal.
            // Also war die Zahl für JEDES Modell bedeutungslos; dass vier durchfielen und fünf nicht,
            // war Zufall der Ladereihenfolge. Geprüft wird jetzt, wo Farbe wirklich liegt.
            const m = t.material;
            const hatMap = !!(m && m.map);
            const hatVertexfarben = !!(g && g.attributes && g.attributes.color);
            const hatEigenfarbe = !!(m && m.color && m.color.getHex() < 0xf0f0f0);
            if (hatMap || hatVertexfarben || hatEigenfarbe) farbig++;
          }
          protokoll.set(name, { stand: 'geladen', exemplare: eintrag.list.length,
            dreiecke: Math.round(tri), teile: teileZahl, farbig,
            // ⚠ Rohmaß des Modells, NICHT das Weltmaß: normiert wird danach auf `def.h`. Die erste
            // Fassung nannte das „4,25 u tall" und hätte einen Leser glauben lassen, hier stehe eine
            // Palme so hoch wie das halbe Terrain.
            // ⚠ `farbig` ist hier die Farbigkeit des GELADENEN glTF und deshalb für das Urteil
            // unbrauchbar (die Farbe entsteht erst beim Backen). Das Tor zählt in der Szene.
            rohHoehe: +size.y.toFixed(2), zielHoehe: wh.h, weg: wh.weg, grund: wh.grund,
            pack: asset.pack, vorher: eintrag.def.vorher != null ? eintrag.def.vorher : null }); }
      }
    }

    const streu = streuOrte();
    const surrealOrte = planSites({
      THREE, radius: R, seed, terrainType, count: surrealZiel, salt: 8123,
      maxSlope: P.maxSlope, jitter: P.jitter, overdraw: P.ueberzeichnung, scaleVar: 0.34,
      altFn: (x, y, z) => surfaceAltitudeAt(seed, terrainType, x, y, z),
    });
    const markenListe = (opts.markenSites && opts.markenSites.length)
      ? opts.markenSites
      : assignMarken(planSites({ THREE, radius: R, seed, terrainType, count: P.marken, salt: 991,
                                maxSlope: P.maxSlope, overdraw: P.ueberzeichnung }));
    await gruppe(STREU_AKT, streu, 4711);
    await gruppe(SURREAL_AKT, surrealOrte, 8123);
    // Standorte, deren zugewiesenes Modell abgewählt ist, bleiben unbebaut (siehe `graubraun`).
    const markenGebaut = P.graubraun ? markenListe
      : markenListe.filter((s) => !s.def || !s.def.graubraun);
    markenLeer = markenListe.length - markenGebaut.length;
    await gruppe(MARKEN, markenGebaut, 991);
    zonen = markenListe.filter((s) => s.zone).length;
    stand = modelle + ' Modelle · ' + gesetzt + ' Exemplare · ' + group.children.length + ' Draw-Calls'
      + (markenLeer ? ' · ' + markenLeer + ' Bauplätze leer (grau-braune Bauten abgewählt)' : '');
    console.info('[landmarks] ' + stand);
  }

  bauen().catch((e) => { stand = 'Fehler: ' + (e && e.message || e); console.warn('[landmarks]', e); });

  return {
    name: 'globe-landmarks', group, params: P,
    get enabled() { return P.on; },
    setEnabled(on) { P.on = !!on; group.visible = !!on; },
    get status() { return stand; },
    /** Grundhelligkeit der Props — der Regler gegen das Überstrahlen. */
    /** ⚠ **Die durchfallbare Zahl für AO und Rim.** Beides ist unsichtbar im Code-Sinn: ein
     *  Vertexfarben-Puffer ohne `vertexColors: true` und ein `onBeforeCompile`, das nie kompiliert
     *  wird, melden nichts. Diese Probe zählt Materialien MIT gelesenen Vertexfarben und
     *  Instanzen mit einem Farb-Attribut, und nennt die Spanne des gebackenen AO — ist die 1 bis 1,
     *  wurde nichts verdunkelt. */
    aoProbe() {
      let mitVC = 0, ohneVC = 0, mitAttr = 0, ohneAttr = 0, min = 1, max = 0;
      for (const mm of mats) { if (mm.vertexColors) mitVC++; else ohneVC++; }
      group.traverse((o) => {
        if (!o.isMesh) return;
        const a = o.geometry.getAttribute('color');
        if (!a) { ohneAttr++; return; }
        mitAttr++;
        for (let i = 0; i < a.count; i += 11) {
          const v = a.getX(i); if (v < min) min = v; if (v > max) max = v;
        }
      });
      return { materialienMitVertexfarben: mitVC, ohne: ohneVC,
               instanzenMitFarbAttribut: mitAttr, ohneAttribut: ohneAttr,
               aoSpanne: [+min.toFixed(3), +max.toFixed(3)],
               ok: mitVC > 0 && mitAttr > 0 && min < 0.5 };
    },
    setAlbedo(v) {
      P.albedo = Math.max(0.05, Math.min(1.5, v));
      for (const m of mats) { m.color.copy(m.userData.basisFarbe).multiplyScalar(P.albedo); }
    },
    get albedo() { return P.albedo; },
    /** Verbiegung: 0 = Originalform, 1 = volle Grenzwerte der Modellart. */
    setDeform(v) { P.deformMix = Math.max(0, Math.min(1, v)); for (const h of verbieger) h.setMix(P.deformMix); },
    get deform() { return P.deformMix; },
    /** Atem (Squash & Stretch). 0 = still; die Phase steckt je Exemplar im Attribut. */
    setBreath(v) { P.atem = Math.max(0, v); for (const h of verbieger) h.setSquash(v); },
    get breath() { return verbieger.length ? verbieger[0].squash : 0; },
    /** EINE Uhr für alle Props — nur nötig, wenn Atem > 0. */
    update(time) { for (const h of verbieger) h.update(time); },
    get verbogen() { return verbieger.length; },
    /** v10 · Kit-Maßstab-Tor: kit-treu / Boden / Ausnahmen / ohne Kit / was sich bewegt hat. */
    kitTor() { return kitTor(protokoll); },
    report() { return { stand, modelle, exemplare: gesetzt, imWasserVerworfen: verworfen,
                        zuSteil, mitZone: zonen, albedo: P.albedo, drawCalls: group.children.length }; },
    /** ⚠ **Die durchfallbare Zeile zum Pflanzentausch vom 1.9.** Sie behauptet nichts über die neun
     *  neuen Modelle, sie LIEST sie aus der gebauten Szene: geladen ja/nein, Dreiecke, Farbigkeit.
     *  Und sie nennt den Gewichtsanteil aus der Tabelle daneben — ein Prop, das im Satz steht und
     *  nie geladen wird, wäre sonst nur an einer Konsolenwarnung zu erkennen, die niemand liest.
     *  Durchgefallen ist: ein neues Modell nicht geladen, oder über 3000 Dreiecke (die Grenze der
     *  Auswahl vom 29.8. lag bei 2300 für ein Kanon-Prop), oder ohne einen einzigen farbigen Teil. */
    pflanzenTor() {
      // ⚠ v12 · Ein Tor, das ein ABGEWÄHLTES Stück als Ausfall meldet, lügt in die andere
      // Richtung. Was der Pflanzen-Filter herausnimmt, wird hier auch nicht mehr erwartet —
      // und der Text sagt, dass gefiltert wurde, statt es zu verschweigen.
      const ALLE = ['palm-bend', 'palm-straight', 'palm-detailed-bend', 'cactus_tall',
                    'flower_redC', 'flower_yellowB', 'flower_purpleA',
                    'mushroom_redGroup', 'crops_bambooStageB'];
      const NEU = P.pflanzen ? ALLE : ALLE.filter((n) => !KIT_PFLANZEN.includes(n)
                                                       || n === 'mushroom_redGroup');
      const gefiltert = ALLE.length - NEU.length;
      const summe = SURREAL.reduce((a, d) => a + d.w, 0);
      // ⚠ **Dritter Instrumentenfehler derselben Klasse in einer Sitzung, und der teuerste:**
      // die Farbzählung lief über die Meshes des FRISCH GELADENEN glTF. Dort stehen noch die
      // Quellmaterialien — weiß, weil dieses Modul die Farbe erst beim Backen setzt. Gemeldet wurde
      // deshalb „0 von 2 farbig" für `mushroom_redGroup`, das seit dem 29.8. sichtbar rot in der
      // Streuung steht; abgelesen an der gebauten Szene sind seine zwei Teile **#adadad** (Stiel)
      // und **#a46266** (Hut). **Ich habe den EINGANG gemessen, während der AUSGANG die Frage war**
      // — und daraufhin ein funktionierendes Modell abgewählt (`mushroom_redTall`, dessen Urteil
      // damit ebenfalls unbelegt ist; es bleibt draußen, aber nicht aus dem genannten Grund).
      // Jetzt läuft die Zählung über `group`, also über das, was der Renderer sieht. Die Namen
      // tragen die Herkunft (`prop-<name>-…`), gesetzt beim Bau — das ist der Schlüssel.
      // ⚠ **Und der vierte Anlauf, aus demselben Grund abgelesen:** die erste Fassung dieser
      // Zählung zog den Modellnamen mit `/^prop-(.+?)-/` aus dem Mesh-Namen — nicht-greedy, also
      // bricht sie am ERSTEN Bindestrich. `prop-palm-detailed-bend-…` ergab den Schlüssel `palm`,
      // und die drei Palmen meldeten „0/0 farbig", während das Tor trotzdem ✓ sagte, weil „null
      // Teile" durch die Bedingung `teile > 0 && farbig === 0` rutschte.
      // **Ein Tor, das eine Lücke für eine Zusage hält, ist schlimmer als keins.** Jetzt wird gegen
      // die BEKANNTEN Namen geprüft statt aus dem Namen geraten, und null Teile ist ein Durchfall.
      const gemalt = new Map();
      for (const n of NEU) gemalt.set(n, { teile: 0, farbig: 0, toene: [] });
      group.traverse((o) => {
        if (!o.isMesh || !o.name) return;
        for (const n of NEU) {
          if (o.name.indexOf('prop-' + n + '-') !== 0) continue;
          const rec = gemalt.get(n);
          rec.teile++;
          const mat = o.material;
          const hatMap = !!(mat && mat.map);
          const hatVertexfarben = !!(o.geometry && o.geometry.attributes && o.geometry.attributes.color
                                     && mat && mat.vertexColors);
          const hatEigenfarbe = !!(mat && mat.color && mat.color.getHex() < 0xf0f0f0);
          if (hatMap || hatVertexfarben || hatEigenfarbe) {
            rec.farbig++;
            if (rec.toene.length < 4) rec.toene.push(hatMap ? 'atlas' : '#' + mat.color.getHexString());
          }
          break;
        }
      });
      const zeilen = [];
      let fehlt = 0, teuer = 0, weiss = 0, geladen = 0, triSumme = 0, ohneTeile = 0;
      for (const n of NEU) {
        const p = protokoll.get(n);
        const def = SURREAL.find((d) => d.name === n);
        const anteil = def ? (def.w / summe * 100) : 0;
        if (!p) { zeilen.push(n + ': not drawn in this world (weight ' + (def ? def.w : '?') + ')'); continue; }
        if (p.stand !== 'geladen') { fehlt++; zeilen.push(n + ': ✗ ' + p.stand); continue; }
        geladen++; triSumme += p.dreiecke;
        if (p.dreiecke > 3000) teuer++;
        const g2 = gemalt.get(n) || { teile: 0, farbig: 0, toene: [] };
        if (g2.teile === 0) { ohneTeile++; }
        else if (g2.farbig === 0) { weiss++; }
        zeilen.push(n + ': ' + p.dreiecke + ' tri, ' + g2.farbig + '/' + g2.teile + ' coloured in scene'
                    + (g2.toene.length ? ' (' + g2.toene.join(' ') + ')' : '')
                    + ', ' + p.zielHoehe.toFixed(3) + ' u in world (model ' + p.rohHoehe + '), '
                    + anteil.toFixed(0) + ' % of the set');
      }
      const buchDa = SURREAL.some((d) => /book|Almanac/i.test(d.name));
      const ok = fehlt === 0 && teuer === 0 && weiss === 0 && ohneTeile === 0 && !buchDa;
      const ungewaehlt = NEU.length - geladen - fehlt;
      return {
        idle: false, ok, geladen, fehlt, ungewaehlt, teuer, weiss, ohneTeile, gewichtSumme: summe,
        dreieckeSumme: triSumme, buchImSatz: buchDa, zeilen,
        text: (ok ? '✓' : '✗') + ' ' + geladen + ' of ' + NEU.length + ' new plants stand in THIS world'
          + (gefiltert ? ' · ' + gefiltert + ' kit plants taken out of the set in v12 (the area cover is ts-flora.js; ?kits=1 puts them back)'
                       + ' · the slot budget followed the set, it was not redistributed: scatter ' + P.streu + ' → ' + streuZiel
                       + ', surreal ' + P.surreal + ' → ' + surrealZiel : '')
          + (ungewaehlt ? ' · ' + ungewaehlt + ' not drawn (weight 2–4 of ' + summe
                          + ' against only ' + surrealZiel + ' surreal slots — expected, not a fault)' : '')
          + ' · ' + triSumme + ' tri'
          + ' · set weight ' + summe + ' (unchanged from before the books came out)'
          + (buchDa ? ' · ✗ A BOOK IS STILL IN THE SET' : ' · no books')
          + (fehlt ? ' · ✗ ' + fehlt + ' FAILED TO LOAD' : '')
          + (ohneTeile ? ' · ✗ ' + ohneTeile + ' loaded but NO MESH FOUND in the scene' : '')
          + (teuer ? ' · ⚠ ' + teuer + ' over 3000 tri' : '')
          + (weiss ? ' · ⚠ ' + weiss + ' with no colour on any path (map, vertex colours, material)' : ''),
      };
    },
    dispose() { group.removeFromParent(); },
  };
}
