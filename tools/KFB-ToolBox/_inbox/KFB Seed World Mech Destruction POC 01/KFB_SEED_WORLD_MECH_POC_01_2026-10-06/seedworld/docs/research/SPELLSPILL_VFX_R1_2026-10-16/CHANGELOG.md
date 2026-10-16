# ADDITIVE CHANGELOG · SpellSpill / KFB Block Destruction FX R1
## 2026-10-16 · Screenshot reference and performance benchmark proposal
- Georg supplied 9 PNG visual references in Dropbox: waterfalls/water, fluids, smoke, clay spheres, angular debris, explosions, sustained flame effects and area-of-effect visuals.
- Product priority clarified: readable, good-looking many-emitter/cascade/whole-building-block demolition on modest GPU; compare 3D smoke vs 2D source textures vs hybrid and measure actual cost/overdraw.
- Recovered exact POC owners `sw-destruct`, `sw-fx`, `sw-mech` and original POC performance limitations; no new combat/physics engine.
- Recovered **original Claude Design alpha-mask VFX library**, including user-remembered muzzle masks, 4x4 atlas code, 14 predrawn sheets, five white-alpha muzzle masks, earlier VFX-01 source review. Source file IDs, git blobs, source license and registry pack linked.
- 25/25 cross-source guards; actual render/target-device benchmark not run. CI source screenshot attempt pending.
- One next gate: `KFB SEED WORLD BLOCK-DESTRUCTION HYBRID FX SOURCE-ISOLATION + PERFORMANCE A/B` (source-isolated source visuals plus quantified cascade A/B).


## 2026-10-16 · Source screenshot CI evidence and catalog consolidation
- Dropbox archive correctly extracted using zipfile after source ZIP included abnormal absolute root entries; second CI run `38922347665` SUCCESS, 9/9 PNG hashes matched.
- Contact sheet manifest/screenshots stored in ephemeral GitHub Actions artifact `12054229885` and visually inspected; no original screenshots added to public KFB media.
- `VISUAL_SOURCE_PROOF.md` separates observed smoke/debris/water/tornado styles from unverified source shader implementation.
- Prior original Claude Design white-alpha/4×4 atlas source recovery linked in `EXISTING_ALPHA_MASK_ATLAS_CATALOG.md`; reuse before new draw-call or particle-pool owners.
- Changed workflow trigger to manual / actual workflow revision; routine document commits no longer repeatedly download Dropbox source art.


## 2026-10-16 · Actual source-only FX A/B/C implemented and measured
- Added bounded nonproduction `seedworld/fx-ab/{index.html,comparison.mjs,proof.mjs}`, using exact existing POC `sw-world`, `sw-mesh`, `sw-destruct`; actual 3D dust instance geometry/material and original Brackeys `smoke_03_a.png`. New GitHub Action workflow for same-scene A/B/C.
- Original mask shown alone, original existing 3D mesh shown alone, then one/four/whole-block source rockets compared across baseline/3D/2D/hybrid. Original damage/cell/physics/FX rendering modules untouched; no new World runtime.
- First CI `38924108695` 39/39 static source tests but visual FX nearly invisible; second CI `38925577044` 13/14 correctly failed visual pixel gate; final CI `38926541781` **50/50 technical success**, 14 screenshots and 12 rows, source isolated before comparison. Actual 2 cascades/90 cell losses under 12 real hit events.
- Real headless measurements show smoke-specific triangles down 20× in 2D, while overall frame times are not trustworthy KFB GPU FPS; VFX pool again saturated 584/584. Pixel tests pass but style/clarity does not yet meet desired KFB Clay quality.
- Added `FX_AB_R1_EVIDENCE.md` and `FX_AB_R1_FINAL_RESULT.json` for source-fixed result/negative tests. No Site/Stage, no merge/Live; do not accept WB2 R5.
- Single next productive gate now `KFB SEED WORLD SATURATED HYBRID FX VISUAL BUDGET + TARGET-GPU REVIEW`: measured screen-space budgets, authored palette, bounded near Clay lobes, original mid/far masks, and real on-device benchmarks.


## 2026-10-16 · Timeout recovery + saturated hybrid R2 visual budget
- Actual recovery check: open Draft PR #406 and source run 38926541781 (50/50), no timeout-related GitHub data loss; `RECOVERY_2026-10-16_TIMEOUT_CHECK.md` appended.
- Added experimental capped D mode to the **existing POC developer fixture only**, 3 original 3D clay lobes max + 28 original 2D white-alpha mask sprites max with screen-tile representative selection. Same original damage, debris, FX and shader source; no production modules edited.
- Short block-run 38945532821: **16/16 technical PASS**, screenshot artifact 12066121184, original 12 rocket / 90 lost cell / 2 cascade outcomes unchanged. Actual D selected 3+11 instead of old C 9+186, reducing smoke-specific triangles from 1,464 to 284. C/D imagery directly compared; D too thin/weak to accept despite removing oversized 3D smoke.
- `FX_BUDGET_R2_EVIDENCE_2026-10-16.md` contains exact measurements and visual critique; `SOURCE.json.fxBudgetR2` is machine-readable. No GPU speed or Golden style claim, no Stage/Site or World R5.
- Exactly one next gate: **KFB SEED WORLD HYBRID FX READABILITY + TARGET-DEVICE REVIEW** in existing owner, followed by human style decision. Routine CI proof not a global product PASS.


## 2026-10-16 · R3 actual original-source planar debris / readable smoke comparison
- Georg asked for smaller wooden/angular fragments and optional planar representations instead of always using expensive fully 3D debris. Routed to **same** Seed World Mech source-only FX fixture, no new fragment physics owner.
- Added E moderate original smoke = source 2/48 near 3D/alpha-mask 2D vs prior D 3/11. Added F same E smoke but source-sampled opaque irregular 3-triangle planar shard proxies for 166 far dynamic rubble fragments and 320 small chips; preserve 12 near original 3D source parts, exact source transforms/colors.
- Showed source original 3D debris/chips and derived planar proxies **in isolation** before both full scenes. First CI `38947275597` incorrectly executed stale R2 script; corrected workflow, [run 38947639843](https://github.com/georg-doc/kayfabizarro/actions/runs/38947639843) **24/24 technical PASS**, 6 screenshots + 4 measurement rows.
- Same source 12 rockets, 90 lost cells and 2 real cascades. Submitted scene geometry E 797,294 triangles vs F **748,800** (6.08% lower); no measured actual GPU speed gain or KFB Clay/style PASS. F reduced original chunky debris clutter and reads more like small jagged shards, but needs actual animated proof/hardware/human gate.
- New `FX_SHARDS_R3_METHOD_2026-10-16.md`, `FX_SHARDS_R3_EVIDENCE_2026-10-16.md`, `SOURCE.json.fxShardsR3`. Existing source `sw-destruct`, `sw-fx`, World/Combat unchanged; no Stage/Site/merge/Live.
- Exactly one next gate: `KFB SEED WORLD PLANAR DEBRIS + CLAY/SMOKE VISUAL MOTION / TARGET-GPU REVIEW`.

## 2026-10-16 · Georg's 2D-first modular cartoon destruction FX direction · Claude Code/WSA brief
- Persisted the full source-first, standalone `CLAUDE_CODE_WSA_2D_FIRST_MODULAR_DESTRUCTION_FX_R4_BRIEF_2026-10-16.md` **in GitHub**, not only chat; current research branch/PR #406 remains the receiving owner.
- Design clarification: **Clay world does not obligate 3D-Clay explosion particles.** 2D-first smoke, ground AOE, irregular planar shards and simple instanced bouncing impact spheres are primary; 3D hero fragments and clay texturing are **optional**. Modular material-specific wood/stone/metal/cartoon reaction presets and elastic afterlife motion are requested.
- Brief gives G 2D-first balanced / H sparse-hero-3D / I material-reactive source comparison, bounded source-first motion, unchanged `sw-destruct` damage and explicit visual/perf/overdraw/human-acceptance requirements. Reuse verified original Brackeys/Claude Design atlas assets and existing FX pool; no new shader/physics owner.
- **Documentation/intake only** this phase: prior R3 24/24 source technical evidence retained, no R4 code or motion/GPU test yet, no WorldBuilder R5, Site/Stage/Live or merge.
- Exactly one next gate: `KFB SEED WORLD R4 2D-FIRST MODULAR DESTRUCTION FX SOURCE/MOTION COMPARISON`, then target-device and human visual review.
