# Adapter · Claude Design

## Mandatory KFB bootstrap

Before any KFB Claude Design production slice, read the current GitHub versions of:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. the named project SSOT, current Return/Recovery and the exact slice briefing

GitHub state overrides any copied prompt, prior Claude chat or stale session context.

Do **not** maintain a second full KFB rule copy inside Claude. The files above are the shared current rule source for ChatGPT, Claude Design and other executors.

A Claude Design briefing only needs to name the outcome, owner, read-first project source, protected boundary and done condition, then reference these shared rules.

Apply after `skills/chat/PRODUCTION_SOP.md`.

- Claude Design is an authoring, exploration and measurement environment unless a project explicitly grants implementation ownership.
- Do not replace a project implementation SSOT with a Design artifact.
- Prefer using the current tool node and its existing modules over reconstructing them in a new artifact.
- Exports must name source revision, inputs, outputs, measured values and unresolved visual gates.
- Separate design proposal from measured configuration.
- When working on actor/rig/look, read the current FrankenStein Studio node first.
- When working on motion/animation, also load `skills/kfb-cartoon-animation/SKILL.md` unless the registry supersedes it.
- Return configuration/manifests/measurements that runtime owners can consume. Do not silently duplicate runtime movement, physics or world ownership.

- For a bounded independent web/design slice, apply `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`; return the candidate plus additive changelog, exact source state, real checks, visible proof and the next owner gate.
- If two consecutive repair passes do not improve the same measured or visible gate, stop repairing the **smallest failing seam**. Preserve/export that seam with `skills/chat/templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md`. Quarantine/defer it and continue the parent outcome unless the Production Guard proves that seam blocks the named outcome.
- A screenshot-only handoff is insufficient after a failed pass. Preserve the failed code and mark it `ARCHIVED_FAILED_CANDIDATE`; do not polish history or silently rebuild the same foundation.


## Export routing · current

For a full Claude Design handoff/session cut, use:

`skills/session_ZIP_v1.md`

Current version: **v1.1 · self-contained**.

Trigger:
- `/session-zip` when available;
- `Session Cut ZIP`;
- or paste/link the full `session_ZIP_v1.md` into Claude Design and ask to execute it.

**The shortcut is optional.** If Claude Design does not expose a registered slash command, the pasted file/instructions plus export request are themselves the trigger and explicit export authorization. Do not search for an unavailable project-local skill and do not ask Georg for a second confirmation.

The file itself contains the complete export contract, including closure analysis, asset/dependency inventory, Voice Input ambiguity handling, mandatory handoff docs, manifest/checksums, `zipcheck.py`, Clean Run and Failure Recovery.

`skills/session-export_v1.md` remains the slim session-delta export.

After two non-improving repair passes on the same gate, apply `skills/chat/templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md` to the smallest failing seam only; do not infer a parent-slice stop without Production Guard outcome-blockage proof.
