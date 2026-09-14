# KFB Asset Librarian v1.5

**Mode:** static, read-only, no LLM/API key required  
**Asset / Registry SSOT:** `georg-doc/kayfabizarro`  
**Permanent production URL:** `https://kayfabizarro.pages.dev/asset-librarian/`

The Librarian is a browser consumer of the generated Asset Registry and Production Resource Registry. It does **not** create a competing asset index or write back to assets, rigs, actors, motions or consumer runtimes.

## Registry modes

- **Live** — default. Reads the validated generated Asset Registry from `bot/asset-registry-update`. New uploads become searchable after the Registry workflow refreshes the bot branch; no Librarian redeploy is required.
- **Canonical** — reads the reviewed Registry committed to `main`.

The selected mode and Registry source commit are visible in the header.

## Daily workflow

1. Search/filter assets or use `Actors · Rigs · Motions · FX`.
2. Inspect visual previews and source facts.
3. Add asset candidates to the local Selection drawer.
4. Choose a consumer profile and export `kfb.asset-handoff.v1`.
5. Receiving consumers validate final suitability and implementation.

All handoffs remain `candidate-only`.

## 3D previews

GLB/GLTF Gallery thumbnails and detail previews use the same visible-mesh camera framing. v1.5 ignores non-renderable scene-graph nodes for framing and adds explicit headroom/footroom/side padding to reduce off-center or cropped previews.

## Animation discovery

`No embedded clips` means only that the selected character GLB contains no animations itself.

For rigged models with a measured skeleton signature the detail pane separately discovers:

- **Local character animation packs** — animation GLBs shipped inside the same character collection.
- **KayKit shared animation library** — for KayKit characters, exact skeleton-signature matches in `KayKit_Character_Animations_1.1`.
- **Same-skeleton candidates** — structural candidates outside those two groups.

This is particularly important for Mystery Series characters such as GothGirl: the character GLB may contain zero embedded clips while local Rig_Medium packs and the shared KayKit Rig_Medium library remain available.

**Animation Lab v2 owner boundary:** the Librarian exposes the sources and measured overlap. Animation Lab v2 owns actual playback on the selected character, attachments and final compatibility validation. Skeleton-signature equality is structural evidence, not a generic retarget guarantee.

## Production resources

The Production Resource Registry feeds:

- Actors
- Rigs/configs
- Motions
- FX

CapsuleCarl and FrizzleBob Driver Graft previews use their existing ToolBox owner readers (`mountCarl()` / `mountGraft()`). Vehicle-rig previews remain explicitly partial until a standalone ToolBox owner adapter exists.

## Historical gates retained

The browser CI keeps the earlier tested paths as regressions:

- v1 WebGL asset preview
- v1.2 six-task WSA acceptance
- v1.3 Production Resources
- v1.4 Live Registry + owner-rig previews
- v1.5 animation discovery + preview framing + permanent URL
