# RETURN · Claude Design World + Racer Handoff · 2026-09-22

Status: **COMMITTED TO MAIN · DOCUMENTATION / AUTHORING HANDOFF ONLY**

## Repository / branch

Repository:

`georg-doc/kayfabizarro`

Branch:

`main`

Source head immediately before this handoff packaging began:

`f9a54c43ac5dae82537ed255ba7280fb5d2d474c`

The exact current main head must be re-read before Claude execution because this handoff itself adds documentation commits.

## Outcome

One single ToolBox handoff folder now contains the current Claude Design routing for:

- Cologne Racer Option C-2;
- World / Environment Authoring;
- source/failure classification across the relevant new inbox exports.

No runtime implementation was changed.

No Stage was published.

No Live promotion was performed.

## Files

- `START_HERE.md`
- `SOURCE_FAILURE_MATRIX.md`
- `CLAUDE_RACER_BRIEF.md`
- `CLAUDE_WORLD_AUTHORING_BRIEF.md`
- `CHANGELOG.md`
- `RETURN.md`

Central ToolBox handover index updated:

- `tools/KFB-ToolBox/_handover/README.md`

## Current owners retained

- Race movement / contact / route / camera state remain Race-owned.
- OSM remains geography/semantic source truth.
- Hex grid/edge/solver truth remains with existing Hex modules.
- Dungeon layout remains with existing Dungeon owner functions.
- Claude Design is an authoring workspace, not deployment/runtime owner.
- Scene editing must reuse the existing S21/S22 interaction donor and shared Scene Patch architecture instead of creating a third generic editor.
- Style references remain non-canon.
- Inbox exports remain source/donor inputs unless explicitly accepted.

## Input revisions captured

### Cologne Option C-2

Central source intake:

`930c97ca50434d579764e2219739b908816cd21a`

Race mirror:

`georg-doc/KFB-Stunt-Car-Race@cc62767161d9e1b7e0c98d924b1ad72b335e0b30`

### Scene Patch donor

PR #168 head checked:

`51f3d21cef6946adcc90820eaf100d2e42cb5391`

### 3D style/surface direction

PR #165 head checked:

`b73b4393d1f0b78740671a50261c581a31cfe040`

### Card Zone source donor

PR #172 head checked:

`cc1efb55e8d549905c70c8a4cf66552c57755224`

### Tileable Macro surface donor

PR #173 head checked:

`d770f68992c1b36703960cdb501c330b5185d3b8`

## Key recovered World Authoring decision

The combined Hex + WhackMan + S22 evidence changes the authoring order to:

`source object truth → topology/structural owner → in-scene placement → grounding/contact proof → Scene Patch/world recipe`

For difficult/asymmetric objects this replaces repeated coordinate-guessing.

The World Authoring brief therefore starts with a compact Source Object Inspector and reuses the proven S21/S22 editor interaction rather than beginning with another generator.

## Tests / evidence for this packaging slice

This is a documentation persistence slice.

Checks performed:

- source inputs read from current GitHub;
- new handoff files created on main;
- each file write followed by branch-head readback and file readback;
- ToolBox `_handover/README.md` updated and read back with the new link present.

No browser/gameplay test is claimed from this packaging operation.

## Public Stage

N/A for this documentation-only handoff.

Existing product Stages are not reclassified by this package.

## Unresolved

- Racer visual style gate is running separately in Claude Design.
- World Authoring implementation has not started from this handoff yet.
- Scene Patch PR #168 and style PR #165 remain drafts and are not silently promoted to main implementation truth.
- Final World visual canon remains a human gate after the interactive Racer style proof.

## Exactly one next gate

**Claude World / Environment starts from this handoff and proves donor parity + three isolated Source Object profiles before building the first 12–24-tile authored Hex world.**
