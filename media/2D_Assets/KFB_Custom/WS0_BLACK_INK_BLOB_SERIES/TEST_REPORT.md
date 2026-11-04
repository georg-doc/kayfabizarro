# TEST_REPORT · WS0 Black Ink Blob prompt / provenance documentation

Date: 2026-11-04. Mode: bounded documentation + local file forensics, not a game implementation.

## Executed in working container
| Check | Result |
| --- | --- |
| Exact candidate sheets discovered and decoded | **18 / 18** |
| Distinct nominal character cells | **108 / 108** |
| RGBA images with non-opaque alpha | **18 / 18** |
| Technical 512×512 derived single-image export | **108 / 108** created |
| Source SHA256 calculated | **18 / 18** |
| Derived SHA256 calculated | **108 / 108** |
| Cell boundary edge-band risk rule | **48 / 108 flagged**, 60 / 108 not flagged |
| Source donor genuinely isolated and visually opened | **1 / 1** (granny_a cell 01) |
| Source + derivative ZIP consistency | **1 / 1** `ZipFile.testzip() = None` |
| Source image bytes total | **35,341,456 bytes** |
| ZIP artifact bytes total | **64,764,162 bytes** |
| Existing WS1 gameplay tests re-run for new actors | **0** |
| New assets actually registered in GitHub canonical registry | **0** |
| Cloudflare Stage opened/deployed for this docs slice | **0** |

**Method:** Python Pillow/Numpy; source originals exact byte copies in a local ZIP. Grids were cropped mechanically by original actual size. Alpha-edge metric samples six-pixel borders at threshold alpha >32; a cell is flagged when more than 1.2% of its edge-band pixels pass threshold. This detects possible cell collisions/crops, **not** a proven actual cropping defect. Visual acceptance of all 108 exported individual sprites is not claimed.

**Limits:** Six historic sheets are physically 2×3 and twelve are 3×2. Several were returned with semitransparency up to alpha 254 rather than alpha 255; existence of alpha does not prove halo-free compositing. The chat PASS pertains to the pictured characters; output bytes and technical integration stay separately gated.

**Tool check:** `game-dev` executable not found in the available container PATH (one capability check); `GAME_DEV_CLI_UNAVAILABLE · OPTIONAL FALLBACK USED`. Repository-native code, branch and asset facts were inspected through GitHub; no CLI asset vendor job, GPU capture, Blender or physical performance measurement was run.

**Existing game evidence (not re-run):** `INKBLOBS_R1/RETURN.md` references owner-tested atlas/jump/splash/hit branches and 72 private sprites; those are historical owner reports and do not upgrade these new sources to runtime PASS.

## Explicit owner boundary
This milestone is **DOCS + MANIFEST + LOCAL QA only**. The reference `granny_a` isolation is proof of real donor source, but its presence in this execution does not mean source files were checked into the public repo. Source/derived actual bytes must be uploaded by the receiving intake before the Asset Librarian can truthfully register them.
