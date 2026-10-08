# KFB Asset Librarian v1.6

**Mode:** static catalog/browser with browser-local intake preparation; no LLM/API key required
**Asset / Registry SSOT:** `georg-doc/kayfabizarro`  
**Canonical productive GPT Site:** `https://kfb-asset-librarian.frizzlebob.chatgpt.site/`  
**Legacy Cloudflare mirror:** `https://kayfabizarro.pages.dev/asset-librarian/` · stale/secondary, not canonical

The Librarian is a browser consumer of the generated Asset Registry and Production Resource Registry. It does **not** create a competing asset index or write back to assets, rigs, actors, motions or consumer runtimes.

## Registry modes

- **Live** — default. Reads the validated generated Asset Registry from `bot/asset-registry-update`. New uploads become searchable after the Registry workflow refreshes the bot branch; no Librarian redeploy is required.
- **Canonical** — reads the reviewed Registry committed to `main`.

The selected mode and Registry source commit are visible in the header.

## Private audio / asset intake bridge

The existing Librarian also overlays the public-safe live projection at:

`tools/asset_registry/librarian/live/private-asset-live.json`

That file contains metadata only. Private file bytes, Production Inbox IDs, private paths and credentials are forbidden. A refresh fetches the live JSON with `cache: no-store`, so metadata-only changes appear without a Site redeploy. The deployed Site retains its local snapshot and fails soft if GitHub is temporarily unavailable.

The `Intake` view prepares a `kfb.asset-intake-draft.v1` handoff for 3D, image, texture, animation, audio and ZIP files up to 32 MB each. Draft metadata is stored browser-locally; selected file bytes do not leave the device until an authenticated Production Inbox connector accepts them. Until that connector is explicitly enabled for the Site, the view offers a copy/download handoff and labels direct upload as unavailable.

Private projected audio supports title, artist, collection, `MUSIC` / `SFX` / `UI` / `VOICE` / `AMBIENCE`, credits, license/source notes, tags, duration, loop and BPM. Search and the inspector expose these fields. Playback appears only when the projection contains an authorized public preview or runtime URL; otherwise the UI says `Private source · Preview pending`.

Browser-local assets, sets, notes, principles, tags, relations and inspection state remain separate and are not replaced by live refreshes.

## KFB Town Workbench · v1.6

The `Town` tab is a production view over existing Registry facts for assembling candidate Town scenes.

### Environment

The Environment lane exposes practical working views for:

- **Nature & Forest** — KayKit Forest/Nature and Kenney Nature are ranked first.
- **Buildings & Town** — Kenney/KayKit building, city, house, shop, industrial, suburban and related candidates.
- **Space & Sci-fi** — including the repository's `scifi-ultimate-space-kit-quaternius` pack.
- pack/source filtering for Kenney, KayKit and the Quaternius Space Kit.

`Nature`, `Buildings`, `Space` and similar labels are **workbench presentation filters** based on existing pack/path facts. They are not written back as new Registry semantics.

### KayKit characters and props

The Character lane shows rigged KayKit GLB/GLTF candidates, prioritizes Mystery Series characters, and can filter by the measured KayKit rig families `Rig_Small`, `Rig_Medium` and `Rig_Large`.

After choosing a character, the Character Props lane focuses on renderable non-rigged assets from the same existing `packId + collectionPath`. The same relation appears in character detail as **Collection props** with 3D thumbnails.

This is a structural workbench relation only. A sibling is a candidate prop; the Librarian does not invent semantic ownership or gameplay suitability.

### Scene Plan

The workbench can hold one candidate each for:

- Environment
- Character
- Prop

The local scene packet uses `kfb.town-scene-candidate.v1`. It remains `candidate-only`; KFB Town / the receiving implementation owns composition, scale, attachment and runtime validation. Selected scene assets can also be added to the existing Selection drawer and normal `kfb.asset-handoff.v1` workflow.

## On-character KayKit motion preview · v1.6

`No embedded clips` still means only that the selected character GLB contains no animations itself.

For a KayKit character, v1.5 discovery separates:

- **Local character animation packs** — animation GLBs shipped inside the same character collection for the explicit measured rig family.
- **KayKit shared animation library** — sources in `KayKit_Character_Animations_1.1` for the same explicit `Rig_Small`, `Rig_Medium` or `Rig_Large` family.
- **Same-skeleton candidates** — generic structural fallback based on exact skeleton-signature overlap.

v1.6 turns the first two groups into a `KayKit motion` selector in the selected character's 3D preview. The external source animation is loaded without replacing the selected character. The clip is played through that character's own Three.js `AnimationMixer`, and the UI reports how many animation tracks actually bind.

A zero-track binding fails closed. A successful preview is still **preview evidence only**, not a generic retarget guarantee.

**Animation Lab v2 owner boundary:** Animation Lab v2 owns final playback/attachment integration and compatibility validation.

### Tested GothGirl case

Real Chrome 152 / WebGL 2 test against the Live Registry:

- 25 local motions discovered
- 132 shared motions discovered
- 165 local/shared preview choices exposed by the current source files
- local `Death_A` preview from `Rig_Medium_General.glb`
- **69 / 69 tracks bound to GothGirl and playback started**
- GothGirl same-collection microphone prop discovered

The different numbers are intentional: discovery counts unique motion names while preview choices represent concrete source-clip entries.

## Daily workflow

1. Use `Town` for environment/character/prop assembly, or use the general `Assets · Actors · Rigs · Motions · FX` views.
2. Inspect 2D/3D/audio previews and source facts.
3. For KayKit characters, inspect collection props and audition local/shared motions directly on the character.
4. Add candidates to Selection or a Town Scene Plan.
5. Export candidate-only handoffs; receiving consumers validate final suitability and implementation.

## 3D previews

GLB/GLTF Gallery thumbnails and detail previews use the same visible-mesh camera framing. v1.5 ignores non-renderable scene-graph nodes for framing and adds explicit headroom/footroom/side padding to reduce off-center or cropped previews.

## Production resources

The Production Resource Registry feeds:

- Actors
- Rigs/configs
- Motions
- FX

CapsuleCarl and FrizzleBob Driver Graft previews use their existing ToolBox owner readers (`mountCarl()` / `mountGraft()`). Vehicle-rig previews remain explicitly partial until a standalone ToolBox owner adapter exists.

The v1.6 Town Workbench does not replace these owners. In particular, later FrizzleBob Driver Graft presentation can consume the existing owner reader instead of inventing a second rig implementation.

## Historical gates retained

Browser CI keeps the earlier tested paths as regressions:

- v1 WebGL asset preview
- v1.2 six-task WSA acceptance
- v1.3 Production Resources
- v1.4 Live Registry + owner-rig previews
- v1.5 animation discovery + preview framing + permanent URL
- v1.6 Town Workbench + on-character external KayKit motion playback


## Downstream package consumer · KFB Game Dev Studio

Permanent package/review lane:

`https://kayfabizarro.pages.dev/kfb-hub/free-roam/game-dev-studio/`

Source/recovery home:

`tools/game-dev-studio/`

Game Dev Studio may consume exact Registry/Librarian source identity and existing 3D preview mechanisms, but it does **not** turn this Librarian UI into the production-review shell. The Studio is package-first: current package → preview → derived/QA status → consumer handoff.

This keeps the Librarian broad and source-oriented while allowing Georg's production workflow to avoid the filter/drawer-heavy navigation when reviewing a specific package.

## Public-domain source provenance · PD-POOL-R2 candidate

Status: **TESTED CANDIDATE · NOT YET ON THE PERMANENT CLOUDFLARE LIBRARIAN**

The existing Asset Registry can now treat `media/public_domain` as an additional source root **without becoming a rights classifier**.

For that root only, an asset is eligible for Registry output when its neighboring tracked `.license.json` sidecar matches the exact payload path, byte count and SHA-256 and contains the required persisted source/rights facts. Those explicit facts are passed through as `license` + `rightsEvidence`; they are not inferred from filenames, age, provider name or search result text.

The Librarian reuses the existing provenance panel to display:
- stored license/source metadata;
- explicit-sidecar provenance;
- stored rights tier;
- external provider + source ID/page;
- rights-check timestamp;
- payload SHA-256;
- evidence sidecar path.

The candidate-only query/handoff path preserves the same facts.

PD-POOL-R2 currently registers exactly four proven R1 smoke objects. It does not authorize bulk discovery/import, and it does not reconstruct the missing historical selected-hit manifest.

Evidence: Draft PR #246, dedicated run `36288195716`, Asset Registry owner run `36288282662`, Librarian Browser owner run `36288282599`.

Publication remains a separate Georg-gated step.
