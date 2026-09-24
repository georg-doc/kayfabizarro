# WSA / Work focus handoff · 2026-09-24

Status: **MINIMAL WORK PACKET · ONE CURRENT EXECUTION TASK**

This handoff intentionally removes everything that does not need a Work session.

Current product focus:
**World Building · Resident Scenes · ToolBox · Car Racer**

Read this file first. Do not replay the architecture chat or re-audit the whole ToolBox inbox.

Detailed Flow intake classification, only if needed:
`FLOW_DESIGN_INTAKE_TRIAGE_2026-09-24.md`.

## What Work should execute now

### Car Racer · TRACK_A real Rapier runtime proof

Owner repo:
`georg-doc/KFB-Stunt-Car-Race`

Current top RKIT candidate:
Draft PR #39 · `chat/rkit-06-trankgasse-2026-09-24`
head `53219c9b7ee3d1abe0ef1b0e5364863b42014ea5`.

Read only:
1. `_handover/RKIT_TRACK_KIT_2026-09-24/RKIT_KIT_GUIDE.md`
2. `_handover/RKIT_TRACK_KIT_2026-09-24/RACE_BRIEF_TRACK_A_RAPIER_TEST.md`
3. `KFB Cologne Race Option C-3/rkit-05/RACE_BRIEF_ADDENDUM_RKIT05_FLAP_RETURN.md`
4. current Race runtime owner/CONTRACT in `race/`.

Outcome:
load the current baked TRACK_A geometry into the **existing Race/Rapier host** and measure it with the real vehicle/contact model.

Protect:
- no new physics world;
- no second Race host;
- no RKIT geometry editing inside Race;
- no camera/vehicle/gravity retune;
- island/default world remains unchanged;
- Race owns contact/takeoff/landing/recovery/flap collider motion;
- RKIT remains geometry + metadata owner.

Required proof:
- existing Race baseline stays green;
- TRACK_A loads at metre scale through existing collision path;
- real jump table for Hero + tabletop;
- one driven/scripted main-line pass;
- pit-lane pass;
- static-open/closed flap-return checks from the RKIT-05 addendum;
- record seam/contact/recovery findings by route position;
- screenshots only for the requested landing/bridge evidence;
- return findings to RKIT; do not silently tune RKIT geometry from Race.

Stop if a required fix belongs to RKIT/WorldBuilder rather than Race.

No merge or Live promotion without Georg's gate.

## Do NOT spend Work on these now

### Audio
AUDIO-CAL-01 is already human accepted.
Remaining source-bank/voice metadata work is ordinary Web/curation work.

MUSIC-PERF-01 is technically public-verified and waits only for Georg's human review at:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/music-performance/`

No Work task.

### ToolBox
The coherent ToolBox and its real Animation Studio/Motion Library consumer are technically green in direct owner/browser tests.

The current failure is only the separate Chat-review transport around AN-PROFILE-02. It is not a product-runtime failure and must not consume Work.

Do not re-audit the ToolBox, rebuild Animation Studio or create another review runtime.

### World Building
WORLD-ZONE-BAKE-01 already recovered through source lock → deterministic compiler → committed Cologne package → real-browser load/place/reload proof.

The new Flow Cologne shell is presentation-only and has a clean adapter seam.

Next task is `WB-ZONE-SEAM-01`, suitable for Web/GitHub:
connect the Flow shell to the proven baked Cologne package through `wd1-seam.js` only.

No Work task.

### Resident Card Speculation
The Flow export is a thin scene candidate with real Driver Graft, GothGirl and real Card.

Next gate is Georg's face/mouth visual acceptance.
After that, ordinary Web can mount it into one existing host.

No Work task now.

### Resident Band / Atlas S8
Keep the browser pose/edit work and accepted actor/prop data.

Do **not** promote the export-local `kfb.resident-band-module/1` as a new production runtime. Reconcile accepted data into the existing Resident scene + `kfb.resident-performance.v1` owners.

Next gate is Georg's visual/pose decision, not Work.

## Current non-Work queue

1. **Web/GitHub:** WB-ZONE-SEAM-01.
2. **Human:** MUSIC-PERF PASS/TUNE/REJECT.
3. **Human:** Resident Card faces/mouths.
4. **Human:** Resident Band guitarist/trumpeter/drummer pose.
5. **ToolBox owner:** preserve green runtime; do not spend another Work pass on the review wrapper.
6. **Web/GitHub after human gates:** reconcile accepted Resident scene/performance data into existing owners.

## Return required from Work

Return only for the Racer task:
- exact Race repo/branch/PR/head;
- files changed;
- existing owners retained;
- actual baseline + TRACK_A test results;
- jump/flap/pit findings;
- screenshots requested by the Race brief;
- unresolved items classified as Race vs RKIT vs WorldBuilder;
- exactly one next gate.

No cross-project cleanup, no Hub redesign, no broad inbox processing.
