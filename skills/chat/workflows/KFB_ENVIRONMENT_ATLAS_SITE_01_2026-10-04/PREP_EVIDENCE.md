# Prep evidence · KFB Environment Atlas Site 01

Status: **PREP CHECKS 22/22 PASS · SITE NOT IMPLEMENTED**
Date: 2026-10-04

## Branch state at evidence run

- Repo: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/kfb-environment-atlas-site-prep-2026-10-04`
- Base head: `9c2fee62b815f19cf967867f54985bd22e3f222b`
- State before this evidence commit: 2 commits ahead / 0 behind
- Files before this evidence commit: exactly `WORK_BRIEF.md` + `SOURCE_MAP.json`

## Static prep checks

Result: **22/22 PASS**

1. `SOURCE_MAP.json` parses as JSON.
2. Current source map contains exactly 3 currently proven Hex families.
3. Current source map contains 12 initial building-bearing KayKit/Kenney pack entries.
4. Reserved human route is a direct `kayfabizarro.pages.dev/kfb-hub/stage/...` URL.
5. ChatGPT Site URL remains `NOT_CREATED`; no fake URL was invented.
6. Current source evidence resolves to exactly 2 KayKit hex-capable families + 1 Kenney Hexagon family.
7. Visible-source firewall contains the 3 current banned-by-default legacy patterns.
8. Literal “Data Generator” lane remains `SOURCE_REQUIRED` rather than being invented.
9–20. All 12 building pack Registry shards were fetched and their current `assetCount` matched the pinned source map:
   - KayKit City Builder Bits: 45
   - KayKit Medieval Builder: 233
   - KayKit Medieval Hexagon: 240
   - Kenney Building Kit: 84
   - Kenney Castle Kit: 86
   - Kenney City Kit Commercial: 48
   - Kenney City Kit Industrial: 34
   - Kenney City Kit Suburban: 49
   - Kenney Factory Kit: 148
   - Kenney Fantasy Town Kit: 168
   - Kenney Modular Buildings: 115
   - GLB/Kenney Hexagon Kit mirror: 72
21. `media/3D_Assets/CATALOG/DEDUP_REPORT.md` contains both `GLB_hexagon_kit` and `kenney_hexagon-kit`, supporting the no-double-count rule.
22. Branch diff before this evidence commit contained exactly the two intended prep files and no unrelated edits.

## Source observations carried into Work

### Hex identity

The current repository does **not** prove three distinct KayKit Hex packs under the wording used in chat. It proves:
- KayKit Medieval Hexagon;
- KayKit Medieval Builder, with 128 measured hex tiles;
- Kenney Hexagon Kit, mirrored as `GLB_hexagon_kit` and duplicated by alias elsewhere.

This is an explicit source-identity audit item, not a request back to Georg and not permission to fabricate a third KayKit pack.

### Clay visual standard

The current Clay Style SSOT and Golden Matrix are on `work/clay-style-ssot-2026-10-01`, not `main`.

Verified blobs:
- `KFB_CLAYMATION_STYLE_SSOT.md` → `435b9ca51ce23b1d8c36c7cc89c65c2b1e03b65a`
- `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md` → `5d37512ed6583c1f0f005397fe0721dbbfb8bae5`

The building comparison contract is therefore source-first:
`UNCHANGED SOURCE | LOCKED GOLDEN | CURRENT CANDIDATE | CONTACT/EDGE CLOSE-UP | COST`.

`building_A` is Golden master; `building_E` is Golden support. A Kenney building is currently required as unchanged-source evidence but is not automatically Golden.

### World / Hex owner

Current `tools/world_atlas` remains the owner surface. Its current promoted source contains:
- Hex Realm S11/S12;
- measured `hex-grid.js`;
- Dungeon Generator S13.2;
- an existing public `/world-atlas/` surface.

Feature-parity docs explicitly show that several requested atlas data/preset capabilities remain partial/missing. The new Site must expose real status, not imply those gaps are already implemented.

### Recovery evidence boundary

The 2026-09-20 Hex failure handoff contains useful measurement/catalog evidence, including the edge atlas and part sheets, but its failed scene/Bauvorgaben work is not an authority for the new Site UI or composition.

### OSM/Hürth firewall

The current 2026-10-04 postmortem and source firewall are binding. The Site must not load or silently fall back to:
- `fixtures/huerth-b1-siblings-v0.json`
- `tools/osm-city-lab/`
- `elastic-grotesque-clay-huerth01`

Mechanism provenance can be documented separately; visible content is denied by default.

### “Data Generator”

Repository searches for literal:
- `Data Generator`
- `Data-Generator`
- `Daten Generator`
- `Daten-Generator`
- `Datengenerator`

returned no current named artifact.

Related exact sources do exist:
- Hex Terrain Generator v1 brief;
- Babel Hex Platform Generator brief/recovery;
- World Atlas Hex Realm;
- Dungeon Generator S13.2;
- R2C/R2D environment recipe work.

Work should resolve Georg's intended “Daten Generator” against those exact sources or another discovered named artifact before adding that label.

## Site precedent

KFB Production Control confirms the current Asset Librarian Site pattern:
- existing Asset Librarian Registry remains source owner;
- private ChatGPT Site may be a dedicated projection/work surface;
- GitHub contract/Return stays separate;
- no Cloudflare or Live replacement is implied by Site creation.

For this Site, the stricter current KFB workflow applies: the **human test/acceptance surface must additionally be the reserved direct Cloudflare Stage route**, linked from KFB Hub and opened at the exact revision before `PUBLIC_VERIFIED`.

## What has not been tested

- no Site implementation exists yet;
- no browser/WebGL Site route exists yet;
- no screenshots exist yet;
- no Cloudflare Stage exists yet;
- no ChatGPT Site URL exists yet;
- no Georg visual/catalog acceptance has occurred.

Those are Work execution gates, not Prep PASS claims.


## Scope correction · full Claude Design Environment Atlas corpus · 2026-10-04

Georg clarified that the Site must capture the whole useful **KayKit Environment Atlas** Claude Design project, not only Hex + Buildings.

### Third KayKit Hex source resolved

Exact source:
`media/3D_Assets/Kaykit_Medieval Snow Biome/`

Verified:
- source pin already used by R2D: `ab65e8c46ca3c07db4294214a63384975fb7d0d9`;
- license identifies `KayKit : Medieval Builder Pack Patreon Bonus (1.0)`;
- Models tree: 57 GLB + 21 FBX;
- 42 GLB are Hex tiles;
- 15 GLB are object/building/nature pieces.

This **replaces** the earlier prep statement that the third distinct KayKit Hex source was unresolved.

Current KayKit Hex-capable families:
1. Medieval Hexagon Pack;
2. Medieval Builder Pack;
3. Medieval Snow Biome / Builder Patreon Bonus.

Kenney `GLB_hexagon_kit` remains a separate fourth/secondary Hex family.

No dedicated Snow Biome Registry shard was found; Work must reconcile it through the normal central Registry/Librarian process or show `SOURCE_PROVEN / REGISTRY_PENDING`.

### Mandatory project modules added

The Site must explicitly carry:
- `KayKit_Hex_Realm_S11`;
- `KayKit_Hex_Tile_Model_S12`;
- `KayKit_Dungeon_Generator_S13_2`;
- `KayKit_Bits_Model_S14`;
- S15 Space Base;
- S16/S17 Restaurant/Furniture;
- S18/S19 Plant Prop + EyeRig;
- S20 Sample Atlas;
- S21 Room Study/editor;
- S22 wall-node/postmortem/editor line.

### Existing source coverage measured

Current GitHub already contains:

- World Atlas / reviewed S1–S13.2 intake;
- Plant Prop v2 export: **27 files**, actual S18/S19 runtime/modules/proofs;
- S20/S21 export: **17 files**;
- S22 lean handover: **26 files**.

Plant Prop source proof includes:
- `plant-eyes.js` blob `c14eb4b2a6cdde56bc18be1ab89a13793f2c4d95`;
- `plant-rig.js` blob `ed77c7cb4019bf54128e47ec4fcbad69c0d88995`;
- explicit adapter to existing KFB EyeRig v6, not a second eye owner.

### Recovery gap

Current later Housekeeping/Changelog documents S14–S17 as built/active, including exact measured behavior, but the actual runtime files are not directly present in the lean exports found in GitHub.

Most important missing source candidates:
- `KayKit_Bits_Model_S14.html`;
- `lib/bits-inventory.js`;
- S14 measurement probes;
- `KayKit_Space_Base_S15.html`;
- `lib/space-grid.js`;
- `KayKit_Restaurant_S16.html`;
- `lib/restaurant-grid.js`;
- `KayKit_Restaurant_S17.html`;
- `lib/restaurant-plan.js`.

Therefore a fresh **FULL PROJECT EXPORT WITH DOCS** is recommended.

The exact non-destructive export request is:
`FULL_PROJECT_EXPORT_REQUEST.md`.

Work may begin Site architecture from the existing source corpus, but final project-completeness acceptance must reconcile the new full export or explicitly preserve missing items as `RECOVERY_REQUIRED`.


## Full-corpus correction audit · 24/24 PASS

After the project-scope correction, a second static audit passed **24/24**.

Covered:
- current `SOURCE_MAP.json` parses;
- exactly three KayKit Hex-capable families are represented;
- one separate Kenney Hex family;
- Snow Biome is `REGISTRY_PENDING`, not falsely claimed indexed;
- Work brief carries the full Claude Design corpus scope;
- S11/S12/S13.2 are explicit mandatory modules;
- Plant/EyeRig is explicit;
- Snow Models tree = 57 GLB;
- Snow Hex GLB = 42;
- Snow object/building/nature GLB = 15;
- Snow license identity = Medieval Builder Pack Patreon Bonus 1.0;
- current Registry index has no Snow Biome shard;
- exact S11 blob pin matches;
- exact S12 blob pin matches;
- exact S13.2 blob pin matches;
- Plant Prop export = 27 files;
- S20/S21 export = 17 files;
- S22 lean handover = 26 files;
- `plant-eyes.js` exact blob matches;
- `plant-eyes.js` explicitly reuses existing EyeRig v6;
- `plant-rig.js` exact blob matches;
- direct S14/S15/S16/S17 pages are absent at the expected promoted World Atlas paths, confirming the recovery gap;
- `PROJECT_CORPUS_AUDIT.md` exists;
- `FULL_PROJECT_EXPORT_REQUEST.md` exists.

This audit replaces the earlier third-KayKit identity uncertainty. It does not claim that the missing S14–S17 runtime files have been recovered yet.
