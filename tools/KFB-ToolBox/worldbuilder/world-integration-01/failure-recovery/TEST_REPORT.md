# TEST REPORT · WORLD-INTEGRATION-r2 failure recovery

## 2026-09-26 · Closed Stage package result

`WORLD-R2-STAGE-PREP-01` packaged the unchanged source at a fixed Stage path.

- package identity/scope: **28/28 PASS**;
- Hürth packaged browser: **55/55 PASS**;
- Cologne packaged browser: **55/55 PASS**;
- accepted WB2 packaged regression: **34/34 PASS**;
- packaged browser harness: **15/15 PASS**;
- page errors: **0**;
- failed source requests: **0**.

Public Cloudflare publication at `c035427ecb62023758589224c5d7872b217e0261` repeated the exact
sequence: source marker PASS, Hürth 55/55, Cologne 55/55, WB2 34/34, browser harness 15/15, zero page
errors and zero failed source requests. Status: **PUBLIC_VERIFIED · HUMAN_REVIEW**.

---

## 2026-09-26 · Contract reset result

`WORLD-R2-CONTRACT-RESET-01` changed only the selftest contract and contract documentation.

- pure locomotion + Surface Adapter contract: **13/13 PASS**;
- static owner/closure suite: **24/24 PASS**;
- Hürth: **55/55 PASS**;
- Cologne: **55/55 PASS**;
- accepted WB2 baseline: **34/34 PASS**;
- browser harness: **12/12 PASS**;
- page errors: **0**;
- failed source requests: **0**.

The exact formerly failing semantic gate now reads structured state/source relationships instead of matching variant prose. No runtime-owner module changed. Stage/public/Georg review remain not started.

---

## Archived failure evidence

## Static / source

Final candidate static owner/closure suite:
**20/20 PASS**

Confirms:
- accepted terrain/edit owners retained;
- ToolBox profile immutable pin;
- ToolBox profile schema;
- profile-driven semantic map;
- source-backed sprint consumer;
- World movement/controller ownership;
- local presentation seam;
- Hürth / Alstädten / Cologne fixtures parse;
- selftest covers scene/facade/support/save-reload.

## Browser

### Run 36198357755
FAIL.

### Run 36198517698
FAIL · browser timeout before target selftest completion.

### Run 36198999279
FAIL · diagnostic captured.

Observed before fail:
- Hürth world boots;
- 700 buildings;
- city layer assertion PASS;
- terrain tile assertion PASS;
- WB2 document assertion PASS;
- 13 semantic states bound PASS;
- pageErrors = 0;
- failed requests = 0.

Fail:
`source-backed clips only (variants labelled)`.

## Not run / blocked by abort

- remaining Hürth assertions after the failing variant-contract assertion;
- Cologne browser assertions;
- accepted WB2 34/34 browser regression in the final run;
- Stage;
- public pages.dev verification;
- Georg r2 review.

## Result

**CURRENT BROWSER GATE = FAIL / STOPPED BY REPAIR BUDGET.**

This does not invalidate the salvaged source work. It blocks promotion until the new contract-reset gate passes.
