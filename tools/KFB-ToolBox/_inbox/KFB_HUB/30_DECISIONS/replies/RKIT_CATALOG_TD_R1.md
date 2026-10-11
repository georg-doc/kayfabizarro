# RKIT · TD-Katalog (V-147) gegen Track Core 0.16.3-Schritt 1 (R1) · nur Liste, kein Bau

Stand 2026-10-11 · Bilder: `replies/REFS_TRACK_DETAILS_2026-10-11/TD1…TD5` · Farben zählen nicht (V-147) · uneindeutige Stellen in §6 (V-148)

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

**Summe:** Der Renn-Kern ist vollständig. Straße bis auf Absenkung, Platz und erhabene Mittelinsel ebenfalls. Der größte Block ist **DIRT** (Querschnitt + 2 Katalog-Einträge). Querschnittsthema über alle Blätter: **Pfeile** (Skin-Schritt 3).

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
