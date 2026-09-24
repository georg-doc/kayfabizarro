## 2026-09-24 · Focus recovery / minimal Work routing

- linked HUB-CTRL recovery metadata to current Production Architecture PR #204 focus handoff;
- three new Flow Design Inbox exports remain candidate inputs, not automatically promoted Hub tools;
- current Work decision is intentionally **no execution**; Racer TRACK_A stays with the documented Web/Race owner;
- WorldBuilder bake→Flow-shell seam, Resident Card and Resident Band stay outside Work; ToolBox runtime + repaired review transport are now green and also require no Work;
- MUSIC-PERF public review remains unchanged;
- no root Production Desk republish or Live promotion claimed by this metadata checkpoint.

## 2026-09-24 · Recovery test repair

- Traced the existing Production Desk CI failure to `desk_dom_test.mjs`: the test hard-coded the `curtain` lane and dereferenced `curtain.brief.rawUrl`, although the current Curtain lane intentionally has no briefing.
- Repaired the test to select an actual lane with a real `brief.rawUrl`; no product/runtime behavior changed.
- GitHub connector writes did not automatically start a new Production Desk workflow run, so the current rebuilt Hub remains **UNVERIFIED** rather than assumed green.
- Cloudflare preview activity is tracked separately and is not accepted as Production Desk registry/browser evidence.

## 2026-09-24 · Recovery sync · current architecture briefings

- Recovered the Hub owner against the current Production Architecture source at `a7b4d9c4f6e541a50a640f42182d5ec4cf332bd7`.
- Confirmed the architecture catalog now contains the two newest READY jobs:
  - `WB-DESIGN-PARALLEL-01`;
  - `NPC-CARD-SPEC-01`.
- Expected catalog after regeneration: **13 strands · 81 jobs · 38 READY · 43 HOLD**.
- No second Hub, no second registry and no runtime owner were introduced.
- This checkpoint intentionally does not claim the public Hub has refreshed; the existing HUB-CTRL workflow/publication path remains authoritative.

## 2026-09-24 · Human triage · broken/legacy Toolbox labs removed from current Tools

Georg reported the following public Stage surfaces as broken, misleading or non-productive:
- EyeRig Legacy: no useful EyeRig, unusable buttons/UI;
- EyeRig Batch: persistent loading animation in front of character/FOV;
- KayKit Motion Lab v1: incomplete animation set and non-useful UI versus expected Animation Lab / current ToolBox direction;
- Ranged Calibration v1: wrong target axes and muzzle VFX below the muzzle;
- Tileable Macro Seam Lab: no current utility/learning value;
- World-Building Preflight: one of several failed/obsolete world proofs.

Action:
- removed all six from the current `tools` shelf;
- preserved their repo/history as evidence/donors only;
- Card Zone Lab v2 remains visible as **Recovery Reference / Donor** because Georg reports it looks good and it is still a valid source donor for Fluid/Stack/Beam/Card Cube;
- productive EyeRig/Pose/Animation/WorldBuilder work stays in the v3 self-service catalog, not in these old Stage labs.

No source/runtime files for the old labs were deleted.

## 2026-09-24 · Racer external status advanced to RKIT-06

- Root cause for stale Racer card confirmed: Production Desk intentionally never fetches `external:true` repositories with the same-repo workflow token; Racer therefore remained on hand-maintained `lastKnown` PR #33 / head `71e7051…`.
- Current private Racer truth verified directly in `georg-doc/KFB-Stunt-Car-Race`: stacked RKIT PRs #34→#39, top PR #39 `RKIT-06` at `53219c9b7ee3d1abe0ef1b0e5364863b42014ea5`.
- Hub config now has one consolidated Racer lane at RKIT-06 rather than six micro-lanes.
- Current summary includes TRACK_A_STUNT_8, Base/Hero jumps, Pit Lane, SWITCH_Y, flap-return/tunnel and Trankgasse on the real OSM line.
- Next technical gate is the real Race/Rapier run on TRACK_A; RKIT remains geometry/metadata only.
- Durable follow-up: replace hand-edited cross-repo `lastKnown` with a small same-repo external-status mirror written by the owning GitHub Bridge, or later a GitHub App/token with explicit cross-repo read permission.
- No public publication claimed by this config-only checkpoint.

# KFB Production Desk · additive changelog

## 2026-09-24 · HUB-V3-MOUNT

- Mounted Production Architecture v3 as a second, additive self-service registry.
- Kept operational Today lanes and their owner unchanged.
- Added 13 collapsed strand cards with 79 nested READY/HOLD jobs.
- Added visible executor/model/reasoning/budget metadata and source-linked copy actions.
- Resolve all 79 prompt bodies from their canonical named Markdown sections at build time.
- Added failure isolation so a malformed catalog cannot blank the Hub.
- Added builder and browser-facing regression coverage for counts, prompt resolution and compact rendering.

No architecture owner was replaced, no PR was merged and no Live gameplay surface was promoted.

Publication proof: `cloudflare-live@a82c38ccbdda220b668bf71a337df38586c41f3e`; the exact public Hub rendered
13 collapsed strands and 79 nested jobs in real Chrome, copied an original briefing, and logged no browser errors.

## 2026-09-24 · HUB-CTRL-01

- Confirmed the public blank Hub was caused by malformed embedded JSON, not missing project data.
- Added output-time embedded JSON validation.
- Added an independent never-empty recovery view.
- Added recovery regression tests for missing and malformed embedded data.
- Refreshed the embedded project view with WB-W0, Hürth architecture proofs, Billboard B2a and Graveyard.
- Reclassified WB2 as a retained donor instead of the current WorldBuilder direction.
- Added the gate-proportionality protocol and World/Racer/Hub masterplan to the Hub rules.

No PR was merged and no Live project was promoted by this change.

Publication proof: `cloudflare-live@620c26350d3ecb2ea48b70da42fd92f689911584`; the exact public Hub route
rendered the current 14-lane snapshot in real Chrome. HUB-CTRL-01 is complete.


## 2026-09-24 · MUSIC-PERF-01 review mount

- added `music-perf-01` as one HUB-CTRL `LOOK_AT` lane;
- added `music-performance` as one Tool entry;
- added a Stage navigator Human Gate card through the existing Hub owner;
- preserved MUSIC-PERF donor/runtime ownership in Draft PR #207;
- published only the Stage navigator delta to `cloudflare-live@5658557e...`;
- verified public direct route + navigator with **22/22 Chromium PASS** in run `36047130373`;
- human result remains PENDING;
- root Production Desk regeneration remains a separate pending HUB-CTRL task and is not claimed complete.
