# TEST PLAN · KFB ChatterBox / Triplet Curator v1

Status: PLANNING

## Static/data

1. `TRIPLET_POOL_SEED_20.json` parses.
2. Exact seed count = 20.
3. Triplet IDs unique = 20.
4. Signature distribution = 4 global + 4 Lorekeeper + 4 Goth Girl + 4 Clown + 4 Witch.
5. Relation set is limited to CATEGORY_SHIFT / ESCALATION / COLLISION / MISFIT / SYNERGY.
6. Curator schema parses.
7. Curator records cannot replace Quote Pool canonical fields.
8. Curator records cannot contain Resident Lean Card dialogue fields.
9. Current Lean Card language owner remains `ChatterBox + shared Triplet pool`.
10. Existing kernel remains external; no copied/forked adapter owner.

## Site/browser

- search/filter;
- review state transition;
- edit + undo/reset to source;
- Web Chat batch import;
- invalid import rejected with useful errors;
- quote-ID lookup;
- unresolved quote visibly blocked from runtime approval;
- pair preview deterministic for same seed;
- SILENCE valid;
- responsive bubble preview;
- Bubble adapter failure quarantinable;
- full export/import reload;
- mobile/narrow layout;
- zero page errors.

## Acceptance fixture

Primary semantic fixture:
Goth Girl × Clown × `forget_utopia#11` The Standing Ovation.

Secondary:
Witch × Clown × `ignore_dystopia#30` The Cortisol Economy.

Regression:
Goth Girl × Witch × `ignore_dystopia#1` The Doomsday Clock.

## Evidence rule

Automated checks prove mechanics/data integrity only.
Georg's PASS/TUNE/FAIL is the editorial usability gate.

No public Stage is required merely to test schema or internal data.
