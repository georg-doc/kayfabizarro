# TEST REPORT · KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1

Only tests that actually ran are PASS/FAIL. Environment: Claude Design preview (Chromium), actor frizzlebob-earrig-v5, 2026-10-01.

| Test | Result | Evidence |
|---|---|---|
| FB-LIDS-LEVEL-FIX-01 §3 · 1–5 | **PASS 5/5** | evidence/lids_level_fix_01_acceptance.json |
| PRODUCTION-01 self-test, P08 | **37/38** (24 FAIL: stale eye ref), before the test-24 fix | evidence/selftest_p08.json |
| Self-test 22 after fix | PASS (0.455 → 0.505) | same |
| Self-test 24 after fix | probe only: x 0.190 → 0.391, yaw 28.9 / 118.9 / 6.4 → logic correct; full run NOT_RUN | same |
| Ear roots: castShadow off, AO ears 0 | PASS (probe: FB_Ear_L/R_v5 cast false, ears class found, ears 0) + top view | evidence/ears_root_topview.jpg |
| Laute on the model mouth | PASS (probe: shape s → map FrizzleBobMouth…_S.png; after Rest → own map) | evidence/laute_s_decal_on_model_mouth.jpg |
| Editor acceptance E1–E9 | NOT_RUN | — |
| LIDS-02 1–10, MOUTH-FIT 1–7 on P08 | NOT_RUN | — |
| Standalone HTML | **FAIL**: shell renders, logic values never bind, boot stalls at _waitEl. r2 P06 standalone: same | evidence/standalone_boot_stall.jpg |
| zipcheck.py | NOT_RUN (no Python in Claude Design) | — |
| ZIP self-check (JS: re-read ZIP, every entry vs CHECKSUMS) | see EXPORT_MANIFEST.CLEAN_RUN | — |
