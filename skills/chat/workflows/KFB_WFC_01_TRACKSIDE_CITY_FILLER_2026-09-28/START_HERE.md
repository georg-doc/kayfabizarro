# START HERE · WFC-01 · Trackside & City Filler

Status: `READY BRIEF · NOT IMPLEMENTED`  
Date: 2026-09-28  
Owner: WorldBuilder / Trackside Presentation  
Design executor: Claude Design  
Receiving owner: WSA / World integration

## Goal

Build one bounded proof that fills only the **allowed spaces beside a fixed playable road/track corridor** with approved KFB clay modules.

WFC is a constrained filler. It does not own the road, track, collision ground, OSM graph, camera, landmarks, lighting rig, gameplay, or runtime architecture.

## Read in this order

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `CLAUDE_DESIGN_BRIEF_WFC_01.md`
5. `BLENDER_MCP_LANDMARKS_CLAY.md`
6. Accepted K2/T3-v2 source:
   `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/START_HERE.md`
7. S1 failure evidence:
   `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v3/KFB_KNET_STRASSE_S1_FAIL_2026-09-28/POSTMORTEM_S1_KNET_STRASSE.md`

## Status locks

- **K2 clay tools/materials = ACCEPTED AS BASE.**
- **T3 v2 = retained visual/geometry donor.**
- **S1 road v1-v3 = FAILED.**
- **T3 v3 road markings = HOLD with S1.**
- From S1 only these may be salvaged: dents, layer-isolation measurements, KayKit vertex-atlas recoloring technique, stream-frame `(s,u)` placement technique, and `fillet()`.
- The visual sample `ref/georg_sample_clay_street.png` inside the S1 failure export is reference grammar only. It contains a visible stock-image watermark and must never ship as an asset.

## Done when

A deterministic seed produces a compact test corridor with:

- the fixed road/track and landmark unchanged;
- no generated object on carriageway, shoulder, collision ground, portal, ramp, sightline, spawn, or reserved interaction area;
- three readable edge families: city, nature, race;
- every placed module reports its source ID, rule and seed;
- identical seed = identical layout;
- contradiction = bounded retry, then a simple authored fallback;
- output exports as a small recipe, not a baked duplicate world.

No Stage and no human gate are required for the first technical proof. Integrate into a real WorldBuilder owner surface before asking Georg to judge the result.

## Stop rule

Do not rebuild roads, K2, T3, WorldBuilder, Track Core, façades, landmarks, or a second procedural world owner. If the required donor or contract is absent, return `SOURCE_REQUIRED` and stop.
