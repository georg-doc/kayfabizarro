# KFB Eye Actor Studio v0 · TEST REPORT

**Date:** 2026-09-21  
**Implementation head:** `f6fcdfbf6ec086759b322d96c7a312dabc991c8a`  
**Authoritative tested head:** `2a79d398fad090aabf56d5a5d17f37fd97fa4df7`

## First run / repair history

Run `35557045766`:
- 20/20 static PASS;
- 5/5 syntax PASS;
- desktop browser path passed;
- mobile failed at `four clay lids` because the test read the prior published debug object before the next animation frame.

The failure was **test observability**, not geometry/runtime behavior.

Repair commit:
`2a79d398fad090aabf56d5a5d17f37fd97fa4df7`.

Repair changed only the browser wait condition. It now waits for the published debug state itself to report:
- mode = clay;
- clayLidCount = 4.

No model/runtime geometry changed.

## Authoritative run

Run:
`35557143481`

Job:
`106202863950`

Static:
**20 / 20 PASS**

Syntax:
**5 / 5 PASS**

Desktop + mobile WebGL:
**24 / 24 PASS**

Viewports:
- 1440 × 900;
- 390 × 844.

Both viewports prove:
- HTTP 200;
- exact EyeRig v6 donor ready first;
- donor has 4 lids;
- Clay mode has 4 Clay lids;
- positive pupil clearance;
- skeptical pose creates asymmetric lid rotation;
- body fallback resolver;
- main fallback resolver;
- 3D sweat state;
- 0 failed resources;
- 0 page/console errors.

Measured pupil-to-inner-rim clearance:
`0.00232960000991822`.

## Artifact

ID:
`10621181776`

Digest:
`sha256:8e88d042153bcc8b9eb9a77bcb1b2a69a7e3c66bd725aad221792dc795f9795e`

Files:
- browser JSON;
- desktop donor;
- desktop Clay/Skeptical;
- mobile donor;
- mobile Clay/Skeptical.

## Visual evidence status

Assistant inspection only:
- Clay upper lids visibly have volume;
- hard inner rim is visible;
- skeptical asymmetry reads;
- sweat drop reads as authored 3D emanata;
- sclera participate in lighting and are no longer pure white;
- lower lids remain visually more rim-like than upper lids.

No Georg acceptance is claimed.

## Publication

Intended Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-actor-studio/`

PR #158 Cloudflare Pages build:
**FAILED / NOT PUBLIC_VERIFIED**.

## Next gate

**EAS-PUB-1 · publication-only recovery.**
