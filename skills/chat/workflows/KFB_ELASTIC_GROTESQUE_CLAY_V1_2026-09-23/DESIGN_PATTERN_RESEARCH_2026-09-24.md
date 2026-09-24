# DESIGN PATTERN RESEARCH · Hürth 01 recovery · 2026-09-24

Status: **RESEARCH RESULT · NO IMPLEMENTATION**
Owner: **OSM City Lab presentation / KFB ToolBox authoring**
Parent recovery:
`FAILURE_RECOVERY_HUERTH01_R2_2026-09-24.md`

Purpose:
replace seeded/random visual placement and layered patch repair with known composition and computational-geometry patterns.

## 1. Facade rhythm: repetition with meaningful variation

Research pattern:
- rhythm is a controlled beat, not copy-paste and not randomness;
- repetition establishes identity/readability;
- variation should have a reason;
- entrances / anchors may intentionally break the rhythm;
- progression / alternation / flowing rhythm are established ways to vary repetition.

Relevant references:
- ArchitectureCourses: rhythm/repetition should have a reason; rhythm is a controlled beat with meaningful changes.
- ArchDaily examples:
  - Tegel Quartier: repeated identical elements gain life through continually varied application;
  - 20 VPO: repetition and variation define the compositional traits;
  - Botany Road: consistent repetition is deliberately varied to avoid an oppressive facade.

### KFB translation

Do not place each window independently from RNG.

Use a facade grammar:

1. **Primary rhythm / bays**
   - derive 2–4 approximate bays from facade length;
   - retain a recognizable interval family.

2. **One anchor break**
   - one door/entrance is the primary interruption;
   - its position may shift off-center but must create a compositional reason for nearby gaps.

3. **Grouped windows**
   - use 1–2 window clusters per facade;
   - small gaps within cluster;
   - larger gap between cluster / door / corner.

4. **Controlled variation**
   - alternate `A-B-A`, `A-A-B`, or gradual `A→B→C`;
   - vary height/width/offset within a bounded family;
   - never independently sample every parameter.

5. **Street-level cadence**
   - neighbouring buildings should not choose unrelated patterns independently;
   - pick one block motif, then vary it over 3–5 buildings.

## 2. Gestalt grouping

Known principles:
- **similarity** groups elements with shared shape/color/size;
- **proximity** groups elements by spacing;
- **continuation** makes the eye prefer continuous lines/curves over fragmented objects;
- **uniform connectedness** makes visually connected pieces read as one unit.

### KFB translation

Facade:
- windows share one family shape per building;
- door differs enough to be the anchor, but uses same palette family;
- window clusters use proximity intentionally;
- roof/body and road/path should use physical/visual connectedness, not overlapping parts that merely touch.

Road implication:
the current patched R2 violates continuation + connectedness: the eye sees the seams.

## 3. Asymmetrical balance

Known principle:
asymmetrical compositions may use unequal placements while retaining equal visual weight.

### KFB translation

Do not center everything and do not randomize everything.

For each visible facade:
- compute left/right visual weight from openings;
- allow the door to sit off-center;
- balance that door with a window cluster or stronger opening on the opposite side;
- allow one quiet side and one active side if the whole building remains balanced.

This matches the desired wonky-cartoon read better than symmetry while avoiding visual noise.

## 4. Colour hierarchy, not random colour assignment

Known patterns:
- analogous palettes = cohesion;
- complementary palettes = stronger contrast;
- triadic palettes = energetic but balanced;
- 60/30/10 is a common hierarchy heuristic for dominant / secondary / accent colour.

Existing KFB donors already support harmonic hue relationships:
- Racer Cologne `makePalette()`:
  - `analog`
  - `komplementaer`
  - `triade`
  - `split`
  - `tetrade`
- WorldContext:
  - story-mode palette owner;
  - card semantic seed pipeline.

### KFB translation

Per block / street segment:
- choose **one** harmonic palette seed;
- do not reseed each building independently.

Suggested area budget:
- **dominant**: wall family;
- **secondary**: roof family;
- **accent**: doors + selected windows.

Do not literally enforce 60/30/10 by polygon area in the first proof.
Use it as hierarchy:
- wall dominates;
- roof supports;
- openings accent.

Neighbour cadence proposal:
- wall colour sequence follows a motif, e.g. `A A B A C`, not random picks;
- roof uses a stable companion relation to wall;
- door accent may repeat every 2–3 houses;
- window colour should usually stay quieter than the door.

## 5. Rocko / wonky architecture constraint

Known reference description:
`Rocko's Modern Life` deliberately avoided parallel lines and used crooked architecture, producing a “wonky bent feel.”

### KFB translation

The wonkiness belongs primarily to:
- silhouette;
- roof line;
- facade axes;
- whole-block rhythm.

It should **not** come from random window scatter or random colour noise.

## 6. Roof/body unity

Useful real architectural precedent:
Villa BW / Mecanoo:
- facade and roof use one continuous material language;
- vertical joints continue from facade into roof;
- colour ratios were studied;
- variation avoids flattening;
- the continuous system makes curved roof/facade surfaces read less segmented.

### KFB translation

Next isolated house proof:
- wall and roof share the **same final eave boundary vertices**;
- roof is generated from that boundary, not from a separately offset floating ring;
- prefer one mesh / shared vertex ring with material groups, or a guaranteed welded seam;
- one low-frequency deformation field drives both wall-top and roof-base;
- normals at the eave are intentionally designed:
  - smooth continuous if clay-shell;
  - controlled crease only where stylistically required;
- test one neutral material first;
- colour/shadows only after silhouette/body union passes.

## 7. Roads / paths: single planar surface topology

Research pattern from Clipper2:
- open polylines can be offset/inflated with explicit join/end types;
- polygon unions merge overlapping regions;
- intersecting polygon inputs should be unioned/cleaned rather than independently offset and overlaid;
- redundant segments should be simplified because they can create blemishes.

Research pattern from Mapbox Earcut:
- triangulation expects valid non-overlapping polygon rings;
- overlapping/self-invalid inputs can create gaps, outside triangles or other failures;
- triangulate only after geometry has been cleaned.

### Required KFB road pipeline

```text
OSM centerlines
  ↓ clean/simplify
buffer/offset each line to ROAD polygons
  ↓
BOOLEAN UNION → one ROAD REGION
  ↓
buffer/offset to OUTER STREET/CURB REGION
  ↓
DIFFERENCE outer - road → one CURB/SHOULDER REGION
  ↓
paths buffered to PATH REGION
  ↓
boolean partition / priority rules at intersections
  ↓
ONE PLANAR ARRANGEMENT WITH SHARED BOUNDARIES
  ↓
triangulate each non-overlapping material region once
  ↓
lift to terrain / presentation surface
```

Hard rule:
- shared intersection vertices/edges;
- no junction discs;
- no visual patch polygons;
- no coplanar overlaps;
- no renderOrder/Y-offset/polygonOffset as topology repair.

Potential implementation tools to evaluate in a future isolated proof:
- Clipper2-style offset + union/difference;
- existing Three.js/Earcut triangulation after valid polygons exist.

Do not select or vendor a library until an isolated T-junction proof is approved.

## 8. Shadow banding research

Three.js LightShadow docs:
- tiny `bias` adjustments can reduce artifacts;
- `normalBias` may reduce shadow acne but can distort shadows;
- larger `mapSize` improves quality at cost;
- importantly: **shadow `radius > 1` may cause unwanted banding**.

R2 code currently contains:
`sun.shadow.radius = 2`.

Therefore:
- **PROVEN:** R2 uses a setting that Three.js documentation explicitly warns can create banding.
- **UNKNOWN:** whether this is the only cause in Georg's screenshots.
- **DO NOT:** perform another blind bias/normalBias/radius tune on the city block.

### Next isolated shadow test

One neutral house + ground:
1. geometry only, shadows OFF;
2. directional shadow ON, `radius=1`, `bias=0`, `normalBias=0`;
3. tightly fit shadow camera;
4. raise mapSize only if needed;
5. change one parameter at a time;
6. fixed camera crop before/after;
7. only re-enable clay materials after geometry/shadow integrity passes.

## 9. Proposed facade grammar for the next isolated proof

This is a KFB synthesis of the researched principles, not an external canon.

Per facade:

```text
EDGE
  → derive bay rhythm
  → choose one door anchor on primary facade only
  → form 1–2 window groups by proximity
  → apply one controlled rhythm pattern
       A-B-A
       A-A-B
       A→B→C
  → calculate asymmetrical visual balance
  → apply colour hierarchy from one block palette
```

Across a block:

```text
BLOCK MOTIF
  building 1: A
  building 2: A'
  building 3: B
  building 4: A''
  building 5: C accent
```

Variation is inherited, not independently random.

## 10. Exactly one next gate

Build **three isolated proofs only**, not Hürth block R3:

A. one T-junction from a single unioned planar topology;
B. one bowed house with welded/shared roof-body eave, neutral material;
C. six simple facades demonstrating deterministic rhythm families + colour hierarchy.

Only if all three visually PASS may a new Hürth candidate branch be opened.
