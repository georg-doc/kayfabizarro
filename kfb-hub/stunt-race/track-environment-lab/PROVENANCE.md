# Track Environment ENV1 · Provenance

Implementation SSOT: `georg-doc/KFB-Stunt-Car-Race/ChatGPT_web/track-environment-lab`. Public copies are deployment mirrors, not another implementation owner.

## Frozen Race host

The four `host/` source/config files and `FLOW_LOOP_RECIPE_A0.json` are byte-identical to accepted v0.8 at Race commit `5dd2142b4ec681262135056e780dfa574d54bc0d`. Bootstrap checks host Git blob `84d71552ebe17b7332b18305bb111136ec746577` before execution. It resolves relative imports and appends a visual-only port. No physics, route, width, contact, gameplay or camera implementation is replaced. The port returns cloned route frames; it can attach/detach scenery, swap sky/fog/light colours and hide/restore the old decorative ground. No writable camera or gameplay state is exposed to the donor.

## Exact AssetRefs

`asset-manifest.json` lists 21 selected model paths, Git blob hashes, exact dependencies and registry paths. Its shared sourceRepo/revisionPin apply to each entry. Runtime requests resolve to `georg-doc/kayfabizarro@ce1d201217f40abfc8850eb8e7d6ea7ab9d07f39`, including Race vehicle dependencies.

Kenney Toy Car Kit: `gate-finish`, `item-cone`, `item-banana`, `item-coin-gold`. GLBs reference external `Textures/colormap.png`; it is included in the manifest.

Kenney Racing Kit: `grandStand`, `grandStandRound`, `tent`, `flagCheckers`, `barrierRed`, `barrierWhite`, `treeLarge`, `treeSmall`. Actual folder: `Models/GLTF format/`, despite `.glb` filenames. These embed their dependencies. `grandStandRound` is loaded as a candidate but not placed in ENV1.

KayKit City Builder Bits: `building_A_withoutBase`, `building_B_withoutBase`, `watertower`, `streetlight`, `bench`, `box_A`, `bush`, `car_hatchback`, `car_sedan`. External `.bin` files and `citybits_texture.png` are included. `bush` is a loaded, unplaced candidate. City buildings represent operations/service scenery, NOT invented dedicated garage assets.

Static glTF transforms are retained; bounds are measured from real model data. Placements use uniform scale and authored orientation. Surreal giants have explicit bounded sizes, not random outliers. All imported scenery has collision role `none`. Road exclusion uses conservative footprints against every accepted route segment; inter-prop spacing uses oriented rectangles.

## Original presentation, not imported models

Terrain mesh, palette variation, cloud bands and sky/sun/eclipse shader are newly authored local presentation code. They are not AssetRefs. The service plinth and gate foot foundations are visual construction surfaces, not drivable roads. Terrain is tested below the existing Race road and never replaces contact.

Finish gate: anchored relative to actual `track.entry@routeS=0`, with an explicit LOCAL VISUAL staging offset of **-18 metres**. This keeps the unchanged spawn and chase camera clear. The gate's source-measured opening controls scale. This offset does NOT move a lap trigger, change the route, or introduce a canonical A0 anchor. A shared dedicated finish-gantry frame remains open.

## Licenses and excluded reference

Kenney Toy Car Kit: CC0, verified on the author's page https://kenney.nl/assets/toy-car-kit on 2026-09-18.
Kenney Racing Kit: CC0, verified on the author's page https://kenney.nl/assets/racing-kit on 2026-09-18.
KayKit City Builder Bits: repository `License.txt` declares CC0, author Kay Lousberg. The exact source license is retained in the reproducible evidence artifact.
Three.js 0.160.0: MIT; loaded unchanged from the pinned npm CDN release.

SP13KTRA's LICENSE was read: **All Rights Reserved**. No game/engine source, procedural tables, geometry recipes or assets from SP13KTRA were used or adapted. The repository is a product/architecture reference only. `FX_Visual` was inventoried but is unused: no extra driving-view VFX.

## Open semantics

Real pit entry/exit, pit stall frames, service access, bridge underside/support anchors, switch choice cues and shared World Dressing fields are OPEN. This donor does not invent them. Schema `kfb.race-environment/1` is Race-local, not a central Assembly A0 amendment. Visual acceptance by Georg remains PENDING until his explicit review.
