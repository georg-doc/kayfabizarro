# Production Packet · ToolBox Source-Safe Integration 01

Status: **CLOSED_WITH_HUMAN_GATE**
Executor: **CLAUDE COWORKER preferred**
Owner: `georg-doc/kayfabizarro/tools/KFB-ToolBox/`
Date: 2026-09-23

## Für Georg

Das ist das erste echte Produktionspaket nach dem neuen Flow.

Coworker soll daraus **eine zusammenhängende funktionale ToolBox-Version** bauen, nicht wieder einzelne Mini-Labs.

Sie soll:
- die gute Stage-First-Oberfläche wirklich verwenden;
- den richtigen aktuellen FrizzleBob laden;
- den echten Studio-Figurenbestand verwenden;
- deine später gespeicherten Cube-Pets nicht durch den alten 1.2.7-Stand ersetzen;
- drei echte Resident-Sets als komplette Szenen übernehmen;
- den von dir bereits akzeptierten gemeinsamen 3D-Editor verwenden;
- Verschieben/Drehen/Scale/Absetzen + Save/Reload sauber behalten.

Danach bekommst du **eine** klickbare Review-HTML.

## 0 · Closed check

Against:
`../CLOSED_PACKET_CRITERIA.md`

Result:
**CLOSED_WITH_HUMAN_GATE**

Why:
- all required source identities are pinned;
- required measurements/poses live in pinned Resident/ToolBox source;
- owners are named;
- no required implementation fact must be guessed;
- only final visible/usefulness judgement remains for Georg.

## 1 · One coherent outcome

Build:

**TOOLBOX_SOURCE_SAFE_INTEGRATION_01**

A single ToolBox candidate using the existing Stage-First shell with:

1. real current actor/source roster;
2. current FrizzleBob Driver Graft as default FrizzleBob;
3. later saved Cube-Pet state available without silently falling back to 1.2.7;
4. three complete Resident scene presets:
   - Goth Girl;
   - Orc Warband;
   - Animatronic;
5. accepted shared inline 3D editor under `Messen`;
6. transform Save/Reload including Scale;
7. no substitute actors/placeholders on source failure.

This is a **functional consolidation artifact**, not the final visual redesign.

## 2 · Exact Stage-First visual donor

Dropbox exact file:

`/CLAUDE/KFB ToolBox v0.5/KFB-ToolBox/_handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/design/KFB ToolBox Stage-First Concept.dc.html`

Dropbox file id:
`id:KeQLaY5-IIAAAAAAAAdE5g`

Revision:
`65c1dc57c822b4602da6f`

Size:
`42,850 B`

Dropbox content hash:
`4f3aa28f2142edb566b6959b1581eeb8a7448f8a844a19b656a90c038f8aec01`

Human/product direction already accepted:
- one top bar;
- `Actor ▾`;
- `Body · Face · Motion · Voice · Messen`;
- dominant 3D Stage;
- one context palette/drawer;
- compact camera controls;
- `Stage ▾`;
- split-screen remains usable.

**Use the actual donor. Do not redraw it from prose.**

## 3 · Actual Studio roster source

Dropbox:

`/CLAUDE/KFB ToolBox v0.5/KFB-ToolBox/stage-first/src/KFB FrankenStein Studio v18.dc.html`

File id:
`id:KeQLaY5-IIAAAAAAAAdFxA`

Revision:
`65c1dc57c82224602da6f`

Size:
`642,417 B`

Content hash:
`b87457d6b4d15e5cfe21be7e80353cccba976b2be2f877708279df87bf9d1ad9`

Rule:
use this source to recover the actual Studio roster/categories.

Do not hardcode a new four-character roster from the Stage-First mockup.

## 4 · Current FrizzleBob

Label:
**FrizzleBob · Driver Graft**

Source branch:
ToolBox source-lock PR #185
`chatgpt-web/toolbox-source-lock-2026-09-23@2833674b36be707fa4d14c8b532faee78ef3ba28`

Mount:
`tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js`

Blob:
`a84b2c92a00f7764088c4916030327eb04a91c5c`

Contract:
`tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json`

Blob:
`f202a1c2f1670ab6045176af6621c94041124e76`

Rule:
- use `mountGraft()`;
- no raw Driver substitute;
- no Cube Bunny substitute;
- no Combat Platformer substitute.

Legacy lineages remain valid named sources but are not the default FrizzleBob.

## 5 · Saved Cube-Pet state

Do not use Stage-First bundled `kfb.pets/1.2.7` as saved-user truth.

Later saved source:

`/Mac/Downloads/kfb-pets (7).json`

File id:
`id:KeQLaY5-IIAAAAAAAAZ7uA`

Revision:
`65b3f3d5a367d4602da6f`

Size:
`48,511 B`

Content hash:
`c97769de07947b3bfd952960e2b50204dadf7db29807d9328eb87625fc341ff1`

Schema/version:
`kfb.pets/1 · 1.2.9`

Known evidence:
- Bunny includes measured body/pad/ground data absent from bundled 1.2.7;
- Penguin tuning differs from 1.2.7.

This source is a **saved user state**, not automatically the global canonical file.
For this ToolBox integration it is the required source for showing the user's saved Cube-Pet versions.

## 6 · Eye / face owners

Canonical Eye runtime:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

Current main blob:
`853bcf5fb090dd6564fda8bc83d0b4cb527e6b26`

Medium/Large source:
PR #104
`toolbox/eye-rig-batch-2026-09-18@e277c3456651d314a01adea046e0105d2a12cdd1`

Evidence:
- 27 Medium actors;
- four reviewed Large actor profiles;
- 95/95 persisted suite PASS;
- 4/4 runtime syntax PASS.

Legacy source:
PR #162
`chatgpt-web/legacy-eye-batch-17-2026-09-21@7b1b52a60d64c9dc710514a59d1a7365f8a168e7`

Evidence:
- 17/17 profiles persisted;
- 16 measured candidates;
- Skull human-required;
- 24/24 + 247/247 source-first evidence;
- 30/30 + 215/215 persisted reconstruction evidence.

This packet does **not** ask Coworker to redesign EyeRig.
Existing Face functionality may be consumed.

## 7 · Accepted shared inline editor

Use the **human-accepted R2** editor, not a reimplementation.

Acceptance commit:
`30719fc7e2a1d8ef4bfb67570b4e82b0be6dcbb4`

Module:
`tools/KFB-ToolBox/lib/edit-layer.js`

Accepted R2 blob:
`c97b3537f71e939176f3ae5ce7ae83feabb7918f`

Georg accepted:
- select;
- Move;
- Rotate;
- free Scale;
- Drop;
- World/Local;
- Close;
- Save/Reload transform roundtrip.

R3 convenience `−/+` uniform size is optional/non-blocking.
Do not require it for this packet.

### Persistence contract

`skills/chat/workflows/KFB_INSCENE_EDITOR_MODULE_V1_2026-09-20/START_HERE.md`

Blob on consolidation base:
`7f28e293c86dbf23abffd4ad204078bc1fa1422c`

Schema:
`kfb.scene-patch.v1`

Already contains:
- position;
- rotation;
- scale.

Do not create a second transform schema.

## 8 · Resident scene donor owner

Pin Resident Atlas source at:

`georg-doc/kayfabizarro@10f661a542e2553b4d3433bfc5b45dfc1401e660`

Key files:

`tools/resident_atlas_s6/data/cast.js`
blob:
`5e918ae1521e63d121558fb7aff4fd1f8239baec`

`tools/resident_atlas_s6/lib/atlas.js`
blob:
`34c2f201b9d0864a1d5e4b65cfab6659ad899b89`

`tools/resident_atlas_s6/docs/ASSET_MANIFEST.json`
blob:
`ebf72cddda621e5db2a8db6e3054862ef033afeb`

`tools/resident_atlas_s6/docs/ATLAS_RETURN.md`
blob:
`a0c2ebabe864554c94bb09721369bfeb49bf90fb`

Atlas source pins:
- normal assets:
  `891eadf01e218f5fc21387e64cea1fec8332c5b6`
- Medium/Large animations:
  `aa16a777a970f23d3f11fb3c23dc40718b04fa88`
- Legacy:
  `10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0`

Use canonical RAW URLs.
Review-only texture host adapter may be consumed where needed.
Do not reopen the known ChatGPT texture diagnosis.

## 9 · Resident fixture A · Goth Girl

Resident id:
`goth-girl`

Source:
`media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb`
at normal asset pin.

Rig:
`Rig_Medium`

Pose:
`Sit_Chair_Idle`

Layer:
`Waving` torso layer.

Seat rule:
`sitOn: stool`

Measured seating correction already in donor:
- hip bone in sitting pose y = 0.481;
- stool surface y = 0.800;
- donor correction = +0.319.

Required props from same donor recipe:
- stool;
- speaker;
- mic stand;
- optional hand microphone.

Do not flatten this into a standing generic actor.

## 10 · Resident fixture B · Orc Warband

Resident id:
`orc-warband`

Legacy root:
`media/3D_Assets/KayKit Legacy/Orc Warband - legacy/`

Pin:
`10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0`

Actors:
- `character_orcA.gltf`
- `character_orcB.gltf`

Legacy animation rig:
`media/3D_Assets/KayKit Legacy/KayKit Character Animations 1.2 - legacy/Animations/gltf/KayKit_AnimatedCharacter_v1.2.glb`

Rig family:
`Rig_Legacy`

Important:
the character files are assembled from parts against the Legacy rig.
Do not treat them as normal skinned Medium actors.

Props:
- banner;
- sword;
- shield;
- hammeraxe.

Colors:
named Legacy materials, not texture-sheet replacement.

Existing donor evidence includes:
- two actor mixers;
- `Walk · orcA 18/18, orcB 18/18`;
- measured attachment/head clearances.

Do not replace the set with Orc Brute or Raider.

## 11 · Resident fixture C · Animatronic

Resident id:
`animatronic`

Root:
`media/3D_Assets/KayKit_Mystery_Series6/5 - November 2023 - Animatronic/`

Normal asset pin:
`891eadf01e218f5fc21387e64cea1fec8332c5b6`

Actors:
- Creepy:
  `characters/gltf/Animatronic_Creepy.glb`
  pose `Waving`
- Normal:
  `characters/gltf/Animatronic_Normal.glb`
  pose `Holding_B`

Rig:
`Rig_Medium`

Guitar:
`assets/gltf/Guitar.gltf`

Normal playing relation already measured in donor:
- elevation 36;
- azimuth 4;
- roll 0;
- front 0.1;
- strumX -0.34;
- gripLocal -0.14;
- strumLocal -0.56;
- faceZ 0.043;
- backZ -0.1;
- bodyMid -0.6;
- bodyX -0.1;
- bodyY 0.8;
- bellyGap 0.04.

Procedural strum:
- arm r;
- 96 BPM;
- 4 beats;
- travel 0.16;
- sway 1.5.

Mixed Bag electric guitars use:
`8948a06b75cb18c970599afb29b6a772315fad0e`

Do not re-guess guitar orientation from screenshots.

## 12 · Review transport rules

Use:
- canonical pinned RAW asset URLs;
- exact Resident recipes;
- human-verified ChatGPT texture adapter only as review-host transport where required.

If a mandated source fails:
show the failure.

Never substitute:
- sign;
- cube;
- generic actor;
- flat material;
- reconstructed set.

## 13 · Protected owners

Do not replace:

- Stage-First visual grammar;
- Studio roster source;
- FrizzleBob Driver Graft;
- EyeRig v6;
- existing Eye profile data;
- Resident Atlas recipes;
- shared `edit-layer.js`;
- `kfb.scene-patch.v1`;
- host persistence ownership;
- asset source pins.

No new global roster schema.
No second editor.
No second Resident database.
No new EyeRig.

## 14 · Seam

```
[FORK]
Exact Stage-First visual donor pinned by Dropbox id/rev/hash.

[COPY]
Existing source modules:
- Studio roster source;
- FrizzleBob Driver Graft;
- saved Cube-Pet state;
- accepted R2 edit-layer;
- Resident Atlas recipes.

[NAHT]
ToolBox host adapters that connect these existing sources to:
- Actor selector;
- Stage preset;
- Messen editor;
- ToolBox save/reload.

[UNCHANGED]
Donor runtimes, measurements, rig owners, source assets and Resident recipes.
```

## 15 · Coworker implementation scope

Coworker may create a new bounded ToolBox integration branch after refreshing current heads.

Allowed:
- source adapters;
- roster adapter;
- resident-scene preset adapter;
- Messen host adapter;
- ToolBox persistence wiring;
- tests;
- one zero-install review artifact;
- Return/changelog.

Not allowed:
- broad visual redesign;
- replacing the Stage-First donor;
- rebuilding actor models;
- redesigning EyeRig;
- creating new animations;
- new Resident recipes;
- Claude Design changes.

## 16 · Coherent review artifact

Return one:

`TOOLBOX_SOURCE_SAFE_INTEGRATION_01_REVIEW.html`

It should let Georg:

1. see the real Stage-First shell;
2. select the real current FrizzleBob;
3. browse the actual Studio roster;
4. inspect saved Cube-Pets without 1.2.7 fallback;
5. switch Stage between:
   - neutral;
   - Goth Girl;
   - Orc Warband;
   - Animatronic;
6. select a real scene object;
7. Move / Rotate / Scale / Drop;
8. Save;
9. Reload;
10. continue editing.

No need to expose every deep ToolBox function in this first integration artifact.

## 17 · Internal checks before Georg

Coworker must verify internally:

- Stage-First donor hash/revision matches;
- Studio roster source hash/revision matches;
- saved Cube-Pet source hash/revision matches;
- FrizzleBob mount + contract blobs match;
- accepted R2 edit-layer blob matches;
- all three Resident recipes load from pinned sources;
- actor counts preserved;
- required props preserved;
- pose/attachment relations preserved;
- Save/Reload preserves position/rotation/scale;
- missing source cannot silently substitute.

These are not separate Georg gates.

## 18 · Georg human milestone

Deliver the clickable review HTML in the same chat.

Ask only:

1. **Ist das jetzt endlich die richtige ToolBox-Figuren-/Szenenbasis statt Ersatzfiguren?**
2. **Fühlt sich Actor → Stage/Resident → Messen → Save/Reload als ein zusammenhängendes Tool an?**
3. **Gibt es einen sichtbaren Fehler, der einen Claude-Design-Pass noch blockiert?**

Do not ask Georg to approve individual blobs, poses or source paths.

## 19 · Stop conditions

Stop if:
- exact Stage-First donor cannot be reproduced;
- actual Studio roster cannot be recovered from pinned source;
- current FrizzleBob is substituted;
- a Resident recipe must be reconstructed from prose;
- a second editor/persistence owner appears;
- two repair passes fail the same integration gate.

## 20 · WSA

WSA-only capability:
**NONE identified.**

This packet should be attempted in Coworker first.

Escalate to WSA only if Coworker discovers a concrete local/private multi-repo or binary capability it cannot perform.

## Done

This packet is complete enough for Coworker implementation.

Before writing product code:
refresh current main, PR #185 and PR #186 heads.
If source identity materially changed, update this packet before implementation.
