# POSTMORTEM · WORLD-INTEGRATION-r2 browser gate

## SOURCE

Frozen candidate:
`204afd6dbb1285f8cd77807af0db5fdd6e75308d`

## ATTEMPTS

See `ATTEMPT_LOG.md`.

## WORKING PARTS

- World r2 re-homed into existing PR #190 instead of creating a second WorldBuilder.
- accepted `terrain-sculpt.js` remained byte-identical.
- accepted shared `edit-layer.js` remained byte-identical.
- ToolBox profile is immutable and resolves from GitHub Raw.
- Hürth page boots.
- Hürth fixture loads: 700 buildings.
- WorldBuilder terrain tile and scene document checks pass.
- ToolBox semantic states bind: 13 source states, including source-backed sprint.
- no page errors in final browser diagnostic.
- no failed source/module requests in final browser diagnostic.
- static owner/closure suite: 20/20 PASS.

## FAILURE EVIDENCE

Final browser diagnostic stops at:

`WI1 SELFTEST FAIL · source-backed clips only (variants labelled)`

Reported variant rows:
- `walk.fast`
- `backward.fast`
- `strafe.left (strafe.walk)`
- `strafe.right (strafe.walk)`

The selftest abort occurs before later Hürth / Cologne / WB2 regression assertions can execute.

## PROVEN CAUSE

**PROVEN:** selftest contract and new shared-profile semantics disagree.

The existing assertion accepts a variant only when:
`variant == null || /no .* clip/.test(variant)`.

After ToolBox r2 ownership:
- `walk.fast` is explicitly a ToolBox playback-rate variant;
- `backward.fast` is World consumer tuning because no shared role exists yet;
- `strafe.walk` is World consumer tuning because no shared walking-strafe role exists yet.

Those are deliberately labelled variants, but their new truthful labels do not match the old regex.

The final run demonstrates this is not a source-load failure:
- pageErrors = 0;
- failed requests = 0;
- ToolBox profile loaded;
- first five world assertions passed.

## HYPOTHESES

- Later Hürth/Cologne assertions may still pass after the selftest contract is reconciled, but that is **UNKNOWN** because the selftest abort prevents execution.
- Runtime feel/foot-skate remains a human visual question even if automated checks pass.

## SALVAGE

See `SALVAGE_MAP.md`.

## LESSONS LEARNED

1. Error: consumer selftest encoded the old local variant vocabulary.
   Rule: shared profile ownership requires contract tests to validate semantics, not old label prose.
   Early test: test the profile rows directly before launching the long browser suite.

2. Error: browser test waited for 55 PASS lines and initially hid the first failing assertion.
   Rule: browser harness must surface fail-state diagnostics immediately.
   Early test: wait for either PASS target **or** body.dataset.selftest === FAIL and print diagnostic.

3. Error: freshly promoted cross-branch profile was initially fetched through jsDelivr.
   Rule: receiving-owner CI should use immutable GitHub Raw for newly created commit pins; CDN mirrors may be a later publication optimisation.
   Early test: resolve the exact immutable profile URL before browser launch.

## NEXT GATE

**WORLD-R2-CONTRACT-RESET-01**

No runtime change.
First update/rewrite only the selftest contract so it accepts the canonical ToolBox semantics and explicitly distinguishes:
- source-backed semantic roles;
- ToolBox playback variants;
- World-only consumer-control variants.

Then run Static → Hürth → Cologne → WB2 34/34 once.
