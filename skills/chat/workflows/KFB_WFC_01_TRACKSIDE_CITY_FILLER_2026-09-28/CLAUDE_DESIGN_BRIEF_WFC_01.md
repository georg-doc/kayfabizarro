# Claude Design Brief · WFC-01 · Trackside & City Filler

Status: `READY FOR FRESH CHAT`  
Scope: one bounded procedural-layout proof  
Do not redesign the Hub, Track Core, WorldBuilder, K2, T3, OSM, or road geometry.

## Product intent

KFB needs worlds that feel authored, colorful, bent, alive and surprising without hand-placing every prop or shipping a complete OSM city.

The fixed playable skeleton comes first:

`semantic route / OSM route → Surface Adapter → playable road or track corridor → protected margins → presentation`

WFC fills only the approved cells around that skeleton. It is a **local arrangement tool**, not a global planner.

North star:

> Rocko's Modern Life meets SpongeBob meets Wallace & Gromit meets Super Mario Kart — constructed from an approved KFB clay kit, with clear human scale and playable space.

## Mandatory source locks

### Accepted base

Use the package under:

`tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/`

Read its `START_HERE.md`, `HANDOVER_WSA.md`, `docs/LIVING_CLAY.md` and `CHANGELOG.md`.

Facts:

- K2 is `ACCEPTED AS BASE`.
- T3 v2 remains the retained track donor.
- K2 provides clay material v10, relief v4, class tool mixes and the proven workbench.
- Full K2 tooling is visually rich but potentially expensive: the handover records up to 54 additional texture reads per pixel. Use full relief only near the player; simplified material tiers are required for mid/far placement.

### Rejected source

Read:

`tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v3/KFB_KNET_STRASSE_S1_FAIL_2026-09-28/POSTMORTEM_S1_KNET_STRASSE.md`

Never reuse S1 v1-v3 as a visual foundation. Never reuse T3-v3 road markings as accepted design.

Only these techniques survive:

- dents / pressure dimples;
- layer-isolation measurement;
- KayKit vertex-atlas recoloring;
- stream-frame `(s,u)` placement;
- `fillet()` for rounded polygon corners.

### Visual street grammar

Use `ref/georg_sample_clay_street.png` from the S1 failure export only as a visual reference. It is visibly watermarked and may not be shipped, traced, embedded or presented as a KFB asset.

Read from it:

- road, curb, sidewalk, façades, lamps and trees form one coherent street room;
- cobbles are individual rounded masses, not a noisy shader carpet;
- curb stones have a readable front face and joints;
- sidewalks use larger, quieter slabs;
- façades create a continuous but varied wall;
- buildings vary in height, width and roof silhouette;
- windows and doors repeat with rhythm but not uniformity;
- lamps stand in a readable cadence at the curb;
- trees punctuate, rather than fill, the street;
- foreground values are readable and the warm/cool palette separates ground, architecture and sky;
- playful bending affects silhouettes and proportions, not collision truth.

Do not copy its exact architecture, taxi or composition.

## WFC architecture

Implement a small **2D or 2.5D simple tiled model**, preferably as editor-time JavaScript. Do not attempt unconstrained full-3D WFC and do not run an expensive continuous solver during gameplay.

### Layer 0 · fixed inputs

The host supplies:

- route/track centreline and widths;
- carriageway, shoulder and sidewalk reservations;
- collision ground;
- ramps, portals, junctions and track connections;
- spawn and interaction clearances;
- landmark anchors and sight cones;
- semantic biome/zone;
- deterministic zone seed.

WFC may read these values but never rewrite them.

### Layer 1 · semantic mask

Each candidate cell receives exactly one allowed class:

- `PROTECTED`
- `CITY_EDGE`
- `NATURE_EDGE`
- `RACE_EDGE`
- `TRANSITION`
- `LANDMARK_BUFFER`
- `EMPTY`

`PROTECTED`, `LANDMARK_BUFFER` and `EMPTY` never receive decorative modules.

### Layer 2 · approved module catalog

Start with 12–20 source-proven modules, not hundreds.

Every module declares:

- stable ID;
- source pack/path;
- footprint and height range;
- connection sockets north/east/south/west;
- allowed zone and slope;
- road-facing side;
- clearance box;
- weight/rarity;
- rotation/reflection permission;
- LOD/material tier;
- shadow policy;
- whether it is interactive, decorative or reserved for Blender-authored landmarks.

Required families:

**City**
- curb-stone straight/corner/end;
- sidewalk slab;
- façade frontage narrow/wide;
- doorway or courtyard opening;
- lamp anchor;
- tree pocket;
- deliberately empty frontage.

**Nature**
- ditch/berm;
- KayKit/Tiny-Treats fence;
- rock or bush pocket;
- tree group;
- open view cell.

**Race**
- quiet runoff;
- approved barrier family;
- billboard anchor;
- VFX emitter anchor;
- open safety cell.

### Layer 3 · adjacency and non-local guards

Local sockets prevent impossible neighbours. Additional hard guards must preserve gameplay:

- no footprint overlaps the protected corridor;
- no tall item inside a sight cone;
- no prop in ramp landing or portal clearance;
- sidewalks and curbs remain continuous through city cells;
- doors face accessible space;
- lamps and trees use bounded cadence, not every cell;
- at least one open/quiet cell occurs within a short run;
- rare landmarks are pre-placed, never generated by chance;
- transitions are staggered across track surface, marking, verge, barrier, city/nature edge and VFX. They must not all switch at one cross-section.

### Layer 4 · presentation

After layout, apply:

- shared zone palette/seed;
- K2 close material only where it earns the pixels;
- reduced mid material;
- flat/color-only far material;
- instancing for repeated non-interactive modules;
- deterministic variation in scale, bend and color within safe limits;
- KFB clay VFX particles pooled and activated only near/visible gameplay;
- no per-object duplicate shader/material graph.

## Required proof

Use one short, fixed corridor with one landmark anchor and three consecutive zones:

1. city edge;
2. transition;
3. nature or race edge.

Show:

- seed A and seed B;
- same seed repeated exactly;
- protected-space overlay;
- socket/adjacency debug;
- contradiction counter;
- fallback result;
- performance counters relevant to the changed layer only.

The host road, ground, camera and landmark must remain byte-for-byte or structurally unchanged.

## Contradiction policy

WFC may fail. That is not permission to loop forever.

1. Try the deterministic seed once.
2. Retry with at most two derived seeds.
3. If still contradictory, use a small authored fallback strip for that zone.
4. Record the contradiction and involved rules.
5. Never leave a hole, block the road or delay world boot.

## Output contract

Export a compact JSON recipe:

```json
{
  "schema": "kfb.world-filler/1",
  "zoneId": "wfc-01-demo",
  "seed": 20260928,
  "hostRevision": "<exact ref>",
  "catalogRevision": "<exact ref>",
  "placements": [
    {
      "moduleId": "city.curb.straight.a",
      "sourceId": "<asset registry id>",
      "cell": [4, 2],
      "rotation": 90,
      "variantSeed": 17,
      "lodTier": "near"
    }
  ],
  "fallbackUsed": false
}
```

Runtime consumes the recipe; it does not recalculate the whole zone on every load.

## Evidence and UX

Keep technical overlays behind one small info/debug control. The default view is the real WorldBuilder/track scene, not a table or a separate generic dashboard.

Save:

- source module contact sheet;
- one clean world view per seed;
- protected-space overlay;
- failure/fallback proof;
- output JSON;
- additive Return and changelog.

## Acceptance

Repository checks must prove:

- no protected overlap;
- no missing source IDs;
- deterministic output;
- bounded retries;
- fallback availability;
- valid exported schema.

Browser proof must show:

- coherent city/nature/race edge;
- continuous curb/sidewalk where required;
- clear road and sightline;
- no floating/clipped props;
- no recurrence of S1 shadow/peter-panning defects;
- no visual regression of K2/T3-v2 donor.

## Stop conditions

Stop and return `SOURCE_REQUIRED` if:

- the receiving WorldBuilder/track host is not pinned;
- a module has no verified source;
- no protected-space contract exists;
- the road or landmark would need redesign;
- the next step would become S1-v4.

No Stage publication and no Georg gate for a catalog-only or debug-only result. First integrate the bounded proof into the real receiving owner.
