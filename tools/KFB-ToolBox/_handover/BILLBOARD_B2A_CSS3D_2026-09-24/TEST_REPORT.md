# TEST REPORT · Billboard B2a CSS3D · 2026-09-24

Status: **FINAL B2A PASS · HUMAN_ACCEPTED**

## Source donor
Three.js r160 `css3d_youtube.html` pinned at `d04539a76736ff500cae883d6a38b3dd8643c548`.

Donor isolation:
- run `35951854457`;
- job `107481888424`;
- **9/9 PASS**;
- artifact `10787959850`.

## Integration
Protected source compare:
- B2a `bb-scene.js` == B1/B0 source;
- B2a `bb0-boot.js` == B1/B0 source;
- B2a `bb1-boot.js` == accepted B1 reference.

First candidate:
- head `7bed45398820b6bc629b24e0580866d697642946`;
- **26/28**;
- visual fail: hidden CSS3D plane blacked non-video modes.

Repair pass 1:
- `CSS3DObject.visible` owns visibility;
- verified integration head `147b517efdfba78302af4e5e3ff48846b1f21f92`;
- run `35952766940`, job `107484912203`;
- **27/27 PASS**;
- 0 page errors;
- 0 tracked first-party/CDN HTTP failures;
- artifact `10788929677`.

## Public Cloudflare
Route:
https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b2a/

Publication commit:
`be24c154889fb96c20e99ef2b86dd2ced44007be`.

Public proof:
- run `35953227597`;
- job `107486764345`;
- **22/22 PASS**;
- 0 page errors;
- 0 tracked HTTP errors;
- iframe hit target = `IFRAME#b2a-inline-youtube`;
- world size = `3.7333333333 × 2.1`;
- face aspect = `16:9`;
- artifact `10789313140`.

No Georg acceptance is inferred.


## Rear-side / front-only tune · 2026-09-25

User-observed defect:
YouTube CSS3D plane visible and mirrored from the rear.

Attempt 1:
- head `ba7043d46cffc642d9a13be1b515b31e2192c86c`;
- `backface-visibility:hidden` only;
- integration **28/29 FAIL**;
- rear iframe still exposed;
- artifact `10836446767`.

Repair:
- head `89065825448846beb2649082fc0c1bf25df20ccb`;
- panel world-normal / camera-direction hemisphere cull controls `CSS3DObject.visible`;
- CSS backface rule retained.

Final integration:
- run `36066988954`;
- job `107859397766`;
- **29/29 PASS**;
- 0 page errors;
- 0 tracked first-party/CDN HTTP failures;
- artifact `10836726983`.

Final public Cloudflare:
- Stage commit `983929385c3be74a42ec88c29f601c08b90b5a05`;
- public job rerun `107860680693`;
- **24/24 PASS**;
- 0 page errors;
- 0 tracked HTTP errors;
- artifact `10836432703`;
- `04-video-back.png` visually verified: only billboard rear body, no mirrored iframe.
