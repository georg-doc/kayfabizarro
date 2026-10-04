# Consumer · Combat Arena ChatGPT Web

Status: CURRENT CONSUMER SYNC
Updated: 2026-09-13

Project implementation SSOT: `georg-doc/KFB-Combat-Arena`
Local chat entry: `ChatGPT_web/START_HERE.md`
Local project entry: `WSA_START.md`

## Sync contract

At session start:

1. read central `skills/chat/START_HERE.md`;
2. read `REGISTRY.json` and `SYNC_PROTOCOL.md`;
3. read Combat `WSA_START.md` and `ChatGPT_web/START_HERE.md`;
4. verify Combat current HEAD/open PR relevant to the task;
5. apply only shared-rule deltas since the recorded sync cursor.

Combat remains its own implementation SSOT. Shared KFB skills/SOP do not turn Travel, Stunt or any tool repo into Combat owners.

## Current local work model

Combat Web may review, measure and prepare bounded handoffs. WSA/Astra remains implementation/integration lead where the Combat project contract says so.

The current Combat task/slice must always be read from Combat's own `WSA_START.md` and current handover/Return. Do not hard-code a stale C0/C1/A2 assumption into this central consumer node.

## Skills

Load only when relevant. Examples:

- shared production/evidence rules through this router;
- `skills/kfb-cartoon-animation_v2.md` for motion/animation/VFX work;
- Asset Librarian for discovery, while Combat remains responsible for final asset suitability.

## Return rule

Combat results belong in the Combat repo (`_inbox/`, `_handover/`, Return or project docs as contracted). Only cross-project routing/SOP decisions come back to `skills/chat/`.
