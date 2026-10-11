# KFB Coconino Mesa · Asset Recon & Modelling Brief R1
Date: 2026-10-11
Status: RESEARCH + MODEL CANDIDATE BRIEF · NO RUNTIME / ISLAND GEOMETRY AUTHORIZATION · NO VISUAL PASS
Owner: existing KFB Asset Registry / Asset Librarian for discovery and handoff. Any later scene composition belongs to the current KFB World/Environment receiving owner; Track/Road Core remains sole road-geometry/connector owner.
Source of truth: GitHub `georg-doc/kayfabizarro`; baseline main head `dccf75cabd222d951380693d84ab88053ee7e519`.
World guard: `skills/chat/START_HERE.md`, `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md`, `skills/chat/CLAUDE_DESIGN_FOUR_ISLAND_STORY_VISION_R1_2026-10-08.md`. Island MVP R4 remains STOPPED/NO MVP. This is an asset-study, not R5, an invented fifth island or new world style owner.

## 1. Art direction / historical references

George Herriman's `Krazy Kat` colored Sunday pages (1935–1944), imaginary Coconino County / Arizona Painted Desert / Monument Valley landscape. Its strength is NOT generic photorealistic Western scenery: exaggerated asymmetrical flat-topped mesas and thin buttes, alternating low/very high vertical elements, voids/open sky, curiously cut silhouettes, odd colored strata, sparse cacti, and a mutable theatrical background. Palette and stage can vary between scenes; coherent locality still comes from the recognizable forms.

References:
- Tom Lennon, illustrated Krazy Kat colour Sunday pages: https://tomlennon.com/krazy-kat-started-brick/
- Adam Gopnik, "The Genius of George Herriman": https://www.nybooks.com/articles/1986/12/18/the-genius-of-george-herriman/
- Example historic panel and landscape: https://illustratedfox.blogspot.com/2012/08/george-herriman-and-krazy-kat.html
- Public source/context descriptions: https://en.wikipedia.org/wiki/Krazy_Kat

Design adaptation only: ORIGINAL KFB cartoon-claymation geometry; no literal traced comic art or replacing KFB's present-day style.

## 2. Repository donors verified via live Git tree / exact source files

Each item is CANDIDATE-ONLY; repository file existence or loading != a source-isolated, visually accepted donor.

A. **BEST PROTOTYPE / existing KFB source**: `tools/KFB-ToolBox/_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/lab-clay/clay-catalog.v5.js`. Its `mesa()` builds a smoothed deformed cylinder (radius top 3.0, bottom 4.0, height 4.4, 44 radial / 8 height segments), with KFB clay `terrainBg` material and `C.mesa`. This is an EXISTING real procedural mesa class and strongest reuse starting point. NOT proof of the proposed Herriman multi-tier profile, cap strata or visual acceptance. KFB clay changelog also records variable Knet relief and `mesa` scale 3.2: `tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/CHANGELOG.md`.

B. **Dressing, CC0 / confirmed repository**: `media/3D_Assets/kenney_nature-kit/Models/GLTF format/`: `rock_tallA.glb`–`rock_tallJ.glb`, `rock_largeA.glb`–`rock_largeF.glb`, `cactus_short.glb`, `cactus_tall.glb`, `cliff_corner_rock.glb`, `cliff_top_rock.glb`, `cliff_diagonal_rock.glb`. Live tree verified, but highly rectilinear `cliff_*` parts must NOT be exposed as block/tile seams on organic island silhouette. Kenney official Nature Kit: https://kenney.nl/assets/nature-kit (CC0; 330 files). Historical `media/3D_Assets/CATALOG/INDEX.md` shows dimensions; registry/tree is authoritative.

C. **Source-rock variations, CC0 / confirmed**: `media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Rock_1_A_Color1.gltf` with `Rock_1_A_Color1.bin`; corresponding `Rock_1_B`–`Q` etc. Example actual GLTF read: 1 primitive, 144 indices = 48 triangles, 1 material; separate binary dependency. Pack `License.txt` says CC0. Rock material/silhouette donor only, NOT flat-topped mesa by itself.

D. **Source rock/cactus forms, CC0 / confirmed**: `media/3D_Assets/Ultimate Nature Pack by Quaternius(1)/`: `Blends/Rock_1.blend`–`Rock_7.blend`, `FBX/Rock_1.fbx`, `OBJ/Rock_1.obj`; `Blends/Cactus_1.blend`–`Cactus_5.blend`, same FBX/OBJ families. Pack `License.txt` explicitly CC0. No direct GLTF/GLB candidate from this root observed: conversion is required if used; the file formats must not be falsely reported as runtime-ready.

E. **Surreal side-world rock donor, not a mesa**: `media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Environment/GLTF/Rock_Large_1.gltf` (real JSON read, one primitive, 666 indices / 222 triangles, 1 material, embedded buffer) and `Rock_Large_2.gltf`, `Rock_Large_3.gltf`; `Rock_1.gltf`–`Rock_4.gltf`. Suitable for the stranger Cosmic / Protopia dressing, not the baseline Herriman silhouette. Its `License.txt` contains CC0 but carries an unrelated 'Ultimate Platformer Pack' header; flag pack-name mismatch for provenance review.

F. **Reject as current island terrain method**: `KayKit_BlockBits_1.0_FREE/Assets/gltf/sand_A.gltf` and historical `GLB_hexagon_kit`/kenney-hex terrain. Useful in an intentionally blocky maker diorama only; they are NOT current continuous organic island earth-mass construction and must not silently revive Hex island access.

External NON-IMPORTED inspirations (licence and own shape fidelity must be reviewed before adoption):
- https://sketchfab.com/3d-models/low-poly-desert-rocks-asset-pack-f4200e8f693e49a28b59dd7f18e8dc65 (5 rock forms, 3 plants, CC-BY)
- https://sketchfab.com/3d-models/stylized-rocks-asset-pack-480403c4689a425db3748baa88ad52c4 (5 rocks, CC-BY)
- https://sketchfab.com/3d-models/low-poly-desert-87f3124d9d2743c4986cdcedce269bae (scene, CC-BY, 167k triangles; illustration reference, NOT ready low-cost model).

## 3. New modelling assignment / missing shapes

Use existing KFB `mesa()` as the starting family instead of a second renderer; author ORIGINAL KFB Coconino style. Prioritize:
- **M01 flat-cap mesa**: broad top, inward taper/erosion, irregular vertical wall, 2–4 broad nonuniform horizontal color/clay strata, rounded lip.
- **M02 needle butte**: high slim pillar, small eccentric cap or no cap; 2 different top profiles and visibly irregular sidewall.
- **M03 stepped twin/multi-tier butte**: stacked shelf / narrowed neck / overhang; single coherent geological mass rather than visibly stacked loose blocks.
- **M04 broken mesa arch and natural bridge**: cavity/arch cutout, MUST be geological; NEVER classified as a load-bearing road bridge (track bridges belong to Track Core).
- **M05 eroded fin / leaning slab / balancing stone**: iconic asymmetric long-thin landmark; avoid implausibly perfect tubes.
- **M06 cliff-edge apron and talus taper**: broad smooth seam to parent continuous earth-clod, no square cliff grid seams or glued boulders.
- **M07 flat mesa-top playable cap**: collision, walking/platform candidate with traversable local top; road/circuit only by Track Core owned geometry if later authorized.
- **M08 scattered dressing**: source-faithful KayKit/Quaternius cactus, 2–3 small rock clusters, 1 twisted isolated shrub/tree. Optional decorative color switches.

Deliver 2–3 silhouette variants of M01/M02/M03 plus one each M04–M08. Per shape: neutral grey clay profile, KFB clay palette, 360° orthographic 4-view, one 3/4 view + wireframe/source-isolation. Do not promise all models as runtime-ready until actual conversion and preview. All meshes originate at terrain-contact pivot, Y-up; consistent unit/scale metadata. `GLB` runtime candidate + editable `.blend` where Blender is used, explicit material groups (base/strata/lip), 2 LOD variants for large pieces, simplified collider separately. Exact target poly budgets are deferred until reference scene performance tests; do not fabricate validated budgets.

## 4. Palette, staging and transition grammar

Proposed swappable clay palette (creative targets, NOT sampled exact historical ink): sunbaked ochre, adobe terracotta, dusty red, apricot, lilac, muted cyan, sage, warm cream, dark violet shadow. Broad uneven color strata, not photographic geological noise. Clay material follows current KFB surface owner; no second shader.
Stage: 1 clear tall dominant form, 2–4 middle forms, lots of uninterrupted negative space. Some rock profiles deliberately disproportionate/shifted rather than faithfully geological. Preserve large skyscape; decorative shrubs rare. Avoid imagegen's common "many disconnected rocks glued under islands" error: every island still ONE continuous organic geological base. Individual mesas sit on it or emerge from it naturally.

No Hex receiver; no new bridge owner; no automatic road path or game geometry. Scene composition must be world-story-aware and must respect accepted island direction. Do not conflate visual concept inspiration with the four-world canon.

## 5. Source-isolation and acceptance gate

Gate 1 (the only next gate for this RESEARCH slice): **actual isolated side-by-side donor proof** of KFB procedural `mesa()`, a Kenney tall rock + cliff, KayKit Rock_1_A, and Quaternius Rock_Large_1, with provenance, silhouette labels KEEP/ADAPT/REJECT. Render the real geometry/pixels in isolation, not only load asset URLs or output a prompt. Compare to a single original Herriman-inspired M01–M03 gray-clay shape proof; choose reusable donor/formula. No assembly onto R4 or another island in this gate.

Only after the source-isolation proof and meaningful Georg visual decision may the receiving World/Environment owner integrate these assets in a new explicitly authorized slice. No PR auto-merge, no stage/site or Live claims from this brief.
