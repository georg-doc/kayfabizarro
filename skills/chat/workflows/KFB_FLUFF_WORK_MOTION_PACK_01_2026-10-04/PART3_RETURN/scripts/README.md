# Part 3 scripts

Run order (cloud bpy 5.0.1, numpy, scipy). Paths inside the scripts point at the session work dirs (`/tmp/f3`, `/tmp/f2`, `/tmp/fluff/ml`, `/tmp/fl`, `/tmp/loco/work`); adjust before re-running.

1. `build3.py`: push / steer clips at the Part 3 radii → `res3.pkl` (uses `lib.py`, `fk.py`, `wtool.py`).
2. `ballride.py`: ball surf / balance / dance + foot_roll → `res3.pkl`.
3. `write3.py`: `KFB_Motion_fluff01_<rig>.glb`.
4. `mk3.py`: preview actors (uses `merge.py`, `gl.py`).
5. `play.py`, `kk.py`: play-set and KayKit kick contact events.
6. `catalog3.py`: `KFB_Motion_Library.catalog.patch_fluff01.json`.
7. Renders: `knead.py` (kneaded ball), `rend.py`, `playrend.py`, `coop.py`, `sizes.py`, `compose3.py`, `playsheet.py`, `merge_ref.py` (`look` / `anim`, needs `fingerprints-512.png`).
8. `pen.py`: mesh penetration check.
