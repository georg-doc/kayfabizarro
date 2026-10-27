# KFB Gameplay Icons R4 · transparent cutout return · 2026-10-27

Status: **CUTOUT PACKAGE CREATED IN CHAT · NOT YET IMPORTED TO GITHUB / GAME**.

## Source and authority
- Owning lane: existing `design/HUD_ICONS_PUBLIC_R1/`, branch `design/kfb-hud-icons-public-r1`.
- Input: Georg's uploaded 1536×1024 raster sheet headed `KFB GAMEPLAY ICONS R4`.
- This is a **design asset preparation** slice, not WS1 HUD/game runtime integration, a new owner, or Stage publication.
- The public HUD branch already contains `renders_r2/` as source-backed 512px transparent prop models. The new R4 cutouts are *visually different* 2D clay-style concept icons and do not replace those original donor renders.

## Delivered for download in the originating ChatGPT response
- Archive: `KFB_Gameplay_Icons_R4_Transparent_PNG.zip` (7,827,491 bytes).
- SHA-256: `0470526d3e91ce91e90ca16f48d047073185a4cbc1bb9d28a54f8fca09e9eba7`.
- **53 individual RGBA PNGs**: 42 distinct icons (core 6, travel 3, movement 3, dialog 7, tricks 6, fluff 6, radio 5, menu 6), plus 6 gun state examples and 5 gun size examples.
- Individual transparent exports: 256, 128, 64, 48, 32, 24 px; category/name file structure.
- Game-use atlases: `atlas_{256,64,48}.png` + corresponding UV/coordinate JSON.
- `manifest.json` and `contact_sheet_checkerboard.png` (latter is review only, labels are **not** part of gameplay sprites).
- ZIP inspection: **327 entries / 327 CRC-verified**; 53/53 master PNGs are 256×256 RGBA, have a fully transparent corner and contain transparent and opaque pixels.

## Visual inspection
- First pass exposed cross-contamination where neighbouring icons nearly touched (boot ↔ mode swap arrow; wing ↔ arrow/car; walk ↔ run), and an incomplete brown background disc on Menu/Interact.
- These were corrected by connected-object filtering, source crop constraints and circular disc repair.
- Checkerboard preview then checked for separate objects and missing text.
- The rendered concept sheet is flattened: dark shadows and fine edges can remain slightly imperfect, especially at 24–32px. A 256px canvas does **not** create 256px native art detail.

## Persistence limitation / next receiving step
This GitHub text records the completed asset-extraction result; **the binary ZIP and PNGs are currently delivered as ChatGPT sandbox attachments, not as GitHub files**, and no public game URL is claimed. A receiving asset importer must take the ZIP from this chat, preserve transparency, inspect the sprite atlas/manifest and commit the actual binaries to the owning HUD design/asset route before the game runtime can consume them.

**One next gate:** import the actual PNG/atlas package into the current HUD asset owner, check a 48px icon in the real HUD and record KEEP/TUNE. No merge or Live promotion without Georg.
