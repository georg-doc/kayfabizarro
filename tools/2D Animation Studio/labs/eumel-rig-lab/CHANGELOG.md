# Eumel Rig Lab · Changelog

Additive history.

## 2026-09-18 · r0 · Provisional donor

- measured/traced reconstruction from earlier DocCheck logo reference;
- useful for rig concept only;
- explicitly not promoted over incoming AD source.

## 2026-09-18 · r1 · Native AD source retarget

- pinned byte-identical `_Dr_Vorlage.ai`;
- extracted PDF-compatible Illustrator Bézier geometry without retracing;
- split source paths into reusable components while preserving source transforms and stroke families;
- preserved separate eye and pupil source groups;
- preserved nested stethoscope seam;
- created candidate semantic aliases without rewriting source IDs;
- created separate derived rig-pivot contract;
- built browser Rig Lab with neutral, idle, look, hampelmann and hop presets;
- added PDF-source vs SVG-extraction comparison surface and isolated component atlas;
- browser/runtime visual acceptance remains pending.


## 2026-09-18 · r2 · Neutral bind / explicit bones / EyeRig protocol

- Georg browser feedback accepted as defect evidence: leg swing detached, source stance was too asymmetric for reusable locomotion, atlas isolation was incomplete;
- derived a neutral bind from the exact source leg geometry using source visual bboxes + major-axis/PCA correction;
- body is horizontally normalized to page center while source pose remains switchable for QA;
- leg-A and leg-B now use explicit hip bones with fixed attachment pivots;
- optional clipped lower-leg proxy supplies a small knee bend while the source path stays immutable;
- leg stretch/squash operates on bone wrappers only;
- added neutral-based procedural walk;
- added shared EyeRig-v1 semantic adapter compatible with the existing EyeRig-v6 public control API;
- added gaze sliders, pointer follow, blink trigger and eye-life controls;
- large foreground source pair classified as hat/headwear and given its own follow-through bone;
- component atlas now computes transformed root-coordinate bboxes before fitting isolated cards;
- browser retest pending.
