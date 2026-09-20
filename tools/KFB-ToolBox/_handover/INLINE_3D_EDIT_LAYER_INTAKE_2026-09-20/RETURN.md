# RETURN · Inline 3D Edit Layer Intake · 2026-09-20

Status: **HANDOFF READY · DOCS/INTAKE ONLY**

Repository: `georg-doc/kayfabizarro`  
Branch: `toolbox/inline-3d-edit-layer-intake-2026-09-20`  
Base: `main@5316ce6903760f19e50bb8f7f619951b43bb1f47`

## Result

The previously unpinned Claude Design Mini-Editor is now located and source-pinned.

Exact donor:
`tools/KFB-ToolBox/_inbox/KayKit Environment Atlas + Dungeon Generator + 3D scene editor TOOL (5)/KFB_Dungeon_RoomStudy_S21_EXPORT_2026-09-20/`

Classification:
**REVIEWED SOURCE INTAKE · DETAIL EDIT DONOR · NOT YET SHARED MODULE**

## Key decision

Do not build another universal editor.

Reuse the existing KFB authoring stack:
- World Composer / Prefab Lab = broad placement/composition;
- ToolBox Stage / Scene Builder = product workspace;
- S21 = object-local detail edit + semantic-group move + snap/drop + recipe-patch return.

Only after a second real integration should the shared core become `lib/edit-layer.js`.

## Recommended rollout

1. **E1 Dungeon/World Atlas** — second host; prop adjustment → recipe patch → reload.
2. **E2 Resident Atlas** — composition first, then clip/contact/IK/gaze posing.
3. **E3 ToolBox Stage / Scene Builder + Environment** — same layer, host-specific surface snap.
4. **E4 Platformer authoring** — scenery/support/resident mounts only; gameplay collision/movement remain Platformer-owned.

## Tests

Source/contract audit: **20/20 PASS**.

No browser/public claim.

## Open

- S21 export has no root `EXPORT_MANIFEST.json`.
- No independent browser rerun in this slice.
- Dungeon-specific `patchZeile()`, `raum.id`, `raum.props` still need host-adapter extraction.
- Resident pose output must reuse current ToolBox/Resident owners; no new pose schema yet.
- Platformer editor owner is not yet a promoted production tool.

## One next gate

**E1 only:** integrate S21 inline editing into current promoted Dungeon/World Atlas while S13.2 retains structural generator ownership.

Acceptance:
one real prop is selected in the generated/room scene → moved/rotated → patch emitted → source recipe updated → reload reproduces the same placement.
