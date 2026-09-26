# SC02 · Supports on route sockets · RETURN · 2026-09-26

**Lane:** Claude Coworker + Blender MCP.
**Scope:** Track-Core **safe prework** (PR #222: "ramp/skyramp underside/support structures without drivable surface").
**Georg (26.09):** "top! dann gerne weiter". This came after SC01 (PR #226) and is recorded as positive feedback on SC01, not as a formal look PASS.
**Status:** CANDIDATE. Scenery only. No merge. No Stage or Live.

## Defects and limits first

1. **The routes are stand-ins until W0.**
   - A is a banked S-flyover: bank = clamp(−18·κ, ±0.22 rad), peak 13 m.
   - B is a ground road crossing under A, on undulating stand-in ground.
   - The soffit depth (2.25 m) is the RKIT body value (`K.TB.undersideDropM`). Later it must come from the core profile.
2. **The 34 m span over road B is only flagged** (`long_spans: [[206, 240]]`). Nothing bridges it: a longer girder or a portal frame over B would be a separate piece, and Georg decides whether one is wanted.
3. **Organic styles need check-driven placement.**
   - The footprint keep-out alone let one **vine** support lean 2 vertices into road B's corridor. Its bend reaches beyond its foot.
   - Now every support is checked with its real style geometry. A failing one is moved along s (vine #11: s 240 → 241) or dropped.
   - A support dropped this way leaves a longer span. None were dropped in this fixture.
4. **Roots of trunk/vine sit at ground level (0 m sunk).**
   - On the stand-in ground this passes.
   - On steeper terrain, one side of the roots may float. There is no slope check yet.
5. **The checks are vertex-based.** Same limit as SC01.
6. **Performance:** a full run of four styles takes about 43 s, near the 60 s budget. GLBs are not Draco-compressed; the organic styles are about 1.8 MB for 22 supports.
7. **Not yet tested:**
   - self-crossing routes (figure-8, loop self-overlap). The self keep-out code exists (`self_skip` window) but has no fixture;
   - water as ground.
8. **SC01 still carries its own route copy.** `lib/scenery_route.py` is the shared version. SC01 will be migrated when it is next touched (no behaviour change intended).

## What SC02 is

**Donor, unchanged:** RKIT-03 `rkit3_lib.build_support_v2`:
- footing;
- tapered shaft;
- capital disc;
- bearing plate that follows the real soffit, including bank and grade;
- style layer: classic, trunk, vine, rope.

**New in SC02:**
- **Placement rule over s:** spacing 12 m, min clear height 3 m, footprint keep-out of every other route (pad = foot 4.4 m + 1 m), own-lower-branch keep-out, and a long-span flag above 32 m.
- **Ground provider** `ground(x, z)`: later owned by the terrain/water owner.
- **Check-driven relocation** for style geometry (defect 3).
- **Donor frame adapter:** the route frame (heading + bank, grade) is converted to the donor frame format.
- **Independent checks** on the final vertices (below).

## Checks (fixture: 22 supports per style, 22 candidate positions blocked by road B's keep-out)

| Check | classic | trunk | vine | rope |
|---|---|---|---|---|
| vertices inside road B's corridor | 0 | 0 | 0 | 0 |
| vertices inside own corridor (road A) | 0 | 0 | 0 | 0 |
| plate top vs soffit + embed (target −2.00) | −2.04…−1.89 ✅ | ✅ | ✅ | ✅ |
| lowest point vs ground | −0.80 (footing sunk) ✅ | 0.00 (roots) ✅ | 0.00 ✅ | −0.80 ✅ |
| relocations | – | – | #11: 240 → 241 | – |
| **PASS** | ✅ | ✅ | ✅ | ✅ |

## Files

- `scripts/build_sc02_supports.py`: placement, adapter and checks.
  - Globals: `SC_STYLES`, `SC_RULE`, `SC_OFFSET`, `SC_EXPORT`.
- `lib/scenery_route.py`: shared route stand-in (samples, frames, windowed projection, horizontal keep-out query). Pure maths.
- `sc02_supports.placement.json`: the rule, stations, blocked ranges, long spans and per-style checks.
- `glb/sc02_supports_{classic,trunk,vine,rope}_fixture.glb`: supports on the fixture, +Y up.
- `prev/sc02_overview_crossing.png` and `prev/sc02_side_crossing_gap.png`: Blender viewport, self-check (classic set).
- Local only: `KFB_SC02_SUPPORTS_v1.blend` in Dropbox `KFB Racetrack Blender Kit/SC02-SUPPORTS/`. Collection `SC02_SUPPORTS`; classic is at Blender (1400, −3000), and trunk, vine and rope follow every 360 m in x.

## Exactly one next gate

**Georg · look/choice in Blender** (local view is set): which pillar styles to keep, and whether the 34 m gap over road B should get a spanning piece (girder or portal frame) or stay open.
