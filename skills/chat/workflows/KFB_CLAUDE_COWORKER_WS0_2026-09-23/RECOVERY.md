# KFB Claude Coworker WS0 · Recovery · 2026-09-23

Status: **CURRENT RECOVERY FOR LONG-RUNNING WEB LEAD CHAT**

## Für Georg

Wenn dieser Chat abbricht, reicht dieser eine Einstieg.

Aktuell ist nichts zu rekonstruieren:
- Claude Coworker ist als Review-/Integrationsspur vorbereitet;
- die Kommunikation wurde auf kurze Alltagssprache umgestellt;
- der Hub ist in der Arbeitsfassung auf aktuelle Aufgaben reduziert;
- WorldBuilder, ToolBox, Racer und Travel laufen weiter in ihren eigenen PRs;
- WSA bleibt für später reserviert, wenn wirklich eine aufwendigere lokale/mehrere-Repos-Integration nötig ist.

## Start after context loss

Read, in this order:

1. `skills/chat/START_HERE.md`
2. `skills/chat/HUMAN_READABLE_STATUS.md`
3. `skills/chat/workflows/KFB_CLAUDE_COWORKER_WS0_2026-09-23/START_HERE.md`
4. this `RECOVERY.md`
5. `CURRENT_SPRINTS.md`
6. the current project PR / Return for the one lane being continued.

GitHub state wins over every SHA below.

## Coordination owner

Repository:
`georg-doc/kayfabizarro`

Coworker WS0 branch:
`chatgpt-web/claude-coworker-ws0-onboarding-2026-09-23`

Draft PR:
`#187`

Last WS0 branch head before this Recovery was written:
`5a399bc9282c38c51c95ed33415d1c5572597461`

Important:
`main` has continued moving in parallel. At recovery time it had advanced to:
`dd555d61ef7b6deb813d16270b9ed7d37ea24973`

Therefore:
**do not merge/rebase PR #187 from memory. Refresh main and reconcile deliberately.**

## What WS0 now owns

Only production support:

- code review;
- integration proposals;
- preparation of bounded WSA/Work slices;
- explicitly authorized bounded Coworker implementation;
- Review HTML routing;
- Hub hygiene review;
- plain-language handoff to Georg.

WS0 does not own product runtimes.

## Coworker proof so far

### Review proof

Coworker reviewed WorldBuilder PR #186 in `REVIEW_ONLY`.

Useful result:
- no code blocker found;
- correctly separated static evidence from missing human/browser evidence;
- identified possible mini-menu occlusion;
- identified that host persistence, not `edit-layer.js`, owns Save/Reload;
- review stayed token-light by reading the relevant module + Return/test report instead of a giant combined diff.

Conclusion:
**Coworker review lane is useful enough to continue.**

### Integration-planning proof

Coworker proposed ToolBox adoption of the shared `lib/edit-layer.js`.

Web correction:
do not invent a new transform schema.

Existing shared contract on current main:
`skills/chat/workflows/KFB_INSCENE_EDITOR_MODULE_V1_2026-09-20/START_HERE.md`

Schema:
`kfb.scene-patch.v1`

It already contains:
- object id;
- position;
- rotation;
- scale.

Source interaction origin:
`tools/KFB-ToolBox/_inbox/KayKit_Room_Study_S21/S22_RoomStudy_Handover/docs/EDITOR_LAYER.md`

Mechanism promoted by WorldBuilder PR #186:
`tools/KFB-ToolBox/lib/edit-layer.js`

Current conceptual split:
- `EDITOR_LAYER.md` = interaction origin;
- `lib/edit-layer.js` = shared editor mechanism;
- `kfb.scene-patch.v1` = shared patch/transform contract;
- each host = owns its own persistence.

ToolBox adoption stays conditional on the WorldBuilder R2 human review.

## Current project lanes

### WorldBuilder

PR:
`georg-doc/kayfabizarro#186`

Head at latest check:
`37b7498181dc4c83b9e7a40962922c003bd20cfd`

Plain-language gate:
Georg opens the R2 HTML and checks:
- select;
- move;
- rotate;
- scale;
- save;
- reload;
- values survive;
- small object menu does not obstruct the scene.

No Claude Design integration before that human result.

### ToolBox

PR:
`georg-doc/kayfabizarro#185`

Head:
`2833674b36be707fa4d14c8b532faee78ef3ba28`

Current work:
use complete Resident sets first:
- Goth Girl;
- Orc Warband;
- Animatronic.

Known ChatGPT texture-host issue is already solved for review with the verified adapter; do not reopen that investigation.

After Resident-set proof:
FrizzleBob lineages → full Studio roster → Stage-First integration.

### Racer

Repo:
`georg-doc/KFB-Stunt-Car-Race`

PR:
`#33`

Head:
`308ed3b7e464f573b85d004f13fbf9e0642c818c`

Plain-language gate:
open R3b review and check that the road remains visible in chase view and banking reads correctly.

### Travel

Repo:
`georg-doc/KFB-Travel-Globe`

PR #37:
**HUMAN ACCEPTED · TMB-1E CLOSED · NOT MERGED · NOT PUBLIC**

Accepted head:
`603f2a9e8fb2c8efd1008ed67607cf7a712de0bd`

Accepted direction:
- ActionFigure / Rig_Medium;
- Orc Brute / Rig_Large;
- Warband Orc B / Rig_Legacy;
- 2.0× rider-size candidate;
- existing CardCarrier unchanged.

Next Travel gate:
**TMB-2 · Ground → Flight Double-Space handoff proof.**

No TMB-3 landing yet.

## Hub hygiene

On PR #187 working source:
- TODO cards reduced from 36 to 8;
- four active KFB gates shown first;
- six current Briefings in default Briefings view;
- old briefings remain available only as reference and copied stale prompts carry a warning;
- quick links route to current PRs/router.

No Cloudflare publication was done.

Because project PRs continue moving, Hub cards must be refreshed from current Returns immediately before merge/publication.

## Human-readable rule

Georg-facing answer order:

1. what this means;
2. what Georg should do;
3. what happens next;
4. technical PR/SHA only if useful.

Do not lead with internal status labels.

## Capacity / tool allocation

User reports that Claude currently has a fresh capacity window and may have comparatively more usable volume than ChatGPT/WSA for the coming period.

Treat that as a **planning opportunity, not a guaranteed quota contract**.

Default while Claude capacity is comfortable:
- Claude Design → visual authoring;
- Claude Coworker → code review + bounded integration + Review HTML iteration;
- Web Lead → owner/sequence decisions and reconciliation;
- WSA/Work → only capabilities genuinely unavailable or impractical in Web/Coworker.

Do not spend WSA merely because an integration exists.

## Exactly one next coordination gate

When WorldBuilder R2 human review returns:

- if PASS: prepare the first productive Coworker Slice Card for ToolBox consuming `lib/edit-layer.js` through existing `kfb.scene-patch.v1`;
- if TUNE/FAIL: repair WorldBuilder first; do not spread the unaccepted editor to ToolBox.

No WSA needed for that first ToolBox integration unless a concrete capability gap appears.
