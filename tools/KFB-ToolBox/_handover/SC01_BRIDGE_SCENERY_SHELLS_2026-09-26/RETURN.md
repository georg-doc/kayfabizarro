# SC01 · Bridge scenery shells · RETURN · 2026-09-26

**Lane:** Claude Coworker + Blender MCP.
**Scope:** Track-Core **safe prework** (PR #222, `RACER_DESIGN_EXECUTION_OVERVIEW_2026-09-26.md`, "Blender MCP · safe prework now").
**Georg's choice (26.09):** start with the bridge.
**Status:** CANDIDATE. Scenery only. No merge. No Stage or Live.

## Defects and limits first

1. **The route is a stand-in.**
   - W0 does not exist yet, so the pieces are placed on a sample stream built from the frozen RKIT-11 profile (PR #42): straight, with vertical curves.
   - The builder only reads samples (`s, p, T, R, U, deck_half`). Swapping in the core's stream is meant to change nothing else, but that is **not proven** until B1.
2. **Only straight routes were tested.**
   - The bank and curve handling in `make_samples` / `Route.at` has not been run on a curved or banked route.
   - The NARROW variant proves parameters, not curvature.
3. **The checks are vertex-based.**
   - Each check projects the final vertices onto the nearest route sample.
   - A long face between two vertices could graze the corridor unnoticed. Tube radii make this unlikely here, but it is not ruled out.
4. **`deck_half` is a fixture number (14.8 m = 10.8 drivable + 4 m walkway).**
   - Later it must come from the core's outer profile slot.
   - The clearance height (6.5 m) is a proposal.
5. **Pylon-Loop clearance (RKIT-11 stunt) is not checked.** The loop is core geometry. It gets checked in B4/B5 against these shells.
6. **Finding in the frozen RKIT-11 fixture (the same check, run on PR #42 geometry):**
   - the pylon legs cut **0.76–0.79 m** into the walkway;
   - the hangers stand **0.56 m** inside the deck edge.

   SC01 fixes both by rule (see below). PR #42 stays frozen; this is recorded for B5.
7. **The look is still the RKIT-11 look.** Georg has not reviewed it. Changes versus RKIT-11:
   - the cables sit 0.75 m outside the deck edge;
   - new outrigger brackets carry the hangers;
   - the legs spread wider at the foot, derived from clearance.

   Georg decides the look.
8. **File and export limits:**
   - GLBs are not Draco-compressed.
   - "tris" in the sockets JSON counts quads.
   - The `.blend` is a copy of the workbench in-memory state; it contains everything, not only SC01.

## What SC01 is

A parametric **suspension-bridge scenery family**:
- pylon legs, crowns, portal arch and foundation plinth;
- main and side cables, hangers, outrigger brackets and anchor blocks.

Every piece is placed from a **route frame**: `point = p(s) + x·R(s) + y·U(s)`. Pylons and anchors use the flat heading frame plus world up.

There is **no road, deck body, parapet or drivable surface**. Those belong to the Track Core (profile, slots, edge layer). Blender shows a grey wire `ROUTE_PROXY` only for review, and it is not exported.

**Rules that replace the RKIT-11 hand placement:**
- **Legs:** the foot spread is solved so that the inner leg face stays ≥ `lat_clear` (0.6 m) outside `deck_half(s)` over the whole clearance height.
- **Cables:** the cable plane is `deck_half(s) + cable_off`, fully outside the deck.
- **Hangers:** each hangs on a **deck-edge socket** through an outrigger bracket, never on the walkway.
- **Cable height:** a function of `s`, with the main-span parabola between the pylon tops and sagged side spans to the anchors.

## Automatic checks (independent projection onto the sample stream)

| Check | MB (Mülheimer fixture) | NARROW (deck_half 9, span 200, pylons 30 m) |
|---|---|---|
| vertices inside the drive corridor (\|x\| ≤ deck_half, 0–6.5 m) | **0** | **0** |
| vertices inside the deck-body zone (0 to −3.2 m) | **0** | **0** |
| faces with a drivable role | **0** | **0** |
| minimum lateral gap, leg to deck edge | 0.626 m ✅ | 0.600 m ✅ |
| cable underside above the deck (main span) | 1.85 m ✅ | 1.85 m ✅ |
| hanger-to-socket gap, max | 0.000 m | 0.000 m |
| hangers | 110 | 72 |
| **PASS** | ✅ | ✅ |

## Files

- `scripts/build_sc01_bridge_shells.py`: the builder and checks.
  - Globals: `SC_VARIANTS`, `SC_OFFSET`, `SC_EXPORT`.
  - Runtime about 0.3 s.
- `sc01_bridge_shells.sockets.json`: sockets, parameters and check results per variant.
- `glb/sc01_bridge_shell_mb_fixture.glb` (616 KB) and `glb/sc01_bridge_shell_narrow_fixture.glb` (568 KB): shells placed on the fixture route, +Y up.
- `prev/sc01_overview_mb_narrow.png` and `prev/sc01_deck_level_mb.png`: Blender viewport, self-check.
- Local only (Dropbox `KFB Racetrack Blender Kit/SC01-BRIDGE-SHELLS/`): `KFB_SC01_BRIDGE_SHELLS_v1.blend`. Collection `SC01_BRIDGE_SHELLS`; MB is at Blender (800, −3000), next to the frozen RKIT-11 at (0, −3000).

## Exactly one next gate

**Georg · look review in Blender** (local view is set; orbit freely, do not save): PASS, TUNE or REJECT for the shell look.

After that, SC01 waits for **B1**, where it is re-placed on the W0 core stream with no code change to the placement.
