# RETURN · KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1

## Done this session (01.10.)
1. **Versions sorted.** P07 had forked from an older P06 (editor only); P06 kept going (ears, LIDS-02, mouth fit, LIDS-03). Both wrote the same storage key. P08 merges both (55 hunks: 22 from P07, the rest from P06) and gets its own key. P06 / P07 are frozen.
2. **FB-LIDS-LEVEL-FIX-01** (Blender MCP): `_lvl` → LIDS-04 in kfb-lib/clay-lids.v1.js. Level = remove the oval tilt only, then solve exactly against the oval's non-uniform scale. Roll = sx × roll (+ = outer corners up, checked in world space and on screen; the brief's −1 turned them down). Acceptance §3: 5/5 PASS.
3. **Self-test 22 / 24** were test bugs: 22 hit the dx cap of 0.6; 24 assumed the legacy seat and held a stale eye reference. Both tests fixed; the behaviour stays as it was.
4. **Ear-root shadow removed** (same rule as the nose). Ears cast no shadow (toggle "Ears cast shadow"). contact-ao.v1 gets its own ear class: ear ↔ head contact has its own strength `ears`, default 0.
5. **Laute · 13 shapes works again on the model mouth.** face-mount.v1 treats a decal shown on purpose (`mouth.__kfbHold`) like speech; any other decal ends the hold.

## Not done / open
Standalone HTML boot (FAIL). Full self-test after the test-24 fix NOT_RUN. Editor E1–E9 after the merge NOT_RUN. LIDS-02 check 7 decision (edge rounding vs tolerance). Blender-lane gates (12-step edge, mouth-fit measurement).
