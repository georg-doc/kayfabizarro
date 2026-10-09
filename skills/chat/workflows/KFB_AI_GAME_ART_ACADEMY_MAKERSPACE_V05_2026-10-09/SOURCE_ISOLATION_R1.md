# SOURCE ISOLATION R1 · Academy donor evidence and decision

**2026-10-09 · Source identity verified, visual isolation NOT COMPLETE.**
**Owner:** KFB AI Game Art Academy/Maker Space only (no World/MediaSurface runtime edits).
**Base branch:** `planning/kfb-ai-game-art-academy-makerspace-v05-2026-10-09`. **Source pins:** upstream `theringsofsaturn/3D-ai-school-threejs` default `master`, tree `655d4f52c9382a06f09b92d04ad839b457eafb7f`; KFB Travel files read from `main`.

## A. Untouched external classroom

Source objects are **real, individually identified**:
- `src/components/Experience.jsx` blob `8bc1b417fa60b90af37ec64a9a3acec178611d18`;
- `public/models/Classroom.jsx` blob `dfc7f71c0422f11684f36b0aebe97222bb692625`;
- `public/models/classroom.glb` (located, binary rendering unverified);
- `public/models/Emilian.jsx` blob `1b144aefac65496027165a98aa84e3cd8bc01ef8`;
- `public/models/emilian-avatar.glb` (located, binary rendering unverified);
- `src/components/chat/Chat.jsx` blob `994b09c4a296994e054e40fff019b3c9a584af28`.

`Experience` mounts React Three Fiber `Canvas`, `CameraManager`, sunset environment, pink ambient light, `Classroom` and `Emilian`. Classroom is a detailed scene: board, books, shelves, windows, teacher desk, student desks, clock and additional props. Teacher is an animated skinned Avaturn-style human avatar, not a KFB Clay Resident. Its code plays `IdleV4.2(maya_head)` via an animation mixer.

`Chat.jsx` is HTML overlay with browser speech recognition and speech synthesis; POST to `http://localhost:3001/api/chatgpt`. This confirms chat presentation is not diegetically integrated into the 3D objects. Prior research rejects legacy proxy/backend for KFB.

**Source-level judgment:** KEEP the spatial idea of tutor+stage+objects, ADAPT interaction composition only; REJECT existing backend, default human avatar as character canon, original classroom GLB as KFB art target, and React/R3F whole-app transplant. **Visual status:** NOT RUN — no screenshot/isolated browser execution. This is not yet a source-isolation PASS.

## B. Current KFB Academy lesson

Actual existing source:
- `travel/KFB Travel Combat v25/terrain-v25/academy-lessons.js` blob `68d2ce26f438789b24fd4bb6f5c3567d91bf658b`;
- `travel/KFB Travel Combat v25/terrain-v25/academy-live.js` blob `7c8b4b842f43541909f63ca7fe9a040e78d11cc9`;
- `travel/KFB Travel Combat v25/terrain-v25/academy-deck.js` (30-lesson curriculum, 5×6; earlier v0.5 recovery).

The `misc_controls_drag` lesson contains eight geometries with Raycaster select/drag, orbit camera and an explicit `onPointer(u,v,type)` contract; this is the preferred first Maker Space lesson because it proves input, visual object motion and shared renderer compatibility. Alternate `webgl_instancing_dynamic` lesson contains 1200 animated instances to demonstrate draw-call economics.

`academy-live.js` owns no renderer, canvas or rAF; existing renderer draws `lesson.scene` with `WebGLRenderTarget`, then maps the texture onto the existing Card window. It uses 896px RT size, 0.35s settle, `dt<0.04` launch gate, UV pointer forwarding and explicit disposal/exception handling. **Source-level judgment:** KEEP lesson adapter semantics, ADAPT receiving surface from existing Card window to the **existing** Billboard/MediaSurface owner by permission; do not assume an arbitrary remote three.js example has the same lesson adapter.

**Visual status:** NOT RUN. No screenshot of exact lesson, no real pointer outcome, no performance test.

## C. Existing KFB media receiver

Source contract: `overworld/docs/MASTERPLAN_overworld.md` defines `MediaSurface { ar, type: card|video|three|html, src, frame }`. Existing product ownership is clarified in `skills/chat/recovery/KFB_ISLAND_MVP_FROZEN_MATRIX_2026-10-07.md` F-R35 and F-R36: Billboard/MediaSurface and HyperNormalisation/Quote consumers remain separate authoritative owners.

Source candidates for a **true receiver isolation**:
- `tools/KFB-ToolBox/_inbox/KFB Billboard Media Szene · B0 Source Proof/BILLBOARD_B0_SOURCE_PROOF_2026-09-24/bb-scene.js` (B0 source proof);
- `tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H13/kfb-collage-session-2026-09-30/KFB Billboard Kaleidoscope H13.dc.html` (later design candidate, not automatically current runtime);
- current WB2 consumer on PR #348 must be checked against exact live owner before connecting anything.

**Source-level judgment:** existing MediaSurface/Clay Billboard route is the receiving family; do NOT create parallel Academy-specific billboard, PDF renderer or new world runtime. **Visual status:** NOT RUN — current receiver runtime/actual source object still to be visually pinned.

## Isolated source evidence matrix

| Proof | Exact source located | Original visually isolated | Browser tested | Integrated |
|---|---|---|---|---|
| A · classroom + teacher + chat | YES, code + asset paths | NO | NO | NO |
| B · KFB Drag lesson + RTT | YES, code | NO | NO | NO |
| C · KFB MediaSurface receiver | source candidates + contract | NO | NO | NO |

**Source inventory assertions 3/3; visual Source-Isolation gate 0/3.** This is a bounded **PREP RESULT**, not a product PASS.

## Recommended first lesson specification

**Lesson:** `misc_controls_drag` — *Move an Object, Explain a Coordinate*.
**User journey:** approach existing Maker Space stage → see eight movable objects on the existing MediaSurface → select one, move it along the ground plane → explain world/local movement to tutor → place it in a requested arrangement → save optional independent Academy lesson receipt → restore world view.

**Initial scope:** no portal, no new rig, no live Blender MCP, no user-auth service, no arbitrary GLSL execution. Focus on genuine existing source object's visual fidelity + UV pointer delivery on current KFB receiver, then add tutor in a later step.

## Exactly one next gate

**ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1**: In a browser-capable isolated executor, run three **untouched** source objects separately and capture their actual visual states, renderer/browser versions and input outcomes. Only then allow KEEP/ADAPT/REJECT as an evidence-backed human choice, followed by a tiny integrated lesson on the existing receiver. Do not use old external backend. No World R5, no public Stage, no Live.
