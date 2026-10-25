# WSA → WS0 · Drive 404 / canonical entry fix · 25.10.2026

**SOURCE FIXED · LOCAL BROWSER VERIFIED · SAVED v6 · NOT DEPLOYED. Live remains v4.**

## Who fixes what

WSA owns and has implemented this hosting-entry repair. WS1 does NOT need to rewrite the game Drive mode/hash logic for this failure. WS0 coordinates the still-open native Sites all-path password gate. Do not conflate these two defects or report Drive as live-fixed.

Georg's exact failure was reproduced: `https://kfb-ws1-staging.frizzlebob.chatgpt.site/game-package#m1,car,harvest,look=terrain3,world=probe,hud=3d` returns404 on restoredv4. The game sets the hash and reloads; the leaked internal pathname remains. Earlier hosted ASSETS index canonicalization leaked `/game-package/` into the browser. This is a WSA hosting-integration error, not user operation.

## Delivered repair

- `lib/game-entry-routing.mjs`: internal entry aliases map to `/`, preserving query and leaving fragment inheritance intact; redirect runs AFTER application authorization.
- The ASSETS index redirect is consumed internally, only for the exact same-origin `/game-package/` target with identical query and no fragment. Foreign/unexpected/chained redirects are rejected; internal index path no longer leaks through a normal Worker-served root.
- `build/sites-worker.ts` uses the helper; `tests/game-entry-routing.mjs` covers the seam. Original delivered game/model/audio bytes unchanged. No second runtime, Site, host, game-branch write or paid generation.

## Exact candidate / active product

Existing project `appgprj_6ad2ac305b788191af0bdfc68823a300`, KFB · WS1 Staging, URL above.

Private Sites source **8241ddf14d1ad0cd9c20de8724703bc4b0388b9b**, saved **v6** `appgprj_6ad2ac305b788191af0bdfc68823a300~appgver_5c4323ba3830819183279ebd56700d3e`, archive49,336,320B/195files. **deployment_id=null**. Saved only; no deployment call was made.

Active restored **v4**, source `fbabbad7b8efa98c9071fccb358e4fb4788ec826`, deployment `appgdep_6add5ad182f48191aff724c719771ff0`, unchanged in this follow-up. Native owner-private policy unchanged. No tester secret or private game payload appears in this public report.

Game packet remains private `georg-doc/KFB-Stunt-Car-Race`, `site/mvp-r2-dist` @`e76c26a6891d023aac6f2ed5f26c2fd87c9f54de`. R3 @`18ad81d25e8f560124f5104c5aa1832f3a445c68` remains queued.

## Actual evidence / limits

- **14/14 routing tests +30/30 existing delivery tests PASS**; independent Tester reran44 and added **12/12 edge probes**.
- Framework buildPASS.
- Actual local Chrome: exact reported `/game-package#...` navigated to `/#m1,car,harvest,look=terrain3,world=probe,hud=3d`; game/terrain loaded, no404. Large red geometry was visible in vehicle view; vehicle design/render quality, driving physics and audio are NOT accepted by this routing check. Do not substitute this for a full Drive test.
- Guard: CONTINUE save/report; NO deployment while password block remains.
- Hosted fix verification NOT RUN: candidate deliberately not deployed. Current live404 is therefore NOT claimed fixed.
- Local browser screenshot retained by executor as `work/drive-routing-local-proof-2026-10-25.png`; no private screenshot/binary published in this public branch.

Public code/evidence receipt: `replies/WSA_MVP_GPT_SITE_R1_PREPARE/DRIVE_PATH_FIX/`, implementation/evidence commit `640a8ebee60da9af33daddea6a1ab7810eaee8c6`, exact head and4files fetched after write. Existing register branch `georg-doc/kayfabizarro:docs/kfb-decisions-register-2026-10-11`; no newPR, merge, deletions or Hub/Site redesign.

## One next gate — actionable WS0 handoff

**Resolve/confirm supported native Sites static authentication dispatch on the SAME project before publishing v6.** Required negative test: with valid platform owner/service access but WITHOUT Basic password, direct `/game-package/assets/hero-Cg69yYuF.glb`, `/game-package/` and later `h15/*`/HeyGen paths must deny content. Existing v5 failed that check despite local `run_worker_first:true`; localgreen is insufficient. Then deploy exact savedv6, verify root stays root, Walk→Drive→Walk reloads keep the hash without404, full Drive/vehicle/audio behavior, allpathpasswords and fps, then proceedR3. If platform cannot support this gate, report that one concrete limitation; no newhost, weaker access rule or alternate private-asset transport without explicit authority. Georg need not supply tokens.
