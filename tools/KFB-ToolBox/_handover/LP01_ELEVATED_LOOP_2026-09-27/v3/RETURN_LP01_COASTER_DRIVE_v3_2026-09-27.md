# LP01 · route proof v3 · "Coaster Drive" · RETURN · 2026-09-27

**First consumer of** `TRACK_MODES_AND_SKINS_SPEC_v0.1`.
**Geometry:** the same as v2 (big clothoid loop, real junctions, no structure).
**Status:** Blender preview/oracle. The Track Core reads `lp01_v3.routes.json`. Georg: PASS / TUNE on the section layout and the skin read.

## Defects and limits first

1. **Run 1 found a roll jump of 2.7° at the loop exit.**
   - Cause: `auto_bank` measured the plan heading *inside* the loop, where it is meaningless (the loop runs backwards in plan).
   - Fix: the auto-bank window is bounded by the neighbouring loop sections, so the roll is exactly 0 at every loop border.
   - **Spec note for v0.2:** F1 should be defined as the **roll rate** (°/m) plus a flip detector. As written, "Δup per metre" also counts the intended pitch of a loop (3.5°/m at the top of this loop).
2. **The junction hint is not quite accurate.** The loop option's target mode is written as `magnet_push`, but the branch actually starts in `assist`; magnet comes 110 m later. The hint should show what lies ahead (magnet icon) while the mode entry says `assist`. This will be fixed in the JSON with the next version.
3. **The field rings (magnet zone markers) dip into the bridge deck** on the low part of the run-up. It is only a preview marker; the look comes from the design job.
4. **Skin changes are hard cuts** in the preview. The spec asks for a 3–6 m transition piece, which is not built here.
5. **The blend/GLB object names carry `.004` suffixes** from rebuild runs in the same session. They are cosmetic only.
6. **Speed rule:** only an energy estimate (`v_launch` 34 m/s, `v_min` 8, `v_max` 40). There is no runtime simulation.

## Section layout (loop branch L, arc length s in m)

| s0–s1 | skin | mode | roll law |
|---|---|---|---|
| 0–111.6 | road | assist | auto_bank |
| 111.6–341.9 | magnet | magnet_push (v_launch 34 m/s) | auto_bank |
| 341.9–543.6 | coaster | locked | loop |
| 543.6–573.6 | coaster | locked | auto_bank |
| 573.6–773.9 | road | assist | auto_bank |
| 773.9–885.6 | road | assist | auto_bank |

- **Through lane T:** road / free / auto_bank over its full length.
- **Zones:**
  - `capture_loop`, s 111.6–151.7: heading error ≤ 25°, lateral offset ≤ 6 m, speed 15–40 m/s, blend 0.45 s.
  - `release_loop`: the last 10 m of the exit flat, handing back to dynamic with velocity kept.
- **Junction `loop_split`:**
  - decision window 45 m;
  - default `T_through`;
  - hints `arrow_straight` / `arrow_left_magnet`.
- **Sockets:** 24 stilt sockets (ground point + deck height) under the elevated run-up and run-out. There are none under the ring.

## Checks (spec v0.1)

| Check | Value | Limit |
|---|---|---|
| F1 roll rate max | 1.45 °/m | < 5 ✔ |
| F1 frame flip | none | ✔ |
| L1 min speed in the ring (locked, v_launch 34) | 13.2 m/s | ≥ 12.4 (√(g·r_top)) ✔ |
| Capture zone straightness (heading spread) | 0° | small ✔ |
| J2 decision window at 27 m/s | 1.67 s | ≥ 1.5 ✔ |
| Max auto-bank | 24.4° (lane-change S) | ≤ 35 ✔ |
| Geometry checks from v2 | unchanged (underpass 24.6 m, side gap 4 m, ring self-clearance 28.5 m) | ✔ |

## Skins in the preview (ribbon layer sets)

| skin | layers |
|---|---|
| **road** (red on L, green on T) | edges, centre stripe, barriers |
| **magnet** (violet) | 2 round rails + spine + white ties every 4 m + field rings every 25 m |
| **coaster** (blue) | the same rails, spine and ties, without field rings |

## Files

- `build_lp01_loop_v3.py` (md5 `21d6f64f…`)
- `lp01_v3.routes.json`: samples with `s`, `p` and `roll`; `sections`; `zones`; `junctions`; `sockets`; `skins`; `checks`
- `lp01_loop_proof_v3.glb` (3.5 MB)
- `lp01_v3_overview.png`, `lp01_v3_loop.png`
- Dropbox: `LP01-ELEVATED-LOOP/KFB_LP01_LOOP_v3.blend` (new file; v1 and v2 kept)
