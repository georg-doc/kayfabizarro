# Rig_Medium Actor Browser · Evidence · 2026-09-19

Status: **IMPLEMENTED CANDIDATE · STATIC CONTRACT PASS · PUBLIC BROWSER PROOF PENDING**  
Owner: KFB ToolBox / Rigging  
Source branch: `toolbox/eye-rig-batch-2026-09-18`

## Outcome

The EyeRig Batch workbench is no longer a one-actor GothGirl proof.

It now has a real `Rig_Medium` actor catalog, dynamic model switching, per-character EyeProfiles, review states and **Next unreviewed**.

The catalog contains **27** verified Medium-class paths assembled from existing KFB evidence rather than a new hand-authored asset namespace.

## Source evidence reused

- `tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/kfb-asset-handoff-animation-lab (2).json`
- `tools/resident_atlas_s6/data/cast.js`
- `registry/resources/v1/resources.jsonl`
- `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-biped.v1.js`

The catalog was created while recovered `main` was `29c7500b39d20945f4f8e73fb02fef91a055b02c`. Each actor entry records that revision for its model path.

## Actors

1. **GothGirl** — `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb` — resident-atlas+animation-handoff — cleanup `verified-components`
2. **Clown** — `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/characters/Clown.glb` — resident-atlas+animation-handoff — cleanup `auto-mirrored-front-pair`
3. **Toy Soldier** — `media/3D_Assets/KayKit_Mystery_Series6/6 - December 2025 - Toy Soldier/ToySoldier.glb` — resident-atlas+animation-handoff — cleanup `auto-mirrored-front-pair`
4. **Farmer A** — `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/Farmer_A.glb` — resident-atlas — cleanup `auto-mirrored-front-pair`
5. **Farmer B** — `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/Farmer_B.glb` — resident-atlas-signature-actor — cleanup `auto-mirrored-front-pair`
6. **Caveman** — `media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/characters/Caveman.glb` — resident-atlas — cleanup `auto-mirrored-front-pair`
7. **Lorekeeper** — `media/3D_Assets/KayKit_Mystery_Series6/1 - July 2025 - Lorekeeper/Lorekeeper.glb` — resident-atlas — cleanup `auto-mirrored-front-pair`
8. **Witch** — `media/3D_Assets/KayKit_Mystery_Series6/5 - November 2024 - Witch/characters/Witch.glb` — resident-atlas — cleanup `auto-mirrored-front-pair`
9. **Avian Swordsman** — `media/3D_Assets/KayKit_Mystery_Series6/9 - March 2026 - Avian Swordsman/AvianSwordsman.glb` — resident-atlas — cleanup `auto-mirrored-front-pair`
10. **Skeleton Warrior** — `media/3D_Assets/KayKit_Skeletons/characters/gltf/Skeleton_Warrior.glb` — resident-atlas — cleanup `auto-mirrored-front-pair`
11. **Skeleton Rogue** — `media/3D_Assets/KayKit_Skeletons/characters/gltf/Skeleton_Rogue.glb` — resident-atlas — cleanup `auto-mirrored-front-pair`
12. **Skeleton Mage** — `media/3D_Assets/KayKit_Skeletons/characters/gltf/Skeleton_Mage.glb` — resident-atlas — cleanup `auto-mirrored-front-pair`
13. **Skeleton Minion** — `media/3D_Assets/KayKit_Skeletons/Skeleton_Minion.glb` — animation-handoff — cleanup `auto-mirrored-front-pair`
14. **Ultra Turbo Hero Man** — `media/3D_Assets/KayKit_Mystery_Series6/UltraTurboHeroMan/characters/UltraTurboHeroMan.glb` — resident-atlas — cleanup `auto-mirrored-front-pair`
15. **Cleric** — `media/3D_Assets/KayKit_Mystery_Series6/3 - September 2025 - Cleric/Cleric.glb` — resident-atlas — cleanup `auto-mirrored-front-pair`
16. **Animatronic Creepy** — `media/3D_Assets/KayKit_Mystery_Series6/5 - November 2023 - Animatronic/characters/gltf/Animatronic_Creepy.glb` — resident-atlas — cleanup `auto-mirrored-front-pair`
17. **Animatronic Normal** — `media/3D_Assets/KayKit_Mystery_Series6/5 - November 2023 - Animatronic/characters/gltf/Animatronic_Normal.glb` — resident-atlas-signature-actor — cleanup `auto-mirrored-front-pair`
18. **Action Figure** — `media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb` — resident-atlas — cleanup `auto-mirrored-front-pair`
19. **Magical Girl** — `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2026 - Magical Girl/MagicalGirl.glb` — animation-handoff — cleanup `auto-mirrored-front-pair`
20. **Monster Costume** — `media/3D_Assets/KayKit_Mystery_Series6/3 - September 2023 - Monster Costume/character/gltf/Monster.glb` — animation-handoff — cleanup `auto-mirrored-front-pair`
21. **Ninja** — `media/3D_Assets/KayKit_Mystery_Series6/8 - February 2024 - Ninja/character/Ninja.glb` — animation-handoff — cleanup `auto-mirrored-front-pair`
22. **Protagonist A** — `media/3D_Assets/KayKit_Mystery_Series6/10 - April 2025 - Protagonists/characters/Protagonist_A.glb` — animation-handoff — cleanup `auto-mirrored-front-pair`
23. **Protagonist B** — `media/3D_Assets/KayKit_Mystery_Series6/10 - April 2025 - Protagonists/characters/Protagonist_B.glb` — animation-handoff — cleanup `auto-mirrored-front-pair`
24. **Vampire** — `media/3D_Assets/KayKit_Mystery_Series6/4 - October 2024 - Vampire/characters/Vampire.glb` — animation-handoff — cleanup `auto-mirrored-front-pair`
25. **Werewolf Wolf** — `media/3D_Assets/KayKit_Mystery_Series6/4 - October 2023 - Werewolf/characters/gltf/Werewolf_Wolf.glb` — animation-handoff — cleanup `auto-mirrored-front-pair`
26. **Driver** — `media/3D_Assets/KayKit_Mystery_Series6/2 - August 2023 - Driver/character/gltf/Driver.glb` — frankensteining-donor+resource-registry — cleanup `auto-mirrored-front-pair`
27. **Mannequin Medium** — `media/3D_Assets/KayKit_Character_Animations_1.1/Mannequin Character/characters/Mannequin_Medium.glb` — frankensteining-donor+asset-registry — cleanup `auto-mirrored-front-pair`

## Review workflow

Per actor:

`load actor → apply Rig_Medium authoring default / saved override → fail-closed source-eye cleanup → inspect → adjust if needed → Approve / Adjusted + approve / Unsupported → Next unreviewed`

Review state is persisted per actor.

Filters:

- All
- Unreviewed
- Adjusted
- Unsupported

Batch export includes selected actor profiles plus the current class default.

## Source-eye cleanup boundary

### GothGirl

GothGirl retains the exact verified source rule:

`components 2 + 3`

No generic detector replaces that proof.

### Other Medium actors

The browser reuses the existing `frizzlegraft-v1/donoreyes.v1.js` detector.

Generic automatic cleanup is deliberately fail-closed:

1. only indexed **skinned** meshes named Head / Face / Skull are candidates;
2. the donor detector must identify a mirrored equal-triangle pair;
3. the front-most valid pair wins;
4. only then may `stripDonorEyes()` hide source geometry;
5. no candidate or strip failure = **manual / unsupported** and no geometry is removed.

This is an authoring accelerator, not a claim that all 27 actors already have visually approved cleanup.

## Animation owner

The browser loads the shared `Rig_Medium` General + MovementBasic clip packs once and creates exactly one `THREE.AnimationMixer` for the currently active actor.

Switching actors disposes the previous actor EyeRig / FaceHost / cleanup / mixer ownership before the replacement actor is mounted.

## Current tests

Candidate contract replay after the actor-browser implementation:

- **62 / 62 PASS**
- dynamic actor catalog: PASS
- 27 unique Medium entries: PASS
- all entries declare `Rig_Medium` / 23 joints: PASS
- generic cleanup donor reuse: PASS
- generic cleanup fail-closed guards: PASS
- GothGirl exact cleanup preserved: PASS
- one mixer constructor: PASS
- per-actor profile store: PASS
- review-state model: PASS
- roster filters + Next unreviewed: PASS
- no GLB/GLTF writer: PASS
- no global EyeProfile schema promotion: PASS

## Human gate

Publish this candidate to the fixed Stage and verify real model switching in a browser.

The most productive human pass is now simply:

`open actor → glance at face → approve / adjust / unsupported → Next unreviewed`.

Do not start Large/Legacy until the Medium browser itself is proven and the first Medium review wave has useful results.
