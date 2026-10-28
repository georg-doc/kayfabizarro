# KFB Action Bar R5 · modular six-slot PNG design candidate · 2026-10-28

**Status:** ART RENDERED / PACKAGE QA CHECKED IN CHAT · **BINARIES NOT IMPORTED INTO GITHUB OR RUNTIME** · no Stage / Live / merge.

## Product
Based on Georg's uploaded HUD tile reference: six-position action bar with original clay/rounded-slot visual family, no numbers. Deliver both complete variant bars **and** blank six-slot rails + modular single tiles. This is only design preparation for the **existing HUD owner**; not a second runtime, bar or inventory writer.

## Actual downloaded package
Chat attachment: `KFB_ActionBar_R5_Modular_PNG.zip`
- SHA256: `6aed1a59baaa50d8b231c98951ceddc455ecb99cd0714966f254ec2d205b70b6`
- 10,190,355 bytes; **193/193 ZIP entries verified**.
- **73 individual master RGBA PNG assets**:
  - 6 action bars with states (idle, selected, cooldown, locked, ready, warning);
  - 6 additional populated bar variants;
  - 4 **empty 6-slot background rails**;
  - 57 individual modular slot/tile variations including blank, stitched, gold, beige, locked, warning, selected, cooldown and populated reference examples.
- **114 extra downscaled** transparent slot PNGs (64 px and 128 px).
- Two source-art PNG sheets, machine-readable manifest JSON, README, two labeled checkerboard **review images**. Gameplay PNGs themselves have no labels or number overlays.

## Checks and limits
- All 73 master objects are RGBA PNG with transparent background pixels and opaque object pixels: **73/73 PASS**.
- ZIP archive CRC: **193/193 PASS**.
- Manual checkerboard review caught two touching/overlapping optional `buggy` / `walk` variant crops; quarantined/removed from final package. Source sheets are retained for provenance.
- All items derive from newly generated 2D renders based on Georg's supplied reference. They are **NOT** verified original 3D donor models; not scalable beyond source resolution.
- Bar variant render is baked; dynamic runtime uses empty rails and modular tiles. Animated hover, effects, cooldown semantics, actual target hit areas, safe-area layout and 48px HUD legibility are not runtime-verified.
- No screenshots from deployed product, no public Stage URL.

## Owner and next gate
- **Owner:** existing KFB HUD/WS0 design asset lane, `design/kfb-hud-icons-public-r1`.
- **Next gate (one):** import the package's actual binary sprites into the receiving HUD asset owner and inspect one empty 6-slot bar composited with 6 individual slots at actual 48–64px HUD size on the real game background. Georg then KEEP/TUNE before WS1 integration.

No central router/Hub or Stage change is justified by this isolated design export.
