# G1 Editorial · G4 Bridge Visual Failure QA · 2026-10-10

Status: **VISUAL GATE FAIL (2 attempts) · QUARANTINED · parent worklist CONTINUE**
Owner: KFB Island Worldbuilder Lab / G4 (visual task); G1 only indexes the failure, does not take over G4 model/runtime.
Source: [Original bridge01 comparison](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/tools/KFB-ToolBox/_inbox/KFB%20Island%20Worldbuilder%20Lab/tools/img2threejs-tests/bridge01/COMPARISON_final_ref_vs_render.png). Actual donor test: [bridge01 TEST_REPORT.md](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/tools/KFB-ToolBox/_inbox/KFB%20Island%20Worldbuilder%20Lab/tools/img2threejs-tests/bridge01/TEST_REPORT.md).

## Actual visible visual checks
- Required one isolated stone bridge, neutral background, no text, characters or props.
- Attempt A1: **FAIL**; mixed marketing sheet, multi-view, unrelated scenery/branding.
- Attempt A2: **FAIL**; after request to remove panels/labels/props, still a multi-view branded presentation sheet.
- Acceptance images **0/2**; isolated source-accurate G4 candidate **0**; separate G4 author approval **0**.

## Artifact verification (container)
- **10/10 executed file-integrity/manifest assertions PASS**, 0 FAIL:
  - G4 recovery ZIP opens without corruption
  - Expected eight files present
  - Manifest schema/status correct
  - Exactly two attempts recorded
  - Four G4 image/preview SHA256 values match ZIP manifest
  - Both G4 full-size PNGs are 1536×1024
  - Recovery manifest correctly has no runtime/build outputs
  - Previous G1 original image ZIP is intact
  - Previous G1 ZIP still contains three PNGs
  - All three G1 PNG SHA256 match SOURCE.json (3/3)
- [Recovery specification](G1_G4_BRIDGE_VISUAL_FAILURE_RECOVERY_R1.md). Full exact images and logs are in user-visible chat-generated `KFB_G4_BRIDGE_FAILURE_RECOVERY_2026-10-10_r1.zip`; **that ZIP itself is not in the GitHub repo**.
- Full-resolution G1 PNGs: **0/3 uploaded to GitHub**, prior **3/3 preview WebP** blobs on GitHub remain unchanged. This is an upload capability limitation, not product art FAIL.

## Failure / salvage
- Proven failure: both generated images violate source isolation, despite second corrective attempt. Cause inside generator unknown; refuse invented explanation or claim of original bridge donor fidelity.
- Salvage only informal material/color mood. Both images prohibited from G4 Golden/source candidate paths.
- R4 previous no-MVP routing unaffected, no WorldBuilder runtime changes, no Stage/Site/Live.

## Exactly one next parent gate
Upload **three complete original G1 PNGs** from `KFB_MVP1_G1_Concept_Images_2026-10-10.zip` to existing G1 pending paths through a networked, authorized GitHub binary uploader, fetch exact branch head and each original file SHA256, update gallery and Recovery. Leave G4 seam quarantined until its own owner has a genuine single-source isolated bridge render path.
