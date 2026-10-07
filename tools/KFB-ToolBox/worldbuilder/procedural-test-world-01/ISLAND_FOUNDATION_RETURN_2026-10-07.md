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
