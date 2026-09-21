// ============================================================================
// prop-scatter.js — KFB Travel v16 · Slice L3 · Kenney-Props statt grauer Blöcke · ps-v1.0
// ----------------------------------------------------------------------------
// Auftrag Georg (12.8.): „die grauen Platzhalter-Blöcke auf den Voxeln durch Kenney-3D-Assets
// mit leichtem Cartoon-Deformer (zufällig / oder in Biome-Logik später) einbauen, also Bäume und
// andere passende Props & Assets."
//
// ── Was schon da war, und deshalb nicht neu gebaut wurde ────────────────────
// **`asset-repo.json` (Projektwurzel, 328 kB, 986 Assets).** Ein aufgelöster Index mit `ghUrl`
// pro Asset, `size`, `fp` (Grundfläche), `role`, `naturalScale`. Der `KFB Cartoon-Verbieger`
// benutzt ihn bereits (`this.repo = await fetch('./asset-repo.json')`). Dieses Modul liest
// denselben Index — **keine fest verdrahteten URLs.** Der Grund ist nicht Bequemlichkeit: die
// Pfade sind eine Falle. `kenney_nature-kit` liegt im Repo unter `Models/GLTF format/`, und
// dieser Ordner enthält **`.glb`**-Dateien. Wer das selbst zusammensetzt, baut den Fehler nach,
// den `github_status.json` und das Abgleich-Protokoll vom 23.7. schon einmal aufgeräumt haben.
//
// **`kfb-cartoon-deform.js` (Projektwurzel).** Der Verbieger, seit §1 ungenutzt. Er notiert die
// Lücke selbst: *„Für echtes Instanced-Scatter gehören die Werte statt in Uniforms in
// Instanced-Attribute — dieselbe Mathematik, anderer Träger."* Genau das ist hier gebaut: die
// Mathematik ist von dort übernommen (objekt-normiert, am Fuß verankert, t² Bogen, t Neigung,
// Verjüngung, Verdrehung, Normalen numerisch nachgezogen), der Träger ist `aKc1`/`aKc2`.
// Die Datei selbst bleibt unangetastet — sie ist die Referenz, an der der Verbieger-Lab abgestimmt
// wird, und ein geteiltes Modul umzubauen, um es an einer Stelle zu benutzen, ist der falsche Weg.
//
// ── Vier Entscheidungen ─────────────────────────────────────────────────────
// (1) **EIN InstancedMesh pro Modell-Teil, GLOBAL — nicht pro Chunk.** Die grauen Blöcke waren ein
//     Streu-Mesh je Chunk, also 81 Draw-Calls. Bei 9 Modellen × 1–2 Teilen sind es unter 20,
//     unabhängig von der Chunk-Zahl. Der Umbau macht das Bild reicher UND die Liste kürzer.
// (2) **Die Standorte gehören dem Terrain** (`terrain.propSites`), nicht diesem Modul. Wer den
//     Boden zweimal rechnet, hat zwei Höhen — dieselbe Regel wie bei Wasser (Farbe, keine Ebene)
//     und bei den Farbwelten (nur Uniforms, kein Rebake). Deshalb kennt dieses Modul weder
//     Höhenfeld noch Stufung; es bekommt Orte und stellt Dinge hin.
// (3) **Biom-Logik über den DATEINAMEN.** Der Index hat von jedem Baum drei Fassungen:
//     `tree_default`, `tree_default_dark`, `tree_default_fall`. Damit ist „Herbstwald" oder
//     „Nachtwald" kein System, sondern ein Suffix — Georgs „oder in Biome-Logik später" ist damit
//     fast geschenkt und bleibt trotzdem abschaltbar.
// (4) **Die grauen Blöcke bleiben als Fallback, nicht als Altlast.** Laden die Assets nicht
//     (offline, RAW blockiert), streut weiter das, was ohne Netz funktioniert. `setPropsOwn(true)`
//     wird erst gezogen, wenn wirklich Modelle im Speicher sind.
//
// Nichts wird ins Projekt kopiert: RAW-URL zur Laufzeit (Workspace-Regel §A3.1).
// ============================================================================

import { MOTION_GLSL, PALETTE_GLSL } from './voxel-terrain.js';

/** v24 · 5.9. · **Der Pack-Nachtrag ist WEG, und das ist die gute Nachricht.** Er war eine
 *  Brücke: das KayKit-Forest-Pack lag im Repo, aber in keinem Index, und die Dateinamen konnte ich
 *  nicht lesen. Georg hat daraufhin `kfb-asset-library.json` geliefert — 10 509 Assets, darunter
 *  alle 109 KayKit-Forest-Modelle. Damit gibt es wieder EINE Quelle, und die sechs Modelle unten
 *  stehen mit ihrem echten Namen im Set statt aus einem Ordner-Abruf zu tropfen.
 *  Ausgewählt sind sie nach demselben Kriterium wie alles andere hier: eine Silhouette, die es
 *  noch nicht gab. `Tree_Bare_*` ist die einzige kahle Form im ganzen Pool. */

/* ps-v1.4 (v25 · 5.9.): Höhen-Band als ZWEITE Einpass-Bedingung (Naht 133/134), `h` je Modell als
   benannte Ausnahme (135), Set 26 → 38 Modelle inkl. Felsstufen und Gras-Kombo (136), Maßtabelle
   in `report().masse`. Die Version gehört dem MODUL — sie wird hier erhöht und nicht im Dokument
   behauptet, sonst vergleicht der Clean-Run eine Zahl gegen eine Erfindung. */
export const PS_VERSION = 'ps-v1.4';

/**
 * Das Set. **Bewusst klein** (9 Grundmodelle): bei 42 u/s entscheidet die Zahl der Draw-Calls, ob
 * die Welt lebt oder ruckelt, und ein Set, das man nicht überblickt, kann man nicht abstimmen.
 *
 * `kind` bestimmt die Zielgröße und ob gebogen wird. `w` ist das Grundgewicht; `bw` überschreibt
 * es je Biom (fehlt es, gilt `w`). `vary` erlaubt die `_dark`/`_fall`-Fassungen.
 */
export const PROP_SET = [
  // Bäume — verschiedene SILHOUETTEN, nicht verschiedene Bäume. Eine hohe schlanke Kiefer neben
  // einem breiten Laubbaum liest sich als Wald; sechs Laubbäume lesen sich als Tapete.
  // v24 · 5.9. · Georg wollte mehr Abwechslung aus dem Kenney-Nature-Kit. Das Set war bewusst
  // klein (9 Modelle) — die Regel bleibt, nur die Zahl steigt auf 18, und das Kriterium ist
  // unverändert: JEDER Neuzugang bringt eine Silhouette, die es noch nicht gab. Kosten: ein Modell
  // ist 1–2 Draw-Calls, wir liegen damit bei ~36 statt ~20 — unabhängig von der Chunk-Zahl.
  // `tree_default` bleibt das Maß: es trägt weiter das größte Gewicht, sonst kippt der Charakter
  // der Welt mit dem Set.
  { base: 'tree_default',       kind: 'tree',  w: 18, vary: true, bw: { meadow: 24, scorched: 8, fractured: 6 } },
  { base: 'tree_pineTallA',     kind: 'tree',  w: 14, vary: true, bw: { luminous: 22, fractured: 18, meadow: 10 } },
  { base: 'tree_thin',          kind: 'tree',  w: 10, vary: true },
  { base: 'tree_blocks',        kind: 'tree',  w: 7,  vary: true, bw: { plateau: 14 } },
  // Neu: runde, breite Krone — der Gegenpol zur Kiefer, der dem Set gefehlt hat.
  { base: 'tree_oak',           kind: 'tree',  w: 10, vary: true, bw: { meadow: 16, scorched: 4 } },
  // Neu: schmaler Kegel und schlanker Hochstamm — zwei Zwischenstufen zwischen Kiefer und Laubbaum.
  { base: 'tree_cone',          kind: 'tree',  w: 7,  vary: true, bw: { luminous: 12, fractured: 10 } },
  { base: 'tree_tall',          kind: 'tree',  w: 6,  vary: true, bw: { plateau: 12 } },
  // Neu: dichte, detaillierte Krone — trägt die Vordergrund-Standorte, wo eine grobe Silhouette auffällt.
  { base: 'tree_detailed',      kind: 'tree',  w: 6,  vary: true, bw: { meadow: 10 } },
  // Neu: Palmen. Georg ausdrücklich — und sie sind die einzige Silhouette im Kit, die schräg
  // WÄCHST statt schräg zu stehen. Global selten, damit sie ein Fund bleibt; im verbrannten Biom
  // häufiger, wo eine Palme als Dürre-Zeichen liest statt als Urlaub.
  // Ohne `vary`: der Index führt für Palmen keine `_dark`/`_fall`-Fassung (geprüft, nicht vermutet).
  /* v25/A1b · **Eigene Höhe, und zwar mit Grund** (Georg, 5.9.: „Palme ist zu klein"). Palmen
     fächern ihre Krone breit auf: die Grundflächen-Einpassung gab ihnen 3,1 u, das Höhen-Band der
     Bäume hätte sie auf 3,4 u gehoben — also gerade auf Mech-Höhe, und damit weiter wie eine
     Topfpflanze neben 8-u-Kiefern. Eine Palme ist ein HOCHstamm; 5,5 u ist die Höhe, auf der ihr
     Wedelschopf über die Krone eines Laubbaums schaut, ohne mit den Kiefern zu konkurrieren.
     Der Wert steht je Modell, nicht im Band: das Band beschreibt eine Art, und die Palme ist
     innerhalb ihrer Art die Ausnahme — genau dafür gibt es `h`. */
  { base: 'tree_palmDetailedTall', kind: 'tree', h: 5.5, w: 4, vary: false, bw: { scorched: 12, meadow: 5, fractured: 1 } },
  { base: 'tree_palmBend',      kind: 'tree',  h: 5.0, w: 3,  vary: false, bw: { scorched: 9, fractured: 1 } },
  // Fels — trägt die Klippenzonen aus L1, ohne mit ihnen zu konkurrieren.
  { base: 'rock_tallA',         kind: 'rock',  w: 9,  vary: false, bw: { fractured: 20, scorched: 16, meadow: 5 } },
  { base: 'rock_largeC',        kind: 'flat',  w: 7,  vary: false, bw: { scorched: 12 } },
  { base: 'stone_tallC',        kind: 'rock',  w: 5,  vary: false, bw: { fractured: 14, plateau: 10 } },
  // Neu: der liegende Stamm. Waagerecht, und damit die einzige Form im Set, die eine Fläche
  // TEILT statt sie zu besetzen — er macht aus einer Lichtung eine Lichtung.
  { base: 'log',                kind: 'flat',  w: 5,  vary: false, bw: { meadow: 9, scorched: 7 } },
  // Kleinzeug — es macht den Boden bewohnt, nicht die Silhouette. Es ist auch das
  // BEGLEIT-Material der Cluster (siehe CLUSTER unten): ein Baum mit zwei Büschen am Fuß ist
  // eine Gruppe, drei Bäume nebeneinander sind eine Reihe.
  { base: 'plant_bushDetailed', kind: 'bush',  w: 9,  vary: false, bw: { meadow: 14, scorched: 3 } },
  { base: 'plant_bushLargeTriangle', kind: 'bush', w: 6, vary: false, bw: { meadow: 10, luminous: 8 } },
  { base: 'stump_oldTall',      kind: 'bush',  w: 5,  vary: false, bw: { scorched: 12, fractured: 9 } },
  { base: 'mushroom_redGroup',  kind: 'small', w: 4,  vary: false, bw: { luminous: 14, meadow: 7, scorched: 1 } },
  { base: 'mushroom_tanGroup',  kind: 'small', w: 3,  vary: false, bw: { luminous: 9, meadow: 5 } },
  { base: 'grass_leafsLarge',   kind: 'small', w: 5,  vary: false, bw: { meadow: 11, scorched: 1 } },
  /* v25/A2 · **Das Blatt ist ein Kombo-Asset** (Georg, 5.9.). `grass_leafsLarge` ist EIN Halm —
     allein gesetzt ist es ein Fremdkörper, und der übergroße Halm im Screenshot war beides:
     falsch skaliert UND allein. Die Skala repariert das Höhen-Band; die Einsamkeit repariert die
     Gesellschaft. Also kommen die zwei kleineren Geschwister dazu, und weil sie `small`/`bush`
     sind, greift der CLUSTER-Mechanismus von selbst: ein Halm bekommt am Fuß zwei kleinere
     Blätter statt drei gleich große Halme — „rule of three", drei Größen, ein Schwerpunkt. */
  { base: 'grass_leafs',        kind: 'small', w: 6,  vary: false, bw: { meadow: 12, scorched: 2 } },
  { base: 'plant_flatTall',     kind: 'small', w: 4,  vary: false, bw: { meadow: 8, luminous: 6 } },
  { base: 'plant_bushSmall',    kind: 'small', w: 5,  vary: false, bw: { meadow: 9 } },
  // ── KayKit Forest Nature Pack (v24 · 5.9.) ────────────────────────────────────────
  // Passt KayKit zu Kenney? Ja — dieselbe Sprache: low-poly, flache Flächen, eine Textur je Pack.
  // Der Unterschied ist die Silhouette: KayKits Bäume sind runder und knubbeliger, und kahle
  // Stämme gab es im ganzen Pool nicht. Sechs Modelle, nicht sechzig — ein Modell kostet 1–2
  // Draw-Calls, und ein Set, das man nicht überblickt, kann man nicht abstimmen.
  { base: 'Tree_1_A_Color1',    kind: 'tree',  w: 8,  vary: false, bw: { meadow: 12, luminous: 9 } },
  { base: 'Tree_4_A_Color1',    kind: 'tree',  w: 7,  vary: false, bw: { meadow: 10, plateau: 9 } },
  { base: 'Tree_Bare_2_B_Color1', kind: 'tree', w: 4, vary: false, bw: { scorched: 15, fractured: 12, meadow: 1 } },
  { base: 'Bush_2_C_Color1',    kind: 'bush',  w: 6,  vary: false, bw: { meadow: 9 } },
  { base: 'Rock_2_D_Color1',    kind: 'rock',  w: 5,  vary: false, bw: { fractured: 12, plateau: 9 } },
  { base: 'Grass_2_A_Color1',   kind: 'small', w: 4,  vary: false, bw: { meadow: 8, scorched: 1 } },
  /* v25/A3 · **Der Rest des Packs, nach demselben Kriterium** (Georg, 5.9.: „wir nutzen noch nicht
     alle KayKit Bäume, Sträucher und Pflanzen"). Nicht alle 97 Gruppen — die Regel bleibt: JEDER
     Neuzugang bringt eine Silhouette, die es noch nicht gab, und ein Modell kostet 1–2 Draw-Calls.
     Sieben dazu, damit `report().drawCalls` messbar bleibt (v24 lag bei 45; fps @1080p ist im
     HANDOVER als NIE GEMESSEN vermerkt, also ist die Zahl hier kein Ratespiel, sondern die
     Größe, gegen die gemessen wird). */
  { base: 'Tree_2_A_Color1',    kind: 'tree',  w: 7,  vary: false, bw: { meadow: 11, luminous: 8 } },     // runde, knubbelige Krone
  { base: 'Tree_3_B_Color1',    kind: 'tree',  w: 6,  vary: false, bw: { luminous: 10, plateau: 8 } },    // hoch und schmal, KayKit-Gegenstück zur Kiefer
  { base: 'Tree_Bare_1_A_Color1', kind: 'tree', w: 3, vary: false, bw: { scorched: 11, fractured: 10 } }, // zweiter kahler Stamm, andere Ast-Silhouette
  { base: 'Bush_1_C_Color1',    kind: 'bush',  w: 5,  vary: false, bw: { meadow: 8, luminous: 6 } },      // kleiner, runder Busch
  { base: 'Bush_4_B_Color1',    kind: 'bush',  w: 4,  vary: false, bw: { meadow: 7, scorched: 4 } },      // breit und flach
  { base: 'Rock_1_H_Color1',    kind: 'flat',  w: 4,  vary: false, bw: { fractured: 9, scorched: 7 } },   // liegende Platte
  { base: 'Grass_1_A_Color1',   kind: 'small', w: 4,  vary: false, bw: { meadow: 9, plateau: 6 } },       // dichtes Büschel
  /* v25/A4 · **Die Felsstufe mit Grasplateau**, die Georg im Screenshot eingekreist hat. Sie kommt
     aus dem Platformer-Kit und war im Set gar nicht drin — was man dort sah, war ein normaler
     Fels am unteren Rand seines Bandes. Jetzt ist die Form selbst im Pool, und sie bringt etwas,
     das keine andere hat: eine STUFE, also eine Fläche, auf die etwas steigen könnte. */
  { base: 'RockPlatforms_Medium', kind: 'rock', w: 5, vary: false, bw: { plateau: 12, fractured: 9, meadow: 4 } },
  { base: 'RockPlatform_Tall',  kind: 'rock',  w: 4,  vary: false, bw: { plateau: 10, fractured: 8 } },
];

/** v24 · 5.9. · CLUSTER — Georgs „rule of three".
 *  Ein Standort trug bisher GENAU EIN Prop. Bei gleichmäßiger Streuung liest das als Raster, egal
 *  wie viele Modelle im Pool liegen — mehr Arten allein hätten das nicht behoben.
 *  Jetzt setzt ein Standort eine GRUPPE: ein Führer in voller Größe, dazu bis zu zwei kleinere
 *  Begleiter aus dem Klein-Material (bush/small), versetzt innerhalb derselben Zelle.
 *  Drei Größen, ein Schwerpunkt — das ist die Regel, nicht drei gleich große Dinge.
 *  Die Verteilung hält die Mehrheit der Orte EINZELN: eine Welt, in der alles gruppiert ist, hat
 *  wieder keinen Rhythmus (dieselbe Lehre wie in globe-v13/ts-flora, wo ein Teil der Orte
 *  ausdrücklich ein einzelnes Stück trägt). */
export const CLUSTER = Object.freeze({
  einzeln: 0.56,     // Anteil der Standorte mit nur einem Prop
  paar: 0.30,        // Führer + 1 Begleiter
  // Rest (0,14) = Führer + 2 Begleiter
  abstandMin: 0.42,  // u · Begleiter rücken nicht in den Führer hinein
  abstandMax: 1.05,  // u · und bleiben in der 3-u-Zelle, also auf demselben Würfel und derselben Höhe
  begleiterSkala: [0.62, 0.44],   // je Begleiter: Anteil seiner normalen Größe — drei Größen, kein Trio
});

/**
 * Welche Namensfassung ein Biom bevorzugt. `''` = die Grundfassung.
 * Der Index hat `_dark` und `_fall` nur für Bäume — fehlt die Fassung, fällt es auf die
 * Grundfassung zurück (in `resolve()`), also darf hier ohne Prüfung gewünscht werden.
 */
export const BIOME_VARIANT = {
  meadow: '', plateau: '', luminous: '_dark', fractured: '_dark', scorched: '_fall',
};

// Zielgrundfläche in Welteinheiten (CELL = 3). Ein Baum mit 2,25 u Krone auf einer 3-u-Zelle
// liest sich als Baum; mit 3 u als Wand, mit 1 u als Grasbüschel. Fels kleiner, damit er nicht
// mit den Klippen (6 u, seit L1) konkurriert.
const TARGET_FP = { tree: 2.25, rock: 1.9, flat: 2.2, bush: 1.4, small: 0.95 };
/* ═══ v25/A1 · DIE HÖHE IST DIE ZWEITE BEDINGUNG ═══════════════════════════════════
   Georgs zwei Befunde vom 05.09. — „Palme ist zu klein", „Blatt ist zu groß" — sind EIN Fehler,
   und er steckt in der Zeile darüber: eingepasst wurde nur die GRUNDFLÄCHE. Das geht gut, solange
   ein Modell etwa so breit ist wie hoch, und es geht garantiert schief bei allem, was das nicht
   ist:
     · Ein Grasblatt ist ein schmaler Halm. Kleine Grundfläche → großer Faktor → ein Halm, der dem
       Mech bis zur Hüfte reicht. Genau das steht im Screenshot.
     · Eine Palme fächert ihre Krone breit auf. Große Grundfläche → kleiner Faktor → eine
       Topfpflanze. Auch das steht im Screenshot.
     · Kenneys Felsstufen mit Grasplateau sind breit und niedrig — sie wurden auf 1,9 u Breite
       eingepasst und blieben darunter knapp über dem Boden („teilweise zu klein").
   Die Reparatur ist EINE Regel und kein Modell-Sonderfall: nach der Grundflächen-Einpassung wird
   die dabei herauskommende Höhe gegen ein BAND geprüft und der Faktor nur nachkorrigiert, wenn
   sie herausfällt. Wer im Band liegt, bleibt unangetastet — deshalb ändern sich die Bäume nicht,
   die im Bild schon stimmen. Wer korrigiert wurde, wird in der Bootzeile GENANNT.
   Die Zahlen kommen aus den Maßen, die in dieser Welt schon feststehen: Zelle 3 u, Klippen 6 u,
   Mech 3,2 u, Gegner 2,7 u, Pet 0,82 u. Ein Baum muß mindestens so hoch sein wie der Mech, sonst
   ist es ein Busch; ein Grasbusch darf ihm nicht über das Knie gehen. */
const HOEHEN_BAND = {
  /* Die Grenzen sind ABSICHTLICH weit: sie sollen Ausreißer fangen, nicht das Set einebnen. Die
     erste Fassung hatte tree bei 7,0 gedeckelt und damit die hohen Kiefern (8,8 u) gekürzt — die
     im Bild richtig standen und über die niemand geklagt hat. Gemessen (05.09.) fängt dieses Band
     genau die Modelle, die auffielen: Grasbüschel bei 3,44 u und 1,57 u, Palmen bei 3,1 u,
     Felsstufe bei 1,15 u. Wer im Band liegt, bleibt. */
  tree:  { min: 3.4, max: 9.0 },   // höher als der Mech (3,2); die hohen Kiefern stehen bei 8,8
  rock:  { min: 1.4, max: 3.4 },   // sichtbar als Stein, nie im Wettbewerb mit der Klippe (6 u)
  flat:  { min: 0.5, max: 1.8 },   // liegende Stämme, Platten — sie TEILEN eine Fläche
  bush:  { min: 0.7, max: 2.6 },
  small: { min: 0.28, max: 0.95 }, // Gras, Pilze — Bodendeckung, keine Silhouette
};
// Nur was hoch und unterteilt ist, wird gebogen. Ein flacher Stein würde sonst „rutschen".
const BENDABLE_KINDS = { tree: 1, bush: 1 };
// Unter vier Höhen-Ringen SCHERT ein Netz statt zu biegen — die Regel steht in
// `kfb-cartoon-deform.js` (§5) und wird hier je Modell gemessen, nicht geraten.
const MIN_RINGS = 4;

// ---------------------------------------------------------------- GLSL
// ⚠ Keine Backticks in diesen Blöcken (Naht 111): sie stehen in Template-Literalen, und ein
// Backtick in einem Kommentar beendet das Literal — der Fehler erscheint dann bei einem Nachbarn.
const DEFORM = /* glsl */`
attribute vec4 aKc1;   // x=bendX y=bendZ z=leanX w=leanZ  (Bruchteile der HOEHE)
attribute vec4 aKc2;   // x=taper y=twist(rad) z=phase w=rampT (Rampenwert des Wuerfels)
attribute vec4 aKc3;   // x=cubeX y=cubeZ z=motionSeed w=1/scale
attribute vec3 aSN;    // geglaettete Normale (Kanten weich)
uniform float uKcMinY, uKcH, uKcCx, uKcCz, uKcMix, uKcTime, uKcSquashAmt, uKcSquashSpd;
uniform float uRound, uInflate, uKcLag, uKcLagJit, uKcProp, uKcStretch, uKcWhipLean, uKcArc;
varying float vRampT;
varying vec2 vCube;
// v24 · 5.9. · **Die Bewegung des Wuerfels wird EINMAL je Vertex gelesen, nicht in der Verformung.**
// Zwei Gruende. Erstens Rechenzeit: kfbCartoonI wird VIERMAL je Vertex gerufen (einmal fuer die
// Position, dreimal fuer die numerische Normale) — jede Bob-Auswertung darin kostet also vierfach.
// Frueher lagen 3 Auswertungen drin (12 je Vertex); jetzt sind es 5 davor und 0 darin.
// Zweitens Richtigkeit: die drei Normalen-Proben MUESSEN dieselbe Bewegung sehen wie die Position,
// sonst zeigt die Beleuchtung auf eine Verformung, die es nicht gibt.
//   x = Geschwindigkeit des Wuerfels (1/s)
//   y = Beschleunigung (1/s2) — positiv heisst: der Boden drueckt nach OBEN. Das ist der Aufprall.
//   z = Geschwindigkeit, gelesen mit dem VERZUG dieser Hoehe (Follow-Through)
vec3 kfbMo;
void kfbMoLesen(float tTip) {
  float h = 0.05;                 // 50 ms — kurz genug fuer eine Ableitung, lang genug gegen Rauschen
  float bm = kfbBobAt(aKc3.xy, aKc3.z, -h);
  float b0 = kfbBobAt(aKc3.xy, aKc3.z, 0.0);
  float bp = kfbBobAt(aKc3.xy, aKc3.z, h);
  // Der Verzug waechst mit der Hoehe: jede Ebene reagiert spaeter als die darunter. Das ist
  // Regel 5 der Cartoon-Grammatik (Follow-Through und Overlapping Action, ~0,1–0,15 s je Ebene)
  // — und der Grund, warum eine WELLE den Stamm hinauflaeuft statt der ganze Baum zu kippen.
  float tp = -tTip * uKcProp;
  float bl = kfbBobAt(aKc3.xy, aKc3.z, tp - h);
  float br = kfbBobAt(aKc3.xy, aKc3.z, tp + h);
  kfbMo = vec3((bp - bm) / (2.0 * h), (bp - 2.0 * b0 + bm) / (h * h), (br - bl) / (2.0 * h));
}
vec3 kfbCartoonI(vec3 p) {
  float t = clamp((p.y - uKcMinY) / max(uKcH, 1e-5), 0.0, 1.0);
  vec2 c = vec2(uKcCx, uKcCz);
  vec3 q = p;
  vec2 r = q.xz - c;
  // Verjuengung VOR der Biegung, damit der Bogen die verjuengte Silhouette mitnimmt.
  r *= (1.0 - aKc2.x * t);
  float a = aKc2.y * t;
  r = vec2(r.x * cos(a) - r.y * sin(a), r.x * sin(a) + r.y * cos(a));
  q.xz = c + r;
  // ── v24 · 5.9. · GUMMIBAUM AUF HUEPFENDEM BODEN ─────────────────────────────────────
  // Georg: 'die bounce bewegung verstaerkt doch nur die bewegungsrichtung und ist nicht plausibel
  // … wenn ein (gummiartig gedachtes) asset wie eine tanne auf einen huepfenden boden steht, sieht
  // das nach cartoon-logik komplett anders aus, die spitze wippt zb'. Richtig — meine Fassung davor
  // war eine SKALIERTE GESCHWINDIGKEIT: mehr Ausschlag in dieselbe Richtung, in der sich alles
  // ohnehin bewegt. Das ist Verstaerkung, keine Reaktion, und deshalb las es sich falsch.
  //
  // Nach seiner eigenen Grammatik (skills/cartoon-motion_v1.md) sind drei Regeln zustaendig:
  //  · Regel 1 (Squash & Stretch, VOLUMENERHALTEND): Stauchung beim AUFPRALL — und Aufprall ist
  //    nicht Abwaerts-Bewegung, sondern Aufwaerts-BESCHLEUNIGUNG (kfbMo.y). Gestreckt wird, wenn
  //    Tempo im Spiel ist (|kfbMo.x|). Genau umgekehrt zu dem, was ich vorher hatte.
  //  · Regel 5 (Follow-Through / Overlapping Action): jede Hoehe reagiert SPAETER — kfbMo.z traegt
  //    den Verzug. Die Spitze schlaegt noch aus, wenn der Fuss schon umkehrt: sie WIPPT.
  //  · Regel 7 (Arcs): die Spitze laeuft auf einer Kurve, nicht auf einer Gerade — sie sinkt ein
  //    wenig, wenn sie ausschlaegt (uKcArc).
  // Die Amplitude waechst ueberlinear (t^1.6): ein Wipfel schlaegt aus, ein Stamm kippt nicht.
  float bew = kfbBeweg(aKc3.xy);
  float sy = 1.0 + bew * (uKcStretch * abs(kfbMo.x) - uKcSquashAmt * kfbMo.y);
  q.y = uKcMinY + (q.y - uKcMinY) * sy;
  q.xz = c + (q.xz - c) / sqrt(max(sy, 1e-4));
  // Bogen (t^2, am Fuss verankert) + Neigung (linear), beide in Bruchteilen der HOEHE, damit
  // klein und gross gleich stark krumm werden.
  q.x += (aKc1.x * t * t + aKc1.z * t) * uKcH;
  q.z += (aKc1.y * t * t + aKc1.w * t) * uKcH;
  // Das Wippen hat eine EIGENE, je Instanz feste Achse (aus der Instanz-Phase). Sie liegt bewusst
  // nicht auf der Bogen-Achse: ein Baum, der nur in seine Krummungsrichtung federt, sieht wie ein
  // Metronom aus. Eine Achse je Baum genuegt gegen die Konfetti-Falle (Naht 82/110) — zwei
  // Richtungen gleichzeitig waeren Zappeln.
  float wa = aKc2.z * 6.2831853;
  float w = pow(t, 1.6) * uKcH * kfbMo.z * uKcWhipLean * bew;
  q.x += cos(wa) * w;
  q.z += sin(wa) * w;
  q.y -= abs(w) * uKcArc;   // Regel 7: der Ausschlag laeuft auf einem Bogen, nicht waagerecht
  return mix(p, q, uKcMix);
}
`;
const TINT_FRAG = /* glsl */`
uniform float uTintAmt;
// v25 · 5.9. · **Warum KayKit die Weltfarbe anders annimmt als Kenney** (Georgs Frage). Gemessen an
// den 57 Prop-Materialien: 44 Kenney-Teile haben KEINE Textur und tragen ihre Farbe im Material
// (z. B. #73eddd); 13 KayKit-Teile haben Grundfarbe **#ffffff** und einen geteilten 1024²-Atlas.
// Der Weltton multipliziert in beiden Fällen — aber was er multipliziert, ist verschieden: eine
// flache, gesättigte Kenney-Farbe × Weltfarbe liest als UMFÄRBUNG; ein Atlas-Pixel × Weltfarbe
// liest als leichte Verschiebung, weil die Textur ihre eigene Palette und ihre eigene gebackene
// Schattierung schon mitbringt — man liest die Textur zuerst und den Ton danach.
// uTexFlat ist der Hebel, falls die KayKit-Teile mitfärben SOLLEN: er zieht das Texturbild auf
// seinen Helligkeitswert, damit die Weltfarbe die Farbe stellt und die Textur nur noch die
// Zeichnung. Er liegt NUR auf Materialien mit Textur (sonst entfaerbte er auch Kenney) und steht
// auf 0, bis jemand ihn dreht — eine Änderung am Bild ist keine Routineentscheidung (v13-Regel 5).
uniform float uTexFlat;
// v24/S4 · Nebel. DIESELBEN Uniform-Objekte wie das Terrain (über paletteUniforms eingespritzt) —
// nicht Kopien, nicht eigene Werte. Ohne diesen Term blieben die Props bis zum Horizont farbig,
// während der Boden unter ihnen im Dunst verschwand. (⚠ keine Backticks in diesem Block — der GLSL
// steht in einem Template-Literal, eine Wortmarkierung beendet es.)
uniform vec3 uFogColor;
uniform float uFogDensity;
varying float vRampT;
varying vec2 vCube;
`;

/** v24 · 5.9. · Die Bewegungs-Probe steht am ANFANG von main(), vor allem anderen: three ruft
 *  `beginnormal_vertex` VOR `begin_vertex`, die Verformung wird also fuer die Normale zuerst
 *  gebraucht. Ein einziges `position.y` reicht als Hoehe — die drei Normalen-Proben liegen nur
 *  uKcH*0,03 daneben, und sie SOLLEN dieselbe Bewegung sehen wie die Position (sonst zeigt die
 *  Beleuchtung auf eine Verformung, die es nicht gibt). */
const MO_INJ = '  kfbMoLesen(clamp((position.y - uKcMinY) / max(uKcH, 1e-5), 0.0, 1.0));\n';

/** v24/S4 · Die Vertex-Einspritzung steht EINMAL, weil sie jetzt ZWEI Shader speist: das sichtbare
 *  Material und das Tiefenmaterial des Schattenpasses. Zwei Kopien wären zwei Verformungen — und
 *  das Ergebnis wäre ein Baum, dessen Schatten neben ihm liegt und beim Tanz nicht mitgeht. */
const BEGIN_INJ = [
  '#include <begin_vertex>',
  'vRampT = aKc2.w;',
  'vCube = aKc3.xy;',
  'transformed = kfbCartoonI(transformed);',
  '// v16/L3c · RUNDE KANTEN, Teil 2: entlang der geglaetteten Normale aufblasen. Eine',
  '// Ecke wird dabei diagonal nach aussen gedrueckt, eine Flaeche gerade — die',
  '// Silhouette wird tonnenfoermig, also runder. Teil 1 ist die Normale selbst (unten).',
  'transformed += aSN * (uInflate * uKcH);',
  '// v16/L3b · DIE BODENBEWEGUNG. `kfbLift` ist derselbe GLSL-Block, den das Terrain',
  '// benutzt, mit denselben Uniforms und der Phase des WUERFELS (aKc3.xy/z) — nicht der',
  '// des Props, das versetzt steht. `aKc3.w` ist 1/Maszstab: die Lift ist absolut, hier',
  '// wird aber in Objektraum gerechnet, den die Instanzmatrix danach skaliert.',
  'transformed.y += kfbLift(aKc3.xy, aKc3.z) * aKc3.w;',
].join('\n');

/** mulberry32 — dasselbe PRNG wie world-context und der Verbieger. */
function mulberry32(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * v16/L3c · **Geglättete Normalen.** Für jede Position werden die Normalen aller Vertices an
 * derselben Stelle gemittelt (Raster 1/1000 einer Einheit, damit Rundungsfehler nicht zwei
 * Ecken aus einer machen). Das ist genau das, was ein 3D-Programm „Smooth Shading" nennt — nur
 * einmal beim Laden gerechnet und als zweites Normalen-Attribut mitgeführt, damit der Shader
 * zwischen HART und WEICH mischen kann statt sich für eines zu entscheiden.
 *
 * Warum nicht `computeVertexNormals` nach `mergeVertices`: das würde die harte Normale
 * ÜBERSCHREIBEN. Zwei Normalen nebeneinander sind der Grund, warum daraus ein Regler wird.
 */
function smoothNormals(geo) {
  const pos = geo.getAttribute('position'), nor = geo.getAttribute('normal');
  const out = new Float32Array(pos.count * 3);
  if (!nor) { return out; }
  const bucket = new Map();
  const key = (i) => Math.round(pos.getX(i) * 1000) + '/' + Math.round(pos.getY(i) * 1000) + '/' + Math.round(pos.getZ(i) * 1000);
  for (let i = 0; i < pos.count; i++) {
    const k = key(i);
    let b = bucket.get(k);
    if (!b) { b = [0, 0, 0, 0]; bucket.set(k, b); }
    b[0] += nor.getX(i); b[1] += nor.getY(i); b[2] += nor.getZ(i); b[3]++;
  }
  for (let i = 0; i < pos.count; i++) {
    const b = bucket.get(key(i));
    let x = b[0], y = b[1], z = b[2];
    const l = Math.hypot(x, y, z) || 1;
    out[i * 3] = x / l; out[i * 3 + 1] = y / l; out[i * 3 + 2] = z / l;
  }
  return out;
}

/** Höhen-Ringe zählen — wörtlich `segmentsAlongY` aus dem Verbieger, auf 1/64 der Höhe gerundet. */
function ringsAlongY(geo) {
  const p = geo.getAttribute('position');
  if (!p) return 0;
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i); if (y < lo) lo = y; if (y > hi) hi = y; }
  const h = hi - lo;
  if (!(h > 1e-6)) return 1;
  const set = new Set();
  for (let i = 0; i < p.count; i++) set.add(Math.round(((p.getY(i) - lo) / h) * 64));
  return set.size;
}

export function createPropScatter(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    budget: 2400,        // Obergrenze über ALLE Modelle
    /* v25/A5 · Anteil der Gruppen, 0–1. **Kosten der Gruppen, gemessen:** sie kosten KEINE
       Draw-Calls (dieselben InstancedMeshes, nur mehr Matrizen), sondern INSTANZEN — 2209 Props auf
       1418 Standorten, also 56 % mehr Vertex-Arbeit im Haupt- UND im Schattenpass. Ob das fühlbar
       ist, entscheidet die Messung, nicht die Vermutung: Regler im Panel, `report().gesetzt`
       daneben. */
    cluster: 1,
    /* v25 · Entfärbt die TEXTURIERTEN Props (KayKit), damit die Weltfarbe sie färben kann wie die
       untexturierten Kenney-Teile. 0 = Assets bleiben, wie sie geliefert sind. */
    texFlat: 0,
    biomeLogic: true,    // `_dark`/`_fall` je Biom + Biom-Gewichte
    // Verbieger-Grenzen. Etwas kräftiger als die Vorgabe des Moduls (bend 0,06), weil ein Baum
    // mehr Bogen verträgt als ein Turm — „leichter Cartoon-Deformer" heißt nicht „unmerklich".
    bend: 0.10, lean: 0.07, taper: 0.16, twist: 14,
    // v16/L3d · Squash & Stretch am Bob des Wuerfels. `squash` ist die Amplitude (0 = aus),
    // `squashLag` der Verzug in Sekunden (Follow-Through), `squashLagJitter` seine Streuung.
    // Standard AN: Georgs Auftrag war „cartoonig und lebhaft", und das kostet hier nichts —
    // die Bob-Funktion lief ohnehin schon fuer den Auftrieb.
    // v24 · 5.9. · 0,07 → 0,18 und mehr Verzug. Bei 7 % Stauchung tanzt ein Baum rechnerisch mit,
    // im Bild bei 42 u/s sieht man es nicht — Georg: 'die bäume sollen tanzen'. 18 % ist die
    // Cartoon-Größenordnung (Squash & Stretch trägt Gewicht erst, wenn man es LIEST), und der
    // größere Verzug (0,09 → 0,15) macht daraus eine REAKTION statt eines Mitschwingens: die
    // Masse der Krone kommt nach dem Boden, nicht mit ihm.
    squash: 0.018, squashSpeed: 1, squashLag: 0.15, squashLagJitter: 0.09,
    // v24 · 5.9. · Die vier Zahlen des Gummibaums (Herleitung im DEFORM-Block). Sie sind auf die
    // NORMIERTEN Ableitungen bezogen, nicht auf rohe Differenzen: die Geschwindigkeit erreicht bei
    // vollem Tanz etwa 1,5/s, die Beschleunigung etwa 8/s2. Daraus:
    //   squash 0,018 × 8   ≈ 14 % Stauchung im Aufprall
    //   stretch 0,055 × 1,5 ≈  8 % Streckung bei Tempo
    //   whipLean 0,15 × 1,5 ≈ 22 % der Hoehe als Ausschlag an der Spitze
    // `prop` ist der Verzug ueber die GANZE Hoehe (Regel 5 nennt 0,1–0,15 s je Ebene).
    stretch: 0.055, whipLean: 0.15, prop: 0.26, arc: 0.3,
    mix: 1,              // 0 = Originalform, 1 = verbogen (A/B am Regler)
    tint: 0.85,          // wie stark die Farbwelt in die Props hineinfärbt. v24 · 5.9. · war 0,25 —
    //   Georg: „die bäume und props passen farblich noch nicht". Bei einem Viertel gewinnt die
    //   Kenney-Grundfarbe (Krone mint, Stamm orange), und die gehört keiner unserer Welten. Bei
    //   0,85 trägt das Prop die Farbe des WÜRFELS, auf dem es steht, und die Kenney-Farbe wirkt nur
    //   noch als HELLIGKEITSMUSTER: Krone hell, Stamm dunkel, kein eigener Buntton.
    sizeJitter: 0.12,    // Größenstreuung ±
    sink: 0.05,          // Anteil der Höhe, um den das Prop in die Würfeloberseite gesetzt wird
    // v16/L3c · Runde Kanten. `round` mischt die Normale von hart nach weich (Beleuchtung),
    // `inflate` drückt die Fläche entlang der weichen Normale nach außen (Silhouette).
    // Zusammen ergeben sie „abgerundet" ohne eine einzige zusätzliche Kante.
    round: 0.55, inflate: 0.012,
  }, opts.params || {});
  // Geteilte Uniform-Objekte aus dem Terrain — ohne sie bewegen und färben die Props nicht mit.
  const motionU = opts.motion || {};
  const paletteU = opts.palette || {};

  const group = new THREE.Group();
  group.name = 'kfb-props';
  let index = null;                 // kfb-asset-library.json (oder asset-repo.json als Rückweg)
  let indexQuelle = '';             // welches Glied der Kette geantwortet hat — steht in `report()`
  const models = [];                // { base, name, kind, w, bw, parts, height, scale, bendable, rings }
  let ready = false, siteCount = 0, placed = 0, lastOver = 0, loadMs = 0, buildMs = 0, biomeNow = '';
  const tintCol = new THREE.Color(1, 1, 1);
  // light-budget.js liest den Faktor hier ab, statt ihn im Shader zu suchen.
  const TINT_GAIN = 1.30;
  let timeS = 0;

  const _m = new THREE.Matrix4(), _p = new THREE.Vector3(), _q = new THREE.Quaternion(), _s = new THREE.Vector3();
  const _yAxis = new THREE.Vector3(0, 1, 0);

  /** Name → URL aus dem Index. Gibt `null`, wenn der Name dort nicht steht.
   *  v24 · 5.9. · **Zwei Index-Formate, EINE Auflösung.** Georg hat `kfb-asset-library.json`
   *  geliefert (10 509 Assets) — sie führt `path` + `url` und KEIN `name`. Der alte
   *  `asset-repo.json` führt `name` + `ghUrl`. Statt eine Datei umzuschreiben (die andere
   *  Verbraucher hat) wird hier EINMAL normalisiert: der Name ist der Dateiname ohne Endung.
   *  Ein `Map` statt `find`: bei 10 509 Einträgen × 26 Modellen war die lineare Suche 273 000
   *  Vergleiche im Startfenster. */
  let byName = null;
  function urlOf(name) {
    if (!index) return null;
    if (!byName) {
      byName = new Map();
      for (const a of (index.assets || [])) {
        const n = a.name || (a.path ? a.path.split('/').pop().replace(/\.(glb|gltf)$/i, '') : null);
        if (!n || byName.has(n)) continue;
        const u = a.ghUrl || a.url || ((index.rawBase || '') + a.pack + '/' + n + '.glb');
        byName.set(n, u);
      }
    }
    return byName.get(name) || null;
  }

  /**
   * Ein Modell laden und in Instanced-Teile verwandeln.
   *
   * **Alle Teile werden in den Wurzelraum gebacken** — dieselbe Regel wie im Verbieger: ein Baum
   * aus Stamm + Krone bekäme sonst pro Teil eine eigene Bounding-Box, also eine eigene Mitte und
   * Höhe, und jedes Teil würde sich um seine eigene Achse biegen. Das Prop fiele auseinander.
   * Ein Rahmen für das ganze Prop, in dem `t` gerechnet wird.
   */
  async function loadOne(loader, def, name, cap) {
    const url = urlOf(name);
    if (!url) throw new Error('nicht im Index: ' + name);
    const gltf = await loader.loadAsync(url);
    const root = gltf.scene;
    root.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
    const src = [];
    root.traverse((n) => { if (n.isMesh && n.geometry) src.push(n); });
    if (!src.length) throw new Error('kein Mesh: ' + name);
    const baked = src.map((n) => {
      const g = n.geometry.clone();
      g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, n.matrixWorld));
      g.computeBoundingBox();
      return { geo: g, mat: (Array.isArray(n.material) ? n.material[0] : n.material) };
    });
    const shared = new THREE.Box3();
    baked.forEach((b) => shared.union(b.geo.boundingBox));
    const size = shared.getSize(new THREE.Vector3());
    const fp = Math.max(size.x, size.z);
    let scale = (TARGET_FP[def.kind] || 2.0) / Math.max(1e-4, fp);
    // v25/A1 · Höhen-Band als zweite Bedingung (Herleitung an HOEHEN_BAND). Nur Ausreißer werden
    // angefaßt, und der Eingriff wird festgehalten, damit er im Log auftaucht statt still zu wirken.
    const B = HOEHEN_BAND[def.kind];
    let korrektur = null;
    // `def.h` ist die Ausnahme mit Namen: EIN Modell, dessen Silhouette das Band seiner Art nicht
    // beschreibt (Palmen — Herleitung an ihrer Zeile im PROP_SET). Sie übersteuert das Band, statt
    // das Band für alle zu verbiegen.
    if (def.h) {
      const hFp = size.y * scale;
      scale *= def.h / hFp;
      korrektur = { war: hFp, ist: def.h, grund: 'eigene Höhe' };
    } else if (B) {
      const hFp = size.y * scale;
      if (hFp > B.max) { scale *= B.max / hFp; korrektur = { war: hFp, ist: B.max, grund: 'zu hoch' }; }
      else if (hFp < B.min) { scale *= B.min / hFp; korrektur = { war: hFp, ist: B.min, grund: 'zu niedrig' }; }
    }
    // Biegbarkeit wird GEMESSEN, nicht angenommen: die Ringzahl entscheidet, ob eine Biegung
    // biegt oder schert (Verbieger §5). Gemessen an Kenney-Bäumen: 19–31 Ringe, also biegen sie.
    const rings = Math.max.apply(null, baked.map((b) => ringsAlongY(b.geo)));
    const bendable = !!BENDABLE_KINDS[def.kind] && rings >= MIN_RINGS;

    const parts = baked.map((b) => {
      const mat = b.mat.clone();
      const U = {
        uKcMinY: { value: shared.min.y }, uKcH: { value: Math.max(1e-5, size.y) },
        uKcCx: { value: (shared.min.x + shared.max.x) / 2 },
        uKcCz: { value: (shared.min.z + shared.max.z) / 2 },
        uKcMix: { value: bendable ? P.mix : 0 },
        uKcTime: { value: 0 }, uKcSquashAmt: { value: P.squash }, uKcSquashSpd: { value: P.squashSpeed },
        uKcLag: { value: P.squashLag }, uKcLagJit: { value: P.squashLagJitter },
        uKcProp: { value: P.prop }, uKcStretch: { value: P.stretch },
        uKcWhipLean: { value: P.whipLean }, uKcArc: { value: P.arc },
        uTintAmt: { value: P.tint },
        // Nur Materialien MIT Textur bekommen den Entfärber überhaupt zu spüren (Herleitung im
        // TINT_FRAG-Block). Bei den anderen bleibt er dauerhaft 0, damit ein Regler am Panel nicht
        // heimlich die Kenney-Farben auswaescht.
        uTexFlat: { value: b.mat.map ? P.texFlat : 0 },
        uRound: { value: P.round }, uInflate: { value: P.inflate },
      };
      mat.onBeforeCompile = (sh) => {
        // ⚠ Die Bewegungs- und Paletten-Uniforms sind DIESELBEN OBJEKTE wie im Terrain, nicht
        // Kopien (siehe `terrain.motionUniforms`). Deshalb gibt es hier keine Zeile, die etwas
        // nachzieht — und deshalb koennen Boden und Props nicht auseinanderlaufen.
        Object.assign(sh.uniforms, motionU, paletteU, U);
        sh.vertexShader = sh.vertexShader
          .replace('void main() {', MOTION_GLSL + DEFORM + '\nvoid main() {\n' + MO_INJ)
          .replace('#include <begin_vertex>', BEGIN_INJ)
          // Normalen numerisch nachziehen (aus dem Verbieger übernommen): ohne das kippt die
          // Beleuchtung auf der Biegung, und ein gebogener Baum liest sich als Fehler.
          .replace('#include <beginnormal_vertex>', [
            '#include <beginnormal_vertex>',
            '// v16/L3c · RUNDE KANTEN, Teil 1: die Normale zwischen HART (Facette) und WEICH',
            '// (ueber gemeinsame Ecken gemittelt) mischen. Das rundet die BELEUCHTUNG, und weil',
            '// Kenney-Modelle flach schattiert sind, macht genau das den groessten Teil des',
            '// Eindrucks — eine echte Fase waere Geometrie, die wir 1400-fach bezahlen wuerden.',
            'objectNormal = normalize(mix(objectNormal, aSN, uRound));',
            '{',
            '  vec3 nn = normalize(objectNormal);',
            '  vec3 t1 = normalize(cross(nn, vec3(0.0, 1.0, 0.0001)));',
            '  vec3 t2 = cross(nn, t1);',
            '  float e = uKcH * 0.03;',
            '  vec3 q0 = kfbCartoonI(position);',
            '  vec3 qa = kfbCartoonI(position + t1 * e);',
            '  vec3 qb = kfbCartoonI(position + t2 * e);',
            '  vec3 nd = cross(qa - q0, qb - q0);',
            '  if (length(nd) > 1e-9) objectNormal = normalize(nd) * sign(dot(normalize(nd), nn));',
            '}',
          ].join('\n'));
        // Die Farbwelt färbt HINEIN, nicht ÜBER: multiplikativ auf die Grundfarbe, gedeckelt
        // durch `uTintAmt`. Ein Prop soll zur Welt gehören, nicht angemalt aussehen — und die
        // Kenney-Modelle haben KEINE Texturen (gemessen), also ist die Grundfarbe die ganze
        // Wahrheit und ein Multiplikator genügt.
        // ps-v1.2 · Die Färbung sitzt jetzt VOR dem Tonemapping. Vorher hing sie an
        // `dithering_fragment` — also NACH `tonemapping_fragment` UND nach der sRGB-Kodierung: ein
        // Faktor 1,9 auf einen fertig kodierten Wert kann nur noch clippen, und genau so sahen die
        // Bäume aus („die bäume/props sind überstrahlt", Georg 4.9.). Im linearen HDR davor nimmt
        // ACES denselben Faktor als HELLIGKEIT statt als Weiß, die Kenney-Farbe bleibt lesbar.
        const anker = sh.fragmentShader.indexOf('#include <tonemapping_fragment>') >= 0
          ? '#include <tonemapping_fragment>' : '#include <dithering_fragment>';
        if (sh.fragmentShader.indexOf(anker) >= 0) {
          sh.fragmentShader = sh.fragmentShader
            .replace('void main() {', PALETTE_GLSL + TINT_FRAG + '\nvoid main() {')
            .replace(anker, [
              // v16/L3c · Die Faerbung kommt vom WUERFEL, auf dem das Prop steht: dieselbe Rampe,
              // dieselbe Palette, dieselbe radiale Front. Multiplikativ, damit die Kenney-Farbe
              // erhalten bleibt und das Prop zur Welt GEHOERT statt angemalt zu sein.
              'vec3 gc = kfbGroundColor(vRampT, vCube);',
              // Textur auf ihren Wert ziehen, BEVOR der Weltton multipliziert — sonst kämpfen zwei
              // Paletten gegeneinander statt eine die andere zu färben.
              'if (uTexFlat > 0.0) { float kfbLum = dot(gl_FragColor.rgb, vec3(0.2126, 0.7152, 0.0722)); gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(kfbLum), uTexFlat); }',
              // 4.9. · 1,55 → 1,30: der Faktor lief auf ein Lampen-Budget von 1,146, das jetzt bei
              // 0,827 liegt (travel-stage). Multiplikatoren addieren sich nicht, sie MULTIPLIZIEREN
              // sich — wer nur einen von beiden korrigiert, korrigiert nichts.
              'gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * gc * 1.30, uTintAmt);',
              anker,
            ].join('\n'));
        }
        // v24/S4 · NEBEL, und zwar NACH der sRGB-Kodierung. Das Terrain ist ein rohes
        // ShaderMaterial und schreibt seinen Nebel unkodiert in den Puffer; ein Prop mit ACES und
        // Kodierung darüber landet bei derselben Mischung auf einem ANDEREN Pixel. Also hier, am
        // Ende der Kette: bei voller Dichte steht in beiden Shadern exakt `uFogColor`, und Boden
        // und Bewuchs enden am gleichen Horizont — genau das war Georgs Befund.
        // `vViewPosition` liefert die Tiefe: three definiert es als `-mvPosition.xyz`, also ist
        // `vViewPosition.z` dasselbe `-mvPosition.z`, mit dem das Terrain rechnet.
        if (sh.fragmentShader.indexOf('#include <dithering_fragment>') >= 0) {
          sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>', [
            'float pFogD = vViewPosition.z;',
            'float pFog = 1.0 - exp(-uFogDensity * uFogDensity * pFogD * pFogD);',
            'gl_FragColor.rgb = mix(gl_FragColor.rgb, uFogColor, clamp(pFog, 0.0, 1.0));',
            '#include <dithering_fragment>',
          ].join('\n'));
        }
      };
      mat.needsUpdate = true;
      // v24/S4 · **Das Tiefenmaterial des Schattenpasses.** Der Wurf wird nicht mit `mat` gerendert,
      // sondern mit einem Tiefen-Shader — und der kennt unsere Verformung nicht. Ohne ihn stände der
      // Schatten dort, wo das Prop OHNE Biegung, Auftrieb und Bodenwelle wäre: ein Baum, dessen
      // Schatten daneben liegt und beim Tanz nicht mitgeht. Dieselben Uniform-OBJEKTE, dieselbe
      // `begin_vertex`-Einspritzung — nur ohne den Normalen-Teil, den ein Tiefenpass nicht hat
      // (`beginnormal_vertex` steht in `depth_vert` nicht, der Ersetzungsversuch wäre ein stiller
      // Fehlschlag).
      const depthMat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
      depthMat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, motionU, paletteU, U);
        sh.vertexShader = sh.vertexShader
          .replace('void main() {', MOTION_GLSL + DEFORM + '\nvoid main() {\n' + MO_INJ)
          .replace('#include <begin_vertex>', BEGIN_INJ);
      };
      const geo = b.geo;
      geo.setAttribute('aKc1', new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4));
      geo.setAttribute('aKc2', new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4));
      geo.setAttribute('aKc3', new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4));
      // Kein Instanced-Attribut: die weiche Normale gehört der GEOMETRIE, nicht der Instanz.
      geo.setAttribute('aSN', new THREE.BufferAttribute(smoothNormals(geo), 3));
      const mesh = new THREE.InstancedMesh(geo, mat, cap);
      mesh.frustumCulled = false;   // ein globales Mesh umspannt die Welt — der Test ist sinnlos
      // v24/S4 · Werfen UND empfangen. Werfen ist der Auftrag („base-betonter Schatten"); empfangen
      // kostet hier nichts extra und beantwortet die naheliegende Nachfrage gleich mit: ein Baum,
      // der im Schatten eines größeren steht, ist dunkler.
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.customDepthMaterial = depthMat;
      mesh.count = 0;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      group.add(mesh);
      return { mesh, U, cap, depthMat, hatTex: !!b.mat.map };
    });
    return { base: def.base, name, kind: def.kind, w: def.w, bw: def.bw || {}, parts,
             height: size.y, hWelt: +(size.y * scale).toFixed(2), fpWelt: +(fp * scale).toFixed(2),
             korrektur, scale, bendable, rings,
             verts: baked.reduce((a, b) => a + b.geo.getAttribute('position').count, 0) };
  }

  /** Gewünschte Namensfassung für ein Biom, mit Rückfall auf die Grundfassung. */
  function resolve(def, biome) {
    if (!P.biomeLogic || !def.vary) return def.base;
    const suf = BIOME_VARIANT[biome] || '';
    if (!suf) return def.base;
    return urlOf(def.base + suf) ? def.base + suf : def.base;
  }

  /**
   * Index + Modelle laden. **Scheitert absichtlich weich**: was nicht lädt, fehlt eben, und der
   * Rest streut trotzdem. Ein einziges 404 darf nicht die Landschaft leer machen.
   */
  async function load(loader, biome, indexUrl) {
    const t0 = (typeof performance !== 'undefined' ? performance.now() : 0);
    // v24 · 5.9. · **`kfb-asset-library.json` ist die neue Quelle** (Georg: „statt asset repo gibts
    // jetzt die asset library"). Die Kette hat drei Glieder, und die Reihenfolge ist begründet:
    //  1. die LOKALE Datei — im Chat-Vorschau-Kontext da und ohne Netz, also der schnellste Start.
    //  2. die RAW-URL aus dem Repo — der einzige Weg, der im STANDALONE-Export funktioniert. Dort
    //     liegt keine 4,3-MB-JSON daneben (Export-Budget: keine Datei über 2 MB), und ein
    //     relativer Pfad würde still nichts laden — die Landschaft wäre leer und niemand wüsste,
    //     warum. Zwei Kandidaten, weil der Ort im Repo beim Schreiben dieser Zeile noch offen war.
    //  3. der alte `asset-repo.json` — Rückweg, nicht Nostalgie: andere Fassungen in diesem Projekt
    //     lesen ihn noch, und ein Start mit dem älteren Index ist besser als kein Start.
    // Beide Formate löst `urlOf` auf, siehe dort.
    if (!index) {
      const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
      /* v25.2s · **Der Ort im Repo ist jetzt bekannt** (Georg, 09.09., mit Link). Die beiden
         Kandidaten darunter waren Rateversuche aus der v24-Sitzung — sie bleiben stehen, kosten
         nichts und decken einen späteren Umzug ab, aber die erste Netzadresse ist die belegte:
         `skills/KFB Setup Game Design/kfb-asset-library (5).json`.
         Leerzeichen und Klammern sind prozentkodiert; roh gesendet antwortet GitHub mit 400.
         **Warum das gerade jetzt zählt:** im Standalone gibt es kein `./kfb-asset-library.json`
         daneben, und ohne diese Zeile stand dort „kein Asset-Index lesbar — keine Props",
         also eine Landschaft aus grauen Blöcken. Gemessen am 09.09. genau so. */
      const LIB_CANON = RAW + 'skills/KFB%20Setup%20Game%20Design/kfb-asset-library%20(5).json';
      const kette = [indexUrl, './kfb-asset-library.json', LIB_CANON, RAW + 'kfb-asset-library.json',
                     RAW + 'media/kfb-asset-library.json', './asset-repo.json'];
      for (const u of kette) {
        if (!u) continue;
        try { const r = await fetch(u); if (r.ok) { index = await r.json(); indexQuelle = u; break; } } catch (e) {}
      }
      if (!index) { console.warn('[props] kein Asset-Index lesbar — keine Props'); return false; }
      console.info('[props] Index: ' + ((index.assets || []).length) + ' Assets aus ' + indexQuelle
        + (index.generated ? ' (' + index.generated + ')' : ''));
    }
    const SET = PROP_SET;
    biomeNow = biome || '';
    const total = SET.reduce((a, d) => a + d.w, 0);
    const out = await Promise.all(SET.map((d) => {
      // Reserve ×2: die Gewichte gelten im Mittel, nicht in jedem Ausschnitt — ein Wald-Fleck
      // kann kurzzeitig doppelt so viele Bäume eines Typs verlangen.
      // v24 · ×4 für das Klein-Material: es trägt jetzt DOPPELT — es wird als Führer gewürfelt UND
      // als Begleiter im Cluster gesetzt. Sein Gewicht sagt nur das erste. Ohne die größere Reserve
      // liefe es zuerst gegen seine Kappe, und die Cluster wären still wieder einzelne Bäume — ein
      // Fehlschlag, der als Gestaltung ausgesehen hätte.
      const reserve = (d.kind === 'bush' || d.kind === 'small') ? 4 : 2;
      const cap = Math.max(24, Math.ceil((d.w / total) * P.budget * reserve));
      return loadOne(loader, d, resolve(d, biomeNow), cap)
        .catch((e) => { console.warn('[props] ' + d.base + ' nicht geladen: ' + e.message); return null; });
    }));
    out.forEach((m) => { if (m) models.push(m); });
    // v25/A1 · **Die Maßtabelle gehört in das Log, nicht in eine Behauptung.** Wer korrigiert wurde,
    // steht mit beiden Zahlen da — so ist beim nächsten „das wirkt zu klein" nachlesbar, ob das
    // Modell am Band hängt oder ob das Band falsch ist.
    const korr = models.filter((m) => m.korrektur);
    console.info('[props] Maße (h × Grundfläche in u): '
      + models.map((m) => m.base + ' ' + m.hWelt + '×' + m.fpWelt).join(' · '));
    if (korr.length) console.info('[props] Höhen-Band hat ' + korr.length + ' von ' + models.length
      + ' Modellen korrigiert: ' + korr.map((m) => m.base + ' ' + m.korrektur.war.toFixed(2)
      + ' → ' + m.korrektur.ist.toFixed(2) + ' u (' + m.korrektur.grund + ')').join(' · '));
    else console.info('[props] Höhen-Band: alle ' + models.length + ' Modelle lagen im Band');
    loadMs = Math.round((typeof performance !== 'undefined' ? performance.now() : 0) - t0);
    ready = models.length > 0;
    return ready;
  }

  /**
   * Standorte einsammeln und verteilen. Wird beim Chunk-Wechsel gerufen (bei Reisetempo also
   * etwa einmal pro Sekunde) — es schreibt nur Matrizen, kein Rebake.
   *
   * Die Modellwahl ist **gewichtete Wahl über einen Hash des ORTES**: derselbe Ort trägt immer
   * dasselbe Modell in derselben Krümmung. Ohne das stünde beim Zurückfliegen ein anderer Wald —
   * und „ich war schon hier" ist der halbe Sinn einer Landschaft (dieselbe Regel wie `stepAt`
   * und `regionAt`: Orte werden gerechnet, nicht vergeben).
   */
  function rebuild(terrain, biome) {
    if (!ready) return 0;
    const t0 = (typeof performance !== 'undefined' ? performance.now() : 0);
    const n = models.length;
    const counts = new Array(n).fill(0);
    const b = P.biomeLogic ? (biome || biomeNow) : '';
    const wts = models.map((m) => (b && m.bw[b] != null ? m.bw[b] : m.w));
    const wsum = wts.reduce((a, v) => a + v, 0) || 1;
    // v16/L3b · **Die Attribut-Arrays werden EINMAL geholt, nicht pro Standort.** Gemessen:
    // mit `getAttribute()` in der inneren Schleife kostete ein Aufbau 26 ms (1403 Standorte ×
    // 2 Teile × 3 Abfragen ≈ 8400 Namenssuchen); bei Reisetempo laeuft der Aufbau etwa einmal
    // pro Sekunde, das waren also anderthalb verlorene Bilder im Sekundentakt.
    const bufs = models.map((m) => m.parts.map((part) => {
      const g = part.mesh.geometry;
      return { mesh: part.mesh, a1: g.getAttribute('aKc1').array, a2: g.getAttribute('aKc2').array,
               a3: g.getAttribute('aKc3').array };
    }));
    let over = 0, total = 0;
    // v24 · Begleiter kommen NUR aus dem Klein-Material: ein zweiter Baum neben dem ersten wäre eine
    // Reihe, kein Cluster. Drücken die Biom-Gewichte das Klein-Material auf 0, gibt es eben keine
    // Begleiter — kein Ersatz aus den Bäumen, das wäre die Regel gegen sich selbst.
    const kleinIdx = [];
    models.forEach((m, i) => { if (m.kind === 'bush' || m.kind === 'small') kleinIdx.push(i); });

    /** EINE Instanz schreiben. Stand vorher inline im Standort-Rückruf; jetzt rufen es FÜHRER UND
     *  BEGLEITER — ein zweiter Setzweg wären zwei Formen, und die erste Abweichung hätte niemand
     *  gefunden, weil beide Wege „irgendwie Bäume" setzen.
     *  ⚠ Die Drehung kommt jetzt aus `rnd()` statt aus `r3`. `r3` treibt auch die GRÖSSE — Drehung
     *  und Größe waren damit gekoppelt, jeder große Baum stand gleich gedreht wie jeder andere
     *  große Baum. Das ändert bestehende Welten minimal; es war ein Fehler, keine Signatur. */
    function setze(k, x, z, top, sc, rnd, st) {
      const m = models[k];
      const slot = counts[k];
      if (slot >= m.parts[0].cap) { over++; return; }
      const sym = () => rnd() * 2 - 1;
      const bendX = sym() * P.bend, bendZ = sym() * P.bend;
      const leanX = sym() * P.lean, leanZ = sym() * P.lean;
      const taper = rnd() * P.taper;
      const twist = sym() * P.twist * Math.PI / 180;
      // aKc2.z war die Phase der alten eigenen Uhr. Sie ist jetzt ein 0..1-Zufall und streut den
      // VERZUG der Stauchung — dieselbe Zahl, andere Bedeutung, deshalb umbenannt.
      const lagJit = rnd();
      _p.set(x, top - m.height * sc * P.sink, z);
      _q.setFromAxisAngle(_yAxis, rnd() * Math.PI * 2);
      _s.set(sc, sc, sc);
      _m.compose(_p, _q, _s);
      const o = slot * 4;
      for (const bf of bufs[k]) {
        bf.mesh.setMatrixAt(slot, _m);
        const a1 = bf.a1, a2 = bf.a2, a3 = bf.a3;
        a1[o] = m.bendable ? bendX : 0; a1[o + 1] = m.bendable ? bendZ : 0;
        a1[o + 2] = leanX; a1[o + 3] = leanZ;
        // aKc2.w ist der RAMPENWERT des Würfels — daraus holt der Fragment-Shader die Bodenfarbe.
        a2[o] = taper; a2[o + 1] = m.bendable ? twist : 0; a2[o + 2] = lagJit; a2[o + 3] = st.rampT;
        // aKc3: Würfelmitte + Bewegungs-Seed + 1/Maßstab (siehe Shader-Kommentar). Ein Begleiter
        // liest DENSELBEN Würfel wie sein Führer — also tanzt die Gruppe als Gruppe.
        a3[o] = st.cubeX; a3[o + 1] = st.cubeZ; a3[o + 2] = st.mseed; a3[o + 3] = 1 / Math.max(1e-4, sc);
      }
      counts[k]++; total++;
    }

    siteCount = terrain.propSites((st) => {
      if (total >= P.budget) { over++; return; }
      // Form dieser Instanz aus den ZELL-Koordinaten (nicht aus x/z): die tragen den Jitter der
      // Dichte, und dann würde ein Dichte-Regler die Formen aller Props umwerfen.
      const rnd = mulberry32(((st.cell * 73856093) ^ (st.cellZ * 19349663)) >>> 0);
      // v24 · 5.9. · **Die Modellwahl zieht aus mulberry32, nicht mehr direkt aus `st.r2`.**
      // Gemessen mit dem erweiterten Set: `log` (Gewicht 5 von 143, also 3,5 %) kam in 1471
      // Standorten NULL mal, und die Häufigkeiten folgten den Gewichten nicht (tree_default,
      // höchstes Gewicht, lag bei 101 — tree_pineTallA mit weniger Gewicht bei 213).
      // `hash2` ist als Dichte-SCHWELLE gut (ein Vergleich gegen eine Zahl); als VERTEILUNG über
      // zwanzig Gewichtsbänder ist es zu grob. Ein Modell, das nie erscheint, ist kein Modell —
      // und der Fehler wächst mit dem Set, das heißt er wäre bei 9 Modellen unentdeckt geblieben.
      let acc = rnd() * wsum, k = 0;
      while (k < n - 1 && acc > wts[k]) { acc -= wts[k]; k++; }
      setze(k, st.x, st.z, st.top, models[k].scale * (1 + (rnd() - 0.5) * 2 * P.sizeJitter), rnd, st);
      // ── CLUSTER (rule of three). Der WÜRFEL entscheidet, nicht ein Zähler: dieselbe Zelle ergibt
      // dieselbe Gruppe, in jeder Sitzung — sonst wäre „da stand eine schöne Gruppe" nicht
      // reproduzierbar, und ein Befund ohne Reproduktion ist eine Anekdote.
      const wurf = rnd();
      // v25/A5 · `P.cluster` 0 schaltet die Gruppen ab (Georg, 5.9.: „wenn wir damit Performanz
      // gewinnen, können wir die Gruppen erstmal rauslassen"). Der Wert ist ein FAKTOR auf die
      // Begleiter-Wahrscheinlichkeit, damit man dazwischen messen kann statt nur an/aus.
      const chance = (1 - CLUSTER.einzeln) * P.cluster;
      const begleiter = wurf >= chance ? 0 : (wurf < chance * (CLUSTER.paar / (1 - CLUSTER.einzeln)) ? 1 : 2);
      if (!begleiter || !kleinIdx.length) return;
      for (let i = 0; i < begleiter; i++) {
        if (total >= P.budget) { over++; return; }
        const bk = kleinIdx[Math.floor(rnd() * kleinIdx.length) % kleinIdx.length];
        const a = rnd() * Math.PI * 2;
        const d = CLUSTER.abstandMin + rnd() * (CLUSTER.abstandMax - CLUSTER.abstandMin);
        const bs = models[bk].scale * CLUSTER.begleiterSkala[i] * (1 + (rnd() - 0.5) * 2 * P.sizeJitter);
        // Dieselbe Höhe wie der Führer: der Begleiter bleibt in der 3-u-Zelle, steht also auf
        // DEMSELBEN Würfel. Ein Versatz über die Zellgrenze hätte eine falsche Bodenhöhe.
        setze(bk, st.x + Math.cos(a) * d, st.z + Math.sin(a) * d, st.top, bs, rnd, st);
      }
    });
    models.forEach((m, k) => {
      for (const part of m.parts) {
        part.mesh.count = counts[k];
        part.mesh.instanceMatrix.needsUpdate = true;
        part.mesh.geometry.getAttribute('aKc1').needsUpdate = true;
        part.mesh.geometry.getAttribute('aKc2').needsUpdate = true;
        part.mesh.geometry.getAttribute('aKc3').needsUpdate = true;
      }
    });
    placed = total; lastOver = over;
    buildMs = Math.round(((typeof performance !== 'undefined' ? performance.now() : 0) - t0) * 10) / 10;
    return placed;
  }

  return {
    name: 'prop-scatter', version: PS_VERSION, group,
    load, rebuild,
    get ready() { return ready; },
    // v16/L3d · **`update` ist absichtlich leer geworden.** Die Stauchung laeuft am geteilten
    // `uTime` des Terrains (ueber `kfbBobAt`), also gibt es keinen eigenen Takt mehr, den jemand
    // vorwaerts drehen muesste. Die Methode bleibt, damit der Aufrufer im Frame-Ablauf nichts
    // aendern muss — und weil ein stiller Fehlschlag schlimmer waere als eine Zeile, die erklaert,
    // warum hier nichts passiert.
    update() {},
    get tintGain() { return TINT_GAIN; },
    // `setTint` ist ab ps-v1.1 **absichtlich leer**: die Prop-Farbe kommt nicht mehr aus einer
    // gesetzten Farbe, sondern aus dem WÜRFEL, auf dem das Prop steht (`kfbGroundColor`, geteilte
    // Paletten-Uniforms). Die Methode bleibt, damit alte Aufrufer nicht brechen — ein stiller
    // Fehlschlag wäre schlimmer als eine Zeile, die nichts tut und sagt, warum.
    setTint() {},
    setParams(next) {
      Object.assign(P, next || {});
      models.forEach((m) => m.parts.forEach((p) => {
        p.U.uKcMix.value = m.bendable ? P.mix : 0;
        p.U.uKcSquashAmt.value = P.squash;
        p.U.uKcSquashSpd.value = P.squashSpeed;
        p.U.uKcLag.value = P.squashLag;
        p.U.uKcLagJit.value = P.squashLagJitter;
        p.U.uKcProp.value = P.prop;
        p.U.uKcStretch.value = P.stretch;
        p.U.uKcWhipLean.value = P.whipLean;
        p.U.uKcArc.value = P.arc;
        p.U.uTintAmt.value = P.tint;
        // `hatTex` entscheidet, nicht der Regler: ein Material ohne Textur bleibt bei 0.
        p.U.uTexFlat.value = p.hatTex ? P.texFlat : 0;
        p.U.uRound.value = P.round;
        p.U.uInflate.value = P.inflate;
      }));
    },
    get params() { return P; },
    get biome() { return biomeNow; },
    /** Nach einem Weltwürfel (neues Biom) die Namensfassungen neu ziehen. */
    needsReload(biome) {
      if (!P.biomeLogic) return models.some((m) => m.name !== m.base);
      return models.some((m) => {
        const def = PROP_SET.find((d) => d.base === m.base);
        return def && resolve(def, biome) !== m.name;
      });
    },
    report() {
      return {
        version: PS_VERSION, geladen: models.length + '/' + PROP_SET.length,
        ladezeit: loadMs + ' ms', aufbau: buildMs + ' ms',
        drawCalls: models.reduce((a, m) => a + m.parts.length, 0),
        standorte: siteCount, gesetzt: placed, ueberBudget: lastOver, budget: P.budget,
        biom: biomeNow, biomLogik: P.biomeLogic,
        indexQuelle: indexQuelle,
        vertsGesamt: models.reduce((a, m) => a + m.verts, 0),
        modelle: models.map((m) => m.name + ' ×' + (m.parts[0] ? m.parts[0].mesh.count : 0)
          + ' · ' + m.rings + ' Ringe' + (m.bendable ? ' (biegt)' : ' (neigt)')),
        // v25/A1 · Die Maßtabelle ist ABFRAGBAR, nicht nur geloggt — sonst steht beim nächsten
        // „das wirkt zu klein" wieder Meinung gegen Meinung statt Zahl gegen Band.
        masse: models.map((m) => ({ base: m.base, kind: m.kind, h: m.hWelt, fp: m.fpWelt,
          korrigiert: m.korrektur ? m.korrektur.war.toFixed(2) + ' → ' + m.korrektur.ist.toFixed(2) + ' u (' + m.korrektur.grund + ')' : null })),
      };
    },
    dispose(scene) {
      models.forEach((m) => m.parts.forEach((p) => {
        p.mesh.geometry.dispose(); p.mesh.material.dispose(); group.remove(p.mesh);
      }));
      models.length = 0; ready = false;
      if (scene) scene.remove(group);
    },
  };
}
