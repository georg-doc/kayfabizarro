# KFB Game Dev Studio · LATO.2 / Mac-first Mesh Pilot · 2026-11-22

**Status:** RESEARCH VERIFIED (repo/source claims) · PREPARATORY BOUNDED SLICE BRIEF · NOT IMPLEMENTED · NOT RUNTIME ACCEPTED  
**Owner:** existing `tools/game-dev-studio/` package/visual preview lane. Canonical donor identity: Asset Registry / Librarian. Geometry-authoring source handoff: existing `tools/img2threejs/`; eventual runtime receiver only via named World/Race owner.  
**Source base:** `georg-doc/kayfabizarro` `main` @ `a9143605b1463df36c0e57d7092d5253d7e7b721`; Race `game/integration-r2` @ `d7e0f99092827752a91e679350bfdd6f65041d91`.  
**Mode:** RESEARCH now; next executor = one bounded visual package POC. No new asset registry, renderer, runtime, GPU service, model-training pipeline or publication owner.

## 1. Decision support / source facts

- Original: https://github.com/LoHhhha/LATO.2 at `master` @ `650b48fb1257c83ec1358f0c9f1d95d5cb9c7468`. Source: `readme.md`, `setup.sh`, `scripts/image_e2e_inference.py`, `scripts/e2e_inference.py`.
- Pretrained LATO.2 model: https://huggingface.co/0x4c48/LATO.2; official HF trial: https://huggingface.co/spaces/0x4c48/lato2-mesh-generation. The repo is MIT; HF model card marks MIT. Check the actual upstream dependencies/models and source asset license separately before redistribution.
- LATO.2 separates *vertex generation* (V-Flow) from *topology generation* (T-Flow), with `--vert_num` target clamped by default to 200–5,000. The target is not a strict output ceiling.
- Mesh-to-mesh runs `scripts/e2e_inference.py`; image-to-mesh runs `scripts/image_e2e_inference.py`. The latter removes backgrounds with BiRefNet and uses TRELLIS sparse-structure generation (64³ scaffold). Generated outputs include OBJ mesh, PLY vertices/coords and conditioning/scaffold artefacts. These are **geometry candidates**, not textured, UV-mapped, rigged or collider-ready GLBs.
- Upstream explicitly warns that output can contain holes/incorrect connectivity. The authors' approx. 5-second sample is **H800 hardware**, not an M1 Max/consumer GPU benchmark.
- Setup specifies Python 3.10, PyTorch 2.6.0/CUDA 12.4, and an NVIDIA CUDA compiler `nvcc` to build CUDA extensions; dependencies include `spconv`, `nvdiffrast`, `CuMesh`, `FlexGEMM` and `o_voxel`. Setup has exploratory HIP handling, but no documented turnkey macOS/MPS path. **No supported Mac-native or CPU-only LATO.2 claim**.
- Unofficial ComfyUI adapter: https://github.com/sakalond/ComfyUI-LATO2 @ `b9056ca27e6dbdfe546de4700f98afe8c1e7bcf5`. Requires NVIDIA CUDA; its installer reports ~13 GB disk plus own Python/model environment. Treat wrapper license and upstream license independently.

## 2. Concrete KFB workstation baseline / feasibility

| Hardware | Direct official LATO.2 | Useful production role |
| --- | --- | --- |
| MacBook Pro 16-inch 2021 / M1 Max / 32 GB Unified Memory; local SSD tight | NO CUDA | Main source inspection; Blender/mesh cleanup, local WebGL viewer, Mac-native model pilot when dependency/space budget confirmed |
| Mac mini M4 / 16 GB | NO CUDA | Lightweight mesh QA, browser visual QA and optional low-memory native experiments; do not assume heavy 3D generation fits |
| Temporarily available MacBook Air M4 / 24 GB | NO CUDA | Independent Apple Silicon comparison if accessible |
| Remote NVIDIA/CUDA workstation or hosted GPU | YES if correct package/CUDA/toolchain and adequate VRAM | LATO.2 **inference only**; return generated mesh+full manifest to existing package lane |

- The quoted **~8 GB refers to GPU VRAM on a supported CUDA stack**, **not** a Mac Unified Memory compatibility guarantee. Full image-to-mesh can have higher transient usage.
- Budget for ~8 GB VRAM as upstream minimum; use ≥12–16 GB as unvalidated engineering margin when *choosing* rental hardware, not a measured KFB requirement. 24 GB CUDA is a comfortable experiment tier, not required by proof.
- **Model training is unnecessary.** Use published pretrained checkpoints. Finetuning or training is out of this pilot and would require separate data/compute/licensing decisions.
- Mac candidates worth explicitly testing rather than promising: https://github.com/sanchez-kim/trellis-silicon @ `eaae74ab54e355653c4ab8cc10c27e7461857564` (MPS/Metal TRELLIS.2); https://github.com/lyonsno/trellis2mlx @ `449bfbc011401fe03d684a01f0b1068bfe8f6ceb` (MLX TRELLIS.2). These create textured GLBs with their own simplify/bake/export paths. **Neither is a LATO.2 port.** No verified KFB M1 Max timing yet.
- Because MBP storage is constrained, prioritize browser-based hosted LATO proof and installed Blender/WebGL first; if native model tests proceed, measure free disk and keep model caches on external fast storage where the framework supports that. Do not install multiple >10 GB stacks blind.
- Demo/remote workers are external processors: only upload rights-cleared/non-private source candidates until service retention/visibility are verified. Private/paid assets must stay in the existing private production boundary.

## 3. Bounded outcome: one actual source-backed 3D comparison

**Goal:** one verified existing *KFB prop or isolated diorama element*, not a recreated placeholder, becomes a reusable package with directly comparable original / conventional simplification / LATO.2 geometry at comparable densities.

**Exact work sequence**
1. Existing Asset Librarian selects ONE legally eligible source object and pins file/commit/hash/license. Open the actual source object **in isolation** in existing Game Dev Studio viewer; screenshot before derivative generation. A fetched/loaded URL alone is not proof that the actual donor design was used.
2. Establish stable mesh stats (verts, triangles, bounds, materials, submeshes, UV count, file size); take fixed frontal, side, 3/4 and wireframe screenshots (same camera and object frame). Do not overwrite source.
3. Generate standard Blender *Decimate* reference using comparable **actual triangle counts**. Preserve input and target metadata.
4. Run LATO.2 via official public demo if suitable/available OR ephemeral NVIDIA/CUDA execution. Export candidate at target 500 / 2,000 / 5,000 vertices **only if the source successfully generates**; record actual values. Partial success is valid evidence; do not invent missing files. For Mac-native comparison, optional one TRELLIS-Silicon or trellis2mlx run using same image where supported, but do not expand pilot until its output is demonstrably useful.
5. Inspect output geometry for holes/non-manifold edges, duplicate/inverted faces, disconnected parts, normal consistency and silhouette preservation. Note: watertight is asset-dependent, not universal.
6. Convert passing OBJ candidate(s) through Blender to explicit GLB derivatives. Retain source material/texture if a valid transfer is performed and checked, **never label plain geometry as textured**. UV and collider/rig validation remain separate.
7. Reuse existing Game Dev Studio package-first gallery (not new editor). Provide source and variants with synchronized orbit/front/side/3/4, optional wireframe and verified metrics. If the current viewer does not support a side-by-side display, create a **small additive package-mode adapter** inside its existing owner, not a new frontend/asset owner.
8. If a meaningful visual package is produced and public review is required, integrate through existing owner publishing route; only direct `https://kayfabizarro.pages.dev/…` linked by the KFB Hub qualifies for formal Stage acceptance. Until opened and revision checked, label `NOT PUBLIC VERIFIED`.

**Metrics/test record per derivative**
`source_sha256`, `input_license`, `model_repo_sha`, `checkpoint_id`, `backend`, `compute_device`, `requested_vertices`, `actual_vertices`, `actual_triangles`, `GLB_bytes`, `open_edges`, `nonmanifold_edges`, `disconnected_components`, `UV_sets`, `material_count`, screenshot paths, visible silhouette review, generation duration, browser errors, per-view visual observations. Performance/FPS only if actually measured on a named test device and fixed scene.

**Comparison criterion:** LATO geometry must preserve the recognizable source silhouette and/or relevant detail better than **Decimate at similar actual triangle budget** to justify the extra AI inference. LOD values are candidates until tested as real receivers; polygon count alone does not prove FPS improvement.

**Acceptance boundary:** `SOURCE_ISOLATED + REAL_MESH_DERIVATIVE + QA_RECORD + VISUAL_COMPARISON + GLB_PREVIEW` => POC ready for receiving-owner review; no silent Game/World integration, no auto-merge, no Live promotion.

## 4. Resources / implementation boundary

- Source/rights owner: `tools/asset_registry/`; package/visual QA: `tools/game-dev-studio/` and `game-ready/`. Optional geometry-authoring adapter: existing `tools/img2threejs/`.
- Reuse Blender, Three.js/WebGL viewer, existing export and catalog conventions. User-facing preview is Mac-compatible and should run without inference backend. No bespoke LATO browser inference claim.
- Production runner: external CUDA GPU *only if a test truly needs it*. No paid resource provisioning or remote uploads were authorized by this research note.
- The existing `game-ready/pilot-01-lorekeeper-sedan/`, Theatre Curtain, Eumel and active Race production baselines remain unchanged. Do not displace their gates.
- This turn is **SOURCE REVIEW ONLY**: 0 generated meshes, 0 inference executions, 0 geometry tests, 0 visual browser proofs, no Stage URL and no adopted renderer.

## 5. One next gate

**`GDS_LATO2_ONE_ASSET_VISUAL_COMPARISON_POC`** — Game Dev Studio/WSA builder chooses a current source-backed safe asset, produces one isolated original + at least one real LATO output (hosted or CUDA) + comparable Blender simplification, visually compares them in the existing 3D package preview and returns fixed screenshots, geometry measures, exact source/derivative provenance, backend/runtime cost, failed cases and one clear KEEP/DEFER conclusion. If hosted inference cannot execute without uploading private source, use a public/CC0 donor; do not leak private assets. If no LATO output is possible, preserve the blocked candidate and report `INFERENCE_UNAVAILABLE` instead of fabricating a visualization.

**Human action now:** none. No new manual hardware-install gate; test machine and any remote spending require the executor to obtain access through existing authorized channels.

## Sources

- https://github.com/LoHhhha/LATO.2/blob/650b48fb1257c83ec1358f0c9f1d95d5cb9c7468/readme.md
- https://github.com/LoHhhha/LATO.2/blob/650b48fb1257c83ec1358f0c9f1d95d5cb9c7468/setup.sh
- https://huggingface.co/0x4c48/LATO.2
- https://huggingface.co/spaces/0x4c48/lato2-mesh-generation
- https://github.com/sanchez-kim/trellis-silicon/tree/eaae74ab54e355653c4ab8cc10c27e7461857564
- https://github.com/lyonsno/trellis2mlx/tree/449bfbc011401fe03d684a01f0b1068bfe8f6ceb
- https://github.com/sakalond/ComfyUI-LATO2/tree/b9056ca27e6dbdfe546de4700f98afe8c1e7bcf5
