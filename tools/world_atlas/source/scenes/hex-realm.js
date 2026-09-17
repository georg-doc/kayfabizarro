/* KayKit Medieval Hexagon Pack · Inventar + Insel-Rezept (S11.3)

   MENTALES MODELL DES PACKS (gemessen, nicht geraten — lib/hex-grid.js EDGE_MASKS/COAST_EDGES,
   tools/scan-hex-render.html):

   1 TERRAIN ist die Grundschicht. `hex_grass` und `hex_water` sind volle Sechsecke, Deckfläche
     y = 0, Körper hängt darunter. Eine Insel ist eine zusammenhängende Menge Gras-Zellen; das
     offene Meer ist das, was NICHT auf der Karte steht (void) — die blaue Fläche unter allem.

   2 ANSCHLÜSSE sind ein 6-Bit-Muster je Kachel (Bit 0 O, 1 SO, 2 SW, 3 W, 4 NW, 5 NO). Die 13
     Straßenkacheln A…M sind genau die 13 nichtleeren Kantenmengen eines Sechsecks bis auf
     Drehung — das Set ist vollständig. Flüsse haben 12 davon (keine Einzelkante = keine
     Quellkachel).

   3 NETZE SIND KETTEN, KEINE ZELLENMENGEN. Das war der Konzeptfehler in S11.2: Straße und Fluss
     lagen als Menge von Zellen vor, und die Anschlussmaske kam aus der Nachbarschaft IN DIESER
     MENGE. Damit ist „benachbart, aber nicht verbunden" nicht ausdrückbar, zwei Wege verschmelzen
     zufällig zur Kreuzung, und ein Sprung in der Liste erzeugt lautlos zwei Sackgassen. Jetzt ist
     jedes Netz eine Folge kantenbenachbarter Zellen; Kreuzungen entstehen nur dort, wo sich
     Ketten absichtlich eine Zelle teilen. Jede Kette wird auf Adjazenz geprüft.

   4 STRASSEN ENDEN AN HÄUSERN. Eine Straße, die in der Wiese aufhört, ist kein Entwurf, sondern
     ein Versehen — deshalb ist „jedes Kettenende ist eine Gebäudezelle" eine Prüfung, keine
     Absicht. Eine Straße kreuzt den Fluss nicht: das FREE-Pack hat keine Brücke und keine Furt.

   5 UFER ist eine Kachel, die die Landzelle ERSETZT und ihr eigenes Wasser mitbringt (Oberkante
     wie hex_water). Sand ist kein Rand, sondern die Fortsetzung der Strandlinie zur Nachbar-
     kachel: nur die Wassermaske muss exakt stimmen, eine Landkante darf Wiese oder Sand sein.
     Realisierbar sind nur ZUSAMMENHÄNGENDE Seeläufe von 2, 3 oder 4 Kanten (B, C, D). Für eine
     einzelne Seekante gibt es keine Kachel — eine Karte, die das verlangt, wird normalisiert
     (hex-grid.js normaliseShore), nicht halb gebaut.

   6 AUFBAUTEN BRAUCHEN INNENZELLEN. Eine Küstenkachel ist zur Hälfte Wasser; ein Haus darauf
     hängt über der See. Deshalb liegt die Insel hier einen Ring weiter draußen als die bebauten
     Zellen, und jede Gebäude-, Natur- und Requisitenzelle hat sechs Landnachbarn.

   7 HÖHE: `hills_A…C` sind erhöhte Plateaus, `mountain_A…C` Felsmassive — beides liegt AUF einer
     Graszelle. Bäume/Felsen/Requisiten stehen auf y = 0.

   8 WAS FEHLT (FREE-Tier, per Ladeversuch bestätigt): Felder/Acker, Stadtmauern, Zäune, Brücken,
     Marktstände, Belagerungsgerät. Die gelben Feldkacheln, Mauern und die Steinbrücke aus
     `Samples/sample2.jpg` sind hier deshalb NICHT nachgebaut. */

export const PARTS = {
  base: ['hex_grass', 'hex_water'],
  coast: ['hex_coast_A', 'hex_coast_B', 'hex_coast_C', 'hex_coast_D', 'hex_coast_E'],
  coastWaterless: ['hex_coast_A_waterless', 'hex_coast_B_waterless', 'hex_coast_C_waterless', 'hex_coast_D_waterless', 'hex_coast_E_waterless'],
  rivers: ['hex_river_A', 'hex_river_B', 'hex_river_C', 'hex_river_D', 'hex_river_E', 'hex_river_F',
    'hex_river_G', 'hex_river_H', 'hex_river_I', 'hex_river_J', 'hex_river_K', 'hex_river_L'],
  riversWaterless: ['hex_river_A_waterless', 'hex_river_B_waterless', 'hex_river_C_waterless', 'hex_river_D_waterless',
    'hex_river_E_waterless', 'hex_river_F_waterless', 'hex_river_G_waterless', 'hex_river_H_waterless',
    'hex_river_I_waterless', 'hex_river_J_waterless'],
  roads: ['hex_road_A', 'hex_road_B', 'hex_road_C', 'hex_road_D', 'hex_road_E', 'hex_road_F', 'hex_road_G',
    'hex_road_H', 'hex_road_I', 'hex_road_J', 'hex_road_K', 'hex_road_L', 'hex_road_M'],
  buildings: ['building_castle', 'building_church', 'building_windmill', 'building_watermill', 'building_market',
    'building_blacksmith', 'building_mine', 'building_lumbermill', 'building_barracks', 'building_well',
    'building_tavern', 'building_home_A', 'building_home_B', 'building_tower_A', 'building_tower_B'],
  colours: ['blue', 'green', 'red', 'yellow'],
  nature: ['tree_single_A', 'tree_single_B', 'rock_single_A', 'rock_single_B', 'rock_single_C', 'rock_single_D',
    'rock_single_E', 'hills_A', 'hills_B', 'hills_C', 'mountain_A', 'mountain_B', 'mountain_C'],
  props: ['barrel', 'ladder', 'sack', 'target', 'tent', 'wheelbarrow']
};

export const PACK_OF = { hex_grass: 'hex_base', hex_water: 'hex_base' };
for (const n of PARTS.coast) PACK_OF[n] = 'hex_coast';
for (const n of PARTS.coastWaterless) PACK_OF[n] = 'hex_coastw';
for (const n of PARTS.rivers) PACK_OF[n] = 'hex_river';
for (const n of PARTS.riversWaterless) PACK_OF[n] = 'hex_riverw';
for (const n of PARTS.roads) PACK_OF[n] = 'hex_roads';
for (const n of PARTS.nature) PACK_OF[n] = 'hex_nature';
for (const n of PARTS.props) PACK_OF[n] = 'hex_props';
const BLD_PACK = { blue: 'hex_bld_b', green: 'hex_bld_g', red: 'hex_bld_r', yellow: 'hex_bld_y' };
export const bldRef = (kind, colour) => `${BLD_PACK[colour]}:${kind}_${colour}`;

/* ---------- Terrain: g Gras · . offenes Meer (odd-r Offset) ----------
   Der Umriss ist ein HEX-KREIS (Radius 6 um Zelle 6,6) — und das ist die Konsequenz aus der
   Uferschicht, keine Bequemlichkeit. Eine Uferkachel ersetzt die Landzelle und bringt ihr
   eigenes Wasser mit: B hat vier Landkanten, C nur drei, D nur zwei. Ein beliebig gezeichneter
   Umriss erzeugt lauter C- und D-Randzellen, und der Rand zerfällt zu Zacken — genau die
   Sägezahnküste aus S11.3. Ein Hex-Kreis hat sechs GERADE Seiten (jede Zelle zwei Seekanten,
   also B) und sechs Ecken (drei Seekanten, also C): 36 Randzellen, davon 30 glatt.
   Der Binnensee ist weg, weil seine Uferzellen fast alle eine EINZELNE Wasserkante verlangten
   und es dafür keine Kachel gibt. Das offene Meer ist die einzige Wasserquelle.
   Alles Bebaute liegt bei Radius ≤ 5, also einen Ring innerhalb des Strands. */
export const TERRAIN = [
  '...ggggggg...',
  '..gggggggg...',
  '..ggggggggg..',
  '.gggggggggg..',
  '.ggggggggggg.',
  'gggggggggggg.',
  'ggggggggggggg',
  'gggggggggggg.',
  '.ggggggggggg.',
  '.gggggggggg..',
  '..ggggggggg..',
  '..gggggggg...',
  '...ggggggg...'
];

/* Fluss: Quelle am Westrand, Mündung am Ostrand, mit einem Knick nach Nordosten — eine gerade
   Linie quer durch die Insel las sich als Kanal. Ein Fluss von Rand zu Rand TEILT eine Insel
   zwangsläufig: das ist Topologie, kein Versehen. Also hat diese Insel zwei Hälften und zwei
   Straßennetze, und der Süden trägt seinen eigenen Weiler, statt eine Brücke zu erfinden, die
   das Pack nicht hat. Quelle und Mündung bekommen GENAU EINE Seekante als zweite Öffnung
   (hex-grid.js endSeaEdge) — mit allen Seekanten franste die Quelle dreifach in die Klippe. */
export const RIVER_CHAINS = [
  { id: 'hauptfluss', cells: [[0, 5], [1, 5], [2, 6], [3, 6], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 6], [10, 6], [11, 6], [12, 6]] }
];

/* Straßennetz als Ketten. Jedes Ende ist eine Gebäudezelle (Prüfung, nicht Absicht), jede
   Kreuzung entsteht dort, wo sich zwei Ketten eine Zelle teilen — Markt (6,5) trägt vier
   Ketten und wird deshalb automatisch zum Kreuz. */
export const ROAD_CHAINS = [
  { id: 'burgweg',      cells: [[5, 2], [5, 3], [6, 4], [6, 5]] },            // Burg → Markt
  { id: 'turmweg',      cells: [[4, 2], [5, 2]] },                            // Turm A → Burg
  { id: 'wachweg',      cells: [[7, 3], [7, 4], [6, 5]] },                    // Turm B → Markt
  { id: 'schenke',      cells: [[6, 5], [6, 6]] },                            // Markt → Taverne
  { id: 'kirchweg',     cells: [[6, 5], [5, 5], [4, 5], [4, 4], [3, 4], [2, 4]] }, // Markt → Kirche → Sägewerk
  { id: 'kasernenweg',  cells: [[3, 4], [2, 5]] },                            // Kirche → Kaserne
  { id: 'gasse',        cells: [[3, 5], [3, 4]] },                            // Haus A → Kirche
  { id: 'muehlenweg',   cells: [[3, 8], [4, 8], [5, 8]] },                    // Haus B → Wassermühle → Schmiede
  { id: 'brunnenweg',   cells: [[5, 8], [5, 9], [5, 10]] },                   // Schmiede → Brunnen
  { id: 'windmuehle',   cells: [[5, 10], [6, 10], [7, 10]] }                  // Brunnen → Windmühle
];

export const BUILDINGS = [
  { cell: [5, 2], kind: 'building_castle', colour: 'blue' },
  { cell: [4, 2], kind: 'building_tower_A', colour: 'blue' },
  { cell: [7, 3], kind: 'building_tower_B', colour: 'blue' },
  { cell: [3, 4], kind: 'building_church', colour: 'blue' },
  { cell: [6, 5], kind: 'building_market', colour: 'blue' },
  { cell: [3, 5], kind: 'building_home_A', colour: 'red' },
  { cell: [6, 6], kind: 'building_tavern', colour: 'blue' },
  { cell: [2, 4], kind: 'building_lumbermill', colour: 'blue' },
  { cell: [2, 5], kind: 'building_barracks', colour: 'blue' },
  { cell: [3, 8], kind: 'building_home_B', colour: 'green' },
  { cell: [4, 8], kind: 'building_watermill', colour: 'blue' },   // am Fluss, nicht daneben
  { cell: [5, 8], kind: 'building_blacksmith', colour: 'blue' },
  { cell: [5, 10], kind: 'building_well', colour: 'blue' },
  { cell: [7, 10], kind: 'building_windmill', colour: 'yellow' }
];

/* Natur: nur Zellen bei Radius ≤ 5, keine Gebäude-, Straßen- oder Flusszelle.

   ZWEI KLASSEN, und das war der Fehler in S11.4: `hills_*` und `mountain_*` sind RASTERFESTE
   Sechseck-Plateaus — sie liegen auf genau einer Zelle, wie eine Kachel. Bäume und Felsen sind
   freie Requisiten und dürfen streuen. Beide lagen in derselben Schicht mit `shiftFor = 0.8`,
   also hat die Überlappungsentzerrung `mountain_B` um 0,74 von seiner Zelle geschoben (37 % der
   Kachelbreite, Unterseite sichtbar). Rasterfestes trägt jetzt `fixed: true` und wird wie eine
   Kachel behandelt.

   UND der Layoutfehler darunter: gemessen sind `mountain_B` 2,57 × 2,58 und `mountain_C`
   2,53 × 2,39 bei einem Zellabstand von 2,0. Zwei Massive auf NACHBARZELLEN müssen sich
   durchdringen — keine Entzerrung kann das retten, sie kann nur verschieben. Also haben Berge
   und Hügel jetzt mindestens **zwei Zellen Abstand** voneinander und von jedem Gebäude. */
export const GRID_FIXED = new Set(['hills_A', 'hills_B', 'hills_C', 'mountain_A', 'mountain_B', 'mountain_C']);
export const NATURE = [
  { cell: [7, 1], parts: ['mountain_A'] },
  { cell: [9, 2], parts: ['mountain_B'] },
  { cell: [10, 4], parts: ['mountain_C'] },
  { cell: [3, 3], parts: ['hills_A'] },
  { cell: [8, 5], parts: ['hills_B'] },
  { cell: [1, 7], parts: ['hills_C'] },
  { cell: [6, 3], parts: ['tree_single_A', 'tree_single_B', 'tree_single_A'] },
  { cell: [4, 3], parts: ['tree_single_B', 'tree_single_A'] },
  { cell: [5, 6], parts: ['tree_single_A', 'tree_single_B'] },
  { cell: [2, 7], parts: ['tree_single_B', 'tree_single_A'] },
  { cell: [6, 9], parts: ['tree_single_B', 'tree_single_A', 'tree_single_B'] },
  { cell: [6, 11], parts: ['tree_single_A', 'tree_single_B'] },
  { cell: [4, 9], parts: ['rock_single_A', 'rock_single_B'] },
  { cell: [6, 8], parts: ['rock_single_C'] },
  { cell: [8, 10], parts: ['rock_single_D', 'rock_single_E'] }
];

export const PROPS = [
  { cell: [5, 8], parts: ['barrel', 'ladder'] },
  { cell: [3, 5], parts: ['wheelbarrow'] },
  { cell: [5, 10], parts: ['sack'] },
  { cell: [6, 5], parts: ['tent', 'target'] }
];

export const scene = {
  id: 'CQ-S11_KAYKIT_HEX_REALM',
  label: 'KayKit Medieval Hexagon Pack · Hex-Insel mit gelöstem Ufer-, Fluss- und Straßennetz',
  reference: 'media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Samples/sample2.jpg',
  provenance: {
    repo: 'georg-doc/kayfabizarro',
    packRoot: 'media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf',
    format: 'gltf',
    license: 'CC0 · Kay Lousberg (License.txt im Pack)'
  }
};
