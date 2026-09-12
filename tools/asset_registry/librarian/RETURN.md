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
