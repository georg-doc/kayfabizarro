# TEST REPORT · WORLD-R2-STAGE-PREP-01

Date: 2026-09-26  
Source: PR #190 · `58028b07d7618926c40ffaec3bd4053dc88c0efd`

## Local package gate

- byte-identical runtime/package checks: **23/23 PASS**;
- entry/source/scope checks: **5/5 PASS**;
- total package proof: **28/28 PASS**;
- JavaScript syntax: **PASS**.

## Local real-browser gate

Executed over `http://127.0.0.1:4173/`, never through `file://`.

- Hürth: **55/55 selftest PASS**;
- Cologne: **55/55 selftest PASS**;
- accepted WB2 regression: **34/34 PASS**;
- packaged browser harness: **15/15 PASS**;
- page errors: **0**;
- failed source requests: **0**.

Screenshots were produced during the run and intentionally not committed; CI uploads equivalent evidence.

## Publication

Not performed at this checkpoint. `PUBLIC_VERIFIED` remains false until the exact Cloudflare route
shows source marker `58028b07...` and repeats the browser sequence.

## Scope note

The package changes no World runtime owner. Clay/texture work is not a Stage blocker. Billboard H4 is
recorded as a separately accepted visual donor and is not integrated into this package.
