# Chat → GitHub → KFB Stage Workflow

Status: **CURRENT BINDING WORKFLOW v1.1**  
Date: 2026-09-19  
Owner: Georg / KFB  
Applies to: ChatGPT Web, Codex/Work, Claude Design and other external LLM production slices

## The short version

A chat is not the archive, GitHub is not the test surface, and a successful commit is not a live result.

`Chat slice → named GitHub branch/PR → verified commit → integrate in the real owner surface → [human review only when a real decision is needed] → Stage for meaningful milestones → deliberate Live promotion`

## 1. Recover exact truth

1. Read `skills/chat/START_HERE.md`, this workflow and the named project brief.
2. Fetch the current project default-branch head and any active PR immediately before writing.
3. GitHub state overrides chat memory, screenshots and old handovers.
4. Name one owner, one bounded outcome and one branch. Name a Stage route only when the slice has a meaningful milestone/public review reason; Stage is not mandatory for every technical slice.

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

## 3A. No pseudo-human gates

Apply `PRODUCTIVE_REVIEW_GATE_POLICY.md` before creating any human review surface.

Do not turn technical evidence into a blocking Georg gate merely because a slice produced a measurable result. Ownership matrices, counters, contract tables, isolated diagnostics and state-machine buttons belong in tests/Returns unless they expose a real product decision.

Default to continuing implementation inside the real owner/product surface. A human gate must name the concrete decision Georg can make from the artifact. If that decision is unclear, convert the artifact to internal evidence and continue.

A Georg **PROCEED PASS** closes the current intermediate gate without implying exhaustive acceptance. Do not reopen the same gate before the next productive integration unless a new blocker appears.

## 3B. Persist before replying

When Georg has already authorized GitHub persistence for the slice, **write and verify the durable state before sending a long user-visible handoff**.

This applies especially to:
- Georg PASS / TUNE / FAIL or other acceptance feedback;
- Return / Recovery / changelog closure;
- WSA / Work planning notes;
- current next-gate changes;
- explicit requests to “check this in”, “secure this”, or continue under the standing production workflow.

Do not substitute a paste-ready GitHub note for the actual GitHub write when the connector is available and the requested write is within the authorized owner/branch boundary.

The safe order is:

`user feedback → owner GitHub write → ref/file verification → optional WSA/Hub metadata note → concise chat confirmation`

Reason: a long explanatory/paste-ready response before persistence creates an avoidable failure window. If the chat times out after that response but before the write, the authoritative state is lost or ambiguous.

If a write itself times out, keep the user-facing response minimal while status is `UNKNOWN`; inspect the exact ref/file first. Never spend a separate conversational turn merely drafting text that the same chat is already authorized to persist.

### Continuous checkpoint rule

For authorized production work, **GitHub-first applies throughout the slice, not only at closure**. After every meaningful completed implementation step, evidence/test result, Georg decision, next-gate change or recovery finding:

- write it into the existing owner branch/PR and existing Return/Recovery/WIP/changelog surface;
- fetch the exact branch head and intended file back;
- then continue substantial work or send non-trivial user-visible prose.

The objective is that a timeout may lose chat prose, but not the latest proven production state. Do not create a new status document when the owner already has an appropriate Return/Recovery/WIP location.

At each checkpoint GitHub must be sufficient for a fresh chat to recover: **owner · branch/PR · exact verified head · last proven result · unresolved/deferred items · exactly one current next action/gate**. A fresh chat must never require Georg to reconstruct the previous conversation before continuing.

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

## 4A. Local preview before public Stage

For browser/game/3D development, use the current local-preview contract before public publication:

`skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/LOCAL_PREVIEW_FIRST.md`

A localhost preview is a valid development/human-review state:

`LOCAL REVIEW · NOT PUBLIC`

Preferred iteration loop:

`branch → CI → local HTTP preview → Georg review → Web/Claude repair`

Do not use Cloudflare as the normal debug-refresh loop.

Only move to KFB Stage when the candidate is a meaningful integrated milestone worth shared/public review, or when public/cross-device verification is itself required. Do not publish contract-only diagnostics solely to manufacture an ACCEPT/REJECT.

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
- direct Cloudflare Stage URL when Stage was actually required/published;
- screenshot or visible browser proof when relevant to the named outcome;
- `RETURN.md`, `SOURCE.json`, `TEST_REPORT.md` and additive changelog where the brief requires them;
- unresolved items and exactly one next gate.

No automatic merge or Live promotion unless the current project contract and Georg explicitly authorize it.

## 7. CLI and environment rule

Repository-native checks and GitHub Actions are the normal baseline. Optional helper CLIs must be checked once and recorded with path/version.

If `game-dev` is unavailable, do not repeatedly complain and do not block ordinary Web/GitHub/Hub work. Use the repository's own validators and record `GAME_DEV_CLI_UNAVAILABLE · OPTIONAL FALLBACK USED`. Block only a task that truly requires sealed Game Development Studio asset, visual-debug or performance evidence.

## 8. Stop/recovery rule

After two repair attempts without progress on the same gate, freeze the candidate and use the failure-recovery export. Preserve source and evidence; do not spend the remaining quota polishing the wrong fork.


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


## 10. Human guidance contract · mandatory

A production Return is incomplete if it ends on an abstract gate name that Georg must interpret.

Every user-facing handoff must answer these four questions in plain language near the top:

1. **Who acts next?** Name the executor: ChatGPT Web/GitHub, Coworker/Blender, Claude Design, Georg, or another exact owner.
2. **What happens next?** State the concrete operation, not only the gate label.
3. **Does Georg have to do anything now?** If no, say exactly: **"Du musst jetzt nichts tun."**
4. **What will Georg receive next?** For example: one playable link, one A/B image, one Blender scene, or one short decision question.

If ChatGPT is the next executor and the work is authorized and feasible in the current session, continue the work instead of returning a meta-handoff.

Commit hashes, PR numbers and workflow runs are evidence for the Return, not instructions Georg must decode.

### Site review transport

When Georg explicitly requests a ChatGPT Site, or Cloudflare publication friction would add no value to the current product decision, a Site may be used as the primary **private human review transport**.

Label it:
**SITE REVIEW · NOT PUBLIC STAGE**

Rules:
- GitHub remains source/evidence truth;
- the Site must mirror the exact tested candidate, not rebuild it independently;
- give Georg one direct review action and no deployment/debugging chores;
- do not claim Cloudflare/public verification from a Site review;
- publish to `kayfabizarro.pages.dev` later only when the named milestone actually requires a durable/public KFB Stage.
