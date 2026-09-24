# RETURN · Billboard B2a · inline CSS3D YouTube · 2026-09-24

Status: **HUMAN_ACCEPTED · FRONT-ONLY FIX CHECKED IN**
Repo: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/billboard-b2a-css3d-2026-09-24`
Draft PR: **#199**
Public-proof head before recovery-doc checkpoint: `bed7f74e5bca3efb51a7eb3ab12819ad4a46af09`
Tested runtime head: `147b517efdfba78302af4e5e3ff48846b1f21f92`
Cloudflare publication: `be24c154889fb96c20e99ef2b86dd2ced44007be`

Result: B1's YouTube poster→modal behavior is replaced in B2a by the official Three.js CSS3D YouTube pattern. The real iframe sits on the measured 3D billboard face, follows perspective, receives clicks inline, and unloads on mode exit. CARD, COVER and SLOGAN remain the accepted B1 path.

Public route:
https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b2a/

Evidence:
- donor isolation **9/9 PASS**;
- integration **27/27 PASS** after one preserved failed candidate and one repair pass;
- public Cloudflare **22/22 PASS**;
- public artifact `10789313140`;
- 0 public page errors;
- 0 tracked public HTTP errors.

Timeout recovery: previous turn ended during public-stage handoff; GitHub inspection proved all intended writes and Stage publication existed, so no duplicate write was made.

Unresolved: none inside B2a. B2b/B2c/B3/C1 remain separate future lanes.

Exactly one next gate:
**Georg B2a PASS/TUNE on the direct Cloudflare route.**


## Final B2a tune

Georg's last requested correction was rear-side occlusion for the CSS3D YouTube plane.

Final behavior:
- front: real inline YouTube remains clickable;
- front/3/4: perspective behavior preserved;
- rear: iframe is culled by panel-normal/camera hemisphere test;
- rear picture shows the normal Kenney billboard backside;
- no mirrored video is visible.

Final verified runtime:
`89065825448846beb2649082fc0c1bf25df20ccb`

Public Stage:
`cloudflare-live@983929385c3be74a42ec88c29f601c08b90b5a05`

Final evidence:
- integration **29/29 PASS**;
- public **24/24 PASS**;
- public artifact `10836432703`;
- public rear screenshot visually checked.

Human status:
**ACCEPTED / CHECK IN AUTHORIZED by Georg after this exact requested fix.**

Exactly one next gate:
**B2b research/options memo; no B2b implementation yet.**
