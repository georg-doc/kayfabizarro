# WORLD-M2A-R4 · Run State

Status: `R4_LOCAL_PASS · FRAME_TARGET_PASS · PUBLICATION_PENDING`
Datum: 2026-09-27

## Lock

- Owner: bestehende World-M2A-Runtime
- Repo: `georg-doc/kayfabizarro`
- Branch: `work/world-m2a-adaptive-quality-r4-2026-09-27`
- Basis: R3 `69d7910cde4275131f6701416c26d9cab3937ba5`
- Implementierung: `1d803d177789fa834c5165fe36caa12fc26fe7c7`
- Outcome: genau eine adaptive Auflösungs-/Clay-Distanzregel messen; keine neuen Spielmerkmale

## Protected

- World r2 bleibt World-/Terrain-Owner.
- Race PR #10 bleibt Drive-/Physics-/Camera-Owner.
- World M1 bleibt Ground-/Flight-/Actor-Owner.
- Öffentliche Fehler-Stage bleibt bis zum erfolgreichen Publication-Gate unverändert.
- Echte Fassaden-Donors kommen erst nach isoliertem Quellenbeweis.

## Ergebnis

- Bewegung: Pixelratio 0,65 (schmal 0,60); Stillstand nach 1,4 s: 0,86 (schmal 0,72).
- WebGL passt seine interne Auflösung an; HTML-/HUD-Oberfläche bleibt in nativer CSS-Auflösung.
- Entfernte Stadt-Hüllen behalten Form und Farbe, aber nicht den vollständigen Clay-Relief-Shader.
- Paket 26/26; Browser Desktop + schmal 38/38.
- p95 Idle/Walk/Drive 16,7/16,7/16,7 ms; Ziel ≤ 33,3 ms bestanden.
- 0 Frames über 50 ms in den drei 8-s-Läufen; 4 stabile Qualitätswechsel im Start/Stop-Test.

## Stop

Der einzelne R4-Kandidat ist gemessen. Kein zweiter Performance-Patch in diesem Gate.

Nächster Gate: exakt diesen Kandidaten auf die feste Stage publizieren und dort öffentlich verifizieren; danach Georgs freier Spieltest. Erst danach separat echte KayKit-/Tiny-Treats-/Kenney-Fassadenbauteile isolieren und instanziert in die Nahstufe übernehmen.
