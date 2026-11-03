# KFB KayKit Platformer R7 — Material Zone Original GLTF Source Report
**2026-10-28 · Direct Dropbox original glTF material metadata and static source QA; no browser/material shader or source PNG pixel proof.**
**Existing WS0 Game Design / Asset Librarian concept owner; existing Draft PR #435.**

## Inputs and what was actually inspected
- 12 original small glTF source text files from Georg's connected Dropbox Platformer FREE and EXTRA folders were fetched and parsed. All 12 have glTF materials/mesh primitive/child-node data, and those source facts are persisted in KAYKIT_PLATFORMER_R7_MATERIAL_ZONE_GLTF_SOURCE_PROBES_2026-10-28.json.
- Files included blue platform + slope, button, lever, pipe; EXTRA conveyor, saw trap, hammer; neutral floor and red/green/yellow platform variants.
- Of these 12 originals, **8** have one mesh/one source atlas primitive, **3** contain source submesh/child nodes sharing one atlas material, and **1** has two actual material primitive groups (EXTRA conveyor).
- Real source finding: conveyor_4x4x1_blue.gltf material 0 platformer→platformer_texture.png, material 1 threads→threads.png. Blue platform/ramp top is NOT independently addressable through a source material index; blue-colored regions must first be mapped through original UV/BIN atlas or geometric face mask. Button and lever have independently named child source mesh nodes but share platformer material.
- This analysis does NOT sample actual source image pixels or derive correct blue face masks. Different color folders have same source texture filename, not automatically identical texture bytes or palettes.

## Artifacts created (read back from GitHub)
1. KAYKIT_PLATFORMER_R7_MATERIAL_ZONE_GLTF_SOURCE_PROBES_2026-10-28.json — source material & primitive source hierarchy evidence.
2. KAYKIT_PLATFORMER_R7_MATERIAL_ZONE_TARGETS_CANDIDATE_2026-10-28.json — eight proposed source-specific material zone targets and four look-profile candidates, all gated for source/material proof.
3. KAYKIT_PLATFORMER_R7_MATERIAL_ZONES_AND_TERRAIN_COLORBAND_WS0_2026-10-28.md — source → mask strategies → KFB terrain color-band / surreal material mix / existing owner constraints.
4. KAYKIT_PLATFORMER_R7_OFFLINE_MATERIAL_ZONE_SCANNER.py — prepared read-only offline scanner for real GLTF/BIN/PNG post-intake; it parses primitive material assignments, optional pixel color sampling, local triangle orientation. Scanner source file was written/read back, **NOT executed** on source model bytes.
5. Existing CASCADE_SPHERE_R4_WORK_INTEGRATION_BRIEF_2026-10-28.md extended, retaining F-01…F-30 and adding independent future F-31…F-36 material-zone validation gates.

## Actually executed QA
**30/30 static assertion checks PASS** based on files directly re-fetched from the current GitHub PR branch: exact source material slot/data hierarchy and 12 source models, 8 zone targets, unrealized shader status, owner/gate and pending source hashes, existing Work cases retained. These are static source consistency checks; no resulting colorband visual quality is implied.

## Not performed
- Binary GLTF or UV-per-face pixel sampling from original BIN and PNG in full pack: **0**.
- SHA256 of complete 525+370 packs, physical Blender/Three source object renders, native/KFB material A/B, real shader proof and compile, material mix, texture-band animation, WFC instancing, collider/contact, phone/desktop GPU/performance: **0**.
- Runtime WS1 edits, Asset Librarian published gallery/index, new site/Stage/Live, public/private binary upload: **0**.
- No source pixels or final color masks established. No claim that all 171 model roles have per-face material zone maps; the offline scanner is a **preparation** for that job.

## Next one gate
**WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE**, unchanged: actual source pack bytes intake/hash, visual-isolated material and connector proofs and current WS1b receiving host pin, with one platform native/masked top and source conveyor threads vs frame comparison. Then separately authorize only the existing WS1 Level-01 game integration. No auto merge/Live.
