# WS0 → WSA · Two slices from Georg's spare volume (18.10.2026 · V-501, V-502)

Georg has volume left with you (ChatGPT). WS0 and the Blender Mac are at 75 % of their budget. Please take on these two slices: each with a GitHub branch, a return as Markdown and evidence. No merges; Georg merges.

## Slice A · Speech bubbles + comic words as an SSOT module (V-501)
Georg: "speech-bubble style, comic words etc. as an SSOT module too – we've worked all of that out already."
**The ready-made pieces (do not re-invent anything):**
- `chatterbox-core.js` (cbs-core v0.1, 2026-10-04): shapes (roundRectPath, shout/crown, think tail), clayFront, KINDS/LIMITS/TIME, layout, comic words (comicWord, WORD classes impact/reaction/movement/reward).
  - Copies: `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/lib/chatterbox/chatterbox-core.js` (main) and Dropbox `KFB Wireface Stage R2/vendor/chatterbox/chatterbox-core.js`.
- Host adapter `KFB Wireface Stage R2/modules/bubbles.module.js` (DOM layer over the canvas, anchor = projected head, reveal/stagger).
- SVG defs (kfbFaceShade, kfbWallShade, kfbSoftShadow, kfbCornerMask, dot patterns): from `replies/lab-donors/islands-npc.ts` line 73 and the ChatterBox Studio v2.
- Fonts: **Shantell Sans** (body, Google Fonts OFL), Bangers / Irish Grover (shout/word).
**Task:**
1. Build ONE package `kfb-bubbles.v1` (ES module plus a classic-script variant) containing core, defs injection, fonts loader and the host adapter. API stays as in the core (`window.KFB_CB` compatible).
2. Byte comparison against both copies. Where they differ, report the difference and take the newer source; don't change anything by eye.
3. **Fluff-o-lect hook (V-500):** the bubble text can be rendered per word in three stages: glyph / fluff word / plain text.
   - The reference implementation is in WS0's probe `KFB_HUB/40_AUDIO/kfb_language_r1/probe_r6.html` (functions stageOf, fluffify, glyph).
   - Glyph font is only a parameter for now. **R7 rule:** each glyph run is about 1.6 em and as wide as the word it replaces (measured in the bubble font, justified; the glyph count grows with word length; punctuation stays attached) — see probe_r7.html fitGlyphs. **Binding rule R9 (V-506, replaces R7/R8):** fluff stage = fixed Smurf lexicon by part of speech (fluff, fluffs, fluffed, fluffing, fluffy, fluffily, fluffery) — never padded or invented; glyphs 1–3 per word by word length, scaled (not multiplied) to the hidden word's width; ink #1f1a14 on the PAPER bubble colour; flow words stay plain. Reference probe_r9.html (fluffify, fitCoded, FLOW). PottyMouth BB is not licensed for the game, so build a placeholder glyph set for now.
4. A demo page with all KINDS + comic words + the three decode stages.
5. A README with "how to use this in the game, the tools and the Hub".
Branch `wsa/kfb-bubbles-ssot-r1-<date>`, return `WSA_KFB_BUBBLES_SSOT_R1_RETURN.md`.

## Slice B · Banter set for the C.O.M.I.C. ship diorama (V-475, V-482)
- Lady Dory and Lord Hunky in daily life aboard ship:
  - she ex-socialite, wants to go to the Academy court;
  - he a self-proclaimed misunderstood genius and overstretched janitor at the edge of the galaxy;
  - a marriage in tolerant stasis for thousands of years.
- 12 rounds of three moves (Dory jabs → Hunky justifies himself → punch).
- **Each move is a card-based triplet** following `TRIPLET_SET_SPEC_R2.md` (only the card's words, one card per line), through the alien lens.
- Cards from 2–3 decks of your choice (state which); the card also gives the dish's name (Dory cooks) or Hunky's report.
- Gate: `replies/triplet_set_check.py` exit 0; a blind critic as in your plugin.
- Spec context: `replies/SPEC_HD_SHIP_DIORAMA_R1.md` §1, §4.
Branch `wsa/comic-banter-r1-<date>`, return `WSA_COMIC_BANTER_R1_RETURN.md`.
