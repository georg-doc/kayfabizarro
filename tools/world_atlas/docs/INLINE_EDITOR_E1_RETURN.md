# RETURN · World Atlas Inline Detail Editor E1 · 2026-09-20

Status: **FROZEN CANDIDATE · STATIC PASS · BROWSER PROOF HARNESS-BLOCKED**

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


## Browser-gate recovery

Two proof attempts were consumed without reaching a valid application assertion:

- `35487119077 / 106015440253` — browser page/WebGL loaded, but the first QA command never terminated and was killed by its outer timeout;
- `35487373804 / 106016124834` — replacement CDP harness failed in Node 22 before page polling because it mixed `require()` with top-level `await`.

This means:

- editor browser result: **NOT TESTED**;
- editor runtime failure: **NOT PROVEN**;
- third repair in this slice: **STOPPED**.

Full recovery:
`docs/INLINE_EDITOR_E1_FAILURE_RECOVERY_2026-09-20/START_HERE.md`

The automatic workflow has been removed from the branch so subsequent handoff commits cannot trigger an accidental third attempt.

## Revised one next gate

A **separate QA-only slice** may test the unchanged `?e1proof=1` candidate with a minimal valid CDP harness using one Node module system.

No edit-layer extraction and no Resident / Stage / Environment / Platformer implementation before that proof.
