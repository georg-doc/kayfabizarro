# G1 R2 · Test Report · 2026-10-10

Status: **13/13 source and static assertions PASS. Visual-isolation gate OPEN.**

Existing source on sync/lab-rkit-2026-10-09 and original Dropbox measurements are used, not fabricated assets.

## Verified assertions

1. The existing originals.ts viewer maps port and backyard to the correct StreakByte FBX files.
2. The viewer captures native bbox sizes before its 60-unit display normalization.
3. Its current setCamera does not hide non-target objects, so true isolation needs a temporary local diagnostic camera/focus edit.
4. The existing shoot.mjs accepts camera presets.
5. The same helper captures page evaluations into JSON logs.
6. The G1 runbook reuses this viewer and specifies rollback.
7. All eight requested view presets are described.
8. Shared Port texture on the originals invalidates a native material comparison.
9. Town target equals 40 MC × 6.4 = 256 Lab units.
10. Port values match original measurements: 1,585 tris, six underside minima, depth 0.434 W.
11. Backyard values match original measurements: 700 tris, 22 minima, depth 0.506 W.
12. G1 R2 comparative evidence explicitly declares visual isolation incomplete.
13. The evidence files contain no paid FBX content or reusable private download link.

Static checks: 13 PASS / 0 FAIL. Prior inventory remains 18 PASS / 0 FAIL.

## Visible evidence and blockers

Existing original-Lab run orig.json was ready and captured all, ice, pond, beach and forest, but not isolated Port versus Backyard. This G1 continuation produced **0/8 new source-only images**, **0/2 native K2 bbox confirmations**, and **0** independent visual reviews. Local rendering was blocked because the current execution container cannot resolve external file hosts; the existing original Lab was not remotely accessible. Neither the Local Lab camera edit nor the screenshot recipe has been executed. No Georg pick or goldenRef was assigned.

## Exactly one next gate

In the existing local Island Worldbuilder Lab, temporarily use G1_TOWN_SOURCE_ISOLATION_RUNBOOK_R2.md to isolate Port and Backyard individually, capture four views per object, read both native bounding boxes from window.__kfb.info, restore the source, and enter proof into G1 Recovery and candidates. Do not deploy a second viewer or publish purchased models.
