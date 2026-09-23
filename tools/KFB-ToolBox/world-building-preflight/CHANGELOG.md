# KFB World Building Preflight · Additive Changelog

## 2026-09-22 · WB1-P0 initial candidate

- Created the first bounded `SOURCE_REUSE_MATRIX.md` on `chatgpt-web/world-building-preflight-2026-09-22`.
- Classified internal KFB donors as `REUSE_DIRECT`, `ADAPT` or `DO_NOT_IMPORT`.
- Classified external repositories as research-only unless license/source state explicitly permits later reuse.
- No runtime implementation, Stage or owner transfer.

## 2026-09-23 · WB1-P0 revalidation and handoff

- Re-read current KFB router, Stage workflow, fresh-chat protocol, gate/token protocol, Web-first workflow and WorldBuilder briefing.
- Loaded the requested Dropbox, Build 3D Game Rooms and Game Development Studio plugin instructions.
- Reconciled the existing P0 branch additively with coordination `main` at `7b732d0fcee16afcc8c5d77bb7e8a3de48fd91d5`; the original matrix candidate was preserved.
- Proved that the KFB donor source paths used by the existing matrix did not change across the coordination-main drift.
- Rechecked Travel and Combat Spindle owner heads.
- Rechecked 8 external research repositories and their license state.
- Re-pinned `ZyFou/ProceduralTerrains` from `9f50c499…` to `f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070`; its MIT license blob is unchanged.
- Confirmed read-only Dropbox provenance for the WhackMan v1-1 Session Cut and Hex WorldBuilder corpus.
- Added explicit protected-owner boundaries to the P0 matrix.
- Added `TEST_REPORT.md` distinguishing current revalidation evidence from inherited unchanged source-content evidence.
- Runtime files changed: **0**.
- Browser/gameplay tests: **0**.
- Cloudflare publication: **not run**.
- Work/WSA: **not used**.

Exactly one next gate:

**WB1-P1 · isolate the WhackMan Environment Profile without WhackMan gameplay.**

Do not start WB1-P2 in the same work cycle.


## 2026-09-23 · WB1-P1 Environment Profile candidate · browser proof blocked

- Reconciled the completed WB1-P0 evidence onto current coordination main without reopening P0.
- Created branch `chatgpt-web/world-builder-p1-environment-profile-2026-09-23` and Draft PR #177.
- Isolated `kfb.environment-profile/1` from the pinned WhackMan light/fog/torch/local-visibility behaviour.
- Reused `wd-light.js` as the adaptation donor but returned source-critical calibration to final WhackMan truth: exposure `1.0`; local visibility max `46`, range `26`, decay `1.6`.
- Kept material calibration orthogonal through reversible `SOURCE_MATERIAL` / `WHACKMAN_MATTE_CANDIDATE` references.
- Wired the real KayKit `torch_mounted.gltf` as the required source-object-first proof and the existing Dungeon-owner `collectTris()` + `measureFlame()` functions.
- Repository-native tests: **8/8 PASS**; module syntax checks: **4/4 PASS**.
- Chromium browser transport failed twice before page load with `net::ERR_BLOCKED_BY_ADMINISTRATOR`; per recovery protocol no third pass was attempted.
- Visible source-object proof: **0 observed**; screenshots: **0**; browser console-error assertion: **UNKNOWN**.
- Preserved full recovery at `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/WB1_P1_FAILURE_RECOVERY_2026-09-23.md`.
- Optional `game-dev` CLI unavailable; sealed Game Development Studio evidence was not required for this gate and repository-native checks were used.
- No Cloudflare Stage/Public/Live promotion.
- **WB1-P2 remains HOLD.**

Exactly one next gate:

**WB1-P1 Browser Verify · run the persisted Portable Preview outside the restricted browser container, prove the real source torch in isolation first, then integrated Environment Profile, console errors = 0, and capture visible evidence.**


## 2026-09-23 · WB1-P1 human scope acceptance

- Reconciled PR #177 with current coordination `main@e0037d79af9f0546c73cee02e361f78f7d662df2` without dropping concurrent Racer RSTAB-1 routing.
- Zero-install Stage review remained pinned to frozen P1 runtime `a48729460c28edc2ae95abbfcdef66fe52a84f50`.
- Public automated browser proof run `35807858806`: PASS; source isolation rendered, `consoleErrors=0`, integrated `activePool=6/6`, `FogExp2 0.019`, Local Visibility 1.00, SOURCE→MATTE→SOURCE restored, zero page/HTTP failures.
- Georg human review: **PASS for WB1-P1 scope**.
- Human caveat preserved: review-scene primary light placement and torch staging/spacing are **not production lighting canon**; final scene lighting composition remains future authoring work.
- P1 runtime changed after review: **0 files**.
- Live promotion / merge: **not performed**.
- WB1-P2: **not started**.

Exactly one next gate: **WB1-P2 · same tiny logical recipe on FLAT / SPHERE / TORUS.**
