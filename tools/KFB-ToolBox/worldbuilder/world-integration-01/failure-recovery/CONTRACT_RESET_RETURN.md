# RETURN · WORLD-R2-CONTRACT-RESET-01

Date: 2026-09-26  
Status: **CONTRACT RESET PASS · RUNTIME UNCHANGED · STAGE NOT STARTED**

## Result

The stale prose-regex assertion was replaced by a pure structured audit of the existing locomotion rows.

The audit now distinguishes:

- 13 source-backed semantic roles;
- `walk.fast` as the ToolBox playback variant;
- `backward.fast` as World consumer tuning;
- left/right `strafe.walk` rows as World consumer tuning.

The contract proves source-clip reuse and rejects missing roles, unlabelled variants, mismatched source clips and invented local variants. It does not parse the wording of the variant label.

## Surface Adapter contract

Added contract only; no implementation:

- WorldBuilder owns editable base height;
- OSM/Track provide bounded corridor constraints or offsets;
- one Surface Adapter resolves the final visible/support query;
- Race retains contact and vehicle-physics ownership;
- consumers may not recompose an independent final height;
- Travel Globe is not the world base; TinySkies/Travel remain presentation and selected camera/mobility donors.

## Changed files

- `wi1-locomotion-contract.mjs`
- `wi1-selftest.js` — selftest-only import/assertion replacement
- `test/world-integration-r2.contract.mjs`
- `test/world-integration-r2.static.mjs`
- `contracts/world-surface-adapter.v1.json`
- `contracts/WORLD_SURFACE_ADAPTER_CONTRACT.md`
- failure-recovery documentation and additive ToolBox changelog

No movement, actor, terrain, OSM presentation, edit-layer, camera, physics or ToolBox profile runtime owner changed.

## Evidence

- pure contract: **13/13 PASS**;
- static owner/closure: **24/24 PASS**;
- Hürth in real Chrome: **55/55 selftest PASS**;
- Cologne in real Chrome: **55/55 selftest PASS**;
- accepted WB2 regression: **34/34 PASS**;
- browser harness: **12/12 PASS**;
- page errors: **0**;
- failed source requests: **0**.

## Publication

No Stage package, Cloudflare publication, Hub review card or Live promotion was created.

## Next gate

Exactly one next gate: **WORLD-R2-STAGE-PREP-01** — package this unchanged recovered candidate for the existing KFB Stage path, repeat the exact browser sequence there, then request Georg visual/freeplay review.
