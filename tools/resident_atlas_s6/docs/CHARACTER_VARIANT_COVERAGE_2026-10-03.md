# Resident Atlas · Character Variant Coverage · 2026-10-03

Status: **SOURCE AUDIT + REQUIREMENT REGISTRATION · NO RUNTIME PROMOTION**

Owner: **Resident Atlas**  
Cross-owner: **ToolBox Batch EyeRig · PR #104**  
Source pin: `7600fa9e29d396eaa9c5a11532e63cdad7689e75`

## Decision

Every source-backed KayKit character appearance is a first-class candidate. A color/texture variant is not discarded merely because it reuses the same GLB and skeleton.

For identical geometry:

`one geometry identity → one rig/EyeRig geometry profile → N source-backed appearance variants`

Do **not** create duplicate skeletons or duplicate resident identities just to expose a palette. Each palette must nevertheless be independently selectable and visually checked because face/skin/lid colors can change EyeRig presentation.

## P0 registration · Magical Girl

Source geometry:

`media/3D_Assets/KayKit_Mystery_Series6/11 - May 2026 - Magical Girl/MagicalGirl.glb`

Exact geometry blob:

`30fc1d37fc0f2a02d15ab1a052557462b8b27a32`

Required Resident Atlas appearances:

1. **A** — `magical_girl_texture_A.png` · blob `9f927362ccd0c58159d7442489965052935a6b7e`
2. **B** — `magical_girl_texture_B.png` · blob `7692a6d3730df7c29e5901b5a1ad9f84b1045e6d`
3. **C** — `magical_girl_texture_C.png` · blob `fde6e26edad7a1ce77241b50a83504a9f556a565`
4. **D** — `magical_girl_texture_D.png` · blob `903ef0385f25598d00eeaadc54fc3f17c02e4364`

**Contract:** all four must be available in Resident Atlas. Current canonical S6 has none of them as a Resident. Batch EyeRig already has the Magical Girl geometry actor, but it does not yet register A/B/C/D as appearance variants.

The correct EyeRig implementation is the Paladin precedent: shared geometry calibration, virtual appearance choices, no duplicate skeleton.

## Existing precedent · Paladin / King

Batch EyeRig PR #104 already has:

- Paladin A = embedded/default;
- Paladin B = alternate light/blonde palette;
- virtual actor `paladin-king`;
- label **Paladin · King (Light B)**;
- `kingCandidatePalette: "B"`;
- same geometry/EyeRig profile, no duplicate skeleton.

This is the required pattern for Magical Girl and the other texture-only variants.

Resident Atlas itself does **not** yet carry Paladin/King in the canonical S6 cast. That remains a separate Resident composition/promotion step.

## Source-wide character palette audit

The current Mystery-Series source tree contains **25 character texture families** with at least two source palettes, totaling **56 source appearance files**. A repository-wide follow-up scan of the other top-level KayKit packs found **0 additional multi-texture character families** under the same source-file rule. `car_texture` in the Driver pack is deliberately excluded because it is a vehicle palette, not a character appearance. Current canonical S6 explicitly completes only **2** palette families: Cleric and Ultra Turbo Hero Man.

| Character | Source palettes | Canonical Resident Atlas | Missing / not explicit | Batch EyeRig |
|---|---|---|---|---|
| Orc Raider | A/B | NOT IN CANONICAL S6 | A, B | EYE GEOMETRY A OVERRIDE B MISSING |
| Combat Mech | BASE/ALT | NOT IN CANONICAL S6 | BASE, ALT | EYE GEOMETRY ONLY ALT MISSING |
| Paladin | A/B | NOT IN CANONICAL S6 | A, B | EYE COMPLETE A B KING B |
| Hiker | BASE/B | NOT IN CANONICAL S6 | BASE, B | EYE GEOMETRY ONLY B MISSING |
| Magical Girl | A/B/C/D | REQUIRED · 0/4 | A, B, C, D | EYE GEOMETRY ONLY REQUIRE A B C D |
| Robot | BASE/ALT | NOT IN CANONICAL S6 | BASE, ALT | EYE GEOMETRY ONLY ALT MISSING |
| Tiefling | BASE/B | NOT IN CANONICAL S6 | BASE, B | EYE GEOMETRY ONLY B MISSING |
| Farmers | A/B | PARTIAL / missing | explicit palette mapping | EYE GEOMETRY ACTORS A B PALETTE MAPPING NOT EXPLICIT |
| Driver | BASE/B | NOT IN CANONICAL S6 | BASE, B | EYE GEOMETRY ONLY B MISSING |
| Superhero | BASE/ALT | NOT IN CANONICAL S6 | BASE, ALT | EYE GEOMETRY ONLY ALT MISSING |
| Orc Brute | A/B | PARTIAL / missing | B | EYE GEOMETRY ONLY B MISSING |
| Monster Costume | A/B/C/D | NOT IN CANONICAL S6 | A, B, C, D | EYE GEOMETRY ONLY B C D MISSING |
| Black Knight | BASE/ALT | PARTIAL / missing | ALT | EYE GEOMETRY ONLY ALT MISSING |
| Cleric | BASE/B | COMPLETE | — | EYE GEOMETRY ONLY B NOT REGISTERED AS APPEARANCE |
| Werewolf | A/B | NOT IN CANONICAL S6 | A, B | EYE GEOMETRY STATES PRESENT PALETTE B NOT REGISTERED |
| Monstrosity | A/B | PARTIAL / missing | B | EYE GEOMETRY ONLY B MISSING |
| Animatronic | A/B | PARTIAL / missing | explicit palette mapping | EYE GEOMETRY STATES PRESENT APPEARANCE VARIANTS NOT REGISTERED |
| Witch | A/B | PARTIAL / missing | B | EYE GEOMETRY ONLY B MISSING |
| Plant Warrior | BASE/B | NOT IN CANONICAL S6 | BASE, B | EYE GEOMETRY ONLY B MISSING |
| Ninja | A/B/C/D | NOT IN CANONICAL S6 | A, B, C, D | EYE GEOMETRY ONLY B C D MISSING |
| Hoarder | BASE/B | NOT IN CANONICAL S6 | BASE, B | EYE GEOMETRY ONLY B MISSING |
| Clanker | BASE/ALT | NOT IN CANONICAL S6 | BASE, ALT | EYE GEOMETRY ONLY ALT MISSING |
| Avian Swordsman | BASE/B | PARTIAL / missing | B | EYE GEOMETRY ONLY B MISSING |
| Goth Girl | BASE/B | PARTIAL / missing | B | EYE GEOMETRY ONLY B MISSING |
| Ultra Turbo Hero Man | A/B | COMPLETE | — | EYE GEOMETRY ONLY B NOT REGISTERED AS APPEARANCE |

### Reading the table

- **COMPLETE** = canonical S6 explicitly instantiates the source palettes.
- **PARTIAL / missing** = the Resident exists, but alternate palette coverage is absent or not explicit.
- **NOT IN CANONICAL S6** = source and EyeRig candidate can exist, but there is no promoted S6 Resident entry.
- **EyeRig geometry only** = the character geometry is in the Batch workbench, but alternate appearances are not registered as palette choices.
- Farmers and Animatronic are intentionally not flattened into simple palette duplicates: both have separate model/state identities in addition to texture files.

## Important missing variants in current canonical S6

Already represented Resident, but source palette still missing/not explicit:

- **Goth Girl:** B.
- **Witch:** B.
- **Black Knight:** ALT.
- **Avian Swordsman:** B.
- **Orc Brute:** B.
- **Monstrosity:** B.
- **Farmers:** A/B texture-to-Farmer_A/Farmer_B mapping is not explicitly declared as palette metadata.
- **Animatronic:** A/B source palettes exist, while current S6 presents Creepy/Normal model states; palette coverage is not separately declared.

Already complete in current canonical S6:

- **Cleric:** base + B.
- **Ultra Turbo Hero Man:** A + B.

Not yet canonical S6 Residents, but multi-palette sources exist:

- Orc Raider A/B
- Combat Mech base/ALT
- Paladin A/B
- Hiker base/B
- Magical Girl A/B/C/D
- Robot base/ALT
- Tiefling base/B
- Driver base/B
- Superhero base/ALT
- Monster Costume A/B/C/D
- Werewolf A/B
- Plant Warrior base/B
- Ninja A/B/C/D
- Hoarder base/B
- Clanker base/ALT

## Candidate-history note

Newer unpromoted Resident Atlas inbox/session cuts already demonstrate **Hiker B** with the existing `skin` mechanism. That is useful donor evidence, but it does not override the canonical `tools/resident_atlas_s6/` owner until explicitly promoted.

## Non-texture appearance cases

These must stay visible in the audit but should not be mistaken for texture swaps:

- **Protagonists A/B:** two model files, shared texture; visible difference is model/UV authored.
- **Paladin:** unhelmeted + helmeted geometry, each can use A/B palette.
- **Werewolf:** Man + Wolf model states plus A/B palette files.
- **Animatronic:** Normal + Creepy model states plus A/B palette files.
- **Farmers:** Farmer_A + Farmer_B are separate character models; do not collapse them into one palette-only resident.
- **Robot:** Robot_One + Robot_Two are separate model identities plus base/ALT texture source.

## Owner handoff

### Resident Atlas

This file registers the coverage requirement only. It does not silently add 25 new Residents or multiply the cast. Runtime/composition work remains candidate-only and should be done in bounded resident slices.

### Batch EyeRig

PR #104 remains the EyeRig owner. Add appearance-variant selectors to its existing source inventory rather than building a second EyeRig list.

For a pure texture variant:

1. reuse geometry calibration;
2. apply exact source texture;
3. recompute/verify presentation-dependent face/lid color if needed;
4. show each palette in the Batch workbench;
5. keep one shared geometry identity.

### Registry / Librarian

Registry remains source/provenance owner. This audit adds no new asset semantics to Registry.

## No Stage claim

No runtime or public Stage was changed by this registration slice. The existing Resident Atlas public route remains the current human surface:

`https://kayfabizarro.pages.dev/resident-atlas-s6/`

The four Magical Girl appearances are **not** claimed visible there yet.

## Exactly one next gate

**MAGICAL-GIRL-VARIANTS-01** — implement only Magical Girl A/B/C/D as one shared-geometry four-appearance Resident candidate and mirror those four appearances into the existing Batch EyeRig workbench. Then visually verify all four before starting the broader 25-family backlog.
