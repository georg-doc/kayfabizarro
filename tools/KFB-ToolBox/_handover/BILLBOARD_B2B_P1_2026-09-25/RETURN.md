# RETURN · Billboard B2b-P1 · 2026-09-26

Status: **ARCHIVED_FAILED_CANDIDATE · REPAIR LIMIT REACHED · NO STAGE**
Repo: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/billboard-b2b-research-2026-09-25`
Draft PR: **#211**
Frozen runtime/test head: `2348c069a99b57149d6a2685496b5ce1b40ebe1a`

## Outcome
One real `COLLAGE` mode was added to the accepted B2a host by reusing the Gate-1 CanvasTexture collage donor.

Delivered:
- four recipes: HEADLINE_SHOCK / POSTER_STACK / SIGNAL_NOISE / ARCHIVE_FEVER;
- four grades: WARM_DIRTY / COLD_PRINT / ACID_FAIRGROUND / MONO_PAPER;
- deterministic seed + no-repeat memory;
- FLAT_COLLAGE + LIVING_SCREEN;
- six local provenance-tracked Kenney CC0 stills;
- source-object donor isolation page;
- accepted CARD / COVER / VIDEO INLINE / SLOGAN and B2a rear-side fix retained.

## Actual tests
Static: PASS.
- protected B2a copies: 4 byte comparisons PASS;
- contract/provenance: 12/12 PASS;
- boundary: 4/4 PASS;
- syntax: 2/2 PASS;
- scheduler: 124/124 PASS.

Browser attempt history:
1. run 36165090113 · FAIL before donor proof · 2 local 404s for omitted B2a dependencies;
2. run 36165380783 · 37/37 checks · 0 HTTP failures · 10 compositions · harness timeout only on repeated Quarter reload after checks;
3. run 36205100427 · **39/40** · 0 page errors · 0 HTTP failures · 11 compositions.

Final failed assertion:
`COLLAGE ticks stop on exit`
observed `725 → 726 → 726`.
The timer reports stopped and remains quiescent after the one in-flight callback.

## Publication
No B2b-P1 Stage route was published.
Accepted B2a public route remains unchanged:
https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b2a/

## Recovery
`failure-recovery/START_HERE.md`

## Unresolved
Lifecycle semantics at the exact mode-switch boundary are not closed.

## Exactly one next gate
Run an **isolated lifecycle/quiescence semantics test** in a fresh slice. Decide whether one callback already queued before `clearInterval()` is acceptable; if not, prove a generation-token/cancellation seam in isolation before touching visuals.
