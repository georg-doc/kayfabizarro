# BRIEF · Work/WSA · import Seed 05 + Seed 06 into accepted Asset Librarian R2

Status: **PREPARED · SUPERSEDES SEED05-ONLY IMPORT IF SITE IS STILL VERSION 4 / 58 BUILT-INS**
Date: 2026-10-07

## Executor
**ChatGPT Work/WSA**

## Outcome

Incrementally add the current Dialogue/Interaction + Narration/Reaction source records to the **existing accepted Asset Librarian R2 Site** without changing the accepted Browser/Viewer UX.

Existing Site:
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`

Existing project:
`appgprj_6ac1afef08148191b62b95f184bf845e`

Last accepted Site source:
`3ea2eab909f266889c8eaa4e5624ddf5970b7d89`

Last accepted version:
**4**

Last proven published built-ins:
**58**
- 53 Etherington official;
- 5 supplementary professional/academic.

Before implementation, read the actual current Site/project state. If a later Seed05-only import has already occurred, reconcile rather than replay it.

## GitHub source truth

### Seed 05 · Dialogue / Interaction
`ETHERINGTON_OFFICIAL_SEED_05_DIALOGUE_INTERACTION.json`

5 records:
- Small Talk
- Speech Patterns
- Tics and Tells
- Interrupt a Scene
- Silence Is Golden

### Seed 06 · Narration / Reaction
`ETHERINGTON_OFFICIAL_SEED_06_NARRATION_REACTION.json`

6 records:
- The 4th Wall
- Failure
- Excuses
- The Group Dynamic
- Local Colour
- Memories

### Expected corpus if Site still has 58 built-ins

Add:
**11 records**

Expected total:
**69 built-ins**
- 64 Etherington official;
- 5 supplementary professional/academic.

All IDs/URLs must remain unique.

## New semantic lanes

Seed 05:
- Dialogue Rhythm
- Character Voice
- Nonverbal Behavior
- Conversation Flow

Seed 06:
- Meta Narration
- Failure Reaction
- Group Reaction
- Memory Callback
- Local Voice

## Preserve absolutely

- accepted R2 Gallery/Viewer;
- complete tutorial-board navigation and zoom;
- all existing reference visuals/boards;
- browser-local Cards/Sets/Notes/Principles;
- source isolation/export;
- Assets;
- Motions;
- Saved Sets;
- Intake;
- mobile viewer;
- 3D previews;
- current Site project identity.

No redesign.

## Import behavior

Where a new official Etherington source resolves to existing tutorial-board transport:
- use the existing resolver;
- preserve source provenance.

If a board cannot be resolved:
- keep metadata/source record usable;
- do not invent or substitute a visual;
- keep source-inspection status honest.

Seed 06 is not a second Caption/Bubble source owner:
- Caption Boxes remains canonical in Seed 04;
- Speech Bubbles remains canonical in Seed 04.

## Relevant consumer docs

These are GitHub authoring/research docs only; they are **not extra Site built-ins**:

- `KFB_DIALOGUE_AUTHORING_RULES_ETHERINGTON_NIE_01_2026-10-07.md`
- `KFB_CHATTERBOX_AUTHORING_RULES_01.json`
- `KFB_HISTORIAN_WORLD_AS_TOY_NIE_OVERWORLD_DONOR_AUDIT_2026-10-07.md`
- `reference-packs/curated/kfb-dialogue-interaction-01/`
- `reference-packs/curated/kfb-narration-reaction-01/`

## Tests

Done when:

1. current pre-import Site count is recorded;
2. Seed 05 has no duplicate ID/URL before insert;
3. Seed 06 has no duplicate ID/URL before insert;
4. if starting from 58, final built-ins = **69**;
5. all 11 new records searchable;
6. old built-ins unchanged;
7. local persistence survives;
8. R2 Viewer behavior unchanged;
9. Assets/Motions/Saved Sets/Intake/3D regressions pass;
10. page warnings/errors = 0;
11. same Site/project updated in place;
12. exact Site version/deployment/source recorded after publication.

## Protected boundary

No:
- second Site;
- Browser/Viewer redesign;
- new Registry;
- Open World runtime write;
- ChatterBox runtime write;
- Historian runtime implementation;
- Claude Design job;
- merge / Live promotion.

## Persistence

After successful Site update:
- persist exact project/source/version/deployment in the Style Reference Return/PR;
- record actual pre/post built-in counts;
- update Production Control milestone;
- do not update Production Hub unless this changes a canonical human route or gate.

## One next gate

After source import:
**CONTINUE SOURCE CURATION / AUTHORING PREP. Runtime consumption remains HOLD until exact Coworker intake + Architecture Freeze.**
