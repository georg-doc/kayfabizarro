# Landmark Semantic Band Rig v2 · Slice Brief · 2026-09-19

**Status:** DECISION / BOUNDED REBUILD

## GOAL

Replace the failed Pilot-04/v1.2 clock-socket approach with a semantic **band/bone rig** in which the visible host architecture and its attachments share the same group transform.

Primary proof: Spasskaya Tower / Kremlin wall study in `city-grotesque` and `soft-cubist`.

## FAILURE EVIDENCE BEING REPLACED

The v1.2 test proved only that each clock stayed rigid around its own computed socket. It did **not** prove that the socket remained on the rendered `clock-stage` surface.

Detailed re-measurement against the actual rendered `clock-stage` triangles found the four v1.2 clock sockets approximately **2.35 m, 3.72 m, 2.50 m and 3.52 m** away from their intended host faces in City Grotesque. The front clock contact estimate was also biased vertically to about `y=41.90 m` although the authored clock center is `41.50 m`.

Root cause: v1.2 sampled a continuous deformation field at an arbitrary socket point, while the visible coarse host box is rendered from only eight deformed corner vertices. Discrete grotesque stack offsets make those two surfaces diverge.

## NEW CONCEPT

Semantic affine bands:

- `lower` — gate / lower tower / walls
- `clock` — lower hip roof + clock-stage + four clocks + gables + pinnacles
- `belfry` — belfry drum / posts / crown
- `tent` — tent roof / ribs / star

Each band receives **one fitted affine transform** derived from the same City / Soft-Cubist field. All parts within a band share that exact transform. Therefore the `clock-stage` host and all four clocks cannot separate through different deformation math.

The Three.js receiver also keeps actual scene groups per band with the band joint as local pivot, so later living-toy beat/impact animation can address bands without reconstructing semantic ownership.

## EXISTING OWNER

- Authoring donor: `georg-doc/kayfabizarro/tools/img2threejs/`
- City geography/metres/style/override: `tools/osm-city-lab/`
- WSA remains Race integration lead
- Race / Travel / Audio owners unchanged

## RECOVERED BEFORE REBUILD

- `georg-doc/kayfabizarro@d6062351d69939cdd7015337b060b9c50b6b7a72`
- `georg-doc/KFB-Stunt-Car-Race@041670711e6f4c5c4afcdded4652fff8aa3377f1`
- existing City deformer blob `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782`
- existing City style blob `f129cca3041b55b84de26048dad7aef8fac8b292`

## PROTECTED BOUNDARIES

- Pilot 01–04 and accepted Dom v0.2 remain historical/parallel evidence; no silent overwrite.
- City S2 collision/export geometry remains undeformed.
- No OSM identity/manifest entry is invented.
- No Race/Travel bounce or collision implementation.
- No Audio runtime.
- Living-toy reactions remain presentation signals until receiver-side integration.

## DONE WHEN

1. `clock-stage` and every `clock-*` part resolve to the same `clock` band.
2. One band transform maps all host and clock geometry.
3. Four clock back planes remain outside their corresponding transformed host faces with the expected scaled source standoff.
4. Band transform axes are orthogonal and band endpoint centerlines map exactly to the underlying deformation field.
5. Source triangle counts and ground anchor remain stable.
6. Actual visual renders from the resulting production vertices show front, side and oblique attachment consistency.
7. Standalone viewer exposes Band Rig v2 vs Legacy point-deform A/B.
8. Additive evidence / changelog / WSA handoff are present.

## EXACTLY ONE OPEN HUMAN REVIEW QUESTION

After the attachment bug is gone, is **City Grotesque** or **Soft Cubist** the better deformation intensity for the landmark baseline?
