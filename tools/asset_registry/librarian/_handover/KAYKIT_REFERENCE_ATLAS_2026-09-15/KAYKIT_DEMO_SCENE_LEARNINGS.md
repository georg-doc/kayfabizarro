# KFB Asset Librarian · KayKit Demo / Scene Learnings

**Date:** 2026-09-15  
**Branch:** `chat/kaykit-reference-atlas-2026-09-15`  
**Status:** WORKING DELIVERABLE. Source-derived scene/reference knowledge; no runtime compatibility claim.

## Evidence discipline

This document intentionally separates four evidence classes:

- **SOURCE FACT** — explicitly stated in recovered official KayKit source pages or represented by actual source structure.
- **OBSERVED DEMO** — reserved for visual facts actually inspected in an image/GIF/video.
- **FILENAME / GEORG NOTE** — recoverable descriptive annotation embedded in the reference filename; useful but not independently visually verified in this connector pass.
- **INFERENCE / PROPOSAL** — downstream KFB interpretation, never promoted to source truth.

### Current visual-inspection limitation

The connected Dropbox preview surface confirms file identities and thumbnails but does not provide reliable pixel/frame content to this chat for detailed scene inspection. Image fetch is unsupported for these references. Therefore this first pass deliberately contains **no invented `OBSERVED DEMO` descriptions** from unseen pixels. The visual atlas remains an open follow-up step.

## 1 · Holiday Bits

### SOURCE FACT

Recovered official release material states:

- 55+ low-poly models in the FREE core pack;
- presents, Christmas tree, train and tracks, festive snacks/cookies, snowman, snowballs, snowball cannon and modular gingerbread pieces;
- one 1024×1024 gradient atlas;
- OBJ / FBX / GLTF distribution;
- CC0 licensing for the released core pack;
- light-bearing assets use a secondary material named `holiday_glow`, intended for emission in the receiving engine;
- EXTRA tier adds 30+ additional gingerbread-themed pieces intended for platforming / larger gingerbread-house construction.

### KFB LEARNING · PROPOSAL

- `holiday_glow` is a useful reference pattern for how KayKit separates emissive-capable geometry/material intent from the base asset. Resource Picker should expose the source/material fact but must not claim KFB renderer support until tested.
- Holiday Bits is relevant beyond seasonal dressing: train/track pieces, snowball cannon and modular gingerbread pieces are potential **Stunt / Town / Birthday** donors.
- Treat FREE core and EXTRA gingerbread coverage as separate ownership/tier records.

## 2 · Medieval Village WIP + Forest Nature

### SOURCE FACT

Recovered Sep-2026 KayKit update material describes a future Medieval Village split into:

- Exteriors
- Interiors
- Villagers character pack

The WIP Exteriors scene explicitly reuses **trees and rocks from the existing free Forest Nature Pack** alongside village-authored buildings/props. Described Village content includes medieval houses, fences, street signs, lanterns, roads, ladders and other props.

### SOURCE FACT · lighting context

Kay reports preparing Godot scene/lighting examples covering day, night and indoor/dungeon lighting.

### KFB LEARNING · PROPOSAL

- This is strong **source-author demonstrated cross-pack composition evidence**: Forest Nature is intended to mix with later environment packs rather than remain a sealed biome.
- For KFB Town/Travel, Resource Picker should make `same pack` and `demonstrated companion pack` distinct relations. Forest Nature ↔ Medieval Village is the first explicit companion-pack reference.
- Do not convert Kay's Godot lighting setup into a KFB material/renderer compatibility claim. Preserve it as staging/reference knowledge only.

## 3 · Board Game Bits

### SOURCE FACT

Recovered Nov-2025 development material states the Board Game Bits work included:

- generic board-game pieces;
- dominoes;
- a complete 52-card deck plus card backs in 3D and 2D;
- character card holders.

Current official release information describes a substantially larger FREE/EXTRA content set than the 35 model files visible in the current KFB Registry pack.

### KFB LEARNING · PROPOSAL

- Board Game Bits has unusually direct KFB crossover value because KFB's physical/deck language can use actual 3D card/deck/table pieces rather than generic proxies.
- The pack needs a **parity audit before Resource Picker promotion** because current Registry dependency and model counts indicate possible undercoverage.
- Card holders should be discoverable as structural props, not automatically treated as compatible character attachments.

## 4 · Block Bits

### FILENAME / GEORG NOTE

Dropbox contains:

`Block_Bits_Sample - VOXEL PYRAMID + STAGE + WRESTLING RING FLOOR + BOXEL BLITZ.png`

The descriptive suffix is treated as Georg's recovered filename annotation, not a visually verified observation in this pass.

### KFB LEARNING · PROPOSAL

If the image is later visually confirmed, these are particularly relevant compositional recipes for:

- **Stage / Performance:** raised voxel stage;
- **Combat / wrestling:** ring floor / arena geometry;
- **Stunt Race:** chunky readable obstacles, ramps/blocks or spectacle structures;
- **Town:** stylized temporary-event structures.

Do not encode those roles into Registry semantics before the reference image is actually reviewed.

## 5 · RPG Tools Bits + Character Animations

### SOURCE FACT

Recovered Nov-2025 source material describes RPG Weapons and Tools as separate asset directions and links the Tools release to additional tool-oriented character animations.

Current official RPG Tools release information states the Character Animations pack received **28 new tool animations**.

### KFB LEARNING · PROPOSAL

- This is an important **asset ↔ motion companion relationship**: a tool prop and a tool animation can be discoverable together without claiming every tool works with every character.
- Resource Picker should be able to surface `related motion sources` next to a tool pack while leaving final binding/grip/visual QA to Animation Lab / ToolBox.

## 6 · Series 7 · Demon Lord

### SOURCE FACT

Current repo source contains:

- character source package `DemonLord/`;
- family-specific `Rig_Large` animation source folder;
- sibling source assets `DemonHeart.gltf` and `SummoningCircle.gltf`.

### KFB LEARNING · PROPOSAL

- `DemonHeart` is a candidate prop/scene object.
- `SummoningCircle` is a candidate staging/FX-adjacent object.
- The combination is structurally authored together, but no automatic attachment or FX behavior is implied.

## 7 · Series 7 · Ultra Turbo Hero Man

### SOURCE FACT

Current repo source contains:

- `UltraTurboHeroMan/`;
- a `Rig_Medium` animation source tree;
- `UltraTurboHeroMan_Blaster.gltf`;
- `UltraTurboHeroMan_Sword.gltf`.

### FILENAME / GEORG NOTE

Dropbox reference filename:

`Weapons- DEMO - BLASTER - GRIP - POSE August2026_UltraHeroTurboMan.gif`

This strongly flags a weapon/grip/pose reference target, but its actual visual content has **not** been frame-inspected in this pass.

### KFB LEARNING · PROPOSAL

- Prioritize this GIF for the first future visual-reference review because it can teach real authored hand/grip/pose relationships useful for ToolBox.
- Until reviewed/measured, expose Blaster/Sword as same-collection candidates only; do not hardcode grip transforms from the filename.

## 8 · Series 7 · Goth Girl

### SOURCE FACT

Current repo source contains:

- `GothGirl/`;
- `Rig_Medium` animation source tree;
- `GothGirl_MicStand.gltf`;
- `GothGirl_Microphone.gltf`;
- `GothGirl_Speaker.gltf`;
- `GothGirl_Stool.gltf`.

### TESTED RESULT · existing KFB evidence

Birthday/Librarian probes already provide measured evidence for Goth Girl:

- `Rig_Medium_General`: 15/15 clips fully bound;
- `Rig_Medium_MovementBasic`: 11/11 fully bound;
- shared `Simulation`: 14/14 fully bound;
- shared `Special`: 15/15 fully bound;
- documented `Death_A`: 69/69 tracks bound and playback started;
- same-collection microphone discovery passed;
- Dance remained explicitly `MISSING` because no candidate had yet passed visual dance/groove review.

### KFB LEARNING · PROPOSAL

Goth Girl is currently the strongest **reference-to-tested-KFB bridge** in the Atlas:

- microphone / mic stand → Presenter candidate;
- stool → seated Presenter candidate;
- speaker → stage dressing;
- real measured Rig_Medium playback evidence.

Do not extrapolate stool contact, microphone grip or performance suitability to all Rig_Medium actors without visual QA/calibration.

## 9 · KayKit UI / HUD experiments

### SOURCE FACT

Recovered source material describes KayKit UI/HUD exploration where **3D-modeled elements are rendered into images and then used as modular 9-slice UI**.

### KFB LEARNING · PROPOSAL

This is potentially useful for KFB because it bridges the 3D KayKit visual language into UI without requiring every interface component to remain live 3D. Keep this as a presentation-technique reference, not a requirement for current Librarian UI.

## 10 · Pixel-art experiments

### SOURCE FACT / EXPERIMENTAL HISTORY

Recovered Nov-2025 source material mentions pixel-art experiments based on Adventurers, Skeletons, weapons and dungeon tiles, with no release timeframe at that point.

### KFB LEARNING

Archive as inspiration/history only. Do not classify as a missing released pack without newer release evidence.

## 11 · Mystery-series reference GIF queue

Dropbox contains named monthly GIFs for most Series 6 characters plus current Series 7. They are valuable because they may show:

- intended animation clips;
- prop relationships;
- character scale/staging;
- motion accents;
- material presentation.

**UNRESOLVED:** these points are hypotheses about what can be learned, not observations from the GIFs yet.

Priority future visual review order:

1. Ultra Turbo Hero Man weapon/grip/pose GIF — explicit filename target.
2. Goth Girl GIF — compare against known microphone/stool/speaker sources and measured KFB rig evidence.
3. Demon Lord GIF — check Heart/Circle use and Rig_Large staging.
4. Orc Brute — relevant to War Drum / large-body performance planning.
5. Lorekeeper — resolve the dedicated demo against Series 6 source structure.
6. Remaining monthly Series 6 demos in chronological order.

## 12 · Resource-relation vocabulary suggested by the reference evidence

**PROPOSAL ONLY:** the Atlas can describe these relations without changing Registry truth:

- `same_collection` — actual structural sibling source assets.
- `official_companion_pack` — official source explicitly demonstrates/recommends another pack, e.g. Village ↔ Forest Nature.
- `official_motion_companion` — source links prop pack to animation additions, e.g. RPG Tools ↔ Character Animations.
- `reference_demo` — promo/GIF/source reference exists.
- `tested_kfb_preview` — exact KFB preview/binding evidence exists.
- `filename_note` — Georg/reference filename supplies a clue not visually verified.

No relation above means `compatible` unless the receiving owner has produced the appropriate test result.
