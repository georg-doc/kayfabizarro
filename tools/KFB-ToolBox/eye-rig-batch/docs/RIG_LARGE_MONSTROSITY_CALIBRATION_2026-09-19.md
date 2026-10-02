# Rig_Large · Monstrosity Calibration Lane · 2026-09-19

Status: **IMPLEMENTED CANDIDATE · HUMAN CALIBRATION REQUIRED**  
Owner: KFB ToolBox / Rigging  
Source branch: `toolbox/eye-rig-batch-2026-09-18`

## Decision

Georg selected **Monstrosity** as the first `Rig_Large` calibration actor because its forehead/front geometry is deliberately difficult.

There is **no accepted Rig_Large EyeRig default yet**.

The workbench may show an initial normalized EyeRig starting position so the controls are usable, but that starting position must not be described, exported or applied as the Large class default.

The Large class default exists only after Georg tunes Monstrosity and explicitly presses:

**Set as Large default**

## Verified Large roster

Existing Resident Atlas / Large probes establish exactly this current first Large group:

1. **Monstrosity**  
   `media/3D_Assets/KayKit_Mystery_Series6/4 - October 2025 - Monstrosity/Monstrosity.glb`  
   blob `ff8e7d74026b808a3bedeab4bece830df116a4bc`

2. **Black Knight**  
   `media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/characters/BlackKnight.glb`  
   blob `ce20440309951a9d85d246b6ff6b0fa399f6c9d8`

3. **Demon Lord**  
   `media/3D_Assets/KayKit_Mystery_Series6/DemonLord/characters/DemonLord.glb`  
   blob `7dfc03c272e77c1cdcd488bf3b396f6600faa440`

4. **Orc Brute**  
   `media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb`  
   blob `1b56aac3d98cc978bd1311ddc61f1260a870494d`

All four exact GLBs contain one 23-joint skin named **Rig_Large**.

## Animation boundary

Large must not consume Medium animations just because bone names match.

The workbench uses the actual Large files:

- `Rig_Large_General.glb`
- `Rig_Large_MovementBasic.glb`

Verified relevant clips:

- Idle_A
- Walking_A
- Running_A

There is **no Jump_Full_Short** in the available Large General / MovementBasic / MovementAdvanced / Simulation / Special sets. The Jump button is therefore disabled in Large mode rather than borrowing the Medium clip.

## Calibration workflow

1. Switch the workbench from **Medium** to **Large**.
2. Monstrosity loads first.
3. Adjust ordinary EyeRig controls until its difficult forehead/front geometry looks right.
4. Check Front, ¾ L, ¾ R and Side.
5. Press **Set as Large default**.
6. Only then use that Large default on Black Knight, Demon Lord and Orc Brute.
7. Save per-character overrides where required.

Before step 5, **Apply to Selected is disabled for Large**.

## Source-eye cleanup

The same existing generic donor detector is reused for Large actors.

Policy remains fail-closed:

- no safe mirrored front pair → remove nothing;
- detector/strip failure → remove nothing;
- actor remains available for manual review / Unsupported.

No Large actor receives a guessed source-eye component index.

## Medium protection

The Medium catalog, Medium authoring default and all existing Medium per-character profiles remain separate.

The class switch stores:

- current class;
- current actor per class;
- selected actors per class;
- class default per class;
- actor override profiles.

Promoting Monstrosity to Large default does not change the Medium default.

## Human gate

Georg's next action in Large is intentionally simple:

**Open Large → tune Monstrosity → Set as Large default.**

Only after that should the other three Large actors be judged.
