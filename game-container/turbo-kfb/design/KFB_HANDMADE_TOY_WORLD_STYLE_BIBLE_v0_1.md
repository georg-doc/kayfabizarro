# KFB Handmade Toy-World Style Bible v0.1

**Status:** CURRENT DESIGN PROPOSAL · not runtime ownership · not Live
**Date:** 2026-09-29
**Owner context:** KFB Game Container / Joyride World
**Human:** Georg

## 1 · One-sentence direction

**KFB is a handmade DIY toy world: clay-first characters and hero props live inside a mixed-material stop-motion playground built from cardboard, paper, wood, felt, fabric, toy plastic, bottle caps and boardgame parts. Simple geometry is a feature when its material and behaviour make it feel intentionally handmade.**

This extends the physical origin of KFB itself: printable cards, cut/pasted deck pieces, cardboard, improvised markers and bottle-cap actors.

## 2 · The hierarchy

### A · Characters · CLAY-FIRST
Characters are the strongest continuity layer.

Default:
- clay / plastilin body read;
- rounded, slightly imperfect silhouette;
- inserted toy eyes / plastic beads / googly-eye logic are welcome;
- clothing may use non-clay material identities: leather, felt, fabric, fur, stitched patches, buttons;
- preserve the real KFB/KayKit character identity and rig. Do not redesign the character to fit a material effect.

A character may look assembled from several real craft materials, but must still read as one stop-motion puppet.

### B · Hero props and vehicles · CLAY / TOY HYBRID
Vehicles, radios, card tables, weapons, signature props and interaction objects may mix:
- clay bodywork;
- painted wood;
- enamel / toy metal;
- plastic knobs;
- bottle caps;
- cloth seats;
- cardboard panels;
- boardgame bits.

Examples are allowed to be absurd: bathtub vehicle, bottle-cap wheels, card-board spoilers, clay exhausts.

### C · World structures · HANDMADE MIX
The environment is not required to be pure clay.

Use whichever low-cost geometry is best, then assign a coherent craft-material story:
- flat / folded surface → cardboard, paper, felt, cloth;
- simple box → cardboard carton, foam block, wood block, boardgame building;
- cylinder / pole → dowel, straw, rolled paper, modelling stick;
- repeated small blocks → dominoes, tiles, boardgame pieces;
- thin planes → paper signs, stitched banners, taped cards;
- terrain blobs / berms → clay, papier-mâché, foam, felt-covered forms;
- barriers → wood rails, clay lips, toy plastic, stacked card strips.

**Structural limitation becomes visual fiction.** Do not hide simple geometry with generic realism.

## 3 · Visual coherence rules

A mixed-material world stays coherent through:
1. one harmonic world palette per biome;
2. consistent toy scale and chunky silhouette;
3. matte / tactile surface response;
4. warm-white neutral key light; material carries colour, not saturated lighting;
5. rounded or softened joins where practical;
6. repeated handmade construction cues: seams, tape, stitches, pressed edges, dents, folds, pins;
7. sparse hero detail rather than uniform micro-detail.

Reference direction:
- K2 clay-material v10 is the current KFB clay base donor;
- T4 track / transition grammar is the current useful road-to-world look donor;
- World Core R0A is a visual/recipe donor only, not a runtime or performance baseline;
- ClayBound is a material/form reference, not a replacement character design.

## 4 · Material families

### Primary
- clay / plastilin;
- painted cardboard;
- rough paper;
- soft / painted wood;
- felt;
- woven fabric;
- toy plastic.

### Accent
- bottle caps / toy metal;
- beads / plastic eyes;
- tape;
- string / rope;
- straw / model grass;
- leather patches;
- cork / foam;
- buttons / pins.

### Special-biome options
Papercraft is a **material family**, not a mandatory competing global style. A whole zone may lean papercraft/pop-up-book if desired, while characters and hero props remain compatible with the KFB puppet language.

## 5 · Palette

Start from the successful KFB ClayBound/T4 family rather than creating a new random palette.

Rules:
- 5–8 dominant colours per world;
- strong but harmonious hue separation;
- ground, road, vegetation, structures and accents must read at driving speed;
- no photoreal neutral-grey asset-store drift;
- lighting stays warm-white / neutral enough that teal, orange, violet and green materials remain their intended colour;
- biome variants may rotate palette roles while keeping saturation/value relationships.

The exact palette lives in the world recipe, not in hardcoded shader magic.

## 6 · Handmade surface grammar

Avoid a universal “clay filter”.

Use role-specific treatment:
- character / hero clay: strongest tactile relief;
- large clay terrain: broad deformation + subtle fine relief;
- cardboard: fibre / fold / edge wear, not clay dents;
- fabric/felt: soft roughness and weave impression;
- wood: simple grain / painted craft wood;
- toy plastic: smoother but not glossy-real;
- paper: thin, slightly warped, printed/collage-friendly.

No fake fingerprint overlay pasted uniformly across every object.
No repetitive global noise.
No material effect that destroys source colour hierarchy.

## 7 · World as Toy · reactivity tiers

Everything does not need full physics.

### Tier A · Hero reactive
Use actual gameplay/physics when it matters:
- domino chains;
- crashable card houses;
- breakable signs / sheds / towers;
- rolling barrels / balls;
- stunt props;
- destructible set pieces;
- vehicle / resident interaction props.

### Tier B · Cheap reactive
Use inexpensive scripted motion:
- wobble;
- squash;
- spring;
- recoil;
- hinge;
- sway;
- bounce;
- short procedural breathing.

Examples: lamp posts, banners, shrubs, cardboard buildings, signs.

### Tier C · Ambient fake-life
Shader or transform only:
- subtle breathing terrain;
- cloth/felt flutter;
- tiny scale pulse;
- wind lean;
- colour/roughness drift.

The goal is **a world that appears alive**, not a world in which every object runs a rigid-body solver.

## 8 · Joyride behaviour language

The look and physics should tell the same story:
- collision should tend toward bounce / slide / recovery rather than dead-stop punishment;
- spectacular flips are desirable if recovery is fast;
- stunt surfaces should look inviting and readable from speed;
- soft toy/clay materials make exaggerated impacts plausible;
- destruction should break into chunky, readable pieces;
- failure should frequently become spectacle rather than reset.

The material bible does not own vehicle physics; it supplies surface classes, visual cues and reaction sockets for the runtime owner.

## 9 · Road / world language

Roads are not “race tracks” by default.

World composition may include:
- cruise roads;
- scenic routes;
- dirt paths;
- bridges;
- tunnels;
- loops;
- wall rides;
- boost gates;
- jump gaps;
- destruction pockets;
- resident pockets;
- garages;
- billboards;
- portals;
- card / deck POIs.

Existing KFB track pieces are reused as **kinetic attractions** inside the world.

## 10 · Performance doctrine

Performance is part of the style.

Prefer:
- spline / procedural road strips;
- simple extrusions;
- instancing;
- repeated material atlases;
- low-poly silhouettes;
- generated / computed structures;
- a small number of hero GLBs;
- LOD / chunking;
- cheap distant materials;
- scripted reactivity over full physics where possible.

Do not copy World Core R0A as a runtime budget. Its design preview was ~404k scene triangles, 313 draw calls and ~6 fps with expensive K2 treatment everywhere. Its **recipe/look logic is useful; its cost is not the target**.

Use material tiers:
- HERO = full clay/craft detail;
- MID = reduced tactile material;
- FAR = flat palette + silhouette.

## 11 · Meta-narrative permission

When a primitive or low-cost construction is visibly simple, explain it with the world:
- a flat wall is cardboard;
- a repeated barrier is dominoes;
- a tower is stacked game pieces;
- a bridge is craft sticks;
- a billboard is a taped card;
- a tree canopy is felt balls / clay spheres;
- a portal is a punched-out boardgame token.

Do not apologise for low-poly forms. Make them diegetic.

## 12 · Do not do

- no generic asset-store realism;
- no “everything is clay” monoculture;
- no random material soup without palette/scale unity;
- no second character design owner;
- no second renderer;
- no mandatory heavy texture stack on every mesh;
- no TinySkies code reuse in a clean KFB runtime; use only independently implemented visual principles where legally appropriate;
- no World/Material system that becomes a new movement or physics owner.

## 13 · Visual acceptance question

A useful world sample should answer:

> **Does this feel like one strange handmade KFB toy box in motion — where a clay character, a cardboard house, a wooden ramp, a felt hill and a bottle-cap sign obviously belong to the same playful universe?**
