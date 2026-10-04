# SimBlood · Cell & Asset Coverage Matrix

Status: SEARCHABLE/FILTERABLE PRODUCTION TEMPLATE · 2026-09-18

This surface evolves Frank's compact multi-variant cell matrix into a production-oriented progressive-disclosure view.

## What it shows

For every current Reference-Wave 3 entity:
- entity name / ID
- entity kind
- family
- P0–P3 priority
- direct morphology/reference anchors
- dataset/source lanes
- currently available assets or POC representations
- explicit missing target slots

Top-level modes:
- Cells
- Morphology
- Inclusions
- Field states
- Findings
- Conditions

Filters:
- free text
- family
- priority
- coverage state
- only entries with missing assets

## Visual rule

The matrix must never hide production gaps.

A row can therefore be:
- current asset(s) present
- reference/source-only
- completely missing
- target reached

Empty slots stay visible instead of being filled by invented morphology.

## Current data

`coverage.v0.2.json`

Built from:
- `CELL_TAXONOMY_v0.2.json`
- `CELL_REFERENCE_ANCHORS_v0.1.json`
- currently registered POC WBC candidates
- current procedural RBC/platelet baselines
- current Normal/IDA/TMA technical recipes

POC/procedural representations count as “present” for coverage visibility but are **not** equivalent to medical or production approval.

## Public mirror

`https://kayfabizarro.pages.dev/kfb-hub/sim-blood-cell-atlas/`

## Next

1. connect Source Registry v0.2 coverage badges
2. add verified thumbnail/reference previews where rights and hotlinking permit
3. add approved true-cutout thumbnails after extraction
4. add medical-review state and canonical-anchor marker
5. keep this same surface usable for production planning and later learner-facing Atlas mode


## Reference previews

Direct external previews are now shown where a stable source image URL is available.

Current rule:
- ASH Image Bank item URLs with a numeric image ID are rendered through ASH's external image endpoint.
- Generic atlas/category pages (for example broad CellaVision/ICSH pages) remain link cards until an entity-specific preview is mapped.
- Reference imagery is not copied into this repository by this UI.
- Broken external images fall back to an explicit "Bild extern" tile instead of disappearing.
