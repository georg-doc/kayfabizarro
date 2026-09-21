# KFB Cartoon Map Board · Story Focus P0.2

## Scope

This slice proves the content-presentation layer requested for map-based storytelling without prematurely taking ownership from KFB cards, OSM City Lab or the asset registry.

## Decision

Story data is declarative. Runtime marker placement is driven by:

`data/story-demo.v1.json`

Each story record currently carries:

- stable story ID;
- country binding;
- WGS84 point;
- exact KayKit asset filename;
- presentation height;
- display label;
- short title/body for the demo inspector.

The JSON is the demo-content contract, not a new global story canon.

## Implementation

P0.2 adds:

- deterministic paper texture generation;
- hover discovery with country-name feedback;
- selected-country focus ring;
- smooth camera choreography for map presets and selected countries;
- `FOCUS` action;
- `NEXT STORY` sequence over data-driven anchors;
- story-label highlight for the active content node;
- KayKit markers parented to their country tile so EXPLODE / RECOMBINE cannot desynchronise marker and geography;
- marker Y counter-scale so the HEIGHT presentation control does not stretch the KayKit prop.

## Ownership

- Geographic detail / city normalization remains with `tools/osm-city-lab/`.
- Card rendering remains with `kfb-card-builder.js` and the KFB card-format / ink contracts.
- KayKit asset identity remains in the central asset repository / registry.
- P0.2 owns only map-board presentation and story-anchor placement.

## Acceptance target

The intended interaction is now:

`Europe board -> select country -> FOCUS -> NEXT STORY -> map camera flies to a KayKit content anchor -> EXPLODE keeps anchor registered to its country`

This is implementation. It becomes a tested result only after browser execution on the deployed build.

## Next

The next high-value vertical slice is hierarchical drilldown:

`Europe -> country -> region -> city`

with the region/country board continuing to use administrative boundary geometry and the city transition handing off to OSM City Lab rather than reimplementing city ownership.
