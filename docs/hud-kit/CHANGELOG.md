# KFB HUD Kit · additive changelog
## 2026-11-04 · R1.1 WS0 runtime-spec reconciliation (docs only)
- Cross-checked KFB-Stunt-Car-Race@module/hud-clay-r1 HUD_SKIN_SPEC.md, HUD_LAYOUT_R2.md, hudbar_measure.py, cut-sheet1.py and master-kit.py.
- Corrected radio to LEFT screen edge with neutral Master-Kit panel opening RIGHT. No per-skin replacement drawer image required.
- Registered Steampunk Copper/Valve as its own authoring skin mapped to runtime `steam`; retained retro/teal and other candidate themes.
- Added `runtime_hudbar` measurement keys and `geometry.drawer_slice_insets_px`/`drawer_split_px` to manifest example with explicitly unmeasured placeholders.
- Pinned authoring body/cream/active -> runtime Rand/Füllung/Akzent semantics; rim/glow stay with painted signature assets.
- Preserved 430/565/925 Sheet 1 bands, Sheet 2 4x4 grid, NORMAL..HIDDEN states, mode actions and right-side tempo/altitude plans.
- No game runtime, Hub, Stage or merge change.

## 2026-11-04 · R1 new shared authoring contract
- New docs/hud-kit owner-facing standard: semantic HUD components, skin signature vs code-tinted primitives, WS0 2-sheet prompts.
- Cross-checked donor route Race design/claude-design-r3/hud_r1 and K7 Flight HUD; no new runtime owner.
- Added component coverage CSV, machine manifest example and 9 local asset SHA256 references.
- Geometry conflict in 2048px Sheet1 resolved with 430/565/925 zones plus 32px margins/gaps. Marked nominal 1220px radio as scale-to-fit.
- Structural PNG validator + 7 local fixtures passed. Manual style/clip acceptance still separate.
- User-rejected source failures retained in language: satellite R1 cropped and teal left-crop are NOT reusable donors. No binary assets committed.
- No public Stage or Hub changes: documentation-only source route; receiving products unchanged.
