# The mannequin

Patch's 1.8 m scale figure, the jointed test dummy, rigged and animated for this block, at about 2,800 triangles. `../public/models/mannequin.glb`
is what `build.blender.py` writes (Blender 5.2, about a minute):

```bash
blender -b --factory-startup --python build.blender.py -- figure.py <ual1.glb> <ual2.glb> ../public/models/mannequin.glb 2600
```

- `figure.py`: the figure's signed distance fields (Patch, CC0), as Patch's scale figure builds them.
- `<ual1.glb>`: `Godot/AnimationLibrary_Godot_Standard.glb` from Quaternius' Universal Animation Library, Standard
  (CC0): https://quaternius.com/packs/universalanimationlibrary.html, or OpenGameArt's
  `universal_animation_librarystandard.zip`.
- `<ual2.glb>`: `Unreal-Godot/UAL2_Standard.glb` from the Universal Animation Library 2, Standard (CC0), or
  OpenGameArt's `universal_animation_library_2standard.zip`.

How it's made:

1. Every shell and ball joint is meshed on its own (OpenVDB's Volume to Mesh, then decimated to the 2,600
   triangles asked for) and joined per bone, with the Patch mark on the left chest.
2. A skeleton with the humanoid bone names the abilities' boosts look up (`Hips` to `Head`, `LeftShoulder` to
   `LeftHand`, `LeftUpLeg` to `LeftToeBase`, and the right side). Each shell is a rigid child of its bone: no skinning.
3. The arms and legs are swung, rigidly about their joints, into the clips' T-pose, so the figure's rest pose matches
   theirs.
4. Each clip is retargeted frame by frame at 30 fps: every bone turns, in world space, the way its source bone turns
   away from its rest pose, and the hips move by the source's, scaled to this figure's hip height.

| Clip | Source |
|---|---|
| `idle` | `Idle_Loop` |
| `talk` | `Idle_Talking_Loop` |
| `fold` | `Idle_FoldArms_Loop` (Universal Animation Library 2) |
| `walk` | `Walk_Loop` |
| `jog` | `Jog_Fwd_Loop` |
| `sprint` | `Sprint_Loop` |
