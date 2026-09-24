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
