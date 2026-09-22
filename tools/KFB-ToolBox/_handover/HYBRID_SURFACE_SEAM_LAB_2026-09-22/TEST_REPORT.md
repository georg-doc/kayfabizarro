# TEST REPORT · Hybrid Surface Seam Lab

Date: 2026-09-22

## Local/branch browser proof

Run `35675898799` · job `106582254628`  
Result: **17/17 PASS**

## Exact public Cloudflare proof

Run `35676178615` · public job `106583528203`  
Result: **17/17 PASS**

Observed:
- exact public marker `8a64b33a917417402b6932fc152ec9f3bcf32fb1`;
- HTTP 200;
- exact Dungeon recipe / 69 placements;
- five exact actors;
- tileable macro active by default;
- predecessor edge mismatch **Δmax 136**;
- tileable opposite edges **Δmax 0 / Δmean 0**;
- one active shared texture across environment and actors;
- source roughness preservation unchanged;
- Legacy comparison toggle exercised;
- Tileable comparison toggle exercised;
- 832px canvas and controls pass;
- failed resources 0;
- page/console errors 0.

## Evidence

Public artifact:
- id `10673850312`
- digest `sha256:0fe0a8e6a407e5a84e24a8751e2729ba5a83891b0e3b2a233d1fa451ab736509`

Screenshots include:
- seam legacy non-tileable;
- seam tileable;
- integrated tileable;
- integrated tileable 832px.

## Boundary

This proves texture edge continuity and a working exact-donor A/B Stage. It does not prove:
- human visual seam acceptance;
- Hybrid v2 compile-census resolution;
- OSM/Race environment acceptance.
