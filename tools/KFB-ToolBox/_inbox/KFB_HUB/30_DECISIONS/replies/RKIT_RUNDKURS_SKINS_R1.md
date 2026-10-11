# RKIT · V-144 Kreisel-Module gegen Track Core 0.16.2 + V-145 Vorlagen-Zeile „Skin-Schnittstelle“ (R1)

Stand: 2026-10-11 · nur Abgleich und Vorschlag, **kein Bau** · Track Core privat · Farben aus RK1/RK2 zählen nicht (Look J17).

## 0 · Korrektur vorweg
- Ich hatte geschrieben, „Kreisel sind Weltstraßen-Knoten, RACE nur über B6“. Das war ungenau.
- **Den RACE-Kreisel gibt es schon seit v0.12** (`modul_kreisverkehr` in `presets.v012.json`, test.mjs Kreisel M/S/L, alle grün). Seine Kanten sind der **volle Renn-Seitenquerschnitt** `KERB_SECTION` (Bankett 1,98, Abstand 0,72, Bande 1,62 × 1,35): `track-core.v012.mjs:903–905`.
- Die Arm-Banden laufen **ohne Unterbrechung** Arm → Ausrundung → Ring → Ausrundung → Arm (`:959–973`), die Insel als geschlossener Lauf (`:978`). Mündungen werden ohne Naht übergeben (`:890–891`).
- „Keine gelöschten Banden“ gilt also für RACE schon heute.
- Die Lücke liegt umgekehrt: **TOWN-Kreisel** bekommen denselben Renn-Querschnitt an Ring, Insel und Nicht-Einfahrts-Armen. Erst das Lab macht daraus per Biom „city“ eine niedrige Bordkante als Look (`stream-to-three.v5.mjs:325–327`).

## 1 · Abgleich der 8 Module (RK2) gegen 0.16.2
| # | Modul | Stand RACE-Skin | Stand TOWN-Skin | Was fehlt (Core) | Fundstellen |
|---|---|---|---|---|---|
| 1 | gerade → Kreisel | **vorhanden** (Aufweitung smootherstep, Ausrundung tangential, Mündung ≤ 1 mm) | **teilweise** (Geometrie ja, Kante im Renn-Querschnitt) | Kante je Skin | v012 `:886–1062`, Makro `:1066–1090` |
| 2 | geführte Einfädelung (ENTRY) | **teilweise**: Wartelinie gestrichelt, Splitter, NPC-Weg | dto. | Einfädel-Markierung (Pfeil bzw. Verengung) im Knoten | `:1001–1003`; Weiche-Einfädelung `:709–717` (nur Strecke) |
| 3 | geführte Ausfädelung (EXIT) | **teilweise**: NPC-Wege | dto. | **Ausfahrtpfeile** (Spezifikation `road-markings.m2.json:155, 240–247` „Richtungspfeil“) | `:1033–1054` |
| 4 | innerer Banden-Übergang | **vorhanden** (Insel-Lauf geschlossen, Renn-Querschnitt) | **teilweise** (Insel braucht Bord statt Bande) | Insel-Lauf im Skin-Querschnitt | `:978` |
| 5 | äußerer Banden-Übergang | **vorhanden** (durchgehende Läufe um die Ecken, Ausrundung ≥ rfMin, sonst Fehler) | **teilweise** (Ecken brauchen Bord + Gehweg) | äußere Läufe im Skin-Querschnitt | `:959–973`, `:938` |
| 6 | Bord- bzw. Schulter-Verjüngung | **vorhanden** (Aufweitung, Ausrundung, WIDTH_TAPER, `barrierVis` als Verjüngung) | **vorhanden** (dto.; im Lab die Bordstein-Verjüngung des Atlas) | – | `:893–895`, `:26–28`, `:67`; Atlas `:192–203` |
| 7 | Markierungs-Logik | **teilweise**: Rand, Wartelinie gestrichelt, Splitter-Umriss + Schraffur, Mittellinie am Arm | dto. | **gestrichelte Ringspuren** (mehrspurige Ringe), **Ausfahrtpfeile** | `:1001–1003`, `:1019`; Spezifikation m2 `:85, 193, 229` |
| 8 | Endkappen | **teilweise**: Kappen gibt es (ROUND_END/endTaper nur bei KICKER/LANDING `:175–190, 216, 230`; Pit-Kappen `:776–781`; Kissen bzw. U-Nase `:790`; Strang-Kappen im Look `track-look.v5.js:233–260`) | **teilweise**: Bordköpfe (RKIT Lauf 03, gebaut) | **Kappe für unbenutzte Stummel-Arme** (enden heute stumpf am Sockel `:1074, 1085`); **erhabene Splitter-Inseln** (S13 offen: „gemalt, nicht erhaben“) | S13-Return `:7, 10` |

**Dazu (Befund aus Schritt 2):** Kreisel-Arme erben die Familie nicht. Ausfahrt und Stummel-Arme eines TOWN-Kreisels kommen mit RACE-Profil heraus. JUNCTION macht es schon richtig: Querschnitt je Familie, `sideSection(arms[0].prm)`.

## 2 · Such-Protokoll (V-140)
| Quelle | gesucht | gefunden |
|---|---|---|
| Lab `docs/PHASE_C_DONORS_R1.md` | roundabout, kerb, bande, skin, look layer, transition atlas | `:21` Look-Donors; `:29` `body.edge`, `bandeSide`; `:32` Variante B; kein Kreisel |
| Lab `docs/MVP1_DONOR_AND_MODEL_MAP_R1.md` | dto. | `:25` Bord + Bande aus RKIT/Track Core 0.16.1; kein Kreisel |
| Lab `docs/ACCEPTANCE_INDEX.md` | dto. | nicht gefunden |
| J14 / J15 / J16r2 / J17-staged (md5-gleich: core 4a72b9b8, stream-to-three bbe1415d, track-look 03d17908) | alle 8 Module + Skins | siehe Tabelle; `stream-to-three.v5.mjs:361–381` buildNode (Platten, Kanten über `kerbSamples` `:337–348` im Renn-Querschnitt, Biom-Höhe `:325–327`, Möblierung, Szenerie-Platzhalter) |
| `KFB Joyride J17 · FB Cabrio/` | roundabout, skin, cap | nicht gefunden |
| `track-look.v5.js`, `transition-atlas.v1.js`, `road-markings.m1/m2` | roundabout, node, arrow, yield | Kreisel nicht gefunden; Strang-Kappen `:233–260`; Bordsteine `:192–203`; Pfeil bzw. Wartelinie nur als JSON-Spezifikation |
| Organ-Inseln v4–v7 | roundabout, ring | nicht gefunden (keine Knoten); `lab-track/track-skins.v0.1.json` (Skin-Vorschlag, Core 0.8.1, nur Doku) |
| RollerCoaster v11 | skin, rail | `rollercoaster-ride.v11.js:741–760` Schienen-Look, nicht an Track Core angeschlossen |
| Stunt Car Race | roundabout, barrier end | `track-kit/ASSET_INDEX.md:98–135, 198–199` Kenney-Kandidaten (road-roundabout(-barrier), side-entry/exit, barrier-end, curb-end), kein Code |
| RKIT `TRACK-CORE/S13_V012_2026-09-28/RETURN…md` | splitter, placeholder | `:7` Splitter gemalt, `:9` Bord-Kontakt in voller Bandenhöhe, `:10` Mitte Platzhalter |
| RKIT `RKIT-R3/private/atlas_v015/track-core.mjs` | families, skin | `:115–134` Familien (TOWN: Rolle `barrier_side` → kerb), `:1255–1430` Kreisel, `:1435ff` JUNCTION |
| `KFB_HUB` | roundabout, skin, caps | V-144, V-145, `BRIEF_WSA_TRACK_MODULE_LOOK_SPEC_R1.md:7–14`, RKIT_TURNAROUND_R1 |
| Lab `docs/MODULES.md` | edge, skin | `:20, 35, 62` Feld edge (bande · kerb · shoulder · free) |

## 3 · Vorlagen-Zeile „Skin-Schnittstelle“ (V-145)

**Grundsatz:** Ein Knoten bzw. Modul = **logic** + **skin**.
- **logic** (gemeinsam, unabhängig vom Skin):
  - Plan-Geometrie: Ring, Arme, Aufweitung, Ausrundung, Mündungen und Sockel;
  - Deckplatten, Wege-Graph (NPC-Wege, Vorfahrt);
  - Szenerie-Anker, Prüfungen der Wege.
- **skin** (je Variante):
  - Familie bzw. Maßstab (race | world);
  - Seitenquerschnitt der Kantenläufe;
  - Kantenart je Lauf (`edge`: bande | kerb | shoulder | free);
  - Markierungsstil;
  - Endkappen-Art (Renn-Bullnose ROUND_END bzw. U-Nase · gebauter Bordkopf);
  - Farbpalette (heutiges `q.skin`).

**Vorhanden, 1:1 übernommen**
- Knoten-Logik ROUNDABOUT und JUNCTION;
- `sideSection(prm)` je Familie (JUNCTION nutzt es schon);
- `KERB_SECTION` (= Renn-Seitenquerschnitt);
- Familien `PROFILE_FAMILIES` / `BODY_FAMILIES` mit `body.edge`, `bandeSide`;
- Kappen (ROUND_END, U-Nase, Kissen);
- RKIT-Bordköpfe.

**Neu und warum**, in Schritten, jeder mit Vorlagen-Zeile, Tests und Gleichstand:

1. **Arme erben die Familie der Einfahrt**, und die Kantenläufe des Kreisels nehmen den Querschnitt der Einfahrts-Familie, wie JUNCTION.
   - **RACE ändert sich nicht:** Querschnitt bleibt `KERB_SECTION`. Damit bleiben Teil-0-Ströme, test.mjs, modul_kreisverkehr und alle Suiten **bitgleich**.
   - Nur Weltstraßen-Kreisel ändern sich, gewollt, weil sie heute falsch sind; der 4-Arm-TOWN-Vergleich in test-turnaround wird dafür ausdrücklich umgestellt.
   - Grund: V-145 TOWN-Variante, Befund Schritt 2.
2. **Ausdrücklicher Skin-Parameter am Knoten bzw. Modul** `skin: 'race' | 'town'`, mit dem Standard aus der Einfahrts-Familie.
   - Damit kann z. B. ein Rennkreisel auf einer Stadtinsel gewählt werden (V-145 „beide Varianten“). Der Wege-Graph bleibt gleich; Kanten, Markierung und Kappen kommen aus dem Skin.
   - **Namensfrage:** Track Core hat schon `q.skin` (Farbpalette je Stützstelle, street | track | mag). Das bleibt unverändert, wegen der Bitgleichheit. Der neue Parameter steht nur am Knoten bzw. Modul. Im Strom heißt er `node.skin`, nie `q.skin`.
3. **Markierungen:** Ausfahrtpfeile und gestrichelte Ringspuren als Markierungsarten, nach `road-markings.m2.json` „Richtungspfeil“ bzw. „Wartelinie“; nur Daten (Lage, Art), die Form macht der Lab-Look.
4. **Endkappen je Skin:**
   - Kappe an unbenutzten Stummel-Armen: race = ROUND_END-Bullnose, town = Bordkopf mit Gehweg-Ende;
   - erhabene Splitter-Inseln (S13 offen) mit Skin-Kante.
5. **Gleiches Muster für EXIT/ENTRY** (Gore, Nase): race = Bande + U-Nase + Kissen (vorhanden), town = Bordnase. Ebenso für Banden-Übergänge und Verjüngung: Fenster bleiben, Querschnitt aus dem Skin.
6. **Später, nicht jetzt:** Skins `rail` (Eisenbahn) und `coaster` (Rollercoaster) mit derselben Logik, nur Querschnitt (Schienen statt Fahrbahn) und edge `free`. RollerCoaster v11 hat einen Schienen-Look, aber keinen Core-Anschluss.

**RACE-Kreisel:** bisher nicht abgelehnt, sondern vorhanden, nur im J17-Look des Labs nicht gezeichnet (`j17-track.lab.js` hat keinen Knoten). Mit Schritt 2 wird er ausdrücklich wählbar; der Look ist eine Lab-Aufgabe (buildNode aus stream-to-three.v5 als Vorlage).

**Bitgleich bleibt:** Jede Änderung greift nur, wenn eine Weltstraßen-Familie einfährt oder `skin` ausdrücklich gesetzt ist. Nach jedem Schritt laufen:
- Teil 0 (O1 v7, J17 p1b.v2, td03);
- alle Suiten (test.mjs, v013–v016, race-exit, level-ramp, turnaround);
- 0.16.2-Vorlagen gegen 0.16.3.

**MODULES-Felder (Vorschlag):**
| Feld | Inhalt |
|---|---|
| `logic` | Name der gemeinsamen Logik, z. B. `roundabout`, `junction`, `exit_entry`, `level_ramp`, `straight` |
| `skin` | gewählter Skin des Bausteins: `race` · `town` (später `rail`, `coaster`) |
| `skins[]` | unterstützte Skins mit je {section, edge, markings, caps} |
| `edge` | je Lauf bzw. Seite: bande · kerb · shoulder · free (wie heute in MODULES.md) |
| übrige Spalten | wie RKIT_TEIL0_R1 (family, frames, scale, seam, checks, tests, look, parity) |

**Aufwand:** Schritt 1 M · Schritt 2 S · Schritt 3 S · Schritt 4 M · Schritt 5 S je Modul. Track Core → 0.16.3.

**Bauen erst nach Freigabe.** Mein Vorschlag für die Reihenfolge: 1 → 2 → 4 → 3 → 5.

## 4 · MODULES-Zeilen der 8 Module (Stand 0.16.2, zum Übertragen in Lab `docs/MODULES.md`)
| id | logic | skins[] heute | edge | frames | checks / tests | Lücke |
|---|---|---|---|---|---|---|
| gerade_kreisel | roundabout (Arm) | race ✓ · town ~ | race: bande · town: (bande statt kerb) | socket node/arm, mouth | node_mouth, test.mjs M/S/L | town-Kante |
| einfaedelung | roundabout (Einfahrt) | race ~ · town ~ | wie Arm | Wartelinie | node_paths | Einfädel-Markierung |
| ausfaedelung | roundabout (Ausfahrt) | race ~ · town ~ | wie Arm | – | node_paths | Ausfahrtpfeile |
| banden_innen | roundabout (Insel-Lauf) | race ✓ · town ~ | race: bande · town: kerb fehlt | anchor roundabout_centre | node_clear | town-Querschnitt |
| banden_aussen | roundabout (Ecken-Läufe) | race ✓ · town ~ | race: bande · town: kerb fehlt | – | rfMin-Fehler | town-Querschnitt |
| verjuengung | Aufweitung / WIDTH_TAPER | race ✓ · town ✓ | – | – | width_taper | – |
| markierung | node markings | race ~ · town ~ | – | – | – | Pfeile, Ringspuren |
| endkappen | ROUND_END / U-Nase / Bordkopf | race ~ · town ~ | – | – | – | Stummel-Kappe, erhabener Splitter |

✓ = vorhanden, ~ = teilweise.
