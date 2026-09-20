# Recovery · KFB Storytelling Maps v1

Status: **CURRENT EXPERIMENTAL RECOVERY · T2 PUBLIC_VERIFIED · CARD RIG GATE**
Date: 2026-09-20

## Owner

Implementation remains under:
`tools/kfb-cartoon-map-board/`

Storytelling Maps is the product/authoring direction over that owner, not a second runtime.

## Current branch / PR

- branch: `stage/storytelling-maps-v1-t2-media-standee-2026-09-20`
- draft PR: `georg-doc/kayfabizarro#145`
- T2 runtime implementation head: `d8b8f2e6feb3be88b29a49dd83182c0cf669167d`

## Current public gate

T2 exact Media Standee:
`https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/t2-media-standee/`

PUBLIC_VERIFIED:
- **13/13 PASS**
- exact KayKit stand/card donors
- source materials `boardgame` + `red_knight`
- frame preserved in Portrait + Landscape
- front-only replacement in Portrait + Landscape
- MEDIA → ORIGINAL → MEDIA PASS
- page/script errors: **0**
- failed HTTP requests: **0**
- mobile landscape proof captured

Evidence:
- run/job: `35523870018` / `106112519588`
- artifact: `10609178985`
- digest: `sha256:e94c04a8de1eb0f6b7431e2790e64382a7e68904d5df76c7fdd1a54e3b6fbc7a`
- runtime publication: `2eb9235f075e29b2eaced4ee76485d0c2ed4aeb4`

## T1 historical gate

`https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/t1-donors/`

T1 was PUBLIC_VERIFIED and Georg explicitly requested proceeding to T2.

## Product / gameplay docs

Read:
1. `START_HERE.md`
2. `LIVING_MASTERPLAN.md`
3. `KFB_TABLE_V6_DONOR_ANALYSIS.md`
4. `GAMEPLAY_ARCHITECTURE_V1.md`
5. `LUDOWALA_BENCHMARK.md`
6. `ODYSSEY_POC.md`
7. `T2_MEDIA_STANDEE_BRIEF.md`

## KFB Table v6 evidence boundary

The user-supplied `KFB Table v6.dc.html` is a thin wrapper. It references `support.js`, `pet-library.v6.js` and `kfb-table.v6.js`; those sibling bytes were not part of the attachment, and the current GitHub tree does not expose a current `kfb-table.v6.js`.

Do not invent its internals. Use the documented current Freestyle rules + historical Gameplay Stage/`KFBStageContext` evidence for gameplay architecture.

## FrizzleCrits boundary

Exact `KFB Game Sim → FrizzleCrits` source/caller chain remains unresolved in the Canon Home Map. Keep only the generic `CriticProvider` seam until it is pinned.

## Optional helpers

`game-dev` CLI was unavailable in this chat and is already recorded once. Repository-native checks continue.

Build 3D Game Rooms remains optional for special diorama/room transitions, not ordinary map authoring.

## Protected boundaries

Do not:
- create a second Map/World runtime;
- fork CardBuilder/Ink;
- create a second asset registry;
- let LLMs mutate game state outside validated actions;
- turn mini-game outcomes into an unrequested score/win condition;
- ingest contemporary/political content for this technical gate;
- auto-merge or promote Live.

## Current user direction · 2026-09-20

Portrait and Landscape are both required.

T2 remains valid technical evidence for the front-material seam, but the visual contract is now stricter:

- never render a visible rectangular motif plane;
- media lives on the actual rounded front-art mesh;
- arbitrary aspect ratios use corner-preserving mesh-space deformation;
- rounded corners / border inset / thickness must survive all 3D views.

New docs:
- `CARD_RIG_V1.md`
- `VISUAL_MOTION_SYSTEM_V1.md`
- `WSA_PROP_RIG_PLANNING_NOTE.md`
- `CLAUDE_DESIGN_BRIEF_VISUAL_LAB_V1.md`

## Exactly one next gate

**VL1 Responsive CardRig source proof. Do not start T3 motion until the exact KayKit card survives the responsive transformation without visible square media corners.**
