# WORLD-M2A-R3 · Run State

Status: `R3_PARTIAL · LARGE_GAIN · FRAME_TARGET_FAIL · NOT_PUBLISHED`
Datum: 2026-09-27

## Lock

- Owner: bestehende World-M2A-Runtime
- Repo: `georg-doc/kayfabizarro`
- Branch: `work/world-m2a-city-shell-lod-r3-2026-09-27`
- Basis: R1 `9e74fc792e6f00309e9f57f1d3ae4c46e1f0ee57`
- Implementierung: `342f06886f2dc1410a7d4b11d7cc0a5f150f9cd5`
- Outcome: eine räumliche Stadt-LOD messen; keine neuen Spielmerkmale

## Protected

- World r2 bleibt World-/Terrain-Owner.
- Race PR #10 bleibt Drive-/Physics-/Camera-Owner.
- World M1 bleibt Ground-/Flight-/Actor-Owner.
- Öffentliche Fehler-Stage bleibt unverändert.
- Echte Fassaden-Donors kommen erst nach isoliertem Quellenbeweis.

## Ergebnis

- 96-m-Bereiche; volle Nähe bis 120 m, leichte OSM-Hüllen in der Ferne, 150-m-Hysterese.
- Dreiecke von ca. 1,13 Mio. auf ca. 185–198 Tsd. reduziert.
- Paket 24/24; Browser Desktop + schmal 34/34.
- p95 Idle/Walk/Drive 43,3/42,7/43,9 ms statt 84–89 ms in R1.
- Ziel ≤ 33,3 ms bleibt FAIL.
- Abschalten von Schatten oder Stadt bringt nur kleinen Restgewinn; Pixelratio 0,6 erreicht 26,3 ms.

## Stop

Der einzelne R3-Kandidat ist gemessen und bleibt unveröffentlicht erhalten. Kein zweiter LOD-Patch in diesem Gate.

Nächster Gate: `WORLD-M2A-R4 · ADAPTIVE RESOLUTION + CLAY DISTANCE BUDGET`. Danach separat echte KayKit-/Tiny-Treats-/Kenney-Fassadenbauteile isolieren und instanziert in die Nahstufe übernehmen.
