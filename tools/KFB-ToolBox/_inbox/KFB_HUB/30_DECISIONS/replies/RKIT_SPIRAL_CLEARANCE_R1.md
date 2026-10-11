# RKIT · V-169 Spiral-Höhe gegen die Verfolger-Kamera: Vorlagen-Zeile + Messung (R1) · nur gemessen, nichts umgebaut

Stand 2026-10-11 · Messskript `~/Developer/rkit-r3/trackcore/parity/spiral_probe.mjs` → `spiral_probe.json` · Einheiten: Track-Core-Meter (Strom; lab = × 1,46)

## Kamera (J17, `joyride.j06.json` → `drive.camera`, Code `joyride-drive.j10.js:321–326`)

| Wert | J17 |
|---|---|
| Abstand hinter dem Auto (entlang der Strecke) | boom 9 + 3,4 · v/vmax (bis 12,4) |
| Höhe über der Fahrbahn (entlang U) | **3,5 + 0,9 · v/vmax → 4,4 bei vmax** |
| seitlich | in den Korridor geklemmt: Fahrbahn ± 2,4 |
| Nachlauf | follow 9 (lerp), Blickpunkt 11 voraus + 1,2 hoch |

Die MVP-Sitzung kann die Werte im Spiel nachmessen; die Prüfung nimmt sie als Parameter.

## Messung (Etagen = Stellen, an denen ein späteres oder früheres Stück desselben Stroms im Grundriss über der Fahrbahn liegt, ≥ 1 m höher, Δs ≥ 40)

Freie Höhe = Fahrbahn unten → Unterseite Deck oben (deckDepth). **Bedarf 4,90** (Kamera 4,4 + Marge 0,5).

| Strom | kleinste freie Höhe | Stelle | Ergebnis |
|---|---|---|---|
| O1 v7 Ring | 32,5 (Loop) | – | **PASS** |
| td03 | **3,35** (örtliche Steigung 4,35, Deck 1,0) | Parkhaus-Spirale `helix` s 110–476 | **FAIL** |
| J17 p1b.v2 | 3,35 | dieselbe Spirale (aus td03), s 110–476 | **FAIL** |
| P1 B (p1-recipes) | 3,35 | dieselbe Spirale | **FAIL** |
| td05 | 3,35 | Spirale s 110–476 **und** Drift unter Balkon s 743–764 (4,34, `crossing_ok`) | **FAIL** |

**Warum die Spirale durchfällt:**
- Die td03-Spirale (`SPIRAL` −1080°, r 24,5, rise 15,3, `riseSteps 3`, Tag `parkdeck`) steigt im Mittel 5,1 je Umlauf. Durch die Stufen (flache Etagen, Rampen dazwischen) sind es örtlich nur 4,35.
- Abzüglich Deck 1,0 bleiben 3,35 frei: Die Kamera bei 3,5–4,4 steckt im oberen Deck bzw. sieht nur noch die Unterseite.
- Die heutige Prüfung `vehicle_headroom` (7,0) meldet das nicht, weil die Spirale `crossing_ok` trägt.

## Vorlagen-Zeile: Prüfung `spiral_clearance`

| Feld | Vorschlag |
|---|---|
| **Logik** | neue Strom-Prüfung (`runChecks` / `runGraphChecks`): Für jede Stelle mit Etage darüber (Grundriss-Überlappung der Fahrbahnen, ≥ 1 m höher, Δs ≥ 40) muss gelten: **freie Höhe ≥ Kamera-Höhe bei vmax + Marge** |
| **Werte** | Parameter `chaseCam = {height, perSpeed, margin}`; Standard aus J17 j06 (3,5 / 0,9 / 0,5 → 4,9), dokumentiert als J17-Vorlage. Die MVP-Sitzung kann eigene Werte übergeben. |
| **Schwere** | **Fehler** bei Spiralen bzw. Parkhaus (`SPIRAL`, `parkdeck`, `helix`), hier gilt die Prüfung **örtlich**, nicht im Mittel je Umlauf (Stufen). **Warnung** bei entworfenen Kreuzungen (`crossing_ok`, z. B. Drift unter Balkon), weil die Kamera dort nur kurz durchfährt. |
| **Ausgabe** | Wert = kleinste freie Höhe, Ort s unten ↑ s oben, nötige Steigung je Umlauf (= Bedarf + Deck) |
| **Planungshilfe** | `SPIRAL` meldet beim Bau die nötige `rise` (z. B. td03: 3 Umläufe mit Stufen → ≥ 20,8 statt 15,3; ohne Stufen ≥ 17,7) |
| **Tests** | `test-spiral.mjs`: td03-Spirale FAIL mit Ort und nötiger Steigung; dieselbe Spirale mit rise 20,8 PASS; Kreuzung als Warnung; O1 PASS; Teil 0 und alle Suiten bitgleich (Prüfung ändert keine Geometrie) |
| **Aufwand** | S |

## Folge (nicht umgebaut, Entscheidung Georg)

- **td03 / J17 / P1 / td05:** Die Spirale braucht mehr Steigung, etwa ×1,36 (15,3 → ≈ 20,8). Oder die Stufen fallen weg, dann ≥ 17,7.
  - Das ist ein Eingriff in die J17-Goldvorlage (V-102); Teil 0 ändert sich dann für diese Ströme gewollt.
  - Alternative ohne Geometrie: Die Kamera in Spiralen wird abgesenkt bzw. per `drive`-Zone geführt (Lab bzw. J17-Kamera). Das ist eine Frage an die MVP-Sitzung bzw. Georg.
- **td05 Balkon-Kreuzung** (4,34): nur Warnung, kurzer Durchlauf.
