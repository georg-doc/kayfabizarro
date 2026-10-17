# KFB GPU Texture Compression / KTX2 — options R1

Date: 2026-10-16
Mode: RESEARCH / TECHNICAL ASSESSMENT ONLY — not implementation, not a new runtime or material SSOT
Repository: georg-doc/kayfabizarro
Research branch: research/kfb-ktx2-gpu-textures-r1-2026-10-16
Research steward: KFB Chat Production / existing KFB Clay Style & Asset pipeline routing
Source trigger: Georg's supplied r/threejs Reddit text, https://www.reddit.com/r/threejs/s/sGMRt9dLBC

## Summary

The author reports a VHS room with hundreds of tape-cover textures: changing JPEG/WebP into GPU-compressed KTX2 decreased measured scene VRAM from ~1.5 GB to 335 MB (approximately 77.7% scene-specific reduction). This is user-provided author testimony, NOT replicated KFB testing or a general benchmark.

This is technically credible. JPEG/PNG/WebP are delivery-compressed images but typically decompress to uncompressed texture data when uploaded to WebGL. KTX2 is a texture *container*: Basis Universal ETC1S/BasisLZ or UASTC payloads are transcoded into GPU-supported block-compressed formats, often staying compressed on GPU.

For RGBA8 2048x2048 with full mip pyramid, byte estimate is ~21.33 MiB (uncompressed). For a GPU 8-bits-per-pixel block format ~5.33 MiB; 4-bits-per-pixel ~2.67 MiB. These are representative formats, not KTX2 universal memory guarantees. ETC1S transparency may need extra blocks; ASTC block-size choice changes bpp, fallback hardware may alter results. 2K with no mips 16 MiB RGBA8. Separate network file sizes from GPU memory size and upload/transcode times.

**Decision proposal:** WATCH / selective offline optimization POC when one verified texture-dense Three/WebGL consumer warrants it. Do not convert all KFB textures or substitute existing Golden-locked clay materials.

## KFB applicability matrix

| Candidate consumer | Fit | Reason / constraint |
|---|---|---|
| Three/WebGL decks, many card faces, 3D wall posters, unique billboards, densely image-textured props | HIGH if many distinct uploaded textures truly coexist | Dominant texture count/resident pixels match VHS example; choose only a confirmed existing owner, not a replacement image/billboard scheduler. Separate text overlays from lossy compressed surface art where possible. |
| GLB/GLTF 3D packs, unique diffuse/baseColor materials | MEDIUM-HIGH when actual memory inventory confirms substantial texture footprint | Offline KTX2 + KHR_texture_basisu integration using accepted glTF pipeline; preserve original GLBs and asset provenance. |
| KFB Clay material family | SELECTIVE | Existing v10 rest-space tri-axis relief, generated hand marks, fingerprints and K1/H0 Golden; many details are procedural, not texture-file loads. A 1x shared grain texture already reused does not yield VHS-scale benefit. Preserve albedo/normal/roughness and source colors; encode derivative only, do fixed camera Golden before adoption. |
| KFB World/Island/WB2 / racers | SELECTIVE / DO NOT PATCH CURRENT RUNTIME | High polygon/frame/physics cost does not improve through texture compression. Wait for explicit memory evidence; receiving project and renderer own integration. |
| Comic motion / 2.5D layers rendered by Three/WebGL (e.g. cutout planes, depth-stacked scene art, KFB cardboard sprites) | MEDIUM-HIGH when substantial raster assets remain resident | Apply KTX2 only to the actual WebGL textures. Atlas, resolution tiers, life-cycle/dispose, preload and material reuse remain complementary. |
| Classical 2D / Remotion HTML/SVG/PNG/WebP/HTML Canvas/video slice | LOW/NONE direct | KTX2Loader is for Three/WebGL texture upload, not a drop-in for HTML img/CSS/SVG/Canvas2D or MP4 encoder; optimize resolution, WebP/AVIF, vector cutouts, timing/layer visibility, precomposition. |
| Remotion ThreeCanvas / react-three-fiber slice | POSSIBLE | KTX2 works inside Three pipeline, but deterministic useCurrentFrame() authoring, wait-for-textures-before-capture and WebGL launch compatibility must be proven. No expected reduction in final rendered MP4 size. |
| UI labels / card typography / high-contrast ink and outlines | IMAGE QUALITY SENSITIVE | Block artifacts/bleeding/edge halos can harm read; keep SVG/vector layers or use UASTC and screenshot A/B. |

## Canonical KFB source and ownership read

- Binding Clay style contract: skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md, source work/clay-style-ssot-2026-10-01 PR #301.
- Clay SSOT: tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md, KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md; original K1/H0 v8 visual Golden, K2 v10 technical baseline.
- Existing K2 material: clay-material.v10.js, clay-relief.v4.js, clay-toolmix.v1.js and profiles. Includes derivative-aware object-rest-space three-axis textures and distance LOD. Do not override.
- Existing clay_floor_001 map is a separate stand-in; measured grain 4.67 / threshold 8 and stacking grey relief changed measured contrast 1.90 -> 1.14; pin and license check apply before adoption.
- Original user texture/GLB sources, scene/camera, normal maps and alpha policy are sacred. Compression is a derivative build asset. Test isolated source art first, then integrated scene.
- 2D Animation Studio: tools/2D Animation Studio/START_HERE.md and WIP_STATUS.json; active Eumel 2D/2.5D cutout authoring. No blanket KTX2 integration; its real Three adapter could be a later bounded consumer only if texture-memory dominated.
- Animation craft: skills/kfb-cartoon-animation/references/75-vfx-audio-camera-comic-motion.md and 05-2d-2_5d-compatibility.md. Preserve timing, actor ownership, readable ink, no new animation engine.
- Existing Billboard Content / presentation B1/B2a owns media/scheduling; KTX2 must not add a competing scheduler.
- Repo code search on 2026-10-16 returned zero for KTX2Loader and basisu; search limitations mean NOT a proof that no project branch/tool has ever used KTX2.

## Offline encoding choices & technical edge cases

- **ETC1S / BasisLZ:** usually smallest files, good for varied photographic/broad albedo. Can show texture gradients/lettering artifacts, particularly small comics/card text, and may use separate alpha payload. Quality inspect before use.
- **UASTC:** generally higher-quality texture data and bigger source files, often better for normals, alpha edges, high-frequency ink, and repeated visual reviews; GPU output bpp still depends on target format. Not automatically lossless.
- **Normal maps and ORM:** use linear/no color transfer, not sRGB; do not blindly apply ETC1S. glTF Transform warns normal and occlusion/roughness/metalness maps can suffer with ETC1S; try UASTC and review channel fidelity.
- **Albedo/color:** maintain correct sRGB interpretation, alpha boundaries, premultiplication and sampler/wrap settings. Preserve original sRGB/source palettes and source maps.
- **Mipmaps:** account for +~33% VRAM for a full 2D pyramid; generate/test to avoid minified shimmer and moire. For atlases preserve padding/gutters and alpha bleeding behavior at every mip; inspect text and seams.
- **GPU support:** Three.js KTX2Loader uses WASM transcoder and detectSupport(renderer), mapping Basis texture to actual supported GPU formats. Verify mobile iOS Safari, lower-end PC, and fallback behavior; no global rejection of original JPEG/WebP until proven.
- **Loader lifecycle:** configure transcoder once, preload and share textures, avoid repeatedly allocating per frame, dispose of unused GPU resources. KTX2 alone does not solve excessive materials, draw calls, render targets, lost contexts due to other allocations, or dynamic video/canvas textures.
- **Encoder:** packages mentioned by author: ktx2-encoder npm; or official Khronos KTX tools / toktx; GLB use glTF Transform KHR_texture_basisu-compatible pipeline. Validate encoders/release and provenance; only run from pinned isolated setup.
- **Asset catalog:** keep PNG/JPG/WebP originals and uncompressed working asset as source truth. Record generated KTX2 as derivative with source SHA, encoder version/settings, dimensions, mip count, format, sRGB/linear, alpha flags and target browser test facts.

## Measurement & acceptance (no tests run for this research)

1. One *existing* texture-dense KFB Three/WebGL fixture identified by evidence (not invented), its current owner explicitly authorizes derivative asset test. Inventory actual unique GPU-resident textures, dimensions, formats, mips, duplicates, source types, JS/HTML/WebGL ownership and lifetime.
2. Prepare precise 1:1 baseline JPG/WebP/PNG vs offline KTX2 ETC1S and UASTC derivatives. Pin the same camera, scale, lighting, time/frame and device.
3. Before integration inspect source texture/object individually. Compare full scene screenshot at near/mid/far: color, Clay identity, typography, texture seams/alpha, normal/roughness and moire. No source object changes.
4. Measure upload/transcode and GPU memory estimates/real device tools (driver/browser memory if available), resident texture count, WebGL context errors, time-to-first-visible, low-end GPU frame time, file bytes, CPU/RAM overhead and loader compatibility.
5. Apply only in a reversible derivative asset-loading adapter owned by existing consumer. Preserve known-good original fallback. Independent critic and Georg Golden review before actual promotion.
6. Stop/decline KTX2 if image quality, device support, time-to-first-frame or evidence fail to justify improvement.

**Single next gate:** Existing owner/source inventory + one isolated representative Three/WebGL texture-dense asset test comparing original, ETC1S and UASTC with screenshot, GPU memory and load-time evidence. No production runtime changes until the test identifies a meaningful actual win.

## Source references consulted

Reddit statement as provided by Georg in chat (not independently measured).
https://threejs.org/docs/pages/KTX2Loader.html
https://gltf-transform.dev/modules/extensions/classes/KHRTextureBasisu
https://gltf-transform.dev/modules/extensions/classes/EXTTextureWebP
https://github.com/KhronosGroup/KTX-Software
https://www.npmjs.com/package/ktx2-encoder
https://www.remotion.dev/docs/three-canvas
Official KFB Clay / 2D/2.5D / animation docs as listed above.

## Status
NOT_IMPLEMENTED. 0 encoder invocations, 0 WebGL integration, 0 own VRAM/visual comparisons, no site or public Stage. No claim of tested benefit in KFB. This report is research evidence only, not a change to authoritative Clay SSOT, Studio, Motion or Billboard ownership.
