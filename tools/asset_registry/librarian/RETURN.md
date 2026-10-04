# RETURN · Asset Librarian GPT Site Prep · 2026-10-04

**Status:** READY FOR WSA WORKSHOP · SITE/UX PREPARATION ONLY · NO RUNTIME CHANGE  
**Owner:** KFB Asset Registry / Asset Librarian  
**Branch:** `chatgpt-web/asset-librarian-gpt-site-prep-2026-10-04`  
**Verified source-package checkpoint:** `3927b8dc9a9db927bb3e84ec5a54ff7dbb8ef7ab`  
**WSA workflow:** `WSA-ASSET-LIBRARIAN-GPT-SITE-01`

## Product reality

The current Asset Librarian remains the source-backed discovery/preview/handoff owner. A new GPT Site is now fully briefed as the future primary human working surface, while the existing Cloudflare Librarian remains unchanged as a compatibility/source surface during migration.

The Site is not built in this preparation slice.

## Prepared outcome

- full Librarian and compact God Mode / WorldBuilder picker share one query/item identity model;
- real Family → Pack → Collection facets reuse Registry facts;
- daily workflow becomes **Find → Inspect → Collect → Use**;
- user-facing **Saved Sets** replace manual JSON-first collection work while retaining `kfb.asset-handoff.v1` underneath;
- Motion discovery may reuse the proven real-actor preview seam, but Animation Lab / ToolBox remains compatibility/authoring owner;
- Dropbox/file upload is a later Intake adapter only and stays visibly `INTAKE / UNREGISTERED` until existing Registry ingestion accepts it;
- WorldBuilder remains scene placement/persistence owner.

## Source / donor pins

Primary source: current `main` Librarian under `tools/asset_registry/librarian/`.

Green donor subset only from frozen Draft PR #304 implementation `545853924c4c177b6e26af588020b7a59307bb71`:
- Family → Pack → Collection browse;
- KayKit family facet;
- Motion → real preview actor → existing binding/playback path.

Excluded:
- PR #304 motion scrub / new transport bar;
- any second Registry, asset taxonomy, scene runtime or animation owner.

## Files prepared

- `_handover/ASSET_LIBRARIAN_GPT_SITE_2026-10-04/START_HERE.md`
- `_handover/ASSET_LIBRARIAN_GPT_SITE_2026-10-04/UI_PICKER_CONTRACT.md`
- `_handover/ASSET_LIBRARIAN_GPT_SITE_2026-10-04/SOURCE_EVIDENCE.md`

The same three documents are persisted in KFB Production Control under `WSA-ASSET-LIBRARIAN-GPT-SITE-01`.

## Tests / evidence

No Librarian runtime code changed, so no new browser/WebGL or deployment test is claimed.

Preparation evidence:
- current main owner/code read;
- current Librarian surface inspected;
- frozen PR #304 recovery/donor read;
- Dropbox searched read-only for newer authoritative source; none supersedes GitHub;
- every preparation write was fetched back from the exact branch.

## Publication

Existing compatibility URL remains unchanged:
`https://kayfabizarro.pages.dev/asset-librarian/`

No GPT Site URL exists yet. No Cloudflare Stage/Live publication, retirement or replacement is claimed.

## Exactly one next gate

**WSA-ASSET-LIBRARIAN-GPT-SITE-01**

WSA Workshop builds Phase A: Site-native live search + Family/Pack/Collection + gallery/list + preview inspector + minimum Saved Set seam, reusing current owner code and only the proven PR #304 donor subset. It returns one direct GPT Site review link.

---

## Previous Return · historical

# RETURN · Asset Librarian v1.2 Core

**Status:** TESTED BROWSER IMPLEMENTATION CANDIDATE · WSA Phase 1  
**Branch:** `asset-librarian/v1.2-site-core-2026-09-12`  
**PR:** `georg-doc/kayfabizarro#14`

## Decision

v1.2 is a static daily-use UI/product slice over the existing Registry. It is not a new Registry/indexer and has no LLM/API-key dependency.

## Implementation

The tested v1 browser now adds daily-use search/browse/detail/preview/tray/review-queue capabilities while preserving exact Registry facts and consumer owner boundaries.

No files under `registry/assets/v1/**`, no source assets, and no v1.1 LLM/OpenAI implementation are changed by this slice.

## Tested result · real Chrome/WebGL gate

GitHub Actions `KFB Asset Librarian Browser Smoke` run #8 passed on the v1.2 branch.

- existing v1 Chrome/WebGL regression: PASS
- new WSA v1.2 six-task acceptance: PASS
- browser: Chrome 152 / WebGL 2
- browser console errors: 0
- runtime exceptions: 0
- canonical Registry source commit remains `11d7df978c63b9e375707bd8d9431b4c8358cda8`

### T1–T6

1. **Orc Raider + texture:** `OrcRaider.glb` rendered; rig 23 joints; pinned RAW checked; `orc_texture_A.png` rendered at 1024×1024.
2. **Rover:** `Rover_Round.gltf` selected and exported to `stunt-car-race` as `candidate-only`.
3. **Rig Medium:** 22 rigged+animated matches found; General / MovementBasic / CombatMelee selected; animation counts 15 / 11 / 22; Animation Lab handoff remained `candidate-only`.
4. **CapsuleCarl + CharacterTemplate:** player dependencies expose `player.bin` + `capsule_texture.png`; texture preview works; player + CharacterTemplate exported to Frankenstein Studio.
5. **Bath + propulsion:** `bath.gltf` + `SpaceRanger_Jetpack.gltf` exported as Frankenstein Studio candidates; no suitability claim is made.
6. **Audio:** `EnterArena.wav` metadata `0:01 · wav · 228 KB`; play/pause works; selection survives reload; Generic Runtime handoff remains `candidate-only`.

Evidence artifact: `kfb-asset-librarian-browser-smoke`, containing `v1.2/result.json` and six T1–T6 screenshots.

## Not part of this slice

- OpenAI/Claude calls
- API keys / authentication
- Registry or asset writes
- consumer runtime writes
- semantic suitability decisions
- race gameplay/runtime integration

## Next / stop rule

Phase 1 stops here after final PR contract CI is green. Georg tests the static site next. Claude Design A/B / Phase 2 starts only after that user review.
