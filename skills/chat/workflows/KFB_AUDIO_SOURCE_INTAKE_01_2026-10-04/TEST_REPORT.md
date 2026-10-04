# KFB AUDIO SOURCE INTAKE 01 · TEST REPORT

**Tested head:** `378d7af459d37627a4d5b2285115ecc92ccfc041`  
**Status:** QA_GREEN

## GitHub Actions

Run `37175035753` / job `111355208659`:

- source/intake validator: PASS;
- JavaScript syntax: PASS;
- browser: **12/12 PASS**;
- artifact: `11293330007`;
- digest: `sha256:6a6c5c8cbe209915e8df7c5264fb9d89d0b88de6c721b3c3ce28fb4bbe632524`.

## Browser proof

1. Site source marker 0.2;
2. 55 catalog tracks;
3. 45 RoadTrip-v2 / 15 stem-family stats;
4. Rain percussion · Beetle / Ring catalog card;
5. 15-item stem filter;
6. Source Lab visible;
7. 17 ElevenLabs candidates;
8. candidate count/status text;
9. HUMAN_TUNE filter works;
10. Rain bank remains SOURCE_REQUIRED;
11. zero page errors;
12. zero local HTTP errors.

## Repair history

- first run counted Source Lab cards together with Catalog cards in the QA selector;
- first repair scoped the test to `#catalogGrid`;
- second run exposed a real Source Lab renderer defect: `querySelector(...).forEach`;
- second repair switched the candidate binding to explicit `document.querySelectorAll(...)`;
- final run passed 12/12.

No further repair loop was required.
