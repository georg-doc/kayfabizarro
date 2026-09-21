# KFB Eye Actor Studio v1 · TEST REPORT

Date: 2026-09-21
Tested head: cfead6b064a36075f3c360217ed42c92b065bec3
Workflow run: 35582435688
Job: 106278127789

## Static

20 / 20 PASS.

Proves exact EyeRig v6, BrowRig v2 and EyeOval v1 imports; Eye Cluster schema; 1–4 clamp; asymmetric, frog, single, three-eye and four-eye fixtures; per-eye Euler/quaternion/size/shape; Clay hard inner rim; acting scopes; mobile viewport and debug observability.

## Syntax

4 / 4 PASS.

## Desktop + mobile WebGL

22 / 22 PASS across 1440×900 and 390×844.

Both viewports prove:
- default Eye Cluster boot with 2 eyes;
- asymmetric pair sizes 0.86 and 1.26;
- frog-side yaw −76° / +76°;
- 3-eye fixture;
- 4-eye fixture;
- selected-eye Aim affects only the selected eye;
- exact EyeRig v6 donor mode boots;
- 0 failed resources;
- 0 page/console errors.

## Evidence

Artifact ID: 10630529454
Digest: sha256:17267649b1bf41192a6e8233c8f6d23dc5e162021fad97965b30dc98e44bcbb0

Files include desktop/mobile donor and frog screenshots plus browser.json.

## Visual observation

The frog fixture is genuinely side-mounted rather than only front-positioned with pupil rotation. The current thick Clay lids remain visibly heavy in the ±76° frog fixture and can read as rim/wedge-like. This is an OPEN visual question, not an automated failure.

## GPT workbench

A single-file GPT/sandbox mirror is available in the current chat for immediate iteration. It is intentionally not classified as PUBLIC_VERIFIED.

## Public Stage

Intended route: https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-actor-studio/
PUBLIC_VERIFIED: NO.

## Next gate

EAS1-VIS-1 · Georg visual review in the GPT workbench.
