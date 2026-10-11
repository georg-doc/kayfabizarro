# RKIT · Skin-Schnittstelle Schritt 5: Module, Kanten-Enden, Übergänge · Track Core 0.16.3 (R1)

Stand 2026-10-11 · privat · Lab-Vendor nicht berührt · freigegeben als Vorlagen-Zeile Schritt 5

## 1 · Was neu ist (nur Daten, Geometrie bitgleich)

| Daten | Inhalt |
|---|---|
| `g.modules[]` | EXIT (weiche), ENTRY, PIT_LANE und WEICHE mit `skin`, abgeleitet aus der Familie der Hauptstrecke. Ein ausdrückliches `skin` am EXIT bzw. ENTRY muss passen, sonst Fehler „put a transition on the route before the module“, wie bei den Knoten. Reservierte Skins (dirt, cosmic, trail) sind ein Fehler. |
| `g.edgeEnds[]` | jede Stelle, an der eine Kante (Bande, Bord, Bankett) abspringt oder wieder beginnt: Abzweig, Nase, Einfädeln, Schluss, Boxengasse. Felder: {route, s, side, end stop / start, skin, form, p, T, lat} |
| `g.transitions[]` | Familien-Übergänge aus den Körpern (B1 / B2 / B3 / B5 / B7) mit `skinFrom` → `skinTo` und Fenster s0–s1; Stützen-Zonen (C1 / C2); Biom-Zonen (B6-Look-Zone, Skin bleibt) |

**Kappen-Form = die Kante, die dort wirklich steht** (`capFormOf`):
- race und Banden-Familien (HIGHWAY) → `bande_head`;
- Bord-Familien (TOWN, DRIVING_SCHOOL) → `kerb_head`;
- Bankett-Familien (COUNTRY, MOUNTAIN) → `verge_end`.

Das gilt jetzt auch für die Knoten-Kappen aus Schritt 4, mit zwei Folgen:
- HIGHWAY-Kreisel: `verge_end` → `bande_head`. Das ist eine Korrektur, denn HIGHWAY trägt die Joyride-Bande, auch wenn sein Skin vorläufig country ist.
- Kreuzungs-Stummel in TOWN: `kerb_head`.

## 2 · Gemessen (Testgraph der Race-Exit-Suite)

| | Module | Kanten-Enden auf der Hauptstrecke |
|---|---|---|
| RACE | weiche race, entry race | R stop s 60 (Abzweig), start s 140 (Nase), stop s 402 (Einfädeln), start s 482; Äste: `off` start s 141,2, `R_on` stop s 170,7; alle `bande_head` |
| HIGHWAY | weiche country, entry country | dieselben Stellen, `bande_head` |
| PIT_LANE (race) | pit race | L stop s 80, start s 384 |
| B5 Rampenfuß | – | Übergang HIGHWAY → TOWN, Skin country → town, s 40,5–59,2 |
| B6-Look-Zone | – | biome track → city, Skin race → race, s 60–140 |

## 3 · Tests und Gleichheit

| | |
|---|---|
| `test-skin.mjs` | **83/83**, davon 10 neu für Schritt 5: Modul-Skins race und HIGHWAY; Kanten-Enden mit Formen; passender bzw. falscher EXIT-Skin; PIT; B5-Übergang mit Skin-Paar; B6 als Biom-Zone; Kappen nach stehender Kante |
| `test-turnaround.mjs` | 18/18 |
| test.mjs 329/0, v013 60, v014 15, v015 97 (1 erwartet), v016 116, race-exit 19, level-ramp 16 | unverändert |
| **Teil 0** (`parity/teil0_parity_v0163s5.json`) | bitgleich, Abweichung 0 |
| Schritt 3 → 5 | Graph mit EXIT, ENTRY und Kreisel (TOWN, RACE, COUNTRY, HIGHWAY): alle Ströme und Knotendaten bitgleich, außer der korrigierten HIGHWAY-Kappenform. Neu sind die Schlüssel `modules` und `edgeEnds` (`transitions`, wo Übergänge sind). |

## 4 · Stand der Skin-Schnittstelle 0.16.3

**Alle 5 Schritte sind fertig** (Reihenfolge 1 → 2 → 4 → 3 → 5):

| Schritt | Inhalt |
|---|---|
| 1 | Familie der Arme |
| 2 | `node.skin` |
| 4 | Kappen, erhabener Splitter |
| 3 | Pfeile, Ringspuren, Scheitel-Kerb |
| 5 | Module, Kanten-Enden, Übergänge |

**Noch nicht im Lab:** 0.16.3 ist privat. Vendoring nur abgestimmt mit der MVP-Sitzung (Vorschlag: neben 0.16.2 unter `vendor/private/track-core-0.16.3/`, wenn MVP es braucht).

**Offen bei Georg:**
- #4 Banden-Übergang (A/B/C);
- DIRT B/C;
- CR-Fragen;
- HIGHWAY-Skin;
- trail.
