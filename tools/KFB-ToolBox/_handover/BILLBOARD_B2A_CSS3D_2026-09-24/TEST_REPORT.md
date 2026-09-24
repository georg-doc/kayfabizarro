# TEST REPORT · Billboard B2a CSS3D · 2026-09-24

Status: **PUBLIC_VERIFIED · HUMAN PENDING**

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
