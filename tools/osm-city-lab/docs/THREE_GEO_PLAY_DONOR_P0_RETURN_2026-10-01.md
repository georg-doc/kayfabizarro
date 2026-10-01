# Return · THREE-GEO-PLAY-DONOR-P0

**Date:** 2026-10-01  
**Status:** **TECHNICAL DONOR PASS · LOCAL BROWSER 18/18 · PUBLIC STAGE PENDING**  
**Owner:** `tools/osm-city-lab/`

## Exact state

- repository: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/osm-city-three-geo-donor-p0-2026-10-01`
- base main: `1c9c9706764ce41ce1282f60e358195afed207e5`
- final tested runtime head: `72b26440c135d6aec15426a64fd08172831963be`
- evidence checkpoint head: `b3a92bb9232e678c0b74a1ea287a37006cb9946f`
- upstream donor: `lorenzoMezza/Three-geo-play@78a6b822261929a54f731dd08a972cf7b0a11500`
- package: `lm-three-geo-play@2.2.0`, MIT
- existing KFB runtime tested: `three@0.160.0`

## Outcome

Three-geo-play can remain an **optional native-Three.js streaming shell** around the deterministic OSM City Lab.

It does not replace:

- cached OSM / `normalized.json`;
- authoritative OSM identity and provenance;
- City Lab authored geometry / scene recipes;
- Travel / Ground / Race movement or collision owners;
- the existing KFB clay/façade/deformation/shadow stack.

The P0 proved the donor before any consumer integration.

## Source isolation proof

The P0 contains two directly comparable presentation modes over the same loaded geometry:

1. **A SOURCE** — upstream Three-geo-play geometry and default style;
2. **B KFB MATERIAL** — the exact same geometry with KFB palette/material override only.

The SOURCE and KFB MATERIAL stable snapshots both reported:

- **21 / 21 tiles ready**;
- **253 draw calls**;
- **668,626 triangles**;
- **252 geometries**;
- **0 tile failures**;
- **0 source errors**.

This is evidence that the P0 KFB material pass does not replace or regenerate donor geometry.

The screenshots in workflow artifact `11190960336` were inspected:
- `source.png` visibly shows the upstream city geometry in isolation;
- `kfb-material.png` preserves the same urban massing/road layout while changing only presentation;
- `stream.png` shows the moved streaming area after real tile turnover.

## Browser proof

Workflow:
- run `36917324517`
- job `110554381199`
- artifact `11190960336`
- result: **18 / 18 PASS**

Proved:

- Stage wrapper HTTP 200 locally;
- exact build marker;
- exact donor version + commit pin;
- Three r160 compatibility;
- source tiles reach stable 21/21 ready;
- zero tile/source errors;
- real native geometry rendered;
- coordinate roundtrip;
- City Lab seam axis difference detected and bounded;
- KFB restyle keeps the same streaming owner;
- real tile load and unload during movement;
- final stream state healthy;
- two geometry workers active, zero worker fallback;
- zero browser console/page errors.

During the stream path:
- tile loads: **21 → 26**;
- tile unloads: **0 → 5**;
- final visible set: **21 ready / 0 loading / 0 failed**;
- geometry count: **252 → 238**, consistent with disposal as the loaded area changes.

## City Lab seam result

This is the most important integration finding.

Current City Lab local ENU:
- `x = east`;
- `z = north`.

Three-geo-play / Web Mercator world coordinates:
- `x = east`;
- `z = south`.

Therefore the seam adapter is:

```text
city.x = threeGeo.x
city.z = -threeGeo.z
```

At the current Ehrenfeld north-east test point `50.95210, 6.92220`:

- Three-geo raw: `x 329.6202208981`, `z -297.7882069797`;
- City Lab ENU: `x 329.6202208981`, `z 297.7796378724`;
- after Z flip:
  - east delta ≈ **0 m**;
  - north delta ≈ **0.00857 m**.

Both seam axes therefore pass the P0 tolerance of **< 0.02 m** across this Ehrenfeld-scale probe.

Do not integrate without the Z flip; otherwise the streamed world mirrors north/south relative to City Lab.

## Performance interpretation

The GitHub browser proof runs Chromium through SwiftShader.

Observed numbers are useful for relative/render-complexity evidence but are **not Georg-GPU performance acceptance**:

- SOURCE: 253 calls / 668,626 triangles;
- KFB MATERIAL: 253 calls / 668,626 triangles;
- moved stream sample: 232 calls / 643,452 triangles;
- SwiftShader frame rate was roughly 11–16 fps with p95 capped at the test's 100 ms frame sample ceiling.

Do not promote those FPS values as hardware performance.

A later integrated/Georg-GPU measurement remains required before deciding how much K2 relief, façade detail or shadow work belongs in Q1/Q2 streaming LODs.

## Architecture retained

```text
Q0 HERO
cached City Lab
deterministic geometry + gameplay/collision truth

Q1 NEAR STREAM
Three-geo-play vector tiles
native Three geometry + KFB presentation adapter

Q2 FAR STREAM
Three-geo-play simplified presentation / reduced detail

Q3 OVERRIDE
landmarks + Scenelets + accepted assets/residents
```

Priority remains:

`authored hero geometry > landmark/Scenelet override > streaming shell`.

Stream features covered by an authored hero zone must later be suppressed; vector-tile feature IDs must not replace canonical City Lab OSM IDs.

## Files added / changed in P0

- `tools/osm-city-lab/experiments/three-geo-play-donor-p0/app.mjs`
- `tools/osm-city-lab/experiments/three-geo-play-donor-p0/index.html`
- `tools/osm-city-lab/experiments/three-geo-play-donor-p0/README.md`
- `tools/osm-city-lab/experiments/three-geo-play-donor-p0/browser-proof.mjs`
- `tools/osm-city-lab/evidence/three-geo-play-donor-p0/RESULT_2026-10-01.json`
- `kfb-hub/stage/osm-city-three-geo-p0/index.html`
- `.github/workflows/osm-city-three-geo-p0.yml`

## Public Stage

Reserved route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/osm-city-three-geo-p0/`

Status: **PENDING / NOT PUBLIC VERIFIED**.

The branch contains the Stage package, but it has not been promoted to main. The public Cloudflare job is intentionally skipped off-main. No GitHub Pages, raw-CDN or GitHub file URL is an acceptance surface.

## Deferred

- full K2 clay relief/toolmix;
- Elastic / LOOK-TORSION deformation;
- `kfb-facade-rule-v1` windows/doors;
- shadow/contact integration;
- authored-zone suppression;
- collision/nav;
- residents, cars, props;
- Travel / Race / WorldBuilder integration;
- Cologne-scale streaming;
- offline/provider caching policy;
- Georg-GPU performance acceptance.

## One next gate

**THREE-GEO-PLAY-P0B · SEAM + DEFORMATION ADAPTER**

Use one streamed building and one current City Lab building in the same local-metre frame. Apply the existing KFB presentation stack in stages without creating a second owner:

`source → axis seam → existing massing/deformation semantics → façade grammar → K2 material → normals/support/contact`.

P0B must first prove that both geometry sources can consume one shared presentation adapter. Do not start Town/Travel-wide integration before that gate.
