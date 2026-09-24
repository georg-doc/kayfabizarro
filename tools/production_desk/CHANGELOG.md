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
