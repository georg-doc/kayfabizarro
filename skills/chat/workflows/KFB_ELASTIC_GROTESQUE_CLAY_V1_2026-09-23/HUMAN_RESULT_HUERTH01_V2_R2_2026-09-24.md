# HUMAN RESULT · Hürth 01 V2 tuned (R2) · 2026-09-24

Reviewed: tuned V2 at `https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-look/` (after `deploy(huerth-look): pin tuned V2 review`), real Chrome.

## Verdict

**NOT YET · the reported bugs are still there.** Doors/windows placement on the wall is OK now.

## Still open (Georg's screenshots)

1. **Roofs still sit on top.** The bulged wall body is wider than the roof; the roof reads as a lid placed on the block. Required: roof slightly larger than the final (deformed) wall top outline, small overhang all around.
2. **Road/curb seam still broken.** At the curb/path junction the ribbons still step and leave a wedge/gap (marked). Ribbons and junction pieces must share edges.
3. **Light/shadow banding** from the first review: re-check; do not claim fixed without a before/after picture.

## New direction for doors and windows

- Not only on one side of a block. Distribute them **organically and offset on all visible sides**, 90s-cartoon suburb logic (irregular, lively, never a grid).
- Doors and window frames are **part of the colour system**, not neutral add-ons.

## Colour system (reuse, do not invent)

Doors, windows, walls and roofs take their colours from the existing harmonic cartoon colour logic:
- **Story mode** palettes;
- **card seeds** (colour derived from a card seed);
- **random harmonic palettes**.

Reference implementation: **KFB Racer Cologne** in `georg-doc/KFB-Stunt-Car-Race` (private repo; the ChatGPT chat can read it). Find the exact palette module there and reuse it; also see Voxel Zone S2 `terrain/world-context.js` STORY_PALETTES in kayfabizarro. Name the exact source file and commit in the return.

## Unchanged

Views stay switchable (Elastic default; Clean/Cartoon/Grotesque untouched). Only Elastic is optimized.

## Start text for the form-language chat

```
Read on PR #194 branch: skills/chat/workflows/KFB_ELASTIC_GROTESQUE_CLAY_V1_2026-09-23/HUMAN_RESULT_HUERTH01_V2_R2_2026-09-24.md. Apply skills/session-entry-use-what-works_v1.md. Fix only: roof overhang over the deformed wall top, the curb/path junction wedge, shadow banding (show before/after). Then spread doors/windows organically over all visible sides and colour walls/roofs/doors/windows from the existing palette system of KFB Racer Cologne (KFB-Stunt-Car-Race: story mode, card seeds, random harmonic palettes) — reuse that module, name file + commit. Publish via the wrapper at kfb-hub/pruefen/huerth-look/, update CHAT_RECOVERY_CURRENT.md, stop, report four picture-checkable sentences.
```
