# KFB Eye Actor Studio v0 · RETURN

**Date:** 2026-09-21  
**Status:** TECHNICAL BROWSER PASS · PUBLIC BLOCKED · HUMAN VISUAL GATE OPEN  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/mobile-preview-chatterbox-legacy-pet-2026-09-21`  
**Draft PR:** #158  
**Implementation head:** `f6fcdfbf6ec086759b322d96c7a312dabc991c8a`  
**Tested head:** `2a79d398fad090aabf56d5a5d17f37fd97fa4df7`

## Outcome

A first **Eye Actor Studio** candidate now exists as an additive ToolBox authoring surface.

It treats:
**eyeballs + four lids + pupils + brows + shading + emanata**
as one coordinated performance system while preserving existing EyeRig ownership.

Motto:
**Eye — including lids & brows — as actors.**

## Reused owners

Unchanged:
- EyeRig v6 = 3D eye behavior owner;
- BrowRig v2 = brow donor;
- current EyeRig Batch = profile/batch lane;
- shared eye protocol = renderer-neutral semantics;
- FrankenStein/ToolBox = actor/face composition;
- consumers = body animation, combat, vehicle, physics, camera and gameplay state.

The Studio does not create a second EyeRig or profile store.

## EAS-0 implemented

- exact EyeRig v6 donor mode is the default;
- optional volumetric Clay-Lid adapter over the same four lid meshes;
- visible rounded outer volume + hard inner occlusion rim;
- thickness control;
- candidate concave/convex `curve` control;
- higher-level Eye Actor pose shelf:
  - skeptical;
  - aim left/right;
  - tired;
  - angry;
  - surprised;
- BrowRig v2 integration;
- `face > body > main` material resolver;
- softer off-white eye shading under shared scene lights;
- optional under-eye shadow preview;
- eyeFrame-anchored 3D sweat drop;
- eyeFrame-anchored soot-dot cluster;
- responsive desktop/mobile Studio;
- Natural / Zones debug.

## Tests

Authoritative run:
`35557143481`

- **20/20 static PASS**
- **5/5 syntax PASS**
- **24/24 desktop/mobile WebGL PASS**
- failed resources: **0**
- browser/page errors: **0**

Artifact:
`10621181776`

Digest:
`sha256:8e88d042153bcc8b9eb9a77bcb1b2a69a7e3c66bd725aad221792dc795f9795e`

The preceding run `35557045766` failed only because the mobile test read one-frame-stale debug state. The repair changed the test wait condition only.

## Visual state

The screenshots visibly distinguish:
- thin EyeRig v6 donor shells;
- thicker Clay Lid candidate.

Current positive evidence:
- four separate Clay lids;
- skeptical asymmetry;
- clear upper-lid volume;
- visible hard inner edge;
- pupil stays behind rim;
- 3D sweat emanata reads as a modeled cartoon object;
- sclera are shaded/off-white rather than self-lit white.

Open visual questions:
- lower lids are still rim-like;
- current technical pupil clearance is small;
- BrowRig thickness may need Clay-mode coordination;
- eye-ring/shadow needs its own visual shader proof.

## Planned host expansion

After visual acceptance:
1. existing Rig_Medium / Rig_Large Batch profiles;
2. LegacyFaceHost;
3. toaster/radio props with measured anchors;
4. vehicle front/headlight + rear/trunk presets;
5. plants/living props.

No guessed anchor is accepted when a receiving host has a measured source.

## Future Eye FX

Prepared design line, not implemented:
- spiral/dizzy;
- heart eyes;
- oversized cartoon pupils;
- authored catchlight geometry;
- final under-eye shader;
- motion-class / combat pose trigger adapters.

Special eye geometry may never pierce lids/brows.

## Colour canon boundary

Georg wants KayKit palette logic plus the current Cologne world/look work to become the stronger colour direction over older washed-out KFB pastels.

The exact repo source behind the spoken label “Cologne Wastefax” is unresolved. No guessed palette is promoted. The later bridge must use the existing World Color/Lighting Cohesion route after a precise source pin exists.

## Stage

Intended:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-actor-studio/`

**NOT PUBLIC_VERIFIED.**

Cloudflare Pages reports a build failure for the stacked PR. No substitute human-test URL is offered.

## Exactly one next gate

**EAS-PUB-1 · publication-only recovery.**

Do not change EyeRig/Clay geometry during this gate. Publish the already-proven source to the exact Cloudflare route, open it, then ask Georg:

**Do the Clay Lids read as expressive clay/cartoon forms with real volume while preserving a clean hard occlusion edge against the eyeball?**
