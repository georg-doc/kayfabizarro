# AUDIO-STEM-BED-02 · FAILURE RECOVERY · Legacy Hub source sync

**Status:** ARCHIVED_FAILED_CANDIDATE · RUNTIME UNAFFECTED  
**Date:** 2026-10-03  
**Scope:** optional branch-side mirror into legacy `kfb-hub/index.html` only  
**Current public Hub:** `https://kayfabizarro.pages.dev/kfb-hub/stage/hub-ui-v2/` · VERIFIED  
**Current public Stage:** `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-stem-bed-02/` · VERIFIED

## SOURCE

Audio owner:
- repo `georg-doc/kayfabizarro`
- branch `chatgpt-web/audio-stem-bed-02-mood-pool-2026-10-03`
- Draft PR #346
- runtime `kfb-hub/stage/audio-stem-bed-02/`

Current public Hub owner:
- `cloudflare-live:kfb-hub/stage/hub-ui-v2/index.html`
- direct-link source commit `26bb3926bde5a2e1e519409d182a62b654cfba71`

Failed optional mirror target:
- `kfb-hub/index.html` on the PR branch.

## ATTEMPTS

| Attempt | Change | Expected | Actual | Evidence | Decision |
|---|---|---|---|---|---|
| 1 | Insert Mood Pool card at legacy card-array boundary | valid neighboring objects + new direct URL | previous object's closing brace displaced; malformed boundary | `257f9b45d426d989dd8eb34e5857f49c86580e99` | reject |
| 2 | transfer missing brace to the previous boundary and normalize next boundary | valid three-card sequence | next opening brace duplicated (`},{{id:`) | `4700cefdb436ae90fa1f1167fca37bc8727d6259` | reject / stop |

No third repair is attempted.

## WORKING PARTS

- five-donor adaptive runtime: REUSE / PASS;
- 44 runtime stems: REUSE / PASS;
- current public Stage: REUSE / PASS;
- current public `hub-ui-v2`: REUSE / PASS;
- absolute public Hub → Stage URL: REUSE / PASS;
- workflow Recovery/Return/Registry/router metadata: REUSE;
- legacy branch-side Hub insertion algorithm: REJECTED_FOUNDATION.

## FAILURE EVIDENCE

Observed only in the optional legacy branch source:

1. Attempt 1: `...join('\\n'),{id:'audio-stem-bed-02...'}},{id:'world-race...'`
2. Attempt 2: next boundary became `...join(...)},{{id:'world-race...'`

No audio runtime, source stem, Cloudflare Stage, or current public Hub failure was observed.

## PROVEN CAUSES

**PROVEN:** the insertion routine anchored on the shared token `},{id:` but sliced before the closing brace that belonged to the existing object. The inserted object's own closing brace then combined with the untouched original boundary.

**PROVEN:** the second repair operated on brace character positions rather than replacing the complete neighboring object boundary, producing a duplicated opening brace.

## HYPOTHESES

- The legacy `kfb-hub/index.html` should not be treated as the current Hub owner at all; the deployed Hub currently routes through `kfb-hub/stage/hub-ui-v2/`.
- Future source consolidation should be performed from the current Hub owner file, not by string-splicing two independent Hub generations.

These are routing hypotheses until a dedicated Hub-source consolidation slice names the canonical source.

## SALVAGE

| Part | Status | Why | Next owner |
|---|---|---|---|
| AUDIO-STEM-BED-02 runtime | REUSE_CANDIDATE | all audio tests green | Audio baseline |
| public Stage | REUSE_CANDIDATE | exact route 18/18 PASS | Audio baseline |
| public hub-ui-v2 card | REUSE_CANDIDATE | HTTP 200 + card + direct URL verified | KFB Hub |
| legacy Hub file edits in 257f/4700 | ARCHIVED_FAILED | malformed card boundaries | history only |
| string-splice insertion method | REJECTED_FOUNDATION | two boundary failures | do not reuse |

## LESSONS LEARNED

1. Error: inserted relative to a delimiter that includes the previous object's closing brace.  
   Rule: replace or parse the **complete card object**, not a shared `},{id:` boundary.  
   Early test: syntax-check the affected inline script before commit.

2. Error: repaired brace counts by local character surgery.  
   Rule: after one structural failure, recover from a known-good source object and reapply a whole-object transform.  
   Early test: isolate the three adjacent cards and run JS parse/syntax validation.

3. Error: edited a legacy Hub source while the current public Hub has a different owner.  
   Rule: resolve current Hub owner before source synchronization.  
   Early test: compare public route owner + branch source path before editing.

## NEXT GATE

No further repair in this slice.

The AUDIO product gate remains exactly one human decision:

**GEORG_AUDIO_STEM_BED_02** — listen to Neutral / Awe / Sunshine / Grief / Boss on the verified Stage.

Any future legacy/current Hub source consolidation is a separate bounded owner.

## EXPORT

Mode: **GIT_NATIVE**.

A ZIP is not needed to preserve the failed source because every failed and recovered source state is already immutable and editable in Git:
- pre-attempt valid source: `9433a901a83c043b2c5de235d65394facd8f9846`;
- failed attempt 1: `257f9b45d426d989dd8eb34e5857f49c86580e99`;
- failed attempt 2: `4700cefdb436ae90fa1f1167fca37bc8727d6259`;
- manifest: `FAILURE_RECOVERY_EXPORT.json`.

No credentials, private URLs, node_modules or invented results are exported.

## TESTED RESULT

- donor census **14/14 PASS**;
- exact source **100/100 PASS**;
- branch WebAudio **18/18 PASS**;
- combined public Stage **18/18 PASS**;
- public Hub HTTP **200**, card present, exact direct URL present.

## PUBLIC DEPLOYMENT

- Stage source: `cloudflare-live@9d541e79fa7dc10ef5b80ce08b8d3b25d9d1e327`;
- Hub direct URL fix: `cloudflare-live@26bb3926bde5a2e1e519409d182a62b654cfba71`;
- combined public proof: run `37132531736`.

## GEORG ACCEPTANCE

PENDING for the five-donor listening gate.

## OPEN

- signature-theme audio is prompt-only;
- consumer semantic integration remains deferred;
- legacy/current Hub source consolidation is deliberately outside this stopped repair gate.
