# RKIT · LEVEL_RAMP (Track Core 0.16.2, Schritt 1 von 2) · R1

Stand: 2026-10-11 · Freigabe Steuerung (V-134; V-099 Typ 1/2, V-110, C4c) · Track Core privat (`~/Developer/rkit-r3/trackcore/track-core.mjs`)

## Was neu ist
Ein Makro aus **vorhandenen** Teilen, keine neue Geometrie-Art:
```js
{ id: 'up', type: 'LEVEL_RAMP', to: { p: [x, y, z], headingDeg, y?, width? }, landing: 12, maxGrade: 0.08, stretch: 1 }
```
- **Erweiterung:** CONNECT (Hermite, Steigung 0 am Ende) auf den Anfang einer Halteplatte, dann die Halteplatte (STRAIGHT, `landing` m). Deren Endrahmen liegt genau auf dem Anker.
- **Grenze:** Steigung ≤ `maxGrade` (Standard 8 % = CREST_MAX_GRADE). Ist die Rampe zu steil, gibt es einen Fehler mit der nötigen Länge, z. B. „needs about 93.7 m“; nie eine stille Steilrampe.
- **Ausgabe:** `stream.levels[]` = {kind `level`, id, s, p, T, U, R, width, anchor, onAnchor_m, landingMaxGrade, landing}, die MODULES-Rahmenart `level`.
- Geht als Ast nach EXIT (`then: [..., LEVEL_RAMP]`) und auf jeder Familie (getestet RACE, TOWN).

## Tests `test-level-ramp.mjs`: **16/16 PASS**
| Prüfung | RACE | TOWN |
|---|---|---|
| kompiliert, Streckenprüfungen grün | ✓ (151 m) | ✓ |
| Steigung ≤ 8 % | 4,80 % | 4,80 % |
| Halteplatte eben ≤ 0,5 % (14 m) | 0,0000 % | 0,0000 % |
| Endrahmen auf dem Anker ≤ 1 mm, ≤ 0,05° | 2·10⁻¹³ m, 0° | 2·10⁻¹³ m, 0° |
| Ebenen-Rahmen im Strom | ✓ | ✓ |
| Anti-Köln | 0 / 0 | 0 / 0 |

- EXIT-Ast auf RACE mit LEVEL_RAMP (4 m hoch, 130 m): alle Graph-Prüfungen grün, Ebenen-Rahmen auf dem Anker.
- Negativ: 6 m auf 25 m wird abgelehnt (44 % > 8 %, „needs about 140.6 m“); fehlender Anker wird abgelehnt.
- **Ehrlich:** Im ersten Lauf war der EXIT-Ast-Fall rot, weil ich den Anker nur 38 m hinter den Ast gelegt hatte (4 m Höhe → 11 % Steigung). Das Makro hat richtig abgelehnt und 93,7 m verlangt; im Test steht der Anker jetzt 130 m weiter.

## Gleichstand (Pflicht nach jedem Schritt)
- **Teil 0** v0.12 ↔ 0.16.2: O1 v7 Ring, J17 p1b.v2 (Rezept aus dem Stream und aus p1-recipes), td03 **bitgleich** (Abweichung 0). Die gelieferte nachgetastete J17-Datei bleibt gleich. → `parity/teil0_parity_v0162.json`
- **0.16.1 ↔ 0.16.2:** Vorlagen td03, modul_rampe, modul_uebergang, td05, seed bitgleich (Stützstellen und Fingerabdruck).
- **Alle Suiten unverändert:** test.mjs 329 PASS / 0 FAIL; v013 60/60, v014 15/15, v015 97 (1 erwartet: Versionskennung), v016 116/116, race-exit 19/19.

## MODULES-Zeile (Spalten nach RKIT_TEIL0_R1)
| id / version | family | section | edge | frames | scale | seam | checks | tests | look | parity |
|---|---|---|---|---|---|---|---|---|---|---|
| `LEVEL_RAMP` / 0.16.2 | race · world (Familie der Strecke) | wie die ankommende Strecke; Breite optional am Anker | wie die Strecke (Banden bzw. Bord laufen durch) | route-start (Ast bzw. Strecke) · **level** (Ende Halteplatte = Anker) | race-m (RACE) bzw. lab (Weltstraßen, roadbed) | am Anker: Lücke 0, Heading ≤ 0,05°, Steigung 0; Halteplatte ≤ 0,5 % | runChecks / runGraphChecks grün; Steigung ≤ maxGrade (Core wirft) | test-level-ramp.mjs 16/16 | Lab (J17-Look; Halteplatte als Deck-Zone) | Teil 0 bitgleich; 0.16.1 ↔ 0.16.2 bitgleich |

## Nächster Schritt
Schritt 2: einarmige Größenregel + Szenerie-Art `turntable` (Wendeschleife). Danach Lab-Vendor 0.16.1 → 0.16.2 mit der MVP-Sitzung abstimmen.
