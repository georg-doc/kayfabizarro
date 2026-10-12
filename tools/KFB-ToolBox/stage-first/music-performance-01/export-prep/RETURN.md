# RETURN · KFB Motion-to-Video Export Prep R1

Date: 2026-10-12  
Mode: **BOUNDED PREP + REAL-SOURCE FRAME-PLAN TESTS**  
Status: **FRAME_PLAN_CI_PASS · RENDER/MUX_UNIMPLEMENTED**  
Repo: `georg-doc/kayfabizarro`  
Owner: existing KFB ToolBox MUSIC-PERF-01 / Draft PR #207 (parent ToolBox PR #185)  
Prep branch: `planning/kfb-motion-to-video-prep-r1-2026-10-12` · Draft PR **#391**, base `web/music-perf-01-2026-09-24`  
Parent original commit: `aef93c2521a0818318e0810752f065727c1e5622`  
Actual tested prep head: `3ce484f638d4e2bb592797cb9b6fa8435b0ace46`  
Final post-handoff head: inspect GitHub PR #391 branch ref after the metadata write (not asserted by this file).

## Actual outcome

The existing tested ORB Song+Resident performance (Rubbish Groove, original ORB-P1 v5 Leader/Guitarist PASS, Drummer HOLD) is now consumable by a pure deterministic frame-time contract without changing its song clock, 3D actor mesh, actions or runtime. Profile = 1280×720, 30 fps, 8.000s, 240 frame indices, audio crop [0.465,8.465) seconds, all action times computed from original 100-BPM beat geometry. There is still **no actual rendered video output**.

First original-source visual isolation is already part of the older MUSIC-PERF donor review; it must be shown/verified again for the real video capture implementation, which was not attempted here.

## Files changed (relative to parent PR #207)

- `export-prep/START_HERE.md` — read-first, source/mux/browser export acceptance contract
- `export-prep/SOURCE_MANIFEST.v1.json` — exact donor/source/song references and protected owners
- `export-prep/frame-plan.mjs` — pure 240-frame deterministic time-addressing, no new runtime clock
- `export-prep/test/frame-plan.test.mjs` — 37 real-source, frame/replay and negative-control checks
- `export-prep/TEST_MATRIX.md` — actual CI evidence boundaries
- `export-prep/RETURN.md` — owning prep Return, unresolved items, next gate
- `export-prep/CHANGELOG.md` — additive prep milestone history
- `.github/workflows/music-to-video-export-prep.yml` — branch/PR scoped Node22 check job
- existing `music-performance-01/RETURN.md` and `CHANGELOG.md` — additive pointer only, no baseline overwrite

## Tests and evidence (ACTUAL, not estimates)

Run `38278887068` · job `114911015201` · **SUCCESS**
- source/authoring acceptance + real Git blobs + clock contract + 240-frame deterministic sampling/negative controls: **37/37 PASS**;
- Node22 syntax check: **PASS**;
- real 3D pixel captures **0**, browser video export checks **0**, encoded video files **0**, audio mux/decode sync proofs **0**, image hash visual repeat checks **0**;
- on the same pre-handoff head, inherited baseline MUSIC-PERF QA run `38278887147`: **SUCCESS** (historical ToolBox runtime unchanged; not new video acceptance).
- GitHub intended file readbacks checked after each branch write (implementation 3/3; test stage 4/4), head checked. Parent PR #207 was not touched.

Direct CI evidence:
https://github.com/georg-doc/kayfabizarro/actions/runs/38278887068

## Protected / deferred

- MUSIC-PERF #207 visual human gate remains **PENDING**; no change to its published Stage candidate;
- Audio Site PR #365 / Voice PR #379 untouched;
- Motion library/KayKit native PR #344 untouched; World R4 remains STOPPED;
- No adopted MediaBunny, Remotion/web-renderer or FFmpeg integration; must benchmark browser compat/license/codec before adoption;
- No new Site, new UI, public route, Cloudflare deployment, runtime owner, Live or merge. Old MUSIC-PERF public review Stage is a historical proof **for the old player only** and must not be presented as a video-export surface.
- A true offline/independent frame `seek(t)` path must be added downstream to the existing Three.js scene/mixer without silently reimplementing AudioContext/mixer/audio clock. Decode existing MP3 once, trim and mux frames+audio accurately, handle browser codecs/fallback.
- Studio capture should not be coupled to stopped World R4 or depend on per-video WSA tokens.

## Exactly one next productive gate

`MOTION_TO_VIDEO_8S_REAL_FRAME_CAPTURE_AND_AV_MUX_R1`:
source-isolate ORB model visually, capture exactly 240 real frames at the contract's deterministic timestamps in a repo-native/Playwright browser, mux the original Rubbish Groove audio crop with correct PTS, verify playback+audio sync+frame hashes+fallback. Preserve #207's frozen UI/runtime gate; use child implementation and only publish into an existing GPT Site after product QA and authorized receiving owner access. No human action required now specifically for export prep; Georg's pre-existing PR #207 PASS/TUNE/REJECT gate is separate.
