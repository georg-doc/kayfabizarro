---
name: produce-clay-assets
description: Generate, refine, QA, and track one production texture, shader input, craft material, or cutout decal at a time for KFB claymation / DIY stop-motion / diorama game and animation workflows in Blender. Use when asked to start or continue the KFB clay asset queue.
---

# Produce KFB clay assets

## Source and scope

Use `references/asset-queue.md` as the numbered queue. Begin a new queue at **Asset 1: smooth matte clay seamless texture**. On continuation, determine the last human-approved asset from the current conversation or durable production record; if unknown, inspect existing outputs or ask for the last approved number. Do not skip ahead, auto-approve, or make a batch. Generate **one asset per review turn**, show the output and its actual QA, and wait for Georg's explicit review before generating the next. A request to revise means stay on that asset. A user request to jump to a specific asset overrides default order; note the gap.

The KFB ClayBound/KlayBound POC and Style Reference in `georg-doc/kayfabizarro` are **visual donor evidence**, not a replacement runtime or approved texture set. If a reference image is provided, inspect the actual source image in isolation before adapting its surface language; a URL loading is insufficient. Preserve KFB visual identity and existing asset/ToolBox ownership. For a GitHub/Stage production slice, first read the current `skills/chat/START_HERE.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `FRESH_CHAT_SLICE_PROTOCOL.md`, project SSOT and Return/Recovery. No automatic GitHub merge, Stage or Live promotion. Image creation alone is not a live game integration.

## Produce exactly one deliverable

1. Choose the next queue entry and its useful form: square seamless texture, grayscale data map, broad variation map, or clean cutout sheet. Prefer a single isolated asset. Use a sheet only when that entry calls for multiple extractable elements; keep sufficient spacing. No characters, scenes, posters, text labels, decorative framing, cinematic lighting or moodboards.
2. Use the available image-generation tool for raster production. Specify orthographic, flat, evenly lit source capture; matte tactile handmade material; restrained natural irregularity; no glossy plastic, dirt overload, fake fingerprint overlay or obvious noise tiling. Square format for tile maps; alpha background for isolated decal elements when helpful. Do not claim an exact size, alpha, seamless property, displacement accuracy or physical calibration unless verified from output bytes.
3. For tile maps, request periodic continuity in both axes, no border, central hero object, cast shadow, illumination gradient or strong directional mark. Inspect a 3×3 repeat preview and adjacent edges where possible. If seams or repeating features are apparent, repair the **same** asset and recheck. A visually plausible tile without tested boundary continuity is a candidate, not a certified seamless map. Avoid claiming a generated color image is a validated height or roughness map; verify channel and value behavior, or label it a conceptual shader input.
4. For grayscale maps, keep them neutral and avoid embedded color/lighting; inspect histogram and range when practical. For decal sheets, isolate each distinct shape with clean edges and true transparency when the source/output format supports it; a checkerboard printed into RGB is not alpha. Evaluate extraction and scale against a Blender use case.
5. Return the image, the asset number/name, purpose, actual dimensions/format if inspected, tile/alpha QA status (`PASS`, `NEEDS FIX`, `UNTESTED`), and one specific review point. Preserve source and any derived QA preview/metadata in a production record if creating local files. Generated images displayed by the image tool are automatically saved; do not duplicate merely for display. If a separate deliverable file is made, save it durably. Stop and await review.

## Production gates

- Priority order is fixed in `references/asset-queue.md`. Sets (#8, #9) are handled as **one approved swatch/variant at a time** within the same queue item; get review before another variant. Do not blend the 50 entries into a single atlas.
- Keep color, microrelief, roughness, macro variation and masks conceptually separate. Do not infer a normal, metallic, height or roughness map from an albedo render without actual derivation and inspection. No baked directional shadows in reusable textures.
- Keep broad macro variation low-frequency and non-repetitive; document its intended UV/triplanar scale. A sample of a broad variation is not guaranteed seamless.
- If a requested final file needs precise seamless pixels, postprocess and inspect with an appropriate image editor or script; preserve the source and state what was actually done. Two unsuccessful repair passes on the same acceptance gate trigger a preserved failure/recovery note and one smaller next gate.
- If asked to commit or integrate into KFB, follow the named existing owner/branch/Stage route, review isolated donor before integration, save implementation then evidence then Return/changelog/Hub, verify the exact branch head after every write. Human test links use direct `https://kayfabizarro.pages.dev/…` routes linked from the KFB Hub; do not call it live before opening and verifying the revision.
