# img2threejs v2.0.0 — Test bridge01 (cartoon stone arch bridge for KFB)

Date 2026-10-10. Wall clock about 13:36 to 13:55 (roughly 20 min of the 60 min box). 3 of 3 correction iterations used; the state gate then hard-stopped (`max-correction-loops-reached:blockout:3/3`).
Reference: `reference.jpg` (CC0 low-poly bridge, 360 px, used for shape only).

## Outcome in one sentence
Once I patched the generated code by hand, the skill gave a clay bridge that clearly reads as a bridge from the reference angle. Without that patch the generator gives "pebbles": it has no way to make a rounded block. Only the first of 8 build passes ran, and Tier-1 still fails.

## What the skill did, stage by stage
| Stage | Tool / doc | Result |
|---|---|---|
| State gate | `forge/state.py init`, `forge/next.py` (run before every step) | Worked well. It gave a clear next command, kept the loop counter, and enforced the hard stop at 3/3. |
| Image analysis | `grimoire/intake/image_analysis.md` | Manual 8-layer write-up → `01_image_analysis.md` |
| Suitability | `validation_rubric.md` | CONDITIONAL (single view; KFB re-style) → `02_suitability.md` |
| Admission | `check_reference_admission.py` | ADMITTED → `admission.json` |
| Local spec search | `new_pre_spec_assessment.py --spec-query …` (BM25 over `core_3d`) | Weak. The corpus has no masonry, arch, voussoir or bridge knowledge; it returned only generic "bevel radius in relative units" snippets. |
| Pre-spec assessment + quality contract | same script, then filled by hand | Complex tier. KFB constraints written into `definitionOfDone` and 5 feature groups → `assessment.json` |
| Detail inventory | `build_detail_inventory.py --mode grid-3x3` | The script only cuts 9 crops. I wrote all 12 details by hand → `di.json` |
| Projection route | — | Skipped with a reason: KFB palette, not a reference skin |
| Material evidence | `extract_pbr_evidence.py` on the abutment crop | Ran; warned "low value range". Reference maps deliberately not used. Wiring skipped with a reason. |
| Spec | `new_sculpt_spec.py` gave a 1-component starter | The real spec (258 → 254 components) came from my own script `author_spec.py`. The skill does not lay out geometry; the agent does. |
| Strict validation | `validate_sculpt_spec.py --strict-quality` | Failed 5 rounds before passing: textureless format, colorMaterialRecipe on every component, ≥8 meso components, detail→feature mapping, unknowns must be empty, and lighting text that must contain the *keywords* "contact shadow" and "tone/exposure". Mostly paperwork; none of it improved the geometry. → `strict-validation.txt` |
| Factory generation | `generate_threejs_factory.py --pass-id blockout` | Worked once all component ids were put in the blockout pass. Output: **2.5 MB TypeScript** for 254 boxes. |
| Render | Vite page `public/img2threejs-test/bridge01/index.html` → `src/view.ts`, browser pane, PNGs POSTed to a local receiver | OK |
| Tier-1 | `diagnose_render.py` | Run on every iteration (results below) |
| Comparison sheet / review | `make_comparison_sheet.py`, `append_review.py` | 4 review entries in `reviewHistory` |
| Multi-angle | `diagnose_render_multi_angle.py` | PASS: no degenerate view |
| Turntable | `turntable_gate.py` | FAIL as designed: the arch opening counts as a "through-hole". PASS with `--allow-holes`. |
| Part coverage | `check_part_coverage.py` | 0 errors when keyed by component id. 10 errors when keyed by mesh name, because the generator names meshes by `component.name` and I reused names like "voussoir". |

## Iterations
1. **refine-spec**: Every part rendered at 1×1×1 (`renders/blockout_ref.png`). Cause: the starter spec puts `transform.scale=[1,1,1]` on each component, and the generator lets that override `dimensions`. Tier-1 IoU 0.021.
2. **refine-spec**: The bridge was readable (IoU 0.71) but too long, and the deck-fill boxes stuck out at the ends. Fixes: abutments 9 → 6 u, deck fill inset, voussoir depth 3.0 → 3.4. The reference camera was also adjusted in the viewer.
3. **refine-code**: Every block was an ellipsoid "pebble". The generator ignores `edgeTreatment.bevelRadius` and runs Catmull-Clark on a hard-coded 1-segment `BoxGeometry`. I added the post-process `refine_code_rounded_blocks.py`, which swaps in `RoundedBoxGeometry(w,h,d,4, 0.28·min)` for 238 boxes. This patch is **not expressible in the spec**: if the factory is regenerated, the script must be run again.

## Gate results (final render `renders/final_ref.png`)
- Tier-1: **FAIL**. IoU 0.800 (needs 0.85), aspect delta 0.0002 (OK), scale delta 0.278 (needs 0.08). The thresholds are tuned for matching a photo pixel-for-pixel. The KFB scale contract changes proportions on purpose, so this gate cannot really pass here.
- Multi-angle: PASS.
- Turntable: PASS only with `--allow-holes` (the arch opening is intended).
- Part coverage (by id): PASS, 0 errors, 12 warnings.
- AI-vision (my score): **0.62**. Silhouette 0.7, structure 0.7, form 0.6, material 0.8.
- Mandatory steps not done: structural through optimization passes (7 of 8), emission target, action-ready. The state is `stopped`.

## Deliverables
- Spec: `object-sculpt-spec.json`, including `reviewHistory`. Authoring scripts: `author_spec.py`, `author_assessment.py`, `author_detail_inventory.py`.
- Factory: `src/createKfbCartoonStoneArchBridgeModel.ts` (generated, then patched by `refine_code_rounded_blocks.py`). Viewer: `src/view.ts`.
- Comparison sheet: `COMPARISON_final_ref_vs_render.png`. Extra views: `VIEW_final_3q.png`, `VIEW_final_below.png`. Turntable: `renders/final_{front,right,rear,left}.png`.
- Test page: http://localhost:5192/img2threejs-test/bridge01/index.html?view=ref (also `34`, `below`, `front`, `right`, `rear`, `left`, `top`). Note: the URL with a trailing `/` and no `index.html` gets the Lab app instead.

## Honest verdict
- **Would it beat a human-made asset? No.** A modeller in Blender with a bevel modifier and wedge voussoirs would do clearly better in about 30 minutes. In the 3/4 view (`VIEW_final_3q.png`) the voussoir ring looks loose, like rubble: rounded boxes leave V-gaps at the outer curve of the arch, and spandrel blocks cut into the ring. The arch opening also takes up less of the frame than in the reference.
- **Would it beat our previous hand-computed attempts? Not by itself.** I did not open the earlier attempts, so this is not a side-by-side check. All the useful geometry decisions (segmental arch maths, radial voussoir placement, running-bond spandrel clipping, camber) were hand-computed by me in `author_spec.py`, exactly like before. The skill added process scaffolding, not modelling know-how. The single biggest visual gain (rounded blocks) came from a code patch outside the skill.
- **What the skill is good at:** forcing a structured analysis and quality contract, a resumable checklist, honest loop limits, and deterministic gates. Tier-1 rightly caught iteration 1; multi-angle and part-coverage are useful sanity checks. It also leaves a clean action-ready hierarchy: 254 named pivots, plus colliders and destruction groups in `userData.sculptRuntime`.
- **What failed or is missing for this use case:**
  - No primitive for a rounded or filleted box; `bevelRadius` is ignored.
  - No wedge or voussoir primitive.
  - Repetition systems only do evenly spaced 360° radial instancing (no partial arc, no per-instance tone), so every stone has to be its own component.
  - A new material is created per subdivided component.
  - 2.5 MB of TypeScript.
  - 234k triangles with RoundedBox seg 4. That is too heavy for a game prop; seg 2 would land near 60k.
  - Keyword-matching strict gates.
  - The local spec corpus knows nothing about architecture or masonry.
  - The forge scripts break under `python -I`. Sibling imports need a wrapper that adds the script dir to `sys.path`.
- **Recommendation:** Do not adopt it as the bridge production route. If we keep it, use it only for the structure: the checklist, contract and gates. The geometry should come from a dedicated KFB masonry kit (rounded-block + wedge-voussoir builders), from Blender, or from our own procedural builder. A useful next step would be wiring the KFB masonry kit in as a domain plugin or adapter.
