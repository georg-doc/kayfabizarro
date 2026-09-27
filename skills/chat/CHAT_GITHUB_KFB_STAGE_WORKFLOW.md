# Chat → GitHub → KFB Stage Workflow

Status: **CURRENT BINDING WORKFLOW v2.0**
Date: 2026-09-27
Owner: Georg / KFB  
Applies to: ChatGPT Web, Codex/Work, Claude Design and other external LLM production slices

## The short version

A chat is not the archive, GitHub is not the test surface, and a successful commit is not a live result.

`Chat slice → immediate recovery checkpoint → named GitHub branch/PR → verified commit → asynchronous KFB Stage request → deployment receipt → KFB Hub link → Georg review → deliberate Live promotion`

## 1. Recover exact truth

1. Read `skills/chat/START_HERE.md`, this workflow and the named project brief.
2. Fetch the current project default-branch head and any active PR immediately before writing.
3. GitHub state overrides chat memory, screenshots and old handovers.
4. Name one owner, one bounded outcome, one branch and one Stage route.

## 2. Save in small checkpoints

Use small, reviewable checkpoints instead of one large final write:

1. source/runtime change;
2. tests and visible evidence;
3. Return, changelog and Hub/Stage metadata.

For large asset packages, create one complete Git tree/commit from the closed file roster. Do not send hundreds of one-file commits. A timeout never proves success.

### 2A. Early-checkpoint rule

A productive chat must not hold the only copy of useful work while it performs a long build, test, upload, browser run or deployment wait.

Create the first GitHub checkpoint at the earliest of:

- source lock + bounded plan complete;
- first useful implementation state;
- ten minutes after production work starts;
- immediately before any long-running test, asset upload, browser proof or publication call.

The checkpoint must include a compact `RUN_STATE.md` or `RUN_STATE.json` with:

- slice id and owner;
- repository, branch and exact verified head;
- completed phase;
- next operation;
- protected owners/files;
- known blockers and one stop condition.

Later checkpoints remain implementation → evidence → Return/Hub. The early checkpoint is recovery insurance, not a new planning phase.

## 3. Verify every GitHub write

After each write, fetch the exact branch head and check the intended files.

Use these states literally:

- `COMMITTED`: commit object exists.
- `PUSHED`: intended branch points to it.
- `CI_PASS`: named checks passed for that exact head.
- `DEPLOYED`: the publication service reports that revision.
- `PUBLIC_VERIFIED`: the exact public URL was opened and the expected build is visible.
- `HUMAN_ACCEPTED`: Georg accepted the candidate.

If a commit or deployment call times out, report `UNKNOWN`. First inspect the ref/run/deployment; retry only when the intended result is demonstrably absent. Never create a duplicate “just in case” commit.

### 3A. Idempotent write receipt

Every write phase gets one stable checkpoint id, for example `WORLD-M2A-R1-C1`. Record it in the run state and commit message. Recovery compares the branch head plus intended file hashes against that id before retrying.

The only valid timeout recovery sequence is:

`UNKNOWN → fetch ref → compare intended files/hashes → PRESENT or ABSENT → continue or retry once`

Do not rebuild content merely because the client lost the response.

## 4. Publish only to KFB Stage

Human test links use:

- `https://kayfabizarro.pages.dev/kfb-hub/stage/…`
- or another named `kayfabizarro.pages.dev` product route owned by the project.

GitHub Pages, githack, raw-CDN and local `file://` links are not KFB Stage and cannot satisfy a public browser gate. GitHub stays the place for source, PRs and evidence.

The publication bridge must:

1. copy or build the accepted candidate into the designated lean Cloudflare publication branch;
2. update the KFB Hub card in the same publication batch;
3. open the exact Cloudflare URL on desktop or mobile;
4. record the deployed revision and visible result.

A PR, green CI run or GitHub Pages preview does not replace step 3.

### 4B. Publication is a separate durable job

Authoring chats stop after a verified source/evidence checkpoint plus a small publication request. They do not remain alive waiting for Cloudflare.

The single publication owner must be able to run from GitHub without the authoring chat:

1. read exact source head and route from `PUBLISH_REQUEST.json` or equivalent metadata;
2. build/test the closed package;
3. publish once;
4. write `DEPLOYMENT_RECEIPT.json` with source head, publication head, route and result;
5. update Hub metadata only from that receipt.

No chat may use Cloudflare as storage or reconstruct unpublished source from a preview.

## 4A. Local preview before public Stage

For browser/game/3D development, use the current local-preview contract before public publication:

`skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/LOCAL_PREVIEW_FIRST.md`

A localhost preview is a valid development/human-review state:

`LOCAL REVIEW · NOT PUBLIC`

Preferred iteration loop:

`branch → CI → local HTTP preview → Georg review → Web/Claude repair`

Do not use Cloudflare as the normal debug-refresh loop.

Only move to KFB Stage when the candidate is worth shared/public acceptance review.

Local preview does not replace the final public Stage gate when a slice requires `PUBLIC_VERIFIED`.

## 5. Keep Hub and main current

Every new current brief, Stage candidate, human gate or Georg to-do updates:

- the owning project SSOT/Return;
- `georg-doc/kayfabizarro` main routing/briefing state;
- the KFB Hub source;
- the lean Cloudflare publication mirror.

If the public mirror is behind, say so explicitly. Never show an old Hub as current.

## 6. Return packet

Every slice returns:

- repository, branch/PR and exact head;
- changed files and retained owners;
- actual tests and counts;
- direct Cloudflare Stage URL;
- screenshot or visible browser proof;
- `RETURN.md`, `SOURCE.json`, `TEST_REPORT.md` and additive changelog where the brief requires them;
- unresolved items and exactly one next gate.

No automatic merge or Live promotion unless the current project contract and Georg explicitly authorize it.

## 7. CLI and environment rule

Repository-native checks and GitHub Actions are the normal baseline. Optional helper CLIs must be checked once and recorded with path/version.

If `game-dev` is unavailable, do not repeatedly complain and do not block ordinary Web/GitHub/Hub work. Use the repository's own validators and record `GAME_DEV_CLI_UNAVAILABLE · OPTIONAL FALLBACK USED`. Block only a task that truly requires sealed Game Development Studio asset, visual-debug or performance evidence.

## 8. Stop/recovery rule

After two repair attempts without progress on the same gate, freeze the candidate and use the failure-recovery export. Preserve source and evidence; do not spend the remaining quota polishing the wrong fork.

## 8A. Short-chat operating limit

Web/Design chats execute one bounded outcome and normally no more than two GitHub checkpoints. They must not combine broad source census, implementation, full browser matrix, public deployment and Hub consolidation in one fragile turn chain.

When a conversation becomes long or repeatedly stalls, open a fresh continuation from the verified `RUN_STATE` instead of replaying the transcript. GitHub is the continuation surface.

For recurring ChatGPT stalls, test one short session without VPN/proxy/content blockers and, if practical, on another network. OpenAI's troubleshooting guidance also recommends a fresh chat for long conversations and collecting timestamps, console errors and a HAR file when the problem persists across environments. This diagnoses transport/client failure; it does not replace repository recovery.

Detailed playbook: `workflows/KFB_RESILIENT_PRODUCTION_FLOW_2026-09-27/START_HERE.md`.


## 9. Gate proportionality / budget rule

Before spending another repair pass on a defect, apply `GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`.

A failing optional actor, attachment, animation, shader preset, axis assumption or decorative asset does **not** block an MVP unless that exact item is the named acceptance target.

Use:

- `CORE_BLOCKER`
- `ACCEPTANCE_BLOCKER`
- `MINOR / QUARANTINABLE`
- `COSMETIC / DEFERRED`

For minor/quarantinable defects: one diagnostic pass maximum, then quarantine/defer and continue the core loop.

If Georg can resolve an ambiguity in one answer or screenshot, ask instead of spending multiple repair turns.

Work/WSA budget is reserved for cross-repo integration, packaging, deployment and hard runtime seams — not prolonged optional-asset diagnosis or repeated parameter tuning.
