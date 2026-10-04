# RETURN · KFB Environment Atlas Site 01 · full-project preparation

Status: **READY FOR WORK IMPLEMENTATION · FULL PROJECT CORPUS SCOPE · DRAFT PR · NO SITE/STAGE YET**
Date: 2026-10-04
Workflow: `KFB-ENVIRONMENT-ATLAS-SITE-01`

## Exact Git state

- Repo: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/kfb-environment-atlas-site-prep-2026-10-04`
- Draft PR: **#353**
- Base: `main@9c2fee62b815f19cf967867f54985bd22e3f222b`
- Branch head immediately before this Return update: `7ecd62a89f24e3e2138dce232be58bf3250bcdad`
- Merge: **NOT PERFORMED**
- Live promotion: **NOT PERFORMED**

## Current outcome

The prepared Work assignment now covers the **full useful Claude Design project lineage "KayKit Environment Atlas"**, not only Hex + Buildings.

Existing owners remain singular:
- Environment/Hex: `tools/world_atlas`;
- asset truth: `registry/assets/v1` + Asset Librarian;
- Clay style: current Clay Style SSOT;
- game/world runtime: receiving WorldBuilder/WB2 owner, not this Site;
- EyeRig: existing KFB EyeRig owner; Plant Prop only adapts to it.

The Site is a catalog / project-corpus / visual-SSOT / provenance surface. It must not become another world runtime, generator owner, asset library or EyeRig.

## Corrected Hex source truth

Georg supplied the exact missing third KayKit source:

`media/3D_Assets/Kaykit_Medieval Snow Biome/`

Source proof:
- R2D pin: `ab65e8c46ca3c07db4294214a63384975fb7d0d9`;
- license blob: `1019e43f05b4dce92a7a97de949f6072d820ff7e`;
- license identity: **KayKit : Medieval Builder Pack Patreon Bonus (1.0)**;
- Models: **57 GLB + 21 FBX**;
- GLB split: **42 Hex tiles + 15 object/building/nature assets**.

The three KayKit Hex-capable families are therefore:

1. KayKit Medieval Hexagon Pack;
2. KayKit Medieval Builder Pack;
3. KayKit Medieval Snow Biome / Medieval Builder Pack Patreon Bonus.

Kenney `GLB_hexagon_kit` remains an additional, separate secondary Hex family and must stay deduplicated from the `kenney_hexagon-kit` alias.

No current Snow Biome Registry shard exists. Work must reconcile the existing exact source through the normal Registry/Librarian path or show it as `SOURCE_PROVEN / REGISTRY_PENDING`.

## Mandatory Environment Atlas project modules

These are explicitly in scope:

- S11 `KayKit_Hex_Realm_S11`;
- S12 `KayKit_Hex_Tile_Model_S12`;
- S13 / S13.2+ Dungeon model/generator/light/props;
- S14 `KayKit_Bits_Model_S14`;
- S15 Space Base;
- S16 Restaurant/Furniture;
- S17 Restaurant placement grammar;
- S18/S19 Plant Prop + EyeRig;
- S20 Sample Atlas;
- S21 Room Study + inline editor donor;
- S22 wall nodes / room study / failure postmortems / editor-toolbox direction;
- earlier useful active/frozen project donors according to current Housekeeping rather than file age.

S11/S12/S13.2 are mandatory visible project modules, not merely hidden code dependencies.

## Existing corpus already recovered

### S1–S13.2
Reviewed World Atlas intake and promoted owner:
`tools/world_atlas/`
plus
`tools/KFB-ToolBox/_inbox/KayKit Environment Atlas/KFB_World_Atlas_v1_EXPORT_2026-09-17/`

### S18/S19 Plant Prop
Actual 27-file runtime export:
`tools/KFB-ToolBox/_inbox/KFB_Plant_Prop_Lab_v1/KFB_Plant_Prop_Lab_v2_EXPORT_2026-09-19/KFB_Plant_Prop_Lab_v2/`

Important exact modules:
- `plant-eyes.js` blob `c14eb4b2a6cdde56bc18be1ab89a13793f2c4d95`;
- `plant-rig.js` blob `ed77c7cb4019bf54128e47ec4fcbad69c0d88995`.

`plant-eyes.js` explicitly adapts to existing KFB `pet-eye-rig.v6.js`; it is not a second eye system.

### S20/S21
17-file export:
`tools/KFB-ToolBox/_inbox/KayKit Environment Atlas + Dungeon Generator + 3D scene editor TOOL (5)/KFB_Dungeon_RoomStudy_S21_EXPORT_2026-09-20/`

### S22
26-file lean handover:
`tools/KFB-ToolBox/_inbox/KayKit_Room_Study_S21/S22_RoomStudy_Handover/`

## Recovery gap · S14–S17

Current Housekeeping and Changelog document S14–S17 as built/active and preserve detailed measured behavior, but their actual runtime pages/modules were not found in the current lean exports.

Recovery-required source includes, if still present in the Claude Design project:
- `KayKit_Bits_Model_S14.html`;
- `lib/bits-inventory.js`;
- S14 measurement probes;
- `KayKit_Space_Base_S15.html`;
- `lib/space-grid.js`;
- `KayKit_Restaurant_S16.html`;
- `lib/restaurant-grid.js`;
- `KayKit_Restaurant_S17.html`;
- `lib/restaurant-plan.js`.

**Do not reconstruct these runtimes from Changelog prose.**

A precise full-project ZIP request is prepared in:
`FULL_PROJECT_EXPORT_REQUEST.md`.

The export is additive recovery only: compare exact source/status before importing and do not overwrite newer canonical GitHub source merely because it appears in the ZIP.

## Prepared files

Workflow folder:
1. `WORK_BRIEF.md`
2. `SOURCE_MAP.json`
3. `PROJECT_CORPUS_AUDIT.md`
4. `FULL_PROJECT_EXPORT_REQUEST.md`
5. `PREP_EVIDENCE.md`
6. this `RETURN.md`

Central discovery metadata:
7. `skills/chat/START_HERE.md`
8. `skills/chat/REGISTRY.json`
9. `skills/chat/CHANGELOG.md`
10. `kfb-hub/index.html`

## Tests / evidence

Original preparation audit: **22/22 PASS**.

Final pre-scope handoff verification: **15/15 PASS**.

Full-project correction audit: **24/24 PASS**.

The 24-pass correction audit verifies:
- exactly three source-proven KayKit Hex families;
- separate Kenney Hex family;
- Snow 57 GLB / 42 Hex / 15 objects and exact license identity;
- absence of a current Snow Registry shard;
- exact S11/S12/S13.2 source pins;
- Plant Prop 27-file export;
- S20/S21 17-file export;
- S22 26-file lean handover;
- exact Plant EyeRig adapter + Plant rig blobs;
- expected direct S14/S15/S16/S17 promoted-source recovery gap;
- corpus audit and export request presence.

## Clay visual SSOT

Current Clay Style SSOT and Golden Matrix remain branch-local on `work/clay-style-ssot-2026-10-01`, not on main.

Building evidence layout remains:

`UNCHANGED SOURCE | LOCKED GOLDEN | CURRENT CANDIDATE | CONTACT/EDGE CLOSE-UP | COST`

- `building_A` = Golden master;
- `building_E` = Golden support;
- Kenney/source families remain source evidence until explicitly promoted;
- no universal torsion angle is accepted KFB truth.

## Visible-source firewall

The 2026-10-04 MVP source firewall remains binding.

The Site must not silently load/fallback to:
- `fixtures/huerth-b1-siblings-v0.json`;
- `tools/osm-city-lab/`;
- `elastic-grotesque-clay-huerth01`.

Missing source means `SOURCE_REQUIRED` / `RECOVERY_REQUIRED`, not Legacy OSM or a generic substitute.

## "Data Generator" label

No exact current artifact was found under the literal names `Data Generator` / `Daten-Generator`.

The full-project corpus now gives Work the correct source set against which to resolve that phrase. Do not invent a new owner to satisfy the name.

## Reserved routes

- Human Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/environment-atlas-site/` — **NOT DEPLOYED**
- Existing public World Atlas: `https://kayfabizarro.pages.dev/world-atlas/` — protected / unchanged
- ChatGPT Site: **NOT CREATED**; record the actual URL only after Work creates it

## Unresolved items

1. S14–S17 actual runtime source recovery from the full Claude Design project export.
2. Snow Biome central Registry/Librarian reconciliation.
3. Exact source identity behind Georg's phrase “Daten Generator”, if it is not one of the now-mapped project modules.
4. Clay SSOT is current on its source branch/PR rather than main.
5. Site implementation/browser evidence does not exist yet by design.

## One next gate

**FULL PROJECT EXPORT RECOVERY + WORK EXECUTION ON PR #353**

The full export may be supplied before or during Work. Work continues this exact branch/PR, reconciles missing project source without rebuilding it, builds one Site outcome, creates the actual ChatGPT Site, publishes/opens the reserved direct Cloudflare Stage, updates Return/changelog/router/Hub, then hands Georg exactly one **VISUAL / CATALOG / PROJECT-COMPLETENESS** review gate.

No auto-merge. No Live promotion.
