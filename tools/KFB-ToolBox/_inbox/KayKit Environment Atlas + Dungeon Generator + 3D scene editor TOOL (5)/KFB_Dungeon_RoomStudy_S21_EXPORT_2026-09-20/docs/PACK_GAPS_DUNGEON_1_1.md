# Fehlende Assets · KayKit Dungeon Pack 1.1 FREE
Stand: 2026-09-19 · Quelle: 13 Promobilder gegen `registry/assets/v1/packs/kaykit-dungeon-pack-1-1-free-2.json` (207 gltf)
Lesbare Fassung mit Bildern: `KayKit_Sample_Atlas_S20.html` · Daten: `lib/sample-map.js`

## Blockierend
| Posten | wofür | Bild |
|---|---|---|
| KayKit Character Pack **Skeletons** | DG2-D verlangt echte, nachweisbare KayKit-Skelett-Mobs. Im Dungeon-Pack ist **kein** Charakter. Ohne diesen Posten heisst der Raid-Status MISSING_ASSET. | — |

## Hoch — eine ganze Bühne fehlt
| Posten | wofür | Bild |
|---|---|---|
| Minen-Teile: Stollen-Stützrahmen (3 Grössen), Erzbrocken mit Ader, Spitzhacke, Felsblöcke, Eimer | S11 ist mit dem freien Pack **nicht** nachbaubar | S11 |
| Dungeon-Pack **EXTRA**: modulare Theke, Küchenzeile, runde Tische/Hocker, Braten | S13 trägt selbst den Aufdruck „EXTRA ONLY · NEW IN V1.1" | S13 |

## Mittel — Dichte, nicht Struktur
| Posten | wofür |
|---|---|
| Bücher als Einzelteile (liegend, gestapelt, aufgeschlagen) | S04/S12; im freien Pack steckt jedes Buch im Regalmodell |
| Säcke, Töpfe, Eimer, Knochen, Schädel | die Rolle `beinhaus` in `PROP_ROLES` hat im freien Pack **kein einziges** Teil |
| separates Türblatt / Gitterblatt | `wall_doorway` bringt das Blatt im selben Modell mit, `wall_gated` ist geschlossene Wand — Auf/Zu geht nur über Teilmesh-Schalten |
| SFX | kein KayKit-Pack enthält Audio. Kurzfristig per WebAudio synthetisierbar (Truhe, Münzen, Holzbruch, Ketten) |

## Niedrig — selbst baubar
| Posten | Anmerkung |
|---|---|
| Wasserfläche + Shader | S06 weist es selbst als nicht enthalten aus |
| Streu-Pflanzen | nur als Bodenkachel `floor_tile_small_weeds_A/B`, `floor_dirt_small_weeds` |
| Essen ohne Teller | `plate_food_A/B` bringt Essen nur auf dem Teller |

## Keine Lücke, nur ungenutzt
`wall_endcap`, `wall_half_endcap`, `wall_Tsplit`, `wall_doorway_Tsplit`, `wall_crossing`,
`wall_sloped`, `wall_Tsplit_sloped`, `wall_half_endcap_sloped`, `stairs_modular_*`,
`stairs_long_modular_*`, `ceiling_tile`, `floor_tile_big_spikes`, `floor_tile_*grate*_open`,
`wall_corner_gated`, `wall_archedwindow_gated`, `floor_foundation_*`, `trunk_*`, `keg*`, `box_stacked`.

`dungeon-grid.js` behauptet in zwei Kommentaren, das Pack habe kein Wandende, kein T und kein
Kreuz. Für 1.1 ist das **falsch** — Bild S07 zeigt ein Endstück in Benutzung.

## Geprüft und KEINE Lücke (2026-09-20)
| Vermutete Lücke | Befund |
|---|---|
| offene Truhe mit aufgeklapptem Deckel | **vorhanden** — der Deckel ist ein eigenes Mesh im Bauteil (`chest_lid` / `chest_gold_lid`, Scharnier im Pivot), genau wie das Türblatt in `wall_doorway`. Aufklappen ist eine Drehung, kein zweites Modell. `chest_gold` ist die goldgefüllte Variante (Körper bis y 1,04 gegen 0,60). |

**Regel daraus:** bevor ein Teil als fehlend gilt, die MESHNAMEN lesen. Eine Boxmessung sagt nur,
wie gross die Hülle ist — nicht, aus welchen beweglichen Teilen sie besteht.
