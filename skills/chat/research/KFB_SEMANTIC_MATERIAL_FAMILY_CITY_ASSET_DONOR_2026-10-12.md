# Semantic Material Family / Headless Blender City Asset Donor · 2026-10-12

Status: **SOURCE-READ RESEARCH / REUSE PATTERN · NOT TESTED / NOT ADOPTED**.
Owner: existing **KFB Surface / Material Language** research; OSM City Lab geometry, Asset Librarian/source manifest, WorldBuilder, KFB Clay K1/K2, Track and environment owners remain unchanged.
Branch: `planning/hybrid-baked-clay-texture-architecture-2026-10-07`.

## Primary source
- Reddit original: https://www.reddit.com/r/aigamedev/comments/1x2v4fp/work_smart_not_hard_or_how_i_waste_my_200/
- Author: u/Kiko_Production; solo Godot city builder; text was directly retrieved on 2026-10-12. Visual video not independently inspected or tested.
- Reported: original 8-step individually textured building pipeline replaced by one ChatGPT-generated style-sheet concept, Claude-generated headless Blender mesh script, semantic material-slot names (`brick`, `roof_shingles`, `plaster#e8c9a0`), and one in-engine shader mapping to reusable tileable hand-painted swatches. User reports ~20 unique buildings overnight, 8–10 to 100+ FPS on RTX 4060. These are **author claims, not KFB measurements or verified causality**.
- Grass improvement described as adapting an external tutorial after multiple attempts; no validated grass algorithm/implementation was provided.

## Compatibility with current KFB design

This is strongly aligned with **existing** `skills/chat/KFB_HYBRID_BAKED_CLAY_TEXTURE_ARCHITECTURE_PREP_2026-10-07.md` and `skills/chat/KFB_SURFACE_MATERIAL_LANGUAGE_STEERING_2026-10-07.md`:
- Existing KFB proposal: `BuildingRecipe → MaterialFamily → baked atlas/array → cheap per-instance variation`.
- OSM city semantics/IDs and geometry remain with OSM City Lab; do **not** create a second generator or convert style templates into a new geometry owner.
- Existing K1/H0 visual Golden and K2/v10 Clay remain material references/implementation authority. Claybound-level whole-scene quality is a higher-priority acceptance gate than raw FPS.
- Existing A–E same-scene material comparison remains the lab; do not create a new UI/editor, shader owner or runtime branch.
- MasterSelects agent/editor donor test is separate `KFB_MASTERSELECTS_AGENT_EDITOR_DONOR_PROOF_2026-10-12.md`.

## Proposed donor patterns (not new KFB decisions)

1. **Semantic material slots:** author primitive/headless Blender assets with simple descriptive slots (wall/plaster, roof, wood, metal, trim), rather than unique baked image maps per building. Export material identity and stable part IDs without conflating labels with the authoritative KFB family registry.
2. **Reusable material-family mapping:** existing KFB owner maps slots to a bounded tested swatch/atlas/material profile; per-instance palette/UV/seed variation. No per-house diffusion, no arbitrary texture regeneration for color variants.
3. **Headless repeatability:** if an owner supports it, generate a small fixed set of variants from one geometry family with script and record script/version, seed, asset provenance, dimensions, pivot and material assignments.
4. **Visual parity over throughput:** same camera, lighting, scene, scale and source assets compare KFB Claybound/K1/K2 and the cheap atlas/swatches. Test day/night and near/mid/far plus material contacts, silhouettes and shadows. Imported assets must be SOURCE ISOLATED (original and KFB style separately) before integration.
5. **MVP time budget:** before inventing a specialized asset pipeline, perform bounded donor/known-solution search. Limit any experiment to one representative building family and one existing lab scene. Avoid repeated unconstrained agent loops.
6. **Grass:** classify as method-only (research existing techniques before inventing); no unverified tutorial as new grass donor or requirement.

## Smallest later proof (only with owner/executor authorization)

A. Choose **one existing KFB-approved building/prop geometry family**, not a newly invented demo town. Verify original model and reference camera in isolation.
B. Produce three slot/atlas material variants of that same geometry through existing KFB Surface/Material lab (headless Blender can be used as an offline donor if relevant).
C. Verify slots, pivot, scale, stable identity and deterministic re-export/fresh import.
D. Compare screenshots alongside same-scene K1/K2 Golden in near/mid/far and day/night, and measure draw calls, texture memory, GPU/frame time if available. No assumed 100 FPS or material-quality PASS.
E. If variants achieve genuine KFB source-quality and ownership stability, propose **ADAPT PATTERN** for a later authorized Asset/OSM slice. Otherwise keep as RESEARCH/REJECT; no runtime integration.

## Acceptance / protections

- Code and visual sample from Reddit are not available for direct reuse; only described method can be evaluated.
- Blender/Godot technique is not a promise of browser Three.js/WebGPU compatibility.
- Do not silently turn this into an Island R5. Island R4 stays STOPPED / NO MVP / F-R39 FAIL and current Four-Island story A/B remains the relevant World design gate.
- No new Surface implementation, Asset Librarian owner, Academy runtime, WorldBuilder asset rewrite, Track Core or Cloudflare/GPT Site publishing.
- Stage only if separately named and explicitly required. Any human-facing public route must meet current KFB Stage rules.

## Source/research evidence
Text source checked, repo Surface prep and prior donor report checked. **Builds: 0; material/3D generated: 0; screenshots: 0; performance runs: 0; source-isolation passes: 0; stage routes: 0.**

## Next gate
**KFB_SEMANTIC_MATERIAL_FAMILY_ONE_ASSET_PARITY_PROOF_01** — conditional on later approval; does not supersede active Surface lab inspector gate or MasterSelects donor proof.
