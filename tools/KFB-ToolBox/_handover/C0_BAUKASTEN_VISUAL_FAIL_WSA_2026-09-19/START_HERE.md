# WSA START · C0 Baukasten visual review FAIL

**Date:** 2026-09-19  
**Status:** `HANDOFF · GEORG REVIEW FAIL · HOLD`  
**Integration lead:** **WSA unchanged**

## READ FIRST

Canonical postmortem:

`skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/C0_CATALOG_2026-09-19/POSTMORTEM_VISUAL_REVIEW_FAIL_2026-09-19.md`

C0 PR:

https://github.com/georg-doc/kayfabizarro/pull/101

Failed review Stage retained as evidence:

https://kayfabizarro.pages.dev/kfb-hub/stage/minigames/baukasten-c0/

## WHAT FAILED

1. C0 is not a usable visual acceptance surface; raw measurements dominate the page.
2. Relative scale comparison is invalid because every preview is auto-framed independently.
3. The Clown vignette is framed as a whole scene, so it visually shrinks the actor relative to isolated character/prop previews.
4. `juggle-cascade-v1` is not accepted: human review reports static/unconvincing arms and clubs crossing the body.
5. The Resident handoff had already left arm/catch/club-clearance visual QA open; C0 failed to preserve that status.
6. C0 created a new UI language instead of reusing Resident Atlas / World Atlas / Plant Prop Lab presentation donors.
7. Technical PASS and public Stage PASS were allowed to read like visual acceptance. They are not.

## DO NOT DO

- do not merge PR #101 as an accepted C0 basis;
- do not start H01/D01 from the rejected C0 visual premise;
- do not create another Resident runtime or animation owner;
- do not solve scale by arbitrary scene multipliers before a shared-world comparison exists;
- do not patch the C0 dashboard into yet another KFB UI variant.

## KEEP

- Registry/source wiring;
- source pins and Tiny Treats classification;
- no-copy asset policy;
- technical regression QA;
- existing Resident module seam;
- existing Graft seam.

## PRESENTATION DONORS TO REUSE

- `tools/resident_atlas_s6/KFB_Resident_Atlas_S6.html`
- `tools/world_atlas/`
- Plant Prop Lab v2 reviewed candidate:
  `tools/KFB-ToolBox/_inbox/KFB_Plant_Prop_Lab_v1/KFB_Plant_Prop_Lab_v2_EXPORT_2026-09-19/KFB_Plant_Prop_Lab_v2/`

Plant Prop Lab is also present in Dropbox as historical/export provenance, but GitHub is the implementation source of truth.

## NEXT BOUNDED PROOF

Preferred order recorded in the postmortem:

1. Resident Clown activity repair in Resident Atlas owner lane.
2. One shared-scale stage with actor + props + complete vignette.
3. Only then rebuild the C0 visual presentation using an existing Atlas/Lab shell.

## ONE HUMAN GATE

**Should WSA take only the Resident-Clown activity repair as the next bounded slice before any C0.1 scale/UI work continues?**
