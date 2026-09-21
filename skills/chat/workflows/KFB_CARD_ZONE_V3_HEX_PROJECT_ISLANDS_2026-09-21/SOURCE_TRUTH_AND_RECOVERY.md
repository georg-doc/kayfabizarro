# SOURCE TRUTH + RECOVERY · Card Zone v3 / Hex Project Islands

Status: **CURRENT SOURCE CORRECTION · SUPERSEDES BENCH-AS-FOUNDATION ASSUMPTION**  
Date: 2026-09-21

## 1 · Product-level correction

The local shader post-mortem in ToolBox Bench v1.1 is useful but incomplete.

It correctly explains one local regression:
- fluid shader was rewritten instead of copied;
- dead source foam was accidentally enabled;
- source water textures were omitted;
- basin material was replaced.

It does **not** explain the larger product regression:

> The ToolBox Bench extraction stopped being the working **Card Zone Lab** and became a reduced module bench.

Therefore:

| Source | Current status | Use |
|---|---|---|
| KFB Card Zone Lab v2 + Zonen Registry | **WORKING DONOR / PRODUCT BASELINE** | copy/adapt from here |
| ToolBox Bench v1 | **ARCHIVED_FAILED_EXTRACTION** | failure evidence / candidate snippets only |
| ToolBox Bench v1.1 | **USER_REJECTED FAILED EXTRACTION · LOCAL SHADER FIX ONLY** | failure evidence / candidate snippets only |
| shader post-mortem | **VALID BUT PARTIAL** | keep its source-copy lesson; not the full product post-mortem |
| old Fluid/Card/Voxel consolidation brief | **QUALIFIED BY THIS RECOVERY** | candidate-module audit only; not v3 foundation |

No Bench module becomes canonical merely because it was extracted or measured.

## 2 · Working donor · KFB Card Zone Lab v2

Exact source:

- [Card Zone Lab v2 source](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/card-zone-lab-v3/KFB%20Card%20Zone%20Lab%20v2.dc.html)
- current observed blob: `43eea82f8727d3581e50374d6263e48a28241d3b`
- observed size: **144,800 bytes**

Supporting system:

- [Card Zone / Registry README](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/card-zone-lab-v3/README.md)
- [KFB Zonen Registry](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/card-zone-lab-v3/KFB%20Zonen-Registry.dc.html)
- [zone-registry.json](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/card-zone-lab-v3/zone-registry.json)
- [zone-index.json](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/card-zone-lab-v3/zone-index.json)
- [v2 handover](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/card-zone-lab-v3/docs/HANDOVER_card-zone-lab_v2_2026-07-26.md)
- [Card Zone housekeeping/status](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/card-zone-lab-v3/docs/HOUSEKEEPING.md)
- `terrain-v10/`
- `cardbuilder/`
- `kfb-box-material.js`
- `kfb-ink-outline.js`

Documented working v2 behavior includes:
- 16×9 Card Zone plateau;
- D6 terrain steps;
- water moat;
- water / oil / acid / bubblegum / slag modes;
- zone puddles/channels;
- river/narrative-flow seam;
- six-face Card Cube;
- Face Focus;
- real card/deck reveal;
- sky-card / projection language;
- card seed → story mode / palette / fill / wear / texture / moat width;
- bubbles and optional drone;
- Registry handoff.

The v2 water/shore rules are hard-won implementation facts and must not be re-derived casually.

## 3 · Failed extraction · Bench v1 / v1.1

### v1.1

- [folder](https://github.com/georg-doc/kayfabizarro/tree/main/tools/KFB-ToolBox/_inbox/kfb-toolbox-v1.1)
- `KFB ToolBox Bench.dc.html` observed size: **22,957 bytes**
- [v1.1 README](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/kfb-toolbox-v1.1/README.md)
- [partial shader post-mortem](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/kfb-toolbox-v1.1/tools/KFB-ToolBox/POSTMORTEM_2026-09-21_SHADER.md)

### v1

- [folder](https://github.com/georg-doc/kayfabizarro/tree/main/tools/KFB-ToolBox/_inbox/KFB%20ToolBox%20Bench%20v1%20-%20KFB%20Voxel%20Card%20Zone%20Lab%202%20-%20Hex%20Assets%20Worldbuilding/kfb-toolbox-v1)
- `KFB ToolBox Bench.dc.html` observed size: **22,428 bytes**
- [handover](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/KFB%20ToolBox%20Bench%20v1%20-%20KFB%20Voxel%20Card%20Zone%20Lab%202%20-%20Hex%20Assets%20Worldbuilding/kfb-toolbox-v1/tools/KFB-ToolBox/HANDOVER.md)
- [module map](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/KFB%20ToolBox%20Bench%20v1%20-%20KFB%20Voxel%20Card%20Zone%20Lab%202%20-%20Hex%20Assets%20Worldbuilding/kfb-toolbox-v1/tools/KFB-ToolBox/MODULE_MAP.md)

The old handover itself says these pieces were intentionally **not** extracted:
- Card Cube;
- Face Focus / lab UI;
- real CardBuilder integration;
- zone floor/zone layout;
- projector/socket asset logic.

It also says `kfb-cardstack-v1` was **NOT_TESTED as a module**.

### Product parity gap

| Product behavior | Card Zone v2 | Bench v1/v1.1 |
|---|---|---|
| real 3D Card Zone | yes | reduced bench only |
| Card Cube / face interaction | yes | omitted |
| real deck/card source | yes | no CardBuilder in bench |
| reveal sequence | yes | extracted CardStack NOT_TESTED |
| Sky Card / projection as real card behavior | yes | beam proven against bench/synthetic setup only |
| 168-zone Registry / project-world relation | yes | omitted |
| seed drives integrated world | yes | seed module bench/synthetic proof |
| fluid in complete world context | yes | extracted subsystem |
| terrain/world composition | yes | reduced |
| project/product experience | yes | no |

This is why v1/v1.1 cannot become the Card Zone v3 base.

## 4 · Strict Use What Works rules for this project

Binding skill:
[skills/session-entry-use-what-works_v1.md](https://github.com/georg-doc/kayfabizarro/blob/main/skills/session-entry-use-what-works_v1.md)

For this project specifically:

1. Start by running/copying **Card Zone Lab v2**, not the Bench.
2. Any function reused from v2 must name its exact source seam.
3. A rewritten equivalent is a **new candidate**, not a copy.
4. A feature disabled in v2 is not silently activated.
5. A passing numerical panel is not visual/product parity.
6. Every important v2 output must visibly reappear before calling v3 a continuation.
7. If two repair passes fail the same gate, stop/export rather than patching again.

## 5 · Exact Hex geometry sources

### KayKit Medieval Hexagon Pack

- [Registry shard](https://github.com/georg-doc/kayfabizarro/blob/main/registry/assets/v1/packs/kaykit-medieval-hexagon-pack-1-0-free.json)
- observed registry asset count: **240**
- root: `media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE`
- source revision carried by registry entries: `378b209355b13304e3cff656ec0806ca5b89df28`

### KayKit Medieval Builder Pack

- [Registry shard](https://github.com/georg-doc/kayfabizarro/blob/main/registry/assets/v1/packs/kaykit-medieval-builder-pack-1-0.json)
- observed registry asset count: **233**
- root: `media/3D_Assets/KayKit Medieval Builder Pack 1.0`
- source revision carried by registry entries: `378b209355b13304e3cff656ec0806ca5b89df28`

### Existing Hex solver / mental model

- [hex-grid.js](https://github.com/georg-doc/kayfabizarro/blob/main/tools/world_atlas/source/lib/hex-grid.js)

Reuse:
- `TILE_EDGES`;
- `buildNetwork()`;
- `solveHexTile()`;
- `auditTileFit()`;
- `netComponents()`;
- proven rotation/edge conventions.

Do not make a second edge table.

## 6 · Babel / Hex failure evidence

Use only the salvaged parts.

- [Babel Hex Platform Generator brief](https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/BABEL_HEX_PLATFORM_GENERATOR_V1_BRIEF.md)
- [Scene-fail post-mortem](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/KFB_HEX_ATLAS_FAILURE_HANDOFF_2026-09-20/POSTMORTEM_04_SCENE_FAIL.md)
- [Golden-sample failure analysis](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/KFB_HEX_ATLAS_FAILURE_HANDOFF_2026-09-20/context/POSTMORTEM_GOLDEN_SAMPLES_2026-09-20.md)

Keep:
- exact parts atlas;
- calibrated edge measurements;
- derived edge truth;
- hex-grid reuse;
- contact/jump classifications after remeasurement.

Reject as foundation:
- failed scene composition;
- automatic building scatter;
- “correct numbers = good scene” reasoning;
- previous large island generator.

## 7 · Platformer Hub failure · movement donor only

- [original Claude brief](https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/workflows/FREE_ROAM_PLATFORMER_POC_2026-09-18/CLAUDE_DESIGN_BRIEF.md)
- [Recovery rebrief](https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/workflows/FREE_ROAM_PLATFORMER_POC_2026-09-18/CLAUDE_DESIGN_RECOVERY_REBRIEF.md)
- [Platformer mental model](https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/workflows/FREE_ROAM_PLATFORMER_POC_2026-09-18/PLATFORMER_KIT_MENTAL_MODEL.md)
- [Platformer/Hex post-mortem](https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/workflows/FREE_ROAM_PLATFORMER_POC_2026-09-18/POSTMORTEM_CLAUDE_DESIGN_QUATERNIUS_HEX_2026-09-19.md)
- `tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/platformer-poc/docs/KNOWN_ISSUES.md`

Keep:
- orbit camera;
- actor loader/adapter patterns;
- one movement owner;
- Chill / Easy / Fluid / Fun assisted jump idea;
- coyote/buffer/bounded steering/rescue;
- jump graph / landing bounds;
- diagnostic support/contact views.

Reject:
- old Project Island geometry;
- old automatic island composition.

### Long-jump rule

`Jump_Full_Long` is **not assumed**.

The old Platformer sources explicitly left `Jump_Full_Short / Jump_Full_Long` outside the state map pending a movement experiment.

Use the clip only after:
- the selected actor actually has it;
- it binds;
- its timing fits the physical jump arc.

## 8 · Resident source

- [Resident Scene Modules WSA handoff](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/START_HERE.md)
- `tools/resident_atlas_s6/data/cast.js`
- `tools/resident_atlas_s6/lib/atlas.js`
- `tools/resident_atlas/modules/index.json`
- `tools/resident_atlas/modules/runtime/s6-resident-module.js`

Boundary:
- Resident owner = resident rig / props / activity presentation;
- Hex Project Island = support/collision/movement/camera/project-state.

The rejected Clown juggling visual gate is not automatically accepted just because the module exists.

## 9 · Color / palette donor

Current public reference:

- [Cologne Race · Option C](https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c/)
- planning/publication branch: `wsa/cologne-option-c-stage-2026-09-20`
- observed PR #142 head at last recon: `dbfbb1845772d88b4678a5dabdb83e54748c0cf4`

Use its **seedable color-map contract / visual grammar** as a palette donor.

Before copying code, source-lock the exact current color-map file. Do not infer the palette from a screenshot.

## 10 · Spindle / Skydome donor

Planning bridge:
- kayfabizarro PR #128
- branch `wsa/combat-ca2-kaykit-briefs-2026-09-20`
- [SKY-01 Spindle Sky brief](https://github.com/georg-doc/kayfabizarro/blob/wsa/combat-ca2-kaykit-briefs-2026-09-20/skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/SPINDLE_SKY_MODULE_V1_BRIEF.md)

Exact Combat source currently found in `georg-doc/KFB-Combat-Arena@f6a59ad15b9ffcf3164b0ab013f223962b63f61f`:

- `_handover/A2_CARDS/inputs/cards_4b/combat-arena-v4/himmel.v4.js`
- `_handover/A2_CARDS/inputs/cards_4b/combat-arena-v4/skydome-shader.v4.js`
- `_handover/A2_CARDS/inputs/cards_4b/combat-arena-v4/spindel.v4.js`

Also present:
- `combat-arena-v3/himmel.v3.js`
- `combat-arena-v3/skydome-shader.js`

Important:
`spindel.v4.js` reaches into private sky state according to the SKY-01 brief. It is a donor, not a plug-and-play module.

First isolate its observable behavior and use the existing SKY-01 adapter contract rather than importing it blindly.

## 11 · Existing old consolidation brief

Current old planning source:
[KFB ToolBox Fluid / Beam / Card / Seed / Voxel consolidation](https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/workflows/KFB_TOOLBOX_FLUID_CARD_VOXEL_CONSOLIDATION_V1_2026-09-21/START_HERE.md)

Qualification after this recovery:

- its source-census idea remains useful;
- its module candidates remain candidates;
- its Bench-centric “canonical ToolBox bench” direction is **not** the Card Zone v3 foundation;
- Card Zone v2 parity comes first.

## 12 · User visual evidence · 2026-09-21

User side-by-side review reports and screenshots show:

**ToolBox Bench v1.1**
- reduced acid/fluid/voxel technical bench;
- strong debug/control emphasis;
- missing the complete Card Zone experience.

**KFB Card Zone Lab v2**
- card island / deck present;
- Card Zone projection controls;
- surrounding voxel world;
- acid/fluid moat;
- richer integrated world composition.

This is a human product comparison, not a substitute for the required browser parity test.
