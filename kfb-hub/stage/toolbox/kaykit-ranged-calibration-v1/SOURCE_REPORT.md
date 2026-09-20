# CA2-02 · Source / measurement report

Status: **SOURCE VERIFIED · BRANCH BROWSER MEASURED · HUMAN OPEN**

## Exact donors

- Gun: `Character_Gun.gltf` · pinned at `11d7df978c63b9e375707bd8d9431b4c8358cda8`; the isolated first view shows the real `gun` node before integration.
- Ranged motion: `Rig_Medium_CombatRanged.glb` · same pin · **20 clips enumerated in-browser**.
- FrizzleBob: existing Driver Graft weapon owner through current `graft-mount.v1.js`.
- GothGirl: direct Rig_Medium model; CA2 mounts the same source gun with the same existing calibration and the same muzzle-measurement algorithm. No new actor-specific Euler/socket was invented.
- Release measurement: current ToolBox `fireTimes()` donor in `fx.v1.js`.

## Measured common Rig_Medium result

Both actors resolve:

- weapon socket: `handslotr` under `handr`;
- forearm: `0.4336773697706736` model units;
- bind delta FB ↔ GothGirl: position `0`, forearm `0`, quaternion about `0.000002°`;
- existing grip: Euler `[-14, 77, 0]` in `YXZ`, offset `[0, -0.03, 0]` forearm ratios, scale `0.37`;
- barrel axis: local `+Z`;
- muzzle local: `[-0.0039, 0.1387, 1.5373]`;
- muzzle local forward: `[-0.00252, 0.08989, 0.99595]`.

Result: GothGirl needs a separate actor profile record, but **no measured actor-specific grip correction** at this gate.

## Release result

`Ranged_1H_Shoot` duration is `1.0667 s`. The measured slot angular-velocity peaks are `0.150 s` and `0.883 s`.

For the Arena single-shot contract:
- **primary release = 0.150 s**;
- `0.883 s` remains a later rotational peak and is **not promoted to a second projectile release**;
- technical recovery-start candidate = `0.350 s`, based on the first post-release local angular-velocity minimum.

`Ranged_1H_Shooting` separately exposes cadence candidates `[0.083, 0.483, 0.883, 1.283]` and remains deferred for later continuous-fire work.

## Scope boundary

No Arena target selection, projectile spawning, damage, movement, ground, rewards, audio or persistence is implemented here. WSA consumes the measured profile and retains the gameplay/release state machine.
