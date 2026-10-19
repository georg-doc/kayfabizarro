# TEST REPORT · WS0 Cartoon Terrain Organic Palette + Real 3D Shadows · R1

**19.10.2026 · DOCUMENTATION / PROVENANCE ONLY** · not product, runtime, shader, visual, browser, performance, physical shadow or stage acceptance.

## Source inventory actually read

- WS0 authoritative register branch `docs/kfb-decisions-register-2026-10-11`:
  - `DECISIONS.md`, `ARCHITECTURE_R1.md`, `STYLE_GUIDE_3D_R1.md`,
  - `replies/BRIEF_WS1_LOOK_RUN_L2.md`, `replies/BRIEF_WS1B_TAKEOVER_R1.md`,
  - previous `replies/WS0_COLOURED_3D_SHADOW_MVP_TRIAL_R1_2026-10-19.md` (R1.2), blob `4176bc7517e5aa1477ab77b6bd6fcdc61c3f5aa6`.
- Active issue [#439](https://github.com/georg-doc/kayfabizarro/issues/439), title/body confirmed: overall terrain with bands/ramps/color/foreground/shadows (NOT a shadow-only task).
- `main`: `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`, `skills/chat/recovery/KFB_2026-10-07_WEBCHAT_IDEATION_PERSISTENCE_AUDIT.md`.
- `ws1/r3f-frame`: `WS1_STATUS.md` (sections 72–75 Mesa/terrain/color/shadow existing work; later 94 ff. mobility changes) and `WS1_HANDOVER.md` (WS1b source/branch split, combo/r2, 61/62 historical **reported** full run). These old test counts are not retested in this pass.
- User's current conversation: original Roadrunner reference, correction that color fields have **no height thresholds**, palette foreground color-mass rather than gradient, biom-specific real 3D shadow mapping, and emphatic **no fake ellipse/blob shadows**.

## Actually executed document checks

After writing `WS0_CARTOON_TERRAIN_PALETTE_SHADOW_DESIGN_R1_2026-10-19.md`, GitHub branch ref exact readback matched commit `aeeb02704a875eddc99104c2a5f87377c9445a98`, file blob `574edcb7e962b8a0eb2080a1636e0c2cd12ac36b`, content length 22,145 JavaScript string code units. **12/12 PASS, 0 FAIL** for explicit assertions:

| Assertion | Result |
| --- | --- |
| No new runtime renderer owner | PASS |
| Height-band rejections persisted | PASS |
| Blob shadows prohibited | PASS |
| 3D geometry shadow map required | PASS |
| Foreground graphic-tone/shadow independent | PASS |
| Sparse nonblack edges | PASS |
| Steep wall projection source issue | PASS |
| WS1b owner | PASS |
| Parent Issue #439 | PASS |
| Banden + non-height-step ramp scope | PASS |
| Not implemented asserted | PASS |
| Single next gate | PASS |

These 12 source-text assertions do not validate shader math, shadow correctness or image similarity. **No test pass on actual terrain color/ridge/face/racer rendering.**

## Not tested

- Working shader/API/GPU code, fresh KFB Build, VS Code/Claude Code, browser/WebGL, Playwright, fullscreen/split-screen, mobile, visual source isolation or screenshots: **0**.
- Real model ShadowMap casting/receiving under jump/drift/rock overhang, materials parity, actual palette import, clipping/frustum, GPU cost: **0**.
- H0/J17 Golden comparison, Save/Reload or actual stage/gameplay: **0**.
- WS1 actual Banden-/Rampen POC exact source still not resolved by the parent R1.2 intake: **SOURCE_REQUIRED**.
- No new public Site/Stage/PR/merge/Live execution.

## Next single WS0 gate

Read this new spec **with**, not instead of, existing R1.2 Issue #439 and pin full original terrain/band/ramp donor source plus current WS1b receiving product. Then one reversible combined visual+playable integration fixture may be authorized; no separate shadow-only POC.
