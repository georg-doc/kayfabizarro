# RETURN · WB-ZONE-SEAM-01 · 2026-09-27

Status: **ARCHIVED_FAILED_CANDIDATE · RECOVERY COMPLETE**

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/wb-zone-seam-01-2026-09-27`
- Draft PR: **#252**
- stacked base: PR #190 @ `58028b07d7618926c40ffaec3bd4053dc88c0efd`
- frozen implementation head before recovery: `2224d95d15fabb99a6a64f77ec863d37f9134fd3`
- owner: existing WorldBuilder / OSM City Lab seam
- Stage: **none**
- Human gate: **none**
- merge/live: **not authorized**

## Outcome retained

The candidate demonstrates the intended ownership architecture:
- baked Cologne World Zone ref enters existing WB2;
- WB2 stores manifest ref + transform;
- bake owns geography/support;
- existing presenter remains presenter;
- protected landmarks remain separate;
- LOOK-TORSION is consumed by the existing Elastic owner;
- no Track conflict masking without a mounted Track socket.

It is **not integration-PASS** because exact frozen-crop parity fails before the World/browser regression.

## Actual tests

Three CI runs reached the same first gate:
- 36291539816 → 368 vs 369;
- 36291711090 → 370 vs 369;
- 36291859889 → 370 vs 369.

In every run the first 3 bake identity/storage assertions passed; remaining seam assertions and all static/browser regression steps were not reached.

## Unresolved

Exact historical crop-selection semantics for one boundary building are not recoverable from the surviving `centroid inside` prose alone.

## Exactly one next gate

`WB-ZONE-CROP-PARITY-01` — identify and pin the exact 369-id crop rule in a diagnostic-only repository script.

No further repair on PR #252 before that gate.
