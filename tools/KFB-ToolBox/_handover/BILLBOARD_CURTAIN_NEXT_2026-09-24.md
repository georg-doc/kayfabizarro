# Billboard B1 + Curtain C1 · next slices · 2026-09-24

Georg: both Claude Design results are an OK production base now. Billboard B0 accepted; Curtain v2 usable (no classic lower-third tieback, but it works; stripe bug solved by taking the original three.js donor and only tinting it).

Sources (main):
- Billboard B0: `tools/KFB-ToolBox/_inbox/KFB Billboard Media Szene · B0 Source Proof/BILLBOARD_B0_SOURCE_PROOF_2026-09-24/` (`bb-scene.js`, `bb0-boot.js`, `RETURN.md`, `POST_MORTEM.md`). Kenney `billboard.glb`, measured ad face 4.20 × 2.10, real KFB card via `renderCardQuarter()` cover-cropped, no metadata.
- Curtain v2: `tools/KFB-ToolBox/_inbox/KFB Theatre Curtain v2/2026-09-24-theatre-curtain/` (`KFB Theatre Curtain v2.html`, `docs/HANDOVER_WSA_THEATRE_CURTAIN_2026-09-24.md`). WebGPU compute cloth from three.js `webgpu_compute_cloth` @`7300402f`, two tinted panels, no texture.

## B1 · Billboard fits its content (Web chat; Blender only if the frame must be remodelled)

Goal: the ad face shows content **borderless** at its own aspect ratio.

1. **Face follows content aspect**, clamped between a min and max size; posts/frame follow the face. No letterbox, no crop of important parts.
2. **Default = one quarter of a KFB card page**: measure the aspect from `renderCardQuarter()` output; do not guess.
3. **Content modes** on the same face: card quarter (PDF.js), card **cover**, **YouTube video**.
   YouTube cannot be a WebGL texture (cross-origin); use a CSS3D plane aligned to the face, or poster image + click to play.
4. **Typography for slogans**: ChatterBox triplet (SHOW IT → SPIN IT → SELL IT) set large and designed for billboard reading distance — no step labels, no "1 of 4", no metadata.
5. Keep B0 exactly (measured face, epsilon offset, cover-crop). Check the other Kenney variants (`billboardDouble_exclusive`, `billboardLow`, `billboardLower`) with the same face measurement before using them.
6. Still open from B0: bring card cartoon anatomy and 3D model proportions closer ("beide etwas runter").

Done when Georg sees the same billboard showing a card quarter, a cover and a video, each borderless, plus one large slogan.

## C1 · Card motif on the curtain (optional, after B1)

- Keep v2 as it is. The stripe bug came from tiled fabric textures + normals in v1.
- Motif test: **one** non-tiling card image as colour only (no normal/bump), mipmapped, on the closed curtain; judge in motion (several frames), not a still.
- If stripes return: put the motif on a separate hanging banner/pelmet in front instead of the cloth.
- Open decisions for Georg later: cartoon rings/hooks, scalloped pelmet layer (switchable), WebGL fallback (v2 is WebGPU-only).

## Start text for a fresh Web chat (B1)

```
Read georg-doc/kayfabizarro main: tools/KFB-ToolBox/_handover/BILLBOARD_CURTAIN_NEXT_2026-09-24.md and the Billboard B0 folder it names. Apply skills/session-entry-use-what-works_v1.md. Do B1 only, forking B0 unchanged (bb-scene.js, bb0-boot.js). Publish the unchanged multi-file result as a wrapper under kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b1/ on cloudflare-live. Stop and report what is different in the picture.
```


## 2026-09-24 · B1 result

Status: **PUBLIC_VERIFIED · HUMAN REVIEW PENDING**.

Draft PR **#198**, branch `chatgpt-web/billboard-b1-2026-09-24`, tested runtime `58a8b92d55548c6436ac60b15b521d8eff269afd`.

B0 protection proved: `bb-scene.js` and `bb0-boot.js` are byte-for-byte unchanged.

B1 now shows real card quarter, real cover, Travel-owned YouTube poster/click-player and large ChatterBox slogan on the same accepted Kenney billboard. Face aspect follows each source while frame/posts follow the same X scale.

Evidence: local **20/20 PASS**; public Cloudflare **21/21 PASS**; 0 page/console errors; 0 failed public assets; four public screenshots visibly populated.

Direct human route:
https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b1/

One first-pass visual defect (black media surfaces despite automated PASS) was repaired by using the resolved owner canvases directly; B0 stayed untouched.

**Exactly one next gate: Georg picture review of B1. Curtain C1 remains HOLD.**


## 2026-09-24 · B1 accepted → Billboard media line continues

Georg accepted B1: **PASS**.

Current recovery/planning SSOT:
`tools/KFB-ToolBox/_handover/BILLBOARD_MEDIA_LIVING_2026-09-24.md`

Next bounded slice is **B2a · inline YouTube / CSS3D surface**.

Pinned donor before implementation:
- `mrdoob/three.js/examples/css3d_youtube.html`;
- Three.js **r160**;
- commit `d04539a76736ff500cae883d6a38b3dd8643c548`.

Planned after B2a, but not started:
- **B2b** Living Mockup / Collage surface;
- **B2c** KFB Talking City Lights (eyes/brows/mouth + ChatterBox);
- **B3** cartoon/Elastic-Toon billboard body;
- **C1** Curtain motif remains HOLD.

B2a first proves the official CSS3D YouTube plane in isolation, then aligns one iframe to the accepted B1 media face. No modal overlay.


## 2026-09-25 · B2a HUMAN_ACCEPTED · rear-side fix closed

Georg accepted the inline YouTube direction and requested one final correction before check-in:
the CSS3D video must never appear mirrored from the rear.

Implemented on PR **#199**:
- final runtime `89065825448846beb2649082fc0c1bf25df20ccb`;
- front remains inline/clickable;
- front/3/4 perspective preserved;
- CSS3D iframe is culled on the rear hemisphere by the accepted billboard panel world normal vs camera direction;
- original Kenney/WebGL billboard body owns the rear view;
- integration **29/29 PASS**;
- public Cloudflare **24/24 PASS**;
- Stage `cloudflare-live@983929385c3be74a42ec88c29f601c08b90b5a05`;
- public proof artifact `10836432703`;
- rear screenshot visibly shows the normal billboard backside with no mirrored iframe.

B2a is now **HUMAN_ACCEPTED / CHECKED IN**.

Exactly one next gate:
**B2b research/options memo for Living Mockup / Collage surfaces only.**
B2c Talking City Lights, B3 cartoon body and Curtain C1 remain unstarted/HOLD.
