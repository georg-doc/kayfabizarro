# KayKit Animation Research Update · 2026-09-24

Status: **CURRENT EXTERNAL RESEARCH · informs Animation Lab / Motion Intake**

## Official current observations
Kay Lousberg's current Character Animations page reports **133 humanoid animations** for **Rig_Medium and Rig_Large**, grouped into General, Movement, Melee Combat, Ranged and Simulation. Movement includes walk/run/jump/crawl/sneak/dodge/crouch; Melee includes 1H/2H/unarmed/dual/blocking; Ranged covers aim/shoot/reload/bows/magic; Simulation includes wave/cheer/sit/lie. FBX and GLTF are supplied.

Source: https://kaylousberg.com/game-assets/character-animations

Current RPG Tools adds **28 tool animations**:
https://kaylousberg.com/game-assets/rpg-tools

The Skeleton pack exposes a useful detailed vocabulary: Idle/Walk/Run variants, backward/strafe, Jump Start/Air/Land, directional dodge, pickup/use/throw/interact, Hit/Death, 1H/2H/dual/unarmed Melee, Block family, Ranged aim/shoot/reload, spellcast, taunt, sit/lie.
https://kaylousberg.com/game-assets/characters-skeletons

Modern Series 4–6 characters are the with-legs style and technically align with the Adventurer system, supporting body-family audition without forcing one master skeleton.

## KFB consequence
Animation Lab becomes a **semantic State / Action studio**, not a flat filename list.

State layer:
`Idle · Walk · Run · source-backed fast-run/Sprint · backward/strafe · Jump Start/Air/Fall/Land · crouch/sneak/crawl`.

"Sprint" maps only to a real admitted clip/rate band; no clip is invented from the label.

Action layer:
`Interact/Pickup/Use/Throw · Melee 1H/2H/dual/unarmed · Block/Hit/Defeat · Ranged Aim/Fire/Reload · Spell · Tool · Emote/Sit/Lie · Performance`.

## Direct FBX intake decision
The first Blender batch proved the pipeline, but Blender is not mandatory for every already-good FBX.

```
FBX upload
→ inspect skeleton/tracks/root
→ compare admitted KFB rig signature
→ preview
→ DIRECT or BLENDER_REQUIRED
```

DIRECT:
raw FBX stays local/private; safe metadata normalization only; export derived runtime GLB Action/library contribution + catalogue/profile seed + provenance; preview on a real compatible actor; send derived files to GitHub Bridge.

BLENDER_REQUIRED:
skeleton mismatch · unsafe root conversion · retarget · time-varying contact/prop repair · curve editing · rig/weights/topology · NLA/bake.

Prepared: `MOTION-INTAKE-DIRECT-01`.
