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

For a normal full Claude Design handoff/session cut requested by Georg, load:

skills/claude-design-session-export_v1.md

Use it for:
- /claude-export;
- complete Session Cut ZIP;
- handoff to a fresh chat / GitHub Bridge;
- preserving the runnable current candidate before a chat ends.

It complements skills/session-export_v1.md. The generic skill remains the slim session-delta export; the Claude-specific skill produces the closed runnable candidate plus Handover, active Changelog, Source/Donor locks, Test Report, Evidence and NEXT_CHAT.

Because Georg often uses voice input, do not trust uncertain spoken proper nouns, filenames or asset names when preparing the export. Resolve them from the actual workspace/source/GitHub state or mark VOICE_INPUT_UNCERTAIN. Never substitute a similarly named donor silently.

After two failed repair passes on the same gate, also apply the existing failure-recovery template instead of continuing normal repair.
