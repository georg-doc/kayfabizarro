# Landmark World Style Bridge v1 · Pilot 06 · 2026-09-19

**Status:** DECISION / IMPLEMENTATION SLICE

## GOAL

Carry Georg's accepted decision forward:

> **Grotesque is the default landmark view/style.**

Apply that default to the existing modular landmark set, while keeping each landmark's own cartoon identity palette and placing it inside the **same host-owned visual world** as:

- OSM City Lab Hürth / Ehrenfeld when `environment=osm`;
- current `georg-doc/KFB-Travel-Globe` TinySkies-derived terrain / sky / light language when `environment=travel`.

This slice also prepares a source-backed implementation catalogue for further iconic genii loci / architectures with interesting geometry.

## EXISTING OWNER

- Landmark authoring/donor: `georg-doc/kayfabizarro/tools/img2threejs/`
- OSM geography / City palette / City deformation / Landmark Override: `tools/osm-city-lab/`
- Travel terrain / biome / day-night / sky-light language: `georg-doc/KFB-Travel-Globe`
- WSA remains Race integration lead.
- Race / Travel / Audio / Registry ownership is unchanged.

## EXACT SOURCES / REVISIONS

Recovered before this slice:

- `georg-doc/kayfabizarro@0f46003fa8ffd63c0b190c639a6a6c38bfec592b`
- `georg-doc/KFB-Stunt-Car-Race@de83868a4b1f06dc88730c564b2ebb63f9430d9d`
- `georg-doc/KFB-Travel-Globe@8614282aab2ced43bb5dda9fcf7abadf9768100a`

OSM:
- City style `f129cca3041b55b84de26048dad7aef8fac8b292`
- City material resolver `42cca129c5928f6178d0f7e1e0c06f7cc1a62b03`
- City cartoon deformer `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782`
- City viewer lighting `181edccab50c2b127b95370cc67da55e138b7a78`

Travel:
- sky presets / exact TinySkies-derived light rig `04dd730ee735f064888e8472eff79583f17bebb0`
- world moods `2747a526e2aa38989c9c4052304da8733662b61c`
- biome domains `db3acf6ae6b7ebbc6cb4a7113a0d0fe782429d74`

## PROTECTED BOUNDARIES

- **Grotesque becomes the LANDMARK authoring default only.** OSM City Lab's own `defaultMode: cartoon` is not changed by this slice.
- Existing City and Travel visual owners are consumed, not copied into a second canonical style system.
- Because the Travel repo is private, the public authoring viewer uses a **derived pinned snapshot** of only the required visual constants. The snapshot is explicitly noncanonical and contains exact source pins.
- Landmark-local colour identity may vary by landmark, but world mood only changes hue; saturation/lightness remain owned by the landmark palette, mirroring the current Travel rule.
- No physics/collision/audio/movement owner is added.
- Dom v0.2 remains accepted history; converting it to modular Grotesque geometry is a separate implementation item.

## DONE WHEN

1. Grotesque is the default mode in the new all-landmark viewer.
2. Eiffel / Giza / Stonehenge / Pentagon use the existing generic City Grotesque deformation.
3. Spasskaya / Kremlin use accepted Semantic Band Rig v2 in Grotesque by default.
4. Landmark colours are landmark-specific and cartoon-readable.
5. OSM environment mode reproduces the current City Lab background/fog/light constants.
6. Travel environment mode reproduces the current Travel day/evening/night sky gradients and light intensities/colors from the pinned source snapshot, with fog distances scaled only for the viewer's metre-scale framing.
7. Travel mood/biome switches recolour the environment and harmonize landmarks without introducing a second saturation/lightness writer.
8. A candidate catalogue prepares the next genii loci by geometry class, source strategy, colour identity and rig strategy.
9. Tests prove default mode, source pins, valid palettes and finite Grotesque geometry.

## HUMAN DECISION · 2026-09-19

Georg selected **OSM City Lab** as the default landmark-review environment.

- default review environment: `osm`;
- Travel Verdant / Day remains an explicit alternate context;
- the landmark deformation default remains City Grotesque;
- the OSM City Lab's own building default remains `cartoon`.

This closes the Pilot-06 environment-choice gate.
