# Landmark deformation modes · source analysis · 2026-09-18

**Status:** SOURCE REVIEW + EXPERIMENTAL IMPLEMENTATION. No runtime owner changes.  
**Current test surface:** [Pilot 03](../landmarks/pilot-03/index.html)  
**Evidence:** [Pilot 03 summary](../evidence/2026-09-18-landmark-pilot-03/summary.json)

## 1 · Existing OSM City grotesque mode

The Hürth/Ehrenfeld City Lab already has a real three-level presentation split: `clean | cartoon | grotesque`.

Current source:
- `tools/osm-city-lab/src/style/cartoon-city.js` blob `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782`
- `tools/osm-city-lab/styles/kfb-city-v0.json` blob `f129cca3041b55b84de26048dad7aef8fac8b292`

The deformation grammar is deterministic per OSM identity and normalized to object height:
- taper in X/Z;
- twist increasing with height;
- quadratic bend plus linear lean;
- discrete vertical stack offsets for cubist staggering;
- ground stays anchored.

The current **grotesque** preset is:

```text
verticalSteps 8
bend          0.105
lean          0.09
taper         0.22
twistDeg      11
stackSteps    7
stackShift    0.065
```

City buildings work especially well because their `ExtrudeGeometry` is intentionally created with eight vertical steps before deformation. The grotesque camera is a separate amplifier: 76° FOV, filmOffset 10.5, mildly tilted up-vector, low oblique staging. Geometry and lens therefore both contribute to the current surreal/cubist read.

**Important contract:** this changes S1 presentation only. City S2 collision/export geometry remains undeformed.

## 2 · Older shared KFB Cartoon-Verbieger

The older shared donor still exists at:

`travel/wip/travel_globe_wsa/kfb-cartoon-deform.js`  
blob `22d1d537915ad7e552dbfa942ac3dd8c291886f2`

It explicitly describes the intended “Nickelodeon” grammar: object-normalized bend, lean, taper, twist and optional volume-preserving squash/stretch. It also contains the key implementation lesson for our landmarks:

> one shared bounding frame for the whole multi-mesh prop.

Without that, tower body, roof, windows and trim would each bend around different centers and the landmark would fall apart.

It also detects vertical segmentation. Fewer than four Y-rings cannot bend softly; the donor falls back to tilt+taper because a coarse box otherwise shears instead of curving.

This explains the main quality limit for our current low-poly landmarks: their **global silhouette can deform coherently**, but individual coarse boxes do not magically become rounded. More vertical rings/subdivision are a later quality lever, not a reason to replace the simple base models.

## 3 · Pilot 03 modes

Pilot 03 keeps Pilot 01/02 sources untouched and adds presentation modes:

### BASE
Unchanged authored landmark geometry.

### CITY GROTESQUE · exact
Uses the existing City `cityCartoonParams` + `deformPoint` with the current grotesque preset. The whole landmark shares one frame. The viewer also applies the wide City grotesque lens.

This is the cleanest A/B answer to “what happens if landmarks speak the same grotesque language as Hürth/Ehrenfeld?”

### SOFT CUBIST · rounded
Additive experiment, not a City preset. It uses the same object-normalized grammar with reduced stack severity plus a sinusoidal mid-body radial bulge. Feet remain anchored and the total Y scale is unchanged.

Purpose: move from purely crooked/cubist toward the rounder cartoon-body language Georg described without introducing smoothing/subdivision everywhere.

### GIZA · VOXEL STEPS
Giza-only. The existing 12/11/7 authored pyramid courses are converted into square slab steps derived from their actual course bounds.

Result in current source evaluation:
- 360 triangles;
- same overall Giza X/Y/Z envelope as base;
- same metre scale;
- no new reference dimensions invented.

### GIZA · BOXEL
Giza-only macro-block interpretation with small gaps between blocks.

Current result:
- 15,552 triangles;
- ground anchored;
- slightly smaller visible outer envelope because the gaps are real;
- deliberately a **block/LEGO-like massing study**, not yet a studded toy-brick model.

## 4 · Voxel / material donor already exists

The KFB repo already contains a mature box language:

- `travel/travel-v16/terrain-v16/voxel-terrain.js` — InstancedMesh box terrain;
- `skills/kfb-box-material.js` blob `3689661afa8f1b371ebcc40bfed994450c37cfa0`;
- `media/3D_Assets/KFB/edge3.jpg` blob `1e105dce9dd2cb2321833214040442fa8027eeca`.

So Georg's remembered **edge3** asset is real and current in the repo.

The box material already supports:
- carton / clay / felt / stone / paper / smooth procedural surface families;
- irregular edge framing;
- stochastic world-space texture treatment;
- stripes / hatch;
- optional “boiling line” vertex wobble;
- `edge3` as an edge-mask source.

**Decision boundary:** Pilot 03 does not yet wire this material into the landmarks. Geometry first remains the current user direction. A later BOXEL material pass can consume this donor instead of inventing a second voxel shader.

## 5 · Recommended mode grammar

For landmarks, do **not** make one universal “deform everything” switch.

Use three distinct presentation families:

```text
STRUCTURE
  base
  city-grotesque
  soft-cubist

BLOCK
  voxel-steps
  boxel

SURFACE  (later)
  clean
  paper/cardboard/clay/stone
  edge3 / procedural seams
  weathering
```

That separation matters:
- deformation changes silhouette;
- voxelization changes construction grammar;
- material changes surface read.

They can be combined later, but should not be conflated in the first tuning pass.

## 6 · Current evidence / limits

Exact GitHub sources were evaluated in Code Mode:
- 57 geometry/mode checks PASS;
- three additional syntax/reference checks PASS;
- all six landmarks preserve triangle count and ground anchor under City Grotesque and Soft Cubist;
- Giza Voxel Steps preserves the full base envelope;
- non-Giza Voxel/Boxel requests fail safe to base geometry.

No browser/WebGL or mobile result is claimed yet. No City/Travel/Race consumer has mounted these presentation modes. No OSM landmark binding was changed.

## 7 · Next visible gate

1. Open Pilot 03 in a real browser.
2. Compare **Spasskaya** and **Dom-like vertical architecture** in Base / City Grotesque / Soft Cubist.
3. Compare Giza Base / City Grotesque / Voxel Steps / Boxel.
4. Decide one shared deformation intensity before adding per-landmark exceptions.
5. Only then test `kfb-box-material` / `edge3` on BOXEL and a paper/clay surface on one normal landmark.

This keeps the accepted simple low-poly models as the source and treats style as reversible presentation.
