# KFB Environment Atlas · Project Corpus Audit

Status: **CURRENT PREP EVIDENCE · FULL PROJECT CAPTURE REQUIRED**
Date: 2026-10-04
Workflow: `KFB-ENVIRONMENT-ATLAS-SITE-01`

## Purpose

The Environment Atlas Site must not be reduced to Hex + Buildings.

The intended source is the **full useful lineage of the Claude Design project "KayKit Environment Atlas"**: its measured models, generators, compatibility work, Plant/EyeRig work, room studies, editor work, postmortems and reusable rules.

The Site is a projection/catalog/knowledge surface over those sources. It does not become a second runtime owner.

## Current source corpus already present in GitHub

### A · World Atlas / early project line · S1 through S13.2

Canonical promoted owner:
`tools/world_atlas/`

Original reviewed intake:
`tools/KFB-ToolBox/_inbox/KayKit Environment Atlas/KFB_World_Atlas_v1_EXPORT_2026-09-17/`

Important current files include:
- `KayKit_Hex_Realm_S11.html`
- `KayKit_Hex_Tile_Model_S12.html`
- `KayKit_Dungeon_Model_S13.html`
- `KayKit_Dungeon_Generator_S13_2.html`
- `lib/hex-grid.js`
- `lib/dungeon-grid.js`
- `lib/dungeon-light.js`
- `scenes/hex-realm.js`
- measurement/probe tools and additive docs.

This line also carries earlier still-useful donors:
- S2 Kenney City Block;
- S3 / S3b Racing;
- S4 KayKit City Sample;
- S5 Road Network;
- S6 Forest Clearing;
- S7 Tools Workshop;
- S8 Chess;
- S9 Domino;
- S10 Cards/Hourglass.

Their status must come from current Housekeeping/Changelog rather than being assumed current just because a file exists.

## Mandatory S11 → S13.2 knowledge

### S11 · KayKit Hex Realm

`tools/world_atlas/source/KayKit_Hex_Realm_S11.html`
blob `682683184be931b4058a0acaf27c34a6c6e69a80`

This is not merely a pretty island screenshot.

The S11 line contains:
- pack inventory and palette;
- measured pointy-top 2.0 × 2.309 grid;
- odd-r layout;
- tile top y = 0;
- source-separated terrain/buildings/nature/props;
- road / river / coast solver evolution;
- actual edge-fit / on-land / fixed-plateau audit lessons;
- explicit absence of unsupported bridge/farm/wall pieces rather than substitute geometry.

The Site must expose both the visual S11 realm and its measured rules/provenance.

### S12 · KayKit Hex Tile Model

`tools/world_atlas/source/KayKit_Hex_Tile_Model_S12.html`
blob `413ad691baa1680256401e707c2c265481b29c01`

S12 is a mandatory mental-model / counterproof surface.

It preserves:
- `TILE_EDGES` as the one tile-edge truth;
- the z-mirroring failure and correction;
- geometry-based axis truth via `truth-hex-axes.html`;
- independent pixelscan vs geometry verification;
- rotation direction;
- road / river / coast edge classes;
- the buildability limits that follow from available coast tiles.

Do not collapse S12 into a generic connector table.

### S13.2 · Dungeon Generator

`tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html`
blob `ac8a546fd28eb1cc1348153e1423b9a1bb95f7fa`

S13.2 remains the existing Dungeon generator owner/donor.

It must be represented together with:
- `lib/dungeon-grid.js`;
- `lib/dungeon-light.js`;
- cell-vs-seam/fuge grammar;
- BSP / two-level logic;
- stairs-first / wall-joint rules;
- lighting/readability evidence;
- S13.3 / S13.4 additions where preserved in later project docs.

The Environment Atlas Site may inspect, explain and launch this generator. It must not fork it.

## Snow Biome · corrected third KayKit Hex family

User-provided exact source:
`media/3D_Assets/Kaykit_Medieval Snow Biome/`

Current source proof:
- source pin already consumed by R2D: `ab65e8c46ca3c07db4294214a63384975fb7d0d9`;
- `License.txt` blob `1019e43f05b4dce92a7a97de949f6072d820ff7e`;
- license identity: **KayKit : Medieval Builder Pack Patreon Bonus (1.0)**;
- Models tree contains **57 GLB** + **21 FBX**;
- the GLB payload splits into **42 Hex tile GLBs** + **15 object/building/nature GLBs**;
- examples: `hex_snow`, road A–M plus detail variants, transition A/B, water A–D variants, `castle_snow`, `house_snow`, `detail_forestA_snow`, `mountain_snow`.

Therefore the three KayKit Hex-capable source families are now:

1. KayKit Medieval Hexagon Pack;
2. KayKit Medieval Builder Pack;
3. KayKit Medieval Snow Biome / Medieval Builder Pack Patreon Bonus.

Kenney `GLB_hexagon_kit` remains a separate secondary Hex family, not the third KayKit pack.

Current Registry search returns **no dedicated Snow Biome shard**. Work must reconcile/index this existing exact repository source into the central Registry/Librarian path or expose it as explicitly `SOURCE_PROVEN / REGISTRY_PENDING` until the normal registry process completes. Do not create a second catalog.

## S14–S17 · documented as active, runtime source currently incomplete in GitHub corpus

Current later Housekeeping marks these as ACTIVE and the Changelog contains detailed measured behavior:

### S14 · Bits Model

Expected source set:
- `KayKit_Bits_Model_S14.html`;
- `lib/bits-inventory.js`;
- `tools/list-pack-files.html`;
- `tools/measure-bits-packs.html`;
- `tools/heightmap-bits.html`;
- `tools/probe-corners-compat.html`;
- `tools/probe-space-links.html`.

Documented result:
- Space Base Bits: 57 parts;
- Restaurant Bits: 144 parts;
- Furniture Bits: 53 parts;
- total inventory: **254**, all loaded/measured in that project run;
- compatibility matrix across Dungeon / Restaurant / Space Base / City Builder.

The actual S14 runtime page and modules are **not directly present in the currently found lean exports**.

### S15 · Space Base

Expected:
- `KayKit_Space_Base_S15.html`;
- `lib/space-grid.js`.

Documented measured logic includes:
- two terrain levels;
- edge/ramp solver;
- 2-unit subgrid;
- horizontal tube connectivity;
- footprint-aware collision;
- support/contact rules.

Actual runtime source is not directly present in the currently found lean exports.

### S16 · Restaurant + Furniture

Expected:
- `KayKit_Restaurant_S16.html`;
- `lib/restaurant-grid.js`.

Documented logic includes:
- seam/fuge shell;
- half-module work band;
- Furniture anchor classes;
- Restaurant ↔ Dungeon shell crossover;
- measured wall/contact rules.

Actual runtime source is not directly present in the currently found lean exports.

### S17 · Restaurant placement grammar

Expected:
- `KayKit_Restaurant_S17.html`;
- `lib/restaurant-plan.js`.

S17 replaces footprint-only placement with:
- anchors;
- directed carrier/surface relations;
- circulation zones;
- path-first placement;
- explicit support and accessibility gates.

Actual runtime source is not directly present in the currently found lean exports.

**Rule:** Work must not reconstruct S14–S17 from the Changelog. The full project export is the preferred source recovery.

## S18 / S19 · Plant Prop Lab + EyeRig · source present

Current complete export:
`tools/KFB-ToolBox/_inbox/KFB_Plant_Prop_Lab_v1/KFB_Plant_Prop_Lab_v2_EXPORT_2026-09-19/KFB_Plant_Prop_Lab_v2/`

Revision:
`2026-09-19-r2`

The export has 27 files and intentionally contains no copied canonical models.

Actual runtime/modules present:
- `index.html`;
- `src/plant-inventory.js`;
- `src/plant-recipe.js`;
- `src/plant-pattern.js`;
- `src/plant-rig.js`;
- `src/plant-eyes.js`;
- `src/plant-light.js`;
- shared `src/kit-lab.js`;
- proof images and docs.

### EyeRig Plants are mandatory project knowledge

`src/plant-eyes.js`
blob `c14eb4b2a6cdde56bc18be1ab89a13793f2c4d95`

It is explicitly an adapter onto existing KFB EyeRig v6, **not a second eye system**.

It preserves critical learned rules:
- measured FaceHost required because foliage is not a reliable face surface;
- host may not be `visible=false` because EyeRig is its child;
- invisible host must not cast shadows;
- pot/crown/float placements are separate;
- EyeRig + emote contract are loaded from the existing rig owner.

`src/plant-rig.js`
blob `ed77c7cb4019bf54128e47ec4fcbad69c0d88995`

It owns only internal prop pivots / squash / sway / wind / awareness. It explicitly does **not** own world transform or collision.

The Site must expose Plant Prop as a reusable environment module family with its recipe, animation levels and EyeRig dependency, not bury it under generic props.

## S20 / S21 · source present

Current export:
`tools/KFB-ToolBox/_inbox/KayKit Environment Atlas + Dungeon Generator + 3D scene editor TOOL (5)/KFB_Dungeon_RoomStudy_S21_EXPORT_2026-09-20/`

Files include:
- `KayKit_Sample_Atlas_S20.html`;
- `KayKit_Room_Study_S21.html`;
- sample map;
- room recipes;
- dungeon grid/light;
- room FX;
- editor contract/docs.

S20 maps Dungeon promo/reference images against actual registered parts.

S21 is a room-study / authoring consumer, not a new dungeon generator. Its in-scene editor work is a donor for the shared Toolbox editor path.

## S22 · lean source / docs present

Current handover:
`tools/KFB-ToolBox/_inbox/KayKit_Room_Study_S21/S22_RoomStudy_Handover/`

26-file lean handover with:
- current Room Study;
- wall-node probe;
- room recipes;
- wall-node / mental-model docs;
- R08 failure postmortem;
- editor-toolbox direction.

S22's R08 is explicitly a failed room attempt. The failure rules are project knowledge; R08 itself is not an accepted room.

## Current completeness conclusion

GitHub already contains enough to start Site architecture and to avoid rediscovery.

However, the corpus is **split across several exports** and is not complete as one source snapshot.

Most important missing direct runtime sources are S14–S17.

Therefore a fresh **FULL PROJECT EXPORT WITH DOCS** from the current Claude Design project is recommended and becomes an additive source-recovery input for PR #353.

The export is not permission to overwrite newer GitHub sources. Work compares exact files/status first and imports only missing/newer project source.
