# KFB Dungeon Room Blueprint · Blender bridge

This folder is deliberately small. Blender is a **consumer**, not a second room-layout owner.

## No Blender knowledge required

1. Open the World Atlas S14 room blueprint in the browser.
2. Click **Blender JSON**. The browser downloads `KFB_R02_blender_manifest.json`.
3. On macOS, double-click `BUILD_R02.command`.
4. Output lands in `~/Downloads/KFB_R02_Blender/`:
   - `KFB_R02.blend`
   - `KFB_R02.glb`
   - `KFB_R02_review.png`

The command calls Blender in background mode. It downloads only the exact asset files referenced by
the manifest, imports them, applies the browser-exported world transforms, creates a review camera and
neutral review lighting, saves the .blend, renders one PNG and exports one GLB.

## Ownership

- layout / room recipe / manual detail edits: World Atlas browser source;
- source asset identity: KFB Asset Registry / pinned RAW asset URLs;
- Blender: deterministic review/export compiler only.

No Meshy credits are used for R02. All 24 unique assets are existing registered KayKit Dungeon assets.
