# RKIT · Skin DIRT gebaut (V-147 / V-154, Vorlage R1 + R1a) · Track Core 0.16.5 (R1)

Stand 2026-10-11 · privat `~/Developer/rkit-r3/trackcore/` · Lab-Vendor nicht berührt

## 1 · Was gebaut ist

**Familie DIRT**
- Welt-Maßstab: Knoten prüfen mit dem Spiel-Auto, Grenze 1,705.
- Keine Spuren, Markierung NONE, Breite NARROW 10,8.
- Querschnitt: Kies 1,0 (−0,05), Graslippe 1,5 (+0,15), Rand −0,2, Damm 0,8.
- Rollen: gravel, grass_lip, verge, embankment.
- Körper `BODY_FAMILIES.DIRT`, Palette `dirt` (Platzhalter, Farbe macht das Lab).
- Ein Stück mit `family: 'DIRT'` bringt Markierung und Palette selbst mit.

**Übergänge** (alle 20 m, nur auf Geraden):

| id | Paar | Fenster |
|---|---|---|
| D1 | Landstraße ↔ Schotter | Bankett weicht ab 30 % |
| D2 | Stadt ↔ Schotter | Bord und Gehweg enden in den ersten 30 % |
| D3 | Rennstrecke ↔ Schotter | einziger race ↔ world-Körperwechsel; Bande endet in den ersten 30 %, die Fahrbahn verengt sich 14,4 → 10,8 über die ganzen 20 m |

**BERM_CURVE**
- Querneigung = min(35°, atan(v²/(g·R))), g 15, v 27 (REF_ANALYSIS, Assist V-151).
- Die Außenlippe (1,5–2,5, Standard 2,0) wird Fahrfläche: Breite und Versatz steigen in den ersten 30 % der Kurve an und fallen in den letzten 30 % zurück.

**Schotter-Arme** (V-154 C):
- `arms: [{at, family: 'DIRT', end}]` am Kreisel bzw. an der Kreuzung.
- Der Knoten behält den Skin der Hauptstrecke (#14). Die Arm-Route geht über D1, D2 bzw. D3 auf Schotter, dazu 10 m Auslauf.

**Enden:** Eine Schotter-Route endet nie offen. Sie bekommt `route_end` mit `meadow`, `yard` bzw. `gate` (in `g.edgeEnds`). Schotter-Arme tragen keine Knoten-Kappe.

**Abgelehnt mit Fehler:**
- ein Schotter-Einfahrtsarm;
- eine Schotter-Route, die in einen Knoten führt;
- `skin: 'dirt'` am Knoten (eigene Schotter-Knoten kommen später);
- ein Übergang < 20 m oder in einer Kurve;
- eine Lippe außerhalb 1,5–2,5;
- eine unbekannte End-Form.

## 2 · Gemessen

| Fall | Ergebnis |
|---|---|
| DIRT-Route (gerade, Kurve R 80, gerade) | grün; Breite 10,8; Markierung NONE; Palette dirt; Ende `gate` |
| BERM_CURVE R 30, 120° | Querneigung 35,0° (ideal 58,3°); Breite 10,8 → 12,8 → 10,8; Versatz −1,0 nach außen; grün |
| BERM_CURVE R 120 | Querneigung 22,05° = ideal (unter der Grenze) |
| COUNTRY / TOWN / RACE → DIRT | D1 / D2 / D3 je s 40,5–60; Ende in DIRT; grün |
| D3 im Detail | barrierH bei 15 %: 1,32; bei 35 %: 0,15 (Bande weg); Breite bei 50 %: 12,6 |
| Kreisel TOWN / COUNTRY / RACE mit 2 Schotter-Armen | Ring bleibt town / country / race; Arme über D2 / D1 / D3; Enden gate + meadow; alle Checks grün |
| TOWN-Kreuzung mit Schotter-Arm | bleibt TOWN; Arm über D2 → Hof (`yard`); grün |
| Schotter-Ausfahrt + BERM_CURVE R 25 | grün, 35° |

## 3 · Tests und Gleichheit

| | |
|---|---|
| `test-dirt.mjs` (neu) | **27/27** |
| `test-skin.mjs` | 88/88 (dirt ist jetzt gebaut, aber noch kein Knoten) |
| test.mjs 329/0, v013 60, v014 15, v015 97 (1 erwartet), v016 116, race-exit 19, level-ramp 16, turnaround 18 | unverändert |
| **Teil 0** (`parity/teil0_parity_v0165.json`) | bitgleich, Abweichung 0 |
| 0.16.4 → 0.16.5 | Graphen aller bestehenden Familien (TOWN, RACE mit und ohne family, COUNTRY, HIGHWAY, MOUNTAIN, DRIVING_SCHOOL) mit EXIT, ENTRY, Kurve und Kreisel: **gesamtes Graph-JSON identisch** |

## 4 · MODULES-Zeilen

| id | logic | skin | edge | frames | checks / tests | Lücke |
|---|---|---|---|---|---|---|
| schotter_gerade | STRAIGHT / CURVE_EASE in DIRT | dirt ✓ | Kies + Graslippe; Bande optional per `edge` | joints | runChecks, test-dirt | Look (Rillen, Kiesel-Rubbel) im Lab |
| berm_kurve | BERM_CURVE | dirt ✓ (auch auf anderen Familien nutzbar) | Lippe = Fahrfläche | joints | Querneigung ≤ 35°, test-dirt | Grenzen je Modus später (V-151) |
| belag_schotter | D1 / D2 / D3 | country / town / race → dirt ✓ | Kerb / Bande endet zuerst | `g.transitions` | 20 m, nur Gerade | Fransen-Look (Knetkleckse) im Lab |
| schotter_arm | ROUNDABOUT / JUNCTION Arm `family: 'DIRT'` | Knoten = Hauptstrecke, Arm dirt ✓ | wie D | Arm-Route, `route_end` | test-dirt | eigene Schotter-Knoten später |
| schotter_ende | `route_end` meadow / yard / gate | dirt ✓ | – | `g.edgeEnds` | nie offen | Wiese / Hof / Gatter = Lab-Ausstattung (Gatter: Tiny Treats `gate_single`, KayKit Hex `fence_wood_straight_gate` vorhanden) |
| wendeplatz_schotter | 1-Arm-Kreisel | – | – | – | – | kommt mit den Schotter-Knoten |

## 5 · Weiter

- Vorlagen-Zeile **trail**: `RKIT_TRAIL_VORLAGE_R1.md`.
- 0.16.5 biete ich der MVP-Sitzung an, wie 0.16.3 und 0.16.4.
