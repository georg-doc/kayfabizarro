# Reference lock · G4 R3-G0

Repository georg-doc/kayfabizarro; current baseline branch wsa/kfb-modelling-test-stairs-2026-10-10 verified at 52099710569a98393325ee94becf616f418b35f2. Briefing owner planning/kfb-g4-stairs-reference-2026-10-10 verified at c878256718ca93d3c3815c56185a2674ef4fb65b. Default main at read dccf75cabd222d951380693d84ab88053ee7e519. Execution candidate is on its separate R3 branch.

## Verified original bytes

Source bytes were read from existing local donor copies and hashed; Git blob identities match the live source-branch directory metadata. `source_bytes.json` contains file length, SHA256 and Git blob SHA for all eight files, including both KayKit .bin dependencies.

- R1 GLB: Git blob 478952efd47d069fc1994be2bf9fde7241ce08ce, SHA256 5dc83f19beb8b8ba6b20b3b7ae1d19c6a39b8b80045cda14376ae462e4729151.
- R2 GLB: Git blob 288105f7040ee29f69fcc4247e1e0c89d6ba6467, SHA256 82a20339c39e6e93a71a389dbb39978b7362b562e52999d90539039b131ebb28.
- KayKit `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/stairs_walled.gltf` + .bin: 138f4e01be1901d43e57b5ddabfce5e68d5da5eb / 9d7dbb8a433e13c6e6dde4f0852cf82d31bed732.
- Same source directory `stairs_wide.gltf` + .bin: 3cb8f4bd01875de98d4711bc1af4f8e8ba8a5b23 / f73122a09e5978449a241d757358207671b83b98.
- Kenney `media/3D_Assets/kenney_castle-kit/Models/GLB format/stairs-stone.glb`: 4f37d912359ac414d01855d2b5b84bf6aa8c99a5.
- Same source directory `wall-narrow-stairs.glb`: 49ac98e47870aabfa1dda0cf2e7ff17973f828a3.

## Actual source isolation

`renders/source/{R1,R2,KayKit_walled,KayKit_wide,Kenney_stone,Kenney_wall}_{front,three_quarter,side}.jpg` are new real Blender imports, one source per scene. Geometry is unchanged. QA neutral material override only. R1/R2 retain native transforms/scale and the same cameras. The four smaller originals receive documented uniform display scaling and fitted framing; no deformation or source rewrite. `source_isolation.json` records native bounds. Full views accompany the labeled contact sheet. The old real R1/R2 comparisons are retained separately.

Design source roles: R1/R2 = functionality/proportions, not form Golden; KayKit/Kenney = original form and structural reference, not KFB material canon. R3 massing is new authored geometry, not a donor-exact clone.

`G4_stone_bridge_sheet_webchat_r1.webp` and the two Webchat stair mood sheets are STYLE_DIRECTION_ONLY / SOURCE_REQUIRED (image bytes not available in this run). No visual comparison is claimed for them. Clay Surface Canon was read live but is not applied until form gate.

No paid generation, ImageGen replacement, second runtime or altered donor files. Optional game-dev CLI unavailable; Blender-native fallback used. Blender 5.2.2 LTS runs outside the local sandbox because its restricted startup crashed before import; no source change resulted from that crash.
