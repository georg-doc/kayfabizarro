# WORLD-M2A-R1 · Run State

Status: `BASELINE_IN_PROGRESS`
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

## Aktueller Schritt

1. Reproduzierbare Baseline mit gleicher Szene und einem neutralen Browser-Messfühler.
2. Kosten-/Nutzen-Matrix aus Framezeiten, Renderlast, Ladezeit und Gameplay-Relevanz.
3. Maximal zwei Kandidaten:
   - lückenloser Fahrkontakt + Fahrzeug-Grounding + offensichtliche Bewegungsreaktion;
   - größter gemessener Laufzeitblocker.

## Stop

Nach zwei Kandidaten, bei nicht vergleichbarer Messung oder falls ein zweiter Runtime-Owner nötig würde.

