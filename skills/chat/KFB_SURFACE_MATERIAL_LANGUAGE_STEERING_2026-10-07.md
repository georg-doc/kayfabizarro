# KFB Surface / Material Language · Georg Steering · 2026-10-07

Status: **CURRENT PRODUCT STEERING · ARCHITECTURE PREP · NO RUNTIME CHANGE**  
Owner: **KFB visual presentation / receiving World**  
Repo: `georg-doc/kayfabizarro`  
Branch: `planning/hybrid-baked-clay-texture-architecture-2026-10-07`

## Georg decision

The KFB world does **not** have to reproduce one specific clay texture, clay-floor asset or one fixed clay shader.

“Clay / Knetgummi” is a strong **game-design metaphor and visual reference profile**, not a mandatory implementation technology.

A different coherent material/shading solution is acceptable — including procedural shaders, mathematical patterning, toon/cel shading, matcaps, baked textures, vertex-color systems or hybrids — when the overall world look is intentionally art-directed around it.

## Revised architecture principle

Promote the abstraction from:

`KFB Clay Shader`

to:

`KFB Surface / Material Language`

The language owns:
- coherent palette/material response;
- stylized light/shadow readability;
- tactile or graphic surface character;
- silhouette/support/contact compatibility;
- distance behavior;
- cost envelope;
- family consistency across terrain, buildings, props, characters and OSM-derived geometry.

It does **not** require one exact texture source or one exact shader implementation.

## Candidate surface profiles

The architecture should permit bounded profile experiments such as:

### A · Handmade / Clay-like
- soft massing;
- subtle grain/tool marks/fingerprints;
- matte/waxy roughness;
- near-band microdetail;
- baked or procedural implementation.

### B · Toon / Cel
- discrete lighting bands;
- controlled palette ramps;
- optional outline/rim;
- very low texture dependence;
- strong scalability for OSM/procedural cities.

### C · Painted Toy / Matcap
- baked lighting/material response;
- cheap runtime;
- strong toy-object coherence;
- possible stylized gloss.

### D · Graphic / Procedural Pattern
- deterministic mathematical noise/patterns;
- palette quantization;
- procedural wear/marks;
- shared family parameters instead of unique textures.

### E · Hybrid
- baked low/mid-frequency surface;
- cheap toon/cel or stylized runtime lighting;
- optional near-only microdetail;
- runtime contact/shadow/environment integration.

Clay-like presentation is one profile among these, not the only acceptable result.

## Performance principle

Choose the lowest-cost representation that preserves the accepted visual language.

The current source-backed evidence already shows:
- terrain geometry was not the dominant cost in the recent lab;
- the heavy Clay fragment shader was;
- current browser 3D guidance already treats toon materials, matcaps, vertex colors, instancing and atlases as valid cheap stylized tools.

Therefore do not keep a heavy procedural shader merely because it is the historical Clay implementation.

## Procedural generation

Procedural buildings / OSM slices should be able to derive coherent surface families from deterministic rules:

`semantic geometry / recipe → SurfaceProfile → shared parameters / atlas / procedural pattern → cheap runtime material`

Possible variation inputs:
- stable object/OSM ID;
- district;
- building archetype;
- semantic role;
- height/age class;
- palette family;
- seed.

The surface system should generate controlled variety without unique expensive materials per object.

## Art-direction gate

A technical material approach is accepted only if the **whole scene** works as one world.

Compare candidates on:
- first-frame cohesion;
- terrain ↔ road ↔ building ↔ prop relationship;
- near / traversal / far read;
- hero landmark compatibility;
- silhouettes;
- palette;
- contact/shadows;
- mobile/desktop performance.

Do not accept a material in isolation and then force the world to inherit it.

## Updated lab recommendation

The bounded material lab should compare at least:

1. current K2/v10 clay-style path;
2. hybrid baked + cheap runtime shell;
3. pure/mostly toon-cel path;
4. one procedural mathematical/material-family path;
5. optional matcap/painted-toy variant if cheap.

Use the same:
- procedural building family;
- OSM block/district;
- hero landmark;
- representative terrain/road seam.

The winning direction may be Clay-like, Toon/Cel, procedural, or hybrid.

## UltraTex placement

UltraTex remains optional offline texture-authoring research.

It is useful only if the chosen Surface Language benefits from baked image-guided maps.

A Toon/Cel or mostly procedural final style may make UltraTex unnecessary for ordinary assets while still retaining it for hero/Frankensteined objects.

## Protected boundaries

This steering:
- does not change geometry/world ownership;
- does not authorize a second material runtime owner;
- does not add an Island MVP REQUIRED row;
- does not invalidate source-isolation;
- does not require UltraTex;
- does not require the original clay-floor texture;
- does not require exact Knetgummi simulation.

## Planning North Star

**One coherent stylized 3D toy world, not one sacred shader.**

The material system is successful when heterogeneous procedural, OSM, donor and Frankensteined geometry reads as one deliberate KFB world at acceptable runtime cost.

## One next gate

**BOUNDED KFB SURFACE-LANGUAGE LAB · CLAY vs HYBRID vs TOON/CEL vs PROCEDURAL**
