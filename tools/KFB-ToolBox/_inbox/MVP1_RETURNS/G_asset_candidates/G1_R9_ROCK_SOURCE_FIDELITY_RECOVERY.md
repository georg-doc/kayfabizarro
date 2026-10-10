# G1 R9 · Source-fidelity checkpoint / ImageGen failure recovery · 2026-10-10

Status: **1 EXACT SOURCE 4-VIEW PNG PUSHED_VERIFIED; 2 IMAGEGEN ATTEMPTS FAILED; SEAM QUARANTINED; NO NEW ACCEPTED CONCEPT**

Repo: `georg-doc/kayfabizarro` · branch `planning/kfb-mvp1-asset-candidates-2026-10-10` · Owner: KFB Island Worldbuilder Lab / G1.
Current binding brief: planning-branch `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/deliveries/BRIEF_WEBCHAT_ASSET_CANDIDATES_R1.md` §7a.

## Exact source image available for the next visual task
- **Source mesh:** Kenney Nature Kit `media/3D_Assets/kenney_nature-kit/Models/GLTF format/rock_largeA.glb`, actual source blob `40e1365a43b706bd78c2658b48b189c9a35f8923`, 146 accessor positions / 80 triangles, bounding extents 0.78491 × 0.25978 × 1.01546 *original GLB units*.
- **NEW R9 source image:** [G1 rock_largeA original geometry · 4-view PNG](refs/source-isolation/G1_kenney_rock_largeA_source_4view_900.png), 900×675px. It rasterizes all **320 original-triangle projections** (80 faces × 4 camera angles) from the existing geometry-derived [SVG](refs/source-isolation/G1_kenney_rock_largeA_source_4view.svg) with no substitute rock shape. Binary GitHub blob verified `3a707ce06baf76ecd04183bfe4b48a750e2f8dde`, committed as evidence (not Golden, not new runtime asset).
- **Visual finding from source:** This model is **flat and wide**, with an irregular profile and one broad grass-colored upper area. It is emphatically NOT a vertical multiboulder mountain or tall moss tower; its proportions were previously mistaken in the generative mood render. Source image must be supplied as **actual image conditioning** in the next image-creation execution, not only a file URL or text label.
- No new native K2 H measurements were obtained: unit-to-H scale still open.

## Two generation attempts in this continuation, both FAIL
- Attempt R9-A1: `a_bright_clean_concept_art_style_reference_board.png`, 1536×1024. Tall rock tower/multiple rock props in scenic branded poster; invented dimension labels. This violates source flat/wide silhouette and §7a no branding/marketing. **FAIL**.
- Attempt R9-A2: `a_clean_stylized_3d_game_art_reference_sheet_in_a.png`, 1536×1024. Another tower/stack of rocks, additional mascot/figure, branded poster and scene. **FAIL**. No source-fidelity improvement.
- Both outputs were deliberately not entered into `G1_RENDERED_CONCEPTS_R1.json`, not used as `referenceViews`, `picked` or `goldenRef`. The G1 earlier R8 Mood image remains valuable as Mood only. §7a *does* allow labeled multiview boards; the failure here is **wrong subject/source silhouette + banned promotion/characters**, not panel labels.
- **No third imagegen repair** on the same failing route. Probable internal cause UNKNOWN, no claims about internal model prompt grounding.

## Complete failure preservation
User-visible `KFB_G1_ROCK_SOURCE_FIDELITY_FAILURE_RECOVERY_R9_2026-10-10.zip` (4,231,473 bytes, SHA256 `d19a8c876247ed134681a6ae11bea13a08a156272680fee8eba2bcc6289d3773`). Contains both original full-size failed PNGs, a failed-image contact sheet, `README.md`, `POSTMORTEM.md`, `EXPORT_MANIFEST.json` and `CHECKSUMS.sha256`, 7/7 ZIP entries, CRC PASS, both input-image hashes PASS. **ZIP is conversation artifact, NOT on GitHub**. Work needs ZIP attached or persistent storage if failure archive is to be pushed. GitHub receives this exact textual recovery and source image.
Earlier successful visual concepts R8 remain unchanged in `KFB_G1_WEBCHAT_IMAGE_CHECKPOINT_R8_2026-10-10.zip`; do not append failed images to its approved/gallery list.

## Exactly one next gate
**Change execution route:** use the real source GLB to render a material-only KFB clay treatment in the existing local 3D Lab (same 80-triangle shape) **or** pass the actual 4-view PNG as a properly attached image to a fresh image-authoring context with verified source-conditioning. Produce only the flattened single donor with one grass-cap region and at most 5–6 large form roles, no branding or scene. Then save a valid PNG/parts/checksums to NEW additive ZIP and ask Georg to assess silhouette. **Do not rerun the two failed poster-style ImageGen attempts.** No Stage, Site, Live, merge, runtime or second owner.
