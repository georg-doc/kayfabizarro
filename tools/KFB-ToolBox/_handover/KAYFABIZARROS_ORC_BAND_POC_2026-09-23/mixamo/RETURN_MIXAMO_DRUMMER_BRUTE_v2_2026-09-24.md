# RETURN · Mixamo drummer v2 · Orc Brute · 2026-09-24

Für Georg: Deine drei Punkte sind umgesetzt. Die große Trommel steht frei vor ihm, die "Lollipop"-Toms sind weg, und die Keulen sitzen jetzt mittig in der Faust. Die rechte Keule schlägt nicht mehr senkrecht nach oben, sondern trifft vorn-unten auf das Fell. Offen ist die Unterarm-Drehung rechts (bis 101°).

Status: **CANDIDATE v2 · waiting for Georg's review.** Supersedes the v1 kit version (`RETURN_MIXAMO_DRUMMER_BRUTE_2026-09-24.md`).

## Georg's feedback on v1 → what changed

| Feedback | Change |
|---|---|
| Right club strikes upward, with the pommel/fist, which makes no sense | Hands are spread apart, the elbows go out and up, and the forearms are pronated (palm down). The club now points forward-down at the strike. Right: forward 0.7, up 0.2, 0.5 outward, pole out/up; wrist τ −75°, φ −20°, ψ −45°. Left: forward 0.8, up 0.5, 0.4 outward; wrist τ +60°, φ +20°, ψ +45°. |
| Use the big drum, standing properly | `DR_drum_main` is `Orc_Wardrum` at scale 2 (as in v0), on the floor at (0, −2.3). That is the closest position where no body or leg point is inside the drum (margin 0.08). Top at 1.84. |
| Remove the toms/stands | Removed (`DR_tom_B/C`, `DR_stand_B/C`). |
| Club looks glued to the thumb; it must sit in the middle of the fist | **Grip fixed at the source:** the v0/Atlas offset `(0, −0.269, 0)` put the handle 0.2 toward the wrist and 0.13 low, along the thumb side of the fist. New offset in handslot space: right `(0.203, −0.269, 0.128)`, left `(−0.203, −0.269, 0.128)`, i.e. the centre of the distal fist. Plus a constant 20° diagonal hammer grip (head leaning toward the fingertips). Checked in T-pose: `evidence/grip_before_after.jpg`. The club never rotates inside the fist. |

## Method

1. **Transfer:** Mixamo clip on `Rig_Brute` (exact, unchanged).
2. **Search at the strike frames:** hand-path offset (chest space), IK pole offset and a constant wrist offset (τ/φ/ψ), scored on:
   - club head on the drum skin
   - club pointing down and forward, not sideways
   - no forearm below the skin
3. **Floor constraint:** wherever a club or forearm would go into the drum, the hand target is lifted to skin height. Four passes, until nothing is left inside.
4. **Contact snap:** at each strike (a local minimum over the drum after a downswing), the hand tips forward just enough for the club head to touch the skin, blended over ±3 frames.
   - Left: 10 strikes, max 5.7°.
   - Right: 14 strikes, max 13.5°.
   - This is the "wrist only tips slightly at contact" rule.
5. **Bake:** everything is baked to rotation keys; no constraints remain.

## Numbers (`DR_fit4_check.json`, 71 sampled frames)

| Check | Result |
|---|---|
| Club inside the drum | 0 |
| Club in head/body/shoulderpad/leg armour | L 3 · R 0 |
| Forearm inside the drum | 1 frame, 0.04 |
| Clubs crossed | 1 frame |
| Elbow inner angle, min | 76° |
| Wrist-bone twist, max | L 82° · **R 101°** |
| Strike gap after snap | 0.01 on all 24 strikes |

## Open

- **Right twist 101°** is full pronation plus the mocap's own twist, slightly beyond the natural range. Next step: split the twist between `lowerarm.r` and `wrist.r`, so the forearm skin shares the rotation, and cap it at 90°.
- The main-scene file `orb_band_module_v5.blend` was not saved. Working copy: Dropbox `_inbox/_probe_batch1/mixamo_probe_batch1_GA_DR4.blend` (scene `DRM_BRUTE`, action `DR_brute_drums_fit4`).
