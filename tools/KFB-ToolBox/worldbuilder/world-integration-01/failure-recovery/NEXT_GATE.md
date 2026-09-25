# NEXT GATE · WORLD-R2-CONTRACT-RESET-01

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

PASS → resume Stage preparation.
FAIL → preserve diagnostics and return to architecture; no automatic repair chain.
