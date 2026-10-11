# RKIT · TD- und CS-Katalog (V-147 / V-149) gegen Track Core 0.16.3 (R1) · nur Liste, kein Bau

Stand 2026-10-11 · Bilder: `replies/REFS_TRACK_DETAILS_2026-10-11/TD1…TD5` und `replies/REFS_CITY_STREETS_2026-10-11/CS1…CS3` (V-149) · Farben zählen nicht (V-147) · uneindeutige Stellen in §6 (V-148)

Skins: race · town · country · dirt · cosmic (V-149). Bestand Town-Look: RKIT Gehweg Lauf 03 (Bord, Gehweg, Kantensteine) und hex_b7 (Bord einseitig, Haltebucht).

**Legende**

| Feld | Werte |
|---|---|
| Stand | **vorhanden**: Core baut es, Checks grün · **teilweise**: Geometrie oder Daten fehlen zum Teil · **fehlt** |
| Aufwand | **S** ≤ ½ Tag · **M** 1–2 Tage · **L** > 2 Tage (jeweils mit Tests + Teil 0) |
| Owner | C = Core-Geometrie bzw. Daten · L = Lab-Look (Town: RKIT) |

Zeilennummern beziehen sich auf `track-core.mjs` 0.16.3-s1.

## 1 · TD1 Renn-Kern (Skin race)

| # | Modul | Stand | Track Core | Lücke | Aufwand |
|---|---|---|---|---|---|
| 1 | Gerade Standard | vorhanden | STRAIGHT, `WIDTHS.STANDARD` 14,4 (`:14`) | – | – |
| 2 | Gerade breit | vorhanden | WIDTHS WIDE 18 / HERO 21,6 / HERO_XL 28,8 | – | – |
| 3 | Gerade kurz | vorhanden | STRAIGHT `length` frei, MC-Raster | – | – |
| 4 | 45°-Kurve | vorhanden | CURVE_EASE `turn: 45` | – | – |
| 5 | 90°-Kurve | vorhanden | CURVE_EASE `turn: 90` | – | – |
| 6 | S-Kurven-Paar | vorhanden | 2 × CURVE_EASE gegenläufig; OFFSET_S (`:300ff`) | – | – |
| 7 | Haarnadel | vorhanden | HAIRPIN_180 (`:313`) | – | – |
| 8 | Schikane-Paar | teilweise | OFFSET_S / CURVE_EASE-Folge | kein benanntes Makro; Kerb-Look an den Scheiteln fehlt (L) | S (Makro) |
| 9 | Markierungs-Logik Merge/Split | teilweise | Spur-Bänder laufen über Spurwechsel (`laneBands`, v0.13); FORK / JOIN / SPLIT_HALF / MERGE_HALF | **Pfeile fehlen** (= Skin-Schritt 3); Rennstrecke hat keine Spuren → §6 | M |
| 10 | Innerer Banden-Übergang | vorhanden | `barrierVis` je Seite als Verjüngung, ROUND_END `vis` (`:290`); Kreisel-Insel-Lauf | Look (L) | – |
| 11 | Äußerer Banden-Übergang | vorhanden | dto.; Kreisel-Ecken-Läufe durchgehend | – | – |
| 12 | Kerb-/Schulter-Verjüngung | vorhanden | WIDTH_STEP, params-Rampen (`shoulderW`, `sideL/R`) | Kerb-Varianten flach/rumble/sausage nur als Look (V-146) | – |
| 13 | End- / Startkappe | teilweise | ROUND_END / endTaper (KICKER, LANDING, Pit); Strang-Kappen im J17-Look | offenes Strecken-Ende als Kappe ohne Rampe → §6 | S–M |
| – | Verbinder (Snap) | vorhanden | Gelenke `joints`, Sockets `node/arm`, Mündung ≤ 1 mm (`node_mouth`) | – | – |
| – | Seitenprofil | vorhanden | 14 SLOTS (`:76`), KERB_SECTION | – | – |

## 2 · TD2 Straße (Skin town)

| # | Modul | Stand | Track Core | Lücke | Aufwand |
|---|---|---|---|---|---|
| 1 | Straße ohne Bord | vorhanden | COUNTRY (Bankett, Randlinie, LANES) | – | – |
| 2 | Straße mit Bord beidseitig | vorhanden | TOWN (Bord 0,35, Gehweg 4,9, Rinne 0,4) | – | – |
| 3 | Bord einseitig | vorhanden | `edge: {L, R}` je Seite (v0.16) | – | – |
| 4 | 90°-Straßenecke mit Gehweg | vorhanden | CURVE_EASE in TOWN; Ecken-Radius `corner` 9 | – | – |
| 5 | T-Kreuzung | vorhanden | JUNCTION 3 Arme | – | – |
| 6 | Kreuzung 4 Arme | vorhanden | JUNCTION 4 Arme, Zebra + Stopplinie in `city` | – | – |
| 7 | Zebrastreifen-Abschnitt | teilweise | Zebra nur am JUNCTION-Arm | Zebra auf freier Strecke fehlt (Markierungs-Daten) | S |
| 8 | Kleine Mittelinsel (erhaben) | teilweise | `median` als Abstand der Fahrtrichtungen (HIGHWAY 4,0) | erhabene Insel mit Bord + Enden fehlt → §6 | M |
| 9 | Bordabsenkung / Einfahrt | fehlt | – | Bord-Fenster mit abgesenktem Stück (wie Übergangs-Fenster `windows.kerb`) → §6 | M |
| 10 | Bankett (offener Rand) | vorhanden | COUNTRY `shoulder` = gravel, Randlinie | – | – |
| 11 | Straßen-Endkappe | teilweise | Wendeschleife (1-Arm-ROUNDABOUT, V-110) | Sackgasse ohne Wende widerspricht V-110 → §6 | – |
| 12 | Straße → Platz | fehlt | – | Kante zum Platz (Bord oder bündig) → §6 | M |
| – | Seitenprofil | vorhanden | TOWN-Körper `body.keys` (Bord, Gehweg, Kantenstein; RKIT Lauf 03) | – | – |

## 3 · TD3 Schotter / Off-Road (Skin dirt, neu)

Eine DIRT-Familie gibt es im Core nicht. Die Geometrie (Kurven, Kuppen, Breiten) ist familienunabhängig vorhanden. Es fehlen Querschnitt, Belag und Kante.

| # | Modul | Stand | Track Core | Lücke | Aufwand |
|---|---|---|---|---|---|
| – | **dirt-Querschnitt** (Berm bzw. Graslippe, Kies-Kante, Leitplanke optional) | fehlt | nächster Verwandter COUNTRY: gravel 1,0, verge_lip, ditch (`:122–124`) | neue Familie DIRT bzw. Skin `dirt` (Vorlagen-Zeile nötig) | **L** |
| 1–4, 6 | Gerade, kurz, 45°, 90°, S-Paar | teilweise | wie TD1 | nur der dirt-Querschnitt fehlt | (in DIRT) |
| 5 | Überhöhte Kurve (Berm) | teilweise | Querneigung `bankDeg` / autoBank vorhanden | äußere Berm-Lippe als Querschnitt fehlt → §6 | M |
| 7 | Hügel / Sprung | vorhanden | CREST, KICKER → AIR → LANDING (physikgeprüft) | – | – |
| 8 | Rillen-Gerade | – (Look) | – | Rillen = Lab-Look | L |
| 9 | Belag → Schotter (Verjüngung) | fehlt | TRANSITION_CATALOGUE ohne DIRT; `transitionEntry` lehnt race ↔ world ab (B6) | Katalog-Eintrag RACE ↔ DIRT bzw. TOWN ↔ DIRT (S4 v2 Übergangsfamilie 3) | M |
| 10 | Kante Kiesel | – (Look) | Rubbel-Streuung (SPEC_EDGE_RUBBLE_GRAMMAR_R1) | Lab bzw. RKIT | – |
| 11 | Kante Graslippe | teilweise | COUNTRY `verge_lip` | in DIRT übernehmen | (in DIRT) |
| 12 | Spurbreiten-Wechsel | vorhanden | WIDTH_STEP | – | – |
| 13 | Schotter-Endkappe | fehlt | ROUND_END nur race | → §6 | S |
| – | Leitplanke optional | vorhanden | `barrierVis` je Seite | – | – |

## 4 · TD4 Übergänge

| # | Modul | Stand | Track Core | Lücke | Aufwand |
|---|---|---|---|---|---|
| 1 | Rennstrecke Einfädeln | vorhanden | ENTRY / CONVERGE (`test-race-exit` 19/19) | Merge-Pfeil (Schritt 3) | – |
| 2 | Rennstrecke Ausfädeln | vorhanden | EXIT / DIVERGE | Split-Pfeil (Schritt 3) | – |
| 3 | Rennstrecke → Straße | teilweise | B6 = Look-Zone (J14 ZA / J17-Atlas); Core lehnt RACE → TOWN als Körperwechsel ab | Module „Übergangs-Verjüngung“ + „Bord-Stück“ als Geometrie → §6 | M |
| 4 | Straße → Schotter | fehlt | – (B1 COUNTRY ↔ TOWN ist der nächste) | DIRT + Katalog-Eintrag | M (nach DIRT) |
| 5 | Bord → Leitplanke | teilweise | B5 HIGHWAY ↔ TOWN nur am Rampenfuß (B4-Regel) | auf freier Strecke nicht erlaubt → §6 | S–M |
| 6 | Schulter-Verjüngung | vorhanden | params-Rampen, WIDTH_TAPER | – | – |
| 7 | Spur-Merge-Markierung | teilweise | Spur-Bänder | Pfeil fehlt (Schritt 3) | S |
| 8 | Spur-Split-Markierung | teilweise | dto. | dto. | S |
| 9 | Kreisel-Einfahrt (Wartelinie, Radius) | vorhanden | ROUNDABOUT yield gestrichelt, Ausrundung | – | – |
| 10 | Kreisel-Ausfahrt (Pfeil, Bord-Durchgang) | teilweise | Bord-Durchgang ✓ (Schritt 1: Familie) | Ausfahrtpfeil (Schritt 3) | S |
| 11 | Höhen-Rampe mit Banden | vorhanden | CONNECT mit Steigung, LEVEL_RAMP (≤ 8 %) | Pfeiler nur auf Inseln (V-120) | – |
| 12 | Brücken-Anschluss | vorhanden | SUPPORT_CATALOGUE C1 Boden ↔ Brücke, C2 Inselrand | – | – |
| Hero | Kreisel mit gemischten Armen (Bahn, Straße, Schotter) | fehlt | eine Familie je Knoten (Schritt 1) | Arm-Skin je Arm → §6 | L |

## 5 · TD5 Fortgeschritten

| # | Modul | Stand | Track Core | Lücke | Aufwand |
|---|---|---|---|---|---|
| 1 | Kompakter Kreisel | vorhanden | ROUNDABOUT (Insel ≥ Querschnitt + 2) | – | – |
| 2 | Mini-Kleeblatt | teilweise | EXIT / ENTRY / CONNECT, `crossing_ok` + Durchfahrtshöhe | kein Makro → §6 | M |
| 3 | Versetzte Kreuzung | vorhanden | 2 JUNCTION, Graph | Versatz-Regel → §6 | – |
| 4 | Schikane + Seiteneinfahrt | vorhanden | OFFSET_S + ENTRY | – | – |
| 5 | Y-Split / Y-Merge | vorhanden | FORK / JOIN | – | – |
| 6 | Boxengasse | vorhanden | PIT_LANE (modul_box) | – | – |
| 7 | Urbane Einfahrt (Bahn → Straße mit Zebra) | teilweise | B6-Look-Zone + JUNCTION-Zebra | wie TD4 #3 | M |
| 8 | Straße → Schotter-Abzweig | fehlt | JUNCTION-Arm je Familie ja, DIRT nein | DIRT | (in DIRT) |
| 9 | Überführung | vorhanden | `crossing_ok`, `cross_clearance` mit VEHICLE_HEADROOM, Tunnel/Brücke | Pfeiler nur auf Inseln (V-120); im All schwebt die Strecke (COSMIC `floating`) | – |
| A | Hochrampe | vorhanden | CONNECT / LEVEL_RAMP | Pfeiler: V-120 | – |
| B | Rampe runter | vorhanden | dto. | – | – |
| C | Split-Verbinder | vorhanden | FORK | – | – |
| D | Merge-Verbinder | vorhanden | JOIN | – | – |
| E | Seitliche Ein-/Ausfahrt | vorhanden | EXIT / ENTRY | – | – |
| F | Schikane-Abschnitt | vorhanden | OFFSET_S | – | – |
| G | Kreuzungsbrücke | vorhanden | `crossing_ok` + Durchfahrtshöhe | – | – |
| H | Belagswechsel Straße → Schotter | fehlt | – | DIRT + Katalog | (in DIRT) |
| Hero | Mehrebenen-Kreuzung mit Kreisel + Rampen | teilweise | Teile vorhanden | → §6 | L |

## 5b · CS1 Inselstraßen mit gemauertem Bord und Gehweg (Skin town)

| # | Modul | Stand | Track Core / Bestand | Lücke | Aufwand |
|---|---|---|---|---|---|
| 1 | Inselstraße ohne Bord | vorhanden | COUNTRY bzw. `edge` free | – | – |
| 2 | Bord + Gehweg beidseitig | vorhanden | TOWN + RKIT Lauf 03 (Bord, Gehwegplatten, Kantensteine, Knet-Übergang zur Wiese) | – | – |
| 3 | Bord einseitig | vorhanden | `edge: {L, R}`; hex_b7 (Bord nur rechts) | – | – |
| 4 | 90°-Ecke | vorhanden | CURVE_EASE TOWN, Lauf 03 folgt dem Strom | – | – |
| 5 | Sanfte Kurve | vorhanden | dto. | – | – |
| 6 | T-Kreuzung | teilweise | JUNCTION 3 Arme (Core ✓) | RKIT-Bord und Gehweg an Knoten-Ecken nicht gebaut (Lauf 03 = Strecke) | M |
| 7 | Kreuzung 4 Arme | teilweise | JUNCTION 4 Arme | dto. | (mit 6) |
| 8 | Kreisel-Einfahrt (Wartelinie) | teilweise | ROUNDABOUT, seit Schritt 1 im TOWN-Querschnitt; Wartelinie gestrichelt | RKIT-Bord am Kreisel nicht gebaut; Haifischzähne statt Strichlinie → §6 | M |
| 9 | Kreisel-Ausfahrt mit Spurmarkierung | teilweise | Bord-Durchgang ✓ | Ausfahrtpfeil (Schritt 3) | S |
| 10 | Kreisel-Ring | vorhanden | Ring + Insel-Lauf im TOWN-Querschnitt; Insel-Bepflanzung = `anchor.scenery` park | Look | – |
| 11 | Einfahrt / Bordabsenkung | fehlt | – | wie TD2 #9 | M |
| 12 | Zebrastreifen-Abschnitt | teilweise | Zebra nur an JUNCTION | wie TD2 #7; Zebra am Kreisel-Arm (Hero) fehlt | S |
| 13 | Mittelinsel (erhaben, Bord) | teilweise | `median` flach | wie TD2 #8 | M |
| 14 | Sackgassen-Kappe (Absperrung) | teilweise | Wendeschleife (V-110) | → §6 | – |
| 15 | Straße → Platz | fehlt | – | wie TD2 #12 | M |
| 16 | Straßen-Endkappe mit Gehweg | fehlt | – | → §6 (Unterschied zu #14) | S |
| – | Seitenprofil (Asphalt, Bord, Gehweg, Gras) | vorhanden | TOWN-Körper + Lauf 03 + Knet-Übergang | – | – |

## 5c · CS2 Landstraße + Schotter (Skins country und dirt)

| # | Modul | Stand | Track Core | Lücke | Aufwand |
|---|---|---|---|---|---|
| 1–4 | Landstraße gerade, kurz, Kurve, 90° | teilweise | COUNTRY (Bankett, Graslippe, Graben) | im Bild Leitplanke auf beiden Seiten: COUNTRY hat keine Planke, die Bande gibt es nur bei HIGHWAY → §6 | M |
| 5 | Land-T-Kreuzung | vorhanden | JUNCTION COUNTRY | – | – |
| 6 | Land-Kreuzung 4 Arme | vorhanden | dto. | – | – |
| 7 | Schulter-Verjüngung | vorhanden | params-Rampen | – | – |
| 8 | Graben / Grasrand | vorhanden | COUNTRY `barrier_out` = ditch, `barrier_cap` = verge | Steine = Rubbel (L) | – |
| 9 | Straße → Schotter | fehlt | – | DIRT + Katalog | M |
| 10–14 | Schotter gerade, kurz, Kurve, Berm-Kurve, S-Paar | fehlt | Geometrie ✓, Querschnitt DIRT fehlt | wie TD3 | (in DIRT) |
| 15 | Hügel / Sprung | vorhanden | CREST (KICKER → AIR → LANDING) | – | – |
| 16 | Schotter-Kante Kiesel | – (Look) | Rubbel-Streuung | – | – |
| 17 | Spurbreiten-Wechsel | vorhanden | WIDTH_STEP | – | – |
| 18 | Straßen-Endkappe (Steine) | fehlt | – | → §6 | S |
| 19 | Schotter-Endkappe | fehlt | – | wie TD3 #13 | S |
| 20 | Gemischter Eckverbinder (90° Straße → Schotter) | fehlt | Übergänge heute nur auf Geraden-Fenstern | → §6 | M |
| 21 | Gemischter Geradenverbinder | fehlt | – | wie #9 | (mit 9) |
| Bsp. | Gabel / Y | teilweise | Welt: EXIT / ENTRY; FORK nur race | → §6 | M |
| Bsp. | Hof-Einfahrt | fehlt | – | Einfahrt + dirt | (in DIRT) |
| Bsp. | Brücken-Anschluss (Bach) | vorhanden | SUPPORT_CATALOGUE C1; Steinbogen bis 8 % | V-120: nur auf der Insel | – |
| Bsp. | Land-Kreisel / Wendeschleife | vorhanden | ROUNDABOUT COUNTRY (seit Schritt 1 im COUNTRY-Querschnitt), 1-Arm-Wende | – | – |
| – | Zaun optional, Warnschild | fehlt | – (Ausstattung) | Lab-Ausstattung oder Core-`furniture` → §6 | S |

## 5d · CS3 Cosmic Highway (Skin cosmic, Schlüssel reserviert)

| # | Modul | Stand | Track Core | Lücke | Aufwand |
|---|---|---|---|---|---|
| 1–5 | Gerade, breit, kurz, 45°, 90° | vorhanden | Familie COSMIC (race-Maßstab, MAG-Markierung, Palette `mag`, `floating`) | Skin `cosmic` nur Platzhalter | – |
| 6 | Merge-Verbinder | vorhanden | MERGE_HALF / JOIN | Pfeil (Schritt 3) | – |
| 7 | Split-Verbinder | vorhanden | SPLIT_HALF / FORK | dto. | – |
| 8 | Y-Kreuzung (3 Wege) | teilweise | FORK; JUNCTION ist für Welt-Familien gebaut | → §6 | M |
| 9 | Kreisel-Einfahrt | vorhanden | ROUNDABOUT race-Querschnitt | – | – |
| 10 | Kreisel-Ausfahrt mit Pfeil | teilweise | dto. | Pfeil (Schritt 3) | S |
| 11 | Hub-Ring | vorhanden | ROUNDABOUT; Mitte = `anchor` (Kugel = scenery) | – | – |
| 12 / 13 | Rampe hoch / runter | vorhanden | CONNECT / LEVEL_RAMP | Stützen: → §6 | – |
| 14 | Schwebebrücke | teilweise | `crossing_ok` + Durchfahrtshöhe | kein benanntes Stück | S |
| 15 | Spurmarkierungs-Logik | teilweise | MAG-Balken | wie TD1 #9 | – |
| 16 | End- / Startkappe | teilweise | ROUND_END | wie TD1 #13 | – |
| – | Energie-Kante | – | Bande-Slots (L-Look) oder Markierung? | → §6 | – |
| Bsp. | Kompakte Kreuzung, Mehrebenen-Kreuzung, Split-Merge, Hub mit 4 Zufahrten | vorhanden bzw. teilweise | ROUNDABOUT, `crossing_ok`, FORK / JOIN | Pfeile | – |

**Summe:** Der Renn-Kern ist vollständig. Straße bis auf Absenkung, Platz und erhabene Mittelinsel ebenfalls. Der größte Block ist **DIRT** (Querschnitt + 2 Katalog-Einträge). Querschnittsthema über alle Blätter: **Pfeile** (Skin-Schritt 3). Aus CS1/CS2 kommen dazu: RKIT-Bord an Knoten (Kreuzung, Kreisel), Planke bzw. Zaun für country, gemischte Verbinder.

## 6 · Uneindeutig (V-148): bitte über die Steuerung bei Georg klären, nicht erfunden

| Bild | Stelle | Frage |
|---|---|---|
| TD1 | #9 (untere Reihe, 2. Kachel) | Merge-/Split-Pfeile auf einer Renn-Geraden: Die Rennstrecke hat keine Spuren. Gelten Pfeile nur an EXIT/ENTRY bzw. FORK/JOIN, oder soll race Spuren bekommen? |
| TD1 | #13 (untere Reihe rechts) | Klotz-Kappe am offenen Ende: In welcher Welt-Situation endet eine Rennstrecke offen (Baustelle, Startaufstellung, Inselrand)? ROUND_END (gerundet) oder Klotz? |
| TD1 | Hero, Kurven | Rot-weißer Kerb nur innen am Scheitel oder beidseitig? Regel nach Krümmung (REF_ANALYSIS Nr. 3), aber ab welchem Radius? |
| TD1 | #10 / #11 | Was ändert sich am inneren bzw. äußeren Banden-Übergang (Bande endet, senkt sich, rückt nach außen)? Übergangslänge? |
| TD2 | #8 (rechts oben) | Erhabene Mittelinsel: Höhe, Länge, Enden (Nase gerundet?), nimmt sie Spurbreite weg oder kommt sie dazu? |
| TD2 | #9 (unten links) | Bordabsenkung: Länge, Resthöhe, wohin führt die Einfahrt (Weltlogik §00: Haus, Hof)? |
| TD2 | #11 | Straßen-Endkappe ohne Wende widerspricht V-110 (Fahrzeuge müssen wenden können): Ist das Sackgasse + Wendeschleife oder nur ein Bauende (Baustelle)? |
| TD2 | #12 | Straße → Platz: Ist der Platz befahrbar? Bord oder bündig mit Pollern? |
| TD2 | Hero, Kreuzung | Zebra nur auf zwei Armen: Regel, welche Arme Zebras bekommen? |
| TD3 | #5 | Berm-Kurve: Höhe der äußeren Lippe, Querneigung, ist die Berm befahrbar (Wandfahrt) oder nur Kante? |
| TD3 | #9 | Belag → Schotter: Übergangslänge, Reihenfolge der Schichten (Kerb weg vor Belag?) |
| TD3 | #13 | Schotter-Endkappe: Was beendet einen Schotterweg in der Welt (Wiese, Hof, Zaun)? |
| TD3 | Hero | Breite der Schotterbahn: race-Breite 14,4 oder schmaler (Landweg)? Bande nur abschnittsweise: Regel wann? |
| TD4 | Hero, Kreisel Mitte | Ein Kreisel mit Armen in drei Skins (Bahn, Straße, Schotter): Welcher Skin hat der Ring? Was steht an den Ecken zwischen einem Bahn- und einem Straßenarm (Bande ↔ Bord)? |
| TD4 | #3 + „Exploded example“ unten links | Bahn → Straße als Teile (Übergangs-Verjüngung, Bord-Stück): Längen, und gilt die B6-Look-Zone weiter? |
| TD4 | #5 (oben rechts) | Bord → Leitplanke: Übergangslänge unklar. Darf das auf freier Strecke stehen? Heute nur am Rampenfuß (B4/B5). |
| TD4 | #11 / #12, „Side profile: ramp & bridge“ | Steinpfeiler: stehen sie auf der Insel (V-120 erlaubt) oder über einer Lücke (verboten)? Brückengeländer statt Bande: Wechsel wo? |
| TD5 | #2 | Mini-Kleeblatt: Ebenen, Radien (NPC-Radius ≥ 8), kreuzen sich die Schleifen höhengleich? |
| TD5 | #3 | Versetzte Kreuzung: Versatz-Maß zwischen den beiden Knoten? |
| TD5 | Hero | Mehrebenen-Kreuzung: ein Knoten oder mehrere (Kreisel unter der Brücke + Rampen)? Wie viele Arme hat der Kreisel? |
| TD5 | #7 | Urbane Einfahrt: Fährt das Rennauto über den Zebrastreifen? Wo endet die Bande? |
| CS1 | Hero, Kreisel; #8 | Wartelinie als Haifischzähne (Dreiecke) statt Strichlinie: gilt das für town, für alle Skins oder bleibt die Strichlinie? |
| CS1 | Hero, unten Mitte | Zebrastreifen direkt am Kreisel-Arm: Abstand zur Wartelinie, auf allen Armen? |
| CS1 | #14 vs. #16 | Sackgasse mit Absperrung vs. fertiges Straßenende mit Gehweg: Wann welches, und wie wenden die Autos (V-110)? |
| CS1 | #13 | Mittelinsel mit Bepflanzung: Mindestbreite, steht sie in der Fahrbahnbreite oder verbreitert sie die Straße? |
| CS2 | #1–#4, Hero | Leitplanke auf beiden Seiten der Landstraße: Immer, nur an Kurven bzw. Hang, oder optional per Abschnitt? Planke oder Zaun – Regel? |
| CS2 | #18 | Straßen-Endkappe mit Steinen: Baustelle, Sackgasse oder Inselrand? Weltlogik? |
| CS2 | #20 | Belagswechsel mitten in der 90°-Kurve: erlaubt (heute nur auf Geraden-Fenstern)? Übergangslänge? |
| CS2 | Beispiel „Fork / Y-junction“ | Y-Gabel auf der Landstraße: als Kreuzung (JUNCTION mit spitzem Winkel) oder als Ausfädelung (EXIT)? |
| CS2 | Hero, Kurve links | Warnschild und Zaun: Gehören sie zum Straßen-Modul (Core-Daten) oder zur Inselausstattung (Lab)? |
| CS3 | Seitenprofil, Hero | Stützen und „anti-grav base“ unter der Fahrbahn vs. „im All schwebt die Strecke“ (Steuerung): Stützen nur auf Asteroiden-Inseln (V-120) oder gar keine? |
| CS3 | Legende „energy edge“ | Energie-Kante: Ist das die Bande (Slots), ein Markierungsband am Fahrbahnrand oder beides? Wie hoch? |
| CS3 | #8 | Y-Kreuzung im All: Knoten mit 3 Armen (Kreuzungslogik, Vorfahrt?) oder FORK ohne Kreuzung? |
| Core | HIGHWAY | Welchem Skin gehört HIGHWAY (Bande auf Grasbett)? Vorläufig country, weil ein Knoten einen Skin braucht; bitte bestätigen oder umsetzen. |

## 6b · Entscheide V-150 (Georg 11.10.) und Folgen für die Liste

| Nr. | Stelle | Entscheid | Folge im Katalog |
|---|---|---|---|
| 1 | TD1 #9 | Pfeile nur an EXIT/ENTRY bzw. FORK/JOIN; race ohne Spuren | Skin-Schritt 3: Pfeile nur an diesen Stellen und an Kreisel-Ausfahrten |
| 2 | TD1 #13 | offenes Ende nur Startaufstellung bzw. Baustelle; runder J17-Bandenkopf | Kappe race = ROUND_END-Nase / Strang-Kappe (vorhanden); in Schritt 4 als Kappen-Daten |
| 3 | TD1 Kerb | nur innen am Scheitel ab enger Kurve; RKIT schlägt den Radius vor | Vorschlag folgt mit Schritt 3 (Markierungs-/Kanten-Daten), aus Krümmung |
| 4 | TD1 #10/#11 | **offen**: Vorschlag aus Bestand mit Skizze | eigener Bericht folgt (S4 v2 Matrix + J17) |
| 5 | TD2 #8 | Bordsteinhöhe, gerundete Nasen, zusätzlich zur Spurbreite | TD2 #8 / CS1 #13: Bauumfang klar (M), später |
| 6 | TD2 #9 | Absenkung nur vor Haus, Hof, Garage | TD2 #9 / CS1 #11: Absenkung braucht einen Anker (Gebäude) |
| 7 | TD2 #11 | Sackgasse immer mit Wendeschleife; bloßes Ende nur Baustelle | TD2 #11, CS1 #14: **vorhanden** (1-Arm-Kreisel); CS1 #16 / CS2 #18 = Baustellen-Ende |
| 8 | TD2 #12 | Platz nicht befahrbar, bündig mit Pollern | TD2 #12 / CS1 #15: Platzrand = Kante `free` + Poller-Ausstattung (S) |
| 9 | TD2 Zebra | an Armen mit Gehweg zu Gebäuden bzw. Platz | Zebra-Regel als Daten am Arm (S) |
| 10 | TD3 #5 | Berm / Wandfahrt / Sandkurve befahrbar | RKIT_DIRT_VORLAGE_R1 (BERM_CURVE) |
| 11 | TD3 #9 | ~20 m, Kerb endet zuerst, Belag franst aus | RKIT_DIRT_VORLAGE_R1 (Katalog-Fenster) |
| 12 | TD3 #13 | Schotter-Ende = Wiese, Hof oder Gatter | RKIT_DIRT_VORLAGE_R1 (Kappen-Daten) |
| 13 | TD3 Hero | schmaler als Rennen; Bande nur an Gefahrenstellen | RKIT_DIRT_VORLAGE_R1 (NARROW, `edge` bande optional) |
| 14 | TD4 Hero | Ring = Skin der Hauptstrecke; Ecken mit Übergangsstück Bande ↔ Bord | Knoten mit Armen in anderen Skins: Erweiterung von Schritt 1 (Arm-Skin je Arm), L, Vorlagen-Zeile nötig |
| 15 | TD4 #3 | J17 Variante B, 17 m (V-139) | vorhanden als Look-Zone; Teile nur Gliederung |
| 16 | TD4 #5 | Bord → Leitplanke auf freier Strecke erlaubt, wie am Rampenfuß | Katalog: B5-Fenster ohne `ramp`-Pflicht für diesen Fall (S) |
| 17 | TD4 #11/#12 | Pfeiler nur auf Inseln; Brücke mit Geländer, Wechsel am Brückenkopf | Kante `railing` am Brückenkopf (C1/C2), M |
| 18 | TD5 #2 | zwei Ebenen, kreuzungsfrei, Radius ≥ 8; Phase E | später |
| 19 | TD5 #3 | Versatz ≥ Autolänge + Wartefläche; RKIT misst | Messung mit dem nächsten Junction-Check |
| 20 | TD5 Hero | mehrere Knoten | vorhanden aus Teilen |
| 21 | TD5 #7 | Bande endet vor dem Übergang, danach Stadtstraße mit Zebra | wie #15 + Zebra-Regel #9 |

Leitprinzip V-151: chill & fun Assist als Standard. Berm, Sand, Rampen und Sprünge werden so ausgelegt, dass sie mit Assist sicher fahrbar sind.

## 7 · Such-Protokoll (V-140)

| Quelle | gesucht | gefunden |
|---|---|---|
| `track-core.mjs` 0.16.3-s1 | Stück-Typen, dirt, berm, driveway, plaza, chicane, rut, arrow, zebra, median, crossing | Typen: STRAIGHT, TRANSITION, CURVE_EASE, HAIRPIN_180, SPIRAL, WIDTH_STEP, OFFSET_S, CREST, DIP, KICKER, AIR, LANDING, LOOP, CONNECT, SPLIT/MERGE_HALF, FORK/JOIN, EXIT/ENTRY, DIVERGE/CONVERGE, PIT_LANE, ROUNDABOUT, JUNCTION, LEVEL_RAMP. dirt / berm / driveway / plaza / chicane / rut: 0 Treffer. zebra 7, median 22, crossing 8 (`crossing_ok` `:2124ff`), arrow nur als Balken-Spitze (MAG) |
| J15 = J14 `lab-track/core/presets.v012.json` | Module | modul_box, modul_weiche, modul_rampe, modul_uebergang, modul_kreisverkehr, sandbox, td03, td05, seed; kein dirt |
| J15 `lab-track/core/stream-to-three.v5.mjs` | berm | `:246–255` BIOME_PREVIEW: Strang senkt sich zu Bord oder Berm (nur Vorschau-Look; canyon / nature haben Erdton-Fahrbahn) |
| J15 `parcours/p1-recipes.js` | plaza | `:54` `plaza_hairpin` (Wende auf dem Platz), kein Platz-Rand |
| Organ-Inseln v4+ `track-look.v2–v5.js`, `td03.stream.json` | dirt | nur Look-Töne (canyon), kein Querschnitt |
| TRACK-CORE S8 / S10 / S12 | dirt, berm | S12 RETURN `:31` Strang senkt sich zu Bord oder Berm (Look); Presets ohne dirt |
| S4 v2 Brief | dirt, kerb, transitions | Übergangsfamilie 3 „Race track ↔ Dirt track“ `:318`; Rollen-Stapel `:283–288`; Kerb-Varianten `:233–234` |
| Stunt Car Race Handover v1.x | dirt, off-road | nur Erwähnungen in Handover-Texten, kein Code |
| Lab `docs` (STAGE1_R2D_PORT_PLAN, C4_VORLAGE_R1) | plaza | Plätze als Kompositions-Teil der Insel (`:51`), kein Straßen-Rand |
| KFB_HUB DECISIONS V-147 / V-148 | Katalog-Regel | Katalog = Logik, nicht Farben; uneindeutig → nachfragen |
| RKIT-Bestand Town | Bord, Gehweg | `public/roadbeds/rkit_hub.*` (Lauf 03), `hex_b7.*` (V-138 b); Blender `rkit_r3_gehweg_v3.py`, `rkit_r3_hexbay.py`; keine Knoten-Ecken |
| Track Core COSMIC | cosmic | `PROFILE_FAMILIES.COSMIC` `:132` (`skin: 'mag'`, `floating: true`); keine Energie-Kante, keine Stützen-Regel |
