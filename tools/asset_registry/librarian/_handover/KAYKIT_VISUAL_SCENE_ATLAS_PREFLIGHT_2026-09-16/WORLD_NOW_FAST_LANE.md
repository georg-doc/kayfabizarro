# KFB Asset Librarian · Visual Scene Atlas Preflight · WORLD NOW Fast Lane

**Date:** 2026-09-16  
**Status:** `PROPOSAL / CANDIDATE PREP`  
**Branch:** `chat/kaykit-visual-scene-atlas-preflight-2026-09-16`

## 0. Goal

Use the existing KayKit Atlas to support the **next useful world/scene decisions now**, without waiting for a complete visual archaeology pass and without drifting into ToolBox or consumer implementation.

The fast lane serves three immediate needs:

1. **Birthday / cozy-party scene** — a compact, readable authored space around the already-tested hero cast.
2. **Orbit 7 / seaside / streetscape / town-road composition** — reusable environment grammar for Town / Travel / Stunt.
3. **Modular world vocabulary** — City Builder, Forest Nature, Block Bits, Resource Bits, BoardGame/RPG Tools and selected backdrop/glow references converted into scene-design knowledge.

## 1. Hard owner boundaries

### Existing decisions / tested results stay where they are

The Birthday consumer contract remains authoritative. The prior Birthday review records:

- Uncle FrizzleBob via the existing Graft owner/config path;
- Little Miss Messy / GothGirl as the selected hero actor;
- tested `Idle_A`, `Waving`, `Cheering` state casting with return to idle;
- Hihi Love-Hope as the inactive existing Cube-Pet slot;
- Dance and several scene/performance additions still P1/unresolved.

This fast lane does **not** reopen those decisions.

### This preflight may do

- curate candidate assets;
- extract source/demo scene grammar;
- propose Scene Recipes;
- map known source paths;
- flag source/Registry gaps;
- give Claude Design bounded visual jobs.

### This preflight may not do

- compose/publish runtime scenes;
- change `kfb.asset-handoff.v1`;
- declare final scale/attachment/physics suitability;
- unzip or re-index archive-only packs;
- change Town/Travel/Stunt/ToolBox ownership;
- turn demo adjacency into compatibility.

## 2. Fast Lane A · Birthday / Cozy Party

### 2.1 Existing source/test foundation

The prior Birthday review already separates the broad discovery pool from the actual starter scene.

**TESTED RESULT preserved:** hero casting/motion state is already narrow and stable.

**SOURCE FACT / candidate pool:** GothGirl family supplies:

- microphone;
- mic stand;
- speaker;
- stool.

The existing handoff also contains candidate party/world dressing such as:

- cloud primitives;
- balloon/circus candidates;
- present variants;
- selected Farmer props;
- Driver car;
- alternate actors kept outside the core starter.

The prior Atlas also identified strong nearest-family market/environment reuse candidates including:

- market stall + roof;
- barrel/crate stacks;
- cart;
- hay assets;
- side signs;
- red/white and green/white signs;
- shovel/trowel;
- seasonal cart/crate variants.

These are **candidate source assets**, not a final Birthday scene decision.

### 2.2 Fast-lane visual target

The visual job should produce the **smallest convincing authored space**, not an exhaustive house/interior system.

Target composition layers:

1. **Hero zone**
   - clear floor area for FrizzleBob + Little Miss Messy;
   - room for waving/cheering without prop overlap;
   - optional performance prop pocket for GothGirl signature props.

2. **Party focal zone**
   - one table/platform/stall-like visual anchor only where the reference target supports it;
   - deliberately small present/balloon/decor set;
   - no catalog dumping.

3. **Depth zone**
   - backdrop / wall-like / cloud / nature / sign elements used to create depth;
   - visual framing without blocking character silhouettes.

4. **Optional P1 performance zone**
   - microphone / mic stand / speaker / stool;
   - only if the reference/reconstruction proves the intended use clearly enough for a later consumer test.

### 2.3 Output required from Claude Design

For Birthday, return:

- one scene recipe for the P0 stable slice;
- one optional P1 performance recipe;
- exact source candidates for each visible asset role;
- relative positions and scale relationships;
- camera framing;
- light/glow/material notes;
- unresolved items rather than guessed transforms.

### 2.4 Acceptance for this preflight

Pass when the recipe can answer:

> Which **small number** of known assets and visual roles are sufficient to reconstruct the target staging for a receiving consumer to test?

Fail if the output becomes:

- a new interior architecture framework;
- a giant asset payload;
- a new animation state owner;
- unsupported attachment claims.

## 3. Fast Lane B · Orbit 7 / Seaside / Town-Road

### 3.1 Status discipline

`Orbit 7 / seaside / streetscape / town-road` is a **current preflight target**, not a claim that one official KayKit demo exactly represents Orbit 7.

The job should synthesize documented **source/demo grammar** from the strongest relevant KayKit families and clearly label any KFB-specific composition as `PROPOSAL`.

### 3.2 Source families to inspect first

#### City Builder Bits

Use for:

- streetscape rhythm;
- building-to-road relationships;
- corners/intersections if visible;
- signs/street props;
- modular block spacing.

Prior Atlas already identified `Overview_Extra.png` as KayKit City Builder Bits v1.0.

#### Forest Nature

Use for:

- tree/rock scatter;
- built/natural boundary;
- roadside/edge dressing;
- silhouette variety.

**SOURCE FACT:** Kay's Medieval Village WIP explicitly reused trees/rocks from the free Forest Nature Pack. This is an `official_companion_pack` relation, not a runtime compatibility proof.

#### Medieval Hexagon

Use for:

- tile adjacency;
- path/road/ground transitions;
- modular landscape rhythm.

Current source state remains archive/reference-oriented; do not invent selectable per-model assets where Registry/source exposure is incomplete.

#### Resource Bits

Use for:

- resource landmarks;
- environmental prop clusters;
- worksite/harvest/mining staging where visually observed.

Current source/Registry state includes an already-owned archive with a documented indexing blind spot.

#### Block Bits

Use for:

- platforms, barriers, constructed landmarks, stages/arena-like set-pieces;
- readable modular repetition.

Do not treat Block Bits as the default terrain system.

#### Space Base Bits

Use only where Orbit 7 requires a deliberately sci-fi/platform/base language. Keep it separate from ordinary town/seaside grammar unless the scene owner explicitly wants the blend.

### 3.3 Scene grammar questions

Claude Design should extract:

- road width relative to buildings/characters/vehicles;
- path and road edge treatment;
- building setbacks;
- repeated facade spacing;
- street-prop density;
- tree/rock density near built edges;
- open negative space for movement/readability;
- foreground/midground/background layering;
- coast/beach/water edge grammar where actual references support it;
- camera height/angle appropriate to the current consumer view;
- lighting/material/glow distinctions that materially affect readability.

### 3.4 Three output recipes, not one mega-scene

Return separately:

1. `ORBIT7_TOWN_EDGE_v0`
2. `ORBIT7_ROAD_STREETSCAPE_v0`
3. `ORBIT7_SEASIDE_EDGE_v0`

Each recipe may share asset candidates but must state which relations are:

- observed in source reference;
- inferred from multiple references;
- proposed specifically for KFB.

## 4. Fast Lane C · Modular World Vocabulary

The purpose is to avoid repeatedly rediscovering the same candidate types across Town / Travel / Stunt.

### 4.1 Ground / tile / road

Candidate source/reference families:

- City Builder Bits
- Medieval Hexagon
- Dungeon
- Holiday/Gingerbread for stylized/platforming cases
- consumer-owned terrain systems remain separate runtime owners

Output vocabulary should use functional roles such as:

- `ground_base`
- `road_straight`
- `road_corner`
- `road_intersection`
- `edge_transition`
- `platform`
- `stage`
- `arena_floor`

These are **Scene Recipe semantic roles**, not new Registry taxonomy.

### 4.2 Buildings / structural framing

Candidate families:

- City Builder Bits
- Block Bits
- Medieval Village WIP as reference learning only where source assets are not owned
- Space Base Bits for explicit sci-fi cases

Output roles:

- `building_anchor`
- `facade_repeat`
- `entrance_marker`
- `roofline`
- `fence_boundary`
- `street_sign`

### 4.3 Nature / environmental dressing

Candidate families:

- Forest Nature
- Resource Bits
- existing backdrops where relevant

Output roles:

- `tree_cluster`
- `rock_cluster`
- `resource_landmark`
- `roadside_dressing`
- `background_mass`

### 4.4 Props / furniture / decor

Candidate families:

- RPG Tools Bits
- Birthday starter candidates
- BoardGame Bits for physical markers/tabletop scenes
- Holiday Bits for seasonal decor
- GothGirl same-collection performance props

Output roles:

- `workstation`
- `hand_prop_candidate`
- `placed_prop`
- `signage`
- `party_dressing`
- `performance_prop`
- `foreground_dressing`
- `background_dressing`

Again, these roles describe reconstruction intent only.

## 5. Lighting / material / glow fast lane

Only promote visual/material behavior where source evidence exists.

Known high-value anchors from prior Atlas:

- Holiday Bits uses a secondary `holiday_glow` material intended for emission.
- Kay's saved development context includes day/night/indoor dungeon lighting experiments.
- character demos may reveal FX/glow/material presentation, but those still require actual frame review.

Scene Recipe fields should distinguish:

- `material_source_fact`
- `observed_visual_effect`
- `proposed_kfb_treatment`

No engine-specific implementation is decided here.

## 6. WORLD NOW source-readiness table

| Family | Current source state | Fast-lane use | Constraint |
|---|---|---|---|
| Block Bits | owned/indexed | structural set-pieces, readable modular repetition | reconstruct exact demo composition before copying grammar |
| BoardGame Bits | owned/indexed | tabletop/marker/world-space prop grammar | prior Registry snapshot has missing dependency issues |
| RPG Tools Bits | owned/indexed | workstation/prop clusters | attachment remains consumer-owned |
| Forest Nature | owned/indexed | natural scatter, town edge, roadside | no automatic collision/terrain suitability |
| Dungeon | owned/indexed | ground/interior modular reference | consumer-specific suitability untested |
| City Builder | owned archive/reference | streetscape/building/road grammar | source exposure/indexing incomplete |
| Medieval Hexagon | owned archive/reference | tile/path/ground grammar | source exposure/indexing incomplete |
| Resource Bits | owned archive/reference | resource/environment clusters | Registry blind spot |
| Space Base | owned source/reference | sci-fi/platform/base grammar | use only when target wants that language |
| Holiday Bits core | source page/reference; prior Atlas says missing from repo | seasonal/glow/gingerbread learning | do not fake ownership/selectability |
| GothGirl props | owned source siblings | Birthday/performance prop candidates | transform/attachment must be measured later |

## 7. Fast-lane deliverables

The next visual phase should return only compact, executable research artifacts:

1. 3 Birthday/Orbit scene recipes at minimum;
2. source-asset match rows with confidence;
3. explicit missing-source/index gaps;
4. no ToolBox/runtime code;
5. no broad compatibility verdicts.

## 8. Decision gate after WORLD NOW

After `VR-001`–`VR-005`:

### If enough owned assets cover the scenes

Proceed to consumer-specific scene validation. Do **not** buy more KayKit material merely for completeness.

### If a needed family is already owned but archive-only

Create a separate Registry-owner proposal for extraction/indexing.

### If a needed visual capability is truly absent

Only then consult `KAYKIT_MISSING_PAID_BONUS_GAPS.md` / official source verification for a targeted paid/bonus decision.

### If the visual grammar is useful but the exact source is missing

Keep it as `REFERENCE ONLY` inspiration; do not silently substitute ownership or compatibility.

## 9. Next checkpoint

Build `SOURCE_ASSET_MATCH_MATRIX.md` around WORLD NOW candidates and the first character/prop pairs, using exact paths where source truth is already known and leaving unknowns explicit.