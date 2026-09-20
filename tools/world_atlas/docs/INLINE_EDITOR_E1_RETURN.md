# RETURN · World Atlas Inline Detail Editor E1 · 2026-09-20

Status: **IMPLEMENTED · STATIC PASS · BROWSER GATE OPEN**

## Goal

Use the promoted Dungeon Generator S13.2 as the **second real host** for the S21 inline-detail interaction without handing structural dungeon ownership to an editor.

## Result

Implemented directly in the current promoted generator:

`tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html`

E1 deliberately edits only existing detail fixtures:

- `torch`
- `candle`

Locked to the generator:

- floors;
- walls;
- corners;
- stairs;
- seams / topology.

## User interaction

- **Editor** toggles the detail-edit mode.
- Click an editable fixture.
- ✥ / `G` = move, snap 0.1.
- ⟳ / `R` = rotate around Y, snap 15°.
- ⬓ = candle only: restore generated floor contact.
- ✕ / Esc = close selection.
- Patch panel exposes `kfb.dungeon-detail-patch/0.1`.
- `Recipe JSON` sees the current edited placement values.
- Local scratch survives rebuild for the same deterministic generator scope.
- If the source asset identity changes, the stale hand patch is ignored.

## Ownership boundary

This is **not** a second dungeon generator and not a shared universal editor yet.

S13.2 still owns:
- BSP;
- levels;
- cells;
- seams;
- structural placement;
- stair/contact grammar;
- generator checks.

The editor is a presentation/authoring correction layer for detail placements only.

## Actual evidence

Static/contract audit: **20/20 PASS**.

Browser/public/Georg acceptance: **OPEN**.

## Why no `lib/edit-layer.js` yet

The intake contract from PR #120 explicitly requires a second real host before extraction. This implementation provides that second host in code, but the user interaction still needs the one browser roundtrip gate.

Only after that gate passes should the common interaction core be extracted.

## Next gate

**Browser roundtrip only.**

Seed A1:
1. enable Editor;
2. select first editable fixture;
3. move/rotate;
4. confirm patch output;
5. rebuild;
6. confirm the same transform restored.

No Resident, Scene Builder, Environment or Platformer work before this gate.
