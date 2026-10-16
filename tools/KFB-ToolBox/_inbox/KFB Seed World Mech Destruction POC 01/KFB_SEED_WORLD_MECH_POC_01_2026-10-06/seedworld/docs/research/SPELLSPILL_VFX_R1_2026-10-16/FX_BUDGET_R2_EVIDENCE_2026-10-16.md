# FX budget R2 · Existing-source hybrid proof and recovery continuation
Date: 2026-10-16 · **Technical budget proof PASS / visual readability TUNE / actual Mac GPU NOT RUN**.

## Recovery provenance
After the chat timeout, GitHub was re-read. Existing [Draft PR #406](https://github.com/georg-doc/kayfabizarro/pull/406) was intact (prior exact head `2acb68bcea5c890ac4c526b52ad2dad98819ee07`). The previously reported R1 A/B/C CI `38926541781` was already **SUCCESS 50/50** with 14 screenshots and 12 rows; no data loss. See `RECOVERY_2026-10-16_TIMEOUT_CHECK.md` (additive, exact HEAD pinned at recovery). R1 original source and historical negative visual gates preserved.

## R2 bounded implementation
In the **same existing Seed World research POC owner**, changed only `seedworld/fx-ab/comparison.mjs`, `index.html`, added `budget-proof.mjs`; switched the existing CI workflow to execute this narrow 12-rocket block budget proof. Not an additional renderer/FX runtime; `sw-destruct.js`, `sw-fx.js`, `sw-world.js`, Combat Arena, actual material owners, gameplay damage/physics all unchanged.

New optional D visual mode:
- Samples the original `mDust` source instance transforms and the original Brackeys white-alpha `smoke_03_a.png` as already isolated in R1; no new texture/geometry art.
- Filters approximate visible particle centers to screen tiles `110px`; cap **3 source 3D Clay bodies** at **2.3×** original scale and **28 source 2D sprites** at **5.2×** original scale, with adapter-only muted clay-gray tint.
- Exactly **one** source particle per selected ID; no duplicate 3D/2D center. This *culls presentation only*: original source explosion/cell damage/real debris/rubble is unchanged. This is a **static/frozen-state read-only adapter**, not a tested dynamic runtime budget arbitrator or GPU LOD system.
- Real scene is **not** KFB K1/H0 or K2/v10 Clay Golden (existing seed POC uses clay_floor_001 stand-in). Color settings are an experimental tune candidate only.

## Actual test, source evidence and numeric outcomes
- [GitHub Actions run 38945532821](https://github.com/georg-doc/kayfabizarro/actions/runs/38945532821): **SUCCESS, 16/16 executed checks**, tested branch SHA `e847450a567c0e08d3842053a934d61b7b1c063a`. Artifact [12066121184](https://github.com/georg-doc/kayfabizarro/actions/runs/38945532821/artifacts/12066121184) includes `results.json`, `block-none.png`, `block-c.png`, `block-d.png`; artifact ZIP SHA-256 `1370cebfbb31ee887e72a1e77183eb02585b140b4409b50809582ed4e3fefb41`.
- Actual **12** rockets from original `sw-destruct.rocket` → **90** cells lost, **2** support cascades, **178/256** debris, **195/200** source dust, **584/584** source VFX peak, **320** chip sprites (source cap). Exact same damage across NONE/C/D; no duplicated damage or physics writer.
- **Prior hybrid C:** 9 3D + 186 2D, 1,464 smoke-triangles, total **798,406** scene triangles, 145 draw calls, **4.222%** changed pixels vs NONE.
- **Bounded hybrid D:** 3 3D + **11** 2D (capacity allowed 28, screen-tile occupancy selected 11; 181 unrepresented source smoke instances), **284 smoke-triangles**, total **797,226** scene triangles, 145 draw calls, **0.415%** changed pixels vs NONE. 81% fewer smoke triangles than C, NOT 81% faster overall and NOT 81% lower frame time.
- **No smoke baseline:** 796,942 scene triangles, 142 draw calls. Source geometry dominates: C→D saves 1,180 triangles out of ~798k, not a meaningful total-scene poly win. C/D CPU submit p95 ~6.8/6.4 ms, but no reproducible hardware GPU timing; CI rAF p95 at baseline ~1,874 ms and C/D ~17 ms shows software runner scheduling is inconsistent as an FPS benchmark.
- Source asset path and exact Git blob `media/3D_Assets/FX_Visual/brackeys_vfx_bundle/particles/alpha/smoke_03_a.png` / `7cbc81b89d58671748e819f5f9756d5fbe53a477`. Same real POC instanced icosahedral dust material and real angular debris source.

## Honest visual critic
The actual `block-c.png` and `block-d.png` were opened and compared. **C** has the obtrusive large pale smooth balloon rather than discrete clay smoke plumes; **D** restores legibility of source angular debris and removes the balloon but loses almost all visible smoke density. D's strict screen-tile cap yields only 11 of 28 permitted 2D images and a 0.415% screen effect; it does not reproduce the heavier layered gray smoke and warm impact core from the user's SpellSpill screenshot benchmark. **Human / independent Golden visual acceptance = NOT RUN / NOT PASS.** This is a useful quantitative tradeoff, not a winning effect selection.

No source video shader discovered; do not credit ammo.js as visual donor. No real-time evolving KFB Clay cloud or sustained flamethrower/waterfall benchmark; no full-game target Mac/GPU p50/p95/p99; no full production integration, published Site/Stage or merge.

## One remaining gate
**KFB SEED WORLD HYBRID FX READABILITY + TARGET-DEVICE REVIEW**. Only in the existing POC presentation owner: compare small irregular near-hero Clay clusters and a moderate number of darker white-alpha smoke layers against the untouched base/damage; keep angular debris prioritized; do not keep adding giant opaque balls. Require frame-sequenced (not only frozen-state) readability and actual device/GPU frame pacing/overdraw before choosing a smoke style. Review source screenshots with Georg / an independent visual critic first. This gate may use real existing FX masks; no new standalone emitter, physics owner, WB2 R5, or automatic Live.
