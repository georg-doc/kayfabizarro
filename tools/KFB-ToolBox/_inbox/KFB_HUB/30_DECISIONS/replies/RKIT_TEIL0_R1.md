# RKIT · Teil 0: Gleichstand Track Core v0.12 ↔ 0.16.1 + Modul-Katalog-Felder (R1)

Stand: 2026-10-11 · Auftrag: Steuerung (V-134, Freigabe Teil 0) · Besitzer Track Core: RKIT (V-118) · Track Core bleibt privat.

## Ergebnis: **PASS**
0.16.1 liefert für alle Lab-Ströme **bitgleich** dieselbe Geometrie wie v0.12: Abweichung **0** in s, p, T, U, R, den 14 Slots und allen gemeinsamen prm-Feldern. Grenze war 1 mm. Die MVP-Sitzung kann den Vergleich für C4b übernehmen und muss ihn nicht doppelt bauen.

| Strom | Stützstellen v0.12 / 0.16.1 | Länge (m) | max. Abweichung s, p, T, U, R, Slots, prm | Fugen | Markierung / Skin / Tunnel |
|---|---|---|---|---|---|
| **O1 v7 Ring** `O1_ORGAN_RING_v3` (42 Stücke, geschlossen, 6 Tunnel) | 21124 / 21124 | 10584,8 | 0 | 42 gleich | 0 / 0 / 0 Abweichungen |
| **J17 p1b.v2** `P1_B_STADT_FINALE` (Rezept aus dem gelieferten Stream; geschlossen, 1 Tunnel) | 8726 / 8726 | 4392,5 | 0 | 57 gleich | 0 / 0 / 0 |
| **td03** `TD03_UNICENTER_DRIFT` (offen) | 3125 / 3125 | 1570,4 | 0 | 19 gleich | 0 / 0 / 0 |
| J17 Rezept B aus `p1-recipes.js` (heutiger Stand, Gegenprobe) | 8726 / 8726 | 4392,5 | 0 | 57 gleich | 0 / 0 / 0 |

**Gelieferte J17-Datei** `public/vendor/joyride-j17/lab-track/data/p1b.v2.stream.json`
- Sie ist laut eigenem `source.resample` die Core-Ausgabe, gleichmäßig auf ds 0,5 nachgetastet (8726 → 8786 Stützstellen, „Geometrie = Core, nur interpoliert“).
- Gegen 0.16.1 an denselben s-Stellen gemessen:
  - Lage max. **1,0·10⁻¹² m**;
  - Tangente max. 2,7·10⁻⁴ (lineare Interpolation; < 1·10⁻³).
- Fingerabdruck gleich (d42aa57e).

**Neu in 0.16.1:**
- Je Stützstelle fünf zusätzliche prm-Felder: `laneW`, `lanesL`, `lanesR`, `median`, `laneTaper` (Spuren der Weltstraßen-Familien). Bei RACE-Strömen sind sie unbelegt bzw. Standard und ändern nichts.
- Keine Stützstellen-Felder neu, keine entfallen.
- Weltstraßen mit Körper bringen zusätzlich `body` (`keys`, `outline`, `edge`, `bandeSide`). Das trifft die RACE-Ströme oben nicht.

**Herkunft des O1-Rezepts**
- Das Lab baut es zur Laufzeit in `organ-world.lab.js` (l.1015) und hebt es nicht auf.
- Ich habe es im laufenden Lab (`?hub=1&play=travel`) über eine Blob-Kopie des Moduls abgegriffen; am Lab-Code ist nichts geändert.
- Gesichert privat unter `~/Developer/rkit-r3/trackcore/parity/recipes/O1_ORGAN_RING_v3.json`.
- Kontrolle: Der Lab-Stream hatte 21124 Stützstellen, Fingerabdruck be347834, Core 0.12 — dieselben Werte.

**Nachrechnen:**
```bash
node ~/Developer/rkit-r3/trackcore/parity/parity_v012.mjs
```
- Schreibt `parity/teil0_parity.json`.
- Vergleicht je Stützstelle s, p, T, U, R, Slots, prm, Fugen, Markierung, Skin und Tunnel; neue Felder werden nur aufgelistet.
- Grenze 1 mm in Track-Core-Metern; lab = m × RACE_W 1,46.

**Folgerung für C4b:** Ein Wechsel des Labs von v0.12 auf 0.16.1 ändert an O1, J17 und td03 nichts.
- Für neue Stücke (EXIT/ENTRY, B7, Körper) braucht das Lab dann 0.16.1.
- **Frage an die Steuerung:** Track Core ist privat (V-071 sinngemäß, START_HERE: „nie öffentlich“). Darf eine Kopie von 0.16.1 wie heute v0.12 als Vendor-Datei im Lab liegen? Wenn das Lab-Repo öffentlich wird, gehört sie in eine private Quelle.

## Modul-Katalog-Felder (Vorschlag zum Abgleich mit der MODULES.md der MVP-Sitzung)
Je Modul, z. B. Fahrbahn-Stück, Knoten, Übergang, Tunnel, Rampe, Wendeschleife:

| Feld | Inhalt | Quelle im Track Core |
|---|---|---|
| `id`, `version` | Modulname, Track-Core-Version, ab der es gilt | `CORE_VERSION` |
| `family` | race (RACE, COSMIC) bzw. world (TOWN, COUNTRY, MOUNTAIN, HIGHWAY, DRIVING_SCHOOL; edge-only TOWN_BAY) | `PROFILE_FAMILIES[].scale` |
| `section` | Breite, Spuren, Seitenquerschnitt je Seite (14 Slots bzw. 9 Körperschlüssel), Decktiefe | `profileSlots`, `BODY_KEYS` |
| `edge` | je Seite L/R: `bande` · `kerb` · `shoulder` · `free`, plus `barrierVis` (0 = versenkt 0,35) | `prm.sideL/R`, `barrierVisL/R`, `body.edge`, `body.bandeSide` |
| `frames` | Liste {id, kind, p, T, U, R, grade, width, family, scale}. kind = `route-start` · `route-end` · `socket` (node/arm) · `portal` (Tunnel) · `level` (Ebene) · `dock` · `anchor` (Insel) | `joints[]`, `sockets`, `tunnels[i0/i1]` |
| `scale` | `race-m` oder `lab` (Umrechnung × 1,46 ausdrücklich) | MODULES.md l.3 |
| `seam` | Nahtregel an jedem Rahmen: Lücke 0, Höhensprung 0, Normalensprung ≤ 1,10°; Querschnitt gleich oder Katalog-Übergang (B…, C…) | MODULES.md; `TRANSITION_CATALOGUE`, `SUPPORT_CATALOGUE` |
| `checks` | Track-Core-Prüfungen, die grün sein müssen (`runChecks`, `runGraphChecks`, `bodyChecks`) + Lab-Prüfungen (Tunnel offen 0 / nicht-mannigfaltig 0, V-136 geschlossene Körper) | Testsuiten `test*.mjs` |
| `tests` | Datei + Anzahl, z. B. `test-v014.mjs` 15/15 | `~/Developer/rkit-r3/trackcore/` |
| `look` | Verweis auf das Lab-Modul (J17), Track Core liefert keinen Look | Lab |
| `parity` | Gleichstand-Nachweis gegen den Vorgänger (wie oben) | `parity/parity_v012.mjs` |

Die heutige MODULES.md (`Lab/docs/critic/lab-track/2026-10-11_C1b-C3-r2/MODULES.md`) hat Naht- und Tunnelprüfung. Es fehlen `family`, `edge`, `frames` und `scale`.
