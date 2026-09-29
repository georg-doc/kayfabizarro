# KFB Animation Library V1 · Claude Design

Status: READY FOR CLAUDE DESIGN · MOTION LIBRARY V3 / 204 CLIPS PINNED
Date: 2026-09-28  
Owner: KFB ToolBox / Animation Studio  

## Goal

Design one coherent, Mixamo-like **Character × Motion Library** inside the existing KFB ToolBox visual language. This is a bounded interaction/design prototype, not a new motion registry, retargeting pipeline, runtime owner, or public download portal.

## Read in this order

1. `CLAUDE_DESIGN_BRIEF_ANIMATION_LIBRARY_V1_2026-09-28.md`
2. `ANIMATION_PROFILE_EXAMPLE.json`
3. `MOTION_LIBRARY_V3_AND_LIBRARIAN_ADDENDUM.md`
4. GitHub current versions of the pinned sources named in the brief
5. The current ToolBox Production-03 `CURRENT_STATE.md`, `LESSONS_SHADOWS.md`, and `PROJECT_RULES.md`

GitHub current state overrides this snapshot when a source path has advanced.

## Deliverable

One closed-package Claude Design artifact that proves:

- character selection;
- searchable/filterable animated motion cards;
- a large Studio/Terrain preview;
- safe editorial renaming without altering source IDs;
- export inclusion/exclusion;
- Resident role/signature-move assignment;
- JSON export/import roundtrip.
- private/local FBX drop-zone quick preview and a bounded promotion handoff.
- all 204 canonical Motion Library clips discovered from the manifest, including the 25 Intake-03 additions;
- the same 204 clips discoverable through the existing Asset Librarian without duplicating the catalog.

Do not upload or redistribute raw Mixamo FBX files. Use the baked KFB GLB libraries and catalog already present in GitHub.

Pinned intake source: PR #275, head `4fa082714c7200f6926008a1cd0b34db8df4dbad`. It is stacked on Motion Library PR #213 and is not merged. Read `RETURN_INTAKE_03.md` before treating release markers, paired motions or seated clips as ordinary single-actor loops.

The Drop Zone defaults to **LOCAL ONLY**: raw FBX bytes remain in browser memory and are never sent to public GitHub or included in the exported ToolBox package.

## Stop

Stop after the visual interaction prototype, evidence, source manifest, Return, and fresh-chat handoff are exported. Do not build the GPT-Site persistence layer or production runtime in this slice.
