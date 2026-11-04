# CURRENT WSA HUD PILOT · 2026-11-04

User commission supersedes earlier Hazard-first routing below: one Retro Sheet1 first; then six complete skin families and neutral master. SOP: media/2D_Assets/KFB_Custom/WS0_CLAY_HUD_SERIES/SOP_CLAY_HUD_R1.md, implementation checkpoint a45299f1295069a758fac0bbf56524153f330e28 (file and branch verified).

Two original-reference image_gen jobs produced native1254x1254 RGBA, not2048; both fail32px clear border. 0/2 structural passes. Attempt1 SHA256 18f449362fd8a774386d0c204fb8230e68d793065217a5c9b9f6f796e5150c3a; attempt2 d869f2cee7ba17abdc10a805c0578afe67eeab1eb7966a4ce071b241e1647be1. Actual donor2172x724 SHA256 8cb414aca1907fb0fe347d2173f068f60192071be61c0b397645440a1a9da7a4; differs from old ledger donor. Actual pixels inspected and attached. No upscale or fake Retina acceptance. Attempt2 also incorrectly paints a drawer under closed header and gold hover gear. Failed outputs quarantined, not style parents.

MixedBag archive: /CLAUDE/KFB Claymation Reference/KFB_MixedBag_HUD_Retro_Pilot_R1_2026-11-04.zip (upload status must be checked separately before claiming saved). Contains two originals, SOURCE.json, QA.json, audit.py, prompt summaries and Return. Full exact tool prompts retained in originating chat. Independent critic and runtime cutter NOT_RUN. GAME_DEV_CLI_UNAVAILABLE; direct byte/dimension/alpha/border checks used.

Pending: valid Retro pilot; other five Sheet1; all Sheet2/Sheet3; neutral master. No runtime, merge, Stage/Site or Live change. One next gate: resolve native2048 image-output seam and produce compliant original-reference Retro Sheet1 before more skins. Two non-improving jobs freeze this image strategy; documentation and failure preservation completed.

---

# KFB Modular Clay HUD Skin Kit · RETURN R1 + skin-wave checkpoint · 2026-11-04
Owner: existing WS0 / KFB ToolBox design-authoring lane. Receiving HUD Runtimes retain existing owners.
Repository: georg-doc/kayfabizarro
Review branch: design/kfb-clay-hud-skin-kit-r1-2026-11-04
Branch created from main 7e1c4ab0f143b2f1c0f33017eb473574f20190c9. Inspect branch ref for latest verified head after this Return; no merge, no public publication.
## CURRENT RESET GATE · 2026-11-04 · Hazard source-only geometry
User supplied an illustrated Hazard 9-slice / 3-slice geometry briefing containing lower-row colored other-skin samples. Do NOT send that unmasked multi-skin sheet as a style donor. Active image-generation input must be accepted Hazard source panel plus CROPPED top-row-only geometry only; all prior mixed-theme outputs excluded. A fresh image-gen attempt again generated wrong scope/dimensions and was rejected, SHA256 `c46ee85720350147a76dcee94910263f3268602202eb40b0978810ff2a5b8a74`; file is RGBA 1536x1024, not a proper 2048 Sheet1.
Original donor (259x400) has been pixel-identically reconstructed from nine transparent slices. The new 2048x2048 hazard-only transparent source atlas sha256 `b32599cbf0ebcc6eabc49e3dcd628a04ebfd4b650cae4e2a9931a908dd87d05b` is contained with source images and geometry-only crop in conversation ZIP `KFB_Hazard_Modular_Donor_Reset_R1.zip` (NOT GitHub binary). Protected stripe middle is still TUNE for responsive width, radio bottom border needs visual crop review. This is NOT new WS0 Sheet1 pass. The exact next fresh prompt is in `FRESH_HAZARD_ONLY_IMAGE_JOB.md`. No game integration.

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