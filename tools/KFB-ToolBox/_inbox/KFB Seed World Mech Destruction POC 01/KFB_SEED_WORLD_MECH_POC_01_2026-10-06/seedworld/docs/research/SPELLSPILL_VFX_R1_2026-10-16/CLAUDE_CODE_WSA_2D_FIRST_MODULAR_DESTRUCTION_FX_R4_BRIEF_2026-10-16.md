# Claude Code / ChatGPT Work–WSA · KFB 2D-first modular Destruction FX · R4 receiving brief
Date: 2026-10-16
Status: **DESIGN/EXECUTION BRIEF PERSISTED · R4 NOT IMPLEMENTED · NO PRODUCT ACCEPTANCE**
Owner: **existing KFB Seed World Mech Destruction POC 01** (research playground, NOT World Studio, Combat Arena or a new particle engine)
Repository: `georg-doc/kayfabizarro`
Receiving research branch: `research/kfb-seedworld-spellspill-vfx-audit-2026-10-16`
Review: [Draft PR #406](https://github.com/georg-doc/kayfabizarro/pull/406)
Intended receiver: **Claude Code / Work–WSA**, following current human/guard authority before implementation.
Canonical instruction: GitHub source and latest owning Return override chat summaries. This briefing is for a **future bounded R4 fixture iteration**, not a command to merge, publish, promote, or touch WB2 R4.

## 0. Read first — do not start with a new runtime
1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md` for any substantial implementation
5. Existing source: `tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/seedworld/docs/START_HERE.md`, `HANDOVER_2026-10-06_r2.md`, `ARCHITECTURE.md`, `PERFORMANCE_BUDGET.md`
6. Owning research `docs/research/SPELLSPILL_VFX_R1_2026-10-16/`:
   - `RETURN.md` (current owning return)
   - `SOURCE.json` (source hashes and actual state)
   - `EXISTING_ALPHA_MASK_ATLAS_CATALOG.md` (actual pre-existing white alpha / muzzle / smoke sources)
   - `VISUAL_SOURCE_PROOF.md` (nine verified user Dropbox screenshots; visual inspiration, not game source shader)
   - `FX_AB_R1_FINAL_RESULT.json`, `FX_BUDGET_R2_EVIDENCE_2026-10-16.md`
   - `FX_SHARDS_R3_METHOD_2026-10-16.md`, `FX_SHARDS_R3_EVIDENCE_2026-10-16.md`
7. Existing `seedworld/fx-ab/{index.html,comparison.mjs,proof.mjs,budget-proof.mjs,shard-proof.mjs}` and `.github/workflows/kfb-seedworld-source-fx-ab.yml`. Check current PR branch HEAD and exact files just before edits.

## 1. Binding direction from Georg — **2D-first, not 3D-Clay-first**
The KFB **world/buildings** may be Claymation-like. The explosion, debris, impact balls, smoke and cascades **do not have to be clay textured or even 3D**. Optimise for clean animation, joyful cartoon impact, distinct shapes, playful physical response, compositional layering, scalable performance and recognisable KFB color language. Small spheres in an impact core are welcome if they help, but simple instanced geometry is enough; do **not** require triplanar Clay texturing or expensive shadowing on every sphere.

**Stop framing the problem as "How do we keep 3D Clay smoke?"** Evaluate the best cheap modular composition with mostly 2D shapes, sparse optional 3D accents and existing authored world collision.

This supersedes any older research preference for mandatory near-camera 3D-Clay lobes. It is a **visual direction**, not a claim that 2D is automatically faster: big transparent masks can overdraw many pixels.

## 2. Single product outcome
Inside the **existing Seed World POC source-isolation fixture**, prove a modular **cartoon destruction FX composition** whose parts can be reused and adapted by material, while the existing game owns the only real damage / collision / persisted demolition. No new game FX runtime, physics engine, sound owner, shader pipeline, brand identity or WorldBuilder integration.

A successful R4 is **a comparison/decision-ready developer demonstration**, not a production FX release.

## 3. Composable presentation layers (not additional runtime owners)
- **A · Ground / AOE:** small cheap oriented ring, shock disc, dust ring, impact stamp/scorch; anchored to actual hit position and ground normal. Do not create new AOE damage.
- **B · Impact core:** short flash/burst and a bounded number of simple instanced cartoon spheres/dots; radial pop, optional bounce or disintegration. Clay texture entirely optional. Ball colors and rhythm derive from the future material recipe, not generic neon glare.
- **C · Debris/shards:** small irregular **flat polygons / 2D chips** with expressive rotating/falling/fluttering arcs; use actual `mDebris`/`mChips` source positions/velocity/material colors. A few existing original 3D near-hero pieces only where useful for scale and silhouette. Favor cheap opaque/alpha-tested particles over an all-rigidbody scene.
- **D · Dust/smoke:** existing original white-alpha source masks/flipbooks, layer density, color/tint/value and screen-space coverage; carefully control alpha overdraw, repetition and camera sorting. **No mandatory 3D Clay clouds**.
- **E · Secondary motion/afterlife:** brief ricochets, bounce/pop, tiny falling fragments, wispy threads/trails and material-specific settling. All use one shared event/lifetime/capacity clock, no extra gameplay state.

Compose/tune layers independently per event, preserving one dominant visual impact, staggered aftershock/cascade events, readable silhouettes, and the actual authoritative collapsed structure. Don’t spawn all layers uniformly at all nearby impacts during whole-block demolition.

## 4. Future material-reaction vocabulary (R4 only needs small demonstration)
Prepare data-driven vocabulary or test-only presets; do not create a second canonical material library:
- **Wood:** thin warm irregular splinters; flutter/rotate, short elastic secondary bounce, minimal dusty spray.
- **Stone/masonry:** harder/heavier angular chips, gray/darker dust; gravity/settle more than bounce.
- **Metal:** slender sharp shards with timed sparks/flash, minimal powder, longer streaks.
- **Cartoon/Fluff:** simple round instanced balls, elastic bounce/pop, intentionally graphical disintegration/trails.

Use the **same authentic damage/event** to vary *presentation only*. The POC cells and persistence do not change when material preset changes.

## 5. Exactly three R4 comparison variants
- **G — 2D-first balanced:** a cheap AOE ground effect, short flash/instanced impact balls, mostly planar source-derived shards/chips, source-backed alpha smoke, very little/no 3D geometry.
- **H — 2D-first + hero debris:** same layer recipe/camera/source events as G, plus only a few actual original 3D foreground debris pieces to judge whether parallax/scale is worth the extra render work.
- **I — material-reactive demonstration:** same event timing/geometry source, compare wood vs masonry vs metal (optionally cartoon balls) via presentation/lifetime/palette/bounce behavior, not a full library or gameplay rewrite.

The current R1/R2/R3 A–F source comparisons and no-FX baseline remain available. Do not erase historical failed runs or silently replace the source imagery with newly generated visual assets.

## 6. Motion and readability (required; older proofs were largely frozen)
Move at least one bounded sequence beyond frozen screenshots: an original hit → burst/flight → delayed real support cascade → aftermath, stepped/captured with reproducible seed, camera and timing. Demonstrate actual rotating/flipping flat chips and believable small bounce; optional brief streak/threads. Distinguish real original source transforms from test-only graphical motion.

If possible include one/four/whole-building-block visual stress sequence; start with a bounded, meaningful real-source slice rather than implementing all production animation. **Keep original `sw-destruct` the only gameplay truth**. Source objects must be shown in isolation before combined effect compositions.

## 7. Measured cost *and* visual readability
For same seed/camera/source data, report:
- event counts, real lost cells, support cascades, debris counts, emitted/visible/evicted sprites, 2D/3D balls and shards;
- render scene triangles (whole vs effect-only), draw calls, material/texture/program counts, memory, pool saturation / bounded eviction;
- transparent screen-space coverage/overdraw proxy and shader first-use (cold vs warm);
- actual frame p50/p95/p99, visible-tab frame pacing, CPU FX update and GPU timing **only if the environment supports it**;
- legibility of dominant hit, debris direction, secondary collapse, material difference, color hierarchy, effect duration/cleanup and any missing/occluded source sprite;
- actual screenshot or short frame-sequence proof (not decorative fake visuals).

Prior grounded baseline: R3 [CI 38947639843](https://github.com/georg-doc/kayfabizarro/actions/runs/38947639843) **24/24 technical checks**, 12 authentic rockets/90 lost cells/2 actual support cascades, 584/584 visual pool peak. Same frozen smoke E vs planar F: 797,294 → 748,800 submitted entire-scene triangles (−6.08%) with 145 → 143 calls. This **did not prove faster FPS**: CI software submit p95 was 3.9 → 4.7ms. Flat sprites may reduce geometry but increase fill-rate. R2 D showed too-sparse smoke; older C overlarge smooth white cloud. Their visual TUNE findings remain valid, and the new direction releases the requirement to preserve their 3D Clay design.

Do **not invent performance thresholds**; compare measured device/browser results and existing budget spec. Headless SwiftShader is evidence of functional WebGL source use, **not Georg’s Mac GPU acceptance**.

## 8. Source-first and boundary rules
- `seedworld/sw-destruct.js` owns damage, explosions, cell support, cell-state persistence and debris truth.
- `seedworld/sw-fx.js` owns weapon/impact FX in the POC. `sw-mech.js` owns weapon triggering. Existing World/Rapier and Combat Arena remain separate owners.
- Actual KFB source-donor inventory already includes **93 original Brackeys alpha PNGs**, **14 predrawn flipbooks**, muzzle/smoke/impact masks, and the legacy **4×4 / 16-role** tinted atlas design, documented in `EXISTING_ALPHA_MASK_ATLAS_CATALOG.md`. Reuse them and verify exact blob/licensing; do not paste external screenshots into the repo or invent art.
- Show the actual source image / geometry **in isolation** before claiming donor integration. A URL that loaded proves neither visual source fidelity nor acceptable style.
- No Ammo.js/Bullet physics integration (separately researched, not adopted); no separate particle scheduler, collision writer, AudioContext, second material authority or generic placeholder chrome.
- WB2 WorldBuilder R4 is **STOPPED / F-R39 FAIL / NO MVP / no R5**. The R4 label in **this** brief refers only to the Seed World **FX fixture iteration**, never to WorldBuilder R5.
- Do not make a product Site, Cloudflare Stage, Live/merge or canonical Hub URL for a research-only FX fixture.

## 9. Roles, execution and persistence
For implementation: name **Builder/Integrator** (sole writer), **Integration Tester** (real source assertions/screenshots), **Independent Critic** (source-isolated visual/perceptual evaluation, no build writes), and **Production Guard** (one CONTINUE/REPAIR/QUARANTINE/HUMAN_DECISION/STOP gate). The Builder cannot self-approve its own style. Georg owns human visual approval.

Checkpoint in GitHub at coherent implementation and evidence milestones, not after each trivial test. On every GitHub write, re-fetch exact head and intended files. Timeout → UNKNOWN until inspected. After two non-improving repairs, preserve/quarantine the smallest failing seam and continue parent outcome unless guard proves critical.

On completion additively update the owning research `SOURCE.json`, `TEST_REPORT.md`, `CHANGELOG.md`, `RETURN.md`, and existing PR #406. Include exact repo/branch/PR/head, changed files, actual results/screenshots/artifact IDs, deferred checks and **one** next gate. Use KFB Production Control for meaningful decision/Return, not a new runtime, second source or unneeded Hub fanout.

## 10. R4 fixture acceptance / next gate
R4 fixture is successful only when a real original-source G/H/I comparison makes a clear **2D-first modular FX** candidate, preserves original destruction outcomes, shows meaningful source-isolated motion and legible layered silhouettes, honestly reports limitations/overdraw/performance, and is ready for Georg’s visual choice. **No auto-selection merely because triangles are fewer.**

**Exactly one downstream gate after a useful R4 proof:** `KFB SEED WORLD 2D-FIRST DESTRUCTION FX MOTION + TARGET-GPU REVIEW` — actual browser/device target p50/p95/p99, animated cascade under load, KFB color/visual reading and Georg PASS/TUNE/FAIL before any product adoption.

---
**Operator one-liner:** Build the best *cheap, modular, joyful cartoon destruction composition*, not a mandatory Claymation smoke simulation. The world can be Clay; the FX can be flat, graphical, elastic and source-backed. **GitHub is the primary durable handoff for Claude Code; this exact briefing is a file, not a chat-only plan.**
