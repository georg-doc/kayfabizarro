# KFB Storytelling Maps v1 · START HERE

Status: **EXPERIMENTAL · CURRENT REFERENCE**
Date: 2026-09-20
Owner: **KFB Cartoon Map Board presentation/story layer**
Implementation home: `tools/kfb-cartoon-map-board/`
Integration lead: **WSA / receiving consumer**
Current slice: **T1 exact donor isolation**

## Product direction

KFB Storytelling Maps v1 is the umbrella direction for the existing Cartoon Map Board implementation. It does **not** create a second map runtime.

The same runtime should evolve into:

- interactive world / galaxy / continent / country / region / city maps;
- tactical board-game presentation;
- authored 2–3 minute story-map cut-scenes;
- reusable in-game world/zone map module;
- later editor / authoring tool that writes the same declarative manifests consumed by runtime.

## Read order

1. `LIVING_MASTERPLAN.md`
2. `LUDOWALA_BENCHMARK.md`
3. `ODYSSEY_POC.md`
4. `RECOVERY.md`
5. tool-local tactical donor brief:
   `tools/kfb-cartoon-map-board/docs/TACTICAL_GAME_MAP_V1_2026-09-20.md`
6. KFB motion:
   `skills/kfb-cartoon-animation_v2.md`

## Current public baseline

Europe P0.2:
`https://kayfabizarro.pages.dev/kfb-hub/stage/cartoon-map-board-p02/`

That baseline is PUBLIC_VERIFIED but not a final visual/product acceptance.

## Current bounded gate

T1 must show these donors separately before combination:

- exact KayKit `playerstand_red.gltf`;
- exact KayKit `playercard_knight_red.gltf`;
- exact KayKit `D20_red.gltf`;
- pinned external `3d-dice/dice-box-threejs` D10/physics donor.

Candidate Stage route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/t1-donors/`

Do not move to media replacement, dice-to-standee collision, Odyssey integration or Near-East integration before this donor proof is visually reviewed.
