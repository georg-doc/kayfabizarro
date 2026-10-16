# FX A/B/C · Actual POC source evidence · implementation/evidence milestone

Date: 2026-10-16. Owner: existing KFB Seed World Mech Destruction POC 01 **research sandbox**.
Review PR: #406, branch `research/kfb-seedworld-spellspill-vfx-audit-2026-10-16`.
**This is a material test milestone while the corrected third source-only smoke comparison is running, NOT the final Return.**

## Actual implemented fixture and source identity
The additive developer-only `seedworld/fx-ab/index.html`, `comparison.mjs`, `proof.mjs` and workflow `.github/workflows/kfb-seedworld-source-fx-ab.yml` import REAL `sw-world.js`, `sw-mesh.js`, `sw-destruct.js`; use source-pinned Brackeys `smoke_03_a.png` (Git blob `7cbc81b89d58671748e819f5f9756d5fbe53a477`) and the actual POC source `mDust` icosahedron geometry/material and damage/rocket logic. No production code is patched, no new gameplay/simulation owner. The original `clay_floor_001` stand-in is **not** K1/H0 or K2/v10 Golden.
Three source scenarios: 1 rocket, 4 local rockets, 12 whole-block hits; smoke presentation NONE/ A existing 3D source / B original 2D alpha / C hybrid. Source damage occurs **once per scenario**, then variants measure/render the same frozen source state. The benchmark is static render-only variant comparison, not simultaneous real-time gameplay FPS or dynamic per-frame FX update cost.

## First completed evidence · source runtime tests GREEN, visual framing FAIL
GitHub CI: https://github.com/georg-doc/kayfabizarro/actions/runs/38924108695 ; artifact https://github.com/georg-doc/kayfabizarro/actions/runs/38924108695/artifacts/12056735381 ; CI technical assertions **39/39 PASS**, **12 variant screenshots**, 12 data rows.
Actual observed source state:
- Single: 1 actual rocket → cellsLost **8**, smoke **17**, cascades **0**.
- Four: 4 actual rockets → cellsLost **48**, smoke **113**, cascades **0**, active visual peak **482**.
- Block: 12 actual rockets → cellsLost **137**, dust **200/200** (at source cap), VFX peak **584/584**, debris **12**, cascades **0**.
- Same block renderer: baseline **1,008,164** triangles; 3D smoke **1,024,164** (+16,000), original masked 2D **1,008,964** (+800), hybrid **1,009,648** (+1,484). This shows **20× fewer smoke-related submitted triangles** for 2D in this frozen source state, NOT a 20× faster frame. Massive world geometry dominates.
- Render-CPU-submit p95 (block) baseline **4.4 ms**, 3D **4.6**, 2D **4.8**, hybrid **3.7** on CI SwiftShader; **not repeatable or decisive in this environment**. RequestAnimationFrame interval p95 ranged ~**0.99–1.67 seconds** despite small submit timings. These are **not target device FPS**. Do not rank a winning renderer.
- Independent screenshot image-diff analysis against NONE (crop: actual scene only): Single variants **0 changed pixels**; Four A ~0.367% screen pixels with abs color delta >=10, B ~0.024%, C ~0.021%; Block A ~0.086%, B ~0.003%, C ~0.03%. Real smoke is mostly occluded, too small or off-frame; this test **cannot establish visual quality or usable performance**.

## Second completed evidence · stronger capture/framing gate catches invisible sprite
GitHub CI: https://github.com/georg-doc/kayfabizarro/actions/runs/38925577044; artifact https://github.com/georg-doc/kayfabizarro/actions/runs/38925577044/artifacts/12056821556. Source smoke positions sampled and camera moved nearer; corrected hybrid indexing.
The new pixel test correctly failed at **13/14 PASS**, `single B` source 2D mask **0.008%** pixels different from NONE (must >=0.04%). `single A` 3D was just **0.042%**. This is a *useful failed visual-visibility test*, not a GitHub production runtime regression. Actual source event was one rocket, cellsLost **8**, 17 live dust, no support cascade.

## Last bounded repair (currently in GitHub CI; inspect before final Return)
The smallest visual seam is only the **test presentation scale, mask tint and isolation**, *not* POC damage or source:
- temporary InstancedMesh clones the actual existing 3D dust geometry/material; transparent source 2D uses the exact original Brackeys alpha mask;
- bounded source-presentation-only size magnification 5× for 3D, 6.5× 2D, preserving *original source particle centers*;
- A/B true standalone source isolation with actual screenshot before the comparative world layer; C first 9 source 3D lobes and remainder 2D without duplicated particle positions;
- new CI keeps pixel-difference minimum 0.04% so invisible FX cannot get a fake performance victory;
- 12 rockets re-hit real four neighboring building structures at ground-floor support level for potential structural cascades; *no cascade PASS can be asserted unless actual `destruct.stats.cascades > 0`*.
- Third CI run https://github.com/georg-doc/kayfabizarro/actions/runs/38926541781 was **IN PROGRESS** when this evidence checkpoint was authored. Timeout/failure is UNKNOWN until workflow/branch readback; **do not assume success**. If source fails or stays visually illegible after this bounded repair, preserve/quarantine the smallest FX-presentation seam and continue only the parent outcome without claiming style or GPU improvement.

## Strict guards
Source shader originality and SpellSpill upstream are still unverified; Dropbox shots are user visual reference. No generic source art, second physics/FX actor/audio owner, KFB WorldBuilder R5, Target Mac GPU claim, public Stage/Site, merge or Live.
Exactly one current next gate: **KFB SEED WORLD BLOCK-DESTRUCTION HYBRID FX SOURCE-ISOLATION + PERFORMANCE A/B** (closing as technical evidence only after the corrected run, then hardware-specific visual/performance verification if needed).
