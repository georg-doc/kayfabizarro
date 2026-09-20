# SALVAGE MAP

| Part | Status | Why | Next owner |
|---|---|---|---|
| S14 browser R02 | REUSE_CANDIDATE | 15/15 Chromium/editor PASS | World Atlas |
| in-place TransformControls editor | REUSE_CANDIDATE | patch → reload roundtrip proven | World Atlas / later shared editor seam |
| `kfb.blender-room-manifest.v1` | REUSE_CANDIDATE | 37 visible instances emitted from built scene | World Atlas |
| Blender glTF importer/compiler | NEEDS_ISOLATED_TEST | imports all room instances and saves .blend; review render blocked after save | Blender bridge |
| `KFB_R02.blend` | REUSE_CANDIDATE | valid Blender 4.00 file, 4,115,904 bytes | human local Blender review |
| Ubuntu headless review render | ARCHIVED_FAILED | missing EGL after two repair passes | do not continue in this slice |
| automatic GLB from CI | UNKNOWN | never reached because render step aborted first | only after next gate if needed |
| gameplay collision/navigation | UNKNOWN | intentionally not tested here | Dungeon/Combat later |
