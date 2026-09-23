# KFB ToolBox v0.5 Export Intake · 2026-09-23

Status: **SOURCE RECEIVED · REVIEWED INTAKE · LEAN DELTA REQUIRED BEFORE PROMOTION**

Owner remains:
`georg-doc/kayfabizarro/tools/KFB-ToolBox/`

Source package:
`tools/KFB-ToolBox/_inbox/KFB ToolBox v0.5.zip`

Git blob:
`de350e496403f16b7569e5fef0beb67a7de52fc4`

Compressed size:
`19,353,278 B`

A matching-size unpacked Dropbox copy was inspected read-only. Same byte size does not by itself prove byte identity.

## Verdict

Do **not** promote the full ZIP as the new ToolBox implementation tree.

Treat it as intake/provenance.

The current useful runtime appears concentrated in `stage-first/`, while the package carries substantial historical duplication.

Measured unpacked payload:

- total files: ~600
- total payload: ~31.17 MB
- `_inbox/`: ~15.47 MB
- `_handover/`: ~7.02 MB
- `stage-first/`: ~3.93 MB
- `site/`: ~3.17 MB

The package therefore contains far more history/intake material than current runtime source.

Examples of avoidable duplicate payload include older nested ZIPs, repeated standalone HTMLs, repeated source-module copies and historical QA/handover material.

## Important source-description problem

The export is not sufficiently self-describing as a current v0.5 delta.

Its top-level manifest/changelog primarily describe the 2026-09-15 source-closure line.

Inside `stage-first/`, the retained `SOURCE_MAP.json` is older than some current files.

Example:

- recorded `KFB ToolBox Stage-First v1.dc.html`: 664,180 B
- current export file: 673,039 B

and:

- recorded `KFB FrankenStein Studio v18.dc.html`: 637,638 B
- current export file: 642,417 B

The current QA HTML also changed in size.

Therefore later edits exist, but the export does not clearly state which exact files changed or why.

Do not infer the Sonnet v0.5 delta from timestamps or filenames.

## Recommended lean source package

Request one additional **delta/partial export**, not another full historical bundle.

Target contents:

1. current `stage-first/src/` only;
2. current `stage-first/profiles/`;
3. current minimal runtime QA only where it directly proves the current candidate;
4. `CURRENT_STATE.md`;
5. `RETURN.md`;
6. additive `CHANGELOG.md`;
7. fresh `SOURCE_MANIFEST.json` generated after all edits;
8. `DELTA_FROM_STAGE_FIRST_P0.md` listing every current changed file against the accepted Stage-First baseline;
9. `CAR_EYERIG_DELTA.md` for the new car experiment.

Explicitly exclude:

- `_inbox/`;
- historical `_handover/` material not required by the current runtime;
- `_archive/`;
- nested source ZIPs;
- duplicate standalone HTML history;
- old screenshots/evidence not needed by the current candidate;
- copied canonical assets already owned elsewhere;
- copied/second EyeRig implementations.

Expected order of magnitude:
**roughly the current 4 MB Stage-First tree, not a 19 MB historical bundle.**

## Car / EyeRig finding

The active source tree contains the existing:

`petstudio-v9/studio-v12/pet-eye-rig.v6.js`

No clean, separate current Vehicle/Car EyeRig adapter was identified in the v0.5 source tree during intake inspection.

No dedicated `headlight` / vehicle-eye module was found.

This suggests the new car-eye experiment is currently embedded in a UI/HTML composition or otherwise not yet separated into a reusable consumer adapter.

### Current canonical owner

Eye ownership remains:

**KFB ToolBox / EyeRig v6**

Do not create a second eye runtime for cars.

Current EyeRig v6 already exposes adjustable anchor geometry:

- `anchor.dx` — left/right eye spacing
- `anchor.dy`
- `anchor.ring`
- `anchor.track`
- `setAnchor(patch)`
- public `eyeFrame()`

So a car can legitimately use the same EyeRig semantics with a different measured host/spacing profile.

The missing seam is a proper static/vehicle face host, not another eye system.

Existing KCC evidence already points in this direction:
static/object hosts should feed the current EyeRig v6 through a FaceHost-style adapter rather than copying eyes.

### Required car delta note

`CAR_EYERIG_DELTA.md` should state:

- exact car asset/source;
- exact mesh or proxy used as `body` / face host;
- front/facing axis;
- measured host bounds;
- intended eye centerline;
- measured eye separation;
- exact EyeRig module imported;
- EyeRig v6 anchor overrides;
- whether original/source eyes or headlights are hidden/preserved;
- known visual defect;
- screenshot/reference;
- no second eye owner.

If the current implementation does not use EyeRig v6, classify it as:
`EXPERIMENTAL_REJECTED_AS_OWNER`
and retain only useful placement measurements.

## Promotion path

After the lean delta arrives:

1. compare it against the accepted Stage-First baseline;
2. rehome only actual current runtime deltas;
3. preserve canonical EyeRig/Face/Motion owners;
4. produce one zero-install browser candidate;
5. test the connected ToolBox authoring flow;
6. only then consider this the next ToolBox implementation checkpoint.

No Work/WSA is required for this intake or rehome.

## Exactly one next gate

**TB05-DELTA-01 · receive and verify the lean current-source delta.**

Do not promote the 19 MB historical bundle wholesale.
