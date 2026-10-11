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
