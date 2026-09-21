# TEST REPORT — Card Zone Lab v2 Fluid Source Lock

Date: 2026-09-22
Branch: `chatgpt-web/card-zone-v3-h0-parity-2026-09-21`

## Source comparison

Source:
`tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/card-zone-lab-v3/KFB Card Zone Lab v2.dc.html`

Source blob:
`43eea82f8727d3581e50374d6263e48a28241d3b`

Candidate:
`tools/KFB-ToolBox/_handover/CARD_ZONE_V2_FLUID_SHADER_SOURCE_2026-09-22/card-zone-v2-fluid-source.js`

Connector-native comparison result: **10/10 PASS**

1. PASS — donor blob pin
2. PASS — five source palette rows, 5/5
3. PASS — Vertex GLSL verbatim, 13 source lines
4. PASS — Fragment GLSL verbatim, 31 source lines
5. PASS — source texture references, 2/2
6. PASS — RepeatWrapping / sRGB / NoColorSpace / anisotropy 8
7. PASS — material flags: DoubleSide / depthWrite false / polygon offset -2,-4
8. PASS — elapsed-seconds uTime seam
9. PASS — source foam state preserved; no uFoam activation
10. PASS — no Bench fluid-kind extension

## Dropbox corroboration

Dropbox search found the 144800-byte export:
`/CLAUDE/KFB Card Viewer + Crda Zones + Combat Mech + Voxel World + Hex Assets Worldbuilding(5)/export/card-zone-lab-v3/KFB Card Zone Lab v2.dc.html`

Dropbox file id:
`id:KeQLaY5-IIAAAAAAAAbtow`

Dropbox text extraction did not expose the full HTML source, therefore byte/content equality with GitHub was **not claimed**.

## Runtime / visual status

- source parity: PASS
- shader browser render: NOT_RUN
- full Card Zone v2 H0 browser parity: NOT_RUN
- screenshots: NONE
- Stage: NONE
- Live: NONE
- Cloudflare public verification: NONE
- game-dev: unavailable in this runtime; repository-native checks used

This report proves source extraction only. It does not close H0 visual parity.
