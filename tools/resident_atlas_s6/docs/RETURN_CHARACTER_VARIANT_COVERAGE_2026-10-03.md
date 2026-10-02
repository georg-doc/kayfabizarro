# RETURN · RESIDENT-VARIANT-COVERAGE-01

Status: **REGISTERED · SOURCE AUDIT PASS · NO RUNTIME PROMOTION**

## Outcome

Resident Atlas now has a durable source-backed appearance-variant requirement instead of relying on filenames, promo recollection or chat context.

Primary result:
- **Magical Girl A/B/C/D are all required** in Resident Atlas.
- One shared `MagicalGirl.glb` geometry; four source texture appearances.
- Existing Batch EyeRig PR #104 is the cross-owner.
- The Paladin A/B implementation in PR #104 is retained as the model: light/blonde **B = King**, shared geometry/EyeRig profile, no duplicate skeleton.

Broader source result:
- **25** character texture families with ≥2 source palettes.
- **56** exact source appearance files.
- repository-wide follow-up across other top-level KayKit packs found **0 additional multi-texture character families** under the same rule; Driver `car_texture` is excluded as vehicle-only.
- canonical Resident Atlas S6 explicitly completes only **2** palette families today: Cleric and Ultra Turbo Hero Man.
- complete missing/partial matrix is persisted in:
  - `data/character-variant-requirements.v1.json`
  - `docs/CHARACTER_VARIANT_COVERAGE_2026-10-03.md`

## Git state

- repo: `georg-doc/kayfabizarro`
- source main: `7600fa9e29d396eaa9c5a11532e63cdad7689e75`
- branch: `chatgpt-web/resident-character-variant-coverage-2026-10-03`
- review PR: **Draft #330**
- Batch EyeRig owner: Draft PR #104
- EyeRig cross-owner registration comment: `5962642420`

## Evidence

See:
`docs/TEST_REPORT_CHARACTER_VARIANT_COVERAGE_2026-10-03.md`

Mechanical source audit:
- **56/56** registered appearance paths present
- **56/56** blob SHA matches
- MagicalGirl geometry exact blob verified
- Magical Girl source palettes **4/4 present**
- canonical S6 explicit `skin:` substitutions: **2**
- EyeRig workbench actor count observed: **55**
- `magical-girl` geometry actor present
- `paladin-king` verified as palette B virtual appearance over Paladin geometry

## Current canonical Resident gaps of immediate interest

Existing S6 Residents with alternate source palette not fully explicit:
- Goth Girl B
- Witch B
- Black Knight ALT
- Avian Swordsman B
- Orc Brute B
- Monstrosity B
- Farmers A/B palette-to-model mapping
- Animatronic A/B palette mapping across Normal/Creepy states

Complete current S6 palette examples:
- Cleric base + B
- Ultra Turbo Hero Man A + B

Full backlog includes non-resident multi-palette sources such as Orc Raider, Combat Mech, Paladin, Hiker, Magical Girl, Robot, Tiefling, Driver, Superhero, Monster Costume, Werewolf, Plant Warrior, Ninja, Hoarder and Clanker.

## Important distinction

Palette variants are not automatically separate characters.

Separate geometry/state cases are tracked independently:
- Protagonists A/B
- Paladin helmeted/unhelmeted
- Werewolf Man/Wolf
- Animatronic Normal/Creepy
- Farmers A/B
- Robot One/Two

## Stage / Live

No new Stage and no runtime change.

Existing public Resident Atlas:
`https://kayfabizarro.pages.dev/resident-atlas-s6/`

The four Magical Girl appearances are **not** claimed visible there yet.

## Unresolved

1. Magical Girl A/B/C/D implementation in canonical Resident Atlas remains open.
2. Magical Girl A/B/C/D appearance selectors in Batch EyeRig remain open.
3. The remaining 25-family backlog is registered but deliberately not bulk-implemented.
4. Newer inbox/session cuts may contain useful variant work (for example Hiker B), but they are not promoted canonical S6 truth.

## Exactly one next gate

**MAGICAL-GIRL-VARIANTS-01**

Implement one shared MagicalGirl geometry with four exact source appearances A/B/C/D in:
1. Resident Atlas candidate;
2. existing Batch EyeRig workbench.

Then show all four side by side / selectable and run visual review before touching the broader backlog.

No auto-merge. No Live promotion.
