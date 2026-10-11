# RKIT · Skin-Schnittstelle Schritt 4: Kappen je Skin + erhabener town-Splitter · Track Core 0.16.3 (R1)

Stand 2026-10-11 · privat · Lab-Vendor nicht berührt · Grundlage V-144 Modul 8, V-150 #2 / #5 / #7

## 1 · Kappen (`NODE_CAPS`, `node.caps[]`)

| Skin | form | Bestand | reason |
|---|---|---|---|
| race | `bande_head` | runder J17-Bandenkopf (Strang-Kappe `track-look.v5.js:233–260`), Nase = ROUND_END 9 (V-150 #2) | construction |
| town | `kerb_head` | RKIT Gehweg Lauf 03 Bordkopf + Baustellen-Absperrung | construction |
| country | `verge_end` | Graslippe COUNTRY + Absperrung | construction |

**Regeln**
- Eine Kappe steht an jedem Arm, dessen äußerer Socket von keiner Route benutzt wird, also kein `start.socket` und kein CONNECT `to`.
- Einfahrt und Ausfahrt eines verankerten Knotens bekommen nie eine Kappe.
- Die 1-Arm-Wendeschleife bekommt keine Kappe (V-150 #7: Sackgasse = Wende).
- Ein freistehender Knoten bekommt eine Kappe an jedem Arm, bis Routen anschließen.

**Daten:** Rahmen = Arm-Socket (p / T / U / R), Breite, `sideExtent`, Skin, Form. Kappen sind nur Daten; der Strom bleibt bitgleich. Die Abschlussstück-Familie baut das Lab bzw. RKIT (SPEC_EDGE_RUBBLE_GRAMMAR_R1, Baustein 3).

## 2 · Erhabener Splitter (nur town, V-150 #5)

- Der Splitter ist eine Insel auf Bordhöhe: TOWN barrierH 0,35, gerundete Nase 0,5 (wie bisher).
  - Zone `splitter_island` mit `top`;
  - eigener geschlossener Bord-Lauf `kerbs[]` kind `splitter` mit Bord-Querschnitt (Breite kw 0,3, Tiefe wie die Platte); die Normalen zeigen in die Fahrbahn.
- Schraffur und gemalter Umriss entfallen; der Poller bleibt.
- Race und country behalten den gemalten Splitter. Für country war ein erhabener Splitter nicht gefragt und ist nicht gebaut.
- NPC-Wege halten weiter Abstand, alle Checks grün (TOWN `node_paths` 1,885).

## 3 · Tests und Gleichheit

| | |
|---|---|
| `test-skin.mjs` | **58/58**, davon 10 neu für Schritt 4: Kappen je Skin am Socket; Route am Stummel nimmt die Kappe weg; freistehend 4 Kappen; Wende 0 Kappen; race-Nase; 4 Inseln mit Bord-Läufen und Normalen; keine Schraffur in town; race und country gemalt; town grün |
| `test-turnaround.mjs` | 18/18. Lässt nur die Zusatzfelder `skin` / `caps` aus; Welt-Kantenlinien werden ohne die neuen Splitter-Läufe verglichen. |
| test.mjs 329/0, v013 60, v014 15, v015 97 (1 erwartet), v016 116, race-exit 19, level-ramp 16 | unverändert |
| **Teil 0** (`parity/teil0_parity_v0163s4.json`) | bitgleich, Abweichung 0 |
| Schritt 2 → 4 | alle Ströme von TOWN-, RACE-, COUNTRY- und HIGHWAY-Kreiseln bitgleich. Nur die TOWN-Knotendaten ändern sich (Splitter), gewollt. |

## 4 · MODULES

| id | Änderung |
|---|---|
| endkappen | race ✓ (bande_head) · town ✓ (kerb_head) · country ✓ (verge_end) als Daten; Look-Bau Lab/RKIT |
| einfaedelung (Splitter) | town: erhabene Insel mit Bord ✓ |

## 5 · Weiter

- **#4 Banden-Übergang innen / außen:** Vorschlag liegt vor, `RKIT_BANDE_INNEN_AUSSEN_R1.md` mit Bild.
- **Schritt 3 (Markierungs-Daten):** Pfeile nur an EXIT/ENTRY, FORK/JOIN und an Kreisel-Ausfahrten (V-150 #1); Ringspuren bei mehrspurigen Ringen. Dazu der Kerb-Radius-Vorschlag (V-150 #3).
