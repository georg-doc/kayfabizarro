# KFB World / Resident Presentation Rules · 2026-09-25

Status: **CURRENT ADDITIVE RULE · no new runtime owner**

Purpose: preserve recurring visual fixes as shared presentation rules instead of rediscovering them in each Resident/World demo.

## 1 · Resident modules are terrain-placeable

Current source-backed donor:
`tools/KFB-ToolBox/_inbox/KFB Resident Atlas v3/S39-band-module-01/`

Binding rule:

- a Resident module does **not** bring a mandatory ground/base plate;
- host supplies a world/terrain anchor;
- module support plane is local `y=0`;
- host owns terrain height / support / slope facts;
- module may ground-snap feet/props or apply bounded per-actor support offsets;
- module does not own terrain, road, world collision or sky;
- exported Resident recipe must remain placeable on street, tavern floor, plaza, WorldBuilder terrain or other host surface.

S39 donor proves this explicitly:
`mountBandModule(def, { parent, anchor })`
with **no ORB-P1 Ground mesh**.

For uneven terrain:
- sample host terrain/support at actor/prop support points;
- use host-provided ground normal/height where available;
- adjust root/support offsets only;
- do not generate a hidden rectangular platform to make the scene look stable.

A visible platform is allowed only when it is an intentional scene prop/stage and must be authored as such.

## 2 · Resident performance source priority

For KayfaBizarros band/performance scenes, prefer the newer S39 Resident Band donor over the older MUSIC-PERF review animation set.

Current S39 facts:
- Leader: Legacy Orc B `bounce`;
- Guitarist: accepted Mixamo `Guitar A` / `ml.guitar.a.fit` with source-backed fit;
- Drummer: `drum.v5c` + measured strike/contact workshop;
- module has no baseplate.

Older MUSIC-PERF timeline/audio mechanics remain useful donors.
Its current guitarist/drummer animation presentation is **TUNE / superseded by newer S39 performance sources**.

Do not re-use the grotesque wrist-bending animation set as the canonical band performance.

## 3 · Demo environment should match WorldBuilder presentation

Resident/demo scenes that need an environment should use a lightweight host preview which matches current WorldBuilder presentation rather than a generic empty-gray or arbitrary lab scene.

Preferred preview environment:
- current WorldBuilder/Travel-compatible skydome donor;
- current WorldBuilder light profile;
- current ground/terrain material family;
- no fake plate unless intentionally authored.

The demo host is presentation only.
It must not become a second WorldBuilder, sky owner or terrain owner.

## 4 · OSM building presentation is global, not city-specific

Current useful donors:

### Facade grammar
WB-D2:
`tools/KFB-ToolBox/_inbox/KFB WB-D1 · Cologne World Shell 2-1/SESSION_2026-09-25_WB-D2/code/wd1-city.js`

It already exposes global `FACADE_RULE v1`.

Use this as the starting shared rule for ordinary OSM buildings:
- deterministic window/door distribution;
- small size variation;
- small horizontal/vertical offset variation;
- mild asymmetry;
- repeatable from building/seed identity;
- avoid perfectly regular synthetic grids unless source semantics require them.

The successful Hürth/Alstädten distribution should be propagated to Cologne ordinary buildings instead of remaining zone-local.

Landmarks such as the Dom remain protected landmark owners; do not blindly apply ordinary-house facade grammar to landmark-specific geometry.

### Roof / shadow artefact donor
WB-D1 documented a recurring roof fix:
- `orientEG` corrects mixed triangle orientation;
- `FrontSide`;
- `shadowSide Back`;
- `normalBias 0.9`;
- concave footprints with solidity < 0.85 route to flat roof where needed.

This is a shared OSM presenter rule, not a one-off Hürth fix.

## 5 · Shadow / contact quality gate

Recurring defects to prevent globally:
- bright seam/band immediately below an attached roof;
- irregular dark lower-wall/ground edge;
- shadow acne;
- detached contact shadow;
- floating-building illusion caused by bad clipping/bias;
- actor/prop shadow detached from support surface.

World/OSM presentation gate must inspect:
1. roof-to-wall seam;
2. wall-to-ground contact;
3. shadow bias / normal bias;
4. near/far shadow-camera clipping;
5. support height versus visible terrain;
6. representative sun angles, not only one camera.

Do not “fix” floating objects by adding hidden plates.

## 6 · Cologne propagation

Next World/OSM integration must carry the already-proven shared rules into:
- Hürth / Alstädten;
- Cologne ordinary building stock;
- Cologne city-centre previews;
- landmark surroundings.

Dom/Hbf landmark geometry remains its own protected presentation source, but its placement/contact/shadow environment must obey the same global contact-quality gate.

## 7 · Graveyard status

The existing Graveyard slice is:
**CONCEPT PROTOTYPE / HISTORICAL DONOR ONLY.**

Not current gameplay evidence.

Known non-authoritative parts:
- asset placement;
- movement;
- world integration;
- graveyard gameplay.

Useful donor only:
- grave-light illumination;
- light flicker / atmosphere;
- concept of representing postmortems spatially in a future game-version of the Hub.

Do not ask Georg to review the existing Graveyard as a current playable product.

## 8 · Owner boundaries

- WorldBuilder / World Zone owns terrain/world placement.
- OSM presenter owns ordinary OSM building presentation rules.
- landmark owners retain landmark geometry.
- Resident module owns resident local arrangement/performance recipe.
- Animation Lab / Motion owners own animation sources/profiles.
- host provides sky/light/terrain facts for integrated scenes.

No second terrain, sky, shadow, animation or Resident runtime is introduced by this document.

## Immediate application

1. Reclassify Graveyard out of current Human Review.
2. Reclassify MUSIC-PERF current presentation to TUNE; preserve timeline/audio mechanics, replace canonical performance animation source with S39 where appropriate.
3. Future Resident module demos: no forced baseplate; use host support + WorldBuilder-compatible preview environment.
4. World Integration / OSM: propagate FACADE_RULE v1 and shared roof/contact-shadow fixes beyond Hürth to Cologne ordinary buildings.
