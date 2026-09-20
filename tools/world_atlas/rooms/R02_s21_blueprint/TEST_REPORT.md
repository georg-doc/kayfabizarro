# TEST REPORT · World Atlas S14 Room Blueprint · 2026-09-20

Status: **STATIC CONTRACT PASS · BROWSER/BLENDER NOT RUN**

Branch: `world-atlas/dungeon-room-blueprint-s14-blender-2026-09-20`  
Implementation head tested: `548e26a6311ea91b8a8a3d566de4ca20a95fe913`

## Static/source checks

**22/22 PASS**

1. S14 page title present.
2. Three.js TransformControls retained.
3. S21 in-place editor + patch serializer retained.
4. Editor cache has World Atlas S14 namespace.
5. Blender JSON button present.
6. Blender manifest handler wired.
7. Exporter serializes built browser root world transforms.
8. Manifest schema is `kfb.blender-room-manifest.v1`.
9. Existing World Atlas RAW asset base remains commit-pinned.
10. S21 `onFrame` hook promoted into shared `makeViewer`.
11. S21 `onResize`/auto-resize hook promoted.
12. R02 visual reference URL is commit-pinned.
13. R02 resolves to 24 unique model names.
14. All 24/24 model names are present in the KayKit Dungeon asset registry.
15. Blender consumes manifest instances rather than room recipe logic.
16. Blender imports source glTF.
17. Explicit Three.js→Blender basis conversion present.
18. Blender saves `.blend`.
19. Blender review PNG path present.
20. Blender GLB export path present.
21. macOS runner detects the standard Blender application path.
22. runner consumes the browser-downloaded R02 manifest.

## Runtime evidence not claimed

- S14 browser execution: **NOT_RUN**
- Cloudflare fixed Stage: **NOT_DEPLOYED**
- local Blender `.blend` build: **NOT_RUN**
- Blender review PNG: **NOT_RUN**
- gameplay collision/navigation/runtime: **OUT_OF_SCOPE**

The chat container has no Blender executable or `bpy`, so Blender runtime evidence cannot be manufactured here.
