# RETURN · Billboard B1 · content-fit media face · 2026-09-24

Status: **PUBLIC_VERIFIED · HUMAN REVIEW PENDING · B1 ONLY**
Owner: **KFB ToolBox / Billboard Media Residency**
Repo: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/billboard-b1-2026-09-24`
Draft PR: **#198**
Base: `main@0a2b8fc8b865cf3d0d4dc6043d55a8bd172fa0f0`
Tested runtime head: `58a8b92d55548c6436ac60b15b521d8eff269afd`
Evidence/public-proof head before this metadata checkpoint: `ae25e8fd8702e1d6c332f8e514268d8778ce8e94`

## Result

B1 forks the accepted B0 source rather than rebuilding it.

Copied byte-for-byte from B0:
- `bb-scene.js` blob `235b062f9d575a49a4c98d8be57d04d43acc2213`;
- `bb0-boot.js` blob `57392b87c0344648695e1ef6d62f6f70a9dd942b`.

The Kenney `billboard.glb` donor remains pinned at `378b209355b13304e3cff656ec0806ca5b89df28`.
The measured B0 ad face remains 4.20 × 2.10 with the existing epsilon seam.

One B1 seam was added in `bb1-boot.js`: the accepted B0 hero holder scales only on X to the resolved content aspect. Because donor frame/posts and measured content plane stay in the same holder, they move as one structure.

## What visibly changed

Compared with B0's fixed 2:1 face:

- **CARD QUARTER**: 1.79487:1, about **10.26% narrower**; real `Forget Utopia #7` quarter fills the face edge-to-edge at its own aspect.
- **COVER**: 1.79171:1, about **10.41% narrower**; real cover page fills the face edge-to-edge.
- **VIDEO**: 16:9, about **11.11% narrower**; Travel-owned YouTube poster is visible and clicking the billboard opens the no-cookie player.
- **SLOGAN**: remains 2:1/original B0 width; `SHOW IT` is intentionally billboard-scale and the mode cycles `SHOW IT → SPIN IT → SELL IT`.

The posts/frame visibly move inward/outward with the face. There is no added media frame, replacement billboard, letterbox bar or metadata stamped onto the art.

## Use-what-works repair note

First CI candidate `c8085eace867a8435dd8daeb78cb54bf95f496d8` reported 20/20 browser assertions, but screenshot inspection showed quarter/cover/video as black surfaces. That technical PASS was **not** treated as a visual PASS.

One repair pass at `58a8b92d55548c6436ac60b15b521d8eff269afd` removed the redundant B1 re-rasterization step and uses each resolved owner canvas directly as the Three.js texture. B0 files remained unchanged. Picture evidence then showed the real card, cover and video poster.

## Tests / evidence

Workflow: **Billboard B1 Browser Proof**, run `35949250283`.

Local/branch job `107473997406`:
- literal B0 fork `cmp`: **2/2 PASS**;
- JavaScript syntax: **5/5 PASS**;
- browser assertions: **20/20 PASS**;
- page/console errors: **0**;
- failed HTTP assets: **0**.

Public Cloudflare job `107474352324`:
- exact `SOURCE.json` marker reached on the public route;
- public browser assertions: **21/21 PASS**;
- page/console errors: **0**;
- failed HTTP assets: **0**;
- artifact `billboard-b1-cloudflare-proof`, ID **10788012554**, contains four public screenshots + report.

Public measured aspects:
- quarter `1.794871794871795`;
- cover `1.7917133258678613`;
- video `1.7777777777777777`;
- slogan `2.0`.

Picture check from the exact public screenshot artifact: **4/4 modes visibly contain the intended source content**.
This is evidence review, **not Georg human acceptance**.

## Publication

Direct review route:

https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b1/

`cloudflare-live` wrapper runtime commit:
`430accacdcf8644b017c83c7a95197c44efc39ff`.

The wrapper copies the tested multi-file result by exact blob; it does not rebuild it.

## Boundaries

- no C1;
- no change to B0;
- no alternate billboard owner;
- no second card/PDF runtime owner;
- no merge to `main`;
- no product-Live promotion beyond this named review route.

## Unresolved

B0's already-recorded later tuning remains separate: card cartoon anatomy and 3D model proportions may both come slightly down. It is not part of B1 acceptance.

## Exactly one next gate

**Georg picture-checks B1 at the direct Cloudflare route: card quarter → cover → video → slogan.**
C1 remains HOLD until that B1 gate is answered.
