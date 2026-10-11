# RKIT · Skin-Schnittstelle Schritt 1 (V-145) + Schichtung je Skin (V-146) · Track Core 0.16.3 (R1)

Stand 2026-10-11 · Track Core privat `~/Developer/rkit-r3/trackcore/` (nicht im Lab-Vendor; 0.16.3 wird erst nach Abstimmung mit der MVP-Sitzung vendort)

## 1 · Schritt 1: Kreisel-Arme erben die Einfahrt-Familie

**Was geändert ist**
- `solveRoundabout` bekommt das volle Profil der ankommenden Route (bisher nur ihre Breite). Die Knoten-Familie ist `familyOfPrm` der Route am Einfahrt-Arm, also dieselbe Regel wie V-143.
- **Welt-Familie** (TOWN, DRIVING_SCHOOL, COUNTRY, MOUNTAIN, HIGHWAY):
  - Alle Arme (Einfahrt, Ausfahrt, Stummel) tragen Profil und Markierung der Familie: `node.arms[].family / prm / markings`. Die Ausfahrt- und Stummel-Routen starten damit in der Familie. Vorher starteten sie im RACE-Profil mit STREET-Markierung.
  - Kanten-Querschnitt des Knotens = `sideSection(Familienprofil)`, wie bei JUNCTION. Neu am Knoten: `node.family` und `node.sideExtent`.
  - Diese Werte rechnen mit der Breite des Familien-Querschnitts statt mit fest 4,32:
    - Mindest-Insel;
    - Ausrundungs-Untergrenze (Breite + 1,5);
    - Inselfüllung (Insel − Breite);
    - `node_clear`.
- **Race und eigene Profile sowie freistehende Knoten:** unverändert. Sie behalten KERB_SECTION und bekommen keine neuen Felder (bitgleich).
- Fahrplatte, Kantenlinien (`kerbs[]`) und NPC-Wege bleiben in allen Familien unverändert. Gewollt ändern sich nur Familie, Querschnitt und Inselfüllung.

**Vorher/Nachher, Welt-Kreisel** (4 Arme, Insel 16; Rohdaten `parity/rb_family_before.json` / `rb_family_after1.json`)

| Familie | Ausfahrt- und Stummel-Routen | Querschnitt Breite | Höhe | Inselfüllung r | NPC-Abstand / Radius | Checks |
|---|---|---|---|---|---|---|
| TOWN | RACE/STREET → **TOWN/LANES_KERB** | 4,32 → **5,6** | 1,35 → **0,37** | 11,38 → **10,1** | 1,885 / 7,9 (gleich) | grün → grün |
| DRIVING_SCHOOL | RACE/STREET → **DRIVING_SCHOOL/LANES_KERB** | 4,32 → **2,4** | 1,35 → **0,27** | 11,38 → **13,3** | 1,885 / 7,9 | grün |
| COUNTRY | RACE/STREET → **COUNTRY/LANES** | 4,32 → **2,5** | 1,35 → **0** | 11,38 → **13,2** | 1,753 / 7,82 | grün |
| MOUNTAIN | RACE/STREET → **MOUNTAIN/LANES** | 4,32 → **1,3** | 1,35 → **0** | 11,38 → **14,4** | 1,753 / 7,82 | grün |
| HIGHWAY | RACE/STREET → **HIGHWAY/LANES** | 4,32 → **3,9** | 1,35 → **1,3** | 11,38 → **11,8** | 3,155 / 8,9 | grün |
| RACE | unverändert | 4,32 | 1,35 | 11,38 | 3,493 / 9,23 | grün, bitgleich |

Einarmige Wendeschleifen ändern sich genauso (Querschnitt und Inselfüllung); ihre Wege sind gleich geblieben (TOWN r 11,12).

**Tests (nach Schritt 1)**

| Suite | Ergebnis |
|---|---|
| **`test-skin.mjs` (neu)** | **32/32**: 5 Welt-Familien × (grün, Familie aller Arm-Routen, Markierung, Querschnitt = Familien-Querschnitt, Inselfüllung, Arm-Felder); Familie am Stück statt in den defaults; RACE ohne neue Felder |
| `test-turnaround.mjs` | 18/18. Die Bitgleichheit wird jetzt nur für Race geprüft (RACE 4 Arme + modul_kreisverkehr). Neu geprüft: Welt-Platte, Kantenlinien und Wege bleiben gleich. |
| test.mjs | 0 FAIL |
| v013 | 60 |
| v014 | 15 |
| v015 | 97 (1 erwartet: Versionsstring) |
| v016 | 116 |
| race-exit | 19 |
| level-ramp | 16 |
| **Teil 0** (`parity/teil0_parity_v0163s1.json`) | **bitgleich**, alle Abweichungen 0: O1 v7 Ring, J17 p1b.v2, td03, p1-Rezept B |

**Für Lab und MVP:** Der Lab-Vendor (0.16.1 / 0.16.2) ist nicht berührt. Welt-Kreisel im Lab ändern sich erst, wenn 0.16.3 mit der MVP-Sitzung abgestimmt vendort wird.

## 2 · `node.skin` und `q.skin`: zwei Ebenen, nicht verwechseln

| | `q.skin` (gibt es) | `node.skin` (Schritt 2, neu) |
|---|---|---|
| Ebene | je Probe im Strom | je Baustein (Knoten, Modul) |
| Werte | Paletten-Schlüssel aus `SKINS`: `street` · `track` · `mag` · `toy` · `buoy` | Schichtstapel: `race` · `town` · `dirt` (V-147). Später: `cosmic`, `rail`, `coaster` |
| bestimmt | nur Farbe je Rolle (`q.paint`), über 32 m weich geblendet (`SKIN_BLEND`) | Querschnitt (Familie → SLOTS), Kantenart, Markierungsstil, Kappen. Es bestimmt also die Geometrie. |
| Quelle | `defaults.skin` bzw. `SKIN_OF_MARKING[marking]`; Familie COSMIC → `mag` | ausdrücklich `skin:` am Knoten. Ohne Angabe wird es aus der Einfahrt-Familie abgeleitet (Schritt 1): Welt-Familie → `town`, RACE/COSMIC → `race`. |
| Owner | Look-Schicht (Lab färbt) | Core-Geometrie + Lab-Look (siehe §3) |

- **Verbindung:** `node.skin` setzt den Start-`q.skin` der Arm-Routen:
  - race → `track`;
  - town → `street`;
  - dirt → noch kein Paletten-Schlüssel, wird in Schritt 2 als Platzhalter `dirt` in `SKINS` vorgeschlagen.
- **Richtung:** Nur `node.skin` → `q.skin`, nie umgekehrt. Ein Farbwechsel (`q.skin`) ändert keinen Querschnitt.

## 3 · `skins[]` je Skin: vorhandene Schichtung (V-146)

Es entsteht kein neues Schema. Jede Schicht verweist auf einen vorhandenen SLOT (`SLOTS` `track-core.mjs:76`), einen paint-Schlüssel (`SKINS` `:220`, Rollen nach S4 v2 §590 „Roles stay the unit of style“) und die Familien-Rolle (`PROFILE_FAMILIES[].roles` `:115–132`).

**Owner:** **C** = Core-Geometrie (Strom, SLOTS, deck.zones, kerbs[]); **L** = Lab-Look (Farbe, Knet, Instanzen), im Town-Bereich RKIT (V-118).

| Schicht | SLOT (Index L / R) | paint | Rolle je Familie | race | town | dirt (V-147) | Owner |
|---|---|---|---|---|---|---|---|
| **Asphalt** | `road_L/R` (6 / 7) + Knoten-`deck.zones` plate | `road` | road | Bahnbelag | Straßenbelag | Fahrspur: Lehm mit Rillen (kein Asphalt; Rillen = Look) | C Fläche · L Belag |
| **Markierung mit Farbe-Rolle** | kein Slot: `markings[]` (Bänder `s0..s1`) bzw. Knoten-Polylinien `kind` edge · centre · yield · splitter (+ Schritt 3: arrow · ring_lane) | Farbe-Rolle `hell` · `signal` (J17 M1 `markH` / `markS`, `track-look.v5.js:150–151`) | – | MARKING_STYLES.TRACK (Rand, hell) | STREET bzw. LANES_KERB (Rand + Mitte, hell; Zebra / Stop hell) | NONE (die Fahrlinie entsteht aus den Rillen) | C Lage / Breite / Strich · L Farbe |
| **Seitenstreifen** | `shoulder` (5 / 8) | `shoulder` | race `shoulder` · TOWN `gutter` · COUNTRY `gravel` | Auslauf; trägt den Renn-Kerb (S4 v2 §599: Kerb-Wulst außerhalb `road_L..road_R`) | Rinne 0,4 | Kies-Kante | C · L |
| **Bord bzw. Kerb** | race: kein eigener Slot, liegt als Look-Zustand auf `shoulder` (5–6 / 7–8). town: `barrier_in_bot → barrier_in_top` (4–3 / 9–10), Kappe `barrier_in_top → barrier_out_top` (3–2 / 10–11) | race `shoulder`; town `barrier_side` + `barrier_cap` | TOWN `kerb` + `sidewalk` (+ `sidewalk_edge`) | Varianten flach · rumble · sausage (S4 v2 §233–234), rot/weiß = Farbe-Rolle `signal` | Bord 0,35 (TOWN), 0,12 (TOWN_BAY), Gehweg als Kappe | Graslippe bzw. Berm (TD3 #11; „outer berm“) | race: L (Variante als Look-Parameter, kein Core-Feld) · town: C Geometrie (Bord, Gehweg) + RKIT-Look |
| **Bande** | `barrier_in_bot/in_top/out_top/out_bot` (4, 3, 2, 1 / 9, 10, 11, 12) | `barrier_side` + `barrier_cap` | race `barrier_side/cap` · HIGHWAY `bande {r 0,65}` (`:703ff`) | J17-Strang (`sideProfile` `track-look.v5.js:199–216`) | **keine** (V-118: Bord statt Bande; V-120 a) | Leitplanke optional (`barrierVis` 0/1 je Seite, wie heute) | C Slots · L Strang-Look |
| **Rubble** | kein Slot: Rand-Läufe (`kerbs[]`, Kanten der Läufe) + Krümmung bzw. Tiefpunkte als Ursache | Farbe aus der Insel-Farbgrammatik | – | Kurvenausgang außen | Nähte, Bordsteinkopf / Kantenstein (RKIT) | Kiesel-Kante (TD3 #10) | **L** (Rubbel-Streuung, SPEC_EDGE_RUBBLE_GRAMMAR_R1 „Ein Baukasten statt vier“ Nr. 2). Core liefert nur Läufe + Krümmung. |
| **Unterseite** | `under_L/R` (0 / 13) | `underside` | race `underside` · TOWN `foundation` · COUNTRY `embankment` · MOUNTAIN `retaining` | Strang-Unterseite | Fundament | Damm | C · L (Inselboden) |

**Querschnitt je Skin (Core):**
- race = `KERB_SECTION` (Kit, `:1370`);
- town = `sideSection(TOWN)`;
- dirt = **offen**. Eine DIRT-Familie gibt es nicht. Nächster Verwandter ist COUNTRY: Kies-Seitenstreifen 1,0, Graslippe, Graben. Die Berm-Variante (äußere Lippe erhöht) fehlt. Vorlagen-Zeile folgt im TD-Abgleich (V-147).

**Kappen** (Schritt 4) und **Markierungs-Daten** (Schritt 3) kommen als weitere Spalten in dieselbe Tabelle, nicht als eigenes Schema.

## 4 · Such-Protokoll (V-140), ergänzt um die V-146-Grundlagen

| Quelle | gesucht | gefunden |
|---|---|---|
| Track Core 0.16.2 `track-core.mjs` | SLOTS, SKINS, roles, markings, Familien | SLOTS `:76`; MARKING_STYLES `:210`; SKINS `:220`; SKIN_OF_MARKING / SKIN_BLEND `:228–229`; PROFILE_FAMILIES mit `roles` `:115–132` (COSMIC `skin: 'mag', floating`); BODY_FAMILIES `:703`; KERB_SECTION `:1370` |
| S4 v2 `TRACK-CORE/S4_DESIGN_BRIEF_v2_2026-09-27/BRIEF_…_S4_v2.md` | Kanten-Atlas, Übergänge, Kerb-Varianten | §3 (14 Slots, 5 Rollen, Skins); Kerb flach / rumble / raised / sausage `:233–234`; Rollen-Stapel `:283–288`; 10 Übergangsfamilien `:316–325`; Regel Rollen = Stil-Einheit `:590`; Kerb außerhalb road `:599`; Oberflächen-IDs inkl. RUMBLE `:495` |
| `REF_ANALYSIS_2026-09-27/REFERENCE_ANALYSIS_2026-09-27.md` | Oberfläche je Slot, Kanten-Schicht | §Synthese Nr. 1 „surface id per slot“, Nr. 3 Edge layer (rot/weißer Kerb als Renn-Standard, schraffierter Auslauf, Chevrons nach Krümmung, Kiesbett) |
| Lab `docs/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md` | Rubbel, Abschlussstücke | Grundsatz „keine harten Schnitte“; Rubbel nach Ursache; drei gemeinsame Bausteine (kfbBlend, Rubbel-Streuung, Abschlussstück-Familie); Owner-Tabelle (Straßen = RKIT) |
| J17 `lab-track/track-look.v5.js` (J14 = J15) | Rollen, Strang, Kerb | `sideProfile` `:197–216` (barrierT: Stadt → Bordlippe, Natur → Wiesenlippe); Markierungs-Rollen `markH` / `markS` `:150–151`; `curb` / `walk` / `plate` / `dam` `:152–159`; Skin-Feld `q.skin` street/track `:221–226` |
| RKIT_RUNDKURS_SKINS_R1 | Quellen V-144 | wie dort §2 (Donor-Karten, ACCEPTANCE_INDEX, Organ v4–v7, RollerCoaster v11, Stunt Car Race) |

## 5 · MODULES-Zeilen (Änderung durch Schritt 1)

| id | logic | skins[] heute | edge | Lücke |
|---|---|---|---|---|
| gerade_kreisel | roundabout (Arm) | race ✓ · town **✓** (Arme in der Familie) | race: bande · town: kerb (Familien-Querschnitt) | – |
| banden_innen | roundabout (Insel-Lauf) | race ✓ · town **✓** (Querschnitt TOWN) | race: bande · town: kerb | erhabener Splitter (Schritt 4) |
| banden_aussen | roundabout (Ecken-Läufe) | race ✓ · town **✓** | race: bande · town: kerb + Gehweg | – |
| ausfaedelung | roundabout (Ausfahrt) | race ~ · town ~ (Familie ✓) | wie Arm | Ausfahrtpfeile (Schritt 3) |
| endkappen | Stummel | race ~ · town ~ | – | Stummel-Kappe (Schritt 4) |

## 6 · Nächste Schritte

- **V-147 TD-Abgleich** (nur Liste, kein Bau) → `RKIT_CATALOG_TD_R1.md`, mit Abschnitt „uneindeutig“ (V-148).
- Danach **Schritt 2:** `node.skin: 'race' | 'town' | 'dirt'`. `dirt` steht in der Schnittstelle von Anfang an; der Querschnitt ist offen bis zur Freigabe (siehe §3).
