# BILLBOARD MEDIA · Living Plan

Status: **CURRENT LIVING DOCUMENT · ADDITIVE**
Date started: 2026-09-24
Owner: **KFB ToolBox / Billboard Media Residency**
Current source chain: **B0 accepted → B1 HUMAN_ACCEPTED → B2a HUMAN_ACCEPTED → B2b RESEARCH COMPLETE / CHOICE PENDING**
Current B1 PR: **#198**
Current accepted B1 branch/head: `chatgpt-web/billboard-b1-2026-09-24@d54273d30f5465df36b33ee13c896a0ee6f95ca7`

This document is the recovery/planning SSOT for the Billboard media line. Older decisions remain below in the additive changelog; new work appends rather than rewriting history.

## Product idea

One reusable KFB billboard body, with a single media-surface contract and multiple presentation adapters:

`CARD · COVER · VIDEO_CSS3D · SLOGAN · COLLAGE · KFB_FACE`

The billboard is not a second card/video/face owner. It consumes existing owners and presents them on the accepted media face.

## Protected foundation

### B0 · source proof · accepted
- exact Kenney donor: `media/3D_Assets/kenney_racing-kit/Models/GLTF format/billboard.glb`;
- donor pin: `378b209355b13304e3cff656ec0806ca5b89df28`;
- measured ad face: **4.20 × 2.10**;
- epsilon seam retained;
- B0 files protected byte-for-byte:
  - `bb-scene.js` blob `235b062f9d575a49a4c98d8be57d04d43acc2213`;
  - `bb0-boot.js` blob `57392b87c0344648695e1ef6d62f6f70a9dd942b`.

### B1 · content-fit face · HUMAN_ACCEPTED
- real card quarter;
- real cover;
- Travel-owned YouTube poster + player behavior;
- large ChatterBox slogans;
- content aspect drives billboard-holder X-scale so face + posts/frame remain one object;
- accepted public route: https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b1/
- accepted runtime: `58a8b92d55548c6436ac60b15b521d8eff269afd`;
- Georg acceptance: **2026-09-24 · “Okay, das passt gut.”**

B1 stays a recoverable checkpoint. B2 work forks it; B1 is not rewritten into B2.

## ACCEPTED · B2a · inline YouTube / CSS3D surface

### Goal
YouTube plays **directly on the billboard face**, not in a modal or detached viewer.

### Verified donor
Official Three.js example:
`mrdoob/three.js/examples/css3d_youtube.html`

Runtime-compatible pin:
- Three.js tag: **r160**
- commit: `d04539a76736ff500cae883d6a38b3dd8643c548`
- pattern: `CSS3DRenderer + CSS3DObject + iframe`
- donor interaction rule: iframe input is blocked while camera drag is active.

### B2a seam
- keep B1 WebGL billboard/body/camera;
- add one CSS3D scene/renderer;
- one YouTube iframe is spatially aligned to the measured B1 ad face;
- the CSS3D face copies the real panel world transform, including B1 content-fit X scaling;
- only `VIDEO` mode shows/enables the iframe;
- other modes remain the existing B1 CanvasTexture path;
- no modal overlay;
- mode exit unloads/stops the iframe;
- no new media-owner abstraction beyond this adapter.

### Source-first gate
Before integration, the official r160 CSS3D YouTube plane must run in isolation and be screenshot/browser-proved.

### Done when
On the direct Cloudflare B2a route:
1. card/cover/slogan still match B1;
2. VIDEO shows the real YouTube iframe on the 3D billboard face;
3. iframe follows orbit/perspective and B1 aspect;
4. player is clickable inline;
5. no detached modal opens;
6. switching away from VIDEO unloads/hides the player.

## PLANNED · B2b · Living Mockup / Collage surface

Status: **RESEARCH / PROPOSAL · NOT STARTED**.

Direction reference:
- WithSeismic “Living mockups / LED walls”;
- Reddit description: lighting maps + reflections + masks + shaders for believable browser display surfaces.

Do not copy its editor. KFB only needs a small presentation module.

Proposed layers:
1. **Content** — image/video/card/text/collage source.
2. **Surface treatment** — subtle LED/pixel structure, vignette/falloff, controlled glow.
3. **Believability** — reflection/light overlays, masks, environment tint.
4. **Motion** — slow pan/zoom/tint/exposure and bounded cut/blend changes.

First implementation should use a **small curated asset pool + deterministic seeded compositions**, not a large generative editor.

Potential later pools:
- KFB cards/covers;
- public-domain historical drawings/photos;
- headlines/typographic fragments where licensing/provenance is explicit;
- local short video loops where rights are clear;
- authored cartoon motifs.

Research still required before implementation:
- public-domain / open-license source pools suitable for automatic use;
- exact asset/provenance manifest;
- non-repetitive loop strategy and cache/performance budget;
- whether video fragments stay local `VideoTexture` assets while YouTube remains CSS3D.

## PLANNED · B2c · KFB Talking City Lights

Status: **PROPOSAL · NOT STARTED**.

A billboard can become a KFB face rather than only a screen:
- KFB/Irex eyes;
- brows;
- large mouth;
- optional nose;
- blink/gaze/emote;
- simple talking mouth states;
- ChatterBox text/ads around or behind the face;
- authored cartoon overlays/motifs.

Reuse the existing KFB semantic EyeRig/face/mouth owners where technically compatible. Do not invent a second eye vocabulary.

First target should be visually simple: `idle · talking · surprised · angry · smug`, before audio/viseme sophistication.

## PLANNED · B3 · cartoon billboard body

Status: **DEFERRED UNTIL MEDIA SURFACE IS STABLE**.

Goal: reduce the current rectangular/hard-edged Kenney silhouette and bring the support/body toward the KFB Elastic Toon language.

Decision rule:
- shader/material/very light deformation → Web slice first;
- real silhouette/topology/rounded-cap/post redesign → Blender MCP candidate.

The accepted Kenney body remains the source. No replacement generic billboard is permitted.

## RELATED · Curtain C1

Still HOLD while the Billboard media line is active.
Curtain v2 remains the accepted donor base; no restart.

## Recovery order

Fresh chat:
1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/session-entry-use-what-works_v1.md`
5. this document
6. current slice `RECOVERY.md` + `RETURN.md`
7. exact GitHub branch/PR/head

GitHub state overrides Dropbox/chat copies.

## Additive changelog

### 2026-09-24 · B0
- Kenney billboard source proof accepted.

### 2026-09-24 · B1
- content-fit face, card quarter, cover, video poster/player and slogan implemented;
- one black-surface visual failure repaired without touching B0;
- public 21/21 browser PASS;
- **HUMAN_ACCEPTED by Georg**.

### 2026-09-24 · B2 planning
- CSS3D inline YouTube made the next bounded slice;
- official Three.js r160 donor pinned before implementation;
- Living Mockup/Collage retained as B2b research/implementation lane;
- KFB Talking City Lights retained as B2c;
- cartoon body retained as B3;
- Curtain C1 remains HOLD.


### 2026-09-24 · B2a implementation + timeout recovery
- official Three.js r160 CSS3D donor isolated first: **9/9 PASS**;
- first integrated candidate preserved as visual fail (**26/28**, black hidden CSS3D plane);
- repair pass 1 switched visibility ownership to `CSS3DObject.visible`;
- integration: **27/27 PASS**;
- direct inline iframe, no modal, 16:9 face, perspective follows camera, unload on exit;
- Stage wrapper published at `cloudflare-live@be24c154889fb96c20e99ef2b86dd2ced44007be`;
- public proof: **22/22 PASS**, 0 page errors, 0 tracked HTTP errors;
- public route: https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b2a/;
- a timeout occurred during handoff, but recovery inspection proved all intended writes existed; no duplicate retry;
- **current gate: Georg B2a PASS/TUNE**;
- B2b/B2c/B3/C1 remain unstarted/deferred as previously recorded.


### 2026-09-25 · B2a rear-side correction · HUMAN_ACCEPTED
- Georg's conditional acceptance identified one remaining issue: mirrored YouTube on the billboard rear;
- CSS backface-only attempt failed the rear gate (**28/29**);
- final seam uses the accepted panel world normal against camera direction to show CSS3D only on the front hemisphere;
- original Kenney/WebGL rear body therefore owns the backside exactly as in the other media modes;
- final runtime `89065825448846beb2649082fc0c1bf25df20ccb`;
- final integration **29/29 PASS**;
- final public Stage `983929385c3be74a42ec88c29f601c08b90b5a05`;
- final public **24/24 PASS**;
- public artifact `10836432703`;
- rear screenshot visibly shows no mirrored iframe;
- B2a closed as **HUMAN_ACCEPTED**.

Current next gate:
**B2b research/options memo for Living Mockup / Collage surfaces; do not implement before selection.**


### 2026-09-25 · B3 rounded-cartoon body handover prepared
- WSA / ToolBox 3D handover prepared at:
  `tools/KFB-ToolBox/_handover/BILLBOARD_B3_CARTOON_BODY_WSA_HANDOVER_2026-09-25.md`;
- goal: rounder/chunkier cartoon 3D billboard body while preserving the accepted media face and B2a front/rear semantics;
- exact Kenney `billboard.glb` remains the starting donor;
- Web deformation is allowed only for a small non-destructive silhouette pass;
- Blender MCP is explicitly allowed/preferred when real rounded topology, casing, posts/supports or authored asymmetry are needed;
- first gate is source-object isolation + same-camera before/after front/3/4/side/rear comparison;
- B3 is **PREPARED / NOT STARTED**;
- Georg asked to run **B2b Living Mockup / Collage research first**.


### 2026-09-25 · B2b research complete
- Draft PR **#211** / `chatgpt-web/billboard-b2b-research-2026-09-25`;
- no runtime change;
- options memo: `tools/KFB-ToolBox/_handover/BILLBOARD_B2B_RESEARCH_2026-09-25/OPTIONS_MEMO.md`;
- existing Gate-1 `drawCollageFace()` + `BillboardContent` is the reuse donor;
- recommended first POC: **A+ CanvasTexture compositor** with deterministic no-repeat recipes, small provenance-tracked pool and light Living Screen treatment;
- RenderTarget remains later escalation; authored VideoTexture loops remain optional companion mode;
- CSS3D collage and full editor are rejected as foundations;
- external media must be curated into the normal asset/registry pipeline with explicit rights/provenance;
- strongest first external pools: Smithsonian CC0, LOC Free to Use/Reuse + Chronicling America, Europeana PDM/CC0 allow-list, Wikimedia PD/CC0 allow-list;
- B3 rounded-cartoon body WSA/Blender handover remains prepared separately;
- **current gate: Georg chooses B2b-P1 option/tone or B3 first/parallel.**
