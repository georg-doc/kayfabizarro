# HANDOVER · WSA · nächster Chat: Insel-Korridor befahrbar + begehbar

Stand 2026-10-01 · Basis `KFB World Core R2C · Hex-Archipel Katalog.dc.html` · Ziel: **4-Insel-Korridor, additiv zugeschaltet, jeder Schritt gemessen.**
Keine neue Lab-App, keine Galerie. Architekturentscheidung (Track überall / teilweise / Flight+Portal) erst nach den Messdaten.

## Zielbild (Architektur, verbindlich bis Messung widerlegt)
- **World Graph = Daten** (Inseln, Höhenebenen, Track-Kanten, Portale). Runtime kennt nur ein lokales Fenster.
- **Insel = Stream-Chunk**: Terrain + inselweise InstancedMeshes + lokale Assets. R2C bündelt schon je Palette ≈ je Insel → auf `islandId` umschlüsseln.
- **LOD-Zonen**: Nah (voll, Collider, Animation) · Mittel (reduziert, keine Mixer, keine teuren Schatten) · Fern (Silhouette oder nur Graph).
- **Track = Graph-Kante + gestreamte Geometrie**; Collider nur aktuelle + nächste Segmente.
- **Billboard = gecachte Textur** (bb-scene Kartenbild-Cache), keine PDF-Arbeit im Renderloop; fern aus.
- **NPC**: Simulation weit, Actor-Runtime nah. **Skydome**: einmal global (Modul kommt mit neuen Wolken).
- Modi im Graph: `TRACK` · `FLIGHT` · `PORTAL`.

## Bausteine (vorhanden)
| Baustein | Quelle |
|---|---|
| Inselwelt, Strecke (Samples P/T/U, Mindestradius, Kreuzungsprüfung) | `lab-world/hex-archipel.r2c.js` · `buildTrack()` |
| Fahrphysik, Spurhilfe | `lab-drive/kfb-drive.k2b.js` (J16/J17) |
| Verfolgerkamera | J09/J10 (Owner offen: Abstand nach Fahrzeuglänge) |
| Gehen + Locomotion | `lab-travel/pinned/walk-controller.js` · `locomotion-profiles.v1.js` (J14) |
| Ein-/Aussteigen, Router | J14 Travel Modes |
| Sitz-Vertrag FB-Cabrio | `lab-travel/fb-car-01/VEHICLE_SEAT_CONTRACT.json` + `.j17-patch.json` |
| Schatten | `lab-world/shadow-fit.v1.js` (geteilt) |

## Schritte (je Schritt: Messung, dann weiter)
0. **Baseline** R2C einfrieren → R2D. Messung auf Georg-GPU.
1. **Track-Adapter**: R2C-Samples → J16/J17-Streckenformat (P/T/U/Breite/Slots). Kein Neubau der Physik.
2. **Collider gechunkt** aus demselben Profil (Fahrbahn + Bande), aktiv: hinter Auto 1, aktuell, voraus 2.
3. **KayKit-Auto** fährt die Runde (car_taxi Vorschlag). **Looping = Schienenmodus**: Auto klebt am Frame, Tempo/Lenkung beim Spieler, Ein-/Ausfahrt mit Übergabe an Physik.
4. **Walk auf Inseln**: Boden aus dem Hex-Raster (Zelle → Stufe, Rampe interpoliert), kein Mesh-Collider. Hindernisse: Plateauwand (Kante), Berg/Hügel/Wald (Zylinder je Zelle), Billboard-Pfosten. Router J14 für Aussteigen/Einsteigen.
5. **Billboards gecacht** (statisch, nah optional Living).
6. **Skydome-Modul** + neue Wolken (wenn geliefert).
7. **FB-Cabrio** erst nach Blender-Rig-Fix (J17 RETURN Punkte 1–5). Bis dahin: FB zu Fuß, KayKit-Auto fährt.
8. **Streaming-Stress**: 4 → 12 → 24 → 48 → 150 logische Inseln. Gemessen wird, wie viele Nah/Mittel/Fern gleichzeitig gehen. Nie 150 voll.

## Messprotokoll (gleiche Zahlen jeder Schritt, als Delta)
fps · mittlere Bildzeit · Spikes (p95/p99) · Draw Calls · Dreiecke · Texturen + Geometrien · sichtbare Inseln (N/M/F) · aktive Track-Chunks · aktive Collider · aktive AnimationMixer · sichtbare Billboards.
Nach 2–3 min Fahrt: sinken Geometrien/Texturen wieder? Sonst Streaming-Leak.
Quelle: `renderer.info` + `performance.now()` im vorhandenen HUD/Stand-Block. Kein Dashboard.

## Abbruch / Stopp-Regeln
- Zwei Anläufe je Problem, dann stoppen und Optionen an Georg (wie J17).
- Kein frei erfundener Look: Clay nach SSOT (`KFB_CLAYMATION_STYLE_SSOT.md`), Golden-Linie K1/H0, v10 auf Parität.
- Quelle nicht erreichbar → `SOURCE_REQUIRED` und stoppen.

## Erwartete Regeln am Ende (Beispiel, aus Messung zu füllen)
max. N Full-Islands · max. M aktive NPC-Inseln · Schatten nur nah · Track-Collider ≤ 2 Chunks · Billboards ab X m statisch/aus · Mid-Islands mit LOD Y.

## Offene Owner-Fragen
- Track kanonisch: R2C-Sweep oder T4-Strang (TD03)?
- Looping-Schienenmodus ok?
- Kameraabstand nach Fahrzeuglänge (J09/J10)?
- Vehicle-Seat-Schicht: ToolBox oder Joyride?
