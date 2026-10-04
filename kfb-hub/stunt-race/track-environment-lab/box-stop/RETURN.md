# Box Stop · BOX1 · RETURN

## IMPLEMENTED
Existing Environment site extended with Box Stop, 43 original vehicle candidates, four existing WS1 profiles, Original/Deformer comparison, shortlist storage/export, atomic preview/cancel/test-lap flow and 3D countdown. Kinetic 3D radio/tachometer, steady mode, and the original ten-track Jukebox. No rider skeletons. Several source karts contain static character meshes; no new driver rigs were mounted.

Exact donor core is consumed at f510a35f027148b7d6238fcb0ffec18848aecd25 with Git-blob verification. Vehicle source references retain their original pinned revisions. See asset-evidence.json. The old shader/deformation branch is not activated.

The accepted v0.8 host and its physics/constants/route bytes are preserved. A Race-owned session/presentation wrapper pauses the test drive and switches between old visual response and the new deformer. Original drive camera remains unchanged; the Box Stop preview and edge instruments have independent presentation cameras only. All shells share the unchanged contact proxy; visual scale is not a collision/handling certification.

## STATIC TESTED / BROWSER TESTED
Browser evidence is in evidence/browser.json. All 43 source vehicles were loaded, measured and rendered individually. Real driving/deformer checks used the Sedan: acceleration, drift, boost, jump/landing, mode switch. Also checked selection cancellation, countdown input lock, saved preferences/votes, A/B/seed operation and actual Van Metronome/next-track playback. Chromium headless/SwiftShader, desktop plus narrow viewport. Not a physical mobile-device test.

## VISUALLY ACCEPTED BY GEORG
PENDING for Box Stop, vehicle selections/profiles and Environment. Georg's earlier Audio A1 sonic direction remains accepted, not revoked by this release.

## OPEN / MISSING ANCHOR
Approved Audio A1 original source is still missing; only the existing Jukebox plays. No substitute soundscape was invented. True Kenney Facility main/pit/split/merge/overpass/ramp remains a separate coordinated Race/Environment step; current scene is the accepted Flow Loop. Box Stop currently opens through button or B, not a fabricated pit-entry anchor. The garage preview set is UI scenery, not a drivable pit lane.

Board/skate and ambiguous Poly fixtures use documented shell-only fallbacks. Wagon's inherited orientation default was corrected locally after actual browser evidence showed it upright on its nose; source asset bytes were not changed. Heavy/Mech profiles remain starting values. Missing Space Base sources are noted, not fabricated. No nonlinear bend shader or new rig work.

## Tests / history
Initial browser run 35294845342 loaded all 43 and passed 101 checks but timed out on the countdown: it accumulated the host's capped physics dt instead of real visible elapsed time. That clock is fixed without changing drive dt. Instrument text aspect/readability and countdown texture disposal were also corrected. Failure remains in Actions history, not reported as a pass.

## Recovery
Read RECOVERY.md and _handover/BOX_STOP_RADIO_FACILITY_DECISIONS_2026-09-18.md, then this RETURN, ACTIVATED.json, source modules and evidence. Do not rerun dated repair workflows after activation. Public folder is a deployment mirror only. Return pending device/human/source checks honestly.

## Release review addendum

The complete broad regression passed 120 checks at 0d301bff4e66ccccec20fe95e47e5ce39857f24f. Post-review adapter corrections are recorded in evidence/release-review.json. The Wagon required disabling both its old orientation preset and the heuristic upFix; source vertices are already Y-up. Release-candidate public URL checks are still pending here. No human acceptance is implied.
