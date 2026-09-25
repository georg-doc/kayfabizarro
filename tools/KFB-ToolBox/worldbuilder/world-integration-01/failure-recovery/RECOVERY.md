# RECOVERY · WORLD-INTEGRATION-r2

## Source

- repo: `georg-doc/kayfabizarro`
- PR: #190
- branch: `chatgpt-web/worldbuilder-wb2-terrain-sculpt-2026-09-23`
- frozen candidate code head: `204afd6dbb1285f8cd77807af0db5fdd6e75308d`
- accepted WB2 baseline owner: `ec52eb746be8c1a0e6f3f3d62857ed4b3121b284`
- canonical ToolBox locomotion profile pin consumed by World: `5dcf34bcdf9d87445e927c98f60d41adae72f00e`

## Current status

**ARCHIVED_FAILED_CANDIDATE for this browser gate.**

Static/source owner checks pass.
The browser candidate boots Hürth, loads sources, binds the shared ToolBox profile and reaches the in-world selftest.
The run then stops at a stale selftest assertion about how playback variants must be labelled.

No PageError and no failed source request were reported in the final diagnostic.

## Stop reason

The same browser gate used:
- initial failed run;
- repair pass 1;
- repair pass 2.

Per KFB stop rule: no further repair in this gate.

## Preserve

Do not delete or revert:
- the re-homed World r2 source;
- Hürth / Alstädten / Cologne fixtures;
- ToolBox profile consumer seam;
- source-backed Running_B sprint;
- FACADE_RULE / FACE_NORMALS / host-support work;
- WB2 accepted terrain/edit owners.

## Do not claim

- no World r2 browser PASS;
- no Stage PASS;
- no public PASS;
- no Georg r2 acceptance.

## Next gate

`WORLD-R2-CONTRACT-RESET-01`:
test-only contract reconciliation between World selftest semantics and ToolBox profile semantics before any runtime modification.
