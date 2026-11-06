# KFB Popup Assets · Web-Chat-to-Game-Asset Workflow + GPT Plugin Plan R1
Date: 2026-10-25
**Classification:** PLANNED workflow / product study, not a created/released plugin.
**Existing owner:** KFB Asset Scene Composer + KFB Asset Librarian Source/Registry; this planning record belongs to the already-open World Composition PR #447. No second asset registry, backend, Site, World renderer or upload route.

## A. Practical creative workflow (right now, web chat)

`Georg intent/scene → technique references / genuine original KFB source when relevant → limited art-direction sample → Georg GOLDEN decision → one-object or spacious low-count sheet generation → source-pixel PNG QA → cut/trim/edge fixes → sprite + atlas export → candidate Registry handoff → existing Racer/World comparison`

Separate output classes:
- `MOOD_ONLY`: prompt-led generated stylized asset sheet, no evidence it used a particular source KayKit/Tiny Treats/Meshy mesh. All four Paris/LA sheets currently belong here.
- `CANDIDATE_FOR_REVIEW`: individual non-overlapping clean RGBA asset whose side/cut edge actually reads at gameplay scale and whose model-inspired art provenance is recorded.
- `SOURCE_LOCKED_MATERIAL_STUDY`: only on verified original source GLB AND actual isolated pixels supplied to generator; otherwise BLOCKED_SOURCE.
- `GOLDEN_REF`: Georg explicitly accepts one exact original/variant with source, prompt, hash; no assistant promotion from positive chat comment.

### 1. Concept art direction
Current first themes (no characters):
- `paris-1950s`: literary/jazz Left Bank flavor, autumn harmonious brick/ochre/blue-grey/cream, Eiffel landmark, café/jazz frontage/books/street trees/Seine; source-true geographic claims NOT inferred from artistic image. Camus/Sartre/de Beauvoir are mood, no portraits or living inhabitants.
- `hollywood-la`: vintage 1950s LA, Hollywood hillside, Art Deco cinema, observatory, diner, Spanish Revival, retro vehicles/palms, warm coral and teal accents. No crowds.
- Both: bold readable cartoon geometry as an *inspiration* from KayKit creator Kay Lousberg, visible white/off-white sticker cut edge, preferably shallow material thickness near viewer. This is NOT automatically a rendered KayKit mesh.

### 2. Repeatability recipe
Generate one asset per frame for clean extraction by default; batch of up to 3–4 objects only after spatial non-overlap consistently demonstrated. Force consistent **front/three-quarter camera**, normalized horizon/base, light direction, art style/outline thickness, scale tiers, transparent alpha background, no floor panel except intentionally separable asset. Keep bounding silhouettes fully inside canvas and at least ~32 px clear pixel gutter at reference 1448×1086 (candidate, not approved universal rule). Do not invent text on blank signs/ads; add accurate text separately via graphic tooling if needed.

Scene-level jobs: `theme`, `role` (landmark/façade/foliage/street furniture/vehicle/ground strip/impersonator/backdrop), `assetId/source` optional, `originalRefId`, `angle`, `materialMix`, `whiteDieCutEdge`, `negativeExclusions`, `PNG_originalSHA`, `batchIndex`.

### 3. Actual asset QA (automated + visual + eventual product)
**File integrity**: PNG decodes, RGBA, source unchanged and hashed, origin/provenance, physical dimensions.
**Alpha and separation**: target transparent background; no unwanted half-alpha pixel fog, white halo seam consistent, no two distinct objects touching each other or bounding-edge; connected component analysis is a useful flag, *not a semantic sprite cutter*.
**Visual**: isolated sprite on checker, black, white, medium-grey and actual KFB world scene; thumbnail/drive-speed silhouette; perspective/illumination and contact; no invented role text/characters.
**Export**: named PNG with alpha, pivot/bottom contact, bbox, optional side/back if facade, optional high-res single sprite/texture atlas, original hash and parent sheet ID; never silently convert composite to source-specific mesh.
**Gameplay**: stand-alone animated 2.5D/3D impostor candidate reviewed in existing receiving World/Racer owner only; verify look and performance at speed, overdraw, shadows, collision proxies and correct roadside placement. No collider from PNG inferred.
**Batch fail examples**: visual overlap in 2 out of 4 prior sheets; weak alpha ghosting in backgrounds; merged sticker white edges; inconsistent baseline and scaling. Regenerate rather than mechanically cut a touching source into missing parts.

### 4. Optional test/candidate deployment
Keep one small local folder/ZIP (the current four originals, manifests, QA) for WS0 source review. **Do not put media in public KFB Hub or KayKit private licensed packs by default.** When GitHub upload is approved, put the four original immutable candidate PNGs under `media/kfb/popup-assets/candidates/paris-hollywood-r1/`, with original naming/hash manifest and no automatically generated runtime import, then update Asset Librarian through its existing intake path. Existing site is authoritative; plugin is not an alternate media host.

## B. GPT plugin 'KFB Popup Assets' (proposed, not installed)

**Proposed user product:** Generate source-traceable white-edge transparent 2D game prop series quickly with KFB-specific aesthetics, inspect QA, approve Goldens, and hand off to current Librarian/Composer.

**Implementation posture:** start with a *skill/workflow* within connected `kfb-asset-scene-composer`, NOT a second private Plugin Creator registry/plugin runtime until user chooses a true product endpoint. Later name an owned private plugin **KFB Popup Assets** when app architecture/permissions are confirmed. Link via `kfb.asset-scene-image-job/1` and `kfb.asset-scene-image-result/1`, with proposed additive adapter `kfb.popup-asset-batch/1` only after schema-owner review.

**Workflow capabilities target:** 1) choose real Registry asset ID or `MOOD_ONLY` scene; 2) choose source-locked vs mood generation; 3) produce reproducible prompt/angle/material constraints; 4) batch image generation in the host actually supporting image generation (no fake provider API); 5) pixel QA and optional source/mesh consistency QA, correct/regenerate; 6) persist PNG+SHA and variant manifest; 7) explicit Georg choose GOLDEN or REJECT; 8) current Librarian intake and optional sprite atlas packaging; 9) KFB World/Track consumers attach without new world owner.

**MVP plugin pilot acceptance:** exactly one Georg-approved visual Golden, 3 distinct clean **detached** alpha assets from one theme, normalized scale/camera/palette/white-cut edge, genuine reproducible original PNGs+SHA, tested read on white/black/checker, one one-click candidate handoff to the current Librarian or a documented manual export where no Site permission exists. Only after that try new themes and Hollywood/Paris batch recipes. Separate plugin build/publish and any Site/Stage publication require new authorization. Do not claim 2D sprites are actual 3D KayKit geometry.

**Not in current tool:** existing Composer is a **skills workflow**, NOT a one-click image generation backend; KFB Asset Librarian Site's existing client-side intake cannot autonomously upload bytes without its authenticated bridge. This planning slice adds no plugin release, no new GPT capabilities and no real one-click batch operation.

## C. Exact original media transfer gate (OPEN)

Verified local original package: `KFB_POPUP_ASSETS_PARIS_LA_R1_ORIGINALS_AND_QA.zip`, 12,030,358 bytes, SHA256 `7efd549a9de6daccdfa1e570ed0a33f174613669a12886a2c9492fad78c59414`. It is a **sandbox conversation file**, not in GitHub.
Original planned destination four SHA256 hashes: see [ASSET_SHEETS_QA_MANIFEST_R1.json](ASSET_SHEETS_QA_MANIFEST_R1.json).

**BINARY_UPLOAD_PENDING**: to put original bytes in GitHub, an authorized Work/WSA executor with the user conversation original ZIP or local files and a binary-capable Git client performs a single bounded media commit on the existing Draft PR #447 branch; verify 4/4 full GitHub binary paths and hashes after commit. If the bytes are not accessible in that executor, do not substitute preview screenshots, text stubs, blank placeholders or downscaled surrogates. Explicitly report missing binary originals. No permission to auto-merge or publish.

## D. One next gate

Unchanged owning project route: **WS0 → WS1 terrain/world intake**, extended to inspect Popup Assets source/QA and name one small, source-isolated visual POC. Plugin design is planning only; no second next action or human acceptance gate inserted by default.