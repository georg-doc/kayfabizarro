# KFB Clay HUD Production SOP · R1 · 2026-11-04
Owner: WSA HUD authoring, commissioned by WS0. Receiving runtime: georg-doc/KFB-Stunt-Car-Race, module/hud-clay-r1. Authoring branch: design/kfb-clay-hud-skin-kit-r1-2026-11-04, PR #468. No second runtime, no layout movement, no automatic merge or publication.

## Read and inspect
Read current skills/chat/START_HERE.md, CHAT_GITHUB_KFB_STAGE_WORKFLOW.md, FRESH_CHAT_SLICE_PROTOCOL.md, docs/hud-kit/RETURN.md and HUD_SKIN_SPEC.md in this branch. Runtime HUD_SKIN_SPEC.md, HUD_COVERAGE_R1.md/.json and HUD_LAYOUT_R2.md control geometry, coverage and layout. Method donor: sibling WS0_BLACK_INK_BLOB_SERIES/SOP_INK_MONSTERS_R2.md; its monster anatomy and stopped monster batch do not govern HUD imagery.
User commission supersedes old Hazard-first queue: FIRST one Retro Sheet1 pilot; only then remaining skins and sheets. Keep actual donor pixels, SHA256 and input roles. Open donor in isolation; filenames/URLs alone are not conditioning. Rejected outputs never become style parents.

## Closed delivery roster and sequence
1. Sheet1 per Retro, Steam, Teal, Reactor Blue, Slime Green, Hazard v2.
2. Sheet2 painted in each skin, not merely neutral v6 recolors.
3. Sheet3 travel strips per skin.
4. Neutral master once: bar_1..bar_8 at 288px high, minimap compass lid open/closed.
Pause uses Settings; portal transition hides HUD. Neither needs new artwork.
No generic panels, toggles, sliders, tabs, plaques or replacement typography per skin. Counts, labels, maps and telemetry remain code-owned.

## Sheet1 exact contract
2048x2048 native RGBA. Outer clear alpha margin >=32. Band allocations: closed y32..462 (430 high), open y494..1059 (565), lower y1091..2016 (925). Gaps >=32 including antialiased pixels. Both header strips width:height 9:1; open state adds empty drawer. Six empty round cells, one wide empty number field, signature head/endcap. Never put values or Fluff balls in wells.
Lower left freestanding closed-contour radio <=861 high, four empty square sockets, three lamps and theme grille/electric detail. Radio stays left in game; code neutral panel opens right. Lower right: gear normal/hover, arrow, 3–5 theme details. No cut-off dish, antenna or hinge.

## Sheet2 exact contract
2048x2048, four rows/four columns, 512px cells; every glyph within its own cell with >=32px padding, actual alpha. Row1 fist, grenade, jump boot, interact hand with key I. Row2 same four pressed. Row3 backpack, carrot, play-card, boost lightning. Row4 exit vehicle, land, two skin-signature details. User's I is the sole explicit text exception; no Bangers capitals. Paint skin-specific tactile shapes. Attach accepted Sheet1 as family reference; do not propagate rejected candidates.

## Sheet3 contract
2048x2048, proposed inner 2 columns x3 rows of 992x640, outer32 and intercell32. Six cells: upper terminal, lower terminal, plain stretchable middle, empty zone-band housing, altitude tube/cap, fuel tube/cap. No baked scale, speed or colored telemetry. Preserve motif features as fixed overlays; stretch only plain straight middle. Proposal must be reconciled with Kartenkante cutter before claiming automatic extraction. Artwork does not authorize changing HUD_LAYOUT_R2.

## Master contract
Neutral dark brown rim (93,77,65), beige fill (213,196,169), gold (251,196,69). Use actual existing donor geometry. Slot bars double source height (288); minimap open/closed in two1024 cells. Never pretend enlarged low-resolution pixels are newly resolved Retina artwork. Minimap placement stays receiving-owner work.

## Generation and QA
Use actual image generator, one pilot job at a time, original reference pixels attached as STYLE_REFERENCE. Matte modeled plasticine, restrained fingerprints, light upper left, clean consistent contours, empty recesses, no floor/drop-shadow/background/checkerboard. Preserve tool receipt and exact arguments; no invented model/seed IDs.
Record original decoded dimensions, mode, SHA256, byte count and alpha histogram; test all border and band gaps, component separation and full silhouettes. Never silently upscale a wrong-size output and certify native2048. Run existing runtime cut-sheet1.py and hudbar_measure.py when accessible. Components and per-skin9-slice coordinates must be measured, never copied from placeholder manifests.
Inspect each part at source and48/64px on light/dark; compare donor/candidate and closed/open. Technical pass, independent critique, Georg design verdict, Dropbox archival and game integration remain separate. Builder never self-certifies final acceptance.
Two non-improving repairs: retain original failed images/prompts/QA, quarantine smallest failing seam, stop that image strategy; continue useful SOP/coverage/handoff work. Do not spend remaining skin jobs on visible drift.

## Persistence and Return
At coherent implementation, material evidence and final Return boundaries persist recoverable state. Keep SOP next to Ink-Monster owner folder; authoring docs remain docs/hud-kit. After every GitHub write fetch exact branch head and intended file. Timeout=UNKNOWN, inspect before retry.
Archive lossless originals, donor identity, prompts, QA, manifest, crops and quarantined failures into a NEW MixedBag in Dropbox KFB Claymation Reference; never overwrite earlier MixedBags. Verify remote saved files, do not equate local copy with completed upload.
Return exact repo/branch/PR/head, files, actual tests, Dropbox location, unresolved items and one next gate to WS0. No Stage/Site needed for this asset-only delivery. No Hub churn or Live promotion.
