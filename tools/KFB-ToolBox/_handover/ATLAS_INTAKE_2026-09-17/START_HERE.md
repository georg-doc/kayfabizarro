# KFB ToolBox · Atlas Intake · 2026-09-17

**Status:** REVIEWED INTAKE · SOURCE PRESERVED · SITE PROMOTION MERGED · PUBLIC BROWSER QA PENDING  
**Repository:** `georg-doc/kayfabizarro`  
**Intake checkpoint:** `8948a06b75cb18c970599afb29b6a772315fad0e` (`Add files via upload`)  
**Scope:** Resident Atlas + Environment / Kit Lab exports now present under `tools/KFB-ToolBox/_inbox/`.

This is an intake/recovery checkpoint. It does not turn either export into a new runtime owner and does not grant Travel, Town, Race or Combat L5.

---

## 1 · Governing decisions

1. **Preserve the uploaded exports byte-for-byte at their current inbox paths.** Do not silently rewrite them in place during promotion.
2. **All runtime 3D assets come from GitHub whenever they already exist there.** Canonical asset home: `georg-doc/kayfabizarro/media/3D_Assets/`.
3. A promoted browser site should use **repo + exact path + pinned revision**, not an unversioned `main` URL where a fixed revision is available.
4. Do not copy existing GitHub assets into a second Atlas asset store merely for packaging. New asset bytes only need review when no GitHub source exists.
5. Atlas/Kit Lab remains an authoring, measurement and candidate-recipe producer. Registry/Librarian remains source/provenance owner. Travel/other consumers retain runtime and acceptance ownership.
6. No terminal work is delegated to Georg. The eventual promoted sites must be directly usable in the browser through the existing GitHub/Cloudflare publication path.

---

# 2 · SOURCE · Resident Atlas S6

**Path:**

`tools/KFB-ToolBox/_inbox/KayKit Resident Atlas/`

**Tree:** `9eec956e9c8b3dc9f22ce50f5248e1ad33d10adc`

### Delivered

- `KFB_Resident_Atlas_S6.html` plus S5 and earlier sample pages;
- full local code/data tree (`lib/`, `data/`, `scenes/`, `tools/`, registry snapshot);
- `EXPORT_MANIFEST.json`, checksums, recovery/docs and screenshots;
- 21 resident recipes plus Ensemble;
- 119 asset references;
- actor + habitat + signature-prop composition data;
- pose/motion audition, attachment logic, Studio correction/export support.

### Export-reported status

`PORTABLE_EXPORT_COMPLETE (online-portabel)`.

This classification means the source is complete for the architecture chosen by the author: model assets are intentionally loaded from GitHub rather than duplicated into the export. It does **not** mean Travel acceptance or offline operation.

### Export-reported test evidence

The included `docs/TEST_REPORT.md` reports, in the Claude Design project environment:

- project-directory start PASS with 21 residents + Ensemble available;
- tested resident switching and Ensemble PASS;
- several measured prop/hand/contact checks;
- HTTP start from a freshly unpacked export NOT_RUN;
- systematic all-21 asset Soll/Ist run not completed;
- mobile and deployment-subpath tests NOT_RUN;
- Studio-patch import does not exist.

These are **source-export test claims**, preserved as evidence; this intake did not independently rerun the browser scene.

### Asset rule / pins

The export already follows the GitHub-first rule and records multiple asset pins. One explicit exception remains in `data/cast.js` / `EXPORT_MANIFEST.json`:

- `KayKit_Mixed_Bag_1_FREE` currently uses `main`.

The actual Mixed Bag GitHub asset path exists at intake commit `8948a06b75cb18c970599afb29b6a772315fad0e`. Promotion can therefore pin this exception without inventing or copying assets.

### A0 status

The export has real equivalents for `AssetRef`, relative placement / TransformSlot-like data and a Resident/RecipeEnvelope-like record, but its own `RECIPE_MAPPING_A0.md` correctly records unresolved seams. In particular, resident hand/attachment mechanics must not be silently flattened into a different shared schema and Animation Lab keeps compatibility ownership.

**Promotion maturity:** candidate L3/L4 source material; no consumer L5 from this intake.

---

# 3 · SOURCE · Environment Atlas / KFB Kit Lab

**Path:**

`tools/KFB-ToolBox/_inbox/KayKit Environment Atlas/KFB_World_Atlas_v1_EXPORT_2026-09-17/`

**Tree:** `30372423346a2fda30399bf1a791a27f8bb75206`

**Export revision:** `2026-09-17-r1`

### Naming distinction

Keep these names distinct:

- Claude Design title: `KayKit Atlas Preflight Access`;
- code self-name: `KFB Kit Lab`;
- export/briefing name: `KFB_World_Atlas_v1`.

The export itself explicitly says they are **not yet semantically equivalent**. Do not call the current Kit Lab a finished World Atlas merely because it arrived under that export name.

### Delivered · 15 browser pages

The manifest contains:

1. Dungeon Room S1
2. Kenney City Block S2
3. Racing Track S3
4. Racing Setup S3b
5. KayKit City Sample S4
6. Road Network S5
7. Forest Clearing S6
8. Tools Workshop S7
9. Chess S8
10. Domino S9
11. Cards + Hourglass S10
12. Hex Realm S11
13. Hex Tile Model S12
14. Dungeon Model S13
15. **Dungeon Generator S13.2**

Shared reusable modules include:

- `lib/hex-grid.js`
- `lib/dungeon-grid.js`
- `lib/dungeon-light.js`
- `lib/road-solver.js`
- `lib/track-chain.js`
- `lib/kit-lab.js`
- `lib/props-lab.js`

Eleven separate measurement/probe pages are also included.

---

## 3.1 · Hex / terrain-kit value

`hex-grid.js` is not merely a screenshot mockup. It contains a measured pointy-top hex model and a single `TILE_EDGES` truth table for grass / sand-road / water-river/coast edge classes. Connection masks, rotation and coast solving are derived from that table.

The export reports:

- 87 Hex parts loaded/measured;
- 18 measured edge strings reconciled between pixel scan and geometry;
- 33/33 tested chain joints and 204/204 coast edges after axis correction;
- complete road edge-set coverage for the KayKit road tiles;
- explicit limitations for coast and river source shapes.

This is strong donor material for a future World Atlas grammar. It is **not yet** a saved landmark/terrain recipe library, and the export correctly says that castle/mine presets and the three Travel presentation variants do not yet exist as implemented data.

### Three Travel variants remain a product test, not source truth

Still to be evaluated in the Travel consumer:

1. visible hex base;
2. terrain-seated / visually integrated hex base;
3. hidden/no visible base while keeping buildings/props/path composition.

No variant is promoted by this intake.

---

## 3.2 · Dungeon Generator S13.2

This is currently the strongest reusable Environment donor in the export.

The generator is graph/grid based: cells are nodes and seams are canonical edges carrying the actual boundary class. The implementation deliberately measures real KayKit geometry rather than typing model dimensions into the generator.

The included A0 mapping / test report records:

- seeded BSP generation;
- two levels;
- variable field size and density;
- door / gate / rail / solid/open seam semantics;
- measured doorway opening and stair hub;
- recipe JSON export;
- light system / level masking;
- plan/SVG representation;
- 108 generated layouts in the export's project tests with 0 reported structural failures for the tested conditions.

Important boundaries:

- recipe **import** is not implemented;
- props dressing is not implemented in S13.2;
- actor walkability, wall collision and floor ownership are not implemented;
- no Travel integration / L5;
- no GPU-instancing claim and no gameplay-instance runtime exists here.

Therefore the correct next proof is not "build the full dungeon game". It is one consumer slice later: entrance → one reproducible generated room/corridor set → explicit support/wall/door semantics → actor can enter and return.

---

# 4 · ASSET SOURCE VERIFICATION · intake

The Environment export intentionally loads assets from GitHub, but its current runtime base is an unpinned `main` Raw URL. That is a real portability/provenance weakness, already documented by the export.

During this intake the following canonical source paths were directly resolved at commit:

`8948a06b75cb18c970599afb29b6a772315fad0e`

- `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/`
- `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/`
- `media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/`

This establishes a safe **promotion pin candidate** for those existing GitHub assets. It does not rewrite the original export.

Do not interpret this three-path verification as a fresh audit of every asset path in either export. The complete manifests remain the source inventories and further promotion checks should resolve all runtime refs.

---

# 5 · KFB ProceduralTerrain Concept

`tools/KFB-ToolBox/_inbox/KFB ProceduralTerrain Concept/` currently contains four screenshots only.

Classification:

`REFERENCE / LOOK-DIRECTION ONLY`

There is no source code, terrain algorithm or reusable runtime in that folder. It may inform visual direction, but must not be described as an implemented terrain donor.

---

# 6 · DECISION · promotion order

Promote additively; do not replace inbox truth.

### P1 · Resident Atlas browser candidate

- retain existing `tools/resident_atlas/` implementation;
- introduce S6 as a separately identifiable candidate/revision first;
- **PROMOTION DELTA IMPLEMENTED:** pin the remaining Mixed-Bag runtime reference to `8948a06b75cb18c970599afb29b6a772315fad0e` in the promoted copy;
- preserve all 21 resident recipes and evidence/open notes;
- expose a direct browser route through the existing site publication path;
- browser QA before making S6 the default Resident Atlas experience.

### P2 · Environment / Kit Lab browser candidate

- create a dedicated `tools/world_atlas/` browser surface rather than nesting the full Lab into Travel;
- preserve the complete S1–S13.2 source as provenance/history;
- give the normal landing page focused entry points for **Hex**, **Road/Forest/Terrain kits**, **Dungeon Model**, **Dungeon Generator** and measurements;
- **PROMOTION DELTA IMPLEMENTED:** pin the normal runtime asset base and S10 GitHub dependencies to `8948a06b75cb18c970599afb29b6a772315fad0e` in the promoted copy;
- do not claim World Atlas feature parity for castle/mine/landmark recipes that are not in this source.

### P3 · Travel consumer proof

After browser candidates work:

- select one Resident recipe + one Environment/Hex composition;
- import as candidate data into the existing Travel Ground world;
- compare visible / seated / hidden hex-base variants;
- save/reload;
- walk from organic Travel terrain into the authored set;
- only then feed corrections back into Atlas data.

### P4 · Dungeon consumer proof later

One deterministic seed, one small generated set, explicit door/stair/support/wall behavior. Keep generation and runtime collision/support ownership separate.

---

# 7 · Status matrix

| Area | Status now |
|---|---|
| Resident S6 files | **RECEIVED / REVIEWED INTAKE** |
| Resident source/data | **PRESENT** |
| Resident GitHub-first assets | **YES**; promoted runtime Mixed Bag pin = `8948a06b75cb18c970599afb29b6a772315fad0e` while Intake remains unchanged |
| Resident public promoted site | **IMPLEMENTATION CANDIDATE · PR #48 MERGED / browser QA pending** |
| Environment Kit Lab files | **RECEIVED / REVIEWED INTAKE** |
| Dungeon Generator S13.2 | **SOURCE PRESENT / export-reported project tests preserved** |
| Hex grammar | **SOURCE PRESENT / L4 donor candidate** |
| World Atlas landmark presets | **NOT PRESENT in this export** |
| Environment runtime asset pins | **IMPLEMENTED in promoted runtime** at `8948a06b75cb18c970599afb29b6a772315fad0e` for central asset base + S10 GitHub refs |
| Candidate site promotion | **MERGED** · `5c85b09db6406f3be889aa783542670020e6a62a` |
| Travel integration | **NOT IMPLEMENTED by this intake** |
| Consumer L5 | **NONE** |
| Georg visual/gameplay acceptance | **PENDING** |

---

# 8 · Recovery

Read in this order:

1. this file;
2. `../../_inbox/KayKit Resident Atlas/START_HERE.md`;
3. `../../_inbox/KayKit Resident Atlas/docs/FEATURE_PARITY.md`;
4. `../../_inbox/KayKit Environment Atlas/KFB_World_Atlas_v1_EXPORT_2026-09-17/README.md`;
5. `../../_inbox/KayKit Environment Atlas/KFB_World_Atlas_v1_EXPORT_2026-09-17/docs/FEATURE_PARITY.md`;
6. `../../_inbox/KayKit Environment Atlas/KFB_World_Atlas_v1_EXPORT_2026-09-17/docs/RECIPE_MAPPING_A0.md`;
7. central `skills/chat/masterplan/KFB_ASSEMBLY_CONTRACT_A0_2026-09-17.md`;
8. Travel's current `ATLAS_PORTABILITY_SPRINT_2026-09-17.md` before any consumer integration.

## Site promotion return · 2026-09-17

PR #48 merged at `5c85b09db6406f3be889aa783542670020e6a62a` and promotes the complete reviewed trees additively to:

- `tools/resident_atlas_s6/` with stable alias `/resident-atlas-s6/`;
- `tools/world_atlas/` with stable alias `/world-atlas/` and a focused launcher.

Static identity check: six representative source→promotion file pairs have identical Git blob SHAs: Resident S6 HTML, Resident `data/cast.js`, Dungeon Generator S13.2 HTML, `hex-grid.js`, `dungeon-grid.js`, and Environment `EXPORT_MANIFEST.json`.

No Inbox source file was changed. No Travel runtime file was changed. Public browser QA is still pending. The promoted runtime copies now pin the normal GitHub asset bases and S10/Mixed-Bag runtime references to `8948a06b75cb18c970599afb29b6a772315fad0e`; the original inbox exports remain unchanged.

## Additive history

2026-09-17 · Georg uploaded the first complete Resident and Environment/Kit Lab exports. Intake verified their repository structure and representative canonical GitHub asset paths. No source export was rewritten, no runtime owner moved, and no consumer acceptance was inferred.
