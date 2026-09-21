# Chat → GitHub → KFB Stage Workflow

Status: **CURRENT BINDING WORKFLOW v1.0**  
Date: 2026-09-19  
Owner: Georg / KFB  
Applies to: ChatGPT Web, Codex/Work, Claude Design and other external LLM production slices

## The short version

A chat is not the archive, GitHub is not the test surface, and a successful commit is not a live result.

`Chat slice → named GitHub branch/PR → verified commit → KFB Cloudflare Stage → KFB Hub link → Georg review → deliberate Live promotion`

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
