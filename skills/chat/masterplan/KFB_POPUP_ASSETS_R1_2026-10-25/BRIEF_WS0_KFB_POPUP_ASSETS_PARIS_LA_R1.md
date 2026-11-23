# WS0 · KFB Popup Assets — Paris 1950s / Hollywood LA · Golden-series intake R1
Date: 2026-10-25
**Owner:** EXISTING KFB World Composition planning, in georg-doc/kayfabizarro Draft PR #447. This is **asset research and planning**, not an implemented game asset, Site, Stage, new Librarian index, plugin release or Golden.
**Source:** Georg-directed four ChatGPT-generated sheets in the current chat: two Paris 1950s sheets and two Hollywood/Los Angeles sheets, each 1448×1086 RGBA PNG.
**Verified process read:** skills/chat/{START_HERE,CHAT_GITHUB_KFB_STAGE_WORKFLOW,FRESH_CHAT_SLICE_PROTOCOL}; KFB Clay Surface and Style Reference Router; current Asset Librarian/Composer; World Composition SSOT, Return and WS0 intake.
**Parent briefing:** [Complete World Composition WS0 intake](../BRIEF_WS0_KFB_PROCEDURAL_COLLAGE_OPEN_WORLD_REVIEW_R1_2026-10-25.md), [canonical planning dossier](../KFB_PROCEDURAL_TERRAIN_WFC_OSM_LANDMARK_NPC_COMPOSITION_R1_2026-10-24.md) §15–16.

## 1 · Exactly four first image sheets — identity and upload truth

| Image (intended GitHub basename) | Scene role | SHA256 of actual original PNG | Original bytes | Audit |
| --- | --- | --- | ---: | --- |
| `KFB_POPUP_PARIS_1950S_LANDMARKS_ARCHITECTURE_R1.png` | Eiffel Tower, cafés, buildings, Seine city fragments | `8485a7e63ec618ab88295c141d9c0ec6f4762298bfc89397d5a458998a603be5` | 2,831,847 | RGBA PASS / sprite isolation TUNE |
| `KFB_POPUP_PARIS_1950S_STREET_PROPS_VEHICLES_R1.png` | Cars, bicycles, books, trees, cobblestone and street props | `78323db5cd2f9a815a936aee26c5f4cec4224318c170517ce0430b1d6ba57a79` | 2,983,277 | RGBA PASS / sprite isolation TUNE |
| `KFB_POPUP_HOLLYWOOD_LA_LANDMARKS_ARCHITECTURE_R1.png` | Hollywood hillside, cinema, diner, Spanish Revival, observatory and LA skyline | `7620ecf88babbc55ec4566bd8bd1f45a2f6a40d096eb618879a6f69e6c60a924` | 3,222,232 | RGBA PASS / sprite isolation TUNE |
| `KFB_POPUP_HOLLYWOOD_LA_STREET_PROPS_VEHICLES_R1.png` | Palms, cinema cameras, traffic signals, vintage cars, diner/street props | `3ca1b886682179cc3150842597d6f466b4ea59aed8ca6149c7fd4cd32ecf39e5` | 2,818,263 | RGBA PASS / sprite isolation TUNE |

**CRITICAL STATUS: Original PNG binary files are NOT in GitHub as of this R1 briefing.** Files are verified in the active conversation container and available in the user-facing verified local ZIP `KFB_POPUP_ASSETS_PARIS_LA_R1_ORIGINALS_AND_QA.zip`; a sandbox file link is **not** a durable Github media path. This GitHub connector accepts textual contents and literal base64 blobs but does **not** read the local PNG bytes/file paths directly in this session. Never claim these named image files are uploaded merely because this manifest or a ZIP download link exists. **Upload required via GitHub-binary-capable WSA/Work or normal Git LFS/CLI/authorized upload**, then check exact four committed paths and actual SHA256 bytes after downloading. GitHub names above are planned destination names only.

**Suggested existing-owner candidate landing zone after real upload:** `media/kfb/popup-assets/candidates/paris-hollywood-r1/` — **do not create a fake asset or a second Registry**. Private/purchased KayKit/Tiny Treats media, if any, remain private by their own license. These four PNGs are original AI-generated style studies, NOT genuine KayKit/KFB/Meshy source meshes or source-faithful source-conditioned renders. Attribution of KayKit creator Kay Lousberg is stylistic reference only.

## 2 · Actual QA, not beauty-only evaluation

Local scripted check read all four original files via Pillow, decoded PNG/RGBA and SHA256, measured alpha; OpenCV examined connected alpha masks at threshold 128. Image dimensions all 1448×1086.

| Sheet | Fraction fully transparent | Connected areas >=2000px at alpha>=128 | Interpretation |
| --- | ---: | ---: | --- |
| Paris landmark | 26.405% | 8 | likely candidate regions; does NOT equal 8 independent, semantically clean sprites |
| Paris props | 20.372% | 9 | some merging/touching components |
| Hollywood landmark | 18.159% | 5 | multiple landmarks share connected silhouette borders |
| Hollywood props | 22.352% | 15 | many detachable candidates, but some elements touch |

All PNG file-integrity / four distinct hashes: **4/4 PASS**. Source images do contain transparent background. **Clean standalone PNG 2D sprites: 0/4 ACCEPTED** because weak non-zero edge/ghost alpha, connected white borders, overlaps, composite plinth/streets, scale/camera inconsistency, and no independent cropped isolated source object QA. Connected component counts are technical connected regions, NOT a promised number of game assets. No runtime/browser/GPU/collider tests performed.

**Explicitly forbid automatic promotion** of a sheet to `game-ready` based on RGBA alone. Do not label black-looking transparent areas as black fill; inspect alpha/composited checkerboard and cropped images. For clean extractions, prefer **one asset per generation** or few assets with large gutters and no touching contour, separately cropped/verified. Save original full sheets unchanged.

## 3 · Stylistic direction and source clamps

**Paris 1950s:** an uninhabited mid-century Left-Bank/riverbank literary-jazz atmosphere, Camus/Sartre/de Beauvoir *cultural mood*, warm harmonious autumn ochre/burnt orange/café cream/blue-grey, Eiffel pop-up landmark; café and jazz club, Seine bank, bookseller kiosk, Citroën/period cars, bicycles, vegetation and urban silhouettes; **no living characters, crowds or moving NPCs** in the asset images. Avoid pseudo-photoreal miniature archviz overwhelming game-asset usefulness.

**Hollywood/LA:** empty 1950s cinema and travel fantasy, Art Deco/South California Spanish Revival/retro diner, Hollywood hillside, observatory, palm trees, vintage cars, camera/film props, pink-coral/teal/turquoise/terracotta sunlit contrasts. Cultural references and signage should be checked per scene; do not invent licensed movie branding.

**Shared pop-up art constraints:** standalone silhouettes, white physical cut-out appearance/printed perimeter, transparent RGBA true alpha with clean edges, no overlapping/touching between different sprites, sufficient transparent margin, coherent three-quarter viewing direction per pack, grounded/contact-bearing geometry *visually indicated* but NOT collision proof, clean source-independent scale/anchor/texture atlas roles. Distinguish `artistically coherent as a set` from `source-true to an existing KayKit mesh`.

**Current KFB source and plugin authority:** existing private KFB Asset Scene Composer compose-kfb-scene job contract `kfb.asset-scene-image-job/1` (user connected) and [Asset Librarian README](https://github.com/georg-doc/kayfabizarro/blob/main/tools/asset_registry/librarian/README.md), canonical KFB Asset Librarian Site. The Composer requires real isolated source-pixel evidence for SOURCE_LOCKED modes and always distinguishes MOOD_ONLY from GOLDEN. Use mode `mood_explore` for these sheets; optional `asset_plate` only if isolated genuine KFB source is available. Existing KFB Clay/Style SSOT remains benchmark/binding where appropriate, not an excuse to redesign licensed source assets.

## 4 · Planning 'KFB Popup Assets' GPT plugin — extend, do not duplicate

**Name to reserve:** KFB Popup Assets (**PLANNED**, no plugin created/installed/released). Product positioning: a curated **workflow/skill on top of the connected KFB Asset Scene Composer and Asset Librarian**, not a new runtime, Registry, storage backend or speculative second image-generation provider. User-facing batch creation via existing ChatGPT image generator in chat initially; persistent provider APIs/one-click UI require separately authorized, tested connectors.

Candidate phased responsibilities:
1. **Golden Art Direction** — Georg selects/rejects first Paris/LA sheet and 4–8 *genuinely isolated* single-object samples; lock look/palette/camera/white edge, without asserting original KayKit geometry fidelity.
2. **Repeatable prompt & negative QA contract** — semantic asset class (landmark/architecture/façade/prop/foliage/roadsign/vehicle/scenic impostor), no characters when scene excludes them; one source object per frame or bounded sheet with separators; transparent background, margins, no labels/borders between props.
3. **Batch generation and audit** — named job/seed/prompt/provider receipt where available, exact original PNG/SHA/size, alpha threshold, white edge continuity, non-overlap, no unintended cast-shadows or matte leak, geometry/style score; output candidate/fail/proposed review, NEVER auto GOLDEN.
4. **Object extraction and export** — source-separated PNG with clean transparent padding; optional multi-angle impostor, texture atlas + manifest with pivot/foot contact/unit-size estimate, palette/look family, related original sheet ID and stable hashes; leave physics/scene truth to World/Racer.
5. **Existing Librarian intake** — save `kfb.asset-handoff.v1` or expanded attached popup candidate metadata through the actual current Librarian/Registry/Production Inbox owner. No one-click Site claim until binary upload/provider job is truly implemented and tested; no prohibited private pack release.
6. **Review/consumer POC** — optional same-camera/speed Racer roadside collage vs authentic KayKit 3D object/white-edge thin mesh, one bounded viewing surface only after WS0 source visual approval. Never equate a 2D image with a 3D model, Meshy model or physical collider.

**Proposed addon contract (research only):** `kfb.popup-asset-batch/1` can refer to *existing* Composer `jobId`, `sourceAssetRefs`, `mode`, `sceneTheme`, `assetRole`, `styleProfileId`, `promptVersion`, `batchIndex`, `originalImageHash`, `alphaMetrics`, `bbox`, `pivot`, `spriteStatus`, `goldenSelectionByGeorg` and `registryHandoff`. Avoid creating this as a second Registry schema before owner approval. Pilot with **one** genuine accepted Golden and **one** batch before implementing plugin UI.

## 5 · WS0 reviewer output and next gate

WS0 should inspect actual four sheets from the conversation ZIP *once transferred into its file context*, original pixel/alpha QA and existing KFB donors; classify source, design, and game readiness separately. First required result is **one corrected genuinely detachable single-object alpha sprite** from either Paris or Hollywood, visually inspect on light/dark/checkerboard and inside **a small existing-world receiving preview**, then choose whether white-edge cutout should be 2D plane, true paper-thickness mesh or angle-based impostor for Racer. Preserve the current World/Track/Cards/Clay/Asset Librarian ownership. Compare source and expected visible consequence; select one POC only after Georg's visual/product gate.

**Single next gate (unchanged parent planning authority): WS0 → WS1 terrain/world intake**, with *Popup Assets* now recorded as a candidate first visual/asset proof and the original 4-binary GitHub upload as a specific outstanding handoff item. If upload cannot be performed, maintain `BINARY_UPLOAD_PENDING`, not `PUSHED`.

**Tests this planning document makes no claims for:** original PNG browser rendering, game animation, race freeplay, target GPU performance, Live/Stage publication, actually created GPT plugin, original KayKit mesh source fidelity.