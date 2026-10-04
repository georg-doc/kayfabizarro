# START HERE · KFB ToolBox · Claude Design Session Cut · 2026-09-25 r2

1. **Project / slice:** KFB ToolBox · TOOLBOX-PRODUCTION-01 continuation (PR #204 architecture v3, recovery head 9d1f25c3).
2. **Status:** CANDIDATE · Georg PROCEED PASS on r1 · r2 = continuation, **Georg review pending**.
3. **Entry point:** `KFB ToolBox Production-01.dc.html`.
4. **Open:** serve this folder over HTTP (`python3 -m http.server 8080`), open the entry. It loads `./support.js` and `./kfb-lib/*.js` relatively; everything else is pinned remote (GitHub raw / jsDelivr at commits). Needs network.
5. **Read first:** `HANDOVER.md` → `SOURCE.json` → `CHANGELOG.md` → `TEST_REPORT.md`. In the tool: "…" → *Run PRODUCTION-01 self-test* (19 steps, real sources, restores your save).
6. **Owner:** ToolBox / Web-GitHub Bridge. Receiving owner of the pose fix: `pose-rig.v1` (patch in `patches/`).
7. **Does NOT own / replace:** WorldBuilder movement, Travel flight, terrain/sky (preview host only), Motion Library contents, EyeRig/Mouth owners, ear geometry (FrankenStein Studio), band module runtime (S39 Resident Atlas).
8. **Next gate:** **GEORG REVIEW · CANONICAL LOCOMOTION + SHARED POSE/IK + FIRST EAR/PERFORMANCE CONSUMERS.**
