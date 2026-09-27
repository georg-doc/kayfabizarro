# WORLD-M2A-R1 · Run State

Status: `R1_PARTIAL · CONTACT_AND_BOOT_PASS · FRAME_BUDGET_FAIL`
Datum: 2026-09-27

## Lock

- Owner: bestehende World-M2A-Runtime
- Repo: `georg-doc/kayfabizarro`
- Branch: `work/world-m2a-playability-r1-2026-09-27`
- Source: `work/world-drive-interact-m2a-2026-09-27@b34d9566450cbc72cb0eb556cab09126c8587503`
- Outcome: dieselbe Hürth-Szene begeh- und befahrbar machen; keine neuen Features

## Protected

- World r2 bleibt World-/Terrain-Owner.
- Race PR #10 bleibt Drive-/Physics-/Camera-Owner.
- World M1 bleibt Ground-/Flight-/Actor-Owner.
- Track S9/S4B, Clay Emanata und Brick-Fish-Reaktionen sind neue Inputs, aber nicht Teil von R1.

## Ergebnis

- Kandidat 1: durchgehender Fahrboden, geparkte Fahrzeug-Simulation und schnellerer Walk-Antritt — bestanden.
- Kandidat 2: Runtime-Profil mit geringerem DPR, 2048er Bodenkarte, 2048er Schattenkarte und halbierter Terrain-Auflösung — Startzeit bestanden, Frame-Budget nicht bestanden.
- Auto: 4/4 Radkontakte; sichtbarer Ground Gap 0,002–0,003 m.
- Kontaktfläche: 716 × 716 m statt nur 184 × 184 m Edit-Tile.
- Automatisierte Offroad-Fahrt: ca. 24 m, 4/4 Kontakte, kein Fall.
- Bester Kaltstart bis Kontrolle: 14,2 s (Ziel ≤ 15 s).
- Frame p95: 84,4 ms zu Fuß / 89,4 ms fahrend (Ziel ≤ 33,3 ms) — **FAIL**.
- Engpass: Renderpfad, nicht Movement/World/UI-JavaScript.

## Stop

Zwei Kandidaten sind ausgeschöpft. R1 bleibt erhalten, aber unveröffentlicht.

Nächster Gate: `WORLD-M2A-R2 · RENDER BUDGET` — Grafikbeschleunigung und Renderpfad einmal verifizieren, danach genau eine sichtbare Stadt-LOD-/Shadow-Budget-Lösung. Kein weiterer M2A-Feature-Ausbau davor.
