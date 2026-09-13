# Project Node · Combat Arena

Status: CURRENT_PROJECT_SSOT
Repository: `georg-doc/KFB-Combat-Arena`
Local entry: `WSA_START.md`
ChatGPT Web entry: `ChatGPT_web/START_HERE.md`

Combat Arena owns its own gameplay/runtime implementation. It may consume actor, animation, asset and shared KFB production references, but those donors do not become Combat movement/combat/world owners.

## Start order

1. central `skills/chat/START_HERE.md` + current shared delta;
2. Combat `WSA_START.md`;
3. current Combat living/contract/handover for the named slice;
4. current Return/Inbox result;
5. current branch/PR/test state.

## Sync

Consumer contract: `skills/chat/consumers/combat-web-chat.md`.
Local sync cursor should live in the Combat repo rather than duplicating central docs.

## Current caution

Do not infer the active Combat slice from this central node. Combat's own current GitHub state is authoritative and may advance independently.
