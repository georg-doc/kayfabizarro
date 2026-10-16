# TEST REPORT · SpellSpill / KFB Alpha FX / Destruction Performance R1
Date: 2026-10-16. Mode: research-source recovery + benchmark contract, not game/FX integration.

## Actually checked
- Dropbox folder `SpellSpill VFX Study` shared-link metadata and complete list **9/9** PNG files (no more cursor), exact paths/IDs/content hashes pinned; `file_preview` returned nine items.
- GitHub recovered the actual Claude Design handoff `VFX + KEYS + ASSETS - kfb-asset-handoff-animation-lab (9).json` blob `55c2ad6cf37dc906381949f2c0e56cc2ff3888c4`; 132 consumer assets, 91 VFX candidates. This is not the complete registry.
- Actual GitHub directory listing: 93 real Brackeys `particles/alpha/` files, 14 `predrawn/` sheets, including five `muzzle_0X_a.png` with exact blob SHA in `SOURCE.json`.
- Read actual `kfb-vfx.js` / `VFX_DESIGN_v10.md`, the VFX-01 interactive review Return, and current POC `sw-destruct.js` / `sw-fx.js` / `sw-mech.js`.
- **25/25** contract/source/readback assertions against current GitHub `SOURCE.json`, `RESEARCH.md` and `EXISTING_ALPHA_MASK_ATLAS_CATALOG.md`:
  - validSchema: PASS
  - exactFolder: PASS
  - nineScreens: PASS
  - nineUnique: PASS
  - hashes64: PASS
  - sourceLink: PASS
  - threeTrueDonorPins: PASS
  - aoeAuthoritative: PASS
  - threeBenchVariants: PASS
  - threeBenchScenarios: PASS
  - historicalCompileCaution: PASS
  - overdrawIncluded: PASS
  - originalCatalogPinned: PASS
  - handoffCandidateCount: PASS
  - alphaFolderCount: PASS
  - fiveAlphaMasks: PASS
  - sourceAtlasDonor: PASS
  - twoDSpriteComparable: PASS
  - correctMuzzleTime: PASS
  - singleNextGate: PASS
  - noSourceCodeClaim: PASS
  - noProductSourceMutation: PASS
  - noStage: PASS
  - noMerge: PASS
  - screenshotDataNotVendored: PASS

## Not run / not passed
- `kfb-spellspill-reference-source-capture.yml` has been committed for temporary CI screenshot acquisition + hash/contact sheet. No workflow status is assumed here until GitHub Actions confirms it.
- No direct visual classification of individual screenshot pixels at this checkpoint; no confirmed original Reddit post/video/shader source. Dropbox screenshot folder is a user reference, not an asset license.
- No actual 3D-vs-2D-vs-hybrid GPU benchmark; no target-browser fps, no AOE block performance validation. Historical POC measurements (353 ms cold shader hitch, 584/584 peak, 150/256 debris, pumped iframe timing) are **prior evidence, not new tests**.
- 0 game/source runtime edits, no new physics or rendering owner, 0 source images copied into GitHub; 0 Site/Stage or Live promotion.

## Single next gate
**KFB SEED WORLD BLOCK-DESTRUCTION HYBRID FX SOURCE-ISOLATION + PERFORMANCE A/B**. First show real KFB source masks and real 3D clay donor in isolation; A/B/C one/four/whole-block cascade with p50/p95/p99 actual performance and visual readability. WB2 R4 remains STOPPED.


## Material source-evidence checkpoint · 2026-10-16 · CI PASS
- Real Dropbox ZIP source capture: GitHub Actions `38922347665`, **SUCCESS**; `9/9` actual screenshot PNG content hashes matched the connected Dropbox metadata. Source-download ZIP tested, safely unpacked; first run failed on ZIP absolute path, repaired only test unzip seam with safe Python zip extraction.
- Image dimensions approximately 914–960 × 1552–1602. Created contact sheet + result `manifest.json` in artifact [12054229885](https://github.com/georg-doc/kayfabizarro/actions/runs/38922347665/artifacts/12054229885), ZIP SHA256 `d175d3e3d4331c4823b24abe5f25247b4f61c08f99aed278ff73961e86bb38b8`.
- Exact original contact sheet 3×3 downloaded and **visually inspected**: parchment/isometric scene, glowing orange core, gray plumes, angular brown debris, cyan water/waterfall, cream vortex. Evidence detail: `VISUAL_SOURCE_PROOF.md`.
- **25/25** cross-file/source consistency checks remain, in addition to **9/9** source-image hash validations. This is **NOT** 34 rendered KFB effect tests. KFB 3D/2D/hybrid, original shader source, target GPU benchmarks and human acceptance remain NOT_RUN.
- GitHub original alpha files independently enumerated, source IDs captured in `EXISTING_ALPHA_MASK_ATLAS_CATALOG.md`: current 93 alpha PNG files, 14 predrawn sheets, 5 exact muzzle masks, 16 atlas roles. No new paint/brand.


## Actual complete source A/B/C browser milestone · 2026-10-16

**Source CI:** `38926541781` at `6c2214da5844b50fb9a1f952fd339040a332e2f9`, job `117059410671`, **SUCCESS, 50/50 technical assertions**, `14` screenshots and `12` per-scenario/per-variant rows. Artifact `12058220353` includes `results.json`, source-isolated real 3D and real 2D, 4-variant source-scene captures for single, four and block. SHA256 archive `412d691d9ed99c7b389c11d39444f2e35b3aef245ccc1e2a6e32622aedaffcd4`. Machine-readable summary `FX_AB_R1_FINAL_RESULT.json`.

**Observations:** single 8 cells lost/0 cascades; four 48 lost/0; block 12 rockets repeated over 4 actual neighboring buildings → **90 cells lost, 2 real support cascades, 178/256 debris, 195/200 smoke, 584/584 FX pool**. Fixed damage under four render variants.
Block render triangles: baseline 796,942; 3D 812,542; original 2D 797,722; hybrid 798,406. Smoke triangle contributions 15,600 / 780 / 1,464: 2D is 20× less smoke geometry, **NOT** 20× faster KFB. Block render CPU-submit p95 8.4 / 7.4 / 7.5 / 8.3ms, heavily confounded by the CI SwiftShader and rAF p95 around **1705–3674ms**; not true target-device GPU/FPS evidence and insufficient for ranking.
Renderer pixel signal from same frozen scene vs baseline: single 3D 2.147%, 2D 0.071%, hybrid 2.034%; four 12.67%, 0.833%, 1.031%; block **9.147%, 1.272%, 4.222%**. This proves visual presence, not readability/style.
Actual screenshot visual inspection: **TUNE** for all variants: original 3D source displayed 5× is oversized/smooth/off-white, 2D actual white-alpha masks 6.5× are too weak/low-contrast against sand-colored blocks, hybrid retains oversized white geometry. No accepted Clay K1/H0/K2 parity, no actual source motion performance, no dynamic frame-by-frame KFB gameplay stress, no measured browser on Georg's device.
**Previous failures retained** in `FX_AB_R1_EVIDENCE.md`: first run 39/39 technically green but visually invisible; second run 13/14 correctly rejected minimal 2D visibility; final pass is a **technical proof only**, not an artistic or target FPS PASS.
Next one gate: `KFB SEED WORLD SATURATED HYBRID FX VISUAL BUDGET + TARGET-GPU REVIEW`.


## Recovery and R2 capped hybrid source proof · 2026-10-16
- Timeout recovery verified open Draft PR #406 and previous 50/50 source CI: `RECOVERY_2026-10-16_TIMEOUT_CHECK.md`; no data lost, main unmodified.
- Real tested capped original-source hybrid CI [38945532821](https://github.com/georg-doc/kayfabizarro/actions/runs/38945532821) at revision `e847450a567c0e08d3842053a934d61b7b1c063a`: **16/16 assertions PASS, 3 actual screenshots, 3 measurement rows**; [artifact 12066121184](https://github.com/georg-doc/kayfabizarro/actions/runs/38945532821/artifacts/12066121184), ZIP SHA-256 `1370cebfbb31ee887e72a1e77183eb02585b140b4409b50809582ed4e3fefb41`.
- Original source damage invariant under NONE/C/D: 12 rockets, 90 cell losses, 2 cascades, 178/256 debris, source smoke 195/200, VFX 584/584. No new damage writer.
- Hybrid C: 9 3D + 186 original Brackeys mask 2D; 1,464 smoke triangles, 4.222% changed pixels. Budget D: 3 3D + 11 2D (cap 3+28, screen tile 110px) = 284 smoke triangles, 0.415% changed pixels; **81% less smoke-specific geometry**, but virtually unchanged massive scene geometry and 145 draw calls each.
- **Technical budget PASS only.** Screenshots opened: D removes original C giant white sphere but also removes nearly all desired visible smoke. Human Clay/style PASS = **NO**, actual GPU performance = **NOT_RUN**, software-renderer frame timing not suitable for target FPS claim.
- Full evidence and next gate: `FX_BUDGET_R2_EVIDENCE_2026-10-16.md` and source metadata `SOURCE.json.fxBudgetR2`. Prior R1 50/50 unchanged. Do not re-test the whole R1 matrix for doc-only updates.
