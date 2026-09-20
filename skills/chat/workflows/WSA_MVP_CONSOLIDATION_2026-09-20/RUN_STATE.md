# WSA MVP Consolidation · RUN STATE

Status: **I0 LOCKED · ONE I1 SLICE SELECTED · RUNTIME NOT STARTED**  
Updated: 2026-09-20 23:42 CEST  
Coordination: `georg-doc/kayfabizarro · orchestration/wsa-mvp-consolidation-2026-09-20`

## Exact heads fetched

- Coordination source before I0: `9d514cfd932997598ad6f5ad484416936aabe233`
- kayfabizarro `main`: `6c1b02a3338c005127d45bc7bff3ecbb785f1342`
- Travel `main`: `8614282aab2ced43bb5dda9fcf7abadf9768100a`
- Travel PR #31: `35a0b6c8380feb009bd27f1ca811064c1ad74be7`
- Race `main`: `31d834218f0a79f193a44b054e57454d29c305c2`
- Race PR #30: `f4436c83c674bc5bde017a0c33ca19e5da682894`
- Combat PR #5 / #6: `954f2db7484dc566e468e5ce89b0d95940d97537` / `6ebc609c9ccf87e580268ee766fea9d3c10912f8`
- CA2-03B Stage PR #137: `15eeb9f765fec1a1388c75f22b86a14f0ef5bb4b`
- ToolBox/World Atlas PR #120 / #126 / #133 / #146:
  `c52e4139d2b5f311ef5dc9a8cfdecbd8944a469f` /
  `99a14f7bc77cff58ae68c1e0280ee990574704d6` /
  `69943c8d57aeb8202aaa3b1673697cec58152aac` /
  `537ab4f037b76097b0a4b1808943b866f6f7f1f1`
- KayKit Bits PR #144: `165726d086d9363f3dce5bee9432015da889e77d`
- Storytelling PR #143 / #145 / #149:
  `90c98a6b1f00926f110567dff877f3bfe97121ac` /
  `e81f0e7a05a56e7c03a38b326df4caa1c7c14428` /
  `dadf2fa34cc3b64ae7177953387c91e6d3042bb4`

The authoritative lane record is `INTEGRATION_LOCK.json`.

## Current blockers

- Combat: CA2-03B is technically/publicly proven; Georg playback review is still open.
- Residents: public Resident loop still has Georg's visual gate; ChatterBox remains planning-only until its exact source is pinned.
- ToolBox/editor: S14 room/editor/Blender parity needs Georg review before the receiving-host sequence.
- Environment: KayKit Bits package review precedes Librarian reconciliation.
- Storytelling: CardRig T2.1 is the implementation gate; PR #149 is planning only and waits for the Claude result.
- WhackMan: Claude Gate A/B/C is in flight; Work must not duplicate it.
- TC-01: visually rejected. Its black ribbon/zone composition is evidence, never the current Track foundation.

Local dirty/unpushed state: **NOT INSPECTED / NOT APPLICABLE TO THIS CONNECTOR-ONLY I0**. The current Codex project mirror is not a Git checkout; no local files were changed.  
Optional `game-dev` helper: previously recorded unavailable; repository-native checks remain the allowed fallback because I0 requires no sealed Game Development Studio evidence.

## Selected I1 · WorldSurface TrackPatch A/B/C

One isolated browser comparison on the current Travel Globe:

1. A — unchanged host terrain;
2. B — direct grading/masking of existing host faces;
3. C — locally refined SurfacePatch stitched to the unchanged host.

Use the same short route, camera set and material concept for all three. Acceptance: no terrain penetration, no floating black ribbon, smooth shoulder/edge, no jagged face colouring, close inspection view, and unchanged Globe outside the patch.

This is the only lane currently satisfying the selection rule: exact sources, no open human/Claude predecessor, documented Travel↔Race seam, one browser-proven outcome, no universal runtime.

## Allowed owners and files for I1

- **Implementation writer:** `georg-doc/KFB-Travel-Globe`, on a new bounded I1 branch from Travel `main@8614282a...`.
- **Allowed new proof surface:** one new isolated `site/world-surface-trackpatch-i1/**` package and its narrow repository-native browser test/evidence.
- **Read-only seam input:** current Race route/Track grammar from `KFB-Stunt-Car-Race main@31d8342...`; no Race runtime write.
- **Coordination only:** this folder's `INTEGRATION_LOCK.json` and `RUN_STATE.md`.

## Protected owners and files

- Do not edit or replace Travel's current terrain owner, especially `travel/globe-v13/terrain-surface.js`.
- Do not patch the TC-01 ribbon/zone composition forward.
- Do not change Race movement, vehicle contact, controls, HUD or audio.
- Do not touch Combat, Resident, ToolBox/editor, Registry/Librarian, Storytelling or WhackMan runtime files.
- No new universal WorldSurface engine; prove the isolated Sphere seam only.
- No merge, Hub/Stage publication or Live promotion during I0.

## Exactly one next gate

Create the bounded Travel I1 branch and complete the **source-isolated A/B/C geometry/browser proof**. Stop at its evidence checkpoint before any public Stage promotion or product integration.
