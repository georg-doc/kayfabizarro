# KFB ToolBox · Hybrid Surface v2 · FAILURE RECOVERY · START HERE

Status: **FROZEN FAILED CANDIDATE · DO NOT REPAIR IN PLACE**  
Date: 2026-09-22  
Owner: **KFB ToolBox / material-surface compatibility lab**  
Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/toolbox-hybrid-surface-v2-2026-09-22`  
Draft PR: **#166**  
Frozen runtime/code head: `7cbad52b55fb9ec2300aa4b25ca92b0997ce448a`

## Why this is frozen

The same browser-proof gate failed twice after two distinct repair passes:

> `visible actor shaders compiled`

Both Run 3 and Run 4 reached a ready WebGL runtime and passed donor, scale, texture and source-material preservation checks before stopping at the same compile census:

- actor decorated materials: **64**
- materials counted effectively visible by the proof: **63**
- shader programs observed compiled: **58**
- effectively visible compiled: **58**

The second repair changed the visibility census to include ancestor visibility. The same 58/63 discrepancy remained. Per KFB stop/recovery protocol, **no third repair is allowed on this foundation in this slice**.

## What is not being claimed

- no v2 public Stage;
- no Georg visual acceptance;
- no seam acceptance;
- no clay/grain acceptance;
- no OSM/Race/environment integration;
- no proof that the shader itself is visually broken.

The failure is currently a **browser-proof / shader-compile census gate**. The identity of the five non-observed programs is not yet instrumented.

## Proven working parts before the stop

Run 4 proved before failure:
- exact World Atlas Dungeon donor boots with 69 placements / 71 source meshes;
- exact five actor donors boot;
- all exact head proxies resolve;
- measured head-size calibration works;
- Legacy remains shorter than Medium;
- Black Knight remains taller than Medium;
- one shared texture is used across actors + environment;
- procedural 3D grain is present without a second texture;
- base maps/colors are retained;
- base roughness/metalness values are retained rather than globally clamped;
- environment shader programs compile.

Read in order:
1. `SOURCE_SNAPSHOT.md`
2. `ATTEMPT_LOG.md`
3. `POSTMORTEM.md`
4. `TEST_REPORT.md`
5. `SALVAGE_MAP.md`
6. `KNOWN_ISSUES.md`
7. `NEXT_GATE.md`
8. `RECOVERY.md`
9. `EXPORT_MANIFEST.json`

## Exactly one next gate

**Hybrid v2 actor material compile census diagnostic.**

Do not change the surface look. Instrument the frozen candidate to identify the exact five decorated actor materials whose `onBeforeCompile` marker is not observed, then source-isolate those mesh/material records and classify whether each is actually rendered, intentionally dormant/variant-hidden, frustum-culled, or otherwise skipped.

Only after that diagnostic gate passes may a new implementation slice decide whether the proof or shader needs changing.
