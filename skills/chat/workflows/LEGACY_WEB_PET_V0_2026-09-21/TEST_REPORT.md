# KFB Legacy Web Pet v0 · TEST REPORT

Date: 2026-09-21

## Authoritative runtime head

`f41c59a8178bf77266c0f776f2e20a7948ee6223`

## Run

`35553968462`

Job:
`106193863972`

## PASS

- static/source contracts: **15/15**
- MV3 esbuild bundle: **PASS**
- shared Web/Hub WebGL: **12/12**
- Web proof failed resources: **0**
- Web proof page/console errors: **0**

Observed Web candidate:
- Rogue default;
- real Warband camp props: HammerAxe + Sword;
- click animation: HeavyAttack;
- right-click settings;
- Mage switch;
- ordinary page link remains interactive.

## FAIL

Chrome extension arbitrary-page proof:
- plain page HTTP 200: PASS;
- no Hub mount script: PASS;
- extension `ready` marker: TIMEOUT after 120 s.

The same gate failed in prior run `35553680781`. Explicit Chromium-channel launch did not change the outcome.

Classification:
`EXTENSION_LOAD_OR_FRAME_BOOT_UNRESOLVED`

Not classified as a Legacy rig/Web runtime failure because the same shared runtime passes the normal Web host.

## Artifact

`10619267683`

Digest:
`sha256:da9bdfa9e0dd03c83f4335e61963449b7d559fc91e892867dd2c98843f361bf3`

## Next gate

`LWP-EXT-F1` — load observability only.
