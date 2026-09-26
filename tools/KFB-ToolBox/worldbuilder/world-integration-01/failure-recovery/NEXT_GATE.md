# NEXT GATE · WORLD-R2-STAGE-PUBLICATION-01

The contract-reset gate and local closed-package Stage gate passed without changing runtime owners.

Publish the unchanged, locally verified package through the existing KFB Stage owner. Open the exact
`https://kayfabizarro.pages.dev/kfb-hub/stage/world/world-r2/` route, verify source marker `58028b07...`,
and repeat the exact Hürth → Cologne → WB2 browser sequence there.

No new World features, mobility, OSM corridor carving, camera owner, Track integration or Live promotion in this gate.

After public verification: **STOP for Georg World r2 visual/freeplay review.**

---

## Completed prior gate · WORLD-R2-CONTRACT-RESET-01

## Scope

**TEST CONTRACT ONLY FIRST.**

Do not change World runtime, movement physics, OSM presentation, terrain sculpt, edit layer, actor source or ToolBox profile in the first pass.

## Goal

Reconcile `wi1-selftest.js` with the shared ToolBox locomotion profile contract.

The test must explicitly classify:

1. source-backed roles:
   `idle walk run sprint backward strafe.left strafe.right jump.* crouch sneak crawl`;
2. ToolBox playback variant:
   `walk.fast`;
3. World-only consumer tuning:
   `backward.fast`;
4. World-only consumer tuning:
   `strafe.walk`.

The test must validate structured meaning, not a prose regex like `/no .* clip/`.

## Run order after test-only change

1. static owner/closure suite;
2. Hürth selftest;
3. Cologne selftest;
4. accepted WB2 34/34 regression.

One bounded run.

If the contract-only change passes and later runtime assertions fail, open a new runtime gate from that exact failure. Do not mix runtime changes into the contract-reset commit.

## Exit

PASS → resume Stage preparation. **Completed 2026-09-26.**
FAIL → preserve diagnostics and return to architecture; no automatic repair chain.
