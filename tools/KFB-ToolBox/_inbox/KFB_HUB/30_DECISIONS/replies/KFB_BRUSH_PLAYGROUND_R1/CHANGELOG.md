# KFB Brush Playground R1 · changelog (additive, newest first)

## 2026-10-21 · R1.5 · local CRAYONIC editor tested (Claude Code)
- Editor rebuilt on the R1.4 candidate: in-browser `Brush.archive` decode, luminance → alpha stamp (CRAYONIC shape has no alpha channel), per-stroke brush/params/seed, uniform-glaze interpretation of glaze type 1, labelled substitute grain for missing Procreate built-in grains, eraser, undo checkpoints, PNG exports, comparison with each file's Procreate preview stroke.
- New DOM-free `brush-core.js`, vendored fflate 0.8.3 (MIT), Node unit suite (28/0) and Chromium suite with pen pressure/tilt via CDP (17/0).
- Fidelity documented, not claimed: CRAYONIC close in silhouette and tone, flatter texture; PASTEL too light; ACRYLOID not simulated.
- No public brush assets, no PR, merge, Site or deployment. Next gate: Georg's local CRAYONIC look check.

## 2026-10-21 · R1.0–R1.4 (earlier chats, summarised from RETURN.md)
- R1.0 product/Remotion plan; R1.1 `.brushset` + MegaPack source audit; R1.2 Notion catalog audit; R1.3 archive dynamics audit; R1.4 first unverified editor source candidate.
