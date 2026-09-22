# Combat Arena Integration V2 · Test Report

Status: **CI_PASS · PUBLIC_STAGE/BROWSER/PERFORMANCE/HUMAN GATES PENDING**  
Branch: `chatgpt-web/combat-arena-integration-v2-2026-09-19`  
PR: #5  
Validated handoff parent: `95971ff0f817ef9d1280f1f235e10d0b2adc89b8`

## Automated evidence

GitHub Actions run **35524287323**, job **106113636457**, completed successfully with PR merge ref containing handoff parent `95971ff0f817ef9d1280f1f235e10d0b2adc89b8`.

- `npm test`: **68 passed · 0 failed · 0 skipped**
- CA2-specific contract/ownership tests: **8/8 PASS**
- portable build: **215 files**
- re-home verification:
  - preserved runtime files: **172**
  - verified donor files: **66**
  - portable routes: **PASS**
  - public local paths: **NONE**

The 8 CA2 checks prove:

1. Driver Graft source pins and host-owned animation mode.
2. Exact player clip map plus explicitly named neutral fallbacks.
3. Exactly two verified KayKit Skeleton actor definitions and state maps.
4. Mob visual-source seam leaves Arena runtime ownership in `MobBrain`.
5. Gunfight uses the graft muzzle anchor when present.
6. Portable build includes the bounded `slices/` route.
7. Shot-expression and donor-muzzle hooks remain available.
8. Neutral instance/portal fields round-trip into the Arena query.

## Boundaries retained

- Player remains world-position / movement / ground owner.
- DriverCA2 owns one player `AnimationMixer`; no second player mixer is introduced.
- Face remains graft-owned.
- MobBrain remains spawn/movement/mixer owner for enemies.
- Gunfight / Rewards / RunFlow ownership is not replaced.
- No Race, Travel, Dungeon or Hub runtime is modified by the Combat implementation branch.

## Public Stage packaging check

Planned public route: `https://kayfabizarro.pages.dev/kfb-hub/stage/combat/`.

The route is not present in current `georg-doc/kayfabizarro@main`. An exact mirror was investigated rather than substituting a second runtime. Of 180 runtime blobs, 83 exact blobs already exist in the current public repository; 97 require transfer. The remaining hard boundary is 20 binary blobs required by the current Arena document: 19 local WOFF2 files and `assets/vfx/kfb-combat-atlas_4x3.png`.

Those binaries are present in the private Combat repository and the Dropbox recovery mirror. Two independent connector transfer paths were attempted and both hit the same binary boundary. Per KFB recovery protocol, the candidate was preserved and `FAILURE_RECOVERY_STAGE_PACKAGING.md` was created. No incomplete Stage package, replacement font, or VFX fallback was committed.

## Not yet proven

The automated PASS does **not** prove:

- visible FrizzleBob Idle → move → shoot → hit → respawn in a real browser;
- actor / eyes / weapon / muzzle attachment persistence after respawn;
- both Skeleton actors visually showing the intended states;
- desktop + narrow viewport behavior;
- before/after performance measurements;
- audio behavior;
- a direct Cloudflare Stage revision;
- Georg visual/freeplay acceptance.

No `PUBLIC_VERIFIED`, `BROWSER_PASS` or `HUMAN_ACCEPTED` claim is made.

## Environment note

The optional Game Development Studio `game-dev` CLI was checked once in the current ChatGPT environment and was unavailable. Per KFB workflow, repository-native checks are used as the fallback baseline:

`GAME_DEV_CLI_UNAVAILABLE · OPTIONAL FALLBACK USED`

## Next gate

Use a binary-capable checkout/WSA surface to mirror the exact 180-file runtime into `kayfabizarro/kfb-hub/stage/combat/runtime/`, add the Hub Stage pointer, then open the exact Cloudflare route and collect real-browser state/attachment, viewport and performance evidence.
