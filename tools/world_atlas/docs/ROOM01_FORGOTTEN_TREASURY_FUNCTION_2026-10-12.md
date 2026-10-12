# Room 01 · The Forgotten Treasury · Function candidate
Date: 2026-10-12
State: FUNCTION_DRAFT · original assets verified in registry · NOT IMPORTABLE/BUILT/RENDERED
Mode: BOUNDED_SLICE · room design / donor proof
Owner: `tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html` (S13.2)
Protected: `source/lib/dungeon-grid.js`, `source/lib/dungeon-light.js`, `source/lib/kit-lab.js`; no second layout/runtime owner.
Upstream: `skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/DUNGEON_GENERATOR_V2_BRIEF.md`
Function reviewer: Georg (human); no approval inferred from previous “weiter”.

## Authored proposal
A small treasure-room subregion within the existing seeded BSP generator. Intended grid footprint 3 x 3 cells (4 m cell pitch; nominal 12 x 12 m). This is **not** a freestanding 3D shell and is **not** currently guaranteed to be produced by any generator seed. The generator must select a compatible room and map the proposal to real room cells/seams before placement.

Arrival: on a **measured, traversable** existing doorway at the south, conditioned on the actual generated seam. Free central lane at column 1 through the room. Reward focal object against north edge of north-middle cell, *not* obstructing the center; aisle/backtracking remain usable. Supporting props near west/east edges only. No props in door or stair strips. Upper-storey relation is inherited from S13.2, not invented here.

### Exact source-backed KayKit candidates
Registered pack: `registry/assets/v1/packs/kaykit-dungeon-pack-1-1-free-2.json`; registry asset paths below use the prefix `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/`. These named glTF records report `dependencyStatus: complete`; **isolated visual and geometry evaluation pending**.

| Role | Registry filename | Anchoring rule |
| --- | --- | --- |
| Hero loot | `chest_gold.gltf` | back of north room edge, not in central lane |
| Secondary loot | `chest.gltf` | left edge, path clear |
| Storage | `crates_stacked.gltf` | west-side wall |
| Storage | `barrel_large.gltf` | west-side corner clearance checked |
| Furniture | `table_small.gltf` | east-side wall, after actual bounding-box measurement |
| Banner | `banner_shield_white.gltf` | wall-specific pivot/asymmetry measurement needed |
| Threshold | `wall_doorway.gltf` | existing generated seam only; not overlaid as decoration |
| Light | `torch_mounted.gltf` | inherited existing generator/light placement; no double placement |
| Floor | `floor_tile_large.gltf` | use only through existing generator recipe |

### Source-backed constraints
- 4.00 m module; S13.3 reports level spacing 4.05 m, not an authored new height.
- S13.3: `wall_corner` consumes 2.0 m of each adjacent seam arm, wall protrusions constrain safe attachment.
- `torch_mounted` pivot is backed to the wall; leave as light owner; add/measure contact shadow rather than fake bracket.
- Walls/doors/stairs remain canonical generated modules; seam keys uniquely own edges.
- Place props only on suitable floor at approx 30% edge dressing density; keep all cell centers and stair approach traversable.
- No hand-made fake KayKit assets; no Tiny Treats; no skeleton/combat; no Meshy paid calls.
- `chest_gold` is *proposed* as hero only. Asset existence alone does not prove source object silhouette, mesh contact, occlusion or scale.

### Function → Form gates (blocking)
1. Run *source-isolated* browser/model inspection for every selected prop. Record screenshot, dimensions, pivot, support face and registry revision; reject any missing or mismatched source.
2. Use **actual** S13.2 seed output to identify one fitting 3 x 3 room and a south-facing real doorway. Capture original room/seam IDs; do not hand-author a competing graph.
3. Produce floor plan with measured object marks, door/opening schedule, camera and 3-view contact sheet. Ensure complete passage and readable hero.
4. Run generator audits plus BFS connectivity before/after dressing, grounding/BVH intersections, hero sight line, floor-plan pixels and determinism across three seeds.
5. Request Georg's explicit **Function** approval of the plan/contact sheet. Only then run Form/Blender composition. Meshy needs independent spend approval if ever desired.
6. Form and Runtime approvals remain separate; no GLB/export/deploy/live assertion here.

## Evidence and open risks
- PASS (static registry): 9/9 candidate names checked against GitHub registry, dependencyStatus complete.
- NOT RUN: source isolated screenshots 0/9; direct mesh loads 0/9; generator seed 0/3; navigation 0; contact/render 0; Blender build 0; runtime 0.
- Original local `room-concept.json` is a design draft, **not** a generator-native import recipe.
- Naming collision corrected: proposed `crate`, `barrel`, `table` changed to confirmed `crates_stacked`, `barrel_large`, `table_small`.
- No Stage/Site route created or claimed.

## Single next gate
**Source-isolation + seed fit:** show the nine exact registered KayKit objects individually and find a real S13.2 seed/room/seam arrangement before declaring the 3 x 3 layout buildable.
