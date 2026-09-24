# AN-PROFILE-02 · ToolBox Animation Studio consumption

Status: **IMPLEMENTED · STATIC + CHROMIUM PASS · HUMAN REVIEW OPEN**  
Date: 2026-09-24  
Owner: **KFB ToolBox / Stage-First integration**  
Existing integration PR: **#185**  
Branch: `chatgpt-web/toolbox-source-lock-2026-09-23`

## Goal

Turn AN-PROFILE-01 from a reusable metadata layer into a usable Clip Library surface inside the existing current ToolBox Animation Studio donor.

This slice does **not** create another Animation Lab owner. It extends the current Stage-First source:

`tools/KFB-ToolBox/stage-first/src/KFB Animation Lab v3.dc.html`

The older standalone Animation Lab node remains unpromoted/unverified.

## Source locks

ToolBox owner before AN-PROFILE-02:
`a6dff1a4e465433daea7f38618b3925db6714b90`

AN-PROFILE-01:
- PR #206
- exact accepted source head `032c9d50cd5de6764fa37fec65cb203ed35fcb11`
- final-head AN-PROFILE CI: SUCCESS

Motion Library:
- PR #197
- 33 clips each on Rig_Medium and Rig_Large
- source catalogue `kfb.motion-catalog.v1`

Architecture:
- Production Architecture v3 PR #204
- T4 · Animation Studio inside ToolBox = READY
- required Clip Library facts: compatibility, semantic group, duration/loop, root/travel, contacts/action markers, visual preview

## Implemented capability

The existing v3 Animation Studio now:
- loads the shared Motion Library/profile layer through one immutable read-only adapter;
- lazily loads the correct 33-clip GLB for the active Medium/Large rig;
- adds those clips to the existing `allClips() → selectClip() → AnimationMixer` path;
- adds semantic Motion filters and semantic search;
- shows source-backed state/gait, loop, direction/stance, root/travel, measured-derived reference speed, feet/hands, rate-window status and explicit action markers in the existing Data panel;
- surfaces the same profile facts in the existing Inventar/Gallery;
- visibly keeps unknown facts unknown.

## Protected boundaries

No:
- second AnimationMixer owner;
- second renderer;
- local copy of the 33-clip libraries;
- local copy of AN-PROFILE JSON;
- cross-rig copying of foot contacts;
- filename-derived markers;
- WorldBuilder runtime change;
- consumer movement/physics/gameplay ownership change;
- new persistence schema.

## Implementation files

- `stage-first/src/lab/motion-library.v1.js`
- `stage-first/src/KFB Animation Lab v3.dc.html`

Tests:
- `stage-first/test/an-profile-02.static.mjs`
- `stage-first/test/an-profile-02.browser.mjs`
- existing `.github/workflows/toolbox-coherent-integration-01.yml`

## Current evidence checkpoint

Runtime/CI head:
`93d9dd6f763c064313fe5d3bef690496487145a9`

Direct GitHub source sanity:
**32/32 PASS**

GitHub Actions:
run `36032905791` · job `107745811232` · **SUCCESS**.

Exact results:
- existing static owner/contract checks: **22/22 PASS**;
- AN-PROFILE-02 static integration checks: **34/34 PASS**;
- existing coherent-flow Chromium checks: **20/20 PASS**;
- AN-PROFILE-02 Animation Studio Chromium checks: **25/25 PASS**;
- KFB Motion/profile network failures: **0**;
- page errors in the Animation Studio proof: **0**.

## Review / Stage

Normal review is chat/local first.

Named future milestone route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/animation-studio/`

Current status:
**NOT PUBLISHED · NOT PUBLIC_VERIFIED**

Do not wait on Cloudflare for this slice.

## One next gate

Provide the current Animation Studio as the direct human review artifact and ask Georg to judge only the usefulness/readability of the 33-clip Library + measured Data surface.

Do not start WorldBuilder integration before that first consumer gate.


## Review transport

The two DC-based Chat wrapper attempts are frozen transport failures; see:
`REVIEW_TRANSPORT_FAILURE_RECOVERY.md`.

Current review source:
`tools/KFB-ToolBox/stage-first/review/an-profile-02-review.html`

This is a plain Three.js review adapter over the real pinned actor + Motion Library/profile sources.

Validation:
- run `36055391088` / job `107820911138`: **SUCCESS**
- plain review: **13/13 Chromium PASS**
- full final owner run: **114/114 PASS**
- 0 page errors
- 0 failed source/module requests

Use this plain review for Georg's current human gate. Do not revive the DC wrapper transports.
