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


## Export routing

For a full Claude Design handoff/session cut requested by Georg, load the current entry:

skills/session_ZIP_v1.md

Current trigger:
- /session-zip
- "Session Cut ZIP"

The explicit trigger is already export authorization: build the Session Cut/ZIP without a second veto prompt. Do not delete or irreversibly clean up without Georg's explicit approval.

The current GitHub entry is intentionally short and points to the full canonical Claude Skills body at `claude/session-zip-SKILL.md` when that project source is available. If the full body is unavailable, follow the GitHub fallback exactly and mark missing canonical export logic honestly; do not reconstruct it from memory.

It complements skills/session-export_v1.md. The generic skill remains the slim session-delta export; /session-zip is the current full runnable handoff/recovery export.

Because Georg often uses voice input, resolve uncertain proper nouns, filenames or asset names from the actual workspace/source/GitHub state or mark VOICE_INPUT_UNCERTAIN. Never substitute a similarly named donor silently.

The older skills/claude-design-session-export_v1.md is superseded history, not the current trigger.

After two failed repair passes on the same gate, also apply the existing failure-recovery template instead of continuing normal repair.
