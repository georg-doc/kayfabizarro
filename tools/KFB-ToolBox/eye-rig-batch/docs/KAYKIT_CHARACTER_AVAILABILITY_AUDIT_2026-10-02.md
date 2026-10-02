# KayKit Character Availability Audit · intake · 2026-10-02

Status: **CONFIRMED PROJECTION BUG · FULL CROSS-SURFACE AUDIT OPEN**

## Trigger

Georg observed that Mannequin Medium can be used in the EyeRig Batch but is not available in the Asset Librarian character workflow.

## Confirmed

### Registry source exists

`registry/assets/v1/packs/kaykit-character-animations-1-1.json` contains:

- `Mannequin_Medium.glb`
- `Mannequin_Large.glb`

The new Adventurers pack registry contains all six:

- Barbarian
- Knight
- Mage
- Ranger
- Rogue
- Rogue_Hooded

### Librarian Town Character projection bug

Current code:

`tools/asset_registry/librarian/town-workbench.js`

defines animation source as either:

- a path below `/Animations/`; **or**
- any record whose `packId === 'kaykit-character-animations-1-1'`.

The second condition is too broad. It classifies the Mannequin character GLBs as animation sources. The Town Character predicate then rejects them.

This is a projection/filter defect, not a missing source asset and not a reason to duplicate Registry entries.

## EyeRig state

Current Medium roster after Adventurers extension: **33**.

The EyeRig catalog is not the canonical all-KayKit inventory; it is an authoring roster. Large and Legacy remain separate.

## Full audit still required

The next Asset Librarian-owned slice must establish one exact KayKit-character inventory and compare it against:

1. source GitHub character files;
2. canonical + Live Asset Registry catalog/rigfacts;
3. Asset Librarian general Assets view;
4. Asset Librarian Town Character lane;
5. EyeRig Medium / Large / Legacy catalogs;
6. Resident Atlas and other named character selectors that claim broad KayKit availability.

Do not infer a full PASS from pack-registry presence alone.

## Required fix direction

Narrow `isAnimationSource()` to actual animation-source paths/records. Character models inside `kaykit-character-animations-1-1` must remain eligible characters when they are renderable/skinned.

## Next gate

`KAYKIT_CHARACTER_AVAILABILITY_AUDIT_01` under the Asset Librarian owner.
