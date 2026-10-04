# RETURN · EYE-CLEANUP-01 · remove source eyes, set eye-rig anchors · 2026-10-01

From: Coworker / Blender MCP. To: Resident Atlas (Claude Design), Georg. Status: **candidate-only, 4/4 figures delivered, Georg's visual acceptance open**.
Brief: `KFB Resident Atlas S16/NPC_SETTINGS_01/BLENDER_MCP_EYE_CLEANUP_01.md`.

## 1 · Problems and deviations first

1. **Storage location deviates from the brief.**
   - The brief says "next to the original file". The originals of all four figures live on `main`, and Mummy is not on the Atlas branch `georg-doc-patch-3`.
   - Writing into `main/media/…` needs Georg's yes. So the four `*_NoEyes.glb` are in `skills/chat/workflows/EYE_CLEANUP_01_2026-10-01/glb/` (branch `georg-doc-patch-3`) for now.
   - The target path proposal is in `eye-cleanup-01.json` → `out` (next to each original).
2. **Mummy_B is not `texture`, it is `island`.** All four are `island`. No texture was painted over; `uvRect` is `null` everywhere.
3. **Mummy_A keeps the black face slit.**
   - Only the white eye caps were removed. The black band is a face island of its own; per brief, face/mouth/brows stay.
   - The eye rig therefore sits inside a black band. Mummy_A's `skin` is that band (#111618), not the bandage. Georg decides whether the band stays.
4. **Witch wears glasses** (separate mesh `Witch_Glasses`, white glass at 20 % opacity). The eye rig will be seen through the lenses; the glasses are untouched.
5. **three.js renames the anchors:** GLTFLoader sanitises node names, so `eye_anchor.l` → `eye_anchorl` and `eye_anchor.r` → `eye_anchorr`. `userData.name` keeps the original. The Atlas must look them up by the sanitised name (as it already does for `handslot.l`).
6. **Anchor axes:**
   - Local +Z = outward normal, measured in three.js: L (0.367, −0.006, 0.930) for the Mummies, (0.415, 0, 0.910) for Orc Brute, (0.441, 0.005, 0.898) for Witch.
   - +Y = head up. Uniform scale = eye radius.
   - Blender's glTF export maps local Z → glTF Y, so the empties are built pre-rotated in Blender. In Blender itself they therefore point "−Y outward". That is intended.
7. Before/after renders, bind check and structure comparison all ran on the final GLBs.

## 2 · Result per figure

| Figure | Class | Removed | Anchor L pos (three, bind pose) | r | skin (measured) | Idle_A bind | Mirror |
|---|---|---|---|---|---|---|---|
| Mummy_A | island | 2 eye caps, 132 faces (`Mummy_A_Head`) | (0.2023, 1.6052, 0.4170) | 0.0649 | #111618 (black face slit) | 69/69 = original | 0 |
| Mummy_B | island | 2 eye caps, 132 faces (`Mummy_B_Head`) | (0.2023, 1.6052, 0.4170) | 0.0649 | #f6bd99 | 69/69 = original | 0 |
| Orc Brute | island | 2 eye caps, 132 faces (`OrcBrute_Head`) | (0.1650, 3.5063, 0.6275) | 0.0556 | #82c061 | 52/52 = original (Rig_Large) | 0 |
| Witch | island | 2 eye caps, 138 faces (`Witch_Head`) | (0.1918, 1.6119, 0.4410) | 0.0727 / 0.0720 | #f5bb96 | 69/69 = original | 0 |

Applies to all four:
- 23 bones, the same joint order, inverse bind matrices Δ ≤ 1.4e-6 and bind-pose transforms equal (quaternion sign aside).
- Mesh and material names unchanged; only the eye-cap faces are missing.
- Anchors are glTF children of the `head` joint.

## 3 · How

1. **Classification:** the head mesh is split into islands by welded positions. The eye pair = two islands with the same face count, mirrored in X, facing forward, smaller than 0.2. The pair is backed by the island's palette colour and its UV rectangle (`anchorDetail.uvRect`).
2. **Removal:** only those faces deleted (bmesh). Armature and skin are untouched.
3. **Anchor:**
   - Position: ray hit on the cap surface along the cap normal.
   - Normal: area-weighted cap normal.
   - r: ¼ of the sum of the two in-plane extents.
   - Skin: median of the shell the cap sits on, ring 0.6–1.8 r, lower half only (excludes brows and hair). Cross-checked with PIL against the texture.
4. **Bind check:** three.js 0.160, Idle_A from `Rig_Medium_General.glb` / `Rig_Large_General.glb` @ `9248211a`. Every track is bound with `PropertyBinding`, original vs NoEyes.

## 4 · Files

- `eye-cleanup-01.json` (schema `kfb.eye-cleanup/0.1-candidate`)
- `glb/Mummy_A_NoEyes.glb`, `Mummy_B_NoEyes.glb`, `OrcBrute_NoEyes.glb`, `Witch_NoEyes.glb`
- `evidence/<Figure>_before_after.jpg`: frontal + ¾, original above, NoEyes below, no eye rig, anchors hidden
- `evidence/bind_check.json`, `glb_compare.json`
- `source/`: `e1_inspect.py`, `e2_clean.py`, `e3_render.py`, `bind.html` + `bind_run.py`

## 5 · `none` figures

None of the four. Helmet / mask / visor cases have not been part of this batch.

## 6 · Gate

**Georg: PASS / TUNE / REJECT** per figure on the before/after images (especially the Mummy_A black band and Witch's glasses). After PASS: Georg / WSA decide whether the NoEyes files go next to the originals on `main`. Then the Atlas wires `eyes: { rig: 'default', source, anchors: 'eye_anchorl/r' }`.
