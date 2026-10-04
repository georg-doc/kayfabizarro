/* KFB · S20 · Sample-Mapping KayKit Dungeon Pack 1.1 (FREE)
   Reverse Engineering der 13 Promobilder gegen das REGISTER, nicht gegen die Erinnerung.
   Namensquelle: registry/assets/v1/packs/kaykit-dungeon-pack-1-1-free-2.json → 207 gltf-Modelle.
   Jeder Name hier existiert im freien Pack, ausser er steht in `luecken` — dort steht, was im
   Bild zu sehen ist und im freien Pack FEHLT, plus die Vermutung woher es stammt.

   `unsicher` heisst: die Zuordnung ist aus dem Bild gelesen, nicht durch Laden bestätigt.
   Sie wird beim Nachbau bestätigt oder korrigiert — nicht vorher behauptet. */

export const PACK = 'kaykit-dungeon-pack-1-1-free-2';
export const FREI = 207;   // gltf-Modelle im freien Pack, gezählt im Register

/* ---------- Familien (alle 207 Namen, nach Rolle sortiert) ---------- */
export const FAMILIEN = [
  { id: 'wand', titel: 'Wand · 31', teile: ['wall', 'wall_half', 'wall_cracked', 'wall_broken', 'wall_pillar', 'wall_shelves', 'wall_sloped', 'wall_corner', 'wall_corner_small', 'wall_corner_gated', 'wall_corner_scaffold', 'wall_endcap', 'wall_half_endcap', 'wall_half_endcap_sloped', 'wall_Tsplit', 'wall_Tsplit_sloped', 'wall_crossing', 'wall_doorway', 'wall_doorway_sides', 'wall_doorway_Tsplit', 'wall_doorway_scaffold', 'wall_gated', 'wall_window_open', 'wall_window_closed', 'wall_window_open_scaffold', 'wall_window_closed_scaffold', 'wall_archedwindow_open', 'wall_archedwindow_gated', 'wall_archedwindow_gated_scaffold', 'wall_scaffold', 'wall_open_scaffold'] },
  { id: 'boden', titel: 'Boden · 34', teile: ['floor_tile_large', 'floor_tile_large_rocks', 'floor_tile_small', 'floor_tile_small_corner', 'floor_tile_small_decorated', 'floor_tile_small_broken_A', 'floor_tile_small_broken_B', 'floor_tile_small_weeds_A', 'floor_tile_small_weeds_B', 'floor_dirt_large', 'floor_dirt_large_rocky', 'floor_dirt_small_A', 'floor_dirt_small_B', 'floor_dirt_small_C', 'floor_dirt_small_D', 'floor_dirt_small_corner', 'floor_dirt_small_weeds', 'floor_wood_large', 'floor_wood_large_dark', 'floor_wood_small', 'floor_wood_small_dark', 'floor_tile_grate', 'floor_tile_grate_open', 'floor_tile_big_grate', 'floor_tile_big_grate_open', 'floor_tile_extralarge_grates', 'floor_tile_extralarge_grates_open', 'floor_tile_big_spikes', 'floor_foundation_allsides', 'floor_foundation_front', 'floor_foundation_front_and_back', 'floor_foundation_front_and_sides', 'floor_foundation_corner', 'floor_foundation_diagonal_corner'] },
  { id: 'treppe', titel: 'Treppe & Decke · 16', teile: ['stairs', 'stairs_long', 'stairs_narrow', 'stairs_wide', 'stairs_walled', 'stairs_wall_left', 'stairs_wall_right', 'stairs_modular_left', 'stairs_modular_center', 'stairs_modular_right', 'stairs_long_modular_left', 'stairs_long_modular_center', 'stairs_long_modular_right', 'stairs_wood', 'stairs_wood_decorated', 'ceiling_tile'] },
  { id: 'gelaender', titel: 'Brüstung & Säule · 9', teile: ['barrier', 'barrier_half', 'barrier_column', 'barrier_colum_half', 'barrier_corner', 'column', 'pillar', 'pillar_decorated', 'rubble_half'] },
  { id: 'schatz', titel: 'Schatz · 12', teile: ['chest', 'chest_gold', 'coin', 'coin_stack_small', 'coin_stack_medium', 'coin_stack_large', 'trunk_medium_A', 'trunk_medium_B', 'trunk_medium_C', 'trunk_large_A', 'trunk_large_B', 'trunk_large_C'] },
  { id: 'lager', titel: 'Lager · 11', teile: ['barrel_large', 'barrel_large_decorated', 'barrel_small', 'barrel_small_stack', 'keg', 'keg_decorated', 'box_large', 'box_small', 'box_small_decorated', 'box_stacked', 'crates_stacked'] },
  { id: 'moebel', titel: 'Möbel · 21', teile: ['table_long', 'table_long_broken', 'table_long_decorated_A', 'table_long_decorated_C', 'table_long_tablecloth', 'table_long_tablecloth_decorated_A', 'table_medium', 'table_medium_broken', 'table_medium_decorated_A', 'table_medium_tablecloth', 'table_medium_tablecloth_decorated_B', 'table_small', 'table_small_decorated_A', 'table_small_decorated_B', 'chair', 'stool', 'bed_decorated', 'bed_frame', 'bed_floor', 'shelf_large', 'shelf_small'] },
  { id: 'kleinzeug', titel: 'Geschirr & Kleinzeug · 20', teile: ['bottle_A_brown', 'bottle_A_green', 'bottle_A_labeled_brown', 'bottle_A_labeled_green', 'bottle_B_brown', 'bottle_B_green', 'bottle_C_brown', 'bottle_C_green', 'plate', 'plate_small', 'plate_stack', 'plate_food_A', 'plate_food_B', 'key', 'keyring', 'keyring_hanging', 'sword_shield', 'sword_shield_broken', 'sword_shield_gold', 'rubble_large'] },
  { id: 'licht', titel: 'Licht · 9 + Wandregal 2', teile: ['torch', 'torch_lit', 'torch_mounted', 'candle', 'candle_lit', 'candle_thin', 'candle_thin_lit', 'candle_melted', 'candle_triple', 'shelves', 'shelf_small_candles'] },
  { id: 'banner', titel: 'Banner · 42', teile: ['banner_blue · brown · green · red · white · yellow', 'banner_thin_*  (6)', 'banner_triple_* (6)', 'banner_patternA_* (6)', 'banner_patternB_* (6)', 'banner_patternC_* (6)', 'banner_shield_* (6)'] }
];

/* ---------- Die 13 Bilder ---------- */
export const SAMPLES = [
  {
    id: 's01', titel: 'Grundriss-Übersicht', bild: 'ref/samples/s01_overview.png',
    kamera: 'Isometrie von oben, ohne Decke — der Werbeschnitt des Packs',
    lesart: 'Zwei Gebäudeflügel, versetzt über eine Diagonale verbunden. Wandzüge laufen gerade durch, Ecken sind rechtwinklig, jeder Raum hat 2×2 Module oder mehr. Genau die Grammatik, die S13.2 erzeugt.',
    boden: ['floor_tile_large', 'floor_dirt_large', 'floor_tile_small'],
    huelle: ['wall', 'wall_cracked', 'wall_corner', 'wall_doorway', 'wall_window_closed', 'wall_gated', 'wall_pillar', 'column', 'stairs', 'stairs_wide'],
    requisiten: [
      { gruppe: 'Lager', teile: ['barrel_large', 'barrel_small_stack', 'box_stacked', 'crates_stacked'] },
      { gruppe: 'Wohnen', teile: ['bed_decorated', 'table_long_tablecloth', 'chair', 'shelf_large'] },
      { gruppe: 'Schatz', teile: ['trunk_large_A', 'coin_stack_medium'] }
    ],
    licht: ['candle_lit', 'candle_triple', 'torch_mounted'],
    gruppen: ['Raumrolle je Zelle — Lager · Wohnen · Schatz · Essen'],
    luecken: [],
    notiz: 'Vertragsbild für DG2-B: der S13.2-Generator muss diesen Grundriss-Typ treffen, nicht diese Möblierung.'
  },
  {
    id: 's02', titel: 'Schatz- und Esskammer (Eckdiorama)', bild: 'ref/samples/s02_gold_dining.png',
    kamera: 'Diorama auf Fundamentplatte, zwei Wände, Blick von vorn-oben',
    lesart: 'Das Kernbild für die Schatzkammer im Brief: eine LESBARE Hauptkiste, drei Stufen Beute drumherum, Banner als Blickführung, Tür als sicherer Eintritt.',
    boden: ['floor_tile_large', 'floor_foundation_front_and_sides', 'floor_foundation_corner'],
    huelle: ['wall_doorway', 'wall_scaffold', 'wall_shelves', 'wall_corner', 'wall_pillar'],
    requisiten: [
      { gruppe: 'Hauptschatz', teile: ['chest_gold', 'trunk_large_A', 'coin_stack_large', 'coin_stack_medium', 'coin_stack_small', 'coin'], rolle: 'Ziel' },
      { gruppe: 'Gedeck', teile: ['table_medium_tablecloth', 'chair', 'stool', 'plate_stack', 'plate_food_A', 'bottle_A_green', 'candle_lit'] },
      { gruppe: 'Wandzier', teile: ['banner_yellow', 'banner_shield_red'] }
    ],
    licht: ['candle_lit', 'candle_melted'],
    gruppen: [
      'Truhe zu ⇄ Truhe offen: `chest` ausblenden, `chest_gold` + `coin_stack_*` einblenden (VFX Funken, SFX Deckelholz)',
      'Münzhaufen in drei Stufen — klein/mittel/gross als eine Gruppe, Stufe = Beutewert'
    ],
    luecken: [
      { was: 'geschlossene Truhe mit sichtbarem Schloss in der Grösse von `chest_gold`', ersatz: '`chest` + `trunk_large_*` prüfen', schwere: 'klein' }
    ],
    unsicher: 'GEKLÄRT am 2026-09-20 (siehe Post mortem pm6): beide Teile bringen ihren Deckel als eigenes Mesh mit (chest_lid / chest_gold_lid, Scharnier im Pivot). Offen ist eine Drehung, kein zweites Modell — chest_gold ist die goldgefüllte Variante (Körper bis y 1,04 gegen 0,60).',
    notiz: 'Erster Nachbaukandidat — kleinste Fläche, höchste Aussage.'
  },
  {
    id: 's03', titel: 'Zweigeschossiges Lager mit Freitreppe', bild: 'ref/samples/s03_storage_twolevel.png',
    kamera: 'Eckdiorama, zwei Ebenen, Brüstung als Kante',
    lesart: 'Der Beweis für den vertikalen Übergang: Treppe an der Wand, Brüstung entlang der Galeriekante, unten Lager, oben Vorrat. Genau die Ebenenlogik aus `dungeon-grid.js` (Fugenklasse `rail`).',
    boden: ['floor_tile_large', 'floor_wood_large', 'floor_foundation_front_and_sides'],
    huelle: ['wall', 'wall_cracked', 'wall_doorway', 'wall_scaffold', 'wall_corner', 'stairs_wide', 'stairs_walled', 'barrier', 'barrier_column', 'barrier_corner'],
    requisiten: [
      { gruppe: 'Lager unten', teile: ['barrel_large', 'barrel_small', 'box_large', 'box_small', 'crates_stacked', 'bottle_B_green'] },
      { gruppe: 'Galerie oben', teile: ['table_medium', 'plate_stack', 'bottle_A_green', 'chest_gold', 'box_small_decorated', 'shelf_small_candles'] },
      { gruppe: 'Bruch', teile: ['table_medium_broken', 'rubble_large', 'sword_shield_broken'] },
      { gruppe: 'Werkbank', teile: ['stool', 'keyring', 'candle_lit'] }
    ],
    licht: ['torch_mounted', 'candle_lit', 'shelf_small_candles'],
    gruppen: [
      'Ebene 0 ⇄ Ebene 1 als zwei Gruppen — Galerie ausblendbar für die Draufsicht',
      'zerbrochener Tisch: `table_medium` ⇄ `table_medium_broken` + `rubble_large` (VFX Staub, SFX Holzbruch)'
    ],
    licht_notiz: 'Zwei `torch_mounted` links und rechts der Tür werfen im Bild echten warmen Abfall auf die Wand — in `dungeon-light.js` sind das zwei Punktlichter mit Flacker.',
    luecken: [],
    notiz: 'Zweiter Nachbaukandidat — prüft Treppe, Brüstung und zwei Ebenen in einem Bild.'
  },
  {
    id: 's04', titel: 'Bibliothek / Alchemistenraum', bild: 'ref/samples/s04_library.png',
    kamera: 'Vier Wände, Deckel offen, Blick frontal-oben',
    lesart: 'Requisitendichte am oberen Ende: Regale an drei Wänden, Tisch in der Mitte, Boden bewusst vermüllt. Der Boden erzählt mit — gesprungene Platten und Unkrautfugen.',
    boden: ['floor_tile_large', 'floor_tile_small_broken_A', 'floor_tile_small_weeds_A', 'floor_tile_small_weeds_B'],
    huelle: ['wall', 'wall_shelves', 'wall_scaffold', 'wall_corner', 'wall_cracked'],
    requisiten: [
      { gruppe: 'Bibliothek', teile: ['shelf_large', 'shelf_small', 'shelves', 'table_long', 'chair', 'stool'] },
      { gruppe: 'Alchemie', teile: ['bottle_A_green', 'bottle_B_green', 'bottle_C_brown', 'bottle_A_labeled_brown'] },
      { gruppe: 'Kisten', teile: ['box_large', 'box_small', 'trunk_medium_A'] },
      { gruppe: 'Schlüsselbund', teile: ['keyring', 'keyring_hanging', 'key'] }
    ],
    licht: ['candle_lit', 'candle_thin_lit', 'candle_melted', 'candle_triple'],
    gruppen: ['Kerzenbestand als eine Gruppe — Anzahl steuert die Stimmung, nicht die Lampenfarbe'],
    luecken: [
      { was: 'lose Bücher, aufgeschlagen und gestapelt, als Einzelteile auf Tisch und Boden', ersatz: 'im freien Pack steckt jedes Buch IM Regalmodell — kein `book`-Einzelteil', schwere: 'mittel' },
      { was: 'grüne Pflanzenbüschel auf dem Boden', ersatz: 'nur als Bodenkachel `floor_tile_small_weeds_A/B` vorhanden, nicht als Streuobjekt', schwere: 'klein' }
    ],
    notiz: 'Zeigt die Grenze: Requisitendichte im Bild > Einzelteilbestand im freien Pack.'
  },
  {
    id: 's05', titel: 'Schatzkammer (Breitbild)', bild: 'ref/samples/s05_treasury.png',
    kamera: 'Drei Wände, sehr flacher Blick — Bühnenbild statt Grundriss',
    lesart: 'Die reine Schatzkammer. Ein Läufer aus `floor_wood_large` führt zum Haufen in der Mitte; alles andere ist Umrahmung. Das ist die „freie Zielsicht" aus DG2-C, gebaut mit Bodenmaterial statt Geometrie.',
    boden: ['floor_tile_large', 'floor_wood_large', 'floor_foundation_front', 'floor_foundation_diagonal_corner'],
    huelle: ['wall_doorway', 'wall_scaffold', 'wall_pillar', 'wall_corner', 'column'],
    requisiten: [
      { gruppe: 'Haufen (Ziel)', teile: ['coin_stack_large', 'coin_stack_medium', 'coin_stack_small', 'coin'], rolle: 'Ziel' },
      { gruppe: 'Behälter', teile: ['chest_gold', 'trunk_large_A', 'trunk_large_B', 'trunk_medium_A', 'box_small', 'barrel_small'] },
      { gruppe: 'Wandzier', teile: ['banner_yellow', 'banner_thin_yellow', 'banner_shield_red'] },
      { gruppe: 'Ablage', teile: ['table_medium', 'table_small'] }
    ],
    licht: [],
    gruppen: [
      'Beutestufe 1–3: Anzahl `coin_stack_*` + Deckelzustand — eine Gruppe, drei Stufen',
      'Plünderung: Haufen ausblenden, `coin` einzeln als VFX-Aufsammelziel einblenden (SFX Münzklirren)'
    ],
    luecken: [
      { was: 'Münzen liegen im Bild auch auf den Mauerkronen', ersatz: 'machbar, aber nur per Handplatzierung — der Generator setzt nur in Zellen', schwere: 'klein' }
    ],
    notiz: 'Drittes Vorbild für DG2-C. Die Lesbarkeit kommt vom Läufer, nicht von der Menge.'
  },
  {
    id: 's06', titel: 'Festungsaussenseite am Wasser', bild: 'ref/samples/s06_fortress_water.png',
    kamera: 'Aussenansicht, Wasserfläche vorn',
    lesart: 'Zeigt die Aussenseite der gleichen Wandteile: vergitterte Bogenfenster in zwei Reihen, aussenliegende Treppe, Zinnenkrone. Die Wasserfläche ist Fremdmaterial.',
    boden: ['floor_tile_large', 'floor_foundation_allsides', 'floor_tile_extralarge_grates'],
    huelle: ['wall', 'wall_cracked', 'wall_archedwindow_gated', 'wall_corner', 'wall_doorway', 'stairs_wide', 'stairs_walled', 'barrier', 'barrier_half', 'ceiling_tile'],
    requisiten: [
      { gruppe: 'Hafenkram', teile: ['barrel_large_decorated', 'barrel_small', 'keg', 'table_small', 'chair', 'bottle_A_brown'] }
    ],
    licht: ['candle_lit'],
    gruppen: ['Gitterrost im Boden: `floor_tile_extralarge_grates` ⇄ `_open` als Falltür-Gruppe'],
    luecken: [
      { was: 'Wasserfläche und Wasser-Shader', ersatz: 'im Bild selbst als „water shader not included" ausgewiesen — eigene Fläche nötig', schwere: 'gross' },
      { was: 'Zinnenkrone als eigenes Teil', ersatz: 'gelesen als `barrier` + `barrier_half` auf der Mauerkrone — beim Nachbau zu bestätigen', schwere: 'klein' }
    ],
    unsicher: 'Ob die Zinnen `barrier`-Teile sind oder ein Mauerteil, das ich nicht erkenne.',
    notiz: 'Für den Raid uninteressant, für die Rückkehr-Naht (Portal/Tür nach draussen) das beste Vorbild.'
  },
  {
    id: 's07', titel: 'Grosse Halle, Draufsicht', bild: 'ref/samples/s07_hall_topdown.png',
    kamera: 'Nahe Draufsicht — der Grundriss selbst ist das Motiv',
    lesart: 'Das Gegenstück zu S04: fast leer. Ein Fass mit Münzen in der Mitte, eine Trennwand mit Endstück, ein vergittertes Fenster. Zeigt, dass ein Raum ohne Requisiten trägt, wenn der Boden variiert.',
    boden: ['floor_dirt_large', 'floor_tile_large', 'floor_dirt_large_rocky', 'floor_tile_small_weeds_A'],
    huelle: ['wall', 'wall_cracked', 'wall_corner', 'wall_endcap', 'wall_doorway', 'wall_gated', 'wall_pillar', 'wall_half'],
    requisiten: [
      { gruppe: 'Mitte', teile: ['barrel_large', 'coin_stack_small', 'coin'], rolle: 'Ziel' },
      { gruppe: 'Ecke', teile: ['barrel_large_decorated', 'barrel_small_stack'] },
      { gruppe: 'Streu', teile: ['rubble_large', 'rubble_half'] }
    ],
    licht: ['torch_mounted'],
    gruppen: ['Streuschutt als eigene Gruppe — Dichte ist ein Regler, kein Handwerk'],
    luecken: [],
    notiz: 'Beleg dafür, dass `wall_endcap` im 1.1-Bestand existiert und benutzt wird. S13.2 behauptet das Gegenteil.'
  },
  {
    id: 's08', titel: 'Vorratskeller mit Holztreppe', bild: 'ref/samples/s08_cellar.png',
    kamera: 'Draufsicht, leicht gedreht',
    lesart: 'Reiner Lagerraum. Die Holztreppe endet an der Decke — der Aufgang nach oben ist angedeutet, nicht gebaut. Kerzenreihen auf der Mauerkrone markieren den Umriss.',
    boden: ['floor_dirt_large', 'floor_tile_large', 'floor_dirt_large_rocky'],
    huelle: ['wall', 'wall_cracked', 'wall_doorway', 'wall_corner', 'wall_endcap', 'stairs_wood', 'stairs_wood_decorated', 'column'],
    requisiten: [
      { gruppe: 'Fässer', teile: ['barrel_large', 'barrel_large_decorated', 'barrel_small', 'barrel_small_stack', 'keg', 'keg_decorated'] },
      { gruppe: 'Kisten', teile: ['box_large', 'box_small', 'box_stacked', 'crates_stacked', 'trunk_medium_B'] },
      { gruppe: 'Abfüllung', teile: ['table_long', 'bottle_A_green', 'bottle_B_green', 'plate_small'] },
      { gruppe: 'Schutt', teile: ['rubble_large', 'rubble_half'] }
    ],
    licht: ['candle_lit', 'candle_thin_lit', 'candle_triple'],
    gruppen: ['Fasslager als Stapelgruppe: gross → klein → Stapel, eine Regel statt drei Platzierungen'],
    luecken: [],
    notiz: 'Bestes Vorbild für die Rolle `lager` im Generator — und für Kerzen auf der Mauerkrone statt nur in der Ecke.'
  },
  {
    id: 's09', titel: 'Zwei Gefängniszellen', bild: 'ref/samples/s09_prison.png',
    kamera: 'Zwei getrennte Dioramen nebeneinander',
    lesart: 'Die Zelle ist eine Wandsorte, kein Raumtyp: `wall_gated` rundum, dazu eine Tür. Möblierung ist minimal und erzählt trotzdem.',
    boden: ['floor_tile_large', 'floor_tile_small_broken_A', 'floor_foundation_corner'],
    huelle: ['wall_gated', 'wall_corner_gated', 'wall_doorway', 'wall_corner', 'wall', 'pillar'],
    requisiten: [
      { gruppe: 'Pritsche', teile: ['bed_decorated', 'bed_frame', 'bed_floor'] },
      { gruppe: 'Nachttisch', teile: ['table_small', 'stool', 'box_small', 'plate', 'plate_small', 'bottle_A_brown'] },
      { gruppe: 'Kerzen', teile: ['candle_lit', 'candle_thin_lit'] }
    ],
    licht: ['candle_lit'],
    gruppen: ['Zelle belegt ⇄ leer: `bed_decorated` ⇄ `bed_floor` + Geschirr (VFX keiner, SFX Kettenrasseln)'],
    luecken: [
      { was: 'Gittertür, die sich öffnen lässt', ersatz: '`wall_gated` ist eine geschlossene Wand; `wall_doorway` bringt ein Türblatt im selben Modell mit (S13-Befund) — ein separates Gitterblatt fehlt', schwere: 'mittel' }
    ],
    notiz: 'Für den Raid: die Zelle ist der billigste Begegnungsraum — eine Fugenklasse, kein neues Layout.'
  },
  {
    id: 's10', titel: 'Mehrstufige Burganlage', bild: 'ref/samples/s10_keep_levels.png',
    kamera: 'Halbaufsicht, drei Höhenstufen',
    lesart: 'Der komplexeste Grundriss der Reihe: drei Ebenen, Treppe mittig, Brücke über den Hof, Nischen in der Wand. Zeigt `wall_shelves` als Nische statt als Regal.',
    boden: ['floor_tile_large', 'floor_tile_small', 'floor_foundation_front_and_back'],
    huelle: ['wall', 'wall_shelves', 'wall_sloped', 'wall_Tsplit_sloped', 'wall_half_endcap_sloped', 'wall_corner', 'wall_doorway', 'stairs_wide', 'stairs_long', 'barrier', 'barrier_column', 'barrier_half', 'column'],
    requisiten: [
      { gruppe: 'Schenke', teile: ['barrel_large', 'table_medium', 'bottle_A_green', 'bottle_B_green', 'keg', 'box_large'] },
      { gruppe: 'Gedeck oben', teile: ['table_long_tablecloth_decorated_A', 'plate_stack', 'plate_food_B', 'bottle_A_green'] },
      { gruppe: 'Nischen', teile: ['shelves', 'shelf_small_candles', 'candle_lit'] },
      { gruppe: 'Wandzier', teile: ['banner_patternA_red', 'banner_triple_red', 'keyring_hanging', 'sword_shield'] }
    ],
    licht: ['candle_lit', 'shelf_small_candles'],
    gruppen: ['Drei Höhenstufen als drei Gruppen — Schnittansicht durch Ausblenden, nicht durch Clipping'],
    luecken: [
      { was: 'abgeschrägte Mauerabschlüsse in dieser Menge', ersatz: 'vorhanden (`wall_sloped`, `wall_Tsplit_sloped`, `wall_half_endcap_sloped`) — aber von S13.2 nie gesetzt', schwere: 'keine' }
    ],
    notiz: 'Die Schräg-Familie ist der grösste ungenutzte Bestand im Pack. Drei Teile, die jede Aussenkante besser aussehen lassen.'
  },
  {
    id: 's11', titel: 'Mine / Steinbruch', bild: 'ref/samples/s11_mine.png',
    kamera: 'Draufsicht, zwei Kammern',
    lesart: 'Das einzige Bild, das fast vollständig aus Fremdteilen besteht. Holzstützrahmen, Erzbrocken, Spitzhacke, Felsen — nichts davon ist im freien Dungeon-Pack.',
    boden: ['floor_dirt_large', 'floor_dirt_large_rocky', 'floor_tile_large'],
    huelle: ['wall', 'wall_doorway', 'wall_corner', 'wall_sloped', 'pillar'],
    requisiten: [
      { gruppe: 'gesichert vorhanden', teile: ['bed_decorated', 'table_small', 'box_large', 'bottle_A_brown', 'candle_lit', 'sword_shield', 'rubble_large'] }
    ],
    licht: ['candle_lit'],
    gruppen: ['Erzader abbaubar: Brocken ⇄ Schutt ⇄ leer (VFX Staub + Funken, SFX Hackenschlag)'],
    luecken: [
      { was: 'Holz-Stützrahmen (Stollentor) in drei Grössen', ersatz: 'kein Gegenstück im Pack', schwere: 'gross' },
      { was: 'Erzbrocken mit goldener Ader', ersatz: 'kein Gegenstück im Pack', schwere: 'gross' },
      { was: 'Spitzhacke', ersatz: 'kein Gegenstück im Pack — evtl. KayKit Resource Bits', schwere: 'mittel' },
      { was: 'Felsblöcke / Geröllhaufen in Kachelgrösse', ersatz: '`rubble_large` ist deutlich kleiner; `floor_dirt_large_rocky` deckt nur den Boden', schwere: 'mittel' },
      { was: 'Eimer', ersatz: 'kein Gegenstück im Pack', schwere: 'klein' }
    ],
    notiz: 'Nicht nachbaubar mit dem freien Pack. Steht hier, damit die Kauf-Entscheidung eine Grundlage hat.'
  },
  {
    id: 's12', titel: 'Vier-Räume-Schnitt', bild: 'ref/samples/s12_fourrooms.png',
    kamera: 'Halbaufsicht, vier Kammern über Eck',
    lesart: 'Das dichteste Bild: vier Raumrollen in einem Grundriss — Bibliothek, Alchemie, Schlafkammer, Speisesaal mit Zelle. Genau die Rollenverteilung, die `PROP_ROLES` in `dungeon-grid.js` meint.',
    boden: ['floor_wood_large', 'floor_tile_large', 'floor_tile_small', 'floor_dirt_large'],
    huelle: ['wall', 'wall_shelves', 'wall_gated', 'wall_corner', 'wall_doorway', 'wall_scaffold', 'wall_cracked', 'column'],
    requisiten: [
      { gruppe: 'Bibliothek', teile: ['shelf_large', 'shelves', 'table_medium', 'stool', 'candle_lit'] },
      { gruppe: 'Alchemie', teile: ['box_large', 'box_small_decorated', 'bottle_C_brown', 'bottle_A_labeled_brown', 'crates_stacked'] },
      { gruppe: 'Schlafkammer', teile: ['bed_decorated', 'table_small', 'plate', 'bottle_A_brown', 'candle_lit'] },
      { gruppe: 'Speisesaal', teile: ['table_long_tablecloth_decorated_A', 'plate_stack', 'plate_food_A', 'bottle_A_green', 'chair'] },
      { gruppe: 'Wandzier', teile: ['banner_shield_white', 'sword_shield', 'sword_shield_gold'] }
    ],
    licht: ['candle_lit', 'candle_thin_lit', 'torch_mounted'],
    gruppen: ['Vier Raumrollen als vier Rezepte — das ist die Vorlage für die Rezeptdatei in DG2-A'],
    luecken: [
      { was: 'Schinken / Braten als Einzelteil', ersatz: '`plate_food_A/B` bringen Essen nur auf dem Teller mit', schwere: 'klein' }
    ],
    notiz: 'Bestes Einzelbild für die drei geforderten Raumrezepte: Eingang, Übergang, Schatz — hier als vier Rollen vorgeführt.'
  },
  {
    id: 's13', titel: 'Taverne mit Theke (EXTRA 1.1)', bild: 'ref/samples/s13_tavern_extra.png',
    kamera: 'Eckdiorama',
    lesart: 'Trägt selbst den Aufdruck „EXTRA ONLY · NEW IN V1.1". Die modulare Theke, die runden Hocker, die runden Tische und die Küchenzeile sind nicht im freien Pack.',
    boden: ['floor_wood_large', 'floor_wood_large_dark', 'floor_tile_large'],
    huelle: ['wall', 'wall_scaffold', 'wall_shelves', 'wall_corner'],
    requisiten: [
      { gruppe: 'gesichert vorhanden', teile: ['barrel_large', 'barrel_small_stack', 'shelf_large', 'bottle_A_green', 'bottle_B_green', 'bottle_A_labeled_brown', 'plate_stack', 'plate_food_A', 'keyring', 'candle_lit'] }
    ],
    licht: ['candle_lit'],
    gruppen: [],
    luecken: [
      { was: 'modulare Theke (Ziegelkorpus, Ecke, Durchgang)', ersatz: 'EXTRA-Stufe', schwere: 'gross' },
      { was: 'runde Hocker und runde Tische', ersatz: 'EXTRA-Stufe — frei gibt es nur `stool` und eckige Tische', schwere: 'mittel' },
      { was: 'Küchenzeile mit Schubladen und Regalaufbau', ersatz: 'EXTRA-Stufe', schwere: 'gross' },
      { was: 'Braten, Fleischteller, Knochen', ersatz: 'EXTRA-Stufe', schwere: 'klein' }
    ],
    notiz: 'Der einzige echte Kaufgrund in dieser Reihe. Alles andere lässt sich frei bauen.'
  }
];

/* ---------- Was im freien Pack liegt und S13.2 nie anfasst ---------- */
export const UNGENUTZT = [
  { teil: 'wall_endcap · wall_half_endcap', warum: '`dungeon-grid.js` behauptet, das Pack habe kein Wandende — hat es. Freie Enden müssten nicht mehr als Fehler gezählt werden.' },
  { teil: 'wall_Tsplit · wall_doorway_Tsplit · wall_crossing', warum: 'Dieselbe Behauptung für T und Kreuz. Beide existieren; der BSP-Zwang auf reine Rechtecke ist damit eine Wahl, keine Notwendigkeit.' },
  { teil: 'wall_sloped · wall_Tsplit_sloped · wall_half_endcap_sloped', warum: 'Abgeschrägte Abschlüsse — im Promobild S10 tragend, im Generator nicht vorgesehen.' },
  { teil: 'stairs_modular_left/center/right · stairs_long_modular_*', warum: 'Neu in 1.1. Erlauben eine Treppe beliebiger Breite aus drei Teilen statt eines Monolithen.' },
  { teil: 'ceiling_tile', warum: 'Neu in 1.1. Ohne Decke ist jeder Innenraum eine Bühne, kein Raum — für eine Ego-Perspektive im Raid nötig.' },
  { teil: 'floor_tile_big_spikes', warum: 'Die vom Brief geforderte „lesbare Gefahr". Liegt im Pack und wird nirgends gesetzt.' },
  { teil: 'floor_tile_grate_open · floor_tile_big_grate_open · floor_tile_extralarge_grates_open', warum: 'Rost auf/zu als Paar — die fertige Falltür-Gruppe inklusive Zustandswechsel.' },
  { teil: 'wall_corner_gated · wall_archedwindow_gated', warum: 'Zellenecke und Gitterfenster: eine Zelle ohne neuen Raumtyp.' },
  { teil: 'floor_foundation_* (6)', warum: 'Die Sockelplatte, auf der JEDES Promobild steht. Ohne sie schwebt ein Diorama; mit ihr sieht ein Ausschnitt nach Absicht aus.' },
  { teil: 'trunk_* (6) · keg · keg_decorated · box_stacked', warum: 'Lager- und Schatzteile, die in der Kandidatenliste unter falschen Namen stehen und deshalb still herausfallen.' }
];

/* ---------- Namen, die S13.2 lädt, die es NICHT gibt ---------- */
export const TOTE_NAMEN = {
  quelle: 'lib/dungeon-grid.js · PROP_CANDIDATES',
  hinweis: 'Die Liste ist als Kandidatenliste gebaut und verliert falsche Namen still. Deshalb sind Räume ärmer als das Pack hergibt, ohne dass irgendwo ein Fehler steht.',
  paare: [
    ['barrel', 'barrel_large'], ['barrels', 'barrel_small_stack'], ['crate', 'box_large'],
    ['crate_small', 'box_small'], ['crates', 'crates_stacked'], ['box', 'box_large'],
    ['chest_open', '— existiert nicht; `chest` / `chest_gold` prüfen'], ['bed', 'bed_decorated'],
    ['table', 'table_medium'], ['bench', '— existiert nicht; `stool` / `chair`'],
    ['bookcase', 'shelf_large'], ['shelf', 'shelf_small'],
    ['bones', '— existiert nicht'], ['bone', '— existiert nicht'], ['skull', '— existiert nicht'],
    ['skulls', '— existiert nicht'], ['rubble', 'rubble_large'], ['rocks', 'floor_tile_large_rocks (Boden!)'],
    ['sack', '— existiert nicht'], ['sacks', '— existiert nicht'], ['pot', '— existiert nicht'],
    ['pots', '— existiert nicht'], ['bucket', '— existiert nicht'], ['ladder', '— existiert nicht'],
    ['coin_stack', 'coin_stack_small / _medium / _large'], ['stairs', 'stairs (ok)'],
    ['banner_shield_white', 'banner_shield_white (ok)']
  ]
};

/* ---------- Kaufliste ---------- */
export const KAUFLISTE = [
  { posten: 'KayKit Dungeon Pack — EXTRA-Stufe', wofuer: 'Taverne, modulare Theke, Küchenzeile, runde Möbel, Betten, Essen (Bild S13)', dringlichkeit: 'nur wenn eine Schenke gebraucht wird', deckt: ['s13'] },
  { posten: 'Minen-/Ressourcen-Teile (Stollenrahmen, Erz, Spitzhacke, Felsen, Eimer)', wofuer: 'Bild S11 vollständig', dringlichkeit: 'hoch, wenn die Mine eine Bühne werden soll', deckt: ['s11'] },
  { posten: 'KayKit Character Pack — Skeletons', wofuer: 'DG2-D verlangt echte, nachweisbare KayKit-Skelett-Mobs. Im Dungeon-Pack ist KEIN Charakter.', dringlichkeit: 'blockierend für den Raid', deckt: [] },
  { posten: 'Wasser-Shader / Wasserfläche', wofuer: 'Bild S06 — im Bild selbst als nicht enthalten ausgewiesen', dringlichkeit: 'niedrig, selbst baubar', deckt: ['s06'] },
  { posten: 'Bücher, Säcke, Töpfe, Eimer, Knochen als Einzelteile', wofuer: 'Requisitendichte in S04 und der Rolle `beinhaus`', dringlichkeit: 'mittel — die Rolle `beinhaus` hat im freien Pack kein einziges Teil', deckt: ['s04'] },
  { posten: 'Ton (SFX)', wofuer: 'Truhe, Münzen, Holzbruch, Kettenrasseln, Hackenschlag. Kein KayKit-Pack enthält Audio.', dringlichkeit: 'mittel — kurzfristig per WebAudio synthetisierbar', deckt: [] }
];


/* ---------- Post mortem · S21.1 (additiv, nichts oben gelöscht) ----------
   Georgs Befund am gebauten Raum, und was ihn verursacht hat. Steht hier, weil der Atlas die
   Stelle ist, an der die Lehren dieses Packs gesammelt werden — nicht im Commit-Text. */
export const POSTMORTEM = [
  {
    id: 'pm1', titel: 'Ich habe den Atlas geschrieben und mich nicht danach gerichtet',
    befund: 'S21 hat Requisiten nach Streuregeln verteilt statt die Vorlage abzumessen. Der Atlas sagt zu S02 ausdrücklich: Hauptkiste als Ziel, Gedeck als Leben, Banner als Blickführung. Gebaut wurde ein Tisch in der Mitte, Fässer an zufälligen Rändern und zwei Wandfackeln, die im Vorbild nicht existieren.',
    ursache: 'Kein mentales Modell VOR dem Bau. Die Rezeptdatei war von Anfang an eine Heuristik mit Zellversatz, keine Abmessung.',
    folge: 'R02 neu in Weltkoordinaten nach dem Bild; Modell zuerst in docs/MENTAL_MODEL_DIORAMA.md; R07 zurückgezogen, bis R02 sitzt.'
  },
  {
    id: 'pm2', titel: 'Das Türblatt entfernt — im Vorbild ist die Tür zu',
    befund: 'Der Durchgang war ein schwarzes Loch. Georg am Bild: du hast NICHTS vom Set verstanden.',
    ursache: 'Regel aus dem Generator blind übernommen: dort MUSS das Blatt raus, weil man durch die Fuge läuft (three.js raycastet auch unsichtbare Objekte, S13.2). In einem Diorama ist die Tür ein Bauteil, kein Weg.',
    folge: 'Das Blatt bleibt. Auf/Zu ist eine Gruppe wie Truhe auf/zu.'
  },
  {
    id: 'pm3', titel: 'Halbe Wände, weil die falsche Ecke gesetzt war',
    befund: 'Jedes Wandmodul neben der Ecke wurde zu wall_half. Im Promobild ist kein halbes Teil zu sehen.',
    ursache: 'wall_corner hat einen gemessenen Schenkel von 2,0 und frisst eine halbe Fuge. Das Pack hat aber auch wall_corner_small — im Register vorhanden, in S13 nie geprüft, im Generator nie benutzt.',
    folge: 'Die Eckenwahl entscheidet die Wandlänge: Schenkel wird gemessen, daraus folgt ganz oder halb.'
  },
  {
    id: 'pm4', titel: 'Requisiten steckten in der Wand und ineinander',
    befund: 'Neun Teile mit messbarer Durchdringung in die Wand, sieben ineinander (Goldstapel im Fass). Die Prüfzeile verglich nur Requisite gegen Requisite und blieb grün.',
    ursache: 'Die Freiraumrechnung aus assemble() — halbe Zelle minus GEMESSENE Wandfläche minus halbe Tiefe — wurde in buildRoom() nicht übernommen. Handgesetzte Offsets statt Rechnung.',
    folge: 'Zwei Durchgänge beim Bauen: klemmen gegen die Wandfläche, auseinanderschieben bei Überlappung. Die Prüfung zählt jetzt auch Requisite gegen Wand.'
  },
  {
    id: 'pm5', titel: 'Die Wurzel liegt in S13: geratene Namen wurden zu einer Aussage über das Pack',
    befund: 'KayKit_Dungeon_Model_S13.html probiert wall_end, wall_T, wall_cross, wall_arched, wall_corner_inner/outer, rubble_small, coin_stack, skull, bones, chandelier, brazier, door, gate, lever, sarcophagus, statue, altar, well, cage, anvil, spikes, trap — keiner dieser Namen existiert. Daraus wurde die härteste Regel des Modells: Wandzüge müssen geschlossen sein, es gibt kein Ende, kein T, kein Kreuz.',
    ursache: 'Ein Ladeversuch beantwortet nur, ob EIN NAME existiert — nicht, ob eine FUNKTION im Pack fehlt. Das Register wurde nie gelesen.',
    folge: 'Es gibt wall_endcap, wall_half_endcap, wall_Tsplit, wall_doorway_Tsplit, wall_crossing, wall_corner_small, floor_tile_big_spikes (die gesuchte Falle) und rubble_half. S13 ist damit in fünf Aussagen überholt; S20 ist die Korrektur, S13 bleibt als Irrtumsprotokoll stehen.'
  }
];

/* Nachtrag zum Post mortem, gemessen am 2026-09-20 (S21.4) */
POSTMORTEM.push({
  id: 'pm6',
  titel: 'Die offene Truhe ist kein zweites Modell — der Deckel ist ein eigenes Mesh',
  befund: 'chest und chest_gold messen identisch 1,70 × 1,30 × 1,45. Daraus liess sich schliessen, das Pack habe gar keine offene Truhe — und die Gruppe "Truhe offen" sei eine leere Behauptung.',
  ursache: 'Die Boxmessung sieht nur die Hülle. Im Bauteil stecken ZWEI Meshes: chest_gold und chest_gold_lid, Scharnier im Pivot bei y 0,50 / z −0,56 — dieselbe Bauart wie wall_doorway mit seinem Türblatt. Der Körper verrät es auch: chest_gold reicht bis y 1,04, chest nur bis 0,60; die Differenz ist das Gold in der Truhe.',
  folge: 'Aufklappen ist eine Drehung am Teil des Packs (deckel: −105°), keine Eigengeometrie und kein Kaufgrund. Regel daraus: bevor ein Teil als fehlend gilt, erst die MESHNAMEN lesen — die Box lügt nicht, sie sagt nur zu wenig.'
});

POSTMORTEM.push({
  id: 'pm7',
  titel: 'Erst die Grundfläche messen, dann möblieren',
  befund: 'Der Nachbau stand in der Deckungssicht deutlich höher im Bild als die Vorlage (Silhouette 0,60 gegen 0,57), ein Holzbalken steckte in der Raumecke, und die offene Truhe hatte keinen Platz für ihren Deckel.',
  ursache: 'Die Bodenplatte war mit 2 × 2 Modulen zu klein angesetzt. Bei kleinerer Platte muss die Kamera näher heran, also wachsen die Wände im Bild — und das Wandmodul an der Ecke war eines MIT Holzrahmen statt einer glatten Wand.',
  folge: 'Drei Module je Wandzug, Platte 12 × 12, Eckmodul glatt. Gemessen danach: Silhouette 0,576 gegen Vorlage 0,57, Kamerahöhe löst sich auf 0,294 statt auf einen erzwungen flachen Winkel, Blickfang 96 % sichtbar. Regel: die Grundfläche ist die erste Messung eines Nachbaus, nicht die letzte.'
});
