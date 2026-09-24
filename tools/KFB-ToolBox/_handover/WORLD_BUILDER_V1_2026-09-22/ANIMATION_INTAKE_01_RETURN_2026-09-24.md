# Animation Intake 01 · Part A RETURN · registration for WSA · 2026-09-24

**Status:** Part A is delivered. The library is on GitHub, and Part B can start.

- **Where:** `media/3D_Assets/Animations/KFB_Motion_Library/`
  - `KFB_Motion_Library_Rig_Medium.glb` and `KFB_Motion_Library_Rig_Large.glb`: 33 actions each, armature only.
  - `KFB_Motion_Library.catalog.json` (`kfb.motion-catalog.v1`).
  - `sheets/`: 33 contact sheets.
  - `NOTICE.md` and `RETURN.md`.
- **Licence:** Georg (2026-09-24) says the licence question is settled, within the storage rule in §2 of the intake. The raw FBX stay in the private Dropbox; the runtime clips live in the public repo as part of the game, with `NOTICE.md`.
- **Source of the clips:** the Blender MCP chat. The raw FBX, the bake script and the log are in Dropbox `BLENDER MCP/MOTION_LIB` (private).
- **Consumers, now unblocked:**
  - Animation Lab v2, Part B in Claude Design: load the catalogue plus the two GLBs.
  - The WorldBuilder walker reads clips by id.
  - The Orc band uses `kfb_music_guitar_a` (accepted) and `kfb_music_drums_a`.
- **Not in this delivery:**
  - The standing drummer v5 (a separate Blender file, lunge still open).
  - `bestVariant` reviews for all variants except Guitar A.
