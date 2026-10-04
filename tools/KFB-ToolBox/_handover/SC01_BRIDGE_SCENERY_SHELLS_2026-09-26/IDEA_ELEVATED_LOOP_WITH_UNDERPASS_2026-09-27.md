# IDEA · Elevated loop with free underpass + lane-change split, integrated into the bridge architecture · 2026-09-27

**Source:** Georg, 27.09.2026 (voice note, condensed).
**Status:** IDEA, noted. Not built. It is a third variant next to the earlier ones ("Hundeklappe" flap in the loop end piece; full-width funnel).

## Georg's idea

- The loop gets **its own climb before the loop**. The run-up gains length and height, so the loop sits **elevated**, and the through lane can pass **freely underneath** it.
- **Lane change** before the loop:
  - keep right = straight through under the loop at full speed;
  - keep left = up into the loop.
- The lane change is guided by **auto-drive or barrier guidance**, drivable at full speed with a small drift in the curve.
- The split can sit **earlier, on the bridge**. The loop is then built with the **bridge pylons and support pillars** (SC01/SC02 families), so it looks like part of the existing bridge architecture.

## Coworker notes (first numbers, to be verified in a proof)

- **Underpass clearance:** ~5 m for vehicles and camera, plus the track body (~2.25 m). The loop base therefore needs to sit **≥ ~7.3 m** above the through lane.
- **Climb:** at 6 % that is ~120 m of run-up; at 8 %, ~90 m. The run-up can start on the bridge deck.
- **Lane change at full speed (≈27 m/s):**
  - a lateral shift of one lane width (≈14 m) needs a clothoid S-curve of roughly 90–120 m for a moderate lateral load;
  - a small drift is plausible at the shorter end.
- **Supports:** the elevated run-up and the loop foot get SC02b supports (classic default). The loop ring itself hangs between two SC01-style pylons, so it reads as a bridge element, not a separate fairground ride.
- **Track Core rule:** this is a *route recipe*: split + climb + loop + merge on one core. Pieces are data; there is no separate loop track.

## Possible prework (safe, before W0)

**LP01 route proof in Blender:**
- centrelines only: split, climb, elevated loop, underpass lane, merge;
- automatic clearance and grade checks;
- supports placed along it;
- one screenshot for Georg.

Its output would be route JSON for the Track Core, the same kind of prework as SC01/SC02, not a track generator.
