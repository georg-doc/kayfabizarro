# TEST REPORT · RESIDENT-VARIANT-COVERAGE-01

Date: 2026-10-03  
Owner: Resident Atlas  
Cross-owner: Batch EyeRig PR #104

## Source pin

`georg-doc/kayfabizarro@7600fa9e29d396eaa9c5a11532e63cdad7689e75`

## Mechanical source audit

- registered character texture families: **25**
- registered source appearance files: **56**
- exact appearance paths present in pinned Git tree: **56/56 PASS**
- appearance blob-SHA matches against pinned Git tree: **56/56 PASS**
- missing registered appearance paths: **0**
- SHA mismatches: **0**

Magical Girl geometry:
- path: `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2026 - Magical Girl/MagicalGirl.glb`
- blob: `30fc1d37fc0f2a02d15ab1a052557462b8b27a32`
- size: **437,752 bytes**
- source palettes A/B/C/D: **4/4 present**

## Canonical Resident Atlas coverage check

Canonical owner:
`tools/resident_atlas_s6/data/cast.js`

Explicit `skin:` appearance substitutions found: **2**

1. Ultra Turbo Hero Man B
2. Cleric B

This confirms the audit boundary: current canonical S6 does not already expose the broader source palette set merely because the files exist.

## Batch EyeRig owner check

Owner:
Draft PR #104 · branch `toolbox/eye-rig-batch-2026-09-18`

Observed branch head at intake:
`656d6d335070c27827ccf5a7fb4629b124303292`

Current medium workbench actors: **55**

Verified:
- Magical Girl geometry actor exists as `magical-girl`, Rig_Medium, 23 joints.
- Magical Girl actor has no A/B/C/D appearance list yet.
- Paladin source actor exposes A/B appearance variants.
- `paladin-king` exists as a virtual appearance actor over Paladin geometry.
- `paladin-king.appearanceVariant = "B"`.
- `paladin-king.kingCandidate = true`.
- King texture is exact `paladin_texture_B.png`.

Cross-owner registration comment added to PR #104:
`5962642420`.

## Documentation integrity

Machine matrix parsed successfully:
`tools/resident_atlas_s6/data/character-variant-requirements.v1.json`

Declared totals:
- 25 character texture families
- 56 source appearances
- 2 canonical S6 explicitly complete palette families

## Runtime / Stage boundary

Runtime modifications: **0**  
Resident cast modifications: **0**  
EyeRig implementation modifications: **0**  
New Stage: **0**

Existing public Resident Atlas surface remains:
`https://kayfabizarro.pages.dev/resident-atlas-s6/`

No claim is made that Magical Girl A/B/C/D are visible there.

## Result

**PASS · requirement/source registration only**

Exactly one next gate:
**MAGICAL-GIRL-VARIANTS-01**
