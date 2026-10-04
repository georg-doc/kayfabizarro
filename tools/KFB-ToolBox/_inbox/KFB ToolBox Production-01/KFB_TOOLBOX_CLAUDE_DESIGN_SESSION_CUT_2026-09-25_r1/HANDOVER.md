# HANDOVER · KFB ToolBox · 2026-09-25

Repo: georg-doc/kayfabizarro · integration owner PR #185 `chatgpt-web/toolbox-source-lock-2026-09-23` · runtime pin 8922d4b1 · no push (403).

Built this session:
- TOOLBOX-PRODUCTION-01 — `KFB ToolBox Production-01.dc.html`: Studio + Animation Lab on ONE runtime; Body/Face/Pose/Scene inspector; IK dots on stage via the shared edit-layer gizmo; Motion Library 01 audition/scrub/roles/root-motion calibration/contact corrections; Legacy Character Builder; Orc Brute Rig_Large fixture; workspace save with Actor/Pose/Motion profiles.
- Fixes after verifier + Georg: contact bands read AN-PROFILE-01 `frames`; clip popover height bounded; header no longer overlaps (shrinking actor/stage buttons, compact labels below 1000/900 px); inspector toggle ▥ for split-screen; orbit camera fluid (16 ms watchdog when rAF stalls), double-click sets orbit pivot, pan/zoom limits.

Owner finding: `pose-rig.v1` forearm length from `F.position` is wrong when a wrist bone sits between (Driver: 0.074 vs 0.334). ToolBox re-measures per solve; the owner fix belongs in pose-rig.v1.

## Next Gate
**GEORG HUMAN REVIEW · TOOLBOX-PRODUCTION-01** in the real host (split-screen included): load figure → face → IK hand → save pose → Animation Lab → drum clip → fix contact → save → back to Studio.
