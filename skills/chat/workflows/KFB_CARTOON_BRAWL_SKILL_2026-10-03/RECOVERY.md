# KFB Cartoon Brawl Skill · Recovery

Status: **CANONICAL_DRAFT_READY · CONSUMER PROOF PENDING**
Date: 2026-10-03
Workflow: `KFB-CARTOON-BRAWL-SKILL-01`

## Owner / source state

- repository: `georg-doc/kayfabizarro`
- owner: KFB shared skill layer
- branch: `chatgpt-web/kfb-cartoon-brawl-skill-01-2026-10-03`
- Draft PR: **#342**
- latest verified pre-Recovery metadata head: `3281758fbe61c3291e3cc42d25f400ba529bf6c3`
- no merge / no Live promotion

On resume, fetch **PR #342 current head first**. GitHub state overrides the hash above if the PR advanced after this Recovery file was written.

## What exists

Canonical-draft skill:

- `skills/kfb-cartoon-brawl_v1.md`

Research:

- `RESEARCH_SOURCE_MATRIX.md`
- `RESEARCH_BLOCK_B_WEAPON_TRANSITIONS.md`

Evidence:

- `TEST_EVIDENCE.md`
- final structured gate: **75/75 PASS**
- 40 unique HTTPS research sources
- 42 source/evidence rows
- 17-section weapon/transition research block

Routing:

- `skills/chat/REGISTRY.json`
- `skills/chat/START_HERE.md`
- `skills/chat/consumers/combat-web-chat.md`
- additive `skills/chat/CHANGELOG.md`

## Protected owners

The skill does not own or replace:

- Combat Arena runtime;
- consumer movement / physics;
- damage / health;
- target selection;
- actor/rig truth;
- attachment/Resident Atlas measurements;
- Stage / Live publication.

Combat Arena remains its own implementation SSOT.

## Reused KFB donor facts

Current Combat CA2 donor evidence includes:

- real Rig_Medium 1H attack source;
- exact authored hand slot;
- swept contact;
- active window;
- AttackLedger;
- non-overlap spacing and forced-contact diagnostics.

These are donor patterns, not universal per-weapon transforms.

The human-rejected Black Knight shield placement remains an owner lesson: correct/promote the attachment in its attachment owner first, then consume it in Combat.

## Stage / Hub

- public Stage: **NOT CREATED**
- reason: shared documentation/skill milestone, no Georg-facing playable/product decision
- KFB Hub action card: **NOT REQUIRED**
- HUB-CTRL / Production Desk remains the generated Hub owner; this slice did not hand-edit it.

Do not manufacture a proxy Stage to "review the skill". The next useful proof is a real consumer implementation.

## Unresolved

- no real consumer has yet executed this skill end-to-end;
- no claim that every existing KFB melee animation passes self-clearance;
- no claim that every weapon has a promoted canonical grip profile;
- Brickfish is a deliberate simplification option, not an adopted universal weapon decision;
- no public/browser gameplay acceptance is claimed.

## Resume order

1. central `skills/chat/START_HERE.md`;
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`;
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`;
4. this `RECOVERY.md`;
5. `START_HERE.md` in this workflow;
6. `skills/kfb-cartoon-brawl_v1.md`;
7. `TEST_EVIDENCE.md`;
8. current PR #342 head;
9. receiving Combat SSOT / current Return before any consumer work.

## Exactly one next gate

**BRAWL-SKILL-CONSUMER-01**

Apply the skill to one real Combat Arena melee consumer and prove, in the existing Combat owners:

1. exact source object / weapon basis;
2. neutral grip;
3. full-clip self-clearance;
4. valid active + swept contact;
5. explicit miss;
6. per-swing target dedupe;
7. one confirmed reaction + impact;
8. clean recovery.

Do not expand to multiple weapon families until that consumer proof is complete.
