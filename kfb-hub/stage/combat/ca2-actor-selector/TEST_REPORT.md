# CA2-01 · Test Report

Date: 2026-09-20  
Source branch: `chatgpt-web/ca2-01-actor-selector-2026-09-20`  
Tested implementation revision: `64638a5818d7b7a75c0a96edd8777580669dcfa3`  
Evidence commit: `38ef7502f3b3a641fe93dbedb3058f773e0d07b8`

## Result

**32/32 browser checks PASS**

GitHub Actions:
- run: `35486077769`
- job: `106012591388`
- artifact: `10597264982`
- artifact digest: `sha256:f7346d76719f7857c52cc2c31b7b4f626497d565671e11125d0a42f1f89f4350`
- failed HTTP/resources: **0**
- page/console errors: **0**

The workflow also passed JavaScript syntax checks for `selector.mjs` and `proof.mjs` plus JSON parsing for `ACTOR_PROFILES.json` and `SOURCE.json`.

## Browser coverage

- exact SOURCE marker matches implementation revision;
- default FrizzleBob Driver Graft loads from the pinned donor and renders after the donor update tick;
- FrizzleBob retains Rig_Medium / graft identity, no muzzle gate is falsely promoted;
- GothGirl exact direct model loads, stays HOLD for face/ground/muzzle;
- Legacy FrizzleBob is source-only with **no substitute geometry**;
- `?actor=gothgirl` reload is deterministic;
- snapshot asserts no world movement, physics, combat, rewards or Arena save ownership;
- zero local storage writes are reported by the POC contract.

## Evidence images

- `01-frizzlebob-driver.png`
- `02-gothgirl.png`
- `03-legacy-source-only.png`
- `browser.json`

## Human gate

Not yet accepted. Public Cloudflare proof is the next gate.
