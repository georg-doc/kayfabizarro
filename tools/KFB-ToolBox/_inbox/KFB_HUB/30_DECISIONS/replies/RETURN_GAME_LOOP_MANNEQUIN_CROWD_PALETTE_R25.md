# RETURN · R25 Mannequin Crowd Palette
2026-11-01 · Docs-only source-audited KFB concept; no 3D recolour implemented

Repo: `georg-doc/kayfabizarro`
Branch: `planning/kfb-game-loop-fluff-economy-r2-2026-10-29`
Draft PR: #460; base `docs/kfb-decisions-register-2026-10-11`; remains Draft, unmerged.
Owner: existing KFB_HUB / 30_DECISIONS/replies. Receiving owners remain the current Actor/FrankenStein Material, Motion, Resident/World, R24 Crowd. Georg/WS0 editorial gate.
R25 concept commit: `26ab5b672a5f1ec8658b221b1fbb5470c7e97df5`
Additive changelog commit: `fa3dd4cb826516f5ee2e32599c2d3ce8a29392e9`
Final HEAD verified after this Return file.

## Deliverables
- `GAME_LOOP_MANNEQUIN_CROWD_PALETTE_R25.md` new R25 source-and-design note.
- `GAME_LOOP_FLUFF_ECONOMY_CHANGELOG.md` R25 appended; existing R2–R8 / R12–R24 retained.
- `RETURN_GAME_LOOP_MANNEQUIN_CROWD_PALETTE_R25.md` this Return. Prior R9–R11 local-only notes not promoted.

## Concept
Preserve the native KayKit Mannequin's recognisable blue/red outfit and silhouette; proposed 4–6 **shared** gentle body/outfit palette variations (original, dusty blue, teal, sage/olive and optional small shifts), with uniform warm head/hands **only where measured native material/UV source can support it**. Else preserve the original texture/head/gloves and avoid new zoning.

Actual `registry/assets/v1/packs/kaykit-character-animations-1-1.json` confirms exact pinned native Medium (420044 bytes, blob c15d93a623acde4c08862290f4465bb994506fd8), Large (541784 bytes, blob c332cd774562dc053aa93c450fe0eb618a73c213), source mannequin texture (18117 bytes, blob d9f5ae836be8ab2988a2d26e33b47ee47a7a181a). Legacy `graft-biped.v1.js` found `HOST_HANDS.medium='gloves'` and an orange glove `#ea5229`; Mannequin **did not present evidence of a skin zone**. The graft head is FrizzleBob, not a proof for native Mannequin head material. No native GLB UV-level visual inspection performed.

Three.js docs confirmed `SkeletonUtils.clone` clones bone hierarchy while referencing shared geometries/materials; palette materials may be assigned per group, but direct shared material mutation recolors all clones. `InstancedMesh.setColorAt` alone is no independent skeletal actor instancing and whole-atlas tint changes head/hands. Prefer offline prebuilt source-preserving variant texture palette; role/material split only after actual source evidence; custom shader mask deferred.

## Evidence and unresolved
Source files read via GitHub; official Three.js InstancedMesh/SkinnedMesh/SkeletonUtils docs checked. Actual tests: runtime **0**, browser **0**, playtests **0**, GLB/texture source-isolated visual evidence **0**, animation FPS or crowd budget **0**. No assets produced; no Game/Motion/HUD/Hub/World/Stage/Site/Live changes; no PR merge. World R4 still NO MVP.

**Unresolved:** native GLB material/UV assignment, native face/hand pixels, Medium-vs-Large palette compatibility, skin tone vs originally painted gloves, near animated crowd budget and any actual accepted World crowd material consumption.

## Exactly one next gate
Georg/WS0 approves an **original-blue/red + 4–6 coherent variants, conditional fixed warm head/hands** palette direction, and directs the existing Actor/Material owner to show exact original native Mannequin Medium GLB/texture in isolation, then one side-by-side recolour without face/hand bleeding. Large later only if needed. No runtime promotion by this docs write.
