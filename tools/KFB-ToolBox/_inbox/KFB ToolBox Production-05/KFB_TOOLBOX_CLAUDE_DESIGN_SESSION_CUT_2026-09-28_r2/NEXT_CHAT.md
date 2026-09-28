# NEXT CHAT · KFB Animation Library V1 → next slice

You are continuing the KFB ToolBox in Claude Design. The current entry is `KFB ToolBox Production-05.dc.html`. The Library tab lives in there; the other tabs are P04 unchanged.

## Where things are

- Motion Library v3: `media/3D_Assets/Animations/KFB_Motion_Library/` @ `4fa082714c7200f6926008a1cd0b34db8df4dbad` (PR #275, stacked on #213, not merged). `const ML3` in the logic class. If the PR merges, move the pin to the merge commit and rerun the Library self-test.
- Library logic: the `_loadML3` … `_libVals` block in P05. Pure logic lives in `kfb-lib/anim-library.v1.js`.
- Patch storage: `localStorage['kfb-anim-library.patch.v1']`, schema `kfb.animation-editorial-patch/1`.
- Librarian adapter: `kfb-lib/librarian-motion-projection.v1.js`. It projects rows from the loaded manifest; it is not a catalog.

## Rules that bit before

- The catalog is deep-frozen. Never write into it. Editorial data goes only into the patch.
- `PROVEN` = all tracks bind on this actor. Don't claim more than that.
- three.js turns `hand.l` into `handl`. Bone matching must work without the separator (`sideOf` / `boneRole`).
- DC style holes: `background-size:auto 200%` in a template style broke the whole attribute. Card sprite styles are set in `_libFlip` via the DOM.
- Shadows: `LESSONS_SHADOWS.md` still applies to the stage (inherited from P04, unchanged).

## Open work, smallest first

1. Test a real Mixamo FBX in the Drop Zone (the FBX path has never run).
2. Consume the Render R0 preset once its code lands on `work/render-r0-shared-preset-2026-09-28`.
3. A seat prop for seated clips in Terrain, and the two-actor shoulder-throw sync.
4. Live 3D card previews through a shared renderer pool (today: contact sheets).
5. A GPT Site slice: persist the patch and intake receipts. Move the projection into `tools/asset_registry/librarian/` (owner: Librarian).
