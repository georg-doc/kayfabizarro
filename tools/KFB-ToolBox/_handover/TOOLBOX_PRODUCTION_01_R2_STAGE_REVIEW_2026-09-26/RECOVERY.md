# RECOVERY · TOOLBOX-PRODUCTION-01 r2 Stage Review

Date: 2026-09-26  
Status: **STOP · CANDIDATE PRESERVED · NOT PUBLISHED**

## Recover from here

Read in this order:

1. `TEST_REPORT.md`
2. this file
3. `RETURN.md`
4. current ToolBox owner Return:
   `../TOOLBOX_COHERENT_INTEGRATION_01_2026-09-24/RETURN.md`
5. current owner files on PR #185.

GitHub state overrides earlier chat notes.

## Exact topology

Receiving runtime owner:
- repo: `georg-doc/kayfabizarro`
- PR: **#185**
- branch: `chatgpt-web/toolbox-source-lock-2026-09-23`
- r2 owner technical head: `5dcf34bcdf9d87445e927c98f60d41adae72f00e`

Frozen Stage-review consumer:
- PR: **#220 · Draft**
- branch: `chatgpt-web/toolbox-r2-stage-review-2026-09-26`
- frozen implementation candidate: `cab463b6a4b9bfd9cc365694ff462b39bc493b8e`
- review file: `kfb-hub/stage/toolbox/production-01-r2/index.html`
- test workflow: `.github/workflows/toolbox-production-01-r2-stage-review.yml`

External owner consumed, not copied:
- EarRig-v5 / Ear Dangle PR #214
- pin: `19088b142c6a7e7626f27fba8e80caf6ab2437c1`

Animation source pin:
- KayKit Rig_Medium: `b97b5ac55df2724fae623992433685583eece51e`

## What is safe to reuse

The candidate already demonstrates the correct source-first architecture:

1. Source mode shows the real `FB_TEMPLATE_LOOK_v5.glb` before integration.
2. State mode consumes the canonical ToolBox semantic locomotion profile and exact KayKit source clips.
3. Pose/IK mode consumes the canonical fixed PoseRig owner.
4. Ear Dangle remains a PR #214 consumer.
5. There is one actor mixer and no second ToolBox runtime owner.
6. The review surface is deliberately sparse; the rejected AN-PROFILE palette wall was not recreated.

Do not rebuild these seams in the next slice.

## Why this slice stopped

Two browser-gate attempts each finished **28/29 PASS**:

- attempt 1: actor movement sample stayed at **0.000 m**;
- repair: start State mode on semantic `walk`;
- attempt 2: movement passed at **0.299 m**, but transition-count sample observed only **1** instead of ≥2.

The screenshots also reveal a separate visual gate problem:
- framing crops the top of FrizzleBob's head and the ears;
- Source mode therefore does not yet provide a valid full-silhouette EarRig-v5 human review;
- portrait framing is worse.

No owner source failed. No browser request failed. The stop is about the review/test surface.

## Do not do in recovery

- do not change PR #185 PoseRig or locomotion owner merely to satisfy the review harness;
- do not copy `ear-dangle.v1.js`;
- do not fork WorldBuilder movement/controller logic into ToolBox;
- do not publish the planned Cloudflare route from this frozen slice;
- do not link the unpublished route from KFB Hub;
- do not merge PR #220;
- do not restart AN-PROFILE-02 UI.

## Fresh-slice brief

Outcome: **make the preserved ToolBox-r2 review candidate deterministic and fully frame the real actor, then prove and publish it.**

Start from implementation candidate `cab463b6a...`.

Boundaries:
- review-surface code + test harness only;
- exact owner pins remain unchanged unless GitHub state proves a receiving-owner update that must be consumed;
- Source mode remains first and must show the complete source actor including both ears;
- State proof must wait on an explicit semantic transition event/state change rather than a fixed wall-clock guess;
- preserve direct PoseRig IK proof;
- preserve desktop/mobile checks;
- no Cloudflare until the entire browser gate is green.

Acceptance sequence:
1. browser proof green with exact counts and screenshots;
2. inspect Source/State/Pose/mobile screenshots;
3. publish `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/production-01-r2/`;
4. open that exact route and verify the expected build marker/revision;
5. add the direct Stage route to ToolBox router + KFB Hub;
6. Georg human gate;
7. only then continue World r2 consumer reconciliation.

## One next gate

**Fresh ToolBox-r2 Stage Review Recovery slice: deterministic semantic transition proof + complete actor/ear framing.**
