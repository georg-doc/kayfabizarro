# RETURN · EYE-CLEANUP-02 · all remaining Residents in one batch · 2026-10-02

From: Coworker / Blender MCP. To: Resident Atlas (Claude Design), Georg. Status: **candidate-only**.
**Result: 26 done · 5 none · 0 blocked** (30 files from the brief + the action figure's swap head as its own entry = 31 entries).

Acceptance: `eye-cleanup-02_contact.png`, one row per figure: original frontal / ¾, then NoEyes frontal / ¾, no eye rig.
Data: `eye-cleanup-02.json` (schema `kfb.eye-cleanup/0.1-candidate`).
GLBs: `glb/<file>_NoEyes.glb`, in the same folder as charge 01.

## Problems and deviations first

1. **Skeletons (warrior, rogue, mage) and Prototype Pete were done, not `none`.** The brief guessed "none" for all four, but they have visible eyes:
   - The skeletons' glowing eyes are their own mesh, `Skeleton_*_Eyes` (material `Glow`). Removing them empties that mesh, so it and `Glow` are missing from the NoEyes files. That is the only difference in the mesh/material list. The sockets stay open and dark.
   - Pete's eyes are two raised bumps in body colour.
   - If you want the originals for these four: mark them `none` in the Atlas and ignore the files.
2. **Action figure = `texture`.** The eyes are painted in the face atlas `actionfigure_faces.png`. In a copy I filled only the open eyes of head A and head B with the surrounding skin (row median).
   - Brows, nose, mouth and the bottom half of the atlas (closed eyes / laughing) are untouched.
   - Up close a very faint outline of the old oval remains.
   - The image name stays `actionfigure_faces`.
3. **Creepy is asymmetric on purpose.** The left eye dangles about 10 cm lower and 7 cm further forward than the right.
   - Both eyes are removed; the anchors sit where the old eyes were, not mirrored.
   - The cap normal of the dangling eye pointed backwards, so the left anchor takes the mirrored normal of the right eye.
4. **Legacy orcs (orcA, orcB):** no skin and no armature in the file, so the anchors hang on the head node `character_orcXHead`, and there is no bind check.
   - There is no separate `_eyes` node in this file version; the eyes are islands in the head mesh.
   - Source found at `10a7fdce`, not at `891eadf`.
5. **Skin colour, special cases:**
   - **orcA:** the left eye sits in the red war-paint stripe, so `skin` is the green from the right side.
   - **Hoarder:** the blue face mask sits right under the eyes, so `skin` is the skin behind the eye (#f6c19d).
   - **Clown:** `skin` is the white face paint.
   - **Plant:** `skin` is the black face, like Mummy_A.
   - **Monster:** left and right differ (stitched patch).
   - Per-eye values are in `anchorDetail`.
6. **Avian:** bird eyes sit on the side of the head, so the anchor normals point strongly sideways (as built, not forced).
7. **Glasses stay** on Lorekeeper and Protagonist_A; the eye rig will be seen through the lenses.
8. **Commit pins:** I did not read `data/cast.js`. Sources are taken from `891eadf` (default from the brief), orcs and Pete from `10a7fdce`. The exact commit is in `source` in each entry.
9. **Renders:** Pete is framed too tightly (top of the head is cut off).

## done (26)

| Figures | Class |
|---|---|
| gothgirl, clown, soldier, farmer_a, farmer_b, caveman, lorekeeper, avian, demon, monster, cleric, creepy, normal, hoarder, plant, hiker, prot_a, prot_b | island (eye caps in the head mesh) |
| warrior, rogue, mage | island (separate eyes mesh) |
| orcA, orcB | island (legacy, no skin) |
| pete | island (legacy rig, 6 bones) |
| figure, figure_headB | texture |

Checked for all done files:
- Bone count, joint order and bind pose are the same as the original.
- Mesh and material names are the same (exception: the skeletons, item 1).
- The anchors are children of `head` (or of `Head` / the head node for the legacy files, and of the root node for head B).
- Bind check in three.js (track counts the same as the original):
  - Rig_Medium Idle_A 69/69 (20 figures);
  - Rig_Large Idle_A 52/52 (demon, monster);
  - Pete: its own Idle 16/16;
  - orcA, orcB and figure_headB: n/a, no skin.

## none (5)

knight (visor), hero (visor), marksman (eyes fully hidden by night-vision goggles and face net), gtn and gtn_forgotten (robot lens). No file for these.

## blocked (0)

None.

## Files

- `eye-cleanup-02.json`
- `eye-cleanup-02_contact.png`
- `glb/` (26 × `*_NoEyes.glb`)
- `evidence/` (bind_check.json, glb_compare.json, inspect_candidates.json)
- `source/` (scripts)
