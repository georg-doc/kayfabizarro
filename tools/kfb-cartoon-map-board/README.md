# KFB Cartoon Map Board

**Status:** P0.2 EXPERIMENTAL STAGE · PUBLIC_VERIFIED · GEORG VISUAL ACCEPTANCE OPEN

Source browser entry: tools/kfb-cartoon-map-board/index.html

Experimental human-test Stage:
https://kayfabizarro.pages.dev/kfb-hub/stage/cartoon-map-board-p02/

## Decision / ownership

- tools/osm-city-lab/ remains the detailed city-geometry owner.
- skills/kfb-ink-canon.js remains the KFB card-ink SSOT; the Map Board keeps its map-specific BAND adapter.
- Central KFB assets remain the KayKit source; no substitute board-game models are introduced.
- KFB CardBuilder/PDF Cards remain a later consumer layer.
- WSA / Race remains integration lead.

## Current P0.2 experiment

- OSM-derived Europe country boundaries;
- independent extruded country tiles;
- deterministic paper/cartoon treatment and physical shadows;
- continuous Map BAND borders with lower-right weight bias;
- hover, selection, focus ring and smooth camera moves;
- HERO / TOP / LOW / FOCUS;
- EXPLODE / RECOMBINE;
- NEXT STORY over declarative anchors;
- five actual KayKit Board Game Bits attached to their country tiles;
- interactive labels, tokens, ink gain and relief.

## Public Stage proof · 2026-09-20

- exact route: https://kayfabizarro.pages.dev/kfb-hub/stage/cartoon-map-board-p02/
- browser proof: **12/12 PASS**
- runtime build: p0.2-stage-exp-r1
- countries: **40/40 loaded**, **0 failed**
- KayKit story markers: **5/5**
- KFB Ink: **canon v2 + map BAND adapter**
- NEXT STORY / EXPLODE: **PASS / PASS**
- page/script errors: **0**
- failed HTTP requests: **0**
- run/job: 35490263608 / 106023878490
- artifact: 10599280500
- digest: sha256:e1badfd8db9d6dc25d12b5059bf49cd8e4b0ea86010881662d0d3029268228f5

This is PUBLIC_VERIFIED Stage, not Live and not Georg acceptance.

## Deferred until visual direction is accepted

1. pin/cache boundary data and dependency revisions;
2. continent → country → region → city drilldown, handing city detail to OSM City Lab;
3. route arcs and timed story choreography;
4. real KFB PDF/CardBuilder cards;
5. authoring/save-load.

Map data © OpenStreetMap contributors, ODbL 1.0. Boundary delivery: OpenPlanetData.
