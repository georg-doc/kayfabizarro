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

### 1.4 Übergang Strecke → Inselstraße: Track-Gate **B6** (neu, Voraussetzung für 1.3, 1.5, 1.7)
- **Vorlage:** keine. Track Core lehnt es ausdrücklich ab: `transition RACE → TOWN: world ↔ race needs a track gate (catalogue B6, P2)` (heute geprüft).
- **Stand:** **fehlt.** Jede Ankunft der J17-Strecke (Maßstab race) auf einer Inselstraße (Maßstab world: TOWN, COUNTRY …) braucht ihn. Heute gibt es nur Welt-zu-Welt-Übergänge: B1, B2, B3, B5, B7.
- **Schnittstelle:**
  - Katalogeintrag wie B5/B7: Mindestlänge, Fenster je Schlüsselgruppe (Bande, Bankett, Bord, Gehweg, Fuß).
  - Gebaute Abfolge (z. B. Bande endet mit Kopf → Breiten-Stufe 14,4 → 8 → Bordkopf).
  - Der Maßstabswechsel race m → lab ist ausdrücklich zu benennen (MODULES.md l.3: lab = m × 1,46).
- **Tests:** neu: Kante durchgehend, kein Höhensprung, Fenster, Fahrtest-Linie.
- **Aufwand:** **M.** Die Gestaltung des Kopfes bzw. der Abfolge ist Georgs Entscheidung (Vorlagen-Zeile).

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
- **Für C4c** fehlen EXIT/ENTRY auf RACE (1.3) und B6 (1.4), sobald die Rampe auf eine Inselstraße führt.

### 1.13 Paternoster (V-099 Typ 3)
**fehlt**, laut V-099 „später“. Nicht in dieser Runde.

## 2 · Übersicht

| # | Teil | Stand | Aufwand |
|---|---|---|---|
| 0 | Stream-Vertrag 0.16.1 ↔ Lab (Gleichstand ≤ 1 mm) + Modul-Katalog-Felder | teilweise | M |
| 1.1 | J17-Grundstrecke | vorhanden | (Teil 0) |
| 1.2 | Brücke frei im Raum | vorhanden | – |
| 1.3 | Auf- bzw. Abfahrt EXIT/ENTRY auf RACE | teilweise | S |
| 1.4 | **Track-Gate B6 race ↔ world** | **fehlt** | M (+ Georg) |
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
2. **1.3 + 1.4:** EXIT/ENTRY auf RACE testen; B6 erst nach Georgs Entwurf für die Abfolge.
3. **1.5** Ebenen-Rampe, **1.7** Wendeschleife (einarmiger Kreisel, Drehscheibe).
4. **1.10** Einschnitt, **1.9** Spindel (Phase E/F).

## 4 · Vorschlag Modul-Katalog-Felder (MODULES.md, je Teil)
- **Querschnitt:** Familie (race | world), Breite, Slots, Seite L/R mit `edge` (Bande | Bord | Bankett | frei) und `barrierVis`.
- **Anschluss-Rahmen:** Liste {id, kind (route-start | route-end | socket | portal | level | dock), p, T, U, R, grade, Breite, Familie}. Nahtregel: Lücke 0, Höhensprung 0, Normalensprung ≤ 1,10° (wie heute), Querschnitt gleich oder Katalog-Übergang.
- **Maßstab:** race-m bzw. lab, ausdrücklich je Rahmen.
- **Prüfungen:** Liste der Track-Core-Prüfungen, die das Teil grün halten muss, plus Lab-Prüfung (Naht, Tunnel offen 0).
- **Look:** Verweis auf das Lab-Modul (J17). Track Core liefert keinen Look.

_Quellen: `~/Developer/rkit-r3/trackcore/track-core.mjs` (0.16.1); Lab `docs/concepts/C4_VORLAGE_R1.md`, `docs/PHASE_C_DONORS_R1.md`, `docs/critic/lab-track/2026-10-11_C1b-C3-r2/MODULES.md`; J14/J17/O1 wie oben. Messungen vom 11.10. (einarmiger Kreisel, HAIRPIN_180, td03, modul_kreisverkehr, B6-Ablehnung) mit Track Core 0.16.1._

