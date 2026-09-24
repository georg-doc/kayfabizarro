# CHANGELOG · Billboard B2a

## 2026-09-24 · source isolation
- forked from accepted B1 head `78f09f5e9b28b606a121bda1b43dcd8c8aff5f1a`;
- pinned official Three.js r160 `css3d_youtube.html` donor at `d04539a76736ff500cae883d6a38b3dd8643c548`;
- added isolated one-plane CSS3D YouTube proof;
- no B1 integration yet;
- B2b/B2c/B3/C1 untouched.


## 2026-09-24 · donor gate passed
- source-isolation workflow run `35951854457` / job `107481888424`: **9/9 PASS**;
- screenshot inspected: real YouTube player visibly rendered on the isolated CSS3D plane;
- artifact `10787959850`;
- source-first gate satisfied before integration.

## 2026-09-24 · B2a integration implementation
- copied accepted B1 `bb1-boot.js` unchanged as reference;
- copied B0 `bb-scene.js` / `bb0-boot.js` unchanged;
- added `bb2a-boot.js` with the pinned donor's CSS3DRenderer/CSS3DObject/iframe/blocker pattern;
- CSS3D object copies the accepted B1 panel world transform and measured dimensions;
- VIDEO is inline on the 3D face; the B1 modal is absent;
- CARD/COVER/SLOGAN stay on the existing B1 canvas path;
- integration proof pending.


## 2026-09-24 · integration proof candidate 1 · FAIL preserved
- candidate head `7bed45398820b6bc629b24e0580866d697642946`;
- run `35952277294`, integration job `107483448675`: **26/28**;
- numeric state proved exact 16:9 world dimensions and direct iframe hit target, but screenshot inspection overruled the near-pass;
- CARD and SLOGAN were visibly black because CSS3DRenderer rewrote DOM display and left the hidden CSS plane above WebGL;
- camera assertion compared the object's world CSS transform, which correctly stayed fixed, instead of screen-space projection;
- classified as **VISUAL FAIL / TEST-SEAM FAIL**, not accepted.

## 2026-09-24 · repair pass 1 · integration PASS
- visibility now belongs to `CSS3DObject.visible`, matching CSS3DRenderer ownership;
- iframe still unloads to `about:blank` on mode exit;
- perspective proof now compares screen-space media rect between FRONT and LEFT34;
- run `35952766940`, job `107484912203`: **27/27 PASS**;
- 0 page errors; 0 first-party/CDN HTTP failures;
- artifact `10788929677`;
- screenshot inspection: CARD visible, SLOGAN visible, VIDEO inline on billboard, LEFT34 perspective correct;
- repair count **1/2**;
- public Stage proof is next.


## 2026-09-24 · timeout recovery + public proof
- prior chat/tool turn ended during the Stage handoff; state classified **UNKNOWN** until ref/run inspection;
- verified PR #199 head `bed7f74e5bca3efb51a7eb3ab12819ad4a46af09`;
- verified `cloudflare-live@be24c154889fb96c20e99ef2b86dd2ced44007be` contains the exact B2a wrapper;
- exact public `SOURCE.json` marker reached Cloudflare;
- run `35953227597`, public job `107486764345`: **22/22 PASS**;
- 0 page errors; 0 tracked HTTP errors;
- public artifact `10789313140`;
- no duplicate retry was performed because the intended writes were already present;
- status advances to **PUBLIC_VERIFIED · HUMAN REVIEW NEXT**.


## 2026-09-25 · human rear-side tune · front-only video
- Georg accepted B2a except for one visual defect: the YouTube plane was mirrored on the rear;
- attempt 1 `ba7043d4`: CSS `backface-visibility:hidden` alone → **28/29 FAIL**; iframe still exposed from rear;
- repair pass 1 `89065825`: retained CSS backface rule and added explicit panel-normal/camera hemisphere culling through `CSS3DObject.visible`;
- integration run `36066988954` / job `107859397766`: **29/29 PASS**, 0 page errors, 0 tracked first-party/CDN HTTP errors;
- exact runtime published to `cloudflare-live@983929385c3be74a42ec88c29f601c08b90b5a05`;
- first public attempt in the same workflow hit the pre-publication Stage and failed as stale deployment evidence; after Stage write, public job `107860680693` rerun → **24/24 PASS**;
- public artifact `10836432703`;
- visible rear proof: normal billboard backside only; no mirrored video;
- B2a status: **HUMAN_ACCEPTED / CHECKED IN**;
- B2b remains research-only next.
