# VR-002 · Orbit 7 / Seaside / Town-Road Composition

**Priority:** P0  
**Status:** `READY FOR CLAUDE DESIGN / MULTI-REFERENCE SCENE-GRAMMAR REVIEW`  
**Owner boundary:** Travel/TinySkies remains terrain/sky/light/water owner. Town/Travel/Stunt remain receiving composition/runtime owners. KayKit Atlas supplies candidate built-environment and dressing grammar only.

## 1. Goal

Extract a reusable **town-edge / road / seaside composition grammar** for the current Orbit 7 direction without inventing a new terrain or water system.

This job is intentionally not a request to find one screenshot called “Orbit 7.” The current preflight target is a KFB scene direction; KayKit references are donor/reference evidence for built environment, modular road/tile logic and dressing.

## 2. Read first

1. `../WORLD_NOW_FAST_LANE.md`
2. `../SOURCE_ASSET_MATCH_MATRIX.md`
3. `../SCENE_RECIPE_v0_PROPOSAL.md`
4. `skills/chat/recovery/CURRENT_PRIORITY_BOARD_2026-09-15.md` for current Travel-world owner constraints
5. canonical Sep-15 KayKit Atlas pack coverage and demo learnings

## 3. Hard existing world owner facts

Current lead priority documentation says the world substrate must use:

- Travel/TinySkies world substrate;
- real shaped terrain;
- actual coast/water/beach reading;
- Travel Evening sky/light/atmosphere owner;
- integrated coastal lighthouse + glow/beam where that current world target requires it;
- spatial animated clouds.

Therefore KayKit candidates in this job should primarily answer:

> What built-world, road, tile, prop and natural-dressing grammar can sit **on top of** that existing world substrate?

Do not propose KayKit as a replacement terrain/water/sky engine.

## 4. Reference/source families

### A. City Builder Bits

Prior Atlas evidence:

- `Overview_Extra.png` identified as KayKit City Builder Bits v1.0;
- owned archive/source family exists;
- object-level Registry exposure is incomplete compared with clean indexed packs.

Review for:

- building-to-road spacing;
- facade repetition;
- corners/intersections;
- signs/street furniture;
- block density;
- modular town rhythm.

### B. Forest Nature Pack

Owned/indexed source family:

`media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/`

Prior source-page evidence:

Kay's Medieval Village WIP explicitly reused trees and rocks from Forest Nature.

Review/use for:

- tree/rock clustering;
- built-to-natural edge;
- roadside scatter;
- silhouette breakup;
- background/midground density.

### C. Medieval Hexagon

Owned archive/reference family.

Review for:

- tile adjacency;
- path/road/ground transitions;
- readable edge treatment;
- repeated modular landscape rhythm.

Do not manufacture per-model source paths while source exposure remains incomplete.

### D. Resource Bits

References:

- `Resource_Bits_Overview.png`
- `Resource_Bits_Sample_Extra.png`

Owned archive exists; Registry blind spot is already documented.

Review for:

- resource landmarks;
- roadside/environment clusters;
- worksite/harvest/mining motifs;
- scale/density that could make the town edge feel inhabited.

### E. Block Bits

References:

- `Block_Bits_Overview.png`
- authored multi-composition sample

Use only for clear constructed landmarks/platforms/barriers/stage-like forms where compositionally appropriate. Do not default to Block Bits as generic terrain.

### F. Space Base Bits

Use only for an explicitly sci-fi Orbit 7 layer. Keep a separate recipe/delta rather than contaminating ordinary town/coast grammar.

## 5. Required decomposition

Return **three distinct recipes**, not one large hybrid:

### Recipe A · `ORBIT7_TOWN_EDGE_v0`

Focus:

- built/natural transition;
- first/last building row;
- trees/rocks/resource landmarks;
- negative space;
- visual gateway into/out of town.

### Recipe B · `ORBIT7_ROAD_STREETSCAPE_v0`

Focus:

- road/path width relationships;
- building setback;
- corner/intersection logic;
- props/signs;
- repeat rhythm;
- movement readability for player/vehicle.

### Recipe C · `ORBIT7_SEASIDE_EDGE_v0`

Focus:

- built-world placement near the Travel-owned coast;
- prop/tree/rock transition toward water;
- promenade/edge/clearing logic where source evidence supports it;
- lighthouse sightline if relevant to current consumer target;
- no replacement water/terrain system.

## 6. Visual analysis tasks

For every supporting KayKit reference:

### A. Separate source observation from KFB synthesis

Record:

- `OBSERVED_DEMO` — visible source composition;
- `INFERENCE` — likely modular/spacing rule;
- `PROPOSAL` — KFB Orbit 7 application.

Never write a KFB proposal as if KayKit officially demonstrated it.

### B. Measure normalized spatial relationships

Examples:

- road width / building width;
- building gap / building width;
- tree-cluster diameter / building width;
- prop spacing / road width;
- foreground/midground/background occupancy.

Use ratios/normalized frame measures rather than fake world meters.

### C. Identify repetition grammar

For each family mark:

- unique anchor object;
- repeated filler objects;
- edge/corner pieces;
- accent objects;
- density limits before readability collapses.

### D. Movement/readability

Because Stunt/Travel/Town may all consume the grammar later, mark:

- clear movement corridor;
- silhouette blockers;
- likely visual landmarks;
- areas suitable for props versus navigation;
- anything that would require consumer collision testing.

## 7. Source-match rules

Use `SOURCE_ASSET_MATCH_MATRIX.md`.

Allowed:

- exact source path already known;
- pack/family-only mapping;
- unresolved visual asset.

Not allowed:

- guessed filename from appearance;
- fake selectable asset for ZIP-only pack;
- collision/drivability claim from a screenshot;
- road fit claim without consumer measurement.

## 8. Required outputs

1. `VR-002_ORBIT7_SEASIDE_TOWN_ROAD_RETURN.md`
2. `ORBIT7_TOWN_EDGE_v0.visual-scene-recipe.json`
3. `ORBIT7_ROAD_STREETSCAPE_v0.visual-scene-recipe.json`
4. `ORBIT7_SEASIDE_EDGE_v0.visual-scene-recipe.json`
5. `VR-002_SOURCE_MATCH_DELTA.md`

## 9. Useful output table

Include a compact table:

| Visual role | Reference evidence | Source family | Exact asset? | Confidence | KFB proposal | Runtime validation owner |
|---|---|---|---|---|---|---|
| building anchor | ... | City Builder | no/yes | ... | ... | Town/Travel |
| roadside tree cluster | ... | Forest Nature | ... | ... | ... | receiving consumer |
| road edge | ... | ... | ... | ... | ... | receiving consumer |
| resource landmark | ... | Resource Bits | family only | ... | ... | receiving consumer |

## 10. Optional sci-fi delta

If Space Base evidence is visually strong, return a separate:

`ORBIT7_SCIFI_ACCENT_DELTA_v0`

Do not mix it into the baseline town/coast recipes unless the current KFB target explicitly requires that language.

## 11. Stop conditions

Return `UNRESOLVED` rather than guessing if:

- no actual coastal source reference supports a claimed edge treatment;
- City Builder/Medieval/Resource exact model identity cannot be proven;
- the task begins redesigning Travel terrain/water/sky;
- a proposed road width becomes a physics/drivability claim;
- you need broad repo exploration instead of the bounded source families above.

## 12. Acceptance criterion

This job succeeds when a receiving world owner gets:

- three small visual composition recipes;
- clear source/reference provenance;
- candidate source families/assets;
- normalized spatial grammar;
- explicit runtime-validation boundaries;
- no competing terrain/world implementation.