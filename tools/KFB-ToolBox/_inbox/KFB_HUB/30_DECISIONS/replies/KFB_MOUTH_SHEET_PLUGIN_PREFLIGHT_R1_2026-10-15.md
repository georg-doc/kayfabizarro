# KFB Mouth Sheet Maker · Research / Plugin Preflight R1
**2026-10-15 · bounded research and existing-owner handoff · NOT a second renderer, NOT an installed plugin.**
Repository `georg-doc/kayfabizarro`; branch `docs/kfb-decisions-register-2026-10-11`.
**Existing owners:** WS0 mouth-asset preparation and decisions, WSA Work **one ToolBox Mouth Lab** (V-249/V-263); WS1 consumes approved sprites/metadata through existing actor/mouth system. Future private ChatGPT plugin may act only as an **image-authoring front end**, never a second 3D/mouth runtime.
**User request:** repeated on-demand authoring of expressive handmade cartoon/clay mouths in different lip/teeth/tongue/color styles, coherent viseme shapes, transparent individually aligned PNGs and predictable character integration. Earlier generated series and the Aliens test provide promising visual/user feedback; **this audit does not independently rerun their animation tests**.

## 1. Binding SSOT FOUND (do not research a replacement standard)
- **V-255** in `DECISIONS.md`: **4×4, 16 fixed semantic slots**, generated one sheet, talk shapes first then 4 reactions, pure green `#00FF00` input, common upper-lip datum, capped 1.7× height, no frivolous tongue-out/lip-bite; variants by lip/teeth/color. ChatGPT plugin planned **later** under same spec.
- `replies/MOUTH_SHEET_SPEC_R1.md` Git blob `41b6b7f454711a60699843ed253bd5c33c325f85` documents exact order:

  | Row | 1 | 2 | 3 | 4 |
  | --- | --- | --- | --- | --- |
  | 1 | rest_closed | mbp | small_open | mid_open |
  | 2 | ah | ee | oh | oo |
  | 3 | fv | l_th | smile_closed | smile_open |
  | 4 | sad | surprised | grumpy | signature |

- **V-259** sets standard upperLift **0.35** (rather than R1's 0 / 0.15 test). **V-249** keeps the three canonical pre-existing KFB Decal families; generated sheets are alternative style families. **V-299**: Alien figures use prior R2 A/B source; a prior human preference for those styles does not approve every future set or mean old R2 arrangement replaces V-255.

## 2. Existing working production donors (and the exact format mismatch)
- `replies/MOUTHS_GPT_R1/_tools/cut_align.py`, blob `6b9a88c06ea1086ea7d509a18ab1f6c8d54822e7`, processes 12 **4×3** mouth components from two existing *alpha-backed* sheets, outputs 512×512 PNGs, `anchors.json`, alpha cleanup and optional height squash. **Not compliant with V-255 4×4 green sheet.**
- `replies/MOUTHS_GPT_R2/_tools/cut_align.py`, blob `32bf69403a4b411299d13318ce94fe79ce6ff69f`, processes A/B/C **4×3, 12 per family**; `CANVAS=(512,512)`, anchor `(256,220)`, `upperLift=0.35`, 1.7× limit for A/B, warm contact-shadow and no-shadow variants, trimmed PNGs, anchors JSON. It currently enumerates alpha-connected components and asserts **12**; it **does not parse** canonical fixed **16 equal cells**, and fully opaque chroma green would register as one large alpha component. C (line/sausage) required separate height treatment and was **TUNE** under V-259, not a canonical successful example.
- `replies/MOUTHS_GPT_R2/README.md`, blob `f92459643192217e516e68e08d5be57fa7d63268` records 1920×1080 individual/paired review images and 12 fps talk clips, and existing QA for mouth/source anchors, shadow, size. **Reuse its defringe, alignment, shadow/no-shadow, metadata, and review logic** instead of writing a second image processing backend.
- Current input-source practice: some old generated sheets already had alpha; binding new template requests chroma green; **source images must be audited per input**, not guessed from filename.

## 3. Target plugin scope / parameters (future PRIVATE plugin only)
**Name candidate:** KFB Mouth Sheet Maker. **Generation-only user experience:** “male cartoon, yellow narrow clay lip seam, big irregular block teeth, no protruding tongue, sardonic signature”, etc. User may pass character mouth/face crop *actually visible to the generator*, or choose a previously accepted mouth donor; if no source pixels, label `STYLE_ONLY`, never `SOURCE_LOCKED`.

**Input style recipe** (not a new runtime schema):
- `lipStyle`: narrow | medium | full | monster | sausage, chosen with actor fit (do not assume all are canonical);
- `lipColor`, `gumColor`, `interiorColor`, `tongueColor`, `toothColor`, `teeth`: none | even | block_irregular | gap | buck | pointed;
- `personality`: dry | sly | startled | grumpy | etc., influences asymmetry/one `signature` reaction, **not** geometry of talk visemes arbitrarily;
- `clayMaterial`: KFB matte handcrafted family with no photorealism, glossy highlights, outline/ink by default;
- `rigFit`: overall mouth width relative to source/accepted actor, optional head-space reference, `upperLift=0.35` default, matching V-259;
- `output`: `sheet.png` 4×4 source, 16 PNG RGBA canvases at identical 512×512 + `anchors.json`, source manifest/check sums, review frames/clip and optional packed atlas *derived from the same originals*.

**Generation contract:** equal 4×4 slots with exact semantic order; pure `#00FF00` background; no captions, labels, nose, face, chin or unrelated props; upper lip consistent, mouth opens down except bounded upperLift, same width except rounded OH/OO ≥0.6 width, height ≤1.7× closed. **A single image-model prompt is an attempt, not proof of correct 16 cells.** QA inspects actual pixels and fails on missing/duplicated/invented mouth or unreadable FV/L-TH/MBP.

**Output standardization:** renderer/tool step adapts the **existing R2 cutter** to strict cell-based 4×4 (not component ordering), per-cell foreground extraction (alpha OR chroma-key + spill/anti-edge guard), 16 semantic filenames, continuous upper-lip pivot, 512 PNG RGBA, anchors and colors, optional shadow/noshadow as **separate exports**, transparent outside pixels without red/green fringes. **Do not embed text or contact-shadow in the raw sheet**; derive soft contact shadows after masking. Keep original `sheet.png` immutable for reprocessing. Fail closed when any cell has no distinct mouth, lips spill into another cell, anchor unusable, tooth/tongue parts lost, or residual green/red edge contamination.

## 4. Visemes vs emotions, external benchmarks (not new KFB canon)
- **Rhubarb Lip Sync** official repository describes **6 core + 3 optional** 2D mouth shapes (`A–H, X`), including closures MBP, teeth, intermediate open, wide AH, rounded OH/OO, FV and L: https://github.com/DanielSWolf/rhubarb-lip-sync. Its 9 positions are reference for a compact cartoon mouth driver; **Rhubarb alpha-letter slots are not direct substitutes for KFB semantic filenames without an explicit mapping**.
- **Meta OVRLipSync** docs describe **15 visemes** (`sil, PP, FF, TH, DD, kk, CH, SS, nn, RR, aa, E, ih, oh, ou`): https://developers.meta.com/vr/documentation/native/audio-ovrlipsync-viseme-reference/. A denser reference if an audio-driven system is added, not justification to silently grow V-255 or create 15×emotions.
- The binding KFB target is **expressive talk timing** (V-247/249, no mandatory realtime phoneme lip-sync). Use the **first 12** talk/smile slots and last **4** reactions. Face emotion, eyebrows/eyes/head acting stay with current KFB native face owner. For future TTS, provide explicit mapping plus timing adapters; do not assume this static sheet is perfect phonemic sync.

## 5. Next concrete acceptance, no plugin activation yet
**One pilot:** use one deliberately distinctive mouth recipe (e.g., yellow lips + irregular block teeth) and author a **true 4×4 V-255 sheet**. Input: 16 slots; output: **16 verified aligned 512px transparent PNGs, one manifest/anchors.json**. Show exactly 16 separate large 1600px+ review views or pairs in Hub (V-253), and one 12fps/seek(t) talk clip with MBP, AH, EE, OH, OO, FV, L-TH, closed rest and a reaction on a real KFB actor. Inspect closed mouth, upper lip alignment, popping/jumps and fringes on light/dark/face backgrounds.
Only after **WS0 source/test proof and Georg's decision** may the owner package this as a PRIVATE ChatGPT skill/plugin (thin guided image-generation front end) that calls/exports through the **existing** cutter/ToolBox integration; never duplicate renderer/asset registry or auto-publish to Site/Live. A ChatGPT skill/plugin manifest alone is **not proof** that image generation, PNG segmentation and GitHub export can be invoked automatically; each operation requires an actual supported host tool and receipt.

**Result of this audit:** RESEARCH COMPLETE enough for a bounded R3 implementation; `MOUTH_SHEET_V255_4X4_PROCESSOR_ADAPTER` is the **single next gate**, not more open-ended research. No code, plugin, Site or runtime created in this note.
