# START HERE · Billboard B2b-P1 Failure Recovery

Status: **ARCHIVED_FAILED_CANDIDATE**
Date: 2026-09-26
Owner: **KFB ToolBox / Billboard Media Residency**
Frozen candidate: `2348c069a99b57149d6a2685496b5ce1b40ebe1a`
PR: **#211**

This export freezes the current editable B2b-P1 candidate after the browser repair limit. It is recovery evidence, not a Stage candidate.

## Source
Editable source remains directly in the parent folder:
- `../b2b-boot.js`
- `../collage-engine.js`
- `../collage-provenance.json`
- `../SOURCE.json`
- protected B2a copies and dependencies beside them
- `../assets/cc0/`

## Working parts
- donor isolation;
- CanvasTexture collage render;
- deterministic sequence;
- no-repeat rules;
- 4 recipes / 4 grades;
- FLAT_COLLAGE / LIVING_SCREEN;
- local CC0 pool and provenance;
- CARD/COVER/SLOGAN/VIDEO INLINE retention;
- B2a rear-side iframe cull.

## Failure evidence
Final browser run: **39/40**.
Only red check: one queued interval callback crossed the switch boundary (725→726); no further tick occurred during the following 1.2 s and timer/running flags were false.

## Stop
No third repair pass in this slice.
No B2b-P1 Stage publish.
No B2c/B3/C1.

## Exactly one next gate
Isolate lifecycle/quiescence semantics without the full billboard scene:
1. start a deterministic collage ticker;
2. switch mode;
3. sample after one event-loop turn and again after ≥1 s;
4. decide the contract: strict zero queued callback vs post-boundary quiescence;
5. only if strict zero is required, prove a generation-token/cancellation guard in isolation.
