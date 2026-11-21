# ProCraft ↔ Procreate brush interoperability — source audit R1

Date: 2026-11-02
Status: RESEARCH / SOURCE-VERIFIED CANDIDATE · NOT BRUSH-TESTED · NOT ADOPTED
Research owner: KFB Asset Registry / Asset Librarian, existing read-only discovery and candidate-handoff lane
Repo / branch: `georg-doc/kayfabizarro` · `research/procraft-brush-interoperability-2026-11-02`
Product outcome: preserve an actionable evaluation of importing Georg's existing Procreate brush collection into ProCraft, especially a later desktop workflow.
Scope: documentation and bounded follow-up test only; NO runtime, registry schema, Site, Stage, proprietary source upload or asset-license changes.

## Current KFB authority and constraints

- Current KFB owner SSOT: `tools/asset_registry/README.md`; Librarian consumer: `tools/asset_registry/librarian/README.md`.
- Current Asset Librarian is a read-only consumer of asset registries, with browser-local intake preparation and private-source metadata handling. Do not turn it into a brush renderer or second library.
- `skills/chat/ASSET_LIBRARIAN_PRIVATE_AUDIO_INTAKE_PREP_2026-10-08.md` covers a generic private asset intake route (images/textures/ZIPs); that is *not* evidence that a Procreate brush format is supported by KFB.
- Existing Librarian recovery: `tools/asset_registry/librarian/POSTMORTEM_CHAT_BREAK_2026-09-15.md`; newer README v1.8 takes precedence over historical v1.7 status.
- KFB source assets / artworks and licensed brushes remain with their actual owners. This research adds neither files nor asset metadata.

## External donor, isolated source-code evidence

External repo: https://github.com/artcraft-android/procraft-android

Inspected external source at default-branch code-search revision `4c0cd21691694f4d67687c1220cac2d187456920` (code reading; NOT an app install, visual isolation or actual round-trip test):

1. `crates/engine/src/brushfile.rs`:
   https://github.com/artcraft-android/procraft-android/blob/4c0cd21691694f4d67687c1220cac2d187456920/crates/engine/src/brushfile.rs
   - Parses and writes a `.brush` ZIP with `Brush.archive`, optional `QuickLook/Thumbnail.png`, `Shape.png`, `Grain.png` and mapped brush parameters.
   - Parses and writes `.brushset` ZIPs with `brushset.plist` and nested brushes.
   - The code includes parameter mappings for pressure, taper, spacing, shape, grain, rendering, wet mix, colour dynamics, tilt, curves and more.
2. `apps/procraft-android/src/brush_files.rs`:
   https://github.com/artcraft-android/procraft-android/blob/4c0cd21691694f4d67687c1220cac2d187456920/apps/procraft-android/src/brush_files.rs
   - Contains `import_brushes`, `brush_as_file` and `brush_set_as_file` conversions.
   - If the brush file *references* an application-stock texture not embedded within the file, import uses a nearest ProCraft stock image instead. This is a fidelity risk, not exact brush equivalence.
3. `crates/engine/src/native.rs`:
   https://github.com/artcraft-android/procraft-android/blob/4c0cd21691694f4d67687c1220cac2d187456920/crates/engine/src/native.rs
   - Contains `.procreate` document package reader/writer. This is a different seam from brush-file interchange.
4. Project README:
   https://github.com/artcraft-android/procraft-android/blob/main/README.md
   - Android-native application, Rust engine and wgpu rendering; project currently labelled beta. Windows/macOS/Linux frontend plans are developer intent, not released/QA-proven desktop compatibility.

## Known issue / fidelity risks

- External open issue #13, created 2026-11-01, reports some imported Procreate brushes lose settings and textures:
  https://github.com/artcraft-android/procraft-android/issues/13
- A compatible file parser does **not** prove identical rendering, Apple Pencil pressure/tilt response, round-trip consistency or desktop readiness.
- Import of `.brushlibrary` has not been established from inspected source.
- No Georg-origin `.brush`, `.brushset` or `.procreate` samples were provided or exercised in this audit.
- Do not call ProCraft a 1:1 substitute on this evidence. Do not promise unrestricted redistribution of commercial brush packs.

## Proposed smallest meaningful test (deferred)

Using *copies* of five rights-cleared original Procreate brushes, compare against Procreate-on-iPad golden strokes:

| Golden sample | Stress points |
| --- | --- |
| Fineliner | size/opacity pressure, taper, stabilization, edges |
| Pencil | grain, tilt, pressure curve, layering |
| Dry texture / charcoal | custom shape and grain source, spacing/jitter |
| Watercolour | wet mix, glaze, accumulation, opacity |
| Complex specialty brush | multiple dynamics, variation and assets |

For each: record original file structure and embedded/stock images; import into ProCraft Android; list resolved and substituted parameters/textures; capture the **same path** at fixed speed, pressure and tilt (device differences documented); export brush back, import to genuine Procreate and repeat; calculate file and image hashes; record visual diffs and author judgement. Do **not** declare pixel-perfect parity across different devices without controlled input and color management.

Acceptance for the future experiment:
- 5/5 samples correctly *ingested* and identified (or explicit, individual FAILs);
- each sample's substitution/loss report and before/after screenshots exist;
- at least one successful ProCraft → Procreate brush round-trip with controls/images compared;
- any portability/deployment claim separately validated on the actual target OS.

Until then: CANDIDATE / NO ADOPTION.

## Decision, additive log

- 2026-11-02 — Georg requested GitHub persistence of ProCraft's relevance for his Procreate brush collection.
- Recorded real `.brush` and `.brushset` import/export code and separate `.procreate` archive code. Important correction to initial README-only uncertainty: brush-file support **is present in source**, but fidelity remains unverified.
- Explicitly retained existing KFB Asset Registry / Asset Librarian authority. No new owner, UI, runtime, Stage or public publishing route.
- One next gate: controlled five-brush import / round-trip fidelity test when Georg supplies approved sample copies and an actual Android target; desktop gate only after a working desktop build exists.
