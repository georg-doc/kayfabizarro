# TEST REPORT · WORLD-INTEGRATION-r2 failure recovery

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
