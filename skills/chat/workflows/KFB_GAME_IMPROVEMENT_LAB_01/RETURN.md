# KFB Game Improvement Lab 01 · Planning Return · 2026-10-12

**Outcome:** Five-role manual Webchat improvement workflow specified; optional adversarial **Breaker Mode** added as `DEFERRED / OPT-IN`, not implemented or activated.

**Existing owner:** KFB Production Hub / HUB-CTRL for workflow routing; game/runtime SSOTs stay with their receiving owners.

**Source:** `BRIEF.md` in this directory; current KFB Game Bigger-Picture Reference, current scope/claim and independent-QA protocols, source-reviewed `isas1/daily-team@4c85f97bd5b470ab369c48422443d2e96868159a` as pattern only.

**Change:** Playtester starts by separating TEST_NOW / VERIFY_CLAIM / NOT_IN_SCOPE / UNVERIFIED. The four domain specialists critique only evidenced current behavior. Later Breaker Mode tries to break **implemented or claimed** game mechanics under isolated, authorized conditions, preserving reproducible evidence and distinguishing destructive bugs from intentionally keepable emergent fun.

**Tests:** Documentation/source review only; 0 game runtime executions, 0 Breaker tests, 0 browser acceptance runs, 0 product code writes.

**Hub:** Existing GPT Site unchanged. A manual start via existing briefing data is a future integration step, not yet verified as a click-to-launch capability. No new runtime or Site.

**Protected gates:** World PR #348 STOP/NO MVP/F-R39, Four-Island A/B design-only gate, no auto-merge or Live promotion remain binding.

**Next gate (one):** `KFB_GIL_01_MANUAL_SCOPE_CLAIM_PILOT` — one manual, read-only, evidence-only run using the historical R4 failure and current contract; do not run Breaker Mode yet.

## 2026-10-12 · Optional invocation + help · plugin creation milestone

- **Created private skills-only plugin** `kfb-game-improvement-lab` v0.1.0:
  https://chatgpt.com/plugins/plugins_6acd274ca7848191bc9e657220ce5b18
- Backend ID `plugins_6acd274ca7848191bc9e657220ce5b18`; release `pluginrel_6acd274eff908191ad0fca7c73b6dbb6`.
- Optional `focus` and `scope` (plus `mode`) and side-effect-free `help`, `-h`, `--help`; default `discover`, `auto`, `current`.
- Plugin package persisted privately and its current text files mirrored in this versioned workflow folder. Source/check verification is not a playtest. No Hub Site update and no game implementation.
- **Next gate unchanged:** `KFB_GIL_01_MANUAL_SCOPE_CLAIM_PILOT`.
