# WORLD-M2A-R5 · Run State

Status: `R5_LOCAL_PLAYABILITY_PASS · FRAME_TARGET_PASS · PUBLICATION_PENDING`
Datum: 2026-09-27

## Lock

- Owner: bestehende World-M2A-Runtime
- Repo: `georg-doc/kayfabizarro`
- Branch: `work/world-m2a-playable-r5-2026-09-27`
- Basis: R4 `c8ecbf570dd9689c3e732209fbc89a4b6d00acc7`
- Implementierung: `b0142b3540728afac80a6ef9b15315fd7089a5fe`
- Outcome: Georgs konkrete Boden-, Tempo- und Offroad-Blocker reparieren; keine neuen Features

## Protected

- World r2 bleibt World-/Terrain-Owner.
- Race PR #10 bleibt Drive-/Physics-/Camera-Owner.
- World M1 bleibt Ground-/Flight-/Actor-Owner.
- Die öffentliche Route zeigt weiter R4, bis R5 als exaktes Paket veröffentlicht und geprüft ist.
- Track T3 ist ein neuer akzeptierter Look-Donor, aber nicht Bestandteil dieses Reparaturpasses.

## Ergebnis

- Fahrzeug startet sichtbar bei 4/4 Radkontakten und 0,003 m Ground-Gap.
- 12,67 m Offroad-Fahrt bleiben auf der vollständigen World-Kontaktfläche.
- Walk 1,41 m/s; Sprint 2,99 m/s; früherer Pace-up nach 0,32 s.
- Paket 27/27; Browser Desktop + schmal 38/38; eigener Playability-Proof PASS.
- p95 Idle/Walk/Drive 33,4/16,8/16,8 ms; 30-fps-Ziel bestanden.
- 0 Seitenfehler; Qualitätswechsel stabil statt frameweise.

## Neuer visueller Donor

`KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27` liegt auf `main@692240b5` und ist von Georg als ausbaufähige Basis akzeptiert. T1/T2 bleiben verworfen. T3 gehört erst in einen eigenen Track-/World-Seam-Slice; R5 wird dafür nicht wieder geöffnet.

## Stop

Der R5-Kandidat ist lokal bewiesen. Keine weitere Bewegungs- oder Performance-Änderung vor dem öffentlichen und menschlichen Test.

Nächster Gate: exakten R5-Unterordner auf die feste M2A-Stage veröffentlichen, öffentlich 38/38 prüfen und dann Georg frei testen lassen.
