# Katalog-Dedup — 2026-07-25

**Vorher:** 42 Packs · 2776 Assets  →  **Nachher:** 32 Packs · 2534 Assets  (10 Packs / 242 Assets entfernt)

Regel: pro Kit die **volle, auf GitHub liegende** Fassung behalten, das Duplikat raus.

| Kit | BEHALTEN | RAUS |
|---|---|---|
| blocky chars | `GLB_blocky_chars` (18) | `kenney_blocky-characters_20` (18) |
| cube pets | `GLB_cube-pets` (24) | `kenney_cube-pets_1.0` (24) |
| graveyard | `GLB_graveyard` (91) | `kenney_graveyard-kit_5.0` (91) |
| hexagon | `GLB_hexagon_kit` (72) | `kenney_hexagon-kit` (72) |
| mini arcade | `kenney_mini-arcade` (20) | `GLB_mini_arcade` (2) |
| mini arena | `kenney_mini-arena` (22) | `GLB_mini_arena` (1) |
| mini chars | `GLB_mini_chars` (26) | `kenney_mini-characters` (26) |
| mini dungeon | `kenney_mini-dungeon` (25) | `GLB_mini_dungeon` (2) |
| mini market | `kenney_mini-market` (20) | `GLB_mini_market` (1) |
| platformer | `kenney_platformer-kit` (153) | `GLB_platformer` (5) |

## Hinweis Graveyard
`kenney_graveyard-kit_5.0` fällt zugunsten `GLB_graveyard` (gleiche 91, beide auf GitHub). Beide Ordner bleiben auf GitHub — nur der Katalog nutzt jetzt `GLB_graveyard`.

## Was auf GitHub aktualisieren
- `media/3D_Assets/CATALOG/catalog.json`  ← die entduplizierte Datei (überschreiben).
- `media/3D_Assets/CATALOG/catalog.js` ← nur falls der Browser von GitHub gehostet wird; lokal ist er schon aktualisiert.
- Backup liegt als `catalog.pre-dedup.bak.json` daneben.
- **Kein Browser-Code-Änderung nötig:** alle behaltenen Packs matchen den GitHub-Pfad (grün); nur `kenney_pirate-kit` bleibt via GH_PACKMAP grün.