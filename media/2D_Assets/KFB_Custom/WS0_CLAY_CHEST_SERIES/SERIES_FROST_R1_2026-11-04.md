# WS0 · Frost & Frozen Wonders Clay Chests · R1

Date 2026-11-04 · Owner WS0 · **VISUAL CANDIDATE / GEORG REVIEW PENDING** · built with the documented WS0 style/prompt rules (`README.md`, `PROMPT_SYSTEM.md`, `EXPORT_QA.md`). This new Frost R1 is NOT a human PASS yet.

## Product

One thematic 12-character collection, presented in **2 × 3-by-2 sheets** and 12 **512×512 transparent RGBA** cutouts. Source artworks were from **two generated twelve-object 6×2 contact sheets**, then curated/reflowed into the requested **two 3×2 output sheets**; do not claim that these exact 3×2 layouts were generated in native 6-object jobs. No foreground motifs were replaced by a generic stock illustration.

| Slot | Character name | Source motif |
|---:|---|---|
| 01 | Frost King | glacier crown, icicle beard, heavy brows |
| 02 | Snowman Dandy | stovepipe hat, carrot, scarf |
| 03 | Igloo Lantern | hot golden windows, icy masonry, hanging lamp |
| 04 | Polar Bear | bear-pelt hood, paws, icicles |
| 05 | Frozen Sundae | pastel ice cream and cherry topping |
| 06 | Ice Castle | blue frozen castle with tiny warm windows |
| 07 | Polar Explorer | fur hood, binoculars, pick and rope |
| 08 | Ice Pirate Ship | frozen boat, red-white sail, ship wheel |
| 09 | Glacier Cave | deep violet crystalline cavern |
| 10 | Frost Flower | white flower, winter foliage, berries |
| 11 | Ice Dragon Skull | crystalline dragon-head lid and teeth |
| 12 | Snow Globe | small winter village under glass dome |

## Actual evidence

- **2 generated input contact images** (both 1774×887 RGBA, 6 columns × 2 rows); selected twelve unique designs, six from each final grouping as recorded in the session-only `manifest.json`.
- **12/12 RGBA sprites** exactly 512×512, `alpha_min=0, alpha_max=255`, transparent upper-left corner.
- **2/2 output sheets** exactly 1536×1024 RGBA, 3×2 layout.
- **12/12 sprites** with measured nontransparent-artwork safety margin >= 41px on all four sides (approx >=8% of 512 cell); there was no output-canvas edge crop.
- **ZIP** with 16 entries (12 sprites + 2 sheets + `manifest.json` + `QA_96px_DARK.jpg`), `zipfile.testzip() == None`.
- **96px contact proof** opened against dark background; silhouette, white eyes and keyhole/catch legibility recognizable.
- **No automated detailed alpha halo test**: raw generator foreground contained background flecks; component isolation attempted, residual edge halos still require human visual judgement on light and dark.
- **Human acceptance: NOT YET**.

## Actual technical limits / drift findings

- The raw generator did **not** honor the requested two separate 3×2 jobs; two 6×2 candidates were composed and **repacked**.
- The generator still favored the **same gold keyhole on the right** and nearly frontal large white eyes. The theme silhouettes vary (human review), but **gaze and lock morphology diversification did not materially improve** on the second attempt. Track as **TUNE / visual variation seam**, not an automatic PASS.
- Source art binaries/ZIP were produced **in the chat runtime only**, **not uploaded to GitHub** by this text documentation checkpoint. They cannot be called GitHub-archived donors.
- The image content has a compressed vertical/square silhouette bias; not all 4 squat/4 square/4 tall proportions were truly achieved.
- This is static PNG artwork, **not an opened-lid animation, rig, 3D chest, runtime asset import or plugin release**.

## Recoverability

Producer Session-only filenames:
- `kfb_ws0_frost_chests_sheet_01_3x2.png`
- `kfb_ws0_frost_chests_sheet_02_3x2.png`
- `kfb_ws0_frost_clay_chests_12_RGBA.zip`
- `kfb_ws0_frost_chests_96px_dark.jpg`

Those are local image artifacts, **not** durable GitHub links. Preserve/ingest with existing Asset Librarian/WS0 source authority after human acceptance, then verify actual isolated source images.

## One next gate

**Georg: PASS / TUNE / FAIL for Frost R1.** If PASS, register the accepted images as new style anchors via the existing WS0/Asset Librarian process before making source-backed claims. If TUNE, target the smallest meaningful seam (lock placement + gaze, then shape mix), preserve the current candidate and do not restart the entire accepted family.
