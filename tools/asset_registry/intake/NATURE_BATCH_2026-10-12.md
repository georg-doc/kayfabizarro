# KFB Nature Asset Batch 01 - trees, rocks and modular terrain
Date: 2026-10-12. Owner: existing Asset Registry / Asset Librarian. Status: SOURCE VERIFIED / INTAKE CANDIDATE, NOT LIBRARIAN LIVE.
Detailed machine-readable list: NATURE_BATCH_SOURCE_2026-10-12.json. Trees individually inventoried earlier in LOW_POLY_TREE_PACK_INTAKE_2026-10-12.json.

## Exact source facts
Broken Vector low-poly-tree-pack on main: 38 DAE tree models in eight type families, four seasonal palette PNGs, Blender source, and four demo models/four demo images. The purchase README is not a verified redistribution licence.
Broken Vector LowPolyRockPack. on main: literal trailing period in folder name. Contains LowPolyRockPack.blend (919816 bytes), Models.zip (101348 bytes) and README.txt. Vendor evidence from README; actual model count, formats inside ZIP and redistribution rights still UNKNOWN.
modular_terrain_collection.zip on main: 954640 bytes, Git blob 0e9873a2ffe3495dce7ed0b1e72ecfe0227edca8. Archive contents, publisher, geometry and licence UNKNOWN because available connector cannot read ZIP bytes.

## Canonical registration
Current tools/asset_registry/build.py scans DAE and BLEND as model-3d but NOT ZIP. On planning/kfb-skin-stack-nature-intake-2026-10-12, the existing pack overrides have display names for both real folders (Trees, literal dotted Rocks). These are branch-only metadata, not generated registry updates on main. Do not manually edit registry shards or pretend archives are directly previewable. Use existing AR4 registry builder/workflow once source ready. Confirm pack IDs and browse on canonical Asset Librarian GPT Site only after actual adoption and feed refresh.

## Nature Gizmo hypothesis
Tree grove boundary/footprint, density and min spacing, seed and source species mix, seasonal material selection, scale/rotation, terrain conform + exclusion masks. Rock scatter and cliff-edge guide, scale and burial/contact, slope limit. Modular terrain could support editable terraces and cliff sections only after source isolation and true topology / terrain-owner acceptance. All authoring only: World/Surface Truth owns height/contact; Asset Librarian owns provenance; Clay SSOT owns visual language. No second terrain, collision, path, or runtime owner.

## Intake gates
1. Claude Code unpacks both archives safely in its workspace, checks path traversal and scripts, writes file list and hashes, and records rights. Do not overwrite original source.
2. Show original tree, original rock and modular terrain source object individually, then compare real DAE/BLEND import and any exported GLB against original with correct texture/UV, pivot, scale and normals.
3. Existing Registry AR4 build, test, validate, bot PR inspection and search of actual pack. Tree and Rock root overrides require verified output; ZIP intake stays source-only until extracted assets are approved.
4. If licensed and adopted, open the actual canonical Asset Librarian GPT Site and verify exact catalog rows; otherwise retain source metadata only with legal/preview restrictions.
5. Optional one deterministic forest/scatter candidate with source trees and rocks, World-approved terrain mask and navigation clearance; no runtime release.

## Evidence status
Source path and byte metadata VERIFIED. Blender meshes/render 0. ZIP extraction 0. Registry regeneration 0. Canonical Site reload 0. Rights 0. Claude Code execution 0. No promotion, merge or Live.
One next gate: NATURE_BATCH_AR4_REFRESH_PLUS_SOURCE_ISOLATION_R1.
