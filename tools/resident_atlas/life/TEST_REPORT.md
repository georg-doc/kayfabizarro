# NPC-LIFE-01 · Test Report

Status: **IMPLEMENTATION + DETERMINISTIC CONTRACT TEST PASS · BROWSER/PUBLIC VERIFICATION PENDING**

## Command

`node tools/resident_atlas/life/tests/npc-life-01.test.mjs`

Local execution against the exact implementation content checked into this branch:

**21/21 assertions PASS**

## Covered

- accept chain = `approach → greet → offer → react → accept → leave`;
- decline chain = `approach → greet → offer → react → decline → leave`;
- self-encounter and combat-locked encounter are illegal;
- one active host reserves/releases Resident participants;
- movement progress is emitted by the host, not by animation;
- Toy Soldier offer resolves to a Resident source prop and stays reward-owned;
- Resident without a source offer yields no fabricated offer;
- motion picks only compatible available clip names;
- ChatterBox mapping is stateless and does not speak on approach;
- public semantic vocabulary is exactly seven beats.

## Stage source contract

The review surface imports the existing Resident Atlas actor/clip runtime and exact Resident recipes, loads the ChatterBox phrase source directly, and exposes source-isolate modes before the encounter modes.

Expected review route after publication:

`https://kayfabizarro.pages.dev/kfb-hub/stage/resident/npc-life-01/`

Do not claim browser/public PASS until that exact URL is opened and the expected NPC-LIFE-01 build is visible.
