# Claude Design request · FULL KayKit Environment Atlas project export

Use this request only if exporting the current Claude Design project again.

## Goal

Create **one complete recovery ZIP with documentation** for the current project **KayKit Environment Atlas** so KFB Work can reconcile the whole project into the Environment Atlas Site without reconstructing missing slices from chat or changelog prose.

This is a source-recovery export, not a redesign.

## Include

Export the **current full project source tree**, preserving filenames and relative structure.

Mandatory current/runtime families include, where they exist in the project:

- all World/Environment Atlas pages and modules;
- `KayKit_Hex_Realm_S11`;
- `KayKit_Hex_Tile_Model_S12`;
- `KayKit_Dungeon_Model_S13`;
- `KayKit_Dungeon_Generator_S13_2` plus later S13.3/S13.4 runtime changes;
- `KayKit_Bits_Model_S14`;
- `KayKit_Space_Base_S15`;
- `KayKit_Restaurant_S16`;
- `KayKit_Restaurant_S17`;
- Plant Prop / Living Plant work S18/S19, including all plant modules and EyeRig adapter;
- `KayKit_Sample_Atlas_S20`;
- `KayKit_Room_Study_S21`;
- S22 wall-node / room-study / editor changes;
- any later Environment Atlas project pages/slices not listed here.

Also include all shared project modules they depend on, including when present:
- `lib/hex-grid.js`;
- `lib/dungeon-grid.js`;
- `lib/dungeon-light.js`;
- `lib/bits-inventory.js`;
- `lib/space-grid.js`;
- `lib/restaurant-grid.js`;
- `lib/restaurant-plan.js`;
- room/sample/editor modules;
- Plant Prop modules (`plant-inventory`, `plant-recipe`, `plant-pattern`, `plant-rig`, `plant-eyes`, `plant-light`);
- all measurement/probe tools used to establish dimensions, edge truth, compatibility, support/contact or placement rules.

## Documentation must be complete

Include:
- `START_HERE.md` / README;
- full additive `CHANGELOG.md`;
- `HOUSEKEEPING.md`;
- `github.md` / source map;
- all handovers;
- all postmortems;
- all mental-model / architecture docs;
- editor docs;
- pack-gap docs;
- all current test/checklist docs;
- export manifests.

Do not omit a superseded/failed document if it records why a current rule exists. Mark it as history instead.

## Required new manifest

Add `PROJECT_MANIFEST.json` at the ZIP root.

For every project file record:
- relative path;
- role;
- sprint/slice;
- status: `ACTIVE | CURRENT_DONOR | FROZEN | SUPERSEDED | FAIL_HISTORY | DOC | PROBE | PROOF`;
- direct dependencies;
- external source dependencies;
- whether the file is the current version for that role.

Also include:
- project title;
- export date/revision;
- current latest sprint;
- entry pages;
- explicit list of files that are active but intentionally absent from the ZIP, if any.

## External dependency map

Add `EXTERNAL_SOURCES.json`.

Record exact external/canonical dependencies rather than copying them:
- `georg-doc/kayfabizarro` asset paths;
- Asset Registry/Librarian sources;
- KFB EyeRig source + contract;
- Tiny Treats / KayKit / Kenney / Quaternius pack paths;
- commit pin when known;
- `main` only when the project genuinely has no pin.

For Plant Prop specifically preserve the fact that `plant-eyes.js` is an **adapter to existing EyeRig v6**, not a separate EyeRig owner.

## Proof / screenshots

Include the project's own useful proof images/screenshots where they explain a current or failed gate.

Do not bloat the export with duplicated 3D asset packs.

## Do NOT include

- duplicate canonical GLB/GLTF/texture packs already in `media/3D_Assets`;
- generated replacement assets;
- generic placeholders;
- rewritten summaries in place of actual source files;
- a new runtime architecture;
- a cleaned-up history that erases failures.

## Critical recovery requirement

The current GitHub corpus is known to have documentation for **S14–S17** while the actual S14/S15/S16/S17 runtime pages/modules are not directly present in the currently found lean exports.

The ZIP must include those actual source files if they still exist in the Claude Design project.

In particular recover if present:
- `KayKit_Bits_Model_S14.html`
- `lib/bits-inventory.js`
- `tools/list-pack-files.html`
- `tools/measure-bits-packs.html`
- `tools/heightmap-bits.html`
- `tools/probe-corners-compat.html`
- `tools/probe-space-links.html`
- `KayKit_Space_Base_S15.html`
- `lib/space-grid.js`
- `KayKit_Restaurant_S16.html`
- `lib/restaurant-grid.js`
- `KayKit_Restaurant_S17.html`
- `lib/restaurant-plan.js`

If any no longer exist, list them explicitly under `missingCurrentSources` in `PROJECT_MANIFEST.json`. Do not recreate them.

## Return with the ZIP

Return:
1. ZIP filename;
2. export revision/date;
3. file count;
4. latest sprint;
5. whether S14–S17 actual source was recovered;
6. list of intentionally excluded large/canonical assets;
7. any known missing current source.

Do not promote, deploy or modify GitHub as part of this export.
