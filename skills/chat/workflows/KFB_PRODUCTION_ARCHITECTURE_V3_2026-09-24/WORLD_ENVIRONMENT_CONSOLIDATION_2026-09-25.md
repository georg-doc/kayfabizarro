# KFB World Environment Consolidation · Card Zones / Biomes / Procedural World / Nature · 2026-09-25

Status: **CURRENT ROADMAP · DONOR-PINNED · FIRST JOB READY**  
Owner: current Travel/WorldBuilder world owners + existing Card Zone owner.  
Purpose: consolidate useful older world slices into one coherent KFB world grammar without creating a new universal terrain engine.

## User direction

After the shared Environment Preview Host, consolidate and expand:

- Card Zones;
- biome logic;
- procedural worlds;
- environment + nature props;
- TinySkies-style asset-light / asset-less world construction from older slices.

The goal is not a retro-port of old prototypes. It is a source-backed product path into the current world owners.

## Current world truth

Current Travel implementation SSOT:

`georg-doc/KFB-Travel-Globe@8614282aab2ced43bb5dda9fcf7abadf9768100a`

Current binding macro-world rule:

**Travel/TinySkies remains the world.**

Voxel/Hex/BlockBits may remain selective local modes/modules, but must not replace the macro-world aesthetic or height truth.

### Exact high-value source pins

Terrain / biome:

- `travel/globe-v13/terrain-surface.js` · `9513347b6e3192dfefbeb3371085b13ac41ebb5d`;
- `travel/globe-v13/globe-biome.js` · `db3acf6ae6b7ebbc6cb4a7113a0d0fe782429d74`;
- `travel/globe-v13/simplex-noise.js` · current Travel main;
- `travel/globe-v13/boden-lesung.js` · current Travel main.

Nature / placement:

- `travel/globe-v13/ts-flora.js` · `3f9de0ee8624577ea85c73a3f101c00cfb4a38ee`;
- `travel/globe-v13/flora.js` · `9942577c79e65f92fba8314e0cc701c73b26ad55`;
- `travel/globe-v13/verteilung.js` · `ec72c8eb70e83a27046c9db5167c9f8b10fc2a1b`;
- `travel/globe-v13/natur-marken.js` · `b074c8a206972911de620b9942916c5388e9634e`.

Mood / sky:

- `travel/globe-v13/weltstimmungen.js` · `2747a526e2aa38989c9c4052304da8733662b61c`;
- `travel/globe-v13/sky-presets.js` · `04dd730ee735f064888e8472eff79583f17bebb0`.

TinySkies provenance/research:

- `docs/v13/QUELLE_tinyskies-Inventar.md` · `df2842452276019ff56e5706cb090ce388ebf33d`;
- `docs/v13/TS-DELTA-v12.md` · `581a6b03dd74e8b22c4532bbb813338be4f1be02`;
- upstream gold-standard reference: `dannylimanseta/tinyskies@2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`.

Card Zone authority:

- Card Zone Lab v2 full source · blob `e7bb09e49b2a885eb076e8c43c0ff561a9cebb72`;
- exact source-locked Fluid v2 donor · blob `97e3e0813cb5693a64863482ab96a601e88f5104`.

## What the old sources already teach us

### 1 · One surface truth

`terrain-surface.js` is the single radial displacement truth for visible terrain, support/physics and placement.

Never allow:

`visual terrain != collision/support terrain != prop/card placement terrain`.

Any new procedural World recipe must consume this seam or the receiving WorldBuilder equivalent. It must not duplicate the formula.

### 2 · Biomes are mixed domains, not theme switches

`globe-biome.js` already proves four softly mixed domains:

- Plateau;
- Spires;
- Shatter;
- Flatwater.

The domain field alters terrain character continuously while preserving the same global land/water threshold.

This is much stronger than switching one whole map between “forest / desert / ice”.

Future biome expansion should extend a continuous field/recipe model, not turn the world into hard square zones.

### 3 · Global world mood and local biome are separate axes

World/deck mood controls coherent palette/atmosphere.

Biome controls local terrain/nature character.

Keep them independent:

```
worldMood / deckMood
×
biomeField
×
surface topology
×
local authored content
```

A “red/cynic evening world” can still contain Plateau, Spires, Shatter and Flatwater.

### 4 · Asset-light nature is a first-class KFB strength

`ts-flora.js` is the strongest donor for broad world vegetation.

It deliberately builds vegetation instead of loading thousands of prop models:

- primitive/faceted procedural geometry;
- vertex-color AO;
- current shared rim light;
- height-aware wind;
- instancing;
- terrain/biome preference;
- no external GLB needed for the broad coverage layer.

This is the requested TinySkies asset-light/asset-less direction.

### 5 · Curated assets become accents, not wallpaper

`flora.js` remains useful for authored KayKit/Kenney compositions:

- a stump + mushrooms;
- a rock/tree group;
- hero tree;
- special flowers/details;
- named/local scene dressing.

Use these at intentional focal points.

Do **not** return to “scatter hundreds of unrelated GLBs over the whole world”.

### 6 · No blob scatter

`ts-flora.js` explicitly records the failed low-frequency density-field attempt.

The accepted lesson is:

- broad placement from even Fibonacci/nudge distribution;
- suitability from terrain height/slope/biome;
- local clustering only where clustering is intentional;
- boundaries follow terrain/biome facts, not round noise blobs.

`verteilung.js` owns the “nudge rejected sites instead of creating holes/clumps” method.

### 7 · Natural landmarks use terrain predicates

`natur-marken.js` demonstrates:

- lighthouse wants coast;
- volcano wants highland.

The semantic predicate chooses the location; the prop does not carry its own unrelated world RNG.

This pattern generalizes to:

- groves;
- rock formations;
- waterfalls;
- ruins;
- camps;
- caves/entrances;
- Card Zones;
- world events.

### 8 · Card Zones are content modules, not terrain replacements

Card Zone Lab v2 already docks into terrain through:

- carve;
- calm/quiet zone;
- plateau/support;
- fluid/hydrology;
- card-seeded palette/story parameters.

Future Card Zones should use the current host environment and terrain/support truth, not carry an old standalone voxel world around with them.

## Layer model

Use this conceptual stack:

```
Surface topology / support
  ↓
single TerrainSurface / height truth
  ↓
BiomeField
  ↓
WorldMood / palette / sky / light / fog
  ↓
Procedural Nature Base
  ↓
Curated Nature / Landmark accents
  ↓
Authored World modules
  ├─ OSM / landmark
  ├─ Resident scenes
  ├─ Race modules
  ├─ Card Zones
  └─ encounter/portal modules
```

Card Zones and authored modules may influence local presentation, but they do not become new macro terrain owners.

# Prepared production sequence

## WORLD-ENV-CONSOLIDATE-01 · Current world-environment contract

Status: **READY · P1**  
Executor: ChatGPT Web  
Can begin source/contract work in parallel with ENV-PREVIEW-01; runtime consumer integration waits for the preview-host seam.

### Outcome

One source-pinned environment/world recipe contract that references, rather than copies:

- surface/terrain provider;
- biome profile;
- world mood/palette;
- sky/light/fog profile;
- nature-base profile;
- curated-accent profile;
- optional natural landmarks/events;
- exact seed/source revision.

Prove one deterministic seed in:

1. current Travel consumer;
2. the shared Environment Preview Host or a neutral adapter shell.

Do not create a new terrain generator.

### Paste-ready start

> @GitHub  
> Read current KFB router/workflow/fresh-chat rules, Production Architecture v3, this World Environment Consolidation document, current Travel main and ENV-PREVIEW-01.
>
> Execute **WORLD-ENV-CONSOLIDATE-01**. Pin the current Travel/TinySkies-derived terrain, biome, mood, sky/light, TS-flora, curated flora, scatter and natural-landmark sources listed here.
>
> Define the thinnest versioned World Environment Recipe that references those owners. Do not copy their implementations into a new engine.
>
> Prove one deterministic seed/profile can be resolved in current Travel and in one neutral/shared preview consumer with the same resolved source facts.
>
> Preserve one height truth; keep WorldMood separate from BiomeField; retain the no-noise-blob scatter rule. Return exact pins, contract, tests/evidence and one next gate.

---

## WORLD-BIOME-MOOD-01 · Biome × World Mood product surface

Status: **HOLD · P1**  
Waiting for: WORLD-ENV-CONSOLIDATE-01.

### Outcome

A compact authoring/preview surface where Georg can vary:

- seed;
- biome-domain strength/sharpness;
- world/deck mood;
- day/evening/night or current source-backed atmosphere;
- palette family;

while seeing the **same** world/terrain truth.

Do not expose per-sample scratch internals as UI parameters.
Do not make biome a hard theme selector.
Do not turn this into a giant terrain morphology control panel.

---

## WORLD-NATURE-01 · Procedural Nature Base + Curated Accent Props

Status: **HOLD · P1**  
Waiting for: WORLD-ENV-CONSOLIDATE-01; ideally WORLD-BIOME-MOOD-01.

### Outcome

Productize two deliberate nature lanes:

### A · PROCEDURAL_BASE

From `ts-flora.js`:

- conifer;
- deciduous;
- shrub;
- grass;
- flowers;
- faceted procedural geometry;
- AO/vertex color;
- shared rim;
- height-aware wind;
- biome/height/slope suitability;
- instanced/culled rendering.

Broad world coverage should work with zero nature GLBs.

### B · CURATED_ACCENTS

From `flora.js` + Asset Librarian:

- authored kit trees/rocks/stumps/mushrooms/etc.;
- compositions/groups;
- hero props;
- local scene accents.

Keep accent density low and intentional.

Use existing scatter/site truth. No blob density masks.

---

## WORLD-RECIPE-01 · Procedural World Recipe

Status: **HOLD · P1**  
Waiting for: WORLD-BIOME-MOOD-01 + WORLD-NATURE-01 + accepted support/surface adapter seam.

### Outcome

One compact deterministic recipe can reconstruct a coherent environment from:

```json
{
  "seed": "...",
  "surface": "...",
  "terrain": "...",
  "biome": "...",
  "worldMood": "...",
  "atmosphere": "...",
  "natureBase": "...",
  "natureAccents": "...",
  "naturalLandmarks": []
}
```

First compare the same semantic recipe on the supported topology/host contexts where real adapters exist.

Do not invent a universal infinite-world engine.
Do not save millions of generated points if seed + parameters reproduce them.

---

## CZ-ENV-01 · Card Zone × Current Environment

Status: **HOLD · P1**  
Waiting for: ENV-PREVIEW-01 + CZ-RECIPE-01 or equivalent accepted Card Zone recipe seam.

### Outcome

Mount one real Card Zone in the current KFB environment rather than its historical standalone lab world.

The host supplies:

- current terrain/support;
- current sky/light/fog/palette;
- support/height facts;
- player/world lifecycle.

The Card Zone supplies:

- carve/calm request;
- plateau/local support recipe;
- exact fluid/hydrology;
- stack/reveal/Beam;
- Card Cube/Face Focus;
- card-seeded local presentation overrides;
- collection/reward event.

Local Card Zone palette/fluid treatment may bend the surrounding presentation through a bounded adapter, but must restore host state on exit/dispose.

No old voxel world is imported as a hidden second world.

# Suggested execution order

```
ENV-PREVIEW-01
      │
      ├── SPINDLE-01
      │
      └── WORLD-ENV-CONSOLIDATE-01
                │
                ├── WORLD-BIOME-MOOD-01
                │        │
                │        └── WORLD-NATURE-01
                │                 │
                │                 └── WORLD-RECIPE-01
                │
                └── CZ-ENV-01  ← after accepted Card Zone recipe seam
```

SPINDLE remains a named environment module. It does not become the macro-world owner.

# Acceptance direction

The successful result should feel like one KFB world language across:

- WorldBuilder;
- Resident Atlas;
- ToolBox / Animation Studio;
- Combat/Stage;
- Card Zones;
- later vehicles/NPCs/minigames.

The environment can change dramatically by seed/mood/biome, but it should no longer look like each tool invented its own renderer, light rig, ground plane and color system.
