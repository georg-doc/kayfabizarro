# SC02 · Supports on route sockets · RETURN · 2026-09-26

**Lane:** Claude Coworker + Blender MCP.
**Scope:** Track-Core **safe prework** (PR #222: "ramp/skyramp underside/support structures without drivable surface").
**Georg (26.09):** "top! dann gerne weiter". This came after SC01 (PR #226) and is recorded as positive feedback on SC01, not as a formal look PASS.
**Status:** CANDIDATE. Scenery only. No merge. No Stage or Live.

**Update v4 (Georg 26.09): back to the v1 form, with a round footing. Supersedes v2 and v3.**
- **What went wrong (two repairs at the same point):**
  - v2 swapped the donor's 1.8 m square block for a low round mound. That exposed the donor's short-pillar profile fold, which the block had always hidden (the fold sits inside the block, the plate and the track body).
  - v3 then "fixed" the fold by scaling the whole profile down. The short pillars came out squashed.
  - Georg judged v1 better, and a side-by-side in Blender confirmed it.
- **v4:**
  - Donor **unchanged**: the `compact` patch was withdrawn, and `rkit3_lib.py` is byte-identical to the original (md5 98ad8609…).
  - The round footing uses the **v1 block proportions**: 6.2 m wide, top at +1.0, sunk 0.8, with a rounded top edge.
  - Only a narrow skirt (r 3.1 → 3.6) follows the ground; its rim sits 5 cm below the ground everywhere.
  - Square stays available as a variant (`SC_RULE={'footing': 'square'}`).
- **Known and accepted:** on the 3 m pillar the donor fold pokes about 0.15 m above the bearing plate. That is 0.4 m above the soffit, inside the track body, so it is invisible once the Track Core ribbon exists. It is visible now only because the proxy is a wire, and it was the same in v1. It is kept as info in `donor_profile_folds_hidden_info`.
- **Runs:** one style per call (about 9–15 s each) with `SC_KEEP=True`. The JSON is merged per style.
- **Checks:** all 4 styles PASS.

~~superseded by v4~~ **Update v3 (Georg 26.09, "something broke"): short pillars fixed.**
- **Symptom:** at the ramp ends (clear height 3–5 m, stations s 86, 98, 360) the shafts looked lumpy, with doubled discs.
- **Root cause:** a bug in the **donor** `build_support_v2`. Its shaft profile has fixed foot/waist heights, and below about 6 m cap height they overtake the capital heights, so the lathe profile runs backwards and folds into itself.
  - It was already present in v1 (same stations). The round footing's shoulder made it more visible.
  - None of the SC02 checks tested shape validity.
- **Fix, at the right layer and additive:**
  - `rkit3_lib.support_profile(cap_top, compact=False)` was extracted, and `build_support_v2(..., compact=False)` gained a new kwarg.
  - With `compact=True`, the profile is built for 6 m and scaled down in z, keeping the same proportions.
  - The **default output is byte-identical** (verified on 5 heights), so frozen fixtures such as RKIT-11 are unaffected.
  - Backup on Dropbox: `RKIT-03/scripts/rkit3_lib_pre_compact.py.bak`.
- **New check:** `shaft_profile_folds` must be empty for every station. All 4 styles now PASS.
- **Donor on GitHub:** the RKIT-03 copy in the Race repo is **not** updated yet. The patched `rkit3_lib.py` is attached here under `lib/` for WSA to promote.
- **Runtime** is now about 55 s for all 4 styles, too close to the 60 s budget. From now on: one style per call.
- **Open look question (Georg):** a 3 m support reads as a squat mushroom (footing plus plate take most of its height). Either keep it, or raise `min_height` to about 4 m and leave the ramp end unsupported.

**Update v2 (Georg 26.09):**
- The footing is **round by default**; the square footing stays as a variant (`SC_RULE={'footing': 'square'}`).
- The round footing is sunk 0.8 m. Its outer rim sits 5 cm below the ground and follows `ground(x, z)` all around, and a soft shoulder rises to a level top ring under the shaft foot.
- The donor is unchanged: SC02 swaps the footing object after the donor has built it.
- trunk and vine keep their roots and have no footing.

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
6. **Performance:** a full run of four styles takes about 49 s with round footings, near the 60 s budget. Next step if it grows: one style per call. GLBs are not Draco-compressed; the organic styles are about 1.8 MB for 22 supports.
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
| lowest point vs ground | −0.95…−0.88 (round footing sunk) ✅ | 0.00 (roots) ✅ | 0.00 ✅ | −0.95…−0.88 ✅ |
| round-footing rim above ground (max) | −0.05 ✅ | n/a | n/a | −0.05 ✅ |
| relocations | – | – | #11: 240 → 241 | – |
| **PASS** | ✅ | ✅ | ✅ | ✅ |

## Files

- `scripts/build_sc02_supports.py`: placement, adapter and checks.
  - Globals: `SC_STYLES`, `SC_RULE`, `SC_OFFSET`, `SC_EXPORT`.
- `lib/scenery_route.py`: shared route stand-in (samples, frames, windowed projection, horizontal keep-out query). Pure maths.
- `sc02_supports.placement.json`: the rule, stations, blocked ranges, long spans and per-style checks.
- `glb/sc02_supports_{classic,trunk,vine,rope}_fixture.glb`: supports on the fixture, +Y up.
- `prev/sc02_overview_crossing.png` and `prev/sc02_side_crossing_gap.png`: v1, square footings.
- `prev/sc02_round_footings_v2.png`: v2 default, round footings (still showing the folded short shafts).
- `prev/sc02_short_pillars_fixed_v3.png`: v3, short ramp-end pillars fixed.
- `lib/rkit3_lib.py`: the **unchanged** donor (the patch was withdrawn in v4; kept here only for reference).
- `prev/sc02_v4_round_v1form.png` and `prev/sc02_v4_vs_v1_square.png`: v4 short pillars, and v4 side by side with v1.
- `IDEA_SPRING_PILLAR_LAUNCH.md`: Georg's spring/bumper pillar idea, with an architecture note.
- Local only: `KFB_SC02_SUPPORTS_v4.blend` (v3/v2 superseded, v1 = square footings) in Dropbox `KFB Racetrack Blender Kit/SC02-SUPPORTS/`. Collection `SC02_SUPPORTS`; classic is at Blender (1400, −3000), and trunk, vine and rope follow every 360 m in x.

## Exactly one next gate

**Georg · look/choice in Blender** (local view is set). The round footing is accepted as the default. Still open: which pillar styles to keep, and whether the 34 m gap over road B should get a spanning piece (girder or portal frame) or stay open.
