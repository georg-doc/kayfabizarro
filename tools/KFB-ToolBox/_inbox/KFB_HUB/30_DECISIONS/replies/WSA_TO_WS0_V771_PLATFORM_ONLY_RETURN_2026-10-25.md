# WSA → WS0 · V-771 Sofort-Fix · 25.10.2026

**DONE · v8 LIVE · v6 game content unchanged · platform owner-private only, no second Basic password.**

## Exact change / retained boundary

Georg explicitly requested disabling the additional browser username/password prompt on existing KFB · WS1 Staging. A separate repair checkout was based on exact v6 source `8241ddf14d1ad0cd9c20de8724703bc4b0388b9b`, NOT the R3 preview. Only two production files differ from v6: `build/sites-worker.ts` passes `basicAuth:false`; `lib/mvp-delivery.mjs` optionally skips that secondary authorization call while preserving its default for future separate testing. Added `tests/v771-platform-only.mjs` only.

**All127 manifest payload files are byte-identical to v6**,47,782,500B, package revision `e76c26a6891d023aac6f2ed5f26c2fd87c9f54de`. No game, asset, routing, mix or UI change. No R3 files included. No new password, environment-variable mutation, credential rotation, audience change, new Site, Cloudflare, merge or paid generation. Existing native environment revision1 remains unchanged; previously stored secondary credentials are unused, not reset.

## Published exact Site

URL: https://kfb-ws1-staging.frizzlebob.chatgpt.site
Project: `appgprj_6ad2ac305b788191af0bdfc68823a300`.
**Saved/live version8** `appgprj_6ad2ac305b788191af0bdfc68823a300~appgver_5225b990ecb08191a3cc1f881ea2c7ba`.
Site source head: `2b7b91e2078ad43094437841a0534693738e25b0`.
Deployment: `appgdep_6add7f8c86108191885e69cba8b9b98a`, native **SUCCEEDED**, then exact savedversion/source/deployment fetched.
Archive49,336,320B/195entries. Native access custom,oneuser,zerogroups, unchanged. No newPR for private Sites source or existing public register lane.

## Actual checks

- **52/52 unit checks PASS**:8V771 +30delivery +14routing. Independent Tester reran52 and verified127v6payloadhashes/sizes; Guard separately verifiedv6onlydelta andpayload, approved boundedhotfix.
- **127/127 actual local Worker responses fetched WITHOUT Basic credentials** match original v6 SHA256, all200, no WWW-Authenticate challenge.
- Actual signed-in Chrome/Georg platform session: reloadexistingSite→gameHUD/terrainat `/#m1,harvest,look=terrain3,world=probe,hud=3d`, **no second password dialog**. Browser screenshot retained privately inexecutorworkspace `work/v771-v8-platform-only-proof.png`.
- Separate hosted request with legitimate native Sites service access ONLY (no Basic header/password/cookies): root **200**, `WWW-Authenticate=null`, expected v6package revision. This avoids falsely relying on any browser-cached Basic credential to prove challenge removal.
- Four hosted anonymous requests, **no cookies, platform service access or Basic credentials**, each returned **401**, platformSign-inHTML and **no WWW-Authenticate**:
  1. `/game-package/assets/hero-Cg69yYuF.glb`
  2. `/game-package/`
  3. `/h15/`
  4. `/heygen/`

The last two are future R3 route families under the current v6payload; platform dispatch denies them before game routing. No public exposure or weakened Site audience. Only the explicitly rejected second login was removed. No full gameplay/audio/60FPS reacceptance is implied by this auth-only change.

## R3 / next gate

Saved R3v7 `appgprj_6ad2ac305b788191af0bdfc68823a300~appgver_ffa5e84f73f08191b8ad14cd3d5c906f`, source `ce97b8e38e19d5ed3b65a683622b7a9917837346`, remains retained and **NOT DEPLOYED**. Original R3 preview checkout was not modified by this repair; no automatic source-sync or R3 publication performed there. Current source branch head is the v6authhotfix; recovering R3 must explicitly use its savedversion/source, not assumeHEADisR3.

**One next gate remains Georg's R3 preview review before any R3publication.** The separate pre-tester Basic/password task is deferred, not silently re-enabled. V771 is closed; Georg only needs to reload the existing Site.

Public persistence: `georg-doc/kayfabizarro:docs/kfb-decisions-register-2026-10-11`, this report, additive ownerReturn/changelog. No private payload or secret values uploaded to public GitHub. Exact enclosing branch head and all changed reportfiles fetched after write.
