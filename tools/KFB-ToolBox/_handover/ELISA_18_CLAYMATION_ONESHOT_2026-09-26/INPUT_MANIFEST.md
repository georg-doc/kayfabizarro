# Elisa 18 Autonomous One-Shot · Input Manifest

**Date:** 2026-09-26  
**Scope:** frozen inputs for one autonomous birthday-film production run  
**Status:** FRIZZLEBOB JSON PENDING

## Required

### FrizzleBob Studio export

Path:
`profiles/frizzlebob.georg-2026-09-26.json`

Source:
new Studio export created by Georg for the Elisa 18 claymation one-shot.

Use:
run-frozen FrizzleBob baseline for this film.

Promotion:
**NO automatic global promotion.** The one-shot consumes this profile; later promotion requires its own explicit owner decision.

Fallback:
**none.** If the file is absent or invalid, report the exact blocker. Do not silently load an older profile or replacement actor.

## Optional evidence

- `refs/frizzlebob-preview.png` — Studio preview of the same export.
- `notes/export-notes.md` — only if Georg needs to record export-specific notes.

Optional evidence is useful for provenance but is not required to execute if the JSON is complete.

## Existing project-owned inputs

All other actors, assets, rigs, clips, world looks and audio donors are resolved from current GitHub SSOT at execution time through:

- `skills/chat/workflows/KFB_ELISA_18_CLAYMATION_FILM_V1_2026-09-26/SOURCE_MANIFEST.md`
- `skills/chat/workflows/KFB_ELISA_18_CLAYMATION_FILM_V1_2026-09-26/SHOT_PLAN.md`
- `skills/chat/workflows/KFB_ELISA_18_CLAYMATION_FILM_V1_2026-09-26/MASTER_PROMPT.md`

Do not duplicate those libraries into this handover folder.

## Freeze rule

At execution start, record:
- exact FrizzleBob JSON blob SHA;
- exact GitHub branch/head;
- exact donor paths/pins actually consumed.

Those frozen facts belong in the final production Return.
