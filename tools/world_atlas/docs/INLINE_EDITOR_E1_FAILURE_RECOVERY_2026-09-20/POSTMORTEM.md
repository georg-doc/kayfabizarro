# POSTMORTEM · E1 Browser Proof

## Observed result

Implementation/static work is green: **20/20 PASS**.

The browser acceptance gate remains **NOT TESTED** because both browser attempts failed in their automation harness before a valid E1 PASS/FAIL assertion was obtained.

## Attempt 1 · long-running Chrome command

Run: `35487119077`  
Job: `106015440253`

Green:
- repository checkout;
- local HTTP server;
- page request;
- Chrome startup;
- WebGL rendering was visible in runner logs.

Failure:
- one Chrome process combined `--dump-dom`, screenshot and `--virtual-time-budget=120000`;
- the generator has intentional animation/timer loops;
- Chrome did not terminate;
- outer `timeout 220s` killed the process;
- exit code 124.

Conclusion:
**harness lifecycle failure**. It does not prove editor failure.

## Attempt 2 · CDP polling harness

Run: `35487373804`  
Job: `106016124834`

Green:
- repository checkout;
- local HTTP server;
- Chrome remote-debugging process started.

Failure before application assertion:
- inline Node used `const fs = require('fs')`;
- the same script used top-level `await`;
- Node 22 reported:
  `ERR_AMBIGUOUS_MODULE_SYNTAX`
- therefore no CDP poll of `document.documentElement.dataset.e1Proof` completed.

Conclusion:
**Node module-format harness failure**. It does not prove editor failure.

## What remains valuable

- narrow ownership boundary is explicit and statically verified;
- self-proof route is already present at `?e1proof=1`;
- the self-proof mutates one detail by +0.1 X, emits a patch, rebuilds, and compares restored transform;
- no shared library was prematurely extracted;
- generator structural owners remain untouched.

## What is discarded

- the two browser harness implementations as acceptance evidence;
- any claim that E1 is browser-passed;
- any proposal to continue directly to E2/E3/E4 before E1 proof.

## Pattern error

The test work became more complex than the feature gate.

The next proof should be a tiny QA consumer of the existing `window.__E1_PROOF` / dataset marker, not another editor change.
