# KFB T4 Ground City → Race · Candidate window fixture and numerical evidence

Date: 2026-10-10
Owner: existing **Track Core + Joyride T4**. Bounded research candidate only.
Repo: georg-doc/kayfabizarro
Branch: research/kfb-track-core-transition-rail-2026-10-10
Current host WorldBuilder R4: **STOPPED / F-R39 FAIL / NO MVP**. No R4/R5 geometry or runtime work authorized.

## Why this additive candidate exists

The already authored Joyride J14 T4 `A_track_city` source provides a proper track→city on-ground sequence with curb and sidewalk. The currently authored reverse `C_city_track_deck` is an elevated park-deck exit and **does not have a sidewalk window**. It is not a general street→racetrack ground reverse.

Original source:
`tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/transition-profiles.v1.json` blob `af6d52c9e3506ecc99d977c66faa8e7189e6f6e2`.

T4 sampling:
`tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/transition-atlas.v1.js` (look only).
Its `w(layer, s, side)` uses `smoothstep` over the layer window with `u - side * sideLag/2`; for `to=track` the non-track influence equals `1 - smoothstep(...)`.

The real underlying road/socket/drive geometry is owned by Track Core v0.12:
`tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/core/track-core.v012.mjs`, blob `1bcf7ad3a384a57d7caf83488c436f4c4835346f`.

## Candidate data (research-only, NOT merged into T4)

`fixtures/KFB_T4_CITY_TRACK_GROUND_CANDIDATE_2026-10-10.json` (research schema pointing at existing `kfb.transition-profiles/1`).
ID: `C_city_track_ground_CANDIDATE`.
From: city. To: track. sideLag: `0.06`.
An illustrated, normalized zone of 100 m is for testing only, NOT a universal system length or a new RouteRecipe piece.

| T4 layer | u window | Proposed visual intention |
|---|---|---|
| props | 0.07–0.28 | city clutter releases first |
| sidewalk | 0.10–0.46 | slab sequence withdraws early |
| curb | 0.18–0.53 | curb stones taper/terminate before race edge is settled |
| mark_city | 0.18–0.48 | urban road markings withdraw |
| road | 0.32–0.77 | source material/paint transition, no collider change |
| barrier | 0.52–0.85 | reallocate look from low city edge to KFB Track Core barrier role; actual geometry must be source-tested |
| mark_track | 0.70–0.94 | race markings complete last |
| light | 0.33–0.83 | optional Env Owner-owned mood only, not new renderer |
| vfx | 0.38–0.82 | optional appropriate VFX, no hard-coded print look |

Crucial qualification: each window in T4 describes the **weight of the non-track biome**, NOT direct opacity or authoritative barrier-collider size. For this `to=track` candidate, weights move from **1 → 0**; track geometry remains the existing owner. Structural barrier noses, caps, kerb terminations, scenery clearance and terrain contact must still be verified on real J14 3D source before any promotion.

### Source-derived diagnostic figure

`evidence/KFB_T4_CITY_TRACK_GROUND_CANDIDATE_WINDOWS_2026-10-10.svg`.
This deliberately labels the normalized timing intervals as candidate data; **NOT** a real 3D screenshot.

## Executed data tests

Test inputs were read back from exact GitHub `main` original JSON and candidate research branch JSON. A JavaScript check recreated the exact published T4 formula with smoothstep and sideLag (read-only research numeric sampling, not the full T4 runtime renderer).

**16/16 contract assertions PASS:**

1. existing T4 schema target matches;
2. all proposed layer keys already exist in T4;
3. all nine windows ordered/in [0,1] and preserve sideLag endpoint margins;
4. direction city→track;
5. no collision with existing source family ID;
6. historic `C_city_track_deck` is a distinct existing family and lacks sidewalk;
7. candidate adds sidewalk window;
8. props end before sidewalk;
9. sidewalk ends before road-look finishes;
10. curb/barrier arrival windows partially overlap but do not have coincident endpoints;
11. city markings end before track marking begins;
12. track markings finish after barrier and road;
13. explicitly marked research only/no runtime;
14. both sides begin at exactly city weight 1 and finish track weight 0;
15. all 18 layer-side curves monotonically decrease across 1,001 normalized stations each (**18,000 adjacent comparisons**);
16. side lag actually differentiates L/R profiles in the transition interior.

No failed assertions. Maximum absolute deviation from intended start/end endpoints = **0** (both sides/all nine layers). The older source's right-side endpoint residual is no longer present under this fixture's data windows; this **does not** prove any original shader/3D visual seam is fixed.

At `u=0.5` (left/right non-track influence):
- `props 0/0`, `sidewalk 0/0`;
- `curb 0/0.0781`, `mark_city 0/0.0033`;
- `road 0.5499/0.7407`;
- `barrier 0.9973/1` (the source method still treats these as city-influence weights);
- `mark_track 1/1`;
- `light 0.648/0.8087`, `vfx 0.7306/0.8916`.

Test results are analytical/data-domain only; the numeric inputs and authored reference files are preserved on GitHub for later re-execution.

## Remaining visual/physical proof

**Status:** `TRACK_CORE_EDGE_ADAPTER_SOURCE_ISOLATION_01` remains **PARTIAL**.

1. Show **original J14 T4 donor** at authored ZA/ZC from actual renderer in isolation before any proposed data are applied. Source screenshots are listed in original J14 `evidence/screenshots`, but the current connector cannot decode these private binary GitHub objects.
2. Find nearest ground-level city→track example with genuine existing Track Core cross-section and actual trajectory; no alternate geometry compiler. Compare candidate only inside a source-faithful fixture.
3. Prove structural barrier and curb caps: no visible hard cut, wrong overlaps, floating sidewalk, unwanted nosing, Z-fighting or duplication, and no new collision contacts.
4. For each side, check exactly `u=0, .25, .5, .75, 1` at matched camera plus driving-camera angle; inspect possible visual left/right lag even with exact numeric endpoints.
5. Check width/bank/vehicle-envelope and minimum radius on straight and one curve, shadow contact and the host's terrain contribution; verify original source design remains recognizable.
6. Document material source/identity and source-isolated appearance before KFB Clay look is applied; keep K1/H0/K2 acceptance separately.
7. Actual integration requires existing Track Core/Progression owner approval. No R4/R5, new renderer, Site/Stage promotion or second track owner is implied.

The planned later dungeon `seamKey` and rail `RouteRecipe` research is unaltered. This candidate does not claim either has been implemented.

## Recorded test boundary

- source JSON objects: 2 exact files inspected/read back;
- candidate windows: 9;
- directional curves: 18 (L and R);
- numeric neighbour checks: 18,000;
- static contract predicates: 16/16 PASS;
- original J14 screenshots inspected as actual pixels: **0**;
- Blender/3D geometry and collision tests: **0**;
- productive runtime/Site publication: **0**.
