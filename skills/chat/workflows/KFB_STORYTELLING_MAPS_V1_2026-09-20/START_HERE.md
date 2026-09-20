# KFB Storytelling Maps v1 · START HERE

Status: **EXPERIMENTAL · CURRENT REFERENCE**
Date: 2026-09-20
Owner: **KFB Cartoon Map Board presentation/story layer**
Implementation home: `tools/kfb-cartoon-map-board/`
Integration lead: **WSA / receiving consumer**
Current slice: **T2 exact KayKit Media Standee A/B**

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

## T1 gate result

Georg explicitly advanced the work to T2 after the PUBLIC_VERIFIED T1 donor proof. This is sufficient donor-identity acceptance for this bounded production sequence; it is not a blanket final visual acceptance of Storytelling Maps.

T1 proved:

- exact KayKit `playerstand_red.gltf`;
- exact KayKit `playercard_knight_red.gltf`;
- exact KayKit `D20_red.gltf`;
- pinned external `3d-dice/dice-box-threejs` D10/physics donor.

T1 Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/t1-donors/`

## Current bounded gate · T2

PUBLIC_VERIFIED T2 Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/t2-media-standee/`

T2 uses the exact KayKit `playerstand_red.gltf` + exact `playercard_knight_red.gltf`. It preserves the original `boardgame` frame material and replaces only the `red_knight` front-art material with diagnostic media.

A/B:
- portrait native orientation;
- landscape using the same card geometry rotated 90° with media remap.

Do not advance to T3 motion before Georg reviews this A/B.


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


## T2 PUBLIC VERIFIED · 2026-09-20

- exact Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/t2-media-standee/`
- browser checks: **13/13 PASS**
- portrait + landscape: ready
- original material discovery: `boardgame` + `red_knight`
- frame preserved: **true / true**
- media replacement bindings: **1 / 1**
- MEDIA → ORIGINAL → MEDIA: PASS
- page/script errors: **0**
- failed HTTP requests: **0**
- desktop media + desktop original + mobile-landscape screenshots captured
- run/job: `35523870018` / `106112519588`
- artifact: `10609178985`
- digest: `sha256:e94c04a8de1eb0f6b7431e2790e64382a7e68904d5df76c7fdd1a54e3b6fbc7a`
- runtime publication: `2eb9235f075e29b2eaced4ee76485d0c2ed4aeb4`

Exactly one next gate:
**Georg compares Portrait vs Landscape and decides whether both remain first-class before T3 motion.**
