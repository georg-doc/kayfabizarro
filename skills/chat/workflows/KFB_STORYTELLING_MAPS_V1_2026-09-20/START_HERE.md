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

PUBLIC_VERIFIED Stage route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/t1-donors/`

Do not move to media replacement, dice-to-standee collision, Odyssey integration or Near-East integration before this donor proof is visually reviewed.


## T1 PUBLIC VERIFIED · 2026-09-20

Exact Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/t1-donors/`

Verified on the public Cloudflare route:

- browser checks: **9/9 PASS**;
- exact Cloudflare marker: PASS;
- route HTTP 200;
- exact KayKit playerstand donor: loaded;
- exact KayKit playercard donor: loaded;
- exact KayKit D20 donor: loaded;
- external Three/Cannon D10 donor: ready;
- D10 roll resolved with a natural result;
- page/script errors: **0**;
- failed HTTP requests: **0**;
- desktop screenshot: captured;
- mobile-landscape screenshot (844×390): captured.

Evidence:
- workflow run: `35522576654`
- job: `106109086411`
- artifact: `10608862542`
- digest: `sha256:eeafbfab2b3cd8b0a79d0588537740129f5749ef7518fe5effbe30a3f7eed787`
- publication commit: `ea77610ba57b3ed5aa8f045978643d8a8030b3ba`

This is a technical/public donor proof, not Georg's visual donor-identity acceptance.

Exactly one next gate remains:
**Georg reviews whether all four donors are visually/source-identifiable enough to proceed to T2 Media Standee.**
