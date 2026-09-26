# Card Zone / Biome / Environment Recovery · 2026-09-26

Status: **RECOVERED · SOURCE-PINNED · DOCS-ONLY · NO RUNTIME / STAGE / LIVE CHANGE**

## Exact lane

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/production-architecture-v3-2026-09-24`
- Draft PR: **#204**
- owner: **KFB Web Architecture planning lane**
- runtime owner affected by the conclusions below: **current WorldBuilder / continuous-terrain owner**
- this note adds **no new production job** and does **not** reopen a second world runtime.

## 1 · Authority correction after the aborted chat

The useful environment work from 2026-09-25 survives, but one sentence in the earlier consolidation is stale.

**SUPERSEDED wording:** “Travel/TinySkies remains macro-world truth.”

**Current WorldBuilder decision, 2026-09-24 → 2026-09-26:**

- the world base is the current **continuous terrain**;
- Travel Globe is **not** the world base;
- TinySkies / Travel remain **mechanism and presentation donors** for sky, weather, light, mood, camera/flight ideas and selected procedural-environment techniques;
- OSM, Card Zones, voxel/hex content, landmarks and Race tracks are **placed/integrated content on the ground**, not alternate ground owners;
- there must be one support / terrain-height truth for visible terrain, placement and gameplay queries.

Everything below is interpreted through that current owner boundary.

---

## 2 · Recovered “biome” systems — keep the axes separate

The aborted discussion was not missing one biome list. The repository already contains several different systems that solve different problems. The main risk is overloading the word `biome` until morphology, ecology, narrative theme and mood become one accidental switch.

### A · Terrain morphology domains

Donor: `georg-doc/KFB-Travel-Globe@8614282aab2ced43bb5dda9fcf7abadf9768100a`
`travel/globe-v13/globe-biome.js`

Four soft domains:

- `plateau`
- `spires`
- `shatter`
- `flatwater`

The donor uses seeded anchor directions + a soft continuous weight field. The point is not the spherical implementation itself; the transferable rule is:

> **terrain morphology is a blended field, not a hard theme switch.**

The current WorldBuilder should consume the idea as `terrainDomain` / `terrainDomainWeights`, not inherit the Travel sphere as owner.

### B · Card Zone narrative/material themes

Current recovered source:
`tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/card-zone-lab-v3/zone-index.json`

Six existing theme vocabularies:

- `wellpappe_wildnis` · Wellpappe-Wildnis
- `zeitungsstadt` · Zeitungsstadt
- `filz_sumpf` · Filz-Sumpf
- `ton_ebenen` · Ton-Ebenen
- `holzsteg_werft` · Holzsteg-Werft
- `stein_katakomben` · Stein-Katakomben

Each has:

- material / texture language;
- adjacency;
- docks / connectors;
- `up / mid / down` register;
- mood/tint variants.

Treat this as **zoneTheme / materialNarrativeProfile**, not as terrain ownership.

The file itself already says it is a hand-curated seed/structure contract and that broader biome clustering can later emerge from the larger corpus.

### C · Card-derived procedural surface characters

Donor:
`.../card-zone-lab-v3/terrain-v10/world-context.js`

Separate procedural surface vocabulary:

- `scorched`
- `luminous`
- `tidal`
- `meadow`
- `fractured`
- `plateau`

These are derived from the card semantic vector and terrain-forming parameters. They are useful as **surface/ecology tendencies**, not as replacements for the material/narrative Card-Zone themes.

### D · Story mode / register / world mood

Recovered Card Zone registry:
`.../card-zone-lab-v3/zone-registry.json`

Current deterministic mapping:

- tragic → `filz_sumpf`
- comic → `zeitungsstadt`
- absurd → `wellpappe_wildnis`
- heroic → `ton_ebenen`
- mystical → `stein_katakomben`
- forbidden → `holzsteg_werft`

Register remains `up / mid / down`.

**World mood remains a separate axis**: sky, fog, lighting, palette, weather/time.

### Recommended naming clamp

Do not persist one overloaded `biome` field in the next recipe.

Use distinct fields:

- `terrainDomain` — morphology / relief;
- `ecologyProfile` — vegetation / rocks / natural distribution;
- `zoneTheme` — Card Zone material + narrative identity;
- `storyMode` + `register` — semantic context;
- `worldMood` — sky / light / fog / palette / weather.

This directly prevents three historical systems from becoming competing truths.

---

## 3 · Card → world rules already recovered

The old Card-Zone/Overworld material already contains a usable deterministic backbone.

### Card semantic vector

`world-context.js` uses eight dimensions:

- power
- lore
- name
- chaos
- wonder
- threat
- humor
- melancholy

### Three-card context

The recovered triplet weights are:

```text
current   0.60
next      0.28
nextNext  0.12
```

The current card dominates; upcoming cards bend the local world context.

### Existing terrain-forming outputs

`makeWorldContext()` already produces parameters including:

- height scale;
- terrain roughness;
- water level;
- color shift;
- surrealism;
- fog density;
- motion amplitude;
- palette/accent;
- audio energy/BPM context.

### Seed contract

Existing Card Zone registry uses deterministic card identity and stable seeds; older Overworld planning also used a hierarchy of run/page/zone/dungeon seeds.

**Transferable rule:** same semantic inputs + same seed = same environment recipe.

Do not make card semantics directly replace the terrain. They should modulate explicit axes.

---

## 4 · TinySkies: what it actually does, and what KFB improved later

Upstream source inspected directly, not inferred from a loaded demo:

`dannylimanseta/tinyskies@2659a5cc987d`

### Broad forest / trees

`client/src/game/Globe.ts`:

- `TREE_COUNT = 10000`;
- trees are generated procedurally;
- placement uses a seeded random surface candidate;
- candidate must be land;
- high elevation is rejected;
- a seeded 3D `forestNoise` field accepts/rejects broad forest regions;
- trees are emitted with `InstancedMesh`.

So the useful statement is:

> **TinySkies does not represent a forest as one authored forest GLB. It generates large vegetation populations procedurally and instances them.**

But its broad tree distribution is **not** purely Fibonacci/blue-noise; the pinned version uses random candidates + a broad noise acceptance field.

### Coastal coconut clusters

The same upstream `Globe.ts` has `COCONUT_CLUSTERS` and a dedicated coastal cluster path. This is an explicit ecological/situational cluster rather than uniform background scatter.

### Sparse semantic landmarks

`client/src/game/Braziers.ts` uses a different method:

- Fibonacci lattice candidates;
- seeded rotation;
- inland/coastline predicate;
- minimum angular separation;
- strict pass, then relaxed fallback.

**TinySkies therefore already mixes distribution strategies by object class.**

### KFB’s later distribution correction

Pinned KFB Travel donor:

- `globe-v13/ts-flora.js`
- `globe-v13/verteilung.js`
- `globe-v13/natur-marken.js`

KFB later changed the broad-Nature strategy deliberately:

1. procedural plant geometry instead of blanket external GLBs;
2. low-facet/cartoon primitives;
3. baked vertex-color AO;
4. rim contribution;
5. height-aware wind;
6. instancing;
7. terrain/biome suitability;
8. even candidate sites + local `nachruecken` repair;
9. occupancy/exclusion shared between prop families;
10. explicit clusters only where the cluster has meaning.

The important historical learning in `verteilung.js` is that **rejecting invalid samples without local repair creates both holes and clumps**. Its `nachruecken` approach moves rejected candidates locally instead of simply throwing them away.

The important historical learning in `ts-flora.js` is that a broad low-frequency density blob was rejected for KFB after it produced undesirable clumps/holes.

### Current recommendation

For the continuous WorldBuilder:

- reuse TinySkies/KFB **asset-light geometry, shader, wind, instancing and environmental filtering concepts**;
- reuse KFB’s **spacing / exclusion / local-repair** lessons;
- do **not** port the spherical Globe assumptions;
- do not copy TinySkies forest-noise verbatim as the only distribution rule.

For planar/local continuous terrain chunks, Poisson/blue-noise style spacing is a strong default; Fibonacci/nudge remains useful where global/even candidate coverage or deterministic world-scale sampling is desired.

---

## 5 · Standard procedural-environment pipeline

The external research and the existing KFB donors converge on a conventional layered pipeline:

```text
authoritative terrain/support query
→ stable candidate samples
→ environmental suitability
→ exclusions / priorities
→ weighted family/species choice
→ local cluster grammar where intentional
→ orientation / scale / variant
→ instancing / batching / LOD
→ sparse authored accents
→ semantic landmarks
```

### 5.1 Candidate generation

Use a method appropriate to scale:

- macro region / world samples: grid+jitter, Fibonacci-like even candidates, or stable chunk seeds;
- vegetation / rocks in local terrain chunks: Poisson / blue-noise style minimum-distance scatter;
- micro detail: denser local grid / sample layer;
- authored clusters: explicit child layout around a cluster center.

### 5.2 Suitability field

The placement score should be a product/combination of real environment facts, e.g.:

- height band;
- slope;
- curvature;
- moisture/water distance;
- coast distance;
- terrain-domain weights;
- ecology profile;
- distance to paths/roads;
- distance to OSM building footprints;
- Race corridor distance;
- Card Zone footprint/mask;
- authored keep-clear masks.

### 5.3 Exclusions before decoration

Hard constraints should win before aesthetic randomness:

- road;
- track;
- building footprint;
- collision/recovery corridor;
- entrance/portal;
- Card Zone access;
- water where the species is not aquatic;
- authored landmark clear space.

### 5.4 Hierarchical density

Do not use one density scale for everything.

Typical split:

- macro: large trees / boulders / landmarks;
- meso: shrubs / rocks / fences / secondary props;
- micro: grass / flowers / pebbles / litter / ground accents.

This also maps cleanly to chunk activation and LOD.

---

## 6 · “Rule of Three” recovered — two different uses

The repository already contains a Rule-of-Three SceneKit proposal:

`Anchor · Support · Accent`

Definitions:

- **Anchor** — dominant readable object / landmark / resident / vehicle / structure;
- **Support** — contextual cluster establishing the place;
- **Accent** — interactive, collectible, surprising or narrative object.

Important clamp from the existing document:

> This is a **composition policy**, not a demand to force every scene into exactly three meshes.

### Use it for authored/signature composition

Good targets:

- Card Zone hero corner;
- roadside set piece;
- tiny village/hamlet;
- OSM plaza embellishment;
- track-side scenic beat;
- shrine/camp/ruin;
- curated KayKit/Kenney/Tiny-Treats arrangement.

### Do not use it as the forest algorithm

Broad nature should use ecology + distribution.

Inside an intentional cluster, an odd/asymmetric grammar is useful:

```text
1 dominant
+ 1–2 supports
+ 0–2 accents
= usually 3–5 readable elements
```

This gives the authored cartoon clarity without turning ten thousand trees into repeated triplets.

---

## 7 · OSM → cartoon world seam

The Cologne/Race work already proves a useful direction:

- real OSM footprints remain the geographic fact;
- height/real public dimensions can remain factual inputs;
- KFB cartoon grammar deforms/stylizes the body;
- authored low-poly modules supply details that OSM does not contain.

Existing Cologne work has already used:

`OSM footprint + public dimensions + authored low-poly modules`

and the existing cartoon-city / BuildingElastic grammar.

### Proposed environment integration

OSM should contribute fields/masks, not a second terrain:

```text
OSM roads / footprints / water / parks
→ authoritative urban masks
→ WorldBuilder terrain carve / support blend
→ cartoon-city building grammar
→ shared ecology exclusions + edge falloff
→ sparse signature props
```

The transition out of an OSM district should therefore be continuous:

- dense urban footprint;
- street-edge props;
- courtyards / trees;
- suburban / park density;
- field / scrub / forest;
- broad procedural landscape.

No hard “OSM world ↔ procedural world” swap is needed.

For fictional/non-OSM settlements, the same building style grammar can consume seeded plots instead of OSM footprints, so both read as one cartoon anatomy.

---

## 8 · Race Track → environment seam

Recovered Dropbox source:
`KFB_P31_PROCEDURAL_TERRAIN_TRACK_SUPPORT_v0_2.md`

North Star:

> **Track first, terrain supports it.**

Recovered owner split:

### Track owns

- drivable surface;
- centerline / ports / continuity;
- collision contract;
- stunt/recovery logic.

### Terrain owns

- shoulders;
- banks/cliffs;
- biome/ecology ground;
- horizon/landscape support.

Recovered band model:

```text
Band 0 · Track
Band 1 · Safety Shoulder
Band 2 · Scenic Support
Band 3 · Landscape
```

### Current integration target

The shared seam should look like:

```text
track spline / modular sockets
→ corridor envelope
→ terrain carve/blend request
→ safety shoulder
→ scenic-support falloff
→ ecology exclusion/density field
→ landscape scatter
→ authored roadside beats
```

The environment generator must **not** become a second track topology owner.

The same modifier/exclusion mechanism should be usable by OSM roads, tracks and Card Zones while WorldBuilder remains the one terrain/height owner.

---

## 9 · Proposed thin EnvironmentRecipe

This is a contract sketch, not a new runtime owner:

```json
{
  "seed": 0,
  "surfaceOwner": "WorldBuilder",
  "terrainDomain": {
    "weights": {},
    "relief": 1,
    "roughness": 1
  },
  "cardSemantics": {
    "cardIds": [],
    "vector": {},
    "storyMode": "heroic",
    "register": "mid"
  },
  "zoneTheme": {
    "id": "ton_ebenen"
  },
  "worldMood": {
    "preset": "..."
  },
  "ecologyProfile": {
    "families": [],
    "heightBands": {},
    "slopeLimits": {},
    "moisture": {}
  },
  "distribution": {
    "method": "poisson|blueNoise|fibonacciNudge|cluster",
    "minSpacing": 0,
    "density": 0,
    "clusterRecipes": []
  },
  "exclusions": [
    "osmFootprints",
    "roads",
    "raceCorridors",
    "cardZoneClearance"
  ],
  "accents": [],
  "landmarks": [],
  "authoredModules": []
}
```

The recipe references existing source identities. It does not absorb or rename those owners.

---

## 10 · Asset policy recovered

The existing Card Zone asset index already supports deterministic source selection using metadata including:

- role;
- biome/theme tags;
- story mode;
- natural scale;
- pack/source identity;
- seed.

Current policy for broad environments:

### Procedural base

Use procedural/generated geometry for high-count background nature where possible:

- tree bodies/canopies;
- shrubs;
- grass/flowers;
- simple rocks;
- terrain marks.

### Curated sparse accents

Use real registry-backed assets for signature/readable content:

- KayKit;
- Kenney;
- KFB originals;
- Tiny Treats where source identity is verified in the active registry/source path;
- authored OSM landmark modules.

Do not blanket-scatter expensive authored GLBs merely because they are available.

---

## 11 · Acceptance matrix for the future Nature/Environment proof

A useful first proof should test behavior, not just visual density.

1. **Determinism** — same seed + same inputs reproduce the same placements.
2. **Mood independence** — changing sky/light/fog does not silently move geometry.
3. **Terrain-domain response** — changing morphology/ecology visibly shifts suitable nature.
4. **Single height truth** — sculpted terrain reprojects/revalidates placements; no floating/sunken duplicate height source.
5. **Track exclusion** — zero vegetation intrusions into drivable/recovery corridor.
6. **OSM exclusion** — zero trees/rocks through authoritative building/road footprints unless explicitly allowed.
7. **Card Zone seam** — host terrain continues through the zone; local modifier/carve is explicit.
8. **Spacing** — no accidental high-density clumps caused by rejection bias.
9. **Intentional clusters** — selected families visibly form designed clusters where requested.
10. **Rule-of-Three read** — at least one authored scene beat shows Anchor/Support/Accent clearly without forcing every scatter point into a triplet.
11. **Source identity** — curated accents report exact source IDs/revisions.
12. **Performance** — high-count families are instanced/batched; macro/meso/micro activation is measurable.
13. **Reload** — saved recipe reconstructs the same scene from references + seed rather than a scene dump.

---

## 12 · Recovered route

The earlier architecture already prepared:

1. `ENV-PREVIEW-01` — current shared World presentation in real consumers;
2. `WORLD-ENV-CONSOLIDATE-01` — thin source-referenced environment recipe;
3. `WORLD-BIOME-MOOD-01` — separate morphology from mood;
4. `WORLD-NATURE-01` — procedural Nature + sparse curated accents;
5. `WORLD-RECIPE-01` — persist/reconstruct environment;
6. `CZ-ENV-01` — Card Zone consumes the host environment.

### Correction required before implementation

When `WORLD-ENV-CONSOLIDATE-01` is executed, update its host ownership to the **current WorldBuilder continuous-terrain owner**. Travel/TinySkies remain pinned donors, not macro-world truth.

### Track coupling

Race/Track should consume the same terrain modifier / exclusion / scenic-support seam through its current track owner. Do not fork a parallel environment system inside Race.

---

## 13 · What the aborted chat had effectively delivered

Recovered and now source-pinned:

- the correct layered environment idea;
- separation of BiomeField and World/Deck Mood;
- procedural Nature base + sparse signature assets;
- deterministic scatter and intentional clusters;
- Card Zones as host-world modules;
- the existing Card→semantic-vector→seed machinery;
- Track-first / terrain-supports-it corridor architecture;
- OSM factual geometry + cartoon style grammar;
- Rule-of-Three as authored composition policy;
- a clear reason not to use one giant “biome switch”.

What had **not** been completed:

- owner-corrected WorldBuilder EnvironmentRecipe;
- a continuous-terrain Nature proof;
- unified OSM/Track/CardZone exclusion/modifier masks;
- a local Poisson/blue-noise vs Fibonacci/nudge A/B on the current WorldBuilder;
- a first environment proof with real KayKit/Kenney/Tiny-Treats accents;
- Stage/browser acceptance for that environment proof.

---

## Exactly one current gate

The architecture lane’s existing global gate remains:

**`ENV-PREVIEW-01` · complete the real-consumer human/Stage comparison.**

After that gate, the first environment-specific implementation should be the **owner-corrected `WORLD-ENV-CONSOLIDATE-01`**, using this recovery memo as the source map.

No merge / Live promotion is authorized by this note.
