# Card Zone Lab v2 Fluid Shader Source Donor

Status: SOURCE-LOCKED · GLSL 1:1 VERIFIED · visual H0 gate open
Date: 2026-09-22

Working donor:
`tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/card-zone-lab-v3/KFB Card Zone Lab v2.dc.html`

Blob: `43eea82f8727d3581e50374d6263e48a28241d3b`

Reusable module:
`card-zone-v2-fluid-source.js`

Source seams:
- FLUIDS: 252-258
- loadTex: 487-496
- frame time: 473
- material + GLSL: 1010-1086
- fluid geometry + aFlow: 1118-1204
- waterY: 712-733
- riverPath: 772-786
- riverTopAt: 810-828
- riverHalf: 840
- bankTopAt: 862+

Colors:
- wasser [0.16, 0.42, 0.50]
- oel [0.07, 0.06, 0.05]
- saeure [0.46, 0.72, 0.14]
- bubblegum [0.88, 0.42, 0.62]
- schlacke [0.30, 0.27, 0.25]

Textures:
- media/3D_Assets/KFB/waterdudv.jpg: NoColorSpace
- media/3D_Assets/KFB/water.jpg: sRGB
- both RepeatWrapping, anisotropy 8

Geometry boundary:
- the GLSL does not create the lake or river silhouette
- aFlow [0,0] gives still-water motion
- nonzero aFlow gives directional river motion
- shoreline, wet/dry classification and water height remain geometry/environment concerns

Source behavior preserved:
- elapsed seconds drive uTime
- depthWrite false
- polygonOffsetFactor -2
- polygonOffsetUnits -4
- source line `float u = 0.5;` remains unchanged
- no Bench-only uFoam or fluid-kind extension

Verification:
10/10 source checks PASS. Browser/visual parity is not claimed yet.
