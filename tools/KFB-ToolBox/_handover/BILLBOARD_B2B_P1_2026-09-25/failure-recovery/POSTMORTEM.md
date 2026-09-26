# POSTMORTEM · Billboard B2b-P1

## SOURCE
Accepted B2a is the runtime foundation. Gate-1 `drawCollageFace()` / `BillboardContent` is the collage donor. B2b-P1 adds only a deterministic scheduler, curated local assets, recipes/grades and a restrained display treatment.

## ATTEMPTS

| Attempt | Change | Result | Evidence | Decision |
|---|---|---|---|---|
| Initial | B2b-P1 + browser proof | blocked by 2 omitted copied dependencies | run 36165090113 | repair dependency copy only |
| Repair 1 | restore `wd-donors.js` + `wd-registry.js` | 37/37 functional checks; harness Quarter reload timeout after checks | run 36165380783 | repair test exit path only |
| Repair 2 | exit via local SLOGAN | 39/40; 0 page errors; 0 HTTP errors; one in-flight tick | run 36205100427 | STOP / freeze |

## WORKING PARTS
All named visual/media functionality reached browser evidence. Eleven runtime compositions were observed in the final run with deterministic/no-repeat rules intact.

## FAILURE EVIDENCE
Final strict assertion expected the tick counter to be identical before the mode switch and immediately after it. It moved once: `725 → 726`. It then stayed at `726` for the subsequent 1.2 s. Timer and running flags were false.

## PROVEN CAUSES
- Initial fail: missing copied modules caused two local 404s.
- Repair 1 fail: harness invoked another remote/PDF-backed Quarter render after completed checks and hit its timeout.
- Final fail: a callback already queued before/at `clearInterval()` completed once across the mode-switch boundary.

## HYPOTHESES
Whether the last callback is a product defect depends on the desired lifecycle contract. Current evidence proves post-switch quiescence after that callback, but not strict zero callbacks across the synchronous boundary.

## SALVAGE
Keep the entire candidate. Do not revert the CollageEngine, provenance pool, B2a integration or visual treatments based on this lifecycle assertion.

## LESSON
For timer lifecycle gates, define whether the contract measures from the call boundary or from the next event-loop turn before treating one queued callback as a runtime failure.

## NEXT GATE
Isolated lifecycle/quiescence semantics only.
