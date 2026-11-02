# RETURN — ProCraft / Procreate brush interchange research R1

Date: 2026-11-02
Status: SOURCE-AUDITED RESEARCH · COMMITTED TO REVIEW BRANCH · NOT ADOPTED
Owner: existing KFB Asset Registry / Asset Librarian research lane (not a new brush engine or asset-storage owner)
Repo: `georg-doc/kayfabizarro`
Branch: `research/procraft-brush-interoperability-2026-11-02`
Base: `main` at `7e1c4ab0f143b2f1c0f33017eb473574f20190c9`
Initial research checkpoint: `0561816768114ec153ef9d364d522483e49eaf75`
PR: none at this checkpoint; no merge authorized.

## Outcome

Source-verified evidence that the external ProCraft Android beta includes `.brush` and `.brushset` parsing, import and export, plus a separate `.procreate` document reader/writer. Fidelity of Georg's own brushes is NOT established. Stock-texture substitution and an open bug report make a controlled real-brush comparison necessary.

Research and additive decision record:
`tools/asset_registry/research/PROCRAFT_PROCREATE_BRUSH_INTEROPERABILITY_2026-11-02.md`

## Files / scope

- New source audit, risks, links and five-brush test specification.
- New Return (this file).
- No changes to tools/asset_registry source, Asset Librarian, UI/Site, Stage, KFB Hub router, registry/catalog, personal/commercial brushes, deployment, or runtime.
- Existing Registry and Asset Librarian SSOT and ownership unchanged.

## Actual verification / evidence

- 3 externally inspectable source files: `brushfile.rs`, `brush_files.rs`, `native.rs`.
- External README read: 1.
- External GitHub reported issue inspected: #13 (open, 2026-11-01).
- KFB canonical Registry/Librarian README, prior Asset Librarian recovery, KFB workflow and chat router read.
- Initial GitHub checkpoint was written and read back from the exact research branch; contents/sections verified.
- App builds: 0; unit/integration test runs: 0; real original brushes imported: 0; image/screenshot comparisons: 0; iPad round-trips: 0; public Site/Cloudflare verification: 0.
- All compatibility claims are SOURCE-ONLY, not functional acceptance.

## Unresolved / deferred

- Shape/grain substitutions and fidelity in actual sample brushsets.
- Pressure, tilt and Wet Mix rendering parity.
- `.brushlibrary` handling.
- Mac/Windows/Linux availability and actual builds.
- Round-trip reproducibility and rights of any redistributed sample brushes.

## One next gate

On explicit future test authorization and with rights-cleared sample copies plus Android target, run the five-brush controlled import/export + same-stroke fidelity comparison from the source audit. Do not start a new runtime, Site or Stage for this research.
