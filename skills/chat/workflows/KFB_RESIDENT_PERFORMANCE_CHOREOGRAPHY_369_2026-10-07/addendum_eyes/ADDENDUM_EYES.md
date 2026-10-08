# #369 Addendum 7 · KFB EyeRig v6 eyes on all residents in the 369 scenes

- **Status:** FIRST PASS (2026-10-08). Waiting for Georg's look check.
- **Writes:** additive to branch `blender/resident-performance-choreography-2026-10-07`.
- **Boundaries:** no merge, no textures, no raw FBX; `.blend` stays in Dropbox. Motion is unchanged.

## What was done

Every resident armature in the 369 file now shows the KFB eyes instead of the KayKit painted eye caps.

| Step | How |
|---|---|
| Remove old eyes | Per head mesh, the nearest dark eye-cap island to each measured anchor is deleted, plus the 2-face island that belongs to it on Farmer B and Goth Girl. Removed per eye: 66 faces (Farmer A, Lorekeeper, Orc Brute) or 67 + 2 = 69 (Farmer B, Goth Girl). These counts equal EYE-CLEANUP-01/02. Brows, freckles, beard, glasses and war paint are untouched. |
| Build eyes | Port of `pet-eye-rig.v6.js` as Blender meshes: sclera sphere `#f3ede2` (roughness 0.42, coat 1); matte-cute pupil cap at R·1.004, half-angle 0.43 rad, `#070707`; upper and lower lid caps (0..0.56π, 0.44π..π) at R·1.011 in the measured skin colour. No lashes (the anchored mount uses none). |
| Mount | `anchored-eyes.v1.js` rule: eye centre = anchor − n·r·0.24, eye +Z = anchor normal, +Y = head up, scale = r. Anchors and skin from `eye-cleanup-01.json` / `eye-cleanup-02.json` (glTF → Blender: (x, −z, y)). |
| Follow the head | Each eye is bone-parented to `head` with a rest-pose parent inverse, so it moves exactly like the skinned head. |
| Blink | Lid rest u 0.12 / l 0.06. Blinks keyed like `EyeRig.update`: both eyes together, every 2.5–6.5 s, 0.12 s long, seeded per armature. |

**Coverage:** 31 armatures, 62 eyes, all scenes: TALK, DEBATE, BRICKFISH, DANCE, FLUFF_TRADE, GIFT_LINEUP, GROUND_HANDOVER(_APPEAR), ISOLATION, SHRUG_COMPARE. Clones that share a head mesh (DB/TK/BF/DN) share the cleaned mesh.

| Resident | Skin / lid | r (m) | Faces removed per eye |
|---|---|---|---|
| Farmer B | `#f6bf9b` | 0.0727 / 0.0720 | 67 + 2 |
| Goth Girl | `#f8d3be` | 0.0727 / 0.0720 | 67 + 2 |
| Farmer A | `#f6c19d` | 0.0649 | 66 |
| Lorekeeper | `#f5bc97` | 0.0649 | 66 |
| Orc Brute | `#82c061` | 0.0556 | 66 |

## Proof

`renders/eyes_proof/EYES_PROOF_01_sheet.png` (Dropbox): the five residents in the dance scene at frame 12, front and ¾.

## Open

| ID | Item |
|---|---|
| E1 | Pupils look along the anchor normal (converge 0, as in the three.js mount), so they point about 24° outward. A small converge would make the gaze read more "at you". Georg's call. |
| E2 | No gaze animation yet (EyeRig idle wander / look-at). The look-at targets from the talk engine could drive the pupils. |
| E3 | Preview videos were rendered before the eyes; they need a re-render to show them. |
| E4 | Global ground clearance for hands and heads (Georg: later). |

## Files

- `scripts/kfb_eyes.py` (this folder): `run()` strips the caps, mounts the eyes and keys blinks; idempotent.
- Blend copy (Dropbox): `blend/KFB369_eyes_kfb_rig_01.blend`.
