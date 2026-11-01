# RETURN · R27 Shared Claymation EyeRig Expression Modifiers
2026-11-01 · BOUNDED DOCS-ONLY DESIGN HANDOFF

**Repo:** georg-doc/kayfabizarro
**Branch:** planning/kfb-game-loop-fluff-economy-r2-2026-10-29
**Draft PR:** #460, target docs/kfb-decisions-register-2026-10-11; no merge/promotion.
**Concept owner:** existing KFB_HUB / 30_DECISIONS/replies. Georg/WS0 creative acceptance. Existing ToolBox EyeRig-v6 and Face/Actor, ChatterBox/Scenelet, Sky/World, 2D adapters, Resident and Goo/Combat remain receiving owners. No new eye system or rival material runtime.
**R27 concept checkpoint:** 289c1e5108daaede4c0b49cbcf3b90c0faa4e72e.
**Changelog checkpoint:** 8d5aa1ade3f86ee81bf0e1e48868cb6f8316bb8f.
Final branch head verified after writing Return, not self-referential.

## Delivered files
- New `GAME_LOOP_SHARED_EYERIG_EXPRESSION_MODIFIERS_R27.md`: a reusable expression/appearance/secondary-FX grammar for canonical 3D EyeRig-v6 across NPCs, Monsters, Mannequin, dioramas, Scenelets, MIB tower-orb, Skydome; X, spirals, stars, hearts, tiny lower-lid tear pools, big glossy pupils and extra readable glints.
- Append-only `GAME_LOOP_FLUFF_ECONOMY_CHANGELOG.md` now includes R27 and preserves previous R2–R8/R12–R26; R9–R11 remain old local-only drafts not on this branch.
- This Return.

## Source truth and key design constraint
The existing real `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js` at blob `853bcf5fb090dd6564fda8bc83d0b4cb527e6b26` owns eye geometry, pupil position, blink, asymmetric lids, pupil size, glossy-googly and `eyeFrame()`. The existing `kfb.eye-rig.protocol/1` is shared by 2D/3D and its modifier atlas is PREPARATION/SOURCE INVENTORY INCOMPLETE. Legacy `pet-eye-rig.v4.js` explicitly calls spirals/hearts an FX-slot **backlog**, even though `media/3D_Assets/pet-LIBRARY.json` lists fx none/spiral/heart; do not misrepresent names as implemented effects. X, stars, tears and multi-glints are proposed, not present proven variants.

The earlier EyeRig performance design cautions against independent highlight meshes and forward-scaling pupillary geometry due to clipping with the existing lids. Prefer source-safe material/reflection tests for glints and a small owner-owned pupil/eye/lower-lid modifier attached to the real eye-frame without private child indexing. Keep R26 infection/aggro/heal **status independent** of the cosmetic expression overlay and the actual actor's authoritative Combat/Resident state. Same semantics in Sky with a thin source-approved host adapter, not a second eye implementation.

Current MIB Tower Orb/Eye and the separate in-progress Sky Eye active source object/branch were **not exact-pinned in this inspection**. Do not create replacements and call them proven. Scenelet hosts must be shown in isolation before joining.

## Evidence / tests actually performed
Source inspection via GitHub: chat setup/workflow/fresh, Bigger Picture, R26/Return/changelog; actual canonical 3D EyeRig v6, old v4 donor, pet-library fx metadata, EyeRig shared protocol, cross-render static proof (browser pending), Face Modifier Atlas preparatory manifest, current 2D eye clips; targeted scene/source search.

R27 concept and changelog GitHub commits verified by immediate exact-file/branch-head readback; this Return readback follows. **Runtime tests 0; browser 0; playtests 0; render/screenshot donor-isolation 0; Sky/orb visual tests 0.** No assets produced, no Stage/Site/Live/Hub/router/central SSOT, no merge, existing World R4 NO MVP unchanged.

## One next gate
**Georg/WS0 accepts the single-canonical-EyeRig + reusable expression modifiers approach**, then the existing ToolBox EyeRig owner source-isolates the current native eyes and proves one X- or spiral-pupil modifier plus correct return to source-neutral, before expanding to the remaining family and Scenelet/Sky consumers.
