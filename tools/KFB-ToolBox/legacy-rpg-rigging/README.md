# KFB ToolBox · Legacy RPG Rigging Lab

Status: **CANDIDATE / HUMAN REVIEW REQUIRED**  
Owner: **KFB ToolBox / Rigging**  
Source pack: `media/3D_Assets/KayKit Legacy/KayKit Dungeon Pack 1.0 2/`  
Fixed Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-rpg-rigging/`

## Purpose

One browser workbench for the legacy KayKit Dungeon 1.0 character system:

- four static modular character sources: Barbarian, Knight, Mage, Rogue;
- 17 source head choices (4 defaults, 12 alternate heads, skull);
- embedded head gear / hair / helmet nodes;
- body/clothing material inventories from the four class bodies;
- all 24 tiered weapons plus Arrow, Quivers and Spell Book;
- assembly onto the existing 6-bone `Rig_Legacy` donor;
- all 30 real embedded Legacy animations;
- reversible held-prop mounting using the Resident Atlas rigid-arm paw-anchor mechanism;
- LegacyFaceHost → existing EyeRig v6 batch candidates for every head.

## Retained owners / donors

This tool does **not** create another animation or EyeRig runtime.

- Legacy assembly donor: `tools/resident_atlas_s6/lib/atlas.js` / later S38 two-pin repair.
- Legacy motion donor: `KayKit_AnimatedCharacter_v1.2.glb` — 6 joints, 30 clips.
- Eye owner: existing `pet-eye-rig.v6.js`.
- Medium/Large motion remains owned by KayKit Motion Lab; this tool owns only Legacy authoring/calibration.
- Gameplay/combat consumers still own movement, hit timing, damage, ammo and physics.

## Source truth

The four Dungeon character GLTFs are static modular sources: 0 skins, 0 embedded animations. Body, Head, ArmLeft and ArmRight are separate rigid nodes; Hat/Hair/Helmet are additional nodes. Clothing is primarily authored into the Body mesh/material layout rather than separate detachable files, so this tool lists body/clothing materials honestly instead of inventing clothing assets.

The Legacy animation donor has exactly six joints:

`Body · Head · armLeft · handSlotLeft · armRight · handSlotRight`

and 30 embedded clips including melee, ranged, locomotion and interaction actions.

## Authoring workflow

`Source isolate → choose body/head → assemble on Rig_Legacy → choose weapons → audition native clips → measure LegacyFaceHost → preview EyeRig v6 → approve/adjust/reject head profile`

Source isolate is deliberately first. A loaded URL is not accepted as donor proof until the actual selected source object is shown alone.

## Prop-rig bridge

The simple six-bone motion vocabulary is a useful later donor for Pencil, CapsuleCarl, Eraser and other KFB prop-rigs. This candidate records that bridge as a proposal only; no prop is declared compatible until its own rig/motion proof exists.
