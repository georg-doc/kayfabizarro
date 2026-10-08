# #369 Addendum 7 · KFB EyeRig v6 eyes on all residents in the 369 scenes

- **Status:** v2 (2026-10-08): eyes now follow Georg's tuned batch profiles. Waiting for his look check.

## v2 · Georg's tuned profiles (replaces the v1 look)

**Georg on v1:** not his tuned versions, and every resident squinted strongly outward.

**Cause:** v1 used the generic anchored mount (`anchored-eyes.v1.js`): every eyeball turned onto the cap normal (about 24° out), with pupil size 0.5 and converge 0. Georg tuned his values on the Atlas **batch path** instead, where the eyes face head-forward.

**v2 ports that path 1:1** (`batch-eyes.v1.js` → `facehost.v1.js` → `pet-eye-rig.v6.js build()` → `eyeoval.v1.js`):

- **Face host:** box of every vertex whose strongest bone is `head` (hat and hair included), in bind pose. Yaw from toes − foot (0° on all five). U = half the box height.
- **Eye centre:** (±U·dx, U·dy) on the host ellipsoid surface, then back by R·(0.24 + inset·1.15). R = U·ring. No splay, so the eyes face head-forward.
- **Pupils:** size 0.34. Rest gaze turned inward by converge 0.18 (−sx·0.18·0.5 rad ≈ 5.2°). Seated in front of the oval with `pupilSeatDelta`.
- **Oval:** w/h/d on sclera and lids. The pupil stays unscaled.
- **Lid colour:** profile `baseColor` × 0.72, then HSL (0, +0.05, −0.02), as `EyeRig._lidColor`.

| Resident | Source file | State | dx | dy | ring | inset | oval w/h/d | base | R (m) |
|---|---|---|---|---|---|---|---|---|---|
| Orc Brute | `rig-large-reviewed.v1.json` | ADJUSTED_APPROVED | 0.295 | −0.26 | 0.175 | 0.9 | 1 / 0.9 / 0.91 | measured `#82c061` (profile null) | 0.099 |
| Farmer A | `eye-rig-medium.batch-1.json` | ADJUSTED | 0.3153 | −0.2464 | 0.165 | 1.89 | 1 / 1 / 1 | `#fbe2ce` | 0.107 |
| Farmer B | same | ADJUSTED | 0.3220 | −0.1231 | 0.1133 | 3.48 | 1 / 1 / 1 | `#fbe2ce` | 0.072 |
| Lorekeeper | same | ADJUSTED | 0.3462 | 0.105 | 0.125 | 1.13 | 1 / 1 / 0.76 | `#fbdfcb` | 0.074 |
| Goth Girl | same | **UNREVIEWED**: Medium authoring default (Georg 2026-09-19) | 0.295 | 0.045 | 0.153 | 0.4 | 1 / 1 / 1 | `#e6cbc3` | 0.099 |

**Unchanged from v1:** eye-cap removal, bone parenting, and blinks.

**Not ported:** life wander/tremor and gaze kinetics. These are runtime motion; Blender holds the rest gaze.

**Proof:** `previews/EYES_PROOF_02_sheet.png` (v1 for comparison: `previews/EYES_PROOF_01_sheet.png`).

**SSOT note:** `HANDOVER_EYE_RIG_SSOT.md` (Georg 2026-10-08): eye configs must become one SSOT per character. The Goth Girl here is not Georg's config.

**Blend copy:** `blend/KFB369_eyes_kfb_rig_02_profiles.blend`.

---

## v1 (superseded look, kept for the record)

- **Status (v1):** FIRST PASS. Georg rejected the look on 2026-10-08.
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

`previews/EYES_PROOF_01_sheet.png`: the five residents in the dance scene at frame 12, front and ¾.

## Open

| ID | Item |
|---|---|
| E1 | v1 only: pupils followed the cap normal, about 24° outward. Fixed in v2. |
| E5 | Goth Girl uses the Medium default. Georg configured her differently; the candidate is the Pet Studio contract (see `HANDOVER_EYE_RIG_SSOT.md` §2). |
| E6 | The eye configs are scattered over 6 places. They need one SSOT per character (`HANDOVER_EYE_RIG_SSOT.md`). |
| E2 | No gaze animation yet (EyeRig idle wander / look-at). The look-at targets from the talk engine could drive the pupils. |
| E3 | Preview videos were rendered before the eyes; they need a re-render to show them. |
| E4 | Global ground clearance for hands and heads (Georg: later). |

## Files

- `scripts/kfb_eyes.py` (this folder): `run()` strips the caps, mounts the eyes and keys blinks; idempotent.
- Blend copy (Dropbox): `blend/KFB369_eyes_kfb_rig_01.blend`.
