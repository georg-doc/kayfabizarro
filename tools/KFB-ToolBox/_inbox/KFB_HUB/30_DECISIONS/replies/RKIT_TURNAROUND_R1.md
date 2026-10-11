# RKIT · Wendeschleife (Track Core 0.16.2, Schritt 2 von 2) · R1

Stand: 2026-10-11 · Freigabe Steuerung (V-110, V-134; Anpassung V-032-Marge) · Track Core privat

## Was neu ist
1. **Einarmiger ROUNDABOUT = Wendeschleife:**
   - Die Mündungs-Ausrundung ist standardmäßig ≥ `ONE_ARM_FILLET` 20 (vorher 14); ein ausdrücklich gesetzter Wert bleibt.
   - Der Wendeweg `in>in` hat damit Radius 11,0–12,3 statt 7,99.
   - Mehr-Arm-Kreisel bleiben **bitgleich** (geprüft gegen Schritt 1).
2. **Szenerie-Art `turntable`** (nur Anker): `node.anchor.scenery = {kind: 'turntable', r, axis: [0, 1, 0]}`.
   - r ≤ Innenradius der Insel − 0,3; zu große Wünsche werden begrenzt, z. B. 99 → 11,38.
   - Drehung und Look macht das Lab.
3. **Prüfgrenze `node_paths`** für Kreisel und Kreuzung, siehe unten.

## Prüfgrenze: alt / neu / Begründung
| | alt | neu |
|---|---|---|
| Kreisel, Weltstraße (TOWN, COUNTRY, MOUNTAIN, DRIVING_SCHOOL, HIGHWAY) | fest 2,05 = ½ Renn-Hülle `VEHICLE_ENVELOPE` 4,1 | **1,705** = ½ Familien-Fahrzeug (KFB-Auto 3,11) + **0,15 Lab-Marge (V-032)** |
| Kreisel, Rennstrecke (RACE/COSMIC bzw. J17-Schreibweise) | 2,05 | **2,05** (unverändert) |
| Kreuzung (JUNCTION, nur Weltstraßen) | 1,555 = ½ Familien-Fahrzeug, ohne Marge | **1,705** (gleiche Regel wie Kreisel) |

**Begründung**
- Die alte Kreisel-Grenze war auf Weltstraßen nicht erfüllbar. Spurbreite TOWN 4,0 bzw. COUNTRY 3,75 lässt die Spurmitte höchstens 1,75–2,0 vom Bord. Deshalb waren alle Weltstraßen-Kreisel rot, auch mit 4 Armen (TOWN 1,885, COUNTRY/MOUNTAIN 1,753).
- Die Kreuzung prüfte schon mit dem Familien-Fahrzeug. Neu ist für beide dieselbe Regel, mit echter Marge statt Bord-Berührung.
- Die Familie eines Kreisels ist die der Strecke am Einfahrts-Arm. Stummel- und Ausfahrts-Arme tragen kein Familienprofil (siehe Befund unten).

**Wirkung**
- Weltstraßen-Kreisel mit 1 und 4 Armen werden grün (TOWN 1,885–1,941, COUNTRY/MOUNTAIN 1,753–1,818, HIGHWAY 3,16).
- Kreuzungen bleiben mit der Marge grün: alle Suiten, dazu T, Y und X auf allen 5 Weltstraßen-Familien, Dorf und Stadt.
- Geometrie und Ströme ändern sich nicht.

## Tests `test-turnaround.mjs`: **17/17 PASS**
- Konstanten: Ausrundung 20, Marge 0,15, Welt 1,705, Rennen 2,05.
- Einarmig auf TOWN, COUNTRY, MOUNTAIN, DRIVING_SCHOOL und HIGHWAY: alle Strecken-, Graph- und Knotenprüfungen grün, ohne Radius-Warnung.

| Familie | Wendeweg-Radius | Abstand |
|---|---|---|
| TOWN | 11,12 | 1,941 |
| COUNTRY | 11,01 | 1,818 |
| MOUNTAIN | 11,01 | 1,818 |
| DRIVING_SCHOOL | 11,12 | 1,941 |
| HIGHWAY | 12,32 | 3,157 |

- Ausrundung standardmäßig 20, ausdrücklich gesetzte 16 bleibt.
- Drehscheiben-Anker vorhanden und begrenzt.
- Rennstrecke (J17-Schreibweise) behält 2,05.
- Mehr-Arm-Kreisel (TOWN 4 Arme, HIGHWAY 4 Arme, modul_kreisverkehr) bitgleich zu Schritt 1.
- Weltstraßen-Kreisel mit 4 Armen jetzt grün.

**Ehrlich:** Zwei Drehscheiben-Prüfungen waren im ersten Lauf rot, weil mein Test den Anker unter dem falschen Schlüssel suchte (`anchor`, nicht `centre`). Am Core lag es nicht.

## Gleichstand (Pflicht nach jedem Schritt)
- **Teil 0** v0.12 ↔ 0.16.2: O1 v7 Ring, J17 p1b.v2 (beide Rezepte), td03 bitgleich (Abweichung 0); nachgetastete J17-Datei gleich.
- **Alle Suiten:**
  - test.mjs 329 PASS / 0 FAIL;
  - v013 60, v014 15, v015 96 + 1 erwartet (Versionskennung), v016 116;
  - race-exit 19, level-ramp 16, turnaround 17.

## Befund außerhalb der Freigabe (nicht geändert, zur Entscheidung)
- **Kreisel-Arme erben die Familie nicht.** Bei einem TOWN-Kreisel trägt nur die Einfahrt das TOWN-Profil. Ausfahrt (`r+rb`) und Stummel-Arme (`rb.a1`, `rb.a3`) kommen mit dem **RACE-Seitenquerschnitt** heraus: Bankett 1,98, Bande 1,62, keine Spuren.
- Das stammt aus v0.12, wo Kreisel für die Rennwelt gebaut wurden. Es betrifft V-144 (Kreisel-Module) direkt: Wer auf Weltstraßen Kreisel baut, braucht Arme in der Familie der Einfahrt.
- Vorschlag: eigener Schritt mit Vorlagen-Zeile.

## MODULES-Zeilen
| id / version | family | section | edge | frames | scale | seam | checks | tests | look | parity |
|---|---|---|---|---|---|---|---|---|---|---|
| `ROUNDABOUT` 1 Arm (Wendeschleife) / 0.16.2 | world (TOWN, COUNTRY, MOUNTAIN, DS, HIGHWAY); race nur über B6 | Ring + Arm; Ausrundung ≥ 20 | Bord bzw. Kerb-Section des Knotens; Splitter | route-end (Einfahrt) · socket `node/arm` · anchor `roundabout_centre` (turntable) | lab (Weltstraßen) | Mündung ≤ 1 mm (`node_mouth`) | node_paths ≥ 1,705 (Welt) bzw. 2,05 (Rennen), node_path_radius ≥ 8, node_clear | test-turnaround.mjs 17/17 | Lab (J17; Drehscheibe dreht im Lab) | Mehr-Arm bitgleich; Teil 0 bitgleich |
| `turntable` (Szenerie-Anker) / 0.16.2 | – | r ≤ Inselinnenradius − 0,3 | – | anchor {p, T, U, R, r, axis} | wie Knoten | – | r begrenzt | test-turnaround.mjs | Lab | – |
| Prüfregel `node_paths` / 0.16.2 | world 1,705 · race 2,05 | – | – | – | – | – | Kreisel + Kreuzung gleich | turnaround + alle Suiten | – | Ströme bitgleich |
