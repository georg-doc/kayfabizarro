# KFB Clay HUD · Action-Bar / Overlay signature candidate R1 · 2026-11-05
**Owner:** KFB ToolBox/WS0 design authoring in georg-doc/kayfabizarro PR #468. **Receiver:** Kartenkante / KFB-Stunt-Car-Race, module/hud-clay-r1. **Status:** ISOLATED DESIGN CANDIDATES · no human PASS, no game integration and no runtime writes.

## User-requested three candidate skins
The 2026-11-05 user asked for three style-specific action-button bars (4–6 blank cells plus a standalone blank button) and responsive overlay art for **Reactor Blue, Slime Green, Hazard Yellow**. This authorizes isolated art evaluation only; it does not change the **CURRENT Retro R16 whole-design HUMAN_DECISION gate** or import any new skins into the game.

## Actual asset export
A new 1536x1024 RGBA image-generation source combined all 3 themes unexpectedly. Two fresh jobs were attempted and both mixed themes; stop repeating that generation seam. The second source has genuine alpha=0 transparent background and separate pieces. The design candidate export was **pixel-isolated via source-alpha connected components** into three independent 1536x1024 RGBA sheets; there was no color-keyed fake alpha, no new invented UI branding. Since these parts derive from a mixed-theme source, treat all as **candidates** rather than claiming three accepted independent image-generation jobs.

| Skin | 4-slot | 5-slot | native 6-slot | isolated blank button | overlay formats |
|---|---|---|---|---|---|
| Reactor Blue | yes | yes | yes | yes | tall, wide, strip, narrow |
| Slime Green | yes | yes | yes | yes | tall, wide, strip, narrow |
| Hazard Yellow | yes | yes | **NO** | yes | tall, wide, strip, narrow |

Hazard has one unapproved `action_center_slot_repeat_CANDIDATE.png` for a dynamic 6th cell; inspect structural seams before adopting. Other row variants are unmodified thematic candidates.

## Saved delivery / provenance (NOT in public GitHub)
- Conversation ZIP: `KFB_Action_Overlay_Skin_Assets_R1.zip`; 5,813,870 bytes, SHA256 `b4aab06112209aefc0b06bec707a3f70d7d380758e11d75180ba98da462c5d8d`.
- Blue RGBA sheet: `reactor_blue_SHEET_RGBA.png`, 1536x1024, SHA256 `be9fb5a56e4a96427c6d10f96d908613954ee2a59b5cc5ec53e3270cb8248028`.
- Slime RGBA sheet: `slime_green_SHEET_RGBA.png`, SHA256 `3804e978a70bac50cfbf737a77e2630f218c966f1a04af64b246c6bf20b08182`.
- Yellow RGBA sheet: `hazard_yellow_SHEET_RGBA.png`, SHA256 `cac9bebe96dd2a43b09a0d69ccd5d64c2388940687fbbf891fa4710ca3be9e46`.
- Package includes a source manifest, separate transparent PNG elements, nine PNG slices per selected overlay, checkerboard **review-only** JPGs and QA_REPORT. **A GitHub file path alone does not establish art bytes**; any future executor needs this ZIP attached/materialized.

## Structural QA actually run
- Three output sheets checked at **1536×1024, RGBA, all 4 corner alpha values = 0**, with substantial alpha-zero background.
- All three selected overlay sources were reassembled from nine tiles **pixel-identically at source dimensions**; the tiles and inset metadata are present.
- Standalone blank buttons, 4-/5-slot strips and multiple overlay variants isolated per skin.
- Human artifact inspection performed for obvious overlaps/multi-skin drift in final rearranged sheets. This is not an independent visual critic verdict or 48px game proof.

## Strict limitation on responsiveness
**Do not stretch top-signature metal modules, cyan lights, hazard stripes, slime drips or bolts.** Pixel-identical reconstruction at original size does NOT establish enlarged 9-slice seam PASS. Correct receiving route is existing code-owned neutral Master-Kit responsive panel plus anchored signature art, with protected overlay detail geometry if skin-specific frames are used. No second runtime owner or generic UI replacement.

## Next gate
**Current receiving product:** Georg's existing Retro R16 whole-design review remains the human authority and is pending. **For these new asset candidates:** one source-isolated responsive overlay/render test at multiple sizes and manual acceptance before a new skin is registered or imported. Hazard 6th action socket also requires a full visual seam proof. No merge/Stage/Live.
