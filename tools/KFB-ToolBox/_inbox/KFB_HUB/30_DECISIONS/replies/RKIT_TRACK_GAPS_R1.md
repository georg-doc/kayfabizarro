# RKIT · Lückenliste Track Core 0.16.1 (V-134, Schritt 1: nur Liste, kein Bau)

Stand: 2026-10-11 · Besitzer Track Core: RKIT (V-118) · Look bleibt im Lab (J17, V-010/V-102). RKIT liefert Geometrie, Graph und Tests. Track Core bleibt privat (`~/Developer/rkit-r3/trackcore/track-core.mjs`).

**Status-Wörter:** **vorhanden** = kompiliert, hat Tests, Prüfungen grün · **teilweise** = Geometrie da, aber Prüfung rot, Test fehlt oder Schnittstelle fehlt · **fehlt** = nicht im Track Core.

**Aufwand:** S ≈ ½ Sitzungsblock · M ≈ 1 Block · L ≈ 2–3 Blöcke. Jeweils für Geometrie, Graph und Tests im Track Core, ohne Lab-Look.

## 0 · Grundsatz: Schnittstelle zuerst (betrifft jedes Teil)

| | Stand | Was fehlt | Aufwand |
|---|---|---|---|
| **Stream-Vertrag Lab ↔ Track Core** | **teilweise** | Das Lab rechnet mit einer eigenen Kopie **v0.12** (`src/world/organ/vendor/vendor-j15/lab-track/core/track-core.v012.mjs`, Stream-Schema 0.3). Track Core ist bei **0.16.1** (gleiches Schema 0.3 plus `body.edge {L,R}`, `body.bandeSide`, TOWN_BAY/B7). EXIT/ENTRY, DIVERGE/CONVERGE, JUNCTION und Körper gibt es in v0.12 nicht. „0.16 → v5“ ist ungetestet (PHASE_C_DONORS_R1 l.28–31; C2). | **M** |
| **Modul-Katalog (MODULES.md)** | **teilweise** | Liegt nur in Kritik-Ordnern (`docs/critic/lab-track/2026-10-11_C1b-C3-r2/MODULES.md`), mit Naht-Prüfung (Lücke 0, Höhensprung 0, Normalensprung ≤ 1,10°). Es fehlen Felder für Querschnitt, Banden-Seiten (`edge`) und Anschluss-Rahmen (Socket). | **S** (Vorschlag unten §4) |

Ohne diese zwei Punkte ist kein neues Teil „nahtlos einbaubar“. Ich schlage sie deshalb als **Teil 0** vor allen anderen vor.


**Herkunft der Vorlagen:** Alle Strecken in J14, J15, J17, td03 und O1 stammen aus **einem** Compiler, Track Core v0.12. Byte-gleiche Kopien liegen in:
- `Lab/src/world/organ/vendor/vendor-j15/lab-track/core/track-core.v012.mjs`
- `Lab/public/vendor/joyride-j17/lab-track/core/`
- J14 `lab-track/core/`

Original: `KFB Racetrack Blender Kit/TRACK-CORE/S13_V012_2026-09-28/`. `track-look.v5.js` kleidet nur den Stream ein. Track Core 0.16.1 ist der direkte Nachfolger: Alle v0.12-Stücke sind darin enthalten. Gegenprobe heute: `presets.v012.json` td03 und modul_rampe kompilieren mit 0.16.1, alle Prüfungen grün; modul_kreisverkehr über `compileGraph`, 3 Knoten, alle grün.

## 1 · Teile

### 1.1 J17-Grundstrecke (track-look v5)
- **Vorlage:**
  - J17-Stream `p1b.v2.stream.json` = Rezept B in `p1-recipes.js` (`Lab/donors/joyride-j16r2-zip/…/lab-track/parcours/`), geschlossen mit `CONNECT home`;
  - Look `track-look.v5.js` bzw. `Lab/src/world/organ/vendor/j17/lab-track/j17-track.lab.js`.
- **Stücke:**

| Stück | Stand |
|---|---|
| STRAIGHT, TRANSITION, CURVE_EASE, HAIRPIN_180, SPIRAL, OFFSET_S | vorhanden |
| WIDTH_STEP, CREST, DIP | vorhanden |
| KICKER, AIR, LANDING | vorhanden |
| LOOP, CONNECT | vorhanden |
| SPLIT_HALF / MERGE_HALF, FORK / JOIN | vorhanden |
| Tunnel-Feld (Presets gotthard, dumb, alien, hangar, toy; Formen round, oval, rect, poly, arch) | vorhanden |
| geschlossener Ring (`closed` + Prüfung `closure`) | vorhanden |
| Schräglage über `bankDeg` oder automatisch | vorhanden |

- **Schnittstelle:**
  - Querschnitt RACE: Breite 10,8 / **14,4** / 18 / 21,6 / 28,8 m, Seite 4,32 m (Bankett, Abstand, Bande 1,62 × 1,35), Deck 2,25 m.
  - Banden-Seiten über `sideL/R` und `barrierVisL/R` (0 = 0,35 m versenkt); Banden-Linien = Slots 6/7.
  - Anschluss-Rahmen = `joints[]` (p, psi, grade, prm) und T/U/R je Stützstelle.
- **Tests:** `test.mjs` (Regression v0.12, Kreisel M/S/L), `test-v013`…`test-v016` (288 Prüfungen). 0.16.1 meldet in test-v015 einen erwarteten Abweichler (Versionskennung 0.15 → 0.16).
- **Lücke:**
  - Das Lab rechnet noch mit v0.12.
  - Nicht gemessen ist, ob 0.16.1 für J17-Rezepte **≤ 1 mm** denselben Stream liefert (p/T/U/R/Slots, wie C4b es verlangt).
- **Aufwand:** **S** (Gleichstand-Test v0.12 ↔ 0.16.1 über alle Lab-Rezepte; = Teil 0).

### 1.2 Brücke frei im Raum (V-110)
- **Vorlage:**
  - J17: keine eigene Brückenform. Brücke = hochgelegte Strecke, Stützen kommen aus `track-look.v5.js` (l.313–350; ab 14 m zwei Beine mit Querriegel).
  - Hex-Hub: `lab-hex/hex-island.v5.js` `buildBridges` + `cosmos-route.v1.js` (roadLift 0,6).
- **Stand:** **vorhanden** für die J17-Strecke (Deck + Stützen im Lab).
  - Track Core kann zusätzlich Weltstraßen-Brücken mit Körper (`support: 'bridge'`, Katalog C1 Boden ↔ Brücke, C2 Brücke aus dem Inselrand).
  - Steinbrücken zwischen Inseln sind FAIL (V-120 a); der Inselrand-Anschluss läuft über 1.3 bzw. 1.4.
- **Schnittstelle:** wie 1.1; am Inselrand ein Anker-Rahmen (siehe §4).
- **Tests:** vorhanden (Regression, `test-v015` C1/C2).
- **Aufwand:** –

### 1.3 Auffahrt auf Bodenhöhe (V-110; V-099 Typ 1; C4)
- **Vorlage:**
  - Track Core 0.14+ **EXIT / ENTRY** (Makros l.1065–1085), DIVERGE / CONVERGE (l.356–361), `entryTo()` (l.1278);
  - Gore- und Nasenflächen (`compileGraph` l.1127–1190);
  - **B5** Rampenfuß Bande → Stadtbord.
- **Stand:**
  - **vorhanden** für Weltstraßen (HIGHWAY): `test-v014` 15/15, inklusive Außenkante durchgehend, Gore + Nase, Kreuzungsabstand und Negativtest „keine stumpfe Rampe“.
  - **teilweise** für die J17-Strecke: EXIT/ENTRY auf der Familie RACE ist ungetestet.
  - Gore- und Nasenflächen fehlen im J17-Look (C4_VORLAGE_R1 l.18, Lab).
- **Schnittstelle:** Hauptstrecke behält Linie und Spuren; Ast einbahnig mit eigenem Stream; Start- und Endrahmen exakt auf der Fahrbahnkante.
- **Tests:** test-v014 (HIGHWAY). Fehlt: dieselben 15 Prüfungen auf RACE.
- **Aufwand:** **S**

### 1.4 Übergang Strecke → Inselstraße (B6) · **korrigiert nach V-139 / V-140**
- **Vorlage (vorhanden, 1:1 nutzen):** Joyride J14 T4 Zone **ZA** und J17 transition-atlas.
  - `transition-profiles.v1.json`: Familie `A_track_city`, s 1470–1570 (100 m), beide Seiten, sideLag 0,08.
  - `transition-atlas.v1.js:57–59` (Gewichte je Schicht, smoothstep im Fenster), `:198` (Bordsteine).
  - `track-look.v5.js`: `:203` Bande H → 0,32 und an die Kante, `:75–77 / 139–144 / 229` `ROAD_APPLY`.
  - Fenster Bande 0–0,55, Bord 0,28–1, Gehweg 0,40–1.
  - **Variante B** (V-095, V-104; Lab `docs/critic/lab-track/2026-10-11_C0/c0-ab.json`): Bord 0,37–0,82, Bande 0,15–0,54 → **17 m Überlappung** auf 100 m.
  - Der Atlas ist in J14, J15, J16 und J17 byte-gleich.
- **Wie es dort gelöst ist:** **kein Familienwechsel im Core.** Ein einziger RACE-Strom läuft weiter. Im Strom ändern sich nur die Markierung je Stück (z. B. td03 `street_out` `markings: STREET`) und die Zone (TRANSITION bzw. `zones`). Bande, Bord, Gehweg und Häuser sind Look-Schichten über dem Strom („Owner: nur Look“, `transition-atlas.v1.js:1–6`).
- **Stand:** **vorhanden.** Track Core 0.16.1 kann das schon: Stück TRANSITION, Biome bzw. Zonen, Markierungen. Teil 0 zeigt den gleichen Strom wie v0.12. Das frühere „fehlt“ war falsch, es fehlte das Such-Protokoll.
- **Was die Ablehnung in Track Core meint:** `transitionEntry` lehnt RACE → TOWN nur für **Weltstraßen-Körper** ab (roadbed-Straßen mit Körper, Bord und Gehweg als gebaute Teile). Einen Typwechsel braucht es nur, wenn eine J17-Strecke in eine **roadbed-Straße** (kfb.road-bed/1, z. B. hub_town) übergehen soll. Dann ist das eine **Naht zwischen zwei Rahmen** (Strom-Ende in Zone ZA ↔ roadbed-Anfang) nach dem Modul-Katalog. Ein neuer Entwurf ist das nicht. Umsetzung genau nach ZA bzw. Variante B, falls nötig.
- **Aufwand:** **S** (Naht-Rahmen + Test, nur falls gebraucht).

### 1.5 Rampe auf eine Ebene (V-110 „Rampe nach oben auf Gerüst bzw. Plattform“; C4; V-099 Typ 2 „Ausfahrt nach oben“)
- **Vorlage:**
  - Höhenverlauf `rise` mit `riseEase` / `riseBlend`, Kuppe ≤ 8 % (`CREST_MAX_GRADE`);
  - CONNECT auf einen Zielrahmen {p, heading, grade};
  - B5 `ramp: true`.
- **Stand:** **teilweise.**
  - Die Geometrie geht heute schon mit STRAIGHT + rise oder mit CONNECT.
  - Es fehlt ein **Modul „Ebenen-Rampe“**: Anfang auf Straßen- bzw. Bodenhöhe, Ende **eben** auf einem Ebenen-Anker (Plattform bzw. Gerüst) mit Halteplatte.
  - Dazu fehlen eine Steigungs-Prüfung ≤ 8 % je Stück und der Anschluss-Rahmen am Ebenen-Anker.
- **Schnittstelle:** Ebenen-Anker = {p, heading, y, Breite, Kante frei/Brüstung}, kommt vom Lab (V-099-Anker).
- **Tests:** neu: Steigung, eben am Ende ≤ 0,5 %, Kante auf Anker ≤ 1 mm.
- **Aufwand:** **S**

### 1.6 Straße durch den Platz (V-110)
- **Vorlage:** TOWN-Familie, Straßenbett `kfb.road-bed/1` mit `bedTarget` / `wallFootY` (Regel B).
- **Stand:** **vorhanden** (Weltstraße). Von der J17-Strecke kommend braucht es B6 (1.4).
- **Aufwand:** –

### 1.7 Wendeschleife um eine Drehscheibe (V-110; V-118 TBD) · ausdrücklich geprüft
- **ROUNDABOUT mit einem Arm** (heute gemessen):
  - Kompiliert mit genau einem Wendeweg `in>in`.
  - HIGHWAY: alle Graph-Prüfungen grün.
  - **TOWN: `node_paths` rot.** Der Wendeweg kommt Bord bzw. Insel bis 1,73–1,89 nahe; verlangt ist mindestens eine halbe Fahrzeugbreite. Dazu die Warnung `node_path_radius` 7,1–8,0 < 8 m.
  - Ursache: Der Wendeweg muss an der Mündung um die Splitter-Nase des einzigen Arms.
  - Die Mitte kennt nur `park | statue | pond | resident`, keine **Drehscheibe**.
- **HAIRPIN_180:** vorhanden (heute geprüft: r 12, grün). Das ist eine offene Kehre ohne Knoten; eine Wendeschleife auf derselben Straße ist es nicht.
- **J14-Pad WENDESTELLE** (`J14 lab-track/parcours/p1-recipes.js` l.54, `wende_j14`): eine Wendeplatte um die vorhandene `plaza_hairpin` (HAIRPIN_180 r 22), mit Prüfung `pad_level` und geführtem Fahren. Keine eigene Form.
- **Stand:** **teilweise.**
- **Was fehlt:**
  - Wendeweg-Lösung für den einarmigen Kreisel: Splitter-Nase runden bzw. Schürze weiten, Mindestabstand halbe Fahrzeugbreite, Radius ≥ 8.
  - Mitte `kind: 'turntable'` mit Radius bzw. Drehachse als Szenerie-Anker (die Drehung selbst macht das Lab).
  - Tests für TOWN, RACE und HIGHWAY.
  - Für die J17-Strecke zusätzlich B6 bzw. ein Kreisel in Familie RACE (Kreisel sind heute Weltstraßen-Knoten).
- **Schnittstelle:** Knoten mit Socket `node/arm` (vorhanden); die Mitte als Szenerie-Anker {c, r, kind}.
- **Aufwand:** **M**

### 1.8 Kreisel allgemein (V-134)
- **Vorlage:**
  - `ROUNDABOUT` (v0.12 l.886–1092 = 0.16.1 l.1323ff);
  - Demo `presets.v012.json` modul_kreisverkehr (heute mit 0.16.1 grün);
  - Renderer `stream-to-three.v5.mjs` `buildNode` / `buildDeck`.
- **Stand:** **vorhanden** (Graph, Wege, Prüfungen; test.mjs M/S/L).
- **Offen** laut S13-Return: Splitter-Inseln nur gemalt, nicht erhaben; Mitte ein Platzhalter. Die Geometrie der erhabenen Splitter-Inseln wäre Track Core, der Look ist Lab.
- **Aufwand:** **S**

### 1.9 Parkhaus-Spindel durch die Insel-Basis (V-113; Vorlage J14 T4 td03, Zone ZC)
- **Vorlage:**
  - `presets.v012.json` `td03`: `park_in` WIDTH_STEP (Parkdeck-Querschnitt, Seiten 0,35, Deck 1, Bande 0,9) → `helix` SPIRAL −1080°, r 24,5, rise 15,3, `riseSteps: 3` (3 Etagen à 5,1, jede eben auslaufend) → `atrium_up` → `roof_hairpin` HAIRPIN_180 r 13,75.
  - Zone ZC = Parkhaus-Ausfahrt in 15 m Höhe.
  - Daneben Blender-Hülle `TD01-TOKYO-DRIFT/scripts/build_td01_parkdeck.py` (5 Ebenen à 4 m, r 22, 2,9 %), nur Hülle.
- **Stand:** **teilweise.**
  - Die Spindel selbst ist **vorhanden**: td03 kompiliert mit 0.16.1, 1570 m, grün.
  - **Fehlt:**
    - eine **Ausfahrt je Ebene** (Abzweig aus der Spirale auf eine Ebenen-Platte; DIVERGE ist heute nur gerade und eben);
    - **Ebenen-Platten** als Deck-Zonen;
    - Tunnel-**Host „Inselbasis“** mit Portal unten bzw. oben. Das Tunnel-Einsetzen ins Grundnetz ist Lab-Sache (V-112, `insertTunnelsIntoBody`); Track Core liefert Röhre und Portal-Rahmen.
- **Schnittstelle:** Portal-Rahmen unten und oben; Ebenen-Socket je Etage {p, heading, y}; Tunnel-Hülle `tunnelOuter()`.
- **Tests:** neu: Steigung je Etage, eben je Ebene, Ausfahrt-Kante, Tunnel offen 0 / non-manifold 0 (wie MODULES.md).
- **Aufwand:** **L**

### 1.10 Tunnel durch die Insel mit Ausfahrt per Rampe nach oben (V-099 Typ 2; O1 v7)
- **Vorlage:**
  - O1 v7 `organ-islands.v7.js`: Docks D0/D1 auf der Ring-Tangente, `tunnel_<id>` STRAIGHT mit `{preset: 'gotthard'}` (l.617).
  - Anlauf `into()` (l.634) = CONNECT auf einen Punkt 120 m vor dem Dock, dann eine STREET-Gerade.
  - Portal-Kragen und Mündung im Lab-SDF (l.472–500).
  - Tunnel-Formen als eigene Moduleigenschaft (V-130).
- **Stand:** Tunnel **vorhanden**, die Rampe nach oben aus dem Tunnel auf den Inselboden **fehlt**. Gebraucht werden:
  - ein Einschnitt (Graben mit Wänden, Stütze `cut`; Track Core kennt nur `ground` und `bridge`);
  - Portal-Ausgang in den Einschnitt;
  - Einschnitt-Ende auf dem Boden. Dazu kommen 1.5 und, für die Ankunft auf einer Inselstraße, 1.4.
- **Aufwand:** **M**

### 1.11 Ring und Docks (O1 v7)
- **Vorlage:** Ring r 1500, Inseln bei 72/144/216/288°, Docks ± 12 m auf der Tangente.
- **Stand:** **vorhanden** als Zusammensetzung aus vorhandenen Stücken (CONNECT, STRAIGHT, Tunnel, Schleifen bzw. Loop-Blöcke).
- **Lücke:** Es gibt keinen einheitlichen **Dock-Rahmen**; jedes Rezept rechnet `into()` selbst. Gehört in den Modul-Katalog (§4).
- **Aufwand:** **S**

### 1.12 C4 im Detail (EXIT/ENTRY, B5, B7)

| Teil | Stand | Tests |
|---|---|---|
| EXIT / ENTRY | vorhanden (HIGHWAY) | test-v014 15/15 |
| B5 Rampenfuß | vorhanden | test-v015/16 |
| B7 Haltebucht | vorhanden (0.16.1) | test-v016 116/116; im Lab C4a abgenommen |

- **Für C4b** (Ring über 0.16.1, ≤ 1 mm sonst Stopp) fehlt der Gleichstand-Test v0.12 ↔ 0.16.1 (Teil 0).
- **Für C4c** fehlen die EXIT/ENTRY-Tests auf RACE (1.3). B6 (1.4) gibt es als Zone ZA bzw. Variante B.

### 1.13 Paternoster (V-099 Typ 3)
**fehlt**, laut V-099 „später“. Nicht in dieser Runde.

## 2 · Übersicht

| # | Teil | Stand | Aufwand |
|---|---|---|---|
| 0 | Stream-Vertrag 0.16.1 ↔ Lab (Gleichstand ≤ 1 mm) + Modul-Katalog-Felder | teilweise | M |
| 1.1 | J17-Grundstrecke | vorhanden | (Teil 0) |
| 1.2 | Brücke frei im Raum | vorhanden | – |
| 1.3 | Auf- bzw. Abfahrt EXIT/ENTRY auf RACE | teilweise | S |
| 1.4 | B6 race ↔ Straße (J14 ZA / J17 Atlas, Variante B) | **vorhanden** (Zone im Look über einem RACE-Strom); roadbed-Naht nur falls nötig | S |
| 1.5 | Ebenen-Rampe auf Plattform | teilweise | S |
| 1.6 | Straße durch den Platz | vorhanden | – |
| 1.7 | **Wendeschleife um Drehscheibe** | teilweise | M |
| 1.8 | Kreisel (erhabene Splitter) | vorhanden / teilweise | S |
| 1.9 | **Parkhaus-Spindel durch die Basis** | teilweise | L |
| 1.10 | Tunnel mit Rampe nach oben (Einschnitt) | teilweise | M |
| 1.11 | Dock-Rahmen O1 | vorhanden als Komposition | S |
| 1.13 | Paternoster | fehlt (später) | – |

## 3 · Vorschlag Reihenfolge (je mit Vorlagen-Zeile an die Steuerung)
1. **Teil 0:** Gleichstand-Test 0.16.1 gegen v0.12 über alle Lab-Rezepte (J17 p1b.v2, td03, O1-Ringe, Module) + MODULES-Felder.
2. **1.3 + 1.4:** EXIT/ENTRY auf RACE testen; B6 nach Vorlage ZA bzw. Variante B (V-139), kein neuer Entwurf.
3. **1.5** Ebenen-Rampe, **1.7** Wendeschleife (einarmiger Kreisel, Drehscheibe).
4. **1.10** Einschnitt, **1.9** Spindel (Phase E/F).

## 4 · Vorschlag Modul-Katalog-Felder (MODULES.md, je Teil)
- **Querschnitt:** Familie (race | world), Breite, Slots, Seite L/R mit `edge` (Bande | Bord | Bankett | frei) und `barrierVis`.
- **Anschluss-Rahmen:** Liste {id, kind (route-start | route-end | socket | portal | level | dock), p, T, U, R, grade, Breite, Familie}. Nahtregel: Lücke 0, Höhensprung 0, Normalensprung ≤ 1,10° (wie heute), Querschnitt gleich oder Katalog-Übergang.
- **Maßstab:** race-m bzw. lab, ausdrücklich je Rahmen.
- **Prüfungen:** Liste der Track-Core-Prüfungen, die das Teil grün halten muss, plus Lab-Prüfung (Naht, Tunnel offen 0).
- **Look:** Verweis auf das Lab-Modul (J17). Track Core liefert keinen Look.

_Quellen: `~/Developer/rkit-r3/trackcore/track-core.mjs` (0.16.1); Lab `docs/concepts/C4_VORLAGE_R1.md`, `docs/PHASE_C_DONORS_R1.md`, `docs/critic/lab-track/2026-10-11_C1b-C3-r2/MODULES.md`; J14/J17/O1 wie oben. Messungen vom 11.10. (einarmiger Kreisel, HAIRPIN_180, td03, modul_kreisverkehr, B6-Ablehnung) mit Track Core 0.16.1._



## 5 · Such-Protokoll nach V-140 (nachgetragen 2026-10-11)
Zwei Suchläufe. Alle Greps ohne Groß-/Kleinschreibung, ohne node_modules, Basis `~/Dropbox/CLAUDE`, dazu Track Core privat `~/Developer/rkit-r3`.

**Suchbegriffe**
- **A (B6):** B6, ZA, A_track_city, transition-atlas, ROAD_APPLY, kerb/Bord, 17 m, Variante B, RACE→TOWN, track gate.
- **B (Wendeschleife):** wende*, Wendehammer, U-turn, turnaround, turntable, Drehscheibe, roundabout/Kreisel, hairpin, WENDESTELLE.
- **C (Ebenen-Rampe):** Ebenen-Rampe, ramp to level/platform/deck, Gerüst, landing plate, roadLift, isle_HX.
- **D (Einschnitt):** cut, trench, Einschnitt, schlucht_, hang_, Stützmauer, retaining wall, support kinds.
- **E (Spindel):** Parkhaus, Parkdeck, Spindel, helix, riseSteps, td03, ZC, level exit, build_td01_parkdeck.

| Quelle | gesucht | gefunden |
|---|---|---|
| Donor-Karte `Lab/docs/PHASE_C_DONORS_R1.md` | A–E | A: l.21 Atlas, l.31–33 Variante A/B (1 → 17 m). C: l.48 „keine Ausfahrt-Rampe auf einen Inselboden“. D: l.44–45 CUT_R und schlucht_, l.65–66. B, E: nicht gefunden |
| Donor-Karte `Lab/docs/MVP1_DONOR_AND_MODEL_MAP_R1.md` | A–E | l.26 „B5–B6“ = Brücken-Zielbild-IDs (nicht das Gate). B–E nicht gefunden |
| `Lab/docs/ACCEPTANCE_INDEX.md` | A–E + track, strecke, joyride | nicht gefunden |
| J14 `KFB_JOYRIDE_J14_…_r1/` | A–E | A: transition-profiles ZA; transition-atlas.v1.js:1–6, 57–59, 198; track-look.v5.js:75, 203, 229. B: p1-recipes.js:54 `wende_j14` (Pad um plaza_hairpin r 22, assist guided), TEST_REPORT.md:10,16. E: presets td03 helix, riseSteps; ZC `C_city_track_deck` s 560–650; core `heightSchedule` l.160–164. D: Tunnel-Hosts ohne cut |
| J15 (TC1) `KFB_JOYRIDE_J15_…_r1/` | A–E | wie J14 (Core und Atlas byte-gleich) |
| J16 `Lab/donors/joyride-j16r2-zip/` | A–E | wie J14; tc1 Erdhügel `ramp()` l.130 (Abdeckung, kein Einschnitt) |
| J17 `Lab/donors/joyride-j17-staged/` und `KFB Joyride J17 · FB Cabrio/` | A–E | A: Atlas, ROAD_APPLY. B: travel-modes.j17.js:32,54; travel-core.j17.js:124 (wende-Ereignis, keine Lenklogik) |
| Organ-Inseln v4–v7 `KFB Organ-Inseln + race track v4+/` | A–E | A: kein Atlas; `into()` wechselt TRACK → STREET je Stück (v7 l.621). B: `lab-v7/vehicle-manoeuvre.v1.js` (Mehrpunkt-Wende des Fahrzeugs), Kehren HAIRPIN_180 (v6:581, v7:718). C: isle_HX flache Gerade, roadLift = Decktiefe. D: schlucht_ / hang_ als SDF-Ausschnitt (v4:4, 87, 492, 543–547; v7:4, 105, 472–500, 907–914, 1054–1056), keine Wände, keine Rampe aus dem Portal |
| RollerCoaster v11 `KFB VoxelWorld/KFB RollerCoaster v11/` | A–E | nicht gefunden (nur Farb- und Tempo-Rampen) |
| Stunt Car Race `KFB Stunt Car Race/` | A–E | A: „Track-Gate-Modus“ (VFX, nicht das). B: U-Turn-Research RESEARCH.md:358–567, Kreisel-GLB-Kandidaten ASSET_INDEX.md:106–107. C: Sprungkeil world.js:15,62. D, E nicht gefunden |
| Frühere RKIT-Lieferungen `KFB Racetrack Blender Kit/` (27 RETURN, TRACK-CORE, RKIT-R3, TD01, GC02) | A–E | A: S4-Brief §4A.4 l.312–316 (Adapter Stadt ↔ Rennstrecke auf demselben Core). B: S13 RETURN l.16–36 (Kreisel, Mitte ohne Drehscheibe). D: S8 `s8_tunnel_site.py` l.209, 245–262 (offener Einschnitt am Portal, Blender); GC02 `canyon_lib.py:257` (cut/fill/bridge/tunnel). E: TD01 `build_td01_parkdeck.py` (5 Ebenen, Einfahrt je Ebene l.83, Sockel `level_k_entry` l.142–153, 2,9 %, ohne ebene Absätze); S3 RETURN l.45, 54–55, 83 (riseSteps) |
| `KFB_HUB/` (30_DECISIONS, replies, 20_BRIEFINGS) | A–E | V-095, V-099, V-104, V-110, V-113, V-134, V-139; REVIEW_STEUERUNG_R1.md:21,30; REPLY_BLENDER_FORM_KIT_01_R1.md:15,24 |
| Lab `docs/critic/lab-track/2026-10-11_C0/`, `docs/concepts/C4_VORLAGE_R1.md` | A, B | c0-ab.json, REPORT.md:12–24, Fixture Variante B l.53–57; C4_VORLAGE_R1.md:16–17, 43 |

**Nicht durchsucht:** der GitHub-Zweig `research/kfb-track-core-transition-rail-2026-10-10` (nur die lokalen Fixture-Kopien).

**Ergebnis je Teil nach dem Protokoll**
- **1.4 B6:** **vorhanden** (oben korrigiert).
- **1.7 Wendeschleife:** bleibt **teilweise**.
  - Vorlagen: J14-Pad WENDESTELLE (Pad um HAIRPIN_180), einarmiger ROUNDABOUT (Track Core), Mehrpunkt-Wende des Fahrzeugs (O1 v7, Fahrlogik, keine Geometrie).
  - Eine Drehscheibe bzw. Wendeschleife um eine Mitte ist in keiner Quelle gefunden.
- **1.5 Ebenen-Rampe:** bleibt **teilweise**. Bausteine: `riseSteps` (ebene Absätze), CONNECT auf einen Rahmen, TD01-Ebenen-Sockel. Eine Rampe, die eben auf einem Ebenen-Anker endet, ist in keiner Quelle gefunden.
- **1.10 Einschnitt:** bleibt **teilweise**. Bausteine: O1 schlucht_ / hang_ (SDF), S8 offener Einschnitt am Portal (Blender), GC02 classify. Ein Graben mit Wänden aus einem Portal ist in keiner Quelle gefunden.
- **1.9 Spindel-Ausfahrten:** bleibt **teilweise**.
  - Bausteine: td03-Spirale mit riseSteps, Zone ZC, TD01-Parkdeck (Einfahrt je Ebene, Sockel `level_k_entry`).
  - Fehlt: Ausfahrt aus der Spirale auf eine ebene Platte im Track Core. TD01 zeigt die Form als Blender-Hülle, ohne ebene Absätze.
