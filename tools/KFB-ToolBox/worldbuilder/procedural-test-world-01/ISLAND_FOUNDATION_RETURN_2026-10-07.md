# R4 · Player Ground/Flight implementation + evidence milestone · continue Drive

Parent `472ecc06915923a0c81d8252435d0128e8c0910c`; this milestone belongs to its containing commit. Same WB2 owner/PR/branch, Frozen Matrix v5 44/13/7. **NO MVP**. This is continued Phase 2, not a phase or product PASS.

Existing Ground now provides default Jog (2.65256 m/s), Shift Sprint (5.255), Alt Slow Walk (.98), useful backward (-2.65256), Q/E body-relative strafe, short anticipation and Rapier ballistic jump. Native Motion clips include the pinned Basic jump chain and Advanced Walking_Backwards. One mixer remains. Close Ground camera uses the same Rapier world for line-of-sight obstruction. Jump animation quality, no skating and complex camera acceptance remain open to normal-input critics.

Existing Travel `carpet.js`, `camera-rig.js`, `flight-controls.js` and runtime mode bridge have optional island-frame seams. Spherical defaults remain. One Travel unit is explicitly ten metres for position/speed/height/camera. Existing WB2 capsule and Physics resolve Flight displacement; no second world/controller/renderer. Horizontal contact resolves before reading reached terrain, preventing phantom cliff glide. 400ms fresh double-Space donor comes from Travel TMB2 branch, blob `52738fa6f70918ebfa09d0c811eff38b04349e45`. First tap queues Ground jump independently. Shift boost is a declared bounded planar extension using Carpet's existing acceleration/absolute speed cap; source constants are unchanged.

Read-only Guard identified heading/FOV leakage on Flight→Build, capsule mode on Actor replacement, and rejected-destination terrain history. These are repaired with bridge and blocked-wall/cliff regression tests. Browser normal-input witnesses record Jog/Sprint/Slow/back and Ground→double-Space→forward/climb→bank→hover→intentional Down→Ground. Evidence under `evidence/r4-player/`; these captures are development evidence, not Georg F-R39 or F-R07 acceptance. Native Taxi and Jump_Start have source-isolation screenshots/identities. KEEP Taxi as the bounded vehicle donor; material presentation still requires Clay adaptation.

17 tests pass and the pre-existing 0.30m automatic-step failure stays explicitly quarantined/TODO. Full TypeScript passes. Oversized convex/two-triangle floor probes revealed Rapier contact conditioning; receiving-scale indexed 4m/1m surfaces and actual Track normal input succeed. Preserve `floor-conditioning-guard.json`; do not silently claim arbitrary convex-floor robustness. No runtime snap change was made to hide the artificial fixture failure.

Next internal gate: existing Joyride K2B Drive on the named island, then Track-supported route/junction and Early Golden. All44 REQUIRED remain NOT_GREEN pending full product and critics; F-R39 NOT_READY, F-R07 UNKNOWN. No Site/Hub publication, merge or Live promotion.

---

# R4 · Foundation contact/replay milestone 2 · continue Player Golden

WB2 PR #348 / receiving branch unchanged. Parent `e6ac9abf47ac0109d9d516bc129e6df8539fbc66`; this milestone belongs to its containing commit. Frozen Matrix v5 remains 44/13/7. **NO MVP**, no whole-product or visual acceptance claimed.

Existing Physics now supplies a swept capsule to existing Ground, driven by its fixed-step hook. Native buildings and authored static props use their transformed triangles for colliders. Valid supported saved player Y is preserved; actor changes resize the capsule. Ground listeners abort on disposal; page unload frees Physics and WebGL, while back/forward-cache restoration forces fresh reconstruction.

Actual normal-input browser evidence: sprint into Track barrier remains blocked; source-pinned Boulder was moved, rotated, scaled and surface-snapped using existing editor, saved, fully navigated away and freshly loaded. The scene document and transformed object geometry hash/matrix/collider-ray proof match exactly. Boulder visible/physical vertical ray delta: 0.000000451 m. Invalid schema leaves current document intact; unsupported source triggers reconstruction rollback and restores identical object/collider proof. Import now uses a Scene textarea because native prompt() is unsupported by the in-app browser.

Evidence: `evidence/r4-foundation/object-fresh-and-import-rollback.json`, `normal-input-barrier-contact.json/.jpg`, `edited-object-fresh-runtime.jpg`, `source-isolated-boulder.jpg`. The earlier `island-a-b-a.json` is historical isolation evidence and retains its old secondary Track metadata; do not present it as a fresh capture of this revision.

11 Node tests pass; one automatic 0.30m autostep test is a preserved known failure/TODO, not a PASS. Guard classified it noncritical unless an actual required route has an unavoidable curb. Two non-improving repairs stopped; no further parameter repair. TypeScript and whitespace checks pass. Physics-independent saved-platform-pose reconstruction and 30/60fps descent tests pass.

Independent Foundation Guard: continue Phase 2 after the bounded bfcache repair (implemented). This was read-only code review, not a module or product score. All REQUIRED rows retain NOT_GREEN pending complete receiving-product evidence/critics. Next: Player Golden, then Roads/Track and Phase 3; F-R39 remains NOT_READY, F-R07 UNKNOWN. No Site/Hub publication, merge or Live promotion.

---

# KFB Island MVP R4 · Foundation implementation milestone 1

Current authority: `skills/chat/WORK_WSA_ISLAND_MVP_ONE_SHOT_FINAL_2026-10-07.md`, Frozen Matrix operationalVersion 5: **44 REQUIRED / 13 STRONGLY INCLUDE / 7 OPTIONAL PROOF**. Prior 37-row references below are historical and superseded. ONE_SHOT continues. **NO MVP; no REQUIRED row is claimed GREEN.**

Owner WB2, draft PR #348, branch `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`, baseline `e82c4c7e164b6258fb535df72e5c28143f2ce4cf`. This milestone is identified by its containing commit.

Named Scene v1 island documents now have independent storage identities, finalized Track 0.12 recipes, pinned generator lineage and native ordered sculpt strokes. Validated replacement blocks concurrent editing, captures live player state and reconstructs the last valid document on failure. Invalid saved bytes are preserved while a recoverable fixture boots. No imported Engine is instantiated.

Existing SurfaceTruth now accepts explicit visible Float32 triangles; its lattice path remains. The barycentric index is extracted from existing Track KitContact. Identical triangle arrays feed existing Rapier Physics, compiled in a reproducible pinned browser bundle. WB2 retains renderer/frame ownership. Source/lock/bundle hashes: `../wb2-design-01/owners/island-owners.provenance.json`.

Actual browser evidence: source-isolated pinned Boulder in A → same-seed B (no object/stroke state) → fresh A with identical canonical document. Overlapping Raise/Lower visibly changed native terrain and reloaded exactly. Boulder is a test prop, not Signature Landmark acceptance.

363 runtime samples after sculpt reload: maximum visible/support delta 2.71e-13 m; Rapier/support delta 0.0001556 m. Evidence under `evidence/r4-foundation/`: `surface-witness-sculpt.json`, `island-a-b-a.json`, `sculpt-fresh-runtime.jpg`. Eight Node tests pass. These are Foundation diagnostics, not visual Golden or performance acceptance.

Independent read-only Foundation Guard identified repairs to concurrent mutations, live-player snapshot, actor switching, hidden-vs-visible sculpt, invalid-save recovery and Track provenance. No product score. F-R39 NOT_READY; F-R07 UNKNOWN.

Recorded source evaluation order: base/village/pond → Track fit → bridge/river cut → protected-corridor-masked sculpt. Generation is separate from indexed support. Finalized visible updates replace support index and Rapier collider. Route authoring/invalidation and normal-input contact proof remain open before F-R29/F-R31 GREEN.

Next internal gate: swept player contact, authored collision replay, disposal evidence; automatically continue Player Golden after Foundation. Old slab road/material/composition remains unaccepted. No Site publication, merge or Live promotion.

---

## Historical handoff (superseded where inconsistent)

# WB2 island direction and foundation handoff

Georg selected bounded island documents inside WB2 and accepted the bounded closure. The local pre-pause integration is secured on draft PR #348 at source checkpoint `85ca9ad573097feb66ccbed86b72f5baeb24127e`. This handoff records the approved direction, actual reusable foundations and exported implementation gaps. **NO MVP** remains; no new island runtime or save/reload PASS is claimed.

## Decision and current owner

- Repo: `georg-doc/kayfabizarro`.
- Branch: `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`; draft PR #348.
- Runtime/document/editor owner: existing KFB WorldBuilder / WB2.
- Current authority: `ISLAND_TOPOLOGY_DECISION_2026-10-07.md`, human steering recorded in Issue #360.
- Full 37 required acceptance rows remain in force. New story, sizes and candidate schemas remain proposals.
- Endless-world prefetch, custom junction/road geometry and endless-world screenshot/performance work are stopped. No merge, Live or runtime publication occurred.

## What is built and secured

Surface Truth uses WB2 noise, a continuous triangular lattice, chunk-local mesh buffers and the same terrain triangles for render/collision. Sculpt uses the unchanged WB2 C2 `dabDeltaAt` donor, Git blob `182f7c42b709a00547a16cfe0040d5d636bdb680`. Track Core 0.12 receives route intent as CONNECT recipes; its unchanged canonical builder supplies road body and solid-support contact. Paint is excluded from physical contact. These are implementation foundations, not completed island gameplay.

Stable semantic WorldObject records survive render batching and stream-out. Current regeneration preserves authored records in the registry, but the mesh builder does not consume the returned authored matrix and colliders are built separately. Therefore registry persistence does not yet prove a visible or physical edit survives reload.

The six checkpoint files were fetched at the exact new commit and compared with intended bytes. The fresh TypeScript check and production build passed on 2026-10-07 (118 modules, main bundle 5,156.67 kB; existing >4 MB size warning). No fresh browser save/reload, new performance run or island visual acceptance was performed.

## Existing WB2 work that can be reused

| Need | Actual receiving source | Limit |
| --- | --- | --- |
| Scene editor and save/load | `../wb2-design-01/wb2d-app.js`: Scene v1, DOC_ID/STORAGE_KEY, saveDoc/reloadDoc/applySceneDocument/mountSceneRecords | Not yet connected to the imported Open-World foundations |
| Portable authoring | `wb2-mvp.v1.js`: existing `kfb.authoring-workspace-bundle/1` | Player Journey export is not a complete authoring document |
| Bounded island plan | `r2d-island-core.v1.js`: makeIslandCore, SDF, height/mask/weights, RouteRecipe | Previous failed visual composition is not new acceptance |
| Multiple islands and connections | `r2d-archipelago.v1.js`: makeArchipelago, anchors, bounds, TC.compileRecipe | One shared fixture document; per-island independent load is missing |
| Existing world/document adapter | `../world-integration-01/r2d-world.js`: prepare/patchDoc/baseHeightAt/groundAt | Seed-based single-island keys; fixed archipelago key |
| Sculpt and edit mechanisms | Existing WB2 terrain-sculpt and ToolBox edit-layer | Native stroke adapter, authoritative snap and actual collider replay still open |

The exact verified recipe container is `kfb.world-recipe-set/0.1`. The proposal's additional `kfb.world-recipe.v0` claim must be located and reconciled before adopting it as a source-proven contract.

## Exported common seams

1. **Document isolation:** `surfaceFor(seed)` and `objectsFor(seed)` are seed-keyed singletons. Two named islands with the same seed would share state. Existing restore merges records; a replacement load and disposal boundary are missing.
2. **Authored replay:** ChunkBuilder add/addInstanced must use the saved matrix for visible geometry and the same transform for relevant colliders. Explicit update of an existing authored object is also missing.
3. **Sculpt replay:** receiving Map dabs differ from native ordered strokes/points; restore lacks full finite-value and duplicate-ID validation. Current sequence is base → river/village → road fit → sculpt, while Track design excludes sculpt. This policy must be reconciled before claiming exact reconstruction.
4. **Recipe persistence:** the old scene stores RecipeSet ID and summarized graph, then reads current WORLD_RECIPES on boot. Save must contain generator/source revision and complete finalized recipe/route truth, not just counts or references to a mutable current file.
5. **Local frame:** Three terrain vertices are chunk-local, but Rapier translations and Track vertices still use global coordinates. One island-local frame must cover terrain, roads, objects, colliders, player and queries. A render-group offset alone does not solve physics precision.

The prior independent Rapier probe found up to 0.06902 m support error at enormous coordinates despite CPU interpolation improvement. This is historical factual evidence of the open global-frame seam, not an island performance or acceptance result.

Independent read-only Guard and Evidence Tester reports are saved under `evidence/ISLAND_FOUNDATION_2026-10-07/`. They confirm the human scope override and the reusable WB2 interfaces; neither granted runtime acceptance. The open seams above are intentionally exported under the bounded closure, rather than hidden behind a new JSON-only Save PASS.

## Claude donor intake

The actual Markdown proposal/handover were read and preserved as proposals. Actual local lab `roads/kit.ts` and terrain `field.ts` were inspected; Dropbox text extraction does not support their TypeScript type, so source was read from the synced local folder. The lab adapts the existing compiler and uses a custom plate fallback on roundabout refusal. That fallback and its reported edge cuts are not accepted construction and were not integrated. No new donor visual or performance claim is made.

## One next gate

**One editable bounded island in the existing WB2 document and editor path:** place and move one source-pinned object; apply overlapping raise/lower strokes; save its complete pinned document and Track recipe; fully unload the session; load a second island with the same seed; fresh-load the first island and compare the actual canonical export exactly. Visible geometry, collision and support must match the stored state and ordinary PLAY must still work.

Use stored canonical precision (WB2 position/scale 4 decimals, rotation 5, sculpt points 4) for the exact comparison. Invalid imports must preserve last-known-good state. Keep the existing WB2 UI and the approved Hub visual language; no second editor/runtime. Return this gate's evidence before expanding island count, story or universe scope. Product publication requires the complete named acceptance contract, not this technical gate alone.
