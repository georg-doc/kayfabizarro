# #369 Addendum · Ground handover + loot reveal (Large → Medium)

- **Status:** PASS WITH TUNE. Georg accepted it on 2026-10-07. The tune items below are deferred. Everything stays modular so it can be changed later.
- **Executor:** Blender MCP on Georg's Mac Mini (Blender 5.2.2 LTS).
- **Branch:** `blender/resident-performance-choreography-2026-10-07`. This is additive to the #369 RETURN; nothing existing was changed.
- **Resolves:** U3 (cross-rig exchange) with a ground handover instead of a stall or a new kneel clip.

## Boundaries

- no Open World / WB2 / PR #348 write;
- no merge, no Live promotion;
- no raw Mixamo FBX on GitHub;
- no itch.io clay textures on GitHub;
- the `.blend` working copies stay in Dropbox, because they embed the clay textures.

## What the encounter does

Scene `369_GROUND_HANDOVER`, residents Orc Brute (Rig_Large) and Farmer B (Rig_Medium).

1. **Carry and set down.**
   - The Orc carries the round clay present with both palms on its sides. The grip is IK on `handslot.*` with chain 5 and targets parented to the Orc.
   - He bends down and sets the present on the ground (`L|MLBWn|interaction|kfb_interaction_opening_a_lid_a`, then the same clip reversed).
2. **Wrist fix (MLBWn).**
   - The Motion Library clips rotate `wrist.*`; KayKit rigs use `hand.*`.
   - Baked actions set the wrist to identity and give the hand the KayKit Idle_A hand pose. This removes the outward-bent wrists.
3. **Walk in.**
   - The Farmer walks in with KayKit `Walking_A`.
   - The root is keyed per frame from the planted foot (stance lock, Gaussian sigma 1.5).
   - Travel is 0.70 m. Slip is ≤ 2.2 cm in any single frame, mean 5 mm per frame. Before the fix the root was forced 1.2 m while the stride only supports 0.7 m.
4. **Lid push.** The Farmer pushes the lid away with the cartoon push from `M|MLB|interaction|kfb_interaction_opening_a_lid_a`, using action frames 56–90.
5. **Spit.** The box squashes and then stretches at f249. All deformation is on the box; the item keeps its proportions.
6. **Step back.**
   - Both residents hop back with native KayKit clips: `M|KK|MovementAdvanced|Dodge_Backward` (scale 1.6) and `L|KK|MovementAdvanced|Dodge_Backwards` (scale 2.2).
   - Recovery blends to Idle_A with an eased animated influence (16 f / 18 f). The root is locked to both feet during the blend.
   - End positions: Farmer x 0.587, Orc x −3.127. The box is at x −0.85.
7. **Loot materialises straight above the box** (`scripts/kfb369_reveal_r8.py`):
   - 247–256: clay blobs shoot up out of the box mouth and stick to the item.
   - 249–270: the item group launches straight up with a uniform scale of 0.2 → 1, overshoots and settles at z 1.55 above the box.
   - 250–257: a **clay twin** builds bottom-up. The twin is the item's own mesh, inflated 12 mm, in clay `#f2b632`.
   - 259–267: the twin dissolves top-down with a glowing edge (UFO-lab threshold `(1−h)·0.6 + (1−r)·0.12 + noise·0.28`), revealing the real item. Clay crumbs pop off along the normals.
   - 262–272: the item's own glow shell fades in (inverted hull). Light comes only from the box.
   - From the launch onward the item floats in zero-G:
     - the launch spin decays to one turn per 200 f;
     - it tilts on two axes (0.28 rad over 97 f, 0.22 rad over 131 f);
     - it bobs (0.055 m over 74 f) and drifts.
8. **Reactions.** The Farmer plays KayKit `Cheering` from f278. The Orc plays `L|MLBWn|idle|kfb_idle_happy_a` from f284.

### Loot items

- **KFB card:**
  - landscape, front = *False Friend* (TRUST & BETRAYAL web PDF), back = ink-band card back;
  - about 1.08 × 0.69 m;
  - it shows the back first and the front as it turns.
- **Tiny Treats radio** (`media/3D_Assets/Tiny_Treats_Pleasant_Picnic_1.0_FREE`): max dimension 1.0 m, slightly larger than the box (0.85 m wide).

### Gift colourways

- Palettes come from the three Joyride track worlds, A_canyon / B_bikini / C_otown (`scripts/kfb369_gift.py`). Each gift uses two flat colours (body / ribbon).
- The shown gift uses A1: body `#ef5a22`, ribbon `#f2b632`.
- Gift size per rig class: Medium ×0.9, Large ×1.7. Legacy is open.

## Measurements (r8)

| Check | Result |
|---|---|
| Foot flip at clip blends (quaternion sign) | fixed: keys aligned to the Idle_A hemisphere, 0 foot/toe jumps > 25° on the Orc |
| Farmer walk slip | max 0.022 m/f, mean 0.005 m/f |
| Item centre vs box centre | 0.03 m in x, 0.02 m in y |
| Minimum clearance item ↔ resident (f256–400) | card–Farmer 0.318 m, card–Orc 0.954 m, radio–Farmer 0.315 m, radio–Orc 0.983 m |
| Params override test | ZP 1.9 / radio 0.8 / spin 120 f applied, then reverted to identical defaults |

## Modular: how to retune

- `data/loot_reveal_params.json` overrides every constant of `kfb369_reveal_r8.py`: position, height, radio size, launch, build / dissolve / glow windows, clay colour, spin, tilt, bob, drift, blob and crumb counts.
  - Edit the JSON and re-run the script.
  - The script is idempotent: it removes `GH_CT_*` and rebuilds.
- `data/ground_handover_r8_timeline_recipe.json` holds the full NLA layout of both residents, the object keys (root lock, IK, gift, lid, box light, stars), the constraints and the cameras. Use it to rebuild or port the choreography.
- `data/followup_shrug_georg_and_ground_handover.json` holds the evidence log for r1–r8 and the tune backlog.

## Tune backlog (deferred, Georg 2026-10-07)

| ID | Item |
|---|---|
| T1 | The step-back looks foot-glued. The residents should look pushed or knocked back by the spit, not slide with planted feet. |
| T2 | The Farmer should push the lid sideways, not towards / into the Orc. |
| T3 | The Orc's "here you go" invite is still the give_fit release and reads as a punch. It should be an open, inviting hand gesture. |
| T4 | Shrug look decision: Georg's Mixamo trim clip vs `kfb_perf_shrug_a`. |
| T5 | Optional: real fracture / reassembly of the prop mesh in clay. The clay twin is the stand-in. |

## Files in this addendum

- `scripts/kfb369_reveal_r8.py`: clay-twin materialise + zero-G float.
- `scripts/kfb369_gift.py`: palettes, per-rig gift size, recolour.
- `scripts/kfb369_lib.py` (r14): job helpers: import, retarget bake, render, measure.
- `data/loot_reveal_params.json`
- `data/ground_handover_r8_timeline_recipe.json`
- `data/followup_shrug_georg_and_ground_handover.json`
- `../PREVIEWS/R8_*.jpg`: contact sheets with frame numbers, from three cameras.

The rebuild needs the Dropbox job folder `BLENDER MCP/RESIDENT_PERFORMANCE_369_2026-10-07/` (blend copy `blend/KFB369_gift_reveal_r6_claytwin_zeroG.blend`). `MOTION_LIB/ml_bake.py` is used for retargeting.
