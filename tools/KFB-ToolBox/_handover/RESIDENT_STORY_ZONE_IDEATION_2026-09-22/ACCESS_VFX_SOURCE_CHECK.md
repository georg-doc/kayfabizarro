# Access Props + VFX · Source Check

**Date:** 2026-09-22  
**Status:** SOURCE / CONTRACT EVIDENCE ONLY · NO RUNTIME / VISUAL ACCEPTANCE CLAIM

## Inspected public source snapshot

- repository: `georg-doc/kayfabizarro`
- inspected `main` head at source-read time: `66d44a1813e199a697016f13ea3e5f0c583c9e30`
- concept branch continues separately; always re-fetch current main before merge/promotion.

## Keys / Access Props

Verified exact source files:

- `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/key.gltf`
- `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/keyring.gltf`
- `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/keyring_hanging.gltf`
- `media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Items/GLTF/Pickup_KeyCard.gltf`

The linked VFX+KEYS+ASSETS handoff reports these 3D candidates as parseable / consumer-kind compatible for its model consumer.

### Gold / silver

No separate source file named as a gold key or silver key was found in the inspected handoff/search.

Therefore:

- **gold key** = user-approved presentation/access-tier direction, exact donor/material proof pending;
- **silver key** = user-approved presentation/access-tier direction, exact donor/material proof pending;
- **keyring** = source geometry proven.

Do not claim distinct KayKit gold/silver key files until a visual/source donor proves them.

## Linked VFX + KEYS + ASSETS handoff

Source:

`tools/KFB-ToolBox/_inbox/KFB Style References/VFX + KEYS + ASSETS - kfb-asset-handoff-animation-lab (9).json`

Inspected facts:

- total candidates: **132**
- `FX_Visual` candidates: **91**
- handoff selection status: **candidate-only**
- handoff consumer: Animation Lab
- Animation Lab allowed kind: `model-3d`
- FX PNG entries are `image-2d` and therefore show `consumerKindAllowed=false` for that specific consumer.

Interpretation:

**this handoff does not prove the PNGs are unsuitable. It proves they should not be routed through Animation Lab's model-only contract.**

## Existing VFX donor

Verified current donor:

`tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/donor-bank/modules/kfb-vfx.js`

Design notes:

`tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/donor-bank/docs/VFX_DESIGN_v10.md`

Source facts from donor:

- pooled quad renderer;
- camera / ground / surface / velocity alignment;
- alpha-mask atlas;
- predrawn flipbooks;
- surface × energy impact recipes;
- decal support;
- host events for shake/hitstop/cue/react;
- host still owns hit decision, physics, camera, audio and target movement.

This is the preferred reuse path before creating any new VFX runtime.

## Requested VFX families with exact source evidence

### Muzzle

- `particles/alpha/muzzle_01_a.png .. muzzle_05_a.png`
- opaque counterparts also present in the selected handoff.
- existing donor already uses muzzle roles.

### Slash / sweep

- `particles/alpha/slash_01_a.png .. slash_04_a.png`
- opaque counterparts also present.

### Impact

- `predrawn/big_hit_6x5.png`
- `predrawn/impact_white_6x4.png`
- scratch/scorch masks.

### Electric / blitz

- `predrawn/electric_ring_6x5.png`
- magic/light/lightstreak candidates in handoff.
- existing donor already defines a semantic `bolt` role using Brackeys masks / procedural fallback.
- no separate selected-handoff asset literally named `lightning bolt` was proven.

### Blood

- `predrawn/blood_impact_6x5.png`

Historical `VFX_DESIGN_v10.md` explicitly excluded this asset with the then-current design statement "kein Blut in KFB".

**Current user direction reopens blood FX as a candidate.**

This is an additive design change, not a rewrite of historical evidence.

### Fire / smoke / world

Source families include:

- fire;
- flame;
- smoke;
- dirt;
- scorch;
- circle;
- magic;
- light;
- charge;
- fire-point / fire-ring;
- dithered-fire;
- explosion flipbook.

## Curated KFB asset pool

Inspected folder:

`media/3D_Assets/KFB/`

At the inspected main snapshot it enumerated **140 entries**.

It includes selected:

- food props;
- books / signs / boards;
- flowers / plants / mushrooms;
- carnival/game props;
- vehicles;
- robots / mechs;
- characters / creatures;
- environment objects;
- miscellaneous textures.

This folder is a future donor shortlist, not a second registry or blanket compatibility/approval claim.

## Result

**SOURCE ALIGNMENT PASS for concept persistence**

Meaning:

- exact key/keyring/keycard sources exist;
- exact gold/silver variants remain unproven;
- exact requested FX source families exist;
- a reusable KFB VFX donor already exists;
- the user's curated KFB folder is a real source pool.

Not tested / not claimed:

- access runtime;
- gold/silver visual implementation;
- key carry/use animations;
- VFX browser rendering in the current Combat/World hosts;
- blood visual approval;
- muzzle socket integration;
- melee slash synchronization;
- world FX persistence;
- public Stage.
