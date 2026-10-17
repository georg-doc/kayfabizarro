# LP01 · Elevated loop with free underpass + lane-change split · route proof v1 · RETURN · 2026-09-27

**Source idea:** Georg 27.09 (`IDEA_ELEVATED_LOOP_WITH_UNDERPASS_2026-09-27.md`).
**Status:** ROUTE PROOF. It has centrelines, ribbon-cable layers, automatic checks and structure proxies. It is not drivable by design, because the Track Core builds the surface from `lp01_loop.routes.json`. Georg decides PASS / TUNE.

## Defects and limits first

1. **The loop ring is circular.** At 24.1 m/s entry speed, a circular ring gives about **6.4 g** at the entry.
   - Real loops use a clothoid/teardrop profile, with a larger radius at the bottom and a smaller one at the top.
   - That shape belongs in the Track Core loop piece. The circle here only proves space and clearance.
2. **The corkscrew shift is 28 m.** The loop starts at y = +14 and ends at y = −14, so the ring reads as a wide "barrel" between the pylons.
   - TUNE options: a smaller shift (it needs ≥ 12 m for side-by-side lanes plus a gap), or keep the barrel as the look.
3. **The side gap to the through lane is only 2 m edge to edge** on the low parts of the run-up and run-out.
   - That is enough for barriers, but a guided lane change needs the barrier to be the guide there.
4. **The frame bug was found and fixed in this run, and it is a lesson for the Track Core.**
   - v1 used rotation-minimising frames. Through the corkscrew loop they gave about 126° of roll at the loop exit, so the deck came out tilted.
   - The fix uses a guide vector: lateral = world side axis projected perpendicular to the tangent.
   - **A loop needs an explicit roll law, not free parallel transport.**
5. **Structure is proxy only:** SC02b classic supports as cylinders with caps, and SC01-style pylons as boxes with a crossbeam and 7 hangers. The ring is not yet structurally joined to the run-up.
6. **The speeds are arcade estimates:** energy only, with no friction or drag.

## Recipe (one core, pieces as data)

`split S → climb → flat → corkscrew loop over the through lane → flat → descent → merge S`, all on one bridge deck.

- **T (through):** straight at road level. It passes under the loop ring at full speed.
- **L (loop branch)** runs in this order:
  1. quintic lane-change S, 14 m over 110 m;
  2. 120 m climb to 7.5 m with parabolic vertical curves;
  3. a 20 m flat;
  4. the loop, R 11 m, top at 29.5 m, shifting from +14 to −14;
  5. a 20 m flat;
  6. a 120 m descent;
  7. the merge S.

## Checks (auto, from the script)

| Check | Value |
|---|---|
| Lane-change S: min radius / lateral load at 27 m/s | 149.7 m / 0.50 g ("small drift") |
| Max grade (climb and descent) | 7.81 % |
| Speed at loop entry (after the 7.5 m climb) | 24.1 m/s |
| Speed at loop top / required √(gR) | 12.3 / 10.4 m/s ✔ |
| Loop entry load (circular) | 6.4 g ✘ (teardrop needed, see defect 1) |
| Underpass: min clear height above the through lane (full deck width) | 15.39 m ✔ |
| Side gap to the through lane (low sections) | 2.0 m |
| Ring self-clearance (non-neighbouring parts) | 21.74 m ✔ |

**Finding for Georg's idea:**
- Thanks to the corkscrew shift, the through lane passes under the ring with 15 m of clearance. That would hold even with the loop at road level.
- The **elevation** therefore buys drama, the run-up and a loop visible from afar, plus the bridge integration. It is not needed for clearance.
- Without a corkscrew shift (a pure vertical loop straight above T), the elevation becomes mandatory: loop base ≥ ~7.3 m.

## Ribbon-cable layers used (input for the layer spec, next step)

| id | lateral | height |
|---|---|---|
| edgeL / edgeR | ∓5.4 m | 0.08 m |
| centre | 0 | 0.08 m |
| barrierL / barrierR | ∓6.2 m | 1.0 m |

These are also exported in the routes JSON as `ribbon_layers`.

## Files

- `build_lp01_loop.py` (md5 `2b94d48b…`)
- `lp01_loop.routes.json` (runtime frame; routes `T_through`, `L_loop_branch`; sockets split / climb_start / loop_entry / loop_exit / merge; checks; layers)
- `lp01_loop_proof.glb` (1.9 MB)
- `lp01_overview.png`, `lp01_side.png`
- Dropbox: `LP01-ELEVATED-LOOP/KFB_LP01_LOOP_v1.blend` (new file)

## Next

1. Georg: PASS / TUNE on route rhythm and on the barrel look.
2. Layer spec: names, offsets and rules for all track layers, including the loop roll law.
3. Design-language brief for Claude Design, built on that spec.
