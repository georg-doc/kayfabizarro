# RKIT · Skin-Schnittstelle Schritt 2: `node.skin` (V-145 / V-149) · Track Core 0.16.3 (R1)

Stand 2026-10-11 · privat `~/Developer/rkit-r3/trackcore/` · Lab-Vendor nicht berührt

## 1 · Was neu ist

**`NODE_SKINS` (Core-Konstante, kein neues Schema neben `SKINS`):**

| Skin | families | paint (Start-`q.skin` der Arme) | markings | Stand |
|---|---|---|---|---|
| race | RACE | track | TRACK | gebaut (KERB_SECTION) |
| town | TOWN, DRIVING_SCHOOL | street | LANES_KERB | gebaut (TOWN-Querschnitt: Bord + Gehweg) |
| country | COUNTRY, MOUNTAIN, HIGHWAY* | street | LANES | gebaut (COUNTRY-Querschnitt: Bankett, Graslippe, Graben) |
| dirt | – | – | NONE | **reserviert** (V-147, Querschnitt offen) |
| cosmic | COSMIC | mag | MAG | **reserviert** (V-149, Energie-Kante und Stützen offen) |

\* HIGHWAY steht vorläufig bei country, weil jeder Knoten einen Skin braucht. Das ist eine offene Frage an Georg (RKIT_CATALOG_TD_R1 §6, letzte Zeile).

**Am Knoten (ROUNDABOUT und JUNCTION):**
- Jeder Knoten trägt `node.skin` (zusätzliches Feld).
- Ohne Angabe wird der Skin aus der Einfahrt-Familie abgeleitet (Schritt 1). Race und eigene Profile ergeben `race`.
- **Ausdrücklich** `skin:` muss zur ankommenden Familie passen. Sonst Fehler mit dem Hinweis „put a transition on the route before the node“: Ein Skin-Wechsel ist ein Übergang auf der Route, nie ein Sprung an der Mündung.
- **Freistehender Kreisel:**
  - mit `skin: 'town' | 'country'` baut er Arme, Querschnitt und Stummel-Routen in TOWN bzw. COUNTRY;
  - ohne `skin` bleibt er race wie bisher.
- `dirt` und `cosmic` werden mit Fehler „reserved …“ abgelehnt. Es gibt keinen stillen Rückfall auf race.

**Das Verhältnis `node.skin` / `q.skin`** ist wie in RKIT_SKIN_S1_R1 §2 beschrieben:
- `q.skin` bleibt der Paletten-Schlüssel je Probe.
- `node.skin` setzt nur die Start-Palette seiner Arm-Routen: town → street, race → track (geprüft).

## 2 · Tests

| Suite | Ergebnis |
|---|---|
| `test-skin.mjs` | **48/48**, davon 16 neu für Schritt 2 (siehe unten) |
| `test-turnaround.mjs` | 18/18. Die Bitgleichheit lässt nur das zusätzliche Feld `node.skin` aus; Strom und alle übrigen Knotenfelder sind gleich. |
| test.mjs, v013 60, v014 15, v015 97 (1 erwartet), v016 116, race-exit 19, level-ramp 16 | unverändert |
| **Teil 0** (`parity/teil0_parity_v0163s2.json`) | bitgleich (siehe §3) |

Die 16 neuen Fälle in `test-skin.mjs`:
- Schlüsselliste;
- abgeleiteter Skin je Familie;
- ausdrücklich = abgeleitet, bitgleich (town, country, race);
- 3 Ablehnungen bei falscher Familie;
- dirt, cosmic, unbekannt;
- freistehend town und country grün;
- freistehend ohne Skin = race;
- `q.skin` bleibt Palette;
- JUNCTION.

## 3 · Teil 0 und Weltstraßen

- Schritt 2 ändert keine Geometrie. Die Welt-Kreisel-Zahlen sind die von Schritt 1 (RKIT_SKIN_S1_R1 §1).
- Teil 0: siehe unten (wird nach dem Lauf eingetragen).

## 4 · MODULES-Feld `skin`

| Feld | Inhalt |
|---|---|
| `skin` | `node.skin` des Bausteins: race · town · country (dirt, cosmic reserviert) |
| `skins[]` | Schichtentabelle RKIT_SKIN_S1_R1 §3 (SLOT, paint, Rolle, Owner); Spalte country = COUNTRY-Rollen (gravel, verge_lip, verge, ditch, embankment) |

## 5 · Weiter

- **Schritt 4:** Endkappen je Skin, also Stummel-Arm-Kappe und erhabener Splitter.
- Die offenen V-148-Punkte (21 TD + 13 CS) fasse ich nicht an, bis Georg geantwortet hat.
- Endkappen-Formen, die in §6 offen sind, baue ich nicht:
  - TD1 #13;
  - TD2 #11;
  - CS1 #14 und #16;
  - CS2 #18.

  Die Stummel-Kappe am Kreisel-Arm ist davon getrennt (V-144 Modul 8).
