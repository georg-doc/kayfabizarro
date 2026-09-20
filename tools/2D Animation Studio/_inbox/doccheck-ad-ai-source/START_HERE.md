# DocCheck AD Illustrator Source · Intake

Status: AWAITING SOURCE  
Receiving tool: 2D Animation Studio  
Owner of source intent: Georg / DocCheck AD

## Requested outcome

Ingest the upcoming Adobe Illustrator source as the authoritative visual basis for DocCheck 2D animation assets, including Eumel, eye rig(s) and other reusable components.

## Expected source location

Place original file(s) under `sources/`. Do not rename or modify the original on intake.

## First-pass tasks after arrival

1. identify AI/PDF/SVG compatibility and linked dependencies;
2. inventory artboards, named layers/groups, masks, eyes/pupils, pivots/anchors and accessories;
3. export a lossless inspection derivative if required while preserving the original;
4. compare Eumel geometry against the provisional measured reconstruction;
5. define canonical reusable asset modules;
6. record findings in `manifests/`;
7. only then propose promotion into the Studio asset library.

## Promotion gate

Native source structure understood + reusable part inventory recorded + source-vs-current comparison complete + Georg/AD acceptance of the canonical module basis.
