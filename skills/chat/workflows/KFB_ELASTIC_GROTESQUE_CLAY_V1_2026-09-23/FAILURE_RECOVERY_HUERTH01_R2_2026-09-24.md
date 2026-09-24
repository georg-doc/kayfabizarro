# FAILURE RECOVERY · Hürth 01 V2 R2 · 2026-09-24

Status: **ARCHIVED_FAILED_CANDIDATE · IMPLEMENTATION STOPPED**
Owner: **OSM City Lab presentation / KFB ToolBox authoring**
Repo: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/elastic-grotesque-clay-huerth01-2026-09-23`
Draft PR: **#194**

## SOURCE

Good underlying form-language donor / continuation reference:
- tested unchanged V2 runtime: `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`
- benchmark: `STYLE_BENCHMARK.md` + pinned benchmark image
- Human result after first tune: `HUMAN_RESULT_HUERTH01_V2_R2_2026-09-24.md`

Failed repair lineage retained:
- R1 tuned runtime: `75b3c460ac37aac57cb5d9e96260517c5b4cf68d`
- R2 runtime: `4cc496e79af80c7f8419ffb14f7f5d8daeb0b679`
- R2 browser run: `35947303053`
- R2 automated result: **38/38 PASS · 3/3 WebGL2 · 0 page/console errors**
- R2 artifact: `10787192998`
- digest: `sha256:aa193dff031169bcfef73c9eb381b6d80a3b5099243818994b999a755073e0a0`

Public review/evidence route at failure time:
`https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-look/`

## HUMAN FAILURE EVIDENCE

Georg reviewed R2 in real Chrome and rejected the candidate.

Uploaded screenshots:
- `Bildschirmfoto 2026-09-24 um 04.37.11.png`
- `Bildschirmfoto 2026-09-24 um 04.35.57.png`
- `Bildschirmfoto 2026-09-24 um 04.35.43.png`

Observed, picture-checkable failures:

1. **Light/shadow edges remain.**
   Large hard bright/dark boundaries remain visible on ground and building/roof surfaces. Automated browser PASS did not prove visual correctness.

2. **Road/path construction is architecturally wrong.**
   The road/path/curb system visibly reads as layered parts and ad-hoc junction patches. At junctions there are circular/rounded patch reads, steps, slivers and new overlap artefacts.

3. **Roof/body still does not read as one designed object.**
   Some eaves protrude, but roofs still read as separate lids because roof/body silhouette, material/shadow separation and local corner behaviour do not form one continuous object language.

4. **Facade colour/detail placement is technically improved but not compositionally designed.**
   Coloured doors/windows are acceptable as a direction, but rhythm, spacing, repetition/variation and colour relationships still read as seeded randomness rather than an authored visual system.

## ATTEMPTS

| Attempt | Change | Expected | Actual | Decision |
|---|---|---|---|---|
| R1 | wall-surface facade frames; shadow bias; asphalt node patches; small roof outset | resolve four V2 review points | doors/windows improved; shadow/road/roof complaints remained | FAILED |
| R2 | larger eave ring; multi-facade details; Racer Cologne palette donor; path-road connectors; tighter 4096 shadow map; wider road patches | close same visual gate | automated 38/38 PASS, but human screenshots still show shadow boundaries, patched roads and lid roofs | FAILED · FREEZE |

Per KFB two-pass rule, **no R3 patch pass is allowed on this foundation**.

## WORKING PARTS / SALVAGE

### REUSE_CANDIDATE
- real Hürth OSM fixture, IDs, footprints, heights;
- CLEAN / CARTOON / GROTESQUE switchability;
- core Elastic V2 continuous form grammar:
  - coherent group warp;
  - rounded/bowed volume;
  - lean/bend/taper/belly/twist;
- final-wall surface-frame concept for attaching facade details;
- exact Racer Cologne palette donor:
  - repo `georg-doc/KFB-Stunt-Car-Race`
  - file `KFB Cologne Race Option C-3/lab-v9/cologne-palette.v1.js`
  - source commit `cc80f4a1c6c509db9668df79fd53b13cee093a9d`
  - blob `38246785ec2c9089737b2a195673a3ad4c07bdf8`
- Voxel/WorldContext story palette owner:
  `tools/KFB-ToolBox/_inbox/KFB Voxel Zone S2/voxel-zone-s2-full_2026-09-22/terrain/world-context.js`
  (`STORY_PALETTES`, card semantics, deterministic seed pipeline).

### NEEDS_ISOLATED_TEST
- facade rhythm and colour composition;
- roof/body union grammar;
- shadowing strategy after geometry/material architecture is fixed.

### REJECTED_FOUNDATION
- road / curb / path as separately overlaid presentation ribbons with patch discs or Z-layer fixes;
- widening node patches to hide seams;
- polygon-offset / render-order / stacked-surface seam repair as the main topology strategy;
- another bias-only shadow tuning pass without first removing overlapping/coplanar surface causes.

## PROVEN CAUSES

### PROVEN
- The road system is built from multiple separate rendered surfaces:
  continuous road ribbon + wider curb ribbon + path ribbon + junction patches/connectors.
  This architecture necessarily creates overlap/edge-order seams that are then being hidden with Y offsets, renderOrder and polygonOffset.
- R1 and R2 both passed automated WebGL/contract tests while failing Georg's visible gate. Therefore the current QA assertions do not cover the real visual acceptance problem.
- Roof and wall are separately generated meshes/material regions. A geometric outset alone did not make them read as one object.
- Multi-facade detail distribution in R2 is seeded per edge; it does not yet encode a higher-level compositional facade rhythm.

### UNKNOWN / HYPOTHESES TO RESEARCH
- How much of the remaining ground/building banding is classic shadow acne versus overlap/coplanar geometry, normals, or material discontinuity.
- Which single-surface road topology is cheapest while preserving OSM centreline truth and reproducible widths/junctions.
- Which known facade rhythm / repetition-with-variation pattern best matches the desired 90s-cartoon / handmade suburb look.

## HARD ARCHITECTURE RULE FOR NEXT ATTEMPT

### Roads / paths
**One shared surface topology, not layered visual patches.**

The next candidate must derive road, curb/shoulder and path/junction boundaries from one deterministic planar/vector arrangement or one joined mesh construction:
- shared vertices/edges at intersections;
- one triangulation owner;
- explicit material regions/attributes inside that topology;
- no patch circles;
- no overlapping coplanar ribbons;
- no Z-index/renderOrder seam hiding.

OSM centreline/width/source truth remains the input, not the final rendered topology.

### Roof + body
Treat building + roof as one semantic object assembly:
- shared top/eave boundary contract;
- roof cap generated from the same final deformed silhouette;
- continuous corner/normal/material transition where appropriate;
- shadow strategy evaluated on the combined object, not used to hide a geometry seam.

### Facade composition
No independent random sprinkling.
Use an explicit design grammar for:
- primary door anchor;
- grouped windows;
- spacing intervals;
- repetition with controlled variation;
- asymmetric balance;
- colour hierarchy / accent budget;
- building-to-building rhythm.

## LESSONS LEARNED

1. **A green WebGL test is not a geometry-design test.**
   Early test next time: fixed close crops of the named junction, roof/eave and shadow boundary must be compared against a visual invariant.

2. **Patching a surface seam creates a patch system.**
   Early test next time: one T-junction generated from a single topology owner before rendering a city block.

3. **An outset is not a roof/body grammar.**
   Early test next time: one isolated bowed house with shared eave contract, neutral material and no shadows.

4. **Seeded randomness is not visual composition.**
   Early test next time: one facade grammar shown on 6 identical source boxes with deterministic rhythm variations and explicit colour roles.

## NEXT GATE

**RESEARCH + ARCHITECTURE PROOF ONLY. NO CITY-BLOCK REPAIR.**

Before another Hürth implementation:
1. research known facade rhythm / repetition-with-variation / asymmetric-balance / colour-hierarchy patterns;
2. define one single-owner vector/mesh road-junction construction;
3. prove one isolated house roof/body union with neutral lighting;
4. only then create a new bounded candidate.

No further edit to R2.
