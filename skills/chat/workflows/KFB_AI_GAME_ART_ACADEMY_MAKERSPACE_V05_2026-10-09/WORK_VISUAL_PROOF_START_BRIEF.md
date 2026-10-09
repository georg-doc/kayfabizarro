# NEXT EXECUTOR BRIEF · ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1

**State:** READY FOR BROWSER-CAPABLE EXECUTOR · not yet run.
**Read first (in order):**
1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/workflows/KFB_AI_GAME_ART_ACADEMY_MAKERSPACE_V05_2026-10-09/START_HERE.md`
5. `skills/chat/workflows/KFB_AI_GAME_ART_ACADEMY_MAKERSPACE_V05_2026-10-09/SOURCE_ISOLATION_R1.md`
6. `skills/chat/workflows/KFB_AI_GAME_ART_ACADEMY_MAKERSPACE_V05_2026-10-09/ACADEMY_FIRST_LESSON_DRAG_V01.json`
7. `skills/chat/workflows/KFB_AI_GAME_ART_ACADEMY_MAKERSPACE_V05_2026-10-09/ACADEMY_FIRST_LESSON_TEST_REPORT_V01.md`
8. `skills/chat/workflows/KFB_AI_GAME_ART_ACADEMY_MAKERSPACE_V05_2026-10-09/RECOVERY_CURRENT.md` and `skills/chat/workflows/KFB_AI_GAME_ART_ACADEMY_MAKERSPACE_V05_2026-10-09/RETURN_CURRENT.md` when present.

**Owner:** KFB AI Game Art Academy / Maker Space · source-proof evidence only.  
**GitHub:** `georg-doc/kayfabizarro`, branch `planning/kfb-ai-game-art-academy-makerspace-v05-2026-10-09`, no PR yet. Fresh executor fetches exact latest head; DO NOT trust an older hash.  
**Recommended next executor:** **ChatGPT Work/WSA with browser + terminal + GitHub access**. Claude Code with a real browser is an acceptable alternate; not a parallel writer.  
**Status:** no World/R5/PR #348 changes, no new scene/rig/material/media owner, no merge, no Live.  
**Human gate:** None until there is a genuine side-by-side source-visual choice. If visual A/B choice matters, ask Georg **KEEP / ADAPT / REJECT**, but do not manufacture a gate from test diagnostics.

## Outcome — exactly one

Prove **three unchanged source objects individually** in actual Chromium:
A. external 3D AI classroom and teacher;
B. original KFB `misc_controls_drag` lesson and UV/drag interaction;
C. source-proven, current KFB Billboard/MediaSurface receiving object.

Capture actual screenshot(s), short clip if helpful, console/network errors, exact source pins, actual renderer/browser, whether interaction worked. Do **not** build a combined Maker Space island in this task. Existing Island MVP R4 is STOPPED.

## Source A

`theringsofsaturn/3D-ai-school-threejs` original default `master`, tree `655d4f52c9382a06f09b92d04ad839b457eafb7f`; verify exact upstream commit before fetching. `src/components/Experience.jsx` source blob `8bc1b417fa60b90af37ec64a9a3acec178611d18`; untouched classroom `public/models/classroom.glb` blob `9dfa936252e451574bc31291c69a8f44608162e0` (31,207,652 bytes); avatar `public/models/emilian-avatar.glb` blob `659dfedeab863643b7737326e520b92b5725a797` (4,933,284 bytes). Keep the real `Classroom.jsx`, `Emilian.jsx`, `CameraManager.jsx`, front-end `Chat.jsx` but DO NOT run original proxy-server, access tracked .env, send user data/API keys, or promote frontend backend as a KFB service. An original app image without active AI responses is valid A source proof if the actual GLBs and source scene render. If CORS/errors prevent a faithful reproduction, report exactly that rather than substituting a generic classroom.

## Source B

Existing KFB:
- `travel/KFB Travel Combat v25/terrain-v25/academy-lessons.js` blob `68d2ce26f438789b24fd4bb6f5c3567d91bf658b`
- `travel/KFB Travel Combat v25/terrain-v25/academy-live.js` blob `7c8b4b842f43541909f63ca7fe9a040e78d11cc9`.

Source isolate one **actual `initLesson(THREE,'misc_controls_drag',ctx)`** using a disposable visual test harness with current Three.js. The harness supplies only a renderer/host; do not rewrite `initDrag`. Check pointer UV→NDC, click on body, dragging on plane, release, orbit on empty space, dispose; return canvas screenshot plus before/after movement evidence. Then, separately prove the existing `academy-live.js` as the same-renderer RTT path when runnable; do not claim a B PASS on a screenshot alone if the interactive path fails.

`ACADEMY_FIRST_LESSON_DRAG_V01.json` is **content**, not a new runtime or acceptance substitute; its static 12/12+9/9 checks do not replace visual B.

## Source C

Existing source contract `overworld/docs/MASTERPLAN_overworld.md`: `MediaSurface {ar,type:card|video|three|html,src,frame}`. Current World matrix F-R35/F-R36 separates Billboard receiver from quote/HyperNormalisation data owner. Start with `tools/KFB-ToolBox/_inbox/KFB Billboard Media Szene · B0 Source Proof/BILLBOARD_B0_SOURCE_PROOF_2026-09-24/bb-scene.js` (blob `235b062f9d575a49a4c98d8be57d04d43acc2213`), including source-proven Kenney Racing Kit Billboard geometry/measurements; inspect later H13 only as candidate, NOT accepted current World runtime. Confirm which receiving component the current WB2/owner actually uses before proposing an adapter; PR #348 R4 remains failed/no Golden. Source-isolate the *actual* Billboard object and a real source-backed media face. No invented panel/shader substitute.

## What to return

- 3 source-isolated visual proof receipts A/B/C, explicit PASS/FAIL/UNKNOWN each.
- Screenshot/short clip paths, exact source hashes, Chromium/browser and rendering versions, console errors.
- One 3-column KEEP/ADAPT/REJECT table grounded in **visuals**, not filenames.
- Actual tests and counts; separate source checks from interaction/render tests.
- Exactly one next gate: **Academy single-stage lesson integration through existing Billboard/MediaSurface** if visual R1 truly PASSES, or **smallest blocked source seam** with evidence if not.
- Publish no new GPT Site/Cloudflare route unless specifically needed and authorized for public review. Formal public KFB Stage only direct `https://kayfabizarro.pages.dev/...` linked from the KFB Hub.
- Persist Return in existing Academy branch and Production Control; verify branch after every write; never auto-merge.

## Responsibility split

**Builder / only writer:** browser-capable Work/WSA assigned to the Academy source-proof branch.  
**Integration Tester:** separate read-only verification of screenshots, source identity and input actions.  
**Independent Critic:** different context to compare actual images, source fidelity, KFB style/owner boundary; no production writes.  
**Production Guard:** decides continue/repair/defer/stop for exact Academy proof only.  
**Georg:** no action until a genuinely visible decision is required.

This brief does not authorize World Island MVP R5 or production runtime implementation.
