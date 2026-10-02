# HEX-CATALOG-RUNTIME-EXPORT-01 · TEST REPORT

Status: **READY_FOR_INTEGRATION**

Genuine browser execution: S0 and S1 ran against the authenticated, hash-verified source archives. Only loader paths were adapted to the local execution origin. Measurement, role, calibration, classification, TILE_EDGES and grid/rotation semantics were not changed.

## Results
- Tests: 15/15 PASS
- Inventory: 447
- Static tile candidates: 256
- S0: 230 loaded, 0 failed, 217 deferred
- S1 calibration: 0.995 edge / 0.969 full-tile
- S1 measured on-grid: 176
- Fresh profiles: 126 full, 17 partial, 1 unclassified
- Excluded: 80 off-grid, 1 no-deck
- Canonical joined SHA-256: b16117fb45ae141adce0cc9c6beb0fdf7de24069f79a8845861c766c15ba2b21

## Checks
- PASS · 447 model rows retained · 447
- PASS · 447 unique pack|base keys · 447
- PASS · 447 unique paths · 447
- PASS · 447 source pins retained · 447
- PASS · static tile roster reconciled · 256
- PASS · 32 known TILE_EDGES rows retained unchanged · {"canonical":32,"measuredFullMatches":31}
- PASS · S1 calibration passes donor threshold · 0.995
- PASS · fresh measured profile counts reported · {"withoutKnownTable":144,"fullyClassified":126,"partial":17,"unclassified":1,"inKnownAlphabet":10,"partialRows":["builder|hex_forest_waterD_empty","builder|hex_rock_waterD_empty","builder|hex_sand_waterD_empty","hex|hex_river_A_curvy_waterless","hex|hex_river_A_waterless","hex|hex_river_B_waterless","hex|hex_river_C_waterless","hex|hex_river_D_waterless","hex|hex_river_E_waterless","hex|hex_river_F_waterless","hex|hex_river_G_waterless","hex|hex_river_H_waterless","hex|hex_river_I_waterless","hex|hex_river_J_waterless","hex|hex_river_K_waterless","hex|hex_river_crossing_A_waterless","hex|hex_river_crossing_B_waterless"],"unclassifiedRows":["hex|hex_river_L_waterless"]}
- PASS · partial/unclassified rows explicitly named · {"partial":17,"unclassified":1}
- PASS · every measured topology has six positions · 176
- PASS · symmetry domain PASS
- PASS · rotationLocked invariant PASS
- PASS · S0 load failures counted explicitly · 0
- PASS · no duplicate join keys/paths
- PASS · deterministic joined rebake PASS · b16117fb45ae141adce0cc9c6beb0fdf7de24069f79a8845861c766c15ba2b21

## Explicit incomplete rows
- Partial: builder|hex_forest_waterD_empty, builder|hex_rock_waterD_empty, builder|hex_sand_waterD_empty, hex|hex_river_A_curvy_waterless, hex|hex_river_A_waterless, hex|hex_river_B_waterless, hex|hex_river_C_waterless, hex|hex_river_D_waterless, hex|hex_river_E_waterless, hex|hex_river_F_waterless, hex|hex_river_G_waterless, hex|hex_river_H_waterless, hex|hex_river_I_waterless, hex|hex_river_J_waterless, hex|hex_river_K_waterless, hex|hex_river_crossing_A_waterless, hex|hex_river_crossing_B_waterless
- Unclassified: hex|hex_river_L_waterless

GitHub writes: 0 · PR: 0 · Cloudflare: 0 · Hub rebuild: 0.
