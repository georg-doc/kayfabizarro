# KFB Skin Stack v0.1 · Walls / Track / Nature Gizmos
Date: 2026-10-12 · Status: AUTHORING / CONTRACT PLAN ONLY · no runtime, Site publish, material adoption or user visual acceptance.
Owner: existing **KFB Surface / Material Language**. Receiving owners: **Track Core + Joyride** (roads/race), **World / Surface Truth** (terrain and world attachment), **Prison Maze Blender greybox** (its graph/walls), **Asset Registry / Librarian** (asset truth). This is a coordination contract, **not** a new shared render/terrain/gizmo owner.
Planning branch: `georg-doc/kayfabizarro@planning/kfb-skin-stack-nature-intake-2026-10-12`.
Related Race Track Gizmo plan: `georg-doc/KFB-Stunt-Car-Race` Draft PR #43, `ChatGPT_web/track-lab/gizmo-pilot-01/`. Do NOT rewrite Race PR #43, accepted Race v0.8 feel, or unmerged Track Core v0.14.

## Read-first precedence and donor receipts
- Shared clay visual SSOT: `tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md` and `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md`, on `work/clay-style-ssot-2026-10-01` PR #301. Files are *not yet present on main*. K1/H0 is pixel Golden; K2/v10 is a candidate technical implementation until Golden parity.
- Binding separation: `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md` and `skills/chat/KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md`.
- Route/sample/contact owner: Track Core; latest reviewed candidate on Race branch `trackcore/v013-junction-lanes-2026-10-08`, `track-core/v0.14/track-core.v014.mjs`, **unmerged**. Race Draw/Drive v0.8 accepted but not retuned by this plan.
- Joyride source/transition grammar: pinned source isolation required. No generic fake Joyride surface, kerb or barrier replacement.
- Prison maze existing owner: `blender-mcp/prison-maze-greybox-2026-10-10`. Existing graph, curved/grade-adaptive wall UVs and brick material are preserved. Island Form Kit `blender-mcp/island-form-kit-01-2026-10-11` is concurrently tuning shape; do not cross-write.
- Blender GN Gizmos donor: built-in Linear/Dial/Transform; instances/scatter are authoring controls, not runtime semantics. No dependency on the Reddit author's unpublished node graph.
- Low Poly Tree Pack / Broken Vector inventory intake: `tools/asset_registry/intake/LOW_POLY_TREE_PACK_INTAKE_2026-10-12.md`. Real source only; usage rights and texture assignment TBD.

## Authoritative four-layer contract (no extra implementation owner)
```
1 FORM/TOPOLOGY RECIPE   existing owner (wall graph / RouteRecipe / terrain) 
2 VISUAL MESH FAMILY     additive replaceable visible body, trim and silhouette (non-authoritative collision)
3 SURFACE PROFILE        KFB Material/Clay SSOT, texel/relief/UV and LOD
4 DRESSING / SCATTER     source-backed AssetRefs, fixtures, protected navigation envelopes
```
A skin selection is a **recipe reference to presentation**; it must never silently change path topology, segment identity, collision, lane/road width, maze accessibility or terrain support. A heavy mesh swap whose outer silhouette intersects the original collision envelope must be rejected or explicitly reclassified as an **owner-reviewed geometry change**, not a free cosmetic skin.

### Proposed authoring record (candidate schema; no duplicated runtime)
```json
{
  "schema": "kfb.skin-stack.proposal/0.1",
  "target": { "owner": "track-core", "recipeId": "ORIGINAL_ID", "segmentId": "ORIGINAL_SEGMENT_ID" },
  "visual": { "meshFamily": "track-clay", "profileRef": "REGISTERED_PROFILE_REQUIRED", "materialRef": "CLAY_SSOT_PROFILE_REQUIRED" },
  "attachments": { "setRef": "ASSET_REGISTRY_PACK_REQUIRED", "seed": 101, "density": 0.3, "exclusionMasks": ["drive", "junction", "stunt", "sightline"] },
  "evidence": { "sourceIsolated": false, "renderParity": false, "contactChecked": false, "licenseVerified": false },
  "status": "PROPOSAL_ONLY"
}
```
Those symbolic strings are **schema examples**, not claims that referenced registered assets or profiles already exist. No actual ID may be invented at deployment.

## First four comparison packs (classification is intentional)
| Proposed look | Texture-only? | Mesh + material? | Full shape? | Owner guard |
| --- | --- | --- | --- | --- |
| **W1 Clay stone wall** | Insufficient for stone silhouette | **PRIMARY**: bounded stone bulges/joints, rounded edges, real KFB clay relief | Only if separate wall silhouette actually approved | Maze graph/seams/passage widths, slope, ground contact unchanged |
| **W2 Sci-fi wall** | Sometimes for panel colour/decal only | **PRIMARY**: trim panels, edge bezels, optional fixtures/light emissive | Only owner-reviewed when hard-pylon silhouette changes footprint | No new barrier collision, hidden door or unregistered mesh |
| **T1 Clay/Joyride track** | Material tune alone possible but not full clay body | **PRIMARY**: accepted Joyride kerbs, handmade edge/body language, prescribed clay surface | Track Core owns any changed drivable/contact mesh | RouteRecipe/ports/drive physics unchanged |
| **T2 Sci-fi track** | Variant flat skin, markings | **PRIMARY**: panel trims/guardrail visuals, lights | If banking/width/profile changes, requires Track Core recipe & contact rebuild | No parallel track sweep or phantom drive surface |

**Contextual extension, not four additional first-pass builds:** Prison stone, toy plastic, traditional asphalt, industrial metal, organic/clay plant beds, surreal KFB motifs may be selections once real source assets/profiles pass isolation.

### UV/texture strategy
- Walls: deterministic longitudinal metres/U, world vertical metres/V; bevel caps and trim need correct UV seams and normal handling. Preserve existing Prison Maze Step C brick UV and contact; DO NOT replace it with a second GN UV method without A/B.
- Tracks: canonical Track Core arc-length (s) for U, cross-section slot distance for V, stable lanes/kerbs/stripe masks and segment IDs. Junctions require own seam semantics; map cosmetics using official samples, no camera-UV distortion.
- KFB clay: K2/v10 three-axis/rest-space physically scaled marks/relief and derivative-aware gradients, still **K1/H0 visual Golden parity-gated**. Preserve source maps/vertex colours. Prefer baked instance-friendly variants and fade microdetail at far/low screen footprint.
- Sci-fi: trim/atlas sheet for repeated panels; ID/seed-stable decals; emissive cues obey one owning light/FX service; avoid UV stretch along hairpin bends or slope changes.
- Texture-only vs visible-body vs true topology change must appear in versioned per-family metadata; do not present collisions as solved by shader polish.

## Nature/Tree Gizmos — accepted as authoring *proposal*
Tree and nature authoring is an excellent GN Gizmo use case and should consume registered source models:
- **N1 Grove boundary** (Transform/curve): edit a closed or open planting region and shape a forest edge.
- **N2 Density/spacing** (Linear): instance density and min separation; persistent deterministic `seed`.
- **N3 Species mix / season** (panel selectors, NOT fictitious viewport gizmos): selects *registered* donor trees; Broken Vector colour variants are texture candidates, not proven material swaps.
- **N4 Crown scale / rotation** (Linear/Dial where meaningful): non-uniform randomization clamped; leave trunk and foot support stable.
- **N5 Terrain/slope mask**: World/Surface Truth provides measured attachment normal/height, water/slope eligibility, slope align ceiling, avoidance masks, track clearance, player sightlines and safe landing. Never author a second terrain height calculation in the scatter tool.
- **N6 Wind/animation later**: visual-only sway profile consuming existing animation/environment signals, not a new world physics owner.
- **N7 Seasonal/Sci-fi later**: style profile changes leaves, branch meshes, emissive adornments or palettes *only after isolated donor/rights and material checks*. No unsourced procedural replacement counted as reused Broken Vector tree.

**Nature Gizmo recipe contract**: `sourceAssetIds[]` (Registry exact path+source pin), `region / splineRef`, `seed`, `density`, `minSpacing`, `scaleRange`, `normalAlignment`, `seasonRef`, `height/slope maskRef`, `exclusionMasks`, `renderLOD`, `collisionPolicy`. Output = instance transforms + source IDs + optional baked render instances, never mutate source assets.

## Implementation sequencing
**G0 · source-isolated references:** capture originals alone for a) one existing Prison Maze brick section, b) K1 nature/tree and clay wall/road donor, c) a current Track Core v0.14 curve, d) newly inventoried tree-pack models after DAE conversion. Record rights, material, mesh, UV and bounds.
**G1 · W1 (Clay wall) two states:** keep one existing Prison Maze wall geometry and stable graph; compare original brick vs candidate clay presentation with equal camera/light and open passages. No Island MVP R5.
**G2 · T1 (Clay track) two states:** exact Track Core recipe unchanged; compare native track/Joyride versus clay surface+rim variation; verify collisions/sections/samples unchanged.
**G3 · W2 and T2:** after G1/G2 material/mesh budgets and one visually coherent gate; don't build fantasy models merely to fill a 4-pack checklist.
**G4 · Nature authoring candidate:** prove one grove edit from registered source trees, stable seed and exclusion masks with true slope/grounding; complete DAE conversion, rights and registry gates first.
**G5 · Site:** existing ToolBox/Asset Librarian/GPT Site only when functioning consumer product and visual QA exist. Existing Production Control Site may store plans/Returns without Site republish. No new Site or Cloudflare mirror from planning alone.

## Test matrix — source and consumer checks, NOT RUN
- SOURCE: exact donor visible alone, orientation, pivot, extents, UVs, texture/licence and source revision.
- RECIPE: same graph/route/seed, deterministic before/after and re-import; paint-only swap changes 0 path/collision IDs.
- FORM: attachment/support measured, door aperture and maze route clear, no slope float, no folded road inner edge, UV stretch bound, camera-space clearance.
- MATERIAL: source recognizability, K1 Golden parity at locked camera, near/mid/far, contact/shadow (no white seams), night readability and emissive ownership.
- PERFORMANCE: instancing vs baked, active draw calls/triangles, texture footprint, LOD pop, mobile budget; numbers measured not inferred.
- SITE: don't claim live until exact running canonical GPT Site revision is inspected. Cloudflare is not a substitute.

## Next single gate
**KFB_SKIN_STACK_SOURCE_ISOLATION_W1_T1_R1** — show the actual Prism/Prison wall donor and existing Joyride/Track donor in isolation, then create same-geometry/same-graph A/B for *one* wall and *one* track with genuine SSOT material and editable preview. Tree models stay a separate intake sidequest (see Intake Return) and do not block these two style comparisons.

## Additive nature asset batch · 2026-10-12
- New source intake also covers **Broken Vector LowPolyRockPack.** (literal trailing dot; BLEND + Models.zip) and **modular_terrain_collection.zip** (archive source-only; contents/rights unverified). Do not invent rock models or modular plate/terrain geometry until originals are extracted and shown alone.
- Exact source JSON, rights/format flags and Claude Code route live under `tools/asset_registry/intake/NATURE_BATCH_2026-10-12.md` and `NATURE_BATCH_SOURCE_2026-10-12.json`.
- Future nature Gizmos can guide rock patches/cliff boundaries and placement density, but World/Surface Truth retains terrain/contact and Skin Stack retains visual-only role. No new engine or current Island MVP runtime authorization.
- Preserving first next Skin Stack gate `KFB_SKIN_STACK_SOURCE_ISOLATION_W1_T1_R1`; the parallel Asset Librarian source gate is `NATURE_BATCH_AR4_REFRESH_PLUS_SOURCE_ISOLATION_R1`.
