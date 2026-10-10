# KayKit & Co · Modular Assembly and Gradient Atlas · Source-first Research

Date: 2026-10-10
Owner: existing Asset Librarian / KayKit Reference Atlas
Research branch: research/kaykit-creator-tutorial-atlas-2026-10-10
Status: SOURCE/ENGINE/DONOR AUDIT; NO NEW VIDEO FRAMES OR VISUAL APPROVAL.
Protected: Island R4 STOP/F-R39 FAIL, existing WB2/Track Core, K1/H0 Golden, K2 v10 clay/material, Asset Registry, resident motion and Asset Librarian.

## Direct official creator sources

1. KayKit Medieval Hexagon 1.0: https://kaylousberg.itch.io/kaykit-medieval-hexagon . The maker documents 200+ hex tiles, road/river/coast/building compositions, **one 1024×1024 gradient atlas** (can downsample to 128×128), GLTF/FBX/OBJ and a user guide. Extra and editable-source tiers are distinct. **A texture may be shared by all models while each model has distinct mapped colours; pack scale and connectors must be derived from the real source, not from a screenshot.**
2. Creator public repo: https://github.com/KayKit-Game-Assets/KayKit-Medieval-Hexagon-Pack-1.0 . Official source distribution structure and README exist. Does not itself prove the full KFB-owned asset version or extra tier.
3. Quaternius: https://quaternius.com/tutorials.html — #2 Gradient Texturing, #19 Atlas Texturing and #27 UV Mapping Basics; #11 Medieval House. **Official topic/index only; specific Blender values not transcribed or watched.**
4. Kenney Asset Forge official custom block guide: https://kenney.nl/knowledge-base/asset-forge/importing-custom-blocks-in-asset-forge . In that system, typical OBJ block convention is 1×1×1m, pivot centred at the bottom, single mesh, UV map may be overwritten; custom collections can be imported with an optional meta.ini scale/rotation.
5. Kenney Asset Forge modular authoring: https://kenney.nl/knowledge-base/asset-forge/creating-custom-blocks-using-asset-forge . Block assemblies can be exported as merged OBJ+MTL, and an editable native .model is recommended as a separate source. These are Asset Forge rules, **not** KayKit geometry or Three.js export conventions.

## Existing exact KFB source evidence (read from main)

- `tools/world_atlas/source/lib/hex-grid.js` already records actual KFB measuring: pointy-top cell **2.0 x 2.309** (x flat-to-flat and z point-to-point); top face `y=0`, body hangs below, and row/column offsets are calculated from the measured dimensions.
- Connection logic: six edge-class mask in a known direction order; 13 road shapes cover all nonempty connector patterns under rotation. Network segments must match actual edge connection class and must not be inferred solely from neighbouring tile occupancy.
- Documented rejected measurement: reading atlas UV colours at six edge positions incorrectly labelled grass as water. Reliable solution was top-down edge sampling with orientation correction; KFB stores a source-specific mask table. This is an already completed measurement, **not a new probe performed now**.
- `tools/world_atlas/source/scenes/hex-realm.js` already records the source layout and failure cases: road chains and endpoints must have actual semantic destinations, beach tiles replace land and include water, buildings need interior land cells, and free-tier art lacks some bridges/walls/farms shown in sample art.
- Importantly, that Hex recipe is a **kit lab reference** and cannot override the current island World Model or Track Core road/connection owner.

## KFB materials / presentation authority

`skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md` is current routing:
- original KayKit mesh geometry, gradient atlas and UVs remain source truth;
- KFB Clay material presentation uses K1/H0 Golden where locked, K2/v10 as new-stage technical baseline after Golden parity;
- K2 `clay-material.v10.js` preserves source colour/texture, vertex colours and normals when present, while adding relief in rest-space via three-axis projection; do not bake the gradients destructively or replace the original atlas to achieve clay texture;
- for comparison, use one unchanged source object and the SAME model/material mapping with KFB candidate look under a stable camera/light fixture;
- original neutral and clay render proof remain **NOT PERFORMED** in this chat.

## Reuse-first SOP candidate A · Modular original-source assembly

1. Select one REAL KayKit source tile/building, identify exact Registry pack/path/version/licence and show it alone before integration.
2. Measure bounding box, local axis, source pivot, base contact plane and actual hex neighbour pitch. Do not assume the Kenney Asset Forge 1m block convention or transfer 2.0 × 2.309 to unrelated KayKit packs.
3. Discover source connectors from the already measured KFB hex-grid masks, not atlas colour sampling.
4. Place a small canonical source set only in a **research fixture**: two neighbouring cells, one road bend, one river/coast, one building on an interior support cell. Verify edge parity, height/contact, rotation and texture identity.
5. Distinguish source-kit connectivity from the active WorldBuilder/Track Core owner's semantic route and physics (no second road runtime or geometric owner).
6. Evidence: isolated source image, dimension/transform table, 4–6 comparison frames, mismatch/repair log; promote only after current owner accepts.

## Reuse-first SOP candidate B · Shared gradient atlas and KFB Clay

1. Load one real KayKit GLTF and its actual atlas; record texture image resolution, UV set, map indices, vertex colour presence, colour-space intent and every material.
2. Render unchanged SOURCE under neutral calibrated light at front/three-quarter views. Capture reference with fixed camera.
3. Render K1/H0 or K2/v10 **without destroying base map/vertex colour** at identical camera/lighting. Keep KFB clay relief / hand-scale separate from the image atlas.
4. Test resizing the 1024 source atlas to 128 only as a possible PERFORMANCE comparison; check palette boundaries, edge bleed, texture filtering, faces and silhouettes. Kay's pack-level statement is not a blanket acceptance of 128px for all KFB actors.
5. Compare performance and LOD only in the actual receiving owner; do not claim a Godot/Blender render proves WebGL runtime parity.
6. Evidence: original texture/material metadata, images for neutral and KFB, a source-vs-style diff, shadow/contact evidence, exact pin, stats, accepted/rejected deltas.

## Specific production knowledge gaps, not missing software mandates

- Exact actual KayKit FREE or SOURCE distribution receipt and atlas image for the nominated test object, versus KFB registry version: **UNVERIFIED IN THIS SLICE**.
- True visual source isolation, Blender screenshots and tutorial transcripts/timecodes: **0**.
- A material atlas's **palette mapping** must not be confused with six-edge **road connectivity**.
- Quaternius' shader demos may offer authoring insights; don't copy generic cel shader wholesale into KFB Clay.
- Kenney's Asset Forge meshes/OBJ export are separate source conventions and cannot replace KayKit GLTF source rigging.
- Current World R4 remains STOPPED; no new world scene, geometry or runtime was built.

## Single productive next gate

`KAYKIT_MODULAR_ATLAS_SOURCE_ISOLATION_01`: existing Blender MCP/World Atlas specialist inspects one exact real KayKit Medieval Hexagon source tile and its atlas **in isolation**, with measured origin/UV/edge and an original-vs-KFB neutral/Clay A/B. This is a research fixture only and requires no restarted Island MVP.

Pending prior gate `KAYKIT-CREATOR-LIGHTING-VISUAL-SCAN-01` remains video-frame INPUT_BLOCKED; do not count it as passed or claim the creator video was reviewed.

Actual tests for this report: source/readback/document contracts only; runtime=0, Blender=0, visual frame=0, Stage/Site publishing=0.
