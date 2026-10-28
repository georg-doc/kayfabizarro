# KayKit Platformer R7 — Material Zones, Animated Terrain Color Bands, and Surreal Mixing
**2026-10-28 · Additive user idea + direct source audit. DESIGN ONLY, NO RUNTIME OR REAL SHADER PROOF.**
**Owner:** existing WS0/KFB_HUB Game Design + existing Asset Librarian / KFB CANON_3D material direction. WS1/WS1b R3F remains only productive renderer writer after explicit approval. This is a source-specific refinement to R1–R6, not a new shader/asset catalog/renderer, nor a change to maze physics. WB2 R4 STOP retained.

## 1. What Georg wants
Inspect every KayKit Platformer tile/asset group for independently editable colors, materials, meshes, UV atlas sections and physical faces; selectively wrap some blue platform surfaces, conveyors, pipes or props in flowing KFB terrain-colorband shaders or animated surreal texture/material mixes. Keep original KayKit model structure recognizable and preserve real collision and 3D readability. Expose optional per-model and per-role authoring presets in existing Asset Librarian/Kit Lab/Gizmo pipeline, not global indiscriminate material replacements.

## 2. What the ORIGINAL twelve sampled GLTF JSON files actually reveal
See exact linked data in KAYKIT_PLATFORMER_R7_MATERIAL_ZONE_GLTF_SOURCE_PROBES_2026-10-28.json; these are direct Dropbox file reads, not inferred from filenames.

- Blue platform_4x4x1 and blue platform_slope_4x4x4: ONE mesh primitive and ONE material named platformer, referencing platformer_texture.png, with TEXCOORD_0. **There is no distinct blue/top material in these glTFs.** A simple material index swap would repaint the complete mesh; selective top/blue changes require a verified UV/material mask, face selection or geometry split.
- FREE blue button_base and lever_floor_base: each has two separate source mesh nodes (button/lever child and base), but both primitives reference ONE shared platformer material. You CAN isolate the child mesh at object/node level, then clone its material for an independent effect; a color zone WITHIN that child still requires a mask. Verify lever hinge pivot and real contact before animation.
- EXTRA blue conveyor_4x4x1: an important exception. ONE mesh object includes TWO separately assignable glTF primitives/materials: index 0 platformer + platformer_texture.png and index 1 threads + threads.png. This provides the lowest-risk P0 animated conveyor belt surface, preserving the original frame/material and true graph-based packet motion.
- EXTRA blue saw_trap: its sawblade is an independent child mesh but uses the common platformer atlas. Similar case to lever: mesh separation without an independent source material.
- FREE blue pipe_straight_A, EXTRA blue hammer, FREE neutral floor_wood_4x4: single primitive/platformer atlas; internal colored surface regions cannot be changed independently by selecting a source material index.
- FREE red/green/yellow platform_4x4x1 variants: their material is still called platformer, texture URI still platformer_texture.png. A different folder/color is not a distinct material name. Exact PNG pixel content and UV maps must be inspected before asserting source palette correspondence.
- All 12 original sampled files show PBR metallicFactor=0 and roughnessFactor approximately 0.3 for platformer; this is a source property, not accepted KFB Clay material. Do not lose tone mapping and material identity by a global material replacement.

## 3. Four levels of selective material control (priority order)
1. **Primitive/material-slot mask:** actual glTF primitive with its OWN material (conveyor threads). Animate ONLY that surface, clone material+texture and dispose properly. Never change cached shared source texture globally.
2. **Node/mesh mask:** actual separately named source child mesh (button_blue, lever_floor_blue, saw_trap_sawblade_blue, cannon barrel/turret); clone the mesh instance material, restrict shape/color animation to its visual component. Do not modify game collider or mechanical pivot without current World/Combat owner.
3. **UV/atlas color-region mask:** single-material colored face within platform/ramp/pipe. Requires actual BIN POSITION/UV/normal/index triangle data and source atlas PNG *pixel values* to identify exact mapped palette region. Use an authored mask texture or generated face-zone attribute/geometry material groups, protecting atlas edge bleed and shared UVs. RGB blue threshold is a candidate discovery technique, not safe identity for all family variants or highlights.
4. **Object-space geometric mask:** target top/sloped walkable faces using measured mesh-space face normals/positions and appropriate transform; preserve sides, trims, underside and real source lighting. Requires source-mesh proof and side-by-side compare for normal rotations and warped variants. Normal-only threshold by itself can accidentally include bevels/roof edges, so combine with authored source role and mask.

## 4. MaterialZone authoring proposal (not new SSOT)
For each accepted source asset/material region, existing Librarian/Gizmo may record:
assetRef (repo/path/pinned source SHA256), meshNode, primitiveMaterialIndex, sourceTextureId, sourcePbrSnapshot, zoneId, zoneSemantic, maskKind (primitive | node | uv-mask | object-normal | geometry-split), maskEvidenceRef, approved KFB material/terrain-palette profile, tintBlend, colorBandFrequency, flowAxis, flowSpeed, contrastClamp, audio/physics independence, animated/reduced-motion profiles, shader/dispose/fallback statuses.
Generated masks are derived authoring assets and must be versioned with original source; do not fork a second Registry or replace original purchased files in place. Source object + mask preview are separate. Source tint palette/illumination uses current CANON_3D and current WS1 Terrain/material owner; no invention of six D6 Fluff colors.

## 5. Specific artistic uses in Factory Maze / Mindscape
- Platform top: original KayKit foundation and trims remain visible; a **masked upper area** flows with KFB terrain color bands, gentle low-frequency movement, source silhouette and readable contact preserved.
- Ramp: top sloped surface colorband flows uphill, but only if its source triangle normals, slope and UV mask prove a reliable region. Gameplay climb height/collision stays authoritative.
- Conveyor: scroll original threads material UV or add shader mixed with existing KFB bands; the frame stays original atlas, packet conveyor velocity remains physical graph logic, not affected by scrolling visual texture.
- Pipe: if an interior region cannot be isolated from the single atlas material, prototype a source-valid separate thin flowing inner-surface attachment. The external pipe body should not unexpectedly become liquid.
- Switch: real source child knob bends and changes tint separately, while the base stays native; C1 accepted switch event stays independent of animation.
- Corrupted Goo and repair: use opted-in shell overlays and material-mask blend with KFB organic blob lifecycle; no changing historic buildings or collision via material effect.
- Sweet Supply: source Bakery/KayKit props and material profiles may get frosting, cream, candy-sheen and colorband accents without changing one authoritative L01 Maze graph. Psychedelic material mix should remain legible for all age groups rather than using every effect at once.

## 6. Source-to-Atlas workflow / actual next Work duties
S0 COMPLETE: source inventory 895 GLTF/BIN filenames, 171 canonical neutral+colored families, representative 12 source structure GLTF probes and four proposed boards. No source binary content hashes yet.
S1 MISSING: binary/source intake + SHA256, read ALL 525 EXTRA GLTFs + BIN buffers + PNG atlases offline; output per-primitive material assignments, node hierarchy, UV triangles, source texture colors and face normals. Derive candidate material-zone masks. Do not claim a blue face is a source material if its only material is platformer.
S2 MISSING: actual original GLTF decode + renderer image and angle tests, source/native vs mask vs animated colorband, three still views and short animation clip. Test same camera, same source and KFB palette.
S3 MISSING: source-aware authoring preview in current Asset Librarian/Kit Lab, with searchable zone tags, mask painting/assignment and measured pivot/collider/Gizmo sockets. Validate four boards: seam/floor+ramp, switch child, conveyor/pipe, hazard child.
S4 MISSING: WS1/Work source/material owner confirms use of true palette profile (no second shader engine), binding accepted mask only to visual material, cloned per-instance map/uniform lifecycle with reset/cleanup, comparison effect OFF/ON on focused real Mac/phone p50/p95, draw calls, shader variant count, face/readability and GPU.

## 7. Acceptance and exclusions
A. Native original model/atlas is visually identical when profile OFF and fully works without extension.
B. Blue upper platform/ramp can receive animated bands while underside/side trims remain original; success judged from real frame/source compare including rotations.
C. Conveyor threads-only surface animates independently of its frame and actual Fluff graph state. Verify atlas UV, texture wrap and authored movement direction.
D. Button source child can deform/tint without changing all other cached button instances or static base; reset restores material/pose.
E. Readable source silhouettes/characters and accessible muted/reduced-motion profiles survive; no hardwired camera shake or random flicker.
F. WFC applies only to physically compatible measured modules; no generated materials obscure routes or alter OSM source geometry.
No new working shader, no new PNG masks, no real 3D render, no browser/mobile/GPU performance results claimed in this turn.

**ONE NEXT GATE unchanged: WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE.** Add targeted masked platform top and genuine conveyor threads region to the existing source/measurement intake, but do not block one playable Switchyard on manually masking all 525 models. No auto-merge / Stage / Live.
