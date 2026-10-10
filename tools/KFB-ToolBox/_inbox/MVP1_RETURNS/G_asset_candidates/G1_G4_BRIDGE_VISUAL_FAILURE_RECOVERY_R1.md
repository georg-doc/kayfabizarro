# KFB MVP-1 · G4 Steinbogen-Brücke · Visual Failure Recovery R1

Status: **G4 IMAGE GENERATION SEAM QUARANTINED · 2 NON-IMPROVING ATTEMPTS · NO ACCEPTED BRIDGE IMAGE**
Date: 2026-10-10
Owner: existing KFB Island Worldbuilder Lab / G4 bridge-and-stairs visual review; G1 branch stores an additive editorial failure packet only
Branch: `planning/kfb-mvp1-asset-candidates-2026-10-10`
Related source: `sync/lab-rkit-2026-10-09`

## SOURCE
- Original [img2threejs bridge01 source-vs-render comparison](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/tools/KFB-ToolBox/_inbox/KFB%20Island%20Worldbuilder%20Lab/tools/img2threejs-tests/bridge01/COMPARISON_final_ref_vs_render.png).
- [img2threejs bridge01 actual TEST_REPORT.md](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/tools/KFB-ToolBox/_inbox/KFB%20Island%20Worldbuilder%20Lab/tools/img2threejs-tests/bridge01/TEST_REPORT.md): original skill test is **Tier-1 FAIL**, 234k triangles, not accepted production geometry. Reference image was CC0 low-poly one-arch stone bridge; use source geometry as starting silhouette, not finished bridge runtime.
- Desired §7 isolated object: single stone-arch bridge only, no scene, vegetation, banners, fences, lamps, vehicles, people, animals, typography or added KFB branding, neutral light background.

## TWO ATTEMPTS · EVIDENCE
| Attempt | Produced | Concrete failure | Verdict |
|---|---|---|---|
| A1 · `wide_colorful_stylized_3d_toy_clay_textured_con.png` | Multi-view "KFB Islands" marketing sheet, water/island environment, palms, signposts, lamps, branded heading | Not isolated; multiple compositions and unauthorized props/lettering | FAIL |
| A2 · `wide_colorful_stylized_concept_art_3d_render_coll.png` | A second branded, labeled 3D bridge concept sheet, mixed contexts and accessory/detail tiles | Same core violation after explicit corrective instruction to isolate one bridge | FAIL, no gate improvement |

- A1 1536×1024 PNG, SHA256 `02a770ae4022c60a2fb8ef928aab6a84ab248bfd63916d66483a4b8971f1ffbe`, 2,295,672 bytes.
- A2 1536×1024 PNG, SHA256 `a88779454890b682ce4715ebc346ca7edfc42a6f78caeacf41a7af814e143bae`, 2,167,273 bytes.
- Both full-size PNGs + two separate 256px failed previews + POSTMORTEM + MANIFEST + SHA256 exported as user-visible **`KFB_G4_BRIDGE_FAILURE_RECOVERY_2026-10-10_r1.zip`** (4,331,883 bytes; SHA256 `4cdf6cbf812650baf62982d17a4402c00d519f8706de6c7d661884b224435735`). **Chat artifact, NOT uploaded to GitHub**, do not invent a repository link.

## EVIDENCE CLASSIFICATION
- **PROVEN:** two generated image outputs include extra scenes, multiple panels, labels and motifs forbidden for a single isolated donor-asset depiction. The second render did not repair the first defect.
- **HYPOTHESIS:** concept-board presentation bias from prior composite donor comparison influenced image output; not proven.
- **UNKNOWN:** exact internal image-generation prompt/conditioning (returned prompt metadata blank), actual donor image conditioning, geometry source fidelity, native K2 dimensions.
- **SALVAGE:** rounded warm-cartoon stone material impression may be useful for mood comparisons only. Neither failed image is a source-faithful model image, Golden, or accepted G4 bridge candidate.
- **BLOCKER SCOPE:** only G4 image-generation seam quarantined; all 40-motif worklist and G1 existing gallery remain valid. No product-wide stop, no runtime change.

## RECOVERY CHECKLIST / ONE NEXT GATE
The active G1 next gate remains **upload 3 full-resolution approved-island-concept PNGs** from `KFB_MVP1_G1_Concept_Images_2026-10-10.zip` to the existing G1 image paths on the same planning branch with exact SHA verification and gallery metadata readback. G4 artwork stays **DEFERRED/QUARANTINED**; before G4 resumes, its actual owner must present and pass one unlabeled bridge-only single-source 3/4 still from the real CC0 reference and not rerun this failed two-attempt sheet correction. No second renderer, no runtime/Stage/merge.
