# KFB Modular Clay HUD Skin Kit · RETURN R1 + skin-wave checkpoint · 2026-11-04
Owner: existing WS0 / KFB ToolBox design-authoring lane. Receiving HUD Runtimes retain existing owners.
Repository: georg-doc/kayfabizarro
Review branch: design/kfb-clay-hud-skin-kit-r1-2026-11-04
Branch created from main 7e1c4ab0f143b2f1c0f33017eb473574f20190c9. Inspect branch ref for latest verified head after this Return; no merge, no public publication.
## CURRENT ADDITIVE WAVE · 2026-11-04 · Hazard → Blue → Slime
**Outcome:** A three-skin sequential authoring wave is recoverable on the same PR #468. It is NOT yet a completed new sheet or runtime skin. Hazard Yellow existing 9-slice panel was previously accepted visually; new Sheet1 + Sheet2 for Hazard, Blue and Slime still pending.
**Evidence:** Six existing R3 isolated donor PNGs are RGBA with alpha zero; three old panel images have clear image edges, all three minified bars contact at least one image boundary and need human crop review (Hazard alternate bar bottom 36 rows; Blue top 28; Slime top 27 / right 20). Two fresh Hazard Sheet1 generator jobs in THIS chat both produced mixed 3-theme 1536×1024 RGB outputs, NOT 2048×2048 true RGBA; **0/2 actual generated sheets PASS**. Outputs and donor source bytes preserved in user-downloadable ZIP; not committed to GitHub as binaries. Per two non-improving failures, freeze image generation seam and continue parent documentation/handoff. No material runtime or Hub route changed.
**Files added:** `HUD_SKIN_WAVE_2026-11-04.md`, `HUD_SKIN_WAVE_QUEUE.json`, `HUD_SKIN_WAVE_SOURCE_CHECK.json`, `RESUME_SKIN_WAVE.md`.
**One next gate:** A new isolated image job produces only **Hazard Yellow Sheet 1** at native 2048×2048 RGBA with exactly six Fluff cells and an uncut left-side four-slot Radio, reviewed against accepted source before Sheet2. Reactor Blue and Slime Green follow in that order.

## WS0 addendum · R1.1 · 2026-11-04 (doc-only, later PR-branch head)
Authoritative receiving runtime: `georg-doc/KFB-Stunt-Car-Race` branch `module/hud-clay-r1` at `7a3eec71dc6806bfbeb6ee1ab242868678cd8802`, `docs/hud-kit/HUD_SKIN_SPEC.md`. Radio is LEFT with Master-Kit drawer expanding RIGHT, not right-side/left-opening. Steampunk Copper is distinct runtime `steam` skin. Palette: authoring `body` -> runtime Rand, `cream` -> Füllung, `active` -> Akzent; `rim`/`glow` stay signature art. Example manifest now carries runtime_hudbar fields and drawer insets, with unmeasured placeholders. Existing 430/565/925, Sheet2 4x4, state and action contracts remain. Only docs touched, no runtime/merge/public route.
Latest head is read from branch ref at handoff; this markdown is not a frozen commit ID.

## Result
Persisted a reusable KFB Cartoon Clay HUD skin contract with WS0 fresh-image job prompts (signature parts only), normalized component inventory, PNG + 9-slice QA boundaries, optional right-edge speed/altitude, action slots 1–6, and manifest exchange example. No runtime code or UI replaced.
## Actual tests
7/7 local synthetic PNG validation checks PASS; 9/9 archived reference images checked for RGBA + fully transparent alpha presence; 34 verified icon filenames + 14 existing slot filenames from Race design/claude-design-r3. These do not imply aesthetic acceptance or integrated gameplay.
## Exact files (all new)
docs/hud-kit/README.md
docs/hud-kit/HUD_SKIN_SPEC.md
docs/hud-kit/WS0_IMAGE_JOBS.md
docs/hud-kit/HUD_COMPONENT_COVERAGE.csv
docs/hud-kit/SKIN_MANIFEST_EXAMPLE.json
docs/hud-kit/LOCAL_SOURCE_HASHES.csv
docs/hud-kit/validate_sheet.py
docs/hud-kit/test_validator.py
docs/hud-kit/TEST_REPORT.md
docs/hud-kit/CHANGELOG.md
docs/hud-kit/RETURN.md
## Donors
- Race branch design/claude-design-r3/hud_r1: exact icons, slots, occupancy, Almanac, Speech.
- KFB Clay SSOT work/clay-style-ssot-2026-10-01; Style Reference Router.
- User/image chat references (Retro Wood Fluffbar, Teal Tesla W/Cyan, Hazard Yellow, Satellite clean R2, Reactor Blue): SHA256 in LOCAL_SOURCE_HASHES.csv. Their binaries are NOT committed in GitHub, but archived in local conversation ZIP; do not claim otherwise.
## Unresolved
- First real reference-aligned 2048x2048 Sheet 1 still to generate/test; same for Sheet 2.
- Approved donor PNG binaries are not yet pinned in repo; SOURCE_REQUIRED for autonomous re-generation.
- Minified/expanded live game layout, radio sliding, 9-slice seam QA and animation/telemetry are future receiving-owner work.
- No image-generation plugin created; reusable prompt + validator script is the current minimal workflow.
- Source-limited check: previous WS0-mentioned docs/hud-kit/HUD_SKIN_SPEC.md was absent from repos checked, so this is R1 reconstructed from user-provided WS0 text.
## One next gate
Pin one accepted reference visual (prefer the user-supplied Retro Fluffbar) as source with hash and independently generate/inspect WS0 Sheet 1 at 2048px, including 48px readability and alpha/crop review. Sheet 2 follows only after Sheet1 visually matches. 
No public Stage, no merge or Live promotion.