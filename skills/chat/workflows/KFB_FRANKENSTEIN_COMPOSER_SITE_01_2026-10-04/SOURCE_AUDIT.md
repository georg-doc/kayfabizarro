# SOURCE AUDIT · KFB FrankenStein Composer Site 01

Date: 2026-10-04
Branch: `planning/frankenstein-composer-gpt-site-2026-10-04`
Audit type: GitHub source/provenance only. **No browser/runtime/GPT-Site PASS is claimed.**

## Result

**12/12 source/classification checks PASS.**
Additionally, **3 legacy documentation paths were rejected as current-main paths** and corrected in the slice brief.

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | ToolBox owner manifest resolves | PASS | `tools/KFB-ToolBox/TOOLBOX_MANIFEST.json` blob `b013e5d1d75a43bd150bf1a018913052eadd9ab3` |
| 2 | ToolBox contracts resolve | PASS | `tools/KFB-ToolBox/docs/CONTRACTS.md` blob `d50e8ece8c37c4033667a892e64630b0de40d286` |
| 3 | Eye owner resolves on current branch | PASS | `pet-eye-rig.v6.js` blob `853bcf5fb090dd6564fda8bc83d0b4cb527e6b26` |
| 4 | Brow owner resolves on current branch | PASS | `brow-rig.v2.js` blob `ccc91a7f48adbf999ed33ca1708bbe5d1c738d0f` |
| 5 | Graft biped owner resolves | PASS | `graft-biped.v1.js` blob `7218fb4b09bcfd7be996d8e307ee1157e342a10c` |
| 6 | FaceHost resolves | PASS | `facehost.v1.js` blob `38ec7770f5fccf3aca93ee234f94b801d527d415` |
| 7 | Head graft resolves | PASS | `headgraft.v1.js` blob `e10cf13ed15eeb78be653489a312051cfc23ec84` |
| 8 | Exact FB EarRig-v5 model donor resolves at its pinned revision | PASS | `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb` @ `19088b142c6a7e7626f27fba8e80caf6ab2437c1`, blob `131d7c3862591708bbd4ad50af39093605b56b92` |
| 9 | Newer FB v5b comparison donor resolves at pinned revision | PASS | `FB_TEMPLATE_LOOK_v5b.glb` @ `23615cff`, blob `24134a51793fef0dd8cab59bbf50b6b7c5960a45` |
| 10 | Current repository-resident clay-lid candidate resolves | PASS | `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/kfb-lib/clay-lids.v1.js` blob `d7cea2ae7be416f32d634190b335f1a40b29c7b2` |
| 11 | Pencil exact source resolves | PASS | `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/pencil_A_long.gltf` blob `0b634a084bbbf6459b26292d11da8a0d39396549` |
| 12 | Motion Library catalogue resolves | PASS | `media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json` blob `694d797702d126e71a724eab137197bf2a8e6914` |

## Corrected stale-path assumptions

The following paths were referenced by older docs but returned 404 on the current branch and are **not** treated as present-day main sources:

1. `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb` on current main — the exact asset is retained as a valid **pinned historical donor** at commit `19088b142...`.
2. `tools/KFB-ToolBox/eye-actor-studio-v1/upper-lid-volume.v1.mjs` on current main.
3. `skills/chat/workflows/KFB_EYE_ACTOR_STUDIO_V1_2026-09-21/EYELID_GEOMETRY_CONTRACT.v1.md` on current main.

For the lid implementation, the current repository-resident 2026-10-01 session-cut copy is the usable implementation candidate. Its own history records the earlier PR #159 lineage.

## Eraser / Rubber

Repository code search for:
- `eraser.gltf`
- `eraser.glb`
- `rubber.gltf`
- `rubber.glb`

returned **zero real asset files**. The existing KCC matrix classifies Rubber/Eraser as `SOURCE_REQUIRED`.

Therefore the Composer must:
- show an Eraser entry only as disabled/source-required;
- never synthesize or substitute geometry;
- admit Eraser only after the real source is resolved and isolated.

## Product-specific source rule

A source record, URL or successful load does not prove the integrated design. Each fixture must produce:
1. exact source donor alone;
2. measured mount/fit evidence;
3. integrated composite;
4. source identity in the saved Actor Recipe.

## Not tested in this audit

- Three.js render;
- body/head visual fit;
- Rig_Large graft fit;
- Pencil EyeRig/lid/brow placement;
- animation playback;
- save/import round trip;
- GPT Site creation/publication;
- Cloudflare Stage.

Those belong to the implementation slice, not this planning/source audit.
