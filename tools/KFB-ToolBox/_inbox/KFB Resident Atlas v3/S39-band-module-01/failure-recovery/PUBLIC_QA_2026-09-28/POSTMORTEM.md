# POSTMORTEM

## SOURCE
Existing S39/S8 Resident owner; no band rebuild. Public mirror uses byte-identical owner HTML/definition blobs.

## WORKING PARTS
- exact Cloudflare Stage marker + HTTP;
- real S8 runtime boot;
- accepted core actors plus optional extension;
- one module root under one review world;
- baseplate-free contract and support probe;
- exact song blob/BPM/phase;
- Play/Pause;
- drummer strike hold;
- zero failed Stage HTTP assets;
- first public screenshot.

## FAILURE EVIDENCE
- performer exact-equality assertion ignored the optional extension;
- root-name assertion ignored the stable `resident-module:` prefix;
- screenshot #2 timed out after 30 s;
- Hub semantic/link proof was never reached.

## PROVEN CAUSES
1. QA contract mismatch: optional extension was treated as core-array failure.
2. QA contract mismatch: runtime root prefix was omitted from expectation.
3. QA ordering: nonessential screenshot preceded required Hub proof, so its timeout masked the later gate.

## UNKNOWN
Public Hub card state is **UNKNOWN**. Neither attempt reached that check. Screenshot-timeout cause is also UNKNOWN and non-blocking for Resident runtime.

## SALVAGE MAP
| Part | Status | Reason |
|---|---|---|
| S39/S8 runtime | REUSE_CANDIDATE | public boot + runtime behavior observed |
| module definition | REUSE_CANDIDATE | baseplate-free contract intact |
| Stage mirror | REUSE_CANDIDATE | byte-identical owner blobs + HTTP 200 |
| Hub source card | NEEDS_ISOLATED_TEST | source updated; public browser proof not reached |
| public QA workflow | ARCHIVED_FAILED | two bad assertions + bad ordering |
| screenshot #1 | REUSE_CANDIDATE | real public S8 scene |
| drummer pose patch | NEEDS_ISOLATED_TEST | intentionally null until Georg authors it |

## LESSONS
- test core membership as a required subset; test optional members separately;
- assert the runtime contract, not a shortened display id;
- required semantic checks before screenshots;
- do not patch product code to satisfy a harness mismatch.

## NEXT GATE
Fresh slice only: **PUBLIC-QA-RECOVERY-01**.
Correct those two assertions and move Hub semantic proof before screenshots. Run against the unchanged Stage. No Resident runtime/data change.

After that PASS only, return to Georg's drummer hand-pose gate.
