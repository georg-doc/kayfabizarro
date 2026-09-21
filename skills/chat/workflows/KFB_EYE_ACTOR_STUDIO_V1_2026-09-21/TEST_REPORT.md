# KFB Eye Actor Studio v1 · TEST REPORT

**Date:** 2026-09-21  
**Tested head:** `64d16e754a3b149efa64f2b7f3045d42f32e4bca`  
**Workflow run:** `35591372998`  
**Job:** `106306286669`

## Static contracts

**51 / 51 PASS**

Covers:
- exact EyeRig v6 / BrowRig v2 / EyeOval v1 donors;
- Eye Cluster 1–4;
- asymmetric / frog / single / three / four-eye fixtures;
- per-eye XYZ, W/H/D, Pitch/Yaw/Roll and quaternion export;
- Clay hard-inner-rim contract;
- source-first host catalog/runtime;
- reuse of Legacy assembly/FaceHost and EyeRig Batch catalogs;
- PrototypePete default;
- Mannequin Medium/Large, Skeleton, Jack/pumpkin, Orc, Pencil, Eraser host entries;
- Rabbit Ear donor reuse, separate inner zone, measured FrizzleBob material zones and preserved ears.v2 dangle;
- interactive KFB 3D CartoonStyle viewer with hidden LLM/WSA brief.

## Syntax

**10 / 10 PASS**

Includes Eye Cluster, Clay lids, pose shelf, host catalog/runtime, static FaceHost, Legacy owner adapters, Rabbit Ear style adapter and Studio app.

## Desktop + mobile WebGL

**53 / 53 PASS**

Viewports:
- desktop 1440×900
- mobile 390×844

Eye proofs on both:
- PrototypePete is the default source host;
- source-only mode is first;
- FaceHost reports OK;
- Eye Cluster pair boots;
- asymmetric sizes 0.86 / 1.26;
- frog yaw −76° / +76°;
- 3-eye fixture;
- 4-eye fixture;
- selected-eye Aim affects only selected eye;
- exact EyeRig v6 donor mode;
- exact ears.v2 donor;
- Cartoon Ear candidate with 2 outer meshes and 2 inner zones;
- Rabbit Ear behavior owner remains `kfb.ears/0.2`;
- outer/inner colors remain distinct;
- 0 failed resources;
- 0 page/console errors.

Additional desktop host proofs:
- Mannequin Medium / Rig_Medium;
- GothGirl from existing Medium owner catalog;
- Orc Brute from accepted Large profiles;
- Legacy Skeleton Warrior;
- Legacy Jack / pumpkin;
- Legacy Dungeon modular source;
- body switch to Knight;
- alternate Rogue Head C;
- Pencil B short prop;
- Rubber / Eraser prop.

Interactive CartoonStyle viewer:
- HTTP 200;
- exact Tiny Treats toaster donor first;
- DO rounded-panel sample;
- DON'T detail-heavy landmark sample;
- 0 failed resources / page errors.

## Rabbit Ear visual repair history

### Candidate 0
Technical checks were green, but the inner-ear zone reused a scaled copy of the entire donor ear mesh and visibly intersected/tore at the root.

### Repair 1
The inner zone became an independent rounded extruded panel. This fixed the overlap, but the donor outer topology still read faceted/torn near the tip.

### Repair 2
No third topology patch. The exact `ears.v2` donor still owns:
- donor measurement;
- pivot;
- host-relative placement/scale;
- Dangle/feder update.

Only the visible candidate shell is rebuilt from the donor-measured width/height/depth as a continuous rounded extruded cartoon form. The inner ear remains a separate rounded panel.

Assistant visual inspection:
**CANDIDATE PASS** — clean continuous outer silhouette, broad visible rim, separate warm inner zone. This is not Georg acceptance.

## Evidence

Artifact ID: `10634917298`  
Digest: `sha256:18f9de169f5b3c6a3c6863a6e5de2b96d6506ef082e9ca4e30e4c93e5fdcc81b`

Relevant screenshots:
- desktop/mobile PrototypePete source;
- desktop/mobile exact EyeRig donor;
- desktop/mobile Frog;
- desktop/mobile exact ears.v2 donor;
- desktop/mobile Cartoon Ear v1;
- desktop Eraser source;
- CartoonStyle DON'T landmark.

## Public Stage

Intended:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-actor-studio/`

**PUBLIC_VERIFIED: NO.**

The GPT/sandbox workbench remains the rapid iteration surface; Cloudflare is not used as a substitute claim.

## Next gate

**EAS1-VIS-2 · Georg visual review of the current GPT Studio: host picker + Eye Cluster + Clay lids + Rabbit Ear A/B.**
