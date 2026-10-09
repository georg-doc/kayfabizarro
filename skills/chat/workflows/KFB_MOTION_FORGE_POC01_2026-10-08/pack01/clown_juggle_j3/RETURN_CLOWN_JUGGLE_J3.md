# Motion Forge · sprint #381 item 5a · Clown juggling J3 · RETURN

- **Issue:** #381 · branch `blender-mcp/motion-forge-poc-01-2026-10-08` · 2026-10-09
- **Status:** Georg on 2026-10-09: "einbaufähig". Check it in for the MVP slice: the Clown juggles on his podium at the marketplace, later with Chatterbox lines and bad jokes. Fine-tuning comes later. The catalogue patch is additive and **not applied**.

## Defects and open points first

1. **Clubs across the face.** In a 3/4 front camera, a rising and a falling pin cross at eye height on the camera side for frames 19–22 of every 32-frame cycle. 24 of 96 frames touch the face box (clay balls: 10/96). Two candidate fixes:
   - lift the arc higher over the head;
   - use clay balls as the marketplace default.
2. **Held pin at the belly.** A held pin comes within 0.004 of the belly (no visible penetration).
3. **Clown eyes not reviewed.** They use the clown AUTO_CANDIDATE profile from `eye-rig-medium.batch-1.json`, which Georg has not reviewed.
4. **Prop tracks are data, not a GLB animation.** `data/clown_juggle_j3.prop_tracks.json` carries one transform per frame per prop. The runtime places each prop as a child of the actor root.

## What was built

| Item | Value |
|---|---|
| Clip | `kfb_clown_juggle_cascade3_b`, Rig_Medium, 96 frames at 30 fps, seamless loop, no root motion |
| Pattern | 3-prop cascade; hands alternate every 16 frames; each prop held 22 and flying 26 frames |
| Hands | two-bone IK on the classic cascade loop: release inside, catch outside, scoop down and in; Idle_A body; hips dip 1.8 cm per throw; head tilted up 10° |
| Flight | true parabola per prop, apex 1.65 above the release, one cartoon gravity (0.0195 units/frame², about real at this scale) |
| Path | the prop swings out past the face (arc half-width 1.05; the head is 1.3 wide), crosses above the head at the apex, and comes down outside on the other side |
| Spin | pins turn exactly once about the actor's left-right axis, so the handle lands in the catching hand |
| Hold | handle in the fist at `handslot`, pin pointing forward and a little up, leaning outward at the catch and inward at the throw |
| Stage | KayKit circus podium; actor root on the podium top (1.0) |
| Variants | KayKit juggling pins (red / yellow / blue), clay balls; donuts or sweets use the same tracks |

## Checks

- **GLB:** pose dump → `kfb_pose_dump_to_glb.py` (the tool from item 1).
  - 24 nodes, no meshes, no skins.
  - Round trip vs the authored pose: max 0.0022 cm.
- **Prop tracks:** Blender → glTF conversion checked on the pin tips against the Blender world positions; error 1e-5.
- **Clearance over the loop:** prop to deformed head / hat / body ≥ 0.004; prop to prop ≥ 0.016.
- **Screen space:** see defect 1.
- **Eye guard:** every render runs `kfb_eye_guard.check()`. The Clown carries the KFB eyes.
- **Critic:**
  - first pass: PASS WITH NOTES (the face);
  - after 2 repairs: FAIL only on frames 19–22 per cycle;
  - everything else passes: the arcs, spin and framing are good, and nothing goes through the body.

## Files

| File | What |
|---|---|
| `libs/Rig_Medium/KFB_Motion_clown_juggle_j3.glb` | the clip, skeleton only |
| `data/clown_juggle_j3.prop_tracks.json` | per-frame prop transforms (glTF space, actor root), throw schedule, timing |
| `KFB_Motion_Library.catalog.patch_clown_juggle_j3.json` | clip entry, eye profile, known issues, sha256 |
| `scripts/kfb_clown_juggle.py` | rebuild: `setup(kind)`, `bake_body`, `prop_tracks`, `clearance`, `face_overlap`, `render` |
| `scripts/kfb_eye_guard.py` | never render a resident without KFB eyes; deep clone for residents |
| `previews/CLOWN_JUGGLE_J3_pins.mp4` | front ¾ + side, 3 loops |
| `previews/CLOWN_JUGGLE_J3_clayballs.mp4` | the same motion with clay balls |

## Attribution

- **KayKit** (CC0): Clown, juggling pins, clown ball, circus podium, Rig_Medium `Idle_A`.

## Next gate (one)

Play the clip and the prop tracks on the MVP slice marketplace (Clown on the podium), then tune.
