# KFB City → Track Ground · Source-Wiring Audit & A/B Research Result

Date: 2026-10-10
Owner: existing Track Core/Joyride J14; World R4 STOPPED/NO MVP.
Branch: `research/kfb-track-core-transition-rail-2026-10-10`.
Mode: **RESEARCH/A-B DATA EVIDENCE ONLY**. This document does not change active T4 runtime, collision, tracks, road Surface Truth or final Clay look.

## 1. Why this audit matters

The earlier standalone `C_city_track_ground_CANDIDATE` passed its normalized T4-window math but the visible adapter is spread across at least four original source consumers:

- `transition-atlas.v1.js`: `makeAtlas()`, `w(layer,s,side)`, source City/Nature classification, city curbs, sidewalk, props and local look fields;
- `track-look.v5.js`: actual generated KFB clay/edge **visual cross-section** `sideProfile(q,i,sd)` and road `AT.roadTrack`;
- `road-markings.m2.js` (default) and `road-markings.m1.js` (fallback): city lines, track lines and conditional visibility;
- `core/track-core.v012.mjs`: original authoritative sampled curve frames, slots, road/surface profile, vehicle envelope/CONNECT.

These are EXISTING owners and source modules, not proposed new dependencies. Static source inspection in this turn: **18/18 exact-text consumer/owner checks PASS**.

## 2. Critical actual source finding: the visible barrier geometry already responds

The 2026-09-30 original `track-look.v5.js` gets `q.slots` from Track Core and computes `bt=AT.barrierT(q.s,sd,i)` inside `sideProfile()`. For CITY on ground:
- visible inner barrier top height `Hx=lerp(H,0.32,bt)`;
- source visible inner-barrier lateral state `ibx=lerp(ib,e+0.35,bt)`;
- `bt=1` means low City clay lip near road; `bt=0` means normal Track Core race shoulder/band profile.
- where the sample height is above ground, T4 `barrierT` multiplies city weight by `groundK(i)`; an elevated deck differs intentionally.

Thus an entirely new band/barrier mesh compiler would DUPLICATE source. The correct research focus is profile interface + cap/curb + collision/vehicle-envelope evidence. Do NOT equate the Look-generated visible barrier surface with a verified **collision** surface.

The city curb in original `transition-atlas.v1.js` is spawned as individual RoundedBoxGeometry masses; measured from source code: `0.56×0.36×0.9` unscaled seed shape, centre placed at `roadEdge+0.62` with `+0.1` local vertical lift. Its deterministic sparse sampling means a mathematically valid curb weight does NOT guarantee a deliberate visible final cap.

Sidewalk plates use `w('sidewalk')`, source `bio(s)===0`, ground filter and contiguous `spans` longer than six source metres. A 34m growth of the Stadtsockel outer extent in full city presentation is source behavior and may need self-intersection clearance review on curves; existing `sockelFold` fix is conditional.

## 3. Second actual source finding: race-marking window is NOT consumed for city

M2 is the normal mark builder, M1 is fallback. Both use a conditional track-edge presence like:

`presence(s,side) = bio(s)===1 ? 1 - w('mark_track',s,side) : 1`

For a city→track transition, `bio(s)` in the transition zone is **city (0)** because the T4 `nonTrack` classifier chooses the city side. Hence `mark_track` is mathematically valid but has NO effect on this M1/M2 edge-line presence within the city transition zone.

Additional nuance:
- M2 deliberately keeps the continuous **shared edge line** present in city; blindly replacing its `presence()` with `1-w('mark_track')` would inadvertently remove the city edge line before its race equivalent arrives.
- M2 city centre dashes DO consume `mark_city` (when the authored marking/run has a centre line). Race-specific markings require a **separate named compatible consumer** or an agreed width/pattern handoff, not a naive formula substitution.
- M2 existing edge-line width switch `edgeW(s)` uses `bio(s)` and a 20m wedge near a City-vs-nonCity boundary; it does not follow the candidate's `mark_track` window.
- In the new family, treat `mark_track` as **RESERVED / SOURCE_CONSUMER_UNWIRED_FOR_CITY**, not as a feature already functioning. This is a new-candidate integration gap, NOT proof the old T4 current source is defective.

Suggested bounded future owner-owned correction: preserve shared edge marking continuity and test a special-city-to-race **role-aware** race marking/width handoff under existing M2 with original A/B renderer + M1 fallback. DO NOT insert a one-line global `presence()` replacement that regresses existing city road marking.

## 4. Two candidate windows, source-data only

Research fixture A (prior):
`fixtures/KFB_T4_CITY_TRACK_GROUND_CANDIDATE_2026-10-10.json`.
B (new, additive):
`fixtures/KFB_T4_CITY_TRACK_GROUND_VARIANT_B_EXTENDED_HANDOFF_2026-10-10.json`.

Only two windows change from A to B:

| Layer | A window | B window | Intent |
|---|---|---|---|
| `curb` | 0.18–0.53 | 0.18–0.63 | longer curb withdrawal |
| `barrier` | 0.52–0.85 | 0.46–0.85 | earlier low city-lip → higher race band |
| other 7 roles | unchanged | unchanged | retain overall pattern |

Both candidates use `sideLag=0.06`. For the arbitrary illustrative `length=100m`, the interval where both *window ranges* overlap is **1m (A)** vs **17m (B)**. This does not mean the actual rendered curb and band geometries are physically touching throughout those lengths or that their stochastic stone density matches the interval.

Both A and B: **16/16 structural/numeric T4 checks PASS**, **18,000 normalized adjacent-monotonic comparisons each**, exact u=0/u=1 weights (city=1, race=0) on both sides. Additional **5/5 original look/curb/mark wiring source checks PASS**.

## 5. Source-derived straight-standard cross-section sample (NOT actual renderer)

Using actual Track Core `STANDARD` source slot defaults as the **straight, ground-level, curvature=0** fixture:
- half road `e=7.2m`; barrier inner `ib=9.9m`; baseline inner top `H=1.35m`.
- city lip at `bt=1`: top `Hx=0.32m`, inner edge `ibx=e+0.35=7.55m`.
- race band at `bt=0`: top `Hx=1.35m`, inner edge `ibx=9.9m`.
- source curb box centre `e+0.62=7.82m` from centreline.

At normalized `u=.55`:
- A, **left**: `curb=0`, `bt=0.9128`, visible band inner height ≈`0.410m`, inner edge≈`7.755m`;
- B, **left**: `curb≈0.0343`, `bt≈0.7742`, visible band height≈`0.553m`, inner edge≈`8.081m`;
- A, **right**: `curb≈0.0024`, `bt=1`, city-lip height `0.32m`, inner edge `7.55m`;
- B, **right**: `curb≈0.1500`, `bt≈0.9363`, band height≈`0.386m`, inner edge≈`7.700m`.

Source-derived profile arithmetic checked at 1,001 stations; maximum approximate change over 0.5m for the compared `Hx`/`ibx` values: **A ≈0.0534m**, **B ≈0.0452m**. This probes the source height/lateral interpolation only; it does not calculate the full rounded sideProfile mesh, terrain mesh, contact/shadows or phys colliders, and does not prove B visually superior.

## 6. Cautious decision

**Choose B only as the preferred candidate for the next controlled source-visible A/B**, since it offers a longer curb/band handoff and a slightly smoother source-derived profile displacement under these assumptions. DO NOT call B accepted production. A remains a counterexample/control.

Neither candidate closes the original source isolation gate. The sole next outcome-critical gate is still:

`TRACK_CORE_EDGE_ADAPTER_SOURCE_ISOLATION_01`

Required proof: **actual J14 track-look generated source geometry isolated in its original renderer**, at least first/middle/last of the true authored T4 and the candidate visual A/B under matched cameras; curb caps/gaps, sidewalk continuity, inner-curve folding, barrier silhouette, road collision and vehicle clearance. Source images are indexed in the GitHub J14 evidence folder but binary content could not be read by the available connector/container. Do not replace this with a generated 2D art illustration.

## 7. Routing and validation boundary

No runtime source file changed. No source M2 mark logic changed, no world restart, no new road compiler. All additions are DATA/RESEARCH only.

Static source text/source values: inspected `track-core.v012.mjs`, `transition-atlas.v1.js`, `track-look.v5.js`, `road-markings.m1.js`, `road-markings.m2.js` and exact source JSON.
Tests:
- source wiring 18/18 exact consumer/owner checks;
- A/B normalized 16/16 each and 18,000 adjacent checks per variant;
- A/B source profile interpolation 1001 stations on two sides; 5/5 source formula checks;
- **0** WebGL/Blender original 3D screens, **0** collider contact proofs, **0** runtime commits or deployed Site.
Recovery: existing owner `KFB_TRACK_CORE_TRANSITION_RAIL_RETURN_2026-10-10.md` on the same research branch.
