# WORLD-M2A-R5 · Run State

Status: `RENDER_R0_LOCAL_PASS · PUBLIC_ROUTE_REMAINS_R5 · HUMAN_VISUAL_REVIEW_PENDING`
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
- Die feste Stage zeigt exakt R5 ab Publication-Head `f827839509cf7b517daa98fe3074f49d9510c626`.
- Track T3 ist ein neuer akzeptierter Look-Donor, aber nicht Bestandteil dieses Reparaturpasses.

## Ergebnis

- Fahrzeug startet sichtbar bei 4/4 Radkontakten und 0,003 m Ground-Gap.
- 12,96 m öffentlicher Offroad-Lauf bleiben auf der vollständigen World-Kontaktfläche.
- Walk 1,41 m/s; Sprint 2,99 m/s; früherer Pace-up nach 0,32 s.
- Paket 27/27; öffentliche Browserprüfung Desktop + schmal 38/38; öffentlicher Playability-Proof PASS.
- Öffentliche p95 Idle/Walk/Drive 33,3/16,7/16,8 ms; 30-fps-Ziel bestanden.
- 0 Seitenfehler; Qualitätswechsel stabil statt frameweise.

## Neuer visueller Donor

`KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27` liegt auf `main@692240b5` und ist von Georg als ausbaufähige Basis akzeptiert. T1/T2 bleiben verworfen. T3 gehört erst in einen eigenen Track-/World-Seam-Slice; R5 wird dafür nicht wieder geöffnet.

## Stop

R5 ist auf der festen Stage technisch bewiesen. Keine weitere Bewegungs- oder Performance-Änderung vor Georgs menschlichem Fahrtest.

Nächster Gate: Georg testet zu Fuß, Auto, Offroad und Flug auf der festen Stage. Erst danach folgt genau ein gezieltes Clip-/Feel-Tuning oder der nächste Integrationsslice.

## Render R0 · 2026-09-28

- Branch: `work/render-r0-shared-preset-2026-09-28`
- Draft PR: `#273`, gestapelt auf dem unveränderten R5-Owner-Branch
- Implementierung: `eb15def4a6d1bab33685d4116896a5cad9947c2c`
- Erlaubte Owner: gemeinsames Render-Preset, World-Schatten-Adapter, H0-Clay-Detailtier, Tests/Doku
- Geschützt: World/OSM/Terrain, Player/Movement, Race-Drive/Physics/Camera, Kollision, UI

Der bisherige Schattenpfad vergrößerte die 2K-Schattenprojektion bis ±400 m und setzte `normalBias` auf 1,2 Texel. Im Extrem entsprach das 0,469 m sichtbarem Kontaktversatz. Render R0 begrenzt die aktive Projektion auf ±72–140 m und den metrischen Offset auf höchstens 0,028 m; die Mitte bleibt auf ganze Texel stabilisiert.

Die Knetoberfläche besitzt jetzt getrennte Hero-/World-/Far-Tiers. Während Bewegung werden nur hochfrequente Grain-/Crease-Anteile abgesenkt; im Stand kehrt das stabile Detailprofil zurück. Entfernte Stadthüllen und Far Terrain verwenden die vereinfachte Stufe.

Ergebnis: Paket 32/32, Browser Desktop + schmal 48/48, fokussierter Renderbeweis 9/9, Playability PASS, p95 Idle/Walk/Drive 16,7/16,7/16,8 ms.

Genau ein nächster Gate: visueller A/B-Blick auf Kontaktkanten und Texturflimmern. Keine Stage-/Live-Promotion ohne diesen Human Gate.
