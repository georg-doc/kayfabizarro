# RKIT · trail-Bibliothek gebaut (V-152 / V-154 / V-157 / V-158) · Track Core 0.16.6 (R1)

Stand 2026-10-11 · privat · Lab-Vendor nicht berührt · **Gangwerte sind TEST-Werte**, bis die MVP-Messung (Medium-Rig) vorliegt

## 1 · Was gebaut ist

Das Geh-Netz gehört dem Lab-Layout (`IslandLayout.routes / places`, V-002). Track Core rechnet nur das Profil einer Lab-Route und gibt Bauteile mit Ankern {p, T, U} zurück. Eigene Routen oder Knoten baut es nicht.

| Funktion | Ergebnis |
|---|---|
| `trailProfile(route, {gait})` | Teile entlang der Route: Rampe (≤ 12 %, V-158) bzw. Treppe |
| `trailStairs(seg, {gait, width})` | Stufen aus Masonry A: Höhe ≤ min(0,4545, gait.step.maxRise), Auftritt ≥ max(⅛ MC, gait.step.minTread); 3–12 Stufen, dann Podest 1 MC; Kit STUFE_1MC (1 MC) bzw. STUFE_12MC. Ein zu kurzer Lauf wird mit der nötigen Länge abgelehnt. |
| `trailSteppingStones(seg, {gait, mode})` | Steine über Bach bzw. Wiese; Abstand = gemessene Schrittlänge (walk) bzw. ≤ hop.maxGap; Sprunghöhe geprüft |
| `trailFootbridge(a, b, {width})` | Spannweite und Deckrahmen, Neigung ≤ 12 %; Look aus Bestand (KayKit Medieval Builder `bridge(_roofed)`, Hex `building_bridge_A`); Pfeiler nur auf der Insel (V-120) |
| `trailTransition(kind)` | Platz bündig (V-150 #8); Straße mit Bordabsenkung, Zebra nur auf Anfrage (V-150 #9); Schotter bündig mit Fransen |
| `trailChecks(route, {gait, streams, crossings})` | walk_grade, walk_ends (beide Enden an einem Anker), walk_clear (keine Track-Core-Straße auf dem Pfad außerhalb erklärter Querungen) |

**Kein fester Gangwert im Core** (V-157): Fehlt ein Maß, gibt es einen Fehler. Ein als `test` markiertes gait wird in jedem Ergebnis als `gaitSource: 'test'` mitgeführt.

## 2 · Gemessen (mit TEST_GAIT: walk 2,2 · jog 3,0 · hop 3,5 / 1,2 · step 0,5 / 0,6, alles Testwerte)

| Fall | Ergebnis |
|---|---|
| sanfter Pfad (3,3 %) | eine Rampe |
| Hang: 4 m Steigung auf 8 m | Rampe → Treppe (9 Stufen × 0,444, Auftritt 0,889) → Rampe |
| 8 m Steigung auf 40 m | 18 Stufen, 1 Podest |
| 10 m Steigung auf 5 m | abgelehnt: „needs 23 steps … = 24,80 m“ |
| Trittsteine 9 m | walk: 4 Steine, Abstand 1,8; hop: 2 Steine, Abstand 3,0 |
| Fußbrücke 12 m | Spannweite 12, Neigung 3,3 % |
| Pfad gekreuzt von einer Landstraße | walk_clear meldet die Kreuzung; mit erklärter Querung PASS |

## 3 · Tests und Gleichheit

| | |
|---|---|
| `test-trail.mjs` (neu) | **19/19** |
| alle übrigen Suiten | unverändert: test.mjs 329/0, skin 88, dirt 27, turnaround 18, … |
| Teil 0 (`parity/teil0_parity_v0166.json`) | bitgleich |
| Graphen (TOWN, COUNTRY, RACE mit EXIT, Kurve, Kreisel + Schotter-Arm) | identisch zu 0.16.5; es kommen nur Funktionen dazu |

## 4 · Gefunden (offen)

Ein Schotter-Arm an einem **HIGHWAY**- oder **MOUNTAIN**-Knoten wird abgelehnt, weil die Katalog-Einträge HIGHWAY|DIRT und DIRT|MOUNTAIN fehlen. Das ist der normale Katalog-Fehler, es wird nichts still gemischt.

Vorschlag:
- **DIRT|MOUNTAIN** wie D1 ergänzen; Berg-Schotter ist CR1-Kernthema.
- **HIGHWAY|DIRT** bleibt verboten, wie HIGHWAY → TOWN (B4): erst Landstraße, dann Schotter.

Entscheidung bitte über die Steuerung.

## 5 · Weiter

- Sobald die MVP-Sitzung die Medium-Rig-Werte liefert: TEST_GAIT ersetzen, Tests neu laufen lassen, Bericht R2. Erst danach wird trail ins Lab vendort.
- Der Tunnel-Steg (Core-Tunneldatum aus R1a) folgt als eigener kleiner Schritt nach Freigabe.

## Nachtrag 0.16.7: echte Gangwerte (V-157) und D4

**Gangwerte:** gemessen am Medium-Rig (Farmer A), Lab-Datei `docs/critic/lab-track/2026-10-11_V157-gait/gait_v157.json` (`kfb.gait/1`). Track Core liest sie direkt über `normalizeGait` ein.

| Bauteil | Regel | Ergebnis mit gemessenem gait |
|---|---|---|
| Stufen | Setzstufe = min(Masonry A 0,4545; stepMax 0,885; Wandregel 0,70) | Hang 4 m auf 8 m: 9 × 0,444, Tritt 0,889 (≥ max(⅛ MC, 0,444 / 0,70)) |
| Trittsteine (Standard jog, V-021) | Abstand ≤ jog.stride 2,034 | 9 m: 4 Steine, Abstand 1,8 |
| Trittsteine walk (Sonderfall) | Abstand ≤ walk.stride 0,561 | 9 m: 16 Steine, Abstand 0,53 |
| Trittsteine hop | Abstand ≤ jog-Sprung 2,705; Höhe ≤ Kante 1,181 | 9 m: 3 Steine, Abstand 2,25; 1,3 m Höhe wird abgelehnt |

Alle Ergebnisse tragen `gaitSource: 'measured'`, alle trail-Checks bestehen.

**Offen beim Lab:**
- `step.minTread` ist `null`, und die Wandregel 0,70 steht nur als Text in der Datei. Track Core verlangt deshalb `step.wallTan` als Zahl; im Test steht 0,70 nach Steuerungs-Festlegung.
- Bitte `step.wallTan: 0.70` (und nach dem Treppen-Fußtest `step.minTread`) in `gait_v157.json` eintragen. Danach geht die Datei ohne Zusatz durch.

**D4** `DIRT|MOUNTAIN` (Bergstraße ↔ Schotter) ist wie D1 ergänzt. **HIGHWAY → Schotter** bleibt verboten (analog B4) und wirft einen eigenen Fehler.

**Tests:** test-trail 24/24, test-dirt 30/30, alle Suiten unverändert, Teil 0 bitgleich, Graphen identisch zu 0.16.6.

## Nachtrag 0.16.8: Treppen nach dem Fußtest (V-160)

**Befund des Fußtests** (MVP, J17-Walker, 60 fps): Die RKIT-Treppe 0,444 / 0,889 wird bei Jog und Sprint hochgehüpft. Ursache ist der vorausschauende Auto-Hüpfer des Walkers, nicht die Gehfläche.

**Gemessene Tabelle** (Tritt, ab dem nicht mehr gehüpft wird):

| Setzstufe | Tritt mindestens |
|---|---|
| 0,22 | 0,889 |
| 0,30 | 1,3 |
| 0,444 | 2,4 |

**trailStairs 0.16.8:**
- Liest die Tabelle direkt aus `gait_v157.json`.
- Setzstufe nach V-160: Standard **0,30 (Tritt ≥ 1,3)**, Alternative **0,22 (≥ 0,889)**. Die größere Klasse, die in die Lauflänge passt, gewinnt.
- Die Masonry-A-Setzstufe 0,45 wird nie genommen. Masonry A liefert nur noch den Look; die Stufen werden auf das Tabellenmaß gebracht.

**Zur Einordnung:** 0.16.7 hätte mit der ergänzten Datei 0,444 / 1,3 gebaut, und das hüpft. Das ist jetzt behoben.

**Beispiele:**

| Lauf | Ergebnis |
|---|---|
| 4 m auf 26 m | 14 × 0,286, Tritt 1,40, Klasse 0,30, 1 Podest |
| 4 m auf 24 m | 19 × 0,211, Tritt 0,926, Klasse 0,22 |
| 4 m auf 8 m | abgelehnt: 0,30 bräuchte 24,6 m, 0,22 bräuchte 23,3 m |

**Folge für das Lab-Layout:** Treppen sind jetzt flach und lang (Steigung ≈ 20–23 %). Steile Wege brauchen Serpentinen.

**Tests:** test-trail 27/27, alle Suiten unverändert, Teil 0 bitgleich.

**Neue Fußtest-Anker:** `Lab/docs/handoff/rkit_trail_stairs_foottest_v2.json` (Standard- und Alternativ-Treppe).
