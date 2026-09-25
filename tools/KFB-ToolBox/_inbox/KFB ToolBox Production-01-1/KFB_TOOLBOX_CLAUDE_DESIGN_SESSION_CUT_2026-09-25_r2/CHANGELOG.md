# CHANGELOG

## 2026-09-25 r1
- NEW KFB ToolBox Production-01.dc.html (TOOLBOX-PRODUCTION-01)
- FIX contact bands (AN-PROFILE-01 interval shape {frames:[a,b]})
- FIX clip popover clipped on short viewports
- FIX header overlap; responsive compact header; inspector toggle for split-screen
- FIX orbit camera: frame watchdog 16 ms, damping, dbl-click pivot, pan/zoom limits
- DOC handover/RETURN_TOOLBOX_PRODUCTION_01.md, github.md sync block

## 2026-09-25 r2 · continuation (Georg PROCEED PASS on r1)
- FIX (owner) pose-rig.v1 chains measured from world positions incl. wrist/intermediate bones; live re-measure in _solve; leg chains; public ikChain/effector/solveIK/chainReport → kfb-lib/pose-rig.v1.js + patches/
- REMOVE ToolBox-local IK re-measure (up to 4 passes) — Studio and Lab use the owner
- NEW kfb-lib/locomotion-profiles.v1.js · 14 semantic roles on KayKit 1.1 Rig_Medium, measured per actor, variants explicit, consumer view
- NEW Lab inspector sections Clip · State · Ears · Band; State preview (locomotion + jump), camera follows
- NEW actor FrizzleBob · Ear Rig v5 (PR #214 fixture); ear-dangle.v1.js integrated; EAR-DANGLE-01 run + review record; take-off/landing impulses from measured events
- NEW Driver Graft stock + MovementAdvanced
- NEW Studio › Fit (CARD_SURF seam) · Studio owners roadmap in Body · Solver gate A/B/C in Pose
- NEW Stage Resident Band · S39 (no baseplate) with wd-sky real sky + wd-light BASELINE values
- NEW timeline contact bands for stock clips from the measured profile
- TEST self-test 13 → 19 steps
- DECISION (measured) walk.fast = Walking_A ×1.3 (Walking_B +9.8 % < +10 %); sprint = Running_B (+22.1 %) on FB Ear Rig v5
- FIX (verifier) Lab › Band › Measure: drumContact keys are lowercase 'r'/'l' in band-module.js (was 'R'/'L' → undefined head)
