# KFB Surface / Material Language · Georg Steering · 2026-10-07

Status: **CURRENT PRODUCT STEERING · ARCHITECTURE PREP · NO RUNTIME CHANGE**  
Owner: **KFB visual presentation / receiving World**  
Repo: `georg-doc/kayfabizarro`  
Branch: `planning/hybrid-baked-clay-texture-architecture-2026-10-07`

## Georg decision

**Claybound remains the visual Gold Standard and primary acceptance reference for the KFB world.**

The KFB world does **not** have to reproduce one specific clay texture, clay-floor asset or one fixed clay shader. The implementation technology may change.

But “Clay / Knetgummi” is more than an optional mood: the **Claybound look is the default target because its materiality unifies forming, building, terrain, props and toy-scale world logic in one immediately readable visual metaphor.**

A different coherent material/shading solution — procedural, Toon/Cel, matcap, baked, vertex-color or hybrid — is acceptable only if it clears a **higher burden of proof**: it must preserve or improve the same whole-world cohesion, accessibility, toy/material logic and visual quality. It may not be accepted merely because it is cheaper or easier to render.

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

Claybound / Clay-like presentation is the **benchmark profile and default winner to beat**. Other profiles are challengers, not peer defaults.

## Performance principle

Choose the lowest-cost representation that still reaches the **Claybound-level visual target** or proves a clearly superior alternative visual metaphor.

The current source-backed evidence already shows:
- terrain geometry was not the dominant cost in the recent lab;
- the heavy Clay fragment shader was;
- current browser 3D guidance already treats toon materials, matcaps, vertex colors, instancing and atlases as valid cheap stylized tools.

Therefore do not keep a heavy procedural shader merely because it is the historical Clay implementation — but also do not trade away Claybound-level visual quality merely to make the shader cheaper.

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

The already-defined **Georg Visual Product Gate remains binding**. Material/shader experiments do not bypass it.

Claybound is the default comparison target. A technical material approach is accepted only if the **whole scene** works as one world and the screenshot/clip review shows that it reaches the intended product quality.

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

The default winning direction is the Claybound-equivalent result. Toon/Cel, procedural, matcap or hybrid may win only if direct same-scene evidence shows an equally strong or better world-level visual metaphor — not merely higher FPS.

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

**Claybound-quality first; implementation technology second.**

The Gold Standard is a coherent, tactile, accessible 3D toy world with the material unity Claybound already demonstrates. No specific shader or texture file is sacred, but the quality bar is.

The material system is successful when heterogeneous procedural, OSM, donor and Frankensteined geometry reads as one deliberate KFB world at acceptable runtime cost **without using performance as an easy escape from the visual target**.

## One next gate

**BOUNDED KFB SURFACE-LANGUAGE LAB · CLAYBOUND GOLD STANDARD vs CHALLENGERS · GEORG SCREENSHOT GATE**
