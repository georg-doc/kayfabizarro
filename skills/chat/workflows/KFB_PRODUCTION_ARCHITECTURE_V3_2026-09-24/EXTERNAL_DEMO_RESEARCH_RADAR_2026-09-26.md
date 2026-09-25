# KFB External Demo Research Radar · 2026-09-26

Status: **RESEARCH RUNNING · CHECKPOINT 1 / PLAN PERSISTED**  
Owner: **KFB Web Architecture lane** (planning/routing only; runtime owners unchanged)  
Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/production-architecture-v3-2026-09-24`  
PR: **#204**  
Starting head: `5f19bc7d43fddde56fab9029e304a19a6a4acccf`  
Outcome: a source-linked research radar that routes external patterns/demos into existing KFB jobs without creating a second runtime, editor, registry or world owner.  
Hub/Stage navigation route: `https://kayfabizarro.pages.dev/kfb-hub/` — **navigation only; no new public Stage candidate is claimed by this research slice.**

## Why this slice exists

Georg asked for a recurring research lane across **Reddit, GitHub and other public demos** to identify useful:
- concrete implementation techniques;
- reusable architectural patterns;
- interaction/presentation ideas;
- source/demo donors;
- small blueprint candidates;
- anti-patterns and integration risks

for current KFB slices, especially **World / WorldBuilder / ToolBox / Residents / Race / Card Zones / playable game loops**.

This document is an additive research artifact under the existing Production Architecture v3 planning owner. It does **not** promote any external project to KFB owner or implementation truth.

## Current KFB receiving context

Current architecture source on PR #204:
- **13 strands**
- **96 jobs**
- **44 READY**
- **52 HOLD**

Highest-value receiving jobs for this research pass:
1. `ENV-PREVIEW-01` — shared KFB environment preview host.
2. `WORLD-ENV-CONSOLIDATE-01` — current world-environment source recipe.
3. `WB-MOBILITY-MVP-01` — one playable world with movement-mode handoffs.
4. `WB-HUERTH-COLOGNE-RACE-MVP-01` — OSM world → authored Race transition.
5. `WORLD-BIOME-MOOD-01` / `WORLD-NATURE-01` / `WORLD-RECIPE-01`.
6. `CZ-ENV-01` — Card Zone × current Environment.
7. `NPC-AITOWN-KISS-01` — bounded living-resident intent loop.
8. ToolBox / Animation / Resident Atlas preview consumers.

Protected boundaries:
- Travel/TinySkies remains macro-world truth.
- WorldBuilder remains its authoring owner.
- Race remains its track/physics owner.
- ToolBox / Animation Lab remain actor/motion authoring owners.
- Resident Atlas / Resident Scene remain resident presentation owners.
- Card Zones mount into current environment rather than importing the historical standalone voxel world.
- No second renderer, terrain generator, sky stack, locomotion writer, NPC memory runtime, asset registry or universal game runtime.

## Research method

Every external item is classified by **what KFB can actually take from it**, not by popularity.

### Evidence classes

- **SOURCE** — code/docs/repo inspected.
- **DEMO** — interactive/public demo inspected.
- **COMMUNITY** — Reddit/forum discussion; useful for failure modes, usability and practice, never implementation truth by itself.
- **SECONDARY** — article/video/write-up; useful context, lower confidence than source.
- **KFB-PRIOR** — older KFB/Dropbox research used only as a lead or comparison.

### KFB fit labels

- **ADOPT PATTERN** — small pattern can map to an existing KFB owner.
- **DONOR CANDIDATE** — source worth isolated inspection before any integration.
- **BLUEPRINT** — concrete bounded proof worth turning into a KFB job/brief.
- **INSPIRATION ONLY** — useful interaction/look/product idea, not direct implementation.
- **AVOID / ANTI-PATTERN** — likely to create owner drift, duplicated stacks, brittle generation or unnecessary complexity.
- **NO ACTION** — interesting but not useful enough for current queue.

### Per-item questions

1. What problem does it solve?
2. What is the smallest reusable mechanism?
3. Which current KFB owner/job receives it?
4. Does KFB already have an equivalent donor/module?
5. What must be shown in **source isolation** before integration?
6. What are the licensing/runtime/dependency constraints?
7. What would be the smallest KFB proof?
8. What should explicitly **not** be copied?

## Timeout-safe execution plan

Long web research is split into independent batches. Each batch is persisted before the next one.

### Batch A · World rendering / environment / procedural world
Targets:
- Three.js/WebGL examples and open repos;
- procedural terrain / biome / scatter / sky / fog;
- asset-light stylized worlds;
- environment-preview host patterns;
- deterministic seed/recipe patterns.

Primary receivers:
`ENV-PREVIEW-01`, `WORLD-ENV-CONSOLIDATE-01`, `WORLD-BIOME-MOOD-01`, `WORLD-NATURE-01`, `WORLD-RECIPE-01`.

### Batch B · WorldBuilder / in-world editing / authoring UX
Targets:
- runtime terrain editing;
- direct manipulation;
- orbit/edit mode switching;
- brush radius/strength interaction;
- scene object transforms;
- save/reload document patterns;
- play/edit coexistence.

Primary receiver:
WorldBuilder / WB2 / current World Integration.

### Batch C · Tracks / roads / modular world-to-race seams
Targets:
- spline/segment track construction;
- procedural or authored road meshes;
- road-edge/barrier variants;
- socket/connector systems;
- transition from world road network to gameplay track.

Primary receivers:
Race + WorldBuilder / `WB-HUERTH-COLOGNE-RACE-MVP-01`.

### Batch D · Residents / living NPCs / lightweight simulation
Targets:
- bounded intent/state loops;
- local perception;
- approach/participate/leave;
- schedule/needs systems;
- deterministic or inspectable memory/state;
- multi-NPC simulation without a new backend stack.

Primary receiver:
`NPC-AITOWN-KISS-01`, Resident Scene/Town.

### Batch E · Card Zones / portals / modular activities / diegetic interfaces
Targets:
- portal/instance handoff;
- world-space cards/objects;
- minigame sockets;
- diegetic interaction;
- reversible local environment overrides.

Primary receivers:
Card Zones, Shared Stage/Transitions, Museum/portal concepts.

### Batch F · ToolBox / animation / preview surfaces
Targets:
- shared scene-preview host;
- pose/motion audition;
- source isolation;
- actor/asset comparison;
- compact browser authoring surfaces.

Primary receivers:
ToolBox, Animation Lab, Resident Atlas, Quick 3D Review.

## Research result format

Each accepted item will be appended to a table with:
- source + date checked;
- evidence class;
- mechanism;
- KFB receiver;
- fit label;
- smallest proof;
- integration risk;
- licensing/dependency notes;
- source-isolation requirement;
- priority.

A final section will convert only the strongest findings into **candidate KFB research follow-ups**. No new job enters `HUB_BRIEFING_CATALOG.json` merely because it is interesting.

## Existing KFB prior-research pool found in Dropbox

Read-only leads discovered on 2026-09-26:
- `KFB Research Cluster 01 — AI-Native Game Development & Technical Production.md`
- `KFB Research Cluster 02 — Solo Onboarding, Discovery & Game Design.md`
- `KFB Research Cluster 03 — Physical, Visual & Interactive Tabletop Worlds.md`
- `kfb-overworld-asset-research.md`
- `KFB_STUNT_PHYSICS_PIRATE_UNDERWATER_RESEARCH_v1.md`
- `KFB Cartoon Motion Research v1.md`
- `WOW_UNDERMINE_DRIVE_RESEARCH_2026-09-19/RESEARCH.md`

These remain **KFB-PRIOR** evidence only. GitHub current state and current owner contracts override them.

## Checkpoint rule

After each research batch:
1. append findings here;
2. record checked source count and failures/timeouts;
3. fetch the exact branch head + this file;
4. only then continue.

A timeout is **UNKNOWN**, never success. Do not repeat a write until branch/file inspection proves it absent.

## Current next gate

**Execute Batch A + Batch B first** because they directly support the active environment/world integration queue. Persist findings before moving to Race/NPC/Card/ToolBox batches.
