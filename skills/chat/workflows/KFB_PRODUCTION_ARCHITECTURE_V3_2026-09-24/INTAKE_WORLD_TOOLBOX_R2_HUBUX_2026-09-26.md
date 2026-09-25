# Intake · World r2 + ToolBox r2 + Hub UX cut · 2026-09-26

Status: **CLASSIFIED · RECOVERY CHECKPOINT · RECEIVING OWNERS UNCHANGED**

Main intake head:
`b24b129b787beecd0ca0760611ac4044d3f7189c`

This intake records the new Claude Design Session Cuts. Inbox location does not promote runtime ownership.

## A · ToolBox Production-01 r2

Source:
`tools/KFB-ToolBox/_inbox/KFB ToolBox Production-01-1/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/`

Classification:
**KEEP · STRONG CANDIDATE · WEB REHOME / OWNER PATCH → STAGE REVIEW**

Key new result:
- one Studio + Animation Lab runtime preserved;
- shared `pose-rig.v1` chain fix removes the ToolBox-local re-measure hack;
- new `locomotion-profiles.v1.js` with 14 semantic KayKit roles;
- explicit measured playback variants;
- State preview is calibration only, not a second movement engine;
- EAR-DANGLE-01 on FrizzleBob Ear Rig v5;
- S39 Resident Band fixture without baseplate;
- CARD_SURF fit-profile seam without Flight ownership.

Reported evidence:
- Claude Preview self-test **19/19 PASS**;
- local closure/JSON/secret checks PASS;
- zipcheck equivalent JS check PASS;
- Python zipcheck NOT_RUN;
- clean run from unpacked ZIP NOT_RUN;
- Georg r2 human review NOT_RUN.

Important owner actions:
1. compare the candidate `pose-rig.v1` patch against the current shared owner before promotion;
2. promote `locomotion-profiles.v1.js` only through ToolBox/Animation Lab ownership, never from WorldBuilder;
3. preserve Ear Rig PR #214 as the single `ear-dangle.v1.js` runtime owner;
4. do not treat CARD_SURF as Flight implementation.

Open/TUNE:
- measured locomotion speeds still require visual foot-skate review;
- Ear amplitudes/settle need Georg review;
- solver A/B/C not human-reviewed;
- S39 drummer still intersects support plane by documented amount;
- CardCarrier exact pin still SOURCE_REQUIRED;
- Materials/Bubbles remain deferred rather than replaced.

Receiving gate:
**WEB REHOME / OWNER PATCH → PUBLIC STAGE → GEORG REVIEW.**

## B · World Integration-01 r2

Source:
`tools/KFB-ToolBox/_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/`

Classification:
**KEEP · CORRECT PRODUCT CONTINUATION · WEB REHOME / REGRESSION → STAGE REVIEW**

Key new result:
- same accepted WB2 editor/runtime remains the world authoring owner;
- KayKit ground-locomotion consumer expanded to source-backed states/variants;
- Gait Governor drives the existing walk-controller rather than replacing it;
- Jump Start → Air → Land follows real physics/contact;
- measured strafe direction alignment;
- FrizzleBob hidden-head/Ink ghosting check reports zero ghost pixels;
- FACADE_RULE v1 propagated across ordinary Hürth + Cologne buildings;
- FACE_NORMALS fixes recurring roof-edge / lower-wall normal contamination;
- per-building host support follows edited terrain with no fake plate;
- Cologne world profile mounts Dom + Hbf as protected landmark owners.

Reported evidence:
- Hürth self-test **55/55 PASS**;
- Cologne self-test **55/55 PASS**;
- WB2 sandbox boot PASS;
- representative house/roof/contact visual preview observed;
- WB2 34/34 NOT_RUN;
- Alstädten NOT_RUN;
- mobile NOT_RUN;
- Georg r2 human review NOT_RUN;
- unpacked-ZIP browser clean run NOT_RUN.

Important architecture correction:
The World candidate currently contains useful measured locomotion consumer logic, but canonical shared locomotion truth belongs in ToolBox r2. Receiving Web work must compare/bridge the ToolBox profile output before promoting World-specific values as shared truth.

Known TUNE/OPEN:
- backward source clip has intrinsic slide;
- walk.fast→run gap is still visible;
- street-sign posts / some props do not yet follow edited support;
- tile-edge terrain step remains;
- camera/building collision remains absent;
- literal WB-D1 normalBias 0.9 is explicitly superseded by the newer texel-scaled `shadowFollow` solution because 0.9 caused Peter-Panning;
- Cologne water remains flat presenter color;
- 5/369 Cologne parts have degenerate rings;
- Blender route remains `VOICE_INPUT_UNCERTAIN` and `SOURCE_REQUIRED`.

Receiving gate:
**REHOME 1:1 → reconcile ToolBox locomotion profile contract → World regression → PUBLIC STAGE → GEORG REVIEW.**

## C · Hub UX Recovery r1 · additional arrival

Source:
`tools/KFB-ToolBox/_inbox/KFB HUB Design v2/KFB_HUB_UX_RECOVERY_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/`

Classification:
**KEEP · HUB-CTRL UX CANDIDATE · NO LIVE PROMOTION**

The cut is separate from the two product slices but arrived in the same main delta.

Useful result:
- accepted Hub UI v2 Paper/Dark donor was shown and reused;
- current Production Desk data/reload logic retained;
- Pocket Inbox restored;
- responsive 1440 / 880 / 390 candidate;
- visible freshness/reload feedback;
- local decision packets `kfb.hub-decision/1`;
- Resident overlay prototype as a pure consumer.

Recorded Georg feedback inside the cut:
- v1 TUNE for readability;
- v2 “gefällt mir super”, rounded corners requested and applied;
- Resident overlay “reicht als Prototyp völlig aus”; final overlay v1.1 visual check remains open.

No Live promotion is inferred.

Receiving gate:
**HUB-CTRL reproduce candidate → browser/public review surface → Georg final UX review before shell replacement.**

## Current lead sequence

1. Persist this intake/recovery checkpoint.
2. Update Hub operational state from these candidates.
3. Rehome ToolBox r2 into its existing owner lane; promote only verified owner deltas.
4. Rehome World r2 into its existing owner lane; reconcile shared locomotion profiles from ToolBox rather than forking them.
5. Create direct Cloudflare Stage review surfaces before asking Georg for r2 human review.
6. Keep Hub UX candidate separate under HUB-CTRL; no shell Live promotion before its final human gate.
7. Blender MCP route pieces remain parallel intake until exact source/export pin arrives.

No new WorldBuilder, ToolBox, animation engine, Hub runtime or status database.
