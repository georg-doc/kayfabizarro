# KFB Open World · Visual Terrain Recovery Lab · Donor Findings · 2026-10-07

Status: **DONOR EVIDENCE · NO RUNTIME OWNER · NO NEW MVP SCOPE**
Receiving owner: **KFB WorldBuilder / WB2 · PR #348**
Source read from private Dropbox:
`/CLAUDE/KFB Open World Visual Terrain Recovery Lab/docs/HANDOVER_WSA_LAB_DONORS_2026-10-07.md`
and its companion proposal:
`/CLAUDE/KFB Open World Visual Terrain Recovery Lab/docs/KFB_ISLAND_UNIVERSE_PROPOSAL_2026-10-07.md`.

This GitHub file is a **sanitized execution summary** of the reusable technical findings. It deliberately does not copy the private proposal wholesale and does not promote proposal-only story/schema/topology decisions.

## 1 · Road / Track Core findings

### Route-intent → Track Core adapter
The lab donor adapts each RoadGraph edge into a Track-Core CONNECT route and uses Track Core v0.12 as the construction reference.

KEEP as donor idea:
- RoadGraph = planning/topology intent only.
- Track Core remains construction/contact owner.
- continuous routes per edge avoid the seam/wedge/folding failure of the abandoned per-cell Bézier sweep.

### Height fit
The lab `fitHeights()`:
- samples Surface Truth;
- includes village plateau / bridge lift context;
- smooths along the route;
- pins node heights.

Use only as a Surface-Truth/Track integration donor. It must not become a second height owner.

### Roundabout / junction facts
The lab found:
- Track Core ROUNDABOUT with **STANDARD arms refuses some 60° hex-arm configurations**.
- A working donor configuration used:
  - island radius: **6.6**
  - ring profile: **NARROW**
  - fillet: **6**
  - splitter: **0**
  - arm length: **18**
  - fallback arm lengths tried: **9 / 12**
- Seed 97 lab result: **77 roundabouts, 4 plate fallbacks**.
- **T-junction / ordinary intersection is missing in Track Core v0.12**.
- the lab plate fallback has an open defect: a passing edge can cut the plate.

Binding interpretation:
- these numbers are **donor evidence, not canon**;
- the first Island must use a Track-Core-supported real junction/roundabout that compiles cleanly;
- **plate fallback is not accepted**;
- do not perfect a parallel custom road renderer;
- if the required route truly needs a missing T/Y/4-way primitive, implement it in the **Track Core owner**, not in Island code.

### Scale
The lab used a uniform **K = 0.375** adapter scale to bring Track STANDARD 14.4 m to ~5.4 m.

Binding interpretation:
- useful evidence only;
- final scale belongs in a proper Track profile/family, not as a hidden island adapter constant.

## 2 · Joyride presentation donor findings

The lab road presentation used one topology with blends for:
- rural;
- village;
- race;
- bridge.

Useful donor details:
- village kerb + sidewalk;
- rural sand shoulder;
- red/white race kerbs;
- bridge parapet/deck;
- markings as separate non-shadow-casting mesh.

Binding owner remains:
**Track Core construction → Surface Truth support → Joyride presentation**.

## 3 · Terrain / transition donor findings

Useful lab donor seams:
- continuous base field;
- river valleys / lake basins;
- village plateau;
- road-fit contribution;
- river channel remains open under bridge;
- collider derived from the same terrain vertices.

Useful transition candidates:
- `kfbBlend` from road-markings lineage;
- `kfbLayer` from R2D lineage;
- biome / shore / shoulder transition use;
- distance fade in the lab: roughly **70–100 m**.

These are material/presentation donors only and must remain behind Surface Truth + KFB Clay / environment ownership.

## 4 · Clay / performance findings

The lab's strongest performance finding:

**The expensive item is the terrain Clay fragment shader, not terrain geometry.**

Additional observations:
- the existing Clay LOD based on object/pixel scale effectively does not trigger usefully for terrain-scale objects;
- the lab therefore experimented with a terrain `lite` path and distance simplification;
- bounded islands, instancing and near/mid/far material paths are the correct direction;
- the reported headed median of **59.9 fps** is **NOT an acceptance result** because parallel GPU activity polluted the measurement;
- the companion proposal also reports that GPU contention could push the same scene far lower even with Clay relief disabled.

### Binding measurement rule
Any performance result used for Frozen Matrix F-R07 must be measured:
- in a **visible, focused window**;
- on the named **target machine/GPU**;
- with no parallel screenshot/render/other meaningful GPU workload;
- with the actual integrated product;
- with the relevant Ground / Drive / Flight route.

If these conditions are not met:
**PERFORMANCE = UNKNOWN**, never PASS.

## 5 · Shadow donor finding

Lab world-scale shadow candidate:
- `normalBias = 1.2 × shadow-map texel`;
- `bias = -0.00003`.

The character-scale shadow recipe was reported to create bright seams at Open-World texel scale.

Use as environment donor evidence only; validate against the actual integrated world and current shadow canon.

## 6 · What the Lab does NOT prove

- no independent critic / blind A-B;
- no accepted target-device 60-fps proof;
- no persistence / Save→fresh reload;
- no complete lane graph;
- no T-junction;
- no accepted plate fallback;
- no current product ownership;
- no approval of proposal-only Life Tree, island-size, six-sector or new-schema decisions.

## 7 · WSA use

The final WSA One-Shot should read this file before road/visual/performance implementation.

Use:
`exact donor fact → inspect current owner/API → KEEP / ADAPT / REJECT → integrate through owner → actual product proof`.

Do not rerun the whole local lab unless the current owner implementation leaves a concrete unresolved question.
