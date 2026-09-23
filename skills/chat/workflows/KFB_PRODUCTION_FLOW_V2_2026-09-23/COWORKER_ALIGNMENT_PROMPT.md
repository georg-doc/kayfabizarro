# Paste-ready · Claude Coworker Alignment · Production Flow v2

@GitHub

Please do a **PROPOSAL/PROCESS REVIEW ONLY**. Do not implement product code yet.

Read current GitHub versions of:

1. `skills/chat/START_HERE.md`
2. `skills/chat/HUMAN_READABLE_STATUS.md`
3. `skills/chat/workflows/KFB_PRODUCTION_FLOW_V2_2026-09-23/START_HERE.md`
4. `skills/chat/workflows/KFB_PRODUCTION_FLOW_V2_2026-09-23/CLAUDE_COWORKER_ALIGNMENT.md`
5. `skills/chat/workflows/KFB_PRODUCTION_FLOW_V2_2026-09-23/PRODUCTION_PACKET_TEMPLATE.md`
6. `skills/chat/workflows/KFB_PRODUCTION_FLOW_V2_2026-09-23/CURRENT_LANES.md`
7. `skills/chat/workflows/KFB_DESIGN_DONOR_LOCK_V1_2026-09-23/START_HERE.md`
8. `skills/chat/workflows/KFB_DESIGN_DONOR_LOCK_V1_2026-09-23/MEASUREMENT_EVIDENCE_TEMPLATE.md`

GitHub state wins.

## What Georg wants

The old pattern is too fragmented:
- many tiny Web chats;
- many technical micro-approvals;
- Claude Design sometimes rebuilds existing working donors;
- WSA gets too much archaeology/debug work;
- chats hit context limits before a coherent artifact exists.

The new intended pattern is:

**source/donor lock → closed Production Packet → productive Coworker or Claude session → one coherent clickable milestone → Georg review → WSA only if a real capability gap remains**

## Your review

Check whether Production Flow v2 gives you enough information to act productively without:
- rebuilding owners;
- rediscovering sources;
- asking Georg for unnecessary technical approvals;
- escalating ordinary integration to WSA.

Specifically answer:

1. Can Coworker take a Production Packet and implement a bounded integration safely?
2. What information is still missing from the packet template?
3. Are any rules contradictory or likely to create token/process overhead?
4. Which current lane is the best **first productive Coworker integration**, not another review exercise?
5. Which work should instead go to Claude Design?
6. Which current work genuinely needs WSA, if any?

## Important

Do not start implementation.

Do not create another framework.

Do not propose a mega-merge.

Use the existing donors, owners and current PRs.

## Reply to Georg

Start in plain German:

**Für Georg:**
- Does this production model make sense?
- What would Coworker take over?
- What would Claude Design take over?
- What would stay with Web/WSA?

Then give only the technical corrections that actually matter.

No repo write unless Georg/Web explicitly asks after the review.
