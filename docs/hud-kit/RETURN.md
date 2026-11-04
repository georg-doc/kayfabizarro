# KFB Modular Clay HUD Skin Kit · RETURN R1 · 2026-11-04
Owner: existing WS0 / KFB ToolBox design-authoring lane. Receiving HUD Runtimes retain existing owners.
Repository: georg-doc/kayfabizarro
Review branch: design/kfb-clay-hud-skin-kit-r1-2026-11-04
Branch created from main 7e1c4ab0f143b2f1c0f33017eb473574f20190c9. Inspect branch ref for latest verified head after this Return; no merge, no public publication.
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