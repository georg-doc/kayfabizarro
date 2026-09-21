# RETURN · KFB ToolBox · One RGB Texture / Triplanar Palette Lab

Date: 2026-09-21  
Status: **PUBLIC VERIFIED · HUMAN VISUAL GATE OPEN · UNMERGED**

## Exact source state

Repo: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/toolbox-rgb-triplanar-palette-2026-09-21`  
Draft PR: https://github.com/georg-doc/kayfabizarro/pull/160

Implementation/test source head stored in Stage marker:
`43d43f890f17c846232227c2cc153eb5aa28324a`

Public-proof workflow head:
`c7f98ebe19e4401c00d516e45f4ec09fe896873d`

Metadata state immediately before this Return:
`aa161362c994ba2d044d46464643f8c3750664f5`

The final branch head is the commit that writes this Return and must be read from GitHub at handoff time.

## Outcome delivered

A bounded ToolBox material experiment proving Derek-style "one texture" reuse on three real assets.

Each asset is shown simultaneously:
- **SOURCE** — exact model with original materials;
- **ONE RGB TEXTURE** — the same mesh with one shared 256×256 RGB brush texture, triplanar projection and live RGB→palette remap.

Assets:
1. `media/3D_Assets/KayKit_Furniture_Bits_1.0_FREE/Assets/gltf/armchair.gltf`
2. `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/pencil_B_short.gltf`
3. `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb`

Required donor reused rather than replaced:
`media/3D_Assets/pet-surface.v1.js` · blob `ceffefe20ec46d82f6c0da0d6369be53f7ea4b24`

## Public Stage

https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/rgb-triplanar-palette-lab/

The route is linked from both:
- KFB ToolBox public router;
- KFB Hub.

## Evidence

GitHub Actions run: `35659617921`

Branch browser job: `106531493296`  
Public Cloudflare job: `106531991125`

Results:
- branch browser: **41/41 PASS**
- public Cloudflare browser: **41/41 PASS**
- failed public HTTP/resources: **0**
- public page/console errors: **0**
- public source marker observed: `43d43f890f17c846232227c2cc153eb5aa28324a`

Public evidence artifact:
- id `10666710542`
- digest `sha256:22017a3747e47c8e85904ba234e263e20f014f31f9de7a27f2a6938a7ebb976d`
- screenshots: Armchair, Pencil, GothGirl, 832px split view
- `browser.json` proof payload

## Changed files on source branch

Implementation / evidence:
- `.github/workflows/toolbox-rgb-triplanar-palette-lab.yml`
- `kfb-hub/stage/toolbox/rgb-triplanar-palette-lab/index.html`
- `kfb-hub/stage/toolbox/rgb-triplanar-palette-lab/kfb-rgb-triplanar.v1.js`
- `kfb-hub/stage/toolbox/rgb-triplanar-palette-lab/lab.mjs`
- `kfb-hub/stage/toolbox/rgb-triplanar-palette-lab/proof.mjs`
- `kfb-hub/stage/toolbox/rgb-triplanar-palette-lab/SOURCE.json`

Handoff / routing:
- `tools/KFB-ToolBox/_handover/RGB_TRIPLANAR_PALETTE_LAB_2026-09-21/START_HERE.md`
- `tools/KFB-ToolBox/_handover/RGB_TRIPLANAR_PALETTE_LAB_2026-09-21/RECOVERY.md`
- this `RETURN.md`
- `tools/KFB-ToolBox/START_HERE.md`
- `tools/KFB-ToolBox/CHANGELOG.md`
- `skills/chat/START_HERE.md`
- `kfb-hub/stage/toolbox/index.html`
- `kfb-hub/index.html`

## Publication branch

The exact Stage runtime files and public-router links were mirrored to `cloudflare-live` as Stage publication only. Main was not merged and no consumer was promoted.

## Unresolved / human gate

The pure three-color remap deliberately erases most original material-zone identity. This is especially visible on GothGirl and is useful evidence for the decision.

Human question: **does the shared painted surface language itself work for KFB?**

If yes, one next gate only:
**Hybrid zone-preserving proof** — keep selected original KayKit/material color zones while modulating them with the same single shared triplanar brush field.

Do not merge PR #160, replace `pet-surface.v1.js`, or integrate into a consumer before that gate is named.
