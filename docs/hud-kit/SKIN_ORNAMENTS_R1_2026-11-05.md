# KFB Clay HUD · Signature Ornament Sheets R1 · 2026-11-05

Status: **SOURCE-ISOLATED DESIGN CANDIDATES** · not a runtime skin or human PASS.
Owner: existing KFB ToolBox / WS0 visual authoring. Receiver: KFB-Stunt-Car-Race / Kartenkante, branch `module/hud-clay-r1`. Same project PR #468. Do not change game state, palette routing, AudioContext, map or HUD runtime.

## Output contract
Three separately exported source-preserving PNG sprite sheets, each containing **only one theme** and real zero-alpha transparent background. Asset family: tiny standalone trim pieces, pipes, couplings, corner caps, screws, LED/grille variants, pulsed energy motifs and UI feedback FX. Nothing is part of an action slot or a neutral master-frame. Keep source geometry/native dimensions; do not stretch individual ornaments as 9-slice centers.

| Skin | Sheet (conversation ZIP, NOT GitHub binary) | Native size | Separate ornaments | Sheet SHA256 |
|---|---|---|---:|---|
| Reactor Blue | `reactor_blue_ornaments_RGBA.png` | 1024×1024 RGBA | 33 | `2a22a92783c0e6d57853e5385362f807dbe65a98fc59fc37f309145dec370978` |
| Slime Green | `slime_green_ornaments_RGBA.png` | 1024×1152 RGBA | 39 | `89afc7e9b8289be556f135c14b741d682dd5425de4a2c5a798fd35908403e292` |
| Hazard Yellow | `hazard_yellow_ornaments_RGBA.png` | 1024×1152 RGBA | 35 | `b59d79e065a97c187c08739e8ad918f54979e7870e1dbd8471f00a7de62e2352` |

Download package in originating ChatGPT conversation: `KFB_HUD_Skin_Ornaments_R1.zip`, 4,894,389 bytes, SHA256 `667f8fe37f49453d53edddab91d440d694ba47444dadc6eb82d08b59b8d6fcf5`. Package includes all three sheets, **107 native single-ornament PNGs**, `manifest.json` with per-object crop boxes and hashes, and three QA-only checkerboard JPGs. No binaries uploaded to GitHub in this slice. Fresh executor must receive original ZIP; a file path/URL string alone is not a donor.

## Production/QC facts
The generator was instructed to render independent single-theme sheets but twice mixed all three themes into one output. Both mixed outputs are **not accepted as three complete independent image jobs**. The second generated source is RGBA with actual zero-alpha background; separated its 107 alpha-connected motifs by group/centroid and repacked them **without scaling/recoloring/editing**, including one Slime motif crossing an original 512px theme boundary. Only per-motif pixels survived into the three outputs; backdrop and unwanted halos were masked out.
- 3/3 final sheets RGBA with alpha-zero background; outer 32px border fully empty and all 4 corners alpha=0.
- 107/107 detected source motifs assigned and saved individually (33/39/35).
- Repacked with 35px nominal gaps; overlap and minimum outer-boundary checks PASSED for the generated sheet rectangles.
- Human review of every tiny cut edge/48px readability and game-scale in-place behavior **NOT TESTED**. Do not claim source art Golden or device feedback PASS from geometric alpha tests.
- Effects such as cyan pulses, organic slime, hazard sparks are STATIC source sprites. Animating their visibility/blinking/scale/particle state is a future **existing HUD owner** task; do not add a second owner.
- Critical semantic guard: radio device-only speaker/antenna motifs must not appear on neutral action surfaces or headers; ornaments stay optional, anchored to compatible signature regions rather than being mandatory chrome.

## Next gate
**Georg's current Retro R16 whole-design visual decision in the owning Return remains the controlling design gate.** These three ornamental donor candidates can be inspected and archived independently but must not be auto-integrated or promoted as accepted new skins. When a receiving-owner skin is authorized, show a selected ornament in isolation at 48/64px and then on an actual panel/corner with fixed-size anchoring. No merge, Stage, Site or Live promotion.
