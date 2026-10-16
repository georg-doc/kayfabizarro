# KFB KTX2 GPU Texture Options R1 — Return

Date: 2026-10-16
Mode: RESEARCH (no implementation)
Owner: KFB cross-project research, existing Clay Style SSOT / 2D Animation Studio / Billboard owners protected
Repository: georg-doc/kayfabizarro
Branch: research/kfb-ktx2-gpu-textures-r1-2026-10-16
Initial branch parent: main fe9d95e20d660261370c02cb6bca0afe439c0979
Full report: ASSESSMENT.md
PR: research-only Draft review route, when created

## Outcome
Examined Georg-provided Reddit testimony about KTX2 reducing one 3D video-tape-cover room's reported GPU usage 1.5GB -> 335MB. Verified Three.js KTX2Loader, official Khronos KTX tools, glTF Transform KHR_texture_basisu/WebP notes, npm ktx2-encoder and Remotion ThreeCanvas docs. KTX2 is plausible, high priority only for KFB consumers with **many resident image textures in WebGL**; no blanket conversion of K1/H0 Clay Golden or Remotion SVG/Canvas2D/video. Original source and existing owners stay unchanged.

## Read checks / result limitations
- Upstream technical document families consulted: 5+ (Three, Khronos, glTF Transform, npm, Remotion), not execution tests.
- Relevant KFB source/router/SSOTs reviewed: 8+ including current Clay PR #301, Clay matrices, 2D Animation Studio and cartoon-motion skill.
- GitHub KTX2Loader/basisu code search results in repo: 0 matched; search not exhaustive or proof of absence.
- Compression commands actually run: 0.
- KFB source textures actually converted: 0.
- Render, GPU VRAM, loading-time or browser tests: 0.
- Screenshots captured: 0.
- Cloudflare Stage or GPT Site: NOT_REQUIRED / NOT_PUBLISHED.
- Implementation, PR merge, Live promotion: NONE.

## Files / protected state
ASSESSMENT.md and RETURN.md are research-only. No production textures, assets, animation, GLB/GLTF models, Slices, runtime or central Hub routing modified. Source fidelity, license/provenance, color-space, normals, text and silhouette Golden remain required.

## Unresolved
Actual resident GPU memory by KFB asset family, iOS Safari support of chosen runtime transcoded GPU format, ETC1S vs UASTC text/normal fidelity, quality vs load cost, and whether a particular Remotion production slice uses ThreeCanvas are NOT measured.

## Exactly one optional next gate
A single **source-isolated existing Three/WebGL texture-dense KFB slice** benchmark: original files vs ETC1S vs UASTC on same known device/camera, preserve original as rollback, show source object and matched visible screenshots, texture residence/VRAM estimates, first-frame/compile/upload and device acceptance. Decide whether to adopt only after measured benefit and owner/human gate. No runtime patch and no second owner before then.
