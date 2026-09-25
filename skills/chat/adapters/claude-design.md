# Adapter · Claude Design

Apply after `skills/chat/PRODUCTION_SOP.md`.

- Claude Design is an authoring, exploration and measurement environment unless a project explicitly grants implementation ownership.
- Do not replace a project implementation SSOT with a Design artifact.
- Prefer using the current tool node and its existing modules over reconstructing them in a new artifact.
- Exports must name source revision, inputs, outputs, measured values and unresolved visual gates.
- Separate design proposal from measured configuration.
- When working on actor/rig/look, read the current FrankenStein Studio node first.
- When working on motion/animation, also load `skills/kfb-cartoon-animation_v2.md` unless the registry supersedes it.
- Return configuration/manifests/measurements that runtime owners can consume. Do not silently duplicate runtime movement, physics or world ownership.

- For a bounded independent web/design slice, apply `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`; return the candidate plus additive changelog, exact source state, real checks, visible proof and the next owner gate.
- If two consecutive repair passes do not improve the same measured or visible gate, stop the repair loop. Freeze the candidate, apply `skills/chat/templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md`, export the complete editable source/state, and return a post-mortem plus one smaller next gate.
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

After two failed repair passes on the same gate, also apply `skills/chat/templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md`.
