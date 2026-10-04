# TC1 tunnel looks · review + fix for the slits (J15, 2026-09-30)

From: Coworker. For: Claude Design (Joyride J15) and Georg.
Georg 30.09: "bei D Minen-Stollen (mine) noch lücken im tunnel zu sehen etc".

## 1 · Result first

1. **The mine tunnel has real slits in the wall.** From inside you look through thin lines to the sky.
2. **Cause:** the inner wall is built from modules (mine: 46 × 5 m). Each module gets a slight outward "belly" (0.16 m) that is computed per module (`u` from 0 to 1). The joint row that two modules share therefore gets two different offsets:
   - the old module ends it at belly 0;
   - the new module starts it at belly > 0, up to about 9 cm.

   The result is a step with no face in between. Looking along the tunnel you see through it; the hill behind is only visible from outside (back faces), so the sky shows.
3. **The bug is in all four looks.** In the two stone looks the arch ribs sit exactly on the joints and hide it. In the mine the door frames only cover posts, cap and struts, so the upper corners of the joint stay open. The race tube's bands cover it only partly.
4. **Fix (one line in `lab-track/tunnel-clay.tc1.js`):** compute the belly as one continuous function of `s`:
   `belly = 0.16 * |sin(π · (s − s0) / mLen)|`
   The look stays the same (a bulge in the middle of every module, zero at the joints); only the double offset at the joint disappears. The wall still moves only outward, so the clearance is unchanged.
5. **Measured before / after** (headless J15, 900 rays per look from the tunnel axis at 2.5 m height, lateral and upward 20–80°, the first and last 30 m skipped):

| Look | Rays through the wall, before | After |
|---|---|---|
| mine | **12 / 900** (all end on the hill's back faces 18–48 m out) | **0 / 900** |
| race_tube | lateral misses at 35–80° up (older wide probe) | 1 / 900 (backwards out of the portal, not a hole) |
| stone_rect | 1 mid-tunnel miss (older wide probe) | 0 / 900 |
| stone_arch | 0 | 0 |

Pictures: `mine_slits_before.jpg` (the thin light lines), `tc1_after_fix.jpg` (all four looks, same cameras).

## 2 · Files

- `tunnel-clay.tc1.fix1.js`: the complete J15 file with the one-line fix. Bump the import to `?r=N+1` because of the browser cache.
- `tunnel-clay.tc1.fix1.diff`: the diff.

## 3 · Still open

These come from Design's own RETURN or Georg's "etc"; not changed here:

1. **Mine:** the plank wall at the portal reads like brickwork from a distance.
2. **Mine / mound looks:** T4 trees poke through the hill, because the prop guard only knows the tube.
3. **Inside every tunnel the road is dark** (sun shadow); the lamps only glow and give no light.
4. **Clearance** is Design's own check, not a Core check (mine 0.40 m, stone_rect 0.41 m, at the 0.3 m limit).
5. **Georg's choice of tunnel look** (or one per portal) is still open.

## 4 · How this was measured

- J15 from the GitHub ZIP, the two split files joined (checksums match START_HERE), served locally, headless Chromium (software WebGL).
- three 0.160 / React / pdf.js from npm instead of unpkg; KayKit assets from raw.githubusercontent at the pinned SHAs.
- Probe = `THREE.Raycaster` against the TC1 group only, once front-side and once double-sided.
  - Before the fix, the mine rays missed the wall entirely even double-sided (a real hole, not a flipped normal).
  - They ended on the hill's back faces.
