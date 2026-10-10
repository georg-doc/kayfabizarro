# KFB Track Core · Transition / Dungeon / Rail Research RETURN
Date: 2026-10-10
Mode: RESEARCH · source/reference handoff only
Owner: existing Track Core / KFB Racer and Joyride presentation owners
Repository: `georg-doc/kayfabizarro`
Branch: `research/kfb-track-core-transition-rail-2026-10-10`
Parent baseline: main `3d597aad02a7c9d747b8e6d9188e838040f7d239`.
Track Core prior development: Draft PR #219 `georg-doc-patch-2` @ `3232a1070686896833d6b7942fcd631b9fa8cda6`; main contains Joyride J14 Track Core v0.12 and transition atlas source donors. No active product writer/PR created for this study.

## Outcome

A verified, reuse-first research proposal for three related, but *not identical*, joints:
- **Track Core/Joyride:** staggered lateral profiles for asphalt, kerb, sidewalk, barrier, runoff, fence, cliff/portal and the precise central socket;
- **Dungeon/World Atlas S13.2:** graph-owned unique wall seam / shared corner selector, optional rounded clay broken ends and low-cost seeded rubble without replacing collision;
- **Minecart/rail:** Track Core route/sockets/arc-length sampler reused for dual-rail/sleepers and a separately constrained rail vehicle mode; no assumption that free-steer Joyride rigid-car dynamics equal railway physics.

Full source report:
`skills/chat/research/KFB_TRACK_CORE_TRANSITION_DUNGEON_RAIL_RESEARCH_2026-10-10.md`.

## High-value correction

Georg's existing 2026-09-27 Racer Clay Edge/Runoff/Transition brief **already requested** a universal grammar. J14 T4 `transition-profiles.v1.json` implements independent layer windows and left/right lag; `transition-atlas.v1.js` implements visual Knetflecken, curbs/sidewalks and other dressing as look-only. Track Core v0.12 already owns profileSlots/SLOTS and physical route/contact. The missing work is **source-isolated exact adapter and transition-quality proof**, not an additional geometry compiler.

Old design-brief 32m rhythm/8m minimum and TD03 90–100m source zone spans describe DIFFERENT donor contexts. Preserve existing parameterized windows; never claim one universal length.

Dungeon's canonical `seamKey` and measured actual wall/corner pieces stay the source graph truth. Broken visual corners/loose stones are separate owner-approved presentation, not cover for incorrect structural intersections.

Older Racer draft already proposes rail/minecart reuse. Rail requires Track Core geometry route + on-rail constrained mode using common physics host, gravity/braking; not identical free-drive steering dynamics. Initial KISS outcome: simple loop or bounded straight/curve/slope, no switches.

## External sources

- Epic City Sample PCG Shape Grammar: https://dev.epicgames.com/documentation/unreal-engine/city-sample-pcg-for-unreal-engine
- SideFX Lines and Curves: https://www.sidefx.com/tutorials/lines-and-curves/
- SideFX Houdini Procedural Railroad: https://www.sidefx.com/tutorials/houdini-railroads/
- SideFX Project Titan Rails: https://www.sidefx.com/tutorials/project-titan-rails-tool/
- Godot TileSet corner/side matching: https://docs.godotengine.org/en/stable/tutorials/2d/using_tilesets.html
- CryEngine damaged walls: https://www.cryengine.com/docs/static/engines/cryengine-3/categories/1114113/pages/1310733
- Open academic modular architecture principles: https://www.sciencedirect.com/science/article/pii/S1875952121000732

These are source-described approaches; none was imported/tested in KFB.

## Owner boundaries

Track Core: exact CONNECT/socket/profile/drive surface/rail geometry (if authorized later).
Joyride: visible KFB clay road/track edge and staggered dressing.
WB2/Surface Truth: landscape ground support and collision outside track surface; Island R4 remains STOPPED / F-R39 FAIL / NO MVP.
World Atlas / KayKit Dungeon S13.2: canonical cell graph/wall edges/corners.
Vehicle / mode arbitration: one on-rail constrained body; track physics host reused but no second player/world writer.
KayKit/Kenney/Quaternius: source-backed visual props/scale/reference only; no road mesh or railway authoring owner.

## Evidence and limits

Current GitHub source documents and concrete profile modules inspected; external first-party developer/source docs consulted. One research file and this Return added.
- new runtime tests: 0
- source-isolated 3D screenshots: 0
- Blender tests: 0
- on-rail physics tests: 0
- public Stage/Site build: 0
- merge: NO; no PR
- available evidence: README/report and source-level crosschecks, not visual/product acceptance.

## One next productive gate

`TRACK_CORE_EDGE_ADAPTER_SOURCE_ISOLATION_01`: existing Racer/Joyride specialist opens ORIGINAL KFB Track Core sections and existing T4 transition donor separately, then produces one true source-backed Street↔Race curb/sidewalk/barrier adapter comparison and measured socket/contact proof. Do not reimplement existing system or start broad World R4/R5.

Future Dungeon and Rail fixture paths remain documented in the research report, not activated as separate runtime projects.

## Recovery

If this chat ends, open this Return, the source report, main `skills/chat/START_HERE.md`, and fetch the exact HEAD of `research/kfb-track-core-transition-rail-2026-10-10` before doing anything.
