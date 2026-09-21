# KFB Batch EyeRig Atlas

**Status:** IMPLEMENTED CANDIDATE · 27 Medium actors + 4 Large actors · Monstrosity Large calibration ready.

Owner: KFB ToolBox / Rigging.

Current brief:

`../_handover/EYE_RIG_BATCH_2026-09-18/START_HERE.md`

Source branch:

`toolbox/eye-rig-batch-2026-09-18`

First bounded actor:

`GothGirl · Rig_Medium · 23 joints`

Stage target:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

## What this candidate does

`exact actor source → verified source-eye cleanup → measured FaceHost → existing EyeRig v6 → review/tune → profile export`

The tool reuses the current EyeRig-v6 / FaceHost owners. It does not modify canonical GLB/GLTF files, create a second eye implementation, rewrite Resident Atlas recipes or introduce another animation owner.

GothGirl source-eye cleanup now uses current-source components **2 + 3** and a fail-closed identity signature (12 components, 69-triangle mirrored frontal eye pair). Components 6/7/8 are lateral accessories and remain preserved. The historical 6+7 interpretation is diagnostic history only.

v0 includes eyes, pupils, gaze, blink, upper/lower lids, splay, the six existing expressions, life/kinetics and motion regression. Lashes, brows, nose and mouth stay out.

See:

- `SOURCE.json`
- `docs/SOURCE_AUDIT.md`
- `docs/SOURCE_COMPONENT_IDENTITY_2026-09-19.md`
- `docs/source-components-0-11.html`
- `TEST_REPORT.md`
- `RETURN.md`
- `CHANGELOG.md`

Cross-render semantics remain aligned with:

`../docs/2D_ANIMATION_STUDIO_BRIDGE.md`

The existing `kfb.eye-profile/0.1-candidate` schema remains local/candidate. No global contract promotion is claimed.


## Review handoff

Draft PR: `#104` — not merged.

Publication mirror: `cloudflare-live@f309948a3bd265154e6d3f5c959b69ec9b725f26`.

The fixed Stage route is linked from the KFB Hub. Automated public verification is still open because the available environments cannot resolve/open `pages.dev`; Georg's normal-browser check is the next gate.


Public proof: GitHub Actions run `35457983922` · 17/17 PASS · 5 screenshots · 0 page/console errors.

The current GothGirl seed remains `AUTO_CANDIDATE`: screenshots show the default eye size (`ring=0.30`) is visibly oversized/protruding. Use the Stage workbench to tune Eye size → Inset → Spacing/Vertical before approval.


## Current corrected gate

Source identity checkpoint: `949ff8037df2da88eb91ef825984ef57870b8238`.  
Corrected Stage mirror: `cloudflare-live@c6489fce74f98b2124feb184becd27d2cbe4a922`.

The earlier 21/21 public proof remains useful runtime history but is **not** current 2+3 visual proof. The corrected Stage needs one human browser review: use the runtime-generated source-measured baseline, compare Front / 3/4 / Side and motion, then approve or reject. The profile remains `AUTO_CANDIDATE`.


## Current authoring surface

Georg's visual Medium starting seed is now:

`dx .295 · dy .045 · ring .153 · track .15 · pupil .34 · inset .40 · lidFit .90 · converge .18 · splay 0 · gloss .10`.

Additional current controls:

- eye Width / Height / Depth / inward Tilt via reused `eyeoval.v1.js`;
- pupil tracking: Life / Pointer / Fixed;
- permanent Batch bar with single-character + batch import/export;
- `Apply to Selected` and explicit `rigClass → character → session` inheritance;
- QA 4-view.

The runtime now exposes **27 Rig_Medium actors** through a real roster. Per-actor review state and overrides persist while the accepted Medium values remain the class default.

Deferred feature map: `docs/BATCH_FEATURE_BACKLOG_2026-09-19.md`.


## Rig_Medium actor browser

Catalog: `data/rig-medium-actors.v0.json`  
Evidence: `docs/RIG_MEDIUM_ACTOR_BROWSER_2026-09-19.md`

Current catalog size: **27 actors**.

Normal authoring loop:

`click actor → inspect → adjust only if needed → Approve / Adjusted + approve / Unsupported → Next unreviewed`

Roster filters:

- All
- Unreviewed
- Adjusted
- Unsupported

GothGirl keeps the exact verified source-eye cleanup. Other actors use the existing generic mirrored-front donor detector, fail-closed; if it cannot safely identify source eyes, nothing is removed and the actor remains available for manual review.

Current Stage mirror: `cloudflare-live@ae61e50d525e942a755cf46d0ed807b49b5a3e38`.

Large and Legacy remain out of scope until the Medium review wave has real results.


## Rig_Large calibration

Large is now available beside Medium.

Current verified Large set:
- Monstrosity
- Black Knight
- Demon Lord
- Orc Brute

Monstrosity is the first calibration actor. Large starts without an accepted class default. Tune Monstrosity and press **Set as Large default**; only then should the value be applied to the remaining Large actors.

Large motion uses the actual Large animation library. Idle / Walk / Run are available; Jump is intentionally unavailable in this slice because no matching Large jump clip exists.


## Accepted Rig_Large profiles

Georg's four reviewed Large profiles are now canonical per-character overrides in `data/rig-large-reviewed.v1.json`.

Lid color no longer uses the common pink fallback for generic actors. The runtime samples each actor's source head/face texture and passes that base into EyeRig v6, which applies the existing darker-lid treatment.


## Rig_Legacy · 17-head candidate batch

Legacy is now available as a separate source-first lane under `legacy/`.

Canonical candidate data:
- `data/rig-legacy-heads.v0.json`
- `data/rig-legacy-default.v0.json`
- `data/rig-legacy-auto.v1.json`

Technical evidence:
- 17/17 profiles persisted;
- 16 measured automatically;
- Skull remains HUMAN_REQUIRED;
- 247/247 generation browser PASS;
- 215/215 persisted-profile browser PASS.

This does not convert the 17 candidates into human-approved profiles. Review remains per head.
