# Feature Parity

Status je Funktion: `PRESERVED` · `REPAIRED_FOR_PORTABILITY` · `REIMPLEMENTATION_REQUIRED` ·
`BLOCKED` · `NOT_TESTED`.

Am Code wurde für diesen Export **nichts** geändert. Es gibt daher keine Zeile
`REPAIRED_FOR_PORTABILITY`.

## Messkern und Viewer

| Funktion | Status | Quelle | Nachweis |
|---|---|---|---|
| Laufzeitmessung jedes Bauteils (`measure`/`measured`) | PRESERVED | `lib/kit-lab.js` | jede Zahl in `TEST_REPORT.md` |
| GLTF-Loader + Cache, 23 Pack-Basispfade | PRESERVED | `lib/kit-lab.js` | 19/19 Dungeon, 87 Hex, 105 Forest, 49 Tools, 41 City |
| Viewer (Orbit, Damping 0,14, geklemmter Zoom, rAF-Notnagel) | PRESERVED | `lib/kit-lab.js` | S11-Fix: zeichnet nach Szenenwechsel weiter |
| `repairTextures` (leerer Atlas `blueprint_stacked`) | PRESERVED | `lib/kit-lab.js` | S7.1 |
| Audits: World/Joints/Footprints/Ground/Lanes/Clearance | PRESERVED | `lib/kit-lab.js` | 0/93.528 Paare; 0/1176; 31/31, 25/25, 39/39 Ground |
| Draufsicht-Pixelprobe (`makeTopDownProbe`) | PRESERVED | `lib/kit-lab.js` | 33/33 Fugen, 204/204 Uferkanten, 60 Fugen/37 Zellen 0 Fehler |

## Dungeon (S13 / S13.2 / S13.3)

| Funktion | Status | Nachweis |
|---|---|---|
| BSP-Generator, zwei Ebenen, Saat/Dichte/Feldgröße | PRESERVED | 108 Grundrisse, 0 Fehlschläge |
| Fugenmodell mit 5 Klassen inkl. `rail` | PRESERVED | `barrier` gemessen 4,00 × 1,10 × 0,50 |
| Wandlänge aus Eckschenkel 2,0 abgeleitet | PRESERVED | S13.2 |
| Türblatt aus der Instanz entfernt, Öffnung 1,90 mittig | PRESERVED | Strahlprobe 7/7 |
| Treppe zuerst, Ebenenabstand 4,05 (gemessener Hub) | PRESERVED | S13.2 |
| `gate` auf der zweiten Fuge eines verbundenen Paares | PRESERVED | 24 gates in 14 von 45 Layouts |
| Lichtrig, 3 Stimmungen, Punktlicht-Pool mit Stapeln | PRESERVED | Leseprobe 5/5, 9/9, 7/7 |
| Flammenfreistellung über Atlas-Texel | PRESERVED | 4/4 Leuchtbauteile |
| Ebenen-Masken gegen Lichtleckage | PRESERVED | 0 Leckagen gemessen |
| Schrittweiser Aufbau (Räume/Gänge/Wände/Alles) | PRESERVED | — |
| Draufsicht-Plan je Ebene als SVG | PRESERVED | — |
| Recipe-JSON-Export | PRESERVED | `kaykit-dungeon-s13-2.recipe.json` |
| Recipe-**Import** | **REIMPLEMENTATION_REQUIRED** | existiert nicht; war nie implementiert |
| Requisitenplatzierung (Dichte 30 %, nur Ränder) | **NOT_IMPLEMENTED** | geplant als S13.4, Zahlen liegen in `HANDOFF_dungeon_props_S13_3.md` |
| Bloom / Postprocessing auf Flammen | **NOT_IMPLEMENTED** | offene Entscheidung, siehe `RECOVERY.md` |
| Begehbare Innenräume, Wandkollision, Actor-Stockwerke | **NOT_IMPLEMENTED** | kein Code, keine Tests — ausdrücklich nicht als implementiert ausgewiesen |

## Hex (S11 / S12)

| Funktion | Status | Nachweis |
|---|---|---|
| `TILE_EDGES` als einzige Kachelwahrheit, Masken abgeleitet | PRESERVED | 18 Kacheln, Pixelscan = Geometrie |
| Fluss-/Straßen-/Uferlöser (`solveHexTile`) | PRESERVED | 8/8 Fluss, 14/14 Straße, 6/12 Randzellen Küste |
| Achsen-Gegenprobe auf der Seite | PRESERVED | 12/12 |
| `relaxOverlaps`, Gebäude auf Boxmitte statt Pivot | PRESERVED | 81 Scheinkollisionen behoben |

## Weitere Seiten

| Seite | Status | Anmerkung |
|---|---|---|
| S1 Dungeon-Raum, S2 Kenney-Straßengitter, S4 City-Sample | PRESERVED | — |
| S3/S3b Racing-Kette mit Höhenkreuzung | PRESERVED | `auditClearance`, 33/112 Teile bestätigt |
| S5 Straßennetz mit gemessener Anschlusstabelle | PRESERVED | 39 Kacheln, 0 offene Enden |
| S6 Forest-Lichtung, S7 Tools-Werkstatt | PRESERVED | 105 / 49 Teile |
| S8 Schach | PRESERVED, eigene Geometrie | FREE-Tier hat keinen Satz — dokumentiert, nicht überspielt |
| S9 Domino mit Kipp-Physik | PRESERVED | 12 Steine |
| S10 Karten + Sanduhr | PRESERVED, `NOT_TESTED` nach Umbau | läuft auf three 0.160.1, zusätzlich jsdelivr-Abhängigkeit |

## Was der Exportauftrag §4 für `KFB_World_Atlas_v1` nennt und hier nicht existiert

Ehrliche Gegenüberstellung, keine Umdeutung vorhandener Teile:

| Auftragspunkt | Befund |
|---|---|
| Terrain-/Landmark-/Prop-Kombinationen | **existiert nicht** als Atlas-Datenbestand. Vorhanden: Hex-Kachellöser (S11/S12) und Streu-Paletten (`props-lab.js`) |
| Pfad-Presets | **existiert nicht.** Vorhanden: gelöste Straßen-/Fluss-/Streckenketten, aber keine gespeicherten Presets |
| Burg / Schloss / Mine | **existiert nicht.** Das Hexagon-FREE-Pack hat Gebäude in 5 Farbfamilien; eine benannte Burg-/Minen-Komposition gibt es nicht |
| Hexagon-Basis / Gebäude / Props / Pfade in den Daten unterscheidbar | **teilweise.** `TILE_EDGES` trennt Kachelklassen; Pack-Basispfade trennen Kachel/Gebäude/Dekoration. Eine Atlas-Rezeptstruktur, die das als Komposition führt, fehlt |
| Adjazenzregeln, Anschlüsse, Breiten, Höhen, Rotationen, Seeds | **vorhanden, aber als Code, nicht als exportierte Daten.** Siehe `RECIPE_MAPPING_A0.md` |
| Drei Travel-Darstellungsvarianten (sichtbare Basis / eingesenkt / ohne Basis) | **`PROPOSAL`** — keine ist implementiert. Es wurde für diesen Export auch keine gebaut |
| Dungeon-Generator als eigener Modulstand | **vorhanden und vollständig** — der stärkste Teil dieses Pakets |
| GPU-Instancing vs. separate Gameplay-Instanz | **weder noch benannt im Code.** Die Seiten bauen gewöhnliche Meshes je Bauteil. Kein Instancing-Pfad, keine Gameplay-Instanz |

## Gesamturteil

Der Code ist vollständig und unverändert. Assets liegen planmäßig extern (alle via GitHub), also
fehlt dem Paket nichts, was hineingehört. Offen ist ein Test (`START_TEST_NOT_RUN`) und die
Pinnung der Assetbasis (`KNOWN_ISSUES.md` §1).

Davon unberührt: für die im Auftrag §4 beschriebene World-Atlas-Funktion ist dieses Projekt
**nicht** die Quelle. Das ist keine Exportlücke, sondern eine Zuordnungsfrage.
