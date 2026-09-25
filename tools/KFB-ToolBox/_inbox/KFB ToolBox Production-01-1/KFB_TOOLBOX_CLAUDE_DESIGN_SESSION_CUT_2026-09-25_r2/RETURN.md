# RETURN · TOOLBOX-PRODUCTION-01 continuation · 2026-09-25 r2

Status: **CANDIDATE · Claude-Preview self-test 19/19 PASS · GEORG REVIEW PENDING**

Human gate (brief) → where:
1 open ToolBox · 2 load FrizzleBob (Driver Graft or Ear Rig v5) · 3 Studio › Pose → click hand/foot dot, drag · 4 Save pose · 5 Lab tab (no rebuild) · 6 Lab › State → Measure → rows / ▶ previews (Idle/Walk/Run/Jump) · 7 profile facts in the row detail · 8 scrub in the dock · 9 click a dot at a frame → correction · 10 Save motion profile / Save profiles · 11 Lab › Ears → Run EAR-DANGLE-01 · 12 Stage ▾ → Resident Band · S39 (no baseplate) · 13 back to Studio — actor/profile state intact.

Owner fix delivered as patch: `patches/tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v13/pose-rig.v1.js` (drop-in for the repo path; same API + ikChain/effector/solveIK/chainReport).
World consumer contract: `data/kfb-locomotion-profiles.Rig_Medium.frizzlebob-earrig-v5.consumer.json` (roles → clip refs, speed/cadence, contacts, events, transitions). No movement controller exported.

Exactly one next gate: **GEORG REVIEW · CANONICAL LOCOMOTION + SHARED POSE/IK + FIRST EAR/PERFORMANCE CONSUMERS.**
